# Stack Research

**Domain:** Premium multilingual beauty center and academy website (SPA)
**Researched:** 2026-02-24
**Confidence:** HIGH — All versions verified via npm registry; patterns verified via official docs and multiple credible sources

---

## Recommended Stack

### Core Technologies (Already Decided — Verified)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.4 | UI component framework | Industry standard for SPAs; hooks-first, concurrent mode; best ecosystem for animation + i18n integration |
| Vite | 7.3.1 | Build tool and dev server | Near-instant HMR, native ESM, 3-10x faster than Webpack; first-class React support via `@vitejs/plugin-react` |
| Tailwind CSS | 4.2.1 | Utility-first CSS | v4 is CSS-first (no config file), built-in logical properties for RTL, native dark mode via CSS variables — critical for this project |
| motion (formerly framer-motion) | 12.34.3 | Animation library | Rebranded Nov 2024 as independent `motion` package; use `import { motion } from "motion/react"`. Same codebase, new package name. Hybrid engine delivers 120fps via Web Animations API + ScrollTimeline |
| React Router | 7.13.1 | Client-side routing | v7 merged with Remix patterns; "library mode" (BrowserRouter) is the right choice here since this is a pure SPA with no SSR |
| react-i18next | 16.5.4 | i18n framework | Official React binding for i18next; hooks-based (`useTranslation`), lazy namespace loading, TypeScript support; supports `i18n.dir()` for RTL switching |
| i18next | 25.8.13 | i18n core engine | Pairs with react-i18next; provides `dir()` method, language detection, fallback chains, and JSON namespace loading |

**Critical version note:** `motion` and `framer-motion` are now the same npm package at version 12.34.3 (they publish to both names). Use `motion` as the canonical install name and `import { motion, useScroll, useTransform, AnimatePresence } from "motion/react"` going forward.

**Critical Tailwind note:** Tailwind v4 no longer uses `tailwind.config.js`. All theme customization (including the 10-color palette and dark mode) happens via `@theme` blocks in your CSS file. Install via `@tailwindcss/vite` Vite plugin, not the PostCSS plugin.

---

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| i18next-browser-languageDetector | 8.2.1 | Auto-detect browser language | Always — needed for "browser language auto-detection with Turkish fallback" requirement |
| @emailjs/browser | 4.4.1 | Contact form email sending | On Contact page — use `@emailjs/browser` (the current package); NOT the deprecated `emailjs-com` package |
| react-hook-form | 7.71.2 | Form state and validation | On Contact page booking form; minimal re-renders, TypeScript-native, pairs perfectly with Zod |
| @hookform/resolvers | 5.2.2 | Zod/Yup resolver bridge for react-hook-form | Use with react-hook-form to plug in Zod schema validation |
| zod | 4.3.6 | Schema validation | Define booking form schema (name, phone, email, service, message) with type-safe validation; Zod 4 is faster and smaller than v3 |
| lenis | 1.3.17 | Smooth scroll momentum | Wraps the browser's native scroll to provide butter-smooth inertia scrolling that syncs with `motion`'s `useScroll`. Note: requires careful integration to avoid conflicting animation loops |
| @tailwindcss/vite | 4.2.1 | Tailwind CSS Vite plugin | Required for v4 — replaces the PostCSS approach; add as Vite plugin, not PostCSS |

---

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| TypeScript | 5.9.3 | Type safety | Use `react-ts` Vite template. Catches RTL/i18n integration bugs early. Required for Zod + react-hook-form type inference |
| @vitejs/plugin-react | 5.1.4 | React Fast Refresh in Vite | Standard plugin for React + Vite; use over `@vitejs/plugin-react-swc` unless build speed is critical — SWC variant has slightly less mature TS decorator support |
| ESLint | flat config (`eslint.config.js`) | Code linting | Use flat config format (v9+); add `eslint-plugin-react`, `eslint-plugin-react-hooks`, `@typescript-eslint/eslint-plugin` |
| Prettier | Latest | Code formatting | Single config file, consistent formatting across team |

---

## RTL Architecture Pattern (Critical for Arabic)

The RTL implementation requires coordinated changes across three layers:

**1. Direction switching via react-i18next:**
```typescript
// On language change:
document.documentElement.dir = i18n.dir(); // returns "rtl" or "ltr"
document.documentElement.lang = i18n.language; // "ar", "tr", "en"
```

**2. Tailwind v4 logical properties (use everywhere, no exceptions):**
```html
<!-- Instead of pl-4 pr-2 use: -->
<div class="ps-4 pe-2">   <!-- ps = padding-start, pe = padding-end -->
<div class="ms-4 me-2">   <!-- ms = margin-start, me = margin-end -->
```
Tailwind v4's logical properties automatically flip when `dir="rtl"` is set on `<html>`.

