---
phase: 07-polish-and-ux
plan: 03
subsystem: ui
tags: [framer-motion, scroll-animation, useScroll, useTransform, parallax, homepage]

# Dependency graph
requires:
  - phase: 04-homepage-and-services
    provides: ServicesTeaserSection and TestimonialsSection base implementations
  - phase: 03-shared-components
    provides: FadeInSection, StaggerContainer animation primitives and MotionConfig in AppProviders
provides:
  - Scroll-driven Y+opacity animation on ServicesTeaserSection heading
  - Scroll-driven scale animation on TestimonialsSection dark background section
affects: [homepage UX, scroll experience, POL-03 requirement]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "useScroll + useTransform for continuous scroll-linked animations (not whileInView one-shots)"
    - "sectionRef as useScroll target with offset tuning for section-entry tracking"
    - "RTL-safe scroll animations: Y-axis and opacity only for headings, scale only for backgrounds"

key-files:
  created: []
  modified:
    - src/components/sections/ServicesTeaserSection.tsx
    - src/components/sections/TestimonialsSection.tsx

key-decisions:
  - "ServicesTeaserSection heading uses offset ['start end', 'center start'] — section enters viewport top before animation starts"
  - "TestimonialsSection uses offset ['start end', 'center center'] — scale plays until section reaches center of viewport"
  - "Only Y-axis and opacity used for heading (no X) — RTL-safe per locked Phase 1 decision"
  - "Scale only for background section — RTL-safe, does not affect layout flow"
  - "No per-component reducedMotion handling — AppProviders MotionConfig reducedMotion='user' covers all Framer Motion instances globally"

patterns-established:
  - "Scroll-driven pattern: useRef<HTMLElement> → useScroll({target: ref, offset}) → useTransform → style prop on motion element"
  - "Continuous vs one-shot: useScroll+useTransform for parallax-style continuous animation; whileInView/FadeInSection for one-shot reveals"

requirements-completed: [POL-03]

# Metrics
duration: 1min
completed: 2026-02-25
---

# Phase 7 Plan 03: Scroll-Driven Section Animations Summary

**useScroll+useTransform continuous animations added to two homepage sections: ServicesTeaserSection heading (Y+opacity parallax reveal) and TestimonialsSection dark background (scale 1.04→1.0 zoom-in)**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-25T02:56:38Z
- **Completed:** 2026-02-25T02:57:46Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- ServicesTeaserSection heading now reveals continuously as the section enters the viewport — Y slides from 30px to 0 and opacity fades from 0 to 1 via scroll linkage
- TestimonialsSection dark background section scales from 1.04 to 1.0 as it enters center viewport — subtle zoom-in that amplifies the editorial contrast moment
- Both animations are RTL-safe (no X-axis transforms), respect prefers-reduced-motion globally via MotionConfig, and coexist cleanly with existing FadeInSection / StaggerContainer inner animations

## Task Commits

Each task was committed atomically:

1. **Task 1: Scroll-driven Y+opacity animation to ServicesTeaserSection heading** - `0d33cbe` (feat)
2. **Task 2: Scroll-driven scale animation to TestimonialsSection background** - `c378978` (feat)

## Files Created/Modified
- `src/components/sections/ServicesTeaserSection.tsx` - Added useRef, useScroll, useTransform; sectionRef on section; heading wrapper changed from FadeInSection to scroll-driven motion.div
- `src/components/sections/TestimonialsSection.tsx` - Added useRef, useScroll, useTransform; section changed to motion.section with scroll-driven bgScale style prop

## Decisions Made
- ServicesTeaserSection uses `offset: ['start end', 'center start']` — animation plays from when section top enters viewport bottom until section center reaches viewport top
- TestimonialsSection uses `offset: ['start end', 'center center']` — scale plays as section scrolls to center viewport, creating a centered reveal moment
- Heading animation range: Y [30, 0] and opacity [0, 1] over first 40-50% of scroll progress — fast reveal that completes well before section is fully visible
- Background scale range: [1.04, 1] — subtle enough to avoid layout shift, visible enough to register as intentional motion
- No overflow-hidden added to TestimonialsSection — the 1.04 starting scale is subtle and does not cause visible clipping at page edges

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both scroll-driven animations are live and TypeScript-clean
- POL-03 requirement fulfilled: two distinct scroll-driven animations beyond the existing hero parallax and count-up
- Remaining Phase 7 plans can proceed independently (locale split, Arabic copy review, custom cursor are separate concerns)

---
*Phase: 07-polish-and-ux*
*Completed: 2026-02-25*
