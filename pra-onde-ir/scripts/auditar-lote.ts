/**
 * Auditoria do lote de 285 relatos: roda cada caso e imprime a RESPOSTA, não só a estatística.
 * Modo degradado (sem chave de API) — o pior caso, e o que qualquer um consegue reproduzir.
 */

import { ORDEM_NIVEIS, type Nivel } from '@pra-onde-ir/protocolo';
import { triar, type DadosPaciente } from '@pra-onde-ir/motor';
import { camada2Degradada } from '@pra-onde-ir/ia';
import { LOTE, type Caso } from '../testes/lote-sintetico-285.js';

interface Linha {
  caso: Caso;
  nivel: Nivel;
  destino: string;
  criterio: string;
  naoReconhecido: boolean;
  bandeira: boolean;
}

const AGORA = new Date('2026-08-05T10:30:00-03:00'); // quarta-feira, UBS aberta

async function rodar(caso: Caso): Promise<Linha> {
  const paciente: DadosPaciente = {
    agravantes: caso.agravantes ?? [],
    ...(caso.idade != null ? { idade: caso.idade } : {}),
    ...(caso.inicioMenos24h ? { inicioMenos24h: true } : {}),
  };
  const t = await triar(
    {
      relato: caso.relato,
      paraQuem: caso.paraQuem ?? 'proprio',
      paciente,
      // Bandeira vermelha confirmada: simula a pessoa respondendo "sim, é agora, é comigo".
      confirmouBandeira: true,
      agora: AGORA,
    },
    camada2Degradada,
  );
  const lider = t.classificacao.criteriosAplicados[0];
  return {
    caso,
    nivel: t.nivel,
    destino: t.roteamento.destino,
    criterio: lider?.id ?? '—',
    naoReconhecido: t.classificacao.naoReconhecido,
    bandeira: t.camada1.bandeiraVermelha,
  };
}

const COR: Record<Nivel, string> = {
  vermelho: '\x1b[41;97m VM \x1b[0m',
  laranja: '\x1b[43;30m LR \x1b[0m',
  amarelo: '\x1b[103;30m AM \x1b[0m',
  verde: '\x1b[42;30m VD \x1b[0m',
  azul: '\x1b[44;97m AZ \x1b[0m',
};

const linhas: Linha[] = [];
for (const caso of LOTE) linhas.push(await rodar(caso));

// ── Listagem completa, agrupada pelo grupo do lote ────────────────────────
const grupos = [...new Set(LOTE.map((c) => c.grupo))];
for (const g of grupos) {
  const doGrupo = linhas.filter((l) => l.caso.grupo === g);
  console.log(`\n\x1b[1m── ${g.toUpperCase()} (${doGrupo.length}) ${'─'.repeat(Math.max(0, 60 - g.length))}\x1b[0m`);
  for (const l of doGrupo) {
    const alerta = l.naoReconhecido ? ' \x1b[35m◆ não reconhecido\x1b[0m' : '';
    console.log(
      `  ${COR[l.nivel]} ${l.caso.relato.slice(0, 54).padEnd(54)} ` +
      `\x1b[2m${l.destino.slice(0, 26).padEnd(26)}\x1b[0m ` +
      `\x1b[36m${l.criterio}\x1b[0m${alerta}`,
    );
  }
}

// ── Agregados ─────────────────────────────────────────────────────────────
const n = linhas.length;
const dist = Object.fromEntries(ORDEM_NIVEIS.map((x) => [x, 0])) as Record<Nivel, number>;
for (const l of linhas) dist[l.nivel]++;
const naoRec = linhas.filter((l) => l.naoReconhecido);
const urg = (dist.vermelho + dist.laranja) / n;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`.padStart(6);

console.log(`\n\n╭${'─'.repeat(76)}╮`);
console.log(`│  AGREGADO — ${n} relatos, modo degradado (sem IA)${' '.repeat(30)}│`);
console.log(`╰${'─'.repeat(76)}╯\n`);

for (const nivel of [...ORDEM_NIVEIS].reverse()) {
  const v = dist[nivel];
  const larg = Math.round((v / n) * 46);
  console.log(
    `  ${COR[nivel]} ${nivel.padEnd(9)} ${'█'.repeat(larg)}${'·'.repeat(46 - larg)} ` +
    `${String(v).padStart(3)}  ${pct(v / n)}`,
  );
}

console.log(`
  urgência (vermelho + laranja) ... ${pct(urg)}  (${dist.vermelho + dist.laranja} de ${n})
  não reconhecidos ................ ${pct(naoRec.length / n)}  (${naoRec.length} de ${n}) — meta B11: <15%
`);

// ── Destinos ──────────────────────────────────────────────────────────────
const porDestino = new Map<string, number>();
for (const l of linhas) porDestino.set(l.destino, (porDestino.get(l.destino) ?? 0) + 1);
console.log('  ── Para onde as pessoas foram mandadas ────────────────────────────');
for (const [d, v] of [...porDestino.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`     ${String(v).padStart(3)}  ${pct(v / n)}  ${d}`);
}

// ── Fila de curadoria (B11) ───────────────────────────────────────────────
console.log(`\n  ── FILA DE CURADORIA: ${naoRec.length} relatos sem critério ────────────────────`);
for (const l of naoRec) {
  console.log(`     · [${l.caso.grupo}] "${l.caso.relato}"`);
}

// ── Critérios mais acionados ──────────────────────────────────────────────
const porCriterio = new Map<string, number>();
for (const l of linhas) if (!l.naoReconhecido) porCriterio.set(l.criterio, (porCriterio.get(l.criterio) ?? 0) + 1);
console.log(`\n  ── Critérios líderes mais frequentes ──────────────────────────────`);
for (const [k, v] of [...porCriterio.entries()].sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`     ${String(v).padStart(3)}  ${k}`);
}
