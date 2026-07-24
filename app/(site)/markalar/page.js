import Link from 'next/link';
import { getBrands } from '@/lib/catalog-server';
import BrandsBrowser from '@/app/components/site/BrandsBrowser';

const TR = 'tr-TR';

export const metadata = {
  title: 'Markalar',
  description:
    'Rittal, Danfoss, Cosmotec, FORM, Sanhua ve daha fazlası — 226 üretici markasında orijinal ürün ve yedek parça.',
};

export default async function MarkalarPage() {
  const brands = await getBrands();

  return (
    <>
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <span className="ks-crumb-cur">Markalar</span>
          </div>
          <h1>Markalar</h1>
          <p>
            {brands.length.toLocaleString(TR)} üretici markasıyla çalışıyoruz. Kendi stoğumuz ve
            Avrupa&apos;daki uzman tedarikçi ağımızla, tek noktadan orijinal parça tedariği
            sağlıyoruz.
          </p>
        </div>
      </div>

      <BrandsBrowser brands={brands} />
    </>
  );
}
