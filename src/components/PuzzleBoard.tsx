import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { ALL_PIECES, type PieceId } from '../hooks/usePuzzleState';
import { useConfig } from '../hooks/useConfig';
import { Piece } from './Piece';
import { Invitation } from './Invitation';

interface Props {
  pieces: Set<PieceId>;
  justUnlocked: PieceId | null;
  isComplete: boolean;
}

export const PuzzleBoard = forwardRef<HTMLDivElement, Props>(
  function PuzzleBoard({ pieces, justUnlocked, isComplete }, ref) {
    const config = useConfig();

    return (
      <motion.div
        ref={ref}
        className="relative w-full aspect-square max-w-[420px] mx-auto"
        animate={{ scale: isComplete ? 1.02 : 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute -inset-2 bg-paper-warm rounded-lg shadow-[0_1px_0_rgba(43,27,23,0.08),0_20px_40px_-20px_rgba(43,27,23,0.2)]" />

        <div className="absolute inset-0 rounded-sm overflow-hidden">
          <Invitation />
        </div>

        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
          {ALL_PIECES.map((id) => (
            <Piece
              key={id}
              id={id}
              unlocked={pieces.has(id)}
              wasJustUnlocked={justUnlocked === id}
              hint={config.pieceHints[id] ?? ''}
            />
          ))}
        </div>

        <GridLines faded={isComplete} />
      </motion.div>
    );
  },
);

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
