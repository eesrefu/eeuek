import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { askKlimaSun } from '@/lib/gemini';
import { deslugify } from '@/lib/slug';
import { getQA, saveQA } from '@/lib/store';
import Citations from '@/app/components/Citations';

// Sayfalar ilk ziyarette üretilir, ardından 24 saat boyunca önbellekten sunulur (ISR).
export const revalidate = 86400;
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

// generateMetadata ve sayfa bileşeni aynı render içinde tek bir Gemini çağrısı
// paylaşsın diye React cache ile memoize edilir.
const loadQA = cache(async (slug) => {
  const saved = await getQA(slug);
  if (saved) return saved;

  const question = deslugify(slug);
  if (!question) return null;

  try {
    const { answer, citations } = await askKlimaSun(question);
    if (!answer) return null;
    const record = { question, answer, citations, createdAt: new Date().toISOString() };
    await saveQA(slug, record);
    return record;
  } catch (err) {
    console.error('soru sayfası üretim hatası:', err);
    return null;
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const qa = await loadQA(slug);
  if (!qa) {
    return { title: 'Soru bulunamadı', robots: { index: false, follow: true } };
  }
  const description = qa.answer.replace(/\s+/g, ' ').trim().slice(0, 155);
  const url = `${SITE_URL}/soru/${slug}`;
  return {
    title: qa.question,
    description,
    alternates: { canonical: `/soru/${slug}` },
    openGraph: {
      type: 'article',
      title: `${qa.question} — KlimaSun`,
      description,
      url,
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary',
      title: `${qa.question} — KlimaSun`,
      description,
    },
  };
}

export default async function SoruPage({ params }) {
  const { slug } = await params;
  const qa = await loadQA(slug);
  if (!qa) notFound();

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: qa.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: qa.answer,
        },
      },
    ],
  };

  return (
    <article className="container answer-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Link href="/" className="back-link">
        ← Yeni soru sor
      </Link>
      <h1 className="question-title">{qa.question}</h1>
      <div className="answer-card">
        <div className="answer-meta">
          <span className="badge">❄️ KlimaSun</span>
          <span>Yüklenen dokümanlara dayalı cevap</span>
        </div>
        <div className="answer-body">{qa.answer}</div>
        <Citations citations={qa.citations} />
      </div>
    </article>
  );
}
