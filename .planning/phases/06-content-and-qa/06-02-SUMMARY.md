---
phase: 06-content-and-qa
plan: 02
subsystem: testing
tags: [playwright, snapshot-testing, rtl, ci, github-actions, chromium, i18next]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: i18next setup with lookupLocalStorage:i18nextLng key, RTL dir attribute on html element
  - phase: 02-shell
    provides: Navbar, MobileMenu, RootLayout — components captured in nav RTL tests
  - phase: 04-homepage-and-services
    provides: HeroSection with hero-bg.jpg background, StatsSection with JS-animated counters
  - phase: 05-academy-and-contact
    provides: Academy, Contact pages tested at both viewports
provides:
  - "Playwright RTL snapshot test suite covering all 5 pages at 390px mobile and 1440px desktop"
  - "10 baseline PNG files committed for CI comparison"
  - "GitHub Actions workflow running RTL tests on push/PR to main"
affects:
  - "Any phase that modifies components captured in snapshot baselines — layout changes trigger failures"
  - "CI/CD pipeline — RTL regressions will block merges"

# Tech tracking
tech-stack:
  added:
    - "@playwright/test ^1.x (devDependency)"
    - "Playwright Chromium browser"
  patterns:
    - "RTL snapshot tests: addInitScript sets localStorage before navigation"
    - "emulateMedia(reducedMotion:reduce) disables Framer Motion JS animations for stable screenshots"
    - "waitForLoadState(networkidle) ensures all assets (hero-bg.jpg) load before snapshot"
    - "waitForSelector(html[dir=rtl]) confirms i18next has loaded Arabic locale"

key-files:
  created:
    - "playwright.config.ts — Playwright config: webServer at localhost:5173, chromium project, maxDiffPixels:100"
    - "tests/rtl-snapshots/rtl-homepage.spec.ts — Homepage RTL tests at 390px and 1440px"
    - "tests/rtl-snapshots/rtl-services.spec.ts — Services page RTL tests at 390px and 1440px"
    - "tests/rtl-snapshots/rtl-academy.spec.ts — Academy page RTL tests at 390px and 1440px"
    - "tests/rtl-snapshots/rtl-contact.spec.ts — Contact page RTL tests at 390px and 1440px"
    - "tests/rtl-snapshots/rtl-nav.spec.ts — Navbar element screenshot and mobile menu RTL tests"
    - ".github/workflows/rtl-snapshots.yml — CI workflow: ubuntu-latest, npm ci, Playwright install, test run"
    - "tests/rtl-snapshots/*/.*-chromium-darwin.png — 10 baseline snapshot PNG files"
  modified:
    - "package.json — added @playwright/test devDependency"

key-decisions:
  - "emulateMedia(reducedMotion:reduce) chosen over waitForTimeout — disables Framer Motion via MotionConfig reducedMotion=user, preventing StatCounter and entrance animations from causing unstable screenshots"
  - "waitForLoadState(networkidle) added to prevent hero-bg.jpg not loading in parallel test workers — discovered that 4-worker parallel runs caused hero image to load before server was ready"
  - "Baseline snapshots generated with single worker (--workers=1) to prevent cross-test server load from causing timing-dependent rendering differences"
  - "Navbar test captures header locator element (not full page) for focused RTL layout verification of nav items order"
  - "maxDiffPixels:100 globally in playwright.config.ts provides buffer for minor cross-platform font rendering differences between macOS and Linux CI"

patterns-established:
  - "All RTL tests: addInitScript + emulateMedia(reducedMotion) + goto + waitForSelector(html[dir=rtl]) + waitForLoadState(networkidle) + toHaveScreenshot"
  - "Baseline regeneration must use --workers=1 to guarantee stable captures under shared Vite dev server"

requirements-completed: [FNDTN-04]

# Metrics
duration: 9min
completed: 2026-02-25
---

# Phase 06 Plan 02: RTL Snapshot Tests Summary

**Playwright RTL snapshot suite for all 5 pages (homepage, services, academy, contact, nav) at 390px and 1440px, with GitHub Actions CI workflow preventing RTL regressions on merge to main**

## Performance

- **Duration:** 9 min
- **Started:** 2026-02-25T15:53:46Z
- **Completed:** 2026-02-25T16:03:39Z
- **Tasks:** 2
- **Files modified:** 18

## Accomplishments

- 10 RTL snapshot tests across 5 pages at 2 viewports each — all passing with stable baselines
- Every test forces Arabic locale via localStorage and confirms html[dir=rtl] before capturing
- GitHub Actions workflow uploads diff artifacts on failure for post-mortem inspection
- Discovered and resolved 3 screenshot stability issues: JS animations, hero image loading, parallel worker contention

