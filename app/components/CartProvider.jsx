'use client';

// Teklif sepeti durumu — localStorage'da kalıcı, tüm sayfalarda erişilebilir.

import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'klimasun-teklif-sepeti';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]); // [{ slug, adet }]
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed.filter((i) => i && i.slug && i.adet > 0));
      }
    } catch {
      // Bozuk veri — sıfırdan başla.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Depolama dolu/kapalı olabilir; sepet yine bellek içinde çalışır.
    }
  }, [items, ready]);

  function add(slug, adet = 1) {
    setItems((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found) {
        return prev.map((i) => (i.slug === slug ? { ...i, adet: i.adet + adet } : i));
      }
      return [...prev, { slug, adet }];
    });
  }

  function setQty(slug, adet) {
    setItems((prev) =>
      adet > 0 ? prev.map((i) => (i.slug === slug ? { ...i, adet } : i)) : prev.filter((i) => i.slug !== slug)
    );
  }

  function remove(slug) {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.adet, 0);

  return (
    <CartContext.Provider value={{ items, count, ready, add, setQty, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart, CartProvider içinde kullanılmalı.');
  return ctx;
}
