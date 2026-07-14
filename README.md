# Baloncuk Macerası

Mobil uyumlu, QR kodlarla görev tamamlanan romantik hazine avı web sitesi.

## Çalıştırma

Dosyaları aynı klasörde tutun ve `index.html` dosyasını açın.

Daha sağlıklı test için terminalde:

```bash
python3 -m http.server 8000
```

Sonra tarayıcıda:

```text
http://localhost:8000
```

## QR bağlantıları

Her QR kod aşağıdaki bağlantılardan birine gitmeli:

```text
https://SENIN-SITEN.com/?qr=babol-abc-01
https://SENIN-SITEN.com/?qr=babol-pembe-02
https://SENIN-SITEN.com/?qr=babol-sessiz-03
https://SENIN-SITEN.com/?qr=babol-ani-04
https://SENIN-SITEN.com/?qr=babol-final-05
```

## Görevleri değiştirme

`app.js` dosyasındaki `APP_CONFIG.missions` alanından:

- Görev başlığını
- Açıklamayı
- İpuçlarını
- QR anahtarını

değiştirebilirsiniz.

## Yayınlama

Bu proje statik olduğu için ücretsiz olarak şu servislerde yayınlanabilir:

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

## Önemli

İlerleme cihazın tarayıcısında `localStorage` ile saklanır. Başka telefonda açılırsa ilerleme yeniden başlar. Tek kişi kullanacağı için ilk sürümde bu yapı yeterlidir.
