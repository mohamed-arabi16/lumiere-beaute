---
phase: 01-foundation
plan: "03"
subsystem: ui
tags: [i18next, react-i18next, i18next-browser-languagedetector, react-context, tailwind, rtl, dark-mode, localStorage]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Vite + React + TypeScript + Tailwind v4 scaffold with i18next/react-i18next already installed"

provides:
  - "i18next initialized with bundled TR/EN/AR resources and browser language detection (fallback: 'tr')"
  - "ThemeProvider with dark/light toggle synced to localStorage and document.documentElement.classList"
  - "AppProviders composition tree: ThemeProvider wrapping I18nextProvider"
  - "useTheme hook returning { theme, toggleTheme } from ThemeContext"
  - "useDirection hook returning { dir, isRTL } with DOM side-effect syncing documentElement.dir/lang"
  - "main.tsx wraps App in AppProviders"

affects:
  - 01-04
  - 02-shell
  - all-phases

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Bundled i18n resources (not HTTP backend) to eliminate flash of untranslated keys"
    - "LanguageDetector order: localStorage -> navigator -> htmlTag with localStorage caching"
    - "supportedLngs constrains detection to ['tr', 'en', 'ar'] preventing en-US mismatch"
    - "ThemeProvider initializer reads localStorage once on mount to sync with blocking script"
    - "useDirection manages all documentElement.dir/lang side effects in one place"
    - "AppProviders pattern for composable provider tree (BrowserRouter deferred to Phase 2)"

key-files:
  created:
    - src/i18n/config.ts
    - src/i18n/locales/tr/common.json
    - src/i18n/locales/en/common.json
    - src/i18n/locales/ar/common.json
    - src/providers/ThemeProvider.tsx
    - src/providers/AppProviders.tsx
    - src/hooks/useTheme.ts
    - src/hooks/useDirection.ts
  modified:
    - src/main.tsx

key-decisions:
  - "Bundled locale resources (direct JSON import, not i18next-http-backend) to prevent async load delay causing flash of untranslated keys"
  - "fallbackLng set to 'tr' — Turkish is the primary market language, used when browser language is unsupported"
  - "supportedLngs: ['tr', 'en', 'ar'] specified explicitly to prevent 'en-US' from failing to match 'en' resources"
  - "ThemeProvider reads localStorage in useState initializer to synchronize with index.html blocking script without a re-render"
  - "BrowserRouter intentionally omitted from AppProviders — added in Phase 2 Shell when routing is configured"
  - "useTheme exported from both ThemeProvider (implementation) and hooks/useTheme.ts (clean import path re-export)"

patterns-established:
  - "useDirection: single hook owns all RTL/LTR DOM side effects — never set documentElement.dir anywhere else"
  - "useTheme: single hook owns all dark/light DOM side effects — never toggle 'dark' class outside ThemeProvider"
  - "AppProviders: all global providers composed here — Phase 2+ adds BrowserRouter as outermost wrapper"

requirements-completed: [FNDTN-02, FNDTN-03, FNDTN-04, FNDTN-05]

# Metrics
duration: 2min
completed: 2026-02-24
---

# Phase 1 Plan 03: i18n + Theming Infrastructure Summary

**i18next trilingual infrastructure (TR/EN/AR with RTL support) and dark-mode ThemeProvider wired into React tree via AppProviders**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-24T14:01:24Z
- **Completed:** 2026-02-24T14:02:52Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- i18next initialized with bundled resources (no async loading), browser language detection, Turkish fallback, and all nav/test keys in TR/EN/AR
- ThemeProvider syncs dark/light state from localStorage on mount, manages document class toggle, and exposes toggleTheme via context
- AppProviders composition pattern established with ThemeProvider wrapping I18nextProvider, main.tsx updated to wrap App

## Task Commits

Each task was committed atomically:

1. **Task 1: Create i18n config with bundled trilingual resources and browser language detection** - `90facbd` (feat)
2. **Task 2: Create ThemeProvider, AppProviders, hooks, and wire up main.tsx** - `95d06f8` (feat)

**Plan metadata:** (docs commit — see below)

## Files Created/Modified

- `src/i18n/config.ts` - i18next initialization: LanguageDetector + bundled TR/EN/AR resources, fallbackLng 'tr', supportedLngs constraint
- `src/i18n/locales/tr/common.json` - Turkish translations: nav (5 keys) + test (6 keys)
- `src/i18n/locales/en/common.json` - English translations: nav (5 keys) + test (6 keys)
- `src/i18n/locales/ar/common.json` - Arabic translations: nav (5 keys) + test (6 keys) for RTL
- `src/providers/ThemeProvider.tsx` - Dark/light ThemeContext with localStorage persistence and DOM class sync
- `src/providers/AppProviders.tsx` - Provider composition: ThemeProvider > I18nextProvider
- `src/hooks/useTheme.ts` - Re-export of useTheme from ThemeProvider for clean import paths
- `src/hooks/useDirection.ts` - useDirection hook: reads i18n.dir(i18n.language), syncs documentElement.dir/.lang in useEffect
- `src/main.tsx` - Updated entry point wrapping App in AppProviders

## Decisions Made

- Bundled locale JSON imports (not i18next-http-backend) to avoid async loading causing flash of untranslated keys on first render
- `supportedLngs: ['tr', 'en', 'ar']` explicitly set — without this, 'en-US' browser language would fail to match 'en' resources
- ThemeProvider initializer function reads localStorage synchronously to match the blocking script state, preventing a dark-mode flash from React re-render
- BrowserRouter intentionally omitted from AppProviders in this plan — Phase 2 Shell plan adds it as the outermost wrapper

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Full i18n + theming behavioral foundation is ready for any component to consume
- `useTheme()` returns `{ theme, toggleTheme }` — ready for Navbar toggle button in Phase 2
- `useDirection()` returns `{ dir, isRTL }` — ready for RTL-aware layout components
- `useTranslation('common')` resolves all nav.* and test.* keys in TR/EN/AR
- Phase 2 Shell can import AppProviders and add BrowserRouter as outer wrapper without restructuring

---
*Phase: 01-foundation*
*Completed: 2026-02-24*
