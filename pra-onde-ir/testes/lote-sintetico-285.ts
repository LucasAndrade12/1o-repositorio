/**
 * Lote sintético de 285 relatos representativos da demanda de uma UBS.
 *
 * Escritos como a população fala na recepção — inclusive com erro de digitação, relato vago,
 * fala de terceiro e regionalismo. DELIBERADAMENTE não escritos a partir do catálogo de
 * critérios: a graça é descobrir o que o sistema NÃO cobre.
 *
 * Composição alvo, aproximando a demanda real da Atenção Básica:
 *   administrativo/crônico estável ~30% · agudo leve ~30% · moderado ~22% · urgência ~12% ·
 *   emergência ~6%
 */

export interface Caso {
  relato: string;
  idade?: number;
  agravantes?: string[];
  inicioMenos24h?: boolean;
  paraQuem?: 'proprio' | 'terceiro';
  /** Rótulo grosseiro só para agrupar o relatório. Não é gabarito clínico. */
  grupo: string;
}

const c = (
  relato: string,
  grupo: string,
  idade?: number,
  agravantes: string[] = [],
  inicioMenos24h = false,
): Caso => ({ relato, grupo, idade, agravantes, inicioMenos24h });

export const LOTE: Caso[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // Administrativo, receita, exame, atestado, vacina  (~30 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('preciso renovar a receita do losartana', 'administrativo', 61, ['hipertensao']),
  c('acabou meu remédio da pressão', 'administrativo', 58, ['hipertensao']),
  c('vim pegar o resultado do exame de sangue', 'administrativo', 44),
  c('quero marcar consulta com o clínico', 'administrativo', 37),
  c('preciso fazer o cartão do sus', 'administrativo', 26),
  c('quero saber se meu exame já chegou', 'administrativo', 52),
  c('preciso de um atestado pro trabalho', 'administrativo', 33),
  c('vim buscar encaminhamento pro cardiologista', 'administrativo', 66, ['hipertensao', 'cardiopatia']),
  c('quero remarcar minha consulta que perdi', 'administrativo', 48),
  c('preciso da declaração de comparecimento', 'administrativo', 29),
  c('vim tomar a vacina da gripe', 'vacina', 70),
  c('preciso atualizar a carteira de vacinação do meu filho', 'vacina', 3),
  c('tomar a segunda dose', 'vacina', 41),
  c('vim vacinar contra tétano porque me cortei ontem', 'vacina', 35, [], true),
  c('a vacina da criança tá atrasada', 'vacina', 1, ['crianca_menor_2']),
  c('posso tomar o remédio da pressão junto com o do colesterol', 'medicamento', 63, ['hipertensao']),
  c('esqueci de tomar o remédio ontem, tomo dobrado hoje', 'medicamento', 55, ['diabetes']),
  c('esse antibiótico é de quantas em quantas horas', 'medicamento', 30),
  c('o remédio tá me dando muito enjoo', 'medicamento', 47),
  c('quero trocar meu anticoncepcional', 'medicamento', 24),
  c('preciso pegar a insulina do mês', 'administrativo', 59, ['diabetes']),
  c('vim pegar tira de glicemia', 'administrativo', 67, ['diabetes']),
  c('quero fazer o preventivo', 'preventivo', 34),
  c('vim fazer o pré-natal', 'preventivo', 27),
  c('preciso marcar a mamografia', 'preventivo', 51),
  c('quero fazer o teste de covid', 'preventivo', 39),
  c('vim fazer teste de gravidez', 'preventivo', 22),
  c('quero saber meu peso e minha pressão', 'preventivo', 45),
  c('vim só pra consulta de rotina do diabetes', 'cronico', 62, ['diabetes']),
  c('acompanhamento da minha pressão, tá tudo bem', 'cronico', 57, ['hipertensao']),

  // ─────────────────────────────────────────────────────────────────────────
  // Respiratório leve  (~28 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô gripado, com o nariz escorrendo', 'respiratorio_leve', 31, [], true),
  c('acordei espirrando muito e com o nariz entupido', 'respiratorio_leve', 28, [], true),
  c('tô com dor de garganta faz dois dias', 'respiratorio_leve', 25),
  c('minha garganta tá inflamada e dói pra engolir', 'respiratorio_leve', 19),
  c('to com uma tosse seca que não passa faz uma semana', 'respiratorio_leve', 40),
  c('tosse com catarro amarelo', 'respiratorio_leve', 46),
  c('tô com defluxo e dor no corpo', 'respiratorio_leve', 36),
  c('peguei uma friagem, tô toda ruim', 'respiratorio_leve', 52),
  c('meu filho tá gripado e tossindo muito à noite', 'respiratorio_leve', 6),
  c('a menina tá com o nariz escorrendo e sem febre', 'respiratorio_leve', 4),
  c('tô rouco faz três dias', 'respiratorio_leve', 44),
  c('minha voz sumiu', 'respiratorio_leve', 38),
  c('tô com sinusite de novo, dor no rosto', 'respiratorio_leve', 42),
  c('dor de cabeça e nariz trancado faz uma semana', 'respiratorio_leve', 33),
  c('tô com o ouvido doendo e entupido', 'orl', 27),
  c('meu ouvido tá doendo muito desde ontem', 'orl', 9, [], true),
  c('tenho um zumbido no ouvido que não para', 'orl', 61),
  c('acho que tem cera no meu ouvido, não escuto direito', 'orl', 58),
  c('tô com o nariz sangrando de vez em quando', 'orl', 30),
  c('meu nariz sangrou hoje de manhã e parou', 'orl', 47, [], true),
  c('tô com alergia, espirrando o dia todo', 'respiratorio_leve', 23),
  c('rinite atacada', 'respiratorio_leve', 35),
  c('tô com uma canseira quando subo escada', 'respiratorio', 68, ['hipertensao']),
  c('canso pra andar até o portão', 'respiratorio', 74, ['cardiopatia']),
  c('tô com o peito chiando de leve', 'respiratorio', 29, ['asma_dpoc']),
  c('usei a bombinha e melhorou', 'respiratorio', 26, ['asma_dpoc']),
  c('minha asma tá controlada mas quero renovar a bombinha', 'respiratorio', 32, ['asma_dpoc']),
  c('tossindo há mais de três semanas e emagrecendo', 'respiratorio', 49),

  // ─────────────────────────────────────────────────────────────────────────
  // Dor musculoesquelética  (~26 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô com dor nas costas faz uma semana', 'dor_musculo', 43),
  c('travei as costas ontem levantando peso', 'dor_musculo', 38, [], true),
  c('dor na coluna que desce pra perna', 'dor_musculo', 54),
  c('dor nas cadeiras que não me deixa dormir', 'dor_musculo', 62),
  c('meu joelho tá inchado e doendo', 'dor_musculo', 57),
  c('dor no ombro quando levanto o braço', 'dor_musculo', 49),
  c('torci o pé ontem jogando bola', 'dor_musculo', 21, [], true),
  c('meu pulso tá doendo de tanto digitar', 'dor_musculo', 34),
  c('dor no pescoço, acordei torto', 'dor_musculo', 41),
  c('minhas juntas doem todas de manhã', 'dor_musculo', 63),
  c('dor no calcanhar quando piso de manhã', 'dor_musculo', 46),
  c('tô com cãibra na perna toda noite', 'dor_musculo', 55),
  c('caí em casa e ralei o braço', 'trauma_leve', 71, [], true),
  c('bati o dedo na porta e tá roxo', 'trauma_leve', 30, [], true),
  c('levei um tombo da bicicleta, só arranhei o joelho', 'trauma_leve', 14, [], true),
  c('meu dedo tá inchado depois que bati', 'trauma_leve', 44, [], true),
  c('dor lombar há meses, já fiz fisioterapia', 'dor_musculo', 58),
  c('minhas mãos formigam à noite', 'dor_musculo', 50),
  c('dor no cotovelo, acho que é tendinite', 'dor_musculo', 39),
  c('minha perna incha no fim do dia', 'dor_musculo', 66, ['hipertensao']),
  c('varizes doendo muito', 'dor_musculo', 53),
  c('tô com dor no corpo todo e cansaço', 'dor_musculo', 47),
  c('dor nas juntas e nas costas, é da idade né', 'dor_musculo', 72),
  c('meu pé tá dormente', 'dor_musculo', 64, ['diabetes']),
  c('caí sentado e tô com dor no cóccix', 'trauma_leve', 36, [], true),
  c('meu braço dói desde que carreguei o botijão', 'dor_musculo', 42),

  // ─────────────────────────────────────────────────────────────────────────
  // Dermatologia  (~22 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô com uma micose entre os dedos do pé', 'dermato', 37),
  c('apareceu uma mancha branca no meu braço', 'dermato', 29),
  c('tô com muita coceira no corpo à noite', 'dermato', 8),
  c('meu filho tá cheio de brotoeja', 'dermato', 2, ['crianca_menor_2']),
  c('apareceu uma pereba no meu braço', 'dermato', 33),
  c('minha unha do pé encravou e tá doendo', 'dermato', 45),
  c('tô com uma verruga na mão', 'dermato', 31),
  c('caspa e coceira no couro cabeludo', 'dermato', 40),
  c('acne muito forte no rosto', 'dermato', 17),
  c('picada de inseto que inchou', 'dermato', 26, [], true),
  c('fui picado por uma abelha e inchou o local', 'dermato', 34, [], true),
  c('tô com uma frieira que não sara', 'dermato', 48),
  c('apareceu um caroço embaixo do braço', 'dermato', 39),
  c('tenho um sinal que mudou de cor', 'dermato', 56),
  c('minha pele tá muito ressecada e descascando', 'dermato', 61),
  c('queimei o braço no fogão ontem, ficou vermelho', 'dermato', 43, [], true),
  c('meu bebê tá com assadura forte', 'dermato', 1, ['crianca_menor_2']),
  c('apareceu uma zipela na minha perna, tá vermelha e quente', 'dermato', 65, ['diabetes']),
  c('tô com cobreiro nas costas, doendo muito', 'dermato', 59),
  c('minha ferida do pé não sara faz dois meses', 'dermato', 68, ['diabetes']),
  c('vim trocar o curativo da perna', 'dermato', 70),
  c('tô com uma nascida no braço com matéria', 'dermato', 41),

  // ─────────────────────────────────────────────────────────────────────────
  // Gastrointestinal  (~24 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô com azia todo dia depois que como', 'gastro', 45),
  c('queimação no estômago à noite', 'gastro', 52),
  c('tô com gastrite atacada', 'gastro', 38),
  c('meu estômago tá embrulhado', 'gastro', 33),
  c('tô com diarreia desde ontem', 'gastro', 29, [], true),
  c('desarranjo faz três dias', 'gastro', 41),
  c('meu filho tá com diarreia e vomitou duas vezes', 'gastro', 5, [], true),
  c('tô com prisão de ventre faz uma semana', 'gastro', 63),
  c('não vou ao banheiro faz cinco dias', 'gastro', 71),
  c('tô com muito gás e a barriga estufada', 'gastro', 44),
  c('vomitei uma vez de manhã e passou', 'gastro', 27, [], true),
  c('enjoo o dia todo, acho que tô grávida', 'gastro', 25),
  c('dor de barriga leve que vai e vem', 'gastro', 36),
  c('cólica forte desde ontem', 'gastro', 31, [], true),
  c('tô com hemorroida sangrando quando vou ao banheiro', 'gastro', 47),
  c('sangue vivo no papel quando limpo', 'gastro', 39),
  c('tô com o coco preto feito borra de café', 'gastro', 64),
  c('vomitando sem parar desde a madrugada', 'gastro', 33, [], true),
  c('não consigo segurar nem água no estômago', 'gastro', 55, [], true),
  c('dor forte na barriga do lado direito e febre', 'gastro', 28),
  c('minha barriga tá dura e dói muito quando aperta', 'gastro', 49),
  c('tô com gastura e o bucho doendo', 'gastro', 58),
  c('meu bebê tá golfando tudo que mama', 'gastro', 1, ['crianca_menor_2']),
  c('perdi 8 quilos em dois meses sem fazer dieta', 'gastro', 61),

  // ─────────────────────────────────────────────────────────────────────────
  // Urinário e genital  (~20 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô com ardência pra urinar', 'urinario', 28),
  c('arde muito quando faço xixi e tô indo toda hora', 'urinario', 34),
  c('infecção urinária de novo', 'urinario', 42),
  c('meu mijo tá turvo e fedendo', 'urinario', 51),
  c('tô urinando muito à noite', 'urinario', 67, ['diabetes']),
  c('sangue no mijo hoje de manhã', 'urinario', 58, [], true),
  c('dor nas costas e febre com ardência pra urinar', 'urinario', 36),
  c('não consigo urinar desde ontem e a barriga tá estufada', 'urinario', 73),
  c('tô com um corrimento amarelado', 'genital', 26),
  c('coceira na vagina faz uma semana', 'genital', 31),
  c('minha menstruação tá muito forte esse mês', 'genital', 44),
  c('minha regra não desceu e tô com dor forte de um lado', 'genital', 29),
  c('tô sem menstruar faz três meses', 'genital', 48),
  c('dor durante a relação', 'genital', 35),
  c('apareceu uma ferida na região íntima', 'genital', 23),
  c('meu marido tá com dor pra urinar e corrimento', 'genital', 33),
  c('dor forte no testículo desde de madrugada', 'urinario', 19, [], true),
  c('meu saco tá inchado e doendo', 'urinario', 24),
  c('tô com cólica de rim, dor que vai pras costas', 'urinario', 46),
  c('vim fazer o exame de próstata', 'preventivo', 57),

  // ─────────────────────────────────────────────────────────────────────────
  // Saúde mental  (~22 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô muito ansiosa ultimamente', 'mental', 32),
  c('não consigo dormir faz semanas', 'mental', 45),
  c('preciso de um psicólogo', 'mental', 28),
  c('tô muito triste desde que perdi o emprego', 'mental', 39),
  c('tô com o coração apertado e sem vontade de nada', 'mental', 51),
  c('tô aperreada, sem sossego', 'mental', 43),
  c('acho que tô com depressão', 'mental', 36),
  c('meu remédio de ansiedade acabou', 'mental', 41),
  c('tô bebendo demais e quero parar', 'mental', 47),
  c('parei de beber faz dois dias e tô tremendo muito', 'mental', 52, [], true),
  c('meu filho tá usando droga e não sei o que fazer', 'mental', 19),
  c('tô com crise de pânico, coração dispara e falta ar', 'mental', 30),
  c('sinto que vou morrer, coração acelerado e formigamento', 'mental', 27),
  c('tô pensando em sumir, mas não fiz nada', 'mental', 34),
  c('queria dormir e não acordar mais', 'mental', 44),
  c('não vejo saída, cansei de tudo', 'mental', 38),
  c('me cortei de propósito ontem', 'mental', 17, [], true),
  c('minha mãe tá ouvindo vozes e falando sozinha', 'mental', 58),
  c('meu irmão tá muito agitado, acha que querem matar ele', 'mental', 31),
  c('perdi minha mãe faz uma semana e não consigo levantar', 'mental', 46),
  c('tô esquecendo as coisas, minha memória tá ruim', 'mental', 69),
  c('meu pai tá caducando, não conhece mais a gente', 'mental', 79),

  // ─────────────────────────────────────────────────────────────────────────
  // Pediatria  (~24 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('meu filho tá com febre desde ontem', 'pediatria', 4, [], true),
  c('a criança tá com quentura e não quer comer', 'pediatria', 3, [], true),
  c('meu bebê de dois meses tá com febre', 'pediatria', 0, ['crianca_menor_2'], true),
  c('neném de quatro meses com febre', 'pediatria', 0, ['crianca_menor_2'], true),
  c('minha filha vomitou três vezes hoje', 'pediatria', 6, [], true),
  c('a nenén tá molinha e gemendo', 'pediatria', 1, ['crianca_menor_2']),
  c('meu bebê não quer mamar e tá quieto demais', 'pediatria', 0, ['crianca_menor_2']),
  c('a criança tá com a fralda seca faz muitas horas', 'pediatria', 1, ['crianca_menor_2']),
  c('meu filho tá com diarreia e chora sem lágrima', 'pediatria', 2, ['crianca_menor_2']),
  c('o menino tá afundando a barriguinha pra respirar', 'pediatria', 1, ['crianca_menor_2']),
  c('meu filho tá com chiado no peito', 'pediatria', 5),
  c('a criança convulsionou agora', 'pediatria', 3, [], true),
  c('meu filho engoliu uma moeda e tá tossindo', 'pediatria', 2, ['crianca_menor_2'], true),
  c('a criança tá com manchas vermelhas no corpo e febre', 'pediatria', 4),
  c('meu filho tá com o ouvido doendo e chorando muito', 'pediatria', 3),
  c('a menina tá com piolho', 'pediatria', 7),
  c('meu filho tá com verme, coça o bumbum à noite', 'pediatria', 5),
  c('vim na consulta de puericultura', 'pediatria', 0, ['crianca_menor_2']),
  c('meu bebê tá com sapinho na boca', 'pediatria', 0, ['crianca_menor_2']),
  c('a criança não tá ganhando peso', 'pediatria', 1, ['crianca_menor_2']),
  c('meu filho tá com dor de barriga faz dias', 'pediatria', 8),
  c('a menina tá com dor de garganta e febre', 'pediatria', 9),
  c('meu filho caiu e bateu a cabeça, vomitou depois', 'pediatria', 6, [], true),
  c('a criança tá com o olho vermelho e remelando', 'pediatria', 4),

  // ─────────────────────────────────────────────────────────────────────────
  // Oftalmologia e odontologia  (~14 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('meu olho tá vermelho e remelando', 'oftalmo', 32),
  c('tô com um terçol no olho', 'oftalmo', 27),
  c('minha vista tá embaçada faz um tempo', 'oftalmo', 59, ['diabetes']),
  c('preciso de óculos, não enxergo de longe', 'oftalmo', 44),
  c('entrou um cisco no meu olho', 'oftalmo', 36, [], true),
  c('respingou soda no meu olho agorinha', 'oftalmo', 41, [], true),
  c('perdi a visão de um olho de repente', 'oftalmo', 63, ['hipertensao'], true),
  c('meu olho tá coçando muito, deve ser alergia', 'oftalmo', 25),
  c('tô com dor de dente há três dias', 'odonto', 34),
  c('meu dente tá cariado e doendo', 'odonto', 28),
  c('dor de dente e o rosto inchou muito', 'odonto', 39),
  c('minha gengiva sangra quando escovo', 'odonto', 45),
  c('quebrei um dente comendo', 'odonto', 31, [], true),
  c('preciso extrair um dente', 'odonto', 52),

  // ─────────────────────────────────────────────────────────────────────────
  // Crônicos descompensados e idoso  (~24 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('minha pressão deu 18 por 11 mas não tô sentindo nada', 'cronico', 59, ['hipertensao']),
  c('a pressão tá alta e eu tô com dor de cabeça', 'cronico', 64, ['hipertensao']),
  c('minha pressão tá alta e tô vendo embaçado', 'cronico', 61, ['hipertensao']),
  c('pressão alta e dor no peito', 'cronico', 58, ['hipertensao']),
  c('minha pressão caiu e fiquei tonto', 'cronico', 72, ['hipertensao']),
  c('meu açúcar deu 400 hoje', 'cronico', 55, ['diabetes']),
  c('tô com muita sede e urinando demais', 'cronico', 49, ['diabetes']),
  c('meu açúcar caiu, fiquei tremendo e suando frio', 'cronico', 66, ['diabetes'], true),
  c('sou diabético e tô com uma ferida no pé com pus', 'cronico', 67, ['diabetes']),
  c('minha glicose tá sempre alta de manhã', 'cronico', 53, ['diabetes']),
  c('tô com o colesterol alto no exame', 'cronico', 47),
  c('minha tireoide tá alterada no exame', 'cronico', 42),
  c('tô com anemia no exame de sangue', 'cronico', 35),
  c('minha avó de 80 anos tá muito confusa e com febre', 'idoso', 80),
  c('meu pai de 78 tá mais esquecido e caiu duas vezes', 'idoso', 78),
  c('minha mãe idosa não quer comer e tá emagrecendo', 'idoso', 83),
  c('meu avô tá acamado e apareceu uma ferida nas costas', 'idoso', 87, ['acamado']),
  c('minha sogra acamada tá com febre', 'idoso', 81, ['acamado']),
  c('meu pai tá com tontura quando levanta', 'idoso', 74, ['hipertensao']),
  c('minha mãe tá tomando oito remédios e passando mal', 'idoso', 76, ['hipertensao', 'diabetes']),
  c('meu esposo idoso tá com falta de ar pra andar', 'idoso', 79, ['cardiopatia']),
  c('minha vó tá com a perna inchada e vermelha', 'idoso', 82),
  c('meu pai não tá urinando desde ontem', 'idoso', 77),
  c('minha mãe tá muito fraca e sem forças', 'idoso', 84),

  // ─────────────────────────────────────────────────────────────────────────
  // Gestação e puerpério  (~14 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô grávida de 3 meses e com muito enjoo', 'gestacao', 24),
  c('tô de bucho de oito meses e com quentura', 'gestacao', 28),
  c('grávida de 32 semanas com dor nas costas', 'gestacao', 31),
  c('tô grávida e sangrando um pouco', 'gestacao', 26),
  c('grávida de 7 meses e o bebê não mexe desde ontem', 'gestacao', 29),
  c('tô grávida e com dor de cabeça forte e vendo embaçado', 'gestacao', 33),
  c('grávida de 39 semanas, estourou a bolsa', 'gestacao', 27, [], true),
  c('tô grávida e com ardência pra urinar', 'gestacao', 25),
  c('grávida de 5 meses, minha pressão deu alta', 'gestacao', 34),
  c('ganhei neném faz uma semana e tô com febre', 'puerperio', 26, ['puerpera']),
  c('tô de resguardo e sangrando muito', 'puerperio', 30, ['puerpera']),
  c('meu peito tá inchado e doendo, tô amamentando', 'puerperio', 28, ['puerpera']),
  c('não consigo amamentar, o bebê não pega o peito', 'puerperio', 23, ['puerpera']),
  c('tô muito triste depois que o bebê nasceu', 'puerperio', 25, ['puerpera']),

  // ─────────────────────────────────────────────────────────────────────────
  // Arbovirose  (~12 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô com febre e dor no corpo todo', 'arbovirose', 33),
  c('febre há três dias com dor atrás dos olhos', 'arbovirose', 29),
  c('tô com quentura, dor nas juntas e manchas vermelhas', 'arbovirose', 41),
  c('acho que é dengue, tô com febre e muito fraco', 'arbovirose', 37),
  c('a febre baixou e eu piorei, tô com dor forte na barriga', 'arbovirose', 35),
  c('febre há quatro dias e agora tô vomitando muito', 'arbovirose', 28),
  c('tô com dengue e apareceu sangramento na gengiva', 'arbovirose', 44),
  c('febre e dor no corpo, e agora tô tonto quando levanto', 'arbovirose', 39),
  c('meu filho tá com febre e manchas no corpo', 'arbovirose', 7),
  c('tô com chikungunya, as juntas doem demais', 'arbovirose', 52),
  c('febre com dor de cabeça e dor atrás dos olhos', 'arbovirose', 31),
  c('tive dengue mês passado e agora tô com dor de garganta', 'arbovirose', 26),

  // ─────────────────────────────────────────────────────────────────────────
  // Urgência e emergência  (~26 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô com dor no peito e suando frio', 'emergencia', 57, ['hipertensao'], true),
  c('meu marido tá com o braço caindo e a fala embolada', 'emergencia', 68, [], true),
  c('minha mãe deu um treco e arriou tudo na cozinha', 'emergencia', 71, [], true),
  c('minha véia não dá fé de nada desde agorinha', 'emergencia', 79, [], true),
  c('tô com falta de ar muito forte, não consigo falar', 'emergencia', 62, ['asma_dpoc'], true),
  c('meu filho tá roxo e não consegue respirar', 'emergencia', 4, [], true),
  c('tomei um remédio e inchou minha boca e a língua', 'emergencia', 38, [], true),
  c('cortei o braço fundo e não para de sangrar', 'emergencia', 29, [], true),
  c('tô vomitando sangue', 'emergencia', 54, [], true),
  c('meu vizinho bateu de moto e o osso tá pra fora', 'emergencia', 24, [], true),
  c('minha filha convulsionou e não acorda', 'emergencia', 8, [], true),
  c('febre com pescoço duro e manchas roxas', 'emergencia', 16, [], true),
  c('tomei os comprimidos todos, quero morrer', 'emergencia', 31, [], true),
  c('meu pai levou choque na tomada', 'emergencia', 45, [], true),
  c('minha filha quase se afogou na piscina', 'emergencia', 5, [], true),
  c('tô na quimio e deu febre', 'urgencia', 56, ['imunossupressao'], true),
  c('crise de asma, usei a bombinha e não melhorou', 'urgencia', 34, ['asma_dpoc'], true),
  c('dor muito forte na barriga que começou de repente', 'urgencia', 74, [], true),
  c('dor nas costas e não sinto mais as pernas', 'urgencia', 48, [], true),
  c('fiz xixi sem sentir e minhas pernas estão fracas', 'urgencia', 55),
  c('inalei fumaça no incêndio e tô rouco', 'urgencia', 40, [], true),
  c('minha esposa tá com febre e muito confusa, respirando rápido', 'urgencia', 69),
  c('dor de cabeça a pior da minha vida, começou de repente', 'urgencia', 47, [], true),
  c('meu marido tá me batendo agora', 'violencia', 32, [], true),
  c('fui abusada ontem à noite', 'violencia', 21, [], true),
  c('minha vizinha bate no filho pequeno', 'violencia', 6),

  // ─────────────────────────────────────────────────────────────────────────
  // Relatos vagos e ruído  (~20 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('tô passando mal', 'vago', 45),
  c('não tô bom', 'vago', 72),
  c('tô ruim, sem forças', 'vago', 66),
  c('me sinto estranha hoje', 'vago', 38),
  c('minha barriga tá esquisita', 'vago', 41),
  c('tô esmorecida, sem eito pra nada', 'vago', 58),
  c('deu um negócio ruim em mim', 'vago', 63),
  c('não sei explicar, só sei que não tô bem', 'vago', 34),
  c('tô estranho', 'vago', 27),
  c('minha filha tá diferente', 'vago', 12),
  c('vim ver o que eu tenho', 'vago', 50),
  c('tô com um mal estar', 'vago', 44),
  c('sinto uma coisa ruim no corpo', 'vago', 55),
  c('tô moída', 'vago', 49),
  c('não tô conseguindo fazer nada', 'vago', 37),
  c('tô com uma dor', 'vago', 42),
  c('doi aqui', 'vago', 31),
  c('to com uma coisa esquisita na barriga faz dias', 'vago', 47),
  c('tô meio zonza', 'vago', 60),
  c('acho que peguei alguma coisa', 'vago', 29),

  // ─────────────────────────────────────────────────────────────────────────
  // Erros de digitação e escrita informal  (~9 casos)
  // ─────────────────────────────────────────────────────────────────────────
  c('to com dor de cabesa forte', 'ruido', 36),
  c('minha preçao ta auta', 'ruido', 61, ['hipertensao']),
  c('to com febri e dor no corpu', 'ruido', 33),
  c('doi muinto minha barriga', 'ruido', 28),
  c('meu fio ta com febri', 'ruido', 5),
  c('nao to conseguino respira direito', 'ruido', 57, ['asma_dpoc']),
  c('to com dor nas custas', 'ruido', 44),
  c('minha gargata ta inflamada', 'ruido', 22),
  c('to sentino uma coisa ruim no peito', 'ruido', 59, ['hipertensao']),
];
