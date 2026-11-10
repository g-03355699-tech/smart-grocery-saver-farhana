// Smart Grocery Saver — simpan fail app untuk kegunaan luar talian (cth. di pasar raya tanpa liputan).
const CACHE = 'sgs-v1.1.0';
const FAIL = ['./', './index.html', './manifest.json', './ikon-192.png', './ikon-512.png', './ikon-180.png', '../derma-qr.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FAIL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n)))).then(() => self.clients.claim()));
});
// Rangkaian dahulu (supaya versi baharu terus dimuat), cache jika luar talian.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) {
        const salin = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, salin));
      }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html')))
  );
});
