import { slugify } from './slug';

// Ana sayfada gösterilen popüler örnek sorular.
// ÖNEMLİ: Bu sorular, indekslenen ürün/teknik kataloglardan (dokumanlar/ +
// klimasun-2026/assets/docs/) GERÇEKTEN cevaplanabilenlerden seçilmiştir;
// asistan yalnızca yüklü dokümanlara dayandığı için katalog dışı sorular
// (ör. soğuk oda kapasite hesabı, F-Gaz mevzuatı) yanıtsız kalır.
// Yeni doküman eklendikçe buraya yeni sorular eklenebilir.
export const POPULAR_QUESTIONS = [
  'Pano kliması seçerken nelere dikkat edilmeli?',
  'Rittal TopTherm chiller nedir?',
  'Evaporatif soğutma nasıl çalışır?',
  'Fan coil termostatı ne işe yarar?',
  'Sakura kaset tipi klima özellikleri nelerdir?',
  'Havuz nem alma cihazı nasıl çalışır?',
];

export const POPULAR = POPULAR_QUESTIONS.map((q) => ({
  question: q,
  slug: slugify(q),
}));
