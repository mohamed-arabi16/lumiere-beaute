import { createPortal } from 'react-dom';
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

/* Drawer slides in from the inline-end edge — RTL flips end to left */
const drawerVariantsLTR = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.38, ease: luxuryEase } },
  exit: { x: '100%', transition: { duration: 0.28, ease: luxuryEase } },
};

const drawerVariantsRTL = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: { duration: 0.38, ease: luxuryEase } },
  exit: { x: '-100%', transition: { duration: 0.28, ease: luxuryEase } },
};

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';
  const drawerVariants = isRTL ? drawerVariantsRTL : drawerVariantsLTR;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Backdrop — tap to close ────────────────────────── */}
          <motion.div
            key="mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[199] bg-stormy-teal-950/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Drawer panel ─────────────────────────────────────── */}
          <motion.div
            key="mobile-drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            dir={isRTL ? 'rtl' : 'ltr'}
            className="fixed top-0 end-0 h-full z-[200] w-[82%] max-w-xs bg-surface-ivory dark:bg-surface-dark flex flex-col shadow-[−8px_0_40px_rgba(3,102,102,0.15)] overflow-y-auto"
          >
            {/* Subtle decorative glow */}
            <div
              className="pointer-events-none absolute -top-20 -start-20 w-56 h-56 rounded-full bg-seagrass-500/8 dark:bg-seagrass-500/12 blur-[60px]"
              aria-hidden="true"
            />

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="relative flex items-center justify-between px-5 pt-5 pb-4 border-b border-seagrass-500/10 dark:border-white/5 shrink-0">
              <Link
                to="/"
                onClick={onClose}
                className="flex flex-col leading-none gap-0.5 hover:opacity-75 transition-opacity duration-200"
                aria-label="Lumière Beauté — Home"
              >
                <span className="font-display text-lg text-stormy-teal-950 dark:text-celadon-100 tracking-wide">
                  Lumière Beauté
                </span>
                <span className="text-[0.4rem] tracking-[0.22em] uppercase font-body font-semibold text-seagrass-600 dark:text-seagrass-500 opacity-70">
                  Beauty Studio · Istanbul
                </span>
              </Link>

              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-full bg-seagrass-500/10 dark:bg-white/8 text-seagrass-600 dark:text-mint-leaf-400 hover:bg-seagrass-500/20 dark:hover:bg-white/15 hover:text-stormy-teal-950 dark:hover:text-celadon-100 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Nav links ──────────────────────────────────────── */}
            <nav aria-label="Mobile navigation" className="flex-1 flex flex-col px-3 py-5 gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.055, duration: 0.32, ease: luxuryEase }}
                >
                  <NavLink
                    to={link.to}
                    onClick={onClose}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 w-full px-4 py-3 rounded-xl font-display text-xl transition-all duration-200',
                        isActive
                          ? 'bg-seagrass-500/12 dark:bg-seagrass-500/18 text-stormy-teal-950 dark:text-celadon-100 font-semibold'
                          : 'text-seagrass-600/80 dark:text-seagrass-400/70 hover:bg-seagrass-500/8 dark:hover:bg-seagrass-500/10 hover:text-stormy-teal-950 dark:hover:text-celadon-100',
                      ].join(' ')
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {t(link.key)}
                        {isActive && (
                          <span className="ms-auto w-1.5 h-1.5 rounded-full bg-seagrass-500 shrink-0" />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* ── Bottom controls ─────────────────────────────────── */}
            <div className="shrink-0 flex items-center justify-between px-5 pb-6 pt-4 border-t border-seagrass-500/10 dark:border-white/5">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
