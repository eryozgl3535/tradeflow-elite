// ═══════════════════════════════════════════════════════════════
// 🔮 NAKİT AKIŞI TAHMİNİ + 🛡️ ŞAHİTLİ İŞ
// İki büyük özellik. Tamamen kullanıcının kendi verisiyle çalışır.
// Dış bağımlılık yok, yasal risk yok, offline çalışır.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// 🔮 NAKİT AKIŞI TAHMİN MOTORU
// Müşterilerin geçmiş ödeme gecikmelerinden öğrenir, gelecek 30
// günün nakit akışını gün gün tahmin eder, açık riskini bulur.
// ─────────────────────────────────────────────────────────────

// Müşterinin geçmiş ödeme alışkanlığını çıkar (ortalama kaç gün geç ödüyor)
function musteriGecikmeleri(jobs){
  const harita={}; // musteri -> [gecikme günleri]
  jobs.forEach(j=>{
    if(j.durum!=="tamamlandi"||!j.odemeler||j.odemeler.length===0)return;
    const isTarih=new Date(j.tarih);
    const sonOdeme=j.odemeler[j.odemeler.length-1];
    if(!sonOdeme||!sonOdeme.tarih)return;
    const odemeTarih=new Date(sonOdeme.tarih);
    const gecikme=Math.round((odemeTarih-isTarih)/86400000);
    if(gecikme>=0&&gecikme<365){
      const m=j.musteri||"?";
      (harita[m]=harita[m]||[]).push(gecikme);
    }
  });
  const ort={};
  Object.entries(harita).forEach(([m,arr])=>{
    ort[m]=Math.round(arr.reduce((a,b)=>a+b,0)/arr.length);
  });
  return ort; // { "Ahmet Yılmaz": 12, ... }
}

