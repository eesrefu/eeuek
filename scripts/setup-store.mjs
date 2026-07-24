#!/usr/bin/env node
/**
 * Gemini File Search kurulum scripti.
 *
 *  1. Bir Gemini File Search Store oluşturur (veya var olanı yeniden kullanır).
 *  2. Belge klasörlerindeki tüm PDF ve DOCX dosyalarını yükleyip indeksler:
 *       - dokumanlar/
 *       - klimasun-2026/assets/docs/
 *  3. Store adını ekrana basar — bu satırı GEMINI_FILE_SEARCH_STORE olarak kaydedin.
 *
 * Yerelde çalıştırma (.env içinde GEMINI_API_KEY ile):
 *   npm run setup-store
 * CI / Actions'ta (ortam değişkeniyle):
 *   GEMINI_API_KEY=... node scripts/setup-store.mjs
 *
 * Var olan store'a ekleme (yeni store açmadan):
 *   GEMINI_FILE_SEARCH_STORE=fileSearchStores/... node scripts/setup-store.mjs
 */
import { GoogleGenAI } from '@google/genai';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

const STORE_DISPLAY_NAME = 'klimasun-dokumanlar';
const DOC_DIRS = ['dokumanlar', 'klimasun-2026/assets/docs'];
const ALLOWED_EXT = new Set(['.pdf', '.docx']);
const POLL_MS = 4000;

/** Bir klasörü alt klasörleriyle tarayıp PDF/DOCX yollarını döndürür. */
async function walkDocs(dir, baseDir) {
  let out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out = out.concat(await walkDocs(full, baseDir));
    } else if (ALLOWED_EXT.has(path.extname(entry.name).toLowerCase())) {
      out.push({ full, rel: path.relative(baseDir, full) });
    }
  }
  return out;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Var olan store'daki dokümanların displayName kümesini döndürür (idempotent yükleme için). */
async function existingDisplayNames(ai, storeName) {
  const names = new Set();
  try {
    const pager = await ai.fileSearchStores.documents.list({
      parent: storeName,
      config: { pageSize: 100 },
    });
    for await (const doc of pager) {
      if (doc?.displayName) names.add(doc.displayName);
    }
  } catch (err) {
    console.warn('! Var olan dokümanlar listelenemedi, tümü yeniden yüklenecek:', err?.message || err);
  }
  return names;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('HATA: GEMINI_API_KEY tanımlı değil (yerelde .env, CI\'da secret).');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  const existing = (process.env.GEMINI_FILE_SEARCH_STORE || '').trim();
  const rebuild = process.env.REBUILD === '1';
  let storeName;

  if (rebuild) {
    // Temiz yeniden kurulum: (varsa) eski store'u sil, sıfırdan yeni store oluştur.
    // Kopya/dolu store sorununu tek seferde giderir; skip mantığından bağımsızdır.
    if (existing) {
      console.log(`→ REBUILD: eski store siliniyor: ${existing}`);
      try {
        await ai.fileSearchStores.delete({ name: existing, config: { force: true } });
        console.log('✓ Eski store silindi (depolama boşaldı).');
      } catch (err) {
        console.warn('! Eski store silinemedi (yoksa sorun değil):', err?.message || err);
      }
    }
    console.log('→ Yeni File Search Store oluşturuluyor…');
    const store = await ai.fileSearchStores.create({ config: { displayName: STORE_DISPLAY_NAME } });
    storeName = store.name;
    console.log(`✓ Yeni store: ${storeName}`);
  } else if (existing) {
    // Var olan store'a ekleme (zaten yüklü olanlar atlanır).
    storeName = existing;
    console.log(`→ Var olan store kullanılıyor: ${storeName}`);
  } else {
    console.log('→ File Search Store oluşturuluyor…');
    const store = await ai.fileSearchStores.create({ config: { displayName: STORE_DISPLAY_NAME } });
    storeName = store.name;
    console.log(`✓ Store oluşturuldu: ${storeName}`);
  }

  const cwd = process.cwd();
  let files = [];
  for (const dir of DOC_DIRS) {
    const abs = path.resolve(cwd, dir);
    files = files.concat(await walkDocs(abs, cwd));
  }

  if (files.length === 0) {
    console.warn('! Belge klasörlerinde PDF/DOCX bulunamadı:', DOC_DIRS.join(', '));
  } else {
    console.log(`→ ${files.length} doküman bulundu (${DOC_DIRS.join(', ')}).`);
  }

  // Var olan store'a ekleme yapılıyorsa, zaten yüklü dokümanları atla (kopya olmasın).
  // Rebuild'de store yeni ve boş olduğundan listelemeye gerek yok.
  let already = new Set();
  if (existing && !rebuild) {
    already = await existingDisplayNames(ai, storeName);
    if (already.size) console.log(`→ Store'da zaten ${already.size} doküman var; bunlar atlanacak.`);
  }

  let okCount = 0;
  let failCount = 0;
  let skipCount = 0;
  for (const { full, rel } of files) {
    if (already.has(rel)) {
      skipCount++;
      continue;
    }
    process.stdout.write(`→ Yükleniyor: ${rel} `);
    try {
      let operation = await ai.fileSearchStores.uploadToFileSearchStore({
        file: full,
        fileSearchStoreName: storeName,
        config: { displayName: rel },
      });

      while (!operation.done) {
        await sleep(POLL_MS);
        operation = await ai.operations.get({ operation });
        process.stdout.write('.');
      }
      if (operation.error) {
        failCount++;
        console.log(` ✗ HATA: ${operation.error.message || JSON.stringify(operation.error)}`);
      } else {
        okCount++;
        console.log(' ✓ indekslendi');
      }
    } catch (err) {
      failCount++;
      console.log(` ✗ HATA: ${err?.message || err}`);
    }
  }

  console.log('\n========================================================');
  console.log(
    `BİTTİ. ${okCount} doküman indekslendi` +
      `${skipCount ? `, ${skipCount} zaten mevcut (atlandı)` : ''}` +
      `${failCount ? `, ${failCount} başarısız` : ''}.`,
  );
  console.log('Aşağıdaki değeri GEMINI_FILE_SEARCH_STORE olarak kaydedin');
  console.log('(GitHub repo secret + gerekiyorsa Cloudflare Worker secret):\n');
  console.log(`GEMINI_FILE_SEARCH_STORE=${storeName}`);
  console.log('========================================================');
}

main().catch((err) => {
  console.error('\nKurulum başarısız:', err?.message || err);
  process.exit(1);
});
