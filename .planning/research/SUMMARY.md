# Project Research Summary

**Project:** Lumiere Beaute — Premium Beauty Center & Academy Website
**Domain:** Multilingual luxury SPA (React + Vite), Istanbul market, trilingual (TR/EN/AR)
**Researched:** 2026-02-24
**Confidence:** HIGH (stack verified via npm registry and official docs; architecture patterns from official docs; pitfalls cross-referenced across multiple sources)

## Executive Summary

Lumiere Beaute is a premium multilingual SPA (Single-Page Application) targeting an Istanbul clientele that speaks Turkish, English, and Arabic. The key technical challenge is not the beauty industry domain itself — it is the intersection of three demanding concerns that must be integrated from day one: full RTL layout for Arabic, cinematic Framer Motion animations that respect text direction, and a dark/light mode system with a custom 10-color teal palette. Experts build this class of site by treating i18n and theming as foundational infrastructure rather than late-stage features, because every component built before that infrastructure is in place will require expensive rework. The recommended stack — React 19 + Vite 7 + Tailwind v4 + motion 12 + react-i18next 16 — is the 2026 industry standard for this use case, with all versions verified via npm.

The recommended approach is a strict six-phase build order derived directly from component dependency analysis: establish the foundation (color system, i18n config, theming) before writing any JSX; build the shell (layout, routing, AnimatePresence, Navbar) before building pages; build shared UI primitives before building section compositions. The architecture is a clean provider-shell-pages-components hierarchy with no external state management needed — React Context handles theme, i18next handles language, and local component state handles filtering and form submission. CSS logical properties (Tailwind v4 logical utilities) handle RTL automatically at the CSS cascade level, eliminating per-component RTL conditionals.

The primary risk is RTL layout breakage, which is invisible during LTR development and catastrophic to fix late. The secondary risk is animation performance on mid-range Android devices — the target Istanbul market. Both risks are avoided by enforcing two rules from the first line of code: (1) use only logical CSS properties (`ms-`, `me-`, `ps-`, `pe-`) for inline-axis spacing, never physical ones (`ml-`, `mr-`); (2) only animate `transform` and `opacity`, never layout-triggering properties. Following these rules and the six-phase build order produces a site that is correct by construction.

---

## Key Findings

### Recommended Stack

The stack is a well-matched, version-locked set of libraries for a luxury multilingual SPA. Tailwind v4's CSS-first config (no `tailwind.config.js`) with native logical properties is the decisive technology choice — it makes RTL layout correct by default without requiring a plugin or per-component RTL overrides. Motion (formerly Framer Motion) provides all required animation capabilities (page transitions, scroll parallax, text typing, staggered reveals) under an MIT license, eliminating the GSAP commercial license concern. The i18next ecosystem (react-i18next + i18next-browser-languageDetector) handles Turkish/English/Arabic with browser auto-detection and a Turkish fallback. The form stack (react-hook-form + Zod 4 + @emailjs/browser) is sufficient for v1 with no backend required.

**Core technologies:**
- **React 19 + Vite 7**: SPA framework + build tool — near-instant HMR, native ESM, first-class React support
- **Tailwind CSS v4**: Utility CSS — CSS-first config, native logical properties for automatic RTL, class-based dark mode via `@custom-variant dark`
- **motion 12 (motion/react)**: Animation — MIT-licensed, 120fps via Web Animations API, all required effects (parallax, transitions, typing, stagger)
- **React Router v7 (library mode)**: Client-side routing — BrowserRouter pattern; required for AnimatePresence page transitions
- **react-i18next 16 + i18next 25**: i18n — hooks-based, lazy namespace loading, `i18n.dir()` for RTL switching, browser language auto-detection
- **react-hook-form 7 + Zod 4**: Forms — minimal re-renders, TypeScript-native, type-safe validation
- **@emailjs/browser 4**: Contact form delivery — no backend required; NOT the deprecated `emailjs-com` package
- **lenis 1.3.17**: Smooth scroll — MIT, integrates cleanly with `motion`'s `useScroll`

