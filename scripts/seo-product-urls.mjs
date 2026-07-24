#!/usr/bin/env node
/**
 * Ürün URL'lerini SEO uyumlu hale getirir:
 *   /urun/<slug>.html  ->  /urun/<ana-kategori>/<alt-kategori>/<slug>.html
 * (yol, ürünün birincil kategorisinden — products.json "pc" alanı — türetilir)
 *
 * Yaptıkları:
 *  1. Her ürün sayfasını kategorili yeni yoluna kopyalar (linkleri kök-göreli yapar,
 *     canonical/og/JSON-LD URL'lerini ve breadcrumb'ları kategori hiyerarşisine çevirir).
 *  2. Eski düz dosyayı yeni adrese işaret eden 301 stub'ına (meta refresh + canonical) çevirir.
 *  3. urun/ dışındaki tüm HTML'lerde (kök, kategori/, marka/, blog/) ürün linklerini günceller.
 *  4. sitemap.xml'i yeni URL'lerle yeniler.
 *  5. Platformdan bağımsız redirect-map-urun.csv üretir (eski statik URL -> canlı
 *     Next.js kanonik adresi). Canlı sitede yönlendirmeyi app/(site)/urun/[...path]
 *     rotası çalışma anında yapar; bu CSV yalnızca dış içe aktarımlar içindir.
 *
 * Not: klimasun-2026/ statik kopyası artık canlı sitede servis edilmez (site,
 * OpenNext ile Cloudflare Workers'ta çalışan Next.js uygulamasıdır); bu script
 * yalnızca statik kopya bir yerde yayınlanırsa diye bakımlı tutulur.
 *
 * Tekrar çalıştırılabilir: stub'a çevrilmiş dosyalar (<!--ks-redirect--> işaretli) atlanır.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.argv[2] || path.join(HERE, '..', 'klimasun-2026');
const HOST = 'https://klimasun.com';
const STUB_MARK = '<!--ks-redirect-->';
const TODAY = new Date().toISOString().slice(0, 10);
const OLD_V = '?v=202607100158';
const NEW_V = '?v=' + TODAY.replace(/-/g, '') + '0001';

const products = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'products.json'), 'utf8'));
const catData = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'categories.json'), 'utf8'));

const esc = s => ('' + (s == null ? '' : s)).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pretty = slug => slug.split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');

// Kategori adları
const parentName = {}, childName = {};
for (const p of catData.tree || []) {
  parentName[p.slug] = p.name;
  for (const c of p.children || []) childName[c.slug] = c.name;
}

// slug -> yeni göreli yol (urun/parent/child/slug.html) + breadcrumb bilgisi
const map = new Map();
for (const p of products) {
  const i = p.pc.indexOf('--');
  if (i <= 0) { console.warn('pc formatı beklenmedik, atlandı:', p.s, p.pc); continue; }
  const parent = p.pc.slice(0, i), child = p.pc.slice(i + 2);
  map.set(p.s, {
    rel: `urun/${parent}/${child}/${p.s}.html`,
    parent, child, pc: p.pc,
    parentName: parentName[parent] || pretty(parent),
    childName: childName[p.pc] || pretty(child),
    name: p.n, brand: p.b || '', brandName: p.bn || ''
  });
}

const newRel = s => (map.get(s) || {}).rel;
// Göreli/mutlak ürün linki değiştiriciler
const relLink = (html) => html.replace(/((?:href|src)=")((?:\.\.\/)?)urun\/([a-z0-9-]+)\.html/g,
  (m, pre, dots, s) => newRel(s) ? pre + dots + newRel(s) : m);
const absLink = (html) => html.replace(/(https:\/\/klimasun\.com\/)urun\/([a-z0-9-]+)\.html/g,
  (m, pre, s) => newRel(s) ? pre + newRel(s) : m);

const stats = { moved: 0, stubbed: 0, skippedStub: 0, swept: 0, sweptChanged: 0, crumbMiss: 0 };

// ---------- 1) Ürün sayfalarını yeni yollarına üret ----------
for (const p of products) {
  const info = map.get(p.s);
  if (!info) continue;
  const oldFile = path.join(SITE, 'urun', p.s + '.html');
  let html = fs.readFileSync(oldFile, 'utf8');
  if (html.startsWith(STUB_MARK)) { stats.skippedStub++; continue; }

  const newAbs = `${HOST}/${info.rel}`;
  const parentHref = fs.existsSync(path.join(SITE, 'kategori', info.parent + '.html'))
    ? `/kategori/${info.parent}.html` : '/kategoriler.html';
  const childHref = `/kategori/${info.pc}.html`;

  // Breadcrumb JSON-LD: marka zinciri yerine kategori hiyerarşisi
  const bc = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: HOST + '/' },
      { '@type': 'ListItem', position: 2, name: info.parentName, item: HOST + parentHref },
      { '@type': 'ListItem', position: 3, name: info.childName, item: HOST + childHref },
      { '@type': 'ListItem', position: 4, name: info.name, item: newAbs }
    ]
  });
  const bcRe = /<script type="application\/ld\+json">\{"@context": "https:\/\/schema\.org", "@type": "BreadcrumbList"[\s\S]*?<\/script>/;
  if (bcRe.test(html)) html = html.replace(bcRe, `<script type="application/ld+json">${bc}</script>`);
  else stats.crumbMiss++;

  // Görünür breadcrumb
  const crumb = `<nav class="crumb" aria-label="breadcrumb"><a href="/index.html">Ana Sayfa</a> / <a href="${parentHref}">${esc(info.parentName)}</a> / <a href="${childHref}">${esc(info.childName)}</a> / ${esc(info.name)}</nav>`;
  html = html.replace(/<nav class="crumb"[\s\S]*?<\/nav>/, crumb);

  // Marka adını marka sayfasına linkle (breadcrumb'dan çıkan marka linkinin yerine)
  if (info.brand && fs.existsSync(path.join(SITE, 'marka', info.brand + '.html'))) {
    html = html.replace(/<div class="kick">([^<]*)<\/div>/,
      (m, t) => `<div class="kick"><a href="/marka/${info.brand}.html">${t}</a></div>`);
  }

  html = relLink(html);                                        // ../urun/x.html -> ../urun/p/c/x.html
  html = html.replace(/((?:href|src)=")\.\.\//g, '$1/');       // kalan ../ -> kök-göreli
  html = absLink(html);                                        // mutlak URL'ler (canonical, og, JSON-LD)
  html = html.split(OLD_V).join(NEW_V);

  const newFile = path.join(SITE, info.rel);
  fs.mkdirSync(path.dirname(newFile), { recursive: true });
  fs.writeFileSync(newFile, html);
  stats.moved++;
}

// ---------- 2) Eski düz dosyaları 301 stub'a çevir ----------
for (const p of products) {
  const info = map.get(p.s);
  if (!info) continue;
  const oldFile = path.join(SITE, 'urun', p.s + '.html');
  const cur = fs.readFileSync(oldFile, 'utf8');
  if (cur.startsWith(STUB_MARK)) continue;
  const newAbs = `${HOST}/${info.rel}`;
  fs.writeFileSync(oldFile,
    `${STUB_MARK}<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>${esc(info.name)} — Klimasun</title>` +
    `<link rel="canonical" href="${newAbs}"><meta http-equiv="refresh" content="0;url=${newAbs}">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1"></head><body>` +
    `<script>location.replace("${newAbs}");</script>` +
    `<p>Bu ürünün adresi değişti: <a href="${newAbs}">${esc(info.name)}</a></p></body></html>`);
  stats.stubbed++;
}

// ---------- 3) urun/ dışındaki tüm HTML'lerde linkleri güncelle ----------
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  if (e.isDirectory()) return (e.name === 'urun' || e.name === 'assets') ? [] : walk(full);
  return e.name.endsWith('.html') ? [full] : [];
});
for (const file of walk(SITE)) {
  const before = fs.readFileSync(file, 'utf8');
  let after = absLink(relLink(before));
  after = after.split(OLD_V).join(NEW_V);
  stats.swept++;
  if (after !== before) { fs.writeFileSync(file, after); stats.sweptChanged++; }
}

// ---------- 4) sitemap.xml ----------
const smFile = path.join(SITE, 'sitemap.xml');
let sm = fs.readFileSync(smFile, 'utf8');
sm = sm.replace(/(<url><loc>https:\/\/klimasun\.com\/)urun\/([a-z0-9-]+)\.html(<\/loc>)(<lastmod>[0-9-]+<\/lastmod>)?/g,
  (m, pre, s, locEnd, lm) => newRel(s) ? pre + newRel(s) + locEnd + (lm ? `<lastmod>${TODAY}</lastmod>` : '') : m);
fs.writeFileSync(smFile, sm);

// ---------- 5) redirect-map CSV (eski statik URL -> canlı kanonik adres) ----------
const csv = ['eski_url,yeni_url'];
for (const p of products) {
  const info = map.get(p.s);
  if (!info) continue;
  csv.push(`${HOST}/urun/${p.s}.html,${HOST}/urun/${info.parent}/${info.child}/${p.s}`);
}
fs.writeFileSync(path.join(HERE, '..', 'redirect-map-urun.csv'), csv.join('\n') + '\n');

console.log(JSON.stringify(stats, null, 2));
console.log('yeni URL örneği:', `/${map.get(products[0].s).rel}`);
