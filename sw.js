const CACHE_VERSION = "storiesociali-v20260503";
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/styles.css",
  "/app.js",
  "/manifest.json",
  "/favicon.ico",
  "/assets/logo-storiesociali.svg",
  "/assets/og-storie-sociali.png",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/icon-192-maskable.png",
  "/assets/icon-512-maskable.png",
  "/assets/favicon-64.png",
  "/chi-siamo/",
  "/privacy/",
  "/cookie/",
  "/note-legali/"
];

const CRITICAL_ASSETS = CORE_ASSETS.filter((asset) => !asset.endsWith(".ttf"));
const OPTIONAL_ASSETS = [
  "/assets/fonts/lora-regular.ttf",
  "/assets/fonts/open-dyslexic-regular.woff2",
  "/assets/fonts/open-dyslexic-regular.woff",
  "/assets/fonts/open-dyslexic-bold.woff2",
  "/assets/fonts/open-dyslexic-bold.woff"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then((cache) =>
        Promise.all([
          cache.addAll(CRITICAL_ASSETS),
          Promise.allSettled(
            OPTIONAL_ASSETS.map((asset) =>
              cache.add(asset).catch((error) => {
                console.warn("[SW] Font opzionale non cachato:", asset, error);
              })
            )
          )
        ])
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CORE_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request));
    return;
  }

  event.respondWith(staleWhileRevalidateAsset(request));
});

async function networkFirstPage(request) {
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      runtimeCache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cachedPage = await runtimeCache.match(request, { ignoreSearch: true });
    if (cachedPage) {
      return cachedPage;
    }

    const coreCache = await caches.open(CORE_CACHE);
    const cachedHome = (await coreCache.match("/")) || (await coreCache.match("/index.html"));
    if (cachedHome) {
      return cachedHome;
    }

    return new Response(
      "<!doctype html><html lang=\"it\"><head><meta charset=\"utf-8\"><title>Offline</title></head><body><p>Sei offline. Riprova quando torna la connessione.</p></body></html>",
      {
        status: 503,
        headers: { "Content-Type": "text/html; charset=UTF-8" }
      }
    );
  }
}

async function staleWhileRevalidateAsset(request) {
  const cacheKey = normalizeCacheKey(request);
  const coreCache = await caches.open(CORE_CACHE);
  const runtimeCache = await caches.open(RUNTIME_CACHE);

  const cached = (await coreCache.match(cacheKey)) || (await runtimeCache.match(cacheKey));
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        const targetCache = CORE_ASSETS.includes(cacheKey) ? coreCache : runtimeCache;
        targetCache.put(cacheKey, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  return new Response("", { status: 503, statusText: "Offline" });
}

function normalizeCacheKey(request) {
  const requestUrl = new URL(request.url);
  if (requestUrl.searchParams.has("v")) {
    return `${requestUrl.pathname}?v=${requestUrl.searchParams.get("v")}`;
  }
  return requestUrl.pathname;
}
