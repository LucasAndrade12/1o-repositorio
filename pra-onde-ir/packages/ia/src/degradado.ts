/**
 * B6 (ALTO) — modo degradado.
 *
 * "falha na chamada de IA → fallback para busca por palavras-chave sobre a mesma lista de
 *  critérios. A rede de segurança está correta, mas O MODO EM QUE A TRIAGEM RODOU NÃO É
 *  REGISTRADO NEM EXIBIDO. Duas consequências. Para a equipe: um resumo pobre e um conjunto de
 *  critérios rasos chegam ao painel sem que ninguém saiba por quê. Para o piloto: se 35% das
 *  triagens rodarem em modo degradado — plausível, dado que a própria unidade relata internet
 *  instável — a taxa de concordância global mistura dois sistemas com desempenhos muito
 *  diferentes, e o número perde significado."
 *
 * Aqui o modo é sempre `degradado`, é gravado em todo registro (B7), exibido como selo no
 * painel e no passe, e a concordância é reportada ESTRATIFICADA POR MODO. A taxa de degradação
 * vira, ela própria, um indicador operacional — e um argumento objetivo junto à Secretaria
 * sobre a conectividade da unidade.
 *
 * Nota importante: o modo degradado NÃO é uma versão pior por acidente. Como a camada 1 já é
 * determinística e roda offline, o degradado preserva integralmente a detecção de bandeiras
 * vermelhas. O que se perde é o resumo em linguagem natural e a captação de sinais que só
 * aparecem em fraseado incomum.
 */

import type { Camada2Port, SaidaCamada2 } from '@pra-onde-ir/motor';
import { varrer } from '@pra-onde-ir/motor';
import { AGRAVANTES, normalizar } from '@pra-onde-ir/protocolo';

import { VERSAO_ESQUEMA } from './esquema.js';
import { VERSAO_PROMPT } from './prompt.js';

export const VERSAO_MODELO_DEGRADADO = 'degradado/busca-textual';

export const camada2Degradada: Camada2Port = async (relato) => {
  const r = varrer(relato);

  // Extração de agravantes por menção espontânea, sobre a mesma lista.
  const texto = normalizar(relato);
  const agravantesMencionados = AGRAVANTES.filter((a) =>
    a.comoAPessoaDescreve.some((termo) => texto.includes(normalizar(termo))),
  ).map((a) => a.id);

  const saida: SaidaCamada2 = {
    criterios: r.criteriosAcionados,
    resumo: resumoSemIA(relato, r.criteriosAcionados.length),
    perguntaSugerida: null,
    agravantesMencionados,
    modo: 'degradado',
    versaoPrompt: VERSAO_PROMPT,
    versaoModelo: VERSAO_MODELO_DEGRADADO,
    versaoEsquema: VERSAO_ESQUEMA,
  };
  return saida;
};

/**
 * C2 — mesmo sem IA, o resumo não pode reproduzir detalhes identificadores.
 * Aqui a garantia é estrutural: o texto original não é copiado para a base analítica.
 */
function resumoSemIA(relato: string, quantos: number): string {
  const tamanho = relato.trim().length;
  const faixa = tamanho < 40 ? 'curto' : tamanho < 160 ? 'médio' : 'longo';
  return (
    `[modo degradado — sem conexão com o serviço de IA] Relato ${faixa}, ` +
    `${quantos} critério(s) reconhecido(s) pela varredura textual. ` +
    'O texto integral está disponível na base operacional para a equipe do acolhimento.'
  );
}
