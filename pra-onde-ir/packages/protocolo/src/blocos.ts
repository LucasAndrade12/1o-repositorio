/**
 * B4 (CRÍTICO) — bloco fixo de perguntas de segurança.
 * A12 (ALTO) — safety-netting nos cinco níveis.
 * B8 (MÉDIO) — roteiros fechados mais longos em domínio sensível.
 *
 * B4 é o achado estrutural mais importante da Parte B:
 *
 * "Todo o poder de detecção do sistema está condicionado a a pessoa MENCIONAR o sinal. Quem
 *  escreve 'tô passando mal', 'tô ruim', 'não tô bom' — que é como boa parte da população
 *  efetivamente descreve o que sente — não aciona critério algum e cai no acolhimento genérico.
 *  Resultado: o sistema é sensível para quem já sabe descrever sintomas, e cego para quem não
 *  sabe — que é exatamente a população que mais precisa de orientação."
 *
 * "São dez segundos de interação que multiplicam a sensibilidade e não dependem de rede nem de IA.
 *  Para relatos vagos ('passando mal'), essa lista deixa de ser complemento e passa a ser o
 *  MECANISMO PRINCIPAL de triagem."
 */

import type { Nivel, PerguntaSeguranca, SafetyNetting } from './tipos.js';

/**
 * As sete perguntas fechadas, cobrindo as bandeiras de maior letalidade.
 * Determinísticas, sem IA, sem rede — rodam também no PWA offline (B9).
 */
export const BLOCO_SEGURANCA: readonly PerguntaSeguranca[] = Object.freeze([
  {
    id: 'bs.peito',
    pergunta: 'Está com dor ou aperto no peito?',
    ajuda: 'Peso, aperto ou dor no meio do peito, que pode ir para o braço, o pescoço ou as costas.',
    icone: '💔',
    acionaCriterios: ['vm.dor_toracica'],
    origem: 'B4',
  },
  {
    id: 'bs.falta_ar',
    pergunta: 'Está com falta de ar?',
    ajuda: 'Dificuldade de respirar mesmo parado, ou não consegue falar uma frase inteira.',
    icone: '🫁',
    acionaCriterios: ['vm.falta_ar_grave'],
    origem: 'B4',
  },
  {
    id: 'bs.fraqueza_lado',
    pergunta: 'Está com fraqueza ou dormência de um lado do corpo?',
    ajuda: 'Um braço ou uma perna que ficou sem força, mole, ou dormente — só de um lado.',
    icone: '🫱',
    acionaCriterios: ['vm.avc'],
    origem: 'B4',
  },
  {
    id: 'bs.boca_torta',
    pergunta: 'A boca ou o rosto ficaram tortos?',
    ajuda: 'Peça para a pessoa sorrir. Se um lado não sobe, é sinal de alerta.',
    icone: '😐',
    acionaCriterios: ['vm.avc'],
    origem: 'B4',
  },
  {
    id: 'bs.desmaio',
    pergunta: 'Desmaiou ou apagou?',
    ajuda: 'Perdeu a consciência, mesmo que por poucos segundos.',
    icone: '😵',
    acionaCriterios: ['vm.rebaixamento'],
    origem: 'B4',
  },
  {
    id: 'bs.sangramento',
    pergunta: 'Está com sangramento que não para?',
    ajuda: 'Sangue que continua saindo mesmo apertando com um pano por alguns minutos.',
    icone: '🩸',
    acionaCriterios: ['vm.hemorragia_ativa'],
    origem: 'B4',
  },
  {
    id: 'bs.febre_pescoco',
    pergunta: 'Está com febre e o pescoço duro?',
    ajuda: 'Não consegue encostar o queixo no peito, com febre e dor de cabeça forte.',
    icone: '🌡️',
    acionaCriterios: ['vm.meningite'],
    origem: 'B4',
  },
]);

