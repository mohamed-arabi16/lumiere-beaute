# Roadmap: Lumiere Beaute

## Overview

Six phases build the site in strict dependency order: establish design tokens and i18n infrastructure before writing any JSX; wire up routing and navigation before building pages; build shared UI primitives before composing sections; then build the two highest-complexity pages, then the remaining pages, then fully populate content and validate quality. Each phase is complete and verifiable before the next begins, eliminating the two primary risks — RTL breakage invisible during LTR development, and cinematic animations crippling mobile performance.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Color system, typography, i18n config, theming infrastructure, and CSS gradient system
- [ ] **Phase 2: Shell** - App layout, routing, page transitions, and navbar with language/theme controls
- [ ] **Phase 3: Shared Components** - UI primitives, RTL-aware animation wrappers, and performance baseline
- [ ] **Phase 4: Homepage and Services** - Full hero, stats, teasers, testimonials, and filterable treatment catalog
- [ ] **Phase 5: Academy and Contact** - Course pages, enrollment CTA, booking form, and WhatsApp integration
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
- [ ] 02-04-PLAN.md — Human verify: all 4 Phase 2 success criteria confirmed interactively

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
**Plans**: TBD

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
**Plans**: TBD

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
**Plans**: TBD

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
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 4/4 | Complete    | 2026-02-24 |
| 2. Shell | 3/4 | In Progress|  |
| 3. Shared Components | 0/TBD | Not started | - |
| 4. Homepage and Services | 0/TBD | Not started | - |
| 5. Academy and Contact | 0/TBD | Not started | - |
| 6. Content and QA | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-24*
*Last updated: 2026-02-24 after Phase 2 planning — 4 plans created across 3 waves*
