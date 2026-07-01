#!/usr/bin/env node
/**
 * Otomatik onarım aracı ("agent") — sen sadece API anahtarını girersin,
 * gerisini bu script kendisi halleder.
 *
 * Ne yapar:
 *   1. GEMINI_API_KEY'i ortamdan okur; yoksa güvenli şekilde (ekrana yazmadan)
 *      sorar. Anahtar hiçbir yere loglanmaz.
 *   2. Bu anahtarın gördüğü File Search Store'ları listeler.
 *   3. Hedef store (GEMINI_FILE_SEARCH_STORE) bu anahtarla erişilebiliyorsa →
 *      hiçbir şey yapmaz, kullanılacak değeri basar.
 *   4. Erişilemiyorsa (proje uyuşmazlığı): aynı anahtarın projesinde daha önce
 *      oluşturulmuş 'klimasun-dokumanlar' store'u varsa onu kullanır; yoksa
 *      dokumanlar/ klasörünü yükleyip YENİ store oluşturur.
 *   5. Sonuçtaki store adını .env dosyasına yazar ve Vercel'e koyacağın değeri
 *      ekrana basar.
 *
 * Çalıştırma:
 *   npm run fix-store
 */
import { GoogleGenAI } from '@google/genai';
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import path from 'node:path';

const STORE_DISPLAY_NAME = 'klimasun-dokumanlar';
const DOCS_DIR = path.resolve(process.cwd(), 'dokumanlar');
const ENV_PATH = path.resolve(process.cwd(), '.env');
const ALLOWED_EXT = new Set(['.pdf', '.docx']);
const POLL_MS = 4000;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** .env varsa okuyup process.env'de EKSİK olan anahtarları doldurur. */
async function loadDotEnv() {
  let content;
  try {
    content = await readFile(ENV_PATH, 'utf8');
  } catch {
    return;
  }
  for (const line of content.split('\n')) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].replace(/^["']|["']$/g, '');
    if (process.env[key] === undefined || process.env[key] === '') {
      process.env[key] = val;
    }
  }
}

/** getStoreName() ile aynı normalizasyon: tırnak/boşluk temizle, öneki tamamla. */
function normalizeStoreName(raw) {
  let name = (raw || '').trim().replace(/^["']|["']$/g, '');
  if (!name) return '';
  if (!name.startsWith('fileSearchStores/')) {
    name = `fileSearchStores/${name.replace(/^\/+/, '')}`;
  }
  return name;
}

/** Anahtarı ekrana yazmadan (maskeli) sorar. */
function promptSecret(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    const onData = (char) => {
      const s = char.toString();
      if (s === '\n' || s === '\r' || s === '') {
        process.stdin.removeListener('data', onData);
      } else {
        // Girilen karakterleri gizle.
        process.stdout.write('\x1b[2K\r' + question);
      }
    };
    process.stdin.on('data', onData);
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer.trim());
    });
  });
}

/** dokumanlar/ klasörünü alt klasörleriyle tarayıp PDF/DOCX yollarını döndürür. */
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

/** .env içindeki GEMINI_FILE_SEARCH_STORE satırını günceller ya da ekler. */
async function writeStoreToEnv(storeName) {
  let content = '';
  try {
    await access(ENV_PATH);
    content = await readFile(ENV_PATH, 'utf8');
  } catch {
    content = '';
  }
  const line = `GEMINI_FILE_SEARCH_STORE=${storeName}`;
  if (/^GEMINI_FILE_SEARCH_STORE=.*$/m.test(content)) {
    content = content.replace(/^GEMINI_FILE_SEARCH_STORE=.*$/m, line);
  } else {
    if (content && !content.endsWith('\n')) content += '\n';
    content += line + '\n';
  }
  await writeFile(ENV_PATH, content, 'utf8');
}

async function listStores(ai) {
  const stores = [];
  const pager = await ai.fileSearchStores.list();
  for await (const s of pager) stores.push(s);
  return stores;
}

