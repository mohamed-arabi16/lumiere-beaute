---
phase: 02-shell
plan: 02
subsystem: ui
tags: [react, framer-motion, react-router-dom, react-i18next, tailwind, rtl, navigation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: ThemeProvider/useTheme hook, i18n config, useDirection hook, logical Tailwind tokens
  - phase: 02-shell (plan 01)
    provides: AppRouter, page stubs, RTL animation infrastructure, luxuryEase constant
provides:
  - Navbar sticky header with desktop NavLinks, LanguageSwitcher, ThemeToggle, hamburger trigger
  - LanguageSwitcher TR/EN/ع button group calling i18n.changeLanguage
  - ThemeToggle inline SVG sun/moon button calling toggleTheme
  - MobileMenu AnimatePresence slide-out panel with RTL-aware x animation and backdrop
affects: [02-shell-03-RootLayout, 02-shell-04-verify, all future UI phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - NAV_LINKS constant defined outside component for stable reference
    - luxuryEase typed as [number, number, number, number] for framer-motion v12 cubic-bezier compatibility
    - RTL-aware slide animation via separate menuVariantsLTR/menuVariantsRTL objects selected by i18n.dir()
    - Inline SVG icons (no icon library) for theme toggle sun/moon
    - MobileMenu placed inside <header> but outside <nav> for full-screen overlay correctness
    - AnimatePresence inside MobileMenu component (not in Navbar) for clean separation

key-files:
  created:
    - src/components/navigation/Navbar.tsx
    - src/components/navigation/LanguageSwitcher.tsx
    - src/components/navigation/ThemeToggle.tsx
    - src/components/navigation/MobileMenu.tsx
  modified: []

key-decisions:
  - "luxuryEase typed as [number, number, number, number] (BezierDefinition) — framer-motion v12 does not accept raw number[] as Easing"
  - "MobileMenu placed inside <header> but outside <nav> — ensures AnimatePresence overlay covers full viewport"
  - "Hamburger uses <span> elements not SVG bars — simpler markup, current-color inherits correctly"

patterns-established:
  - "Tailwind logical properties only (ms-/me-/ps-/pe-/end-/start-) — zero physical ml-/mr-/pl-/pr- in navigation"
  - "All NavLinks use end={link.to === '/'} to prevent home route matching all paths"
  - "MobileMenu receives navLinks as prop from Navbar — single source of truth for route definitions"

requirements-completed: [NAV-01, NAV-02, FNDTN-07]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 2 Plan 02: Navigation Components Summary

**RTL-aware sticky navbar with animated mobile slide-out panel, TR/EN/AR language switcher, and inline SVG theme toggle using Tailwind logical properties throughout**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T21:22:03Z
- **Completed:** 2026-02-24T21:24:07Z
- **Tasks:** 2
- **Files modified:** 4 created

## Accomplishments

- LanguageSwitcher renders TR/EN/ع (Arabic) buttons that call i18n.changeLanguage, with active/inactive Tailwind token styling and border-s logical separator
- ThemeToggle renders inline SVG sun (8-ray circle) or moon (crescent path) based on current theme, calling toggleTheme from useTheme hook
- Navbar provides sticky glass header (backdrop-blur-md) with desktop NavLinks + active state, LanguageSwitcher, ThemeToggle controls, and mobile hamburger trigger
- MobileMenu uses AnimatePresence with RTL-aware x animation variants (menuVariantsLTR/RTL), a semi-transparent backdrop, and slide-out panel positioned with logical `end-0`

## Task Commits

Each task was committed atomically:

1. **Task 1: Build LanguageSwitcher and ThemeToggle** - `6dbd7f4` (feat)
2. **Task 2: Build Navbar and MobileMenu** - `08d84fc` (feat)

## Files Created/Modified

- `src/components/navigation/LanguageSwitcher.tsx` - TR/EN/ع button group with active language highlighting and i18n.changeLanguage
- `src/components/navigation/ThemeToggle.tsx` - Inline SVG sun/moon button toggling dark/light theme
- `src/components/navigation/Navbar.tsx` - Sticky header with desktop nav, controls, hamburger trigger, and MobileMenu integration
- `src/components/navigation/MobileMenu.tsx` - AnimatePresence slide-out panel with backdrop, RTL-aware animation, close button, and nav links (pre-built in 02-01)

## Decisions Made

- luxuryEase typed as `[number, number, number, number]` — framer-motion v12's `Easing` type requires `BezierDefinition` (readonly tuple), not plain `number[]`. Type annotation resolves the TS2322 error without runtime cost.
- MobileMenu placed inside `<header>` but outside `<nav>` — AnimatePresence overlay must extend beyond the nav element to cover the full viewport correctly.
- `end={link.to === '/'}` on the home NavLink — prevents the index route from matching all paths as "active".

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Typed luxuryEase cubic-bezier array for framer-motion v12 compatibility**
- **Found during:** Task 2 (Build Navbar and MobileMenu) — TypeScript compile error
- **Issue:** `ease: [0.22, 1, 0.36, 1]` inferred as `number[]` which is not assignable to framer-motion v12's `Easing` type (expects `BezierDefinition = readonly [number, number, number, number]`)
- **Fix:** Extracted the array as `const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1]` so TypeScript infers the correct tuple type
- **Files modified:** `src/components/navigation/MobileMenu.tsx`
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** `03967c8` (part of 02-01 animation infrastructure pre-build)

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug)
**Impact on plan:** Fix essential for TypeScript correctness with framer-motion v12. No scope creep or behavioral change.

## Issues Encountered

- MobileMenu.tsx was already committed in plan 02-01 (`03967c8`) as part of the RTL animation infrastructure module, with the `luxuryEase` typing already applied. The file matched the plan spec exactly — no additional changes needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four navigation components are TypeScript-clean and export-ready
- Plan 03 (RootLayout) can directly import `Navbar` and assemble the shell layout
- No physical directional Tailwind classes — RTL rendering will work correctly in Arabic mode
- MobileMenu RTL animation (x: '-100%' slide from inline-start) wired and ready

---
*Phase: 02-shell*
*Completed: 2026-02-25*

## Self-Check: PASSED

All created files exist on disk. All task commits verified in git log. TypeScript compiles with zero errors.
