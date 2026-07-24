# KlimaSun — Kurulum & Aktarım Dokümanı

Bu doküman, KlimaSun projesini devralacak kişinin (veya yeni bir hesaba
taşırken sizin) ihtiyaç duyacağı **tüm anahtarları, hesapları ve kurulum
adımlarını** anlatır.

---

## 1. Proje Envanteri — Neyi Devrediyorsunuz?

| Bileşen | Nerede | Ne işe yarar |
| --- | --- | --- |
| **GitHub deposu** | `github.com/eesrefu/eeuek` | Tüm kaynak kod + ürün verisi |
| **Statik katalog sitesi** | `klimasun-2026/` klasörü | 9.799 ürünlük katalog, AI asistan, teklif sepeti (WhatsApp/e-posta) |
| **Yayın (GitHub Pages)** | https://eesrefu.github.io/eeuek/ | Statik sitenin canlı hali — ücretsiz, sunucusuz |
| **Next.js AI uygulaması** | depo kök dizini (`app/`, `lib/`) | Gemini destekli doküman Soru-Cevap + AI ürün yönlendirme API'si (opsiyonel, Vercel'e kurulur) |
| **Ürün verisi** | `klimasun-2026/data/products.json` (+ `.js`) | Tek kaynak: 9.799 ürün, etiketler, kategoriler |
| **Teknik dokümanlar** | `dokumanlar/` + `klimasun-2026/assets/docs/` | AI'nın cevap ürettiği PDF katalogları |

Önemli dallar:

- `claude/klimasun-catalog-design-v7zx1r` → **geliştirme dalı** (en güncel kod)
- `claude/compassionate-keller-zp8qte` → **yayın dalı** (buraya push = GitHub Pages otomatik yayınlar)
- `claude/klimasun-hvac-app-tnh82c` → varsayılan dal

> Yayın akışı: değişiklik geliştirme dalına işlenir, sonra
> `git push origin HEAD:claude/compassionate-keller-zp8qte` ile yayın dalına
> aktarılır; `.github/workflows/pages.yml` iş akışı siteyi otomatik yayınlar
> (görselleri 1 GB Pages limiti için optimize ederek).

---

## 2. GEMINI_API_KEY — Nasıl Alınır?

AI özellikleri (doküman Soru-Cevap ve Gemini destekli ürün yönlendirme) için
gereken **ücretsiz** Google Gemini API anahtarı:

1. https://aistudio.google.com/apikey adresine gidin
2. Google hesabıyla giriş yapın (şirket Gmail'i önerilir — kişisel hesaba bağlı kalmasın)
3. **"Create API key"** butonuna basın → yeni bir proje seçin/oluşturun
4. Çıkan `AIza...` ile başlayan anahtarı kopyalayın

⚠️ **Güvenlik kuralları:**

- Anahtar **yalnızca sunucu tarafında** kullanılır (Vercel Environment
  Variables). Asla HTML/JS dosyasına, WordPress'e veya herkese açık bir yere
  yapıştırmayın — depoya da commit etmeyin.
- Anahtar **hesaba bağlıdır ve devredilemez**: projeyi başka birine
  aktarırken yeni kişi kendi Google hesabından **yeni anahtar alır**, eski
  anahtar https://aistudio.google.com/apikey sayfasından silinir.
- Ücretsiz katman (free tier) bu proje için yeterlidir; kredi kartı gerekmez.

---

## 3. GEMINI_FILE_SEARCH_STORE — Nasıl Oluşturulur?

Bu, Gemini'nin **File Search Store**'udur: PDF kataloglarınızın yüklendiği ve
AI'nın cevap üretirken kaynak gösterdiği indekstir. Hazır "alınmaz",
dokümanlarınızdan **bir komutla oluşturulur**:

1. Bilgisayarda depo klonlanır, `npm install` çalıştırılır
2. `.env.example` dosyası `.env` adıyla kopyalanır ve içine `GEMINI_API_KEY` yazılır
3. Teknik PDF/DOCX dosyaları `dokumanlar/` klasörüne konur
4. Şu komut çalıştırılır:

   ```bash
   npm run setup-store
   ```

   Bu komut: bir File Search Store oluşturur → `dokumanlar/` içindeki tüm
   PDF/DOCX'leri yükleyip indeksler → ekrana store adını basar:

   ```
   GEMINI_FILE_SEARCH_STORE=fileSearchStores/klimasun-dokumanlar-xxxxxxxx
   ```

5. Bu satır `.env` dosyasına (ve Vercel'e) eklenir. **Tek seferlik** işlemdir;
   yeni doküman ekledikçe komut tekrar çalıştırılabilir.

⚠️ Store, anahtarı oluşturan **Google projesine bağlıdır**. Yeni hesaba
geçişte yeni anahtarla `npm run setup-store` **yeniden çalıştırılır**
(dokümanlar depoda olduğu için 5 dakikalık iş).

---

## 4. Ortam Değişkenleri — Tam Liste

`.env` (yerelde) ve Vercel → Project Settings → **Environment Variables**:

| Değişken | Zorunlu | Nereden alınır |
| --- | --- | --- |
| `GEMINI_API_KEY` | ✅ (AI için) | Bölüm 2 — aistudio.google.com/apikey |
| `GEMINI_FILE_SEARCH_STORE` | ✅ (doküman S-C için) | Bölüm 3 — `npm run setup-store` çıktısı |
| `NEXT_PUBLIC_SITE_URL` | ▫️ | Sitenin tam adresi, örn. `https://klimasun.com` |
| `KV_REST_API_URL` | ▫️ | Vercel → Storage → Upstash Redis oluşturunca otomatik gelir |
| `KV_REST_API_TOKEN` | ▫️ | (aynı yerden; teklif taleplerini ve S-C cevaplarını kalıcı saklar) |

Not: **Statik katalog sitesi bu anahtarların hiçbiri olmadan da tam çalışır**
(AI asistan yerel modda çalışır). Anahtarlar yalnızca Gemini destekli
özellikleri açar.

---

## 5. Yayın Hesapları

### GitHub (zorunlu)

- Depo: `eesrefu/eeuek`. Devir için: repo **Settings → General → Transfer
  ownership** ile yeni hesaba taşınabilir, ya da yeni kişi **Collaborator**
  olarak eklenir (Settings → Collaborators).
- GitHub Pages yayını depoyla birlikte taşınır; taşıma sonrası URL
  `<yeni-kullanıcı>.github.io/eeuek/` olur ve Settings → Pages'ten kontrol edilir.
- Özel alan adı (klimasun.com) bağlama: Settings → Pages → Custom domain +
  DNS'te `www` için `eesrefu.github.io` hedefli CNAME kaydı.

### Vercel (opsiyonel — AI backend ve/veya siteyi Vercel'de barındırmak için)

1. vercel.com → GitHub ile giriş → **Add New → Project** → `eeuek` deposunu Import
2. **Statik site projesi:** Root Directory = `klimasun-2026`, Framework =
   Other, build ayarları boş → Deploy
3. **AI backend projesi (ayrı proje):** Root Directory = depo kökü, Framework
   = Next.js (otomatik algılanır) → Bölüm 4'teki değişkenleri girin → Deploy
4. AI backend'i statik siteye bağlamak: `klimasun-2026/index.html` içine
   `asistan.js`'ten önce şu satır eklenir:
   `<script>window.KS_AI_URL='https://<ai-projesi>.vercel.app/api/yonlendir';</script>`
   (Asistan önce bu adresi dener; ulaşamazsa otomatik yerel moda döner.)

### WhatsApp & E-posta (teklif sepeti)

Teklif sepeti mesajları şu bilgilere gider — değiştirmek için
`klimasun-2026/data/meta.js` ve `meta.json` düzenlenir:

- WhatsApp: `905324246219`
- Telefon: `0216 344 48 19`
- E-posta: `info@klimasun.com.tr`

---

## 6. Devir Kontrol Listesi

- [ ] GitHub deposu yeni hesaba transfer edildi / yeni kişi collaborator yapıldı
- [ ] Yeni kişi kendi Google hesabından **yeni** `GEMINI_API_KEY` aldı (Bölüm 2)
- [ ] `npm run setup-store` yeni anahtarla çalıştırıldı, yeni store adı kaydedildi (Bölüm 3)
- [ ] Eski API anahtarı AI Studio'dan silindi
- [ ] Vercel projeleri yeni hesapta oluşturuldu, ortam değişkenleri girildi (Bölüm 4-5)
- [ ] `data/meta.js` + `meta.json` içindeki telefon/WhatsApp/e-posta doğrulandı
- [ ] GitHub Pages adresi ve (varsa) klimasun.com DNS kayıtları güncellendi
- [ ] Bu doküman yeni sorumluya iletildi 🙂

---

## 7. Sık Yapılan İşler (Hızlı Referans)

| İş | Nasıl |
| --- | --- |
| Ürün ekleme/düzenleme | `klimasun-2026/data/products.json` düzenle → aynısını `products.js`'e yansıt (`window.KS_PRODUCTS=` + JSON) → yayın dalına push |
| Ürüne etiket ekleme | `klimasun-2026/data/etiketler.js` içine `"urun-slug": ["Etiket1"]` satırı — yeniden derleme gerekmez |
| Fiyat gösterme | `klimasun-2026/data/prices.js` içine `"urun-slug": "12.500 TL"` |
| Siteyi yayınlama | Değişikliği commit et → `git push origin HEAD:claude/compassionate-keller-zp8qte` → 3-15 dk içinde canlıda |
| AI'ya yeni doküman öğretme | PDF'i `dokumanlar/` klasörüne koy → `npm run setup-store` |

---

## 8. EK — Bu fork (mioe-tr/eeuek): Cloudflare Workers kurulumu

> Bu bölüm fork'a 17.07.2026'da eklendi. Yukarıdaki bölümler orijinal
> (eesrefu/eeuek) kurulumu anlatır; bu fork ise siteyi **GitHub Pages +
> Vercel yerine Cloudflare Workers** üzerinde yayınlar.

| Bileşen | Bu fork'ta |
| --- | --- |
| Canlı site | https://klimasun.mioe-tr.workers.dev (Worker adı: `klimasun`) |
| Yayın dalı | `feat/klimasun-industrial-redesign` |
| Deploy | `npm run deploy` (`@opennextjs/cloudflare` + `wrangler.jsonc`) |
| Otomatik deploy | `.github/workflows/deploy.yml` — yayın dalına push'ta çalışır |
| Katalog verisi | Build öncesi `scripts/build-catalog.mjs` üretir (ürün indeksi, kategori sayfaları, görseller) |
| Site adresi değişkeni | `wrangler.jsonc` → `vars.NEXT_PUBLIC_SITE_URL` |

**GitHub Actions repo secrets** (Settings → Secrets and variables → Actions;
yalnızca Admin yetkisiyle girilebilir):

| Secret | Zorunlu | Açıklama |
| --- | --- | --- |
| `CLOUDFLARE_API_TOKEN` | ✅ | Workers deploy yetkili token |
| `GEMINI_API_KEY` | AI için | Bölüm 2'deki gibi alınır |
| `CLOUDFLARE_ACCOUNT_ID` | ▫️ | Boşsa mevcut Klimasun hesabı kullanılır |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | ▫️ | Yalnızca Upstash kullanılacaksa (aşağıdaki nota bakın) |

Workflow, girilen secrets'ları deploy sonrası `wrangler secret put` ile
Worker'a otomatik yükler — Vercel ortam değişkeni adımının karşılığı budur.

**Soru-cevap kalıcı deposu — Cloudflare KV (bağlı):**

- AI asistanının soru-cevaplarını kalıcı saklamak için **Cloudflare KV**
  bağlıdır: `wrangler.jsonc` → `kv_namespaces` içinde `QA_KV` binding'i
  (namespace id `9babadc3d9354e578e69e2121a9b9461`). Ek secret/hesap
  gerekmez, deploy'da otomatik gelir.
- `lib/store.js` önce `QA_KV` binding'ini kullanır; yoksa Upstash/Vercel KV
  REST (`KV_REST_API_*`), o da yoksa süreç-içi belleğe düşer. Yani Upstash
  isteğe bağlıdır — Cloudflare KV bağlı olduğu için gerekmez.
- Yeni bir hesaba taşırken KV namespace yeniden oluşturulur
  (`npx wrangler kv namespace create QA_KV`) ve çıkan id `wrangler.jsonc`'a
  yazılır.

**File Search Store (Gemini doküman Soru-Cevap):**

- `GEMINI_FILE_SEARCH_STORE` gizli bir değer değildir (erişim için yine
  `GEMINI_API_KEY` gerekir); bu yüzden secret değil, `wrangler.jsonc` →
  `vars` içinde tutulur. Güncel değer:
  `fileSearchStores/klimasundokumanlar-19crlh6h3r50`
  (66 ürün/teknik katalog PDF'i — `dokumanlar/` + `klimasun-2026/assets/docs/`).
- Store'u yeniden oluşturmak/güncellemek için: **Actions → "Gemini File
  Search — belgeleri indeksle"** iş akışı (veya feature dalında commit
  mesajına `[index-docs]` yazıp push). `GEMINI_API_KEY` repo secret'ından
  okunur; çıkan store adı iş özetinde gösterilir — o adı `wrangler.jsonc`'a
  yazıp deploy edin.
- Anahtar/hesap değişince aynı iş akışı yeni anahtarla tekrar çalıştırılır.
