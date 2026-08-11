// ═══════════════════════════════════════════════════════════════
// 🎙️ SESLİ İŞ DOLDURMA — Türkçe cümle → form alanları
// Tamamen cihazda çalışır, internet gerekmez.
//
// İki aşama:
//  1) ETİKET TARAMASI — "müşteri adı X, iş değeri Y, adres Z" gibi
//     etiketli konuşma. İnsanlar telefona doğal olarak böyle konuşuyor.
//  2) SERBEST CÜMLE — "Ahmet'e kombi bakımı 3200 lira" gibi etiketsiz
//     konuşma; etiket bulunamayan kısımda sezgisel çıkarım yapılır.
// ═══════════════════════════════════════════════════════════════

const NRM=(x)=>String(x||"").toLocaleLowerCase("tr")
  .replace(/ı/g,"i").replace(/ş/g,"s").replace(/ğ/g,"g")
  .replace(/ü/g,"u").replace(/ö/g,"o").replace(/ç/g,"c").replace(/â/g,"a");

const GUN_AD={pazartesi:1,sali:2,carsamba:3,persembe:4,cuma:5,cumartesi:6,pazar:0};

// "22.000" · "22 000" · "22 bin 500" · "22bin" → 22000 / 22500
function sayiCoz(ham){
  if(ham==null)return null;
  let s=String(ham).trim().toLocaleLowerCase("tr");
  const bin=s.match(/^([\d.,\s]+?)\s*bin\s*([\d.,\s]*)$/);
  if(bin){
    const a=parseFloat(bin[1].replace(/[.\s]/g,"").replace(",","."))||0;
    const b=parseFloat((bin[2]||"").replace(/[.\s]/g,"").replace(",","."))||0;
    return Math.round(a*1000+b);
  }
  // Son virgül ondalık kabul edilir; nokta ve boşluk binlik ayracıdır
  const v=s.replace(/[.\s]/g,"").replace(",",".");
  const n=parseFloat(v);
  return isFinite(n)?n:null;
}

function isoTarih(d){
  const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);
  return z.toISOString().slice(0,10);
}
function buyukHarfle(ad){
  return String(ad||"").split(/\s+/).filter(Boolean)
    .map(k=>k.charAt(0).toLocaleUpperCase("tr")+k.slice(1).toLocaleLowerCase("tr"))
    .join(" ");
}

// ── Etiket sözlüğü ──
// Uzun etiketler önce gelmeli ("iş yeri adresi", "adres"ten önce taranır).
// Desenler normalize edilmiş metne (NRM) uygulanır.
const ETIKETLER=[
  {alan:"musteri",     d:"(?:musterinin\\s+ad[iı]|musteri\\s+ad[iı]|musteri\\s+ismi|musteri|mustericin|firma\\s+ad[iı]|firma)"},
  {alan:"baslik",      d:"(?:isin\\s+ad[iı]|is\\s+ad[iı]|is\\s+ismi|is\\s+basl[iı]g[iı]|yap[iı]lacak\\s+is|is\\s+turu)"},
  {alan:"tutar",       d:"(?:isin\\s+degeri|is\\s+degeri|is\\s+bedeli|toplam\\s+tutar|tutar[iı]?|fiyat[iı]?|ucret[iı]?|bedel[iı]?|degeri|is\\s+ucreti)"},
  {alan:"maliyet",     d:"(?:maliyet[iı]?|masraf[iı]?|gider[iı]?|bana\\s+maliyeti)"},
  {alan:"isAdresi",    d:"(?:is\\s+yeri\\s+adresi|isyeri\\s+adresi|is\\s+adresi|adres[iı]?|konum[uü]?|yer[iı]?)"},
  {alan:"malzemeler",  d:"(?:kullan[iı]lacak\\s+malzeme(?:ler)?(?:si|leri)?|gerekli\\s+malzeme(?:ler)?|malzeme\\s+listesi|malzeme(?:ler)?(?:si|leri)?|laz[iı]m\\s+olan)"},
  {alan:"musteriTelefon",d:"(?:telefon(?:u|\\s+numaras[iı])?|tel|numaras[iı]|cep)"},
  {alan:"atanan",      d:"(?:atanan(?:\\s+kisi)?|gorevli|isi\\s+yapacak|usta\\s+olarak)"},
  {alan:"kisiSayisi",  d:"(?:kisi\\s+say[iı]s[iı])"},
  {alan:"vadeGun",     d:"(?:odeme\\s+vadesi|vade(?:si)?|odeme\\s+suresi)"},
  {alan:"not",         d:"(?:not(?:u)?|aciklama(?:s[iı])?)"},
  {alan:"tarih",       d:"(?:is\\s+tarihi|tarih[iı]?)"},
  {alan:"saat",        d:"(?:saat[iı]?)"},
];

