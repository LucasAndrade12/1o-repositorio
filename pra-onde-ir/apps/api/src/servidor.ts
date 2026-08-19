/**
 * Servidor do piloto. Sem framework — `node:http` puro, para que `npm run dev` funcione
 * sempre, em qualquer máquina, sem surpresa de dependência.
 *
 * Endpoints e os achados que endereçam:
 *   POST /api/triagem              — pipeline completo
 *   POST /api/triagem/imediata     — só a camada 1, sem rede (B2, B9)
 *   POST /api/passe                — emissão com segundo fator (C1)
 *   GET  /api/passe/:codigo        — abertura com token ou PIN, rate limit (C1)
 *   POST /api/passe/:codigo/desfecho — contrarreferência (E4)
 *   GET  /api/protocolo            — documentação regenerada do código em execução
 *   GET  /api/painel/*             — painel autenticado (C3, B11, E1, E3)
 *   POST /api/sistema/desligar     — interruptor da unidade (C6)
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes, timingSafeEqual } from 'node:crypto';

import {
  AGRAVANTES,
  AVISO_DECISAO_AUTOMATIZADA,
  BLOCOS_AGRAVANTES,
  BLOCO_SEGURANCA,
  CRITERIOS,
  DESTINOS,
  FASES,
  FASE_PILOTO,
  GRADE_QUEIXAS,
  HISTORICO_VERSOES,
  MODULO_ARBOVIROSE,
  PERGUNTA_CONFIRMACAO_BANDEIRA,
  PERGUNTA_DESLOCAMENTO,
  PERGUNTA_PARA_QUEM,
  PROTOCOLO_META,
  ROTEIROS_SENSIVEIS,
  SAFETY_NETTING,
  UNIDADES,
  VERSAO_PROTOCOLO,
  criteriosPendentesDeAssinatura,
  desligarSistema,
  estadoSistema,
  religarSistema,
} from '@pra-onde-ir/protocolo';
import { triagemImediata, triar, type EntradaTriagem } from '@pra-onde-ir/motor';
import { criarCamada2, MODELO, VERSAO_MODELO } from '@pra-onde-ir/ia';
import {
  CRITERIOS_DE_ENCERRAMENTO,
  RETENCAO,
  exportarAnalitico,
  montarPainel,
  repositorio,
  verificarKAnonimato,
} from '@pra-onde-ir/registro';
import {
  ESPACO_DE_CODIGOS,
  VALIDADE_HORAS,
  abrirPasse,
  buscarPasse,
  emitirPasse,
  listarPasses,
  registrarDesfecho,
} from '@pra-onde-ir/passe';

import { semearDadosDemonstracao } from './seed.js';

const RAIZ_WEB = fileURLToPath(new URL('../../web/publico/', import.meta.url));
const PORTA = Number(process.env.PORT ?? 3000);
const camada2 = criarCamada2({ verificacaoAssimetrica: true });

// ─────────────────────────────────────────────────────────────────────────────
// C3 — controle de acesso do painel.
//
// "'Rede interna' em uma UBS é um controle frágil: rede compartilhada, senha de Wi-Fi
//  difundida, equipamentos de terceiros. E o conteúdo do painel é dado de saúde."
//
// Mínimo viável antes do primeiro paciente real: autenticação POR USUÁRIO (não senha única
// compartilhada), sessão com expiração, registro de acesso, e restrição de rede como camada
// ADICIONAL — nunca como única.
// ─────────────────────────────────────────────────────────────────────────────

interface Usuario {
  login: string;
  nome: string;
  papel: 'enfermeira' | 'retaguarda' | 'recepcao' | 'gestao';
  senha: string;
}

/** Usuários de demonstração. Em produção: diretório do município, com senha forte. */
const USUARIOS: Usuario[] = [
  { login: 'enfermeira', nome: 'Enfermeira do acolhimento', papel: 'enfermeira', senha: 'piloto2026' },
  { login: 'retaguarda', nome: 'Retaguarda médica', papel: 'retaguarda', senha: 'piloto2026' },
  { login: 'gestao', nome: 'Gestão / Secretaria', papel: 'gestao', senha: 'piloto2026' },
];

const SESSAO_MINUTOS = 30;
const sessoes = new Map<string, { usuario: Usuario; expiraEm: number }>();

