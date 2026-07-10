// KlimaSun ürün kataloğu — statik veri katmanı.
// Kategoriler (segment): bireysel / ticari / sanayi
// Tipler: urun / yedek-parca / aksesuar
// Markalar: rittal (pano klima & soğutma) / klimasun (genel)

export const SEGMENTS = {
  bireysel: {
    slug: 'bireysel',
    label: 'Bireysel',
    icon: '🏠',
    title: 'Bireysel Klima Çözümleri',
    desc: 'Ev, ofis ve küçük işyerleri için split, salon tipi ve taşınabilir klimalar; yedek parça ve aksesuarları.',
  },
  ticari: {
    slug: 'ticari',
    label: 'Ticari',
    icon: '🏢',
    title: 'Ticari İklimlendirme Çözümleri',
    desc: 'Mağaza, restoran, otel ve ofis binaları için VRF, kaset tipi, rooftop ve hava perdesi çözümleri.',
  },
  sanayi: {
    slug: 'sanayi',
    label: 'Sanayi',
    icon: '🏭',
    title: 'Endüstriyel Soğutma Çözümleri',
    desc: 'Pano klimaları, chiller, LCP ve proses soğutma — Rittal başta olmak üzere endüstriyel çözümler.',
  },
};

export const TYPES = {
  urun: { slug: 'urun', label: 'Ürünler', plural: 'Ürünler', icon: '❄️' },
  'yedek-parca': { slug: 'yedek-parca', label: 'Yedek Parça', plural: 'Yedek Parçalar', icon: '🔧' },
  aksesuar: { slug: 'aksesuar', label: 'Aksesuar', plural: 'Aksesuarlar', icon: '🧩' },
};

export const BRANDS = {
  rittal: {
    slug: 'rittal',
    label: 'Rittal',
    desc: 'Rittal pano klimaları, TopTherm chiller ve Blue e+ serisi — enerji verimli endüstriyel soğutma.',
  },
  klimasun: {
    slug: 'klimasun',
    label: 'KlimaSun',
    desc: 'KlimaSun genel iklimlendirme ürün gamı.',
  },
};

