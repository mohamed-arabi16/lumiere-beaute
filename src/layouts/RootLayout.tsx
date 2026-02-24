import { ScrollRestoration } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { useDirection } from '../hooks/useDirection';
import { AnimatedOutlet } from './AnimatedOutlet';

/**
 * RootLayout composes the persistent shell:
 * - Navbar sits outside <main> and outside AnimatePresence — never participates in page transitions
 * - AnimatedOutlet drives animated page transitions (bridges React Router + Framer Motion)
 * - ScrollRestoration resets scroll position to top on every navigation
 * - useDirection() syncs document.documentElement.dir and lang on language change
 *   (ThemeProvider already manages the dark class — no second effect needed here)
 * - Outer div background matches globals.css html background to prevent visual gap
 */
export function RootLayout() {
  useDirection(); // syncs dir + lang to <html> on language change

  return (
    <div className="min-h-screen bg-surface-ivory dark:bg-surface-dark transition-colors duration-300">
      <Navbar />
      <main>
        <AnimatedOutlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}
