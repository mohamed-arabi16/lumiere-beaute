---
phase: 04-homepage-and-services
plan: "05"
subsystem: ui
tags: [react, framer-motion, AnimatePresence, LayoutGroup, i18next, typescript]

# Dependency graph
requires:
  - phase: 04-01
    provides: TypeScript content types (Category, Treatment) and trilingual locale JSON with 20+ treatments
  - phase: 03-02
    provides: FadeInSection scroll-reveal animation component
  - phase: 03-03
    provides: Heading, BodyText Typography components and Button ui primitives
  - phase: 02-03
    provides: pageTransitionVariants and AnimatedOutlet page transition pattern

provides:
  - CategoryTabs: Animated tab bar with LayoutGroup-scoped layoutId sliding underline indicator
  - TreatmentGrid: AnimatePresence popLayout grid of treatment cards with entry/exit animations
  - ServicesPage: Complete services page replacing Phase 2 stub — hero, category filter, treatment grid

affects:
  - 04-06 and beyond: ServicesPage is now complete; no further services page work expected
  - Any future page using AnimatePresence category filters can follow CategoryTabs + TreatmentGrid pattern

# Tech tracking
tech-stack:
  added: []
  patterns:
    - LayoutGroup id scoping to prevent layoutId leakage during AnimatePresence page transitions
    - AnimatePresence mode='popLayout' for category filter grids — removes exiting items from layout flow immediately
    - layout prop on motion.div wrappers enables smooth card repositioning when category changes
    - useState lazy initializer reading from locale array at mount time for activeCategory default

key-files:
  created:
    - src/components/sections/CategoryTabs.tsx
    - src/components/sections/TreatmentGrid.tsx
  modified:
    - src/pages/ServicesPage.tsx

key-decisions:
  - "LayoutGroup id='services-category-tabs' scopes layoutId='active-tab-indicator' — prevents sliding underline from leaking to other pages during AnimatePresence transitions"
  - "AnimatePresence mode='popLayout' chosen over 'wait' or 'sync' — exiting cards leave layout flow immediately, prevents grid snap/jump on filter switch"
  - "layout prop on each motion.div card wrapper enables remaining cards to reposition smoothly after exits"
  - "filteredTreatments recomputed on every render (no useMemo) — correct for 20 items, no performance concern"

patterns-established:
  - "Pattern: LayoutGroup wrapping tablist + layoutId on active indicator — zero-JS sliding underline with no manual offset math"
  - "Pattern: AnimatePresence wraps grid div containing treatment map — per research Pattern 3, never wraps the outer container"

requirements-completed: [SRVC-01, SRVC-02]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 4 Plan 05: Services Page with Animated Category Filter Summary

**AnimatePresence popLayout treatment grid with LayoutGroup-scoped sliding tab indicator, replacing Phase 2 stub with full trilingual services page**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-02-25T00:38:00Z
- **Completed:** 2026-02-25T00:39:41Z
- **Tasks:** 2
- **Files modified:** 3 (2 created, 1 replaced)

## Accomplishments

- CategoryTabs with LayoutGroup id scoping and layoutId sliding underline — zero manual offset calculation
- TreatmentGrid with AnimatePresence mode="popLayout" and layout prop for smooth card repositioning on category switch
- ServicesPage fully replaced: hero (FadeInSection + Heading + BodyText), CategoryTabs wired to useState, TreatmentGrid receiving filteredTreatments
- All 20+ treatments accessible across 5 category tabs; all text from locale JSON, zero hardcoded strings
- Zero TypeScript errors, production build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: Build CategoryTabs and TreatmentGrid components** - `86c3bcc` (feat)
2. **Task 2: Replace Phase 2 stub with full ServicesPage** - `0419490` (feat)

**Plan metadata:** `[final commit hash]` (docs: complete plan)

## Files Created/Modified

- `src/components/sections/CategoryTabs.tsx` - Animated tab bar with LayoutGroup id scoping, layoutId sliding underline, aria-selected tabs, logical ps-4/pe-4 spacing
- `src/components/sections/TreatmentGrid.tsx` - AnimatePresence mode="popLayout" card grid showing treatment name, description, duration, price
- `src/pages/ServicesPage.tsx` - Full services page replacing Phase 2 stub; hero + CategoryTabs + TreatmentGrid; useState lazy initializer for activeCategory

## Decisions Made

- `LayoutGroup id="services-category-tabs"` scopes the layoutId to prevent the sliding underline from leaking to other pages during AnimatePresence page transitions (Pitfall 6 from research)
- `AnimatePresence mode="popLayout"` — removes exiting cards from layout flow immediately, preventing remaining cards from snapping into position (Pitfall 5)
- `layout` prop added to each motion.div card — enables smooth repositioning without snapping for cards that remain in the filtered list
- `filteredTreatments` recomputed inline on every render (no useMemo) — correct and performant for 20 items
- `ease: [0.22, 1, 0.36, 1] as [number, number, number, number]` tuple cast — maintained for framer-motion v12 TypeScript strictness (consistent with Phase 2 decision)
- `treatment.id` stable slug as React key — never array index (AnimatePresence key safety, consistent with 04-01 decision)

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- ServicesPage is complete and production-ready
- CategoryTabs and TreatmentGrid are standalone reusable components
- Locale JSON for services was built in 04-01; treatments and categories are fully populated for all 3 locales
- Phase 4 remaining plans (06+) can proceed — HomePage and other pages unblocked

---
*Phase: 04-homepage-and-services*
*Completed: 2026-02-25*

## Self-Check: PASSED

- FOUND: src/components/sections/CategoryTabs.tsx
- FOUND: src/components/sections/TreatmentGrid.tsx
- FOUND: src/pages/ServicesPage.tsx
- FOUND commit 86c3bcc (Task 1)
- FOUND commit 0419490 (Task 2)
- TypeScript: zero errors (npx tsc --noEmit exit 0)
- Production build: succeeded (npm run build exit 0)
- Phase 2 stub text: confirmed removed (grep returned no matches)
- No motion/react imports: confirmed (all import from framer-motion)
