import './globals.css';
import Link from 'next/link';
import { CartProvider } from './components/CartProvider';
import CartBadge from './components/CartBadge';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KlimaSun — İklimlendirme Kataloğu & Teklif Merkezi',
    template: '%s — KlimaSun',
  },
  description:
    'KlimaSun ürün kataloğu: bireysel, ticari ve sanayi iklimlendirme ürünleri, yedek parça ve ' +
    'aksesuarlar. Rittal pano klimaları. Yapay zekâ destekli ürün yönlendirme ve hızlı teklif sepeti.',
  keywords: [
    'klima',
    'HVAC',
    'endüstriyel soğutma',
    'pano kliması',
    'Rittal',
    'chiller',
    'VRF',
    'yedek parça',
    'klima aksesuar',
    'teklif',
    'Erdinç Klima',
    'KlimaSun',
  ],
  applicationName: 'KlimaSun',
  openGraph: {
    type: 'website',
    siteName: 'KlimaSun',
    locale: 'tr_TR',
    url: SITE_URL,
    title: 'KlimaSun — İklimlendirme Kataloğu & Teklif Merkezi',
    description:
      'Bireysel, ticari ve sanayi iklimlendirme ürünleri; Rittal pano klimaları. AI destekli ürün bulma ve hızlı teklif.',
  },
  twitter: {
    card: 'summary',
    title: 'KlimaSun — İklimlendirme Kataloğu & Teklif Merkezi',
    description: 'AI destekli ürün yönlendirme, katalog ve teklif sepeti.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const NAV = [
  { href: '/katalog', label: 'Katalog' },
  { href: '/katalog/bireysel', label: 'Bireysel' },
  { href: '/katalog/ticari', label: 'Ticari' },
  { href: '/katalog/sanayi', label: 'Sanayi' },
  { href: '/marka/rittal', label: 'Rittal' },
];

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <CartProvider>
          <header className="site-header">
            <div className="container container-wide header-inner">
              <Link href="/" className="brand">
                <span className="logo">❄️</span>
                <span>
                  Klima<span className="accent">Sun</span>
                </span>
              </Link>
              <nav className="main-nav" aria-label="Ana menü">
                {NAV.map((item) => (
                  <Link key={item.href} href={item.href} prefetch={false}>
                    {item.label}
                  </Link>
                ))}
              </nav>
              <CartBadge />
            </div>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <div className="container container-wide footer-inner">
              <div>
                KlimaSun · Erdinç Klima — iklimlendirme kataloğu, Rittal pano klimaları & teklif
                merkezi
              </div>
              <nav aria-label="Alt menü" className="footer-nav">
                <Link href="/katalog" prefetch={false}>
                  Katalog
                </Link>
                <Link href="/marka/rittal" prefetch={false}>
                  Rittal
                </Link>
                <Link href="/teklif-sepeti" prefetch={false}>
                  Teklif Sepeti
                </Link>
              </nav>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
