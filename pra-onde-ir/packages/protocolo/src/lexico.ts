/**
 * B1 (CRÍTICO) — léxico da camada 1.
 *
 * "casamento de palavras-chave sem análise sintática dispara em quatro situações previsíveis
 *  e frequentes":
 *
 *   "Ela NÃO está com a boca torta, mas está tonta"        → negação não tratada
 *   "JÁ TIVE um AVC em 2019, agora estou com dor de garganta" → histórico lido como atual
 *   "Tenho MEDO DE estar tendo um infarto"                 → hipótese lida como sinal
 *   "Meu vizinho DESMAIOU semana passada"                  → terceiro e tempo passado
 *
 * "O agravante decisivo: a regra 'bandeira vermelha é irreversível' impede qualquer correção
 *  posterior. Um falso positivo da camada 1 se torna um encaminhamento ao SAMU do qual o
 *  sistema não consegue voltar atrás — nem pela IA, nem pela própria pessoa. Ativações
 *  indevidas do SAMU custam recurso público real e, repetidas, destroem a confiança da equipe
 *  no sistema mais rápido do que qualquer erro de sub-triagem."
 *
 * Este arquivo é dados. A lógica está em packages/motor/src/camada1.ts.
 */

/** Janela de negação — quantas palavras antes do termo são inspecionadas. */
export const JANELA_NEGACAO = 5;

export const MARCADORES_NEGACAO: readonly string[] = Object.freeze([
  'nao', 'sem', 'nenhum', 'nenhuma', 'nunca', 'jamais', 'tampouco', 'nada de',
  'negativo para', 'ausencia de', 'ausente', 'livre de', 'nem',
  // Variantes faladas do Nordeste
  'num', 'nunca que', 'que nada', 'qual nada', 'nem sinal de', 'nem sombra de',
  'longe disso', 'de jeito nenhum', 'de jeito maneira', 'nadinha de',
]);

/** Termos que CANCELAM a negação — "não melhorou", "não passa" não negam o sintoma. */
export const NEGACAO_CANCELADA_POR: readonly string[] = Object.freeze([
  'melhora', 'melhorou', 'melhorando', 'passa', 'passou', 'para', 'parou', 'cessa', 'cessou',
  'aguento', 'aguenta', 'consigo', 'consegue', 'resolve', 'resolveu', 'adianta', 'adiantou',
  // Variantes regionais da mesma ideia — "num arribou", "não deu jeito"
  'arribou', 'arriba', 'deu jeito', 'da jeito', 'sara', 'sarou', 'sarando',
  'presta', 'prestou', 'firma', 'firmou', 'segura', 'segurou', 'cede', 'cedeu',
  'diminui', 'diminuiu', 'abranda', 'abrandou', 'alivia', 'aliviou',
]);

/**
 * Marcadores de tempo passado: "já tive", "ano passado", "desde criança".
 * Histórico não é quadro atual.
 */
export const MARCADORES_PASSADO: readonly string[] = Object.freeze([
  'ja tive', 'ja tinha', 'tive', 'tinha', 'ano passado', 'anos atras', 'mes passado',
  'semana passada', 'na epoca', 'antigamente', 'desde crianca', 'quando era',
  'ja fiz', 'ja passei', 'historico de', 'antecedente de', 'em 2019', 'em 2020',
  'em 2021', 'em 2022', 'em 2023', 'em 2024', 'em 2025', 'faz anos', 'faz muito tempo',
  'no passado', 'uma vez', 'aconteceu antes',
  // Nordeste
  'ja tive uma vez', 'ja deu', 'ja deu isso', 'tempos atras', 'ja faz tempo',
  'de primeiro', 'no tempo que', 'quando eu era nova', 'quando eu era novo',
  'de menino', 'de menina', 'ja curei', 'ja tratei', 'ja operei', 'ja fui operado',
  'ja fui operada', 'de outrora', 'antes de tudo isso',
]);

/** Termos que indicam que o quadro é AGORA — vencem os marcadores de passado. */
export const MARCADORES_PRESENTE: readonly string[] = Object.freeze([
  'agora', 'neste momento', 'nesse momento', 'esta acontecendo', 'ta acontecendo',
  'to com', 'estou com', 'esta com', 'ta com', 'comecou agora', 'de repente',
  'ha pouco', 'agorinha', 'faz minutos', 'acabou de', 'ainda esta', 'continua',
  'hoje', 'desde ontem', 'desde hoje',
  // Nordeste
  'agora mesmo', 'agora agorinha', 'nesse instante', 'nessa hora', 'inda agora',
  'ainda ha pouco', 'de supetao', 'do nada', 'de uma hora pra outra', 'de vez',
  'ta sentindo', 'to sentindo', 'ta dando', 'to dando', 'ta ai', 'ta assim',
  'desde de manha', 'desde cedo', 'de manhazinha', 'essa madrugada', 'essa noite',
]);

/**
 * Marcadores de hipótese: a pessoa levanta uma suspeita, não relata um sinal.
 * "Tenho medo de estar tendo um infarto, mas é só azia."
 */
export const MARCADORES_HIPOTESE: readonly string[] = Object.freeze([
  'medo de', 'com medo', 'sera que', 'sera se', 'parece', 'acho que', 'talvez',
  'pode ser', 'sera que e', 'preocupado com', 'preocupada com', 'receio de',
  'tenho impressao', 'imagino que', 'e possivel que', 'suspeito de', 'me preocupa',
  'quero saber se', 'gostaria de saber se', 'e verdade que',
  // Nordeste
  'sera nao', 'sera que num', 'vai ver que', 'vai que', 'capaz que', 'e capaz de',
  'to achando que', 'tou achando que', 'me parece que', 'diz que e', 'dizem que e',
  'to com receio', 'fiquei com medo', 'peguei medo', 'to cismado', 'to cismada',
  'cisma que', 'tenho cisma', 'me deu na cabeca que', 'nao sei se e',
]);

/**
 * Marcadores de terceiro — pessoa que não é o paciente.
 * D2: os exemplos do próprio documento ("deu um treco nela", "ficou molinho") indicam que
 * boa parte do uso será por terceiros. Mas o relato pode ser sobre alguém que NÃO é o
 * paciente da triagem ("meu vizinho desmaiou semana passada, quero saber se preciso me preocupar").
 */
export const MARCADORES_TERCEIRO_NAO_PACIENTE: readonly string[] = Object.freeze([
  'meu vizinho', 'minha vizinha', 'o vizinho', 'a vizinha', 'um conhecido', 'uma conhecida',
  'um amigo', 'uma amiga', 'meu colega', 'minha colega', 'uma pessoa que eu conheco',
  'ouvi falar', 'vi na televisao', 'vi na internet', 'li que',
  // Nordeste
  'meu cumpade', 'minha cumade', 'meu compadre', 'minha comadre', 'um cabra',
  'uma pessoa la de casa', 'um rapaz', 'uma moca', 'gente conhecida',
  'o povo diz', 'o pessoal falou', 'falaram pra mim', 'me disseram que',
  'vi num video', 'vi no zap', 'mandaram no zap', 'li num grupo',
]);