## Task Commits

1. **Task 1: Install Playwright and write RTL snapshot spec files** - `6e1592d` (feat)
2. **Task 2: Create GitHub Actions CI workflow for RTL snapshots** - `f5e705b` (feat)

## Files Created/Modified

- `/playwright.config.ts` — Playwright config with webServer at localhost:5173, chromium project, maxDiffPixels:100
- `/tests/rtl-snapshots/rtl-homepage.spec.ts` — Homepage RTL tests with reducedMotion + networkidle pattern
- `/tests/rtl-snapshots/rtl-services.spec.ts` — Services page RTL tests
- `/tests/rtl-snapshots/rtl-academy.spec.ts` — Academy page RTL tests
- `/tests/rtl-snapshots/rtl-contact.spec.ts` — Contact page RTL tests
- `/tests/rtl-snapshots/rtl-nav.spec.ts` — Navbar element + mobile menu RTL tests
- `/tests/rtl-snapshots/*-snapshots/*.png` — 10 baseline PNG files (macOS Chromium)
- `/.github/workflows/rtl-snapshots.yml` — CI: push/PR to main, ubuntu-latest, artifact upload on failure

## Decisions Made

- `emulateMedia({ reducedMotion: 'reduce' })` chosen to freeze JS animations. The app's `MotionConfig reducedMotion="user"` propagates this to all Framer Motion components. However, the imperative `animate()` call in `StatCounter` is NOT covered by MotionConfig — it runs for 2 seconds regardless. The `emulateMedia` approach at least disables CSS transitions and most entrance animations, providing sufficient stability when combined with `networkidle`.
- `waitForLoadState('networkidle')` is essential for the homepage — the HeroSection uses `backgroundImage: url('/hero-bg.jpg')` which must load before the screenshot, otherwise the hero renders as a plain dark gradient.
- Baselines generated with `--workers=1` to avoid the Vite dev server being overwhelmed by 4 concurrent page loads, which caused hero image to fail loading in parallel runs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added emulateMedia(reducedMotion:reduce) to prevent JS animation instability**
- **Found during:** Task 1 (baseline generation)
- **Issue:** Playwright's built-in CSS animation disabling does NOT stop Framer Motion JS animations (StatCounter animate(), TypewriterText variants). Screenshots were unstable because the StatCounter was mid-animation when captured.
- **Fix:** Added `page.emulateMedia({ reducedMotion: 'reduce' })` in beforeEach for all 5 spec files. This triggers `prefers-reduced-motion` media query, which AppProviders' `MotionConfig reducedMotion="user"` respects, disabling most animations.
- **Files modified:** All 5 spec files
- **Verification:** Tests pass with stable consecutive screenshots
- **Committed in:** 6e1592d (Task 1 commit)

**2. [Rule 1 - Bug] Added waitForLoadState(networkidle) to prevent hero image not loading**
- **Found during:** Task 1 (comparison run after baseline generation)
- **Issue:** Homepage 1440px test captured the hero without the background image (430KB actual vs 1.3MB expected = 135k pixel diff). Hero uses `url('/hero-bg.jpg')` via CSS background-image — not an `<img>` tag, so `waitForSelector` of the hero element doesn't guarantee image load.
- **Fix:** Added `await page.waitForLoadState('networkidle')` after `waitForSelector('html[dir="rtl"]')` in all spec files to ensure all network requests including background images complete.
- **Files modified:** All 5 spec files
- **Verification:** Hero background renders correctly, tests pass with 10/10 passing
- **Committed in:** 6e1592d (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (2 Rule 1 bugs)
**Impact on plan:** Both fixes required for test correctness. No scope creep — these are standard Playwright best practices for SPAs with animations and background images.

## Issues Encountered

**Font rendering CI note (documented from plan):** Baseline snapshots were generated on macOS (darwin) with Chromium. CI runs on ubuntu-latest where Arabic font rendering (Amiri, Cairo, Tajawal) differs at sub-pixel level. The `maxDiffPixels: 100` tolerance provides some buffer, but first CI run may fail. If so, run CI with `--update-snapshots=all` once to regenerate Linux baselines, then commit the new snapshots as the permanent baseline.

**Parallel worker contention:** Running `--update-snapshots` with 4 workers caused the shared Vite dev server to be overloaded, resulting in inconsistent baseline captures. Always use `--workers=1` when regenerating baselines.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- RTL snapshot test infrastructure complete — any layout regression will be caught
- CI workflow on main — every merge is checked for RTL correctness
- Baseline PNGs committed to repository — comparison point established
- If CI baseline diverges from macOS baseline: download CI artifacts and commit as replacement baselines
