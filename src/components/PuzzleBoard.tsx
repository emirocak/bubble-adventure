import { motion } from 'framer-motion';
import { ALL_PIECES, type PieceId } from '../hooks/usePuzzleState';
import { Piece } from './Piece';
import { Invitation } from './Invitation';

interface Props {
  pieces: Set<PieceId>;
  justUnlocked: PieceId | null;
  isComplete: boolean;
}

export function PuzzleBoard({ pieces, justUnlocked, isComplete }: Props) {
  return (
    <motion.div
      className="relative w-full aspect-square max-w-[420px] mx-auto"
      animate={{
        scale: isComplete ? 1.02 : 1,
      }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Card frame */}
      <div className="absolute -inset-2 bg-paper-warm rounded-lg shadow-[0_1px_0_rgba(43,27,23,0.08),0_20px_40px_-20px_rgba(43,27,23,0.2)]" />

      {/* Invitation layer (behind the pieces) */}
      <div className="absolute inset-0 rounded-sm overflow-hidden">
        <Invitation />
      </div>

      {/* 3x3 grid of pieces on top */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {ALL_PIECES.map((id) => (
          <Piece
            key={id}
            id={id}
            unlocked={pieces.has(id)}
            wasJustUnlocked={justUnlocked === id}
          />
        ))}
      </div>

      {/* Subtle grid lines only visible while some pieces are still locked */}
      <GridLines faded={isComplete} />
    </motion.div>
  );
}

function GridLines({ faded }: { faded: boolean }) {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ opacity: faded ? 0 : 1 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="border border-ink/[0.06]" />
        ))}
      </div>
    </motion.div>
  );
}
