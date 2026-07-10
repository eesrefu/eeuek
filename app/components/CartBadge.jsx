'use client';

import Link from 'next/link';
import { useCart } from './CartProvider';

export default function CartBadge() {
  const { count } = useCart();
  return (
    <Link href="/teklif-sepeti" className="cart-link" aria-label="Teklif sepeti">
      <span aria-hidden="true">🧾</span>
      <span className="cart-label">Teklif Sepeti</span>
      {count > 0 && <span className="cart-count">{count}</span>}
    </Link>
  );
}
