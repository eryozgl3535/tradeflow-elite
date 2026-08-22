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
function fisHazirla(dataUrl, hedefEn = 1500, sadeceGri = false) {
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

      // 3) sadeceGri modunda eşikleme yapma — bazı fişlerde eşik metni siliyor
      if (sadeceGri) {
        for (let i = 0, k = 0; i < p.length; i += 4, k++) {
          const g = gri[k];
          const v = Math.max(0, Math.min(255, (g - 110) * 1.9 + 110));   // kontrastı aç
          p[i] = p[i + 1] = p[i + 2] = v;
        }
        x.putImageData(d, 0, 0);
        return coz(c);
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

// ── ÇAPRAZ DOĞRULAMA ──────────────────────────────────────────
// OCR tek bir rakamı yanlış okuyabilir (120,00 → 60,00). Fişin kendi
// aritmetiği bunu yakalar:
//     NAKİT − PARA ÜSTÜ = TOPLAM     (her zaman doğrudur)
//     kalemlerin toplamı  = TOPLAM   (indirim yoksa doğrudur)
// İki bağımsız kanıt aynı sayıda buluşuyorsa, o sayı doğrudur.
const yakin = (a, b, tol = 0.02) => a != null && b != null && Math.abs(a - b) <= tol;

function nakitCapraz(satirlar) {
  let nakit = null, ustu = null;
  for (const ham of satirlar) {
    const S = trBuyuk(ham);
    const p = satirParalari(ham);
    if (!p.length) continue;
    if (/PARA\s*[ÜU]ST[ÜU]/.test(S)) {
      if (ustu == null) ustu = Math.max(...p);
    } else if (/(NAK[İI]T|KRED[İI]|KART|BANKA)/.test(S)) {
      if (nakit == null) nakit = Math.max(...p);
    }
  }
  if (nakit == null || ustu == null) return null;
  const fark = +(nakit - ustu).toFixed(2);
  return fark > 0 ? fark : null;
}

function kalemToplami(satirlar) {
  const ELE = /(TOPLAM|TOP\b|KDV|NAK[İI]T|KRED[İI]|KART|BANKA|PARA\s*[ÜU]ST[ÜU]|ARA\s*TOP|MATRAH|[İI]SKONTO|[İI]ND[İI]R[İI]M|F[İI][ŞS]|TAR[İI]H|SAAT|\bVN\b|\bVD\b|MERS[İI]S|TEL|EK[ÜU]|BELGE|KAS[İI]YER)/;
  let toplam = 0, adet = 0;
  for (const ham of satirlar) {
    const S = trBuyuk(ham);
    if (ELE.test(S)) continue;
    const p = satirParalari(ham);
    if (!p.length) continue;
    if (!/[A-ZÇĞİÖŞÜ]{3}/.test(S)) continue;   // ürün adı yoksa kalem satırı değildir
    toplam += Math.max(...p);
    adet++;
  }
  return adet ? { toplam: +toplam.toFixed(2), adet } : null;
}

// Okunan tutarı kanıtlarla oylat. Gerekirse düzelt.
function tutarDogrula(satirlar, tutar) {
  const nakitFark = nakitCapraz(satirlar);
  const kalem = kalemToplami(satirlar);
  const kalemTop = kalem ? kalem.toplam : null;
  const notlar = [];
  let sonuc = tutar, ekPuan = 0;

  if (tutar != null && yakin(tutar, nakitFark)) { ekPuan += 25; notlar.push("nakit-uyustu"); }
  if (tutar != null && yakin(tutar, kalemTop))  { ekPuan += 15; notlar.push("kalem-uyustu"); }

  if (nakitFark != null && kalemTop != null && yakin(nakitFark, kalemTop) && !yakin(tutar, nakitFark)) {
    // İki bağımsız kanıt birbirini doğruluyor ve okunan tutardan farklı:
    // TOPLAM satırı yanlış okunmuş demektir.
    sonuc = nakitFark; ekPuan = 30;
    notlar.push("duzeltildi " + tutar + " -> " + nakitFark);
  } else if (tutar == null && nakitFark != null) {
    sonuc = nakitFark; ekPuan = 20; notlar.push("nakit-farkindan-alindi");
  } else if (tutar == null && kalemTop != null) {
    sonuc = kalemTop; ekPuan = 5; notlar.push("kalem-toplamindan-alindi");
  } else if (tutar != null && nakitFark != null && !yakin(tutar, nakitFark)) {
    // Çelişki var ama hangisinin doğru olduğu belli değil — güveni düşür,
    // App.jsx sunucudaki okuyucuya devretsin.
    ekPuan -= 40;
    notlar.push("celiski toplam=" + tutar + " nakit-farki=" + nakitFark);
  }

  if (sonuc != null && (sonuc <= 0 || sonuc > 10000000)) { sonuc = null; ekPuan = -100; }
  return { tutar: sonuc, ekPuan, notlar, nakitFark, kalemTop };
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

// ── Fiş türü: ne alındığını anahtar kelimelerden anla ──
// Firma adı termal fişte en zor okunan yerdir; tür bilgisi çok daha güvenilir.
const YAKIT_TUR = [
  [/OTOGAZ|LPG/, "Otogaz"],
  [/MOTOR[İI]N|D[İI]ZEL|EUROD|V\/?MAX D/, "Motorin"],
  [/KUR[ŞS]UNSUZ|BENZ[İI]N|95|97/, "Benzin"],
];
const FIS_TUR = [
  { kat:"Yakıt", ad:"Yakıt",
    re:/AKARYAKIT|OTOGAZ|LPG|MOTOR[İI]N|D[İI]ZEL|BENZ[İI]N|KUR[ŞS]UNSUZ|PETROL|[İI]STASYON|OPET|SHELL|BP\b|TOTAL|PO\b|LUKOIL|AYTEM[İI]Z|ALPET/ },
  { kat:"Yedek Parça", ad:"Yedek parça",
    re:/YEDEK\s*PAR[ÇC]A|OTO\s*YEDEK|F[İI]LTRE|BALATA|AK[ÜU]\b|TR[İI]GER|DEBR[İI]YAJ/ },
  { kat:"Malzeme", ad:"Hırdavat / yapı malzemesi",
    re:/HIRDAVAT|YAPI\s*MARKET|BAUHAUS|KO[ÇC]TA[ŞS]|TEKZEN|[İI]N[ŞS]AAT|[ÇC][İI]MENTO|BOYA|V[İI]DA|S[İI]L[İI]KON|KABLO|BORU|TES[İI]SAT/ },
  { kat:"Malzeme", ad:"Market alışverişi",
    re:/M[İI]GROS|B[İI]M\b|A101|[ŞS]OK\b|CARREFOUR|MARKET|BAKKAL|GROSS/ },
  { kat:"Diğer", ad:"Yemek",
    re:/RESTORAN|LOKANTA|KEBAP|P[İI]DE|KAFE|CAFE|B[ÜU]FE|YEMEK|D[ÖO]NER/ },
];

function fisTuru(metin) {
  const M = trBuyuk(metin);
  for (const t of FIS_TUR) {
    if (!t.re.test(M)) continue;
    let ad = t.ad;
    if (t.kat === "Yakıt") {
      for (const [re, isim] of YAKIT_TUR) if (re.test(M)) { ad = "Yakıt — " + isim; break; }
    }
    return { kategori: t.kat, ad };
  }
  return { kategori: null, ad: null };
}

// ── Firma adı okunabilir mi? Bozuksa hiç kullanma ──
// OCR bozulunca sesli harfsiz ya da tek harflik parçalar üretir.
function saticiSaglam(ad) {
  if (!ad) return false;
  const t = ad.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü0-9\s.]/g, " ").trim();
  if (t.length < 6) return false;
  const p = t.split(/\s+/).filter((x) => x.replace(/\./g, "").length > 1);
  if (p.length < 2) return false;

  const harf = (x) => x.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g, "");
  let buyuk = 0, kucuk = 0, bozuk = 0, kisa = 0;
  for (const k of p) {
    const h = harf(k);
    if (!h) continue;
    if (h === h.toLocaleUpperCase("tr")) buyuk++; else kucuk++;
    if (!/[AEIİOÖUÜaeıioöuü]/.test(h)) bozuk++;       // sesli harfi yok
    if (/[A-Za-zÇĞİÖŞÜçğıöşü]\d|\d[A-Za-zÇĞİÖŞÜçğıöşü]/.test(k)) bozuk++;  // harf–rakam karışık
    if (h.length <= 3) kisa++;
  }
  // Gerçek fiş başlığı tek biçimdedir. Büyük ve küçük harfli kelimeler
  // bir arada çıkıyorsa OCR bozulmuş demektir.
  if (buyuk >= 2 && kucuk >= 2) return false;
  if (kisa / p.length > 0.45) return false;           // "Bit tot rion" gibi kırıntılar
  return bozuk / p.length < 0.35;
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

  let metin = (sonuc && sonuc.data && sonuc.data.text) || "";
  let satirlar = metin.split("\n").map((s) => s.trim()).filter(Boolean);
  let { tutar, puan } = tutarBul(satirlar);
  let dog = tutarDogrula(satirlar, tutar);
  tutar = dog.tutar;
  let ocrGuvenSayi = (sonuc && sonuc.data && sonuc.data.confidence) || 0;

  // Tutar çıkmadıysa VEYA kanıtlar çelişiyorsa: eşikleme bazı fişlerde
  // ters teper. Ham görüntüyle bir kez daha dene.
  if (tutar == null || dog.ekPuan < 0) {
    try {
      if (ilerleme) ilerleme(20);
      const ham2 = await fisHazirla(dataUrl, 1800, true);
      const s2 = await Tess.recognize(ham2, "tur+eng", {
        logger: (m) => {
          if (ilerleme && m.status === "recognizing text") ilerleme(20 + Math.round((m.progress || 0) * 75));
        },
      });
      const m2 = (s2 && s2.data && s2.data.text) || "";
      const l2 = m2.split("\n").map((x) => x.trim()).filter(Boolean);
      const t2 = tutarBul(l2);
      const d2 = tutarDogrula(l2, t2.tutar);
      // İkinci geçişi ancak daha iyi doğrulanıyorsa kabul et
      if (d2.tutar != null && (tutar == null || d2.ekPuan > dog.ekPuan)) {
        metin = m2; satirlar = l2; tutar = d2.tutar; puan = t2.puan; dog = d2;
        ocrGuvenSayi = (s2 && s2.data && s2.data.confidence) || ocrGuvenSayi;
      }
    } catch (e) { /* ikinci deneme başarısızsa sessiz geç */ }
  }
  const tarih = tarihBul(metin);
  const satici = saticiBul(satirlar);

  // Güven: anahtar kelime + OCR skoru + ÇAPRAZ DOĞRULAMA.
  // Aritmetik kanıt olmadan artık "yuksek" verilmiyor; kanıtsız bir tutar
  // App.jsx tarafından sunucudaki okuyucuya devredilir.
  const toplamPuan = (puan || 0) + dog.ekPuan;
  let guven = "dusuk";
  if (tutar != null && dog.ekPuan >= 15 && toplamPuan >= 100 && ocrGuvenSayi >= 50) guven = "yuksek";
  else if (tutar != null && dog.ekPuan >= 0 && (toplamPuan >= 85 || ocrGuvenSayi >= 55)) guven = "orta";

  const tur = fisTuru(metin);
  const kalemler = kalemBul(satirlar);
  const saticiTemiz = saticiSaglam(satici) ? satici : null;

  // Açıklama: önce fişin türü, sonra okunabiliyorsa firma adı.
  // Firma adı bozuksa hiç yazma — "OBJERT Bit tot rion" kimseye bir şey anlatmaz.
  let etiket = tur.ad || (kalemler[0] || null) || "Fiş";
  if (saticiTemiz) etiket += " — " + saticiTemiz;

  return {
    tutar,
    tarih,
    satici: saticiTemiz,
    etiket,
    kategori: tur.kategori,
    kalemler,
    guven,
    kaynak: "cihaz",
    dogrulama: { notlar: dog.notlar, nakitFark: dog.nakitFark, kalemTop: dog.kalemTop, puan: toplamPuan },
    ham: metin.slice(0, 1200),
  };
}

export default fisOkuYerel;
