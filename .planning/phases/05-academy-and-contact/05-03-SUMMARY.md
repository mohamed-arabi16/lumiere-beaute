---
phase: 05-academy-and-contact
plan: "03"
subsystem: ui
tags: [react, typescript, emailjs, i18n, tailwind, contact-form, whatsapp]

# Dependency graph
requires:
  - phase: 05-01
    provides: Contact locale keys (contact.form.*, contact.location.*, contact.whatsapp_*)
  - phase: 03-shared-components
    provides: FadeInSection, Card, Heading, BodyText, Button components
provides:
  - ContactFormSection — EmailJS-wired 4-field form with idle/loading/success/error state machine and WhatsApp CTA
  - ContactInfoSection — static location info card with address, phone, email, and business hours definition list
affects:
  - 05-04 (ContactPage composition)

# Tech tracking
tech-stack:
  added:
    - "@emailjs/browser ^4.4.1"
  patterns:
    - "EmailJS send() with VITE_ env var refs and publicKey option"
    - "4-state form state machine (idle|loading|success|error)"
    - "Form field reset on success via setValues({name:'',email:'',service:'',message:''})"
    - "instanceof EmailJSResponseStatus imported as value (not type) for error discrimination"
    - "WhatsApp CTA via Button as='a' with buildWhatsAppURL helper and VITE_WHATSAPP_NUMBER"
    - "Locale-driven service options via returnObjects:true for string[] array"
    - "HoursEntry interface local to component for typed dl/dt/dd rendering"

key-files:
  created:
    - src/components/sections/ContactFormSection.tsx
    - src/components/sections/ContactInfoSection.tsx
  modified:
    - package.json (added @emailjs/browser)
    - package-lock.json

key-decisions:
  - "EmailJSResponseStatus imported as value (not type) — instanceof check requires runtime value, not type-only import"
  - "WhatsApp phone defaults to '905XXXXXXXXX' placeholder when VITE_WHATSAPP_NUMBER env var is absent — degrades gracefully in dev"
  - "Service options array sourced from locale JSON via returnObjects:true — all 7 options translate automatically with language switch"
  - "ContactInfoSection uses dl/dt/dd semantic HTML for business hours — accessibility-correct for term/definition pairs"

patterns-established:
  - "EmailJS integration pattern: VITE_ env vars, EmailJSResponseStatus instanceof, 4-state machine"
  - "Contact form: noValidate + HTML5 required attrs for browser-native validation without JS overhead"

requirements-completed: [CNTC-01, CNTC-02, CNTC-03]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 5 Plan 03: Contact Sections Summary

**EmailJS-wired 4-field contact form with idle/loading/success/error state machine, WhatsApp CTA, and static location info card using semantic dl/dt/dd hours list**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T02:07:15Z
- **Completed:** 2026-02-25T02:08:48Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- ContactFormSection with complete EmailJS wiring: controlled 4-field form (name, email, service select with 7 locale-driven options, message textarea), emailjs.send() with VITE_ env vars, and 4-state state machine (idle/loading/success/error)
- WhatsApp CTA button via Button as="a" with buildWhatsAppURL helper — phone from VITE_WHATSAPP_NUMBER env var, pre-filled message from locale JSON
- ContactInfoSection with zero hardcoded strings — all content from contact.location.* locale keys, business hours rendered as semantic dl/dt/dd definition list

## Task Commits

Each task was committed atomically:

1. **Task 1: Install @emailjs/browser and build ContactFormSection** - `8a465f2` (feat)
2. **Task 2: Build ContactInfoSection with address, hours, and contact details** - `273bd11` (feat)

**Plan metadata:** *(docs commit pending)*

## Files Created/Modified

- `src/components/sections/ContactFormSection.tsx` — EmailJS-wired 4-field contact form with state machine and WhatsApp CTA button
- `src/components/sections/ContactInfoSection.tsx` — Static info card with address, phone, email, and business hours definition list
- `package.json` — Added @emailjs/browser ^4.4.1
- `package-lock.json` — Updated lockfile

## Decisions Made

- **EmailJSResponseStatus as value import:** The plan template used `import type EmailJSResponseStatus` but `instanceof` requires a runtime value, not a type alias. Fixed to `import EmailJSResponseStatus` (value import). TypeScript confirmed zero errors after fix.
- **WhatsApp number fallback:** VITE_WHATSAPP_NUMBER defaults to `'905XXXXXXXXX'` placeholder — form renders and WhatsApp CTA is clickable in dev/staging even without credentials configured.
- **Service options via returnObjects:** `t('contact.form.service_options', { returnObjects: true }) as string[]` — all 7 service options translate automatically when language changes, no hardcoded EN strings in component.
- **Semantic HTML for hours:** dl/dt/dd chosen over div+spans for business hours — accessibility-correct pattern for day/time term-definition pairs.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed EmailJSResponseStatus import type to value import**
- **Found during:** Task 1 (ContactFormSection TypeScript check)
- **Issue:** Plan template used `import type EmailJSResponseStatus` but `instanceof` check requires a runtime value — TypeScript error TS1361 "cannot be used as a value because it was imported using import type"
- **Fix:** Changed `import emailjs, { type EmailJSResponseStatus }` to `import emailjs, { EmailJSResponseStatus }`
- **Files modified:** src/components/sections/ContactFormSection.tsx
- **Verification:** `npx tsc --noEmit` — zero errors after fix
- **Committed in:** 8a465f2 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — bug in plan template code)
**Impact on plan:** Fix essential for TypeScript correctness and runtime instanceof error handling. No scope creep.

## Issues Encountered

None — single auto-fix resolved the only issue encountered.

## User Setup Required

**External services require manual configuration before the contact form sends email or WhatsApp CTA uses the real number.**

Required environment variables (add to `.env.local` for dev, Vercel/host dashboard for production):

| Variable | Source |
|---|---|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Dashboard → Email Services → your service → Service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS Dashboard → Email Templates → your template → Template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Dashboard → Account → General → Public Key |
| `VITE_WHATSAPP_NUMBER` | Business WhatsApp in E.164 format, digits only: 905XXXXXXXXX |

**EmailJS template variables** (must match in your template): `{{from_name}}`, `{{from_email}}`, `{{service}}`, `{{message}}`

Until configured, the form will show a graceful error state on submit and WhatsApp CTA opens with the placeholder number.

## Next Phase Readiness

- ContactFormSection and ContactInfoSection are standalone, type-safe, and wired to locale JSON
- Both sections ready for ContactPage composition in Plan 05-04
- No blockers — EmailJS credentials are optional for UI development; page renders correctly without them

---
*Phase: 05-academy-and-contact*
*Completed: 2026-02-25*
