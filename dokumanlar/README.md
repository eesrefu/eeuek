# dokumanlar/

KlimaSun'ın cevap üreteceği teknik dokümanları (PDF ve DOCX) **bu klasöre** koyun.

- Desteklenen biçimler: `.pdf`, `.docx`
- Örnekler: F-Gaz yönetmeliği, ürün kataloğu, chiller seçim kılavuzu,
  pano kliması teknik föyleri, evaporatif soğutma el kitabı…

Dosyaları ekledikten sonra **tek seferlik** kurulum scriptini çalıştırın:

```bash
npm run setup-store
```

Bu komut bir Gemini File Search Store oluşturur, buradaki tüm PDF/DOCX
dosyalarını yükleyip indeksler ve `.env`'e eklemeniz gereken store adını basar.

> Not: Bu klasördeki dokümanlar `.gitignore` ile depoya gönderilmez
> (yalnızca bu README ve `.gitkeep` izlenir). Dokümanları yerelde tutun.
