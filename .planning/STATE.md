# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-24)

**Core value:** The website must feel like a premium, editorial experience — visitors should immediately sense luxury and trust, regardless of language or device.
**Current focus:** Phase 1 — Foundation

## Current Position

Phase: 1 of 6 (Foundation)
Plan: 1 of 4 in current phase
Status: In progress
Last activity: 2026-02-24 — Completed 01-01 (project infrastructure bootstrap)

Progress: [█░░░░░░░░░] 5%

## Performance Metrics

**Velocity:**
- Total plans completed: 1
- Average duration: 2 min
- Total execution time: 0.03 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 1/4 | 2 min | 2 min |

**Recent Trend:**
- Last 5 plans: 2 min
- Trend: —

*Updated after each plan completion*
| Phase 01-foundation P01 | 2 | 2 tasks | 7 files |

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

### Pending Todos

None yet.

### Blockers/Concerns

- Arabic content requires idiomatic copywriting — technical JSON structure is ready but content needs human Arabic review
- EmailJS production credentials (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) must be configured before Phase 5 validation
- WhatsApp business number in E.164 format (90XXXXXXXXXX) must be known before Phase 5 WhatsApp CTA wiring
- 20+ treatment names/descriptions and 2 course curricula must be finalized before Phase 4/5 translation JSON can be populated

## Session Continuity

Last session: 2026-02-24
Stopped at: Completed 01-01-PLAN.md (project infrastructure bootstrap)
Resume file: None
