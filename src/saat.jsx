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
export function GokyuzuSahne({saat,dk=0,g=64,gen,bant=false,yuk=76}){
  const dilim=gunDilimi(saat);
  const t=saat+dk/60;
  const W=bant?240:(gen||64), H=bant?58:46;

  const dogus=6, batis=19;
  const oran=Math.min(1,Math.max(0,(t-dogus)/(batis-dogus)));
  const gunduz=t>=dogus&&t<=batis;
  const gOran=gunduz?0:(t>batis?(t-batis)/(24-batis+dogus):(t+24-batis)/(24-batis+dogus));
  const p=gunduz?oran:gOran;
  const cx=W*0.1+p*(W*0.8);
  const cy=(bant?52:44)-Math.sin(p*Math.PI)*(bant?32:26);

  const gok={
    sabah:["#FFE9C4","#FFC98A"],
    ogle: ["#BFE6F7","#7EC8ED"],
    aksam:["#FFC48C","#F08A6E"],
    gece: ["#1E2C48","#0F1729"],
  }[dilim];
  const cisimRenk=dilim==="gece"?"#E8EDF5":dilim==="sabah"?"#FFB13B":dilim==="aksam"?"#FF7847":"#FFC61A";
  const halo   =dilim==="gece"?"#E8EDF522":dilim==="aksam"?"#FF784733":"#FFC61A38";
  const id="gk"+dilim+(bant?"b":W);
  const r=bant?8:6.6, hr=bant?13:11;

  const olcu = bant
    ? {width:"100%",height:yuk,display:"block"}
    : {width:g,height:g*(H/W),display:"block",borderRadius:13,flexShrink:0};

  return <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio={bant?"none":"xMidYMid meet"}
    style={olcu} aria-hidden="true">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={gok[0]}/><stop offset="100%" stopColor={gok[1]}/>
      </linearGradient>
    </defs>
    <rect x="0" y="0" width={W} height={H} rx={bant?0:9} fill={`url(#${id})`}/>

    {dilim==="gece"&&Array.from({length:Math.round(W/8)}).map((_,i)=>{
      const x=(i*19.7)%(W-6)+3, y=(i*13.3)%(H*0.6)+4;
      return <circle key={i} cx={x} cy={y} r={i%3===0?0.9:0.6} fill="#fff" opacity={0.5+((i*7)%35)/100}/>;
    })}

    {dilim!=="gece"&&<g opacity={dilim==="ogle"?0.85:0.62}>
      <ellipse cx={W*0.2} cy={H*0.28} rx={W*0.09} ry={H*0.07} fill="#ffffffcc"/>
      <ellipse cx={W*0.26} cy={H*0.25} rx={W*0.06} ry={H*0.055} fill="#ffffffcc"/>
      <ellipse cx={W*0.76} cy={H*0.42} rx={W*0.075} ry={H*0.055} fill="#ffffffa8"/>
    </g>}

    <circle cx={cx} cy={cy} r={hr} fill={halo}/>
    <circle cx={cx} cy={cy} r={r} fill={cisimRenk}/>
    {dilim==="gece"&&<circle cx={cx+r*0.42} cy={cy-r*0.34} r={r*0.82} fill={gok[0]}/>}
    {dilim==="ogle"&&[0,45,90,135,180,225,270,315].map(a=>{
      const rd=(a*Math.PI)/180;
      return <line key={a} x1={cx+Math.cos(rd)*(r+2.4)} y1={cy+Math.sin(rd)*(r+2.4)}
        x2={cx+Math.cos(rd)*(r+4.9)} y2={cy+Math.sin(rd)*(r+4.9)} stroke={cisimRenk} strokeWidth="1.4" strokeLinecap="round" opacity="0.75"/>;
    })}
    <path d={`M0 ${H*0.82} Q${W*0.25} ${H*0.71} ${W*0.5} ${H*0.8} Q${W*0.75} ${H*0.89} ${W} ${H*0.76} L${W} ${H} L0 ${H} Z`}
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

  return <div style={{flex:1,minWidth:320,maxWidth:520,background:C.card,border:`1px solid ${C.border}`,borderRadius:18,overflow:"hidden",display:"flex",flexDirection:"column"}}>
    {/* Tam genişlik gökyüzü bandı — kompakt oran */}
    <GokyuzuSahne saat={saat} dk={dk} bant={true} yuk={54}/>

    {/* Altında selamlama — dengeli, simetrik boşluklar */}
    <div style={{padding:"14px 20px",display:"flex",flexDirection:"column",gap:9}}>
      <div style={{fontSize:19,fontWeight:800,color:C.t1,letterSpacing:"-0.02em",lineHeight:1.15}}>
        {d.selam}{ad?", "+ad:""}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:18,fontWeight:800,color:C.t1,fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em",lineHeight:1,flexShrink:0}}>
          {ss}:{mm}<span style={{fontSize:11.5,color:C.t3,fontWeight:700}}>:{sn}</span>
        </span>
        <span style={{width:1,height:14,background:C.border,display:"block",flexShrink:0}}/>
        <span style={{fontSize:12,color:C.t2,fontWeight:500,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tarih}</span>
        <button onClick={onDunya} style={{flexShrink:0,background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 12px",fontSize:11.5,fontWeight:700,color:P,cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit",transition:"all .14s",whiteSpace:"nowrap"}}
          onMouseEnter={e=>{e.currentTarget.style.background=C.bg;e.currentTarget.style.borderColor="#CBD5E1";}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.borderColor=C.border;}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>
          </svg>
          Dünya saatleri
        </button>
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
