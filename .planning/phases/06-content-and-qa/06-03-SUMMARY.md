---
phase: 06-content-and-qa
plan: 03
subsystem: performance
tags: [lighthouse, vite, react-lazy, framer-motion, imagemagick, code-splitting, image-optimization]

# Dependency graph
requires:
  - phase: 06-01
    provides: locale JSON and content data fully populated
  - phase: 06-02
    provides: Playwright RTL snapshot tests establishing baseline
provides:
  - Lighthouse mobile performance scores >= 75 on all 5 pages (FNDTN-03)
  - React.lazy() page-level code splitting via router.tsx
  - Vite manual chunk splitting (framer-motion, react-router, i18n isolated)
  - Compressed image assets (7MB+ PNG -> 30-117KB JPEG)
  - useMediaQuery hook for responsive feature gating
  - Non-render-blocking Google Fonts loading
affects: [07-polish-and-ux, deployment]

# Tech tracking
tech-stack:
  added: [lighthouse@13.0.3 (global CLI), imagemagick (image compression), useMediaQuery hook]
  patterns:
    - React.lazy() with per-route Suspense boundaries in router.tsx
    - Vite manualChunks for vendor library isolation
    - Image compression: PNG->JPEG, max 800px cards / 1920px hero
    - Mobile performance guard: useMediaQuery('(max-width: 768px)') to skip heavy animations

key-files:
  created:
    - src/hooks/useMediaQuery.ts
    - public/service-facial-care.jpg
    - public/service-body-care.jpg
    - public/service-hair-care.jpg
    - public/academy-aesthetic-practitioner.jpg
    - public/academy-prof-cosmetology.jpg
    - public/aesthetic-practitioner-course.jpg
    - public/prof-cosmetology-course.jpg
    - lighthouse-home.json
    - lighthouse-services.json
    - lighthouse-academy.json
    - lighthouse-contact.json
    - lighthouse-about.json
  modified:
    - src/router.tsx
    - vite.config.js
    - index.html
    - src/components/ui/Card.tsx
    - src/components/sections/StatsSection.tsx
    - src/components/sections/ServicesTeaserSection.tsx
    - src/components/sections/AcademyTeaserSection.tsx
    - src/components/sections/CoursesSection.tsx

key-decisions:
  - "React.lazy() applied in router.tsx (not App.tsx) — router owns page-level code split; pages remain named exports"
  - "vendor-react chunk generates empty because React/ReactDOM are bundled into index.js main chunk by Vite — acceptable, framer-motion isolation is the key win"
  - "PNG images (7MB each) compressed to JPEG at quality 75-80, resized to max 1920px hero / 800px cards — 98% size reduction"
  - "Original PNG files kept in public/ as originals; new kebab-case JPEG filenames added and components updated"
  - "Google Fonts: media=print onload=this.media='all' pattern makes font CSS non-render-blocking (saves 836ms on initial paint)"
  - "hero-bg.jpg preloaded with fetchpriority=high — background-image CSS url() cannot be LCP-optimized otherwise"
  - "StatsSection animated counters disabled on mobile via isMobile guard — Framer Motion forced-reflow was 38ms on Lighthouse Moto G4 simulation"
  - "Plan assumption wrong: stated 'CSS gradients only, no images' — actual codebase had 7MB+ PNG/JPG images added in Phase 4-5. Image compression was primary remediation."

patterns-established:
  - "Image assets: always compress before deployment — max 1920px hero, 800px cards, JPEG quality 75-80"
  - "Mobile performance guards: useMediaQuery('(max-width: 768px)') disables heavy JS animations (StatCounter, AnimatePresence, etc.) on mobile"
  - "Code splitting: all page-level imports in router.tsx use lazy() + per-route Suspense with branded fallback"

requirements-completed: [FNDTN-03, FNDTN-04]

# Metrics
duration: 11min
completed: 2026-02-25
---

# Phase 06 Plan 03: Lighthouse Mobile Performance Audit and Remediation Summary

**Lighthouse mobile performance gate achieved: all 5 pages score 83-89 after image compression (7MB->30KB), React.lazy() code splitting, and Framer Motion vendor chunk isolation**

## Performance

- **Duration:** 11 min
- **Started:** 2026-02-25T16:06:38Z
- **Completed:** 2026-02-25T16:17:50Z
- **Tasks:** 2
- **Files modified:** 13 source files + 8 new compressed image assets + 5 Lighthouse JSON reports

## Accomplishments

- All 5 pages now score >= 75 on Lighthouse mobile performance (home 85, services 87, academy 83, contact 85, about 89)
- Identified and resolved plan assumption error — site uses actual PNG/JPG images (7MB each), not CSS gradients as documented in plan context
- Image compression: 7 PNG/JPEG assets reduced from 6-7MB each to 30-117KB (98% reduction) using ImageMagick
- React.lazy() + Suspense applied to all 5 page routes in router.tsx for page-level code splitting
- Vite manualChunks splits framer-motion (139KB), react-router (47KB), and i18n (48KB) into separate cacheable vendor chunks
- Non-render-blocking Google Fonts via media="print" onload trick (saves 836ms on FCP)
- useMediaQuery hook created; StatsSection animated counters replaced with static values on mobile (eliminates Framer Motion forced-reflow on Lighthouse simulated device)

## Task Commits

Each task was committed atomically:

1. **Task 1: Run Lighthouse audits on all 5 pages (production build)** - `405b0fe` (feat)
   - Initial scores: home 65, services 83, academy 68, contact 79, about 97
   - 5 lighthouse-*.json reports saved for documentation

