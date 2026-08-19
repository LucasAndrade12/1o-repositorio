/**
 * B7 + C2 + C7 — registro de triagem, trilha de auditoria e anonimização.
 *
 * C7: "Definir prazo de retenção explícito e rotina de descarte; manter registro imutável
 *      (apenas inserção) contendo entrada, versões, saída e horário; SEPARAR A BASE OPERACIONAL
 *      DA BASE ANALÍTICA ANONIMIZADA."
 *
 * É essa separação que estrutura este arquivo: `RegistroOperacional` guarda o que a equipe
 * precisa para atender; `RegistroAnalitico` guarda o que o piloto precisa para medir — e são
 * bases diferentes, com regras diferentes.
 */

import type { ModoExecucao, Nivel } from '@pra-onde-ir/protocolo';
import type { Triagem } from '@pra-onde-ir/motor';

/** Base OPERACIONAL — o que a equipe precisa para atender. Retenção curta. */
export interface RegistroOperacional {
  id: string;
  criadoEm: string;
  /** Texto integral do relato. Nunca vai para a base analítica. */
  relato: string;
  resumo: string;
  nivel: Nivel;
  destino: string;
  criterios: string[];
  /** B6 — selo de modo, exibido no painel e no passe. */
  modo: ModoExecucao;
  /** B7 — carimbo completo de versões. */
  versoes: Triagem['versoes'];
  /** B11 — nenhum critério bateu: entra na fila de curadoria. */
  naoReconhecido: boolean;
  bairro: string;
  /** Usada em memória para roteamento; NÃO persiste na base analítica (C2). */
  microarea?: string;
  equipe?: string;
  /** E1 — reclassificação pela equipe. */
  reclassificacao?: {
    nivelAtribuido: Nivel;
    motivo?: string;
    por: string;
    em: string;
  };
  /** B11 — curadoria de relato não classificado. */
  curadoria?: {
    decisao: 'criterio_existente' | 'criterio_novo' | 'fora_de_escopo';
    criterioSugerido?: string;
    observacao?: string;
    por: string;
    em: string;
  };
}

/**
 * Base ANALÍTICA — o que o piloto precisa para medir. Anonimizada na origem.
 *
 * C2: "Uma microárea de agente comunitário cobre um número reduzido de domicílios.
 *      Microárea + resumo de sintoma + horário exato é, em muitos casos, tão identificante
 *      quanto a rua — especialmente para quadros pouco frequentes ('grávida com sangramento',
 *      'criança com convulsão'), que é justamente onde a exposição machuca mais."
 */
export interface RegistroAnalitico {
  id: string;
  /** Horário ARREDONDADO para faixa. Nunca o instante exato. */
  faixaHoraria: 'madrugada' | 'manha' | 'tarde' | 'noite';
  diaSemana: number;
  semanaEpidemiologica: number;
  /** Bairro e EQUIPE — não microárea. */
  bairro: string;
  equipe?: string;
  nivel: Nivel;
  destino: string;
  criterios: string[];
  modo: ModoExecucao;
  versaoProtocolo: string;
  versaoPrompt: string;
  versaoModelo: string;
  fase: string;
  naoReconhecido: boolean;
  /** E5 — estratificação por equidade. Opcionais e agregados. */
  faixaEtaria?: 'crianca' | 'adulto' | 'idoso';
  sexo?: 'feminino' | 'masculino' | 'outro';
  /** E5 — se a acurácia cair em relatos curtos, B4 está confirmado nos dados. */
  comprimentoRelato: 'curto' | 'medio' | 'longo';
  nivelAtribuidoPelaEquipe?: Nivel;
  desfechoNoDestino?: 'atendido' | 'redirecionado' | 'nao_compareceu';
  nivelNoDestino?: Nivel;
}

/** C7 — trilha de auditoria imutável: apenas inserção. */
export interface EventoAuditoria {
  em: string;
  tipo:
    | 'triagem_criada'
    | 'passe_emitido'
    | 'passe_aberto'
    | 'passe_tentativa_invalida'
    | 'reclassificacao'
    | 'curadoria'
    | 'desfecho_registrado'
    | 'acesso_painel'
    | 'kill_switch'
    | 'exportacao_bloqueada';
  referencia: string;
  ator?: string;
  origem?: string;
  detalhe?: string;
}

