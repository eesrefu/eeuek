'use client';

import { CONDITIONS, useQuote } from './QuoteContext';

export default function QuoteDrawer() {
  const {
    open,
    submitted,
    rows,
    closeQuote,
    patchRow,
    removeRow,
    addRow,
    submitQuote,
    resetQuote,
  } = useQuote();

  if (!open) return null;

  return (
    <>
      <div className="ks-drawer-scrim" onClick={closeQuote} />
      <aside className="ks-drawer" role="dialog" aria-label="Hızlı teklif oluştur">
        <div className="ks-drawer-head">
          <div className="t">HIZLI TEKLİF OLUŞTUR</div>
          <div className="ks-spacer" />
          <button type="button" className="ks-drawer-x" onClick={closeQuote} aria-label="Kapat">
            ✕
          </button>
        </div>

        {!submitted ? (
          <>
            <div className="ks-drawer-body">
              <div className="ks-drawer-cols">
                <div>ÜRÜN / PARÇA KODU</div>
                <div>ADET</div>
              </div>

              {rows.map((row) => (
                <div className="ks-qrow" key={row.id}>
                  <div className="ks-qrow-top">
                    <input
                      value={row.code}
                      onChange={(e) => patchRow(row.id, { code: e.target.value })}
                      placeholder="ör. SK 3304500"
                    />
                    <input
                      type="number"
                      min="1"
                      value={row.qty}
                      onChange={(e) => patchRow(row.id, { qty: e.target.value })}
                    />
                    <button
                      type="button"
                      className="ks-qrow-del"
                      title="Satırı sil"
                      onClick={() => removeRow(row.id)}
                    >
                      🗑
                    </button>
                  </div>
                  <div className="ks-qrow-cond">
                    <span className="ks-cond-lbl">DURUM:</span>
                    {CONDITIONS.map((c) => (
                      <button
                        type="button"
                        key={c}
                        className={`ks-cond-btn${c === row.cond ? ' is-active' : ''}`}
                        onClick={() => patchRow(row.id, { cond: c })}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button type="button" className="ks-addrow" onClick={addRow}>
                + Satır ekle
              </button>

              <div className="ks-drop">
                Ürün listenizi veya ekleri buraya sürükleyin (.pdf, .xls, .jpg — maks. 20MB)
              </div>

              <div className="ks-drawer-fields">
                <input placeholder="Ad Soyad / Firma" />
                <input placeholder="E-posta veya telefon" />
              </div>

              <div className="ks-drawer-steps">
                <div><b>1.</b> Hızlı talep için bilgilerinizi girin</div>
                <div><b>2.</b> Müşteri temsilciniz aynı gün dönüş yapar</div>
                <div><b>3.</b> Siparişinizi kapınıza kadar biz takip ederiz</div>
              </div>
            </div>
            <div className="ks-drawer-foot">
              <button type="button" className="ks-drawer-submit" onClick={submitQuote}>
                TEKLİF TALEBİ GÖNDER
              </button>
            </div>
          </>
        ) : (
          <div className="ks-drawer-done">
            <div className="ks-done-check">✓</div>
            <div className="ks-done-title">TEŞEKKÜRLER!</div>
            <div className="ks-done-text">
              En zor kısmı hallettiniz. Temsilciniz en kısa sürede teklifinizle dönüş yapacak.
            </div>
            <button type="button" className="ks-done-btn" onClick={resetQuote}>
              ALIŞVERİŞE DEVAM ET
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
