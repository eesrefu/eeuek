import { notFound, permanentRedirect } from 'next/navigation';
import ProductDetail from './ProductDetail';
import { getProduct, findCategory } from '@/lib/catalog-server';
import { purl, caturl } from '@/lib/purl';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

// SEO uyumlu kanonik adres: /urun/<ana-kategori>/<alt-kategori>/<slug>
// Eski biçimler kalıcı yönlendirilir:
//   /urun/<slug>                      (düz Next adresi)
//   /urun/<slug>.html                 (eski statik site)
//   /urun/<ana>/<alt>/<slug>.html     (statik sitenin kategorili hali)
//   /urun/<yanlış-yol>/<slug>         (bayat kategori yolu)
async function resolve(params) {
  const { path } = await params;
  const segs = (path || []).map((s) => decodeURIComponent(s));
  if (!segs.length) return {};
  const slug = segs[segs.length - 1].replace(/\.html$/, '');
  const p = await getProduct(slug);
  if (!p) return {};
  const canonical = purl(p.path, slug);
  return { p, slug, canonical, isCanonical: `/urun/${segs.join('/')}` === canonical };
}

export async function generateMetadata({ params }) {
  const { p, canonical } = await resolve(params);
  if (!p) return { title: 'Ürün bulunamadı' };
  return {
    title: `${p.n} | Klimasun`,
    description: (p.desc || `${p.n} — ${p.b}. Kurumsal teklif için ürünü sepete ekleyin.`).slice(0, 155),
    alternates: { canonical },
  };
}

export default async function ProductPage({ params }) {
  const { p, canonical, isCanonical } = await resolve(params);
  if (!p) notFound();
  if (!isCanonical) permanentRedirect(canonical);

  const cat = p.catSlug ? await findCategory(p.catSlug) : null;
  const parent = cat?.parent || null;

  const product = {
    code: p.c,
    name: p.n,
    brand: p.b,
    category: p.cat,
    categoryHref: p.catSlug ? caturl(p.catSlug) : '/kategoriler',
    parentCategory: parent ? { name: parent.name, href: caturl(parent.slug) } : null,
    badge: p.stok ? 'STOKTAN TESLİM' : 'TEMİN EDİLEBİLİR',
    stok: Boolean(p.stok),
    cond: p.cond,
    description: p.desc,
    img: p.img,
    specs: Object.entries(p.f || {}),
    related: p.rel || [],
  };

  const crumbs = [
    { name: 'Ana Sayfa', item: `${SITE_URL}/` },
    ...(parent ? [{ name: parent.name, item: `${SITE_URL}${caturl(parent.slug)}` }] : []),
    ...(p.catSlug ? [{ name: p.cat, item: `${SITE_URL}${caturl(p.catSlug)}` }] : []),
    { name: p.n, item: `${SITE_URL}${canonical}` },
  ];
  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: p.n,
      sku: p.c,
      mpn: p.c,
      brand: { '@type': 'Brand', name: p.b },
      category: p.cat,
      url: `${SITE_URL}${canonical}`,
      ...(p.img ? { image: [`${SITE_URL}${p.img}`] } : {}),
      ...(p.desc ? { description: p.desc } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: c.item,
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <ProductDetail product={product} />
    </>
  );
}
