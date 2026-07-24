import { NextResponse } from 'next/server';
import { askKlimaSun, friendlyError } from '@/lib/gemini';
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
    const existing = await getQA(slug);
    if (existing) {
      return NextResponse.json({ slug, ...existing });
    }

    const { answer, citations } = await askKlimaSun(question);
    const record = { question, answer, citations, createdAt: new Date().toISOString() };
    await saveQA(slug, record);
    return NextResponse.json({ slug, ...record });
  } catch (err) {
    console.error('ask error:', err);
    const { status, message } = friendlyError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
