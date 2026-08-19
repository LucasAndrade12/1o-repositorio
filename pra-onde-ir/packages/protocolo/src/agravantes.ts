/**
 * A1 (ALTO) — Agravantes condicionados ao critério.
 *
 * Como estava: onze condições subiam o caso UM NÍVEL, aplicadas a QUALQUER critério.
 *
 * O problema, nas palavras da revisão: "hipertensão, diabetes e idade 60+ não são condições
 * raras na demanda de uma UBS — são a demanda da UBS. Um agravante genérico aplicado a
 * qualquer critério significa que a maior parte dos adultos que procurar o sistema com um
 * quadro agudo será empurrada um degrau acima. Combinado com a regra 'quadro agudo não desce
 * abaixo de amarelo', o efeito prático é que 'febre 38 há um dia' em um hipertenso de 63 anos
 * vira LARANJA → UPA. Isso não é um erro de arredondamento: é uma reorientação de fluxo da
 * Atenção Básica para a urgência, exatamente o oposto do que o projeto se propõe a fazer."
 *
 * E o problema de credibilidade: "se a equipe reclassificar 40% dos casos para baixo, a taxa
 * de concordância — o número que o projeto pretende levar à Secretaria — desaba, e desaba por
 * uma regra de desenho, não por falha da IA."
 *
 * Solução implementada: matriz esparsa em que cada comorbidade só escalona os critérios com os
 * quais tem relação fisiopatológica. Idade isolada sobe para 75+; a faixa 60–74 exige idade
 * SOMADA a sinal agudo.
 *
 * Nota sobre gestante: NÃO está aqui. A11 é explícito — idade gestacional é variável de
 * ROTEAMENTO, não agravante genérico. Ver roteamento.ts.
 */

import type { Agravante } from './tipos.js';

const PENDENTE = null;

export const AGRAVANTES: readonly Agravante[] = Object.freeze([
  {
    id: 'diabetes',
    rotulo: 'Diabetes',
    bloco: 'diabetes',
    // DM escalona ferida infectada, febre e desidratação — exatamente o exemplo da revisão.
    escalonaTiposQueixa: ['dermatologica', 'metabolica'],
    escalonaCriterios: ['lj.ferida_infectada', 'am.febre_adulto', 'lj.desidratacao', 'am.infeccao_urinaria'],
    comoAPessoaDescreve: ['diabético', 'diabetes', 'tenho açúcar alto', 'uso insulina', 'tomo metformina'],
    justificativaFisiopatologica:
      'Retardo de cicatrização e maior risco de infecção de partes moles; descompensação ' +
      'metabólica acelerada em quadros febris e desidratação.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'hipertensao',
    rotulo: 'Pressão alta (hipertensão)',
    bloco: 'coracao_pressao',
    // HAS escalona cefaleia e dor torácica — o segundo exemplo literal da revisão.
    escalonaTiposQueixa: ['cardiovascular'],
    escalonaCriterios: ['am.dor_moderada'],
    comoAPessoaDescreve: ['hipertenso', 'pressão alta', 'tomo remédio de pressão', 'uso losartana'],
    justificativaFisiopatologica:
      'Risco cardiovascular aumentado em dor torácica e em cefaleia, por associação com ' +
      'evento coronariano e cerebrovascular.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'cardiopatia',
    rotulo: 'Doença do coração',
    bloco: 'coracao_pressao',
    escalonaTiposQueixa: ['cardiovascular', 'respiratoria'],
    comoAPessoaDescreve: [
      'problema no coração', 'cardiopata', 'já infartei', 'tenho insuficiência cardíaca',
      'coloquei stent', 'faço uso de marcapasso',
    ],
    justificativaFisiopatologica:
      'Reserva cardíaca reduzida: dispneia e dor torácica têm limiar de gravidade mais baixo.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'asma_dpoc',
    rotulo: 'Asma ou problema de pulmão',
    bloco: 'pulmao',
    escalonaTiposQueixa: ['respiratoria'],
    comoAPessoaDescreve: ['asma', 'bronquite', 'dpoc', 'enfisema', 'uso bombinha'],
    justificativaFisiopatologica: 'Reserva ventilatória reduzida; deterioração rápida em quadro respiratório.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'imunossupressao',
    rotulo: 'Imunidade baixa (quimioterapia, transplante, HIV, corticoide)',
    bloco: 'outros',
    escalonaTiposQueixa: ['infecciosa', 'dermatologica'],
    // Regra transversal da revisão: "imunossupressão escalona qualquer febre".
    escalonaQualquerFebre: true,
    comoAPessoaDescreve: [
      'faço quimioterapia', 'transplantado', 'tenho hiv', 'tomo corticoide',
      'imunidade baixa', 'faço tratamento de câncer',
    ],
    justificativaFisiopatologica:
      'Resposta inflamatória atenuada mascara gravidade; infecção pode evoluir sem os sinais ' +
      'habituais. Ver também o critério próprio a5.neutropenia_febril.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'nefropatia',
    rotulo: 'Problema nos rins',
    bloco: 'outros',
    escalonaTiposQueixa: ['urologica', 'metabolica'],
    escalonaCriterios: ['lj.desidratacao', 'am.pressao_alta_assintomatica'],
    comoAPessoaDescreve: ['problema nos rins', 'faço hemodiálise', 'insuficiência renal', 'rim fraco'],
    justificativaFisiopatologica:
      'Menor tolerância a desidratação e a distúrbios hidroeletrolíticos; hipertensão de difícil controle.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'acamado',
    rotulo: 'Pessoa acamada ou com mobilidade muito reduzida',
    bloco: 'outros',
    // A13 — este agravante NÃO sobe nível; ele muda a MODALIDADE de atendimento.
    // "Para quem não sai da cama, aumentar a urgência sem alterar o destino é aumentar a
    //  angústia sem oferecer solução."
    escalonaTiposQueixa: [],
    escalonaCriterios: ['lj.ferida_infectada'],
    comoAPessoaDescreve: ['acamado', 'acamada', 'não sai da cama', 'não anda', 'cadeirante'],
    justificativaFisiopatologica:
      'Risco de lesão por pressão e de infecção. IMPORTANTE: o efeito principal deste marcador ' +
      'não é escalonar nível, e sim mudar a modalidade — ver roteamento para equipe eSF (A13).',
    origem: 'A13',
    assinatura: PENDENTE,
  },
  {
    id: 'puerpera',
    rotulo: 'Pós-parto (até 42 dias)',
    bloco: 'gravidez_pos_parto',
    escalonaTiposQueixa: ['obstetrica', 'infecciosa'],
    comoAPessoaDescreve: ['ganhei neném faz pouco', 'pós-parto', 'puérpera', 'tive bebê semana passada'],
    justificativaFisiopatologica:
      'Risco de infecção puerperal, hemorragia tardia e tromboembolismo. Também é variável de ' +
      'roteamento para a maternidade de referência (A11).',
    origem: 'A1',
    assinatura: PENDENTE,
  },
  {
    id: 'crianca_menor_2',
    rotulo: 'Criança com menos de 2 anos',
    bloco: 'outros',
    escalonaTiposQueixa: ['pediatrica', 'infecciosa', 'respiratoria', 'gastrointestinal'],
    comoAPessoaDescreve: ['meu bebê', 'meu filho de 1 ano', 'neném', 'criança pequena'],
    justificativaFisiopatologica: 'Deterioração rápida e reserva fisiológica reduzida.',
    origem: 'A1',
    assinatura: PENDENTE,
  },
]);

