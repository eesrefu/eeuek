// Soru-cevap kalıcı deposu. Üç arka uç, öncelik sırasıyla denenir:
//   1. Cloudflare KV binding (QA_KV)      — Workers'ta tercih edilen kalıcı depo.
//   2. Vercel KV / Upstash Redis (REST)   — KV_REST_API_URL + KV_REST_API_TOKEN tanımlıysa.
//   3. Süreç-içi Map (ephemeral)          — hiçbiri yoksa; uygulama yine çalışır ama
//                                            cevaplar örnekler arası kalıcı olmaz.
// Not: Cloudflare Workers'ta her istek ayrı/kısa ömürlü isolate'te çalışabildiği için
// (3) neredeyse hiç tutmaz; kalıcı önbellek için (1) veya (2) gerekir.

const MEM = new Map();

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const HAS_REST_KV = Boolean(KV_URL && KV_TOKEN);

const RECENT_KEY = 'qa:recent';
const RECENT_MAX = 300;

// --- Cloudflare KV binding erişimi (yalnızca Workers runtime'ında mevcut) ----
async function cfKV() {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    return env?.QA_KV || null;
  } catch {
    return null;
  }
}

// --- Vercel KV / Upstash Redis (REST) ---------------------------------------
async function rest(command) {
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

  const kv = await cfKV();
  if (kv) {
    const raw = await kv.get(`qa:${slug}`);
    return raw ? JSON.parse(raw) : null;
  }

  if (HAS_REST_KV) {
    const raw = await rest(['GET', `qa:${slug}`]);
    return raw ? JSON.parse(raw) : null;
  }

  return MEM.get(slug) || null;
}

export async function saveQA(slug, record) {
  if (!slug) return;

  const kv = await cfKV();
  if (kv) {
    await kv.put(`qa:${slug}`, JSON.stringify(record));
    // Cloudflare KV'de liste tipi yok; son sorulan slug'ları JSON dizide tutarız.
    let recent = [];
    try {
      const raw = await kv.get(RECENT_KEY);
      if (raw) recent = JSON.parse(raw);
    } catch {
      recent = [];
    }
    recent = [slug, ...recent.filter((s) => s !== slug)].slice(0, RECENT_MAX);
    await kv.put(RECENT_KEY, JSON.stringify(recent));
    return;
  }

  if (HAS_REST_KV) {
    await rest(['SET', `qa:${slug}`, JSON.stringify(record)]);
    await rest(['LREM', RECENT_KEY, '0', slug]);
    await rest(['LPUSH', RECENT_KEY, slug]);
    await rest(['LTRIM', RECENT_KEY, '0', String(RECENT_MAX - 1)]);
    return;
  }

  MEM.set(slug, record);
}

export async function recentSlugs(limit = 24) {
  const kv = await cfKV();
  if (kv) {
    const raw = await kv.get(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.slice(0, limit) : [];
  }

  if (HAS_REST_KV) {
    const list = await rest(['LRANGE', RECENT_KEY, '0', String(limit - 1)]);
    return Array.isArray(list) ? list : [];
  }

  return Array.from(MEM.keys()).slice(-limit).reverse();
}
