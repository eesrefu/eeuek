import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PRODUCTS, SEGMENTS, TYPES, BRANDS, getProduct, filterProducts } from '@/lib/catalog';
import AddToCart from '../../components/AddToCart';
import ProductCard from '../../components/ProductCard';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: p.ad,
    description: p.ozet,
    openGraph: { title: `${p.ad} — KlimaSun`, description: p.ozet },
  };
}

export default async function UrunPage({ params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const seg = SEGMENTS[p.segment];
  const tip = TYPES[p.tip];
  const marka = BRANDS[p.marka];

  // Aynı segment + tipten benzer ürünler.
  const benzer = filterProducts({ segment: p.segment, tip: p.tip })
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.ad,
    sku: p.kod,
    description: p.ozet,
    brand: { '@type': 'Brand', name: marka.label },
    category: `${seg.label} > ${tip.plural}`,
  };

  return (
    <div className="container container-wide urun-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="breadcrumb" aria-label="Konum">
        <Link href="/">Ana Sayfa</Link> <span>›</span>{' '}
        <Link href={`/katalog/${seg.slug}`}>{seg.label}</Link> <span>›</span>{' '}
        <Link href={`/katalog/${seg.slug}?tip=${tip.slug}`}>{tip.plural}</Link> <span>›</span>{' '}
        <strong>{p.ad}</strong>
      </nav>

      <div className="urun-detay">
        <div className="urun-gorsel" aria-hidden="true">
          <span>{tip.icon}</span>
        </div>
        <div className="urun-bilgi">
          <div className="p-badges">
            <span className="badge badge-seg">
              {seg.icon} {seg.label}
            </span>
            <span className="badge badge-tip">{tip.label}</span>
            {p.marka === 'rittal' && (
              <Link href="/marka/rittal" className="badge badge-marka" prefetch={false}>
                Rittal
              </Link>
            )}
          </div>
          <h1 className="page-title">{p.ad}</h1>
          <div className="p-kod">Ürün kodu: {p.kod}</div>
          <p className="urun-ozet">{p.ozet}</p>

          <table className="ozellik-tablo">
            <tbody>
              {Object.entries(p.ozellikler).map(([k, v]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-tags">
            {p.etiketler.map((t) => (
              <Link key={t} href={`/katalog?etiket=${encodeURIComponent(t)}`} className="tag" prefetch={false}>
                #{t}
              </Link>
            ))}
          </div>

          <AddToCart slug={p.slug} />
          <p className="hint" style={{ textAlign: 'left' }}>
            Fiyat için teklif sepetinize ekleyin — ekibimiz aynı gün içinde dönüş yapar.
          </p>
        </div>
      </div>

      {benzer.length > 0 && (
        <section>
          <h2 className="section-title">Benzer Ürünler</h2>
          <div className="p-grid">
            {benzer.map((b) => (
              <ProductCard key={b.slug} product={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
