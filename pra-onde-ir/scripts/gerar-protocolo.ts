/**
 * Gera o documento do protocolo A PARTIR DO CÓDIGO EM EXECUÇÃO.
 *
 * A revisão elogia esta decisão do projeto original: "o PDF é regenerado a partir do endpoint
 * para nunca ficar dessincronizado do código". Ela é preservada — e complementada com o que
 * faltava (B7): o documento agora também carrega o histórico de versões e o estado da
 * assinatura clínica, porque "isso garante a sincronia do DOCUMENTO, não a rastreabilidade do
 * HISTÓRICO".
 *
 *   npm run protocolo            → imprime em Markdown
 *   npm run protocolo -- arquivo.md
 */

import { writeFileSync } from 'node:fs';

import {
  AGRAVANTES,
  AVISO_DECISAO_AUTOMATIZADA,
  BLOCO_SEGURANCA,
  CRITERIOS,
  DESTINOS,
  HISTORICO_VERSOES,
  MODULO_ARBOVIROSE,
  ORDEM_NIVEIS,
  PROTOCOLO_META,
  REGRA_IDADE,
  ROTEIROS_SENSIVEIS,
  SAFETY_NETTING,
  UNIDADES,
  VERSAO_PROTOCOLO,
  criteriosPendentesDeAssinatura,
} from '@pra-onde-ir/protocolo';
import { MODELO, VERSAO_MODELO } from '@pra-onde-ir/ia';

const l: string[] = [];
const w = (s = '') => l.push(s);

w(`# Protocolo de classificação de risco — Pra Onde Ir`);
w();
w(`**Versão ${VERSAO_PROTOCOLO}** · gerado em ${new Date().toISOString().slice(0, 10)} a partir do código em execução`);
w();
w(`| | |`);
w(`|---|---|`);
w(`| Unidade piloto | ${PROTOCOLO_META.unidadePiloto} |`);
w(`| Baseado em | ${PROTOCOLO_META.baseadoEm} |`);
w(`| Revisão que originou esta versão | ${PROTOCOLO_META.revisao} |`);
w(`| Responsável clínico | ${PROTOCOLO_META.responsavelClinico ?? '**A NOMEAR**'} |`);
w(`| Assinado em | ${PROTOCOLO_META.assinadoEm ?? '**PENDENTE**'} |`);
w(`| Camada 2 (IA) | \`${VERSAO_MODELO}\` |`);
w();

const pendentes = criteriosPendentesDeAssinatura();
w(`> ⚠️ **${PROTOCOLO_META.aviso}**`);
w(`>`);
w(`> **${pendentes.length} de ${CRITERIOS.length} critérios aguardam assinatura** da enfermeira do`);
w(`> acolhimento e da retaguarda médica.`);
w();

w(`## Aviso permanente exibido ao usuário`);
w();
w(`> ${AVISO_DECISAO_AUTOMATIZADA}`);
w();

// ── Histórico ────────────────────────────────────────────────────────────
w(`## Histórico de versões`);
w();
for (const h of HISTORICO_VERSOES) {
  w(`### v${h.versao} — ${h.data}`);
  w();
  w(`*${h.responsavel}*`);
  w();
  w(h.resumo);
  w();
}

// ── Níveis e destinos ────────────────────────────────────────────────────
w(`## Níveis de risco e pontos de atenção`);
w();
w(`O nível responde **quão rápido**. O destino responde **onde**. São perguntas diferentes.`);
w(`No protocolo v1 estavam fundidas em cinco caixas, o que empurrava para a UPA casos que a UPA`);
w(`não resolve (achado A10).`);
w();
w(`| Destino | Instrução | Sensível a horário | Sem deslocamento | Origem |`);
w(`|---|---|---|---|---|`);
for (const d of DESTINOS) {
  w(`| **${d.nome}** | ${d.instrucao} | ${d.sensivelAHorario ? 'sim' : 'não'} | ${d.semDeslocamento ? 'sim' : 'não'} | ${d.origem} |`);
}
w();

// ── Critérios ────────────────────────────────────────────────────────────
w(`## Critérios (${CRITERIOS.length})`);
w();
for (const nivel of ORDEM_NIVEIS.slice().reverse()) {
  const doNivel = CRITERIOS.filter((c) => c.nivel === nivel);
  if (doNivel.length === 0) continue;
  w(`### ${nivel.toUpperCase()} — ${doNivel.length} critério(s)`);
  w();
  for (const c of doNivel) {
    w(`#### ${c.titulo}`);
    w();
    w(`\`${c.id}\` · queixa: ${c.tipoQueixa} · origem: **${c.origem}** · assinatura: ${c.assinatura ? '✔' : '**pendente**'}`);
    w();
    w(c.descricao);
    w();
    w(`*Como a pessoa descreve:* ${c.comoAPessoaDescreve.slice(0, 10).map((t) => `"${t}"`).join(', ')}`);
    w();
    if (c.tempoDependente) w(`⏱ **Tempo-dependente** — a janela terapêutica é curta.`);
    if (c.irreversivel) w(`🔒 **Bandeira irreversível** — uma vez disparada, não desce.`);
    if (c.exigeTodos) {
      w();
      w(`*Só dispara na conjunção:* ${c.exigeTodos.map((g) => `(${g.join(' ou ')})`).join(' **E** ')}`);
    }
    if (c.sinaisDeAlarme) {
      w();
      w(`**Sinais de alarme** → reclassifica para ${c.sinaisDeAlarme.nivelSeAlarme.toUpperCase()}: ${c.sinaisDeAlarme.descricao}`);
    }
    if (c.primeirosMinutos?.length) {
      w();
      w(`**Enquanto a ajuda não chega:**`);
      w();
      c.primeirosMinutos.forEach((p, i) => w(`${i + 1}. ${p}`));
    }
    if (c.fonte) {
      w();
      w(`*Fonte:* ${c.fonte}`);
    }
    w();
  }
}