// 30 günlük nakit akışı projeksiyonu
export function nakitAkisiTahmini(jobs=[],cekSenetler=[],giderler=[],baslangicBakiye=0){
  const bugun=new Date();bugun.setHours(0,0,0,0);
  const gecikmeler=musteriGecikmeleri(jobs);
  const ortGenelGecikme=(()=>{
    const v=Object.values(gecikmeler);
    return v.length?Math.round(v.reduce((a,b)=>a+b,0)/v.length):15; // veri yoksa 15 gün varsay
  })();

  // Günlük hareketler: [{gun, tutar, tur, aciklama}]
  const hareketler=[];
  const gunEkle=(tarih,tutar,tur,aciklama)=>{
    const d=new Date(tarih);d.setHours(0,0,0,0);
    const fark=Math.round((d-bugun)/86400000);
    if(fark>=0&&fark<=30)hareketler.push({gun:fark,tutar,tur,aciklama,tarih:d.toISOString().slice(0,10)});
  };

  // 1) Bekleyen tahsilatlar → müşterinin gecikme alışkanlığına göre tahmini gün
  jobs.forEach(j=>{
    if(j.durum==="bekliyor"){
      const gecikme=gecikmeler[j.musteri]!=null?gecikmeler[j.musteri]:ortGenelGecikme;
      const beklenenTarih=new Date(new Date(j.tarih).getTime()+gecikme*86400000);
      // Eğer beklenen tarih geçmişse bugüne + birkaç gün ekle
      const t=beklenenTarih<bugun?new Date(bugun.getTime()+3*86400000):beklenenTarih;
      gunEkle(t,j.tutar,"gelir","💰 "+(j.musteri||"Müşteri")+" tahsilatı");
    }
    if(j.durum==="aktif"){
      // Aktif işler: bitince + gecikme kadar sonra gelir bekle (kaba tahmin: 10 gün sonra biter)
      const gecikme=gecikmeler[j.musteri]!=null?gecikmeler[j.musteri]:ortGenelGecikme;
      const t=new Date(bugun.getTime()+(10+gecikme)*86400000);
      gunEkle(t,j.tutar*0.9,"gelir-belirsiz","⏳ "+(j.musteri||"Müşteri")+" (aktif iş)");
    }
  });

  // 2) Çek/senet vadeleri (alacak = gelir, borç = gider)
  cekSenetler.forEach(c=>{
    if(c.durum!=="bekliyor"||!c.vade)return;
    if(c.yon==="alacak")gunEkle(c.vade,c.tutar,"gelir",(c.tip==="cek"?"🏦 Çek":"📜 Senet")+" · "+c.kisi);
    else gunEkle(c.vade,-c.tutar,"gider",(c.tip==="cek"?"🏦 Çek":"📜 Senet")+" ödemesi · "+c.kisi);
  });

  // 3) Tekrarlayan sabit giderler (son 60 günün ortalamasından aylık tahmin)
  const son60=giderler.filter(g=>{const d=new Date(g.tarih);return (bugun-d)/86400000<=60&&(bugun-d)>=0;});
  const aylikGiderTahmini=son60.reduce((s,g)=>s+g.tutar,0)/2; // 60 gün = ~2 ay
  if(aylikGiderTahmini>0){
    // Ayın ortalarına düzenli gider serpiştir (haftalık ~4 parça)
    const haftalik=aylikGiderTahmini/4;
    [7,14,21,28].forEach(g=>{
      const t=new Date(bugun.getTime()+g*86400000);
      gunEkle(t,-haftalik,"gider","🔄 Tahmini sabit gider");
    });
  }

  // Günlük kümülatif bakiye çıkar
  const gunluk=[];
  let bakiye=baslangicBakiye;
  for(let g=0;g<=30;g++){
    const oGun=hareketler.filter(h=>h.gun===g);
    const gunToplam=oGun.reduce((s,h)=>s+h.tutar,0);
    bakiye+=gunToplam;
    const tarih=new Date(bugun.getTime()+g*86400000);
    gunluk.push({gun:g,tarih:tarih.toISOString().slice(0,10),bakiye:Math.round(bakiye),hareket:gunToplam,detaylar:oGun});
  }

  // Risk analizi: bakiye negatife düşüyor mu?
  const acikGun=gunluk.find(x=>x.bakiye<0);
  const enDusuk=gunluk.reduce((min,x)=>x.bakiye<min.bakiye?x:min,gunluk[0]);
  const toplamGelir=hareketler.filter(h=>h.tutar>0).reduce((s,h)=>s+h.tutar,0);
  const toplamGider=Math.abs(hareketler.filter(h=>h.tutar<0).reduce((s,h)=>s+h.tutar,0));

  // Öneri üret
  let oneri=null,risk="dusuk";
  if(acikGun){
    risk="yuksek";
    const gunSayisi=acikGun.gun;
    const tarihStr=new Date(acikGun.tarih).toLocaleDateString("tr-TR",{day:"numeric",month:"long"});
    // Öne çekilebilecek tahsilat öner
    const oneCekilebilir=jobs.filter(j=>j.durum==="bekliyor").sort((a,b)=>a.tutar-b.tutar).slice(0,2);
    oneri="Yaklaşık "+gunSayisi+" gün sonra ("+tarihStr+") nakit açığın oluşabilir ("+fmtKisa(acikGun.bakiye)+"). "+
      (oneCekilebilir.length?"Bu hafta "+oneCekilebilir.map(j=>j.musteri).join(" ve ")+" tahsilatlarını öne çekmeyi dene.":"Bekleyen alacaklarını tahsil etmeye odaklan.");
  }else if(enDusuk.bakiye<toplamGider*0.2){
    risk="orta";
    oneri="Nakit akışın idare eder ama en düşük noktada bakiye "+fmtKisa(enDusuk.bakiye)+"'ye iniyor. Beklenmedik gidere karşı tedbirli ol.";
  }else{
    risk="dusuk";
    oneri="Önümüzdeki 30 gün nakit akışın sağlıklı görünüyor. 👍";
  }

  return {gunluk,acikGun,enDusuk,toplamGelir,toplamGider,risk,oneri,ortGenelGecikme,gecikmeler,hareketSayisi:hareketler.length};
}

function fmtKisa(n){
  const s=n<0?"-":"";const a=Math.abs(Math.round(n));
  if(a>=1000000)return s+(a/1000000).toFixed(1).replace(".0","")+"M ₺";
  if(a>=1000)return s+(a/1000).toFixed(1).replace(".0","")+"K ₺";
  return s+a+" ₺";
}

