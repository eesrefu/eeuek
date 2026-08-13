// Katalog üretimi: klimasun-2026/data/* kaynaklarından site verisini üretir.
//   public/veri/katalog.json        — ürün listesi için ince indeks (istemci çeker)
//   public/veri/detay/N.json        — ürün detayları, slug hash'ine göre 64 parça
//   public/veri/kategoriler.json    — kategori ağacı (ad, slug, sayılar)
//   public/veri/kategori/SLUG.json  — kategori başına ürün indeksi
//   lib/catalog-slugs.json          — sitemap için ürün slug listesi
//   lib/category-slugs.json         — sitemap için kategori slug listesi
//   public/gorseller/               — klimasun-2026/assets/products kopyası (yoksa)
// `npm run build` ve `npm run deploy` öncesinde otomatik çalışır.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'klimasun-2026');
const SHARDS = 64;

// lib/catalog-server.js içindeki shardOf ile birebir aynı olmalı.
function shardOf(slug) {
  let h = 5381;
  for (let i = 0; i < slug.length; i++) h = ((h * 33) ^ slug.charCodeAt(i)) >>> 0;
  return h % SHARDS;
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const products = readJson(path.join(SRC, 'data/products.json'));
const categories = readJson(path.join(SRC, 'data/categories.json'));
const catFlat = categories.flat;
const catTree = categories.tree;

const catName = new Map(catFlat.map((c) => [c.slug, c.name]));
const gorsel = (p) => (p ? '/gorseller/' + p.replace(/^assets\/products\//, '') : '');
const isSecondHand = (p) =>
  p.dom === '2-el-urunler' || p.pc.startsWith('2-el') || p.cats.some((c) => c.startsWith('2-el'));
// SEO uyumlu ürün URL yolu: birincil kategori "ana--alt" -> "ana/alt"
// (lib/purl.js bununla /urun/<ana>/<alt>/<slug> adresini kurar).
const pcPath = (p) => (p.pc || '').replace('--', '/');

// --- 1) Liste indeksi: [slug, kod, ad, marka, 2.el(0/1), stok(0/1), küçük görsel, kategoriYolu, fiyat]
// fiyat: [satış, liste] (EUR) — yalnızca Zoho fiyatı olan stoklu üründe; yoksa 0.
// Not: Zoho'nun teklif/fatura/alış/son-hareket bilgileri hiçbir yere yazılmaz; sadece fiyat.
const asItem = (p) => [
  p.s,
  p.c,
  p.n,
  p.bn,
  isSecondHand(p) ? 1 : 0,
  p.st === 'Stokta' ? 1 : 0,
  gorsel(p.th),
  pcPath(p),
  p.prc ? [p.prc.sale, p.prc.list || 0, p.prc.cur || 'EUR', p.prc.kdv ? 1 : 0] : 0,
];
const items = products.map(asItem);

// Marka sayıları GERÇEK ürün etiketinden (bn) hesaplanır; böylece marka
// kartındaki sayı ile filtre sonucu birebir aynı olur. Çoktan aza sıralı.
const brandCount = new Map();
for (const p of products) {
  if (p.bn) brandCount.set(p.bn, (brandCount.get(p.bn) || 0) + 1);
}
const brandList = [...brandCount.entries()].sort(
  (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'tr'),
);

// Markalar sayfasında yalnızca onaylı (anlaşmalı) markalar gösterilir; telif/marka
// riskini önlemek için geri kalanlar sayfada listelenmez. Ürünler etkilenmez —
// katalog.json ve ürün araması gerçek marka etiketini (bn) korur, bu yüzden tüm
// ürünler ürün listesinde ve AI aramasında çıkmaya devam eder.
// Liste boşsa (veya dosya yoksa) tüm markalar gösterilir (güvenli varsayılan).
let visibleBrands = brandList;
try {
  const allow = readJson(path.join(ROOT, 'lib/visible-brands.json'));
  if (Array.isArray(allow) && allow.length) {
    const allowSet = new Set(allow);
    visibleBrands = brandList.filter(([bn]) => allowSet.has(bn));
  }
} catch {
  // lib/visible-brands.json yoksa: tüm markaları göster.
}

const katalog = {
  count: products.length,
  brands: brandList,
  items,
};

const veriDir = path.join(ROOT, 'public/veri');
fs.mkdirSync(path.join(veriDir, 'detay'), { recursive: true });
fs.writeFileSync(path.join(veriDir, 'katalog.json'), JSON.stringify(katalog));
// Markalar sayfası için küçük, sunucuda okunabilen liste (yalnızca onaylı markalar).
fs.writeFileSync(path.join(veriDir, 'markalar.json'), JSON.stringify(visibleBrands));

// --- 2) Detay parçaları (aynı ana kategorideki komşular "benzer ürünler" olur)
const byPc = new Map();
products.forEach((p, i) => {
  if (!byPc.has(p.pc)) byPc.set(p.pc, []);
  byPc.get(p.pc).push(i);
});

const shards = Array.from({ length: SHARDS }, () => ({}));
for (const p of products) {
  const siblings = byPc.get(p.pc) || [];
  const at = siblings.findIndex((i) => products[i].s === p.s);
  const rel = [];
  for (let step = 1; rel.length < 4 && step <= siblings.length; step++) {
    const pick = siblings[(at + step) % siblings.length];
    const r = products[pick];
    if (r.s === p.s) break;
    rel.push({ s: r.s, c: r.c, n: r.n, th: gorsel(r.th), p: pcPath(r) });
  }
  shards[shardOf(p.s)][p.s] = {
    c: p.c,
    n: p.n,
    b: p.bn,
    path: pcPath(p),
    img: gorsel(p.img),
    imgs: Array.isArray(p.imgs) && p.imgs.length
      ? p.imgs.map((x) => ({ img: gorsel(x.img), th: gorsel(x.th) }))
      : null,
    desc: p.ld || p.sd || '',
    f: p.f || {},
    cat: catName.get(p.pc) || catName.get(p.cats[0]) || 'Ürünler',
    catSlug: catName.has(p.pc) ? p.pc : catName.has(p.cats[0]) ? p.cats[0] : '',
    cond: isSecondHand(p) ? '2.El' : 'Sıfır',
    stok: p.st === 'Stokta' ? 1 : 0,
    sq: p.sq || 0,
    prc: p.prc || null,
    rich: p.rich || null,
    mt: p.mt || '',
    md: p.md || '',
    rel,
  };
}
shards.forEach((s, i) => {
  fs.writeFileSync(path.join(veriDir, 'detay', `${i}.json`), JSON.stringify(s));
});

// --- 3) Kategori sayfaları: ağaç + kategori başına ürün indeksi
//     Ana kategori üyeliği: p.dom; alt kategori üyeliği: p.cats listesi.
const katDir = path.join(veriDir, 'kategori');
fs.mkdirSync(katDir, { recursive: true });

const itemsOf = (slug, isTop) =>
  products.filter((p) => (isTop ? p.dom === slug : p.cats.includes(slug))).map(asItem);

const tree = catTree.map((top) => {
  const topItems = itemsOf(top.slug, true);
  fs.writeFileSync(path.join(katDir, `${top.slug}.json`), JSON.stringify({ items: topItems }));
  const children = (top.children || []).map((ch) => {
    const chItems = itemsOf(ch.slug, false);
    fs.writeFileSync(path.join(katDir, `${ch.slug}.json`), JSON.stringify({ items: chItems }));
    return { slug: ch.slug, name: ch.name, count: chItems.length, ...(ch.intro ? { intro: ch.intro } : {}) };
  });
  return { slug: top.slug, name: top.name, count: topItems.length, ...(top.intro ? { intro: top.intro } : {}), children };
});
fs.writeFileSync(path.join(veriDir, 'kategoriler.json'), JSON.stringify(tree));

// --- 4) Sitemap yol listeleri (ürünler: "ana-kategori/alt-kategori/slug")
fs.writeFileSync(
  path.join(ROOT, 'lib/catalog-slugs.json'),
  JSON.stringify(products.map((p) => `${pcPath(p)}/${p.s}`)),
);
fs.writeFileSync(
  path.join(ROOT, 'lib/category-slugs.json'),
  JSON.stringify(tree.flatMap((t) => [t.slug, ...t.children.map((c) => c.slug)])),
);

// --- 5) Görseller (tek seferlik kopya; varsa dokunma)
const imgSrc = path.join(SRC, 'assets/products');
const imgDst = path.join(ROOT, 'public/gorseller');
if (!fs.existsSync(imgDst)) {
  console.log('Görseller kopyalanıyor (public/gorseller) — ilk seferde birkaç dakika sürebilir…');
  fs.cpSync(imgSrc, imgDst, { recursive: true });
}

console.log(
  `Katalog üretildi: ${products.length} ürün, ${brandList.length} marka, ` +
    `${tree.length} ana + ${tree.reduce((a, t) => a + t.children.length, 0)} alt kategori, ` +
    `${SHARDS} detay parçası.`,
);
