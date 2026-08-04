/**
 * CAMADA 1 — varredura determinística de bandeiras vermelhas.
 *
 * Roda ANTES de qualquer chamada de rede. A revisão elogia esta decisão explicitamente:
 * "Reconhecer a instabilidade de internet como requisito, e não como exceção, é engenharia
 *  madura." Ela é preservada e reforçada.
 *
 * Os achados endereçados aqui:
 *
 *   B1 (CRÍTICO) — negação, tempo verbal e sujeito. O casamento de palavras-chave cru
 *                  disparava AVC → SAMU em "ela NÃO está com a boca torta".
 *   B2 (ALTO)    — curto-circuito: bandeira confirmada devolve imediatamente, sem esperar rede.
 *   B10          — relato tratado como dado; detecção de tentativa de injeção.
 *   D2           — distinção entre quem digita e quem é o paciente.
 *
 * Princípio preservado da v1: a camada 1 SÓ ACRESCENTA critérios, nunca remove.
 * O falso positivo é resolvido na ENTRADA, com pergunta fechada determinística — nunca com
 * a IA rebaixando nível.
 */

import {
  CRITERIOS,
  MODULO_ARBOVIROSE,
  JANELA_NEGACAO,
  LIMITE_CARACTERES_RELATO,
  MARCADORES_HIPOTESE,
  MARCADORES_NEGACAO,
  MARCADORES_PASSADO,
  MARCADORES_PRESENTE,
  MARCADORES_TERCEIRO_NAO_PACIENTE,
  MARCADORES_TERCEIRO_PACIENTE,
  NEGACAO_CANCELADA_POR,
  PADROES_INJECAO,
  expandirRegionalismos,
  normalizar,
  type Criterio,
} from '@pra-onde-ir/protocolo';

/** Por que um termo encontrado no texto foi descartado. */
export type MotivoDescarte = 'negacao' | 'passado' | 'hipotese' | 'terceiro_nao_paciente';

export interface AcertoCamada1 {
  criterioId: string;
  termo: string;
  posicao: number;
  /** Trecho do relato em torno do termo, para auditoria e para a tela de confirmação. */
  contexto: string;
  /** Se preenchido, o acerto foi DESCARTADO por este motivo (B1). */
  descartadoPor?: MotivoDescarte;
  /** Marcador linguístico que causou o descarte — registrado para auditoria. */
  marcador?: string;
  /** Termo regional traduzido que levou a este acerto. */
  viaRegionalismo?: string;
  /** Quantas palavras foram puladas entre os tokens do termo. Menor = casamento mais justo. */
  lacunas?: number;
}

