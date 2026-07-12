// ═══ SEKTÖR KATMANI — 25 sektör verisi ═══

export const IS_KOLLARI = [
  // ── Teknik & Tesisat ──
  {label:"Mekanik Tesisat",icon:"⚙️"},
  {label:"Elektrik Tesisatı",icon:"⚡"},
  {label:"Soğutma & Klima",icon:"❄️"},
  {label:"Havuzculuk",icon:"🏊"},
  {label:"Güvenlik & Alarm",icon:"🔒"},
  // ── İnşaat & Yapı ──
  {label:"İnşaat & Taahhüt",icon:"🏗️"},
  {label:"Mobilya & Marangoz",icon:"🪑"},
  {label:"Boya & Badana",icon:"🎨"},
  // ── Araç & Makine ──
  {label:"Otomotiv",icon:"🚗"},
  {label:"Nakliyat & Taşımacılık",icon:"🚛"},
  // ── Tarım & Çevre ──
  {label:"Tarım & Peyzaj",icon:"🌱"},
  {label:"Temizlik Hizmetleri",icon:"🧹"},
  // ── Sağlık & Güzellik ──
  {label:"Sağlık & Eczane",icon:"💊"},
  {label:"Berber & Kuaför",icon:"💇"},
  {label:"Veteriner",icon:"🐾"},
  // ── Eğitim & Danışmanlık ──
  {label:"Eğitim & Kurs",icon:"📚"},
  {label:"Danışmanlık",icon:"💼"},
  {label:"Muhasebe & Mali Müşavir",icon:"🧾"},
  // ── Üretim & Tekstil ──
  {label:"Tekstil & Dikiş",icon:"🧵"},
  {label:"Gıda & Catering",icon:"🍽️"},
  // ── Medya & Teknoloji ──
  {label:"Reklam & Baskı",icon:"🖨️"},
  {label:"Bilişim & Yazılım",icon:"💻"},
  {label:"Fotoğraf & Video",icon:"📸"},
  // ── Perakende & Hizmet ──
  {label:"Kuyumcu & Kıymetli Maden",icon:"💍"},
  {label:"Sigorta & Finans",icon:"📋"},
];

