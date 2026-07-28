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
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KlimaSun — Erdinç Klima',
    url: SITE_URL,
    telephone: '+90 505 959 87 70',
    description:
      'Endüstriyel soğutma ve HVAC yapay zekâ asistanı; F-Gaz, evaporatif soğutma, pano kliması, chiller.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+90-505-959-87-70',
      contactType: 'customer service',
      areaServed: 'TR',
      availableLanguage: 'Turkish',
    },
  };

  return (
    <html lang="tr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              <span className="logo">❄️</span>
              <span>
                Klima<span className="accent">Sun</span>
              </span>
            </Link>
            <a href="tel:+905059598770" className="header-phone" aria-label="Telefonla ara">
              <span className="phone-ico">📞</span>
              <span className="phone-num">0505 959 87 70</span>
            </a>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-brand">
              <strong>KlimaSun.com</strong> · Erdinç Klima endüstriyel soğutma &amp; HVAC asistanı
            </div>
            <div className="footer-contact">
              <a href="tel:+905059598770">📞 0505 959 87 70</a>
              <span className="dot">·</span>
              <a href="https://klimasun.com">🌐 KlimaSun.com</a>
            </div>
            <div className="footer-note">Ücretsiz ve herkese açık</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