export interface ResultadoCamada1 {
  /** Critérios efetivamente acionados (acertos não descartados). */
  criteriosAcionados: string[];
  /** Todos os acertos, inclusive os descartados — a transparência que permite auditar B1. */
  acertos: AcertoCamada1[];
  /** Há bandeira vermelha irreversível acionada? Dispara o curto-circuito de B2. */
  bandeiraVermelha: boolean;
  /**
   * B1 — quando há bandeira vermelha, o sistema pergunta antes de acionar o SAMU.
   * "sim" mantém; "não" remove o disparo DAQUELA varredura e registra o motivo.
   */
  exigeConfirmacao: boolean;
  /** D2 — o relato parece ser sobre um terceiro? */
  sujeito: 'proprio' | 'terceiro' | 'indeterminado';
  /** B10 — tentativa de injeção de instrução detectada. */
  injecaoDetectada: boolean;
  padroesInjecao: string[];
  /** Regionalismos traduzidos (dicionário potiguar). */
  regionalismos: { de: string; para: string }[];
  /** Relato truncado no limite de tamanho (B10). */
  truncado: boolean;
  /** Texto normalizado usado na varredura — auditável. */
  textoNormalizado: string;
  /**
   * Especificidade do casamento por critério: comprimento do termo mais específico que casou.
   * Usada como desempate na camada 3 — casamento mais específico prevalece sobre o genérico.
   */
  especificidade: Record<string, number>;
  /**
   * A11 — gestação detectada no texto, com idade gestacional quando informada.
   *
   * Sem isto, "grávida de 8 meses com febre e ardência pra urinar" só chega à maternidade se
   * a pessoa tiver marcado a caixa de gravidez na tela de agravantes. Em modo degradado não
   * há IA para extrair, e o roteamento obstétrico simplesmente não dispararia — reproduzindo
   * exatamente a peregrinação que A11 existe para eliminar.
   */
  gestacao: { detectada: boolean; semanas: number | null } | null;
  /**
   * A3 — sinais de alarme reconhecidos NO TEXTO LIVRE.
   *
   * A camada 3 já sabia reclassificar um critério para cima na presença de sinal de alarme,
   * mas só recebia esses sinais como resposta de formulário. Quem escrevia
   * "minha pressão tá alta e eu tô vendo embaçado" tinha o sinal de lesão de órgão-alvo
   * ignorado, porque o índice da camada 1 só cobria `comoAPessoaDescreve` — nunca
   * `sinaisDeAlarme.comoAPessoaDescreve`. Era A3 implementado pela metade.
   *
   * Devolvidos com o texto ORIGINAL do critério (com acento), porque é assim que a camada 3
   * os compara.
   */
  sinaisDeAlarme: string[];
  /**
   * A6 — módulo sazonal de arbovirose.
   *
   * A revisão chama este de "isoladamente, o módulo de maior valor local do sistema". Os
   * dados existiam em `MODULO_ARBOVIROSE` desde o início, mas nenhum deles era indexado:
   * a regra de reconhecimento (febre + 2 sintomas típicos) e os sinais de alarme de checagem
   * obrigatória nunca eram avaliados sobre o relato. Só disparavam os dois critérios
   * `arb.*` quando a pessoa usava exatamente uma das frases catalogadas.
   */
  arbovirose: {
    sintomas: string[];
    alarmes: { id: string; nivel: Criterio['nivel'] }[];
    suspeita: boolean;
  };
}

/**
 * Índice invertido: termo → critérios que ele aciona.
 *
 * O casamento NÃO é por substring contígua. Fala espontânea insere palavras no meio das
 * expressões — "fezes TÃO pretas", "dor MUITO forte no saco", "atraso DE 2 MESES na
 * menstruação". Um casamento contíguo perderia todos esses casos, e perder é sub-triagem:
 * o erro caro. Aqui os tokens do termo precisam aparecer NA ORDEM, dentro de um orçamento
 * de lacunas proporcional ao tamanho do termo.
 *
 * Continua sendo determinístico, offline e auditável — cada acerto registra quantas lacunas
 * foram consumidas.
 */
interface TermoIndexado {
  termo: string;
  tokens: string[];
  orcamento: number;
  criterios: string[];
}

const INDICE: TermoIndexado[] = (() => {
  const porTermo = new Map<string, TermoIndexado>();
  for (const c of CRITERIOS) {
    for (const bruto of c.comoAPessoaDescreve) {
      const termo = normalizar(bruto);
      if (!termo) continue;
      const existente = porTermo.get(termo);
      if (existente) {
        if (!existente.criterios.includes(c.id)) existente.criterios.push(c.id);
        continue;
      }
      const tokens = termo.split(' ').filter(Boolean);
      porTermo.set(termo, {
        termo,
        tokens,
        // Termos de uma palavra casam exato; a partir de duas, toleram as intercalações da
        // fala real ("fezes TÃO pretas", "dor MUITO forte no saco"). Perder esses casos
        // seria sub-triagem — o erro caro.
        orcamento: tokens.length <= 1 ? 0 : tokens.length === 2 ? 1 : Math.max(2, Math.ceil(tokens.length * 0.7)),
        criterios: [c.id],
      });
    }
  }
  // Do mais específico para o mais genérico.
  return [...porTermo.values()].sort((a, b) => b.termo.length - a.termo.length);
})();

const CRITERIOS_POR_ID = new Map(CRITERIOS.map((c) => [c.id, c]));

/** Mesmo cálculo de orçamento do índice principal, para termos fora de `comoAPessoaDescreve`. */
function montarTermo(bruto: string, refs: string[]): (TermoIndexado & { bruto: string }) | null {
  const termo = normalizar(bruto);
  if (!termo) return null;
  const tokens = termo.split(' ').filter(Boolean);
  return {
    bruto,
    termo,
    tokens,
    orcamento:
      tokens.length <= 1 ? 0 : tokens.length === 2 ? 1 : Math.max(2, Math.ceil(tokens.length * 0.7)),
    criterios: refs,
  };
}

