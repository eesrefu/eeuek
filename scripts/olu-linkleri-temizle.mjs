#!/usr/bin/env node
/**
 * Katalogdan kaldırılmış ürünlere giden ölü linkleri temizler.
 *
 * Her kategori sayfası için:
 *  - Hedef dosyası olmayan ürün kartlarını ve JSON-LD ItemList kayıtlarını bulur.
 *  - Sayfanın katalogda hâlâ üyesi varsa (products.json'da pc/cats eşleşmesi):
 *    ölü kartları ve ItemList kayıtlarını ayıklar, pozisyonları/numberOfItems'ı
 *    ve "N Ürün" metinlerini düzeltir.
 *  - Katalogda hiç üyesi kalmamışsa (bayat/öksüz sayfa): sayfayı
 *    /kategoriler.html'e yönlendiren stub'a çevirir ve Next.js kategori
 *    rotasının kullandığı lib/kategori-redirects.json haritasına ekler.
 *
 * Tekrar çalıştırılabilir: stub'lar (<!--ks-redirect--> işaretli) atlanır.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = process.argv[2] || path.join(HERE, '..', 'klimasun-2026');
const HOST = 'https://klimasun.com';
const STUB_MARK = '<!--ks-redirect-->';

const products = JSON.parse(fs.readFileSync(path.join(SITE, 'data', 'products.json'), 'utf8'));
const memberCount = new Map(); // kategori slug -> katalogdaki üye sayısı
for (const p of products) {
  for (const c of new Set([p.pc, ...(p.cats || [])])) {
    if (c) memberCount.set(c, (memberCount.get(c) || 0) + 1);
  }
}
const esc = s => ('' + (s == null ? '' : s)).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const deadHref = rel => !fs.existsSync(path.join(SITE, rel));

/* pcard bloklarını dengeli div taramasıyla ayıklar */
function stripDeadCards(html) {
  let out = '', i = 0, removed = 0;
  for (;;) {
    const s = html.indexOf('<div class="pcard">', i);
    if (s < 0) { out += html.slice(i); break; }
    const re = /<div\b|<\/div>/g;
    re.lastIndex = s;
    let depth = 0, e = -1, m;
    while ((m = re.exec(html))) {
      depth += m[0] === '</div>' ? -1 : 1;
      if (depth === 0) { e = re.lastIndex; break; }
    }
    if (e < 0) throw new Error('div dengesiz: pcard @' + s);
    const card = html.slice(s, e);
    const hm = card.match(/href="(?:\.\.\/|\/)?(urun\/[^"?#]+\.html)/);
    out += html.slice(i, s);
    if (hm && deadHref(hm[1])) removed++; else out += card;
    i = e;
  }
  return { html: out, removed };
}

/* JSON-LD ItemList'ten ölü url'li ListItem'ları çıkarır, pozisyonları yeniler */
function cleanItemList(html) {
  let removed = 0;
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (full, body) => {
    let data;
    try { data = JSON.parse(body); } catch { return full; }
    const list = data['@type'] === 'ItemList' ? data
      : (data.mainEntity && data.mainEntity['@type'] === 'ItemList' ? data.mainEntity : null);
    if (!list || !Array.isArray(list.itemListElement)) return full;
    const before = list.itemListElement.length;
    list.itemListElement = list.itemListElement.filter(it => {
      const u = it.url || it.item || '';
      const m = ('' + u).match(/^https:\/\/klimasun\.com\/(urun\/.+\.html)$/);
      return !(m && deadHref(m[1]));
    });
    const gone = before - list.itemListElement.length;
    if (!gone) return full;
    removed += gone;
    list.itemListElement.forEach((it, i2) => { it.position = i2 + 1; });
    if (typeof list.numberOfItems === 'number') list.numberOfItems = Math.max(0, list.numberOfItems - gone);
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  });
  return { html, removed };
}

const stats = { incelenen: 0, temizlenen: 0, stublanan: 0, kartSilinen: 0, listItemSilinen: 0 };
const stubbed = [];

for (const name of fs.readdirSync(path.join(SITE, 'kategori')).filter(f => f.endsWith('.html'))) {
  const file = path.join(SITE, 'kategori', name);
  let html = fs.readFileSync(file, 'utf8');
  if (html.startsWith(STUB_MARK)) continue;
  stats.incelenen++;

  const slug = name.replace(/\.html$/, '');
  const cards = stripDeadCards(html);
  if (!cards.removed) continue;

  if ((memberCount.get(slug) || 0) === 0) {
    // Katalogda üyesi kalmamış bayat sayfa -> kategoriler.html'e yönlendir
    const target = `${HOST}/kategoriler.html`;
    fs.writeFileSync(file,
      `${STUB_MARK}<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8"><title>Kategoriler — Klimasun</title>` +
      `<link rel="canonical" href="${target}"><meta http-equiv="refresh" content="0;url=${target}">` +
      `<meta name="viewport" content="width=device-width, initial-scale=1"></head><body>` +
      `<script>location.replace("${target}");</script>` +
      `<p>Bu kategori artık mevcut değil: <a href="${target}">tüm kategoriler</a></p></body></html>`);
    stubbed.push(slug);
    stats.stublanan++;
    continue;
  }

  // Canlı sayfa: ölü kartları + ItemList kayıtlarını ayıkla, sayaçları düzelt
  html = cards.html;
  stats.kartSilinen += cards.removed;
  const li = cleanItemList(html);
  html = li.html;
  stats.listItemSilinen += li.removed;
  const mNoi = html.match(/"numberOfItems": ?(\d+)/);
  if (mNoi) {
    const yeni = Number(mNoi[1]);
    const eski = yeni + li.removed;
    if (li.removed > 0) html = html.replace(new RegExp(`\\b${eski} (Ürün|ürün)`, 'g'), `${yeni} $1`);
  }
  fs.writeFileSync(file, html);
  stats.temizlenen++;
}

// Next.js kategori rotasının yönlendirme haritası: bayat slug -> /kategoriler
const kmapFile = path.join(HERE, '..', 'lib', 'kategori-redirects.json');
const kmap = fs.existsSync(kmapFile) ? JSON.parse(fs.readFileSync(kmapFile, 'utf8')) : {};
for (const s of stubbed) kmap[s] = '/kategoriler';
fs.writeFileSync(kmapFile, JSON.stringify(kmap, null, 1) + '\n');

// Canlı sayfalardan stub'lanan kategorilere link kalmış mı?
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => {
  const full = path.join(dir, e.name);
  if (e.isDirectory()) return e.name === 'assets' ? [] : walk(full);
  return e.name.endsWith('.html') ? [full] : [];
});
let stubLink = 0;
const allStubbedCats = new Set(Object.keys(kmap));
for (const f of walk(SITE)) {
  const html = fs.readFileSync(f, 'utf8');
  if (html.startsWith(STUB_MARK)) continue;
  for (const m of html.matchAll(/href="(?:\.\.\/|\/)?kategori\/([a-z0-9-]+)\.html/g)) {
    if (allStubbedCats.has(m[1])) { stubLink++; console.error('stub kategoriye link:', f, '->', m[1]); }
  }
}

console.log(JSON.stringify({ ...stats, stubKategoriLinkKalan: stubLink, workerKategoriHarita: Object.keys(kmap).length }, null, 2));
if (stubLink > 0) process.exit(1);
