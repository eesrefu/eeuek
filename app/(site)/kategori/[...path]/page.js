import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { findCategory } from '@/lib/catalog-server';
import CategoryProducts from './CategoryProducts';
// Katalogdan kalkmış (eski statik sitede kalan) kategori sayfaları -> /kategoriler
import KATEGORI_REDIRECTS from '@/lib/kategori-redirects.json';
import { caturl } from '@/lib/purl';

const TR = 'tr-TR';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

// Kanonik adresler: /kategori/<ana> ve /kategori/<ana>/<alt>
// Eski biçimler kalıcı yönlendirilir:
//   /kategori/<ana--alt>            (tek segmentli eski Next adresi)
//   /kategori/<slug>.html           (eski statik site)
//   Katalogdan kalkmış kategoriler  -> /kategoriler
// Veri tarafında slug "ana--alt" olarak kalır; yalnızca URL "/" kullanır.
async function resolve(params) {
  const { path } = await params;
  const segs = (path || []).map((s) => decodeURIComponent(s));
  if (!segs.length || segs.length > 2) return {};
  segs[segs.length - 1] = segs[segs.length - 1].replace(/\.html$/, '');
  const slug = segs.join('--');
  if (KATEGORI_REDIRECTS[slug]) return { dead: true };
  const cat = await findCategory(slug);
  if (!cat) return {};
  const canonical = caturl(cat.slug);
  return { cat, canonical, isCanonical: `/kategori/${segs.join('/')}` === canonical };
}

export async function generateMetadata({ params }) {
  const { cat, canonical } = await resolve(params);
  if (!cat) return { title: 'Kategori bulunamadı' };
  return {
    title: `${cat.name} | Klimasun`,
    description: `${cat.name} kategorisinde ${cat.count.toLocaleString(TR)} ürün — fiyat için teklif sepetine ekleyin, aynı gün dönüş yapalım.`,
    alternates: { canonical },
  };
}

export default async function KategoriPage({ params }) {
  const { cat, canonical, isCanonical, dead } = await resolve(params);
  if (dead) permanentRedirect('/kategoriler');
  if (!cat) notFound();
  if (!isCanonical) permanentRedirect(canonical);

  const crumbs = [
    { name: 'Ana Sayfa', item: `${SITE_URL}/` },
    { name: 'Kategoriler', item: `${SITE_URL}/kategoriler` },
    ...(cat.parent ? [{ name: cat.parent.name, item: `${SITE_URL}${caturl(cat.parent.slug)}` }] : []),
    { name: cat.name, item: `${SITE_URL}${canonical}` },
  ];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.item,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <Link href="/kategoriler">Kategoriler</Link>
            {cat.parent && (
              <>
                {' '}/ <Link href={caturl(cat.parent.slug)}>{cat.parent.name}</Link>
              </>
            )}{' '}
            / <span className="ks-crumb-cur">{cat.name}</span>
          </div>
          <h1>{cat.name}</h1>
          <p>
            Bu kategoride {cat.count.toLocaleString(TR)} ürün listeleniyor. Fiyat görmek için
            ürünleri teklif sepetine ekleyin — teklifiniz aynı gün hazırlanır.
          </p>
        </div>
      </div>

      {cat.children.length > 0 && (
        <div className="ks-crumb-bar">
          <div className="ks-wrap ks-subcat-bar">
            <span className="ks-subcat-lbl">ALT KATEGORİLER:</span>
            {cat.children.map((c) => (
              <Link href={caturl(c.slug)} className="ks-subtag" key={c.slug}>
                {c.name} ({c.count.toLocaleString(TR)})
              </Link>
            ))}
          </div>
        </div>
      )}

      <CategoryProducts slug={cat.slug} />
    </>
  );
}
