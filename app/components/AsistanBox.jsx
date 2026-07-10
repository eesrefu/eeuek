'use client';

// Yapay zekâ ürün yönlendirme asistanı — müşteri ihtiyacını yazar,
// asistan katalogdan doğru kategori ve ürünleri önerir.

import Link from 'next/link';
import { useState } from 'react';
import { SEGMENTS, TYPES } from '@/lib/catalog';

const ORNEKLER = [
  'Elektrik panom aşırı ısınıyor, ne önerirsiniz?',
  'Evime 20 m² oda için klima arıyorum',
  'Restoranımın girişine hava perdesi lazım',
  'CNC tezgahım için su soğutma grubu gerekiyor',
];

export default function AsistanBox() {
  const [ihtiyac, setIhtiyac] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sonuc, setSonuc] = useState(null); // { mesaj, urunler, kategoriler }

  async function submit(e) {
    e?.preventDefault();
    const q = ihtiyac.trim();
    if (!q || loading) return;
    setLoading(true);
    setError('');
    setSonuc(null);
    try {
      const res = await fetch('/api/yonlendir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ihtiyac: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      setSonuc(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function ornek(text) {
    setIhtiyac(text);
    setSonuc(null);
    setError('');
  }

  return (
    <div className="asistan">
      <form className="search" onSubmit={submit}>
        <textarea
          rows={1}
          value={ihtiyac}
          onChange={(e) => setIhtiyac(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit(e);
            }
          }}
          placeholder="İhtiyacınızı yazın — sizi katalogda doğru ürüne yönlendirelim…"
          aria-label="İhtiyacınız"
          maxLength={400}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !ihtiyac.trim()}>
          {loading ? <span className="spinner" aria-hidden="true" /> : 'Ürün Bul'}
        </button>
      </form>

      {!sonuc && !loading && (
        <div className="asistan-ornekler">
          {ORNEKLER.map((o) => (
            <button key={o} type="button" className="chip" onClick={() => ornek(o)}>
              {o}
            </button>
          ))}
        </div>
      )}

      <div className="error" role="alert">
        {error}
      </div>

      {sonuc && (
        <div className="asistan-sonuc" aria-live="polite">
          <p className="asistan-mesaj">
            <span className="badge">🤖 KlimaSun Asistan</span> {sonuc.mesaj}
          </p>

          {sonuc.urunler?.length > 0 && (
            <ul className="asistan-urunler">
              {sonuc.urunler.map((u) => (
                <li key={u.slug}>
                  <Link href={`/urun/${u.slug}`} prefetch={false}>
                    <strong>{u.ad}</strong>
                  </Link>
                  <span className="asistan-urun-meta">
                    {SEGMENTS[u.segment]?.icon} {SEGMENTS[u.segment]?.label} · {TYPES[u.tip]?.label}
                  </span>
                  <span className="asistan-urun-ozet">{u.ozet}</span>
                </li>
              ))}
            </ul>
          )}

          {sonuc.kategoriler?.length > 0 && (
            <div className="asistan-kategoriler">
              {sonuc.kategoriler.map((k) => (
                <Link key={k.href} href={k.href} className="chip chip-on" prefetch={false}>
                  {k.label} →
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
