import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-seagrass-500/20 bg-surface-ivory/80 dark:bg-surface-dark/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <span className="font-display text-xl text-stormy-teal-950 dark:text-celadon-100">
          Lumiere Beaute
        </span>

        {/* Desktop navigation links */}
        <ul className="hidden md:flex items-center gap-6 list-none m-0 p-0">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  [
                    'font-body text-sm transition-colors duration-200',
                    isActive
                      ? 'text-stormy-teal-950 dark:text-celadon-100 font-medium'
                      : 'text-seagrass-600 dark:text-seagrass-400 hover:text-stormy-teal-950 dark:hover:text-celadon-100',
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
            className="md:hidden p-2 rounded-md text-seagrass-600 dark:text-seagrass-400 hover:text-stormy-teal-950 dark:hover:text-celadon-100 transition-colors duration-200"
          >
            <div className="flex flex-col justify-center">
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current mb-1" />
              <span className="block w-5 h-0.5 bg-current" />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile slide-out menu — outside <nav> but inside <header> so it overlays full screen */}
      <MobileMenu
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        navLinks={NAV_LINKS as unknown as Array<{ key: string; to: string }>}
      />
    </header>
  );
}
