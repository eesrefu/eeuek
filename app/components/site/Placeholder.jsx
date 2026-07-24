// Prototip görsellerinin yerine geçen çizgili SVG placeholder.
// Gerçek ürün/blog görselleri hazır olduğunda bununla değiştirilebilir.
export default function Placeholder({ w = 300, h = 190, label, variant = '', style, className, onClick }) {
  const cls = ['ks-ph', variant, className].filter(Boolean).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={cls} style={style} onClick={onClick} role="img" aria-label={label}>
      <text x={w / 2} y={h / 2 + 4} textAnchor="middle">
        {label}
      </text>
    </svg>
  );
}
