---
phase: 04-homepage-and-services
plan: "02"
subsystem: ui
tags: [react, framer-motion, useScroll, useTransform, useInView, animate, parallax, count-up, i18n, react-i18next]

# Dependency graph
requires:
  - phase: 04-homepage-and-services
    provides: TypeScript content types (StatItem) and trilingual locale JSON with home.hero, home.stats keys
  - phase: 03-shared-components
    provides: TypewriterText, FadeInSection, StaggerContainer, staggerItemVariants, Button, Typography (Heading, BodyText)
provides:
  - HeroSection component at src/components/sections/HeroSection.tsx — full-viewport parallax hero with TypewriterText headline, subtitle, and two CTAs
  - StatsSection component at src/components/sections/StatsSection.tsx — animated count-up statistics triggered once on scroll
affects: [04-03, 04-04, 04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useScroll({ target: sectionRef, offset: ['start start', 'end start'] }) + useTransform for scroll-linked background parallax"
    - "useReducedMotion() guards parallax — static fallback when prefers-reduced-motion is set"
    - "useInView(ref, { once: true, amount: 0.5 }) + imperative animate(0, target) for scroll-triggered count-up"
    - "ease cast as [number,number,number,number] tuple for framer-motion v12 TypeScript strictness"
    - "Inner StatCounter component (not exported) — keeps animation state co-located with rendering"

key-files:
  created:
    - src/components/sections/HeroSection.tsx
    - src/components/sections/StatsSection.tsx
  modified: []

key-decisions:
  - "Parallax uses backgroundPositionY (not transform: translateY) — avoids z-index stacking issues with sticky Navbar"
  - "shouldReduceMotion ? '0%' : backgroundY pattern — single conditional handles prefers-reduced-motion inline"
  - "StatCounter inner component not exported — animation logic encapsulated per-stat, isolated from StatsSection orchestration"
  - "stats.map keyed by stat.label (not index) — labels are unique translated strings, stable for React reconciliation"
  - "Removed BodyText from StatsSection imports — StatCounter uses inline span elements for tighter display control"

patterns-established:
  - "Section components live in src/components/sections/ — isolated, independently testable, composed into page components"
  - "HeroSection pattern: motion.section ref + useScroll/useTransform + useReducedMotion guard for parallax sections"
  - "StatsSection pattern: useInView(once:true) + imperative animate() + cleanup controls.stop() for count-up"

requirements-completed: [HOME-01, HOME-02]

# Metrics
duration: 1min
completed: 2026-02-25
---

# Phase 4 Plan 02: HeroSection and StatsSection Summary

**Full-viewport parallax hero with TypewriterText headline + scroll-triggered count-up stats using useScroll/useTransform and useInView/animate from framer-motion**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-25T00:37:59Z
- **Completed:** 2026-02-25T00:39:09Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Created HeroSection.tsx — full-viewport section with useScroll+useTransform parallax (0-20% background shift), useReducedMotion accessibility guard, TypewriterText animated headline, BodyText subtitle, and two Link-wrapped Button CTAs reading from i18n keys
- Created StatsSection.tsx — three animated stat counters using useInView(once:true) + imperative animate(0, target) with luxury ease curve, wrapped in FadeInSection + StaggerContainer for layered scroll-reveal
- Both components import exclusively from 'framer-motion' (not 'motion/react'), use logical Tailwind properties only, and compile with zero TypeScript errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Build HeroSection with parallax gradient and TypewriterText** - `28a4c7b` (feat)
2. **Task 2: Build StatsSection with useInView count-up animation** - `5bad2e8` (feat)

## Files Created/Modified

- `src/components/sections/HeroSection.tsx` - Full-viewport hero: parallax gradient via useScroll+useTransform, TypewriterText h1 headline, BodyText subtitle, two Link-wrapped Button CTAs
- `src/components/sections/StatsSection.tsx` - Three animated count-up stats: StatCounter inner component with useInView + imperative animate, ease tuple cast, FadeInSection + StaggerContainer wrappers

## Decisions Made

- Parallax implemented via `backgroundPositionY` (not `transform: translateY`) — avoids z-index stacking conflicts with the sticky Navbar overlay
- `shouldReduceMotion ? '0%' : backgroundY` inline conditional — single readable guard for prefers-reduced-motion without branching component structure
- `StatCounter` left as non-exported inner component — animation state (display, isInView) naturally co-located with the element being rendered
- Stats array keyed by `stat.label` — unique translated strings make stable React keys without introducing additional ID fields
- `BodyText` removed from StatsSection imports after TypeScript flagged it as unused — StatCounter renders count/label via inline `span` elements for precise display control

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused BodyText import from StatsSection**
- **Found during:** Task 2 (StatsSection compilation)
- **Issue:** Plan spec included `BodyText` in the import line but the StatCounter implementation uses inline `span` elements — TypeScript strict mode flagged `TS6133: 'BodyText' is declared but its value is never read`
- **Fix:** Removed `BodyText` from the Typography import, keeping only `Heading` (used for the section heading)
- **Files modified:** src/components/sections/StatsSection.tsx
- **Verification:** `npx tsc --noEmit` exits with code 0
- **Committed in:** `5bad2e8` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 unused import causing TS error)
**Impact on plan:** Trivial cleanup — the StatCounter styling achieves identical visual result via inline spans. No functional change.

## Issues Encountered

None beyond the unused import auto-fix above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- HeroSection and StatsSection are isolated, compiled, and ready to be imported into HomePage.tsx (Plan 04-03 or 04-04)
- Both components expect i18n keys from the locale JSON files established in 04-01 — keys are confirmed populated in EN/TR/AR
- The sections/ directory is now established as the pattern for all remaining page section components

---
*Phase: 04-homepage-and-services*
*Completed: 2026-02-25*

## Self-Check: PASSED

- src/components/sections/HeroSection.tsx — FOUND
- src/components/sections/StatsSection.tsx — FOUND
- .planning/phases/04-homepage-and-services/04-02-SUMMARY.md — FOUND
- Commit 28a4c7b (Task 1) — FOUND
- Commit 5bad2e8 (Task 2) — FOUND
- TypeScript npx tsc --noEmit — PASSED (zero errors)
