// ═══ VERİ KATMANI — Supabase (bulut) + IndexedDB (çevrimdışı) ═══
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://xnxxormjtzjhjamzqfjh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHhvcm1qdHpqaGphbXpxZmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTQzNTcsImV4cCI6MjA5ODkzMDM1N30.5onyGAnfYJ8YHgXqlfsOMAdIml2OAGFFtpt_57H9kjo";
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,      // oturumu tarayıcıda sakla
    autoRefreshToken: true,    // süresi dolunca otomatik yenile
    storageKey: "tradeflow-oturum",
  },
});

// ─── ÇEVRİMDIŞI YEREL DEPO (IndexedDB) ──────────────────────────
const IDB_AD="tradeflow-yerel",IDB_STORE="paketler";
function idbAc(){return new Promise((res,rej)=>{
  const r=indexedDB.open(IDB_AD,1);
  r.onupgradeneeded=()=>{r.result.createObjectStore(IDB_STORE);};
  r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);
});}
export async function yerelKaydet(kullaniciId,paket){
  try{const db=await idbAc();
    await new Promise((res,rej)=>{const tx=db.transaction(IDB_STORE,"readwrite");
      tx.objectStore(IDB_STORE).put({paket,zaman:Date.now()},kullaniciId);
      tx.oncomplete=res;tx.onerror=()=>rej(tx.error);});
  }catch(e){console.warn("Yerel kayıt:",e);}
}
export async function yerelYukle(kullaniciId){
  try{const db=await idbAc();
    return await new Promise((res)=>{const rq=db.transaction(IDB_STORE).objectStore(IDB_STORE).get(kullaniciId);
      rq.onsuccess=()=>res(rq.result||null);rq.onerror=()=>res(null);});
  }catch(e){return null;}
}
