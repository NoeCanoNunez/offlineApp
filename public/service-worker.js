const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.js',
  '/static/js/0.chunk.js',
  '/static/js/1.chunk.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/icons',
  '/static'
  // Agrega más archivos que quieres que estén disponibles offline
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Archivos cacheados');
      return cache.addAll(urlsToCache);
    })
  );
});

// Interceptar solicitudes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response; // Si está en caché, devuelve el recurso cacheado
      }
      
      // Si no está en caché, intenta buscar en la red y almacenarlo en caché
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache); // Almacenar en caché la respuesta de la red
        });

        return networkResponse;
      });
    }).catch(() => {
      // Si no hay conexión, muestra el archivo offline.html o una página en caché
      return caches.match('/index.html'); // Devuelve la página principal o cualquier otro archivo cacheado
    })
  );
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Elimina las cachés antiguas
          }
        })
      );
    })
  );
});
