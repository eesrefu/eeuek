import Link from 'next/link';
import HeroSearch from '@/app/components/site/HeroSearch';
import Placeholder from '@/app/components/site/Placeholder';
import { caturl } from '@/lib/purl';

const STATS = [
  ['9.799+', 'ÜRÜN'],
  ['226', 'MARKA'],
  ['20+ YIL', 'DENEYİM'],
  ['7/24', 'TEKLİF'],
];

const BRANDS = [
  ['RITTAL', '3631'],
  ['Danfoss', '1401'],
  ['nVent HOFFMAN', '987'],
  ['Cosmotec', '386'],
  ['FORM', '352'],
  ['Sanhua', '248'],
];

const CATEGORIES = [
  ['❄️', 'Pano İklimlendirme', '2052', 'pano-iklimlendirme'],
  ['⚙️', 'Yedek Parça', '4222', 'yedek-parca'],
  ['🧊', 'Chiller Soğutma', '248', 'chiller-sogutma'],
  ['💨', 'Evaporatif Soğutma', '246', 'evaporatif-sogutma'],
  ['🌬️', 'Klimalar', '38', 'klimalar'],
  ['🤖', 'Otomasyon', '42', 'otomasyon'],
];

const SOLUTIONS = [
  ['🧾', 'Hızlı Teklif', 'Sıfır · 2.El · Takas · Tamir — tek formda çok niyetli teklif talebi'],
  ['🛠️', 'Servis & Bakım', 'Kurulum, arıza, kompresör değişimi, gaz şarjı — F-Gaz sertifikalı ekip'],
  ['💰', 'Cihazımı Sat', 'Atıl veya arızalı cihazınızı değerinde nakde çevirin'],
  ['♻️', '2.El & Stoktan Teslim', 'Revizyonlu, garantili ürünler — aynı iş günü kargoya hazır'],
];

const REASONS = [
  ['🚚', 'STOKTAN TESLİM', 'Stoktaki sıfır ve 2.el ürünler aynı iş günü kargoya hazır — teklif beklemeden'],
  ['🛡️', 'GARANTİLİ ÜRÜN', 'Sıfır ürünlerde üretici garantisi, revizyonlu 2.el ürünlerde Klimasun garantisi'],
  ['⚖️', 'SEÇENEK', "Bütçenize uygun durum seçenekleri: sıfır kapalı kutudan revizyonlu 2.el'e, takas ve tamire"],
];

const RESOURCES = [
  ['Kapasite Hesabı (IEC 60890)', 'HESAP ARACINI AÇ', 'araç ekran görüntüsü'],
  ['Marka Katalogları', 'KATALOGLARI GÖR', 'katalog kapağı'],
  ['Teknik Dokümanlar', 'DOKÜMANLARA GİT', 'doküman kapağı'],
];

