// Teklif talebi alma.
// KV (Vercel KV / Upstash) tanımlıysa kalıcı kaydeder; her durumda referans
// numarası üretir. E-posta entegrasyonu eklenene kadar talepler KV'de birikir.

import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/catalog';

export const runtime = 'nodejs';

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_KV = Boolean(KV_URL && KV_TOKEN);

async function kv(command) {
  const res = await fetch(KV_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV hatası ${res.status}`);
  return (await res.json()).result;
}

const EPOSTA_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek.' }, { status: 400 });
  }

  const musteri = body?.musteri || {};
  const ad = String(musteri.ad || '').trim().slice(0, 120);
  const firma = String(musteri.firma || '').trim().slice(0, 160);
  const eposta = String(musteri.eposta || '').trim().slice(0, 160);
  const telefon = String(musteri.telefon || '').trim().slice(0, 40);
  const not = String(musteri.not || '').trim().slice(0, 1000);

  if (!ad) return NextResponse.json({ error: 'Ad Soyad zorunludur.' }, { status: 400 });
  if (!EPOSTA_RE.test(eposta)) {
    return NextResponse.json({ error: 'Geçerli bir e-posta adresi girin.' }, { status: 400 });
  }

  const rawKalemler = Array.isArray(body?.kalemler) ? body.kalemler : [];
  const kalemler = rawKalemler
    .map((k) => {
      const p = getProduct(String(k?.slug || ''));
      const adet = Math.max(1, Math.min(999, Number(k?.adet) || 1));
      return p ? { slug: p.slug, ad: p.ad, kod: p.kod, adet } : null;
    })
    .filter(Boolean)
    .slice(0, 100);

  if (!kalemler.length) {
    return NextResponse.json({ error: 'Teklif sepetiniz boş.' }, { status: 400 });
  }

  const ref = `TK-${Date.now().toString(36).toUpperCase()}`;
  const kayit = {
    ref,
    tarih: new Date().toISOString(),
    musteri: { ad, firma, eposta, telefon, not },
    kalemler,
  };

  if (HAS_KV) {
    try {
      await kv(['SET', `teklif:${ref}`, JSON.stringify(kayit)]);
      await kv(['LPUSH', 'teklif:liste', ref]);
      await kv(['LTRIM', 'teklif:liste', '0', '999']);
    } catch {
      // KV geçici olarak erişilemez olsa bile müşteriyi bloke etme;
      // referans numarası yine üretilir ve yanıt döner.
    }
  }

  return NextResponse.json({ ok: true, ref });
}
