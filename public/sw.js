// TradeFlow Elite — Service Worker v7
// Strateji:
//  • index.html / sw.js / manifest → HİÇ önbelleğe alınmaz (hep ağdan)
//  • /assets/* (hash'li js-css) → kalıcı önbellek (dosya adı değişince zaten yenilenir)
//  • diğerleri → önbellek + arka planda tazeleme
const CACHE = "tradeflow-v7";
const CEVRIMDISI = "/index.html";

// Asla önbelleğe alınmayacak yollar
const ASLA = ["/sw.js", "/manifest.json", "/index.html", "/"];

self.addEventListener("install", (e) => {
  // Çevrimdışı yedek için index'i bir kez al ama "no-store" ile taze çek
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      fetch(CEVRIMDISI, { cache: "no-store" })
        .then((r) => (r && r.ok ? c.put(CEVRIMDISI, r.clone()) : null))
        .catch(() => null)
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // Supabase / API istekleri SW'ye takılmasın

  // 1) Sayfa açılışı → HER ZAMAN ağdan, önbelleğe yazma
  if (e.request.mode === "navigate") {
    e.respondWith(
      fetch(e.request, { cache: "no-store" })
        .then((res) => {
          // Çevrimdışı yedeği sessizce tazele
          if (res && res.ok) {
            const kopya = res.clone();
            caches.open(CACHE).then((c) => c.put(CEVRIMDISI, kopya)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(CEVRIMDISI))
    );
    return;
  }

  // 2) Kritik dosyalar → hep ağdan, önbelleğe alma
  if (ASLA.some((y) => url.pathname === y)) {
    e.respondWith(fetch(e.request, { cache: "no-store" }).catch(() => caches.match(e.request)));
    return;
  }

  // 3) /assets/* → hash'li dosyalar, önbellek öncelikli (güvenli)
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(e.request).then(
        (cached) =>
          cached ||
          fetch(e.request).then((res) => {
            if (res && res.ok) {
              const kopya = res.clone();
              caches.open(CACHE).then((c) => c.put(e.request, kopya)).catch(() => {});
            }
            return res;
          })
      )
    );
    return;
  }

  // 4) Diğerleri → önbellek + arka planda tazeleme
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const agdan = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const kopya = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, kopya)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || agdan;
    })
  );
});
