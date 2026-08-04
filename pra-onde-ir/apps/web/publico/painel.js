/**
 * Painel da unidade.
 *
 * Achados implementados aqui:
 *   C3  — autenticação por usuário, sessão com expiração, registro de acesso
 *   C6  — interruptor de desligamento acessível à unidade, sem depender do desenvolvedor
 *   B6  — selo de modo (IA / degradado) e concordância ESTRATIFICADA POR MODO
 *   B11 — curadoria de relatos não classificados, com meta explícita
 *   E1  — "qual nível você atribuiu?" com as cinco cores → matriz de confusão completa
 *   E3  — painel de indicadores com os sinais de alarme da revisão
 *   E5  — estratificação por faixa etária e por COMPRIMENTO DO RELATO
 *   C2  — exportação bloqueada quando o k-anonimato falha
 */

'use strict';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const NIVEIS = ['vermelho', 'laranja', 'amarelo', 'verde', 'azul'];
const ICONE = { vermelho: '🚨', laranja: '⚠️', amarelo: '🕐', verde: '📅', azul: '🏠' };

let sessao = null;

const pct = (v) => `${(v * 100).toFixed(1)}%`;
const tag = (n) => `<span class="tag-nivel tag-${n}">${ICONE[n]} ${n}</span>`;
const hora = (iso) => new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

async function api(caminho, opcoes = {}) {
  const r = await fetch(caminho, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessao.token}`, ...(opcoes.headers ?? {}) },
  });
  if (r.status === 401) { sair(); throw new Error('sessão expirada'); }
  return r.json();
}

// ── C3: login ────────────────────────────────────────────────────────────

$('#form-login').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const r = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: $('#login').value, senha: $('#senha').value }),
  });
  if (!r.ok) { $('#erro-login').textContent = 'Usuário ou senha inválidos.'; return; }
  sessao = await r.json();
  $('#tela-login').classList.add('oculto');
  $('#app-painel').classList.remove('oculto');
  $('#selo-usuario').textContent = sessao.usuario.nome;
  iniciar();
});

function sair() {
  sessao = null;
  $('#app-painel').classList.add('oculto');
  $('#tela-login').classList.remove('oculto');
}
$('#btn-sair').addEventListener('click', sair);

// ── Abas ─────────────────────────────────────────────────────────────────

$$('.aba').forEach((a) => {
  a.addEventListener('click', () => {
    $$('.aba').forEach((x) => x.classList.toggle('ativa', x === a));
    $$('.painel-secao').forEach((s) => s.classList.add('oculto'));
    $(`#painel-${a.dataset.aba}`).classList.remove('oculto');
    RENDER[a.dataset.aba]?.();
  });
});

async function iniciar() {
  const sis = await (await fetch('/api/sistema')).json();
  $('#selo-fase').textContent = `fase: ${sis.fase.rotulo}`;
  $('#selo-fase').className = 'selo ' + (sis.fase.mostraResultadoAoPaciente ? 'selo-neutro' : 'selo-degradado');
  RENDER.indicadores();
  atualizarBadgeCuradoria();
}

async function atualizarBadgeCuradoria() {
  const d = await api('/api/painel/curadoria');
  $('#badge-curadoria').textContent = d.fila.length || '';
  $('#badge-curadoria').style.display = d.fila.length ? '' : 'none';
}

// ── E1 + E3 + E5 — indicadores ──────────────────────────────────────────

const RENDER = {};