function autenticar(login: string, senha: string): string | null {
  const u = USUARIOS.find((x) => x.login === login);
  if (!u) return null;
  const a = Buffer.from(senha.padEnd(64).slice(0, 64));
  const b = Buffer.from(u.senha.padEnd(64).slice(0, 64));
  if (!timingSafeEqual(a, b)) return null;
  const token = randomBytes(24).toString('base64url');
  sessoes.set(token, { usuario: u, expiraEm: Date.now() + SESSAO_MINUTOS * 60_000 });
  repositorio.auditar({ tipo: 'acesso_painel', referencia: 'login', ator: u.login });
  return token;
}

function sessaoDe(req: IncomingMessage): Usuario | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return null;
  const s = sessoes.get(auth.slice(7));
  if (!s) return null;
  if (s.expiraEm < Date.now()) {
    sessoes.delete(auth.slice(7));
    return null;
  }
  // Sessão deslizante enquanto em uso.
  s.expiraEm = Date.now() + SESSAO_MINUTOS * 60_000;
  return s.usuario;
}

// ─────────────────────────────────────────────────────────────────────────────

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  const caminho = url.pathname;

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');

  try {
    if (caminho.startsWith('/api/')) {
      await rotearApi(req, res, url);
      return;
    }
    await servirEstatico(res, caminho);
  } catch (erro) {
    json(res, 500, { erro: String(erro) });
  }
});

