import { slugify } from './slug';

// Ana sayfada gösterilen popüler örnek HVAC/soğutma soruları.
export const POPULAR_QUESTIONS = [
  'F-Gaz yönetmeliği nedir ve kimleri kapsar?',
  'Evaporatif soğutma nasıl çalışır?',
  'Pano kliması seçerken nelere dikkat edilmeli?',
  'Chiller (su soğutma grubu) nasıl seçilir?',
  'R410A ve R32 soğutucu akışkan arasındaki fark nedir?',
  'Endüstriyel soğuk oda kapasitesi nasıl hesaplanır?',
];

export const POPULAR = POPULAR_QUESTIONS.map((q) => ({
  question: q,
  slug: slugify(q),
}));