/** C7 — política de retenção declarada. */
export const RETENCAO = {
  operacionalDias: 30,
  analiticaDias: 730,
  auditoriaDias: 1825,
  justificativa:
    'Para um piloto cuja finalidade é medir concordância, os dados precisam durar o suficiente ' +
    'para a análise e não mais que isso (C7). Prazos a confirmar com a assessoria jurídica do ' +
    'município antes do primeiro paciente real.',
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Repositório em memória. Em produção, dois bancos separados.
// ─────────────────────────────────────────────────────────────────────────────

class Repositorio {
  private operacional: RegistroOperacional[] = [];
  private analitico: RegistroAnalitico[] = [];
  private auditoria: EventoAuditoria[] = [];

  registrar(
    triagem: Triagem,
    relato: string,
    contexto: {
      bairro?: string;
      microarea?: string;
      equipe?: string;
      faixaEtaria?: 'crianca' | 'adulto' | 'idoso';
      sexo?: 'feminino' | 'masculino' | 'outro';
    } = {},
  ): RegistroOperacional {
    const id = novoId();
    const agora = new Date(triagem.versoes.timestamp);

    const op: RegistroOperacional = {
      id,
      criadoEm: agora.toISOString(),
      relato,
      resumo: triagem.camada2?.resumo ?? '',
      nivel: triagem.nivel,
      destino: triagem.roteamento.destino,
      criterios: triagem.classificacao.criteriosAplicados.map((c) => c.id),
      modo: triagem.modo,
      versoes: triagem.versoes,
      naoReconhecido: triagem.classificacao.naoReconhecido,
      bairro: contexto.bairro ?? 'não informado',
      ...(contexto.microarea ? { microarea: contexto.microarea } : {}),
      ...(contexto.equipe ? { equipe: contexto.equipe } : {}),
    };
    this.operacional.push(op);

    // C2 — a versão analítica nasce anonimizada. A microárea NÃO atravessa.
    this.analitico.push({
      id,
      faixaHoraria: faixaDe(agora),
      diaSemana: agora.getDay(),
      semanaEpidemiologica: semanaEpidemiologica(agora),
      bairro: op.bairro,
      ...(contexto.equipe ? { equipe: contexto.equipe } : {}),
      nivel: op.nivel,
      destino: op.destino,
      criterios: op.criterios,
      modo: op.modo,
      versaoProtocolo: triagem.versoes.protocolo,
      versaoPrompt: triagem.versoes.prompt,
      versaoModelo: triagem.versoes.modelo,
      fase: triagem.versoes.fase,
      naoReconhecido: op.naoReconhecido,
      ...(contexto.faixaEtaria ? { faixaEtaria: contexto.faixaEtaria } : {}),
      ...(contexto.sexo ? { sexo: contexto.sexo } : {}),
      comprimentoRelato: comprimento(relato),
    });

    this.auditar({ tipo: 'triagem_criada', referencia: id, detalhe: `nivel=${op.nivel} modo=${op.modo}` });
    return op;
  }

  /** E1 — "qual nível você atribuiu?" com as cinco cores. Gera a matriz de confusão. */
  reclassificar(id: string, nivelAtribuido: Nivel, por: string, motivo?: string): boolean {
    const op = this.operacional.find((r) => r.id === id);
    if (!op) return false;
    op.reclassificacao = { nivelAtribuido, por, em: new Date().toISOString(), ...(motivo ? { motivo } : {}) };
    const an = this.analitico.find((r) => r.id === id);
    if (an) an.nivelAtribuidoPelaEquipe = nivelAtribuido;
    this.auditar({
      tipo: 'reclassificacao',
      referencia: id,
      ator: por,
      detalhe: `${op.nivel} → ${nivelAtribuido}${motivo ? ` (${motivo})` : ''}`,
    });
    return true;
  }

  /** B11 — curadoria de relatos não classificados. */
  curar(
    id: string,
    decisao: NonNullable<RegistroOperacional['curadoria']>['decisao'],
    por: string,
    criterioSugerido?: string,
    observacao?: string,
  ): boolean {
    const op = this.operacional.find((r) => r.id === id);
    if (!op) return false;
    op.curadoria = {
      decisao,
      por,
      em: new Date().toISOString(),
      ...(criterioSugerido ? { criterioSugerido } : {}),
      ...(observacao ? { observacao } : {}),
    };
    this.auditar({ tipo: 'curadoria', referencia: id, ator: por, detalhe: decisao });
    return true;
  }

  /** E4 — contrarreferência: o padrão-ouro para calibrar o protocolo. */
  registrarDesfecho(
    id: string,
    desfecho: NonNullable<RegistroAnalitico['desfechoNoDestino']>,
    nivelNoDestino?: Nivel,
  ): boolean {
    const an = this.analitico.find((r) => r.id === id);
    if (!an) return false;
    an.desfechoNoDestino = desfecho;
    if (nivelNoDestino) an.nivelNoDestino = nivelNoDestino;
    this.auditar({ tipo: 'desfecho_registrado', referencia: id, detalhe: desfecho });
    return true;
  }

  auditar(e: Omit<EventoAuditoria, 'em'>): void {
    // Apenas inserção. Nunca update, nunca delete.
    this.auditoria.push({ ...e, em: new Date().toISOString() });
  }

  listarOperacional(): readonly RegistroOperacional[] {
    return this.operacional;
  }
  listarAnalitico(): readonly RegistroAnalitico[] {
    return this.analitico;
  }
  listarAuditoria(): readonly EventoAuditoria[] {
    return this.auditoria;
  }
  buscar(id: string): RegistroOperacional | undefined {
    return this.operacional.find((r) => r.id === id);
  }
  /** B11 — fila de curadoria: não reconhecidos ainda sem decisão. */
  filaCuradoria(): RegistroOperacional[] {
    return this.operacional.filter((r) => r.naoReconhecido && !r.curadoria);
  }
  limpar(): void {
    this.operacional = [];
    this.analitico = [];
    this.auditoria = [];
  }
}

export const repositorio = new Repositorio();

// ─────────────────────────────────────────────────────────────────────────────
// Utilidades de anonimização (C2)
// ─────────────────────────────────────────────────────────────────────────────

/** C2 — horário arredondado para faixa, nunca o instante exato. */
export function faixaDe(d: Date): RegistroAnalitico['faixaHoraria'] {
  const h = d.getHours();
  if (h < 6) return 'madrugada';
  if (h < 12) return 'manha';
  if (h < 18) return 'tarde';
  return 'noite';
}

export function semanaEpidemiologica(d: Date): number {
  const inicio = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - inicio.getTime()) / 86_400_000 + inicio.getDay() + 1) / 7);
}

