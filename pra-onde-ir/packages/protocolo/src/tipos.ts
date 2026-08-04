/**
 * Tipos do protocolo clínico.
 *
 * Princípio central, vindo do achado A10 da revisão de 03/08/2026:
 * NÍVEL DE RISCO e PONTO DE ATENÇÃO são coisas diferentes.
 * A cor responde "quão rápido". O destino responde "onde".
 * Fundi-los foi o que fez o sistema original empurrar para a UPA casos que a UPA não resolve.
 */

/** Nível de risco — responde "quão rápido". Cinco cores, mantidas do protocolo original. */
export type Nivel = 'vermelho' | 'laranja' | 'amarelo' | 'verde' | 'azul';

export const ORDEM_NIVEIS: Nivel[] = ['azul', 'verde', 'amarelo', 'laranja', 'vermelho'];

/** Índice numérico do nível (0 = azul … 4 = vermelho). Usado para comparar gravidade. */
export function gravidade(nivel: Nivel): number {
  return ORDEM_NIVEIS.indexOf(nivel);
}

/** Retorna o mais grave entre dois níveis. */
export function maisGrave(a: Nivel, b: Nivel): Nivel {
  return gravidade(a) >= gravidade(b) ? a : b;
}

/** Sobe `degraus` níveis, sem passar de vermelho. */
export function escalonar(nivel: Nivel, degraus = 1): Nivel {
  const i = Math.min(ORDEM_NIVEIS.length - 1, gravidade(nivel) + degraus);
  return ORDEM_NIVEIS[i]!;
}

/**
 * Ponto de atenção — responde "onde".
 * A lista original tinha cinco caixas. A rede do SUS tem mais portas, e várias
 * delas são a porta CORRETA para casos que o protocolo já contemplava (A10).
 */
export type DestinoId =
  | 'samu'
  | 'upa'
  | 'ubs_hoje'
  | 'ubs_agendada'
  | 'casa'
  | 'maternidade' // A11 — queixa obstétrica acima do limiar gestacional
  | 'caps' // A8 — faixa intermediária de saúde mental
  | 'ceo' // A10 — urgência odontológica
  | 'hospital_trauma' // A10
  | 'farmacia_unidade' // A10 — renovação de receita não ocupa vaga de consulta
  | 'sala_vacina' // A10 — demanda espontânea
  | 'equipe_esf' // A13/D5 — acamado, sem transporte: a equipe vai até a pessoa
  | 'servico_violencia' // A9
  | 'vigilancia_epidemiologica' // A6 — notificação de arbovirose
  | 'cvv'; // A8 — via de conversa imediata, exibida sempre que o tema for tocado

/**
 * Tipo de queixa — a segunda dimensão da tabela de roteamento (A10).
 * É o que permite que "laranja" vá para a maternidade em vez da UPA.
 */
export type TipoQueixa =
  | 'geral'
  | 'obstetrica'
  | 'saude_mental'
  | 'odontologica'
  | 'trauma'
  | 'administrativa'
  | 'medicamento'
  | 'vacina'
  | 'violencia'
  | 'arbovirose'
  | 'pediatrica'
  | 'ocular'
  | 'urologica'
  | 'respiratoria'
  | 'cardiovascular'
  | 'neurologica'
  | 'gastrointestinal'
  | 'dermatologica'
  | 'metabolica'
  | 'infecciosa';

/**
 * Assinatura clínica.
 *
 * A revisão é explícita: "Nenhuma sugestão de critério, limiar ou destino aqui contida deve
 * entrar em produção sem revisão e assinatura desses profissionais."
 *
 * Cada critério carrega este campo. `null` significa PENDENTE — o critério funciona
 * normalmente no piloto (para que ele seja executável e possa ser criticado), mas aparece
 * marcado no painel e no endpoint /api/protocolo, com contador. A honestidade fica visível
 * sem tornar o sistema inerte.
 */
export interface Assinatura {
  enfermeira: string;
  retaguardaMedica: string;
  data: string; // ISO
  observacao?: string;
}

/** Achado da revisão que originou ou alterou este item. Rastreabilidade auditável. */
export type OrigemAchado =
  | 'v1' // já existia no protocolo de 22/07/2026
  | 'A1' | 'A2' | 'A3' | 'A4' | 'A5' | 'A6' | 'A7'
  | 'A8' | 'A9' | 'A10' | 'A11' | 'A12' | 'A13' | 'A14'
  | 'B1' | 'B2' | 'B3' | 'B4' | 'B5' | 'B6' | 'B7' | 'B8' | 'B9' | 'B10' | 'B11'
  | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7'
  | 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6'
  | 'E1' | 'E2' | 'E3' | 'E4' | 'E5' | 'E6';