/**
 * Idade como agravante — A1.
 *
 * "elevar o corte de idade isolada para 75+ ou exigir idade SOMADA a sinal agudo".
 * Implementadas as duas: 75+ escalona sozinho; 60–74 exige um sinal agudo junto.
 */
export const REGRA_IDADE = {
  idadeIsoladaEscalona: 75,
  faixaExigeSinalAgudo: { min: 60, max: 74 },
  /** Tipos de queixa em que a idade avançada tem impacto fisiopatológico reconhecido. */
  tiposQueixaSensiveis: [
    'cardiovascular', 'neurologica', 'respiratoria', 'infecciosa', 'gastrointestinal', 'metabolica',
  ] as const,
  justificativa:
    'Idade 60+ é a demanda da UBS, não uma exceção. Aplicá-la como agravante universal ' +
    'reorientaria o fluxo da Atenção Básica para a urgência (A1).',
  origem: 'A1' as const,
  assinatura: PENDENTE,
};

/**
 * Regra de acumulação. A revisão registra uma inconsistência no documento original:
 * "a regra 'vários agravantes juntos não somam degraus' convive com a ressalva 'nunca
 * transformam um caso azul em emergência'. Com escalonamento de um único degrau, a segunda
 * ressalva é logicamente impossível de violar — o que sugere que o código pode acumular
 * agravantes de forma diferente do que o documento descreve."
 *
 * Aqui a regra é única, explícita e testável: no máximo UM degrau, independentemente de
 * quantos agravantes se apliquem.
 */
export const MAX_DEGRAUS_POR_AGRAVANTE = 1;

const AGRAVANTES_POR_ID = new Map(AGRAVANTES.map((a) => [a.id, a]));

export function agravantePorId(id: string): Agravante | undefined {
  return AGRAVANTES_POR_ID.get(id);
}

/** D3 — os quatro blocos de linguagem simples para a tela enxuta de seleção. */
export const BLOCOS_AGRAVANTES = [
  { id: 'coracao_pressao', rotulo: 'Coração ou pressão', icone: '❤️' },
  { id: 'diabetes', rotulo: 'Diabetes', icone: '🩸' },
  { id: 'pulmao', rotulo: 'Pulmão', icone: '🫁' },
  { id: 'gravidez_pos_parto', rotulo: 'Gravidez ou pós-parto', icone: '🤰' },
  { id: 'outros', rotulo: 'Outras condições', icone: '➕' },
] as const;
