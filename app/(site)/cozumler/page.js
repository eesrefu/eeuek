'use client';

import Link from 'next/link';
import { useQuote } from '@/app/components/site/QuoteContext';

const BLOCKS = [
  {
    icon: '🧾', kick: 'TEK FORMDA 5 NİYET', name: 'Hızlı Teklif', ctaLabel: 'TEKLİF OLUŞTUR →',
    desc: 'Sıfır, 2.el, takas veya tamir — niyetinizi seçin, parça kodlarını girin ya da listenizi sürükleyin. Satışlarımız kurumsaldır; fiyatlar aynı gün teklifle iletilir.',
    tags: ['Sıfır', '2.El', 'Takas', 'Tamir', 'Toplu liste yükleme'],
  },
  {
    icon: '🛠️', kick: 'F-GAZ SERTİFİKALI EKİP', name: 'Servis & Bakım', ctaLabel: 'SERVİS TALEBİ →',
    desc: "Kurulum, arıza tespiti, kompresör değişimi, gaz şarjı ve periyodik bakım. İstanbul ve İzmir'de yerinde servis; Türkiye geneli anlaşmalı ağ.",
    tags: ['Kurulum', 'Arıza', 'Kompresör değişimi', 'Gaz şarjı', 'Periyodik bakım'],
  },
  {
    icon: '💰', kick: 'ATIL CİHAZINIZ DEĞERLİDİR', name: 'Cihazımı Sat', ctaLabel: 'DEĞERLEME AL →',
    desc: 'Kullanmadığınız veya arızalı pano kliması, chiller ve soğutma cihazlarınızı fotoğraf ve etiket bilgisiyle gönderin; aynı gün değerleme yapıp nakde çevirelim.',
    tags: ['Ücretsiz değerleme', 'Yerinde söküm', 'Nakit ödeme', 'Takas imkânı'],
  },
  {
    icon: '♻️', kick: 'AYNI İŞ GÜNÜ KARGO', name: '2.El & Stoktan Teslim', ctaLabel: 'STOĞU GÖR →',
    desc: 'Revizyonlu ve test edilmiş 2.el ürünler Klimasun garantisiyle, sıfır stok ürünler üretici garantisiyle — teklif beklemeden aynı iş günü kargoya hazır.',
    tags: ['Revizyonlu', 'Garantili', 'Test raporlu', 'Hızlı teslim'],
  },
];

const STEPS = [
  ['1', 'TALEBİNİZİ İLETİN', 'Parça kodu, fotoğraf veya ürün listenizi hızlı teklif formu, WhatsApp ya da e-posta ile gönderin.'],
  ['2', 'AYNI GÜN TEKLİF', 'Müşteri temsilciniz stok, 2.el ve Avrupa tedarik seçeneklerini fiyat ve termin ile birlikte sunar.'],
  ['3', 'KAPINIZA TESLİM', 'Siparişinizi kargoya tesliminden kurulumuna kadar biz takip ederiz; stok ürünler aynı iş günü çıkar.'],
];

export default function CozumlerPage() {
  const { openQuote } = useQuote();

  return (
    <>
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <span className="ks-crumb-cur">Nasıl Yardımcı Oluruz</span>
          </div>
          <h1>Nasıl Yardımcı Oluruz</h1>
          <p>
            Acil arıza desteğinden düzenli bakıma, cihaz alımından 2.el tedariğe: ekipmanınızın yaşam
            döngüsünün her aşaması için tek muhatap.
          </p>
        </div>
      </div>

      <div className="ks-blocks">
        {BLOCKS.map((b) => (
          <div className="ks-block" key={b.name}>
            <div className="ks-block-ico">{b.icon}</div>
            <div>
              <div className="ks-block-kick">{b.kick}</div>
              <h2>{b.name}</h2>
              <p>{b.desc}</p>
              <div className="ks-subtags">
                {b.tags.map((t) => (
                  <span className="ks-subtag" key={t}>{t}</span>
                ))}
              </div>
            </div>
            <button type="button" className="ks-block-cta" onClick={openQuote}>{b.ctaLabel}</button>
          </div>
        ))}
      </div>

      <div className="ks-process">
        <h2>Süreç Nasıl İşler?</h2>
        <div className="ks-grid-3">
          {STEPS.map(([num, title, text]) => (
            <div className="ks-step" key={num}>
              <div className="ks-step-num">{num}</div>
              <div className="ks-step-title">{title}</div>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
