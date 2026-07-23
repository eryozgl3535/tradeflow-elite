// TradeFlow Elite — Service Worker v3 (güçlendirilmiş çevrimdışı)
const CACHE = "tradeflow-v4";
const CORE = ["/", "/index.html", "/manifest.json"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // Supabase/AI istekleri SW'ye takılmasın

  // Sayfa açılışları: AĞ öncelikli (hep güncel sürüm) → çevrimdışıysa önbellek
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const kopya = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, kopya));
          }
          return res;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match("/")))
    );
    return;
  }

  // Diğer dosyalar: önbellek öncelikli + arka planda tazele
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const agdan = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const kopya = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, kopya));
          }
          return res;
        })
        .catch(() => cached);
      return cached || agdan;
    })
  );
});
