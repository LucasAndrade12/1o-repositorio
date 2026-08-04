/**
 * Pipeline de triagem — orquestra as três camadas.
 *
 * A arquitetura de três camadas é o principal elogio da revisão e é preservada integralmente:
 *
 *   Camada 1 — varredura determinística offline (roda ANTES da rede)
 *   Camada 2 — tradução de linguagem pela IA (NÃO decide destino)
 *   Camada 3 — classificação determinística + roteamento
 *
 * B2 (ALTO) — curto-circuito: "bandeira vermelha confirmada na camada 1 exibe a tela do SAMU
 * IMEDIATAMENTE, com botão de ligação direta, e roda a camada 2 em segundo plano apenas para
 * compor o resumo e o passe. A TELA NUNCA ESPERA A REDE. Documentar isso como requisito, não
 * como otimização."
 *
 * B3 (ALTO) — verificação assimétrica: sempre que a camada 3 concluir VERDE ou AZUL — ou seja,
 * sempre que o sistema estiver prestes a dizer "não precisa ir agora" — roda uma segunda
 * passagem independente. Divergência escalona para AMARELO.
 */

import {
  AVISO_DECISAO_AUTOMATIZADA,
  BLOCO_SEGURANCA,
  FASES,
  FASE_PILOTO,
  PERGUNTA_CONFIRMACAO_BANDEIRA,
  ROTEIROS_SENSIVEIS,
  VERSAO_PROTOCOLO,
  criterioPorId,
  gravidade,
  rotear,
  type ModoExecucao,
  type Nivel,
  type ResultadoRoteamento,
} from '@pra-onde-ir/protocolo';

import { aplicarConfirmacao, varrer, type ResultadoCamada1 } from './camada1.js';
import { classificar, type DadosPaciente, type ResultadoClassificacao } from './camada3.js';

/**
 * Porta da camada 2. O motor não conhece a implementação — recebe uma função.
 * Isso mantém o motor puro, determinístico e executável no navegador sem rede (B9),
 * e permite que os testes de vinhetas rodem sem chamar a API.
 */
export interface SaidaCamada2 {
  criterios: string[];
  resumo: string;
  perguntaSugerida?: string | null;
  agravantesMencionados: string[];
  modo: ModoExecucao;
  versaoPrompt: string;
  versaoModelo: string;
  versaoEsquema: string;
  /** B3 — resultado da segunda passagem de verificação, quando executada. */
  verificacao?: {
    executada: boolean;
    encontrouBandeira: boolean;
    criteriosEncontrados: string[];
    divergiu: boolean;
  };
}

export type Camada2Port = (
  relato: string,
  contexto: { criteriosJaAcionados: string[]; nivelPreliminar: Nivel | null },
) => Promise<SaidaCamada2>;

export interface EntradaTriagem {
  relato: string;
  paciente: DadosPaciente;
  /** D2 — para quem é o atendimento. */
  paraQuem: 'proprio' | 'terceiro';
  /** B4 — respostas do bloco fixo de segurança. */
  respostasBlocoSeguranca?: Record<string, boolean>;
  /** B1 — resposta da pergunta de confirmação da bandeira vermelha. */
  confirmouBandeira?: boolean;
  /** B8 — respostas dos roteiros fechados em domínio sensível. */
  respostasRoteiro?: Record<string, string>;
  agora?: Date;
}

export interface Triagem {
  nivel: Nivel;
  roteamento: ResultadoRoteamento;
  classificacao: ResultadoClassificacao;
  camada1: ResultadoCamada1;
  camada2: SaidaCamada2 | null;
  /** B2 — a tela do SAMU foi emitida sem esperar a rede? */
  curtoCircuito: boolean;
  /** B1 — o fluxo está pausado aguardando a resposta de confirmação. */
  aguardandoConfirmacao: boolean;
  perguntaConfirmacao?: typeof PERGUNTA_CONFIRMACAO_BANDEIRA;
  /** B8 — roteiro fechado a apresentar antes de concluir. */
  roteiroPendente?: (typeof ROTEIROS_SENSIVEIS)[number];
  /** B4 — o bloco fixo foi o mecanismo principal (relato vago)? */
  blocoSegurancaFoiPrincipal: boolean;
  modo: ModoExecucao;
  safetyNetting: ResultadoClassificacao['safetyNetting'];
  primeirosMinutos: string[];
  avisoLGPD: string;
  /** B7 — carimbo de versões em toda triagem. */
  versoes: {
    protocolo: string;
    prompt: string;
    modelo: string;
    esquema: string;
    modo: ModoExecucao;
    fase: string;
    timestamp: string;
  };
  /** E2 — a fase atual permite mostrar o resultado ao paciente? */
  mostraResultadoAoPaciente: boolean;
}

/** Um relato é "vago" quando não aciona nenhum critério pela via textual (B4). */
export function relatoEhVago(camada1: ResultadoCamada1): boolean {
  return camada1.criteriosAcionados.length === 0;
}