**3. Motion animation direction mirroring:**
```typescript
// Detect RTL and flip animation directions
const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";

// Use conditional animation variants
const slideVariants = {
  hidden: { x: isRTL ? 100 : -100, opacity: 0 },
  visible: { x: 0, opacity: 1 }
}
```

**4. Arabic font size compensation:**
Arabic text at the same `font-size` as Latin appears visually smaller. Add 20-25% font size increase for Arabic:
```css
:lang(ar) {
  font-size: 1.2em; /* or use Tailwind's [lang=ar]:text-xl pattern */
  line-height: 1.8;
}
```

---

## Font Strategy

| Font | Purpose | Arabic Equivalent |
|------|---------|-------------------|
| Cormorant Garamond | Headings (luxury serif) | Cairo or Tajawal (Google Fonts) — geometric, modern Arabic sans-serif that pairs well with luxury Latin serifs |
| Inter | Body text (readable sans-serif) | Noto Sans Arabic — extensive weight range, designed for readability at all sizes |

Load via Google Fonts with `display=swap`. Subset to only the weights you use (e.g., 300, 400, 600 for Inter).

---

## Dark Mode Configuration (Tailwind v4)

No `tailwind.config.js`. All config lives in CSS:

```css
@import "tailwindcss";

@theme {
  /* The 10-color teal palette */
  --color-celadon-100: #99e2b4;
  --color-celadon-200: #88d4ab;
  --color-mint-leaf-300: #78c6a3;
  --color-mint-leaf-400: #67b99a;
  --color-seagrass-500: #56ab91;
  --color-seagrass-600: #469d89;
  --color-jungle-teal-700: #358f80;
  --color-blue-spruce-800: #248277;
  --color-deep-ocean-900: #14746f;
  --color-stormy-teal-950: #036666;
}

/* Dark mode toggle via class strategy */
@custom-variant dark (&:where(.dark, .dark *));
```

Use class-based dark mode toggle (add/remove `dark` class on `<html>`) — this gives manual toggle control over the light/dark switch requirement.

---

## Installation

```bash
# Create project with React + TypeScript template
npm create vite@latest lumiere-beaute -- --template react-ts

# Core animation and routing
npm install motion react-router-dom

# i18n stack
npm install react-i18next i18next i18next-browser-languagedetector

# Form stack
npm install react-hook-form @hookform/resolvers zod @emailjs/browser

# Smooth scroll
npm install lenis

# Tailwind v4 with Vite plugin (replaces postcss approach)
npm install tailwindcss @tailwindcss/vite

# Dev dependencies
npm install -D typescript @vitejs/plugin-react @types/react @types/react-dom
```

**vite.config.ts setup for v4:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