/**
 * A3 — índice dos sinais de alarme declarados dentro dos critérios.
 *
 * Deliberadamente SEPARADO do índice principal: casar "vendo embaçado" não pode acionar
 * `am.pressao_alta_assintomatica` por si só — quem enxerga embaçado não declarou pressão alta.
 * O sinal de alarme só escalona um critério que JÁ está em jogo, e é exatamente isso que a
 * camada 3 faz com esta lista.
 */
const INDICE_ALARMES: (TermoIndexado & { bruto: string })[] = CRITERIOS.flatMap((c) =>
  (c.sinaisDeAlarme?.comoAPessoaDescreve ?? [])
    .map((bruto) => montarTermo(bruto, [c.id]))
    .filter((t): t is TermoIndexado & { bruto: string } => t !== null),
).sort((a, b) => b.termo.length - a.termo.length);

/** A6 — sintomas típicos de arbovirose (a regra é febre + `minimoSintomas`). */
const INDICE_ARBO_SINTOMAS: (TermoIndexado & { bruto: string })[] =
  MODULO_ARBOVIROSE.reconhecimento.sintomasTipicos
    .flatMap((s) => s.termos.map((bruto) => montarTermo(bruto, [s.id])))
    .filter((t): t is TermoIndexado & { bruto: string } => t !== null)
    .sort((a, b) => b.termo.length - a.termo.length);

/** A6 — sinais de alarme de checagem obrigatória do módulo de arbovirose. */
const INDICE_ARBO_ALARMES: (TermoIndexado & { bruto: string })[] =
  MODULO_ARBOVIROSE.sinaisDeAlarme
    .flatMap((s) => s.termos.map((bruto) => montarTermo(bruto, [s.id])))
    .filter((t): t is TermoIndexado & { bruto: string } => t !== null)
    .sort((a, b) => b.termo.length - a.termo.length);

const NIVEL_ALARME_ARBO = new Map(MODULO_ARBOVIROSE.sinaisDeAlarme.map((s) => [s.id, s.nivel]));

/** Ids de critério que representam febre — a condição obrigatória do reconhecimento (A6). */
const CRITERIOS_DE_FEBRE = new Set(
  CRITERIOS.filter((c) => /febre|febril/i.test(c.titulo)).map((c) => c.id),
);

/**
 * Casa os tokens do termo no texto, na ordem, dentro do orçamento de lacunas.
 * Devolve todos os casamentos encontrados.
 */
function casarTokens(
  tokensTexto: string[],
  offsets: number[],
  t: TermoIndexado,
): { inicio: number; fim: number; posicao: number; lacunas: number }[] {
  const achados: { inicio: number; fim: number; posicao: number; lacunas: number }[] = [];
  const [primeiro] = t.tokens;
  if (!primeiro) return achados;

  for (let i = 0; i < tokensTexto.length; i++) {
    if (tokensTexto[i] !== primeiro) continue;
    let j = i;
    let k = 1;
    let lacunas = 0;
    while (k < t.tokens.length && j + 1 < tokensTexto.length) {
      j++;
      if (tokensTexto[j] === t.tokens[k]) {
        k++;
      } else {
        lacunas++;
        if (lacunas > t.orcamento) break;
      }
    }
    if (k === t.tokens.length && lacunas <= t.orcamento) {
      achados.push({ inicio: i, fim: j, posicao: offsets[i]!, lacunas });
      i = j; // não sobrepõe casamentos do mesmo termo
    }
  }
  return achados;
}

