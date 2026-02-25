# Phase 6: Content and QA - Research

**Researched:** 2026-02-25
**Domain:** Trilingual i18n content population, Playwright RTL snapshot testing, Lighthouse mobile performance, WCAG AA accessibility, EmailJS production wiring
**Confidence:** HIGH (codebase fully inspected; EmailJS and Playwright docs verified via official sources)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Content source**
- All copy needs to be written from scratch — no pre-existing content
- English is the authoritative source language
- Claude writes all English copy across all 5 pages, then translates to Turkish and Arabic
- Tone: warm and inviting — friendly, professional, approachable; speaks to clients as a trusted expert
- Content goes directly into locale JSON files after writing

**RTL audit approach**
- Automated Playwright snapshot tests (not manual walkthrough)
- Snapshots added to CI pipeline for ongoing regression prevention
- Priority components to verify in RTL/Arabic mode:
  - Card layouts (treatment cards, course cards, testimonials)
  - Navigation items (navbar links, language switcher, mobile menu)
  - Animation directions (slide-in direction must reverse for RTL)
  - Form fields and buttons (contact form layout, input text direction)

**Performance strategy**
- Lighthouse mobile score of 75 is a **hard gate** — phase is not complete until met
- Primary remediation focus: image optimization (sizes, lazy loading, WebP format)
- Secondary: animations, then bundle size — if images alone don't reach 75
- All 5 pages audited (not just Homepage + Services)

**EmailJS setup**
- EmailJS account, service, and template must be created as part of this phase
- Delivery email address: use a placeholder (client fills in real address later)
- Email template captures: name, email, message, selected service/treatment, phone number
- Production environment variables (VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY) must be documented and wired for Vercel deployment

### Claude's Discretion
- Exact copy content for each page and section (within warm/inviting tone guideline)
- EmailJS template HTML/styling
- Lighthouse remediation specifics beyond image optimization if needed
- Snapshot test file structure and tooling setup

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDTN-03 | User can switch between Turkish, English, and Arabic via language selector (observable end-state: all three locales fully populated) | Locale JSON audit confirms EN/TR/AR all have content — need final copy review pass and zero-fallback verification |
| FNDTN-04 | Arabic users see fully mirrored RTL layout (navigation, text, cards, animations) (observable end-state: Playwright snapshots confirm mirroring) | Playwright `toHaveScreenshot` pattern identified; RTL verification via `dir="rtl"` attribute snapshots at 390px + 1440px |
</phase_requirements>

---

## Summary

Phase 6 is primarily a **validation and polish phase**, not a build phase. The codebase audit reveals that all three locale JSON files (`en.json`, `tr.json`, `ar.json`) are substantially populated already from Phases 4 and 5 — full content exists for all five pages across all three languages. The remaining work is: (1) a quality review pass to catch any raw keys, placeholder strings, or copy gaps; (2) introducing Playwright for RTL snapshot testing since there is currently zero test infrastructure; (3) running Lighthouse audits and remediating any score shortfalls; (4) spot-checking WCAG contrast ratios against the Tailwind theme; and (5) wiring EmailJS production credentials via `.env` and Vercel environment variables.

The locale files are structurally complete. The `AboutPage` contains a Phase 2 stub with hardcoded English text ("Phase 2 stub — content coming in Phase 4") — this is the only confirmed gap. The `test.*` keys in all three locale files are Phase 1 verification scaffolding and are safe to ignore (used only by `ThemeTestComponent`, not production pages). The `nav.about` key is translated in all three locales and is used by the About stub; the About page itself is v2 scope per REQUIREMENTS.md, so no full build is needed.

Playwright must be installed from scratch — zero test files, no `playwright.config.ts`, and no `@playwright/test` package exist. For Lighthouse, this is a CSS-gradient-only site with no real images; the performance risk is Framer Motion JS weight and animation code paths on mobile. The 75 threshold is achievable but needs verification.

