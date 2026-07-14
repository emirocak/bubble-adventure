# Project Bubble

Big Babol sakızlarına yapıştırılan QR kodlarından çözülen 3x3'lük bir yapboz. 9 parça birleşince altta gizli bir davet ortaya çıkar.

- **10 QR toplam:** 1 info QR + 9 parça QR
- **Sıra yok:** herhangi bir parça herhangi bir sırada bulunabilir
- **İlerleme kaybolmaz:** telefon tarayıcısı temizlenmediği sürece kalır
- **Statik site:** GitHub Pages'te bedavaya çalışır

## Yönetim Paneli

`https://<kullanıcı>.github.io/<repo>/?admin=1` — sadece sen bileceğin URL.

**Özellikleri:**
- 10 QR kodunu üretir, PNG olarak indirilir
- Bu cihazdaki ilerlemeyi sıfırlama butonu
- Bütün metinleri (giriş, davet, ipuçları) düzenleme formu
- Değişiklikleri bu cihazda anında önizleme
- GitHub için hazır kod üretme — kopyala, `src/config.ts`'e yapıştır

## Metinleri Değiştirmenin İki Yolu

**Kolay yol (tavsiye):**
1. Admin panelini aç → "Metinleri düzenle"
2. İstediğin alanları değiştir
3. "Bu cihazda önizle" — nasıl göründüğünü kontrol et
4. Uygun bulunca "GitHub için kodu üret" → panoya kopyala
5. GitHub'da `src/config.ts` dosyasını aç, içindekini sil, yapıştır, commit et
6. ~1 dakika sonra site canlıda

**Direkt yol:**
`src/config.ts` dosyasını GitHub üzerinden aç, kalem ikonuyla düzenle:
- `intro.body` — giriş metni
- `invitation.day / place / time` — davet detayları
- `pieceHints` — her parça için nerede olduğu ipucu
- `unlockMessages` — parça açılınca rastgele biri seçilir

## QR Kodlarını Sakızlara Yapıştırmak

Admin panelinden 10 QR indir:
- **00** — İlk (bilgilendirme) sakızına yapıştır. Site açılır, oyunu anlatır.
- **01–09** — Diğer 9 sakıza dağıt. Hangisi hangi yere gittiği önemsiz.

Sonra `src/config.ts` → `pieceHints`'e her parçanın nerede saklı olduğuna dair kısa bir ipucu yaz:
```typescript
pieceHints: {
  1: 'çantanın içinde',
  2: 'arka koltukta',
  ...
}
```

Bu ipuçları kilitli parçaların altında minik yazı olarak görünür.

## Kurulum (Sadece Deploy)

Lokal kurulum gerekli değil. Kod GitHub'da, GitHub Actions build ediyor, GitHub Pages yayınlıyor.

1. Bu klasörü GitHub'a repo olarak yükle
2. Repo → **Settings → Pages → Source: GitHub Actions**
3. Her push otomatik yeniden deploy eder

## Kullanılan Teknolojiler

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (parça animasyonları)
- canvas-confetti (tamamlanma efekti)
- qrcode (QR üretimi)

## Yardımcı URL'ler

- Ana site: `/`
- Belirli bir parçayı test için: `/?p=1` … `/?p=9`
- İlerlemeyi sıfırla: `/?reset=1`
- Admin: `/?admin=1`