**Critical version constraints:**
- `tailwindcss@4.x` and `@tailwindcss/vite@4.x` must be the same version — always update together
- `react-i18next@16.x` requires `i18next@25.x` (breaking peer dep from prior versions)
- `@hookform/resolvers@5.x` must match `react-hook-form@7.x`
- Import path is `motion/react`, not `framer-motion/react` — both npm packages resolve to the same code at v12

See `.planning/research/STACK.md` for full version table, alternatives considered, and what to avoid.

---

### Expected Features

The feature set is well-defined. The market position (premium, trilingual, editorial luxury) drives clear decisions: cinematic animations and RTL Arabic support are non-negotiable differentiators, not nice-to-haves. A real booking system, CMS, and SEO are explicitly anti-features for v1 — they add backend complexity without validating the frontend showcase goal.

**Must have (table stakes):**
- 5-page structure (Home, Services, Academy, About, Contact)
- Services catalog with 20+ treatments and category tab filtering
- Academy pages with 2 courses (curriculum, instructor bio, pricing, enrollment CTA)
- Trilingual support (TR/EN/AR) with browser language auto-detection and Turkish fallback
- Full RTL layout for Arabic — navigation, cards, animations must mirror
- Contact form via EmailJS + WhatsApp CTA (pre-filled message)
- Mobile-first responsive layout (390px base, 70%+ traffic is mobile)
- Testimonials section (3-5 quotes) and statistics counter (animated count-up)

**Should have (competitive differentiators):**
- Cinematic full-screen page transitions (AnimatePresence + motion.div variants)
- Staggered scroll-reveal animations (useInView + stagger children)
- Text typing/character-by-character hero reveal (motion character stagger)
- Parallax hero effect (useScroll + useTransform — disabled on mobile)
- Light/Dark mode toggle with warm teal palette (not cold blue-grays)
- Language switcher visible at all scroll positions, persisted in localStorage
- CSS gradient placeholders throughout (intentional art direction, not missing images)
- Editorial typography: Cormorant Garamond headings, Inter body, Arabic-specific font-size bump

**Defer to v2+:**
- Real online booking system (requires backend, calendar, availability management)
- Payment processing / gift card e-commerce (PCI compliance, Stripe integration)
- SEO (hreflang, sitemap, multilingual meta) — no traffic strategy yet
- Blog / content section — requires ongoing content creation workflow
- Student portal / LMS — separate product; v1 enrollment is inquiry-based

See `.planning/research/FEATURES.md` for full prioritization matrix and competitor analysis.

---

### Architecture Approach

The architecture is a strict four-layer hierarchy: Provider Shell (ThemeProvider + I18nextProvider + BrowserRouter) → Layout Shell (RootLayout with AnimatedOutlet) → Page Layer (5 pages) → Component Library (ui/, sections/, animations/, forms/). No external state management (Redux, Zustand) is needed — the data flows are simple enough for React Context (theme) and i18next's own subscription model (language). All text flows through `t()` with zero hardcoded strings; all directional CSS flows through Tailwind logical properties; all dark mode toggling flows through a single `dark` class on `<html>`.

**Major components:**
1. **AppProviders** — composes all context providers in correct nesting order (ThemeProvider > I18nextProvider > BrowserRouter)
2. **RootLayout** — runs two `useEffect` calls (theme class on html, dir attribute on html) as single source of truth; renders Navbar + AnimatedOutlet
3. **AnimatedOutlet** — bridges React Router's `useOutlet` hook with `AnimatePresence` (required — direct `<Outlet>` cannot be wrapped by AnimatePresence)
4. **ThemeProvider** — owns dark/light state, persists to localStorage, applies class to `<html>`
5. **useDirection hook** — derives `{ dir, isRTL }` from `i18n.dir(i18n.language)` — consumed by all animation components
6. **animations/variants.ts** — shared Framer Motion variant definitions as functions that accept `dir` via `custom` prop for RTL-aware slide directions
7. **5 page components** — assemble section components; declare their own translation namespaces via `useTranslation(['common', 'pageName'])`