export function varrer(relatoBruto: string): ResultadoCamada1 {
  const truncado = relatoBruto.length > LIMITE_CARACTERES_RELATO;
  const relato = truncado ? relatoBruto.slice(0, LIMITE_CARACTERES_RELATO) : relatoBruto;

  const base = normalizar(relato);
  const { texto, traduzidos } = expandirRegionalismos(base);

  // ── B10 — detecção de tentativa de injeção de instrução ─────────────────
  const padroesInjecao = PADROES_INJECAO.filter((p) => texto.includes(normalizar(p)));

  // ── D2 — quem é o paciente ──────────────────────────────────────────────
  const sujeito = detectarSujeito(texto);

  // ── A11 — gestação é variável de roteamento, detectada sem IA ───────────
  const gestacao = detectarGestacao(texto);

  // Tokeniza uma vez, guardando o offset de cada token para as janelas linguísticas.
  const tokensTexto: string[] = [];
  const offsets: number[] = [];
  {
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(texto)) !== null) {
      tokensTexto.push(m[0]);
      offsets.push(m.index);
    }
  }

  // ── Varredura ───────────────────────────────────────────────────────────
  const acertos: AcertoCamada1[] = [];
  const especificidade: Record<string, number> = {};

  for (const t of INDICE) {
    for (const casamento of casarTokens(tokensTexto, offsets, t)) {
      const contexto = extrairContexto(texto, casamento.posicao, t.termo.length);
      const descarte = avaliarDescarte(texto, casamento.posicao, sujeito);
      const viaRegional = traduzidos.find((tr) => normalizar(tr.para).includes(t.termo));

      for (const criterioId of t.criterios) {
        acertos.push({
          criterioId,
          termo: t.termo,
          posicao: casamento.posicao,
          contexto,
          lacunas: casamento.lacunas,
          ...(descarte ? { descartadoPor: descarte.motivo, marcador: descarte.marcador } : {}),
          ...(viaRegional ? { viaRegionalismo: viaRegional.de } : {}),
        });
        if (!descarte) {
          especificidade[criterioId] = Math.max(especificidade[criterioId] ?? 0, t.termo.length);
        }
      }
    }
  }

  // Candidatos = critérios com pelo menos um acerto não descartado.
  const candidatos = new Set<string>();
  for (const a of acertos) if (!a.descartadoPor) candidatos.add(a.criterioId);

  // ── Regra de combinação: alguns critérios exigem mais de um grupo de sinais ──
  const termosAtivos = new Set(
    acertos.filter((a) => !a.descartadoPor).map((a) => a.termo),
  );
  const criteriosAcionados = [...candidatos].filter((id) => {
    const c = CRITERIOS_POR_ID.get(id);
    if (!c?.exigeTodos) return true;
    return c.exigeTodos.every((grupo) =>
      grupo.some((alt) => {
        const alvo = normalizar(alt);
        return texto.includes(alvo) || [...termosAtivos].some((t) => t.includes(alvo));
      }),
    );
  });

  for (const id of [...candidatos]) {
    if (!criteriosAcionados.includes(id)) delete especificidade[id];
  }

  // ── Índices auxiliares: sinais de alarme (A3) e módulo de arbovirose (A6) ──
  // Passam pelas MESMAS guardas de B1 — negação, passado, hipótese e sujeito.
  const casarIndice = (indice: (TermoIndexado & { bruto: string })[]) =>
    indice.filter((t) =>
      casarTokens(tokensTexto, offsets, t).some(
        (c) => !avaliarDescarte(texto, c.posicao, sujeito),
      ),
    );

  const sinaisDeAlarme = [...new Set(casarIndice(INDICE_ALARMES).map((t) => t.bruto))];

  const sintomasArbo = [
    ...new Set(casarIndice(INDICE_ARBO_SINTOMAS).flatMap((t) => t.criterios)),
  ];
  const alarmesArbo = [
    ...new Set(casarIndice(INDICE_ARBO_ALARMES).flatMap((t) => t.criterios)),
  ].map((id) => ({ id, nivel: NIVEL_ALARME_ARBO.get(id) ?? ('laranja' as const) }));

  // A6 — "reconhecimento: febre MAIS dois sintomas típicos".
  const temFebre = criteriosAcionados.some((id) => CRITERIOS_DE_FEBRE.has(id));
  const suspeitaArbo =
    MODULO_ARBOVIROSE.ativo &&
    temFebre &&
    sintomasArbo.length >= MODULO_ARBOVIROSE.reconhecimento.minimoSintomas;

  if (suspeitaArbo && !criteriosAcionados.includes('arb.suspeita')) {
    criteriosAcionados.push('arb.suspeita');
  }
  // Sinal de alarme só qualifica um quadro que JÁ é suspeito. Tontura postural isolada não
  // é arbovirose — tratá-la como tal reproduziria a sobre-triagem que A1 condena.
  const ehSuspeito = suspeitaArbo || criteriosAcionados.includes('arb.suspeita');
  if (ehSuspeito && alarmesArbo.length > 0 && !criteriosAcionados.includes('arb.sinal_alarme')) {
    criteriosAcionados.push('arb.sinal_alarme');
  }

  // ── A7 — febre infantil decidida pela IDADE, não pela frase ───────────────
  // Corrige a inversão que a auditoria encontrou: <3 meses é VERMELHO, 3–6 é LARANJA.
  const idadeInfantil = detectarIdadeInfantil(texto);
  const temFebreNoTexto =
    temFebre || criteriosAcionados.includes('am.febre_adulto') || /\bfebre\b|\bfebril\b/.test(texto);
  if (idadeInfantil && temFebreNoTexto) {
    const alvo =
      idadeInfantil.meses < 3
        ? 'ped.febre_menor_3_meses'
        : idadeInfantil.meses <= 6
          ? 'ped.febre_3_a_6_meses'
          : 'am.febre_adulto';
    for (const id of ['ped.febre_menor_3_meses', 'ped.febre_3_a_6_meses']) {
      const i = criteriosAcionados.indexOf(id);
      if (i !== -1 && id !== alvo) criteriosAcionados.splice(i, 1);
    }
    if (!criteriosAcionados.includes(alvo)) criteriosAcionados.push(alvo);
  }

  // ── A9 / B2 — emergência ou violência TESTEMUNHADA sobre terceiro é ação ───
  // "minha vizinha bate no filho pequeno" é notificação compulsória; "meu vizinho bateu de
  // moto e o osso tá pra fora" é motivo para chamar o SAMU. O filtro de terceiro-não-paciente
  // existe para impedir que "meu vizinho desmaiou SEMANA PASSADA, quero saber se me preocupo"
  // acione o SAMU — e isso já é resolvido pela guarda de PASSADO, que roda ANTES da de
  // terceiro. Logo, um acerto que chegou a ser descartado SÓ por "terceiro_nao_paciente" é,
  // por construção, presente, não negado e não hipotético: um relato de algo acontecendo
  // agora com alguém por perto. Para VIOLÊNCIA e para BANDEIRA VERMELHA irreversível, a ação
  // certa é agir. Os demais quadros seguem descartados — não se aciona a UBS pela virose do
  // vizinho.
  for (const a of acertos) {
    if (a.descartadoPor !== 'terceiro_nao_paciente') continue;
    if (criteriosAcionados.includes(a.criterioId)) continue;
    const c = CRITERIOS_POR_ID.get(a.criterioId);
    const ehViolencia = c?.tipoQueixa === 'violencia';
    const ehEmergencia = c?.nivel === 'vermelho' && c?.irreversivel === true;
    if (ehViolencia || ehEmergencia) criteriosAcionados.push(a.criterioId);
  }

  const bandeiraVermelha = criteriosAcionados.some((id) => {
    const c = CRITERIOS_POR_ID.get(id);
    return c?.nivel === 'vermelho' && c.irreversivel === true;
  });

  return {
    criteriosAcionados,
    acertos,
    bandeiraVermelha,
    exigeConfirmacao: bandeiraVermelha,
    sujeito,
    injecaoDetectada: padroesInjecao.length > 0,
    padroesInjecao,
    regionalismos: traduzidos,
    truncado,
    textoNormalizado: texto,
    especificidade,
    gestacao,
    sinaisDeAlarme,
    arbovirose: { sintomas: sintomasArbo, alarmes: alarmesArbo, suspeita: suspeitaArbo },
  };
}

