'use client';

import { useState } from 'react';
import Link from 'next/link';
import Placeholder from '@/app/components/site/Placeholder';
import { CONDITIONS, useQuote } from '@/app/components/site/QuoteContext';
import { purl } from '@/lib/purl';
import { money, discountPct } from '@/lib/price';

export default function ProductDetail({ product }) {
  const p = product;
  const r = p.rich || null;
  const { addItem, openQuote } = useQuote();
  const [qty, setQty] = useState(1);
  const [cond, setCond] = useState(p.cond || 'Sıfır');
  const [openFaq, setOpenFaq] = useState(0);
  const gallery = p.gallery?.length ? p.gallery : p.img ? [{ img: p.img, th: p.img }] : [];
  const [activeImg, setActiveImg] = useState(0);
  const mainImg = gallery[activeImg]?.img || p.img;

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
          {mainImg ? (
            <img src={mainImg} alt={p.name} className="ks-gallery-main ks-gallery-img" loading="eager" />
          ) : (
            <Placeholder w={600} h={460} label={`${p.code} — görsel hazırlanıyor`} className="ks-gallery-main" />
          )}
          {gallery.length > 1 ? (
            <div className="ks-gallery-thumbs">
              {gallery.map((g, i) => (
                <button
                  type="button"
                  key={g.img}
                  className={`ks-gallery-thumb${i === activeImg ? ' is-active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`Görsel ${i + 1}`}
                >
                  <img src={g.th || g.img} alt={`${p.name} — görsel ${i + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="ks-buy">
          <div className="ks-buy-tags">
            <span className="ks-buy-code">{p.code}</span>
            <span className={`ks-badge ${p.stok ? 'stok' : 'temin'}`}>{p.badge}</span>
            {p.stok && p.stockQty ? (
              <span className="ks-stock-qty">{p.stockQty} adet stokta</span>
            ) : null}
          </div>
          <h1>{p.name}</h1>
          {r?.badges?.length ? (
            <div className="ks-hero-badges">
              {r.badges.map((b) => (
                <span className="ks-hero-badge" key={b}>{b}</span>
              ))}
            </div>
          ) : null}
          <div className="ks-buy-facts">
            <div>Marka: <b>{p.brand}</b></div>
            <div>Kategori: <Link href={p.categoryHref} style={{ fontWeight: 600 }}>{p.category}</Link></div>
            <div>Durum: <b>{p.cond}</b></div>
          </div>
          {p.description ? <p className="ks-buy-desc">{p.description}</p> : null}

          {p.price ? (
            <div className="ks-buy-price">
              {(() => {
                const off = discountPct(p.price.list, p.price.sale);
                return (
                  <>
                    <div className="ks-buy-price-row">
                      {p.price.list && off ? (
                        <span className="ks-price-old">{money(p.price.list, p.price.cur)}</span>
                      ) : null}
                      <span className="ks-buy-price-new">{money(p.price.sale, p.price.cur)}</span>
                      {p.price.kdv ? <span className="ks-price-kdv">+ KDV</span> : null}
                      {off ? <span className="ks-price-off">%{off} indirim</span> : null}
                    </div>
                    {off ? (
                      <div className="ks-buy-price-note">
                        Stoktan teslim — indirimli fiyat. KDV hariçtir; teklifle onaylanır.
                      </div>
                    ) : null}
                    {p.price.bulk ? (
                      <div className="ks-bulk">
                        <div className="ks-bulk-head">
                          📞 Adetli alımlarda iskonto için arayın —{' '}
                          <a href={`tel:${p.price.bulk.phone.replace(/\s/g, '')}`}>{p.price.bulk.phone}</a>
                        </div>
                        <div className="ks-bulk-tiers">
                          {p.price.bulk.tiers.map((t) => (
                            <span className="ks-bulk-tier" key={t[0]}>
                              <b>{t[1]}</b> {t[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </>
                );
              })()}
            </div>
          ) : null}

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
              href="https://wa.me/905059598770"
              className="ks-buy-wa"
              target="_blank"
              rel="noreferrer"
            >
              ✆ WhatsApp&apos;tan Sor — 0505 959 87 70
            </a>
            {r?.datasheet ? (
              <a href={r.datasheet} className="ks-buy-datasheet" target="_blank" rel="noreferrer">
                ▦ Teknik Veri Sayfası
              </a>
            ) : null}
            <div className="ks-buy-note">
              Satışlarımız kurumsaldır; fiyat teklifle iletilir. Stoktan teslim — aynı iş günü kargoya
              hazır (kargo hariç). F-Gaz sertifikalı servis.
            </div>
          </div>
        </div>
      </div>

      {r?.warn ? (
        <div className="ks-rich-wrap">
          <div className="ks-warn" role="alert">
            <span className="ks-warn-ico" aria-hidden="true">⚠️</span>
            <span>{r.warn}</span>
          </div>
        </div>
      ) : null}

      {r?.features?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">NEDEN BU ÜRÜN?</h2>
          <ul className="ks-ticklist">
            {r.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {r?.highlights?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">NEDEN BU CİHAZ?</h2>
          <div className="ks-highlights">
            {r.highlights.map((h) => (
              <div className="ks-highlight" key={h.title}>
                <div className="ks-highlight-ico" aria-hidden="true">{h.icon}</div>
                <div>
                  <b>{h.title}</b>
                  <p>{h.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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

      {r?.schema ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">MONTAJ ŞEMASI</h2>
          <img src={r.schema} alt={`${p.name} montaj şeması`} className="ks-schema-img" loading="lazy" />
        </div>
      ) : null}

      {r?.related?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">İLGİLİ ÜRÜNLER</h2>
          <ul className="ks-linklist">
            {r.related.map((rel) => (
              <li key={rel.href}>
                <Link href={rel.href}>{rel.label} →</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {r?.crosssell ? (
        <div className="ks-rich-wrap">
          <div className="ks-crosssell">
            <span className="ks-crosssell-ico" aria-hidden="true">💡</span>
            <span>{r.crosssell}</span>
          </div>
        </div>
      ) : null}

      {r?.docs?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">BELGELER</h2>
          <div className="ks-docs">
            {r.docs.map((doc) => (
              <a key={doc.href} href={doc.href} className="ks-doc" target="_blank" rel="noreferrer">
                <span className="ks-doc-ico" aria-hidden="true">📄</span>
                <span>{doc.label}</span>
                <span className="ks-doc-dl">PDF ↓</span>
              </a>
            ))}
          </div>
          {r.note ? <p className="ks-doc-note">{r.note}</p> : null}
        </div>
      ) : r?.note ? (
        <div className="ks-rich-wrap">
          <p className="ks-doc-note">{r.note}</p>
        </div>
      ) : null}

      {r?.system?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">SİSTEM KURGUSU — NE ALMAM GEREKİYOR?</h2>
          <p className="ks-rich-lead">
            Tek bir dedektör bir sistem değildir. Tipik bir makine dairesi kurulumu şu
            bileşenlerden oluşur:
          </p>
          <ol className="ks-syslist">
            {r.system.map((s) => (
              <li key={s.name}>
                <b>{s.name}</b> — {s.note}
              </li>
            ))}
          </ol>
          <p className="ks-rich-note">
            Kaç dedektör gerekir? Hacim, ekipman sayısı ve ölü bölgelere göre değişir. Hızlı teklif
            formuna makine dairesi ölçüsü ve chiller/kompresör sayısını yazın — yerleşim önerisiyle
            birlikte dönüş yapalım.
          </p>
        </div>
      ) : null}

      {r?.install?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">NEREYE MONTE EDİLİR?</h2>
          <ul className="ks-ticklist">
            {r.install.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {r?.apps?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">UYGULAMA ALANLARI</h2>
          <div className="ks-chips">
            {r.apps.map((a) => (
              <span className="ks-chip" key={a}>{a}</span>
            ))}
          </div>
        </div>
      ) : null}

      {r?.faq?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">SIKÇA SORULAN SORULAR</h2>
          <div className="ks-faq">
            {r.faq.map((f, i) => (
              <div className={`ks-faq-item${openFaq === i ? ' is-open' : ''}`} key={f.q}>
                <button type="button" className="ks-faq-q" onClick={() => setOpenFaq(openFaq === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="ks-faq-caret" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i ? <div className="ks-faq-a">{f.a}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {r?.links?.length ? (
        <div className="ks-rich-wrap">
          <h2 className="ks-specs-h">DEVAMINI OKUYUN</h2>
          <ul className="ks-linklist">
            {r.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {r?.cta ? (
        <div className="ks-rich-cta">
          <div className="t">{r.cta.title}</div>
          <p>{r.cta.text}</p>
          <button type="button" className="ks-btn-amber" onClick={openQuote}>
            ✎ HIZLI TEKLİF GÖNDER
          </button>
          <div className="ks-rich-cta-side">
            ☎ 0505 959 87 70 · WhatsApp 0505 959 87 70 · info@klimasun.com.tr
          </div>
        </div>
      ) : null}

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
