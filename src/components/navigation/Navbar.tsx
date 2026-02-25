import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { useDirection } from '../../hooks/useDirection';

const NAV_LINKS = [
  { key: 'nav.home', to: '/' },
  { key: 'nav.services', to: '/services' },
  { key: 'nav.academy', to: '/academy' },
  { key: 'nav.about', to: '/about' },
  { key: 'nav.contact', to: '/contact' },
] as const;

export function Navbar() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isRTL } = useDirection();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 sm:pt-6 px-2 sm:px-4">
      <header className="w-full max-w-6xl rounded-full border border-seagrass-500/10 dark:border-white/10 bg-surface-ivory/70 dark:bg-surface-dark/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(3,102,102,0.1)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300">
        <nav dir={isRTL ? 'rtl' : 'ltr'} className="mx-auto flex w-full items-center justify-between px-4 py-3 sm:px-8">
          {/* Logo — links to homepage */}
          <Link
            to="/"
            className="flex flex-col leading-none gap-0.5 hover:opacity-80 transition-opacity duration-200"
            aria-label="Lumière Beauté — Home"
          >
            <span className="font-display text-xl sm:text-2xl text-stormy-teal-950 dark:text-celadon-100 tracking-wide">
              Lumière Beauté
            </span>
            <span className="hidden sm:block text-[0.48rem] tracking-[0.22em] uppercase font-body font-semibold text-seagrass-600 dark:text-seagrass-500 opacity-80">
              Beauty Studio · Istanbul
            </span>
          </Link>

          {/* Desktop navigation links */}
          <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    [
                      'font-body text-sm transition-all duration-200 pb-0.5 border-b-2',
                      isActive
                        ? 'text-stormy-teal-950 dark:text-celadon-100 font-semibold border-stormy-teal-950/40 dark:border-celadon-100/40'
                        : 'text-seagrass-600 dark:text-mint-leaf-400 hover:text-stormy-teal-950 dark:hover:text-celadon-100 border-transparent',
                    ].join(' ')
                  }
                >
                  {t(link.key)}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Controls: LanguageSwitcher, ThemeToggle, Hamburger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Hamburger button - mobile only */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full bg-seagrass-500/20 dark:bg-white/15 text-seagrass-700 dark:text-mint-leaf-400 hover:bg-seagrass-500/30 dark:hover:bg-white/25 hover:text-stormy-teal-950 dark:hover:text-celadon-100 transition-all duration-200"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden="true">
                <span className="block w-[18px] h-[1.5px] bg-current rounded-full" />
                <span className="block w-[12px] h-[1.5px] bg-current rounded-full ms-auto" />
                <span className="block w-[18px] h-[1.5px] bg-current rounded-full" />
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile slide-out menu */}
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          navLinks={NAV_LINKS as unknown as Array<{ key: string; to: string }>}
        />
      </header>
    </div>
  );
}
