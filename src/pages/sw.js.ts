import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  // Ensure base URL ends with a slash
  const rawBase = import.meta.env.BASE_URL;
  const base = rawBase.endsWith('/') ? rawBase : rawBase + '/';

  const swContent = `
const CACHE_NAME = 'risu-oak-v1';
const BASE_PATH = '${base}';
const ASSETS_TO_CACHE = [
  BASE_PATH,
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'images/icons/manifest-icon-192.maskable.png',
  BASE_PATH + 'images/icons/manifest-icon-512.maskable.png',
  BASE_PATH + 'images/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Navigation requests: Network first, then cache, then offline page (optional)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then((response) => response || caches.match(BASE_PATH));
        })
    );
    return;
  }

  // Default: Cache first, network fallback
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
`;

  return new Response(swContent.trim(), {
    headers: {
      'Content-Type': 'application/javascript',
      'Service-Worker-Allowed': base,
    },
  });
};
