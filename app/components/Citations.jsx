export default function Citations({ citations }) {
  if (!citations || citations.length === 0) return null;
  return (
    <div className="citations">
      <h2>Kaynaklar</h2>
      {citations.map((c, i) => (
        <div className="citation" key={`${c.title}-${c.page ?? i}`}>
          <div className="src">
            📄 {c.title}
            {c.page != null && <span className="pg"> · sayfa {c.page}</span>}
          </div>
          {c.text && <div className="snippet">“{c.text}”</div>}
        </div>
      ))}
    </div>
  );
}
