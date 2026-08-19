/**
 * Página do passe (C1, E4).
 *
 * "de nada adianta não perguntar o nome se o documento pode ser lido por quem adivinhar
 *  quatro caracteres."
 *
 * O código na URL é apenas identificador de exibição. Abrir exige segundo fator: o token
 * longo do QR Code (parâmetro `t`) ou o PIN escolhido na triagem. Tentativas inválidas
 * têm bloqueio progressivo e ficam na trilha de auditoria.
 */

'use strict';

const $ = (s) => document.querySelector(s);
const CODIGO = (location.pathname.split('/').pop() || '').toUpperCase();
const TOKEN = new URLSearchParams(location.search).get('t');

const ICONE = { vermelho: '🚨', laranja: '⚠️', amarelo: '🕐', verde: '📅', azul: '🏠' };
const ROTULO = {
  vermelho: 'Emergência', laranja: 'Urgência', amarelo: 'Atendimento hoje',
  verde: 'Consulta agendada', azul: 'Cuidado em casa',
};

async function abrir(segundoFator) {
  const q = new URLSearchParams(segundoFator);
  const r = await fetch(`/api/passe/${encodeURIComponent(CODIGO)}?${q}`);
  const d = await r.json();
  if (!r.ok) {
    $('#erro').textContent = d.mensagem ?? 'Não foi possível abrir o passe.';
    if (d.esperarMs > 0) {
      $('#erro').textContent += ` Aguarde ${Math.ceil(d.esperarMs / 1000)}s.`;
    }
    return false;
  }
  render(d);
  return true;
}

function render(p) {
  $('#pedir-pin').classList.add('oculto');
  const el = $('#passe');
  el.classList.remove('oculto');
  el.innerHTML = `
    <div class="resultado">
      <div class="resultado-faixa n-${p.nivel}">
        <span class="resultado-icone" aria-hidden="true">${ICONE[p.nivel]}</span>
        <div>
          <div class="resultado-nivel">${ROTULO[p.nivel]}</div>
          <div class="resultado-instrucao">${p.destino.replace(/_/g, ' ')}</div>
        </div>
      </div>
      <div class="resultado-corpo">
        <div class="linha" style="justify-content:space-between">
          <div>
            <div class="mini">Código</div>
            <div style="font-size:1.6rem;font-weight:800;letter-spacing:.2em">${p.codigo}</div>
          </div>
          <span class="selo ${p.modo === 'ia' ? 'selo-ia' : 'selo-degradado'}">${p.modo}</span>
        </div>
      </div>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Resumo para a equipe</div>
      <p>${p.resumo || '<span class="mini">Sem resumo — triagem em modo degradado.</span>'}</p>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Critérios reconhecidos pelo protocolo</div>
      <ul class="lista-checagem mini">${p.criterios.map((c) => `<li><code>${c}</code></li>`).join('') || '<li>nenhum</li>'}</ul>
    </div>

    <!-- E4 — contrarreferência em três toques. Fecha o ciclo e produz o padrão-ouro. -->
    <div class="cartao">
      <div class="cartao-titulo">Para o serviço que recebeu — desfecho</div>
      <p class="mini" style="margin-bottom:.9rem">
        Registrar o desfecho fecha a referência e contrarreferência, e produz a comparação mais
        valiosa possível: o que o sistema disse contra o que o serviço encontrou.
        Requer login da equipe.
      </p>
      <div class="botao-linha">
        <button class="botao botao-secundario" disabled title="Requer sessão autenticada da equipe">Atendido</button>
        <button class="botao botao-secundario" disabled title="Requer sessão autenticada da equipe">Redirecionado</button>
        <button class="botao botao-secundario" disabled title="Requer sessão autenticada da equipe">Não compareceu</button>
      </div>
    </div>

    <div class="cartao">
      <div class="cartao-titulo">Versões e auditoria (B7, C1)</div>
      <table><tbody>
        <tr><td>Emitido</td><td class="mini">${new Date(p.emitidoEm).toLocaleString('pt-BR')}</td></tr>
        <tr><td>Expira</td><td class="mini">${new Date(p.expiraEm).toLocaleString('pt-BR')}</td></tr>
        <tr><td>Protocolo</td><td class="mini"><code>${p.versoes.protocolo ?? '—'}</code></td></tr>
        <tr><td>Modelo</td><td class="mini"><code>${p.versoes.modelo ?? '—'}</code></td></tr>
        <tr><td>Aberturas registradas</td><td class="mini">${p.aberturas.length}</td></tr>
      </tbody></table>
    </div>

    <p class="rodape">
      Protocolo não validado clinicamente. UBS João Dias — Parnamirim/RN.
    </p>`;
}

$('#form-pin').addEventListener('submit', (ev) => {
  ev.preventDefault();
  abrir({ pin: $('#pin').value.trim() });
});

// Link completo do QR Code já traz o token — não precisa de PIN.
if (TOKEN) abrir({ t: TOKEN });
