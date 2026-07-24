'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Placeholder from './Placeholder';
import { useQuote } from './QuoteContext';
import { purl } from '@/lib/purl';

const PAGE_SIZE = 24;
const TR = 'tr-TR';

// items satırı: [slug, kod, ad, marka, 2.el(0/1), stok(0/1), küçük görsel, kategoriYolu]
export default function ProductGrid({ items }) {
  const { addItem } = useQuote();
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const goPage = (n) => {
    setPage(n);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
  };

  const pageNums = useMemo(() => {
    const nums = new Set([1, pageCount, safePage - 1, safePage, safePage + 1]);
    return [...nums].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  }, [safePage, pageCount]);

  return (
    <>
      <div className="ks-prod-grid">
        {visible.map(([slug, code, name, brand, , stok, th, path]) => (
          <div className="ks-prod-card" key={slug}>
            <Link href={purl(path, slug)} style={{ display: 'block' }}>
              {th ? (
                <img src={th} alt={name} className="ks-prod-img" loading="lazy" />
              ) : (
                <Placeholder w={300} h={190} label={`${code} — görsel hazırlanıyor`} />
              )}
            </Link>
            <div className="ks-prod-body">
              <div className="ks-prod-code">{code}</div>
              <Link href={purl(path, slug)} className="ks-prod-name">
                {name}
              </Link>
              <div className="ks-prod-meta">
                <span className="ks-prod-brand">{brand}</span>
                <span className={`ks-badge ${stok ? 'stok' : 'temin'}`}>
                  {stok ? 'Stoktan Teslim' : 'Temin Edilebilir'}
                </span>
              </div>
              <div className="ks-prod-actions">
                <button type="button" className="ks-prod-add" onClick={() => addItem(code, 'Sıfır')}>
                  + TEKLİFE EKLE
                </button>
                <Link href={purl(path, slug)} className="ks-prod-view">
                  İNCELE
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="ks-empty">
          <div className="t">SONUÇ BULUNAMADI</div>
          Aramanızı değiştirin veya parça kodunu hızlı teklif formuyla gönderin — tedariği biz
          üstlenelim.
        </div>
      )}

      {pageCount > 1 && (
        <div className="ks-pager">
          {safePage > 1 && (
            <button type="button" className="next" onClick={() => goPage(safePage - 1)}>
              ← Önceki
            </button>
          )}
          {pageNums.map((n, i) => (
            <span key={n} style={{ display: 'contents' }}>
              {i > 0 && pageNums[i - 1] !== n - 1 && <span className="dots">…</span>}
              {n === safePage ? (
                <span className="cur">{n.toLocaleString(TR)}</span>
              ) : (
                <button type="button" onClick={() => goPage(n)}>
                  {n.toLocaleString(TR)}
                </button>
              )}
            </span>
          ))}
          {safePage < pageCount && (
            <button type="button" className="next" onClick={() => goPage(safePage + 1)}>
              Sonraki →
            </button>
          )}
        </div>
      )}
    </>
  );
}
