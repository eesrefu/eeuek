'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useQuote } from './QuoteContext';

const NAV = [
  { key: 'home', label: 'Ana Sayfa', href: '/' },
  { key: 'cozumler', label: 'Nasıl Yardımcı Oluruz', href: '/cozumler' },
  { key: 'markalar', label: 'Markalar', href: '/markalar' },
  { key: 'kategoriler', label: 'Kategoriler', href: '/kategoriler' },
  { key: 'urunler', label: 'ÜRÜN LİSTESİ', href: '/urunler' },
  { key: 'blog', label: 'Blog', href: '/blog' },
  { key: 'iletisim', label: 'İletişim', href: '/iletisim' },
];

function activeKey(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/urun')) return 'urunler';
  const seg = pathname.split('/')[1];
  const match = NAV.find((n) => n.href === `/${seg}`);
  return match ? match.key : '';
}

export default function SiteHeader() {
  const pathname = usePathname() || '/';
  const active = activeKey(pathname);
  const { openQuote, rowCount } = useQuote();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="ks-utility">
        <div className="ks-wrap">
          <div className="ks-utility-left">
            <a href="tel:+902163444819" className="ks-u-strong">☎ 0216 344 48 19</a>
            <a href="https://wa.me/905324246219" className="ks-u-strong">WhatsApp 0532 424 6219</a>
            <a href="mailto:info@klimasun.com.tr" className="ks-u-mail">info@klimasun.com.tr</a>
          </div>
          <div className="ks-spacer" />
          <div className="ks-utility-right">
            <span className="ks-u-amber">7/24 TEKLİF</span>
            <a href="#">SSS</a>
            <a href="#">TR</a>
          </div>
        </div>
      </div>
      <header className="ks-header">
        <div className="ks-wrap">
          <Link href="/" className="ks-logo" aria-label="Klimasun ana sayfa">
            <Image src="/logo.png" alt="Klimasun" height={44} width={112} priority />
          </Link>
          <nav className="ks-nav">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={n.key === active ? 'is-active' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <button type="button" className="ks-quote-btn" onClick={openQuote}>
            HIZLI TEKLİF
            <span className="ks-quote-badge">{rowCount}</span>
          </button>
          <button
            type="button"
            className="ks-burger"
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
        {menuOpen && (
          <nav className="ks-mobilenav">
            {NAV.map((n) => (
              <Link key={n.key} href={n.href} className={n.key === active ? 'is-active' : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
