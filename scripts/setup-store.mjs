#!/usr/bin/env node
/**
 * Tek seferlik kurulum scripti.
 *
 *  1. Bir Gemini File Search Store oluşturur.
 *  2. /dokumanlar klasöründeki tüm PDF ve DOCX dosyalarını yükleyip indeksler.
 *  3. Store adını ekrana basar — bu satırı .env dosyanıza ekleyin.
 *
 * Çalıştırma:
 *   npm run setup-store
 * (Bu komut `node --env-file=.env scripts/setup-store.mjs` çalıştırır.)
 */
import { GoogleGenAI } from '@google/genai';
import { readdir } from 'node:fs/promises';
import path from 'node:path';

/** dokumanlar/ klasörünü alt klasörleriyle birlikte tarayıp PDF/DOCX yollarını döndürür. */
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

const STORE_DISPLAY_NAME = 'klimasun-dokumanlar';
const DOCS_DIR = path.resolve(process.cwd(), 'dokumanlar');
const ALLOWED_EXT = new Set(['.pdf', '.docx']);
const POLL_MS = 4000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('HATA: GEMINI_API_KEY tanımlı değil. .env dosyanızı kontrol edin.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  console.log('→ File Search Store oluşturuluyor…');
  const store = await ai.fileSearchStores.create({
    config: { displayName: STORE_DISPLAY_NAME },
  });
  console.log(`✓ Store oluşturuldu: ${store.name}`);

  const files = await walkDocs(DOCS_DIR, DOCS_DIR);

  if (files.length === 0) {
    console.warn('! dokumanlar/ içinde (alt klasörler dahil) PDF veya DOCX bulunamadı.');
    console.warn('  Dosyaları ekleyip scripti tekrar çalıştırabilir ya da');
    console.warn('  aşağıdaki store adını şimdiden .env dosyanıza ekleyebilirsiniz.');
  } else {
    console.log(`→ ${files.length} doküman bulundu (alt klasörler dahil).`);
  }

  let okCount = 0;
  let failCount = 0;
  for (const { full, rel } of files) {
    process.stdout.write(`→ Yükleniyor: ${rel} `);
    let operation = await ai.fileSearchStores.uploadToFileSearchStore({
      file: full,
      fileSearchStoreName: store.name,
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
  }

  console.log('\n========================================================');
  console.log(`BİTTİ. ${okCount} doküman indekslendi${failCount ? `, ${failCount} başarısız` : ''}.`);
  console.log('Aşağıdaki satırı .env dosyanıza ekleyin:\n');
  console.log(`GEMINI_FILE_SEARCH_STORE=${store.name}`);
  console.log('\nVercel kullanıyorsanız aynı değeri Environment Variables');
  console.log('bölümüne de ekleyin.');
  console.log('========================================================');
}

main().catch((err) => {
  console.error('\nKurulum başarısız:', err?.message || err);
  process.exit(1);
});
