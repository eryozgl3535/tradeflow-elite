import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ═══ BEYAZ EKRAN KORUMASI ═══
// Uygulama bir yerde çökerse boş beyaz ekran yerine anlaşılır bir
// hata kartı gösterilir. Hata metni "Kopyala" ile alınabilir.
class HataKalkani extends React.Component {
  constructor(p) { super(p); this.state = { hata: null }; }
  static getDerivedStateFromError(hata) { return { hata }; }
  componentDidCatch(hata, bilgi) {
    console.error("TradeFlow hata:", hata, bilgi);
    try { document.getElementById("tfsplash")?.remove(); } catch {}
  }
  render() {
    if (!this.state.hata) return this.props.children;
    const metin = (this.state.hata.message || "Bilinmeyen hata") + "\n" + (this.state.hata.stack || "");
    const btn = { border: "none", borderRadius: 12, padding: "13px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };
    return <div style={{ minHeight: "100vh", background: "#F1F3F7", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "-apple-system,BlinkMacSystemFont,sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 20, padding: "26px 22px", boxShadow: "0 12px 40px rgba(27,42,74,0.15)" }}>
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 10 }}>⚠️</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#1B2A4A", textAlign: "center", marginBottom: 6 }}>Bir şeyler ters gitti</div>
        <div style={{ fontSize: 12.5, color: "#6B7280", textAlign: "center", lineHeight: 1.55, marginBottom: 18 }}>
          Verilerin güvende. Sayfayı yenilemek çoğu zaman sorunu çözer.
        </div>
        <div style={{ display: "flex", gap: 9, marginBottom: 14 }}>
          <button onClick={() => window.location.reload()} style={{ ...btn, flex: 1, background: "#2E7490", color: "#fff" }}>↻ Sayfayı Yenile</button>
          <button onClick={() => { try { navigator.clipboard.writeText(metin); } catch {} }} style={{ ...btn, background: "#F1F3F7", color: "#1B2A4A" }}>Kopyala</button>
        </div>
        <details>
          <summary style={{ fontSize: 11.5, color: "#9CA3AF", cursor: "pointer" }}>Teknik ayrıntı</summary>
          <pre style={{ fontSize: 10.5, color: "#DC2626", whiteSpace: "pre-wrap", wordBreak: "break-word", marginTop: 8, maxHeight: 220, overflow: "auto" }}>{metin}</pre>
        </details>
      </div>
    </div>;
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HataKalkani>
      <App />
    </HataKalkani>
  </React.StrictMode>
);
