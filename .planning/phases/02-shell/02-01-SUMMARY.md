---
phase: 02-shell
plan: 01
subsystem: ui
tags: [react-router-dom, framer-motion, routing, rtl, animation, providers]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: AppProviders chain (ThemeProvider + I18nextProvider), main.tsx wiring
provides:
  - BrowserRouter as outermost provider in AppProviders chain
  - AppRouter component with 5 named routes (/, /services, /academy, /about, /contact)
  - App.tsx rendering router instead of Phase 1 test scaffold
  - RTL-aware pageTransitionVariants and pageFadeVariants in src/animations/variants.ts
  - Stub layout (RootLayout) and 5 stub pages for TypeScript compilation
affects: [02-02, 02-03, 02-04, page-transitions, rtl-animations]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - BrowserRouter as outermost provider — wraps all other context providers so useNavigate/useLocation work everywhere in the tree
    - Variant functions with custom={dir} for RTL-aware Framer Motion animations
    - Cubic-bezier tuple typed as [number, number, number, number] for framer-motion v12 TypeScript compatibility
    - Viewport unit drift (5vw) for cinematic page transitions — not full-screen slide

key-files:
  created:
    - src/router.tsx
    - src/animations/variants.ts
    - src/layouts/RootLayout.tsx
    - src/pages/HomePage.tsx
    - src/pages/ServicesPage.tsx
    - src/pages/AcademyPage.tsx
    - src/pages/AboutPage.tsx
    - src/pages/ContactPage.tsx
  modified:
    - src/providers/AppProviders.tsx
    - src/App.tsx
    - src/components/navigation/MobileMenu.tsx

key-decisions:
  - "BrowserRouter added as outermost wrapper in AppProviders (was intentionally deferred in Phase 1)"
  - "pageTransitionVariants uses function-form initial/exit so AnimatePresence passes correct dir to exiting components"
  - "Cubic-bezier ease typed as [number,number,number,number] tuple for framer-motion v12 TypeScript strictness"

patterns-established:
  - "RTL variant pattern: variants={pageTransitionVariants} custom={dir} initial='initial' animate='animate' exit='exit'"
  - "Stub-first approach: create stub files so TypeScript compiles before layout/page implementations land in later plans"

requirements-completed: [FNDTN-06]

# Metrics
duration: 2min
completed: 2026-02-24
---

# Phase 2 Plan 01: Router Infrastructure and Animation Variants Summary

**BrowserRouter-wrapped provider chain with 5 named routes and RTL-aware Framer Motion slide variants using 5vw viewport drift and function-form custom prop for direction-aware page transitions**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T21:21:58Z
- **Completed:** 2026-02-24T21:24:22Z
- **Tasks:** 2
- **Files modified:** 11

## Accomplishments

- Added BrowserRouter as outermost wrapper in AppProviders so all hooks (useNavigate, useLocation) are available everywhere in the tree
- Created AppRouter with 5 routes under RootLayout parent, updated App.tsx to render AppRouter replacing Phase 1 ThemeTestComponent
- Created RTL-aware animation variants module with function-form initial/exit that receives dir parameter — AnimatePresence preserves the custom value on exiting components ensuring correct exit direction even after language change

## Task Commits

Each task was committed atomically:

1. **Task 1: Add BrowserRouter to AppProviders and update App.tsx** - `6dbd7f4` (feat) *(committed in prior session as part of 02-shell-02 work)*
2. **Task 2: Create RTL-aware animation variants module** - `03967c8` (feat)

**Plan metadata:** *(docs commit follows)*

## Files Created/Modified

- `src/providers/AppProviders.tsx` - Added BrowserRouter as outermost wrapper around ThemeProvider + I18nextProvider
- `src/router.tsx` - AppRouter with 5 named routes under RootLayout parent route
- `src/App.tsx` - Updated to render AppRouter instead of ThemeTestComponent
- `src/animations/variants.ts` - RTL-aware pageTransitionVariants and pageFadeVariants with TextDir type
- `src/layouts/RootLayout.tsx` - Stub layout (to be replaced in Plan 03)
- `src/pages/HomePage.tsx` - Stub page (to be replaced in Plan 03)
- `src/pages/ServicesPage.tsx` - Stub page (to be replaced in Plan 03)
- `src/pages/AcademyPage.tsx` - Stub page (to be replaced in Plan 03)
- `src/pages/AboutPage.tsx` - Stub page (to be replaced in Plan 03)
- `src/pages/ContactPage.tsx` - Stub page (to be replaced in Plan 03)
- `src/components/navigation/MobileMenu.tsx` - Fixed cubic-bezier type for framer-motion v12

## Decisions Made

- BrowserRouter placed as outermost provider (outside ThemeProvider and I18nextProvider) — matches Phase 2 research recommendation so routing hooks are globally available
- pageTransitionVariants initial/exit are variant functions (not plain objects) — required for AnimatePresence to pass correct custom={dir} value to components as they exit, even if language changes mid-route
- 5vw viewport units for page drift rather than percentage — subtle cinematic feel appropriate for luxury brand, avoids jarring full-screen swipe

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed framer-motion v12 TypeScript type error in MobileMenu.tsx**
- **Found during:** Task 2 (TypeScript verification after creating variants.ts)
- **Issue:** MobileMenu.tsx had `ease: [0.22, 1, 0.36, 1]` typed as `number[]`, which is not assignable to framer-motion v12's `Easing` type — TypeScript errored on the Variants type annotation
- **Fix:** Extracted cubic-bezier array as `const luxuryEase: [number, number, number, number] = [0.22, 1, 0.36, 1]` so it is typed as a tuple matching framer-motion's expected signature
- **Files modified:** `src/components/navigation/MobileMenu.tsx`
- **Verification:** `npx tsc --noEmit` passes with zero errors
- **Committed in:** `03967c8` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug fix)
**Impact on plan:** Pre-existing type error from MobileMenu.tsx (created in 02-shell-02 prior session). Fix was necessary for TypeScript compilation. No scope creep.

## Issues Encountered

- Task 1 work (BrowserRouter, router.tsx, App.tsx, stub pages/layout) was already committed in a prior session as part of commit `6dbd7f4` (feat(02-shell-02)), which bundled Plan 01 Task 1 work with Plan 02 component work. The files were already correct on disk; Task 1 was verified and found complete, so execution proceeded directly to Task 2.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Router infrastructure complete: 5 routes declared, BrowserRouter live, TypeScript compiles clean
- Animation variants ready for page stubs to consume in Plan 03 (RootLayout + page implementations)
- RTL-aware variant pattern documented for future pages: `custom={dir}` with `variants={pageTransitionVariants}`
- No blockers — Plan 02-02 (navbar components) already committed; Plan 02-03 (RootLayout + pages) can proceed immediately

---
*Phase: 02-shell*
*Completed: 2026-02-24*
