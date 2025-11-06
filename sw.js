const CACHE_NAME = 'protocol-tracker-cache-v2'; // increment on update
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  // icons etc
];

// Install
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)).then(()=>self.skipWaiting()));
});

// Activate
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});

// Fetch
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then(c => c||fetch(e.request)));
});

// Message
self.addEventListener('message', e => {
  if(e.data?.type==='SKIP_WAITING') self.skipWaiting();
});
