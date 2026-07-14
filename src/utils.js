// ═══ YARDIMCILAR — para/kur, PDF rapor üreticileri ═══
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FONT_TR, FONT_TR_BOLD } from "./fontTR.js";

const NAVY="#1B2A4A", GOLDX="#C9A24B";
function yeniPdf(){
  const doc=new jsPDF({unit:"mm",format:"a4"});
  doc.addFileToVFS("TR.ttf",FONT_TR);doc.addFont("TR.ttf","TR","normal");
  doc.addFileToVFS("TRB.ttf",FONT_TR_BOLD);doc.addFont("TRB.ttf","TR","bold");
  doc.setFont("TR","normal");
  return doc;
}
async function pdfVer(doc,dosyaAdi){
  const blob=doc.output("blob");
  try{
    const file=new File([blob],dosyaAdi,{type:"application/pdf"});
    if(navigator.canShare&&navigator.canShare({files:[file]})&&/Android|iPhone|iPad/i.test(navigator.userAgent)){
      await navigator.share({files:[file],title:dosyaAdi});
      return;
    }
  }catch(e){if(e&&e.name==="AbortError")return;}
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=dosyaAdi;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
function pdfBaslik(doc,baslik,isletme){
  doc.setFillColor(27,42,74);doc.rect(0,0,210,26,"F");
  doc.setFont("TR","bold");doc.setFontSize(15);doc.setTextColor(255,255,255);
  doc.text(baslik,14,12);
  doc.setFont("TR","normal");doc.setFontSize(9);doc.setTextColor(200,205,215);
  doc.text((isletme?.ad||"TradeFlow")+(isletme?.yetkili?" · "+isletme.yetkili:"")+" · "+new Date().toLocaleDateString("tr-TR"),14,19);
  doc.setFontSize(10);doc.setTextColor(201,162,75);doc.setFont("TR","bold");
  doc.text("T/F TRADEFLOW ELITE",196,12,{align:"right"});
  doc.setTextColor(0,0,0);
}
function ozetKutulari(doc,y,kutular){
  const gen=(182-(kutular.length-1)*4)/kutular.length;
  kutular.forEach((k,i)=>{
    const x=14+i*(gen+4);
    doc.setDrawColor(220,218,210);doc.setFillColor(250,250,248);
    doc.roundedRect(x,y,gen,16,2,2,"FD");
    doc.setFillColor(201,162,75);doc.rect(x,y,1.2,16,"F");
    doc.setFont("TR","normal");doc.setFontSize(7.5);doc.setTextColor(110,110,105);
    doc.text(k[0],x+4,y+6);
    doc.setFont("TR","bold");doc.setFontSize(10.5);
    const rgb=k[2]||[17,17,17];doc.setTextColor(rgb[0],rgb[1],rgb[2]);
    doc.text(String(k[1]),x+4,y+12.5);
  });
  doc.setTextColor(0,0,0);
  return y+22;
}
const TABLO_STIL={styles:{font:"TR",fontSize:8,cellPadding:2.2},headStyles:{fillColor:[27,42,74],textColor:[255,255,255],font:"TR",fontStyle:"bold",fontSize:8},alternateRowStyles:{fillColor:[247,247,244]},margin:{left:14,right:14}};
function altBilgi(doc){
  const s=doc.internal.getNumberOfPages();
  for(let i=1;i<=s;i++){doc.setPage(i);doc.setFont("TR","normal");doc.setFontSize(7);doc.setTextColor(160,160,155);
    doc.text("TradeFlow Elite ile hazırlanmıştır · "+new Date().toLocaleDateString("tr-TR")+" · Sayfa "+i+"/"+s,105,290,{align:"center"});}
}

let KURLAR = {TL:1,USD:46.80,EUR:53.61};
let KUR_KAYNAK = "sabit"; // "tcmb" | "canli" | "sabit"
export const kurKaynakAd = () => KUR_KAYNAK==="tcmb" ? "🏛️ TCMB Resmî Kur" : KUR_KAYNAK==="canli" ? "📈 Piyasa Kuru" : "Sabit Kur";
let AKTIF_PARA = "TL";
export const SEMBOL = {TL:" TL",USD:" $",EUR:" €"};
export const fmt = (n) => {
  const v = n / (KURLAR[AKTIF_PARA]||1);
  const dec = AKTIF_PARA==="TL"?0:2;
  return v.toLocaleString("tr-TR",{minimumFractionDigits:dec,maximumFractionDigits:dec})+SEMBOL[AKTIF_PARA];
};

// Modül dışından güvenli güncelleme (canlı kur / para birimi)
export function kurGuncelle(yeni,kaynak){KURLAR=yeni;KUR_KAYNAK=kaynak;}
export function paraAyarla(p){AKTIF_PARA=p;}
export {KURLAR,KUR_KAYNAK,AKTIF_PARA};

// ─── FATURA PDF ─────────────────────────────────────────────────
export function faturaPdf(f,isletme,T){
  const w=window.open("","_blank");
  if(!w){alert("Açılır pencere engellendi.");return;}
  const kalemSat=(f.kalemler||[]).map((k,i)=>"<tr><td>"+(i+1)+"</td><td>"+k.tanim+"</td><td style='text-align:center'>"+k.miktar+"</td><td style='text-align:right'>"+Number(k.birim).toLocaleString("tr-TR")+" TL</td><td style='text-align:right'>"+(k.miktar*k.birim).toLocaleString("tr-TR")+" TL</td></tr>").join("");
  const stil="body{font-family:Arial,sans-serif;padding:32px;color:#111;max-width:800px;margin:0 auto}h1{font-size:20px;color:#2563EB;margin:0}.ust{display:flex;justify-content:space-between;border-bottom:3px solid #2563EB;padding-bottom:16px;margin-bottom:18px}.firma{font-size:11px;color:#555;line-height:1.5}table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}th{background:#EFF6FF;border:1px solid #cbd5e1;padding:8px;text-align:left}td{border:1px solid #cbd5e1;padding:8px}.toplam{margin-top:14px;margin-left:auto;width:300px;font-size:13px}.toplam div{display:flex;justify-content:space-between;padding:5px 10px}.toplam .g{background:#2563EB;color:#fff;font-weight:bold;font-size:15px;border-radius:6px}.ettn{font-size:9px;color:#999;font-family:monospace;margin-top:24px}";
  const logoHtml=isletme?.logo?"<img src='"+isletme.logo+"' style='height:52px;margin-bottom:6px'/><br>":"";
  w.document.write("<html><head><title>Fatura "+f.no+"</title><style>"+stil+"</style></head><body>"+
    "<div class='ust'><div>"+logoHtml+"<h1>"+(isletme?.ad||"TradeFlow")+"</h1><div class='firma'>"+(isletme?.yetkili||"")+"<br>"+(isletme?.telefon||"")+"<br>"+(isletme?.adres||"")+(isletme?.vergiNo?"<br>VKN: "+isletme.vergiNo:"")+"</div></div>"+
    "<div style='text-align:right;font-size:12px'><b style='font-size:16px;color:#2563EB'>FATURA</b><br>No: "+f.no+"<br>"+T.tarihL+": "+f.tarih+"<br>"+(f.jobRef||"")+"</div></div>"+
    "<div style='font-size:13px;margin-bottom:4px'><b>"+T.musteri+":</b> "+(f.alici?.ad||f.musteri)+(f.alici?.vkn?" · VKN: "+f.alici.vkn:"")+"</div>"+
    (f.alici?.adres?"<div style='font-size:12px;color:#555;margin-bottom:6px'>"+f.alici.adres+"</div>":"")+
    "<table><tr><th style='width:30px'>#</th><th>"+T.kalemAdPh+"</th><th style='width:60px;text-align:center'>"+T.adetL+"</th><th style='width:100px;text-align:right'>"+T.birimFiyatL+"</th><th style='width:110px;text-align:right'>"+T.toplam+"</th></tr>"+kalemSat+"</table>"+
    "<div class='toplam'><div><span>"+T.araToplamL+"</span><span>"+(f.ara||f.tutar).toLocaleString("tr-TR")+" TL</span></div>"+
    (f.iskontoT>0?"<div style='color:#059669'><span>"+T.iskontoL+" (%"+f.iskonto+")</span><span>-"+f.iskontoT.toLocaleString("tr-TR")+" TL</span></div>":"")+
    "<div><span>"+T.kdvL+" %"+(f.kdv||20)+"</span><span>"+(f.kdvT||0).toLocaleString("tr-TR")+" TL</span></div>"+
    (f.tevkifatT>0?"<div style='color:#DC2626'><span>Tevkifat ("+f.tevkifat+"/10)</span><span>-"+f.tevkifatT.toLocaleString("tr-TR")+" TL</span></div>":"")+
    "<div class='g'><span>"+T.genelToplamL+"</span><span>"+f.tutar.toLocaleString("tr-TR")+" TL</span></div></div>"+
    "<div class='ettn'>ETTN: "+(f.ettn||"")+"</div>"+
    "<script>window.onload=function(){window.print();}</"+"script></body></html>");
  w.document.close();
}

// ─── PROFESYONEL TEKLİF PDF ─────────────────────────────────────
export function teklifPdf(t,isletme,T){
  const w=window.open("","_blank");
  if(!w){alert("Açılır pencere engellendi.");return;}
  const kalemSat=(t.kalemler&&t.kalemler.length>0)
    ?t.kalemler.map((k,i)=>"<tr><td>"+(i+1)+"</td><td>"+k.ad+"</td><td style='text-align:center'>"+k.adet+"</td><td style='text-align:right'>"+k.birimFiyat.toLocaleString("tr-TR")+" TL</td><td style='text-align:right'>"+(k.adet*k.birimFiyat).toLocaleString("tr-TR")+" TL</td></tr>").join("")
    :"<tr><td>1</td><td>"+t.baslik+"</td><td style='text-align:center'>1</td><td style='text-align:right'>"+t.tutar.toLocaleString("tr-TR")+" TL</td><td style='text-align:right'>"+t.tutar.toLocaleString("tr-TR")+" TL</td></tr>";
  const araT=t.araToplam||t.tutar,kdvT=t.kdvTutar||0,genelT=t.tutar;
  const stil="body{font-family:Arial,sans-serif;padding:32px;color:#111;max-width:800px;margin:0 auto}h1{font-size:22px;color:#2563EB;margin:0}.ust{display:flex;justify-content:space-between;border-bottom:3px solid #2563EB;padding-bottom:16px;margin-bottom:20px}.firma{font-size:12px;color:#555;line-height:1.5}.baslik{background:#2563EB;color:#fff;padding:8px 14px;font-size:15px;font-weight:bold;border-radius:6px;display:inline-block;margin:14px 0}table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}th{background:#EFF6FF;border:1px solid #cbd5e1;padding:8px;text-align:left}td{border:1px solid #cbd5e1;padding:8px}.toplam{margin-top:14px;margin-left:auto;width:280px;font-size:13px}.toplam div{display:flex;justify-content:space-between;padding:5px 10px}.toplam .g{background:#2563EB;color:#fff;font-weight:bold;font-size:15px;border-radius:6px}.alt{margin-top:36px;display:flex;justify-content:space-between;font-size:11px;color:#555}.imza{border-top:1px solid #999;padding-top:6px;width:180px;text-align:center;margin-top:44px}";
  w.document.write("<html><head><title>"+T.teklifBelgesi+" - "+t.musteri+"</title><style>"+stil+"</style></head><body>"+
    "<div class='ust'><div><h1>"+(isletme?.ad||"TradeFlow")+"</h1><div class='firma'>"+(isletme?.yetkili||"")+"<br>"+(isletme?.telefon||"")+"<br>"+(isletme?.email||"")+"<br>"+(isletme?.adres||"")+"</div></div>"+
    "<div style='text-align:right;font-size:12px;color:#555'>"+T.tarihL+": "+new Date().toLocaleDateString("tr-TR")+"<br>"+T.gecerlilik+": "+t.gecerlilik+"<br>No: TKF-"+String(t.id).slice(-6)+"</div></div>"+
    "<div class='baslik'>📋 "+T.teklifBelgesi+"</div>"+
    "<div style='font-size:13px;margin-bottom:4px'><b>"+T.musteri+":</b> "+t.musteri+(t.telefon?" · "+t.telefon:"")+"</div>"+
    "<div style='font-size:13px'><b>"+T.isBasligi+":</b> "+t.baslik+"</div>"+
    "<table><tr><th style='width:30px'>#</th><th>"+T.kalemAdPh+"</th><th style='width:60px;text-align:center'>"+T.adetL+"</th><th style='width:100px;text-align:right'>"+T.birimFiyatL+"</th><th style='width:110px;text-align:right'>"+T.toplam+"</th></tr>"+kalemSat+"</table>"+
    "<div class='toplam'><div><span>"+T.araToplamL+"</span><span>"+araT.toLocaleString("tr-TR")+" TL</span></div>"+
    (kdvT>0?"<div><span>"+T.kdvL+" %"+(t.kdvOran||20)+"</span><span>"+kdvT.toLocaleString("tr-TR")+" TL</span></div>":"")+
    "<div class='g'><span>"+T.genelToplamL+"</span><span>"+genelT.toLocaleString("tr-TR")+" TL</span></div></div>"+
    "<div class='alt'><div>"+T.gecerlilikNot+"</div><div class='imza'>"+T.kaseImza+"</div></div>"+
    "<script>window.onload=function(){window.print();}</"+"script></body></html>");
  w.document.close();
}

// ─── MUHASEBE EXPORT: PDF RAPORLAR ─────────────────────────────
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
function durumAd(d){return d==="tamamlandi"?"Tamamlandı":d==="aktif"?"Aktif":"Beklemede";}
const fTL=(n)=>Number(n||0).toLocaleString("tr-TR")+" TL";

// 👤 Müşteri Raporu — gerçek PDF (indir/paylaş)
export function musteriPdf(musteri,giderler,isletme){
  const doc=yeniPdf();
  pdfBaslik(doc,"Müşteri Raporu — "+musteri.ad,isletme);
  let y=34;
  doc.setFont("TR","normal");doc.setFontSize(9);doc.setTextColor(70,70,70);
  const bilgi=[musteri.telefon?"Tel: "+musteri.telefon:"",musteri.email?"E-posta: "+musteri.email:""].filter(Boolean).join("   ·   ");
  if(bilgi){doc.text(bilgi,14,y);y+=6;}
  (musteri.adresler||[]).forEach(a=>{doc.text("Adres: "+(a.etiket?a.etiket+" — ":"")+a.adres,14,y);y+=5;});
  y+=2;
  const isler=musteri.isler||[];
  const ciro=isler.reduce((s,j)=>s+j.tutar,0);
  const tahsil=isler.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const isIdleri=isler.map(j=>j.id);
  const musGider=(giderler||[]).filter(g=>isIdleri.includes(g.isId));
  const giderT=musGider.reduce((s,g)=>s+g.tutar,0);
  y=ozetKutulari(doc,y,[["Toplam Ciro",fTL(ciro)],["Tahsil Edilen",fTL(tahsil),[5,150,105]],["Toplam Gider",fTL(giderT),[220,38,38]],["Net Kâr",fTL(ciro-giderT),ciro-giderT>=0?[5,150,105]:[220,38,38]]]);
  const govde=isler.map(j=>{
    let detay=j.baslik;
    if(j.isAdresi)detay+="\nAdres: "+j.isAdresi;
    if(j.malzemeler)detay+="\nMalzemeler: "+j.malzemeler.split("\n").join(", ");
    if(j.not)detay+="\nNot: "+j.not;
    return [j.ref||"",detay,j.tarih,durumAd(j.durum),fTL(j.tutar)];
  });
  autoTable(doc,{...TABLO_STIL,startY:y,head:[["Ref","İş / Malzeme / Not","Tarih","Durum","Tutar"]],body:govde,columnStyles:{1:{cellWidth:82},4:{halign:"right"}}});
  if(musGider.length>0){
    autoTable(doc,{...TABLO_STIL,startY:doc.lastAutoTable.finalY+8,head:[["Gider","Kategori","Tarih","Tutar"]],body:musGider.map(g=>[g.ad,g.kategori,g.tarih,fTL(g.tutar)]),columnStyles:{3:{halign:"right"}}});
  }
  altBilgi(doc);
  pdfVer(doc,"musteri-raporu-"+musteri.ad.replace(/[^a-zA-Z0-9ğüşöçıİĞÜŞÖÇ ]/g,"").replace(/ /g,"-")+".pdf");
}
export function excelIsler(jobs,isletme){
  const doc=yeniPdf();
  pdfBaslik(doc,"İşler Raporu",isletme);
  const toplam=jobs.reduce((s,j)=>s+j.tutar,0);
  let y=ozetKutulari(doc,34,[["Toplam İş",jobs.length],["Toplam Tutar",fTL(toplam),[5,150,105]]]);
  const govde=jobs.map(j=>{
    const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
    return [j.ref||"",j.baslik,j.musteri,j.tarih,durumAd(j.durum),fTL(j.tutar),fTL(odenen),fTL(Math.max(j.tutar-odenen,0))];
  });
  autoTable(doc,{...TABLO_STIL,startY:y,head:[["Ref","İş","Müşteri","Tarih","Durum","Tutar","Ödenen","Kalan"]],body:govde,columnStyles:{5:{halign:"right"},6:{halign:"right"},7:{halign:"right"}}});
  altBilgi(doc);
  pdfVer(doc,"tradeflow-isler-"+new Date().toISOString().slice(0,10)+".pdf");
}
export function excelGiderler(giderler,jobs,isletme){
  const doc=yeniPdf();
  pdfBaslik(doc,"Giderler Raporu",isletme);
  const toplam=(giderler||[]).reduce((s,g)=>s+g.tutar,0);
  let y=ozetKutulari(doc,34,[["Toplam Gider",(giderler||[]).length],["Toplam Tutar",fTL(toplam),[220,38,38]]]);
  const govde=(giderler||[]).map(g=>{
    const is_=g.isId?(jobs||[]).find(j=>j.id===g.isId):null;
    return [g.ad,g.kategori,g.tarih,fTL(g.tutar),is_?is_.baslik+" ("+is_.musteri+")":(g.isAdi||"")];
  });
  autoTable(doc,{...TABLO_STIL,startY:y,head:[["Gider","Kategori","Tarih","Tutar","Bağlı İş"]],body:govde,columnStyles:{3:{halign:"right"}}});
  altBilgi(doc);
  pdfVer(doc,"tradeflow-giderler-"+new Date().toISOString().slice(0,10)+".pdf");
}
export function excelFaturalar(faturalar,isletme){
  const doc=yeniPdf();
  pdfBaslik(doc,"Faturalar Raporu",isletme);
  const toplam=(faturalar||[]).reduce((s,f)=>s+(f.genelToplam||f.tutar||0),0);
  let y=ozetKutulari(doc,34,[["Toplam Fatura",(faturalar||[]).length],["Genel Toplam",fTL(toplam),[5,150,105]]]);
  const govde=(faturalar||[]).map(f=>[f.no||f.id,f.musteri,f.tarih,fTL(f.araToplam||f.tutar||0),fTL(f.kdvTutar||0),fTL(f.genelToplam||f.tutar||0)]);
  autoTable(doc,{...TABLO_STIL,startY:y,head:[["Fatura No","Müşteri","Tarih","Ara Toplam","KDV","Genel Toplam"]],body:govde,columnStyles:{3:{halign:"right"},4:{halign:"right"},5:{halign:"right"}}});
  altBilgi(doc);
  pdfVer(doc,"tradeflow-faturalar-"+new Date().toISOString().slice(0,10)+".pdf");
}
export function pdfMuhasebeRaporu(jobs,giderler,isletme){
  const doc=yeniPdf();
  pdfBaslik(doc,"Muhasebe Raporu",isletme);
  const tamam=jobs.filter(j=>j.durum==="tamamlandi");
  const gelir=tamam.reduce((s,j)=>s+j.tutar,0);
  const giderT=(giderler||[]).reduce((s,g)=>s+g.tutar,0);
  let y=ozetKutulari(doc,34,[["Toplam Gelir",fTL(gelir),[5,150,105]],["Toplam Gider",fTL(giderT),[220,38,38]],["Net Kâr",fTL(gelir-giderT),gelir-giderT>=0?[5,150,105]:[220,38,38]]]);
  // Müşteri bazlı tahsilat özeti
  const musteriler={};
  jobs.forEach(j=>{
    if(!musteriler[j.musteri])musteriler[j.musteri]={toplam:0,tahsil:0,adet:0};
    musteriler[j.musteri].toplam+=j.tutar;musteriler[j.musteri].adet++;
    if(j.durum==="tamamlandi")musteriler[j.musteri].tahsil+=j.tutar;
  });
  doc.setFont("TR","bold");doc.setFontSize(10);doc.setTextColor(27,42,74);
  doc.text("Müşteri Bazlı Tahsilat",14,y+3);
  autoTable(doc,{...TABLO_STIL,startY:y+6,head:[["Müşteri","İş Adedi","Toplam","Tahsil Edilen","Bekleyen"]],
    body:Object.entries(musteriler).map(([ad,m])=>[ad,m.adet,fTL(m.toplam),fTL(m.tahsil),fTL(m.toplam-m.tahsil)]),
    columnStyles:{2:{halign:"right"},3:{halign:"right"},4:{halign:"right"}}});
  doc.setFont("TR","bold");doc.setFontSize(10);doc.setTextColor(27,42,74);
  doc.text("İşler ("+jobs.length+")",14,doc.lastAutoTable.finalY+10);
  autoTable(doc,{...TABLO_STIL,startY:doc.lastAutoTable.finalY+13,head:[["Ref","İş","Müşteri","Tarih","Durum","Tutar"]],
    body:jobs.map(j=>[j.ref||"",j.baslik,j.musteri,j.tarih,durumAd(j.durum),fTL(j.tutar)]),columnStyles:{5:{halign:"right"}}});
  if((giderler||[]).length>0){
    doc.setFont("TR","bold");doc.setFontSize(10);doc.setTextColor(27,42,74);
    doc.text("Giderler ("+giderler.length+")",14,doc.lastAutoTable.finalY+10);
    autoTable(doc,{...TABLO_STIL,startY:doc.lastAutoTable.finalY+13,head:[["Gider","Kategori","Tarih","Tutar"]],
      body:giderler.map(g=>[g.ad,g.kategori,g.tarih,fTL(g.tutar)]),columnStyles:{3:{halign:"right"}}});
  }
  altBilgi(doc);
  pdfVer(doc,"tradeflow-muhasebe-"+new Date().toISOString().slice(0,10)+".pdf");
}
export function excelMuhasebe(jobs,giderler,faturalar,isletme){
  pdfMuhasebeRaporu(jobs,giderler,isletme);
}