RENDER.indicadores = async () => {
  const d = await api('/api/painel/indicadores');
  const m = d.matriz;

  const cartoes = d.indicadores.map((i) => `
    <div class="metrica ${i.emAlarme ? 'alarme' : ''}">
      <div class="metrica-rotulo">${i.rotulo}</div>
      <div class="metrica-valor">${i.formato === 'percentual' ? pct(i.valor) : i.valor}</div>
      <div class="metrica-nota">${i.emAlarme ? `<strong>⚠ ${i.sinalDeAlarme}</strong>` : i.porQueExiste}</div>
    </div>`).join('');

  // E1 — matriz de confusão completa. Sub-triagem abaixo da diagonal (o sistema
  // classificou mais leve do que a equipe), sobre-triagem acima.
  const linhas = NIVEIS.map((sis) => {
    const celulas = NIVEIS.map((eq) => {
      const v = m.matriz[sis][eq];
      const iSis = NIVEIS.indexOf(sis), iEq = NIVEIS.indexOf(eq);
      const classe = v === 0 ? 'celula-zero' : iSis === iEq ? 'celula-acerto' : iSis > iEq ? 'celula-sobre' : 'celula-sub';
      return `<td class="num ${classe}">${v || '·'}</td>`;
    }).join('');
    return `<tr><th>${tag(sis)}</th>${celulas}</tr>`;
  }).join('');

  $('#painel-indicadores').innerHTML = `
    <div class="metricas">${cartoes}</div>

    <div class="cartao">
      <div class="cartao-titulo">Matriz de confusão · ${m.total} caso(s) reclassificado(s) pela equipe</div>
      <p class="mini" style="margin-bottom:1rem">
        Substituir os dois botões pela pergunta “qual nível você atribuiu?” custa o mesmo clique
        e separa o que o botão único fundia: <strong style="color:var(--vermelho)">abaixo da diagonal</strong>
        é sub-triagem (falha de segurança); <strong>acima</strong> é sobre-triagem (falha de eficiência).
      </p>
      <div class="matriz-envolucro">
        <table>
          <thead><tr><th>Sistema \\ Equipe</th>${NIVEIS.map((n) => `<th style="text-align:center">${ICONE[n]}<br>${n}</th>`).join('')}</tr></thead>
          <tbody>${linhas}</tbody>
        </table>
      </div>
      ${m.casosSubTriagem.length ? `
        <div style="margin-top:1rem;padding:.9rem 1rem;border-radius:12px;background:var(--vermelho-fundo);border:1px solid var(--vermelho)">
          <strong style="color:var(--vermelho)">⚠ ${m.casosSubTriagem.length} caso(s) de sub-triagem — cada um exige análise individual</strong>
          <ul class="lista-checagem" style="margin-top:.6rem">
            ${m.casosSubTriagem.map((c) => `<li><code>${c.id}</code> — sistema disse ${tag(c.sistema)}, equipe atribuiu ${tag(c.equipe)}</li>`).join('')}
          </ul>
        </div>` : '<p class="mini" style="margin-top:1rem">Nenhum caso de sub-triagem registrado.</p>'}
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Estratificação</div>
      <p class="mini" style="margin-bottom:1rem">
        Uma taxa agregada de concordância é fácil de contestar — 85% pode ser segurança excelente
        ou sub-triagem inaceitável escondida na média. Sem estratificar por modo, o número global
        mistura dois sistemas com desempenhos muito diferentes.
      </p>
      ${estratos('Por modo de execução (B6)', d.porModo)}
      ${estratos('Por faixa etária (E5)', d.porFaixaEtaria)}
      ${estratos('Por comprimento do relato (E5)', d.porComprimentoRelato)}
      <p class="mini" style="margin-top:.8rem">
        Se a acurácia cair sistematicamente em relatos curtos, o achado B4 está confirmado nos
        dados e o bloco de perguntas fechadas passa a ser prioridade absoluta.
      </p>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Distribuição por nível</div>
      ${barras(d.distribuicao)}
    </div>

    <div class="cartao">
      <div class="cartao-titulo">C2 — exportação da base analítica</div>
      <p class="mini">Bairro e equipe, nunca microárea. Horário arredondado para faixa.
        A exportação é recusada se algum grupo de quase-identificadores tiver menos de 5 registros.</p>
      <div class="botao-linha" style="margin-top:.9rem">
        <button class="botao botao-secundario" id="btn-k">Verificar k-anonimato</button>
        <button class="botao botao-secundario" id="btn-exportar">Exportar</button>
      </div>
      <div id="saida-export" style="margin-top:.9rem"></div>
    </div>`;

  $('#btn-k').addEventListener('click', async () => {
    const k = await api('/api/painel/k-anonimato');
    $('#saida-export').innerHTML = k.aprovado
      ? `<p class="selo selo-ia">✅ k-anonimato ≥ ${k.k} em todos os ${k.total} registros</p>`
      : `<p class="selo selo-alerta">⚠ ${k.gruposViolando.length} grupo(s) abaixo de k=${k.k}</p>
         <ul class="lista-checagem mini" style="margin-top:.6rem">${k.gruposViolando.slice(0, 8).map((g) => `<li>${g.chave} — ${g.contagem} registro(s)</li>`).join('')}</ul>`;
  });

  $('#btn-exportar').addEventListener('click', async () => {
    const r = await api('/api/painel/exportar');
    $('#saida-export').innerHTML = r.ok
      ? `<p class="selo selo-ia">✅ ${r.dados.length} registros liberados para exportação</p>`
      : `<div style="padding:.9rem 1rem;border-radius:12px;background:var(--vermelho-fundo);border:1px solid var(--vermelho)">
           <strong style="color:var(--vermelho)">Exportação bloqueada</strong>
           <p class="mini" style="margin-top:.4rem">${r.motivo}</p>
         </div>`;
  });
};

