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
  const janelaLonga = palavrasAntes(texto, pos, 8).join(' ');
  const temPresente = MARCADORES_PRESENTE.some((m) => janelaLonga.includes(normalizar(m)));
  if (!temPresente) {
    for (const passado of MARCADORES_PASSADO) {
      const p = normalizar(passado);
      if (janelaLonga.includes(p)) return { motivo: 'passado', marcador: passado };
    }
  }

  // 3. Hipótese — "tenho MEDO DE estar tendo um infarto, mas é só azia"
  for (const hip of MARCADORES_HIPOTESE) {
    const h = normalizar(hip);
    if (janelaLonga.includes(h)) return { motivo: 'hipotese', marcador: hip };
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
