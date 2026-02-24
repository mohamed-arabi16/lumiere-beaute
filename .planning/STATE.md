# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-24)

**Core value:** The website must feel like a premium, editorial experience — visitors should immediately sense luxury and trust, regardless of language or device.
**Current focus:** Phase 2 — Shell

## Current Position

Phase: 2 of 6 (Shell)
Plan: 4 of 4 in current phase — COMPLETE
Status: Phase 2 complete — ready for Phase 3 (Home Page)
Last activity: 2026-02-25 — Completed 02-04 (Human verification: all four Phase 2 success criteria approved)

Progress: [██████░░░░] 63%

## Performance Metrics

**Velocity:**
- Total plans completed: 8 (4 Phase 1 + 4 Phase 2)
- Average duration: 3 min
- Total execution time: 0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 4/4 | 11 min | 3 min |
| 02-shell | 4/4 | 21 min | 5 min |

**Recent Trend:**
- Last 5 plans: 2 min
- Trend: —

*Updated after each plan completion*
| Phase 01-foundation P01 | 2 | 2 tasks | 7 files |
| Phase 01-foundation P02 | 1 | 2 tasks | 3 files |
| Phase 01-foundation P03 | 2 | 2 tasks | 9 files |
| Phase 01-foundation P04 | 5 | 2 tasks | 2 files |
| Phase 02-shell P01 | 2 | 2 tasks | 11 files |
| Phase 02-shell P02 | 2 | 2 tasks | 4 files |
| Phase 02-shell P03 | 2 | 2 tasks | 7 files |
| Phase 02-shell P04 | 15 | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Pre-phase]: Use only Tailwind logical properties (ms-, me-, ps-, pe-) for inline-axis spacing — no physical ml-/mr- ever
- [Pre-phase]: All horizontal Framer Motion animations use variant functions with custom={isRTL} prop — no static x values
- [Pre-phase]: AnimatedOutlet pattern (not direct Outlet) required for AnimatePresence page transitions
- [Pre-phase]: Blocking script in index.html prevents flash of wrong theme/language on load
- [01-01]: Downgraded Vite 8.0.0-beta.13 to 7.3.1 stable — @tailwindcss/vite peer requires ^5||^6||^7
- [01-01]: Tailwind v4 uses @tailwindcss/vite Vite plugin, not PostCSS config — no postcss.config.js ever
- [01-01]: vite.config.js remains .js (not .ts); tsconfig.node.json references it for IDE tooling
- [01-01]: i18next v25 + react-i18next v16 pinned together for peer compatibility
- [01-02]: Blocking FOUC script placed BEFORE all <link> tags in <head> — synchronous execution before CSS renders is critical
- [01-02]: @custom-variant dark uses class-based (.dark) selector — enables user-controlled theme toggle independent of system preference
- [01-02]: Locale variant normalization in blocking script (ar-SA → ar, en-US → en) prevents wrong dir attribute from i18next locale codes
- [01-02]: Tailwind v4 @theme block generates all 10 brand color utilities from --color-* custom properties automatically
- [01-03]: Bundled locale JSON imports (not i18next-http-backend) to avoid flash of untranslated keys
- [01-03]: supportedLngs: ['tr', 'en', 'ar'] required to prevent 'en-US' from failing to match 'en' resources
- [01-03]: ThemeProvider initializer reads localStorage synchronously to match blocking script state without re-render flash
- [01-03]: BrowserRouter intentionally omitted from AppProviders — Phase 2 Shell adds it as outermost wrapper
- [01-04]: ThemeTestComponent is a temporary Phase 1 verification scaffold — will be replaced by Phase 2 Shell
- [01-04]: Tailwind logical properties (ms-, me-, ps-, pe-) only confirmed as RTL-safe — no physical ml-/mr-/pl-/pr- ever
- [02-01]: BrowserRouter added as outermost wrapper in AppProviders — wraps ThemeProvider + I18nextProvider
- [02-01]: pageTransitionVariants uses function-form initial/exit for RTL-aware AnimatePresence direction
- [02-01]: Cubic-bezier ease typed as [number,number,number,number] tuple for framer-motion v12 TypeScript strictness
- [02-02]: NAV_LINKS defined outside Navbar component as const for stable reference across renders
- [02-02]: MobileMenu placed inside <header> but outside <nav> — ensures full-viewport overlay for AnimatePresence
- [02-02]: end={link.to === '/'} on home NavLink prevents index route from matching all paths as active
- [02-03]: AnimatedOutlet uses useOutlet + cloneElement (not direct Outlet) — only pattern that fires exit animations in React Router
- [02-03]: AnimatePresence mode='wait' initial={false} — cinematic feel, no entrance animation on initial load
- [02-03]: Navbar placed outside <main> and outside AnimatePresence — never participates in page transitions
- [02-03]: custom={dir} on each page motion.div — AnimatePresence preserves custom on exiting components for correct RTL exit direction
- [02-03]: vercel.json catch-all rewrite ensures direct URL access works for BrowserRouter (HTML5 history API)
- [02-04]: ScrollRestoration requires createBrowserRouter (data router) — BrowserRouter users must use useEffect scroll-to-top pattern
- [02-04]: Arabic font-size must be set in rem (not em) to prevent compounding on nested elements — :lang(ar) { font-size: 1.05rem }
- [02-04]: Tajawal chosen over Noto Sans Arabic for modern geometric feel aligned with luxury editorial brand — 300/400/500/700 weights loaded

### Pending Todos

None yet.

### Blockers/Concerns

- Arabic content requires idiomatic copywriting — technical JSON structure is ready but content needs human Arabic review
- EmailJS production credentials (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) must be configured before Phase 5 validation
- WhatsApp business number in E.164 format (90XXXXXXXXXX) must be known before Phase 5 WhatsApp CTA wiring
- 20+ treatment names/descriptions and 2 course curricula must be finalized before Phase 4/5 translation JSON can be populated

## Session Continuity

Last session: 2026-02-25
Stopped at: Completed 02-04-PLAN.md (Phase 2 human verification complete — all success criteria approved)
Resume file: None
