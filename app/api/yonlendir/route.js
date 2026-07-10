// Yapay zekâ ürün yönlendirme.
// GEMINI_API_KEY tanımlıysa Gemini ile; değilse (veya hata olursa) yerel
// anahtar kelime skorlama ile müşteriyi katalogda doğru ürünlere yönlendirir.

import { NextResponse } from 'next/server';
import { PRODUCTS, SEGMENTS, TYPES, getProduct, scoreProducts } from '@/lib/catalog';
import { getClient, MODEL } from '@/lib/gemini';

export const runtime = 'nodejs';

const YONLENDIR_PROMPT =
  "Sen KlimaSun'un ürün yönlendirme asistanısın. Görevin: müşterinin ihtiyacını anlayıp " +
  'aşağıdaki katalogdan EN uygun ürünleri seçmek. Sadece katalogdaki slug değerlerini kullan, ' +
  'uydurma. En fazla 4 ürün öner. mesaj alanında müşteriye 1-2 cümlelik samimi, Türkçe bir ' +
  'yönlendirme yaz (neden bu ürünleri önerdiğini söyle). Uygun ürün yoksa urunSluglari boş ' +
  'bırak ve mesaj alanında hangi kategoriye bakabileceğini söyle.';

function katalogOzeti() {
  return PRODUCTS.map(
    (p) =>
      `- slug: ${p.slug} | ${p.ad} | kategori: ${SEGMENTS[p.segment].label} | tip: ${TYPES[p.tip].label} | etiketler: ${p.etiketler.join(',')} | ${p.ozet}`
  ).join('\n');
}

function kategoriLinkleri(urunler) {
  const seen = new Set();
  const out = [];
  for (const u of urunler) {
    const key = `${u.segment}:${u.tip}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      href: `/katalog/${u.segment}?tip=${u.tip}`,
      label: `${SEGMENTS[u.segment].label} › ${TYPES[u.tip].plural}`,
    });
  }
  if (!out.length) out.push({ href: '/katalog', label: 'Tüm Katalog' });
  return out.slice(0, 3);
}

function fallback(ihtiyac) {
  const urunler = scoreProducts(ihtiyac, 4);
  const mesaj = urunler.length
    ? 'İhtiyacınıza göre katalogdan şu ürünleri öne çıkardım. Detaylara bakıp teklif sepetinize ekleyebilirsiniz.'
    : 'Tam eşleşen bir ürün bulamadım — aşağıdaki katalog bölümlerine göz atabilir veya ihtiyacınızı biraz daha ayrıntılı yazabilirsiniz.';
  return { mesaj, urunler, kategoriler: kategoriLinkleri(urunler), kaynak: 'yerel' };
}

async function geminiYonlendir(ihtiyac) {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Müşteri ihtiyacı: "${ihtiyac}"\n\nKATALOG:\n${katalogOzeti()}`,
    config: {
      systemInstruction: YONLENDIR_PROMPT,
      temperature: 0.3,
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          mesaj: { type: 'string' },
          urunSluglari: { type: 'array', items: { type: 'string' } },
        },
        required: ['mesaj', 'urunSluglari'],
      },
    },
  });

  const parsed = JSON.parse(response.text || '{}');
  const urunler = (parsed.urunSluglari || [])
    .map((slug) => getProduct(slug))
    .filter(Boolean)
    .slice(0, 4);

  // Model ürün seçemediyse yerel skorlamayla destekle.
  if (!urunler.length) {
    const yedek = scoreProducts(ihtiyac, 3);
    return {
      mesaj: parsed.mesaj || fallback(ihtiyac).mesaj,
      urunler: yedek,
      kategoriler: kategoriLinkleri(yedek),
      kaynak: 'gemini',
    };
  }

  return {
    mesaj: parsed.mesaj,
    urunler,
    kategoriler: kategoriLinkleri(urunler),
    kaynak: 'gemini',
  };
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const ihtiyac = String(body?.ihtiyac || '').trim().slice(0, 400);
  if (ihtiyac.length < 3) {
    return NextResponse.json({ error: 'Lütfen ihtiyacınızı birkaç kelimeyle yazın.' }, { status: 400 });
  }

  if (process.env.GEMINI_API_KEY) {
    try {
      const sonuc = await geminiYonlendir(ihtiyac);
      return NextResponse.json(sonuc);
    } catch {
      // Gemini kota/ağ hatası — yerel skorlamaya düş, kullanıcıyı bloke etme.
    }
  }
  return NextResponse.json(fallback(ihtiyac));
}
