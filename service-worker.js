const CACHE = 'block-puzzle-v3';
const FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Inter:wght@400;600&display=swap'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES).catch(()=>{})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (!res || res.status !== 200 || res.type === 'opaque') return res;
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
