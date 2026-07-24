import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { askKlimaSun } from '@/lib/gemini';
import { deslugify } from '@/lib/slug';
import { getQA, saveQA } from '@/lib/store';
import Citations from '@/app/components/Citations';
import Markdown from '@/app/components/Markdown';

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="ks-crumb-bar">
        <div className="ks-wrap">
          <Link href="/">Ana Sayfa</Link> / <Link href="/asistan">Asistan</Link> /{' '}
          <span className="ks-crumb-cur">{qa.question}</span>
        </div>
      </div>

      <article className="ks-wrap ks-answer-wrap">
        <Link href="/asistan" className="ks-answer-back">← Yeni soru sor</Link>
        <h1 className="ks-answer-title">{qa.question}</h1>
        <div className="ks-answer-card">
          <div className="ks-answer-meta">
            <span className="ks-badge stok">❄️ KlimaSun</span>
            <span>Yüklenen dokümanlara dayalı cevap</span>
          </div>
          <div className="answer-body">
            <Markdown>{qa.answer}</Markdown>
          </div>
          <Citations citations={qa.citations} />
        </div>

        <div className="ks-answer-cta">
          <div>
            <div className="t">Başka bir sorunuz mu var?</div>
            <p>Aradığınız ürünü bulamadıysanız hızlı teklif formuyla parça kodunu gönderin.</p>
          </div>
          <Link href="/asistan" className="ks-answer-ask">YENİ SORU SOR →</Link>
        </div>
      </article>
    </>
  );
}
