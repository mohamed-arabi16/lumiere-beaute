---
phase: 05-academy-and-contact
plan: "02"
subsystem: ui
tags: [react, typescript, i18n, tailwind, framer-motion, whatsapp, react-router]

# Dependency graph
requires:
  - phase: 05-01
    provides: "Course TypeScript interface, Button target/rel extension, trilingual academy locale keys"
  - phase: 04-homepage-and-services
    provides: "Card, Typography, FadeInSection, StaggerContainer, AcademyTeaserSection patterns, pageTransitionVariants"
  - phase: 03-shared-components
    provides: "Button (ghost/primary variants), Card, Typography, animation components"
provides:
  - "CoursesSection component at src/components/sections/CoursesSection.tsx — grid of 2 course cards with WhatsApp enroll and /contact CTAs"
  - "AcademyPage replacing Phase 2 stub — hero section + CoursesSection composition with locked page transition pattern"
  - "src/vite-env.d.ts enabling import.meta.env typing (VITE_WHATSAPP_NUMBER)"
affects:
  - 05-03-contact-section

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Academy page composition: motion.div + pageTransitionVariants + custom={dir} + main > sections — mirrors HomePage locked pattern"
    - "CoursesSection maps over t('academy.courses', { returnObjects: true }) as Course[] — same pattern as TreatmentGrid/AcademyTeaserSection"
    - "WhatsApp CTA: Button as='a' target='_blank' rel='noopener noreferrer' href=buildWhatsAppURL(phone, message)"
    - "Contact CTA: React Router <Link to='/contact'> wrapping ghost Button — preserves AnimatePresence exit animation"

key-files:
  created:
    - src/components/sections/CoursesSection.tsx
    - src/vite-env.d.ts
  modified:
    - src/pages/AcademyPage.tsx

key-decisions:
  - "AcademyPage motion.div has no className — no min-h-screen or padding constraints; sections own their own spacing (locked pattern from 04-04)"
  - "WhatsApp URL built with encodeURIComponent(message) — message prefixes enroll_cta + course.title for context"
  - "vite-env.d.ts added as Rule 3 fix — missing reference blocked import.meta.env TypeScript typing for VITE_WHATSAPP_NUMBER"
  - "Hero section uses bg-stormy-teal-950 with text-celadon-100/mint-leaf-300 — same pattern as Phase 4 hero sections"

patterns-established:
  - "External CTA pattern: Button as='a' + target='_blank' + rel='noopener noreferrer' + href=buildWhatsAppURL()"
  - "Internal navigation CTA: <Link to='/route'> wrapping <Button variant='ghost'> — never <a href>"
  - "Page hero + CoursesSection composition — page is pure composition with no inline content"

requirements-completed: [ACAD-01, ACAD-02]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 5 Plan 02: Academy Page Summary

**CoursesSection with WhatsApp enroll CTAs and React Router contact links, replacing the Phase 2 Academy stub with a full hero + course grid composition**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T02:07:16Z
- **Completed:** 2026-02-25T02:09:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created CoursesSection rendering 2 course cards from `academy.courses` locale data — each showing title, description, duration, and price
- Each card has an "Enroll via WhatsApp" Button (as="a", target="_blank") opening wa.me with pre-filled message, and a "Book a Consultation" React Router Link to /contact
- Replaced Phase 2 AcademyPage stub entirely with motion.div + pageTransitionVariants + hero section + CoursesSection composition
- Added vite-env.d.ts (Rule 3 auto-fix) to enable TypeScript typing for import.meta.env.VITE_WHATSAPP_NUMBER

## Task Commits

Each task was committed atomically:

1. **Task 1: Build CoursesSection with WhatsApp enroll and Contact link CTAs** - `67d64aa` (feat)
2. **Task 2: Replace AcademyPage stub with full page composition** - `e826835` (feat)

## Files Created/Modified
- `src/components/sections/CoursesSection.tsx` - Grid of 2 course cards with enroll (WhatsApp) and contact (/contact) CTAs
- `src/pages/AcademyPage.tsx` - Academy page replacing Phase 2 stub: motion.div + hero + CoursesSection
- `src/vite-env.d.ts` - Vite client type reference enabling import.meta.env TypeScript support

## Decisions Made
- AcademyPage motion.div wrapper has no className — no min-h-screen, no padding; sections own their own spacing per locked pattern from 04-04
- WhatsApp message pre-fills `enroll_cta + course.title` so the business receives context about which course the user is enquiring about
- vite-env.d.ts was missing from the project; added as Rule 3 auto-fix since import.meta.env access was blocked without it

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added missing vite-env.d.ts for import.meta.env type support**
- **Found during:** Task 1 (Building CoursesSection with VITE_WHATSAPP_NUMBER env var)
- **Issue:** `import.meta.env.VITE_WHATSAPP_NUMBER` caused TypeScript error TS2339 — "Property 'env' does not exist on type 'ImportMeta'" because vite/client type reference was missing from the project
- **Fix:** Created `src/vite-env.d.ts` with `/// <reference types="vite/client" />` — standard Vite project file
- **Files modified:** `src/vite-env.d.ts` (created)
- **Verification:** `npx tsc --noEmit` exits 0 after adding the file
- **Committed in:** `67d64aa` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix was essential for correctness — without vite-env.d.ts, VITE_WHATSAPP_NUMBER access would fail TypeScript compilation. No scope creep.

## Issues Encountered

None beyond the vite-env.d.ts deviation above.

## User Setup Required

None - no external service configuration required for this plan.
WhatsApp number (VITE_WHATSAPP_NUMBER) and EmailJS credentials are tracked as existing blockers in STATE.md.

## Next Phase Readiness
- Academy page fully functional in all three languages (EN/TR/AR) — course titles, descriptions, durations, and prices all come from locale JSON
- Plan 05-03 (Contact section) can proceed — contact.* locale keys and Button target/rel props are already available from 05-01
- WhatsApp CTA placeholder number (905XXXXXXXXX) is in CoursesSection default — replace VITE_WHATSAPP_NUMBER env var before production

## Self-Check: PASSED

All created/modified files verified present. Both task commits (67d64aa, e826835) confirmed in git log. CoursesSection exports CoursesSection, maps academy.courses, has WhatsApp Button and Link to /contact. AcademyPage has pageTransitionVariants, custom={dir}, hero section, CoursesSection — no stub text remains.

---
*Phase: 05-academy-and-contact*
*Completed: 2026-02-25*
