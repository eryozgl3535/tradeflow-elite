// ─────────────────────────────────────────────────────────────
// TRADEFLOW AI ASİSTAN — Vercel Serverless Function
// Konum: /api/asistan.js
//
// Kurulum: Vercel → Settings → Environment Variables →
//   ANTHROPIC_API_KEY = (console.anthropic.com'dan alınan anahtar)
// Anahtar eklenmemişse uygulama otomatik olarak kural tabanlı
// asistana düşer — hiçbir şey kırılmaz.
// ─────────────────────────────────────────────────────────────

const MODEL = "claude-sonnet-4-6"; // Daha ucuz istersen: "claude-haiku-4-5-20251001"

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ hata: "yontem" });

  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) return res.status(501).json({ hata: "anahtar-yok" });

  try {
    const { mesajlar = [], ozet = "", dil = "tr" } = req.body || {};

    // Güvenlik sınırları
    const temiz = mesajlar
      .slice(-16)
      .filter((m) => m && typeof m.metin === "string")
      .map((m) => ({
        role: m.rol === "user" ? "user" : "assistant",
        content: String(m.metin).slice(0, 2000),
      }));
    if (temiz.length === 0 || temiz[temiz.length - 1].role !== "user")
      return res.status(400).json({ hata: "mesaj-yok" });

    const sistem =
      (dil === "tr"
        ? `Sen TradeFlow Elite uygulamasının yapay zekâ asistanısın. TradeFlow, esnaf ve teknik servisler (tesisatçı, havuzcu, elektrikçi vb.) için iş, müşteri, teklif, fatura ve tahsilat yönetim uygulamasıdır.

GÖREVLERİN:
- Kullanıcının işletme verilerine bakarak sorularını yanıtla (aşağıda özet var)
- Uygulamanın kullanımını öğret: Yeni iş "+ Yeni İş" butonuyla eklenir; teklifler Teklifler sekmesinden PDF olarak hazırlanıp WhatsApp'la gönderilir; faturalar Faturalar sekmesinden kesilir; tahsilatlar Tahsilatlar sekmesinde takip edilir; PDF raporlar "Daha Fazla" menüsündedir; müşteri raporu müşteri detayındaki PDF butonundadır; tema ve plan ayarları Profil'dedir
- İşletme koçluğu yap: bekleyen tahsilatları hatırlat, kârlılık yorumu yap, pratik esnaf tavsiyeleri ver

KURALLAR:
- Türkçe, samimi ama profesyonel konuş; kısa ve net yanıt ver
- Rakamları verilen özetten kullan, asla uydurma
- Özette olmayan bir bilgi sorulursa dürüstçe bilmediğini söyle ve ilgili sekmeye yönlendir
- Muhasebe/vergi konularında genel bilgi ver, "kesin bilgi için mali müşavirinize danışın" notunu ekle`
        : `You are the AI assistant of TradeFlow Elite, a job/customer/invoice/collection management app for tradespeople. Answer using the business data summary below, teach app usage, give practical business coaching. Be concise. Never invent numbers.`) +
      "\n\nKULLANICININ İŞLETME ÖZETİ:\n" +
      String(ozet).slice(0, 6000);

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1024,
        system: sistem,
        messages: temiz,
      }),
    });

    if (!r.ok) {
      const detay = await r.text();
      return res.status(502).json({ hata: "api", detay: detay.slice(0, 300) });
    }
    const data = await r.json();
    const metin = (data.content || [])
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();
    return res.status(200).json({ cevap: metin || "…" });
  } catch (e) {
    return res.status(500).json({ hata: "sunucu" });
  }
}
