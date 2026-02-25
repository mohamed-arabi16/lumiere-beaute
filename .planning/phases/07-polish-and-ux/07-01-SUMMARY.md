---
phase: 07-polish-and-ux
plan: 01
subsystem: ui
tags: [i18n, i18next, react-i18next, locale, json]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: i18next config with bundled locale JSON imports
provides:
  - ar.json, en.json, tr.json locale files (renamed from common.json)
  - Updated config.ts importing from per-language file names with namespace key 'common' unchanged
affects: [07-02-arabic-copy-review]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Locale JSON file name matches language code (ar.json, en.json, tr.json) while i18next namespace key remains 'common' — file name and namespace are decoupled"

key-files:
  created:
    - src/i18n/locales/ar/ar.json
    - src/i18n/locales/en/en.json
    - src/i18n/locales/tr/tr.json
  modified:
    - src/i18n/config.ts

key-decisions:
  - "Locale JSON file name decoupled from i18next namespace key — file renamed to ar/en/tr.json but namespace stays 'common', preserving all useTranslation('common') calls with zero component changes"

patterns-established:
  - "Locale file naming: language-code.json (ar.json, en.json, tr.json) — not namespace-based names"

requirements-completed: [POL-01]

# Metrics
duration: 3min
completed: 2026-02-25
---

# Phase 7 Plan 01: Locale JSON Rename Summary

**Renamed three per-language locale files from common.json to ar.json / en.json / tr.json and updated config.ts import paths, keeping the i18next 'common' namespace key intact so all components require zero modification.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-02-25T02:57:00Z
- **Completed:** 2026-02-25T02:59:59Z
- **Tasks:** 2
- **Files modified:** 4 (3 renamed, 1 updated)

## Accomplishments
- Renamed all three `common.json` locale files to per-language names (`ar.json`, `en.json`, `tr.json`) with zero content changes
- Updated `config.ts` import statements and variable names to reference the new file names
- Confirmed TypeScript compiles cleanly with no import errors
- Confirmed zero remaining references to `common.json` anywhere in `src/`
- POL-01 success criterion satisfied: `ar.json`, `en.json`, `tr.json` exist; `common.json` is fully removed

## Task Commits

Each task was committed atomically:

1. **Task 1: Rename locale JSON files from common.json to per-language names** - `fdf87a2` (chore)
2. **Task 2: Update config.ts to import from renamed files** - `f60029d` (chore)

## Files Created/Modified
- `src/i18n/locales/ar/ar.json` - Arabic translations (renamed from common.json, content identical)
- `src/i18n/locales/en/en.json` - English translations (renamed from common.json, content identical)
- `src/i18n/locales/tr/tr.json` - Turkish translations (renamed from common.json, content identical)
- `src/i18n/config.ts` - Updated import paths from `*/common.json` to `*/ar.json`, `*/en.json`, `*/tr.json`; variable names updated from `trCommon/enCommon/arCommon` to `trTranslations/enTranslations/arTranslations`; namespace key `'common'` in resources object unchanged

## Decisions Made
- Locale JSON file name is decoupled from i18next namespace key — files renamed to `ar.json/en.json/tr.json` but `{ common: translations }` namespace mapping preserved. This allows POL-01 file naming requirement to be satisfied without touching any of the 30+ component `useTranslation('common')` calls.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- POL-01 satisfied: file naming convention matches language code
- Plan 07-02 (Arabic copy review) can now target `src/i18n/locales/ar/ar.json` directly with corrected idiomatic Arabic translations
- Language switcher loads correct locale content at runtime — no behavioral change from this rename

---
*Phase: 07-polish-and-ux*
*Completed: 2026-02-25*