export interface Criterio {
  id: string;
  titulo: string;
  /** Descrição clínica — vai para o prompt da camada 2 e para o documento gerado. */
  descricao: string;
  nivel: Nivel;
  tipoQueixa: TipoQueixa;
  /** Como a pessoa efetivamente descreve isso. Alimenta a camada 1 e o dicionário regional. */
  comoAPessoaDescreve: string[];
  /**
   * Regra de combinação: grupos de sinais que precisam TODOS estar presentes para o critério
   * disparar (E entre grupos, OU dentro de cada grupo). Modela quadros que só existem na
   * conjunção — neutropenia febril é quimioterapia E febre, não uma coisa ou outra.
   */
  exigeTodos?: string[][];
  /** Janela terapêutica curta: o atraso muda o desfecho. */
  tempoDependente?: boolean;
  /**
   * Bandeira irreversível: uma vez disparada, não desce.
   * A revisão manda MANTER a irreversibilidade e resolver o falso positivo na entrada,
   * com pergunta fechada determinística — nunca com a IA rebaixando nível (B1).
   */
  irreversivel?: boolean;
  /** A2 — isento do piso de 24 horas, para que o nível AZUL volte a existir. */
  isentoPiso24h?: boolean;
  /** A12 — o que fazer nos minutos de espera. Escrito pela retaguarda, nunca gerado pela IA. */
  primeirosMinutos?: string[];
  /** A3/A14 — sinais que reclassificam o critério para cima, com o novo nível. */
  sinaisDeAlarme?: { descricao: string; comoAPessoaDescreve: string[]; nivelSeAlarme: Nivel };
  /** Fonte normativa, quando houver (A7 pede ancorar a pediatria na AIDPI e citar a fonte). */
  fonte?: string;
  origem: OrigemAchado;
  assinatura: Assinatura | null;
}

/**
 * Agravante condicionado ao critério (A1).
 *
 * O protocolo original subia UM NÍVEL para QUALQUER critério em onze condições.
 * Como HAS, DM e idade 60+ não são raros na demanda de uma UBS — são a demanda da UBS —
 * o efeito prático era reorientar o fluxo da Atenção Básica para a urgência, o oposto
 * do que o projeto se propõe. Aqui cada comorbidade só escalona os critérios com os quais
 * tem relação fisiopatológica.
 */
export interface Agravante {
  id: string;
  rotulo: string;
  /** D3 — quatro blocos de linguagem simples, para a tela enxuta de seleção. */
  bloco: 'coracao_pressao' | 'diabetes' | 'pulmao' | 'gravidez_pos_parto' | 'outros';
  /** Matriz esparsa: só estes tipos de queixa são escalonados. */
  escalonaTiposQueixa: TipoQueixa[];
  /** IDs específicos de critério que este agravante escalona, além dos tipos acima. */
  escalonaCriterios?: string[];
  /** Imunossupressão escalona QUALQUER febre — regra transversal. */
  escalonaQualquerFebre?: boolean;
  /** Como a pessoa menciona espontaneamente (extração pela IA, D3). */
  comoAPessoaDescreve: string[];
  justificativaFisiopatologica: string;
  origem: OrigemAchado;
  assinatura: Assinatura | null;
}

export interface Destino {
  id: DestinoId;
  nome: string;
  /** Instrução de ação, em frase curta, com o QUE FAZER antes do porquê (D4). */
  instrucao: string;
  telefone?: string;
  /** Este destino tem horário de funcionamento? (D1) */
  sensivelAHorario: boolean;
  /** Não exige deslocamento da pessoa (A13/D5). */
  semDeslocamento?: boolean;
  origem: OrigemAchado;
}

export interface Unidade {
  id: string;
  nome: string;
  destino: DestinoId;
  endereco: string;
  bairro: string;
  telefone?: string;
  /** D1 — horário por dia da semana (0 = domingo). `null` = fechado. */
  horarios: Record<number, { abre: string; fecha: string } | null>;
  /** D1 — datas ISO (MM-DD) em que a unidade não abre. */
  feriados: string[];
  coordenadas?: { lat: number; lon: number };
}

/** B4 — bloco fixo de perguntas fechadas de segurança. Determinístico, sem IA, sem rede. */
export interface PerguntaSeguranca {
  id: string;
  pergunta: string;
  /** Texto de apoio em linguagem coloquial. */
  ajuda: string;
  icone: string;
  /** Se a resposta for "sim", estes critérios são acionados. */
  acionaCriterios: string[];
  origem: OrigemAchado;
}

/** A12 — rede de segurança. Obrigatória nos CINCO níveis, não só no azul. */
export interface SafetyNetting {
  nivel: Nivel;
  /** O que observar. */
  observar: string[];
  /** Em quanto tempo reavaliar. */
  prazoReavaliacao: string;
  /** Gatilhos explícitos de retorno. */
  voltarSe: string[];
}

export type FasePiloto = 'demonstracao' | 'vinhetas' | 'sombra' | 'assistido' | 'domiciliar';

export type ModoExecucao = 'ia' | 'degradado';
