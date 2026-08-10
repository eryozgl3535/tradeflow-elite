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
export function PiyasaSeridi({C,P,masaustu=false,T={}}){
  const {veri,onceki,zaman,yukleniyor,cevrimdisi,yenile} = usePiyasa();

  const kalemler = [
    {kod:"USD",  ad:"USD",  sembol:"$", deger:veri&&veri.USD,       eski:onceki&&onceki.USD,       renk:"#2563EB"},
    {kod:"EUR",  ad:"EUR",  sembol:"€", deger:veri&&veri.EUR,       eski:onceki&&onceki.EUR,       renk:"#7C3AED"},
    {kod:"GBP",  ad:"GBP",  sembol:"£", deger:veri&&veri.GBP,       eski:onceki&&onceki.GBP,       renk:"#0E9F6E"},
    {kod:"ALTIN",ad:"Altın",sembol:"Au",deger:veri&&veri.gramAltin, eski:onceki&&onceki.gramAltin,  renk:"#D97706"},
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

  // Zarif çip tasarımı — renkli sembol + değer + trend, başlık satırıyla
  return <div style={{padding:masaustu?"6px 4px 0":"2px 2px 0"}}>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:11}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <span style={{width:7,height:7,borderRadius:"50%",background:cevrimdisi?"#94A3B8":"#0E9F6E",display:"block",boxShadow:cevrimdisi?"none":"0 0 0 3px #0E9F6E22"}}/>
        <span style={{fontSize:13,fontWeight:800,color:C.t1}}>{T.piyasaCanli||"💱 Canlı Piyasa"}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:10,color:C.t3}}>{cevrimdisi?(T.piyasaCevrimdisi||"çevrimdışı"):guncelleme?guncelleme:""}</span>
        <button onClick={yenile} aria-label="Yenile" style={{background:C.bg,border:"none",borderRadius:8,cursor:"pointer",padding:6,display:"flex",color:C.t3}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 11.5A8 8 0 1 0 18.4 16"/><path d="M20 5.5v6h-6"/>
          </svg>
        </button>
      </div>
    </div>
    <div style={{display:"flex",gap:8,overflowX:"auto"}}>
      {yukleniyor && !veri
        ? <span style={{fontSize:11.5,color:C.t3,padding:"8px 0"}}>{T.piyasaYukleniyor||"Piyasa yükleniyor…"}</span>
        : kalemler.map(k=>{
          const y=yon(k);
          return <div key={k.kod} style={{flex:"1 0 auto",minWidth:82,background:k.renk+"12",border:`1px solid ${k.renk}28`,borderRadius:13,padding:"9px 11px"}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
              <div style={{width:19,height:19,borderRadius:"50%",background:k.renk,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <span style={{fontSize:10,fontWeight:800,color:"#fff"}}>{k.sembol}</span>
              </div>
              <span style={{fontSize:10,fontWeight:700,color:k.renk}}>{k.ad}</span>
            </div>
            <div style={{display:"flex",alignItems:"baseline",gap:4}}>
              <span style={{fontSize:14,fontWeight:800,color:C.t1,fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap"}}>{bicim(k.deger)}</span>
              {y && <span style={{fontSize:9.5,fontWeight:800,color:y==="yukari"?"#0E9F6E":"#DC2626"}}>{y==="yukari"?"▲":"▼"}</span>}
            </div>
          </div>;
        })}
    </div>
  </div>;
}
