// Katalog verisine sunucu tarafı erişim (ürün detayı + kategori ağacı).
// Veri public/veri/ altındaki statik JSON dosyalarında durur.
// - Build / `next dev` / `next start`: dosya sisteminden okunur.
// - Cloudflare Workers: ASSETS binding'i üzerinden statik varlık olarak çekilir.

const SHARDS = 64;
const cache = new Map();

// scripts/build-catalog.mjs içindeki shardOf ile birebir aynı olmalı.
function shardOf(slug) {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h * 33) ^ slug.charCodeAt(i)) >>> 0;
  return h % SHARDS;
}

// relPath: "veri/..." — public/ köküne göre yol.
async function loadAsset(relPath) {
  if (cache.has(relPath)) return cache.get(relPath);
  let data;
  try {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    data = JSON.parse(readFileSync(join(process.cwd(), 'public', relPath), 'utf8'));
  } catch {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = getCloudflareContext();
    const res = await env.ASSETS.fetch(`https://assets.local/${relPath}`);
    if (!res.ok) throw new Error(`Varlık okunamadı: ${relPath} (${res.status})`);
    data = await res.json();
  }
  cache.set(relPath, data);
  return data;
}

export async function getProduct(slug) {
  if (!slug) return null;
  const shard = await loadAsset(`veri/detay/${shardOf(slug)}.json`);
  return shard[slug] || null;
}

// Kategori ağacı: [{slug, name, count, children: [{slug, name, count}]}]
export async function getCategoryTree() {
  return loadAsset('veri/kategoriler.json');
}

// Marka listesi: [[ad, sayı], ...] (çoktan aza sıralı).
export async function getBrands() {
  return loadAsset('veri/markalar.json');
}

// Slug ana ya da alt kategori olabilir; bulunursa üst kategorisiyle döner.
export async function findCategory(slug) {
  if (!slug) return null;
  const tree = await getCategoryTree();
  for (const top of tree) {
    if (top.slug === slug) return { ...top, parent: null };
    const child = top.children.find((c) => c.slug === slug);
    if (child) return { ...child, children: [], parent: { slug: top.slug, name: top.name } };
  }
  return null;
}
