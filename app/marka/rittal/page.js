import Link from 'next/link';
import CatalogExplorer from '../../components/CatalogExplorer';

export const metadata = {
  title: 'Rittal Pano Klimaları & Soğutma Çözümleri',
  description:
    'Rittal TopTherm ve Blue e+ pano klimaları, chiller, LCP ve orijinal yedek parça & aksesuarlar. KlimaSun — Rittal endüstriyel soğutma çözümleri.',
};

export default function RittalPage() {
  return (
    <div className="container container-wide catalog-page">
      <nav className="breadcrumb" aria-label="Konum">
        <Link href="/">Ana Sayfa</Link> <span>›</span> <strong>Rittal</strong>
      </nav>

      <div className="marka-hero">
        <h1 className="page-title">Rittal Endüstriyel Soğutma</h1>
        <p className="page-sub">
          TopTherm ve Blue e+ pano klimaları, TopTherm chiller'lar, LCP veri merkezi soğutması ve
          orijinal yedek parça & aksesuarlar. Blue e+ hibrit teknolojisi ile %75'e varan enerji
          tasarrufu.
        </p>
        <div className="marka-noktalar">
          <span className="badge">✔ Orijinal ürün ve parça</span>
          <span className="badge">✔ Model bazlı eşleştirme desteği</span>
          <span className="badge">✔ Aynı gün teklif</span>
        </div>
      </div>

      <CatalogExplorer initialMarka="rittal" />
    </div>
  );
}
