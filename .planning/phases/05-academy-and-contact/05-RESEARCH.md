# Phase 5: Academy and Contact — Research

**Researched:** 2026-02-25
**Domain:** EmailJS form submission, WhatsApp click-to-chat, React controlled forms, trilingual i18n content extension
**Confidence:** HIGH (stack verified against official docs and live official sources)

---

## Summary

Phase 5 builds two pages — Academy and Contact — on top of the complete scaffold from Phases 1–4. The codebase is mature: page stubs exist, the i18n system and locale JSON files are in place, all shared UI primitives (Card, Button, Typography, FadeInSection, StaggerContainer) are proven, and the page transition pattern (pageTransitionVariants with custom={dir}) is locked. Phase 5 is primarily a content-and-integration phase, not a new infrastructure phase.

The two external integrations are EmailJS (client-side email sending via `@emailjs/browser`) and WhatsApp click-to-chat (a URL constructed from `wa.me/{phone}?text={encodedMessage}`). Both are straightforward to implement: EmailJS is a single npm package with a `sendForm()` or `send()` call, WhatsApp is a pure URL construction with `encodeURIComponent`. No new routing, no new animation primitives, and no new CSS systems are required.

The highest-complexity task is the contact form: it needs controlled state for three languages (the service dropdown must be translated), loading/success/error feedback states, EmailJS async dispatch with try/catch, and form reset after success. The Academy page is structurally simpler — it mirrors the TreatmentGrid card pattern but with only two course cards and an "enroll" CTA that is either a WhatsApp link or a React Router Link to `/contact`.

**Primary recommendation:** Install `@emailjs/browser`, add `academy` and `contact` keys to all three locale JSON files, build section components following the AcademyTeaserSection/TreatmentGrid pattern, wire the contact form to EmailJS via controlled state + `emailjs.send()`, and construct WhatsApp URLs using `encodeURIComponent` with the business phone number from an env variable.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| ACAD-01 | User sees 2 course overview cards with title, description, duration, and price | Locale JSON extension with `academy.courses[]` array; CourseCard component modelled on TreatmentGrid card pattern |
| ACAD-02 | User can tap an enroll button that opens WhatsApp or navigates to contact form | WhatsApp URL: `https://wa.me/{phone}?text={encodeURIComponent(message)}`; React Router `Link to="/contact"` as alternative; Button component supports both `as="a"` and `as="button"` |
| CNTC-01 | User can submit a booking inquiry via form (name, email, service, message) sent through EmailJS | `@emailjs/browser` `emailjs.send()` with controlled form state; `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` env vars; success/error/loading state machine |
| CNTC-02 | User can tap a WhatsApp button that opens a pre-filled message in WhatsApp | `https://wa.me/{phone}?text={encodeURIComponent(t('contact.whatsapp_message'))}` opened via `Button as="a" href={...} target="_blank" rel="noopener noreferrer"` |
| CNTC-03 | User sees location information including address, business hours, and contact details | Static locale JSON keys under `contact.location`; rendered as a FadeInSection info card |
</phase_requirements>

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@emailjs/browser` | ^4.x (current) | Client-side email sending — no backend needed | Official EmailJS browser SDK; project constraint states "frontend demo only — form submissions via EmailJS" |
| `framer-motion` | ^12.34.3 (already installed) | Page transition + scroll reveal | Already locked across all pages; no new install |
| `react-i18next` | ^16.5.4 (already installed) | Locale-keyed content for all three languages | Already locked; common.json extended |
| `react-router-dom` | ^7.13.1 (already installed) | React Router Link for enroll button navigating to /contact | Already locked; Link preserves AnimatePresence exit |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Native `encodeURIComponent` | Browser built-in | Encode WhatsApp pre-filled message text | Always — no library needed; handles Arabic/Turkish Unicode correctly |
| `useState`, `useRef` (React) | React 19 (installed) | Form controlled state and form element reference | Controlled state for validation feedback; useRef not needed when using `emailjs.send()` with params object |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `emailjs.send()` with controlled state | `emailjs.sendForm()` with useRef | `sendForm()` is simpler but harder to validate pre-send and harder to build per-field error UI; `send()` with controlled state gives full control |
| Manual controlled form state | React Hook Form + Zod | React Hook Form is better for complex multi-step forms; for a 4-field contact form with no schema complexity, manual `useState` avoids a new dependency |
| `wa.me` URL | `api.whatsapp.com/send?phone=` | Both work; `wa.me` is the canonical short form recommended by WhatsApp for consumer-facing links |

**Installation:**
```bash
npm install @emailjs/browser
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── pages/
│   ├── AcademyPage.tsx          # Replace Phase 2 stub — compose CoursesSection
│   └── ContactPage.tsx          # Replace Phase 2 stub — compose ContactFormSection + ContactInfoSection
├── components/sections/
│   ├── CoursesSection.tsx       # Academy page — 2 course cards with enroll CTA
│   ├── ContactFormSection.tsx   # Contact form with EmailJS integration
│   └── ContactInfoSection.tsx   # Address, hours, contact details
├── i18n/locales/
│   ├── en/common.json           # Add `academy` and `contact` keys
│   ├── ar/common.json           # Same keys in Arabic
│   └── tr/common.json           # Same keys in Turkish
└── types/
    └── content.ts               # Add Course interface