function estratos(titulo, dados) {
  const linhas = Object.entries(dados).map(([k, v]) => `
    <tr><td>${k}</td><td class="num">${v.n}</td><td class="num">${pct(v.concordancia)}</td>
    <td class="num ${v.subTriagem > 0 ? 'celula-sub' : ''}">${pct(v.subTriagem)}</td></tr>`).join('');
  return `<h3 style="font-size:.95rem;margin:1rem 0 .4rem">${titulo}</h3>
    <table><thead><tr><th>Grupo</th><th style="text-align:center">n</th>
    <th style="text-align:center">concordância</th><th style="text-align:center">sub-triagem</th></tr></thead>
    <tbody>${linhas}</tbody></table>`;
}

function barras(dist) {
  const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
  return NIVEIS.map((n) => `
    <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:.5rem">
      <span style="width:7.5rem;flex:none">${tag(n)}</span>
      <div style="flex:1;height:22px;background:var(--papel-3);border-radius:6px;overflow:hidden">
        <div style="height:100%;width:${(dist[n] / total) * 100}%;background:var(--${n})"></div>
      </div>
      <span class="mini" style="width:3.5rem;text-align:right;flex:none">${dist[n]}</span>
    </div>`).join('');
}

// ── Fila e reclassificação (E1) ─────────────────────────────────────────

RENDER.fila = async () => {
  const d = await api('/api/painel/fila');
  $('#painel-fila').innerHTML = `
    <div class="cartao">
      <div class="cartao-titulo">Últimas triagens</div>
      <p class="mini" style="margin-bottom:1rem">
        ${d.pendentesDeAssinatura} de ${d.totalCriterios} critérios aguardam assinatura clínica.
        Reclassificar alimenta a matriz de confusão.
      </p>
      <div class="matriz-envolucro">
        <table>
          <thead><tr><th>Quando</th><th>Relato</th><th>Sistema</th><th>Destino</th><th>Modo</th><th>Equipe atribuiu</th></tr></thead>
          <tbody>${d.registros.map((r) => `
            <tr>
              <td class="mini">${hora(r.criadoEm)}</td>
              <td style="max-width:22rem">${r.relato}${r.naoReconhecido ? ' <span class="selo selo-alerta">não reconhecido</span>' : ''}</td>
              <td>${tag(r.nivel)}</td>
              <td class="mini">${r.destino}</td>
              <td><span class="selo ${r.modo === 'ia' ? 'selo-ia' : 'selo-degradado'}">${r.modo}</span></td>
              <td>${r.reclassificacao
                ? tag(r.reclassificacao.nivelAtribuido)
                : `<select data-reclass="${r.id}" aria-label="Qual nível você atribuiu?" style="min-height:40px;font-size:.9rem">
                     <option value="">qual nível você atribuiu?</option>
                     ${NIVEIS.map((n) => `<option value="${n}">${ICONE[n]} ${n}</option>`).join('')}
                   </select>`}</td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;

  $$('[data-reclass]').forEach((sel) => {
    sel.addEventListener('change', async () => {
      if (!sel.value) return;
      await api('/api/painel/reclassificar', {
        method: 'POST',
        body: JSON.stringify({ id: sel.dataset.reclass, nivel: sel.value }),
      });
      RENDER.fila();
    });
  });
};

// ── B11 — curadoria de não reconhecidos ─────────────────────────────────