/** Marcadores de que o relato é sobre um terceiro QUE É o paciente (D2). */
export const MARCADORES_TERCEIRO_PACIENTE: readonly string[] = Object.freeze([
  'meu filho', 'minha filha', 'meu pai', 'minha mae', 'meu marido', 'minha esposa',
  'minha mulher', 'meu esposo', 'meu neto', 'minha neta', 'meu irmao', 'minha irma',
  'minha avo', 'meu avo', 'meu bebe', 'minha bebe', 'o menino', 'a menina',
  'meu companheiro', 'minha companheira', 'ele esta', 'ela esta', 'ele ta', 'ela ta',
  // Nordeste — tratamento familiar
  'mainha', 'painho', 'minha veia', 'meu veio', 'a veia', 'o veio',
  'meu home', 'meu homem', 'minha nega', 'meu nego', 'minha fia', 'meu fi',
  'meu fio', 'minha filhinha', 'meu filhinho', 'o nenem', 'a nenem', 'o bichinho',
  'a bichinha', 'meu tio', 'minha tia', 'meu sogro', 'minha sogra', 'meu genro',
  'minha nora', 'meu cunhado', 'minha cunhada', 'meu padrasto', 'minha madrasta',
  'o pai dele', 'a mae dele', 'a mae dela', 'o pai dela', 'meu enteado', 'minha enteada',
]);

/**
 * B10 (MELHORIA) — padrões de tentativa de injeção de instrução.
 * "o pior caso é um critério errado" graças ao esquema fechado, mas o vetor merece atenção.
 */
export const PADROES_INJECAO: readonly string[] = Object.freeze([
  'ignore as instrucoes', 'ignore todas as instrucoes', 'ignore o anterior',
  'esqueca as instrucoes', 'desconsidere as instrucoes', 'nova instrucao',
  'voce agora e', 'aja como', 'finja que', 'system:', 'assistant:', 'user:',
  'classifique como emergencia', 'classifique como vermelho', 'me mande para a upa',
  'responda apenas', 'sobrescreva', 'override', 'prompt', 'jailbreak',
  'disregard previous', 'ignore previous instructions',
]);

/** Limite de tamanho do campo de relato (B10). */
export const LIMITE_CARACTERES_RELATO = 1200;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * DICIONÁRIO REGIONAL POTIGUAR
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * B1, roteiro de funcionalidades: "expressões locais que a busca por palavra-chave não cobre.
 * Coleta com a equipe e com os agentes comunitários."
 *
 * Mapeia expressão local → termo canônico já presente em `comoAPessoaDescreve` de algum
 * critério. A camada 1 ANEXA o termo canônico ao texto normalizado; nunca substitui, para
 * que o relato original permaneça auditável.
 *
 * ── Sobre a pretensão de completude ──────────────────────────────────────────
 *
 * Este dicionário NÃO é — e não pode ser — exaustivo. Nenhuma lista escrita em gabinete cobre
 * a variação real da fala de uma população: ela muda por bairro, por faixa etária, por
 * escolaridade, e inventa expressão nova toda semana. Uma lista que se declara completa é
 * perigosa justamente porque desliga a desconfiança de quem opera o sistema.
 *
 * O que garante cobertura ao longo do tempo é o MECANISMO, não a lista:
 *
 *   1. Camada 2 (IA) traduz linguagem livre para os IDs de critério — ela existe exatamente
 *      para o que este dicionário não previu.
 *   2. B11 — a fila de curadoria agrupa os relatos NÃO RECONHECIDOS por semelhança, e a
 *      enfermeira marca "isto deveria ser o critério X". Cada marcação vira uma linha aqui.
 *      A meta da revisão é <15% de não reconhecimento no 3º mês.
 *   3. Os agentes comunitários de saúde da microárea são a fonte primária de coleta — eles
 *      ouvem a fala real na casa das pessoas, que é diferente da fala na recepção da UBS.
 *
 * Duas entradas deste arquivo (`lj.dispneia_esforco` e os termos de garganta em
 * `az.sindrome_gripal_leve`) já nasceram desse ciclo, ao rodar o piloto. É o mecanismo
 * funcionando.
 *
 * ── Sobre o risco de expandir demais ─────────────────────────────────────────
 *
 * Cada sinônimo acrescentado aumenta a sensibilidade E o risco de falso positivo. Um mapeamento
 * agressivo demais ("qualquer 'passar mal' é vermelho") reproduz exatamente a sobre-triagem que
 * a revisão condena em A1. Por isso o critério aqui é conservador:
 *
 *   • expressões AMBÍGUAS mapeiam para o nível MENOR plausível, e o bloco fixo de segurança
 *     (B4) faz a discriminação — ele é determinístico, offline e não custa nada;
 *   • só mapeia para VERMELHO a expressão cujo sentido literal já é o quadro grave
 *     ("arriou tudo", "caiu duro", "tá roxo");
 *   • toda entrada é verificada por teste: `testes/lexico-regional.test.ts` falha se qualquer
 *     expressão deixar de acionar critério, e o simulador de distribuição mede o efeito
 *     agregado sobre a taxa de urgência antes de qualquer merge.
 */
