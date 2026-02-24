---
phase: 02-shell
plan: 04
subsystem: ui
tags: [react, framer-motion, i18n, rtl, tailwind, navigation, animation]

# Dependency graph
requires:
  - phase: 02-shell-03
    provides: AnimatedOutlet + RootLayout + five page stubs assembled and running

provides:
  - Human-verified Phase 2 shell: cinematic transitions, sticky navbar, mobile hamburger, no horizontal scroll
  - Three runtime bug fixes for ScrollRestoration, Arabic font-size compounding, Arabic font quality

affects:
  - 03-home-page
  - 04-inner-pages
  - 05-contact

# Tech tracking
tech-stack:
  added: ["Tajawal (Google Fonts) — replaced Noto Sans Arabic for Arabic typography"]
  patterns:
    - "useEffect scroll-to-top on pathname change instead of ScrollRestoration (data-router only)"
    - "Arabic font-size in rem not em — prevents compounding on nested elements"

key-files:
  created: []
  modified:
    - "src/layouts/RootLayout.tsx"
    - "src/styles/globals.css"
    - "index.html"

key-decisions:
  - "ScrollRestoration requires createBrowserRouter (data router) — BrowserRouter users must use useEffect scroll-to-top pattern"
  - "Arabic font-size must be set in rem (not em) to prevent compounding multiplication on nested elements"
  - "Tajawal chosen over Noto Sans Arabic for modern geometric feel closer to Apple/ChatGPT Arabic typography — 300/400/500/700 weights"

patterns-established:
  - "Phase 2 shell verified against four criteria: cinematic transitions, sticky navbar + controls, mobile hamburger overlay, no horizontal scroll 390px–1440px"
  - "RTL bonus criterion: Arabic switches layout to RTL, transitions slide from opposite side"

requirements-completed:
  - FNDTN-06
  - FNDTN-07
  - NAV-01
  - NAV-02

# Metrics
duration: 15min
completed: 2026-02-25
---

# Phase 2 Plan 04: Human Verification Summary

**Phase 2 shell verified: cinematic slide+fade transitions, sticky RTL-aware navbar with language/theme controls, animated mobile hamburger overlay, and zero horizontal scroll across 390px–1440px — three runtime bugs discovered and fixed during verification.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-02-25T00:30:00Z
- **Completed:** 2026-02-25T00:42:00Z
- **Tasks:** 2/2
- **Files modified:** 3

## Accomplishments

- Human verification confirmed all four Phase 2 success criteria passed
- Cinematic page transitions (AnimatePresence mode='wait') visible and smooth on every navigation
- Sticky Navbar with LanguageSwitcher (TR/EN/Arabic) and ThemeToggle functional on all 5 pages
- Mobile hamburger (390px) opens animated full-screen overlay; links close menu and navigate
- No horizontal scroll from 390px to 1440px on any page
- Bonus RTL criterion passed: Arabic layout mirrors, transitions reverse direction
- Three runtime bugs discovered and fixed during verification (see deviations)

## Task Commits

Each task was committed atomically:

1. **Task 1: Run dev server and prepare verification** — no code changes (server running)
2. **Task 2: Human verify Phase 2 shell** — approved after bug fixes

**Bug fix commits (during verification):**
- `e8278a7` — fix(02-shell): replace ScrollRestoration with useEffect scroll-to-top
- `ba1ba06` — fix(02-shell): fix Arabic font-size compounding on nested elements
- `413ebe1` — fix(02-shell): switch Arabic font from Noto Sans Arabic to Tajawal

## Files Created/Modified

- `src/layouts/RootLayout.tsx` — Replaced ScrollRestoration with useEffect scroll-to-top on pathname change
- `src/styles/globals.css` — Fixed Arabic :lang(ar) font-size from 1.2em to 1.05rem; switched font-family to Tajawal
- `index.html` — Updated Google Fonts import from Noto Sans Arabic to Tajawal (300/400/500/700 weights)

## Decisions Made

