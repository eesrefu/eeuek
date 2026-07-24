'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ProductGrid from './ProductGrid';
import { useQuote } from './QuoteContext';

const TR = 'tr-TR';

// Ortak katalog tarayıcı: durum + marka filtreleri, arama, sayaç, ürün ızgarası.
// Hem /urunler (tüm katalog) hem /kategori/[slug] (kategori ürünleri) kullanır.
// items satırı: [slug, kod, ad, marka, 2.el(0/1), stok(0/1), küçük görsel]
// Marka sayıları bağlamsaldır: aktif arama + durum seçimine göre yeniden hesaplanır.
export default function CatalogBrowser({ items, loading = false, initialQuery = '', initialBrand = '', categoryLinks = null, searchPlaceholder }) {
  const { openQuote } = useQuote();
  const [q, setQ] = useState(initialQuery);
  const [cond, setCond] = useState('Tümü');
  const [brands, setBrands] = useState(() => (initialBrand ? { [initialBrand]: true } : {}));
  const [filtersOpen, setFiltersOpen] = useState(false);

  const ql = q.trim().toLocaleLowerCase(TR);

  // Arama filtresi (durum ve markadan bağımsız taban küme)
  const searched = useMemo(() => {
    if (!ql) return items;
    return items.filter(([, code, name, brand]) =>
      (name + ' ' + code + ' ' + brand).toLocaleLowerCase(TR).includes(ql),
    );
  }, [items, ql]);

  // Durum sayaçları aramaya göre; marka sayıları arama + duruma göre güncellenir.
  const condCounts = useMemo(() => {
    const c = { 'Tümü': searched.length, 'Sıfır': 0, '2.El': 0 };
    for (const it of searched) c[it[4] ? '2.El' : 'Sıfır']++;
    return c;
  }, [searched]);

  const afterCond = useMemo(
    () => (cond === 'Tümü' ? searched : searched.filter((it) => (cond === '2.El') === Boolean(it[4]))),
    [searched, cond],
  );

  const brandCounts = useMemo(() => {
    const m = new Map();
    for (const it of afterCond) m.set(it[3], (m.get(it[3]) || 0) + 1);
    // Seçili ama artık 0 sonuçlu markalar listede kalsın ki seçim kaldırılabilsin.
    for (const [b, sel] of Object.entries(brands)) if (sel && !m.has(b)) m.set(b, 0);
    return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], TR));
  }, [afterCond, brands]);

  const anyBrand = Object.values(brands).some(Boolean);
  const list = useMemo(
    () => (anyBrand ? afterCond.filter((it) => brands[it[3]]) : afterCond),
    [afterCond, anyBrand, brands],
  );

  const toggleBrand = (label) => setBrands((s) => ({ ...s, [label]: !s[label] }));

  return (
    <div className="ks-list-layout">
      <button
        type="button"
        className="ks-filter-toggle"
        aria-expanded={filtersOpen}
        onClick={() => setFiltersOpen((v) => !v)}
      >
        FİLTRELE {filtersOpen ? '▴' : '▾'}
      </button>
      <aside className={`ks-aside${filtersOpen ? ' is-open' : ''}`}>
        <div>
          <h3 className="ks-filter-h">DURUM</h3>
          <div className="ks-cond-filters">
            {['Tümü', 'Sıfır', '2.El'].map((label) => (
              <button
                type="button"
                key={label}
                className={`ks-cond-filter${label === cond ? ' is-active' : ''}`}
                onClick={() => setCond(label)}
              >
                {label} ({condCounts[label].toLocaleString(TR)})
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="ks-filter-h">MARKA</h3>
          <div className="ks-brand-filters ks-brand-scroll">
            {brandCounts.map(([label, count]) => (
              <label key={label}>
                <input type="checkbox" checked={!!brands[label]} onChange={() => toggleBrand(label)} />
                {label} <span className="cnt">({count.toLocaleString(TR)})</span>
              </label>
            ))}
            {loading && <span className="cnt">Markalar yükleniyor…</span>}
          </div>
        </div>

        {categoryLinks && (
          <div>
            <h3 className="ks-filter-h">KATEGORİLER</h3>
            <div className="ks-cat-links">
              {categoryLinks.map(([label, href, all]) => (
                <Link href={href} key={href + label} className={all ? 'all' : undefined}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="ks-aside-cta">
          <div className="t">ARADIĞINIZI BULAMADINIZ MI?</div>
          <p>Parça kodunu gönderin, Avrupa ağımızdan orijinal tedarik edelim.</p>
          <button type="button" className="ks-btn-amber" onClick={openQuote}>HIZLI TEKLİF →</button>
        </div>
      </aside>

      <main>
        <div className="ks-list-toolbar">
          <div className="ks-search-box">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder || 'Bu listede ara: kod, ürün adı, marka…'}
              aria-label="Ürün ara"
            />
            <span className="ks-search-ico">⌕</span>
          </div>
          <div className="ks-count">
            {loading ? (
              'Katalog yükleniyor…'
            ) : (
              <>
                <b>{list.length.toLocaleString(TR)}</b> ürün gösteriliyor
              </>
            )}
          </div>
        </div>

        <ProductGrid items={list} />
      </main>
    </div>
  );
}
