#!/usr/bin/env node
/** seo-product-urls.mjs sonrası tutarlılık doğrulaması. Hata bulursa exit 1. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.argv[2] || path.join(HERE, '..', 'klimasun-2026');
const HOST = 'https://klimasun.com';
const products = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'products.json'), 'utf8'));

const map = new Map();
for (const p of products) {
  const i = p.pc.indexOf('--');
  map.set(p.s, `urun/${p.pc.slice(0, i)}/${p.pc.slice(i + 2)}/${p.s}.html`);
}
const errors = [];
const err = m => { errors.push(m); if (errors.length < 20) console.error('HATA:', m); };

// 1) Yeni dosyalar mevcut, canonical doğru, "../ kalmamış, JSON-LD parse oluyor
let checked = 0, ldChecked = 0;
for (const [slug, rel] of map) {
  const f = path.join(SITE, rel);
  if (!fs.existsSync(f)) { err('yeni dosya yok: ' + rel); continue; }
  const html = fs.readFileSync(f, 'utf8');
  const want = `<link rel="canonical" href="${HOST}/${rel}">`;
  if (!html.includes(want)) err('canonical yanlış: ' + rel);
  if (html.includes('"../')) err('göreli ../ kalmış: ' + rel);
  if (!html.includes(`"og:url" content="${HOST}/${rel}"`)) err('og:url yanlış: ' + rel);
  checked++;
  if (checked % 37 === 0) { // örneklem: her JSON-LD bloğunu parse et
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { err('JSON-LD bozuk: ' + rel + ' — ' + e.message); }
    }
    ldChecked++;
  }
}

// 2) Eski düz dosyalar stub olmuş ve doğru yere işaret ediyor
let stubs = 0;
for (const [slug, rel] of map) {
  const f = path.join(SITE, 'urun', slug + '.html');
  const html = fs.readFileSync(f, 'utf8');
  if (!html.startsWith('<!--ks-redirect-->')) { err('stub değil: ' + slug); continue; }
  if (!html.includes(`0;url=${HOST}/${rel}`)) err('stub hedefi yanlış: ' + slug);
  stubs++;
}

// 3) Hiçbir HTML'de (stub'lar hariç) eski düz ürün linki kalmamış olmalı
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === 'assets' ? [] : walk(full);
  return e.name.endsWith('.html') ? [full] : [];
});
let flatLinks = 0;
for (const f of walk(SITE)) {
  const html = fs.readFileSync(f, 'utf8');
  if (html.startsWith('<!--ks-redirect-->')) continue;
  for (const m of html.matchAll(/(?:href="(?:\.\.\/)?|https:\/\/klimasun\.com\/)urun\/([a-z0-9-]+)\.html/g)) {
    if (map.has(m[1])) { flatLinks++; if (flatLinks < 10) err('düz link kalmış: ' + f + ' -> ' + m[1]); }
  }
}

// 4) HTML'lerdeki tüm yerel urun/ linkleri gerçek dosyaya çözülüyor mu
// (ölü link temizliği sonrası her kırık link hatadır)
let deadLinks = 0, urunLinks = 0;
for (const f of walk(SITE)) {
  const html = fs.readFileSync(f, 'utf8');
  if (html.startsWith('<!--ks-redirect-->')) continue;
  for (const m of html.matchAll(/href="((?:\.\.\/|\/)?urun\/[^"?#]+\.html)/g)) {
    urunLinks++;
    const rel = m[1].replace(/^(\.\.\/|\/)/, '');
    if (!fs.existsSync(path.join(SITE, rel))) { deadLinks++; if (deadLinks < 10) err('kırık link: ' + f + ' -> ' + m[1]); }
  }
  // mutlak URL'ler (JSON-LD ItemList vb.) de dosyaya çözülmeli
  for (const m of html.matchAll(/https:\/\/klimasun\.com\/(urun\/[^"<\s?#]+\.html)/g)) {
    if (!fs.existsSync(path.join(SITE, m[1]))) { deadLinks++; if (deadLinks < 10) err('kırık mutlak link: ' + f + ' -> ' + m[1]); }
  }
}

// 5) sitemap: düz ürün URL'si kalmamalı, tüm locler dosyaya çözülmeli
const sm = fs.readFileSync(path.join(SITE, 'sitemap.xml'), 'utf8');
let smFlat = 0, smDead = 0, smProd = 0;
for (const m of sm.matchAll(/<loc>https:\/\/klimasun\.com\/(urun\/[^<]+)<\/loc>/g)) {
  const rel = m[1];
  const flat = rel.match(/^urun\/([a-z0-9-]+)\.html$/);
  if (flat && map.has(flat[1])) { smFlat++; continue; }
  smProd++;
  if (!fs.existsSync(path.join(SITE, rel))) { smDead++; if (smDead < 5) err('sitemap kırık: ' + rel); }
}
if (smFlat) err(`sitemap'te ${smFlat} düz ürün URL'si kalmış`);

// 6) Next.js kategori yönlendirme haritası: her kayıt statik kopyada stub olmalı
const kmap = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'lib', 'kategori-redirects.json'), 'utf8'));
for (const slug of Object.keys(kmap)) {
  const f = path.join(SITE, 'kategori', slug + '.html');
  if (!fs.existsSync(f) || !fs.readFileSync(f, 'utf8').startsWith('<!--ks-redirect-->')) err('kategori stub değil: ' + slug);
}

console.log(JSON.stringify({
  urun: map.size, yeniSayfaOK: checked, stubOK: stubs, ldParseOrneklem: ldChecked,
  duzLinkKalan: flatLinks, urunLinkToplam: urunLinks, kirikLink: deadLinks,
  sitemapUrunLoc: smProd, kategoriYonlendirme: Object.keys(kmap).length, hata: errors.length
}, null, 2));
process.exit(errors.length ? 1 : 0);
