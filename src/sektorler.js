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
    isTurleri:[{e:"🔧",bg:"#DCFCE7",ad:"Onarım",isler:["Su Kaçağı Onarımı", "Musluk & Batarya Tamiri", "Gider Açma", "Rezervuar Tamiri"]},{e:"🚿",bg:"#DBEAFE",ad:"Tesisat",isler:["Banyo Tesisatı Yenileme", "Mutfak Tesisatı Döşeme", "Temiz Su Hattı Çekimi", "Pis Su Hattı Yenileme"]},{e:"📦",bg:"#FEF3C7",ad:"Montaj",isler:["Kombi Montajı", "Şofben Montajı", "Klozet & Lavabo Montajı", "Batarya Montajı"]},{e:"🔥",bg:"#FEE2E2",ad:"Kombi/Petek",isler:["Petek Temizliği", "Kombi Bakımı", "Radyatör Değişimi", "Petek Montajı"]}],
    ornekIsler:["Kombi Montajı","Petek Temizliği & Tesisat Kontrolü","Su Kaçağı Onarımı","Radyatör Değişimi","Şofben Bakımı"],
    giderKat:["Malzeme","Yakıt","Yedek Parça","Personel","Kira","Diğer"],
    isOrnekPh:"Kombi Montajı...",
  },
  "Havuzculuk":{
    icon:"🏊",
    isTurleri:[{e:"🏊",bg:"#DBEAFE",ad:"Bakım",isler:["Haftalık Havuz Bakımı", "Havuz Kış Bakımı", "Havuz Açılış Bakımı", "Dip Süpürme & Temizlik"]},{e:"💧",bg:"#DCFCE7",ad:"Su/Kimyasal",isler:["Su Kimyasalı Dengeleme", "Klorlama", "Yosun Önleme Uygulaması", "pH Ayarlama"]},{e:"🔧",bg:"#FEF3C7",ad:"Pompa/Filtre",isler:["Kum Filtresi Değişimi", "Pompa Motoru Onarımı", "Filtre Kumu Yenileme", "Vana Değişimi"]},{e:"🏗️",bg:"#EDE9FE",ad:"Kurulum",isler:["Havuz Kurulumu", "Prefabrik Havuz Montajı", "Havuz Aydınlatma Sistemi", "Isı Pompası Kurulumu"]}],
    ornekIsler:["Havuz Bakımı & Klorlama","Kum Filtresi Değişimi","Pompa Motoru Onarımı","Havuz Kış Bakımı","Su Kimyasalı Dengeleme"],
    giderKat:["Kimyasal","Yedek Parça","Yakıt","Personel","Nakliye","Diğer"],
    isOrnekPh:"Havuz Bakımı & Klorlama...",
  },
  "Elektrik Tesisatı":{
    icon:"⚡",
    isTurleri:[{e:"⚡",bg:"#FEF9C3",ad:"Tesisat",isler:["Kablo Çekimi", "Elektrik Tesisatı Yenileme", "Topraklama Hattı", "Anahtar Sorti"]},{e:"🔌",bg:"#DBEAFE",ad:"Priz/Anahtar",isler:["Priz & Anahtar Değişimi", "Priz İlavesi", "USB'li Priz Montajı", "Grup Priz Hattı"]},{e:"💡",bg:"#FEF3C7",ad:"Aydınlatma",isler:["LED Aydınlatma Kurulumu", "Avize Montajı", "Spot Aydınlatma", "Bahçe Aydınlatması"]},{e:"🎛️",bg:"#EDE9FE",ad:"Pano",isler:["Elektrik Pano Montajı", "Sigorta Kutusu Yenileme", "Kaçak Akım Rölesi", "Kompanzasyon Panosu"]}],
    ornekIsler:["Elektrik Pano Montajı","Priz & Anahtar Değişimi","LED Aydınlatma Kurulumu","Sigorta Kutusu Yenileme","Kablo Çekimi"],
    giderKat:["Kablo & Malzeme","Yedek Parça","Yakıt","Personel","Kira","Diğer"],
    isOrnekPh:"Elektrik Pano Montajı...",
  },
  "İnşaat & Taahhüt":{
    icon:"🏗️",
    isTurleri:[{e:"🏗️",bg:"#FEF3C7",ad:"Yapım",isler:["Daire Komple Tadilat", "Kaba İnşaat", "Ek Bina Yapımı", "Anahtar Teslim Villa"]},{e:"🧱",bg:"#FEE2E2",ad:"Duvar/Sıva",isler:["Duvar Örme & Sıva", "Alçıpan Bölme", "Kaba Sıva", "Saten Alçı"]},{e:"🎨",bg:"#DBEAFE",ad:"Boya/Dekor",isler:["İç Cephe Boyama", "Dekoratif Duvar Kaplama", "Asma Tavan", "Kartonpiyer"]},{e:"🚧",bg:"#EDE9FE",ad:"Tadilat",isler:["Banyo Tadilatı", "Mutfak Tadilatı", "Zemin Seramik Döşeme", "Çatı Onarımı"]}],
    ornekIsler:["Daire Komple Tadilat","Duvar Örme & Sıva","İç Cephe Boyama","Zemin Seramik Döşeme","Alçıpan Bölme"],
    giderKat:["İnşaat Malzemesi","İşçilik","Nakliye","Makine Kirası","Yakıt","Diğer"],
    isOrnekPh:"Daire Komple Tadilat...",
  },
  "Mobilya & Marangoz":{
    icon:"🪑",
    isTurleri:[{e:"🪑",bg:"#FEF3C7",ad:"Üretim",isler:["Mutfak Dolabı Yapımı", "TV Ünitesi Yapımı", "Kitaplık Üretimi", "Masa & Sehpa Üretimi"]},{e:"🔨",bg:"#DCFCE7",ad:"Montaj",isler:["Gardırop Montajı", "Hazır Mobilya Montajı", "Mutfak Montajı", "Vestiyer Montajı"]},{e:"🚪",bg:"#DBEAFE",ad:"Kapı/Dolap",isler:["Ahşap Kapı Üretimi", "Gömme Dolap", "Sürgülü Dolap Kapağı", "Kapı Değişimi"]},{e:"🛠️",bg:"#EDE9FE",ad:"Onarım",isler:["Mobilya Onarımı", "Menteşe & Ray Değişimi", "Cila & Boyama", "Döşeme Yenileme"]}],
    ornekIsler:["Mutfak Dolabı Yapımı","Gardırop Montajı","Ahşap Kapı Üretimi","Mobilya Onarımı","TV Ünitesi Yapımı"],
    giderKat:["Ahşap & Malzeme","Aksesuar","Nakliye","Personel","Atölye Kira","Diğer"],
    isOrnekPh:"Mutfak Dolabı Yapımı...",
  },
  "Otomotiv":{
    icon:"🚗",
    isTurleri:[{e:"🔧",bg:"#DCFCE7",ad:"Mekanik",isler:["Triger Seti Değişimi", "Debriyaj Değişimi", "Fren Balata Değişimi", "Amortisör Değişimi"]},{e:"🚗",bg:"#DBEAFE",ad:"Bakım",isler:["Periyodik Bakım & Yağ Değişimi", "Filtre Değişimleri", "Antifriz Değişimi", "Genel Kontrol"]},{e:"🎨",bg:"#FEE2E2",ad:"Kaporta/Boya",isler:["Kaporta Boya İşlemi", "Göçük Düzeltme", "Tampon Onarımı", "Pasta Cila"]},{e:"🔋",bg:"#FEF9C3",ad:"Elektrik",isler:["Akü Değişimi", "Far Ayarı & Değişimi", "Marş Motoru Tamiri", "Araç Elektrik Arıza"]}],
    ornekIsler:["Periyodik Bakım & Yağ Değişimi","Fren Balata Değişimi","Kaporta Boya İşlemi","Akü Değişimi","Triger Seti Değişimi"],
    giderKat:["Yedek Parça","Yağ & Sıvı","Boya Malzemesi","Personel","Kira","Diğer"],
    isOrnekPh:"Periyodik Bakım...",
  },
  "Danışmanlık":{
    icon:"💼",
    isTurleri:[{e:"💼",bg:"#EDE9FE",ad:"Danışmanlık",isler:["İşletme Danışmanlığı", "İK Danışmanlığı", "Pazarlama Danışmanlığı", "Kurumsal Gelişim"]},{e:"📊",bg:"#DBEAFE",ad:"Analiz",isler:["Proje Analiz Raporu", "Pazar Araştırması", "Fizibilite Çalışması", "SWOT Analizi"]},{e:"📝",bg:"#DCFCE7",ad:"Rapor",isler:["Aylık Performans Raporu", "Denetim Raporu", "Durum Değerlendirme Raporu", "Yatırım Raporu"]},{e:"🤝",bg:"#FEF3C7",ad:"Toplantı",isler:["Strateji Toplantısı", "Yönetim Kurulu Sunumu", "Çalıştay & Workshop", "Birebir Danışma Seansı"]}],
    ornekIsler:["İşletme Danışmanlığı","Vergi & Mali Müşavirlik","Proje Analiz Raporu","Strateji Toplantısı","Süreç İyileştirme"],
    giderKat:["Yazılım/Abonelik","Ulaşım","Ofis","Personel","Eğitim","Diğer"],
    isOrnekPh:"İşletme Danışmanlığı...",
  },
  "Reklam & Baskı":{
    icon:"🖨️",
    isTurleri:[{e:"🖨️",bg:"#DBEAFE",ad:"Baskı",isler:["Kartvizit Baskı", "Broşür & Katalog", "Dijital Baskı", "Afiş & Poster Baskı"]},{e:"🎨",bg:"#FEE2E2",ad:"Tasarım",isler:["Logo Tasarımı", "Kurumsal Kimlik Tasarımı", "Sosyal Medya Tasarımı", "Ambalaj Tasarımı"]},{e:"📢",bg:"#FEF3C7",ad:"Tabela",isler:["Tabela Tasarım & Üretim", "Işıklı Tabela", "Yönlendirme Tabelası", "Totem Tabela"]},{e:"📦",bg:"#DCFCE7",ad:"Ürün",isler:["Araç Giydirme", "Promosyon Ürün Baskısı", "Tişört Baskı", "Kupa & Ajanda Baskı"]}],
    ornekIsler:["Tabela Tasarım & Üretim","Kartvizit Baskı","Araç Giydirme","Broşür & Katalog","Dijital Baskı"],
    giderKat:["Baskı Malzemesi","Mürekkep","Tasarım Yazılımı","Personel","Kira","Diğer"],
    isOrnekPh:"Tabela Tasarım...",
  },
  "Temizlik Hizmetleri":{
    icon:"🧹",
    isTurleri:[{e:"🧹",bg:"#DCFCE7",ad:"Genel",isler:["Ev Genel Temizlik", "Merdiven Temizliği", "Taşınma Öncesi Temizlik", "Yazlık Açılış Temizliği"]},{e:"🧽",bg:"#DBEAFE",ad:"Derin",isler:["İnşaat Sonrası Temizlik", "Koltuk Yıkama", "Halı Yıkama", "Derin Mutfak Temizliği"]},{e:"🪟",bg:"#FEF9C3",ad:"Cam",isler:["Cam & Cephe Temizliği", "Yüksek Cam Temizliği", "Vitrin Temizliği", "Balkon Cam Temizliği"]},{e:"🏢",bg:"#EDE9FE",ad:"Kurumsal",isler:["Ofis Temizlik Aboneliği", "Site & Apartman Temizliği", "Mağaza Temizliği", "Fabrika Temizliği"]}],
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
    isTurleri:[{e:"❄️",bg:"#DBEAFE",ad:"Klima",isler:["Klima Montajı", "Klima Sökme & Takma", "Multi Split Kurulum", "Salon Tipi Klima Montajı"]},{e:"🔧",bg:"#DCFCE7",ad:"Bakım",isler:["Klima Bakım & Gaz Doldurma", "Klima Temizliği", "Periyodik Bakım Aboneliği", "Kompresör Kontrolü"]},{e:"📦",bg:"#FEF3C7",ad:"Montaj",isler:["VRF Sistem Kurulumu", "Fan Coil Montajı", "Havalandırma Kanalı", "Çatı Tipi Klima Montajı"]},{e:"🧊",bg:"#EDE9FE",ad:"Soğutma",isler:["Soğuk Hava Deposu Bakımı", "Vitrin Dolabı Tamiri", "Soğuk Oda Kurulumu", "Buzdolabı Gaz Dolumu"]}],
    ornekIsler:["Klima Montajı","Klima Bakım & Gaz Doldurma","Soğuk Hava Deposu Bakımı","VRF Sistem Kurulumu","Klima Temizliği"],
    giderKat:["Gaz & Malzeme","Yedek Parça","Yakıt","Personel","Kira","Diğer"],
    isOrnekPh:"Klima Montajı...",
  },
  "Güvenlik & Alarm":{
    icon:"🔒",
    isTurleri:[{e:"🔒",bg:"#FEE2E2",ad:"Alarm",isler:["Alarm Sistemi Kurulumu", "Yangın Alarm Kurulumu", "Hırsız Alarm Bakımı", "Alarm Paneli Değişimi"]},{e:"📷",bg:"#DBEAFE",ad:"Kamera",isler:["Kamera Sistemi Montajı", "IP Kamera Kurulumu", "Kayıt Cihazı Değişimi", "Kamera Bakım & Ayar"]},{e:"🚪",bg:"#FEF3C7",ad:"Kapı",isler:["Parmak İzi Kapı Sistemi", "Görüntülü Diafon", "Otomatik Kapı Sistemi", "Kartlı Geçiş Sistemi"]},{e:"🔧",bg:"#DCFCE7",ad:"Bakım",isler:["Güvenlik Sistemi Bakımı", "Yıllık Bakım Aboneliği", "Sistem Güncelleme", "Arıza Onarımı"]}],
    ornekIsler:["Alarm Sistemi Kurulumu","Kamera Sistemi Montajı","Yangın Alarm Kurulumu","Parmak İzi Kapı Sistemi","Güvenlik Sistemi Bakımı"],
    giderKat:["Ekipman","Kablo & Malzeme","Yakıt","Personel","Kira","Diğer"],
    isOrnekPh:"Alarm Sistemi Kurulumu...",
  },
  "Boya & Badana":{
    icon:"🎨",
    isTurleri:[{e:"🎨",bg:"#FEE2E2",ad:"Boya",isler:["İç Mekan Boyama", "Daire Komple Boya", "Tavan Boyama", "Alçıpan Boyama"]},{e:"🖌️",bg:"#DBEAFE",ad:"Badana",isler:["Badana & Kireç", "Tek Oda Badana", "Merdiven Boşluğu Badana", "Tamirat + Badana"]},{e:"🏠",bg:"#DCFCE7",ad:"Dış Cephe",isler:["Dış Cephe Boya", "Dış Cephe Mantolama Boyası", "Çatı Boyama", "Balkon Boyama"]},{e:"🎭",bg:"#FEF3C7",ad:"Dekoratif",isler:["Dekoratif Sıva", "Efekt Boya Uygulaması", "Duvar Kağıdı Uygulama", "Vernik & Cila"]}],
    ornekIsler:["İç Mekan Boyama","Dış Cephe Boya","Dekoratif Sıva","Alçıpan Boyama","Çatı Boyama"],
    giderKat:["Boya & Malzeme","Fırça & Ekipman","Yakıt","Personel","İskele Kirası","Diğer"],
    isOrnekPh:"İç Mekan Boyama...",
  },
  "Nakliyat & Taşımacılık":{
    icon:"🚛",
    isTurleri:[{e:"🚛",bg:"#FEF3C7",ad:"Nakliye",isler:["Ev Taşıma", "Ofis Taşıma", "Şehirlerarası Nakliye", "Parça Eşya Taşıma"]},{e:"📦",bg:"#DBEAFE",ad:"Ambalaj",isler:["Paketleme Hizmeti", "Eşya Sandıklama", "Kırılacak Eşya Paketleme", "Depolama Hizmeti"]},{e:"🏗️",bg:"#DCFCE7",ad:"Asansör",isler:["Eşya Asansörü", "Asansörlü Taşıma", "Yüksek Kat Taşıma", "Piyano Taşıma"]},{e:"🚐",bg:"#EDE9FE",ad:"Şehiriçi",isler:["Şehiriçi Nakliye", "Küçük Nakliye", "Beyaz Eşya Taşıma", "Mobilya Teslimatı"]}],
    ornekIsler:["Ev Taşıma","Ofis Taşıma","Eşya Asansörü","Paketleme Hizmeti","Şehirlerarası Nakliye"],
    giderKat:["Yakıt","Ambalaj Malzemesi","Araç Bakım","Personel","Sigorta","Diğer"],
    isOrnekPh:"Ev Taşıma...",
  },
  "Tarım & Peyzaj":{
    icon:"🌱",
    isTurleri:[{e:"🌱",bg:"#DCFCE7",ad:"Peyzaj",isler:["Bahçe Düzenlemesi", "Peyzaj Tasarımı", "Rulo Çim Serimi", "Bahçe Yenileme"]},{e:"✂️",bg:"#FEF3C7",ad:"Budama",isler:["Ağaç Budama", "Çit Budama", "Çim Biçme & Bakım", "Gül & Bitki Budama"]},{e:"💧",bg:"#DBEAFE",ad:"Sulama",isler:["Otomatik Sulama Sistemi", "Damla Sulama Kurulumu", "Fıskiye Sistemi", "Sulama Arıza Onarımı"]},{e:"🌳",bg:"#EDE9FE",ad:"Ağaç",isler:["Ağaç Dikimi", "Ağaç Kesimi", "Fidan Dikimi", "Ağaç İlaçlama"]}],
    ornekIsler:["Bahçe Düzenlemesi","Çim Biçme & Bakım","Ağaç Budama","Otomatik Sulama Sistemi","Peyzaj Tasarımı"],
    giderKat:["Fide & Tohum","Gübre & İlaç","Ekipman","Yakıt","Personel","Diğer"],
    isOrnekPh:"Bahçe Düzenlemesi...",
  },
  "Sağlık & Eczane":{
    icon:"💊",
    isTurleri:[{e:"💊",bg:"#FEE2E2",ad:"İlaç",isler:["Medikal Malzeme Temini", "Reçete Hazırlama", "İlaç Danışmanlığı", "Evde İlaç Teslimatı"]},{e:"🩺",bg:"#DBEAFE",ad:"Muayene",isler:["Muayene & Konsültasyon", "Kontrol Muayenesi", "Online Konsültasyon", "Evde Muayene"]},{e:"💉",bg:"#DCFCE7",ad:"Tedavi",isler:["Fizyoterapi Seansı", "Aşı & Profilaksi", "Enjeksiyon & Pansuman", "Rehabilitasyon Programı"]},{e:"📋",bg:"#FEF3C7",ad:"Rapor",isler:["Sağlık Taraması", "Sağlık Raporu", "Check-up Paketi", "Tahlil Değerlendirme"]}],
    ornekIsler:["Muayene & Konsültasyon","Fizyoterapi Seansı","Aşı & Profilaksi","Medikal Malzeme Temini","Sağlık Taraması"],
    giderKat:["Medikal Malzeme","İlaç & Sarf","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Muayene & Konsültasyon...",
  },
  "Berber & Kuaför":{
    icon:"💇",
    isTurleri:[{e:"💇",bg:"#EDE9FE",ad:"Saç",isler:["Fön & Şekillendirme", "Saç Bakımı & Keratin", "Perma", "Kaynak & Ekleme"]},{e:"✂️",bg:"#DBEAFE",ad:"Kesim",isler:["Saç Kesimi", "Sakal Tıraşı", "Çocuk Tıraşı", "Saç & Sakal Komple"]},{e:"🎨",bg:"#FEE2E2",ad:"Boya",isler:["Saç Boyama", "Röfle & Balyaj", "Dip Boya", "Renk Açma"]},{e:"💆",bg:"#DCFCE7",ad:"Bakım",isler:["Cilt Bakımı", "Kaş Alımı", "Manikür & Pedikür", "Ağda & Epilasyon"]}],
    ornekIsler:["Saç Kesimi","Saç Boyama","Fön & Şekillendirme","Sakal Tıraşı","Kaş Alımı"],
    giderKat:["Kimyasal & Boya","Sarf Malzeme","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Saç Kesimi...",
  },
  "Veteriner":{
    icon:"🐾",
    isTurleri:[{e:"🐾",bg:"#FEF3C7",ad:"Muayene",isler:["Muayene & Konsültasyon", "Kontrol Muayenesi", "Evde Veteriner Hizmeti", "Genel Sağlık Kontrolü"]},{e:"💉",bg:"#FEE2E2",ad:"Aşı",isler:["Karma Aşı", "Kuduz Aşısı", "İç-Dış Parazit Uygulaması", "Aşı Takvimi Takibi"]},{e:"🔬",bg:"#DBEAFE",ad:"Tahlil",isler:["Kan & Tahlil", "Röntgen & Görüntüleme", "Ultrason", "Laboratuvar Testleri"]},{e:"✂️",bg:"#DCFCE7",ad:"Operasyon",isler:["Kısırlaştırma Operasyonu", "Diş Temizliği & Çekimi", "Yumuşak Doku Cerrahisi", "Tırnak & Bakım"]}],
    ornekIsler:["Muayene & Konsültasyon","Aşılama","Kısırlaştırma Operasyonu","Kan & Tahlil","Tırnak & Bakım"],
    giderKat:["İlaç & Aşı","Medikal Malzeme","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Muayene & Konsültasyon...",
  },
  "Eğitim & Kurs":{
    icon:"📚",
    isTurleri:[{e:"📚",bg:"#DBEAFE",ad:"Kurs",isler:["Online Kurs", "Yüz Yüze Kurs Programı", "Hafta Sonu Kursu", "Yoğunlaştırılmış Kurs"]},{e:"👨‍🏫",bg:"#DCFCE7",ad:"Ders",isler:["Özel Ders", "Grup Eğitimi", "Birebir Online Ders", "Ödev & Etüt Desteği"]},{e:"📝",bg:"#FEF3C7",ad:"Sınav",isler:["Sınav Hazırlık Programı", "Deneme Sınavı Uygulaması", "Seviye Tespit Sınavı", "Sınav Koçluğu"]},{e:"🎓",bg:"#EDE9FE",ad:"Sertifika",isler:["Sertifika Programı", "Kurumsal Eğitim", "Mesleki Yeterlilik Eğitimi", "Uzmanlık Sertifikası"]}],
    ornekIsler:["Özel Ders","Online Kurs","Sertifika Programı","Grup Eğitimi","Kurumsal Eğitim"],
    giderKat:["Materyal & Kitap","Yazılım & Abonelik","Kira","Personel","Ulaşım","Diğer"],
    isOrnekPh:"Özel Ders...",
  },
  "Muhasebe & Mali Müşavir":{
    icon:"🧾",
    isTurleri:[{e:"🧾",bg:"#DCFCE7",ad:"Muhasebe",isler:["Aylık Muhasebe", "Defter Tutma", "Fatura & İrsaliye İşleme", "Ön Muhasebe Hizmeti"]},{e:"📊",bg:"#DBEAFE",ad:"Analiz",isler:["Mali Analiz Raporu", "Bilanço Analizi", "Maliyet Analizi", "Bütçe Planlama"]},{e:"📝",bg:"#FEF3C7",ad:"Beyan",isler:["Vergi Beyannamesi", "KDV Beyannamesi", "SGK Bildirimi", "Geçici Vergi Beyanı"]},{e:"💼",bg:"#EDE9FE",ad:"Danışma",isler:["Şirket Kuruluşu", "Vergi Danışmanlığı", "Teşvik Danışmanlığı", "Mali Müşavirlik Aboneliği"]}],
    ornekIsler:["Aylık Muhasebe","Vergi Beyannamesi","Mali Analiz Raporu","SGK Bildirimi","Şirket Kuruluşu"],
    giderKat:["Yazılım Aboneliği","Ulaşım","Ofis","Personel","Eğitim","Diğer"],
    isOrnekPh:"Aylık Muhasebe...",
  },
  "Tekstil & Dikiş":{
    icon:"🧵",
    isTurleri:[{e:"🧵",bg:"#EDE9FE",ad:"Dikiş",isler:["Kıyafet Dikimi", "Perde Dikimi", "Nevresim & Yatak Örtüsü", "Toplu Dikiş İşi"]},{e:"✂️",bg:"#FEE2E2",ad:"Kesim",isler:["Kumaş Kesimi", "Kalıp Çıkarma", "Paça & Kol Kısaltma", "Fason Kesim"]},{e:"👗",bg:"#DBEAFE",ad:"Tasarım",isler:["Özel Tasarım", "Gelinlik & Abiye", "Kostüm Tasarımı", "Kurumsal Üniforma"]},{e:"🔧",bg:"#DCFCE7",ad:"Tamir",isler:["Tamir & Tadilat", "Fermuar Değişimi", "Daraltma & Genişletme", "Yama & Onarım"]}],
    ornekIsler:["Kıyafet Dikimi","Tamir & Tadilat","Perde Dikimi","Nakış & İşleme","Özel Tasarım"],
    giderKat:["Kumaş & Malzeme","İplik & Aksesuar","Ekipman","Personel","Kira","Diğer"],
    isOrnekPh:"Kıyafet Dikimi...",
  },
  "Gıda & Catering":{
    icon:"🍽️",
    isTurleri:[{e:"🍽️",bg:"#FEF3C7",ad:"Catering",isler:["Organizasyon Catering", "Kokteyl & İkram", "Düğün Yemeği", "Kurumsal Catering"]},{e:"🎂",bg:"#FEE2E2",ad:"Pasta",isler:["Düğün Pastası", "Doğum Günü Pastası", "Butik Pasta", "Kurabiye & Tatlı Siparişi"]},{e:"🥗",bg:"#DCFCE7",ad:"Yemek",isler:["Günlük Yemek Servisi", "Özel Etkinlik Yemeği", "Ev Yemekleri Siparişi", "Diyet Yemek Programı"]},{e:"📦",bg:"#DBEAFE",ad:"Paket",isler:["Paket Servis", "Toplu Sipariş Teslimatı", "Kumanya Hazırlama", "Piknik Paketi"]}],
    ornekIsler:["Organizasyon Catering","Düğün Pastası","Günlük Yemek Servisi","Kokteyl & İkram","Özel Etkinlik Yemeği"],
    giderKat:["Malzeme & Gıda","Ambalaj","Nakliye","Personel","Ekipman","Diğer"],
    isOrnekPh:"Organizasyon Catering...",
  },
  "Bilişim & Yazılım":{
    icon:"💻",
    isTurleri:[{e:"💻",bg:"#DBEAFE",ad:"Yazılım",isler:["Yazılım Geliştirme", "Mobil Uygulama Yapımı", "Otomasyon Yazılımı", "Yazılım Bakım Aboneliği"]},{e:"🖥️",bg:"#DCFCE7",ad:"Donanım",isler:["Bilgisayar Tamiri", "Bilgisayar Toplama", "Parça Değişimi & Upgrade", "Yazıcı Kurulumu"]},{e:"🔧",bg:"#FEF3C7",ad:"Teknik",isler:["IT Destek", "Format & Kurulum", "Veri Kurtarma", "Virüs Temizleme"]},{e:"🌐",bg:"#EDE9FE",ad:"Web",isler:["Web Sitesi Yapımı", "E-Ticaret Sitesi", "Ağ & Sunucu Kurulumu", "Hosting & Domain Yönetimi"]}],
    ornekIsler:["Web Sitesi Yapımı","Yazılım Geliştirme","Bilgisayar Tamiri","Ağ & Sunucu Kurulumu","IT Destek"],
    giderKat:["Yazılım Lisansı","Donanım","Ulaşım","Personel","Abonelik","Diğer"],
    isOrnekPh:"Web Sitesi Yapımı...",
  },
  "Fotoğraf & Video":{
    icon:"📸",
    isTurleri:[{e:"📸",bg:"#FEE2E2",ad:"Fotoğraf",isler:["Düğün Fotoğrafçılığı", "Ürün Fotoğraf Çekimi", "Portre & Aile Çekimi", "Mekan Fotoğraflama"]},{e:"🎥",bg:"#DBEAFE",ad:"Video",isler:["Video Prodüksiyon", "Tanıtım Filmi", "Drone Çekimi", "Etkinlik Video Kaydı"]},{e:"✂️",bg:"#DCFCE7",ad:"Kurgu",isler:["Video Kurgu & Montaj", "Renk Düzenleme", "Sosyal Medya İçerik", "Klip Hazırlama"]},{e:"🎭",bg:"#FEF3C7",ad:"Etkinlik",isler:["Düğün & Nişan Çekimi", "Konser & Etkinlik Çekimi", "Mezuniyet Çekimi", "Doğum Günü Çekimi"]}],
    ornekIsler:["Düğün Fotoğrafçılığı","Ürün Fotoğraf Çekimi","Video Prodüksiyon","Tanıtım Filmi","Sosyal Medya İçerik"],
    giderKat:["Ekipman Bakım","Yazılım","Ulaşım","Personel","Stüdyo Kira","Diğer"],
    isOrnekPh:"Düğün Fotoğrafçılığı...",
  },
  "Kuyumcu & Kıymetli Maden":{
    icon:"💍",
    isTurleri:[{e:"💍",bg:"#FEF9C3",ad:"Takı",isler:["Özel Tasarım Yapımı", "Alyans Yapımı", "Kolye & Bileklik Üretimi", "Taş Mıhlama"]},{e:"🔧",bg:"#DCFCE7",ad:"Tamir",isler:["Takı Tamiri", "Zincir Kaynağı", "Yüzük Ölçü Ayarı", "Kilit Değişimi"]},{e:"⚖️",bg:"#DBEAFE",ad:"Değer",isler:["Altın/Gümüş Değerleme", "Ekspertiz Raporu", "Sertifikalı Kuyumculuk", "Taş Değerleme"]},{e:"✨",bg:"#FEE2E2",ad:"Temizlik",isler:["Mücevher Temizleme", "Rodaj & Parlatma", "Ultrasonik Temizlik", "Altın Cilalama"]}],
    ornekIsler:["Takı Tamiri","Özel Tasarım Yapımı","Altın/Gümüş Değerleme","Mücevher Temizleme","Sertifikalı Kuyumculuk"],
    giderKat:["Ham Madde","Ekipman","Sigorta","Personel","Kira","Diğer"],
    isOrnekPh:"Takı Tamiri...",
  },
  "Sigorta & Finans":{
    icon:"📋",
    isTurleri:[{e:"📋",bg:"#DBEAFE",ad:"Sigorta",isler:["Kasko & Trafik Sigortası", "Konut Sigortası", "Sağlık Sigortası", "İşyeri Sigortası"]},{e:"💰",bg:"#DCFCE7",ad:"Finans",isler:["Finansal Planlama", "Kredi Danışmanlığı", "Yatırım Danışmanlığı", "Portföy Yönetimi"]},{e:"📊",bg:"#FEF3C7",ad:"Analiz",isler:["Risk Analizi", "Hasar Dosyası Takibi", "Poliçe Karşılaştırma", "Prim Analizi"]},{e:"🤝",bg:"#EDE9FE",ad:"Danışma",isler:["Emeklilik Danışmanlığı", "BES Danışmanlığı", "Sigorta Yenileme Takibi", "Hasar Danışmanlığı"]}],
    ornekIsler:["Kasko & Trafik Sigortası","Konut Sigortası","Sağlık Sigortası","Finansal Planlama","Emeklilik Danışmanlığı"],
    giderKat:["Yazılım Aboneliği","Ulaşım","Ofis","Personel","Eğitim","Diğer"],
    isOrnekPh:"Kasko & Trafik Sigortası...",
  },
};
// Mevcut + yeni sektörleri birleştir
const SEKTOR_VERI_TAM = {...SEKTOR_VERI,...SEKTOR_VERI_EK};
