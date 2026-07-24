import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// OpenNext — Next.js uygulamasını Cloudflare Workers runtime'ında çalıştırır.
// İsteğe bağlı: R2/KV tabanlı ISR incremental cache buraya eklenebilir.
export default defineCloudflareConfig();