// Normalize edilmiş dizindeki konumu, orijinal metindeki konuma çevirir.
// NRM harf sayısını değiştirmediği için indeksler birebir örtüşür.
function etiketleriBul(nrmMetin){
  const bulunan=[];
  ETIKETLER.forEach(({alan,d})=>{
    const re=new RegExp("(?:^|[\\s,;.:])("+d+")\\s*[:,]?\\s*","g");
    let x;
    while((x=re.exec(nrmMetin))!==null){
      const bas=x.index+(x[0].length-x[0].replace(/^[\s,;.:]+/,"").length);
      bulunan.push({alan,bas,son:x.index+x[0].length});
      re.lastIndex=x.index+x[0].length;
    }
  });
  bulunan.sort((a,b)=>a.bas-b.bas);
  // Aynı yerden başlayan/iç içe geçen etiketleri ele: en uzun olanı tut
  const temiz=[];
  bulunan.forEach(e=>{
    const onceki=temiz[temiz.length-1];
    if(onceki&&e.bas<onceki.son){ if(e.son>onceki.son)temiz[temiz.length-1]=e; return; }
    temiz.push(e);
  });
  return temiz;
}

export function sesliIsAyristir(hamMetin,{musteriler=[],ekip=[]}={}){
  let metin=String(hamMetin||"").replace(/\s+/g," ").trim();
  // Komut ön eki
  metin=metin.replace(/^\s*(yeni\s+(bir\s+)?(iş|is)\s*(ekle|aç|oluştur|olustur|kaydı|kaydi)?|iş\s+ekle|is\s+ekle|kayıt\s+aç)\s*[:,]?\s*/i,"").trim();

  const sonuc={};
  const nrm=NRM(metin);
  const etiketler=etiketleriBul(nrm);

  // ── 1) ETİKETLİ BÖLÜMLER ──
  let kalan="";
  if(etiketler.length){
    kalan=metin.slice(0,etiketler[0].bas).trim(); // ilk etiketten önceki kısım
    etiketler.forEach((e,i)=>{
      const bitis=i+1<etiketler.length?etiketler[i+1].bas:metin.length;
      const deger=metin.slice(e.son,bitis).replace(/^[\s:,;.]+|[\s:,;.]+$/g,"").trim();
      if(!deger)return;
      if(sonuc["_"+e.alan]!==undefined)return; // ilk geçen kazanır
      sonuc["_"+e.alan]=deger;
    });
  } else {
    kalan=metin;
  }

  // Etiket değerinin sonuna takılan tarih ifadelerini ("… ve 1 conta, yarın")
  // ayıkla — bunlar malzeme/adres/not değil, tarihtir.
  const TARIH_SON=/[\s,;]*\b(yar[iı]n|bugün|bugun|öbür\s*gün|obur\s*gun|ertesi\s*gün|pazartesi|sal[iı]|çarşamba|carsamba|perşembe|persembe|cuma|cumartesi|pazar|\d{1,2}[\/.]\d{1,2}(?:[\/.]\d{2,4})?)\s*$/i;
  let sizanTarih="";
  Object.keys(sonuc).forEach(k=>{
    if(!k.startsWith("_"))return;
    const x=String(sonuc[k]).match(TARIH_SON);
    if(x){ sizanTarih+=" "+x[1]; sonuc[k]=String(sonuc[k]).replace(TARIH_SON,"").trim(); }
  });

  const al=(a)=>sonuc["_"+a];

  // ── Değerleri alanlara dönüştür ──
  if(al("musteri"))   sonuc.musteri=buyukHarfle(al("musteri"));
  if(al("baslik")){const bb=al("baslik");sonuc.baslik=bb.charAt(0).toLocaleUpperCase("tr")+bb.slice(1);}
  if(al("isAdresi"))  sonuc.isAdresi=al("isAdresi");
  if(al("not"))       sonuc.not=al("not");
  if(al("atanan"))    sonuc.atanan=buyukHarfle(al("atanan"));

  if(al("tutar")){
    const x=al("tutar").match(/[\d][\d.,\s]*(?:\s*bin\s*[\d.,\s]*)?/);
    const v=x?sayiCoz(x[0]):null;
    if(v!==null&&v>0)sonuc.tutar=String(Math.round(v));
  }
  if(al("maliyet")){
    const x=al("maliyet").match(/[\d][\d.,\s]*(?:\s*bin\s*[\d.,\s]*)?/);
    const v=x?sayiCoz(x[0]):null;
    if(v!==null&&v>0)sonuc.maliyet=String(Math.round(v));
  }
  if(al("vadeGun")){
    const v=al("vadeGun");
    if(/pesin|peşin/i.test(NRM(v)))sonuc.vadeGun=0;
    else{const x=v.match(/\d+/);if(x)sonuc.vadeGun=parseInt(x[0],10);}
  }
  if(al("kisiSayisi")){
    const x=al("kisiSayisi").match(/\d+/);
    if(x)sonuc.kisiSayisi=parseInt(x[0],10);
  }
  if(al("musteriTelefon")){
    let t=al("musteriTelefon").replace(/\D/g,"");
    if(t.length===10)t="0"+t;
    if(t.length===11)sonuc.musteriTelefon=t;
  }
  if(al("malzemeler")){
    const mal=al("malzemeler")
      .replace(/\s+ve\s+/gi,"\n").replace(/\s*[,;]\s*/g,"\n")
      .split("\n").map(x=>x.trim()).filter(Boolean).join("\n");
    if(mal)sonuc.malzemeler=mal;
  }

  // ── Tarih / saat ──
  const bugun=new Date();
  let tarihObj=null, saatStr=null;
  const tarihKaynak=[al("tarih"),sizanTarih,kalan,metin].filter(Boolean).join(" ");
  const saatKaynak=[al("saat"),kalan,metin].filter(Boolean).join(" ");
  {
    const nt=NRM(tarihKaynak);
    if(/\byarin\b/.test(nt))            tarihObj=new Date(bugun.getTime()+864e5);
    else if(/\bbugun\b/.test(nt))       tarihObj=new Date(bugun);
    else if(/\bobur ?gun\b|\bertesi gun\b/.test(nt)) tarihObj=new Date(bugun.getTime()+2*864e5);
    else{
      const x=tarihKaynak.match(/\b(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?\b/);
      if(x){
        const g=+x[1],ay=+x[2]; let yil=x[3]?+x[3]:bugun.getFullYear();
        if(yil<100)yil+=2000;
        if(g>=1&&g<=31&&ay>=1&&ay<=12)tarihObj=new Date(yil,ay-1,g);
      }else{
        for(const [ad,no] of Object.entries(GUN_AD)){
          if(new RegExp("\\b"+ad+"\\b").test(nt)){
            const fark=(no-bugun.getDay()+7)%7||7;
            tarihObj=new Date(bugun.getTime()+fark*864e5);
            break;
          }
        }
      }
    }
    const s=saatKaynak.match(/\b(?:saat\s*)?(\d{1,2})(?:[:.](\d{2}))?\b/);
    if(/saat/i.test(saatKaynak)&&s){
      const h=+s[1], dk=+(s[2]||0);
      if(h<=23&&dk<=59)saatStr=String(h).padStart(2,"0")+":"+String(dk).padStart(2,"0");
    }
  }
  if(tarihObj)sonuc.tarih=isoTarih(tarihObj);
  if(saatStr){
    const t=tarihObj||bugun;
    sonuc.hatirlatma=isoTarih(t)+"T"+saatStr;
    if(!sonuc.tarih)sonuc.tarih=isoTarih(t);
  }

  // ── 2) SERBEST KISIM — etiketlenmemiş metinden çıkarım ──
  let s=" "+kalan+" ";
  const kes=(re)=>{const x=s.match(re); if(x)s=s.replace(x[0]," "); return x;};

  if(!sonuc.musteriTelefon){
    const x=kes(/\b(0?5\d{2}[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2})\b/);
    if(x){let t=x[1].replace(/\D/g,""); if(t.length===10)t="0"+t; if(t.length===11)sonuc.musteriTelefon=t;}
  }
  if(!sonuc.tutar){
    const x=kes(/\b([\d][\d.,\s]*?(?:\s*bin\s*[\d.,]*)?)\s*(?:tl|lira|₺)\b/i);
    if(x){const v=sayiCoz(x[1]); if(v!==null&&v>0)sonuc.tutar=String(Math.round(v));}
  }
  // Tarih/saat kelimelerini serbest kısımdan temizle
  kes(/\byar[iı]n\b|\bbugün\b|\bbugun\b|\böbür ?gün\b/i);
  kes(/\bsaat\s*\d{1,2}(?:[:.]\d{2})?\b/i);
  for(const ad of Object.keys(GUN_AD)){
    const re=new RegExp("\\b"+ad.replace(/i/g,"[iı]").replace(/s/g,"[sş]").replace(/c/g,"[cç]").replace(/g/g,"[gğ]").replace(/u/g,"[uü]").replace(/o/g,"[oö]")+"\\b","i");
    if(re.test(s)){s=s.replace(re," ");break;}
  }

  // Müşteri: kayıtlı listeyle eşleşme
  if(!sonuc.musteri){
    const sn=NRM(s);
    let enIyi=null;
    musteriler.filter(Boolean).forEach(ad=>{
      const an=NRM(ad);
      if(an.length>=3&&sn.includes(an)&&(!enIyi||an.length>NRM(enIyi).length))enIyi=ad;
    });
    if(enIyi){
      sonuc.musteri=enIyi;
      const i=sn.indexOf(NRM(enIyi));
      s=(s.slice(0,i)+" "+s.slice(i+enIyi.length)).replace(/\s+/g," ");
      s=s.replace(/^\s*['’]?\s*(a|e|ya|ye|na|ne|için|icin)\b/i," ");
    }
  }
  // Müşteri: "Ahmet Yılmaz'a" gibi yönelme eki
  if(!sonuc.musteri){
    const x=s.match(/\b([A-ZÇĞİÖŞÜ][a-zçğıöşü]+(?:\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+){0,2})\s*['’]\s*(?:a|e|ya|ye|na|ne)\b/);
    if(x){sonuc.musteri=x[1].trim();s=s.replace(x[0]," ");}
  }
  // Atanan usta (ekipten)
  if(!sonuc.atanan&&ekip.length){
    const sn=NRM(s);
    const bul=ekip.map(e=>typeof e==="string"?e:e.ad).filter(Boolean)
      .find(ad=>NRM(ad).length>=3&&sn.includes(NRM(ad)));
    if(bul){
      sonuc.atanan=bul;
      const i=sn.indexOf(NRM(bul));
      s=(s.slice(0,i)+" "+s.slice(i+bul.length)).replace(/\s+/g," ");
    }
  }

  // ── Başlık ──
  if(!sonuc.baslik){
    let b=s.replace(/\s*[,;]+\s*/g," ").replace(/\s+/g," ").trim()
      .replace(/^(ve|için|icin|ile|de|da|bir)\s+/i,"")
      .replace(/\s+(yapacak|yapsın|yapsin|gidecek|bakacak|baksın|baksin|olacak|versin|alsın|alsin|var|lazım|lazim)\s*$/i,"")
      .replace(/\s+(ve|için|icin|ile)\s*$/i,"")
      .replace(/[.\s]+$/,"");
    if(b.length>=2)sonuc.baslik=b.charAt(0).toLocaleUpperCase("tr")+b.slice(1);
  }

  // Geçici "_alan" anahtarlarını temizle
  Object.keys(sonuc).forEach(k=>{if(k.startsWith("_"))delete sonuc[k];});
  return sonuc;
}
