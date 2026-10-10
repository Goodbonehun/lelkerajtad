// Lelke Rajtad - minimal service worker, csak a telepíthetőséghez és
// egy könnyű offline tartaléklapon kívül nem gyorsítótáraz semmit.
const CACHE_NAME = "lelkerajtad-shell-v2";
const SHELL_URL = "index.html";
const CONTENT_URL = "data/content.json";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([SHELL_URL, CONTENT_URL]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then((cached) => cached || caches.match(SHELL_URL))
    )
  );
});
