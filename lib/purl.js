// Ürünün SEO uyumlu adresi: /urun/<ana-kategori>/<alt-kategori>/<slug>
// path: build-catalog.mjs'in ürettiği "ana-kategori/alt-kategori" dizesi.
// Eski düz /urun/<slug> adresleri, urun/[...path] rotasında buraya 301'lenir.
export function purl(path, slug) {
  return path ? `/urun/${path}/${slug}` : `/urun/${slug}`;
}

// Kategorinin SEO uyumlu adresi: ana için /kategori/<ana>,
// alt için /kategori/<ana>/<alt> (veri slug'ı "ana--alt" biçimindedir).
// Eski "--"'li adresler kategori/[...path] rotasında buraya 301'lenir.
export function caturl(slug) {
  return `/kategori/${slug.replace('--', '/')}`;
}
