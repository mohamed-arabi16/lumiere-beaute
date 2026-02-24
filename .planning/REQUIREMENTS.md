# Requirements: Lumiere Beaute

**Defined:** 2026-02-24
**Core Value:** The website must feel like a premium, editorial experience — visitors should immediately sense luxury and trust, regardless of language or device.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Foundation

- [x] **FNDTN-01**: User sees consistent teal-green color system across all pages (10 named colors, 100-900 scales via Tailwind v4 @theme)
- [x] **FNDTN-02**: User can toggle between light mode (warm ivory) and dark mode (forest-at-dusk teal), preference persists across sessions
- [x] **FNDTN-03**: User can switch between Turkish, English, and Arabic via language selector
- [x] **FNDTN-04**: Arabic users see fully mirrored RTL layout (navigation, text, cards, animations)
- [x] **FNDTN-05**: User's browser language is auto-detected on first visit, falling back to Turkish
- [x] **FNDTN-06**: User experiences cinematic full-screen transitions when navigating between pages
- [x] **FNDTN-07**: User has a fully functional experience on mobile (390px) through desktop (1440px)
- [x] **FNDTN-08**: User sees Cormorant Garamond headings, Inter body text, and appropriate Arabic typeface for AR content
- [x] **FNDTN-09**: All image slots display CSS gradient placeholders that match the brand aesthetic

### Navigation

- [x] **NAV-01**: User can navigate all pages via a responsive navbar with language switcher and theme toggle
- [x] **NAV-02**: Mobile user can access navigation via an animated hamburger menu

### Home

- [ ] **HOME-01**: User sees a full-screen hero section with parallax gradient, typewriter text animation, and call-to-action
- [ ] **HOME-02**: User sees animated counting statistics (clients served, years of experience, treatments offered)
- [ ] **HOME-03**: User sees services teaser cards that link to the Services page
- [ ] **HOME-04**: User sees academy teaser cards that link to the Academy page
- [ ] **HOME-05**: User sees client testimonials section with quotes

### Services

- [ ] **SRVC-01**: User can filter 20+ treatments by category using animated tab controls
- [ ] **SRVC-02**: User sees treatment cards displaying name, description, duration, and price

### Academy

- [ ] **ACAD-01**: User sees 2 course overview cards with title, description, duration, and price
- [ ] **ACAD-02**: User can tap an enroll button that opens WhatsApp or navigates to contact form

### Contact

- [ ] **CNTC-01**: User can submit a booking inquiry via form (name, email, service, message) sent through EmailJS
- [ ] **CNTC-02**: User can tap a WhatsApp button that opens a pre-filled message in WhatsApp
- [ ] **CNTC-03**: User sees location information including address, business hours, and contact details

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### About Page

- **ABOUT-01**: User sees brand story with editorial layout
- **ABOUT-02**: User sees team members with photo placeholders and roles
- **ABOUT-03**: User sees brand values/philosophy as visual cards

### Services Enhancements

- **SRVC-03**: User can click a treatment card to see expanded detail view or modal

### Academy Enhancements

- **ACAD-03**: User sees full module-by-module curriculum breakdown for each course
- **ACAD-04**: User sees instructor bios with credentials and experience

### Contact Enhancements

- **CNTC-04**: User can browse expandable FAQ accordion on Contact page

### SEO

- **SEO-01**: Pages have proper meta tags, Open Graph, and structured data

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / real booking system | Frontend demo only — form submissions via EmailJS |
| CMS / admin panel | Static content via JSON translation files |
| Payment processing | Not needed for v1 showcase site |
| Real photography | CSS gradient placeholders used throughout |
| User authentication / login | No user accounts needed |
| Real-time chat | WhatsApp CTA sufficient for Istanbul market |
| Video content | Storage/bandwidth costs, defer to v2+ |
| Google Maps embed | Location info as text/address is sufficient for v1 |
| Mobile app | Web-first, responsive design covers mobile |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FNDTN-01 | Phase 1 | Complete |
| FNDTN-02 | Phase 1 | Complete |
| FNDTN-03 | Phase 1 | Complete |
| FNDTN-04 | Phase 1 | Complete |
| FNDTN-05 | Phase 1 | Complete |
| FNDTN-06 | Phase 2 | Complete |
| FNDTN-07 | Phase 2 | Complete |
| FNDTN-08 | Phase 1 | Complete |
| FNDTN-09 | Phase 1 | Complete |
| NAV-01 | Phase 2 | Complete |
| NAV-02 | Phase 2 | Complete |
| HOME-01 | Phase 4 | Pending |
| HOME-02 | Phase 4 | Pending |
| HOME-03 | Phase 4 | Pending |
| HOME-04 | Phase 4 | Pending |
| HOME-05 | Phase 4 | Pending |
| SRVC-01 | Phase 4 | Pending |
| SRVC-02 | Phase 4 | Pending |
| ACAD-01 | Phase 5 | Pending |
| ACAD-02 | Phase 5 | Pending |
| CNTC-01 | Phase 5 | Pending |
| CNTC-02 | Phase 5 | Pending |
| CNTC-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 23 total
- Mapped to phases: 23
- Unmapped: 0

---
*Requirements defined: 2026-02-24*
*Last updated: 2026-02-24 after roadmap creation — all 23 v1 requirements mapped*