// ─── SEKTÖRE ÖZEL AKIŞLAR ───────────────────────────────────────
// Her iş koluna göre: örnek iş başlıkları, iş türü ikonları,
// gider kategorileri ve öneri metni farklılaşır.
export const SEKTOR_VERI = {
  "Mekanik Tesisat":{
    icon:"⚙️",
    isTurleri:[{e:"🔧",bg:"#DCFCE7",ad:"Onarım"},{e:"🚿",bg:"#DBEAFE",ad:"Tesisat"},{e:"📦",bg:"#FEF3C7",ad:"Montaj"},{e:"🔥",bg:"#FEE2E2",ad:"Kombi/Petek"}],
    ornekIsler:["Kombi Montajı","Petek Temizliği & Tesisat Kontrolü","Su Kaçağı Onarımı","Radyatör Değişimi","Şofben Bakımı"],
    giderKat:["Malzeme","Yakıt","Yedek Parça","Personel","Kira","Diğer"],
    isOrnekPh:"Kombi Montajı...",
  },
  "Havuzculuk":{
    icon:"🏊",
    isTurleri:[{e:"🏊",bg:"#DBEAFE",ad:"Bakım"},{e:"💧",bg:"#DCFCE7",ad:"Su/Kimyasal"},{e:"🔧",bg:"#FEF3C7",ad:"Pompa/Filtre"},{e:"🏗️",bg:"#EDE9FE",ad:"Kurulum"}],
    ornekIsler:["Havuz Bakımı & Klorlama","Kum Filtresi Değişimi","Pompa Motoru Onarımı","Havuz Kış Bakımı","Su Kimyasalı Dengeleme"],
    giderKat:["Kimyasal","Yedek Parça","Yakıt","Personel","Nakliye","Diğer"],
    isOrnekPh:"Havuz Bakımı & Klorlama...",
  },
  "Elektrik Tesisatı":{
    icon:"⚡",
    isTurleri:[{e:"⚡",bg:"#FEF9C3",ad:"Tesisat"},{e:"🔌",bg:"#DBEAFE",ad:"Priz/Anahtar"},{e:"💡",bg:"#FEF3C7",ad:"Aydınlatma"},{e:"🎛️",bg:"#EDE9FE",ad:"Pano"}],
    ornekIsler:["Elektrik Pano Montajı","Priz & Anahtar Değişimi","LED Aydınlatma Kurulumu","Sigorta Kutusu Yenileme","Kablo Çekimi"],
    giderKat:["Kablo & Malzeme","Yedek Parça","Yakıt","Personel","Kira","Diğer"],
    isOrnekPh:"Elektrik Pano Montajı...",
  },
  "İnşaat & Taahhüt":{
    icon:"🏗️",
    isTurleri:[{e:"🏗️",bg:"#FEF3C7",ad:"Yapım"},{e:"🧱",bg:"#FEE2E2",ad:"Duvar/Sıva"},{e:"🎨",bg:"#DBEAFE",ad:"Boya/Dekor"},{e:"🚧",bg:"#EDE9FE",ad:"Tadilat"}],
    ornekIsler:["Daire Komple Tadilat","Duvar Örme & Sıva","İç Cephe Boyama","Zemin Seramik Döşeme","Alçıpan Bölme"],
    giderKat:["İnşaat Malzemesi","İşçilik","Nakliye","Makine Kirası","Yakıt","Diğer"],
    isOrnekPh:"Daire Komple Tadilat...",
  },
  "Mobilya & Marangoz":{
    icon:"🪑",
    isTurleri:[{e:"🪑",bg:"#FEF3C7",ad:"Üretim"},{e:"🔨",bg:"#DCFCE7",ad:"Montaj"},{e:"🚪",bg:"#DBEAFE",ad:"Kapı/Dolap"},{e:"🛠️",bg:"#EDE9FE",ad:"Onarım"}],
    ornekIsler:["Mutfak Dolabı Yapımı","Gardırop Montajı","Ahşap Kapı Üretimi","Mobilya Onarımı","TV Ünitesi Yapımı"],
    giderKat:["Ahşap & Malzeme","Aksesuar","Nakliye","Personel","Atölye Kira","Diğer"],
    isOrnekPh:"Mutfak Dolabı Yapımı...",
  },
  "Otomotiv":{
    icon:"🚗",
    isTurleri:[{e:"🔧",bg:"#DCFCE7",ad:"Mekanik"},{e:"🚗",bg:"#DBEAFE",ad:"Bakım"},{e:"🎨",bg:"#FEE2E2",ad:"Kaporta/Boya"},{e:"🔋",bg:"#FEF9C3",ad:"Elektrik"}],
    ornekIsler:["Periyodik Bakım & Yağ Değişimi","Fren Balata Değişimi","Kaporta Boya İşlemi","Akü Değişimi","Triger Seti Değişimi"],
    giderKat:["Yedek Parça","Yağ & Sıvı","Boya Malzemesi","Personel","Kira","Diğer"],
    isOrnekPh:"Periyodik Bakım...",
  },
  "Danışmanlık":{
    icon:"💼",
    isTurleri:[{e:"💼",bg:"#EDE9FE",ad:"Danışmanlık"},{e:"📊",bg:"#DBEAFE",ad:"Analiz"},{e:"📝",bg:"#DCFCE7",ad:"Rapor"},{e:"🤝",bg:"#FEF3C7",ad:"Toplantı"}],
    ornekIsler:["İşletme Danışmanlığı","Vergi & Mali Müşavirlik","Proje Analiz Raporu","Strateji Toplantısı","Süreç İyileştirme"],
    giderKat:["Yazılım/Abonelik","Ulaşım","Ofis","Personel","Eğitim","Diğer"],
    isOrnekPh:"İşletme Danışmanlığı...",
  },
  "Reklam & Baskı":{
    icon:"🖨️",
    isTurleri:[{e:"🖨️",bg:"#DBEAFE",ad:"Baskı"},{e:"🎨",bg:"#FEE2E2",ad:"Tasarım"},{e:"📢",bg:"#FEF3C7",ad:"Tabela"},{e:"📦",bg:"#DCFCE7",ad:"Ürün"}],
    ornekIsler:["Tabela Tasarım & Üretim","Kartvizit Baskı","Araç Giydirme","Broşür & Katalog","Dijital Baskı"],
    giderKat:["Baskı Malzemesi","Mürekkep","Tasarım Yazılımı","Personel","Kira","Diğer"],
    isOrnekPh:"Tabela Tasarım...",
  },
  "Temizlik Hizmetleri":{
    icon:"🧹",
    isTurleri:[{e:"🧹",bg:"#DCFCE7",ad:"Genel"},{e:"🧽",bg:"#DBEAFE",ad:"Derin"},{e:"🪟",bg:"#FEF9C3",ad:"Cam"},{e:"🏢",bg:"#EDE9FE",ad:"Kurumsal"}],
    ornekIsler:["Ev Genel Temizlik","İnşaat Sonrası Temizlik","Cam & Cephe Temizliği","Ofis Temizlik Aboneliği","Halı Yıkama"],
    giderKat:["Temizlik Malzemesi","Ekipman","Ulaşım","Personel","Kira","Diğer"],
    isOrnekPh:"Ev Genel Temizlik...",
  },
};
export const sektorBilgi = (kol)=> SEKTOR_VERI_TAM[kol] || SEKTOR_VERI["Mekanik Tesisat"];

