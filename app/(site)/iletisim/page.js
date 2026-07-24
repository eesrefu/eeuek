'use client';

import { useState } from 'react';
import Link from 'next/link';
import Placeholder from '@/app/components/site/Placeholder';

const TOPICS = ['Teklif', 'Servis', 'Cihaz Satışı', 'Diğer'];

const CARDS = [
  { cls: '', ico: '☎', lbl: 'TELEFON', val: '0216 344 48 19', sub: 'Hafta içi 08:30 – 18:00' },
  { cls: 'wa', ico: '✆', lbl: 'WHATSAPP', val: '0532 424 6219', sub: 'Genellikle dakikalar içinde yanıt' },
  { cls: '', ico: '✉', lbl: 'E-POSTA', val: 'info@klimasun.com.tr', sub: 'Teklif ve toplu liste için' },
  { cls: '', ico: '📍', lbl: 'ADRES', val: 'İstanbul, Türkiye', sub: 'Türkiye geneli tedarik & servis' },
];

export default function IletisimPage() {
  const [sent, setSent] = useState(false);
  const [topic, setTopic] = useState('Teklif');

  return (
    <>
      <div className="ks-pagehero">
        <div className="ks-wrap">
          <div className="ks-crumb">
            <Link href="/">Ana Sayfa</Link> / <span className="ks-crumb-cur">İletişim</span>
          </div>
          <h1>İletişim</h1>
          <p>Telefon, WhatsApp veya form — mesai saatleri içinde aynı gün dönüş yapıyoruz.</p>
        </div>
      </div>

      <div className="ks-contact">
        <div className="ks-contact-left">
          <div className="ks-contact-cards">
            {CARDS.map((c) => (
              <div className={`ks-contact-card ${c.cls}`} key={c.lbl}>
                <div className="ico">{c.ico}</div>
                <div className="lbl">{c.lbl}</div>
                <div className="val">{c.val}</div>
                <div className="sub">{c.sub}</div>
              </div>
            ))}
          </div>
          <Placeholder w={560} h={300} label="harita — ofis / depo konumu" style={{ border: '1px solid #e6e9ee' }} />
        </div>

        <div className="ks-contact-form">
          {!sent ? (
            <>
              <h2>BİZE YAZIN</h2>
              <p className="intro">
                Parça kodu, kapasite ihtiyacı veya servis talebinizi yazın; temsilciniz aynı gün
                dönüş yapsın.
              </p>
              <div className="ks-form-fields">
                <div className="ks-form-row">
                  <input placeholder="Ad Soyad *" />
                  <input placeholder="Firma" />
                </div>
                <div className="ks-form-row">
                  <input placeholder="E-posta *" />
                  <input placeholder="Telefon" />
                </div>
                <div className="ks-topics">
                  <span className="ks-cond-lbl">KONU:</span>
                  {TOPICS.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`ks-topic${t === topic ? ' is-active' : ''}`}
                      onClick={() => setTopic(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <textarea placeholder="Mesajınız — parça kodu, adet, marka/model…" rows={5} />
                <label className="ks-kvkk">
                  <input type="checkbox" />
                  <span>KVKK aydınlatma metnini okudum, kabul ediyorum.</span>
                </label>
                <button type="button" className="ks-form-submit" onClick={() => setSent(true)}>
                  GÖNDER
                </button>
              </div>
            </>
          ) : (
            <div className="ks-contact-done">
              <div className="ks-done-check">✓</div>
              <div className="ks-done-title">MESAJINIZ ALINDI</div>
              <div className="ks-done-text">
                Teşekkürler! Temsilciniz mesai saatleri içinde aynı gün dönüş yapacak.
              </div>
              <button type="button" className="ks-done-btn" onClick={() => setSent(false)}>
                YENİ MESAJ
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
