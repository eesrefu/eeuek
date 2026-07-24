'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuote } from './QuoteContext';

export default function HeroSearch() {
  const { openQuote } = useQuote();
  const router = useRouter();
  const [text, setText] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    const q = text.trim();
    router.push(q ? `/urunler?q=${encodeURIComponent(q)}` : '/urunler');
  }

  return (
    <>
      <form className="ks-hero-search" onSubmit={onSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ürün adı, kod veya marka ara… (ör. SK 3305, evaporatif, Cosmotec)"
          aria-label="Ürün ara"
        />
        <button type="submit">ARA</button>
      </form>
      <div className="ks-hero-ctas">
        <a href="/urunler" className="ks-cta-solid">▦ ÜRÜNLERİ KEŞFET</a>
        <button type="button" className="ks-cta-outline" onClick={openQuote}>
          ✎ HIZLI TEKLİF
        </button>
      </div>
    </>
  );
}