// ─── YENİ SEKTÖRLER ─────────────────────────────────────────────
const SEKTOR_VERI_EK = {
  "Soğutma & Klima":{
    icon:"❄️",
    isTurleri:[{e:"❄️",bg:"#DBEAFE",ad:"Klima"},{e:"🔧",bg:"#DCFCE7",ad:"Bakım"},{e:"📦",bg:"#FEF3C7",ad:"Montaj"},{e:"🧊",bg:"#EDE9FE",ad:"Soğutma"}],
    ornekIsler:["Klima Montajı","Klima Bakım & Gaz Doldurma","Soğuk Hava Deposu Bakımı","VRF Sistem Kurulumu","Klima Temizliği"],
    giderKat:["Gaz & Malzeme","Yedek Parça","Yakıt","Personel","Kira","Diğer"],
    isOrnekPh:"Klima Montajı...",
  },
  "Güvenlik & Alarm":{
    icon:"🔒",
    isTurleri:[{e:"🔒",bg:"#FEE2E2",ad:"Alarm"},{e:"📷",bg:"#DBEAFE",ad:"Kamera"},{e:"🚪",bg:"#FEF3C7",ad:"Kapı"},{e:"🔧",bg:"#DCFCE7",ad:"Bakım"}],
    ornekIsler:["Alarm Sistemi Kurulumu","Kamera Sistemi Montajı","Yangın Alarm Kurulumu","Parmak İzi Kapı Sistemi","Güvenlik Sistemi Bakımı"],
    giderKat:["Ekipman","Kablo & Malzeme","Yakıt","Personel","Kira","Diğer"],
    isOrnekPh:"Alarm Sistemi Kurulumu...",
  },
  "Boya & Badana":{
    icon:"🎨",
    isTurleri:[{e:"🎨",bg:"#FEE2E2",ad:"Boya"},{e:"🖌️",bg:"#DBEAFE",ad:"Badana"},{e:"🏠",bg:"#DCFCE7",ad:"Dış Cephe"},{e:"🎭",bg:"#FEF3C7",ad:"Dekoratif"}],
    ornekIsler:["İç Mekan Boyama","Dış Cephe Boya","Dekoratif Sıva","Alçıpan Boyama","Çatı Boyama"],
    giderKat:["Boya & Malzeme","Fırça & Ekipman","Yakıt","Personel","İskele Kirası","Diğer"],
    isOrnekPh:"İç Mekan Boyama...",
  },
  "Nakliyat & Taşımacılık":{
    icon:"🚛",
    isTurleri:[{e:"🚛",bg:"#FEF3C7",ad:"Nakliye"},{e:"📦",bg:"#DBEAFE",ad:"Ambalaj"},{e:"🏗️",bg:"#DCFCE7",ad:"Asansör"},{e:"🚐",bg:"#EDE9FE",ad:"Şehiriçi"}],
    ornekIsler:["Ev Taşıma","Ofis Taşıma","Eşya Asansörü","Paketleme Hizmeti","Şehirlerarası Nakliye"],
    giderKat:["Yakıt","Ambalaj Malzemesi","Araç Bakım","Personel","Sigorta","Diğer"],
    isOrnekPh:"Ev Taşıma...",
  },
  "Tarım & Peyzaj":{
    icon:"🌱",
    isTurleri:[{e:"🌱",bg:"#DCFCE7",ad:"Peyzaj"},{e:"✂️",bg:"#FEF3C7",ad:"Budama"},{e:"💧",bg:"#DBEAFE",ad:"Sulama"},{e:"🌳",bg:"#EDE9FE",ad:"Ağaç"}],
    ornekIsler:["Bahçe Düzenlemesi","Çim Biçme & Bakım","Ağaç Budama","Otomatik Sulama Sistemi","Peyzaj Tasarımı"],
    giderKat:["Fide & Tohum","Gübre & İlaç","Ekipman","Yakıt","Personel","Diğer"],
    isOrnekPh:"Bahçe Düzenlemesi...",
  },
  "Sağlık & Eczane":{
    icon:"💊",
    isTurleri:[{e:"💊",bg:"#FEE2E2",ad:"İlaç"},{e:"🩺",bg:"#DBEAFE",ad:"Muayene"},{e:"💉",bg:"#DCFCE7",ad:"Tedavi"},{e:"📋",bg:"#FEF3C7",ad:"Rapor"}],
    ornekIsler:["Muayene & Konsültasyon","Fizyoterapi Seansı","Aşı & Profilaksi","Medikal Malzeme Temini","Sağlık Taraması"],
    giderKat:["Medikal Malzeme","İlaç & Sarf","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Muayene & Konsültasyon...",
  },
  "Berber & Kuaför":{
    icon:"💇",
    isTurleri:[{e:"💇",bg:"#EDE9FE",ad:"Saç"},{e:"✂️",bg:"#DBEAFE",ad:"Kesim"},{e:"🎨",bg:"#FEE2E2",ad:"Boya"},{e:"💆",bg:"#DCFCE7",ad:"Bakım"}],
    ornekIsler:["Saç Kesimi","Saç Boyama","Fön & Şekillendirme","Sakal Tıraşı","Kaş Alımı"],
    giderKat:["Kimyasal & Boya","Sarf Malzeme","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Saç Kesimi...",
  },
  "Veteriner":{
    icon:"🐾",
    isTurleri:[{e:"🐾",bg:"#FEF3C7",ad:"Muayene"},{e:"💉",bg:"#FEE2E2",ad:"Aşı"},{e:"🔬",bg:"#DBEAFE",ad:"Tahlil"},{e:"✂️",bg:"#DCFCE7",ad:"Operasyon"}],
    ornekIsler:["Muayene & Konsültasyon","Aşılama","Kısırlaştırma Operasyonu","Kan & Tahlil","Tırnak & Bakım"],
    giderKat:["İlaç & Aşı","Medikal Malzeme","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Muayene & Konsültasyon...",
  },
  "Eğitim & Kurs":{
    icon:"📚",
    isTurleri:[{e:"📚",bg:"#DBEAFE",ad:"Kurs"},{e:"👨‍🏫",bg:"#DCFCE7",ad:"Ders"},{e:"📝",bg:"#FEF3C7",ad:"Sınav"},{e:"🎓",bg:"#EDE9FE",ad:"Sertifika"}],
    ornekIsler:["Özel Ders","Online Kurs","Sertifika Programı","Grup Eğitimi","Kurumsal Eğitim"],
    giderKat:["Materyal & Kitap","Yazılım & Abonelik","Kira","Personel","Ulaşım","Diğer"],
    isOrnekPh:"Özel Ders...",
  },
  "Muhasebe & Mali Müşavir":{
    icon:"🧾",
    isTurleri:[{e:"🧾",bg:"#DCFCE7",ad:"Muhasebe"},{e:"📊",bg:"#DBEAFE",ad:"Analiz"},{e:"📝",bg:"#FEF3C7",ad:"Beyan"},{e:"💼",bg:"#EDE9FE",ad:"Danışma"}],
    ornekIsler:["Aylık Muhasebe","Vergi Beyannamesi","Mali Analiz Raporu","SGK Bildirimi","Şirket Kuruluşu"],
    giderKat:["Yazılım Aboneliği","Ulaşım","Ofis","Personel","Eğitim","Diğer"],
    isOrnekPh:"Aylık Muhasebe...",
  },
  "Tekstil & Dikiş":{
    icon:"🧵",
    isTurleri:[{e:"🧵",bg:"#EDE9FE",ad:"Dikiş"},{e:"✂️",bg:"#FEE2E2",ad:"Kesim"},{e:"👗",bg:"#DBEAFE",ad:"Tasarım"},{e:"🔧",bg:"#DCFCE7",ad:"Tamir"}],
    ornekIsler:["Kıyafet Dikimi","Tamir & Tadilat","Perde Dikimi","Nakış & İşleme","Özel Tasarım"],
    giderKat:["Kumaş & Malzeme","İplik & Aksesuar","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Kıyafet Dikimi...",
  },
  "Gıda & Catering":{
    icon:"🍽️",
    isTurleri:[{e:"🍽️",bg:"#FEF3C7",ad:"Catering"},{e:"🎂",bg:"#FEE2E2",ad:"Pasta"},{e:"🥗",bg:"#DCFCE7",ad:"Yemek"},{e:"📦",bg:"#DBEAFE",ad:"Paket"}],
    ornekIsler:["Organizasyon Catering","Düğün Pastası","Günlük Yemek Servisi","Kokteyl & İkram","Özel Etkinlik Yemeği"],
    giderKat:["Malzeme & Gıda","Ambalaj","Nakliye","Personel","Ekipman","Diğer"],
    isOrnekPh:"Organizasyon Catering...",
  },
  "Bilişim & Yazılım":{
    icon:"💻",
    isTurleri:[{e:"💻",bg:"#DBEAFE",ad:"Yazılım"},{e:"🖥️",bg:"#DCFCE7",ad:"Donanım"},{e:"🔧",bg:"#FEF3C7",ad:"Teknik"},{e:"🌐",bg:"#EDE9FE",ad:"Web"}],
    ornekIsler:["Web Sitesi Yapımı","Yazılım Geliştirme","Bilgisayar Tamiri","Ağ & Sunucu Kurulumu","IT Destek"],
    giderKat:["Yazılım Lisansı","Donanım","Ulaşım","Personel","Abonelik","Diğer"],
    isOrnekPh:"Web Sitesi Yapımı...",
  },
  "Fotoğraf & Video":{
    icon:"📸",
    isTurleri:[{e:"📸",bg:"#FEE2E2",ad:"Fotoğraf"},{e:"🎥",bg:"#DBEAFE",ad:"Video"},{e:"✂️",bg:"#DCFCE7",ad:"Kurgu"},{e:"🎭",bg:"#FEF3C7",ad:"Etkinlik"}],
    ornekIsler:["Düğün Fotoğrafçılığı","Ürün Fotoğraf Çekimi","Video Prodüksiyon","Tanıtım Filmi","Sosyal Medya İçerik"],
    giderKat:["Ekipman Bakım","Yazılım","Ulaşım","Personel","Stüdyo Kira","Diğer"],
    isOrnekPh:"Düğün Fotoğrafçılığı...",
  },
  "Kuyumcu & Kıymetli Maden":{
    icon:"💍",
    isTurleri:[{e:"💍",bg:"#FEF9C3",ad:"Takı"},{e:"🔧",bg:"#DCFCE7",ad:"Tamir"},{e:"⚖️",bg:"#DBEAFE",ad:"Değer"},{e:"✨",bg:"#FEE2E2",ad:"Temizlik"}],
    ornekIsler:["Takı Tamiri","Özel Tasarım Yapımı","Altın/Gümüş Değerleme","Mücevher Temizleme","Sertifikalı Kuyumculuk"],
    giderKat:["Ham Madde","Ekipman","Sigorta","Personel","Kira","Diğer"],
    isOrnekPh:"Takı Tamiri...",
  },
  "Sigorta & Finans":{
    icon:"📋",
    isTurleri:[{e:"📋",bg:"#DBEAFE",ad:"Sigorta"},{e:"💰",bg:"#DCFCE7",ad:"Finans"},{e:"📊",bg:"#FEF3C7",ad:"Analiz"},{e:"🤝",bg:"#EDE9FE",ad:"Danışma"}],
    ornekIsler:["Kasko & Trafik Sigortası","Konut Sigortası","Sağlık Sigortası","Finansal Planlama","Emeklilik Danışmanlığı"],
    giderKat:["Yazılım Aboneliği","Ulaşım","Ofis","Personel","Eğitim","Diğer"],
    isOrnekPh:"Kasko & Trafik Sigortası...",
  },
};
// Mevcut + yeni sektörleri birleştir
const SEKTOR_VERI_TAM = {...SEKTOR_VERI,...SEKTOR_VERI_EK};
