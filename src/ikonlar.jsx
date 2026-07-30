// ═══════════════════════════════════════════════════════════════
// 🎨 TRADEFLOW İKON SETİ
// Tek elden çizilmiş SVG ikonlar. Emoji ve ikon-font yerine.
// Hepsi 24x24 kutuda, 1.7px çizgi, yuvarlatılmış uç.
// Kullanım: <Ik n="fatura" s={22} c="#6366F1"/>
// ═══════════════════════════════════════════════════════════════

const YOLLAR = {
  // — gezinme —
  ev:        <><path d="M3 10.4 12 3.5l9 6.9V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z"/></>,
  akis:      <><rect x="8.5" y="2.5" width="7" height="5.5" rx="1.4"/><rect x="2" y="15.5" width="6.5" height="5.5" rx="1.4"/><rect x="15.5" y="15.5" width="6.5" height="5.5" rx="1.4"/><path d="M12 8v3.5M5.2 15.5v-2a1.5 1.5 0 0 1 1.5-1.5h10.6a1.5 1.5 0 0 1 1.5 1.5v2"/></>,
  pano:      <><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 3h6v3H9z"/><path d="M9 11h6M9 15h4"/></>,
  // — finans —
  fatura:    <><path d="M6 2.5h8.5L19 7v14.5H6Z"/><path d="M14 2.5V7h5"/><path d="M9 12.5h6M9 16h4"/></>,
  teklif:    <><path d="M5 3.5h9L19 8v12.5H5Z"/><path d="M13.5 3.5V8H19"/><path d="M9 17.5l1.4-.35 4.4-4.4a1.3 1.3 0 0 0-1.85-1.85l-4.4 4.4Z"/></>,
  cuzdan:    <><path d="M3 8.2A2.2 2.2 0 0 1 5.2 6h13.6A2.2 2.2 0 0 1 21 8.2v9.6a2.2 2.2 0 0 1-2.2 2.2H5.2A2.2 2.2 0 0 1 3 17.8Z"/><path d="M3 10.5h18"/><circle cx="17" cy="14.6" r="1.3"/></>,
  cek:       <><rect x="2.5" y="6" width="19" height="12.5" rx="2.2"/><circle cx="12" cy="12.2" r="2.6"/><path d="M6 10v4.5M18 10v4.5"/></>,
  senet:     <><path d="M5.5 3h13a1 1 0 0 1 1 1v17l-3-2-2.5 2-2.5-2-2.5 2-2.5-2-1 2V4a1 1 0 0 1 1-1Z"/><path d="M9 8h6M9 12h6"/></>,
  klasor:    <><path d="M3 7.4A1.9 1.9 0 0 1 4.9 5.5h4.3l2 2.4h8A1.9 1.9 0 0 1 21 9.8v8.3a1.9 1.9 0 0 1-1.9 1.9H4.9A1.9 1.9 0 0 1 3 18.1Z"/></>,
  grafik:    <><rect x="3.5" y="12" width="4.2" height="8.5" rx="1.2"/><rect x="9.9" y="6.5" width="4.2" height="14" rx="1.2"/><rect x="16.3" y="9.5" width="4.2" height="11" rx="1.2"/></>,
  trend:     <><path d="M3 16.5 8.5 11l3.5 3.5L21 6"/><path d="M15.5 6H21v5.5"/></>,
  // — kişi & iş —
  kisi:      <><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/></>,
  ekip:      <><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 5.4a3.2 3.2 0 0 1 0 5.2M17.5 14.2A6.5 6.5 0 0 1 21.5 20"/></>,
  canta:     <><rect x="2.5" y="7" width="19" height="13" rx="2.2"/><path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6A1.7 1.7 0 0 1 15.5 5.2V7"/></>,
  // — eylem —
  arti:      <><path d="M12 5v14M5 12h14"/></>,
  artiDaire: <><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></>,
  ara:       <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  zil:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></>,
  kalem:     <><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17Z"/></>,
  ayar:      <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-1 1.46V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 9.1 19.4a1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.6 1.6 0 0 0 4.82 15a1.6 1.6 0 0 0-1.46-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.46-1.1 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.6 1.6 0 0 0 9 4.82a1.6 1.6 0 0 0 1-1.46V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.46 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.6 1.6 0 0 0 19.18 9v.09a1.6 1.6 0 0 0 1.46 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5.91Z"/></>,
  nokta:     <><circle cx="5.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor"/></>,
  asagi:     <><path d="m6 9 6 6 6-6"/></>,
  sag:       <><path d="m9 6 6 6-6 6"/></>,
  // — durum & zaman —
  saat:      <><circle cx="12" cy="12.5" r="8.5"/><path d="M12 7.8v5l3 1.8"/></>,
  takvim:    <><rect x="3" y="5" width="18" height="16" rx="2.2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
  kalkan:    <><path d="M12 3 20 6.3v5.4c0 4.7-3.2 8.2-8 9.3-4.8-1.1-8-4.6-8-9.3V6.3Z"/><path d="M9 12.2l2.2 2.2 4-4.4"/></>,
  uyari:     <><path d="M12 3.5 21.5 20H2.5Z"/><path d="M12 10v4M12 17h.01"/></>,
  kamera:    <><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.9a1 1 0 0 0 .84-.46l.86-1.32A1 1 0 0 1 10.04 4h3.92a1 1 0 0 1 .84.46l.86 1.32a1 1 0 0 0 .84.46h1.9A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z"/><circle cx="12" cy="12.5" r="3.4"/></>,
  konum:     <><path d="M12 21s-7.5-5.2-7.5-10.6A7.5 7.5 0 0 1 19.5 10.4C19.5 15.8 12 21 12 21Z"/><circle cx="12" cy="10.3" r="2.7"/></>,
  // — sektör —
  anahtar:   <><path d="M14.5 6.2a3.8 3.8 0 0 1 5 5L11 19.7a2.4 2.4 0 0 1-3.4-3.4Z"/><path d="M17.4 3.4 20.6 6.6"/><path d="M5 9.5 8.5 6 6.8 4.3 3.3 7.8Z"/></>,
  havuz:     <><path d="M3 17.5c2-1.6 3.4-1.6 5.3 0s3.3 1.6 5.3 0 3.3-1.6 5.3 0"/><path d="M3 12c2-1.6 3.4-1.6 5.3 0s3.3 1.6 5.3 0 3.3-1.6 5.3 0"/><path d="M7 8V5.5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2V8"/></>,
  simsek:    <><path d="M13.2 2.5 4.5 13.5h6l-.7 8 8.7-11h-6Z"/></>,
  yildiz:    <><path d="M12 3 14.9 9.1 21.5 10 16.8 14.7 17.9 21.3 12 18.2 6.1 21.3 7.2 14.7 2.5 10 9.1 9.1Z"/></>,
  oyun:      <><rect x="2" y="7" width="20" height="11" rx="3.6"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.8" r="1.05" fill="currentColor"/><circle cx="18.2" cy="14" r="1.05" fill="currentColor"/></>,
};

