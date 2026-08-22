const CACHE_NAME = "plastokast-cache-v5";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./products.html",
  "./product-detail.html",
  "./about.html",
  "./contact.html",
  "./assets/css/styles.css",
  "./assets/js/main.js",
  "./assets/js/products-data.js",
  "./media/hero_casting_tapes.jpg",
  "./media/fiberglass_cast_blue.jpg",
  "./media/fiberglass_cast_green.jpg",
  "./media/fiberglass_cast_white.jpg",
  "./media/polyester_cast_blue.jpg",
  "./media/polyester_cast_red.jpg",
  "./media/orthopedic_splint_roll.jpg",
  "./media/orthopedic_splint_precut.jpg",
  "./media/pop_bandage_white.jpg",
  "./media/undercast_padding.jpg",
  "./media/tubular_stockinette.jpg",
  "./media/pk_cast_colored_pro.jpg",
  "./media/pk_cast_kit_pro.jpg",
  "./media/plastokast_house_pro.jpg"
];

// Install Event: cache core assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching all site assets");
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: clear old caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Clearing old cache: ", key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: network-first for HTML, stale-while-revalidate for others
self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith("http")) return;

  const isHtml = e.request.url.includes(".html") || e.request.url.endsWith("/") || !e.request.url.split("/").pop().includes(".");

  if (isHtml) {
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(e.request);
      })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkResponse));
            }
          }).catch(() => {});
          
          return cachedResponse;
        }
        
        return fetch(e.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  }
});