// ── Agravantes ───────────────────────────────────────────────────────────
w(`## Agravantes condicionados (A1)`);
w();
w(`No protocolo v1, onze condições subiam o caso um nível para **qualquer** critério. Como HAS,`);
w(`DM e idade 60+ não são raros na demanda de uma UBS — são a demanda da UBS — o efeito era`);
w(`reorientar o fluxo da Atenção Básica para a urgência. Aqui cada comorbidade só escalona os`);
w(`critérios com os quais tem relação fisiopatológica.`);
w();
w(`**Teto:** agravante nunca cria emergência. VERMELHO exige bandeira clínica própria.`);
w();
w(`| Agravante | Bloco | Escalona | Justificativa |`);
w(`|---|---|---|---|`);
for (const a of AGRAVANTES) {
  const escala = [
    ...a.escalonaTiposQueixa,
    ...(a.escalonaCriterios ?? []),
    ...(a.escalonaQualquerFebre ? ['qualquer febre'] : []),
  ];
  w(`| **${a.rotulo}** | ${a.bloco} | ${escala.length ? escala.join(', ') : '— (só muda modalidade)'} | ${a.justificativaFisiopatologica} |`);
}
w();
w(`**Idade:** escalona sozinha a partir de ${REGRA_IDADE.idadeIsoladaEscalona} anos.`);
w(`Entre ${REGRA_IDADE.faixaExigeSinalAgudo.min} e ${REGRA_IDADE.faixaExigeSinalAgudo.max} exige`);
w(`idade **somada** a sinal agudo. ${REGRA_IDADE.justificativa}`);
w();

// ── Bloco fixo ───────────────────────────────────────────────────────────
w(`## Bloco fixo de perguntas de segurança (B4)`);
w();
w(`Determinístico, sem IA e sem rede. Para relatos vagos ("tô passando mal"), este bloco deixa`);
w(`de ser complemento e passa a ser o **mecanismo principal** de triagem.`);
w();
for (const p of BLOCO_SEGURANCA) {
  w(`- ${p.icone} **${p.pergunta}** — ${p.ajuda} → aciona \`${p.acionaCriterios.join('`, `')}\``);
}
w();

// ── Roteiros ─────────────────────────────────────────────────────────────
w(`## Roteiros fechados em domínio sensível (B8)`);
w();
w(`Perguntas fixas escritas pela equipe clínica **não são a IA fazendo perguntas** — são`);
w(`formulário, auditável e testável.`);
w();
for (const r of ROTEIROS_SENSIVEIS) {
  w(`### ${r.dominio} (\`${r.id}\`)`);
  w();
  for (const p of r.perguntas) {
    w(`- **${p.pergunta}** — ${p.opcoes.join(' / ')}${p.elevaPara ? ` → eleva para ${p.elevaPara.toUpperCase()}` : ''}`);
  }
  w();
}

// ── Arbovirose ───────────────────────────────────────────────────────────
w(`## Módulo sazonal de arbovirose (A6)`);
w();
w(`Reconhecimento: febre **mais** ${MODULO_ARBOVIROSE.reconhecimento.minimoSintomas} sintomas típicos.`);
w();
w(`**Sinais de alarme, de checagem obrigatória:**`);
w();
for (const s of MODULO_ARBOVIROSE.sinaisDeAlarme) {
  w(`- ${s.pergunta} → **${s.nivel.toUpperCase()}**`);
}
w();
w(`> ${MODULO_ARBOVIROSE.orientacao.defervescencia}`);
w();
w(`${MODULO_ARBOVIROSE.orientacao.naoUsar}`);
w();

// ── Safety-netting ───────────────────────────────────────────────────────
w(`## Rede de segurança nos cinco níveis (A12)`);
w();
for (const n of ORDEM_NIVEIS.slice().reverse()) {
  const s = SAFETY_NETTING[n];
  w(`### ${n.toUpperCase()}`);
  w();
  w(`**Observar:** ${s.observar.join(' · ')}`);
  w();
  w(`**Reavaliar:** ${s.prazoReavaliacao}`);
  w();
  w(`**Voltar se:** ${s.voltarSe.join(' · ')}`);
  w();
}

// ── Unidades ─────────────────────────────────────────────────────────────
w(`## Base de unidades e horários (D1)`);
w();
w(`| Unidade | Destino | Bairro | Endereço |`);
w(`|---|---|---|---|`);
for (const u of UNIDADES) {
  w(`| ${u.nome} | ${u.destino} | ${u.bairro} | ${u.endereco} |`);
}
w();
w(`*Horários e feriados a confirmar com a Secretaria antes do piloto.*`);
w();

w(`---`);
w();
w(`Documento gerado automaticamente a partir de \`packages/protocolo\`. Não editar à mão.`);
w(`Camada 2: \`${MODELO}\`.`);

const saida = l.join('\n');
const destino = process.argv[2];
if (destino) {
  writeFileSync(destino, saida);
  console.log(`Protocolo v${VERSAO_PROTOCOLO} escrito em ${destino} (${CRITERIOS.length} critérios, ${pendentes.length} pendentes de assinatura).`);
} else {
  console.log(saida);
}
