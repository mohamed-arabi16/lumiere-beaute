---
phase: 03-shared-components
plan: "01"
subsystem: ui
tags: [framer-motion, animation, accessibility, prefers-reduced-motion, variants]

# Dependency graph
requires:
  - phase: 02-shell
    provides: AppProviders.tsx provider tree (BrowserRouter, ThemeProvider, I18nextProvider)
  - phase: 02-shell
    provides: variants.ts with pageTransitionVariants and pageFadeVariants
provides:
  - MotionConfig reducedMotion="user" as outermost provider — zero-maintenance a11y baseline for all motion
  - fadeInUpVariants for scroll-reveal FadeInSection component
  - staggerContainerVariants factory for staggered child reveal grids
  - staggerItemVariants for individual items within StaggerContainer
affects:
  - 03-shared-components (FadeInSection and StaggerContainer animation components)
  - All future phases using motion components (auto-inherits reduced motion)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - MotionConfig at provider root: single declaration covers all motion in app, no per-component conditionals needed
    - Variant factory pattern: staggerContainerVariants(delay) returns Variants object for configurable stagger timing
    - Luxury easing constant: [0.22, 1, 0.36, 1] cubic-bezier reused across all animation variants

key-files:
  created: []
  modified:
    - src/providers/AppProviders.tsx
    - src/animations/variants.ts

key-decisions:
  - "Import MotionConfig from framer-motion (not motion/react) — project uses framer-motion, no motion/react package installed"
  - "MotionConfig placed outermost (outside BrowserRouter) — prevents theme-toggle re-renders from interrupting in-progress animations"
  - "staggerContainerVariants implemented as factory function with default staggerDelay=0.06 — allows per-instance configuration"

patterns-established:
  - "All animation variants use hidden/visible keys for consistency with FadeInSection and StaggerContainer whileInView usage"
  - "Ease typed as [number, number, number, number] tuple — required for framer-motion v12 TypeScript strictness"
  - "Vertical-only motion (y-axis only) for scroll-reveal — no RTL complication since vertical axis has no reading direction"

requirements-completed: [SC3-4, SC3-1, SC3-3]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 3 Plan 01: Shared Components Infrastructure Summary

**MotionConfig prefers-reduced-motion guard wired at provider root plus three scroll-reveal and stagger animation variant exports added to the shared variant library.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T22:11:25Z
- **Completed:** 2026-02-24T22:12:51Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- MotionConfig with reducedMotion="user" wraps entire app — all framer-motion components automatically snap to end state when OS prefers-reduced-motion is enabled, no per-component logic ever needed
- Added fadeInUpVariants (vertical fade-up, 0.55s) for FadeInSection whileInView scroll reveals
- Added staggerContainerVariants factory (configurable staggerDelay, default 0.06s) for grid/card reveals
- Added staggerItemVariants (vertical fade-up, 0.4s) for child items in StaggerContainer

## Task Commits

Each task was committed atomically:

1. **Task 1: Add MotionConfig to AppProviders as outermost wrapper** - `45c1b0a` (feat)
2. **Task 2: Extend variants.ts with scroll-reveal and stagger variant exports** - `b6cd857` (feat)

**Plan metadata:** (docs: commit following this summary)

## Files Created/Modified
- `src/providers/AppProviders.tsx` - Added MotionConfig import + JSX wrapper as outermost element
- `src/animations/variants.ts` - Added fadeInUpVariants, staggerContainerVariants, staggerItemVariants after pageFadeVariants

## Decisions Made
- Used `framer-motion` import path for MotionConfig (not `motion/react` as noted in plan) — project only has `framer-motion` installed; `motion/react` is an alternate package entrypoint not available in this setup
- Factory function chosen for staggerContainerVariants to allow per-usage stagger timing without duplicating the full variant object

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Import path corrected from motion/react to framer-motion**
- **Found during:** Task 1 (Add MotionConfig to AppProviders)
- **Issue:** Plan specified `import { MotionConfig } from 'motion/react'` but project only has `framer-motion` installed; TypeScript error TS2307: Cannot find module 'motion/react'
- **Fix:** Changed import to `import { MotionConfig } from 'framer-motion'` — MotionConfig is confirmed exported from framer-motion v12
- **Files modified:** src/providers/AppProviders.tsx
- **Verification:** `npx tsc --noEmit` passes with zero errors; build succeeds
- **Committed in:** 45c1b0a (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 - wrong import path)
**Impact on plan:** Import path fix was necessary for compilation. Functionally identical — framer-motion is the installed package; motion/react is an alternate entry point not installed in this project.

## Issues Encountered
None — after import path fix, both tasks executed cleanly with zero TypeScript errors and successful production build.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- MotionConfig infrastructure is live — FadeInSection and StaggerContainer components (Plan 02) can now import fadeInUpVariants and staggerItemVariants directly
- All motion components in the app automatically respect OS prefers-reduced-motion setting
- Existing page transitions (pageTransitionVariants, pageFadeVariants) confirmed unchanged and working

---
*Phase: 03-shared-components*
*Completed: 2026-02-25*
