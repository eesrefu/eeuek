'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBox() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    const q = question.trim();
    if (!q || loading) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
      }
      router.push(`/soru/${data.slug}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit(e);
    }
  }

  return (
    <form className="ks-ask" onSubmit={submit}>
      <div className="ks-ask-box">
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Örn: Pano kliması seçerken nelere dikkat edilmeli?"
          aria-label="Soru"
          maxLength={500}
          className="ks-ask-input"
        />
        <button type="submit" className="ks-ask-btn" disabled={loading || !question.trim()}>
          {loading ? <span className="ks-spin" aria-hidden="true" /> : 'SOR'}
        </button>
      </div>
      {error && (
        <div className="ks-ask-error" role="alert">
          {error}
        </div>
      )}
      <p className="ks-ask-hint">
        Cevaplar yalnızca yüklenen teknik dokümanlara dayanır ve kaynak gösterir.
      </p>
    </form>
  );
}
