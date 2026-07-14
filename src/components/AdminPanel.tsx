import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ALL_PIECES } from '../hooks/usePuzzleState';
import {
  defaultConfig,
  saveOverrides,
  clearOverrides,
  loadOverrides,
  getConfig,
  type Config,
} from '../config';

interface QrEntry {
  label: string;
  url: string;
  dataUrl: string;
}

/**
 * Yönetim paneli. site.com/?admin=1 ile açılır.
 * - QR kodlarını üretir ve indirir
 * - Cihazdaki ilerlemeyi sıfırlar
 * - Metinleri düzenler (bu cihazda önizleme + GitHub için kod üretme)
 */
export function AdminPanel() {
  const [entries, setEntries] = useState<QrEntry[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [draft, setDraft] = useState<Config>(() => getConfig());
  const [status, setStatus] = useState<{ text: string; kind: 'ok' | 'warn' } | null>(null);
  const [copyOpen, setCopyOpen] = useState(false);
  const [generated, setGenerated] = useState('');

  useEffect(() => {
    const origin = window.location.origin + window.location.pathname;
    setBaseUrl(origin);

    const targets = [
      { label: '00 — Info QR', url: origin },
      ...ALL_PIECES.map((n) => ({
        label: `${String(n).padStart(2, '0')} — Parça ${n}`,
        url: `${origin}?p=${n}`,
      })),
    ];

    Promise.all(
      targets.map(async (t) => ({
        ...t,
        dataUrl: await QRCode.toDataURL(t.url, {
          width: 512,
          margin: 2,
          color: { dark: '#2B1B17', light: '#F4EBDD' },
        }),
      })),
    ).then(setEntries);
  }, []);

  const flash = (text: string, kind: 'ok' | 'warn' = 'ok', ms = 2500) => {
    setStatus({ text, kind });
    window.setTimeout(() => setStatus(null), ms);
  };

  const resetProgress = () => {
    localStorage.removeItem('bubble-pieces-v1');
    localStorage.removeItem('bubble-seen-intro-v1');
    flash('Bu cihazdaki ilerleme sıfırlandı');
  };

  const savePreview = () => {
    // Only save what actually differs from defaults (keeps overrides small)
    saveOverrides(draft);
    flash('Bu cihazda önizleme kaydedildi');
  };

  const resetToDefaults = () => {
    clearOverrides();
    setDraft(defaultConfig);
    flash('Metinler varsayılana döndü');
  };

  const openCopyPanel = () => {
    setGenerated(generateConfigFile(draft));
    setCopyOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generated);
      flash('Kopyalandı — GitHub\'da src/config.ts dosyasına yapıştır');
    } catch {
      flash('Kopyalama başarısız — metni elle seçip kopyala', 'warn');
    }
  };

  // Update helpers ------------------------------------------------------
  const patchIntro = (patch: Partial<Config['intro']>) =>
    setDraft((d) => ({ ...d, intro: { ...d.intro, ...patch } }));
  const patchInvitation = (patch: Partial<Config['invitation']>) =>
    setDraft((d) => ({ ...d, invitation: { ...d.invitation, ...patch } }));
  const patchHint = (n: number, value: string) =>
    setDraft((d) => ({
      ...d,
      pieceHints: { ...d.pieceHints, [n]: value },
    }));

  const bodyText = draft.intro.body.join('\n\n');
  const setBodyText = (text: string) => {
    const parts = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
    patchIntro({ body: parts.length ? parts : [''] });
  };

  const unlockText = draft.unlockMessages.join('\n');
  const setUnlockText = (text: string) => {
    const parts = text.split('\n').map((m) => m.trim()).filter(Boolean);
    setDraft((d) => ({ ...d, unlockMessages: parts }));
  };

  const hasOverrides = Object.keys(loadOverrides()).length > 0;

  return (
    <div className="min-h-screen bg-paper text-ink px-5 py-8">
      {status && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
            status.kind === 'warn' ? 'bg-highlight text-ink' : 'bg-ink text-paper'
          }`}
        >
          {status.text}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-10">
        <header>
          <h1 className="font-display text-3xl mb-1">Yönetim</h1>
          <p className="text-xs text-ink/60 font-mono break-all">{baseUrl}</p>
        </header>

        {/* Reset progress ---------------------------------------------- */}
        <Section title="Bu cihazdaki ilerlemeyi sıfırla">
          <p className="text-sm text-ink/70">
            Test amaçlı QR'lar okuttuysan veya admin panelinden linklere
            tıkladıysan, ilerlemeyi buradan temizle. Bu sadece bu cihazı etkiler,
            Gamze'nin cihazını değil.
          </p>
          <button
            onClick={resetProgress}
            className="mt-3 border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
          >
            Sıfırla
          </button>
        </Section>

        {/* Text editor ------------------------------------------------- */}
        <Section title="Metinleri düzenle">
          <p className="text-sm text-ink/70 mb-4">
            Buradaki değişiklikler önce sadece bu cihazda görünür (önizleme).
            Gamze'nin de görmesi için "GitHub için kodu üret" butonuna basıp
            çıkan metni GitHub'daki <code className="font-mono">src/config.ts</code> dosyasına yapıştır.
            {hasOverrides && (
              <span className="block mt-2 text-highlight-dark">
                Şu an aktif önizleme değişikliklerin var.
              </span>
            )}
          </p>

          <Field label="Selamlama">
            <input
              type="text"
              value={draft.intro.greeting}
              onChange={(e) => patchIntro({ greeting: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Giriş metni (paragrafları boş satırla ayır)">
            <textarea
              rows={8}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className={inputCls}
            />
          </Field>

          <h3 className="font-medium text-sm mt-6 mb-2 text-ink/80">Davet</h3>
          <Field label="Üst yazı">
            <input
              type="text"
              value={draft.invitation.eyebrow}
              onChange={(e) => patchInvitation({ eyebrow: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Büyük başlık">
            <input
              type="text"
              value={draft.invitation.headline}
              onChange={(e) => patchInvitation({ headline: e.target.value })}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Gün">
              <input
                type="text"
                value={draft.invitation.day}
                onChange={(e) => patchInvitation({ day: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Yer">
              <input
                type="text"
                value={draft.invitation.place}
                onChange={(e) => patchInvitation({ place: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Saat">
              <input
                type="text"
                value={draft.invitation.time}
                onChange={(e) => patchInvitation({ time: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="İmza">
            <input
              type="text"
              value={draft.invitation.signature}
              onChange={(e) => patchInvitation({ signature: e.target.value })}
              className={inputCls}
            />
          </Field>

          <h3 className="font-medium text-sm mt-6 mb-2 text-ink/80">
            Yapboz parçası ipuçları
          </h3>
          <p className="text-xs text-ink/60 mb-3">
            Her parçanın altında görünür — "her hediye nerede?" ipucu. Kısa tut.
            Boş bırakırsan sadece "?" görünür.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <Field key={n} label={`Parça ${n}`}>
                <input
                  type="text"
                  value={draft.pieceHints[n] ?? ''}
                  onChange={(e) => patchHint(n, e.target.value)}
                  className={inputCls}
                  placeholder="ipucu"
                />
              </Field>
            ))}
          </div>

          <h3 className="font-medium text-sm mt-6 mb-2 text-ink/80">
            Küçük teşvik mesajları
          </h3>
          <p className="text-xs text-ink/60 mb-2">
            Bir parça açıldığında rastgele biri seçilir. Her satır bir mesaj.
          </p>
          <textarea
            rows={5}
            value={unlockText}
            onChange={(e) => setUnlockText(e.target.value)}
            className={inputCls}
          />

          <Field label="Tamamlanma mesajı">
            <input
              type="text"
              value={draft.completionMessage}
              onChange={(e) =>
                setDraft((d) => ({ ...d, completionMessage: e.target.value }))
              }
              className={inputCls}
            />
          </Field>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={savePreview}
              className="border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
            >
              Bu cihazda önizle
            </button>
            <button
              onClick={openCopyPanel}
              className="bg-accent text-paper px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              GitHub için kodu üret
            </button>
            <button
              onClick={resetToDefaults}
              className="border border-ink/30 text-ink/70 px-4 py-2 text-sm font-medium hover:bg-ink/5 transition-colors"
            >
              Varsayılana dön
            </button>
            <a
              href={baseUrl}
              className="ml-auto text-sm underline self-center"
            >
              siteyi gör →
            </a>
          </div>
        </Section>

        {/* QR codes ---------------------------------------------------- */}
        <Section title="QR kodları">
          <p className="text-sm text-ink/70 mb-4">
            <strong>00</strong> numaralı QR ilk (bilgilendirme) sakızına gider.
            <strong> 01–09</strong> arası her biri farklı bir sakıza — hangi
            numaranın nereye gittiği önemli değil, sırasız çalışıyor.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {entries.map((e) => (
              <div key={e.url} className="bg-paper-warm rounded-lg p-3">
                <img src={e.dataUrl} alt={e.label} className="w-full rounded" />
                <div className="mt-2 text-xs font-mono">{e.label}</div>
                <a
                  href={e.dataUrl}
                  download={`bubble-qr-${e.label.split(' ')[0]}.png`}
                  className="mt-1 inline-block text-xs font-medium border-b border-ink pb-0.5"
                >
                  indir
                </a>
              </div>
            ))}
          </div>
        </Section>

        <footer className="text-xs text-ink/50 pb-8">
          <p>
            Bu panel sadece sen görüyorsun. URL'yi kimseyle paylaşma. Ana site:{' '}
            <a href={baseUrl} className="underline">
              {baseUrl}
            </a>
          </p>
        </footer>
      </div>

      {/* Copy modal -------------------------------------------------- */}
      {copyOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 flex items-center justify-center p-4"
          onClick={() => setCopyOpen(false)}
        >
          <div
            className="bg-paper max-w-2xl w-full rounded-lg p-6 max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl mb-2">GitHub için kod</h2>
            <p className="text-sm text-ink/70 mb-4">
              GitHub'da <code className="font-mono text-xs">src/config.ts</code>{' '}
              dosyasını aç (kalem ikonu), içindeki her şeyi seç ve sil, aşağıdaki
              metni yapıştır, "Commit changes" de. ~1 dakikada canlıya iner.
            </p>
            <textarea
              readOnly
              value={generated}
              className="flex-1 font-mono text-xs bg-paper-warm p-3 rounded border border-ink/10 resize-none min-h-[200px]"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={copyToClipboard}
                className="bg-ink text-paper px-4 py-2 text-sm font-medium"
              >
                Panoya kopyala
              </button>
              <button
                onClick={() => setCopyOpen(false)}
                className="border border-ink/30 px-4 py-2 text-sm"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- helpers ----------------------------------------------------------

const inputCls =
  'w-full bg-paper-warm/60 border border-ink/15 rounded px-3 py-2 text-sm font-sans text-ink focus:outline-none focus:border-ink/50 focus:bg-paper-warm resize-y';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-paper-warm/40 rounded-lg p-5 border border-ink/10">
      <h2 className="font-display text-xl mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mb-3">
      <span className="block text-xs text-ink/60 mb-1 font-medium">{label}</span>
      {children}
    </label>
  );
}

/**
 * config.ts dosyasının tam içeriğini üretir.
 * Yardımcı fonksiyonları koruruz — sadece defaultConfig değerlerini yenileriz.
 */
function generateConfigFile(c: Config): string {
  const q = (s: string) => JSON.stringify(s);
  const bodyItems = c.intro.body.map((p) => `      ${q(p)},`).join('\n');
  const hintEntries = Object.entries(c.pieceHints)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([k, v]) => `    ${k}: ${q(v || '')},`)
    .join('\n');
  const unlockItems = c.unlockMessages.map((m) => `    ${q(m)},`).join('\n');

  return `/**
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
    greeting: ${q(c.intro.greeting)},
    body: [
${bodyItems}
    ],
  },

  invitation: {
    eyebrow: ${q(c.invitation.eyebrow)},
    headline: ${q(c.invitation.headline)},
    day: ${q(c.invitation.day)},
    place: ${q(c.invitation.place)},
    time: ${q(c.invitation.time)},
    signature: ${q(c.invitation.signature)},
  },

  pieceHints: {
${hintEntries}
  },

  unlockMessages: [
${unlockItems}
  ],

  completionMessage: ${q(c.completionMessage)},
  brand: ${q(c.brand)},
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
`;
}
