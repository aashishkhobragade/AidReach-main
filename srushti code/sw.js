const CACHE_NAME = 'mediguardian-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/style.css',
    './js/app.js',
    './js/ai.js',
    './js/map.js',
    './manifest.json',
    'https://unpkg.com/@phosphor-icons/web',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;700;800&display=swap',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@2.1.1/dist/mobilenet.min.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Stale-while-revalidate strategy for most assets
    // For map tiles (openstreetmap) and tfjs models, we use cache-first if available.
    const url = new URL(event.request.url);

    if (url.hostname.includes('tile.openstreetmap.org') || url.hostname.includes('tfhub.dev') || url.hostname.includes('storage.googleapis.com')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response; // Return from cache
                }
                return fetch(event.request).then((networkResponse) => {
                    return caches.open('mediguardian-dynamic-v1').then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Cache hit - return response
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
        );
    }
});

self.addEventListener('activate', (event) => {
    const cacheWhiteList = [CACHE_NAME, 'mediguardian-dynamic-v1'];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhiteList.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
