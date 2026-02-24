# Phase 2: Shell - Research

**Researched:** 2026-02-24
**Domain:** React Router v7 + Framer Motion AnimatePresence page transitions + responsive navbar with RTL support
**Confidence:** HIGH

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDTN-06 | User experiences cinematic full-screen transitions when navigating between pages | AnimatedOutlet + AnimatePresence mode="wait" pattern; RTL-aware variant functions with custom prop; cinematic easing curves documented |
| FNDTN-07 | User has a fully functional experience on mobile (390px) through desktop (1440px) with no horizontal scroll | sticky/fixed navbar with Tailwind responsive breakpoints; mobile hamburger menu with AnimatePresence overlay; logical properties enforce no overflow |
| NAV-01 | User can navigate all pages via a responsive navbar with language switcher and theme toggle | Navbar component consumes useTheme + useDirection + useTranslation from Phase 1 hooks; sticky positioning with backdrop-blur pattern |
| NAV-02 | Mobile user can access navigation via an animated hamburger menu | Framer Motion variants for hamburger icon morph and full-screen overlay; isOpen state with AnimatePresence for menu body |
</phase_requirements>

---

## Summary

Phase 2 builds the complete application shell on top of the verified Phase 1 infrastructure. The primary technical challenge is wiring React Router v7 (BrowserRouter, declarative mode) with Framer Motion's AnimatePresence to produce cinematic full-screen page transitions — which requires the AnimatedOutlet pattern rather than a naive `<AnimatePresence><Outlet /></AnimatePresence>` approach, because AnimatePresence can only animate its direct children.

The Navbar is a composition of three already-available hooks (`useTheme`, `useDirection`, `useTranslation`) that Phase 1 delivered. It must be sticky, use backdrop-blur for the luxury glass effect, and collapse into an animated hamburger menu at mobile viewports. The hamburger overlay must itself use AnimatePresence so the close animation plays before the overlay unmounts.

The shell has zero new external library dependencies. All required packages — `framer-motion@12.34.3`, `react-router-dom@7.13.1` — are already installed. Phase 2 tasks are: (1) add BrowserRouter to AppProviders and define the five routes, (2) build AnimatedOutlet + RootLayout + animation variants, (3) build the Navbar with language switcher, theme toggle, and mobile hamburger overlay, (4) build stub page components that verify full navigation cycle works end-to-end.

**Primary recommendation:** Use the `useOutlet` + `React.cloneElement` AnimatedOutlet pattern (not `<Outlet>` wrapped directly) with `AnimatePresence mode="wait"` and `key={location.pathname}`. For the Navbar, use `sticky top-0 z-50 backdrop-blur-md` with Tailwind logical properties throughout.

---

## Standard Stack

### Core (already installed — no new installs required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router-dom | 7.13.1 | Client-side routing (BrowserRouter + Routes + useLocation) | Already installed Phase 1; v7 declarative mode is correct for SPA with no SSR |
| framer-motion | 12.34.3 | AnimatePresence, motion.div, variants, useAnimation | Already installed Phase 1; same codebase as `motion` package — imports from `framer-motion/react` work identically |
| react | 19.2.0 | useOutlet, cloneElement, useState, useEffect | Already installed |
| tailwindcss | 4.2.1 | sticky, backdrop-blur, responsive prefixes, logical properties | Already installed, configured |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-i18next | 16.5.4 | useTranslation for nav link labels, language switcher | Navbar LanguageSwitcher calls `i18n.changeLanguage()` |
| i18next | 25.8.13 | i18n.dir(), i18n.language | useDirection hook already calls this correctly |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| BrowserRouter (declarative mode) | createBrowserRouter (data mode) | Data mode adds loaders/actions — overkill for this pure SPA with JSON translation files; declarative mode is simpler and entirely sufficient |
| useOutlet + cloneElement AnimatedOutlet | motion.div wrapping Outlet | The `motion.div wrapping Outlet` pattern works for entry animations but exit animations are unreliable because AnimatePresence can't detect Outlet's internal unmount |
| sticky navbar | fixed navbar | sticky is simpler — no need to add padding-top to page content to compensate for fixed height; flows naturally in the layout |

