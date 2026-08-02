// ═══════════════════════════════════════════════════════════════
// 🅣🅕 TRADEFLOW LOGO
// Görsel: /logo-tf.png  (T/F monogramı + TRADEFLOW yazısı)
// ERAİ  : altına canlı metin olarak yazılır → LED ışık animasyonu alabilir
//
//   <TFLogo boyut={110}/>            → tam logo + LED ERAİ
//   <TFLogo boyut={110} erai={false}/> → LED'siz, sadece görsel
//   <TFLogo boyut={34} sade/>        → sadece monogram (üst bar için)
// ═══════════════════════════════════════════════════════════════

export function koyuMu(bg){
  const h=(bg||"#fff").replace("#","");
  if(h.length<6) return false;
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return (r*0.299+g*0.587+b*0.114) < 128;
}

const ORAN = 324/244;      // görselin en/boy oranı
const MONO_PAY = 0.80;     // görselin üst %80'i = T/F monogramı

// ─── LED ERAİ — ışık ilk harften son harfe koşar ───
function EraiLed({ genislik, koyu }){
  const harfler = [..."ERAİ"];
  const cizgi = koyu ? "#3E4A5C" : "#C3CBD8";
  const puntoP = genislik * 0.072;                 // logoyla orantılı
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
                  gap: genislik*0.045, width:genislik, marginTop: genislik*0.028 }}>
      <span style={{ flex:1, height:1, background:cizgi, display:"block" }}/>
      <style>{`
        @keyframes tfEraiLed{
          0%, 68%, 100% { color:var(--erai-sonuk); text-shadow:none }
          75% { color:#22D3EE; text-shadow:0 0 6px rgba(34,211,238,.9), 0 0 14px rgba(34,211,238,.5) }
          82% { color:#FFFFFF; text-shadow:0 0 8px rgba(255,255,255,.95), 0 0 18px rgba(167,139,250,.65) }
          89% { color:#EC4899; text-shadow:0 0 6px rgba(236,72,153,.9), 0 0 14px rgba(236,72,153,.5) }
        }
        .tf-erai{ display:inline-flex; font-weight:700; line-height:1 }
        .tf-erai i{ font-style:normal; display:inline-block;
                    animation:tfEraiLed 2.8s linear infinite;
                    will-change:color,text-shadow }
        @media (prefers-reduced-motion:reduce){ .tf-erai i{ animation:none } }
      `}</style>
      <span className="tf-erai" aria-label="ERAİ"
        style={{
          fontFamily:"Georgia,'Times New Roman',serif",
          fontSize: Math.max(8, puntoP),
          letterSpacing: Math.max(2, genislik*0.028),
          "--erai-sonuk": koyu ? "#8794A8" : "#16294B",
        }}>
        {harfler.map((h,i)=>
          <i key={i} style={{ animationDelay:(i*0.11).toFixed(2)+"s" }} aria-hidden="true">{h}</i>
        )}
      </span>
      <span style={{ flex:1, height:1, background:cizgi, display:"block" }}/>
    </div>
  );
}

export function TFLogo({ boyut = 110, koyu = false, sade = false, erai = true, ortala = true, st }){
  const filtre = koyu ? "invert(1) brightness(1.9) saturate(0.55) hue-rotate(180deg)" : "none";

  // Sadece monogram — görselin üst kısmını kırp
  if(sade){
    const kutuGen = boyut * ORAN;
    return <div style={{ width:kutuGen, height:boyut, overflow:"hidden", flexShrink:0,
                         margin: ortala?"0 auto":0, ...st }}>
      <img src="/logo-tf.png" alt="TradeFlow"
        style={{ width:"100%", display:"block", filter:filtre,
                 transform:`scale(${1/MONO_PAY})`, transformOrigin:"top center" }}/>
    </div>;
  }

  const genislik = boyut * ORAN;
  return <div style={{ display:"inline-block", margin: ortala?"0 auto":0, ...st }}>
    <img src="/logo-tf.png" alt="TradeFlow"
      style={{ height:boyut, width:genislik, display:"block", filter:filtre }}/>
    {erai && <EraiLed genislik={genislik} koyu={koyu}/>}
  </div>;
}

// Yatay kullanım — monogram solda, ad sağında
export function TFLogoYatay({ boyut = 34, koyu = false, st }){
  const YAZI = koyu ? "#DCE4EF" : "#16294B";
  const serif = "Georgia,'Times New Roman',Times,serif";
  return <div style={{ display:"flex", alignItems:"center", gap:boyut*0.32, ...st }}>
    <TFLogo boyut={boyut} sade koyu={koyu} ortala={false}/>
    <div style={{ fontFamily:serif, fontSize:boyut*0.46, fontWeight:600,
                  letterSpacing:boyut*0.08, color:YAZI }}>TRADEFLOW</div>
  </div>;
}
