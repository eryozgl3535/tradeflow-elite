// ═══════════════════════════════════════════════════════════════
// 🎮 EĞLENCE KÖŞESİ — Offline mini oyunlar
// Tamamen tarayıcıda çalışır. Sunucuya hiçbir şey gitmez.
// Sadece en yüksek skorlar cihazın localStorage'ında saklanır.
// İş verisiyle (müşteri/fatura) SIFIR teması vardır.
// ═══════════════════════════════════════════════════════════════
import { useState, useEffect, useRef, useCallback } from "react";

// Tema — App.jsx'teki C ile uyumlu, prop olarak alır
const skorAl=(k)=>{try{return Number(localStorage.getItem("tf_skor_"+k)||0);}catch{return 0;}};
const skorYaz=(k,v)=>{try{if(v>skorAl(k))localStorage.setItem("tf_skor_"+k,String(v));}catch{}};

// ─── ANA MENÜ ───────────────────────────────────────────────────
export function EglenceKosesi({onKapat,C,P,GRAD,APP_W,GeriBaslik,Sh}){
  const [oyun,setOyun]=useState(null);
  const oyunlar=[
    {id:"2048",ad:"2048", emoji:"🔢",renk:"#F59E0B",aciklama:"Sayıları birleştir, 2048'e ulaş"},
    {id:"yilan",ad:"Yılan",emoji:"🐍",renk:"#0E9F6E",aciklama:"Klasik yılan — yemleri topla, büyü"},
    {id:"hafiza",ad:"Hafıza — Aletler",emoji:"🧰",renk:"#3B82F6",aciklama:"Alet çiftlerini eşleştir"},
    {id:"asmaca",ad:"Adam Asmaca",emoji:"🔤",renk:"#7C3AED",aciklama:"Türkçe kelimeyi harf harf bul"},
  ];
  if(oyun==="2048")   return <Oyun2048   onKapat={()=>setOyun(null)} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh}/>;
  if(oyun==="yilan")  return <OyunYilan  onKapat={()=>setOyun(null)} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh}/>;
  if(oyun==="hafiza") return <OyunHafiza onKapat={()=>setOyun(null)} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh}/>;
  if(oyun==="asmaca") return <OyunAsmaca onKapat={()=>setOyun(null)} C={C} P={P} APP_W={APP_W} GeriBaslik={GeriBaslik} Sh={Sh}/>;
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="🎮 Eğlence Köşesi" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <div style={{background:GRAD,borderRadius:18,padding:"18px 20px",color:"#fff",marginBottom:18}}>
          <div style={{fontSize:17,fontWeight:800,marginBottom:4}}>Mola zamanı ☕</div>
          <div style={{fontSize:12.5,opacity:0.9,lineHeight:1.5}}>Kafanı dağıt, biraz eğlen. Oyunlar internet olmadan da çalışır, skorların cihazında saklanır.</div>
        </div>
        {oyunlar.map(o=><Sh key={o.id} onClick={()=>setOyun(o.id)} s={{padding:"16px 18px",marginBottom:11,display:"flex",alignItems:"center",gap:15,cursor:"pointer"}}>
          <div style={{width:52,height:52,borderRadius:14,background:o.renk+"1A",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{o.emoji}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:15,fontWeight:700,color:C.t1}}>{o.ad}</div>
            <div style={{fontSize:11.5,color:C.t3,marginTop:2}}>{o.aciklama}</div>
          </div>
          {skorAl(o.id)>0&&<div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:9,color:C.t3,fontWeight:700}}>REKOR</div>
            <div style={{fontSize:15,fontWeight:800,color:o.renk}}>{skorAl(o.id)}</div>
          </div>}
          <span style={{color:C.t3,fontSize:18}}>›</span>
        </Sh>)}
        <div style={{textAlign:"center",fontSize:11,color:C.t3,marginTop:8,lineHeight:1.6}}>Daha fazla oyun yolda 🎯<br/>Sudoku · Taş-Kağıt-Makas yakında</div>
      </div>
    </div>
  </div>;
}

