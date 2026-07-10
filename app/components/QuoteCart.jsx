'use client';

// Teklif sepeti sayfası içeriği — kalem listesi + müşteri formu + gönderim.

import Link from 'next/link';
import { useState } from 'react';
import { getProduct, SEGMENTS, TYPES } from '@/lib/catalog';
import { useCart } from './CartProvider';

export default function QuoteCart() {
  const { items, setQty, remove, clear, ready } = useCart();
  const [form, setForm] = useState({ ad: '', firma: '', eposta: '', telefon: '', not: '' });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [sonuc, setSonuc] = useState(null); // { ref }

  const kalemler = items
    .map((i) => ({ ...i, urun: getProduct(i.slug) }))
    .filter((i) => i.urun);

  function set(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/teklif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          musteri: form,
          kalemler: kalemler.map((k) => ({ slug: k.slug, adet: k.adet })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Gönderilemedi. Lütfen tekrar deneyin.');
      setSonuc({ ref: data.ref });
      clear();
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (sonuc) {
    return (
      <div className="teklif-basari">
        <div className="teklif-basari-icon" aria-hidden="true">
          ✅
        </div>
        <h2>Teklif talebiniz alındı!</h2>
        <p>
          Referans numaranız: <strong className="accent">{sonuc.ref}</strong>
        </p>
        <p className="hint">
          Ekibimiz en kısa sürede belirttiğiniz e-posta / telefon üzerinden size fiyat teklifiyle
          dönüş yapacak.
        </p>
        <Link href="/katalog" className="btn btn-primary" prefetch={false}>
          Kataloğa Dön
        </Link>
      </div>
    );
  }

  if (!ready) {
    return <div className="loading-block">Sepet yükleniyor…</div>;
  }

  if (!kalemler.length) {
    return (
      <div className="empty-state">
        <p>Teklif sepetiniz şu an boş.</p>
        <p className="hint">
          Katalogdan ürünleri "Teklif Sepetine Ekle" ile ekleyin; ardından tek formla fiyat teklifi
          isteyin. Üyelik gerekmez.
        </p>
        <Link href="/katalog" className="btn btn-primary" prefetch={false}>
          Kataloğa Git
        </Link>
      </div>
    );
  }

  return (
    <div className="teklif-grid">
      <section aria-label="Sepetteki ürünler">
        <ul className="sepet-liste">
          {kalemler.map(({ slug, adet, urun }) => (
            <li key={slug} className="sepet-kalem">
              <div className="sepet-kalem-bilgi">
                <Link href={`/urun/${slug}`} className="sepet-kalem-ad" prefetch={false}>
                  {urun.ad}
                </Link>
                <span className="sepet-kalem-meta">
                  {urun.kod} · {SEGMENTS[urun.segment].label} · {TYPES[urun.tip].label}
                </span>
              </div>
              <div className="sepet-kalem-islem">
                <div className="qty">
                  <button type="button" onClick={() => setQty(slug, adet - 1)} aria-label="Azalt">
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={adet}
                    onChange={(e) => setQty(slug, Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
                    aria-label={`${urun.ad} adet`}
                  />
                  <button type="button" onClick={() => setQty(slug, adet + 1)} aria-label="Artır">
                    +
                  </button>
                </div>
                <button type="button" className="sepet-sil" onClick={() => remove(slug)} aria-label="Kaldır">
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button type="button" className="clear-filters" onClick={clear}>
          ✕ Sepeti boşalt
        </button>
      </section>

      <section aria-label="İletişim bilgileri">
        <form className="teklif-form" onSubmit={submit}>
          <h2>İletişim Bilgileriniz</h2>
          <label>
            Ad Soyad *
            <input type="text" required maxLength={120} value={form.ad} onChange={set('ad')} />
          </label>
          <label>
            Firma
            <input type="text" maxLength={160} value={form.firma} onChange={set('firma')} />
          </label>
          <label>
            E-posta *
            <input type="email" required maxLength={160} value={form.eposta} onChange={set('eposta')} />
          </label>
          <label>
            Telefon
            <input type="tel" maxLength={40} value={form.telefon} onChange={set('telefon')} />
          </label>
          <label>
            Notunuz
            <textarea
              rows={3}
              maxLength={1000}
              value={form.not}
              onChange={set('not')}
              placeholder="Adet, teslimat, montaj vb. özel talepleriniz…"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={sending}>
            {sending ? <span className="spinner" aria-hidden="true" /> : 'Teklif İste'}
          </button>
          <div className="error" role="alert">
            {error}
          </div>
          <p className="hint" style={{ textAlign: 'left' }}>
            Bilgileriniz yalnızca teklif dönüşü için kullanılır; üyelik oluşturulmaz.
          </p>
        </form>
      </section>
    </div>
  );
}