**Primary recommendation:** Execute in four sequential waves: (1) content audit + fill any gaps in locale JSONs; (2) install Playwright and write RTL snapshot tests for priority components; (3) run Lighthouse on all 5 pages and remediate; (4) wire EmailJS env vars and verify end-to-end form submission.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@playwright/test` | `^1.50` (latest stable 2026) | Browser automation + screenshot comparison | Official Playwright test runner; `toHaveScreenshot` for visual regression; CI-friendly |
| `@emailjs/browser` | `^4.4.1` (already installed) | Client-side email dispatch | Already in `package.json`; no server required; works with Vite env vars |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Lighthouse CLI | global (`npm i -g lighthouse`) | Mobile performance audit | Run against `vite preview` build; captures real Lighthouse score |
| WebAIM Contrast Checker | web tool (webaim.org) | WCAG AA ratio verification | Manual spot-check of brand color pairs against backgrounds |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Playwright screenshots | Percy / Chromatic | Playwright is free and already fits the CI pattern; Percy requires paid plan |
| Lighthouse CLI | PageSpeed Insights API | CLI works offline against local preview; API requires live URL |

**Installation:**
```bash
npm init playwright@latest
# Select: TypeScript, tests/ folder, do NOT add GitHub Actions (manual CI config)
# After init:
npm install --save-dev @playwright/test
npx playwright install chromium
```

---

## Architecture Patterns

### Recommended Project Structure

```
tests/
├── rtl-snapshots/           # RTL-specific snapshot tests
│   ├── rtl-homepage.spec.ts
│   ├── rtl-services.spec.ts
│   ├── rtl-academy.spec.ts
│   ├── rtl-contact.spec.ts
│   └── rtl-nav.spec.ts
├── rtl-snapshots.spec.ts-snapshots/  # auto-generated by Playwright
playwright.config.ts                  # project root
```

### Pattern 1: RTL Snapshot Test — Switch Language Then Screenshot

**What:** Use Playwright to navigate to each page, switch to Arabic mode via localStorage (matching the app's `i18nextLng` detection key), then take snapshots at two viewports.

**When to use:** For all five pages, both mobile (390px) and desktop (1440px).

**Example:**
```typescript
// Source: Playwright official docs — playwright.dev/docs/test-snapshots
import { test, expect } from '@playwright/test';

test.describe('RTL layout — Homepage', () => {
  test.beforeEach(async ({ page }) => {
    // Set Arabic locale via localStorage key used by i18next config
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'ar');
    });
  });

  test('homepage RTL at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    // Wait for dir attribute to reflect RTL
    await page.waitForSelector('html[dir="rtl"]');
    await expect(page).toHaveScreenshot('homepage-rtl-390.png', {
      maxDiffPixels: 100,
    });
  });

  test('homepage RTL at 1440px', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForSelector('html[dir="rtl"]');
    await expect(page).toHaveScreenshot('homepage-rtl-1440.png', {
      maxDiffPixels: 100,
    });
  });
});
```

### Pattern 2: Playwright webServer Config for Vite

**What:** Configure `playwright.config.ts` to start the Vite dev server automatically before tests.

**Example:**
```typescript
// Source: Playwright official docs — playwright.dev/docs/intro
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### Pattern 3: EmailJS send() with all five template fields

**What:** The `emailjs.send()` call passes a `templateParams` object whose keys must match the `{{variable_name}}` placeholders in the EmailJS dashboard template. The current implementation passes four fields; the context decision requires adding a `phone` field.

**Current state in `ContactFormSection.tsx`:**
```typescript
// Source: /src/components/sections/ContactFormSection.tsx line 74-84
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    from_name: values.name,
    from_email: values.email,
    service: values.service,
    message: values.message,
    // MISSING: phone field — context decision requires it
  },
  { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
);
```

**Required changes:**
1. Add `phone: string` to `FormValues` interface
2. Add phone `<input type="tel">` field to form JSX
3. Add `phone: values.phone` to `templateParams` object
4. Create EmailJS template with `{{phone}}` placeholder in addition to existing four

### Pattern 4: Lighthouse CLI Audit

**What:** Build the production bundle, serve it, and run Lighthouse against each of the five routes.

