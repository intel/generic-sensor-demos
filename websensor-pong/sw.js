const CACHE_NAME = "websensor-pong";
const CACHE_VERSION = 1;

self.addEventListener('install', function(event) {
//Caching
  event.waitUntil(
    caches.open(CACHE_NAME + CACHE_VERSION.toString()).then(function(cache) {
      return cache.addAll([
        'index.html',
        'sw.js',
        'scripts/app.js',
        'scripts/three.min.js'
      ]);
    })
  );
});

this.addEventListener('fetch', function(event) {
//Retrieval from cache
        event.respondWith(caches.match(event.request).then(function(response) {
                if (response !== undefined) {       //Found match in cache
                        return response;
                } else {
                        return fetch(event.request).then(function (response) {
                //Response may be used only once so need to clone it for reuse
                let responseClone = response.clone();
                caches.open(CACHE_VERSION.toString()).then(function (cache) {
                        cache.put(event.request, responseClone);
                });
                return response;
                });
                }
        }));
});

