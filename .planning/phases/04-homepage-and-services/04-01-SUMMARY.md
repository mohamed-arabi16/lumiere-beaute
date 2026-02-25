---
phase: 04-homepage-and-services
plan: "01"
subsystem: ui
tags: [typescript, i18n, react-i18next, content-types, json-locale]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: i18next setup with TR/EN/AR locale JSON files and bundled imports
  - phase: 03-shared-components
    provides: TypewriterText, StatItem animation components that will consume these types
provides:
  - TypeScript interfaces StatItem, Testimonial, Category, Treatment, TeaserCard in src/types/content.ts
  - English locale content for home.hero, home.stats, home.services_teaser, home.academy_teaser, home.testimonials, services.categories, services.treatments
  - Turkish locale content (natural Turkish) for all Phase 4 keys
  - Arabic locale content (natural Arabic with Arabic numerals for durations) for all Phase 4 keys
  - 20 treatment entries across 5 categories with stable unique kebab-case IDs
affects: [04-02, 04-03, 04-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Content types as pure TypeScript declarations in src/types/content.ts — no imports, named exports only"
    - "Stat values as JSON numbers (not strings) — required for StatCounter animate(0, target)"
    - "Treatment IDs as stable kebab-case slugs — never array indices, prevents AnimatePresence key collisions"
    - "Arabic durations in Arabic-Indic numerals (٦٠ دقيقة), prices in Western digits for readability"

key-files:
  created:
    - src/types/content.ts
  modified:
    - src/i18n/locales/en/common.json
    - src/i18n/locales/tr/common.json
    - src/i18n/locales/ar/common.json

key-decisions:
  - "StatItem.value is a JSON number (not string) — StatCounter uses animate(0, target) which requires numeric target"
  - "Treatment IDs use stable kebab-case slugs (e.g. hydra-facial) — never array indices — AnimatePresence safety"
  - "Arabic hero headline kept to 2 words (جمالك. فنّنا.) — TypewriterText renders short strings cleanly without mid-render stagger issues"
  - "Treatment brand names (HydraFacial, Keratin, etc.) kept in international form across all locales — only descriptions and UI copy are translated"
  - "Prices use ₺ + Western digits across all three locales — consistent readability regardless of text direction"

patterns-established:
  - "Phase 4 section components import types via: import { Treatment, StatItem } from '../../types/content'"
  - "Locale data accessed via: t('services.treatments', { returnObjects: true }) as Treatment[]"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, SRVC-01, SRVC-02]

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 4 Plan 01: Content Types and Locale Data Foundation Summary

**TypeScript content type definitions and trilingual locale JSON (EN/TR/AR) for all Phase 4 sections — 5 interfaces, 20 treatments across 5 categories, hero/stats/testimonials/teaser copy in three languages**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T00:31:44Z
- **Completed:** 2026-02-25T00:35:04Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Created src/types/content.ts with 5 exported TypeScript interfaces (StatItem, Testimonial, Category, Treatment, TeaserCard) — pure type declarations, zero imports, compiles with zero errors
- Extended EN/TR/AR common.json files with complete Phase 4 content: hero, stats (numeric values), services teaser (3 cards), academy teaser (2 cards), testimonials (3 entries), 5 service categories, 20 treatments
- All treatment IDs are stable unique kebab-case strings ensuring AnimatePresence key safety; all stat values are JSON numbers required by the count-up animation

## Task Commits

Each task was committed atomically:

1. **Task 1: Create content type definitions** - `5af37d0` (feat)
2. **Task 2: Populate all three locale JSON files** - `d1a6c14` (feat)

## Files Created/Modified

- `src/types/content.ts` - 5 exported interfaces: StatItem, Testimonial, Category, Treatment, TeaserCard
- `src/i18n/locales/en/common.json` - Extended with home.* and services.* keys in English
- `src/i18n/locales/tr/common.json` - Extended with home.* and services.* keys in natural Turkish
- `src/i18n/locales/ar/common.json` - Extended with home.* and services.* keys in natural Arabic

## Decisions Made

- StatItem.value is a JSON number (not string) — StatCounter uses `animate(0, target)` where target must be numeric; strings would cause NaN animation
- Treatment IDs are stable kebab-case slugs (`hydra-facial`, `lash-lift`, etc.) — never array indices — prevents AnimatePresence key collisions when filtering by category
- Arabic hero headline kept to 2 words ("جمالك. فنّنا.") — TypewriterText renders short strings cleanly; long Arabic strings can stagger-animate oddly mid-render
- Treatment brand names (HydraFacial, Keratin Smoothing, etc.) kept in international form across all locales — only descriptions and UI copy translated
- Prices use `₺` + Western digits across all three locales for consistent readability regardless of text direction

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Content foundation is complete; Plans 02, 03, and 05 can import from `src/types/content.ts` and read locale data without TypeScript errors
- All 20 treatment entries have stable string IDs ready for AnimatePresence key usage in the Services filter component
- Arabic content may benefit from human Arabic review before production (noted as pre-existing concern in STATE.md)

---
*Phase: 04-homepage-and-services*
*Completed: 2026-02-25*