/**
 * B8 — roteiros fechados e determinísticos, mais longos, em domínio sensível.
 *
 * "a regra 'a IA faz no máximo uma pergunta' é razoável para dor de garganta e inadequada para
 *  risco autoprovocado, onde a estratificação depende de mais de uma informação. (…) perguntas
 *  fixas escritas pela equipe clínica não são a IA fazendo perguntas — são formulário,
 *  auditável e testável."
 */
export interface Roteiro {
  id: string;
  dominio: string;
  /** A IA NÃO gera estas perguntas. Elas são escritas e validadas pela equipe. */
  geradoPelaIA: false;
  perguntas: { id: string; pergunta: string; opcoes: string[]; elevaPara?: Nivel }[];
  origem: 'B8';
  assinatura: null;
}

export const ROTEIROS_SENSIVEIS: readonly Roteiro[] = Object.freeze([
  {
    id: 'rot.risco_autoprovocado',
    dominio: 'saude_mental',
    geradoPelaIA: false,
    perguntas: [
      {
        id: 'ideacao',
        pergunta: 'Nos últimos dias, você teve pensamentos de que seria melhor não estar viva ou vivo?',
        opcoes: ['Não', 'Passou pela cabeça', 'Sim, com frequência'],
      },
      {
        id: 'plano',
        pergunta: 'Você chegou a pensar em COMO faria isso?',
        opcoes: ['Não', 'Pensei vagamente', 'Sim, tenho um plano'],
        elevaPara: 'vermelho',
      },
      {
        id: 'meio',
        pergunta: 'Você tem acesso ao que precisaria para isso?',
        opcoes: ['Não', 'Talvez', 'Sim'],
        elevaPara: 'vermelho',
      },
      {
        id: 'tentativa_previa',
        pergunta: 'Você já tentou tirar a própria vida antes?',
        opcoes: ['Não', 'Sim, há muito tempo', 'Sim, recentemente'],
        elevaPara: 'laranja',
      },
      {
        id: 'suporte',
        pergunta: 'Tem alguém com você agora, ou alguém que possa ficar com você?',
        opcoes: ['Sim', 'Não'],
      },
    ],
    origem: 'B8',
    assinatura: null,
  },
  {
    id: 'rot.pediatrico',
    dominio: 'pediatrica',
    geradoPelaIA: false,
    // A7 — "o relato pediátrico é sempre feito por terceiro, este é o bloco que mais se beneficia
    // de perguntas fechadas com linguagem de cuidador".
    perguntas: [
      { id: 'mama', pergunta: 'Ele ou ela está mamando/bebendo normal?', opcoes: ['Sim', 'Menos que o normal', 'Não consegue'], elevaPara: 'vermelho' },
      { id: 'vomita', pergunta: 'Está vomitando tudo o que toma?', opcoes: ['Não', 'Às vezes', 'Vomita tudo'], elevaPara: 'vermelho' },
      { id: 'tiragem', pergunta: 'Tem afundado a barriguinha entre as costelas quando respira?', opcoes: ['Não', 'Sim'], elevaPara: 'vermelho' },
      { id: 'letargia', pergunta: 'Está muito molinho, difícil de acordar?', opcoes: ['Não', 'Sim'], elevaPara: 'vermelho' },
      { id: 'convulsao', pergunta: 'Teve algum tremor ou convulsão nesta doença?', opcoes: ['Não', 'Sim'], elevaPara: 'vermelho' },
      { id: 'urina', pergunta: 'Está fazendo xixi normalmente? A fralda tem ficado molhada?', opcoes: ['Sim', 'Menos que o normal', 'Está seca há muitas horas'], elevaPara: 'laranja' },
    ],
    origem: 'B8',
    assinatura: null,
  },
  {
    id: 'rot.arbovirose',
    dominio: 'arbovirose',
    geradoPelaIA: false,
    perguntas: [
      { id: 'dor_abdominal', pergunta: 'Está com dor forte na barriga, que não passa?', opcoes: ['Não', 'Sim'], elevaPara: 'laranja' },
      { id: 'vomito', pergunta: 'Está vomitando sem parar ou não consegue segurar líquido?', opcoes: ['Não', 'Sim'], elevaPara: 'laranja' },
      { id: 'sangramento', pergunta: 'Apareceu sangramento — gengiva, nariz, urina, fezes ou manchas roxas?', opcoes: ['Não', 'Sim'], elevaPara: 'vermelho' },
      { id: 'tontura', pergunta: 'Sente tontura forte ou quase desmaia ao levantar?', opcoes: ['Não', 'Sim'], elevaPara: 'laranja' },
      { id: 'sonolencia', pergunta: 'Está muito sonolento, confuso ou muito irritado?', opcoes: ['Não', 'Sim'], elevaPara: 'vermelho' },
      { id: 'defervescencia', pergunta: 'A febre baixou de repente e você se sentiu PIOR depois disso?', opcoes: ['Não', 'Sim'], elevaPara: 'laranja' },
    ],
    origem: 'B8',
    assinatura: null,
  },
  {
    id: 'rot.gestacao',
    dominio: 'obstetrica',
    geradoPelaIA: false,
    perguntas: [
      { id: 'semanas', pergunta: 'De quantas semanas está a gestação?', opcoes: ['Menos de 20', '20 a 36', '37 ou mais', 'Não sei'] },
      { id: 'sangramento', pergunta: 'Está com sangramento?', opcoes: ['Não', 'Pouco', 'Muito'], elevaPara: 'vermelho' },
      { id: 'movimento', pergunta: 'O bebê está se mexendo como de costume?', opcoes: ['Sim', 'Menos', 'Parou de mexer'], elevaPara: 'vermelho' },
      { id: 'liquido', pergunta: 'Perdeu líquido pela vagina?', opcoes: ['Não', 'Sim'], elevaPara: 'laranja' },
      { id: 'visao', pergunta: 'Está com dor de cabeça forte ou vendo embaçado?', opcoes: ['Não', 'Sim'], elevaPara: 'vermelho' },
    ],
    origem: 'B8',
    assinatura: null,
  },
]);