async function rotearApi(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  const p = url.pathname;
  const metodo = req.method ?? 'GET';

  // C6 — interruptor de desligamento. O sistema recusa triagens quando desligado.
  if (!estadoSistema.ativo && p.startsWith('/api/triagem')) {
    return json(res, 503, {
      erro: 'sistema_desligado',
      mensagem:
        'O sistema foi desligado pela unidade. Procure atendimento diretamente na UBS ou, ' +
        'em caso de emergência, ligue 192.',
      desligadoEm: estadoSistema.desligadoEm,
      motivo: estadoSistema.motivo,
    });
  }

  // ── Triagem ───────────────────────────────────────────────────────────
  if (p === '/api/triagem/imediata' && metodo === 'POST') {
    const corpo = await lerJson<EntradaTriagem>(req);
    const r = triagemImediata(normalizarEntrada(corpo));
    return json(res, 200, {
      ...r,
      perguntaConfirmacao: r.aguardandoConfirmacao ? PERGUNTA_CONFIRMACAO_BANDEIRA : null,
    });
  }

  if (p === '/api/triagem' && metodo === 'POST') {
    const corpo = await lerJson<EntradaTriagem & { bairro?: string; microarea?: string; equipe?: string }>(req);
    const entrada = normalizarEntrada(corpo);
    const t = await triar(entrada, camada2);

    const registro = repositorio.registrar(t, entrada.relato, {
      ...(corpo.bairro ? { bairro: corpo.bairro } : {}),
      ...(corpo.microarea ? { microarea: corpo.microarea } : {}),
      ...(corpo.equipe ? { equipe: corpo.equipe } : {}),
      ...(entrada.paciente.faixaEtaria ? { faixaEtaria: entrada.paciente.faixaEtaria } : {}),
      ...(entrada.paciente.sexo ? { sexo: entrada.paciente.sexo } : {}),
    });

    const fase = FASES[FASE_PILOTO] ?? FASES.demonstracao;

    return json(res, 200, {
      id: registro.id,
      // E2 — em fase sombra, tudo é medido e nada é mostrado. É configuração, não código.
      ...(fase.mostraResultadoAoPaciente
        ? {
            nivel: t.nivel,
            roteamento: t.roteamento,
            safetyNetting: t.safetyNetting,
            primeirosMinutos: t.primeirosMinutos,
          }
        : {
            fasesombra: true,
            mensagem:
              'Fase sombra: sua resposta foi registrada para avaliação do sistema. ' +
              'Procure o acolhimento da unidade normalmente.',
          }),
      curtoCircuito: t.curtoCircuito,
      aguardandoConfirmacao: t.aguardandoConfirmacao,
      perguntaConfirmacao: t.perguntaConfirmacao ?? null,
      roteiroPendente: t.roteiroPendente ?? null,
      blocoSegurancaFoiPrincipal: t.blocoSegurancaFoiPrincipal,
      naoReconhecido: t.classificacao.naoReconhecido,
      explicacao: t.classificacao.explicacao,
      camada1: {
        criteriosAcionados: t.camada1.criteriosAcionados,
        descartes: t.camada1.acertos.filter((a) => a.descartadoPor),
        regionalismos: t.camada1.regionalismos,
        injecaoDetectada: t.camada1.injecaoDetectada,
        sujeito: t.camada1.sujeito,
      },
      modo: t.modo,
      versoes: t.versoes,
      avisoLGPD: t.avisoLGPD,
      fase: { id: FASE_PILOTO, ...fase },
    });
  }

  // ── Passe (C1, E4) ────────────────────────────────────────────────────
  if (p === '/api/passe' && metodo === 'POST') {
    const corpo = await lerJson<{ triagemId: string; pin?: string }>(req);
    const reg = repositorio.buscar(corpo.triagemId);
    if (!reg) return json(res, 404, { erro: 'triagem_nao_encontrada' });

    const { passe, linkCompleto } = emitirPasse({
      triagemId: reg.id,
      nivel: reg.nivel,
      destino: reg.destino,
      resumo: reg.resumo,
      criterios: reg.criterios,
      modo: reg.modo,
      versoes: reg.versoes as unknown as Record<string, string>,
      ...(corpo.pin ? { pin: corpo.pin } : {}),
    });

    return json(res, 200, {
      codigo: passe.codigo,
      linkCompleto,
      expiraEm: passe.expiraEm,
      validadeHoras: VALIDADE_HORAS,
      exigeSegundoFator: true,
      temPin: passe.pinHash != null,
      aviso:
        'O código sozinho não abre o passe. É preciso o PIN escolhido por você, ou o link ' +
        'completo do QR Code.',
    });
  }

  const mPasse = p.match(/^\/api\/passe\/([A-Za-z0-9]+)$/);
  if (mPasse && metodo === 'GET') {
    const origem = ipDe(req);
    const r = abrirPasse(
      mPasse[1]!,
      { ...(url.searchParams.get('t') ? { token: url.searchParams.get('t')! } : {}),
        ...(url.searchParams.get('pin') ? { pin: url.searchParams.get('pin')! } : {}) },
      origem,
    );
    if (!r.ok) {
      return json(res, r.motivo === 'bloqueado' ? 429 : 403, {
        erro: r.motivo,
        esperarMs: r.esperarMs ?? 0,
        mensagem: mensagemDeFalha(r.motivo),
      });
    }
    const { token, pinHash, ...publico } = r.passe;
    return json(res, 200, publico);
  }

  const mDesfecho = p.match(/^\/api\/passe\/([A-Za-z0-9]+)\/desfecho$/);
  if (mDesfecho && metodo === 'POST') {
    const u = sessaoDe(req);
    if (!u) return json(res, 401, { erro: 'nao_autenticado' });
    const corpo = await lerJson<{ tipo: 'atendido' | 'redirecionado' | 'nao_compareceu'; nivel?: never }>(req);
    const ok = registrarDesfecho(mDesfecho[1]!, corpo.tipo, u.login, corpo.nivel);
    return json(res, ok ? 200 : 404, { ok });
  }

  // ── Protocolo — regenerado a partir do código em execução ─────────────
  if (p === '/api/protocolo' && metodo === 'GET') {
    const pendentes = criteriosPendentesDeAssinatura();
    return json(res, 200, {
      meta: PROTOCOLO_META,
      versao: VERSAO_PROTOCOLO,
      historico: HISTORICO_VERSOES,
      totais: {
        criterios: CRITERIOS.length,
        agravantes: AGRAVANTES.length,
        destinos: DESTINOS.length,
        unidades: UNIDADES.length,
        perguntasBlocoSeguranca: BLOCO_SEGURANCA.length,
        roteirosSensiveis: ROTEIROS_SENSIVEIS.length,
      },
      assinaturaClinica: {
        pendentes: pendentes.length,
        total: CRITERIOS.length,
        aviso: PROTOCOLO_META.aviso,
        idsPendentes: pendentes.map((c) => c.id),
      },
      criterios: CRITERIOS,
      agravantes: AGRAVANTES,
      destinos: DESTINOS,
      unidades: UNIDADES,
      blocoSeguranca: BLOCO_SEGURANCA,
      roteirosSensiveis: ROTEIROS_SENSIVEIS,
      safetyNetting: SAFETY_NETTING,
      moduloArbovirose: MODULO_ARBOVIROSE,
      camadaIA: { modelo: MODELO, versaoModelo: VERSAO_MODELO },
      retencao: RETENCAO,
      criteriosDeEncerramento: CRITERIOS_DE_ENCERRAMENTO,
      fase: { id: FASE_PILOTO, ...(FASES[FASE_PILOTO] ?? FASES.demonstracao) },
      passe: { espacoDeCodigos: ESPACO_DE_CODIGOS, validadeHoras: VALIDADE_HORAS },
      avisoDecisaoAutomatizada: AVISO_DECISAO_AUTOMATIZADA,
    });
  }

  /** Conteúdo que o PWA embarca para funcionar offline (B9). */
  if (p === '/api/protocolo/offline' && metodo === 'GET') {
    return json(res, 200, {
      versao: VERSAO_PROTOCOLO,
      criterios: CRITERIOS.map((c) => ({
        id: c.id, titulo: c.titulo, nivel: c.nivel, tipoQueixa: c.tipoQueixa,
        comoAPessoaDescreve: c.comoAPessoaDescreve, irreversivel: c.irreversivel ?? false,
        primeirosMinutos: c.primeirosMinutos ?? [],
      })),
      blocoSeguranca: BLOCO_SEGURANCA,
      gradeQueixas: GRADE_QUEIXAS,
      blocosAgravantes: BLOCOS_AGRAVANTES,
      agravantes: AGRAVANTES.map((a) => ({ id: a.id, rotulo: a.rotulo, bloco: a.bloco })),
      perguntaParaQuem: PERGUNTA_PARA_QUEM,
      perguntaDeslocamento: PERGUNTA_DESLOCAMENTO,
      perguntaConfirmacao: PERGUNTA_CONFIRMACAO_BANDEIRA,
      safetyNetting: SAFETY_NETTING,
      unidades: UNIDADES,
      destinos: DESTINOS,
      roteirosSensiveis: ROTEIROS_SENSIVEIS,
      telefones: { samu: '192', cvv: '188', policia: '190', mulher: '180', bombeiros: '193' },
      avisoLGPD: AVISO_DECISAO_AUTOMATIZADA,
    });
  }

  // ── Autenticação (C3) ─────────────────────────────────────────────────
  if (p === '/api/login' && metodo === 'POST') {
    const { login, senha } = await lerJson<{ login: string; senha: string }>(req);
    const token = autenticar(login ?? '', senha ?? '');
    if (!token) return json(res, 401, { erro: 'credenciais_invalidas' });
    const u = USUARIOS.find((x) => x.login === login)!;
    return json(res, 200, {
      token,
      usuario: { login: u.login, nome: u.nome, papel: u.papel },
      expiraEmMinutos: SESSAO_MINUTOS,
    });
  }

  // ── Painel (C3, B11, E1, E3) ──────────────────────────────────────────
  if (p.startsWith('/api/painel/')) {
    const u = sessaoDe(req);
    if (!u) return json(res, 401, { erro: 'nao_autenticado' });

    if (p === '/api/painel/fila' && metodo === 'GET') {
      return json(res, 200, {
        registros: repositorio.listarOperacional().slice(-100).reverse(),
        pendentesDeAssinatura: criteriosPendentesDeAssinatura().length,
        totalCriterios: CRITERIOS.length,
      });
    }

    if (p === '/api/painel/indicadores' && metodo === 'GET') {
      return json(res, 200, {
        ...montarPainel(repositorio.listarAnalitico()),
        criteriosDeEncerramento: CRITERIOS_DE_ENCERRAMENTO,
        fase: { id: FASE_PILOTO, ...(FASES[FASE_PILOTO] ?? FASES.demonstracao) },
      });
    }

    if (p === '/api/painel/curadoria' && metodo === 'GET') {
      return json(res, 200, { fila: repositorio.filaCuradoria(), criterios: CRITERIOS.map((c) => ({ id: c.id, titulo: c.titulo, nivel: c.nivel })) });
    }

    if (p === '/api/painel/curadoria' && metodo === 'POST') {
      const c = await lerJson<{ id: string; decisao: 'criterio_existente' | 'criterio_novo' | 'fora_de_escopo'; criterioSugerido?: string; observacao?: string }>(req);
      const ok = repositorio.curar(c.id, c.decisao, u.login, c.criterioSugerido, c.observacao);
      return json(res, ok ? 200 : 404, { ok });
    }

    if (p === '/api/painel/reclassificar' && metodo === 'POST') {
      const c = await lerJson<{ id: string; nivel: 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul'; motivo?: string }>(req);
      const ok = repositorio.reclassificar(c.id, c.nivel, u.login, c.motivo);
      return json(res, ok ? 200 : 404, { ok });
    }

    if (p === '/api/painel/auditoria' && metodo === 'GET') {
      return json(res, 200, { eventos: repositorio.listarAuditoria().slice(-200).reverse() });
    }

    if (p === '/api/painel/passes' && metodo === 'GET') {
      return json(res, 200, {
        passes: listarPasses().map(({ token, pinHash, ...resto }) => ({
          ...resto, temPin: pinHash != null,
        })),
      });
    }

    if (p === '/api/painel/exportar' && metodo === 'GET') {
      // C2 — k-anonimato ANTES de exportar qualquer relatório.
      const r = exportarAnalitico(repositorio.listarAnalitico());
      return json(res, r.ok ? 200 : 422, r);
    }

    if (p === '/api/painel/k-anonimato' && metodo === 'GET') {
      return json(res, 200, verificarKAnonimato(repositorio.listarAnalitico()));
    }

    return json(res, 404, { erro: 'rota_desconhecida' });
  }

  // ── C6 — interruptor de desligamento acessível à unidade ──────────────
  if (p === '/api/sistema/desligar' && metodo === 'POST') {
    const u = sessaoDe(req);
    if (!u) return json(res, 401, { erro: 'nao_autenticado' });
    const { motivo } = await lerJson<{ motivo: string }>(req);
    desligarSistema(u.login, motivo ?? 'não informado');
    repositorio.auditar({ tipo: 'kill_switch', referencia: 'desligar', ator: u.login, detalhe: motivo });
    return json(res, 200, { ...estadoSistema });
  }

  if (p === '/api/sistema/religar' && metodo === 'POST') {
    const u = sessaoDe(req);
    if (!u) return json(res, 401, { erro: 'nao_autenticado' });
    religarSistema(u.login);
    repositorio.auditar({ tipo: 'kill_switch', referencia: 'religar', ator: u.login });
    return json(res, 200, { ...estadoSistema });
  }

  if (p === '/api/sistema' && metodo === 'GET') {
    return json(res, 200, {
      ...estadoSistema,
      fase: { id: FASE_PILOTO, ...(FASES[FASE_PILOTO] ?? FASES.demonstracao) },
      versaoProtocolo: VERSAO_PROTOCOLO,
      modoIA: process.env.ANTHROPIC_API_KEY ? 'ia' : 'degradado',
      modelo: MODELO,
    });
  }

  json(res, 404, { erro: 'rota_desconhecida' });
}

function normalizarEntrada(corpo: Partial<EntradaTriagem>): EntradaTriagem {
  return {
    relato: String(corpo.relato ?? ''),
    paraQuem: corpo.paraQuem === 'terceiro' ? 'terceiro' : 'proprio',
    paciente: {
      agravantes: Array.isArray(corpo.paciente?.agravantes) ? corpo.paciente.agravantes : [],
      ...(corpo.paciente?.idade != null ? { idade: Number(corpo.paciente.idade) } : {}),
      ...(corpo.paciente?.faixaEtaria ? { faixaEtaria: corpo.paciente.faixaEtaria } : {}),
      ...(corpo.paciente?.sexo ? { sexo: corpo.paciente.sexo } : {}),
      ...(corpo.paciente?.gestante ? { gestante: corpo.paciente.gestante } : {}),
      ...(corpo.paciente?.semDeslocamento ? { semDeslocamento: true } : {}),
      ...(corpo.paciente?.inicioMenos24h ? { inicioMenos24h: true } : {}),
      ...(corpo.paciente?.sinaisDeAlarme ? { sinaisDeAlarme: corpo.paciente.sinaisDeAlarme } : {}),
    },
    ...(corpo.respostasBlocoSeguranca ? { respostasBlocoSeguranca: corpo.respostasBlocoSeguranca } : {}),
    ...(corpo.confirmouBandeira !== undefined ? { confirmouBandeira: corpo.confirmouBandeira } : {}),
    ...(corpo.respostasRoteiro ? { respostasRoteiro: corpo.respostasRoteiro } : {}),
  };
}

function mensagemDeFalha(motivo: string): string {
  switch (motivo) {
    case 'expirado':
      return `Este passe expirou. Passes valem ${VALIDADE_HORAS} horas por segurança.`;
    case 'segundo_fator_invalido':
      return 'PIN incorreto. O código sozinho não abre o passe.';
    case 'bloqueado':
      return 'Muitas tentativas. Aguarde antes de tentar de novo.';
    default:
      return 'Passe não encontrado.';
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const TIPOS: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
};

async function servirEstatico(res: ServerResponse, caminho: string): Promise<void> {
  let rel = caminho === '/' ? 'index.html' : caminho.slice(1);
  if (rel === 'painel' || rel === 'painel/') rel = 'painel.html';
  if (rel.startsWith('passe/')) rel = 'passe.html';

  const alvo = normalize(join(RAIZ_WEB, rel));
  if (!alvo.startsWith(RAIZ_WEB)) {
    res.writeHead(403).end('acesso negado');
    return;
  }
  try {
    const conteudo = await readFile(alvo);
    res.writeHead(200, {
      'Content-Type': TIPOS[extname(alvo)] ?? 'application/octet-stream',
      'Cache-Control': extname(alvo) === '.html' ? 'no-cache' : 'public, max-age=300',
    });
    res.end(conteudo);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<!doctype html><meta charset="utf-8"><p>Página não encontrada. <a href="/">Voltar</a></p>');
  }
}

function json(res: ServerResponse, status: number, dados: unknown): void {
  const corpo = JSON.stringify(dados, null, 2);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(corpo);
}

async function lerJson<T>(req: IncomingMessage): Promise<T> {
  const pedacos: Buffer[] = [];
  let total = 0;
  for await (const p of req) {
    total += (p as Buffer).length;
    if (total > 128_000) throw new Error('corpo muito grande');
    pedacos.push(p as Buffer);
  }
  const texto = Buffer.concat(pedacos).toString('utf8');
  return texto ? (JSON.parse(texto) as T) : ({} as T);
}

function ipDe(req: IncomingMessage): string {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string') return xf.split(',')[0]!.trim();
  return req.socket.remoteAddress ?? 'desconhecido';
}

// ─────────────────────────────────────────────────────────────────────────────

if (process.env.SEMEAR !== 'nao') await semearDadosDemonstracao();

servidor.listen(PORTA, () => {
  const pendentes = criteriosPendentesDeAssinatura().length;
  const temChave = Boolean(process.env.ANTHROPIC_API_KEY);
  console.log(`
┌─────────────────────────────────────────────────────────────────────────┐
│  Pra Onde Ir — piloto v${VERSAO_PROTOCOLO}                                          │
│  UBS João Dias · Nova Parnamirim, Parnamirim/RN                         │
└─────────────────────────────────────────────────────────────────────────┘

  App do paciente   http://localhost:${PORTA}/
  Painel da unidade http://localhost:${PORTA}/painel      (enfermeira / piloto2026)
  Protocolo (JSON)  http://localhost:${PORTA}/api/protocolo

  Fase             ${FASE_PILOTO} — ${(FASES[FASE_PILOTO] ?? FASES.demonstracao).rotulo}
  Camada 2         ${temChave ? `IA (${MODELO})` : 'MODO DEGRADADO — sem ANTHROPIC_API_KEY'}
  Critérios        ${CRITERIOS.length} (${pendentes} pendentes de assinatura clínica)

  ${temChave ? '' : 'Sem chave de API o piloto roda inteiro: a camada 1 é determinística e\n  offline, e a camada 2 cai para busca textual sobre a mesma lista (B6).\n'}
  ATENÇÃO: protocolo não validado clinicamente. Não use com paciente real.
`);
});
