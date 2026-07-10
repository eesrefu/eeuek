'use client';

// Katalog gezgini — etiketleme ve filtreleme (kategori, tip, marka, etiket, arama).
// URL query paramlarıyla senkron çalışır; paylaşılabilir filtre linkleri üretir.

import { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SEGMENTS, TYPES, BRANDS, filterProducts } from '@/lib/catalog';
import ProductCard from './ProductCard';

export default function CatalogExplorer({
  initialSegment = '',
  initialTip = '',
  initialMarka = '',
  initialEtiket = '',
  initialQ = '',
  lockSegment = false,
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [segment, setSegment] = useState(initialSegment);
  const [tip, setTip] = useState(initialTip);
  const [marka, setMarka] = useState(initialMarka);
  const [etiket, setEtiket] = useState(initialEtiket);
  const [q, setQ] = useState(initialQ);

  const results = useMemo(
    () => filterProducts({ segment, tip, marka, etiket, q }),
    [segment, tip, marka, etiket, q]
  );

  // Mevcut sonuç kümesindeki etiketleri sıklığa göre çıkar (akıllı etiket bulutu).
  const availableTags = useMemo(() => {
    const freq = new Map();
    for (const p of filterProducts({ segment, tip, marka })) {
      for (const t of p.etiketler) freq.set(t, (freq.get(t) || 0) + 1);
    }
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([t]) => t);
  }, [segment, tip, marka]);

  function syncUrl(next) {
    const params = new URLSearchParams();
    const merged = { segment, tip, marka, etiket, q, ...next };
    if (!lockSegment && merged.segment) params.set('segment', merged.segment);
    if (merged.tip) params.set('tip', merged.tip);
    if (merged.marka) params.set('marka', merged.marka);
    if (merged.etiket) params.set('etiket', merged.etiket);
    if (merged.q) params.set('q', merged.q);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  function update(setter, key, value) {
    setter(value);
    syncUrl({ [key]: value });
  }

  const hasFilter = Boolean((!lockSegment && segment) || tip || marka || etiket || q);

  return (
    <div className="catalog">
      <div className="filters">
        <div className="filter-row">
          <input
            type="search"
            className="filter-search"
            placeholder="Katalogda ara: ürün adı, kod, etiket…"
            value={q}
            onChange={(e) => update(setQ, 'q', e.target.value)}
            aria-label="Katalogda ara"
          />
        </div>

        {!lockSegment && (
          <div className="filter-row" role="group" aria-label="Kategori">
            <span className="filter-label">Kategori</span>
            <button
              type="button"
              className={`chip ${segment === '' ? 'chip-on' : ''}`}
              onClick={() => update(setSegment, 'segment', '')}
            >
              Tümü
            </button>
            {Object.values(SEGMENTS).map((s) => (
              <button
                key={s.slug}
                type="button"
                className={`chip ${segment === s.slug ? 'chip-on' : ''}`}
                onClick={() => update(setSegment, 'segment', segment === s.slug ? '' : s.slug)}
              >
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="filter-row" role="group" aria-label="Ürün tipi">
          <span className="filter-label">Tip</span>
          <button
            type="button"
            className={`chip ${tip === '' ? 'chip-on' : ''}`}
            onClick={() => update(setTip, 'tip', '')}
          >
            Tümü
          </button>
          {Object.values(TYPES).map((t) => (
            <button
              key={t.slug}
              type="button"
              className={`chip ${tip === t.slug ? 'chip-on' : ''}`}
              onClick={() => update(setTip, 'tip', tip === t.slug ? '' : t.slug)}
            >
              {t.icon} {t.plural}
            </button>
          ))}
        </div>

        <div className="filter-row" role="group" aria-label="Marka">
          <span className="filter-label">Marka</span>
          <button
            type="button"
            className={`chip ${marka === '' ? 'chip-on' : ''}`}
            onClick={() => update(setMarka, 'marka', '')}
          >
            Tümü
          </button>
          {Object.values(BRANDS).map((b) => (
            <button
              key={b.slug}
              type="button"
              className={`chip ${marka === b.slug ? 'chip-on' : ''}`}
              onClick={() => update(setMarka, 'marka', marka === b.slug ? '' : b.slug)}
            >
              {b.label}
            </button>
          ))}
        </div>

        {availableTags.length > 0 && (
          <div className="filter-row" role="group" aria-label="Etiketler">
            <span className="filter-label">Etiket</span>
            {availableTags.map((t) => (
              <button
                key={t}
                type="button"
                className={`chip chip-tag ${etiket === t ? 'chip-on' : ''}`}
                onClick={() => update(setEtiket, 'etiket', etiket === t ? '' : t)}
              >
                #{t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="catalog-meta">
        <span>
          <strong>{results.length}</strong> sonuç
        </span>
        {hasFilter && (
          <button
            type="button"
            className="clear-filters"
            onClick={() => {
              if (!lockSegment) setSegment('');
              setTip('');
              setMarka('');
              setEtiket('');
              setQ('');
              router.replace(pathname, { scroll: false });
            }}
          >
            ✕ Filtreleri temizle
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="empty-state">
          <p>Bu filtrelerle eşleşen ürün bulunamadı.</p>
          <p className="hint">
            Filtreleri temizleyip tekrar deneyin veya ana sayfadaki yapay zekâ asistanına ihtiyacınızı yazın —
            sizi doğru ürüne yönlendirsin.
          </p>
        </div>
      ) : (
        <div className="p-grid">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
