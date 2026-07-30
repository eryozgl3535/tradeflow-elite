// ═══════════════════════════════════════════════════════════════
// 💱 CANLI PİYASA
// Serbest piyasa döviz kuru + gram altın. 5 dk'da bir yenilenir.
// Son değerler cihazda saklanır — internet yoksa onlar gösterilir.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";

const ANAHTAR = "tf_piyasa";
const YENILE_MS = 5 * 60 * 1000;

function yerelOku(){
  try{ const d=JSON.parse(localStorage.getItem(ANAHTAR)||"null"); return d&&d.veri?d:null; }catch{ return null; }
}
function yerelYaz(veri){
  try{ localStorage.setItem(ANAHTAR,JSON.stringify({veri,zaman:Date.now()})); }catch{}
}
const bicim = (n) => n==null ? "—" :
  new Intl.NumberFormat("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);

export function usePiyasa(){
  const kayit = yerelOku();
  const [veri,setVeri]   = useState(kayit?kayit.veri:null);
  const [onceki,setOnceki] = useState(null);
  const [zaman,setZaman] = useState(kayit?kayit.zaman:null);
  const [yukleniyor,setYukleniyor] = useState(!kayit);
  const [cevrimdisi,setCevrimdisi] = useState(false);

  const cek = async () => {
    try{
      setYukleniyor(v=>v&&true);
      const r = await fetch("/api/kur",{cache:"no-store"});
      if(!r.ok) throw new Error("kur alinamadi");
      const d = await r.json();
      if(d.error) throw new Error(d.error);
      setOnceki(o=>{ const eski=yerelOku(); return eski?eski.veri:o; });
      setVeri(d); setZaman(Date.now()); setCevrimdisi(false); yerelYaz(d);
    }catch{
      setCevrimdisi(true);
    }finally{
      setYukleniyor(false);
    }
  };

  useEffect(()=>{
    if(!kayit || Date.now()-kayit.zaman > YENILE_MS) cek();
    const t=setInterval(cek, YENILE_MS);
    const gorunur=()=>{ if(document.visibilityState==="visible") cek(); };
    document.addEventListener("visibilitychange",gorunur);
    return ()=>{clearInterval(t);document.removeEventListener("visibilitychange",gorunur);};
  // eslint-disable-next-line
  },[]);

  return {veri,onceki,zaman,yukleniyor,cevrimdisi,yenile:cek};
}

// ─── Piyasa şeridi ───
export function PiyasaSeridi({C,P,masaustu=false}){
  const {veri,onceki,zaman,yukleniyor,cevrimdisi,yenile} = usePiyasa();

  const kalemler = [
    {kod:"USD",  ad:"USD",  deger:veri&&veri.USD,       eski:onceki&&onceki.USD},
    {kod:"EUR",  ad:"EUR",  deger:veri&&veri.EUR,       eski:onceki&&onceki.EUR},
    {kod:"GBP",  ad:"GBP",  deger:veri&&veri.GBP,       eski:onceki&&onceki.GBP},
    {kod:"ALTIN",ad:"Altın",deger:veri&&veri.gramAltin, eski:onceki&&onceki.gramAltin},
  ].filter(k=>k.deger!=null || yukleniyor);

  if(!yukleniyor && kalemler.length===0) return null;

  const guncelleme = zaman
    ? new Date(zaman).toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"})
    : null;

  const yon=(k)=>{
    if(k.eski==null||k.deger==null) return null;
    const f=k.deger-k.eski;
    if(Math.abs(f)<0.0001) return null;
    return f>0?"yukari":"asagi";
  };

  // Sade, ince, tek satır kaydırılabilir şerit — ana ekranın alt bilgi çubuğu
  return <div style={{
    display:"flex",alignItems:"center",gap:masaustu?14:10,
    padding:masaustu?"10px 28px":"9px 2px",
    margin:masaustu?"0 0 14px":"2px 0 8px",
    overflowX:"auto",
  }}>
    <span style={{width:6,height:6,borderRadius:"50%",background:cevrimdisi?"#94A3B8":"#0E9F6E",display:"block",flexShrink:0}}/>
    {yukleniyor && !veri
      ? <span style={{fontSize:11.5,color:C.t3}}>Piyasa yükleniyor…</span>
      : kalemler.map(k=>{
        const y=yon(k);
        return <span key={k.kod} style={{display:"flex",alignItems:"baseline",gap:4,flexShrink:0}}>
          <span style={{fontSize:10.5,fontWeight:700,color:C.t3}}>{k.ad}</span>
          <span style={{fontSize:12.5,fontWeight:800,color:C.t1,fontVariantNumeric:"tabular-nums"}}>{bicim(k.deger)}</span>
          {y && <span style={{fontSize:9.5,fontWeight:800,color:y==="yukari"?"#0E9F6E":"#DC2626"}}>{y==="yukari"?"▲":"▼"}</span>}
        </span>;
      })}
    <span style={{marginLeft:"auto",fontSize:9.5,color:C.t3,flexShrink:0,paddingLeft:8}}>
      {cevrimdisi?"çevrimdışı":guncelleme?guncelleme:""}
    </span>
    <button onClick={yenile} aria-label="Yenile" style={{background:"transparent",border:"none",cursor:"pointer",padding:2,display:"flex",color:C.t3,flexShrink:0}}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 11.5A8 8 0 1 0 18.4 16"/><path d="M20 5.5v6h-6"/>
      </svg>
    </button>
  </div>;
}