**Installation:**

No new packages needed. All required libraries are already in `package.json` as of Phase 1.

---

## Architecture Patterns

### Recommended Project Structure for Phase 2

```
src/
├── providers/
│   └── AppProviders.tsx         # ADD: BrowserRouter as outermost wrapper
│
├── layouts/
│   ├── RootLayout.tsx           # NEW: Navbar + AnimatedOutlet; owns dir/theme DOM effects
│   └── AnimatedOutlet.tsx       # NEW: useOutlet + AnimatePresence bridge
│
├── pages/                       # NEW directory
│   ├── HomePage.tsx             # Stub: PageTransitionWrapper + placeholder content
│   ├── ServicesPage.tsx         # Stub
│   ├── AcademyPage.tsx          # Stub
│   ├── AboutPage.tsx            # Stub
│   └── ContactPage.tsx          # Stub
│
├── components/
│   ├── ThemeTestComponent.tsx   # REMOVE in App.tsx (kept as file, just unused)
│   └── navigation/              # NEW directory
│       ├── Navbar.tsx           # Sticky header: logo + links + LanguageSwitcher + ThemeToggle
│       ├── LanguageSwitcher.tsx # TR / EN / ع buttons calling i18n.changeLanguage
│       ├── ThemeToggle.tsx      # Sun/moon icon button calling toggleTheme
│       └── MobileMenu.tsx       # Full-screen overlay with AnimatePresence
│
├── animations/                  # NEW directory
│   └── variants.ts              # Shared RTL-aware page transition variant functions
│
├── router.tsx                   # NEW: Route definitions using BrowserRouter
├── App.tsx                      # UPDATE: replace ThemeTestComponent with router.tsx output
└── main.tsx                     # No change
```

---

### Pattern 1: BrowserRouter Addition to AppProviders

**What:** Add `BrowserRouter` as the outermost wrapper in `AppProviders`. Phase 1 intentionally deferred this. Phase 2 adds it without restructuring the existing ThemeProvider > I18nextProvider chain.

**When to use:** Required before any component can use `useNavigate`, `useLocation`, or `<Routes>`.

**Example:**
```typescript
// src/providers/AppProviders.tsx  (updated)
import { type ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
```

**Note:** BrowserRouter wraps everything so all hooks (useNavigate, useLocation) are available inside ThemeProvider and I18nextProvider if ever needed.

---

### Pattern 2: AnimatedOutlet — The Core Integration Pattern

**What:** A dedicated component that uses React Router's `useOutlet()` hook to get the rendered route element, then passes it as a direct child to `AnimatePresence` with `key={location.pathname}`. This is the ONLY reliable way to get exit animations working with React Router.

**Why this is necessary:** `<Outlet>` is a React component that renders the active child route internally. When wrapped directly in `AnimatePresence`, the library cannot detect the inner route change and never triggers exit animations. `useOutlet()` exposes the current route element as a React node you control, allowing you to set the key and let AnimatePresence see the change.

**When to use:** Always — this is the standard AnimatePresence + React Router integration.

```typescript
// src/layouts/AnimatedOutlet.tsx
import { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  // Cache the element to prevent re-renders during exit animation
  const cachedElement = useRef(element);
  if (element) {
    cachedElement.current = element;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {cachedElement.current &&
        // cloneElement stamps a unique key → AnimatePresence detects change
        // and runs exit animation on old element before mounting new one
        Object.assign(Object.create(cachedElement.current), cachedElement.current, {
          key: location.pathname
        }) &&
        // Simpler approach that works:
        null
      }
    </AnimatePresence>
  );
}
```

**Actual recommended implementation (verified pattern from community + official GitHub discussion):**

```typescript
// src/layouts/AnimatedOutlet.tsx
import React, { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}
```

**Critical details:**
- `mode="wait"` — old page finishes exit animation BEFORE new page starts enter animation. Required for full-screen cinematic transitions.
- `initial={false}` — prevents the FIRST page from playing its enter animation on initial load. The page should appear instantly; only navigations trigger transitions.
- `key={location.pathname}` — route changes flip the key, telling AnimatePresence to animate out the old element and animate in the new one.

