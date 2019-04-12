const cacheName = 'my-cache';
const offlinePage = '/offline.html';
const filesList = [
  offlinePage
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    cache.open(cacheName)
      // Add your file to cache
      .then( (cache) => {
        return cache.addAll(filesList);
      })
      // Tell SW to end 'waiting' state
      .then(() => self.skipWaiting())
  );
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    // Tell browser to use this service worker and not outdated one
    self.clients.claim()
  );
})

self.addEventListener('fetch', (event) => {
  // If we don't have internet connection and it's a navigation request
  if (!navigator.onLine && event.request.mode === 'navigate') {
    event.respondWith( () => {
      return cache.open(cacheName)
        .then( (cache) => {
          // If we find our offline page in cache, respond with it
          return cache.match(offlinePage)
            .then( (response) => response);
        });
    })
  } else {
    // Return null let browser do his normal behavior
    return;
  }
})
