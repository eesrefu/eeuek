'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CatalogBrowser from '@/app/components/site/CatalogBrowser';

const TR = 'tr-TR';

const CATEGORY_LINKS = [
  ['Pano İklimlendirme', '/kategori/pano-iklimlendirme'],
  ['Yedek Parça', '/kategori/yedek-parca'],
  ['Chiller Soğutma', '/kategori/chiller-sogutma'],
  ['Evaporatif Soğutma', '/kategori/evaporatif-sogutma'],
  ['2.El Ürünler', '/kategori/2-el-urunler'],
  ['Tüm kategoriler →', '/kategoriler', true],
];

function UrunlerContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    fetch('/veri/katalog.json')
      .then((r) => r.json())
      .then((d) => alive && setData(d))
      .catch(() => alive && setData({ count: 0, brands: [], items: [] }));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <span className="ks-crumb-cur">Ürün Listesi</span>
          </div>
          <h1>Ürün Listesi</h1>
          <p>
            {data ? data.count.toLocaleString(TR) : '9.799'}+ ürünlük envanterimizde arayın. Fiyat
            görmek için ürünleri teklif sepetine ekleyin — satışlarımız kurumsaldır, teklifiniz aynı
            gün hazırlanır.
          </p>
        </div>
      </div>

      <CatalogBrowser
        items={data ? data.items : []}
        loading={!data}
        initialQuery={searchParams.get('q') || ''}
        initialBrand={searchParams.get('marka') || ''}
        categoryLinks={CATEGORY_LINKS}
      />
    </>
  );
}

export default function UrunlerPage() {
  return (
    <Suspense fallback={null}>
      <UrunlerContent />
    </Suspense>
  );
}
