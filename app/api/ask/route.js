import { NextResponse } from 'next/server';
import { askKlimaSun } from '@/lib/gemini';
import { slugify } from '@/lib/slug';
import { getQA, saveQA } from '@/lib/store';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  let question = (body?.question || '').toString().trim();
  if (!question) {
    return NextResponse.json({ error: 'Lütfen bir soru yazın.' }, { status: 400 });
  }
  if (question.length > 500) question = question.slice(0, 500);

  const slug = slugify(question) || 'soru';

  try {
    // Aynı soru daha önce sorulduysa hazır cevabı dön.
    const existing = await getQA(slug);
    if (existing) {
      return NextResponse.json({ slug, ...existing });
    }

    const { answer, citations } = await askKlimaSun(question);
    const record = {
      question,
      answer,
      citations,
      createdAt: new Date().toISOString(),
    };
    await saveQA(slug, record);
    return NextResponse.json({ slug, ...record });
  } catch (err) {
    console.error('ask error:', err);
    const { status, message } = friendlyError(err);
    // GEÇİCİ TEŞHİS: gerçek hata metnini de ekrana ver (sorun bulununca kaldırılacak).
    const detail = (err?.message || String(err) || '').replace(/\s+/g, ' ').slice(0, 400);
    return NextResponse.json({ error: `${message}\n\n[TEŞHİS] ${detail}` }, { status });
  }
}

// Gemini/SDK hatalarını kullanıcıya gösterilebilecek sade Türkçe mesajlara çevirir.
function friendlyError(err) {
  const raw = (err?.message || String(err) || '').toString();
  const code = err?.status || err?.code;
  const isRateLimit =
    code === 429 || /RESOURCE_EXHAUSTED|quota|rate.?limit|429/i.test(raw);
  if (isRateLimit) {
    return {
      status: 429,
      message:
        'Şu an çok fazla soru geliyor (ücretsiz kota dakikada 5 istek). ' +
        'Lütfen yaklaşık 1 dakika sonra tekrar deneyin.',
    };
  }
  if (/API key|API_KEY|PERMISSION_DENIED|unauthor/i.test(raw)) {
    return {
      status: 500,
      message: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.',
    };
  }
  return { status: 500, message: 'Cevap üretilemedi. Lütfen tekrar deneyin.' };
}
