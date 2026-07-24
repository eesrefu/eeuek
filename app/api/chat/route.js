import { NextResponse } from 'next/server';
import { chatKlimaSun, friendlyError } from '@/lib/gemini';

export const runtime = 'nodejs';
export const maxDuration = 60;

// Çok turlu sohbet ucu. Gövde: { messages: [{ role:'user'|'assistant', text }] }
// Sohbet bağlama özeldir; önbelleğe alınmaz (her tur canlı Gemini çağrısı).
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const raw = Array.isArray(body?.messages) ? body.messages : [];
  // Temizle: yalnızca metinli mesajlar, son 12 tur, her mesaj en fazla 2000 karakter.
  const messages = raw
    .filter((m) => m && typeof m.text === 'string' && m.text.trim())
    .slice(-12)
    .map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      text: m.text.trim().slice(0, 2000),
    }));

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return NextResponse.json({ error: 'Lütfen bir mesaj yazın.' }, { status: 400 });
  }

  try {
    const { answer, citations } = await chatKlimaSun(messages);
    return NextResponse.json({ answer, citations });
  } catch (err) {
    console.error('chat error:', err);
    const { status, message } = friendlyError(err);
    return NextResponse.json({ error: message }, { status });
  }
}
