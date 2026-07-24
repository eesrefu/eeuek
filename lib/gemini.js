import { GoogleGenAI } from '@google/genai';

// Varsayılan model. `gemini-2.5-flash` yeni hesaplara kapatıldığı için güncel
// "flash-latest" takma adı kullanılır (File Search aracını destekler).
// GEMINI_MODEL ortam değişkeniyle koda dokunmadan değiştirilebilir.
export const DEFAULT_MODEL = 'gemini-flash-latest';

export function getModel() {
  const m = (process.env.GEMINI_MODEL || '').trim();
  return m || DEFAULT_MODEL;
}

// Sistem promptu. Flash modelleri tekrarlanan istek öneklerini (system
// instruction dahil) otomatik olarak "implicit caching" ile önbelleğe alır;
// böylece bu sabit prompt her çağrıda yeniden işlenmez/ücretlendirilmez.
export const SYSTEM_PROMPT =
  "Sen KlimaSun'sun, Erdinç Klima'nın endüstriyel soğutma ve HVAC asistanısın. " +
  'Sadece yüklenen dokümanlara dayanarak, Türkçe, kaynak göstererek cevap ver. ' +
  'Bilmiyorsan uydurma, bilmediğini söyle. ' +
  'Bu bir sohbettir: önceki mesajları dikkate al; eksik bilgi varsa kısa bir ' +
  'soruyla netleştir, kullanıcı yanıtladığında o bağlamı kullanarak devam et.';

let _client = null;

export function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY tanımlı değil. .env dosyasını kontrol edin.');
  }
  if (!_client) _client = new GoogleGenAI({ apiKey });
  return _client;
}

export function getStoreName() {
  let name = process.env.GEMINI_FILE_SEARCH_STORE;
  if (!name || !name.trim()) {
    throw new Error(
      'GEMINI_FILE_SEARCH_STORE tanımlı değil. Önce `npm run setup-store` çalıştırıp ' +
        'çıktıdaki store adını .env dosyasına ekleyin.'
    );
  }
  // Kullanıcı hataya açık: baştaki/sondaki boşlukları temizle ve zorunlu
  // "fileSearchStores/" önekini eksikse otomatik tamamla.
  name = name.trim().replace(/^["']|["']$/g, '');
  if (!name.startsWith('fileSearchStores/')) {
    name = `fileSearchStores/${name.replace(/^\/+/, '')}`;
  }
  return name;
}

/**
 * KlimaSun'a bir soru sorar. Cevap yalnızca File Search Store'a yüklenmiş
 * dokümanlardan, managed RAG (fileSearch aracı) ile üretilir.
 * @param {string} question
 * @returns {Promise<{answer: string, citations: Array<{title: string, page: (number|null), text: string}>}>}
 */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Kota (429) DIŞINDAKI geçici hatalarda (500/503/INTERNAL/UNAVAILABLE/ağ)
// yeniden denenip denenmeyeceğini belirler. Rate-limit tekrar denenmez.
function isTransient(err) {
  const code = err?.status || err?.code;
  const msg = (err?.message || String(err) || '').toString();
  if (code === 429 || /RESOURCE_EXHAUSTED|quota|rate.?limit/i.test(msg)) return false;
  return (
    code === 500 || code === 503 || code === 502 || code === 504 ||
    /INTERNAL|UNAVAILABLE|deadline|ECONNRESET|fetch failed|network|socket|terminated/i.test(msg)
  );
}

/**
 * KlimaSun'a bir soru sorar. Cevap yalnızca File Search Store'a yüklenmiş
 * dokümanlardan, managed RAG (fileSearch aracı) ile üretilir.
 * Geçici Gemini hatalarında (ör. 500 INTERNAL) kısa bekleyip 2 kez daha dener;
 * böylece kullanıcı anlık dalgalanmalarda "cevap üretilemedi" ile karşılaşmaz.
 * @param {string} question
 * @returns {Promise<{answer: string, citations: Array<{title: string, page: (number|null), text: string}>}>}
 */
// Ortak çalıştırıcı: File Search grounding + geçici hatada yeniden deneme.
// contents: tek soru (string) veya çok turlu sohbet (Content[] dizisi).
async function runGrounded(contents) {
  const ai = getClient();
  const storeName = getStoreName();
  const params = {
    contents,
    model: getModel(),
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }],
    },
  };

  const MAX_TRIES = 3;
  let lastErr;
  for (let attempt = 1; attempt <= MAX_TRIES; attempt++) {
    try {
      const response = await ai.models.generateContent(params);
      const answer = (response.text || '').trim();
      if (!answer) throw new Error('Boş yanıt döndü');
      return { answer, citations: extractCitations(response) };
    } catch (err) {
      lastErr = err;
      if (attempt === MAX_TRIES || !isTransient(err)) throw err;
      await sleep(700 * attempt);
    }
  }
  throw lastErr;
}

// Tek soru (önbelleğe alınan /soru sayfaları için).
export async function askKlimaSun(question) {
  return runGrounded(question);
}

// Çok turlu sohbet. messages: [{ role: 'user'|'assistant', text }]
export async function chatKlimaSun(messages) {
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(m.text || '') }],
  }));
  return runGrounded(contents);
}

// Gemini/SDK hatalarını kullanıcıya gösterilebilecek sade Türkçe mesajlara çevirir.
export function friendlyError(err) {
  const raw = (err?.message || String(err) || '').toString();
  const code = err?.status || err?.code;
  if (code === 429 || /RESOURCE_EXHAUSTED|quota|rate.?limit|429/i.test(raw)) {
    return {
      status: 429,
      message:
        'Şu an çok fazla soru geliyor (ücretsiz kota dakikada birkaç istek). ' +
        'Lütfen yaklaşık 1 dakika sonra tekrar deneyin.',
    };
  }
  if (/API key|API_KEY|PERMISSION_DENIED|unauthor/i.test(raw)) {
    return { status: 500, message: 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.' };
  }
  return { status: 500, message: 'Cevap üretilemedi. Lütfen tekrar deneyin.' };
}

/**
 * File Search yanıtındaki grounding metadata'dan kaynak/sayfa bilgilerini
 * (citation) çıkarır. SDK sürümleri arasındaki alan farklarına karşı defansif.
 */
export function extractCitations(response) {
  const out = [];
  const seen = new Set();
  const candidate = response?.candidates?.[0];
  const chunks = candidate?.groundingMetadata?.groundingChunks || [];

  for (const chunk of chunks) {
    const rc = chunk?.retrievedContext || chunk?.web || null;
    if (!rc) continue;
    const title = rc.title || rc.documentName || rc.uri || 'Doküman';
    const page =
      rc.pageSpan?.firstPage ??
      rc.pageSpan?.first_page ??
      rc.page ??
      null;
    const key = `${title}#${page ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      title: String(title),
      page: page == null ? null : Number(page),
      text: rc.text ? String(rc.text).replace(/\s+/g, ' ').slice(0, 280) : '',
    });
  }
  return out;
}