export default function HomePage() {
  return (
    <>
      <section className="ks-hero">
        <div className="ks-wrap">
          <div style={{ maxWidth: 860 }}>
            <div className="ks-hero-kicker">ENDÜSTRİYEL İKLİMLENDİRME MERKEZİ</div>
            <h1>Zor bulunan ve zaman kritik iklimlendirme parçalarında stresi biz üstleniyoruz</h1>
            <p className="ks-hero-sub">
              9799+ ürünlük envanterimizde arayın veya hızlı bir talep gönderin — pano klimasından
              chiller&apos;a, tedariği bize bırakın.
            </p>
          </div>
          <HeroSearch />
          <div className="ks-hero-stats">
            {STATS.map(([num, lbl]) => (
              <div key={lbl}>
                <div className="ks-stat-num">{num}</div>
                <div className="ks-stat-lbl">{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="ks-anchorband">
        <div className="ks-wrap">
          <a href="#markalar">MARKALAR</a>
          <a href="#kategoriler">KATEGORİLER</a>
          <a href="#cozumler">DOĞRU ÇÖZÜMÜ BULUN</a>
        </div>
      </div>

      <section id="markalar" className="ks-section light">
        <div className="ks-wrap">
          <h2 className="ks-h2">ÖNE ÇIKAN MARKALAR</h2>
          <p className="ks-lead">
            Geniş bir üretici yelpazesiyle çalışıyoruz. Kendi stoğumuzu tutuyor, özenle seçilmiş
            marka uzmanlarından oluşan ağımızla iş birliği yapıyoruz. Böylece karmaşık tedarikçi
            listelerine gerek kalmadan size zaman ve maliyet kazandırıyoruz.
          </p>
          <div className="ks-grid-3">
            {BRANDS.map(([name, count]) => (
              <div className="ks-brand-card" key={name}>
                <div className="ks-brand-name">{name}</div>
                <div className="ks-brand-count">{count} ürün</div>
                <Link href={`/urunler?marka=${encodeURIComponent(name)}`} className="ks-brand-link">
                  TÜM ÜRÜNLERİ GÖR <span className="ks-arw">→</span>
                </Link>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28 }}>
            <Link href="/markalar" className="ks-underlink">TÜM MARKALARI GÖR →</Link>
          </div>
        </div>
      </section>

      <section id="kategoriler" className="ks-section navy">
        <div className="ks-wrap">
          <h2 className="ks-h2">ÜRÜN KATEGORİLERİ</h2>
          <p className="ks-lead">
            Klimasun; güncel ve üretimden kalkmış endüstriyel iklimlendirme parçalarının merkezidir.
            Sıfır ürünlerde garanti, revizyonlu 2.el ürünlerde garantili teslimat ile Türkiye
            genelinde hizmet veriyoruz.
          </p>
          <div className="ks-grid-6">
            {CATEGORIES.map(([icon, name, count, slug]) => (
              <Link href={caturl(slug)} className="ks-cat-tile" key={name}>
                <span className="ks-cat-ico">{icon}</span>
                <span className="ks-cat-name">{name}</span>
                <span className="ks-cat-count">{count} ürün</span>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 30 }}>
            <Link href="/kategoriler" className="ks-amberlink">159 KATEGORİNİN TÜMÜNÜ GÖR →</Link>
          </div>
        </div>
      </section>

      <section className="ks-ai">
        <div className="ks-wrap">
          <div className="ks-ai-text">
            <div className="ks-ai-kicker">YAPAY ZEKÂ ASİSTANI · ÜCRETSİZ</div>
            <h2>Teknik sorunuzu asistana sorun</h2>
            <p>
              F-Gaz, chiller, pano kliması, evaporatif soğutma… 65 teknik katalogdan{' '}
              <b>kaynak göstererek</b>, Türkçe ve üyeliksiz yanıt. Örn. “Rittal TopTherm chiller
              nedir?”
            </p>
          </div>
          <Link href="/asistan" className="ks-ai-cta">ASİSTANA SOR →</Link>
        </div>
      </section>

      <section id="cozumler" className="ks-section soft">
        <div className="ks-wrap">
          <h2 className="ks-h2">DOĞRU ÇÖZÜMÜ BULUN</h2>
          <p className="ks-lead">
            Acil arıza desteğinden düzenli bakıma: ekipmanınızın yaşam döngüsünün her aşamasında
            hızlı ve güvenilir çözümler. Zor bulunan parça, stok yenileme, ekonomik tamir veya uzun
            vadeli tedarik — doğru çözüm, doğru zamanda.
          </p>
          <div className="ks-grid-4">
            {SOLUTIONS.map(([icon, name, desc]) => (
              <div className="ks-sol-card" key={name}>
                <div className="ks-sol-ico">{icon}</div>
                <div className="ks-sol-name">{name}</div>
                <div className="ks-sol-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ks-section light">
        <div className="ks-wrap">
          <h2 className="ks-h2">KLIMASUN&apos;U SEÇMEK İÇİN 3 NEDEN</h2>
          <p className="ks-lead">
            Endüstriyel üretim hızlıdır; arızalı bir parçanın yol açtığı her duruş anı işletmenize
            kaybettirir. Bu yüzden ihtiyacınız olan parçayı en kısa sürede size ulaştırmayı taahhüt
            ediyoruz.
          </p>
          <div className="ks-grid-3">
            {REASONS.map(([icon, title, text]) => (
              <div className="ks-reason" key={title}>
                <div className="ks-reason-ico">{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="#">DAHA FAZLA</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ks-section soft">
        <div className="ks-wrap">
          <h2 className="ks-h2">KAYNAKLAR &amp; ARAÇLAR</h2>
          <p className="ks-lead">
            Marka kataloglarımızı ve teknik dokümanları inceleyin; IEC 60890 kapasite hesap aracıyla
            panonuz için doğru soğutma kapasitesini dakikalar içinde belirleyin.
          </p>
          <div className="ks-grid-3">
            {RESOURCES.map(([name, cta, ph]) => (
              <div className="ks-res-card" key={name}>
                <Placeholder w={400} h={180} label={ph} variant="res" />
                <div className="ks-res-body">
                  <h3>{name}</h3>
                  <a href="#" className="ks-res-cta">{cta} <span>→</span></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="blog" className="ks-section navy">
        <div className="ks-wrap">
          <h2 className="ks-h2" style={{ marginBottom: 40 }}>BLOG &amp; HABERLER</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
            <div className="ks-blogfeat">
              <Placeholder w={600} h={240} label="blog görseli — pano kliması" variant="navy" />
              <div className="ks-blogfeat-body">
                <div className="ks-blogfeat-kick">BLOG</div>
                <h3>Pano Kliması Nasıl Seçilir? Kapasite, Montaj Tipi ve IEC 60890</h3>
                <p>
                  Yanlış kapasite seçimi panoda yoğuşma ve erken arıza demektir. Isı yükü hesabından
                  montaj tipine, doğru pano klimasını seçmenin adımları…
                </p>
                <Link href="/blog" className="more">DEVAMINI OKU →</Link>
              </div>
            </div>
            <div className="ks-blogfeat">
              <Placeholder w={600} h={240} label="haber görseli — evaporatif soğutma" variant="navy" />
              <div className="ks-blogfeat-body">
                <div className="ks-blogfeat-kick">HABERLER</div>
                <h3>Evaporatif Soğutma Nedir? Fabrikalar İçin %80&apos;e Varan Enerji Tasarrufu</h3>
                <p>
                  FORM FES evaporatif soğutucular, geniş hacimli üretim alanlarında mekanik
                  soğutmaya göre çok daha düşük işletme maliyeti sunuyor…
                </p>
                <Link href="/blog" className="more">DEVAMINI OKU →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
