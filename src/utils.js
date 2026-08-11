// ═══ YARDIMCILAR — para/kur, hafif çekirdek ═══
// Ağır PDF üreticileri pdf.js'e taşındı; aşağıdaki sarmalayıcılar onları
// yalnızca çağrıldıklarında (dinamik import) yükler.
let KURLAR = {TL:1,USD:46.80,EUR:53.61};
let KUR_KAYNAK = "sabit"; // "tcmb" | "canli" | "sabit"
export const kurKaynakAd = () => KUR_KAYNAK==="tcmb" ? "🏛️ TCMB Resmî Kur" : KUR_KAYNAK==="canli" ? "📈 Piyasa Kuru" : "Sabit Kur";
let AKTIF_PARA = "TL";
export const SEMBOL = {TL:" TL",USD:" $",EUR:" €"};
export const fmt = (n) => {
  const v = Number(n)/(KURLAR[AKTIF_PARA]||1);
  const gecerli = isFinite(v) ? v : 0;
  const dec = AKTIF_PARA==="TL"?0:2;
  // SEMBOL'de olmayan bir para birimi gelirse (bozuk yedek dosyası vb.)
  // tutarın yanına "undefined" yazılmasın — TL'ye düş.
  return gecerli.toLocaleString("tr-TR",{minimumFractionDigits:dec,maximumFractionDigits:dec})+(SEMBOL[AKTIF_PARA]||SEMBOL.TL);
};

// Modül dışından güvenli güncelleme (canlı kur / para birimi)
export function kurGuncelle(yeni,kaynak){KURLAR=yeni;KUR_KAYNAK=kaynak;}
export function paraAyarla(p){AKTIF_PARA=SEMBOL[p]?p:"TL";} // tanınmayan değer TL sayılır
export {KURLAR,KUR_KAYNAK,AKTIF_PARA};

// ─── FATURA PDF ─────────────────────────────────────────────────
async function dosyaVer(blob,dosyaAdi,mime){
  // Mobil/PWA: paylaşım menüsü (WhatsApp, e-posta, Dosyalar...) — daha kolay
  try{
    const file=new File([blob],dosyaAdi,{type:mime});
    if(navigator.canShare&&navigator.canShare({files:[file]})&&/Android|iPhone|iPad/i.test(navigator.userAgent)){
      await navigator.share({files:[file],title:dosyaAdi});
      return;
    }
  }catch(e){/* paylaşım iptal/desteklenmiyor → indirmeye düş */}
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=dosyaAdi;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
// Eski CSV fonksiyonu — geriye dönük uyumluluk için korunuyor
export async function csvIndir(satirlar,dosyaAdi){
  const bom="\uFEFF";
  const csv=bom+satirlar.map(r=>r.map(h=>'"'+String(h??"").replace(/"/g,'""')+'"').join(";")).join("\n");
  dosyaVer(new Blob([csv],{type:"text/csv;charset=utf-8"}),dosyaAdi,"text/csv");
}
// Ortak PDF rapor üretici: şık tablo + yazdır penceresi ("PDF olarak kaydet")

// ─── PDF/rapor üreticileri: tembel yükleme ───
export async function faturaPdf(...a){ const m=await import("./pdf.js"); return m.faturaPdf(...a); }
export async function teklifPdf(...a){ const m=await import("./pdf.js"); return m.teklifPdf(...a); }
export async function musteriPdf(...a){ const m=await import("./pdf.js"); return m.musteriPdf(...a); }
export async function excelIsler(...a){ const m=await import("./pdf.js"); return m.excelIsler(...a); }
export async function excelGiderler(...a){ const m=await import("./pdf.js"); return m.excelGiderler(...a); }
export async function excelFaturalar(...a){ const m=await import("./pdf.js"); return m.excelFaturalar(...a); }
export async function ustaIsRaporuPdf(...a){ const m=await import("./pdf.js"); return m.ustaIsRaporuPdf(...a); }
export async function pdfMuhasebeRaporu(...a){ const m=await import("./pdf.js"); return m.pdfMuhasebeRaporu(...a); }
export async function excelMuhasebe(...a){ const m=await import("./pdf.js"); return m.excelMuhasebe(...a); }
