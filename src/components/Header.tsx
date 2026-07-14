import { useConfig } from '../hooks/useConfig';

interface Props {
  found: number;
  total: number;
}

export function Header({ found, total }: Props) {
  const { brand } = useConfig();
  return (
    <header className="flex items-center justify-between text-ink/70 py-4">
      <span className="font-mono text-[11px] uppercase tracking-[0.25em]">
        {brand}
      </span>
      <span className="font-mono text-[11px] tabular-nums">
        {String(found).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </header>
  );
}
