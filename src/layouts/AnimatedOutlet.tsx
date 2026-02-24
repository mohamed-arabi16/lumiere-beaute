import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

/**
 * AnimatedOutlet bridges React Router's Outlet with Framer Motion's AnimatePresence.
 *
 * Key decisions:
 * - useOutlet + cloneElement is the ONLY pattern that works for exit animations with React Router.
 *   Wrapping <Outlet> directly in AnimatePresence does not trigger exit animations because
 *   Outlet replaces itself in place — AnimatePresence never sees the child unmount.
 * - mode="wait": old page finishes exit BEFORE new page enters (cinematic feel).
 * - initial={false}: first render appears instantly — no entrance animation on initial load.
 * - key={location.pathname}: route change flips the key so AnimatePresence detects it and
 *   runs exit on the old element + enter on the new element.
 */
export function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}
