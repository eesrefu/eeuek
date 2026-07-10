import Link from 'next/link';
import QuoteCart from '../components/QuoteCart';

export const metadata = {
  title: 'Teklif Sepeti',
  description:
    'Seçtiğiniz ürünler için tek formla fiyat teklifi isteyin — üyeliksiz, hızlı dönüş.',
  robots: { index: false },
};

export default function TeklifSepetiPage() {
  return (
    <div className="container container-wide catalog-page">
      <nav className="breadcrumb" aria-label="Konum">
        <Link href="/">Ana Sayfa</Link> <span>›</span> <strong>Teklif Sepeti</strong>
      </nav>
      <h1 className="page-title">🧾 Teklif Sepeti</h1>
      <p className="page-sub">
        Sepetinizdeki ürünler için adetleri belirleyin, iletişim bilgilerinizi bırakın — size özel
        fiyat teklifini aynı gün iletelim.
      </p>
      <QuoteCart />
    </div>
  );
}
