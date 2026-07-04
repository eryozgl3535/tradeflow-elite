// ─────────────────────────────────────────────────────────────
// TCMB KUR PROXY — Vercel Serverless Function
// Akşam Vercel kurulumunda bu dosyayı projenin  /api/kur.js
// konumuna koy. Uygulama otomatik olarak bunu kullanacak.
//
// Ne yapar: TCMB'nin resmî günlük kur XML'ini sunucudan çeker
// (CORS sorunu olmadan) ve uygulamaya temiz JSON döner.
// TCMB kurları her iş günü ~15:30'da güncellenir.
// ─────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  try {
    const r = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      headers: { "User-Agent": "TradeFlowElite/1.0" },
    });
    const xml = await r.text();

    const usdM = xml.match(/CurrencyCode="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const eurM = xml.match(/CurrencyCode="EUR"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
    const tarihM = xml.match(/Tarih="([^"]+)"/);

    if (!usdM || !eurM) throw new Error("TCMB XML parse edilemedi");

    // 30 dk cache — TCMB günde 1 kez güncellendiği için fazlası gereksiz
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.status(200).json({
      kaynak: "TCMB",
      tarih: tarihM ? tarihM[1] : null,
      USD: parseFloat(usdM[1]),   // Döviz Satış
      EUR: parseFloat(eurM[1]),   // Döviz Satış
    });
  } catch (e) {
    // TCMB'ye ulaşılamazsa (hafta sonu ilk yayın öncesi vb.) piyasa kuruna düş
    try {
      const r = await fetch("https://open.er-api.com/v6/latest/TRY");
      const d = await r.json();
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.status(200).json({
        kaynak: "PIYASA",
        USD: Math.round((1 / d.rates.USD) * 100) / 100,
        EUR: Math.round((1 / d.rates.EUR) * 100) / 100,
      });
    } catch {
      return res.status(502).json({ error: "Kur alınamadı" });
    }
  }
}
