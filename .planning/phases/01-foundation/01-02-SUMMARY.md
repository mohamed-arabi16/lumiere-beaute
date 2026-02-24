---
phase: 01-foundation
plan: "02"
subsystem: ui
tags: [tailwindcss, css-custom-properties, dark-mode, google-fonts, fouc-prevention, i18n, rtl]

# Dependency graph
requires:
  - phase: 01-foundation
    plan: "01"
    provides: "@tailwindcss/vite 4.2.1 wired into Vite plugin, src/index.css preserved for import chain"
provides:
  - "Tailwind v4 @theme block with all 10 brand teal color tokens (celadon-100 through stormy-teal-950)"
  - "Semantic surface color tokens (surface-ivory, surface-dark, surface-dark-card)"
  - "Typography custom properties (font-display, font-body, font-arabic)"
  - "@custom-variant dark for class-based dark mode (.dark, .dark *)"
  - "Arabic language overrides (:lang(ar)) preventing Cormorant Garamond glyph fallback"
  - "CSS gradient placeholder classes (placeholder-gradient-primary/card/hero)"
  - "Aspect ratio placeholder classes (placeholder-aspect-hero/card/portrait)"
  - "Blocking FOUC-prevention script in index.html: dark class + lang/dir set before first paint"
  - "Google Fonts loading: Cormorant Garamond, Inter, Noto Sans Arabic"
affects: [01-03, 02-components, 03-pages, 04-content, all-subsequent-plans]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Tailwind v4 color tokens: define via @theme { --color-name: value } — generates bg-, text-, border- utilities automatically"
    - "Dark mode: @custom-variant dark (&:where(.dark, .dark *)) — toggle by adding/removing 'dark' class on <html>"
    - "FOUC prevention: blocking IIFE in <head> BEFORE any <link> stylesheet reads localStorage and sets class/lang/dir"
    - "Arabic font safety: :lang(ar) override forces font-arabic family — never inherit font-display which lacks Arabic glyphs"
    - "Gradient placeholders: CSS classes using var() tokens — all image slots use these until real images arrive"

key-files:
  created:
    - src/styles/globals.css
  modified:
    - src/index.css
    - index.html

key-decisions:
  - "Blocking script placed BEFORE all <link> tags in <head> — order is critical: must execute before CSS paints"
  - "lang=tr is default on <html>; blocking script overrides immediately from localStorage if different language saved"
  - "Locale variant normalization in blocking script (ar-SA → ar, en-US → en) prevents i18next locale format mismatch causing wrong dir attribute"
  - "@custom-variant dark uses .dark selector (class-based) not media query — enables user-controlled theme toggle independent of system preference"

patterns-established:
  - "Color token pattern: all brand colors accessed via var(--color-*) or Tailwind utility classes — never hardcode hex values in components"
  - "Dark mode pattern: use dark: Tailwind variant prefix — activated by .dark class on <html> via @custom-variant"
  - "Placeholder pattern: all image/media slots use .placeholder-gradient-* + .placeholder-aspect-* classes until real assets provided"
  - "RTL pattern: blocking script ensures dir=rtl is set before first paint for Arabic — no layout flash on reload"

requirements-completed: [FNDTN-01, FNDTN-02, FNDTN-08, FNDTN-09]

# Metrics
duration: 1min
completed: 2026-02-24
---

# Phase 1 Plan 02: CSS Token System and FOUC Prevention Summary

**Tailwind v4 @theme with 10 brand teal color tokens, class-based dark mode, Arabic font safety overrides, gradient placeholder system, and blocking FOUC-prevention script for zero-flash theme/direction restoration on reload**

## Performance

- **Duration:** 1 min
- **Started:** 2026-02-24T14:01:17Z
- **Completed:** 2026-02-24T14:02:47Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Created `src/styles/globals.css` with complete Tailwind v4 @theme block — all 10 brand color tokens now generate `bg-*`, `text-*`, `border-*` utility classes automatically
- Established class-based dark mode via `@custom-variant dark` — toggling the `dark` class on `<html>` switches background from warm ivory (#F4FAF7) to forest-at-dusk teal (#082F2D)
- Added Arabic language overrides preventing Cormorant Garamond glyph fallback — `:lang(ar)` forces Noto Sans Arabic/Cairo font family with adjusted size and line-height
- Created 6 CSS gradient placeholder classes using color token variables — all image slots across Phases 2-6 use these until real assets arrive
- Updated `index.html` with synchronous FOUC-prevention IIFE that runs before any stylesheet renders, restoring dark class and lang/dir from localStorage with locale normalization

## Task Commits

Each task was committed atomically:

1. **Task 1: Create complete CSS system in src/styles/globals.css** - `98e3787` (feat)
2. **Task 2: Update index.html with blocking FOUC script and Google Fonts** - `f9ac44e` (feat)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `src/styles/globals.css` - Complete CSS system: @import tailwindcss, @theme with 10 brand tokens + semantic surfaces + typography, @custom-variant dark, global base styles, Arabic overrides, gradient/aspect placeholder classes
- `src/index.css` - Replaced Vite scaffold with single `@import "./styles/globals.css"` — keeps main.tsx import chain intact
- `index.html` - Added blocking FOUC script (before all stylesheets), Google Fonts preconnect + stylesheet (Cormorant Garamond, Inter, Noto Sans Arabic), default lang=tr, title "Lumiere Beaute"

## Decisions Made
- Blocking script placed BEFORE all `<link>` tags — critical ordering: must execute synchronously during HTML parse before CSS renders
- Default `lang="tr"` on `<html>` with immediate script override — keeps valid HTML while allowing zero-flash language restoration
- Locale variant normalization (ar-SA → ar, en-US → en) in blocking script — i18next sometimes stores full locale codes; this prevents wrong dir attribute
- `@custom-variant dark (&:where(.dark, .dark *))` — class-based, not `prefers-color-scheme` media query — enables user-controlled toggle independent of system setting

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 10 brand color tokens generate Tailwind utility classes — Phase 2 components can use `bg-celadon-100`, `text-stormy-teal-950`, `dark:bg-surface-dark` etc. immediately
- Gradient placeholder classes ready — service cards, hero sections, portrait slots use `.placeholder-gradient-*` until real images provided
- FOUC prevention operational — dark mode and Arabic RTL restore correctly on page reload with zero flash
- Plan 03 (i18n providers) can proceed in parallel — CSS foundation is independent of provider setup
- No blockers for subsequent plans

---
*Phase: 01-foundation*
*Completed: 2026-02-24*

## Self-Check: PASSED

- src/styles/globals.css: FOUND
- src/index.css: FOUND
- index.html: FOUND
- 01-02-SUMMARY.md: FOUND
- Commit 98e3787: FOUND
- Commit f9ac44e: FOUND
