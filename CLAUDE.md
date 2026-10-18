# eeuek — çalışma hafızası

## 🔘 SON DÜĞME KURALI (Eşref Bey, 18.10.2026) — her oturum, her depo; yerel, bulut, Chat, Cowork

Kullanıcıya iş bırakılmaz. Chrome'da sayfa açma, form doldurma, dosya yükleme, panel, komut, commit, PR — hepsi **son düğmeye kadar** oturumca yapılır. Yalnız **parola/2FA, ödeme, geri alınmaz onay** (silme, birleştirme, yayın, gönderme) ve **yalnız kullanıcının bildiği bilgi** için durulur. Durulduğunda yanıt şu biçimde biter:

1. Sayfalar Chrome'da **açık bırakılır**; hangi sekme olduğu adıyla yazılır (ör. "Personal Access Tokens (Classic)").
2. Numaralı liste: **sekme/sayfa → basılacak düğme → tek cümle açıklama** (ne olur, neden gerekli). İki adımlı onaylarda ikinci düğme de yazılır: "Delete → **I understand, delete this token**", "Merge pull request → **Confirm merge**".
3. Olası şifre/2FA ekranı **önceden** söylenir ("Delete'e basınca GitHub şifre isteyebilir; siz girersiniz, ben görmem").
4. Kullanıcı "yaptım" deyince oturum **ölçer** (sayfa metni / API / git) ve sonucu yazar; ölçmeden "bitti" denmez. Değişmemişse açıkça "değişmemiş" denir ve aynı liste tekrarlanır.
5. Oturumun kendi izin denetimi bir tıklamayı engelliyorsa (ör. sır deposu, geri alınmaz işlem) bu söylenir ve o tıklama aynı biçimde kullanıcıya listelenir; başka oturuma devredilmez.

Yasak biçimler: "git şunu yap", "şu komutu çalıştırın", "ayarlara girip … yapın", "kontrol edin". Komut gerekiyorsa oturum çalıştırır. Her yanıt yine **📍 Nerede kaldık** bloğuyla biter; "Sizden" satırında yalnız bu listedeki düğmeler/şifre olur.

Kaynak: bu kural Eşref Bey'in 18.10.2026 talimatıdır; kullanıcı düzeyinde `C:\Users\pc\.claude\CLAUDE.md` ve `ortak/DERSLER.md`'de, her deponun `CLAUDE.md`'sinde aynı metin durur. Değişiklik tek yerden yapılır, diğerleri kopyalanır.
