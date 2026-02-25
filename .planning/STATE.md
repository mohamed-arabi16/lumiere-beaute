# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-24)

**Core value:** The website must feel like a premium, editorial experience — visitors should immediately sense luxury and trust, regardless of language or device.
**Current focus:** Phase 7 — Polish and UX

## Current Position

Phase: 7 of 7 (Polish and UX) — IN PROGRESS
Plan: 4 of 4 in Phase 7 — 07-01, 07-02, 07-03, 07-04 complete
Status: Plan 07-04 COMPLETE — CustomCursor with spring physics, hover ring, touch-safe CSS cursor:none
Last activity: 2026-02-25 — Completed 07-04 (CustomCursor component + RootLayout mount + CSS cursor hide)

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**
- Total plans completed: 26 (4 Phase 1 + 4 Phase 2 + 4 Phase 3 + 6 Phase 4 + 4 Phase 5 + 4 Phase 7)
- Average duration: 3 min
- Total execution time: 0.5 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 4/4 | 11 min | 3 min |
| 02-shell | 4/4 | 21 min | 5 min |
| 03-shared-components | 4/4 | 12 min | 3 min |

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
| Phase 03-shared-components P01 | 2 | 2 tasks | 2 files |
| Phase 03-shared-components P02 | 2 | 2 tasks | 2 files |
| Phase 03-shared-components P03 | 5 | 2 tasks | 4 files |
| Phase 03-shared-components P04 | 3 | 2 tasks | 1 files |
| Phase 04-homepage-and-services P01 | 3 | 2 tasks | 4 files |
| Phase 04-homepage-and-services P03 | 2 | 2 tasks | 3 files |
| Phase 04-homepage-and-services P05 | 2 | 2 tasks | 3 files |
| Phase 04-homepage-and-services P04 | 2 | 1 tasks | 1 files |
| Phase 04-homepage-and-services P06 | 15 | 2 tasks | 8 files |
| Phase 05-academy-and-contact P01 | 2 | 2 tasks | 5 files |
| Phase 05-academy-and-contact P02 | 2 | 2 tasks | 2 files |
| Phase 05-academy-and-contact P03 | 2 | 2 tasks | 4 files |
| Phase 05-academy-and-contact P04 | 3 | 2 tasks | 1 files |
| Phase 07-polish-and-ux P03 | 1 | 2 tasks | 2 files |
| Phase 07-polish-and-ux P04 | 4 | 2 tasks | 3 files |

## Accumulated Context

### Roadmap Evolution

