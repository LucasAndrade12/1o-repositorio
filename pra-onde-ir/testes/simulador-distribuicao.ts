/**
 * A "recomendação de sequência" do sumário executivo.
 *
 * "Antes de qualquer refatoração ampla, faça duas coisas baratas que reduzem mais risco por
 *  hora investida do que todo o resto: (1) SIMULAR A DISTRIBUIÇÃO DE NÍVEIS DO MOTOR ATUAL
 *  SOBRE 200–300 RELATOS HISTÓRICOS DO ACOLHIMENTO, para medir a sobre-triagem ANTES de ligar
 *  o sistema; e (2) montar o banco de vinhetas e transformá-lo em teste automatizado. Sem essas
 *  duas, qualquer alteração no protocolo é feita às cegas."
 *
 * (2) está em testes/vinhetas.test.ts. Este arquivo é (1).
 *
 * Compara o protocolo v2 com a REGRA v1 (agravante global de +1 nível para qualquer critério,
 * piso universal de 24 horas) sobre o mesmo lote, para medir quanta sobre-triagem a regra
 * original produzia.
 *
 *   npm run distribuicao
 *   npm run distribuicao -- caminho/para/relatos.txt   (um relato por linha)
 */

import { readFileSync } from 'node:fs';
import { ORDEM_NIVEIS, escalonar, gravidade, type Nivel } from '@pra-onde-ir/protocolo';
import { triar, type DadosPaciente } from '@pra-onde-ir/motor';
import { camada2Degradada } from '@pra-onde-ir/ia';

/**
 * Lote sintético representativo da demanda de uma UBS.
 * Substitua por 200–300 relatos históricos reais do acolhimento antes de ligar o sistema.
 */
const LOTE_SINTETICO: { relato: string; paciente?: Partial<DadosPaciente> }[] = [
  // Demanda de alta frequência da Atenção Básica
  { relato: 'tô com dor de garganta', paciente: { idade: 34 } },
  { relato: 'acordei com o nariz escorrendo e espirrando', paciente: { inicioMenos24h: true } },
  { relato: 'febre desde ontem', paciente: { idade: 41, inicioMenos24h: true } },
  { relato: 'dor nas costas faz uma semana', paciente: { idade: 52 } },
  { relato: 'ardência pra urinar', paciente: { idade: 29 } },
  { relato: 'diarreia desde ontem', paciente: { idade: 38, inicioMenos24h: true } },
  { relato: 'dor de cabeça', paciente: { idade: 45 } },
  { relato: 'preciso renovar a receita da pressão', paciente: { idade: 68, agravantes: ['hipertensao'] } },
  { relato: 'quero marcar consulta de rotina', paciente: { idade: 60, agravantes: ['diabetes'] } },
  { relato: 'preciso tomar vacina', paciente: { idade: 33 } },
  // ── O caso que a revisão usa como exemplo do problema de A1 ──
  { relato: 'febre desde ontem', paciente: { idade: 63, agravantes: ['hipertensao'], inicioMenos24h: true } },
  { relato: 'tô com dor de garganta', paciente: { idade: 66, agravantes: ['hipertensao', 'diabetes'] } },
  { relato: 'dor nas costas', paciente: { idade: 71, agravantes: ['hipertensao'] } },
  { relato: 'diarreia', paciente: { idade: 64, agravantes: ['diabetes'] } },
  { relato: 'dor de cabeça', paciente: { idade: 62, agravantes: ['hipertensao'] } },
  { relato: 'ardência pra urinar', paciente: { idade: 69, agravantes: ['diabetes'] } },
  { relato: 'meu pai de 70 anos tá com febre de 38 desde hoje de manhã', paciente: { idade: 70, inicioMenos24h: true } },
  { relato: 'minha pressão deu 18 por 11, mas não tô sentindo nada', paciente: { idade: 58, agravantes: ['hipertensao'] } },
  { relato: 'pressão alta', paciente: { idade: 74, agravantes: ['hipertensao'] } },
  { relato: 'ralei o joelho', paciente: { idade: 12, inicioMenos24h: true } },
  // Urgências verdadeiras
  { relato: 'tenho uma ferida no pé com pus', paciente: { idade: 67, agravantes: ['diabetes'] } },
  { relato: 'crise de asma, usei a bombinha e não melhorou', paciente: { agravantes: ['asma_dpoc'] } },
  { relato: 'dor forte na barriga e vomitando', paciente: { idade: 44 } },
  { relato: 'dor de dente e o rosto inchou muito', paciente: { idade: 31 } },
  { relato: 'febre há três dias e dor no corpo', paciente: { idade: 27 } },
  { relato: 'não consigo urinar desde ontem', paciente: { idade: 73 } },
  // Emergências
  { relato: 'meu marido tá com o braço caindo e a fala embolada', paciente: { idade: 68 } },
  { relato: 'dor no peito e suando frio', paciente: { idade: 57, agravantes: ['hipertensao'] } },
  { relato: 'minhas fezes tão pretas feito borra de café', paciente: { idade: 61 } },
  { relato: 'minha avó de 80 tá muito confusa, com febre e respirando rápido', paciente: { idade: 80 } },
  // Relatos vagos — a população que B4 endereça
  { relato: 'tô passando mal' },
  { relato: 'não tô bom', paciente: { idade: 72 } },
  { relato: 'tô ruim, sem forças', paciente: { idade: 79 } },
  { relato: 'minha barriga tá esquisita' },
  { relato: 'me sinto estranha hoje', paciente: { idade: 55 } },
  // Saúde mental e violência
  { relato: 'tô muito ansiosa, pensando em sumir, mas não fiz nada' },
  { relato: 'não consigo dormir e tô muito ansioso' },
  { relato: 'parei de beber faz dois dias e tô tremendo muito' },
];

