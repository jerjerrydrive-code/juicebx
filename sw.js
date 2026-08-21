const CACHE_NAME = 'juicebx-v3.2-shuffles-video-rotate';
const ASSETS = [
  './',
  './index.html',
  './js/engine.js',
  './js/ui.js',
  './js/shuffles_catalog.js',
  './logo.png',
  './manifest.json'
];

// Install: pre-cache core assets & skip waiting
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: delete old cache versions and claim clients immediately
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network-First strategy so updates are instant, with offline fallback
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  
  // Always go direct to network for dynamic API calls & audio streams
  if (url.pathname.startsWith('/api/') || url.hostname !== location.hostname) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network-First for app assets so latest deployed code loads immediately
  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, resClone));
        }
        return networkRes;
      })
      .catch(() => caches.match(e.request))
  );
});