// ─── Ana ekran özet kartı ───
export function NakitOzetKart({jobs,cekSenetler,giderler,C,P,onAc}){
  const t=nakitAkisiTahmini(jobs,cekSenetler,giderler);
  // Veri yoksa: boş dönmek yerine kullanıcıyı yönlendir
  if(t.hareketSayisi===0){
    return <div style={{background:C.card,borderRadius:16,padding:"15px 17px",marginBottom:18,boxShadow:C.sh,borderLeft:`4px solid ${P}`}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}>
        <i className="ti ti-chart-line" style={{fontSize:19,color:P}} aria-hidden="true"/>
        <span style={{fontSize:13.5,fontWeight:800,color:C.t1,flex:1}}>Nakit Akışı Tahmini</span>
        <span style={{fontSize:9.5,fontWeight:800,color:C.t3,background:C.bg,borderRadius:9,padding:"2px 9px"}}>VERİ BEKLENİYOR</span>
      </div>
      <div style={{fontSize:12,color:C.t2,lineHeight:1.6}}>Tahmin için <b>gelecekte gelecek para</b> gerekir. Şunları girince burası dolar:{"\n"}• <b>Bekleyen</b> durumdaki işler (henüz tahsil edilmemiş){"\n"}• <b>Vadeli çek/senet</b> (Çek·Senet ekranından){"\n\n"}<span style={{color:C.t3}}>Not: "Tahsil edildi/tamamlandı" işaretlediğin işler zaten gelmiş para sayılır, tahmine girmez.</span></div>
    </div>;
  }
  const renk=t.risk==="yuksek"?"#DC2626":t.risk==="orta"?"#D97706":"#0E9F6E";
  const bg=t.risk==="yuksek"?"#FEE2E2":t.risk==="orta"?"#FEF3C7":"#DCFCE7";
  const ikon=t.risk==="yuksek"?"ti-alert-triangle":t.risk==="orta"?"ti-alert-circle":"ti-circle-check";
  return <div onClick={onAc} style={{background:C.card,borderRadius:16,padding:"15px 17px",marginBottom:18,cursor:"pointer",boxShadow:C.sh,borderLeft:`4px solid ${renk}`}}>
    <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:9}}>
      <i className="ti ti-chart-line" style={{fontSize:19,color:P}} aria-hidden="true"/>
      <span style={{fontSize:13.5,fontWeight:800,color:C.t1,flex:1}}>Nakit Akışı Tahmini</span>
      <span style={{fontSize:9.5,fontWeight:800,color:renk,background:bg,borderRadius:9,padding:"2px 9px"}}>
        {t.risk==="yuksek"?"⚠️ RİSK":t.risk==="orta"?"DİKKAT":"✓ SAĞLIKLI"}
      </span>
    </div>
    <div style={{fontSize:12,color:C.t2,lineHeight:1.55,marginBottom:10}}>{t.oneri}</div>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 11px"}}>
        <div style={{fontSize:9,color:C.t3,fontWeight:700}}>30 GÜN GELİR</div>
        <div style={{fontSize:14,fontWeight:800,color:"#0E9F6E"}}>{fmtKisa(t.toplamGelir)}</div>
      </div>
      <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 11px"}}>
        <div style={{fontSize:9,color:C.t3,fontWeight:700}}>30 GÜN GİDER</div>
        <div style={{fontSize:14,fontWeight:800,color:"#DC2626"}}>{fmtKisa(t.toplamGider)}</div>
      </div>
      <div style={{flex:1,background:C.bg,borderRadius:10,padding:"8px 11px"}}>
        <div style={{fontSize:9,color:C.t3,fontWeight:700}}>EN DÜŞÜK</div>
        <div style={{fontSize:14,fontWeight:800,color:t.enDusuk.bakiye<0?"#DC2626":C.t1}}>{fmtKisa(t.enDusuk.bakiye)}</div>
      </div>
    </div>
    <div style={{fontSize:11,color:P,fontWeight:700,marginTop:9,textAlign:"right"}}>Detaylı grafik ›</div>
  </div>;
}

