// ═══════════════════════════════════════════════════════════════
// 💱 CANLI PİYASA — SANİYELİK
// Birincil kaynak : Binance WebSocket (USDTTRY / EURTRY / XAUTUSDT)
//                   → saniyede birkaç kez tik, gerçek anlık kur
// Yedek kaynak    : /api/kur (REST, 20 sn'de bir) — WS kapalıysa devreye girer
// GBP her zaman REST'ten gelir (Binance'te TRY paritesi yok).
// Son değerler cihazda saklanır — internet yoksa onlar gösterilir.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";

const ANAHTAR = "tf_piyasa";
const ONS_GRAM = 31.1034768;
const REST_MS = 20000;      // yedek kaynak yenileme
const YAZ_MS = 10000;       // localStorage'a en fazla 10 sn'de bir yaz
const WS_URL =
  "wss://stream.binance.com:9443/stream?streams=usdttry@miniTicker/eurtry@miniTicker/xautusdt@miniTicker";

function yerelOku() {
  try { const d = JSON.parse(localStorage.getItem(ANAHTAR) || "null"); return d && d.veri ? d : null; } catch { return null; }
}
function yerelYaz(veri) {
  try { localStorage.setItem(ANAHTAR, JSON.stringify({ veri, zaman: Date.now() })); } catch {}
}
const bicim = (n) => n == null ? "—" :
  new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
const yuvarla = (n, b = 10000) => Math.round(n * b) / b;

export function usePiyasa() {
  const kayit = yerelOku();
  const [veri, setVeri] = useState(kayit ? kayit.veri : null);
  const [onceki, setOnceki] = useState(null);
  const [zaman, setZaman] = useState(kayit ? kayit.zaman : null);
  const [canli, setCanli] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(!kayit);
  const [cevrimdisi, setCevrimdisi] = useState(false);

  const sonRef = useRef(kayit ? kayit.veri : null);           // en güncel birleşik veri
  const hamRef = useRef({ usd: null, eur: null, xau: null }); // WS ham fiyatları
  const canliRef = useRef(false);
  const wsRef = useRef(null);
  const kapaliRef = useRef(false);
  const yazZamanRef = useRef(0);
  const tekrarRef = useRef(null);

  // Gelen değerleri birleştirip state'e uygula
  const uygula = (yeni) => {
    if (!yeni || Object.keys(yeni).length === 0) return;
    const eski = sonRef.current;
    const birlesik = Object.assign({}, eski || {}, yeni);
    sonRef.current = birlesik;
    setOnceki(eski);
    setVeri(birlesik);
    setZaman(Date.now());
    setYukleniyor(false);
    setCevrimdisi(false);
    if (Date.now() - yazZamanRef.current > YAZ_MS) {
      yazZamanRef.current = Date.now();
      yerelYaz(birlesik);
    }
  };

  // ─── Yedek kaynak: /api/kur ───
  const restCek = async () => {
    try {
      const r = await fetch("/api/kur", { cache: "no-store" });
      if (!r.ok) throw new Error("kur alinamadi");
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      const yeni = {};
      if (d.GBP != null) yeni.GBP = d.GBP;
      // WS canlıysa USD/EUR/Altın'a dokunma — REST daha yavaş ve daha eski
      if (!canliRef.current) {
        if (d.USD != null) yeni.USD = d.USD;
        if (d.EUR != null) yeni.EUR = d.EUR;
        if (d.gramAltin != null) yeni.gramAltin = d.gramAltin;
      }
      uygula(yeni);
    } catch {
      if (!canliRef.current) setCevrimdisi(true);
      setYukleniyor(false);
    }
  };

  // ─── Birincil kaynak: Binance WebSocket ───
  const wsBaslat = () => {
    if (kapaliRef.current) return;
    if (typeof WebSocket === "undefined") return;
    try {
      if (wsRef.current) { try { wsRef.current.close(); } catch {} }
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onmessage = (ev) => {
        try {
          const m = JSON.parse(ev.data);
          const d = m.data || m;
          const s = String(d.s || "").toUpperCase();
          const f = parseFloat(d.c);
          if (!f || !isFinite(f)) return;

          const h = hamRef.current;
          if (s === "USDTTRY") h.usd = f;
          else if (s === "EURTRY") h.eur = f;
          else if (s === "XAUTUSDT") h.xau = f;
          else return;

          if (!canliRef.current) { canliRef.current = true; setCanli(true); }

          const yeni = {};
          if (h.usd) yeni.USD = yuvarla(h.usd);
          if (h.eur) yeni.EUR = yuvarla(h.eur);
          if (h.usd && h.xau) yeni.gramAltin = Math.round((h.xau * h.usd / ONS_GRAM) * 100) / 100;
          uygula(yeni);
        } catch {}
      };

      ws.onerror = () => { canliRef.current = false; setCanli(false); };
      ws.onclose = () => {
        canliRef.current = false;
        setCanli(false);
        if (kapaliRef.current) return;
        clearTimeout(tekrarRef.current);
        tekrarRef.current = setTimeout(wsBaslat, 4000); // otomatik yeniden bağlan
      };
    } catch {
      canliRef.current = false;
      setCanli(false);
    }
  };

  useEffect(() => {
    kapaliRef.current = false;
    restCek();                 // GBP + ilk değerler
    wsBaslat();                // saniyelik akış

    const t = setInterval(restCek, REST_MS);
    const gorunur = () => {
      if (document.visibilityState === "visible") {
        restCek();
        if (!wsRef.current || wsRef.current.readyState > 1) wsBaslat();
      }
    };
    document.addEventListener("visibilitychange", gorunur);

    return () => {
      kapaliRef.current = true;
      clearInterval(t);
      clearTimeout(tekrarRef.current);
      document.removeEventListener("visibilitychange", gorunur);
      if (wsRef.current) { try { wsRef.current.close(); } catch {} }
      if (sonRef.current) yerelYaz(sonRef.current);
    };
    // eslint-disable-next-line
  }, []);

  return { veri, onceki, zaman, canli, yukleniyor, cevrimdisi, yenile: () => { restCek(); wsBaslat(); } };
}

