/**
 * App do paciente.
 *
 * Achados que esta camada implementa:
 *   B2  — a tela do SAMU aparece IMEDIATAMENTE, pelo motor local, sem esperar a rede
 *   B4  — bloco fixo de sete perguntas de segurança
 *   B9  — funciona offline: o motor está embarcado (motor.js) e o service worker cacheia tudo
 *   D2  — para quem é o atendimento, antes de qualquer outra coisa
 *   D3  — agravantes em quatro blocos de linguagem simples
 *   D4  — voz, leitura em voz alta, grade de ícones, frases curtas
 *   D5  — pergunta de deslocamento em LARANJA
 *   D6  — discagem direta, mapa, compartilhar passe, autonomia na frase final
 *   A9  — botão de saída rápida quando o tema é violência
 *   C4  — aviso de decisão automatizada, permanente e não condicional
 */

'use strict';

const M = window.Motor;
const D = M.dados;

const estado = {
  paraQuem: null,
  relato: '',
  queixasSelecionadas: new Set(),
  respostasSeguranca: {},
  agravantes: new Set(),
  gestante: null,
  semDeslocamento: false,
  confirmouBandeira: undefined,
  triagemLocal: null,
  idServidor: null,
};

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const ICONE_NIVEL = { vermelho: '🚨', laranja: '⚠️', amarelo: '🕐', verde: '📅', azul: '🏠' };
const ROTULO_NIVEL = {
  vermelho: 'Emergência', laranja: 'Urgência', amarelo: 'Hoje',
  verde: 'Consulta agendada', azul: 'Cuidado em casa',
};

// ─────────────────────────────────────────────────────────────────────────
// Navegação entre etapas
// ─────────────────────────────────────────────────────────────────────────

function mostrar(id) {
  $$('.etapa').forEach((e) => e.classList.add('oculto'));
  $(id).classList.remove('oculto');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  const h = $(id).querySelector('h1');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
}

// ─────────────────────────────────────────────────────────────────────────
// Etapa 0 — D2
// ─────────────────────────────────────────────────────────────────────────