/**
 * ETAPA 1 — camada 1 pura, sem rede. É o que roda no PWA offline (B9)
 * e o que dispara o curto-circuito de B2.
 */
export function triagemImediata(entrada: EntradaTriagem): {
  camada1: ResultadoCamada1;
  curtoCircuito: boolean;
  aguardandoConfirmacao: boolean;
  /** B4 — o relato, sozinho, não acionou critério algum? */
  vagoAntesDoBloco: boolean;
} {
  let camada1 = varrer(entrada.relato);
  const vagoAntesDoBloco = camada1.criteriosAcionados.length === 0;

  // B4 — o bloco fixo acrescenta critérios de forma determinística.
  if (entrada.respostasBlocoSeguranca) {
    const extras: string[] = [];
    for (const pergunta of BLOCO_SEGURANCA) {
      if (entrada.respostasBlocoSeguranca[pergunta.id] === true) {
        extras.push(...pergunta.acionaCriterios);
      }
    }
    if (extras.length > 0) {
      const acionados = [...new Set([...camada1.criteriosAcionados, ...extras])];
      camada1 = {
        ...camada1,
        criteriosAcionados: acionados,
        bandeiraVermelha:
          camada1.bandeiraVermelha ||
          extras.some((id) => criterioPorId(id)?.irreversivel === true),
      };
    }
  }

  // B1 — a confirmação já veio junto? Aplica agora.
  if (camada1.bandeiraVermelha && entrada.confirmouBandeira !== undefined) {
    camada1 = aplicarConfirmacao(camada1, entrada.confirmouBandeira);
  }

  const aguardandoConfirmacao =
    camada1.bandeiraVermelha && entrada.confirmouBandeira === undefined;

  // A11 — gestação detectada no relato completa o que a pessoa não marcou na tela.
  // O que ela informou explicitamente sempre prevalece.
  if (camada1.gestacao?.detectada && !entrada.paciente.gestante) {
    entrada.paciente.gestante = { semanas: camada1.gestacao.semanas };
  }

  return {
    camada1,
    // B2 — bandeira confirmada devolve AGORA. A tela nunca espera a rede.
    curtoCircuito: camada1.bandeiraVermelha && entrada.confirmouBandeira === true,
    aguardandoConfirmacao,
    vagoAntesDoBloco,
  };
}

/**
 * ETAPA 2 — triagem completa. A camada 2 é opcional: sem ela, o sistema roda em modo
 * degradado sobre a mesma lista de critérios (B6) e continua funcionando.
 */
