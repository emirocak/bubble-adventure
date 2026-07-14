import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useConfig } from '../hooks/useConfig';

interface Props {
  triggerKey: number | string | null;
  variant?: 'unlock' | 'already';
}

export function UnlockToast({ triggerKey, variant = 'unlock' }: Props) {
  const config = useConfig();
  const [visible, setVisible] = useState(false);

  const message = useMemo(() => {
    if (variant === 'already') return 'bunu zaten bulmuştun';
    const messages = config.unlockMessages;
    if (messages.length === 0) return 'buldun';
    return messages[Math.floor(Math.random() * messages.length)];
  }, [triggerKey, variant, config.unlockMessages]);

  useEffect(() => {
    if (triggerKey === null) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(t);
  }, [triggerKey]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-ink text-paper px-4 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
