# Project Bubble

Big Babol sakızlarına yapıştırılan QR kodlarından çözülen 3x3'lük bir yapboz. 9 parça birleşince altta gizli bir davet ortaya çıkar.

- **10 QR toplam:** 1 info QR (siteyi açan) + 9 parça QR
- **Sıra yok:** herhangi bir parça herhangi bir sırada bulunabilir
- **Kayıt localStorage'da:** telefon tarayıcısı temizlenmediği sürece kalır
- **Tamamen statik:** GitHub Pages'te bedavaya çalışır

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcı `http://localhost:5173` adresini açar.

Test etmek için:
- Info ekranı: `http://localhost:5173/`
- Parça açmak: `http://localhost:5173/?p=1` … `?p=9`
- QR admin paneli: `http://localhost:5173/?admin=1`
- State sıfırla: `http://localhost:5173/?reset=1`

## Yayına Alma (GitHub Pages)

**Otomatik (önerilen):**
1. Bu klasörü bir GitHub reposuna yükle.
2. Repo → **Settings → Pages → Source: GitHub Actions** olarak ayarla.
3. `main` branch'ine push yap. Otomatik build ve deploy olur.
4. URL: `https://<kullanıcı>.github.io/<repo>/`

**Manuel:**
```bash
npm run build     # dist/ klasörü çıkar
# dist içeriğini gh-pages branch'ine push et (gh-pages paketi bunu yapar)
npm run deploy
```

## QR Kodlarını Almak

Site yayına alındıktan sonra:

1. `https://<kullanıcı>.github.io/<repo>/?admin=1` adresini aç
2. 10 tane QR göreceksin — hepsini indir
3. **00 numaralı** QR'ı ilk sakıza yapıştır (siteyi açan, bilgilendirme sakızı)
4. **01–09** numaralı QR'ları diğer 9 sakıza dağıt (hangi numaranın nereye gittiği önemli değil, sıra yok)

QR kodları sadece o sitenin URL'sini içerir — telefonda kamera ile okutulunca doğrudan tarayıcı açılır.

## İçeriği Özelleştirme

Tüm metinler `src/config.ts` dosyasında. Değiştir, kaydet, push et:

- `intro.body` — info QR açıldığında görünen metin
- `invitation.day / place / time` — davet detayları (gün, mekan, saat)
- `invitation.headline` — büyük başlık (default: "Kahve?")
- `unlockMessages` — bir parça açıldığında rastgele biri seçilir
- `completionMessage` — bitince görünen ufak metin

Tasarım renklerini değiştirmek için: `tailwind.config.js` → `theme.extend.colors`.

## Notlar

- Yapboz tamamlanınca konfeti çıkar, sonrasında davet yazısı belirginleşir.
- Aynı QR'ı iki kez okutursa "bunu zaten bulmuştun" mesajı çıkar.
- Info QR'ı defalarca okutulabilir — sadece siteyi açar, state'i bozmaz.
- `?admin=1` sadece senin bileceğin bir URL — bu linki paylaşma.
- Tarayıcı verilerini temizlerse ilerleme gider. Bunu önemsiyorsan localStorage yerine URL tabanlı state'e geçmek gerekir (şu an ihtiyaç olduğunu sanmıyorum).

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- Framer Motion (parça açılış animasyonları)
- canvas-confetti (tamamlanma efekti)
- qrcode (admin panelinde QR üretimi)
