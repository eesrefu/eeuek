'use client';

import { useEffect, useState } from 'react';
import CatalogBrowser from '@/app/components/site/CatalogBrowser';

export default function CategoryProducts({ slug }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let alive = true;
    setData(null);
    fetch(`/veri/kategori/${slug}.json`)
      .then((r) => r.json())
      .then((d) => alive && setData(d))
      .catch(() => alive && setData({ items: [] }));
    return () => {
      alive = false;
    };
  }, [slug]);

  return (
    <CatalogBrowser
      key={slug}
      items={data ? data.items : []}
      loading={!data}
      searchPlaceholder="Bu kategoride ara: kod, ürün adı, marka…"
    />
  );
}
