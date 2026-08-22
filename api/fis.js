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

// Model adları zamanla değişir — sırayla denenir, ilk çalışan kullanılır
const MODELLER = ["claude-sonnet-4-6", "claude-sonnet-5", "claude-haiku-4-5-20251001"];
const MAX_BAYT = 5 * 1024 * 1024; // 5 MB'lık fotoğraf sınırı

// Görsel okuma metinden yavaştır — varsayılan süre sınırı yetmeyebilir
export const config = { maxDuration: 60 };

const SISTEM = `Sen bir fiş/fatura okuyucusun. Sana Türkiye'den bir market, hırdavatçı,
akaryakıt veya yapı marketi fişinin fotoğrafı verilecek.

SADECE şu JSON'u döndür, başka hiçbir şey yazma, markdown kod bloğu da kullanma:
{"tutar":sayı,"nakit":sayı,"para_ustu":sayı,"kdv":sayı,"tarih":"YYYY-AA-GG","satici":"metin","kategori":"metin","kalemler":[{"ad":"metin","tutar":sayı}],"guven":"yuksek|orta|dusuk"}

TUTAR KURALLARI — EN ÖNEMLİ KISIM:
- tutar: SADECE "TOPLAM" / "GENEL TOPLAM" yazan satırdaki değer.
- "NAKİT" = müşterinin uzattığı para. TUTAR DEĞİLDİR → "nakit" alanına yaz.
- "PARA ÜSTÜ" = geri verilen para. TUTAR DEĞİLDİR → "para_ustu" alanına yaz.
- "TOPKDV" / "KDV" = vergi. TUTAR DEĞİLDİR → "kdv" alanına yaz.
- Bu üç alanı GÖRÜYORSAN MUTLAKA doldur; sunucu bunlarla tutarı çapraz doğruluyor.
- Kart ödemesinde "KREDİ KARTI" satırı genelde TOPLAM'a eşittir, "nakit" alanına yaz.

SAYI OKUMA:
- Türkiye'de virgül ondalıktır: "*120,00" → 120.00 ; "1.234,56" → 1234.56
- Baştaki "*" para işaretidir, yok say. JSON'a nokta ondalıklı yaz.
- Rakamları BASAMAK BASAMAK oku. 120 ile 60, 8 ile 6, 0 ile 8 karışır.
- Emin değilsen null bırak. ASLA tahmin etme, ASLA hesap yapma — sadece GÖRDÜĞÜNÜ yaz.

DİĞER ALANLAR:
- tarih: fişin düzenlenme tarihi. Gelecek tarih asla verme. Okuyamazsan null.
- satici: mağaza adı, kısa. Ünvan/adres/vergi no ekleme. Okuyamazsan null.
  Yazarkasalar İ Ş Ç Ğ Ü Ö harflerini basamaz, yerine boşluk bırakır.
  Doğru Türkçesiyle kur: "zmir"→"İzmir", "e me"→"Çeşme", "Atat rk"→"Atatürk".
  İyi: "CarrefourSA Çeşme"   Kötü: "CARREFOURSA zmir e me Super ; CARREFOUR SABANCI"
- kategori: Malzeme, Yakıt, Yedek Parça, Kira, Personel, Diğer
- kalemler: en fazla 5 ürün, her biri {"ad","tutar"}. Okuyamazsan boş dizi.
- guven: görüntü net ve tutar kesinse "yuksek", kısmen okunuyorsa "orta",
  bulanık/eksik/fiş değilse "dusuk".
- Fotoğrafta fiş yoksa: tüm alanlar null, guven "dusuk".`;

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

    const govde = (model) => JSON.stringify({
      model,
      max_tokens: 900,
      temperature: 0,          // rakam okumada rastgelelik olmamalı
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
    });

    let y = null, sonHata = "";
    for (const model of MODELLER) {
      y = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": KEY,
          "anthropic-version": "2023-06-01",
        },
        body: govde(model),
      });
      if (y.ok) break;
      const metin = await y.text().catch(() => "");
      sonHata = y.status + " " + metin.slice(0, 120);
      console.error("fis.js model denendi:", model, sonHata);
      // Model adı sorunu değilse (kota, yetki, sunucu) tekrar denemenin anlamı yok
      if (y.status !== 404 && !/model/i.test(metin)) break;
      y = null;
    }

    if (!y || !y.ok) {
      return res.status(200).json({ hata: "servis", detay: sonHata.slice(0, 160), tutar: null, tarih: null });
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
    const sayi = (v) => { const n = Number(v); return isFinite(n) && n > 0 ? +n.toFixed(2) : null; };
    const yakin = (a, b) => a != null && b != null && Math.abs(a - b) <= 0.02;

    let tutar = sayi(veri.tutar);
    if (tutar != null && tutar > 10000000) tutar = null;

    // ÇAPRAZ DOĞRULAMA — fişin kendi aritmetiği modelin okumasından güvenilirdir.
    //   NAKİT − PARA ÜSTÜ = TOPLAM   ve   kalemler toplamı = TOPLAM
    // İki bağımsız kanıt buluşuyorsa ve okunan tutar farklıysa, kanıtı seç.
    const nakit = sayi(veri.nakit);
    const paraUstu = sayi(veri.para_ustu);
    const nakitFark = nakit != null && paraUstu != null && nakit > paraUstu
      ? +(nakit - paraUstu).toFixed(2) : null;

    const kalemDizi = Array.isArray(veri.kalemler) ? veri.kalemler : [];
    let kalemTop = null;
    const kalemTutarlar = kalemDizi.map((k) => sayi(k && k.tutar)).filter((v) => v != null);
    if (kalemTutarlar.length) kalemTop = +kalemTutarlar.reduce((a, b) => a + b, 0).toFixed(2);

    const notlar = [];
    let guvenDuzelt = 0;

    if (yakin(tutar, nakitFark)) { guvenDuzelt += 2; notlar.push("nakit-uyustu"); }
    if (yakin(tutar, kalemTop))  { guvenDuzelt += 1; notlar.push("kalem-uyustu"); }

    if (nakitFark != null && kalemTop != null && yakin(nakitFark, kalemTop) && !yakin(tutar, nakitFark)) {
      notlar.push("duzeltildi " + tutar + " -> " + nakitFark);
      tutar = nakitFark; guvenDuzelt = 2;
    } else if (tutar == null && nakitFark != null) {
      tutar = nakitFark; guvenDuzelt = 1; notlar.push("nakit-farkindan-alindi");
    } else if (tutar != null && nakitFark != null && !yakin(tutar, nakitFark)) {
      guvenDuzelt -= 3; notlar.push("celiski toplam=" + tutar + " nakit-farki=" + nakitFark);
    }

    // Model NAKİT veya PARA ÜSTÜ'nü toplam sanmışsa düzelt
    if (nakitFark != null && (yakin(tutar, nakit) || yakin(tutar, paraUstu))) {
      notlar.push("odeme-satiri-toplam-sanilmis -> " + nakitFark);
      tutar = nakitFark; guvenDuzelt = 2;
    }

    if (tutar != null && (tutar <= 0 || tutar > 10000000)) tutar = null;

    let tarih = typeof veri.tarih === "string" ? veri.tarih.slice(0, 10) : null;
    if (tarih && !/^\d{4}-\d{2}-\d{2}$/.test(tarih)) tarih = null;
    if (tarih && (tarih > bugun || tarih < "2015-01-01")) tarih = null;

    const KATEGORILER = ["Malzeme", "Yakıt", "Yedek Parça", "Kira", "Personel", "Diğer"];
    const kategori = KATEGORILER.includes(veri.kategori) ? veri.kategori : null;

    // Nihai güven: modelin beyanı + aritmetik kanıt.
    // Kanıtsız bir tutar asla "yuksek" olamaz — istemci elle kontrol ister.
    let guvenSon = ["yuksek", "orta", "dusuk"].includes(veri.guven) ? veri.guven : "dusuk";
    if (tutar == null) guvenSon = "dusuk";
    else if (guvenDuzelt >= 2) guvenSon = "yuksek";
    else if (guvenDuzelt <= -1) guvenSon = "dusuk";
    else if (guvenSon === "yuksek" && guvenDuzelt === 0) guvenSon = "orta";

    return res.status(200).json({
      tutar,
      tarih,
      satici: typeof veri.satici === "string" ? veri.satici.slice(0, 60) : null,
      kategori,
      kalemler: kalemDizi
        .map((k) => (typeof k === "string" ? k : (k && typeof k.ad === "string" ? k.ad : null)))
        .filter(Boolean).slice(0, 5).map((k) => k.slice(0, 50)),
      guven: guvenSon,
      dogrulama: notlar,
    });
  } catch (e) {
    console.error("fis.js:", e);
    return res.status(200).json({ hata: "sunucu", detay: String((e && e.message) || e).slice(0, 160), tutar: null, tarih: null });
  }
}
