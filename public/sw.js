// public/sw.js
// ============================================================
// 📦 SERVICE WORKER FOR PWA
// ============================================================

const CACHE_NAME = 'community-app-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/community-website-logo.png',
];

// ============================================================
// 📥 INSTALL EVENT - Cache static assets
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed!');
        self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// ============================================================
// 🔄 ACTIVATE EVENT - Clean old caches
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[SW] Service worker activated!');
      return self.clients.claim();
    })
  );
});

// ============================================================
// 🌐 FETCH EVENT - Network-first with cache fallback
// ============================================================
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Skip Next.js internal requests
  if (url.pathname.startsWith('/_next/')) {
    return;
  }

  // Skip Chrome devtools requests
  if (url.pathname === '/sw.js') {
    return;
  }

  // Skip favicon
  if (url.pathname === '/favicon.ico') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Check if we got a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response to cache it
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            try {
              cache.put(request, responseToCache);
            } catch (error) {
              console.warn('[SW] Failed to cache:', error);
            }
          });

        return response;
      })
      .catch(() => {
        // If network fails, try cache
        return caches.match(request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              console.log('[SW] Serving from cache:', url.pathname);
              return cachedResponse;
            }
            
            // If not in cache, return a fallback response
            console.warn('[SW] No cache for:', url.pathname);
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
            });
          });
      })
  );
});