// ═══ YARDIMCILAR — para/kur, Excel(CSV), PDF üreticileri ═══

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

// ─── MUHASEBE EXPORT: EXCEL (CSV) + PDF ────────────────────────
export async function csvIndir(satirlar,dosyaAdi){
  const bom="\uFEFF"; // Türkçe karakterler Excel'de doğru açılsın
  const csv=bom+satirlar.map(r=>r.map(h=>'"'+String(h??"").replace(/"/g,'""')+'"').join(";")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  // Mobil/PWA: paylaşım menüsü (WhatsApp, e-posta, Dosyalar...) — daha kolay
  try{
    const file=new File([blob],dosyaAdi,{type:"text/csv"});
    if(navigator.canShare&&navigator.canShare({files:[file]})&&/Android|iPhone|iPad/i.test(navigator.userAgent)){
      await navigator.share({files:[file],title:dosyaAdi});
      return;
    }
  }catch(e){/* paylaşım iptal/desteklenmiyor → indirmeye düş */}
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=dosyaAdi;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
export function excelMuhasebe(jobs,giderler,faturalar,isletme){
  const tamam=jobs.filter(j=>j.durum==="tamamlandi");
  const gelir=tamam.reduce((s,j)=>s+j.tutar,0);
  const giderT=(giderler||[]).reduce((s,g)=>s+g.tutar,0);
  const tarih=new Date().toLocaleDateString("tr-TR");
  const satirlar=[
    [(isletme?.ad||"TradeFlow")+" — Muhasebe Raporu","","","Rapor Tarihi: "+tarih],
    [],
    ["ÖZET"],
    ["Toplam Gelir (Tamamlanan)",gelir],
    ["Toplam Gider",giderT],
    ["Net Kâr",gelir-giderT],
    [],
    ["İŞLER ("+jobs.length+")"],
    ["Ref","İş Başlığı","Müşteri","Tarih","Durum","Tutar (TL)","Maliyet (TL)","Alınan Ödeme (TL)","Kalan (TL)"],
  ];
  jobs.forEach(j=>{
    const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
    satirlar.push([j.ref,j.baslik,j.musteri,j.tarih,j.durum==="tamamlandi"?"Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede",j.tutar,j.maliyet||0,odenen,Math.max(j.tutar-odenen,0)]);
  });
  satirlar.push([],["GİDERLER ("+(giderler||[]).length+")"],["Gider Adı","Kategori","Tarih","Tutar (TL)"]);
  (giderler||[]).forEach(g=>satirlar.push([g.ad,g.kategori,g.tarih,g.tutar]));
  satirlar.push([],["FATURALAR ("+(faturalar||[]).length+")"],["Fatura No","Müşteri","Tarih","Genel Toplam (TL)"]);
  (faturalar||[]).forEach(f=>satirlar.push([f.no||f.id,f.musteri,f.tarih,f.genelToplam||f.tutar||0]));
  csvIndir(satirlar,"tradeflow-muhasebe-raporu-"+new Date().toISOString().slice(0,10)+".csv");
}
export function excelIsler(jobs){
  const satirlar=[["Ref","İş Başlığı","Müşteri","Tarih","Durum","Tutar (TL)","Maliyet (TL)","Alınan Ödeme (TL)","Kalan (TL)","Atanan"]];
  jobs.forEach(j=>{
    const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
    satirlar.push([j.ref,j.baslik,j.musteri,j.tarih,j.durum==="tamamlandi"?"Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede",j.tutar,j.maliyet||0,odenen,Math.max(j.tutar-odenen,0),j.atanan||""]);
  });
  csvIndir(satirlar,"tradeflow-isler-"+new Date().toISOString().slice(0,10)+".csv");
}
export function excelGiderler(giderler,jobs){
  const satirlar=[["Gider Adı","Kategori","Tarih","Tutar (TL)","Bağlı İş"]];
  giderler.forEach(g=>{
    const is_=g.isId?(jobs||[]).find(j=>j.id===g.isId):null;
    satirlar.push([g.ad,g.kategori,g.tarih,g.tutar,is_?is_.baslik+" ("+is_.musteri+")":(g.isAdi||"")]);
  });
  csvIndir(satirlar,"tradeflow-giderler-"+new Date().toISOString().slice(0,10)+".csv");
}
export function excelFaturalar(faturalar){
  const satirlar=[["Fatura No","Müşteri","Tarih","Ara Toplam (TL)","KDV (TL)","Tevkifat (TL)","Genel Toplam (TL)"]];
  faturalar.forEach(f=>{
    satirlar.push([f.no||f.id,f.musteri,f.tarih,f.araToplam||f.tutar||0,f.kdvTutar||0,f.tevkifatTutar||0,f.genelToplam||f.tutar||0]);
  });
  csvIndir(satirlar,"tradeflow-faturalar-"+new Date().toISOString().slice(0,10)+".csv");
}
export function pdfMuhasebeRaporu(jobs,giderler,isletme){
  const tamam=jobs.filter(j=>j.durum==="tamamlandi");
  const gelir=tamam.reduce((s,j)=>s+j.tutar,0);
  const giderT=giderler.reduce((s,g)=>s+g.tutar,0);
  const tarih=new Date().toLocaleDateString("tr-TR");
  const w=window.open("","_blank");
  if(!w){alert("Açılır pencere engellendi. Tarayıcı izinlerini kontrol edin.");return;}
  const stil="body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}h2{font-size:14px;margin-top:24px;border-bottom:2px solid #2563EB;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#EFF6FF}.ozet{display:flex;gap:16px;margin-top:12px}.kart{border:1px solid #ddd;border-radius:8px;padding:12px 16px;flex:1}.kart b{font-size:16px}";
  const isSat=jobs.map(j=>"<tr><td>"+j.ref+"</td><td>"+j.baslik+"</td><td>"+j.musteri+"</td><td>"+j.tarih+"</td><td>"+(j.durum==="tamamlandi"?"Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede")+"</td><td style='text-align:right'>"+j.tutar.toLocaleString("tr-TR")+" TL</td></tr>").join("");
  const giSat=giderler.map(g=>"<tr><td>"+g.ad+"</td><td>"+g.kategori+"</td><td>"+g.tarih+"</td><td style='text-align:right'>"+g.tutar.toLocaleString("tr-TR")+" TL</td></tr>").join("");
  w.document.write("<html><head><title>Muhasebe Raporu</title><style>"+stil+"</style></head><body>"+
    "<h1>📊 "+(isletme?.ad||"TradeFlow")+" — Muhasebe Raporu</h1>"+
    "<div style='color:#666;font-size:12px'>Rapor Tarihi: "+tarih+" · "+(isletme?.yetkili||"")+"</div>"+
    "<div class='ozet'>"+
    "<div class='kart'>Toplam Gelir (Tamamlanan)<br><b style='color:#059669'>"+gelir.toLocaleString("tr-TR")+" TL</b></div>"+
    "<div class='kart'>Toplam Gider<br><b style='color:#DC2626'>"+giderT.toLocaleString("tr-TR")+" TL</b></div>"+
    "<div class='kart'>Net Kâr<br><b style='color:"+(gelir-giderT>=0?"#059669":"#DC2626")+"'>"+(gelir-giderT).toLocaleString("tr-TR")+" TL</b></div>"+
    "</div>"+
    "<h2>İşler ("+jobs.length+")</h2><table><tr><th>Ref</th><th>Başlık</th><th>Müşteri</th><th>Tarih</th><th>Durum</th><th>Tutar</th></tr>"+isSat+"</table>"+
    "<h2>Giderler ("+giderler.length+")</h2><table><tr><th>Ad</th><th>Kategori</th><th>Tarih</th><th>Tutar</th></tr>"+giSat+"</table>"+
    "<script>window.onload=function(){window.print();}</"+"script></body></html>");
  w.document.close();
}