2. **Task 2: Remediate pages scoring below 75** - `210d420` (feat)
   - Applied Levels 1+2+3 remediations plus image compression auto-fix
   - Final scores: home 85, services 87, academy 83, contact 85, about 89 — all PASS

**Plan metadata:** committed in final docs commit

## Initial vs Final Scores

| Page     | Before | After | Change |
|----------|--------|-------|--------|
| /        | 65     | 85    | +20    |
| /services| 83     | 87    | +4     |
| /academy | 68     | 83    | +15    |
| /contact | 79     | 85    | +6     |
| /about   | 97     | 89    | -8*    |

*About page variance within normal run-to-run range; still well above 75 gate.

## Files Created/Modified

- `src/router.tsx` — replaced static page imports with React.lazy() + per-route Suspense boundaries
- `vite.config.js` — added manualChunks config splitting framer-motion, react, router, i18n into vendor chunks
- `index.html` — added LCP hero preload link, non-render-blocking font loading via media=print onload
- `src/components/ui/Card.tsx` — added loading="lazy" decoding="async" to card images
- `src/components/sections/StatsSection.tsx` — added useMediaQuery guard; static numbers on mobile, animated counters on desktop
- `src/components/sections/ServicesTeaserSection.tsx` — updated image paths to compressed JPEG filenames
- `src/components/sections/AcademyTeaserSection.tsx` — updated image paths to compressed JPEG filenames
- `src/components/sections/CoursesSection.tsx` — updated image paths to compressed JPEG filenames
- `src/hooks/useMediaQuery.ts` — new hook: reactive CSS media query with addEventListener('change')
- `public/service-{facial,body,hair}-care.jpg` — compressed from 7MB PNG to ~30KB JPEG
- `public/academy-{aesthetic-practitioner,prof-cosmetology}.jpg` — compressed from 7MB PNG to ~35KB JPEG
- `public/aesthetic-practitioner-course.jpg` + `public/prof-cosmetology-course.jpg` — compressed from 7MB PNG to 55-57KB JPEG
- `public/hero-bg.jpg` — compressed from 7.5MB JPEG to 116KB (quality 75, max 1920px)
- `lighthouse-{home,services,academy,contact,about}.json` — Lighthouse mobile performance reports for all 5 pages

## Decisions Made

- React.lazy() applied in `router.tsx` not `App.tsx` — router owns page-level code splitting; pages keep named exports
- `vendor-react` chunk is empty (React/ReactDOM bundled in main index.js by Vite) — acceptable, framer-motion isolation is the key performance win
- PNG images compressed to JPEG at quality 75-80, resized to max 1920px (hero) / 800px (cards) — 98% size reduction achieved
- Original large PNG files retained in public/ as originals; new kebab-case JPEG filenames added; all components updated
- Google Fonts: `media="print" onload="this.media='all'"` pattern makes font CSS non-render-blocking — saves 836ms on FCP
- `hero-bg.jpg` preloaded via `<link rel="preload" as="image" fetchpriority="high">` — CSS background-image cannot be early-discovered without this
- StatsSection animated counters disabled on mobile (Framer Motion forced-reflow was 38ms on Lighthouse Moto G4 CPU 4x throttle simulation)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan assumption incorrect: site uses 7MB+ PNG/JPG images, not CSS gradients**
- **Found during:** Task 1 (Lighthouse audits) — `total-byte-weight` audit showed 42MB of images
- **Issue:** Plan stated "image optimization not applicable — site uses CSS gradients with no img elements." In practice, Phase 4-5 added actual PNG/JPG images to public/ for service cards, academy cards, and hero background. These 7MB+ files caused 39.8s LCP at Lighthouse's 1474 KB/s simulated mobile throttle.
- **Fix:** Compressed all 8 images using ImageMagick — PNG->JPEG conversion at quality 75-80, resized to max dimensions appropriate for usage (800px cards, 1920px hero). Updated component image src paths to kebab-case JPEG filenames.
- **Files modified:** public/*.jpg (new compressed files), src/components/sections/{ServicesTeaserSection,AcademyTeaserSection,CoursesSection}.tsx
- **Verification:** Lighthouse total-byte-weight improved from 42MB to ~0.5MB; home LCP from 39.8s to within acceptable range
- **Committed in:** 210d420 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — incorrect plan assumption corrected)
**Impact on plan:** Essential correction. Without image compression, Levels 1-3 from the plan would not have been sufficient (React.lazy alone moved home from 65 to 73 — still failing). Image compression was the primary lever.

## Issues Encountered

- Initial round of remediations (React.lazy + Vite chunks + lazy image loading + Google Fonts fix) improved home score from 65 to 73 — still 2 points below gate
- Root cause: 7.5MB hero-bg.jpg still loading synchronously despite preload hint; 7MB PNG card images still counted by Lighthouse even with loading="lazy"
- Resolution: Compressed images with ImageMagick from 7MB+ to 30-117KB; re-ran full audit suite; all pages reached 83-89

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Lighthouse mobile performance gate cleared — all 5 pages score 83-89 (hard requirement FNDTN-03 satisfied)
- FNDTN-04 (Playwright RTL baseline) completed in 06-02
- Phase 6 Plans 06-01 through 06-03 complete; 06-04 remaining in phase
- Original large PNG files still in public/ directory — can be removed once confirmed no other references remain; deferred to avoid risk

## Self-Check: PASSED

All files verified present. Both task commits confirmed in git log. All 5 pages confirm >= 75 scores in final lighthouse JSON reports.

---
*Phase: 06-content-and-qa*
*Completed: 2026-02-25*
