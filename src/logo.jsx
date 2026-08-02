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
  const H = yazi ? 218 : 150;
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
      {/* ── Monogram — harfler yatay sıkıştırılmış (dar & uzun serif görünümü) ── */}
      <g transform="scale(0.55 1)">
        <text x="204" y="140" textAnchor="middle" fontFamily={serif} fontSize="180"
              fontWeight="700" fill={T}>T</text>
        <text x="327" y="140" textAnchor="middle" fontFamily={serif} fontSize="180"
              fontWeight="700" fill={F}>F</text>
      </g>

      {/* Eğik kesik — ince, harflerin arasından geçer */}
      <path d="M182 15 L186 15 L114 138 L110 138 Z" fill={T} />

      {yazi && (
        <>
          {/* TRADEFLOW */}
          <text x="150" y="176" textAnchor="middle" fontFamily={serif} fontSize="30"
                fontWeight="600" fill={YAZI} letterSpacing="7.5">TRADEFLOW</text>

          {/* ── ERAİ + iki yana ince çizgi ── */}
          <line x1="52"  y1="199" x2="104" y2="199" stroke={CIZGI} strokeWidth="1.4" />
          <line x1="196" y1="199" x2="248" y2="199" stroke={CIZGI} strokeWidth="1.4" />
          <text x="152" y="206" textAnchor="middle" fontFamily={serif} fontSize="23"
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
      <svg viewBox="0 0 300 150" height={boyut} width={boyut * (300 / 150)}
           style={{ display: "block", flexShrink: 0 }} role="img" aria-label="TradeFlow">
        <g transform="scale(0.55 1)">
          <text x="204" y="140" textAnchor="middle" fontFamily={serif} fontSize="180"
                fontWeight="700" fill={T}>T</text>
          <text x="327" y="140" textAnchor="middle" fontFamily={serif} fontSize="180"
                fontWeight="700" fill={F}>F</text>
        </g>
        <path d="M182 15 L186 15 L114 138 L110 138 Z" fill={T} />
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
