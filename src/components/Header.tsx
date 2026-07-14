import { config } from '../config';

interface Props {
  found: number;
  total: number;
  onOpenIntro: () => void;
}

export function Header({ found, total, onOpenIntro }: Props) {
  return (
    <header className="flex items-center justify-between text-ink/70">
      <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
        {config.brand}
      </span>

      <div className="flex items-center gap-4">
        <span className="font-mono text-[11px] tabular-nums">
          {String(found).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          onClick={onOpenIntro}
          aria-label="Bilgi"
          className="w-6 h-6 rounded-full border border-ink/25 text-[11px] font-mono flex items-center justify-center hover:bg-ink/5 transition-colors"
        >
          ?
        </button>
      </div>
    </header>
  );
}
