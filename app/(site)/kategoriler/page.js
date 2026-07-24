import Link from 'next/link';
import { getCategoryTree } from '@/lib/catalog-server';
import { caturl } from '@/lib/purl';

const TR = 'tr-TR';

export const metadata = {
  title: 'Kategoriler',
  description: '159 kategoride 9.799+ ürün — pano iklimlendirme, yedek parça, chiller ve daha fazlası.',
};

const ICONS = {
  'yedek-parca': '⚙️',
  'pano-iklimlendirme': '❄️',
  'rittal-yedek-parca': '🔧',
  'sistem-aksesuarlari': '🧩',
  'chiller-sogutma': '🧊',
  'evaporatif-sogutma': '💨',
  'rittal-el-aletleri': '🛠️',
  fancoil: '♨️',
  'data-center': '🖥️',
  'diger-urunler': '📦',
  aksesuarlar: '🧷',
  havalandirma: '🍃',
  'nem-kontrol': '💧',
  '2-el-urunler': '♻️',
  otomasyon: '🤖',
  klimalar: '🌬️',
  'ticari-iklimlendirme': '🏢',
  'dogal-aydinlatma': '☀️',
  'duman-tahliye': '🚨',
  'vrf-klimalar': '🌀',
  'kimyasal-urunler': '🧪',
};

export default async function KategorilerPage() {
  const tree = await getCategoryTree();

  return (
    <>
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <span className="ks-crumb-cur">Kategoriler</span>
          </div>
          <h1>Ürün Kategorileri</h1>
          <p>
            159 kategoride 9.799+ ürün. İhtiyacınız olan grubu seçin; alt kategorilerden doğrudan
            ürün listesine ulaşın.
          </p>
        </div>
      </div>

      <div className="ks-page-body">
        <div className="ks-grid-3">
          {tree.map((c) => (
            <div className="ks-catcard" key={c.slug}>
              <div className="ks-catcard-head">
                <span className="ks-catcard-ico">{ICONS[c.slug] || '📦'}</span>
                <div>
                  <Link href={caturl(c.slug)} className="ks-catcard-name">{c.name}</Link>
                  <div className="ks-catcard-count">{c.count.toLocaleString(TR)} ürün</div>
                </div>
              </div>
              <div className="ks-subtags">
                {c.children.map((s) => (
                  <Link href={caturl(s.slug)} className="ks-subtag" key={s.slug}>
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
