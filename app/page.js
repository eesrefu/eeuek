import Link from 'next/link';
import SearchBox from './components/SearchBox';
import AsistanBox from './components/AsistanBox';
import ProductCard from './components/ProductCard';
import { POPULAR } from '@/lib/popular';
import { SEGMENTS, TYPES, PRODUCTS, countBy } from '@/lib/catalog';

export default function HomePage() {
  const oneCikanlar = PRODUCTS.filter((p) => p.oneCikan).slice(0, 4);

  return (
    <div className="container container-wide">
      {/* ── Yapay zekâ yönlendirmeli hero ── */}
      <section className="hero">
        <h1>
          Doğru iklimlendirme çözümünü
          <br />
          <span className="accent">kolayca</span> bulun
        </h1>
        <p className="sub">
          İhtiyacınızı yazın — yapay zekâ asistanımız sizi katalogda doğru ürüne yönlendirsin.
          Beğendiklerinizi teklif sepetine ekleyin, fiyatı aynı gün alın. Üyeliksiz.
        </p>
        <AsistanBox />
      </section>

      {/* ── Kategori kartları ── */}
      <section>
        <h2 className="section-title">Katalog — İhtiyacınıza Göre Seçin</h2>
        <div className="seg-grid">
          {Object.values(SEGMENTS).map((seg) => (
            <div key={seg.slug} className="seg-card">
              <Link href={`/katalog/${seg.slug}`} className="seg-head" prefetch={false}>
                <span className="seg-icon" aria-hidden="true">
                  {seg.icon}
                </span>
                <span className="seg-title">{seg.label}</span>
                <span className="seg-desc">{seg.desc}</span>
              </Link>
              <div className="seg-links">
                {Object.values(TYPES).map((t) => (
                  <Link
                    key={t.slug}
                    href={`/katalog/${seg.slug}?tip=${t.slug}`}
                    className="seg-link"
                    prefetch={false}
                  >
                    <span>
                      {t.icon} {t.plural}
                    </span>
                    <span className="seg-count">{countBy(seg.slug, t.slug)}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Rittal marka bandı ── */}
      <section>
        <Link href="/marka/rittal" className="rittal-band" prefetch={false}>
          <div>
            <span className="badge badge-marka">Yetkili Ürün Gamı</span>
            <h2>Rittal Pano Klimaları & Soğutma</h2>
            <p>
              TopTherm ve Blue e+ serisi pano klimaları, chiller, LCP — orijinal yedek parça ve
              aksesuarlarıyla birlikte. %75'e varan enerji tasarrufu.
            </p>
          </div>
          <span className="rittal-cta">Rittal Kataloğu →</span>
        </Link>
      </section>

      {/* ── Öne çıkan ürünler ── */}
      <section>
        <h2 className="section-title">Öne Çıkan Ürünler</h2>
        <div className="p-grid">
          {oneCikanlar.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {/* ── Teknik soru-cevap (doküman tabanlı AI) ── */}
      <section className="teknik-sc">
        <h2 className="section-title">Teknik Soru & Cevap</h2>
        <p className="page-sub">
          Ürün seçimi dışında teknik bir sorunuz mu var? Doküman tabanlı asistanımız kaynak
          göstererek cevaplar.
        </p>
        <SearchBox />
        <div className="q-grid">
          {POPULAR.slice(0, 4).map((item) => (
            <Link key={item.slug} href={`/soru/${item.slug}`} className="q-card" prefetch={false}>
              <span className="q-icon">❄️ Soru</span>
              <span className="q-text">{item.question}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