export const DICIONARIO_REGIONAL: Readonly<Record<string, string>> = Object.freeze({
  // ───────────────────────────────────────────────────────────────────────────
  // Mal súbito, desmaio, rebaixamento de consciência
  // ───────────────────────────────────────────────────────────────────────────
  'deu um treco': 'desmaiou e não acordou',
  'deu um troco': 'desmaiou e não acordou',
  'deu um troço': 'desmaiou e não acordou',
  'teve um treco': 'desmaiou e não acordou',
  'deu um piripaque': 'desmaiou e não acordou',
  'deu um piti': 'desmaiou e não acordou',
  'deu um chilique': 'desmaiou e não acordou',
  'deu um faniquito': 'desmaiou e não acordou',
  'deu um fanico': 'desmaiou e não acordou',
  'deu um xilique': 'desmaiou e não acordou',
  'passou mal de repente': 'desmaiou e não acordou',
  'caiu duro': 'desmaiou e não acordou',
  'caiu dura': 'desmaiou e não acordou',
  'caiu sem sentido': 'desmaiou e não acordou',
  'perdeu os sentidos': 'desmaiou e não acordou',
  'ficou sem sentido': 'desmaiou e não acordou',
  'sem sentidos': 'não responde',
  'desfaleceu': 'desmaiou e não acordou',
  'desfalecida': 'não responde',
  'desfalecido': 'não responde',
  'arriou': 'desmaiou e não acordou',
  'arriou tudo': 'desmaiou e não acordou',
  'arriou de vez': 'desmaiou e não acordou',
  'esmorecido': 'não responde',
  'esmorecida': 'não responde',
  'esmoreceu': 'não responde',
  'desacordado': 'não responde',
  'desacordada': 'não responde',
  'nao da acordo': 'não responde',
  'nao toma tino': 'não responde',
  'nao da fe': 'não responde',
  'nao da fe de nada': 'não responde',
  'sem dar fe': 'não responde',
  'apagou de vez': 'desmaiou e não acordou',
  'apagou geral': 'desmaiou e não acordou',
  'desmilinguido': 'muito fraco',
  'desmilinguida': 'muito fraco',
  'derriçado': 'muito fraco',
  'derricado': 'muito fraco',
  'arriado': 'muito fraco',
  'arriada': 'muito fraco',
  'estrompado': 'muito fraco',
  'estrompada': 'muito fraco',
  'acabado': 'muito fraco',
  'acabada': 'muito fraco',
  'moleza': 'muito fraco',
  'moleza no corpo': 'muito fraco',
  'sem eito': 'muito fraco',
  'sem animo': 'muito fraco',
  'sem disposicao': 'muito fraco',
  'abatido': 'muito fraco',
  'abatida': 'muito fraco',
  'adoentado': 'muito fraco',
  'adoentada': 'muito fraco',
  'esculhambado do corpo': 'muito fraco',
  'quebrado todo': 'dor no corpo',
  'quebrada toda': 'dor no corpo',
  'moido': 'dor no corpo',
  'moida': 'dor no corpo',
  'to que nao presto': 'muito fraco',
  'nao presto pra nada': 'muito fraco',

  // ───────────────────────────────────────────────────────────────────────────
  // Respiratório — "cansaço" = dispneia é o regionalismo de maior impacto clínico
  // ───────────────────────────────────────────────────────────────────────────
  'cansaco': 'falta de ar',
  'canseira': 'falta de ar',
  'canseira braba': 'falta de ar forte',
  'cansado do peito': 'falta de ar',
  'cansada do peito': 'falta de ar',
  'cansaco no peito': 'falta de ar',
  'peito cansado': 'falta de ar',
  'cansa muito': 'falta de ar',
  'cansa de andar': 'falta de ar pra andar',
  'cansa a toa': 'falta de ar',
  'cansa de nada': 'falta de ar',
  'canso de tudo': 'falta de ar',
  'bafo curto': 'falta de ar',
  'folego curto': 'falta de ar',
  'sem folego': 'falta de ar',
  'falta de folego': 'falta de ar',
  'ofego': 'falta de ar',
  'ofegando': 'respirando muito rápido',
  'arfando': 'respirando muito rápido',
  'puxando o ar': 'respirando muito rápido',
  'puxando muito': 'respirando muito rápido',
  'respirando curto': 'respirando muito rápido',
  'respiracao curta': 'respirando muito rápido',
  'abafacao': 'falta de ar',
  'abafamento': 'falta de ar',
  'sufocacao': 'falta de ar forte',
  'sufocando': 'não consigo respirar',
  'sufocado': 'não consigo respirar',
  'sufocada': 'não consigo respirar',
  'afogando': 'não consigo respirar',
  'afogado do peito': 'não consigo respirar',
  'peito fechado': 'chiando no peito',
  'peito chiando': 'chiando no peito',
  'peito assobiando': 'chiando no peito',
  'chiadeira': 'chiando no peito',
  'chieira': 'chiando no peito',
  'chiado no peito': 'chiando no peito',
  'gato no peito': 'chiando no peito',
  'gato ronronando no peito': 'chiando no peito',
  'peito puxado': 'chiando no peito',
  'peito carregado': 'chiando no peito',
  'catarro preso': 'chiando no peito',
  'catarro entalado': 'chiando no peito',
  'peito cheio': 'chiando no peito',
  'roncando o peito': 'chiando no peito',
  'bombinha nao resolveu': 'usei a bombinha e não melhorou',
  'bombinha nao adiantou': 'usei a bombinha e não melhorou',
  'usei a bomba e nada': 'usei a bombinha e não melhorou',
  'defluxo': 'nariz escorrendo',
  'defluxado': 'nariz escorrendo',
  'friagem': 'nariz escorrendo',
  'friagem no corpo': 'nariz escorrendo',
  'gripado': 'nariz escorrendo',
  'gripada': 'nariz escorrendo',
  'gripezinha': 'nariz escorrendo',
  'nariz trancado': 'nariz entupido',
  'nariz fechado': 'nariz entupido',
  'venta trancada': 'nariz entupido',
  'garganta arranhada': 'garganta arranhando',
  'garganta ardida': 'dor de garganta',
  'garganta em carne viva': 'dor de garganta',
  'engolindo com dor': 'dor pra engolir',
  'doi pra engolir': 'dor pra engolir',
  'nao desce comida': 'dor pra engolir',
  'tosse braba': 'tosse',
  'tosse seca': 'tosse',
  'tosse comprida': 'tosse',
  'tossindo direto': 'tosse',
  'pigarro': 'catarro',
  'escarro': 'catarro',
  'escarrando': 'catarro',
  'gosma no peito': 'catarro',
  'ta roxo': 'lábio roxo',
  'ta roxa': 'lábio roxo',
  'ficou roxo': 'lábio roxo',
  'boca roxa': 'lábio roxo',
  'beicos roxos': 'lábio roxo',
  'unha roxa': 'lábio roxo',
  'arroxeado': 'lábio roxo',
  'arroxeada': 'lábio roxo',
  'ficando azul': 'lábio roxo',

  // ───────────────────────────────────────────────────────────────────────────
  // Cardiovascular
  // ───────────────────────────────────────────────────────────────────────────
  'mal do coracao': 'dor no peito',
  'doenca do coracao': 'dor no peito',
  'coracao ruim': 'dor no peito',
  'peito pesado': 'peso no peito',
  'peso no peito': 'peso no peito',
  'peito trancado': 'aperto no peito',
  'trancamento no peito': 'aperto no peito',
  'aperto aqui no peito': 'aperto no peito',
  'agonia no peito': 'aperto no peito',
  'aflicao no peito': 'aperto no peito',
  'peito ardendo': 'queimação no peito com falta de ar',
  'queimacao no peito': 'queimação no peito com falta de ar',
  'fogo no peito': 'queimação no peito com falta de ar',
  'fisgada no peito': 'dor no peito',
  'pontada no peito': 'dor no peito',
  'ferroada no peito': 'dor no peito',
  'dor no vao do peito': 'dor no peito',
  'dor na boca do estomago e suando': 'dor no peito e suando frio',
  'suando frio': 'dor no peito e suando frio',
  'suor frio': 'dor no peito e suando frio',
  'suadeira fria': 'dor no peito e suando frio',
  'braco esquerdo dormente': 'dor no braço esquerdo',
  'dor descendo pro braco': 'dor no braço esquerdo',
  'batedeira': 'coração disparado e medo de morrer',
  'batedeira no peito': 'coração disparado e medo de morrer',
  'coracao batendo forte': 'coração disparado e medo de morrer',
  'coracao acelerado': 'coração disparado e medo de morrer',
  'coracao disparado': 'coração disparado e medo de morrer',
  'coracao descompassado': 'coração disparado e medo de morrer',
  'palpitacao': 'coração disparado e medo de morrer',
  'pressao nas alturas': 'pressão alta',
  'pressao la em cima': 'pressão alta',
  'pressao subiu': 'pressão alta',
  'pressao descontrolada': 'pressão alta',
  'pressao alterada': 'pressão alta',
  'pressao arriada': 'pressão alta',
  'medi a pressao e deu alta': 'pressão alta',
  'a pressao ta ruim': 'pressão alta',
  'pressao doida': 'pressão alta',
  'perna inchada': 'falta de ar',
  'pe inchado': 'falta de ar',
  'inchaco nas pernas': 'falta de ar',

  // ───────────────────────────────────────────────────────────────────────────
  // Neurológico — AVC, convulsão, confusão
  // ───────────────────────────────────────────────────────────────────────────
  'derrame': 'derrame',
  'derramou': 'derrame',
  'deu derrame': 'derrame',
  'teve derrame': 'derrame',
  'trombose na cabeca': 'derrame',
  'boca entortou': 'boca torta',
  'boca torceu': 'boca torta',
  'cara torta': 'rosto torto',
  'rosto caido': 'rosto torto',
  'cara caida': 'rosto torto',
  'olho caido': 'rosto torto',
  'banda do rosto caida': 'rosto torto',
  'braco caiu': 'braço caindo',
  'braco mole': 'braço mole',
  'braco sem forca': 'braço mole',
  'perna sem forca': 'perdi a força nas pernas',
  'perna bamba': 'perdi a força nas pernas',
  'pernas bambas': 'perdi a força nas pernas',
  'perna mole': 'perdi a força nas pernas',
  'perdeu a banda': 'perdeu a força de um lado',
  'um lado nao obedece': 'perdeu a força de um lado',
  'so de um lado': 'dormência de um lado',
  'meio corpo dormente': 'dormência de um lado',
  'lingua presa': 'fala embolada',
  'fala enrolada': 'fala embolada',
  'falando enrolado': 'falando enrolado',
  'fala embaralhada': 'fala embolada',
  'nao sai a fala': 'não consegue falar',
  'perdeu a fala': 'não consegue falar',
  'nao acha as palavras': 'fala embolada',
  'ataque': 'tendo ataque',
  'deu um ataque': 'tendo ataque',
  'ataque de nervo': 'tendo ataque',
  'gota coral': 'tendo ataque',
  'mal de gota coral': 'tendo ataque',
  'virou os olhos': 'virou os olhos e tremeu',
  'revirou os olhos': 'virou os olhos e tremeu',
  'tremedeira geral': 'tremendo todo e roxo',
  'espumando pela boca': 'convulsão',
  'espuma na boca': 'convulsão',
  'tremendo todo': 'tremendo todo e roxo',
  'variando': 'muito confuso',
  'ta variando': 'muito confuso',
  'variando das ideias': 'muito confuso',
  'ruim das ideias': 'falando coisa sem sentido',
  'fora de si': 'muito confuso',
  'desnorteado': 'muito confuso',
  'desnorteada': 'muito confuso',
  'abestalhado': 'muito confuso',
  'abestalhada': 'muito confuso',
  'abestado': 'muito confuso',
  'avoado': 'muito confuso',
  'avoada': 'muito confuso',
  'caducando': 'não reconhece ninguém',
  'nao conhece mais ninguem': 'não reconhece ninguém',
  'nao sabe quem eu sou': 'não reconhece ninguém',
  'trocando os nomes': 'muito confuso',
  'falando sozinho': 'falando coisa sem sentido',
  'falando besteira': 'falando coisa sem sentido',
  'falando coisa com coisa': 'falando coisa sem sentido',
  'delirando': 'muito confuso',
  'zoada na cabeca': 'dor de cabeça',
  'zoeira na cabeca': 'dor de cabeça',
  'cabeca zoando': 'dor de cabeça',
  'cabeca rachando': 'dor de cabeça muito forte com febre',
  'dor de cabeca de rachar': 'dor de cabeça muito forte com febre',
  'cabeca estourando': 'dor de cabeça muito forte com febre',
  'dor de cabeca braba': 'dor de cabeça muito forte com febre',
  'zonzo': 'tontura ao levantar',
  'zonza': 'tontura ao levantar',
  'tonteira': 'tontura ao levantar',
  'tontice': 'tontura ao levantar',
  'cabeca rodando': 'tontura ao levantar',
  'tudo rodando': 'tontura ao levantar',
  'mundo rodando': 'tontura ao levantar',
  'vista escureceu': 'vista escurece ao levantar',
  'escureceu a vista': 'vista escurece ao levantar',
  'vista preta': 'vista escurece ao levantar',
  'vista embacada': 'vendo embaçado',
  'vista turva': 'vendo embaçado',
  'enxergando mal': 'vendo embaçado',
  'vendo tudo dobrado': 'vendo embaçado',
  'pescoco duro': 'febre e pescoço duro',
  'pescoco travado': 'febre e pescoço duro',
  'nuca dura': 'febre e pescoço duro',

  // ───────────────────────────────────────────────────────────────────────────
  // Febre e infecção
  // ───────────────────────────────────────────────────────────────────────────
  'quentura': 'febre',
  'quentura no corpo': 'febre',
  'corpo quente': 'febre',
  'febrao': 'febre',
  'febrinha': 'febre',
  'ta ardendo de febre': 'febre',
  'ardendo em febre': 'febre',
  'pegando fogo': 'febre',
  'fervendo': 'febre',
  'esquentando': 'febre',
  'calor no corpo': 'febre',
  'tremedeira de frio': 'febre',
  'calafrio': 'febre',
  'calafrios': 'febre',
  'batendo queixo': 'febre',
  'tremendo de frio': 'febre',
  'suadeira': 'febre',
  'suando muito a noite': 'febre',
  'prostrado': 'febre e prostrado',
  'prostrada': 'febre e prostrado',
  'ingua': 'ferida inflamada',
  'inguas': 'ferida inflamada',
  'caroco no pescoco': 'ferida inflamada',
  'papeira': 'ferida inflamada',

  // ───────────────────────────────────────────────────────────────────────────
  // Dor — descritores e intensificadores nordestinos
  // A4: o gatilho primário é FUNCIONAL, não numérico. Estes mapeiam para os
  // descritores funcionais de lj.dor_intensa_funcional.
  // ───────────────────────────────────────────────────────────────────────────
  'dor danada': 'dor insuportável',
  'dor braba': 'dor insuportável',
  'dor medonha': 'dor insuportável',
  'dor desgracada': 'dor insuportável',
  'dor dos infernos': 'dor insuportável',
  'dor da peste': 'dor insuportável',
  'dor arretada': 'dor insuportável',
  'dor de matar': 'dor insuportável',
  'dor de rachar': 'dor insuportável',
  'dor lascada': 'dor insuportável',
  'dor pavorosa': 'dor insuportável',
  'dor horrorosa': 'dor insuportável',
  'dor sem tamanho': 'dor insuportável',
  'doendo demais da conta': 'dor insuportável',
  'doi que so': 'dor insuportável',
  'doi demais': 'dor insuportável',
  'num aguento de dor': 'dor insuportável',
  'nao aguento de dor': 'dor insuportável',
  'nao suporto a dor': 'dor insuportável',
  'so gritando de dor': 'dor insuportável',
  'chorando de dor': 'dor insuportável',
  'rolando de dor': 'dor insuportável',
  'nao prego o olho de dor': 'dor que não deixa dormir',
  'nao durmo de dor': 'dor que não deixa dormir',
  'passo a noite acordado de dor': 'dor que não deixa dormir',
  'nao consigo me levantar de dor': 'não consigo andar de dor',
  'nao ando de dor': 'não consigo andar de dor',
  'nao dou um passo': 'não consigo andar de dor',
  'nao trabalho de dor': 'não consigo trabalhar de dor',
  'doi quando puxo o ar': 'dor que piora quando respiro fundo',
  'doi pra respirar fundo': 'dor que piora quando respiro fundo',
  'latejando': 'tá doendo',
  'fisgada': 'tá doendo',
  'pontada': 'tá doendo',
  'ferroada': 'tá doendo',
  'repuxando': 'tá doendo',
  'trincando': 'tá doendo',
  'ardendo': 'tá doendo',
  'queimando': 'tá doendo',
  'agulhada': 'tá doendo',
  'incomodo': 'dor moderada',
  'incomodacao': 'dor moderada',
  'dor chatinha': 'dor moderada',

  // ───────────────────────────────────────────────────────────────────────────
  // Gastrointestinal
  // ───────────────────────────────────────────────────────────────────────────
  'bucho': 'dor forte na barriga',
  'bucho doendo': 'dor forte na barriga',
  'dor no bucho': 'dor forte na barriga',
  'bucho embrulhado': 'enjoo',
  'bucho ruim': 'enjoo',
  'dor de barriga braba': 'dor forte na barriga',
  'barriga doendo muito': 'dor forte na barriga',
  'barriga dura': 'barriga dura',
  'barriga inchada': 'barriga dura',
  'barriga estufada': 'barriga estufada e vontade de urinar',
  'empachado': 'barriga dura',
  'empanzinado': 'barriga dura',
  'colica braba': 'cólica muito forte',
  'colica danada': 'cólica muito forte',
  'torcao na barriga': 'cólica muito forte',
  'gastura': 'enjoo',
  'gastura no estomago': 'enjoo',
  'dando gastura': 'enjoo',
  'embrulho no estomago': 'enjoo',
  'estomago embrulhado': 'enjoo',
  'estomago ruim': 'enjoo',
  'enjoo': 'enjoo',
  'enjoada': 'enjoo',
  'enjoado': 'enjoo',
  'ansia de vomito': 'enjoo',
  'com vontade de botar': 'enjoo',
  'botando tudo': 'vomitando tudo',
  'botando pra fora': 'vomitando tudo',
  'golfando': 'vomitando tudo',
  'vomitando sem parar': 'não para de vomitar',
  'nao segura nada no estomago': 'vomitando tudo',
  'nao para nada no estomago': 'vomitando tudo',
  // "azia", "refluxo" e "queimação no estômago" NÃO entram aqui.
  //
  // A tentação é mapeá-las para "queimação no peito com falta de ar" (vm.dor_toracica), e a
  // vinheta adversarial #4 do Anexo I existe exatamente para barrar isso: "tenho medo de estar
  // tendo um infarto, mas é só azia" tem que terminar em AMARELO, não em SAMU. Dispepsia não é
  // dor torácica isquêmica, e tratar as duas como sinônimo é a sobre-triagem que A1 condena.
  //
  // O caminho correto para dispepsia é o que o sistema já tem: nenhum critério bate, o relato
  // cai como vago e o BLOCO FIXO DE SEGURANÇA (B4) pergunta, de forma determinística e sem
  // rede, se há dor ou aperto no peito e falta de ar. É o bloco que discrimina — não o
  // dicionário adivinhando.
  //
  // Fica registrado para a fila de curadoria (B11): dispepsia é queixa frequente na Atenção
  // Básica e não tem critério próprio. É item para a retaguarda decidir.
  'desarranjo': 'desarranjo',
  'desarranjo intestinal': 'desarranjo',
  'soltura': 'diarreia',
  'soltura de barriga': 'diarreia',
  'caganeira': 'diarreia',
  'barriga solta': 'intestino solto',
  'indo muito no banheiro': 'indo muito ao banheiro',
  'so agua': 'diarreia',
  'diarreia braba': 'diarreia sem parar',
  'nao para de ir ao banheiro': 'diarreia sem parar',
  'prisao de ventre': 'desarranjo',
  'trancado do intestino': 'desarranjo',
  'nao vou ao banheiro faz dias': 'desarranjo',
  'coco preto': 'cocô preto',
  'fezes escuras': 'fezes pretas',
  'evacuando escuro': 'evacuando preto',
  'coco de cor de borra': 'fezes como borra de café',
  'coco tipo piche': 'fezes pretas',
  'fezes fedendo demais': 'cocô preto fedendo muito',
  'sangue no coco': 'fezes pretas',
  'botando sangue pela boca': 'vomitando sangue',
  'vomito com sangue': 'vomitando sangue',
  'rendido': 'dor forte na barriga',
  'rendidura': 'dor forte na barriga',
  'quebradura': 'dor forte na barriga',
  'ventre caido': 'dor forte na barriga',

  // ───────────────────────────────────────────────────────────────────────────
  // Urinário
  // ───────────────────────────────────────────────────────────────────────────
  'ardume': 'ardência pra urinar',
  'ardume pra mijar': 'ardência pra urinar',
  'mijo ardendo': 'ardência pra urinar',
  'arde pra mijar': 'ardência pra urinar',
  'arde quando faz xixi': 'ardência pra urinar',
  'ardencia na urina': 'ardência pra urinar',
  'queima pra urinar': 'ardência pra urinar',
  'mijo turvo': 'xixi turvo',
  'urina turva': 'xixi turvo',
  'mijo fedendo': 'xixi turvo',
  'urina com cheiro forte': 'xixi turvo',
  'urina escura': 'xixi turvo',
  'mijando toda hora': 'vontade de urinar toda hora',
  'vontade de mijar toda hora': 'vontade de urinar toda hora',
  'apertado pra mijar': 'vontade de urinar toda hora',
  'nao faz agua': 'não sai xixi',
  'nao sai mijo': 'não sai xixi',
  'nao consigo mijar': 'não consigo urinar desde ontem',
  'travou o mijo': 'não consigo urinar desde ontem',
  'bexiga cheia e nao sai': 'tô com a bexiga cheia e não consigo fazer',
  'mijando pouquinho': 'quase não faço xixi',
  'quase nao mijo': 'quase não faço xixi',
  'sangue no mijo': 'sangue na urina',
  'mijando sangue': 'sangue na urina',
  'urina com sangue': 'sangue na urina',
  'dor nas cadeiras': 'dor nas costas',
  'cadeiras doendo': 'dor nas costas',
  'dor no fundo das costas': 'dor nas costas',
  'pedra no rim': 'cólica muito forte',
  'colica de rim': 'cólica muito forte',
  'dor no saco': 'dor forte no saco',
  'dor no ovo': 'dor forte no ovo',
  'bola inchada': 'bola inchada e doendo',
  'saco inchado': 'testículo inchado',

  // ───────────────────────────────────────────────────────────────────────────
  // Obstétrico e ginecológico
  // ───────────────────────────────────────────────────────────────────────────
  'de bucho': 'grávida',
  'embuchada': 'grávida',
  'esperando neném': 'grávida',
  'esperando bebe': 'grávida',
  'de barriga': 'grávida',
  'barriguda': 'grávida',
  'pesada': 'grávida',
  'de resguardo': 'grávida',
  'no resguardo': 'grávida',
  'resguardo quebrado': 'grávida sangrando muito',
  'ganhei neném faz pouco': 'grávida',
  'pari faz pouco': 'grávida',
  'bolsa estourou': 'estourou a bolsa e saiu o cordão',
  'estourou a bolsa': 'estourou a bolsa e saiu o cordão',
  'rompeu a bolsa': 'estourou a bolsa e saiu o cordão',
  'nenem parou de mexer': 'bebê parou de mexer',
  'neném nao mexe': 'bebê parou de mexer',
  'crianca nao mexe na barriga': 'bebê parou de mexer',
  'dor de parto': 'grávida',
  'regra atrasada': 'atraso na menstruação e dor forte de um lado',
  'menstruacao atrasada': 'atraso na menstruação e dor forte de um lado',
  'regra nao desceu': 'atraso na menstruação e dor forte de um lado',
  'atraso da regra': 'atraso na menstruação e dor forte de um lado',
  'sangrando muito por baixo': 'sangrando muito',
  'hemorragia por baixo': 'sangrando muito',
  'perdendo sangue por baixo': 'perdendo muito sangue',

  // ───────────────────────────────────────────────────────────────────────────
  // Pele, partes moles e nosologia popular
  // As entradas de nosologia popular estão explicadas em NOTAS_NOSOLOGIA_POPULAR.
  // ───────────────────────────────────────────────────────────────────────────
  'zipela': 'machucado vermelho e quente',
  'zipra': 'machucado vermelho e quente',
  'esipla': 'machucado vermelho e quente',
  'erisipela': 'machucado vermelho e quente',
  'perna vermelha e quente': 'machucado vermelho e quente',
  'perna inflamada': 'ferida inflamada',
  'cobreiro': 'manchas vermelhas',
  'cobrelo': 'manchas vermelhas',
  'nascida': 'ferida com pus',
  'nascida no braco': 'ferida com pus',
  'furunco': 'ferida com pus',
  'furunculo': 'ferida com pus',
  'panariço': 'ferida com pus',
  'unheiro': 'ferida com pus',
  'ferida braba': 'ferida inflamada',
  'ferida com materia': 'ferida com pus',
  'materia na ferida': 'ferida com pus',
  'ferida catinguenta': 'ferida cheirando mal',
  'ferida fedendo': 'ferida cheirando mal',
  'ferida que nao fecha': 'ferida no pé que não sara',
  'ferida no pe do diabetico': 'ferida no pé que não sara',
  'chaga': 'ferida inflamada',
  'chaga no pe': 'ferida no pé que não sara',
  'pereba': 'ferida inflamada',
  'perebento': 'ferida inflamada',
  'empipocado': 'manchas vermelhas',
  'empipocada': 'manchas vermelhas',
  'brotoeja': 'manchas vermelhas',
  'brotoejado': 'manchas vermelhas',
  'pintado de vermelho': 'manchas vermelhas',
  'cheio de manchas': 'manchas vermelhas',
  'manchas roxas': 'manchas roxas no corpo',
  'pintas roxas': 'manchas roxas no corpo',
  'roxo no corpo sem bater': 'manchas roxas no corpo',
  'inchume': 'inchou a boca',
  'inchacao': 'inchou a boca',
  'inchou tudo': 'empolou o corpo todo',
  'empolou': 'empolou o corpo todo',
  'empolado': 'empolou o corpo todo',
  'cheio de bolhas': 'empolou o corpo todo',
  'urticaria': 'empolou o corpo todo',
  'alergia braba': 'alergia forte',
  'inchou o beico': 'inchou a boca',
  'beico inchado': 'inchou a boca',
  'lingua inchada': 'inchou a língua',
  'garganta fechando': 'garganta fechando',
  'garganta apertando': 'garganta fechando',
  'estrepou': 'me cortei',
  'estrepei': 'me cortei',
  'me cortei fundo': 'corte fundo',
  'talho': 'corte fundo',
  'talho fundo': 'corte fundo',
  'rasgou a pele': 'corte fundo',
  'abriu a carne': 'corte fundo',
  'ralado': 'arranhão',
  'esfolado': 'arranhão',
  'esfolei': 'me arranhei',
  'ralei': 'ralei o joelho',
  'raspao': 'raspão',
  'queimei': 'me cortei',

  // ───────────────────────────────────────────────────────────────────────────
  // Musculoesquelético e trauma
  // ───────────────────────────────────────────────────────────────────────────
  'espinhela caida': 'dor no corpo',
  'arca caida': 'dor no corpo',
  'peito aberto': 'dor no corpo',
  'travei as costas': 'travei as costas',
  'lombeira': 'dor nas costas',
  'dor na coluna': 'dor na coluna',
  'dor nas juntas': 'dor nas juntas',
  'juntas doendo': 'dor nas juntas',
  'junta inchada': 'dor nas juntas',
  'dor nas cadeiras e na perna': 'dor nas costas',
  'dor no vao das pernas': 'dor forte na barriga',
  'osso quebrado': 'osso pra fora',
  'osso pra fora': 'osso pra fora',
  'osso aparecendo': 'osso pra fora',
  'perna virada': 'perna torta',
  'braco torto': 'perna torta',
  'deslocou': 'perna torta',
  'se esborrachou': 'caiu do telhado',
  'levou um tombo feio': 'caiu do telhado',
  'caiu de altura': 'caiu do telhado',
  'caiu do pe de arvore': 'caiu do telhado',
  'bateu de moto': 'bateu de moto',
  'capotou': 'bateu de moto',
  'foi atropelado': 'atropelado',
  'pegou de raspao no carro': 'atropelado',
  'bateu a cuca': 'bateu a cabeça e desmaiou',
  'bateu a cabeca': 'bateu a cabeça e desmaiou',
  'levou um tiro': 'levou tiro',
  'levou uma facada': 'levou facada',
  'foi esfaqueado': 'levou facada',

  // ───────────────────────────────────────────────────────────────────────────
  // Metabólico — diabetes
  // ───────────────────────────────────────────────────────────────────────────
  'acucar alto': 'glicose alta',
  'acucar la em cima': 'glicose alta',
  'diabete alta': 'glicose alta',
  'diabetes descontrolada': 'diabético descompensado',
  'diabete descontrolada': 'diabético descompensado',
  'glicose nas alturas': 'glicose alta',
  'acucar baixo': 'açúcar baixo',
  'acucar caiu': 'açúcar baixo',
  'diabete baixa': 'açúcar baixo',
  'glicose baixa': 'glicemia baixa',
  'deu uma hipo': 'deu hipoglicemia',
  'tremendo e suado': 'tremendo e suando frio',
  'tremendo de fraqueza': 'tremendo e suando frio',
  'muita sede': 'muita sede e urinando muito',
  'sede demais': 'muita sede e urinando muito',
  'bebendo agua demais': 'muita sede e urinando muito',
  'boca seca demais': 'boca seca e fraco',
  'secando de sede': 'boca seca e fraco',
  'emagrecendo a toa': 'diabético descompensado',
  'perdendo peso sem motivo': 'diabético descompensado',

  // ───────────────────────────────────────────────────────────────────────────
  // Saúde mental — A8
  // ───────────────────────────────────────────────────────────────────────────
  'nervoso': 'ansiedade',
  'nervosa': 'ansiedade',
  'nervosismo': 'ansiedade',
  'dos nervos': 'ansiedade',
  'doente dos nervos': 'ansiedade',
  'aperreado': 'ansiedade',
  'aperreada': 'ansiedade',
  'aperreio': 'ansiedade',
  'aperreacao': 'ansiedade',
  'agoniado': 'ansiedade',
  'agoniada': 'ansiedade',
  'agonia': 'ansiedade',
  'aflito': 'ansiedade',
  'aflita': 'ansiedade',
  'aflicao': 'ansiedade',
  'angustiado': 'ansiedade',
  'angustiada': 'ansiedade',
  'sem sossego': 'ansiedade',
  'nao sossego': 'ansiedade',
  'cabeca cheia': 'ansiedade',
  'cabeca fervendo': 'ansiedade',
  'nao prego o olho': 'não consigo dormir',
  'nao durmo': 'não consigo dormir',
  'sem dormir': 'não consigo dormir',
  'noite em claro': 'não consigo dormir',
  'so rolando na cama': 'não consigo dormir',
  'desanimado': 'tô triste',
  'desanimada': 'tô triste',
  'sem vontade de nada': 'tô triste',
  'jogado num canto': 'tô triste',
  'so chorando': 'tô triste',
  'chorando a toa': 'tô triste',
  'coracao apertado': 'tô triste',
  'ta pra baixo': 'tô triste',
  'na fossa': 'tô triste',
  'depressao': 'tô triste',
  'cansei de tudo': 'cansei de tudo',
  'cansada de viver': 'não quero mais viver',
  'cansado de viver': 'não quero mais viver',
  'nao quero mais nada': 'não quero mais viver',
  'queria sumir': 'pensando em sumir',
  'queria desaparecer': 'pensando em sumir',
  'queria dormir e nao acordar': 'queria não acordar',
  'queria nao acordar mais': 'queria não acordar',
  'nao vejo saida': 'não quero mais viver',
  'melhor eu morrer': 'penso em morrer',
  'melhor que eu morresse': 'penso em morrer',
  'so dou trabalho': 'seria melhor se eu não existisse',
  'nao sirvo pra nada': 'seria melhor se eu não existisse',
  'me cortei de proposito': 'me machuquei de propósito',
  'me machuquei querendo': 'me machuquei de propósito',
  'espirito ruim': 'ouvindo vozes',
  'cabeca ruim': 'ouvindo vozes',
  'escuta vozes': 'ouvindo vozes',
  'ouve gente falando': 'ouvindo vozes',
  've gente que nao tem': 'ouvindo vozes',
  've vulto': 'ouvindo vozes',
  'acha que querem matar ele': 'acha que estão perseguindo',
  'diz que estao atras dele': 'acha que estão perseguindo',
  'desconfiado de todo mundo': 'muito agitado e desconfiado',
  'surtou': 'surtou',
  'deu um surto': 'surtou',
  'fora do normal': 'falando coisa sem sentido',
  'parei de beber': 'parei de beber e tô tremendo',
  'largou a cachaca': 'parei de beber e tô tremendo',
  'sem beber faz dias': 'parei de beber e tô tremendo',
  'tremendo sem beber': 'parei de beber e tô tremendo',
  'crise de abstinencia': 'abstinência',
  'na ressaca braba': 'abstinência',
  'perdi meu filho': 'meu filho morreu',
  'perdi minha mae': 'perdi alguém',
  'faleceu': 'perdi alguém',
  'de luto': 'perdi alguém',

  // ───────────────────────────────────────────────────────────────────────────
  // Criança — A7 / AIDPI. Linguagem de cuidador.
  // ───────────────────────────────────────────────────────────────────────────
  'molinho': 'molinho',
  'molinha': 'molinha',
  'mole demais': 'molinho',
  'sem forca nenhuma': 'molinho',
  'quebranto': 'molinho',
  'com quebranto': 'molinho',
  'olho gordo': 'molinho',
  'mau olhado': 'molinho',
  'amuado': 'molinho',
  'amuada': 'molinho',
  'caidinho': 'molinho',
  'caidinha': 'molinha',
  'gemendo': 'gemendo',
  'so gemendo': 'gemendo',
  'chorando sem parar': 'gemendo',
  'choro diferente': 'gemendo',
  'nao quer o peito': 'não quer mamar',
  'nao pega o peito': 'não quer mamar',
  'nao mama': 'não quer mamar',
  'recusa a mamadeira': 'não aceita líquido',
  'nao quer nada de comer': 'não aceita líquido',
  'nao aceita agua': 'não aceita líquido',
  'bota tudo que come': 'vomita tudo',
  'golfa tudo': 'vomita tudo',
  'nao segura nem agua': 'vomita tudo',
  'nao acorda direito': 'não acorda direito',
  'so dormindo': 'não acorda direito',
  'dificil de acordar': 'não acorda direito',
  'afundando a barriguinha': 'afundando a barriguinha',
  'afundando as costelas': 'afundando entre as costelas',
  'costela aparecendo quando respira': 'afundando entre as costelas',
  'barriguinha subindo e descendo rapido': 'afundando a barriguinha',
  'narizinho abrindo': 'nariz abrindo e fechando',
  'venta abrindo e fechando': 'nariz abrindo e fechando',
  'chiado alto': 'chiado alto pra respirar',
  'respirando com barulho': 'chiado alto pra respirar',
  'moleira funda': 'moleira funda',
  'moleira afundada': 'moleira funda',
  'moleira baixa': 'moleira funda',
  'olhinho fundo': 'olhos fundos',
  'olho encovado': 'olhos fundos',
  'chora sem lagrima': 'chora sem lágrima',
  'chora e nao sai lagrima': 'chora sem lágrima',
  'fralda seca': 'fralda seca',
  'fralda seca faz horas': 'fralda seca',
  'nao molha a fralda': 'fralda seca',
  'boquinha seca': 'boca sequinha',
  'pele murcha': 'pele murcha',
  'pele mole': 'pele murcha',
  'sapinho': 'não quer mamar',
  'nenem quente': 'neném com febre',
  'crianca quente': 'neném com febre',
  'bebe com quentura': 'neném com febre',

  // ───────────────────────────────────────────────────────────────────────────
  // Arbovirose — A6. Vocabulário local do quadro e da virada.
  // ───────────────────────────────────────────────────────────────────────────
  'dor no fundo dos olhos': 'dor atrás dos olhos',
  'olhos doendo por dentro': 'dor atrás dos olhos',
  'dor por tras dos olhos': 'dor atrás dos olhos',
  'corpo todo doendo': 'dor no corpo',
  'corpo moido': 'dor no corpo',
  'dor no corpo todinho': 'dor no corpo',
  'dor nos ossos': 'dor no corpo',
  'febre quebra osso': 'febre com dor nas juntas',
  'quebra ossos': 'febre com dor nas juntas',
  'dengue': 'dengue',
  'chicungunha': 'chikungunya',
  'chincungunha': 'chikungunya',
  'a febre baixou e piorei': 'melhorou a febre mas piorou',
  'baixou a febre e piorou': 'melhorou a febre mas piorou',
  'a quentura passou e piorou': 'melhorou a febre mas piorou',
  'sangramento na gengiva': 'sangramento na gengiva',
  'gengiva sangrando': 'sangramento na gengiva',
  'sangrando pelo nariz': 'sangrando o nariz',
  'sangue pelo nariz': 'sangrando o nariz',

  // ───────────────────────────────────────────────────────────────────────────
  // Boca, dentes, olhos e ouvidos
  // ───────────────────────────────────────────────────────────────────────────
  'dor de dente braba': 'dor de dente e o rosto inchou',
  'dente estragado': 'dente inflamado com febre',
  'dente cariado': 'dente inflamado com febre',
  'dente inflamado': 'dente inflamado com febre',
  'cara inchada do dente': 'dor de dente e o rosto inchou',
  'rosto inchou do dente': 'inchaço no rosto por causa do dente',
  'nao abro a boca': 'dificuldade de abrir a boca',
  'boca travada': 'dificuldade de abrir a boca',
  'caroco na gengiva': 'abscesso no dente',
  'caiu no olho': 'caiu produto no olho',
  'respingou no olho': 'respingou soda no olho',
  'entrou soda no olho': 'soda no olho',
  'entrou agua sanitaria no olho': 'água sanitária no olho',
  'queimei a vista': 'queimei a vista',
  'olho ardendo de produto': 'entrou química no olho',

  // ───────────────────────────────────────────────────────────────────────────
  // Engasgo, choque, afogamento
  // ───────────────────────────────────────────────────────────────────────────
  'entalou': 'entalou na garganta',
  'entalado': 'entalou na garganta',
  'entalou na goela': 'entalou na garganta',
  'travou na garganta': 'entalou na garganta',
  'engasgou feio': 'engasgou',
  'engoliu errado': 'engasgou',
  'foi pro lado errado': 'engasgou',
  'nao consegue nem tossir': 'não consegue tossir',
  'engoliu uma coisa': 'engoliu objeto',
  'botou na boca e engoliu': 'engoliu objeto',
  'tomou choque': 'levou choque',
  'levou choque do chuveiro': 'levou choque do chuveiro',
  'pegou choque na tomada': 'tomou choque na tomada',
  'quase afogou': 'quase se afogou',
  'engoliu agua na piscina': 'engoliu muita água na piscina',
  'se afogou no acude': 'quase se afogou',
  'se afogou no mar': 'quase se afogou',
  'respirou fumaca': 'respirou fumaça',
  'aspirou fumaca': 'inalou fumaça',
  'ficou rouco do fogo': 'rouco depois do fogo',
});