---

### Pattern 3: RootLayout

**What:** The persistent shell that renders Navbar + AnimatedOutlet. It also owns the `useEffect` that applies `theme` class and `dir` attribute to `<html>`. The Navbar stays mounted across all route changes; only the outlet content transitions.

```typescript
// src/layouts/RootLayout.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { Navbar } from '../components/navigation/Navbar';
import { AnimatedOutlet } from './AnimatedOutlet';

export function RootLayout() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  // Sync theme class to <html> (single source of truth)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  // Sync dir + lang to <html> on language change
  useEffect(() => {
    const updateDir = () => {
      document.documentElement.dir = i18n.dir(i18n.language);
      document.documentElement.lang = i18n.language;
    };
    updateDir(); // run on mount
    i18n.on('languageChanged', updateDir);
    return () => i18n.off('languageChanged', updateDir);
  }, [i18n]);

  return (
    <div className="min-h-screen bg-surface-ivory dark:bg-surface-dark transition-colors duration-300">
      <Navbar />
      <main>
        <AnimatedOutlet />
      </main>
    </div>
  );
}
```

**Note on useDirection vs RootLayout:** `useDirection` already syncs `documentElement.dir/lang` in Phase 1 (called from ThemeTestComponent). In Phase 2, RootLayout should call `useDirection()` to inherit this existing behavior, OR move the effect here and remove from ThemeTestComponent. Since `useDirection` is a hook that already handles the side effect, the cleanest approach is to call `useDirection()` in RootLayout.

---

### Pattern 4: RTL-Aware Page Transition Variants

**What:** Framer Motion variants defined as functions that accept a `dir` value via the `custom` prop. Page transitions slide from the correct side based on reading direction.

```typescript
// src/animations/variants.ts

export type TextDir = 'ltr' | 'rtl';

/**
 * Cinematic full-screen page transition.
 * Slide enters from offscreen right (LTR) or left (RTL),
 * exits to offscreen left (LTR) or right (RTL).
 * Uses cubic-bezier for editorial deceleration feel.
 */
export const pageTransitionVariants = {
  initial: (dir: TextDir) => ({
    opacity: 0,
    x: dir === 'rtl' ? '-5vw' : '5vw',
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1], // custom cubic-bezier: fast decelerate
    },
  },
  exit: (dir: TextDir) => ({
    opacity: 0,
    x: dir === 'rtl' ? '5vw' : '-5vw',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/**
 * Fade-only variant for pages where slide feel is not appropriate.
 */
export const pageFadeVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};
```

**Usage in page stubs:**
```typescript
// src/pages/HomePage.tsx
import { motion } from 'framer-motion';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';

export function HomePage() {
  const { dir } = useDirection();
  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {/* Page content */}
    </motion.div>
  );
}
```

**Critical:** The `custom` prop must be passed on the `motion.div` inside the page component (not on AnimatePresence). AnimatePresence passes `custom` down to the exiting component automatically, which is why this pattern handles the exit direction correctly even after the language may have changed.

---

### Pattern 5: Sticky Navbar with Backdrop Blur

**What:** Navbar that sticks to the top at all scroll positions, with a glass-blur effect over page content.

```typescript
// src/components/navigation/Navbar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../../hooks/useDirection';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';

const NAV_LINKS = [
  { key: 'nav.home',     to: '/'        },
  { key: 'nav.services', to: '/services' },
  { key: 'nav.academy',  to: '/academy'  },
  { key: 'nav.about',    to: '/about'    },
  { key: 'nav.contact',  to: '/contact'  },
];

export function Navbar() {
  const { t } = useTranslation('common');
  const { isRTL } = useDirection();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-seagrass-500/20 bg-surface-ivory/80 dark:bg-surface-dark/80 backdrop-blur-md transition-colors duration-300">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <span className="font-display text-xl text-stormy-teal-950 dark:text-celadon-100">
          Lumiere Beaute
        </span>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6 list-none">
          {NAV_LINKS.map(({ key, to }) => (
            <li key={key}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `font-body text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-stormy-teal-950 dark:text-celadon-100 font-medium'
                      : 'text-seagrass-600 dark:text-seagrass-500 hover:text-stormy-teal-950 dark:hover:text-celadon-100'
                  }`
                }
              >
                {t(key)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Controls: language + theme + hamburger */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          {/* Hamburger — md:hidden */}
          <button
            className="md:hidden p-2 rounded-md text-seagrass-600 dark:text-seagrass-500"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            {/* 3 horizontal bars */}
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current mb-1" />
            <span className="block w-5 h-0.5 bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} navLinks={NAV_LINKS} />
    </header>
  );
}
```

