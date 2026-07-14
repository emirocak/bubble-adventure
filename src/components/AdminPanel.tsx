import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { ALL_PIECES } from '../hooks/usePuzzleState';

interface QrEntry {
  label: string;
  url: string;
  dataUrl: string;
}

/**
 * Gizli admin sayfası. site.com/?admin=1 ile açılır.
 * Bütün QR kodlarını üretir, PNG olarak indirebilirsin.
 * Sadece sen kullanacaksın — Gamze bu URL'yi bilmiyor.
 */
export function AdminPanel() {
  const [entries, setEntries] = useState<QrEntry[]>([]);
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    const origin = window.location.origin + window.location.pathname;
    setBaseUrl(origin);

    const targets = [
      { label: '00 — Info (bilgilendirme)', url: origin },
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

  return (
    <div className="min-h-screen bg-paper text-ink px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-3xl mb-2">QR Yönetimi</h1>
        <p className="text-sm text-ink/70 mb-1">
          Base URL: <code className="font-mono">{baseUrl}</code>
        </p>
        <p className="text-sm text-ink/70 mb-6">
          Her QR'ı sağ tıklayıp kaydet, yazdır, sakızlara yapıştır. 00 numaralı
          info QR'ını Gamze'ye ilk verdiğin sakıza koy — o siteyi açar. Diğer
          9'unu farklı sakızlara koy (istediğin numaralarla eşleştir, sıra
          önemsiz).
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {entries.map((e) => (
            <div key={e.url} className="bg-paper-warm rounded-lg p-4">
              <img src={e.dataUrl} alt={e.label} className="w-full rounded" />
              <div className="mt-3 text-xs font-mono">{e.label}</div>
              <div className="text-[10px] text-ink/50 break-all mt-1">{e.url}</div>
              <a
                href={e.dataUrl}
                download={`bubble-qr-${e.label.split(' ')[0]}.png`}
                className="mt-2 inline-block text-xs font-medium border-b border-ink pb-0.5"
              >
                indir
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 text-xs text-ink/60 space-y-1">
          <p>
            İpuçları:{' '}
            <a href={baseUrl + '?reset=1'} className="underline">
              state'i sıfırla
            </a>{' '}
            (test için).
          </p>
          <p>
            <a href={baseUrl} className="underline">
              normal siteye dön
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
