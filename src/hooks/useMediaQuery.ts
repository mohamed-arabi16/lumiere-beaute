import { useState, useEffect } from 'react';

/**
 * useMediaQuery — reactive media query hook.
 *
 * Returns true if the window matches the provided CSS media query string.
 * Initializes synchronously from window.matchMedia to avoid hydration flicker.
 *
 * Usage:
 *   const isMobile = useMediaQuery('(max-width: 768px)');
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
