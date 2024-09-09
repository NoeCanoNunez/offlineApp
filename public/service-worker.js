const CACHE_NAME = 'offline-cache-v1';
const urlsToCache = [
  '/',
  '/*',
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
  '/static',
  '/icons/*',
  '/static/*',


  // Agrega más archivos que quieres que estén disponibles offline
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  // Solo manejar solicitudes GET
  if (event.request.method === 'GET') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Si la respuesta es válida, la clonamos y la guardamos en el caché
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }
          return response;
        })
        .catch(() => {
          // Si falla el fetch (no hay internet), buscamos en el caché
          return caches.match(event.request);
        })
    );
  }
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento para manejar la actualización de la aplicación
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});


// const CACHE_NAME = 'offline-cache-v1';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/static/js/bundle.js',
//   '/static/js/main.js',
//   '/static/js/0.chunk.js',
//   '/static/js/1.chunk.js',
//   '/static/css/main.css',
//   '/manifest.json',
//   '/logo192.png',
//   '/logo512.png',
//   // Agrega más archivos específicos, evita patrones como /* o /static/*
// ];

// // Instalar el Service Worker y almacenar archivos en caché
// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(urlsToCache);
//     })
//   );
// });

// // Interceptar solicitudes y responder con caché o red
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then(async (cachedResponse) => {
//       // Si encontramos la respuesta en caché, la devolvemos
//       if (cachedResponse) {
//         return cachedResponse;
//       }

//       // Si no está en caché, realizamos la solicitud de red
//       try {
//         const networkResponse = await fetch(event.request);

//         // Clonamos la respuesta de la red antes de usarla
//         const responseClone = networkResponse.clone();

//         // Abrimos la caché y guardamos la respuesta clonada
//         const cache = await caches.open(CACHE_NAME);
//         cache.put(event.request, responseClone);

//         // Devolvemos la respuesta original de la red
//         return networkResponse;
//       } catch (error) {
//         // Manejo de errores si la red no está disponible
//         console.error('Fetch failed; returning offline page instead.', error);
//         throw error; // O devolver algún fallback si es necesario
//       }
//     })
//   );
// });
