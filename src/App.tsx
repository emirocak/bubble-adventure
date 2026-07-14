import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';
import { usePuzzleState } from './hooks/usePuzzleState';
import { IntroScreen } from './components/IntroScreen';
import { PuzzleBoard } from './components/PuzzleBoard';
import { Header } from './components/Header';
import { UnlockToast } from './components/UnlockToast';
import { AdminPanel } from './components/AdminPanel';
import { config } from './config';

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
  const {
    pieces,
    isComplete,
    seenIntro,
    markIntroSeen,
    justUnlocked,
    clearJustUnlocked,
    alreadyHad,
    clearAlreadyHad,
  } = usePuzzleState();

  const [showIntro, setShowIntro] = useState(!seenIntro);
  const [toastKey, setToastKey] = useState<number | null>(null);
  const [alreadyKey, setAlreadyKey] = useState<number | null>(null);
  const completionFiredRef = useRef(false);

  // Show unlock toast whenever a new piece is unlocked
  useEffect(() => {
    if (justUnlocked !== null) {
      setToastKey(Date.now());
      const t = setTimeout(() => clearJustUnlocked(), 2500);
      return () => clearTimeout(t);
    }
  }, [justUnlocked, clearJustUnlocked]);

  // Show "already had" toast for duplicate scans
  useEffect(() => {
    if (alreadyHad !== null) {
      setAlreadyKey(Date.now());
      const t = setTimeout(() => clearAlreadyHad(), 2500);
      return () => clearTimeout(t);
    }
  }, [alreadyHad, clearAlreadyHad]);

  // Fire confetti when complete
  useEffect(() => {
    if (isComplete && !completionFiredRef.current) {
      completionFiredRef.current = true;
      // Delay so the last piece reveal finishes first
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

  const handleIntroDismiss = () => {
    markIntroSeen();
    setShowIntro(false);
  };

  return (
    <div className="min-h-full flex flex-col">
      <UnlockToast triggerKey={toastKey} variant="unlock" />
      <UnlockToast triggerKey={alreadyKey} variant="already" />

      <AnimatePresence>
        {showIntro && <IntroScreen onDismiss={handleIntroDismiss} />}
      </AnimatePresence>

      <div className="flex-1 flex flex-col max-w-md w-full mx-auto px-5 pt-6 pb-10">
        <Header
          found={pieces.size}
          total={9}
          onOpenIntro={() => setShowIntro(true)}
        />

        <div className="flex-1 flex items-center justify-center py-8">
          <PuzzleBoard
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
              className="text-center"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink/60">
                {config.completionMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {!isComplete && pieces.size > 0 && (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40">
            {9 - pieces.size} parça kaldı
          </p>
        )}
      </div>
    </div>
  );
}