**Tailwind classes rationale:**
- `sticky top-0 z-50` — sticks below scroll, above all page content
- `bg-surface-ivory/80 dark:bg-surface-dark/80 backdrop-blur-md` — luxury glass effect; the `/80` opacity lets blur show through
- `border-b border-seagrass-500/20` — subtle separator without hard edge
- `max-w-7xl mx-auto` — content centering at all viewport sizes
- `px-4 sm:px-6 lg:px-8` — responsive horizontal padding

---

### Pattern 6: Mobile Menu with AnimatePresence

**What:** Full-screen overlay triggered by hamburger button. Uses AnimatePresence so the close animation plays before the overlay unmounts from the DOM.

```typescript
// src/components/navigation/MobileMenu.tsx
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
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const menuVariants = {
  hidden: { x: '100%' },
  visible: {
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '100%',
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

// RTL-aware: slide from inline-end side
const menuVariantsRTL = {
  hidden: { x: '-100%' },
  visible: {
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    x: '-100%',
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  },
};

export function MobileMenu({ isOpen, onClose, navLinks }: MobileMenuProps) {
  const { t, i18n } = useTranslation('common');
  const isRTL = i18n.dir(i18n.language) === 'rtl';

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
            variants={isRTL ? menuVariantsRTL : menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 end-0 z-50 h-full w-80 bg-surface-ivory dark:bg-surface-dark flex flex-col pt-20 px-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 end-4 p-2 text-seagrass-600"
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className="flex flex-col gap-6">
              {navLinks.map(({ key, to }) => (
                <NavLink
                  key={key}
                  to={to}
                  onClick={onClose}
                  className="font-display text-2xl text-stormy-teal-950 dark:text-celadon-100 hover:text-seagrass-600 transition-colors duration-200"
                >
                  {t(key)}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

**RTL Note:** The mobile panel uses `end-0` (logical property = right in LTR, left in RTL) so the panel slides from the correct side automatically. The slide `x` variant still needs manual RTL flip because CSS `x` transform is always physical.

---

### Pattern 7: Route Definitions

**What:** Five routes under a single RootLayout parent route. React Router v7 declarative mode.

```typescript
// src/router.tsx  (or inline in App.tsx)
import { Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { AcademyPage } from './pages/AcademyPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="academy" element={<AcademyPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>
    </Routes>
  );
}
```

**App.tsx update:**
```typescript
// src/App.tsx  (replaces ThemeTestComponent)
import { AppRouter } from './router';

