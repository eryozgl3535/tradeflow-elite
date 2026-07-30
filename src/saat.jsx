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

// ─── Renk yardımcıları: hex → rgb → interpolasyon ───
function hex2rgb(h){ const n=parseInt(h.slice(1),16); return [(n>>16)&255,(n>>8)&255,n&255]; }
function rgb2hex(r,g,b){ return "#"+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,"0")).join(""); }
function lerpHex(a,b,t){
  const A=hex2rgb(a), B=hex2rgb(b);
  return rgb2hex(A[0]+(B[0]-A[0])*t, A[1]+(B[1]-A[1])*t, A[2]+(B[2]-A[2])*t);
}
// 24 saatlik gökyüzü paleti — gece → şafak → gündüz → gün batımı → gece (döngüsel)
const GOK_ANAHTAR = [
  {h:0,   ust:"#0B1230", alt:"#050814"},
  {h:4.5, ust:"#131A42", alt:"#0A0F26"},
  {h:5.5, ust:"#2C3768", alt:"#171F45"},
  {h:6.3, ust:"#F3A56A", alt:"#F76F5C"},
  {h:7.5, ust:"#7EC1E8", alt:"#FBD3A6"},
  {h:9,   ust:"#5AAEE0", alt:"#CDEAF9"},
  {h:12,  ust:"#4B9FDA", alt:"#DFF2FC"},
  {h:16,  ust:"#5CB2E4", alt:"#D3EEFB"},
  {h:17.7,ust:"#7CC3E8", alt:"#FBE0A8"},
  {h:18.7,ust:"#E8895F", alt:"#F8B267"},
  {h:19.6,ust:"#B24F6C", alt:"#EE8156"},
  {h:20.5,ust:"#3D2E5E", alt:"#7A4560"},
  {h:22,  ust:"#171B40", alt:"#241B3E"},
  {h:24,  ust:"#0B1230", alt:"#050814"},
];
function gokRenkleri(t){
  for(let i=0;i<GOK_ANAHTAR.length-1;i++){
    const a=GOK_ANAHTAR[i], b=GOK_ANAHTAR[i+1];
    if(t>=a.h && t<=b.h){
      const f=(t-a.h)/(b.h-a.h);
      return {ust:lerpHex(a.ust,b.ust,f), alt:lerpHex(a.alt,b.alt,f)};
    }
  }
  return {ust:GOK_ANAHTAR[0].ust, alt:GOK_ANAHTAR[0].alt};
}