RENDER.curadoria = async () => {
  const d = await api('/api/painel/curadoria');
  $('#painel-curadoria').innerHTML = `
    <div class="cartao">
      <div class="cartao-titulo">Relatos não classificados</div>
      <p class="mini" style="margin-bottom:1rem">
        A regra “se nenhum critério bate, encaminha para o acolhimento” é a decisão segura.
        O risco é operacional: cada relato não reconhecido é um sinal de lacuna do protocolo,
        e sem curadoria esse sinal se perde. Meta: abaixo de 15% ao fim do terceiro mês.
      </p>
      ${d.fila.length === 0 ? '<p>Nenhum relato pendente de curadoria.</p>' : d.fila.map((r) => `
        <div style="padding:1rem 0;border-bottom:1px solid var(--borda)">
          <p style="font-weight:600">“${r.relato}”</p>
          <p class="mini">${hora(r.criadoEm)} · ${r.bairro} · ${r.equipe ?? '—'}</p>
          <div class="linha" style="margin-top:.7rem">
            <select data-crit="${r.id}" style="max-width:22rem;min-height:44px;font-size:.9rem">
              <option value="">deveria ser o critério…</option>
              ${d.criterios.map((c) => `<option value="${c.id}">${c.nivel} — ${c.titulo}</option>`).join('')}
            </select>
            <button class="botao botao-secundario" style="width:auto" data-acao="criterio_existente" data-id="${r.id}">Marcar critério</button>
            <button class="botao botao-secundario" style="width:auto" data-acao="criterio_novo" data-id="${r.id}">Merece critério novo</button>
            <button class="botao-fantasma" data-acao="fora_de_escopo" data-id="${r.id}">Fora de escopo</button>
          </div>
        </div>`).join('')}
    </div>`;

  $$('[data-acao]').forEach((b) => {
    b.addEventListener('click', async () => {
      const sel = $(`[data-crit="${b.dataset.id}"]`);
      await api('/api/painel/curadoria', {
        method: 'POST',
        body: JSON.stringify({
          id: b.dataset.id,
          decisao: b.dataset.acao,
          criterioSugerido: sel?.value || undefined,
        }),
      });
      RENDER.curadoria();
      atualizarBadgeCuradoria();
    });
  });
};

// ── C1 + E4 — passes ────────────────────────────────────────────────────

RENDER.passes = async () => {
  const d = await api('/api/painel/passes');
  $('#painel-passes').innerHTML = `
    <div class="cartao">
      <div class="cartao-titulo">Passes emitidos</div>
      <p class="mini" style="margin-bottom:1rem">
        O código sozinho não abre nada: é preciso PIN ou o token longo do QR Code. Toda abertura
        e toda tentativa inválida ficam registradas.
      </p>
      <div class="matriz-envolucro">
        <table>
          <thead><tr><th>Código</th><th>Nível</th><th>Destino</th><th>2º fator</th><th>Aberturas</th><th>Tentativas inválidas</th><th>Desfecho (E4)</th></tr></thead>
          <tbody>${d.passes.map((p) => `
            <tr>
              <td><code>${p.codigo}</code></td>
              <td>${tag(p.nivel)}</td>
              <td class="mini">${p.destino}</td>
              <td>${p.temPin ? '<span class="selo selo-ia">PIN</span>' : '<span class="selo">token</span>'}</td>
              <td class="num">${p.aberturas.filter((a) => a.sucesso).length}</td>
              <td class="num ${p.tentativasInvalidas > 0 ? 'celula-sub' : ''}">${p.tentativasInvalidas}</td>
              <td>${p.desfecho ? `${p.desfecho.tipo}${p.desfecho.nivelAtribuidoNoDestino ? ' · ' + tag(p.desfecho.nivelAtribuidoNoDestino) : ''}` : '<span class="mini">aguardando</span>'}</td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;
};

// ── C7 — trilha de auditoria ────────────────────────────────────────────

RENDER.auditoria = async () => {
  const d = await api('/api/painel/auditoria');
  $('#painel-auditoria').innerHTML = `
    <div class="cartao">
      <div class="cartao-titulo">Trilha de auditoria — apenas inserção</div>
      <p class="mini" style="margin-bottom:1rem">Registro imutável de entrada, versões, saída e horário.</p>
      <div class="matriz-envolucro">
        <table>
          <thead><tr><th>Quando</th><th>Evento</th><th>Referência</th><th>Ator</th><th>Origem</th><th>Detalhe</th></tr></thead>
          <tbody>${d.eventos.map((e) => `
            <tr>
              <td class="mini">${hora(e.em)}</td>
              <td><span class="selo ${e.tipo.includes('invalida') || e.tipo.includes('bloqueada') || e.tipo === 'kill_switch' ? 'selo-alerta' : ''}">${e.tipo}</span></td>
              <td class="mini"><code>${e.referencia}</code></td>
              <td class="mini">${e.ator ?? '—'}</td>
              <td class="mini">${e.origem ?? '—'}</td>
              <td class="mini">${e.detalhe ?? '—'}</td>
            </tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;
};

