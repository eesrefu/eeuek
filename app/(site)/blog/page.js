'use client';

import { useState } from 'react';
import Link from 'next/link';
import Placeholder from '@/app/components/site/Placeholder';

const POSTS = [
  { tag: 'REHBER', title: 'Pano Kliması Kapasite Hesabı: IEC 60890 Adım Adım', excerpt: 'Pano içi ısı yükünü hesaplayın, doğru soğutma kapasitesini belirleyin.', date: '28 HAZİRAN 2026', ph: 'kapasite hesabı görseli' },
  { tag: 'REHBER', title: 'Pano Klimasında Yanlış Bilinen 7 Şey', excerpt: 'IP sınıfından iç sirkülasyona, sahada en sık yapılan hatalar.', date: '14 HAZİRAN 2026', ph: 'pano kliması görseli' },
  { tag: 'REHBER', title: 'Pano İçi Isı Yükü Nereden Gelir?', excerpt: 'Sürücüler, trafolar ve güneş yükü: ısı kaynaklarını doğru toplayın.', date: '2 HAZİRAN 2026', ph: 'ısı yükü diyagramı' },
  { tag: 'TEKNİK', title: 'Rittal Klima Arıza Kodları ve Çözümleri', excerpt: "E1'den E8'e ekranda gördüğünüz kodun anlamı ve ilk müdahale.", date: '19 MAYIS 2026', ph: 'arıza kodu ekranı' },
  { tag: 'TEKNİK', title: "F-Gaz Uyum Rehberi: 2026'da Neler Değişti?", excerpt: 'Kota, kayıt ve sertifika zorunlulukları — işletmeler için özet.', date: '5 MAYIS 2026', ph: 'f-gaz mevzuat görseli' },
  { tag: 'REHBER', title: 'Evaporatif Soğutma Nedir, Nerede Mantıklı?', excerpt: "Geniş hacimli üretim alanlarında %80'e varan enerji tasarrufu.", date: '21 NİSAN 2026', ph: 'evaporatif soğutucu' },
  { tag: 'REHBER', title: 'Evaporatif Klimanın 5 Avantajı', excerpt: 'İlk yatırım, işletme maliyeti ve taze hava karşılaştırması.', date: '7 NİSAN 2026', ph: 'fabrika içi görsel' },
  { tag: 'TEKNİK', title: 'Evaporatif Soğutma Sağlıklı mı?', excerpt: 'Lejyonella riski, su hijyeni ve doğru bakım pratikleri.', date: '24 MART 2026', ph: 'su hijyeni görseli' },
  { tag: 'HABER', title: 'Duman Tahliye Sistemleri Portföyümüzde', excerpt: 'Tek/çift kanatlı ve panjur kanatlı kapaklar stoklarımızda.', date: '10 MART 2026', ph: 'duman tahliye kapağı' },
];

const TABS = ['Tümü', 'REHBER', 'TEKNİK', 'HABER'];

function tagClass(t) {
  if (t === 'HABER') return 'ks-tag haber';
  if (t === 'TEKNİK') return 'ks-tag teknik';
  return 'ks-tag rehber';
}

export default function BlogPage() {
  const [tab, setTab] = useState('Tümü');
  const list = POSTS.filter((p) => tab === 'Tümü' || p.tag === tab);

  return (
    <>
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <span className="ks-crumb-cur">Blog</span>
          </div>
          <h1>Blog &amp; Haberler</h1>
          <p>
            Pano iklimlendirme, evaporatif soğutma ve F-Gaz mevzuatı üzerine teknik rehberler ve
            sektör haberleri.
          </p>
        </div>
      </div>

      <div className="ks-page-body">
        <div className="ks-tabs">
          {TABS.map((label) => (
            <button
              type="button"
              key={label}
              className={`ks-tab${label === tab ? ' is-active' : ''}`}
              onClick={() => setTab(label)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="ks-blog-feat">
          <Placeholder w={700} h={380} label="öne çıkan yazı görseli — pano kliması seçimi" />
          <div className="ks-blog-feat-body">
            <div className="ks-blog-feat-meta">
              <span className="k">REHBER</span>
              <span className="d">12 TEMMUZ 2026 · 8 DK</span>
            </div>
            <h2>Pano Kliması Nasıl Seçilir? Kapasite, Montaj Tipi ve IEC 60890</h2>
            <p>
              Yanlış kapasite seçimi panoda yoğuşma ve erken arıza demektir. Isı yükü hesabından
              montaj tipine ve koruma sınıfına, doğru pano klimasını seçmenin tüm adımları.
            </p>
            <a href="#" className="ks-readmore">DEVAMINI OKU <span>→</span></a>
          </div>
        </div>

        <div className="ks-grid-3">
          {list.map((p) => (
            <div className="ks-blogcard" key={p.title}>
              <Placeholder w={400} h={200} label={p.ph} />
              <div className="ks-blogcard-body">
                <div className="ks-blogcard-meta">
                  <span className={tagClass(p.tag)}>{p.tag}</span>
                  <span className="d">{p.date}</span>
                </div>
                <h3>{p.title}</h3>
                <p>{p.excerpt}</p>
                <a href="#" className="ks-readmore">DEVAMINI OKU <span>→</span></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
