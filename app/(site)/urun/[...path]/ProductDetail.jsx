'use client';

import { useState } from 'react';
import Link from 'next/link';
import Placeholder from '@/app/components/site/Placeholder';
import { CONDITIONS, useQuote } from '@/app/components/site/QuoteContext';
import { purl } from '@/lib/purl';

export default function ProductDetail({ product }) {
  const p = product;
  const { addItem } = useQuote();
  const [qty, setQty] = useState(1);
  const [cond, setCond] = useState(p.cond || 'Sıfır');

  function addToQuote() {
    for (let i = 0; i < qty; i++) addItem(p.code, cond);
  }

  return (
    <>
      <div className="ks-crumb-bar">
        <div className="ks-wrap">
          <Link href="/">Ana Sayfa</Link> /{' '}
          {p.parentCategory && (
            <>
              <Link href={p.parentCategory.href}>{p.parentCategory.name}</Link> /{' '}
            </>
          )}
          <Link href={p.categoryHref}>{p.category}</Link> /{' '}
          <span className="ks-crumb-cur">{p.code}</span>
        </div>
      </div>

      <div className="ks-detail-top">
        <div className="ks-gallery">
          {p.img ? (
            <img src={p.img} alt={p.name} className="ks-gallery-main ks-gallery-img" loading="eager" />
          ) : (
            <Placeholder w={600} h={460} label={`${p.code} — görsel hazırlanıyor`} className="ks-gallery-main" />
          )}
        </div>

        <div className="ks-buy">
          <div className="ks-buy-tags">
            <span className="ks-buy-code">{p.code}</span>
            <span className={`ks-badge ${p.stok ? 'stok' : 'temin'}`}>{p.badge}</span>
          </div>
          <h1>{p.name}</h1>
          <div className="ks-buy-facts">
            <div>Marka: <b>{p.brand}</b></div>
            <div>Kategori: <Link href={p.categoryHref} style={{ fontWeight: 600 }}>{p.category}</Link></div>
            <div>Durum: <b>{p.cond}</b></div>
          </div>
          {p.description ? <p className="ks-buy-desc">{p.description}</p> : null}

          <div className="ks-buy-box">
            <div className="ks-buy-condrow">
              <span className="ks-cond-lbl">TERCİH EDİLEN DURUM:</span>
              {CONDITIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`ks-cond-btn${c === cond ? ' is-active' : ''}`}
                  onClick={() => setCond(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="ks-qty">
              <div className="ks-qty-stepper">
                <button type="button" onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Azalt">
                  −
                </button>
                <div className="ks-qty-val">{qty}</div>
                <button type="button" onClick={() => setQty((n) => n + 1)} aria-label="Artır">
                  +
                </button>
              </div>
              <button type="button" className="ks-buy-add" onClick={addToQuote}>
                TEKLİF AL
              </button>
            </div>
            <a
              href="https://wa.me/905324246219"
              className="ks-buy-wa"
              target="_blank"
              rel="noreferrer"
            >
              ✆ WhatsApp&apos;tan Sor — 0532 424 6219
            </a>
            <div className="ks-buy-note">
              Satışlarımız kurumsaldır; fiyat teklifle iletilir. Stoktan teslim — aynı iş günü kargoya
              hazır (kargo hariç). F-Gaz sertifikalı servis.
            </div>
          </div>
        </div>
      </div>

      {p.specs.length > 0 && (
        <div className="ks-specs-wrap">
          <h2 className="ks-specs-h">TEKNİK ÖZELLİKLER</h2>
          <div className="ks-specs">
            {p.specs.map(([k, v]) => (
              <div className="ks-spec" key={k}>
                <span>{k}</span>
                <b>{String(v)}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {p.related.length > 0 && (
        <div className="ks-related-wrap">
          <div className="ks-related-head">
            <h2>BENZER ÜRÜNLER</h2>
            <Link href="/urunler">TÜMÜNÜ GÖR →</Link>
          </div>
          <div className="ks-grid-4">
            {p.related.map((r) => (
              <div className="ks-prod-card" key={r.s}>
                <Link href={purl(r.p, r.s)} style={{ display: 'block' }}>
                  {r.th ? (
                    <img src={r.th} alt={r.n} className="ks-prod-img" loading="lazy" />
                  ) : (
                    <Placeholder w={300} h={170} label={r.c} />
                  )}
                </Link>
                <div className="ks-related-body">
                  <div className="ks-prod-code">{r.c}</div>
                  <Link href={purl(r.p, r.s)} className="ks-related-name">{r.n}</Link>
                  <button type="button" className="ks-related-add" onClick={() => addItem(r.c, 'Sıfır')}>
                    + TEKLİFE EKLE
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