// ── C5 + C6 + E2 + E6 — governança ──────────────────────────────────────

RENDER.governanca = async () => {
  const prot = await (await fetch('/api/protocolo')).json();
  const sis = await (await fetch('/api/sistema')).json();

  $('#painel-governanca').innerHTML = `
    <div class="cartao" style="border-color:var(--vermelho)">
      <div class="cartao-titulo" style="color:var(--vermelho)">C6 — interruptor de desligamento</div>
      <p class="mini">Acessível à unidade, sem depender do desenvolvedor. Com o sistema desligado,
        o app recusa novas triagens e orienta a procurar a UBS ou ligar 192.</p>
      <p style="margin-top:.8rem">Estado: <strong>${sis.ativo ? 'ATIVO' : 'DESLIGADO'}</strong>
        ${sis.desligadoEm ? `<span class="mini">— desligado por ${sis.desligadoPor} em ${hora(sis.desligadoEm)}</span>` : ''}</p>
      <div class="linha" style="margin-top:.9rem">
        <input type="text" id="motivo-kill" placeholder="Motivo do desligamento" style="flex:1;min-width:14rem">
        <button class="botao ${sis.ativo ? '' : 'botao-secundario'}" style="width:auto;background:${sis.ativo ? 'var(--vermelho)' : ''}" id="btn-kill">
          ${sis.ativo ? 'Desligar o sistema' : 'Religar o sistema'}
        </button>
      </div>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Assinatura clínica</div>
      <p><strong>${prot.assinaturaClinica.pendentes}</strong> de ${prot.assinaturaClinica.total}
        critérios aguardam assinatura da enfermeira do acolhimento e da retaguarda médica.</p>
      <p class="mini" style="margin-top:.6rem">${prot.assinaturaClinica.aviso}</p>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">E2 — fase do piloto</div>
      <p>Fase atual: <strong>${prot.fase.rotulo}</strong> — ${prot.fase.descricao}</p>
      ${prot.fase.criterioParaAvancar ? `<p class="mini" style="margin-top:.5rem">Critério para avançar: ${prot.fase.criterioParaAvancar}</p>` : ''}
      <p class="mini" style="margin-top:.7rem">Trocar de fase é configuração (<code>FASE_PILOTO</code>), não alteração de código.</p>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">E6 — critérios de encerramento, definidos antes de começar</div>
      ${Object.entries(prot.criteriosDeEncerramento).map(([, v]) => `
        <h3 style="font-size:.98rem;margin:1rem 0 .3rem">${v.descricao}</h3>
        <ul class="lista-checagem mini">${v.condicoes.map((c) => `<li>${c}</li>`).join('')}</ul>`).join('')}
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Versões e retenção (B7, C7)</div>
      <table>
        <tbody>
          <tr><td>Protocolo</td><td><code>${prot.versao}</code></td></tr>
          <tr><td>Modelo da camada 2</td><td><code>${prot.camadaIA.versaoModelo}</code></td></tr>
          <tr><td>Base operacional</td><td>${prot.retencao.operacionalDias} dias</td></tr>
          <tr><td>Base analítica</td><td>${prot.retencao.analiticaDias} dias</td></tr>
          <tr><td>Trilha de auditoria</td><td>${prot.retencao.auditoriaDias} dias</td></tr>
        </tbody>
      </table>
      <p class="mini" style="margin-top:.8rem">${prot.retencao.justificativa}</p>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Histórico do protocolo</div>
      ${prot.historico.map((h) => `<p style="margin-bottom:.7rem"><strong>v${h.versao}</strong>
        <span class="mini">· ${h.data} · ${h.responsavel}</span><br><span class="mini">${h.resumo}</span></p>`).join('')}
    </div>`;

  $('#btn-kill').addEventListener('click', async () => {
    const rota = sis.ativo ? '/api/sistema/desligar' : '/api/sistema/religar';
    await api(rota, { method: 'POST', body: JSON.stringify({ motivo: $('#motivo-kill').value }) });
    RENDER.governanca();
  });
};