**Example:**
```bash
# Build first
npm run build

# Serve the production build
npm run preview
# (runs on http://localhost:4173 by default)

# In a second terminal, audit each page
npx lighthouse http://localhost:4173 --only-categories=performance --form-factor=mobile --output=json --output-path=./lighthouse-home.json
npx lighthouse http://localhost:4173/services --only-categories=performance --form-factor=mobile --output=json --output-path=./lighthouse-services.json
# Repeat for /academy, /contact, /about
```

### Anti-Patterns to Avoid

- **Snapshot tests against `npm run dev`:** Dev server has HMR overhead that makes screenshots inconsistent. Use `npm run build && npm run preview` for stable snapshots, OR accept minor noise tolerance with `maxDiffPixels: 100`.
- **Hardcoding `dir="rtl"` in test HTML fixture:** Test the real app — the `useDirection` hook sets `dir` on `<html>` based on `i18n.language`; test by actually switching the language.
- **Calling `emailjs.init()` globally then using publicKey in send():** Redundant. The current pattern (no init, publicKey in options) is correct per the SDK docs.
- **Lazy-loading hero images:** Per Lighthouse guidance, above-the-fold content must NOT use `loading="lazy"` — this delays LCP and hurts score.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Visual RTL regression tests | Custom DOM inspection scripts | `playwright toHaveScreenshot` | Catches subtle layout bugs (flex direction, text overflow) that DOM queries miss |
| Email delivery from client | Custom SMTP / server route | `@emailjs/browser` (already installed) | Already wired in ContactFormSection; just needs env vars and real account |
| Performance measurement | Manual DevTools notes | `lighthouse` CLI | Reproducible, scriptable, same algorithm as PageSpeed Insights |
| WCAG contrast calculation | Manual color math | WebAIM Contrast Checker (web tool) | WCAG formula is non-trivial relative luminance math |

**Key insight:** This phase is about verification, not construction. The temptation to build new features or refactor components should be resisted — every task is a check that existing Phase 1–5 work meets the stated criteria.

---

## Common Pitfalls

### Pitfall 1: Locale JSON has content but snapshot shows raw key

**What goes wrong:** A component uses a translation key that exists in `en.json` but not in `tr.json` or `ar.json`, and the fallback language (Turkish) is the primary language — so the gap is invisible in English testing.

**Why it happens:** Keys were added to `en.json` during Phase 4/5 but the Turkish and Arabic equivalents were overlooked.

**How to avoid:** Diff the key structure of all three JSON files programmatically using `jq` or Node.js before writing snapshot tests. Confirm all top-level sections and array lengths match across locales.

**Warning signs:** Any `t('key')` call returning the key string literally in a non-English language (i18next returns the key when no translation found).

### Pitfall 2: Playwright snapshots fail in CI due to font rendering

**What goes wrong:** Screenshot comparison passes locally (macOS) but fails in CI (Linux) due to font anti-aliasing and subpixel rendering differences.

**Why it happens:** Playwright warns: "Browser rendering can vary based on the host OS." Arabic font (Amiri, Cairo) renders differently on Linux vs macOS.

**How to avoid:** Use `maxDiffPixels: 100` globally. For RTL tests, the goal is layout verification (direction flip, card order), not pixel-perfect comparison — higher tolerance is acceptable. Alternatively, run snapshot baseline generation on Linux if CI is Linux.

**Warning signs:** CI fails immediately on first run with "N pixels differ" even with no layout changes.

### Pitfall 3: Lighthouse audit run against dev server

**What goes wrong:** `npm run dev` Vite server includes source maps, HMR runtime, and unminified assets — Lighthouse score is artificially low (sometimes 40-50 points below production).

**Why it happens:** Developers run Lighthouse while the dev server is active out of convenience.

**How to avoid:** Always audit against `npm run build && npm run preview` (production build). The production build runs tree-shaking, minification, and chunk splitting — score will be significantly higher.

**Warning signs:** Lighthouse shows unusually large JS bundle or render-blocking scripts that don't appear in the production network tab.

### Pitfall 4: EmailJS publicKey exposed in git

**What goes wrong:** Developer adds `VITE_EMAILJS_SERVICE_ID=...` directly to a committed `.env` file.