$$('[data-para-quem]').forEach((b) => {
  b.addEventListener('click', () => {
    estado.paraQuem = b.dataset.paraQuem;
    $$('[data-para-quem]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    // D2 — toda a linguagem seguinte muda conforme quem é o paciente.
    $('#titulo-relato').textContent =
      estado.paraQuem === 'terceiro' ? 'O que a pessoa está sentindo?' : 'O que você está sentindo?';
    $('#relato').placeholder =
      estado.paraQuem === 'terceiro'
        ? 'Ex.: minha mãe acordou com o braço mole e a fala embolada'
        : 'Ex.: acordei com dor no peito e falta de ar';
    $('#cartao-agravantes').querySelector('.cartao-titulo').innerHTML =
      estado.paraQuem === 'terceiro'
        ? 'Alguma dessas condições? <span style="text-transform:none;font-weight:500">(da pessoa que vai ser atendida)</span>'
        : 'Alguma dessas condições? <span style="text-transform:none;font-weight:500">(suas)</span>';
    setTimeout(() => mostrar('#etapa-relato'), 140);
  });
});

$('#btn-emergencia-direta').addEventListener('click', () => {
  abrirEmergencia(
    'Você indicou que é uma emergência.',
    ['Ligue 192 agora e siga as orientações do atendente — ele conduz você pelo telefone.',
     'Não deixe a pessoa sozinha.',
     'Deixe a porta destrancada para a equipe entrar.',
     'Se a pessoa estiver desacordada, vire-a de lado.'],
  );
});

// ─────────────────────────────────────────────────────────────────────────
// Etapa 1 — D4: grade de ícones + voz
// ─────────────────────────────────────────────────────────────────────────

const grade = $('#grade-queixas');
D.gradeQueixas.forEach((q) => {
  const b = document.createElement('button');
  b.className = 'grade-item';
  b.type = 'button';
  b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<span class="grade-icone" aria-hidden="true">${q.icone}</span><span>${q.rotulo}</span>`;
  b.addEventListener('click', () => {
    const ativa = estado.queixasSelecionadas.has(q.texto);
    if (ativa) estado.queixasSelecionadas.delete(q.texto);
    else estado.queixasSelecionadas.add(q.texto);
    b.classList.toggle('ativa', !ativa);
    b.setAttribute('aria-pressed', String(!ativa));
  });
  grade.appendChild(b);
});

// D4 — entrada por voz. "remove a barreira principal e casa bem com a fala espontânea
// que a IA já é boa em interpretar."
const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null;
if (Reconhecimento) {
  $('#btn-voz').addEventListener('click', () => {
    if (rec) { rec.stop(); return; }
    rec = new Reconhecimento();
    rec.lang = 'pt-BR';
    rec.continuous = true;
    rec.interimResults = true;
    const base = $('#relato').value;
    rec.onresult = (ev) => {
      let txt = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) txt += ev.results[i][0].transcript;
      $('#relato').value = (base + ' ' + txt).trim();
    };
    rec.onend = () => { rec = null; $('#txt-voz').textContent = 'Falar em vez de escrever'; $('#btn-voz').classList.remove('ativa'); };
    rec.onerror = () => { rec = null; $('#txt-voz').textContent = 'Não consegui ouvir — tente escrever'; };
    rec.start();
    $('#txt-voz').textContent = 'Ouvindo… toque para parar';
    $('#btn-voz').classList.add('ativa');
  });
} else {
  $('#btn-voz').classList.add('oculto');
}

$('#btn-continuar-relato').addEventListener('click', () => {
  const escrito = $('#relato').value.trim();
  const daGrade = [...estado.queixasSelecionadas].join(', ');
  estado.relato = [escrito, daGrade].filter(Boolean).join('. ');

  if (!estado.relato) {
    $('#relato').focus();
    $('#relato').style.borderColor = 'var(--vermelho)';
    return;
  }

  // A9 — tema de violência ativa o botão de saída rápida.
  // "recurso padrão em produtos que tratam violência doméstica, porque a pessoa pode estar
  //  sendo observada."
  const r = M.varrer(estado.relato);
  const temViolencia = r.criteriosAcionados.some((id) => id.startsWith('vi.'));
  if (temViolencia) $('#saida-rapida').classList.remove('oculto');

  mostrar('#etapa-seguranca');
});

// ─────────────────────────────────────────────────────────────────────────
// Etapa 2 — B4 e D3
// ─────────────────────────────────────────────────────────────────────────

const blocoSeg = $('#bloco-seguranca');
D.blocoSeguranca.forEach((p) => {
  const div = document.createElement('div');
  div.className = 'pergunta';
  div.innerHTML = `
    <span class="pergunta-icone" aria-hidden="true">${p.icone}</span>
    <div class="pergunta-texto">
      <div class="pergunta-titulo" id="lbl-${p.id}">${p.pergunta}</div>
      <div class="pergunta-ajuda">${p.ajuda}</div>
    </div>
    <div class="sim-nao" role="group" aria-labelledby="lbl-${p.id}">
      <button type="button" class="sim" data-p="${p.id}" data-v="1" aria-pressed="false">Sim</button>
      <button type="button" class="nao" data-p="${p.id}" data-v="0" aria-pressed="false">Não</button>
    </div>`;
  blocoSeg.appendChild(div);
});

blocoSeg.addEventListener('click', (ev) => {
  const b = ev.target.closest('button[data-p]');
  if (!b) return;
  const id = b.dataset.p;
  estado.respostasSeguranca[id] = b.dataset.v === '1';
  blocoSeg.querySelectorAll(`button[data-p="${id}"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
});

// D3 — quatro blocos de linguagem simples, com "nenhuma dessas".
const blocosAg = $('#blocos-agravantes');
D.blocosAgravantes.forEach((bloco) => {
  const itens = D.agravantes.filter((a) => a.bloco === bloco.id);
  if (itens.length === 0) return;
  const b = document.createElement('button');
  b.className = 'opcao';
  b.type = 'button';
  b.setAttribute('aria-pressed', 'false');
  b.innerHTML = `<span class="opcao-icone" aria-hidden="true">${bloco.icone}</span>
    <span><strong>${bloco.rotulo}</strong><br><span class="mini">${itens.map((i) => i.rotulo).join(' · ')}</span></span>`;
  b.addEventListener('click', () => {
    const ativo = b.getAttribute('aria-pressed') === 'true';
    b.setAttribute('aria-pressed', String(!ativo));
    b.classList.toggle('ativa', !ativo);
    itens.forEach((i) => (ativo ? estado.agravantes.delete(i.id) : estado.agravantes.add(i.id)));
    if (bloco.id === 'gravidez_pos_parto') estado.gestante = ativo ? null : { semanas: null };
    $('#ag-nenhuma')?.setAttribute('aria-pressed', 'false');
    $('#ag-nenhuma')?.classList.remove('ativa');
  });
  blocosAg.appendChild(b);
});

const nenhuma = document.createElement('button');
nenhuma.className = 'opcao';
nenhuma.id = 'ag-nenhuma';
nenhuma.type = 'button';
nenhuma.setAttribute('aria-pressed', 'false');
nenhuma.innerHTML = '<span class="opcao-icone" aria-hidden="true">➖</span><span>Nenhuma dessas</span>';
nenhuma.addEventListener('click', () => {
  estado.agravantes.clear();
  estado.gestante = null;
  blocosAg.querySelectorAll('.opcao').forEach((x) => { x.setAttribute('aria-pressed', 'false'); x.classList.remove('ativa'); });
  nenhuma.setAttribute('aria-pressed', 'true');
  nenhuma.classList.add('ativa');
});
blocosAg.appendChild(nenhuma);

$('#btn-ver-resultado').addEventListener('click', () => processar());

// ─────────────────────────────────────────────────────────────────────────
// B2 — o motor local decide primeiro. A tela nunca espera a rede.
// ─────────────────────────────────────────────────────────────────────────

function montarEntrada() {
  return {
    relato: estado.relato,
    paraQuem: estado.paraQuem ?? 'proprio',
    paciente: {
      agravantes: [...estado.agravantes],
      ...(estado.gestante ? { gestante: estado.gestante } : {}),
      ...(estado.semDeslocamento ? { semDeslocamento: true } : {}),
    },
    respostasBlocoSeguranca: estado.respostasSeguranca,
    ...(estado.confirmouBandeira !== undefined ? { confirmouBandeira: estado.confirmouBandeira } : {}),
  };
}

function processar() {
  const entrada = montarEntrada();
  const local = M.triarOffline(entrada);
  estado.triagemLocal = local;

  // B1 — bandeira detectada e ainda sem confirmação: pergunta antes de acionar o SAMU.
  if (local.aguardandoConfirmacao) {
    const acerto = local.camada1.acertos.find((a) => !a.descartadoPor);
    $('#ajuda-confirmacao').textContent = D.perguntaConfirmacao.ajuda;
    $('#contexto-bandeira').textContent = acerto
      ? `Detectamos no seu relato: “${acerto.contexto}”.`
      : 'Detectamos um sinal de alerta no seu relato.';
    mostrar('#etapa-confirmacao');
    return;
  }

  // B2 — CURTO-CIRCUITO. Tela do SAMU agora, sem rede.
  if (local.curtoCircuito) {
    const criterio = local.classificacao.criteriosAplicados.find((c) => c.nivel === 'vermelho');
    abrirEmergencia(criterio ? criterio.titulo : 'Sinal de emergência identificado.', local.primeirosMinutos);
    enviarAoServidor(entrada); // segundo plano: resumo, passe e registro
    return;
  }

  mostrarResultado(local);
  enviarAoServidor(entrada);
}

$('#conf-sim').addEventListener('click', () => { estado.confirmouBandeira = true; processar(); });
$('#conf-nao').addEventListener('click', () => { estado.confirmouBandeira = false; processar(); });

/** O servidor complementa (resumo pela IA, passe, registro). Nunca bloqueia a tela. */
async function enviarAoServidor(entrada) {
  try {
    const r = await fetch('/api/triagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...entrada, bairro: 'Nova Parnamirim', equipe: 'eSF 1' }),
    });
    if (!r.ok) return;
    const d = await r.json();
    estado.idServidor = d.id;
    const selo = $('#selo-modo');
    if (selo) {
      selo.textContent = d.modo === 'ia' ? 'analisado com IA' : 'modo offline';
      selo.className = 'selo ' + (d.modo === 'ia' ? 'selo-ia' : 'selo-degradado');
    }
    const bp = $('#bloco-passe');
    if (bp) bp.classList.remove('oculto');
  } catch { /* B9 — offline é um estado esperado, não um erro. */ }
}

// ─────────────────────────────────────────────────────────────────────────
// Tela de emergência (B2 + A12)
// ─────────────────────────────────────────────────────────────────────────

function abrirEmergencia(motivo, passos) {
  $('#emerg-motivo').textContent = motivo;
  const ol = $('#emerg-passos');
  ol.innerHTML = '';
  (passos && passos.length ? passos : [
    'Ligue 192 e siga as orientações do atendente.',
    'Não deixe a pessoa sozinha.',
    'Deixe a porta destrancada para a equipe entrar.',
  ]).forEach((p) => {
    const li = document.createElement('li');
    li.textContent = p;
    ol.appendChild(li);
  });
  $('#emerg-aviso').textContent = D.avisoLGPD;
  $('#tela-emergencia').classList.remove('oculto');
  document.body.style.overflow = 'hidden';
  $('#emerg-titulo').setAttribute('tabindex', '-1');
  $('#emerg-titulo').focus();
  falar(`Emergência. Ligue 1 9 2 agora. ${motivo}`);
}

$('#btn-fechar-emergencia').addEventListener('click', () => {
  $('#tela-emergencia').classList.add('oculto');
  document.body.style.overflow = '';
  estado.confirmouBandeira = false;
  processar();
});

// ─────────────────────────────────────────────────────────────────────────
// Resultado (A12, C4, D5, D6)
// ─────────────────────────────────────────────────────────────────────────

function mostrarResultado(t) {
  const nivel = t.nivel;
  const rot = t.roteamento;
  const destino = D.destinos.find((d) => d.id === rot.destino);
  const unidade = rot.unidade;
  const sn = t.safetyNetting;

  const el = $('#etapa-resultado');
  el.innerHTML = `
    <div class="progresso" aria-hidden="true"><span class="feito"></span><span class="feito"></span><span class="feito"></span><span class="feito"></span></div>

    <div class="resultado">
      <div class="resultado-faixa n-${nivel}">
        <span class="resultado-icone" aria-hidden="true">${ICONE_NIVEL[nivel]}</span>
        <div>
          <div class="resultado-nivel">${ROTULO_NIVEL[nivel]}</div>
          <div class="resultado-instrucao">${rot.instrucao}</div>
        </div>
      </div>
      <div class="resultado-corpo">
        ${unidade ? `<p style="font-weight:650;margin-bottom:.3rem">${unidade.nome}</p>
          <p class="mini">${unidade.endereco}</p>` : ''}
        ${rot.avisoHorario ? `<p class="selo selo-alerta" style="margin-top:.7rem">🕐 ${rot.avisoHorario}</p>` : ''}
        ${rot.planoB ? `<p style="margin-top:.8rem"><strong>Se piorar antes disso:</strong> ${rot.planoB.instrucao}</p>` : ''}
        ${rot.apoioPermanente ? `
          <div style="margin-top:1rem;padding:.9rem 1rem;border-radius:12px;background:var(--primaria-clara)">
            <p style="margin:0"><strong>Você pode falar com alguém agora.</strong></p>
            <p class="mini" style="margin:.3rem 0 .7rem">${rot.apoioPermanente.instrucao}</p>
            <a class="botao" href="tel:188" style="min-height:52px">📞 Ligar 188 — CVV</a>
          </div>` : ''}
        <div class="botao-linha" style="margin-top:1rem">
          ${destino && destino.telefone ? `<a class="botao" href="tel:${destino.telefone}">📞 Ligar ${destino.telefone}</a>` : ''}
          ${unidade && !destino.semDeslocamento ? `<a class="botao botao-secundario" target="_blank" rel="noopener"
              href="https://www.google.com/maps/search/${encodeURIComponent(unidade.nome + ' ' + unidade.endereco)}">🗺️ Ver no mapa</a>` : ''}
        </div>
      </div>
    </div>

    ${t.primeirosMinutos.length ? `
    <div class="cartao" style="border-color:var(--vermelho)">
      <div class="cartao-titulo" style="color:var(--vermelho)">Enquanto a ajuda não chega</div>
      <ol style="margin:0;padding-left:1.2rem">${t.primeirosMinutos.map((p) => `<li style="margin-bottom:.5rem">${p}</li>`).join('')}</ol>
    </div>` : ''}

    <!-- A12 — safety-netting em TODOS os níveis, não só no azul -->
    <div class="cartao">
      <div class="cartao-titulo">Fique atento a estes sinais</div>
      <ul class="lista-checagem lista-alerta">${sn.observar.map((o) => `<li>${o}</li>`).join('')}</ul>
      <p style="margin-top:.9rem"><strong>Quando reavaliar:</strong> ${sn.prazoReavaliacao}</p>
      <div class="cartao-titulo" style="margin-top:1rem">Volte a usar este app se</div>
      <ul class="lista-checagem">${sn.voltarSe.map((o) => `<li>${o}</li>`).join('')}</ul>
    </div>

    ${['laranja', 'amarelo'].includes(nivel) && !estado.semDeslocamento ? `
    <div class="cartao" id="cartao-deslocamento">
      <div class="cartao-titulo">Uma última pergunta</div>
      <h3 style="margin-bottom:.3rem">${D.perguntaDeslocamento.pergunta}</h3>
      <p class="mini" style="margin-bottom:.9rem">${D.perguntaDeslocamento.ajuda}</p>
      <div class="opcoes opcoes-2">
        <button class="opcao" id="desloc-sim"><span class="opcao-icone" aria-hidden="true">✅</span><span>Sim, consigo ir</span></button>
        <button class="opcao" id="desloc-nao"><span class="opcao-icone" aria-hidden="true">🏠</span><span>Não tenho como ir</span></button>
      </div>
    </div>` : ''}

    <div class="cartao oculto" id="bloco-passe">
      <div class="cartao-titulo">Passe de encaminhamento</div>
      <p class="mini">Um código para apresentar no serviço, com o resumo do que você contou.
        Crie um PIN de 4 dígitos — sem ele, ninguém abre seu passe.</p>
      <div class="linha" style="margin-top:.8rem">
        <input type="text" id="pin" inputmode="numeric" pattern="[0-9]*" maxlength="4"
               placeholder="PIN" style="width:8rem;text-align:center;letter-spacing:.4em;font-size:1.3rem" aria-label="PIN de 4 dígitos">
        <button class="botao" id="btn-passe" style="width:auto;flex:1">Gerar passe</button>
      </div>
      <div id="passe-saida" style="margin-top:1rem"></div>
    </div>

    <div class="aviso-lgpd">
      <strong>${D.avisoLGPD}</strong>
    </div>

    <div class="botao-linha" style="margin-top:1.2rem">
      <button class="botao botao-secundario" onclick="location.reload()">Nova triagem</button>
    </div>

    <p class="rodape">
      <span class="selo" id="selo-modo">${t.offline ? 'modo offline' : 'processando…'}</span>
      <br><br>
      Protocolo v${t.versoes.protocolo} · piloto não validado clinicamente.<br>
      UBS João Dias — Nova Parnamirim, Parnamirim/RN
    </p>`;

  mostrar('#etapa-resultado');
  falar(`${ROTULO_NIVEL[nivel]}. ${rot.instrucao} ${rot.avisoHorario ?? ''}`);

  // D5 — barreira de deslocamento muda a MODALIDADE, não só o nível.
  $('#desloc-nao')?.addEventListener('click', () => {
    estado.semDeslocamento = true;
    processar();
  });
  $('#desloc-sim')?.addEventListener('click', () => $('#cartao-deslocamento').classList.add('oculto'));

  $('#btn-passe')?.addEventListener('click', gerarPasse);
}

async function gerarPasse() {
  const pin = $('#pin').value.trim();
  if (!/^\d{4}$/.test(pin)) { $('#pin').focus(); $('#pin').style.borderColor = 'var(--vermelho)'; return; }
  if (!estado.idServidor) return;

  const r = await fetch('/api/passe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ triagemId: estado.idServidor, pin }),
  });
  const d = await r.json();
  const url = location.origin + d.linkCompleto;

  $('#passe-saida').innerHTML = `
    <div style="padding:1.1rem;border-radius:14px;background:var(--papel-3);text-align:center">
      <div class="mini">Seu código</div>
      <div style="font-size:2.4rem;font-weight:850;letter-spacing:.22em;font-variant-numeric:tabular-nums">${d.codigo}</div>
      <p class="mini" style="margin-top:.6rem">${d.aviso}</p>
      <p class="mini">Vale por ${d.validadeHoras} horas.</p>
      <div class="botao-linha" style="margin-top:.9rem">
        <button class="botao botao-secundario" id="btn-compartilhar">📤 Compartilhar</button>
        <a class="botao botao-secundario" href="${d.linkCompleto}" target="_blank" rel="noopener">Abrir passe</a>
      </div>
    </div>`;

  // D6 — compartilhar o passe com um familiar.
  $('#btn-compartilhar').addEventListener('click', async () => {
    const texto = `Meu passe de atendimento: código ${d.codigo}. Link: ${url}`;
    if (navigator.share) { try { await navigator.share({ title: 'Pra Onde Ir', text: texto, url }); } catch {} }
    else { await navigator.clipboard.writeText(texto); $('#btn-compartilhar').textContent = '✅ Copiado'; }
  });
}

