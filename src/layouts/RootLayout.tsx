import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { CustomCursor } from '../components/ui/CustomCursor';
import { useDirection } from '../hooks/useDirection';
import { AnimatedOutlet } from './AnimatedOutlet';

/**
 * RootLayout composes the persistent shell:
 * - Navbar sits outside <main> and outside AnimatePresence — never participates in page transitions
 * - AnimatedOutlet drives animated page transitions (bridges React Router + Framer Motion)
 * - Scroll-to-top on navigation via useEffect (ScrollRestoration requires data router)
 * - useDirection() syncs document.documentElement.dir and lang on language change
 *   (ThemeProvider already manages the dark class — no second effect needed here)
 * - Outer div background matches globals.css html background to prevent visual gap
 */
export function RootLayout() {
  useDirection(); // syncs dir + lang to <html> on language change
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-surface-ivory dark:bg-surface-dark transition-colors duration-300">
      <CustomCursor />
      <Navbar />
      <main>
        <AnimatedOutlet />
      </main>
    </div>
  );
}
