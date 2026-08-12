if(typeof window!=="undefined")console.log("%c🚀 TradeFlow build: v20260711-faz1","background:#1C4E60;color:#fff;padding:4px 10px;border-radius:6px;font-weight:bold;");
import { useState, useEffect, memo, useRef, useCallback, lazy, Suspense } from "react";
import { PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { supabase, supabaseYan, USTA_EK, yerelKaydet, yerelYukle } from "./veri.js";
import { getT, DIL_GRUPLARI, DIL_LISTESI } from "./i18n.js";
// 🎮 Eğlence köşesi ~60 KB — sadece açıldığında yüklenir
const EglenceKosesi = lazy(()=>import("./eglence.jsx").then(m=>({default:m.EglenceKosesi})));
import { Ik, MODUL_IKON, LedImza } from "./ikonlar.jsx";
import { TFLogo, koyuMu } from "./logo.jsx";
import { SelamSaat, DunyaSaatleriEkrani, GokyuzuSahne, gunDilimi, DILIM_METIN } from "./saat.jsx";
import { PiyasaSeridi } from "./piyasa.jsx";
import { NakitDetayEkrani, SahitliIsEkrani, SahitliIsGoruntule } from "./ozellikler.jsx";
import { IS_KOLLARI, sektorBilgi, SEKTOR_VERI } from "./sektorler.js";
import { sesliIsAyristir } from "./sesliform.js";
import { fmt, kurKaynakAd, SEMBOL, KURLAR, KUR_KAYNAK, AKTIF_PARA, kurGuncelle, paraAyarla, csvIndir, excelIsler, excelGiderler, excelFaturalar, excelMuhasebe, pdfMuhasebeRaporu, musteriPdf, teklifPdf, faturaPdf, ustaIsRaporuPdf } from "./utils.js";


const LIGHT = {
  bg:"#F1F3F7",card:"#FFFFFF",border:"#E5E7EB",
  t1:"#111827",t2:"#6B7280",t3:"#9CA3AF",
  green:"#10B981",greenBg:"#DCFCE7",amber:"#F59E0B",amberBg:"#FEF3C7",
  red:"#EF4444",redBg:"#FEE2E2",blue:"#3B82F6",blueBg:"#DBEAFE",
  purpleBg:"#DEE7F2",inputBg:"#FFFFFF",
  statP:"#1C4E60",statG:"#059669",statA:"#B45309",statR:"#DC2626",
  sh:"0 1px 3px rgba(16,24,40,0.07), 0 1px 2px rgba(16,24,40,0.04)",
  sh2:"0 8px 24px rgba(0,0,0,0.12)",
};
const DARK = {
  bg:"#0B0F1A",card:"#151B2B",border:"#252D42",
  t1:"#F1F5F9",t2:"#94A3B8",t3:"#64748B",
  green:"#34D399",greenBg:"#0E3A2C",amber:"#FBBF24",amberBg:"#3A2E0E",
  red:"#F87171",redBg:"#3F1717",blue:"#60A5FA",blueBg:"#12294E",
  purpleBg:"#16294A",inputBg:"#0F1522",
  statP:"#8C97AC",statG:"#6EE7B7",statA:"#FCD34D",statR:"#FCA5A5",
  sh:"0 1px 4px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.05)",
  sh2:"0 8px 24px rgba(0,0,0,0.6)",
};
let C = LIGHT;
// ═══════════════════════════════════════════════════════════════
// 🎨 RENK TEMALARI — 10 belirgin tema
// Her tema SADECE zemini değil ANA RENGİ de değiştirir (vurgu).
// Butonlar, aktif sekme, grafikler, seçili durumlar hep bu renkten
// beslendiği için temalar birbirinden gerçekten ayrılır.
//   bg      zemin
//   card    kart (hafif tonlu — saf beyaz değil, karakter verir)
//   vurgu   ana renk
//   vurguBg ana rengin açık tonu (seçili/pasif alanlar)
//   sekme   tema listesindeki damla için koyu ton
// ═══════════════════════════════════════════════════════════════
const TEMALAR = {
  acik: {...LIGHT, vurgu:"#2E7490", vurguBg:"#DFEDF3"},

  okyanus: {...LIGHT, bg:"#E9F1F7", card:"#FCFEFF", border:"#CFE0EC", inputBg:"#FFFFFF",
    vurgu:"#0F6E93", vurguBg:"#D5E8F2", purpleBg:"#D5E8F2", blueBg:"#CFE5F5",
    t1:"#0D2231", t2:"#4C6577", t3:"#8AA0AF"},

  orman: {...LIGHT, bg:"#ECF2EA", card:"#FDFEFC", border:"#D2E0CC", inputBg:"#FFFFFF",
    vurgu:"#2F6B4F", vurguBg:"#D9E9DC", purpleBg:"#D9E9DC", greenBg:"#D0EBD6",
    t1:"#132218", t2:"#4E6355", t3:"#8AA091"},

  gunbatimi: {...LIGHT, bg:"#FAF0E7", card:"#FFFDFA", border:"#EEDCC8", inputBg:"#FFFFFF",
    vurgu:"#C2603A", vurguBg:"#F8E2D5", purpleBg:"#F8E2D5", amberBg:"#FBE7C9",
    t1:"#2B1A11", t2:"#6B5449", t3:"#A89284"},

  lavanta: {...LIGHT, bg:"#F1EEF9", card:"#FDFCFF", border:"#DED7F0", inputBg:"#FFFFFF",
    vurgu:"#6656A8", vurguBg:"#E5DEF7", purpleBg:"#E5DEF7", blueBg:"#DFD9F6",
    t1:"#1E1830", t2:"#5B5273", t3:"#958DAC"},

  gul: {...LIGHT, bg:"#FAEEF1", card:"#FFFCFD", border:"#F0D8DF", inputBg:"#FFFFFF",
    vurgu:"#AF4A6B", vurguBg:"#F7DEE6", purpleBg:"#F7DEE6", redBg:"#FBDCE3",
    t1:"#2C1620", t2:"#6E5059", t3:"#AC8D96"},

  bal: {...LIGHT, bg:"#FBF3E2", card:"#FFFEFA", border:"#EFE0BE", inputBg:"#FFFFFF",
    vurgu:"#9E6C15", vurguBg:"#F7E9C8", purpleBg:"#F7E9C8", amberBg:"#F8E4B8",
    t1:"#2A2109", t2:"#6A5C3B", t3:"#A79878"},

  zumrut: {...LIGHT, bg:"#E7F4EE", card:"#FBFEFC", border:"#C8E5D6", inputBg:"#FFFFFF",
    vurgu:"#0A7A55", vurguBg:"#D3EDE0", purpleBg:"#D3EDE0", greenBg:"#CBEEDB",
    t1:"#0A231A", t2:"#456156", t3:"#83A093"},

  gece: {...LIGHT, bg:"#ECEEF7", card:"#FCFDFF", border:"#D4DAEE", inputBg:"#FFFFFF",
    vurgu:"#3B4E8F", vurguBg:"#DDE3F5", purpleBg:"#DDE3F5", blueBg:"#D8E0F5",
    t1:"#141A2E", t2:"#4E5670", t3:"#8A92AB"},

  toprak: {...LIGHT, bg:"#F6EFE9", card:"#FFFDFB", border:"#E6D6C8", inputBg:"#FFFFFF",
    vurgu:"#96593C", vurguBg:"#F0E1D5", purpleBg:"#F0E1D5", amberBg:"#EFDFCB",
    t1:"#271A12", t2:"#68554A", t3:"#A39084"},
};

// [id, ikon, ad, zemin, vurgu]
const TEMA_LISTE = [
  ["acik",      "☀️","Açık",      "#F2F2F7","#2E7490"],
  ["okyanus",   "🌊","Okyanus",   "#E9F1F7","#0F6E93"],
  ["orman",     "🌿","Orman",     "#ECF2EA","#2F6B4F"],
  ["gunbatimi", "🌅","Günbatımı", "#FAF0E7","#C2603A"],
  ["lavanta",   "💜","Lavanta",   "#F1EEF9","#6656A8"],
  ["gul",       "🌸","Gül",       "#FAEEF1","#AF4A6B"],
  ["bal",       "🍯","Bal",       "#FBF3E2","#9E6C15"],
  ["zumrut",    "💎","Zümrüt",    "#E7F4EE","#0A7A55"],
  ["gece",      "🌌","Gece",      "#ECEEF7","#3B4E8F"],
  ["toprak",    "🏺","Toprak",    "#F6EFE9","#96593C"],
];

// Kaldırılan temalar → en yakın yeni temaya taşınır (eski kayıtlar bozulmasın)
const TEMA_ESKI={mercan:"gunbatimi",nane:"zumrut",gokyuzu:"okyanus",kum:"bal",
  seftali:"gunbatimi",safir:"gece",ametist:"lavanta",nar:"gul",zeytin:"orman",turkuaz:"okyanus"};
function temaCoz(t){ return TEMALAR[t]?t:(TEMA_ESKI[t]||"acik"); }


// ═══ Karşılama hero — dünyadan manzaralar, 12 saniyede bir değişir ═══
// Fotoğraflar sabit link değil: Wikipedia'nın açık API'sinden çalışma anında çekilir
// ve cihazda 7 gün saklanır. Böylece link çürümesi olmaz.
const MANZARALAR=[
  {w:"Pragser Wildsee",y:"Lago di Braies",k:"İtalya"},
  {w:"Amalfi Coast",y:"Amalfi Sahilleri",k:"İtalya"},
  {w:"Val d'Orcia",y:"Toskana",k:"İtalya"},
  {w:"Colosseum",y:"Roma",k:"İtalya"},
  {w:"Grand Canal (Venice)",y:"Venedik",k:"İtalya"},
  {w:"Lofoten",y:"Lofoten Adaları",k:"Norveç"},
  {w:"Geirangerfjord",y:"Geirangerfjord",k:"Norveç"},
  {w:"Eiffel Tower",y:"Paris",k:"Fransa"},
  {w:"Provence",y:"Provence",k:"Fransa"},
  {w:"Santorini",y:"Santorini",k:"Yunanistan"},
  {w:"Meteora",y:"Meteora",k:"Yunanistan"},
  {w:"Matterhorn",y:"Matterhorn",k:"İsviçre"},
  {w:"Lauterbrunnen",y:"Lauterbrunnen",k:"İsviçre"},
  {w:"Sagrada Família",y:"Barselona",k:"İspanya"},
  {w:"Alhambra",y:"Elhamra Sarayı",k:"İspanya"},
  {w:"Hallstatt",y:"Hallstatt",k:"Avusturya"},
  {w:"Charles Bridge",y:"Prag",k:"Çekya"},
  {w:"Kirkjufell",y:"Kirkjufell",k:"İzlanda"},
  {w:"Tower Bridge",y:"Londra",k:"İngiltere"},
  {w:"Plitvice Lakes National Park",y:"Plitvice Gölleri",k:"Hırvatistan"},
  {w:"Neuschwanstein Castle",y:"Neuschwanstein",k:"Almanya"},
  {w:"Cappadocia",y:"Kapadokya",k:"Türkiye"},
  {w:"Pamukkale",y:"Pamukkale",k:"Türkiye"},
  {w:"Hagia Sophia",y:"İstanbul",k:"Türkiye"},
  {w:"Ölüdeniz",y:"Ölüdeniz",k:"Türkiye"},
  {w:"Mount Nemrut",y:"Nemrut Dağı",k:"Türkiye"},
  {w:"Mount Fuji",y:"Fuji Dağı",k:"Japonya"},
  {w:"Fushimi Inari-taisha",y:"Kyoto",k:"Japonya"},
  {w:"Tanah Lot",y:"Bali",k:"Endonezya"},
  {w:"Taj Mahal",y:"Tac Mahal",k:"Hindistan"},
  {w:"Maldives",y:"Maldivler",k:"Maldivler"},
  {w:"Hạ Long Bay",y:"Ha Long Koyu",k:"Vietnam"},
  {w:"Wat Arun",y:"Bangkok",k:"Tayland"},
  {w:"Phi Phi Islands",y:"Phi Phi Adaları",k:"Tayland"},
  {w:"Burj Khalifa",y:"Dubai",k:"BAE"},
  {w:"Petra",y:"Petra",k:"Ürdün"},
  {w:"Mount Everest",y:"Everest",k:"Nepal"},
  {w:"Great Wall of China",y:"Çin Seddi",k:"Çin"},
  {w:"Yellowstone National Park",y:"Yellowstone",k:"ABD"},
  {w:"Yosemite National Park",y:"Yosemite",k:"ABD"},
  {w:"Grand Canyon",y:"Büyük Kanyon",k:"ABD"},
  {w:"Brooklyn Bridge",y:"New York",k:"ABD"},
  {w:"Torres del Paine National Park",y:"Torres del Paine",k:"Şili"},
  {w:"Machu Picchu",y:"Machu Picchu",k:"Peru"},
  {w:"Moraine Lake",y:"Moraine Gölü",k:"Kanada"},
  {w:"Christ the Redeemer (statue)",y:"Rio de Janeiro",k:"Brezilya"},
  {w:"Serengeti",y:"Serengeti",k:"Tanzanya"},
  {w:"Table Mountain",y:"Cape Town",k:"Güney Afrika"},
  {w:"Sahara",y:"Sahra Çölü",k:"Afrika"},
  {w:"Milford Sound",y:"Milford Sound",k:"Yeni Zelanda"},
  {w:"Sydney Opera House",y:"Sydney",k:"Avustralya"},
];
// Fotoğraf çekilemezse gösterilecek yedek (gün dilimine göre)
const HERO_YEDEK={
  sabah:"https://images.unsplash.com/photo-1770341989953-f3efb336f7eb?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  ogle:"https://images.unsplash.com/photo-1770341989953-f3efb336f7eb?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  aksam:"https://images.unsplash.com/photo-1600672196900-c98c011a0977?fm=jpg&q=70&w=1400&auto=format&fit=crop",
  gece:"https://images.unsplash.com/photo-1756151224665-eba765e8c3b5?fm=jpg&q=70&w=1400&auto=format&fit=crop",
};
const MANZARA_SURE=12000;
const MANZARA_ANAHTAR="tf_manzara_v1";
let MANZARA_BELLEK=null;
function manzaraBellek(){
  if(MANZARA_BELLEK)return MANZARA_BELLEK;
  try{
    const h=JSON.parse(localStorage.getItem(MANZARA_ANAHTAR)||"{}");
    MANZARA_BELLEK=(h&&h.t&&Date.now()-h.t<7*86400000&&h.d)?h.d:{};
  }catch(e){MANZARA_BELLEK={};}
  return MANZARA_BELLEK;
}
function manzaraBellekYaz(){
  try{localStorage.setItem(MANZARA_ANAHTAR,JSON.stringify({t:Date.now(),d:MANZARA_BELLEK}));}catch(e){}
}
async function manzaraGetir(baslik){
  const b=manzaraBellek();
  if(b[baslik])return b[baslik];
  const r=await fetch("https://en.wikipedia.org/api/rest_v1/page/summary/"+encodeURIComponent(baslik.replace(/ /g,"_")));
  if(!r.ok)throw new Error("wiki "+r.status);
  const d=await r.json();
  const t=d&&d.thumbnail&&d.thumbnail.source;
  if(!t)throw new Error("gorsel yok");
  const u=t.replace(/\/\d+px-/,"/1280px-");
  b[baslik]=u; manzaraBellekYaz();
  return u;
}
const HERO_OVERLAY={
  sabah:"linear-gradient(180deg,rgba(30,35,45,0.10) 0%,rgba(20,28,40,0.05) 38%,rgba(15,20,30,0.62) 100%)",
  ogle:"linear-gradient(180deg,rgba(10,20,35,0.08) 0%,rgba(10,20,35,0.04) 38%,rgba(8,16,28,0.55) 100%)",
  aksam:"linear-gradient(180deg,rgba(60,25,15,0.18) 0%,rgba(50,20,15,0.08) 38%,rgba(35,14,12,0.68) 100%)",
  gece:"linear-gradient(180deg,rgba(6,10,24,0.30) 0%,rgba(6,10,24,0.20) 38%,rgba(4,7,20,0.78) 100%)",
};

// ═══ Dönen manzara karesi — hero'nun arka planı + konum rozeti ═══
function ManzaraKare({dilim,mobil}){
  const siraRef=useRef(null);
  if(siraRef.current===null){
    const d=MANZARALAR.map((_,i)=>i);
    for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}
    siraRef.current=d;
  }
  const sira=siraRef.current;
  const [adim,setAdim]=useState(0);
  // kare: {alt,ust,yer} — alt = ekrandaki eski foto, ust = üstüne açılan yeni foto
  const [kare,setKare]=useState({alt:null,ust:null,yer:null});
  const [hata,setHata]=useState(null);
  const bozukRef=useRef({});
  const azHareket=typeof window!=="undefined"&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ilerle=useCallback(()=>{
    setAdim(a=>{
      for(let i=1;i<=sira.length;i++){ if(!bozukRef.current[sira[(a+i)%sira.length]]) return a+i; }
      return a+1;
    });
  },[sira]);

  const ix=sira[adim%sira.length];
  const m=MANZARALAR[ix];

  // Yeni kareyi tamamen indirip çözdükten SONRA ekrana al — böylece geçiş takılmaz
  useEffect(()=>{
    let iptal=false;
    manzaraGetir(m.w)
      .then(u=>{
        const im=new Image();
        im.src=u;
        const hazir=im.decode?im.decode().catch(()=>new Promise(r=>{im.onload=r;im.onerror=r;})):new Promise(r=>{im.onload=r;im.onerror=r;});
        return hazir.then(()=>u);
      })
      .then(u=>{ if(!iptal){ setHata(null); setKare(k=>({alt:k.ust||k.alt,ust:u,yer:m.y+", "+m.k})); } })
      .catch(e=>{ if(!iptal){ console.warn("[TradeFlow] manzara:",m.w,e&&e.message);
        setHata(h=>h||((e&&e.message)||"bilinmeyen")); bozukRef.current[ix]=true; ilerle(); } });
    return ()=>{ iptal=true; };
  },[ix,m.w,m.y,m.k,ilerle]);

  // geçiş bitince alttaki eski kareyi düşür (bellekte iki resim tutmayalım)
  useEffect(()=>{
    if(!kare.alt||!kare.ust)return;
    const t=setTimeout(()=>setKare(k=>({...k,alt:null})),1000);
    return ()=>clearTimeout(t);
  },[kare.alt,kare.ust]);

  // sıradakini şimdiden indir
  useEffect(()=>{
    const n=MANZARALAR[sira[(adim+1)%sira.length]];
    if(n) manzaraGetir(n.w).then(u=>{ const im=new Image(); im.src=u; }).catch(()=>{});
  },[adim,sira]);

  useEffect(()=>{
    let t=null;
    const basla=()=>{ if(!t) t=setInterval(ilerle,MANZARA_SURE); };
    const dur=()=>{ if(t){clearInterval(t); t=null;} };
    const gorunur=()=>{ document.hidden?dur():basla(); };
    basla();
    document.addEventListener("visibilitychange",gorunur);
    return ()=>{ dur(); document.removeEventListener("visibilitychange",gorunur); };
  },[ilerle]);

  const dolgu={position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"};
  const goster=!!kare.ust;
  return <>
    {/* en altta yedek — ilk fotoğraf gelene kadar ekran hiç boş kalmaz */}
    {!goster&&<img src={HERO_YEDEK[dilim]} alt="" style={dolgu}/>}
    {/* eski kare: yeni kare üstünde açılırken altta bekler */}
    {kare.alt&&kare.alt!==kare.ust&&<img src={kare.alt} alt="" style={dolgu}/>}
    {/* yeni kare: yumuşakça açılır */}
    {goster&&<img key={kare.ust} src={kare.ust} alt={kare.yer||""}
      onError={()=>{ bozukRef.current[ix]=true; ilerle(); }}
      style={{...dolgu,willChange:"opacity",animation:azHareket?"none":"tfManzaraAc 900ms ease-out both"}}/>}
    <div style={{position:"absolute",inset:0,background:HERO_OVERLAY[dilim]}}/>
    {(goster||hata)&&<div onClick={ilerle} title="Sonraki manzara"
      style={{position:"absolute",top:mobil?12:10,right:mobil?12:12,zIndex:2,display:"inline-flex",alignItems:"center",gap:5,
        padding:mobil?"6px 11px":"5px 10px",borderRadius:100,background:"rgba(12,22,36,0.55)",
        border:"1px solid rgba(255,255,255,0.20)",color:"#fff",
        fontSize:mobil?11.5:11,fontWeight:600,maxWidth:"72%",cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
      <i className={"ti "+(goster?"ti-map-pin":"ti-alert-triangle")} style={{fontSize:mobil?12:11.5,opacity:.9}} aria-hidden="true"/>
      <span style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{goster?kare.yer:("foto yok — "+hata)}</span>
    </div>}
    <style>{"@keyframes tfManzaraAc{from{opacity:0}to{opacity:1}}"}</style>
  </>;
}


// ═══ ABONELİK PLANLARI ═══
let PLAN_AKTIF = "starter";
let TT = {};
const PLAN_LIMIT = { starter:{is:10, musteri:20} };
const planBilgi = () => [
  {id:"starter",ad:TT.planBaslangic||"Başlangıç",fiyat:TT.ucretsiz||"Ücretsiz",renk:"#6B7280",ozellik:TT.planOzStarter||["10 aktif iş","20 müşteri","Temel gelir-gider","Fotoğraf ekleme","Temel raporlar"]},
  {id:"pro",ad:"Pro",fiyat:"₺399/ay",etiket:TT.enPopuler||"EN POPÜLER",renk:"#1C4E60",ozellik:TT.planOzPro||["Sınırsız iş & müşteri","PDF teklif & fatura","WhatsApp'tan gönderim","Gelişmiş PDF raporlar","Tahsilat takibi & hatırlatma","Tema renkleri","Bulut yedekleme"]},
  {id:"elite",ad:"Elite",fiyat:"₺799/ay",renk:"#C9A24B",ozellik:TT.planOzElite||["Pro'daki her şey","Ekip & personel yönetimi","İş atama","Kâr analizi","Doğrulanmış Usta rozeti ✓","Öncelikli destek"]},
];
function PlanModal({onKapat,sebep,plan,denemeKalan,onPromo,omurBoyu}){
  const [kod,setKod]=useState("");
  const [promoSonuc,setPromoSonuc]=useState(null); // "ok" | "hata"
  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4}}>{TT.planYukselt||"👑 Planını Yükselt"}</div>
    {sebep&&<div style={{fontSize:12,color:C.red,fontWeight:600,marginBottom:6}}>⚠️ {sebep}</div>}
    {denemeKalan>0&&<div style={{fontSize:12,color:GOLD,fontWeight:700,marginBottom:6}}>{(TT.denemeOn||"🎁 Pro denemen")+": "+denemeKalan+" "+(TT.gunKaldi||"gün kaldı")}</div>}
    <div style={{fontSize:11,color:C.t3,marginBottom:14}}>{TT.planSlogan||"İşin büyüdükçe TradeFlow da seninle büyüsün"}</div>
    {planBilgi().map(p=><div key={p.id} style={{border:`2px solid ${p.id===plan?p.renk:C.border}`,borderRadius:16,padding:"16px",marginBottom:12,position:"relative",background:p.id==="pro"?C.purpleBg:C.card}}>
      {p.etiket&&<div style={{position:"absolute",top:-9,right:14,background:GOLD,color:"#fff",fontSize:9,fontWeight:800,padding:"3px 10px",borderRadius:8,letterSpacing:"0.06em"}}>{p.etiket}</div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:15,fontWeight:800,color:p.renk}}>{p.ad}{p.id===plan&&<span style={{fontSize:10,color:C.green,marginLeft:8}}>{TT.mevcutPlan||"✓ Mevcut planın"}</span>}</span>
        <span style={{fontSize:15,fontWeight:800,color:C.t1}}>{p.fiyat}</span>
      </div>
      {p.ozellik.map(o=><div key={o} style={{fontSize:12,color:C.t2,padding:"2px 0"}}>✓ {o}</div>)}
    </div>)}
    {/* 🎟️ Promosyon kodu */}
    <div style={{border:`1px dashed ${GOLD}`,borderRadius:14,padding:"14px",marginBottom:14,background:C.bg}}>
      <div style={{fontSize:12,fontWeight:700,color:C.t1,marginBottom:8}}>{TT.promosyonKodu||"🎟️ Promosyon Kodu"}</div>
      {(omurBoyu||promoSonuc==="ok")?
        <div style={{fontSize:13,fontWeight:700,color:C.green,textAlign:"center",padding:"6px 0"}}>{TT.promoTebrik||"🎉 Tebrikler! Ömür boyu ücretsiz Elite hizmetiniz tanımlandı."}</div>
        :<>
        <div style={{display:"flex",gap:8}}>
          <input value={kod} onChange={e=>{setKod(e.target.value.toUpperCase());setPromoSonuc(null);}} placeholder={TT.kodGir||"Kodunuzu girin"} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 12px",color:C.t1,fontSize:13,outline:"none",letterSpacing:"0.1em",fontWeight:700}}/>
          <button onClick={()=>{if(onPromo&&onPromo(kod.trim())){setPromoSonuc("ok");}else{setPromoSonuc("hata");}}} style={{background:GOLD,border:"none",borderRadius:10,padding:"0 18px",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer"}}>{TT.uygulaL||"Uygula"}</button>
        </div>
        {promoSonuc==="hata"&&<div style={{fontSize:11,color:C.red,fontWeight:600,marginTop:6}}>{TT.gecersizKod||"❌ Geçersiz kod. Kontrol edip tekrar deneyin."}</div>}
        </>}
    </div>
    <div style={{fontSize:11,color:C.t3,textAlign:"center",marginBottom:12}}>{TT.odemeYakinda||"💳 Online ödeme çok yakında!"}</div>
    <button onClick={onKapat} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>Kapat</button>
  </BottomSheet>;
}


// ═══ 👷 USTA PANELİ — çalışan görünümü (yalnız atanan işler) ═══
function UstaPanel({kullanici,T={}}){
  const [veri,setVeri]=useState(null);
  const [hata,setHata]=useState(null);
  const [sekme,setSekme]=useState("isler"); // isler | biten | profil
  const [secili,setSecili]=useState(null);
  const [harcamaAc,setHarcamaAc]=useState(null);
  const yukle=async()=>{
    try{
      const {data,error}=await supabase.rpc("usta_isler");
      if(error||!data||data.hata){setHata("Erişim yok. Patronunuz hesabınızı doğrulamalı.");return;}
      setVeri(data);
    }catch(e){setHata("Bağlantı hatası — internet gerekli.");}
  };
  useEffect(()=>{yukle();},[]);
  const asamaIlerlet=async(j)=>{
    const y=Math.min((j.asama||0)+1,ASAMALAR.length-1);
    const patch={asama:y};
    if(y===ASAMALAR.length-1)patch.durum="tamamlandi";
    await supabase.rpc("usta_is_guncelle",{is_id:j.id,yeni:patch});
    setSecili(null);yukle();
  };
  const tum=(veri&&veri.isler)||[];
  const acikIsler=tum.filter(j=>j.durum!=="tamamlandi");
  const bitenler=tum.filter(j=>j.durum==="tamamlandi");
  const bugun=new Date().toISOString().slice(0,10);
  const bugunku=acikIsler.filter(j=>(j.tarih||"")===bugun||(j.hatirlatma||"").startsWith(bugun)).length;
  const bh=((veri&&veri.ad)||"U").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

  // ── İstatistikler: bu hafta / bu ay / toplam tamamlanan (sadece kendi işleri, finansal veri yok) ──
  const simdi=new Date();
  const haftaBasi=new Date(simdi);haftaBasi.setDate(simdi.getDate()-simdi.getDay());haftaBasi.setHours(0,0,0,0);
  const ayBasi=new Date(simdi.getFullYear(),simdi.getMonth(),1);
  const bitenTarihli=(j)=>{const t=j.tarih?new Date(j.tarih):null;return t&&!isNaN(t);};
  const buHaftaBiten=bitenler.filter(j=>bitenTarihli(j)&&new Date(j.tarih)>=haftaBasi).length;
  const buAyBiten=bitenler.filter(j=>bitenTarihli(j)&&new Date(j.tarih)>=ayBasi).length;
  const toplamBiten=bitenler.length;

  // ── Rozet sistemi: toplam tamamlanan işe göre kademeli ──
  const ROZETLER=[
    {esik:0,ad:T.rozetCirak||"Çırak",ikon:"🔰",renk:"#94A3B8"},
    {esik:5,ad:T.rozetBronz||"Bronz Usta",ikon:"🥉",renk:"#B45309"},
    {esik:15,ad:T.rozetGumus||"Gümüş Usta",ikon:"🥈",renk:"#64748B"},
    {esik:30,ad:T.rozetAltin||"Altın Usta",ikon:"🥇",renk:"#D97706"},
    {esik:50,ad:T.rozetElmas||"Elmas Usta",ikon:"💎",renk:"#0EA5E9"},
  ];
  let rozetIdx=0;
  for(let i=0;i<ROZETLER.length;i++){if(toplamBiten>=ROZETLER[i].esik)rozetIdx=i;}
  const aktifRozet=ROZETLER[rozetIdx];
  const sonrakiRozet=ROZETLER[rozetIdx+1]||null;
  const rozetIlerleme=sonrakiRozet?Math.min(100,Math.round(((toplamBiten-aktifRozet.esik)/(sonrakiRozet.esik-aktifRozet.esik))*100)):100;

  // ── Günün sözü: tarihe göre deterministik, her gün aynı söz ──
  const SOZLER=[T.soz1,T.soz2,T.soz3,T.soz4,T.soz5,T.soz6,T.soz7,T.soz8,T.soz9,T.soz10].filter(Boolean);
  const yilinGunu=Math.floor((simdi-new Date(simdi.getFullYear(),0,0))/864e5);
  const gununSozu=SOZLER[yilinGunu%SOZLER.length];

  // ── Karşılama: saat/gün dilimi ──
  const saatSimdi=simdi.getHours();
  const dilim=gunDilimi(saatSimdi);
  const DILIM_KEY={sabah:["selamSabah","altSabah"],ogle:["selamOgle","altOgle"],aksam:["selamAksam","altAksam"],gece:["selamGece","altGece"]}[dilim];
  const selam=T[DILIM_KEY[0]]||DILIM_METIN[dilim].selam;
  const ustaAd=((veri&&veri.ad)||"").split(" ")[0]||"";

  const IsKart=(j)=><Sh key={j.id} s={{padding:"14px 15px",marginBottom:10}}>
    <div onClick={()=>setSecili(secili===j.id?null:j.id)} style={{display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
      <div style={{width:44,height:44,borderRadius:12,background:j.iconBg||C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:21,flexShrink:0}}>{j.icon||"🔧"}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:14,fontWeight:800,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
        <div style={{fontSize:11.5,color:C.t3}}>{j.musteri} · {j.tarih}</div>
      </div>
      <span style={{fontSize:10,fontWeight:800,color:j.durum==="tamamlandi"?C.green:P,background:j.durum==="tamamlandi"?C.greenBg:C.purpleBg,borderRadius:8,padding:"4px 9px",whiteSpace:"nowrap"}}>{j.durum==="tamamlandi"?"✅ Bitti":ASAMALAR[j.asama||0]}</span>
    </div>
    {secili===j.id&&<div style={{marginTop:12,borderTop:`1px solid ${C.border}`,paddingTop:12}}>
      {j.isAdresi&&<div style={{display:"flex",gap:8,marginBottom:10}}>
        <div style={{flex:1,background:C.bg,borderRadius:11,padding:"9px 11px",fontSize:11.5,color:C.t2}}>📍 {j.isAdresi}</div>
        <button onClick={()=>window.open("https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(j.isAdresi),"_blank")} style={{background:C.bg,border:"none",borderRadius:11,padding:"0 13px",fontSize:15,cursor:"pointer"}}>🗺️</button>
        {j.musteriTelefon&&<button onClick={()=>window.open("tel:"+j.musteriTelefon)} style={{background:C.bg,border:"none",borderRadius:11,padding:"0 13px",fontSize:15,cursor:"pointer"}}>📞</button>}
      </div>}
      {j.malzemeler&&<div style={{background:C.bg,borderRadius:11,padding:"9px 11px",fontSize:11.5,color:C.t2,whiteSpace:"pre-wrap",marginBottom:10}}>🧰 {j.malzemeler}</div>}
      {(j.fotolar||[]).length>0&&<div style={{display:"flex",gap:8,overflowX:"auto",marginBottom:10,paddingBottom:2}}>
        {j.fotolar.map((f,i)=><img key={i} src={f} alt={"foto"+i} style={{width:64,height:64,borderRadius:10,objectFit:"cover",border:`1px solid ${C.border}`,flexShrink:0}}/>)}
      </div>}
      {j.not&&<div style={{background:"#FBF6EA",borderRadius:11,padding:"9px 11px",fontSize:11.5,color:"#92600A",whiteSpace:"pre-wrap",marginBottom:10}}>📝 {j.not}</div>}
      {j.durum!=="tamamlandi"&&<>
        <div style={{display:"flex",alignItems:"center",gap:4,margin:"4px 0 10px"}}>
          {ASAMALAR.map((a,i)=><div key={a} style={{flex:1,height:6,borderRadius:4,background:i<=(j.asama||0)?P:C.border}}/>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>asamaIlerlet(j)} style={{flex:1.4,background:GRAD,border:"none",borderRadius:12,padding:"12px 0",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Sonraki Aşama ›</button>
          <button onClick={()=>setHarcamaAc(j.id)} style={{flex:1,background:C.amberBg,border:"none",borderRadius:12,padding:"12px 0",color:"#92600A",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>🧾 Harcama</button>
        </div>
      </>}
    </div>}
  </Sh>;

  return <div style={{minHeight:"100vh",background:C.bg,fontFamily:"-apple-system,sans-serif",display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:520,padding:"48px 14px 96px"}}>
      {/* Karşılama — gökyüzü sahnesi */}
      <div style={{padding:"2px 2px 4px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
        <GokyuzuSahne saat={saatSimdi} dk={simdi.getMinutes()} g={56}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:20,fontWeight:800,color:C.t1,letterSpacing:"-0.02em",lineHeight:1.2}}>{selam}{ustaAd?", "+ustaAd:""}</div>
          <div style={{fontSize:12,color:C.t3,marginTop:3}}>{T[DILIM_KEY[1]]||DILIM_METIN[dilim].alt}</div>
        </div>
      </div>
      {/* Üst kimlik kartı */}
      <Sh s={{padding:"16px",marginBottom:14,display:"flex",alignItems:"center",gap:13}}>
        <div style={{position:"relative",flexShrink:0}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:GRAD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,color:"#fff"}}>{bh}</div>
          <div style={{position:"absolute",bottom:-4,right:-4,width:22,height:22,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>{aktifRozet.ikon}</div>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:17,fontWeight:800,color:C.t1}}>{(veri&&veri.ad)||"Usta"}</div>
          <div style={{fontSize:11,color:C.t3}}>👷 {(veri&&veri.rol)||"Usta"} · {aktifRozet.ad}</div>
        </div>
        <div style={{textAlign:"right"}}><span style={{fontSize:10,fontWeight:700,letterSpacing:"0.3em",color:"#1B2A4A"}}>ERA</span><span style={{fontSize:10,fontWeight:700,color:"#E4335A"}}>İ</span></div>
      </Sh>
      {/* Özet sayılar */}
      <div style={{display:"flex",gap:10,marginBottom:16}}>
        {[[T.ustaAktifIsim||"Aktif İşim",acikIsler.length,P],[T.ustaBugunku||"Bugünkü",bugunku,"#F59E0B"],[T.ustaBitirdigim||"Bitirdiğim",bitenler.length,"#0E9F6E"]].map(([l,v,r])=><Sh key={l} s={{flex:1,padding:"12px 8px",textAlign:"center"}}>
          <div style={{fontSize:20,fontWeight:800,color:r}}>{v}</div>
          <div style={{fontSize:10,color:C.t3,marginTop:2}}>{l}</div>
        </Sh>)}
      </div>
      {hata&&<div style={{background:C.amberBg,borderRadius:14,padding:"13px 15px",fontSize:12.5,color:"#92600A",marginBottom:12}}>⚠️ {hata}</div>}
      {!veri&&!hata&&<div style={{textAlign:"center",color:C.t3,padding:"40px 0"}}>Yükleniyor...</div>}

      {sekme==="isler"&&<>
        <div style={{fontSize:15,fontWeight:800,color:C.t1,margin:"0 2px 11px"}}>📋 {T.ustaIslerim||"İşlerim"}</div>
        {veri&&acikIsler.length===0&&<Sh s={{padding:"18px",textAlign:"center"}}><div style={{fontSize:13,color:C.t3}}>{T.ustaBosIs||"Şu an atanmış açık işin yok. Patronun iş atadığında burada görünecek. 💪"}</div></Sh>}
        {acikIsler.map(IsKart)}
        <div style={{marginTop:16}}><PiyasaSeridi C={C} P={P} T={T}/></div>
      </>}
      {sekme==="biten"&&<>
        <div style={{fontSize:15,fontWeight:800,color:C.t1,margin:"0 2px 11px"}}>✅ Bitirdiklerim</div>
        {veri&&bitenler.length===0&&<Sh s={{padding:"18px",textAlign:"center"}}><div style={{fontSize:13,color:C.t3}}>{T.ustaBosBiten||"Henüz tamamlanan işin yok — ilk işini bitirince burada listelenecek."}</div></Sh>}
        {bitenler.map(IsKart)}
      </>}
      {sekme==="profil"&&<>
        <div style={{fontSize:15,fontWeight:800,color:C.t1,margin:"0 2px 11px"}}>👤 {T.ustaHesabim||"Hesabım"}</div>

        {/* Rozet Kartı */}
        <Sh s={{padding:"18px 16px",marginBottom:12,background:`linear-gradient(135deg,${aktifRozet.renk}22,${aktifRozet.renk}08)`,border:`1px solid ${aktifRozet.renk}33`}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:56,height:56,borderRadius:16,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>{aktifRozet.ikon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:15,fontWeight:800,color:C.t1}}>{aktifRozet.ad}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:2}}>{(T.rozetTamamladin||"{n} iş tamamladın").replace("{n}",toplamBiten)}</div>
            </div>
          </div>
          {sonrakiRozet&&<div style={{marginTop:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:10.5,color:C.t3,marginBottom:5}}>
              <span>{T.rozetSonraki||"Sonraki"}: {sonrakiRozet.ikon} {sonrakiRozet.ad}</span>
              <span>{toplamBiten}/{sonrakiRozet.esik}</span>
            </div>
            <div style={{height:7,background:"#fff",borderRadius:6,overflow:"hidden"}}>
              <div style={{height:"100%",width:rozetIlerleme+"%",background:aktifRozet.renk,borderRadius:6,transition:"width 0.4s"}}/>
            </div>
          </div>}
        </Sh>

        {/* İstatistikler */}
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          {[[T.statBuHafta||"Bu Hafta",buHaftaBiten,"#2563EB"],[T.statBuAy||"Bu Ay",buAyBiten,"#0E9F6E"],[T.statToplam||"Toplam",toplamBiten,"#7C3AED"]].map(([l,v,r])=><Sh key={l} s={{flex:1,padding:"12px 8px",textAlign:"center"}}>
            <div style={{fontSize:19,fontWeight:800,color:r}}>{v}</div>
            <div style={{fontSize:9.5,color:C.t3,marginTop:2}}>{l} {T.statTamamlanan||"Tamamlanan"}</div>
          </Sh>)}
        </div>

        {/* Günün Sözü */}
        <Sh s={{padding:"14px 16px",marginBottom:12,background:"#F5F3FF"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#7C3AED",letterSpacing:"0.06em",textTransform:"uppercase",marginBottom:6}}>💬 {T.gununSozuBaslik||"Günün Sözü"}</div>
          <div style={{fontSize:12.5,color:"#4C1D95",lineHeight:1.5,fontStyle:"italic"}}>"{gununSozu}"</div>
        </Sh>

        {/* İş Raporum PDF */}
        <button onClick={()=>ustaIsRaporuPdf(tum,(veri&&veri.ad)||"Usta")} style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 15px",marginBottom:12,display:"flex",alignItems:"center",gap:11,cursor:"pointer",boxShadow:C.sh}}>
          <div style={{width:36,height:36,borderRadius:11,background:"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:17}}>📄</div>
          <div style={{flex:1,textAlign:"left"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{T.pdfRaporBaslik||"İş Raporumu İndir"}</div>
            <div style={{fontSize:10.5,color:C.t3,marginTop:1}}>{T.pdfRaporAlt||"Tüm işlerin PDF özeti (tutar içermez)"}</div>
          </div>
          <span style={{fontSize:13,color:C.t3}}>›</span>
        </button>

        <Sh s={{padding:"6px 0",marginBottom:12}}>
          <SifreDegistir onBitti={()=>{}} gomulu/>
        </Sh>
        <button onClick={()=>supabase.auth.signOut()} style={{width:"100%",background:C.redBg,border:"none",borderRadius:14,padding:"14px 0",color:C.red,fontSize:14,fontWeight:700,cursor:"pointer"}}>🚪 {T.cikisYap||"Çıkış Yap"}</button>
        <div style={{textAlign:"center",marginTop:16,fontSize:11,color:C.t3}}>TradeFlow Elite · Usta Sürümü</div>
      </>}

      {/* Alt menü */}
      <div style={{position:"fixed",bottom:10,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 24px)",maxWidth:496,background:C.card,display:"flex",alignItems:"center",padding:"9px 8px",borderRadius:24,boxShadow:"0 10px 30px rgba(80,60,140,0.16)",border:`1px solid ${C.border}`,zIndex:100}}>
        {[["isler","📋",T.ustaIslerim||"İşlerim"],["harcama","🧾",T.ustaHarcama||"Harcama"],["biten","✅",T.ustaBitenler||"Bitenler"],["profil","👤",T.ustaHesabim||"Hesabım"]].map(([id,ik,l])=>{
          const aktif=sekme===id&&id!=="harcama";
          return <div key={id} onClick={()=>id==="harcama"?setHarcamaAc(true):setSekme(id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"7px 0 5px",background:aktif?"#DCE7F8":"transparent",borderRadius:15,margin:"0 3px"}}>
            <span style={{fontSize:19}}>{ik}</span>
            <span style={{fontSize:10.5,fontWeight:700,color:aktif?"#2563EB":C.t3}}>{l}</span>
          </div>;
        })}
      </div>

      {harcamaAc&&<BottomSheet onKapat={()=>setHarcamaAc(null)}>
        <UstaHarcama isId={harcamaAc} onBitti={()=>{setHarcamaAc(null);}}/>
      </BottomSheet>}
    </div>
  </div>;
}
function SifreDegistir({onBitti,gomulu}){
  const [s1,setS1]=useState("");const [s2,setS2]=useState("");const [msg,setMsg]=useState("");
  return <div style={{padding:gomulu?"0 14px 14px":0}}>
    <div style={{fontSize:gomulu?13:16,fontWeight:800,color:C.t1,marginBottom:12,padding:gomulu?"12px 14px 0":0}}>🔑 Şifre Değiştir</div>
    <input type="password" value={s1} onChange={e=>setS1(e.target.value)} placeholder="Yeni şifre (en az 6 karakter)" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 15px",fontSize:14,outline:"none",marginBottom:10,color:C.t1}}/>
    <input type="password" value={s2} onChange={e=>setS2(e.target.value)} placeholder="Yeni şifre (tekrar)" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"13px 15px",fontSize:14,outline:"none",marginBottom:10,color:C.t1}}/>
    {msg&&<div style={{fontSize:12,color:msg.startsWith("✅")?C.green:C.red,fontWeight:700,marginBottom:10}}>{msg}</div>}
    <button onClick={async()=>{
      if(s1.length<6){setMsg("Şifre en az 6 karakter olmalı");return;}
      if(s1!==s2){setMsg("⚠️ Şifreler aynı değil — tekrar kontrol et");return;}
      const {error}=await supabase.auth.updateUser({password:s1});
      if(error){setMsg("Değiştirilemedi — tekrar deneyin");}else{setMsg("✅ Şifren değişti!");setTimeout(onBitti,1200);}
    }} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>Kaydet</button>
  </div>;
}
function UstaHarcama({isId,onBitti}){
  const [f,setF]=useState({ad:"",tutar:"",fisFoto:null});
  const [msg,setMsg]=useState("");
  const fotoSec=(e)=>{
    const dosya=e.target.files&&e.target.files[0];if(!dosya)return;
    const fr=new FileReader();
    fr.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement("canvas");const oran=Math.min(1,900/img.width);
        c.width=img.width*oran;c.height=img.height*oran;
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        setF(p=>({...p,fisFoto:c.toDataURL("image/jpeg",0.6)}));
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(dosya);
  };
  return <div>
    <div style={{fontSize:16,fontWeight:800,color:C.t1,marginBottom:4}}>🧾 Harcama Bildir</div>
    <div style={{fontSize:11,color:C.t3,marginBottom:12}}>Malzeme, yakıt, yemek... Fiş fotoğrafıyla patronunun onayına gider.</div>
    <input value={f.ad} onChange={e=>setF(p=>({...p,ad:e.target.value}))} placeholder="Ne aldın? (örn: 2 torba çimento)" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",fontSize:14,outline:"none",marginBottom:10,color:C.t1}}/>
    <input type="number" value={f.tutar} onChange={e=>setF(p=>({...p,tutar:e.target.value}))} placeholder="Tutar (TL)" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",fontSize:14,outline:"none",marginBottom:10,color:C.t1}}/>
    <label style={{display:"block",background:f.fisFoto?C.greenBg:C.bg,border:`1.5px dashed ${f.fisFoto?C.green:C.border}`,borderRadius:12,padding:"13px 0",textAlign:"center",fontSize:13,fontWeight:700,color:f.fisFoto?C.green:C.t2,cursor:"pointer",marginBottom:12}}>
      {f.fisFoto?"✅ Fiş fotoğrafı eklendi":"📷 Fiş fotoğrafı çek / seç"}
      <input type="file" accept="image/*" capture="environment" onChange={fotoSec} style={{display:"none"}}/>
    </label>
    {msg&&<div style={{fontSize:12,color:msg.startsWith("✅")?C.green:C.red,fontWeight:700,marginBottom:10}}>{msg}</div>}
    <button onClick={async()=>{
      if(!f.ad||!f.tutar){setMsg("Açıklama ve tutar gerekli");return;}
      const {data,error}=await supabase.rpc("usta_harcama_ekle",{h:{ad:f.ad,tutar:parseFloat(f.tutar)||0,isId:isId===true?null:isId,fisFoto:f.fisFoto,tarih:new Date().toISOString().slice(0,10)}});
      if(error||(data&&data.hata)){setMsg("Gönderilemedi — internet kontrolü yap");}else{setMsg("✅ Patronunun onayına gönderildi!");setTimeout(onBitti,1200);}
    }} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>Gönder</button>
  </div>;
}

// 🧾 Usta Harcamaları — işveren onay kuyruğu
function UstaHarcamaKuyrugu({harcamalar,onOnay,onRed}){
  const [fotoAc,setFotoAc]=useState(null);
  const bekleyen=harcamalar.filter(h=>h.durum==="bekliyor");
  if(bekleyen.length===0)return null;
  return <div style={{margin:"14px 14px 0"}}>
    <div style={{fontSize:12,fontWeight:800,color:"#92600A",marginBottom:9}}>🧾 Usta Harcamaları — {bekleyen.length} onay bekliyor</div>
    {bekleyen.map(h=><Sh key={h.id} s={{padding:"13px 15px",marginBottom:10,borderLeft:"3px solid #F59E0B"}}>
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        {h.fisFoto
          ?<img src={h.fisFoto} onClick={()=>setFotoAc(h.fisFoto)} alt="" style={{width:46,height:46,borderRadius:10,objectFit:"cover",cursor:"pointer",flexShrink:0,border:`1px solid ${C.border}`}}/>
          :<div style={{width:46,height:46,borderRadius:10,background:C.amberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🧾</div>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13.5,fontWeight:800,color:C.t1}}>{h.ad}</div>
          <div style={{fontSize:11,color:C.t3}}>👷 {h.usta} · {h.tarih}{h.fisFoto?" · 📷 fişe dokun":""}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:15,fontWeight:800,color:"#B4690E",marginBottom:5}}>{fmt(h.tutar)}</div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>onRed(h)} style={{background:C.redBg,border:"none",borderRadius:9,padding:"6px 10px",fontSize:11,fontWeight:800,color:C.red,cursor:"pointer"}}>❌</button>
            <button onClick={()=>onOnay(h)} style={{background:C.greenBg,border:"none",borderRadius:9,padding:"6px 12px",fontSize:11,fontWeight:800,color:C.green,cursor:"pointer"}}>✅ Onayla</button>
          </div>
        </div>
      </div>
    </Sh>)}
    {fotoAc&&<div onClick={()=>setFotoAc(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",padding:16}}>
      <img src={fotoAc} alt="" style={{maxWidth:"100%",maxHeight:"90vh",borderRadius:14}}/>
    </div>}
  </div>;
}

// 📅 Takvim — işlerin ay görünümü
function TakvimEkrani({onKapat,jobs,onIsSec}){
  const bugun=new Date();
  const [ay,setAy]=useState(new Date(bugun.getFullYear(),bugun.getMonth(),1));
  const [seciliGun,setSeciliGun]=useState(bugun.toISOString().slice(0,10));
  const AYLAR=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const GUNLER=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
  const ilkGun=(ay.getDay()+6)%7; // Pazartesi=0
  const gunSayisi=new Date(ay.getFullYear(),ay.getMonth()+1,0).getDate();
  const tarihStr=(g)=>ay.getFullYear()+"-"+String(ay.getMonth()+1).padStart(2,"0")+"-"+String(g).padStart(2,"0");
  const gunIsleri=(t)=>jobs.filter(j=>(j.tarih||"")===t||(j.hatirlatma||"").startsWith(t));
  const seciliIsler=gunIsleri(seciliGun);
  const bugunStr=bugun.toISOString().slice(0,10);
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,overflowY:"auto"}}>
    <div style={{maxWidth:560,margin:"0 auto",padding:"0 14px 40px"}}>
      <GeriBaslik baslik="📅 Takvim" onKapat={onKapat}/>
      <Sh s={{padding:"14px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={()=>setAy(new Date(ay.getFullYear(),ay.getMonth()-1,1))} style={{background:C.bg,border:"none",borderRadius:10,width:36,height:36,fontSize:16,color:C.t1,cursor:"pointer"}}>‹</button>
          <div style={{fontSize:15,fontWeight:800,color:C.t1}}>{AYLAR[ay.getMonth()]} {ay.getFullYear()}</div>
          <button onClick={()=>setAy(new Date(ay.getFullYear(),ay.getMonth()+1,1))} style={{background:C.bg,border:"none",borderRadius:10,width:36,height:36,fontSize:16,color:C.t1,cursor:"pointer"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
          {GUNLER.map(g=><div key={g} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.t3}}>{g}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {Array.from({length:ilkGun}).map((_,i)=><div key={"b"+i}/>)}
          {Array.from({length:gunSayisi}).map((_,i)=>{
            const g=i+1,t=tarihStr(g),iler=gunIsleri(t),secili=t===seciliGun,bugunMu=t===bugunStr;
            return <div key={g} onClick={()=>setSeciliGun(t)} style={{aspectRatio:"1",borderRadius:11,background:secili?P:bugunMu?C.purpleBg:"transparent",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",border:bugunMu&&!secili?`1.5px solid ${P}`:"1.5px solid transparent"}}>
              <span style={{fontSize:12.5,fontWeight:bugunMu||secili?800:600,color:secili?"#fff":C.t1}}>{g}</span>
              {iler.length>0&&<div style={{display:"flex",gap:2,marginTop:2}}>
                {iler.slice(0,3).map((j,x)=><span key={x} style={{width:4,height:4,borderRadius:"50%",background:secili?"#fff":j.durum==="tamamlandi"?"#0E9F6E":"#F59E0B"}}/>)}
              </div>}
            </div>;
          })}
        </div>
      </Sh>
      <div style={{fontSize:13,fontWeight:800,color:C.t1,margin:"0 2px 10px"}}>{new Date(seciliGun).toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})} · {seciliIsler.length} iş</div>
      {seciliIsler.length===0&&<Sh s={{padding:"16px",textAlign:"center"}}><div style={{fontSize:13,color:C.t3}}>Bu güne planlı iş yok</div></Sh>}
      {seciliIsler.map(j=><Sh key={j.id} s={{padding:"13px 15px",marginBottom:9,cursor:"pointer"}} onClick={()=>onIsSec(j)}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{width:40,height:40,borderRadius:11,background:j.iconBg||C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:19,flexShrink:0}}>{j.icon||"🔧"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13.5,fontWeight:800,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
            <div style={{fontSize:11,color:C.t3}}>{j.musteri}{(j.hatirlatma||"").startsWith(seciliGun)?" · ⏰ "+(j.hatirlatma||"").slice(11,16):""}</div>
          </div>
          <span style={{fontSize:10,fontWeight:800,color:j.durum==="tamamlandi"?C.green:P}}>{j.durum==="tamamlandi"?"✅":fmt(j.tutar)}</span>
        </div>
      </Sh>)}
    </div>
  </div>;
}

// 🗑️ Çöp Kutusu — 30 gün geri kurtarma
function CopKutusuEkrani({onKapat,copKutusu,onGeriAl,onKaliciSil}){
  const TIP={is:["📋","İş"],gider:["💸","Gider"],fatura:["🧾","Fatura"]};
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,overflowY:"auto"}}>
    <div style={{maxWidth:560,margin:"0 auto",padding:"0 14px 40px"}}>
      <GeriBaslik baslik="🗑️ Çöp Kutusu" onKapat={onKapat}/>
      <div style={{fontSize:11.5,color:C.t3,margin:"0 2px 14px"}}>Silinenler burada <b>30 gün</b> saklanır, sonra kendiliğinden kalıcı silinir.</div>
      {copKutusu.length===0&&<Sh s={{padding:"22px",textAlign:"center"}}><div style={{fontSize:13,color:C.t3}}>Çöp kutusu boş 🎉</div></Sh>}
      {copKutusu.map((c,i)=>{
        const [ik,ad]=TIP[c.tip]||["📄",c.tip];
        const kalan=Math.max(0,30-Math.floor((Date.now()-new Date(c.silinme).getTime())/86400000));
        const baslik=c.veri.baslik||c.veri.ad||("Fatura "+(c.veri.no||""));
        return <Sh key={i} s={{padding:"13px 15px",marginBottom:9}}>
          <div style={{display:"flex",alignItems:"center",gap:11}}>
            <div style={{width:40,height:40,borderRadius:11,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{ik}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:800,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{baslik}</div>
              <div style={{fontSize:10.5,color:C.t3}}>{ad}{c.veri.tutar?" · "+fmt(c.veri.tutar):""} · ⏳ {kalan} gün kaldı</div>
            </div>
            <button onClick={()=>onKaliciSil(i)} style={{background:C.redBg,border:"none",borderRadius:9,padding:"7px 10px",fontSize:11,fontWeight:800,color:C.red,cursor:"pointer",marginRight:6}}>Kalıcı Sil</button>
            <button onClick={()=>onGeriAl(i)} style={{background:C.greenBg,border:"none",borderRadius:9,padding:"7px 11px",fontSize:11,fontWeight:800,color:C.green,cursor:"pointer"}}>↩️ Geri Al</button>
          </div>
        </Sh>;
      })}
    </div>
  </div>;
}
// ═══ KURUCU PANELİ ═══
// ═══ DESTEK İLETİŞİM — tek yerden yönetilir ═══
const DESTEK_EMAIL = ""; // Destek adresi belirlenince buraya yazılacak — boşsa satır gizlenir
const DESTEK_TEL = ""; // Örn: "905321234567" — boşsa WhatsApp satırı gizlenir
const DESTEK_SAAT = "Hafta içi 09:00–18:00";
const KURUCU_EMAIL = "eryozgl3535@gmail.com";
let KURUCU_MU = false;
function KurucuPanel({onKapat}){
  const [veri,setVeri]=useState(null);
  const [hata,setHata]=useState(null);
  useEffect(()=>{
    (async()=>{
      try{
        const {data,error}=await supabase.rpc("kurucu_istatistik");
        if(error){setHata("Supabase fonksiyonu bulunamadı. SQL kurulumunu yapın.");return;}
        if(data&&data.hata){setHata("Bu panele yalnızca kurucu erişebilir.");return;}
        setVeri(data);
      }catch(e){setHata("Bağlantı hatası — internet kontrolü yapın.");}
    })();
  },[]);
  const K=({l,v,renk})=><div style={{flex:1,minWidth:130,border:`1px solid ${C.border}`,borderLeft:`3px solid ${renk||P}`,borderRadius:12,padding:"13px 14px",background:C.card}}>
    <div style={{fontSize:11,color:C.t3,marginBottom:4}}>{l}</div>
    <div style={{fontSize:22,fontWeight:800,color:renk||C.t1}}>{v??"—"}</div>
  </div>;
  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:2}}>👑 Kurucu Paneli</div>
    <div style={{fontSize:11,color:GOLD,fontWeight:700,marginBottom:16}}>TradeFlow Elite — Yalnızca kurucu görebilir</div>
    {hata&&<div style={{background:C.amberBg,borderRadius:12,padding:"12px 14px",fontSize:12,color:"#92600A",marginBottom:14}}>⚠️ {hata}</div>}
    {!veri&&!hata&&<div style={{textAlign:"center",padding:"30px 0",color:C.t3,fontSize:13}}>Yükleniyor...</div>}
    {veri&&<>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
        <K l="Toplam Üye" v={veri.toplam_uye}/>
        <K l="Bugün Katılan" v={veri.bugun} renk={C.green}/>
        <K l="Bu Hafta" v={veri.bu_hafta} renk={C.blue}/>
      </div>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",margin:"6px 0 8px"}}>Plan Dağılımı</div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:16}}>
        <K l="Elite" v={veri.elite} renk={GOLD}/>
        <K l="Pro" v={veri.pro} renk={P}/>
        <K l="Ömür Boyu 🎟️" v={veri.omur_boyu} renk={C.green}/>
        <K l="Veri Kaydı Olan" v={veri.aktif_veri}/>
      </div>
    </>}
    <button onClick={onKapat} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>Kapat</button>
  </BottomSheet>;
}

// 🏅 Müşteri ödeme skoru — tahsilat oranı + bekleyen iş yaşına göre otomatik
function musteriSkor(isler){
  if(!isler||isler.length===0)return{emoji:"⚪",ad:TT.skorYeni||"Yeni",renk:"#9CA3AF",puan:null,aciklama:TT.skorYeniAcik||"Henüz iş kaydı yok"};
  const toplam=isler.reduce((s,j)=>s+j.tutar,0);
  const tahsil=isler.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0)
    +isler.filter(j=>j.durum!=="tamamlandi").reduce((s,j)=>s+(j.odemeler||[]).reduce((ss,o)=>ss+o.tutar,0),0);
  const oran=toplam>0?Math.min(tahsil/toplam,1):1;
  const acik=isler.filter(j=>j.durum!=="tamamlandi");
  const enEski=acik.length?Math.max(0,...acik.map(j=>Math.floor((Date.now()-new Date(j.tarih).getTime())/86400000))):0;
  const puan=Math.round(oran*100);
  const detay=(TT.skorOdenmis||"Ödemelerin %{p}'i alınmış").replace("{p}",puan)+(enEski>0?" · "+(TT.skorEnEski||"en eski bekleyen iş {g} gün").replace("{g}",enEski):"")+" · "+isler.length+" "+(TT.isBirim||"iş");
  if(oran>=0.85&&enEski<=30)return{emoji:"🟢",ad:TT.skorSorunsuz||"Sorunsuz",renk:"#0E8A5F",puan,aciklama:detay};
  if(oran>=0.45&&enEski<=60)return{emoji:"🟡",ad:TT.skorTakip||"Takip Et",renk:"#B4690E",puan,aciklama:detay};
  return{emoji:"🔴",ad:TT.skorProblemli||"Problemli",renk:"#C0392B",puan,aciklama:detay};
}

// 🔊 Ses efektleri — dosya gerektirmez, Web Audio ile üretilir
let SES_ACIK = true;
function calSes(tip){
  if(!SES_ACIK)return;
  try{
    const ctx=calSes._ctx||(calSes._ctx=new (window.AudioContext||window.webkitAudioContext)());
    const nota=(frek,bas,sure,tur)=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type=tur||"sine";o.frequency.value=frek;
      g.gain.setValueAtTime(0.001,ctx.currentTime+bas);
      g.gain.exponentialRampToValueAtTime(0.12,ctx.currentTime+bas+0.015);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+bas+sure);
      o.connect(g);g.connect(ctx.destination);
      o.start(ctx.currentTime+bas);o.stop(ctx.currentTime+bas+sure+0.05);
    };
    if(tip==="para"){nota(880,0,0.09,"triangle");nota(1320,0.09,0.16,"triangle");}
    else if(tip==="basari"){nota(523,0,0.1);nota(784,0.1,0.18);}
    else if(tip==="sil"){nota(300,0,0.12,"square");nota(200,0.1,0.16,"square");}
    else{nota(660,0,0.06);}
  }catch(e){}
}

// ── İş aşamaları ──
const ASAMALAR=["📝 Onay","📦 Malzeme","🔨 Başladı","⚙️ Devam","✅ Bitti"];

// ── 🎙️ Sesli Not (mikrofon → işe kayıt) ──
function SesliNot({deger,onKaydet,onSil}){
  const [kayitta,setKayitta]=useState(false);
  const [sure,setSure]=useState(0);
  const ref=useRef({});
  const basla=async()=>{
    try{
      const akis=await navigator.mediaDevices.getUserMedia({audio:true});
      const mr=new MediaRecorder(akis);
      const parcalar=[];
      mr.ondataavailable=e=>parcalar.push(e.data);
      mr.onstop=()=>{
        akis.getTracks().forEach(t=>t.stop());
        const blob=new Blob(parcalar,{type:mr.mimeType||"audio/webm"});
        if(blob.size>800*1024){alert("Kayıt çok uzun — 60 saniyeyi geçmeyin.");return;}
        const fr=new FileReader();fr.onload=()=>onKaydet(fr.result);fr.readAsDataURL(blob);
      };
      mr.start();ref.current.mr=mr;setKayitta(true);setSure(0);
      ref.current.tik=setInterval(()=>setSure(s=>{if(s>=59){durdur();return s;}return s+1;}),1000);
    }catch(e){alert("Mikrofon izni gerekli. Tarayıcı ayarlarından izin verin.");}
  };
  const durdur=()=>{clearInterval(ref.current.tik);try{ref.current.mr&&ref.current.mr.state!=="inactive"&&ref.current.mr.stop();}catch(e){}setKayitta(false);};
  return <div style={{marginBottom:14}}>
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>🎙️ Sesli Not</div>
    {deger?<Sh s={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
      <audio controls src={deger} style={{flex:1,height:38}}/>
      <button onClick={onSil} style={{background:C.redBg,border:"none",borderRadius:9,width:34,height:34,color:C.red,fontSize:14,cursor:"pointer",flexShrink:0}}>🗑</button>
    </Sh>
    :<button onClick={kayitta?durdur:basla} style={{width:"100%",background:kayitta?C.redBg:C.bg,border:`1.5px dashed ${kayitta?C.red:C.border}`,borderRadius:12,padding:"13px 0",color:kayitta?C.red:C.t2,fontSize:13,fontWeight:700,cursor:"pointer"}}>
      {kayitta?"⏹ Durdur ("+sure+" sn) — kaydediliyor...":"🎙️ Dokun ve konuş — sesli not bırak (maks 60 sn)"}
    </button>}
  </div>;
}

// ── 🔐 PIN Kapısı ──
function PinKapi({kayitliPin,onBasari,onPinAyarla,onKapat}){
  const [g,setG]=useState("");
  const [hata,setHata]=useState(false);
  const ilkKurulum=!kayitliPin;
  const dene=()=>{
    if(g.length<4)return;
    if(ilkKurulum){onPinAyarla(g);onBasari();return;}
    if(g===kayitliPin)onBasari();else{setHata(true);setG("");}
  };
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1003,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{width:"100%",maxWidth:340,textAlign:"center"}}>
      <div style={{fontSize:44,marginBottom:12}}>🔐</div>
      <div style={{fontSize:17,fontWeight:800,color:C.t1,marginBottom:6}}>{ilkKurulum?"Kasa PIN'i Belirle":"Kasa Kilitli"}</div>
      <div style={{fontSize:12,color:C.t3,marginBottom:18}}>{ilkKurulum?"Bu bölümü koruyacak 4-6 haneli bir PIN belirle. Unutma — sadece bu PIN ile girilir.":"Çek · Senet · Kasa bölümüne girmek için PIN girin"}</div>
      <input type="password" inputMode="numeric" maxLength={6} value={g} onChange={e=>{setG(e.target.value.replace(/\D/g,""));setHata(false);}} onKeyDown={e=>e.key==="Enter"&&dene()} autoFocus
        style={{width:170,textAlign:"center",fontSize:26,letterSpacing:"0.4em",background:C.card,border:`2px solid ${hata?C.red:C.border}`,borderRadius:14,padding:"13px 0",color:C.t1,outline:"none"}}/>
      {hata&&<div style={{fontSize:12,color:C.red,fontWeight:700,marginTop:8}}>❌ Yanlış PIN</div>}
      <div style={{display:"flex",gap:10,marginTop:18}}>
        <button onClick={onKapat} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>{TT.iptal||"İptal"}</button>
        <button onClick={dene} style={{flex:1,background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{ilkKurulum?"PIN'i Kaydet":"Aç"}</button>
      </div>
    </div>
  </div>;
}

// ── 💼 Çek · Senet · Kasa ──
function KasaEkrani({onKapat,cekSenetler,setCekSenetler,jobs,giderler,goster}){
  const [yeniAc,setYeniAc]=useState(false);
  const [f,setF]=useState({tip:"cek",yon:"alacak",kisi:"",tutar:"",vade:new Date().toISOString().slice(0,10),banka:"",not:"",foto:null});
  const [fotoAc,setFotoAc]=useState(null); // tam ekran foto görüntüleme
  const ekFotoRef=useRef(null); // mevcut kayda sonradan foto eklemek için
  // 📷 Fotoğrafı sıkıştırıp base64'e çevir (max 1100px, jpeg 0.65 — çek üzerindeki yazılar okunur kalsın)
  const fotoIsle=(dosya,cb)=>{
    if(!dosya)return;
    const fr=new FileReader();
    fr.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        const c=document.createElement("canvas");const oran=Math.min(1,1100/img.width);
        c.width=img.width*oran;c.height=img.height*oran;
        c.getContext("2d").drawImage(img,0,0,c.width,c.height);
        cb(c.toDataURL("image/jpeg",0.65));
      };
      img.src=fr.result;
    };
    fr.readAsDataURL(dosya);
  };
  const ekFotoSec=(e)=>{
    const id=ekFotoRef.current;const dosya=e.target.files&&e.target.files[0];
    e.target.value="";
    if(!id||!dosya)return;
    fotoIsle(dosya,(b64)=>{setCekSenetler(p=>p.map(x=>x.id===id?{...x,foto:b64}:x));goster("📷 Fotoğraf eklendi");});
  };
  const bekleyenAlacakCS=cekSenetler.filter(c=>c.durum==="bekliyor"&&c.yon==="alacak").reduce((s,c)=>s+c.tutar,0);
  const bekleyenBorcCS=cekSenetler.filter(c=>c.durum==="bekliyor"&&c.yon==="borc").reduce((s,c)=>s+c.tutar,0);
  const bugun=new Date();const yediGun=new Date(Date.now()+7*86400000);
  const yaklasan=cekSenetler.filter(c=>c.durum==="bekliyor"&&new Date(c.vade)<=yediGun).sort((a,b)=>a.vade.localeCompare(b.vade));
  // 💡 Bütçe uyarısı: borçlar alacakları aşıyorsa
  const butceRisk=bekleyenBorcCS>bekleyenAlacakCS&&bekleyenBorcCS>0;
  const ekle=()=>{
    if(!f.kisi||!f.tutar)return;
    setCekSenetler(p=>[...p,{...f,id:Date.now(),tutar:parseFloat(f.tutar)||0,durum:"bekliyor"}]);
    setYeniAc(false);setF({tip:"cek",yon:"alacak",kisi:"",tutar:"",vade:new Date().toISOString().slice(0,10),banka:"",not:"",foto:null});
    goster("💼 Kayıt eklendi"+(f.foto?" 📷":""));
  };
  const Kut=({l,v,renk})=><div style={{flex:1,minWidth:140,background:C.card,borderRadius:14,padding:"13px 14px",borderLeft:`3px solid ${renk}`}}>
    <div style={{fontSize:11,color:C.t3}}>{l}</div><div style={{fontSize:17,fontWeight:800,color:renk}}>{v}</div></div>;
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,overflowY:"auto"}}>
    <div style={{maxWidth:640,margin:"0 auto",padding:"0 14px 40px"}}>
      <GeriBaslik baslik="💼 Çek · Senet" onKapat={onKapat}/>
      <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
        <Kut l="Bekleyen Alacak (Çek/Senet)" v={fmt(bekleyenAlacakCS)} renk="#0E9F6E"/>
        <Kut l="Bekleyen Borç (Çek/Senet)" v={fmt(bekleyenBorcCS)} renk="#E02424"/>
      </div>
      {butceRisk&&<div style={{background:"#FDE8E8",border:"1px solid #F8B4B4",borderRadius:14,padding:"13px 15px",marginBottom:14,fontSize:12.5,color:"#9B1C1C",lineHeight:1.6}}>
        ⚠️ <b>Bütçe uyarısı:</b> Bekleyen borç çek/senetlerin ({fmt(bekleyenBorcCS)}) bekleyen alacaklarını aşıyor. Bu ödemeler bu şekilde devam ederse bütçen zorlanacak — tahsilatları hızlandır veya vadeleri ertele.
      </div>}
      {yaklasan.length>0&&<Sh s={{padding:"13px 15px",marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:800,color:"#B4690E",marginBottom:8}}>⏰ 7 gün içinde vadesi gelenler</div>
        {yaklasan.map(c=><div key={c.id} style={{fontSize:12.5,color:C.t1,padding:"4px 0"}}>{c.yon==="alacak"?"🟢":"🔴"} {c.kisi} — {fmt(c.tutar)} · <b>{c.vade}</b></div>)}
      </Sh>}
      <button onClick={()=>setYeniAc(true)} style={{width:"100%",background:P,border:"none",borderRadius:14,padding:"14px 0",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",marginBottom:14}}>+ Çek / Senet Ekle</button>
      {cekSenetler.length===0&&<div style={{textAlign:"center",color:C.t3,fontSize:13,padding:"20px 0"}}>Henüz kayıt yok. Aldığın/verdiğin çek ve senetleri buraya işle.</div>}
      {[...cekSenetler].sort((a,b)=>a.vade.localeCompare(b.vade)).map(c=><Sh key={c.id} s={{padding:"13px 15px",marginBottom:9,display:"flex",alignItems:"center",gap:11,opacity:c.durum==="bekliyor"?1:0.55}}>
        {c.foto
          ?<img src={c.foto} onClick={()=>setFotoAc(c.foto)} alt="" style={{width:48,height:48,borderRadius:11,objectFit:"cover",cursor:"pointer",flexShrink:0,border:`1px solid ${C.border}`}}/>
          :<div onClick={()=>{ekFotoRef.current=c.id;document.getElementById("csEkFoto").click();}} style={{width:48,height:48,borderRadius:11,background:C.bg,border:`1.5px dashed ${C.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,gap:1}} title="Fotoğraf ekle">
            <i className="ti ti-camera" style={{fontSize:17,color:C.t3}} aria-hidden="true"/>
            <span style={{fontSize:7.5,fontWeight:700,color:C.t3}}>EKLE</span>
          </div>}
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13.5,fontWeight:700,color:C.t1}}>{c.tip==="cek"?"🏦":"📜"} {c.kisi} <span style={{fontSize:10,fontWeight:800,color:c.yon==="alacak"?"#0E9F6E":"#E02424"}}>{c.yon==="alacak"?"ALACAK":"BORÇ"}</span></div>
          <div style={{fontSize:11,color:C.t3}}>{c.tip==="cek"?"Çek":"Senet"}{c.banka?" · "+c.banka:""} · Vade: {c.vade}{c.not?" · "+c.not:""}{c.foto?" · 📷 fotoğrafa dokun":""}</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:14,fontWeight:800,color:c.yon==="alacak"?"#0E9F6E":"#E02424"}}>{fmt(c.tutar)}</div>
          {c.durum==="bekliyor"
            ?<button onClick={()=>{setCekSenetler(p=>p.map(x=>x.id===c.id?{...x,durum:"kapandi"}:x));goster("✅ Kapatıldı");}} style={{background:C.greenBg,border:"none",borderRadius:8,padding:"4px 9px",fontSize:10.5,fontWeight:700,color:C.green,cursor:"pointer",marginTop:3}}>{c.yon==="alacak"?"Tahsil Edildi":"Ödendi"}</button>
            :<button onClick={()=>{if(window.confirm("Bu kayıt silinsin mi?"))setCekSenetler(p=>p.filter(x=>x.id!==c.id));}} style={{background:C.redBg,border:"none",borderRadius:8,padding:"4px 9px",fontSize:10.5,fontWeight:700,color:C.red,cursor:"pointer",marginTop:3}}>Sil</button>}
        </div>
      </Sh>)}
      {yeniAc&&<BottomSheet onKapat={()=>setYeniAc(false)}>
        <div style={{fontSize:16,fontWeight:800,color:C.t1,marginBottom:14}}>Yeni Çek / Senet</div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[["cek","🏦 Çek"],["senet","📜 Senet"]].map(([v,l])=><button key={v} onClick={()=>setF(p=>({...p,tip:v}))} style={{flex:1,background:f.tip===v?P:C.bg,color:f.tip===v?"#fff":C.t2,border:"none",borderRadius:11,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[["alacak","🟢 Alacağım (bana verilen)"],["borc","🔴 Borcum (benim verdiğim)"]].map(([v,l])=><button key={v} onClick={()=>setF(p=>({...p,yon:v}))} style={{flex:1,background:f.yon===v?(v==="alacak"?"#0E9F6E":"#E02424"):C.bg,color:f.yon===v?"#fff":C.t2,border:"none",borderRadius:11,padding:"11px 6px",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>{l}</button>)}
        </div>
        <input value={f.kisi} onChange={e=>setF(p=>({...p,kisi:e.target.value}))} placeholder="Kişi / Firma adı" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",marginBottom:10}}/>
        <div style={{display:"flex",gap:10,marginBottom:10}}>
          <input type="number" value={f.tutar} onChange={e=>setF(p=>({...p,tutar:e.target.value}))} placeholder="Tutar (TL)" style={{flex:1,minWidth:0,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none"}}/>
          <input type="date" value={f.vade} onChange={e=>setF(p=>({...p,vade:e.target.value}))} style={{flex:1,minWidth:0,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 10px",color:C.t1,fontSize:13,outline:"none"}}/>
        </div>
        <input value={f.banka} onChange={e=>setF(p=>({...p,banka:e.target.value}))} placeholder="Banka (opsiyonel)" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",marginBottom:10}}/>
        <input value={f.not} onChange={e=>setF(p=>({...p,not:e.target.value}))} placeholder="Not (opsiyonel)" style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",marginBottom:10}}/>
        {/* 📷 Çek/senet fotoğrafı */}
        <label style={{display:"flex",alignItems:"center",gap:11,background:f.foto?C.greenBg:C.bg,border:`1.5px dashed ${f.foto?C.green:C.border}`,borderRadius:12,padding:"11px 13px",cursor:"pointer",marginBottom:14}}>
          {f.foto
            ?<img src={f.foto} alt="" style={{width:44,height:44,borderRadius:9,objectFit:"cover",flexShrink:0}}/>
            :<div style={{width:44,height:44,borderRadius:9,background:"#EAF0FA",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-camera" style={{fontSize:21,color:"#2563EB"}} aria-hidden="true"/></div>}
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:f.foto?C.green:C.t1}}>{f.foto?"✅ Fotoğraf eklendi":"Çek/senet fotoğrafı çek veya seç"}</div>
            <div style={{fontSize:10.5,color:C.t3}}>{f.foto?"Değiştirmek için dokun":"Kamerayla çek ya da galeriden yükle"}</div>
          </div>
          <input type="file" accept="image/*" capture="environment" onChange={e=>{const d=e.target.files&&e.target.files[0];e.target.value="";fotoIsle(d,(b64)=>setF(p=>({...p,foto:b64})));}} style={{display:"none"}}/>
        </label>
        <button onClick={ekle} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:14,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>Kaydet</button>
      </BottomSheet>}
      {/* Gizli input: mevcut kayda sonradan foto ekleme */}
      <input id="csEkFoto" type="file" accept="image/*" capture="environment" onChange={ekFotoSec} style={{display:"none"}}/>
      {/* Tam ekran foto görüntüleyici */}
      {fotoAc&&<div onClick={()=>setFotoAc(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:2000,display:"flex",alignItems:"center",justifyContent:"center",padding:16,cursor:"pointer"}}>
        <img src={fotoAc} alt="" style={{maxWidth:"100%",maxHeight:"92vh",borderRadius:14,boxShadow:"0 12px 40px rgba(0,0,0,0.5)"}}/>
        <div style={{position:"absolute",top:"max(20px, env(safe-area-inset-top))",right:20,width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:18,fontWeight:700}}>✕</div>
      </div>}
    </div>
  </div>;
}
// ═══ P — uygulamanın ANA RENGİ. Seçilen temaya göre değişir. ═══
// C gibi tema değişince yeniden atanır; butonlar, aktif sekme, grafikler
// ve seçili durumlar buradan beslenir.
let P = "#2E7490";
let TEAL = "#1C4E60";               // ana rengin koyu tonu — nötr ikonlar
let GRAD = "linear-gradient(135deg,#3E8FA3,#1F4E60)";
// ═══ Anlam renkleri — tema değişse de sabit kalır ═══
// Durum bildirdikleri için tema ile oynamazlar: kırmızı hep uyarıdır.
const KOR     = "#C2603A";   // dikkat gerekiyor (vade, bekleyen, gecikme)
const KOR_BG  = "#FBEDE6";
const YESIL   = "#0A7A55";   // olumlu / tamamlandı
const YESIL_BG= "#E6F5EF";

// #RRGGBB rengi verilen oranda koyultur (0.25 = %25 koyu)
function renkKoyult(hex,oran){
  const n=parseInt(String(hex).slice(1),16);
  const r=Math.round(((n>>16)&255)*(1-oran));
  const g=Math.round(((n>>8)&255)*(1-oran));
  const b=Math.round((n&255)*(1-oran));
  return "#"+[r,g,b].map(x=>x.toString(16).padStart(2,"0")).join("");
}
// Tema değişince ana renk ailesini yeniden kur
function anaRenkAyarla(vurgu){
  P=vurgu||"#2E7490";
  TEAL=renkKoyult(P,0.28);
  GRAD="linear-gradient(135deg,"+P+","+renkKoyult(P,0.34)+")";
}
const GOLD = "#C9A24B";


// ── RESPONSIVE GENİŞLİK ──
// Telefonda 480px (dokunmatik için ideal), bilgisayarda 800px (geniş ekran)
const APP_W = (typeof window!=="undefined" && window.innerWidth>=768) ? 800 : 480;
const MASAUSTU = typeof window!=="undefined" && window.innerWidth>=1024; // sol menülü masaüstü düzen

let DURUM = {};
const updateDurum = (T) => {
  DURUM = {
    aktif:{label:T.devamEdiyor,color:C.blue,bg:C.blueBg},
    bekliyor:{label:T.beklemede,color:C.amber,bg:C.amberBg},
    tamamlandi:{label:T.tamamlandi,color:C.green,bg:C.greenBg},
  };
};

let nId = 8; let fatNo = 1;
const initJobs = [];


// ─── Gerçek son 7 günün gelirini işlerden hesaplar (demo veri değil) ───
const GUN_KISA=["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"];
function son7GunGelir(jobs=[]){
  const bugun=new Date();bugun.setHours(0,0,0,0);
  const seri=[];
  for(let i=6;i>=0;i--){
    const g=new Date(bugun.getTime()-i*86400000);
    const iso=g.toISOString().slice(0,10);
    const v=jobs.filter(j=>j.durum==="tamamlandi"&&(j.tarih||"").slice(0,10)===iso)
                .reduce((s,j)=>s+(j.tutar||0),0);
    seri.push({d:GUN_KISA[g.getDay()],v});
  }
  return seri;
}

// ─── Boş durum: veri yokken yönlendirici mesaj ───
// ── Tembel yüklenen ekranlar için ara perde ──
function YukleniyorPerde({metin}){
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:14}}>
    <div style={{width:30,height:30,border:`3px solid ${C.border}`,borderTopColor:P,borderRadius:"50%",animation:"tfDon 0.8s linear infinite"}}/>
    <div style={{fontSize:13,fontWeight:700,color:C.t2}}>{metin||"Yükleniyor…"}</div>
    <style>{"@keyframes tfDon{to{transform:rotate(360deg)}}"}</style>
  </div>;
}

// ═══ 🔍 GENEL ARAMA — işler, müşteriler, faturalar, teklifler, giderler tek kutudan ═══
function AramaEkrani({onKapat,jobs=[],musteriKayitlari=[],faturalar=[],teklifler=[],giderler=[],onIsSec,onSekme,T}){
  const [q,setQ]=useState("");
  const kutuRef=useRef(null);
  useEffect(()=>{const t=setTimeout(()=>{try{kutuRef.current&&kutuRef.current.focus();}catch{}},80);return ()=>clearTimeout(t);},[]);

  // Türkçe karakterleri normalize et — "sahin" yazınca "Şahin" bulunsun
  const nrm=(x)=>String(x||"").toLocaleLowerCase("tr")
    .replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c");
  const ara=nrm(q).trim();
  const esles=(...alanlar)=>!ara||alanlar.some(a=>nrm(a).includes(ara));

  const sonuc={
    isler:!ara?[]:jobs.filter(j=>esles(j.baslik,j.musteri,j.ref,j.not,j.malzemeler,j.isAdresi,j.musteriTelefon)).slice(0,20),
    musteriler:!ara?[]:[...new Set([...jobs.map(j=>j.musteri),...musteriKayitlari.map(m=>m.ad)])]
      .filter(Boolean).filter(ad=>esles(ad)).slice(0,10)
      .map(ad=>{
        const isler=jobs.filter(j=>j.musteri===ad);
        const kayit=musteriKayitlari.find(m=>m.ad===ad);
        return {ad,adet:isler.length,ciro:isler.reduce((s,j)=>s+(j.tutar||0),0),tel:kayit&&kayit.tel};
      }),
    faturalar:!ara?[]:faturalar.filter(f=>esles(f.no,f.musteri)).slice(0,10),
    teklifler:!ara?[]:teklifler.filter(t=>esles(t.no,t.musteri,t.baslik)).slice(0,10),
    giderler:!ara?[]:giderler.filter(g=>esles(g.ad,g.kategori)).slice(0,10),
  };
  const toplam=Object.values(sonuc).reduce((s,a)=>s+a.length,0);

  const Baslik=({ikon,ad,adet})=><div style={{display:"flex",alignItems:"center",gap:7,margin:"18px 2px 8px"}}>
    <span style={{fontSize:13}}>{ikon}</span>
    <span style={{fontSize:11,fontWeight:800,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase"}}>{ad}</span>
    <span style={{fontSize:10,fontWeight:700,color:C.t3,background:C.bg,borderRadius:8,padding:"1px 7px"}}>{adet}</span>
  </div>;
  const Satir=({ana,alt,sag,onClick})=><div onClick={onClick} style={{display:"flex",alignItems:"center",gap:10,background:C.card,border:`1px solid ${C.border}`,borderRadius:13,padding:"11px 13px",marginBottom:7,cursor:"pointer"}}>
    <div style={{flex:1,minWidth:0}}>
      <div style={{fontSize:13.5,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ana}</div>
      {alt&&<div style={{fontSize:11,color:C.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{alt}</div>}
    </div>
    {sag&&<div style={{fontSize:12.5,fontWeight:800,color:C.t2,whiteSpace:"nowrap"}}>{sag}</div>}
  </div>;

  const git=(fn)=>{onKapat();setTimeout(fn,60);};

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1400,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:MASAUSTU?680:APP_W,display:"flex",flexDirection:"column",height:"100dvh"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:MASAUSTU?"22px 18px 14px":"52px 16px 14px",background:C.card,borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontSize:18}}>🔍</span>
        <input ref={kutuRef} value={q} onChange={e=>setQ(e.target.value)}
          onKeyDown={e=>{if(e.key==="Escape")onKapat();}}
          placeholder="İş, müşteri, fatura, teklif, gider ara…"
          style={{flex:1,minWidth:0,background:C.bg,border:`1px solid ${C.border}`,borderRadius:13,padding:"12px 15px",color:C.t1,fontSize:15,outline:"none"}}/>
        <button onClick={onKapat} aria-label="Kapat" style={{width:38,height:38,flexShrink:0,borderRadius:11,background:C.bg,border:`1px solid ${C.border}`,fontSize:17,cursor:"pointer",color:C.t2}}>✕</button>
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"6px 14px 40px"}}>
        {!ara&&<div style={{textAlign:"center",color:C.t3,fontSize:12.5,padding:"48px 20px",lineHeight:1.7}}>
          Aramak istediğini yaz.<br/>Müşteri adı, iş başlığı, IS-0012 gibi referans,<br/>fatura numarası ya da malzeme adı çalışır.
        </div>}
        {ara&&toplam===0&&<div style={{textAlign:"center",color:C.t3,fontSize:13,padding:"48px 20px"}}>
          "{q}" için sonuç bulunamadı.
        </div>}

        {sonuc.isler.length>0&&<><Baslik ikon="💼" ad="İşler" adet={sonuc.isler.length}/>
          {sonuc.isler.map(j=><Satir key={j.id} ana={j.baslik}
            alt={j.musteri+" · "+j.ref+" · "+(j.durum==="tamamlandi"?"Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede")}
            sag={fmt(j.tutar)} onClick={()=>git(()=>onIsSec&&onIsSec(j))}/>)}</>}

        {sonuc.musteriler.length>0&&<><Baslik ikon="👤" ad="Müşteriler" adet={sonuc.musteriler.length}/>
          {sonuc.musteriler.map(m=><Satir key={m.ad} ana={m.ad}
            alt={m.adet+" iş"+(m.tel?" · "+m.tel:"")} sag={fmt(m.ciro)}
            onClick={()=>git(()=>onSekme&&onSekme("musteriler"))}/>)}</>}

        {sonuc.faturalar.length>0&&<><Baslik ikon="🧾" ad="Faturalar" adet={sonuc.faturalar.length}/>
          {sonuc.faturalar.map(f=><Satir key={f.no} ana={f.no} alt={f.musteri+" · "+(f.tarih||"")}
            sag={fmt(f.genelToplam||f.tutar||0)} onClick={()=>git(()=>onSekme&&onSekme("faturalar"))}/>)}</>}

        {sonuc.teklifler.length>0&&<><Baslik ikon="📋" ad="Teklifler" adet={sonuc.teklifler.length}/>
          {sonuc.teklifler.map(t=><Satir key={t.id||t.no} ana={t.baslik||t.no} alt={t.musteri+" · "+(t.tarih||"")}
            sag={fmt(t.tutar||0)} onClick={()=>git(()=>onSekme&&onSekme("teklifler"))}/>)}</>}

        {sonuc.giderler.length>0&&<><Baslik ikon="💸" ad="Giderler" adet={sonuc.giderler.length}/>
          {sonuc.giderler.map(g=><Satir key={g.id} ana={g.ad} alt={(g.kategori||"")+" · "+(g.tarih||"")}
            sag={fmt(g.tutar||0)} onClick={()=>git(()=>onSekme&&onSekme("giderler"))}/>)}</>}
      </div>
    </div>
  </div>;
}

function BosDurum({ikon="grafik",baslik,mesaj,btn,onBtn,yuk=170}){
  return <div style={{height:yuk,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:9,textAlign:"center",padding:"0 14px"}}>
    <div style={{width:46,height:46,borderRadius:14,background:P+"12",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <Ik n={ikon} s={23} c={P} w={1.7}/>
    </div>
    <div style={{fontSize:13.5,fontWeight:700,color:C.t1}}>{baslik}</div>
    <div style={{fontSize:11.5,color:C.t3,lineHeight:1.55,maxWidth:230}}>{mesaj}</div>
    {btn&&<button onClick={onBtn} style={{marginTop:3,background:P,border:"none",borderRadius:10,padding:"9px 18px",color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{btn}</button>}
  </div>;
}

// ─── ATOMLAR ────────────────────────────────────────────────────
const Sh=({children,s,onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:16,boxShadow:C.sh,...s}}>{children}</div>;
const Badge=({durum})=>{const d=DURUM[durum]||{label:durum,color:C.t3,bg:C.bg};return <span style={{fontSize:11,fontWeight:600,color:d.color,background:d.bg,borderRadius:20,padding:"4px 10px",whiteSpace:"nowrap"}}>{d.label}</span>;};
const Toggle=({on,set})=><div onClick={()=>set(!on)} style={{width:46,height:26,borderRadius:13,background:on?P:"#9CA3AF",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}><div style={{width:22,height:22,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:on?22:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></div>;
function GeriBaslik({baslik,onKapat}){return <div style={{display:"flex",alignItems:"center",gap:12,padding:"52px 16px 14px",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:60}}><button onClick={onKapat} style={{width:38,height:38,borderRadius:11,background:C.bg,border:`1px solid ${C.border}`,fontSize:16,cursor:"pointer",color:C.t1}}>←</button><div style={{flex:1,fontSize:18,fontWeight:800,color:C.t1}}>{baslik}</div><button onClick={onKapat} aria-label="Kapat" style={{width:38,height:38,borderRadius:11,background:C.bg,border:`1px solid ${C.border}`,fontSize:18,cursor:"pointer",color:C.t2,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button></div>;}
function BottomSheet({children,onKapat,maxH}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.42)",display:"flex",alignItems:MASAUSTU?"center":"flex-end",zIndex:1000}} onClick={onKapat}><div onClick={e=>e.stopPropagation()} style={{position:"relative",background:C.card,borderRadius:MASAUSTU?24:"24px 24px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:MASAUSTU?560:APP_W,margin:"0 auto",maxHeight:maxH||"88vh",overflowY:"auto",boxShadow:MASAUSTU?C.sh2:"none"}}><button onClick={onKapat} aria-label="Kapat" style={{position:"absolute",top:14,right:14,width:34,height:34,borderRadius:10,background:C.bg,border:`1px solid ${C.border}`,fontSize:17,cursor:"pointer",color:C.t2,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2}}>✕</button><div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>{children}</div></div>;}
// Maliyet Bekçisi: tutar + maliyet girilince anlık kâr/zarar analizi
function BenzerIsIpucu({baslik,jobs,edit,duzenlenecekId,T}){
  try{
    if(!baslik||baslik.length<4||!Array.isArray(jobs)||jobs.length===0)return null;
    const kelimeler=baslik.toLowerCase().split(/\s+/).filter(w=>w.length>3);
    if(!kelimeler.length)return null;
    const benzer=jobs.filter(j=>j&&j.maliyet>0&&(!edit||j.id!==duzenlenecekId)&&kelimeler.some(w=>(j.baslik||"").toLowerCase().includes(w)));
    if(!benzer.length)return null;
    const ort=Math.round(benzer.reduce((s,j)=>s+(j.maliyet||0),0)/benzer.length/(KURLAR[AKTIF_PARA]||1));
    return <div style={{fontSize:11,color:P,fontWeight:600,marginTop:-8,marginBottom:12}}>💡 {T.benzerIs}: {fmt(ort*(KURLAR[AKTIF_PARA]||1))} ({benzer.length} iş)</div>;
  }catch(e){return null;}
}

function MaliyetOnizleme({tutar,maliyet,T}){
  const t=Number(tutar||0),m=Number(maliyet||0);
  if(t<=0||m<=0)return null;
  const kar=t-m,marj=Math.round(kar/t*100);
  const zarar=kar<0,dusuk=!zarar&&marj<15;
  const renk=zarar?C.red:dusuk?C.amber:C.green;
  const bg=zarar?C.redBg:dusuk?C.amberBg:C.greenBg;
  return <div style={{background:bg,border:`1.5px solid ${renk}44`,borderRadius:12,padding:"11px 14px",marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,fontWeight:800,color:renk}}>{zarar?"⚠️ "+T.zararUyari:dusuk?"⚡ "+T.dusukMarj:"✅ "+T.netKar}</span>
      <span style={{fontSize:15,fontWeight:900,color:renk}}>{kar>=0?"+":""}{fmt(kar*(KURLAR[AKTIF_PARA]||1))}</span>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
      <span style={{fontSize:10,color:C.t2}}>{T.marjL}</span>
      <span style={{fontSize:11,fontWeight:700,color:renk}}>%{marj}</span>
    </div>
    <div style={{background:C.border,borderRadius:3,height:5,marginTop:5,overflow:"hidden"}}>
      <div style={{width:`${Math.max(0,Math.min(marj,100))}%`,background:renk,height:"100%"}}/>
    </div>
  </div>;
}

function Inp({label,value,onChange,placeholder,type,onFocus}){return <div style={{marginBottom:14}}>{label&&<div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</div>}<input type={type||"text"} value={value} onChange={onChange} onFocus={onFocus} placeholder={placeholder} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none"}}/></div>;}
const BtnP=({children,onClick})=><button onClick={onClick} style={{flex:2,background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{children}</button>;
const BtnS=({children,onClick})=><button onClick={onClick} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:13,cursor:"pointer"}}>{children}</button>;

// ─── HERO ────────────────────────────────────────────────────────

// 📱 Yeni mobil ana sayfa — referans tasarıma birebir

// ─── VADE HATIRLATMALARI ────────────────────────────────────────
// Çek/senet vadeleri + iş hatırlatmaları + bekleyen tahsilatlar.
// Bugün + gelecek 7 gün + vadesi geçmişleri döndürür.
function vadeHatirlatmalari(jobs=[],cekSenetler=[],vadeGun=VADE_VARSAYILAN){
  const bugun=new Date();bugun.setHours(0,0,0,0);
  const yedi=new Date(bugun.getTime()+7*86400000);
  const g=(t)=>{const d=new Date(t);d.setHours(0,0,0,0);return d;};
  const gunFark=(d)=>Math.round((g(d)-bugun)/86400000);
  const liste=[];

  // Çek/senet vadeleri
  cekSenetler.forEach(c=>{
    if(c.durum!=="bekliyor"||!c.vade)return;
    const f=gunFark(c.vade);
    if(f<=7){
      liste.push({tip:"cek",id:"cs"+c.id,ref:c,fark:f,tutar:c.tutar,yon:c.yon,
        baslik:(c.tip==="cek"?"🏦 Çek":"📜 Senet")+" — "+c.kisi,
        alt:(c.yon==="alacak"?"Tahsil edilecek":"Ödenecek")+(c.banka?" · "+c.banka:""),
        vade:c.vade});
    }
  });
  // İş hatırlatmaları
  jobs.forEach(j=>{
    if(j.durum==="tamamlandi"||!j.hatirlatma)return;
    const f=gunFark(j.hatirlatma);
    if(f<=7){
      liste.push({tip:"is",id:"is"+j.ref,ref:j,fark:f,tutar:j.tutar,
        baslik:"🔔 "+(j.baslik||"İş"),alt:(j.musteri||"")+" · Hatırlatma",
        vade:(j.hatirlatma||"").slice(0,10),saat:(j.hatirlatma||"").slice(11,16)});
    }
  });
  // Bekleyen tahsilatlar — artık gerçek vadeye göre.
  // Vadesi 7 günden uzaksa listeye girmez; müşteriye tanınan süre içinde
  // her gün "tahsil et" uyarısı görmek gereksiz baskı yaratıyordu.
  jobs.forEach(j=>{
    if(j.durum!=="bekliyor"&&j.durum!=="tamamlandi")return;
    const v=tahsilatVadesi(j,vadeGun);
    if(!v||v.pesin)return;
    if(v.kalanGun>7)return;
    const et=tahsilatEtiket(v.kalanGun);
    liste.push({tip:"tahsilat",id:"th"+j.ref,ref:j,fark:v.kalanGun,tutar:v.kalanTutar,
      baslik:"💰 "+(j.musteri||"Müşteri"),
      alt:(j.baslik||"İş")+" · "+(v.kalanGun<0?"Vadesi geçti":"Ödeme vadesi "+v.vade.slice(8)+"."+v.vade.slice(5,7)),
      vade:v.vade,tahsilat:true,etiket:et});
  });

  // Sırala: en acil (geçmiş/bugün) önce
  liste.sort((a,b)=>a.fark-b.fark);
  return liste;
}
// Fark → okunur etiket + renk
// ═══════════════════════════════════════════════════════════════
// 💰 TAHSİLAT VADESİ
// İş biter bitmez "bugün tahsil et" demek sahada anlamsız — müşteriye
// makul bir ödeme süresi tanınır. Süre azaldıkça uyarı sertleşir.
//
// Vade başlangıcı: iş tamamlandıysa tamamlanma günü, değilse iş tarihi.
// Vade süresi: işe özel (j.vadeGun) yoksa işletme varsayılanı (genelde 7 gün).
// vadeGun = 0 → peşin iş, vade takibi yapılmaz.
// ═══════════════════════════════════════════════════════════════
const VADE_VARSAYILAN=7;

function gunBasi(t){const d=new Date(t);d.setHours(0,0,0,0);return d;}
function gunFarki(a,b){return Math.round((gunBasi(a)-gunBasi(b))/86400000);}

function tahsilatVadesi(j,varsayilanGun=VADE_VARSAYILAN){
  if(!j)return null;
  const odenen=(j.odemeler||[]).reduce((s,o)=>s+(o.tutar||0),0);
  const kalan=(j.tutar||0)-odenen;
  if(kalan<=0)return null;                       // tamamı tahsil edilmiş

  const gun = j.vadeGun!=null ? Number(j.vadeGun) : Number(varsayilanGun);
  const baslangic = j.tamamlanma || j.tarih || new Date().toISOString().slice(0,10);

  // Elle vade tarihi girilmişse o kullanılır
  let vade;
  if(j.odemeVadesi){ vade=gunBasi(j.odemeVadesi); }
  else { vade=gunBasi(baslangic); vade.setDate(vade.getDate()+(isFinite(gun)?gun:VADE_VARSAYILAN)); }

  const bugun=new Date();
  const kalanGun=gunFarki(vade,bugun);
  return {vade:vade.toISOString().slice(0,10),kalanGun,kalanTutar:kalan,pesin:gun===0&&!j.odemeVadesi};
}

// Kalan güne göre kademeli uyarı — gün azaldıkça sertleşir
function tahsilatEtiket(kalanGun,pesin=false){
  if(pesin)                return {seviye:"pesin",   metin:"Peşin",              renk:"#0A7A55",bg:"#E6F5EF",oncelik:5};
  if(kalanGun<0)           return {seviye:"gecikti", metin:Math.abs(kalanGun)+" gün gecikti",renk:"#B91C1C",bg:"#FEE2E2",oncelik:0};
  if(kalanGun===0)         return {seviye:"songun",  metin:"SON GÜN",            renk:"#B91C1C",bg:"#FEE2E2",oncelik:1};
  if(kalanGun===1)         return {seviye:"yakin",   metin:"Son gün yarın",      renk:"#C2603A",bg:"#FBEDE6",oncelik:2};
  if(kalanGun<=3)          return {seviye:"yaklasiyor",metin:kalanGun+" gün kaldı",renk:"#C2603A",bg:"#FBEDE6",oncelik:3};
  return                          {seviye:"sakin",   metin:kalanGun+" gün kaldı",renk:"#1C4E60",bg:"#E8F1F5",oncelik:4};
}

function vadeEtiket(fark){
  if(fark<0)return {metin:Math.abs(fark)+" gün gecikti",renk:"#DC2626",bg:"#FEE2E2"};
  if(fark===0)return {metin:"BUGÜN",renk:"#DC2626",bg:"#FEE2E2"};
  if(fark===1)return {metin:"Yarın",renk:"#D97706",bg:"#FEF3C7"};
  return {metin:fark+" gün sonra",renk:"#D97706",bg:"#FEF3C7"};
}

// 💡 Özellik tanıtım ipuçları — en güçlü özellikleri tanıtır
function tanitimIpuclari(bugunIslerVarsa,bugunIsMetni,onTakvim,onKasa,setSekme,onAc){
  const git=(e)=>()=>onAc&&onAc(e);
  return [
    {ic:"ti-calendar-event",baslik:"Bugün",metin:bugunIsMetni,act:onTakvim,renk:"#2563EB"},
    {ic:"ti-camera",baslik:"Çek & Senet Takibi",metin:"Çeklerini fotoğraflayarak kaydet, vadesi yaklaşınca uyarı al — asla kaçırma.",act:onKasa,renk:"#F59E0B"},
    {ic:"ti-file-pencil",baslik:"Teklif → PDF → WhatsApp",metin:"Teklifini saniyede PDF yap, tek dokunuşla WhatsApp'tan müşterine gönder.",act:()=>setSekme("teklifler"),renk:"#7C3AED"},
    {ic:"ti-shield-check",baslik:"Şahitli İş",metin:"Öncesi–sonrası fotoğrafı, konum ve müşteri imzasıyla kilitle. \"Eksik yapıldı\" tartışması bitsin.",act:()=>setSekme("isler"),renk:"#0E9F6E"},
    {ic:"ti-cloud-off",baslik:"İnternetsiz Çalışır",metin:"Şantiyede çekim yoksa bile çalış — veriler cihazında durur, bağlanınca buluta yüklenir.",act:()=>setSekme("isler"),renk:"#0891B2"},
    {ic:"ti-chart-pie",baslik:"Kâr-Zarar Analizi",metin:"Her işin giderini bağla, gerçek kârını gör. Hangi iş kazandırıyor, hangisi zarar — net gör.",act:()=>setSekme("raporlar"),renk:"#EC4899"},
    {ic:"ti-users",baslik:"Ekip Yönetimi",metin:"Ustalarını ekle, işleri onlara ata, saha harcamalarını onayla — hepsi tek yerde.",act:git("ekip"),renk:"#3B82F6"},
    {ic:"ti-receipt",baslik:"Fatura & Tahsilat",metin:"Fatura kes, tahsilatı işaretle, bekleyen alacaklarını anında gör.",act:()=>setSekme("faturalar"),renk:"#6366F1"},
    {ic:"ti-calendar",baslik:"Takvim Görünümü",metin:"İşlerini ay görünümünde planla, hangi gün ne var tek bakışta gör.",act:onTakvim,renk:"#14B8A6"},
    {ic:"ti-microphone",baslik:"Sesli Not",metin:"Elin doluyken işe sesli not bırak — yazmakla uğraşma.",act:()=>setSekme("isler"),renk:"#F97316"},
    {ic:"ti-robot",baslik:"Yapay Zekâ Asistan",metin:"İşlerini, tahsilatlarını, müşterilerini sor — asistan cevaplasın.",act:git("asistan"),renk:"#8B5CF6"},
    {ic:"ti-world",baslik:"8 Dil Desteği",metin:"Uygulama 8 dilde çalışır — yabancı müşteri veya çalışanla iş yapmak artık kolay.",act:()=>setSekme("profil"),renk:"#0EA5E9"},
    {ic:"ti-device-mobile",baslik:"Telefona Kurulabilir",metin:"Tarayıcıdan \"Ana ekrana ekle\" de — uygulama gibi açılsın, simgesi olsun.",act:()=>setSekme("profil"),renk:"#64748B"},
    {ic:"ti-download",baslik:"Yedek Al",metin:"Tüm verini tek tuşla dosya olarak indir, istediğinde geri yükle.",act:()=>setSekme("profil"),renk:"#0E9F6E"},
    {ic:"ti-lock",baslik:"Otomatik Kilit",metin:"Telefonun başkasının eline geçerse oturum kendiliğinden kapansın.",act:()=>setSekme("profil"),renk:"#DC2626"},
    {ic:"ti-clock",baslik:"Dünya Saatleri",metin:"18 şehrin güncel saatini gör — yurt dışıyla iş yapanlar için.",act:git("dunya"),renk:"#7C3AED"},
    {ic:"ti-device-gamepad-2",baslik:"Eğlence Köşesi",metin:"Mola ver — 2048, Yılan, Tetris, Adam Asmaca ve dahası. İnternetsiz oynanır.",act:git("eglence"),renk:"#EC4899"},
    {ic:"ti-trash",baslik:"Çöp Kutusu",metin:"Yanlışlıkla sildiğin kayıtlar 30 gün geri alınabilir.",act:git("cop"),renk:"#94A3B8"},
  ];
}

const MobilAnaSayfa=memo(function MobilAnaSayfa({jobs,faturalar,giderler,T,yetkili,onYeniIs,isKolu,setIsKolu,onOzellestir,onStatClick,setSekme,onIsSec,okunmamis,onKasa,onTakvim,cekSenetler=[],onNakit,onAc,vadeGun=VADE_VARSAYILAN}){
  const ad=(yetkili||"").split(" ")[0]||"";
  const saat=new Date().getHours();
  const dilim=gunDilimi(saat);
  const DILIM_KEY={sabah:["selamSabah","altSabah"],ogle:["selamOgle","altOgle"],aksam:["selamAksam","altAksam"],gece:["selamGece","altGece"]}[dilim];
  const selam=T[DILIM_KEY[0]]||DILIM_METIN[dilim].selam;
  const buAy=new Date().toISOString().slice(0,7);
  const gecenAy=(()=>{const d=new Date();d.setMonth(d.getMonth()-1);return d.toISOString().slice(0,7);})();
  const bugun=new Date().toISOString().slice(0,10);
  const aktif=jobs.filter(j=>j.durum==="aktif").length;
  const tahsil=jobs.filter(j=>j.durum==="tamamlandi"&&(j.tarih||"").startsWith(buAy)).reduce((s,j)=>s+j.tutar,0);
  const tahsilOnceki=jobs.filter(j=>j.durum==="tamamlandi"&&(j.tarih||"").startsWith(gecenAy)).reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum!=="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const beklFatSay=(faturalar||[]).filter(f=>!f.odendi).length;
  const gider=(giderler||[]).filter(g=>(g.tarih||"").startsWith(buAy)).reduce((s,g)=>s+g.tutar,0);
  const giderOnceki=(giderler||[]).filter(g=>(g.tarih||"").startsWith(gecenAy)).reduce((s,g)=>s+g.tutar,0);
  const karOran=tahsil>0?Math.round((tahsil-gider)/tahsil*100):0;
  const degisim=(x,y)=>y>0?Math.round((x-y)/y*1000)/10:null;
  const gelirD=degisim(tahsil,tahsilOnceki), giderD=degisim(gider,giderOnceki);
  const bugunIsler=jobs.filter(j=>j.durum!=="tamamlandi"&&((j.tarih||"")===bugun||(j.hatirlatma||"").startsWith(bugun))).sort((a,b)=>(a.hatirlatma||"z").localeCompare(b.hatirlatma||"z")).slice(0,3);
  const kartlar=[
    {ic:"ti-briefcase",l:T.aktifIs,v:aktif,sub:T.devamEden,c:"#2563EB"},
    {ic:"ti-shield-check",l:T.tahsilEdildi,v:fmt(tahsil),sub:T.buAy||"Bu ay",c:"#0E9F6E"},
    {ic:"ti-clock",l:T.bekleyenTahsilat,v:fmt(beklT),sub:T.toplam,c:"#F59E0B"},
    {ic:"ti-file-text",l:T.faturalar,v:beklFatSay,sub:T.beklemede,c:"#7C5CFC"},
  ];
  // Hızlı işlemler — tek tonlu. vurgu:true = dolu kutu (birincil eylem)
  // nokta:true = bekleyen iş var uyarısı
  const hizli=[
    {ic:"ti-plus",l:T.yeniIs,act:onYeniIs,vurgu:true},
    {ic:"ti-user",l:T.musteriler,act:()=>setSekme("musteriler")},
    {ic:"ti-file-text",l:T.faturalar,act:()=>setSekme("faturalar"),nokta:beklFatSay>0},
    {ic:"ti-wallet",l:T.tahsilatlar,act:()=>setSekme("tahsilatlar"),nokta:beklT>0},
    {ic:"ti-sitemap",l:T.isAkislari,act:()=>setSekme("isler")},
    {ic:"ti-file-pencil",l:T.teklifler,act:()=>setSekme("teklifler")},
    {ic:"ti-chart-bar",l:T.raporlar,act:()=>setSekme("raporlar")},
    {ic:"ti-folder",l:T.giderler,act:()=>setSekme("giderler")},
  ];
  const cevre=2*Math.PI*44;
  // 💡 İpucu carousel — özellik tanıtımları, otomatik döner + kaydırma
  const [ipucuIx,setIpucuIx]=useState(0);
  const bugunIsMetni=bugunIsler.length===0?"Planlı işin yok — yeni iş ekleyerek gününü planla.":((bugunIsler[0].hatirlatma||"").slice(11,16)||"Bugün")+" · "+bugunIsler[0].musteri+" — "+bugunIsler[0].baslik+(bugunIsler.length>1?" (+"+(bugunIsler.length-1)+" iş daha)":"");
  const ipuclari=tanitimIpuclari(bugunIsler.length>0,bugunIsMetni,onTakvim,onKasa,setSekme,onAc);
  useEffect(()=>{const t=setInterval(()=>setIpucuIx(i=>(i+1)%ipuclari.length),6500);return ()=>clearInterval(t);},[ipuclari.length]);
  const ipucu=ipuclari[ipucuIx];
  const ipDokunRef=useRef(null);
  const ipDokunBas=(e)=>{ipDokunRef.current=e.touches[0].clientX;};
  const ipDokunBit=(e)=>{if(ipDokunRef.current==null)return;const dx=e.changedTouches[0].clientX-ipDokunRef.current;if(Math.abs(dx)>34){setIpucuIx(i=>(i+(dx<0?1:-1)+ipuclari.length)%ipuclari.length);}ipDokunRef.current=null;};
  return <div style={{padding:"14px 16px 0"}}>
    {/* Karşılama — fotoğraflı hero, gün dilimine göre değişen fotoğraf */}
    <div style={{position:"relative",borderRadius:24,overflow:"hidden",marginBottom:18,minHeight:224,boxShadow:"0 10px 28px rgba(16,24,40,0.16)"}}>
      <ManzaraKare dilim={dilim} mobil={true}/>
      <div style={{position:"relative",padding:"18px 20px 20px",display:"flex",flexDirection:"column",justifyContent:"flex-end",minHeight:224}}>
        <div style={{fontSize:21,fontWeight:800,color:"#fff",letterSpacing:"-0.015em",lineHeight:1.2,textShadow:"0 2px 12px rgba(0,0,0,0.4)"}}>{selam}{ad?", "+ad:""}</div>
        <div style={{fontSize:13.5,color:"rgba(255,255,255,0.92)",marginTop:5,fontWeight:500,textShadow:"0 1px 8px rgba(0,0,0,0.4)"}}>{T[DILIM_KEY[1]]||DILIM_METIN[dilim].alt}</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:7,marginTop:14,background:"rgba(255,255,255,0.94)",borderRadius:100,padding:"7px 14px",alignSelf:"flex-start",boxShadow:"0 4px 14px rgba(0,0,0,0.2)"}}>
          <i className="ti ti-clock" style={{fontSize:14,color:"#1C4E60"}} aria-hidden="true"/>
          <span style={{fontSize:12.5,fontWeight:700,color:"#1F2937"}}>{new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}</span>
          <span style={{width:3,height:3,borderRadius:"50%",background:"#9CA3AF"}}/>
          <span style={{fontSize:12.5,fontWeight:700,color:"#1F2937"}}>{new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</span>
        </div>
      </div>
    </div>
    {/* ═══════════════════════════════════════════════════════════
        Ana sayfa gövdesi — sakin hiyerarşi.
        Kural: renk anlam taşır, süs değildir.
        TEAL = normal · KOR = dikkat gerekiyor · YESIL = tamam
       ═══════════════════════════════════════════════════════════ */}

    {/* 1 — Ayın net rakamı. Ekrandaki en büyük sayı bu olmalı. */}
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"19px 18px 16px",marginBottom:11,boxShadow:C.sh}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <span style={{fontSize:10.5,fontWeight:700,letterSpacing:"0.11em",textTransform:"uppercase",color:C.t3}}>{T.buAyNet||"Bu ay net"}</span>
        {gelirD!==null&&<span style={{display:"flex",alignItems:"center",gap:4,fontSize:11,fontWeight:700,borderRadius:20,padding:"4px 9px",
          color:gelirD>=0?YESIL:KOR,background:gelirD>=0?YESIL_BG:KOR_BG}}>
          <i className={`ti ti-arrow-${gelirD>=0?"up":"down"}-right`} style={{fontSize:12}} aria-hidden="true"/>%{Math.abs(gelirD)}
        </span>}
      </div>
      <div style={{fontSize:36,fontWeight:800,letterSpacing:"-0.035em",lineHeight:1,color:C.t1,fontVariantNumeric:"tabular-nums",marginBottom:5}}>
        {fmt(tahsil-gider)}
      </div>
      <div style={{fontSize:12,color:C.t2,lineHeight:1.5}}>
        {T.gecenAyBugun||"Geçen ay bugün"} <b style={{color:C.t1,fontWeight:600}}>{fmt(tahsilOnceki-giderOnceki)}</b> {T.idiEk||"idi"}
      </div>
      {(tahsil+beklT)>0&&<>
        <div style={{height:7,borderRadius:20,background:C.bg,overflow:"hidden",display:"flex",margin:"15px 0 9px"}}>
          <i style={{display:"block",height:"100%",width:(tahsil/(tahsil+beklT)*100).toFixed(1)+"%",background:P}}/>
          <i style={{display:"block",height:"100%",width:(beklT/(tahsil+beklT)*100).toFixed(1)+"%",background:KOR}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:600}}>
          <span style={{color:TEAL}}>{T.tahsilEdildi} {fmt(tahsil)}</span>
          <span style={{color:KOR}}>{T.bekleyen||"Bekleyen"} {fmt(beklT)}</span>
        </div>
      </>}
    </div>

    {/* 2 — İki destekleyici sayı */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
      {[
        {ic:"ti-briefcase",l:T.aktifIs,v:aktif,n:T.devamEden,vurgu:false,act:"stat-aktif"},
        {ic:"ti-file-text",l:T.faturalar,v:beklFatSay,n:T.beklemede,vurgu:beklFatSay>0,act:"stat-bekleyen"},
      ].map((k,i)=><div key={i} onClick={()=>onStatClick(k.act)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 14px 12px",cursor:"pointer",boxShadow:C.sh,position:"relative"}}>
        <i className="ti ti-chevron-right" style={{position:"absolute",top:14,right:12,fontSize:13,color:C.t3,opacity:.6}} aria-hidden="true"/>
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10.5,fontWeight:700,color:C.t2,marginBottom:8}}>
          <i className={`ti ${k.ic}`} style={{fontSize:13}} aria-hidden="true"/>{k.l}
        </div>
        <div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.025em",lineHeight:1,fontVariantNumeric:"tabular-nums",color:k.vurgu?KOR:C.t1}}>{k.v}</div>
        <div style={{fontSize:10.5,color:C.t3,marginTop:5}}>{k.n}</div>
      </div>)}
    </div>

    {/* 3 — Vade hatırlatmaları */}
    {(()=>{
      const hatirlatmalar=vadeHatirlatmalari(jobs,cekSenetler,vadeGun);
      if(hatirlatmalar.length===0)return null;
      const gorunen=hatirlatmalar.slice(0,3);
      const acil=hatirlatmalar.filter(h=>h.fark<=0).length;
      return <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"0 2px 11px"}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}>
            <span style={{fontSize:14.5,fontWeight:700,letterSpacing:"-0.015em",color:C.t1}}>{T.vadeHatirlatma||"Vade hatırlatmaları"}</span>
            {acil>0&&<span style={{fontSize:9.5,fontWeight:800,color:"#fff",background:KOR,borderRadius:20,padding:"2px 8px"}}>{acil} {T.acilEk||"ACİL"}</span>}
          </div>
          {hatirlatmalar.length>3&&<span onClick={onKasa} style={{fontSize:11.5,fontWeight:600,color:P,cursor:"pointer"}}>{T.tumu||"Tümü"} ({hatirlatmalar.length}) →</span>}
        </div>
        {gorunen.map(h=>{const et=h.etiket||vadeEtiket(h.fark);const kritik=h.fark<=0;
          return <div key={h.id} onClick={h.tip==="cek"?onKasa:()=>onIsSec&&onIsSec(h.ref)}
            style={{display:"flex",alignItems:"center",gap:12,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"13px 15px",marginBottom:8,position:"relative",overflow:"hidden",boxShadow:C.sh,cursor:"pointer"}}>
            <span style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:kritik?KOR:P}}/>
            <div style={{width:38,height:38,borderRadius:12,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:kritik?KOR:TEAL}}>
              <i className={`ti ${h.tip==="cek"?"ti-file-invoice":"ti-briefcase"}`} style={{fontSize:18}} aria-hidden="true"/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:600,letterSpacing:"-0.01em",color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.baslik}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:3}}>{h.alt}{h.saat?" · "+h.saat:""}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              {h.tutar>0&&<div style={{fontSize:13.5,fontWeight:700,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.015em",color:h.yon==="borc"?KOR:C.t1}}>{fmt(h.tutar)}</div>}
              <span style={{fontSize:9.5,fontWeight:700,color:et.renk,background:et.bg,borderRadius:20,padding:"2px 8px",display:"inline-block",marginTop:4}}>{et.metin}</span>
            </div>
          </div>;
        })}
      </div>;
    })()}

    {/* 4 — Hızlı işlemler. Renkli daireler yerine tek tonlu sakin ızgara. */}
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"16px 12px 10px",marginBottom:20,boxShadow:C.sh}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 5px",marginBottom:15}}>
        <span style={{fontSize:14,fontWeight:700,letterSpacing:"-0.015em",color:C.t1}}>{T.hizliIslemler||"Hızlı işlemler"}</span>
        <span onClick={onOzellestir} style={{fontSize:11.5,fontWeight:600,color:C.t3,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          {T.duzenle} <i className="ti ti-pencil" style={{fontSize:12}} aria-hidden="true"/>
        </span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",rowGap:16,columnGap:4}}>
        {hizli.map(m=><div key={m.l} onClick={m.act} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer",position:"relative"}}>
          <div style={{width:46,height:46,borderRadius:15,display:"flex",alignItems:"center",justifyContent:"center",
            background:m.vurgu?TEAL:C.bg,border:`1px solid ${m.vurgu?TEAL:C.border}`,color:m.vurgu?"#fff":TEAL}}>
            <i className={`ti ${m.ic}`} style={{fontSize:21}} aria-hidden="true"/>
          </div>
          {m.nokta&&<span style={{position:"absolute",top:-2,right:"18%",width:8,height:8,borderRadius:"50%",background:KOR,border:`2px solid ${C.card}`}}/>}
          <span style={{fontSize:10,fontWeight:600,color:C.t2,textAlign:"center",lineHeight:1.2}}>{m.l}</span>
        </div>)}
      </div>
    </div>

    {/* 5 — İpucu şeridi: tek satır, sessiz. Kaydırılabilir. */}
    <div onClick={ipucu.act} onTouchStart={ipDokunBas} onTouchEnd={ipDokunBit}
      style={{display:"flex",alignItems:"center",gap:12,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"13px 15px",marginBottom:20,cursor:"pointer",boxShadow:C.sh,touchAction:"pan-y"}}>
      <div style={{width:36,height:36,borderRadius:12,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:TEAL}}>
        <i className={`ti ${ipucu.ic}`} style={{fontSize:17}} aria-hidden="true"/>
      </div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:12.5,fontWeight:700,color:C.t1,letterSpacing:"-0.01em"}}>{ipucu.baslik}</div>
        <div style={{fontSize:11,color:C.t3,marginTop:2,lineHeight:1.4,overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{ipucu.metin}</div>
      </div>
      <div style={{display:"flex",gap:4,flexShrink:0}}>
        {ipuclari.map((_,i)=><span key={i} onClick={e=>{e.stopPropagation();setIpucuIx(i);}}
          style={{width:i===ipucuIx?12:4,height:4,borderRadius:3,background:i===ipucuIx?P:C.border,transition:"all 0.25s",cursor:"pointer"}}/>)}
      </div>
    </div>

    {/* 6 — Gelir / gider dökümü */}
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"17px 18px 18px",marginBottom:20,boxShadow:C.sh}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <span style={{fontSize:14,fontWeight:700,letterSpacing:"-0.015em",color:C.t1}}>{T.gelirGiderOzet||"Gelir · Gider"}</span>
        <span onClick={()=>setSekme("raporlar")} style={{fontSize:11.5,fontWeight:600,color:C.t3,cursor:"pointer"}}>{T.buAy} ▾</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.t3,marginBottom:4}}>{T.toplamGelir}</div>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:"-0.025em",color:C.t1,fontVariantNumeric:"tabular-nums"}}>{fmt(tahsil)}</div>
            {gelirD!==null&&<div style={{fontSize:10.5,fontWeight:600,color:gelirD>=0?YESIL:KOR,marginTop:3}}>{gelirD>=0?"↑":"↓"} %{Math.abs(gelirD)}</div>}
          </div>
          <div>
            <div style={{fontSize:10.5,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:C.t3,marginBottom:4}}>{T.toplamGider}</div>
            <div style={{fontSize:18,fontWeight:800,letterSpacing:"-0.025em",color:C.t1,fontVariantNumeric:"tabular-nums"}}>{fmt(gider)}</div>
            {giderD!==null&&<div style={{fontSize:10.5,fontWeight:600,color:giderD<=0?YESIL:KOR,marginTop:3}}>{giderD>=0?"↑":"↓"} %{Math.abs(giderD)}</div>}
          </div>
        </div>
        <div style={{position:"relative",width:112,height:112,flexShrink:0}}>
          <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
            <circle cx="56" cy="56" r="44" fill="none" stroke={C.bg} strokeWidth="11"/>
            <circle cx="56" cy="56" r="44" fill="none" stroke={karOran>=0?P:KOR} strokeWidth="11" strokeLinecap="round"
              strokeDasharray={cevre} strokeDashoffset={cevre*(1-Math.max(Math.min(karOran,100),0)/100)} transform="rotate(-90 56 56)"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:21,fontWeight:800,letterSpacing:"-0.03em",color:C.t1,fontVariantNumeric:"tabular-nums"}}>%{karOran}</span>
            <span style={{fontSize:10,color:C.t3,marginTop:1}}>{T.karOrani||"Kâr oranı"}</span>
          </div>
        </div>
      </div>
    </div>

    {/* 7 — İş kolu */}
    <div style={{display:"flex",gap:10,marginBottom:20}}>
      <div style={{flex:1,position:"relative",background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"12px 15px",display:"flex",alignItems:"center",gap:12,boxShadow:C.sh}}>
        <div style={{width:36,height:36,borderRadius:12,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:TEAL}}>
          <i className="ti ti-tool" style={{fontSize:17}} aria-hidden="true"/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:9.5,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:C.t3,marginBottom:2}}>{T.isKolunuz||"İş kolunuz"}</div>
          <div style={{fontSize:14,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isKolu}</div>
        </div>
        <i className="ti ti-chevron-down" style={{fontSize:14,color:C.t3}} aria-hidden="true"/>
        <select value={isKolu} onChange={e=>setIsKolu(e.target.value)} aria-label={T.isKolunuz||"İş kolunuz"} style={{position:"absolute",inset:0,opacity:0,width:"100%",cursor:"pointer"}}>
          {IS_KOLLARI.map(k=><option key={k.label} value={k.label}>{k.icon} {k.label}</option>)}
        </select>
      </div>
      <button onClick={onOzellestir} aria-label={T.ayarlar||"Ayarlar"} style={{width:64,background:C.card,border:`1px solid ${C.border}`,borderRadius:16,cursor:"pointer",color:C.t2,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,boxShadow:C.sh}}>
        <i className="ti ti-settings" style={{fontSize:19}} aria-hidden="true"/>
        <span style={{fontSize:9.5,fontWeight:600}}>{T.ayarlar||"Ayarlar"}</span>
      </button>
    </div>

    {/* 8 — Canlı piyasa */}
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"2px 12px 12px",marginBottom:16,boxShadow:C.sh}}>
      <PiyasaSeridi C={C} P={P} T={T}/>
    </div>
{/* LED imza — mobil */}
  </div>;
});

// ─── ÖZELLEŞTİR MODAL ──────────────────────────────────────────
function OzellestirModal({moduller,setModuller,onKapat,T}){
  const [surukle,setSurukle]=useState(null);
  const [surukleOver,setSurukleOver]=useState(null);

  const toggle=(id)=>{
    setModuller(m=>m.map(x=>x.id===id?{...x,aktif:!x.aktif}:x));
  };
  const dragStart=(id)=>setSurukle(id);
  const dragOver=(e,id)=>{e.preventDefault();setSurukleOver(id);};
  const dragEnd=()=>{
    if(surukle&&surukleOver&&surukle!==surukleOver){
      setModuller(m=>{
        const arr=[...m];
        const from=arr.findIndex(x=>x.id===surukle);
        const to=arr.findIndex(x=>x.id===surukleOver);
        const [item]=arr.splice(from,1);
        arr.splice(to,0,item);
        return arr;
      });
    }
    setSurukle(null);setSurukleOver(null);
  };

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={"⚙️ "+T.duzenleBaslik1+" "+T.duzenleBaslik2} onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        <Sh s={{padding:"14px 16px",marginBottom:18,background:C.purpleBg}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:4}}>💡 {T.duzenleAlt}</div>
          <div style={{fontSize:11,color:C.t2,lineHeight:1.5}}>{T.modulBilgi}</div>
        </Sh>

        <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",margin:"0 4px 10px"}}>{T.hizliModullerB}</div>

        {moduller.map((m,i)=>(
          <div key={m.id}
            draggable
            onDragStart={()=>dragStart(m.id)}
            onDragOver={(e)=>dragOver(e,m.id)}
            onDragEnd={dragEnd}
            style={{
              background:surukleOver===m.id?C.purpleBg:C.card,
              borderRadius:16,
              padding:"14px 16px",
              marginBottom:10,
              display:"flex",
              alignItems:"center",
              gap:14,
              boxShadow:surukle===m.id?"0 8px 24px rgba(91,92,246,0.25)":C.sh,
              opacity:surukle===m.id?0.7:1,
              transform:surukle===m.id?"scale(1.02)":"none",
              transition:"all 0.15s",
              cursor:"grab",
              border:`2px solid ${surukleOver===m.id?P:"transparent"}`,
            }}>
            {/* Drag handle */}
            <div style={{fontSize:16,color:C.t3,flexShrink:0,cursor:"grab"}}>⠿</div>
            {/* İkon */}
            <div style={{width:44,height:44,borderRadius:13,background:m.aktif?m.bg:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"background 0.2s"}}>{m.icon}</div>
            {/* Bilgi */}
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:m.aktif?C.t1:C.t3}}>{typeof m.label==="function"?m.label(T):(m.label||m.id)}</div>
              <div style={{fontSize:10,color:C.t3,marginTop:2}}>{typeof m.aciklama==="function"?m.aciklama(T):(m.aciklama||"")}</div>
            </div>
            {/* Sıra no */}
            <div style={{fontSize:11,color:C.t3,minWidth:20,textAlign:"center"}}>{i+1}</div>
            {/* Toggle */}
            <Toggle on={m.aktif} set={()=>toggle(m.id)}/>
          </div>
        ))}

        <Sh s={{padding:"14px 16px",marginTop:8}}>
          <div style={{fontSize:12,color:C.t2,textAlign:"center",lineHeight:1.6}}>
            {T.modulFooter}
          </div>
        </Sh>
      </div>

      {/* Kaydet */}
      <div style={{padding:"12px 14px 28px",background:C.card,borderTop:`1px solid ${C.border}`}}>
        <button onClick={onKapat} style={{width:"100%",background:P,border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>✓ {T.kaydet}</button>
      </div>
    </div>
  </div>;
}

const MODUL_VARSAYILAN=[
  {id:"isler",icon:"📋",bg:"#EDE9FE",aktif:true,aciklama:T=>T.mIslerA,label:T=>T.isAkislari},
  {id:"faturalar",icon:"🧾",bg:"#DBEAFE",aktif:true,aciklama:T=>T.mFaturaA,label:T=>T.faturalar},
  {id:"tahsilatlar",icon:"⏰",bg:"#FEF3C7",aktif:true,aciklama:T=>T.mTahsilatA,label:T=>T.tahsilatlar},
  {id:"musteriler",icon:"👥",bg:"#DCFCE7",aktif:true,aciklama:T=>T.mMusteriA,label:T=>T.musteriler},
  {id:"teklifler",icon:"🏷️",bg:"#FEE2E2",aktif:true,aciklama:T=>T.mTeklifA,label:T=>T.teklifler},
  {id:"raporlar",icon:"📊",bg:"#FCE7F3",aktif:true,aciklama:T=>T.mRaporA,label:T=>T.raporlar},
  {id:"giderler",icon:"💰",bg:"#FEF3C7",aktif:true,aciklama:T=>T.mGiderA,label:T=>T.giderler},
  {id:"daha",icon:"⊞",bg:"#F3F4F6",aktif:true,aciklama:T=>T.mDahaA,label:T=>T.dahaFazla},
];

const QuickActions=memo(function QuickActions({setSekme,T,moduller,onDuzenle}){
  const gorununler=moduller.filter(m=>m.aktif);
  return <Sh s={{margin:MASAUSTU?"0 28px 16px":"0 14px 16px",padding:MASAUSTU?"20px 22px":"18px 16px",border:MASAUSTU?`1px solid ${C.border}`:"none",borderRadius:18}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"0 3px 15px"}}>
      <div style={{fontSize:MASAUSTU?15:16,fontWeight:700,color:C.t1}}>Hızlı İşlemler</div>
      <div onClick={onDuzenle} style={{fontSize:12.5,fontWeight:700,color:P,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
        {T.duzenle} <Ik n="kalem" s={13} c={P} w={2}/>
      </div>
    </div>
    <div style={{display:"grid",gridTemplateColumns:MASAUSTU?"repeat(10,1fr)":"repeat(4,1fr)",gap:MASAUSTU?18:12}}>
      {gorununler.map(a=>{
        const g=MODUL_IKON[a.id]||{n:"nokta",c:P};
        return <div key={a.id} onClick={()=>setSekme(a.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:9,cursor:"pointer"}}
          onMouseEnter={e=>{const b=e.currentTarget.firstChild;b.style.transform="translateY(-3px)";b.style.boxShadow=`0 8px 16px -4px ${g.c}66`;}}
          onMouseLeave={e=>{const b=e.currentTarget.firstChild;b.style.transform="none";b.style.boxShadow=`0 4px 10px ${g.c}40`;}}>
          <div style={{width:MASAUSTU?58:50,height:MASAUSTU?58:50,borderRadius:"50%",background:g.c,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.16s",boxShadow:`0 4px 10px ${g.c}40`}}>
            <Ik n={g.n} s={MASAUSTU?26:22} c="#fff" w={1.9}/>
          </div>
          <span style={{fontSize:MASAUSTU?11:10,fontWeight:700,color:C.t1,textAlign:"center",lineHeight:1.2}}>{typeof a.label==="function"?a.label(T):(a.label||a.id)}</span>
        </div>;
      })}
    </div>
    {gorununler.length<8&&<div style={{textAlign:"center",marginTop:12}}>
      <span onClick={onDuzenle} style={{fontSize:11,color:P,fontWeight:600,cursor:"pointer"}}>{T.modulEkle}</span>
    </div>}
  </Sh>;
})

// ─── DETAY MODALLARİ (Grafik tıklama) ──────────────────────────
function GelirGiderDetay({jobs,giderler,onKapat,T}){
  const [grafikFiltre,setGrafikFiltre]=useState("gelir"); // gelir | gider | net
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const aktifT=jobs.filter(j=>j.durum==="aktif").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const toplamGelir=tahsilE+aktifT;
  const toplamGider=giderler.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamGelir-toplamGider;
  const katToplam={};giderler.forEach(g=>{katToplam[g.kategori]=(katToplam[g.kategori]||0)+g.tutar;});

  // Haftalık veri — gerçek işlerden ve giderlerden hesaplanır
  const giderData=(()=>{
    const bugun=new Date();bugun.setHours(0,0,0,0);
    const cikti=[];
    for(let i=6;i>=0;i--){
      const gun=new Date(bugun.getTime()-i*86400000);
      const iso=gun.toISOString().slice(0,10);
      const v=jobs.filter(j=>j.durum==="tamamlandi"&&(j.tarih||"").slice(0,10)===iso).reduce((a,j)=>a+(j.tutar||0),0);
      const g=giderler.filter(x=>(x.tarih||"").slice(0,10)===iso).reduce((a,x)=>a+(x.tutar||0),0);
      cikti.push({d:GUN_KISA[gun.getDay()],v,g,n:v-g});
    }
    return cikti;
  })();
  const haftaVeriVar=giderData.some(x=>x.v>0||x.g>0);
  const grafikVeri={
    gelir:{key:"v",renk:C.green,ad:T.toplamGelir},
    gider:{key:"g",renk:C.red,ad:T.toplamGider},
    net:{key:"n",renk:P,ad:T.netKar},
  };
  const aktifGrafik=grafikVeri[grafikFiltre];

  const gelirKaynaklari=[
    {label:"Tahsil Edilen İşler",val:tahsilE,color:C.green,icon:"✅"},
    {label:"Aktif İşler (devam eden)",val:aktifT,color:C.blue,icon:"🔄"},
    {label:"Bekleyen İşler",val:beklT,color:C.amber,icon:"⏳"},
  ];

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4}}>📊 {T.gelirGider} Detayı</div>
    <div style={{fontSize:11,color:C.t3,marginBottom:14}}>{new Date().toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}</div>

    {/* Özet kutular — tıklanabilir */}
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[
        {key:"gelir",l:T.toplamGelir,v:toplamGelir,c:C.green,bg:C.greenBg},
        {key:"gider",l:T.toplamGider,v:toplamGider,c:C.red,bg:C.redBg},
        {key:"net",l:T.netKar,v:netKar,c:netKar>=0?C.green:C.red,bg:netKar>=0?C.greenBg:C.redBg},
      ].map(x=><div key={x.key} onClick={()=>setGrafikFiltre(x.key)} style={{flex:1,background:grafikFiltre===x.key?x.bg:C.bg,borderRadius:14,padding:"12px 8px",textAlign:"center",cursor:"pointer",border:`2px solid ${grafikFiltre===x.key?x.c:C.border}`,transition:"all 0.15s"}}>
        <div style={{fontSize:9,color:grafikFiltre===x.key?x.c:C.t3,fontWeight:700,marginBottom:4}}>{x.l}</div>
        <div style={{fontSize:x.v>999999?11:13,fontWeight:900,color:grafikFiltre===x.key?x.c:C.t2}}>{fmt(x.v)}</div>
        {grafikFiltre===x.key&&<div style={{width:20,height:2,background:x.c,borderRadius:1,margin:"5px auto 0"}}/>}
      </div>)}
    </div>

    {/* Filtrelenebilir grafik */}
    <Sh s={{padding:14,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:C.t1}}>Haftalık {aktifGrafik.ad} Eğrisi</div>
        <div style={{display:"flex",gap:4}}>
          {Object.entries(grafikVeri).map(([k,v])=><button key={k} onClick={()=>setGrafikFiltre(k)} style={{padding:"3px 9px",borderRadius:7,border:`1.5px solid ${grafikFiltre===k?v.renk:C.border}`,background:grafikFiltre===k?v.renk+"22":"transparent",color:grafikFiltre===k?v.renk:C.t3,fontSize:10,fontWeight:700,cursor:"pointer"}}>{v.ad}</button>)}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={giderData}>
          <XAxis dataKey="d" tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false}/>
          <Line type="monotone" dataKey={aktifGrafik.key} stroke={aktifGrafik.renk} strokeWidth={2.5} dot={{r:3,fill:aktifGrafik.renk}} activeDot={{r:5}}/>
          <Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)} labelStyle={{color:C.t2}}/>
        </LineChart>
      </ResponsiveContainer>
      {/* Mini legend */}
      <div style={{display:"flex",gap:12,marginTop:8,justifyContent:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:3,borderRadius:2,background:aktifGrafik.renk}}/><span style={{fontSize:10,color:C.t3}}>{aktifGrafik.ad}</span></div>
      </div>
    </Sh>

    {/* Gelir kaynakları */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.gelirKaynaklariB}</div>
    <Sh s={{marginBottom:16,overflow:"hidden"}}>
      {gelirKaynaklari.map((g,i)=><div key={g.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<gelirKaynaklari.length-1?`1px solid ${C.border}`:"none"}}>
        <span style={{fontSize:20}}>{g.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{g.label}</div>
          <div style={{background:C.border,borderRadius:3,height:5,marginTop:5}}>
            <div style={{width:`${toplamGelir>0?g.val/toplamGelir*100:0}%`,background:g.color,height:"100%",borderRadius:3,transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{textAlign:"right",minWidth:80}}>
          <div style={{fontSize:13,fontWeight:800,color:g.color}}>{fmt(g.val)}</div>
          <div style={{fontSize:10,color:C.t3}}>{toplamGelir>0?Math.round(g.val/toplamGelir*100):0}%</div>
        </div>
      </div>)}
    </Sh>

    {/* Gider kategorileri */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.giderKategorileriB}</div>
    {Object.keys(katToplam).length===0
      ?<Sh s={{padding:18,textAlign:"center",marginBottom:16}}><div style={{fontSize:13,color:C.t3}}>{T.henuzGiderYok}</div></Sh>
      :<Sh s={{marginBottom:16,overflow:"hidden"}}>
        {Object.entries(katToplam).sort((a,b)=>b[1]-a[1]).map(([k,v],i,arr)=><div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:36,height:36,borderRadius:10,background:C.redBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💸</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{k}</div>
            <div style={{background:C.border,borderRadius:3,height:5,marginTop:5}}><div style={{width:`${toplamGider>0?v/toplamGider*100:0}%`,background:C.red,height:"100%",borderRadius:3}}/></div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:800,color:C.red}}>-{fmt(v)}</div>
            <div style={{fontSize:10,color:C.t3}}>{toplamGider>0?Math.round(v/toplamGider*100):0}%</div>
          </div>
        </div>)}
      </Sh>
    }
    <button onClick={onKapat} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>Kapat</button>
  </BottomSheet>;
}

function TahsilatDetay({jobs,onKapat,onTahsil,T}){
  const [aktifFiltre,setAktifFiltre]=useState("hepsi"); // hepsi | tahsil | bekliyor | aktif
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi");
  const bekliyor=jobs.filter(j=>j.durum==="bekliyor");
  const aktifJ=jobs.filter(j=>j.durum==="aktif");
  const tahsilTutar=tahsilE.reduce((s,j)=>s+j.tutar,0);
  const beklTutar=bekliyor.reduce((s,j)=>s+j.tutar,0);
  const aktifTutar=aktifJ.reduce((s,j)=>s+j.tutar,0);
  const total=tahsilTutar+beklTutar;
  const oran=total>0?Math.round((tahsilTutar/total)*100):0;
  const bosMu=(tahsilTutar+beklTutar+aktifTutar)===0;
  const pie=[
    {name:T.tahsilEdilen,gercek:tahsilTutar,val:bosMu?1:tahsilTutar,color:C.green},
    {name:T.bekleyen,gercek:beklTutar,val:bosMu?1:beklTutar,color:C.amber},
    {name:T.devamEdenL,gercek:aktifTutar,val:bosMu?1:aktifTutar,color:C.blue},
  ];
  const kartlar=[
    {key:"tahsil",l:T.tahsilEdildi,v:tahsilTutar,s:tahsilE.length+" "+T.isL,c:C.green,bg:C.greenBg,icon:"✅",liste:tahsilE},
    {key:"bekliyor",l:T.beklemede,v:beklTutar,s:bekliyor.length+" "+T.isL,c:C.amber,bg:C.amberBg,icon:"⏰",liste:bekliyor},
    {key:"aktif",l:T.devamEdenL,v:aktifTutar,s:aktifJ.length+" "+T.isL,c:C.blue,bg:C.blueBg,icon:"🔄",liste:aktifJ},
  ];
  const gosterList = aktifFiltre==="hepsi" ? jobs : (kartlar.find(k=>k.key===aktifFiltre)?.liste||[]);

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4}}>💰 {T.tahsilatDurumu} Detayı</div>
    <div style={{fontSize:11,color:C.t3,marginBottom:16}}>{new Date().toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}</div>

    {/* Büyük donut */}
    <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
      <div style={{position:"relative",flexShrink:0}}>
        <PieChart width={130} height={130}>
          <Pie data={pie} cx={60} cy={60} innerRadius={34} outerRadius={58} dataKey="val" startAngle={90} endAngle={-270} strokeWidth={0}>
            {pie.map((d,i)=><Cell key={i} fill={d.color}/>)}
          </Pie>
        </PieChart>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",lineHeight:1.3}}>
          <div style={{fontSize:20,fontWeight:900,color:C.green}}>%{oran}</div>
          <div style={{fontSize:9,color:C.t3}}>tahsilat</div>
        </div>
      </div>
      <div style={{flex:1}}>
        {pie.map(d=><div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/><span style={{fontSize:11,color:C.t2}}>{d.name}</span></div>
          <span style={{fontSize:12,fontWeight:700,color:C.t1}}>{fmt(d.gercek)}</span>
        </div>)}
        <div style={{background:C.border,borderRadius:4,height:6,marginTop:4,overflow:"hidden"}}>
          <div style={{width:`${oran}%`,background:`linear-gradient(90deg,${C.green},#34D399)`,height:"100%",borderRadius:4}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:9,color:C.t3}}>{fmt(tahsilTutar)}</span>
          <span style={{fontSize:9,color:C.t3}}>{fmt(total)} toplam</span>
        </div>
      </div>
    </div>

    {/* Tıklanabilir filtre kartları */}
    <div style={{display:"flex",gap:7,marginBottom:16}}>
      <div onClick={()=>setAktifFiltre("hepsi")} style={{flex:1,background:aktifFiltre==="hepsi"?P:C.bg,borderRadius:12,padding:"9px 4px",textAlign:"center",cursor:"pointer",border:`2px solid ${aktifFiltre==="hepsi"?P:C.border}`,transition:"all 0.15s"}}>
        <div style={{fontSize:11,fontWeight:700,color:aktifFiltre==="hepsi"?"#fff":C.t2}}>{T.tumu}</div>
        <div style={{fontSize:10,color:aktifFiltre==="hepsi"?"rgba(255,255,255,0.8)":C.t3}}>{jobs.length} {T.isL}</div>
      </div>
      {kartlar.map(x=><div key={x.key} onClick={()=>setAktifFiltre(x.key)} style={{flex:1,background:aktifFiltre===x.key?x.bg:C.bg,borderRadius:12,padding:"9px 4px",textAlign:"center",cursor:"pointer",border:`2px solid ${aktifFiltre===x.key?x.c:C.border}`,transition:"all 0.15s"}}>
        <div style={{fontSize:16,marginBottom:2}}>{x.icon}</div>
        <div style={{fontSize:9,color:x.c,fontWeight:700}}>{x.l}</div>
        <div style={{fontSize:10,fontWeight:800,color:x.c}}>{fmt(x.v)}</div>
        <div style={{fontSize:9,color:x.c,opacity:0.75}}>{x.s}</div>
      </div>)}
    </div>

    {/* Aktif filtreye göre liste */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>
      {aktifFiltre==="hepsi"?T.tumIslerB:kartlar.find(k=>k.key===aktifFiltre)?.l.toUpperCase()+" — "+T.listesiB}
    </div>
    {gosterList.length===0
      ?<Sh s={{padding:20,textAlign:"center",marginBottom:12}}><div style={{fontSize:13,color:C.t3}}>{T.kategoriIsYok}</div></Sh>
      :<Sh s={{marginBottom:16,overflow:"hidden"}}>
        {gosterList.slice(0,8).map((j,i)=>{
          const renk=j.durum==="tamamlandi"?C.green:j.durum==="bekliyor"?C.amber:C.blue;
          const bg=j.durum==="tamamlandi"?C.greenBg:j.durum==="bekliyor"?C.amberBg:C.blueBg;
          return <div key={j.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<gosterList.slice(0,8).length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:38,height:38,borderRadius:10,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.musteri}</div>
              <div style={{fontSize:11,color:C.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:13,fontWeight:800,color:renk}}>{fmt(j.tutar)}</div>
              <div style={{fontSize:10,color:C.t3,marginTop:2}}>{j.tarih}</div>
              {j.durum==="bekliyor"&&onTahsil&&<button onClick={()=>{onTahsil(j.id);}} style={{marginTop:4,background:C.greenBg,border:"none",borderRadius:7,padding:"3px 8px",color:C.green,fontSize:10,fontWeight:700,cursor:"pointer"}}>💰 Tahsil</button>}
            </div>
          </div>;
        })}
      </Sh>
    }
    <button onClick={onKapat} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>Kapat</button>
  </BottomSheet>;
}

const Charts=memo(function Charts({jobs,giderler,T,onTahsil}){
  const [modal,setModal]=useState(null); // "gelir" | "tahsilat"
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const aktifT=jobs.filter(j=>j.durum==="aktif").reduce((s,j)=>s+j.tutar,0);
  const toplamGelir=tahsilE+aktifT;
  const toplamGider=giderler.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamGelir-toplamGider;
  const geciken=Math.round(beklT*0.35),vadesiz=Math.round(beklT*0.65);
  const total=tahsilE+beklT+geciken;
  const oran=total>0?Math.round((tahsilE/total)*100):0;
  const bosMu=(tahsilE+beklT+geciken+vadesiz)===0;
  const pie=[
    {name:T.tahsilEdilen,gercek:tahsilE,val:bosMu?1:tahsilE,color:C.green},
    {name:T.bekleyen,gercek:beklT,val:bosMu?1:beklT,color:C.blue},
    {name:T.geciken,gercek:geciken,val:bosMu?1:geciken,color:C.amber},
    {name:T.vadesiGelmeyen,gercek:vadesiz,val:bosMu?1:vadesiz,color:"#9CA3AF"},
  ];
  return <>
    <div style={{display:"flex",gap:10,margin:"0 14px 14px"}}>
      {/* Gelir-Gider kartı */}
      <Sh onClick={()=>setModal("gelir")} s={{flex:1,padding:"14px",cursor:"pointer",position:"relative"}}>
        <div style={{position:"absolute",top:10,right:10,fontSize:10,color:P,background:C.purpleBg,padding:"2px 7px",borderRadius:6,fontWeight:700}}>{T.detayL} ›</div>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10,paddingRight:54}}>{T.gelirGider}</div>
        <div style={{marginBottom:5}}><div style={{fontSize:10,color:C.t3}}>{T.toplamGelir}</div><span style={{fontSize:13,fontWeight:800,color:C.green}}>{fmt(toplamGelir)}</span></div>
        <div style={{marginBottom:5}}><div style={{fontSize:10,color:C.t3}}>{T.toplamGider}</div><span style={{fontSize:13,fontWeight:800,color:C.red}}>{fmt(toplamGider)}</span></div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.t3}}>{T.netKar}</div><div style={{fontSize:14,fontWeight:800,color:netKar>=0?C.t1:C.red}}>{fmt(netKar)}</div></div>
        {(()=>{const sr=son7GunGelir(jobs);return sr.some(x=>x.v>0)
          ? <ResponsiveContainer width="100%" height={50}><LineChart data={sr}><Line type="monotone" dataKey="v" stroke={P} strokeWidth={2.5} dot={false}/></LineChart></ResponsiveContainer>
          : <div style={{height:50,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,color:C.t3,textAlign:"center",lineHeight:1.5}}>İlk işini tamamlayınca<br/>haftalık grafiğin burada çıkar</div>;})()}
      </Sh>
      {/* Tahsilat kartı */}
      <Sh onClick={()=>setModal("tahsilat")} s={{flex:1,padding:"14px",cursor:"pointer",position:"relative"}}>
        <div style={{position:"absolute",top:10,right:10,fontSize:10,color:P,background:C.purpleBg,padding:"2px 7px",borderRadius:6,fontWeight:700}}>{T.detayL} ›</div>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:8,paddingRight:54}}>{T.tahsilatDurumu}</div>
        <div style={{position:"relative",display:"flex",justifyContent:"center",marginBottom:8}}>
          <PieChart width={120} height={96}><Pie data={pie} cx={55} cy={48} innerRadius={28} outerRadius={46} dataKey="val" startAngle={90} endAngle={-270} strokeWidth={0}>{pie.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",lineHeight:1.2}}>
            <div style={{fontSize:8,color:C.t3}}>{T.toplam}</div>
            <div style={{fontSize:10,fontWeight:800,color:C.t1}}>{fmt(tahsilE+beklT)}</div>
          </div>
        </div>
        {pie.map(d=><div key={d.name} style={{display:"flex",justifyContent:"space-between",marginBottom:4,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/><span style={{fontSize:9,color:C.t2}}>{d.name}</span></div>
          <span style={{fontSize:9,fontWeight:700,color:C.t1}}>{fmt(d.gercek)}</span>
        </div>)}
        <div style={{marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:C.t3}}>{T.tahsilatOrani}</span><span style={{fontSize:9,fontWeight:700,color:C.green}}>%{oran}</span></div>
          <div style={{background:C.border,borderRadius:4,height:5}}><div style={{width:`${oran}%`,background:C.green,height:"100%",borderRadius:4}}/></div>
        </div>
      </Sh>
    </div>
    {modal==="gelir"&&<GelirGiderDetay jobs={jobs} giderler={giderler} onKapat={()=>setModal(null)} T={T}/>}
    {modal==="tahsilat"&&<TahsilatDetay jobs={jobs} onTahsil={onTahsil} onKapat={()=>setModal(null)} T={T}/>}
  </>;
})

const JobList=memo(function JobList({jobs,onSelect,T,onTum}){
  return <div style={{margin:"0 14px 16px"}}>
    <div style={{fontSize:16,fontWeight:700,color:C.t1,marginBottom:12}}>{T.sonIsAkislari}</div>
    {jobs.length===0&&<Sh s={{padding:"22px 18px",textAlign:"center",marginBottom:10}}>
      <div style={{fontSize:28,marginBottom:8}}>📋</div>
      <div style={{fontSize:13,color:C.t3,lineHeight:1.5}}>Henüz iş eklenmedi.<br/>İlk işini ekleyerek başla.</div>
    </Sh>}
    {jobs.slice(0,3).map(j=><Sh key={j.id} onClick={()=>onSelect(j)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:46,height:46,borderRadius:12,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{j.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <span style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>{j.ref}</span>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
          <div style={{fontSize:11,color:C.t3}}>{T.musteri}: {j.musteri}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}><Badge durum={j.durum}/><div style={{fontSize:13,fontWeight:700,color:C.t1,marginTop:4}}>{fmt(j.tutar)}</div></div>
        <span style={{color:C.t3,fontSize:16}}>›</span>
      </div>
    </Sh>)}
    {jobs.length>0&&<div onClick={onTum} style={{textAlign:"center",padding:"10px 0"}}><span style={{fontSize:13,color:P,fontWeight:600,cursor:"pointer"}}>{T.tumunuGoruntule} →</span></div>}
  </div>;
})

// ─── MODALLAR ────────────────────────────────────────────────────
function DetayModal({job,onKapat,onDurum,onFatura,onSil,onDuzenle,onOdeme,T,giderler,onPatch,onSahitli}){
  const [silOnay,setSilOnay]=useState(false);
  const [odemeAc,setOdemeAc]=useState(false);
  const [odemeTutar,setOdemeTutar]=useState("");
  const [buyukFoto,setBuyukFoto]=useState(null);
  const odenen=(job.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
  const kalan=job.tutar-odenen;
  const TEKRAR_AD={haftalik:"Haftalık",aylik:"Aylık",yillik:"Yıllık"};
  // Bu işe bağlı giderler
  const isGiderleri=(giderler||[]).filter(g=>g.isId===job.id);

  const odemeEkle=()=>{
    const t=Number(odemeTutar)*(KURLAR[AKTIF_PARA]||1);
    if(t<=0)return;
    onOdeme(job.id,{tutar:Math.min(t,kalan),tarih:new Date().toLocaleDateString("tr-TR")});
    setOdemeTutar("");setOdemeAc(false);
  };

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
      <div style={{width:52,height:52,borderRadius:14,background:job.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{job.icon}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>{job.ref}{job.tekrar&&job.tekrar!=="yok"&&<span style={{marginLeft:6,background:C.purpleBg,color:P,padding:"1px 7px",borderRadius:10,fontWeight:700}}>🔁 {TEKRAR_AD[job.tekrar]}</span>}</div>
        <div style={{fontSize:17,fontWeight:700,color:C.t1}}>{job.baslik}</div>
        <div style={{fontSize:13,color:C.t2}}>{T.musteri}: {job.musteri}</div>
      </div>
      <button onClick={onDuzenle} style={{background:C.purpleBg,border:"none",borderRadius:10,padding:"8px 12px",color:P,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>✏️</button>
    </div>

    {/* Ödeme durumu — kısmi tahsilat */}
    {job.durum!=="tamamlandi"&&<div style={{background:odenen>0?C.greenBg:C.bg,borderRadius:14,padding:"12px 16px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:odenen>0?8:0}}>
        <span style={{fontSize:12,color:C.t2,fontWeight:600}}>💰 {T.odemeDurumu}</span>
        <button onClick={()=>setOdemeAc(!odemeAc)} style={{background:P,border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>{T.kaparoEkle}</button>
      </div>
      {odenen>0&&<>
        <div style={{background:C.border,borderRadius:4,height:8,overflow:"hidden",marginBottom:6}}>
          <div style={{width:`${Math.min(odenen/job.tutar*100,100)}%`,background:C.green,height:"100%",borderRadius:4}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:C.green,fontWeight:700}}>{T.alinan}: {fmt(odenen)}</span>
          <span style={{fontSize:11,color:C.amber,fontWeight:700}}>{T.kalanL}: {fmt(kalan)}</span>
        </div>
      </>}
      {odemeAc&&<div style={{display:"flex",gap:8,marginTop:10}}>
        <input type="number" value={odemeTutar} onChange={e=>setOdemeTutar(e.target.value)} placeholder={"Tutar ("+AKTIF_PARA+") — kalan: "+Math.round(kalan/(KURLAR[AKTIF_PARA]||1))}
          style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.t1,fontSize:13,outline:"none"}}/>
        <button onClick={odemeEkle} style={{background:C.green,border:"none",borderRadius:10,padding:"10px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓</button>
      </div>}
      {(job.odemeler||[]).length>0&&<div style={{marginTop:8}}>
        {(job.odemeler||[]).map((o,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.t2,padding:"3px 0"}}>
          <span>· {o.tarih}</span><span style={{fontWeight:700,color:C.green}}>+{fmt(o.tutar)}</span>
        </div>)}
      </div>}
    </div>}

    <div style={{background:C.bg,borderRadius:14,padding:"4px 16px",marginBottom:14}}>
      {[[T.tarihL,job.tarih],[T.durumL,DURUM[job.durum]?.label],[T.tutarL,fmt(job.tutar)],job.atanan?["👷 "+T.atananL,job.atanan]:null,job.maliyet>0?["💰 "+T.maliyetL,fmt(job.maliyet)]:null,job.maliyet>0?[(job.tutar-job.maliyet>=0?"✅ ":"⚠️ ")+T.netKar,fmt(job.tutar-job.maliyet)+" (%"+Math.round((job.tutar-job.maliyet)/job.tutar*100)+")"]:null,job.isAdresi?["📍 "+T.adresL,job.isAdresi]:null,job.hatirlatma?["⏰ "+T.hatirlatma,new Date(job.hatirlatma).toLocaleString("tr-TR")]:null].filter(Boolean).map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`,gap:10}}>
          <span style={{fontSize:13,color:C.t2,flexShrink:0}}>{l}</span><span style={{fontSize:13,fontWeight:600,color:C.t1,textAlign:"right"}}>{v}</span>
        </div>
      ))}
      {job.isAdresi&&<div style={{padding:"10px 0"}}>
        <button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.isAdresi)}&travelmode=driving`,"_blank")} style={{width:"100%",background:C.blueBg,border:"none",borderRadius:10,padding:"10px 0",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer"}}>🗺️ {T.navBaslat}</button>
      </div>}
    </div>

    {/* 🚦 İş Aşaması + hız/kâr uyarısı */}
    {job.durum!=="tamamlandi"&&(()=>{
      const asama=job.asama||0;
      const gun=Math.max(0,Math.floor((Date.now()-new Date(job.tarih).getTime())/86400000));
      const kisi=job.kisiSayisi||1;
      const yavas=gun>=5&&asama<2||gun>=10&&asama<3||gun>=15&&asama<4;
      return <div style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>🚦 İş Aşaması · {gun}. gün · 👥 {kisi} kişi</div>
        <Sh s={{padding:"14px 15px"}}>
          <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:10}}>
            {ASAMALAR.map((a,i)=><div key={a} style={{flex:1,display:"flex",alignItems:"center",gap:4}}>
              <div onClick={()=>onPatch&&onPatch(job.id,{asama:i})} style={{width:"100%",height:7,borderRadius:4,background:i<=asama?P:C.border,cursor:"pointer"}}/>
            </div>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:800,color:P}}>{ASAMALAR[asama]}</span>
            {asama<ASAMALAR.length-1&&<button onClick={()=>{const y=asama+1;onPatch&&onPatch(job.id,{asama:y});if(y===ASAMALAR.length-1&&onDurum)onDurum(job.id,"tamamlandi");}} style={{background:P,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>Sonraki Aşama ›</button>}
          </div>
          {yavas&&<div style={{marginTop:11,background:"#FDF0D9",border:"1px solid #F6D18B",borderRadius:11,padding:"10px 12px",fontSize:12,color:"#92600A",lineHeight:1.6}}>
            ⚠️ <b>Yavaşlama uyarısı:</b> Bu iş {gun} gündür "{ASAMALAR[asama].replace(/^\S+ /,"")}" aşamasında{kisi>1?" ve "+kisi+" kişi çalışıyor":""}. Her ek gün işçilik/masraf demek — kârın eriyor.{job.maliyet?" Tahmini maliyet "+fmt(job.maliyet)+", tutar "+fmt(job.tutar)+" — marj daralıyor.":" Bitirmeyi hızlandır veya müşteriyle ek bedel konuş."}
          </div>}
        </Sh>
      </div>;
    })()}
    <SesliNot deger={job.sesliNot} onKaydet={(v)=>onPatch&&onPatch(job.id,{sesliNot:v})} onSil={()=>onPatch&&onPatch(job.id,{sesliNot:null})}/>
    {/* 🧰 Kullanılan malzemeler */}
    {job.malzemeler&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.malzemelerL||"🧰 Kullanılan Malzemeler"}</div>
      <Sh s={{padding:"12px 14px"}}><div style={{fontSize:13,color:C.t1,whiteSpace:"pre-wrap",lineHeight:1.6}}>{job.malzemeler}</div></Sh>
    </div>}

    {/* 📝 Not */}
    {job.not&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.notBaslik||"📝 Not"}</div>
      <Sh s={{padding:"12px 14px",borderLeft:`3px solid ${GOLD}`}}><div style={{fontSize:13,color:C.t1,whiteSpace:"pre-wrap",lineHeight:1.6}}>{job.not}</div></Sh>
    </div>}

    {/* İşe bağlı giderler */}
    {isGiderleri.length>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>💸 {T.giderlerB} ({isGiderleri.length})</div>
      <Sh s={{padding:"4px 14px"}}>
        {isGiderleri.map(g=><div key={g.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <div><div style={{fontSize:12,fontWeight:600,color:C.t1}}>{g.ad}</div><div style={{fontSize:10,color:C.t3}}>{g.kategori} · {g.tarih}</div></div>
          <span style={{fontSize:13,fontWeight:700,color:C.red}}>-{fmt(g.tutar)}</span>
        </div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0"}}>
          <span style={{fontSize:12,fontWeight:700,color:C.t2}}>{T.toplamGider}</span>
          <span style={{fontSize:13,fontWeight:800,color:C.red}}>-{fmt(isGiderleri.reduce((s,g)=>s+g.tutar,0))}</span>
        </div>
      </Sh>
    </div>}

    {/* Fotoğraflar */}
    {(job.fotolar||[]).length>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>📷 {T.fotograflarB}</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {(job.fotolar||[]).map((f,i)=><img key={i} src={f} alt={"foto"+i} onClick={()=>setBuyukFoto(f)} style={{width:80,height:80,borderRadius:12,objectFit:"cover",border:`1px solid ${C.border}`,cursor:"pointer",flexShrink:0}}/>)}
      </div>
    </div>}
    {buyukFoto&&<div onClick={()=>setBuyukFoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
      <img src={buyukFoto} alt="büyük" style={{maxWidth:"95%",maxHeight:"90%",borderRadius:12}}/>
    </div>}

    {!silOnay?<>
      <button onClick={()=>onSahitli&&onSahitli(job)} style={{width:"100%",background:job.sahitli?"#DCFCE7":"#EEF2FF",border:"none",borderRadius:12,padding:13,color:job.sahitli?"#059669":"#4F46E5",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
        <i className={`ti ${job.sahitli?"ti-shield-check":"ti-shield-plus"}`} style={{fontSize:17}} aria-hidden="true"/>
        {job.sahitli?"🛡️ Şahitli İş Kaydını Gör":"🛡️ Şahitli İş Oluştur (foto+imza+konum)"}
      </button>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {job.durum!=="tamamlandi"&&<button onClick={()=>{onDurum(job.id,"tamamlandi");onKapat();}} style={{flex:1,background:C.greenBg,border:"none",borderRadius:12,padding:13,color:C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ {T.tamamla}</button>}
        <button onClick={onFatura} style={{flex:1,background:C.amberBg,border:"none",borderRadius:12,padding:13,color:C.amber,fontSize:13,fontWeight:700,cursor:"pointer"}}>📄 {T.faturaKes}</button>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setSilOnay(true)} style={{flex:1,background:C.redBg,border:"none",borderRadius:12,padding:13,color:C.red,fontSize:13,fontWeight:700,cursor:"pointer"}}>🗑️ {T.sil}</button>
        <BtnS onClick={onKapat}>{T.kapat}</BtnS>
      </div>
    </>:<div style={{background:C.redBg,borderRadius:14,padding:16}}>
      <div style={{fontSize:14,fontWeight:700,color:C.red,marginBottom:12,textAlign:"center"}}>{T.silOnay}</div>
      <div style={{display:"flex",gap:8}}>
        <BtnS onClick={()=>setSilOnay(false)}>{T.iptal}</BtnS>
        <button onClick={()=>{onSil(job.id);onKapat();}} style={{flex:2,background:C.red,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.evetSil}</button>
      </div>
    </div>}
  </BottomSheet>;
}

function FaturaModal({job,isletme,kdv,onKapat,onKesildi,gibAyar,onGibAc,T}){
  const [kalemler,setKalemler]=useState([{tanim:job.baslik,miktar:1,birim:job.tutar}]);
  const [alici,setAlici]=useState({ad:job.musteri,vkn:"",adres:""});
  const [preview,setPreview]=useState(false);
  const [tevkifat,setTevkifat]=useState(0); // 0 | 5 | 7 | 9  (x/10)
  const [iskonto,setIskonto]=useState(""); // % müşteri indirimi
  const ara=kalemler.reduce((s,k)=>s+k.miktar*k.birim,0);
  const iskontoT=Number(iskonto)>0?Math.round(ara*Number(iskonto)/100):0;
  const matrah=ara-iskontoT;
  const kdvT=Math.round(matrah*kdv/100);
  const tevkifatT=tevkifat>0?Math.round(kdvT*tevkifat/10):0;
  const genel=matrah+kdvT-tevkifatT;
  const belgeNo="TFE"+new Date().getFullYear()+String(fatNo).padStart(9,"0");
  const simdi=new Date();

  const whatsappPaylas=()=>{
    const metin=`🧾 *PROFORMA FATURA — ${isletme.ad}*\n\nSayın ${alici.ad},\n\nBelge No: ${belgeNo}\nTarih: ${simdi.toLocaleDateString("tr-TR")}\n\n${kalemler.map(k=>`• ${k.tanim}: ${(k.miktar*k.birim).toLocaleString("tr-TR")} TL`).join("\n")}\n\nToplam: ${ara.toLocaleString("tr-TR")} TL${iskontoT>0?`\nİskonto (%${iskonto}): -${iskontoT.toLocaleString("tr-TR")} TL`:""}\nKDV (%${kdv}): ${kdvT.toLocaleString("tr-TR")} TL${tevkifatT>0?`\nTevkifat (${tevkifat}/10): -${tevkifatT.toLocaleString("tr-TR")} TL`:""}\n*ÖDENECEK: ${genel.toLocaleString("tr-TR")} TL*\n\n_Bu belge proforma faturadır, resmî fatura yerine geçmez._\n\n${isletme.telefon||""}`;
    window.open("https://wa.me/?text="+encodeURIComponent(metin),"_blank");
  };
  const yazdir=()=>{window.print();};

  const faturaKes=()=>{
    const fatura={no:belgeNo,jobRef:job.ref,musteri:alici.ad,tutar:genel,tarih:simdi.toLocaleDateString("tr-TR"),alici,kalemler,kdv,ara,iskonto:Number(iskonto)||0,iskontoT,kdvT,tevkifat,tevkifatT};
    onKesildi(fatura);
    fatNo++;
    // TradeFlow GİB'e fatura GÖNDERMEZ. Belge kaydedilir, kullanıcı resmî
    // beyanı kendi e-Fatura/e-Arşiv sağlayıcısı üzerinden yapar.
    onKapat();
  };

  if(preview) return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1001,padding:12}}>
    <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:APP_W,maxHeight:"92vh",overflowY:"auto",padding:"22px 20px",color:"#111",fontSize:12}}>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:900,letterSpacing:"0.05em"}}>e-ARŞİV FATURA</div>
        <div style={{fontSize:9,color:"#888",marginTop:2}}>BELGE TASLAĞI – Resmî geçerlilik için GİB e-Fatura/e-Arşiv sistemi kullanılmalıdır</div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <div style={{flex:1,border:"1px solid #ccc",borderRadius:8,padding:10}}>
          <div style={{fontSize:9,fontWeight:800,color:"#666",marginBottom:4}}>SATICI</div>
          <div style={{fontWeight:700,fontSize:12}}>{isletme.ad}</div>
          <div style={{fontSize:10,color:"#444"}}>{isletme.adres}</div>
          <div style={{fontSize:10,color:"#444"}}>VKN/TCKN: {isletme.vergiNo||"—"}</div>
          <div style={{fontSize:10,color:"#444"}}>Vergi D.: {isletme.vergiDairesi||"—"}</div>
        </div>
        <div style={{flex:1,border:"1px solid #ccc",borderRadius:8,padding:10}}>
          <div style={{fontSize:9,fontWeight:800,color:"#666",marginBottom:4}}>ALICI</div>
          <div style={{fontWeight:700,fontSize:12}}>{alici.ad}</div>
          <div style={{fontSize:10,color:"#444"}}>{alici.adres||"—"}</div>
          <div style={{fontSize:10,color:"#444"}}>VKN/TCKN: {alici.vkn||"—"}</div>
        </div>
      </div>
      <div style={{border:"1px solid #ccc",borderRadius:8,padding:10,marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:10}}>
        <div><b>Fatura No:</b> {belgeNo}</div><div><b>Fatura Tipi:</b> SATIŞ</div>
        <div><b>Tarih:</b> {simdi.toLocaleDateString("tr-TR")}</div><div><b>Senaryo:</b> e-Arşiv</div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12,fontSize:10}}>
        <thead><tr style={{background:"#f0f0f0"}}>{["#","Mal/Hizmet","Miktar","Birim Fiyat","KDV %","KDV Tutarı","Tutar"].map(h=><th key={h} style={{border:"1px solid #ccc",padding:"5px 4px",fontWeight:700,fontSize:9}}>{h}</th>)}</tr></thead>
        <tbody>{kalemler.map((k,i)=>{const t=k.miktar*k.birim;const kv=Math.round(t*kdv/100);return <tr key={i}><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"center"}}>{i+1}</td><td style={{border:"1px solid #ccc",padding:"5px 4px"}}>{k.tanim}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right"}}>{k.miktar}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right"}}>{k.birim.toLocaleString("tr-TR")}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"center"}}>{kdv}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right"}}>{kv.toLocaleString("tr-TR")}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right",fontWeight:600}}>{t.toLocaleString("tr-TR")}</td></tr>;})} </tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
        <div style={{minWidth:220}}>
          {[["Mal Hizmet Toplam",ara],...(iskontoT>0?[[T.iskontoL+" (%"+iskonto+")",-iskontoT]]:[]),["Hesaplanan KDV (%"+kdv+")",kdvT],...(tevkifatT>0?[["KDV Tevkifatı ("+tevkifat+"/10)",-tevkifatT]]:[]),["ÖDENECEK TUTAR",genel]].map(([l,v],i,arr)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:i===arr.length-1?"2px solid #111":"none",fontWeight:i===arr.length-1?800:400,fontSize:i===arr.length-1?12:10,color:v<0?"#DC2626":"inherit"}}><span>{l}</span><span>{v.toLocaleString("tr-TR")} TL</span></div>)}
        </div>
      </div>

      {/* Paylaşım butonları */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={whatsappPaylas} style={{flex:1,background:"#DCF8C6",border:"none",borderRadius:10,padding:"10px 0",color:"#128C7E",fontSize:12,fontWeight:700,cursor:"pointer"}}>💬 {T.whatsappGonder}</button>
        <button onClick={yazdir} style={{flex:1,background:"#EFF6FF",border:"none",borderRadius:10,padding:"10px 0",color:"#1C4E60",fontSize:12,fontWeight:700,cursor:"pointer"}}>🖨️ {T.yazdirPdf}</button>
      </div>

      {/* Yasal bilgilendirme */}
      <div style={{background:"#FEF3C7",borderRadius:10,padding:"11px 14px",marginBottom:12,display:"flex",alignItems:"flex-start",gap:9,cursor:"pointer"}} onClick={()=>{onKapat();onGibAc&&onGibAc("bilgi");}}>
        <span style={{fontSize:17,lineHeight:1.2}}>ℹ️</span>
        <div style={{flex:1}}>
          <div style={{fontSize:12,fontWeight:700,color:"#B45309"}}>Bu belge resmî fatura değildir</div>
          <div style={{fontSize:10,color:"#92400E",lineHeight:1.55}}>TradeFlow Elite belgeyi GİB'e göndermez. Resmî beyanı kendi e-Fatura/e-Arşiv sağlayıcın üzerinden yapmalısın. <u>Nasıl yapılır? →</u></div>
        </div>
      </div>

      <div style={{fontSize:8,color:"#999",textAlign:"center",marginBottom:12,lineHeight:1.5}}>Bu belge TradeFlow Elite ile oluşturulmuş bir muhasebe takip belgesidir; resmî fatura yerine geçmez. Yasal geçerlilik için GİB onaylı e-Fatura/e-Arşiv sistemi kullanılmalıdır.</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setPreview(false)} style={{flex:1,background:"#f4f4f4",border:"1px solid #ddd",borderRadius:10,padding:12,fontSize:12,cursor:"pointer",fontWeight:600}}>← Düzenle</button>
        <button onClick={faturaKes} style={{flex:2,background:"#111",border:"none",borderRadius:10,padding:12,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>✓ Belgeyi Kaydet</button>
      </div>
    </div>
  </div>;

  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:4}}>{T.faturaKes}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <div style={{fontSize:12,color:C.t2}}>{job.ref} · KDV %{kdv}</div>
      <span onClick={()=>{onKapat();onGibAc&&onGibAc("bilgi");}} style={{fontSize:10,background:C.amberBg,color:C.amber,padding:"3px 10px",borderRadius:20,fontWeight:700,cursor:"pointer"}}>ℹ️ e-Fatura rehberi →</span>
    </div>
    <div style={{background:"#FDF8EC",border:"1px solid #F6D18B",borderRadius:12,padding:"11px 13px",marginBottom:14,display:"flex",gap:9,alignItems:"flex-start"}}>
      <span style={{fontSize:15,lineHeight:1.2,flexShrink:0}}>ℹ️</span>
      <div style={{fontSize:11,color:"#7A5B12",lineHeight:1.6}}>
        <b>Bu belge proforma faturadır</b> — müşteriye iş bedelini ve dökümünü göstermek içindir.
        Resmî fatura yerine geçmez; vergi açısından geçerli fatura e-Arşiv / e-Fatura sistemi üzerinden düzenlenir.
      </div>
    </div>
    <Inp value={alici.ad} onChange={e=>setAlici(a=>({...a,ad:e.target.value}))} placeholder={T.aliciAdiPh}/>
    <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Inp value={alici.vkn} onChange={e=>setAlici(a=>({...a,vkn:e.target.value}))} placeholder="VKN / TCKN"/></div><div style={{flex:1}}><Inp value={alici.adres} onChange={e=>setAlici(a=>({...a,adres:e.target.value}))} placeholder="Adres"/></div></div>
    {kalemler.map((k,i)=><div key={i} style={{background:C.bg,borderRadius:12,padding:12,marginBottom:10}}>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input value={k.tanim} onChange={e=>setKalemler(kk=>kk.map((x,idx)=>idx===i?{...x,tanim:e.target.value}:x))} placeholder="Mal / Hizmet" style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.t1,outline:"none"}}/>
        <button onClick={()=>setKalemler(kk=>kk.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:C.t3,fontSize:18,cursor:"pointer"}}>×</button>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input type="number" value={k.miktar} onChange={e=>setKalemler(kk=>kk.map((x,idx)=>idx===i?{...x,miktar:Number(e.target.value)}:x))} style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.t1,outline:"none"}}/>
        <input type="number" value={k.birim} onChange={e=>setKalemler(kk=>kk.map((x,idx)=>idx===i?{...x,birim:Number(e.target.value)}:x))} style={{flex:2,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.t1,outline:"none"}}/>
        <div style={{fontSize:12,fontWeight:700,color:C.green,minWidth:70,textAlign:"right"}}>{fmt(k.miktar*k.birim)}</div>
      </div>
    </div>)}
    <button onClick={()=>setKalemler(k=>[...k,{tanim:"",miktar:1,birim:0}])} style={{width:"100%",background:"none",border:`1.5px dashed ${C.border}`,borderRadius:10,padding:11,color:C.t2,fontSize:13,cursor:"pointer",marginBottom:14}}>+ Kalem Ekle</button>
    {/* 🏷️ Müşteri İskontosu */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>🏷️ {T.iskontoL}</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input type="number" min="0" max="100" value={iskonto} onChange={e=>setIskonto(e.target.value)} placeholder="0"
          style={{width:90,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:14,fontWeight:700,outline:"none",textAlign:"center"}}/>
        <span style={{fontSize:13,color:C.t2}}>%</span>
        {iskontoT>0&&<span style={{fontSize:12,fontWeight:700,color:C.green,marginLeft:6}}>−{iskontoT.toLocaleString("tr-TR")} TL</span>}
      </div>
    </div>

    {/* KDV Tevkifatı */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>KDV Tevkifatı (kurumsal işlerde)</div>
      <div style={{display:"flex",gap:6}}>
        {[[0,"Yok"],[5,"5/10"],[7,"7/10"],[9,"9/10"]].map(([v,l])=><button key={v} onClick={()=>setTevkifat(v)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`2px solid ${tevkifat===v?P:C.border}`,background:tevkifat===v?C.purpleBg:C.bg,color:tevkifat===v?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
      </div>
    </div>
    <div style={{background:C.bg,borderRadius:12,padding:14,marginBottom:18}}>
      {[["Toplam",fmt(ara)],["KDV (%"+kdv+")",fmt(kdvT)],...(tevkifatT>0?[["Tevkifat ("+tevkifat+"/10)","-"+fmt(tevkifatT)]]:[]),["ÖDENECEK",fmt(genel)]].map(([l,v],i,arr)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:i===arr.length-1?`1px solid ${C.border}`:"none",marginTop:i===arr.length-1?6:0}}><span style={{fontSize:i===arr.length-1?14:13,fontWeight:i===arr.length-1?700:400,color:C.t2}}>{l}</span><span style={{fontSize:i===arr.length-1?15:13,fontWeight:700,color:i===arr.length-1?C.green:l.includes("Tevkifat")?C.red:C.t1}}>{v}</span></div>)}
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>Vazgeç</BtnS><BtnP onClick={()=>setPreview(true)}>Resmî Önizleme →</BtnP></div>
  </BottomSheet>;
}

function TeklifMarjRozeti({tutar,maliyet}){
  try{
    const kar=tutar-maliyet;const marj=Math.round(kar/tutar*100);
    const rk=kar<0?C.red:marj<15?C.amber:C.green;
    const rb=kar<0?C.redBg:marj<15?C.amberBg:C.greenBg;
    return <span style={{display:"inline-block",marginTop:4,fontSize:10,fontWeight:800,color:rk,background:rb,padding:"2px 8px",borderRadius:20}}>{kar<0?"⚠️ ZARAR ":"💰 "}%{marj} · {fmt(kar)}</span>;
  }catch(e){return null;}
}

function YeniIsModal({onKapat,onEkle,T,duzenlenecek,isKolu,jobs,varsayilanMusteri,ekip,onIsKolu,sesliMetin}){
  const sektor=sektorBilgi(isKolu||"Mekanik Tesisat");
  // Sektöre özel iş türü ikonları + birkaç genel ikon
  const icons=[...sektor.isTurleri.map(t=>({e:t.e,bg:t.bg,ad:t.ad,isler:t.isler})),
    {e:"📦",bg:"#FEF3C7",ad:(T.ikonMalzeme||"Malzeme & Teslimat"),isler:["Malzeme Temini","Yedek Parça Siparişi","Ürün Teslimatı","Malzeme Keşfi & Ölçü Alma"]},
    {e:"🛠️",bg:"#EDE9FE",ad:(T.ikonServis||"Genel Servis"),isler:["Arıza Tespiti","Genel Bakım","Acil Servis Çağrısı","Garanti Kapsamında Onarım"]},
    {e:"💼",bg:"#EDE9FE",ad:(T.ikonTicari||"Ticari & İdari"),isler:["Fiyat Teklifi Hazırlama","Keşif & Proje Görüşmesi","Sözleşme Görüşmesi","Danışmanlık Hizmeti"]},
    {e:"📋",bg:"#DBEAFE",ad:(T.ikonKontrol||"Kontrol & Rapor"),isler:["Periyodik Kontrol","Keşif Raporu Hazırlama","İş Teslim Tutanağı","Yıllık Bakım Kontrolü"]}]
    .filter((v,i,a)=>a.findIndex(x=>x.e===v.e)===i); // tekrarları temizle
  const edit=!!duzenlenecek;
  const [icon,setIcon]=useState(edit?{e:duzenlenecek.icon,bg:duzenlenecek.iconBg}:icons[0]);
  const [oneriGoster,setOneriGoster]=useState(false);
  const [form,setForm]=useState(edit
    ?{baslik:duzenlenecek.baslik,musteri:duzenlenecek.musteri,tarih:duzenlenecek.tarih,tutar:String(Math.round(duzenlenecek.tutar/(KURLAR[AKTIF_PARA]||1))),durum:duzenlenecek.durum,hatirlatma:duzenlenecek.hatirlatma||"",isAdresi:duzenlenecek.isAdresi||"",musteriTelefon:duzenlenecek.musteriTelefon||"",musteriEmail:duzenlenecek.musteriEmail||"",tekrar:duzenlenecek.tekrar||"yok",vadeGun:duzenlenecek.vadeGun!=null?String(duzenlenecek.vadeGun):"",atanan:duzenlenecek.atanan||"",maliyet:duzenlenecek.maliyet?String(Math.round(duzenlenecek.maliyet/(KURLAR[AKTIF_PARA]||1))):"",not:duzenlenecek.not||"",malzemeler:duzenlenecek.malzemeler||"",kisiSayisi:duzenlenecek.kisiSayisi||1}
    :{baslik:"",musteri:varsayilanMusteri||"",tarih:new Date().toISOString().slice(0,10),tutar:"",durum:"bekliyor",hatirlatma:"",isAdresi:"",musteriTelefon:"",musteriEmail:"",tekrar:"yok",vadeGun:"",atanan:"",maliyet:"",not:"",malzemeler:"",kisiSayisi:1});
  const [fotolar,setFotolar]=useState(edit?(duzenlenecek.fotolar||[]):[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  // 📷 İş fotoğrafı: sıkıştırılmadan saklanırsa 1 fotoğraf ~5 MB base64 olur ve
  // her otomatik kayıtta buluta gider — kayıt sessizce başarısız olabilir.
  // Bu yüzden max 1100px / jpeg 0.65'e indiriyoruz (~150-300 KB).
  const fotoEkle=(e)=>{
    const file=e.target.files&&e.target.files[0];
    e.target.value="";
    if(!file)return;
    if(fotolar.length>=6){alert("En fazla 6 fotoğraf ekleyebilirsin.");return;}
    const fr=new FileReader();
    fr.onload=()=>{
      const img=new Image();
      img.onload=()=>{
        try{
          const c=document.createElement("canvas");
          const oran=Math.min(1,1100/img.width);
          c.width=Math.round(img.width*oran);c.height=Math.round(img.height*oran);
          c.getContext("2d").drawImage(img,0,0,c.width,c.height);
          setFotolar(p=>[...p,c.toDataURL("image/jpeg",0.65)]);
        }catch{ setFotolar(p=>[...p,fr.result]); }
      };
      img.onerror=()=>setFotolar(p=>[...p,fr.result]);
      img.src=fr.result;
    };
    fr.readAsDataURL(file);
  };
  const kaydet=()=>{
    if(edit){
      onEkle({...duzenlenecek,...form,tutar:Number(form.tutar)*(KURLAR[AKTIF_PARA]||1),maliyet:Number(form.maliyet||0)*(KURLAR[AKTIF_PARA]||1),icon:icon.e,iconBg:icon.bg,hatirlatma:form.hatirlatma||null,fotolar});
    }else{
      const cid=nId;nId++;
      onEkle({id:cid,ref:"IS-"+String(cid).padStart(4,"0"),...form,vadeGun:form.vadeGun===""?null:Number(form.vadeGun),tutar:Number(form.tutar)*(KURLAR[AKTIF_PARA]||1),maliyet:Number(form.maliyet||0)*(KURLAR[AKTIF_PARA]||1),icon:icon.e,iconBg:icon.bg,hatirlatma:form.hatirlatma||null,hatirlatildi:false,fotolar,odemeler:[]});
    }
    onKapat();
  };
  const TEKRAR_SECENEK=[["yok",T.tekSefer],["haftalik","🔁 "+T.haftalikL],["aylik","🔁 "+T.aylikL],["yillik","🔁 "+T.yillikL]];

  // ═══ 🎙️ SESLE DOLDUR ═══
  // Tek cümle söyle → alanlar dolsun. Her telefonda çalışır:
  //  · Android/Chrome/masaüstü → mikrofon tuşuyla canlı dinleme
  //  · iPhone/Safari → Apple Web Speech API'yi vermediği için klavyedeki
  //    🎤 dikte tuşu kullanılır; metin aynı ayrıştırıcıdan geçer.
  const [seslAcik,setSeslAcik]=useState(false);
  const [seslMetin,setSeslMetin]=useState("");
  const [seslDinliyor,setSeslDinliyor]=useState(false);
  const [seslDolan,setSeslDolan]=useState(null);
  const seslRef=useRef(null);
  const seslDesteklı=typeof window!=="undefined"&&!!(window.SpeechRecognition||window.webkitSpeechRecognition);

  const seslUygula=(metin)=>{
    const ham=(metin||"").trim();
    if(!ham)return;
    const musteriListesi=[...new Set((jobs||[]).map(j=>j.musteri).filter(Boolean))];
    const cikan=sesliIsAyristir(ham,{musteriler:musteriListesi,ekip:ekip||[]});
    const anahtarlar=Object.keys(cikan);
    if(anahtarlar.length===0){setSeslDolan([]);return;}
    setForm(f=>({...f,...cikan}));
    setSeslDolan(anahtarlar);
    // Başlığa göre ikon da otomatik seçilsin
    if(cikan.baslik){
      const bn=cikan.baslik.toLocaleLowerCase("tr");
      const uygun=icons.find(ic=>(ic.isler||[]).some(x=>{
        const p=x.toLocaleLowerCase("tr").split(" ")[0];
        return p.length>3&&bn.includes(p);
      }));
      if(uygun)setIcon(uygun);
    }
  };

  const seslDinle=()=>{
    if(!seslDesteklı)return;
    if(seslDinliyor){try{seslRef.current&&seslRef.current.stop();}catch{} setSeslDinliyor(false); return;}
    try{
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      const r=new SR();
      r.lang="tr-TR";r.continuous=false;r.interimResults=true;r.maxAlternatives=1;
      let son="";
      r.onresult=(e)=>{
        son=Array.from(e.results).map(x=>x[0].transcript).join(" ");
        setSeslMetin(son);
      };
      r.onerror=()=>setSeslDinliyor(false);
      r.onend=()=>{setSeslDinliyor(false); if(son.trim())seslUygula(son);};
      seslRef.current=r;
      r.start();setSeslDinliyor(true);
    }catch{setSeslDinliyor(false);}
  };
  useEffect(()=>()=>{try{seslRef.current&&seslRef.current.abort();}catch{}},[]);
  // Sesli komutla ("Ahmet'e kombi bakımı 3200 lira") açıldıysa alanları hemen doldur
  useEffect(()=>{
    if(!sesliMetin)return;
    setSeslAcik(true);
    setSeslMetin(sesliMetin);
    seslUygula(sesliMetin);
    // eslint-disable-next-line
  },[sesliMetin]);

  const ALAN_AD={baslik:"İş adı",musteri:"Müşteri",tutar:"Tutar",maliyet:"Maliyet",
    malzemeler:"Malzemeler",tarih:"Tarih",hatirlatma:"Hatırlatma",isAdresi:"Adres",
    musteriTelefon:"Telefon",not:"Not",atanan:"Atanan",kisiSayisi:"Kişi sayısı"};

  return <BottomSheet onKapat={onKapat} maxH="90vh">
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
      <div style={{flex:1,fontSize:18,fontWeight:800,color:C.t1}}>{edit?"✏️ "+T.isDuzenle:T.yeniIs}</div>
      {!edit&&<button onClick={()=>setSeslAcik(v=>!v)}
        style={{display:"flex",alignItems:"center",gap:6,background:seslAcik?P:C.bg,border:`1px solid ${seslAcik?P:C.border}`,
          borderRadius:20,padding:"7px 13px",color:seslAcik?"#fff":C.t2,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,fontFamily:"inherit"}}>
        <i className="ti ti-microphone" style={{fontSize:15}} aria-hidden="true"/>{T.sesleDoldur||"Sesle doldur"}
      </button>}
    </div>

    {seslAcik&&!edit&&<div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:"14px 14px 13px",marginBottom:16}}>
      <div style={{fontSize:12,color:C.t2,lineHeight:1.55,marginBottom:11}}>
        Tek cümlede anlat, alanları ben dolduracağım. Örnek:<br/>
        <span style={{color:C.t3,fontStyle:"italic"}}>"Müşteri adı Cevdet Yılmaz, iş adı kombi bakımı, iş değeri 22.000, iş yeri adresi Alaçatı, kullanılacak malzeme 60 üçlük boru 9 metre, yarın saat 9"</span>
        <div style={{marginTop:7,fontSize:11,color:C.t3,lineHeight:1.5}}>
          Tanıdığı başlıklar: müşteri adı · iş adı · iş değeri · maliyeti · iş yeri adresi · kullanılacak malzeme · telefonu · notu · tarih · saat
        </div>
      </div>
      <textarea value={seslMetin} onChange={e=>setSeslMetin(e.target.value)} rows={3}
        placeholder={seslDinliyor?"🎙️ Dinliyorum…":(seslDesteklı?"Mikrofona bas ya da buraya yaz…":"Buraya dokun, klavyedeki 🎤 tuşuna basıp konuş")}
        style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1.5px solid ${seslDinliyor?"#EF4444":C.border}`,borderRadius:12,padding:"12px 14px",fontSize:14,color:C.t1,outline:"none",resize:"vertical",fontFamily:"inherit",lineHeight:1.5}}/>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        {seslDesteklı&&<button onClick={seslDinle} aria-label={seslDinliyor?"Durdur":"Konuş"}
          style={{width:48,flexShrink:0,background:seslDinliyor?"#EF4444":C.card,border:`1px solid ${seslDinliyor?"#EF4444":C.border}`,borderRadius:12,color:seslDinliyor?"#fff":C.t2,fontSize:19,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",animation:seslDinliyor?"tfPulse 1s infinite":"none"}}>
          <i className="ti ti-microphone" aria-hidden="true"/>
        </button>}
        <button onClick={()=>seslUygula(seslMetin)} disabled={!seslMetin.trim()}
          style={{flex:1,background:seslMetin.trim()?P:C.border,border:"none",borderRadius:12,padding:"12px 0",color:"#fff",fontSize:13.5,fontWeight:700,cursor:seslMetin.trim()?"pointer":"default",fontFamily:"inherit"}}>
          {T.alanlariDoldur||"Alanları doldur"}
        </button>
      </div>
      {!seslDesteklı&&<div style={{fontSize:10.5,color:C.t3,marginTop:9,lineHeight:1.5}}>
        iPhone'da tarayıcı sürekli dinlemeye izin vermiyor. Kutuya dokun, klavyenin altındaki 🎤 tuşuna bas ve konuş — sonuç aynı.
      </div>}
      {seslDolan&&<div style={{marginTop:11,paddingTop:11,borderTop:`1px solid ${C.border}`}}>
        {seslDolan.length===0
          ? <div style={{fontSize:12,color:"#C2603A",fontWeight:600}}>Bunu ayıramadım. Müşteri adı, iş adı ve tutarı söylemeyi dene.</div>
          : <>
            <div style={{fontSize:11,fontWeight:700,color:"#0A7A55",marginBottom:7}}>✓ {seslDolan.length} alan dolduruldu — kontrol et</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {seslDolan.map(k=><span key={k} style={{fontSize:10.5,fontWeight:600,color:C.t2,background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"3px 9px"}}>{ALAN_AD[k]||k}</span>)}
            </div>
          </>}
      </div>}
    </div>}
    {!edit&&<div style={{marginBottom:16}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>🔧 Mesleğiniz / İş Kolu</div>
      <div style={{position:"relative",background:C.bg,border:`1.5px solid ${P}33`,borderRadius:12,padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:19}}>{sektor.icon}</span>
        <span style={{flex:1,fontSize:14,fontWeight:700,color:C.t1}}>{isKolu}</span>
        <span style={{fontSize:10.5,color:C.t3}}>değiştir ▾</span>
        <select value={isKolu} onChange={e=>{const k=e.target.value;onIsKolu&&onIsKolu(k);const s=sektorBilgi(k);const t0=s.isTurleri[0];setIcon({e:t0.e,bg:t0.bg,ad:t0.ad,isler:t0.isler});setOneriGoster(false);}} style={{position:"absolute",inset:0,opacity:0,width:"100%",cursor:"pointer"}}>
          {IS_KOLLARI.map(k=><option key={k.label} value={k.label}>{k.icon} {k.label}</option>)}
        </select>
      </div>
      <div style={{fontSize:10.5,color:C.t3,marginTop:5}}>İş önerileri ve ikonlar seçtiğin mesleğe göre gelir</div>
    </div>}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.ikon}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{icons.map(ic=><button key={ic.e} onClick={()=>{setIcon(ic);if(!edit&&ic.isler)setOneriGoster(true);}} title={ic.ad||""} style={{width:46,height:46,borderRadius:12,background:ic.bg,border:`2px solid ${icon.e===ic.e?P:"transparent"}`,fontSize:20,cursor:"pointer"}}>{ic.e}</button>)}</div>
      {icon.ad&&<div style={{fontSize:10,color:P,fontWeight:700,marginTop:6}}>{icon.e} {icon.ad} {T.isSecildi||"işleri seçildi"}</div>}
    </div>
    <div style={{position:"relative"}}>
      <Inp label={T.isBasligi} value={form.baslik} onChange={e=>set("baslik",e.target.value)} onFocus={()=>!edit&&setOneriGoster(true)} placeholder={sektor.isOrnekPh}/>
      {/* Sektöre özel iş önerileri */}
      {oneriGoster&&!edit&&<div style={{marginTop:-6,marginBottom:14,background:C.bg,borderRadius:12,padding:"6px",border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.t3,padding:"4px 8px",fontWeight:600}}>💡 {icon.isler?icon.e+" "+icon.ad+" "+(T.isOnerileri||"iş önerileri"):T.hazirIslerOn+isKolu+T.hazirIslerSon}</div>
        {(icon.isler||sektor.ornekIsler).map(is=><div key={is} onClick={()=>{set("baslik",is);setOneriGoster(false);}} style={{padding:"9px 10px",borderRadius:8,cursor:"pointer",fontSize:13,color:C.t1,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=C.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{color:P}}>+</span> {is}
        </div>)}
      </div>}
    </div>
    <Inp label={T.musteri} value={form.musteri} onChange={e=>set("musteri",e.target.value)} placeholder={T.musteriOrnekPh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tarihL} type="date" value={form.tarih} onChange={e=>set("tarih",e.target.value)}/></div>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={form.tutar} onChange={e=>set("tutar",e.target.value)} placeholder="0"/></div>
    </div>
    {/* 👷 Atanan kişi (ekip varsa) */}
    {ekip&&ekip.length>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>👷 {T.atananKisi}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button onClick={()=>set("atanan","")} style={{padding:"8px 13px",borderRadius:10,border:`2px solid ${!form.atanan?P:C.border}`,background:!form.atanan?C.purpleBg:C.bg,color:!form.atanan?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.benL}</button>
        {ekip.map(u=><button key={u.ad} onClick={()=>set("atanan",u.ad)} style={{padding:"8px 13px",borderRadius:10,border:`2px solid ${form.atanan===u.ad?P:C.border}`,background:form.atanan===u.ad?C.purpleBg:C.bg,color:form.atanan===u.ad?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{u.ad}</button>)}
      </div>
    </div>}
    {/* 💰 MALİYET BEKÇİSİ */}
    <Inp label={"💰 "+T.maliyetL+" ("+AKTIF_PARA+") — opsiyonel"} type="number" value={form.maliyet} onChange={e=>set("maliyet",e.target.value)} placeholder={T.maliyetPh}/>
    <BenzerIsIpucu baslik={form.baslik} jobs={jobs||[]} edit={edit} duzenlenecekId={duzenlenecek?.id} T={T}/>
    <MaliyetOnizleme tutar={form.tutar} maliyet={form.maliyet} T={T}/>
    {/* 💰 Ödeme vadesi — müşteriye tanınan süre */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>💰 {T.odemeVadesi||"Ödeme vadesi"}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {[["","Varsayılan"],["0","Peşin"],["7","7 gün"],["15","15 gün"],["30","30 gün"]].map(([v,l])=>{
          const sec=String(form.vadeGun||"")===v;
          return <button key={v||"vars"} onClick={()=>set("vadeGun",v)}
            style={{padding:"8px 13px",borderRadius:10,border:`1.5px solid ${sec?P:C.border}`,background:sec?C.purpleBg:C.bg,color:sec?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>;
        })}
      </div>
      <div style={{fontSize:10.5,color:C.t3,marginTop:6,lineHeight:1.45}}>
        {form.vadeGun==="0"
          ? "Peşin iş — tahsilat uyarısı çıkmaz."
          : "Tahsilat uyarısı, iş tamamlandıktan sonra bu süre boyunca yumuşak kalır; vade yaklaştıkça sertleşir."}
      </div>
    </div>
    {/* Periyodik iş */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>🔁 {T.tekrarlama}</div>
      <div style={{display:"flex",gap:6}}>
        {TEKRAR_SECENEK.map(([v,l])=><button key={v} onClick={()=>set("tekrar",v)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`2px solid ${form.tekrar===v?P:C.border}`,background:form.tekrar===v?C.purpleBg:C.bg,color:form.tekrar===v?P:C.t2,fontSize:10.5,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
      </div>
      {form.tekrar!=="yok"&&<div style={{fontSize:10,color:P,marginTop:6,fontWeight:600}}>✓ {T.tekrarBilgi}</div>}
    </div>
    <Inp label={"⏰ "+T.hatirlatma+" (opsiyonel)"} type="datetime-local" value={form.hatirlatma} onChange={e=>set("hatirlatma",e.target.value)}/>
    {/* İş adresi — Google Maps'e gidecek */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>📍 {T.isAdresiL}</div>
      <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
        <input value={form.isAdresi} onChange={e=>set("isAdresi",e.target.value)} placeholder={T.adresPh}
          style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
        {form.isAdresi&&<button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.isAdresi)}&travelmode=driving`,"_blank")} style={{background:C.blue,border:"none",borderRadius:12,padding:"12px 14px",color:"#fff",fontSize:13,cursor:"pointer",flexShrink:0}}>🗺️</button>}
      </div>
    </div>
    {/* 👥 Kaç kişiyle yapılacak */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>👥 Kaç Kişiyle Yapılacak?</div>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <button onClick={()=>set("kisiSayisi",Math.max(1,(form.kisiSayisi||1)-1))} style={{width:42,height:42,borderRadius:12,background:C.bg,border:`1px solid ${C.border}`,fontSize:20,color:C.t1,cursor:"pointer"}}>−</button>
        <div style={{fontSize:20,fontWeight:800,color:P,minWidth:60,textAlign:"center"}}>{form.kisiSayisi||1} kişi</div>
        <button onClick={()=>set("kisiSayisi",Math.min(20,(form.kisiSayisi||1)+1))} style={{width:42,height:42,borderRadius:12,background:C.bg,border:`1px solid ${C.border}`,fontSize:20,color:C.t1,cursor:"pointer"}}>+</button>
      </div>
    </div>
    {/* 🧰 Kullanılan malzemeler */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>{(T.malzemelerL||"🧰 Kullanılan Malzemeler")+" "+(T.opsiyonelEk||"(opsiyonel)")}</div>
      <textarea value={form.malzemeler} onChange={e=>set("malzemeler",e.target.value)} placeholder={T.malzemeListePh||"Örn:\n2x PPR boru 25mm\n1x Kombi contası\n3m kablo"} rows={3}
        style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
    </div>
    {/* 📝 Not */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>{(T.notBaslik||"📝 Not")+" "+(T.opsiyonelEk||"(opsiyonel)")}</div>
      <textarea value={form.not} onChange={e=>set("not",e.target.value)} placeholder={T.notPh||"İşle ilgili özel notlar, müşteri istekleri, dikkat edilecekler..."} rows={3}
        style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:13,outline:"none",resize:"vertical",fontFamily:"inherit"}}/>
    </div>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.musteriTel} value={form.musteriTelefon} onChange={e=>set("musteriTelefon",e.target.value)} placeholder="0532..."/></div>
      <div style={{flex:1}}><Inp label={T.epostaOps} value={form.musteriEmail} onChange={e=>set("musteriEmail",e.target.value)} placeholder="@"/></div>
    </div>
    {/* Fotoğraflar */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>📷 {T.isFotolari}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {fotolar.map((f,i)=><div key={i} style={{position:"relative"}}>
          <img src={f} alt={"foto"+i} style={{width:64,height:64,borderRadius:10,objectFit:"cover",border:`1px solid ${C.border}`}}/>
          <button onClick={()=>setFotolar(p=>p.filter((_,idx)=>idx!==i))} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:C.red,border:"none",color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>)}
        <label style={{width:64,height:64,borderRadius:10,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:C.t3,cursor:"pointer"}}>
          +<input type="file" accept="image/*" onChange={fotoEkle} style={{display:"none"}}/>
        </label>
      </div>
    </div>
    <div style={{marginBottom:18}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.durumL}</div>
      <div style={{display:"flex",gap:8}}>
        {[["aktif",T.devamEdiyor],["bekliyor",T.beklemede],["tamamlandi",T.tamamlandi]].map(([v,l])=><button key={v} onClick={()=>set("durum",v)} style={{flex:1,padding:"10px 0",borderRadius:12,border:`2px solid ${form.durum===v?P:C.border}`,background:form.durum===v?C.purpleBg:C.bg,color:form.durum===v?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
      </div>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={kaydet}>{edit?"💾 "+T.guncelle:"+ "+T.kaydet}</BtnP></div>
  </BottomSheet>;
}

function TeklifModal({onKapat,onEkle,T,kdv}){
  const [f,setF]=useState({musteri:"",telefon:"",baslik:"",tutar:"",maliyet:"",gecerlilik:new Date(Date.now()+14*864e5).toISOString().slice(0,10)});
  const [kalemler,setKalemler]=useState([{ad:"",adet:1,birimFiyat:""}]);
  const kalemSet=(i,alan,deger)=>setKalemler(p=>p.map((k,j)=>j===i?{...k,[alan]:deger}:k));
  const kalemSil=(i)=>setKalemler(p=>p.filter((_,j)=>j!==i));
  const doluKalemler=kalemler.filter(k=>k.ad&&Number(k.birimFiyat)>0);
  const araToplam=doluKalemler.reduce((s,k)=>s+Number(k.adet||1)*Number(k.birimFiyat),0);
  const kdvTutar=araToplam*(kdv||20)/100;
  const genelToplam=araToplam+kdvTutar;
  const otomatikTutar=doluKalemler.length>0;

  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{T.yeniTeklif}</div>
    <Inp label={T.musteri} value={f.musteri} onChange={e=>setF(x=>({...x,musteri:e.target.value}))} placeholder={T.musteriAdiPh}/>
    <Inp label={"📱 "+T.telefonL+" (WhatsApp)"} value={f.telefon} onChange={e=>setF(x=>({...x,telefon:e.target.value}))} placeholder="05xx xxx xx xx"/>
    <Inp label={T.isBasligi} value={f.baslik} onChange={e=>setF(x=>({...x,baslik:e.target.value}))} placeholder={T.klimaPh}/>

    {/* 🧾 MALZEME KALEMLERİ */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>🧾 {T.malzemeKalemleri}</div>
      {kalemler.map((k,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
        <input value={k.ad} onChange={e=>kalemSet(i,"ad",e.target.value)} placeholder={T.kalemAdPh}
          style={{flex:3,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 12px",color:C.t1,fontSize:12.5,outline:"none",minWidth:0}}/>
        <input type="number" value={k.adet} onChange={e=>kalemSet(i,"adet",e.target.value)} placeholder="1" min="1"
          style={{width:52,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 8px",color:C.t1,fontSize:12.5,outline:"none",textAlign:"center"}}/>
        <input type="number" value={k.birimFiyat} onChange={e=>kalemSet(i,"birimFiyat",e.target.value)} placeholder="₺"
          style={{width:82,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 8px",color:C.t1,fontSize:12.5,outline:"none",textAlign:"right"}}/>
        {kalemler.length>1&&<button onClick={()=>kalemSil(i)} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer",padding:0}}>×</button>}
      </div>)}
      <button onClick={()=>setKalemler(p=>[...p,{ad:"",adet:1,birimFiyat:""}])} style={{width:"100%",background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:10,padding:"9px 0",color:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.kalemEkle}</button>
      {/* Otomatik hesap özeti */}
      {otomatikTutar&&<div style={{background:C.purpleBg,borderRadius:12,padding:"11px 14px",marginTop:8}}>
        {[[T.araToplamL,fmt(araToplam*(KURLAR[AKTIF_PARA]||1))],[T.kdvL+" %"+(kdv||20),fmt(kdvTutar*(KURLAR[AKTIF_PARA]||1))],[T.genelToplamL,fmt(genelToplam*(KURLAR[AKTIF_PARA]||1))]].map(([l,v],i)=>
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:i===2?13.5:11.5,fontWeight:i===2?800:600,color:i===2?P:C.t2,borderTop:i===2?`1px solid ${P}33`:"none",marginTop:i===2?4:0,paddingTop:i===2?7:3}}>
            <span>{l}</span><span>{v}</span>
          </div>)}
      </div>}
    </div>

    <div style={{display:"flex",gap:10}}>
      {!otomatikTutar&&<div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={f.tutar} onChange={e=>setF(x=>({...x,tutar:e.target.value}))}/></div>}
      <div style={{flex:1}}><Inp label={T.gecerlilik} type="date" value={f.gecerlilik} onChange={e=>setF(x=>({...x,gecerlilik:e.target.value}))}/></div>
    </div>
    <Inp label={"💰 "+T.maliyetL+" ("+AKTIF_PARA+")"} type="number" value={f.maliyet} onChange={e=>setF(x=>({...x,maliyet:e.target.value}))} placeholder={T.maliyetPh}/>
    <MaliyetOnizleme tutar={otomatikTutar?genelToplam:f.tutar} maliyet={f.maliyet} T={T}/>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={()=>{
      const tutarSon=otomatikTutar?genelToplam:Number(f.tutar||0);
      if(!f.musteri||tutarSon<=0)return;
      onEkle({id:Date.now(),...f,tutar:tutarSon*(KURLAR[AKTIF_PARA]||1),maliyet:Number(f.maliyet||0)*(KURLAR[AKTIF_PARA]||1),
        kalemler:doluKalemler.map(k=>({ad:k.ad,adet:Number(k.adet||1),birimFiyat:Number(k.birimFiyat)*(KURLAR[AKTIF_PARA]||1)})),
        araToplam:araToplam*(KURLAR[AKTIF_PARA]||1),kdvOran:kdv||20,kdvTutar:kdvTutar*(KURLAR[AKTIF_PARA]||1)});
      onKapat();}}>+ {T.yeniTeklif}</BtnP></div>
  </BottomSheet>;
}


function GiderModal({onKapat,onEkle,T,isKolu,jobs,musteriFiltre}){
  const sektor=sektorBilgi(isKolu||"Mekanik Tesisat");
  const katlar=sektor.giderKat;
  const [f,setF]=useState({ad:"",tutar:"",kategori:katlar[0],tarih:new Date().toISOString().slice(0,10),isId:null,isAdi:""});
  // Aktif ve bekleyen işler (tamamlananlar değil)
  const aktifIsler=(jobs||[]).filter(j=>(j.durum==="aktif"||j.durum==="bekliyor")&&(!musteriFiltre||j.musteri===musteriFiltre));
  const [isSecAc,setIsSecAc]=useState(false);

  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{T.yeniGider}</div>
    <Inp label={T.giderL} value={f.ad} onChange={e=>setF(x=>({...x,ad:e.target.value}))} placeholder={T.malzemePh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={f.tutar} onChange={e=>setF(x=>({...x,tutar:e.target.value}))}/></div>
      <div style={{flex:1}}><Inp label={T.tarihL} type="date" value={f.tarih} onChange={e=>setF(x=>({...x,tarih:e.target.value}))}/></div>
    </div>

    {/* İşe Bağla */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>📋 {T.iseBagla}</div>
      {f.isId
        ?<div style={{display:"flex",alignItems:"center",gap:10,background:C.purpleBg,borderRadius:12,padding:"11px 14px"}}>
          <span style={{fontSize:13,fontWeight:700,color:P,flex:1}}>{f.isAdi}</span>
          <button onClick={()=>setF(x=>({...x,isId:null,isAdi:""}))} style={{background:"none",border:"none",color:C.t3,fontSize:16,cursor:"pointer"}}>✕</button>
        </div>
        :<button onClick={()=>setIsSecAc(!isSecAc)} style={{width:"100%",background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t2,fontSize:13,cursor:"pointer",textAlign:"left"}}>
          {isSecAc?T.listeyiKapat:T.islerdenSec}
        </button>}
      {isSecAc&&!f.isId&&<div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,marginTop:6,maxHeight:180,overflowY:"auto"}}>
        {aktifIsler.length===0
          ?<div style={{padding:14,fontSize:12,color:C.t3,textAlign:"center"}}>{T.aktifBekleyenYok}</div>
          :aktifIsler.map(j=><div key={j.id} onClick={()=>{setF(x=>({...x,isId:j.id,isAdi:j.baslik+" ("+j.musteri+")"}));setIsSecAc(false);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.bg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{j.baslik}</div>
              <div style={{fontSize:11,color:C.t3}}>{j.musteri} · {j.ref}</div>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:j.durum==="aktif"?P:C.amber}}>{j.durum==="aktif"?T.aktifL:T.bekleyen}</div>
          </div>)}
      </div>}
    </div>

    <div style={{marginBottom:18}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.kategori||"Kategori"}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{katlar.map(k=><button key={k} onClick={()=>setF(x=>({...x,kategori:k}))} style={{padding:"8px 14px",borderRadius:10,border:`2px solid ${f.kategori===k?P:C.border}`,background:f.kategori===k?C.purpleBg:C.bg,color:f.kategori===k?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{k}</button>)}</div>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={()=>{onEkle({id:Date.now(),...f,tutar:Number(f.tutar)*(KURLAR[AKTIF_PARA]||1)});onKapat();}}>+ {T.yeniGider}</BtnP></div>
  </BottomSheet>;
}

function DegerlendirModal({onKapat,onGonder,T}){
  const [yildiz,setYildiz]=useState(0);
  const [oneri,setOneri]=useState("");
  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4,textAlign:"center"}}>{T.degerlendir}</div>
    <div style={{fontSize:12,color:C.t2,textAlign:"center",marginBottom:18}}>TradeFlow ⭐</div>
    <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
      {[1,2,3,4,5].map(i=><span key={i} onClick={()=>setYildiz(i)} style={{fontSize:38,cursor:"pointer",filter:i<=yildiz?"none":"grayscale(1) opacity(0.35)",transition:"filter 0.15s"}}>⭐</span>)}
    </div>
    {yildiz>0&&<div style={{textAlign:"center",fontSize:13,fontWeight:700,color:yildiz>=4?C.green:yildiz===3?C.amber:C.red,marginBottom:12}}>
      {yildiz===5?"Mükemmel! 🎉":yildiz===4?"Çok iyi! 👍":yildiz===3?"Fena değil":yildiz===2?"Geliştirebiliriz":"Üzgünüz 😔"}
    </div>}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>Öneri & Görüşleriniz</div>
      <textarea value={oneri} onChange={e=>setOneri(e.target.value)} placeholder={T.oneriniz} rows={4} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",resize:"none",fontFamily:"inherit"}}/>
    </div>
    <div style={{display:"flex",gap:10}}>
      <BtnS onClick={onKapat}>{T.iptal}</BtnS>
      <button onClick={()=>{onGonder(yildiz,oneri);onKapat();}} disabled={yildiz===0} style={{flex:2,background:yildiz===0?C.border:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:yildiz===0?"default":"pointer"}}>{T.gonder}</button>
    </div>
  </BottomSheet>;
}

function GizlilikEkrani({onKapat}){
  const bolumler=[
    {b:"1. Toplanan Veriler",m:"TradeFlow Elite; iş emirleri, müşteri adları, tutarlar ve işletme bilgilerinizi yalnızca uygulama işlevselligi için işler. Bu sürümde veriler cihazınızda tutulur, sunucularımıza gönderilmez."},
    {b:"2. Verilerin Kullanımı",m:"Verileriniz yalnızca size hizmet sunmak amacıyla kullanılır. Reklam amaçlı profilleme yapılmaz, üçüncü taraflara satılmaz."},
    {b:"3. KVKK Uyumu",m:"6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarınız saklı tutulur."},
    {b:"4. Veri Güvenliği",m:"Pro sürümde bulut yedekleme aktif edildiğinde verileriniz şifrelenerek saklanır. Ödeme bilgileri uygulamada tutulmaz."},
    {b:"5. Çerezler ve İzleme",m:"Uygulama içinde üçüncü taraf reklam SDK'si veya izleme çerezi bulunmaz."},
    {b:"6. İletişim",m:"Gizlilikle ilgili sorularınız için uygulama içi Yardım Merkezi'ni kullanabilirsiniz."},
  ];
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="Gizlilik Politikası" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <div style={{fontSize:11,color:C.t3,marginBottom:14}}>Son güncelleme: Temmuz 2026 · TradeFlow Elite v1.0</div>
        {bolumler.map(x=><Sh key={x.b} s={{padding:"16px 18px",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:6}}>{x.b}</div><div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>{x.m}</div></Sh>)}
      </div>
    </div>
  </div>;
}

// ─── YARDIMCI ASİSTAN — hazır cevaplı, API maliyeti sıfır ──────
const ASISTAN_BILGI=[
  // ── İŞ AKIŞLARI ──
  {k:["iş ekle","yeni iş","iş oluştur","nasıl iş"],c:"📋 Yeni iş eklemek için: '+Yeni İş' butonuna bas (sağ üst veya alt ortadaki + butonu). İkon seç → başlık yaz → müşteri, tarih, tutar gir. İş başlığı kutusuna tıklayınca sektörüne özel hazır iş listesi çıkar, oradan seçebilirsin. İsteğe bağlı: adres, telefon, fotoğraf, tahmini maliyet ekle."},
  {k:["iş düzenle","güncelle","değiştir","düzelt"],c:"✏️ İş düzenlemek için: İşe dokun → detay açılır → sağ üstteki kalem (✏️) butonuna bas. Tüm alanları değiştirebilirsin. 'Güncelle' ile kaydet."},
  {k:["iş sil","işi sil","silmek"],c:"🗑️ İş silmek için: İşe dokun → detayda 'Sil' butonu → onay ver. Silinen iş 6 saniye geri alınabilir — alt kısımda '↩️ Geri Al' butonu çıkar."},
  {k:["durum","aktif","bekliyor","tamamlandı","tamamla"],c:"🔄 İş durumu değiştirmek için: İşe dokun → '✓ Tamamla' butonuna bas. Ya da detayda durum seçeneklerinden birini seç: Aktif / Beklemede / Tamamlandı."},
  {k:["fotoğraf","resim","öncesi","sonrası"],c:"📷 İş fotoğrafı eklemek için: Yeni iş veya düzenleme formunda '📷 İş Fotoğrafları' bölümündeki '+' butonuna bas. Öncesi/sonrası fotoğraf yükleyebilirsin. Detayda büyütmek için fotoğrafa dokun."},
  {k:["periyodik","tekrar","abonelik","haftalık","aylık","yıllık"],c:"🔁 Periyodik iş: Yeni iş formunda 'Tekrarlama' bölümünden Haftalık/Aylık/Yıllık seç. İş tamamlanınca sonraki dönem için otomatik yeni iş oluşur. Havuz bakımı, kombi bakımı gibi düzenli işler için ideal."},
  {k:["takvim","ay","gün","tarih"],c:"📅 Takvim görünümü: İş Akışları → sağ üstteki 📅 simgesi. İşli günlerde renkli noktalar var; güne dokununca o günün işleri listelenir. 📋 liste görünümüne geçmek için yanındaki ikona dokun."},
  {k:["harita","navigasyon","adres","yol","git","konum"],c:"🗺️ Navigasyon: İşe adres girdiysen detayda 'Navigasyonu Başlat' butonu çıkar, Google Maps'te yol tarifi açılır. Müşteriler ekranında da 'Git' butonu var."},
  // ── FATURA ──
  {k:["fatura","kes","fatura oluştur"],c:"🧾 Fatura kesmek için: Bir işe dokun → 'Fatura Kes' → kalemleri düzenle → KDV ve tevkifatı ayarla → 'Resmî Önizleme' → 'Faturayı Kes'. WhatsApp'tan gönderebilir veya yazdırabilirsin. GİB kuruluysa e-fatura olarak gönderilir."},
  {k:["kdv","tevkifat","vergi"],c:"💡 KDV oranını Profil → KDV bölümünden ayarlarsın. Fatura formunda KDV Tevkifatı seçeneği var: Yok / 5/10 / 7/10 / 9/10. Kurumsal müşterilerde tevkifat uygulanır, tutar otomatik hesaplanır."},
  {k:["gib","e-fatura","e-arşiv","mali mühür","entegratör"],c:"🏛️ GİB entegrasyonu: Profil → 'e-Fatura/e-Arşiv'. Başvuru sekmesinde 5 adım: Mali Mühür → entegratör sözleşmesi → GİB başvurusu → test → canlı. Entegratör hesabın hazır olunca API Ayarı sekmesinden bağlarsın. Henüz başvurmadıysan rehber seni yönlendirir."},
  {k:["whatsapp","paylaş","gönder","mesaj"],c:"💬 WhatsApp paylaşım: Fatura önizlemede 'WhatsApp'ta Gönder', teklif kartında 💬 butonu, müşteri detayında WhatsApp butonu — hazır mesajla açılır. Müşteri adı, tutar, iş bilgisi otomatik dolar."},
  // ── TAHSİLAT ──
  {k:["kaparo","kısmi","taksit","ön ödeme","baya"],c:"💰 Kaparo/kısmi ödeme almak için: İşe dokun → '+ Kaparo / Kısmi Tahsilat' → tutarı gir. İlerleme çubuğu 'Alınan/Kalan' gösterir. Tüm tutar ödenince iş otomatik 'Tamamlandı' olur. Ödeme geçmişi tarihleriyle listelenir."},
  {k:["tahsilat","alacak","bekleyen","borç","tahsil"],c:"💳 Tahsilatlar: Tahsilatlar sekmesinde bekleyen ve tahsil edilen ödemeler ayrı görünür. 'Tahsil Et' butonuyla tamamını tahsil edebilirsin. Ana sayfadaki Tahsilat Durumu grafiğine dokununca detay açılır."},
  // ── TEKLİF ──
  {k:["teklif","fiyat teklifi","teklif oluştur","teklif ver"],c:"🏷️ Teklif vermek için: Teklifler → '+Yeni Teklif'. Müşteri, iş tanımı, tutar ve geçerlilik tarihi gir. Maliyet de girersen kâr marjı kartda gösterilir. 💬 butonuyla WhatsApp'tan müşteriye gönder. Müşteri onaylayınca 'Onayla' → 'İşe Dönüştür' ile direkt iş açılır."},
  {k:["teklif kabul","onay","reddet","geçerlilik"],c:"✅ Teklif yönetimi: Teklif kartında '✅ Onayla' veya '❌ Reddet'. Geçerlilik süresi dolan teklifler otomatik 'Süresi Doldu' olur. Onaylanan teklifi 'İşe Dönüştür' ile iş akışına alırsın."},
  // ── MÜŞTERİ ──
  {k:["müşteri ekle","yeni müşteri","müşteri oluştur"],c:"👤 Müşteri eklemek için: Müşteriler → '+Yeni' butonu. Ad/soyad, telefon, e-posta ve adres girebilirsin. Adres girersen navigasyon butonu aktif olur. İşlere müşteri adı girince de otomatik müşteri oluşur."},
  {k:["müşteri sil","müşteriyi sil"],c:"🗑️ Müşteri silmek için: Müşteriler → müşteriye dokun → detayda en altta '🗑️ Müşteriyi Sil' → onay ver. Dikkat: müşteriyle ilgili tüm işler de silinir."},
  {k:["müşteri","ciro","en iyi","sıralama"],c:"📊 Müşteriler ekranında müşteriler ciro, iş sayısı veya ada göre sıralanabilir. En çok ciro yapan müşteri en üstte görünür. Müşteriye dokununca toplam ciro, tahsil edilen tutar ve iş geçmişi görünür."},
  // ── GİDER ──
  {k:["gider","masraf","harcama","gider ekle"],c:"💸 Gider eklemek için: Giderler → '+Yeni Gider'. Ad, tutar, tarih ve kategori gir. Kategoriler sektörüne göre değişir (Malzeme, Yakıt, Personel vb.). Giderler raporda gelir-gider analizine yansır."},
  {k:["gider kategori","kategori","malzeme","yakıt","personel"],c:"📂 Gider kategorileri sektörüne göre otomatik değişir: Mekanik Tesisat'ta 'Yedek Parça', Havuzculukta 'Kimyasal', Otomitivde 'Boya Malzemesi' gibi. Sektörü üst menüden değiştirince kategoriler de değişir."},
  // ── RAPORLAR ──
  {k:["rapor","istatistik","analiz","grafik"],c:"📊 Raporlar: Bu Ay / Geçen Ay / Son 3 Ay / Tümü dönem filtresi var. Net Kâr kartı, son 7 günün gerçek gelir eğrisi (tamamlanan işlerden), iş bazlı tutar grafiği ve durum dağılımı gösterilir. Dönem seçince tüm grafikler güncellenir."},
  {k:["net kâr","kâr","kar","gelir","gider analiz"],c:"💰 Net Kâr = Tamamlanan işlerin toplamı − Giderler. Raporlar ekranında dönem bazlı görünür. Maliyet Bekçisi'ni kullanıyorsan (işe tahmini maliyet girince) daha doğru kâr analizi yapabilirsin."},
  // ── MALİYET BEKÇİSİ ──
  {k:["maliyet","kâr marjı","marj","zarar","bekçi"],c:"💡 Maliyet Bekçisi: İş veya teklif oluştururken 'Tahmini Maliyet' gir. Uygulama anında Net Kâr ve Marj % hesaplar. ✅ Yeşil: sağlıklı kâr. ⚡ Sarı: marj %15 altında. ⚠️ Kırmızı: zarar. Benzer geçmiş işlerdeki ortalama maliyeti de ipucu olarak gösterir."},
  // ── SEKTÖR ──
  {k:["sektör","iş kolu","havuz","elektrik","tesisat","marangoz","otomotiv"],c:"🔧 Sektör akışı: Üstteki iş kolu seçicisinden sektörünü seç. İş şablonları, ikonlar ve gider kategorileri o sektöre göre otomatik ayarlanır. 9 sektör: Mekanik Tesisat, Havuzculuk, Elektrik, İnşaat, Mobilya, Otomotiv, Danışmanlık, Reklam, Temizlik."},
  // ── PROFİL / AYARLAR ──
  {k:["profil","işletme","firma","ayar"],c:"⚙️ Profil: Sol alttaki adına veya alt menüdeki 'Profil' sekmesine dokun. İşletme adı, yetkili, telefon, e-posta, adres düzenlenebilir. Bu bilgiler faturalarda görünür."},
  {k:["dil","language","ingilizce","almanca","arapça","türkçe"],c:"🌐 Dil değiştirmek: Profil → Dil satırı → 40+ dilden seç. Almanca, Fransızca, İspanyolca, Arapça, Rusça, Çince dahil büyük dillerde menüler tam çevrilir."},
  {k:["para birimi","dolar","euro","kur","tcmb","döviz"],c:"💱 Para birimi: Profil → Para Birimi. TL, USD veya EUR seçilebilir. Kurlar öncelikle TCMB resmî satış kurundan gelir (her iş günü 15:30 güncellenir). Kaynak bilgisi Para Birimi satırında görünür."},
  {k:["karanlık","dark","tema","gece","açık"],c:"🌙 Karanlık/Açık mod: Profil → 'Karanlık Mod' anahtarı. Göz yorgunluğunu azaltır."},
  {k:["bildirim","hatırlatma","uyarı","alarm"],c:"🔔 Hatırlatma: Yeni iş oluştururken '⏰ Hatırlatma' alanından tarih/saat seç. Belirlenen vakitte uygulama bildirimi gösterir. Bildirim iznini tarayıcı ayarlarından vermen gerekebilir."},
  {k:["modül","özelleştir","sırala","ana sayfa düzen"],c:"⚙️ Modül özelleştirme: Ana sayfada 'Düzenle →' butonu veya 'Özelleştir'. Modülleri aç/kapat, ⠿ tutacağından sürükleyerek sırala. Kapalı modüller alt menüden yine erişilebilir."},
  // ── YEDEK / VERİ ──
  {k:["yedek","dışa aktar","içe aktar","json","veri"],c:"📥 Yedek: Daha Fazla → 'Verileri Dışa Aktar' (JSON dosyası indirir). 'Yedeği Geri Yükle' ile geri yükle. Veriler artık Supabase bulutunda kalıcı saklanıyor — sayfa yenilesen bile gitmez. JSON yedeği ekstra güvence için kullanabilirsin."},
  {k:["giriş","şifre","hesap","kayıt","oturum"],c:"🔐 Giriş: Uygulama açılınca e-posta + şifre ile giriş ekranı gelir. 'Kayıt Ol' ile yeni hesap oluşturabilirsin. 'Beni Hatırla' işaretliyse bir daha şifre sorulmaz. Çıkış için Profil → en altta 'Çıkış Yap'."},
  // ── GENEL ──
  {k:["pro","abonelik","ücret","fiyat","premium"],c:"⚡ Pro plan (₺199/ay) planlanıyor: sınırsız iş, PDF fatura, GİB entegrasyonu, öncelikli destek. Şu an tüm özellikler ücretsiz kullanımda."},
  {k:["destek","yardım","sorun","hata","çalışmıyor"],c:"🆘 Sorun mu var? Sorununu buraya yazabilirsin, yönlendireyim. Ya da sorununu buraya yaz, yönlendireyim. Beyaz ekran görüyorsan: Ctrl+Shift+R ile sayfayı yenile, düzelmezse çıkış yapıp tekrar giriş dene."},
];

const ASISTAN_BILGI_EN=[
  {k:["add job","new job","create job"],c:"📋 To add a job: tap '+New Job' → pick an icon → enter title, customer, date, amount. Tap the title field for sector-specific suggestions. Optionally add address, photos, estimated cost."},
  {k:["edit","update job","change"],c:"✏️ To edit: tap a job → pencil (✏️) button → change fields → Update."},
  {k:["delete job","remove job"],c:"🗑️ To delete a job: tap it → 'Delete' → confirm. You get 6 seconds to undo."},
  {k:["status","complete","done","active"],c:"🔄 Change status: tap a job → '✓ Complete' or pick Active / Pending / Completed."},
  {k:["photo","picture","image"],c:"📷 Job photos: in the job form, use the '📷 Job Photos' section to upload before/after shots."},
  {k:["recurring","repeat","weekly","monthly"],c:"🔁 Recurring jobs: in the job form choose Weekly/Monthly/Yearly under 'Repeat'. When completed, the next period's job is created automatically."},
  {k:["calendar"],c:"📅 Calendar: Jobs tab → 📅 icon top-right. Days with jobs show dots; tap a day to list them."},
  {k:["map","navigation","address","directions"],c:"🗺️ Navigation: if a job has an address, tap 'Start Navigation' in its details to open Google Maps."},
  {k:["invoice","bill"],c:"🧾 To invoice: tap a job → 'Create Invoice' → edit line items → set VAT/withholding → Preview → Issue. Send via WhatsApp or print."},
  {k:["vat","tax","withholding"],c:"💡 Set VAT rate in Profile. Withholding options (5/10, 7/10, 9/10) appear in the invoice form for corporate clients."},
  {k:["whatsapp","share","send"],c:"💬 WhatsApp: invoice preview, quote cards and customer details all have WhatsApp buttons with a prefilled message."},
  {k:["deposit","partial","installment"],c:"💰 Deposit/partial payment: tap a job → '+ Deposit / Partial Payment' → enter amount. The Received/Remaining bar updates; job auto-completes when fully paid."},
  {k:["collection","receivable","pending payment"],c:"💳 Collections tab lists pending and collected payments separately. 'Collect' marks the full amount as paid."},
  {k:["quote","offer","proposal"],c:"🏷️ Quotes: Quotes tab → '+New Quote'. Add cost to see profit margin. Send via 💬 WhatsApp. When approved: 'Approve' → 'Convert to Job'."},
  {k:["customer add","new customer","register customer"],c:"👤 Add customers in Customers → Customer Records → '+ New Record', or just type a name when creating a job."},
  {k:["delete customer","remove customer"],c:"🗑️ Delete a customer: open their details → '🗑️ Delete Customer' → confirm. Their jobs are deleted too."},
  {k:["expense","cost","spending"],c:"💸 Add expenses in Expenses → '+New Expense'. Optionally link to an active/pending job — it then counts in that customer's profit/loss."},
  {k:["report","statistics","analytics"],c:"📊 Reports: period filter (This Month / Last Month / 3 Months / All), Net Profit card, 7-day revenue curve, job charts, and Team Performance if you have team members."},
  {k:["profit","margin","loss","cost guard"],c:"💡 Cost Guard: enter 'Estimated Cost' on a job/quote to see instant Net Profit and Margin %. Green = healthy, yellow = margin under 15%, red = LOSS."},
  {k:["sector","industry","trade"],c:"🔧 Pick your sector from the top selector — job templates, icons and expense categories adapt automatically. 25 sectors supported."},
  {k:["language"],c:"🌐 Change language: Profile → Language. 40+ languages available."},
  {k:["currency","rate","dollar","euro","exchange"],c:"💱 Currency: Profile → Currency (TL/USD/EUR). Live market rates refresh every 5 minutes; official central bank rate is the fallback."},
  {k:["dark","theme","night"],c:"🌙 Dark mode: Profile → 'Dark Mode' toggle."},
  {k:["notification","reminder","alert"],c:"🔔 Reminders: set date/time in the job form under '⏰ Reminder'. Allow browser notifications when asked."},
  {k:["module","customize","layout"],c:"⚙️ Customize home: 'Edit →' on the home screen — toggle modules, drag ⠿ to reorder."},
  {k:["backup","export","import","excel","pdf"],c:"📥 More menu: Excel exports (Jobs/Expenses/Invoices) for your accountant, PDF accounting report, and JSON backup/restore. Data is also auto-saved to the cloud."},
  {k:["login","password","account","sign"],c:"🔐 Sign in with email + password. 'Remember me' keeps you signed in. Sign out: Profile → bottom."},
  {k:["team","staff","assign","member"],c:"👷 Team: Profile → Team Management — add members with roles, assign jobs via 'Assigned To' in the job form, see performance in Reports."},
  {k:["price","pro","subscription"],c:"⚡ Pro plan (₺199/mo) is planned: unlimited jobs, PDF invoices, integrations. Everything is free for now."},
  {k:["help","support","problem","error","broken"],c:"🆘 Trouble? Describe your problem here and I will guide you. White screen? Refresh with Ctrl+Shift+R or sign out and back in."},
];
function AsistanEkrani({onKapat,T,jobs=[],giderler=[],faturalar=[],musteriKayitlari=[],isletme={},ilkSoru=null,sesliBasla=false}){
  const TR_Mi=(T.anaSayfa==="Ana Sayfa");
  const [sesliMod,setSesliMod]=useState(!!sesliBasla); // cevapları yüksek sesle oku
  const [dinliyor,setDinliyor]=useState(false);
  const [mikDestek,setMikDestek]=useState(true);
  const tanimaRef=useRef(null);
  const cevapRef=useRef(null);
  const sesliModRef=useRef(!!sesliBasla);
  sesliModRef.current=sesliMod;
  const [mesajlar,setMesajlar]=useState([{rol:"bot",metin:TR_Mi?"👋 Merhaba! Ben TradeFlow asistanın. İşletmenle ilgili her şeyi sorabilirsin: \"Bu ay ne kazandım?\", \"Kim borçlu?\", \"Ahmet Bey'in durumu ne?\" ya da uygulama kullanımı hakkında soru sor.":T.asistanHosgeldin}]);
  const [giris,setGiris]=useState("");
  const [yaziyor,setYaziyor]=useState(false);
  const HIZLI=TR_Mi?[
    "Bu ay ne kazandım?","Kim borçlu?","Problemli müşterilerim kimler?","En iyi müşterim kim?","Net kârım ne?","Yeni iş nasıl eklenir?","Fatura nasıl kesilir?","Teklif nasıl verilir?",
  ]:[
    "How do I add a job?","How do I create an invoice?","What is Cost Guard?","How do I send a quote?","How do reports work?","My data is missing",
  ];

  // ── İşletme özeti (hem yerel motor hem AI için) ──
  const ozetYap=()=>{
    const buAy=new Date().toISOString().slice(0,7);
    const toplamCiro=jobs.reduce((s,j)=>s+j.tutar,0);
    const tahsil=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
    const buAyGelir=jobs.filter(j=>j.durum==="tamamlandi"&&(j.tarih||"").startsWith(buAy)).reduce((s,j)=>s+j.tutar,0);
    const giderT=giderler.reduce((s,g)=>s+g.tutar,0);
    const buAyGider=giderler.filter(g=>(g.tarih||"").startsWith(buAy)).reduce((s,g)=>s+g.tutar,0);
    const acik=jobs.filter(j=>j.durum!=="tamamlandi");
    const borclular={};
    acik.forEach(j=>{const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);const kalan=Math.max(j.tutar-odenen,0);if(kalan>0)borclular[j.musteri]=(borclular[j.musteri]||0)+kalan;});
    const borcListe=Object.entries(borclular).sort((a,b)=>b[1]-a[1]);
    const musCiro={};jobs.forEach(j=>{musCiro[j.musteri]=(musCiro[j.musteri]||0)+j.tutar;});
    const enIyi=Object.entries(musCiro).sort((a,b)=>b[1]-a[1]).slice(0,3);
    return {buAyGelir,tahsil,toplamCiro,giderT,buAyGider,netKar:tahsil-giderT,aktifIs:jobs.filter(j=>j.durum==="aktif").length,bekleyenIs:jobs.filter(j=>j.durum==="bekliyor").length,toplamIs:jobs.length,borcListe,borcToplam:borcListe.reduce((s,[,v])=>s+v,0),enIyi,musteriSay:new Set(jobs.map(j=>j.musteri)).size};
  };

  // ── Yerel akıllı motor: kullanıcının gerçek verisiyle cevaplar ──
  const akilliCevap=(s)=>{
    if(!TR_Mi)return null;
    const o=ozetYap();
    if(/(merhaba|selam|günaydın|iyi akşam)/.test(s))return "👋 Merhaba"+(isletme.yetkili?" "+isletme.yetkili.split(" ")[0]:"")+"! Sana nasıl yardımcı olabilirim? İşlerini, tahsilatlarını, müşterilerini sorabilirsin.";
    if(/(teşekkür|sağol|sağ ol|eyvallah)/.test(s))return "Rica ederim! 😊 Başka bir sorun olursa buradayım.";
    // Müşteri adı sorgusu
    const adlar=[...new Set([...jobs.map(j=>j.musteri),...musteriKayitlari.map(m=>m.ad)])].filter(Boolean);
    const bulunanAd=adlar.find(ad=>ad&&s.includes(ad.toLowerCase().split(" ")[0])&&ad.length>2);
    if(bulunanAd&&/(durum|borç|borc|ne kadar|öde|skor|nasıl|bilgi)/.test(s)){
      const isler=jobs.filter(j=>j.musteri===bulunanAd);
      const sk=musteriSkor(isler);
      const ciro=isler.reduce((sm,j)=>sm+j.tutar,0);
      const acikT=isler.filter(j=>j.durum!=="tamamlandi").reduce((sm,j)=>sm+j.tutar-((j.odemeler||[]).reduce((ss,od)=>ss+od.tutar,0)),0);
      return "👤 **"+bulunanAd+"**\n"+sk.emoji+" Ödeme skoru: "+sk.ad+(sk.puan!==null?" (%"+sk.puan+")":"")+"\n💼 Toplam iş: "+isler.length+" — "+fmt(ciro)+(acikT>0?"\n⏳ Bekleyen alacak: "+fmt(acikT):"\n✅ Bekleyen borcu yok")+"\n\nDetay için Müşteriler sekmesinden kartına dokunabilirsin.";
    }
    if(/(problemli|riskli|kötü müşteri|ödemeyen)/.test(s)){
      const prob=adlar.map(ad=>({ad,sk:musteriSkor(jobs.filter(j=>j.musteri===ad))})).filter(x=>x.sk.emoji==="🔴");
      return prob.length?"🔴 Problemli görünen müşteriler:\n"+prob.map(p=>"• "+p.ad+" — "+p.sk.aciklama).join("\n")+"\n\nBunlarla yeni işe başlamadan önce kaparo almanı öneririm.":"🎉 Harika haber — şu an problemli görünen müşterin yok!";
    }
    if(/(kim borçlu|borçlu|alacak|bekleyen tahsilat|kimden.*alacağ)/.test(s)){
      if(o.borcListe.length===0)return "✅ Şu an bekleyen alacağın yok, tüm ödemeler alınmış görünüyor!";
      return "💰 Toplam bekleyen alacağın: **"+fmt(o.borcToplam)+"**\n\nEn yüksek borçlular:\n"+o.borcListe.slice(0,5).map(([ad,t])=>"• "+ad+": "+fmt(t)).join("\n")+"\n\nTahsilatlar sekmesinden takip edebilirsin.";
    }
    if(/(en iyi|en çok kazandıran|favori müşteri|en karlı müşteri|en kârlı müşteri)/.test(s)){
      if(o.enIyi.length===0)return "Henüz iş kaydın yok — ilk işini ekleyince analiz başlar!";
      return "🏆 En çok kazandıran müşterilerin:\n"+o.enIyi.map(([ad,t],i)=>(i+1)+". "+ad+" — "+fmt(t)).join("\n");
    }
    if(/(bu ay.*(kazan|gelir|ciro)|kazanc|ne kazandım)/.test(s))return "📊 Bu ay tahsil edilen gelir: **"+fmt(o.buAyGelir)+"**\nBu ay gider: "+fmt(o.buAyGider)+"\nBu ay net: **"+fmt(o.buAyGelir-o.buAyGider)+"**\n\nDönem seçimiyle detay için Raporlar sekmesine bak.";
    if(/(net kâr|net kar|kâr|kar durumu|karlılık)/.test(s))return "💼 Genel durum:\n• Toplam tahsil edilen: "+fmt(o.tahsil)+"\n• Toplam gider: "+fmt(o.giderT)+"\n• **Net kâr: "+fmt(o.netKar)+"**"+(o.netKar<0?"\n\n⚠️ Giderler geliri aşmış — gider kalemlerini Raporlar'dan incelemeni öneririm.":"");
    if(/(gider|masraf|harcama)/.test(s))return "💸 Toplam gider: "+fmt(o.giderT)+" (bu ay: "+fmt(o.buAyGider)+")\nDetaylı döküm Giderler sekmesinde, PDF raporu Daha Fazla menüsünde.";
    if(/(kaç iş|iş sayısı|aktif iş|işlerim)/.test(s))return "📋 İş durumun:\n• Aktif: "+o.aktifIs+"\n• Bekleyen: "+o.bekleyenIs+"\n• Toplam kayıt: "+o.toplamIs+"\n• Müşteri sayısı: "+o.musteriSay;
    if(/(fatura.*(toplam|bekleyen|kaç))/.test(s)){const bekl=faturalar.filter(f=>!f.odendi);return "🧾 Fatura durumu: toplam "+faturalar.length+" fatura, "+bekl.length+" tanesi beklemede ("+fmt(bekl.reduce((sm,f)=>sm+(f.genelToplam||f.tutar||0),0))+").";}
    return null;
  };

  const kuralCevap=(s)=>{
    const taban=TR_Mi?ASISTAN_BILGI:ASISTAN_BILGI_EN;
    const bulunanlar=taban.filter(b=>b.k.some(k=>s.includes(k)));
    if(bulunanlar.length>0)return bulunanlar.map(b=>b.c).join("\n\n");
    return null;
  };

  // Bot cevabını ekle; sesli mod açıksa yüksek sesle oku
  const botEkle=(metin)=>{
    setMesajlar(p=>[...p,{rol:"bot",metin}]);
    if(sesliModRef.current)tfKonus(metin);
  };

  const cevapla=async(soru)=>{
    const s=soru.toLowerCase();
    tfSus();
    setMesajlar(p=>[...p,{rol:"user",metin:soru}]);
    setGiris("");
    // 1) Önce buluttaki gerçek yapay zekâyı dene
    setYaziyor(true);
    try{
      const gecmis=[...mesajlar.filter(m=>m.rol!=="bot"||mesajlar.indexOf(m)>0),{rol:"user",metin:soru}].slice(-12).map(m=>({rol:m.rol==="user"?"user":"asistan",metin:m.metin}));
      const o=ozetYap();
      const ozet="İşletme: "+(isletme.ad||"-")+" | Yetkili: "+(isletme.yetkili||"-")+"\nBu ay gelir: "+fmt(o.buAyGelir)+" | Bu ay gider: "+fmt(o.buAyGider)+"\nToplam tahsil: "+fmt(o.tahsil)+" | Toplam gider: "+fmt(o.giderT)+" | Net kâr: "+fmt(o.netKar)+"\nAktif iş: "+o.aktifIs+" | Bekleyen iş: "+o.bekleyenIs+" | Toplam iş: "+o.toplamIs+" | Müşteri: "+o.musteriSay+"\nBekleyen alacak toplamı: "+fmt(o.borcToplam)+"\nBorçlular: "+o.borcListe.slice(0,8).map(([a,t])=>a+"="+fmt(t)).join(", ")+"\nEn iyi müşteriler: "+o.enIyi.map(([a,t])=>a+"="+fmt(t)).join(", ")+"\nSon işler: "+jobs.slice(-6).map(j=>j.baslik+"/"+j.musteri+"/"+j.durum+"/"+fmt(j.tutar)).join("; ");
      const r=await fetch("/api/asistan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mesajlar:gecmis,ozet,dil:TR_Mi?"tr":"en"})});
      if(r.ok){
        const d=await r.json();
        if(d.cevap){setYaziyor(false);botEkle(d.cevap);return;}
      }
    }catch(e){/* AI yok/erişilemedi → yerel motora düş */}
    setYaziyor(false);
    // 2) Yerel akıllı motor (kullanıcı verisiyle)
    const akilli=akilliCevap(s);
    if(akilli){botEkle(akilli);return;}
    // 3) SSS motoru
    const sss=kuralCevap(s);
    if(sss){botEkle(sss);return;}
    botEkle(TR_Mi
      ?"🤔 Bunu tam anlayamadım. Şunları sorabilirsin:\n• \"Bu ay ne kazandım?\"\n• \"Kim borçlu?\"\n• \"[Müşteri adı] durumu ne?\"\n• \"Fatura nasıl kesilir?\""
      :"🤔 I don't know that one yet. Try rephrasing or check Profile → Help Center.");
  };

  cevapRef.current=cevapla;

  // ── Mikrofon: soruyu sesle sor ──
  useEffect(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setMikDestek(false);return;}
    const r=new SR();
    r.lang=TR_Mi?"tr-TR":"en-US";r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
    r.onresult=(e)=>{
      const metin=(e.results[0][0].transcript||"").trim();
      if(!metin)return;
      setSesliMod(true);sesliModRef.current=true; // sesle sorduysa sesli cevap ver
      if(cevapRef.current)cevapRef.current(metin);
    };
    r.onerror=()=>setDinliyor(false);
    r.onend=()=>setDinliyor(false);
    tanimaRef.current=r;
    return ()=>{ try{r.abort();}catch{} };
    // eslint-disable-next-line
  },[]);

  const dinle=()=>{
    if(!tanimaRef.current)return;
    if(dinliyor){try{tanimaRef.current.stop();}catch{} setDinliyor(false);return;}
    tfSus();
    try{tanimaRef.current.start();setDinliyor(true);}catch{}
  };

  // ── Sesli komuttan gelen soru varsa otomatik sor ──
  useEffect(()=>{
    if(ilkSoru&&cevapRef.current)cevapRef.current(ilkSoru);
    // eslint-disable-next-line
  },[ilkSoru]);

  // Ekran kapanınca konuşmayı kes
  useEffect(()=>()=>tfSus(),[]);

  const kapat=()=>{ tfSus(); onKapat&&onKapat(); };

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:MASAUSTU?640:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={"🤖 "+T.asistan} onKapat={kapat}/>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"8px 16px",background:C.card,borderBottom:`1px solid ${C.border}`}}>
        <span style={{fontSize:11,color:C.t3}}>{mikDestek?"🎙️ Mikrofona basıp konuşabilirsin":"⌨️ Klavyedeki dikte tuşunu kullanabilirsin"}</span>
        <button onClick={()=>{const y=!sesliMod;setSesliMod(y);sesliModRef.current=y;if(!y)tfSus();}}
          style={{background:sesliMod?P+"18":C.bg,border:`1px solid ${sesliMod?P+"55":C.border}`,borderRadius:20,padding:"6px 12px",fontSize:11.5,fontWeight:700,color:sesliMod?P:C.t3,cursor:"pointer",whiteSpace:"nowrap"}}>
          {sesliMod?"🔊 Sesli yanıt açık":"🔇 Sesli yanıt kapalı"}
        </button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column",gap:10}}>
        {mesajlar.map((m,i)=><div key={i} style={{alignSelf:m.rol==="bot"?"flex-start":"flex-end",maxWidth:"85%"}}>
          <div style={{background:m.rol==="bot"?C.card:P,color:m.rol==="bot"?C.t1:"#fff",borderRadius:m.rol==="bot"?"4px 16px 16px 16px":"16px 4px 16px 16px",padding:"12px 15px",fontSize:13.5,lineHeight:1.6,boxShadow:C.sh,whiteSpace:"pre-wrap"}}>{m.metin.split("**").map((par,ix)=>ix%2===1?<b key={ix}>{par}</b>:par)}</div>
        </div>)}
        {yaziyor&&<div style={{alignSelf:"flex-start"}}><div style={{background:C.card,borderRadius:"4px 16px 16px 16px",padding:"12px 18px",boxShadow:C.sh,color:C.t3,fontSize:13.5}}>💭 düşünüyor<span className="nokta">...</span></div></div>}
        {mesajlar.length<=1&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
          {HIZLI.map(h=><button key={h} onClick={()=>cevapla(h)} style={{background:C.card,border:`1.5px solid ${P}44`,borderRadius:20,padding:"8px 14px",color:P,fontSize:12,fontWeight:600,cursor:"pointer"}}>{h}</button>)}
        </div>}
      </div>
      <div style={{padding:"12px 14px 28px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
        {mikDestek&&<button onClick={dinle} aria-label="Sesle sor" title="Sesle sor"
          style={{background:dinliyor?"#EF4444":C.bg,border:`1px solid ${dinliyor?"#EF4444":C.border}`,borderRadius:14,width:50,flexShrink:0,color:dinliyor?"#fff":C.t2,fontSize:19,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",animation:dinliyor?"tfDinle 1s infinite":"none"}}>
          <i className="ti ti-microphone" aria-hidden="true"/>
        </button>}
        <input value={giris} onChange={e=>setGiris(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&giris.trim()&&!yaziyor)cevapla(giris.trim());}} placeholder={dinliyor?"🎙️ Dinliyorum…":T.soruPh} disabled={yaziyor}
          style={{flex:1,minWidth:0,background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 16px",color:C.t1,fontSize:14,outline:"none",opacity:yaziyor?0.6:1}}/>
        <button onClick={()=>giris.trim()&&!yaziyor&&cevapla(giris.trim())} style={{background:P,border:"none",borderRadius:14,padding:"0 18px",flexShrink:0,color:"#fff",fontSize:17,cursor:"pointer",opacity:yaziyor?0.6:1}}>➤</button>
        <style>{"@keyframes tfDinle{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5)}50%{box-shadow:0 0 0 7px rgba(239,68,68,0)}}"}</style>
      </div>
    </div>
  </div>;
}

// ─── EKİP YÖNETİMİ ──────────────────────────────────────────────
function EkipEkrani({onKapat,ekip,setEkip,jobs,goster,T,kullaniciId}){
  const [girisler,setGirisler]=useState({}); // ad -> kayıt
  const [girisAc,setGirisAc]=useState(null); // hangi üye için form açık
  const [gf,setGf]=useState({ka:"",sifre:""});
  const [sonuc,setSonuc]=useState(null); // oluşturulan bilgiler
  const girisleriYukle=async()=>{
    try{const {data}=await supabase.from("ekip_girisleri").select("*");
      if(Array.isArray(data)){const m={};data.forEach(g=>m[g.ad]=g);setGirisler(m);}
    }catch(e){}
  };
  useEffect(()=>{girisleriYukle();},[]);
  const girisOlustur=async(uye)=>{
    const ka=gf.ka.trim().toLowerCase().replace(/[^a-z0-9._-]/g,"");
    if(ka.length<3){goster("⚠️ Kullanıcı adı en az 3 karakter (harf/rakam)");return;}
    if(gf.sifre.length<6){goster("⚠️ Şifre en az 6 karakter");return;}
    try{
      const {data,error}=await supabaseYan.auth.signUp({email:ka+USTA_EK,password:gf.sifre});
      if(error){goster(error.message.includes("already")?"⚠️ Bu kullanıcı adı alınmış":"⚠️ Oluşturulamadı: "+error.message);return;}
      const ustaId=data.user&&data.user.id;
      if(!ustaId){goster("⚠️ Hesap açılamadı");return;}
      const {error:e2}=await supabase.from("ekip_girisleri").insert({usta_id:ustaId,isveren_id:kullaniciId,kullanici_adi:ka,ad:uye.ad,rol:uye.rol||"Usta"});
      if(e2){goster("⚠️ Kayıt bağlanamadı — SQL kurulumunu kontrol edin");return;}
      setSonuc({ad:uye.ad,ka,sifre:gf.sifre});
      setGirisAc(null);setGf({ka:"",sifre:""});
      girisleriYukle();
    }catch(e){goster("⚠️ Bağlantı hatası");}
  };
  const [sifreSifirla,setSifreSifirla]=useState(null);
  const [yeniSifre,setYeniSifre]=useState("");
  const sifreyiUygula=async(g)=>{
    if(yeniSifre.length<6){goster("⚠️ Şifre en az 6 karakter");return;}
    try{
      const {data:{session}}=await supabase.auth.getSession();
      const r=await fetch("/api/usta-sifre",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+(session&&session.access_token)},body:JSON.stringify({usta_id:g.usta_id,yeni:yeniSifre})});
      const d=await r.json();
      if(d&&d.ok){setSonuc({ad:g.ad,ka:g.kullanici_adi,sifre:yeniSifre});setSifreSifirla(null);setYeniSifre("");goster("✅ Şifre sıfırlandı");}
      else if(r.status===501){goster("⚠️ Sunucu anahtarı kurulmamış — Vercel ayarı gerekli");}
      else{goster("⚠️ Sıfırlanamadı");}
    }catch(e){goster("⚠️ Bağlantı hatası");}
  };
  const aktifDegistir=async(g)=>{
    await supabase.from("ekip_girisleri").update({aktif:!g.aktif}).eq("usta_id",g.usta_id);
    girisleriYukle();goster(g.aktif?"⏸️ Giriş donduruldu":"▶️ Giriş açıldı");
  };
  const [ad,setAd]=useState("");
  const [rol,setRol]=useState("Usta");
  const ROLLER=[T.rolUsta,T.rolMuhasebe,T.rolSatis,T.rolSofor,T.rolYardimci];
  const ekle=()=>{
    const t=ad.trim();
    if(!t)return;
    if(ekip.some(e=>e.ad===t)){goster(T.buIsimVar);return;}
    setEkip(p=>[...p,{ad:t,rol}]);
    setAd("");goster("👷 "+t+" "+T.ekibeEklendi);
  };
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:MASAUSTU?640:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={"👷 "+T.ekipYonetimi} onKapat={onKapat}/>
      {sonuc&&<div style={{background:C.greenBg,border:`1px solid ${C.green}55`,borderRadius:14,padding:"13px 15px",marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:800,color:C.green,marginBottom:6}}>✅ {sonuc.ad} için giriş hazır — bu bilgileri ustana ver:</div>
        <div style={{fontSize:13,color:C.t1}}>Kullanıcı adı: <b>{sonuc.ka}</b><br/>Şifre: <b>{sonuc.sifre}</b></div>
        <div style={{fontSize:10.5,color:C.t3,marginTop:6}}>Usta, giriş ekranında "👷 Usta / Çalışan" sekmesinden bu bilgilerle girer; ilk girişten sonra şifresini kendisi değiştirebilir.</div>
        <button onClick={()=>setSonuc(null)} style={{marginTop:8,background:"transparent",border:"none",fontSize:11,fontWeight:700,color:C.t3,cursor:"pointer",textDecoration:"underline"}}>Kapat</button>
      </div>}
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
        {/* Üye ekleme */}
        <Sh s={{padding:16,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>{T.yeniUyeEkle}</div>
          <input value={ad} onChange={e=>setAd(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")ekle();}} placeholder={T.adSoyadPh}
            style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:10}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {ROLLER.map(r=><button key={r} onClick={()=>setRol(r)} style={{padding:"7px 13px",borderRadius:10,border:`2px solid ${rol===r?P:C.border}`,background:rol===r?C.purpleBg:C.bg,color:rol===r?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{r}</button>)}
          </div>
          <button onClick={ekle} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:12,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.ekibeEkle}</button>
        </Sh>
        {/* Üye listesi */}
        {ekip.length===0&&<Sh s={{padding:28,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>👷</div>
          <div style={{fontSize:13,color:C.t2}}>{T.ekipYok}</div>
          <div style={{fontSize:11,color:C.t3,marginTop:4}}>{T.ekipYokSub}</div>
        </Sh>}
        {ekip.map(u=>{
          const uyeIsler=jobs.filter(j=>j.atanan===u.ad);
          const tamam=uyeIsler.filter(j=>j.durum==="tamamlandi").length;
          return <Sh key={u.ad} s={{padding:"13px 16px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:12,background:C.blueBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:C.blue,flexShrink:0}}>{u.ad[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{u.ad}</div>
                <div style={{fontSize:11,color:C.t3}}>{u.rol} · {uyeIsler.length} {T.isAtandiK} · {tamam} {T.tamamlandi.toLowerCase()}</div>
                {/* 🔑 Usta girişi */}
                {girisler[u.ad]
                  ?<div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,flexWrap:"wrap"}}>
                    <span style={{fontSize:10.5,fontWeight:700,color:girisler[u.ad].aktif?C.green:C.t3,background:girisler[u.ad].aktif?C.greenBg:C.bg,borderRadius:7,padding:"3px 8px"}}>🔑 {girisler[u.ad].kullanici_adi}{girisler[u.ad].aktif?"":" · dondu"}</span>
                    <button onClick={()=>aktifDegistir(girisler[u.ad])} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,padding:"3px 8px",fontSize:10,fontWeight:700,color:C.t2,cursor:"pointer"}}>{girisler[u.ad].aktif?"Dondur":"Aç"}</button>
                    <button onClick={()=>{setSifreSifirla(sifreSifirla===u.ad?null:u.ad);setYeniSifre("");}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:7,padding:"3px 8px",fontSize:10,fontWeight:700,color:C.t2,cursor:"pointer"}}>🔁 Şifre</button>
                  </div>
                  :<button onClick={()=>{setGirisAc(u.ad);setGf({ka:"",sifre:""});}} style={{marginTop:6,background:C.purpleBg,border:"none",borderRadius:8,padding:"5px 10px",fontSize:10.5,fontWeight:700,color:P,cursor:"pointer"}}>🔑 Giriş Oluştur</button>}
                {sifreSifirla===u.ad&&<div style={{marginTop:8,background:C.bg,borderRadius:11,padding:"10px"}}>
                  <input value={yeniSifre} onChange={e=>setYeniSifre(e.target.value)} placeholder="Yeni şifre (en az 6 karakter)" style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",fontSize:12.5,outline:"none",marginBottom:8,color:C.t1}}/>
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={()=>setSifreSifirla(null)} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 0",fontSize:12,fontWeight:700,color:C.t2,cursor:"pointer"}}>Vazgeç</button>
                    <button onClick={()=>sifreyiUygula(girisler[u.ad])} style={{flex:1,background:P,border:"none",borderRadius:9,padding:"9px 0",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}>Sıfırla</button>
                  </div>
                </div>}
                {girisAc===u.ad&&<div style={{marginTop:8,background:C.bg,borderRadius:11,padding:"10px"}}>
                  <input value={gf.ka} onChange={e=>setGf(p=>({...p,ka:e.target.value}))} placeholder="Kullanıcı adı (örn: mehmet35)" style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",fontSize:12.5,outline:"none",marginBottom:7,color:C.t1}}/>
                  <input value={gf.sifre} onChange={e=>setGf(p=>({...p,sifre:e.target.value}))} placeholder="Geçici şifre (usta sonra değiştirir)" style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 11px",fontSize:12.5,outline:"none",marginBottom:8,color:C.t1}}/>
                  <div style={{display:"flex",gap:7}}>
                    <button onClick={()=>setGirisAc(null)} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 0",fontSize:12,fontWeight:700,color:C.t2,cursor:"pointer"}}>Vazgeç</button>
                    <button onClick={()=>girisOlustur(u)} style={{flex:1,background:P,border:"none",borderRadius:9,padding:"9px 0",fontSize:12,fontWeight:700,color:"#fff",cursor:"pointer"}}>Oluştur</button>
                  </div>
                </div>}
              </div>
              <button onClick={()=>{setEkip(p=>p.filter(x=>x.ad!==u.ad));goster(T.uyeCikarildi);}} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer"}}>×</button>
            </div>
          </Sh>;
        })}
      </div>
    </div>
  </div>;
}

function YardimMerkezi({onKapat}){
  const [arama,setArama]=useState("");
  const [acik,setAcik]=useState(null);
  const sss=[
    {kat:"Başlangıç",sorular:[
      {s:"TradeFlow'u nasıl kullanmaya başlarım?",c:"Ana sayfadaki '+ Yeni İş' butonuna basarak ilk iş emrinizi oluşturun."},
      {s:"İş kolumu nasıl değiştiririm?",c:"Ana sayfadaki 'İş Kolunu Seç' kutusuna dokunun, 9 sektör arasından seçin."},
    ]},
    {kat:"İş Emirleri",sorular:[
      {s:"İşi nasıl silerim?",c:"İş kartına dokunun, açılan pencerede 'Sil' butonuna basın ve onaylayın."},
      {s:"Hatırlatma nasıl kurarım?",c:"Yeni iş oluştururken 'Hatırlatma' alanına tarih-saat girin. Zamanı gelince bildirim alırsınız."},
    ]},
    {kat:"Fatura",sorular:[
      {s:"Resmî fatura kesebilir miyim?",c:"Uygulama e-Arşiv formatında görsel şablon üretir. Yasal e-Fatura için GİB entegrasyonu Pro sürümle gelecek."},
      {s:"KDV oranını değiştirebilir miyim?",c:"Profil > KDV Oranı'ndan %0–50 arası istediğiniz oranı girebilirsiniz."},
    ]},
  ];
  const filtreli=sss.map(k=>({...k,sorular:k.sorular.filter(x=>x.s.toLowerCase().includes(arama.toLowerCase())||x.c.toLowerCase().includes(arama.toLowerCase()))})).filter(k=>k.sorular.length>0);
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="Yardım Merkezi" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍..." style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 16px",color:C.t1,fontSize:14,outline:"none",marginBottom:16,boxShadow:C.sh}}/>
        {filtreli.map(kat=><div key={kat.kat} style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 4px 8px"}}>{kat.kat}</div>
          <Sh s={{overflow:"hidden"}}>{kat.sorular.map((x,i)=>{const key=kat.kat+i,isOpen=acik===key;return <div key={key} style={{borderBottom:`1px solid ${C.border}`}}>
            <div onClick={()=>setAcik(isOpen?null:key)} style={{display:"flex",justifyContent:"space-between",padding:"15px 16px",cursor:"pointer",gap:10}}><span style={{fontSize:14,fontWeight:600,color:isOpen?P:C.t1,flex:1}}>{x.s}</span><span style={{color:C.t3,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span></div>
            {isOpen&&<div style={{padding:"0 16px 15px",fontSize:13,color:C.t2,lineHeight:1.6}}>{x.c}</div>}
          </div>;})}</Sh>
        </div>)}
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Sh s={{flex:1,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>window.open("https://wa.me/905321112233","_blank")}><div style={{fontSize:26,marginBottom:6}}>💬</div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>WhatsApp</div></Sh>
          {DESTEK_EMAIL&&<Sh s={{flex:1,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>window.open("mailto:"+DESTEK_EMAIL+"?subject=TradeFlow Destek","_blank")}><div style={{fontSize:26,marginBottom:6}}>✉️</div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>E-posta</div></Sh>}
        </div>
      </div>
    </div>
  </div>;
}

function SecimModal({baslik,secenekler,secili,onSec,onKapat,scroll}){
  return <BottomSheet onKapat={onKapat} maxH={scroll?"75vh":"88vh"}>
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:14}}>{baslik}</div>
    {secenekler.map(s=><div key={s.value} onClick={()=>{onSec(s.value);onKapat();}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 4px",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
      <span style={{fontSize:14,color:secili===s.value?P:C.t1,fontWeight:secili===s.value?700:400}}>{s.icon} {s.label}</span>
      <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${secili===s.value?P:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{secili===s.value&&<div style={{width:9,height:9,borderRadius:"50%",background:P}}/>}</div>
    </div>)}
  </BottomSheet>;
}

function DilSecimModal({secili,onSec,onKapat}){
  const [arama,setArama]=useState("");
  const filtreli=DIL_GRUPLARI.map(g=>({
    ...g,
    diller:g.diller.filter(d=>
      !arama||
      d.ad.toLowerCase().includes(arama.toLowerCase())||
      d.bolge.toLowerCase().includes(arama.toLowerCase())
    )
  })).filter(g=>g.diller.length>0);
  return <BottomSheet onKapat={onKapat} maxH="90vh">
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:12}}>🌐 Dil Seçin</div>
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍..."
      style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:14}}/>
    {filtreli.map(g=><div key={g.grup} style={{marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:C.t3,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 4px 8px"}}>{g.grup}</div>
      <Sh s={{overflow:"hidden"}}>
        {g.diller.map((d,i)=><div key={d.code} onClick={()=>{onSec(d.code);onKapat();}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<g.diller.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",background:secili===d.code?C.purpleBg:"transparent"}}>
          <span style={{fontSize:22,lineHeight:1}}>{d.bayrak}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:secili===d.code?700:500,color:secili===d.code?P:C.t1}}>{d.ad}</div>
            <div style={{fontSize:10,color:C.t3,marginTop:1}}>{d.bolge}</div>
          </div>
          {secili===d.code&&<div style={{width:18,height:18,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/></div>}
        </div>)}
      </Sh>
    </div>)}
  </BottomSheet>;
}

// ─── BANKA & TAHSİLAT YÖNLENDİRME ───────────────────────────────
// ÖNEMLİ: TradeFlow para transferi YAPMAZ. Sadece kullanıcının kendi
// IBAN bilgisini müşterisine iletir ve bankanın resmî sitesine yönlendirir.
export const BANKALAR=[
  {ad:"Ziraat Bankası",url:"https://www.ziraatbank.com.tr"},
  {ad:"İş Bankası",url:"https://www.isbank.com.tr"},
  {ad:"Garanti BBVA",url:"https://www.garantibbva.com.tr"},
  {ad:"Yapı Kredi",url:"https://www.yapikredi.com.tr"},
  {ad:"Akbank",url:"https://www.akbank.com"},
  {ad:"VakıfBank",url:"https://www.vakifbank.com.tr"},
  {ad:"Halkbank",url:"https://www.halkbank.com.tr"},
  {ad:"QNB",url:"https://www.qnb.com.tr"},
  {ad:"DenizBank",url:"https://www.denizbank.com"},
  {ad:"TEB",url:"https://www.teb.com.tr"},
  {ad:"ING",url:"https://www.ing.com.tr"},
  {ad:"Kuveyt Türk",url:"https://www.kuveytturk.com.tr"},
  {ad:"Albaraka Türk",url:"https://www.albaraka.com.tr"},
  {ad:"Türkiye Finans",url:"https://www.turkiyefinans.com.tr"},
  {ad:"Enpara",url:"https://www.enpara.com"},
  {ad:"Diğer / Belirtmek istemiyorum",url:""},
];
// IBAN doğrulama (TR + 24 hane, mod-97 kontrolü)
export function ibanGecerli(ham){
  const s=(ham||"").replace(/\s/g,"").toUpperCase();
  if(!/^TR\d{24}$/.test(s))return false;
  const cev=(s.slice(4)+s.slice(0,4)).replace(/[A-Z]/g,c=>c.charCodeAt(0)-55);
  let kalan=0;
  for(const k of cev)kalan=(kalan*10+Number(k))%97;
  return kalan===1;
}
export const ibanBicim=(ham)=>(ham||"").replace(/\s/g,"").toUpperCase().replace(/(.{4})/g,"$1 ").trim();

// ─── YASAL UYARI & SORUMLULUK ───────────────────────────────────
function YasalEkrani({onKapat}){
  const link=(u)=>window.open(u,"_blank","noopener,noreferrer");
  // ESC ile kapat + sayfa kaydırmasını kilitle
  useEffect(()=>{
    const esc=(e)=>{if(e.key==="Escape")onKapat();};
    window.addEventListener("keydown",esc);
    return ()=>window.removeEventListener("keydown",esc);
  },[onKapat]);
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100dvh"}}>
      {/* Kapatma başlığı — her iki buton da garantili kapatır */}
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"52px 16px 14px",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:60}}>
        <button onClick={onKapat} type="button" style={{width:38,height:38,borderRadius:11,background:C.bg,border:`1px solid ${C.border}`,fontSize:16,cursor:"pointer",color:C.t1}}>←</button>
        <div style={{flex:1,fontSize:18,fontWeight:800,color:C.t1}}>🛡️ Yasal Uyarı</div>
        <button onClick={onKapat} type="button" aria-label="Kapat" style={{width:40,height:40,borderRadius:12,background:"#EF4444",border:"none",fontSize:19,cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>✕</button>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        <Sh s={{padding:16,marginBottom:14}}>
          <div style={{fontSize:14,fontWeight:800,color:C.t1,marginBottom:8}}>TradeFlow Elite nedir?</div>
          <div style={{fontSize:12.5,color:C.t2,lineHeight:1.8}}>
            TradeFlow Elite bir <b>iş ve muhasebe takip aracıdır</b>. Müşterilerini, işlerini, gelir-giderini ve tekliflerini tek yerden yönetmene yardımcı olur.{"\n\n"}
            Uygulama; mali müşavirlik, e-fatura entegratörlüğü, bankacılık veya ödeme hizmeti <b>değildir</b>.
          </div>
        </Sh>

        <Sh s={{padding:16,marginBottom:14,background:C.greenBg}}>
          <div style={{fontSize:13,fontWeight:800,color:C.green,marginBottom:8}}>✅ Uygulama NE YAPAR</div>
          <div style={{fontSize:12,color:C.t1,lineHeight:1.9}}>
            • İş, müşteri, gelir-gider ve teklif kaydı tutar{"\n"}
            • Fatura ve teklif <b>taslağı</b> (PDF) hazırlar{"\n"}
            • WhatsApp'tan bilgi paylaşmanı kolaylaştırır{"\n"}
            • Verilerini şifreli bulutta ve cihazında saklar{"\n"}
            • Kendi IBAN'ını müşterine iletmene yardımcı olur
          </div>
        </Sh>

        <Sh s={{padding:16,marginBottom:14,background:C.redBg}}>
          <div style={{fontSize:13,fontWeight:800,color:C.red,marginBottom:8}}>⛔ Uygulama NE YAPMAZ</div>
          <div style={{fontSize:12,color:C.t1,lineHeight:1.9}}>
            • <b>Para transferi yapmaz, tahsilat almaz</b>, hiçbir tutarı elinde tutmaz{"\n"}
            • <b>GİB'e fatura göndermez</b> — oluşturulan belgeler resmî fatura değildir{"\n"}
            • Vergi beyanı vermez, mali danışmanlık yapmaz{"\n"}
            • Banka/GİB şifreni istemez ve saklamaz
          </div>
        </Sh>

        <Sh s={{padding:16,marginBottom:14,background:C.amberBg}}>
          <div style={{fontSize:13,fontWeight:800,color:"#92400E",marginBottom:8}}>⚠️ Sorumluluk Reddi</div>
          <div style={{fontSize:12,color:"#78350F",lineHeight:1.85}}>
            Resmî fatura kesme, e-Fatura/e-Arşiv gönderimi, vergi beyanı ve tüm yasal yükümlülükler <b>tamamen kullanıcının sorumluluğundadır</b>.{"\n\n"}
            Uygulamadaki hesaplamalar bilgilendirme amaçlıdır; kesin işlemler için mali müşavirine danışmalısın.{"\n\n"}
            TradeFlow Elite, kullanımdan doğabilecek vergisel, mali veya hukuki sonuçlardan sorumlu tutulamaz.
          </div>
        </Sh>

        <Sh s={{padding:16}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>🏛️ Resmî Kaynaklar</div>
          {[
            ["GİB e-Arşiv Portalı","https://earsivportal.efatura.gov.tr"],
            ["GİB e-Belge","https://ebelge.gib.gov.tr"],
            ["İnteraktif Vergi Dairesi","https://ivd.gib.gov.tr"],
            ["TÜRMOB — Mali Müşavir Bul","https://www.turmob.org.tr"],
          ].map(([ad,u])=><div key={ad} onClick={()=>link(u)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
            <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{ad}</span>
            <span style={{fontSize:13,color:P,fontWeight:700}}>↗</span>
          </div>)}
        </Sh>

        <button onClick={onKapat} type="button" style={{width:"100%",background:P,border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:16}}>Anladım, Kapat</button>
      </div>
    </div>
  </div>;
}

function BankaEkrani({onKapat,isletme,setIsletme,goster}){
  const [iban,setIban]=useState(isletme?.iban||"");
  const [banka,setBanka]=useState(isletme?.bankaAd||"");
  const [hesapAd,setHesapAd]=useState(isletme?.hesapAd||isletme?.yetkili||"");
  const temiz=iban.replace(/\s/g,"").toUpperCase();
  const gecerli=ibanGecerli(temiz);
  const kaydet=()=>{
    if(temiz&&!gecerli){goster("⚠️ IBAN geçersiz — kontrol et");return;}
    setIsletme(p=>({...p,iban:temiz,bankaAd:banka,hesapAd}));
    goster("🏦 Banka bilgisi kaydedildi");
    onKapat();
  };
  const seciliBanka=BANKALAR.find(b=>b.ad===banka);
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="🏦 Banka Hesabı" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        {/* Sorumluluk bilgilendirmesi */}
        <Sh s={{padding:15,marginBottom:16,background:C.blueBg}}>
          <div style={{fontSize:13,fontWeight:800,color:P,marginBottom:7}}>ℹ️ Bu bilgi ne için kullanılır?</div>
          <div style={{fontSize:11.5,color:C.t1,lineHeight:1.75}}>
            IBAN bilgin <b>yalnızca</b> müşterine gönderdiğin teklif, fatura ve tahsilat mesajlarına eklenir.{"\n"}
            <b>TradeFlow Elite para transferi yapmaz, tahsilat almaz, hiçbir tutarı elinde tutmaz.</b>{"\n"}
            Ödeme müşterin ile bankan arasında gerçekleşir; uygulama bu işlemin tarafı değildir.
          </div>
        </Sh>

        <Sh s={{padding:16,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color:C.t2,marginBottom:6}}>Hesap Sahibi</div>
          <input value={hesapAd} onChange={e=>setHesapAd(e.target.value)} placeholder="Ad Soyad / Firma Ünvanı"
            style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",marginBottom:14}}/>

          <div style={{fontSize:12,fontWeight:700,color:C.t2,marginBottom:6}}>Banka</div>
          <select value={banka} onChange={e=>setBanka(e.target.value)}
            style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",marginBottom:14}}>
            <option value="">Banka seç…</option>
            {BANKALAR.map(b=><option key={b.ad} value={b.ad}>{b.ad}</option>)}
          </select>

          <div style={{fontSize:12,fontWeight:700,color:C.t2,marginBottom:6}}>IBAN</div>
          <input value={ibanBicim(iban)} onChange={e=>setIban(e.target.value)} placeholder="TR00 0000 0000 0000 0000 0000 00"
            style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1.5px solid ${temiz?(gecerli?C.green:C.red):C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",letterSpacing:"0.04em",fontFamily:"monospace"}}/>
          {temiz&&<div style={{fontSize:11,fontWeight:700,color:gecerli?C.green:C.red,marginTop:7}}>
            {gecerli?"✅ IBAN geçerli":"❌ IBAN hatalı — TR ile başlamalı ve 26 hane olmalı"}
          </div>}

          <button onClick={kaydet} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:14,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",marginTop:16}}>Kaydet</button>
        </Sh>

        {/* Bankaya yönlendirme */}
        {seciliBanka?.url&&<Sh s={{padding:16,marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:6}}>🔗 {seciliBanka.ad} İnternet Şubesi</div>
          <div style={{fontSize:11.5,color:C.t3,lineHeight:1.6,marginBottom:12}}>Hesap hareketlerini görmek veya ödeme yapmak için bankanın resmî sitesine gidersin. Giriş bilgilerin uygulamaya hiçbir zaman girilmez.</div>
          <button onClick={()=>window.open(seciliBanka.url,"_blank","noopener,noreferrer")}
            style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:P,fontSize:13,fontWeight:700,cursor:"pointer"}}>
            {seciliBanka.ad} sitesini aç ↗
          </button>
        </Sh>}

        <Sh s={{padding:15,background:C.amberBg}}>
          <div style={{fontSize:12,fontWeight:800,color:"#92400E",marginBottom:6}}>⚠️ Güvenlik Uyarısı</div>
          <div style={{fontSize:11,color:"#78350F",lineHeight:1.7}}>
            TradeFlow Elite senden <b>asla</b> internet bankacılığı şifresi, kart numarası, CVV veya SMS onay kodu istemez.{"\n"}
            Böyle bir istekle karşılaşırsan bu bir dolandırıcılıktır — hiçbir bilgi verme.
          </div>
        </Sh>
      </div>
    </div>
  </div>;
}

// ─── GİB ENTEGRASYON EKRANI ─────────────────────────────────────
function GibEkrani({onKapat,isletme,gibAyar,setGibAyar,goster}){
  const [sekme,setSekme]=useState("bilgi"); // bilgi | basvuru | test | ayar
  const [form,setForm]=useState({...gibAyar});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const adimlar=[
    {no:1,baslik:"Entegratör Seç",durum:gibAyar.entegrator?"ok":"bekliyor"},
    {no:2,baslik:"GİB Başvurusu",durum:gibAyar.basvuruDurumu||"bekliyor"},
    {no:3,baslik:"Entegratör Sözleşmesi",durum:"bekliyor"},
    {no:4,baslik:"Test Ortamı",durum:"bekliyor"},
    {no:5,baslik:"Canlı Kullanım",durum:"bekliyor"},
  ];
  const durumRenk={ok:C.green,bekliyor:C.t3,islemde:C.amber,hata:C.red};
  const durumIkon={ok:"✅",bekliyor:"⭕",islemde:"🔄",hata:"❌"};

  const entegratorler=[
    {ad:"Logo e-Dönüşüm",logo:"🟦",fiyat:"~₺350/ay",aciklama:"Kurumsal çözüm, SAP uyumlu",url:"https://logo.com.tr"},
    {ad:"Uyumsoft",logo:"🟩",fiyat:"~₺280/ay",aciklama:"Kobi dostu, hızlı kurulum",url:"https://uyumsoft.com.tr"},
    {ad:"Türkiye Finans e-Fatura",logo:"🟨",fiyat:"~₺200/ay",aciklama:"Bankacılık entegrasyonu var",url:"https://tf.com.tr"},
    {ad:"Parasut",logo:"🟪",fiyat:"~₺150/ay",aciklama:"Muhasebe yazılımıyla birlikte",url:"https://parasut.com"},
    {ad:"IziBiz (Turkcell)",logo:"🔵",fiyat:"~₺180/ay",aciklama:"REST API, iyi dökümantasyon",url:"https://izibiz.com.tr"},
    {ad:"NES e-Fatura",logo:"⚫",fiyat:"~₺160/ay",aciklama:"Swagger API, developer dostu",url:"https://nes.com.tr"},
  ];

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="🧾 GİB e-Fatura Entegrasyonu" onKapat={onKapat}/>

      {/* Sekme */}
      <div style={{display:"flex",background:C.card,borderBottom:`1px solid ${C.border}`,padding:"0 14px"}}>
        {[["bilgi","Nedir?"],["basvuru","Başvuru"],["ayar","Resmî Kaynaklar"],["test","Sorumluluk"]].map(([k,l])=><div key={k} onClick={()=>setSekme(k)} style={{flex:1,padding:"12px 0",textAlign:"center",fontSize:12,fontWeight:sekme===k?700:400,color:sekme===k?P:C.t3,borderBottom:sekme===k?`2px solid ${P}`:"2px solid transparent",cursor:"pointer"}}>{l}</div>)}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        {/* BİLGİ */}
        {sekme==="bilgi"&&<>
          {/* Durum adımları */}
          <Sh s={{padding:16,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:12}}>📋 Entegrasyon Yol Haritası</div>
            {adimlar.map((a,i)=><div key={a.no} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<adimlar.length-1?12:0}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:a.durum==="ok"?C.greenBg:a.durum==="islemde"?C.amberBg:C.bg,border:`2px solid ${durumRenk[a.durum]||C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{durumIkon[a.durum]||a.no}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:a.durum==="ok"?C.green:C.t1}}>{a.baslik}</div>
              </div>
              {i<adimlar.length-1&&<div style={{position:"absolute",left:30,top:32,width:2,height:12,background:C.border}}/>}
            </div>)}
          </Sh>

          {/* Neden zorunlu */}
          <Sh s={{padding:16,marginBottom:16,background:C.amberBg}}>
            <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:8}}>⚠️ 2026 Yılı Zorunlulukları</div>
            <div style={{fontSize:12,color:C.t1,lineHeight:1.7}}>
              • Tüm KDV mükellefleri için e-Arşiv zorunlu (tutar sınırı kalktı){"\n"}
              • 2027 itibarıyla tüm mükellefler için geçerli{"\n"}
              • Kağıt fatura kesilemez, ceza uygulanır
            </div>
          </Sh>

          {/* Açıklama */}
          <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",margin:"0 4px 10px"}}>GİB DOĞRUDAN ERİŞİM (ücretsiz)</div>
          <Sh s={{padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:6}}>🏛️ GİB e-Arşiv Portali</div>
            <div style={{fontSize:12,color:C.t2,lineHeight:1.6,marginBottom:10}}>Yıllık 3.000 adede kadar ücretsiz fatura. Mali mühür veya e-imza gerekir. ebelge.gib.gov.tr üzerinden direkt kullanılır.</div>
            <button onClick={()=>window.open("https://ebelge.gib.gov.tr","_blank")} style={{width:"100%",background:C.greenBg,border:`1px solid ${C.green}33`,borderRadius:10,padding:"10px 0",color:C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>🌐 ebelge.gib.gov.tr →</button>
          </Sh>


        </>}

        {/* BAŞVURU */}
        {sekme==="basvuru"&&<>
          <Sh s={{padding:16,marginBottom:16,background:C.blueBg}}>
            <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:6}}>📋 GİB'e Entegrasyon Başvurusu</div>
            <div style={{fontSize:12,color:C.t1,lineHeight:1.7}}>Özel entegratör üzerinden API kullanmak için GİB'e başvuru yapmanız gerekiyor. Entegratör firma bu süreci genellikle sizin adınıza yürütür.</div>
          </Sh>
          {[
            {no:"01",baslik:"Mali Mühür / e-İmza Temin",alt:"TÜBİTAK UEKAE veya yetkili kurumdan alın. Yaklaşık ₺1.500-2.500.",link:"https://mhs.kamusm.gov.tr",linkAd:"kamusm.gov.tr →"},
            {no:"02",baslik:"Entegrasyon Firmasi Sözleşmesi",alt:"Seçtiğiniz entegratörle sözleşme imzalayın. Size test ortamı ve API bilgileri iletilecek."},
            {no:"03",baslik:"GİB ebelge Başvurusu",alt:"Entegratör veya siz bizzat ebelge.gib.gov.tr üzerinden elektronik başvuru yapın.",link:"https://ebelgebasvuru.gib.gov.tr/entegrasyon",linkAd:"Başvuru ekranı →"},
            {no:"04",baslik:"Test Süreci (30 gün)",alt:"GİB test ortamında en az 3 başarılı fatura gönderimi yapılmalı. Entegratör destek sağlar."},
            {no:"05",baslik:"Canlı Ortam Aktivasyonu",alt:"Testler onaylandıktan sonra production'a geçilir. Artık yasal e-fatura kesilir."},
          ].map(a=><Sh key={a.no} s={{padding:"16px 18px",marginBottom:10}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:10,background:C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:P,flexShrink:0}}>{a.no}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:4}}>{a.baslik}</div>
                <div style={{fontSize:11,color:C.t2,lineHeight:1.6}}>{a.alt}</div>
                {a.link&&<button onClick={()=>window.open(a.link,"_blank")} style={{marginTop:8,background:"none",border:`1px solid ${P}`,borderRadius:8,padding:"5px 12px",color:P,fontSize:11,fontWeight:700,cursor:"pointer"}}>{a.linkAd}</button>}
              </div>
            </div>
          </Sh>)}
        </>}

        {/* API AYARI */}
        {sekme==="ayar"&&<>
          <Sh s={{padding:16,marginBottom:16,background:C.blueBg}}>
            <div style={{fontSize:13,fontWeight:800,color:P,marginBottom:8}}>🔐 Neden burada şifre istemiyoruz?</div>
            <div style={{fontSize:11.5,color:C.t1,lineHeight:1.75}}>
              e-Fatura entegratör şifren, mali mühür bilgin ve GİB giriş bilgilerin <b>yalnızca sana aittir</b>.{"\n"}
              TradeFlow Elite bu bilgileri istemez, saklamaz ve hiçbir sisteme iletmez.{"\n"}
              Faturanı entegratörünün kendi paneli veya GİB portalı üzerinden keser, buraya sadece takip için kaydedersin.
            </div>
          </Sh>
          <Sh s={{padding:16,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>🏛️ Resmî Kaynaklar</div>
            {[
              ["GİB e-Arşiv Portalı","Faturayı doğrudan GİB üzerinden kes","https://earsivportal.efatura.gov.tr"],
              ["GİB e-Belge Ana Sayfa","Başvuru, duyuru ve mevzuat","https://ebelge.gib.gov.tr"],
              ["İnteraktif Vergi Dairesi","Mükellefiyet ve borç sorgulama","https://ivd.gib.gov.tr"],
            ].map(([ad,alt,u])=><div key={ad} onClick={()=>window.open(u,"_blank","noopener,noreferrer")}
              style={{display:"flex",alignItems:"center",gap:11,padding:"11px 0",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{ad}</div>
                <div style={{fontSize:10.5,color:C.t3}}>{alt}</div>
              </div>
              <span style={{fontSize:13,color:P,fontWeight:700}}>↗</span>
            </div>)}
          </Sh>
          <Sh s={{padding:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:8}}>📝 Entegratörünü Not Et</div>
            <div style={{fontSize:11,color:C.t3,marginBottom:10,lineHeight:1.6}}>Hangi firmayla çalıştığını kaydet — sadece hatırlatma amaçlıdır, hiçbir bağlantı kurulmaz.</div>
            <input value={form.entegrator||""} onChange={e=>set("entegrator",e.target.value)} placeholder="Örn: Uyumsoft, Parasut, IziBiz…"
              style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:12}}/>
            <button onClick={()=>{setGibAyar({entegrator:form.entegrator||""});goster("Kaydedildi ✓");}} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>💾 Kaydet</button>
          </Sh>
        </>}

        {/* SORUMLULUK */}
        {sekme==="test"&&<>
          <Sh s={{padding:16,marginBottom:14,background:C.amberBg}}>
            <div style={{fontSize:13,fontWeight:800,color:"#92400E",marginBottom:8}}>⚠️ Sorumluluk Reddi</div>
            <div style={{fontSize:11.5,color:"#78350F",lineHeight:1.8}}>
              TradeFlow Elite bir <b>muhasebe takip aracıdır</b>; mali müşavirlik, e-fatura entegratörlüğü veya ödeme hizmeti değildir.{"\n\n"}
              • Uygulamada oluşturulan fatura ve teklifler <b>resmî belge değildir</b>.{"\n"}
              • Vergi beyanı, e-Fatura/e-Arşiv gönderimi ve yasal yükümlülükler tamamen <b>kullanıcının sorumluluğundadır</b>.{"\n"}
              • Uygulama para transferi yapmaz, tahsilat almaz, hiçbir tutarı elinde tutmaz.{"\n"}
              • Hesaplamalar bilgilendirme amaçlıdır; kesin işlemler için mali müşavirine danış.
            </div>
          </Sh>
          <Sh s={{padding:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:8}}>👨‍💼 Mali Müşavir Bul</div>
            <div style={{fontSize:11,color:C.t3,lineHeight:1.6,marginBottom:12}}>Bölgendeki yeminli mali müşavirlere TÜRMOB üzerinden ulaşabilirsin.</div>
            <button onClick={()=>window.open("https://www.turmob.org.tr","_blank","noopener,noreferrer")}
              style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:P,fontSize:13,fontWeight:700,cursor:"pointer"}}>TÜRMOB sitesini aç ↗</button>
          </Sh>
        </>}

      </div>
    </div>
  </div>;
}

function SifreDegistirModal({onKapat}){
  return <BottomSheet onKapat={onKapat}>
    <SifreDegistir onBitti={onKapat} gomulu/>
  </BottomSheet>;
}
function KdvModal({kdv,onSec,onKapat}){
  const [deger,setDeger]=useState(kdv);
  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:4}}>KDV Oranı</div>
    <div style={{fontSize:12,color:C.t2,marginBottom:16}}>%0 – %50 arası serbestçe belirleyin</div>
    <div style={{textAlign:"center",marginBottom:14}}><span style={{fontSize:44,fontWeight:900,color:P}}>%{deger}</span></div>
    <input type="range" min="0" max="50" value={deger} onChange={e=>setDeger(Number(e.target.value))} style={{width:"100%",accentColor:P,marginBottom:14}}/>
    <div style={{display:"flex",gap:8,marginBottom:18,justifyContent:"center",flexWrap:"wrap"}}>
      {[0,1,10,20].map(v=><button key={v} onClick={()=>setDeger(v)} style={{padding:"8px 16px",borderRadius:10,border:`2px solid ${deger===v?P:C.border}`,background:deger===v?C.purpleBg:C.bg,color:deger===v?P:C.t2,fontSize:13,fontWeight:700,cursor:"pointer"}}>%{v}</button>)}
      <input type="number" min="0" max="50" value={deger} onChange={e=>setDeger(Math.min(50,Math.max(0,Number(e.target.value))))} style={{width:60,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 10px",color:C.t1,fontSize:13,outline:"none",textAlign:"center"}}/>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>İptal</BtnS><BtnP onClick={()=>{onSec(deger);onKapat();}}>✓ Kaydet</BtnP></div>
  </BottomSheet>;
}

function IsletmeModal({bilgi,onKaydet,onKapat}){
  const [form,setForm]=useState({...bilgi});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <BottomSheet onKapat={onKapat} maxH="85vh">
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:14}}>İşletme Bilgileri</div>
    {[["İşletme Adı","ad"],["Yetkili","yetkili"],["Telefon","telefon"],["E-posta","email"],["VKN / TCKN","vergiNo"],["Vergi Dairesi","vergiDairesi"],["Adres","adres"]].map(([l,k])=><Inp key={k} label={l} value={form[k]||""} onChange={e=>set(k,e.target.value)}/>)}
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>İptal</BtnS><BtnP onClick={()=>{onKaydet(form);onKapat();}}>✓ Kaydet</BtnP></div>
  </BottomSheet>;
}

// ─── SEKMELER ───────────────────────────────────────────────────
function IslerTab({jobs,onSelect,T,filtre}){
  const [arama,setArama]=useState("");
  const [gorunum,setGorunum]=useState("liste"); // liste | takvim
  const [takvimAy,setTakvimAy]=useState(()=>{const d=new Date();return {yil:d.getFullYear(),ay:d.getMonth()};});
  const [seciliGun,setSeciliGun]=useState(null);
  const gruplar=filtre?[filtre]:["aktif","bekliyor","tamamlandi"];
  const fj=jobs.filter(j=>j.musteri.toLowerCase().includes(arama.toLowerCase())||j.baslik.toLowerCase().includes(arama.toLowerCase()));

  // Takvim hesaplama
  const ilkGun=new Date(takvimAy.yil,takvimAy.ay,1);
  const sonGun=new Date(takvimAy.yil,takvimAy.ay+1,0).getDate();
  const baslangicHafta=(ilkGun.getDay()+6)%7; // Pazartesi=0
  const AY_ADLARI=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const bugunStr=new Date().toISOString().slice(0,10);
  const gunIsler=(gun)=>{
    const tarihStr=`${takvimAy.yil}-${String(takvimAy.ay+1).padStart(2,"0")}-${String(gun).padStart(2,"0")}`;
    return fj.filter(j=>j.tarih===tarihStr);
  };
  const ayDegis=(yon)=>{
    setTakvimAy(t=>{
      let ay=t.ay+yon,yil=t.yil;
      if(ay<0){ay=11;yil--;}if(ay>11){ay=0;yil++;}
      return {yil,ay};
    });
    setSeciliGun(null);
  };

  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.tumIsAkislari}</div>
      {/* Görünüm toggle */}
      <div style={{display:"flex",background:C.card,borderRadius:10,padding:3,boxShadow:C.sh}}>
        {[["liste","📋"],["takvim","📅"]].map(([v,ic])=><button key={v} onClick={()=>setGorunum(v)} style={{padding:"6px 12px",borderRadius:8,border:"none",background:gorunum===v?P:"transparent",color:gorunum===v?"#fff":C.t3,fontSize:14,cursor:"pointer"}}>{ic}</button>)}
      </div>
    </div>

    {gorunum==="liste"&&<>
      <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍 Ara..." style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",color:C.t1,fontSize:14,outline:"none",marginBottom:16,boxShadow:C.sh}}/>
      {gruplar.map(d=>{const g=fj.filter(j=>j.durum===d);if(!g.length)return null;return <div key={d} style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><div style={{width:8,height:8,borderRadius:"50%",background:DURUM[d].color}}/><span style={{fontSize:11,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:"0.08em"}}>{DURUM[d].label} ({g.length})</span></div>
        {g.map(j=>{
          const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
          return <Sh key={j.id} onClick={()=>onSelect(j)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>{j.ref}{j.hatirlatma?" ⏰":""}{j.tekrar&&j.tekrar!=="yok"?" 🔁":""}{(j.fotolar||[]).length>0?" 📷":""}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:11,color:C.t3}}>{j.musteri}</div>
              {odenen>0&&j.durum!=="tamamlandi"&&<div style={{fontSize:10,color:C.green,fontWeight:600,marginTop:2}}>💰 {fmt(odenen)} {T.alindiL} · {T.kalanL.toLowerCase()} {fmt(j.tutar-odenen)}</div>}
            </div>
            <div style={{textAlign:"right"}}><Badge durum={j.durum}/><div style={{fontSize:13,fontWeight:700,color:C.t1,marginTop:4}}>{fmt(j.tutar)}</div></div>
          </div>
        </Sh>;})}
      </div>;})}
      {fj.length===0&&<div style={{textAlign:"center",padding:40,color:C.t3}}>{T.sonucYok}</div>}
    </>}

    {gorunum==="takvim"&&<>
      {/* Ay navigasyonu */}
      <Sh s={{padding:14,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={()=>ayDegis(-1)} style={{background:C.bg,border:"none",borderRadius:8,padding:"6px 14px",color:C.t1,fontSize:16,cursor:"pointer"}}>‹</button>
          <div style={{fontSize:15,fontWeight:800,color:C.t1}}>{AY_ADLARI[takvimAy.ay]} {takvimAy.yil}</div>
          <button onClick={()=>ayDegis(1)} style={{background:C.bg,border:"none",borderRadius:8,padding:"6px 14px",color:C.t1,fontSize:16,cursor:"pointer"}}>›</button>
        </div>
        {/* Hafta günleri */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
          {["Pt","Sa","Ça","Pe","Cu","Ct","Pz"].map(g=><div key={g} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.t3}}>{g}</div>)}
        </div>
        {/* Günler */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {Array.from({length:baslangicHafta}).map((_,i)=><div key={"b"+i}/>)}
          {Array.from({length:sonGun}).map((_,i)=>{
            const gun=i+1;
            const isler=gunIsler(gun);
            const tarihStr=`${takvimAy.yil}-${String(takvimAy.ay+1).padStart(2,"0")}-${String(gun).padStart(2,"0")}`;
            const bugun=tarihStr===bugunStr;
            const secili=seciliGun===gun;
            return <div key={gun} onClick={()=>setSeciliGun(secili?null:gun)} style={{
              aspectRatio:"1",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",
              background:secili?P:bugun?C.purpleBg:isler.length>0?C.bg:"transparent",
              border:bugun&&!secili?`2px solid ${P}`:"2px solid transparent",
            }}>
              <span style={{fontSize:12,fontWeight:bugun||secili?800:500,color:secili?"#fff":bugun?P:C.t1}}>{gun}</span>
              {isler.length>0&&<div style={{display:"flex",gap:2,marginTop:2}}>
                {isler.slice(0,3).map((j,idx)=><div key={idx} style={{width:5,height:5,borderRadius:"50%",background:secili?"#fff":DURUM[j.durum]?.color||P}}/>)}
              </div>}
            </div>;
          })}
        </div>
      </Sh>

      {/* Seçili gün işleri */}
      {seciliGun&&<>
        <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{seciliGun} {AY_ADLARI[takvimAy.ay]} {T.isleri}</div>
        {gunIsler(seciliGun).length===0
          ?<Sh s={{padding:20,textAlign:"center"}}><div style={{fontSize:13,color:C.t3}}>{T.buGunIsYok}</div></Sh>
          :gunIsler(seciliGun).map(j=><Sh key={j.id} onClick={()=>onSelect(j)} s={{padding:"13px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:11,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:11,color:C.t3}}>{j.musteri}</div>
            </div>
            <div style={{textAlign:"right"}}><Badge durum={j.durum}/><div style={{fontSize:12,fontWeight:700,color:C.t1,marginTop:3}}>{fmt(j.tutar)}</div></div>
          </Sh>)}
      </>}
      {!seciliGun&&<div style={{textAlign:"center",fontSize:12,color:C.t3,padding:"8px 0"}}>{T.gunSecin}</div>}
    </>}
  </div>;
}

function FaturalarTab({faturalar,jobs,onFaturaKes,onFaturaSil,T,isletme}){
  const [silOnayId,setSilOnayId]=useState(null);
  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.faturalar} ({faturalar.length})</div>
    {faturalar.length===0&&<Sh s={{padding:28,textAlign:"center",marginBottom:14}}><div style={{fontSize:36,marginBottom:8}}>🧾</div><div style={{fontSize:14,color:C.t2}}>{T.henuzFaturaYok}</div><div style={{fontSize:12,color:C.t3,marginTop:4}}>{T.faturaKes} seçeneğini kullanın.</div></Sh>}
    {faturalar.map(f=><Sh key={f.no} s={{padding:"16px 18px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:11,fontFamily:"monospace",color:P,fontWeight:700}}>{f.no}</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:C.green,background:C.greenBg,padding:"3px 9px",borderRadius:20,fontWeight:700}}>{T.kesildiL}</span>
          <button onClick={()=>faturaPdf(f,isletme,T)} style={{background:"none",border:"none",fontSize:15,cursor:"pointer",padding:"0 2px"}}>🖨️</button>
          <button onClick={()=>setSilOnayId(silOnayId===f.no?null:f.no)} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer",padding:"0 2px"}}>🗑️</button>
        </div>
      </div>
      <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{f.musteri}</div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:11,color:C.t3}}>{f.tarih} · {f.jobRef}</span><span style={{fontSize:15,fontWeight:800,color:C.green}}>{fmt(f.tutar)}</span></div>
      {/* Silme onayı */}
      {silOnayId===f.no&&<div style={{background:C.redBg,borderRadius:12,padding:12,marginTop:10}}>
        <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:4,textAlign:"center"}}>⚠️ {T.faturaSilUyari}</div>
        <div style={{fontSize:10,color:C.red,textAlign:"center",marginBottom:8}}>{T.gibSilNot}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setSilOnayId(null)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:9,color:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.iptal}</button>
          <button onClick={()=>{onFaturaSil(f.no);setSilOnayId(null);}} style={{flex:2,background:C.red,border:"none",borderRadius:9,padding:9,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.evetSil}</button>
        </div>
      </div>}
    </Sh>)}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"14px 4px 8px"}}>{T.faturaKes.toUpperCase()} — {T.bekleyenIslerB}</div>
    {jobs.filter(j=>!j.faturalandi&&!faturalar.some(f=>f.jobRef===j.ref)).map(j=><Sh key={j.id} s={{padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{j.baslik}</div><div style={{fontSize:11,color:C.t3}}>{j.musteri} · {fmt(j.tutar)}</div></div>
      <button onClick={()=>onFaturaKes(j)} style={{background:C.amberBg,border:"none",borderRadius:10,padding:"8px 14px",color:C.amber,fontSize:12,fontWeight:700,cursor:"pointer"}}>📄 {T.faturaKes}</button>
    </Sh>)}
  </div>;
}

function TahsilatlarTab({jobs,onTahsil,onSil,filtre,T,vadeGun=VADE_VARSAYILAN}){
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi"&&!tahsilatVadesi(j,vadeGun));
  // Bekleyen = parası tam alınmamış her iş. Vade aciliyetine göre sıralanır.
  const bekleyen=jobs.filter(j=>!!tahsilatVadesi(j,vadeGun))
    .map(j=>{const v=tahsilatVadesi(j,vadeGun);return {j,v,et:tahsilatEtiket(v.kalanGun,v.pesin)};})
    .sort((a,b)=>a.et.oncelik-b.et.oncelik||a.v.kalanGun-b.v.kalanGun);
  const geciken=bekleyen.filter(x=>x.v.kalanGun<0);
  const goster=filtre==="tahsil"?["t"]:filtre==="bekleyen"?["b"]:["b","t"];
  const AY=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
  const kisaTarih=(iso)=>{const d=new Date(iso);return d.getDate()+" "+AY[d.getMonth()];};

  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.tahsilatlar}</div>
    <div style={{display:"flex",gap:10,marginBottom:18}}>
      <Sh s={{flex:1,padding:14,textAlign:"center"}}><div style={{fontSize:11,color:C.t3}}>{T.tahsilEdilen}</div><div style={{fontSize:17,fontWeight:800,color:YESIL}}>{fmt(tahsilE.reduce((s,j)=>s+j.tutar,0))}</div></Sh>
      <Sh s={{flex:1,padding:14,textAlign:"center"}}><div style={{fontSize:11,color:C.t3}}>{T.bekleyen}</div><div style={{fontSize:17,fontWeight:800,color:geciken.length?KOR:C.t1}}>{fmt(bekleyen.reduce((s,x)=>s+x.v.kalanTutar,0))}</div></Sh>
    </div>

    {geciken.length>0&&<div style={{display:"flex",alignItems:"center",gap:9,background:"#FEE2E2",border:"1px solid #FCA5A5",borderRadius:14,padding:"12px 14px",marginBottom:14}}>
      <i className="ti ti-alert-triangle" style={{fontSize:19,color:"#B91C1C"}} aria-hidden="true"/>
      <div style={{flex:1,fontSize:12.5,color:"#B91C1C",fontWeight:600,lineHeight:1.45}}>
        {geciken.length} işin ödeme vadesi geçti — toplam {fmt(geciken.reduce((s,x)=>s+x.v.kalanTutar,0))}
      </div>
    </div>}

    {goster.includes("b")&&<>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{(T.vadesiGelenler||"VADESİ GELEN ÖDEMELER")}</div>
      {bekleyen.length===0&&<div style={{textAlign:"center",padding:24,color:C.t3,fontSize:13}}>Bekleyen tahsilat yok 🎉</div>}
      {bekleyen.map(({j,v,et})=>{
        const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
        const acil=et.seviye==="gecikti"||et.seviye==="songun";
        return <div key={j.id} style={{background:C.card,border:`1px solid ${acil?"#FCA5A5":C.border}`,borderRadius:16,padding:"14px 16px",marginBottom:8,position:"relative",overflow:"hidden",boxShadow:C.sh}}>
          <span style={{position:"absolute",left:0,top:0,bottom:0,width:3,background:et.renk}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13.5,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.musteri}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:16,fontWeight:800,color:acil?KOR:C.t1,marginTop:6,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em"}}>{fmt(v.kalanTutar)}</div>
              {odenen>0&&<div style={{fontSize:10.5,color:YESIL,fontWeight:600,marginTop:2}}>✓ {fmt(odenen)} {T.alindiL}</div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <span style={{fontSize:10,fontWeight:800,color:et.renk,background:et.bg,borderRadius:20,padding:"3px 9px",display:"inline-block",whiteSpace:"nowrap"}}>{et.metin}</span>
              {!v.pesin&&<div style={{fontSize:10,color:C.t3,marginTop:5}}>Vade {kisaTarih(v.vade)}</div>}
            </div>
          </div>
          {odenen>0&&<div style={{background:C.bg,borderRadius:3,height:5,marginTop:9,overflow:"hidden"}}>
            <div style={{width:`${Math.min(odenen/j.tutar*100,100)}%`,background:YESIL,height:"100%"}}/>
          </div>}
          <div style={{display:"flex",gap:8,marginTop:11}}>
            <button onClick={()=>onTahsil(j.id)} style={{flex:1,background:acil?KOR:P,border:"none",borderRadius:11,padding:"10px 0",color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>💰 {T.tahsilEt}</button>
            {j.musteriTelefon&&<button onClick={()=>{
              const mesaj=encodeURIComponent(`Merhaba ${j.musteri}, "${j.baslik}" işi için ${fmt(v.kalanTutar)} tutarındaki ödemenin son tarihi ${kisaTarih(v.vade)}. İyi çalışmalar.`);
              window.open("https://wa.me/9"+String(j.musteriTelefon).replace(/\D/g,"")+"?text="+mesaj,"_blank");
            }} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:11,padding:"10px 14px",color:C.t2,fontSize:12.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>💬 Hatırlat</button>}
          </div>
        </div>;
      })}</>}
    {goster.includes("t")&&<><div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"14px 4px 8px"}}>{T.tahsilEdilen.toUpperCase()}</div>
      {tahsilE.map(j=><Sh key={j.id} s={{padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{j.musteri}</div><div style={{fontSize:11,color:C.t3}}>{j.baslik} · {j.tarih}</div></div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:14,fontWeight:800,color:C.green}}>✓ {fmt(j.tutar)}</span>
          <button onClick={()=>{if(window.confirm(j.musteri+" — "+fmt(j.tutar)+"\n"+(T.tahsilatSilOnay||"Bu tahsilat kaydı silinsin mi? Bu işlem geri alınamaz.")))onSil&&onSil(j.id);}} title="Sil" style={{background:C.redBg,border:"none",borderRadius:9,width:30,height:30,color:C.red,fontSize:14,fontWeight:700,cursor:"pointer",flexShrink:0}}>🗑</button>
        </div>
      </Sh>)}</>}
  </div>;
}

function MusteriDetayModal({musteri,onKapat,T,onSil,giderler,onYeniIs,onGider,isletme}){
  const [silOnay,setSilOnay]=useState(false);
  const navGit=(adres)=>{
    const q=encodeURIComponent(adres);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`,"_blank");
  };
  const toplamIs=musteri.isler.length;
  const tamamlandi=musteri.isler.filter(j=>j.durum==="tamamlandi");
  const bekliyor=musteri.isler.filter(j=>j.durum==="bekliyor");
  const aktif=musteri.isler.filter(j=>j.durum==="aktif");
  const toplamCiro=musteri.isler.reduce((s,j)=>s+j.tutar,0);
  const tahsilEdilen=tamamlandi.reduce((s,j)=>s+j.tutar,0);

  // Bu müşterinin işlerine bağlı toplam gider
  const musteriIsIdleri=musteri.isler.map(j=>j.id);
  const musteriGiderleri=(giderler||[]).filter(g=>musteriIsIdleri.includes(g.isId));
  const toplamGider=musteriGiderleri.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamCiro-toplamGider;
  const karMarji=toplamCiro>0?Math.round(netKar/toplamCiro*100):0;

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    {/* Başlık */}
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
      <div style={{width:54,height:54,borderRadius:16,background:`linear-gradient(135deg,${P},#2E7490)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff",flexShrink:0}}>{musteri.ad[0]}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:19,fontWeight:800,color:C.t1}}>{musteri.ad||T.isimsizMusteri}</div>
        {musteri.telefon&&<div style={{fontSize:12,color:C.t2,marginTop:2}}>📞 {musteri.telefon}</div>}
        {musteri.email&&<div style={{fontSize:12,color:C.t2}}>✉️ {musteri.email}</div>}
      </div>
    </div>

    {/* Adresler — Google Maps butonlu */}
    {musteri.adresler&&musteri.adresler.length>0&&<>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.isAdresleriB}</div>
      <Sh s={{marginBottom:16,overflow:"hidden"}}>
        {musteri.adresler.map((adres,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<musteri.adresler.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:36,height:36,borderRadius:10,background:C.blueBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📍</div>
          <div style={{flex:1,minWidth:0}}>
            {adres.etiket&&<div style={{fontSize:10,fontWeight:700,color:P,marginBottom:2}}>{adres.etiket.toUpperCase()}</div>}
            <div style={{fontSize:13,color:C.t1,lineHeight:1.4}}>{adres.adres}</div>
          </div>
          <button onClick={()=>navGit(adres.adres)} style={{background:C.blue,border:"none",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:16}}>🗺️</span>
            <span>{T.gitL}</span>
          </button>
        </div>)}
      </Sh>
    </>}

    {/* İstatistik kartları */}
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[{l:T.toplamCiro,v:fmt(toplamCiro),c:P,bg:C.purpleBg,icon:"💼"},
        {l:T.tahsilEdilen,v:fmt(tahsilEdilen),c:C.green,bg:C.greenBg,icon:"✅"},
        {l:T.tumIsAkislari.split(" ")[1]||"İş",v:toplamIs,c:C.blue,bg:C.blueBg,icon:"📋"}].map(x=><div key={x.l} style={{flex:1,background:x.bg,borderRadius:14,padding:"12px 8px",textAlign:"center"}}>
        <div style={{fontSize:18,marginBottom:4}}>{x.icon}</div>
        <div style={{fontSize:x.v.toString().length>8?10:13,fontWeight:900,color:x.c}}>{x.v}</div>
        <div style={{fontSize:9,color:x.c,opacity:0.8,marginTop:2}}>{x.l}</div>
      </div>)}
    </div>

    {/* 🏅 Ödeme Skoru */}
    {(()=>{const sk=musteriSkor(musteri.isler);return <Sh s={{padding:"13px 15px",marginBottom:14,borderLeft:`3px solid ${sk.renk}`,display:"flex",alignItems:"center",gap:12}}>
      <span style={{fontSize:26}}>{sk.emoji}</span>
      <div style={{flex:1}}>
        <div style={{fontSize:13,fontWeight:800,color:sk.renk}}>{(T.odemeSkoru||"Ödeme Skoru")+": "}{sk.ad}{sk.puan!==null?" — %"+sk.puan:""}</div>
        <div style={{fontSize:11,color:C.t2,marginTop:2}}>{sk.aciklama}</div>
      </div>
    </Sh>;})()}
    {/* Hızlı İşlemler */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>onYeniIs&&onYeniIs(musteri.ad)} style={{flex:1,background:C.greenBg,border:"none",borderRadius:12,padding:"12px 0",color:C.green,fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{T.yeniIsAc}</button>
      <button onClick={()=>onGider&&onGider(musteri.ad)} style={{flex:1,background:C.redBg,border:"none",borderRadius:12,padding:"12px 0",color:C.red,fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{T.giderEkleBtn}</button>
    </div>
    <button onClick={()=>musteriPdf(musteri,giderler,isletme)} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:"14px 0",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:14}}>{T.musteriPdfBtn||"📄 PDF Raporu — WhatsApp'ta Paylaş / İndir"}</button>

    {/* 🧰 Kullanılan Malzemeler (tüm işlerden — tamamlananlar dahil) */}
    {musteri.isler.some(j=>j.malzemeler)&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.malzemelerL||"🧰 Kullanılan Malzemeler"}</div>
      <Sh s={{padding:"4px 14px"}}>
        {musteri.isler.filter(j=>j.malzemeler).map(j=><div key={j.id} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>{j.icon} {j.baslik}</span>
            <span style={{fontSize:10,fontWeight:700,color:j.durum==="tamamlandi"?C.green:j.durum==="aktif"?C.blue:C.amber}}>{j.durum==="tamamlandi"?"✓ Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede"} · {j.tarih}</span>
          </div>
          <div style={{fontSize:12,color:C.t2,whiteSpace:"pre-wrap",lineHeight:1.6}}>{j.malzemeler}</div>
        </div>)}
      </Sh>
    </div>}

    {/* Kâr / Zarar Analizi */}
    {toplamGider>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>📊 {T.karZararAnalizi}</div>
      <Sh s={{padding:16}}>
        {[
          ["💰 "+T.toplamCiro,fmt(toplamCiro),C.t1],
          ["💸 "+T.toplamGider,"-"+fmt(toplamGider),C.red],
          [netKar>=0?"✅ "+T.netKar:"⚠️ "+T.netZarar,fmt(Math.abs(netKar)),netKar>=0?C.green:C.red],
        ].map(([l,v,c])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.t2}}>{l}</span>
          <span style={{fontSize:13,fontWeight:700,color:c}}>{v}</span>
        </div>)}
        {/* Marj çubuğu */}
        <div style={{marginTop:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:10,color:C.t3}}>{T.marjL}</span>
            <span style={{fontSize:11,fontWeight:800,color:netKar>=0?C.green:C.red}}>%{karMarji}</span>
          </div>
          <div style={{background:C.border,borderRadius:4,height:8,overflow:"hidden"}}>
            <div style={{width:`${Math.min(Math.max(karMarji,0),100)}%`,background:karMarji>=15?C.green:karMarji>=0?C.amber:C.red,height:"100%",borderRadius:4}}/>
          </div>
        </div>
        {/* Gider detayı */}
        {musteriGiderleri.length>0&&<div style={{marginTop:10}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:6}}>{T.giderKalemleri}</div>
          {musteriGiderleri.map(g=><div key={g.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.t2,padding:"3px 0"}}>
            <span>· {g.ad} <span style={{color:C.t3}}>({g.kategori})</span></span>
            <span style={{color:C.red,fontWeight:600}}>-{fmt(g.tutar)}</span>
          </div>)}
        </div>}
      </Sh>
    </div>}

    {/* İş listesi */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.isGecmisiB}</div>
    <Sh s={{marginBottom:16,overflow:"hidden"}}>
      {musteri.isler.length===0
        ?<div style={{padding:20,textAlign:"center",color:C.t3,fontSize:13}}>{T.isKaydiYok}</div>
        :musteri.isler.map((j,i)=>{
          const renk=j.durum==="tamamlandi"?C.green:j.durum==="bekliyor"?C.amber:C.blue;
          return <div key={j.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<musteri.isler.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:10,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:10,color:C.t3}}>{j.tarih}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:13,fontWeight:800,color:renk}}>{fmt(j.tutar)}</div>
              <div style={{fontSize:10,color:renk,marginTop:1}}>{DURUM[j.durum]?.label||j.durum}</div>
            </div>
          </div>;
        })}
    </Sh>

    {/* Hızlı iletişim */}
    <div style={{display:"flex",gap:8,marginBottom:4}}>
      {musteri.telefon&&<button onClick={()=>window.open("tel:"+musteri.telefon)} style={{flex:1,background:C.greenBg,border:"none",borderRadius:12,padding:"12px 0",color:C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>📞 {T.araL}</button>}
      {musteri.telefon&&<button onClick={()=>window.open("https://wa.me/90"+musteri.telefon.replace(/\D/g,"").slice(-10),"_blank")} style={{flex:1,background:"#DCF8C6",border:"none",borderRadius:12,padding:"12px 0",color:"#128C7E",fontSize:13,fontWeight:700,cursor:"pointer"}}>💬 WhatsApp</button>}
      {musteri.email&&<button onClick={()=>window.open("mailto:"+musteri.email)} style={{flex:1,background:C.blueBg,border:"none",borderRadius:12,padding:"12px 0",color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer"}}>✉️ Mail</button>}
    </div>
    {(!musteri.telefon&&!musteri.email)&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"8px 0 4px"}}>{T.iletisimYok}</div>}

    {/* Müşteri Sil */}
    <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:14}}>
      {!silOnay
        ?<button onClick={()=>setSilOnay(true)} style={{width:"100%",background:C.redBg,border:"none",borderRadius:12,padding:13,color:C.red,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          🗑️ {T.musteriyiSil}
        </button>
        :<div style={{background:C.redBg,borderRadius:14,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:6,textAlign:"center"}}>
            ⚠️ {musteri.ad} {T.silinecekK}
          </div>
          {musteri.isler.length>0&&<div style={{fontSize:11,color:C.red,textAlign:"center",marginBottom:10}}>
            {T.aitIsUyariOn} {musteri.isler.length} {T.aitIsUyariSon}
          </div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSilOnay(false)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:11,color:C.t2,fontSize:13,fontWeight:600,cursor:"pointer"}}>{T.iptal}</button>
            <button onClick={()=>{onSil(musteri.ad);onKapat();}} style={{flex:2,background:C.red,border:"none",borderRadius:10,padding:11,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.evetSil}</button>
          </div>
        </div>}
    </div>
  </BottomSheet>;
}

function MusterilerTab({jobs,T,musteriKayitlari,onMusteriEkle,onMusteriSil,onKayitSil,giderler,onYeniIsIcin,onGiderIcin,isletme}){
  const [altSekme,setAltSekme]=useState("guncel"); // guncel | kayit
  const [secili,setSecili]=useState(null);
  const [arama,setArama]=useState("");
  const [siralama,setSiralama]=useState("ciro"); // ciro | isler | ad
  const [yeniAc,setYeniAc]=useState(false);
  const [yeniForm,setYeniForm]=useState({ad:"",telefon:"",email:"",adres:""});

  // Müşteri verilerini topla — iş adresini de dahil et
  const musteriler={};
  // Önce bağımsız kayıtlı müşteriler
  (musteriKayitlari||[]).forEach(m=>{
    musteriler[m.ad]={ad:m.ad,isler:[],telefon:m.telefon||"",email:m.email||"",adresler:m.adres?[{etiket:"Kayıtlı Adres",adres:m.adres}]:[]};
  });
  jobs.forEach(j=>{
    if(!musteriler[j.musteri]) musteriler[j.musteri]={
      ad:j.musteri,
      isler:[],
      telefon:j.musteriTelefon||"",
      email:j.musteriEmail||"",
      adresler:j.isAdresi?[{etiket:"İş Adresi",adres:j.isAdresi}]:[],
    };
    musteriler[j.musteri].isler.push(j);
    if(j.musteriTelefon&&!musteriler[j.musteri].telefon)musteriler[j.musteri].telefon=j.musteriTelefon;
    if(j.musteriEmail&&!musteriler[j.musteri].email)musteriler[j.musteri].email=j.musteriEmail;
    // Birden fazla adres varsa ekle
    if(j.isAdresi&&!musteriler[j.musteri].adresler.some(a=>a.adres===j.isAdresi)){
      musteriler[j.musteri].adresler.push({etiket:`İş: ${j.ref}`,adres:j.isAdresi});
    }
  });

  const kaydetYeni=()=>{
    if(!yeniForm.ad.trim())return;
    onMusteriEkle(yeniForm);
    setYeniForm({ad:"",telefon:"",email:"",adres:""});
    setYeniAc(false);
  };

  const liste=Object.values(musteriler)
    .filter(m=>!arama||m.ad.toLowerCase().includes(arama.toLowerCase()))
    .sort((a,b)=>{
      if(siralama==="ciro") return b.isler.reduce((s,j)=>s+j.tutar,0)-a.isler.reduce((s,j)=>s+j.tutar,0);
      if(siralama==="isler") return b.isler.length-a.isler.length;
      return a.ad.localeCompare(b.ad,"tr");
    });

  const navGit=(adres)=>{
    const q=encodeURIComponent(adres);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`,"_blank");
  };

  const toplamCiro=liste.reduce((s,m)=>s+m.isler.reduce((ss,j)=>ss+j.tutar,0),0);

  // Güncel = işi olan müşteriler; Kayıtlar = bağımsız kayıtlı müşteriler
  const guncelListe=liste.filter(m=>m.isler.length>0);
  const kayitListe=(musteriKayitlari||[]);

  return <div style={{padding:"16px 14px"}}>
    {/* Alt sekme değiştirici */}
    <div style={{display:"flex",gap:6,marginBottom:14,background:C.card,borderRadius:14,padding:5,boxShadow:C.sh}}>
      {[["guncel","📊 "+T.guncelMusterilerT+" ("+guncelListe.length+")"],["kayit","👤 "+T.musteriKayitT+" ("+kayitListe.length+")"]].map(([v,l])=>
        <button key={v} onClick={()=>setAltSekme(v)} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:altSekme===v?P:"transparent",color:altSekme===v?"#fff":C.t2,fontSize:12.5,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>{l}</button>)}
    </div>

    {altSekme==="kayit"?<>
    {/* ══ MÜŞTERİ KAYIT SEKMESİ ══ */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:15,fontWeight:700,color:C.t1}}>{T.kayitliMusteriler}</div>
      <button onClick={()=>setYeniAc(true)} style={{background:P,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.yeniKayit}</button>
    </div>
    {yeniAc&&<Sh s={{padding:16,marginBottom:12,border:`2px solid ${P}44`}}>
      <div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:12}}>👤 {T.yeniMusteri}</div>
      <input value={yeniForm.ad} onChange={e=>setYeniForm(f=>({...f,ad:e.target.value}))} placeholder={T.adSoyadPh} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:8}}/>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input value={yeniForm.telefon} onChange={e=>setYeniForm(f=>({...f,telefon:e.target.value}))} placeholder={T.telefonL} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
        <input value={yeniForm.email} onChange={e=>setYeniForm(f=>({...f,email:e.target.value}))} placeholder={T.epostaL} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
      </div>
      <input value={yeniForm.adres} onChange={e=>setYeniForm(f=>({...f,adres:e.target.value}))} placeholder={T.adresNavPh} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:10}}/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setYeniAc(false)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 0",color:C.t2,fontSize:13,fontWeight:600,cursor:"pointer"}}>{T.vazgec}</button>
        <button onClick={kaydetYeni} style={{flex:2,background:P,border:"none",borderRadius:10,padding:"10px 0",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Kaydet</button>
      </div>
    </Sh>}
    {kayitListe.length===0&&!yeniAc&&<Sh s={{padding:30,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:8}}>📇</div>
      <div style={{fontSize:13,color:C.t2}}>{T.kayitYok}</div>
      <div style={{fontSize:11,color:C.t3,marginTop:4}}>{T.kayitYokSub}</div>
    </Sh>}
    {kayitListe.map(m=>{
      const musteriIsleri=jobs.filter(j=>j.musteri===m.ad);
      const isSayi=musteriIsleri.length;
      const ciro=musteriIsleri.reduce((s,j)=>s+j.tutar,0);
      return <Sh key={m.ad} s={{padding:"13px 16px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:12,background:C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:P,flexShrink:0}}>{(m.ad&&m.ad[0])||"?"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{m.ad}</div>
            <div style={{fontSize:11,color:C.t3}}>{m.telefon||T.telYok} {m.email?"· "+m.email:""}</div>
            {isSayi>0&&<div style={{fontSize:10,color:P,fontWeight:600,marginTop:2}}>📋 {isSayi} {T.isKaydiVar} · <span style={{color:C.green}}>{fmt(ciro)}</span></div>}
          </div>
          <button onClick={()=>onYeniIsIcin&&onYeniIsIcin(m.ad)} title="Bu müşteriye iş aç" style={{background:C.greenBg,border:"none",borderRadius:9,padding:"8px 11px",color:C.green,fontSize:11,fontWeight:700,cursor:"pointer"}}>+ İş</button>
          <button onClick={()=>onKayitSil&&onKayitSil(m.ad)} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer"}}>×</button>
        </div>
      </Sh>;
    })}
    </>:<>
    {/* ══ GÜNCEL MÜŞTERİLER SEKMESİ ══ */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:15,fontWeight:700,color:C.t1}}>{T.aktifMusteriDurumu}</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <select value={siralama} onChange={e=>setSiralama(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",color:C.t2,fontSize:11,cursor:"pointer",outline:"none"}}>
          <option value="ciro">↓ {T.ciroL}</option>
          <option value="isler">↓ {T.isSayisi}</option>
          <option value="ad">A-Z</option>
        </select>
      </div>
    </div>

    {/* Toplam ciro özet */}
    {liste.length>0&&<Sh s={{padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:C.t2}}>{T.toplamCiro}</span>
      <span style={{fontSize:15,fontWeight:800,color:P}}>{fmt(toplamCiro)}</span>
    </Sh>}

    {/* Arama */}
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder={T.aramaPh}
      style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:12,boxShadow:C.sh}}/>

    {guncelListe.length===0&&<Sh s={{padding:36,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>👥</div>
      <div style={{fontSize:14,color:C.t2}}>{T.musteriler} - henüz yok</div>
      <div style={{fontSize:12,color:C.t3,marginTop:4}}>{T.sonIsAkislari}</div>
    </Sh>}

    {guncelListe.map((m,i)=>{
      const ciro=m.isler.reduce((s,j)=>s+j.tutar,0);
      const tamamlandi=m.isler.filter(j=>j.durum==="tamamlandi").length;
      // Finansal özet
      const isIdler=m.isler.map(j=>j.id);
      const mGider=(giderler||[]).filter(g=>isIdler.includes(g.isId)).reduce((s,g)=>s+g.tutar,0);
      const tahsilE=m.isler.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
      const bekleyenT=m.isler.filter(j=>j.durum!=="tamamlandi").reduce((s,j)=>s+j.tutar,0);
      const mKar=ciro-mGider;
      const adresVarMi=m.adresler.length>0;
      const ilkAdres=m.adresler[0];
      const skor=musteriSkor(m.isler);

      return <Sh key={m.ad} onClick={()=>setSecili(m)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
          {/* Avatar */}
          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${P}CC,#2E7490)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#fff",flexShrink:0,position:"relative"}}>
            {(m.ad&&m.ad[0])||"?"}
            {i===0&&<div style={{position:"absolute",top:-6,right:-6,fontSize:14}}>👑</div>}
          </div>

          {/* Bilgiler */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
              <div style={{fontSize:14,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{m.ad||T.isimsizK} <span title={skor.aciklama} style={{fontSize:10,fontWeight:800,color:skor.renk,background:skor.renk+"18",borderRadius:8,padding:"2px 7px",marginLeft:4,whiteSpace:"nowrap"}}>{skor.emoji} {skor.ad}</span></div>
              <div style={{fontSize:15,fontWeight:800,color:C.green,flexShrink:0,marginLeft:8}}>{fmt(ciro)}</div>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:adresVarMi?8:0,flexWrap:"wrap"}}>
              <span style={{fontSize:10,background:C.purpleBg,color:P,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{m.isler.length} iş</span>
              {tamamlandi>0&&<span style={{fontSize:10,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:20,fontWeight:600}}>✅ {tamamlandi} tamamlandı</span>}
              {m.isler.some(j=>j.durum==="bekliyor")&&<span style={{fontSize:10,background:C.amberBg,color:C.amber,padding:"2px 8px",borderRadius:20,fontWeight:600}}>⏰ bekleyen var</span>}
            </div>

            {/* Finansal özet satırı */}
            <div style={{display:"flex",gap:10,marginTop:6,marginBottom:adresVarMi?8:0,fontSize:10.5,flexWrap:"wrap"}}>
              {bekleyenT>0&&<span style={{color:C.amber,fontWeight:700}}>⏳ {T.bekleyen}: {fmt(bekleyenT)}</span>}
              {tahsilE>0&&<span style={{color:C.green,fontWeight:700}}>✅ {T.tahsilKisa}: {fmt(tahsilE)}</span>}
              {mGider>0&&<span style={{color:C.red,fontWeight:700}}>💸 {T.giderKisa}: {fmt(mGider)}</span>}
              {mGider>0&&<span style={{color:mKar>=0?C.green:C.red,fontWeight:800}}>{mKar>=0?"📈 "+T.karKisa:"📉 "+T.zararKisa}: {fmt(Math.abs(mKar))}</span>}
            </div>

            {/* Adres satırı — sağda navigasyon butonu */}
            {adresVarMi&&<div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,borderRadius:10,padding:"7px 10px"}} onClick={e=>e.stopPropagation()}>
              <span style={{fontSize:14}}>📍</span>
              <span style={{fontSize:11,color:C.t2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ilkAdres.adres}</span>
              <button onClick={e=>{e.stopPropagation();navGit(ilkAdres.adres);}} style={{background:C.blue,border:"none",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",gap:4}}>
                🗺️ {T.gitL}
              </button>
            </div>}
          </div>
        </div>
      </Sh>;
    })}

    </>}

    {/* Detay modal */}
    {secili&&<MusteriDetayModal musteri={secili} onKapat={()=>setSecili(null)} T={T} onSil={(ad)=>{onMusteriSil&&onMusteriSil(ad);setSecili(null);}} giderler={giderler} isletme={isletme} onYeniIs={(ad)=>{setSecili(null);onYeniIsIcin&&onYeniIsIcin(ad);}} onGider={(ad)=>{setSecili(null);onGiderIcin&&onGiderIcin(ad);}}/>}
  </div>;
}

function TekliflerTab({teklifler,onYeni,onDonustur,onSil,onDurumDegis,T,isletme}){
  const [filtre,setFiltre]=useState("hepsi"); // hepsi | bekliyor | onaylandi | reddedildi
  const [arama,setArama]=useState("");
  const [siralama,setSiralama]=useState("tarih"); // tarih | tutar | musteri

  const DURUM_TEKLIF={
    bekliyor:{label:T.beklemede,color:C.amber,bg:C.amberBg,icon:"⏳"},
    onaylandi:{label:T.onaylandiL,color:C.green,bg:C.greenBg,icon:"✅"},
    reddedildi:{label:T.reddedildiL,color:C.red,bg:C.redBg,icon:"❌"},
    suresi_doldu:{label:T.suresiDoldu,color:C.t3,bg:C.bg,icon:"⌛"},
  };

  const bugun=new Date().toISOString().slice(0,10);
  const listele=teklifler
    .map(t=>({...t,durum_t:t.durum_t||(t.gecerlilik<bugun?"suresi_doldu":"bekliyor")}))
    .filter(t=>filtre==="hepsi"||t.durum_t===filtre)
    .filter(t=>!arama||t.musteri.toLowerCase().includes(arama.toLowerCase())||t.baslik.toLowerCase().includes(arama.toLowerCase()))
    .sort((a,b)=>siralama==="tutar"?b.tutar-a.tutar:siralama==="musteri"?a.musteri.localeCompare(b.musteri):b.id-a.id);

  const toplamTutar=teklifler.reduce((s,t)=>s+t.tutar,0);
  const onayT=teklifler.filter(t=>(t.durum_t||"bekliyor")==="onaylandi").reduce((s,t)=>s+t.tutar,0);
  const bekleyenT=teklifler.filter(t=>!(t.durum_t)||(t.durum_t)==="bekliyor").reduce((s,t)=>s+t.tutar,0);
  const donusumOran=teklifler.length>0?Math.round(teklifler.filter(t=>(t.durum_t||"bekliyor")==="onaylandi").length/teklifler.length*100):0;

  const filtreler=[
    {key:"hepsi",label:T.tumunuGoruntule.split(" ")[0],n:teklifler.length},
    {key:"bekliyor",label:"Bekliyor",n:teklifler.filter(t=>!(t.durum_t)||(t.durum_t)==="bekliyor").length},
    {key:"onaylandi",label:T.tamamlandi,n:teklifler.filter(t=>(t.durum_t||"")==="onaylandi").length},
    {key:"reddedildi",label:"Reddedildi",n:teklifler.filter(t=>(t.durum_t||"")==="reddedildi").length},
  ];

  return <div style={{padding:"16px 14px"}}>
    {/* Başlık */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>Teklifler</div>
      <button onClick={onYeni} style={{background:P,border:"none",borderRadius:12,padding:"9px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+   {T.yeniTeklif}</button>
    </div>

    {/* Özet kartlar */}
    {teklifler.length>0&&<div style={{display:"flex",gap:8,marginBottom:14}}>
      <Sh s={{flex:1,padding:"12px 10px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.t3,marginBottom:3}}>{T.toplam}</div>
        <div style={{fontSize:13,fontWeight:800,color:P}}>{fmt(toplamTutar)}</div>
      </Sh>
      <Sh s={{flex:1,padding:"12px 10px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.t3,marginBottom:3}}>Onaylanan</div>
        <div style={{fontSize:13,fontWeight:800,color:C.green}}>{fmt(onayT)}</div>
      </Sh>
      <Sh s={{flex:1,padding:"12px 10px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.t3,marginBottom:3}}>{T.donusum}</div>
        <div style={{fontSize:13,fontWeight:800,color:donusumOran>50?C.green:C.amber}}>%{donusumOran}</div>
      </Sh>
    </div>}

    {/* Arama */}
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍 Müşteri veya iş ara..."
      style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:10,boxShadow:C.sh}}/>

    {/* Filtre + Sıralama */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
        {filtreler.map(f=><button key={f.key} onClick={()=>setFiltre(f.key)} style={{padding:"5px 11px",borderRadius:20,border:"none",background:filtre===f.key?P:C.card,color:filtre===f.key?"#fff":C.t2,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",boxShadow:filtre===f.key?`0 2px 8px ${P}44`:C.sh}}>
          {f.label} {f.n>0&&<span style={{opacity:0.7}}>({f.n})</span>}
        </button>)}
      </div>
      <select value={siralama} onChange={e=>setSiralama(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 8px",color:C.t2,fontSize:11,cursor:"pointer",outline:"none",marginLeft:8,flexShrink:0}}>
        <option value="tarih">↓ Tarih</option>
        <option value="tutar">↓ Tutar</option>
        <option value="musteri">A-Z</option>
      </select>
    </div>

    {/* Boş durum */}
    {teklifler.length===0&&<Sh s={{padding:36,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>🏷️</div>
      <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>{T.henuzTeklifYok}</div>
      <div style={{fontSize:12,color:C.t3,marginBottom:16}}>{T.teklifBilgi}</div>
      <button onClick={onYeni} style={{background:P,border:"none",borderRadius:12,padding:"11px 22px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.ilkTeklif}</button>
    </Sh>}

    {listele.length===0&&teklifler.length>0&&<div style={{textAlign:"center",padding:30,color:C.t3,fontSize:13}}>{T.filtreEslesmedi}</div>}

    {/* Teklif kartları */}
    {listele.map(t=>{
      const ds=DURUM_TEKLIF[t.durum_t||"bekliyor"]||DURUM_TEKLIF.bekliyor;
      const gecerlimi=t.gecerlilik>=bugun;
      const kalanGun=Math.ceil((new Date(t.gecerlilik)-new Date())/864e5);
      return <Sh key={t.id} s={{padding:"16px 18px",marginBottom:10}}>
        {/* Üst satır */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{fontSize:22,fontWeight:900,color:P,letterSpacing:"-0.03em"}}>{fmt(t.tutar)}</div>
              <span style={{fontSize:11,color:ds.color,background:ds.bg,borderRadius:20,padding:"3px 9px",fontWeight:700,whiteSpace:"nowrap"}}>{ds.icon} {ds.label}</span>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.musteri}</div>
            <div style={{fontSize:12,color:C.t2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.baslik}</div>
            {t.maliyet>0&&<TeklifMarjRozeti tutar={t.tutar} maliyet={t.maliyet}/>}
          </div>
        </div>

        {/* Geçerlilik göstergesi */}
        <div style={{background:C.bg,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13}}>{gecerlimi?"📅":"⌛"}</span>
            <span style={{fontSize:11,color:C.t2}}>Geçerlilik: <b style={{color:gecerlimi&&kalanGun<=3?C.amber:C.t1}}>{t.gecerlilik}</b></span>
          </div>
          {gecerlimi
            ?<span style={{fontSize:11,fontWeight:700,color:kalanGun<=3?C.amber:C.green}}>{kalanGun} {T.gunL}</span>
            :<span style={{fontSize:11,fontWeight:700,color:C.red}}>{T.suresiDoldu}</span>}
        </div>

        {/* Durum butonları */}
        {(t.durum_t||"bekliyor")==="bekliyor"&&<div style={{display:"flex",gap:6,marginBottom:8}}>
          <button onClick={()=>onDurumDegis&&onDurumDegis(t.id,"onaylandi")} style={{flex:1,background:C.greenBg,border:`1px solid ${C.green}33`,borderRadius:9,padding:"8px 0",color:C.green,fontSize:11,fontWeight:700,cursor:"pointer"}}>✅ {T.onayla}</button>
          <button onClick={()=>onDurumDegis&&onDurumDegis(t.id,"reddedildi")} style={{flex:1,background:C.redBg,border:`1px solid ${C.red}33`,borderRadius:9,padding:"8px 0",color:C.red,fontSize:11,fontWeight:700,cursor:"pointer"}}>❌ {T.reddet}</button>
        </div>}

        {/* Alt butonlar */}
        <div style={{display:"flex",gap:6}}>
          {(t.durum_t||"bekliyor")==="onaylandi"&&<button onClick={()=>onDonustur(t)} style={{flex:2,background:C.greenBg,border:"none",borderRadius:10,padding:"10px 0",color:C.green,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 {T.iseDonustur}</button>}
          {(t.durum_t||"bekliyor")==="bekliyor"&&<button onClick={()=>onDonustur(t)} style={{flex:2,background:C.purpleBg,border:"none",borderRadius:10,padding:"10px 0",color:P,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 {T.iseDonustur}</button>}
          {(t.durum_t||"bekliyor")==="reddedildi"&&<div style={{flex:2,textAlign:"center",padding:"10px 0",fontSize:12,color:C.t3}}>{T.reddedildiL}</div>}
          <button onClick={()=>{
            const kal=(t.kalemler||[]);
            const kalMetin=kal.length>0?"\n"+kal.map((k,ki)=>(ki+1)+". "+k.ad+" — "+k.adet+" × "+k.birimFiyat.toLocaleString("tr-TR")+" TL").join("\n")+"\n":"";
            const metin=`🏷️ *${T.teklifBelgesi}*\n\nSayın ${t.musteri},\n\n📋 ${t.baslik}${kalMetin}\n${T.araToplamL}: ${(t.araToplam||t.tutar).toLocaleString("tr-TR")} TL\n${T.kdvL} %${t.kdvOran||20}: ${(t.kdvTutar||0).toLocaleString("tr-TR")} TL\n*${T.genelToplamL}: ${t.tutar.toLocaleString("tr-TR")} TL*\n\n📅 ${T.gecerlilik}: ${t.gecerlilik}\n\nOnayınızı bekliyoruz.`;
            const tel=(t.telefon||"").replace(/\D/g,"").slice(-10);
            window.open("https://wa.me/"+(tel?"90"+tel:"")+"?text="+encodeURIComponent(metin),"_blank");
          }} style={{flex:1,background:C.greenBg,border:"none",borderRadius:10,padding:"10px 0",color:C.green,fontSize:12,fontWeight:600,cursor:"pointer"}}>💬 {T.whatsappGonder}</button>
          <button onClick={()=>teklifPdf(t,isletme,T)} style={{flex:1,background:C.blueBg,border:"none",borderRadius:10,padding:"10px 0",color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer"}}>🖨️ {T.teklifPdfBtn}</button>
          <button onClick={()=>onSil(t.id)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 0",color:C.t3,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.sil}</button>
        </div>
      </Sh>;
    })}

    {/* Toplam bekleyen değer */}
    {bekleyenT>0&&<Sh s={{padding:"12px 16px",marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.amberBg}}>
      <span style={{fontSize:12,color:C.amber,fontWeight:600}}>⏳ {T.bekleyenTeklifT}</span>
      <span style={{fontSize:14,fontWeight:800,color:C.amber}}>{fmt(bekleyenT)}</span>
    </Sh>}
  </div>;
}

function GiderlerTab({giderler,onYeni,onSil,T,jobs}){
  const [filtre,setFiltre]=useState("hepsi"); // hepsi | isli | serbest
  const toplam=giderler.reduce((s,g)=>s+g.tutar,0);
  const katToplam={};giderler.forEach(g=>{katToplam[g.kategori]=(katToplam[g.kategori]||0)+g.tutar;});
  const filtrelenen=filtre==="isli"?giderler.filter(g=>g.isId)
    :filtre==="serbest"?giderler.filter(g=>!g.isId)
    :giderler;
  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.giderler}</div>
      <button onClick={onYeni} style={{background:P,border:"none",borderRadius:12,padding:"9px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ {T.yeniGider}</button>
    </div>
    <Sh s={{padding:16,marginBottom:14,textAlign:"center"}}>
      <div style={{fontSize:11,color:C.t3}}>{T.toplamGider.toUpperCase()}</div>
      <div style={{fontSize:24,fontWeight:900,color:C.red}}>{fmt(toplam)}</div>
      <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>{Object.entries(katToplam).map(([k,v])=><span key={k} style={{fontSize:10,background:C.bg,padding:"4px 10px",borderRadius:8,color:C.t2}}>{k}: {fmt(v)}</span>)}</div>
    </Sh>
    {/* Filtre */}
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["hepsi",T.tumuF],["isli",T.iseBagliF],["serbest",T.serbestF]].map(([v,l])=>
        <button key={v} onClick={()=>setFiltre(v)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:filtre===v?P:C.card,color:filtre===v?"#fff":C.t2,fontSize:12,fontWeight:600,cursor:"pointer",boxShadow:C.sh}}>{l}</button>)}
    </div>
    {filtrelenen.length===0&&<div style={{textAlign:"center",padding:20,color:C.t3,fontSize:13}}>{T.henuzGiderYok}</div>}
    {filtrelenen.map(g=>{
      const baglıIs=g.isId?(jobs||[]).find(j=>j.id===g.isId):null;
      return <Sh key={g.id} s={{padding:"14px 16px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{g.ad}</div>
            <div style={{fontSize:11,color:C.t3}}>{g.kategori} · {g.tarih}</div>
            {baglıIs&&<div style={{fontSize:11,color:P,fontWeight:600,marginTop:3}}>📋 {baglıIs.baslik} · {baglıIs.musteri}</div>}
            {g.isAdi&&!baglıIs&&<div style={{fontSize:11,color:C.t3,marginTop:3}}>📋 {g.isAdi}</div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:14,fontWeight:800,color:C.red}}>-{fmt(g.tutar)}</span>
            <button onClick={()=>onSil(g.id)} style={{background:"none",border:"none",color:C.t3,fontSize:16,cursor:"pointer"}}>×</button>
          </div>
        </div>
      </Sh>;
    })}
  </div>;
}

function RaporlarTab({jobs,giderler,T,ekip}){
  const [donem,setDonem]=useState("tumu"); // buay | gecenay | uc_ay | tumu
  const simdi=new Date();
  const buAyBasi=new Date(simdi.getFullYear(),simdi.getMonth(),1);
  const gecenAyBasi=new Date(simdi.getFullYear(),simdi.getMonth()-1,1);
  const ucAyOnce=new Date(simdi.getFullYear(),simdi.getMonth()-3,1);

  const donemFiltre=(tarihStr)=>{
    if(donem==="tumu")return true;
    const t=new Date(tarihStr);
    if(donem==="buay")return t>=buAyBasi;
    if(donem==="gecenay")return t>=gecenAyBasi&&t<buAyBasi;
    if(donem==="uc_ay")return t>=ucAyOnce;
    return true;
  };
  const fJobs=jobs.filter(j=>donemFiltre(j.tarih));
  const fGiderler=giderler.filter(g=>donemFiltre(g.tarih||new Date().toISOString().slice(0,10)));

  const durumSay=[{name:T.tamamlandi,v:fJobs.filter(j=>j.durum==="tamamlandi").length,color:C.green},{name:T.aktifL,v:fJobs.filter(j=>j.durum==="aktif").length,color:C.blue},{name:T.bekleyen,v:fJobs.filter(j=>j.durum==="bekliyor").length,color:C.amber}];
  const barData=fJobs.slice(0,6).map(j=>({ad:j.musteri.split(" ")[0],tutar:j.tutar}));
  const gelir=fJobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const gider=fGiderler.reduce((s,g)=>s+g.tutar,0);

  // GERÇEK haftalık gelir eğrisi — son 7 günün tamamlanan işlerinden
  const GUN_KISA=["Pz","Pt","Sa","Ça","Pe","Cu","Ct"];
  const son7=Array.from({length:7}).map((_,i)=>{
    const d=new Date(Date.now()-(6-i)*864e5);
    const dStr=d.toISOString().slice(0,10);
    const toplam=jobs.filter(j=>j.durum==="tamamlandi"&&j.tarih===dStr).reduce((s,j)=>s+j.tutar,0);
    return {d:GUN_KISA[d.getDay()],v:toplam};
  });
  const son7Toplam=son7.reduce((s,x)=>s+x.v,0);

  const DONEMLER=[["buay",T.buAyR],["gecenay",T.gecenAy],["uc_ay",T.son3Ay],["tumu",T.tumu]];

  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:12}}>{T.raporlar}</div>

    {/* Dönem seçici */}
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {DONEMLER.map(([v,l])=><button key={v} onClick={()=>setDonem(v)} style={{padding:"7px 14px",borderRadius:20,border:"none",background:donem===v?P:C.card,color:donem===v?"#fff":C.t2,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",boxShadow:donem===v?`0 2px 8px ${P}44`:C.sh}}>{l}</button>)}
    </div>

    <div style={{display:"flex",gap:10,marginBottom:12}}>
      {[[T.isSayisi,fJobs.length,C.statP],[T.gelirL,fmt(gelir),C.statG],[T.giderL,fmt(gider),C.statR]].map(([l,v,c])=><Sh key={l} s={{flex:1,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:C.t3}}>{l}</div><div style={{fontSize:v.toString().length>8?11:16,fontWeight:800,color:c}}>{v}</div></Sh>)}
    </div>

    {/* Net kâr kartı */}
    <Sh s={{padding:"14px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",background:gelir-gider>=0?C.greenBg:C.redBg}}>
      <span style={{fontSize:13,fontWeight:600,color:gelir-gider>=0?C.green:C.red}}>📈 {T.netKar} ({DONEMLER.find(d=>d[0]===donem)?.[1]})</span>
      <span style={{fontSize:17,fontWeight:900,color:gelir-gider>=0?C.green:C.red}}>{fmt(gelir-gider)}</span>
    </Sh>

    {/* 👷 EKİP PERFORMANSI */}
    {ekip&&ekip.length>0&&(()=>{
      const uyeler=[{ad:T.benL,rol:T.patronRol},...ekip].map(u=>{
        const uIsler=fJobs.filter(j=>u.ad===T.benL?!j.atanan:j.atanan===u.ad);
        const tamam=uIsler.filter(j=>j.durum==="tamamlandi");
        const ciro=tamam.reduce((s,j)=>s+j.tutar,0);
        const uIds=uIsler.map(j=>j.id);
        const uGider=giderler.filter(g=>uIds.includes(g.isId)).reduce((s,g)=>s+g.tutar,0);
        return {...u,isSayi:uIsler.length,tamamSayi:tamam.length,ciro,kar:ciro-uGider};
      }).filter(u=>u.isSayi>0).sort((a,b)=>b.kar-a.kar);
      if(uyeler.length===0)return null;
      const maxKar=Math.max(...uyeler.map(u=>Math.abs(u.kar)),1);
      return <Sh s={{padding:16,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:12}}>👷 {T.ekipPerformansi}</div>
        {uyeler.map((u,i)=><div key={u.ad} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>{i===0?"🏆 ":""}{u.ad} <span style={{fontSize:10,color:C.t3,fontWeight:400}}>· {u.tamamSayi}/{u.isSayi} {T.isBirim}</span></span>
            <span style={{fontSize:12,fontWeight:800,color:u.kar>=0?C.green:C.red}}>{fmt(u.kar)} {T.karSuffix}</span>
          </div>
          <div style={{background:C.border,borderRadius:4,height:8,overflow:"hidden"}}>
            <div style={{width:`${Math.min(Math.abs(u.kar)/maxKar*100,100)}%`,background:u.kar>=0?(i===0?C.green:P):C.red,height:"100%",borderRadius:4}}/>
          </div>
        </div>)}
      </Sh>;
    })()}

    {/* GERÇEK son 7 gün gelir eğrisi */}
    <Sh s={{padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{T.son7Gun}</div>
        <span style={{fontSize:12,fontWeight:800,color:C.green}}>{fmt(son7Toplam)}</span>
      </div>
      {son7Toplam===0
        ?<div style={{textAlign:"center",padding:"18px 0",fontSize:12,color:C.t3}}>{T.son7Yok}</div>
        :<ResponsiveContainer width="100%" height={110}><LineChart data={son7}>
          <XAxis dataKey="d" tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false}/>
          <Line type="monotone" dataKey="v" stroke={C.green} strokeWidth={2.5} dot={{r:3,fill:C.green}}/>
          <Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)}/>
        </LineChart></ResponsiveContainer>}
    </Sh>

    <Sh s={{padding:16,marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>{T.isBazli}</div>
      {barData.length===0
        ?<div style={{textAlign:"center",padding:"14px 0",fontSize:12,color:C.t3}}>{T.donemdeIsYok}</div>
        :<ResponsiveContainer width="100%" height={150}><BarChart data={barData}><XAxis dataKey="ad" tick={{fontSize:10,fill:C.t3}} axisLine={false} tickLine={false}/><Bar dataKey="tutar" fill={P} radius={[6,6,0,0]}/><Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)}/></BarChart></ResponsiveContainer>}
    </Sh>
    <Sh s={{padding:16}}>
      <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>{T.durumDagilimi}</div>
      {durumSay.map(d=><div key={d.name} style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:C.t2}}>{d.name}</span><span style={{fontSize:12,fontWeight:700,color:d.color}}>{d.v}</span></div>
        <div style={{background:C.bg,borderRadius:4,height:8}}><div style={{width:`${fJobs.length?d.v/fJobs.length*100:0}%`,background:d.color,height:"100%",borderRadius:4}}/></div>
      </div>)}
    </Sh>
  </div>;
}

function BildirimlerTab({bildirimler,onOkundu,T,onGit}){
  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.bildirimlerT}</div>
      {bildirimler.some(b=>!b.okundu)&&<span onClick={onOkundu} style={{fontSize:12,color:P,fontWeight:600,cursor:"pointer"}}>{T.tumunuOkundu}</span>}
    </div>
    {bildirimler.length===0&&<Sh s={{padding:34,textAlign:"center"}}><div style={{fontSize:40,marginBottom:10}}>🔔</div><div style={{fontSize:14,color:C.t2}}>{T.bosBildirim}</div></Sh>}
    {bildirimler.map(b=><Sh key={b.id} onClick={()=>b.hedef&&onGit&&onGit(b)} s={{padding:"14px 16px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start",opacity:b.okundu?0.6:1,cursor:b.hedef?"pointer":"default"}}>
      <div style={{width:40,height:40,borderRadius:11,background:b.tip==="hatirlatma"?C.amberBg:b.tip==="fatura"?C.blueBg:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{b.tip==="hatirlatma"?"⏰":b.tip==="fatura"?"🧾":"✅"}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{b.baslik}</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>{b.mesaj}</div><div style={{fontSize:10,color:C.t3,marginTop:4}}>{b.zaman}{b.hedef?" · dokun ›":""}</div></div>
      {!b.okundu&&<div style={{width:8,height:8,borderRadius:"50%",background:P,marginTop:6}}/>}
    </Sh>)}
  </div>;
}

function DahaFazlaTab({onAc,onSifirla,onExport,onImport,T,onExcelIs,onExcelGider,onExcelFatura,onPdf,onExcelMuhasebe}){
  const items=[
    {icon:"🤖",label:T.asistan,alt:T.asistanSub,act:()=>onAc("asistan")},
    {icon:"💼",label:"Çek · Senet",alt:"🔐 PIN korumalı",act:()=>onAc("kasa")},
    {icon:"👷",label:T.ekipYonetimi,alt:"Usta ekle, giriş oluştur, iş ata",act:()=>onAc("ekip")},
    {icon:"📅",label:"Takvim",alt:"İşlerini ay görünümünde planla",act:()=>onAc("takvim")},
    {icon:"🗑️",label:"Çöp Kutusu",alt:"Silinenler 30 gün geri alınabilir",act:()=>onAc("cop")},
    {icon:"🌍",label:"Dünya Saatleri",alt:"Şehirlerdeki güncel saatleri gör",act:()=>onAc("dunya")},
    {icon:"🚨",label:"Trafik Radar Kontrol",alt:"İçişleri Bakanlığı resmi radar/kontrol noktası sorgulama",act:()=>window.open("https://www.trafik.gov.tr/iller-arasi-radar-ve-kontrol-noktasi-uygulama-sayilari","_blank")},
    {icon:"🎮",label:"Eğlence Köşesi",alt:"Oyunlarla mola ver — 2048, Yılan, Hafıza, Asmaca",act:()=>onAc("eglence")},
    {icon:"📈",label:"Muhasebe Raporu (PDF)",alt:T.muhasebeyeGonder,act:onExcelMuhasebe},
    {icon:"📊",label:(T.excelIslerL||"İşler").replace(/excel/i,"PDF"),alt:T.muhasebeyeGonder,act:onExcelIs},
    {icon:"💸",label:(T.excelGiderlerL||"Giderler").replace(/excel/i,"PDF"),alt:T.muhasebeyeGonder,act:onExcelGider},
    {icon:"🧾",label:(T.excelFaturalarL||"Faturalar").replace(/excel/i,"PDF"),alt:T.muhasebeyeGonder,act:onExcelFatura},
    {icon:"📤",label:T.disaAktar,alt:"JSON",act:onExport},
    {icon:"📥",label:T.yedekGeriYukle,alt:T.jsonIceAktar,file:true},
    {icon:"❓",label:T.yardimMerkezi,alt:"SSS",act:()=>onAc("yardim")},
    {icon:"📜",label:T.gizlilik,alt:"KVKK",act:()=>onAc("gizlilik")},
    {icon:"⭐",label:T.degerlendir,alt:"★",act:()=>onAc("degerlendir")},
    {icon:"🗑️",label:T.verileriSifirla,alt:"",act:onSifirla,danger:true},
    {icon:"ℹ️",label:T.hakkinda,alt:"v1.0.0",act:null},
  ];
  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.dahaFazla}</div>
    {items.map(x=>x.file
      ?<label key={x.label} style={{display:"block"}}>
        <Sh s={{padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
          <div style={{fontSize:24}}>{x.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.t1}}>{x.label}</div><div style={{fontSize:11,color:C.t3}}>{x.alt}</div></div>
          <span style={{color:C.t3}}>›</span>
        </Sh>
        <input type="file" accept=".json,application/json" onChange={onImport} style={{display:"none"}}/>
      </label>
      :<Sh key={x.label} onClick={x.act||undefined} s={{padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:x.act?"pointer":"default"}}>
      <div style={{fontSize:24}}>{x.icon}</div>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:x.danger?C.red:C.t1}}>{x.label}</div><div style={{fontSize:11,color:C.t3}}>{x.alt}</div></div>
      {x.act&&<span style={{color:C.t3}}>›</span>}
    </Sh>)}
  </div>;
}

// ─── PROFİL ─────────────────────────────────────────────────────
function ProfilSekmesi({jobs,dil,setDil,karanlik,setKaranlik,tema,setTema,plan,denemeKalan,onPlanAc,sesEfekt,setSesEfekt,raporDonemAd,onRaporDonem,ozetSaat,setOzetSaat,para,setPara,kdv,setKdv,vadeGun,setVadeGun,isletme,setIsletme,T,goster,onAc,gibAyar,setGibAyar,gibAcSekme,onGibActemizle,onCikis,kullaniciEmail,onKarne,kilitSure,onKilitAyarla,onYedekAl,onYedekYukle}){
  const [bildirimIzin,setBildirimIzin]=useState(false);
  const [kompaktMod,setKompaktMod]=useState(false);
  const logo=isletme?.logo||null;
  const [modal,setModal]=useState(null); // isletme|kdv|dil|para|gib

  // Fatura'dan yönlendirme — GİB modalını otomatik aç
  useEffect(()=>{
    if(gibAcSekme){
      setModal("gib");
      onGibActemizle&&onGibActemizle();
    }
  },[gibAcSekme]);
  const tamamlanan=jobs.filter(j=>j.durum==="tamamlandi").length;
  const tahsilat=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const aktifIs=jobs.filter(j=>j.durum==="aktif").length;
  const bekleyenIs=jobs.filter(j=>j.durum==="bekliyor").length;
  const logoYukle=(e)=>{const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=(ev)=>{
    // Küçült (max 240px) — bulut kaydını şişirmesin
    const img=new Image();img.onload=()=>{
      const o=Math.min(1,240/Math.max(img.width,img.height));
      const cv=document.createElement("canvas");cv.width=img.width*o;cv.height=img.height*o;
      cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
      setIsletme(p=>({...p,logo:cv.toDataURL("image/png")}));goster("Logo yüklendi ✓ (buluta kaydedildi)");
    };img.src=ev.target.result;
  };r.readAsDataURL(file);};
  const bildirimAc=(v)=>{setBildirimIzin(v);if(v&&typeof Notification!=="undefined"&&Notification.permission==="default"){Notification.requestPermission();}goster(v?"🔔 Bildirimler açık":"Bildirimler kapalı");};
  const Row=({icon,label,value,sub,onClick,toggle,tState,tSet,danger,custom,badge})=>(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:onClick||toggle?"pointer":"default",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontSize:18,width:24,textAlign:"center",flexShrink:0}}>{icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <span style={{fontSize:14,fontWeight:500,color:danger?C.red:C.t1}}>{label}</span>
        {sub&&<div style={{fontSize:10,color:C.t3,marginTop:1}}>{sub}</div>}
      </div>
      {badge&&<span style={{fontSize:10,background:badge==="ok"?C.greenBg:C.amberBg,color:badge==="ok"?C.green:C.amber,padding:"2px 8px",borderRadius:20,fontWeight:700,flexShrink:0}}>{badge==="ok"?T.aktifL:T.beklemede}</span>}
      {custom?custom:toggle?<Toggle on={tState} set={tSet}/>:value?<span style={{fontSize:13,color:C.t3,flexShrink:0}}>{value} ›</span>:<span style={{color:C.t3,flexShrink:0}}>›</span>}
    </div>
  );
  const dilAd=DIL_LISTESI.find(d=>d.code===dil);
  const gibDurum=gibAyar?.entegrator?"ok":null;

  return <div style={{padding:"16px 14px"}}>
    {/* Avatar + karne */}
    <Sh s={{padding:"20px 18px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
        <div style={{position:"relative",flexShrink:0}}>
          {logo?<img src={logo} alt="logo" style={{width:72,height:72,borderRadius:18,objectFit:"cover",border:`3px solid ${P}44`}}/>
            :<div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#1C4E60,#173F4E)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff"}}>{(isletme.yetkili||"EO").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>}
          <label style={{position:"absolute",bottom:-4,right:-4,width:22,height:22,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,cursor:"pointer",border:"2px solid "+C.card}}>
            📷<input type="file" accept="image/*" onChange={logoYukle} style={{display:"none"}}/>
          </label>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:18,fontWeight:800,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isletme.yetkili||"Ad Soyad"}</div>
          <div style={{fontSize:13,color:P,fontWeight:600,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isletme.ad||"İşletme Adı"}</div>
          <div style={{fontSize:11,color:C.t3,marginTop:2}}>{isletme.adres||"Adres"}</div>
        </div>
        <button onClick={()=>setModal("isletme")} style={{background:C.purpleBg,border:`1px solid ${P}33`,borderRadius:10,padding:"7px 12px",color:P,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>Düzenle</button>
      </div>
      {/* İletişim bilgileri */}
      <div style={{background:C.bg,borderRadius:12,padding:12,display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["📞",isletme.telefon||"—"],["✉️",isletme.email||"—"],["🔢",isletme.vergiNo?"VKN: "+isletme.vergiNo:"VKN girilmedi"]].map(([ic,val])=><div key={ic} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.t2}}><span>{ic}</span><span style={{color:C.t1}}>{val}</span></div>)}
      </div>
    </Sh>

    {/* Karne — mor gradient */}
    <Sh s={{padding:"16px 18px",marginBottom:14,background:"linear-gradient(135deg,#1C4E60,#173F4E)"}}>
      <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.75)",letterSpacing:"0.1em",marginBottom:10}}>⭐ {T.buAyinKarnesi}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[{val:tamamlanan,label:T.tamamlandi,icon:"✅",go:"stat-tamamlandi"},{val:fmt(tahsilat),label:T.tahsilat,icon:"💰",go:"stat-tahsil"},{val:aktifIs,label:T.aktifL,icon:"🔄",go:"stat-aktif"},{val:bekleyenIs,label:T.bekleyen,icon:"⏳",go:"stat-bekleyen"}].map(s=><div key={s.label} onClick={()=>onKarne&&onKarne(s.go)} style={{flex:1,background:"rgba(255,255,255,0.14)",borderRadius:10,padding:"10px 4px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.28)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.14)"}>
          <div style={{fontSize:14,marginBottom:2}}>{s.icon}</div>
          <div style={{fontSize:s.val.toString().length>7?10:14,fontWeight:800,color:"#fff"}}>{s.val}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.75)",marginTop:2,lineHeight:1.2}}>{s.label}</div>
        </div>)}
      </div>
      {/* Haftalık hedef çubuğu */}
      <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.8)"}}>{T.haftalikHedef}</span>
          <span style={{fontSize:10,color:"#fff",fontWeight:700}}>{Math.min(tamamlanan,5)}/5 iş</span>
        </div>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:4,height:6}}>
          <div style={{width:`${Math.min(tamamlanan/5*100,100)}%`,background:"linear-gradient(90deg,#34D399,#6EE7B7)",height:"100%",borderRadius:4}}/>
        </div>
      </div>
    </Sh>

    {/* İşletme ayarları */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.isletmeAyarlariB}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="🏢" label={T.isletmeBilgileri} sub={isletme.vergiDairesi||T.vergiDairesiYok} value={isletme.ad} onClick={()=>setModal("isletme")}/>
      <Row icon="🧾" label={T.kdvOrani} sub={T.kdvSub} value={"%"+kdv} onClick={()=>setModal("kdv")}/>
      <Row icon="🧾 GİB" label="e-Fatura / e-Arşiv Entegrasyonu" sub={gibDurum==="ok"?T.gibSubAktif:gibDurum==="bekliyor"?T.gibSubTest:T.gibSubYok} onClick={()=>setModal("gib")} badge={gibDurum}/>
      <Row icon="🖼️" label={T.logoYukle} sub={T.logoSub} custom={<label style={{fontSize:13,color:P,fontWeight:600,cursor:"pointer",flexShrink:0}}>{logo?T.degistir:T.sec} ›<input type="file" accept="image/*" onChange={logoYukle} style={{display:"none"}}/></label>}/>
    </Sh>

    {/* Finans */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.finansB}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="💰" label={T.paraBirimi} sub={kurKaynakAd()} value={para+" ("+fmt(1)+")"} onClick={()=>setModal("para")}/>
      <Row icon="📊" label={T.raporlamaDonemi} sub={T.donemSub||"Raporlar bu döneme göre hesaplanır"} value={raporDonemAd+" ›"} onClick={onRaporDonem}/>
      <Row icon="⏳" label={T.odemeVadesi||"Ödeme vadesi"} sub={vadeGun===0?"Peşin — tahsilat uyarısı çıkmaz":"İş bittikten sonra tanınan süre"} value={(vadeGun===0?"Peşin":vadeGun+" gün")+" ›"} onClick={()=>setModal("vade")}/>
      <Row icon="🏦" label={T.bankaHesabi} sub={isletme?.iban?ibanBicim(isletme.iban):"IBAN ekle — ödeme yönlendirmesi için"} onClick={()=>setModal("banka")}/>
    </Sh>

    {/* Güvenlik & Yedek */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>GÜVENLİK & YEDEK</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="🔒" label="Otomatik Kilit" sub="Hareketsizlikte oturumu kapat" value={(kilitSure>0?kilitSure+" dk":"Kapalı")+" ›"} onClick={()=>setModal("kilit")}/>
      <Row icon="💾" label="Yedek İndir" sub="Tüm verini JSON dosyası olarak kaydet" onClick={onYedekAl}/>
      <Row icon="♻️" label="Yedeği Geri Yükle" sub="Daha önce indirdiğin dosyadan geri dön" onClick={()=>document.getElementById("tfYedekDosya").click()}/>
      <Row icon="🛡️" label="Yasal Uyarı & Sorumluluk" sub="Uygulama neyi yapar, neyi yapmaz" onClick={()=>setModal("yasal")}/>
    </Sh>
    <input id="tfYedekDosya" type="file" accept="application/json,.json" onChange={e=>{const d=e.target.files&&e.target.files[0];e.target.value="";onYedekYukle(d);}} style={{display:"none"}}/>

    {/* Uygulama */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.uygulama}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="🔔" label={T.bildirimlerL} sub={T.bildirimSub} toggle tState={bildirimIzin} tSet={bildirimAc}/>
      <div onClick={onPlanAc} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderTop:`1px solid ${C.border}`,cursor:"pointer",background:plan!=="starter"?C.purpleBg:"transparent"}}>
        <span style={{fontSize:20}}>👑</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{(T.planL||"Plan")+": "}{plan==="elite"?"Elite":plan==="pro"?"Pro":(T.planBaslangic||"Başlangıç")}{plan==="elite"&&<span style={{color:GOLD}}> ✓</span>}</div>
          <div style={{fontSize:11,color:C.t3}}>{isletme?.omurBoyu?(T.omurBoyuMsg||"🎉 Ömür boyu ücretsiz — tüm özellikler açık"):denemeKalan>0?(T.denemeOn||"🎁 Pro denemen")+" — "+denemeKalan+" "+(T.gunKaldi||"gün kaldı"):plan==="starter"?(T.yukseltDokun||"Yükseltmek için dokun"):(T.tumOzellikler||"Tüm özellikler açık")}</div>
        </div>
        <span style={{color:C.t3}}>›</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderTop:`1px solid ${C.border}`}}>
        <span style={{fontSize:20}}>🌙</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:C.t1}}>Gün Sonu Özeti</div>
          <div style={{fontSize:11,color:C.t3}}>{ozetSaat?"Her akşam "+ozetSaat+"'te günün özetini bildirir":"Kapalı — saat seçince açılır"}</div>
        </div>
        <input type="time" value={ozetSaat||""} onChange={e=>setOzetSaat(e.target.value)} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 10px",fontSize:13,color:C.t1,outline:"none"}}/>
        {ozetSaat&&<button onClick={()=>setOzetSaat("")} style={{background:C.redBg,border:"none",borderRadius:9,padding:"7px 9px",fontSize:11,fontWeight:700,color:C.red,cursor:"pointer"}}>Kapat</button>}
      </div>
      <Row icon="🌙" label={T.karanlikMod} sub={T.karanlikSub} toggle tState={karanlik} tSet={setKaranlik}/>
      {/* 🎨 Renk temaları */}
      {!karanlik&&<div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:13,fontWeight:600,color:C.t1,marginBottom:2}}>{T.temaRengi||"🎨 Tema Rengi"}</div>
        <div style={{fontSize:11,color:C.t3,marginBottom:10}}>{T.temaSub||"Uygulamanın zemin rengini seç"}{plan==="starter"&&<span style={{color:GOLD,fontWeight:700}}>{T.temaProNotu||" · 👑 Pro özelliği"}</span>}</div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {TEMA_LISTE.map(([id,ikon,ad,zemin,vurgu])=>{
            const adC=({acik:T.temaAcik,okyanus:T.temaOkyanus,orman:T.temaOrman,gunbatimi:T.temaGunbatimi,lavanta:T.temaLavanta,gul:T.temaGul})[id]||ad;
            const sec=temaCoz(tema)===id;
            return <button key={id} onClick={()=>{if(plan==="starter"){onPlanAc();return;}setTema(id);goster(ikon+" "+adC+" "+(T.temasiEk||"teması"))}} title={adC}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,background:"transparent",border:"none",cursor:"pointer",padding:0}}>
            {/* Damla: üst yarı zemin rengi, alt yarı ana renk — tema tek bakışta anlaşılsın */}
            <span style={{width:46,height:46,borderRadius:"50%",overflow:"hidden",display:"block",position:"relative",
              border:sec?`2.5px solid ${vurgu}`:`1px solid ${C.border}`,
              boxShadow:sec?`0 0 0 3px ${vurgu}26, 0 3px 10px ${vurgu}33`:"0 1px 3px rgba(16,24,40,.10)",
              transform:sec?"scale(1.06)":"none",transition:"transform .16s"}}>
              <span style={{position:"absolute",inset:0,background:zemin}}/>
              <span style={{position:"absolute",left:0,right:0,bottom:0,height:"44%",background:vurgu}}/>
              <span style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,paddingBottom:6}}>{ikon}</span>
              {sec&&<span style={{position:"absolute",right:3,bottom:3,width:15,height:15,borderRadius:"50%",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 1px 3px rgba(0,0,0,.25)"}}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={vurgu} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 13 5 5L20 7"/></svg>
              </span>}
            </span>
            <span style={{fontSize:10,fontWeight:sec?800:600,color:sec?vurgu:C.t3,letterSpacing:"-0.01em"}}>{adC}</span>
          </button>;})}
        </div>
      </div>}
      <Row icon="🔊" label={T.sesEfektleri} sub={T.sesEfektSub} toggle tState={sesEfekt} tSet={setSesEfekt}/>
      <Row icon="📱" label={T.kompaktGorunum} sub={T.kompaktSub} toggle tState={kompaktMod} tSet={setKompaktMod}/>
      <Row icon="🌐" label={T.dil} sub={dilAd?.bolge||""} value={dilAd?dilAd.bayrak+" "+dilAd.ad:dil} onClick={()=>setModal("dil")}/>
    </Sh>

    {/* Pro */}
    <Sh s={{padding:"16px 18px",marginBottom:14,background:"linear-gradient(135deg,#F59E0B,#D97706)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:30}}>⚡</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{T.proYukselt}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:2}}>{T.proSub}</div>
        </div>
        <button onClick={()=>goster(T.yakinda+" ⚡")} style={{background:"#fff",border:"none",borderRadius:10,padding:"8px 14px",color:"#D97706",fontSize:12,fontWeight:800,cursor:"pointer",flexShrink:0}}>₺199/ay</button>
      </div>
    </Sh>

    {/* Destek */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.destek}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      {kullaniciEmail&&kullaniciEmail.toLowerCase()===KURUCU_EMAIL&&<Row icon="👑" label="Kurucu Paneli" sub="Üye sayısı ve plan istatistikleri" onClick={()=>onAc("kurucu")}/>}
      <Row icon="👷" label={T.ekipYonetimi} sub={plan==="elite"?T.ekipSub:(T.eliteOzelligi||"👑 Elite özelliği")} onClick={()=>{if(plan!=="elite"){onPlanAc();return;}onAc("ekip");}}/>
      <Row icon="🤖" label={T.asistan} sub={T.asistanSub} onClick={()=>onAc("asistan")}/>
      {DESTEK_TEL&&<Row icon="💬" label={T.whatsappDestek} sub={"0"+DESTEK_TEL.slice(2,5)+" "+DESTEK_TEL.slice(5,8)+" "+DESTEK_TEL.slice(8,10)+" "+DESTEK_TEL.slice(10)+" — "+DESTEK_SAAT} onClick={()=>window.open("https://wa.me/"+DESTEK_TEL,"_blank")}/>}
      {DESTEK_EMAIL&&<Row icon="✉️" label={T.epostaDestek} sub={DESTEK_EMAIL} onClick={()=>window.open("mailto:"+DESTEK_EMAIL+"?subject=TradeFlow Destek","_blank")}/>}
      <Row icon="❓" label={T.yardimMerkezi} sub={T.sssSub} onClick={()=>onAc("yardim")}/>
      <Row icon="⭐" label={T.degerlendir} sub={T.degerlendirSub} onClick={()=>onAc("degerlendir")}/>
      <Row icon="📜" label={T.gizlilik} sub={T.kvkkSub} onClick={()=>onAc("gizlilik")}/>
    </Sh>

    {/* Hesabım / Güvenlik */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>👤 Hesabım</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="🔑" label="Şifre Değiştir" sub="Hesap güvenliğin için yeni şifre belirle" onClick={()=>setModal("sifre")}/>
    </Sh>

    <Sh s={{marginBottom:18,overflow:"hidden"}}><Row icon="🚪" label={T.cikisYap} sub={kullaniciEmail} danger onClick={onCikis}/></Sh>
    <div style={{textAlign:"center",padding:"8px 0 4px"}}>
      <div style={{fontSize:12,color:C.t3,fontWeight:600}}>TradeFlow Elite v1.0.0</div>
      <div style={{fontSize:10,color:C.t3,marginTop:2}}>© 2026 TradeFlow · Tüm hakları saklıdır</div>
    </div>

    {modal==="sifre"&&<SifreDegistirModal onKapat={()=>setModal(null)}/>}
    {modal==="dil"&&<DilSecimModal secili={dil} onSec={setDil} onKapat={()=>setModal(null)}/>}
    {modal==="vade"&&<SecimModal baslik={(T.odemeVadesi||"Ödeme vadesi")+" — varsayılan"}
      secenekler={[{value:"0",label:"Peşin",icon:"⚡"},{value:"7",label:"7 gün",icon:"⏳"},{value:"15",label:"15 gün",icon:"⏳"},{value:"30",label:"30 gün",icon:"📅"},{value:"45",label:"45 gün",icon:"📅"}]}
      secili={String(vadeGun)} onSec={(v)=>{setVadeGun(Number(v));goster(Number(v)===0?"⚡ Peşin çalışma":"⏳ Ödeme vadesi: "+v+" gün");}} onKapat={()=>setModal(null)}/>}
    {modal==="para"&&<SecimModal baslik={T.paraBirimiB+" · "+kurKaynakAd()} secenekler={[{value:"TL",label:"Türk Lirası",icon:"₺"},{value:"USD",label:"Dolar ($"+KURLAR.USD+" TL)",icon:"$"},{value:"EUR",label:"Euro (€"+KURLAR.EUR+" TL)",icon:"€"}]} secili={para} onSec={(v)=>{setPara(v);goster("Para birimi: "+v);}} onKapat={()=>setModal(null)}/>}
    {modal==="kdv"&&<KdvModal kdv={kdv} onSec={(v)=>{setKdv(v);goster("KDV: %"+v);}} onKapat={()=>setModal(null)}/>}
    {modal==="isletme"&&<IsletmeModal bilgi={isletme} onKaydet={(f)=>{setIsletme(f);goster("Kaydedildi ✓");}} onKapat={()=>setModal(null)}/>}
    {modal==="yasal"&&<YasalEkrani onKapat={()=>setModal(null)}/>}
    {modal==="banka"&&<BankaEkrani onKapat={()=>setModal(null)} isletme={isletme} setIsletme={setIsletme} goster={goster}/>}
    {modal==="kilit"&&<BottomSheet onKapat={()=>setModal(null)}>
      <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:4}}>🔒 Otomatik Kilit</div>
      <div style={{fontSize:12,color:C.t2,marginBottom:16,lineHeight:1.6}}>Uygulamaya belirtilen süre boyunca dokunulmazsa oturum kendiliğinden kapanır. "Kapalı" seçilirse oturum hep açık kalır (önerilen, kişisel cihaz için). Telefonu başkalarıyla paylaşıyorsan bir süre seç.</div>
      {[[0,"Kapalı — hep açık kalsın (önerilen)"],[15,"15 dakika"],[30,"30 dakika"],[60,"1 saat"],[240,"4 saat"]].map(([v,l])=>
        <div key={v} onClick={()=>{onKilitAyarla(v);setModal(null);}} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 4px",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
          <span style={{fontSize:14,color:C.t1,fontWeight:kilitSure===v?700:400}}>{l}</span>
          {kilitSure===v&&<span style={{color:P,fontSize:16,fontWeight:700}}>✓</span>}
        </div>)}
    </BottomSheet>}
    {modal==="gib"&&<GibEkrani onKapat={()=>setModal(null)} isletme={isletme} gibAyar={gibAyar||{}} setGibAyar={setGibAyar} goster={goster}/>}
  </div>;
}

// ─── ANA UYGULAMA ────────────────────────────────────────────────

// ─── MASAÜSTÜ DÜZENİ: SOL MENÜ + ÜST BAR + STAT KARTLARI ────────
const Sidebar=memo(function Sidebar({sekme,setSekme,T,isletme,acilVade=0}){
  const items=[
    {id:"anasayfa",  ik:"ev",     label:T.anaSayfa},
    {id:"isler",     ik:"akis",   label:T.isAkislari},
    {id:"teklifler", ik:"teklif", label:T.teklifler},
    {id:"faturalar", ik:"fatura", label:T.faturalar},
    {id:"raporlar",  ik:"grafik", label:T.raporlar},
    {id:"tahsilatlar",ik:"cuzdan",label:T.tahsilatlar},
    {id:"giderler",  ik:"klasor", label:T.giderler},
    {id:"musteriler",ik:"kisi",   label:T.musteriler},
    {id:"daha",      ik:"nokta",  label:T.dahaFazla},
  ];
  return <aside style={{width:252,flexShrink:0,background:C.card,borderRight:`1px solid ${C.border}`,height:"100vh",position:"sticky",top:0,display:"flex",flexDirection:"column",padding:"26px 16px 20px",boxSizing:"border-box"}}>
    <div style={{padding:"0 8px 24px",marginBottom:20,borderBottom:`1px solid ${C.border}`}}>
      <TFLogo boyut={112} koyu={koyuMu(C.bg)}/>
    </div>
    <nav style={{display:"flex",flexDirection:"column",gap:2}}>
      {items.map(m=>{
        const aktif=sekme===m.id;
        return <div key={m.id} onClick={()=>setSekme(m.id)} style={{
          display:"flex",alignItems:"center",gap:12,padding:"10px 13px",borderRadius:11,cursor:"pointer",
          background:aktif?P:"transparent",color:aktif?"#fff":C.t2,
          fontWeight:aktif?600:500,fontSize:13.5,transition:"all 0.14s",
          boxShadow:aktif?`0 6px 15px -5px ${P}99`:"none",
        }}
        onMouseEnter={e=>{if(!aktif)e.currentTarget.style.background="#F1F5F9";}}
        onMouseLeave={e=>{if(!aktif)e.currentTarget.style.background="transparent";}}>
          <Ik n={m.ik} s={19} c={aktif?"#fff":"#64748B"} w={1.8}/>
          <span style={{flex:1}}>{m.label}</span>
        </div>;
      })}
    </nav>
    <div style={{flex:1}}/>
    <div onClick={()=>setSekme("profil")} style={{display:"flex",alignItems:"center",gap:11,background:"#F8FAFC",border:`1px solid ${C.border}`,borderRadius:14,padding:"11px",cursor:"pointer",marginBottom:14}}>
      {isletme?.logo
        ? <img src={isletme.logo} alt="" style={{width:36,height:36,borderRadius:11,objectFit:"cover",flexShrink:0,border:`1px solid ${C.border}`}}/>
        : <div style={{width:36,height:36,borderRadius:11,background:`linear-gradient(145deg,#3E8FA3,#1C4E60)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0}}>{(isletme.yetkili||"EO").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>}
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5}}>
          {isletme.yetkili||"Kullanıcı"}
          {KURUCU_MU&&<svg width="12" height="12" viewBox="0 0 24 24" fill={GOLD} aria-hidden="true"><path d="M12 2 15 9l7 .6-5.3 4.6 1.6 6.8L12 17.3 5.7 21l1.6-6.8L2 9.6 9 9Z"/></svg>}
        </div>
        <div style={{fontSize:10.5,color:PLAN_AKTIF==="elite"?"#0E9F6E":P,fontWeight:600,marginTop:1}}>{PLAN_AKTIF==="elite"?"Elite ✓":PLAN_AKTIF==="pro"?"Pro":(TT.planBaslangic||"Başlangıç")}</div>
      </div>
      <Ik n="asagi" s={15} c={C.t3} w={2}/>
    </div>
    <LedImza boyut={12}/>
  </aside>;
})

const DesktopCharts=memo(function DesktopCharts({jobs,giderler,T,onDetayGelir,onDetayTahsilat,onYeniIs}){
  const seri=son7GunGelir(jobs);
  const veriVar=jobs.length>0||giderler.length>0;
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const aktifT=jobs.filter(j=>j.durum==="aktif").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const toplamGelir=tahsilE+aktifT;
  const toplamGider=giderler.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamGelir-toplamGider;
  const toplamTahsilat=tahsilE+beklT;
  const pie=[{name:T.tahsilEdilen,gercek:tahsilE,val:tahsilE||(beklT?0:1),color:P},{name:T.bekleyen,gercek:beklT,val:beklT||(tahsilE?0:1),color:"#B4B2A9"}];
  return <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,padding:"0 28px 16px"}}>
    <Sh s={{padding:"20px 22px"}}>
      <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:14}}>{T.gelirGider}</div>
      {!veriVar
        ? <BosDurum ikon="trend" baslik="Henüz kayıt yok"
            mesaj="İlk işini ekle — kazancın ve giderin burada grafikleşmeye başlasın."
            btn="+ Yeni İş Ekle" onBtn={onYeniIs} yuk={232}/>
        : <>
      <div style={{display:"flex",gap:28,marginBottom:14}}>
        <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{width:8,height:8,borderRadius:"50%",background:C.green,display:"inline-block"}}/><span style={{fontSize:12,color:C.t2}}>{T.toplamGelir}</span></div><div style={{fontSize:17,fontWeight:800,color:C.t1}}>{fmt(toplamGelir)}</div></div>
        <div><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}><span style={{width:8,height:8,borderRadius:"50%",background:C.red,display:"inline-block"}}/><span style={{fontSize:12,color:C.t2}}>{T.toplamGider}</span></div><div style={{fontSize:17,fontWeight:800,color:C.t1}}>{fmt(toplamGider)}</div></div>
        <div><div style={{fontSize:12,color:C.t2,marginBottom:3}}>{T.netKar}</div><div style={{fontSize:17,fontWeight:800,color:netKar>=0?C.t1:C.red}}>{fmt(netKar)}</div></div>
      </div>
      <ResponsiveContainer width="100%" height={170}>
        <AreaChart data={seri} margin={{top:4,right:4,left:-24,bottom:0}}>
          <defs><linearGradient id="gelirFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.green} stopOpacity={0.28}/><stop offset="100%" stopColor={C.green} stopOpacity={0}/></linearGradient></defs>
          <XAxis dataKey="d" tick={{fontSize:11,fill:C.t3}} axisLine={false} tickLine={false}/>
          <Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)}/>
          <Area type="monotone" dataKey="v" stroke={C.green} strokeWidth={2.5} fill="url(#gelirFill)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
      </>}
      <div style={{textAlign:"right",marginTop:8}}><button onClick={onDetayGelir} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 16px",color:C.t1,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.detayL}</button></div>
    </Sh>
    <Sh s={{padding:"20px 22px"}}>
      <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:14}}>{T.tahsilatDurumu}</div>
      {toplamTahsilat<=0
        ? <BosDurum ikon="cuzdan" baslik="Tahsilat kaydı yok"
            mesaj="Tamamlanan ve tahsilat bekleyen işlerin oranı burada görünecek."
            yuk={232}/>
        : <>
      <div style={{display:"flex",alignItems:"center",gap:20}}>
        <div style={{position:"relative",width:160,flexShrink:0}}>
          <PieChart width={160} height={160}><Pie data={pie} cx={80} cy={80} innerRadius={54} outerRadius={78} dataKey="val" startAngle={90} endAngle={-270} strokeWidth={0}>{pie.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center"}}>
            <div style={{fontSize:11,color:C.t3}}>{T.toplam}</div>
            <div style={{fontSize:16,fontWeight:800,color:C.t1}}>{fmt(toplamTahsilat)}</div>
          </div>
        </div>
        <div style={{flex:1}}>
          {pie.map(d=><div key={d.name} style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
            <span style={{width:10,height:10,borderRadius:"50%",background:d.color,flexShrink:0}}/>
            <div><div style={{fontSize:12,color:C.t2}}>{d.name}</div><div style={{fontSize:15,fontWeight:800,color:C.t1}}>{fmt(d.gercek)}</div></div>
          </div>)}
        </div>
      </div>
      </>}
      <div style={{textAlign:"right",marginTop:8}}><button onClick={onDetayTahsilat} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 16px",color:C.t1,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.detayL}</button></div>
    </Sh>
  </div>;
})

// ═══ 🔊 SESLİ YANIT — Türkçe konuşma (Web Speech Synthesis) ═══
let TF_SESLER=[];
function tfSesleriHazirla(){
  try{
    if(typeof window==="undefined"||!window.speechSynthesis)return;
    const al=()=>{TF_SESLER=window.speechSynthesis.getVoices()||[];};
    al();
    window.speechSynthesis.onvoiceschanged=al;
  }catch{}
}
tfSesleriHazirla();

function tfTrSes(){
  const s=TF_SESLER.length?TF_SESLER:(()=>{try{return window.speechSynthesis.getVoices()||[];}catch{return [];}})();
  return s.find(v=>/^tr([-_]TR)?$/i.test(v.lang))||s.find(v=>/^tr/i.test(v.lang))||s.find(v=>/turkish|türk/i.test(v.name))||null;
}

// Metni okunabilir hale getir: markdown yıldızları, emoji ve madde işaretlerini temizle
function tfSesMetni(metin){
  return String(metin||"")
    .replace(/\*\*/g,"")
    .replace(/[#>_`|]/g," ")
    .replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/gu,"")
    .replace(/^[•\-*]\s*/gm,"")
    .replace(/\s+/g," ")
    .trim();
}

function tfKonus(metin,acik=true){
  try{
    if(!acik||typeof window==="undefined"||!window.speechSynthesis)return false;
    const temiz=tfSesMetni(metin).slice(0,700);
    if(!temiz)return false;
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(temiz);
    u.lang="tr-TR"; u.rate=1.04; u.pitch=1; u.volume=1;
    const ses=tfTrSes(); if(ses)u.voice=ses;
    window.speechSynthesis.speak(u);
    return true;
  }catch{ return false; }
}
function tfSus(){ try{ if(window.speechSynthesis)window.speechSynthesis.cancel(); }catch{} }

// ═══ 🎙️ SESLİ KOMUT — "tahsilat aç", "yeni müşteri ekle" gibi Türkçe sesli komutlarla gezinme ═══
function sesliKomutYorumla(metin,eylemler){
  const m=metin.toLowerCase().trim()
    .replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g").replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c");
  const iceren=(...kelimeler)=>kelimeler.some(k=>m.includes(k));
  // Sıra önemli: daha spesifik komutlar önce kontrol edilir
  if(iceren("yeni is","is ekle","is olustur","is ac","yeni kayit"))return eylemler.yeniIs(metin);
  if(iceren("yeni musteri","musteri ekle"))return eylemler.git("musteriler");
  if(iceren("yeni gider","gider ekle","masraf ekle"))return eylemler.git("giderler");
  if(iceren("yeni teklif","teklif ekle","teklif olustur"))return eylemler.git("teklifler");
  if(iceren("nakit akis","nakit tahmin","nakit"))return eylemler.ekran("nakit");
  if(iceren("dunya saat","dunya"))return eylemler.ekran("dunya");
  if(iceren("cop kutusu","cop"))return eylemler.ekran("cop");
  if(iceren("tahsilat","alacak","borclu"))return eylemler.git("tahsilatlar");
  if(iceren("fatura","irsaliye"))return eylemler.git("faturalar");
  if(iceren("musteri","cari"))return eylemler.git("musteriler");
  if(iceren("gider","masraf","harcama"))return eylemler.git("giderler");
  if(iceren("teklif","proforma"))return eylemler.git("teklifler");
  if(iceren("rapor","istatistik","grafik","ciro","kazanc"))return eylemler.git("raporlar");
  if(iceren("bildirim","hatirlatma"))return eylemler.git("bildiri");
  if(iceren("profil","ayar","hesab","tema","dil"))return eylemler.git("profil");
  if(iceren("takvim","ajanda"))return eylemler.ekran("takvim");
  if(iceren("cek senet","kasa","pin","cek","senet"))return eylemler.ekran("kasa");
  if(iceren("ekip","personel","calisan","usta"))return eylemler.ekran("ekip");
  if(iceren("asistan","yapay zeka","sor"))return eylemler.ekran("asistan");
  if(iceren("eglence","oyun","mola"))return eylemler.ekran("eglence");
  if(iceren("yardim","destek","nasil"))return eylemler.ekran("yardim");
  if(iceren("ara ","arama","bul "))return eylemler.ekran("arama");
  if(iceren("piyasa","kur","dolar","euro","altin","borsa"))return eylemler.git("anasayfa");
  if(iceren("ana sayfa","anasayfa","eve don","basa don","ana ekran"))return eylemler.git("anasayfa");
  if(iceren("is akis","islerim","aktif is","isler","gorev"))return eylemler.git("isler");
  return eylemler.bulunamadi(metin);
}
// Sekme / ekran adlarının sesli okunuşu
const SESLI_AD={
  anasayfa:"Ana sayfa",isler:"İş akışları",musteriler:"Müşteriler",faturalar:"Faturalar",
  tahsilatlar:"Tahsilatlar",teklifler:"Teklifler",giderler:"Giderler",raporlar:"Raporlar",
  bildiri:"Bildirimler",profil:"Profil",takvim:"Takvim",kasa:"Kasa",ekip:"Ekip yönetimi",
  nakit:"Nakit akışı tahmini",dunya:"Dünya saatleri",eglence:"Eğlence köşesi",arama:"Arama",
  asistan:"Asistan",cop:"Çöp kutusu",yardim:"Yardım merkezi",
};

function SesliKomut({setSekme,setYeniAc,setEkran,goster,yeniIsKilit,onSor,acik=false}){
  const [dinliyor,setDinliyor]=useState(false);
  const [destekli,setDestekli]=useState(true);
  const [yaziModal,setYaziModal]=useState(false);
  const [yaziDeger,setYaziDeger]=useState("");
  const tanimaRef=useRef(null);
  const propRef=useRef({});
  propRef.current={setSekme,setYeniAc,setEkran,goster,yeniIsKilit,onSor};

  // Hem mikrofondan hem yazıdan gelen metni aynı şekilde işle
  const isle=(metin)=>{
    if(!metin||!metin.trim())return;
    const p=propRef.current;
    const eylemler={
      git:(sekme)=>{
        p.setSekme(sekme);
        const ad=SESLI_AD[sekme]||sekme;
        p.goster("🎙️ "+ad+" açılıyor");
        tfKonus(ad+" açılıyor");
      },
      // Sadece "yeni iş" denmişse boş form açılır.
      // "Ahmet'e kombi bakımı 3200 lira" gibi devamı varsa alanlar da dolar.
      yeniIs:(hamMetin)=>{
        if(p.yeniIsKilit())return;
        p.setYeniAc(hamMetin&&hamMetin.trim()?{sesli:hamMetin}:true);
        p.goster("🎙️ Yeni iş ekranı açılıyor");
        tfKonus("Yeni iş ekranı açılıyor");
      },
      ekran:(e)=>{
        p.setEkran(e);
        const ad=SESLI_AD[e]||e;
        p.goster("🎙️ "+ad+" açılıyor");
        tfKonus(ad+" açılıyor");
      },
      // Komut değilse: soru kabul edip asistana devret (asistan sesli cevap verir)
      bulunamadi:(m)=>{
        if(p.onSor){
          p.goster("🤖 Asistana soruluyor…");
          p.onSor(m);
        }else{
          p.goster("🎙️ Anlaşılamadı: \""+m+"\"");
          tfKonus("Bunu anlayamadım, tekrar söyler misin?");
        }
      },
    };
    sesliKomutYorumla(metin,eylemler);
  };

  useEffect(()=>{
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR){setDestekli(false);return;}
    const r=new SR();
    r.lang="tr-TR";r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
    r.onresult=(e)=>{ isle(e.results[0][0].transcript); };
    r.onerror=()=>setDinliyor(false);
    r.onend=()=>setDinliyor(false);
    tanimaRef.current=r;
    return ()=>{ try{r.abort();}catch{} };
    // eslint-disable-next-line
  },[]);

  const komutCalistir=(metin)=>{
    isle(metin);
    setYaziModal(false);setYaziDeger("");
  };
  const btnStil={width:acik?38:40,height:acik?38:40,borderRadius:acik?"50%":11,background:dinliyor?"#EF4444":(acik?"transparent":"rgba(255,255,255,0.14)"),border:acik?"none":"1px solid rgba(255,255,255,0.22)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"background .14s",flexShrink:0,animation:dinliyor?"tfPulse 1s infinite":"none"};
  const ikonRenk=dinliyor?"#fff":(acik?"#1F2937":"#fff");
  if(!destekli){
    // iOS Safari (Web Speech API yok): klavyedeki dikte tuşuyla yazıya çevrilen komutu bir metin kutusuna alıp yorumluyoruz
    return <>
      <button onClick={()=>setYaziModal(true)} title="Sesli komut (iOS: klavyedeki 🎤 dikte tuşunu kullan)" style={btnStil}>
        <i className="ti ti-microphone" style={{fontSize:acik?21:18,color:ikonRenk}} aria-hidden="true"/>
      </button>
      {yaziModal&&<div onClick={()=>setYaziModal(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
        <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:460,background:"#fff",borderRadius:"20px 20px 0 0",padding:"20px 20px 28px",boxShadow:"0 -8px 30px rgba(0,0,0,0.2)"}}>
          <div style={{width:36,height:4,borderRadius:2,background:"#E5E7EB",margin:"0 auto 16px"}}/>
          <div style={{fontSize:15,fontWeight:800,color:"#1F2937",marginBottom:4}}>🎙️ Sesli Komut</div>
          <div style={{fontSize:12,color:"#6B7280",marginBottom:14,lineHeight:1.5}}>Klavye açılınca 🎤 dikte tuşuna basıp konuş, ya da yazarak dene: "tahsilat aç", "yeni müşteri ekle"...</div>
          <input autoFocus value={yaziDeger} onChange={e=>setYaziDeger(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")komutCalistir(yaziDeger);}} placeholder="Komut söyle veya yaz…" style={{width:"100%",boxSizing:"border-box",padding:"13px 15px",border:"1.5px solid #E5E7EB",borderRadius:12,fontSize:15,outline:"none",marginBottom:14}}/>
          <button onClick={()=>komutCalistir(yaziDeger)} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>Çalıştır</button>
        </div>
      </div>}
    </>;
  }
  const baslat=()=>{
    if(!tanimaRef.current)return;
    if(dinliyor){try{tanimaRef.current.stop();}catch{} setDinliyor(false); return;}
    tfSus(); // konuşma sürüyorsa sustur, mikrofon kendi sesini duymasın
    try{tanimaRef.current.start();setDinliyor(true);}catch(e){}
  };
  return <button onClick={baslat} title="Sesli komut: 'tahsilat aç', 'yeni müşteri ekle' gibi söyle" style={btnStil}>
    <i className="ti ti-microphone" style={{fontSize:acik?21:18,color:ikonRenk}} aria-hidden="true"/>
    <style>{"@keyframes tfPulse{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,0.5);}50%{box-shadow:0 0 0 8px rgba(239,68,68,0);}}"}</style>
  </button>;
}

function DesktopHeader({T,isletme,okunmamis,onBildirim,onYeniIs,onAra,onAsistan,isKolu,setIsKolu,onDunya,onTema,setSekme,setYeniAc,setEkran,goster,yeniIsKilit,onSor}){
  const ad=(isletme.yetkili||"").split(" ")[0]||"";
  const ikonBtn={width:40,height:40,borderRadius:11,background:"rgba(255,255,255,0.14)",border:"1px solid rgba(255,255,255,0.22)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",transition:"background .14s"};
  const ikonGir=e=>{e.currentTarget.style.background="rgba(255,255,255,0.26)";};
  const ikonCik=e=>{e.currentTarget.style.background="rgba(255,255,255,0.14)";};
  const saatSimdi=new Date().getHours();
  const dilim=gunDilimi(saatSimdi);
  const DILIM_KEY={sabah:["selamSabah","altSabah"],ogle:["selamOgle","altOgle"],aksam:["selamAksam","altAksam"],gece:["selamGece","altGece"]}[dilim];
  const selam=T[DILIM_KEY[0]]||DILIM_METIN[dilim].selam;
  return <div style={{display:"flex",alignItems:"stretch",padding:"24px 28px 18px",gap:16,flexWrap:"wrap"}}>

    {/* Karşılama — fotoğraflı hero, %70 */}
    <div style={{position:"relative",flex:"7 1 460px",minHeight:150,borderRadius:18,overflow:"hidden",boxShadow:"0 10px 24px -12px rgba(16,24,40,0.35)"}}>
      <ManzaraKare dilim={dilim} mobil={false}/>
      <div style={{position:"relative",height:"100%",padding:"16px 22px",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
        <div style={{fontSize:21,fontWeight:800,color:"#fff",letterSpacing:"-0.015em",lineHeight:1.15,textShadow:"0 2px 10px rgba(0,0,0,0.4)"}}>{selam}{ad?", "+ad:""}</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.9)",marginTop:3,fontWeight:500,textShadow:"0 1px 6px rgba(0,0,0,0.4)"}}>{T[DILIM_KEY[1]]||DILIM_METIN[dilim].alt}</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,marginTop:10,background:"rgba(255,255,255,0.94)",borderRadius:100,padding:"5px 12px",alignSelf:"flex-start"}}>
          <i className="ti ti-clock" style={{fontSize:12,color:"#1C4E60"}} aria-hidden="true"/>
          <span style={{fontSize:11.5,fontWeight:700,color:"#1F2937"}}>{new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})}</span>
          <span style={{width:2.5,height:2.5,borderRadius:"50%",background:"#9CA3AF"}}/>
          <span style={{fontSize:11.5,fontWeight:700,color:"#1F2937"}}>{new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</span>
          <span onClick={onDunya} style={{marginLeft:4,paddingLeft:8,borderLeft:"1px solid #E2E8F0",fontSize:10.5,fontWeight:700,color:"#2E7490",cursor:"pointer"}}>{T.dunyaSaatleriKisa||"🌍 Dünya saatleri"}</span>
        </div>
      </div>
    </div>

    {/* Sağ panel — İş Sektörünüz + ikon butonları, %30 */}
    <div style={{flex:"3 1 300px",minHeight:150,background:GRAD,borderRadius:18,padding:"14px 16px",display:"flex",flexDirection:"column",justifyContent:"space-between",gap:10,boxShadow:"0 10px 24px -12px rgba(31,78,96,.55)"}}>

      {/* Sektör seçici */}
      <div style={{position:"relative",display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 10px",borderRadius:12,transition:"background .14s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.10)";}}
        onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
        <Ik n="canta" s={18} c="rgba(255,255,255,0.92)" w={1.7}/>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:9.5,color:"rgba(255,255,255,0.68)",fontWeight:600,letterSpacing:"0.03em",lineHeight:1.25}}>{T.desktopSektorunuz||"İş Sektörünüz"}</div>
          <div style={{fontSize:13.5,fontWeight:700,color:"#fff",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",lineHeight:1.35}}>{isKolu||T.desktopSektorSecin||"Sektör seçin…"}</div>
        </div>
        <Ik n="asagi" s={14} c="rgba(255,255,255,0.75)" w={2}/>
        <select value={isKolu} onChange={e=>setIsKolu(e.target.value)} style={{position:"absolute",inset:0,opacity:0,width:"100%",cursor:"pointer"}} title="İş sektörünüzü seçin">
          {!isKolu&&<option value="" disabled>İş sektörünüzü seçin</option>}
          {IS_KOLLARI.map(k=><option key={k.label} value={k.label}>{k.icon} {k.label}</option>)}
        </select>
      </div>

      {/* İkon butonları */}
      <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
        <button onClick={onTema} title="Tema ve Görünüm" style={ikonBtn} onMouseEnter={ikonGir} onMouseLeave={ikonCik}>
          <Ik n="palet" s={18} c="#fff" w={1.7}/>
        </button>
        <button onClick={onAsistan} title="Asistan" style={ikonBtn} onMouseEnter={ikonGir} onMouseLeave={ikonCik}>
          <Ik n="pano" s={18} c="#fff" w={1.8}/>
        </button>
        <button onClick={onAra} title="Ara" style={ikonBtn} onMouseEnter={ikonGir} onMouseLeave={ikonCik}>
          <Ik n="ara" s={18} c="#fff" w={1.8}/>
        </button>
        <SesliKomut setSekme={setSekme} setYeniAc={setYeniAc} setEkran={setEkran} goster={goster} yeniIsKilit={yeniIsKilit} onSor={onSor}/>
        <button onClick={onBildirim} title="Bildirimler" style={ikonBtn} onMouseEnter={ikonGir} onMouseLeave={ikonCik}>
          <Ik n="zil" s={18} c="#fff" w={1.8}/>
          {okunmamis>0&&<span style={{position:"absolute",top:-3,right:-3,minWidth:18,height:18,borderRadius:9,background:"#EF4444",color:"#fff",fontSize:9.5,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",border:"2px solid #2E7490"}}>{okunmamis}</span>}
        </button>
        <button onClick={onYeniIs} style={{flex:1,background:"rgba(255,255,255,0.16)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:12,padding:"10px 12px",color:"#fff",fontSize:12.5,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,whiteSpace:"nowrap",transition:"background .14s",fontFamily:"inherit"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.28)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.16)";}}>
          <span style={{fontSize:16,lineHeight:1,marginTop:-1}}>+</span> {T.yeniIs}
        </button>
      </div>
    </div>
  </div>;
}

// 🖥️ Masaüstü hero — mobildeki Yeni İş Ekle + İpucu kartlarının geniş ekran uyarlaması
const DesktopHero=memo(function DesktopHero({T,onYeniIs,onTakvim,onKasa,setSekme,jobs,onAc}){
  const bugun=new Date().toISOString().slice(0,10);
  const bugunIsler=jobs.filter(j=>j.durum!=="tamamlandi"&&((j.tarih||"")===bugun||(j.hatirlatma||"").startsWith(bugun)));
  const [ix,setIx]=useState(0);
  const bugunIsMetni=bugunIsler.length===0?"Planlı işin yok — yeni iş ekleyerek gününü planla.":((bugunIsler[0].hatirlatma||"").slice(11,16)||"Bugün")+" · "+bugunIsler[0].musteri+" — "+bugunIsler[0].baslik+(bugunIsler.length>1?" (+"+(bugunIsler.length-1)+" iş daha)":"");
  const ipuclari=tanitimIpuclari(bugunIsler.length>0,bugunIsMetni,onTakvim,onKasa,setSekme,onAc);
  useEffect(()=>{const t=setInterval(()=>setIx(i=>(i+1)%ipuclari.length),6500);return ()=>clearInterval(t);},[ipuclari.length]);
  const ip=ipuclari[ix];
  return <div style={{display:"grid",gridTemplateColumns:"0.85fr 2.15fr",gap:16,padding:"0 28px 16px"}}>
    <button onClick={onYeniIs} style={{background:GRAD,border:"none",borderRadius:20,padding:"22px 24px",color:"#fff",cursor:"pointer",textAlign:"left",boxShadow:"0 10px 22px rgba(31,78,96,0.28)",display:"flex",flexDirection:"column",justifyContent:"center",gap:10,transition:"transform 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="none"}>
      <div style={{display:"flex",alignItems:"center",gap:11}}>
        <div style={{width:36,height:36,borderRadius:"50%",border:"1.6px solid rgba(255,255,255,0.75)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className="ti ti-plus" style={{fontSize:19}} aria-hidden="true"/></div>
        <span style={{fontSize:20,fontWeight:800,letterSpacing:"-0.01em"}}>{T.yeniIs} Ekle</span>
      </div>
      <div style={{fontSize:13.5,color:"rgba(255,255,255,0.85)",lineHeight:1.45,fontWeight:500}}>Yeni iş ekleyerek gününü planla.</div>
    </button>
    <div onClick={ip.act} style={{background:C.card,borderRadius:20,padding:"18px 20px 12px",cursor:"pointer",boxShadow:C.sh,display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{display:"flex",gap:14,flex:1,alignItems:"center"}}>
        <button onClick={e=>{e.stopPropagation();setIx(i=>(i-1+ipuclari.length)%ipuclari.length);}} style={{position:"absolute",left:6,top:"42%",width:28,height:28,borderRadius:"50%",border:"none",background:C.bg,color:C.t3,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
        <div style={{flex:1,minWidth:0,paddingLeft:24}}>
          <div style={{fontSize:15,fontWeight:800,color:ip.renk,marginBottom:5}}>{ip.baslik}</div>
          <div style={{fontSize:13.5,color:C.t2,lineHeight:1.55}}>{ip.metin}</div>
        </div>
        <div style={{width:54,height:54,borderRadius:14,background:ip.renk+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><i className={`ti ${ip.ic}`} style={{fontSize:25,color:ip.renk}} aria-hidden="true"/></div>
        <button onClick={e=>{e.stopPropagation();setIx(i=>(i+1)%ipuclari.length);}} style={{position:"absolute",right:6,top:"42%",width:28,height:28,borderRadius:"50%",border:"none",background:C.bg,color:C.t3,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      </div>
      <div style={{display:"flex",justifyContent:"center",gap:5,paddingTop:9}}>
        {ipuclari.map((_,i)=><span key={i} onClick={e=>{e.stopPropagation();setIx(i);}} style={{width:i===ix?14:4.5,height:4.5,borderRadius:3,background:i===ix?ip.renk:"#C9D4E4",transition:"all 0.25s",cursor:"pointer",flexShrink:0}}/>)}
      </div>
    </div>
  </div>;
})
const DesktopVade=memo(function DesktopVade({jobs,cekSenetler,onKasa,onIsSec,vadeGun=VADE_VARSAYILAN}){
  const hatirlatmalar=vadeHatirlatmalari(jobs,cekSenetler,vadeGun);
  if(hatirlatmalar.length===0)return null;
  const gorunen=hatirlatmalar.slice(0,4);
  const acil=hatirlatmalar.filter(h=>h.fark<=0).length;
  const IKON={cek:"cek",is:"takvim",tahsilat:"cuzdan"};
  return <div style={{padding:"0 28px 16px"}}>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"20px 22px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:15}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <Ik n="zil" s={19} c={acil>0?"#DC2626":"#D97706"} w={1.9}/>
          <span style={{fontSize:15,fontWeight:700,color:C.t1}}>Vade Hatırlatmaları</span>
          {acil>0&&<span style={{fontSize:9.5,fontWeight:800,color:"#991B1B",background:"#FEE2E2",borderRadius:9,padding:"3px 9px"}}>{acil} ACİL</span>}
        </div>
        {hatirlatmalar.length>4&&<span onClick={onKasa} style={{fontSize:12.5,fontWeight:700,color:P,cursor:"pointer"}}>Tümü ({hatirlatmalar.length}) ›</span>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:11}}>
        {gorunen.map(h=>{const et=h.etiket||vadeEtiket(h.fark);const kirmizi=h.fark<=0;
          return <div key={h.id} onClick={h.tip==="cek"?onKasa:()=>onIsSec&&onIsSec(h.ref)}
            style={{background:"#FAFCFD",border:`1px solid ${C.border}`,borderLeft:`3px solid ${et.renk}`,borderRadius:"0 13px 13px 0",padding:"12px 14px",display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
            <div style={{width:36,height:36,borderRadius:11,background:et.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Ik n={IKON[h.tip]||"saat"} s={18} c={et.renk} w={1.8}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(h.baslik||"").replace(/^[^\s]+\s/,"")}</div>
              <div style={{fontSize:11,color:C.t3,marginTop:1}}>{h.alt}{h.saat?" · "+h.saat:""}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              {h.tutar>0&&<div style={{fontSize:13.5,fontWeight:800,color:h.yon==="borc"?"#DC2626":C.t1,fontVariantNumeric:"tabular-nums"}}>{fmt(h.tutar)}</div>}
              <span style={{fontSize:9,fontWeight:800,color:et.renk,background:et.bg,borderRadius:7,padding:"2px 7px",display:"inline-block",marginTop:3}}>{et.metin}</span>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
})
const DesktopStats=memo(function DesktopStats({jobs,faturalar,T,onStatClick}){
  const aktif=jobs.filter(j=>j.durum==="aktif").length;
  const tahsil=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const beklFat=(faturalar||[]).filter(f=>!f.odendi).length;
  const kartlar=[
    {ik:"canta", l:T.aktifIs,          sub:T.devamEden,    v:aktif,        c:TEAL, go:"stat-aktif"},
    {ik:"kalkan",l:T.tahsilEdildi,     sub:T.buAyTahsilat, v:fmt(tahsil),  c:YESIL,go:"stat-tahsil"},
    {ik:"saat",  l:T.bekleyenTahsilat, sub:T.toplam,       v:fmt(beklT),   c:KOR,  go:"stat-btahsilat"},
    {ik:"fatura",l:T.faturalar,        sub:T.beklemede,    v:beklFat,      c:TEAL, go:"stat-bekleyen"},
  ];
  return <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,padding:"0 28px 16px"}}>
    {kartlar.map(k=><div key={k.l} onClick={()=>onStatClick(k.go)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"18px 20px 16px",cursor:"pointer",transition:"all 0.14s"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor="#CBD5E1";}}
      onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.borderColor=C.border;}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}>
        <Ik n={k.ik} s={17} c={k.c} w={1.8}/>
        <span style={{fontSize:12,fontWeight:600,color:C.t2,flex:1}}>{k.l}</span>
      </div>
      <div style={{fontSize:String(k.v).length>10?21:25,fontWeight:800,color:C.t1,letterSpacing:"-0.025em",fontVariantNumeric:"tabular-nums"}}>{k.v}</div>
      <div style={{fontSize:11,color:C.t3,margin:"2px 0 11px"}}>{k.sub}</div>
      <div style={{height:3,borderRadius:3,background:k.c,opacity:.85}}/>
    </div>)}
  </div>;
})

// ─── GİRİŞ / KAYIT EKRANI ──────────────────────────────────────
function GirisEkrani({onGiris}){
  const trMi=typeof navigator!=="undefined"&&(navigator.language||"").toLowerCase().startsWith("tr");
  const L=trMi?{
    girisYap:"Giriş Yap",kayitOl:"Kayıt Ol",hesabaGiris:"Hesabınıza giriş yapın",yeniHesap:"Yeni hesap oluşturun",
    eposta:"E-posta",sifre:"Şifre",sifrePh:"En az 6 karakter",bekle:"Lütfen bekleyin...",
    beniHatirla:"Beni hatırla",acikKal:"e-postanı hatırlar, açık kal",
    hesapYok:"Hesabın yok mu? ",hesapVar:"Zaten hesabın var mı? ",
    hataGerekli:"E-posta ve şifre gerekli",hataKisa:"Şifre en az 6 karakter olmalı",hataYanlis:"E-posta veya şifre hatalı",hataKayitli:"Bu e-posta zaten kayıtlı, giriş yapın",hataOnay:"E-posta onayı gerekli. Gelen kutunuzu kontrol edin.",hataGenel:"Bir hata oluştu",
  }:{
    girisYap:"Sign In",kayitOl:"Sign Up",hesabaGiris:"Sign in to your account",yeniHesap:"Create a new account",
    eposta:"Email",sifre:"Password",sifrePh:"At least 6 characters",bekle:"Please wait...",
    beniHatirla:"Remember me",acikKal:"stay signed in",
    hesapYok:"No account? ",hesapVar:"Already have an account? ",
    hataGerekli:"Email and password required",hataKisa:"Password must be at least 6 characters",hataYanlis:"Invalid email or password",hataKayitli:"Email already registered, sign in",hataOnay:"Email confirmation required. Check your inbox.",hataGenel:"Something went wrong",
  };
  const [mod,setMod]=useState("giris"); // giris | kayit
  const [tip,setTip]=useState("isveren"); // isveren | usta
  const [email,setEmail]=useState(()=>{try{return localStorage.getItem("tf_son_email")||"";}catch{return "";}});
  const [sifre,setSifre]=useState("");
  const [beniHatirla,setBeniHatirla]=useState(()=>{try{return localStorage.getItem("tf_beni_hatirla")!=="0";}catch{return true;}}); // varsayılan: açık kal
  const [yukleniyor,setYukleniyor]=useState(false);
  const [hata,setHata]=useState("");
  const [bilgi,setBilgi]=useState("");
  
  // ═══ Şifre Sıfırlama State'leri ═══
  const [sifreSifirlamaAcik,setSifreSifirlamaAcik]=useState(false);
  const [sifreSifirlamaAdim,setSifreSifirlamaAdim]=useState("email"); // email | kod | yeniSifre
  const [sifreSifirlamaEmail,setSifreSifirlamaEmail]=useState("");
  const [sifreSifirlamaKod,setSifreSifirlamaKod]=useState("");
  const [sifreSifirlamaYeniSifre,setSifreSifirlamaYeniSifre]=useState("");
  const [sifreSifirlamaYeniSifre2,setSifreSifirlamaYeniSifre2]=useState("");
  const [sifreSifirlamaYukleniyor,setSifreSifirlamaYukleniyor]=useState(false);
  const [sifreSifirlamaHata,setSifreSifirlamaHata]=useState("");
  const [sifreSifirlamaBilgi,setSifreSifirlamaBilgi]=useState("");
  const [sifreUnuttumModal,setSifreUnuttumModal]=useState(false);
  const [sifreUnuttumEmail,setSifreUnuttumEmail]=useState("");

  const sifremiUnuttum=()=>{
    setHata("");setBilgi("");
    setSifreUnuttumEmail("");
    setSifreUnuttumModal(true);
  };
  const sifreUnuttumGonder=async()=>{
    setHata("");setBilgi("");
    if(!sifreUnuttumEmail){setHata("E-posta adresini girin");return;}
    try{
      const redirectUrl=window.location.origin;
      await supabase.auth.resetPasswordForEmail(sifreUnuttumEmail,{redirectTo:redirectUrl});
      setBilgi("✅ Sıfırlama linki "+sifreUnuttumEmail+" adresine gönderildi!\n\n📧 Gelen kutunu (spam klasörünü de) kontrol et\n\n🔑 E-postadaki linke tıkla ve yeni şifre oluştur");
      setSifreUnuttumModal(false);
    }catch(e){setHata("⚠️ E-posta gönderilemedi. E-posta adresini kontrol edip tekrar dene.");}
  };
  const gonder=async()=>{
    setHata("");setBilgi("");
    if(!email||!sifre){setHata(tip==="usta"?"Kullanıcı adı ve şifre gerekli":L.hataGerekli);return;}
    if(sifre.length<6){setHata(L.hataKisa);return;}
    setYukleniyor(true);
    const hatirlaKaydet=()=>{
      try{
        localStorage.setItem("tf_beni_hatirla",beniHatirla?"1":"0");
        if(beniHatirla)localStorage.setItem("tf_son_email",email);
        else localStorage.removeItem("tf_son_email");
      }catch(e){}
    };
    if(tip==="usta"){ // 👷 Usta girişi: kullanıcı adı → dahili e-posta
      try{
        const ka=email.trim().toLowerCase().replace(/\s/g,"");
        const {data,error}=await supabase.auth.signInWithPassword({email:ka+USTA_EK,password:sifre});
        if(error)throw error;
        hatirlaKaydet();
        onGiris(data.user);
      }catch(e){setHata("Kullanıcı adı veya şifre hatalı. Patronunuzdan bilgilerinizi kontrol edin.");}
      setYukleniyor(false);
      return;
    }
    try{
      try{ window.__tfBeniHatirla = true; }catch(e){} // Oturum her zaman açık kalır
      if(mod==="kayit"){
        const {data,error}=await supabase.auth.signUp({email,password:sifre});
        if(error)throw error;
        // E-posta onayı kapalı olduğunda signUp direkt oturum döner → hemen içeri al
        if(data.session&&data.user){
          hatirlaKaydet();
          onGiris(data.user);
        }else{
          // Onay hâlâ açıksa (Supabase ayarı) yedek: giriş dene
          const {data:d2,error:e2}=await supabase.auth.signInWithPassword({email,password:sifre});
          if(e2)throw e2;
          hatirlaKaydet();
          onGiris(d2.user);
        }
      }else{
        const {data,error}=await supabase.auth.signInWithPassword({email,password:sifre});
        if(error)throw error;
        hatirlaKaydet();
        onGiris(data.user);
      }
    }catch(e){
      const m=e.message||"";
      if(m.includes("Invalid login"))setHata(L.hataYanlis);
      else if(m.includes("already registered"))setHata(L.hataKayitli);
      else if(m.includes("Email not confirmed"))setHata(L.hataOnay);
      else setHata(m||L.hataGenel);
    }
    setYukleniyor(false);
  };

  return <>
  <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#EAF1FF,#F2F2F7)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"}}>
    <div style={{width:"100%",maxWidth:400,background:"#fff",borderRadius:24,padding:"36px 28px",boxShadow:"0 12px 40px rgba(27,42,74,0.15)"}}>
      {/* Logo */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28}}>
        <TFLogo boyut={104}/>
        <div style={{display:"flex",gap:6,margin:"14px auto 4px",background:"#EDF0F5",borderRadius:12,padding:4,maxWidth:290}}>
          {[["isveren","💼 İşveren"],["usta","👷 Usta / Çalışan"]].map(([v,l])=><button key={v} onClick={()=>{setTip(v);setHata("");if(v==="usta")setMod("giris");}} style={{flex:1,background:tip===v?"#fff":"transparent",border:"none",borderRadius:9,padding:"9px 4px",fontSize:12.5,fontWeight:700,color:tip===v?"#1C4E60":"#6B7280",cursor:"pointer",boxShadow:tip===v?"0 1px 3px rgba(16,24,40,0.1)":"none"}}>{l}</button>)}
        </div>
        <div style={{fontSize:13,color:"#6B7280",marginTop:8}}>{tip==="usta"?"Patronunun verdiği bilgilerle gir":(mod==="giris"?L.hesabaGiris:L.yeniHesap)}</div>
      </div>

      {/* Form */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,color:"#6B7280",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>{tip==="usta"?"Kullanıcı Adı":L.eposta}</div>
        <input type={tip==="usta"?"text":"email"} value={email} onChange={e=>setEmail(e.target.value)} placeholder={tip==="usta"?"örn: mehmet35":"ornek@mail.com"}
          style={{width:"100%",boxSizing:"border-box",background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:12,padding:"13px 15px",fontSize:14,outline:"none"}}/>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:11,color:"#6B7280",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>{L.sifre}</div>
        <input type="password" value={sifre} onChange={e=>setSifre(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")gonder();}} placeholder={L.sifrePh}
          style={{width:"100%",boxSizing:"border-box",background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:12,padding:"13px 15px",fontSize:14,outline:"none"}}/>
        {mod==="giris"&&tip!=="usta"&&<div onClick={sifremiUnuttum} style={{fontSize:13,fontWeight:700,color:"#2E7490",cursor:"pointer",textAlign:"right",marginTop:12,textDecoration:"underline"}}>Şifremi unuttum?</div>}
      </div>

      {/* Beni hatırla */}
      <div onClick={()=>setBeniHatirla(!beniHatirla)} style={{display:"flex",alignItems:"center",gap:9,marginBottom:18,cursor:"pointer",userSelect:"none"}}>
        <div style={{width:22,height:22,borderRadius:7,border:`2px solid ${beniHatirla?"#1C4E60":"#D1D5DB"}`,background:beniHatirla?"#1C4E60":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
          {beniHatirla&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}
        </div>
        <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{L.beniHatirla} <span style={{color:"#9CA3AF",fontWeight:400}}>· {L.acikKal}</span></span>
      </div>
      {bilgi&&<div style={{background:"#DCFCE7",color:"#059669",fontSize:12,fontWeight:600,padding:"10px 14px",borderRadius:10,marginBottom:14}}>✅ {bilgi}</div>}

      <button onClick={gonder} disabled={yukleniyor} style={{width:"100%",background:yukleniyor?"#8C97AC":"#1C4E60",border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:700,cursor:yukleniyor?"default":"pointer",boxShadow:"0 4px 14px rgba(27,42,74,0.4)"}}>
        {yukleniyor?L.bekle:mod==="giris"?L.girisYap:L.kayitOl}
      </button>

      <div style={{textAlign:"center",marginTop:18,fontSize:13,color:"#6B7280"}}>
        {tip==="usta"?"":(mod==="giris"?L.hesapYok:L.hesapVar)}
        <span onClick={()=>{setMod(mod==="giris"?"kayit":"giris");setHata("");setBilgi("");}} style={{color:"#1C4E60",fontWeight:700,cursor:"pointer"}}>
          {mod==="giris"?L.kayitOl:L.girisYap}
        </span>
      </div>
    </div>
  </div>

  {/* Şifre Unuttum Modal */}
  {sifreUnuttumModal && (
    <div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
      <div style={{background:"white",borderRadius:16,padding:28,width:"90%",maxWidth:420,boxShadow:"0 20px 50px rgba(0,0,0,0.3)"}}>
        <h2 style={{fontSize:20,fontWeight:700,marginBottom:10,color:"#1F2937"}}>Şifrenizi Sıfırlayın</h2>
        <p style={{fontSize:14,color:"#6B7280",marginBottom:20}}>Lütfen hesabınızla ilişkili e-posta adresini girin</p>
        
        <input type="email" value={sifreUnuttumEmail} onChange={(e)=>setSifreUnuttumEmail(e.target.value)} 
          placeholder="ornek@email.com" 
          style={{width:"100%",boxSizing:"border-box",padding:"13px 15px",border:"1px solid #E5E7EB",borderRadius:12,fontSize:14,marginBottom:14,outline:"none",background:"#F9FAFB"}} 
          onKeyDown={(e)=>{if(e.key==="Enter")sifreUnuttumGonder();}} 
          autoFocus/>
        
        {hata&&<div style={{color:"#DC2626",fontSize:13,marginBottom:14,background:"#FEE2E2",padding:"10px 12px",borderRadius:8}}>⚠️ {hata}</div>}
        
        <div style={{display:"flex",gap:12}}>
          <button onClick={()=>{setSifreUnuttumModal(false);setHata("");}} 
            style={{flex:1,padding:"12px",border:"1px solid #E5E7EB",borderRadius:12,background:"white",color:"#6B7280",fontWeight:600,cursor:"pointer",fontSize:14,transition:"all 0.2s"}} 
            onMouseEnter={(e)=>e.target.style.background="#F9FAFB"} 
            onMouseLeave={(e)=>e.target.style.background="white"}>
            İptal
          </button>
          <button onClick={sifreUnuttumGonder} 
            style={{flex:1,padding:"12px",background:"#1C4E60",color:"white",borderRadius:12,border:"none",fontWeight:600,cursor:"pointer",fontSize:14,transition:"all 0.2s",boxShadow:"0 4px 12px rgba(28,78,96,0.3)"}} 
            onMouseEnter={(e)=>e.target.style.background="#153a4d"} 
            onMouseLeave={(e)=>e.target.style.background="#1C4E60"}>
            Gönder
          </button>
        </div>
      </div>
    </div>
  )}
  </>;
};

export default function TradeFlow(){
  const [sekme,setSekme]=useState("anasayfa");
  const [jobs,setJobs]=useState(initJobs);
  const [teklifler,setTeklifler]=useState([]);
  const [giderler,setGiderler]=useState([]);
  const [faturalar,setFaturalar]=useState([]);
  const [bildirimler,setBildirimler]=useState([]);
  const [secili,setSecili]=useState(null);
  const [fatJob,setFatJob]=useState(null);
  const [yeniAc,setYeniAc]=useState(false);
  const [teklifAc,setTeklifAc]=useState(false);
  const [giderAc,setGiderAc]=useState(false);
  const [ekran,setEkran]=useState(null);
  const [asistanSoru,setAsistanSoru]=useState(null); // sesli komuttan gelen soru
  const [aramaAcik,setAramaAcik]=useState(false);   // genel arama ekranı
  const [vadeGun,setVadeGun]=useState(VADE_VARSAYILAN); // varsayılan ödeme vadesi (gün)
  const sonKayitRef=useRef("");      // buluta en son yazılan paketin imzası
  const boyutUyariRef=useRef(false); // boyut uyarısı bir kez gösterilsin
  const [sahitliJob,setSahitliJob]=useState(null);
  const [sahitliMod,setSahitliMod]=useState(null); // "duzenle" | "goruntule"
  const [isKolu,setIsKolu]=useState("Mekanik Tesisat");
  const [isKoluAc,setIsKoluAc]=useState(false);
  const [dil,setDil]=useState("tr");
  const [karanlik,setKaranlik]=useState(false);
  const [tema,setTema]=useState("acik");
  const [para,setPara]=useState("TL");
  const [kdv,setKdv]=useState(20);
  const [isletme,setIsletme]=useState({ad:"",yetkili:"",telefon:"",email:"",vergiNo:"",vergiDairesi:"",adres:""});
  const [planAc,setPlanAc]=useState(null);
  const [cekSenetler,setCekSenetler]=useState([]);
  const [ustaHarcamalar,setUstaHarcamalar]=useState([]);
  const [copKutusu,setCopKutusu]=useState([]); // {tip, veri, silinme}
  const [ozetSaat,setOzetSaat]=useState("19:00"); // ""=kapalı
  const copeAt=(tip,veri)=>setCopKutusu(p=>[{tip,veri,silinme:new Date().toISOString()},...p].slice(0,200));
  const [kasaAcik,setKasaAcik]=useState(false); // PIN doğrulandı mı (oturumluk)
  const jobPatch=(id,patch)=>setJobs(p=>p.map(j=>j.id===id?{...j,...patch}:j)); // null | sebep metni | true
  const [sesEfekt,setSesEfekt]=useState(true);
  SES_ACIK=sesEfekt;
  const [raporDonem,setRaporDonem]=useState("buAy"); // buAy | son3Ay | buYil | tumu
  // Aktif plan: satın alınan plan > deneme > starter
  const _simdi=Date.now();
  const denemeAktif=!isletme.plan&&isletme.denemeBitis&&new Date(isletme.denemeBitis).getTime()>_simdi;
  const plan=isletme.plan||(denemeAktif?"pro":"starter");
  const denemeKalan=denemeAktif?Math.ceil((new Date(isletme.denemeBitis).getTime()-_simdi)/86400000):0;
  PLAN_AKTIF=plan;
  // Plan kilidi yardımcıları
  const yeniIsKilit=()=>{
    if(plan==="starter"){
      const aktifIsler=jobs.filter(j=>j.durum!=="tamamlandi").length;
      if(aktifIsler>=PLAN_LIMIT.starter.is){setPlanAc((T.limitIs||"Başlangıç planında en fazla {n} aktif iş olabilir").replace("{n}",PLAN_LIMIT.starter.is)+" ("+aktifIsler+"/"+PLAN_LIMIT.starter.is+")");return true;}
    }
    return false;
  };
  const proKilit=(ozellik)=>{
    if(plan==="starter"){setPlanAc(ozellik+" "+(T.proPakette||"Pro pakette 👑"));return true;}
    return false;
  };
  const [toast,setToast]=useState(null);
  const [banner,setBanner]=useState(null);
  const [islerFiltre,setIslerFiltre]=useState(null);
  const [moduller,setModuller]=useState(MODUL_VARSAYILAN);
  const [ozellestirAc,setOzellestirAc]=useState(false);
  const [gibAyar,setGibAyar]=useState({entegrator:""});
  const [gibAcSekme,setGibAcSekme]=useState(null); // GİB ekranını hangi sekmede açacak
  const [tahsilatFiltre,setTahsilatFiltre]=useState(null);
  const [sonSilinen,setSonSilinen]=useState(null); // silme geri al
  const [duzenlenecekJob,setDuzenlenecekJob]=useState(null);
  const [yeniIsMusteri,setYeniIsMusteri]=useState(null); // müşteriden iş açarken ad hazır dolu
  const [giderMusteri,setGiderMusteri]=useState(null); // müşteriden gider açarken filtre
  const [ekip,setEkip]=useState([]); // ekip üyeleri [{ad,rol}] // iş düzenleme
  const [musteriKayitlari,setMusteriKayitlari]=useState([]); // bağımsız müşteri kayıtları
  const [,force]=useState(0);
  // ── SUPABASE OTURUM + BULUT VERİ ──
  const [kullanici,setKullanici]=useState(null);
  KURUCU_MU=((kullanici&&kullanici.email)||"").toLowerCase()===KURUCU_EMAIL;
  const [oturumKontrol,setOturumKontrol]=useState(true); // ilk açılışta oturum kontrol ediliyor
  useEffect(()=>{const s=document.getElementById("tfsplash");if(s)s.remove();},[]);
  // Ctrl+K / ⌘K ile genel aramayı aç
  useEffect(()=>{
    const f=(e)=>{
      if((e.ctrlKey||e.metaKey)&&(e.key==="k"||e.key==="K")){e.preventDefault();setAramaAcik(true);}
    };
    window.addEventListener("keydown",f);
    return ()=>window.removeEventListener("keydown",f);
  },[]);
  // Açılış bittikten sonra PDF modülünü arka planda önden indir (ilk rapor tıklaması beklemesin)
  useEffect(()=>{
    const t=setTimeout(()=>{ import("./pdf.js").catch(()=>{}); },5000);
    return ()=>clearTimeout(t);
  },[]);
  const [sifreKurtarma,setSifreKurtarma]=useState(false);
  const USTA_MI=((kullanici&&kullanici.email)||"").endsWith(USTA_EK);

  // İnternet gidince/gelince yakala
  useEffect(()=>{
    const gel=()=>{setCevrimici(true);setSenkronTik(t=>t+1);};
    const git=()=>setCevrimici(false);
    window.addEventListener("online",gel);window.addEventListener("offline",git);
    return ()=>{window.removeEventListener("online",gel);window.removeEventListener("offline",git);};
  },[]);
  const [veriYuklendi,setVeriYuklendi]=useState(false); // bulut verisi yüklendi mi (autosave için)
  // Yeni kullanıcıya 14 gün Pro denemesi başlat
  useEffect(()=>{
    if(veriYuklendi&&!isletme.plan&&!isletme.denemeBitis){
      setIsletme(i=>({...i,denemeBitis:new Date(Date.now()+14*86400000).toISOString()}));
    }
  },[veriYuklendi]);
  const [cevrimici,setCevrimici]=useState(typeof navigator==="undefined"?true:navigator.onLine); // internet var mı
  const [senkronBekliyor,setSenkronBekliyor]=useState(false); // buluta yazılamayan değişiklik var mı
  const [senkronTik,setSenkronTik]=useState(0); // internet gelince kaydetmeyi tetikler

  // Uygulama açılınca mevcut oturumu kontrol et
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setKullanici(data.session?.user||null);
      setOturumKontrol(false);
    });
    const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>{
      if(_e==="PASSWORD_RECOVERY"){setSifreKurtarma(true);}
      // Çevrimdışıyken token yenilenemedi diye kullanıcıyı DÜŞÜRME — internet gelince toparlanır
      if(!session&&!navigator.onLine)return;
      setKullanici(session?.user||null);
    });
    return ()=>{sub.subscription.unsubscribe();};
  },[]);

  // Kullanıcı giriş yapınca bulut verisini yükle
  useEffect(()=>{
    if(!kullanici){setVeriYuklendi(false);return;}
    let iptal=false;
    if(USTA_MI){setVeriYuklendi(true);return;}
    (async()=>{
      let v=null,kaynakYerel=false;
      try{
        if(!navigator.onLine)throw new Error("cevrimdisi");
        const {data,error}=await supabase.from("tradeflow_veri").select("veri").eq("kullanici_id",kullanici.id).maybeSingle();
        if(iptal)return;
        if(error){console.error("Veri yükleme:",error);}
        v=data?.veri;
      }catch(e){
        // Bulut erişilemedi — cihazdaki son yerel kopyadan yükle
        const yerel=await yerelYukle(kullanici.id);
        if(yerel&&yerel.paket){v=yerel.paket;kaynakYerel=true;setSenkronBekliyor(true);}
      }
      if(iptal)return;
      if(!v){ // Bulut boş/hatalı döndüyse cihazdaki son kopyayı dene
        const yerel=await yerelYukle(kullanici.id);
        if(yerel&&yerel.paket){v=yerel.paket;kaynakYerel=true;setSenkronBekliyor(true);}
      }
      if(iptal)return;
      try{
        if(v&&typeof v==="object"){
          if(Array.isArray(v.jobs))setJobs(v.jobs);
          if(Array.isArray(v.teklifler))setTeklifler(v.teklifler);
          if(Array.isArray(v.giderler))setGiderler(v.giderler);
          if(Array.isArray(v.faturalar))setFaturalar(v.faturalar);
          if(Array.isArray(v.musteriKayitlari))setMusteriKayitlari(v.musteriKayitlari);
          if(Array.isArray(v.ekip))setEkip(v.ekip);
          if(v.isletme)setIsletme(v.isletme);
          if(v.gibAyar)setGibAyar(v.gibAyar);
          if(v.dil)setDil(v.dil);
          if(typeof v.kdv==="number")setKdv(v.kdv);
          if(v.para)setPara(v.para);
          if(v.vadeGun!=null)setVadeGun(Number(v.vadeGun));
          if(typeof v.karanlik==="boolean")setKaranlik(v.karanlik);
          if(typeof v.tema==="string")setTema(temaCoz(v.tema));
          if(typeof v.sesEfekt==="boolean")setSesEfekt(v.sesEfekt);
          if(typeof v.raporDonem==="string")setRaporDonem(v.raporDonem);
          if(Array.isArray(v.cekSenetler))setCekSenetler(v.cekSenetler);
          if(Array.isArray(v.ustaHarcamalar))setUstaHarcamalar(v.ustaHarcamalar);
          if(Array.isArray(v.copKutusu))setCopKutusu(v.copKutusu.filter(c=>Date.now()-new Date(c.silinme).getTime()<30*86400000));
          if(typeof v.ozetSaat==="string")setOzetSaat(v.ozetSaat);
          if(Array.isArray(v.modulAktif)){
            // Sadece açık/kapalı durumunu uygula, fonksiyonlu yapıyı koru
            setModuller(MODUL_VARSAYILAN.map(md=>{
              const kayit=v.modulAktif.find(x=>x.id===md.id);
              return kayit?{...md,aktif:kayit.aktif}:md;
            }));
          }
          // ID sayacını en yüksek iş id'sine göre ilerlet
          const maxId=Math.max(0,...((v.jobs||[]).map(j=>j.id||0)));
          if(maxId>=nId)nId=maxId+1;
        }
      }catch(e){console.error(e);}
      if(!iptal){setVeriYuklendi(true);if(kaynakYerel)console.log("📡 Yerel kopyadan yüklendi — internet gelince senkronize edilecek");}
    })();
    return ()=>{iptal=true;};
  },[kullanici]);

  // ── OFFLINE-FIRST KAYIT ──
  // Her değişiklik ÖNCE cihaza (IndexedDB) yazılır — internet olmasa da veri güvende.
  // İnternet varsa buluta da gider; yoksa "senkron bekliyor" işaretlenir,
  // internet gelince (senkronTik) otomatik buluta akar.
  useEffect(()=>{
    if(!kullanici||!veriYuklendi)return;
    const zaman=setTimeout(async()=>{
      if(USTA_MI)return;
      const paket={jobs,teklifler,giderler,faturalar,musteriKayitlari,ekip,isletme,gibAyar,dil,kdv,para,vadeGun,cekSenetler,ustaHarcamalar,copKutusu,ozetSaat,karanlik,tema,sesEfekt,raporDonem,modulAktif:moduller.map(m=>({id:m.id,aktif:m.aktif}))};

      // ── Gereksiz yüklemeyi engelle ──
      // Veri gerçekten değişmediyse buluta tekrar yazma. Fotoğraflı kayıtlarda
      // paket birkaç MB olabiliyor; her küçük değişiklikte yeniden yüklemek
      // hem yavaş hem de mobil veriyi tüketiyordu.
      let imza="";
      try{ imza=JSON.stringify(paket); }catch{ imza=""; }
      const boyutMB=imza?imza.length/1048576:0;

      await yerelKaydet(kullanici.id,paket); // 1) cihaza — her zaman

      if(imza&&imza===sonKayitRef.current){ return; } // değişiklik yok → bulut atlanır

      // ── Boyut uyarısı ──
      // Supabase satırı çok büyürse kayıt sessizce başarısız olur ve veri kaybı riski doğar.
      if(boyutMB>4 && !boyutUyariRef.current){
        boyutUyariRef.current=true;
        goster("⚠️ Kayıt boyutu "+boyutMB.toFixed(1)+" MB — eski iş fotoğraflarını silmen önerilir");
      }
      if(boyutMB<=4) boyutUyariRef.current=false;

      if(!navigator.onLine){setSenkronBekliyor(true);return;} // internet yok: kuyrukta
      try{
        await supabase.from("tradeflow_veri").upsert({kullanici_id:kullanici.id,veri:paket,guncelleme:new Date().toISOString()},{onConflict:"kullanici_id"});
        sonKayitRef.current=imza;
        if(senkronBekliyor)goster(T.senkronOk);
        setSenkronBekliyor(false); // 2) buluta yazıldı
      }catch(e){
        console.error("Kaydetme:",e);
        setSenkronBekliyor(true);
        // Boyut kaynaklı hatayı kullanıcıya açıkça söyle — sessiz veri kaybı olmasın
        if(boyutMB>3)goster("⚠️ Kayıt buluta yazılamadı ("+boyutMB.toFixed(1)+" MB). Fotoğrafları azaltmayı dene.");
      }
    },800);
    return ()=>clearTimeout(zaman);
  },[jobs,teklifler,giderler,faturalar,musteriKayitlari,ekip,isletme,gibAyar,dil,kdv,para,cekSenetler,ustaHarcamalar,copKutusu,ozetSaat,karanlik,tema,sesEfekt,raporDonem,moduller,kullanici,veriYuklendi,senkronTik]);

  const cikisYap=async()=>{
    await supabase.auth.signOut();
    setKullanici(null);
    // Ekranı ilk haline döndür
    setJobs(initJobs);setTeklifler([]);setGiderler([]);setFaturalar([]);setMusteriKayitlari([]);
  };

  // 🔒 GÜVENLİK — Hareketsizlikte otomatik oturum kapatma
  // Ustanın telefonu şantiyede açık kalırsa veri başkasının eline geçmesin.
  const [kilitSure,setKilitSure]=useState(()=>{const v=localStorage.getItem("tf_kilit");return v==null?0:Number(v);});
  useEffect(()=>{
    if(!kullanici||kilitSure<=0)return;
    let zaman;
    const sifirla=()=>{
      clearTimeout(zaman);
      zaman=setTimeout(()=>{goster("🔒 Güvenlik için oturum kapatıldı");cikisYap();},kilitSure*60*1000);
    };
    const olaylar=["click","keydown","touchstart","scroll"];
    olaylar.forEach(o=>window.addEventListener(o,sifirla,{passive:true}));
    sifirla();
    return ()=>{clearTimeout(zaman);olaylar.forEach(o=>window.removeEventListener(o,sifirla));};
  },[kullanici,kilitSure]);
  const kilitAyarla=(dk)=>{setKilitSure(dk);localStorage.setItem("tf_kilit",String(dk));goster(dk>0?("🔒 "+dk+" dakikada otomatik kilit"):"🔓 Otomatik kilit kapalı");};

  // 💾 YEDEKLEME — Kullanıcı kendi verisini dosya olarak indirir
  const yedekAl=()=>{
    const paket={surum:1,tarih:new Date().toISOString(),isletme,jobs,teklifler,giderler,faturalar,musteriKayitlari,ekip,cekSenetler,ustaHarcamalar,gibAyar,dil,kdv,para};
    const blob=new Blob([JSON.stringify(paket,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="tradeflow-yedek-"+new Date().toISOString().slice(0,10)+".json";
    document.body.appendChild(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),3000);
    goster("💾 Yedek indirildi");
  };
  const yedekYukle=(dosya)=>{
    if(!dosya)return;
    const fr=new FileReader();
    fr.onload=()=>{
      try{
        const d=JSON.parse(fr.result);
        if(!d||typeof d!=="object"||!Array.isArray(d.jobs))throw new Error("bicim");
        if(!window.confirm("Yedek geri yüklenecek.\n\nMevcut veriler yedekteki verilerle DEĞİŞTİRİLECEK. Devam edilsin mi?"))return;
        if(d.isletme)setIsletme(d.isletme);
        setJobs(d.jobs||[]);setTeklifler(d.teklifler||[]);setGiderler(d.giderler||[]);
        setFaturalar(d.faturalar||[]);setMusteriKayitlari(d.musteriKayitlari||[]);
        setEkip(d.ekip||[]);setCekSenetler(d.cekSenetler||[]);
        if(d.dil)setDil(d.dil);if(d.kdv!=null)setKdv(d.kdv);if(d.para)setPara(d.para);if(d.vadeGun!=null)setVadeGun(Number(d.vadeGun));
        goster("✅ Yedek geri yüklendi");
      }catch(e){goster("❌ Dosya okunamadı — geçerli bir yedek dosyası seç");}
    };
    fr.readAsText(dosya);
  };

  C=karanlik?DARK:(TEMALAR[temaCoz(tema)]||LIGHT);
  // Ana rengi temadan al (karanlık modda tema vurgusu korunur, biraz açılır)
  {
    const tv=(TEMALAR[temaCoz(tema)]||LIGHT).vurgu||"#2E7490";
    anaRenkAyarla(karanlik?"#4A9EC0":tv);
  }
  const T=getT(dil);
  TT=T;
  paraAyarla(para);
  updateDurum(T);

  const DONEMLER={buAy:T.buAy||"Bu Ay",son3Ay:T.donemSon3Ay||"Son 3 Ay",buYil:T.donemBuYil||"Bu Yıl",tumu:T.donemTumu||"Tümü"};
  const donemBas=(()=>{const n=new Date();if(raporDonem==="buAy")return new Date(n.getFullYear(),n.getMonth(),1);if(raporDonem==="son3Ay")return new Date(n.getFullYear(),n.getMonth()-2,1);if(raporDonem==="buYil")return new Date(n.getFullYear(),0,1);return null;})();
  const donemFiltre=(dizi)=>donemBas?dizi.filter(x=>x.tarih&&new Date(x.tarih)>=donemBas):dizi;
  const goster=(m)=>{setToast(m);setTimeout(()=>setToast(null),2200);const s=String(m);if(s.includes("💰")||s.includes("Tahsil"))calSes("para");else if(s.includes("🗑")||s.includes("silindi"))calSes("sil");else if(s.includes("✓")||s.includes("✅")||s.includes("🎉")||s.includes("eklendi")||s.includes("kaydedildi"))calSes("basari");else calSes("tik");};
  // 🔒 Sabit referanslı handler'lar — memo korumasının gerçekten çalışması için
  const _h=useRef({});
  const sekmeGecS=useCallback((s)=>{setIslerFiltre(null);setTahsilatFiltre(null);setSekme(s);},[]);
  const yeniIsAcS=useCallback(()=>{if(!_h.current.yeniIsKilit())setYeniAc(true);},[]);
  const statClickS=useCallback((g)=>_h.current.statClick(g),[]);
  const sorS=useCallback((soru)=>{setAsistanSoru(soru);setEkran("asistan");},[]);
  const ozellestirAcS=useCallback(()=>setOzellestirAc(true),[]);
  const isKoluSecS=useCallback((k)=>{_h.current.setIsKolu(k);_h.current.goster(sektorBilgi(k).icon+" "+k+" akışına geçildi");},[]);
  useEffect(()=>{
    if(!veriYuklendi)return;
    const uc=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
    const bugun=new Date().toISOString().slice(0,10);
    // Çek/senet vadeleri
    const csUyar=cekSenetler.filter(c=>c.durum==="bekliyor"&&c.vade<=uc&&!c.uyarildi);
    csUyar.forEach(c=>bildirimEkle("⏰ Vade yaklaşıyor",(c.tip==="cek"?"Çek":"Senet")+" · "+c.kisi+" — "+fmt(c.tutar)+" · Vade: "+c.vade,"is",{tur:"kasa"}));
    if(csUyar.length>0)setCekSenetler(p=>p.map(c=>csUyar.some(u=>u.id===c.id)?{...c,uyarildi:true}:c));
    // İş hatırlatmaları
    const isUyar=jobs.filter(j=>j.durum!=="tamamlandi"&&j.hatirlatma&&j.hatirlatma.slice(0,10)<=uc&&j.hatirlatma.slice(0,10)>=bugun&&!j.uyarildi);
    isUyar.forEach(j=>bildirimEkle("🔔 İş hatırlatması",(j.baslik||"İş")+" · "+(j.musteri||"")+" · "+(j.hatirlatma||"").slice(0,16).replace("T"," "),"is",{tur:"is",ref:j.ref}));
    if(isUyar.length>0)setJobs(p=>p.map(j=>isUyar.some(u=>u.ref===j.ref)?{...j,uyarildi:true}:j));
  },[veriYuklendi,cekSenetler.length,jobs.length]);

  // 🔄 Usta köprüsü: buluttaki usta harcamaları/iş güncellemelerini periyodik çekip birleştir
  useEffect(()=>{
    if(!veriYuklendi||USTA_MI||!kullanici)return;
    let dur=false;
    const cek=async()=>{
      try{
        if(!navigator.onLine)return;
        const {data}=await supabase.from("tradeflow_veri").select("veri").eq("kullanici_id",kullanici.id).maybeSingle();
        if(dur||!data||!data.veri)return;
        const bulut=data.veri;
        // Harcamalar: id bazlı birleştir, yeni bekleyenleri bildir
        if(Array.isArray(bulut.ustaHarcamalar)){
          setUstaHarcamalar(p=>{
            const varIdler=new Set(p.map(h=>h.id));
            const yeniler=bulut.ustaHarcamalar.filter(h=>!varIdler.has(h.id));
            if(yeniler.length>0){
              yeniler.filter(h=>h.durum==="bekliyor").forEach(h=>bildirimEkle("🧾 Usta harcaması",(h.usta||"Usta")+": "+h.ad+" — "+fmt(h.tutar),"gider",{tur:"sekme",sekme:"giderler"}));
            }
            return yeniler.length>0?[...p,...yeniler]:p;
          });
        }
        // İşler: ustanın değiştirebildiği alanları birleştir
        if(Array.isArray(bulut.jobs)){
          setJobs(p=>{
            let degisti=false;
            const yeni=p.map(j=>{
              const c=bulut.jobs.find(x=>x.id===j.id);
              if(!c)return j;
              const f={};
              ["asama","durum","malzemeler","not","sesliNot"].forEach(k=>{
                if(c[k]!==undefined&&JSON.stringify(c[k])!==JSON.stringify(j[k]))f[k]=c[k];
              });
              if(Object.keys(f).length===0)return j;
              degisti=true;return {...j,...f};
            });
            return degisti?yeni:p;
          });
        }
      }catch(e){}
    };
    cek();
    const t=setInterval(cek,60000);
    return ()=>{dur=true;clearInterval(t);};
  },[veriYuklendi,kullanici]);

  // 🌙 Gün sonu özeti — kullanıcının seçtiği saatte bir kez
  useEffect(()=>{
    if(!veriYuklendi||USTA_MI||!ozetSaat)return;
    const kontrol=()=>{
      const simdi=new Date();
      const ss=String(simdi.getHours()).padStart(2,"0")+":"+String(simdi.getMinutes()).padStart(2,"0");
      const bugunT=simdi.toISOString().slice(0,10);
      if(ss!==ozetSaat)return;
      try{
        if(localStorage.getItem("tfOzetGun")===bugunT)return;
        localStorage.setItem("tfOzetGun",bugunT);
      }catch(e){}
      const yarinT=new Date(Date.now()+86400000).toISOString().slice(0,10);
      const bitenler=jobs.filter(j=>j.durum==="tamamlandi"&&(j.tarih||"")===bugunT);
      const tahsilat=bitenler.reduce((s,j)=>s+j.tutar,0);
      const yarinki=jobs.filter(j=>j.durum!=="tamamlandi"&&((j.tarih||"")===yarinT||(j.hatirlatma||"").startsWith(yarinT))).length;
      const bugunGider=giderler.filter(g=>(g.tarih||"")===bugunT).reduce((s,g)=>s+g.tutar,0);
      let m="Bugün "+bitenler.length+" iş bitirdin";
      if(tahsilat>0)m+=", "+fmt(tahsilat)+" tahsilat";
      if(bugunGider>0)m+=", "+fmt(bugunGider)+" gider";
      m+=". "+(yarinki>0?"Yarın "+yarinki+" randevun var. 💪":"Yarın için planlı işin yok — yarını planla! 🗓️");
      bildirimEkle("🌙 Gün Sonu Özeti",m,"is",{tur:"sekme",sekme:"raporlar"});
      goster("🌙 Gün sonu özetin hazır — Bildirimler'de");
    };
    kontrol();
    const t=setInterval(kontrol,30000);
    return ()=>clearInterval(t);
  },[veriYuklendi,ozetSaat,jobs,giderler]);
  const bildirimEkle=(baslik,mesaj,tip,hedef)=>setBildirimler(p=>[{id:Date.now()+Math.random(),baslik,mesaj,tip,hedef:hedef||null,okundu:false,zaman:new Date().toLocaleString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})},...p]);
  const bannerGoster=(baslik,mesaj,hedef)=>{setBanner({baslik,mesaj,hedef:hedef||null});setTimeout(()=>setBanner(null),5000);if(typeof Notification!=="undefined"&&Notification.permission==="granted"){try{new Notification(baslik,{body:mesaj});}catch(e){}}};
  const bildirimGit=(h)=>{
    if(!h){setSekme("bildiri");return;}
    if(h.tur==="is"){const j=jobs.find(x=>x.ref===h.ref||x.id===h.id);if(j){setSekme("isler");setSecili(j);}else{goster("Bu iş silinmiş olabilir");setSekme("bildiri");}}
    else if(h.tur==="kasa"){setEkran("kasa");}
    else if(h.tur==="sekme"){setIslerFiltre(null);setTahsilatFiltre(null);setSekme(h.sekme);}
    else{setSekme("bildiri");}
  };

  useEffect(()=>{
    // ── ANLIK KUR SİSTEMİ ──
    // 1. Piyasa kuru (anlık — öncelikli, kullanıcı isteği)
    // 2. TCMB resmî kur (piyasa erişilemezse yedek)
    // 3. Sabit yedek kur (ikisi de yoksa)
    const tcmbKuruCek=()=>{
      const tcmbUrl = (typeof window!=="undefined"&&window.location&&window.location.hostname!=="localhost"&&!window.location.hostname.includes("claude"))
        ? "/api/kur"
        : "https://www.tcmb.gov.tr/kurlar/today.xml";
      fetch(tcmbUrl).then(r=>{
        const ct=r.headers.get("content-type")||"";
        return ct.includes("json")?r.json():r.text();
      }).then(data=>{
        let usd=null,eur=null;
        if(typeof data==="object"&&data.USD){
          usd=data.USD;eur=data.EUR;
        }else if(typeof data==="string"){
          const usdM=data.match(/CurrencyCode="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          const eurM=data.match(/CurrencyCode="EUR"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          if(usdM)usd=parseFloat(usdM[1]);
          if(eurM)eur=parseFloat(eurM[1]);
        }
        if(usd&&eur){
          kurGuncelle({TL:1,USD:Math.round(usd*100)/100,EUR:Math.round(eur*100)/100},"tcmb");force(x=>x+1);
        }
      }).catch(()=>{});
    };
    const piyasaKuruCek=()=>{
      // Anlık piyasa kuru — öncelikli kaynak
      fetch("https://open.er-api.com/v6/latest/TRY").then(r=>r.json()).then(d=>{
        if(d&&d.rates&&d.rates.USD&&d.rates.EUR){
          kurGuncelle({TL:1,USD:Math.round((1/d.rates.USD)*100)/100,EUR:Math.round((1/d.rates.EUR)*100)/100},"canli");force(x=>x+1);
        }else{tcmbKuruCek();}
      }).catch(()=>{tcmbKuruCek();});
    };
    piyasaKuruCek();
    // Her 5 dakikada bir anlık kuru yenile
    const kurIv=setInterval(piyasaKuruCek,5*60*1000);
    return ()=>clearInterval(kurIv);
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      const simdi=Date.now();
      setJobs(prev=>{let deg=false;const yeni=prev.map(j=>{if(j.hatirlatma&&!j.hatirlatildi&&new Date(j.hatirlatma).getTime()<=simdi){deg=true;bildirimEkle("⏰ Hatırlatma: "+j.baslik,j.musteri+" - "+fmt(j.tutar),"hatirlatma",{tur:"is",id:j.id});bannerGoster("⏰ İş Hatırlatması",j.baslik+" ("+j.musteri+")",{tur:"is",id:j.id,ref:j.ref});return {...j,hatirlatildi:true};}return j;});return deg?yeni:prev;});
    },20000);
    return ()=>clearInterval(iv);
  },[]);

  const jobEkle=(j)=>{setJobs(p=>[j,...p]);bildirimEkle("✅ Yeni iş eklendi",j.baslik+" · "+j.musteri,"is",{tur:"is",id:j.id,ref:j.ref});goster("İş eklendi ✓");};
  const jobGuncelle=(j)=>{setJobs(p=>p.map(x=>x.id===j.id?j:x));goster("💾 İş güncellendi ✓");};
  const durumDegis=(id,d)=>{
    // Tamamlanma tarihi kaydedilir — ödeme vadesi bu günden başlar
    const bugunISO=new Date().toISOString().slice(0,10);
    setJobs(p=>p.map(j=>j.id===id?{...j,durum:d,tamamlanma:d==="tamamlandi"?(j.tamamlanma||bugunISO):j.tamamlanma}:j));
    if(d==="tamamlandi"){
      const j=jobs.find(x=>x.id===id);
      if(j){
        bildirimEkle("✅ İş tamamlandı",j.baslik,"is",{tur:"is",id:j.id,ref:j.ref});
        // Periyodik iş — bir sonraki dönem için otomatik yeni iş oluştur
        if(j.tekrar&&j.tekrar!=="yok"){
          const gun=j.tekrar==="haftalik"?7:j.tekrar==="aylik"?30:365;
          const yeniTarih=new Date(Date.now()+gun*864e5).toISOString().slice(0,10);
          const cid=nId;nId++;
          const yeniRef="IS-"+String(cid).padStart(4,"0");
          // ⚠️ Yeni dönem işi TEMİZ başlamalı. Eski işin fotoğrafları, sesli notu,
          // şahitli kaydı (imza + hash + GPS) ve fatura durumu kopyalanırsa
          // yeni iş, yapılmamış bir işin kanıtını taşımış olur.
          const {sahitli,fotolar,sesliNot,...taban}=j;
          setJobs(p=>[{
            ...taban,
            id:cid,ref:yeniRef,tarih:yeniTarih,
            durum:"bekliyor",asama:0,
            odemeler:[],faturalandi:false,
            hatirlatma:null,hatirlatildi:false,
          },...p]);
          bildirimEkle("🔁 Periyodik iş oluşturuldu",j.baslik+" → "+yeniTarih,"is",{tur:"is",id:cid,ref:yeniRef});
          goster("🔁 Sonraki dönem işi oluşturuldu: "+yeniTarih);
        }
      }
    }
  };
  const odemeEkleJob=(id,odeme)=>{
    setJobs(p=>p.map(j=>{
      if(j.id!==id)return j;
      const odemeler=[...(j.odemeler||[]),odeme];
      const toplam=odemeler.reduce((s,o)=>s+o.tutar,0);
      // Tamamı ödendiyse otomatik tamamla
      if(toplam>=j.tutar){bildirimEkle("💰 Tamamı tahsil edildi",j.baslik,"is",{tur:"is",id:j.id,ref:j.ref});return {...j,odemeler,durum:"tamamlandi"};}
      return {...j,odemeler};
    }));
    goster("💰 "+fmt(odeme.tutar)+" tahsil edildi ✓");
  };
  const jobSil=(id)=>{
    const j=jobs.find(x=>x.id===id);
    setJobs(p=>p.filter(x=>x.id!==id));
    if(j)copeAt("is",j);
    if(j){
      setSonSilinen(j);
      setTimeout(()=>setSonSilinen(s=>s&&s.id===j.id?null:s),6000);
      bildirimEkle("🗑️ İş silindi",j.baslik,"is",{tur:"sekme",sekme:"isler"});
    }
  };
  const geriAl=()=>{if(sonSilinen){setJobs(p=>[sonSilinen,...p]);goster("↩️ Geri alındı ✓");setSonSilinen(null);}};
  const faturaKesildi=(f)=>{
    setFaturalar(p=>[f,...p]);
    setJobs(p=>p.map(j=>j.ref===f.jobRef?{...j,faturalandi:true}:j)); // iş artık "kesilmedi" listesinde görünmez
    bildirimEkle("🧾 Fatura kesildi",f.no+" · "+f.musteri,"fatura",{tur:"sekme",sekme:"faturalar"});goster("Fatura kesildi ✓ "+f.no);
  };
  const teklifDonustur=(t)=>{const cid=nId;nId++;const yeniRef="IS-"+String(cid).padStart(4,"0");setJobs(p=>[{id:cid,ref:yeniRef,baslik:t.baslik,musteri:t.musteri,tarih:new Date().toISOString().slice(0,10),durum:"bekliyor",tutar:t.tutar,icon:"🏷️",iconBg:"#FEE2E2",hatirlatma:null,hatirlatildi:false,odemeler:[]},...p]);setTeklifler(p=>p.filter(x=>x.id!==t.id));goster("Teklif işe dönüştürüldü ✓");bildirimEkle("🏷️ Teklif kabul edildi",t.baslik,"is",{tur:"is",id:cid,ref:yeniRef});};
  const verileriSifirla=()=>{if(window.confirm("Tüm veriler silinecek. Emin misiniz?")){setJobs([]);setTeklifler([]);setGiderler([]);setFaturalar([]);setBildirimler([]);goster("Veriler sıfırlandı");}};
  const disaAktar=()=>{const data=JSON.stringify({jobs,teklifler,giderler,faturalar,isletme,gibAyar,musteriKayitlari,tarih:new Date().toISOString()},null,2);const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="tradeflow-yedek.json";a.click();URL.revokeObjectURL(url);goster("📤 Veriler indirildi");};
  const iceAktar=(e)=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=(ev)=>{
      try{
        const d=JSON.parse(ev.target.result);
        if(d.jobs)setJobs(d.jobs);
        if(d.teklifler)setTeklifler(d.teklifler);
        if(d.giderler)setGiderler(d.giderler);
        if(d.faturalar)setFaturalar(d.faturalar);
        if(d.isletme)setIsletme(d.isletme);
        if(d.gibAyar)setGibAyar(d.gibAyar);
        if(d.musteriKayitlari)setMusteriKayitlari(d.musteriKayitlari);
        // ID sayacını güncelle — çakışma olmasın
        const maxId=Math.max(0,...(d.jobs||[]).map(j=>j.id||0));
        if(maxId>=nId)nId=maxId+1;
        goster("📥 Yedek geri yüklendi ✓ ("+(d.jobs?.length||0)+" iş)");
        bildirimEkle("📥 Veriler içe aktarıldı",(d.jobs?.length||0)+" iş, "+(d.faturalar?.length||0)+" fatura","is");
      }catch(err){goster("❌ Geçersiz yedek dosyası");}
    };
    r.readAsText(file);
  };
  const statClick=(go)=>{if(go==="stat-aktif"){setIslerFiltre("aktif");setSekme("isler");}else if(go==="stat-bekleyen"){setIslerFiltre("bekliyor");setSekme("isler");}else if(go==="stat-tamamlandi"){setIslerFiltre("tamamlandi");setSekme("isler");}else if(go==="stat-tahsil"){setTahsilatFiltre("tahsil");setSekme("tahsilatlar");}else if(go==="stat-btahsilat"){setTahsilatFiltre("bekleyen");setSekme("tahsilatlar");}};
  _h.current={yeniIsKilit,statClick,goster,setIsKolu,plan};
  const okunmamis=bildirimler.filter(b=>!b.okundu).length;

  const NAV=[{id:"anasayfa",icon:"ti-home",label:T.anaSayfa},{id:"isler",icon:"ti-clipboard-text",label:T.isAkislari},{id:"fab",icon:"+",label:""},{id:"bildiri",icon:"ti-bell",label:T.bildirimlerT},{id:"profil",icon:"ti-user",label:T.profil}];

  // ── OTURUM KAPISI ──
  if(oturumKontrol){
    return <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{animation:"tfPulse 1.7s ease-in-out infinite"}}>
        <TFLogo boyut={132} koyu={koyuMu(C.bg)}/>
      </div>
      <style>{`@keyframes tfPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(0.94);opacity:0.78}}`}</style>
    </div>;
  }
  if(!kullanici){
    return <GirisEkrani onGiris={(u)=>setKullanici(u)}/>;
  }
  if(sifreKurtarma){
    return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:380,background:C.card,borderRadius:20,padding:"26px 22px",boxShadow:C.sh}}>
        <div style={{fontSize:38,textAlign:"center",marginBottom:10}}>🔐</div>
        <div style={{fontSize:17,fontWeight:800,color:C.t1,textAlign:"center",marginBottom:4}}>Yeni Şifre Belirle</div>
        <div style={{fontSize:12,color:C.t3,textAlign:"center",marginBottom:16}}>Sıfırlama bağlantısı doğrulandı — yeni şifreni yaz, kaydet, devam et.</div>
        <SifreDegistir onBitti={()=>setSifreKurtarma(false)}/>
      </div>
    </div>;
  }
  if(USTA_MI){
    return <UstaPanel kullanici={kullanici} T={T}/>;
  }
  if(!veriYuklendi)return <div style={{minHeight:"100vh",background:C.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
    {/* Logo */}
    <div style={{animation:"tfPulse 1.7s ease-in-out infinite"}}>
      <TFLogo boyut={132} koyu={koyuMu(C.bg)}/>
    </div>
    <style>{`@keyframes tfPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(0.94);opacity:0.78}}`}</style>
  </div>;

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",display:"flex",justifyContent:MASAUSTU?"flex-start":"center"}}>
      {MASAUSTU&&<Sidebar sekme={sekme} setSekme={sekmeGecS} T={T} isletme={isletme}/>}
      <div style={{width:"100%",maxWidth:MASAUSTU?1180:APP_W,display:"flex",flexDirection:"column",minHeight:"100vh",margin:MASAUSTU?"0 auto":undefined}}>

        {banner&&<div onClick={()=>{setBanner(null);bildirimGit(banner.hedef);}} style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 28px)",maxWidth:452,background:C.card,borderRadius:16,boxShadow:C.sh2,padding:"14px 16px",zIndex:3000,display:"flex",gap:12,alignItems:"center",cursor:"pointer",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:11,background:C.amberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⏰</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{banner.baslik}</div><div style={{fontSize:12,color:C.t2}}>{banner.mesaj}</div></div>
          <span style={{color:C.t3,fontSize:12}}>›</span>
        </div>}

        {!MASAUSTU&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"52px 16px 12px",background:C.bg,position:"sticky",top:0,zIndex:50}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <TFLogo boyut={32} sade ortala={false} koyu={koyuMu(C.bg)}/>
            <div><div style={{fontSize:14,fontWeight:800,color:C.t1,letterSpacing:"0.08em",lineHeight:1.1}}>TRADEFLOW</div><div style={{fontSize:9.5,fontWeight:800,letterSpacing:"0.3em",display:"flex",alignItems:"center"}}><LedImza boyut={10} metin="ERAİ" inline={true}/></div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div onClick={()=>setAramaAcik(true)} title="Ara" style={{cursor:"pointer",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-search" style={{fontSize:21,color:C.t1}} aria-hidden="true"/></div>
            <SesliKomut setSekme={sekmeGecS} setYeniAc={setYeniAc} setEkran={setEkran} goster={goster} yeniIsKilit={yeniIsKilit} onSor={sorS} acik/>
            <div onClick={()=>setSekme("bildiri")} style={{position:"relative",cursor:"pointer",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-bell" style={{fontSize:22,color:C.t1}} aria-hidden="true"/>{okunmamis>0&&<span style={{position:"absolute",top:5,right:5,width:9,height:9,borderRadius:"50%",background:"#2E7490",border:"2px solid "+C.bg}}/>}</div>
            <div onClick={()=>setSekme("profil")} style={{cursor:"pointer"}} title="Profil — fotoğraf eklemek için dokun">
              {isletme?.logo
                ? <img src={isletme.logo} alt="" style={{width:42,height:42,borderRadius:"50%",objectFit:"cover",display:"block",border:`2px solid ${C.card}`,boxShadow:"0 2px 8px rgba(16,24,40,0.14)"}}/>
                : <div style={{width:42,height:42,background:GRAD,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff"}}>{((isletme?.yetkili||kullanici?.email||"?").split(" ").map(w=>w[0]).join("").slice(0,2)).toUpperCase()}</div>}
            </div>
          </div>
        </div>}
        {MASAUSTU&&<DesktopHeader T={T} isletme={isletme} okunmamis={okunmamis} onBildirim={()=>setSekme("bildiri")} onYeniIs={()=>{if(!yeniIsKilit())setYeniAc(true);}} onAra={()=>setAramaAcik(true)} onAsistan={()=>setEkran("asistan")} isKolu={isKolu} setIsKolu={(k)=>{setIsKolu(k);goster(sektorBilgi(k).icon+" "+k+" akışına geçildi");}} onDunya={()=>setEkran("dunya")} onTema={()=>setSekme("profil")} setSekme={sekmeGecS} setYeniAc={setYeniAc} setEkran={setEkran} goster={goster} yeniIsKilit={yeniIsKilit} onSor={sorS}/>}

        <div style={{flex:1,overflowY:"auto",paddingBottom:MASAUSTU?30:90}}>
          {sekme==="anasayfa"&&<>{MASAUSTU?<><DesktopHero T={T} jobs={jobs} onYeniIs={()=>{if(!yeniIsKilit())setYeniAc(true);}} onTakvim={()=>setEkran("takvim")} onKasa={()=>setEkran("kasa")} setSekme={sekmeGecS} onAc={setEkran}/><DesktopStats jobs={jobs} faturalar={faturalar} T={T} onStatClick={statClickS}/><DesktopVade jobs={jobs} cekSenetler={cekSenetler} onKasa={()=>setEkran("kasa")} onIsSec={setSecili} vadeGun={vadeGun}/><QuickActions setSekme={sekmeGecS} T={T} moduller={moduller} onDuzenle={ozellestirAcS}/><DesktopCharts jobs={jobs} giderler={giderler} T={T} onDetayGelir={()=>setSekme("raporlar")} onDetayTahsilat={()=>setSekme("tahsilatlar")} onYeniIs={()=>{if(!yeniIsKilit())setYeniAc(true);}}/><PiyasaSeridi C={C} P={P} masaustu={true} T={T}/></>:<MobilAnaSayfa jobs={jobs} faturalar={faturalar} giderler={giderler} T={T} yetkili={isletme.yetkili} onYeniIs={yeniIsAcS} isKolu={isKolu} setIsKolu={isKoluSecS} onOzellestir={ozellestirAcS} onStatClick={statClickS} setSekme={sekmeGecS} onIsSec={setSecili} okunmamis={okunmamis} onKasa={()=>setEkran("kasa")} onTakvim={()=>setEkran("takvim")} cekSenetler={cekSenetler} onNakit={()=>setEkran("nakit")} onAc={setEkran} vadeGun={vadeGun}/>}<JobList jobs={jobs} onSelect={setSecili} T={T} onTum={()=>sekmeGecS("isler")}/>{!MASAUSTU&&<div style={{padding:"2px 0 14px"}}><LedImza boyut={13}/></div>}</>}
          {sekme==="isler"&&<IslerTab jobs={jobs} onSelect={setSecili} T={T} filtre={islerFiltre}/>}
          {sekme==="faturalar"&&<FaturalarTab faturalar={faturalar} jobs={jobs} isletme={isletme} onFaturaKes={setFatJob} onFaturaSil={(no)=>{const f=faturalar.find(x=>x.no===no);if(f){copeAt("fatura",f);setJobs(p=>p.map(j=>j.ref===f.jobRef?{...j,faturalandi:true}:j));}setFaturalar(p=>p.filter(x=>x.no!==no));goster("🗑️ Fatura silindi — Çöp Kutusu'nda 30 gün durur");}} T={T}/>}
          {sekme==="tahsilatlar"&&<TahsilatlarTab vadeGun={vadeGun} jobs={jobs} onTahsil={(id)=>{durumDegis(id,"tamamlandi");goster("💰 Tahsil edildi ✓");}} onSil={(id)=>{setJobs(p=>p.filter(j=>j.id!==id));goster("🗑️ Tahsilat kaydı silindi");}} filtre={tahsilatFiltre} T={T}/>}
          {sekme==="musteriler"&&<MusterilerTab jobs={jobs} T={T} musteriKayitlari={musteriKayitlari} giderler={giderler} isletme={isletme}
          onYeniIsIcin={(ad)=>{setYeniIsMusteri(ad);setYeniAc(true);}}
          onGiderIcin={(ad)=>{setGiderMusteri(ad);setGiderAc(true);}}
          onKayitSil={(ad)=>{setMusteriKayitlari(p=>p.filter(m=>m.ad!==ad));goster("Kayıt silindi");}}
          onMusteriEkle={(m)=>{if(plan==="starter"&&musteriKayitlari.length>=PLAN_LIMIT.starter.musteri){setPlanAc((T.limitMusteri||"Başlangıç planında en fazla {n} müşteri kaydedilebilir").replace("{n}",PLAN_LIMIT.starter.musteri));return;}setMusteriKayitlari(p=>[...p,m]);goster("👤 Müşteri eklendi ✓");bildirimEkle("👤 Yeni müşteri",m.ad,"is",{tur:"sekme",sekme:"musteriler"});}} onMusteriSil={(ad)=>{
          // Bağımsız kayıttan sil
          setMusteriKayitlari(p=>p.filter(m=>m.ad!==ad));
          // O müşterinin işlerini de sil (isteğe bağlı — onay modalında uyarıldı)
          setJobs(p=>p.filter(j=>j.musteri!==ad));
          goster("🗑️ Müşteri silindi ✓");
          bildirimEkle("🗑️ Müşteri silindi",ad,"is",{tur:"sekme",sekme:"musteriler"});
        }}/>}
          {sekme==="teklifler"&&<TekliflerTab teklifler={teklifler} onYeni={()=>setTeklifAc(true)} onDonustur={teklifDonustur} onSil={(id)=>{setTeklifler(p=>p.filter(t=>t.id!==id));goster(T.sil+" ✓");}} onDurumDegis={(id,d)=>{setTeklifler(p=>p.map(t=>t.id===id?{...t,durum_t:d}:t));goster(d==="onaylandi"?"✅ "+T.tamamlandi:"❌");}} T={T} isletme={isletme}/>}
          {sekme==="raporlar"&&<><div style={{padding:"12px 14px 0",display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(DONEMLER).map(([id,ad])=><button key={id} onClick={()=>setRaporDonem(id)} style={{background:raporDonem===id?P:C.card,color:raporDonem===id?"#fff":C.t2,border:`1px solid ${raporDonem===id?P:C.border}`,borderRadius:20,padding:"7px 14px",fontSize:12,fontWeight:700,cursor:"pointer"}}>{ad}</button>)}</div><RaporlarTab jobs={donemFiltre(jobs)} giderler={donemFiltre(giderler)} T={T} ekip={ekip}/></>}
          {sekme==="giderler"&&<UstaHarcamaKuyrugu harcamalar={ustaHarcamalar}
            onOnay={(h)=>{
              setGiderler(p=>[...p,{id:Date.now(),ad:(h.usta?h.usta+": ":"")+h.ad,kategori:"Usta Harcaması",tutar:h.tutar,tarih:h.tarih,isId:h.isId||null,fisFoto:h.fisFoto||null}]);
              setUstaHarcamalar(p=>p.map(x=>x.id===h.id?{...x,durum:"onaylandi"}:x));
              goster("✅ Harcama giderlere işlendi");
            }}
            onRed={(h)=>{
              setUstaHarcamalar(p=>p.map(x=>x.id===h.id?{...x,durum:"reddedildi"}:x));
              goster("❌ Harcama reddedildi");
            }}/>}
          {sekme==="giderler"&&<GiderlerTab giderler={giderler} onYeni={()=>setGiderAc(true)} onSil={(id)=>{const g=giderler.find(x=>x.id===id);if(g)copeAt("gider",g);setGiderler(p=>p.filter(x=>x.id!==id));goster("🗑️ Gider silindi — Çöp Kutusu'nda 30 gün durur");}} T={T}/>}
          {sekme==="daha"&&<DahaFazlaTab
          onExcelMuhasebe={()=>{if(proKilit(T.pdfRaporlarL||"PDF raporlar"))return;pdfMuhasebeRaporu(jobs,giderler,isletme);goster("📈 PDF raporu hazır");}}
          onExcelIs={()=>{if(proKilit(T.pdfRaporlarL||"PDF raporlar"))return;excelIsler(jobs,isletme);goster("📊 PDF hazır");}}
          onExcelGider={()=>{if(proKilit(T.pdfRaporlarL||"PDF raporlar"))return;excelGiderler(giderler,jobs,isletme);goster("📊 PDF hazır");}}
          onExcelFatura={()=>{if(proKilit(T.pdfRaporlarL||"PDF raporlar"))return;excelFaturalar(faturalar,isletme);goster("📊 PDF hazır");}}
          onPdf={()=>pdfMuhasebeRaporu(jobs,giderler,isletme)}
          onAc={setEkran} onSifirla={verileriSifirla} onExport={disaAktar} onImport={iceAktar} T={T}/>}
          {sekme==="bildiri"&&<BildirimlerTab bildirimler={bildirimler} onOkundu={()=>setBildirimler(p=>p.map(b=>({...b,okundu:true})))} T={T}
            onGit={(b)=>{
              setBildirimler(p=>p.map(x=>x.id===b.id?{...x,okundu:true}:x));
              bildirimGit(b.hedef);
            }}/>}
          {sekme==="profil"&&<ProfilSekmesi jobs={jobs} dil={dil} setDil={setDil} tema={tema} setTema={setTema} plan={plan} denemeKalan={denemeKalan} onPlanAc={()=>setPlanAc(true)} sesEfekt={sesEfekt} setSesEfekt={(v)=>{setSesEfekt(v);if(v)calSes("basari");}} ozetSaat={ozetSaat} setOzetSaat={(v)=>{setOzetSaat(v);if(v)goster("🌙 Gün sonu özeti: "+v);}} raporDonemAd={DONEMLER[raporDonem]} onRaporDonem={()=>{const sira=["buAy","son3Ay","buYil","tumu"];const yeni=sira[(sira.indexOf(raporDonem)+1)%sira.length];setRaporDonem(yeni);goster("📊 "+(T.donemL||"Dönem")+": "+DONEMLER[yeni]);}} karanlik={karanlik} setKaranlik={(v)=>{setKaranlik(v);goster(v?"🌙 Karanlık mod":"☀️ Açık mod");}} para={para} setPara={setPara} kdv={kdv} setKdv={setKdv} vadeGun={vadeGun} setVadeGun={setVadeGun} isletme={isletme} setIsletme={setIsletme} T={T} goster={goster} onAc={setEkran} gibAyar={gibAyar} setGibAyar={setGibAyar} gibAcSekme={gibAcSekme} onGibActemizle={()=>setGibAcSekme(null)} onCikis={cikisYap} kullaniciEmail={kullanici?.email} onKarne={statClick} kilitSure={kilitSure} onKilitAyarla={kilitAyarla} onYedekAl={yedekAl} onYedekYukle={yedekYukle}/>}
        </div>

        {(!cevrimici||senkronBekliyor)&&<div style={{position:"fixed",top:0,left:"50%",transform:"translateX(-50%)",zIndex:2000,background:!cevrimici?"#B45309":"#1C4E60",color:"#fff",fontSize:11.5,fontWeight:700,padding:"7px 16px",borderRadius:"0 0 12px 12px",boxShadow:"0 4px 14px rgba(0,0,0,0.25)",maxWidth:"92%",textAlign:"center"}}>
          {!cevrimici?T.cevrimdisiB:T.senkronB}
        </div>}
        {!MASAUSTU&&<div style={{position:"fixed",bottom:10,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 24px)",maxWidth:APP_W-24,background:C.card,display:"flex",alignItems:"center",padding:"10px 8px",borderRadius:26,boxShadow:"0 10px 30px rgba(80,60,140,0.18)",zIndex:100,border:`1px solid ${C.border}`}}>
          {NAV.map(n=>{
            if(n.id==="fab") return <div key="fab" style={{flex:1,display:"flex",justifyContent:"center"}}><button onClick={()=>{if(!yeniIsKilit())setYeniAc(true);}} style={{width:58,height:58,borderRadius:"50%",background:GRAD,border:"none",color:"#fff",fontSize:30,cursor:"pointer",boxShadow:"0 0 0 6px rgba(46,116,144,0.16), 0 8px 20px rgba(31,78,96,0.4)",marginTop:-26,display:"flex",alignItems:"center",justifyContent:"center"}}><i className="ti ti-plus" style={{fontSize:26}} aria-hidden="true"/></button></div>;
            const active=sekme===n.id;
            return <div key={n.id} onClick={()=>{setIslerFiltre(null);setTahsilatFiltre(null);setSekme(n.id);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",padding:"7px 0 5px",background:active?"#DCE7F8":"transparent",borderRadius:16,margin:"0 3px",transition:"background 0.15s"}}>
              <div style={{position:"relative",lineHeight:1}}>
                <i className={`ti ${n.icon}`} style={{fontSize:22,color:active?"#2563EB":C.t3}} aria-hidden="true"/>
                {n.id==="bildiri"&&okunmamis>0&&<div style={{position:"absolute",top:-5,right:-9,minWidth:15,height:15,borderRadius:8,background:"#E5484D",color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>{okunmamis}</div>}
              </div>
              <div style={{fontSize:10.5,fontWeight:700,color:active?"#2563EB":C.t3}}>{n.label}</div>
            </div>;
          })}
        </div>}

        {planAc&&<PlanModal onKapat={()=>setPlanAc(null)} sebep={typeof planAc==="string"?planAc:null} plan={plan} denemeKalan={denemeKalan} omurBoyu={isletme.omurBoyu} onPromo={(kod)=>{
          if(kod==="VGTDMS"){setIsletme(i=>({...i,plan:"elite",omurBoyu:true}));goster("🎉 Ömür boyu Elite tanımlandı!");return true;}
          return false;
        }}/>}
        {secili&&<DetayModal job={jobs.find(j=>j.id===secili.id)||secili} onKapat={()=>setSecili(null)} onDurum={durumDegis} onFatura={()=>{setFatJob(secili);setSecili(null);}} onSil={jobSil} onDuzenle={()=>{setDuzenlenecekJob(jobs.find(j=>j.id===secili.id)||secili);setSecili(null);}} onOdeme={odemeEkleJob} T={T} giderler={giderler} onPatch={jobPatch} onSahitli={(j)=>{const g=jobs.find(x=>x.id===j.id)||j;setSahitliJob(g);setSahitliMod(g.sahitli?"goruntule":"duzenle");setSecili(null);}}/>}
        {fatJob&&<FaturaModal job={fatJob} isletme={isletme} kdv={kdv} T={T} onKapat={()=>setFatJob(null)} onKesildi={faturaKesildi} gibAyar={gibAyar} onGibAc={(sekme)=>{setFatJob(null);setSekme("profil");setTimeout(()=>setGibAcSekme(sekme),100);}}/>}
        {yeniAc&&<YeniIsModal onKapat={()=>{setYeniAc(false);setYeniIsMusteri(null);}} onEkle={jobEkle} T={T} isKolu={isKolu} onIsKolu={isKoluSecS} jobs={jobs} varsayilanMusteri={yeniIsMusteri} ekip={ekip} sesliMetin={yeniAc&&yeniAc.sesli}/>}
        {duzenlenecekJob&&<YeniIsModal onKapat={()=>setDuzenlenecekJob(null)} onEkle={jobGuncelle} T={T} duzenlenecek={duzenlenecekJob} isKolu={isKolu} jobs={jobs} ekip={ekip}/>}
        {sonSilinen&&<div style={{position:"fixed",bottom:160,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"12px 18px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:12,whiteSpace:"nowrap"}}>
          🗑️ İş silindi
          <button onClick={geriAl} style={{background:P,border:"none",borderRadius:8,padding:"6px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>↩️ Geri Al</button>
        </div>}
        {teklifAc&&<TeklifModal T={T} kdv={kdv} onKapat={()=>setTeklifAc(false)} onEkle={(t)=>{setTeklifler(p=>[t,...p]);goster("Teklif oluşturuldu ✓");}}/>}
        {giderAc&&<GiderModal T={T} isKolu={isKolu} jobs={jobs} musteriFiltre={giderMusteri} onKapat={()=>{setGiderAc(false);setGiderMusteri(null);}} onEkle={(g)=>{setGiderler(p=>[g,...p]);goster("💸 Gider eklendi ✓");bildirimEkle("💸 Gider eklendi",g.ad+(g.isAdi?" → "+g.isAdi:""),"is",{tur:"sekme",sekme:"giderler"});}}/>}
        {ekran==="yardim"&&<YardimMerkezi onKapat={()=>setEkran(null)}/>}
        {ekran==="asistan"&&<AsistanEkrani onKapat={()=>{setEkran(null);setAsistanSoru(null);}} ilkSoru={asistanSoru} sesliBasla={!!asistanSoru} T={T} jobs={jobs} giderler={giderler} faturalar={faturalar} musteriKayitlari={musteriKayitlari} isletme={isletme}/>}
        {ekran==="takvim"&&<TakvimEkrani onKapat={()=>setEkran(null)} jobs={jobs} onIsSec={(j)=>{setEkran(null);setSecili(j);}}/>}
        {ekran==="cop"&&<CopKutusuEkrani onKapat={()=>setEkran(null)} copKutusu={copKutusu}
          onGeriAl={(i)=>{const c=copKutusu[i];if(!c)return;
            if(c.tip==="is")setJobs(p=>[...p,c.veri]);
            else if(c.tip==="gider")setGiderler(p=>[...p,c.veri]);
            else if(c.tip==="fatura")setFaturalar(p=>[...p,c.veri]);
            setCopKutusu(p=>p.filter((_,x)=>x!==i));goster("↩️ Geri alındı");}}
          onKaliciSil={(i)=>{if(window.confirm("Bu kayıt KALICI olarak silinecek — geri dönüşü yok. Emin misin?"))setCopKutusu(p=>p.filter((_,x)=>x!==i));}}/>}
        {ekran==="kurucu"&&<KurucuPanel onKapat={()=>setEkran(null)}/>}
        {(aramaAcik||ekran==="arama")&&<AramaEkrani onKapat={()=>{setAramaAcik(false);if(ekran==="arama")setEkran(null);}} jobs={jobs} musteriKayitlari={musteriKayitlari}
          faturalar={faturalar} teklifler={teklifler} giderler={giderler} T={T}
          onIsSec={(j)=>setSecili(j)} onSekme={(sk)=>sekmeGecS(sk)}/>}
        {ekran==="dunya"&&<DunyaSaatleriEkrani C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh} onKapat={()=>setEkran(null)}/>}
        {ekran==="eglence"&&<Suspense fallback={<YukleniyorPerde metin="🎮 Oyunlar yükleniyor…"/>}><EglenceKosesi onKapat={()=>setEkran(null)} C={C} P={P} GRAD={GRAD} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh}/></Suspense>}
        {ekran==="nakit"&&<NakitDetayEkrani jobs={jobs} cekSenetler={cekSenetler} giderler={giderler} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh} onKapat={()=>setEkran(null)}/>}
        {sahitliJob&&sahitliMod==="duzenle"&&<SahitliIsEkrani job={sahitliJob} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh} goster={goster} onKapat={()=>{setSahitliJob(null);setSahitliMod(null);}} onKaydet={(kayit)=>{jobPatch(sahitliJob.id,{sahitli:kayit});}}/>}
        {sahitliJob&&sahitliMod==="goruntule"&&<SahitliIsGoruntule job={jobs.find(j=>j.id===sahitliJob.id)||sahitliJob} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh} onKapat={()=>{setSahitliJob(null);setSahitliMod(null);}} onDuzenle={()=>setSahitliMod("duzenle")}/>}
        {ekran==="kasa"&&!kasaAcik&&<PinKapi kayitliPin={isletme.kasaPin} onPinAyarla={(p)=>{setIsletme(i=>({...i,kasaPin:p}));goster("🔐 PIN kaydedildi");}} onBasari={()=>setKasaAcik(true)} onKapat={()=>setEkran(null)}/>}
        {ekran==="kasa"&&kasaAcik&&<KasaEkrani onKapat={()=>{setEkran(null);setKasaAcik(false);}} cekSenetler={cekSenetler} setCekSenetler={setCekSenetler} jobs={jobs} giderler={giderler} goster={goster}/>}
        {ekran==="ekip"&&<EkipEkrani onKapat={()=>setEkran(null)} ekip={ekip} setEkip={setEkip} jobs={jobs} goster={goster} T={T} kullaniciId={kullanici&&kullanici.id}/>}
        {ekran==="gizlilik"&&<GizlilikEkrani onKapat={()=>setEkran(null)}/>}
        {ekran==="degerlendir"&&<DegerlendirModal onKapat={()=>setEkran(null)} onGonder={(y,o)=>{goster("⭐".repeat(y)+" "+T.tesekkurler);bildirimEkle("⭐ Değerlendirme gönderildi",y+" yıldız"+(o?" + öneri":""),"is");}} T={T}/>}
        {ozellestirAc&&<OzellestirModal moduller={moduller} setModuller={setModuller} onKapat={()=>setOzellestirAc(false)} T={T}/>}

        {toast&&<div style={{position:"fixed",bottom:MASAUSTU?40:110,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"12px 24px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",whiteSpace:"nowrap"}}>{toast}</div>}
      </div>
    </div>
  );
}
