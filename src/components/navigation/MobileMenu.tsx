import { AnimatePresence, motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
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
            className="fixed top-0 end-0 z-50 h-full w-80 bg-surface-ivory dark:bg-surface-dark flex flex-col pt-20 ps-8 pe-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="absolute top-4 end-4 p-2 rounded-md text-seagrass-600 dark:text-seagrass-400 hover:text-stormy-teal-950 dark:hover:text-celadon-100 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Nav links */}
            <nav className="flex flex-col gap-24">
              {navLinks.map((link) => (
                <NavLink
                  key={link.key}
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      'font-display text-2xl transition-colors duration-200',
                      isActive
                        ? 'text-stormy-teal-950 dark:text-celadon-100'
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