- Phase 7 added: Polish and UX Enhancements — locale JSON split (ar/en/tr), Arabic copy review, scroll-driven animations, custom cursor

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
- [03-01]: MotionConfig imported from framer-motion (not motion/react) — project only has framer-motion installed
- [03-01]: MotionConfig placed outermost (outside BrowserRouter) — prevents theme-toggle re-renders from interrupting in-progress animations
- [03-01]: staggerContainerVariants implemented as factory function with default staggerDelay=0.06 — allows per-instance configuration
- [03-02]: FadeInSection uses amount:0.2 — triggers when 20% visible, prevents premature trigger before element enters viewport
- [03-02]: StaggerContainer uses amount:0.1 — lower threshold for grids taller than viewport so stagger starts on first visible row
- [03-02]: staggerItemVariants re-exported from StaggerContainer — page sections only need one import instead of two
- [03-03]: Import from framer-motion (not motion/react) — motion/react is an alternate package not installed; consistent with 03-01 fix
- [03-03]: tagMap lookup for TypewriterText element type — type-safe, avoids TypeScript index-signature errors on motion[Tag]
- [03-03]: TypewriterText uses animate='visible' (not whileInView) — hero headline is always above fold, fires immediately on mount
- [03-03]: Button uses logical spacing ps-6/pe-6 (not pl-/pr-) — RTL-safe per locked Phase 1 decision
- [03-04]: Verification scaffold is temporary — replaced entirely in Phase 4; comment at top of HomePage.tsx documents this intent
- [03-04]: 20-item StaggerContainer grid chosen for performance baseline test (0.06s × 20 = 1.2s stagger spread at 4x CPU throttle)
- [04-01]: StatItem.value is a JSON number (not string) — StatCounter uses animate(0, target) where target must be numeric
- [04-01]: Treatment IDs are stable kebab-case slugs (hydra-facial etc.) — never array indices — AnimatePresence key safety
- [04-01]: Arabic hero headline kept to 2 words (جمالك. فنّنا.) — TypewriterText renders short strings cleanly without mid-render stagger issues
- [04-01]: Treatment brand names (HydraFacial, Keratin, etc.) kept in international form across all locales — only UI copy translated
- [04-01]: Prices use ₺ + Western digits across all three locales for consistent readability regardless of text direction
- [04-02]: Parallax uses backgroundPositionY (not transform:translateY) — avoids z-index stacking issues with sticky Navbar
- [04-02]: StatCounter inner component not exported — animation state co-located with rendering, isolated from section orchestration
- [04-02]: ease cast as [number,number,number,number] tuple in StatCounter animate() for framer-motion v12 TypeScript strictness
- [Phase 04-03]: React Router Link used exclusively for /services and /academy navigation — <a href> bypasses AnimatePresence exit animations
- [Phase 04-03]: AcademyTeaserSection uses ghost Button variant, ServicesTeaserSection uses primary — visual differentiation between adjacent sections
- [Phase 04-03]: TestimonialsSection bg-surface-dark applies in both light and dark modes — intentional editorial contrast rhythm, not a dark-mode concern
- [04-05]: LayoutGroup id="services-category-tabs" scopes layoutId="active-tab-indicator" — prevents sliding underline leakage during AnimatePresence page transitions
- [04-05]: AnimatePresence mode="popLayout" for treatment grid — exiting cards leave layout flow immediately, no grid snap on filter switch
- [04-05]: layout prop on each motion.div card wrapper enables smooth repositioning for cards remaining after filter switch
- [Phase 04-04]: HomePage.tsx is a pure composition — no inline JSX content, all rendering delegated to section components; motion.div page transition wrapper preserved per locked decision 02-03
- [04-06]: Arabic font pair upgraded to Amiri (display serif, pairs with Cormorant Garamond) + Cairo (body sans) — Tajawal too geometric for luxury editorial tone; heading size nudges added (h1: 1.1em, h2: 1.08em) because Amiri renders smaller than Tajawal at same rem
- [04-06]: Hero text is text-white globally — teal gradient provides insufficient contrast for any colored text; white is accessible and editorially correct
- [04-06]: All Tailwind color references must use only tokens in @theme block — seagrass-* tokens never existed; 8 silent class failures corrected across 5 components
- [05-01]: Course.price is a string (not number) matching Treatment.price — ₺ prefix and locale-specific thousands separators embedded in JSON
- [05-01]: Turkish prices use dot thousands separator (₺8.500) per TR locale convention; EN/AR use comma (₺8,500)
- [05-01]: Button target/rel props spread directly onto Tag element — browsers ignore on button, work correctly on anchor
- [05-01]: Arabic course durations use Arabic-Indic numerals (١٢ أسبوعًا) consistent with services.treatments Arabic pattern
- [05-02]: AcademyPage motion.div has no className — no min-h-screen or padding; sections own their own spacing per locked 04-04 pattern
- [05-02]: WhatsApp URL uses encodeURIComponent with enroll_cta + course.title prefix — business receives course context in message
- [05-02]: vite-env.d.ts added as missing project file — enables import.meta.env TypeScript typing for VITE_WHATSAPP_NUMBER
- [05-03]: EmailJSResponseStatus imported as value (not type) — instanceof check requires runtime value, not type-only import
- [05-03]: WhatsApp phone defaults to '905XXXXXXXXX' placeholder when VITE_WHATSAPP_NUMBER absent — degrades gracefully in dev
- [05-03]: Service options sourced from locale JSON via returnObjects:true — all 7 options translate automatically with language switch
- [05-03]: dl/dt/dd semantic HTML for business hours — accessibility-correct for term/definition pairs
- [05-04]: ContactPage motion.div has no className — no min-h-screen or padding; sections own their own spacing per locked 04-04 pattern
- [05-04]: ContactFormSection rendered before ContactInfoSection — form is primary CTA, info card is secondary reference below it
- [05-04]: Hero uses bg-stormy-teal-950 matching AcademyPage hero for visual consistency across inner page routes
- [Phase 07-03]: ServicesTeaserSection heading uses offset ['start end', 'center start'] — animation plays from when section top enters viewport bottom until section center reaches viewport top
- [Phase 07-03]: Only Y-axis and opacity used for heading (no X) — RTL-safe per locked Phase 1 decision; scale only for TestimonialsSection background — also RTL-safe
- [Phase 07-03]: No per-component reducedMotion handling needed — AppProviders MotionConfig reducedMotion='user' covers all Framer Motion instances globally

### Pending Todos

None yet.

### Blockers/Concerns

- Arabic content requires idiomatic copywriting — technical JSON structure is ready but content needs human Arabic review
- EmailJS production credentials (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) must be configured before Phase 5 validation
- WhatsApp business number in E.164 format (90XXXXXXXXXX) must be known before Phase 5 WhatsApp CTA wiring
- 20+ treatment names/descriptions populated in 04-01 — course curricula (Aesthetic Practitioner, Professional Cosmetology) still need detailed curriculum content for Academy page

## Session Continuity

Last session: 2026-02-25
Stopped at: Completed 07-03-PLAN.md (scroll-driven Y+opacity on ServicesTeaserSection heading + scale on TestimonialsSection background)
Resume file: None