/**
 * B1 — avalia se um acerto deve ser descartado, e por quê.
 * A ordem importa: negação é a mais forte, depois passado, depois hipótese.
 */
function avaliarDescarte(
  texto: string,
  pos: number,
  sujeito: ResultadoCamada1['sujeito'],
): { motivo: MotivoDescarte; marcador: string } | null {
  const janela = palavrasAntes(texto, pos, JANELA_NEGACAO);
  const janelaTexto = janela.join(' ');

  // 1. Negação — "ela NÃO está com a boca torta, mas está tonta"
  for (const neg of MARCADORES_NEGACAO) {
    if (!contemPalavra(janelaTexto, neg)) continue;
    // "não melhorou", "não passa" NÃO negam o sintoma — negam a resolução dele.
    const cancelada = NEGACAO_CANCELADA_POR.some((c) => contemPalavra(janelaTexto, c));
    if (cancelada) continue;
    return { motivo: 'negacao', marcador: neg };
  }

  // 2. Tempo passado — "JÁ TIVE um AVC em 2019, agora estou com dor de garganta"
  //    Marcador de presente na mesma janela vence o de passado.
  //
  //    Fronteira de palavra é OBRIGATÓRIA: a auditoria pegou "APARECEU uma ferida" sendo
  //    descartada como HIPÓTESE, porque "parece" é substring de "apareceu". Marcador curto
  //    ("tive", "para", "parece") casado por includes cru descarta relatos legítimos —
  //    exatamente o tipo de erro silencioso que B1 existe para não cometer.
  const janelaLonga = palavrasAntes(texto, pos, 8).join(' ');
  const temPresente = MARCADORES_PRESENTE.some((m) => contemPalavra(janelaLonga, m));
  if (!temPresente) {
    for (const passado of MARCADORES_PASSADO) {
      if (contemPalavra(janelaLonga, passado)) return { motivo: 'passado', marcador: passado };
    }
  }

  // 3. Hipótese — "tenho MEDO DE estar tendo um infarto, mas é só azia"
  for (const hip of MARCADORES_HIPOTESE) {
    if (contemPalavra(janelaLonga, hip)) return { motivo: 'hipotese', marcador: hip };
  }

  // 4. Terceiro que não é o paciente — "meu vizinho desmaiou semana passada"
  if (sujeito === 'terceiro') {
    const trecho = texto.slice(Math.max(0, pos - 120), pos);
    for (const m of MARCADORES_TERCEIRO_NAO_PACIENTE) {
      if (trecho.includes(normalizar(m))) {
        return { motivo: 'terceiro_nao_paciente', marcador: m };
      }
    }
  }

  return null;
}

