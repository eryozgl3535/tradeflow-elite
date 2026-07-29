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
    {kod:"USD",  ad:"Dolar",      deger:veri&&veri.USD,       eski:onceki&&onceki.USD,       renk:"#0E9F6E"},
    {kod:"EUR",  ad:"Euro",       deger:veri&&veri.EUR,       eski:onceki&&onceki.EUR,       renk:"#3B82F6"},
    {kod:"GBP",  ad:"Sterlin",    deger:veri&&veri.GBP,       eski:onceki&&onceki.GBP,       renk:"#7C3AED"},
    {kod:"ALTIN",ad:"Gram Altın", deger:veri&&veri.gramAltin, eski:onceki&&onceki.gramAltin, renk:"#C9A24B"},
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

  return <div style={{
    background:C.card, border:`1px solid ${C.border}`, borderRadius:masaustu?18:16,
    padding:masaustu?"14px 18px":"13px 15px",
    margin:masaustu?"0 28px 16px":"0 0 16px",
  }}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:11}}>
      <span style={{width:7,height:7,borderRadius:"50%",background:cevrimdisi?"#94A3B8":"#0E9F6E",display:"block",
        boxShadow:cevrimdisi?"none":"0 0 0 3px #0E9F6E22"}}/>
      <span style={{fontSize:masaustu?14:13,fontWeight:700,color:C.t1,flex:1}}>Canlı Piyasa</span>
      {cevrimdisi
        ? <span style={{fontSize:9,fontWeight:700,color:C.t3,background:C.bg,borderRadius:8,padding:"2px 8px"}}>ÇEVRİMDIŞI</span>
        : veri&&veri.kaynak && <span style={{fontSize:9,fontWeight:700,color:C.t3,letterSpacing:"0.04em"}}>{veri.kaynak}</span>}
      <button onClick={yenile} aria-label="Yenile" style={{background:"transparent",border:"none",cursor:"pointer",padding:2,display:"flex",color:C.t3}}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 11.5A8 8 0 1 0 18.4 16"/><path d="M20 5.5v6h-6"/>
        </svg>
      </button>
    </div>

    <div style={{display:"grid",gridTemplateColumns:`repeat(${masaustu?4:2},1fr)`,gap:masaustu?12:10}}>
      {yukleniyor && !veri
        ? [0,1,2,3].map(i=><div key={i} style={{height:masaustu?56:52,borderRadius:11,background:C.bg}}/>)
        : kalemler.map(k=>{
          const y=yon(k);
          return <div key={k.kod} style={{background:C.bg,borderRadius:11,padding:masaustu?"9px 12px":"9px 11px",borderLeft:`3px solid ${k.renk}`}}>
            <div style={{fontSize:10,fontWeight:700,color:C.t3,letterSpacing:"0.04em",marginBottom:3}}>{k.ad}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:5}}>
              <span style={{fontSize:masaustu?16.5:15,fontWeight:800,color:C.t1,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.01em"}}>
                {bicim(k.deger)}
              </span>
              <span style={{fontSize:10.5,color:C.t3,fontWeight:700}}>₺</span>
              {y&&<span style={{fontSize:10,fontWeight:800,color:y==="yukari"?"#0E9F6E":"#DC2626",marginLeft:"auto"}}>
                {y==="yukari"?"▲":"▼"}
              </span>}
            </div>
          </div>;
        })}
    </div>

    {guncelleme && <div style={{fontSize:10,color:C.t3,marginTop:9,textAlign:"right"}}>
      {cevrimdisi?"Son bilinen: ":"Güncelleme: "}{guncelleme}
      {veri&&veri.tarih&&veri.kaynak==="TCMB" ? " · TCMB "+veri.tarih : ""}
    </div>}
  </div>;
}