/**
 * Termos de NOSOLOGIA POPULAR — nomes populares de doença que carregam um mapeamento
 * clínico, não apenas um sinônimo de sintoma.
 *
 * Estas são as entradas do dicionário que a equipe clínica precisa revisar com MAIS
 * atenção antes de assinar, porque cada uma afirma uma equivalência clínica — e uma
 * equivalência errada aqui não produz apenas uma palavra não reconhecida: produz um
 * encaminhamento errado.
 *
 * Exibidas no painel, aba Curadoria, e no documento gerado por `npm run protocolo`.
 */
export const NOTAS_NOSOLOGIA_POPULAR: Readonly<Record<string, string>> = Object.freeze({
  quebranto:
    'Nome popular para prostração/letargia em criança, atribuída a mau-olhado. É o mesmo ' +
    'quadro que a AIDPI trata como SINAL GERAL DE PERIGO. Mapeado para "molinho" (A7) — ' +
    'a explicação da família sobre a causa é irrelevante para o risco, e discutir a causa ' +
    'com a família afasta em vez de acolher.',
  zipela:
    'Erisipela. Infecção de pele com porta de entrada, comum e potencialmente grave em ' +
    'pessoa com diabetes. Mapeado para "machucado vermelho e quente" (lj.ferida_infectada).',
  cobreiro:
    'Herpes-zóster. O tratamento antiviral tem janela útil de cerca de 72 horas do início ' +
    'das lesões, o que torna o reconhecimento precoce relevante. Hoje mapeado apenas para ' +
    '"manchas vermelhas" — a retaguarda precisa decidir se merece critério próprio.',
  'espinhela caida':
    'Queixa torácica/epigástrica sem correlato anatômico. NÃO deve ser descartada: pode ' +
    'recobrir dor torácica real. Mapeada para "dor no corpo" e a discriminação fica com o ' +
    'bloco fixo de segurança (B4), que pergunta diretamente sobre dor no peito.',
  rendidura:
    'Hérnia. "Rendido"/"quebradura" descrevem hérnia inguinal ou umbilical. Se encarcerada, ' +
    'é emergência cirúrgica. Mapeada para "dor forte na barriga" (laranja) — a retaguarda ' +
    'precisa decidir se hérnia encarcerada merece bandeira própria, como os quadros de A5.',
  'gota coral':
    'Nome popular de epilepsia no interior do Nordeste. Mapeado para "tendo ataque" (convulsão).',
  papeira:
    'Caxumba, ou qualquer aumento de volume cervical. Mapeado para "ferida inflamada"; ' +
    'a retaguarda deve avaliar se merece tratamento próprio.',
  ingua:
    'Linfonodo aumentado. Frequentemente benigno, mas pode acompanhar infecção significativa. ' +
    'Mapeado para "ferida inflamada" (laranja) — provavelmente conservador demais; item para ' +
    'revisão clínica.',
  'olho gordo':
    'Ver "quebranto". Mesmo tratamento: o sinal observável é o que importa.',
  resguardo:
    'Puerpério. "De resguardo" indica pós-parto recente, que muda completamente o risco de ' +
    'uma queixa. Mapeado para gestante, o que aciona o roteamento obstétrico (A11).',
  'de bucho':
    'Grávida. Junto com "embuchada" e "de barriga", é como boa parte da população descreve ' +
    'gestação — a palavra "gestante" é de prontuário, não de casa.',
});

