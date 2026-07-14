/**
 * Bütün özelleştirilebilir metinler burada.
 * Dizayn dosyalarına dokunmadan hepsini buradan değiştirebilirsin.
 */

export const config = {
  /**
   * İlk QR (bilgilendirme sakızı) okutulduğunda görünen ekran.
   * body paragrafları sıra ile alt alta gösterilir.
   */
  intro: {
    greeting: 'Selam 🙃',
    body: [
      'Sana bir sürü Big Babol verdim, farkındasın — sebepsiz değildi. Her birinin arkasında ufak bir QR var. Bunu zaten okuttun, bu seni sadece buraya getirdi.',
      'Diğer 9 tanesinde birer yapboz parçası saklı. Okuttukça aşağıdaki kare kendi kendine tamamlanacak. Sıra yok, hangisini önce bulursan olur. Aceleye de gerek yok — bir kısmını bugün, bir kısmını başka gün bulsan da olur, ilerlemen kaybolmuyor.',
      'Sonunda ne çıkacağını söylemiyorum tabii ki, sürprizi olmaz. Küçük bir şey ama tamamlamaya değer 😊',
      'Kolay gelsin.',
    ],
    ctaLabel: 'Yapbozu Gör',
  },

  /**
   * Yapboz tamamen çözüldüğünde ortaya çıkan davet.
   * Yapbozun kendisi bu metin. 9 parça birleşince bunu okuyor.
   */
  invitation: {
    eyebrow: 'sadece bir soru',
    headline: 'Kahve?',
    day: 'Cuma',
    place: 'kafe adı',
    time: '17:00',
    signature: '— Emir',
  },

  /**
   * Bir parça açıldığında rastgele biri seçilir.
   * Ton: hafif, arkadaşça, muzip.
   */
  unlockMessages: [
    'buldun ✨',
    'bir tane daha',
    'iyi gidiyor',
    'devam',
    'güzel',
    'hı hı, doğru yol',
    'yakınsın',
    'oh be',
  ],

  /** 9. parça açıldığında ekranın üstünde beliren minik başlık */
  completionMessage: 'oldu bak',

  /** Header'daki küçük başlık */
  brand: 'Bubble',
};

export type Config = typeof config;
