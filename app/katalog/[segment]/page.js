import { notFound } from 'next/navigation';
import Link from 'next/link';
import CatalogExplorer from '../../components/CatalogExplorer';
import { SEGMENTS, TYPES, BRANDS, countBy } from '@/lib/catalog';

export function generateStaticParams() {
  return Object.keys(SEGMENTS).map((segment) => ({ segment }));
}

export async function generateMetadata({ params }) {
  const { segment } = await params;
  const seg = SEGMENTS[segment];
  if (!seg) return {};
  return {
    title: seg.title,
    description: seg.desc,
  };
}

export default async function SegmentPage({ params, searchParams }) {
  const { segment } = await params;
  const sp = await searchParams;
  const seg = SEGMENTS[segment];
  if (!seg) notFound();

  const tip = TYPES[sp?.tip] ? sp.tip : '';
  const marka = BRANDS[sp?.marka] ? sp.marka : '';
  const etiket = typeof sp?.etiket === 'string' ? sp.etiket : '';

  return (
    <div className="container container-wide catalog-page">
      <nav className="breadcrumb" aria-label="Konum">
        <Link href="/">Ana Sayfa</Link> <span>›</span> <Link href="/katalog">Katalog</Link>{' '}
        <span>›</span> <strong>{seg.label}</strong>
      </nav>
      <h1 className="page-title">
        {seg.icon} {seg.title}
      </h1>
      <p className="page-sub">{seg.desc}</p>

      <div className="alt-kategori-ozet">
        {Object.values(TYPES).map((t) => (
          <Link
            key={t.slug}
            href={`/katalog/${seg.slug}?tip=${t.slug}`}
            className="alt-kategori-card"
            prefetch={false}
          >
            <span className="alt-icon">{t.icon}</span>
            <span className="alt-label">{t.plural}</span>
            <span className="alt-count">{countBy(seg.slug, t.slug)} ürün</span>
          </Link>
        ))}
      </div>

      <CatalogExplorer
        key={`${segment}-${tip}-${marka}-${etiket}`}
        initialSegment={segment}
        initialTip={tip}
        initialMarka={marka}
        initialEtiket={etiket}
        lockSegment
      />
    </div>
  );
}
