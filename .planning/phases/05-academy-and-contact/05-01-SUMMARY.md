---
phase: 05-academy-and-contact
plan: "01"
subsystem: ui
tags: [react, typescript, i18n, i18next, json, tailwind]

# Dependency graph
requires:
  - phase: 04-homepage-and-services
    provides: "TypeScript content interfaces (StatItem, Testimonial, Category, Treatment, TeaserCard) used as pattern for Course interface"
  - phase: 03-shared-components
    provides: "Button component (ghost/primary variants, RTL-safe logical spacing) that receives new target/rel props"
  - phase: 01-foundation
    provides: "Trilingual locale JSON structure (en/tr/ar/common.json) with top-level domain keys"
provides:
  - "Course TypeScript interface exported from src/types/content.ts with stable slug id, title, description, duration, price fields"
  - "Button component extended with optional target and rel props for external WhatsApp anchor links"
  - "academy.* locale keys in EN/TR/AR: hero, courses (2 items), enroll_cta, contact_cta"
  - "contact.* locale keys in EN/TR/AR: hero, form (7 service_options), whatsapp_cta, whatsapp_message, location with hours"
affects:
  - 05-02-academy-section
  - 05-03-contact-section

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Course interface matches Treatment interface pattern: stable slug id, descriptive fields, price as string"
    - "Button target/rel props follow existing href spread pattern — passed directly to Tag element"
    - "Arabic durations use Arabic-Indic numerals (١٢ أسبوعًا) consistent with services.treatments Arabic durations"
    - "Prices use Western digits with ₺ prefix across all locales per 04-01 locked decision"

key-files:
  created: []
  modified:
    - src/types/content.ts
    - src/components/ui/Button.tsx
    - src/i18n/locales/en/common.json
    - src/i18n/locales/tr/common.json
    - src/i18n/locales/ar/common.json

key-decisions:
  - "Course interface uses price as string (not number) matching Treatment.price — ₺ prefix and thousands formatting embedded in locale JSON"
  - "Button target/rel added as optional props spread onto Tag — ignored by browsers on button, works correctly on anchor"
  - "Turkish price thousands separator uses dot (₺8.500) per TR locale convention, EN/AR use comma (₺8,500)"
  - "Arabic course durations use Arabic-Indic numerals consistent with services.treatments Arabic pattern"

patterns-established:
  - "Content interface pattern: id (stable kebab slug), localized string fields, price as ₺-prefixed string"
  - "Locale key structure for pages: {page}.hero.{headline|subtitle}, {page}.{section_key}, {page}.{cta_key}"

requirements-completed: [ACAD-01, ACAD-02, CNTC-01, CNTC-02, CNTC-03]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 5 Plan 01: Content Foundation Summary

**Course TypeScript interface, Button target/rel extension, and trilingual academy+contact locale keys unblocking Plans 05-02 and 05-03**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T02:01:49Z
- **Completed:** 2026-02-25T02:04:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Added Course TypeScript interface to src/types/content.ts with stable slug id, localized string fields (title, description, duration, price) — matches existing Treatment/TeaserCard patterns
- Extended Button.tsx ButtonProps with optional `target` and `rel` props spread onto the Tag element, enabling WhatsApp external links with `_blank` and `noopener noreferrer`
- Added full `academy.*` and `contact.*` locale key namespaces in EN, TR, and AR — 2 courses per locale, 7 contact form service_options, business hours, WhatsApp CTA copy
- All JSON files validated as valid JSON with correct item counts; npx tsc --noEmit passes with zero errors

## Task Commits

Each task was committed atomically:

1. **Task 1: Add Course interface and extend Button with target/rel props** - `2ed3664` (feat)
2. **Task 2: Add academy and contact locale keys in all three languages** - `da08fba` (feat)

## Files Created/Modified
- `src/types/content.ts` - Added Course interface after TeaserCard (id, title, description, duration, price)
- `src/components/ui/Button.tsx` - Extended ButtonProps with target/rel optional string props; spread onto Tag
- `src/i18n/locales/en/common.json` - Added academy.* and contact.* top-level keys in English
- `src/i18n/locales/tr/common.json` - Added academy.* and contact.* top-level keys in Turkish
- `src/i18n/locales/ar/common.json` - Added academy.* and contact.* top-level keys in Arabic

## Decisions Made
- Course.price is a string (not number) matching Treatment.price — ₺ prefix and locale-specific thousands separators (dot for TR, comma for EN/AR) embedded in JSON
- Turkish prices use dot thousands separator (₺8.500 / ₺10.500) per TR locale convention
- Arabic course durations use Arabic-Indic numerals (١٢ أسبوعًا / ١٦ أسبوعًا) consistent with services.treatments Arabic pattern
- Button's target/rel props spread directly onto the Tag element — browsers ignore these on button elements and apply them correctly on anchor elements

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Plans 05-02 (Academy section) and 05-03 (Contact section) can now run in parallel — both Course interface and all locale keys are available
- EmailJS credentials (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) still needed before Phase 5 validation
- WhatsApp business number in E.164 format (90XXXXXXXXXX) still needed for WhatsApp CTA wiring in 05-02 and 05-03

## Self-Check: PASSED

All created/modified files verified present. Both task commits confirmed in git log. Course interface and Button target/rel props confirmed in source files.

---
*Phase: 05-academy-and-contact*
*Completed: 2026-02-25*