```

### Pattern 1: Page Composition (same as HomePage/ServicesPage)

**What:** Page component is a pure composition — `motion.div` with `pageTransitionVariants` + `custom={dir}`, delegates all content to section components.
**When to use:** Every page in this project. Locked decision from Phase 2.

```typescript
// Source: locked pattern from 02-03, 04-04 decisions
export function AcademyPage() {
  const { dir } = useDirection();
  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      <main>
        <CoursesSection />
      </main>
    </motion.div>
  );
}
```

### Pattern 2: Course Card (mirrors TreatmentGrid card)

**What:** Two course cards rendered from locale JSON, each showing title, description, duration, price, and an enroll CTA.
**When to use:** AcademyPage CoursesSection.

```typescript
// Source: pattern from TreatmentGrid.tsx + AcademyTeaserSection.tsx
// Course interface to add to src/types/content.ts
export interface Course {
  id: string;         // stable slug e.g. "aesthetic-practitioner"
  title: string;
  description: string;
  duration: string;   // e.g. "12 weeks" / "١٢ أسبوعًا" / "12 hafta"
  price: string;      // e.g. "₺8500"
}
```

Locale JSON shape (`academy.courses`):
```json
{
  "academy": {
    "hero": { "headline": "...", "subtitle": "..." },
    "courses_heading": "...",
    "courses": [
      {
        "id": "aesthetic-practitioner",
        "title": "Aesthetic Practitioner",
        "description": "Master advanced facial and skin treatment techniques...",
        "duration": "12 weeks",
        "price": "₺8500"
      },
      {
        "id": "professional-cosmetology",
        "title": "Professional Cosmetology",
        "description": "Comprehensive training in hair, nail, and body care...",
        "duration": "16 weeks",
        "price": "₺10500"
      }
    ],
    "enroll_cta": "Enroll via WhatsApp"
  }
}
```

### Pattern 3: WhatsApp CTA URL Construction

**What:** Build `wa.me` URL with pre-filled message encoded for the current language.
**When to use:** Enroll button on course cards (ACAD-02) and WhatsApp CTA on Contact page (CNTC-02).

```typescript
// Source: WhatsApp official docs (https://faq.whatsapp.com/5913398998672934)
// Verified: encodeURIComponent handles Arabic/Turkish Unicode correctly
function buildWhatsAppURL(phone: string, message: string): string {
  // phone must be E.164 format without + or spaces, e.g. "905XXXXXXXXX"
  // message is the translated pre-filled text from i18n
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
```

Phone number env var: `VITE_WHATSAPP_NUMBER` — E.164 format without `+` prefix (e.g., `905XXXXXXXXX` for Turkish numbers).

Usage as `Button` anchor:
```typescript
// Link must open in new tab; rel prevents opener attack
<Button
  as="a"
  variant="primary"
  href={buildWhatsAppURL(
    import.meta.env.VITE_WHATSAPP_NUMBER,
    t('contact.whatsapp_message')
  )}
  target="_blank"
  rel="noopener noreferrer"
>
  {t('contact.whatsapp_cta')}
</Button>
```

Note: The existing `Button` component (`src/components/ui/Button.tsx`) does not currently accept `target` or `rel` props. It will need these props added when `as="a"`. The fix is minimal — add `target?: string; rel?: string;` to the interface and spread them onto the `<Tag>` element when `Tag === 'a'`.

### Pattern 4: EmailJS Contact Form with Controlled State

**What:** Controlled form with `useState` for all field values plus a `status` state machine (`idle | loading | success | error`). Submits via `emailjs.send()` (not `sendForm()`) to allow pre-validation and per-field error display.
**When to use:** ContactFormSection (CNTC-01).

```typescript
// Source: @emailjs/browser v4 official docs + mailtrap.io/blog/emailjs-react/ (2026)
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormValues {
  name: string;
  email: string;
  service: string;
  message: string;
}

// Inside component:
const [values, setValues] = useState<FormValues>({
  name: '', email: '', service: '', message: ''
});
const [status, setStatus] = useState<FormStatus>('idle');
const [errorMessage, setErrorMessage] = useState<string>('');

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setStatus('loading');
  setErrorMessage('');

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: values.name,
        from_email: values.email,
        service: values.service,
        message: values.message,
      },
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
    );
    setStatus('success');
    setValues({ name: '', email: '', service: '', message: '' });
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      setErrorMessage(err.text);
    } else {
      setErrorMessage(t('contact.form.error_generic'));
    }
    setStatus('error');
  }
};
```

EmailJS template variables that must match:
- `{{from_name}}` — maps to `values.name`
- `{{from_email}}` — maps to `values.email`
- `{{service}}` — maps to `values.service`
- `{{message}}` — maps to `values.message`

### Pattern 5: Contact Info Display

**What:** Static info card with address, business hours, phone, and email — all from locale JSON.
**When to use:** ContactInfoSection (CNTC-03).

```json
// Locale JSON shape — contact.location
{
  "contact": {
    "location": {
      "address": "Nişantaşı, Istanbul, Turkey",
      "phone": "+90 (212) XXX-XXXX",
      "email": "hello@lumierebeaute.com",
      "hours": [
        { "days": "Monday – Friday", "hours": "09:00 – 20:00" },
        { "days": "Saturday", "hours": "10:00 – 18:00" },
        { "days": "Sunday", "hours": "Closed" }
      ]
    }
  }
}
```

### Anti-Patterns to Avoid

- **Using `<a href="/contact">` for enroll button navigation:** Bypasses AnimatePresence exit animation. Always use React Router `<Link to="/contact">`. Locked decision from 04-03.
- **Using `emailjs.sendForm()` with `useRef`:** Harder to validate before submission and harder to show per-field errors. Use `emailjs.send()` with controlled state.
- **Hardcoding WhatsApp phone number in source code:** Must go in `VITE_WHATSAPP_NUMBER` env var — callers in Istanbul will expect the real business number.
- **Not encoding the WhatsApp message text:** Arabic and Turkish characters must be `encodeURIComponent`-encoded or WhatsApp will receive malformed URLs.
- **Using `ml-` / `mr-` / `pl-` / `pr-` Tailwind classes:** All inline-axis spacing must use logical properties (`ms-`, `me-`, `ps-`, `pe-`). Locked decision from Phase 1.
- **Using physical `x` values in Framer Motion:** Any horizontal slide animation must use the RTL-aware variant function pattern with `custom={isRTL}`. Not needed for these pages (no horizontal slides), but worth flagging.
- **Using color tokens outside the @theme block:** The seagrass-* mistake from Phase 4 (04-06) — only use tokens defined in `src/styles/globals.css` `@theme` block: `celadon-*`, `mint-leaf-*`, `seagrass-*`, `jungle-teal-*`, `blue-spruce-*`, `deep-ocean-*`, `stormy-teal-*`, `surface-ivory`, `surface-dark`, `surface-dark-card`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sending email from browser | Custom fetch to SMTP relay / serverless function | `@emailjs/browser` `emailjs.send()` | EmailJS handles SMTP auth, rate limiting, template rendering server-side; project constraint explicitly says "EmailJS" |
| WhatsApp URL construction | Custom encoding library | Native `encodeURIComponent` | Handles all Unicode (Arabic, Turkish, special chars) correctly; no dependency needed |
| Form state management | Custom form hook / reducer | `useState` with 4 fields + status enum | 4-field form is too small to justify React Hook Form overhead; no validation schema complexity |
| Scroll reveal animations | New animation component | Existing `FadeInSection` + `StaggerContainer` | Already built, tested, RTL-safe, performance-validated |
| Course/contact card layout | New layout primitives | Existing `Card`, `Heading`, `BodyText`, `Button` | All primitives already built and tested across Phase 3–4 |

**Key insight:** Phase 5 is a consumer of Phase 1–4 infrastructure, not a builder of new infrastructure. The only genuinely new work is the EmailJS integration and locale JSON extension.

---

## Common Pitfalls

### Pitfall 1: Button Component Missing `target` and `rel` Props

**What goes wrong:** WhatsApp CTA uses `Button as="a"` but the current `Button` component does not accept `target` or `rel` props. The link will open in the same tab (disrupting navigation) and exposes a `window.opener` security vulnerability.
**Why it happens:** The original `Button` interface was designed for `href`-only anchor use cases.
**How to avoid:** Extend `ButtonProps` to include `target?: string; rel?: string;` and pass them through to the `<Tag>` element when rendering as anchor. This is a one-line fix.
**Warning signs:** TypeScript compiler error when adding `target="_blank"` to `<Button as="a">`.

### Pitfall 2: EmailJS Env Vars Not Prefixed with `VITE_`

**What goes wrong:** `import.meta.env.EMAILJS_SERVICE_ID` returns `undefined` at runtime — Vite strips non-`VITE_`-prefixed vars from the client bundle.
**Why it happens:** Vite's env variable exposure requires the `VITE_` prefix.
**How to avoid:** Use `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`. Document that these must be set in `.env.local` before the contact form can function.
**Warning signs:** `emailjs.send()` throws an error about invalid service ID; or silently fails with a 400 response.

### Pitfall 3: EmailJS Template Variable Names Must Match

**What goes wrong:** EmailJS silently sends the email but template variables render as empty (e.g., `Hi ` instead of `Hi John`).
**Why it happens:** The object passed to `emailjs.send()` uses keys like `name`, but the EmailJS template uses `{{from_name}}`.
**How to avoid:** Define the template variable names first in the EmailJS dashboard, then match them exactly in the `send()` params object. Document the mapping in a comment above the `handleSubmit` function.
**Warning signs:** Emails arrive with blank fields.

### Pitfall 4: Using `<a href="/contact">` Instead of `<Link to="/contact">`

**What goes wrong:** The page transition exit animation is skipped — the user sees a hard browser navigation instead of the cinematic slide transition.
**Why it happens:** `<a>` causes a full browser navigation, bypassing React Router and AnimatePresence.
**How to avoid:** For all internal navigation (enroll button going to /contact), always use React Router `<Link to="/contact">`. Only use `<a>` for external links (WhatsApp).
**Warning signs:** No exit animation visible when clicking the enroll button; URL bar shows a full reload.

### Pitfall 5: WhatsApp Phone Number Format

**What goes wrong:** WhatsApp link returns "This phone number is not registered on WhatsApp" or opens to a blank chat.
**Why it happens:** Phone number has `+`, spaces, or dashes — wa.me expects digits only in international format (country code + number, no special chars).
**How to avoid:** Store as `905XXXXXXXXX` (Turkey country code 90, no `+`). The env var `VITE_WHATSAPP_NUMBER` should contain only digits.
**Warning signs:** Link opens WhatsApp but shows an error or empty state.

### Pitfall 6: Arabic/Turkish Content in Academy Locale Keys Not Yet Written

**What goes wrong:** The Academy page locale keys (`academy.*`) exist in the EN locale but AR and TR are empty or missing — users see raw translation keys.
**Why it happens:** STATE.md explicitly notes "course curricula (Aesthetic Practitioner, Professional Cosmetology) still need detailed curriculum content for Academy page."
**How to avoid:** Write all three locale versions (TR, EN, AR) in the same plan task that creates the locale JSON structure. Don't defer Arabic content to Phase 6.
**Warning signs:** Raw key strings like `academy.courses` visible in AR or TR mode.

### Pitfall 7: Contact Form Success State Not Clearing Form

**What goes wrong:** User submits the form, sees "Success!" but the form still shows their data — they can accidentally submit again.
**Why it happens:** Forgetting to reset form values in the success branch.
**How to avoid:** After `setStatus('success')`, reset all values: `setValues({ name: '', email: '', service: '', message: '' })`.
**Warning signs:** Form fields remain populated after successful submission.

---

## Code Examples

### EmailJS Send Pattern (verified from official docs and mailtrap.io 2026)

```typescript
// Source: https://www.emailjs.com/docs/examples/reactjs/ + mailtrap.io/blog/emailjs-react/
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (status === 'loading') return;
  setStatus('loading');

  try {
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      {
        from_name: values.name,
        from_email: values.email,
        service: values.service,
        message: values.message,
      },
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
    );
    setStatus('success');
    setValues({ name: '', email: '', service: '', message: '' });
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      setErrorMessage(err.text);
    } else {
      setErrorMessage(t('contact.form.error_generic'));
    }
    setStatus('error');
  }
};
```

### WhatsApp URL Builder

```typescript
// Source: WhatsApp official FAQ (https://faq.whatsapp.com/5913398998672934)
// encodeURIComponent handles Arabic and Turkish Unicode correctly
const buildWhatsAppURL = (phone: string, message: string): string =>
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