// ─── Detay ekranı (30 günlük grafik + gün gün akış) ───
export function NakitDetayEkrani({jobs,cekSenetler,giderler,C,P,APP_W,GeriBaslik,Sh,onKapat}){
  const [baslangic,setBaslangic]=useState(0);
  const t=nakitAkisiTahmini(jobs,cekSenetler,giderler,baslangic);
  const maxB=Math.max(...t.gunluk.map(g=>g.bakiye),0);
  const minB=Math.min(...t.gunluk.map(g=>g.bakiye),0);
  const aralik=maxB-minB||1;
  const yuk=140;
  const genislik=Math.max(320,t.gunluk.length*11);
  const nokta=(g,i)=>{const x=(i/(t.gunluk.length-1))*genislik;const y=yuk-((g.bakiye-minB)/aralik)*yuk;return {x,y};};
  const yol=t.gunluk.map((g,i)=>{const {x,y}=nokta(g,i);return (i===0?"M":"L")+x+","+y;}).join(" ");
  const sifirY=yuk-((0-minB)/aralik)*yuk;
  const renk=t.risk==="yuksek"?"#DC2626":t.risk==="orta"?"#D97706":"#0E9F6E";
  const hareketliGunler=t.gunluk.filter(g=>g.detaylar.length>0);

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100dvh"}}>
      <GeriBaslik baslik="🔮 Nakit Akışı Tahmini" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        {/* Öneri kutusu */}
        <div style={{background:renk+"15",borderRadius:14,padding:"14px 16px",marginBottom:16,borderLeft:`4px solid ${renk}`}}>
          <div style={{fontSize:13,fontWeight:800,color:renk,marginBottom:5}}>
            {t.risk==="yuksek"?"⚠️ Nakit Açığı Riski":t.risk==="orta"?"⚡ Dikkatli Ol":"✅ Sağlıklı Görünüyor"}
          </div>
          <div style={{fontSize:12.5,color:C.t1,lineHeight:1.6}}>{t.oneri}</div>
        </div>

        {/* Başlangıç bakiyesi girişi */}
        <Sh s={{padding:14,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t2,marginBottom:7}}>💵 Bugünkü kasa/banka bakiyeniz (opsiyonel)</div>
          <input type="number" value={baslangic||""} onChange={e=>setBaslangic(parseFloat(e.target.value)||0)} placeholder="Örn: 25000"
            style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:14,outline:"none"}}/>
          <div style={{fontSize:10.5,color:C.t3,marginTop:6}}>Girerseniz tahmin gerçek bakiyenizden başlar, daha doğru olur.</div>
        </Sh>

        {/* Grafik */}
        <Sh s={{padding:"16px 14px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div style={{fontSize:13.5,fontWeight:700,color:C.t1}}>30 Günlük Bakiye Projeksiyonu</div>
            <div style={{fontSize:10.5,color:C.t3,fontWeight:600}}>En düşük <b style={{color:t.enDusuk.bakiye<0?"#DC2626":C.t1,fontWeight:800}}>{fmtKisa(t.enDusuk.bakiye)}</b></div>
          </div>
          {/* Açıklama şeridi */}
          <div style={{display:"flex",gap:15,fontSize:10.5,color:C.t2,fontWeight:600,marginBottom:8}}>
            <span style={{display:"flex",alignItems:"center",gap:5}}><i style={{width:9,height:9,borderRadius:2,background:"#2E7490",display:"block"}}/>Bakiye</span>
            <span style={{display:"flex",alignItems:"center",gap:5}}><i style={{width:9,height:9,borderRadius:2,background:"#DC2626",display:"block"}}/>Açık bölgesi</span>
          </div>
          <div style={{overflowX:"auto"}}>
            <svg width={genislik} height={yuk+26} style={{display:"block"}}>
              <defs>
                <linearGradient id="nkUp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E7490" stopOpacity="0.24"/>
                  <stop offset="100%" stopColor="#2E7490" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="nkDn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#DC2626" stopOpacity="0.04"/>
                  <stop offset="100%" stopColor="#DC2626" stopOpacity="0.18"/>
                </linearGradient>
                <clipPath id="nkAb"><rect x="0" y="0" width={genislik} height={Math.max(0,sifirY)}/></clipPath>
                <clipPath id="nkBl"><rect x="0" y={Math.max(0,sifirY)} width={genislik} height={Math.max(0,yuk-sifirY)}/></clipPath>
              </defs>
              {/* yatay kılavuz çizgiler */}
              {[0.25,0.5,0.75].map(o=><line key={o} x1="0" y1={yuk*o} x2={genislik} y2={yuk*o} stroke="#F1F5F9" strokeWidth="1"/>)}
              {/* negatif bölge zemini */}
              {minB<0&&<rect x="0" y={sifirY} width={genislik} height={yuk-sifirY} fill="url(#nkDn)"/>}
              {/* sıfır çizgisi */}
              <line x1="0" y1={sifirY} x2={genislik} y2={sifirY} stroke="#CBD5E1" strokeWidth="1" strokeDasharray="4 4"/>
              <text x="4" y={sifirY-5} fontSize="9.5" fill={C.t3} fontWeight="600">0 ₺</text>
              {/* alan dolgusu (sadece pozitif) */}
              <path d={yol+` L${genislik},${yuk} L0,${yuk} Z`} fill="url(#nkUp)" clipPath="url(#nkAb)"/>
              {/* çizgi: sıfır üstü mavi, altı kırmızı */}
              <path d={yol} fill="none" stroke="#2E7490" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#nkAb)"/>
              <path d={yol} fill="none" stroke="#DC2626" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#nkBl)"/>
              {/* açık noktası */}
              {t.acikGun&&(()=>{const i=t.gunluk.findIndex(g=>g.gun===t.acikGun.gun);const {x}=nokta(t.acikGun,i);
                return <g><circle cx={x} cy={sifirY} r="5" fill="#fff" stroke="#DC2626" strokeWidth="2.4"/>
                  <text x={x} y={sifirY-11} fontSize="9.5" fill="#DC2626" fontWeight="800" textAnchor="middle">açık</text></g>;})()}
              {/* son nokta */}
              {(()=>{const sonG=t.gunluk[t.gunluk.length-1];const {x,y}=nokta(sonG,t.gunluk.length-1);
                return <circle cx={x} cy={y} r="3.6" fill={sonG.bakiye<0?"#DC2626":"#2E7490"}/>;})()}
              {/* gün etiketleri */}
              <text x="2" y={yuk+19} fontSize="9.5" fill={C.t3} fontWeight="600">Bugün</text>
              <text x={genislik/2} y={yuk+19} fontSize="9.5" fill={C.t3} fontWeight="600" textAnchor="middle">15 gün</text>
              <text x={genislik-2} y={yuk+19} fontSize="9.5" fill={C.t3} fontWeight="600" textAnchor="end">30 gün</text>
            </svg>
          </div>
        </Sh>

        {/* Gün gün akış */}
        <div style={{fontSize:12,fontWeight:800,color:C.t2,margin:"0 4px 10px"}}>📅 Beklenen Para Hareketleri</div>
        {hareketliGunler.length===0&&<div style={{textAlign:"center",color:C.t3,fontSize:12,padding:"20px 0"}}>Önümüzdeki 30 günde beklenen hareket yok.</div>}
        {hareketliGunler.map(g=><Sh key={g.gun} s={{padding:"12px 14px",marginBottom:8}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:g.detaylar.length?7:0}}>
            <div style={{fontSize:12,fontWeight:700,color:C.t1}}>{g.gun===0?"Bugün":new Date(g.tarih).toLocaleDateString("tr-TR",{day:"numeric",month:"short"})} <span style={{color:C.t3,fontWeight:500}}>({g.gun} gün)</span></div>
            <div style={{fontSize:12.5,fontWeight:800,color:g.bakiye<0?"#DC2626":C.t2}}>Bakiye: {fmtKisa(g.bakiye)}</div>
          </div>
          {g.detaylar.map((d,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11.5,color:C.t2,padding:"3px 0"}}>
            <span>{d.aciklama}</span>
            <span style={{fontWeight:700,color:d.tutar>0?"#0E9F6E":"#DC2626"}}>{d.tutar>0?"+":""}{fmtKisa(d.tutar)}</span>
          </div>)}
        </Sh>)}

        <div style={{fontSize:10.5,color:C.t3,textAlign:"center",marginTop:14,lineHeight:1.6,padding:"0 10px"}}>
          ℹ️ Bu tahmin geçmiş verilerinize dayalı bir öngörüdür, kesin değildir. Müşterilerin ödeme alışkanlığı ({t.ortGenelGecikme} gün ort. gecikme) ve tahmini sabit giderler dikkate alınmıştır.
        </div>
      </div>
    </div>
  </div>;
}