// Her ürün: slug, ad, kod, segment, tip, marka, etiketler, ozet, ozellikler, oneCikan
export const PRODUCTS = [
  // ─────────────────────────── BİREYSEL / ÜRÜNLER ───────────────────────────
  {
    slug: 'duvar-tipi-split-klima-12000-btu',
    ad: 'Duvar Tipi Split Klima 12.000 BTU',
    kod: 'KS-SPL-12',
    segment: 'bireysel',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['split', 'inverter', 'r32', 'a++', 'wifi'],
    ozet: 'A++ enerji sınıfı, R32 gazlı, Wi-Fi kontrollü inverter split klima. 15–25 m² alanlar için ideal.',
    ozellikler: {
      'Soğutma Kapasitesi': '12.000 BTU/h (3,5 kW)',
      'Enerji Sınıfı': 'A++',
      'Soğutucu Akışkan': 'R32',
      'Ses Seviyesi (iç ünite)': '21 dB(A)',
      Kontrol: 'Wi-Fi + Uzaktan kumanda',
    },
    oneCikan: true,
  },
  {
    slug: 'duvar-tipi-split-klima-18000-btu',
    ad: 'Duvar Tipi Split Klima 18.000 BTU',
    kod: 'KS-SPL-18',
    segment: 'bireysel',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['split', 'inverter', 'r32', 'a++'],
    ozet: 'Geniş odalar ve açık ofisler için 18.000 BTU inverter split klima. 25–40 m² alanlar için.',
    ozellikler: {
      'Soğutma Kapasitesi': '18.000 BTU/h (5,3 kW)',
      'Enerji Sınıfı': 'A++',
      'Soğutucu Akışkan': 'R32',
      'Ses Seviyesi (iç ünite)': '24 dB(A)',
    },
  },
  {
    slug: 'salon-tipi-klima-24000-btu',
    ad: 'Salon Tipi Klima 24.000 BTU',
    kod: 'KS-SLN-24',
    segment: 'bireysel',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['salon-tipi', 'inverter', 'r32'],
    ozet: 'Büyük salonlar ve dükkanlar için dikey salon tipi klima. Güçlü hava debisi, uzak mesafe üflemesi.',
    ozellikler: {
      'Soğutma Kapasitesi': '24.000 BTU/h (7 kW)',
      'Enerji Sınıfı': 'A+',
      'Soğutucu Akışkan': 'R32',
      'Hava Debisi': '1.100 m³/h',
    },
  },
  {
    slug: 'tasinabilir-klima-9000-btu',
    ad: 'Taşınabilir Klima 9.000 BTU',
    kod: 'KS-TSN-09',
    segment: 'bireysel',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['tasinabilir', 'mobil', 'r290'],
    ozet: 'Montaj gerektirmeyen, odadan odaya taşınabilir pratik klima. Kiracılar ve geçici kullanım için.',
    ozellikler: {
      'Soğutma Kapasitesi': '9.000 BTU/h (2,6 kW)',
      'Soğutucu Akışkan': 'R290',
      Ağırlık: '26 kg',
    },
  },

  // ────────────────────────── BİREYSEL / YEDEK PARÇA ─────────────────────────
  {
    slug: 'split-klima-rotary-kompresor',
    ad: 'Split Klima Rotary Kompresör',
    kod: 'YP-KMP-R32',
    segment: 'bireysel',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['kompresor', 'rotary', 'split', 'r32'],
    ozet: '9.000–18.000 BTU split klimalarla uyumlu R32 rotary kompresör. Orijinal kalitesinde.',
    ozellikler: {
      Uyumluluk: '9k–18k BTU split üniteler',
      'Soğutucu Akışkan': 'R32 / R410A',
      Garanti: '12 ay',
    },
  },
  {
    slug: 'split-klima-fan-motoru',
    ad: 'Split Klima İç Ünite Fan Motoru',
    kod: 'YP-FAN-IC',
    segment: 'bireysel',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['fan', 'motor', 'split', 'ic-unite'],
    ozet: 'Split klima iç üniteleri için sessiz çalışan fan motoru. Yaygın modellerle uyumlu.',
    ozellikler: { Gerilim: '220–240 V', Devir: '850–1350 rpm', Garanti: '12 ay' },
  },
  {
    slug: 'split-klima-elektronik-kontrol-karti',
    ad: 'Split Klima Elektronik Kontrol Kartı',
    kod: 'YP-PCB-SPL',
    segment: 'bireysel',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['elektronik-kart', 'pcb', 'anakart', 'split'],
    ozet: 'İnverter ve on/off split klimalar için iç ünite ana kontrol kartı.',
    ozellikler: { Uyumluluk: 'Model bazlı — kod ile sorunuz', Garanti: '6 ay' },
  },
  {
    slug: 'r32-sogutucu-gaz-tupu',
    ad: 'R32 Soğutucu Gaz Tüpü',
    kod: 'YP-GAZ-R32',
    segment: 'bireysel',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['gaz', 'r32', 'sarj', 'f-gaz'],
    ozet: 'Servisler için orijinal R32 soğutucu akışkan tüpü. F-Gaz mevzuatına uygun satış.',
    ozellikler: { Kapasite: '9 kg', Standart: 'F-Gaz belgeli alıcıya satış' },
  },

  // ─────────────────────────── BİREYSEL / AKSESUAR ───────────────────────────
  {
    slug: 'universal-klima-kumandasi',
    ad: 'Üniversal Klima Kumandası',
    kod: 'AK-KMD-UNI',
    segment: 'bireysel',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['kumanda', 'universal'],
    ozet: '1000+ klima modeliyle uyumlu üniversal uzaktan kumanda.',
    ozellikler: { Uyumluluk: 'Tüm yaygın markalar', Pil: '2× AAA' },
  },
  {
    slug: 'klima-montaj-kiti-3m',
    ad: 'Klima Montaj Kiti (3 m)',
    kod: 'AK-MNT-3M',
    segment: 'bireysel',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['montaj', 'bakir-boru', 'kit'],
    ozet: 'Bakır boru, izolasyon, ara kablo ve drenaj hortumu içeren komple montaj seti.',
    ozellikler: { 'Boru Uzunluğu': '3 m (1/4"–3/8")', İçerik: 'Boru + izolasyon + kablo + drenaj' },
  },
  {
    slug: 'dis-unite-montaj-sehpasi',
    ad: 'Dış Ünite Montaj Sehpası',
    kod: 'AK-SHP-DIS',
    segment: 'bireysel',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['sehpa', 'montaj', 'dis-unite'],
    ozet: 'Galvaniz kaplama, titreşim takozlu dış ünite duvar sehpası.',
    ozellikler: { 'Taşıma Kapasitesi': '120 kg', Malzeme: 'Galvaniz çelik' },
  },
  {
    slug: 'klima-toz-filtresi-seti',
    ad: 'Klima Toz Filtresi Seti',
    kod: 'AK-FLT-SET',
    segment: 'bireysel',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['filtre', 'bakim', 'hijyen'],
    ozet: 'Yıkanabilir toz filtresi ve aktif karbon filtre seti — sezonluk bakım için.',
    ozellikler: { İçerik: '2× toz filtresi + 2× karbon filtre' },
  },

  // ─────────────────────────── TİCARİ / ÜRÜNLER ───────────────────────────
  {
    slug: 'vrf-dis-unite-8-hp',
    ad: 'VRF Dış Ünite 8 HP',
    kod: 'KS-VRF-08',
    segment: 'ticari',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['vrf', 'multi', 'inverter', 'r410a'],
    ozet: 'Orta ölçekli ofis ve mağazalar için 8 HP VRF dış ünite. 13 iç üniteye kadar bağlantı.',
    ozellikler: {
      'Soğutma Kapasitesi': '22,4 kW',
      'Maks. İç Ünite': '13',
      'Soğutucu Akışkan': 'R410A',
      Verim: 'ESEER 7,2',
    },
    oneCikan: true,
  },
  {
    slug: 'kaset-tipi-klima-36000-btu',
    ad: 'Kaset Tipi Klima 36.000 BTU',
    kod: 'KS-KST-36',
    segment: 'ticari',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['kaset', '4-yone-uflemeli', 'asma-tavan'],
    ozet: 'Asma tavan uygulamaları için 4 yöne üflemeli kaset klima. Mağaza ve restoranlar için ideal.',
    ozellikler: {
      'Soğutma Kapasitesi': '36.000 BTU/h (10,5 kW)',
      Üfleme: '4 yön',
      Panel: '950×950 mm',
    },
  },
  {
    slug: 'rooftop-paket-klima-25-kw',
    ad: 'Rooftop Paket Klima 25 kW',
    kod: 'KS-RTP-25',
    segment: 'ticari',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['rooftop', 'paket', 'cati-tipi'],
    ozet: 'AVM, market ve spor salonları için çatı tipi paket klima. Isı geri kazanım opsiyonu.',
    ozellikler: {
      'Soğutma Kapasitesi': '25 kW',
      'Hava Debisi': '5.000 m³/h',
      Opsiyon: 'Isı geri kazanımlı egzoz',
    },
  },
  {
    slug: 'hava-perdesi-100-cm',
    ad: 'Hava Perdesi 100 cm',
    kod: 'KS-HPR-100',
    segment: 'ticari',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['hava-perdesi', 'kapi', 'isitmali'],
    ozet: 'Mağaza girişleri için elektrikli ısıtıcılı hava perdesi. Kapı sensörü ile otomatik çalışma.',
    ozellikler: { Genişlik: '100 cm', 'Isıtma Gücü': '6 kW', 'Hava Debisi': '1.500 m³/h' },
  },
  {
    slug: 'fan-coil-unitesi-4-borulu',
    ad: 'Fan Coil Ünitesi (4 Borulu)',
    kod: 'KS-FCU-4B',
    segment: 'ticari',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['fan-coil', 'gizli-tavan', 'sulu-sistem'],
    ozet: 'Otel ve ofis projeleri için gizli tavan tipi 4 borulu fan coil ünitesi.',
    ozellikler: { Kapasite: '4,5 kW soğutma / 6 kW ısıtma', Tip: 'Gizli tavan' },
  },

  // ────────────────────────── TİCARİ / YEDEK PARÇA ─────────────────────────
  {
    slug: 'vrf-inverter-surucu-karti',
    ad: 'VRF İnverter Sürücü Kartı',
    kod: 'YP-PCB-VRF',
    segment: 'ticari',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['elektronik-kart', 'inverter', 'vrf'],
    ozet: 'VRF dış üniteleri için inverter kompresör sürücü kartı.',
    ozellikler: { Uyumluluk: '8–20 HP dış üniteler', Garanti: '6 ay' },
  },
  {
    slug: 'scroll-kompresor-10-hp',
    ad: 'Scroll Kompresör 10 HP',
    kod: 'YP-KMP-SCR',
    segment: 'ticari',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['kompresor', 'scroll', 'rooftop', 'chiller'],
    ozet: 'Rooftop ve küçük chiller uygulamaları için 10 HP scroll kompresör.',
    ozellikler: { Güç: '10 HP', 'Soğutucu Akışkan': 'R410A / R407C', Garanti: '12 ay' },
  },
  {
    slug: 'kaset-tipi-fan-motoru',
    ad: 'Kaset Tipi Klima Fan Motoru',
    kod: 'YP-FAN-KST',
    segment: 'ticari',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['fan', 'motor', 'kaset'],
    ozet: 'Kaset tipi iç üniteler için türbin fan motoru.',
    ozellikler: { Gerilim: '220–240 V', Garanti: '12 ay' },
  },
  {
    slug: 'fan-coil-vana-aktuatoru',
    ad: 'Fan Coil Vana Aktüatörü',
    kod: 'YP-AKT-FCU',
    segment: 'ticari',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['vana', 'aktuator', 'fan-coil'],
    ozet: 'Fan coil üniteleri için 2/3 yollu vana aktüatörü (on/off ve oransal).',
    ozellikler: { Tip: 'On/Off veya 0–10 V oransal', Gerilim: '24/230 V' },
  },

  // ─────────────────────────── TİCARİ / AKSESUAR ───────────────────────────
  {
    slug: 'vrf-merkezi-kumanda-paneli',
    ad: 'VRF Merkezi Kumanda Paneli',
    kod: 'AK-KMD-VRF',
    segment: 'ticari',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['kumanda', 'merkezi-kontrol', 'vrf', 'bms'],
    ozet: '64 iç üniteye kadar merkezi kontrol; dokunmatik ekran, haftalık program, BMS entegrasyonu.',
    ozellikler: { Kapasite: '64 iç ünite', Ekran: '7" dokunmatik', Entegrasyon: 'Modbus/BACnet' },
  },
  {
    slug: 'kaset-dekor-panel-seti',
    ad: 'Kaset Dekor Panel Seti',
    kod: 'AK-PNL-KST',
    segment: 'ticari',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['panel', 'kaset'],
    ozet: 'Kaset tipi üniteler için yedek dekor paneli (950×950).',
    ozellikler: { Ölçü: '950×950 mm', Renk: 'Beyaz' },
  },
  {
    slug: 'hava-perdesi-kapi-sensoru',
    ad: 'Hava Perdesi Kapı Sensörü',
    kod: 'AK-SNS-HPR',
    segment: 'ticari',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['sensor', 'hava-perdesi', 'otomasyon'],
    ozet: 'Kapı açılınca hava perdesini otomatik çalıştıran manyetik sensör kiti.',
    ozellikler: { Tip: 'Manyetik kontak', Kablo: '5 m' },
  },

  // ─────────────────────────── SANAYİ / ÜRÜNLER ───────────────────────────
  {
    slug: 'rittal-blue-e-plus-pano-klimasi-2-kw',
    ad: 'Rittal Blue e+ Pano Kliması 2 kW',
    kod: 'SK 3187.930',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'rittal',
    etiketler: ['pano-klimasi', 'rittal', 'blue-e-plus', 'enerji-verimli', 'heat-pipe'],
    ozet: 'Hibrit heat-pipe teknolojisiyle %75\'e varan enerji tasarrufu sağlayan yeni nesil pano kliması.',
    ozellikler: {
      'Soğutma Kapasitesi': '2 kW',
      Teknoloji: 'Hibrit (heat-pipe + inverter kompresör)',
      Gerilim: '110–240 V / 380–480 V geniş aralık',
      Arayüz: 'IoT interface, NFC, dokunmatik ekran',
      Verimlilik: "%75'e varan enerji tasarrufu",
    },
    oneCikan: true,
  },
  {
    slug: 'rittal-toptherm-pano-klimasi-1500-w',
    ad: 'Rittal TopTherm Blue e Pano Kliması 1.500 W',
    kod: 'SK 3305.500',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'rittal',
    etiketler: ['pano-klimasi', 'rittal', 'blue-e', 'duvar-tipi'],
    ozet: 'Duvara monte TopTherm Blue e pano kliması; nano kaplamalı kondenser ve e-Comfort kontrolör.',
    ozellikler: {
      'Soğutma Kapasitesi': '1.500 W (L35 L35)',
      Montaj: 'Duvar tipi (dış/kısmi gömme)',
      'Koruma Sınıfı': 'IP54 (pano içi devre)',
      Kontrolör: 'e-Comfort controller',
    },
    oneCikan: true,
  },
  {
    slug: 'rittal-toptherm-chiller-11-kw',
    ad: 'Rittal TopTherm Chiller 11 kW',
    kod: 'SK 3320.XXX',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'rittal',
    etiketler: ['chiller', 'rittal', 'proses-sogutma', 'su-sogutma'],
    ozet: 'Makine ve proses soğutması için kompakt su soğutma grubu (chiller). Takım tezgahları için ideal.',
    ozellikler: {
      'Soğutma Kapasitesi': '11 kW',
      'Su Debisi': '25 l/dk',
      'Tank Hacmi': '35 l',
      Uygulama: 'Takım tezgahı, lazer, proses soğutma',
    },
  },
  {
    slug: 'rittal-lcp-rack-sogutma-30-kw',
    ad: 'Rittal LCP Rack Soğutma 30 kW',
    kod: 'DK 3311.XXX',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'rittal',
    etiketler: ['lcp', 'rittal', 'veri-merkezi', 'rack', 'sivi-sogutma'],
    ozet: 'Veri merkezleri için Liquid Cooling Package — rack başına 30 kW\'a kadar hassas soğutma.',
    ozellikler: {
      'Soğutma Kapasitesi': '30 kW',
      Tip: 'LCP Rack / Inline',
      Uygulama: 'Veri merkezi, sunucu odası',
    },
  },
  {
    slug: 'rittal-hava-su-isi-esanjoru-3-kw',
    ad: 'Rittal Hava/Su Isı Eşanjörü 3 kW',
    kod: 'SK 3373.100',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'rittal',
    etiketler: ['isi-esanjoru', 'rittal', 'hava-su', 'pano-sogutma'],
    ozet: 'Kirli ve sıcak ortamlar için hava/su ısı eşanjörü — kompresörsüz, bakım dostu pano soğutma.',
    ozellikler: {
      'Soğutma Kapasitesi': '3 kW',
      'Su Bağlantısı': 'Merkezi soğuk su hattı',
      Avantaj: 'Yağlı/tozlu ortamlarda ideal',
    },
  },
  {
    slug: 'evaporatif-sogutucu-18000-m3',
    ad: 'Evaporatif Soğutucu 18.000 m³/h',
    kod: 'KS-EVP-18K',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['evaporatif', 'fabrika', 'dusuk-enerji'],
    ozet: 'Fabrika ve atölyeler için düşük enerji tüketimli evaporatif soğutma ünitesi.',
    ozellikler: {
      'Hava Debisi': '18.000 m³/h',
      'Güç Tüketimi': '1,1 kW',
      'Soğutma Alanı': '150–200 m²',
    },
  },
  {
    slug: 'endustriyel-hava-kurutucu-500-m3',
    ad: 'Endüstriyel Hava Kurutucu 500 m³/h',
    kod: 'KS-KRT-500',
    segment: 'sanayi',
    tip: 'urun',
    marka: 'klimasun',
    etiketler: ['kurutucu', 'basincli-hava', 'nem-alma'],
    ozet: 'Basınçlı hava hatları için soğutmalı tip hava kurutucu.',
    ozellikler: { Debi: '500 m³/h', 'Çiy Noktası': '+3 °C', Bağlantı: '1"' },
  },

  // ────────────────────────── SANAYİ / YEDEK PARÇA ─────────────────────────
  {
    slug: 'rittal-pano-klimasi-fan-modulu',
    ad: 'Rittal Pano Kliması Fan Modülü',
    kod: 'YP-RTL-FAN',
    segment: 'sanayi',
    tip: 'yedek-parca',
    marka: 'rittal',
    etiketler: ['fan', 'rittal', 'pano-klimasi'],
    ozet: 'TopTherm ve Blue e+ serisi pano klimaları için orijinal iç/dış devre fan modülü.',
    ozellikler: { Uyumluluk: 'TopTherm Blue e / Blue e+', Garanti: '12 ay' },
  },
  {
    slug: 'rittal-pano-klimasi-kompresoru',
    ad: 'Rittal Pano Kliması Kompresörü',
    kod: 'YP-RTL-KMP',
    segment: 'sanayi',
    tip: 'yedek-parca',
    marka: 'rittal',
    etiketler: ['kompresor', 'rittal', 'pano-klimasi'],
    ozet: 'Rittal pano klimaları için orijinal yedek kompresör (model bazlı eşleştirme yapılır).',
    ozellikler: { Uyumluluk: 'SK serisi — kod ile sorunuz', Garanti: '12 ay' },
  },
  {
    slug: 'rittal-e-comfort-kontrol-karti',
    ad: 'Rittal e-Comfort Kontrol Kartı',
    kod: 'YP-RTL-PCB',
    segment: 'sanayi',
    tip: 'yedek-parca',
    marka: 'rittal',
    etiketler: ['elektronik-kart', 'rittal', 'kontrolor'],
    ozet: 'Blue e serisi pano klimaları için e-Comfort kontrolör kartı.',
    ozellikler: { Uyumluluk: 'TopTherm Blue e serisi', Garanti: '6 ay' },
  },
  {
    slug: 'chiller-sirkulasyon-pompasi',
    ad: 'Chiller Sirkülasyon Pompası',
    kod: 'YP-CHL-PMP',
    segment: 'sanayi',
    tip: 'yedek-parca',
    marka: 'klimasun',
    etiketler: ['pompa', 'chiller', 'su-devresi'],
    ozet: 'TopTherm ve muadili chiller üniteleri için sirkülasyon pompası.',
    ozellikler: { Debi: '25–60 l/dk', Basınç: '3 bar', Garanti: '12 ay' },
  },

  // ─────────────────────────── SANAYİ / AKSESUAR ───────────────────────────
  {
    slug: 'rittal-filtre-mat-seti',
    ad: 'Rittal Filtre Mat Seti (5\'li)',
    kod: 'SK 3286.500',
    segment: 'sanayi',
    tip: 'aksesuar',
    marka: 'rittal',
    etiketler: ['filtre', 'rittal', 'bakim'],
    ozet: 'Pano klimaları ve fan-filtre üniteleri için yedek filtre matı — 5\'li ekonomik paket.',
    ozellikler: { İçerik: '5 adet filtre matı', Uyumluluk: 'TopTherm serisi' },
  },
  {
    slug: 'rittal-kondens-tahliye-kiti',
    ad: 'Rittal Kondens Tahliye Kiti',
    kod: 'SK 3301.612',
    segment: 'sanayi',
    tip: 'aksesuar',
    marka: 'rittal',
    etiketler: ['kondens', 'drenaj', 'rittal'],
    ozet: 'Pano klimaları için kondens suyu buharlaştırma / tahliye kiti.',
    ozellikler: { Tip: 'Elektrikli buharlaştırıcı', Gerilim: '230 V' },
  },
  {
    slug: 'pano-ici-dijital-termostat',
    ad: 'Pano İçi Dijital Termostat',
    kod: 'AK-TRM-PNO',
    segment: 'sanayi',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['termostat', 'pano', 'sicaklik-kontrol'],
    ozet: 'Elektrik panoları için ray montajlı dijital termostat — fan ve klima kumandası için.',
    ozellikler: { Montaj: 'DIN ray', Aralık: '-10…+80 °C', Kontak: '1× NO/NC' },
  },
  {
    slug: 'pano-nem-onleyici-isitici-100w',
    ad: 'Pano Nem Önleyici Isıtıcı 100 W',
    kod: 'AK-ISI-100',
    segment: 'sanayi',
    tip: 'aksesuar',
    marka: 'klimasun',
    etiketler: ['isitici', 'nem', 'kondens-onleme', 'pano'],
    ozet: 'Pano içinde yoğuşmayı önleyen PTC ısıtıcı — dış ortam panoları için şart.',
    ozellikler: { Güç: '100 W', Montaj: 'DIN ray', Tip: 'PTC' },
  },
];

