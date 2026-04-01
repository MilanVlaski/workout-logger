const CACHE_NAME = 'workout-logger-v3'
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
