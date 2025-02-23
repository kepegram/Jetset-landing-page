const CACHE_NAME = 'jetset-cache-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/assets/adaptive-icon.webp',
  '/assets/screenshots/welcome.webp',
  '/assets/screenshots/home-screen.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
}); 