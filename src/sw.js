const CACHE_NAME = 'workout-logger-v1'
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/oat.min.css',
  '/assets/css/common.css',
  '/assets/css/workout.css',
  '/assets/js/oat.min.js',
  '/assets/js/index.js',
  '/assets/js/core.js',
  '/assets/js/db.js',
  '/assets/js/main.js',
  '/assets/js/test_fixture.js',
  '/assets/js/components/close-btn.js',
  '/assets/js/components/all-reps.js',
  '/assets/js/components/exercise-input.js',
  '/assets/js/components/workout-start-time.js',
  '/assets/js/components/exercise-inputs.js',
  '/assets/js/components/the-exercise.js',
  '/assets/js/components/modify-workout.js',
  '/icon-192.png',
  '/icon-512.png',
  // CDN imports for Lit
  'https://esm.sh/lit@3.3.2',
  'https://esm.sh/lit@3.3.2/decorators.js'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Installing and caching assets')
        return cache.addAll(ASSETS_TO_CACHE)
      })
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  // For navigation requests, use network-first to ensure fresh content
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Return network response if successful
          if (response.ok) return response
          // If network fails, try cache
          return caches.match('/index.html')
        })
        .catch(() => {
          // Network failed, serve from cache
          return caches.match('/index.html')
        })
    )
    return
  }

  // For all other requests (CSS, JS, images), use cache-first with network fallback
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version immediately
          return cachedResponse
        }
        // Not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Optionally cache the new resource
            // Only cache same-origin requests
            if (event.request.url.startsWith(self.location.origin)) {
              const responseClone = response.clone()
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone)
              })
            }
            return response
          })
      })
  )
})