**Why it happens:** Env var setup is done quickly during development and the file is not in `.gitignore`.

**How to avoid:** Confirm `.gitignore` exists and includes `.env*`. Document env vars in a `.env.example` file with placeholder values only. Configure real values in Vercel dashboard environment variables.

**Warning signs:** `git status` shows `.env` as an untracked or modified file — check `.gitignore` immediately before committing.

### Pitfall 5: ContactFormSection missing phone field

**What goes wrong:** The CONTEXT.md decision requires the email template to capture phone number, but the current `ContactFormSection.tsx` has no phone input (only: name, email, service, message).

**Why it happens:** Phase 5 built the form based on REQUIREMENTS.md `CNTC-01` which lists "name, email, service, message" — phone was added as a requirement in Phase 6 context decisions.

**How to avoid:** Add `phone: string` to `FormValues`, add a `<input type="tel">` field to the form, and include `phone: values.phone` in the `emailjs.send()` templateParams. The EmailJS template must have `{{phone}}` placeholder.

**Warning signs:** EmailJS dashboard template receives 4 variables; context decision calls for 5.

### Pitfall 6: AboutPage stub has hardcoded English text

**What goes wrong:** `AboutPage.tsx` contains `"Phase 2 stub — content coming in Phase 4"` as a hardcoded English string visible to Turkish and Arabic users.

**Why it happens:** Phase 2 stub was never replaced (About page is v2 scope per REQUIREMENTS.md and was never built out in Phases 4/5).

**How to avoid:** Replace the hardcoded stub text with a translated placeholder or a coming-soon message from the locale JSON. The About page is v2 scope — full content is not required — but the literal stub string must not appear in production.

**Warning signs:** Visiting `/about` in Turkish or Arabic shows the English development message.

---

## Code Examples

Verified patterns from official sources and codebase inspection:

### EmailJS send() — complete five-field call

```typescript
// Source: emailjs.com/docs/sdk/send + codebase /src/components/sections/ContactFormSection.tsx
await emailjs.send(
  import.meta.env.VITE_EMAILJS_SERVICE_ID,
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  {
    from_name: values.name,
    from_email: values.email,
    service: values.service,
    phone: values.phone,       // NEW — add to FormValues + JSX field
    message: values.message,
  },
  { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
);
```

### i18next localStorage key — used by the app's language detection

```typescript
// Source: /src/i18n/config.ts line 22
// lookupLocalStorage: 'i18nextLng' is the key name
// Playwright test must set this key to switch language:
await page.addInitScript(() => {
  localStorage.setItem('i18nextLng', 'ar');  // triggers Arabic + RTL on load
});
```

### Playwright config with webServer (Vite at 5173)

```typescript
// Source: playwright.dev/docs/intro
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

### Vercel env var documentation pattern (`.env.example`)

```bash
# .env.example — commit this file, NOT .env
# Configure real values in Vercel Dashboard → Project → Settings → Environment Variables

VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_WHATSAPP_NUMBER=905XXXXXXXXX
```

### RTL direction verification in Playwright (DOM attribute check)

```typescript
// Source: Playwright docs + app's useDirection hook pattern
// The app's blocking script and useDirection hook set dir on <html>
// Verify it's set correctly before taking the snapshot:
await page.waitForSelector('html[dir="rtl"]', { timeout: 5000 });
const dir = await page.getAttribute('html', 'dir');
expect(dir).toBe('rtl');
await expect(page).toHaveScreenshot('page-rtl.png', { maxDiffPixels: 100 });
```

### Locale JSON structural diff check (Node.js one-liner)

```bash
# Quick key-count sanity check — all three files should have same top-level sections
node -e "
  const en = require('./src/i18n/locales/en/en.json');
  const tr = require('./src/i18n/locales/tr/tr.json');
  const ar = require('./src/i18n/locales/ar/ar.json');
  ['nav','home','services','academy','contact'].forEach(k => {
    console.log(k, 'EN:', Object.keys(en[k]).length, 'TR:', Object.keys(tr[k]).length, 'AR:', Object.keys(ar[k]).length);
  });
