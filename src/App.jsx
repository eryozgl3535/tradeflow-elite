import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";

const LIGHT = {
  bg:"#F2F2F7",card:"#FFFFFF",border:"#E5E7EB",
  t1:"#111827",t2:"#6B7280",t3:"#9CA3AF",
  green:"#10B981",greenBg:"#DCFCE7",amber:"#F59E0B",amberBg:"#FEF3C7",
  red:"#EF4444",redBg:"#FEE2E2",blue:"#3B82F6",blueBg:"#DBEAFE",
  purpleBg:"#EDE9FE",inputBg:"#FFFFFF",
  statP:"#5B5CF6",statG:"#059669",statA:"#B45309",statR:"#DC2626",
  sh:"0 1px 4px rgba(0,0,0,0.07),0 0 0 1px rgba(0,0,0,0.04)",
  sh2:"0 8px 24px rgba(0,0,0,0.12)",
};
const DARK = {
  bg:"#0B0F1A",card:"#151B2B",border:"#252D42",
  t1:"#F1F5F9",t2:"#94A3B8",t3:"#64748B",
  green:"#34D399",greenBg:"#0E3A2C",amber:"#FBBF24",amberBg:"#3A2E0E",
  red:"#F87171",redBg:"#3F1717",blue:"#60A5FA",blueBg:"#12294E",
  purpleBg:"#2A2352",inputBg:"#0F1522",
  statP:"#A5B4FC",statG:"#6EE7B7",statA:"#FCD34D",statR:"#FCA5A5",
  sh:"0 1px 4px rgba(0,0,0,0.4),0 0 0 1px rgba(255,255,255,0.05)",
  sh2:"0 8px 24px rgba(0,0,0,0.6)",
};
let C = LIGHT;
const P = "#5B5CF6";

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
};
const EN = {
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
  {grup:"🌍 Batı Avrupa", diller:[
    {code:"de",ad:"Deutsch",bayrak:"🇩🇪",bolge:"Almanya · Avusturya · İsviçre"},
    {code:"fr",ad:"Français",bayrak:"🇫🇷",bolge:"Fransa · Belçika · İsviçre"},
    {code:"it",ad:"Italiano",bayrak:"🇮🇹",bolge:"İtalya"},
    {code:"nl",ad:"Nederlands",bayrak:"🇳🇱",bolge:"Hollanda · Belçika (Flemenkçe)"},
    {code:"es",ad:"Español",bayrak:"🇪🇸",bolge:"İspanya"},
    {code:"pt",ad:"Português",bayrak:"🇵🇹",bolge:"Portekiz"},
  ]},
  {grup:"🌍 Kuzey & Doğu Avrupa", diller:[
    {code:"sv",ad:"Svenska",bayrak:"🇸🇪",bolge:"İsveç"},
    {code:"da",ad:"Dansk",bayrak:"🇩🇰",bolge:"Danimarka"},
    {code:"no",ad:"Norsk",bayrak:"🇳🇴",bolge:"Norveç"},
    {code:"fi",ad:"Suomi",bayrak:"🇫🇮",bolge:"Finlandiya"},
    {code:"pl",ad:"Polski",bayrak:"🇵🇱",bolge:"Polonya"},
    {code:"cs",ad:"Čeština",bayrak:"🇨🇿",bolge:"Çekya"},
    {code:"ro",ad:"Română",bayrak:"🇷🇴",bolge:"Romanya"},
    {code:"hu",ad:"Magyar",bayrak:"🇭🇺",bolge:"Macaristan"},
    {code:"el",ad:"Ελληνικά",bayrak:"🇬🇷",bolge:"Yunanistan"},
    {code:"uk",ad:"Українська",bayrak:"🇺🇦",bolge:"Ukrayna"},
    {code:"ru",ad:"Русский",bayrak:"🇷🇺",bolge:"Rusya"},
  ]},
  {grup:"🌎 Latin Amerika", diller:[
    {code:"es_la",ad:"Español (Lat.)",bayrak:"🇲🇽",bolge:"Meksika · Arjantin · Kolombiya"},
    {code:"pt_br",ad:"Português (BR)",bayrak:"🇧🇷",bolge:"Brezilya"},
  ]},
  {grup:"🌏 Orta Doğu & Türk Dünyası", diller:[
    {code:"ar",ad:"العربية",bayrak:"🇸🇦",bolge:"Arap Dünyası"},
    {code:"fa",ad:"فارسی",bayrak:"🇮🇷",bolge:"İran"},
    {code:"he",ad:"עברית",bayrak:"🇮🇱",bolge:"İsrail"},
    {code:"az",ad:"Azərbaycan",bayrak:"🇦🇿",bolge:"Azerbaycan"},
    {code:"uz",ad:"Oʻzbek",bayrak:"🇺🇿",bolge:"Özbekistan"},
    {code:"kk",ad:"Қазақ",bayrak:"🇰🇿",bolge:"Kazakistan"},
    {code:"tr_az",ad:"Türkmen",bayrak:"🇹🇲",bolge:"Türkmenistan"},
  ]},
  {grup:"🌏 Asya-Pasifik", diller:[
    {code:"zh",ad:"中文 (简体)",bayrak:"🇨🇳",bolge:"Çin"},
    {code:"zh_tw",ad:"中文 (繁體)",bayrak:"🇹🇼",bolge:"Tayvan"},
    {code:"ja",ad:"日本語",bayrak:"🇯🇵",bolge:"Japonya"},
    {code:"ko",ad:"한국어",bayrak:"🇰🇷",bolge:"Güney Kore"},
    {code:"hi",ad:"हिन्दी",bayrak:"🇮🇳",bolge:"Hindistan"},
    {code:"bn",ad:"বাংলা",bayrak:"🇧🇩",bolge:"Bangladeş"},
    {code:"ur",ad:"اردو",bayrak:"🇵🇰",bolge:"Pakistan"},
    {code:"vi",ad:"Tiếng Việt",bayrak:"🇻🇳",bolge:"Vietnam"},
    {code:"th",ad:"ไทย",bayrak:"🇹🇭",bolge:"Tayland"},
    {code:"id",ad:"Indonesia",bayrak:"🇮🇩",bolge:"Endonezya"},
    {code:"ms",ad:"Melayu",bayrak:"🇲🇾",bolge:"Malezya"},
  ]},
];
const DIL_LISTESI = DIL_GRUPLARI.flatMap(g=>g.diller);
const getT = (dil) => {
  if(dil==="tr") return TR;
  if(dil==="en") return EN;
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
  {label:"Mekanik Tesisat",icon:"⚙️"},{label:"Havuzculuk",icon:"🏊"},
  {label:"Elektrik Tesisatı",icon:"⚡"},{label:"İnşaat & Taahhüt",icon:"🏗️"},
  {label:"Mobilya & Marangoz",icon:"🪑"},{label:"Otomotiv",icon:"🚗"},
  {label:"Danışmanlık",icon:"💼"},{label:"Reklam & Baskı",icon:"🖨️"},
  {label:"Temizlik Hizmetleri",icon:"🧹"},
];
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
function BottomSheet({children,onKapat,maxH}){return <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.42)",display:"flex",alignItems:"flex-end",zIndex:1000}} onClick={onKapat}><div onClick={e=>e.stopPropagation()} style={{background:C.card,borderRadius:"24px 24px 0 0",padding:"24px 20px 40px",width:"100%",maxWidth:480,margin:"0 auto",maxHeight:maxH||"88vh",overflowY:"auto"}}><div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 20px"}}/>{children}</div></div>;}
function Inp({label,value,onChange,placeholder,type}){return <div style={{marginBottom:14}}>{label&&<div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.08em"}}>{label}</div>}<input type={type||"text"} value={value} onChange={onChange} placeholder={placeholder} style={{width:"100%",boxSizing:"border-box",background:C.bg,border:`1px solid ${C.border}`,borderRadius:12,padding:"12px 14px",color:C.t1,fontSize:14,outline:"none"}}/></div>;}
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
    <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",height:"100vh"}}>
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
              <div style={{fontSize:14,fontWeight:700,color:m.aktif?C.t1:C.t3}}>{m.label(T)}</div>
              <div style={{fontSize:10,color:C.t3,marginTop:2}}>{m.aciklama(T)}</div>
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
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
      {gorununler.map(a=><div key={a.id} onClick={()=>setSekme(a.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6,cursor:"pointer"}}>
        <div style={{width:50,height:50,borderRadius:14,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{a.icon}</div>
        <span style={{fontSize:10,fontWeight:500,color:C.t1,textAlign:"center",lineHeight:1.2}}>{a.label(T)}</span>
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
function DetayModal({job,onKapat,onDurum,onFatura,onSil,onDuzenle,onOdeme,T}){
  const [silOnay,setSilOnay]=useState(false);
  const [odemeAc,setOdemeAc]=useState(false);
  const [odemeTutar,setOdemeTutar]=useState("");
  const [buyukFoto,setBuyukFoto]=useState(null);
  const odenen=(job.odemeler||[]).reduce((s,o)=>s+o.tutar,0);
  const kalan=job.tutar-odenen;
  const TEKRAR_AD={haftalik:"Haftalık",aylik:"Aylık",yillik:"Yıllık"};

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
      {[[T.tarihL,job.tarih],[T.durumL,DURUM[job.durum]?.label],[T.tutarL,fmt(job.tutar)],job.isAdresi?["📍 "+T.adresL,job.isAdresi]:null,job.hatirlatma?["⏰ "+T.hatirlatma,new Date(job.hatirlatma).toLocaleString("tr-TR")]:null].filter(Boolean).map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`1px solid ${C.border}`,gap:10}}>
          <span style={{fontSize:13,color:C.t2,flexShrink:0}}>{l}</span><span style={{fontSize:13,fontWeight:600,color:C.t1,textAlign:"right"}}>{v}</span>
        </div>
      ))}
      {job.isAdresi&&<div style={{padding:"10px 0"}}>
        <button onClick={()=>window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(job.isAdresi)}&travelmode=driving`,"_blank")} style={{width:"100%",background:C.blueBg,border:"none",borderRadius:10,padding:"10px 0",color:C.blue,fontSize:12,fontWeight:700,cursor:"pointer"}}>🗺️ {T.navBaslat}</button>
      </div>}
    </div>

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
    <div style={{background:"#fff",borderRadius:14,width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto",padding:"22px 20px",color:"#111",fontSize:12}}>
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

function YeniIsModal({onKapat,onEkle,T,duzenlenecek}){
  const icons=[{e:"🔧",bg:"#DCFCE7"},{e:"📦",bg:"#FEF3C7"},{e:"💻",bg:"#EDE9FE"},{e:"⚡",bg:"#FEF9C3"},{e:"🚿",bg:"#DBEAFE"},{e:"🛠️",bg:"#EDE9FE"},{e:"🏗️",bg:"#FEF3C7"},{e:"🔩",bg:"#DCFCE7"}];
  const edit=!!duzenlenecek;
  const [icon,setIcon]=useState(edit?{e:duzenlenecek.icon,bg:duzenlenecek.iconBg}:icons[0]);
  const [form,setForm]=useState(edit
    ?{baslik:duzenlenecek.baslik,musteri:duzenlenecek.musteri,tarih:duzenlenecek.tarih,tutar:String(Math.round(duzenlenecek.tutar/(KURLAR[AKTIF_PARA]||1))),durum:duzenlenecek.durum,hatirlatma:duzenlenecek.hatirlatma||"",isAdresi:duzenlenecek.isAdresi||"",musteriTelefon:duzenlenecek.musteriTelefon||"",musteriEmail:duzenlenecek.musteriEmail||"",tekrar:duzenlenecek.tekrar||"yok"}
    :{baslik:"",musteri:"",tarih:new Date().toISOString().slice(0,10),tutar:"",durum:"bekliyor",hatirlatma:"",isAdresi:"",musteriTelefon:"",musteriEmail:"",tekrar:"yok"});
  const [fotolar,setFotolar]=useState(edit?(duzenlenecek.fotolar||[]):[]);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const fotoEkle=(e)=>{const file=e.target.files&&e.target.files[0];if(!file)return;const r=new FileReader();r.onload=(ev)=>setFotolar(p=>[...p,ev.target.result]);r.readAsDataURL(file);};
  const kaydet=()=>{
    if(edit){
      onEkle({...duzenlenecek,...form,tutar:Number(form.tutar)*(KURLAR[AKTIF_PARA]||1),icon:icon.e,iconBg:icon.bg,hatirlatma:form.hatirlatma||null,fotolar});
    }else{
      const cid=nId;nId++;
      onEkle({id:cid,ref:"IS-"+String(cid).padStart(4,"0"),...form,tutar:Number(form.tutar)*(KURLAR[AKTIF_PARA]||1),icon:icon.e,iconBg:icon.bg,hatirlatma:form.hatirlatma||null,hatirlatildi:false,fotolar,odemeler:[]});
    }
    onKapat();
  };
  const TEKRAR_SECENEK=[["yok",T.tekSefer],["haftalik","🔁 "+T.haftalikL],["aylik","🔁 "+T.aylikL],["yillik","🔁 "+T.yillikL]];
  return <BottomSheet onKapat={onKapat} maxH="90vh">
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{edit?"✏️ "+T.isDuzenle:T.yeniIs}</div>
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.ikon}</div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{icons.map(ic=><button key={ic.e} onClick={()=>setIcon(ic)} style={{width:46,height:46,borderRadius:12,background:ic.bg,border:`2px solid ${icon.e===ic.e?P:"transparent"}`,fontSize:20,cursor:"pointer"}}>{ic.e}</button>)}</div>
    </div>
    <Inp label={T.isBasligi} value={form.baslik} onChange={e=>set("baslik",e.target.value)} placeholder={T.isOrnekPh}/>
    <Inp label={T.musteri} value={form.musteri} onChange={e=>set("musteri",e.target.value)} placeholder={T.musteriOrnekPh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tarihL} type="date" value={form.tarih} onChange={e=>set("tarih",e.target.value)}/></div>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={form.tutar} onChange={e=>set("tutar",e.target.value)} placeholder="0"/></div>
    </div>
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

function TeklifModal({onKapat,onEkle,T}){
  const [f,setF]=useState({musteri:"",baslik:"",tutar:"",gecerlilik:new Date(Date.now()+14*864e5).toISOString().slice(0,10)});
  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{T.yeniTeklif}</div>
    <Inp label={T.musteri} value={f.musteri} onChange={e=>setF(x=>({...x,musteri:e.target.value}))} placeholder={T.musteriAdiPh}/>
    <Inp label={T.isBasligi} value={f.baslik} onChange={e=>setF(x=>({...x,baslik:e.target.value}))} placeholder={T.klimaPh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={f.tutar} onChange={e=>setF(x=>({...x,tutar:e.target.value}))}/></div>
      <div style={{flex:1}}><Inp label={T.gecerlilik} type="date" value={f.gecerlilik} onChange={e=>setF(x=>({...x,gecerlilik:e.target.value}))}/></div>
    </div>
    <div style={{display:"flex",gap:10}}><BtnS onClick={onKapat}>{T.iptal}</BtnS><BtnP onClick={()=>{onEkle({id:Date.now(),...f,tutar:Number(f.tutar)*(KURLAR[AKTIF_PARA]||1)});onKapat();}}>+ {T.yeniTeklif}</BtnP></div>
  </BottomSheet>;
}

function GiderModal({onKapat,onEkle,T}){
  const [f,setF]=useState({ad:"",tutar:"",kategori:"Malzeme",tarih:new Date().toISOString().slice(0,10)});
  return <BottomSheet onKapat={onKapat}>
    <div style={{fontSize:18,fontWeight:800,color:C.t1,marginBottom:16}}>{T.yeniGider}</div>
    <Inp label={T.giderL} value={f.ad} onChange={e=>setF(x=>({...x,ad:e.target.value}))} placeholder={T.malzemePh}/>
    <div style={{display:"flex",gap:10}}>
      <div style={{flex:1}}><Inp label={T.tutarL+" ("+AKTIF_PARA+")"} type="number" value={f.tutar} onChange={e=>setF(x=>({...x,tutar:e.target.value}))}/></div>
      <div style={{flex:1}}><Inp label={T.tarihL} type="date" value={f.tarih} onChange={e=>setF(x=>({...x,tarih:e.target.value}))}/></div>
    </div>
    <div style={{marginBottom:18}}>
      <div style={{fontSize:11,color:C.t2,fontWeight:600,marginBottom:8,textTransform:"uppercase"}}>{T.kategori||"Kategori"}</div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{GIDER_KAT.map(k=><button key={k} onClick={()=>setF(x=>({...x,kategori:k}))} style={{padding:"8px 14px",borderRadius:10,border:`2px solid ${f.kategori===k?P:C.border}`,background:f.kategori===k?C.purpleBg:C.bg,color:f.kategori===k?P:C.t2,fontSize:12,fontWeight:600,cursor:"pointer"}}>{k}</button>)}</div>
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
    <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",height:"100vh"}}>
      <GeriBaslik baslik="Gizlilik Politikası" onKapat={onKapat}/>
      <div style={{flex:1,overflowY:"auto",padding:"16px 14px 40px"}}>
        <div style={{fontSize:11,color:C.t3,marginBottom:14}}>Son güncelleme: Temmuz 2026 · TradeFlow Elite v1.0</div>
        {bolumler.map(x=><Sh key={x.b} s={{padding:"16px 18px",marginBottom:12}}><div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:6}}>{x.b}</div><div style={{fontSize:13,color:C.t2,lineHeight:1.6}}>{x.m}</div></Sh>)}
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
    <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",height:"100vh"}}>
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
    <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",height:"100vh"}}>
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

function FaturalarTab({faturalar,jobs,onFaturaKes,T}){
  return <div style={{padding:"16px 14px"}}>
    <div style={{fontSize:18,fontWeight:700,color:C.t1,marginBottom:14}}>{T.faturalar} ({faturalar.length})</div>
    {faturalar.length===0&&<Sh s={{padding:28,textAlign:"center",marginBottom:14}}><div style={{fontSize:36,marginBottom:8}}>🧾</div><div style={{fontSize:14,color:C.t2}}>{T.henuzFaturaYok}</div><div style={{fontSize:12,color:C.t3,marginTop:4}}>{T.faturaKes} seçeneğini kullanın.</div></Sh>}
    {faturalar.map(f=><Sh key={f.no} s={{padding:"16px 18px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,fontFamily:"monospace",color:P,fontWeight:700}}>{f.no}</span><span style={{fontSize:11,color:C.green,background:C.greenBg,padding:"3px 9px",borderRadius:20,fontWeight:700}}>{T.kesildiL}</span></div>
      <div style={{fontSize:14,fontWeight:700,color:C.t1}}>{f.musteri}</div>
      <div style={{fontSize:10,color:C.t3,fontFamily:"monospace",margin:"3px 0"}}>ETTN: {f.ettn.slice(0,18)}...</div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}><span style={{fontSize:11,color:C.t3}}>{f.tarih} · {f.jobRef}</span><span style={{fontSize:15,fontWeight:800,color:C.green}}>{fmt(f.tutar)}</span></div>
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

function MusteriDetayModal({musteri,onKapat,T}){
  const navGit=(adres)=>{
    const q=encodeURIComponent(adres);
    // Önce Google Maps uygulamasını dene, yoksa web'e git
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`,"_blank");
  };
  const toplamIs=musteri.isler.length;
  const tamamlandi=musteri.isler.filter(j=>j.durum==="tamamlandi");
  const bekliyor=musteri.isler.filter(j=>j.durum==="bekliyor");
  const aktif=musteri.isler.filter(j=>j.durum==="aktif");
  const toplamCiro=musteri.isler.reduce((s,j)=>s+j.tutar,0);
  const tahsilEdilen=tamamlandi.reduce((s,j)=>s+j.tutar,0);

  return <BottomSheet onKapat={onKapat} maxH="92vh">
    {/* Başlık */}
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:18}}>
      <div style={{width:54,height:54,borderRadius:16,background:`linear-gradient(135deg,${P},#7C3AED)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"#fff",flexShrink:0}}>{musteri.ad[0]}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:19,fontWeight:800,color:C.t1}}>{musteri.ad}</div>
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
  </BottomSheet>;
}

function MusterilerTab({jobs,T,musteriKayitlari,onMusteriEkle}){
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

  return <div style={{padding:"16px 14px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontSize:18,fontWeight:700,color:C.t1}}>{T.musteriler} ({liste.length})</div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <select value={siralama} onChange={e=>setSiralama(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"5px 10px",color:C.t2,fontSize:11,cursor:"pointer",outline:"none"}}>
          <option value="ciro">↓ {T.ciroL}</option>
          <option value="isler">↓ {T.isSayisi}</option>
          <option value="ad">A-Z</option>
        </select>
        <button onClick={()=>setYeniAc(true)} style={{background:P,border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>+ {T.yeniL}</button>
      </div>
    </div>

    {/* Yeni müşteri formu */}
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

    {/* Toplam ciro özet */}
    {liste.length>0&&<Sh s={{padding:"12px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:C.t2}}>{T.toplamCiro}</span>
      <span style={{fontSize:15,fontWeight:800,color:P}}>{fmt(toplamCiro)}</span>
    </Sh>}

    {/* Arama */}
    <input value={arama} onChange={e=>setArama(e.target.value)} placeholder={T.aramaPh}
      style={{width:"100%",boxSizing:"border-box",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"11px 14px",color:C.t1,fontSize:13,outline:"none",marginBottom:12,boxShadow:C.sh}}/>

    {liste.length===0&&<Sh s={{padding:36,textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:10}}>👥</div>
      <div style={{fontSize:14,color:C.t2}}>{T.musteriler} - henüz yok</div>
      <div style={{fontSize:12,color:C.t3,marginTop:4}}>{T.sonIsAkislari}</div>
    </Sh>}

    {liste.map((m,i)=>{
      const ciro=m.isler.reduce((s,j)=>s+j.tutar,0);
      const tamamlandi=m.isler.filter(j=>j.durum==="tamamlandi").length;
      const adresVarMi=m.adresler.length>0;
      const ilkAdres=m.adresler[0];

      return <Sh key={m.ad} onClick={()=>setSecili(m)} s={{padding:"14px 16px",marginBottom:10,cursor:"pointer"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
          {/* Avatar */}
          <div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${P}CC,#7C3AED)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#fff",flexShrink:0,position:"relative"}}>
            {m.ad[0]}
            {i===0&&<div style={{position:"absolute",top:-6,right:-6,fontSize:14}}>👑</div>}
          </div>

          {/* Bilgiler */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
              <div style={{fontSize:14,fontWeight:700,color:C.t1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1}}>{m.ad}</div>
              <div style={{fontSize:15,fontWeight:800,color:C.green,flexShrink:0,marginLeft:8}}>{fmt(ciro)}</div>
            </div>

            <div style={{display:"flex",gap:6,marginBottom:adresVarMi?8:0,flexWrap:"wrap"}}>
              <span style={{fontSize:10,background:C.purpleBg,color:P,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{m.isler.length} iş</span>
              {tamamlandi>0&&<span style={{fontSize:10,background:C.greenBg,color:C.green,padding:"2px 8px",borderRadius:20,fontWeight:600}}>✅ {tamamlandi} tamamlandı</span>}
              {m.isler.some(j=>j.durum==="bekliyor")&&<span style={{fontSize:10,background:C.amberBg,color:C.amber,padding:"2px 8px",borderRadius:20,fontWeight:600}}>⏰ bekleyen var</span>}
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

    {/* Detay modal */}
    {secili&&<MusteriDetayModal musteri={secili} onKapat={()=>setSecili(null)} T={T}/>}
  </div>;
}

function TekliflerTab({teklifler,onYeni,onDonustur,onSil,onDurumDegis,T}){
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
            const metin=`🏷️ *FİYAT TEKLİFİ*\n\nSayın ${t.musteri},\n\n📋 İş: ${t.baslik}\n💰 Tutar: ${t.tutar.toLocaleString("tr-TR")} TL\n📅 Geçerlilik: ${t.gecerlilik}\n\nOnayınızı bekliyoruz. Sorularınız için bize ulaşabilirsiniz.`;
            window.open("https://wa.me/?text="+encodeURIComponent(metin),"_blank");
          }} style={{flex:1,background:"#DCF8C6",border:"none",borderRadius:10,padding:"10px 0",color:"#128C7E",fontSize:12,fontWeight:700,cursor:"pointer"}}>💬</button>
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

function GiderlerTab({giderler,onYeni,onSil,T}){
  const toplam=giderler.reduce((s,g)=>s+g.tutar,0);
  const katToplam={};giderler.forEach(g=>{katToplam[g.kategori]=(katToplam[g.kategori]||0)+g.tutar;});
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
    {giderler.length===0&&<div style={{textAlign:"center",padding:20,color:C.t3,fontSize:13}}>{T.henuzGiderYok}</div>}
    {giderler.map(g=><Sh key={g.id} s={{padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{g.ad}</div><div style={{fontSize:11,color:C.t3}}>{g.kategori} · {g.tarih}</div></div>
      <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14,fontWeight:800,color:C.red}}>-{fmt(g.tutar)}</span><button onClick={()=>onSil(g.id)} style={{background:"none",border:"none",color:C.t3,fontSize:16,cursor:"pointer"}}>×</button></div>
    </Sh>)}
  </div>;
}

function RaporlarTab({jobs,giderler,T}){
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

function DahaFazlaTab({onAc,onSifirla,onExport,onImport,T}){
  const items=[
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
function ProfilSekmesi({jobs,dil,setDil,karanlik,setKaranlik,para,setPara,kdv,setKdv,isletme,setIsletme,T,goster,onAc,gibAyar,setGibAyar,gibAcSekme,onGibActemizle}){
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
            :<div style={{width:72,height:72,borderRadius:18,background:"linear-gradient(135deg,#5B5CF6,#7C3AED)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:800,color:"#fff"}}>{(isletme.yetkili||"EO").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}</div>}
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
    <Sh s={{padding:"16px 18px",marginBottom:14,background:"linear-gradient(135deg,#5B5CF6,#7C3AED)"}}>
      <div style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.75)",letterSpacing:"0.1em",marginBottom:10}}>⭐ {T.buAyinKarnesi}</div>
      <div style={{display:"flex",gap:8,marginBottom:10}}>
        {[{val:tamamlanan,label:T.tamamlandi,icon:"✅"},{val:fmt(tahsilat),label:T.tahsilat,icon:"💰"},{val:aktifIs,label:T.aktifL,icon:"🔄"},{val:bekleyenIs,label:T.bekleyen,icon:"⏳"}].map(s=><div key={s.label} style={{flex:1,background:"rgba(255,255,255,0.14)",borderRadius:10,padding:"10px 4px",textAlign:"center"}}>
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
      <Row icon="💬" label={T.whatsappDestek} sub="0532 111 22 33 — 7/24" onClick={()=>window.open("https://wa.me/905321112233","_blank")}/>
      <Row icon="✉️" label={T.epostaDestek} sub="destek@tradeflow.app" onClick={()=>window.open("mailto:destek@tradeflow.app","_blank")}/>
      <Row icon="❓" label={T.yardimMerkezi} sub={T.sssSub} onClick={()=>onAc("yardim")}/>
      <Row icon="⭐" label={T.degerlendir} sub={T.degerlendirSub} onClick={()=>onAc("degerlendir")}/>
      <Row icon="📜" label={T.gizlilik} sub={T.kvkkSub} onClick={()=>onAc("gizlilik")}/>
    </Sh>

    <Sh s={{marginBottom:18,overflow:"hidden"}}><Row icon="🚪" label={T.cikisYap} danger onClick={()=>goster("Çıkış yapıldı (demo)")}/></Sh>
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
  const [duzenlenecekJob,setDuzenlenecekJob]=useState(null); // iş düzenleme
  const [musteriKayitlari,setMusteriKayitlari]=useState([]); // bağımsız müşteri kayıtları
  const [,force]=useState(0);

  C=karanlik?DARK:LIGHT;
  const T=getT(dil);
  AKTIF_PARA=para;
  updateDurum(T);

  const goster=(m)=>{setToast(m);setTimeout(()=>setToast(null),2200);};
  const bildirimEkle=(baslik,mesaj,tip)=>setBildirimler(p=>[{id:Date.now()+Math.random(),baslik,mesaj,tip,okundu:false,zaman:new Date().toLocaleString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})},...p]);
  const bannerGoster=(baslik,mesaj)=>{setBanner({baslik,mesaj});setTimeout(()=>setBanner(null),5000);if(typeof Notification!=="undefined"&&Notification.permission==="granted"){try{new Notification(baslik,{body:mesaj});}catch(e){}}};

  useEffect(()=>{
    // ── 3 KATMANLI KUR SİSTEMİ ──
    // 1. TCMB resmî günlük kur (öncelikli — fatura/muhasebe için doğru olan)
    // 2. Piyasa kuru (er-api, anlık)
    // 3. Sabit yedek kur
    const piyasaKuruCek=()=>{
      fetch("https://open.er-api.com/v6/latest/TRY").then(r=>r.json()).then(d=>{
        if(d&&d.rates&&d.rates.USD&&d.rates.EUR){
          KURLAR={TL:1,USD:Math.round((1/d.rates.USD)*100)/100,EUR:Math.round((1/d.rates.EUR)*100)/100};
          KUR_KAYNAK="canli";force(x=>x+1);
        }
      }).catch(()=>{});
    };
    const tcmbKuruCek=()=>{
      // TCMB günlük kur XML'i — tarayıcı CORS engellerse piyasa kuruna düşer.
      // Vercel'e kurulduğunda /api/kur proxy'si üzerinden %100 çalışır.
      const tcmbUrl = (typeof window!=="undefined"&&window.location&&window.location.hostname!=="localhost"&&!window.location.hostname.includes("claude"))
        ? "/api/kur"  // Vercel'de kendi proxy'miz
        : "https://www.tcmb.gov.tr/kurlar/today.xml"; // direkt deneme
      fetch(tcmbUrl).then(r=>{
        const ct=r.headers.get("content-type")||"";
        return ct.includes("json")?r.json():r.text();
      }).then(data=>{
        let usd=null,eur=null;
        if(typeof data==="object"&&data.USD){ // Vercel proxy JSON döner
          usd=data.USD;eur=data.EUR;
        }else if(typeof data==="string"){ // TCMB XML parse
          const usdM=data.match(/CurrencyCode="USD"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          const eurM=data.match(/CurrencyCode="EUR"[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          if(usdM)usd=parseFloat(usdM[1]);
          if(eurM)eur=parseFloat(eurM[1]);
        }
        if(usd&&eur){
          KURLAR={TL:1,USD:Math.round(usd*100)/100,EUR:Math.round(eur*100)/100};
          KUR_KAYNAK="tcmb";force(x=>x+1);
        }else{piyasaKuruCek();}
      }).catch(()=>{piyasaKuruCek();});
    };
    tcmbKuruCek();
    // Her 30 dakikada bir güncelle
    const kurIv=setInterval(tcmbKuruCek,30*60*1000);
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
  const statClick=(go)=>{if(go==="stat-aktif"){setIslerFiltre("aktif");setSekme("isler");}else if(go==="stat-bekleyen"){setIslerFiltre("bekliyor");setSekme("isler");}else if(go==="stat-tahsil"){setTahsilatFiltre("tahsil");setSekme("tahsilatlar");}else if(go==="stat-btahsilat"){setTahsilatFiltre("bekleyen");setSekme("tahsilatlar");}};
  const okunmamis=bildirimler.filter(b=>!b.okundu).length;

  const NAV=[{id:"anasayfa",icon:"🏠",label:T.anaSayfa},{id:"isler",icon:"📋",label:T.isAkislari},{id:"fab",icon:"+",label:""},{id:"bildiri",icon:"🔔",label:T.bildirimlerT},{id:"profil",icon:"👤",label:T.profil}];

  return (
    <div style={{background:C.bg,minHeight:"100vh",fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",display:"flex",justifyContent:"center"}}>
      <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",minHeight:"100vh"}}>

        {banner&&<div onClick={()=>{setBanner(null);setSekme("bildiri");}} style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",width:"calc(100% - 28px)",maxWidth:452,background:C.card,borderRadius:16,boxShadow:C.sh2,padding:"14px 16px",zIndex:3000,display:"flex",gap:12,alignItems:"center",cursor:"pointer",border:`1px solid ${C.border}`}}>
          <div style={{width:40,height:40,borderRadius:11,background:C.amberBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⏰</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.t1}}>{banner.baslik}</div><div style={{fontSize:12,color:C.t2}}>{banner.mesaj}</div></div>
          <span style={{color:C.t3,fontSize:12}}>›</span>
        </div>}

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"52px 14px 12px",background:C.card,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:50}}>
          <div style={{width:42,height:42,background:C.bg,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer",border:`1px solid ${C.border}`,color:C.t1}}>☰</div>
          <TFLogo/>
          <div style={{position:"relative"}}><div style={{width:42,height:42,background:"#1F2937",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff"}}>EO</div><div style={{position:"absolute",bottom:1,right:1,width:11,height:11,borderRadius:"50%",background:C.green,border:"2px solid "+C.card}}/></div>
        </div>

        <div style={{flex:1,overflowY:"auto",paddingBottom:90}}>
          {sekme==="anasayfa"&&<><div style={{height:14}}/><HeroCard jobs={jobs} onYeniIs={()=>setYeniAc(true)} isKolu={isKolu} setIsKolu={setIsKolu} isKoluAc={isKoluAc} setIsKoluAc={setIsKoluAc} T={T} onStatClick={statClick} isletmeAd={isletme.ad} onOzellestir={()=>setOzellestirAc(true)}/><QuickActions setSekme={(s)=>{setIslerFiltre(null);setTahsilatFiltre(null);setSekme(s);}} T={T} moduller={moduller} onDuzenle={()=>setOzellestirAc(true)}/><Charts jobs={jobs} giderler={giderler} T={T} onTahsil={(id)=>{durumDegis(id,"tamamlandi");goster("💰 Tahsil edildi ✓");}}/><Sh s={{margin:"0 14px 14px",padding:"16px 18px",display:"flex",alignItems:"center",gap:14}}><div style={{width:46,height:46,borderRadius:12,background:C.purpleBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>⚙️</div><div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.t1,marginBottom:2}}><span style={{color:P}}>{T.duzenleBaslik1}</span> {T.duzenleBaslik2}</div><div style={{fontSize:11,color:C.t2}}>{T.duzenleAlt}</div></div><button onClick={()=>setOzellestirAc(true)} style={{background:P,border:"none",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer",whiteSpace:"nowrap"}}>{T.duzenle} →</button></Sh><JobList jobs={jobs} onSelect={setSecili} T={T}/></>}
          {sekme==="isler"&&<IslerTab jobs={jobs} onSelect={setSecili} T={T} filtre={islerFiltre}/>}
          {sekme==="faturalar"&&<FaturalarTab faturalar={faturalar} jobs={jobs} onFaturaKes={setFatJob} T={T}/>}
          {sekme==="tahsilatlar"&&<TahsilatlarTab jobs={jobs} onTahsil={(id)=>{durumDegis(id,"tamamlandi");goster("💰 Tahsil edildi ✓");}} filtre={tahsilatFiltre} T={T}/>}
          {sekme==="musteriler"&&<MusterilerTab jobs={jobs} T={T} musteriKayitlari={musteriKayitlari} onMusteriEkle={(m)=>{setMusteriKayitlari(p=>[...p,m]);goster("👤 Müşteri eklendi ✓");bildirimEkle("👤 Yeni müşteri",m.ad,"is");}}/>}
          {sekme==="teklifler"&&<TekliflerTab teklifler={teklifler} onYeni={()=>setTeklifAc(true)} onDonustur={teklifDonustur} onSil={(id)=>{setTeklifler(p=>p.filter(t=>t.id!==id));goster(T.sil+" ✓");}} onDurumDegis={(id,d)=>{setTeklifler(p=>p.map(t=>t.id===id?{...t,durum_t:d}:t));goster(d==="onaylandi"?"✅ "+T.tamamlandi:"❌");}} T={T}/>}
          {sekme==="raporlar"&&<RaporlarTab jobs={jobs} giderler={giderler} T={T}/>}
          {sekme==="giderler"&&<GiderlerTab giderler={giderler} onYeni={()=>setGiderAc(true)} onSil={(id)=>{setGiderler(p=>p.filter(g=>g.id!==id));goster(T.sil+" ✓");}} T={T}/>}
          {sekme==="daha"&&<DahaFazlaTab onAc={setEkran} onSifirla={verileriSifirla} onExport={disaAktar} onImport={iceAktar} T={T}/>}
          {sekme==="bildiri"&&<BildirimlerTab bildirimler={bildirimler} onOkundu={()=>setBildirimler(p=>p.map(b=>({...b,okundu:true})))} T={T}/>}
          {sekme==="profil"&&<ProfilSekmesi jobs={jobs} dil={dil} setDil={setDil} karanlik={karanlik} setKaranlik={(v)=>{setKaranlik(v);goster(v?"🌙 Karanlık mod":"☀️ Açık mod");}} para={para} setPara={setPara} kdv={kdv} setKdv={setKdv} isletme={isletme} setIsletme={setIsletme} T={T} goster={goster} onAc={setEkran} gibAyar={gibAyar} setGibAyar={setGibAyar} gibAcSekme={gibAcSekme} onGibActemizle={()=>setGibAcSekme(null)}/>}
        </div>

        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.card,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"8px 0 24px",boxShadow:"0 -4px 20px rgba(0,0,0,0.06)",zIndex:100}}>
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
        </div>

        {secili&&<DetayModal job={jobs.find(j=>j.id===secili.id)||secili} onKapat={()=>setSecili(null)} onDurum={durumDegis} onFatura={()=>{setFatJob(secili);setSecili(null);}} onSil={jobSil} onDuzenle={()=>{setDuzenlenecekJob(jobs.find(j=>j.id===secili.id)||secili);setSecili(null);}} onOdeme={odemeEkleJob} T={T}/>}
        {fatJob&&<FaturaModal job={fatJob} isletme={isletme} kdv={kdv} T={T} onKapat={()=>setFatJob(null)} onKesildi={faturaKesildi} gibAyar={gibAyar} onGibAc={(sekme)=>{setFatJob(null);setSekme("profil");setTimeout(()=>setGibAcSekme(sekme),100);}}/>}
        {yeniAc&&<YeniIsModal onKapat={()=>setYeniAc(false)} onEkle={jobEkle} T={T}/>}
        {duzenlenecekJob&&<YeniIsModal onKapat={()=>setDuzenlenecekJob(null)} onEkle={jobGuncelle} T={T} duzenlenecek={duzenlenecekJob}/>}
        {sonSilinen&&<div style={{position:"fixed",bottom:160,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"12px 18px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",display:"flex",alignItems:"center",gap:12,whiteSpace:"nowrap"}}>
          🗑️ İş silindi
          <button onClick={geriAl} style={{background:P,border:"none",borderRadius:8,padding:"6px 14px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>↩️ Geri Al</button>
        </div>}
        {teklifAc&&<TeklifModal T={T} onKapat={()=>setTeklifAc(false)} onEkle={(t)=>{setTeklifler(p=>[t,...p]);goster("Teklif oluşturuldu ✓");}}/>}
        {giderAc&&<GiderModal T={T} onKapat={()=>setGiderAc(false)} onEkle={(g)=>{setGiderler(p=>[g,...p]);goster("Gider eklendi ✓");}}/>}
        {ekran==="yardim"&&<YardimMerkezi onKapat={()=>setEkran(null)}/>}
        {ekran==="gizlilik"&&<GizlilikEkrani onKapat={()=>setEkran(null)}/>}
        {ekran==="degerlendir"&&<DegerlendirModal onKapat={()=>setEkran(null)} onGonder={(y,o)=>{goster("⭐".repeat(y)+" "+T.tesekkurler);bildirimEkle("⭐ Değerlendirme gönderildi",y+" yıldız"+(o?" + öneri":""),"is");}} T={T}/>}
        {ozellestirAc&&<OzellestirModal moduller={moduller} setModuller={setModuller} onKapat={()=>setOzellestirAc(false)} T={T}/>}

        {toast&&<div style={{position:"fixed",bottom:110,left:"50%",transform:"translateX(-50%)",background:"#1F2937",color:"#fff",padding:"12px 24px",borderRadius:14,fontSize:13,fontWeight:600,zIndex:3000,boxShadow:"0 8px 24px rgba(0,0,0,0.3)",whiteSpace:"nowrap"}}>{toast}</div>}
      </div>
    </div>
  );
}