// Ana ikon bileşeni
export function Ik({n,s=20,c="currentColor",w=1.7,st}){
  const yol=YOLLAR[n];
  if(!yol)return null;
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c}
    strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"
    style={{flexShrink:0,display:"block",...st}} aria-hidden="true">{yol}</svg>;
}

// Modül id → ikon + renk eşlemesi (hızlı işlemler için)
export const MODUL_IKON = {
  isler:      {n:"akis",     c:"#3B82F6"},
  faturalar:  {n:"fatura",   c:"#6366F1"},
  tahsilatlar:{n:"cuzdan",   c:"#0E9F6E"},
  musteriler: {n:"kisi",     c:"#1D9E75"},
  teklifler:  {n:"teklif",   c:"#7C3AED"},
  raporlar:   {n:"grafik",   c:"#F97316"},
  giderler:   {n:"klasor",   c:"#14B8A6"},
  daha:       {n:"nokta",    c:"#64748B"},
};

// ═══ LED İMZA — ışık ilk harften son harfe tek tek koşar (LED şerit) ═══
export function LedImza({boyut=13, ortala=true, metin="Built by ERAİ", inline=false}){
  const harfler=[...metin];
  return <div style={inline?{display:"inline-flex",verticalAlign:"middle"}:{textAlign:ortala?"center":"left",padding:"2px 0"}}>
    <style>{`
      @keyframes tfKos{
        0%, 70%, 100% { color:#8A96A8; text-shadow:none }
        76% { color:#22D3EE; text-shadow:0 0 7px rgba(34,211,238,.85), 0 0 16px rgba(34,211,238,.42) }
        82% { color:#FFFFFF; text-shadow:0 0 9px rgba(255,255,255,.9),  0 0 20px rgba(167,139,250,.6) }
        88% { color:#EC4899; text-shadow:0 0 7px rgba(236,72,153,.85), 0 0 16px rgba(236,72,153,.42) }
      }
      .tf-led{ font-weight:900; letter-spacing:.13em; display:inline-flex; line-height:1.25 }
      .tf-led i{ font-style:normal; display:inline-block; color:#8A96A8;
                 animation:tfKos 2.6s linear infinite; will-change:color,text-shadow }
      @media (prefers-reduced-motion:reduce){ .tf-led i{ animation:none } }
    `}</style>
    <span className="tf-led" style={{fontSize:boyut}} aria-label={metin}>
      {harfler.map((h,i)=>
        <i key={i} style={{animationDelay:(i*0.085).toFixed(3)+"s"}} aria-hidden="true">
          {h===" "?"\u00A0":h}
        </i>
      )}
    </span>
  </div>;
}
