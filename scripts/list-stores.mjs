#!/usr/bin/env node
/**
 * Teşhis scripti — kimlik/proje eşleşmesini doğrular.
 *
 * Verilen GEMINI_API_KEY anahtarının GÖREBİLDİĞİ tüm File Search Store'ları
 * listeler. Uygulama `PERMISSION_DENIED` (store bulunamadı) hatası veriyorsa,
 * bu scripti Vercel'dekiyle AYNI anahtarla çalıştırın:
 *
 *   - Beklediğiniz store listede görünüyorsa → sorun önek/ad, projeler aynı.
 *   - Store listede YOKSA → anahtar, store'un oluşturulduğu projeden farklı
 *     bir Google projesinde. Ya store'un projesindeki anahtarı kullanın ya da
 *     `npm run setup-store`'u bu anahtarla tekrar çalıştırıp store'u yeniden
 *     oluşturun.
 *
 * Çalıştırma:
 *   npm run list-stores
 * (Bu komut `node --env-file=.env scripts/list-stores.mjs` çalıştırır.)
 */
import { GoogleGenAI } from '@google/genai';

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('HATA: GEMINI_API_KEY tanımlı değil. .env dosyanızı kontrol edin.');
    process.exit(1);
  }

  // Karşılaştırma için hedef store adını da gösterelim (varsa).
  const target = (process.env.GEMINI_FILE_SEARCH_STORE || '').trim();

  const ai = new GoogleGenAI({ apiKey });

  console.log('→ Bu anahtarın gördüğü File Search Store\'lar listeleniyor…\n');

  const stores = [];
  const pager = await ai.fileSearchStores.list();
  for await (const store of pager) {
    stores.push(store);
  }

  if (stores.length === 0) {
    console.log('! Bu anahtar hiçbir store göremiyor.');
    console.log('  Muhtemelen store başka bir Google projesinde oluşturuldu ya da');
    console.log('  bu anahtar hiç store oluşturmadı.');
  } else {
    for (const s of stores) {
      const dn = s.displayName ? ` (${s.displayName})` : '';
      console.log(`  • ${s.name}${dn}`);
    }
  }

  console.log('\n========================================================');
  if (target) {
    // Önek normalizasyonu — getStoreName() ile aynı mantık.
    let norm = target.replace(/^["']|["']$/g, '');
    if (!norm.startsWith('fileSearchStores/')) {
      norm = `fileSearchStores/${norm.replace(/^\/+/, '')}`;
    }
    const found = stores.some((s) => s.name === norm);
    console.log(`Hedef (GEMINI_FILE_SEARCH_STORE): ${norm}`);
    if (found) {
      console.log('✓ Hedef store bu anahtarla ERİŞİLEBİLİR. Sorun proje değil.');
    } else {
      console.log('✗ Hedef store bu anahtarın listesinde YOK.');
      console.log('  → Anahtar ile store FARKLI projelerde. Aynı projeye hizalayın:');
      console.log('    a) store\'un projesindeki anahtarı Vercel\'e koyun, veya');
      console.log('    b) `npm run setup-store`\'u bu anahtarla tekrar çalıştırın.');
    }
  } else {
    console.log('Not: GEMINI_FILE_SEARCH_STORE tanımlı değil; sadece liste gösterildi.');
  }
  console.log('========================================================');
}

main().catch((err) => {
  console.error('\nListeleme başarısız:', err?.message || err);
  process.exit(1);
});
