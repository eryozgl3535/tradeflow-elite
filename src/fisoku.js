// ─────────────────────────────────────────────────────────────
// FİŞ OKUMA — tamamen cihaz üzerinde, ücretsiz, anahtarsız
//
// Metni Tesseract (WASM) ile çıkarır, sonra Türk fişlerinin
// standart kalıplarına göre ayrıştırır. Fotoğraf telefondan
// çıkmaz, hiçbir sunucuya gitmez.
//
// Kullanım:  const d = await fisOkuYerel(dataUrl, (y)=>setYuzde(y));
//            → {tutar, tarih, satici, kalemler, guven, ham}
// ─────────────────────────────────────────────────────────────

const TESS_URL = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";

let tessYukleniyor = null;
function tesseractYukle() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tessYukleniyor) return tessYukleniyor;
  tessYukleniyor = new Promise((coz, red) => {
    const s = document.createElement("script");
    s.src = TESS_URL;
    s.async = true;
    s.onload = () => (window.Tesseract ? coz(window.Tesseract) : red(new Error("tesseract yüklenemedi")));
    s.onerror = () => red(new Error("tesseract indirilemedi"));
    document.head.appendChild(s);
  });
  return tessYukleniyor;
}

// ── Görüntü hazırlama: gri tona çevir, kontrastı aç, eşikle ──
// Termal fiş kağıdı soluk basar; ham fotoğrafta OCR çok yanılır.
function fisHazirla(dataUrl, hedefEn = 1500) {
  return new Promise((coz, red) => {
    const im = new Image();
    im.onerror = () => red(new Error("görsel açılamadı"));
    im.onload = () => {
      const o = Math.min(2.5, Math.max(1, hedefEn / im.width));
      const c = document.createElement("canvas");
      c.width = Math.round(im.width * o);
      c.height = Math.round(im.height * o);
      const x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(im, 0, 0, c.width, c.height);

      const d = x.getImageData(0, 0, c.width, c.height);
      const p = d.data;
      const n = c.width * c.height;

      // 1) gri ton + histogram
      const gri = new Uint8ClampedArray(n);
      const hist = new Uint32Array(256);
      for (let i = 0, k = 0; i < p.length; i += 4, k++) {
        const g = (p[i] * 0.299 + p[i + 1] * 0.587 + p[i + 2] * 0.114) | 0;
        gri[k] = g;
        hist[g]++;
      }

      // 2) Otsu eşiği — kağıt ile mürekkebi ayırır
      let toplam = 0;
      for (let i = 0; i < 256; i++) toplam += i * hist[i];
      let toplamB = 0, agirlikB = 0, enIyi = 0, esik = 128;
      for (let i = 0; i < 256; i++) {
        agirlikB += hist[i];
        if (!agirlikB) continue;
        const agirlikF = n - agirlikB;
        if (!agirlikF) break;
        toplamB += i * hist[i];
        const ortB = toplamB / agirlikB;
        const ortF = (toplam - toplamB) / agirlikF;
        const fark = agirlikB * agirlikF * (ortB - ortF) * (ortB - ortF);
        if (fark > enIyi) { enIyi = fark; esik = i; }
      }

      // 3) eşiğe yakın bölgeyi yumuşat — sert siyah/beyaz OCR'ı bozabiliyor
      const alt = esik - 28, ust = esik + 28;
      for (let i = 0, k = 0; i < p.length; i += 4, k++) {
        const g = gri[k];
        let v;
        if (g <= alt) v = 0;
        else if (g >= ust) v = 255;
        else v = ((g - alt) / (ust - alt)) * 255;
        p[i] = p[i + 1] = p[i + 2] = v;
      }
      x.putImageData(d, 0, 0);
      coz(c);
    };
    im.src = dataUrl;
  });
}

// ── Yardımcılar ──
const trBuyuk = (s) => String(s || "").replace(/i/g, "İ").toLocaleUpperCase("tr");

// "1.234,56" / "1 234,56" / "234,56" / "*200,00" → 234.56
function paraCoz(m) {
  let t = String(m).replace(/[*₺\s]/g, "");
  t = t.replace(/\.(?=\d{3}\b)/g, "");          // binlik ayıracı
  t = t.replace(",", ".");
  const v = parseFloat(t);
  return isFinite(v) ? v : null;
}
const PARA_KALIP = /(?:\*|₺|TL)?\s*(\d{1,3}(?:[.\s]\d{3})*,\d{2}|\d+,\d{2}|\d{1,3}(?:[.\s]\d{3})+\.\d{2}|\d+\.\d{2})/g;

function satirParalari(satir) {
  const bulunan = [];
  let m;
  PARA_KALIP.lastIndex = 0;
  while ((m = PARA_KALIP.exec(satir))) {
    const v = paraCoz(m[1]);
    if (v != null) bulunan.push(v);
  }
  return bulunan;
}

