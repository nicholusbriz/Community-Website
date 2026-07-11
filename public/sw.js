const CACHE_NAME = 'community-site-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/community-website-logo.png',
  '/icon-192.png',
  '/icon-512.png'
  // add any other static assets you want cached
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // network-first for API/HTML, cache-first for assets
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // optionally update cache
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
