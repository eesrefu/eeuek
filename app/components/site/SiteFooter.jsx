import Image from 'next/image';
import Link from 'next/link';

const USEFUL = [
  ['Nasıl Yardımcı Oluruz', '/cozumler'],
  ['Markalar', '/markalar'],
  ['Ürün Listesi', '/urunler'],
  ['Servis & Bakım', '/cozumler'],
  ['Cihazınızı Satın', '/cozumler'],
  ['2.El & Stoktan Teslim', '/cozumler'],
  ['İletişim', '/iletisim'],
];

const BRANDS = ['RITTAL', 'Danfoss', 'nVent HOFFMAN', 'Cosmotec', 'FORM', 'Sanhua'];

export default function SiteFooter() {
  return (
    <footer className="ks-footer">
      <div className="ks-footer-top">
        <div className="ks-footer-brand">
          <div className="ks-footer-logo">
            <Image src="/logo.png" alt="Klimasun" height={36} width={92} />
          </div>
          <div className="ks-footer-info">
            <div className="ks-u-strong">☎ 0216 344 48 19 · WhatsApp 0532 424 6219</div>
            <div>✉ info@klimasun.com.tr</div>
            <div style={{ marginTop: 10 }}>
              Klimasun Endüstriyel İklimlendirme, İstanbul — Türkiye geneli tedarik &amp; servis
            </div>
          </div>
        </div>
        <div>
          <h4>FAYDALI BAĞLANTILAR</h4>
          <div className="ks-footer-links">
            {USEFUL.map(([label, href]) => (
              <Link key={label} href={href}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4>MARKALAR</h4>
          <div className="ks-footer-links">
            {BRANDS.map((b) => (
              <Link key={b} href="/markalar">
                {b}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="ks-footer-bottom">
        <div className="ks-wrap">
          <a href="#">Site Haritası</a>
          <a href="#">Şartlar &amp; Koşullar</a>
          <a href="#">Gizlilik</a>
          <a href="#">Çerez Politikası</a>
          <div className="ks-spacer" />
          <div>© 2026 Klimasun. Tüm hakları saklıdır.</div>
        </div>
      </div>
    </footer>
  );
}
