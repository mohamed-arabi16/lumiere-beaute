import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: Array<{ key: string; to: string }>;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const menuVariantsLTR = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.35, ease: luxuryEase } },
  exit: { x: '100%', transition: { duration: 0.25, ease: luxuryEase } },
};

const menuVariantsRTL = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.35, ease: luxuryEase } },
  exit: { x: '-100%', transition: { duration: 0.25, ease: luxuryEase } },
};

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const menuVariants = isRTL ? menuVariantsRTL : menuVariantsLTR;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="mobile-backdrop"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-40 bg-stormy-teal-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-out panel */}
          <motion.div
            key="mobile-panel"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            dir={isRTL ? 'rtl' : 'ltr'}
            className="fixed top-0 end-0 z-50 h-full w-full max-w-sm bg-surface-ivory dark:bg-surface-dark flex flex-col shadow-2xl"
          >
            {/* Header controls inside menu */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-seagrass-500/10 dark:border-white/5">
              <Link
                to="/"
                onClick={onClose}
                className="flex flex-col leading-none gap-0.5 hover:opacity-80 transition-opacity duration-200"
                aria-label="Lumière Beauté — Home"
              >
                <span className="font-display text-xl text-stormy-teal-950 dark:text-celadon-100 tracking-wide">
                  Lumière Beauté
                </span>
                <span className="text-[0.48rem] tracking-[0.22em] uppercase font-body font-semibold text-seagrass-600 dark:text-mint-leaf-400 opacity-80">
                  Beauty Studio · Istanbul
                </span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-full bg-seagrass-500/10 text-seagrass-600 dark:text-seagrass-400 hover:bg-seagrass-500/20 hover:text-stormy-teal-950 dark:hover:text-celadon-100 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-6 h-6"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col items-center justify-center gap-12 pb-20">
              {navLinks.map((link) => (
                <NavLink
                  key={link.key}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'font-display text-3xl transition-colors duration-200 text-center w-full px-8',
                      isActive
                        ? 'text-stormy-teal-950 dark:text-celadon-100 font-medium'
                        : 'text-seagrass-600 dark:text-seagrass-400 hover:text-stormy-teal-950 dark:hover:text-celadon-100',
                    ].join(' ')
                  }
                >
                  {t(link.key)}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
