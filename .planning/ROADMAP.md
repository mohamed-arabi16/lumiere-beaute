# Roadmap: Lumiere Beaute

## Overview

Six phases build the site in strict dependency order: establish design tokens and i18n infrastructure before writing any JSX; wire up routing and navigation before building pages; build shared UI primitives before composing sections; then build the two highest-complexity pages, then the remaining pages, then fully populate content and validate quality. Each phase is complete and verifiable before the next begins, eliminating the two primary risks — RTL breakage invisible during LTR development, and cinematic animations crippling mobile performance.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Color system, typography, i18n config, theming infrastructure, and CSS gradient system
- [x] **Phase 2: Shell** - App layout, routing, page transitions, and navbar with language/theme controls
- [x] **Phase 3: Shared Components** - UI primitives, RTL-aware animation wrappers, and performance baseline
- [x] **Phase 4: Homepage and Services** - Full hero, stats, teasers, testimonials, and filterable treatment catalog (completed 2026-02-25)
- [x] **Phase 5: Academy and Contact** - Course pages, enrollment CTA, booking form, and WhatsApp integration
- [ ] **Phase 6: Content and QA** - Full trilingual content population, RTL audit, and mobile performance validation

## Phase Details

### Phase 1: Foundation
**Goal**: The visual and i18n infrastructure exists so that every subsequent component uses correct color tokens, typography, theming, and language switching from the first line of code
**Depends on**: Nothing (first phase)
**Requirements**: FNDTN-01, FNDTN-02, FNDTN-03, FNDTN-04, FNDTN-05, FNDTN-08, FNDTN-09
**Success Criteria** (what must be TRUE):
  1. A test component using any of the 10 teal-green color tokens renders correctly in both light and dark mode with zero unstyled fallback
  2. Visiting the app in a browser configured to Arabic automatically renders Arabic text with the correct font and RTL layout direction; visiting with English or Turkish renders LTR with the correct font
  3. Clicking the theme toggle switches between warm ivory (light) and forest-at-dusk teal (dark) instantly, and the preference survives a page reload
  4. All image slots render CSS gradient placeholders in the brand teal palette rather than broken image icons
  5. Headings display in Cormorant Garamond and body text in Inter across all three languages, with Arabic body text rendering at the appropriate size compensation
**Plans**: 4 plans

Plans:
- [x] 01-01-PLAN.md — Infra bootstrap: Vite 7 downgrade, TypeScript setup, @tailwindcss/vite install, i18n packages
- [x] 01-02-PLAN.md — CSS system: globals.css color tokens + dark mode + typography + gradients, index.html blocking script + Google Fonts
- [x] 01-03-PLAN.md — Providers: i18n config + trilingual locales, ThemeProvider + AppProviders + hooks + main.tsx
- [x] 01-04-PLAN.md — Verification: ThemeTestComponent exercising all Phase 1 success criteria + human verify

### Phase 2: Shell
**Goal**: The complete application shell exists — routing, page transitions, and a fully functional navbar — so that pages can be built into a working, navigable structure
**Depends on**: Phase 1
**Requirements**: FNDTN-06, FNDTN-07, NAV-01, NAV-02
**Success Criteria** (what must be TRUE):
  1. Navigating between any two of the five routes produces a cinematic full-screen transition animation (enter and exit) with no visible flash or layout jump
  2. The navbar is visible and sticky at all scroll positions on all five pages, displaying the language switcher and theme toggle
  3. On a 390px mobile viewport, the navbar collapses into a hamburger icon that opens an animated full-screen or slide-out menu
  4. The site is fully usable at every viewport width from 390px to 1440px with no horizontal scroll or content overflow
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Router infrastructure: BrowserRouter in AppProviders, router.tsx with 5 routes, App.tsx update, RTL animation variants
- [x] 02-02-PLAN.md — Navigation components: Navbar, LanguageSwitcher, ThemeToggle, MobileMenu with AnimatePresence
- [x] 02-03-PLAN.md — Shell assembly: AnimatedOutlet, RootLayout, 5 page stubs with transition wrappers, vercel.json
- [x] 02-04-PLAN.md — Human verify: all 4 Phase 2 success criteria confirmed interactively

