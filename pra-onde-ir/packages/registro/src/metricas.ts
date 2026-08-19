/**
 * E1 + E3 + E5 — métricas do piloto.
 *
 * E1 (ALTO): "a informação decisiva se perde exatamente onde importa. Reclassificar PARA CIMA
 * significa que o sistema subestimou risco — é falha de segurança. Reclassificar PARA BAIXO
 * significa que sobrecarregou a rede — é falha de eficiência. São problemas de naturezas
 * completamente diferentes, com consequências diferentes, e o botão único os funde num número
 * só. Além disso, uma taxa agregada de concordância é fácil de contestar: 85% pode significar
 * segurança excelente ou uma sub-triagem inaceitável escondida na média."
 *
 * A substituição do botão duplo pela pergunta "qual nível você atribuiu?" custa o mesmo clique
 * e produz a MATRIZ DE CONFUSÃO COMPLETA. Tudo abaixo deriva dela.
 */

import { ORDEM_NIVEIS, gravidade, type Nivel } from '@pra-onde-ir/protocolo';
import type { RegistroAnalitico } from './registro.js';

export interface MatrizConfusao {
  /** matriz[sistema][equipe] = contagem */
  matriz: Record<Nivel, Record<Nivel, number>>;
  total: number;
  concordancia: number;
  /** Falha de SEGURANÇA — prevalece sobre todos os outros indicadores. */
  subTriagem: number;
  /** Falha de EFICIÊNCIA — mede o custo do sistema para a rede. */
  sobreTriagem: number;
  /** Casos individuais de sub-triagem: cada um exige análise. */
  casosSubTriagem: { id: string; sistema: Nivel; equipe: Nivel }[];
  sensibilidadeVermelho: number;
  sensibilidadeLaranja: number;
}

export function matrizDeConfusao(registros: readonly RegistroAnalitico[]): MatrizConfusao {
  const matriz = Object.fromEntries(
    ORDEM_NIVEIS.map((a) => [a, Object.fromEntries(ORDEM_NIVEIS.map((b) => [b, 0]))]),
  ) as Record<Nivel, Record<Nivel, number>>;

  const casos: MatrizConfusao['casosSubTriagem'] = [];
  let total = 0;
  let acertos = 0;
  let sub = 0;
  let sobre = 0;

  for (const r of registros) {
    const equipe = r.nivelAtribuidoPelaEquipe;
    if (!equipe) continue;
    total++;
    matriz[r.nivel]![equipe]!++;
    const d = gravidade(r.nivel) - gravidade(equipe);
    if (d === 0) acertos++;
    else if (d < 0) {
      // O sistema classificou ABAIXO do que a equipe atribuiu: subestimou risco.
      sub++;
      casos.push({ id: r.id, sistema: r.nivel, equipe });
    } else sobre++;
  }

  return {
    matriz,
    total,
    concordancia: total ? acertos / total : 0,
    subTriagem: total ? sub / total : 0,
    sobreTriagem: total ? sobre / total : 0,
    casosSubTriagem: casos,
    sensibilidadeVermelho: sensibilidade(registros, 'vermelho'),
    sensibilidadeLaranja: sensibilidade(registros, 'laranja'),
  };
}

/** Dos casos que a equipe classificou como N, quantos o sistema pegou em N ou acima? */
function sensibilidade(registros: readonly RegistroAnalitico[], nivel: Nivel): number {
  const alvo = registros.filter((r) => r.nivelAtribuidoPelaEquipe === nivel);
  if (alvo.length === 0) return 1;
  const pegos = alvo.filter((r) => gravidade(r.nivel) >= gravidade(nivel)).length;
  return pegos / alvo.length;
}

/** E3 — painel de indicadores mínimo, com os sinais de alarme da revisão. */
export interface Indicador {
  id: string;
  rotulo: string;
  valor: number;
  formato: 'percentual' | 'numero' | 'minutos';
  porQueExiste: string;
  sinalDeAlarme: string;
  emAlarme: boolean;
}

