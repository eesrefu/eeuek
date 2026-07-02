// Soru-cevap kalıcı deposu.
// - KV_REST_API_URL + KV_REST_API_TOKEN tanımlıysa Vercel KV / Upstash Redis (REST) kullanılır.
// - Tanımlı değilse süreç-içi (ephemeral) bir Map'e düşer; uygulama yine çalışır,
//   ancak cevaplar her sunucu örneğinde yeniden üretilebilir.

const MEM = new Map();
// Vercel KV ve Upstash Marketplace entegrasyonlarının iki isimlendirmesini de destekle.
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_KV = Boolean(KV_URL && KV_TOKEN);

async function kv(command) {
  const res = await fetch(KV_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV hatası ${res.status}`);
  const data = await res.json();
  return data.result;
}

export async function getQA(slug) {
  if (!slug) return null;
  if (HAS_KV) {
    const raw = await kv(['GET', `qa:${slug}`]);
    return raw ? JSON.parse(raw) : null;
  }
  return MEM.get(slug) || null;
}

export async function saveQA(slug, record) {
  if (!slug) return;
  if (HAS_KV) {
    await kv(['SET', `qa:${slug}`, JSON.stringify(record)]);
    await kv(['LREM', 'qa:recent', '0', slug]);
    await kv(['LPUSH', 'qa:recent', slug]);
    await kv(['LTRIM', 'qa:recent', '0', '299']);
    return;
  }
  MEM.set(slug, record);
}

export async function recentSlugs(limit = 24) {
  if (HAS_KV) {
    const list = await kv(['LRANGE', 'qa:recent', '0', String(limit - 1)]);
    return Array.isArray(list) ? list : [];
  }
  return Array.from(MEM.keys()).slice(-limit).reverse();
}
