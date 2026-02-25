import { useMotionValue, useSpring, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

/**
 * CustomCursor — Branded desktop cursor with spring-physics tracking.
 *
 * Behavior:
 * - Small dot (10×10px) at rest
 * - Expands to ring (36×36px) when hovering interactive elements
 * - Hidden on touch devices via shouldReduceMotion + media CSS
 * - Respects prefers-reduced-motion (returns null if reduced)
 * - Uses x/y motion values (transform: translate) — never top/left (no reflow)
 * - Global mouseover delegation via closest() — no per-component coupling
 *
 * Mount location: RootLayout.tsx — outside Navbar and main, z-[9999]
 */
export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  // Only pointer devices (mouse/trackpad) — excludes all touch screens
  const isPointerDevice = useMediaQuery('(hover: hover) and (pointer: fine)');
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // High stiffness + moderate damping = responsive spring with slight organic lag
  const springConfig = { stiffness: 500, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, label'
      );
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Skip on touch devices and for reduced-motion users
  if (!isPointerDevice || shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border-2"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovering ? 36 : 10,
        height: isHovering ? 36 : 10,
        opacity: isVisible ? 1 : 0,
        borderColor: isHovering
          ? 'var(--color-celadon-200)'
          : 'var(--color-stormy-teal-950)',
      }}
      transition={{ duration: 0.12 }}
    />
  );
}
