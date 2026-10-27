/* Offline support. The two placeholders below are filled in at build time
   (see vite.config.js): the version changes whenever any file changes, and
   PRECACHE lists every file of the app so it can be opened without internet. */
const VERSION = '__VERSION__';
const PRECACHE = /*__PRECACHE__*/[];
const CACHE = `takvim-${VERSION}`;

self.addEventListener('install', (event) => {
    // The new version waits until the visitor taps "Rifresko" (or the old one is closed).
    event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.startsWith('takvim-') && k !== CACHE).map((k) => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return; // aladhan / nominatim go straight to the network

    if (request.mode === 'navigate') {
        event.respondWith(openPage(request));
    } else {
        event.respondWith(fromCacheFirst(request));
    }
});

// Page: use the network when it answers quickly, otherwise the saved copy.
async function openPage(request) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
        const response = await fetch(request, {signal: controller.signal});
        clearTimeout(timer);
        return response;
    } catch {
        clearTimeout(timer);
        const cache = await caches.open(CACHE);
        return (await cache.match('/index.html')) || Response.error();
    }
}

// Files (hashed names never change): saved copy first.
async function fromCacheFirst(request) {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(request);
    if (hit) return hit;
    try {
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
    } catch {
        return Response.error();
    }
}
