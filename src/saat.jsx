// ═══════════════════════════════════════════════════════════════
// 🌅 SAAT & GÖKYÜZÜ
// Günün saatine göre değişen selamlama, güneşin doğuşu/batışı,
// canlı saat ve dünya saatleri ekranı.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";

// Saatten günün dilimini çıkar
export function gunDilimi(saat){
  if(saat>=5  && saat<11) return "sabah";
  if(saat>=11 && saat<17) return "ogle";
  if(saat>=17 && saat<21) return "aksam";
  return "gece";
}
export const DILIM_METIN = {
  sabah:{selam:"Günaydın",  alt:"Güne erken başlamak iyi gelir."},
  ogle: {selam:"Tünaydın",  alt:"Günün ortası — işler nasıl gidiyor?"},
  aksam:{selam:"İyi akşamlar", alt:"Günü toparlama vakti."},
  gece: {selam:"İyi geceler",  alt:"Geç saatte hâlâ iş başında."},
};

// ─── Gökyüzü sahnesi ───
// Güneş/ay saate göre yay üzerinde ilerler; gökyüzü rengi değişir.
export function GokyuzuSahne({saat,dk=0,g=64}){
  const dilim=gunDilimi(saat);
  const t=saat+dk/60;

  // Güneş yayı: 06:00 doğuş → 19:00 batış
  const dogus=6, batis=19;
  const oran=Math.min(1,Math.max(0,(t-dogus)/(batis-dogus)));  // 0..1
  const gunduz=t>=dogus&&t<=batis;
  // Ay yayı: 19:00 → 06:00
  const gOran=gunduz?0:(t>batis?(t-batis)/(24-batis+dogus):(t+24-batis)/(24-batis+dogus));

  const p=gunduz?oran:gOran;
  const cx=8+p*48;                       // yatay ilerleme
  const cy=44-Math.sin(p*Math.PI)*26;    // yay (yukarı çıkıp iner)

  const gok={
    sabah:["#FFE9C4","#FFC98A"],
    ogle: ["#BFE6F7","#7EC8ED"],
    aksam:["#FFC48C","#F08A6E"],
    gece: ["#1E2C48","#0F1729"],
  }[dilim];

  const cisimRenk=dilim==="gece"?"#E8EDF5":dilim==="sabah"?"#FFB13B":dilim==="aksam"?"#FF7847":"#FFC61A";
  const halo   =dilim==="gece"?"#E8EDF522":dilim==="aksam"?"#FF784733":"#FFC61A38";

  return <svg width={g} height={g*0.72} viewBox="0 0 64 46" style={{display:"block",borderRadius:11,flexShrink:0}} aria-hidden="true">
    <defs>
      <linearGradient id="gokG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={gok[0]}/><stop offset="100%" stopColor={gok[1]}/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="64" height="46" rx="8" fill="url(#gokG)"/>

    {/* gece yıldızları */}
    {dilim==="gece"&&[[12,10],[22,7],[45,12],[54,8],[33,6],[18,18],[50,20]].map(([x,y],i)=>
      <circle key={i} cx={x} cy={y} r={i%3===0?0.9:0.6} fill="#fff" opacity={0.55+((i*7)%30)/100}/>)}

    {/* gündüz bulutları */}
    {dilim!=="gece"&&<g opacity={dilim==="ogle"?0.85:0.6}>
      <ellipse cx="16" cy="14" rx="7.5" ry="3.2" fill="#ffffffcc"/>
      <ellipse cx="21" cy="13" rx="5" ry="2.6" fill="#ffffffcc"/>
      <ellipse cx="47" cy="20" rx="6" ry="2.6" fill="#ffffffa8"/>
    </g>}

    {/* güneş / ay — halo + gövde */}
    <circle cx={cx} cy={cy} r="11" fill={halo}/>
    <circle cx={cx} cy={cy} r="6.6" fill={cisimRenk}/>
    {dilim==="gece"&&<circle cx={cx+2.6} cy={cy-2.2} r="5.4" fill={gok[0]}/>}
    {/* güneş ışınları (sadece öğle) */}
    {dilim==="ogle"&&[0,45,90,135,180,225,270,315].map(a=>{
      const r=(a*Math.PI)/180;
      return <line key={a} x1={cx+Math.cos(r)*9} y1={cy+Math.sin(r)*9}
        x2={cx+Math.cos(r)*11.5} y2={cy+Math.sin(r)*11.5} stroke={cisimRenk} strokeWidth="1.4" strokeLinecap="round" opacity="0.75"/>;
    })}

    {/* ufuk / zemin */}
    <path d="M0 38 Q16 33 32 37 Q48 41 64 35 L64 46 L0 46 Z"
      fill={dilim==="gece"?"#0A1120":"#00000018"}/>
  </svg>;
}

// ─── Selamlama + canlı saat (masaüstü başlığı) ───
export function SelamSaat({ad,C,P,onDunya}){
  const [now,setNow]=useState(()=>new Date());
  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return ()=>clearInterval(t);},[]);
  const saat=now.getHours(), dk=now.getMinutes();
  const d=DILIM_METIN[gunDilimi(saat)];
  const ss=String(saat).padStart(2,"0"), mm=String(dk).padStart(2,"0"), sn=String(now.getSeconds()).padStart(2,"0");
  const tarih=now.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"});

  return <div style={{display:"flex",alignItems:"center",gap:15}}>
    <GokyuzuSahne saat={saat} dk={dk} g={68}/>
    <div>
      <div style={{fontSize:23,fontWeight:800,color:C.t1,letterSpacing:"-0.02em",lineHeight:1.15}}>
        {d.selam}{ad?", "+ad:""}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:9,marginTop:5}}>
        <span onClick={onDunya} title="Dünya saatleri"
          style={{fontSize:13,fontWeight:700,color:P,fontVariantNumeric:"tabular-nums",cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>
          {ss}:{mm}<span style={{opacity:0.45,fontSize:11}}>:{sn}</span>
        </span>
        <span style={{width:3,height:3,borderRadius:"50%",background:C.t3,display:"block"}}/>
        <span style={{fontSize:12.5,color:C.t2}}>{tarih}</span>
        <span onClick={onDunya} style={{fontSize:11.5,fontWeight:700,color:P,cursor:"pointer",marginLeft:2}}>Dünya saatleri ›</span>
      </div>
    </div>
  </div>;
}

// ─── Dünya saatleri ekranı ───
const SEHIRLER=[
  {ad:"İstanbul",   tz:"Europe/Istanbul",   bayrak:"🇹🇷"},
  {ad:"Londra",     tz:"Europe/London",     bayrak:"🇬🇧"},
  {ad:"Berlin",     tz:"Europe/Berlin",     bayrak:"🇩🇪"},
  {ad:"Paris",      tz:"Europe/Paris",      bayrak:"🇫🇷"},
  {ad:"Amsterdam",  tz:"Europe/Amsterdam",  bayrak:"🇳🇱"},
  {ad:"Madrid",     tz:"Europe/Madrid",     bayrak:"🇪🇸"},
  {ad:"Roma",       tz:"Europe/Rome",       bayrak:"🇮🇹"},
  {ad:"Lizbon",     tz:"Europe/Lisbon",     bayrak:"🇵🇹"},
  {ad:"Moskova",    tz:"Europe/Moscow",     bayrak:"🇷🇺"},
  {ad:"Dubai",      tz:"Asia/Dubai",        bayrak:"🇦🇪"},
  {ad:"Bakü",       tz:"Asia/Baku",         bayrak:"🇦🇿"},
  {ad:"Yeni Delhi", tz:"Asia/Kolkata",      bayrak:"🇮🇳"},
  {ad:"Pekin",      tz:"Asia/Shanghai",     bayrak:"🇨🇳"},
  {ad:"Tokyo",      tz:"Asia/Tokyo",        bayrak:"🇯🇵"},
  {ad:"Sidney",     tz:"Australia/Sydney",  bayrak:"🇦🇺"},
  {ad:"New York",   tz:"America/New_York",  bayrak:"🇺🇸"},
  {ad:"Los Angeles",tz:"America/Los_Angeles",bayrak:"🇺🇸"},
  {ad:"São Paulo",  tz:"America/Sao_Paulo", bayrak:"🇧🇷"},
];

function sehirZaman(tz){
  try{
    const f=new Intl.DateTimeFormat("tr-TR",{timeZone:tz,hour:"2-digit",minute:"2-digit",hour12:false});
    const s=new Intl.DateTimeFormat("tr-TR",{timeZone:tz,hour:"numeric",hour12:false}).format(new Date());
    return {metin:f.format(new Date()),saat:parseInt(s,10)};
  }catch{return {metin:"--:--",saat:12};}
}

export function DunyaSaatleriEkrani({C,P,APP_W,GeriBaslik,Sh,onKapat}){
  const [,tik]=useState(0);
  useEffect(()=>{const t=setInterval(()=>tik(x=>x+1),1000);return ()=>clearInterval(t);},[]);
  const yerel=new Date();
  const yerelSaat=yerel.getHours();
  const d=DILIM_METIN[gunDilimi(yerelSaat)];

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100dvh"}}>
      <GeriBaslik baslik="Dünya Saatleri" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        {/* Yerel saat — büyük */}
        <Sh s={{padding:"20px 22px",marginBottom:18,display:"flex",alignItems:"center",gap:18}}>
          <GokyuzuSahne saat={yerelSaat} dk={yerel.getMinutes()} g={92}/>
          <div style={{flex:1}}>
            <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",marginBottom:3}}>BULUNDUĞUN YER</div>
            <div style={{fontSize:30,fontWeight:800,color:C.t1,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em",lineHeight:1.1}}>
              {String(yerelSaat).padStart(2,"0")}:{String(yerel.getMinutes()).padStart(2,"0")}
              <span style={{fontSize:16,color:C.t3,fontWeight:700}}>:{String(yerel.getSeconds()).padStart(2,"0")}</span>
            </div>
            <div style={{fontSize:12.5,color:C.t2,marginTop:4}}>{d.selam} · {yerel.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
          </div>
        </Sh>

        <div style={{fontSize:12,fontWeight:700,color:C.t2,margin:"0 4px 10px",letterSpacing:"0.05em"}}>DÜNYADA ŞU AN</div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(158px,1fr))",gap:10}}>
          {SEHIRLER.map(s=>{
            const z=sehirZaman(s.tz);
            const dl=gunDilimi(z.saat);
            const gece=dl==="gece";
            return <div key={s.ad} style={{background:C.card,borderRadius:14,padding:"12px 13px",boxShadow:C.sh,display:"flex",alignItems:"center",gap:11}}>
              <GokyuzuSahne saat={z.saat} g={40}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{s.bayrak} {s.ad}</div>
                <div style={{fontSize:16,fontWeight:800,color:gece?C.t2:C.t1,fontVariantNumeric:"tabular-nums",marginTop:1}}>{z.metin}</div>
              </div>
            </div>;
          })}
        </div>

        <div style={{fontSize:10.5,color:C.t3,textAlign:"center",marginTop:16,lineHeight:1.6}}>
          Saatler cihazının saat dilimi ayarına göre hesaplanır.
        </div>
      </div>
    </div>
  </div>;
}