/** Normaliza texto: minúsculas, sem acento, espaços colapsados. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\wà-ú\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Entradas pré-normalizadas e ordenadas da MAIS LONGA para a mais curta.
 *
 * A ordem importa: com centenas de entradas, "dor de cabeça" está contida em "dor de cabeça
 * de rachar", e as duas mapeiam para níveis diferentes. Casando primeiro a expressão mais
 * longa e suprimindo as menores nela contidas, o relato é traduzido pela expressão mais
 * específica que a pessoa de fato usou.
 */
const ENTRADAS_ORDENADAS = Object.entries(DICIONARIO_REGIONAL)
  .map(([expressao, canonico]) => ({ expressao, canonico, alvo: normalizar(expressao) }))
  .sort((a, b) => b.alvo.length - a.alvo.length);

/**
 * Casamento com fronteira de palavra.
 *
 * Com 48 entradas dava para conferir a olho que nenhuma era subcadeia de outra palavra.
 * Com centenas, não dá: sem fronteira, "ingua" casaria dentro de "linguagem", "mole" dentro
 * de "molecada", "ardume" dentro de qualquer coisa. Um falso positivo aqui vira bandeira
 * vermelha irreversível — exatamente o risco que B1 descreve.
 */
function posicoesDe(texto: string, alvo: string): number[] {
  if (alvo.length === 0) return [];
  const posicoes: number[] = [];
  let i = texto.indexOf(alvo);
  while (i !== -1) {
    const antesOk = i === 0 || texto[i - 1] === ' ';
    const fim = i + alvo.length;
    const depoisOk = fim === texto.length || texto[fim] === ' ';
    if (antesOk && depoisOk) posicoes.push(i);
    i = texto.indexOf(alvo, i + 1);
  }
  return posicoes;
}

