import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container answer-page">
      <h1 className="question-title">Sayfa bulunamadı</h1>
      <p className="hero" style={{ padding: 0, textAlign: 'left', color: 'var(--muted)' }}>
        Aradığınız soru bulunamadı veya cevap üretilemedi.
      </p>
      <Link href="/" className="btn btn-ghost" style={{ display: 'inline-block', marginTop: 12 }}>
        ← Ana sayfaya dön
      </Link>
    </div>
  );
}
