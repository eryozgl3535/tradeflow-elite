// ═══════════════════════════════════════════════════════════════
// 🅣🅕 TRADEFLOW LOGO
// Tek kaynaktan yönetilen marka bileşeni.
//   <TFLogo boyut={44}/>              → sadece T/F monogramı
//   <TFLogo boyut={44} yazi/>         → monogram + TRADEFLOW + ERAİ
//   <TFLogo boyut={44} yazi koyu/>    → koyu zeminde açık renkli
// ═══════════════════════════════════════════════════════════════

const MARKA = {
  lacivert: "#16294B",   // T harfi ve TRADEFLOW yazısı
  gri:      "#5C6470",   // F harfi
  kirmizi:  "#C4213F",   // ERAİ'deki İ
};

// Zemin renginden karanlık mod tespiti — koyu prop verilmezse otomatik
export function koyuMu(bg){
  const h=(bg||"#fff").replace("#","");
  if(h.length<6) return false;
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return (r*0.299+g*0.587+b*0.114) < 128;
}

export function TFLogo({ boyut = 40, yazi = false, koyu = false, ortala = true, st }) {
  const T   = koyu ? "#E8EEF7" : MARKA.lacivert;
  const F   = koyu ? "#95A0B0" : MARKA.gri;
  const YAZI= koyu ? "#DCE4EF" : MARKA.lacivert;
  const KIRM= koyu ? "#FF5C7A" : MARKA.kirmizi;
  const CIZGI = koyu ? "#4A5568" : "#C3CBD8";

  // yazılı sürüm daha uzun: 300x210, sade monogram: 300x140
  const H = yazi ? 210 : 140;
  const serif = "Georgia,'Times New Roman',Times,serif";

  return (
    <svg
      viewBox={`0 0 300 ${H}`}
      width={boyut * (300 / H)}
      height={boyut}
      style={{ display: "block", flexShrink: 0, margin: ortala ? "0 auto" : 0, ...st }}
      role="img"
      aria-label="TradeFlow Elite"
    >
      {/* ── Monogram ── */}
      <text x="88" y="118" textAnchor="middle" fontFamily={serif} fontSize="132"
            fontWeight="700" fill={T} letterSpacing="-2">T</text>
      <text x="196" y="118" textAnchor="middle" fontFamily={serif} fontSize="132"
            fontWeight="700" fill={F} letterSpacing="-2">F</text>

      {/* Eğik kesik — iki harfin arasından geçer, uçları sivri */}
      <path d="M172 6 L182 6 L142 134 L132 134 Z" fill={T} />

      {yazi && (
        <>
          {/* TRADEFLOW */}
          <text x="150" y="166" textAnchor="middle" fontFamily={serif} fontSize="30"
                fontWeight="600" fill={YAZI} letterSpacing="7.5">TRADEFLOW</text>

          {/* ── ERAİ + iki yana ince çizgi ── */}
          <line x1="52"  y1="191" x2="104" y2="191" stroke={CIZGI} strokeWidth="1.4" />
          <line x1="196" y1="191" x2="248" y2="191" stroke={CIZGI} strokeWidth="1.4" />
          <text x="152" y="198" textAnchor="middle" fontFamily={serif} fontSize="23"
                fontWeight="700" letterSpacing="8" fill={YAZI}>
            ERA<tspan fill={KIRM}>İ</tspan>
          </text>
        </>
      )}
    </svg>
  );
}

// Yatay kullanım (üst barlar için): monogram solda, yazı sağında
export function TFLogoYatay({ boyut = 34, koyu = false, st }) {
  const T    = koyu ? "#E8EEF7" : MARKA.lacivert;
  const F    = koyu ? "#95A0B0" : MARKA.gri;
  const YAZI = koyu ? "#DCE4EF" : MARKA.lacivert;
  const KIRM = koyu ? "#FF5C7A" : MARKA.kirmizi;
  const serif = "Georgia,'Times New Roman',Times,serif";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: boyut * 0.3, ...st }}>
      <svg viewBox="0 0 300 140" height={boyut} width={boyut * (300 / 140)}
           style={{ display: "block", flexShrink: 0 }} role="img" aria-label="TradeFlow">
        <text x="88" y="118" textAnchor="middle" fontFamily={serif} fontSize="132"
              fontWeight="700" fill={T} letterSpacing="-2">T</text>
        <text x="196" y="118" textAnchor="middle" fontFamily={serif} fontSize="132"
              fontWeight="700" fill={F} letterSpacing="-2">F</text>
        <path d="M172 6 L182 6 L142 134 L132 134 Z" fill={T} />
      </svg>
      <div style={{ lineHeight: 1.15 }}>
        <div style={{ fontFamily: serif, fontSize: boyut * 0.44, fontWeight: 600,
                      letterSpacing: boyut * 0.075, color: YAZI }}>TRADEFLOW</div>
        <div style={{ fontFamily: serif, fontSize: boyut * 0.26, fontWeight: 600,
                      letterSpacing: boyut * 0.1, color: YAZI, marginTop: 2 }}>
          ERA<span style={{ color: KIRM }}>İ</span>
        </div>
      </div>
    </div>
  );
}