/**
 * A11 — extração determinística de gestação e idade gestacional.
 *
 * A idade gestacional é variável de ROTEAMENTO, não agravante. Detectá-la no texto é o que
 * permite que "grávida de 8 meses com febre" vá direto à maternidade de referência, em vez de
 * passar pela UPA — que na maioria dos casos não é porta obstétrica.
 *
 * Funciona sem IA e sem rede, portanto vale também em modo degradado e no PWA offline.
 */
function detectarGestacao(texto: string): ResultadoCamada1['gestacao'] {
  const marcadores = [
    'gravida', 'gestante', 'gestacao', 'esperando neném', 'esperando bebe',
    'to gravida', 'estou gravida', 'na gravidez', 'barriga de gravidez',
  ];
  const detectada = marcadores.some((m) => texto.includes(normalizar(m)));
  if (!detectada) return null;

  // "de 8 meses", "de 34 semanas", "8 meses de gravidez", "34 semanas"
  const meses = texto.match(/(\d{1,2})\s*(?:mes|meses)/);
  const semanas = texto.match(/(\d{1,2})\s*(?:semana|semanas)/);

  if (semanas?.[1]) return { detectada: true, semanas: Number(semanas[1]) };
  if (meses?.[1]) return { detectada: true, semanas: Number(meses[1]) * 4 };

  // Gestação sem idade informada: `null` faz o roteamento tratar como acima do limiar,
  // que é a decisão segura — a maternidade avalia, a UPA redirecionaria.
  return { detectada: true, semanas: null };
}

const NUM_EXTENSO: Readonly<Record<string, number>> = Object.freeze({
  um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6,
  sete: 7, oito: 8, nove: 9, dez: 10, onze: 11, doze: 12,
});

