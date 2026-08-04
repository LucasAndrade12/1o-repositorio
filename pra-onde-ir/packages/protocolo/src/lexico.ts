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
]);

/** Termos que CANCELAM a negação — "não melhorou", "não passa" não negam o sintoma. */
export const NEGACAO_CANCELADA_POR: readonly string[] = Object.freeze([
  'melhora', 'melhorou', 'melhorando', 'passa', 'passou', 'para', 'parou', 'cessa', 'cessou',
  'aguento', 'aguenta', 'consigo', 'consegue', 'resolve', 'resolveu', 'adianta', 'adiantou',
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
]);

/** Termos que indicam que o quadro é AGORA — vencem os marcadores de passado. */
export const MARCADORES_PRESENTE: readonly string[] = Object.freeze([
  'agora', 'neste momento', 'nesse momento', 'esta acontecendo', 'ta acontecendo',
  'to com', 'estou com', 'esta com', 'ta com', 'comecou agora', 'de repente',
  'ha pouco', 'agorinha', 'faz minutos', 'acabou de', 'ainda esta', 'continua',
  'hoje', 'desde ontem', 'desde hoje',
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
]);

/** Marcadores de que o relato é sobre um terceiro QUE É o paciente (D2). */
export const MARCADORES_TERCEIRO_PACIENTE: readonly string[] = Object.freeze([
  'meu filho', 'minha filha', 'meu pai', 'minha mae', 'meu marido', 'minha esposa',
  'minha mulher', 'meu esposo', 'meu neto', 'minha neta', 'meu irmao', 'minha irma',
  'minha avo', 'meu avo', 'meu bebe', 'minha bebe', 'o menino', 'a menina',
  'meu companheiro', 'minha companheira', 'ele esta', 'ela esta', 'ele ta', 'ela ta',
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
 * Dicionário regional potiguar (roteiro de funcionalidades).
 * "expressões locais que a busca por palavra-chave não cobre. Coleta com a equipe e com os
 *  agentes comunitários."
 *
 * Mapeia expressão local → termo canônico já presente em `comoAPessoaDescreve`.
 */
export const DICIONARIO_REGIONAL: Readonly<Record<string, string>> = Object.freeze({
  'deu um treco': 'desmaiou e não acordou',
  'deu um troço': 'desmaiou e não acordou',
  'arriou': 'desmaiou e não acordou',
  'arriou tudo': 'desmaiou e não acordou',
  'esmorecido': 'não responde',
  'esmoreceu': 'não responde',
  'desacordado': 'não responde',
  'passou mal de repente': 'desmaiou e não acordou',
  'cansaço': 'falta de ar',
  'cansado do peito': 'falta de ar',
  'canseira': 'falta de ar',
  'aperreado': 'muito agitado e desconfiado',
  'aperreada': 'muito agitado e desconfiado',
  'ruim das ideias': 'falando coisa sem sentido',
  'quebranto': 'muito fraco',
  'moleza': 'muito fraco',
  'derriçado': 'muito fraco',
  'zoada na cabeça': 'dor de cabeça',
  'zonzo': 'tontura ao levantar',
  'zonza': 'tontura ao levantar',
  'estrepou': 'me cortei',
  'estrepei': 'me cortei',
  'espinhela caída': 'dor no corpo',
  'gastura': 'enjoo',
  'gastura no estômago': 'enjoo',
  'embrulho no estômago': 'enjoo',
  'peito chiando': 'chiando no peito',
  'catarro preso': 'chiando no peito',
  'ardume': 'ardência pra urinar',
  'mijo ardendo': 'ardência pra urinar',
  'não faz água': 'não sai xixi',
  'barriga estufada': 'barriga estufada e vontade de urinar',
  'quentura': 'febre',
  'corpo quente': 'febre',
  'febrão': 'febre',
  'dor de dente braba': 'dor de dente e o rosto inchou',
  'inchume': 'inchou a boca',
  'empipocado': 'manchas vermelhas',
  'brotoeja': 'manchas vermelhas',
  'bucho doendo': 'dor forte na barriga',
  'mal do coração': 'dor no peito',
  'pressão nas alturas': 'pressão alta',
  'açúcar alto': 'glicose alta',
  'açúcar baixo': 'açúcar baixo',
  'nervoso': 'ansiedade',
  'nervosismo': 'ansiedade',
  'espírito ruim': 'ouvindo vozes',
  'cabeça ruim': 'ouvindo vozes',
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

/** Aplica o dicionário regional, devolvendo o texto expandido e os termos traduzidos. */
export function expandirRegionalismos(textoNormalizado: string): {
  texto: string;
  traduzidos: { de: string; para: string }[];
} {
  let texto = textoNormalizado;
  const traduzidos: { de: string; para: string }[] = [];
  for (const [expressao, canonico] of Object.entries(DICIONARIO_REGIONAL)) {
    const alvo = normalizar(expressao);
    if (texto.includes(alvo)) {
      texto = `${texto} ${normalizar(canonico)}`;
      traduzidos.push({ de: expressao, para: canonico });
    }
  }
  return { texto, traduzidos };
}