// ── Tutar: "TOPLAM / TOP / GENEL TOPLAM" satırından al ──
// KDV, ARA TOPLAM, İSKONTO satırlarına asla bakma.
function tutarBul(satirlar) {
  const YASAK = /(KDV|ARA\s*TOP|İSKONTO|ISKONTO|İNDİRİM|INDIRIM|PARA\s*ÜSTÜ|PARA\s*USTU|MATRAH|TOPKDV)/;
  const ANAHTAR = /(GENEL\s*TOP|TOPLAM|^TOP\b|\bTOP\s|TUTAR|ÖDENEN|ODENEN)/;
  const ODEME = /(NAKİT|NAKIT|KREDİ|KREDI|KART|BANKA)/;

  let enIyi = null, enIyiPuan = -1;
  for (const ham of satirlar) {
    const S = trBuyuk(ham);
    const paralar = satirParalari(ham);
    if (!paralar.length) continue;
    if (YASAK.test(S)) continue;

    let puan = -1;
    if (/GENEL\s*TOP/.test(S)) puan = 100;
    else if (/TOPLAM/.test(S)) puan = 90;
    else if (/(^|\s)TOP(\s|\*|:|$)/.test(S)) puan = 85;
    else if (/(TUTAR|ÖDENEN|ODENEN)/.test(S)) puan = 70;
    else if (ODEME.test(S)) puan = 50;            // ödenen tutar da genelde toplamdır
    if (puan < 0) continue;

    const v = Math.max(...paralar);               // satırdaki en büyük rakam
    if (puan > enIyiPuan || (puan === enIyiPuan && enIyi != null && v > enIyi)) {
      enIyiPuan = puan; enIyi = v;
    }
  }
  return { tutar: enIyi, puan: enIyiPuan };
}

// ── Tarih: gg-aa-yyyy, gg.aa.yyyy, gg/aa/yy ──
function tarihBul(metin) {
  const bugun = new Date();
  const kalip = /(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})/g;
  let m, aday = null;
  while ((m = kalip.exec(metin))) {
    let [, g, a, y] = m;
    g = +g; a = +a; y = +y;
    if (y < 100) y += 2000;
    if (g < 1 || g > 31 || a < 1 || a > 12 || y < 2015 || y > bugun.getFullYear()) continue;
    const t = new Date(Date.UTC(y, a - 1, g));
    if (t.getTime() > Date.now() + 86400000) continue;      // gelecek tarih olamaz
    const s = `${y}-${String(a).padStart(2, "0")}-${String(g).padStart(2, "0")}`;
    if (!aday || s > aday) aday = s;
  }
  return aday;
}

// ── Satıcı: üst bloktaki ilk anlamlı satır ──
function saticiBul(satirlar) {
  const ELE = /(FİŞ|FIS|TARİH|TARIH|SAAT|VN|VD|V\.D|MERSİS|MERSIS|TEL|NO\s*:|SAYIN|ADA\s*NO|BAY\/)/;
  for (const ham of satirlar.slice(0, 6)) {
    const t = ham.trim();
    if (t.length < 4) continue;
    const S = trBuyuk(t);
    if (ELE.test(S)) continue;
    if (!/[A-ZÇĞİÖŞÜ]{3}/.test(S)) continue;
    if (satirParalari(t).length) continue;
    return t.replace(/\s{2,}/g, " ").slice(0, 60);
  }
  return null;
}

// ── Kalemler: parası olan, anahtar kelime içermeyen satırlar ──
function kalemBul(satirlar) {
  const ELE = /(TOPLAM|TOP\b|KDV|NAKİT|NAKIT|KREDİ|KREDI|KART|FİŞ|FIS|TARİH|TARIH|SAAT|VN|VD|MERSİS|MERSIS|TEL|TEŞEKKÜR|TESEKKUR|ADA\s*NO)/;
  const c = [];
  for (const ham of satirlar) {
    const S = trBuyuk(ham);
    if (ELE.test(S)) continue;
    if (!satirParalari(ham).length) continue;
    const ad = ham.replace(PARA_KALIP, "").replace(/[*%₺]|\d+,\d+|\s{2,}/g, " ").trim();
    if (ad.length >= 3 && /[A-ZÇĞİÖŞÜa-zçğıöşü]{3}/.test(ad)) c.push(ad.slice(0, 40));
    if (c.length >= 5) break;
  }
  return c;
}

// ── Ana giriş noktası ──
export async function fisOkuYerel(dataUrl, ilerleme) {
  const Tess = await tesseractYukle();
  if (ilerleme) ilerleme(5);
  const kanvas = await fisHazirla(dataUrl);
  if (ilerleme) ilerleme(15);

  const sonuc = await Tess.recognize(kanvas, "tur+eng", {
    logger: (m) => {
      if (ilerleme && m.status === "recognizing text") {
        ilerleme(15 + Math.round((m.progress || 0) * 80));
      }
    },
  });
  if (ilerleme) ilerleme(100);

  const metin = (sonuc && sonuc.data && sonuc.data.text) || "";
  const satirlar = metin.split("\n").map((s) => s.trim()).filter(Boolean);
  const { tutar, puan } = tutarBul(satirlar);
  const tarih = tarihBul(metin);
  const satici = saticiBul(satirlar);

  // Güven: tutarın hangi anahtar kelimeden geldiğine ve OCR skoruna bakar
  const ocrGuven = (sonuc && sonuc.data && sonuc.data.confidence) || 0;
  let guven = "dusuk";
  if (tutar != null && puan >= 85 && ocrGuven >= 60) guven = "yuksek";
  else if (tutar != null && (puan >= 70 || ocrGuven >= 55)) guven = "orta";

  return {
    tutar,
    tarih,
    satici,
    kalemler: kalemBul(satirlar),
    guven,
    kaynak: "cihaz",
    ham: metin.slice(0, 1200),
  };
}

export default fisOkuYerel;