### Phase 3: Shared Components
**Goal**: A library of reusable UI primitives and RTL-aware animation wrappers exists so that page sections can be composed consistently and performantly
**Depends on**: Phase 2
**Requirements**: (No standalone requirements — enables delivery of page-level requirements)
**Success Criteria** (what must be TRUE):
  1. A scroll-reveal animation wrapper (FadeInSection / StaggerContainer) makes section content animate into view on scroll in both LTR and RTL layouts without layout shift
  2. A TypewriterText component types characters one by one in the correct reading direction for each language
  3. All horizontal slide animations play in the correct direction for Arabic (right-to-left entrance becomes left-to-right entrance when RTL is active)
  4. All animation wrappers respect `prefers-reduced-motion` — users with that system setting see static content with no animation
  5. Running animations with 4x CPU throttle in DevTools produces no dropped frames on a 20-card staggered reveal
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Infrastructure: MotionConfig in AppProviders + scroll/stagger/typewriter variants in variants.ts
- [x] 03-02-PLAN.md — Animation components: FadeInSection + StaggerContainer with whileInView + viewport once
- [x] 03-03-PLAN.md — UI primitives + TypewriterText: Button, Card, Typography, TypewriterText with RTL-safe tagMap
- [x] 03-04-PLAN.md — Verification scaffold + human verify: all 5 Phase 3 success criteria confirmed interactively

### Phase 4: Homepage and Services
**Goal**: Visitors can experience the full homepage and browse the complete services catalog with working category filtering
**Depends on**: Phase 3
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, SRVC-01, SRVC-02
**Success Criteria** (what must be TRUE):
  1. The homepage hero section fills the viewport, plays the typewriter headline animation, and a parallax gradient shift is visible when the user scrolls
  2. The animated statistics counters count up to their final values when the stats section scrolls into view
  3. Clicking a services teaser card or the services CTA navigates to the Services page; clicking an academy teaser card navigates to the Academy page
  4. The testimonials section displays at least three client quotes with attribution
  5. On the Services page, clicking a category tab filters the visible treatment cards to that category with an animated transition, and all 20+ treatments are accessible across the tabs
  6. Each treatment card displays the treatment name, a brief description, duration, and price
**Plans**: 6 plans

Plans:
- [x] 04-01-PLAN.md — Content foundation: TypeScript interfaces + trilingual locale JSON (stats, teasers, testimonials, 20 treatments)
- [x] 04-02-PLAN.md — Hero + Stats sections: parallax gradient HeroSection + animated count-up StatsSection
- [x] 04-03-PLAN.md — Teaser + Testimonials sections: ServicesTeaserSection, AcademyTeaserSection, TestimonialsSection
- [x] 04-04-PLAN.md — HomePage composition: replace Phase 3 scaffold, compose all 5 sections
- [x] 04-05-PLAN.md — ServicesPage: CategoryTabs with animated underline, TreatmentGrid with AnimatePresence filter
- [x] 04-06-PLAN.md — Human verify: all 6 Phase 4 success criteria confirmed interactively (completed 2026-02-25)

### Phase 5: Academy and Contact
**Goal**: Visitors can view both certification courses and submit a booking inquiry or open a pre-filled WhatsApp conversation
**Depends on**: Phase 4
**Requirements**: ACAD-01, ACAD-02, CNTC-01, CNTC-02, CNTC-03
**Success Criteria** (what must be TRUE):
  1. The Academy page displays two course cards each showing course title, description, duration, and price
  2. Clicking the enroll button on a course card either opens WhatsApp with a pre-filled inquiry message or navigates to the Contact page
  3. Submitting the contact form with valid data (name, email, service, message) delivers the inquiry via EmailJS and the user sees a success confirmation
  4. Clicking the WhatsApp CTA button opens WhatsApp (web or app) with a pre-filled message in the correct language
  5. The Contact page displays the salon's address, business hours, and contact details
**Plans**: 4 plans

