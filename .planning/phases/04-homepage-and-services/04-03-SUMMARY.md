---
phase: 04-homepage-and-services
plan: "03"
subsystem: ui
tags: [react, framer-motion, react-router, i18next, animations, sections]

# Dependency graph
requires:
  - phase: 04-homepage-and-services
    plan: "01"
    provides: TeaserCard and Testimonial TypeScript interfaces in src/types/content.ts, trilingual locale JSON with home.services_teaser, home.academy_teaser, home.testimonials keys
  - phase: 03-shared-components
    provides: FadeInSection, StaggerContainer, staggerItemVariants, Card, Heading, BodyText, Button components
provides:
  - ServicesTeaserSection component with 3 service teaser cards linking to /services via React Router Link
  - AcademyTeaserSection component with 2 academy teaser cards linking to /academy via React Router Link
  - TestimonialsSection component with 3+ client quote cards on dark editorial background
affects: [04-02, HomePage composition in a future integration task]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "React Router Link (not anchor) for all section navigation — preserves AnimatePresence page transition"
    - "StaggerContainer cascade animation with scroll-reveal — viewport.once=true prevents replay on scroll-back"
    - "FadeInSection wraps section headings and CTA blocks — vertical-only y animation, RTL-safe"
    - "Dark section background (bg-surface-dark) for TestimonialsSection — editorial light/dark alternation rhythm"
    - "Card flex-col with mt-auto pins author block to card bottom regardless of quote length"

key-files:
  created:
    - src/components/sections/ServicesTeaserSection.tsx
    - src/components/sections/AcademyTeaserSection.tsx
    - src/components/sections/TestimonialsSection.tsx
  modified: []

key-decisions:
  - "React Router Link used exclusively for /services and /academy navigation — <a href> bypasses AnimatePresence exit animations"
  - "AcademyTeaserSection uses ghost Button variant, ServicesTeaserSection uses primary — visual differentiation between adjacent sections"
  - "TestimonialsSection uses bg-surface-dark in both light and dark modes — intentional editorial contrast, not a dark-mode concern"
  - "testimonial.id used as React key (stable kebab-case strings from locale JSON) — never array index for AnimatePresence safety"
  - "HTML entities &ldquo;/&rdquo; used for typographic quote marks around testimonial text — JSX punctuation, not hardcoded content"

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 4 Plan 03: Services Teaser, Academy Teaser, and Testimonials Sections Summary

**Three homepage mid-page sections using React Router Link navigation, StaggerContainer cascade animations, and scroll-reveal — teaser cards for /services (3 cards) and /academy (2 cards) plus 3 client testimonial cards on dark editorial background**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T00:38:00Z
- **Completed:** 2026-02-25T00:39:30Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Created `ServicesTeaserSection.tsx`: 3 service teaser cards in responsive 3-column grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), each card wrapped in `<Link to="/services">`, CTA uses primary Button variant, StaggerContainer cascade animation, FadeInSection heading reveal
- Created `AcademyTeaserSection.tsx`: 2 academy course cards in 2-column grid (`grid-cols-1 sm:grid-cols-2`), each card wrapped in `<Link to="/academy">`, CTA uses ghost Button variant to visually differentiate from services section above
- Created `TestimonialsSection.tsx`: maps `t('home.testimonials', { returnObjects: true }) as Testimonial[]`, testimonial.id as React key (never array index), bg-surface-dark editorial background, Card with flex-col + mt-auto to pin author block regardless of quote length
- All three sections: zero TypeScript errors, no `<a href>` navigation, RTL-safe spacing (px-6, gap-6, ps-6/pe-6 only)

## Task Commits

Each task was committed atomically:

1. **Task 1: Build ServicesTeaserSection and AcademyTeaserSection** - `c8c4821` (feat)
2. **Task 2: Build TestimonialsSection** - `e3b0eed` (feat)

## Files Created/Modified

- `src/components/sections/ServicesTeaserSection.tsx` — Exports `ServicesTeaserSection`, 3 cards linked to /services via React Router Link
- `src/components/sections/AcademyTeaserSection.tsx` — Exports `AcademyTeaserSection`, 2 cards linked to /academy via React Router Link
- `src/components/sections/TestimonialsSection.tsx` — Exports `TestimonialsSection`, maps Testimonial[] from i18next with stable id keys

## Decisions Made

- React Router `<Link>` used exclusively for all in-app navigation — `<a href>` bypasses AnimatePresence and page transition exit animations would never fire
- AcademyTeaserSection uses `variant="ghost"` Button, ServicesTeaserSection uses `variant="primary"` — adjacent sections must be visually differentiated by CTA weight
- TestimonialsSection `bg-surface-dark` applies in both light and dark modes (not a dark-mode variation) — intentional luxury editorial rhythm
- `testimonial.id` used as React key — matches stable kebab-case slugs from locale JSON (e.g. "testimonial-1"), never array index which would break AnimatePresence on reorder/filter

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- All three sections are ready for composition into HomePage.tsx (Plan 04-02 or a later integration task)
- Navigation links (/services, /academy) are established but destination pages do not exist yet — clicking during dev will show 404 until those pages are built in Phase 5
- Sections accept content purely from i18next — no prop drilling required when adding to HomePage

## Self-Check: PASSED

- `src/components/sections/ServicesTeaserSection.tsx` — FOUND
- `src/components/sections/AcademyTeaserSection.tsx` — FOUND
- `src/components/sections/TestimonialsSection.tsx` — FOUND
- Commit `c8c4821` — FOUND (git log confirms)
- Commit `e3b0eed` — FOUND (git log confirms)
- TypeScript: zero errors (`npx tsc --noEmit` exits 0)
- No `<a href>` anchor navigation in JSX (only in JSDoc comments)
