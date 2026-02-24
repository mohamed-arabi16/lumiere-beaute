---
phase: 02-shell
plan: 03
subsystem: ui
tags: [react-router, framer-motion, animations, page-transitions, rtl, vercel]

# Dependency graph
requires:
  - phase: 02-shell-01
    provides: animations/variants.ts with RTL-aware pageTransitionVariants, BrowserRouter in AppProviders
  - phase: 02-shell-02
    provides: Navbar, LanguageSwitcher, ThemeToggle, MobileMenu navigation components
provides:
  - AnimatedOutlet: useOutlet + cloneElement bridge between React Router and AnimatePresence
  - RootLayout: persistent Navbar + AnimatedOutlet + ScrollRestoration shell
  - Five page stubs: Home, Services, Academy, About, Contact with RTL-aware motion.div wrappers
  - vercel.json SPA catch-all rewrite for direct URL access
affects:
  - 02-shell-04
  - 03-home-hero
  - All subsequent page implementation phases

# Tech tracking
tech-stack:
  added: []
  patterns:
    - AnimatedOutlet pattern (useOutlet + cloneElement) for React Router + AnimatePresence compatibility
    - RootLayout composition: Navbar outside AnimatePresence, AnimatedOutlet inside main
    - page stub pattern: motion.div + custom={dir} + pageTransitionVariants for RTL-aware transitions

key-files:
  created:
    - src/layouts/AnimatedOutlet.tsx
    - vercel.json
  modified:
    - src/layouts/RootLayout.tsx
    - src/pages/HomePage.tsx
    - src/pages/ServicesPage.tsx
    - src/pages/AcademyPage.tsx
    - src/pages/AboutPage.tsx
    - src/pages/ContactPage.tsx

key-decisions:
  - "AnimatedOutlet uses useOutlet + cloneElement (NOT direct Outlet) — only pattern that fires exit animations in React Router"
  - "AnimatePresence mode='wait' initial={false} — cinematic feel, no entrance animation on initial load"
  - "Navbar placed outside <main> and outside AnimatePresence — never participates in page transitions"
  - "custom={dir} on each page motion.div — AnimatePresence preserves custom on exiting components for correct RTL exit direction"
  - "ScrollRestoration from react-router-dom resets scroll on navigation with zero added complexity"
  - "vercel.json catch-all rewrite ensures direct URL access works for BrowserRouter (HTML5 history API)"

patterns-established:
  - "Page stub pattern: motion.div + custom={dir} + pageTransitionVariants + initial/animate/exit states"
  - "RootLayout is the single source of useDirection() call — no page component should duplicate dir/lang sync"
  - "AnimatedOutlet is the boundary between routing and animation — all page animations are children of this component"

requirements-completed: [FNDTN-06, FNDTN-07, NAV-01, NAV-02]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 2 Plan 03: Application Shell Assembly Summary

**AnimatedOutlet (useOutlet + cloneElement + AnimatePresence mode="wait") wired into RootLayout with persistent Navbar and five RTL-aware page stubs — complete animated navigation shell**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T21:28:44Z
- **Completed:** 2026-02-24T21:30:40Z
- **Tasks:** 2
- **Files modified:** 7

## Accomplishments

- AnimatedOutlet implements the only correct pattern for React Router + AnimatePresence exit animations (useOutlet + cloneElement with key={location.pathname})
- RootLayout composes Navbar + AnimatedOutlet + ScrollRestoration into the complete persistent shell
- Five page stubs (Home, Services, Academy, About, Contact) all use RTL-aware motion.div with custom={dir} + pageTransitionVariants
- vercel.json catch-all rewrite ensures BrowserRouter routes work on direct URL access

## Task Commits

Each task was committed atomically:

1. **Task 1: Build AnimatedOutlet and RootLayout** - `f3f753b` (feat)
2. **Task 2: Build five page stubs and vercel.json** - `c8db094` (feat)

**Plan metadata:** (docs commit below)

## Files Created/Modified

- `src/layouts/AnimatedOutlet.tsx` - useOutlet + cloneElement bridge between React Router and AnimatePresence with mode="wait" initial={false}
- `src/layouts/RootLayout.tsx` - Persistent shell: Navbar outside AnimatePresence, AnimatedOutlet in main, ScrollRestoration
- `src/pages/HomePage.tsx` - Home stub with motion.div + pageTransitionVariants + custom={dir}
- `src/pages/ServicesPage.tsx` - Services stub with motion.div + pageTransitionVariants + custom={dir}
- `src/pages/AcademyPage.tsx` - Academy stub with motion.div + pageTransitionVariants + custom={dir}
- `src/pages/AboutPage.tsx` - About stub with motion.div + pageTransitionVariants + custom={dir}
- `src/pages/ContactPage.tsx` - Contact stub with motion.div + pageTransitionVariants + custom={dir}
- `vercel.json` - SPA catch-all rewrite rule: source "/(.*)" to "/index.html"

## Decisions Made

All decisions followed the plan as specified. Key patterns codified:

- AnimatedOutlet uses `useOutlet + cloneElement` not direct `<Outlet>` — the cloneElement with `key={location.pathname}` is what triggers AnimatePresence to detect the route change and run exit + enter animations
- `mode="wait"` on AnimatePresence ensures old page fully exits before new page enters (cinematic feel vs. cross-fade)
- `initial={false}` prevents entrance animation on first render — the site appears instantly on load, animations only play on subsequent navigations
- Navbar placement outside `<main>` and outside AnimatePresence means it never animates — only the page content transitions

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Complete application shell is functional: Navbar + animated page transitions + five navigable stubs
- All five routes navigable with RTL-aware slide+fade transitions
- ScrollRestoration active on all navigations
- Vercel SPA routing configured for production deployment
- Phase 2 Plan 04 (shell integration test / final verification) can proceed immediately
- No blockers for Phase 3+ content implementation

---
*Phase: 02-shell*
*Completed: 2026-02-25*

## Self-Check: PASSED

- FOUND: src/layouts/AnimatedOutlet.tsx
- FOUND: src/layouts/RootLayout.tsx
- FOUND: src/pages/HomePage.tsx
- FOUND: src/pages/ServicesPage.tsx
- FOUND: src/pages/AcademyPage.tsx
- FOUND: src/pages/AboutPage.tsx
- FOUND: src/pages/ContactPage.tsx
- FOUND: vercel.json
- FOUND: .planning/phases/02-shell/02-03-SUMMARY.md
- FOUND: commit f3f753b (Task 1)
- FOUND: commit c8db094 (Task 2)
