const CACHE_NAME = 'juicebx-v1';
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(['./', './index.html', './js/engine.js', './js/ui.js', './logo.png']))));
self.addEventListener('fetch', (e) => e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request))));