async function uploadDocs(ai, storeName) {
  const files = await walkDocs(DOCS_DIR, DOCS_DIR);
  if (files.length === 0) {
    console.warn('! dokumanlar/ içinde PDF/DOCX bulunamadı — store boş kalacak.');
    return { okCount: 0, failCount: 0 };
  }
  console.log(`→ ${files.length} doküman yükleniyor…`);
  let okCount = 0;
  let failCount = 0;
  for (const { full, rel } of files) {
    process.stdout.write(`  → ${rel} `);
    let op = await ai.fileSearchStores.uploadToFileSearchStore({
      file: full,
      fileSearchStoreName: storeName,
      config: { displayName: rel },
    });
    while (!op.done) {
      await sleep(POLL_MS);
      op = await ai.operations.get({ operation: op });
      process.stdout.write('.');
    }
    if (op.error) {
      failCount++;
      console.log(` ✗ ${op.error.message || JSON.stringify(op.error)}`);
    } else {
      okCount++;
      console.log(' ✓');
    }
  }
  return { okCount, failCount };
}

async function finish(storeName, note) {
  await writeStoreToEnv(storeName);
  console.log('\n========================================================');
  if (note) console.log(note + '\n');
  console.log('✓ .env güncellendi:');
  console.log(`  GEMINI_FILE_SEARCH_STORE=${storeName}`);
  console.log('\n→ ŞİMDİ Vercel → Settings → Environment Variables bölümüne AYNI');
  console.log('  değerleri gir (Production+Preview) ve REDEPLOY et:');
  console.log(`    GEMINI_FILE_SEARCH_STORE=${storeName}`);
  console.log('    GEMINI_API_KEY=<bu scripti çalıştırdığın anahtar>');
  console.log('========================================================');
}

async function main() {
  await loadDotEnv();
  let apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.log('GEMINI_API_KEY bulunamadı. Lütfen anahtarı girin (ekrana yazılmaz):');
    apiKey = await promptSecret('API anahtarı: ');
  }
  if (!apiKey || !apiKey.trim()) {
    console.error('HATA: API anahtarı boş. Çıkılıyor.');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const target = normalizeStoreName(process.env.GEMINI_FILE_SEARCH_STORE);

  console.log('→ Bu anahtarın gördüğü store\'lar kontrol ediliyor…');
  let stores;
  try {
    stores = await listStores(ai);
  } catch (err) {
    console.error('\nHATA: Store listesi alınamadı. Anahtar geçersiz olabilir.');
    console.error('  ' + (err?.message || err));
    process.exit(1);
  }

  if (stores.length) {
    console.log(`  Görülen store sayısı: ${stores.length}`);
    for (const s of stores) {
      console.log(`   • ${s.name}${s.displayName ? ` (${s.displayName})` : ''}`);
    }
  } else {
    console.log('  Bu anahtar hiç store görmüyor.');
  }

  // 1) Hedef store zaten erişilebiliyorsa → iş yok.
  if (target && stores.some((s) => s.name === target)) {
    await finish(target, '✓ Hedef store bu anahtarla ERİŞİLEBİLİR — yeni store gerekmedi.');
    return;
  }

  // 2) Aynı anahtarın projesinde 'klimasun-dokumanlar' store'u zaten var mı?
  const existing = stores.find((s) => s.displayName === STORE_DISPLAY_NAME);
  if (existing) {
    await finish(
      existing.name,
      '✓ Bu anahtarın projesinde uygun store zaten var — onu kullanıyorum ' +
        '(yeniden yükleme yapılmadı).'
    );
    return;
  }

  // 3) Yeni store oluştur + dokümanları yükle.
  console.log('\n→ Uygun store yok. Bu anahtarın projesinde YENİ store oluşturuluyor…');
  const store = await ai.fileSearchStores.create({
    config: { displayName: STORE_DISPLAY_NAME },
  });
  console.log(`✓ Store oluşturuldu: ${store.name}`);

  const { okCount, failCount } = await uploadDocs(ai, store.name);
  await finish(
    store.name,
    `✓ Yeni store hazır. ${okCount} doküman indekslendi` +
      (failCount ? `, ${failCount} başarısız.` : '.')
  );
}

main().catch((err) => {
  console.error('\nOnarım başarısız:', err?.message || err);
  process.exit(1);
});
