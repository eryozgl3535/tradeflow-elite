// Türkçe serbest cümleyi iş formu alanlarına ayrıştırır.
// Tamamen cihazda çalışır — internet gerekmez.

const NRM=(x)=>String(x||"").toLocaleLowerCase("tr")
  .replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g")
  .replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c").replace(/â/g,"a");

const GUN_AD={pazartesi:1,sali:2,carsamba:3,persembe:4,cuma:5,cumartesi:6,pazar:0};

// "18 bin 500", "18500", "18.500" → 18500
function sayiCoz(ham){
  let s=String(ham).replace(/\./g,"").replace(/,/g,".").trim();
  const bin=s.match(/^(\d+(?:\.\d+)?)\s*bin\s*(\d+)?$/i);
  if(bin) return Math.round(parseFloat(bin[1])*1000+(parseInt(bin[2]||"0",10)));
  const n=parseFloat(s);
  return isFinite(n)?n:null;
}

function isoTarih(d){
  const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return z.toISOString().slice(0,10);
}

export function sesliIsAyristir(hamMetin,{musteriler=[],ekip=[]}={}){
  let m=" "+String(hamMetin||"").replace(/\s+/g," ").trim()+" ";
  const bulunan={};
  const kes=(re)=>{const x=m.match(re); if(x)m=m.replace(x[0]," "); return x;};

  // ── Komut ön eki: "yeni iş", "iş ekle" ──
  kes(/^\s*(yeni\s+(bir\s+)?(iş|is)\s*(ekle|aç|oluştur|olustur)?|iş\s+ekle|is\s+ekle)\s*[:,]?\s*/i);

  // ── Telefon ── 0532 111 22 33 / 05321112233
  {
    const x=kes(/\b(?:telefon(?:u|:)?\s*)?(0?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})\b/i);
    if(x){
      let t=x[1].replace(/\D/g,"");
      if(t.length===10)t="0"+t;
      if(t.length===11)bulunan.musteriTelefon=t;
    }
  }

  // ── Maliyet / masraf (tutardan ÖNCE aranmalı) ──
  {
    const x=kes(/\b(?:maliyet|masraf|gider)(?:i|im)?\s*:?\s*(\d[\d.,]*(?:\s*bin\s*\d*)?)\s*(?:tl|lira|₺)?\b/i);
    if(x){const v=sayiCoz(x[1]); if(v!==null)bulunan.maliyet=String(Math.round(v));}
  }

  // ── Tutar ──
  {
    let x=kes(/\b(?:tutar|fiyat|ücret|ucret|bedel)(?:i|ı)?\s*:?\s*(\d[\d.,]*(?:\s*bin\s*\d*)?)\s*(?:tl|lira|₺)?\b/i)
       || kes(/\b(\d[\d.,]*(?:\s*bin\s*\d*)?)\s*(?:tl|lira|₺)\b/i);
    if(x){const v=sayiCoz(x[1]); if(v!==null)bulunan.tutar=String(Math.round(v));}
  }

  // ── Kişi sayısı ──
  {
    const x=kes(/\b(\d+)\s*(?:kişi|kisi)\b/i);
    if(x)bulunan.kisiSayisi=parseInt(x[1],10);
  }

  // ── Malzemeler ──
  {
    const x=kes(/\b(?:malzeme(?:ler)?(?:si|leri)?|kullanılacak(?:lar)?|kullanilacak(?:lar)?|lazım olan|lazim olan|gerekli(?:si)?)\s*:?\s*(.+?)(?=\s*(?:,|;|\.|adres|not|telefon|tarih|yarın|yarin|bugün|bugun|saat|$))/i);
    if(x){
      const mal=x[1].trim().replace(/\s+ve\s+/gi,"\n").replace(/\s*,\s*/g,"\n").trim();
      if(mal)bulunan.malzemeler=mal;
    }
  }

  // ── Adres ──
  {
    const x=kes(/\b(?:adres(?:i|:)?|konum(?:u)?)\s*:?\s*(.+?)(?=\s*(?:,|;|\.|not|telefon|malzeme|tarih|$))/i);
    if(x&&x[1].trim())bulunan.isAdresi=x[1].trim();
  }

  // ── Not ──
  {
    const x=kes(/\b(?:not(?:u|:)?|açıklama|aciklama)\s*:?\s*(.+?)(?=\s*(?:;|\.|$))/i);
    if(x&&x[1].trim())bulunan.not=x[1].trim();
  }

  // ── Saat ──
  let saatStr=null;
  {
    const x=kes(/\bsaat\s*(\d{1,2})(?:[:.](\d{2}))?\b/i);
    if(x){
      const h=parseInt(x[1],10), dk=parseInt(x[2]||"0",10);
      if(h<=23)saatStr=String(h).padStart(2,"0")+":"+String(dk).padStart(2,"0");
    }
  }

  // ── Tarih ──
  let tarih=null;
  const bugun=new Date();
  if(kes(/\byarın\b|\byarin\b/i)){tarih=new Date(bugun.getTime()+864e5);}
  else if(kes(/\bbugün\b|\bbugun\b/i)){tarih=new Date(bugun);}
  else if(kes(/\bö?bür ?gün\b|\bobur ?gun\b|\bertesi gün\b/i)){tarih=new Date(bugun.getTime()+2*864e5);}
  else {
    const x=kes(/\b(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?\b/);
    if(x){
      const g=parseInt(x[1],10),ay=parseInt(x[2],10);
      let yil=x[3]?parseInt(x[3],10):bugun.getFullYear();
      if(yil<100)yil+=2000;
      if(g>=1&&g<=31&&ay>=1&&ay<=12)tarih=new Date(yil,ay-1,g);
    } else {
      for(const [ad,no] of Object.entries(GUN_AD)){
        const re=new RegExp("\\b(?:gelecek\\s+|haftaya\\s+)?"+ad+"\\b","i");
        if(re.test(NRM(m))){
          m=m.replace(new RegExp(ad.replace(/i/g,"[iı]").replace(/s/g,"[sş]").replace(/c/g,"[cç]"),"i")," ");
          const fark=(no-bugun.getDay()+7)%7||7;
          tarih=new Date(bugun.getTime()+fark*864e5);
          break;
        }
      }
    }
  }
  if(tarih)bulunan.tarih=isoTarih(tarih);
  if(saatStr){
    const t=tarih||bugun;
    bulunan.hatirlatma=isoTarih(t)+"T"+saatStr;
    if(!bulunan.tarih)bulunan.tarih=isoTarih(t);
  }

  // ── Müşteri ──
  // 1) Kayıtlı müşterilerle eşleşme (en güvenilir)
  {
    const mn=NRM(m);
    let enIyi=null;
    musteriler.filter(Boolean).forEach(ad=>{
      const an=NRM(ad);
      if(an.length>=3&&mn.includes(an)&&(!enIyi||an.length>NRM(enIyi).length))enIyi=ad;
    });
    if(enIyi){
      bulunan.musteri=enIyi;
      const i=mn.indexOf(NRM(enIyi));
      m=(m.slice(0,i)+" "+m.slice(i+enIyi.length)).replace(/\s+/g," ");
      // "…'a / …'e / …ya" yönelme ekini temizle
      m=m.replace(/^\s*['’]?\s*(a|e|ya|ye|na|ne|için|icin)\b/i," ");
    }
  }
  // 2) Yoksa: baştaki büyük harfli ad + yönelme eki
  if(!bulunan.musteri){
    const x=m.match(/^\s*([A-ZÇĞİÖŞÜ][\wçğıöşüÇĞİÖŞÜ]+(?:\s+[A-ZÇĞİÖŞÜ][\wçğıöşüÇĞİÖŞÜ]+){0,2})\s*['’]?\s*(?:a|e|ya|ye|na|ne|için|icin)\b/);
    if(x){bulunan.musteri=x[1].trim();m=m.replace(x[0]," ");}
  }

  // ── Atanan usta (ekipten) ──
  if(ekip.length){
    const mn=NRM(m);
    const bul=ekip.map(e=>typeof e==="string"?e:e.ad).filter(Boolean)
      .find(ad=>NRM(ad).length>=3&&mn.includes(NRM(ad)));
    if(bul){
      bulunan.atanan=bul;
      const i=mn.indexOf(NRM(bul));
      m=(m.slice(0,i)+" "+m.slice(i+bul.length)).replace(/\s+/g," ");
    }
  }

  // ── Kalan = başlık ──
  let baslik=m.replace(/\s*[,;.]+\s*/g," ").replace(/\s+/g," ").trim()
    .replace(/^(ve|için|icin|ile|de|da)\s+/i,"")
    // sonda kalan dolgu fiilleri ("… Hasan Usta yapacak" → "…")
    .replace(/\s+(yapacak|yapsın|yapsin|gidecek|bakacak|baksın|baksin|olacak|versin|alsın|alsin|var|lazım|lazim)\s*$/i,"")
    .replace(/\s+(ve|için|icin|ile)\s*$/i,"");
  if(baslik.length>=2){
    bulunan.baslik=baslik.charAt(0).toLocaleUpperCase("tr")+baslik.slice(1);
  }

  return bulunan;
}