export default function App() {
  return <AppRouter />;
}
```

---

### Anti-Patterns to Avoid

- **Wrapping `<Outlet>` directly in AnimatePresence:** Exit animations never fire. AnimatePresence cannot see route changes through Outlet's internal rendering. Use `useOutlet()` + `cloneElement` pattern instead.

- **Placing AnimatePresence inside the page component:** AnimatePresence must be OUTSIDE and ABOVE the animated element. If AnimatePresence unmounts with the page, exit animations never play.

- **Using `mode="sync"` or no mode for full-screen transitions:** `mode="sync"` runs enter and exit simultaneously — new and old pages overlap. `mode="wait"` serializes them, required for cinematic effect.

- **Hardcoding `x: '100%'` in mobile menu variants without RTL check:** Menu slides from the wrong side in Arabic. Check `i18n.dir()` and flip the `x` values, or use CSS-only approach with `end-0` positioning.

- **Setting `initial={true}` (default) on AnimatePresence:** The first page load plays the entrance animation, which feels wrong (user did not navigate, so why is the page sliding in?). Use `initial={false}`.

- **Using `ml-*` / `mr-*` in the Navbar:** Any Tailwind physical margin/padding class will misalign in RTL. Use `ms-*` / `me-*` for spacing between Navbar items. Already confirmed as project rule from Phase 1.

- **Positioning the sticky navbar inside the RootLayout `main` element:** The Navbar must be outside `main` (sibling, not parent or child) so it is not part of the AnimatePresence transition target. Otherwise the navbar flickers on every route change.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Exit animations on route change | Custom unmount-and-wait logic | AnimatePresence mode="wait" | Exit timing, stale element retention, ref management are all handled — hand-rolled approach fails in edge cases (rapid clicks, back button, React StrictMode) |
| Animated hamburger menu body | CSS transition + display:none toggle | AnimatePresence wrapping the panel | CSS can't animate `display:none` removal; height:auto transitions are expensive; AnimatePresence handles mount/unmount lifecycle |
| Scroll restoration between routes | Manual scrollTop reset | React Router's `<ScrollRestoration>` | Handles edge cases: back button restores correct scroll position; forward navigation goes to top |
| Active link state | Custom `location.pathname === to` comparison | NavLink `isActive` prop from react-router-dom | Handles nested routes, exact matching, and provides accessible `aria-current` attribute |
| Z-index management | Manual z-index values on each element | Tailwind z-* scale (z-50 for navbar, z-40 for backdrop, z-30 for content) | Consistent layering across the stacking context without specificity conflicts |

**Key insight:** The hardest part of page transitions is handling the EXITING component — React's default behavior unmounts it immediately. AnimatePresence exists specifically for this problem. There is no clean way to hand-roll this without reimplementing React's fiber reconciliation.

---

## Common Pitfalls

### Pitfall 1: AnimatePresence Direct Child Rule Violation

**What goes wrong:** Wrapping `<Outlet />` in `<AnimatePresence>` produces entry animations but NEVER exit animations. The new page mounts immediately without transition.

**Why it happens:** AnimatePresence tracks its DIRECT children by key. `<Outlet>` is a React component that renders a route context provider internally — AnimatePresence sees an always-present `OutletContext.Provider`, not the changing page element.

**How to avoid:** Always use the `useOutlet()` + `cloneElement` pattern. The `AnimatedOutlet` component is the correct and complete solution.

**Warning signs:** Entry animations work but navigating between pages has no exit animation; old page vanishes instantly; no transition visible on browser back button.

---

### Pitfall 2: Navbar Inside AnimatePresence Scope

**What goes wrong:** Navbar is rendered as a sibling to the animated page container but accidentally wrapped inside AnimatePresence. Navbar flickers or re-mounts on every route change.

**Why it happens:** If RootLayout renders as `<AnimatePresence><Navbar /><AnimatedOutlet /></AnimatePresence>`, both Navbar and pages are AnimatePresence children. Navbar key never changes, but AnimatePresence may still trigger re-evaluation.

**How to avoid:** AnimatePresence wraps ONLY the outlet content (inside AnimatedOutlet). Navbar sits outside:
```typescript
// RootLayout structure:
<>
  <Navbar />       {/* always mounted, never inside AnimatePresence */}
  <AnimatedOutlet />   {/* contains AnimatePresence internally */}