// ── Yardımcılar ──────────────────────────────────────────────────────────────

const trLower = (s) => String(s || '').toLocaleLowerCase('tr');

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export function filterProducts({ segment, tip, marka, etiket, q } = {}) {
  let list = PRODUCTS;
  if (segment) list = list.filter((p) => p.segment === segment);
  if (tip) list = list.filter((p) => p.tip === tip);
  if (marka) list = list.filter((p) => p.marka === marka);
  if (etiket) list = list.filter((p) => p.etiketler.includes(etiket));
  if (q && q.trim()) {
    const needle = trLower(q.trim());
    list = list.filter((p) =>
      trLower(`${p.ad} ${p.kod} ${p.ozet} ${p.etiketler.join(' ')}`).includes(needle)
    );
  }
  return list;
}

// Basit anahtar kelime skorlama — AI yönlendirme için yerel yedek (fallback).
export function scoreProducts(query, limit = 5) {
  const tokens = trLower(query)
    .split(/[^a-zçğıöşü0-9+]+/i)
    .filter((t) => t.length >= 2);
  if (!tokens.length) return [];

  const scored = PRODUCTS.map((p) => {
    const hay = trLower(
      `${p.ad} ${p.kod} ${p.ozet} ${p.etiketler.join(' ')} ${SEGMENTS[p.segment].label} ${BRANDS[p.marka].label}`
    );
    let score = 0;
    for (const t of tokens) {
      if (hay.includes(t)) score += t.length >= 4 ? 2 : 1;
    }
    if (p.oneCikan) score += 0.5;
    return { p, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((x) => x.p);
}

// Segment + tip başına ürün sayıları (menü rozetleri için).
export function countBy(segment, tip) {
  return PRODUCTS.filter((p) => p.segment === segment && p.tip === tip).length;
}
