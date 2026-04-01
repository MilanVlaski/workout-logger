const CACHE_NAME = 'workout-logger-v2'
const ASSETS = [
  './', './index.html', './manifest.json',
  './assets/css/oat.min.css', './assets/css/common.css', './assets/css/workout.css',
  './assets/js/oat.min.js', './assets/js/index.js', './assets/js/core.js',
  './assets/js/db.js', './assets/js/main.js', './assets/js/test_fixture.js',
  './assets/js/components/close-btn.js', './assets/js/components/all-reps.js',
  './assets/js/components/exercise-input.js', './assets/js/components/workout-start-time.js',
  './assets/js/components/exercise-inputs.js', './assets/js/components/the-exercise.js',
  './assets/js/components/modify-workout.js', './icon-192.png', './icon-512.png',
  'https://esm.sh/lit@3.3.2', 'https://esm.sh/lit@3.3.2/decorators.js'
]

self.addEventListener('install', (e) => {
  console.log('SW: Installing and caching assets')
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('SW: Deleting old cache:', key)
          return caches.delete(key)
        }
      })
    )).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (e) => {
  const { request } = e

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    )
    return
  }

  e.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log(`[SW] 📦 SERVING FROM CACHE ${cachedResponse.url}`)
        return cachedResponse
      }

      console.log(`[SW] 🌐 GOING TO NETWORK ${request.url}`)
      return fetch(request).then((response) => {
        if (response.ok && request.url.startsWith(self.location.origin) && response.method == 'GET') {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone))
        }
        return response
      })
    })
  )
})
