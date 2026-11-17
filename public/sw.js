// Bump VERSION on every content change so iPads pick up the new shell.
const VERSION = 'wake-key-v2';
const SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'manifest.webmanifest',
  'data/pronunciations.json', 'data/readaloud.json', 'audio/index.json', 'icons/icon-192.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(SHELL);
    // Pre-cache every generated clip so the app works offline.
    try {
      const idx = await (await fetch('audio/index.json', {cache: 'no-store'})).json();
      await c.addAll(Object.values(idx).filter(Boolean).map(f => 'audio/' + f));
    } catch (_) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const isAudio = req.url.includes('/audio/') && req.url.endsWith('.mp3');
  // Audio: cache first (clips never change name). Everything else: network first, cache fallback.
  e.respondWith(isAudio
    ? caches.match(req).then(hit => hit || fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; }))
    : fetch(req).then(res => { const cp = res.clone(); caches.open(VERSION).then(c => c.put(req, cp)); return res; })
        .catch(() => caches.match(req).then(hit => hit || caches.match('index.html'))));
});