</>
```

**Warning signs:** Navbar disappears briefly on navigation; Navbar re-renders on route change unnecessarily.

---

### Pitfall 3: Mobile Menu Doesn't Close on Navigation

**What goes wrong:** User taps a nav link in the mobile menu. The page transitions, but the menu overlay remains open on top of the new page.

**Why it happens:** The NavLink click triggers navigation, but no code closes the `isOpen` state.

**How to avoid:** Every `NavLink` in `MobileMenu` must call `onClose()` in its `onClick` handler. The route change + menu close happen simultaneously; AnimatePresence handles the menu close animation.

**Warning signs:** After tapping a mobile nav link, the menu stays visible on the next page.

---

### Pitfall 4: Backdrop Blur Not Working Due to Stacking Context

**What goes wrong:** `backdrop-blur-md` on the navbar produces no blur effect in some browsers or with specific page layouts.

**Why it happens:** `backdrop-filter` requires the element to have no `overflow: hidden` on any ancestor that would clip the backdrop painting. Some Tailwind layout utilities create stacking contexts that interfere.

**How to avoid:** Ensure the `<header>` with backdrop-blur has no `overflow:hidden` ancestor between it and the viewport. In this project structure, RootLayout's div with `min-h-screen` should not set overflow.

**Warning signs:** `backdrop-blur` class applied but no visual blur visible; checking in Safari specifically (which has historically had different behavior with backdrop-filter stacking contexts).

---

### Pitfall 5: ThemeTestComponent Interference

**What goes wrong:** Phase 1 left `ThemeTestComponent` as the only content in `App.tsx`. If Phase 2 does not cleanly replace it, both the test scaffold and the new shell render simultaneously.

**Why it happens:** Forgetting to update `App.tsx` after building RootLayout and routes.

**How to avoid:** Phase 2 Plan 1 must update `App.tsx` to render `<AppRouter />` and remove the ThemeTestComponent import. The ThemeTestComponent file can stay on disk (it's harmless) but must not be imported in App.tsx.

**Warning signs:** Both the color swatches AND the navbar appear simultaneously in the browser.

---

### Pitfall 6: `useDirection` DOM Side Effect Double-Registration

**What goes wrong:** `document.documentElement.dir` gets set by both `useDirection` hook (from Phase 1) AND a new `useEffect` in RootLayout, causing duplicate event listener registration and potential stale closure bugs.

**Why it happens:** Phase 1 `useDirection` already registers an effect that syncs `document.documentElement.dir` and `lang`. If RootLayout also sets these independently, two listeners compete.

**How to avoid:** In RootLayout, simply call `useDirection()` to inherit the Phase 1 hook's behavior. Do NOT add a second `useEffect` that also writes to `document.documentElement.dir`. The hook handles cleanup via `i18n.off('languageChanged', ...)` in its return function.

**Warning signs:** Console warnings about duplicate event listeners; direction switching feels delayed or requires two clicks.

---

## Code Examples

Verified patterns from official sources and community cross-verification:

### Route structure with RootLayout (declarative mode)

```typescript
// Source: React Router v7 official docs — reactrouter.com/start/modes
// Declarative mode: <Routes> + <Route> + nested layout routes
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route element={<RootLayout />}>   {/* layout route — renders Navbar + Outlet */}
    <Route index element={<HomePage />} />
    <Route path="services" element={<ServicesPage />} />
    <Route path="academy" element={<AcademyPage />} />
    <Route path="about" element={<AboutPage />} />
    <Route path="contact" element={<ContactPage />} />
  </Route>
</Routes>
```

### AnimatedOutlet (verified via React Router GitHub discussion #10411)

```typescript
// Source: github.com/remix-run/react-router/discussions/10411
// Verified: matches framer-motion AnimatePresence direct child requirement
import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}
```

### NavLink active state (React Router v7 official pattern)

```typescript
// Source: reactrouter.com official docs
// isActive is true when the current URL matches this link
<NavLink
  to="/services"
  className={({ isActive }) =>
    isActive ? 'text-stormy-teal-950 font-medium' : 'text-seagrass-600'
  }
>
  {t('nav.services')}
</NavLink>
```

### Page stub with transition (one for all five pages)

```typescript
// All 5 page stubs follow this pattern
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';