// Usage:
const whatsappHref = buildWhatsAppURL(
  import.meta.env.VITE_WHATSAPP_NUMBER, // e.g. "905XXXXXXXXX"
  t('contact.whatsapp_message')
);
```

### Button Component Extension for External Links

```typescript
// Extend existing Button.tsx to support target and rel:
interface ButtonProps {
  variant: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  target?: string;   // ADD: for external links like WhatsApp
  rel?: string;      // ADD: rel="noopener noreferrer" for _blank
}
// In render, spread target and rel onto Tag when Tag === 'a'
```

### Locale JSON — Academy Section (all three languages)

```json
// en/common.json addition:
"academy": {
  "hero": {
    "headline": "Lumiere Academy",
    "subtitle": "Professional certification courses taught by industry experts."
  },
  "courses_heading": "Our Courses",
  "courses": [
    {
      "id": "aesthetic-practitioner",
      "title": "Aesthetic Practitioner",
      "description": "Master advanced facial and skin treatment techniques used by professionals worldwide. Includes HydraFacial, chemical peels, microneedling, and skin analysis.",
      "duration": "12 weeks",
      "price": "₺8,500"
    },
    {
      "id": "professional-cosmetology",
      "title": "Professional Cosmetology",
      "description": "Comprehensive training in hair care, nail techniques, and body treatments. Full certification program with hands-on clinic hours.",
      "duration": "16 weeks",
      "price": "₺10,500"
    }
  ],
  "enroll_cta": "Enroll via WhatsApp",
  "contact_cta": "Book a Consultation"
}
```

### Locale JSON — Contact Section (structure)

```json
// en/common.json addition:
"contact": {
  "hero": {
    "headline": "Contact Us",
    "subtitle": "Book a treatment, ask a question, or start your academy journey."
  },
  "form": {
    "heading": "Send Us a Message",
    "name_label": "Your Name",
    "email_label": "Email Address",
    "service_label": "Service of Interest",
    "service_options": [
      "Facial Treatments",
      "Body Treatments",
      "Hair Care",
      "Nail Care",
      "Eye Treatments",
      "Academy Enrollment",
      "General Inquiry"
    ],
    "message_label": "Your Message",
    "submit_cta": "Send Message",
    "sending": "Sending...",
    "success_heading": "Message Sent!",
    "success_body": "Thank you — we'll be in touch within 24 hours.",
    "error_generic": "Something went wrong. Please try again or contact us via WhatsApp."
  },
  "whatsapp_cta": "Chat on WhatsApp",
  "whatsapp_message": "Hello, I'm interested in booking a treatment at Lumiere Beaute.",
  "location": {
    "heading": "Find Us",
    "address": "Nişantaşı, Istanbul, Turkey",
    "phone": "+90 (212) XXX-XXXX",
    "email": "hello@lumierebeaute.com",
    "hours_heading": "Business Hours",
    "hours": [
      { "days": "Monday – Friday", "hours": "09:00 – 20:00" },
      { "days": "Saturday", "hours": "10:00 – 18:00" },
      { "days": "Sunday", "hours": "Closed" }
    ]
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| EmailJS global `init()` once at app entry | Pass `{ publicKey }` inline to each `send()` call | @emailjs/browser v4 | No global side effects; works better with env var-only setup |
| `emailjs.sendForm(ref)` with uncontrolled inputs | `emailjs.send(params)` with controlled state | Design choice | Per-field validation and richer error UI possible |
| `process.env.REACT_APP_*` for env vars | `import.meta.env.VITE_*` | Vite-based projects | All env vars must be prefixed `VITE_` to be exposed to client |
| WhatsApp `api.whatsapp.com/send?phone=` | `wa.me/{phone}?text=` | WhatsApp official guidance | wa.me is the canonical short-link format; both work but wa.me is preferred |

**Deprecated/outdated:**
- `emailjs.init(publicKey)` as standalone call before send: Still works but optional in v4; prefer inline `{ publicKey }` option to avoid global state.
- `process.env`: Not available in Vite — use `import.meta.env` only.

---

## Open Questions

1. **WhatsApp business number**
   - What we know: Must be E.164 format, Turkey country code 90, digits only in env var.
   - What's unclear: The actual `VITE_WHATSAPP_NUMBER` value — STATE.md flags this as a blocker: "WhatsApp business number in E.164 format (90XXXXXXXXXX) must be known before Phase 5 WhatsApp CTA wiring."
   - Recommendation: Hard-code a placeholder like `905XXXXXXXXX` in env var comments; plan task should note that production requires the real number. The WhatsApp CTA button can be built and tested with a test number.

2. **EmailJS production credentials**
   - What we know: `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` must all be set.
   - What's unclear: Whether the EmailJS account/service/template has been created yet. STATE.md flags this as a blocker.
   - Recommendation: Build the entire form UI and submit logic first; test with placeholder env vars that return a predictable error. Add a note in the plan's verification step that real credentials are required before CNTC-01 can be marked complete.

3. **Academy course content for Arabic and Turkish**
   - What we know: AR and TR locale files exist but Academy keys have not been written yet. The English course descriptions above are proposed.
   - What's unclear: Idiomatic Arabic phrasing for course titles/descriptions; STATE.md notes "Arabic content requires idiomatic copywriting."
   - Recommendation: Write the EN version in the plan task, use machine-translated placeholder for AR/TR, and mark Arabic copy review as a Phase 6 QA task. The key structure must be correct even if copy is placeholder.

4. **Service dropdown options in Arabic/Turkish**
   - What we know: The contact form has a `service` dropdown. The 7 options (Facial Treatments, Body Treatments, etc.) need TR and AR translations.
   - What's unclear: Exact idiomatic translations.
   - Recommendation: Add to locale JSON in the same task as other contact keys; use the already-established treatment category label translations from `services.categories[]` as a basis.

---

## Sources

### Primary (HIGH confidence)
- `https://www.emailjs.com/docs/examples/reactjs/` — Official EmailJS React example; `sendForm()` pattern with `useRef`; confirmed `@emailjs/browser` package name
- `https://www.emailjs.com/docs/sdk/installation/` — Official SDK docs; `send()` and `sendForm()` signatures; `init()` vs inline options pattern; v4 CDN reference confirming current major version
- `https://github.com/emailjs-com/emailjs-sdk/blob/main/README.md` — Official GitHub README; `EmailJSResponseStatus` export confirmed; inline `{ publicKey }` option confirmed for v4
- `https://faq.whatsapp.com/5913398998672934` — Official WhatsApp FAQ; `wa.me/{phone}?text={encodedText}` format confirmed
- Existing codebase: `src/components/ui/Button.tsx`, `src/components/sections/AcademyTeaserSection.tsx`, `src/components/sections/TreatmentGrid.tsx`, `src/types/content.ts`, `src/animations/variants.ts`, `src/i18n/locales/*/common.json` — all read directly

### Secondary (MEDIUM confidence)
- `https://mailtrap.io/blog/emailjs-react/` (2026) — Detailed TypeScript patterns; controlled state with `emailjs.send()`; `VITE_` prefix confirmed; success/error/loading state machine pattern; `form.current?.reset()` after success
- Vite docs (from WebSearch) — `VITE_` prefix requirement for client-exposed env vars; `import.meta.env` access pattern
- Multiple WebSearch results confirming `encodeURIComponent` is the standard for WhatsApp message encoding

### Tertiary (LOW confidence)
- WebSearch result describing `api.whatsapp.com/send?phone=` as alternative to `wa.me` — not verified against official WhatsApp developer docs; recommend using `wa.me` which is confirmed from official FAQ.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — EmailJS official docs confirmed; all other dependencies already installed and proven
- Architecture: HIGH — Pattern is identical to Phase 4 (TreatmentGrid, ServicesPage, HomePage) which is complete and verified
- Pitfalls: HIGH — VITE_ prefix from official Vite docs; Button target/rel gap identified by reading existing source; WhatsApp format from official FAQ; content gaps from STATE.md blockers

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (stable libraries; EmailJS v4 API unlikely to change in 30 days)
