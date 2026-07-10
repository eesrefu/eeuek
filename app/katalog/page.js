import CatalogExplorer from '../components/CatalogExplorer';
import { SEGMENTS, TYPES, BRANDS } from '@/lib/catalog';

export const metadata = {
  title: 'Ürün Kataloğu',
  description:
    'KlimaSun ürün kataloğu — bireysel, ticari ve sanayi iklimlendirme ürünleri, yedek parçalar ve aksesuarlar. Rittal pano klimaları ve daha fazlası.',
};

export default async function KatalogPage({ searchParams }) {
  const sp = await searchParams;
  const segment = SEGMENTS[sp?.segment] ? sp.segment : '';
  const tip = TYPES[sp?.tip] ? sp.tip : '';
  const marka = BRANDS[sp?.marka] ? sp.marka : '';
  const etiket = typeof sp?.etiket === 'string' ? sp.etiket : '';
  const q = typeof sp?.q === 'string' ? sp.q : '';

  return (
    <div className="container container-wide catalog-page">
      <nav className="breadcrumb" aria-label="Konum">
        <a href="/">Ana Sayfa</a> <span>›</span> <strong>Katalog</strong>
      </nav>
      <h1 className="page-title">Ürün Kataloğu</h1>
      <p className="page-sub">
        Kategori, tip, marka ve etiketlere göre filtreleyin; beğendiğiniz ürünleri teklif sepetinize
        ekleyin.
      </p>
      <CatalogExplorer
        initialSegment={segment}
        initialTip={tip}
        initialMarka={marka}
        initialEtiket={etiket}
        initialQ={q}
      />
    </div>
  );
}
