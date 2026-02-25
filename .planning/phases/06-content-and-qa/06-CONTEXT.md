# Phase 6: Content and QA - Context

**Gathered:** 2026-02-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Populate all three language versions (Turkish, English, Arabic) with real content across all five pages, then validate the site passes RTL, performance, and accessibility checks. No new features — this phase validates and completes what was built in Phases 1–5.

</domain>

<decisions>
## Implementation Decisions

### Content source
- All copy needs to be written from scratch — no pre-existing content
- English is the authoritative source language
- Claude writes all English copy across all 5 pages, then translates to Turkish and Arabic
- Tone: warm and inviting — friendly, professional, approachable; speaks to clients as a trusted expert
- Content goes directly into locale JSON files after writing

### RTL audit approach
- Automated Playwright snapshot tests (not manual walkthrough)
- Snapshots added to CI pipeline for ongoing regression prevention
- Priority components to verify in RTL/Arabic mode:
  - Card layouts (treatment cards, course cards, testimonials)
  - Navigation items (navbar links, language switcher, mobile menu)
  - Animation directions (slide-in direction must reverse for RTL)
  - Form fields and buttons (contact form layout, input text direction)

### Performance strategy
- Lighthouse mobile score of 75 is a **hard gate** — phase is not complete until met
- Primary remediation focus: image optimization (sizes, lazy loading, WebP format)
- Secondary: animations, then bundle size — if images alone don't reach 75
- All 5 pages audited (not just Homepage + Services)

### EmailJS setup
- EmailJS account, service, and template must be created as part of this phase
- Delivery email address: use a placeholder (client fills in real address later)
- Email template captures: name, email, message, selected service/treatment, phone number
- Production environment variables (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) must be documented and wired for Vercel deployment

### Claude's Discretion
- Exact copy content for each page and section (within warm/inviting tone guideline)
- EmailJS template HTML/styling
- Lighthouse remediation specifics beyond image optimization if needed
- Snapshot test file structure and tooling setup

</decisions>

<specifics>
## Specific Ideas

- All content must feel natural and client-facing, not placeholder-like — real service names, real benefit statements, real academy course descriptions
- The CI snapshot tests should capture the Arabic (`dir="rtl"`) version of each page at 390px (mobile) and 1440px (desktop)
- EmailJS integration must work end-to-end in production (Vercel) — not just localhost

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 06-content-and-qa*
*Context gathered: 2026-02-25*
