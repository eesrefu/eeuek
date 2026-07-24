import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: "'Barlow', system-ui, sans-serif",
        color: '#172033',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <div style={{ font: "700 40px 'Barlow Condensed', sans-serif", letterSpacing: '.04em' }}>
        SAYFA BULUNAMADI
      </div>
      <p style={{ color: '#5b6675', margin: 0 }}>
        Aradığınız sayfa taşınmış veya kaldırılmış olabilir.
      </p>
      <Link
        href="/"
        style={{
          background: '#ffc400',
          color: '#0f1b2d',
          font: "600 14px 'Barlow', sans-serif",
          letterSpacing: '.06em',
          padding: '13px 26px',
          textDecoration: 'none',
        }}
      >
        ← ANA SAYFAYA DÖN
      </Link>
    </div>
  );
}
