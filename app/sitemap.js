import { POPULAR } from '@/lib/popular';
import { recentSlugs } from '@/lib/store';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://klimasun.vercel.app';

export default async function sitemap() {
  const now = new Date();
  const entries = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
  ];

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
      priority: 0.7,
    });
  }
  return entries;
}