export interface PainelIndicadores {
  indicadores: Indicador[];
  matriz: MatrizConfusao;
  /** B6 — concordância ESTRATIFICADA POR MODO. Sem isso o número global mistura dois sistemas. */
  porModo: Record<string, { n: number; concordancia: number; subTriagem: number }>;
  /** E5 — estratificação por equidade. */
  porFaixaEtaria: Record<string, { n: number; concordancia: number; subTriagem: number }>;
  porComprimentoRelato: Record<string, { n: number; concordancia: number; subTriagem: number }>;
  porVersaoProtocolo: Record<string, { n: number; concordancia: number }>;
  /** Distribuição por nível — revela se o sistema realmente separa casos. */
  distribuicao: Record<Nivel, number>;
}

/** Teto de sobre-triagem acordado. A ser revisto com a equipe após a fase sombra. */
export const TETO_SOBRE_TRIAGEM = 0.25;
export const META_NAO_RECONHECIMENTO = 0.15;

export function montarPainel(registros: readonly RegistroAnalitico[]): PainelIndicadores {
  const matriz = matrizDeConfusao(registros);
  const n = registros.length || 1;

  const naoReconhecidos = registros.filter((r) => r.naoReconhecido).length / n;
  const degradado = registros.filter((r) => r.modo === 'degradado').length / n;
  const passesComDesfecho = registros.filter((r) => r.desfechoNoDestino).length;
  const passesEmitidos = registros.filter((r) => r.nivel !== 'azul').length || 1;

  const distribuicao = Object.fromEntries(ORDEM_NIVEIS.map((x) => [x, 0])) as Record<Nivel, number>;
  for (const r of registros) distribuicao[r.nivel]++;
  const concentracaoAmarelo = distribuicao.amarelo / n;

  const indicadores: Indicador[] = [
    {
      id: 'sub_triagem',
      rotulo: 'Taxa de sub-triagem',
      valor: matriz.subTriagem,
      formato: 'percentual',
      porQueExiste: 'Indicador de segurança. Prevalece sobre todos os outros.',
      sinalDeAlarme: 'Qualquer caso vermelho ou laranja classificado abaixo exige análise individual.',
      emAlarme: matriz.casosSubTriagem.length > 0,
    },
    {
      id: 'sobre_triagem',
      rotulo: 'Taxa de sobre-triagem',
      valor: matriz.sobreTriagem,
      formato: 'percentual',
      porQueExiste: 'Mede o custo do sistema para a rede.',
      sinalDeAlarme: `Acima do teto acordado (${(TETO_SOBRE_TRIAGEM * 100).toFixed(0)}%).`,
      emAlarme: matriz.sobreTriagem > TETO_SOBRE_TRIAGEM,
    },
    {
      id: 'distribuicao',
      rotulo: 'Concentração em AMARELO',
      valor: concentracaoAmarelo,
      formato: 'percentual',
      porQueExiste: 'Revela se o sistema realmente separa casos.',
      sinalDeAlarme: 'Concentração excessiva em AMARELO indica motor pouco discriminativo.',
      emAlarme: concentracaoAmarelo > 0.5,
    },
    {
      id: 'nao_reconhecimento',
      rotulo: 'Taxa de não reconhecimento',
      valor: naoReconhecidos,
      formato: 'percentual',
      porQueExiste: 'Mede a cobertura do protocolo. Cada caso é uma lacuna que a curadoria pode fechar.',
      sinalDeAlarme: `Estabilidade acima de ${(META_NAO_RECONHECIMENTO * 100).toFixed(0)}% após três meses.`,
      emAlarme: naoReconhecidos > META_NAO_RECONHECIMENTO,
    },
    {
      id: 'modo_degradado',
      rotulo: 'Taxa de modo degradado',
      valor: degradado,
      formato: 'percentual',
      porQueExiste:
        'Mede conectividade e a confiabilidade dos demais números. É também argumento objetivo ' +
        'junto à Secretaria sobre a conectividade da unidade.',
      sinalDeAlarme: 'Crescimento sustentado.',
      emAlarme: degradado > 0.35,
    },
    {
      id: 'passes',
      rotulo: 'Passes apresentados / emitidos',
      valor: passesComDesfecho / passesEmitidos,
      formato: 'percentual',
      porQueExiste: 'Mede se o encaminhamento chegou ao destino.',
      sinalDeAlarme: 'Diferença grande — o passe não está sendo usado.',
      emAlarme: passesComDesfecho / passesEmitidos < 0.5,
    },
    {
      id: 'sensibilidade_vermelho',
      rotulo: 'Sensibilidade para VERMELHO',
      valor: matriz.sensibilidadeVermelho,
      formato: 'percentual',
      porQueExiste: 'Dos casos que a equipe considerou emergência, quantos o sistema pegou.',
      sinalDeAlarme: 'Qualquer valor abaixo de 100% exige análise caso a caso.',
      emAlarme: matriz.sensibilidadeVermelho < 1,
    },
  ];

  return {
    indicadores,
    matriz,
    porModo: estratificar(registros, (r) => r.modo),
    porFaixaEtaria: estratificar(registros, (r) => r.faixaEtaria ?? 'não informado'),
    porComprimentoRelato: estratificar(registros, (r) => r.comprimentoRelato),
    porVersaoProtocolo: Object.fromEntries(
      Object.entries(estratificar(registros, (r) => r.versaoProtocolo)).map(([k, v]) => [
        k,
        { n: v.n, concordancia: v.concordancia },
      ]),
    ),
    distribuicao,
  };
}