export function ServicesPage() {
  const { t } = useTranslation('common');
  const { dir } = useDirection();

  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen px-4 py-16 sm:px-6 lg:px-8"
    >
      <h1 className="font-display text-4xl text-stormy-teal-950 dark:text-celadon-100">
        {t('nav.services')}
      </h1>
    </motion.div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<AnimatePresence><Outlet /></AnimatePresence>` | `useOutlet()` + `cloneElement` in AnimatedOutlet | React Router v6+ + Framer Motion v6+ | Old approach silently breaks exit animations; new pattern is the community standard |
| `exitBeforeEnter` prop on AnimatePresence | `mode="wait"` prop | Framer Motion v7+ | `exitBeforeEnter` was renamed; old code still works but will produce a deprecation warning |
| `import { motion } from 'framer-motion'` | Both `framer-motion` and `motion` resolve to same v12.34.3 code | Nov 2024 | Project already uses `framer-motion` package name — safe to keep or migrate to `motion`; no behavior difference |
| Fixed navbar with body padding-top | `sticky top-0` navbar | Tailwind v3+ | Sticky avoids the need to compute and apply navbar-height padding to the body |
| `window.scrollTo(0, 0)` after navigation | React Router `<ScrollRestoration>` component | React Router v6.4+ | Native component handles scroll position restoration correctly for back/forward navigation |

**Deprecated/outdated:**
- `exitBeforeEnter` on `<AnimatePresence>`: renamed to `mode="wait"`. Using the old prop name with framer-motion v12 may produce warnings.
- `Switch` from React Router v5: replaced by `Routes` in v6+. All v7 docs use `Routes`.

---

## Open Questions

1. **Scroll restoration needed in Phase 2?**
   - What we know: React Router provides `<ScrollRestoration />` component for this
   - What's unclear: Whether stub pages need it yet, or if it can wait for Phase 4 when real page content creates scroll
   - Recommendation: Add `<ScrollRestoration />` inside RootLayout in Phase 2 — costs nothing, prevents regression later

2. **Page transition duration vs. luxury feel?**
   - What we know: 0.3-0.5s total (exit + enter with mode="wait") feels cinematic; too fast feels cheap, too slow feels sluggish
   - What's unclear: The specific curve and duration that matches the "editorial luxury" brand aesthetic
   - Recommendation: Use 0.3s exit / 0.45s enter with `[0.22, 1, 0.36, 1]` cubic-bezier (fast decelerate = luxury feel). This is proven in high-end fashion sites.

3. **Vercel SPA routing configuration?**
   - What we know: BrowserRouter requires server-side catch-all routing for direct URL access to `/services` etc.
   - What's unclear: Whether a `vercel.json` rewrite rule is needed now or can be deferred to deployment phase
   - Recommendation: Add `vercel.json` with rewrites in Phase 2 since routing is being set up. Small file, no cost, prevents broken deep-link behavior during testing.

4. **Should `framer-motion` import path change to `motion/react`?**
   - What we know: Both package names resolve to identical code at v12.34.3
   - What's unclear: Whether future updates will diverge the packages
   - Recommendation: Keep using `framer-motion` imports since that is what's in `package.json`. Consistent with Phase 1 stack research which noted equivalence.

---

## Sources

### Primary (HIGH confidence)
- React Router v7 official modes docs — reactrouter.com/start/modes — declarative vs data mode, BrowserRouter usage
- React Router v7 official SPA docs — reactrouter.com/how-to/spa — SPA mode configuration
- Framer Motion / motion.dev — motion.dev/docs — AnimatePresence API, mode prop
- GitHub: remix-run/react-router Discussion #10411 — community-validated AnimatedOutlet pattern using useOutlet

### Secondary (MEDIUM confidence)
- WebSearch: React Router v7 + AnimatePresence community patterns — multiple sources agree on useOutlet pattern
- WebSearch: sticky navbar backdrop-blur Tailwind — multiple sources confirm `sticky top-0 backdrop-blur-md` pattern
- WebSearch: Framer Motion hamburger menu AnimatePresence — multiple sources confirm AnimatePresence for mount/unmount animation of menu overlay
- ARCHITECTURE.md (project research) — Phase 2 build order, AnimatedOutlet pattern, RootLayout pattern — HIGH confidence (written by project's own architecture research phase)

### Tertiary (LOW confidence, verified by cross-reference)
- Community blog implementations of AnimatedOutlet with useOutlet — cross-verified with React Router GitHub discussion

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages already installed, versions confirmed in package.json
- Architecture: HIGH — AnimatedOutlet pattern verified via React Router official GitHub discussion + multiple community sources that converge on same pattern
- Pitfalls: HIGH — pitfalls documented in project's own PITFALLS.md (Phase 1 research) plus specific Phase 2 pitfalls identified from new sources
- Code examples: MEDIUM-HIGH — patterns verified via React Router official docs and community consensus; actual runtime behavior will be confirmed during execution

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (stable ecosystem; core patterns unlikely to change; framer-motion and react-router are mature)
