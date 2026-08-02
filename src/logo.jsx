// ═══════════════════════════════════════════════════════════════
// 🅣🅕 TRADEFLOW LOGO
// Görsel: /logo-tf.png  (T/F + TRADEFLOW + ERAİ — hepsi tasarımdan)
// ERAİ üzerinde LED ışığı: görselin kendisi maske olarak kullanılır,
// böylece ışık YAZININ İÇİNDE gezer — yeni yazı eklenmez.
//
//   <TFLogo boyut={112}/>            → tam logo, ERAİ'de LED
//   <TFLogo boyut={112} led={false}/> → sabit
//   <TFLogo boyut={34} sade/>        → sadece monogram
// ═══════════════════════════════════════════════════════════════

export function koyuMu(bg){
  const h=(bg||"#fff").replace("#","");
  if(h.length<6) return false;
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return (r*0.299+g*0.587+b*0.114) < 128;
}

const GORSEL   = "/logo-tf.png";
const ORAN     = 324/281;    // en/boy
const ERAI_UST = 0.878;      // ERAİ bandının başlangıcı (görselin %87.8'i)
const ERAI_ALT = 0.975;      // bitişi
const MONO_PAY = 0.70;       // üst %70 = T/F monogramı

export function TFLogo({ boyut = 112, koyu = false, sade = false, led = true, ortala = true, st }){
  const filtre = koyu ? "invert(1) brightness(1.9) saturate(0.55) hue-rotate(180deg)" : "none";
  const genislik = boyut * ORAN;

  // Sadece monogram (üst bar için)
  if(sade){
    return <div style={{ width:genislik, height:boyut, overflow:"hidden", flexShrink:0,
                         margin: ortala?"0 auto":0, ...st }}>
      <img src={GORSEL} alt="TradeFlow"
        style={{ width:"100%", display:"block", filter:filtre,
                 transform:`scale(${1/MONO_PAY})`, transformOrigin:"top center" }}/>
    </div>;
  }

  const bandUst = boyut * ERAI_UST;
  const bandYuk = boyut * (ERAI_ALT - ERAI_UST);

  return <div style={{ position:"relative", display:"inline-block", width:genislik, height:boyut,
                       margin: ortala?"0 auto":0, ...st }}>
    <img src={GORSEL} alt="TradeFlow Elite"
      style={{ width:genislik, height:boyut, display:"block", filter:filtre }}/>

    {led && <>
      <style>{`
        @keyframes tfEraiIsik{
          0%   { background-position: -70% 0; }
          100% { background-position: 170% 0; }
        }
        .tf-erai-led{
          position:absolute; left:0; right:0;
          pointer-events:none;
          background-image:linear-gradient(90deg,
            transparent 0%,
            rgba(34,211,238,0.00) 28%,
            rgba(34,211,238,0.95) 40%,
            #FFFFFF 50%,
            rgba(236,72,153,0.95) 60%,
            rgba(236,72,153,0.00) 72%,
            transparent 100%);
          background-size:150% 100%;
          background-repeat:no-repeat;
          animation:tfEraiIsik 2.9s linear infinite;
        }
        @media (prefers-reduced-motion:reduce){ .tf-erai-led{ animation:none; opacity:0 } }
      `}</style>
      {/* Görselin kendisi maske → ışık sadece ERAİ harflerinin içinde görünür */}
      <div className="tf-erai-led"
        style={{
          top: bandUst, height: bandYuk,
          WebkitMaskImage:`url(${GORSEL})`,  maskImage:`url(${GORSEL})`,
          WebkitMaskSize:`${genislik}px ${boyut}px`, maskSize:`${genislik}px ${boyut}px`,
          WebkitMaskPosition:`0px -${bandUst}px`,     maskPosition:`0px -${bandUst}px`,
          WebkitMaskRepeat:"no-repeat", maskRepeat:"no-repeat",
        }}/>
    </>}
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
