// ═══════════════════════════════════════════════════════════════
// 🅣🅕 TRADEFLOW LOGO
// Gerçek marka görseli kullanılır: /logo-tf.png (şeffaf zemin)
//   <TFLogo boyut={90}/>        → tam logo (T/F + TRADEFLOW + ERAİ)
//   <TFLogo boyut={34} sade/>   → sadece üst monogram kırpılmış
// ═══════════════════════════════════════════════════════════════

// Zemin renginden karanlık mod tespiti
export function koyuMu(bg){
  const h=(bg||"#fff").replace("#","");
  if(h.length<6) return false;
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return (r*0.299+g*0.587+b*0.114) < 128;
}

// Görselin en/boy oranı (324x281 px)
const ORAN = 324/281;

export function TFLogo({ boyut = 90, koyu = false, sade = false, ortala = true, st }){
  // Koyu temada lacivert tonlar görünmez kalır → açığa çevir
  const filtre = koyu ? "invert(1) brightness(1.9) saturate(0.55) hue-rotate(180deg)" : "none";

  if(sade){
    // Sadece üst monogram: görselin üst %62'lik kısmını göster
    const gorunenOran = ORAN / 0.62;
    return <div style={{
      width: boyut*gorunenOran, height: boyut, overflow:"hidden",
      flexShrink:0, margin: ortala?"0 auto":0, ...st
    }}>
      <img src="/logo-tf.png" alt="TradeFlow"
        style={{ width:"100%", display:"block", filter:filtre }}/>
    </div>;
  }

  return <img src="/logo-tf.png" alt="TradeFlow Elite"
    style={{
      height: boyut, width: boyut*ORAN, display:"block",
      margin: ortala?"0 auto":0, flexShrink:0, filter:filtre, ...st
    }}/>;
}

// Yatay kullanım — monogram solda, ad sağında
export function TFLogoYatay({ boyut = 34, koyu = false, st }){
  const YAZI = koyu ? "#DCE4EF" : "#16294B";
  const KIRM = koyu ? "#FF5C7A" : "#C4213F";
  const serif = "Georgia,'Times New Roman',Times,serif";
  return <div style={{ display:"flex", alignItems:"center", gap: boyut*0.32, ...st }}>
    <TFLogo boyut={boyut} sade koyu={koyu} ortala={false}/>
    <div style={{ lineHeight:1.15 }}>
      <div style={{ fontFamily:serif, fontSize:boyut*0.46, fontWeight:600,
                    letterSpacing:boyut*0.08, color:YAZI }}>TRADEFLOW</div>
      <div style={{ fontFamily:serif, fontSize:boyut*0.27, fontWeight:600,
                    letterSpacing:boyut*0.1, color:YAZI, marginTop:2 }}>
        ERA<span style={{ color:KIRM }}>İ</span>
      </div>
    </div>
  </div>;
}
