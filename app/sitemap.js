import { POPULAR } from '@/lib/popular';
import { recentSlugs } from '@/lib/store';
import { PRODUCTS, SEGMENTS } from '@/lib/catalog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

export default async function sitemap() {
  const now = new Date();
  const entries = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/katalog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/marka/rittal`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  for (const seg of Object.keys(SEGMENTS)) {
    entries.push({
      url: `${SITE_URL}/katalog/${seg}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const p of PRODUCTS) {
    entries.push({
      url: `${SITE_URL}/urun/${p.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  const slugs = new Set(POPULAR.map((p) => p.slug));
  try {
    for (const s of await recentSlugs(200)) slugs.add(s);
  } catch {
    // KV yoksa yalnızca popüler sorular listelenir.
  }

  for (const slug of slugs) {
    entries.push({
      url: `${SITE_URL}/soru/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }
  return entries;
}