// ─────────────────────────────────────────────────────────────────────────
// D4 — leitura em voz alta
// ─────────────────────────────────────────────────────────────────────────

function falar(texto) {
  if (!window.speechSynthesis || !texto) return;
  if (!document.body.dataset.lerAuto) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'pt-BR';
  u.rate = 0.95;
  speechSynthesis.speak(u);
}

$('#btn-ler').addEventListener('click', () => {
  if (!window.speechSynthesis) return;
  if (speechSynthesis.speaking) { speechSynthesis.cancel(); return; }
  document.body.dataset.lerAuto = '1';
  const visivel = $$('.etapa').find((e) => !e.classList.contains('oculto'));
  const texto = (visivel?.innerText ?? '').slice(0, 3000);
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'pt-BR';
  u.rate = 0.95;
  speechSynthesis.speak(u);
});

// ─────────────────────────────────────────────────────────────────────────
// A9 — saída rápida. A pessoa pode estar sendo observada.
// ─────────────────────────────────────────────────────────────────────────

$('#saida-rapida').addEventListener('click', () => {
  location.replace('https://www.google.com/search?q=previs%C3%A3o+do+tempo');
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !$('#saida-rapida').classList.contains('oculto')) $('#saida-rapida').click();
});

// ─────────────────────────────────────────────────────────────────────────
// B9 — estado da conexão e service worker
// ─────────────────────────────────────────────────────────────────────────

function atualizarConexao() {
  const s = $('#selo-conexao');
  if (navigator.onLine) { s.textContent = '● online'; s.className = 'selo selo-ia'; }
  else { s.textContent = '● offline — o app continua funcionando'; s.className = 'selo selo-degradado'; }
}
window.addEventListener('online', atualizarConexao);
window.addEventListener('offline', atualizarConexao);
atualizarConexao();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