async function simular() {
  const arquivo = process.argv[2];
  const lote: typeof LOTE_SINTETICO = arquivo
    ? readFileSync(arquivo, 'utf8')
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean)
        .map((relato) => ({ relato }))
    : LOTE_SINTETICO;

  const v2: Record<Nivel, number> = zerado();
  const v1: Record<Nivel, number> = zerado();
  const divergencias: { relato: string; v1: Nivel; v2: Nivel }[] = [];
  let naoReconhecidos = 0;

  for (const caso of lote) {
    const paciente: DadosPaciente = { agravantes: [], ...(caso.paciente ?? {}) };
    const t = await triar({ relato: caso.relato, paraQuem: 'proprio', paciente }, camada2Degradada);

    v2[t.nivel]++;
    if (t.classificacao.naoReconhecido) naoReconhecidos++;

    // Reconstrução da REGRA v1 sobre o mesmo resultado de camada 1:
    // qualquer agravante presente sobe um nível, para qualquer critério;
    // e o piso de 24h é universal, sem lista de exceções.
    let nivelV1: Nivel = t.classificacao.naoReconhecido
      ? 'amarelo'
      : (t.classificacao.criteriosAplicados.reduce<Nivel>(
          (acc, c) => (gravidade(c.nivel) > gravidade(acc) ? c.nivel : acc), 'azul'));

    const temAgravanteV1 =
      paciente.agravantes.length > 0 || (paciente.idade != null && paciente.idade >= 60);
    if (temAgravanteV1 && nivelV1 !== 'vermelho') nivelV1 = escalonar(nivelV1, 1);
    if (paciente.inicioMenos24h && gravidade(nivelV1) < gravidade('amarelo')) nivelV1 = 'amarelo';

    v1[nivelV1]++;
    if (nivelV1 !== t.nivel) divergencias.push({ relato: caso.relato, v1: nivelV1, v2: t.nivel });
  }

  const n = lote.length;
  const urg = (d: Record<Nivel, number>) => (d.vermelho + d.laranja) / n;

  console.log(`
╭──────────────────────────────────────────────────────────────────────────────╮
│  Simulação de distribuição de níveis — ${String(n).padStart(3)} relatos                          │
│  A recomendação de sequência do sumário executivo da revisão                 │
╰──────────────────────────────────────────────────────────────────────────────╯
`);

  console.log('  Nível        v1 (agravante global)      v2 (matriz condicionada)');
  console.log('  ' + '─'.repeat(72));
  for (const nivel of [...ORDEM_NIVEIS].reverse()) {
    const a = v1[nivel], b = v2[nivel];
    console.log(
      `  ${nivel.padEnd(11)} ${barra(a, n)} ${String(a).padStart(3)}   ` +
      `${barra(b, n)} ${String(b).padStart(3)}   ${delta(b - a)}`,
    );
  }

  console.log(`
  ── Encaminhamentos à urgência (vermelho + laranja) ─────────────────────────
     protocolo v1 .......... ${pct(urg(v1))}  (${v1.vermelho + v1.laranja} de ${n})
     protocolo v2 .......... ${pct(urg(v2))}  (${v2.vermelho + v2.laranja} de ${n})
     redução ............... ${pct(urg(v1) - urg(v2))} do lote

  ── Outros indicadores ──────────────────────────────────────────────────────
     não reconhecidos ...... ${pct(naoReconhecidos / n)}  (meta: <15% no 3º mês, B11)
     divergências v1 vs v2 . ${divergencias.length} caso(s)

  ── Casos em que a regra v1 empurrava para cima ─────────────────────────────`);

  for (const d of divergencias.slice(0, 12)) {
    const seta = gravidade(d.v1) > gravidade(d.v2) ? '↓' : '↑';
    console.log(`     ${seta} ${d.v1.padEnd(8)} → ${d.v2.padEnd(8)}  "${d.relato.slice(0, 46)}"`);
  }
  if (divergencias.length > 12) console.log(`     … e mais ${divergencias.length - 12}`);

  console.log(`
  ── Como usar isto de verdade ───────────────────────────────────────────────
     O lote acima é SINTÉTICO. Antes de ligar o sistema, rode sobre 200–300
     relatos históricos do acolhimento:

         npm run distribuicao -- relatos-historicos.txt

     Se a fatia de urgência do v2 ainda parecer alta para a realidade da
     unidade, a matriz de agravantes (packages/protocolo/src/agravantes.ts) é
     o lugar de ajustar — com a enfermeira e a retaguarda, e rodando as
     vinhetas depois de cada mudança.
`);
}

function zerado(): Record<Nivel, number> {
  return Object.fromEntries(ORDEM_NIVEIS.map((n) => [n, 0])) as Record<Nivel, number>;
}

function barra(v: number, total: number): string {
  const largura = Math.round((v / Math.max(1, total)) * 22);
  return ('█'.repeat(largura) + '·'.repeat(22 - largura)).slice(0, 22);
}

function pct(v: number): string {
  return `${(v * 100).toFixed(1)}%`.padStart(6);
}

function delta(d: number): string {
  if (d === 0) return '';
  return d > 0 ? `+${d}` : `${d}`;
}

await simular();