/**
 * A7 — idade de LACTENTE extraída do texto, em meses.
 *
 * A auditoria de 315 relatos expôs uma inversão perigosa: "bebê de dois meses com febre"
 * caía em LARANJA e "neném de quatro meses" ia a VERMELHO — o oposto do certo. A causa era
 * casar a faixa etária por FRASE ("bebê de 2 meses com febre") em vez de pela idade. Um bebê
 * de 2 meses com febre é bandeira vermelha (febre em menor de 3 meses); um de 4 meses é
 * laranja. A idade tem que decidir, não a sorte de a pessoa ter escrito "2" e não "dois".
 *
 * Só reconhece idade em MESES e só em contexto de bebê — adulto não se descreve em meses, e
 * "faz dois meses" (duração) ou "grávida de 3 meses" (idade gestacional) não são idade de
 * criança.
 */
function detectarIdadeInfantil(texto: string): { meses: number } | null {
  if (/gravid|gestant|gestacao|de barriga|de bucho/.test(texto)) return null;
  if (/recem\s*nascid|recemnascid/.test(texto)) return { meses: 0 };

  const temBebe =
    /\b(bebe|nenem|lactente|criancinha|crianca|meu filho|minha filha|o menino|a menina|meu fi|minha fia|meu filhinho|minha filhinha)\b/.test(
      texto,
    );
  if (!temBebe) return null;

  const numMatch = texto.match(/(\d{1,2})\s*(?:mes|meses)\b/);
  if (numMatch) return { meses: Number(numMatch[1]) };

  const palavras = texto.split(' ');
  for (let i = 0; i < palavras.length - 1; i++) {
    const prox = palavras[i + 1];
    if ((prox === 'mes' || prox === 'meses') && NUM_EXTENSO[palavras[i]!] != null) {
      return { meses: NUM_EXTENSO[palavras[i]!]! };
    }
  }
  return null;
}

function detectarSujeito(texto: string): ResultadoCamada1['sujeito'] {
  for (const m of MARCADORES_TERCEIRO_NAO_PACIENTE) {
    if (texto.includes(normalizar(m))) return 'terceiro';
  }
  for (const m of MARCADORES_TERCEIRO_PACIENTE) {
    if (texto.includes(normalizar(m))) return 'terceiro';
  }
  if (/\b(eu|estou|to|meu corpo|minha cabeca|sinto|tenho)\b/.test(texto)) return 'proprio';
  return 'indeterminado';
}

function palavrasAntes(texto: string, pos: number, n: number): string[] {
  const antes = texto.slice(0, pos).trim().split(/\s+/);
  return antes.slice(Math.max(0, antes.length - n));
}

function contemPalavra(texto: string, palavra: string): boolean {
  const p = normalizar(palavra);
  if (p.includes(' ')) return texto.includes(p);
  return new RegExp(`(^|\\s)${escapar(p)}(\\s|$)`).test(texto);
}

function escapar(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extrairContexto(texto: string, pos: number, len: number): string {
  const ini = Math.max(0, pos - 40);
  const fim = Math.min(texto.length, pos + len + 40);
  return (ini > 0 ? '…' : '') + texto.slice(ini, fim).trim() + (fim < texto.length ? '…' : '');
}

/**
 * B1 — aplica a resposta da pergunta de confirmação.
 * "sim mantém, NÃO REMOVE O DISPARO daquela varredura específica e registra o motivo."
 */
export function aplicarConfirmacao(
  resultado: ResultadoCamada1,
  confirmou: boolean,
): ResultadoCamada1 & { motivoRemocao?: string } {
  if (confirmou) return resultado;

  const vermelhosRemovidos = resultado.criteriosAcionados.filter((id) => {
    const c = CRITERIOS_POR_ID.get(id);
    return c?.nivel === 'vermelho' && c.irreversivel === true;
  });

  return {
    ...resultado,
    criteriosAcionados: resultado.criteriosAcionados.filter((id) => !vermelhosRemovidos.includes(id)),
    bandeiraVermelha: false,
    exigeConfirmacao: false,
    motivoRemocao:
      'B1 — a pessoa respondeu que o sinal NÃO está acontecendo agora com o paciente. ' +
      `Disparos removidos nesta varredura: ${vermelhosRemovidos.join(', ') || '(nenhum)'}.`,
  };
}

/** Critérios completos a partir dos ids acionados. */
export function criteriosDe(ids: string[]): Criterio[] {
  return ids.map((id) => CRITERIOS_POR_ID.get(id)).filter((c): c is Criterio => c != null);
}
