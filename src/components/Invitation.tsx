import { config } from '../config';

/**
 * Yapbozun altındaki davet.
 * 9 parça açıldıkça bu tasarım kademe kademe görünür.
 * Tamamlandığında final ekranı için de bu component kullanılır (büyütülmüş halde).
 */
export function Invitation() {
  const { invitation } = config;

  return (
    <div className="relative grain w-full h-full bg-accent text-paper flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      {/* Corner marks — like a printed card's crop marks */}
      <CornerMark className="top-3 left-3" rotate={0} />
      <CornerMark className="top-3 right-3" rotate={90} />
      <CornerMark className="bottom-3 left-3" rotate={-90} />
      <CornerMark className="bottom-3 right-3" rotate={180} />

      <span className="font-mono text-[10px] uppercase tracking-[0.28em] opacity-70 mb-4">
        {invitation.eyebrow}
      </span>

      <h1
        className="font-display font-light leading-none mb-6"
        style={{ fontSize: 'clamp(3rem, 18vw, 6rem)' }}
      >
        {invitation.headline}
      </h1>

      <div className="space-y-1.5 text-[13px] font-medium opacity-95">
        <div>{invitation.day}</div>
        <div className="font-display italic text-base opacity-90">
          {invitation.place}
        </div>
        <div className="font-mono">{invitation.time}</div>
      </div>

      <div className="absolute bottom-4 right-5 font-mono text-[10px] opacity-60">
        {invitation.signature}
      </div>
    </div>
  );
}

function CornerMark({
  className,
  rotate,
}: {
  className: string;
  rotate: number;
}) {
  return (
    <div
      className={`absolute w-3 h-3 ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
      aria-hidden
    >
      <div className="absolute top-0 left-0 w-full h-px bg-paper/50" />
      <div className="absolute top-0 left-0 h-full w-px bg-paper/50" />
    </div>
  );
}
