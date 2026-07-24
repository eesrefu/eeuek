# ❄️ KlimaSun

**Erdinç Klima**'nın endüstriyel soğutma ve HVAC yapay zekâ arama asistanı.
Herkese açık, **ücretsiz**, üyeliksiz. Giriş, sayaç, paywall **yoktur**.

Cevaplar yalnızca **yüklenen teknik dokümanlardan** (managed RAG) üretilir ve
**kaynak/sayfa göstererek** sunulur. Bilinmeyen sorularda model uydurmaz.

> ℹ️ **Çalışma/dağıtım akışı:** Proje **Cloudflare Workers** üzerinde çalışır ve
> `main` dalına push ile **GitHub Actions** üzerinden otomatik dağıtılır. Ortak
> çalışma, yerel kurulum, doküman ekleme ve secret'lar için **[KATKI.md](./KATKI.md)**
> dosyasına bakın. (Aşağıdaki bölümlerden bir kısmı ilk şablonun Vercel kurulumunu
> anlatır; güncel dağıtım Cloudflare'dir.)

- **Next.js (App Router)** + **Vercel**
- **Gemini API** — `gemini-2.5-flash` (free tier yeterli)
- **Gemini File Search** aracı ile managed RAG
- Her soru-cevap **kendi paylaşılabilir URL'sine** sahip ve **server-render**
  edilir (`/soru/[slug]`) — SEO için `<title>`, meta description ve **FAQPage
  JSON-LD** içerir.

---

## 1) Kurulum

```bash
npm install
cp .env.example .env
```

`.env` içine en az `GEMINI_API_KEY` değerini girin
([AI Studio](https://aistudio.google.com/apikey) üzerinden ücretsiz alınır).

> 🔒 API anahtarı **asla** frontend'e gönderilmez; yalnızca backend API
> route'unda (`app/api/ask`) ve kurulum scriptinde kullanılır.

## 2) Dokümanları yükleyin (tek seferlik)

Teknik dokümanlarınızı (PDF/DOCX) `dokumanlar/` klasörüne koyun, sonra:

```bash
npm run setup-store
```

Bu komut:
1. Bir Gemini **File Search Store** oluşturur,
2. `dokumanlar/` içindeki tüm **PDF ve DOCX** dosyalarını yükleyip indeksler,
3. `.env`'e eklemeniz gereken **store adını** ekrana basar:

```
GEMINI_FILE_SEARCH_STORE=fileSearchStores/klimasun-dokumanlar-xxxxxxxx
```

Bu satırı `.env` dosyasına ekleyin (Vercel'de de Environment Variables'a girin).

## 3) Geliştirme

```bash
npm run dev
# http://localhost:3000
```

## 4) Vercel'e dağıtım

1. Depoyu Vercel'e **Import** edin (framework otomatik **Next.js** algılanır).
2. **Environment Variables**'a ekleyin:
   - `GEMINI_API_KEY`
   - `GEMINI_FILE_SEARCH_STORE`
   - `NEXT_PUBLIC_SITE_URL` (örn. `https://klimasun.vercel.app`)
   - *(opsiyonel)* `KV_REST_API_URL`, `KV_REST_API_TOKEN`
3. **Deploy**.

---

## Çevre değişkenleri

| Değişken | Zorunlu | Açıklama |
| --- | --- | --- |
| `GEMINI_API_KEY` | ✅ | Gemini API anahtarı (yalnız backend). |
| `GEMINI_FILE_SEARCH_STORE` | ✅ | `setup-store` çıktısı; File Search Store adı. |
| `NEXT_PUBLIC_SITE_URL` | ▫️ | Canonical/sitemap/OG için tam site adresi. |
| `KV_REST_API_URL` | ▫️ | (Opsiyonel) Vercel KV / Upstash Redis REST URL. |
| `KV_REST_API_TOKEN` | ▫️ | (Opsiyonel) Vercel KV / Upstash Redis REST token. |

### Kalıcı depolama (opsiyonel ama önerilir)

`KV_*` değişkenleri tanımlıysa her soru-cevap kalıcı olarak saklanır; aynı
URL'ye gelen ziyaretçiler (ve arama motorları) **birebir aynı** içeriği görür ve
sitemap üretilen tüm soruları listeler. Tanımlı değilse uygulama yine çalışır;
`/soru/[slug]` sayfası cevabı slug'dan yeniden üretir (ISR ile önbelleğe alınır).

Vercel'de: **Storage → KV (Upstash Redis)** oluşturup projeye bağlayın; değişkenler
otomatik gelir.

---

## SEO / organik trafik

- `/soru/[slug]` sayfaları **server-render** edilir ve indekslenebilir.
- Her cevap sayfasında doğru `<title>`, `meta description`, canonical, OpenGraph
  ve **FAQPage JSON-LD** bulunur.
- `app/sitemap.js` ve `app/robots.js` otomatik üretilir.
- Ana sayfada popüler HVAC soruları (F-Gaz, evaporatif, pano kliması, chiller…)
  tıklanabilir kartlar olarak durur (`lib/popular.js`).

---

## Proje yapısı

```
app/
  layout.js               # Kök layout, global metadata, header/footer
  page.js                 # Ana sayfa: arama + popüler sorular
  globals.css             # Koyu/soğuk tema, cyan accent
  components/
    SearchBox.jsx         # Arama kutusu (client) → /api/ask → /soru/[slug]
    Citations.jsx         # Kaynak/sayfa (citation) listesi
  api/ask/route.js        # Gemini'ye soruyu soran backend route (API key burada)
  soru/[slug]/
    page.js               # Server-render Q&A + FAQPage JSON-LD + metadata
    loading.js            # Yükleniyor durumu
  sitemap.js / robots.js  # SEO
lib/
  gemini.js               # Gemini istemcisi + askKlimaSun() + citation çıkarımı
  slug.js                 # Türkçe-duyarlı slugify/deslugify
  store.js                # Soru-cevap deposu (KV varsa kalıcı, yoksa ephemeral)
  popular.js              # Popüler örnek sorular
scripts/
  setup-store.mjs         # Tek seferlik: store oluştur + dokümanları indeksle
dokumanlar/               # PDF/DOCX dokümanlar (git'e gönderilmez)
```

## Sistem promptu

```
Sen KlimaSun'sun, Erdinç Klima'nın endüstriyel soğutma ve HVAC asistanısın.
Sadece yüklenen dokümanlara dayanarak, Türkçe, kaynak göstererek cevap ver.
Bilmiyorsan uydurma, bilmediğini söyle.
```

Gemini 2.5 modelleri tekrarlanan istek öneklerini (system instruction dahil)
**otomatik "implicit caching"** ile önbelleğe alır; sabit sistem promptu her
çağrıda yeniden işlenmez.

## Lisans

MIT
