'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';

export default function AddToCart({ slug, compact = false }) {
  const { add } = useCart();
  const [adet, setAdet] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(slug, adet);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  }

  if (compact) {
    return (
      <button type="button" className="btn btn-primary btn-sm" onClick={handleAdd}>
        {added ? '✓ Eklendi' : '+ Teklif Sepetine Ekle'}
      </button>
    );
  }

  return (
    <div className="add-to-cart">
      <div className="qty">
        <button type="button" onClick={() => setAdet((a) => Math.max(1, a - 1))} aria-label="Azalt">
          −
        </button>
        <input
          type="number"
          min={1}
          max={999}
          value={adet}
          onChange={(e) => setAdet(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
          aria-label="Adet"
        />
        <button type="button" onClick={() => setAdet((a) => Math.min(999, a + 1))} aria-label="Artır">
          +
        </button>
      </div>
      <button type="button" className="btn btn-primary" onClick={handleAdd}>
        {added ? '✓ Sepete Eklendi' : 'Teklif Sepetine Ekle'}
      </button>
    </div>
  );
}