/**
 * A12 (ALTO) — safety-netting em TODOS os cinco níveis.
 *
 * "o documento menciona 'sinais de alerta explícitos' apenas para o nível AZUL. Todo sistema de
 *  triagem precisa de rede de segurança em TODOS os níveis: o que observar, em quanto tempo
 *  reavaliar, e o que fazer se piorar."
 */
export const SAFETY_NETTING: Readonly<Record<Nivel, SafetyNetting>> = Object.freeze({
  vermelho: {
    nivel: 'vermelho',
    observar: [
      'Se a pessoa parar de responder ou de respirar.',
      'Se o sangramento aumentar.',
      'Se surgir convulsão.',
    ],
    prazoReavaliacao: 'Enquanto espera a ambulância — fique ao lado o tempo todo.',
    voltarSe: [
      'Se a ambulância demorar e a pessoa piorar, ligue 192 de novo e informe a mudança.',
      'Não leve por conta própria sem falar com o 192 antes.',
    ],
  },
  laranja: {
    nivel: 'laranja',
    observar: [
      'Dor que aumenta muito.',
      'Falta de ar nova ou que piora.',
      'Desmaio, confusão ou muita sonolência.',
      'Vômito que não para ou incapacidade de beber líquido.',
      'Febre que sobe muito ou não cede.',
    ],
    prazoReavaliacao: 'Vá agora. Se ainda estiver esperando em 1 hora, reavalie os sinais acima.',
    voltarSe: [
      'Se aparecer qualquer sinal da lista, ligue 192 imediatamente.',
      'Se não conseguir se deslocar, use o app de novo e informe isso — a equipe pode ser acionada.',
    ],
  },
  amarelo: {
    nivel: 'amarelo',
    observar: [
      'Dor no peito ou falta de ar.',
      'Fraqueza de um lado do corpo, boca torta ou fala embolada.',
      'Febre com pescoço duro ou manchas roxas.',
      'Vômito persistente ou barriga muito dura.',
      'Desmaio ou confusão.',
    ],
    prazoReavaliacao: 'Reavalie em até 12 horas, ou antes se algo mudar.',
    voltarSe: [
      'Se aparecer qualquer sinal da lista, procure atendimento imediatamente ou ligue 192.',
      'Se não melhorar em 48 horas, volte a usar o app ou procure a UBS.',
    ],
  },
  verde: {
    nivel: 'verde',
    observar: [
      'Piora do que você sente hoje.',
      'Febre alta que aparece.',
      'Dor que passa a impedir dormir, andar ou trabalhar.',
    ],
    prazoReavaliacao: 'Reavalie em 48 a 72 horas.',
    voltarSe: [
      'Se aparecer febre alta, falta de ar ou dor intensa, volte a usar o app no mesmo momento.',
      'Se o sintoma persistir além de uma semana, procure a UBS mesmo com a consulta agendada.',
    ],
  },
  azul: {
    nivel: 'azul',
    observar: [
      'Febre que passa de 3 dias.',
      'Falta de ar ou chiado.',
      'Dor que piora em vez de melhorar.',
      'Manchas na pele ou sangramento.',
      'Muita sonolência ou confusão.',
    ],
    prazoReavaliacao: 'Reavalie em 48 horas.',
    voltarSe: [
      'Volte a usar o app se aparecer qualquer um dos sinais acima.',
      'Se você se sentir pior em vez de melhor, procure a UBS.',
    ],
  },
});

