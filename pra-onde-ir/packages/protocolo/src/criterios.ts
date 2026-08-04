/**
 * Catálogo de critérios do protocolo v2.
 *
 * Cada critério carrega o achado da revisão que o originou (`origem`) e o campo
 * `assinatura`, que nasce `null`. Nenhum valor clínico aqui é válido antes da assinatura
 * da enfermeira do acolhimento e da retaguarda médica.
 *
 * Ordem: vermelhos (v1 + as 12 lacunas de A5), laranjas, amarelos, verdes, azuis,
 * seguidos dos módulos A6 (arbovirose), A7 (pediatria), A8 (saúde mental) e A9 (violência).
 */

import type { Criterio } from './tipos.js';

const PENDENTE = null;

// ─────────────────────────────────────────────────────────────────────────────
// VERMELHO — emergência. Bandeira irreversível, curto-circuito para o SAMU (B2).
// A revisão reconhece boa cobertura original de dor torácica, AVC, convulsão, trauma,
// anafilaxia, gestação, pediatria e risco autoprovocado. Estes são mantidos.
// ─────────────────────────────────────────────────────────────────────────────

const VERMELHOS_V1: Criterio[] = [
  {
    id: 'vm.dor_toracica',
    titulo: 'Dor no peito com sinais de gravidade',
    descricao:
      'Dor ou aperto no peito, especialmente com irradiação para braço, mandíbula ou costas, ' +
      'associada a suor frio, falta de ar, náusea ou palidez.',
    nivel: 'vermelho',
    tipoQueixa: 'cardiovascular',
    comoAPessoaDescreve: [
      'dor no peito', 'aperto no peito', 'peito apertado', 'dor no coração',
      'peso no peito', 'dor no peito e suando frio', 'dor no braço esquerdo',
      'queimação no peito com falta de ar', 'opressão no peito',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 agora e fique no telefone.',
      'Pare qualquer esforço. Sente ou deite com o tronco elevado.',
      'Afrouxe roupas apertadas.',
      'Não dirija e não vá por conta própria.',
      'Se a pessoa desmaiar e parar de respirar, o atendente do 192 orienta a massagem pelo telefone.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.avc',
    titulo: 'Sinais de AVC',
    descricao:
      'Início súbito de: fraqueza ou dormência de um lado do corpo, boca ou rosto torto, ' +
      'fala embolada ou dificuldade de falar, perda de visão súbita, desequilíbrio súbito.',
    nivel: 'vermelho',
    tipoQueixa: 'neurologica',
    comoAPessoaDescreve: [
      'boca torta', 'rosto torto', 'boca entortou', 'braço caindo', 'braço mole',
      'fala embolada', 'falando enrolado', 'não consegue falar', 'perdeu a força de um lado',
      'dormência de um lado', 'derrame', 'avc', 'ficou torto do rosto',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 agora e diga a hora em que os sinais começaram — isso muda o tratamento.',
      'Não dê comida, bebida nem remédio pela boca.',
      'Deite a pessoa de lado, com a cabeça um pouco elevada.',
      'Não espere melhorar. Não vá de carro por conta própria.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.convulsao',
    titulo: 'Convulsão em curso ou repetida',
    descricao:
      'Crise convulsiva acontecendo agora, crise com mais de 5 minutos, crises repetidas sem ' +
      'recuperação entre elas, ou primeira crise da vida.',
    nivel: 'vermelho',
    tipoQueixa: 'neurologica',
    comoAPessoaDescreve: [
      'convulsão', 'convulsionando', 'tendo ataque', 'ataque epilético', 'tremendo todo e roxo',
      'virou os olhos e tremeu', 'caiu duro tremendo',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 e marque a hora em que começou.',
      'Proteja a cabeça com algo macio. Afaste móveis e objetos duros.',
      'NÃO segure a pessoa e NÃO coloque nada na boca.',
      'Depois que parar de tremer, vire de lado.',
      'Fique ao lado até a ambulância chegar.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.falta_ar_grave',
    titulo: 'Falta de ar grave',
    descricao:
      'Dificuldade de respirar em repouso, incapacidade de completar uma frase, chiado intenso, ' +
      'lábios ou dedos arroxeados, respiração muito rápida.',
    nivel: 'vermelho',
    tipoQueixa: 'respiratoria',
    comoAPessoaDescreve: [
      'não consigo respirar', 'falta de ar forte', 'sem ar', 'roxo', 'lábio roxo',
      'respirando muito rápido', 'cansaço pra respirar', 'chiando muito',
      'não consegue falar de falta de ar',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 agora.',
      'Sente a pessoa com o tronco inclinado para a frente. Não deite.',
      'Abra janelas, afrouxe a roupa.',
      'Se usa bombinha de resgate, use conforme orientado pela equipe.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.anafilaxia',
    titulo: 'Reação alérgica grave (anafilaxia)',
    descricao:
      'Inchaço de lábios, língua ou garganta, dificuldade de respirar ou engolir, placas pelo ' +
      'corpo com mal-estar, após alimento, medicamento ou picada.',
    nivel: 'vermelho',
    tipoQueixa: 'infecciosa',
    comoAPessoaDescreve: [
      'inchou a boca', 'inchou a língua', 'garganta fechando', 'não consigo engolir',
      'alergia forte', 'empolou o corpo todo', 'tomei remédio e inchei',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 agora.',
      'Se a pessoa tem caneta de adrenalina prescrita, use conforme orientado.',
      'Deite a pessoa com as pernas elevadas; se estiver com falta de ar, deixe sentada.',
      'Retire o ferrão da picada raspando de lado — não aperte.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.hemorragia_ativa',
    titulo: 'Sangramento que não para',
    descricao: 'Sangramento externo abundante que não cessa com compressão, ou vômito com sangue vivo.',
    nivel: 'vermelho',
    tipoQueixa: 'trauma',
    comoAPessoaDescreve: [
      'sangrando muito', 'não para de sangrar', 'sangue jorrando', 'vomitando sangue',
      'perdendo muito sangue',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192.',
      'Comprima o ferimento com um pano limpo, com força, e NÃO tire para olhar.',
      'Se o pano encharcar, coloque outro por cima sem retirar o primeiro.',
      'Eleve o membro ferido, se possível.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.rebaixamento',
    titulo: 'Desmaio com não recuperação ou confusão intensa',
    descricao:
      'Pessoa não responde ao chamado, desmaiou e não acordou, ou está muito confusa e sonolenta.',
    nivel: 'vermelho',
    tipoQueixa: 'neurologica',
    comoAPessoaDescreve: [
      'desmaiou e não acordou', 'não responde', 'não acorda', 'apagou', 'muito confuso',
      'não reconhece ninguém', 'deu um treco e ficou esmorecido',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192.',
      'Vire a pessoa de lado para não engasgar.',
      'Verifique se está respirando. Se não estiver, o atendente do 192 orienta pelo telefone.',
      'Não dê nada pela boca.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.trauma_grave',
    titulo: 'Trauma grave',
    descricao:
      'Acidente com veículo em alta velocidade, queda de altura, deformidade de membro, ' +
      'traumatismo de cabeça com desmaio ou vômito, ferimento por arma.',
    nivel: 'vermelho',
    tipoQueixa: 'trauma',
    comoAPessoaDescreve: [
      'bateu de moto', 'caiu do telhado', 'atropelado', 'osso pra fora', 'perna torta',
      'bateu a cabeça e desmaiou', 'levou tiro', 'levou facada',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192.',
      'NÃO mexa no pescoço nem tente sentar a pessoa.',
      'Comprima sangramentos com pano limpo.',
      'Cubra a pessoa para ela não perder calor.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.meningite',
    titulo: 'Suspeita de meningite',
    descricao: 'Febre com pescoço duro, dor de cabeça intensa, manchas roxas na pele, vômitos e confusão.',
    nivel: 'vermelho',
    tipoQueixa: 'infecciosa',
    comoAPessoaDescreve: [
      'febre e pescoço duro', 'não consegue encostar o queixo no peito', 'manchas roxas no corpo',
      'dor de cabeça muito forte com febre',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: ['Ligue 192.', 'Deixe o ambiente com pouca luz e barulho.', 'Não dê remédio por conta própria.'],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.risco_autoprovocado_iminente',
    titulo: 'Risco imediato à própria vida',
    descricao:
      'Tentativa em curso ou recém-ocorrida, plano definido com meio disponível e intenção imediata.',
    nivel: 'vermelho',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: [
      'vou me matar agora', 'tomei os comprimidos', 'me cortei fundo', 'estou com a arma',
      'não aguento mais e vou fazer',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 agora. Se puder, ligue também para o CVV no 188 — atende 24 horas, de graça.',
      'Não deixe a pessoa sozinha.',
      'Retire do alcance medicamentos, armas, facas e cordas.',
      'Fique perto e escute sem julgar. Você não precisa ter a resposta certa.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.obstetrica_grave',
    titulo: 'Emergência obstétrica',
    descricao:
      'Gestante com sangramento intenso, convulsão, dor de cabeça forte com visão embaçada, ' +
      'perda de líquido com cordão visível, ou parada de movimentos do bebê.',
    nivel: 'vermelho',
    tipoQueixa: 'obstetrica',
    comoAPessoaDescreve: [
      'grávida sangrando muito', 'grávida com convulsão', 'grávida com dor de cabeça e vendo embaçado',
      'bebê parou de mexer', 'estourou a bolsa e saiu o cordão',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 e diga de quantas semanas está a gestação.',
      'Deite do lado esquerdo.',
      'Não coma nem beba nada.',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vm.hipoglicemia',
    titulo: 'Hipoglicemia com alteração de consciência',
    descricao:
      'Glicemia abaixo do limiar definido pela retaguarda OU equivalente clínico: tremor, suor ' +
      'frio, confusão ou desmaio em pessoa que usa insulina ou medicação para diabetes.',
    nivel: 'vermelho',
    tipoQueixa: 'metabolica',
    comoAPessoaDescreve: [
      'açúcar baixo', 'glicemia baixa', 'tremendo e suando frio', 'diabético passando mal',
      'ficou confuso e suando', 'deu hipoglicemia',
    ],
    tempoDependente: true,
    irreversivel: true,
    // A14 — a conduta que resolve a maioria dos episódios em minutos vem ANTES do deslocamento.
    primeirosMinutos: [
      'SE A PESSOA ESTÁ ACORDADA E CONSEGUE ENGOLIR: dê agora meio copo de suco ou refrigerante ' +
        'comum (não diet), ou uma colher de sopa de açúcar na água. Espere 15 minutos.',
      'SE NÃO ACORDA OU NÃO CONSEGUE ENGOLIR: não force nada pela boca. Vire de lado e ligue 192.',
      'Depois que melhorar, ofereça um lanche com pão ou bolacha.',
      'Ligue 192 se não melhorar em 15 minutos ou se voltar a piorar.',
    ],
    fonte: 'Conduta a ser revisada e assinada pela retaguarda médica (A14).',
    origem: 'v1',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A5 (CRÍTICO) — as 12 lacunas em bandeiras vermelhas tempo-dependentes.
//
// "quadros com janela terapêutica curta que hoje caem na cláusula de escape
//  'relato não reconhecido → UBS'. Isso não é uma falha teórica."
//
// A revisão manda levar esta lista à retaguarda para decidir QUAIS entram como vermelho,
// quais como laranja e quais viram pergunta de checagem. Os níveis abaixo são proposta
// de partida — todos com assinatura pendente.
// ─────────────────────────────────────────────────────────────────────────────

const LACUNAS_A5: Criterio[] = [
  {
    id: 'a5.melena',
    titulo: 'Melena / hemorragia digestiva alta',
    descricao:
      'Fezes pretas, pastosas e de odor forte (sangue digerido), com ou sem fraqueza, tontura ' +
      'ou palidez. Distinto de "sangue vivo nas fezes", que já era previsto.',
    nivel: 'vermelho',
    tipoQueixa: 'gastrointestinal',
    comoAPessoaDescreve: [
      'fezes pretas', 'cocô preto', 'fezes como borra de café', 'cocô preto fedendo muito',
      'fezes pretas e tô fraca', 'evacuando preto',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 se estiver muito fraca, tonta ou pálida.',
      'Não coma nem beba nada até ser avaliada.',
      'Se tiver como, guarde uma foto ou registre a cor das fezes para mostrar à equipe.',
    ],
    fonte: 'Lacuna A5 — "sangramento digerido não é vermelho vivo e passa despercebido".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.torcao_testicular',
    titulo: 'Torção testicular / escroto agudo',
    descricao:
      'Dor súbita e intensa no testículo, com ou sem inchaço, náusea ou dor abdominal. ' +
      'Janela cirúrgica curta — perda do testículo se atrasar.',
    nivel: 'vermelho',
    tipoQueixa: 'urologica',
    comoAPessoaDescreve: [
      'dor forte no saco', 'dor no testículo', 'testículo inchado', 'dor no saco desde de madrugada',
      'bola inchada e doendo', 'dor forte no ovo',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Vá agora — cada hora conta para salvar o testículo.',
      'Não coma nem beba nada, pode ser preciso operar.',
      'Não coloque bolsa quente.',
    ],
    fonte: 'Lacuna A5 — janela cirúrgica curta.',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.corpo_estranho_via_aerea',
    titulo: 'Obstrução de via aérea por corpo estranho',
    descricao:
      'Engasgo com dificuldade de respirar, tossir ou falar, após engolir alimento ou objeto. ' +
      'Minutos. Exige orientação de manobra imediata, não deslocamento.',
    nivel: 'vermelho',
    tipoQueixa: 'respiratoria',
    comoAPessoaDescreve: [
      'engasgou', 'engoliu e não sai', 'não consegue tossir', 'entalou na garganta',
      'engasgou com comida', 'engoliu moeda', 'engoliu objeto', 'engoliu pilha',
      'engoliu brinquedo', 'engoliu bateria', 'engoliu botão', 'engoliu espinha',
      'engoliu e está tossindo', 'engoliu uma moeda e tá tossindo',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'SE A PESSOA CONSEGUE TOSSIR: incentive a tossir com força. Não bata nas costas nem dê água.',
      'SE NÃO CONSEGUE TOSSIR, FALAR OU RESPIRAR: ligue 192 e comece a manobra agora.',
      'ADULTO OU CRIANÇA MAIOR: fique atrás, abrace a barriga acima do umbigo e faça ' +
        'compressões rápidas para dentro e para cima.',
      'BEBÊ MENOR DE 1 ANO: deite de bruços no seu antebraço, com a cabeça mais baixa, e dê ' +
        '5 tapas firmes entre as escápulas; depois vire e faça 5 compressões no meio do peito.',
      'Continue até o objeto sair ou a ajuda chegar.',
    ],
    fonte: 'Lacuna A5 — "Exige orientação de manobra imediata, não deslocamento".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.cauda_equina',
    titulo: 'Síndrome da cauda equina',
    descricao:
      'Dor lombar com perda de força ou dormência nas pernas, dormência na região entre as ' +
      'pernas (em sela), ou perda do controle de urina ou fezes. Déficit permanente se não descomprimido.',
    nivel: 'vermelho',
    tipoQueixa: 'neurologica',
    comoAPessoaDescreve: [
      'dor nas costas e não sinto as pernas', 'não consigo segurar o xixi',
      'dormência entre as pernas', 'perna dormente e dor na coluna',
      'fiz xixi sem sentir', 'perdi a força nas pernas',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Vá agora — o tempo até a cirurgia decide se a função volta.',
      'Evite andar ou carregar peso.',
      'Anote a que horas a dormência ou a perda de urina começou.',
    ],
    fonte: 'Lacuna A5 — déficit permanente se não descomprimido.',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.sepse_adulto',
    titulo: 'Sepse no adulto',
    descricao:
      'Febre ou hipotermia com confusão mental, respiração rápida, pressão baixa, tremor ' +
      'intenso ou sonolência. No idoso pode se apresentar só como confusão e prostração. ' +
      'Foco urinário ou pulmonar não tinha porta no protocolo original.',
    nivel: 'vermelho',
    tipoQueixa: 'infecciosa',
    comoAPessoaDescreve: [
      'febre e muito confuso', 'tremendo muito e pressão baixa', 'respirando rápido e sonolento',
      'idoso confuso com febre', 'muito confusa com febre e respirando rápido', 'febre e prostrado',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192. Diga que há febre com confusão mental — isso muda a prioridade.',
      'Ofereça água se a pessoa estiver acordada e engolindo bem.',
      'Não dê antibiótico por conta própria.',
    ],
    fonte:
      'Lacuna A5 — "Hoje febre + confusão só existe sob suspeita de meningite; sepse de foco ' +
      'urinário/pulmonar em idoso não tem porta".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.queimadura_via_aerea',
    titulo: 'Queimadura de via aérea / inalação de fumaça',
    descricao:
      'Exposição a fogo ou fumaça em ambiente fechado, com rouquidão, tosse com fuligem, ' +
      'queimadura de face, chamuscamento de pelos do nariz. Edema progressivo — a janela fecha.',
    nivel: 'vermelho',
    tipoQueixa: 'respiratoria',
    comoAPessoaDescreve: [
      'inalou fumaça', 'queimou o rosto no incêndio', 'rouco depois do fogo',
      'respirou fumaça', 'tossindo preto depois do incêndio',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 mesmo que a pessoa pareça bem — o inchaço da garganta piora com o tempo.',
      'Leve para o ar livre.',
      'Não dê nada pela boca.',
      'Resfrie queimaduras da pele com água corrente por 10 a 20 minutos. Não use gelo, pasta ou manteiga.',
    ],
    fonte: 'Lacuna A5 — edema progressivo de via aérea.',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.emergencia_ocular_quimica',
    titulo: 'Emergência ocular química',
    descricao:
      'Contato de produto químico (soda, ácido, cal, alvejante) com o olho. ' +
      'Requer irrigação imediata em casa ANTES do deslocamento.',
    nivel: 'vermelho',
    tipoQueixa: 'ocular',
    comoAPessoaDescreve: [
      'caiu produto no olho', 'respingou soda no olho', 'queimei a vista',
      'caiu cal no olho', 'entrou química no olho', 'soda no olho', 'ácido no olho',
      'alvejante no olho', 'água sanitária no olho', 'químico no olho', 'caiu no olho',
      'respingou no olho',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'LAVE O OLHO AGORA, ANTES DE SAIR DE CASA: água corrente morna ou soro, por 20 minutos sem parar.',
      'Mantenha a pálpebra aberta com os dedos e deixe a água correr do canto do nariz para fora.',
      'Retire lente de contato se houver.',
      'Não esfregue o olho, não use colírio nem nenhum outro produto.',
      'Só depois dos 20 minutos, vá ao serviço. Leve a embalagem do produto.',
    ],
    fonte: 'Lacuna A5 — "Requer irrigação imediata em casa ANTES do deslocamento".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.neutropenia_febril',
    titulo: 'Neutropenia febril',
    descricao:
      'Febre em pessoa em quimioterapia ou com imunossupressão grave. No protocolo original era ' +
      'apenas agravante de +1 nível a partir de amarelo; aqui é bandeira própria.',
    nivel: 'vermelho',
    tipoQueixa: 'infecciosa',
    comoAPessoaDescreve: [
      'estou na quimioterapia e deu febre', 'tô na quimio e tô com febre',
      'faço quimio e tô febril', 'transplantado com febre', 'na quimio e deu febre',
    ],
    // Só existe na conjunção: imunossupressão E febre. "Faço quimio" sozinho não é emergência.
    exigeTodos: [
      ['quimio', 'quimioterapia', 'transplantado', 'imunidade baixa', 'imunossuprimido', 'neutropenia'],
      ['febre', 'febril', 'corpo quente', '38', '39', '40'],
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Vá agora e avise na recepção que está em quimioterapia — isso muda a prioridade da fila.',
      'Evite aglomeração no caminho e use máscara se tiver.',
      'Não tome antibiótico nem antitérmico por conta própria antes de ser avaliada.',
      'Leve o cartão do tratamento, se tiver.',
    ],
    fonte: 'Lacuna A5 — "Deveria ser bandeira própria".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.ectopica',
    titulo: 'Gravidez ectópica rota',
    descricao:
      'Atraso menstrual com dor abdominal forte de um lado, com ou sem sangramento, tontura ou ' +
      'desmaio. No protocolo original só era vermelho se a pessoa DECLARASSE estar grávida — ' +
      'que é justamente o que ela não sabe.',
    nivel: 'vermelho',
    tipoQueixa: 'obstetrica',
    comoAPessoaDescreve: [
      'atraso na menstruação e dor forte de um lado', 'dor na barriga e sangramento',
      'atraso de 2 meses e dor forte de um lado da barriga', 'dor de um lado da barriga e tontura',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 se estiver muito tonta, pálida ou tiver desmaiado.',
      'Não coma nem beba nada — pode ser necessário operar.',
      'Deite com as pernas elevadas até a ajuda chegar.',
    ],
    fonte: 'Lacuna A5 — "é justamente o que ela não sabe".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.choque_afogamento_hipotermia',
    titulo: 'Choque elétrico, afogamento ou hipotermia',
    descricao:
      'Ausência total no protocolo original. Risco de arritmia tardia mesmo com a pessoa ' +
      'aparentemente bem.',
    nivel: 'vermelho',
    tipoQueixa: 'trauma',
    comoAPessoaDescreve: [
      'levou choque', 'quase se afogou', 'engoliu muita água na piscina', 'ficou muito tempo no frio',
      'tomou choque na tomada', 'levou choque do chuveiro',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192 mesmo que a pessoa pareça bem — o coração pode alterar horas depois.',
      'CHOQUE: desligue a energia antes de tocar na pessoa.',
      'AFOGAMENTO: mantenha a pessoa deitada de lado e aquecida; não tente tirar água dos pulmões.',
      'HIPOTERMIA: retire roupa molhada, cubra com cobertor seco, movimente com delicadeza.',
    ],
    fonte: 'Lacuna A5 — "Risco de arritmia tardia; ausência total no protocolo".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.retencao_urinaria',
    titulo: 'Retenção urinária aguda',
    descricao:
      'Incapacidade de urinar por muitas horas, com bexiga distendida, dor e vontade intensa. ' +
      'Urgência de alívio; sem critério no protocolo original.',
    nivel: 'laranja',
    tipoQueixa: 'urologica',
    comoAPessoaDescreve: [
      'não consigo urinar desde ontem', 'barriga estufada e vontade de urinar',
      'não sai xixi', 'tô com a bexiga cheia e não consigo fazer', 'não urino há horas',
    ],
    tempoDependente: true,
    primeirosMinutos: [
      'Não force. Não tome diurético nem beba grande quantidade de líquido de uma vez.',
      'Uma compressa morna sobre a barriga pode ajudar a relaxar enquanto você se desloca.',
    ],
    fonte: 'Lacuna A5 — urgência de alívio.',
    origem: 'A5',
    assinatura: PENDENTE,
  },
  {
    id: 'a5.abdome_agudo_vascular',
    titulo: 'Abdome agudo vascular no idoso',
    descricao:
      'Dor abdominal de início súbito e muito intensa em pessoa idosa, desproporcional ao exame. ' +
      'No protocolo original caía em LARANJA genérico; isquemia mesentérica e aneurisma exigem ' +
      'porta de emergência.',
    nivel: 'vermelho',
    tipoQueixa: 'gastrointestinal',
    comoAPessoaDescreve: [
      'dor muito forte na barriga que começou de repente', 'dor na barriga do nada muito forte',
      'idoso com dor de barriga insuportável', 'dor na barriga e nas costas de repente',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192.',
      'Não coma nem beba nada.',
      'Não tome analgésico nem antiespasmódico antes da avaliação.',
    ],
    fonte: 'Lacuna A5 — "no idoso, isquemia mesentérica e aneurisma exigem porta de emergência".',
    origem: 'A5',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LARANJA — urgência.
// ─────────────────────────────────────────────────────────────────────────────

const LARANJAS: Criterio[] = [
  {
    id: 'lj.dor_intensa_funcional',
    titulo: 'Dor intensa por descritores funcionais',
    descricao:
      'A4 — a escala numérica é o parâmetro mais fácil de manipular e é sistematicamente ' +
      'subnotificada por idosos. O gatilho primário passa a ser funcional: a dor impede dormir, ' +
      'impede andar, falar ou trabalhar, ou piora ao respirar fundo. O número vira campo secundário.',
    nivel: 'laranja',
    tipoQueixa: 'geral',
    comoAPessoaDescreve: [
      'dor que não deixa dormir', 'não consigo andar de dor', 'dor insuportável',
      'não consigo trabalhar de dor', 'dor que piora quando respiro fundo',
    ],
    fonte: 'A4 — descritores funcionais são mais estáveis e menos manipuláveis que a escala 0–10.',
    origem: 'A4',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.desidratacao',
    titulo: 'Desidratação',
    descricao: 'Vômitos ou diarreia repetidos sem conseguir manter líquido, boca muito seca, urina escassa.',
    nivel: 'laranja',
    tipoQueixa: 'gastrointestinal',
    comoAPessoaDescreve: [
      'vomitando tudo', 'não para de vomitar', 'não consigo beber água', 'quase não faço xixi',
      'diarreia sem parar', 'boca seca e fraco',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.abdome_agudo',
    titulo: 'Dor abdominal intensa',
    descricao: 'Dor abdominal forte, contínua, com barriga dura, febre ou vômitos.',
    nivel: 'laranja',
    tipoQueixa: 'gastrointestinal',
    comoAPessoaDescreve: [
      'dor forte na barriga', 'barriga dura', 'dor na barriga e vomitando', 'cólica muito forte',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.ferida_infectada',
    titulo: 'Ferida infectada',
    descricao: 'Ferida com pus, vermelhidão que se espalha, calor local, febre ou mau cheiro.',
    nivel: 'laranja',
    tipoQueixa: 'dermatologica',
    comoAPessoaDescreve: [
      'ferida com pus', 'ferida inflamada', 'ferida cheirando mal', 'machucado vermelho e quente',
      'ferida no pé que não sara',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.dispneia_esforco',
    titulo: 'Falta de ar aos esforços',
    descricao:
      'Falta de ar que aparece com esforço pequeno — andar poucos passos, falar, tomar banho, ' +
      'trocar de roupa — ou piora recente da tolerância ao esforço habitual.',
    nivel: 'laranja',
    tipoQueixa: 'respiratoria',
    comoAPessoaDescreve: [
      'falta de ar', 'falta de ar ao mínimo esforço', 'falta de ar pra andar',
      'cansaço para respirar', 'cansaço aos esforços', 'canso fácil',
      'fico sem ar quando ando', 'sem fôlego', 'cansada demais pra andar',
    ],
    fonte:
      'Lacuna encontrada pelo mecanismo de B11 ao rodar o piloto: "falta de ar ao mínimo ' +
      'esforço" não batia critério nenhum e caía no acolhimento genérico. É exatamente o ' +
      'ciclo que a curadoria de não reconhecidos existe para produzir.',
    origem: 'B11',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.crise_asmatica',
    titulo: 'Crise de asma ou DPOC moderada',
    descricao: 'Chiado e falta de ar que não melhoraram com a bombinha de resgate em casa.',
    nivel: 'laranja',
    tipoQueixa: 'respiratoria',
    comoAPessoaDescreve: [
      'crise de asma', 'usei a bombinha e não melhorou', 'chiando no peito', 'falta de ar e chiado',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.hiperglicemia',
    titulo: 'Hiperglicemia sintomática',
    descricao:
      'Glicemia muito alta OU equivalente clínico (A14): muita sede, urinando muito, ' +
      'emagrecimento rápido, hálito adocicado, náusea.',
    nivel: 'laranja',
    tipoQueixa: 'metabolica',
    comoAPessoaDescreve: [
      'açúcar muito alto', 'muita sede e urinando muito', 'glicose alta', 'hálito doce',
      'diabético descompensado',
    ],
    fonte: 'A14 — equivalentes clínicos formalizados ao lado dos números.',
    origem: 'A14',
    assinatura: PENDENTE,
  },
  {
    id: 'lj.abscesso_dentario',
    titulo: 'Abscesso dentário com edema facial',
    descricao:
      'Dor de dente com inchaço do rosto, febre ou dificuldade de abrir a boca. ' +
      'A10 — destino é a urgência odontológica/CEO, não a UPA.',
    nivel: 'laranja',
    tipoQueixa: 'odontologica',
    comoAPessoaDescreve: [
      'dor de dente e o rosto inchou', 'inchaço no rosto por causa do dente',
      'dificuldade de abrir a boca', 'abscesso no dente', 'dente inflamado com febre',
    ],
    fonte: 'A10 — a rede tem mais portas do que cinco; esta é a porta correta.',
    origem: 'A10',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AMARELO — atendimento no mesmo dia.
// ─────────────────────────────────────────────────────────────────────────────

const AMARELOS: Criterio[] = [
  {
    id: 'am.pressao_alta_assintomatica',
    titulo: 'Pressão alta sem lesão de órgão-alvo',
    descricao:
      'A3 — no protocolo original, "pressão muito alta sem sintomas neurológicos" ia a LARANJA/UPA. ' +
      'Duas correções: o recorte "neurológicos" era estreito demais (o que separa emergência de ' +
      'pseudocrise é lesão de órgão-alvo em QUALQUER território), e elevação assintomática sem lesão ' +
      'de órgão-alvo é, na prática contemporânea, manejo ambulatorial — não porta de urgência. ' +
      'Como "pressão alta" é uma das queixas mais frequentes da Atenção Básica, este único critério ' +
      'podia responder sozinho por uma fatia expressiva dos encaminhamentos indevidos à UPA.',
    nivel: 'amarelo',
    tipoQueixa: 'cardiovascular',
    comoAPessoaDescreve: [
      'pressão alta', 'pressão subiu', 'minha pressão deu 18 por 11', 'pressão descontrolada',
      'medi a pressão e tava alta', 'pressão alta mas não sinto nada',
    ],
    sinaisDeAlarme: {
      descricao:
        'Qualquer sinal de lesão de órgão-alvo — em qualquer território, não só neurológico: ' +
        'dor no peito, falta de ar, alteração visual, déficit neurológico, redução do volume de urina.',
      comoAPessoaDescreve: [
        'dor no peito', 'falta de ar', 'vendo embaçado', 'vista escura', 'boca torta',
        'fraqueza de um lado', 'não estou urinando', 'dor de cabeça muito forte',
      ],
      nivelSeAlarme: 'vermelho',
    },
    fonte:
      'A3 — proposta a ser levada à retaguarda médica. Inclui pergunta de confiabilidade da ' +
      'medida (aparelho próprio, farmácia, quando mediu, se estava em repouso), porque o número ' +
      'informado é frequentemente não confiável.',
    origem: 'A3',
    assinatura: PENDENTE,
  },
  {
    id: 'am.febre_adulto',
    titulo: 'Febre em adulto',
    descricao: 'Febre sem sinais de gravidade e sem sinais de alarme de arbovirose.',
    nivel: 'amarelo',
    tipoQueixa: 'infecciosa',
    comoAPessoaDescreve: ['febre', 'febril', 'corpo quente', 'tô com febre', 'febre de 38'],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'am.dor_moderada',
    titulo: 'Dor moderada',
    descricao: 'Dor que incomoda mas não impede as atividades habituais.',
    nivel: 'amarelo',
    tipoQueixa: 'geral',
    comoAPessoaDescreve: ['dor moderada', 'tá doendo', 'dor chata', 'dor mas dá pra aguentar'],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'am.infeccao_urinaria',
    titulo: 'Sintomas urinários',
    descricao: 'Ardência ao urinar, urgência, urina turva ou com cheiro forte, sem febre alta ou dor lombar.',
    nivel: 'amarelo',
    tipoQueixa: 'urologica',
    comoAPessoaDescreve: [
      'ardência pra urinar', 'ardendo pra fazer xixi', 'infecção urinária', 'xixi turvo',
      'vontade de urinar toda hora',
    ],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'am.diarreia',
    titulo: 'Diarreia sem sinais de desidratação',
    descricao: 'Diarreia mantendo boa aceitação de líquidos e urina normal.',
    nivel: 'amarelo',
    tipoQueixa: 'gastrointestinal',
    comoAPessoaDescreve: ['diarreia', 'desarranjo', 'intestino solto', 'indo muito ao banheiro'],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'am.escoriacao_ferimento',
    titulo: 'Ferimento que pode precisar de sutura',
    descricao: 'Corte com bordas afastadas, sangramento controlado com compressão.',
    nivel: 'amarelo',
    tipoQueixa: 'trauma',
    comoAPessoaDescreve: ['corte fundo', 'cortei e abriu', 'precisa levar ponto', 'me cortei'],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'am.lombalgia',
    titulo: 'Dor lombar sem sinais de alarme',
    descricao:
      'Dor nas costas sem perda de força, sem alteração de urina ou fezes, sem dormência em sela ' +
      'e sem febre.',
    nivel: 'amarelo',
    tipoQueixa: 'geral',
    comoAPessoaDescreve: ['dor nas costas', 'dor na coluna', 'lombar doendo', 'travei as costas'],
    sinaisDeAlarme: {
      descricao: 'Sinais de cauda equina — ver critério a5.cauda_equina.',
      comoAPessoaDescreve: [
        'não sinto as pernas', 'não consigo segurar o xixi', 'dormência entre as pernas',
      ],
      nivelSeAlarme: 'vermelho',
    },
    origem: 'v1',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// VERDE — consulta agendada.
// ─────────────────────────────────────────────────────────────────────────────

const VERDES: Criterio[] = [
  {
    id: 'vd.acompanhamento_cronico',
    titulo: 'Acompanhamento de condição crônica',
    descricao: 'Revisão de hipertensão, diabetes, tireoide ou outra condição estável.',
    nivel: 'verde',
    tipoQueixa: 'geral',
    comoAPessoaDescreve: ['consulta de rotina', 'revisar a pressão', 'acompanhamento do diabetes'],
    isentoPiso24h: true,
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vd.renovacao_receita',
    titulo: 'Renovação de receita',
    descricao:
      'A10 — o destino correto é a farmácia da unidade, não uma vaga de consulta. Este caso ' +
      'não pode escalar por agravante de HAS ou DM (A1).',
    nivel: 'verde',
    tipoQueixa: 'medicamento',
    comoAPessoaDescreve: [
      'renovar receita', 'renovar a receita', 'preciso renovar a receita da pressão',
      'acabou meu remédio', 'preciso da receita', 'receita do remédio venceu',
    ],
    isentoPiso24h: true,
    fonte: 'A10 — "farmácia da unidade (renovação de receita, que hoje ocupa uma vaga de consulta)".',
    origem: 'A10',
    assinatura: PENDENTE,
  },
  {
    id: 'vd.duvida_administrativa',
    titulo: 'Dúvida administrativa',
    descricao: 'Agendamento, documentos, cartão SUS, resultado de exame.',
    nivel: 'azul',
    tipoQueixa: 'administrativa',
    comoAPessoaDescreve: ['como agendo', 'preciso do cartão sus', 'resultado do exame', 'marcar consulta'],
    isentoPiso24h: true,
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vd.duvida_medicamento',
    titulo: 'Dúvida sobre medicamento',
    descricao: 'Como tomar, horário, se pode junto com outro.',
    nivel: 'azul',
    tipoQueixa: 'medicamento',
    comoAPessoaDescreve: ['posso tomar junto', 'que horas tomo o remédio', 'esqueci de tomar'],
    isentoPiso24h: true,
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'vd.vacina',
    titulo: 'Vacinação',
    descricao: 'A10 — demanda espontânea de sala de vacina, não consulta.',
    nivel: 'azul',
    tipoQueixa: 'vacina',
    comoAPessoaDescreve: ['tomar vacina', 'vacina em atraso', 'carteira de vacinação'],
    isentoPiso24h: true,
    origem: 'A10',
    assinatura: PENDENTE,
  },
  {
    id: 'vd.saude_mental_leve',
    titulo: 'Ansiedade, insônia ou busca por psicólogo',
    descricao:
      'Sofrimento psíquico sem ideação, sem autolesão e sem crise aguda. ' +
      'Ver trilha de saúde mental (A8) para tudo que estiver acima disto.',
    nivel: 'verde',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: [
      'ansiedade', 'não consigo dormir', 'preciso de psicólogo', 'tô triste',
      'estresse', 'insônia',
    ],
    isentoPiso24h: true,
    origem: 'v1',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AZUL — orientação, sem necessidade de sair de casa.
//
// A2 (ALTO): a regra "sintoma com menos de 24 horas sempre gera, no mínimo, atendimento no
// mesmo dia" anulava o nível AZUL por contradição interna direta — "acordei com o nariz
// escorrendo" é exatamente um quadro de primeiro dia. O sistema perdia justamente a função
// que mais alivia a unidade: dizer com segurança "você não precisa sair de casa".
//
// Solução: `isentoPiso24h: true` em quadros de baixa gravidade explicitamente nomeados.
// ─────────────────────────────────────────────────────────────────────────────

const AZUIS: Criterio[] = [
  {
    id: 'az.sindrome_gripal_leve',
    titulo: 'Síndrome gripal leve sem sinal de alarme',
    descricao:
      'Coriza, espirros, dor de garganta leve, febre baixa, sem falta de ar, sem dor no peito ' +
      'e sem prostração. Isento do piso de 24 horas (A2).',
    nivel: 'azul',
    tipoQueixa: 'respiratoria',
    comoAPessoaDescreve: [
      'nariz escorrendo', 'acordei com o nariz escorrendo e espirrando', 'resfriado',
      'gripinha', 'espirrando', 'garganta arranhando', 'nariz entupido',
      // Lacuna encontrada pela própria fila de curadoria (B11) ao rodar o piloto:
      // "dor de garganta" é das queixas mais frequentes e não batia critério nenhum.
      'dor de garganta', 'garganta doendo', 'garganta inflamada', 'dor pra engolir',
      'tosse', 'tossindo', 'catarro',
    ],
    isentoPiso24h: true,
    fonte: 'A2 — exceção nomeada ao piso de 24 horas, para que o nível AZUL volte a existir.',
    origem: 'A2',
    assinatura: PENDENTE,
  },
  {
    id: 'az.escoriacao_superficial',
    titulo: 'Escoriação superficial',
    descricao: 'Arranhão ou raspão superficial, sangramento mínimo, bordas justas. Isento do piso de 24h (A2).',
    nivel: 'azul',
    tipoQueixa: 'trauma',
    comoAPessoaDescreve: ['ralei o joelho', 'arranhão', 'raspão', 'me arranhei'],
    isentoPiso24h: true,
    fonte: 'A2 — exceção nomeada ao piso de 24 horas.',
    origem: 'A2',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A6 (CRÍTICO) — módulo sazonal de arbovirose.
//
// "nenhum dos 43 critérios menciona dengue, chikungunya ou zika. Em Parnamirim/RN isso não é
//  um detalhe: arbovirose é a principal causa sazonal de agravamento evitável em Atenção
//  Básica, e o manejo depende inteiramente de reconhecer a virada do quadro — que ocorre
//  justamente na defervescência, quando a pessoa acha que está melhorando."
//
// A revisão chama este de "isoladamente, o módulo de maior valor local do sistema".
// ─────────────────────────────────────────────────────────────────────────────

export const MODULO_ARBOVIROSE = {
  /** Ativável por período epidemiológico. */
  ativo: true,
  periodoEpidemiologico: 'Definido com a vigilância epidemiológica do município.',

  /** (i) Reconhecimento do quadro suspeito: febre + dois sintomas típicos. */
  reconhecimento: {
    febreObrigatoria: true,
    sintomasTipicos: [
      { id: 'dor_atras_olhos', rotulo: 'Dor atrás dos olhos', termos: ['dor atrás dos olhos', 'dor nos olhos'] },
      { id: 'dor_corpo', rotulo: 'Dor no corpo ou nas juntas', termos: ['dor no corpo', 'dor nas juntas', 'dor nas articulações', 'corpo doendo todo'] },
      { id: 'dor_cabeca', rotulo: 'Dor de cabeça', termos: ['dor de cabeça'] },
      { id: 'manchas', rotulo: 'Manchas vermelhas na pele', termos: ['manchas vermelhas', 'manchas no corpo', 'brotoeja'] },
      { id: 'prostracao', rotulo: 'Fraqueza intensa', termos: ['muito fraco', 'sem força', 'prostrado'] },
      { id: 'nausea', rotulo: 'Náusea ou vômito', termos: ['enjoo', 'náusea', 'vomitando'] },
    ],
    minimoSintomas: 2,
  },

  /** (ii) Checagem EXPLÍCITA E OBRIGATÓRIA dos sinais de alarme. */
  sinaisDeAlarme: [
    {
      id: 'dor_abdominal',
      pergunta: 'Está com dor forte na barriga, que não passa?',
      termos: ['dor forte na barriga', 'dor abdominal intensa', 'barriga doendo muito'],
      nivel: 'laranja' as const,
    },
    {
      id: 'vomito_persistente',
      pergunta: 'Está vomitando sem parar ou não consegue segurar líquido?',
      termos: ['vomitando muito', 'não para de vomitar', 'vomitando tudo'],
      nivel: 'laranja' as const,
    },
    {
      id: 'sangramento',
      pergunta: 'Apareceu algum sangramento — gengiva, nariz, urina, fezes ou pele?',
      termos: ['sangramento na gengiva', 'sangrando o nariz', 'manchas roxas', 'sangue na urina'],
      nivel: 'vermelho' as const,
    },
    {
      id: 'tontura_postural',
      pergunta: 'Sente tontura forte ou desmaio ao levantar?',
      termos: ['tontura ao levantar', 'quase desmaio', 'vista escurece ao levantar'],
      nivel: 'laranja' as const,
    },
    {
      id: 'letargia_irritabilidade',
      pergunta: 'Está muito sonolento, confuso ou muito irritado?',
      termos: ['muito sonolento', 'confuso', 'irritadíssimo'],
      nivel: 'vermelho' as const,
    },
    {
      id: 'queda_subita_febre',
      pergunta: 'A febre baixou de repente e você se sentiu PIOR depois disso?',
      termos: ['a febre baixou e piorei', 'melhorou a febre mas piorou'],
      nivel: 'laranja' as const,
    },
  ],

  /** (iii) Orientação de hidratação e do risco do período de defervescência. */
  orientacao: {
    hidratacao:
      'Beba líquido em pequenas quantidades e com frequência ao longo de todo o dia — água, ' +
      'soro caseiro, água de coco, chá ou suco. A quantidade adequada deve ser confirmada com a equipe.',
    defervescencia:
      'ATENÇÃO — o momento mais perigoso da dengue é quando a febre baixa, entre o terceiro e o ' +
      'sétimo dia. É justamente quando a pessoa acha que está melhorando que o quadro pode virar. ' +
      'Se a febre baixar e você se sentir pior, procure atendimento no mesmo momento.',
    naoUsar:
      'Não tome AAS (ácido acetilsalicílico), ibuprofeno, diclofenaco ou outros anti-inflamatórios ' +
      'sem orientação — eles aumentam o risco de sangramento.',
  },

  /** (iv) Sinalização para a vigilância epidemiológica do município. */
  notificaVigilancia: true,

  origem: 'A6' as const,
  assinatura: PENDENTE,
};

const ARBOVIROSE_CRITERIOS: Criterio[] = [
  {
    id: 'arb.suspeita',
    titulo: 'Suspeita de arbovirose sem sinal de alarme',
    descricao:
      'Febre com dois ou mais sintomas típicos (dor atrás dos olhos, dor no corpo ou nas juntas, ' +
      'dor de cabeça, manchas, prostração, náusea), SEM sinais de alarme. Exige checagem ' +
      'obrigatória dos sinais de alarme e orientação de defervescência.',
    nivel: 'amarelo',
    tipoQueixa: 'arbovirose',
    comoAPessoaDescreve: [
      'febre e dor no corpo', 'dengue', 'chikungunya', 'zika', 'febre com dor nas juntas',
      'febre há 3 dias e dor no corpo', 'dor atrás dos olhos com febre', 'suspeita de dengue',
    ],
    fonte: 'A6 — módulo sazonal de arbovirose.',
    origem: 'A6',
    assinatura: PENDENTE,
  },
  {
    id: 'arb.sinal_alarme',
    titulo: 'Arbovirose com sinal de alarme',
    descricao:
      'Quadro suspeito de arbovirose COM pelo menos um sinal de alarme. Inclui explicitamente a ' +
      'virada na defervescência: "febre há 4 dias, agora melhorou a febre mas tá com dor forte na ' +
      'barriga e vomitando".',
    nivel: 'laranja',
    tipoQueixa: 'arbovirose',
    comoAPessoaDescreve: [
      'febre baixou e tô com dor na barriga', 'dengue com dor forte na barriga',
      'febre há 4 dias e vomitando', 'sangramento na gengiva', 'sangramento na gengiva com febre',
      'melhorou a febre mas piorei', 'melhorou a febre mas', 'a febre melhorou e piorou',
      'febre baixou', 'febre abaixou', 'a febre passou e piorei',
    ],
    tempoDependente: true,
    sinaisDeAlarme: {
      descricao:
        'Sangramento de qualquer sítio ou letargia/irritabilidade — os dois sinais que a ' +
        'checagem obrigatória do módulo classifica como VERMELHO.',
      comoAPessoaDescreve: [
        'sangramento na gengiva', 'sangrando o nariz', 'manchas roxas', 'sangue na urina',
        'muito sonolento', 'irritadíssimo',
      ],
      nivelSeAlarme: 'vermelho',
    },
    primeirosMinutos: [
      'Vá agora. Continue bebendo líquido no caminho, em goles pequenos e frequentes.',
      'Não tome AAS, ibuprofeno ou diclofenaco.',
      'Leve a lista dos remédios que está tomando.',
    ],
    fonte: 'A6 — "o manejo depende inteiramente de reconhecer a virada do quadro".',
    origem: 'A6',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A7 (ALTO) — bloco pediátrico ancorado na AIDPI.
//
// O critério original "criança com sinais de gravidade (gemendo, molinha, não aceita líquido,
// sem urinar, roxa)" era paráfrase parcial e informal do que o Ministério da Saúde já padroniza.
// Faltavam sinais operacionais e discriminativos.
// ─────────────────────────────────────────────────────────────────────────────

const PEDIATRICOS: Criterio[] = [
  {
    id: 'ped.sinais_gerais_perigo',
    titulo: 'Sinais gerais de perigo na criança',
    descricao:
      'Não consegue mamar ou beber; vomita tudo o que ingere; convulsionou durante esta doença; ' +
      'letargia ou inconsciência; estridor em repouso; tiragem subcostal; batimento de asa de nariz.',
    nivel: 'vermelho',
    tipoQueixa: 'pediatrica',
    comoAPessoaDescreve: [
      'não quer mamar', 'não aceita líquido', 'vomita tudo', 'molinha', 'molinho', 'gemendo',
      'não acorda direito', 'afundando a barriguinha', 'afundando entre as costelas',
      'chiado alto pra respirar', 'nariz abrindo e fechando', 'roxa', 'roxo',
      'meu filho de 8 meses não quer mamar e tá gemendo',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Ligue 192.',
      'Mantenha a criança no colo, em posição confortável, com a roupa folgada.',
      'Não force alimento nem líquido se ela estiver muito sonolenta.',
      'Se estiver com febre, pode retirar o excesso de roupa.',
    ],
    fonte:
      'AIDPI — Atenção Integrada às Doenças Prevalentes na Infância / Cadernos de Atenção Básica, ' +
      'Ministério da Saúde. Fonte citada conforme A7.',
    origem: 'A7',
    assinatura: PENDENTE,
  },
  {
    id: 'ped.febre_menor_3_meses',
    titulo: 'Febre em bebê com menos de 3 meses',
    descricao: 'Qualquer febre em lactente menor de 3 meses.',
    nivel: 'vermelho',
    tipoQueixa: 'pediatrica',
    comoAPessoaDescreve: ['bebê de 2 meses com febre', 'recém-nascido com febre', 'neném com febre'],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: ['Vá agora. Não dê antitérmico por conta própria antes da avaliação.'],
    origem: 'v1',
    assinatura: PENDENTE,
  },
  {
    id: 'ped.febre_3_a_6_meses',
    titulo: 'Febre em bebê de 3 a 6 meses',
    descricao: 'A7 — faixa intermediária de febre pediátrica, ausente no protocolo original.',
    nivel: 'laranja',
    tipoQueixa: 'pediatrica',
    comoAPessoaDescreve: ['bebê de 4 meses com febre', 'bebê de 5 meses febril'],
    fonte: 'AIDPI. Faixa acrescentada por A7.',
    origem: 'A7',
    assinatura: PENDENTE,
  },
  {
    id: 'ped.desidratacao_infantil',
    titulo: 'Desidratação na criança por sinais observáveis',
    descricao:
      'A7 — estimativa por sinais que o cuidador consegue observar: olhos fundos, chora sem ' +
      'lágrima, boca seca, fralda seca há muitas horas, moleira funda, pele que demora a voltar.',
    nivel: 'laranja',
    tipoQueixa: 'pediatrica',
    comoAPessoaDescreve: [
      'olhos fundos', 'chora sem lágrima', 'fralda seca', 'não faz xixi', 'moleira funda',
      'boca sequinha', 'pele murcha',
    ],
    fonte: 'AIDPI — sinais de desidratação observáveis pelo cuidador (A7).',
    origem: 'A7',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A8 (CRÍTICO) — trilha de saúde mental.
//
// "não há nada entre os dois. Ideação suicida sem plano, autolesão sem intenção letal, luto
//  agudo, crise de pânico, surto psicótico incipiente, abstinência — todo esse espectro cai em
//  'consulta agendada' ou em 'não reconhecido'."
//
// A trilha é PRÓPRIA, fora do fluxo geral, e o CVV 188 é exibido de forma permanente e não
// condicional em qualquer caso que toque o tema. Nunca encerrar com apenas um número de telefone.
// ─────────────────────────────────────────────────────────────────────────────

const SAUDE_MENTAL: Criterio[] = [
  {
    id: 'sm.ideacao_sem_plano',
    titulo: 'Ideação suicida sem plano definido',
    descricao:
      'Pensamentos de morte ou de desaparecer, sem plano estruturado, sem meio disponível e sem ' +
      'intenção imediata. A faixa intermediária que não existia.',
    nivel: 'laranja',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: [
      'pensando em sumir', 'queria não acordar', 'penso em morrer', 'não quero mais viver',
      'tô muito ansiosa, pensando em sumir, mas não fiz nada', 'cansei de tudo',
      'seria melhor se eu não existisse',
    ],
    fonte: 'A8 — faixa intermediária entre SAMU e consulta agendada.',
    origem: 'A8',
    assinatura: PENDENTE,
  },
  {
    id: 'sm.autolesao_sem_intencao_letal',
    titulo: 'Autolesão sem intenção letal',
    descricao: 'Cortes, queimaduras ou outras autolesões sem intenção de morte.',
    nivel: 'laranja',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: ['me cortei', 'me machuquei de propósito', 'me queimei de propósito'],
    fonte: 'A8.',
    origem: 'A8',
    assinatura: PENDENTE,
  },
  {
    id: 'sm.crise_panico',
    titulo: 'Crise de pânico',
    descricao:
      'Início súbito de medo intenso com palpitação, falta de ar, formigamento e sensação de ' +
      'morte iminente. Requer descartar causa clínica.',
    nivel: 'amarelo',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: [
      'crise de pânico', 'ataque de pânico', 'coração disparado e medo de morrer',
      'falta de ar e formigando as mãos', 'sensação de que vou morrer',
    ],
    fonte: 'A8.',
    origem: 'A8',
    assinatura: PENDENTE,
  },
  {
    id: 'sm.surto_psicotico',
    titulo: 'Surto psicótico incipiente',
    descricao: 'Alteração de comportamento, fala desorganizada, ouvir vozes, desconfiança intensa.',
    nivel: 'laranja',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: [
      'ouvindo vozes', 'falando coisa sem sentido', 'acha que estão perseguindo',
      'muito agitado e desconfiado', 'surtou',
    ],
    fonte: 'A8.',
    origem: 'A8',
    assinatura: PENDENTE,
  },
  {
    id: 'sm.abstinencia',
    titulo: 'Abstinência de álcool ou outras drogas',
    descricao: 'Tremor, sudorese, agitação, náusea ou confusão após parar o uso.',
    nivel: 'laranja',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: [
      'parei de beber e tô tremendo', 'abstinência', 'crise por falta de bebida',
      'tremendo desde que parei',
    ],
    fonte: 'A8.',
    origem: 'A8',
    assinatura: PENDENTE,
  },
  {
    id: 'sm.luto_agudo',
    titulo: 'Luto agudo com sofrimento intenso',
    descricao: 'Perda recente com sofrimento incapacitante.',
    nivel: 'amarelo',
    tipoQueixa: 'saude_mental',
    comoAPessoaDescreve: ['perdi alguém', 'meu filho morreu', 'não consigo levantar desde que ele morreu'],
    fonte: 'A8.',
    origem: 'A8',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// A9 (ALTO) — trilha de violência.
//
// "o protocolo cobre risco autoprovocado, mas não cobre violência sofrida."
// São situações de notificação compulsória e de encaminhamento específico — não de
// "acolhimento genérico na UBS".
// ─────────────────────────────────────────────────────────────────────────────

const VIOLENCIA: Criterio[] = [
  {
    id: 'vi.violencia_sexual',
    titulo: 'Violência sexual',
    descricao:
      'Janela de profilaxia pós-exposição que se conta em HORAS. Encaminhamento a serviço de ' +
      'referência, com notificação compulsória.',
    nivel: 'vermelho',
    tipoQueixa: 'violencia',
    comoAPessoaDescreve: ['fui estuprada', 'me forçaram', 'abusaram de mim', 'violência sexual', 'fui abusada'],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Vá agora ao serviço de referência. A profilaxia é mais eficaz quanto antes for iniciada.',
      'Se puder, não tome banho, não troque de roupa e não lave as roupas antes do atendimento.',
      'Você tem direito ao atendimento independentemente de registrar boletim de ocorrência.',
      'Você não tem culpa do que aconteceu.',
    ],
    fonte: 'A9 — janela de profilaxia pós-exposição contada em horas.',
    origem: 'A9',
    assinatura: PENDENTE,
  },
  {
    id: 'vi.violencia_domestica',
    titulo: 'Violência doméstica em curso',
    descricao: 'Agressão física, ameaça ou cárcere em curso ou risco iminente.',
    nivel: 'vermelho',
    tipoQueixa: 'violencia',
    comoAPessoaDescreve: [
      'meu marido está me batendo', 'estão me ameaçando em casa', 'apanhei em casa',
      'ele me trancou', 'estão me agredindo',
    ],
    tempoDependente: true,
    irreversivel: true,
    primeirosMinutos: [
      'Se você está em perigo agora, ligue 190.',
      'Ligue 180 (Central de Atendimento à Mulher) — é gratuito, sigiloso e funciona 24 horas.',
      'Se puder, vá para um cômodo com saída, perto da porta, e evite cozinha e banheiro.',
      'Combine uma palavra de código com alguém de confiança.',
    ],
    fonte: 'A9.',
    origem: 'A9',
    assinatura: PENDENTE,
  },
  {
    id: 'vi.maus_tratos_infantil',
    titulo: 'Maus-tratos ou negligência infantil',
    descricao: 'Suspeita de violência ou negligência contra criança ou adolescente. Notificação compulsória.',
    nivel: 'laranja',
    tipoQueixa: 'violencia',
    comoAPessoaDescreve: [
      'estão batendo na criança', 'criança com marcas', 'criança abandonada',
      'meu vizinho bate no filho',
    ],
    fonte: 'A9 — encaminhamento inclui conselho tutelar quando aplicável.',
    origem: 'A9',
    assinatura: PENDENTE,
  },
  {
    id: 'vi.violencia_idoso',
    titulo: 'Violência contra pessoa idosa',
    descricao: 'Agressão, negligência, abandono ou apropriação de bens de pessoa idosa.',
    nivel: 'laranja',
    tipoQueixa: 'violencia',
    comoAPessoaDescreve: [
      'estão maltratando minha mãe idosa', 'idoso abandonado', 'tomaram o dinheiro do meu pai',
    ],
    fonte: 'A9.',
    origem: 'A9',
    assinatura: PENDENTE,
  },
  {
    id: 'vi.exposicao_hiv',
    titulo: 'Exposição de risco ao HIV',
    descricao: 'Exposição sexual ou por material biológico. Janela de profilaxia em horas.',
    nivel: 'laranja',
    tipoQueixa: 'violencia',
    comoAPessoaDescreve: [
      'me expus ao hiv', 'preciso de pep', 'relação sem camisinha com risco',
      'me furei com agulha usada',
    ],
    tempoDependente: true,
    primeirosMinutos: [
      'Procure atendimento nas primeiras horas — a profilaxia (PEP) deve começar o quanto antes, ' +
        'idealmente em até 72 horas.',
    ],
    fonte: 'A9.',
    origem: 'A9',
    assinatura: PENDENTE,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Catálogo consolidado
// ─────────────────────────────────────────────────────────────────────────────

export const CRITERIOS: readonly Criterio[] = Object.freeze([
  ...VERMELHOS_V1,
  ...LACUNAS_A5,
  ...LARANJAS,
  ...AMARELOS,
  ...VERDES,
  ...AZUIS,
  ...ARBOVIROSE_CRITERIOS,
  ...PEDIATRICOS,
  ...SAUDE_MENTAL,
  ...VIOLENCIA,
]);

const POR_ID = new Map(CRITERIOS.map((c) => [c.id, c]));

export function criterioPorId(id: string): Criterio | undefined {
  return POR_ID.get(id);
}

export function criteriosPorNivel(nivel: Criterio['nivel']): Criterio[] {
  return CRITERIOS.filter((c) => c.nivel === nivel);
}

/** Ids válidos — usados como enum fechado no JSON Schema da camada 2 (B3). */
export const IDS_CRITERIOS: readonly string[] = Object.freeze(CRITERIOS.map((c) => c.id));

/** Critérios que ainda aguardam assinatura clínica. Contador exibido no painel. */
export function criteriosPendentesDeAssinatura(): Criterio[] {
  return CRITERIOS.filter((c) => c.assinatura === null);
}
