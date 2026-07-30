// ─────────────────────────────────────────────────────────────
// CANLI PİYASA KURU + ALTIN — Vercel Serverless Function
//
// Öncelik: SERBEST PİYASA (anlık, gün içi değişir)
// Yedek  : TCMB resmî kuru (günde 1 kez, ~15:30)
//
// Gram altın = ons altın (XAU/USD) × USD/TRY ÷ 31.1035
// Altın kaynağına ulaşılamazsa sadece dövizler döner.
// ─────────────────────────────────────────────────────────────

const ONS_GRAM = 31.1034768;
const yuvarla = (n) => Math.round(n * 10000) / 10000;

// 1) Serbest piyasa — anlık kur
async function piyasaKuru() {
  // a) open.er-api (ücretsiz, sık güncellenir)
  try {
    const r = await fetch("https://open.er-api.com/v6/latest/TRY");
    if (r.ok) {
      const d = await r.json();
      const rt = d && d.rates;
      if (rt && rt.USD) {
        return {
          kaynak: "PİYASA",
          USD: yuvarla(1 / rt.USD),
          EUR: rt.EUR ? yuvarla(1 / rt.EUR) : null,
          GBP: rt.GBP ? yuvarla(1 / rt.GBP) : null,
          guncelleme: d.time_last_update_utc || null,
        };
      }
    }
  } catch {}
  // b) frankfurter yedek
  try {
    const r = await fetch("https://api.frankfurter.app/latest?from=USD&to=TRY");
    const r2 = await fetch("https://api.frankfurter.app/latest?from=EUR&to=TRY");
    const r3 = await fetch("https://api.frankfurter.app/latest?from=GBP&to=TRY");
    if (r.ok) {
      const d = await r.json();
      const d2 = r2.ok ? await r2.json() : null;
      const d3 = r3.ok ? await r3.json() : null;
      if (d && d.rates && d.rates.TRY) {
        return {
          kaynak: "PİYASA",
          USD: yuvarla(d.rates.TRY),
          EUR: d2 && d2.rates ? yuvarla(d2.rates.TRY) : null,
          GBP: d3 && d3.rates ? yuvarla(d3.rates.TRY) : null,
        };
      }
    }
  } catch {}
  return null;
}

// 2) TCMB resmî kur — yedek
async function tcmbKuru() {
  const r = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
    headers: { "User-Agent": "TradeFlowElite/1.0" },
  });
  const xml = await r.text();
  const al = (kod) => {
    const m = xml.match(
      new RegExp('CurrencyCode="' + kod + '"[\\s\\S]*?<ForexSelling>([\\d.]+)</ForexSelling>')
    );
    return m ? parseFloat(m[1]) : null;
  };
  const t = xml.match(/Tarih="([^"]+)"/);
  const USD = al("USD"), EUR = al("EUR"), GBP = al("GBP");
  if (!USD) throw new Error("TCMB parse edilemedi");
  return { kaynak: "TCMB", tarih: t ? t[1] : null, USD, EUR, GBP };
}

// 3) Ons altın
async function onsAltin() {
  try {
    const r = await fetch("https://api.gold-api.com/price/XAU");
    if (r.ok) {
      const d = await r.json();
      const p = Number(d.price);
      if (p > 500 && p < 20000) return p;
    }
  } catch {}
  try {
    const r = await fetch("https://api.metals.dev/v1/latest?api_key=demo&currency=USD&unit=toz");
    if (r.ok) {
      const d = await r.json();
      const p = Number(d && d.metals && d.metals.gold);
      if (p > 500 && p < 20000) return p;
    }
  } catch {}
  return null;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    let kur = await piyasaKuru();
    if (!kur) kur = await tcmbKuru();

    let gramAltin = null, onsUsd = null;
    try {
      onsUsd = await onsAltin();
      if (onsUsd && kur.USD) {
        gramAltin = Math.round(((onsUsd * kur.USD) / ONS_GRAM) * 100) / 100;
      }
    } catch {}

    // Canlı kur olduğu için kısa cache: 5 dk
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800");
    return res.status(200).json(Object.assign({}, kur, { gramAltin, onsUsd, cekim: Date.now() }));
  } catch {
    return res.status(502).json({ error: "Kur alınamadı" });
  }
}