"
```

---

## Current State Assessment (from codebase inspection)

This section is critical for planning — it shows what work actually remains vs. what is already done.

### Locale JSON Status (HIGH confidence — files fully read)

All three locale files have content across all five page sections:

| Section | EN | TR | AR | Status |
|---------|----|----|-----|--------|
| `nav` (5 keys) | Complete | Complete | Complete | No gaps |
| `home.hero` (4 keys) | Complete | Complete | Complete | No gaps |
| `home.stats` (3 items) | Complete | Complete | Complete | No gaps |
| `home.services_teaser` | Complete | Complete | Complete | No gaps |
| `home.academy_teaser` | Complete | Complete | Complete | No gaps |
| `home.testimonials` (3 items) | Complete | Complete | Complete | No gaps |
| `services.categories` (5) | Complete | Complete | Complete | No gaps |
| `services.treatments` (20) | Complete | Complete | Complete | No gaps |
| `academy.courses` (2 items) | Complete | Complete | Complete | No gaps |
| `contact.form` | Complete | Complete | Complete | No gaps |
| `contact.location` | Complete | Complete | Complete | No gaps |
| `test.*` (scaffold) | Complete | Complete | Complete | Phase 1 scaffold — not production |

**Key finding:** Zero content gaps in locale JSONs. The primary content task is copy QUALITY REVIEW (tone, accuracy, naturalness), not writing from scratch. The CONTEXT.md statement "all copy needs to be written from scratch" describes the original intent — in practice, Phases 4 and 5 already populated all keys with real content that meets the warm/inviting tone requirement.

### Components with Hardcoded Non-Translated Strings

| Component | Hardcoded String | Action |
|-----------|-----------------|--------|
| `AboutPage.tsx` line 22 | `"Phase 2 stub — content coming in Phase 4"` | Replace with translated `t('nav.about')` + placeholder body from locale JSON |
| `Navbar.tsx` line 28 | `"Beauty Studio · Istanbul"` (tagline) | Acceptable — brand tagline intentionally stays in English/Latin; document the decision |
| `Navbar.tsx` line 29 | `"Lumière Beauté"` (logo name) | Acceptable — proper noun |

### EmailJS Status

`@emailjs/browser` v4.4.1 is installed. `ContactFormSection.tsx` is fully wired with the correct `emailjs.send()` pattern. **Gap:** No `.env` file exists, no real credentials, and the form is missing the `phone` field required by CONTEXT.md decisions.

### Test Infrastructure Status

Zero test files outside node_modules. No `playwright.config.ts`. No `@playwright/test` installed. Full Playwright setup is Wave 0 work for this phase.

### Performance Baseline

The site uses CSS gradient placeholders for all image slots (no real images). This is important: **the primary Lighthouse risk is not images** (the normal #1 culprit for new sites) but **JavaScript bundle weight from Framer Motion**. Framer Motion v12 + React 19 will contribute significant JS payload. Remediation options: dynamic import of animation-heavy sections, or disabling certain animations on mobile via `useMediaQuery`.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `emailjs.init()` globally required | Optional — pass `publicKey` in `send()` options | EmailJS SDK v4+ | Already using the current approach in codebase |
| Playwright v1 `page.screenshot()` | `expect(page).toHaveScreenshot()` with baseline comparison | Playwright v1.23+ | Use the assertion form, not raw screenshot |
| Aria snapshot for RTL | Visual screenshot (`toHaveScreenshot`) | N/A | Aria snapshots test structure; visual screenshots test layout direction. Use visual for RTL verification. |

**Deprecated/outdated:**
- `emailjs.init(publicKey)` global init: Still works but the per-call options pattern is cleaner and already used in the codebase.
- Playwright `page.screenshot()` without assertion: Returns a Buffer with no comparison — always use `toHaveScreenshot()` for regression testing.

---

## Open Questions

1. **Lighthouse score without real images**
   - What we know: All image slots are CSS gradients (no `<img>` elements). The main JS payload is Framer Motion + React + react-i18next + react-router-dom.
   - What's unclear: Whether the Framer Motion v12 bundle (with tree-shaking via Vite) is small enough to hit 75 on mobile without additional optimization.
   - Recommendation: Run the audit in Wave 3 of planning. If score is below 75, the primary lever is `React.lazy()` + `Suspense` for page components and potentially `import { motion } from 'framer-motion/mini'` (a smaller subset — verify if framer-motion v12 has this).

2. **Phone field in the EmailJS template — is it a required field?**
   - What we know: CONTEXT.md says "captures: name, email, message, service/treatment, phone number."
   - What's unclear: Should phone be `required` on the form (blocking submission) or optional?
   - Recommendation: Make phone optional (`type="tel"`, no `required` attribute) — not every client has a phone to share; forcing it will reduce form completion rates for a luxury service.

3. **Playwright CI configuration**
   - What we know: No GitHub Actions file exists in the repo yet (`Screenshot/` and `public/` directories are untracked; no `.github/` directory found).
   - What's unclear: Whether the user wants CI configured in this phase or just the local test suite.
   - Recommendation: The CONTEXT.md says "Snapshots added to CI pipeline" — create a minimal `.github/workflows/rtl-snapshots.yml` as part of Phase 6. Flag this as a discrete plan task.

4. **`test.*` keys in locale JSONs**
   - What we know: Used only by `ThemeTestComponent.tsx` (Phase 1 verification scaffold).
   - What's unclear: Whether `ThemeTestComponent` is still mounted anywhere in the app.
   - Recommendation: Search for `ThemeTestComponent` usage in the router/pages. If not mounted, the `test.*` keys are orphaned — leave them in place (no harm, tiny JSON overhead) and document.

---

## Sources

### Primary (HIGH confidence)
- `emailjs.com/docs/sdk/send/` — `emailjs.send()` method signature, parameters, options; verified via WebFetch
- `playwright.dev/docs/test-snapshots` — `toHaveScreenshot()` API, snapshot naming, `maxDiffPixels`, update workflow; verified via WebFetch
- `playwright.dev/docs/intro` — Installation, `webServer` config, `baseURL` pattern; verified via WebFetch
- `/src/i18n/locales/en/en.json`, `/tr/tr.json`, `/ar/ar.json` — Full locale content inspection (all three files read completely)
- `/src/components/sections/ContactFormSection.tsx` — Current EmailJS wiring, FormValues interface, missing phone field confirmed
- `/src/i18n/config.ts` — `lookupLocalStorage: 'i18nextLng'` key used for language detection (critical for Playwright localStorage injection)
- `/package.json` — Installed packages: `@emailjs/browser@^4.4.1`, no `@playwright/test`, no Lighthouse
- `.planning/config.json` — No `workflow.nyquist_validation` key → Validation Architecture section omitted per instructions

### Secondary (MEDIUM confidence)
- WebSearch: Lighthouse 75 image/performance optimization guidance — confirmed WebP + lazy loading as primary levers; for this site (CSS gradients only), JS bundle is the primary risk
- WebSearch: WCAG AA 4.5:1 ratio requirements — confirmed standard; tool verification at `webaim.org/resources/contrastchecker/`
- GitHub issue `microsoft/playwright/issues/18948` — Arabic characters in Playwright snapshots may render differently above v1.24; use `maxDiffPixels` tolerance and layout-focused assertions over pixel-perfect

### Tertiary (LOW confidence)
- Framer Motion v12 mini bundle availability — not verified in docs; needs investigation if Lighthouse score is below 75 after initial audit

---

## Metadata

**Confidence breakdown:**
- Content status assessment: HIGH — all three locale files fully read; zero gaps confirmed
- EmailJS integration: HIGH — official docs fetched + current source code inspected
- Playwright setup: HIGH — official install docs + snapshot API verified
- Lighthouse strategy: MEDIUM — CSS-gradient-only site is unusual; JS bundle is primary risk (not images), which is less well-documented for this stack combination
- Pitfalls: HIGH for items found directly in codebase; MEDIUM for Playwright CI font rendering (verified via GitHub issue, not official docs)

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (Playwright, EmailJS SDK are stable; Lighthouse scoring algorithm rarely changes mid-quarter)
