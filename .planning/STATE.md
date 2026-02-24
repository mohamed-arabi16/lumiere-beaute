# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-24)

**Core value:** The website must feel like a premium, editorial experience — visitors should immediately sense luxury and trust, regardless of language or device.
**Current focus:** Phase 1 — Foundation

## Current Position

Phase: 1 of 6 (Foundation)
Plan: 3 of 4 in current phase
Status: In progress
Last activity: 2026-02-24 — Completed 01-03 (i18n + theming infrastructure)

Progress: [███░░░░░░░] 30%

## Performance Metrics

**Velocity:**
- Total plans completed: 3
- Average duration: 2 min
- Total execution time: 0.1 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3/4 | 6 min | 2 min |

**Recent Trend:**
- Last 5 plans: 2 min
- Trend: —

*Updated after each plan completion*
| Phase 01-foundation P01 | 2 | 2 tasks | 7 files |
| Phase 01-foundation P02 | 1 | 2 tasks | 3 files |
| Phase 01-foundation P03 | 2 | 2 tasks | 9 files |

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

### Pending Todos

None yet.

### Blockers/Concerns

- Arabic content requires idiomatic copywriting — technical JSON structure is ready but content needs human Arabic review
- EmailJS production credentials (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) must be configured before Phase 5 validation
- WhatsApp business number in E.164 format (90XXXXXXXXXX) must be known before Phase 5 WhatsApp CTA wiring
- 20+ treatment names/descriptions and 2 course curricula must be finalized before Phase 4/5 translation JSON can be populated

## Session Continuity

Last session: 2026-02-24
Stopped at: Completed 01-02-PLAN.md (CSS token system and FOUC prevention)
Resume file: None
