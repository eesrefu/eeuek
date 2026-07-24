const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'KlimaSun — Endüstriyel İklimlendirme Merkezi',
    template: '%s — KlimaSun',
  },
  description:
    "Klimasun endüstriyel iklimlendirme merkezi: pano kliması, chiller, evaporatif soğutma ve " +
    'yedek parçada 9.799+ ürün. Sıfır, 2.el, takas ve tamir seçenekleriyle aynı gün teklif.',
  keywords: [
    'endüstriyel iklimlendirme',
    'pano kliması',
    'chiller',
    'evaporatif soğutma',
    'yedek parça',
    'HVAC',
    'F-Gaz',
    'Klimasun',
    'Erdinç Klima',
  ],
  applicationName: 'Klimasun',
  openGraph: {
    type: 'website',
    siteName: 'Klimasun',
    locale: 'tr_TR',
    url: SITE_URL,
    title: 'KlimaSun — Endüstriyel İklimlendirme Merkezi',
    description:
      'Pano kliması, chiller, evaporatif soğutma ve yedek parçada 9.799+ ürün. Aynı gün hızlı teklif.',
  },
  twitter: {
    card: 'summary',
    title: 'KlimaSun — Endüstriyel İklimlendirme Merkezi',
    description: 'Endüstriyel iklimlendirme parçalarında zor bulunanı biz tedarik ediyoruz.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
