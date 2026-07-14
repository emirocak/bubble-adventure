import { motion } from 'framer-motion';
import type { PieceId } from '../hooks/usePuzzleState';

interface Props {
  id: PieceId;
  unlocked: boolean;
  wasJustUnlocked: boolean;
}

/**
 * Kilitli parça: krem/kahverengi wrapper.
 * Açılınca: soluyor + hafif ölçek + blur — altındaki davet görünür.
 * Sabit çok küçük rotasyon her parçaya farklı, "elle yerleştirilmiş" hissi.
 */
export function Piece({ id, unlocked, wasJustUnlocked }: Props) {
  // Slight per-piece rotation for a hand-placed look
  const rotation = [-1.5, 1, -0.5, 1.5, -1, 0.5, 1.2, -1.2, 0.8][id - 1];

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="absolute inset-0 bg-wrapper flex items-center justify-center"
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
        <span className="font-mono text-wrapper-mark text-sm select-none">
          {String(id).padStart(2, '0')}
        </span>
      </motion.div>
    </div>
  );
}