/**
 * A12 — módulo "enquanto a ajuda não chega".
 *
 * "em vermelho, o sistema orienta ligar 192 e não sair de casa — e não diz absolutamente nada
 *  sobre o que fazer nos minutos de espera. Em hipoglicemia, engasgo, convulsão, sangramento
 *  externo e queimadura química, a conduta dos primeiros minutos muda o desfecho mais do que o
 *  tempo de chegada da ambulância. Esta é provavelmente a funcionalidade de maior impacto
 *  clínico por menor esforço técnico de todo o roteiro."
 *
 * Os textos vivem no próprio critério (campo `primeirosMinutos`), redigidos para serem
 * assinados pela retaguarda médica — e NUNCA gerados pela IA.
 */
export const PRIMEIROS_MINUTOS_GENERICO: readonly string[] = Object.freeze([
  'Ligue 192 e siga as orientações do atendente — ele conduz você pelo telefone.',
  'Não deixe a pessoa sozinha.',
  'Deixe a porta destrancada para a equipe entrar.',
  'Separe a lista de remédios que a pessoa usa e um documento, se der tempo.',
]);

export const AVISO_PRIMEIROS_MINUTOS =
  'Estas orientações são de primeiros socorros e devem ser revisadas e assinadas pela ' +
  'retaguarda médica da unidade antes do uso com pacientes reais (A12).';

/**
 * D2 — primeira tela.
 * "os agravantes descrevem o paciente, não quem digita. Sem uma distinção explícita, o sistema
 *  pode combinar o sintoma de uma pessoa com as comorbidades de outra."
 */
export const PERGUNTA_PARA_QUEM = {
  id: 'para_quem',
  pergunta: 'Este atendimento é para você ou para outra pessoa?',
  opcoes: [
    { id: 'proprio', rotulo: 'Para mim', icone: '🙋' },
    { id: 'terceiro', rotulo: 'Para outra pessoa', icone: '🧑‍🤝‍🧑' },
  ],
  origem: 'D2' as const,
};

/**
 * D5 — barreira de deslocamento.
 * "a proporção de pessoas sem meio de deslocamento é um dado valioso para a Secretaria e
 *  ninguém o coleta hoje."
 */