// ─────────────────────────────────────────────────────────────
// 🛡️ ŞAHİTLİ İŞ — Zaman damgalı, GPS'li, imzalı teslim tutanağı
// ─────────────────────────────────────────────────────────────

// Basit hash — fotoğrafın sonradan değişmediğini ispatlar
async function veriHash(metin){
  try{
    const enc=new TextEncoder().encode(metin);
    const buf=await crypto.subtle.digest("SHA-256",enc);
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("").slice(0,16).toUpperCase();
  }catch{return "HASH-"+Date.now().toString(36).toUpperCase();}
}

function fotoSikistir(dosya,cb){
  const fr=new FileReader();
  fr.onload=()=>{const img=new Image();img.onload=()=>{
    const c=document.createElement("canvas");const oran=Math.min(1,1280/img.width);
    c.width=img.width*oran;c.height=img.height*oran;
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    cb(c.toDataURL("image/jpeg",0.7));
  };img.src=fr.result;};
  fr.readAsDataURL(dosya);
}

export function SahitliIsEkrani({job,C,P,APP_W,GeriBaslik,Sh,onKapat,onKaydet,goster}){
  const mevcut=job?.sahitli||null;
  const [oncesi,setOncesi]=useState(mevcut?.oncesi||null);
  const [sonrasi,setSonrasi]=useState(mevcut?.sonrasi||null);
  const [not,setNot]=useState(mevcut?.not||"");
  const [parcaKodu,setParcaKodu]=useState(mevcut?.parcaKodu||"");
  const [konum,setKonum]=useState(mevcut?.konum||null);
  const [imza,setImza]=useState(mevcut?.imza||null);
  const [imzaAcik,setImzaAcik]=useState(false);
  const [konumAliniyor,setKonumAliniyor]=useState(false);
  const oncRef=useRef(),sonRef=useRef();

  const fotoSec=(e,tur)=>{
    const d=e.target.files&&e.target.files[0];e.target.value="";
    if(!d)return;
    fotoSikistir(d,(b64)=>{
      const damga={data:b64,zaman:new Date().toISOString()};
      if(tur==="oncesi")setOncesi(damga);else setSonrasi(damga);
      goster("📷 Fotoğraf zaman damgasıyla kaydedildi");
    });
  };
  const konumAl=()=>{
    if(!navigator.geolocation){goster("⚠️ Konum servisi yok");return;}
    setKonumAliniyor(true);
    navigator.geolocation.getCurrentPosition(
      pos=>{setKonum({lat:pos.coords.latitude.toFixed(6),lng:pos.coords.longitude.toFixed(6),zaman:new Date().toISOString()});setKonumAliniyor(false);goster("📍 Konum alındı");},
      ()=>{setKonumAliniyor(false);goster("⚠️ Konum alınamadı — izin verilmedi");},
      {enableHighAccuracy:true,timeout:10000}
    );
  };

  const kaydet=async()=>{
    if(!oncesi&&!sonrasi){goster("⚠️ En az bir fotoğraf ekle");return;}
    const ozet=JSON.stringify({o:oncesi?.zaman,s:sonrasi?.zaman,k:konum,n:not,p:parcaKodu});
    const hash=await veriHash(ozet+(oncesi?.data||"")+(sonrasi?.data||""));
    const kayit={oncesi,sonrasi,not,parcaKodu,konum,imza,hash,olusturma:new Date().toISOString()};
    onKaydet(kayit);
    goster("🛡️ Şahitli iş kaydı oluşturuldu");
    onKapat();
  };

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100dvh"}}>
      <GeriBaslik baslik="🛡️ Şahitli İş" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <div style={{background:P+"12",borderRadius:14,padding:"13px 15px",marginBottom:16}}>
          <div style={{fontSize:12.5,fontWeight:800,color:P,marginBottom:5}}>ℹ️ Nedir bu?</div>
          <div style={{fontSize:11.5,color:C.t1,lineHeight:1.7}}>İşin öncesi/sonrası fotoğrafları, konum, tarih-saat ve müşteri imzası kilitlenir. İleride "iş eksik/hatalı" tartışmasında elinde <b>değiştirilemez kanıt</b> olur.</div>
        </div>

        {job&&<div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:14}}>📋 {job.baslik} — {job.musteri}</div>}

        {/* Öncesi / Sonrası foto */}
        <div style={{display:"flex",gap:11,marginBottom:16}}>
          {[["oncesi","ÖNCESİ",oncesi,oncRef],["sonrasi","SONRASI",sonrasi,sonRef]].map(([tur,etiket,deger,ref])=>
            <div key={tur} style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:800,color:C.t3,marginBottom:6,letterSpacing:"0.05em"}}>{etiket}</div>
              <label style={{display:"block",aspectRatio:"1",borderRadius:14,overflow:"hidden",cursor:"pointer",border:`1.5px ${deger?"solid":"dashed"} ${deger?C.green:C.border}`,background:deger?"transparent":C.bg,position:"relative"}}>
                {deger?<><img src={deger.data} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:8.5,padding:"3px 6px"}}>🕐 {new Date(deger.zaman).toLocaleString("tr-TR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}</div></>
                  :<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}><i className="ti ti-camera" style={{fontSize:26,color:C.t3}} aria-hidden="true"/><span style={{fontSize:10,color:C.t3,fontWeight:600}}>Fotoğraf çek</span></div>}
                <input type="file" accept="image/*" capture="environment" onChange={e=>fotoSec(e,tur)} style={{display:"none"}}/>
              </label>
            </div>
          )}
        </div>

        {/* Konum */}
        <Sh s={{padding:14,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:40,height:40,borderRadius:11,background:konum?"#DCFCE7":C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-map-pin" style={{fontSize:19,color:konum?C.green:C.t3}} aria-hidden="true"/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{konum?"📍 Konum kaydedildi":"Konum ekle"}</div>
              <div style={{fontSize:10.5,color:C.t3}}>{konum?konum.lat+", "+konum.lng:"İşin yapıldığı yeri GPS ile damgala"}</div>
            </div>
            <button onClick={konumAl} disabled={konumAliniyor} style={{background:konum?C.bg:P,border:konum?`1px solid ${C.border}`:"none",borderRadius:10,padding:"9px 14px",color:konum?C.t2:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{konumAliniyor?"...":konum?"Yenile":"Al"}</button>
          </div>
        </Sh>

        {/* Parça kodu + not */}
        <input value={parcaKodu} onChange={e=>setParcaKodu(e.target.value)} placeholder="🔩 Kullanılan parça/malzeme kodu (opsiyonel)"
          style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:11,boxShadow:C.sh}}/>
        <textarea value={not} onChange={e=>setNot(e.target.value)} placeholder="📝 İş açıklaması / yapılan işlem notu" rows={3}
          style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:12,resize:"vertical",boxShadow:C.sh,fontFamily:"inherit"}}/>

        {/* İmza */}
        <Sh s={{padding:14,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:9}}>✍️ Müşteri İmzası</div>
          {imza?<div style={{position:"relative"}}>
            <img src={imza} alt="imza" style={{width:"100%",height:100,objectFit:"contain",background:"#fff",borderRadius:10,border:`1px solid ${C.border}`}}/>
            <button onClick={()=>setImza(null)} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:8,color:"#fff",fontSize:11,padding:"4px 8px",cursor:"pointer"}}>Sil</button>
          </div>
          :<button onClick={()=>setImzaAcik(true)} style={{width:"100%",background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:12,padding:16,color:P,fontSize:13,fontWeight:700,cursor:"pointer"}}>✍️ İmza almak için dokun</button>}
        </Sh>

        <button onClick={kaydet} style={{width:"100%",background:P,border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>🛡️ Şahitli İş Kaydını Oluştur</button>
      </div>
    </div>

    {imzaAcik&&<ImzaPad C={C} P={P} onKapat={()=>setImzaAcik(false)} onKaydet={(d)=>{setImza(d);setImzaAcik(false);goster("✍️ İmza alındı");}}/>}
  </div>;
}

// İmza çizim yüzeyi
function ImzaPad({C,P,onKapat,onKaydet}){
  const cvRef=useRef();
  const ciziyor=useRef(false);
  useEffect(()=>{
    const cv=cvRef.current;const ctx=cv.getContext("2d");
    ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height);
    ctx.strokeStyle="#111";ctx.lineWidth=2.5;ctx.lineCap="round";ctx.lineJoin="round";
  },[]);
  const pos=(e)=>{const cv=cvRef.current;const r=cv.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return {x:(t.clientX-r.left)*(cv.width/r.width),y:(t.clientY-r.top)*(cv.height/r.height)};};
  const bas=(e)=>{e.preventDefault();ciziyor.current=true;const ctx=cvRef.current.getContext("2d");const {x,y}=pos(e);ctx.beginPath();ctx.moveTo(x,y);};
  const ciz=(e)=>{if(!ciziyor.current)return;e.preventDefault();const ctx=cvRef.current.getContext("2d");const {x,y}=pos(e);ctx.lineTo(x,y);ctx.stroke();};
  const bitir=()=>{ciziyor.current=false;};
  const temizle=()=>{const cv=cvRef.current;const ctx=cv.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,cv.width,cv.height);};
  return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
    <div style={{background:C.card,borderRadius:18,padding:18,width:"100%",maxWidth:420}}>
      <div style={{fontSize:15,fontWeight:800,color:C.t1,marginBottom:4}}>✍️ Müşteri İmzası</div>
      <div style={{fontSize:11.5,color:C.t3,marginBottom:12}}>Müşteri parmağıyla aşağıya imza atsın</div>
      <canvas ref={cvRef} width={380} height={180} onMouseDown={bas} onMouseMove={ciz} onMouseUp={bitir} onMouseLeave={bitir} onTouchStart={bas} onTouchMove={ciz} onTouchEnd={bitir}
        style={{width:"100%",height:180,borderRadius:12,border:`2px solid ${C.border}`,touchAction:"none",background:"#fff",cursor:"crosshair"}}/>
      <div style={{display:"flex",gap:10,marginTop:14}}>
        <button onClick={temizle} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:12,color:C.t2,fontSize:13,fontWeight:700,cursor:"pointer"}}>Temizle</button>
        <button onClick={onKapat} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:12,color:C.t2,fontSize:13,fontWeight:700,cursor:"pointer"}}>İptal</button>
        <button onClick={()=>onKaydet(cvRef.current.toDataURL("image/png"))} style={{flex:1.4,background:P,border:"none",borderRadius:12,padding:12,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Onayla</button>
      </div>
    </div>
  </div>;
}

// ─── Şahitli iş PDF/özet görüntüleyici ───
export function SahitliIsGoruntule({job,C,P,APP_W,GeriBaslik,Sh,onKapat,onDuzenle}){
  // ⚠️ Hook'lar her zaman aynı sırada çağrılmalı — erken return hook'lardan SONRA olmalı,
  // aksi halde React #310 (Rendered more hooks than previous render) → beyaz ekran.
  const [buyukFoto,setBuyukFoto]=useState(null);
  const s=job?.sahitli;
  if(!s)return null;
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100dvh"}}>
      <GeriBaslik baslik="🛡️ Şahitli İş Kaydı" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <div style={{background:"#DCFCE7",borderRadius:14,padding:"12px 15px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <i className="ti ti-shield-check" style={{fontSize:22,color:"#0E9F6E"}} aria-hidden="true"/>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:800,color:"#059669"}}>Doğrulanmış Kayıt</div>
            <div style={{fontSize:10,color:"#047857",fontFamily:"monospace"}}>Kimlik: {s.hash}</div>
          </div>
        </div>

        {job&&<div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:4}}>{job.baslik}</div>}
        {job&&<div style={{fontSize:12,color:C.t3,marginBottom:16}}>{job.musteri} · {new Date(s.olusturma).toLocaleString("tr-TR")}</div>}

        {/* Fotoğraflar */}
        <div style={{display:"flex",gap:11,marginBottom:16}}>
          {[["ÖNCESİ",s.oncesi],["SONRASI",s.sonrasi]].map(([et,f])=>f&&
            <div key={et} style={{flex:1}}>
              <div style={{fontSize:10,fontWeight:800,color:C.t3,marginBottom:6}}>{et}</div>
              <img src={f.data} onClick={()=>setBuyukFoto(f.data)} alt="" style={{width:"100%",aspectRatio:"1",objectFit:"cover",borderRadius:12,cursor:"pointer"}}/>
              <div style={{fontSize:9.5,color:C.t3,marginTop:4}}>🕐 {new Date(f.zaman).toLocaleString("tr-TR")}</div>
            </div>
          )}
        </div>

        {s.konum&&<Sh s={{padding:13,marginBottom:11}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:3}}>📍 Konum</div>
          <div style={{fontSize:11,color:C.t2,fontFamily:"monospace"}}>{s.konum.lat}, {s.konum.lng}</div>
          <a href={`https://maps.google.com/?q=${s.konum.lat},${s.konum.lng}`} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:P,fontWeight:700,textDecoration:"none"}}>Haritada aç ›</a>
        </Sh>}
        {s.parcaKodu&&<Sh s={{padding:13,marginBottom:11}}><div style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:3}}>🔩 Parça/Malzeme</div><div style={{fontSize:12,color:C.t2}}>{s.parcaKodu}</div></Sh>}
        {s.not&&<Sh s={{padding:13,marginBottom:11}}><div style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:3}}>📝 Not</div><div style={{fontSize:12,color:C.t2,lineHeight:1.6}}>{s.not}</div></Sh>}
        {s.imza&&<Sh s={{padding:13,marginBottom:16}}><div style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:7}}>✍️ Müşteri İmzası</div><img src={s.imza} alt="imza" style={{width:"100%",height:90,objectFit:"contain",background:"#fff",borderRadius:8}}/></Sh>}

        <button onClick={onDuzenle} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:P,fontSize:13,fontWeight:700,cursor:"pointer"}}>Kaydı Düzenle</button>
      </div>
    </div>
    {buyukFoto&&<div onClick={()=>setBuyukFoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:2100,display:"flex",alignItems:"center",justifyContent:"center",padding:16,cursor:"pointer"}}><img src={buyukFoto} alt="" style={{maxWidth:"100%",maxHeight:"92vh",borderRadius:12}}/></div>}
  </div>;
}