**Key patterns to enforce:**
- All inline-axis spacing uses Tailwind logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`)
- All horizontal Framer Motion animations use `custom` prop + variant functions, not static objects
- All text from `t()` — zero exceptions
- `AnimatePresence mode="wait"` with keyed `motion.div` direct children (not Fragment, not Outlet)

See `.planning/research/ARCHITECTURE.md` for full file structure, data flow diagrams, and code patterns.

---

### Critical Pitfalls

Five pitfalls require architectural enforcement before the first component is built. Four of them are invisible until the wrong moment.

1. **Physical CSS utility classes breaking RTL** — Using `ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-` instead of their logical equivalents creates RTL breakage that is invisible in LTR development and requires a full audit to fix. Enforce logical-only from day one; no exceptions for inline-axis spacing.

2. **Static Framer Motion variant x-values in RTL** — `x: -60` in a variant object always slides left regardless of text direction. Arabic content must enter from the right. All horizontal animations must use variant functions with `custom={isRTL}` prop from the first animation written.

3. **Flash of wrong language/theme on load** — React renders before async JSON loads and before localStorage is read; users see LTR English on a light background for 1-3 frames before Arabic dark mode kicks in. Fix: inline translation JSON in the bundle (no HTTP backend), and inject a blocking `<script>` in `index.html` that synchronously reads localStorage and sets `dark` class and `dir` attribute before any CSS renders.

4. **Cinematic animations crippling low-end mobile** — Simultaneous stagger animations on 20+ elements cause dropped frames on mid-range Android (Galaxy A-series). Limit simultaneous animated elements, use `LazyMotion` + `domAnimation`, only animate `transform` and `opacity` (never `height`, `width`, `background-color`), and always implement `prefers-reduced-motion`.

5. **AnimatePresence key mismatch killing exit animations** — Direct `<Outlet>` as AnimatePresence child, or using React Fragment as intermediate child, silently breaks exit animations (no error thrown). Must use the `useOutlet()` pattern (AnimatedOutlet component) with `mode="wait"` and a keyed `motion.div` as the direct child.

See `.planning/research/PITFALLS.md` for recovery strategies, integration gotchas, and the "looks done but isn't" checklist.

---

## Implications for Roadmap

Based on the combined research, the build order is strictly determined by component dependencies. Six phases emerge naturally from the architecture's dependency graph.

### Phase 1: Foundation — Color System, Typography, i18n, Theming

**Rationale:** Everything else depends on this. Tailwind v4 color palette must be defined before any component uses a color token. i18n config must be initialized before any component renders text. ThemeProvider must exist before RootLayout can read theme state. The blocking `<script>` preventing flash of wrong theme/language must be in `index.html` from the start. This phase has zero UI output but prevents the most expensive retrofitting.

**Delivers:** Functional i18n system (TR/EN/AR, auto-detection, Turkish fallback), dark/light theming infrastructure, custom 10-color teal palette in CSS, Google Fonts loaded, Arabic font-size compensation CSS, all translation JSON files created with common.json keys populated.

**Addresses features:** Multilingual support, RTL infrastructure, light/dark mode, custom color system, editorial typography.

**Avoids pitfalls:** Flash of wrong language/theme, physical CSS properties (establish logical-only conventions), Arabic font rendering issues.

**Research flag:** Standard patterns — no additional research needed. Official docs cover all implementation details.

---

### Phase 2: Shell — Layout, Routing, AnimatedOutlet, Navbar

**Rationale:** The shell must exist before pages can be built into it. AnimatedOutlet (the React Router + AnimatePresence bridge) is an architectural decision that cannot be retrofitted — if pages are built assuming standard Outlet, adding cinematic transitions later requires touching every page. The Navbar contains the language switcher and theme toggle, making it the first real test of the i18n + theming system from Phase 1.

**Delivers:** Full app shell with sticky navigation, language switcher, theme toggle, and working route transitions (even if pages are empty placeholders). All five routes resolvable. Page transition animations working end-to-end.

**Addresses features:** Cinematic page transitions, sticky navigation, language switcher with localStorage persistence, browser routing.

**Avoids pitfalls:** AnimatePresence key mismatch (establish the AnimatedOutlet pattern correctly here, never retrofit it), animation RTL direction (establish `useDirection` hook and variant function pattern here).

**Uses from STACK.md:** React Router v7 (library/BrowserRouter mode), motion/react AnimatePresence + useOutlet, react-i18next useTranslation.

**Research flag:** Standard patterns — AnimatedOutlet pattern is well-documented. No additional research needed.

---

### Phase 3: Shared Components — UI Primitives and Animation Wrappers

**Rationale:** Page sections depend on reusable UI primitives (Button, Card, Typography) and animation wrappers (FadeInSection, StaggerContainer, TypewriterText). Building sections before primitives leads to inconsistent implementations and duplication. This phase also establishes the mobile performance baseline — all animation wrappers must implement `prefers-reduced-motion` and the `LazyMotion` pattern before they are used in content.

**Delivers:** Full component library of UI primitives and animation wrappers. `animations/variants.ts` with all RTL-aware variant definitions. Performance budget validated on CPU-throttled mobile simulation.

**Addresses features:** Scroll-reveal animations (stagger), text typing effect, parallax hero (useScroll + useTransform), accessibility (prefers-reduced-motion), CSS gradient placeholders.

**Avoids pitfalls:** Mobile animation performance (establish LazyMotion + domAnimation, validate with 4x CPU throttle before phase is marked done), static RTL-unaware x-values (all variants use custom prop from this phase forward).

**Research flag:** Standard patterns — well-documented. Performance testing is the validation step, not additional research.

---

### Phase 4: Page Sections — Homepage and Services

**Rationale:** Homepage is the highest-impact page and the first test of all systems together: hero with parallax + typing text, stats counter with count-up, services teaser, academy teaser, testimonials. Services page is the core product page (20+ treatments, category filtering, animated grid). These two pages exercise every component from Phase 3 at realistic content scale — they will surface any performance issues before the full site is built.

**Delivers:** Functional Homepage (hero, stats, services teaser, academy teaser, testimonials sections) and functional Services page (filterable catalog with 20+ treatments, animated category tabs, staggered card reveal). All content from translation JSON files — zero hardcoded strings.

**Addresses features:** Hero section, statistics counter, services catalog with category filtering, services teaser on homepage, testimonials section, CSS gradient placeholders on service cards.

**Avoids pitfalls:** Physical CSS classes (RTL audit on every new component before moving on), simultaneous stagger animation overload (limit visible-card stagger, not all 20+ at once), hardcoded strings.

**Research flag:** Standard patterns. Category filtering with AnimatePresence layoutId is well-documented.

---

### Phase 5: Remaining Pages — Academy, About, Contact

**Rationale:** Academy, About, and Contact pages are less complex than Services but must be complete for a launch-ready site. Academy introduces the course comparison layout and enrollment CTA. Contact introduces EmailJS integration, WhatsApp message construction, and the FAQ accordion. These pages complete the feature set and constitute final content population.

**Delivers:** Academy page (2 courses with full curriculum, instructor bio, pricing, enrollment CTA), About page (brand story, team grid, values), Contact page (EmailJS form with honeypot + rate limiting, WhatsApp CTA with encodeURIComponent message, FAQ accordion).

**Addresses features:** Academy pages with curriculum and instructor bios, about/brand story, contact form, WhatsApp pre-filled message builder, FAQ section.

**Avoids pitfalls:** EmailJS security (VITE_ env vars, honeypot field, localStorage rate limiting), WhatsApp URL encoding for Arabic text, form double-submission (disable button on first click, show spinner).

**Research flag:** EmailJS integration is straightforward; official docs are complete. WhatsApp URL pattern is a one-liner. No additional research needed.

---

### Phase 6: Content Population and Quality Assurance

**Rationale:** Translation JSON files for all three languages must be fully populated across all 5 namespaces per language (15 files total: common, home, services, academy, about, contact — with TR, EN, AR variants). This phase also runs the "looks done but isn't" checklist from PITFALLS.md — RTL audit, animation direction verification, dark mode contrast check, mobile performance validation, and language auto-detection testing.

**Delivers:** All 15 translation JSON files fully populated (including Arabic plural forms for service counts). Verified RTL layout in all components. Verified animation directions in Arabic. Verified WCAG contrast in both light and dark mode. Verified mobile performance (Lighthouse mobile 75+ target). Verified EmailJS production environment variables configured.

**Avoids pitfalls:** Missing translation keys (add i18next `missingKeyHandler` in dev mode that throws visible console errors), translation key mismatches across locales, production environment variable gaps.

**Research flag:** No research needed — this is validation against the "looks done but isn't" checklist already defined.

---

### Phase Ordering Rationale

- **Foundation before Shell:** ThemeProvider and i18n config must exist before RootLayout consumes them. Tailwind color tokens must exist before any component uses them.
- **Shell before Pages:** AnimatedOutlet is an architectural decision embedded in RootLayout; retrofitting page transitions after pages exist requires touching every page file.
- **Primitives before Sections:** Section components compose from UI primitives. Building sections before primitives creates inconsistency and duplication.
- **Homepage + Services before remaining pages:** These are the highest-complexity pages and serve as the integration test for all Phase 1-3 systems. Better to surface issues here than after all 5 pages are built.
- **Content population last:** Translation JSON content can be stubbed throughout development and fully populated in Phase 6; this is faster than waiting for content to write code.

This order maps directly to the `Build Order Implications` section of ARCHITECTURE.md.

---

### Research Flags

**Phases needing no additional research (standard patterns, official docs complete):**
- **Phase 1 (Foundation):** Tailwind v4 CSS config, i18next init, dark mode blocking script — all covered in official docs
- **Phase 2 (Shell):** AnimatedOutlet pattern, React Router v7 BrowserRouter, AnimatePresence mode="wait" — official docs + well-documented community patterns
- **Phase 3 (Shared Components):** LazyMotion, useInView, useScroll + useTransform — official motion.dev docs
- **Phase 4 (Services + Homepage):** Category filtering with AnimatePresence layoutId — official docs
- **Phase 5 (Contact):** EmailJS sendForm API, WhatsApp URL pattern — official docs
- **Phase 6 (QA):** Checklist-driven — no research, execution only

**No phase requires `/gsd:research-phase`** — the research files contain sufficient implementation detail. The PITFALLS.md "looks done but isn't" checklist serves as the QA specification for Phase 6.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All version numbers verified via npm registry; critical integration notes (motion import path, Tailwind v4 config approach, resolver version locking) verified via official docs |
| Features | MEDIUM | Feature list derived from industry sources and competitor analysis; no direct user research conducted; market assumptions (WhatsApp prevalence in Istanbul, Arabic beauty tourism demand) are reasonable but unvalidated |
| Architecture | HIGH | Core patterns (AnimatedOutlet, AppProviders composition, logical properties, RTL-aware variants) verified via official React Router, Framer Motion, and Tailwind docs; some patterns from credible community sources |
| Pitfalls | HIGH | All 5 critical pitfalls are verified against official docs and multiple independent sources; recovery strategies are actionable and costed |

**Overall confidence:** HIGH

### Gaps to Address

- **Arabic content:** Translation JSON files require someone who can write idiomatic Arabic beauty copy. This is a content gap, not a technical one — the JSON structure is defined; filling it requires a human Arabic copywriter or careful LLM-assisted drafting with native speaker review.
- **EmailJS production setup:** The VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY values require an actual EmailJS account to be configured with a service and template. This must happen before Phase 5 can be validated end-to-end.
- **WhatsApp phone number:** The business WhatsApp number (in E.164 format: `90XXXXXXXXXX` for Turkey) must be known before the WhatsApp CTA can be wired. This is a content/business gap.
- **Actual service and course content:** The 20+ treatments and 2 course curricula must exist in final form before Phase 4 and 5 translation JSON files can be populated. CSS gradient placeholders mean no photography is needed, but service names and descriptions are required.
- **Mobile performance validation:** Pitfalls research calls for testing on a real mid-range Android device (not just DevTools throttle). This should be done in Phase 4 before proceeding to Phase 5.

---

## Sources

### Primary (HIGH confidence)
- npm registry (live, 2026-02-24) — all version numbers
- [Tailwind CSS v4 official blog + upgrade guide](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, @theme, logical properties, @tailwindcss/vite
- [motion.dev official docs](https://motion.dev/docs/react-installation) — package name, import path, ScrollTimeline, performance, LazyMotion, bundle reduction
- [react-i18next official docs](https://react.i18next.com/) — i18n.dir(), namespace loading, hooks API
- [i18next-browser-languageDetector GitHub](https://github.com/i18next/i18next-browser-languageDetector) — fallback language config
- [EmailJS React official docs](https://www.emailjs.com/docs/examples/reactjs/) — @emailjs/browser package
- [EmailJS spam protection official FAQ](https://www.emailjs.com/docs/faq/does-emailjs-expose-my-account-to-spam/) — rate limiting guidance
- [Josh W. Comeau — prefers-reduced-motion](https://www.joshwcomeau.com/react/prefers-reduced-motion/) — accessibility animation patterns
- [CSS-Tricks — dark mode flash prevention](https://css-tricks.com/a-complete-guide-to-dark-mode-on-the-web/) — blocking script pattern
- [UAE Design System — Arabic typography](https://designsystem.gov.ae/guidelines/typography) — font size compensation guidelines

### Secondary (MEDIUM confidence)
- [madrus4u.vercel.app — RTL implementation guide](https://madrus4u.vercel.app/blog/rtl-implementation-guide) — Tailwind RTL logical properties pattern
- [sinja.io — direction-aware Framer Motion](https://sinja.io/blog/direction-aware-animations-in-framer-motion) — custom prop + variant function pattern
- [FreeCodeCamp — animating routes with Framer Motion](https://www.freecodecamp.org/news/improve-user-experience-in-react-by-animating-routes-using-framer-motion/) — AnimatePresence + useLocation key pattern
- [Robin Wieruch — React folder structure 2025](https://www.robinwieruch.de/react-folder-structure/) — pages/components/hooks/context/i18n structure
- [Crowdin — React i18n with i18next](https://crowdin.com/blog/2025/10/31/react-i18n) — multilingual best practices
- [Codrops — cinematic scroll experiences](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/) — scroll animation techniques 2025

### Tertiary (LOW confidence)
- [Turkey's top luxury beauty clinics — Turkey Travel Planner](https://turkeytravelplanner.com/turkeys-top-luxury-beauty-clinic/) — Istanbul market context, WhatsApp usage patterns (travel blog; validate with actual user research)
- [n8n WhatsApp salon booking workflow](https://n8n.io/workflows/8698-ai-powered-salon-appointment-booking-system-with-whatsapp-and-google-sheets/) — WhatsApp pattern in Istanbul market (narrow tool-specific source)

---
*Research completed: 2026-02-24*
*Ready for roadmap: yes*
