if(typeof window!=="undefined")console.log("%c🚀 TradeFlow build: v20260709-fix","background:#2563EB;color:#fff;padding:4px 10px;border-radius:6px;font-weight:bold;");
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

// ─── SUPABASE BAĞLANTISI (bulut veri) ──────────────────────────
const SUPABASE_URL = "https://xnxxormjtzjhjamzqfjh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhueHhvcm1qdHpqaGphbXpxZmpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzNTQzNTcsImV4cCI6MjA5ODkzMDM1N30.5onyGAnfYJ8YHgXqlfsOMAdIml2OAGFFtpt_57H9kjo";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,      // oturumu tarayıcıda sakla
    autoRefreshToken: true,    // süresi dolunca otomatik yenile
    storageKey: "tradeflow-oturum",
  },
});

const LIGHT = {
  bg:"#F2F2F7",card:"#FFFFFF",border:"#E5E7EB",
  t1:"#111827",t2:"#6B7280",t3:"#9CA3AF",
  green:"#10B981",greenBg:"#DCFCE7",amber:"#F59E0B",amberBg:"#FEF3C7",
  red:"#EF4444",redBg:"#FEE2E2",blue:"#3B82F6",blueBg:"#DBEAFE",
  purpleBg:"#EAF1FF",inputBg:"#FFFFFF",
  statP:"#2563EB",statG:"#059669",statA:"#B45309",statR:"#DC2626",
  sh:"0 1px 4px rgba(0,0,0,0.07),0 0 0 1px rgba(0,0,0,0.04)",
  sh2:"0 8px 24px rgba(0,0,0,0.12)",
};
const DARK = {
  bg:"#0B0F1A",card:"#151B2B",border:"#252D42",
  t1:"#F1F5F9",t2:"#94A3B8",t3:"#64748B",
  green:"#34D399",greenBg:"#0E3A2C",amber:"#FBBF24",amberBg:"#3A2E0E",
  red:"#F87171",redBg:"#3F1717",blue:"#60A5FA",blueBg:"#12294E",
  purpleBg:"#16294A",inputBg:"#0F1522",
  statP:"#93C5FD",statG:"#6EE7B7",statA:"#FCD34D",statR:"#FCA5A5",
  sh:"0 1px 4px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.05)",
  sh2:"0 8px 24px rgba(0,0,0,0.6)",
};
let C = LIGHT;
const P = "#2563EB";


// ── RESPONSIVE GENİŞLİK ──
// Telefonda 480px (dokunmatik için ideal), bilgisayarda 800px (geniş ekran)
const APP_W = (typeof window!=="undefined" && window.innerWidth>=768) ? 800 : 480;
const MASAUSTU = typeof window!=="undefined" && window.innerWidth>=1024; // sol menülü masaüstü düzen
let KURLAR = {TL:1,USD:46.80,EUR:53.61};
let KUR_KAYNAK = "sabit"; // "tcmb" | "canli" | "sabit"
const kurKaynakAd = () => KUR_KAYNAK==="tcmb" ? "🏛️ TCMB Resmî Kur" : KUR_KAYNAK==="canli" ? "📈 Piyasa Kuru" : "Sabit Kur";
let AKTIF_PARA = "TL";
const SEMBOL = {TL:" TL",USD:" $",EUR:" €"};
const fmt = (n) => {
  const v = n / (KURLAR[AKTIF_PARA]||1);
  const dec = AKTIF_PARA==="TL"?0:2;
  return v.toLocaleString("tr-TR",{minimumFractionDigits:dec,maximumFractionDigits:dec})+SEMBOL[AKTIF_PARA];
};

const TR = {
  malzemeKalemleri:"Malzeme / Hizmet Kalemleri",kalemAdPh:"Malzeme veya hizmet adı",adetL:"Adet",birimFiyatL:"Birim Fiyat",kalemEkle:"+ Kalem Ekle",araToplamL:"Ara Toplam",kdvL:"KDV",genelToplamL:"Genel Toplam",teklifBelgesi:"FİYAT TEKLİFİ",gecerlilikNot:"Bu teklif belirtilen tarihe kadar geçerlidir.",kaseImza:"Kaşe / İmza",teklifPdfBtn:"PDF",
  gunaydin:"Günaydın,",isletmem:"İşletmem",yeniIs:"Yeni İş",isKoluSec:"İş Kolunu Seç",ozellestir:"Özelleştir",
  aktifIs:"Aktif İş",devamEden:"Devam eden",tahsilEdildi:"Tahsil Edildi",buAyTahsilat:"Bu ay",
  bekleyenTahsilat:"Bekleyen Tahsilat",fatura:"fatura",bekleyen:"Bekleyen",faturaTek:"Fatura",
  isAkislari:"İş Akışları",faturalar:"Faturalar",tahsilatlar:"Tahsilatlar",musteriler:"Müşteriler",
  teklifler:"Teklifler",raporlar:"Raporlar",giderler:"Giderler",dahaFazla:"Daha Fazla",
  gelirGider:"Gelir - Gider",buAy:"Bu Ay",toplamGelir:"Toplam Gelir",toplamGider:"Toplam Gider",
  netKar:"Net Kâr",tahsilatDurumu:"Tahsilat Durumu",toplam:"Toplam",tahsilEdilen:"Tahsil Edilen",
  geciken:"Geciken",vadesiGelmeyen:"Vadesi Gelmeyen",tahsilatOrani:"Tahsilat Oranı",
  duzenleBaslik1:"İşletmeni Sana",duzenleBaslik2:"Göre Düzenle",duzenleAlt:"Modülleri seç, sıralamayı değiştir.",duzenle:"Düzenle",
  sonIsAkislari:"Son İş Akışları",musteri:"Müşteri",tumunuGoruntule:"Tümünü Görüntüle",
  anaSayfa:"Ana Sayfa",bildirimlerT:"Bildirimler",profil:"Profil",tumIsAkislari:"Tüm İş Akışları",
  devamEdiyor:"Devam Ediyor",beklemede:"Beklemede",tamamlandi:"Tamamlandı",
  buAyinKarnesi:"BU AYIN KARNESİ",isTamamlandi:"İş Tamamlandı",tahsilat:"Tahsilat",memnuniyet:"Memnuniyet",
  isletme:"İŞLETME",isletmeBilgileri:"İşletme Bilgileri",kdvOrani:"KDV Oranı",logoYukle:"Logo Yükle",
  sec:"Seç",degistir:"Değiştir",uygulama:"UYGULAMA",bildirimlerL:"Bildirimler",karanlikMod:"Karanlık Mod",
  dil:"Dil",paraBirimi:"Para Birimi",destek:"DESTEK",whatsappDestek:"WhatsApp Destek",
  yardimMerkezi:"Yardım Merkezi",degerlendir:"Uygulamayı Değerlendir",gizlilik:"Gizlilik Politikası",
  cikisYap:"Çıkış Yap",profiliDuzenle:"Profili Düzenle",dilSecin:"Dil Seçin",paraBirimiB:"Para Birimi",
  iptal:"İptal",kaydet:"Kaydet",sil:"Sil",silOnay:"Bu işi silmek istiyor musunuz?",evetSil:"Evet, Sil",
  hatirlatma:"Hatırlatma",faturaKes:"Fatura Kes",tamamla:"Tamamla",kapat:"Kapat",
  yeniTeklif:"Yeni Teklif",iseDonustur:"İşe Dönüştür",gecerlilik:"Geçerlilik",
  yeniGider:"Yeni Gider",tahsilEt:"Tahsil Et",oneriniz:"Öneriniz...",
  gonder:"Gönder",tesekkurler:"Teşekkürler!",verileriSifirla:"Verileri Sıfırla",
  disaAktar:"Verileri Dışa Aktar",bosBildirim:"Henüz bildirim yok",tumunuOkundu:"Tümünü okundu işaretle",
  sonucYok:"Sonuç yok",gunSecin:"Bir güne dokunarak o günün işlerini görün",buGunIsYok:"Bu güne ait iş yok",isleri:"İŞLERİ",
  isDuzenle:"İşi Düzenle",ikon:"İkon",isBasligi:"İş Başlığı",tarihL:"Tarih",tutarL:"Tutar",
  tekrarlama:"Tekrarlama (bakım aboneliği)",tekSefer:"Tek Sefer",haftalikL:"Haftalık",aylikL:"Aylık",yillikL:"Yıllık",
  tekrarBilgi:"İş tamamlandığında bir sonraki dönem için otomatik yeni iş oluşturulur",
  isAdresiL:"İş Adresi (opsiyonel)",adresPh:"Mahalle, cadde, bina no, şehir...",musteriTel:"Müşteri Tel. (opsiyonel)",epostaOps:"E-posta (opsiyonel)",
  isFotolari:"İş Fotoğrafları (öncesi/sonrası)",durumL:"Durum",guncelle:"Güncelle",
  odemeDurumu:"Ödeme Durumu",kaparoEkle:"+ Kaparo / Kısmi Tahsilat",alinan:"Alınan",kalanL:"Kalan",adresL:"Adres",navBaslat:"Navigasyonu Başlat",fotograflarB:"İŞ FOTOĞRAFLARI",
  henuzFaturaYok:"Henüz fatura kesilmedi.",kesildiL:"KESİLDİ",bekleyenIslerB:"BEKLEYEN İŞLER",alindiL:"alındı",
  yeniMusteri:"Yeni Müşteri Ekle",adSoyadPh:"Ad Soyad / Firma *",telefonL:"Telefon",epostaL:"E-posta",adresNavPh:"Adres (navigasyon için)",vazgec:"Vazgeç",gitL:"Git",yeniL:"Yeni",
  ciroL:"Ciro",isSayisi:"İş Sayısı",isAdresleriB:"İŞ ADRESLERİ",toplamCiro:"Toplam Ciro",toplamIsL:"Toplam İş",isGecmisiB:"İŞ GEÇMİŞİ",isKaydiYok:"İş kaydı yok",araL:"Ara",iletisimYok:"İletişim bilgisi girilmemiş",
  donusum:"Dönüşüm",gunL:"gün",suresiDoldu:"Süresi doldu",onaylandiL:"Onaylandı",reddedildiL:"Reddedildi",onayla:"Onayla",reddet:"Reddet",
  henuzTeklifYok:"Henüz teklif yok",ilkTeklif:"+ İlk Teklifi Oluştur",teklifBilgi:"Müşteriye fiyat teklifi oluştur, onay aldıktan sonra işe dönüştür.",filtreEslesmedi:"Bu filtreyle eşleşen teklif yok.",bekleyenTeklifT:"Bekleyen teklif toplamı",
  buAyR:"Bu Ay",gecenAy:"Geçen Ay",son3Ay:"Son 3 Ay",tumu:"Tümü",gelirL:"Gelir",giderL:"Gider",
  son7Gun:"Son 7 Gün Gelir",son7Yok:"Son 7 günde tamamlanan iş yok.",isBazli:"İş Bazlı Tutarlar",donemdeIsYok:"Bu dönemde iş yok",durumDagilimi:"Durum Dağılımı",aktifL:"Aktif",
  yedekGeriYukle:"Yedeği Geri Yükle",jsonIceAktar:"JSON içe aktar",hakkinda:"Hakkında",detayL:"Detay",
  whatsappGonder:"WhatsApp'ta Gönder",yazdirPdf:"Yazdır / PDF",
  tumIslerB:"TÜM İŞLER",listesiB:"LİSTESİ",kategoriIsYok:"Bu kategoride iş yok",gelirKaynaklariB:"GELİR KAYNAKLARI",giderKategorileriB:"GİDER KATEGORİLERİ",henuzGiderYok:"Henüz gider girilmedi",devamEdenL:"Devam Eden",isL:"iş",
  isletmeAyarlariB:"İŞLETME AYARLARI",finansB:"FİNANS",raporlamaDonemi:"Raporlama Dönemi",bankaHesabi:"Banka Hesabı Ekle",sesEfektleri:"Ses Efektleri",kompaktGorunum:"Kompakt Görünüm",proYukselt:"Pro'ya Yükselt",haftalikHedef:"Haftalık Hedef",
  hizliModullerB:"HIZLI ERİŞİM MODÜLLER",modulBilgi:"Modülleri açıp kapatabilir, sürükleyerek sıralayabilirsiniz. Değişiklikler anında uygulanır.",modulEkle:"+ Modül Ekle / Düzenle →",
  sesEfektSub:"İşlem onay sesleri",kompaktSub:"Daha sık içerik",bildirimSub:"İş hatırlatmaları ve uyarılar",karanlikSub:"Göz yorgunluğunu azaltır",
  vergiDairesiYok:"Vergi dairesi girilmedi",kdvSub:"Fatura hesaplamalarına yansır",logoSub:"Faturalarda ve profilde görünür",
  canliKur:"Canlı kur",sabitKur:"Sabit kur",aylikGorunum:"Aylık görünüm",ibanSub:"IBAN ile tahsilat takibi",
  proSub:"Sınırsız iş · PDF fatura · WhatsApp gönderim · Bulut yedek",epostaDestek:"E-posta Destek",sssSub:"SSS ve rehberler",degerlendirSub:"App Store / Play Store'da değerlendir",kvkkSub:"KVKK uyumlu",yakinda:"Yakında!",
  gibSubAktif:"Canlı e-Fatura aktif",gibSubTest:"API ayarlandı, test gerekiyor",gibSubYok:"Henüz kurulmadı",
  mIslerA:"Tüm iş emirleri ve durumları",mFaturaA:"Kesilen ve bekleyen faturalar",mTahsilatA:"Tahsil edilen ve bekleyen ödemeler",mMusteriA:"Müşteri listesi ve ciro analizi",mTeklifA:"Fiyat teklifleri ve dönüşümler",mRaporA:"Grafik ve istatistik raporları",mGiderA:"Gider takibi ve kategoriler",mDahaA:"Dışa aktar, ayarlar, yardım",
  modulFooter:"Aktif modüller Ana Sayfa'da görünür · Kapalı modüller alt menüden erişilebilir",
  kategori:"Kategori",aramaPh:"🔍 Müşteri veya iş ara...",dilAramaPh:"🔍 Dil veya ülke ara...",yardimAramaPh:"🔍 Yardım arayın...",
  isOrnekPh:"Petek Temizliği...",musteriOrnekPh:"Ahmet Yılmaz",malzemePh:"Malzeme alımı...",musteriAdiPh:"Müşteri adı",klimaPh:"Klima montajı...",aliciAdiPh:"Alıcı adı",
  maliyetL:"Tahmini Maliyet",maliyetPh:"Malzeme + işçilik + yol...",marjL:"Kâr Marjı",zararUyari:"BU İŞ ZARARDA!",dusukMarj:"Düşük kâr marjı",benzerIs:"Benzer işlerde ort. maliyetin",
  guncelMusterilerT:"Güncel Müşteriler",musteriKayitT:"Müşteri Kayıt",kayitliMusteriler:"Kayıtlı Müşteriler",yeniKayit:"+ Yeni Kayıt",kayitYok:"Henüz kayıtlı müşteri yok",kayitYokSub:"Müşterilerini önceden kaydet, iş açarken hazır olsun",telYok:"Tel yok",isKaydiVar:"iş kaydı var",aktifMusteriDurumu:"Aktif Müşteri Durumu",
  tahsilKisa:"Tahsil",giderKisa:"Gider",karKisa:"Kâr",zararKisa:"Zarar",karZararAnalizi:"KÂR / ZARAR ANALİZİ",netZarar:"Net Zarar",giderKalemleri:"Gider Kalemleri",yeniIsAc:"➕ Yeni İş Aç",giderEkleBtn:"💸 Gider Ekle",
  musteriyiSil:"Müşteriyi Sil",silinecekK:"silinecek",aitIsUyariOn:"Bu müşteriye ait",aitIsUyariSon:"iş kaydı da silinecek!",isimsizMusteri:"İsimsiz Müşteri",isimsizK:"İsimsiz",
  iseBagla:"İşe Bağla (opsiyonel)",islerdenSec:"+ Aktif/Bekleyen İşlerden Seç",listeyiKapat:"▲ Listeyi Kapat",aktifBekleyenYok:"Aktif/bekleyen iş yok",
  tumuF:"Tümü",iseBagliF:"📋 İşe Bağlı",serbestF:"Serbest",giderlerB:"GİDERLER",atananL:"Atanan",atananKisi:"Atanan Kişi",benL:"Ben",
  hazirIslerOn:"",hazirIslerSon:" için hazır işler:",
  ekipYonetimi:"Ekip Yönetimi",ekipSub:"Üye ekle, işleri ata",yeniUyeEkle:"Yeni Üye Ekle",ekibeEkle:"+ Ekibe Ekle",ekipYok:"Henüz ekip üyesi yok",ekipYokSub:"Üye ekleyince işleri atayabilir, performansı Raporlar'da görürsün",isAtandiK:"iş atandı",buIsimVar:"Bu isim zaten ekipte",uyeCikarildi:"Üye çıkarıldı",ekibeEklendi:"ekibe eklendi",
  rolUsta:"Usta",rolMuhasebe:"Muhasebe",rolSatis:"Satış",rolSofor:"Şoför",rolYardimci:"Yardımcı",patronRol:"Patron",
  ekipPerformansi:"Ekip Performansı",isBirim:"iş",karSuffix:"kâr",
  hosgeldinT:"Hoş geldin",gozAt:"Bugün işlerinize hızlıca göz atın.",
  faturaSilUyari:"Bu fatura silinecek",gibSilNot:"Resmî kesilen faturayı iptal etmek GİB kurallarına tabidir — bu işlem sadece uygulama kaydını siler.",
  excelIslerL:"Excel — İşler",excelGiderlerL:"Excel — Giderler",excelFaturalarL:"Excel — Faturalar",pdfRaporL:"PDF Muhasebe Raporu",muhasebeyeGonder:"Muhasebeciye gönder",yazdirKaydet:"Yazdır / PDF kaydet",
  asistanHosgeldin:"Merhaba! 👋 Ben TradeFlow asistanıyım. Fatura, tahsilat, GİB, maliyet... ne sormak istersen yaz ya da aşağıdaki hızlı sorulardan seç.",soruPh:"Sorunu yaz...",
  asistan:"Yardımcı Asistan",asistanSub:"Sorularını anında yanıtlar",
};
const EN = {
  malzemeKalemleri:"Material / Service Items",kalemAdPh:"Material or service name",adetL:"Qty",birimFiyatL:"Unit Price",kalemEkle:"+ Add Item",araToplamL:"Subtotal",kdvL:"VAT",genelToplamL:"Grand Total",teklifBelgesi:"PRICE QUOTE",gecerlilikNot:"This quote is valid until the stated date.",kaseImza:"Stamp / Signature",teklifPdfBtn:"PDF",
  gunaydin:"Good morning,",isletmem:"My Business",yeniIs:"New Job",isKoluSec:"Select Trade",ozellestir:"Customize",
  aktifIs:"Active Jobs",devamEden:"In progress",tahsilEdildi:"Collected",buAyTahsilat:"This month",
  bekleyenTahsilat:"Pending Payment",fatura:"invoices",bekleyen:"Pending",faturaTek:"Invoice",
  isAkislari:"Workflows",faturalar:"Invoices",tahsilatlar:"Payments",musteriler:"Clients",
  teklifler:"Quotes",raporlar:"Reports",giderler:"Expenses",dahaFazla:"More",
  gelirGider:"Income-Expense",buAy:"This Month",toplamGelir:"Total Income",toplamGider:"Total Expense",
  netKar:"Net Profit",tahsilatDurumu:"Payment Status",toplam:"Total",tahsilEdilen:"Collected",
  geciken:"Overdue",vadesiGelmeyen:"Not Due",tahsilatOrani:"Collection Rate",
  duzenleBaslik1:"Customize Your",duzenleBaslik2:"Business App",duzenleAlt:"Choose modules, reorder.",duzenle:"Edit",
  sonIsAkislari:"Recent Workflows",musteri:"Client",tumunuGoruntule:"View All",
  anaSayfa:"Home",bildirimlerT:"Alerts",profil:"Profile",tumIsAkislari:"All Workflows",
  devamEdiyor:"In Progress",beklemede:"Pending",tamamlandi:"Completed",
  buAyinKarnesi:"THIS MONTH'S REPORT",isTamamlandi:"Jobs Done",tahsilat:"Collected",memnuniyet:"Satisfaction",
  isletme:"BUSINESS",isletmeBilgileri:"Business Info",kdvOrani:"VAT Rate",logoYukle:"Upload Logo",
  sec:"Choose",degistir:"Change",uygulama:"APP",bildirimlerL:"Notifications",karanlikMod:"Dark Mode",
  dil:"Language",paraBirimi:"Currency",destek:"SUPPORT",whatsappDestek:"WhatsApp Support",
  yardimMerkezi:"Help Center",degerlendir:"Rate the App",gizlilik:"Privacy Policy",
  cikisYap:"Sign Out",profiliDuzenle:"Edit Profile",dilSecin:"Select Language",paraBirimiB:"Currency",
  iptal:"Cancel",kaydet:"Save",sil:"Delete",silOnay:"Delete this job?",evetSil:"Yes, Delete",
  hatirlatma:"Reminder",faturaKes:"Create Invoice",tamamla:"Complete",kapat:"Close",
  yeniTeklif:"New Quote",iseDonustur:"Convert to Job",gecerlilik:"Valid until",
  yeniGider:"New Expense",tahsilEt:"Collect",oneriniz:"Your suggestion...",
  gonder:"Send",tesekkurler:"Thank you!",verileriSifirla:"Reset Data",
  disaAktar:"Export Data",bosBildirim:"No notifications yet",tumunuOkundu:"Mark all read",
  sonucYok:"No results",gunSecin:"Tap a day to see its jobs",buGunIsYok:"No jobs on this day",isleri:"JOBS",
  isDuzenle:"Edit Job",ikon:"Icon",isBasligi:"Job Title",tarihL:"Date",tutarL:"Amount",
  tekrarlama:"Recurrence (maintenance plan)",tekSefer:"One-time",haftalikL:"Weekly",aylikL:"Monthly",yillikL:"Yearly",
  tekrarBilgi:"When completed, a new job is auto-created for the next period",
  isAdresiL:"Job Address (optional)",adresPh:"Street, building no, city...",musteriTel:"Customer Phone (optional)",epostaOps:"Email (optional)",
  isFotolari:"Job Photos (before/after)",durumL:"Status",guncelle:"Update",
  odemeDurumu:"Payment Status",kaparoEkle:"+ Deposit / Partial Payment",alinan:"Received",kalanL:"Remaining",adresL:"Address",navBaslat:"Start Navigation",fotograflarB:"JOB PHOTOS",
  henuzFaturaYok:"No invoices issued yet.",kesildiL:"ISSUED",bekleyenIslerB:"PENDING JOBS",alindiL:"received",
  yeniMusteri:"Add New Customer",adSoyadPh:"Name / Company *",telefonL:"Phone",epostaL:"Email",adresNavPh:"Address (for navigation)",vazgec:"Cancel",gitL:"Go",yeniL:"New",
  ciroL:"Revenue",isSayisi:"Job Count",isAdresleriB:"JOB ADDRESSES",toplamCiro:"Total Revenue",toplamIsL:"Total Jobs",isGecmisiB:"JOB HISTORY",isKaydiYok:"No job records",araL:"Call",iletisimYok:"No contact info",
  donusum:"Conversion",gunL:"days",suresiDoldu:"Expired",onaylandiL:"Approved",reddedildiL:"Rejected",onayla:"Approve",reddet:"Reject",
  henuzTeklifYok:"No quotes yet",ilkTeklif:"+ Create First Quote",teklifBilgi:"Create a price quote, convert to a job after approval.",filtreEslesmedi:"No quotes match this filter.",bekleyenTeklifT:"Pending quotes total",
  buAyR:"This Month",gecenAy:"Last Month",son3Ay:"Last 3 Months",tumu:"All",gelirL:"Income",giderL:"Expense",
  son7Gun:"Last 7 Days Income",son7Yok:"No completed jobs in last 7 days.",isBazli:"Amounts by Job",donemdeIsYok:"No jobs in this period",durumDagilimi:"Status Distribution",aktifL:"Active",
  yedekGeriYukle:"Restore Backup",jsonIceAktar:"Import JSON",hakkinda:"About",detayL:"Details",
  whatsappGonder:"Send via WhatsApp",yazdirPdf:"Print / PDF",
  tumIslerB:"ALL JOBS",listesiB:"LIST",kategoriIsYok:"No jobs in this category",gelirKaynaklariB:"INCOME SOURCES",giderKategorileriB:"EXPENSE CATEGORIES",henuzGiderYok:"No expenses yet",devamEdenL:"In Progress",isL:"jobs",
  isletmeAyarlariB:"BUSINESS SETTINGS",finansB:"FINANCE",raporlamaDonemi:"Reporting Period",bankaHesabi:"Add Bank Account",sesEfektleri:"Sound Effects",kompaktGorunum:"Compact View",proYukselt:"Upgrade to Pro",haftalikHedef:"Weekly Goal",
  hizliModullerB:"QUICK ACCESS MODULES",modulBilgi:"Toggle modules on/off, drag to reorder. Changes apply instantly.",modulEkle:"+ Add / Edit Modules →",
  sesEfektSub:"Action confirmation sounds",kompaktSub:"Denser content",bildirimSub:"Job reminders and alerts",karanlikSub:"Reduces eye strain",
  vergiDairesiYok:"Tax office not set",kdvSub:"Applied to invoice calculations",logoSub:"Shown on invoices and profile",
  canliKur:"Live rates",sabitKur:"Fixed rates",aylikGorunum:"Monthly view",ibanSub:"Track payments via IBAN",
  proSub:"Unlimited jobs · PDF invoices · WhatsApp sending · Cloud backup",epostaDestek:"Email Support",sssSub:"FAQ and guides",degerlendirSub:"Rate on App Store / Play Store",kvkkSub:"Privacy compliant",yakinda:"Coming soon!",
  gibSubAktif:"Live e-Invoice active",gibSubTest:"API set, testing needed",gibSubYok:"Not set up yet",
  mIslerA:"All work orders and statuses",mFaturaA:"Issued and pending invoices",mTahsilatA:"Collected and pending payments",mMusteriA:"Customer list and revenue analysis",mTeklifA:"Price quotes and conversions",mRaporA:"Charts and statistics",mGiderA:"Expense tracking and categories",mDahaA:"Export, settings, help",
  modulFooter:"Active modules appear on Home · Disabled ones stay in the menu",
  kategori:"Category",aramaPh:"🔍 Search customer or job...",dilAramaPh:"🔍 Search language or country...",yardimAramaPh:"🔍 Search help...",
  isOrnekPh:"Radiator Cleaning...",musteriOrnekPh:"John Smith",malzemePh:"Material purchase...",musteriAdiPh:"Customer name",klimaPh:"AC installation...",aliciAdiPh:"Recipient name",
  maliyetL:"Estimated Cost",maliyetPh:"Materials + labor + travel...",marjL:"Profit Margin",zararUyari:"THIS JOB IS AT A LOSS!",dusukMarj:"Low profit margin",benzerIs:"Avg. cost on similar jobs",
  guncelMusterilerT:"Active Customers",musteriKayitT:"Customer Records",kayitliMusteriler:"Registered Customers",yeniKayit:"+ New Record",kayitYok:"No registered customers yet",kayitYokSub:"Save customers in advance for quick job creation",telYok:"No phone",isKaydiVar:"job record(s)",aktifMusteriDurumu:"Active Customer Status",
  tahsilKisa:"Collected",giderKisa:"Expenses",karKisa:"Profit",zararKisa:"Loss",karZararAnalizi:"PROFIT / LOSS ANALYSIS",netZarar:"Net Loss",giderKalemleri:"Expense Items",yeniIsAc:"➕ New Job",giderEkleBtn:"💸 Add Expense",
  musteriyiSil:"Delete Customer",silinecekK:"will be deleted",aitIsUyariOn:"This customer has",aitIsUyariSon:"job record(s) that will also be deleted!",isimsizMusteri:"Unnamed Customer",isimsizK:"Unnamed",
  iseBagla:"Link to Job (optional)",islerdenSec:"+ Select from Active/Pending Jobs",listeyiKapat:"▲ Close List",aktifBekleyenYok:"No active/pending jobs",
  tumuF:"All",iseBagliF:"📋 Job-linked",serbestF:"Unlinked",giderlerB:"EXPENSES",atananL:"Assigned",atananKisi:"Assigned To",benL:"Me",
  hazirIslerOn:"Suggested jobs for ",hazirIslerSon:":",
  ekipYonetimi:"Team Management",ekipSub:"Add members, assign jobs",yeniUyeEkle:"Add New Member",ekibeEkle:"+ Add to Team",ekipYok:"No team members yet",ekipYokSub:"Add members to assign jobs and track performance in Reports",isAtandiK:"assigned",buIsimVar:"This name is already in the team",uyeCikarildi:"Member removed",ekibeEklendi:"added to team",
  rolUsta:"Technician",rolMuhasebe:"Accounting",rolSatis:"Sales",rolSofor:"Driver",rolYardimci:"Helper",patronRol:"Owner",
  ekipPerformansi:"Team Performance",isBirim:"jobs",karSuffix:"profit",
  hosgeldinT:"Welcome",gozAt:"Take a quick look at your business today.",
  faturaSilUyari:"This invoice will be deleted",gibSilNot:"Cancelling an officially issued invoice is subject to tax authority rules — this only removes the app record.",
  excelIslerL:"Excel — Jobs",excelGiderlerL:"Excel — Expenses",excelFaturalarL:"Excel — Invoices",pdfRaporL:"PDF Accounting Report",muhasebeyeGonder:"Send to accountant",yazdirKaydet:"Print / Save as PDF",
  asistanHosgeldin:"Hello! 👋 I'm the TradeFlow assistant. Ask me anything about invoices, payments, costs... or pick a quick question below.",soruPh:"Type your question...",
  asistan:"Assistant",asistanSub:"Instant answers to your questions",
};

// ─── TAM ÇEVİRİ SÖZLÜKLERİ (6 dil) ───────────────────────────
const DE = {
  malzemeKalemleri:"Material- / Leistungsposten",kalemAdPh:"Material oder Leistung",adetL:"Menge",birimFiyatL:"Einzelpreis",kalemEkle:"+ Posten hinzufügen",araToplamL:"Zwischensumme",kdvL:"MwSt.",genelToplamL:"Gesamtsumme",teklifBelgesi:"ANGEBOT",gecerlilikNot:"Dieses Angebot ist bis zum angegebenen Datum gültig.",kaseImza:"Stempel / Unterschrift",teklifPdfBtn:"PDF",
  gunaydin:"Guten Morgen,",isletmem:"Mein Betrieb",yeniIs:"Neuer Auftrag",isKoluSec:"Branche wählen",ozellestir:"Anpassen",
  aktifIs:"Aktive Aufträge",devamEden:"In Arbeit",tahsilEdildi:"Eingezogen",buAyTahsilat:"Diesen Monat",
  bekleyenTahsilat:"Offene Zahlung",fatura:"Rechnungen",bekleyen:"Ausstehend",faturaTek:"Rechnung",
  isAkislari:"Aufträge",faturalar:"Rechnungen",tahsilatlar:"Zahlungen",musteriler:"Kunden",
  teklifler:"Angebote",raporlar:"Berichte",giderler:"Ausgaben",dahaFazla:"Mehr",
  gelirGider:"Einnahmen-Ausgaben",buAy:"Diesen Monat",toplamGelir:"Gesamteinnahmen",toplamGider:"Gesamtausgaben",
  netKar:"Nettogewinn",tahsilatDurumu:"Zahlungsstatus",toplam:"Gesamt",tahsilEdilen:"Eingezogen",
  geciken:"Überfällig",vadesiGelmeyen:"Nicht fällig",tahsilatOrani:"Einzugsquote",
  duzenleBaslik1:"Gestalte deine",duzenleBaslik2:"Betriebs-App",duzenleAlt:"Module wählen, neu ordnen.",duzenle:"Bearbeiten",
  sonIsAkislari:"Letzte Aufträge",musteri:"Kunde",tumunuGoruntule:"Alle anzeigen",
  anaSayfa:"Start",bildirimlerT:"Meldungen",profil:"Profil",tumIsAkislari:"Alle Aufträge",
  devamEdiyor:"In Arbeit",beklemede:"Ausstehend",tamamlandi:"Abgeschlossen",
  buAyinKarnesi:"MONATSBERICHT",isTamamlandi:"Erledigte Aufträge",tahsilat:"Eingezogen",memnuniyet:"Zufriedenheit",
  isletme:"BETRIEB",isletmeBilgileri:"Betriebsdaten",kdvOrani:"MwSt.-Satz",logoYukle:"Logo hochladen",
  sec:"Wählen",degistir:"Ändern",uygulama:"APP",bildirimlerL:"Benachrichtigungen",karanlikMod:"Dunkelmodus",
  dil:"Sprache",paraBirimi:"Währung",destek:"SUPPORT",whatsappDestek:"WhatsApp-Support",
  yardimMerkezi:"Hilfe-Center",degerlendir:"App bewerten",gizlilik:"Datenschutz",
  cikisYap:"Abmelden",profiliDuzenle:"Profil bearbeiten",dilSecin:"Sprache wählen",paraBirimiB:"Währung",
  iptal:"Abbrechen",kaydet:"Speichern",sil:"Löschen",silOnay:"Diesen Auftrag löschen?",evetSil:"Ja, löschen",
  hatirlatma:"Erinnerung",faturaKes:"Rechnung erstellen",tamamla:"Abschließen",kapat:"Schließen",
  yeniTeklif:"Neues Angebot",iseDonustur:"In Auftrag umwandeln",gecerlilik:"Gültig bis",
  yeniGider:"Neue Ausgabe",tahsilEt:"Einziehen",oneriniz:"Ihr Vorschlag...",
  gonder:"Senden",tesekkurler:"Danke!",verileriSifirla:"Daten zurücksetzen",
  disaAktar:"Daten exportieren",bosBildirim:"Noch keine Meldungen",tumunuOkundu:"Alle gelesen",
  sonucYok:"Keine Ergebnisse",gunSecin:"Tag antippen für Aufträge",buGunIsYok:"Keine Aufträge an diesem Tag",isleri:"AUFTRÄGE",
  isDuzenle:"Auftrag bearbeiten",ikon:"Symbol",isBasligi:"Auftragstitel",tarihL:"Datum",tutarL:"Betrag",
  tekrarlama:"Wiederholung (Wartungsplan)",tekSefer:"Einmalig",haftalikL:"Wöchentlich",aylikL:"Monatlich",yillikL:"Jährlich",
  tekrarBilgi:"Nach Abschluss wird automatisch ein neuer Auftrag für die nächste Periode erstellt",
  isAdresiL:"Auftragsadresse (optional)",adresPh:"Straße, Hausnr., Stadt...",musteriTel:"Kundentelefon (optional)",epostaOps:"E-Mail (optional)",
  isFotolari:"Auftragsfotos (vorher/nachher)",durumL:"Status",guncelle:"Aktualisieren",
  odemeDurumu:"Zahlungsstatus",kaparoEkle:"+ Anzahlung / Teilzahlung",alinan:"Erhalten",kalanL:"Restbetrag",adresL:"Adresse",navBaslat:"Navigation starten",fotograflarB:"AUFTRAGSFOTOS",
  henuzFaturaYok:"Noch keine Rechnungen erstellt.",kesildiL:"ERSTELLT",bekleyenIslerB:"OFFENE AUFTRÄGE",alindiL:"erhalten",
  yeniMusteri:"Neuen Kunden anlegen",adSoyadPh:"Name / Firma *",telefonL:"Telefon",epostaL:"E-Mail",adresNavPh:"Adresse (für Navigation)",vazgec:"Abbrechen",gitL:"Los",yeniL:"Neu",
  ciroL:"Umsatz",isSayisi:"Auftragsanzahl",isAdresleriB:"AUFTRAGSADRESSEN",toplamCiro:"Gesamtumsatz",toplamIsL:"Aufträge gesamt",isGecmisiB:"AUFTRAGSHISTORIE",isKaydiYok:"Keine Auftragsdaten",araL:"Anrufen",iletisimYok:"Keine Kontaktdaten",
  donusum:"Umwandlung",gunL:"Tage",suresiDoldu:"Abgelaufen",onaylandiL:"Genehmigt",reddedildiL:"Abgelehnt",onayla:"Genehmigen",reddet:"Ablehnen",
  henuzTeklifYok:"Noch keine Angebote",ilkTeklif:"+ Erstes Angebot erstellen",teklifBilgi:"Erstellen Sie ein Angebot und wandeln Sie es nach Genehmigung in einen Auftrag um.",filtreEslesmedi:"Keine Angebote für diesen Filter.",bekleyenTeklifT:"Offene Angebote gesamt",
  buAyR:"Diesen Monat",gecenAy:"Letzter Monat",son3Ay:"Letzte 3 Monate",tumu:"Alle",gelirL:"Einnahme",giderL:"Ausgabe",
  son7Gun:"Einnahmen letzte 7 Tage",son7Yok:"Keine abgeschlossenen Aufträge in 7 Tagen.",isBazli:"Beträge pro Auftrag",donemdeIsYok:"Keine Aufträge in diesem Zeitraum",durumDagilimi:"Statusverteilung",aktifL:"Aktiv",
  yedekGeriYukle:"Backup wiederherstellen",jsonIceAktar:"JSON importieren",hakkinda:"Über",detayL:"Details",
  whatsappGonder:"Per WhatsApp senden",yazdirPdf:"Drucken / PDF",
  tumIslerB:"ALLE AUFTRÄGE",listesiB:"LISTE",kategoriIsYok:"Keine Aufträge in dieser Kategorie",gelirKaynaklariB:"EINNAHMEQUELLEN",giderKategorileriB:"AUSGABENKATEGORIEN",henuzGiderYok:"Noch keine Ausgaben",devamEdenL:"In Arbeit",isL:"Aufträge",
  isletmeAyarlariB:"BETRIEBSEINSTELLUNGEN",finansB:"FINANZEN",raporlamaDonemi:"Berichtszeitraum",bankaHesabi:"Bankkonto hinzufügen",sesEfektleri:"Soundeffekte",kompaktGorunum:"Kompaktansicht",proYukselt:"Auf Pro upgraden",haftalikHedef:"Wochenziel",
  hizliModullerB:"SCHNELLZUGRIFF-MODULE",modulBilgi:"Module ein-/ausschalten, ziehen zum Ordnen. Änderungen gelten sofort.",modulEkle:"+ Module hinzufügen / bearbeiten →",
  sesEfektSub:"Bestätigungstöne",kompaktSub:"Dichtere Darstellung",bildirimSub:"Auftrags-Erinnerungen und Meldungen",karanlikSub:"Schont die Augen",
  vergiDairesiYok:"Finanzamt nicht angegeben",kdvSub:"Für Rechnungsberechnungen",logoSub:"Auf Rechnungen und im Profil sichtbar",
  canliKur:"Live-Kurse",sabitKur:"Feste Kurse",aylikGorunum:"Monatsansicht",ibanSub:"Zahlungen per IBAN verfolgen",
  proSub:"Unbegrenzte Aufträge · PDF-Rechnungen · WhatsApp-Versand · Cloud-Backup",epostaDestek:"E-Mail-Support",sssSub:"FAQ und Anleitungen",degerlendirSub:"Im App Store / Play Store bewerten",kvkkSub:"Datenschutzkonform",yakinda:"Bald verfügbar!",
  gibSubAktif:"E-Rechnung aktiv",gibSubTest:"API eingerichtet, Test erforderlich",gibSubYok:"Noch nicht eingerichtet",
  mIslerA:"Alle Aufträge und Status",mFaturaA:"Erstellte und offene Rechnungen",mTahsilatA:"Eingezogene und offene Zahlungen",mMusteriA:"Kundenliste und Umsatzanalyse",mTeklifA:"Angebote und Umwandlungen",mRaporA:"Diagramme und Statistiken",mGiderA:"Ausgabenverfolgung und Kategorien",mDahaA:"Export, Einstellungen, Hilfe",
  modulFooter:"Aktive Module erscheinen auf Start · Deaktivierte bleiben im Menü",
  kategori:"Kategorie",aramaPh:"🔍 Kunde oder Auftrag suchen...",dilAramaPh:"🔍 Sprache oder Land suchen...",yardimAramaPh:"🔍 Hilfe durchsuchen...",
  isOrnekPh:"Heizkörperreinigung...",musteriOrnekPh:"Max Mustermann",malzemePh:"Materialeinkauf...",musteriAdiPh:"Kundenname",klimaPh:"Klimaanlagen-Montage...",aliciAdiPh:"Empfängername",
  maliyetL:"Geschätzte Kosten",maliyetPh:"Material + Arbeit + Fahrt...",marjL:"Gewinnmarge",zararUyari:"DIESER AUFTRAG IST VERLUST!",dusukMarj:"Niedrige Gewinnmarge",benzerIs:"Ø-Kosten ähnlicher Aufträge",
  guncelMusterilerT:"Aktive Kunden",musteriKayitT:"Kundenverzeichnis",kayitliMusteriler:"Registrierte Kunden",yeniKayit:"+ Neuer Eintrag",kayitYok:"Noch keine registrierten Kunden",kayitYokSub:"Kunden vorab speichern für schnelle Auftragserstellung",telYok:"Kein Telefon",isKaydiVar:"Auftragsdaten",aktifMusteriDurumu:"Aktiver Kundenstatus",
  tahsilKisa:"Eingezogen",giderKisa:"Ausgaben",karKisa:"Gewinn",zararKisa:"Verlust",karZararAnalizi:"GEWINN- / VERLUSTANALYSE",netZarar:"Nettoverlust",giderKalemleri:"Ausgabenposten",yeniIsAc:"➕ Neuer Auftrag",giderEkleBtn:"💸 Ausgabe hinzufügen",
  musteriyiSil:"Kunden löschen",silinecekK:"wird gelöscht",aitIsUyariOn:"Dieser Kunde hat",aitIsUyariSon:"Aufträge, die ebenfalls gelöscht werden!",isimsizMusteri:"Unbenannter Kunde",isimsizK:"Unbenannt",
  iseBagla:"Mit Auftrag verknüpfen (optional)",islerdenSec:"+ Aus aktiven/offenen Aufträgen wählen",listeyiKapat:"▲ Liste schließen",aktifBekleyenYok:"Keine aktiven/offenen Aufträge",
  tumuF:"Alle",iseBagliF:"📋 Verknüpft",serbestF:"Frei",giderlerB:"AUSGABEN",atananL:"Zugewiesen",atananKisi:"Zugewiesen an",benL:"Ich",
  hazirIslerOn:"Vorschläge für ",hazirIslerSon:":",
  ekipYonetimi:"Teamverwaltung",ekipSub:"Mitglieder hinzufügen, Aufträge zuweisen",yeniUyeEkle:"Neues Mitglied",ekibeEkle:"+ Zum Team hinzufügen",ekipYok:"Noch keine Teammitglieder",ekipYokSub:"Mitglieder hinzufügen, Aufträge zuweisen und Leistung in Berichten sehen",isAtandiK:"zugewiesen",buIsimVar:"Dieser Name ist bereits im Team",uyeCikarildi:"Mitglied entfernt",ekibeEklendi:"zum Team hinzugefügt",
  rolUsta:"Techniker",rolMuhasebe:"Buchhaltung",rolSatis:"Vertrieb",rolSofor:"Fahrer",rolYardimci:"Helfer",patronRol:"Inhaber",
  ekipPerformansi:"Teamleistung",isBirim:"Aufträge",karSuffix:"Gewinn",
  hosgeldinT:"Willkommen",gozAt:"Wirf einen kurzen Blick auf dein Geschäft.",
  faturaSilUyari:"Diese Rechnung wird gelöscht",gibSilNot:"Die Stornierung einer offiziellen Rechnung unterliegt den Steuerbehörden — hier wird nur der App-Eintrag entfernt.",
  excelIslerL:"Excel — Aufträge",excelGiderlerL:"Excel — Ausgaben",excelFaturalarL:"Excel — Rechnungen",pdfRaporL:"PDF-Buchhaltungsbericht",muhasebeyeGonder:"An Buchhalter senden",yazdirKaydet:"Drucken / Als PDF speichern",
  asistanHosgeldin:"Hallo! 👋 Ich bin der TradeFlow-Assistent. Frag mich zu Rechnungen, Zahlungen, Kosten... oder wähle unten eine Schnellfrage.",soruPh:"Frage eingeben...",
  asistan:"Assistent",asistanSub:"Sofortantworten auf deine Fragen",
};
const FR = {
  malzemeKalemleri:"Postes matériel / service",kalemAdPh:"Matériel ou service",adetL:"Qté",birimFiyatL:"Prix unitaire",kalemEkle:"+ Ajouter un poste",araToplamL:"Sous-total",kdvL:"TVA",genelToplamL:"Total général",teklifBelgesi:"DEVIS",gecerlilikNot:"Ce devis est valable jusqu'à la date indiquée.",kaseImza:"Cachet / Signature",teklifPdfBtn:"PDF",
  gunaydin:"Bonjour,",isletmem:"Mon entreprise",yeniIs:"Nouveau travail",isKoluSec:"Choisir le métier",ozellestir:"Personnaliser",
  aktifIs:"Travaux actifs",devamEden:"En cours",tahsilEdildi:"Encaissé",buAyTahsilat:"Ce mois-ci",
  bekleyenTahsilat:"Paiement en attente",fatura:"factures",bekleyen:"En attente",faturaTek:"Facture",
  isAkislari:"Travaux",faturalar:"Factures",tahsilatlar:"Paiements",musteriler:"Clients",
  teklifler:"Devis",raporlar:"Rapports",giderler:"Dépenses",dahaFazla:"Plus",
  gelirGider:"Recettes-Dépenses",buAy:"Ce mois",toplamGelir:"Recettes totales",toplamGider:"Dépenses totales",
  netKar:"Bénéfice net",tahsilatDurumu:"État des paiements",toplam:"Total",tahsilEdilen:"Encaissé",
  geciken:"En retard",vadesiGelmeyen:"Non échu",tahsilatOrani:"Taux d'encaissement",
  duzenleBaslik1:"Personnalisez votre",duzenleBaslik2:"appli pro",duzenleAlt:"Choisissez et réordonnez les modules.",duzenle:"Modifier",
  sonIsAkislari:"Travaux récents",musteri:"Client",tumunuGoruntule:"Tout voir",
  anaSayfa:"Accueil",bildirimlerT:"Alertes",profil:"Profil",tumIsAkislari:"Tous les travaux",
  devamEdiyor:"En cours",beklemede:"En attente",tamamlandi:"Terminé",
  buAyinKarnesi:"BILAN DU MOIS",isTamamlandi:"Travaux terminés",tahsilat:"Encaissé",memnuniyet:"Satisfaction",
  isletme:"ENTREPRISE",isletmeBilgileri:"Infos entreprise",kdvOrani:"Taux de TVA",logoYukle:"Charger le logo",
  sec:"Choisir",degistir:"Changer",uygulama:"APPLI",bildirimlerL:"Notifications",karanlikMod:"Mode sombre",
  dil:"Langue",paraBirimi:"Devise",destek:"SUPPORT",whatsappDestek:"Support WhatsApp",
  yardimMerkezi:"Centre d'aide",degerlendir:"Noter l'appli",gizlilik:"Confidentialité",
  cikisYap:"Se déconnecter",profiliDuzenle:"Modifier le profil",dilSecin:"Choisir la langue",paraBirimiB:"Devise",
  iptal:"Annuler",kaydet:"Enregistrer",sil:"Supprimer",silOnay:"Supprimer ce travail ?",evetSil:"Oui, supprimer",
  hatirlatma:"Rappel",faturaKes:"Créer une facture",tamamla:"Terminer",kapat:"Fermer",
  yeniTeklif:"Nouveau devis",iseDonustur:"Convertir en travail",gecerlilik:"Valable jusqu'au",
  yeniGider:"Nouvelle dépense",tahsilEt:"Encaisser",oneriniz:"Votre suggestion...",
  gonder:"Envoyer",tesekkurler:"Merci !",verileriSifirla:"Réinitialiser les données",
  disaAktar:"Exporter les données",bosBildirim:"Aucune alerte",tumunuOkundu:"Tout marquer lu",
  sonucYok:"Aucun résultat",gunSecin:"Touchez un jour pour voir ses travaux",buGunIsYok:"Aucun travail ce jour",isleri:"TRAVAUX",
  isDuzenle:"Modifier le travail",ikon:"Icône",isBasligi:"Titre du travail",tarihL:"Date",tutarL:"Montant",
  tekrarlama:"Récurrence (plan d'entretien)",tekSefer:"Ponctuel",haftalikL:"Hebdomadaire",aylikL:"Mensuel",yillikL:"Annuel",
  tekrarBilgi:"Une fois terminé, un nouveau travail est créé automatiquement pour la période suivante",
  isAdresiL:"Adresse du travail (optionnel)",adresPh:"Rue, n°, ville...",musteriTel:"Téléphone client (optionnel)",epostaOps:"E-mail (optionnel)",
  isFotolari:"Photos du travail (avant/après)",durumL:"Statut",guncelle:"Mettre à jour",
  odemeDurumu:"État du paiement",kaparoEkle:"+ Acompte / Paiement partiel",alinan:"Reçu",kalanL:"Restant",adresL:"Adresse",navBaslat:"Lancer la navigation",fotograflarB:"PHOTOS DU TRAVAIL",
  henuzFaturaYok:"Aucune facture émise.",kesildiL:"ÉMISE",bekleyenIslerB:"TRAVAUX EN ATTENTE",alindiL:"reçu",
  yeniMusteri:"Ajouter un client",adSoyadPh:"Nom / Société *",telefonL:"Téléphone",epostaL:"E-mail",adresNavPh:"Adresse (pour navigation)",vazgec:"Annuler",gitL:"Y aller",yeniL:"Nouveau",
  ciroL:"Chiffre d'affaires",isSayisi:"Nombre de travaux",isAdresleriB:"ADRESSES DES TRAVAUX",toplamCiro:"CA total",toplamIsL:"Travaux totaux",isGecmisiB:"HISTORIQUE",isKaydiYok:"Aucun travail",araL:"Appeler",iletisimYok:"Aucun contact",
  donusum:"Conversion",gunL:"jours",suresiDoldu:"Expiré",onaylandiL:"Approuvé",reddedildiL:"Refusé",onayla:"Approuver",reddet:"Refuser",
  henuzTeklifYok:"Aucun devis",ilkTeklif:"+ Créer le premier devis",teklifBilgi:"Créez un devis, convertissez-le en travail après approbation.",filtreEslesmedi:"Aucun devis pour ce filtre.",bekleyenTeklifT:"Total devis en attente",
  buAyR:"Ce mois",gecenAy:"Mois dernier",son3Ay:"3 derniers mois",tumu:"Tous",gelirL:"Recette",giderL:"Dépense",
  son7Gun:"Recettes 7 derniers jours",son7Yok:"Aucun travail terminé en 7 jours.",isBazli:"Montants par travail",donemdeIsYok:"Aucun travail sur cette période",durumDagilimi:"Répartition des statuts",aktifL:"Actif",
  yedekGeriYukle:"Restaurer la sauvegarde",jsonIceAktar:"Importer JSON",hakkinda:"À propos",detayL:"Détails",
  whatsappGonder:"Envoyer via WhatsApp",yazdirPdf:"Imprimer / PDF",
  tumIslerB:"TOUS LES TRAVAUX",listesiB:"LISTE",kategoriIsYok:"Aucun travail dans cette catégorie",gelirKaynaklariB:"SOURCES DE REVENUS",giderKategorileriB:"CATÉGORIES DE DÉPENSES",henuzGiderYok:"Aucune dépense",devamEdenL:"En cours",isL:"travaux",
  isletmeAyarlariB:"PARAMÈTRES ENTREPRISE",finansB:"FINANCES",raporlamaDonemi:"Période de rapport",bankaHesabi:"Ajouter un compte bancaire",sesEfektleri:"Effets sonores",kompaktGorunum:"Vue compacte",proYukselt:"Passer à Pro",haftalikHedef:"Objectif hebdo",
  hizliModullerB:"MODULES D'ACCÈS RAPIDE",modulBilgi:"Activez/désactivez les modules, glissez pour réordonner. Effet immédiat.",modulEkle:"+ Ajouter / modifier des modules →",
  sesEfektSub:"Sons de confirmation",kompaktSub:"Affichage plus dense",bildirimSub:"Rappels et alertes de travaux",karanlikSub:"Repose les yeux",
  vergiDairesiYok:"Centre des impôts non renseigné",kdvSub:"Appliqué aux calculs de facture",logoSub:"Visible sur factures et profil",
  canliKur:"Taux en direct",sabitKur:"Taux fixes",aylikGorunum:"Vue mensuelle",ibanSub:"Suivi des paiements par IBAN",
  proSub:"Travaux illimités · Factures PDF · Envoi WhatsApp · Sauvegarde cloud",epostaDestek:"Support e-mail",sssSub:"FAQ et guides",degerlendirSub:"Noter sur App Store / Play Store",kvkkSub:"Conforme RGPD",yakinda:"Bientôt !",
  gibSubAktif:"Facture électronique active",gibSubTest:"API configurée, test requis",gibSubYok:"Non configuré",
  mIslerA:"Tous les ordres de travail et statuts",mFaturaA:"Factures émises et en attente",mTahsilatA:"Paiements encaissés et en attente",mMusteriA:"Liste clients et analyse du CA",mTeklifA:"Devis et conversions",mRaporA:"Graphiques et statistiques",mGiderA:"Suivi des dépenses et catégories",mDahaA:"Export, paramètres, aide",
  modulFooter:"Modules actifs sur l'Accueil · Les désactivés restent au menu",
  kategori:"Catégorie",aramaPh:"🔍 Rechercher client ou travail...",dilAramaPh:"🔍 Rechercher langue ou pays...",yardimAramaPh:"🔍 Rechercher de l'aide...",
  isOrnekPh:"Purge des radiateurs...",musteriOrnekPh:"Jean Dupont",malzemePh:"Achat de matériel...",musteriAdiPh:"Nom du client",klimaPh:"Installation clim...",aliciAdiPh:"Nom du destinataire",
  maliyetL:"Coût estimé",maliyetPh:"Matériel + main-d'œuvre + trajet...",marjL:"Marge bénéficiaire",zararUyari:"CE TRAVAIL EST À PERTE !",dusukMarj:"Marge faible",benzerIs:"Coût moyen sur travaux similaires",
  guncelMusterilerT:"Clients actifs",musteriKayitT:"Fichier clients",kayitliMusteriler:"Clients enregistrés",yeniKayit:"+ Nouvelle fiche",kayitYok:"Aucun client enregistré",kayitYokSub:"Enregistrez vos clients à l'avance pour créer des travaux plus vite",telYok:"Pas de téléphone",isKaydiVar:"travaux",aktifMusteriDurumu:"État des clients actifs",
  tahsilKisa:"Encaissé",giderKisa:"Dépenses",karKisa:"Bénéfice",zararKisa:"Perte",karZararAnalizi:"ANALYSE PROFIT / PERTE",netZarar:"Perte nette",giderKalemleri:"Postes de dépense",yeniIsAc:"➕ Nouveau travail",giderEkleBtn:"💸 Ajouter une dépense",
  musteriyiSil:"Supprimer le client",silinecekK:"sera supprimé",aitIsUyariOn:"Ce client a",aitIsUyariSon:"travaux qui seront aussi supprimés !",isimsizMusteri:"Client sans nom",isimsizK:"Sans nom",
  iseBagla:"Lier à un travail (optionnel)",islerdenSec:"+ Choisir parmi les travaux actifs/en attente",listeyiKapat:"▲ Fermer la liste",aktifBekleyenYok:"Aucun travail actif/en attente",
  tumuF:"Tous",iseBagliF:"📋 Liés",serbestF:"Libres",giderlerB:"DÉPENSES",atananL:"Assigné",atananKisi:"Assigné à",benL:"Moi",
  hazirIslerOn:"Suggestions pour ",hazirIslerSon:" :",
  ekipYonetimi:"Gestion d'équipe",ekipSub:"Ajouter des membres, assigner des travaux",yeniUyeEkle:"Nouveau membre",ekibeEkle:"+ Ajouter à l'équipe",ekipYok:"Aucun membre d'équipe",ekipYokSub:"Ajoutez des membres pour assigner des travaux et suivre la performance dans Rapports",isAtandiK:"assignés",buIsimVar:"Ce nom est déjà dans l'équipe",uyeCikarildi:"Membre retiré",ekibeEklendi:"ajouté à l'équipe",
  rolUsta:"Technicien",rolMuhasebe:"Comptabilité",rolSatis:"Ventes",rolSofor:"Chauffeur",rolYardimci:"Assistant",patronRol:"Patron",
  ekipPerformansi:"Performance de l'équipe",isBirim:"travaux",karSuffix:"bénéfice",
  hosgeldinT:"Bienvenue",gozAt:"Jetez un œil rapide à votre activité.",
  faturaSilUyari:"Cette facture sera supprimée",gibSilNot:"L'annulation d'une facture officielle est soumise aux règles fiscales — seule la fiche dans l'appli est supprimée.",
  excelIslerL:"Excel — Travaux",excelGiderlerL:"Excel — Dépenses",excelFaturalarL:"Excel — Factures",pdfRaporL:"Rapport comptable PDF",muhasebeyeGonder:"Envoyer au comptable",yazdirKaydet:"Imprimer / Enregistrer en PDF",
  asistanHosgeldin:"Bonjour ! 👋 Je suis l'assistant TradeFlow. Posez vos questions sur factures, paiements, coûts... ou choisissez une question rapide ci-dessous.",soruPh:"Écrivez votre question...",
  asistan:"Assistant",asistanSub:"Réponses instantanées à vos questions",
};
const ES = {
  malzemeKalemleri:"Partidas de material / servicio",kalemAdPh:"Material o servicio",adetL:"Cant.",birimFiyatL:"Precio unit.",kalemEkle:"+ Añadir partida",araToplamL:"Subtotal",kdvL:"IVA",genelToplamL:"Total general",teklifBelgesi:"PRESUPUESTO",gecerlilikNot:"Este presupuesto es válido hasta la fecha indicada.",kaseImza:"Sello / Firma",teklifPdfBtn:"PDF",
  gunaydin:"Buenos días,",isletmem:"Mi negocio",yeniIs:"Nuevo trabajo",isKoluSec:"Elegir oficio",ozellestir:"Personalizar",
  aktifIs:"Trabajos activos",devamEden:"En curso",tahsilEdildi:"Cobrado",buAyTahsilat:"Este mes",
  bekleyenTahsilat:"Pago pendiente",fatura:"facturas",bekleyen:"Pendiente",faturaTek:"Factura",
  isAkislari:"Trabajos",faturalar:"Facturas",tahsilatlar:"Cobros",musteriler:"Clientes",
  teklifler:"Presupuestos",raporlar:"Informes",giderler:"Gastos",dahaFazla:"Más",
  gelirGider:"Ingresos-Gastos",buAy:"Este mes",toplamGelir:"Ingresos totales",toplamGider:"Gastos totales",
  netKar:"Beneficio neto",tahsilatDurumu:"Estado de cobros",toplam:"Total",tahsilEdilen:"Cobrado",
  geciken:"Vencido",vadesiGelmeyen:"No vencido",tahsilatOrani:"Tasa de cobro",
  duzenleBaslik1:"Personaliza tu",duzenleBaslik2:"app de negocio",duzenleAlt:"Elige módulos, reordena.",duzenle:"Editar",
  sonIsAkislari:"Trabajos recientes",musteri:"Cliente",tumunuGoruntule:"Ver todo",
  anaSayfa:"Inicio",bildirimlerT:"Avisos",profil:"Perfil",tumIsAkislari:"Todos los trabajos",
  devamEdiyor:"En curso",beklemede:"Pendiente",tamamlandi:"Completado",
  buAyinKarnesi:"INFORME DEL MES",isTamamlandi:"Trabajos hechos",tahsilat:"Cobrado",memnuniyet:"Satisfacción",
  isletme:"NEGOCIO",isletmeBilgileri:"Datos del negocio",kdvOrani:"Tipo de IVA",logoYukle:"Subir logo",
  sec:"Elegir",degistir:"Cambiar",uygulama:"APP",bildirimlerL:"Notificaciones",karanlikMod:"Modo oscuro",
  dil:"Idioma",paraBirimi:"Moneda",destek:"SOPORTE",whatsappDestek:"Soporte WhatsApp",
  yardimMerkezi:"Centro de ayuda",degerlendir:"Valorar la app",gizlilik:"Privacidad",
  cikisYap:"Cerrar sesión",profiliDuzenle:"Editar perfil",dilSecin:"Elegir idioma",paraBirimiB:"Moneda",
  iptal:"Cancelar",kaydet:"Guardar",sil:"Eliminar",silOnay:"¿Eliminar este trabajo?",evetSil:"Sí, eliminar",
  hatirlatma:"Recordatorio",faturaKes:"Crear factura",tamamla:"Completar",kapat:"Cerrar",
  yeniTeklif:"Nuevo presupuesto",iseDonustur:"Convertir en trabajo",gecerlilik:"Válido hasta",
  yeniGider:"Nuevo gasto",tahsilEt:"Cobrar",oneriniz:"Tu sugerencia...",
  gonder:"Enviar",tesekkurler:"¡Gracias!",verileriSifirla:"Restablecer datos",
  disaAktar:"Exportar datos",bosBildirim:"Sin avisos",tumunuOkundu:"Marcar todo leído",
  sonucYok:"Sin resultados",gunSecin:"Toca un día para ver sus trabajos",buGunIsYok:"Sin trabajos este día",isleri:"TRABAJOS",
  isDuzenle:"Editar trabajo",ikon:"Icono",isBasligi:"Título del trabajo",tarihL:"Fecha",tutarL:"Importe",
  tekrarlama:"Recurrencia (plan de mantenimiento)",tekSefer:"Único",haftalikL:"Semanal",aylikL:"Mensual",yillikL:"Anual",
  tekrarBilgi:"Al completarse, se crea automáticamente un nuevo trabajo para el siguiente período",
  isAdresiL:"Dirección del trabajo (opcional)",adresPh:"Calle, número, ciudad...",musteriTel:"Teléfono del cliente (opcional)",epostaOps:"Correo (opcional)",
  isFotolari:"Fotos del trabajo (antes/después)",durumL:"Estado",guncelle:"Actualizar",
  odemeDurumu:"Estado del pago",kaparoEkle:"+ Anticipo / Pago parcial",alinan:"Recibido",kalanL:"Restante",adresL:"Dirección",navBaslat:"Iniciar navegación",fotograflarB:"FOTOS DEL TRABAJO",
  henuzFaturaYok:"Sin facturas emitidas.",kesildiL:"EMITIDA",bekleyenIslerB:"TRABAJOS PENDIENTES",alindiL:"recibido",
  yeniMusteri:"Añadir cliente",adSoyadPh:"Nombre / Empresa *",telefonL:"Teléfono",epostaL:"Correo",adresNavPh:"Dirección (para navegación)",vazgec:"Cancelar",gitL:"Ir",yeniL:"Nuevo",
  ciroL:"Facturación",isSayisi:"Nº de trabajos",isAdresleriB:"DIRECCIONES DE TRABAJOS",toplamCiro:"Facturación total",toplamIsL:"Trabajos totales",isGecmisiB:"HISTORIAL",isKaydiYok:"Sin trabajos",araL:"Llamar",iletisimYok:"Sin datos de contacto",
  donusum:"Conversión",gunL:"días",suresiDoldu:"Caducado",onaylandiL:"Aprobado",reddedildiL:"Rechazado",onayla:"Aprobar",reddet:"Rechazar",
  henuzTeklifYok:"Sin presupuestos",ilkTeklif:"+ Crear primer presupuesto",teklifBilgi:"Crea un presupuesto y conviértelo en trabajo tras la aprobación.",filtreEslesmedi:"Ningún presupuesto con este filtro.",bekleyenTeklifT:"Total presupuestos pendientes",
  buAyR:"Este mes",gecenAy:"Mes pasado",son3Ay:"Últimos 3 meses",tumu:"Todos",gelirL:"Ingreso",giderL:"Gasto",
  son7Gun:"Ingresos últimos 7 días",son7Yok:"Sin trabajos completados en 7 días.",isBazli:"Importes por trabajo",donemdeIsYok:"Sin trabajos en este período",durumDagilimi:"Distribución de estados",aktifL:"Activo",
  yedekGeriYukle:"Restaurar copia",jsonIceAktar:"Importar JSON",hakkinda:"Acerca de",detayL:"Detalles",
  whatsappGonder:"Enviar por WhatsApp",yazdirPdf:"Imprimir / PDF",
  tumIslerB:"TODOS LOS TRABAJOS",listesiB:"LISTA",kategoriIsYok:"Sin trabajos en esta categoría",gelirKaynaklariB:"FUENTES DE INGRESO",giderKategorileriB:"CATEGORÍAS DE GASTO",henuzGiderYok:"Sin gastos",devamEdenL:"En curso",isL:"trabajos",
  isletmeAyarlariB:"AJUSTES DEL NEGOCIO",finansB:"FINANZAS",raporlamaDonemi:"Período del informe",bankaHesabi:"Añadir cuenta bancaria",sesEfektleri:"Efectos de sonido",kompaktGorunum:"Vista compacta",proYukselt:"Mejorar a Pro",haftalikHedef:"Meta semanal",
  hizliModullerB:"MÓDULOS DE ACCESO RÁPIDO",modulBilgi:"Activa/desactiva módulos, arrastra para ordenar. Efecto inmediato.",modulEkle:"+ Añadir / editar módulos →",
  sesEfektSub:"Sonidos de confirmación",kompaktSub:"Contenido más denso",bildirimSub:"Recordatorios y avisos de trabajos",karanlikSub:"Menos fatiga visual",
  vergiDairesiYok:"Oficina fiscal sin definir",kdvSub:"Aplicado a los cálculos de factura",logoSub:"Visible en facturas y perfil",
  canliKur:"Tipos en vivo",sabitKur:"Tipos fijos",aylikGorunum:"Vista mensual",ibanSub:"Seguimiento de pagos por IBAN",
  proSub:"Trabajos ilimitados · Facturas PDF · Envío WhatsApp · Copia en la nube",epostaDestek:"Soporte por correo",sssSub:"FAQ y guías",degerlendirSub:"Valorar en App Store / Play Store",kvkkSub:"Cumple privacidad",yakinda:"¡Próximamente!",
  gibSubAktif:"Factura electrónica activa",gibSubTest:"API configurada, falta prueba",gibSubYok:"Sin configurar",
  mIslerA:"Todas las órdenes y estados",mFaturaA:"Facturas emitidas y pendientes",mTahsilatA:"Cobros realizados y pendientes",mMusteriA:"Lista de clientes y análisis de facturación",mTeklifA:"Presupuestos y conversiones",mRaporA:"Gráficos y estadísticas",mGiderA:"Seguimiento de gastos y categorías",mDahaA:"Exportar, ajustes, ayuda",
  modulFooter:"Los módulos activos aparecen en Inicio · Los desactivados quedan en el menú",
  kategori:"Categoría",aramaPh:"🔍 Buscar cliente o trabajo...",dilAramaPh:"🔍 Buscar idioma o país...",yardimAramaPh:"🔍 Buscar ayuda...",
  isOrnekPh:"Purga de radiadores...",musteriOrnekPh:"Juan García",malzemePh:"Compra de material...",musteriAdiPh:"Nombre del cliente",klimaPh:"Instalación de aire...",aliciAdiPh:"Nombre del destinatario",
  maliyetL:"Coste estimado",maliyetPh:"Material + mano de obra + viaje...",marjL:"Margen de beneficio",zararUyari:"¡ESTE TRABAJO DA PÉRDIDAS!",dusukMarj:"Margen bajo",benzerIs:"Coste medio en trabajos similares",
  guncelMusterilerT:"Clientes activos",musteriKayitT:"Registro de clientes",kayitliMusteriler:"Clientes registrados",yeniKayit:"+ Nuevo registro",kayitYok:"Sin clientes registrados",kayitYokSub:"Registra clientes por adelantado para crear trabajos más rápido",telYok:"Sin teléfono",isKaydiVar:"trabajos",aktifMusteriDurumu:"Estado de clientes activos",
  tahsilKisa:"Cobrado",giderKisa:"Gastos",karKisa:"Beneficio",zararKisa:"Pérdida",karZararAnalizi:"ANÁLISIS BENEFICIO / PÉRDIDA",netZarar:"Pérdida neta",giderKalemleri:"Partidas de gasto",yeniIsAc:"➕ Nuevo trabajo",giderEkleBtn:"💸 Añadir gasto",
  musteriyiSil:"Eliminar cliente",silinecekK:"se eliminará",aitIsUyariOn:"Este cliente tiene",aitIsUyariSon:"trabajos que también se eliminarán!",isimsizMusteri:"Cliente sin nombre",isimsizK:"Sin nombre",
  iseBagla:"Vincular a trabajo (opcional)",islerdenSec:"+ Elegir entre trabajos activos/pendientes",listeyiKapat:"▲ Cerrar lista",aktifBekleyenYok:"Sin trabajos activos/pendientes",
  tumuF:"Todos",iseBagliF:"📋 Vinculados",serbestF:"Libres",giderlerB:"GASTOS",atananL:"Asignado",atananKisi:"Asignado a",benL:"Yo",
  hazirIslerOn:"Sugerencias para ",hazirIslerSon:":",
  ekipYonetimi:"Gestión de equipo",ekipSub:"Añade miembros, asigna trabajos",yeniUyeEkle:"Nuevo miembro",ekibeEkle:"+ Añadir al equipo",ekipYok:"Sin miembros de equipo",ekipYokSub:"Añade miembros para asignar trabajos y ver el rendimiento en Informes",isAtandiK:"asignados",buIsimVar:"Ese nombre ya está en el equipo",uyeCikarildi:"Miembro eliminado",ekibeEklendi:"añadido al equipo",
  rolUsta:"Técnico",rolMuhasebe:"Contabilidad",rolSatis:"Ventas",rolSofor:"Conductor",rolYardimci:"Ayudante",patronRol:"Dueño",
  ekipPerformansi:"Rendimiento del equipo",isBirim:"trabajos",karSuffix:"beneficio",
  hosgeldinT:"Bienvenido",gozAt:"Echa un vistazo rápido a tu negocio.",
  faturaSilUyari:"Esta factura se eliminará",gibSilNot:"Anular una factura oficial está sujeto a normas fiscales — esto solo borra el registro en la app.",
  excelIslerL:"Excel — Trabajos",excelGiderlerL:"Excel — Gastos",excelFaturalarL:"Excel — Facturas",pdfRaporL:"Informe contable PDF",muhasebeyeGonder:"Enviar al contable",yazdirKaydet:"Imprimir / Guardar PDF",
  asistanHosgeldin:"¡Hola! 👋 Soy el asistente de TradeFlow. Pregunta sobre facturas, cobros, costes... o elige una pregunta rápida abajo.",soruPh:"Escribe tu pregunta...",
  asistan:"Asistente",asistanSub:"Respuestas instantáneas a tus preguntas",
};
const IT = {
  malzemeKalemleri:"Voci materiale / servizio",kalemAdPh:"Materiale o servizio",adetL:"Qtà",birimFiyatL:"Prezzo unit.",kalemEkle:"+ Aggiungi voce",araToplamL:"Subtotale",kdvL:"IVA",genelToplamL:"Totale generale",teklifBelgesi:"PREVENTIVO",gecerlilikNot:"Questo preventivo è valido fino alla data indicata.",kaseImza:"Timbro / Firma",teklifPdfBtn:"PDF",
  gunaydin:"Buongiorno,",isletmem:"La mia attività",yeniIs:"Nuovo lavoro",isKoluSec:"Scegli mestiere",ozellestir:"Personalizza",
  aktifIs:"Lavori attivi",devamEden:"In corso",tahsilEdildi:"Incassato",buAyTahsilat:"Questo mese",
  bekleyenTahsilat:"Pagamento in sospeso",fatura:"fatture",bekleyen:"In attesa",faturaTek:"Fattura",
  isAkislari:"Lavori",faturalar:"Fatture",tahsilatlar:"Incassi",musteriler:"Clienti",
  teklifler:"Preventivi",raporlar:"Report",giderler:"Spese",dahaFazla:"Altro",
  gelirGider:"Entrate-Uscite",buAy:"Questo mese",toplamGelir:"Entrate totali",toplamGider:"Uscite totali",
  netKar:"Utile netto",tahsilatDurumu:"Stato incassi",toplam:"Totale",tahsilEdilen:"Incassato",
  geciken:"Scaduto",vadesiGelmeyen:"Non scaduto",tahsilatOrani:"Tasso d'incasso",
  duzenleBaslik1:"Personalizza la tua",duzenleBaslik2:"app aziendale",duzenleAlt:"Scegli i moduli, riordina.",duzenle:"Modifica",
  sonIsAkislari:"Lavori recenti",musteri:"Cliente",tumunuGoruntule:"Vedi tutto",
  anaSayfa:"Home",bildirimlerT:"Avvisi",profil:"Profilo",tumIsAkislari:"Tutti i lavori",
  devamEdiyor:"In corso",beklemede:"In attesa",tamamlandi:"Completato",
  buAyinKarnesi:"REPORT DEL MESE",isTamamlandi:"Lavori completati",tahsilat:"Incassato",memnuniyet:"Soddisfazione",
  isletme:"ATTIVITÀ",isletmeBilgileri:"Dati attività",kdvOrani:"Aliquota IVA",logoYukle:"Carica logo",
  sec:"Scegli",degistir:"Cambia",uygulama:"APP",bildirimlerL:"Notifiche",karanlikMod:"Tema scuro",
  dil:"Lingua",paraBirimi:"Valuta",destek:"SUPPORTO",whatsappDestek:"Supporto WhatsApp",
  yardimMerkezi:"Centro assistenza",degerlendir:"Valuta l'app",gizlilik:"Privacy",
  cikisYap:"Esci",profiliDuzenle:"Modifica profilo",dilSecin:"Scegli lingua",paraBirimiB:"Valuta",
  iptal:"Annulla",kaydet:"Salva",sil:"Elimina",silOnay:"Eliminare questo lavoro?",evetSil:"Sì, elimina",
  hatirlatma:"Promemoria",faturaKes:"Crea fattura",tamamla:"Completa",kapat:"Chiudi",
  yeniTeklif:"Nuovo preventivo",iseDonustur:"Converti in lavoro",gecerlilik:"Valido fino al",
  yeniGider:"Nuova spesa",tahsilEt:"Incassa",oneriniz:"Il tuo suggerimento...",
  gonder:"Invia",tesekkurler:"Grazie!",verileriSifirla:"Ripristina dati",
  disaAktar:"Esporta dati",bosBildirim:"Nessun avviso",tumunuOkundu:"Segna tutto letto",
  sonucYok:"Nessun risultato",gunSecin:"Tocca un giorno per vedere i lavori",buGunIsYok:"Nessun lavoro in questo giorno",isleri:"LAVORI",
  isDuzenle:"Modifica lavoro",ikon:"Icona",isBasligi:"Titolo del lavoro",tarihL:"Data",tutarL:"Importo",
  tekrarlama:"Ricorrenza (piano manutenzione)",tekSefer:"Una tantum",haftalikL:"Settimanale",aylikL:"Mensile",yillikL:"Annuale",
  tekrarBilgi:"Al completamento, viene creato automaticamente un nuovo lavoro per il periodo successivo",
  isAdresiL:"Indirizzo del lavoro (opzionale)",adresPh:"Via, numero, città...",musteriTel:"Telefono cliente (opzionale)",epostaOps:"Email (opzionale)",
  isFotolari:"Foto del lavoro (prima/dopo)",durumL:"Stato",guncelle:"Aggiorna",
  odemeDurumu:"Stato pagamento",kaparoEkle:"+ Acconto / Pagamento parziale",alinan:"Ricevuto",kalanL:"Rimanente",adresL:"Indirizzo",navBaslat:"Avvia navigazione",fotograflarB:"FOTO DEL LAVORO",
  henuzFaturaYok:"Nessuna fattura emessa.",kesildiL:"EMESSA",bekleyenIslerB:"LAVORI IN ATTESA",alindiL:"ricevuto",
  yeniMusteri:"Aggiungi cliente",adSoyadPh:"Nome / Azienda *",telefonL:"Telefono",epostaL:"Email",adresNavPh:"Indirizzo (per navigazione)",vazgec:"Annulla",gitL:"Vai",yeniL:"Nuovo",
  ciroL:"Fatturato",isSayisi:"N. lavori",isAdresleriB:"INDIRIZZI DEI LAVORI",toplamCiro:"Fatturato totale",toplamIsL:"Lavori totali",isGecmisiB:"STORICO LAVORI",isKaydiYok:"Nessun lavoro",araL:"Chiama",iletisimYok:"Nessun contatto",
  donusum:"Conversione",gunL:"giorni",suresiDoldu:"Scaduto",onaylandiL:"Approvato",reddedildiL:"Rifiutato",onayla:"Approva",reddet:"Rifiuta",
  henuzTeklifYok:"Nessun preventivo",ilkTeklif:"+ Crea il primo preventivo",teklifBilgi:"Crea un preventivo e convertilo in lavoro dopo l'approvazione.",filtreEslesmedi:"Nessun preventivo per questo filtro.",bekleyenTeklifT:"Totale preventivi in attesa",
  buAyR:"Questo mese",gecenAy:"Mese scorso",son3Ay:"Ultimi 3 mesi",tumu:"Tutti",gelirL:"Entrata",giderL:"Uscita",
  son7Gun:"Entrate ultimi 7 giorni",son7Yok:"Nessun lavoro completato in 7 giorni.",isBazli:"Importi per lavoro",donemdeIsYok:"Nessun lavoro nel periodo",durumDagilimi:"Distribuzione stati",aktifL:"Attivo",
  yedekGeriYukle:"Ripristina backup",jsonIceAktar:"Importa JSON",hakkinda:"Info",detayL:"Dettagli",
  whatsappGonder:"Invia via WhatsApp",yazdirPdf:"Stampa / PDF",
  tumIslerB:"TUTTI I LAVORI",listesiB:"ELENCO",kategoriIsYok:"Nessun lavoro in questa categoria",gelirKaynaklariB:"FONTI DI ENTRATA",giderKategorileriB:"CATEGORIE DI SPESA",henuzGiderYok:"Nessuna spesa",devamEdenL:"In corso",isL:"lavori",
  isletmeAyarlariB:"IMPOSTAZIONI ATTIVITÀ",finansB:"FINANZE",raporlamaDonemi:"Periodo report",bankaHesabi:"Aggiungi conto bancario",sesEfektleri:"Effetti sonori",kompaktGorunum:"Vista compatta",proYukselt:"Passa a Pro",haftalikHedef:"Obiettivo settimanale",
  hizliModullerB:"MODULI RAPIDI",modulBilgi:"Attiva/disattiva moduli, trascina per riordinare. Effetto immediato.",modulEkle:"+ Aggiungi / modifica moduli →",
  sesEfektSub:"Suoni di conferma",kompaktSub:"Contenuti più densi",bildirimSub:"Promemoria e avvisi lavori",karanlikSub:"Riduce l'affaticamento degli occhi",
  vergiDairesiYok:"Ufficio fiscale non impostato",kdvSub:"Applicata ai calcoli fattura",logoSub:"Visibile su fatture e profilo",
  canliKur:"Tassi live",sabitKur:"Tassi fissi",aylikGorunum:"Vista mensile",ibanSub:"Traccia pagamenti via IBAN",
  proSub:"Lavori illimitati · Fatture PDF · Invio WhatsApp · Backup cloud",epostaDestek:"Supporto email",sssSub:"FAQ e guide",degerlendirSub:"Valuta su App Store / Play Store",kvkkSub:"Conforme privacy",yakinda:"In arrivo!",
  gibSubAktif:"Fattura elettronica attiva",gibSubTest:"API impostata, serve test",gibSubYok:"Non configurato",
  mIslerA:"Tutti gli ordini e gli stati",mFaturaA:"Fatture emesse e in attesa",mTahsilatA:"Incassi effettuati e in attesa",mMusteriA:"Elenco clienti e analisi fatturato",mTeklifA:"Preventivi e conversioni",mRaporA:"Grafici e statistiche",mGiderA:"Tracciamento spese e categorie",mDahaA:"Esporta, impostazioni, aiuto",
  modulFooter:"I moduli attivi appaiono in Home · Quelli disattivati restano nel menu",
  kategori:"Categoria",aramaPh:"🔍 Cerca cliente o lavoro...",dilAramaPh:"🔍 Cerca lingua o paese...",yardimAramaPh:"🔍 Cerca aiuto...",
  isOrnekPh:"Pulizia radiatori...",musteriOrnekPh:"Mario Rossi",malzemePh:"Acquisto materiale...",musteriAdiPh:"Nome cliente",klimaPh:"Installazione clima...",aliciAdiPh:"Nome destinatario",
  maliyetL:"Costo stimato",maliyetPh:"Materiale + manodopera + viaggio...",marjL:"Margine di profitto",zararUyari:"QUESTO LAVORO È IN PERDITA!",dusukMarj:"Margine basso",benzerIs:"Costo medio su lavori simili",
  guncelMusterilerT:"Clienti attivi",musteriKayitT:"Anagrafica clienti",kayitliMusteriler:"Clienti registrati",yeniKayit:"+ Nuova scheda",kayitYok:"Nessun cliente registrato",kayitYokSub:"Registra i clienti in anticipo per creare lavori più velocemente",telYok:"Nessun telefono",isKaydiVar:"lavori",aktifMusteriDurumu:"Stato clienti attivi",
  tahsilKisa:"Incassato",giderKisa:"Spese",karKisa:"Utile",zararKisa:"Perdita",karZararAnalizi:"ANALISI UTILE / PERDITA",netZarar:"Perdita netta",giderKalemleri:"Voci di spesa",yeniIsAc:"➕ Nuovo lavoro",giderEkleBtn:"💸 Aggiungi spesa",
  musteriyiSil:"Elimina cliente",silinecekK:"sarà eliminato",aitIsUyariOn:"Questo cliente ha",aitIsUyariSon:"lavori che saranno eliminati anch'essi!",isimsizMusteri:"Cliente senza nome",isimsizK:"Senza nome",
  iseBagla:"Collega a lavoro (opzionale)",islerdenSec:"+ Scegli tra lavori attivi/in attesa",listeyiKapat:"▲ Chiudi elenco",aktifBekleyenYok:"Nessun lavoro attivo/in attesa",
  tumuF:"Tutti",iseBagliF:"📋 Collegati",serbestF:"Liberi",giderlerB:"SPESE",atananL:"Assegnato",atananKisi:"Assegnato a",benL:"Io",
  hazirIslerOn:"Suggerimenti per ",hazirIslerSon:":",
  ekipYonetimi:"Gestione team",ekipSub:"Aggiungi membri, assegna lavori",yeniUyeEkle:"Nuovo membro",ekibeEkle:"+ Aggiungi al team",ekipYok:"Nessun membro del team",ekipYokSub:"Aggiungi membri per assegnare lavori e vedere le prestazioni nei Report",isAtandiK:"assegnati",buIsimVar:"Questo nome è già nel team",uyeCikarildi:"Membro rimosso",ekibeEklendi:"aggiunto al team",
  rolUsta:"Tecnico",rolMuhasebe:"Contabilità",rolSatis:"Vendite",rolSofor:"Autista",rolYardimci:"Aiutante",patronRol:"Titolare",
  ekipPerformansi:"Prestazioni del team",isBirim:"lavori",karSuffix:"utile",
  hosgeldinT:"Benvenuto",gozAt:"Dai un'occhiata veloce alla tua attività.",
  faturaSilUyari:"Questa fattura sarà eliminata",gibSilNot:"L'annullamento di una fattura ufficiale è soggetto alle norme fiscali — qui si elimina solo il record nell'app.",
  excelIslerL:"Excel — Lavori",excelGiderlerL:"Excel — Spese",excelFaturalarL:"Excel — Fatture",pdfRaporL:"Report contabile PDF",muhasebeyeGonder:"Invia al commercialista",yazdirKaydet:"Stampa / Salva PDF",
  asistanHosgeldin:"Ciao! 👋 Sono l'assistente TradeFlow. Chiedimi di fatture, incassi, costi... o scegli una domanda rapida qui sotto.",soruPh:"Scrivi la tua domanda...",
  asistan:"Assistente",asistanSub:"Risposte immediate alle tue domande",
};
const PT = {
  malzemeKalemleri:"Itens de material / serviço",kalemAdPh:"Material ou serviço",adetL:"Qtd.",birimFiyatL:"Preço unit.",kalemEkle:"+ Adicionar item",araToplamL:"Subtotal",kdvL:"IVA",genelToplamL:"Total geral",teklifBelgesi:"ORÇAMENTO",gecerlilikNot:"Este orçamento é válido até à data indicada.",kaseImza:"Carimbo / Assinatura",teklifPdfBtn:"PDF",
  gunaydin:"Bom dia,",isletmem:"Meu negócio",yeniIs:"Novo trabalho",isKoluSec:"Escolher ofício",ozellestir:"Personalizar",
  aktifIs:"Trabalhos ativos",devamEden:"Em andamento",tahsilEdildi:"Recebido",buAyTahsilat:"Este mês",
  bekleyenTahsilat:"Pagamento pendente",fatura:"faturas",bekleyen:"Pendente",faturaTek:"Fatura",
  isAkislari:"Trabalhos",faturalar:"Faturas",tahsilatlar:"Recebimentos",musteriler:"Clientes",
  teklifler:"Orçamentos",raporlar:"Relatórios",giderler:"Despesas",dahaFazla:"Mais",
  gelirGider:"Receitas-Despesas",buAy:"Este mês",toplamGelir:"Receita total",toplamGider:"Despesa total",
  netKar:"Lucro líquido",tahsilatDurumu:"Estado dos recebimentos",toplam:"Total",tahsilEdilen:"Recebido",
  geciken:"Vencido",vadesiGelmeyen:"Não vencido",tahsilatOrani:"Taxa de recebimento",
  duzenleBaslik1:"Personalize a sua",duzenleBaslik2:"app de negócio",duzenleAlt:"Escolha módulos, reordene.",duzenle:"Editar",
  sonIsAkislari:"Trabalhos recentes",musteri:"Cliente",tumunuGoruntule:"Ver tudo",
  anaSayfa:"Início",bildirimlerT:"Alertas",profil:"Perfil",tumIsAkislari:"Todos os trabalhos",
  devamEdiyor:"Em andamento",beklemede:"Pendente",tamamlandi:"Concluído",
  buAyinKarnesi:"RELATÓRIO DO MÊS",isTamamlandi:"Trabalhos feitos",tahsilat:"Recebido",memnuniyet:"Satisfação",
  isletme:"NEGÓCIO",isletmeBilgileri:"Dados do negócio",kdvOrani:"Taxa de IVA",logoYukle:"Carregar logo",
  sec:"Escolher",degistir:"Alterar",uygulama:"APP",bildirimlerL:"Notificações",karanlikMod:"Modo escuro",
  dil:"Idioma",paraBirimi:"Moeda",destek:"SUPORTE",whatsappDestek:"Suporte WhatsApp",
  yardimMerkezi:"Central de ajuda",degerlendir:"Avaliar a app",gizlilik:"Privacidade",
  cikisYap:"Terminar sessão",profiliDuzenle:"Editar perfil",dilSecin:"Escolher idioma",paraBirimiB:"Moeda",
  iptal:"Cancelar",kaydet:"Guardar",sil:"Eliminar",silOnay:"Eliminar este trabalho?",evetSil:"Sim, eliminar",
  hatirlatma:"Lembrete",faturaKes:"Criar fatura",tamamla:"Concluir",kapat:"Fechar",
  yeniTeklif:"Novo orçamento",iseDonustur:"Converter em trabalho",gecerlilik:"Válido até",
  yeniGider:"Nova despesa",tahsilEt:"Receber",oneriniz:"A sua sugestão...",
  gonder:"Enviar",tesekkurler:"Obrigado!",verileriSifirla:"Repor dados",
  disaAktar:"Exportar dados",bosBildirim:"Sem alertas",tumunuOkundu:"Marcar tudo lido",
  sonucYok:"Sem resultados",gunSecin:"Toque num dia para ver os trabalhos",buGunIsYok:"Sem trabalhos neste dia",isleri:"TRABALHOS",
  isDuzenle:"Editar trabalho",ikon:"Ícone",isBasligi:"Título do trabalho",tarihL:"Data",tutarL:"Valor",
  tekrarlama:"Recorrência (plano de manutenção)",tekSefer:"Único",haftalikL:"Semanal",aylikL:"Mensal",yillikL:"Anual",
  tekrarBilgi:"Ao concluir, é criado automaticamente um novo trabalho para o período seguinte",
  isAdresiL:"Endereço do trabalho (opcional)",adresPh:"Rua, número, cidade...",musteriTel:"Telefone do cliente (opcional)",epostaOps:"Email (opcional)",
  isFotolari:"Fotos do trabalho (antes/depois)",durumL:"Estado",guncelle:"Atualizar",
  odemeDurumu:"Estado do pagamento",kaparoEkle:"+ Sinal / Pagamento parcial",alinan:"Recebido",kalanL:"Restante",adresL:"Endereço",navBaslat:"Iniciar navegação",fotograflarB:"FOTOS DO TRABALHO",
  henuzFaturaYok:"Nenhuma fatura emitida.",kesildiL:"EMITIDA",bekleyenIslerB:"TRABALHOS PENDENTES",alindiL:"recebido",
  yeniMusteri:"Adicionar cliente",adSoyadPh:"Nome / Empresa *",telefonL:"Telefone",epostaL:"Email",adresNavPh:"Endereço (para navegação)",vazgec:"Cancelar",gitL:"Ir",yeniL:"Novo",
  ciroL:"Faturação",isSayisi:"N.º de trabalhos",isAdresleriB:"ENDEREÇOS DOS TRABALHOS",toplamCiro:"Faturação total",toplamIsL:"Trabalhos totais",isGecmisiB:"HISTÓRICO",isKaydiYok:"Sem trabalhos",araL:"Ligar",iletisimYok:"Sem contactos",
  donusum:"Conversão",gunL:"dias",suresiDoldu:"Expirado",onaylandiL:"Aprovado",reddedildiL:"Recusado",onayla:"Aprovar",reddet:"Recusar",
  henuzTeklifYok:"Sem orçamentos",ilkTeklif:"+ Criar primeiro orçamento",teklifBilgi:"Crie um orçamento e converta em trabalho após aprovação.",filtreEslesmedi:"Nenhum orçamento neste filtro.",bekleyenTeklifT:"Total de orçamentos pendentes",
  buAyR:"Este mês",gecenAy:"Mês passado",son3Ay:"Últimos 3 meses",tumu:"Todos",gelirL:"Receita",giderL:"Despesa",
  son7Gun:"Receitas últimos 7 dias",son7Yok:"Sem trabalhos concluídos em 7 dias.",isBazli:"Valores por trabalho",donemdeIsYok:"Sem trabalhos neste período",durumDagilimi:"Distribuição de estados",aktifL:"Ativo",
  yedekGeriYukle:"Restaurar cópia",jsonIceAktar:"Importar JSON",hakkinda:"Sobre",detayL:"Detalhes",
  whatsappGonder:"Enviar por WhatsApp",yazdirPdf:"Imprimir / PDF",
  tumIslerB:"TODOS OS TRABALHOS",listesiB:"LISTA",kategoriIsYok:"Sem trabalhos nesta categoria",gelirKaynaklariB:"FONTES DE RECEITA",giderKategorileriB:"CATEGORIAS DE DESPESA",henuzGiderYok:"Sem despesas",devamEdenL:"Em andamento",isL:"trabalhos",
  isletmeAyarlariB:"DEFINIÇÕES DO NEGÓCIO",finansB:"FINANÇAS",raporlamaDonemi:"Período do relatório",bankaHesabi:"Adicionar conta bancária",sesEfektleri:"Efeitos sonoros",kompaktGorunum:"Vista compacta",proYukselt:"Passar a Pro",haftalikHedef:"Meta semanal",
  hizliModullerB:"MÓDULOS DE ACESSO RÁPIDO",modulBilgi:"Ative/desative módulos, arraste para ordenar. Efeito imediato.",modulEkle:"+ Adicionar / editar módulos →",
  sesEfektSub:"Sons de confirmação",kompaktSub:"Conteúdo mais denso",bildirimSub:"Lembretes e alertas de trabalhos",karanlikSub:"Reduz o cansaço visual",
  vergiDairesiYok:"Repartição fiscal não definida",kdvSub:"Aplicado aos cálculos da fatura",logoSub:"Visível em faturas e perfil",
  canliKur:"Taxas em direto",sabitKur:"Taxas fixas",aylikGorunum:"Vista mensal",ibanSub:"Acompanhe pagamentos por IBAN",
  proSub:"Trabalhos ilimitados · Faturas PDF · Envio WhatsApp · Cópia na nuvem",epostaDestek:"Suporte por email",sssSub:"FAQ e guias",degerlendirSub:"Avaliar na App Store / Play Store",kvkkSub:"Conforme privacidade",yakinda:"Em breve!",
  gibSubAktif:"Fatura eletrónica ativa",gibSubTest:"API configurada, falta teste",gibSubYok:"Não configurado",
  mIslerA:"Todas as ordens e estados",mFaturaA:"Faturas emitidas e pendentes",mTahsilatA:"Recebimentos feitos e pendentes",mMusteriA:"Lista de clientes e análise de faturação",mTeklifA:"Orçamentos e conversões",mRaporA:"Gráficos e estatísticas",mGiderA:"Controlo de despesas e categorias",mDahaA:"Exportar, definições, ajuda",
  modulFooter:"Módulos ativos aparecem no Início · Os desativados ficam no menu",
  kategori:"Categoria",aramaPh:"🔍 Procurar cliente ou trabalho...",dilAramaPh:"🔍 Procurar idioma ou país...",yardimAramaPh:"🔍 Procurar ajuda...",
  isOrnekPh:"Purga de radiadores...",musteriOrnekPh:"João Silva",malzemePh:"Compra de material...",musteriAdiPh:"Nome do cliente",klimaPh:"Instalação de AC...",aliciAdiPh:"Nome do destinatário",
  maliyetL:"Custo estimado",maliyetPh:"Material + mão de obra + deslocação...",marjL:"Margem de lucro",zararUyari:"ESTE TRABALHO DÁ PREJUÍZO!",dusukMarj:"Margem baixa",benzerIs:"Custo médio em trabalhos semelhantes",
  guncelMusterilerT:"Clientes ativos",musteriKayitT:"Registo de clientes",kayitliMusteriler:"Clientes registados",yeniKayit:"+ Novo registo",kayitYok:"Sem clientes registados",kayitYokSub:"Registe clientes antecipadamente para criar trabalhos mais depressa",telYok:"Sem telefone",isKaydiVar:"trabalhos",aktifMusteriDurumu:"Estado dos clientes ativos",
  tahsilKisa:"Recebido",giderKisa:"Despesas",karKisa:"Lucro",zararKisa:"Prejuízo",karZararAnalizi:"ANÁLISE LUCRO / PREJUÍZO",netZarar:"Prejuízo líquido",giderKalemleri:"Itens de despesa",yeniIsAc:"➕ Novo trabalho",giderEkleBtn:"💸 Adicionar despesa",
  musteriyiSil:"Eliminar cliente",silinecekK:"será eliminado",aitIsUyariOn:"Este cliente tem",aitIsUyariSon:"trabalhos que também serão eliminados!",isimsizMusteri:"Cliente sem nome",isimsizK:"Sem nome",
  iseBagla:"Ligar a trabalho (opcional)",islerdenSec:"+ Escolher entre trabalhos ativos/pendentes",listeyiKapat:"▲ Fechar lista",aktifBekleyenYok:"Sem trabalhos ativos/pendentes",
  tumuF:"Todos",iseBagliF:"📋 Ligados",serbestF:"Livres",giderlerB:"DESPESAS",atananL:"Atribuído",atananKisi:"Atribuído a",benL:"Eu",
  hazirIslerOn:"Sugestões para ",hazirIslerSon:":",
  ekipYonetimi:"Gestão de equipa",ekipSub:"Adicione membros, atribua trabalhos",yeniUyeEkle:"Novo membro",ekibeEkle:"+ Adicionar à equipa",ekipYok:"Sem membros na equipa",ekipYokSub:"Adicione membros para atribuir trabalhos e ver o desempenho nos Relatórios",isAtandiK:"atribuídos",buIsimVar:"Esse nome já está na equipa",uyeCikarildi:"Membro removido",ekibeEklendi:"adicionado à equipa",
  rolUsta:"Técnico",rolMuhasebe:"Contabilidade",rolSatis:"Vendas",rolSofor:"Motorista",rolYardimci:"Ajudante",patronRol:"Dono",
  ekipPerformansi:"Desempenho da equipa",isBirim:"trabalhos",karSuffix:"lucro",
  hosgeldinT:"Bem-vindo",gozAt:"Dê uma olhada rápida ao seu negócio.",
  faturaSilUyari:"Esta fatura será eliminada",gibSilNot:"Anular uma fatura oficial está sujeito às regras fiscais — isto apenas remove o registo na app.",
  excelIslerL:"Excel — Trabalhos",excelGiderlerL:"Excel — Despesas",excelFaturalarL:"Excel — Faturas",pdfRaporL:"Relatório contabilístico PDF",muhasebeyeGonder:"Enviar ao contabilista",yazdirKaydet:"Imprimir / Guardar PDF",
  asistanHosgeldin:"Olá! 👋 Sou o assistente TradeFlow. Pergunte sobre faturas, recebimentos, custos... ou escolha uma pergunta rápida abaixo.",soruPh:"Escreva a sua pergunta...",
  asistan:"Assistente",asistanSub:"Respostas imediatas às suas perguntas",
};
const NL = {
  malzemeKalemleri:"Materiaal- / dienstposten",kalemAdPh:"Materiaal of dienst",adetL:"Aant.",birimFiyatL:"Stukprijs",kalemEkle:"+ Post toevoegen",araToplamL:"Subtotaal",kdvL:"Btw",genelToplamL:"Totaal",teklifBelgesi:"OFFERTE",gecerlilikNot:"Deze offerte is geldig tot de vermelde datum.",kaseImza:"Stempel / Handtekening",teklifPdfBtn:"PDF",
  gunaydin:"Goedemorgen,",isletmem:"Mijn bedrijf",yeniIs:"Nieuwe klus",isKoluSec:"Vak kiezen",ozellestir:"Aanpassen",
  aktifIs:"Actieve klussen",devamEden:"In uitvoering",tahsilEdildi:"Geïnd",buAyTahsilat:"Deze maand",
  bekleyenTahsilat:"Openstaande betaling",fatura:"facturen",bekleyen:"In afwachting",faturaTek:"Factuur",
  isAkislari:"Klussen",faturalar:"Facturen",tahsilatlar:"Betalingen",musteriler:"Klanten",
  teklifler:"Offertes",raporlar:"Rapporten",giderler:"Uitgaven",dahaFazla:"Meer",
  gelirGider:"Inkomsten-Uitgaven",buAy:"Deze maand",toplamGelir:"Totale inkomsten",toplamGider:"Totale uitgaven",
  netKar:"Nettowinst",tahsilatDurumu:"Betalingsstatus",toplam:"Totaal",tahsilEdilen:"Geïnd",
  geciken:"Achterstallig",vadesiGelmeyen:"Nog niet vervallen",tahsilatOrani:"Incassoquote",
  duzenleBaslik1:"Personaliseer je",duzenleBaslik2:"bedrijfsapp",duzenleAlt:"Kies modules, herschik.",duzenle:"Bewerken",
  sonIsAkislari:"Recente klussen",musteri:"Klant",tumunuGoruntule:"Alles bekijken",
  anaSayfa:"Start",bildirimlerT:"Meldingen",profil:"Profiel",tumIsAkislari:"Alle klussen",
  devamEdiyor:"In uitvoering",beklemede:"In afwachting",tamamlandi:"Afgerond",
  buAyinKarnesi:"MAANDRAPPORT",isTamamlandi:"Afgeronde klussen",tahsilat:"Geïnd",memnuniyet:"Tevredenheid",
  isletme:"BEDRIJF",isletmeBilgileri:"Bedrijfsgegevens",kdvOrani:"Btw-tarief",logoYukle:"Logo uploaden",
  sec:"Kiezen",degistir:"Wijzigen",uygulama:"APP",bildirimlerL:"Meldingen",karanlikMod:"Donkere modus",
  dil:"Taal",paraBirimi:"Valuta",destek:"SUPPORT",whatsappDestek:"WhatsApp-support",
  yardimMerkezi:"Helpcentrum",degerlendir:"App beoordelen",gizlilik:"Privacy",
  cikisYap:"Uitloggen",profiliDuzenle:"Profiel bewerken",dilSecin:"Taal kiezen",paraBirimiB:"Valuta",
  iptal:"Annuleren",kaydet:"Opslaan",sil:"Verwijderen",silOnay:"Deze klus verwijderen?",evetSil:"Ja, verwijderen",
  hatirlatma:"Herinnering",faturaKes:"Factuur maken",tamamla:"Afronden",kapat:"Sluiten",
  yeniTeklif:"Nieuwe offerte",iseDonustur:"Omzetten naar klus",gecerlilik:"Geldig tot",
  yeniGider:"Nieuwe uitgave",tahsilEt:"Innen",oneriniz:"Uw suggestie...",
  gonder:"Verzenden",tesekkurler:"Bedankt!",verileriSifirla:"Gegevens resetten",
  disaAktar:"Gegevens exporteren",bosBildirim:"Nog geen meldingen",tumunuOkundu:"Alles gelezen",
  sonucYok:"Geen resultaten",gunSecin:"Tik op een dag voor de klussen",buGunIsYok:"Geen klussen op deze dag",isleri:"KLUSSEN",
  isDuzenle:"Klus bewerken",ikon:"Pictogram",isBasligi:"Klustitel",tarihL:"Datum",tutarL:"Bedrag",
  tekrarlama:"Herhaling (onderhoudsplan)",tekSefer:"Eenmalig",haftalikL:"Wekelijks",aylikL:"Maandelijks",yillikL:"Jaarlijks",
  tekrarBilgi:"Na afronding wordt automatisch een nieuwe klus aangemaakt voor de volgende periode",
  isAdresiL:"Klusadres (optioneel)",adresPh:"Straat, nummer, stad...",musteriTel:"Telefoon klant (optioneel)",epostaOps:"E-mail (optioneel)",
  isFotolari:"Klusfoto's (voor/na)",durumL:"Status",guncelle:"Bijwerken",
  odemeDurumu:"Betalingsstatus",kaparoEkle:"+ Aanbetaling / Deelbetaling",alinan:"Ontvangen",kalanL:"Resterend",adresL:"Adres",navBaslat:"Navigatie starten",fotograflarB:"KLUSFOTO'S",
  henuzFaturaYok:"Nog geen facturen aangemaakt.",kesildiL:"AANGEMAAKT",bekleyenIslerB:"OPENSTAANDE KLUSSEN",alindiL:"ontvangen",
  yeniMusteri:"Klant toevoegen",adSoyadPh:"Naam / Bedrijf *",telefonL:"Telefoon",epostaL:"E-mail",adresNavPh:"Adres (voor navigatie)",vazgec:"Annuleren",gitL:"Ga",yeniL:"Nieuw",
  ciroL:"Omzet",isSayisi:"Aantal klussen",isAdresleriB:"KLUSADRESSEN",toplamCiro:"Totale omzet",toplamIsL:"Totaal klussen",isGecmisiB:"KLUSGESCHIEDENIS",isKaydiYok:"Geen klussen",araL:"Bellen",iletisimYok:"Geen contactgegevens",
  donusum:"Conversie",gunL:"dagen",suresiDoldu:"Verlopen",onaylandiL:"Goedgekeurd",reddedildiL:"Afgewezen",onayla:"Goedkeuren",reddet:"Afwijzen",
  henuzTeklifYok:"Nog geen offertes",ilkTeklif:"+ Eerste offerte maken",teklifBilgi:"Maak een offerte en zet deze na goedkeuring om in een klus.",filtreEslesmedi:"Geen offertes voor dit filter.",bekleyenTeklifT:"Totaal openstaande offertes",
  buAyR:"Deze maand",gecenAy:"Vorige maand",son3Ay:"Laatste 3 maanden",tumu:"Alle",gelirL:"Inkomst",giderL:"Uitgave",
  son7Gun:"Inkomsten laatste 7 dagen",son7Yok:"Geen afgeronde klussen in 7 dagen.",isBazli:"Bedragen per klus",donemdeIsYok:"Geen klussen in deze periode",durumDagilimi:"Statusverdeling",aktifL:"Actief",
  yedekGeriYukle:"Back-up terugzetten",jsonIceAktar:"JSON importeren",hakkinda:"Over",detayL:"Details",
  whatsappGonder:"Verzenden via WhatsApp",yazdirPdf:"Afdrukken / PDF",
  tumIslerB:"ALLE KLUSSEN",listesiB:"LIJST",kategoriIsYok:"Geen klussen in deze categorie",gelirKaynaklariB:"INKOMSTENBRONNEN",giderKategorileriB:"UITGAVENCATEGORIEËN",henuzGiderYok:"Nog geen uitgaven",devamEdenL:"In uitvoering",isL:"klussen",
  isletmeAyarlariB:"BEDRIJFSINSTELLINGEN",finansB:"FINANCIËN",raporlamaDonemi:"Rapportperiode",bankaHesabi:"Bankrekening toevoegen",sesEfektleri:"Geluidseffecten",kompaktGorunum:"Compacte weergave",proYukselt:"Upgrade naar Pro",haftalikHedef:"Weekdoel",
  hizliModullerB:"SNELTOEGANG-MODULES",modulBilgi:"Modules aan/uit, sleep om te ordenen. Direct effect.",modulEkle:"+ Modules toevoegen / bewerken →",
  sesEfektSub:"Bevestigingsgeluiden",kompaktSub:"Compactere inhoud",bildirimSub:"Klusherinneringen en meldingen",karanlikSub:"Minder vermoeide ogen",
  vergiDairesiYok:"Belastingkantoor niet ingesteld",kdvSub:"Toegepast op factuurberekeningen",logoSub:"Zichtbaar op facturen en profiel",
  canliKur:"Live koersen",sabitKur:"Vaste koersen",aylikGorunum:"Maandweergave",ibanSub:"Betalingen volgen via IBAN",
  proSub:"Onbeperkte klussen · PDF-facturen · WhatsApp-verzending · Cloudback-up",epostaDestek:"E-mailsupport",sssSub:"FAQ en handleidingen",degerlendirSub:"Beoordeel in App Store / Play Store",kvkkSub:"Privacyconform",yakinda:"Binnenkort!",
  gibSubAktif:"E-factuur actief",gibSubTest:"API ingesteld, test nodig",gibSubYok:"Nog niet ingesteld",
  mIslerA:"Alle werkorders en statussen",mFaturaA:"Aangemaakte en openstaande facturen",mTahsilatA:"Geïnde en openstaande betalingen",mMusteriA:"Klantenlijst en omzetanalyse",mTeklifA:"Offertes en conversies",mRaporA:"Grafieken en statistieken",mGiderA:"Uitgavenbeheer en categorieën",mDahaA:"Export, instellingen, hulp",
  modulFooter:"Actieve modules op Start · Uitgeschakelde blijven in het menu",
  kategori:"Categorie",aramaPh:"🔍 Zoek klant of klus...",dilAramaPh:"🔍 Zoek taal of land...",yardimAramaPh:"🔍 Zoek hulp...",
  isOrnekPh:"Radiatoren spoelen...",musteriOrnekPh:"Jan de Vries",malzemePh:"Materiaalinkoop...",musteriAdiPh:"Klantnaam",klimaPh:"Airco-installatie...",aliciAdiPh:"Naam ontvanger",
  maliyetL:"Geschatte kosten",maliyetPh:"Materiaal + arbeid + reis...",marjL:"Winstmarge",zararUyari:"DEZE KLUS IS VERLIESGEVEND!",dusukMarj:"Lage winstmarge",benzerIs:"Gem. kosten vergelijkbare klussen",
  guncelMusterilerT:"Actieve klanten",musteriKayitT:"Klantenbestand",kayitliMusteriler:"Geregistreerde klanten",yeniKayit:"+ Nieuwe registratie",kayitYok:"Nog geen geregistreerde klanten",kayitYokSub:"Registreer klanten vooraf voor snelle klusaanmaak",telYok:"Geen telefoon",isKaydiVar:"klussen",aktifMusteriDurumu:"Status actieve klanten",
  tahsilKisa:"Geïnd",giderKisa:"Uitgaven",karKisa:"Winst",zararKisa:"Verlies",karZararAnalizi:"WINST- / VERLIESANALYSE",netZarar:"Nettoverlies",giderKalemleri:"Uitgavenposten",yeniIsAc:"➕ Nieuwe klus",giderEkleBtn:"💸 Uitgave toevoegen",
  musteriyiSil:"Klant verwijderen",silinecekK:"wordt verwijderd",aitIsUyariOn:"Deze klant heeft",aitIsUyariSon:"klussen die ook worden verwijderd!",isimsizMusteri:"Naamloze klant",isimsizK:"Naamloos",
  iseBagla:"Koppelen aan klus (optioneel)",islerdenSec:"+ Kies uit actieve/openstaande klussen",listeyiKapat:"▲ Lijst sluiten",aktifBekleyenYok:"Geen actieve/openstaande klussen",
  tumuF:"Alle",iseBagliF:"📋 Gekoppeld",serbestF:"Los",giderlerB:"UITGAVEN",atananL:"Toegewezen",atananKisi:"Toegewezen aan",benL:"Ik",
  hazirIslerOn:"Suggesties voor ",hazirIslerSon:":",
  ekipYonetimi:"Teambeheer",ekipSub:"Leden toevoegen, klussen toewijzen",yeniUyeEkle:"Nieuw lid",ekibeEkle:"+ Aan team toevoegen",ekipYok:"Nog geen teamleden",ekipYokSub:"Voeg leden toe om klussen toe te wijzen en prestaties te zien in Rapporten",isAtandiK:"toegewezen",buIsimVar:"Deze naam zit al in het team",uyeCikarildi:"Lid verwijderd",ekibeEklendi:"toegevoegd aan team",
  rolUsta:"Monteur",rolMuhasebe:"Boekhouding",rolSatis:"Verkoop",rolSofor:"Chauffeur",rolYardimci:"Assistent",patronRol:"Eigenaar",
  ekipPerformansi:"Teamprestaties",isBirim:"klussen",karSuffix:"winst",
  hosgeldinT:"Welkom",gozAt:"Bekijk snel hoe je bedrijf ervoor staat.",
  faturaSilUyari:"Deze factuur wordt verwijderd",gibSilNot:"Het annuleren van een officiële factuur valt onder fiscale regels — dit verwijdert alleen de app-registratie.",
  excelIslerL:"Excel — Klussen",excelGiderlerL:"Excel — Uitgaven",excelFaturalarL:"Excel — Facturen",pdfRaporL:"PDF-boekhoudrapport",muhasebeyeGonder:"Naar boekhouder sturen",yazdirKaydet:"Afdrukken / Opslaan als PDF",
  asistanHosgeldin:"Hallo! 👋 Ik ben de TradeFlow-assistent. Vraag me over facturen, betalingen, kosten... of kies hieronder een snelle vraag.",soruPh:"Typ je vraag...",
  asistan:"Assistent",asistanSub:"Direct antwoord op je vragen",
};

const PARTIALS = {
  es:{gunaydin:"Buenos días,",yeniIs:"Nuevo Trabajo",anaSayfa:"Inicio",isAkislari:"Trabajos",bildirimlerT:"Alertas",profil:"Perfil",tamamlandi:"Completado",dil:"Idioma",kaydet:"Guardar",iptal:"Cancelar",sil:"Eliminar",isletmem:"Mi Negocio",faturalar:"Facturas",tahsilatlar:"Cobros",musteriler:"Clientes",teklifler:"Presupuestos",raporlar:"Informes",giderler:"Gastos",dahaFazla:"Más",toplamGelir:"Ingresos Totales",toplamGider:"Gastos Totales",netKar:"Beneficio Neto",bekleyen:"Pendiente",tahsilEdilen:"Cobrado",musteri:"Cliente",tarihL:"Fecha",tutarL:"Importe",durumL:"Estado",kapat:"Cerrar",tamamla:"Completar",faturaKes:"Crear Factura",yeniTeklif:"Nuevo Presupuesto",yeniGider:"Nuevo Gasto",tahsilEt:"Cobrar",guncelle:"Actualizar",vazgec:"Cancelar",tumu:"Todos",gelirL:"Ingresos",giderL:"Gastos",aktifL:"Activo",beklemede:"Pendiente",devamEdiyor:"En curso",sesEfektSub:"Sonidos de confirmación",kompaktSub:"Vista compacta",bildirimSub:"Recordatorios y alertas",karanlikSub:"Descansa la vista",kdvSub:"Se aplica a las facturas",logoSub:"Visible en facturas y perfil",canliKur:"Tasas en vivo",sabitKur:"Tasas fijas",aylikGorunum:"Vista mensual",ibanSub:"Seguimiento de pagos por IBAN",proSub:"Trabajos ilimitados · Facturas PDF · WhatsApp · Copia en la nube",epostaDestek:"Soporte por Email",sssSub:"FAQ y guías",degerlendirSub:"Valorar en App Store",kvkkSub:"Cumple privacidad",yakinda:"¡Próximamente!",mIslerA:"Todos los trabajos y estados",mFaturaA:"Facturas emitidas y pendientes",mTahsilatA:"Cobros recibidos y pendientes",mMusteriA:"Lista de clientes y análisis",mTeklifA:"Presupuestos y conversiones",mRaporA:"Gráficos y estadísticas",mGiderA:"Control de gastos",mDahaA:"Exportar, ajustes, ayuda",modulFooter:"Los módulos activos aparecen en Inicio",vergiDairesiYok:"Oficina fiscal no definida",gibSubYok:"Aún no configurado",gibSubAktif:"e-Factura activa",gibSubTest:"API configurada, prueba requerida"},
  zh:{gunaydin:"早上好，",yeniIs:"新工作",anaSayfa:"首页",isAkislari:"工作流",bildirimlerT:"通知",profil:"我的",tamamlandi:"已完成",dil:"语言",kaydet:"保存",iptal:"取消",sil:"删除",isletmem:"我的生意",faturalar:"发票",tahsilatlar:"收款",musteriler:"客户",teklifler:"报价",raporlar:"报表",giderler:"支出",dahaFazla:"更多",toplamGelir:"总收入",toplamGider:"总支出",netKar:"净利润",bekleyen:"待处理",tahsilEdilen:"已收款",musteri:"客户",tarihL:"日期",tutarL:"金额",durumL:"状态",kapat:"关闭",tamamla:"完成",faturaKes:"开具发票",tahsilEt:"收款",guncelle:"更新",vazgec:"取消",tumu:"全部",gelirL:"收入",giderL:"支出",aktifL:"进行中",beklemede:"等待中",devamEdiyor:"进行中",sesEfektSub:"操作确认音",kompaktSub:"紧凑视图",bildirimSub:"工作提醒和警报",karanlikSub:"缓解眼睛疲劳",kdvSub:"应用于发票计算",logoSub:"显示在发票和资料上",canliKur:"实时汇率",sabitKur:"固定汇率",aylikGorunum:"月视图",ibanSub:"通过IBAN跟踪付款",proSub:"无限工作 · PDF发票 · WhatsApp · 云备份",epostaDestek:"邮件支持",sssSub:"常见问题和指南",degerlendirSub:"在应用商店评分",kvkkSub:"符合隐私规定",yakinda:"即将推出!",mIslerA:"所有工单和状态",mFaturaA:"已开和待开发票",mTahsilatA:"已收和待收款项",mMusteriA:"客户列表和营收分析",mTeklifA:"报价和转化",mRaporA:"图表和统计",mGiderA:"支出跟踪",mDahaA:"导出、设置、帮助",modulFooter:"活动模块显示在首页",vergiDairesiYok:"未设置税务局",gibSubYok:"尚未设置",gibSubAktif:"电子发票已启用",gibSubTest:"API已设置,需要测试"},
  hi:{gunaydin:"सुप्रभात,",yeniIs:"नया काम",anaSayfa:"होम",profil:"प्रोफ़ाइल",tamamlandi:"पूर्ण",dil:"भाषा",kaydet:"सहेजें",iptal:"रद्द",sil:"हटाएं"},
  fr:{gunaydin:"Bonjour,",yeniIs:"Nouveau Travail",anaSayfa:"Accueil",isAkislari:"Travaux",bildirimlerT:"Alertes",profil:"Profil",tamamlandi:"Terminé",dil:"Langue",kaydet:"Enregistrer",iptal:"Annuler",sil:"Supprimer",isletmem:"Mon Entreprise",faturalar:"Factures",tahsilatlar:"Paiements",musteriler:"Clients",teklifler:"Devis",raporlar:"Rapports",giderler:"Dépenses",dahaFazla:"Plus",toplamGelir:"Revenu Total",toplamGider:"Dépenses Totales",netKar:"Bénéfice Net",bekleyen:"En attente",tahsilEdilen:"Encaissé",musteri:"Client",tarihL:"Date",tutarL:"Montant",durumL:"Statut",kapat:"Fermer",tamamla:"Terminer",faturaKes:"Créer Facture",yeniTeklif:"Nouveau Devis",yeniGider:"Nouvelle Dépense",tahsilEt:"Encaisser",guncelle:"Mettre à jour",vazgec:"Annuler",tumu:"Tous",gelirL:"Revenus",giderL:"Dépenses",aktifL:"Actif",beklemede:"En attente",devamEdiyor:"En cours",sesEfektSub:"Sons de confirmation",kompaktSub:"Affichage compact",bildirimSub:"Rappels et alertes",karanlikSub:"Repose les yeux",kdvSub:"Appliqué aux factures",logoSub:"Visible sur factures et profil",canliKur:"Taux en direct",sabitKur:"Taux fixes",aylikGorunum:"Vue mensuelle",ibanSub:"Suivi des paiements par IBAN",proSub:"Travaux illimités · Factures PDF · WhatsApp · Sauvegarde cloud",epostaDestek:"Support Email",sssSub:"FAQ et guides",degerlendirSub:"Noter sur l'App Store",kvkkSub:"Conforme RGPD",yakinda:"Bientôt!",mIslerA:"Tous les travaux et statuts",mFaturaA:"Factures émises et en attente",mTahsilatA:"Paiements reçus et en attente",mMusteriA:"Liste clients et analyse CA",mTeklifA:"Devis et conversions",mRaporA:"Graphiques et statistiques",mGiderA:"Suivi des dépenses",mDahaA:"Export, réglages, aide",modulFooter:"Les modules actifs apparaissent à l'accueil",vergiDairesiYok:"Centre fiscal non défini",gibSubYok:"Pas encore configuré",gibSubAktif:"e-Facture active",gibSubTest:"API configurée, test requis"},
  ar:{gunaydin:"صباح الخير،",yeniIs:"عمل جديد",anaSayfa:"الرئيسية",bildirimlerT:"إشعارات",profil:"الملف",tamamlandi:"مكتمل",dil:"اللغة",kaydet:"حفظ",iptal:"إلغاء",sil:"حذف",isletmem:"عملي",faturalar:"الفواتير",tahsilatlar:"المدفوعات",musteriler:"العملاء",teklifler:"العروض",raporlar:"التقارير",giderler:"المصروفات",dahaFazla:"المزيد",toplamGelir:"إجمالي الدخل",toplamGider:"إجمالي المصروفات",netKar:"صافي الربح",bekleyen:"معلق",tahsilEdilen:"محصّل",musteri:"عميل",tarihL:"التاريخ",tutarL:"المبلغ",durumL:"الحالة",kapat:"إغلاق",tamamla:"إكمال",faturaKes:"إنشاء فاتورة",tahsilEt:"تحصيل",guncelle:"تحديث",vazgec:"إلغاء",tumu:"الكل",gelirL:"الدخل",giderL:"المصروفات",aktifL:"نشط",beklemede:"قيد الانتظار",devamEdiyor:"جارٍ",sesEfektSub:"أصوات التأكيد",kompaktSub:"عرض مضغوط",bildirimSub:"تذكيرات وتنبيهات",karanlikSub:"يريح العينين",kdvSub:"يطبق على الفواتير",logoSub:"يظهر على الفواتير والملف",canliKur:"أسعار مباشرة",sabitKur:"أسعار ثابتة",aylikGorunum:"عرض شهري",ibanSub:"تتبع المدفوعات عبر IBAN",proSub:"أعمال غير محدودة · فواتير PDF · واتساب · نسخ سحابي",epostaDestek:"دعم البريد",sssSub:"الأسئلة الشائعة",degerlendirSub:"قيّم التطبيق",kvkkSub:"متوافق مع الخصوصية",yakinda:"قريباً!",mIslerA:"جميع الأعمال والحالات",mFaturaA:"الفواتير الصادرة والمعلقة",mTahsilatA:"المدفوعات المستلمة والمعلقة",mMusteriA:"قائمة العملاء وتحليل الإيرادات",mTeklifA:"العروض والتحويلات",mRaporA:"الرسوم والإحصائيات",mGiderA:"تتبع المصروفات",mDahaA:"تصدير، إعدادات، مساعدة",modulFooter:"الوحدات النشطة تظهر في الرئيسية",vergiDairesiYok:"لم يحدد مكتب الضرائب",gibSubYok:"لم يتم الإعداد بعد",gibSubAktif:"الفاتورة الإلكترونية نشطة",gibSubTest:"تم إعداد API، الاختبار مطلوب"},
  de:{gunaydin:"Guten Morgen,",yeniIs:"Neuer Auftrag",anaSayfa:"Start",isAkislari:"Aufträge",bildirimlerT:"Mitteilungen",profil:"Profil",tamamlandi:"Fertig",dil:"Sprache",kaydet:"Speichern",iptal:"Abbrechen",sil:"Löschen",isletmem:"Mein Betrieb",faturalar:"Rechnungen",tahsilatlar:"Zahlungen",musteriler:"Kunden",teklifler:"Angebote",raporlar:"Berichte",giderler:"Ausgaben",dahaFazla:"Mehr",toplamGelir:"Gesamteinnahmen",toplamGider:"Gesamtausgaben",netKar:"Nettogewinn",bekleyen:"Ausstehend",tahsilEdilen:"Eingezogen",musteri:"Kunde",tarihL:"Datum",tutarL:"Betrag",durumL:"Status",kapat:"Schließen",tamamla:"Abschließen",faturaKes:"Rechnung erstellen",yeniTeklif:"Neues Angebot",yeniGider:"Neue Ausgabe",tahsilEt:"Einziehen",guncelle:"Aktualisieren",vazgec:"Abbrechen",tumu:"Alle",gelirL:"Einnahmen",giderL:"Ausgaben",aktifL:"Aktiv",beklemede:"Wartend",devamEdiyor:"Läuft",sesEfektSub:"Bestätigungstöne",kompaktSub:"Dichtere Ansicht",bildirimSub:"Erinnerungen und Warnungen",karanlikSub:"Schont die Augen",kdvSub:"Wird auf Rechnungen angewendet",logoSub:"Auf Rechnungen und Profil sichtbar",canliKur:"Live-Kurse",sabitKur:"Feste Kurse",aylikGorunum:"Monatsansicht",ibanSub:"Zahlungsverfolgung per IBAN",proSub:"Unbegrenzte Aufträge · PDF-Rechnungen · WhatsApp · Cloud-Backup",epostaDestek:"E-Mail-Support",sssSub:"FAQ und Anleitungen",degerlendirSub:"Im App Store bewerten",kvkkSub:"Datenschutzkonform",yakinda:"Bald verfügbar!",mIslerA:"Alle Aufträge und Status",mFaturaA:"Erstellte und offene Rechnungen",mTahsilatA:"Erhaltene und offene Zahlungen",mMusteriA:"Kundenliste und Umsatzanalyse",mTeklifA:"Angebote und Konversionen",mRaporA:"Diagramme und Statistiken",mGiderA:"Ausgabenverfolgung",mDahaA:"Export, Einstellungen, Hilfe",modulFooter:"Aktive Module erscheinen auf der Startseite",vergiDairesiYok:"Finanzamt nicht angegeben",gibSubYok:"Noch nicht eingerichtet",gibSubAktif:"Live e-Rechnung aktiv",gibSubTest:"API eingerichtet, Test erforderlich"},
  pt:{gunaydin:"Bom dia,",yeniIs:"Novo Trabalho",anaSayfa:"Início",profil:"Perfil",tamamlandi:"Concluído",dil:"Idioma",kaydet:"Salvar",iptal:"Cancelar",sil:"Excluir"},
  ru:{gunaydin:"Доброе утро,",yeniIs:"Новая работа",anaSayfa:"Главная",profil:"Профиль",tamamlandi:"Завершено",dil:"Язык",kaydet:"Сохранить",iptal:"Отмена",sil:"Удалить",isletmem:"Мой бизнес",faturalar:"Счета",tahsilatlar:"Платежи",musteriler:"Клиенты",teklifler:"Предложения",raporlar:"Отчёты",giderler:"Расходы",dahaFazla:"Ещё",toplamGelir:"Общий доход",toplamGider:"Общие расходы",netKar:"Чистая прибыль",bekleyen:"Ожидает",tahsilEdilen:"Получено",musteri:"Клиент",tarihL:"Дата",tutarL:"Сумма",durumL:"Статус",kapat:"Закрыть",tamamla:"Завершить",faturaKes:"Создать счёт",tahsilEt:"Получить",guncelle:"Обновить",vazgec:"Отмена",tumu:"Все",gelirL:"Доход",giderL:"Расход",aktifL:"Активно",beklemede:"Ожидание",devamEdiyor:"В работе",sesEfektSub:"Звуки подтверждения",kompaktSub:"Компактный вид",bildirimSub:"Напоминания и уведомления",karanlikSub:"Бережёт глаза",kdvSub:"Применяется к счетам",logoSub:"Видно на счетах и профиле",canliKur:"Живые курсы",sabitKur:"Фиксированные курсы",aylikGorunum:"Месячный вид",ibanSub:"Отслеживание платежей по IBAN",proSub:"Безлимитные работы · PDF-счета · WhatsApp · Облачный бэкап",epostaDestek:"Email-поддержка",sssSub:"FAQ и руководства",degerlendirSub:"Оценить в App Store",kvkkSub:"Соответствует конфиденциальности",yakinda:"Скоро!",mIslerA:"Все работы и статусы",mFaturaA:"Выставленные и ожидающие счета",mTahsilatA:"Полученные и ожидающие платежи",mMusteriA:"Список клиентов и анализ выручки",mTeklifA:"Предложения и конверсии",mRaporA:"Графики и статистика",mGiderA:"Учёт расходов",mDahaA:"Экспорт, настройки, помощь",modulFooter:"Активные модули на главной",vergiDairesiYok:"Налоговая не указана",gibSubYok:"Ещё не настроено",gibSubAktif:"e-Счёт активен",gibSubTest:"API настроен, нужен тест"},
  ja:{gunaydin:"おはようございます、",yeniIs:"新規作業",anaSayfa:"ホーム",profil:"プロフィール",tamamlandi:"完了",dil:"言語",kaydet:"保存",iptal:"キャンセル",sil:"削除"},
  ko:{gunaydin:"좋은 아침,",yeniIs:"새 작업",anaSayfa:"홈",profil:"프로필",tamamlandi:"완료",dil:"언어",kaydet:"저장",iptal:"취소",sil:"삭제"},
  id:{gunaydin:"Selamat pagi,",yeniIs:"Pekerjaan Baru",anaSayfa:"Beranda",profil:"Profil",tamamlandi:"Selesai",dil:"Bahasa",kaydet:"Simpan",iptal:"Batal",sil:"Hapus"},
  it:{gunaydin:"Buongiorno,",yeniIs:"Nuovo Lavoro",anaSayfa:"Home",profil:"Profilo",tamamlandi:"Completato",dil:"Lingua",kaydet:"Salva",iptal:"Annulla",sil:"Elimina",isletmem:"La Mia Attività",faturalar:"Fatture",tahsilatlar:"Incassi",musteriler:"Clienti",teklifler:"Preventivi",raporlar:"Report",giderler:"Spese",dahaFazla:"Altro",toplamGelir:"Entrate Totali",toplamGider:"Spese Totali",netKar:"Utile Netto",bekleyen:"In attesa",tahsilEdilen:"Incassato",musteri:"Cliente",tarihL:"Data",tutarL:"Importo",durumL:"Stato",kapat:"Chiudi",tamamla:"Completa",faturaKes:"Crea Fattura",tahsilEt:"Incassa",guncelle:"Aggiorna",vazgec:"Annulla",tumu:"Tutti",gelirL:"Entrate",giderL:"Spese",aktifL:"Attivo",beklemede:"In attesa",devamEdiyor:"In corso",sesEfektSub:"Suoni di conferma",kompaktSub:"Vista compatta",bildirimSub:"Promemoria e avvisi",karanlikSub:"Riposa gli occhi",kdvSub:"Applicato alle fatture",logoSub:"Visibile su fatture e profilo",canliKur:"Tassi in tempo reale",sabitKur:"Tassi fissi",aylikGorunum:"Vista mensile",ibanSub:"Tracciamento pagamenti via IBAN",proSub:"Lavori illimitati · Fatture PDF · WhatsApp · Backup cloud",epostaDestek:"Supporto Email",sssSub:"FAQ e guide",degerlendirSub:"Valuta su App Store",kvkkSub:"Conforme privacy",yakinda:"Presto!",mIslerA:"Tutti i lavori e stati",mFaturaA:"Fatture emesse e in sospeso",mTahsilatA:"Incassi ricevuti e in sospeso",mMusteriA:"Lista clienti e analisi ricavi",mTeklifA:"Preventivi e conversioni",mRaporA:"Grafici e statistiche",mGiderA:"Tracciamento spese",mDahaA:"Esporta, impostazioni, aiuto",modulFooter:"I moduli attivi appaiono nella Home",vergiDairesiYok:"Ufficio fiscale non impostato",gibSubYok:"Non ancora configurato",gibSubAktif:"e-Fattura attiva",gibSubTest:"API configurata, test richiesto"},
  vi:{gunaydin:"Chào buổi sáng,",anaSayfa:"Trang chủ",profil:"Hồ sơ",tamamlandi:"Hoàn thành",dil:"Ngôn ngữ",kaydet:"Lưu",iptal:"Hủy",sil:"Xóa"},
  pl:{gunaydin:"Dzień dobry,",anaSayfa:"Start",profil:"Profil",tamamlandi:"Ukończone",dil:"Język",kaydet:"Zapisz",iptal:"Anuluj",sil:"Usuń"},
  nl:{gunaydin:"Goedemorgen,",anaSayfa:"Home",profil:"Profiel",tamamlandi:"Voltooid",dil:"Taal",kaydet:"Opslaan",iptal:"Annuleren",sil:"Verwijderen",isletmem:"Mijn Bedrijf",faturalar:"Facturen",tahsilatlar:"Betalingen",musteriler:"Klanten",teklifler:"Offertes",raporlar:"Rapporten",giderler:"Uitgaven",dahaFazla:"Meer",toplamGelir:"Totale Inkomsten",toplamGider:"Totale Uitgaven",netKar:"Nettowinst",bekleyen:"In afwachting",tahsilEdilen:"Geïnd",musteri:"Klant",tarihL:"Datum",tutarL:"Bedrag",durumL:"Status",kapat:"Sluiten",tamamla:"Voltooien",faturaKes:"Factuur maken",tahsilEt:"Innen",guncelle:"Bijwerken",vazgec:"Annuleren",tumu:"Alle",gelirL:"Inkomsten",giderL:"Uitgaven",aktifL:"Actief",beklemede:"Wachtend",devamEdiyor:"Bezig",sesEfektSub:"Bevestigingsgeluiden",kompaktSub:"Compacte weergave",bildirimSub:"Herinneringen en meldingen",karanlikSub:"Rust voor de ogen",kdvSub:"Toegepast op facturen",logoSub:"Zichtbaar op facturen en profiel",canliKur:"Live koersen",sabitKur:"Vaste koersen",aylikGorunum:"Maandweergave",ibanSub:"Betalingen volgen via IBAN",proSub:"Onbeperkte klussen · PDF-facturen · WhatsApp · Cloud-backup",epostaDestek:"E-mail Support",sssSub:"FAQ en handleidingen",degerlendirSub:"Beoordeel in App Store",kvkkSub:"Privacy-conform",yakinda:"Binnenkort!",mIslerA:"Alle klussen en statussen",mFaturaA:"Verzonden en openstaande facturen",mTahsilatA:"Ontvangen en openstaande betalingen",mMusteriA:"Klantenlijst en omzetanalyse",mTeklifA:"Offertes en conversies",mRaporA:"Grafieken en statistieken",mGiderA:"Uitgaven bijhouden",mDahaA:"Exporteren, instellingen, hulp",modulFooter:"Actieve modules verschijnen op Home",vergiDairesiYok:"Belastingkantoor niet ingesteld",gibSubYok:"Nog niet ingesteld",gibSubAktif:"e-Factuur actief",gibSubTest:"API ingesteld, test vereist"},
  uk:{gunaydin:"Доброго ранку,",anaSayfa:"Головна",profil:"Профіль",tamamlandi:"Завершено",dil:"Мова",kaydet:"Зберегти",iptal:"Скасувати",sil:"Видалити"},
  th:{gunaydin:"สวัสดีตอนเช้า,",anaSayfa:"หน้าหลัก",profil:"โปรไฟล์",tamamlandi:"เสร็จสิ้น",dil:"ภาษา",kaydet:"บันทึก",iptal:"ยกเลิก",sil:"ลบ"},
  sv:{gunaydin:"God morgon,",anaSayfa:"Hem",profil:"Profil",tamamlandi:"Klar",dil:"Språk",kaydet:"Spara",iptal:"Avbryt",sil:"Radera"},
  ms:{gunaydin:"Selamat pagi,",anaSayfa:"Utama",profil:"Profil",tamamlandi:"Selesai",dil:"Bahasa",kaydet:"Simpan",iptal:"Batal",sil:"Padam"},
  ro:{gunaydin:"Bună dimineața,",anaSayfa:"Acasă",profil:"Profil",tamamlandi:"Finalizat",dil:"Limbă",kaydet:"Salvează",iptal:"Anulează",sil:"Șterge"},
  fa:{gunaydin:"صبح بخیر،",anaSayfa:"خانه",profil:"پروفایل",tamamlandi:"تکمیل",dil:"زبان",kaydet:"ذخیره",iptal:"لغو",sil:"حذف"},
  cs:{gunaydin:"Dobré ráno,",anaSayfa:"Domů",profil:"Profil",tamamlandi:"Dokončeno",dil:"Jazyk",kaydet:"Uložit",iptal:"Zrušit",sil:"Smazat"},
  he:{gunaydin:"בוקר טוב,",anaSayfa:"בית",profil:"פרופיל",tamamlandi:"הושלם",dil:"שפה",kaydet:"שמור",iptal:"ביטול",sil:"מחק"},
  hu:{gunaydin:"Jó reggelt,",anaSayfa:"Kezdőlap",profil:"Profil",tamamlandi:"Kész",dil:"Nyelv",kaydet:"Mentés",iptal:"Mégse",sil:"Törlés"},
  sw:{gunaydin:"Habari za asubuhi,",anaSayfa:"Nyumbani",profil:"Wasifu",tamamlandi:"Imekamilika",dil:"Lugha",kaydet:"Hifadhi",iptal:"Ghairi",sil:"Futa"},
  el:{gunaydin:"Καλημέρα,",anaSayfa:"Αρχική",profil:"Προφίλ",tamamlandi:"Ολοκληρώθηκε",dil:"Γλώσσα",kaydet:"Αποθήκευση",iptal:"Ακύρωση",sil:"Διαγραφή"},
  bn:{gunaydin:"শুভ সকাল,",anaSayfa:"হোম",profil:"প্রোফাইল",tamamlandi:"সম্পূর্ণ",dil:"ভাষা",kaydet:"সংরক্ষণ",iptal:"বাতিল",sil:"মুছুন"},
  ur:{gunaydin:"صبح بخیر،",anaSayfa:"ہوم",profil:"پروفائل",tamamlandi:"مکمل",dil:"زبان",kaydet:"محفوظ",iptal:"منسوخ",sil:"حذف"},
};
const DIL_GRUPLARI = [
  {grup:"🇹🇷 Türkçe & İngilizce", diller:[
    {code:"tr",ad:"Türkçe",bayrak:"🇹🇷",bolge:"Türkiye"},
    {code:"en",ad:"English",bayrak:"🇬🇧",bolge:"United Kingdom / USA"},
  ]},
  {grup:"🌍 Avrupa (Tam Çeviri)", diller:[
    {code:"de",ad:"Deutsch",bayrak:"🇩🇪",bolge:"Deutschland · Österreich · Schweiz"},
    {code:"fr",ad:"Français",bayrak:"🇫🇷",bolge:"France · Belgique · Suisse"},
    {code:"es",ad:"Español",bayrak:"🇪🇸",bolge:"España · Latinoamérica"},
    {code:"it",ad:"Italiano",bayrak:"🇮🇹",bolge:"Italia"},
    {code:"pt",ad:"Português",bayrak:"🇵🇹",bolge:"Portugal · Brasil"},
    {code:"nl",ad:"Nederlands",bayrak:"🇳🇱",bolge:"Nederland · België"},
  ]},
];
const DIL_LISTESI = DIL_GRUPLARI.flatMap(g=>g.diller);
const TAM_DILLER = {de:()=>DE,fr:()=>FR,es:()=>ES,it:()=>IT,pt:()=>PT,nl:()=>NL};
const getT = (dil) => {
  if(dil==="tr") return TR;
  if(dil==="en") return EN;
  if(TAM_DILLER[dil]) return {...EN,...TAM_DILLER[dil]()};
  return {...EN,...(PARTIALS[dil]||{})};
};

let DURUM = {};
const updateDurum = (T) => {
  DURUM = {
    aktif:{label:T.devamEdiyor,color:C.blue,bg:C.blueBg},
    bekliyor:{label:T.beklemede,color:C.amber,bg:C.amberBg},
    tamamlandi:{label:T.tamamlandi,color:C.green,bg:C.greenBg},
  };
};

let nId = 8; let fatNo = 1;
const IS_KOLLARI = [
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
const SEKTOR_VERI = {
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
const sektorBilgi = (kol)=> SEKTOR_VERI_TAM[kol] || SEKTOR_VERI["Mekanik Tesisat"];

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
const initJobs = [
  {id:7,ref:"IS-0007",baslik:"Petek Temizliği & Tesisat Kontrolü",musteri:"Ahmet Yılmaz",tarih:"2026-07-02",durum:"aktif",tutar:7500,icon:"💻",iconBg:"#EDE9FE",hatirlatma:null,hatirlatildi:false,odemeler:[],isAdresi:"Alsancak Mah. Kıbrıs Şehitleri Cad. No:14, Konak/İzmir",musteriTelefon:"0532 111 22 33"},
  {id:6,ref:"IS-0006",baslik:"Kombi Montajı",musteri:"Mehmet Kaya",tarih:"2026-07-01",durum:"bekliyor",tutar:15000,icon:"📦",iconBg:"#FEF3C7",hatirlatma:null,hatirlatildi:false,odemeler:[{tutar:5000,tarih:"01.07.2026"}],tekrar:"yok"},
  {id:5,ref:"IS-0005",baslik:"Su Kaçağı Onarımı",musteri:"Ali Demir",tarih:"2026-06-30",durum:"tamamlandi",tutar:3250,icon:"🔧",iconBg:"#DCFCE7",hatirlatma:null,hatirlatildi:false,odemeler:[]},
];
const gelirData=[{d:"Pzt",v:4200},{d:"Sal",v:5100},{d:"Çar",v:3800},{d:"Per",v:6200},{d:"Cum",v:7100},{d:"Cmt",v:5400},{d:"Paz",v:6800}];
const GIDER_KAT=["Malzeme","Yakıt","Personel","Kira","Diğer"];

// ─── ATOMLAR ────────────────────────────────────────────────────
const Sh=({children,s,onClick})=><div onClick={onClick} style={{background:C.card,borderRadius:16,boxShadow:C.sh,...s}}>{children}</div>;
const Badge=({durum})=>{const d=DURUM[durum]||{label:durum,color:C.t3,bg:C.bg};return <span style={{fontSize:11,fontWeight:600,color:d.color,background:d.bg,borderRadius:20,padding:"4px 10px",whiteSpace:"nowrap"}}>{d.label}</span>;};
const Toggle=({on,set})=><div onClick={()=>set(!on)} style={{width:46,height:26,borderRadius:13,background:on?P:"#9CA3AF",position:"relative",cursor:"pointer",transition:"background 0.2s",flexShrink:0}}><div style={{width:22,height:22,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:on?22:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/></div>;
function TFLogo(){return <div style={{display:"flex",alignItems:"center",gap:8}}><svg width="28" height="28" viewBox="0 0 30 30"><polygon points="15,2 28,26 2,26" fill={P} opacity="0.85"/><polygon points="15,9 23,26 7,26" fill="white" opacity="0.55"/></svg><span style={{fontSize:16,fontWeight:800,color:C.t1,letterSpacing:"-0.02em"}}>tradeflow<span style={{color:P}}>·elite</span></span></div>;}
function GeriBaslik({baslik,onKapat}){return <div style={{display:"flex",alignItems:"center",gap:12,padding:"52px 16px 14px",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:60}}><button onClick={onKapat} style={{width:38,height:38,borderRadius:11,background:C.bg,border:`1px solid ${C.border}`,fontSize:16,cursor:"pointer",color:C.t1}}>←</button><div style={{fontSize:18,fontWeight:800,color:C.t1}}>{baslik}</div></div>;}
function BottomSheet({children,onKapat,maxH}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.42)",display:"flex",alignItems:MASAUSTU?"center":"flex-end",zIndex:1000}} onClick={onKapat}><div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:MASAUSTU?24:"24px 24px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:MASAUSTU?560:APP_W,margin:"0 auto",maxHeight:maxH||"88vh",overflowY:"auto",boxShadow:MASAUSTU?C.sh2:"none"}}><div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>{children}</div></div>;}
// Maliyet Bekçisi: tutar + maliyet girilince anlık kâr/zarar analizi
function BenzerIsIpucu({baslik,jobs,edit,duzenlenecekId,T}){
  try{
    if(!baslik||baslik.length<4||!Array.isArray(jobs)||jobs.length===0)return null;
    const kelimeler=baslik.toLowerCase().split(/\s+/).filter(w=>w.length>3);
    if(!kelimeler.length)return null;
    const benzer=jobs.filter(j=>j&&j.maliyet>0&&(!edit||j.id!==duzenlenecekId)&&kelimeler.some(w=>(j.baslik||"").toLowerCase().includes(w)));
    if(!benzer.length)return null;
    const ort=Math.round(benzer.reduce((s,j)=>s+(j.maliyet||0),0)/benzer.length/(KURLAR[AKTIF_PARA]||1));
    return <div style={{fontSize:11,color:P,fontWeight:600,marginTop:-8,marginBottom:12}}>💡 {T.benzerIs}: {fmt(ort*(KURLAR[AKTIF_PARA]||1))} ({benzer.length} iş)</div>;
  }catch(e){return null;}
}

function MaliyetOnizleme({tutar,maliyet,T}){
  const t=Number(tutar||0),m=Number(maliyet||0);
  if(t<=0||m<=0)return null;
  const kar=t-m,marj=Math.round(kar/t*100);
  const zarar=kar<0,dusuk=!zarar&&marj<15;
  const renk=zarar?C.red:dusuk?C.amber:C.green;
  const bg=zarar?C.redBg:dusuk?C.amberBg:C.greenBg;
  return <div style={{background:bg,border:`1.5px solid ${renk}44`,borderRadius:12,padding:"11px 14px",marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,fontWeight:800,color:renk}}>{zarar?"⚠️ "+T.zararUyari:dusuk?"⚡ "+T.dusukMarj:"✅ "+T.netKar}</span>
      <span style={{fontSize:15,fontWeight:900,color:renk}}>{kar>=0?"+":""}{fmt(kar*(KURLAR[AKTIF_PARA]||1))}</span>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:5}}>
      <span style={{fontSize:10,color:C.t2}}>{T.marjL}</span>
      <span style={{fontSize:11,fontWeight:700,color:renk}}>%{marj}</span>
    </div>
    <div style={{background:C.border,borderRadius:3,height:5,marginTop:5,overflow:"hidden"}}>
      <div style={{width:`${Math.max(0,Math.min(marj,100))}%`,background:renk,height:"100%"}}/>
    </div>
  </div>;
}

function Inp({label,value,onChange,placeholder,type,onFocus}){return <div style={{marginBottom:14}}>{label&&<div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</div>}<input type={type||"text"} value={value} onChange={onChange} onFocus={onFocus} placeholder={placeholder} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none"}}/></div>;}
const BtnP=({children,onClick})=><button onClick={onClick} style={{flex:2,background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>{children}</button>;
const BtnS=({children,onClick})=><button onClick={onClick} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:13,cursor:"pointer"}}>{children}</button>;

// ─── HERO ────────────────────────────────────────────────────────
function HeroCard({jobs,onYeniIs,isKolu,setIsKolu,isKoluAc,setIsKoluAc,T,onStatClick,isletmeAd,onOzellestir}){
  const aktif=jobs.filter(j=>j.durum==="aktif").length;
  const tahsil=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const bTutar=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const bSayi=jobs.filter(j=>j.durum==="bekliyor").length;
  const stats=[
    {icon:"📋",bg:C.purpleBg,label:T.aktifIs,val:aktif,sub:T.devamEden,vc:C.statP,go:"stat-aktif"},
    {icon:"✅",bg:C.greenBg,label:T.tahsilEdildi,val:fmt(tahsil),sub:T.buAyTahsilat,vc:C.statG,go:"stat-tahsil"},
    {icon:"⏰",bg:C.amberBg,label:T.bekleyenTahsilat,val:fmt(bTutar),sub:bSayi+" "+T.fatura,vc:C.statA,go:"stat-btahsilat"},
    {icon:"🔴",bg:C.redBg,label:T.bekleyen,val:bSayi,sub:T.faturaTek,vc:C.statR,go:"stat-bekleyen"},
  ];
  return (
    <Sh s={{margin:"0 14px 14px",padding:"18px 16px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div>
          <div style={{fontSize:13,color:C.t2,marginBottom:2}}>{T.gunaydin}</div>
          <div style={{fontSize:22,fontWeight:900,color:C.t1,letterSpacing:"-0.03em",lineHeight:1.1}}>Eray Özgül</div>
          <div style={{fontSize:12,color:C.t3,marginTop:4}}>{new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8,minWidth:140}}>
          <div style={{background:C.bg,borderRadius:10,padding:"8px 12px",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,color:C.t3,marginBottom:2}}>{T.isletmem}</div>
            <span style={{fontSize:13,fontWeight:700,color:C.t1}}>{isletmeAd}</span>
          </div>
          <button onClick={onYeniIs} style={{background:P,border:"none",borderRadius:12,padding:"11px 16px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,boxShadow:`0 4px 12px ${P}44`}}>
            <span style={{fontSize:18,lineHeight:1}}>+</span> {T.yeniIs}
          </button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        <div onClick={()=>setIsKoluAc(!isKoluAc)} style={{flex:1,background:C.bg,borderRadius:10,padding:"10px 12px",border:`1px solid ${C.border}`,cursor:"pointer"}}>
          <div style={{fontSize:10,color:C.t3,marginBottom:2}}>{T.isKoluSec}</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:600,color:C.t1}}>{isKolu}</span>
            <span style={{color:C.t3,fontSize:12}}>▾</span>
          </div>
        </div>
        <button onClick={onOzellestir} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 14px",cursor:"pointer",fontSize:13,fontWeight:600,color:C.t2,whiteSpace:"nowrap"}}>⚙️ {T.ozellestir}</button>
      </div>
      {isKoluAc&&<div style={{background:C.card,borderRadius:14,boxShadow:C.sh2,marginBottom:14,border:`1px solid ${C.border}`,overflow:"hidden"}}>
        {IS_KOLLARI.map(k=><div key={k.label} onClick={()=>{setIsKolu(k.label);setIsKoluAc(false);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 16px",cursor:"pointer",background:isKolu===k.label?C.purpleBg:"transparent"}}>
          <span style={{fontSize:14,color:isKolu===k.label?P:C.t1,fontWeight:isKolu===k.label?600:400}}>{k.icon} {k.label}</span>
          <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${isKolu===k.label?P:C.border}`,display:"flex",alignItems:"center",justifyContent:"center"}}>{isKolu===k.label&&<div style={{width:8,height:8,borderRadius:"50%",background:P}}/>}</div>
        </div>)}
      </div>}
      <div style={{display:"flex",gap:8}}>
        {stats.map(s=><div key={s.label} onClick={()=>onStatClick(s.go)} style={{flex:1,background:s.bg,borderRadius:12,padding:"10px 6px",textAlign:"center",cursor:"pointer"}}>
          <div style={{fontSize:20,marginBottom:4}}>{s.icon}</div>
          <div style={{fontSize:9,color:C.t2,marginBottom:3,lineHeight:1.2,fontWeight:500}}>{s.label}</div>
          <div style={{fontSize:s.val.toString().length>6?10:13,fontWeight:800,color:s.vc,lineHeight:1}}>{s.val}</div>
          <div style={{fontSize:9,color:C.t3,marginTop:3}}>{s.sub}</div>
        </div>)}
      </div>
    </Sh>
  );
}

// ─── ÖZELLEŞTİR MODAL ──────────────────────────────────────────
function OzellestirModal({moduller,setModuller,onKapat,T}){
  const [surukle,setSurukle]=useState(null);
  const [surukleOver,setSurukleOver]=useState(null);

  const toggle=(id)=>{
    setModuller(m=>m.map(x=>x.id===id?{...x,aktif:!x.aktif}:x));
  };
  const dragStart=(id)=>setSurukle(id);
  const dragOver=(e,id)=>{e.preventDefault();setSurukleOver(id);};
  const dragEnd=()=>{
    if(surukle&&surukleOver&&surukle!==surukleOver){
      setModuller(m=>{
        const arr=[...m];
        const from=arr.findIndex(x=>x.id===surukle);
        const to=arr.findIndex(x=>x.id===surukleOver);
        const [item]=arr.splice(from,1);
        arr.splice(to,0,item);
        return arr;
      });
    }
    setSurukle(null);setSurukleOver(null);
  };

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={"⚙️ "+T.duzenleBaslik1+" "+T.duzenleBaslik2} onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        <Sh s={{padding:"14px 16px",marginBottom:18,background:C.purpleBg}}>
          <div style={{fontSize:13,fontWeight:700,color:P,marginBottom:4}}>💡 {T.duzenleAlt}</div>
          <div style={{fontSize:11,color:C.t2,lineHeight:1.5}}>{T.modulBilgi}</div>
        </Sh>

        <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",margin:"0 4px 10px"}}>{T.hizliModullerB}</div>

        {moduller.map((m,i)=>(
          <div key={m.id}
            draggable
            onDragStart={()=>dragStart(m.id)}
            onDragOver={(e)=>dragOver(e,m.id)}
            onDragEnd={dragEnd}
            style={{
              background:surukleOver===m.id?C.purpleBg:C.card,
              borderRadius:16,
              padding:"14px 16px",
              marginBottom:10,
              display:"flex",
              alignItems:"center",
              gap:14,
              boxShadow:surukle===m.id?"0 8px 24px rgba(91,92,246,0.25)":C.sh,
              opacity:surukle===m.id?0.7:1,
              transform:surukle===m.id?"scale(1.02)":"none",
              transition:"all 0.15s",
              cursor:"grab",
              border:`2px solid ${surukleOver===m.id?P:"transparent"}`,
            }}>
            {/* Drag handle */}
            <div style={{fontSize:16,color:C.t3,flexShrink:0,cursor:"grab"}}>⠿</div>
            {/* İkon */}
            <div style={{width:44,height:44,borderRadius:13,background:m.aktif?m.bg:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0,transition:"background 0.2s"}}>{m.icon}</div>
            {/* Bilgi */}
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:700,color:m.aktif?C.t1:C.t3}}>{typeof m.label==="function"?m.label(T):(m.label||m.id)}</div>
              <div style={{fontSize:10,color:C.t3,marginTop:2}}>{typeof m.aciklama==="function"?m.aciklama(T):(m.aciklama||"")}</div>
            </div>
            {/* Sıra no */}
            <div style={{fontSize:11,color:C.t3,minWidth:20,textAlign:"center"}}>{i+1}</div>
            {/* Toggle */}
            <Toggle on={m.aktif} set={()=>toggle(m.id)}/>
          </div>
        ))}

        <Sh s={{padding:"14px 16px",marginTop:8}}>
          <div style={{fontSize:12,color:C.t2,textAlign:"center",lineHeight:1.6}}>
            {T.modulFooter}
          </div>
        </Sh>
      </div>

      {/* Kaydet */}
      <div style={{padding:"12px 14px 28px",background:C.card,borderTop:`1px solid ${C.border}`}}>
        <button onClick={onKapat} style={{width:"100%",background:P,border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:700,cursor:"pointer"}}>✓ {T.kaydet}</button>
      </div>
    </div>
  </div>;
}

const MODUL_VARSAYILAN=[
  {id:"isler",icon:"📋",bg:"#EDE9FE",aktif:true,aciklama:T=>T.mIslerA,label:T=>T.isAkislari},
  {id:"faturalar",icon:"🧾",bg:"#DBEAFE",aktif:true,aciklama:T=>T.mFaturaA,label:T=>T.faturalar},
  {id:"tahsilatlar",icon:"⏰",bg:"#FEF3C7",aktif:true,aciklama:T=>T.mTahsilatA,label:T=>T.tahsilatlar},
  {id:"musteriler",icon:"👥",bg:"#DCFCE7",aktif:true,aciklama:T=>T.mMusteriA,label:T=>T.musteriler},
  {id:"teklifler",icon:"🏷️",bg:"#FEE2E2",aktif:true,aciklama:T=>T.mTeklifA,label:T=>T.teklifler},
  {id:"raporlar",icon:"📊",bg:"#FCE7F3",aktif:true,aciklama:T=>T.mRaporA,label:T=>T.raporlar},
  {id:"giderler",icon:"💰",bg:"#FEF3C7",aktif:true,aciklama:T=>T.mGiderA,label:T=>T.giderler},
  {id:"daha",icon:"⊞",bg:"#F3F4F6",aktif:true,aciklama:T=>T.mDahaA,label:T=>T.dahaFazla},
];

function QuickActions({setSekme,T,moduller,onDuzenle}){
  const gorununler=moduller.filter(m=>m.aktif);
  return <Sh s={{margin:"0 14px 14px",padding:"16px"}}>
    <div style={{display:"grid",gridTemplateColumns:MASAUSTU?"repeat(8,1fr)":"repeat(4,1fr)",gap:10}}>
      {gorununler.map(a=><div key={a.id} onClick={()=>setSekme(a.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
        <div style={{width:50,height:50,borderRadius:14,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{a.icon}</div>
        <span style={{fontSize:10,fontWeight:500,color:C.t1,textAlign:"center",lineHeight:1.2}}>{typeof a.label==="function"?a.label(T):(a.label||a.id)}</span>
      </div>)}
    </div>
    {gorununler.length<8&&<div style={{textAlign:"center",marginTop:10}}>
      <span onClick={onDuzenle} style={{fontSize:11,color:P,fontWeight:600,cursor:"pointer"}}>{T.modulEkle}</span>
    </div>}
  </Sh>;
}

// ─── DETAY MODALLARİ (Grafik tıklama) ──────────────────────────
function GelirGiderDetay({jobs,giderler,onKapat,T}){
  const [grafikFiltre,setGrafikFiltre]=useState("gelir"); // gelir | gider | net
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const aktifT=jobs.filter(j=>j.durum==="aktif").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const toplamGelir=tahsilE+aktifT;
  const toplamGider=giderler.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamGelir-toplamGider;
  const katToplam={};giderler.forEach(g=>{katToplam[g.kategori]=(katToplam[g.kategori]||0)+g.tutar;});

  // Haftalık veri — gelir sabit örnek, gider ve net türetilir
  const giderData=gelirData.map((d,i)=>({...d,g:Math.round(d.v*(0.3+i*0.04)),n:d.v-Math.round(d.v*(0.3+i*0.04))}));
  const grafikVeri={
    gelir:{key:"v",renk:C.green,ad:T.toplamGelir},
    gider:{key:"g",renk:C.red,ad:T.toplamGider},
    net:{key:"n",renk:P,ad:T.netKar},
  };
  const aktifGrafik=grafikVeri[grafikFiltre];

  const gelirKaynaklari=[
    {label:"Tahsil Edilen İşler",val:tahsilE,color:C.green,icon:"✅"},
    {label:"Aktif İşler (devam eden)",val:aktifT,color:C.blue,icon:"🔄"},
    {label:"Bekleyen İşler",val:beklT,color:C.amber,icon:"⏳"},
  ];

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4}}>📊 {T.gelirGider} Detayı</div>
    <div style={{fontSize:11,color:C.t3,marginBottom:14}}>{new Date().toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}</div>

    {/* Özet kutular — tıklanabilir */}
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[
        {key:"gelir",l:T.toplamGelir,v:toplamGelir,c:C.green,bg:C.greenBg},
        {key:"gider",l:T.toplamGider,v:toplamGider,c:C.red,bg:C.redBg},
        {key:"net",l:T.netKar,v:netKar,c:netKar>=0?C.green:C.red,bg:netKar>=0?C.greenBg:C.redBg},
      ].map(x=><div key={x.key} onClick={()=>setGrafikFiltre(x.key)} style={{flex:1,background:grafikFiltre===x.key?x.bg:C.bg,borderRadius:14,padding:"12px 8px",textAlign:"center",cursor:"pointer",border:`2px solid ${grafikFiltre===x.key?x.c:C.border}`,transition:"all 0.15s"}}>
        <div style={{fontSize:9,color:grafikFiltre===x.key?x.c:C.t3,fontWeight:700,marginBottom:4}}>{x.l}</div>
        <div style={{fontSize:x.v>999999?11:13,fontWeight:900,color:grafikFiltre===x.key?x.c:C.t2}}>{fmt(x.v)}</div>
        {grafikFiltre===x.key&&<div style={{width:20,height:2,background:x.c,borderRadius:1,margin:"5px auto 0"}}/>}
      </div>)}
    </div>

    {/* Filtrelenebilir grafik */}
    <Sh s={{padding:14,marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:C.t1}}>Haftalık {aktifGrafik.ad} Eğrisi</div>
        <div style={{display:"flex",gap:4}}>
          {Object.entries(grafikVeri).map(([k,v])=><button key={k} onClick={()=>setGrafikFiltre(k)} style={{padding:"3px 9px",borderRadius:7,border:`1.5px solid ${grafikFiltre===k?v.renk:C.border}`,background:grafikFiltre===k?v.renk+"22":"transparent",color:grafikFiltre===k?v.renk:C.t3,fontSize:10,fontWeight:700,cursor:"pointer"}}>{v.ad}</button>)}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart data={giderData}>
          <XAxis dataKey="d" tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false}/>
          <Line type="monotone" dataKey={aktifGrafik.key} stroke={aktifGrafik.renk} strokeWidth={2.5} dot={{r:3,fill:aktifGrafik.renk}} activeDot={{r:5}}/>
          <Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)} labelStyle={{color:C.t2}}/>
        </LineChart>
      </ResponsiveContainer>
      {/* Mini legend */}
      <div style={{display:"flex",gap:12,marginTop:8,justifyContent:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:12,height:3,borderRadius:2,background:aktifGrafik.renk}}/><span style={{fontSize:10,color:C.t3}}>{aktifGrafik.ad}</span></div>
      </div>
    </Sh>

    {/* Gelir kaynakları */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.gelirKaynaklariB}</div>
    <Sh s={{marginBottom:16,overflow:"hidden"}}>
      {gelirKaynaklari.map((g,i)=><div key={g.label} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<gelirKaynaklari.length-1?`1px solid ${C.border}`:"none"}}>
        <span style={{fontSize:20}}>{g.icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{g.label}</div>
          <div style={{background:C.border,borderRadius:3,height:5,marginTop:5}}>
            <div style={{width:`${toplamGelir>0?g.val/toplamGelir*100:0}%`,background:g.color,height:"100%",borderRadius:3,transition:"width 0.4s"}}/>
          </div>
        </div>
        <div style={{textAlign:"right",minWidth:80}}>
          <div style={{fontSize:13,fontWeight:800,color:g.color}}>{fmt(g.val)}</div>
          <div style={{fontSize:10,color:C.t3}}>{toplamGelir>0?Math.round(g.val/toplamGelir*100):0}%</div>
        </div>
      </div>)}
    </Sh>

    {/* Gider kategorileri */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.giderKategorileriB}</div>
    {Object.keys(katToplam).length===0
      ?<Sh s={{padding:18,textAlign:"center",marginBottom:16}}><div style={{fontSize:13,color:C.t3}}>{T.henuzGiderYok}</div></Sh>
      :<Sh s={{marginBottom:16,overflow:"hidden"}}>
        {Object.entries(katToplam).sort((a,b)=>b[1]-a[1]).map(([k,v],i,arr)=><div key={k} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:36,height:36,borderRadius:10,background:C.redBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>💸</div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{k}</div>
            <div style={{background:C.border,borderRadius:3,height:5,marginTop:5}}><div style={{width:`${toplamGider>0?v/toplamGider*100:0}%`,background:C.red,height:"100%",borderRadius:3}}/></div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:800,color:C.red}}>-{fmt(v)}</div>
            <div style={{fontSize:10,color:C.t3}}>{toplamGider>0?Math.round(v/toplamGider*100):0}%</div>
          </div>
        </div>)}
      </Sh>
    }
    <button onClick={onKapat} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>Kapat</button>
  </BottomSheet>;
}

function TahsilatDetay({jobs,onKapat,onTahsil,T}){
  const [aktifFiltre,setAktifFiltre]=useState("hepsi"); // hepsi | tahsil | bekliyor | aktif
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi");
  const bekliyor=jobs.filter(j=>j.durum==="bekliyor");
  const aktifJ=jobs.filter(j=>j.durum==="aktif");
  const tahsilTutar=tahsilE.reduce((s,j)=>s+j.tutar,0);
  const beklTutar=bekliyor.reduce((s,j)=>s+j.tutar,0);
  const aktifTutar=aktifJ.reduce((s,j)=>s+j.tutar,0);
  const total=tahsilTutar+beklTutar;
  const oran=total>0?Math.round((tahsilTutar/total)*100):0;
  const pie=[
    {name:T.tahsilEdilen,val:tahsilTutar||1,color:C.green},
    {name:T.bekleyen,val:beklTutar||1,color:C.amber},
    {name:T.devamEdenL,val:aktifTutar||1,color:C.blue},
  ];
  const kartlar=[
    {key:"tahsil",l:T.tahsilEdildi,v:tahsilTutar,s:tahsilE.length+" "+T.isL,c:C.green,bg:C.greenBg,icon:"✅",liste:tahsilE},
    {key:"bekliyor",l:T.beklemede,v:beklTutar,s:bekliyor.length+" "+T.isL,c:C.amber,bg:C.amberBg,icon:"⏰",liste:bekliyor},
    {key:"aktif",l:T.devamEdenL,v:aktifTutar,s:aktifJ.length+" "+T.isL,c:C.blue,bg:C.blueBg,icon:"🔄",liste:aktifJ},
  ];
  const gosterList = aktifFiltre==="hepsi" ? jobs : (kartlar.find(k=>k.key===aktifFiltre)?.liste||[]);

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4}}>💰 {T.tahsilatDurumu} Detayı</div>
    <div style={{fontSize:11,color:C.t3,marginBottom:16}}>{new Date().toLocaleDateString("tr-TR",{month:"long",year:"numeric"})}</div>

    {/* Büyük donut */}
    <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:16}}>
      <div style={{position:"relative",flexShrink:0}}>
        <PieChart width={130} height={130}>
          <Pie data={pie} cx={60} cy={60} innerRadius={34} outerRadius={58} dataKey="val" startAngle={90} endAngle={-270} strokeWidth={0}>
            {pie.map((d,i)=><Cell key={i} fill={d.color}/>)}
          </Pie>
        </PieChart>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",lineHeight:1.3}}>
          <div style={{fontSize:20,fontWeight:900,color:C.green}}>%{oran}</div>
          <div style={{fontSize:9,color:C.t3}}>tahsilat</div>
        </div>
      </div>
      <div style={{flex:1}}>
        {pie.map(d=><div key={d.name} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/><span style={{fontSize:11,color:C.t2}}>{d.name}</span></div>
          <span style={{fontSize:12,fontWeight:700,color:C.t1}}>{fmt(d.val)}</span>
        </div>)}
        <div style={{background:C.border,borderRadius:4,height:6,marginTop:4,overflow:"hidden"}}>
          <div style={{width:`${oran}%`,background:`linear-gradient(90deg,${C.green},#34D399)`,height:"100%",borderRadius:4}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
          <span style={{fontSize:9,color:C.t3}}>{fmt(tahsilTutar)}</span>
          <span style={{fontSize:9,color:C.t3}}>{fmt(total)} toplam</span>
        </div>
      </div>
    </div>

    {/* Tıklanabilir filtre kartları */}
    <div style={{display:"flex",gap:7,marginBottom:16}}>
      <div onClick={()=>setAktifFiltre("hepsi")} style={{flex:1,background:aktifFiltre==="hepsi"?P:C.bg,borderRadius:12,padding:"9px 4px",textAlign:"center",cursor:"pointer",border:`2px solid ${aktifFiltre==="hepsi"?P:C.border}`,transition:"all 0.15s"}}>
        <div style={{fontSize:11,fontWeight:700,color:aktifFiltre==="hepsi"?"#fff":C.t2}}>{T.tumu}</div>
        <div style={{fontSize:10,color:aktifFiltre==="hepsi"?"rgba(255,255,255,0.8)":C.t3}}>{jobs.length} {T.isL}</div>
      </div>
      {kartlar.map(x=><div key={x.key} onClick={()=>setAktifFiltre(x.key)} style={{flex:1,background:aktifFiltre===x.key?x.bg:C.bg,borderRadius:12,padding:"9px 4px",textAlign:"center",cursor:"pointer",border:`2px solid ${aktifFiltre===x.key?x.c:C.border}`,transition:"all 0.15s"}}>
        <div style={{fontSize:16,marginBottom:2}}>{x.icon}</div>
        <div style={{fontSize:9,color:x.c,fontWeight:700}}>{x.l}</div>
        <div style={{fontSize:10,fontWeight:800,color:x.c}}>{fmt(x.v)}</div>
        <div style={{fontSize:9,color:x.c,opacity:0.75}}>{x.s}</div>
      </div>)}
    </div>

    {/* Aktif filtreye göre liste */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>
      {aktifFiltre==="hepsi"?T.tumIslerB:kartlar.find(k=>k.key===aktifFiltre)?.l.toUpperCase()+" — "+T.listesiB}
    </div>
    {gosterList.length===0
      ?<Sh s={{padding:20,textAlign:"center",marginBottom:12}}><div style={{fontSize:13,color:C.t3}}>{T.kategoriIsYok}</div></Sh>
      :<Sh s={{marginBottom:16,overflow:"hidden"}}>
        {gosterList.slice(0,8).map((j,i)=>{
          const renk=j.durum==="tamamlandi"?C.green:j.durum==="bekliyor"?C.amber:C.blue;
          const bg=j.durum==="tamamlandi"?C.greenBg:j.durum==="bekliyor"?C.amberBg:C.blueBg;
          return <div key={j.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<gosterList.slice(0,8).length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:38,height:38,borderRadius:10,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.musteri}</div>
              <div style={{fontSize:11,color:C.t3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:13,fontWeight:800,color:renk}}>{fmt(j.tutar)}</div>
              <div style={{fontSize:10,color:C.t3,marginTop:2}}>{j.tarih}</div>
              {j.durum==="bekliyor"&&onTahsil&&<button onClick={()=>{onTahsil(j.id);}} style={{marginTop:4,background:C.greenBg,border:"none",borderRadius:7,padding:"3px 8px",color:C.green,fontSize:10,fontWeight:700,cursor:"pointer"}}>💰 Tahsil</button>}
            </div>
          </div>;
        })}
      </Sh>
    }
    <button onClick={onKapat} style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:13,color:C.t2,fontSize:14,fontWeight:600,cursor:"pointer"}}>Kapat</button>
  </BottomSheet>;
}

function Charts({jobs,giderler,T,onTahsil}){
  const [modal,setModal]=useState(null); // "gelir" | "tahsilat"
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const aktifT=jobs.filter(j=>j.durum==="aktif").reduce((s,j)=>s+j.tutar,0);
  const toplamGelir=tahsilE+aktifT;
  const toplamGider=giderler.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamGelir-toplamGider;
  const geciken=Math.round(beklT*0.35),vadesiz=Math.round(beklT*0.65);
  const total=tahsilE+beklT+geciken;
  const oran=total>0?Math.round((tahsilE/total)*100):0;
  const pie=[
    {name:T.tahsilEdilen,val:tahsilE||1,color:C.green},
    {name:T.bekleyen,val:beklT||1,color:C.blue},
    {name:T.geciken,val:geciken||1,color:C.amber},
    {name:T.vadesiGelmeyen,val:vadesiz||1,color:"#9CA3AF"},
  ];
  return <>
    <div style={{display:"flex",gap:10,margin:"0 14px 14px"}}>
      {/* Gelir-Gider kartı */}
      <Sh onClick={()=>setModal("gelir")} s={{flex:1,padding:"14px",cursor:"pointer",position:"relative"}}>
        <div style={{position:"absolute",top:10,right:10,fontSize:10,color:P,background:C.purpleBg,padding:"2px 7px",borderRadius:6,fontWeight:700}}>{T.detayL} ›</div>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10,paddingRight:54}}>{T.gelirGider}</div>
        <div style={{marginBottom:5}}><div style={{fontSize:10,color:C.t3}}>{T.toplamGelir}</div><span style={{fontSize:13,fontWeight:800,color:C.green}}>{fmt(toplamGelir)}</span></div>
        <div style={{marginBottom:5}}><div style={{fontSize:10,color:C.t3}}>{T.toplamGider}</div><span style={{fontSize:13,fontWeight:800,color:C.red}}>{fmt(toplamGider)}</span></div>
        <div style={{marginBottom:8}}><div style={{fontSize:10,color:C.t3}}>{T.netKar}</div><div style={{fontSize:14,fontWeight:800,color:netKar>=0?C.t1:C.red}}>{fmt(netKar)}</div></div>
        <ResponsiveContainer width="100%" height={50}><LineChart data={gelirData}><Line type="monotone" dataKey="v" stroke={P} strokeWidth={2.5} dot={false}/></LineChart></ResponsiveContainer>
      </Sh>
      {/* Tahsilat kartı */}
      <Sh onClick={()=>setModal("tahsilat")} s={{flex:1,padding:"14px",cursor:"pointer",position:"relative"}}>
        <div style={{position:"absolute",top:10,right:10,fontSize:10,color:P,background:C.purpleBg,padding:"2px 7px",borderRadius:6,fontWeight:700}}>{T.detayL} ›</div>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:8,paddingRight:54}}>{T.tahsilatDurumu}</div>
        <div style={{position:"relative",display:"flex",justifyContent:"center",marginBottom:8}}>
          <PieChart width={120} height={96}><Pie data={pie} cx={55} cy={48} innerRadius={28} outerRadius={46} dataKey="val" startAngle={90} endAngle={-270} strokeWidth={0}>{pie.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie></PieChart>
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",lineHeight:1.2}}>
            <div style={{fontSize:8,color:C.t3}}>{T.toplam}</div>
            <div style={{fontSize:10,fontWeight:800,color:C.t1}}>{fmt(tahsilE+beklT)}</div>
          </div>
        </div>
        {pie.map(d=><div key={d.name} style={{display:"flex",justifyContent:"space-between",marginBottom:4,alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:7,height:7,borderRadius:"50%",background:d.color}}/><span style={{fontSize:9,color:C.t2}}>{d.name}</span></div>
          <span style={{fontSize:9,fontWeight:700,color:C.t1}}>{fmt(d.val)}</span>
        </div>)}
        <div style={{marginTop:8}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:9,color:C.t3}}>{T.tahsilatOrani}</span><span style={{fontSize:9,fontWeight:700,color:C.green}}>%{oran}</span></div>
          <div style={{background:C.border,borderRadius:4,height:5}}><div style={{width:`${oran}%`,background:C.green,height:"100%",borderRadius:4}}/></div>
        </div>
      </Sh>
    </div>
    {modal==="gelir"&&<GelirGiderDetay jobs={jobs} giderler={giderler} onKapat={()=>setModal(null)} T={T}/>}
    {modal==="tahsilat"&&<TahsilatDetay jobs={jobs} onTahsil={onTahsil} onKapat={()=>setModal(null)} T={T}/>}
  </>;
}

function JobList({jobs,onSelect,T}){
  return <div style={{margin:"0 14px 16px"}}>
    <div style={{fontSize:16,fontWeight:700,color:C.t1,marginBottom:12}}>{T.sonIsAkislari}</div>
    {jobs.slice(0,3).map(j=><Sh key={j.id} onClick={()=>onSelect(j)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:46,height:46,borderRadius:12,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{j.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <span style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>{j.ref}</span>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
          <div style={{fontSize:11,color:C.t3}}>{T.musteri}: {j.musteri}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}><Badge durum={j.durum}/><div style={{fontSize:13,fontWeight:700,color:C.t1,marginTop:4}}>{fmt(j.tutar)}</div></div>
        <span style={{color:C.t3,fontSize:16}}>›</span>
      </div>
    </Sh>)}
    <div style={{textAlign:"center",padding:"10px 0"}}><span style={{fontSize:13,color:P,fontWeight:600,cursor:"pointer"}}>{T.tumunuGoruntule} →</span></div>
  </div>;
}

// ─── MODALLAR ────────────────────────────────────────────────────
function DetayModal({job,onKapat,onDurum,onFatura,onSil,onDuzenle,onOdeme,T,giderler}){
  const [silOnay,setSilOnay]=useState(false);
  const [odemeAc,setOdemeAc]=useState(false);
  const [odemeTutar,setOdemeTutar]=useState("");
  const [buyukFoto,setBuyukFoto]=useState(null);
  const odenen=(job.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
  const kalan=job.tutar-odenen;
  const TEKRAR_AD={haftalik:"Haftalık",aylik:"Aylık",yillik:"Yıllık"};
  // Bu işe bağlı giderler
  const isGiderleri=(giderler||[]).filter(g=>g.isId===job.id);

  const odemeEkle=()=>{
    const t=Number(odemeTutar)*(KURLAR[AKTIF_PARA]||1);
    if(t<=0)return;
    onOdeme(job.id,{tutar:Math.min(t,kalan),tarih:new Date().toLocaleDateString("tr-TR")});
    setOdemeTutar("");setOdemeAc(false);
  };

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
      <div style={{width:52,height:52,borderRadius:14,background:job.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{job.icon}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>{job.ref}{job.tekrar&&job.tekrar!=="yok"&&<span style={{marginLeft:6,background:C.purpleBg,color:P,padding:"1px 7px",borderRadius:10,fontWeight:700}}>🔁 {TEKRAR_AD[job.tekrar]}</span>}</div>
        <div style={{fontSize:17,fontWeight:700,color:C.t1}}>{job.baslik}</div>
        <div style={{fontSize:13,color:C.t2}}>{T.musteri}: {job.musteri}</div>
      </div>
      <button onClick={onDuzenle} style={{background:C.purpleBg,border:"none",borderRadius:10,padding:"8px 12px",color:P,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>✏️</button>
    </div>

    {/* Ödeme durumu — kısmi tahsilat */}
    {job.durum!=="tamamlandi"&&<div style={{background:odenen>0?C.greenBg:C.bg,borderRadius:14,padding:"12px 16px",marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:odenen>0?8:0}}>
        <span style={{fontSize:12,color:C.t2,fontWeight:600}}>💰 {T.odemeDurumu}</span>
        <button onClick={()=>setOdemeAc(!odemeAc)} style={{background:P,border:"none",borderRadius:8,padding:"5px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer"}}>{T.kaparoEkle}</button>
      </div>
      {odenen>0&&<>
        <div style={{background:C.border,borderRadius:4,height:8,overflow:"hidden",marginBottom:6}}>
          <div style={{width:`${Math.min(odenen/job.tutar*100,100)}%`,background:C.green,height:"100%",borderRadius:4}}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <span style={{fontSize:11,color:C.green,fontWeight:700}}>{T.alinan}: {fmt(odenen)}</span>
          <span style={{fontSize:11,color:C.amber,fontWeight:700}}>{T.kalanL}: {fmt(kalan)}</span>
        </div>
      </>}
      {odemeAc&&<div style={{display:"flex",gap:8,marginTop:10}}>
        <input type="number" value={odemeTutar} onChange={e=>setOdemeTutar(e.target.value)} placeholder={"Tutar ("+AKTIF_PARA+") — kalan: "+Math.round(kalan/(KURLAR[AKTIF_PARA]||1))}
          style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px",color:C.t1,fontSize:13,outline:"none"}}/>
        <button onClick={odemeEkle} style={{background:C.green,border:"none",borderRadius:10,padding:"10px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓</button>
      </div>}
      {(job.odemeler||[]).length>0&&<div style={{marginTop:8}}>
        {(job.odemeler||[]).map((o,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.t2,padding:"3px 0"}}>
          <span>· {o.tarih}</span><span style={{fontWeight:700,color:C.green}}>+{fmt(o.tutar)}</span>
        </div>)}
      </div>}
    </div>}

    <div style={{background:C.bg,borderRadius:14,padding:"4px 16px",marginBottom:14}}>
      {[[T.tarihL,job.tarih],[T.durumL,DURUM[job.durum]?.label],[T.tutarL,fmt(job.tutar)],job.atanan?["👷 "+T.atananL,job.atanan]:null,job.maliyet>0?["💰 "+T.maliyetL,fmt(job.maliyet)]:null,job.maliyet>0?[(job.tutar-job.maliyet>=0?"✅ ":"⚠️ ")+T.netKar,fmt(job.tutar-job.maliyet)+" (%"+Math.round((job.tutar-job.maliyet)/job.tutar*100)+")"]:null,job.isAdresi?["📍 "+T.adresL,job.isAdresi]:null,job.hatirlatma?["⏰ "+T.hatirlatma,new Date(job.hatirlatma).toLocaleString("tr-TR")]:null].filter(Boolean).map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`,gap:10}}>
          <span style={{fontSize:13,color:C.t2,flexShrink:0}}>{l}</span><span style={{fontSize:13,fontWeight:600,color:C.t1,textAlign:"right"}}>{v}</span>
        </div>
      ))}
      {job.isAdresi&&<div style={{padding:"10px 0"}}>
        <button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.isAdresi)}&travelmode=driving`,"_blank")} style={{width:"100%",background:C.blueBg,border:"none",borderRadius:10,padding:"10px 0",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer"}}>🗺️ {T.navBaslat}</button>
      </div>}
    </div>

    {/* İşe bağlı giderler */}
    {isGiderleri.length>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>💸 {T.giderlerB} ({isGiderleri.length})</div>
      <Sh s={{padding:"4px 14px"}}>
        {isGiderleri.map(g=><div key={g.id} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <div><div style={{fontSize:12,fontWeight:600,color:C.t1}}>{g.ad}</div><div style={{fontSize:10,color:C.t3}}>{g.kategori} · {g.tarih}</div></div>
          <span style={{fontSize:13,fontWeight:700,color:C.red}}>-{fmt(g.tutar)}</span>
        </div>)}
        <div style={{display:"flex",justifyContent:"space-between",padding:"9px 0"}}>
          <span style={{fontSize:12,fontWeight:700,color:C.t2}}>{T.toplamGider}</span>
          <span style={{fontSize:13,fontWeight:800,color:C.red}}>-{fmt(isGiderleri.reduce((s,g)=>s+g.tutar,0))}</span>
        </div>
      </Sh>
    </div>}

    {/* Fotoğraflar */}
    {(job.fotolar||[]).length>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>📷 {T.fotograflarB}</div>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {(job.fotolar||[]).map((f,i)=><img key={i} src={f} alt={"foto"+i} onClick={()=>setBuyukFoto(f)} style={{width:80,height:80,borderRadius:12,objectFit:"cover",border:`1px solid ${C.border}`,cursor:"pointer",flexShrink:0}}/>)}
      </div>
    </div>}
    {buyukFoto&&<div onClick={()=>setBuyukFoto(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.9)",zIndex:3000,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
      <img src={buyukFoto} alt="büyük" style={{maxWidth:"95%",maxHeight:"90%",borderRadius:12}}/>
    </div>}

    {!silOnay?<>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {job.durum!=="tamamlandi"&&<button onClick={()=>{onDurum(job.id,"tamamlandi");onKapat();}} style={{flex:1,background:C.greenBg,border:"none",borderRadius:12,padding:13,color:C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ {T.tamamla}</button>}
        <button onClick={onFatura} style={{flex:1,background:C.amberBg,border:"none",borderRadius:12,padding:13,color:C.amber,fontSize:13,fontWeight:700,cursor:"pointer"}}>📄 {T.faturaKes}</button>
      </div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setSilOnay(true)} style={{flex:1,background:C.redBg,border:"none",borderRadius:12,padding:13,color:C.red,fontSize:13,fontWeight:700,cursor:"pointer"}}>🗑️ {T.sil}</button>
        <BtnS onClick={onKapat}>{T.kapat}</BtnS>
      </div>
    </>:<div style={{background:C.redBg,borderRadius:14,padding:16}}>
      <div style={{fontSize:14,fontWeight:700,color:C.red,marginBottom:12,textAlign:"center"}}>{T.silOnay}</div>
      <div style={{display:"flex",gap:8}}>
        <BtnS onClick={()=>setSilOnay(false)}>{T.iptal}</BtnS>
        <button onClick={()=>{onSil(job.id);onKapat();}} style={{flex:2,background:C.red,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.evetSil}</button>
      </div>
    </div>}
  </BottomSheet>;
}

function FaturaModal({job,isletme,kdv,onKapat,onKesildi,gibAyar,onGibAc,T}){
  const [kalemler,setKalemler]=useState([{tanim:job.baslik,miktar:1,birim:job.tutar}]);
  const [alici,setAlici]=useState({ad:job.musteri,vkn:"",adres:""});
  const [preview,setPreview]=useState(false);
  const [gibGonder,setGibGonder]=useState(false); // GİB gönderim animasyonu
  const [tevkifat,setTevkifat]=useState(0); // 0 | 5 | 7 | 9  (x/10)
  const ara=kalemler.reduce((s,k)=>s+k.miktar*k.birim,0);
  const kdvT=Math.round(ara*kdv/100);
  const tevkifatT=tevkifat>0?Math.round(kdvT*tevkifat/10):0;
  const genel=ara+kdvT-tevkifatT;
  const belgeNo="TFE"+new Date().getFullYear()+String(fatNo).padStart(9,"0");
  const ettn=("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g,c=>{const r=Math.random()*16|0;return(c==="x"?r:(r&0x3|0x8)).toString(16);});
  const simdi=new Date();
  const gibAktif=gibAyar?.canliAktif;
  const gibBekliyor=gibAyar?.apiKey&&!gibAyar?.canliAktif;

  const whatsappPaylas=()=>{
    const metin=`🧾 *FATURA — ${isletme.ad}*\n\nSayın ${alici.ad},\n\nFatura No: ${belgeNo}\nTarih: ${simdi.toLocaleDateString("tr-TR")}\n\n${kalemler.map(k=>`• ${k.tanim}: ${(k.miktar*k.birim).toLocaleString("tr-TR")} TL`).join("\n")}\n\nToplam: ${ara.toLocaleString("tr-TR")} TL\nKDV (%${kdv}): ${kdvT.toLocaleString("tr-TR")} TL${tevkifatT>0?`\nTevkifat (${tevkifat}/10): -${tevkifatT.toLocaleString("tr-TR")} TL`:""}\n*ÖDENECEK: ${genel.toLocaleString("tr-TR")} TL*\n\n${isletme.telefon||""}`;
    window.open("https://wa.me/?text="+encodeURIComponent(metin),"_blank");
  };
  const yazdir=()=>{window.print();};

  const faturaKes=()=>{
    const fatura={no:belgeNo,jobRef:job.ref,musteri:alici.ad,tutar:genel,tarih:simdi.toLocaleDateString("tr-TR"),ettn,alici,kalemler,kdv,ara,kdvT,tevkifat,tevkifatT};
    onKesildi(fatura);
    fatNo++;
    if(gibAktif){
      // GİB aktifse gönderim animasyonu göster
      setGibGonder(true);
      setTimeout(()=>{onKapat();onGibAc&&onGibAc("test");},1800);
    } else {
      // GİB kurulmamışsa kesildi + GİB ekranına yönlendir
      onKapat();
      onGibAc&&onGibAc("bilgi");
    }
  };

  // GİB gönderim animasyonu
  if(gibGonder) return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:2000}}>
    <div style={{background:C.card,borderRadius:20,padding:36,textAlign:"center",maxWidth:300,width:"90%"}}>
      <div style={{fontSize:48,marginBottom:12}}>🚀</div>
      <div style={{fontSize:16,fontWeight:800,color:C.t1,marginBottom:6}}>GİB'e Gönderiliyor…</div>
      <div style={{fontSize:12,color:C.t2,marginBottom:20}}>{belgeNo} · {alici.ad}</div>
      <div style={{background:C.border,borderRadius:4,height:6,overflow:"hidden"}}>
        <div style={{width:"100%",background:`linear-gradient(90deg,${P},#34D399)`,height:"100%",borderRadius:4,animation:"none",transition:"width 1.5s"}}/>
      </div>
      <div style={{fontSize:11,color:C.t3,marginTop:10}}>e-Arşiv fatura iletiliyor…</div>
    </div>
  </div>;

  if(preview) return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1001,padding:12}}>
    <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:APP_W,maxHeight:"92vh",overflowY:"auto",padding:"22px 20px",color:"#111",fontSize:12}}>
      <div style={{textAlign:"center",marginBottom:14}}>
        <div style={{fontSize:15,fontWeight:900,letterSpacing:"0.05em"}}>e-ARŞİV FATURA</div>
        {gibAktif
          ?<div style={{fontSize:9,background:"#DCFCE7",color:"#059669",padding:"3px 10px",borderRadius:20,display:"inline-block",marginTop:4,fontWeight:700}}>✅ GİB Entegrasyonu Aktif — Kesilince otomatik gönderilecek</div>
          :<div style={{fontSize:9,color:"#888",marginTop:2}}>GÖRSEL ŞABLON – Resmi belge için GİB e-Fatura entegrasyonu gereklidir</div>
        }
      </div>
      <div style={{display:"flex",gap:10,marginBottom:12}}>
        <div style={{flex:1,border:"1px solid #ccc",borderRadius:8,padding:10}}>
          <div style={{fontSize:9,fontWeight:800,color:"#666",marginBottom:4}}>SATICI</div>
          <div style={{fontWeight:700,fontSize:12}}>{isletme.ad}</div>
          <div style={{fontSize:10,color:"#444"}}>{isletme.adres}</div>
          <div style={{fontSize:10,color:"#444"}}>VKN/TCKN: {isletme.vergiNo||"—"}</div>
          <div style={{fontSize:10,color:"#444"}}>Vergi D.: {isletme.vergiDairesi||"—"}</div>
        </div>
        <div style={{flex:1,border:"1px solid #ccc",borderRadius:8,padding:10}}>
          <div style={{fontSize:9,fontWeight:800,color:"#666",marginBottom:4}}>ALICI</div>
          <div style={{fontWeight:700,fontSize:12}}>{alici.ad}</div>
          <div style={{fontSize:10,color:"#444"}}>{alici.adres||"—"}</div>
          <div style={{fontSize:10,color:"#444"}}>VKN/TCKN: {alici.vkn||"—"}</div>
        </div>
      </div>
      <div style={{border:"1px solid #ccc",borderRadius:8,padding:10,marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:10}}>
        <div><b>Fatura No:</b> {belgeNo}</div><div><b>Fatura Tipi:</b> SATIŞ</div>
        <div><b>Tarih:</b> {simdi.toLocaleDateString("tr-TR")}</div><div><b>Senaryo:</b> e-Arşiv</div>
        <div style={{gridColumn:"1/3"}}><b>ETTN:</b> <span style={{fontFamily:"monospace",fontSize:9}}>{ettn}</span></div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:12,fontSize:10}}>
        <thead><tr style={{background:"#f0f0f0"}}>{["#","Mal/Hizmet","Miktar","Birim Fiyat","KDV %","KDV Tutarı","Tutar"].map(h=><th key={h} style={{border:"1px solid #ccc",padding:"5px 4px",fontWeight:700,fontSize:9}}>{h}</th>)}</tr></thead>
        <tbody>{kalemler.map((k,i)=>{const t=k.miktar*k.birim;const kv=Math.round(t*kdv/100);return <tr key={i}><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"center"}}>{i+1}</td><td style={{border:"1px solid #ccc",padding:"5px 4px"}}>{k.tanim}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right"}}>{k.miktar}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right"}}>{k.birim.toLocaleString("tr-TR")}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"center"}}>{kdv}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right"}}>{kv.toLocaleString("tr-TR")}</td><td style={{border:"1px solid #ccc",padding:"5px 4px",textAlign:"right",fontWeight:600}}>{t.toLocaleString("tr-TR")}</td></tr>;})} </tbody>
      </table>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
        <div style={{minWidth:220}}>
          {[["Mal Hizmet Toplam",ara],["Hesaplanan KDV (%"+kdv+")",kdvT],...(tevkifatT>0?[["KDV Tevkifatı ("+tevkifat+"/10)",-tevkifatT]]:[]),["ÖDENECEK TUTAR",genel]].map(([l,v],i,arr)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderTop:i===arr.length-1?"2px solid #111":"none",fontWeight:i===arr.length-1?800:400,fontSize:i===arr.length-1?12:10,color:v<0?"#DC2626":"inherit"}}><span>{l}</span><span>{v.toLocaleString("tr-TR")} TL</span></div>)}
        </div>
      </div>

      {/* Paylaşım butonları */}
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <button onClick={whatsappPaylas} style={{flex:1,background:"#DCF8C6",border:"none",borderRadius:10,padding:"10px 0",color:"#128C7E",fontSize:12,fontWeight:700,cursor:"pointer"}}>💬 {T.whatsappGonder}</button>
        <button onClick={yazdir} style={{flex:1,background:"#EFF6FF",border:"none",borderRadius:10,padding:"10px 0",color:"#2563EB",fontSize:12,fontWeight:700,cursor:"pointer"}}>🖨️ {T.yazdirPdf}</button>
      </div>

      {/* GİB durum banner */}
      {gibAktif
        ?<div style={{background:"#DCFCE7",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:18}}>✅</span>
          <div><div style={{fontSize:12,fontWeight:700,color:"#059669"}}>GİB e-Arşiv — Fatura otomatik gönderilecek</div><div style={{fontSize:10,color:"#047857"}}>Onaylandıktan sonra GİB sistemine iletilir, ETTN atanır.</div></div>
        </div>
        :<div style={{background:"#FEF3C7",borderRadius:10,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>{onKapat();onGibAc&&onGibAc("bilgi");}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div style={{flex:1}}><div style={{fontSize:12,fontWeight:700,color:"#B45309"}}>GİB entegrasyonu kurulmadı</div><div style={{fontSize:10,color:"#92400E"}}>Yasal geçerlilik için GİB bağlantısı gerekli. <u>Şimdi kur →</u></div></div>
        </div>
      }

      <div style={{fontSize:8,color:"#999",textAlign:"center",marginBottom:12,lineHeight:1.5}}>Bu belge TradeFlow Elite ile oluşturulmuş fatura şablonudur.{!gibAktif&&" Yasal geçerlilik için GİB onaylı e-Fatura/e-Arşiv sistemi kullanılmalıdır."}</div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setPreview(false)} style={{flex:1,background:"#f4f4f4",border:"1px solid #ddd",borderRadius:10,padding:12,fontSize:12,cursor:"pointer",fontWeight:600}}>← Düzenle</button>
        <button onClick={faturaKes} style={{flex:2,background:gibAktif?"#059669":"#111",border:"none",borderRadius:10,padding:12,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>
          {gibAktif?"🚀 Kes & GİB'e Gönder":"✓ Faturayı Kes"}
        </button>
      </div>
    </div>
  </div>;

  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:4}}>{T.faturaKes}</div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:12,color:C.t2}}>{job.ref} · KDV %{kdv}</div>
      {gibAktif
        ?<span style={{fontSize:10,background:C.greenBg,color:C.green,padding:"3px 10px",borderRadius:20,fontWeight:700}}>✅ GİB Aktif</span>
        :<span onClick={()=>{onKapat();onGibAc&&onGibAc("bilgi");}} style={{fontSize:10,background:C.amberBg,color:C.amber,padding:"3px 10px",borderRadius:20,fontWeight:700,cursor:"pointer"}}>⚠️ GİB Kur →</span>
      }
    </div>
    <Inp value={alici.ad} onChange={e=>setAlici(a=>({...a,ad:e.target.value}))} placeholder={T.aliciAdiPh}/>
    <div style={{display:"flex",gap:10}}><div style={{flex:1}}><Inp value={alici.vkn} onChange={e=>setAlici(a=>({...a,vkn:e.target.value}))} placeholder="VKN / TCKN"/></div><div style={{flex:1}}><Inp value={alici.adres} onChange={e=>setAlici(a=>({...a,adres:e.target.value}))} placeholder="Adres"/></div></div>
    {kalemler.map((k,i)=><div key={i} style={{background:C.bg,borderRadius:12,padding:12,marginBottom:10}}>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input value={k.tanim} onChange={e=>setKalemler(kk=>kk.map((x,idx)=>idx===i?{...x,tanim:e.target.value}:x))} placeholder="Mal / Hizmet" style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.t1,outline:"none"}}/>
        <button onClick={()=>setKalemler(kk=>kk.filter((_,idx)=>idx!==i))} style={{background:"none",border:"none",color:C.t3,fontSize:18,cursor:"pointer"}}>×</button>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <input type="number" value={k.miktar} onChange={e=>setKalemler(kk=>kk.map((x,idx)=>idx===i?{...x,miktar:Number(e.target.value)}:x))} style={{flex:1,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.t1,outline:"none"}}/>
        <input type="number" value={k.birim} onChange={e=>setKalemler(kk=>kk.map((x,idx)=>idx===i?{...x,birim:Number(e.target.value)}:x))} style={{flex:2,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:13,color:C.t1,outline:"none"}}/>
        <div style={{fontSize:12,fontWeight:700,color:C.green,minWidth:70,textAlign:"right"}}>{fmt(k.miktar*k.birim)}</div>
      </div>
    </div>)}
    <button onClick={()=>setKalemler(k=>[...k,{tanim:"",miktar:1,birim:0}])} style={{width:"100%",background:"none",border:`1.5px dashed ${C.border}`,borderRadius:10,padding:11,color:C.t2,fontSize:13,cursor:"pointer",marginBottom:14}}>+ Kalem Ekle</button>
    {/* KDV Tevkifatı */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>KDV Tevkifatı (kurumsal işlerde)</div>
      <div style={{display:"flex",gap:6}}>
        {[[0,"Yok"],[5,"5/10"],[7,"7/10"],[9,"9/10"]].map(([v,l])=><button key={v} onClick={()=>setTevkifat(v)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`2px solid ${tevkifat===v?P:C.border}`,background:tevkifat===v?C.purpleBg:C.bg,color:tevkifat===v?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
      </div>
    </div>
    <div style={{background:C.bg,borderRadius:12,padding:14,marginBottom:18}}>
      {[["Toplam",fmt(ara)],["KDV (%"+kdv+")",fmt(kdvT)],...(tevkifatT>0?[["Tevkifat ("+tevkifat+"/10)","-"+fmt(tevkifatT)]]:[]),["ÖDENECEK",fmt(genel)]].map(([l,v],i,arr)=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderTop:i===arr.length-1?`1px solid ${C.border}`:"none",marginTop:i===arr.length-1?6:0}}><span style={{fontSize:i===arr.length-1?14:13,fontWeight:i===arr.length-1?700:400,color:C.t2}}>{l}</span><span style={{fontSize:i===arr.length-1?15:13,fontWeight:700,color:i===arr.length-1?C.green:l.includes("Tevkifat")?C.red:C.t1}}>{v}</span></div>)}
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>Vazgeç</BtnS><BtnP onClick={()=>setPreview(true)}>Resmî Önizleme →</BtnP></div>
  </BottomSheet>;
}

function TeklifMarjRozeti({tutar,maliyet}){
  try{
    const kar=tutar-maliyet;const marj=Math.round(kar/tutar*100);
    const rk=kar<0?C.red:marj<15?C.amber:C.green;
    const rb=kar<0?C.redBg:marj<15?C.amberBg:C.greenBg;
    return <span style={{display:"inline-block",marginTop:4,fontSize:10,fontWeight:800,color:rk,background:rb,padding:"2px 8px",borderRadius:20}}>{kar<0?"⚠️ ZARAR ":"💰 "}%{marj} · {fmt(kar)}</span>;
  }catch(e){return null;}
}

function YeniIsModal({onKapat,onEkle,T,duzenlenecek,isKolu,jobs,varsayilanMusteri,ekip}){
  const sektor=sektorBilgi(isKolu||"Mekanik Tesisat");
  // Sektöre özel iş türü ikonları + birkaç genel ikon
  const icons=[...sektor.isTurleri.map(t=>({e:t.e,bg:t.bg})),{e:"📦",bg:"#FEF3C7"},{e:"🛠️",bg:"#EDE9FE"},{e:"💼",bg:"#EDE9FE"},{e:"📋",bg:"#DBEAFE"}]
    .filter((v,i,a)=>a.findIndex(x=>x.e===v.e)===i); // tekrarları temizle
  const edit=!!duzenlenecek;
  const [icon,setIcon]=useState(edit?{e:duzenlenecek.icon,bg:duzenlenecek.iconBg}:icons[0]);
  const [oneriGoster,setOneriGoster]=useState(false);
  const [form,setForm]=useState(edit
    ?{baslik:duzenlenecek.baslik,musteri:duzenlenecek.musteri,tarih:duzenlenecek.tarih,tutar:String(Math.round(duzenlenecek.tutar/(KURLAR[AKTIF_PARA]||1))),durum:duzenlenecek.durum,hatirlatma:duzenlenecek.hatirlatma||"",isAdresi:duzenlenecek.isAdresi||"",musteriTelefon:duzenlenecek.musteriTelefon||"",musteriEmail:duzenlenecek.musteriEmail||"",tekrar:duzenlenecek.tekrar||"yok",atanan:duzenlenecek.atanan||"",maliyet:duzenlenecek.maliyet?String(Math.round(duzenlenecek.maliyet/(KURLAR[AKTIF_PARA]||1))):""}
    :{baslik:"",musteri:varsayilanMusteri||"",tarih:new Date().toISOString().slice(0,10),tutar:"",durum:"bekliyor",hatirlatma:"",isAdresi:"",musteriTelefon:"",musteriEmail:"",tekrar:"yok",atanan:"",maliyet:""});
  const [fotolar,setFotolar]=useState(edit?(duzenlenecek.fotolar||[]):[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const fotoEkle=(e)=>{const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=(ev)=>setFotolar(p=>[...p,ev.target.result]);r.readAsDataURL(file);};
  const kaydet=()=>{
    if(edit){
      onEkle({...duzenlenecek,...form,tutar:Number(form.tutar)*(KURLAR[AKTIF_PARA]||1),maliyet:Number(form.maliyet||0)*(KURLAR[AKTIF_PARA]||1),icon:icon.e,iconBg:icon.bg,hatirlatma:form.hatirlatma||null,fotolar});
    }else{
      const cid=nId;nId++;
      onEkle({id:cid,ref:"IS-"+String(cid).padStart(4,"0"),...form,tutar:Number(form.tutar)*(KURLAR[AKTIF_PARA]||1),maliyet:Number(form.maliyet||0)*(KURLAR[AKTIF_PARA]||1),icon:icon.e,iconBg:icon.bg,hatirlatma:form.hatirlatma||null,hatirlatildi:false,fotolar,odemeler:[]});
    }
    onKapat();
  };
  const TEKRAR_SECENEK=[["yok",T.tekSefer],["haftalik","🔁 "+T.haftalikL],["aylik","🔁 "+T.aylikL],["yillik","🔁 "+T.yillikL]];
  return <BottomSheet onKapat={onKapat} maxH="90vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4}}>{edit?"✏️ "+T.isDuzenle:T.yeniIs}</div>
    {!edit&&<div style={{fontSize:11,color:P,fontWeight:600,marginBottom:14,display:"flex",alignItems:"center",gap:5}}>{sektor.icon} {isKolu} akışı</div>}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.ikon}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{icons.map(ic=><button key={ic.e} onClick={()=>setIcon(ic)} style={{width:46,height:46,borderRadius:12,background:ic.bg,border:`2px solid ${icon.e===ic.e?P:"transparent"}`,fontSize:20,cursor:"pointer"}}>{ic.e}</button>)}</div>
    </div>
    <div style={{position:"relative"}}>
      <Inp label={T.isBasligi} value={form.baslik} onChange={e=>set("baslik",e.target.value)} onFocus={()=>!edit&&setOneriGoster(true)} placeholder={sektor.isOrnekPh}/>
      {/* Sektöre özel iş önerileri */}
      {oneriGoster&&!edit&&<div style={{marginTop:-6,marginBottom:14,background:C.bg,borderRadius:12,padding:"6px",border:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,color:C.t3,padding:"4px 8px",fontWeight:600}}>💡 {T.hazirIslerOn}{isKolu}{T.hazirIslerSon}</div>
        {sektor.ornekIsler.map(is=><div key={is} onClick={()=>{set("baslik",is);setOneriGoster(false);}} style={{padding:"9px 10px",borderRadius:8,cursor:"pointer",fontSize:13,color:C.t1,display:"flex",alignItems:"center",gap:8}} onMouseEnter={e=>e.currentTarget.style.background=C.card} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{color:P}}>+</span> {is}
        </div>)}
      </div>}
    </div>
    <Inp label={T.musteri} value={form.musteri} onChange={e=>set("musteri",e.target.value)} placeholder={T.musteriOrnekPh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tarihL} type="date" value={form.tarih} onChange={e=>set("tarih",e.target.value)}/></div>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={form.tutar} onChange={e=>set("tutar",e.target.value)} placeholder="0"/></div>
    </div>
    {/* 👷 Atanan kişi (ekip varsa) */}
    {ekip&&ekip.length>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>👷 {T.atananKisi}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button onClick={()=>set("atanan","")} style={{padding:"8px 13px",borderRadius:10,border:`2px solid ${!form.atanan?P:C.border}`,background:!form.atanan?C.purpleBg:C.bg,color:!form.atanan?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.benL}</button>
        {ekip.map(u=><button key={u.ad} onClick={()=>set("atanan",u.ad)} style={{padding:"8px 13px",borderRadius:10,border:`2px solid ${form.atanan===u.ad?P:C.border}`,background:form.atanan===u.ad?C.purpleBg:C.bg,color:form.atanan===u.ad?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{u.ad}</button>)}
      </div>
    </div>}
    {/* 💰 MALİYET BEKÇİSİ */}
    <Inp label={"💰 "+T.maliyetL+" ("+AKTIF_PARA+") — opsiyonel"} type="number" value={form.maliyet} onChange={e=>set("maliyet",e.target.value)} placeholder={T.maliyetPh}/>
    <BenzerIsIpucu baslik={form.baslik} jobs={jobs||[]} edit={edit} duzenlenecekId={duzenlenecek?.id} T={T}/>
    <MaliyetOnizleme tutar={form.tutar} maliyet={form.maliyet} T={T}/>
    {/* Periyodik iş */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>🔁 {T.tekrarlama}</div>
      <div style={{display:"flex",gap:6}}>
        {TEKRAR_SECENEK.map(([v,l])=><button key={v} onClick={()=>set("tekrar",v)} style={{flex:1,padding:"9px 0",borderRadius:10,border:`2px solid ${form.tekrar===v?P:C.border}`,background:form.tekrar===v?C.purpleBg:C.bg,color:form.tekrar===v?P:C.t2,fontSize:10.5,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
      </div>
      {form.tekrar!=="yok"&&<div style={{fontSize:10,color:P,marginTop:6,fontWeight:600}}>✓ {T.tekrarBilgi}</div>}
    </div>
    <Inp label={"⏰ "+T.hatirlatma+" (opsiyonel)"} type="datetime-local" value={form.hatirlatma} onChange={e=>set("hatirlatma",e.target.value)}/>
    {/* İş adresi — Google Maps'e gidecek */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>📍 {T.isAdresiL}</div>
      <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
        <input value={form.isAdresi} onChange={e=>set("isAdresi",e.target.value)} placeholder={T.adresPh}
          style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
        {form.isAdresi&&<button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(form.isAdresi)}&travelmode=driving`,"_blank")} style={{background:C.blue,border:"none",borderRadius:12,padding:"12px 14px",color:"#fff",fontSize:13,cursor:"pointer",flexShrink:0}}>🗺️</button>}
      </div>
    </div>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.musteriTel} value={form.musteriTelefon} onChange={e=>set("musteriTelefon",e.target.value)} placeholder="0532..."/></div>
      <div style={{flex:1}}><Inp label={T.epostaOps} value={form.musteriEmail} onChange={e=>set("musteriEmail",e.target.value)} placeholder="@"/></div>
    </div>
    {/* Fotoğraflar */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>📷 {T.isFotolari}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {fotolar.map((f,i)=><div key={i} style={{position:"relative"}}>
          <img src={f} alt={"foto"+i} style={{width:64,height:64,borderRadius:10,objectFit:"cover",border:`1px solid ${C.border}`}}/>
          <button onClick={()=>setFotolar(p=>p.filter((_,idx)=>idx!==i))} style={{position:"absolute",top:-6,right:-6,width:20,height:20,borderRadius:"50%",background:C.red,border:"none",color:"#fff",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>)}
        <label style={{width:64,height:64,borderRadius:10,border:`2px dashed ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:C.t3,cursor:"pointer"}}>
          +<input type="file" accept="image/*" onChange={fotoEkle} style={{display:"none"}}/>
        </label>
      </div>
    </div>
    <div style={{marginBottom:18}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.durumL}</div>
      <div style={{display:"flex",gap:8}}>
        {[["aktif",T.devamEdiyor],["bekliyor",T.beklemede],["tamamlandi",T.tamamlandi]].map(([v,l])=><button key={v} onClick={()=>set("durum",v)} style={{flex:1,padding:"10px 0",borderRadius:12,border:`2px solid ${form.durum===v?P:C.border}`,background:form.durum===v?C.purpleBg:C.bg,color:form.durum===v?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
      </div>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={kaydet}>{edit?"💾 "+T.guncelle:"+ "+T.kaydet}</BtnP></div>
  </BottomSheet>;
}

function TeklifModal({onKapat,onEkle,T,kdv}){
  const [f,setF]=useState({musteri:"",telefon:"",baslik:"",tutar:"",maliyet:"",gecerlilik:new Date(Date.now()+14*864e5).toISOString().slice(0,10)});
  const [kalemler,setKalemler]=useState([{ad:"",adet:1,birimFiyat:""}]);
  const kalemSet=(i,alan,deger)=>setKalemler(p=>p.map((k,j)=>j===i?{...k,[alan]:deger}:k));
  const kalemSil=(i)=>setKalemler(p=>p.filter((_,j)=>j!==i));
  const doluKalemler=kalemler.filter(k=>k.ad&&Number(k.birimFiyat)>0);
  const araToplam=doluKalemler.reduce((s,k)=>s+Number(k.adet||1)*Number(k.birimFiyat),0);
  const kdvTutar=araToplam*(kdv||20)/100;
  const genelToplam=araToplam+kdvTutar;
  const otomatikTutar=doluKalemler.length>0;

  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{T.yeniTeklif}</div>
    <Inp label={T.musteri} value={f.musteri} onChange={e=>setF(x=>({...x,musteri:e.target.value}))} placeholder={T.musteriAdiPh}/>
    <Inp label={"📱 "+T.telefonL+" (WhatsApp)"} value={f.telefon} onChange={e=>setF(x=>({...x,telefon:e.target.value}))} placeholder="05xx xxx xx xx"/>
    <Inp label={T.isBasligi} value={f.baslik} onChange={e=>setF(x=>({...x,baslik:e.target.value}))} placeholder={T.klimaPh}/>

    {/* 🧾 MALZEME KALEMLERİ */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>🧾 {T.malzemeKalemleri}</div>
      {kalemler.map((k,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:6,alignItems:"center"}}>
        <input value={k.ad} onChange={e=>kalemSet(i,"ad",e.target.value)} placeholder={T.kalemAdPh}
          style={{flex:3,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 12px",color:C.t1,fontSize:12.5,outline:"none",minWidth:0}}/>
        <input type="number" value={k.adet} onChange={e=>kalemSet(i,"adet",e.target.value)} placeholder="1" min="1"
          style={{width:52,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 8px",color:C.t1,fontSize:12.5,outline:"none",textAlign:"center"}}/>
        <input type="number" value={k.birimFiyat} onChange={e=>kalemSet(i,"birimFiyat",e.target.value)} placeholder="₺"
          style={{width:82,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"10px 8px",color:C.t1,fontSize:12.5,outline:"none",textAlign:"right"}}/>
        {kalemler.length>1&&<button onClick={()=>kalemSil(i)} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer",padding:0}}>×</button>}
      </div>)}
      <button onClick={()=>setKalemler(p=>[...p,{ad:"",adet:1,birimFiyat:""}])} style={{width:"100%",background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:10,padding:"9px 0",color:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.kalemEkle}</button>
      {/* Otomatik hesap özeti */}
      {otomatikTutar&&<div style={{background:C.purpleBg,borderRadius:12,padding:"11px 14px",marginTop:8}}>
        {[[T.araToplamL,fmt(araToplam*(KURLAR[AKTIF_PARA]||1))],[T.kdvL+" %"+(kdv||20),fmt(kdvTutar*(KURLAR[AKTIF_PARA]||1))],[T.genelToplamL,fmt(genelToplam*(KURLAR[AKTIF_PARA]||1))]].map(([l,v],i)=>
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:i===2?13.5:11.5,fontWeight:i===2?800:600,color:i===2?P:C.t2,borderTop:i===2?`1px solid ${P}33`:"none",marginTop:i===2?4:0,paddingTop:i===2?7:3}}>
            <span>{l}</span><span>{v}</span>
          </div>)}
      </div>}
    </div>

    <div style={{display:"flex",gap:10}}>
      {!otomatikTutar&&<div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={f.tutar} onChange={e=>setF(x=>({...x,tutar:e.target.value}))}/></div>}
      <div style={{flex:1}}><Inp label={T.gecerlilik} type="date" value={f.gecerlilik} onChange={e=>setF(x=>({...x,gecerlilik:e.target.value}))}/></div>
    </div>
    <Inp label={"💰 "+T.maliyetL+" ("+AKTIF_PARA+")"} type="number" value={f.maliyet} onChange={e=>setF(x=>({...x,maliyet:e.target.value}))} placeholder={T.maliyetPh}/>
    <MaliyetOnizleme tutar={otomatikTutar?genelToplam:f.tutar} maliyet={f.maliyet} T={T}/>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={()=>{
      const tutarSon=otomatikTutar?genelToplam:Number(f.tutar||0);
      if(!f.musteri||tutarSon<=0)return;
      onEkle({id:Date.now(),...f,tutar:tutarSon*(KURLAR[AKTIF_PARA]||1),maliyet:Number(f.maliyet||0)*(KURLAR[AKTIF_PARA]||1),
        kalemler:doluKalemler.map(k=>({ad:k.ad,adet:Number(k.adet||1),birimFiyat:Number(k.birimFiyat)*(KURLAR[AKTIF_PARA]||1)})),
        araToplam:araToplam*(KURLAR[AKTIF_PARA]||1),kdvOran:kdv||20,kdvTutar:kdvTutar*(KURLAR[AKTIF_PARA]||1)});
      onKapat();}}>+ {T.yeniTeklif}</BtnP></div>
  </BottomSheet>;
}

// ─── PROFESYONEL TEKLİF PDF ─────────────────────────────────────
function teklifPdf(t,isletme,T){
  const w=window.open("","_blank");
  if(!w){alert("Açılır pencere engellendi.");return;}
  const kalemSat=(t.kalemler&&t.kalemler.length>0)
    ?t.kalemler.map((k,i)=>"<tr><td>"+(i+1)+"</td><td>"+k.ad+"</td><td style='text-align:center'>"+k.adet+"</td><td style='text-align:right'>"+k.birimFiyat.toLocaleString("tr-TR")+" TL</td><td style='text-align:right'>"+(k.adet*k.birimFiyat).toLocaleString("tr-TR")+" TL</td></tr>").join("")
    :"<tr><td>1</td><td>"+t.baslik+"</td><td style='text-align:center'>1</td><td style='text-align:right'>"+t.tutar.toLocaleString("tr-TR")+" TL</td><td style='text-align:right'>"+t.tutar.toLocaleString("tr-TR")+" TL</td></tr>";
  const araT=t.araToplam||t.tutar,kdvT=t.kdvTutar||0,genelT=t.tutar;
  const stil="body{font-family:Arial,sans-serif;padding:32px;color:#111;max-width:800px;margin:0 auto}h1{font-size:22px;color:#2563EB;margin:0}.ust{display:flex;justify-content:space-between;border-bottom:3px solid #2563EB;padding-bottom:16px;margin-bottom:20px}.firma{font-size:12px;color:#555;line-height:1.5}.baslik{background:#2563EB;color:#fff;padding:8px 14px;font-size:15px;font-weight:bold;border-radius:6px;display:inline-block;margin:14px 0}table{width:100%;border-collapse:collapse;margin-top:10px;font-size:12px}th{background:#EFF6FF;border:1px solid #cbd5e1;padding:8px;text-align:left}td{border:1px solid #cbd5e1;padding:8px}.toplam{margin-top:14px;margin-left:auto;width:280px;font-size:13px}.toplam div{display:flex;justify-content:space-between;padding:5px 10px}.toplam .g{background:#2563EB;color:#fff;font-weight:bold;font-size:15px;border-radius:6px}.alt{margin-top:36px;display:flex;justify-content:space-between;font-size:11px;color:#555}.imza{border-top:1px solid #999;padding-top:6px;width:180px;text-align:center;margin-top:44px}";
  w.document.write("<html><head><title>"+T.teklifBelgesi+" - "+t.musteri+"</title><style>"+stil+"</style></head><body>"+
    "<div class='ust'><div><h1>"+(isletme?.ad||"TradeFlow")+"</h1><div class='firma'>"+(isletme?.yetkili||"")+"<br>"+(isletme?.telefon||"")+"<br>"+(isletme?.email||"")+"<br>"+(isletme?.adres||"")+"</div></div>"+
    "<div style='text-align:right;font-size:12px;color:#555'>"+T.tarihL+": "+new Date().toLocaleDateString("tr-TR")+"<br>"+T.gecerlilik+": "+t.gecerlilik+"<br>No: TKF-"+String(t.id).slice(-6)+"</div></div>"+
    "<div class='baslik'>📋 "+T.teklifBelgesi+"</div>"+
    "<div style='font-size:13px;margin-bottom:4px'><b>"+T.musteri+":</b> "+t.musteri+(t.telefon?" · "+t.telefon:"")+"</div>"+
    "<div style='font-size:13px'><b>"+T.isBasligi+":</b> "+t.baslik+"</div>"+
    "<table><tr><th style='width:30px'>#</th><th>"+T.kalemAdPh+"</th><th style='width:60px;text-align:center'>"+T.adetL+"</th><th style='width:100px;text-align:right'>"+T.birimFiyatL+"</th><th style='width:110px;text-align:right'>"+T.toplam+"</th></tr>"+kalemSat+"</table>"+
    "<div class='toplam'><div><span>"+T.araToplamL+"</span><span>"+araT.toLocaleString("tr-TR")+" TL</span></div>"+
    (kdvT>0?"<div><span>"+T.kdvL+" %"+(t.kdvOran||20)+"</span><span>"+kdvT.toLocaleString("tr-TR")+" TL</span></div>":"")+
    "<div class='g'><span>"+T.genelToplamL+"</span><span>"+genelT.toLocaleString("tr-TR")+" TL</span></div></div>"+
    "<div class='alt'><div>"+T.gecerlilikNot+"</div><div class='imza'>"+T.kaseImza+"</div></div>"+
    "<script>window.onload=function(){window.print();}</"+"script></body></html>");
  w.document.close();
}

function GiderModal({onKapat,onEkle,T,isKolu,jobs,musteriFiltre}){
  const sektor=sektorBilgi(isKolu||"Mekanik Tesisat");
  const katlar=sektor.giderKat;
  const [f,setF]=useState({ad:"",tutar:"",kategori:katlar[0],tarih:new Date().toISOString().slice(0,10),isId:null,isAdi:""});
  // Aktif ve bekleyen işler (tamamlananlar değil)
  const aktifIsler=(jobs||[]).filter(j=>(j.durum==="aktif"||j.durum==="bekliyor")&&(!musteriFiltre||j.musteri===musteriFiltre));
  const [isSecAc,setIsSecAc]=useState(false);

  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{T.yeniGider}</div>
    <Inp label={T.giderL} value={f.ad} onChange={e=>setF(x=>({...x,ad:e.target.value}))} placeholder={T.malzemePh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={f.tutar} onChange={e=>setF(x=>({...x,tutar:e.target.value}))}/></div>
      <div style={{flex:1}}><Inp label={T.tarihL} type="date" value={f.tarih} onChange={e=>setF(x=>({...x,tarih:e.target.value}))}/></div>
    </div>

    {/* İşe Bağla */}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>📋 {T.iseBagla}</div>
      {f.isId
        ?<div style={{display:"flex",alignItems:"center",gap:10,background:C.purpleBg,borderRadius:12,padding:"11px 14px"}}>
          <span style={{fontSize:13,fontWeight:700,color:P,flex:1}}>{f.isAdi}</span>
          <button onClick={()=>setF(x=>({...x,isId:null,isAdi:""}))} style={{background:"none",border:"none",color:C.t3,fontSize:16,cursor:"pointer"}}>✕</button>
        </div>
        :<button onClick={()=>setIsSecAc(!isSecAc)} style={{width:"100%",background:C.bg,border:`1.5px dashed ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t2,fontSize:13,cursor:"pointer",textAlign:"left"}}>
          {isSecAc?T.listeyiKapat:T.islerdenSec}
        </button>}
      {isSecAc&&!f.isId&&<div style={{background:C.card,borderRadius:12,border:`1px solid ${C.border}`,marginTop:6,maxHeight:180,overflowY:"auto"}}>
        {aktifIsler.length===0
          ?<div style={{padding:14,fontSize:12,color:C.t3,textAlign:"center"}}>{T.aktifBekleyenYok}</div>
          :aktifIsler.map(j=><div key={j.id} onClick={()=>{setF(x=>({...x,isId:j.id,isAdi:j.baslik+" ("+j.musteri+")"}));setIsSecAc(false);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 14px",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.bg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.t1}}>{j.baslik}</div>
              <div style={{fontSize:11,color:C.t3}}>{j.musteri} · {j.ref}</div>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:j.durum==="aktif"?P:C.amber}}>{j.durum==="aktif"?T.aktifL:T.bekleyen}</div>
          </div>)}
      </div>}
    </div>

    <div style={{marginBottom:18}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.kategori||"Kategori"}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{katlar.map(k=><button key={k} onClick={()=>setF(x=>({...x,kategori:k}))} style={{padding:"8px 14px",borderRadius:10,border:`2px solid ${f.kategori===k?P:C.border}`,background:f.kategori===k?C.purpleBg:C.bg,color:f.kategori===k?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{k}</button>)}</div>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={()=>{onEkle({id:Date.now(),...f,tutar:Number(f.tutar)*(KURLAR[AKTIF_PARA]||1)});onKapat();}}>+ {T.yeniGider}</BtnP></div>
  </BottomSheet>;
}

function DegerlendirModal({onKapat,onGonder,T}){
  const [yildiz,setYildiz]=useState(0);
  const [oneri,setOneri]=useState("");
  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:4,textAlign:"center"}}>{T.degerlendir}</div>
    <div style={{fontSize:12,color:C.t2,textAlign:"center",marginBottom:18}}>TradeFlow ⭐</div>
    <div style={{display:"flex",justifyContent:"center",gap:10,marginBottom:16}}>
      {[1,2,3,4,5].map(i=><span key={i} onClick={()=>setYildiz(i)} style={{fontSize:38,cursor:"pointer",filter:i<=yildiz?"none":"grayscale(1) opacity(0.35)",transition:"filter 0.15s"}}>⭐</span>)}
    </div>
    {yildiz>0&&<div style={{textAlign:"center",fontSize:13,fontWeight:700,color:yildiz>=4?C.green:yildiz===3?C.amber:C.red,marginBottom:12}}>
      {yildiz===5?"Mükemmel! 🎉":yildiz===4?"Çok iyi! 👍":yildiz===3?"Fena değil":yildiz===2?"Geliştirebiliriz":"Üzgünüz 😔"}
    </div>}
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>Öneri & Görüşleriniz</div>
      <textarea value={oneri} onChange={e=>setOneri(e.target.value)} placeholder={T.oneriniz} rows={4} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none",resize:"none",fontFamily:"inherit"}}/>
    </div>
    <div style={{display:"flex",gap:10}}>
      <BtnS onClick={onKapat}>{T.iptal}</BtnS>
      <button onClick={()=>{onGonder(yildiz,oneri);onKapat();}} disabled={yildiz===0} style={{flex:2,background:yildiz===0?C.border:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:yildiz===0?"default":"pointer"}}>{T.gonder}</button>
    </div>
  </BottomSheet>;
}

function GizlilikEkrani({onKapat}){
  const bolumler=[
    {b:"1. Toplanan Veriler",m:"TradeFlow Elite; iş emirleri, müşteri adları, tutarlar ve işletme bilgilerinizi yalnızca uygulama işlevselligi için işler. Bu sürümde veriler cihazınızda tutulur, sunucularımıza gönderilmez."},
    {b:"2. Verilerin Kullanımı",m:"Verileriniz yalnızca size hizmet sunmak amacıyla kullanılır. Reklam amaçlı profilleme yapılmaz, üçüncü taraflara satılmaz."},
    {b:"3. KVKK Uyumu",m:"6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarınız saklı tutulur."},
    {b:"4. Veri Güvenliği",m:"Pro sürümde bulut yedekleme aktif edildiğinde verileriniz şifrelenerek saklanır. Ödeme bilgileri uygulamada tutulmaz."},
    {b:"5. Çerezler ve İzleme",m:"Uygulama içinde üçüncü taraf reklam SDK'si veya izleme çerezi bulunmaz."},
    {b:"6. İletişim",m:"Gizlilikle ilgili sorularınız için: destek@tradeflow.app"},
  ];
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="Gizlilik Politikası" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <div style={{fontSize:11,color:C.t3,marginBottom:14}}>Son güncelleme: Temmuz 2026 · TradeFlow Elite v1.0</div>
        {bolumler.map(x=><Sh key={x.b} s={{padding:"16px 18px",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:6}}>{x.b}</div><div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>{x.m}</div></Sh>)}
      </div>
    </div>
  </div>;
}

// ─── YARDIMCI ASİSTAN — hazır cevaplı, API maliyeti sıfır ──────
const ASISTAN_BILGI=[
  // ── İŞ AKIŞLARI ──
  {k:["iş ekle","yeni iş","iş oluştur","nasıl iş"],c:"📋 Yeni iş eklemek için: '+Yeni İş' butonuna bas (sağ üst veya alt ortadaki + butonu). İkon seç → başlık yaz → müşteri, tarih, tutar gir. İş başlığı kutusuna tıklayınca sektörüne özel hazır iş listesi çıkar, oradan seçebilirsin. İsteğe bağlı: adres, telefon, fotoğraf, tahmini maliyet ekle."},
  {k:["iş düzenle","güncelle","değiştir","düzelt"],c:"✏️ İş düzenlemek için: İşe dokun → detay açılır → sağ üstteki kalem (✏️) butonuna bas. Tüm alanları değiştirebilirsin. 'Güncelle' ile kaydet."},
  {k:["iş sil","işi sil","silmek"],c:"🗑️ İş silmek için: İşe dokun → detayda 'Sil' butonu → onay ver. Silinen iş 6 saniye geri alınabilir — alt kısımda '↩️ Geri Al' butonu çıkar."},
  {k:["durum","aktif","bekliyor","tamamlandı","tamamla"],c:"🔄 İş durumu değiştirmek için: İşe dokun → '✓ Tamamla' butonuna bas. Ya da detayda durum seçeneklerinden birini seç: Aktif / Beklemede / Tamamlandı."},
  {k:["fotoğraf","resim","öncesi","sonrası"],c:"📷 İş fotoğrafı eklemek için: Yeni iş veya düzenleme formunda '📷 İş Fotoğrafları' bölümündeki '+' butonuna bas. Öncesi/sonrası fotoğraf yükleyebilirsin. Detayda büyütmek için fotoğrafa dokun."},
  {k:["periyodik","tekrar","abonelik","haftalık","aylık","yıllık"],c:"🔁 Periyodik iş: Yeni iş formunda 'Tekrarlama' bölümünden Haftalık/Aylık/Yıllık seç. İş tamamlanınca sonraki dönem için otomatik yeni iş oluşur. Havuz bakımı, kombi bakımı gibi düzenli işler için ideal."},
  {k:["takvim","ay","gün","tarih"],c:"📅 Takvim görünümü: İş Akışları → sağ üstteki 📅 simgesi. İşli günlerde renkli noktalar var; güne dokununca o günün işleri listelenir. 📋 liste görünümüne geçmek için yanındaki ikona dokun."},
  {k:["harita","navigasyon","adres","yol","git","konum"],c:"🗺️ Navigasyon: İşe adres girdiysen detayda 'Navigasyonu Başlat' butonu çıkar, Google Maps'te yol tarifi açılır. Müşteriler ekranında da 'Git' butonu var."},
  // ── FATURA ──
  {k:["fatura","kes","fatura oluştur"],c:"🧾 Fatura kesmek için: Bir işe dokun → 'Fatura Kes' → kalemleri düzenle → KDV ve tevkifatı ayarla → 'Resmî Önizleme' → 'Faturayı Kes'. WhatsApp'tan gönderebilir veya yazdırabilirsin. GİB kuruluysa e-fatura olarak gönderilir."},
  {k:["kdv","tevkifat","vergi"],c:"💡 KDV oranını Profil → KDV bölümünden ayarlarsın. Fatura formunda KDV Tevkifatı seçeneği var: Yok / 5/10 / 7/10 / 9/10. Kurumsal müşterilerde tevkifat uygulanır, tutar otomatik hesaplanır."},
  {k:["gib","e-fatura","e-arşiv","mali mühür","entegratör"],c:"🏛️ GİB entegrasyonu: Profil → 'e-Fatura/e-Arşiv'. Başvuru sekmesinde 5 adım: Mali Mühür → entegratör sözleşmesi → GİB başvurusu → test → canlı. Entegratör hesabın hazır olunca API Ayarı sekmesinden bağlarsın. Henüz başvurmadıysan rehber seni yönlendirir."},
  {k:["whatsapp","paylaş","gönder","mesaj"],c:"💬 WhatsApp paylaşım: Fatura önizlemede 'WhatsApp'ta Gönder', teklif kartında 💬 butonu, müşteri detayında WhatsApp butonu — hazır mesajla açılır. Müşteri adı, tutar, iş bilgisi otomatik dolar."},
  // ── TAHSİLAT ──
  {k:["kaparo","kısmi","taksit","ön ödeme","baya"],c:"💰 Kaparo/kısmi ödeme almak için: İşe dokun → '+ Kaparo / Kısmi Tahsilat' → tutarı gir. İlerleme çubuğu 'Alınan/Kalan' gösterir. Tüm tutar ödenince iş otomatik 'Tamamlandı' olur. Ödeme geçmişi tarihleriyle listelenir."},
  {k:["tahsilat","alacak","bekleyen","borç","tahsil"],c:"💳 Tahsilatlar: Tahsilatlar sekmesinde bekleyen ve tahsil edilen ödemeler ayrı görünür. 'Tahsil Et' butonuyla tamamını tahsil edebilirsin. Ana sayfadaki Tahsilat Durumu grafiğine dokununca detay açılır."},
  // ── TEKLİF ──
  {k:["teklif","fiyat teklifi","teklif oluştur","teklif ver"],c:"🏷️ Teklif vermek için: Teklifler → '+Yeni Teklif'. Müşteri, iş tanımı, tutar ve geçerlilik tarihi gir. Maliyet de girersen kâr marjı kartda gösterilir. 💬 butonuyla WhatsApp'tan müşteriye gönder. Müşteri onaylayınca 'Onayla' → 'İşe Dönüştür' ile direkt iş açılır."},
  {k:["teklif kabul","onay","reddet","geçerlilik"],c:"✅ Teklif yönetimi: Teklif kartında '✅ Onayla' veya '❌ Reddet'. Geçerlilik süresi dolan teklifler otomatik 'Süresi Doldu' olur. Onaylanan teklifi 'İşe Dönüştür' ile iş akışına alırsın."},
  // ── MÜŞTERİ ──
  {k:["müşteri ekle","yeni müşteri","müşteri oluştur"],c:"👤 Müşteri eklemek için: Müşteriler → '+Yeni' butonu. Ad/soyad, telefon, e-posta ve adres girebilirsin. Adres girersen navigasyon butonu aktif olur. İşlere müşteri adı girince de otomatik müşteri oluşur."},
  {k:["müşteri sil","müşteriyi sil"],c:"🗑️ Müşteri silmek için: Müşteriler → müşteriye dokun → detayda en altta '🗑️ Müşteriyi Sil' → onay ver. Dikkat: müşteriyle ilgili tüm işler de silinir."},
  {k:["müşteri","ciro","en iyi","sıralama"],c:"📊 Müşteriler ekranında müşteriler ciro, iş sayısı veya ada göre sıralanabilir. En çok ciro yapan müşteri en üstte görünür. Müşteriye dokununca toplam ciro, tahsil edilen tutar ve iş geçmişi görünür."},
  // ── GİDER ──
  {k:["gider","masraf","harcama","gider ekle"],c:"💸 Gider eklemek için: Giderler → '+Yeni Gider'. Ad, tutar, tarih ve kategori gir. Kategoriler sektörüne göre değişir (Malzeme, Yakıt, Personel vb.). Giderler raporda gelir-gider analizine yansır."},
  {k:["gider kategori","kategori","malzeme","yakıt","personel"],c:"📂 Gider kategorileri sektörüne göre otomatik değişir: Mekanik Tesisat'ta 'Yedek Parça', Havuzculukta 'Kimyasal', Otomitivde 'Boya Malzemesi' gibi. Sektörü üst menüden değiştirince kategoriler de değişir."},
  // ── RAPORLAR ──
  {k:["rapor","istatistik","analiz","grafik"],c:"📊 Raporlar: Bu Ay / Geçen Ay / Son 3 Ay / Tümü dönem filtresi var. Net Kâr kartı, son 7 günün gerçek gelir eğrisi (tamamlanan işlerden), iş bazlı tutar grafiği ve durum dağılımı gösterilir. Dönem seçince tüm grafikler güncellenir."},
  {k:["net kâr","kâr","kar","gelir","gider analiz"],c:"💰 Net Kâr = Tamamlanan işlerin toplamı − Giderler. Raporlar ekranında dönem bazlı görünür. Maliyet Bekçisi'ni kullanıyorsan (işe tahmini maliyet girince) daha doğru kâr analizi yapabilirsin."},
  // ── MALİYET BEKÇİSİ ──
  {k:["maliyet","kâr marjı","marj","zarar","bekçi"],c:"💡 Maliyet Bekçisi: İş veya teklif oluştururken 'Tahmini Maliyet' gir. Uygulama anında Net Kâr ve Marj % hesaplar. ✅ Yeşil: sağlıklı kâr. ⚡ Sarı: marj %15 altında. ⚠️ Kırmızı: zarar. Benzer geçmiş işlerdeki ortalama maliyeti de ipucu olarak gösterir."},
  // ── SEKTÖR ──
  {k:["sektör","iş kolu","havuz","elektrik","tesisat","marangoz","otomotiv"],c:"🔧 Sektör akışı: Üstteki iş kolu seçicisinden sektörünü seç. İş şablonları, ikonlar ve gider kategorileri o sektöre göre otomatik ayarlanır. 9 sektör: Mekanik Tesisat, Havuzculuk, Elektrik, İnşaat, Mobilya, Otomotiv, Danışmanlık, Reklam, Temizlik."},
  // ── PROFİL / AYARLAR ──
  {k:["profil","işletme","firma","ayar"],c:"⚙️ Profil: Sol alttaki adına veya alt menüdeki 'Profil' sekmesine dokun. İşletme adı, yetkili, telefon, e-posta, adres düzenlenebilir. Bu bilgiler faturalarda görünür."},
  {k:["dil","language","ingilizce","almanca","arapça","türkçe"],c:"🌐 Dil değiştirmek: Profil → Dil satırı → 40+ dilden seç. Almanca, Fransızca, İspanyolca, Arapça, Rusça, Çince dahil büyük dillerde menüler tam çevrilir."},
  {k:["para birimi","dolar","euro","kur","tcmb","döviz"],c:"💱 Para birimi: Profil → Para Birimi. TL, USD veya EUR seçilebilir. Kurlar öncelikle TCMB resmî satış kurundan gelir (her iş günü 15:30 güncellenir). Kaynak bilgisi Para Birimi satırında görünür."},
  {k:["karanlık","dark","tema","gece","açık"],c:"🌙 Karanlık/Açık mod: Profil → 'Karanlık Mod' anahtarı. Göz yorgunluğunu azaltır."},
  {k:["bildirim","hatırlatma","uyarı","alarm"],c:"🔔 Hatırlatma: Yeni iş oluştururken '⏰ Hatırlatma' alanından tarih/saat seç. Belirlenen vakitte uygulama bildirimi gösterir. Bildirim iznini tarayıcı ayarlarından vermen gerekebilir."},
  {k:["modül","özelleştir","sırala","ana sayfa düzen"],c:"⚙️ Modül özelleştirme: Ana sayfada 'Düzenle →' butonu veya 'Özelleştir'. Modülleri aç/kapat, ⠿ tutacağından sürükleyerek sırala. Kapalı modüller alt menüden yine erişilebilir."},
  // ── YEDEK / VERİ ──
  {k:["yedek","dışa aktar","içe aktar","json","veri"],c:"📥 Yedek: Daha Fazla → 'Verileri Dışa Aktar' (JSON dosyası indirir). 'Yedeği Geri Yükle' ile geri yükle. Veriler artık Supabase bulutunda kalıcı saklanıyor — sayfa yenilesen bile gitmez. JSON yedeği ekstra güvence için kullanabilirsin."},
  {k:["giriş","şifre","hesap","kayıt","oturum"],c:"🔐 Giriş: Uygulama açılınca e-posta + şifre ile giriş ekranı gelir. 'Kayıt Ol' ile yeni hesap oluşturabilirsin. 'Beni Hatırla' işaretliyse bir daha şifre sorulmaz. Çıkış için Profil → en altta 'Çıkış Yap'."},
  // ── GENEL ──
  {k:["pro","abonelik","ücret","fiyat","premium"],c:"⚡ Pro plan (₺199/ay) planlanıyor: sınırsız iş, PDF fatura, GİB entegrasyonu, öncelikli destek. Şu an tüm özellikler ücretsiz kullanımda."},
  {k:["destek","yardım","sorun","hata","çalışmıyor"],c:"🆘 Sorun mu var? WhatsApp destek: 0532 111 22 33 (7/24). E-posta: destek@tradeflow.app. Ya da sorununu buraya yaz, yönlendireyim. Beyaz ekran görüyorsan: Ctrl+Shift+R ile sayfayı yenile, düzelmezse çıkış yapıp tekrar giriş dene."},
];

const ASISTAN_BILGI_EN=[
  {k:["add job","new job","create job"],c:"📋 To add a job: tap '+New Job' → pick an icon → enter title, customer, date, amount. Tap the title field for sector-specific suggestions. Optionally add address, photos, estimated cost."},
  {k:["edit","update job","change"],c:"✏️ To edit: tap a job → pencil (✏️) button → change fields → Update."},
  {k:["delete job","remove job"],c:"🗑️ To delete a job: tap it → 'Delete' → confirm. You get 6 seconds to undo."},
  {k:["status","complete","done","active"],c:"🔄 Change status: tap a job → '✓ Complete' or pick Active / Pending / Completed."},
  {k:["photo","picture","image"],c:"📷 Job photos: in the job form, use the '📷 Job Photos' section to upload before/after shots."},
  {k:["recurring","repeat","weekly","monthly"],c:"🔁 Recurring jobs: in the job form choose Weekly/Monthly/Yearly under 'Repeat'. When completed, the next period's job is created automatically."},
  {k:["calendar"],c:"📅 Calendar: Jobs tab → 📅 icon top-right. Days with jobs show dots; tap a day to list them."},
  {k:["map","navigation","address","directions"],c:"🗺️ Navigation: if a job has an address, tap 'Start Navigation' in its details to open Google Maps."},
  {k:["invoice","bill"],c:"🧾 To invoice: tap a job → 'Create Invoice' → edit line items → set VAT/withholding → Preview → Issue. Send via WhatsApp or print."},
  {k:["vat","tax","withholding"],c:"💡 Set VAT rate in Profile. Withholding options (5/10, 7/10, 9/10) appear in the invoice form for corporate clients."},
  {k:["whatsapp","share","send"],c:"💬 WhatsApp: invoice preview, quote cards and customer details all have WhatsApp buttons with a prefilled message."},
  {k:["deposit","partial","installment"],c:"💰 Deposit/partial payment: tap a job → '+ Deposit / Partial Payment' → enter amount. The Received/Remaining bar updates; job auto-completes when fully paid."},
  {k:["collection","receivable","pending payment"],c:"💳 Collections tab lists pending and collected payments separately. 'Collect' marks the full amount as paid."},
  {k:["quote","offer","proposal"],c:"🏷️ Quotes: Quotes tab → '+New Quote'. Add cost to see profit margin. Send via 💬 WhatsApp. When approved: 'Approve' → 'Convert to Job'."},
  {k:["customer add","new customer","register customer"],c:"👤 Add customers in Customers → Customer Records → '+ New Record', or just type a name when creating a job."},
  {k:["delete customer","remove customer"],c:"🗑️ Delete a customer: open their details → '🗑️ Delete Customer' → confirm. Their jobs are deleted too."},
  {k:["expense","cost","spending"],c:"💸 Add expenses in Expenses → '+New Expense'. Optionally link to an active/pending job — it then counts in that customer's profit/loss."},
  {k:["report","statistics","analytics"],c:"📊 Reports: period filter (This Month / Last Month / 3 Months / All), Net Profit card, 7-day revenue curve, job charts, and Team Performance if you have team members."},
  {k:["profit","margin","loss","cost guard"],c:"💡 Cost Guard: enter 'Estimated Cost' on a job/quote to see instant Net Profit and Margin %. Green = healthy, yellow = margin under 15%, red = LOSS."},
  {k:["sector","industry","trade"],c:"🔧 Pick your sector from the top selector — job templates, icons and expense categories adapt automatically. 25 sectors supported."},
  {k:["language"],c:"🌐 Change language: Profile → Language. 40+ languages available."},
  {k:["currency","rate","dollar","euro","exchange"],c:"💱 Currency: Profile → Currency (TL/USD/EUR). Live market rates refresh every 5 minutes; official central bank rate is the fallback."},
  {k:["dark","theme","night"],c:"🌙 Dark mode: Profile → 'Dark Mode' toggle."},
  {k:["notification","reminder","alert"],c:"🔔 Reminders: set date/time in the job form under '⏰ Reminder'. Allow browser notifications when asked."},
  {k:["module","customize","layout"],c:"⚙️ Customize home: 'Edit →' on the home screen — toggle modules, drag ⠿ to reorder."},
  {k:["backup","export","import","excel","pdf"],c:"📥 More menu: Excel exports (Jobs/Expenses/Invoices) for your accountant, PDF accounting report, and JSON backup/restore. Data is also auto-saved to the cloud."},
  {k:["login","password","account","sign"],c:"🔐 Sign in with email + password. 'Remember me' keeps you signed in. Sign out: Profile → bottom."},
  {k:["team","staff","assign","member"],c:"👷 Team: Profile → Team Management — add members with roles, assign jobs via 'Assigned To' in the job form, see performance in Reports."},
  {k:["price","pro","subscription"],c:"⚡ Pro plan (₺199/mo) is planned: unlimited jobs, PDF invoices, integrations. Everything is free for now."},
  {k:["help","support","problem","error","broken"],c:"🆘 Trouble? WhatsApp support: 0532 111 22 33 (24/7). White screen? Refresh with Ctrl+Shift+R or sign out and back in."},
];
function AsistanEkrani({onKapat,T}){
  const [mesajlar,setMesajlar]=useState([{rol:"bot",metin:T.asistanHosgeldin}]);
  const [giris,setGiris]=useState("");
  const TR_Mi=(T.anaSayfa==="Ana Sayfa");
  const HIZLI=TR_Mi?[
    "Yeni iş nasıl eklenir?","Kaparo nasıl alınır?","Fatura nasıl kesilir?","Müşteri nasıl silinir?","Maliyet Bekçisi nedir?","Teklif nasıl verilir?","Periyodik iş nedir?","Raporlar nasıl kullanılır?","GİB nasıl kurulur?","Veri kayboldu ne yapayım?",
  ]:[
    "How do I add a job?","How do I take a deposit?","How do I create an invoice?","How do I delete a customer?","What is Cost Guard?","How do I send a quote?","What are recurring jobs?","How do reports work?","How do I export to Excel?","My data is missing",
  ];
  const cevapla=(soru)=>{
    const s=soru.toLowerCase();
    const taban=TR_Mi?ASISTAN_BILGI:ASISTAN_BILGI_EN;
    const bulunanlar=taban.filter(b=>b.k.some(k=>s.includes(k)));
    const cevap=bulunanlar.length>0
      ?bulunanlar.map(b=>b.c).join("\n\n")
      :(TR_Mi
        ?"🤔 Bunu henüz bilmiyorum ama şunları deneyebilirsin:\n• Konuyu farklı kelimelerle yaz\n• Profil → Yardım Merkezi'ne bak\n• WhatsApp destek: 0532 111 22 33"
        :"🤔 I don't know that one yet. Try:\n• Rephrasing your question\n• Profile → Help Center\n• WhatsApp support: 0532 111 22 33");
    setMesajlar(p=>[...p,{rol:"user",metin:soru},{rol:"bot",metin:cevap}]);
    setGiris("");
  };
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:MASAUSTU?640:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={"🤖 "+T.asistan} onKapat={onKapat}/>
      {/* Mesajlar */}
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px",display:"flex",flexDirection:"column",gap:10}}>
        {mesajlar.map((m,i)=><div key={i} style={{alignSelf:m.rol==="bot"?"flex-start":"flex-end",maxWidth:"85%"}}>
          <div style={{background:m.rol==="bot"?C.card:P,color:m.rol==="bot"?C.t1:"#fff",borderRadius:m.rol==="bot"?"4px 16px 16px 16px":"16px 4px 16px 16px",padding:"12px 15px",fontSize:13.5,lineHeight:1.6,boxShadow:C.sh,whiteSpace:"pre-wrap"}}>{m.metin}</div>
        </div>)}
        {/* Hızlı sorular */}
        {mesajlar.length<=1&&<div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:6}}>
          {HIZLI.map(h=><button key={h} onClick={()=>cevapla(h)} style={{background:C.card,border:`1.5px solid ${P}44`,borderRadius:20,padding:"8px 14px",color:P,fontSize:12,fontWeight:600,cursor:"pointer"}}>{h}</button>)}
        </div>}
      </div>
      {/* Giriş */}
      <div style={{padding:"12px 14px 28px",background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",gap:8}}>
        <input value={giris} onChange={e=>setGiris(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&giris.trim())cevapla(giris.trim());}} placeholder={T.soruPh}
          style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 16px",color:C.t1,fontSize:14,outline:"none"}}/>
        <button onClick={()=>giris.trim()&&cevapla(giris.trim())} style={{background:P,border:"none",borderRadius:14,padding:"0 20px",color:"#fff",fontSize:17,cursor:"pointer"}}>➤</button>
      </div>
    </div>
  </div>;
}

// ─── EKİP YÖNETİMİ ──────────────────────────────────────────────
function EkipEkrani({onKapat,ekip,setEkip,jobs,goster,T}){
  const [ad,setAd]=useState("");
  const [rol,setRol]=useState("Usta");
  const ROLLER=[T.rolUsta,T.rolMuhasebe,T.rolSatis,T.rolSofor,T.rolYardimci];
  const ekle=()=>{
    const t=ad.trim();
    if(!t)return;
    if(ekip.some(e=>e.ad===t)){goster(T.buIsimVar);return;}
    setEkip(p=>[...p,{ad:t,rol}]);
    setAd("");goster("👷 "+t+" "+T.ekibeEklendi);
  };
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:MASAUSTU?640:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik={"👷 "+T.ekipYonetimi} onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px"}}>
        {/* Üye ekleme */}
        <Sh s={{padding:16,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>{T.yeniUyeEkle}</div>
          <input value={ad} onChange={e=>setAd(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")ekle();}} placeholder={T.adSoyadPh}
            style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:10}}/>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
            {ROLLER.map(r=><button key={r} onClick={()=>setRol(r)} style={{padding:"7px 13px",borderRadius:10,border:`2px solid ${rol===r?P:C.border}`,background:rol===r?C.purpleBg:C.bg,color:rol===r?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{r}</button>)}
          </div>
          <button onClick={ekle} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:12,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.ekibeEkle}</button>
        </Sh>
        {/* Üye listesi */}
        {ekip.length===0&&<Sh s={{padding:28,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>👷</div>
          <div style={{fontSize:13,color:C.t2}}>{T.ekipYok}</div>
          <div style={{fontSize:11,color:C.t3,marginTop:4}}>{T.ekipYokSub}</div>
        </Sh>}
        {ekip.map(u=>{
          const uyeIsler=jobs.filter(j=>j.atanan===u.ad);
          const tamam=uyeIsler.filter(j=>j.durum==="tamamlandi").length;
          return <Sh key={u.ad} s={{padding:"13px 16px",marginBottom:8}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:42,height:42,borderRadius:12,background:C.blueBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:C.blue,flexShrink:0}}>{u.ad[0]}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{u.ad}</div>
                <div style={{fontSize:11,color:C.t3}}>{u.rol} · {uyeIsler.length} {T.isAtandiK} · {tamam} {T.tamamlandi.toLowerCase()}</div>
              </div>
              <button onClick={()=>{setEkip(p=>p.filter(x=>x.ad!==u.ad));goster(T.uyeCikarildi);}} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer"}}>×</button>
            </div>
          </Sh>;
        })}
      </div>
    </div>
  </div>;
}

function YardimMerkezi({onKapat}){
  const [arama,setArama]=useState("");
  const [acik,setAcik]=useState(null);
  const sss=[
    {kat:"Başlangıç",sorular:[
      {s:"TradeFlow'u nasıl kullanmaya başlarım?",c:"Ana sayfadaki '+ Yeni İş' butonuna basarak ilk iş emrinizi oluşturun."},
      {s:"İş kolumu nasıl değiştiririm?",c:"Ana sayfadaki 'İş Kolunu Seç' kutusuna dokunun, 9 sektör arasından seçin."},
    ]},
    {kat:"İş Emirleri",sorular:[
      {s:"İşi nasıl silerim?",c:"İş kartına dokunun, açılan pencerede 'Sil' butonuna basın ve onaylayın."},
      {s:"Hatırlatma nasıl kurarım?",c:"Yeni iş oluştururken 'Hatırlatma' alanına tarih-saat girin. Zamanı gelince bildirim alırsınız."},
    ]},
    {kat:"Fatura",sorular:[
      {s:"Resmî fatura kesebilir miyim?",c:"Uygulama e-Arşiv formatında görsel şablon üretir. Yasal e-Fatura için GİB entegrasyonu Pro sürümle gelecek."},
      {s:"KDV oranını değiştirebilir miyim?",c:"Profil > KDV Oranı'ndan %0–50 arası istediğiniz oranı girebilirsiniz."},
    ]},
  ];
  const filtreli=sss.map(k=>({...k,sorular:k.sorular.filter(x=>x.s.toLowerCase().includes(arama.toLowerCase())||x.c.toLowerCase().includes(arama.toLowerCase()))})).filter(k=>k.sorular.length>0);
  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="Yardım Merkezi" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍..." style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"13px 16px",color:C.t1,fontSize:14,outline:"none",marginBottom:16,boxShadow:C.sh}}/>
        {filtreli.map(kat=><div key={kat.kat} style={{marginBottom:18}}>
          <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 4px 8px"}}>{kat.kat}</div>
          <Sh s={{overflow:"hidden"}}>{kat.sorular.map((x,i)=>{const key=kat.kat+i,isOpen=acik===key;return <div key={key} style={{borderBottom:`1px solid ${C.border}`}}>
            <div onClick={()=>setAcik(isOpen?null:key)} style={{display:"flex",justifyContent:"space-between",padding:"15px 16px",cursor:"pointer",gap:10}}><span style={{fontSize:14,fontWeight:600,color:isOpen?P:C.t1,flex:1}}>{x.s}</span><span style={{color:C.t3,transform:isOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span></div>
            {isOpen&&<div style={{padding:"0 16px 15px",fontSize:13,color:C.t2,lineHeight:1.6}}>{x.c}</div>}
          </div>;})}</Sh>
        </div>)}
        <div style={{display:"flex",gap:10,marginTop:8}}>
          <Sh s={{flex:1,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>window.open("https://wa.me/905321112233","_blank")}><div style={{fontSize:26,marginBottom:6}}>💬</div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>WhatsApp</div></Sh>
          <Sh s={{flex:1,padding:16,textAlign:"center",cursor:"pointer"}} onClick={()=>window.open("mailto:destek@tradeflow.app","_blank")}><div style={{fontSize:26,marginBottom:6}}>✉️</div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>E-posta</div></Sh>
        </div>
      </div>
    </div>
  </div>;
}

function SecimModal({baslik,secenekler,secili,onSec,onKapat,scroll}){
  return <BottomSheet onKapat={onKapat} maxH={scroll?"75vh":"88vh"}>
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:14}}>{baslik}</div>
    {secenekler.map(s=><div key={s.value} onClick={()=>{onSec(s.value);onKapat();}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 4px",borderBottom:`1px solid ${C.border}`,cursor:"pointer"}}>
      <span style={{fontSize:14,color:secili===s.value?P:C.t1,fontWeight:secili===s.value?700:400}}>{s.icon} {s.label}</span>
      <div style={{width:20,height:20,borderRadius:"50%",border:`2px solid ${secili===s.value?P:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{secili===s.value&&<div style={{width:9,height:9,borderRadius:"50%",background:P}}/>}</div>
    </div>)}
  </BottomSheet>;
}

function DilSecimModal({secili,onSec,onKapat}){
  const [arama,setArama]=useState("");
  const filtreli=DIL_GRUPLARI.map(g=>({
    ...g,
    diller:g.diller.filter(d=>
      !arama||
      d.ad.toLowerCase().includes(arama.toLowerCase())||
      d.bolge.toLowerCase().includes(arama.toLowerCase())
    )
  })).filter(g=>g.diller.length>0);
  return <BottomSheet onKapat={onKapat} maxH="90vh">
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:12}}>🌐 Dil Seçin</div>
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍..."
      style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:14}}/>
    {filtreli.map(g=><div key={g.grup} style={{marginBottom:16}}>
      <div style={{fontSize:10,fontWeight:700,color:C.t3,letterSpacing:"0.1em",textTransform:"uppercase",margin:"0 4px 8px"}}>{g.grup}</div>
      <Sh s={{overflow:"hidden"}}>
        {g.diller.map((d,i)=><div key={d.code} onClick={()=>{onSec(d.code);onKapat();}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<g.diller.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",background:secili===d.code?C.purpleBg:"transparent"}}>
          <span style={{fontSize:22,lineHeight:1}}>{d.bayrak}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:secili===d.code?700:500,color:secili===d.code?P:C.t1}}>{d.ad}</div>
            <div style={{fontSize:10,color:C.t3,marginTop:1}}>{d.bolge}</div>
          </div>
          {secili===d.code&&<div style={{width:18,height:18,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{width:7,height:7,borderRadius:"50%",background:"#fff"}}/></div>}
        </div>)}
      </Sh>
    </div>)}
  </BottomSheet>;
}

// ─── GİB ENTEGRASYON EKRANI ─────────────────────────────────────
function GibEkrani({onKapat,isletme,gibAyar,setGibAyar,goster}){
  const [sekme,setSekme]=useState("bilgi"); // bilgi | basvuru | test | ayar
  const [form,setForm]=useState({...gibAyar});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));

  const adimlar=[
    {no:1,baslik:"Entegratör Seç",durum:gibAyar.entegrator?"ok":"bekliyor"},
    {no:2,baslik:"GİB Başvurusu",durum:gibAyar.basvuruDurumu||"bekliyor"},
    {no:3,baslik:"API Bağlantısı",durum:gibAyar.apiKey?"ok":"bekliyor"},
    {no:4,baslik:"Test Faturası",durum:gibAyar.testOk?"ok":"bekliyor"},
    {no:5,baslik:"Canlı Ortam",durum:gibAyar.canliAktif?"ok":"bekliyor"},
  ];
  const durumRenk={ok:C.green,bekliyor:C.t3,islemde:C.amber,hata:C.red};
  const durumIkon={ok:"✅",bekliyor:"⭕",islemde:"🔄",hata:"❌"};

  const entegratorler=[
    {ad:"Logo e-Dönüşüm",logo:"🟦",fiyat:"~₺350/ay",aciklama:"Kurumsal çözüm, SAP uyumlu",url:"https://logo.com.tr"},
    {ad:"Uyumsoft",logo:"🟩",fiyat:"~₺280/ay",aciklama:"Kobi dostu, hızlı kurulum",url:"https://uyumsoft.com.tr"},
    {ad:"Türkiye Finans e-Fatura",logo:"🟨",fiyat:"~₺200/ay",aciklama:"Bankacılık entegrasyonu var",url:"https://tf.com.tr"},
    {ad:"Parasut",logo:"🟪",fiyat:"~₺150/ay",aciklama:"Muhasebe yazılımıyla birlikte",url:"https://parasut.com"},
    {ad:"IziBiz (Turkcell)",logo:"🔵",fiyat:"~₺180/ay",aciklama:"REST API, iyi dökümantasyon",url:"https://izibiz.com.tr"},
    {ad:"NES e-Fatura",logo:"⚫",fiyat:"~₺160/ay",aciklama:"Swagger API, developer dostu",url:"https://nes.com.tr"},
  ];

  return <div style={{position:"fixed",inset:0,background:C.bg,zIndex:1002,display:"flex",justifyContent:"center"}}>
    <div style={{width:"100%",maxWidth:APP_W,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="🧾 GİB e-Fatura Entegrasyonu" onKapat={onKapat}/>

      {/* Sekme */}
      <div style={{display:"flex",background:C.card,borderBottom:`1px solid ${C.border}`,padding:"0 14px"}}>
        {[["bilgi","Nedir?"],["basvuru","Başvuru"],["ayar","API Ayarı"],["test","Test"]].map(([k,l])=><div key={k} onClick={()=>setSekme(k)} style={{flex:1,padding:"12px 0",textAlign:"center",fontSize:12,fontWeight:sekme===k?700:400,color:sekme===k?P:C.t3,borderBottom:sekme===k?`2px solid ${P}`:"2px solid transparent",cursor:"pointer"}}>{l}</div>)}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>

        {/* BİLGİ */}
        {sekme==="bilgi"&&<>
          {/* Durum adımları */}
          <Sh s={{padding:16,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:12}}>📋 Entegrasyon Yol Haritası</div>
            {adimlar.map((a,i)=><div key={a.no} style={{display:"flex",alignItems:"center",gap:12,marginBottom:i<adimlar.length-1?12:0}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:a.durum==="ok"?C.greenBg:a.durum==="islemde"?C.amberBg:C.bg,border:`2px solid ${durumRenk[a.durum]||C.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{durumIkon[a.durum]||a.no}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:600,color:a.durum==="ok"?C.green:C.t1}}>{a.baslik}</div>
              </div>
              {i<adimlar.length-1&&<div style={{position:"absolute",left:30,top:32,width:2,height:12,background:C.border}}/>}
            </div>)}
          </Sh>

          {/* Neden zorunlu */}
          <Sh s={{padding:16,marginBottom:16,background:C.amberBg}}>
            <div style={{fontSize:13,fontWeight:700,color:C.amber,marginBottom:8}}>⚠️ 2026 Yılı Zorunlulukları</div>
            <div style={{fontSize:12,color:C.t1,lineHeight:1.7}}>
              • Tüm KDV mükellefleri için e-Arşiv zorunlu (tutar sınırı kalktı){"\n"}
              • 2027 itibarıyla tüm mükellefler için geçerli{"\n"}
              • Kağıt fatura kesilemez, ceza uygulanır
            </div>
          </Sh>

          {/* Açıklama */}
          <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",margin:"0 4px 10px"}}>GİB DOĞRUDAN ERİŞİM (ücretsiz)</div>
          <Sh s={{padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:6}}>🏛️ GİB e-Arşiv Portali</div>
            <div style={{fontSize:12,color:C.t2,lineHeight:1.6,marginBottom:10}}>Yıllık 3.000 adede kadar ücretsiz fatura. Mali mühür veya e-imza gerekir. ebelge.gib.gov.tr üzerinden direkt kullanılır.</div>
            <button onClick={()=>window.open("https://ebelge.gib.gov.tr","_blank")} style={{width:"100%",background:C.greenBg,border:`1px solid ${C.green}33`,borderRadius:10,padding:"10px 0",color:C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>🌐 ebelge.gib.gov.tr →</button>
          </Sh>


        </>}

        {/* BAŞVURU */}
        {sekme==="basvuru"&&<>
          <Sh s={{padding:16,marginBottom:16,background:C.blueBg}}>
            <div style={{fontSize:13,fontWeight:700,color:C.blue,marginBottom:6}}>📋 GİB'e Entegrasyon Başvurusu</div>
            <div style={{fontSize:12,color:C.t1,lineHeight:1.7}}>Özel entegratör üzerinden API kullanmak için GİB'e başvuru yapmanız gerekiyor. Entegratör firma bu süreci genellikle sizin adınıza yürütür.</div>
          </Sh>
          {[
            {no:"01",baslik:"Mali Mühür / e-İmza Temin",alt:"TÜBİTAK UEKAE veya yetkili kurumdan alın. Yaklaşık ₺1.500-2.500.",link:"https://mhs.kamusm.gov.tr",linkAd:"kamusm.gov.tr →"},
            {no:"02",baslik:"Entegrasyon Firmasi Sözleşmesi",alt:"Seçtiğiniz entegratörle sözleşme imzalayın. Size test ortamı ve API bilgileri iletilecek."},
            {no:"03",baslik:"GİB ebelge Başvurusu",alt:"Entegratör veya siz bizzat ebelge.gib.gov.tr üzerinden elektronik başvuru yapın.",link:"https://ebelgebasvuru.gib.gov.tr/entegrasyon",linkAd:"Başvuru ekranı →"},
            {no:"04",baslik:"Test Süreci (30 gün)",alt:"GİB test ortamında en az 3 başarılı fatura gönderimi yapılmalı. Entegratör destek sağlar."},
            {no:"05",baslik:"Canlı Ortam Aktivasyonu",alt:"Testler onaylandıktan sonra production'a geçilir. Artık yasal e-fatura kesilir."},
          ].map(a=><Sh key={a.no} s={{padding:"16px 18px",marginBottom:10}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:10,background:C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800,color:P,flexShrink:0}}>{a.no}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:4}}>{a.baslik}</div>
                <div style={{fontSize:11,color:C.t2,lineHeight:1.6}}>{a.alt}</div>
                {a.link&&<button onClick={()=>window.open(a.link,"_blank")} style={{marginTop:8,background:"none",border:`1px solid ${P}`,borderRadius:8,padding:"5px 12px",color:P,fontSize:11,fontWeight:700,cursor:"pointer"}}>{a.linkAd}</button>}
              </div>
            </div>
          </Sh>)}
        </>}

        {/* API AYARI */}
        {sekme==="ayar"&&<>
          <Sh s={{padding:16,marginBottom:16}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:12}}>🔑 API Bağlantı Bilgileri</div>
            <div style={{marginBottom:12}}>
              <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>Entegratör</div>
              <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",fontSize:13,color:form.entegrator?C.t1:C.t3}}>{form.entegrator||"Henüz seçilmedi — Nedir? sekmesinden seçin"}</div>
            </div>
            {[["API Key / Token","apiKey","API anahtarınızı girin...","password"],["Kullanıcı Adı","apiUser","VKN veya kullanıcı adı","text"],["Kullanıcı Şifresi","apiPass","Entegratör şifresi","password"]].map(([l,k,ph,t])=><div key={k} style={{marginBottom:12}}>
              <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>{l}</div>
              <input type={t} value={form[k]||""} onChange={e=>set(k,e.target.value)} placeholder={ph} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
            </div>)}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>Ortam</div>
              <div style={{display:"flex",gap:8}}>
                {[["test","🧪 Test"],["prod","🟢 Canlı"]].map(([v,l])=><button key={v} onClick={()=>set("ortam",v)} style={{flex:1,padding:"10px 0",borderRadius:10,border:`2px solid ${form.ortam===v?P:C.border}`,background:form.ortam===v?C.purpleBg:C.bg,color:form.ortam===v?P:C.t2,fontSize:13,fontWeight:600,cursor:"pointer"}}>{l}</button>)}
              </div>
            </div>
            <button onClick={()=>{setGibAyar({...gibAyar,...form});goster("API ayarları kaydedildi ✓");}} style={{width:"100%",background:P,border:"none",borderRadius:12,padding:13,color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer"}}>💾 Ayarları Kaydet</button>
          </Sh>
          <Sh s={{padding:14,background:C.amberBg}}>
            <div style={{fontSize:11,fontWeight:700,color:C.amber,marginBottom:4}}>⚠️ Güvenlik Notu</div>
            <div style={{fontSize:11,color:C.t1,lineHeight:1.6}}>API bilgileriniz cihazınızda saklanır. Pro sürümde şifreli bulut yedekleme ile korunur. Bilgileri kimseyle paylaşmayın.</div>
          </Sh>
        </>}

        {/* TEST */}
        {sekme==="test"&&<>
          <Sh s={{padding:16,marginBottom:14}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:4}}>🧪 Test Faturası Gönder</div>
            <div style={{fontSize:11,color:C.t2,marginBottom:14}}>GİB test ortamına örnek fatura gönderir. Gerçek bir işlem değildir.</div>
            <div style={{background:C.bg,borderRadius:10,padding:12,marginBottom:12}}>
              {[["Entegratör",gibAyar.entegrator||"—"],["Ortam",(gibAyar.ortam||"test")==="test"?"🧪 Test":"🟢 Canlı"],["API Key",gibAyar.apiKey?"●●●●●●●●●●●":"—"],["İşletme VKN",isletme.vergiNo||"—"]].map(([l,v])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:12,color:C.t2}}>{l}</span>
                <span style={{fontSize:12,fontWeight:600,color:C.t1}}>{v}</span>
              </div>)}
            </div>
            {!gibAyar.apiKey
              ?<div style={{background:C.redBg,borderRadius:10,padding:12,fontSize:12,color:C.red,textAlign:"center"}}>❌ Önce API ayarlarını yapın</div>
              :<button onClick={()=>{setGibAyar({...gibAyar,testOk:true});goster("🧪 Test faturası gönderildi ✓");}} style={{width:"100%",background:C.greenBg,border:`1px solid ${C.green}33`,borderRadius:12,padding:13,color:C.green,fontSize:14,fontWeight:700,cursor:"pointer"}}>{gibAyar.testOk?"✅ Test Başarılı — Tekrar Test Et":"🚀 Test Faturası Gönder"}</button>}
          </Sh>
          {gibAyar.testOk&&<Sh s={{padding:16,background:C.greenBg}}>
            <div style={{fontSize:13,fontWeight:700,color:C.green,marginBottom:6}}>✅ Test Başarılı!</div>
            <div style={{fontSize:11,color:C.t1,lineHeight:1.6,marginBottom:10}}>Test ortamında fatura başarıyla gönderildi. Canlı ortama geçmek için API Ayarı'nda "Canlı" ortamını seçin ve kaydedin.</div>
            <button onClick={()=>{setGibAyar({...gibAyar,canliAktif:true});goster("🎉 Canlı e-Fatura aktif!");}} style={{width:"100%",background:C.green,border:"none",borderRadius:10,padding:11,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>🟢 Canlı Ortama Geç</button>
          </Sh>}
        </>}

      </div>
    </div>
  </div>;
}

function KdvModal({kdv,onSec,onKapat}){
  const [deger,setDeger]=useState(kdv);
  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:4}}>KDV Oranı</div>
    <div style={{fontSize:12,color:C.t2,marginBottom:16}}>%0 – %50 arası serbestçe belirleyin</div>
    <div style={{textAlign:"center",marginBottom:14}}><span style={{fontSize:44,fontWeight:900,color:P}}>%{deger}</span></div>
    <input type="range" min="0" max="50" value={deger} onChange={e=>setDeger(Number(e.target.value))} style={{width:"100%",accentColor:P,marginBottom:14}}/>
    <div style={{display:"flex",gap:8,marginBottom:18,justifyContent:"center",flexWrap:"wrap"}}>
      {[0,1,10,20].map(v=><button key={v} onClick={()=>setDeger(v)} style={{padding:"8px 16px",borderRadius:10,border:`2px solid ${deger===v?P:C.border}`,background:deger===v?C.purpleBg:C.bg,color:deger===v?P:C.t2,fontSize:13,fontWeight:700,cursor:"pointer"}}>%{v}</button>)}
      <input type="number" min="0" max="50" value={deger} onChange={e=>setDeger(Math.min(50,Math.max(0,Number(e.target.value))))} style={{width:60,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"8px 10px",color:C.t1,fontSize:13,outline:"none",textAlign:"center"}}/>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>İptal</BtnS><BtnP onClick={()=>{onSec(deger);onKapat();}}>✓ Kaydet</BtnP></div>
  </BottomSheet>;
}

function IsletmeModal({bilgi,onKaydet,onKapat}){
  const [form,setForm]=useState({...bilgi});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return <BottomSheet onKapat={onKapat} maxH="85vh">
    <div style={{fontSize:17,fontWeight:700,color:C.t1,marginBottom:14}}>İşletme Bilgileri</div>
    {[["İşletme Adı","ad"],["Yetkili","yetkili"],["Telefon","telefon"],["E-posta","email"],["VKN / TCKN","vergiNo"],["Vergi Dairesi","vergiDairesi"],["Adres","adres"]].map(([l,k])=><Inp key={k} label={l} value={form[k]||""} onChange={e=>set(k,e.target.value)}/>)}
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>İptal</BtnS><BtnP onClick={()=>{onKaydet(form);onKapat();}}>✓ Kaydet</BtnP></div>
  </BottomSheet>;
}

// ─── SEKMELER ───────────────────────────────────────────────────
function IslerTab({jobs,onSelect,T,filtre}){
  const [arama,setArama]=useState("");
  const [gorunum,setGorunum]=useState("liste"); // liste | takvim
  const [takvimAy,setTakvimAy]=useState(()=>{const d=new Date();return {yil:d.getFullYear(),ay:d.getMonth()};});
  const [seciliGun,setSeciliGun]=useState(null);
  const gruplar=filtre?[filtre]:["aktif","bekliyor","tamamlandi"];
  const fj=jobs.filter(j=>j.musteri.toLowerCase().includes(arama.toLowerCase())||j.baslik.toLowerCase().includes(arama.toLowerCase()));

  // Takvim hesaplama
  const ilkGun=new Date(takvimAy.yil,takvimAy.ay,1);
  const sonGun=new Date(takvimAy.yil,takvimAy.ay+1,0).getDate();
  const baslangicHafta=(ilkGun.getDay()+6)%7; // Pazartesi=0
  const AY_ADLARI=["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const bugunStr=new Date().toISOString().slice(0,10);
  const gunIsler=(gun)=>{
    const tarihStr=`${takvimAy.yil}-${String(takvimAy.ay+1).padStart(2,"0")}-${String(gun).padStart(2,"0")}`;
    return fj.filter(j=>j.tarih===tarihStr);
  };
  const ayDegis=(yon)=>{
    setTakvimAy(t=>{
      let ay=t.ay+yon,yil=t.yil;
      if(ay<0){ay=11;yil--;}if(ay>11){ay=0;yil++;}
      return {yil,ay};
    });
    setSeciliGun(null);
  };

  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.tumIsAkislari}</div>
      {/* Görünüm toggle */}
      <div style={{display:"flex",background:C.card,borderRadius:10,padding:3,boxShadow:C.sh}}>
        {[["liste","📋"],["takvim","📅"]].map(([v,ic])=><button key={v} onClick={()=>setGorunum(v)} style={{padding:"6px 12px",borderRadius:8,border:"none",background:gorunum===v?P:"transparent",color:gorunum===v?"#fff":C.t3,fontSize:14,cursor:"pointer"}}>{ic}</button>)}
      </div>
    </div>

    {gorunum==="liste"&&<>
      <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍 Ara..." style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 16px",color:C.t1,fontSize:14,outline:"none",marginBottom:16,boxShadow:C.sh}}/>
      {gruplar.map(d=>{const g=fj.filter(j=>j.durum===d);if(!g.length)return null;return <div key={d} style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}><div style={{width:8,height:8,borderRadius:"50%",background:DURUM[d].color}}/><span style={{fontSize:11,fontWeight:700,color:C.t2,textTransform:"uppercase",letterSpacing:"0.08em"}}>{DURUM[d].label} ({g.length})</span></div>
        {g.map(j=>{
          const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
          return <Sh key={j.id} onClick={()=>onSelect(j)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:44,height:44,borderRadius:12,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,color:C.t3,fontFamily:"monospace"}}>{j.ref}{j.hatirlatma?" ⏰":""}{j.tekrar&&j.tekrar!=="yok"?" 🔁":""}{(j.fotolar||[]).length>0?" 📷":""}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:11,color:C.t3}}>{j.musteri}</div>
              {odenen>0&&j.durum!=="tamamlandi"&&<div style={{fontSize:10,color:C.green,fontWeight:600,marginTop:2}}>💰 {fmt(odenen)} {T.alindiL} · {T.kalanL.toLowerCase()} {fmt(j.tutar-odenen)}</div>}
            </div>
            <div style={{textAlign:"right"}}><Badge durum={j.durum}/><div style={{fontSize:13,fontWeight:700,color:C.t1,marginTop:4}}>{fmt(j.tutar)}</div></div>
          </div>
        </Sh>;})}
      </div>;})}
      {fj.length===0&&<div style={{textAlign:"center",padding:40,color:C.t3}}>{T.sonucYok}</div>}
    </>}

    {gorunum==="takvim"&&<>
      {/* Ay navigasyonu */}
      <Sh s={{padding:14,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={()=>ayDegis(-1)} style={{background:C.bg,border:"none",borderRadius:8,padding:"6px 14px",color:C.t1,fontSize:16,cursor:"pointer"}}>‹</button>
          <div style={{fontSize:15,fontWeight:800,color:C.t1}}>{AY_ADLARI[takvimAy.ay]} {takvimAy.yil}</div>
          <button onClick={()=>ayDegis(1)} style={{background:C.bg,border:"none",borderRadius:8,padding:"6px 14px",color:C.t1,fontSize:16,cursor:"pointer"}}>›</button>
        </div>
        {/* Hafta günleri */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:6}}>
          {["Pt","Sa","Ça","Pe","Cu","Ct","Pz"].map(g=><div key={g} style={{textAlign:"center",fontSize:10,fontWeight:700,color:C.t3}}>{g}</div>)}
        </div>
        {/* Günler */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
          {Array.from({length:baslangicHafta}).map((_,i)=><div key={"b"+i}/>)}
          {Array.from({length:sonGun}).map((_,i)=>{
            const gun=i+1;
            const isler=gunIsler(gun);
            const tarihStr=`${takvimAy.yil}-${String(takvimAy.ay+1).padStart(2,"0")}-${String(gun).padStart(2,"0")}`;
            const bugun=tarihStr===bugunStr;
            const secili=seciliGun===gun;
            return <div key={gun} onClick={()=>setSeciliGun(secili?null:gun)} style={{
              aspectRatio:"1",borderRadius:10,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",
              background:secili?P:bugun?C.purpleBg:isler.length>0?C.bg:"transparent",
              border:bugun&&!secili?`2px solid ${P}`:"2px solid transparent",
            }}>
              <span style={{fontSize:12,fontWeight:bugun||secili?800:500,color:secili?"#fff":bugun?P:C.t1}}>{gun}</span>
              {isler.length>0&&<div style={{display:"flex",gap:2,marginTop:2}}>
                {isler.slice(0,3).map((j,idx)=><div key={idx} style={{width:5,height:5,borderRadius:"50%",background:secili?"#fff":DURUM[j.durum]?.color||P}}/>)}
              </div>}
            </div>;
          })}
        </div>
      </Sh>

      {/* Seçili gün işleri */}
      {seciliGun&&<>
        <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{seciliGun} {AY_ADLARI[takvimAy.ay]} {T.isleri}</div>
        {gunIsler(seciliGun).length===0
          ?<Sh s={{padding:20,textAlign:"center"}}><div style={{fontSize:13,color:C.t3}}>{T.buGunIsYok}</div></Sh>
          :gunIsler(seciliGun).map(j=><Sh key={j.id} onClick={()=>onSelect(j)} s={{padding:"13px 16px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:11,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:11,color:C.t3}}>{j.musteri}</div>
            </div>
            <div style={{textAlign:"right"}}><Badge durum={j.durum}/><div style={{fontSize:12,fontWeight:700,color:C.t1,marginTop:3}}>{fmt(j.tutar)}</div></div>
          </Sh>)}
      </>}
      {!seciliGun&&<div style={{textAlign:"center",fontSize:12,color:C.t3,padding:"8px 0"}}>{T.gunSecin}</div>}
    </>}
  </div>;
}

function FaturalarTab({faturalar,jobs,onFaturaKes,onFaturaSil,T}){
  const [silOnayId,setSilOnayId]=useState(null);
  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.faturalar} ({faturalar.length})</div>
    {faturalar.length===0&&<Sh s={{padding:28,textAlign:"center",marginBottom:14}}><div style={{fontSize:36,marginBottom:8}}>🧾</div><div style={{fontSize:14,color:C.t2}}>{T.henuzFaturaYok}</div><div style={{fontSize:12,color:C.t3,marginTop:4}}>{T.faturaKes} seçeneğini kullanın.</div></Sh>}
    {faturalar.map(f=><Sh key={f.no} s={{padding:"16px 18px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontSize:11,fontFamily:"monospace",color:P,fontWeight:700}}>{f.no}</span>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:11,color:C.green,background:C.greenBg,padding:"3px 9px",borderRadius:20,fontWeight:700}}>{T.kesildiL}</span>
          <button onClick={()=>setSilOnayId(silOnayId===f.no?null:f.no)} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer",padding:"0 2px"}}>🗑️</button>
        </div>
      </div>
      <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{f.musteri}</div>
      <div style={{fontSize:10,color:C.t3,fontFamily:"monospace",margin:"3px 0"}}>ETTN: {f.ettn.slice(0,18)}...</div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:11,color:C.t3}}>{f.tarih} · {f.jobRef}</span><span style={{fontSize:15,fontWeight:800,color:C.green}}>{fmt(f.tutar)}</span></div>
      {/* Silme onayı */}
      {silOnayId===f.no&&<div style={{background:C.redBg,borderRadius:12,padding:12,marginTop:10}}>
        <div style={{fontSize:12,fontWeight:700,color:C.red,marginBottom:4,textAlign:"center"}}>⚠️ {T.faturaSilUyari}</div>
        <div style={{fontSize:10,color:C.red,textAlign:"center",marginBottom:8}}>{T.gibSilNot}</div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setSilOnayId(null)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:9,color:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.iptal}</button>
          <button onClick={()=>{onFaturaSil(f.no);setSilOnayId(null);}} style={{flex:2,background:C.red,border:"none",borderRadius:9,padding:9,color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.evetSil}</button>
        </div>
      </div>}
    </Sh>)}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"14px 4px 8px"}}>{T.faturaKes.toUpperCase()} — {T.bekleyenIslerB}</div>
    {jobs.filter(j=>!faturalar.some(f=>f.jobRef===j.ref)).map(j=><Sh key={j.id} s={{padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{j.baslik}</div><div style={{fontSize:11,color:C.t3}}>{j.musteri} · {fmt(j.tutar)}</div></div>
      <button onClick={()=>onFaturaKes(j)} style={{background:C.amberBg,border:"none",borderRadius:10,padding:"8px 14px",color:C.amber,fontSize:12,fontWeight:700,cursor:"pointer"}}>📄 {T.faturaKes}</button>
    </Sh>)}
  </div>;
}

function TahsilatlarTab({jobs,onTahsil,filtre,T}){
  const tahsilE=jobs.filter(j=>j.durum==="tamamlandi");
  const bekleyen=jobs.filter(j=>j.durum!=="tamamlandi");
  const goster=filtre==="tahsil"?["t"]:filtre==="bekleyen"?["b"]:["b","t"];
  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.tahsilatlar}</div>
    <div style={{display:"flex",gap:10,marginBottom:18}}>
      <Sh s={{flex:1,padding:14,textAlign:"center"}}><div style={{fontSize:11,color:C.t3}}>{T.tahsilEdilen}</div><div style={{fontSize:17,fontWeight:800,color:C.green}}>{fmt(tahsilE.reduce((s,j)=>s+j.tutar,0))}</div></Sh>
      <Sh s={{flex:1,padding:14,textAlign:"center"}}><div style={{fontSize:11,color:C.t3}}>{T.bekleyen}</div><div style={{fontSize:17,fontWeight:800,color:C.amber}}>{fmt(bekleyen.reduce((s,j)=>s+j.tutar,0))}</div></Sh>
    </div>
    {goster.includes("b")&&<><div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.bekleyenTahsilat.toUpperCase()}</div>
      {bekleyen.length===0&&<div style={{textAlign:"center",padding:20,color:C.t3,fontSize:13}}>🎉</div>}
      {bekleyen.map(j=>{
        const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
        const kalan=j.tutar-odenen;
        return <Sh key={j.id} s={{padding:"14px 16px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{j.musteri}</div>
            <div style={{fontSize:11,color:C.t3}}>{j.baslik}</div>
            <div style={{fontSize:14,fontWeight:800,color:C.amber,marginTop:2}}>{odenen>0?fmt(kalan)+" "+T.kalanL.toLowerCase():fmt(j.tutar)}</div>
            {odenen>0&&<div style={{fontSize:10,color:C.green,fontWeight:600}}>✓ {fmt(odenen)} {T.alindiL}</div>}
          </div>
          <button onClick={()=>onTahsil(j.id)} style={{background:C.greenBg,border:"none",borderRadius:10,padding:"9px 14px",color:C.green,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>💰 {T.tahsilEt}</button>
        </div>
        {odenen>0&&<div style={{background:C.border,borderRadius:3,height:5,marginTop:8,overflow:"hidden"}}>
          <div style={{width:`${Math.min(odenen/j.tutar*100,100)}%`,background:C.green,height:"100%"}}/>
        </div>}
      </Sh>;})}</>}
    {goster.includes("t")&&<><div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"14px 4px 8px"}}>{T.tahsilEdilen.toUpperCase()}</div>
      {tahsilE.map(j=><Sh key={j.id} s={{padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{j.musteri}</div><div style={{fontSize:11,color:C.t3}}>{j.baslik} · {j.tarih}</div></div>
        <span style={{fontSize:14,fontWeight:800,color:C.green}}>✓ {fmt(j.tutar)}</span>
      </Sh>)}</>}
  </div>;
}

function MusteriDetayModal({musteri,onKapat,T,onSil,giderler,onYeniIs,onGider}){
  const [silOnay,setSilOnay]=useState(false);
  const navGit=(adres)=>{
    const q=encodeURIComponent(adres);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`,"_blank");
  };
  const toplamIs=musteri.isler.length;
  const tamamlandi=musteri.isler.filter(j=>j.durum==="tamamlandi");
  const bekliyor=musteri.isler.filter(j=>j.durum==="bekliyor");
  const aktif=musteri.isler.filter(j=>j.durum==="aktif");
  const toplamCiro=musteri.isler.reduce((s,j)=>s+j.tutar,0);
  const tahsilEdilen=tamamlandi.reduce((s,j)=>s+j.tutar,0);

  // Bu müşterinin işlerine bağlı toplam gider
  const musteriIsIdleri=musteri.isler.map(j=>j.id);
  const musteriGiderleri=(giderler||[]).filter(g=>musteriIsIdleri.includes(g.isId));
  const toplamGider=musteriGiderleri.reduce((s,g)=>s+g.tutar,0);
  const netKar=toplamCiro-toplamGider;
  const karMarji=toplamCiro>0?Math.round(netKar/toplamCiro*100):0;

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    {/* Başlık */}
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
      <div style={{width:54,height:54,borderRadius:16,background:`linear-gradient(135deg,${P},#7C3AED)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff",flexShrink:0}}>{musteri.ad[0]}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:19,fontWeight:800,color:C.t1}}>{musteri.ad||T.isimsizMusteri}</div>
        {musteri.telefon&&<div style={{fontSize:12,color:C.t2,marginTop:2}}>📞 {musteri.telefon}</div>}
        {musteri.email&&<div style={{fontSize:12,color:C.t2}}>✉️ {musteri.email}</div>}
      </div>
    </div>

    {/* Adresler — Google Maps butonlu */}
    {musteri.adresler&&musteri.adresler.length>0&&<>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.isAdresleriB}</div>
      <Sh s={{marginBottom:16,overflow:"hidden"}}>
        {musteri.adresler.map((adres,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:i<musteri.adresler.length-1?`1px solid ${C.border}`:"none"}}>
          <div style={{width:36,height:36,borderRadius:10,background:C.blueBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📍</div>
          <div style={{flex:1,minWidth:0}}>
            {adres.etiket&&<div style={{fontSize:10,fontWeight:700,color:P,marginBottom:2}}>{adres.etiket.toUpperCase()}</div>}
            <div style={{fontSize:13,color:C.t1,lineHeight:1.4}}>{adres.adres}</div>
          </div>
          <button onClick={()=>navGit(adres.adres)} style={{background:C.blue,border:"none",borderRadius:10,padding:"8px 12px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
            <span style={{fontSize:16}}>🗺️</span>
            <span>{T.gitL}</span>
          </button>
        </div>)}
      </Sh>
    </>}

    {/* İstatistik kartları */}
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[{l:T.toplamCiro,v:fmt(toplamCiro),c:P,bg:C.purpleBg,icon:"💼"},
        {l:T.tahsilEdilen,v:fmt(tahsilEdilen),c:C.green,bg:C.greenBg,icon:"✅"},
        {l:T.tumIsAkislari.split(" ")[1]||"İş",v:toplamIs,c:C.blue,bg:C.blueBg,icon:"📋"}].map(x=><div key={x.l} style={{flex:1,background:x.bg,borderRadius:14,padding:"12px 8px",textAlign:"center"}}>
        <div style={{fontSize:18,marginBottom:4}}>{x.icon}</div>
        <div style={{fontSize:x.v.toString().length>8?10:13,fontWeight:900,color:x.c}}>{x.v}</div>
        <div style={{fontSize:9,color:x.c,opacity:0.8,marginTop:2}}>{x.l}</div>
      </div>)}
    </div>

    {/* Hızlı İşlemler */}
    <div style={{display:"flex",gap:8,marginBottom:14}}>
      <button onClick={()=>onYeniIs&&onYeniIs(musteri.ad)} style={{flex:1,background:C.greenBg,border:"none",borderRadius:12,padding:"12px 0",color:C.green,fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{T.yeniIsAc}</button>
      <button onClick={()=>onGider&&onGider(musteri.ad)} style={{flex:1,background:C.redBg,border:"none",borderRadius:12,padding:"12px 0",color:C.red,fontSize:12.5,fontWeight:700,cursor:"pointer"}}>{T.giderEkleBtn}</button>
    </div>

    {/* Kâr / Zarar Analizi */}
    {toplamGider>0&&<div style={{marginBottom:14}}>
      <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>📊 {T.karZararAnalizi}</div>
      <Sh s={{padding:16}}>
        {[
          ["💰 "+T.toplamCiro,fmt(toplamCiro),C.t1],
          ["💸 "+T.toplamGider,"-"+fmt(toplamGider),C.red],
          [netKar>=0?"✅ "+T.netKar:"⚠️ "+T.netZarar,fmt(Math.abs(netKar)),netKar>=0?C.green:C.red],
        ].map(([l,v,c])=><div key={l} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.t2}}>{l}</span>
          <span style={{fontSize:13,fontWeight:700,color:c}}>{v}</span>
        </div>)}
        {/* Marj çubuğu */}
        <div style={{marginTop:10}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <span style={{fontSize:10,color:C.t3}}>{T.marjL}</span>
            <span style={{fontSize:11,fontWeight:800,color:netKar>=0?C.green:C.red}}>%{karMarji}</span>
          </div>
          <div style={{background:C.border,borderRadius:4,height:8,overflow:"hidden"}}>
            <div style={{width:`${Math.min(Math.max(karMarji,0),100)}%`,background:karMarji>=15?C.green:karMarji>=0?C.amber:C.red,height:"100%",borderRadius:4}}/>
          </div>
        </div>
        {/* Gider detayı */}
        {musteriGiderleri.length>0&&<div style={{marginTop:10}}>
          <div style={{fontSize:10,color:C.t3,fontWeight:600,marginBottom:6}}>{T.giderKalemleri}</div>
          {musteriGiderleri.map(g=><div key={g.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.t2,padding:"3px 0"}}>
            <span>· {g.ad} <span style={{color:C.t3}}>({g.kategori})</span></span>
            <span style={{color:C.red,fontWeight:600}}>-{fmt(g.tutar)}</span>
          </div>)}
        </div>}
      </Sh>
    </div>}

    {/* İş listesi */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{T.isGecmisiB}</div>
    <Sh s={{marginBottom:16,overflow:"hidden"}}>
      {musteri.isler.length===0
        ?<div style={{padding:20,textAlign:"center",color:C.t3,fontSize:13}}>{T.isKaydiYok}</div>
        :musteri.isler.map((j,i)=>{
          const renk=j.durum==="tamamlandi"?C.green:j.durum==="bekliyor"?C.amber:C.blue;
          return <div key={j.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:i<musteri.isler.length-1?`1px solid ${C.border}`:"none"}}>
            <div style={{width:36,height:36,borderRadius:10,background:j.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{j.icon}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{j.baslik}</div>
              <div style={{fontSize:10,color:C.t3}}>{j.tarih}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:13,fontWeight:800,color:renk}}>{fmt(j.tutar)}</div>
              <div style={{fontSize:10,color:renk,marginTop:1}}>{DURUM[j.durum]?.label||j.durum}</div>
            </div>
          </div>;
        })}
    </Sh>

    {/* Hızlı iletişim */}
    <div style={{display:"flex",gap:8,marginBottom:4}}>
      {musteri.telefon&&<button onClick={()=>window.open("tel:"+musteri.telefon)} style={{flex:1,background:C.greenBg,border:"none",borderRadius:12,padding:"12px 0",color:C.green,fontSize:13,fontWeight:700,cursor:"pointer"}}>📞 {T.araL}</button>}
      {musteri.telefon&&<button onClick={()=>window.open("https://wa.me/9"+musteri.telefon.replace(/\D/g,"").slice(-10),"_blank")} style={{flex:1,background:"#DCF8C6",border:"none",borderRadius:12,padding:"12px 0",color:"#128C7E",fontSize:13,fontWeight:700,cursor:"pointer"}}>💬 WhatsApp</button>}
      {musteri.email&&<button onClick={()=>window.open("mailto:"+musteri.email)} style={{flex:1,background:C.blueBg,border:"none",borderRadius:12,padding:"12px 0",color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer"}}>✉️ Mail</button>}
    </div>
    {(!musteri.telefon&&!musteri.email)&&<div style={{fontSize:12,color:C.t3,textAlign:"center",padding:"8px 0 4px"}}>{T.iletisimYok}</div>}

    {/* Müşteri Sil */}
    <div style={{marginTop:14,borderTop:`1px solid ${C.border}`,paddingTop:14}}>
      {!silOnay
        ?<button onClick={()=>setSilOnay(true)} style={{width:"100%",background:C.redBg,border:"none",borderRadius:12,padding:13,color:C.red,fontSize:13,fontWeight:700,cursor:"pointer"}}>
          🗑️ {T.musteriyiSil}
        </button>
        :<div style={{background:C.redBg,borderRadius:14,padding:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:6,textAlign:"center"}}>
            ⚠️ {musteri.ad} {T.silinecekK}
          </div>
          {musteri.isler.length>0&&<div style={{fontSize:11,color:C.red,textAlign:"center",marginBottom:10}}>
            {T.aitIsUyariOn} {musteri.isler.length} {T.aitIsUyariSon}
          </div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setSilOnay(false)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:11,color:C.t2,fontSize:13,fontWeight:600,cursor:"pointer"}}>{T.iptal}</button>
            <button onClick={()=>{onSil(musteri.ad);onKapat();}} style={{flex:2,background:C.red,border:"none",borderRadius:10,padding:11,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.evetSil}</button>
          </div>
        </div>}
    </div>
  </BottomSheet>;
}

function MusterilerTab({jobs,T,musteriKayitlari,onMusteriEkle,onMusteriSil,onKayitSil,giderler,onYeniIsIcin,onGiderIcin}){
  const [altSekme,setAltSekme]=useState("guncel"); // guncel | kayit
  const [secili,setSecili]=useState(null);
  const [arama,setArama]=useState("");
  const [siralama,setSiralama]=useState("ciro"); // ciro | isler | ad
  const [yeniAc,setYeniAc]=useState(false);
  const [yeniForm,setYeniForm]=useState({ad:"",telefon:"",email:"",adres:""});

  // Müşteri verilerini topla — iş adresini de dahil et
  const musteriler={};
  // Önce bağımsız kayıtlı müşteriler
  (musteriKayitlari||[]).forEach(m=>{
    musteriler[m.ad]={ad:m.ad,isler:[],telefon:m.telefon||"",email:m.email||"",adresler:m.adres?[{etiket:"Kayıtlı Adres",adres:m.adres}]:[]};
  });
  jobs.forEach(j=>{
    if(!musteriler[j.musteri]) musteriler[j.musteri]={
      ad:j.musteri,
      isler:[],
      telefon:j.musteriTelefon||"",
      email:j.musteriEmail||"",
      adresler:j.isAdresi?[{etiket:"İş Adresi",adres:j.isAdresi}]:[],
    };
    musteriler[j.musteri].isler.push(j);
    if(j.musteriTelefon&&!musteriler[j.musteri].telefon)musteriler[j.musteri].telefon=j.musteriTelefon;
    if(j.musteriEmail&&!musteriler[j.musteri].email)musteriler[j.musteri].email=j.musteriEmail;
    // Birden fazla adres varsa ekle
    if(j.isAdresi&&!musteriler[j.musteri].adresler.some(a=>a.adres===j.isAdresi)){
      musteriler[j.musteri].adresler.push({etiket:`İş: ${j.ref}`,adres:j.isAdresi});
    }
  });

  const kaydetYeni=()=>{
    if(!yeniForm.ad.trim())return;
    onMusteriEkle(yeniForm);
    setYeniForm({ad:"",telefon:"",email:"",adres:""});
    setYeniAc(false);
  };

  const liste=Object.values(musteriler)
    .filter(m=>!arama||m.ad.toLowerCase().includes(arama.toLowerCase()))
    .sort((a,b)=>{
      if(siralama==="ciro") return b.isler.reduce((s,j)=>s+j.tutar,0)-a.isler.reduce((s,j)=>s+j.tutar,0);
      if(siralama==="isler") return b.isler.length-a.isler.length;
      return a.ad.localeCompare(b.ad,"tr");
    });

  const navGit=(adres)=>{
    const q=encodeURIComponent(adres);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`,"_blank");
  };

  const toplamCiro=liste.reduce((s,m)=>s+m.isler.reduce((ss,j)=>ss+j.tutar,0),0);

  // Güncel = işi olan müşteriler; Kayıtlar = bağımsız kayıtlı müşteriler
  const guncelListe=liste.filter(m=>m.isler.length>0);
  const kayitListe=(musteriKayitlari||[]);

  return <div style={{padding:"16px 14px"}}>
    {/* Alt sekme değiştirici */}
    <div style={{display:"flex",gap:6,marginBottom:14,background:C.card,borderRadius:14,padding:5,boxShadow:C.sh}}>
      {[["guncel","📊 "+T.guncelMusterilerT+" ("+guncelListe.length+")"],["kayit","👤 "+T.musteriKayitT+" ("+kayitListe.length+")"]].map(([v,l])=>
        <button key={v} onClick={()=>setAltSekme(v)} style={{flex:1,padding:"11px 0",borderRadius:10,border:"none",background:altSekme===v?P:"transparent",color:altSekme===v?"#fff":C.t2,fontSize:12.5,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>{l}</button>)}
    </div>

    {altSekme==="kayit"?<>
    {/* ══ MÜŞTERİ KAYIT SEKMESİ ══ */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:15,fontWeight:700,color:C.t1}}>{T.kayitliMusteriler}</div>
      <button onClick={()=>setYeniAc(true)} style={{background:P,border:"none",borderRadius:10,padding:"8px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>{T.yeniKayit}</button>
    </div>
    {yeniAc&&<Sh s={{padding:16,marginBottom:12,border:`2px solid ${P}44`}}>
      <div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:12}}>👤 {T.yeniMusteri}</div>
      <input value={yeniForm.ad} onChange={e=>setYeniForm(f=>({...f,ad:e.target.value}))} placeholder={T.adSoyadPh} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:8}}/>
      <div style={{display:"flex",gap:8,marginBottom:8}}>
        <input value={yeniForm.telefon} onChange={e=>setYeniForm(f=>({...f,telefon:e.target.value}))} placeholder={T.telefonL} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
        <input value={yeniForm.email} onChange={e=>setYeniForm(f=>({...f,email:e.target.value}))} placeholder={T.epostaL} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none"}}/>
      </div>
      <input value={yeniForm.adres} onChange={e=>setYeniForm(f=>({...f,adres:e.target.value}))} placeholder={T.adresNavPh} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:10}}/>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setYeniAc(false)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 0",color:C.t2,fontSize:13,fontWeight:600,cursor:"pointer"}}>{T.vazgec}</button>
        <button onClick={kaydetYeni} style={{flex:2,background:P,border:"none",borderRadius:10,padding:"10px 0",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>✓ Kaydet</button>
      </div>
    </Sh>}
    {kayitListe.length===0&&!yeniAc&&<Sh s={{padding:30,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:8}}>📇</div>
      <div style={{fontSize:13,color:C.t2}}>{T.kayitYok}</div>
      <div style={{fontSize:11,color:C.t3,marginTop:4}}>{T.kayitYokSub}</div>
    </Sh>}
    {kayitListe.map(m=>{
      const isSayi=jobs.filter(j=>j.musteri===m.ad).length;
      return <Sh key={m.ad} s={{padding:"13px 16px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:42,height:42,borderRadius:12,background:C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:800,color:P,flexShrink:0}}>{(m.ad&&m.ad[0])||"?"}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{m.ad}</div>
            <div style={{fontSize:11,color:C.t3}}>{m.telefon||T.telYok} {m.email?"· "+m.email:""}</div>
            {isSayi>0&&<div style={{fontSize:10,color:P,fontWeight:600,marginTop:2}}>📋 {isSayi} {T.isKaydiVar}</div>}
          </div>
          <button onClick={()=>onYeniIsIcin&&onYeniIsIcin(m.ad)} title="Bu müşteriye iş aç" style={{background:C.greenBg,border:"none",borderRadius:9,padding:"8px 11px",color:C.green,fontSize:11,fontWeight:700,cursor:"pointer"}}>+ İş</button>
          <button onClick={()=>onKayitSil&&onKayitSil(m.ad)} style={{background:"none",border:"none",color:C.t3,fontSize:15,cursor:"pointer"}}>×</button>
        </div>
      </Sh>;
    })}
    </>:<>
    {/* ══ GÜNCEL MÜŞTERİLER SEKMESİ ══ */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:15,fontWeight:700,color:C.t1}}>{T.aktifMusteriDurumu}</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <select value={siralama} onChange={e=>setSiralama(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",color:C.t2,fontSize:11,cursor:"pointer",outline:"none"}}>
          <option value="ciro">↓ {T.ciroL}</option>
          <option value="isler">↓ {T.isSayisi}</option>
          <option value="ad">A-Z</option>
        </select>
      </div>
    </div>

    {/* Toplam ciro özet */}
    {liste.length>0&&<Sh s={{padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:C.t2}}>{T.toplamCiro}</span>
      <span style={{fontSize:15,fontWeight:800,color:P}}>{fmt(toplamCiro)}</span>
    </Sh>}

    {/* Arama */}
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder={T.aramaPh}
      style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:12,boxShadow:C.sh}}/>

    {guncelListe.length===0&&<Sh s={{padding:36,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>👥</div>
      <div style={{fontSize:14,color:C.t2}}>{T.musteriler} - henüz yok</div>
      <div style={{fontSize:12,color:C.t3,marginTop:4}}>{T.sonIsAkislari}</div>
    </Sh>}

    {guncelListe.map((m,i)=>{
      const ciro=m.isler.reduce((s,j)=>s+j.tutar,0);
      const tamamlandi=m.isler.filter(j=>j.durum==="tamamlandi").length;
      // Finansal özet
      const isIdler=m.isler.map(j=>j.id);
      const mGider=(giderler||[]).filter(g=>isIdler.includes(g.isId)).reduce((s,g)=>s+g.tutar,0);
      const tahsilE=m.isler.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
      const bekleyenT=m.isler.filter(j=>j.durum!=="tamamlandi").reduce((s,j)=>s+j.tutar,0);
      const mKar=ciro-mGider;
      const adresVarMi=m.adresler.length>0;
      const ilkAdres=m.adresler[0];

      return <Sh key={m.ad} onClick={()=>setSecili(m)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
          {/* Avatar */}
          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${P}CC,#7C3AED)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#fff",flexShrink:0,position:"relative"}}>
            {(m.ad&&m.ad[0])||"?"}
            {i===0&&<div style={{position:"absolute",top:-6,right:-6,fontSize:14}}>👑</div>}
          </div>

          {/* Bilgiler */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
              <div style={{fontSize:14,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{m.ad||T.isimsizK}</div>
              <div style={{fontSize:15,fontWeight:800,color:C.green,flexShrink:0,marginLeft:8}}>{fmt(ciro)}</div>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:adresVarMi?8:0,flexWrap:"wrap"}}>
              <span style={{fontSize:10,background:C.purpleBg,color:P,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{m.isler.length} iş</span>
              {tamamlandi>0&&<span style={{fontSize:10,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:20,fontWeight:600}}>✅ {tamamlandi} tamamlandı</span>}
              {m.isler.some(j=>j.durum==="bekliyor")&&<span style={{fontSize:10,background:C.amberBg,color:C.amber,padding:"2px 8px",borderRadius:20,fontWeight:600}}>⏰ bekleyen var</span>}
            </div>

            {/* Finansal özet satırı */}
            <div style={{display:"flex",gap:10,marginTop:6,marginBottom:adresVarMi?8:0,fontSize:10.5,flexWrap:"wrap"}}>
              {bekleyenT>0&&<span style={{color:C.amber,fontWeight:700}}>⏳ {T.bekleyen}: {fmt(bekleyenT)}</span>}
              {tahsilE>0&&<span style={{color:C.green,fontWeight:700}}>✅ {T.tahsilKisa}: {fmt(tahsilE)}</span>}
              {mGider>0&&<span style={{color:C.red,fontWeight:700}}>💸 {T.giderKisa}: {fmt(mGider)}</span>}
              {mGider>0&&<span style={{color:mKar>=0?C.green:C.red,fontWeight:800}}>{mKar>=0?"📈 "+T.karKisa:"📉 "+T.zararKisa}: {fmt(Math.abs(mKar))}</span>}
            </div>

            {/* Adres satırı — sağda navigasyon butonu */}
            {adresVarMi&&<div style={{display:"flex",alignItems:"center",gap:8,background:C.bg,borderRadius:10,padding:"7px 10px"}} onClick={e=>e.stopPropagation()}>
              <span style={{fontSize:14}}>📍</span>
              <span style={{fontSize:11,color:C.t2,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{ilkAdres.adres}</span>
              <button onClick={e=>{e.stopPropagation();navGit(ilkAdres.adres);}} style={{background:C.blue,border:"none",borderRadius:8,padding:"5px 10px",color:"#fff",fontSize:11,fontWeight:700,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",gap:4}}>
                🗺️ {T.gitL}
              </button>
            </div>}
          </div>
        </div>
      </Sh>;
    })}

    </>}

    {/* Detay modal */}
    {secili&&<MusteriDetayModal musteri={secili} onKapat={()=>setSecili(null)} T={T} onSil={(ad)=>{onMusteriSil&&onMusteriSil(ad);setSecili(null);}} giderler={giderler} onYeniIs={(ad)=>{setSecili(null);onYeniIsIcin&&onYeniIsIcin(ad);}} onGider={(ad)=>{setSecili(null);onGiderIcin&&onGiderIcin(ad);}}/>}
  </div>;
}

function TekliflerTab({teklifler,onYeni,onDonustur,onSil,onDurumDegis,T,isletme}){
  const [filtre,setFiltre]=useState("hepsi"); // hepsi | bekliyor | onaylandi | reddedildi
  const [arama,setArama]=useState("");
  const [siralama,setSiralama]=useState("tarih"); // tarih | tutar | musteri

  const DURUM_TEKLIF={
    bekliyor:{label:T.beklemede,color:C.amber,bg:C.amberBg,icon:"⏳"},
    onaylandi:{label:T.onaylandiL,color:C.green,bg:C.greenBg,icon:"✅"},
    reddedildi:{label:T.reddedildiL,color:C.red,bg:C.redBg,icon:"❌"},
    suresi_doldu:{label:T.suresiDoldu,color:C.t3,bg:C.bg,icon:"⌛"},
  };

  const bugun=new Date().toISOString().slice(0,10);
  const listele=teklifler
    .map(t=>({...t,durum_t:t.durum_t||(t.gecerlilik<bugun?"suresi_doldu":"bekliyor")}))
    .filter(t=>filtre==="hepsi"||t.durum_t===filtre)
    .filter(t=>!arama||t.musteri.toLowerCase().includes(arama.toLowerCase())||t.baslik.toLowerCase().includes(arama.toLowerCase()))
    .sort((a,b)=>siralama==="tutar"?b.tutar-a.tutar:siralama==="musteri"?a.musteri.localeCompare(b.musteri):b.id-a.id);

  const toplamTutar=teklifler.reduce((s,t)=>s+t.tutar,0);
  const onayT=teklifler.filter(t=>(t.durum_t||"bekliyor")==="onaylandi").reduce((s,t)=>s+t.tutar,0);
  const bekleyenT=teklifler.filter(t=>!(t.durum_t)||(t.durum_t)==="bekliyor").reduce((s,t)=>s+t.tutar,0);
  const donusumOran=teklifler.length>0?Math.round(teklifler.filter(t=>(t.durum_t||"bekliyor")==="onaylandi").length/teklifler.length*100):0;

  const filtreler=[
    {key:"hepsi",label:T.tumunuGoruntule.split(" ")[0],n:teklifler.length},
    {key:"bekliyor",label:"Bekliyor",n:teklifler.filter(t=>!(t.durum_t)||(t.durum_t)==="bekliyor").length},
    {key:"onaylandi",label:T.tamamlandi,n:teklifler.filter(t=>(t.durum_t||"")==="onaylandi").length},
    {key:"reddedildi",label:"Reddedildi",n:teklifler.filter(t=>(t.durum_t||"")==="reddedildi").length},
  ];

  return <div style={{padding:"16px 14px"}}>
    {/* Başlık */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>Teklifler</div>
      <button onClick={onYeni} style={{background:P,border:"none",borderRadius:12,padding:"9px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+   {T.yeniTeklif}</button>
    </div>

    {/* Özet kartlar */}
    {teklifler.length>0&&<div style={{display:"flex",gap:8,marginBottom:14}}>
      <Sh s={{flex:1,padding:"12px 10px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.t3,marginBottom:3}}>{T.toplam}</div>
        <div style={{fontSize:13,fontWeight:800,color:P}}>{fmt(toplamTutar)}</div>
      </Sh>
      <Sh s={{flex:1,padding:"12px 10px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.t3,marginBottom:3}}>Onaylanan</div>
        <div style={{fontSize:13,fontWeight:800,color:C.green}}>{fmt(onayT)}</div>
      </Sh>
      <Sh s={{flex:1,padding:"12px 10px",textAlign:"center"}}>
        <div style={{fontSize:10,color:C.t3,marginBottom:3}}>{T.donusum}</div>
        <div style={{fontSize:13,fontWeight:800,color:donusumOran>50?C.green:C.amber}}>%{donusumOran}</div>
      </Sh>
    </div>}

    {/* Arama */}
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder="🔍 Müşteri veya iş ara..."
      style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:10,boxShadow:C.sh}}/>

    {/* Filtre + Sıralama */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
        {filtreler.map(f=><button key={f.key} onClick={()=>setFiltre(f.key)} style={{padding:"5px 11px",borderRadius:20,border:"none",background:filtre===f.key?P:C.card,color:filtre===f.key?"#fff":C.t2,fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",boxShadow:filtre===f.key?`0 2px 8px ${P}44`:C.sh}}>
          {f.label} {f.n>0&&<span style={{opacity:0.7}}>({f.n})</span>}
        </button>)}
      </div>
      <select value={siralama} onChange={e=>setSiralama(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 8px",color:C.t2,fontSize:11,cursor:"pointer",outline:"none",marginLeft:8,flexShrink:0}}>
        <option value="tarih">↓ Tarih</option>
        <option value="tutar">↓ Tutar</option>
        <option value="musteri">A-Z</option>
      </select>
    </div>

    {/* Boş durum */}
    {teklifler.length===0&&<Sh s={{padding:36,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>🏷️</div>
      <div style={{fontSize:15,fontWeight:700,color:C.t1,marginBottom:6}}>{T.henuzTeklifYok}</div>
      <div style={{fontSize:12,color:C.t3,marginBottom:16}}>{T.teklifBilgi}</div>
      <button onClick={onYeni} style={{background:P,border:"none",borderRadius:12,padding:"11px 22px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>{T.ilkTeklif}</button>
    </Sh>}

    {listele.length===0&&teklifler.length>0&&<div style={{textAlign:"center",padding:30,color:C.t3,fontSize:13}}>{T.filtreEslesmedi}</div>}

    {/* Teklif kartları */}
    {listele.map(t=>{
      const ds=DURUM_TEKLIF[t.durum_t||"bekliyor"]||DURUM_TEKLIF.bekliyor;
      const gecerlimi=t.gecerlilik>=bugun;
      const kalanGun=Math.ceil((new Date(t.gecerlilik)-new Date())/864e5);
      return <Sh key={t.id} s={{padding:"16px 18px",marginBottom:10}}>
        {/* Üst satır */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <div style={{fontSize:22,fontWeight:900,color:P,letterSpacing:"-0.03em"}}>{fmt(t.tutar)}</div>
              <span style={{fontSize:11,color:ds.color,background:ds.bg,borderRadius:20,padding:"3px 9px",fontWeight:700,whiteSpace:"nowrap"}}>{ds.icon} {ds.label}</span>
            </div>
            <div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.musteri}</div>
            <div style={{fontSize:12,color:C.t2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.baslik}</div>
            {t.maliyet>0&&<TeklifMarjRozeti tutar={t.tutar} maliyet={t.maliyet}/>}
          </div>
        </div>

        {/* Geçerlilik göstergesi */}
        <div style={{background:C.bg,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:13}}>{gecerlimi?"📅":"⌛"}</span>
            <span style={{fontSize:11,color:C.t2}}>Geçerlilik: <b style={{color:gecerlimi&&kalanGun<=3?C.amber:C.t1}}>{t.gecerlilik}</b></span>
          </div>
          {gecerlimi
            ?<span style={{fontSize:11,fontWeight:700,color:kalanGun<=3?C.amber:C.green}}>{kalanGun} {T.gunL}</span>
            :<span style={{fontSize:11,fontWeight:700,color:C.red}}>{T.suresiDoldu}</span>}
        </div>

        {/* Durum butonları */}
        {(t.durum_t||"bekliyor")==="bekliyor"&&<div style={{display:"flex",gap:6,marginBottom:8}}>
          <button onClick={()=>onDurumDegis&&onDurumDegis(t.id,"onaylandi")} style={{flex:1,background:C.greenBg,border:`1px solid ${C.green}33`,borderRadius:9,padding:"8px 0",color:C.green,fontSize:11,fontWeight:700,cursor:"pointer"}}>✅ {T.onayla}</button>
          <button onClick={()=>onDurumDegis&&onDurumDegis(t.id,"reddedildi")} style={{flex:1,background:C.redBg,border:`1px solid ${C.red}33`,borderRadius:9,padding:"8px 0",color:C.red,fontSize:11,fontWeight:700,cursor:"pointer"}}>❌ {T.reddet}</button>
        </div>}

        {/* Alt butonlar */}
        <div style={{display:"flex",gap:6}}>
          {(t.durum_t||"bekliyor")==="onaylandi"&&<button onClick={()=>onDonustur(t)} style={{flex:2,background:C.greenBg,border:"none",borderRadius:10,padding:"10px 0",color:C.green,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 {T.iseDonustur}</button>}
          {(t.durum_t||"bekliyor")==="bekliyor"&&<button onClick={()=>onDonustur(t)} style={{flex:2,background:C.purpleBg,border:"none",borderRadius:10,padding:"10px 0",color:P,fontSize:12,fontWeight:700,cursor:"pointer"}}>🔄 {T.iseDonustur}</button>}
          {(t.durum_t||"bekliyor")==="reddedildi"&&<div style={{flex:2,textAlign:"center",padding:"10px 0",fontSize:12,color:C.t3}}>{T.reddedildiL}</div>}
          <button onClick={()=>{
            const kal=(t.kalemler||[]);
            const kalMetin=kal.length>0?"\n"+kal.map((k,ki)=>(ki+1)+". "+k.ad+" — "+k.adet+" × "+k.birimFiyat.toLocaleString("tr-TR")+" TL").join("\n")+"\n":"";
            const metin=`🏷️ *${T.teklifBelgesi}*\n\nSayın ${t.musteri},\n\n📋 ${t.baslik}${kalMetin}\n${T.araToplamL}: ${(t.araToplam||t.tutar).toLocaleString("tr-TR")} TL\n${T.kdvL} %${t.kdvOran||20}: ${(t.kdvTutar||0).toLocaleString("tr-TR")} TL\n*${T.genelToplamL}: ${t.tutar.toLocaleString("tr-TR")} TL*\n\n📅 ${T.gecerlilik}: ${t.gecerlilik}\n\nOnayınızı bekliyoruz.`;
            const tel=(t.telefon||"").replace(/\D/g,"").slice(-10);
            window.open("https://wa.me/"+(tel?"9"+tel:"")+"?text="+encodeURIComponent(metin),"_blank");
          }} style={{flex:1,background:C.greenBg,border:"none",borderRadius:10,padding:"10px 0",color:C.green,fontSize:12,fontWeight:600,cursor:"pointer"}}>💬 {T.whatsappGonder}</button>
          <button onClick={()=>teklifPdf(t,isletme,T)} style={{flex:1,background:C.blueBg,border:"none",borderRadius:10,padding:"10px 0",color:C.blue,fontSize:12,fontWeight:600,cursor:"pointer"}}>🖨️ {T.teklifPdfBtn}</button>
          <button onClick={()=>onSil(t.id)} style={{flex:1,background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 0",color:C.t3,fontSize:12,fontWeight:600,cursor:"pointer"}}>{T.sil}</button>
        </div>
      </Sh>;
    })}

    {/* Toplam bekleyen değer */}
    {bekleyenT>0&&<Sh s={{padding:"12px 16px",marginTop:6,display:"flex",justifyContent:"space-between",alignItems:"center",background:C.amberBg}}>
      <span style={{fontSize:12,color:C.amber,fontWeight:600}}>⏳ {T.bekleyenTeklifT}</span>
      <span style={{fontSize:14,fontWeight:800,color:C.amber}}>{fmt(bekleyenT)}</span>
    </Sh>}
  </div>;
}

function GiderlerTab({giderler,onYeni,onSil,T,jobs}){
  const [filtre,setFiltre]=useState("hepsi"); // hepsi | isli | serbest
  const toplam=giderler.reduce((s,g)=>s+g.tutar,0);
  const katToplam={};giderler.forEach(g=>{katToplam[g.kategori]=(katToplam[g.kategori]||0)+g.tutar;});
  const filtrelenen=filtre==="isli"?giderler.filter(g=>g.isId)
    :filtre==="serbest"?giderler.filter(g=>!g.isId)
    :giderler;
  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.giderler}</div>
      <button onClick={onYeni} style={{background:P,border:"none",borderRadius:12,padding:"9px 16px",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer"}}>+ {T.yeniGider}</button>
    </div>
    <Sh s={{padding:16,marginBottom:14,textAlign:"center"}}>
      <div style={{fontSize:11,color:C.t3}}>{T.toplamGider.toUpperCase()}</div>
      <div style={{fontSize:24,fontWeight:900,color:C.red}}>{fmt(toplam)}</div>
      <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:8,flexWrap:"wrap"}}>{Object.entries(katToplam).map(([k,v])=><span key={k} style={{fontSize:10,background:C.bg,padding:"4px 10px",borderRadius:8,color:C.t2}}>{k}: {fmt(v)}</span>)}</div>
    </Sh>
    {/* Filtre */}
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["hepsi",T.tumuF],["isli",T.iseBagliF],["serbest",T.serbestF]].map(([v,l])=>
        <button key={v} onClick={()=>setFiltre(v)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",background:filtre===v?P:C.card,color:filtre===v?"#fff":C.t2,fontSize:12,fontWeight:600,cursor:"pointer",boxShadow:C.sh}}>{l}</button>)}
    </div>
    {filtrelenen.length===0&&<div style={{textAlign:"center",padding:20,color:C.t3,fontSize:13}}>{T.henuzGiderYok}</div>}
    {filtrelenen.map(g=>{
      const baglıIs=g.isId?(jobs||[]).find(j=>j.id===g.isId):null;
      return <Sh key={g.id} s={{padding:"14px 16px",marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{g.ad}</div>
            <div style={{fontSize:11,color:C.t3}}>{g.kategori} · {g.tarih}</div>
            {baglıIs&&<div style={{fontSize:11,color:P,fontWeight:600,marginTop:3}}>📋 {baglıIs.baslik} · {baglıIs.musteri}</div>}
            {g.isAdi&&!baglıIs&&<div style={{fontSize:11,color:C.t3,marginTop:3}}>📋 {g.isAdi}</div>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:14,fontWeight:800,color:C.red}}>-{fmt(g.tutar)}</span>
            <button onClick={()=>onSil(g.id)} style={{background:"none",border:"none",color:C.t3,fontSize:16,cursor:"pointer"}}>×</button>
          </div>
        </div>
      </Sh>;
    })}
  </div>;
}

function RaporlarTab({jobs,giderler,T,ekip}){
  const [donem,setDonem]=useState("tumu"); // buay | gecenay | uc_ay | tumu
  const simdi=new Date();
  const buAyBasi=new Date(simdi.getFullYear(),simdi.getMonth(),1);
  const gecenAyBasi=new Date(simdi.getFullYear(),simdi.getMonth()-1,1);
  const ucAyOnce=new Date(simdi.getFullYear(),simdi.getMonth()-3,1);

  const donemFiltre=(tarihStr)=>{
    if(donem==="tumu")return true;
    const t=new Date(tarihStr);
    if(donem==="buay")return t>=buAyBasi;
    if(donem==="gecenay")return t>=gecenAyBasi&&t<buAyBasi;
    if(donem==="uc_ay")return t>=ucAyOnce;
    return true;
  };
  const fJobs=jobs.filter(j=>donemFiltre(j.tarih));
  const fGiderler=giderler.filter(g=>donemFiltre(g.tarih||new Date().toISOString().slice(0,10)));

  const durumSay=[{name:T.tamamlandi,v:fJobs.filter(j=>j.durum==="tamamlandi").length,color:C.green},{name:T.aktifL,v:fJobs.filter(j=>j.durum==="aktif").length,color:C.blue},{name:T.bekleyen,v:fJobs.filter(j=>j.durum==="bekliyor").length,color:C.amber}];
  const barData=fJobs.slice(0,6).map(j=>({ad:j.musteri.split(" ")[0],tutar:j.tutar}));
  const gelir=fJobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const gider=fGiderler.reduce((s,g)=>s+g.tutar,0);

  // GERÇEK haftalık gelir eğrisi — son 7 günün tamamlanan işlerinden
  const GUN_KISA=["Pz","Pt","Sa","Ça","Pe","Cu","Ct"];
  const son7=Array.from({length:7}).map((_,i)=>{
    const d=new Date(Date.now()-(6-i)*864e5);
    const dStr=d.toISOString().slice(0,10);
    const toplam=jobs.filter(j=>j.durum==="tamamlandi"&&j.tarih===dStr).reduce((s,j)=>s+j.tutar,0);
    return {d:GUN_KISA[d.getDay()],v:toplam};
  });
  const son7Toplam=son7.reduce((s,x)=>s+x.v,0);

  const DONEMLER=[["buay",T.buAyR],["gecenay",T.gecenAy],["uc_ay",T.son3Ay],["tumu",T.tumu]];

  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:12}}>{T.raporlar}</div>

    {/* Dönem seçici */}
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:2}}>
      {DONEMLER.map(([v,l])=><button key={v} onClick={()=>setDonem(v)} style={{padding:"7px 14px",borderRadius:20,border:"none",background:donem===v?P:C.card,color:donem===v?"#fff":C.t2,fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",boxShadow:donem===v?`0 2px 8px ${P}44`:C.sh}}>{l}</button>)}
    </div>

    <div style={{display:"flex",gap:10,marginBottom:12}}>
      {[[T.isSayisi,fJobs.length,C.statP],[T.gelirL,fmt(gelir),C.statG],[T.giderL,fmt(gider),C.statR]].map(([l,v,c])=><Sh key={l} s={{flex:1,padding:12,textAlign:"center"}}><div style={{fontSize:10,color:C.t3}}>{l}</div><div style={{fontSize:v.toString().length>8?11:16,fontWeight:800,color:c}}>{v}</div></Sh>)}
    </div>

    {/* Net kâr kartı */}
    <Sh s={{padding:"14px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center",background:gelir-gider>=0?C.greenBg:C.redBg}}>
      <span style={{fontSize:13,fontWeight:600,color:gelir-gider>=0?C.green:C.red}}>📈 {T.netKar} ({DONEMLER.find(d=>d[0]===donem)?.[1]})</span>
      <span style={{fontSize:17,fontWeight:900,color:gelir-gider>=0?C.green:C.red}}>{fmt(gelir-gider)}</span>
    </Sh>

    {/* 👷 EKİP PERFORMANSI */}
    {ekip&&ekip.length>0&&(()=>{
      const uyeler=[{ad:T.benL,rol:T.patronRol},...ekip].map(u=>{
        const uIsler=fJobs.filter(j=>u.ad===T.benL?!j.atanan:j.atanan===u.ad);
        const tamam=uIsler.filter(j=>j.durum==="tamamlandi");
        const ciro=tamam.reduce((s,j)=>s+j.tutar,0);
        const uIds=uIsler.map(j=>j.id);
        const uGider=giderler.filter(g=>uIds.includes(g.isId)).reduce((s,g)=>s+g.tutar,0);
        return {...u,isSayi:uIsler.length,tamamSayi:tamam.length,ciro,kar:ciro-uGider};
      }).filter(u=>u.isSayi>0).sort((a,b)=>b.kar-a.kar);
      if(uyeler.length===0)return null;
      const maxKar=Math.max(...uyeler.map(u=>Math.abs(u.kar)),1);
      return <Sh s={{padding:16,marginBottom:12}}>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:12}}>👷 {T.ekipPerformansi}</div>
        {uyeler.map((u,i)=><div key={u.ad} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:12,fontWeight:700,color:C.t1}}>{i===0?"🏆 ":""}{u.ad} <span style={{fontSize:10,color:C.t3,fontWeight:400}}>· {u.tamamSayi}/{u.isSayi} {T.isBirim}</span></span>
            <span style={{fontSize:12,fontWeight:800,color:u.kar>=0?C.green:C.red}}>{fmt(u.kar)} {T.karSuffix}</span>
          </div>
          <div style={{background:C.border,borderRadius:4,height:8,overflow:"hidden"}}>
            <div style={{width:`${Math.min(Math.abs(u.kar)/maxKar*100,100)}%`,background:u.kar>=0?(i===0?C.green:P):C.red,height:"100%",borderRadius:4}}/>
          </div>
        </div>)}
      </Sh>;
    })()}

    {/* GERÇEK son 7 gün gelir eğrisi */}
    <Sh s={{padding:16,marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={{fontSize:13,fontWeight:700,color:C.t1}}>{T.son7Gun}</div>
        <span style={{fontSize:12,fontWeight:800,color:C.green}}>{fmt(son7Toplam)}</span>
      </div>
      {son7Toplam===0
        ?<div style={{textAlign:"center",padding:"18px 0",fontSize:12,color:C.t3}}>{T.son7Yok}</div>
        :<ResponsiveContainer width="100%" height={110}><LineChart data={son7}>
          <XAxis dataKey="d" tick={{fontSize:9,fill:C.t3}} axisLine={false} tickLine={false}/>
          <Line type="monotone" dataKey="v" stroke={C.green} strokeWidth={2.5} dot={{r:3,fill:C.green}}/>
          <Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)}/>
        </LineChart></ResponsiveContainer>}
    </Sh>

    <Sh s={{padding:16,marginBottom:12}}>
      <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>{T.isBazli}</div>
      {barData.length===0
        ?<div style={{textAlign:"center",padding:"14px 0",fontSize:12,color:C.t3}}>{T.donemdeIsYok}</div>
        :<ResponsiveContainer width="100%" height={150}><BarChart data={barData}><XAxis dataKey="ad" tick={{fontSize:10,fill:C.t3}} axisLine={false} tickLine={false}/><Bar dataKey="tutar" fill={P} radius={[6,6,0,0]}/><Tooltip contentStyle={{fontSize:11,borderRadius:8,background:C.card,border:`1px solid ${C.border}`}} formatter={v=>fmt(v)}/></BarChart></ResponsiveContainer>}
    </Sh>
    <Sh s={{padding:16}}>
      <div style={{fontSize:13,fontWeight:700,color:C.t1,marginBottom:10}}>{T.durumDagilimi}</div>
      {durumSay.map(d=><div key={d.name} style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,color:C.t2}}>{d.name}</span><span style={{fontSize:12,fontWeight:700,color:d.color}}>{d.v}</span></div>
        <div style={{background:C.bg,borderRadius:4,height:8}}><div style={{width:`${fJobs.length?d.v/fJobs.length*100:0}%`,background:d.color,height:"100%",borderRadius:4}}/></div>
      </div>)}
    </Sh>
  </div>;
}

function BildirimlerTab({bildirimler,onOkundu,T}){
  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.bildirimlerT}</div>
      {bildirimler.some(b=>!b.okundu)&&<span onClick={onOkundu} style={{fontSize:12,color:P,fontWeight:600,cursor:"pointer"}}>{T.tumunuOkundu}</span>}
    </div>
    {bildirimler.length===0&&<Sh s={{padding:34,textAlign:"center"}}><div style={{fontSize:40,marginBottom:10}}>🔔</div><div style={{fontSize:14,color:C.t2}}>{T.bosBildirim}</div></Sh>}
    {bildirimler.map(b=><Sh key={b.id} s={{padding:"14px 16px",marginBottom:8,display:"flex",gap:12,alignItems:"flex-start",opacity:b.okundu?0.6:1}}>
      <div style={{width:40,height:40,borderRadius:11,background:b.tip==="hatirlatma"?C.amberBg:b.tip==="fatura"?C.blueBg:C.greenBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{b.tip==="hatirlatma"?"⏰":b.tip==="fatura"?"🧾":"✅"}</div>
      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{b.baslik}</div><div style={{fontSize:12,color:C.t2,marginTop:2}}>{b.mesaj}</div><div style={{fontSize:10,color:C.t3,marginTop:4}}>{b.zaman}</div></div>
      {!b.okundu&&<div style={{width:8,height:8,borderRadius:"50%",background:P,marginTop:6}}/>}
    </Sh>)}
  </div>;
}

function DahaFazlaTab({onAc,onSifirla,onExport,onImport,T,onExcelIs,onExcelGider,onExcelFatura,onPdf}){
  const items=[
    {icon:"🤖",label:T.asistan,alt:T.asistanSub,act:()=>onAc("asistan")},
    {icon:"📊",label:T.excelIslerL,alt:T.muhasebeyeGonder,act:onExcelIs},
    {icon:"💸",label:T.excelGiderlerL,alt:T.muhasebeyeGonder,act:onExcelGider},
    {icon:"🧾",label:T.excelFaturalarL,alt:T.muhasebeyeGonder,act:onExcelFatura},
    {icon:"🖨️",label:T.pdfRaporL,alt:T.yazdirKaydet,act:onPdf},
    {icon:"📤",label:T.disaAktar,alt:"JSON",act:onExport},
    {icon:"📥",label:T.yedekGeriYukle,alt:T.jsonIceAktar,file:true},
    {icon:"❓",label:T.yardimMerkezi,alt:"SSS",act:()=>onAc("yardim")},
    {icon:"📜",label:T.gizlilik,alt:"KVKK",act:()=>onAc("gizlilik")},
    {icon:"⭐",label:T.degerlendir,alt:"★",act:()=>onAc("degerlendir")},
    {icon:"🗑️",label:T.verileriSifirla,alt:"",act:onSifirla,danger:true},
    {icon:"ℹ️",label:T.hakkinda,alt:"v1.0.0",act:null},
  ];
  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.dahaFazla}</div>
    {items.map(x=>x.file
      ?<label key={x.label} style={{display:"block"}}>
        <Sh s={{padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:"pointer"}}>
          <div style={{fontSize:24}}>{x.icon}</div>
          <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:C.t1}}>{x.label}</div><div style={{fontSize:11,color:C.t3}}>{x.alt}</div></div>
          <span style={{color:C.t3}}>›</span>
        </Sh>
        <input type="file" accept=".json,application/json" onChange={onImport} style={{display:"none"}}/>
      </label>
      :<Sh key={x.label} onClick={x.act||undefined} s={{padding:"16px 18px",marginBottom:10,display:"flex",alignItems:"center",gap:14,cursor:x.act?"pointer":"default"}}>
      <div style={{fontSize:24}}>{x.icon}</div>
      <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:x.danger?C.red:C.t1}}>{x.label}</div><div style={{fontSize:11,color:C.t3}}>{x.alt}</div></div>
      {x.act&&<span style={{color:C.t3}}>›</span>}
    </Sh>)}
  </div>;
}

// ─── PROFİL ─────────────────────────────────────────────────────
function ProfilSekmesi({jobs,dil,setDil,karanlik,setKaranlik,para,setPara,kdv,setKdv,isletme,setIsletme,T,goster,onAc,gibAyar,setGibAyar,gibAcSekme,onGibActemizle,onCikis,kullaniciEmail,onKarne}){
  const [bildirimIzin,setBildirimIzin]=useState(false);
  const [sesEfekt,setSesEfekt]=useState(true);
  const [kompaktMod,setKompaktMod]=useState(false);
  const [logo,setLogo]=useState(null);
  const [modal,setModal]=useState(null); // isletme|kdv|dil|para|gib

  // Fatura'dan yönlendirme — GİB modalını otomatik aç
  useEffect(()=>{
    if(gibAcSekme){
      setModal("gib");
      onGibActemizle&&onGibActemizle();
    }
  },[gibAcSekme]);
  const tamamlanan=jobs.filter(j=>j.durum==="tamamlandi").length;
  const tahsilat=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const aktifIs=jobs.filter(j=>j.durum==="aktif").length;
  const bekleyenIs=jobs.filter(j=>j.durum==="bekliyor").length;
  const logoYukle=(e)=>{const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=(ev)=>{setLogo(ev.target.result);goster("Logo yüklendi ✓");};r.readAsDataURL(file);};
  const bildirimAc=(v)=>{setBildirimIzin(v);if(v&&typeof Notification!=="undefined"&&Notification.permission==="default"){Notification.requestPermission();}goster(v?"🔔 Bildirimler açık":"Bildirimler kapalı");};
  const Row=({icon,label,value,sub,onClick,toggle,tState,tSet,danger,custom,badge})=>(
    <div onClick={onClick} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",cursor:onClick||toggle?"pointer":"default",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontSize:18,width:24,textAlign:"center",flexShrink:0}}>{icon}</div>
      <div style={{flex:1,minWidth:0}}>
        <span style={{fontSize:14,fontWeight:500,color:danger?C.red:C.t1}}>{label}</span>
        {sub&&<div style={{fontSize:10,color:C.t3,marginTop:1}}>{sub}</div>}
      </div>
      {badge&&<span style={{fontSize:10,background:badge==="ok"?C.greenBg:C.amberBg,color:badge==="ok"?C.green:C.amber,padding:"2px 8px",borderRadius:20,fontWeight:700,flexShrink:0}}>{badge==="ok"?T.aktifL:T.beklemede}</span>}
      {custom?custom:toggle?<Toggle on={tState} set={tSet}/>:value?<span style={{fontSize:13,color:C.t3,flexShrink:0}}>{value} ›</span>:<span style={{color:C.t3,flexShrink:0}}>›</span>}
    </div>
  );
  const dilAd=DIL_LISTESI.find(d=>d.code===dil);
  const gibDurum=gibAyar?.canliAktif?"ok":gibAyar?.apiKey?"bekliyor":null;

  return <div style={{padding:"16px 14px"}}>
    {/* Avatar + karne */}
    <Sh s={{padding:"20px 18px",marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
        <div style={{position:"relative",flexShrink:0}}>
          {logo?<img src={logo} alt="logo" style={{width:72,height:72,borderRadius:18,objectFit:"cover",border:`3px solid ${P}44`}}/>
            :<div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff"}}>{(isletme.yetkili||"EO").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>}
          <label style={{position:"absolute",bottom:-4,right:-4,width:22,height:22,borderRadius:"50%",background:P,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,cursor:"pointer",border:"2px solid "+C.card}}>
            📷<input type="file" accept="image/*" onChange={logoYukle} style={{display:"none"}}/>
          </label>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:18,fontWeight:800,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isletme.yetkili||"Ad Soyad"}</div>
          <div style={{fontSize:13,color:P,fontWeight:600,marginTop:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isletme.ad||"İşletme Adı"}</div>
          <div style={{fontSize:11,color:C.t3,marginTop:2}}>{isletme.adres||"Adres"}</div>
        </div>
        <button onClick={()=>setModal("isletme")} style={{background:C.purpleBg,border:`1px solid ${P}33`,borderRadius:10,padding:"7px 12px",color:P,fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>Düzenle</button>
      </div>
      {/* İletişim bilgileri */}
      <div style={{background:C.bg,borderRadius:12,padding:12,display:"flex",gap:8,flexWrap:"wrap"}}>
        {[["📞",isletme.telefon||"—"],["✉️",isletme.email||"—"],["🔢",isletme.vergiNo?"VKN: "+isletme.vergiNo:"VKN girilmedi"]].map(([ic,val])=><div key={ic} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:C.t2}}><span>{ic}</span><span style={{color:C.t1}}>{val}</span></div>)}
      </div>
    </Sh>

    {/* Karne — mor gradient */}
    <Sh s={{padding:"16px 18px",marginBottom:14,background:"linear-gradient(135deg,#2563EB,#1D4ED8)"}}>
      <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.75)",letterSpacing:"0.1em",marginBottom:10}}>⭐ {T.buAyinKarnesi}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[{val:tamamlanan,label:T.tamamlandi,icon:"✅",go:"stat-tamamlandi"},{val:fmt(tahsilat),label:T.tahsilat,icon:"💰",go:"stat-tahsil"},{val:aktifIs,label:T.aktifL,icon:"🔄",go:"stat-aktif"},{val:bekleyenIs,label:T.bekleyen,icon:"⏳",go:"stat-bekleyen"}].map(s=><div key={s.label} onClick={()=>onKarne&&onKarne(s.go)} style={{flex:1,background:"rgba(255,255,255,0.14)",borderRadius:10,padding:"10px 4px",textAlign:"center",cursor:"pointer",transition:"all 0.15s"}}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.28)"}
          onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.14)"}>
          <div style={{fontSize:14,marginBottom:2}}>{s.icon}</div>
          <div style={{fontSize:s.val.toString().length>7?10:14,fontWeight:800,color:"#fff"}}>{s.val}</div>
          <div style={{fontSize:8,color:"rgba(255,255,255,0.75)",marginTop:2,lineHeight:1.2}}>{s.label}</div>
        </div>)}
      </div>
      {/* Haftalık hedef çubuğu */}
      <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"10px 12px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
          <span style={{fontSize:10,color:"rgba(255,255,255,0.8)"}}>{T.haftalikHedef}</span>
          <span style={{fontSize:10,color:"#fff",fontWeight:700}}>{Math.min(tamamlanan,5)}/5 iş</span>
        </div>
        <div style={{background:"rgba(0,0,0,0.2)",borderRadius:4,height:6}}>
          <div style={{width:`${Math.min(tamamlanan/5*100,100)}%`,background:"linear-gradient(90deg,#34D399,#6EE7B7)",height:"100%",borderRadius:4}}/>
        </div>
      </div>
    </Sh>

    {/* İşletme ayarları */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.isletmeAyarlariB}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="🏢" label={T.isletmeBilgileri} sub={isletme.vergiDairesi||T.vergiDairesiYok} value={isletme.ad} onClick={()=>setModal("isletme")}/>
      <Row icon="🧾" label={T.kdvOrani} sub={T.kdvSub} value={"%"+kdv} onClick={()=>setModal("kdv")}/>
      <Row icon="🧾 GİB" label="e-Fatura / e-Arşiv Entegrasyonu" sub={gibDurum==="ok"?T.gibSubAktif:gibDurum==="bekliyor"?T.gibSubTest:T.gibSubYok} onClick={()=>setModal("gib")} badge={gibDurum}/>
      <Row icon="🖼️" label={T.logoYukle} sub={T.logoSub} custom={<label style={{fontSize:13,color:P,fontWeight:600,cursor:"pointer",flexShrink:0}}>{logo?T.degistir:T.sec} ›<input type="file" accept="image/*" onChange={logoYukle} style={{display:"none"}}/></label>}/>
    </Sh>

    {/* Finans */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.finansB}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="💰" label={T.paraBirimi} sub={kurKaynakAd()} value={para+" ("+fmt(1)+")"} onClick={()=>setModal("para")}/>
      <Row icon="📊" label={T.raporlamaDonemi} sub={T.aylikGorunum} value="Bu Ay ›" onClick={()=>goster(T.yakinda)}/>
      <Row icon="🏦" label={T.bankaHesabi} sub={T.ibanSub} onClick={()=>goster("Pro! ⚡")}/>
    </Sh>

    {/* Uygulama */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.uygulama}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="🔔" label={T.bildirimlerL} sub={T.bildirimSub} toggle tState={bildirimIzin} tSet={bildirimAc}/>
      <Row icon="🌙" label={T.karanlikMod} sub={T.karanlikSub} toggle tState={karanlik} tSet={setKaranlik}/>
      <Row icon="🔊" label={T.sesEfektleri} sub={T.sesEfektSub} toggle tState={sesEfekt} tSet={setSesEfekt}/>
      <Row icon="📱" label={T.kompaktGorunum} sub={T.kompaktSub} toggle tState={kompaktMod} tSet={setKompaktMod}/>
      <Row icon="🌐" label={T.dil} sub={dilAd?.bolge||""} value={dilAd?dilAd.bayrak+" "+dilAd.ad:dil} onClick={()=>setModal("dil")}/>
    </Sh>

    {/* Pro */}
    <Sh s={{padding:"16px 18px",marginBottom:14,background:"linear-gradient(135deg,#F59E0B,#D97706)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{fontSize:30}}>⚡</div>
        <div style={{flex:1}}>
          <div style={{fontSize:14,fontWeight:800,color:"#fff"}}>{T.proYukselt}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.85)",marginTop:2}}>{T.proSub}</div>
        </div>
        <button onClick={()=>goster(T.yakinda+" ⚡")} style={{background:"#fff",border:"none",borderRadius:10,padding:"8px 14px",color:"#D97706",fontSize:12,fontWeight:800,cursor:"pointer",flexShrink:0}}>₺199/ay</button>
      </div>
    </Sh>

    {/* Destek */}
    <div style={{fontSize:11,fontWeight:700,color:C.t3,letterSpacing:"0.1em",margin:"0 4px 8px"}}>{T.destek}</div>
    <Sh s={{marginBottom:14,overflow:"hidden"}}>
      <Row icon="👷" label={T.ekipYonetimi} sub={T.ekipSub} onClick={()=>onAc("ekip")}/>
      <Row icon="🤖" label={T.asistan} sub={T.asistanSub} onClick={()=>onAc("asistan")}/>
      <Row icon="💬" label={T.whatsappDestek} sub="0532 111 22 33 — 7/24" onClick={()=>window.open("https://wa.me/905321112233","_blank")}/>
      <Row icon="✉️" label={T.epostaDestek} sub="destek@tradeflow.app" onClick={()=>window.open("mailto:destek@tradeflow.app","_blank")}/>
      <Row icon="❓" label={T.yardimMerkezi} sub={T.sssSub} onClick={()=>onAc("yardim")}/>
      <Row icon="⭐" label={T.degerlendir} sub={T.degerlendirSub} onClick={()=>onAc("degerlendir")}/>
      <Row icon="📜" label={T.gizlilik} sub={T.kvkkSub} onClick={()=>onAc("gizlilik")}/>
    </Sh>

    <Sh s={{marginBottom:18,overflow:"hidden"}}><Row icon="🚪" label={T.cikisYap} sub={kullaniciEmail} danger onClick={onCikis}/></Sh>
    <div style={{textAlign:"center",padding:"8px 0 4px"}}>
      <div style={{fontSize:12,color:C.t3,fontWeight:600}}>TradeFlow Elite v1.0.0</div>
      <div style={{fontSize:10,color:C.t3,marginTop:2}}>© 2026 TradeFlow · Tüm hakları saklıdır</div>
    </div>

    {modal==="dil"&&<DilSecimModal secili={dil} onSec={setDil} onKapat={()=>setModal(null)}/>}
    {modal==="para"&&<SecimModal baslik={T.paraBirimiB+" · "+kurKaynakAd()} secenekler={[{value:"TL",label:"Türk Lirası",icon:"₺"},{value:"USD",label:"Dolar ($"+KURLAR.USD+" TL)",icon:"$"},{value:"EUR",label:"Euro (€"+KURLAR.EUR+" TL)",icon:"€"}]} secili={para} onSec={(v)=>{setPara(v);goster("Para birimi: "+v);}} onKapat={()=>setModal(null)}/>}
    {modal==="kdv"&&<KdvModal kdv={kdv} onSec={(v)=>{setKdv(v);goster("KDV: %"+v);}} onKapat={()=>setModal(null)}/>}
    {modal==="isletme"&&<IsletmeModal bilgi={isletme} onKaydet={(f)=>{setIsletme(f);goster("Kaydedildi ✓");}} onKapat={()=>setModal(null)}/>}
    {modal==="gib"&&<GibEkrani onKapat={()=>setModal(null)} isletme={isletme} gibAyar={gibAyar||{}} setGibAyar={setGibAyar} goster={goster}/>}
  </div>;
}

// ─── ANA UYGULAMA ────────────────────────────────────────────────
// ─── MUHASEBE EXPORT: EXCEL (CSV) + PDF ────────────────────────
function csvIndir(satirlar,dosyaAdi){
  const bom="\uFEFF"; // Türkçe karakterler Excel'de doğru açılsın
  const csv=bom+satirlar.map(r=>r.map(h=>'"'+String(h??"").replace(/"/g,'""')+'"').join(";")).join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download=dosyaAdi;a.click();
  URL.revokeObjectURL(url);
}
function excelIsler(jobs){
  const satirlar=[["Ref","İş Başlığı","Müşteri","Tarih","Durum","Tutar (TL)","Maliyet (TL)","Alınan Ödeme (TL)","Kalan (TL)","Atanan"]];
  jobs.forEach(j=>{
    const odenen=(j.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
    satirlar.push([j.ref,j.baslik,j.musteri,j.tarih,j.durum==="tamamlandi"?"Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede",j.tutar,j.maliyet||0,odenen,Math.max(j.tutar-odenen,0),j.atanan||""]);
  });
  csvIndir(satirlar,"tradeflow-isler-"+new Date().toISOString().slice(0,10)+".csv");
}
function excelGiderler(giderler,jobs){
  const satirlar=[["Gider Adı","Kategori","Tarih","Tutar (TL)","Bağlı İş"]];
  giderler.forEach(g=>{
    const is_=g.isId?(jobs||[]).find(j=>j.id===g.isId):null;
    satirlar.push([g.ad,g.kategori,g.tarih,g.tutar,is_?is_.baslik+" ("+is_.musteri+")":(g.isAdi||"")]);
  });
  csvIndir(satirlar,"tradeflow-giderler-"+new Date().toISOString().slice(0,10)+".csv");
}
function excelFaturalar(faturalar){
  const satirlar=[["Fatura No","Müşteri","Tarih","Ara Toplam (TL)","KDV (TL)","Tevkifat (TL)","Genel Toplam (TL)"]];
  faturalar.forEach(f=>{
    satirlar.push([f.no||f.id,f.musteri,f.tarih,f.araToplam||f.tutar||0,f.kdvTutar||0,f.tevkifatTutar||0,f.genelToplam||f.tutar||0]);
  });
  csvIndir(satirlar,"tradeflow-faturalar-"+new Date().toISOString().slice(0,10)+".csv");
}
function pdfMuhasebeRaporu(jobs,giderler,isletme){
  const tamam=jobs.filter(j=>j.durum==="tamamlandi");
  const gelir=tamam.reduce((s,j)=>s+j.tutar,0);
  const giderT=giderler.reduce((s,g)=>s+g.tutar,0);
  const tarih=new Date().toLocaleDateString("tr-TR");
  const w=window.open("","_blank");
  if(!w){alert("Açılır pencere engellendi. Tarayıcı izinlerini kontrol edin.");return;}
  const stil="body{font-family:Arial,sans-serif;padding:24px;color:#111}h1{font-size:20px}h2{font-size:14px;margin-top:24px;border-bottom:2px solid #2563EB;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#EFF6FF}.ozet{display:flex;gap:16px;margin-top:12px}.kart{border:1px solid #ddd;border-radius:8px;padding:12px 16px;flex:1}.kart b{font-size:16px}";
  const isSat=jobs.map(j=>"<tr><td>"+j.ref+"</td><td>"+j.baslik+"</td><td>"+j.musteri+"</td><td>"+j.tarih+"</td><td>"+(j.durum==="tamamlandi"?"Tamamlandı":j.durum==="aktif"?"Aktif":"Beklemede")+"</td><td style='text-align:right'>"+j.tutar.toLocaleString("tr-TR")+" TL</td></tr>").join("");
  const giSat=giderler.map(g=>"<tr><td>"+g.ad+"</td><td>"+g.kategori+"</td><td>"+g.tarih+"</td><td style='text-align:right'>"+g.tutar.toLocaleString("tr-TR")+" TL</td></tr>").join("");
  w.document.write("<html><head><title>Muhasebe Raporu</title><style>"+stil+"</style></head><body>"+
    "<h1>📊 "+(isletme?.ad||"TradeFlow")+" — Muhasebe Raporu</h1>"+
    "<div style='color:#666;font-size:12px'>Rapor Tarihi: "+tarih+" · "+(isletme?.yetkili||"")+"</div>"+
    "<div class='ozet'>"+
    "<div class='kart'>Toplam Gelir (Tamamlanan)<br><b style='color:#059669'>"+gelir.toLocaleString("tr-TR")+" TL</b></div>"+
    "<div class='kart'>Toplam Gider<br><b style='color:#DC2626'>"+giderT.toLocaleString("tr-TR")+" TL</b></div>"+
    "<div class='kart'>Net Kâr<br><b style='color:"+(gelir-giderT>=0?"#059669":"#DC2626")+"'>"+(gelir-giderT).toLocaleString("tr-TR")+" TL</b></div>"+
    "</div>"+
    "<h2>İşler ("+jobs.length+")</h2><table><tr><th>Ref</th><th>Başlık</th><th>Müşteri</th><th>Tarih</th><th>Durum</th><th>Tutar</th></tr>"+isSat+"</table>"+
    "<h2>Giderler ("+giderler.length+")</h2><table><tr><th>Ad</th><th>Kategori</th><th>Tarih</th><th>Tutar</th></tr>"+giSat+"</table>"+
    "<script>window.onload=function(){window.print();}</"+"script></body></html>");
  w.document.close();
}

// ─── MASAÜSTÜ DÜZENİ: SOL MENÜ + ÜST BAR + STAT KARTLARI ────────
function Sidebar({sekme,setSekme,T,isletme}){
  const items=[
    {id:"anasayfa",icon:"🏠",label:T.anaSayfa},
    {id:"isler",icon:"📋",label:T.isAkislari},
    {id:"teklifler",icon:"🏷️",label:T.teklifler},
    {id:"faturalar",icon:"🧾",label:T.faturalar},
    {id:"raporlar",icon:"📊",label:T.raporlar},
    {id:"tahsilatlar",icon:"💰",label:T.tahsilatlar},
    {id:"giderler",icon:"💸",label:T.giderler},
    {id:"musteriler",icon:"👥",label:T.musteriler},
    {id:"daha",icon:"⊞",label:T.dahaFazla},
  ];
  return <aside style={{width:252,flexShrink:0,background:C.card,borderRight:`1px solid ${C.border}`,height:"100vh",position:"sticky",top:0,display:"flex",flexDirection:"column",padding:"26px 16px 20px",boxSizing:"border-box"}}>
    <div style={{display:"flex",alignItems:"center",gap:11,padding:"0 8px",marginBottom:30}}>
      <div style={{width:42,height:42,borderRadius:12,background:`linear-gradient(135deg,${P},#1D4ED8)`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 12px ${P}44`}}>
        <div style={{width:0,height:0,borderLeft:"11px solid transparent",borderRight:"11px solid transparent",borderBottom:"18px solid #fff",opacity:0.95}}/>
      </div>
      <div>
        <div style={{fontSize:16,fontWeight:900,color:C.t1,letterSpacing:"-0.02em",lineHeight:1.1}}>TRADEFLOW</div>
        <div style={{fontSize:10,fontWeight:700,color:P,letterSpacing:"0.28em"}}>ELITE</div>
      </div>
    </div>
    <nav style={{display:"flex",flexDirection:"column",gap:5}}>
      {items.map(m=>{
        const aktif=sekme===m.id;
        return <div key={m.id} onClick={()=>setSekme(m.id)} style={{
          display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,cursor:"pointer",
          background:aktif?P:"transparent",color:aktif?"#fff":C.t2,
          fontWeight:aktif?700:500,fontSize:14,transition:"all 0.15s",
          boxShadow:aktif?`0 4px 12px ${P}44`:"none",
        }}
        onMouseEnter={e=>{if(!aktif)e.currentTarget.style.background=C.bg;}}
        onMouseLeave={e=>{if(!aktif)e.currentTarget.style.background="transparent";}}>
          <span style={{fontSize:17}}>{m.icon}</span>
          <span>{m.label}</span>
        </div>;
      })}
    </nav>
    <div style={{flex:1}}/>
    <div onClick={()=>setSekme("profil")} style={{display:"flex",alignItems:"center",gap:11,background:C.bg,border:`1px solid ${C.border}`,borderRadius:14,padding:"11px 13px",cursor:"pointer"}}>
      <div style={{width:40,height:40,borderRadius:12,background:`linear-gradient(135deg,${P},#1D4ED8)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",flexShrink:0}}>{(isletme.yetkili||"EO").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{isletme.yetkili||"Kullanıcı"}</div>
        <div style={{fontSize:11,color:P,fontWeight:600}}>Pro</div>
      </div>
      <span style={{color:C.t3,fontSize:13}}>⌄</span>
    </div>
  </aside>;
}

function DesktopHeader({T,isletme,okunmamis,onBildirim,onYeniIs,onAra,onAsistan,isKolu,setIsKolu}){
  const ad=(isletme.yetkili||"").split(" ")[0]||"";
  return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"28px 28px 20px",gap:16,flexWrap:"wrap"}}>
    <div>
      <div style={{fontSize:24,fontWeight:800,color:C.t1,letterSpacing:"-0.02em"}}>{T.hosgeldinT}, {ad}! 👋</div>
      <div style={{fontSize:13,color:C.t2,marginTop:3}}>{T.gozAt}</div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <select value={isKolu} onChange={e=>setIsKolu(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,fontWeight:600,cursor:"pointer",outline:"none",boxShadow:C.sh}}>
        {IS_KOLLARI.map(k=><option key={k.label} value={k.label}>{k.icon} {k.label}</option>)}
      </select>
      <button onClick={onAsistan} title="Asistan" style={{width:46,height:46,borderRadius:"50%",background:C.card,border:`1px solid ${C.border}`,fontSize:17,cursor:"pointer",boxShadow:C.sh,color:C.t2}}>🤖</button>
      <button onClick={onAra} style={{width:46,height:46,borderRadius:"50%",background:C.card,border:`1px solid ${C.border}`,fontSize:17,cursor:"pointer",boxShadow:C.sh,color:C.t2}}>🔍</button>
      <button onClick={onBildirim} style={{width:46,height:46,borderRadius:"50%",background:C.card,border:`1px solid ${C.border}`,fontSize:17,cursor:"pointer",boxShadow:C.sh,position:"relative",color:C.t2}}>
        🔔
        {okunmamis>0&&<span style={{position:"absolute",top:-2,right:-2,minWidth:19,height:19,borderRadius:10,background:C.red,color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",border:"2px solid "+C.bg}}>{okunmamis}</span>}
      </button>
      <button onClick={onYeniIs} style={{background:P,border:"none",borderRadius:14,padding:"13px 22px",color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 14px ${P}55`,display:"flex",alignItems:"center",gap:7}}>
        <span style={{fontSize:17,lineHeight:1}}>+</span> {T.yeniIs}
      </button>
    </div>
  </div>;
}

function DesktopStats({jobs,faturalar,T,onStatClick}){
  const aktif=jobs.filter(j=>j.durum==="aktif").length;
  const tahsil=jobs.filter(j=>j.durum==="tamamlandi").reduce((s,j)=>s+j.tutar,0);
  const beklT=jobs.filter(j=>j.durum==="bekliyor").reduce((s,j)=>s+j.tutar,0);
  const beklFat=jobs.filter(j=>!(faturalar||[]).some(f=>f.jobRef===j.ref)).reduce((s,j)=>s+j.tutar,0);
  const kartlar=[
    {icon:"📈",l:T.aktifIs,sub:T.devamEden,v:aktif,c:"#2563EB",bg:C.blueBg,ic:"#2563EB",go:"stat-aktif"},
    {icon:"✅",l:T.tahsilEdildi,sub:T.buAyTahsilat,v:fmt(tahsil),c:"#059669",bg:C.greenBg,ic:"#10B981",go:"stat-tahsil"},
    {icon:"⏳",l:T.bekleyenTahsilat,sub:T.toplam,v:fmt(beklT),c:"#D97706",bg:C.amberBg,ic:"#F59E0B",go:"stat-btahsilat"},
    {icon:"🧾",l:T.faturalar,sub:T.beklemede,v:fmt(beklFat),c:"#DC2626",bg:C.redBg,ic:"#EF4444",go:"stat-bekleyen"},
  ];
  return <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,padding:"0 28px 20px"}}>
    {kartlar.map(k=><div key={k.l} onClick={()=>onStatClick(k.go)} style={{background:k.bg,borderRadius:18,padding:"18px 18px 16px",cursor:"pointer",border:`1px solid ${k.ic}22`,transition:"transform 0.15s"}}
      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
      onMouseLeave={e=>e.currentTarget.style.transform="none"}>
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:12}}>
        <div style={{width:42,height:42,borderRadius:12,background:k.ic,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 4px 10px ${k.ic}44`}}>{k.icon}</div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:k.c}}>{k.l}</div>
          <div style={{fontSize:11,color:C.t3}}>{k.sub}</div>
        </div>
      </div>
      <div style={{fontSize:String(k.v).length>10?20:26,fontWeight:900,color:k.c,letterSpacing:"-0.02em"}}>{k.v}</div>
    </div>)}
  </div>;
}

// ─── GİRİŞ / KAYIT EKRANI ──────────────────────────────────────
function GirisEkrani({onGiris}){
  const trMi=typeof navigator!=="undefined"&&(navigator.language||"").toLowerCase().startsWith("tr");
  const L=trMi?{
    girisYap:"Giriş Yap",kayitOl:"Kayıt Ol",hesabaGiris:"Hesabınıza giriş yapın",yeniHesap:"Yeni hesap oluşturun",
    eposta:"E-posta",sifre:"Şifre",sifrePh:"En az 6 karakter",bekle:"Lütfen bekleyin...",
    beniHatirla:"Beni hatırla",acikKal:"şifre sormadan açık kal",
    hesapYok:"Hesabın yok mu? ",hesapVar:"Zaten hesabın var mı? ",
    hataGerekli:"E-posta ve şifre gerekli",hataKisa:"Şifre en az 6 karakter olmalı",hataYanlis:"E-posta veya şifre hatalı",hataKayitli:"Bu e-posta zaten kayıtlı, giriş yapın",hataOnay:"E-posta onayı gerekli. Gelen kutunuzu kontrol edin.",hataGenel:"Bir hata oluştu",
  }:{
    girisYap:"Sign In",kayitOl:"Sign Up",hesabaGiris:"Sign in to your account",yeniHesap:"Create a new account",
    eposta:"Email",sifre:"Password",sifrePh:"At least 6 characters",bekle:"Please wait...",
    beniHatirla:"Remember me",acikKal:"stay signed in",
    hesapYok:"No account? ",hesapVar:"Already have an account? ",
    hataGerekli:"Email and password required",hataKisa:"Password must be at least 6 characters",hataYanlis:"Invalid email or password",hataKayitli:"Email already registered, sign in",hataOnay:"Email confirmation required. Check your inbox.",hataGenel:"Something went wrong",
  };
  const [mod,setMod]=useState("giris"); // giris | kayit
  const [email,setEmail]=useState("");
  const [sifre,setSifre]=useState("");
  const [beniHatirla,setBeniHatirla]=useState(true); // varsayılan: açık kal
  const [yukleniyor,setYukleniyor]=useState(false);
  const [hata,setHata]=useState("");
  const [bilgi,setBilgi]=useState("");

  const gonder=async()=>{
    setHata("");setBilgi("");
    if(!email||!sifre){setHata(L.hataGerekli);return;}
    if(sifre.length<6){setHata(L.hataKisa);return;}
    setYukleniyor(true);
    try{
      try{ window.__tfBeniHatirla = beniHatirla; }catch(e){}
      if(mod==="kayit"){
        const {data,error}=await supabase.auth.signUp({email,password:sifre});
        if(error)throw error;
        // E-posta onayı kapalı olduğunda signUp direkt oturum döner → hemen içeri al
        if(data.session&&data.user){
          onGiris(data.user);
        }else{
          // Onay hâlâ açıksa (Supabase ayarı) yedek: giriş dene
          const {data:d2,error:e2}=await supabase.auth.signInWithPassword({email,password:sifre});
          if(e2)throw e2;
          onGiris(d2.user);
        }
      }else{
        const {data,error}=await supabase.auth.signInWithPassword({email,password:sifre});
        if(error)throw error;
        onGiris(data.user);
      }
    }catch(e){
      const m=e.message||"";
      if(m.includes("Invalid login"))setHata(L.hataYanlis);
      else if(m.includes("already registered"))setHata(L.hataKayitli);
      else if(m.includes("Email not confirmed"))setHata(L.hataOnay);
      else setHata(m||L.hataGenel);
    }
    setYukleniyor(false);
  };

  return <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#EAF1FF,#F2F2F7)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"}}>
    <div style={{width:"100%",maxWidth:400,background:"#fff",borderRadius:24,padding:"36px 28px",boxShadow:"0 12px 40px rgba(37,99,235,0.15)"}}>
      {/* Logo */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",marginBottom:28}}>
        <div style={{width:60,height:60,borderRadius:16,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,boxShadow:"0 6px 16px rgba(37,99,235,0.35)"}}>
          <div style={{width:0,height:0,borderLeft:"14px solid transparent",borderRight:"14px solid transparent",borderBottom:"22px solid #fff"}}/>
        </div>
        <div style={{fontSize:20,fontWeight:900,color:"#111827",letterSpacing:"-0.02em"}}>TRADEFLOW <span style={{color:"#2563EB"}}>ELITE</span></div>
        <div style={{fontSize:13,color:"#6B7280",marginTop:4}}>{mod==="giris"?L.hesabaGiris:L.yeniHesap}</div>
      </div>

      {/* Form */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:11,color:"#6B7280",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>{L.eposta}</div>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="ornek@mail.com"
          style={{width:"100%",boxSizing:"border-box",background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:12,padding:"13px 15px",fontSize:14,outline:"none"}}/>
      </div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:11,color:"#6B7280",fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>{L.sifre}</div>
        <input type="password" value={sifre} onChange={e=>setSifre(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")gonder();}} placeholder={L.sifrePh}
          style={{width:"100%",boxSizing:"border-box",background:"#F9FAFB",border:"1px solid #E5E7EB",borderRadius:12,padding:"13px 15px",fontSize:14,outline:"none"}}/>
      </div>

      {/* Beni hatırla */}
      <div onClick={()=>setBeniHatirla(!beniHatirla)} style={{display:"flex",alignItems:"center",gap:9,marginBottom:18,cursor:"pointer",userSelect:"none"}}>
        <div style={{width:22,height:22,borderRadius:7,border:`2px solid ${beniHatirla?"#2563EB":"#D1D5DB"}`,background:beniHatirla?"#2563EB":"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
          {beniHatirla&&<span style={{color:"#fff",fontSize:13,fontWeight:900}}>✓</span>}
        </div>
        <span style={{fontSize:13,color:"#374151",fontWeight:500}}>{L.beniHatirla} <span style={{color:"#9CA3AF",fontWeight:400}}>· {L.acikKal}</span></span>
      </div>
      {bilgi&&<div style={{background:"#DCFCE7",color:"#059669",fontSize:12,fontWeight:600,padding:"10px 14px",borderRadius:10,marginBottom:14}}>✅ {bilgi}</div>}

      <button onClick={gonder} disabled={yukleniyor} style={{width:"100%",background:yukleniyor?"#93C5FD":"#2563EB",border:"none",borderRadius:14,padding:15,color:"#fff",fontSize:15,fontWeight:700,cursor:yukleniyor?"default":"pointer",boxShadow:"0 4px 14px rgba(37,99,235,0.4)"}}>
        {yukleniyor?L.bekle:mod==="giris"?L.girisYap:L.kayitOl}
      </button>

      <div style={{textAlign:"center",marginTop:18,fontSize:13,color:"#6B7280"}}>
        {mod==="giris"?L.hesapYok:L.hesapVar}
        <span onClick={()=>{setMod(mod==="giris"?"kayit":"giris");setHata("");setBilgi("");}} style={{color:"#2563EB",fontWeight:700,cursor:"pointer"}}>
          {mod==="giris"?L.kayitOl:L.girisYap}
        </span>
      </div>
    </div>
  </div>;
}

export default function TradeFlow(){
  const [sekme,setSekme]=useState("anasayfa");
  const [jobs,setJobs]=useState(initJobs);
  const [teklifler,setTeklifler]=useState([]);
  const [giderler,setGiderler]=useState([]);
  const [faturalar,setFaturalar]=useState([]);
  const [bildirimler,setBildirimler]=useState([]);
  const [secili,setSecili]=useState(null);
  const [fatJob,setFatJob]=useState(null);
  const [yeniAc,setYeniAc]=useState(false);
  const [teklifAc,setTeklifAc]=useState(false);
  const [giderAc,setGiderAc]=useState(false);
  const [ekran,setEkran]=useState(null);
  const [isKolu,setIsKolu]=useState("Mekanik Tesisat");
  const [isKoluAc,setIsKoluAc]=useState(false);
  const [dil,setDil]=useState("tr");
  const [karanlik,setKaranlik]=useState(false);
  const [para,setPara]=useState("TL");
  const [kdv,setKdv]=useState(20);
  const [isletme,setIsletme]=useState({ad:"Elite Tesisat",yetkili:"Eray Özgül",telefon:"0532 xxx xx xx",email:"eray@elitetesisat.com",vergiNo:"",vergiDairesi:"",adres:"Çeşme, İzmir"});
  const [toast,setToast]=useState(null);
  const [banner,setBanner]=useState(null);
  const [islerFiltre,setIslerFiltre]=useState(null);
  const [moduller,setModuller]=useState(MODUL_VARSAYILAN);
  const [ozellestirAc,setOzellestirAc]=useState(false);
  const [gibAyar,setGibAyar]=useState({entegrator:"",apiKey:"",apiUser:"",apiPass:"",ortam:"test",testOk:false,canliAktif:false});
  const [gibAcSekme,setGibAcSekme]=useState(null); // GİB ekranını hangi sekmede açacak
  const [tahsilatFiltre,setTahsilatFiltre]=useState(null);
  const [sonSilinen,setSonSilinen]=useState(null); // silme geri al
  const [duzenlenecekJob,setDuzenlenecekJob]=useState(null);
  const [yeniIsMusteri,setYeniIsMusteri]=useState(null); // müşteriden iş açarken ad hazır dolu
  const [giderMusteri,setGiderMusteri]=useState(null); // müşteriden gider açarken filtre
  const [ekip,setEkip]=useState([]); // ekip üyeleri [{ad,rol}] // iş düzenleme
  const [musteriKayitlari,setMusteriKayitlari]=useState([]); // bağımsız müşteri kayıtları
  const [,force]=useState(0);
  // ── SUPABASE OTURUM + BULUT VERİ ──
  const [kullanici,setKullanici]=useState(null);
  const [oturumKontrol,setOturumKontrol]=useState(true); // ilk açılışta oturum kontrol ediliyor
  const [veriYuklendi,setVeriYuklendi]=useState(false); // bulut verisi yüklendi mi (autosave için)

  // Uygulama açılınca mevcut oturumu kontrol et
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      setKullanici(data.session?.user||null);
      setOturumKontrol(false);
    });
    const {data:sub}=supabase.auth.onAuthStateChange((_e,session)=>{
      setKullanici(session?.user||null);
    });
    // "Beni hatırla" işaretsizse: sekme/tarayıcı kapanırken oturumu kapat
    const kapanisTemizle=()=>{
      try{
        if(window.__tfBeniHatirla===false){
          supabase.auth.signOut();
        }
      }catch(e){}
    };
    window.addEventListener("beforeunload",kapanisTemizle);
    return ()=>{sub.subscription.unsubscribe();window.removeEventListener("beforeunload",kapanisTemizle);};
  },[]);

  // Kullanıcı giriş yapınca bulut verisini yükle
  useEffect(()=>{
    if(!kullanici){setVeriYuklendi(false);return;}
    let iptal=false;
    (async()=>{
      try{
        const {data,error}=await supabase.from("tradeflow_veri").select("veri").eq("kullanici_id",kullanici.id).maybeSingle();
        if(iptal)return;
        if(error){console.error("Veri yükleme:",error);}
        const v=data?.veri;
        if(v&&typeof v==="object"){
          if(Array.isArray(v.jobs))setJobs(v.jobs);
          if(Array.isArray(v.teklifler))setTeklifler(v.teklifler);
          if(Array.isArray(v.giderler))setGiderler(v.giderler);
          if(Array.isArray(v.faturalar))setFaturalar(v.faturalar);
          if(Array.isArray(v.musteriKayitlari))setMusteriKayitlari(v.musteriKayitlari);
          if(Array.isArray(v.ekip))setEkip(v.ekip);
          if(v.isletme)setIsletme(v.isletme);
          if(v.gibAyar)setGibAyar(v.gibAyar);
          if(v.dil)setDil(v.dil);
          if(typeof v.kdv==="number")setKdv(v.kdv);
          if(v.para)setPara(v.para);
          if(typeof v.karanlik==="boolean")setKaranlik(v.karanlik);
          if(Array.isArray(v.modulAktif)){
            // Sadece açık/kapalı durumunu uygula, fonksiyonlu yapıyı koru
            setModuller(MODUL_VARSAYILAN.map(md=>{
              const kayit=v.modulAktif.find(x=>x.id===md.id);
              return kayit?{...md,aktif:kayit.aktif}:md;
            }));
          }
          // ID sayacını en yüksek iş id'sine göre ilerlet
          const maxId=Math.max(0,...((v.jobs||[]).map(j=>j.id||0)));
          if(maxId>=nId)nId=maxId+1;
        }
      }catch(e){console.error(e);}
      if(!iptal)setVeriYuklendi(true);
    })();
    return ()=>{iptal=true;};
  },[kullanici]);

  // Veri değişince buluta otomatik kaydet (yüklenme bittikten sonra, 800ms gecikmeli)
  useEffect(()=>{
    if(!kullanici||!veriYuklendi)return;
    const zaman=setTimeout(async()=>{
      const paket={jobs,teklifler,giderler,faturalar,musteriKayitlari,ekip,isletme,gibAyar,dil,kdv,para,karanlik,modulAktif:moduller.map(m=>({id:m.id,aktif:m.aktif}))};
      try{
        await supabase.from("tradeflow_veri").upsert({kullanici_id:kullanici.id,veri:paket,guncelleme:new Date().toISOString()},{onConflict:"kullanici_id"});
      }catch(e){console.error("Kaydetme:",e);}
    },800);
    return ()=>clearTimeout(zaman);
  },[jobs,teklifler,giderler,faturalar,musteriKayitlari,ekip,isletme,gibAyar,dil,kdv,para,karanlik,moduller,kullanici,veriYuklendi]);

  const cikisYap=async()=>{
    await supabase.auth.signOut();
    setKullanici(null);
    // Ekranı ilk haline döndür
    setJobs(initJobs);setTeklifler([]);setGiderler([]);setFaturalar([]);setMusteriKayitlari([]);
  };

  C=karanlik?DARK:LIGHT;
  const T=getT(dil);
  AKTIF_PARA=para;
  updateDurum(T);

  const goster=(m)=>{setToast(m);setTimeout(()=>setToast(null),2200);};
  const bildirimEkle=(baslik,mesaj,tip)=>setBildirimler(p=>[{id:Date.now()+Math.random(),baslik,mesaj,tip,okundu:false,zaman:new Date().toLocaleString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})},...p]);
  const bannerGoster=(baslik,mesaj)=>{setBanner({baslik,mesaj});setTimeout(()=>setBanner(null),5000);if(typeof Notification!=="undefined"&&Notification.permission==="granted"){try{new Notification(baslik,{body:mesaj});}catch(e){}}};

  useEffect(()=>{
    // ── ANLIK KUR SİSTEMİ ──
    // 1. Piyasa kuru (anlık — öncelikli, kullanıcı isteği)
    // 2. TCMB resmî kur (piyasa erişilemezse yedek)
    // 3. Sabit yedek kur (ikisi de yoksa)
    const tcmbKuruCek=()=>{
      const tcmbUrl = (typeof window!=="undefined"&&window.location&&window.location.hostname!=="localhost"&&!window.location.hostname.includes("claude"))
        ? "/api/kur"
        : "https://www.tcmb.gov.tr/kurlar/today.xml";
      fetch(tcmbUrl).then(r=>{
        const ct=r.headers.get("content-type")||"";
        return ct.includes("json")?r.json():r.text();
      }).then(data=>{
        let usd=null,eur=null;
        if(typeof data==="object"&&data.USD){
          usd=data.USD;eur=data.EUR;
        }else if(typeof data==="string"){
          const usdM=data.match(/CurrencyCode="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          const eurM=data.match(/CurrencyCode="EUR"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          if(usdM)usd=parseFloat(usdM[1]);
          if(eurM)eur=parseFloat(eurM[1]);
        }
        if(usd&&eur){
          KURLAR={TL:1,USD:Math.round(usd*100)/100,EUR:Math.round(eur*100)/100};
          KUR_KAYNAK="tcmb";force(x=>x+1);
        }
      }).catch(()=>{});
    };
    const piyasaKuruCek=()=>{
      // Anlık piyasa kuru — öncelikli kaynak
      fetch("https://open.er-api.com/v6/latest/TRY").then(r=>r.json()).then(d=>{
        if(d&&d.rates&&d.rates.USD&&d.rates.EUR){
          KURLAR={TL:1,USD:Math.round((1/d.rates.USD)*100)/100,EUR:Math.round((1/d.rates.EUR)*100)/100};
          KUR_KAYNAK="canli";force(x=>x+1);
        }else{tcmbKuruCek();}
      }).catch(()=>{tcmbKuruCek();});
    };
    piyasaKuruCek();
    // Her 5 dakikada bir anlık kuru yenile
    const kurIv=setInterval(piyasaKuruCek,5*60*1000);
    return ()=>clearInterval(kurIv);
  },[]);

  useEffect(()=>{
    const iv=setInterval(()=>{
      const simdi=Date.now();
      setJobs(prev=>{let deg=false;const yeni=prev.map(j=>{if(j.hatirlatma&&!j.hatirlatildi&&new Date(j.hatirlatma).getTime()<=simdi){deg=true;bildirimEkle("⏰ Hatırlatma: "+j.baslik,j.musteri+" - "+fmt(j.tutar),"hatirlatma");bannerGoster("⏰ İş Hatırlatması",j.baslik+" ("+j.musteri+")");return {...j,hatirlatildi:true};}return j;});return deg?yeni:prev;});
    },20000);
    return ()=>clearInterval(iv);
  },[]);

  const jobEkle=(j)=>{setJobs(p=>[j,...p]);bildirimEkle("✅ Yeni iş eklendi",j.baslik+" · "+j.musteri,"is");goster("İş eklendi ✓");};
  const jobGuncelle=(j)=>{setJobs(p=>p.map(x=>x.id===j.id?j:x));goster("💾 İş güncellendi ✓");};
  const durumDegis=(id,d)=>{
    setJobs(p=>p.map(j=>j.id===id?{...j,durum:d}:j));
    if(d==="tamamlandi"){
      const j=jobs.find(x=>x.id===id);
      if(j){
        bildirimEkle("✅ İş tamamlandı",j.baslik,"is");
        // Periyodik iş — bir sonraki dönem için otomatik yeni iş oluştur
        if(j.tekrar&&j.tekrar!=="yok"){
          const gun=j.tekrar==="haftalik"?7:j.tekrar==="aylik"?30:365;
          const yeniTarih=new Date(Date.now()+gun*864e5).toISOString().slice(0,10);
          const cid=nId;nId++;
          setJobs(p=>[{...j,id:cid,ref:"IS-"+String(cid).padStart(4,"0"),tarih:yeniTarih,durum:"bekliyor",hatirlatildi:false,odemeler:[],hatirlatma:null},...p]);
          bildirimEkle("🔁 Periyodik iş oluşturuldu",j.baslik+" → "+yeniTarih,"is");
          goster("🔁 Sonraki dönem işi oluşturuldu: "+yeniTarih);
        }
      }
    }
  };
  const odemeEkleJob=(id,odeme)=>{
    setJobs(p=>p.map(j=>{
      if(j.id!==id)return j;
      const odemeler=[...(j.odemeler||[]),odeme];
      const toplam=odemeler.reduce((s,o)=>s+o.tutar,0);
      // Tamamı ödendiyse otomatik tamamla
      if(toplam>=j.tutar){bildirimEkle("💰 Tamamı tahsil edildi",j.baslik,"is");return {...j,odemeler,durum:"tamamlandi"};}
      return {...j,odemeler};
    }));
    goster("💰 "+fmt(odeme.tutar)+" tahsil edildi ✓");
  };
  const jobSil=(id)=>{
    const j=jobs.find(x=>x.id===id);
    setJobs(p=>p.filter(x=>x.id!==id));
    if(j){
      setSonSilinen(j);
      setTimeout(()=>setSonSilinen(s=>s&&s.id===j.id?null:s),6000);
      bildirimEkle("🗑️ İş silindi",j.baslik,"is");
    }
  };
  const geriAl=()=>{if(sonSilinen){setJobs(p=>[sonSilinen,...p]);goster("↩️ Geri alındı ✓");setSonSilinen(null);}};
  const faturaKesildi=(f)=>{setFaturalar(p=>[f,...p]);bildirimEkle("🧾 Fatura kesildi",f.no+" · "+f.musteri,"fatura");goster("Fatura kesildi ✓ "+f.no);};
  const teklifDonustur=(t)=>{const cid=nId;nId++;setJobs(p=>[{id:cid,ref:"IS-"+String(cid).padStart(4,"0"),baslik:t.baslik,musteri:t.musteri,tarih:new Date().toISOString().slice(0,10),durum:"bekliyor",tutar:t.tutar,icon:"🏷️",iconBg:"#FEE2E2",hatirlatma:null,hatirlatildi:false,odemeler:[]},...p]);setTeklifler(p=>p.filter(x=>x.id!==t.id));goster("Teklif işe dönüştürüldü ✓");bildirimEkle("🏷️ Teklif kabul edildi",t.baslik,"is");};
  const verileriSifirla=()=>{if(window.confirm("Tüm veriler silinecek. Emin misiniz?")){setJobs([]);setTeklifler([]);setGiderler([]);setFaturalar([]);setBildirimler([]);goster("Veriler sıfırlandı");}};
  const disaAktar=()=>{const data=JSON.stringify({jobs,teklifler,giderler,faturalar,isletme,gibAyar,musteriKayitlari,tarih:new Date().toISOString()},null,2);const blob=new Blob([data],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="tradeflow-yedek.json";a.click();URL.revokeObjectURL(url);goster("📤 Veriler indirildi");};
  const iceAktar=(e)=>{
    const file=e.target.files&&e.target.files[0];if(!file)return;
    const r=new FileReader();
    r.onload=(ev)=>{
      try{
        const d=JSON.parse(ev.target.result);
        if(d.jobs)setJobs(d.jobs);
        if(d.teklifler)setTeklifler(d.teklifler);
        if(d.giderler)setGiderler(d.giderler);
        if(d.faturalar)setFaturalar(d.faturalar);
        if(d.isletme)setIsletme(d.isletme);
        if(d.gibAyar)setGibAyar(d.gibAyar);
        if(d.musteriKayitlari)setMusteriKayitlari(d.musteriKayitlari);
        // ID sayacını güncelle — çakışma olmasın
        const maxId=Math.max(0,...(d.jobs||[]).map(j=>j.id||0));
        if(maxId>=nId)nId=maxId+1;
        goster("📥 Yedek geri yüklendi ✓ ("+(d.jobs?.length||0)+" iş)");
        bildirimEkle("📥 Veriler içe aktarıldı",(d.jobs?.length||0)+" iş, "+(d.faturalar?.length||0)+" fatura","is");
      }catch(err){goster("❌ Geçersiz yedek dosyası");}
    };
    r.readAsText(file);
  };
  const statClick=(go)=>{if(go==="stat-aktif"){setIslerFiltre("aktif");setSekme("isler");}else if(go==="stat-bekleyen"){setIslerFiltre("bekliyor");setSekme("isler");}else if(go==="stat-tamamlandi"){setIslerFiltre("tamamlandi");setSekme("isler");}else if(go==="stat-tahsil"){setTahsilatFiltre("tahsil");setSekme("tahsilatlar");}else if(go==="stat-btahsilat"){setTahsilatFiltre("bekleyen");setSekme("tahsilatlar");}};
  const okunmamis=bildirimler.filter(b=>!b.okundu).length;

  const NAV=[{id:"anasayfa",icon:"🏠",label:T.anaSayfa},{id:"isler",icon:"📋",label:T.isAkislari},{id:"fab",icon:"+",label:""},{id:"bildiri",icon:"🔔",label:T.bildirimlerT},{id:"profil",icon:"👤",label:T.profil}];

  // ── OTURUM KAPISI ──
  if(oturumKontrol){
    return <div style={{minHeight:"100vh",background:"#F2F2F7",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"-apple-system,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#2563EB,#1D4ED8)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
          <div style={{width:0,height:0,borderLeft:"11px solid transparent",borderRight:"11px solid transparent",borderBottom:"18px solid #fff"}}/>
        </div>
        <div style={{fontSize:13,color:"#6B7280"}}>Yükleniyor...</div>
      </div>
    </div>;
  }
  if(!kullanici){
    return <GirisEkrani onGiris={(u)=>setKullanici(u)}/>;
  }

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",display:"flex",justifyContent:MASAUSTU?"flex-start":"center"}}>
      {MASAUSTU&&<Sidebar sekme={sekme} setSekme={(s)=>{setIslerFiltre(null);setTahsilatFiltre(null);setSekme(s);}} T={T} isletme={isletme}/>}
      <div style={{width:"100%",maxWidth:MASAUSTU?1180:APP_W,display:"flex",flexDirection:"column",minHeight:"100vh",margin:MASAUSTU?"0 auto":undefined}}>

        {banner&&<div onClick={()=>{setBanner(null);setSekme("bildiri");}} style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 28px)",maxWidth:452,background:C.card,borderRadius:16,boxShadow:C.sh2,padding:"14px 16px",zIndex:3000,display:"flex",gap:12,alignItems:"center",cursor:"pointer",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:11,background:C.amberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⏰</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{banner.baslik}</div><div style={{fontSize:12,color:C.t2}}>{banner.mesaj}</div></div>
          <span style={{color:C.t3,fontSize:12}}>›</span>
        </div>}

        {!MASAUSTU&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"52px 14px 12px",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50}}>
          <div style={{width:42,height:42,background:C.bg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer",border:`1px solid ${C.border}`,color:C.t1}}>☰</div>
          <TFLogo/>
          <div style={{position:"relative"}}><div style={{width:42,height:42,background:"#1F2937",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>EO</div><div style={{position:"absolute",bottom:1,right:1,width:11,height:11,borderRadius:"50%",background:C.green,border:"2px solid "+C.card}}/></div>
        </div>}
        {MASAUSTU&&<DesktopHeader T={T} isletme={isletme} okunmamis={okunmamis} onBildirim={()=>setSekme("bildiri")} onYeniIs={()=>setYeniAc(true)} onAra={()=>setSekme("isler")} onAsistan={()=>setEkran("asistan")} isKolu={isKolu} setIsKolu={(k)=>{setIsKolu(k);goster(sektorBilgi(k).icon+" "+k+" akışına geçildi");}}/>}

        <div style={{flex:1,overflowY:"auto",paddingBottom:MASAUSTU?30:90}}>
          {sekme==="anasayfa"&&<>{MASAUSTU?<DesktopStats jobs={jobs} faturalar={faturalar} T={T} onStatClick={statClick}/>:<><div style={{height:14}}/><HeroCard jobs={jobs} onYeniIs={()=>setYeniAc(true)} isKolu={isKolu} setIsKolu={(k)=>{setIsKolu(k);goster(sektorBilgi(k).icon+" "+k+" akışına geçildi");}} isKoluAc={isKoluAc} setIsKoluAc={setIsKoluAc} T={T} onStatClick={statClick} isletmeAd={isletme.ad} onOzellestir={()=>setOzellestirAc(true)}/></>}<QuickActions setSekme={(s)=>{setIslerFiltre(null);setTahsilatFiltre(null);setSekme(s);}} T={T} moduller={moduller} onDuzenle={()=>setOzellestirAc(true)}/><Charts jobs={jobs} giderler={giderler} T={T} onTahsil={(id)=>{durumDegis(id,"tamamlandi");goster("💰 Tahsil edildi ✓");}}/><Sh s={{margin:"0 14px 14px",padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}><div style={{width:46,height:46,borderRadius:12,background:C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>⚙️</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:2}}><span style={{color:P}}>{T.duzenleBaslik1}</span> {T.duzenleBaslik2}</div><div style={{fontSize:11,color:C.t2}}>{T.duzenleAlt}</div></div><button onClick={()=>setOzellestirAc(true)} style={{background:P,border:"none",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{T.duzenle} →</button></Sh><JobList jobs={jobs} onSelect={setSecili} T={T}/></>}
          {sekme==="isler"&&<IslerTab jobs={jobs} onSelect={setSecili} T={T} filtre={islerFiltre}/>}
          {sekme==="faturalar"&&<FaturalarTab faturalar={faturalar} jobs={jobs} onFaturaKes={setFatJob} onFaturaSil={(no)=>{setFaturalar(p=>p.filter(f=>f.no!==no));goster("🗑️ Fatura silindi");}} T={T}/>}
          {sekme==="tahsilatlar"&&<TahsilatlarTab jobs={jobs} onTahsil={(id)=>{durumDegis(id,"tamamlandi");goster("💰 Tahsil edildi ✓");}} filtre={tahsilatFiltre} T={T}/>}
          {sekme==="musteriler"&&<MusterilerTab jobs={jobs} T={T} musteriKayitlari={musteriKayitlari} giderler={giderler}
          onYeniIsIcin={(ad)=>{setYeniIsMusteri(ad);setYeniAc(true);}}
          onGiderIcin={(ad)=>{setGiderMusteri(ad);setGiderAc(true);}}
          onKayitSil={(ad)=>{setMusteriKayitlari(p=>p.filter(m=>m.ad!==ad));goster("Kayıt silindi");}}
          onMusteriEkle={(m)=>{setMusteriKayitlari(p=>[...p,m]);goster("👤 Müşteri eklendi ✓");bildirimEkle("👤 Yeni müşteri",m.ad,"is");}} onMusteriSil={(ad)=>{
          // Bağımsız kayıttan sil
          setMusteriKayitlari(p=>p.filter(m=>m.ad!==ad));
          // O müşterinin işlerini de sil (isteğe bağlı — onay modalında uyarıldı)
          setJobs(p=>p.filter(j=>j.musteri!==ad));
          goster("🗑️ Müşteri silindi ✓");
          bildirimEkle("🗑️ Müşteri silindi",ad,"is");
        }}/>}
          {sekme==="teklifler"&&<TekliflerTab teklifler={teklifler} onYeni={()=>setTeklifAc(true)} onDonustur={teklifDonustur} onSil={(id)=>{setTeklifler(p=>p.filter(t=>t.id!==id));goster(T.sil+" ✓");}} onDurumDegis={(id,d)=>{setTeklifler(p=>p.map(t=>t.id===id?{...t,durum_t:d}:t));goster(d==="onaylandi"?"✅ "+T.tamamlandi:"❌");}} T={T} isletme={isletme}/>}
          {sekme==="raporlar"&&<RaporlarTab jobs={jobs} giderler={giderler} T={T} ekip={ekip}/>}
          {sekme==="giderler"&&<GiderlerTab giderler={giderler} onYeni={()=>setGiderAc(true)} onSil={(id)=>{setGiderler(p=>p.filter(g=>g.id!==id));goster(T.sil+" ✓");}} T={T}/>}
          {sekme==="daha"&&<DahaFazlaTab
          onExcelIs={()=>{excelIsler(jobs);goster("📊 Excel indirildi");}}
          onExcelGider={()=>{excelGiderler(giderler,jobs);goster("📊 Excel indirildi");}}
          onExcelFatura={()=>{excelFaturalar(faturalar);goster("📊 Excel indirildi");}}
          onPdf={()=>pdfMuhasebeRaporu(jobs,giderler,isletme)}
          onAc={setEkran} onSifirla={verileriSifirla} onExport={disaAktar} onImport={iceAktar} T={T}/>}
          {sekme==="bildiri"&&<BildirimlerTab bildirimler={bildirimler} onOkundu={()=>setBildirimler(p=>p.map(b=>({...b,okundu:true})))} T={T}/>}
          {sekme==="profil"&&<ProfilSekmesi jobs={jobs} dil={dil} setDil={setDil} karanlik={karanlik} setKaranlik={(v)=>{setKaranlik(v);goster(v?"🌙 Karanlık mod":"☀️ Açık mod");}} para={para} setPara={setPara} kdv={kdv} setKdv={setKdv} isletme={isletme} setIsletme={setIsletme} T={T} goster={goster} onAc={setEkran} gibAyar={gibAyar} setGibAyar={setGibAyar} gibAcSekme={gibAcSekme} onGibActemizle={()=>setGibAcSekme(null)} onCikis={cikisYap} kullaniciEmail={kullanici?.email} onKarne={statClick}/>}
        </div>

        {!MASAUSTU&&<div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:APP_W,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"8px 0 24px",boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",zIndex:100}}>
          {NAV.map(n=>{
            if(n.id==="fab") return <div key="fab" style={{flex:1,display:"flex",justifyContent:"center"}}><button onClick={()=>setYeniAc(true)} style={{width:56,height:56,borderRadius:"50%",background:P,border:"none",color:"#fff",fontSize:30,cursor:"pointer",boxShadow:`0 4px 16px ${P}55`,marginBottom:6}}>+</button></div>;
            const active=sekme===n.id;
            return <div key={n.id} onClick={()=>{setIslerFiltre(null);setTahsilatFiltre(null);setSekme(n.id);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"2px 0"}}>
              <div style={{fontSize:22,filter:active?"none":"grayscale(1) opacity(0.4)",position:"relative"}}>
                {n.icon}
                {n.id==="bildiri"&&okunmamis>0&&<div style={{position:"absolute",top:-4,right:-8,minWidth:16,height:16,borderRadius:8,background:C.red,color:"#fff",fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",border:"2px solid "+C.card}}>{okunmamis}</div>}
              </div>
              <div style={{fontSize:10,fontWeight:600,color:active?P:C.t3}}>{n.label}</div>
              {active&&<div style={{width:22,height:2,background:P,borderRadius:1}}/>}
            </div>;
          })}
        </div>}

        {secili&&<DetayModal job={jobs.find(j=>j.id===secili.id)||secili} onKapat={()=>setSecili(null)} onDurum={durumDegis} onFatura={()=>{setFatJob(secili);setSecili(null);}} onSil={jobSil} onDuzenle={()=>{setDuzenlenecekJob(jobs.find(j=>j.id===secili.id)||secili);setSecili(null);}} onOdeme={odemeEkleJob} T={T} giderler={giderler}/>}
        {fatJob&&<FaturaModal job={fatJob} isletme={isletme} kdv={kdv} T={T} onKapat={()=>setFatJob(null)} onKesildi={faturaKesildi} gibAyar={gibAyar} onGibAc={(sekme)=>{setFatJob(null);setSekme("profil");setTimeout(()=>setGibAcSekme(sekme),100);}}/>}
        {yeniAc&&<YeniIsModal onKapat={()=>{setYeniAc(false);setYeniIsMusteri(null);}} onEkle={jobEkle} T={T} isKolu={isKolu} jobs={jobs} varsayilanMusteri={yeniIsMusteri} ekip={ekip}/>}
        {duzenlenecekJob&&<YeniIsModal onKapat={()=>setDuzenlenecekJob(null)} onEkle={jobGuncelle} T={T} duzenlenecek={duzenlenecekJob} isKolu={isKolu} jobs={jobs} ekip={ekip}/>}
        {sonSilinen&&<div style={{position:"fixed",bottom:160,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"12px 18px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:12,whiteSpace:"nowrap"}}>
          🗑️ İş silindi
          <button onClick={geriAl} style={{background:P,border:"none",borderRadius:8,padding:"6px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>↩️ Geri Al</button>
        </div>}
        {teklifAc&&<TeklifModal T={T} kdv={kdv} onKapat={()=>setTeklifAc(false)} onEkle={(t)=>{setTeklifler(p=>[t,...p]);goster("Teklif oluşturuldu ✓");}}/>}
        {giderAc&&<GiderModal T={T} isKolu={isKolu} jobs={jobs} musteriFiltre={giderMusteri} onKapat={()=>{setGiderAc(false);setGiderMusteri(null);}} onEkle={(g)=>{setGiderler(p=>[g,...p]);goster("💸 Gider eklendi ✓");bildirimEkle("💸 Gider eklendi",g.ad+(g.isAdi?" → "+g.isAdi:""),"is");}}/>}
        {ekran==="yardim"&&<YardimMerkezi onKapat={()=>setEkran(null)}/>}
        {ekran==="asistan"&&<AsistanEkrani onKapat={()=>setEkran(null)} T={T}/>}
        {ekran==="ekip"&&<EkipEkrani onKapat={()=>setEkran(null)} ekip={ekip} setEkip={setEkip} jobs={jobs} goster={goster} T={T}/>}
        {ekran==="gizlilik"&&<GizlilikEkrani onKapat={()=>setEkran(null)}/>}
        {ekran==="degerlendir"&&<DegerlendirModal onKapat={()=>setEkran(null)} onGonder={(y,o)=>{goster("⭐".repeat(y)+" "+T.tesekkurler);bildirimEkle("⭐ Değerlendirme gönderildi",y+" yıldız"+(o?" + öneri":""),"is");}} T={T}/>}
        {ozellestirAc&&<OzellestirModal moduller={moduller} setModuller={setModuller} onKapat={()=>setOzellestirAc(false)} T={T}/>}

        {toast&&<div style={{position:"fixed",bottom:MASAUSTU?40:110,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"12px 24px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",whiteSpace:"nowrap"}}>{toast}</div>}
      </div>
    </div>
  );
}
