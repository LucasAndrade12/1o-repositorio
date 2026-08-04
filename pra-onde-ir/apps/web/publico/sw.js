/**
 * B9 (MÉDIO) — service worker.
 *
 * "Publicar como PWA instalável com service worker: lista de critérios, varredura da camada 1,
 *  dados das unidades e telefones de emergência disponíveis localmente; sincronização do
 *  registro quando a conexão voltar. Isso transforma 'funciona apesar da internet ruim' de
 *  promessa em propriedade verificável."
 *
 * Estratégia: cache-first para o que é do app (ele precisa abrir sem rede, sempre),
 * network-first para a API (o servidor tem a IA e o registro, mas a falta dele não impede nada).
 */

const CACHE = 'pra-onde-ir-v2.0.0';

const ESSENCIAIS = [
  '/', '/index.html', '/estilo.css', '/app.js', '/motor.js',
  '/passe.html', '/passe.js', '/manifest.webmanifest',
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(CACHE).then((c) => c.addAll(ESSENCIAIS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(chaves.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url);
  if (ev.request.method !== 'GET' || url.origin !== location.origin) return;

  // API: rede primeiro. Se cair, o app já tem o motor local — não há tela em branco.
  if (url.pathname.startsWith('/api/')) {
    ev.respondWith(
      fetch(ev.request)
        .then((r) => {
          if (url.pathname === '/api/protocolo/offline' && r.ok) {
            const copia = r.clone();
            caches.open(CACHE).then((c) => c.put(ev.request, copia));
          }
          return r;
        })
        .catch(() => caches.match(ev.request).then((c) => c ?? new Response(
          JSON.stringify({ offline: true }), { headers: { 'Content-Type': 'application/json' } },
        ))),
    );
    return;
  }

  // App: cache primeiro. Abrir tem que ser instantâneo e independente de rede.
  ev.respondWith(
    caches.match(ev.request).then((c) => c ?? fetch(ev.request).then((r) => {
      const copia = r.clone();
      caches.open(CACHE).then((cache) => cache.put(ev.request, copia));
      return r;
    }).catch(() => caches.match('/index.html'))),
  );
});
