const staticCacheName = 'site-static-v1';
const assets = [
  '/',
  '/index.html',
  '/todo.js',
  '/todo.css',
  '/images/bg-desktop-dark.jpg',
  '/images/bg-desktop-light.jpg',
  '/images/bg-mobile-dark.jpg',
  '/images/bg-mobile-light.jpg',
  '/images/favicon-32x32.png',
  '/images/icon-check.svg',
  '/images/icon-cross.svg',
  '/images/icon-moon.svg',
  '/images/icon-sun.svg',
  'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&display=swap',
];
// install event
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});
// activate event
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});
// fetch event
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request);
    })
  );
});