// ─── Gökyüzü sahnesi — sürekli renk döngüsü, parıldayan yıldızlar, ışıma ───
// bant=true → header'da tam genişlik panorama (metin üzerine bindirilebilir, scrim destekli)
export function GokyuzuSahne({saat,dk=0,g=64,gen,bant=false,yuk=76,scrim=false}){
  const t=saat+dk/60;
  const W=bant?280:(gen||64), H=bant?yuk:46;

  const dogus=6, batis=19.2;
  const gunduz=t>=dogus&&t<=batis;
  const oran=Math.min(1,Math.max(0,(t-dogus)/(batis-dogus)));
  const gOran=gunduz?0:(t>batis?(t-batis)/(24-batis+dogus):(t+24-batis)/(24-batis+dogus));
  const p=gunduz?oran:gOran;
  const cx=W*0.09+p*(W*0.82);
  const yayY=bant?H*0.86:44;
  const tepe=bant?H*0.16:8;
  const cy=yayY-Math.sin(p*Math.PI)*(yayY-tepe);

  const {ust,alt}=gokRenkleri(t%24);
  const geceYogunluk=Math.max(0, Math.min(1,
    t<dogus-0.6 ? 1-(t/(dogus-0.6))*0.3 :
    t<dogus+0.8 ? (dogus+0.8-t)/1.4 :
    t>batis+1.3 ? Math.min(1,(t-batis-1.3)/1.2) :
    t>batis-0.3 ? 0 : 0
  ));
  const geceMi = t<dogus-0.3 || t>batis+1.1;

  const gunBatimiYakin = (t>batis-1.4 && t<batis+0.6) || (t>dogus-0.3 && t<dogus+1.1);
  const cisimRenk = geceMi ? "#F1F4FA" : gunBatimiYakin ? "#FFA857" : "#FFD65C";
  const id="gk"+Math.round(t*10)+(bant?"b":"k")+W;

  return <svg width={bant?"100%":g} height={bant?yuk:g*(H/W)} viewBox={`0 0 ${W} ${H}`}
    preserveAspectRatio={bant?"none":"xMidYMid meet"}
    style={bant?{display:"block"}:{display:"block",borderRadius:13,flexShrink:0}} aria-hidden="true">
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={ust}/>
        <stop offset="100%" stopColor={alt}/>
      </linearGradient>
      <radialGradient id={id+"g"} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={cisimRenk} stopOpacity="0.55"/>
        <stop offset="100%" stopColor={cisimRenk} stopOpacity="0"/>
      </radialGradient>
      {scrim && <linearGradient id={id+"s"} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#000000" stopOpacity="0"/>
        <stop offset="58%" stopColor="#000000" stopOpacity="0"/>
        <stop offset="100%" stopColor="#000000" stopOpacity={geceMi?0.42:0.34}/>
      </linearGradient>}
    </defs>

    <rect x="0" y="0" width={W} height={H} fill={`url(#${id})`}/>

    {/* Yıldızlar — geceye yaklaştıkça belirir, parıldar */}
    {geceYogunluk>0.08 && <g opacity={Math.min(1,geceYogunluk*1.15)}>
      <style>{`
        @keyframes tfTwinkle{0%,100%{opacity:.25}50%{opacity:1}}
      `}</style>
      {Array.from({length:Math.round(W/6.2)}).map((_,i)=>{
        const x=(i*23.7)%(W-4)+2, y=(i*17.1)%(H*0.62)+3;
        const r=i%4===0?1.05:i%3===0?0.75:0.5;
        return <circle key={i} cx={x} cy={y} r={r} fill="#fff"
          style={{animation:`tfTwinkle ${2.2+((i*13)%18)/10}s ease-in-out ${((i*7)%20)/10}s infinite`}}/>;
      })}
    </g>}

    {/* Bulutlar — sadece gündüz, yumuşak */}
    {!geceMi && oran>0.02 && oran<0.98 && <g opacity={0.5+oran*0.25}>
      <ellipse cx={W*0.24} cy={H*0.26} rx={W*0.1} ry={H*0.065} fill="#ffffffd0"/>
      <ellipse cx={W*0.3}  cy={H*0.23} rx={W*0.065} ry={H*0.05} fill="#ffffffd0"/>
      <ellipse cx={W*0.78} cy={H*0.4}  rx={W*0.08} ry={H*0.05} fill="#ffffffb0"/>
    </g>}

    {/* Güneş/Ay ışıma halkası + gövde */}
    <circle cx={cx} cy={cy} r={bant?H*0.34:11} fill={`url(#${id}g)`}/>
    <circle cx={cx} cy={cy} r={bant?H*0.135:6.6} fill={cisimRenk}/>
    {geceMi && <>
      {/* Ay hilali — gövdenin üstüne gökyüzü renginde disk bindirilir */}
      <circle cx={cx+(bant?H*0.058:2.6)} cy={cy-(bant?H*0.05:2.2)} r={bant?H*0.115:5.4} fill={ust}/>
    </>}
    {!geceMi && oran>0.3 && oran<0.7 && [0,45,90,135,180,225,270,315].map(a=>{
      const rad=(a*Math.PI)/180, r1=(bant?H*0.15:8.2), r2=(bant?H*0.2:10.6);
      return <line key={a} x1={cx+Math.cos(rad)*r1} y1={cy+Math.sin(rad)*r1}
        x2={cx+Math.cos(rad)*r2} y2={cy+Math.sin(rad)*r2} stroke={cisimRenk} strokeWidth={bant?1.6:1.3} strokeLinecap="round" opacity="0.6"/>;
    })}

    {/* Alt scrim — üstüne yazı bindirilecekse okunabilirlik için yumuşak karartma */}
    {scrim && <rect x="0" y="0" width={W} height={H} fill={`url(#${id}s)`}/>}
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

  return <div style={{flex:1,minWidth:320,maxWidth:520,position:"relative",borderRadius:18,overflow:"hidden",height:150,boxShadow:"0 1px 3px rgba(15,23,42,.08)"}}>
    {/* Tam kaplayan gökyüzü simülasyonu — arka plan */}
    <div style={{position:"absolute",inset:0}}>
      <GokyuzuSahne saat={saat} dk={dk} bant={true} yuk={150} scrim={true}/>
    </div>

    {/* Metin — gökyüzünün üzerine bindirilmiş, tek kesintisiz kart hissi */}
    <div style={{position:"absolute",left:0,right:0,bottom:0,padding:"14px 18px 16px",display:"flex",flexDirection:"column",gap:9}}>
      <div style={{fontSize:19,fontWeight:800,color:"#fff",letterSpacing:"-0.02em",lineHeight:1.15,textShadow:"0 1px 6px rgba(0,0,0,.28)"}}>
        {d.selam}{ad?", "+ad:""}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:18,fontWeight:800,color:"#fff",fontVariantNumeric:"tabular-nums",letterSpacing:"-0.02em",lineHeight:1,flexShrink:0,textShadow:"0 1px 6px rgba(0,0,0,.28)"}}>
          {ss}:{mm}<span style={{fontSize:11.5,color:"rgba(255,255,255,.72)",fontWeight:700}}>:{sn}</span>
        </span>
        <span style={{width:1,height:14,background:"rgba(255,255,255,.35)",display:"block",flexShrink:0}}/>
        <span style={{fontSize:12,color:"rgba(255,255,255,.88)",fontWeight:500,flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",textShadow:"0 1px 5px rgba(0,0,0,.24)"}}>{tarih}</span>
        <button onClick={onDunya} style={{flexShrink:0,background:"rgba(255,255,255,.16)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)",border:"1px solid rgba(255,255,255,.32)",borderRadius:10,padding:"7px 12px",fontSize:11.5,fontWeight:700,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:6,fontFamily:"inherit",transition:"all .14s",whiteSpace:"nowrap"}}
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,.28)";}}
          onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.16)";}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
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
