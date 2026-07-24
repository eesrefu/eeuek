# 🤝 Katkı & Çalışma Akışı (KlimaSun)

Bu depo **Cloudflare Workers** üzerinde çalışır ve **GitHub Actions** ile
otomatik dağıtılır. Ortak çalışmak için bilmen gereken her şey burada.

- **Canlı site:** https://klimasun.mioe-tr.workers.dev
- **Üretim (production) dalı:** `main`
- **Barındırma:** Cloudflare Workers (`@opennextjs/cloudflare`)
- **Dağıtım:** `.github/workflows/deploy.yml`

---

## 1) Dağıtım nasıl çalışır?

```
main dalına push  ─►  GitHub Actions (deploy.yml)  ─►  Cloudflare Workers  ─►  canlı
```

`main` dalına her push (veya merge) otomatik olarak:

1. Kataloğu üretir (`node scripts/build-catalog.mjs`),
2. OpenNext ile build alır,
3. Cloudflare Workers'a deploy eder,
4. Gerekli Worker secret'larını (Gemini/KV) günceller.

Deploy'u **Actions** sekmesinden canlı izleyebilirsin. Elle tetiklemek için:
**Actions → "Cloudflare Workers Deploy" → Run workflow**.

> Ayrı bir dalda çalışırken deploy tetiklenmez. Değişikliğin canlıya çıkması
> için PR açıp `main`'e merge et.

## 2) Yerel geliştirme

```bash
npm install
cp .env.example .env      # GEMINI_API_KEY gir (AI Studio'dan ücretsiz)
npm run dev               # http://localhost:3000
```

Katalog verisi (`veri/*.json`) `npm run dev`/`npm run build` sırasında
`scripts/build-catalog.mjs` tarafından otomatik üretilir.

## 3) Değişiklik gönderme

```bash
git checkout -b ozellik/kisa-aciklama    # main'den yeni dal
# ... değişiklikler ...
git commit -m "Kısa, açıklayıcı mesaj"
git push -u origin ozellik/kisa-aciklama
```

Sonra GitHub'da **`main`'e** Pull Request aç. Merge edilince deploy otomatik
başlar. Doğrudan `main`'e push da deploy tetikler; ekip çalışmasında PR önerilir.

## 4) Yeni doküman ekleme (AI asistanı bilgisi)

Asistan yalnızca **indekslenmiş teknik dokümanlardan** cevap verir.

- Dokümanları (PDF/DOCX) `dokumanlar/` veya `klimasun-2026/assets/docs/` altına ekle.
- Commit mesajına **`[index-docs]`** yaz ve `main`'e push et → belgeler
  mevcut Gemini File Search store'una eklenir (`.github/workflows/index-docs.yml`).
- Store'u sıfırdan temiz kurmak istersen commit mesajına **`[rebuild-store]`** ekle.
- İş bitince Actions **Summary**'de yeni store adı görünür; değişmişse
  `GEMINI_FILE_SEARCH_STORE` secret'ını güncelle ve Deploy'u tekrar çalıştır.

## 5) Secret'lar (yalnız repo Admin'i girer)

**Settings → Secrets and variables → Actions** altında tutulur; koda **asla**
yazılmaz. Anahtarlar yalnızca Actions çalışırken kullanılır.

| Secret | Zorunlu | Ne işe yarar |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | ✅ | Workers'a deploy yetkisi. |
| `CLOUDFLARE_ACCOUNT_ID` | ▫️ | Boşsa mevcut hesap kullanılır. |
| `GEMINI_API_KEY` | ✅ | AI asistanı (File Search). |
| `GEMINI_FILE_SEARCH_STORE` | ▫️ | Aktif doküman store adı (`wrangler.jsonc`'te de tutulur). |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | ▫️ | Harici Redis (opsiyonel; asıl kalıcılık Cloudflare KV). |

> Cloudflare kalıcı önbelleği **Cloudflare KV** (`QA_KV` binding, `wrangler.jsonc`)
> ile sağlanır; ücretsiz katmanda çalışır.

## 6) Faydalı komutlar

| Komut | Açıklama |
| --- | --- |
| `npm run dev` | Yerel geliştirme sunucusu. |
| `npm run build` | Katalog + Next.js production build. |
| `npm run preview` | OpenNext build + yerel Workers önizleme (miniflare). |
| `npm run deploy` | Elle Cloudflare deploy (normalde Actions yapar). |
| `npm run lint` | ESLint. |
