import { motion } from 'framer-motion';
import type { PieceId } from '../hooks/usePuzzleState';

interface Props {
  id: PieceId;
  unlocked: boolean;
  wasJustUnlocked: boolean;
  hint: string;
}

const rotations = [-1.5, 1, -0.5, 1.5, -1, 0.5, 1.2, -1.2, 0.8];

/**
 * Kilitli parça: krem wrapper üstünde büyük "?", altında küçük ipucu, köşede parça no.
 * Açılınca: soluyor + hafif ölçek + blur — altındaki davet görünür.
 */
export function Piece({ id, unlocked, wasJustUnlocked, hint }: Props) {
  const rotation = rotations[id - 1];

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0 bg-wrapper flex flex-col items-center justify-center px-1.5 py-1 text-center"
        style={{ transformOrigin: 'center' }}
        initial={false}
        animate={{
          opacity: unlocked ? 0 : 1,
          scale: unlocked ? 1.06 : 1,
          filter: unlocked ? 'blur(6px)' : 'blur(0px)',
          rotate: unlocked ? 0 : rotation,
        }}
        transition={{
          duration: wasJustUnlocked ? 0.9 : 0.35,
          ease: [0.4, 0, 0.2, 1],
        }}
      >
        <span
          className="absolute top-1 right-1.5 font-mono text-[9px] text-wrapper-mark/60 select-none"
          aria-hidden
        >
          {String(id).padStart(2, '0')}
        </span>

        <span
          className="font-display font-light text-wrapper-mark select-none leading-none"
          style={{ fontSize: 'clamp(1.5rem, 7vw, 2.25rem)' }}
        >
          ?
        </span>

        {hint && (
          <span className="mt-1 text-wrapper-mark/85 text-[9.5px] leading-tight font-medium max-w-full">
            {hint}
          </span>
        )}
      </motion.div>
    </div>
  );
}