/**
 * Aplica o dicionário regional, devolvendo o texto expandido e os termos traduzidos.
 *
 * O termo canônico é inserido IMEDIATAMENTE ANTES da expressão que o originou — nunca
 * anexado ao fim do relato. A diferença não é estética: as guardas linguísticas de B1
 * (negação, passado, hipótese) inspecionam as palavras ANTERIORES ao termo encontrado.
 *
 * Anexando ao fim, o termo canônico herdava a janela de negação do relato inteiro, e
 * expressões cujo próprio nome contém uma negativa se auto-anulavam:
 *
 *   "caiu sem sentido"  → "caiu sem sentido | desmaiou e não acordou"
 *                          o "sem" da própria expressão negava o termo traduzido,
 *                          e a bandeira vermelha nunca disparava.
 *
 * Inserindo na posição, a janela reflete o que de fato precede a expressão no relato:
 *
 *   "caiu sem sentido"        → "[desmaiou e não acordou] caiu sem sentido"      → dispara
 *   "não deu um treco nenhum" → "não [desmaiou e não acordou] deu um treco …"    → negado
 *   "ano passado ela arriou"  → "ano passado ela [desmaiou …] arriou"            → passado
 *
 * O relato original é preservado inteiro no texto — a tradução acrescenta, nunca substitui,
 * para que a auditoria veja exatamente o que a pessoa escreveu.
 */
