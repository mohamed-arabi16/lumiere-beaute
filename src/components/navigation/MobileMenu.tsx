import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ key: string; to: string }>;
}

const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const menuVariantsLTR = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.4, ease: luxuryEase } },
  exit: { x: '100%', transition: { duration: 0.3, ease: luxuryEase } },
};

const menuVariantsRTL = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.4, ease: luxuryEase } },
  exit: { x: '-100%', transition: { duration: 0.3, ease: luxuryEase } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.07, duration: 0.4, ease: luxuryEase },
  }),
};

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const menuVariants = isRTL ? menuVariantsRTL : menuVariantsLTR;

  return (
    <AnimatePresence>
      {isOpen && (
        /* Full-screen panel — covers entire viewport, no max-width cap */
        <motion.div
          key="mobile-panel"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed inset-0 z-50 bg-surface-ivory dark:bg-surface-dark flex flex-col overflow-hidden"
        >
          {/* Decorative ambient glow — top corner */}
          <div
            className="pointer-events-none absolute -top-32 -end-32 w-80 h-80 rounded-full bg-seagrass-500/10 dark:bg-seagrass-500/15 blur-[80px]"
            aria-hidden="true"
          />
          {/* Decorative ambient glow — bottom corner */}
          <div
            className="pointer-events-none absolute -bottom-24 -start-24 w-64 h-64 rounded-full bg-celadon-100/15 dark:bg-celadon-100/5 blur-[60px]"
            aria-hidden="true"
          />

          {/* ── Header ─────────────────────────────── */}
          <div className="relative flex items-center justify-center px-6 pt-6 pb-5 border-b border-seagrass-500/10 dark:border-white/5 shrink-0">
            {/* Close button — always at the inline-end corner */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="absolute end-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-seagrass-500/12 dark:bg-white/8 text-seagrass-600 dark:text-mint-leaf-400 hover:bg-seagrass-500/22 dark:hover:bg-white/15 hover:text-stormy-teal-950 dark:hover:text-celadon-100 transition-all duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Centered logo — links to home */}
            <Link
              to="/"
              onClick={onClose}
              className="flex flex-col items-center leading-none gap-1 hover:opacity-75 transition-opacity duration-200"
              aria-label="Lumière Beauté — Home"
            >
              <span className="font-display text-xl text-stormy-teal-950 dark:text-celadon-100 tracking-wide">
                Lumière Beauté
              </span>
              <span className="text-[0.44rem] tracking-[0.24em] uppercase font-body font-semibold text-seagrass-600 dark:text-seagrass-500 opacity-70">
                Beauty Studio · Istanbul
              </span>
            </Link>
          </div>

          {/* ── Nav links ──────────────────────────── */}
          <nav className="flex-1 flex flex-col items-center justify-center gap-2 py-8">
            {/* Ornamental top rule */}
            <div className="flex items-center gap-2 mb-6 opacity-30" aria-hidden="true">
              <div className="h-px w-8 bg-seagrass-500" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-seagrass-500" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500" />
              <div className="h-px w-8 bg-seagrass-500" />
            </div>

            {navLinks.map((link, i) => (
              <motion.div
                key={link.key}
                custom={i}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                className="w-full"
              >
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    [
                      'block font-display text-4xl text-center w-full px-8 py-3 transition-all duration-200',
                      isActive
                        ? 'text-stormy-teal-950 dark:text-celadon-100'
                        : 'text-seagrass-600/80 dark:text-seagrass-400/70 hover:text-stormy-teal-950 dark:hover:text-celadon-100',
                    ].join(' ')
                  }
                >
                  {t(link.key)}
                </NavLink>
              </motion.div>
            ))}

            {/* Ornamental bottom rule */}
            <div className="flex items-center gap-2 mt-6 opacity-30" aria-hidden="true">
              <div className="h-px w-8 bg-seagrass-500" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-seagrass-500" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500" />
              <div className="h-px w-8 bg-seagrass-500" />
            </div>
          </nav>

          {/* ── Bottom controls ────────────────────── */}
          <div className="shrink-0 flex items-center justify-center gap-4 px-6 pb-8 pt-4 border-t border-seagrass-500/10 dark:border-white/5">
            <LanguageSwitcher />
            <div className="w-px h-4 bg-seagrass-500/20" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
