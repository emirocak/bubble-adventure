import { motion } from 'framer-motion';
import { config } from '../config';

interface Props {
  onDismiss: () => void;
}

export function IntroScreen({ onDismiss }: Props) {
  const { intro } = config;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 bg-paper overflow-y-auto"
    >
      <div className="min-h-full flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="max-w-md w-full"
        >
          <h1 className="font-display text-4xl md:text-5xl font-light mb-8 text-ink">
            {intro.greeting}
          </h1>

          <div className="space-y-4 text-[15px] leading-relaxed text-ink/85">
            {intro.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <button
            onClick={onDismiss}
            className="mt-10 group inline-flex items-center gap-2 text-ink font-medium text-[15px] border-b border-ink pb-1 hover:gap-3 transition-all"
          >
            {intro.ctaLabel}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