export async function triar(
  entrada: EntradaTriagem,
  camada2?: Camada2Port,
): Promise<Triagem> {
  const agora = entrada.agora ?? new Date();
  const imediata = triagemImediata(entrada);
  let camada1 = imediata.camada1;

  // ── B2: curto-circuito. A decisão já está tomada e é irreversível por regra. ──
  if (imediata.curtoCircuito) {
    const classificacao = classificar(camada1.criteriosAcionados, entrada.paciente, camada1.especificidade);
    const roteamento = rotear({
      nivel: classificacao.nivel,
      tipoQueixa: classificacao.tipoQueixa,
      agora,
      ...(entrada.paciente.gestante ? { gestante: entrada.paciente.gestante } : {}),
      ...(entrada.paciente.semDeslocamento ? { semDeslocamento: true } : {}),
    });

    // A camada 2 roda em SEGUNDO PLANO, só para compor resumo e passe.
    // Ela não pode alterar a decisão — e a tela já foi emitida.
    let saida2: SaidaCamada2 | null = null;
    if (camada2) {
      saida2 = await camada2(entrada.relato, {
        criteriosJaAcionados: camada1.criteriosAcionados,
        nivelPreliminar: classificacao.nivel,
      }).catch(() => null);
    }

    return montar({
      classificacao,
      roteamento,
      camada1,
      camada2: saida2,
      curtoCircuito: true,
      aguardandoConfirmacao: false,
      // B4 — relato vago em que só o bloco fixo revelou a bandeira. É o caso de
      // "tô passando mal" + dor no peito: sem as perguntas fechadas, nada teria disparado.
      blocoSegurancaFoiPrincipal: imediata.vagoAntesDoBloco,
      agora,
    });
  }

  // ── B1: fluxo pausado aguardando confirmação ────────────────────────────
  if (imediata.aguardandoConfirmacao) {
    const classificacao = classificar(camada1.criteriosAcionados, entrada.paciente, camada1.especificidade);
    const roteamento = rotear({
      nivel: classificacao.nivel,
      tipoQueixa: classificacao.tipoQueixa,
      agora,
    });
    const t = montar({
      classificacao,
      roteamento,
      camada1,
      camada2: null,
      curtoCircuito: false,
      aguardandoConfirmacao: true,
      blocoSegurancaFoiPrincipal: false,
      agora,
    });
    t.perguntaConfirmacao = PERGUNTA_CONFIRMACAO_BANDEIRA;
    return t;
  }

  const vagoAntes = imediata.vagoAntesDoBloco;

  // ── Camada 2 ────────────────────────────────────────────────────────────
  let saida2: SaidaCamada2 | null = null;
  if (camada2) {
    saida2 = await camada2(entrada.relato, {
      criteriosJaAcionados: camada1.criteriosAcionados,
      nivelPreliminar: null,
    }).catch(() => null);
  }

  // As duas camadas se somam. A camada 1 nunca é sobrescrita — só acrescenta.
  const idsUnidos = [
    ...new Set([...camada1.criteriosAcionados, ...(saida2?.criterios ?? [])]),
  ];

  // ── Camada 3 ────────────────────────────────────────────────────────────
  const pacienteComAgravantes: DadosPaciente = {
    ...entrada.paciente,
    agravantes: [
      ...new Set([...entrada.paciente.agravantes, ...(saida2?.agravantesMencionados ?? [])]),
    ],
  };

  let classificacao = classificar(idsUnidos, pacienteComAgravantes, camada1.especificidade);

  // ── B8 — domínio sensível exige roteiro fechado antes de concluir ───────
  const roteiro = ROTEIROS_SENSIVEIS.find((r) => r.dominio === classificacao.tipoQueixa);
  const roteiroRespondido = entrada.respostasRoteiro != null;

  // ── B3 — verificação assimétrica ────────────────────────────────────────
  // Só na fatia baixa da distribuição: é ali que o erro dói.
  if (saida2?.verificacao?.divergiu && gravidade(classificacao.nivel) < gravidade('amarelo')) {
    const de = classificacao.nivel;
    classificacao = {
      ...classificacao,
      nivel: 'amarelo',
      explicacao: [
        ...classificacao.explicacao,
        {
          etapa: 'verificacao_assimetrica',
          de,
          para: 'amarelo',
          motivo:
            'A segunda passagem independente, com prompt diferente, encontrou possível bandeira ' +
            `vermelha ou laranja (${saida2.verificacao.criteriosEncontrados.join(', ')}) que a ` +
            'primeira passagem não marcou. Divergência escalona. O esquema fechado protege contra ' +
            'alucinação de critério — o erro barato; esta passagem protege contra deixar de marcar ' +
            'um critério que se aplica — o erro caro.',
          achado: 'B3',
        },
      ],
    };
  }

  const roteamento = rotear({
    nivel: classificacao.nivel,
    tipoQueixa: classificacao.tipoQueixa,
    agora,
    ...(pacienteComAgravantes.gestante ? { gestante: pacienteComAgravantes.gestante } : {}),
    ...(pacienteComAgravantes.semDeslocamento ? { semDeslocamento: true } : {}),
    ...(pacienteComAgravantes.faixaEtaria ? { faixaEtaria: pacienteComAgravantes.faixaEtaria } : {}),
  });

  const t = montar({
    classificacao,
    roteamento,
    camada1,
    camada2: saida2,
    curtoCircuito: false,
    aguardandoConfirmacao: false,
    // B4 — para relato vago, o bloco fixo deixa de ser complemento e passa a ser o
    // mecanismo principal de triagem.
    blocoSegurancaFoiPrincipal: vagoAntes && idsUnidos.length > 0,
    agora,
  });

  if (roteiro && !roteiroRespondido) t.roteiroPendente = roteiro;
  return t;
}

function montar(args: {
  classificacao: ResultadoClassificacao;
  roteamento: ResultadoRoteamento;
  camada1: ResultadoCamada1;
  camada2: SaidaCamada2 | null;
  curtoCircuito: boolean;
  aguardandoConfirmacao: boolean;
  blocoSegurancaFoiPrincipal: boolean;
  agora: Date;
}): Triagem {
  const modo: ModoExecucao = args.camada2?.modo ?? 'degradado';
  const fase = FASES[FASE_PILOTO] ?? FASES.demonstracao;

  return {
    nivel: args.classificacao.nivel,
    roteamento: args.roteamento,
    classificacao: args.classificacao,
    camada1: args.camada1,
    camada2: args.camada2,
    curtoCircuito: args.curtoCircuito,
    aguardandoConfirmacao: args.aguardandoConfirmacao,
    blocoSegurancaFoiPrincipal: args.blocoSegurancaFoiPrincipal,
    modo,
    safetyNetting: args.classificacao.safetyNetting,
    primeirosMinutos: args.classificacao.primeirosMinutos,
    avisoLGPD: AVISO_DECISAO_AUTOMATIZADA,
    versoes: {
      protocolo: VERSAO_PROTOCOLO,
      prompt: args.camada2?.versaoPrompt ?? 'n/a (modo degradado)',
      modelo: args.camada2?.versaoModelo ?? 'n/a (modo degradado)',
      esquema: args.camada2?.versaoEsquema ?? 'n/a (modo degradado)',
      modo,
      fase: FASE_PILOTO,
      timestamp: args.agora.toISOString(),
    },
    mostraResultadoAoPaciente: fase.mostraResultadoAoPaciente,
  };
}
