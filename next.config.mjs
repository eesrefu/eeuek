import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Eski statik sitenin kök sayfa adresleri (SEO: kalıcı yönlendirme).
  // Eski /urun/*.html ve /kategori/*.html adresleri kendi rotalarında çözülür.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/urunler.html', destination: '/urunler', permanent: true },
      { source: '/kategoriler.html', destination: '/kategoriler', permanent: true },
      { source: '/markalar.html', destination: '/markalar', permanent: true },
      { source: '/iletisim.html', destination: '/iletisim', permanent: true },
      { source: '/blog.html', destination: '/blog', permanent: true },
    ];
  },
};

export default nextConfig;

// Cloudflare bağlamını (env, bindings) yalnızca `next dev` sırasında sağlar.
// Sadece geliştirmede çağrılır; `next build`/`next start` sırasında miniflare
// başlatmaya çalışıp (workerd) gereksiz yere takılmasını önler.
if (process.env.NODE_ENV === 'development') {
  initOpenNextCloudflareForDev();
}
