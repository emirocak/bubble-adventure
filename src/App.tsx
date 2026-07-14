import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';
import { usePuzzleState } from './hooks/usePuzzleState';
import { useConfig } from './hooks/useConfig';
import { PuzzleBoard } from './components/PuzzleBoard';
import { IntroSection } from './components/IntroSection';
import { Header } from './components/Header';
import { UnlockToast } from './components/UnlockToast';
import { AdminPanel } from './components/AdminPanel';

function useIsAdmin() {
  const [isAdmin] = useState(() => {
    const p = new URLSearchParams(window.location.search);
    return p.get('admin') === '1';
  });
  return isAdmin;
}

export default function App() {
  const isAdmin = useIsAdmin();
  if (isAdmin) return <AdminPanel />;
  return <MainApp />;
}

function MainApp() {
  const config = useConfig();
  const {
    pieces,
    isComplete,
    justUnlocked,
    clearJustUnlocked,
    alreadyHad,
    clearAlreadyHad,
  } = usePuzzleState();

  const [toastKey, setToastKey] = useState<number | null>(null);
  const [alreadyKey, setAlreadyKey] = useState<number | null>(null);
  const completionFiredRef = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (justUnlocked !== null) {
      setToastKey(Date.now());
      // Auto-scroll to the board so the reveal animation is visible
      boardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      const t = setTimeout(() => clearJustUnlocked(), 2500);
      return () => clearTimeout(t);
    }
  }, [justUnlocked, clearJustUnlocked]);

  useEffect(() => {
    if (alreadyHad !== null) {
      setAlreadyKey(Date.now());
      boardRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      const t = setTimeout(() => clearAlreadyHad(), 2500);
      return () => clearTimeout(t);
    }
  }, [alreadyHad, clearAlreadyHad]);

  useEffect(() => {
    if (isComplete && !completionFiredRef.current) {
      completionFiredRef.current = true;
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#E14B4E', '#F5B94F', '#EDDFCB', '#F4EBDD'],
          scalar: 0.9,
        });
      }, 900);
    }
  }, [isComplete]);

  return (
    <div className="min-h-full">
      <UnlockToast triggerKey={toastKey} variant="unlock" />
      <UnlockToast triggerKey={alreadyKey} variant="already" />

      <div className="max-w-md w-full mx-auto px-5 pb-12">
        <Header found={pieces.size} total={9} />

        <IntroSection />

        <div className="py-4">
          <PuzzleBoard
            ref={boardRef}
            pieces={pieces}
            justUnlocked={justUnlocked}
            isComplete={isComplete}
          />
        </div>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="text-center mt-6"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
                {config.completionMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isComplete && pieces.size > 0 && (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40 mt-6">
            {9 - pieces.size} parça kaldı
          </p>
        )}
      </div>
    </div>
  );
}