export function expandirRegionalismos(textoNormalizado: string): {
  texto: string;
  traduzidos: { de: string; para: string }[];
} {
  const casamentos: { expressao: string; canonico: string; inicio: number; fim: number }[] = [];

  for (const { expressao, canonico, alvo } of ENTRADAS_ORDENADAS) {
    for (const inicio of posicoesDe(textoNormalizado, alvo)) {
      const fim = inicio + alvo.length;
      // Expressão mais longa já ocupou este trecho — a mais específica vence.
      const sobreposto = casamentos.some((c) => inicio < c.fim && fim > c.inicio);
      if (sobreposto) continue;
      casamentos.push({ expressao, canonico, inicio, fim });
    }
  }

  if (casamentos.length === 0) return { texto: textoNormalizado, traduzidos: [] };

  casamentos.sort((a, b) => a.inicio - b.inicio);

  let texto = '';
  let cursor = 0;
  for (const c of casamentos) {
    texto += textoNormalizado.slice(cursor, c.inicio) + normalizar(c.canonico) + ' ';
    cursor = c.inicio;
  }
  texto += textoNormalizado.slice(cursor);

  return {
    texto: texto.replace(/\s+/g, ' ').trim(),
    traduzidos: casamentos.map((c) => ({ de: c.expressao, para: c.canonico })),
  };
}

/** Total de expressões catalogadas — exibido no painel e no documento do protocolo. */
export const TOTAL_REGIONALISMOS = ENTRADAS_ORDENADAS.length;