export const PERGUNTA_DESLOCAMENTO = {
  id: 'deslocamento',
  pergunta: 'Você tem como se deslocar até lá agora?',
  ajuda: 'Transporte, dinheiro para a passagem, ou alguém que possa acompanhar.',
  opcoes: [
    { id: 'sim', rotulo: 'Sim, consigo ir' },
    { id: 'nao', rotulo: 'Não tenho como ir' },
  ],
  aplicaAosNiveis: ['laranja', 'amarelo'] as Nivel[],
  origem: 'D5' as const,
};

/**
 * B1 — a pergunta de confirmação determinística.
 *
 * "Manter a irreversibilidade e resolver o falso positivo NA ENTRADA, com uma pergunta fechada
 *  determinística (não com a IA rebaixando nível): ao detectar bandeira vermelha na camada 1,
 *  o sistema pergunta 'Isso está acontecendo agora, com a pessoa que precisa de atendimento?'
 *  — sim mantém, não remove o disparo daquela varredura específica e REGISTRA O MOTIVO."
 */
export const PERGUNTA_CONFIRMACAO_BANDEIRA = {
  id: 'confirmacao_bandeira',
  pergunta: 'Isso está acontecendo AGORA, com a pessoa que precisa de atendimento?',
  ajuda: 'Responda "não" se isso já aconteceu no passado, ou se é sobre outra pessoa que não vai ser atendida.',
  opcoes: [
    { id: 'sim', rotulo: 'Sim, está acontecendo agora' },
    { id: 'nao', rotulo: 'Não — foi antes, ou é sobre outra pessoa' },
  ],
  origem: 'B1' as const,
};

/**
 * D4 — grade de queixas comuns com ícones, como caminho alternativo ao texto livre.
 * "um sistema cuja porta de entrada é ESCREVER UM RELATO EM TEXTO LIVRE exclui quem tem baixo
 *  letramento, quem tem dificuldade motora com teclado e boa parte dos idosos — que são,
 *  simultaneamente, o grupo de maior risco clínico e o mais escalonado pelos agravantes."
 */
export const GRADE_QUEIXAS = [
  { id: 'peito', rotulo: 'Dor no peito', icone: '💔', texto: 'dor no peito' },
  { id: 'ar', rotulo: 'Falta de ar', icone: '🫁', texto: 'falta de ar' },
  { id: 'febre', rotulo: 'Febre', icone: '🌡️', texto: 'estou com febre' },
  { id: 'cabeca', rotulo: 'Dor de cabeça', icone: '🤕', texto: 'dor de cabeça' },
  { id: 'barriga', rotulo: 'Dor na barriga', icone: '😖', texto: 'dor na barriga' },
  { id: 'garganta', rotulo: 'Dor de garganta', icone: '😷', texto: 'dor de garganta' },
  { id: 'vomito', rotulo: 'Vômito ou diarreia', icone: '🤢', texto: 'vomitando e com diarreia' },
  { id: 'pressao', rotulo: 'Pressão alta', icone: '🩺', texto: 'minha pressão está alta' },
  { id: 'acucar', rotulo: 'Açúcar alterado', icone: '🩸', texto: 'meu açúcar está alterado' },
  { id: 'ferida', rotulo: 'Ferida ou corte', icone: '🩹', texto: 'tenho uma ferida' },
  { id: 'dente', rotulo: 'Dor de dente', icone: '🦷', texto: 'dor de dente' },
  { id: 'urina', rotulo: 'Problema para urinar', icone: '🚻', texto: 'ardência para urinar' },
  { id: 'coluna', rotulo: 'Dor nas costas', icone: '🦴', texto: 'dor nas costas' },
  { id: 'mental', rotulo: 'Ansiedade ou tristeza', icone: '💭', texto: 'estou muito ansioso e triste' },
  { id: 'crianca', rotulo: 'Criança doente', icone: '👶', texto: 'minha criança está doente' },
  { id: 'receita', rotulo: 'Renovar receita', icone: '📋', texto: 'preciso renovar a receita' },
] as const;
