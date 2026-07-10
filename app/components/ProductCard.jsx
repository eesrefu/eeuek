import Link from 'next/link';
import { SEGMENTS, TYPES, BRANDS } from '@/lib/catalog';
import AddToCart from './AddToCart';

export default function ProductCard({ product }) {
  const seg = SEGMENTS[product.segment];
  const tip = TYPES[product.tip];
  return (
    <div className="p-card">
      <div className="p-card-top">
        <span className="p-icon" aria-hidden="true">
          {tip.icon}
        </span>
        <div className="p-badges">
          <span className="badge badge-seg">
            {seg.icon} {seg.label}
          </span>
          <span className="badge badge-tip">{tip.label}</span>
          {product.marka === 'rittal' && <span className="badge badge-marka">Rittal</span>}
        </div>
      </div>
      <Link href={`/urun/${product.slug}`} className="p-title" prefetch={false}>
        {product.ad}
      </Link>
      <div className="p-kod">Ürün kodu: {product.kod}</div>
      <p className="p-ozet">{product.ozet}</p>
      <div className="p-tags">
        {product.etiketler.slice(0, 4).map((t) => (
          <Link key={t} href={`/katalog?etiket=${encodeURIComponent(t)}`} className="tag" prefetch={false}>
            #{t}
          </Link>
        ))}
      </div>
      <div className="p-actions">
        <Link href={`/urun/${product.slug}`} className="btn btn-ghost btn-sm" prefetch={false}>
          İncele
        </Link>
        <AddToCart slug={product.slug} compact />
      </div>
    </div>
  );
}