Plans:
- [x] 05-01-PLAN.md — Content foundation: Course interface, Button target/rel extension, trilingual academy+contact locale keys
- [x] 05-02-PLAN.md — Academy page: CoursesSection (2 course cards with WhatsApp enroll + Contact CTAs), AcademyPage composition
- [x] 05-03-PLAN.md — Contact sections: ContactFormSection (EmailJS form + WhatsApp CTA), ContactInfoSection (location info)
- [x] 05-04-PLAN.md — ContactPage composition + human verification of all 5 Phase 5 success criteria

### Phase 6: Content and QA
**Goal**: All three language versions are fully populated with real content and the site passes RTL, performance, and accessibility checks across all pages
**Depends on**: Phase 5
**Requirements**: (Completes delivery of FNDTN-03, FNDTN-04 observable end-state; no new requirements — validates full system)
**Success Criteria** (what must be TRUE):
  1. Every visible string across all five pages in all three languages (Turkish, English, Arabic) is translated — zero raw translation keys or English fallbacks appear in Arabic or Turkish mode
  2. Switching to Arabic mode and navigating through all five pages reveals correct RTL layout mirroring: navigation items, card layouts, and animation directions all flip to right-to-left
  3. Lighthouse mobile performance score is 75 or higher on the Homepage and Services page
  4. All text in both light mode and dark mode meets WCAG AA contrast ratio (4.5:1 for body, 3:1 for large text)
  5. EmailJS form submission delivers a real email to the configured inbox using production environment variables
**Plans**: 4 plans

Plans:
- [ ] 06-01-PLAN.md — Phone field + AboutPage stub fix + locale gap audit + .env.example
- [ ] 06-02-PLAN.md — Playwright install + RTL snapshot tests (5 pages × 2 viewports) + GitHub Actions CI workflow
- [ ] 06-03-PLAN.md — Lighthouse audit on all 5 pages (production build) + remediation to reach ≥ 75
- [ ] 06-04-PLAN.md — EmailJS setup checkpoint + final RTL walkthrough + Playwright test gate

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 4/4 | Complete    | 2026-02-24 |
| 2. Shell | 4/4 | Complete    | 2026-02-24 |
| 3. Shared Components | 4/4 | Complete    | 2026-02-24 |
| 4. Homepage and Services | 6/6 | Complete    | 2026-02-25 |
| 5. Academy and Contact | 4/4 | Complete    | 2026-02-25 |
| 6. Content and QA | 0/TBD | Not started | - |
| 7. Polish and UX Enhancements | 4/5 | In Progress|  |

### Phase 7: Polish and UX Enhancements

**Goal**: The site feels premium and bespoke — locale JSON files split into per-language files (ar.json / en.json / tr.json), Arabic copy quality-reviewed and rewritten where needed, scroll-driven Framer Motion effects applied site-wide, and a custom branded cursor replaces the default pointer
**Depends on**: Phase 5
**Requirements**: POL-01, POL-02, POL-03, POL-04
**Success Criteria** (what must be TRUE):
  1. i18n locale files are split — `ar.json`, `en.json`, and `tr.json` exist as separate files; `common.json` is removed or unused
  2. Arabic copy reads naturally to a native speaker — no machine-translation artifacts, correct gendered forms, proper RTL punctuation
  3. At least two distinct scroll-driven animations are visible on the homepage (beyond the existing hero parallax and count-up)
  4. A custom cursor appears on desktop — replaces the default pointer with a branded element that reacts to hover states on interactive elements
**Plans**: 5 plans

Plans:
- [ ] 07-01-PLAN.md — Locale file split: rename common.json → ar.json/en.json/tr.json; update config.ts imports
- [ ] 07-02-PLAN.md — Arabic copy review: fix كورسات→دورات, em dash, punctuation, luxury register audit
- [ ] 07-03-PLAN.md — Scroll animations: useScroll+useTransform on ServicesTeaserSection heading + TestimonialsSection background
- [ ] 07-04-PLAN.md — Custom cursor: CustomCursor component with spring physics + hover ring; mount in RootLayout; CSS cursor hide
- [ ] 07-05-PLAN.md — Human verification: all 4 POL success criteria confirmed in browser

---
*Roadmap created: 2026-02-24*
*Last updated: 2026-02-25 after 05-04 complete — ContactPage composed + all 5 Phase 5 success criteria verified; Phase 5 COMPLETE*