- **ScrollRestoration removed:** React Router's `ScrollRestoration` component only works with `createBrowserRouter` (data router API). Since the project uses `BrowserRouter`, replaced with a `useEffect` that calls `window.scrollTo(0, 0)` on pathname change. This is the correct pattern for non-data routers.
- **Arabic font-size set in rem:** The original `1.2em` on `:lang(ar)` compounded on every nested element (e.g., a paragraph inside a div inside a section could reach 1.728em or more). Changed to `1.05rem` which is fixed relative to the root font size regardless of nesting depth.
- **Tajawal over Noto Sans Arabic:** Noto Sans Arabic, while comprehensive, has a utilitarian feel. Tajawal is a modern geometric Arabic font with a clean, premium look consistent with the project's luxury editorial aesthetic.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] ScrollRestoration requires data router — crash on navigation**
- **Found during:** Task 2 (Human verify Phase 2 shell) — dev server startup and first navigation
- **Issue:** `ScrollRestoration` from `react-router-dom` throws a runtime error when used with `BrowserRouter` instead of `createBrowserRouter`. The component requires the data router context that `BrowserRouter` does not provide.
- **Fix:** Replaced `<ScrollRestoration />` with a `useEffect` hook in `RootLayout.tsx` that calls `window.scrollTo(0, 0)` whenever `location.pathname` changes.
- **Files modified:** `src/layouts/RootLayout.tsx`
- **Verification:** Navigation between pages no longer throws; scroll position resets to top on every route change.
- **Committed in:** `e8278a7`

**2. [Rule 1 - Bug] Arabic font-size 1.2em compounding on nested elements**
- **Found during:** Task 2 — Arabic language mode visual inspection
- **Issue:** `:lang(ar) { font-size: 1.2em }` in `globals.css` applies to every Arabic-language element. Since `em` is relative to the current element's computed font size, nested elements each multiply the size: body → 1.2em, section → 1.44em, p → 1.728em. This caused inconsistent and oversized Arabic text in deeply nested structures.
- **Fix:** Changed `font-size: 1.2em` to `font-size: 1.05rem` and `line-height: 1.8` to `1.7` for better visual balance. `rem` is always relative to the root element, so nesting has no compounding effect.
- **Files modified:** `src/styles/globals.css`
- **Verification:** Arabic text renders at consistent size regardless of DOM nesting depth.
- **Committed in:** `ba1ba06`

**3. [Rule 1 - Bug] Arabic font Noto Sans Arabic rendered poorly for luxury brand**
- **Found during:** Task 2 — Arabic typography quality review during verification
- **Issue:** Noto Sans Arabic, while technically correct for RTL Arabic, has a utilitarian and dense appearance that clashes with the premium, editorial brand identity required by the project. The font felt inconsistent with the Latin font aesthetic.
- **Fix:** Switched Google Fonts import from Noto Sans Arabic to Tajawal, a modern geometric Arabic typeface. Updated `index.html` font import and `globals.css` font-family declaration to use `'Tajawal'`. Loaded weights 300, 400, 500, 700 to match the Latin font weight range.
- **Files modified:** `index.html`, `src/styles/globals.css`
- **Verification:** Arabic text in the live dev server displays with clean, modern letterforms consistent with the luxury brand direction.
- **Committed in:** `413ebe1`

---

**Total deviations:** 3 auto-fixed (3 Rule 1 - Bug)
**Impact on plan:** All three fixes necessary for correctness and brand quality. No scope creep — each fix addresses a direct issue with the Phase 2 shell functionality or visual fidelity.

## Issues Encountered

None beyond the three auto-fixed deviations above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 2 shell is fully verified and complete. Phase 3 (Home Page) can begin immediately.

- All five routes are accessible and correctly structured as layout + page stub
- AnimatedOutlet + AnimatePresence cinematic transitions working for all navigations
- RootLayout with scroll-to-top on navigation working correctly
- Navbar sticky, responsive, RTL-aware, with language and theme controls
- MobileMenu animated overlay working at 390px viewport
- Arabic typography using Tajawal font with correct rem-based sizing
- Theme persistence on reload confirmed
- `vercel.json` SPA catch-all rewrite in place for production deployment

**Blockers for future phases (carry-forward):**
- Arabic content requires idiomatic copywriting — technical JSON structure ready but needs human Arabic review
- EmailJS credentials required before Phase 5 validation
- WhatsApp business number in E.164 format required before Phase 5 CTA wiring
- 20+ treatment names/descriptions and 2 course curricula needed before Phase 4/5 translation JSON

---
*Phase: 02-shell*
*Completed: 2026-02-25*
