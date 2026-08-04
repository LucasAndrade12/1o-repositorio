/**
 * Versionamento do protocolo (B5, B7).
 *
 * A revisão observa que regenerar o PDF a partir do endpoint garante a sincronia do
 * DOCUMENTO, não a rastreabilidade do HISTÓRICO. Se um critério mudar no meio do piloto,
 * sem isto não haveria como saber sob qual versão cada triagem passada foi classificada —
 * e a comparação antes/depois, a evidência mais valiosa que o piloto pode produzir,
 * ficaria impossível.
 *
 * Toda triagem carimba: versao_protocolo, versao_prompt, versao_modelo, versao_esquema,
 * modo e fase.
 */

export const VERSAO_PROTOCOLO = '2.0.0';

export const PROTOCOLO_META = {
  versao: VERSAO_PROTOCOLO,
  data: '2026-08-03',
  baseadoEm: 'Protocolo v1 gerado em 22/07/2026 (43 critérios, 11 agravantes)',
  revisao: 'Pra Onde Ir — Revisão crítica de protocolo e arquitetura, 03/08/2026 (44 achados)',
  unidadePiloto: 'UBS João Dias — Nova Parnamirim, Parnamirim/RN',
  responsavelClinico: null as string | null,
  assinadoEm: null as string | null,
  aviso:
    'Protocolo NÃO validado clinicamente. Critérios com assinatura pendente são propostas de ' +
    'partida extraídas da revisão técnica, para discussão com a enfermeira do acolhimento e a ' +
    'retaguarda médica da unidade.',
} as const;

/** Histórico imutável de versões (B7, C7). Apenas inserção. */
export interface EntradaHistorico {
  versao: string;
  data: string;
  responsavel: string;
  resumo: string;
}

export const HISTORICO_VERSOES: readonly EntradaHistorico[] = Object.freeze([
  {
    versao: '1.0.0',
    data: '2026-07-22',
    responsavel: 'geração original a partir de /api/protocolo',
    resumo: '43 critérios, 11 agravantes globais de +1 nível, 5 destinos.',
  },
  {
    versao: '2.0.0',
    data: '2026-08-03',
    responsavel: 'engenharia — pendente de assinatura clínica',
    resumo:
      'Resposta aos 44 achados da revisão: agravantes condicionados (A1), piso de 24h com ' +
      'exceções (A2), 12 bandeiras tempo-dependentes (A5), módulo de arbovirose (A6), bloco ' +
      'pediátrico AIDPI (A7), trilha de saúde mental com CAPS e CVV (A8), trilha de violência ' +
      '(A9), nível desacoplado de destino com 15 pontos de atenção (A10), roteamento obstétrico ' +
      '(A11), safety-netting nos 5 níveis e primeiros minutos (A12).',
  },
]);

/**
 * Fase do piloto (E2).
 *
 * O desenho original ia direto de "não validado" para "orientando pacientes". A revisão
 * propõe quatro fases. Aqui é CONFIGURAÇÃO, não trava: o padrão do repositório é
 * `demonstracao`, para que quem clonar veja o fluxo inteiro funcionando. Trocar para
 * `sombra` ativa o comportamento de E2 — mede tudo, não mostra o resultado ao paciente —
 * sem editar código.
 */
export const FASE_PILOTO = (process?.env?.FASE_PILOTO ?? 'demonstracao') as
  | 'demonstracao'
  | 'vinhetas'
  | 'sombra'
  | 'assistido'
  | 'domiciliar';

export const FASES = {
  demonstracao: {
    rotulo: 'Demonstração',
    mostraResultadoAoPaciente: true,
    descricao: 'Fluxo completo visível. Padrão do repositório, para inspeção e crítica.',
  },
  vinhetas: {
    rotulo: 'Fase 0 — Vinhetas',
    mostraResultadoAoPaciente: false,
    descricao: 'Só casos sintéticos, revisados pela enfermeira e pela retaguarda.',
    criterioParaAvancar: 'Zero sub-triagem em vinhetas vermelhas e laranjas.',
  },
  sombra: {
    rotulo: 'Fase 1 — Sombra',
    mostraResultadoAoPaciente: false,
    descricao: 'Preenchido na recepção junto com o acolhimento presencial. Resultado não é mostrado.',
    criterioParaAvancar: 'Sub-triagem próxima de zero e sobre-triagem dentro do teto acordado.',
  },
  assistido: {
    rotulo: 'Fase 2 — Assistido',
    mostraResultadoAoPaciente: true,
    descricao: 'Usado por pacientes dentro da unidade, com profissional por perto.',
    criterioParaAvancar: 'Concordância estável, taxa de não reconhecimento em queda.',
  },
  domiciliar: {
    rotulo: 'Fase 3 — Domiciliar',
    mostraResultadoAoPaciente: true,
    descricao: 'Uso em casa, como concebido.',
    criterioParaAvancar: 'Revisão formal com a equipe e com a Secretaria.',
  },
} as const;

/**
 * C6 — interruptor de desligamento acessível à unidade, sem depender do desenvolvedor.
 * Um sistema de triagem sem processo de incidente definido ANTES do primeiro incidente
 * é um sistema que vai improvisar no pior momento possível.
 */
export const estadoSistema = {
  ativo: true,
  desligadoPor: null as string | null,
  desligadoEm: null as string | null,
  motivo: null as string | null,
};

export function desligarSistema(quem: string, motivo: string): void {
  estadoSistema.ativo = false;
  estadoSistema.desligadoPor = quem;
  estadoSistema.desligadoEm = new Date().toISOString();
  estadoSistema.motivo = motivo;
}

export function religarSistema(quem: string): void {
  estadoSistema.ativo = true;
  estadoSistema.desligadoPor = null;
  estadoSistema.desligadoEm = null;
  estadoSistema.motivo = `religado por ${quem} em ${new Date().toISOString()}`;
}

/**
 * C4 — LGPD. Frase permanente e não condicional na interface.
 * Atende ao direito de revisão de decisão automatizada, é honesta sobre a natureza da
 * ferramenta, e reduz risco jurídico e clínico ao mesmo tempo.
 */
export const AVISO_DECISAO_AUTOMATIZADA =
  'Esta é uma orientação automática. Você pode sempre procurar a UBS e falar com um ' +
  'profissional, mesmo que o resultado diga o contrário.';
