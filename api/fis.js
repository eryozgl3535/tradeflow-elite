// ─────────────────────────────────────────────────────────────
// FİŞ OKUYUCU — Vercel Serverless Function
// Konum: /api/fis.js
//
// Market/hırdavat fişinin fotoğrafını alır, tutar–tarih–satıcı
// bilgisini çıkarıp JSON döner. api/asistan.js ile aynı anahtarı
// kullanır: Vercel → Settings → Environment Variables →
//   ANTHROPIC_API_KEY
// Anahtar yoksa 501 döner, uygulama sessizce elle girişe düşer.
// ─────────────────────────────────────────────────────────────

const MODEL = "claude-sonnet-4-6";
const MAX_BAYT = 5 * 1024 * 1024; // 5 MB'lık fotoğraf sınırı

// Görsel okuma metinden yavaştır — varsayılan süre sınırı yetmeyebilir
export const config = { maxDuration: 60 };

const SISTEM = `Sen bir fiş/fatura okuyucusun. Sana Türkiye'den bir market, hırdavatçı,
akaryakıt veya yapı marketi fişinin fotoğrafı verilecek.

SADECE şu JSON'u döndür, başka hiçbir şey yazma, markdown kod bloğu da kullanma:
{"tutar":sayı,"tarih":"YYYY-AA-GG","satici":"metin","kategori":"metin","kalemler":["metin"],"guven":"yuksek|orta|dusuk"}

KURALLAR:
- tutar: fişin GENEL TOPLAM / TOPLAM tutarı, sadece sayı (ondalık nokta ile, örn 1450.75).
  KDV satırını değil, ödenen son tutarı al. Okuyamazsan null.
- tarih: fişin üzerindeki düzenlenme tarihi. Okuyamazsan null. Gelecekteki bir tarih asla verme.
- satici: mağaza/firma adı, kısa. Okuyamazsan null.
- kategori: şu listeden en uygunu — Malzeme, Yakıt, Yedek Parça, Kira, Personel, Diğer
- kalemler: fişteki en fazla 5 ana ürün adı. Okuyamazsan boş dizi.
- guven: görüntü net ve tutar kesinse "yuksek", kısmen okunuyorsa "orta",
  bulanık/eksik/fiş değilse "dusuk".
- Fotoğrafta fiş yoksa: tüm alanlar null, guven "dusuk".
- Emin olmadığın bir sayıyı ASLA uydurma, null bırak.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ hata: "yontem" });

  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) return res.status(200).json({ hata: "anahtar-yok", tutar: null, tarih: null });

  try {
    const { gorsel = "", tur = "image/jpeg" } = req.body || {};
    if (!gorsel || typeof gorsel !== "string")
      return res.status(400).json({ hata: "gorsel-yok" });
    if (gorsel.length * 0.75 > MAX_BAYT)
      return res.status(413).json({ hata: "cok-buyuk" });
    if (!/^image\/(jpeg|png|webp)$/.test(tur))
      return res.status(415).json({ hata: "tur-desteklenmiyor" });

    const y = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        system: SISTEM,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: tur, data: gorsel } },
              { type: "text", text: "Bu fişi oku ve sadece JSON döndür." },
            ],
          },
        ],
      }),
    });

    if (!y.ok) {
      const metin = await y.text().catch(() => "");
      console.error("Anthropic hata:", y.status, metin.slice(0, 300));
      return res.status(200).json({ hata: "servis-" + y.status, detay: metin.slice(0, 160), tutar: null, tarih: null });
    }

    const d = await y.json();
    const ham = (d.content || [])
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("")
      .replace(/```json|```/g, "")
      .trim();

    let veri;
    try {
      veri = JSON.parse(ham);
    } catch {
      const m = ham.match(/\{[\s\S]*\}/);
      if (!m) return res.status(200).json({ hata: "cozumlenemedi", detay: ham.slice(0, 160), tutar: null, tarih: null });
      veri = JSON.parse(m[0]);
    }

    // ── Sunucu tarafı doğrulama: modelin dediğine körü körüne güvenme
    const bugun = new Date().toISOString().slice(0, 10);
    let tutar = Number(veri.tutar);
    if (!isFinite(tutar) || tutar <= 0 || tutar > 10000000) tutar = null;

    let tarih = typeof veri.tarih === "string" ? veri.tarih.slice(0, 10) : null;
    if (tarih && !/^\d{4}-\d{2}-\d{2}$/.test(tarih)) tarih = null;
    if (tarih && (tarih > bugun || tarih < "2015-01-01")) tarih = null;

    const KATEGORILER = ["Malzeme", "Yakıt", "Yedek Parça", "Kira", "Personel", "Diğer"];
    const kategori = KATEGORILER.includes(veri.kategori) ? veri.kategori : null;

    return res.status(200).json({
      tutar,
      tarih,
      satici: typeof veri.satici === "string" ? veri.satici.slice(0, 60) : null,
      kategori,
      kalemler: Array.isArray(veri.kalemler)
        ? veri.kalemler.filter((k) => typeof k === "string").slice(0, 5).map((k) => k.slice(0, 50))
        : [],
      guven: ["yuksek", "orta", "dusuk"].includes(veri.guven) ? veri.guven : "dusuk",
    });
  } catch (e) {
    console.error("fis.js:", e);
    return res.status(200).json({ hata: "sunucu", detay: String((e && e.message) || e).slice(0, 160), tutar: null, tarih: null });
  }
}
