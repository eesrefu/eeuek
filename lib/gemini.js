import { GoogleGenAI } from '@google/genai';

export const MODEL = 'gemini-2.5-flash';

// Sistem promptu. Gemini 2.5 modelleri tekrarlanan istek öneklerini (system
// instruction dahil) otomatik olarak "implicit caching" ile önbelleğe alır;
// böylece bu sabit prompt her çağrıda yeniden işlenmez/ücretlendirilmez.
export const SYSTEM_PROMPT =
  "Sen KlimaSun'sun, Erdinç Klima'nın endüstriyel soğutma ve HVAC asistanısın. " +
  'Sadece yüklenen dokümanlara dayanarak, Türkçe, kaynak göstererek cevap ver. ' +
  'Bilmiyorsan uydurma, bilmediğini söyle.';

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
export async function askKlimaSun(question) {
  const ai = getClient();
  const storeName = getStoreName();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: question,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      tools: [{ fileSearch: { fileSearchStoreNames: [storeName] } }],
    },
  });

  const answer = (response.text || '').trim();
  const citations = extractCitations(response);
  return { answer, citations };
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
