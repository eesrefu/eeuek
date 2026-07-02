const TR_MAP = {
  ç: 'c', Ç: 'c',
  ğ: 'g', Ğ: 'g',
  ı: 'i', İ: 'i',
  ö: 'o', Ö: 'o',
  ş: 's', Ş: 's',
  ü: 'u', Ü: 'u',
};

/**
 * Bir soruyu URL-dostu, indekslenebilir bir slug'a çevirir.
 * Türkçe karakterler ASCII karşılıklarına katlanır.
 */
export function slugify(text) {
  return String(text || '')
    .trim()
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (c) => TR_MAP[c] || c)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

/**
 * Slug'dan okunabilir bir soru metni geri üretir. Kalıcı depo (KV) yoksa,
 * /soru/[slug] sayfası cevabı bu metinden yeniden üretebilir.
 */
export function deslugify(slug) {
  const s = String(slug || '').replace(/-/g, ' ').trim();
  if (!s) return '';
  const q = s.charAt(0).toLocaleUpperCase('tr') + s.slice(1);
  return /[?.!]$/.test(q) ? q : q + '?';
}
