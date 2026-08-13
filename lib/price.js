// Fiyat biçimlendirme yardımcıları.
// Yalnızca Zoho liste fiyatından türetilen satış/liste fiyatı gösterilir; başka
// hiçbir maliyet/geçmiş bilgisi buraya girmez.

const NF = new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const SYMBOL = { EUR: '€', USD: '$', TRY: 'TL' };

// Sayıyı para birimiyle biçimler: 871,25 €
export function money(n, cur = 'EUR') {
  if (n == null || Number.isNaN(Number(n))) return '';
  return `${NF.format(Number(n))} ${SYMBOL[cur] || cur}`;
}

// İndirim yüzdesi (liste -> satış). Örn 138,89 -> 125 => 10.
export function discountPct(list, sale) {
  if (!list || !sale || list <= sale) return 0;
  return Math.round((1 - sale / list) * 100);
}