**main.css (replaces old @tailwind directives):**
```css
@import "tailwindcss";
/* @theme block for custom colors here */
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `motion` (npm) | `framer-motion` (npm) | Both resolve to the same code at v12.34.3. Prefer `motion` + `motion/react` imports for future-proofing |
| Tailwind CSS v4 | Tailwind CSS v3 | Use v3 only if you have legacy PostCSS config or plugins not yet updated for v4. For a greenfield project, v4 is the right choice |
| react-hook-form + Zod | Formik | Formik is heavier, slower re-render pattern, and less TypeScript-native. react-hook-form is the 2025 standard |
| i18next-browser-languageDetector | Custom detection | Use custom only if you need server-side language negotiation. For browser-only SPA, the detector package handles all cases |
| lenis | GSAP ScrollSmoother | GSAP requires paid license for commercial use. Lenis is MIT and integrates cleanly with `motion`'s `useScroll` |
| Zod 4 | Yup | Yup has a larger API surface but weaker TypeScript inference. Zod 4 is faster, smaller, and TypeScript-first |
| Vercel | Netlify | Both are equivalent for Vite SPA deployment. Vercel requires `vercel.json` rewrite rule for SPA routing. Either works |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `emailjs-com` (old package) | Deprecated; last updated 2021; superseded by `@emailjs/browser` | `@emailjs/browser@4.4.1` |
| `tailwindcss-rtl` (plugin) | Only needed for Tailwind v2/v3; v4 has native logical properties built in | Tailwind v4 logical properties (`ps-`, `pe-`, `ms-`, `me-`) |
| CSS `direction` property | MDN recommends HTML `dir` attribute instead; mixing both causes specificity issues | `<html dir="rtl">` set via `document.documentElement.dir` |
| Hardcoded `text-left`/`text-right` | Breaks RTL — these are physical properties that do not flip | Use `text-start`/`text-end` (logical) in Tailwind v4 |
| `@emotion` or `styled-components` | Conflicts with Tailwind utility approach; adds runtime overhead; unnecessary for this project | Tailwind CSS v4 + CSS variables |
| `next-i18next` | Only for Next.js (SSR). This is a Vite SPA, not Next.js | `react-i18next` + `i18next-browser-languagedetector` |
| GSAP (free tier) | GSAP has commercial license restrictions. The `motion` library handles all the required effects (parallax, scroll-linked animations, page transitions, text typing) | `motion` (MIT licensed) |
| Any UI component kit (MUI, Chakra, shadcn) | Project requirement is "no generic UI kit feel — every section must feel intentional." Kits impose visual opinions that fight the brand system | Custom components with Tailwind v4 |

---

## Stack Patterns by Variant

**For page transitions (cinematic full-screen):**
- Use `<AnimatePresence>` from `motion/react` wrapping `<Routes>` in React Router
- Pair with `motion.div` exit/enter variants on each page component
- Use `mode="wait"` on AnimatePresence to complete exit before enter

**For scroll-linked parallax (hero sections):**
- Use `useScroll` + `useTransform` from `motion/react`
- Integrate Lenis to provide smooth scroll momentum before passing to `useScroll`

**For RTL animation direction mirroring:**
- Read `i18n.dir()` in a custom hook `useDirection()`
- Pass isRTL flag to animation variants — flip `x` values when RTL

**For text typing/typewriter effects:**
- Use `motion`'s `animate` prop with character-level stagger variants — no external typewriter library needed

**For category filtering (Services page):**
- Use `AnimatePresence` with `layoutId` for smooth item transitions when filter changes
- Avoid full re-mounts; use Motion's layout animation system

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `motion@12.34.3` | `react@19.x`, `react@18.x` | Peer deps accept `^18.0.0 \|\| ^19.0.0` — verified via npm |
| `react-i18next@16.5.4` | `i18next@25.x` | i18next v25 is the required peer; v16.5.4 requires i18next ≥25 (breaking from v15.7.2 which required v23+) |
| `react-hook-form@7.71.2` | `@hookform/resolvers@5.2.2` | Must use resolvers v5 with RHF v7 — they version-lock |
| `tailwindcss@4.2.1` | `@tailwindcss/vite@4.2.1` | Same version number — always update together |
| `react-router-dom@7.13.1` | `react@18+`, `react@19+` | RR v7 requires Node 20, React 18 as minimum |
| `lenis@1.3.17` | `motion@12.x` | Lenis and `useScroll` integration requires calling `lenis.on('scroll', ScrollTrigger.update)` pattern — see Lenis docs for RAF (requestAnimationFrame) setup |

---

## Sources

- npm registry (live query, 2026-02-24) — All version numbers verified via `npm show [package] version`
- [motion.dev — Official Motion docs (formerly Framer Motion)](https://motion.dev/docs/react-installation) — package name, import path, ScrollTimeline API
- [motion.dev blog — Framer Motion → Motion rebranding announcement](https://motion.dev/blog/framer-motion-is-now-independent-introducing-motion) — MEDIUM confidence (page content partially blocked but corroborated by npm data)
- [Tailwind CSS v4 Official Blog Post](https://tailwindcss.com/blog/tailwindcss-v4) — CSS-first config, @theme, logical properties, @tailwindcss/vite — HIGH confidence
- [Tailwind CSS upgrade guide](https://tailwindcss.com/docs/upgrade-guide) — v3→v4 migration, breaking changes — HIGH confidence
- [react-i18next docs](https://react.i18next.com/) — i18n.dir() RTL switching — HIGH confidence
- [i18next-browser-languageDetector GitHub](https://github.com/i18next/i18next-browser-languageDetector) — fallback language configuration — HIGH confidence
- [EmailJS React official docs](https://www.emailjs.com/docs/examples/reactjs/) — @emailjs/browser package — HIGH confidence
- [madrus4u.vercel.app RTL implementation guide](https://madrus4u.vercel.app/blog/rtl-implementation-guide) — Tailwind RTL logical properties pattern — MEDIUM confidence
- [WebSearch: react-hook-form + Zod 2025 patterns](https://react-hook-form.com/) — MEDIUM confidence (multiple sources agree)
- [WebSearch: Lenis + Framer Motion integration](https://github.com/darkroomengineering/lenis) — MEDIUM confidence (official GitHub corroborates)
- [Google Fonts — Cairo, Tajawal, Noto Sans Arabic](https://fonts.google.com/) — Arabic font recommendations — MEDIUM confidence

---

*Stack research for: Premium multilingual beauty center & academy website (Lumiere Beaute)*
*Researched: 2026-02-24*