// ─── Piyasa şeridi ───
export function PiyasaSeridi({ C, P, masaustu = false, T = {} }) {
  const { veri, onceki, zaman, canli, yukleniyor, cevrimdisi, yenile } = usePiyasa();
  const [vurgu, setVurgu] = useState({});   // { USD:"yukari", ... } — kısa süreli renk
  const zamanlayici = useRef({});

  // Değer değişince ~1.2 sn boyunca yeşil/kırmızı vurgu
  useEffect(() => {
    if (!veri || !onceki) return;
    const yeniVurgu = {};
    ["USD", "EUR", "GBP", "gramAltin"].forEach((k) => {
      const y = veri[k], e = onceki[k];
      if (y == null || e == null) return;
      const fark = y - e;
      if (Math.abs(fark) < 0.0001) return;
      yeniVurgu[k] = fark > 0 ? "yukari" : "asagi";
    });
    if (Object.keys(yeniVurgu).length === 0) return;
    setVurgu((v) => Object.assign({}, v, yeniVurgu));
    Object.keys(yeniVurgu).forEach((k) => {
      clearTimeout(zamanlayici.current[k]);
      zamanlayici.current[k] = setTimeout(() => {
        setVurgu((v) => { const n = Object.assign({}, v); delete n[k]; return n; });
      }, 1200);
    });
  }, [veri, onceki]);

  useEffect(() => () => Object.values(zamanlayici.current).forEach(clearTimeout), []);

  const kalemler = [
    { kod: "USD", ad: "USD", sembol: "$", deger: veri && veri.USD, renk: "#2563EB" },
    { kod: "EUR", ad: "EUR", sembol: "€", deger: veri && veri.EUR, renk: "#7C3AED" },
    { kod: "GBP", ad: "GBP", sembol: "£", deger: veri && veri.GBP, renk: "#0E9F6E" },
    { kod: "gramAltin", ad: "Gram Altın", sembol: "Au", deger: veri && veri.gramAltin, renk: "#D97706" },
  ].filter((k) => k.deger != null || yukleniyor);

  if (!yukleniyor && kalemler.length === 0) return null;

  const saat = zaman
    ? new Date(zaman).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  const durumRenk = cevrimdisi ? "#94A3B8" : canli ? "#0E9F6E" : "#D97706";
  const durumMetin = cevrimdisi
    ? (T.piyasaCevrimdisi || "çevrimdışı")
    : (saat || "");

  return <div style={{ padding: masaustu ? "6px 4px 0" : "2px 2px 0" }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%", background: durumRenk, display: "block",
          animation: canli ? "tfNabiz 1.1s ease-in-out infinite" : "none",
          boxShadow: cevrimdisi ? "none" : "0 0 0 3px " + durumRenk + "22",
        }} />
        <span style={{ fontSize: 13, fontWeight: 800, color: C.t1 }}>{T.piyasaCanli || "💱 Canlı Piyasa"}</span>
        {canli && <span style={{
          fontSize: 8.5, fontWeight: 900, letterSpacing: "0.1em", color: "#0E9F6E",
          background: "#0E9F6E18", border: "1px solid #0E9F6E33", borderRadius: 5, padding: "2px 5px",
        }}>CANLI</span>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: C.t3, fontVariantNumeric: "tabular-nums" }}>{durumMetin}</span>
        <button onClick={yenile} aria-label="Yenile" style={{ background: C.bg, border: "none", borderRadius: 8, cursor: "pointer", padding: 6, display: "flex", color: C.t3 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 11.5A8 8 0 1 0 18.4 16" /><path d="M20 5.5v6h-6" />
          </svg>
        </button>
      </div>
    </div>

    <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
      {yukleniyor && !veri
        ? <span style={{ fontSize: 11.5, color: C.t3, padding: "8px 0" }}>{T.piyasaYukleniyor || "Piyasa yükleniyor…"}</span>
        : kalemler.map((k) => {
          const y = vurgu[k.kod];
          const yonRenk = y === "yukari" ? "#0E9F6E" : y === "asagi" ? "#DC2626" : C.t1;
          return <div key={k.kod} style={{
            flex: "1 0 auto", minWidth: 90,
            background: y ? (y === "yukari" ? "#0E9F6E14" : "#DC262614") : k.renk + "12",
            border: "1px solid " + (y ? (y === "yukari" ? "#0E9F6E30" : "#DC262630") : k.renk + "28"),
            borderRadius: 13, padding: "9px 11px", transition: "background 0.45s, border-color 0.45s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <div style={{ width: 19, height: 19, borderRadius: "50%", background: k.renk, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#fff" }}>{k.sembol}</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: k.renk, whiteSpace: "nowrap" }}>{k.ad}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: yonRenk, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", transition: "color 0.45s" }}>{bicim(k.deger)}</span>
              {y && <span style={{ fontSize: 9.5, fontWeight: 800, color: yonRenk }}>{y === "yukari" ? "▲" : "▼"}</span>}
            </div>
          </div>;
        })}
    </div>
    <style>{"@keyframes tfNabiz{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.45;transform:scale(.8)}}"}</style>
  </div>;
}