// ═══ OYUN KABUĞU (ortak başlık + skor şeridi) ═══
function OyunKabuk({baslik,skorEt,rekor,skor,C,APP_W,GeriBaslik,onKapat,renk,children,altBar}){
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1003,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={baslik} onKapat={onKapat}/>
      <div style={{display:"flex",gap:10,padding:"12px 14px 0"}}>
        <div style={{flex:1,background:C.card,borderRadius:12,padding:"9px 12px",boxShadow:C.sh}}>
          <div style={{fontSize:9,color:C.t3,fontWeight:700}}>{skorEt||"SKOR"}</div>
          <div style={{fontSize:19,fontWeight:800,color:renk||C.t1}}>{skor}</div>
        </div>
        <div style={{flex:1,background:C.card,borderRadius:12,padding:"9px 12px",boxShadow:C.sh}}>
          <div style={{fontSize:9,color:C.t3,fontWeight:700}}>REKOR</div>
          <div style={{fontSize:19,fontWeight:800,color:C.t2}}>{rekor}</div>
        </div>
        {altBar}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"14px",overflow:"hidden"}}>{children}</div>
    </div>
  </div>;
}

// ═══════════════════ 2048 ═══════════════════
function Oyun2048({onKapat,C,P,APP_W,GeriBaslik}){
  const boyut=4;
  const bosGrid=()=>Array(boyut).fill().map(()=>Array(boyut).fill(0));
  const [grid,setGrid]=useState(bosGrid);
  const [skor,setSkor]=useState(0);
  const [rekor,setRekor]=useState(skorAl("2048"));
  const [bitti,setBitti]=useState(false);
  const [kazandi,setKazandi]=useState(false);
  const dokunRef=useRef(null);

  const rastgeleEkle=(g)=>{
    const bos=[];g.forEach((r,i)=>r.forEach((c,j)=>{if(c===0)bos.push([i,j]);}));
    if(bos.length===0)return g;
    const [i,j]=bos[Math.floor(Math.random()*bos.length)];
    g[i][j]=Math.random()<0.9?2:4;return g;
  };
  const basla=useCallback(()=>{let g=bosGrid();g=rastgeleEkle(g);g=rastgeleEkle(g);setGrid(g);setSkor(0);setBitti(false);setKazandi(false);},[]);
  useEffect(()=>{basla();},[basla]);

  const kaydir=(g,yon)=>{
    let puan=0;const yeni=g.map(r=>[...r]);
    const sikistir=(satir)=>{
      let s=satir.filter(x=>x!==0);
      for(let i=0;i<s.length-1;i++){if(s[i]===s[i+1]){s[i]*=2;puan+=s[i];s.splice(i+1,1);}}
      while(s.length<boyut)s.push(0);return s;
    };
    const dondur=(m)=>m[0].map((_,i)=>m.map(r=>r[i]));
    let mat=yeni;
    if(yon==="sag")mat=mat.map(r=>r.reverse());
    if(yon==="yukari")mat=dondur(mat);
    if(yon==="asagi"){mat=dondur(mat);mat=mat.map(r=>r.reverse());}
    mat=mat.map(sikistir);
    if(yon==="sag")mat=mat.map(r=>r.reverse());
    if(yon==="yukari")mat=dondur(mat);
    if(yon==="asagi"){mat=mat.map(r=>r.reverse());mat=dondur(mat);}
    return {mat,puan};
  };
  const hamle=(yon)=>{
    if(bitti)return;
    const {mat,puan}=kaydir(grid,yon);
    if(JSON.stringify(mat)===JSON.stringify(grid))return;
    rastgeleEkle(mat);
    const yeniSkor=skor+puan;setSkor(yeniSkor);
    if(!kazandi&&mat.some(r=>r.includes(2048)))setKazandi(true);
    setGrid(mat);
    // bitiş kontrolü
    const dolu=mat.every(r=>r.every(c=>c!==0));
    if(dolu){
      let hamleVar=false;
      for(const y of ["sol","sag","yukari","asagi"]){if(JSON.stringify(kaydir(mat,y).mat)!==JSON.stringify(mat))hamleVar=true;}
      if(!hamleVar){setBitti(true);skorYaz("2048",yeniSkor);setRekor(skorAl("2048"));}
    }
  };
  useEffect(()=>{
    const t=(e)=>{const m={ArrowLeft:"sol",ArrowRight:"sag",ArrowUp:"yukari",ArrowDown:"asagi"}[e.key];if(m){e.preventDefault();hamle(m);}};
    window.addEventListener("keydown",t);return ()=>window.removeEventListener("keydown",t);
  });
  const dokunBas=(e)=>{const t=e.touches[0];dokunRef.current={x:t.clientX,y:t.clientY};};
  const dokunBit=(e)=>{
    if(!dokunRef.current)return;const t=e.changedTouches[0];
    const dx=t.clientX-dokunRef.current.x,dy=t.clientY-dokunRef.current.y;
    if(Math.abs(dx)<20&&Math.abs(dy)<20)return;
    if(Math.abs(dx)>Math.abs(dy))hamle(dx>0?"sag":"sol");else hamle(dy>0?"asagi":"yukari");
    dokunRef.current=null;
  };
  const renkler={2:"#EEE4DA",4:"#EDE0C8",8:"#F2B179",16:"#F59563",32:"#F67C5F",64:"#F65E3B",128:"#EDCF72",256:"#EDCC61",512:"#EDC850",1024:"#EDC53F",2048:"#EDC22E"};
  return <OyunKabuk baslik="🔢 2048" skor={skor} rekor={rekor} C={C} APP_W={APP_W} GeriBaslik={GeriBaslik} onKapat={onKapat} renk="#F59E0B"
    altBar={<button onClick={basla} style={{background:"#F59E0B",border:"none",borderRadius:12,padding:"0 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Yeni</button>}>
    <div onTouchStart={dokunBas} onTouchEnd={dokunBit} style={{background:"#BBADA0",borderRadius:12,padding:10,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,width:"min(88vw,360px)",aspectRatio:"1",position:"relative",touchAction:"none"}}>
      {grid.flat().map((v,i)=><div key={i} style={{background:v?renkler[v]||"#3C3A32":"#CDC1B4",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:v>=1024?"clamp(16px,5vw,26px)":"clamp(20px,7vw,34px)",fontWeight:800,color:v<=4?"#776E65":"#fff"}}>{v||""}</div>)}
      {(bitti||kazandi)&&<div style={{position:"absolute",inset:0,background:"rgba(238,228,218,0.85)",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
        <div style={{fontSize:26,fontWeight:900,color:"#776E65"}}>{kazandi&&!bitti?"🎉 2048!":"Oyun Bitti"}</div>
        <button onClick={basla} style={{background:"#8F7A66",border:"none",borderRadius:10,padding:"12px 24px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>{kazandi&&!bitti?"Devam Et":"Tekrar Oyna"}</button>
      </div>}
    </div>
    <div style={{fontSize:11,color:C.t3,marginTop:16,textAlign:"center"}}>Kaydırarak oyna · Bilgisayarda ok tuşları</div>
  </OyunKabuk>;
}

// ═══════════════════ YILAN ═══════════════════
function OyunYilan({onKapat,C,P,APP_W,GeriBaslik}){
  const N=15;
  const [yilan,setYilan]=useState([[7,7]]);
  const [yem,setYem]=useState([4,4]);
  const [yon,setYon]=useState([0,1]);
  const [skor,setSkor]=useState(0);
  const [rekor,setRekor]=useState(skorAl("yilan"));
  const [bitti,setBitti]=useState(false);
  const [oynuyor,setOynuyor]=useState(false);
  const yonRef=useRef(yon);yonRef.current=yon;
  const yilanRef=useRef(yilan);yilanRef.current=yilan;
  const dokunRef=useRef(null);

  const basla=()=>{setYilan([[7,7]]);setYem([4,4]);setYon([0,1]);setSkor(0);setBitti(false);setOynuyor(true);};
  const yeniYem=(yln)=>{let y;do{y=[Math.floor(Math.random()*N),Math.floor(Math.random()*N)];}while(yln.some(s=>s[0]===y[0]&&s[1]===y[1]));return y;};

  useEffect(()=>{
    if(!oynuyor)return;
    const t=setInterval(()=>{
      const y=yilanRef.current;const d=yonRef.current;
      const bas=[y[0][0]+d[0],y[0][1]+d[1]];
      if(bas[0]<0||bas[0]>=N||bas[1]<0||bas[1]>=N||y.some(s=>s[0]===bas[0]&&s[1]===bas[1])){
        setBitti(true);setOynuyor(false);
        setSkor(sk=>{skorYaz("yilan",sk);setRekor(skorAl("yilan"));return sk;});
        return;
      }
      setYem(yy=>{
        if(bas[0]===yy[0]&&bas[1]===yy[1]){
          const yeni=[bas,...y];setYilan(yeni);setSkor(s=>s+10);return yeniYem(yeni);
        }else{setYilan([bas,...y.slice(0,-1)]);return yy;}
      });
    },160);
    return ()=>clearInterval(t);
  },[oynuyor]);

  const cevir=(yeni)=>{const d=yonRef.current;if(d[0]===-yeni[0]&&d[1]===-yeni[1])return;setYon(yeni);};
  useEffect(()=>{
    const t=(e)=>{const m={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[e.key];if(m){e.preventDefault();cevir(m);}};
    window.addEventListener("keydown",t);return ()=>window.removeEventListener("keydown",t);
  },[]);
  const dokunBas=(e)=>{const t=e.touches[0];dokunRef.current={x:t.clientX,y:t.clientY};};
  const dokunBit=(e)=>{if(!dokunRef.current)return;const t=e.changedTouches[0];const dx=t.clientX-dokunRef.current.x,dy=t.clientY-dokunRef.current.y;if(Math.abs(dx)<20&&Math.abs(dy)<20)return;if(Math.abs(dx)>Math.abs(dy))cevir([0,dx>0?1:-1]);else cevir([dy>0?1:-1,0]);dokunRef.current=null;};

  return <OyunKabuk baslik="🐍 Yılan" skor={skor} rekor={rekor} C={C} APP_W={APP_W} GeriBaslik={GeriBaslik} onKapat={onKapat} renk="#0E9F6E"
    altBar={<button onClick={basla} style={{background:"#0E9F6E",border:"none",borderRadius:12,padding:"0 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{oynuyor?"Yeni":"Başlat"}</button>}>
    <div onTouchStart={dokunBas} onTouchEnd={dokunBit} style={{position:"relative",background:"#0F1F1A",borderRadius:12,width:"min(88vw,360px)",aspectRatio:"1",display:"grid",gridTemplateColumns:`repeat(${N},1fr)`,gap:1,padding:4,touchAction:"none"}}>
      {Array(N*N).fill().map((_,i)=>{
        const r=Math.floor(i/N),c=i%N;
        const bas=yilan[0]&&yilan[0][0]===r&&yilan[0][1]===c;
        const govde=yilan.some(s=>s[0]===r&&s[1]===c);
        const yemVar=yem[0]===r&&yem[1]===c;
        return <div key={i} style={{background:bas?"#34D399":govde?"#0E9F6E":yemVar?"#F59E0B":"transparent",borderRadius:bas||yemVar?4:2}}/>;
      })}
      {(!oynuyor)&&<div style={{position:"absolute",inset:0,background:"rgba(15,31,26,0.88)",borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
        <div style={{fontSize:24,fontWeight:900,color:"#34D399"}}>{bitti?"Oyun Bitti 🐍":"Yılan"}</div>
        {bitti&&<div style={{fontSize:14,color:"#fff"}}>Skor: {skor}</div>}
        <button onClick={basla} style={{background:"#0E9F6E",border:"none",borderRadius:10,padding:"12px 24px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>{bitti?"Tekrar":"Başlat"}</button>
      </div>}
    </div>
    <div style={{fontSize:11,color:C.t3,marginTop:16,textAlign:"center"}}>Kaydırarak yön ver · Bilgisayarda ok tuşları</div>
  </OyunKabuk>;
}

// ═══════════════════ HAFIZA — ALETLER ═══════════════════
function OyunHafiza({onKapat,C,P,APP_W,GeriBaslik}){
  const aletler=["🔧","🔨","🪛","⚙️","🔩","🧰","🪚","📏"];
  const karistir=()=>{
    const ciftler=[...aletler,...aletler].map((e,i)=>({id:i,emoji:e,acik:false,eslesti:false}));
    for(let i=ciftler.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[ciftler[i],ciftler[j]]=[ciftler[j],ciftler[i]];}
    return ciftler;
  };
  const [kartlar,setKartlar]=useState(karistir);
  const [secili,setSecili]=useState([]);
  const [hamle,setHamle]=useState(0);
  const [rekor,setRekor]=useState(skorAl("hafiza"));
  const [bitti,setBitti]=useState(false);
  const kilit=useRef(false);

  const basla=()=>{setKartlar(karistir());setSecili([]);setHamle(0);setBitti(false);kilit.current=false;};
  const tikla=(ix)=>{
    if(kilit.current||kartlar[ix].acik||kartlar[ix].eslesti)return;
    const yeni=kartlar.map((k,i)=>i===ix?{...k,acik:true}:k);
    setKartlar(yeni);
    const yeniSecili=[...secili,ix];
    if(yeniSecili.length===2){
      setHamle(h=>h+1);kilit.current=true;
      const [a,b]=yeniSecili;
      if(yeni[a].emoji===yeni[b].emoji){
        setTimeout(()=>{
          const es=yeni.map((k,i)=>i===a||i===b?{...k,eslesti:true}:k);
          setKartlar(es);setSecili([]);kilit.current=false;
          if(es.every(k=>k.eslesti)){
            setBitti(true);const yeniHamle=hamle+1;
            // düşük hamle = iyi. Skor = 100 - hamle (min 10)
            const puan=Math.max(10,100-yeniHamle*3);skorYaz("hafiza",puan);setRekor(skorAl("hafiza"));
          }
        },400);
      }else{
        setTimeout(()=>{setKartlar(yeni.map((k,i)=>i===a||i===b?{...k,acik:false}:k));setSecili([]);kilit.current=false;},750);
      }
    }else setSecili(yeniSecili);
  };
  return <OyunKabuk baslik="🧰 Hafıza" skorEt="HAMLE" skor={hamle} rekor={rekor} C={C} APP_W={APP_W} GeriBaslik={GeriBaslik} onKapat={onKapat} renk="#3B82F6"
    altBar={<button onClick={basla} style={{background:"#3B82F6",border:"none",borderRadius:12,padding:"0 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>Yeni</button>}>
    <div style={{position:"relative",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,width:"min(88vw,360px)"}}>
      {kartlar.map((k,i)=><div key={k.id} onClick={()=>tikla(i)} style={{aspectRatio:"1",borderRadius:12,background:k.acik||k.eslesti?"#fff":"#3B82F6",border:k.eslesti?"2px solid #0E9F6E":"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"clamp(24px,8vw,38px)",cursor:"pointer",boxShadow:C.sh,transition:"transform 0.15s",transform:k.acik||k.eslesti?"none":"none",opacity:k.eslesti?0.65:1}}>
        {(k.acik||k.eslesti)?k.emoji:<span style={{color:"#fff",fontSize:22,fontWeight:800}}>?</span>}
      </div>)}
      {bitti&&<div style={{position:"absolute",inset:-8,background:"rgba(255,255,255,0.9)",borderRadius:14,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12}}>
        <div style={{fontSize:24,fontWeight:900,color:"#3B82F6"}}>🎉 Bravo!</div>
        <div style={{fontSize:14,color:C.t2}}>{hamle} hamlede bitirdin</div>
        <button onClick={basla} style={{background:"#3B82F6",border:"none",borderRadius:10,padding:"12px 24px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>Tekrar Oyna</button>
      </div>}
    </div>
    <div style={{fontSize:11,color:C.t3,marginTop:16,textAlign:"center"}}>Az hamlede bitir, rekor kır 🏆</div>
  </OyunKabuk>;
}

// ═══════════════════ ADAM ASMACA ═══════════════════
const ASMACA_KELIMELER=[
  {k:"TORNAVIDA",i:"Vida sıkma aleti"},{k:"MATKAP",i:"Delik açar"},{k:"KESKI",i:"Yontma aleti"},
  {k:"PENSE",i:"Tel bükme/kesme"},{k:"CEKIC",i:"Çivi çakar"},{k:"TESTERE",i:"Kesme aleti"},
  {k:"MERDIVEN",i:"Yükseğe çıkmak için"},{k:"KABLO",i:"Elektrik taşır"},{k:"MUSLUK",i:"Su akıtır"},
  {k:"BORU",i:"İçinden sıvı geçer"},{k:"VANA",i:"Akışı keser"},{k:"PANO",i:"Elektrik dağıtım kutusu"},
  {k:"SIGORTA",i:"Aşırı akımı keser"},{k:"CIVATA",i:"Somunla eşleşir"},{k:"KAYNAK",i:"Metal birleştirme"},
  {k:"BETON",i:"İnşaat harcı"},{k:"TUGLA",i:"Duvar malzemesi"},{k:"CIMENTO",i:"Bağlayıcı toz"},
  {k:"ISKELE",i:"Geçici çalışma platformu"},{k:"MALA",i:"Sıva aleti"},{k:"SPATULA",i:"Macun sürme"},
  {k:"POMPA",i:"Sıvı basar"},{k:"KOMPRESOR",i:"Hava basıncı üretir"},{k:"JENERATOR",i:"Elektrik üretir"},
  {k:"HAVUZ",i:"İçinde yüzülür"},{k:"KLIMA",i:"Serinletir"},{k:"KOMBI",i:"Isıtma cihazı"},
  {k:"RADYATOR",i:"Isı yayar"},{k:"FILTRE",i:"Süzer, temizler"},{k:"CONTA",i:"Sızdırmazlık sağlar"},
];
function OyunAsmaca({onKapat,C,P,APP_W,GeriBaslik}){
  const HARFLER="ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split("");
  const [kelime,setKelime]=useState({k:"",i:""});
  const [bulunan,setBulunan]=useState([]);
  const [yanlis,setYanlis]=useState([]);
  const [skor,setSkor]=useState(0);
  const [rekor,setRekor]=useState(skorAl("asmaca"));
  const MAX=6;
  const durum=(()=>{
    if(yanlis.length>=MAX)return "kayip";
    if(kelime.k&&kelime.k.split("").every(h=>h===" "||bulunan.includes(h)))return "kazanc";
    return "oyun";
  })();

  const yeniKelime=()=>{
    const s=ASMACA_KELIMELER[Math.floor(Math.random()*ASMACA_KELIMELER.length)];
    setKelime(s);setBulunan([]);setYanlis([]);
  };
  useEffect(()=>{yeniKelime();},[]);
  useEffect(()=>{
    if(durum==="kazanc"){
      const yeniSkor=skor+1;setSkor(yeniSkor);skorYaz("asmaca",yeniSkor);setRekor(skorAl("asmaca"));
    }else if(durum==="kayip"){
      skorYaz("asmaca",skor);setRekor(skorAl("asmaca"));
    }
  // eslint-disable-next-line
  },[durum]);

  const harfSec=(h)=>{
    if(durum!=="oyun"||bulunan.includes(h)||yanlis.includes(h))return;
    if(kelime.k.includes(h))setBulunan(p=>[...p,h]);
    else setYanlis(p=>[...p,h]);
  };
  const sonraki=()=>{if(durum==="kayip")setSkor(0);yeniKelime();};

  // Asılan adam çizimi (yanlış sayısına göre parça parça)
  const parcalar=yanlis.length;
  return <OyunKabuk baslik="🔤 Adam Asmaca" skorEt="DOĞRU" skor={skor} rekor={rekor} C={C} APP_W={APP_W} GeriBaslik={GeriBaslik} onKapat={onKapat} renk="#7C3AED"
    altBar={<div style={{background:yanlis.length>=4?"#FEE2E2":C.card,borderRadius:12,padding:"9px 12px",boxShadow:C.sh,minWidth:56,textAlign:"center"}}><div style={{fontSize:9,color:C.t3,fontWeight:700}}>CAN</div><div style={{fontSize:19,fontWeight:800,color:yanlis.length>=4?"#DC2626":"#0E9F6E"}}>{MAX-parcalar}</div></div>}>
    {/* Darağacı */}
    <svg viewBox="0 0 120 120" style={{width:130,height:130,marginBottom:6}}>
      <line x1="10" y1="115" x2="70" y2="115" stroke={C.t2} strokeWidth="3"/>
      <line x1="30" y1="115" x2="30" y2="10" stroke={C.t2} strokeWidth="3"/>
      <line x1="30" y1="10" x2="80" y2="10" stroke={C.t2} strokeWidth="3"/>
      <line x1="80" y1="10" x2="80" y2="25" stroke={C.t2} strokeWidth="3"/>
      {parcalar>0&&<circle cx="80" cy="35" r="10" stroke="#DC2626" strokeWidth="3" fill="none"/>}
      {parcalar>1&&<line x1="80" y1="45" x2="80" y2="75" stroke="#DC2626" strokeWidth="3"/>}
      {parcalar>2&&<line x1="80" y1="55" x2="65" y2="65" stroke="#DC2626" strokeWidth="3"/>}
      {parcalar>3&&<line x1="80" y1="55" x2="95" y2="65" stroke="#DC2626" strokeWidth="3"/>}
      {parcalar>4&&<line x1="80" y1="75" x2="68" y2="95" stroke="#DC2626" strokeWidth="3"/>}
      {parcalar>5&&<line x1="80" y1="75" x2="92" y2="95" stroke="#DC2626" strokeWidth="3"/>}
    </svg>
    {/* İpucu */}
    <div style={{fontSize:12,color:C.t3,marginBottom:10}}>💡 {kelime.i}</div>
    {/* Kelime */}
    <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"center",marginBottom:18}}>
      {kelime.k.split("").map((h,i)=><div key={i} style={{width:26,height:34,borderBottom:`3px solid ${C.t2}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:durum==="kayip"&&!bulunan.includes(h)?"#DC2626":C.t1}}>{bulunan.includes(h)||durum==="kayip"?h:""}</div>)}
    </div>
    {durum==="oyun"
      ?<div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:6,width:"min(92vw,380px)"}}>
        {HARFLER.map(h=>{const kul=bulunan.includes(h)||yanlis.includes(h);const dogru=bulunan.includes(h);
          return <button key={h} onClick={()=>harfSec(h)} disabled={kul} style={{aspectRatio:"1",borderRadius:8,border:"none",background:kul?(dogru?"#0E9F6E":"#E5E7EB"):"#7C3AED",color:kul?(dogru?"#fff":"#9CA3AF"):"#fff",fontSize:15,fontWeight:800,cursor:kul?"default":"pointer"}}>{h}</button>;
        })}
      </div>
      :<div style={{textAlign:"center"}}>
        <div style={{fontSize:26,fontWeight:900,color:durum==="kazanc"?"#0E9F6E":"#DC2626",marginBottom:6}}>{durum==="kazanc"?"🎉 Bildin!":"💀 Kaybettin"}</div>
        <div style={{fontSize:15,color:C.t2,marginBottom:16}}>Kelime: <b>{kelime.k}</b></div>
        <button onClick={sonraki} style={{background:"#7C3AED",border:"none",borderRadius:10,padding:"13px 28px",color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>{durum==="kazanc"?"Sıradaki Kelime →":"Yeniden Başla"}</button>
      </div>}
  </OyunKabuk>;
}
