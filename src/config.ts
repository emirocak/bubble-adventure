/**
 * Bütün özelleştirilebilir metinler burada.
 * Buradan değiştirebilirsin ya da /?admin=1 panelinden düzenleyip
 * "kodu kopyala" ile ürettiğin metni buraya yapıştırabilirsin.
 */

export interface Config {
  intro: {
    greeting: string;
    body: string[];
  };
  invitation: {
    eyebrow: string;
    headline: string;
    day: string;
    place: string;
    time: string;
    signature: string;
  };
  pieceHints: Record<number, string>;
  unlockMessages: string[];
  completionMessage: string;
  brand: string;
}

export const defaultConfig: Config = {
  intro: {
    greeting: 'Selam 🙃',
    body: [
      'Sana bir sürü Big Babol verdim, farkındasın — sebepsiz değildi. Her birinin arkasında ufak bir QR var. Bunu zaten okuttun, bu seni sadece buraya getirdi.',
      'Diğer 9 tanesinde birer yapboz parçası saklı. Okuttukça aşağıdaki kare kendi kendine tamamlanacak. Sıra yok, hangisini önce bulursan olur. Aceleye de gerek yok — bir kısmını bugün, bir kısmını başka gün bulsan da olur, ilerlemen kaybolmuyor.',
      'Sonunda ne çıkacağını söylemiyorum tabii ki, sürprizi olmaz. Küçük bir şey ama tamamlamaya değer 😊',
      'Kolay gelsin.',
    ],
  },

  invitation: {
    eyebrow: 'sadece bir soru',
    headline: 'Kahve?',
    day: 'Cuma',
    place: 'kafe adı',
    time: '17:00',
    signature: '— Emir',
  },

  /**
   * Her yapboz parçasının altında görünen küçük ipucu.
   * Kilitli parça: "?" + bu ipucu. Boş bırakırsan sadece "?" görünür.
   * Uygulama yerlerini yaz — kısa tut (2-4 kelime).
   */
  pieceHints: {
    1: 'İlk Sakladığım yerde',
    2: 'ipucu 2',
    3: 'ipucu 3',
    4: 'ipucu 4',
    5: 'ipucu 5',
    6: 'ipucu 6',
    7: 'ipucu 7',
    8: 'ipucu 8',
    9: 'ipucu 9',
  },

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

  completionMessage: 'oldu bak',
  brand: 'Bubble',
};

// ---- Override machinery (admin panel için) ----

const OVERRIDES_KEY = 'bubble-config-overrides-v1';

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge<T>(base: T, override: unknown): T {
  if (!isPlainObject(override)) return base;
  const result: Record<string, unknown> = isPlainObject(base) ? { ...base } : {};
  for (const key of Object.keys(override)) {
    const bv = (base as Record<string, unknown>)?.[key];
    const ov = override[key];
    if (ov === undefined) continue;
    if (isPlainObject(bv) && isPlainObject(ov)) {
      result[key] = deepMerge(bv, ov);
    } else {
      result[key] = ov;
    }
  }
  return result as T;
}

export function loadOverrides(): Partial<Config> {
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveOverrides(overrides: Partial<Config>) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new Event('bubble-config-updated'));
}

export function clearOverrides() {
  localStorage.removeItem(OVERRIDES_KEY);
  window.dispatchEvent(new Event('bubble-config-updated'));
}

export function getConfig(): Config {
  return deepMerge(defaultConfig, loadOverrides());
}