function estratificar(
  registros: readonly RegistroAnalitico[],
  chave: (r: RegistroAnalitico) => string,
): Record<string, { n: number; concordancia: number; subTriagem: number }> {
  const grupos = new Map<string, RegistroAnalitico[]>();
  for (const r of registros) {
    const k = chave(r);
    grupos.set(k, [...(grupos.get(k) ?? []), r]);
  }
  const saida: Record<string, { n: number; concordancia: number; subTriagem: number }> = {};
  for (const [k, lista] of grupos) {
    const m = matrizDeConfusao(lista);
    saida[k] = { n: lista.length, concordancia: m.concordancia, subTriagem: m.subTriagem };
  }
  return saida;
}

/**
 * E6 — critério de encerramento do piloto, definido ANTES de começar.
 *
 * "Um piloto sem critério de parada acordado previamente tende a ser julgado por impressão,
 *  e a impressão será formada pelo caso mais barulhento, não pelo mais representativo."
 */
export const CRITERIOS_DE_ENCERRAMENTO = {
  sustentaExpansao: {
    descricao: 'Resultado que sustenta a expansão para outras unidades',
    condicoes: [
      'Sub-triagem em vermelho e laranja igual a zero, com todos os casos analisados individualmente',
      `Sobre-triagem abaixo de ${(TETO_SOBRE_TRIAGEM * 100).toFixed(0)}%`,
      `Não reconhecimento abaixo de ${(META_NAO_RECONHECIMENTO * 100).toFixed(0)}% ao fim do terceiro mês`,
      'Concordância estável entre versões do protocolo',
      'Aceitação da equipe registrada em ata',
    ],
  },
  exigeCorrecao: {
    descricao: 'Resultado que exige correção antes de continuar',
    condicoes: [
      'Qualquer caso de sub-triagem em vermelho sem causa identificada e corrigida',
      'Sobre-triagem acima do teto por duas semanas consecutivas',
      'Modo degradado acima de 35% de forma sustentada',
      'Concentração em AMARELO acima de 50%',
    ],
  },
  encerraProjeto: {
    descricao: 'Resultado que encerra o projeto',
    condicoes: [
      'Evento adverso grave atribuível à orientação do sistema',
      'Sub-triagem persistente em vermelho após duas rodadas de correção',
      'Recusa formal da equipe ou da Secretaria em prosseguir',
      'Impedimento regulatório não sanável (ver enquadramento sanitário, C5)',
    ],
  },
} as const;