function comprimento(relato: string): RegistroAnalitico['comprimentoRelato'] {
  const n = relato.trim().length;
  return n < 40 ? 'curto' : n < 160 ? 'medio' : 'longo';
}

function novoId(): string {
  return `tri_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * C2 — checagem de k-anonimato ANTES de exportar qualquer relatório.
 *
 * Agrupa por quase-identificadores e recusa a exportação se algum grupo tiver menos de k
 * registros. É o que impede que "grávida com sangramento, Nova Parnamirim, terça à noite"
 * saia num relatório apontando para uma pessoa.
 */
export const K_ANONIMATO = 5;

export interface ResultadoKAnonimato {
  aprovado: boolean;
  k: number;
  gruposViolando: { chave: string; contagem: number }[];
  total: number;
}

export function verificarKAnonimato(
  registros: readonly RegistroAnalitico[],
  quaseIdentificadores: (keyof RegistroAnalitico)[] = ['bairro', 'faixaHoraria', 'faixaEtaria', 'nivel'],
  k = K_ANONIMATO,
): ResultadoKAnonimato {
  const grupos = new Map<string, number>();
  for (const r of registros) {
    const chave = quaseIdentificadores.map((q) => String(r[q] ?? '—')).join(' | ');
    grupos.set(chave, (grupos.get(chave) ?? 0) + 1);
  }
  const violando = [...grupos.entries()]
    .filter(([, n]) => n < k)
    .map(([chave, contagem]) => ({ chave, contagem }));

  return { aprovado: violando.length === 0, k, gruposViolando: violando, total: registros.length };
}

/**
 * Exportação com trava. Se o k-anonimato falhar, a exportação é RECUSADA e o evento é auditado.
 */
export function exportarAnalitico(
  registros: readonly RegistroAnalitico[],
): { ok: true; dados: RegistroAnalitico[] } | { ok: false; motivo: string; detalhe: ResultadoKAnonimato } {
  const check = verificarKAnonimato(registros);
  if (!check.aprovado) {
    repositorio.auditar({
      tipo: 'exportacao_bloqueada',
      referencia: 'base_analitica',
      detalhe: `k-anonimato < ${check.k} em ${check.gruposViolando.length} grupo(s)`,
    });
    return {
      ok: false,
      motivo:
        `Exportação bloqueada: ${check.gruposViolando.length} grupo(s) com menos de ${check.k} ` +
        'registros. Combinações raras identificam pessoas — é exatamente onde a exposição ' +
        'machuca mais (C2). Agregue mais, ou remova quase-identificadores.',
      detalhe: check,
    };
  }
  return { ok: true, dados: [...registros] };
}
