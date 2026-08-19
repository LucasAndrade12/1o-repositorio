/**
 * B9 (MÉDIO) — o motor determinístico embarcado no navegador.
 *
 * "a resiliência prevista cobre a falha da IA, não a falha da aplicação. Se o servidor cair ou
 *  a pessoa estiver sem dados móveis, não há sistema nenhum — e A VARREDURA OFFLINE DA CAMADA 1,
 *  QUE É O ARGUMENTO CENTRAL DE SEGURANÇA, NÃO CHEGA A RODAR."
 *
 * Este arquivo é compilado por esbuild para `publico/motor.js` e cacheado pelo service worker.
 * É o MESMO código que roda no servidor — não uma reimplementação. Foi por isso que o piloto
 * é um monorepo TypeScript: duas cópias das regras clínicas divergiriam, e a revisão condena
 * exatamente esse tipo de divergência silenciosa (B5, B7).
 *
 * "Isso transforma 'funciona apesar da internet ruim' de promessa em propriedade verificável."
 */

import {
  AVISO_DECISAO_AUTOMATIZADA,
  BLOCOS_AGRAVANTES,
  BLOCO_SEGURANCA,
  CRITERIOS,
  DESTINOS,
  GRADE_QUEIXAS,
  PERGUNTA_CONFIRMACAO_BANDEIRA,
  PERGUNTA_DESLOCAMENTO,
  PERGUNTA_PARA_QUEM,
  SAFETY_NETTING,
  UNIDADES,
  VERSAO_PROTOCOLO,
  AGRAVANTES,
  ROTEIROS_SENSIVEIS,
  rotear,
} from '@pra-onde-ir/protocolo';
import { classificar, triagemImediata, varrer } from '@pra-onde-ir/motor';
import type { EntradaTriagem } from '@pra-onde-ir/motor';

/**
 * Triagem completa SEM REDE. Usa camada 1 + camada 3; a camada 2 simplesmente não existe
 * offline, e o modo é registrado como degradado — exatamente como no servidor (B6).
 */
function triarOffline(entrada: EntradaTriagem) {
  const imediata = triagemImediata(entrada);
  const classificacao = classificar(
    imediata.camada1.criteriosAcionados,
    entrada.paciente,
    imediata.camada1.especificidade,
  );
  const roteamento = rotear({
    nivel: classificacao.nivel,
    tipoQueixa: classificacao.tipoQueixa,
    agora: entrada.agora ?? new Date(),
    ...(entrada.paciente.gestante ? { gestante: entrada.paciente.gestante } : {}),
    ...(entrada.paciente.semDeslocamento ? { semDeslocamento: true } : {}),
  });

  return {
    nivel: classificacao.nivel,
    roteamento,
    classificacao,
    camada1: imediata.camada1,
    curtoCircuito: imediata.curtoCircuito,
    aguardandoConfirmacao: imediata.aguardandoConfirmacao,
    perguntaConfirmacao: imediata.aguardandoConfirmacao ? PERGUNTA_CONFIRMACAO_BANDEIRA : null,
    blocoSegurancaFoiPrincipal: imediata.vagoAntesDoBloco,
    naoReconhecido: classificacao.naoReconhecido,
    explicacao: classificacao.explicacao,
    safetyNetting: classificacao.safetyNetting,
    primeirosMinutos: classificacao.primeirosMinutos,
    modo: 'degradado' as const,
    offline: true,
    avisoLGPD: AVISO_DECISAO_AUTOMATIZADA,
    versoes: {
      protocolo: VERSAO_PROTOCOLO,
      prompt: 'n/a (offline)',
      modelo: 'n/a (offline)',
      esquema: 'n/a (offline)',
      modo: 'degradado' as const,
      fase: 'offline',
      timestamp: new Date().toISOString(),
    },
  };
}

const api = {
  versao: VERSAO_PROTOCOLO,
  varrer,
  triagemImediata,
  triarOffline,
  dados: {
    criterios: CRITERIOS,
    agravantes: AGRAVANTES,
    blocosAgravantes: BLOCOS_AGRAVANTES,
    blocoSeguranca: BLOCO_SEGURANCA,
    gradeQueixas: GRADE_QUEIXAS,
    destinos: DESTINOS,
    unidades: UNIDADES,
    safetyNetting: SAFETY_NETTING,
    roteirosSensiveis: ROTEIROS_SENSIVEIS,
    perguntaParaQuem: PERGUNTA_PARA_QUEM,
    perguntaDeslocamento: PERGUNTA_DESLOCAMENTO,
    perguntaConfirmacao: PERGUNTA_CONFIRMACAO_BANDEIRA,
    avisoLGPD: AVISO_DECISAO_AUTOMATIZADA,
    telefones: { samu: '192', cvv: '188', policia: '190', mulher: '180', bombeiros: '193' },
  },
};

declare global {
  interface Window {
    Motor: typeof api;
  }
}

window.Motor = api;
