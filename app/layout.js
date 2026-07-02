import './globals.css';
import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KlimaSun — Endüstriyel Soğutma & HVAC AI Asistanı',
    template: '%s — KlimaSun',
  },
  description:
    "KlimaSun, Erdinç Klima'nın endüstriyel soğutma ve HVAC asistanı. F-Gaz, evaporatif soğutma, " +
    'pano kliması, chiller ve daha fazlası hakkında kaynak göstererek, ücretsiz cevaplar.',
  keywords: [
    'HVAC',
    'endüstriyel soğutma',
    'F-Gaz',
    'evaporatif soğutma',
    'pano kliması',
    'chiller',
    'Erdinç Klima',
    'KlimaSun',
  ],
  applicationName: 'KlimaSun',
  openGraph: {
    type: 'website',
    siteName: 'KlimaSun',
    locale: 'tr_TR',
    url: SITE_URL,
    title: 'KlimaSun — Endüstriyel Soğutma & HVAC AI Asistanı',
    description:
      'F-Gaz, evaporatif soğutma, pano kliması, chiller ve daha fazlası hakkında kaynak göstererek ücretsiz cevaplar.',
  },
  twitter: {
    card: 'summary',
    title: 'KlimaSun — Endüstriyel Soğutma & HVAC AI Asistanı',
    description: 'HVAC ve endüstriyel soğutma sorularınıza kaynaklı, ücretsiz cevaplar.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              <span className="logo">❄️</span>
              <span>
                Klima<span className="accent">Sun</span>
              </span>
            </Link>
            <span className="tagline">Erdinç Klima · Endüstriyel Soğutma & HVAC</span>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            KlimaSun · Erdinç Klima endüstriyel soğutma & HVAC asistanı · Ücretsiz ve herkese açık
          </div>
        </footer>
      </body>
    </html>
  );
}
