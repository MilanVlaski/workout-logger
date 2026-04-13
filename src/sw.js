const CACHE_NAME = 'workout-logger-v0.0.1'
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/common.css',
  './assets/css/workout.css',
  './assets/css/oat.min.css',
  './icon-192.png',
  './icon-512.png',
  './assets/vendor/oat.min.js',
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  )
})
