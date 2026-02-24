# Phase 1: Foundation - Research

**Researched:** 2026-02-24
**Domain:** Tailwind v4 color system, dark/light theming, i18n infrastructure, RTL direction, Google Fonts, CSS gradient placeholders
**Confidence:** HIGH — all critical claims verified via official docs or Context7; project-specific state verified by reading actual project files

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FNDTN-01 | User sees consistent teal-green color system across all pages (10 named colors via Tailwind v4 @theme) | Tailwind v4 @theme directive + --color-* namespace creates utilities automatically; color token definitions documented in Standard Stack |
| FNDTN-02 | User can toggle between light mode (warm ivory) and dark mode (forest-at-dusk teal), preference persists across sessions | ThemeProvider + localStorage + @custom-variant dark + blocking inline script in index.html; patterns in Code Examples |
| FNDTN-03 | User can switch between Turkish, English, and Arabic via language selector | i18next + react-i18next + i18next-browser-languagedetector; i18n/config.ts with bundled resources; Architecture Patterns section |
| FNDTN-04 | Arabic users see fully mirrored RTL layout | document.documentElement.dir = i18n.dir(); Tailwind logical properties (ms-, me-, ps-, pe-); enforced from first component |
| FNDTN-05 | User's browser language is auto-detected on first visit, falling back to Turkish | i18next-browser-languagedetector with detection order + fallbackLng: 'tr' + supportedLngs: ['tr', 'en', 'ar'] |
| FNDTN-08 | User sees Cormorant Garamond headings, Inter body text, and appropriate Arabic typeface for AR content | Google Fonts @import with display=swap; @theme --font-display / --font-body; :lang(ar) CSS rule for Arabic font + size compensation |
| FNDTN-09 | All image slots display CSS gradient placeholders that match the brand aesthetic | CSS linear-gradient utility classes or custom gradient classes using brand teal tokens; no img tags in Phase 1 |
</phase_requirements>

---

## Summary

Phase 1 establishes the invisible but critical foundation that every subsequent phase builds on: the Tailwind v4 color token system, manual dark/light theming with persistence, the i18n infrastructure with browser language detection, RTL direction switching, brand typography, and the CSS gradient placeholder system.

The project is a fresh Vite scaffold. Tailwind 4.2.1 and framer-motion 12.34.3 are already installed as dependencies but Tailwind is NOT yet wired up — `@tailwindcss/vite` is missing from `vite.config.js` and there is no `@import "tailwindcss"` in any CSS file. The i18n stack (i18next, react-i18next, i18next-browser-languagedetector) is not yet installed. Phase 1 must install these packages, wire up the Vite plugin, define the color system, set up theming and i18n, and produce verifiable output.

The key architectural decisions are already locked per the project STATE.md and ARCHITECTURE research: use Tailwind v4 @theme for colors (no tailwind.config.js), class-based dark mode via @custom-variant, i18next with bundled JSON resources (no HTTP backend), i18next-browser-languagedetector with Turkish fallback, Google Fonts for Cormorant Garamond + Inter + Noto Sans Arabic, and CSS gradients for image slots. RTL enforcement via Tailwind logical properties is mandatory from the very first utility class written.

**Primary recommendation:** Wire up @tailwindcss/vite, define @theme color tokens, install i18n stack, create ThemeProvider + i18n config, add blocking script to index.html, load fonts via Google Fonts @import, and write a ThemeTestComponent that exercises all 10 colors + both modes + all 3 languages to confirm success before declaring Phase 1 done.

---

## Current Project State (CRITICAL — Read Before Planning)

This is what exists right now. Plans MUST account for what is already present vs what needs to be created.

| File / Config | Current State | Action Needed |
|---------------|---------------|---------------|
| `package.json` dependencies | `react@19.2.0`, `react-dom@19.2.0`, `framer-motion@12.34.3`, `react-router-dom@7.13.1`, `zod` | Already installed |
| `tailwindcss@4.2.1` | Installed as devDependency | Present but NOT wired to Vite |
| `@tailwindcss/vite` | NOT installed | Must install |
| `i18next`, `react-i18next`, `i18next-browser-languagedetector` | NOT installed | Must install |
| `vite.config.js` | Only has `@vitejs/plugin-react` plugin | Must add `tailwindcss()` plugin |
| `src/index.css` | Vite scaffold CSS (system-ui font, no Tailwind) | Replace with `@import "tailwindcss"` + @theme block |
| `src/App.jsx` | Vite default counter component | Replace with ThemeTestComponent for Phase 1 |
| `src/main.jsx` | Mounts `<App />` in StrictMode | Stays as entry point; AppProviders wraps App |
| `index.html` | Static, no blocking script, lang="en" | Add blocking script for dark mode + language detection |
| `src/App.css` | Vite scaffold CSS | Delete or clear — not needed |
| i18n locale JSON files | None exist | Create src/i18n/locales/tr/common.json, en/common.json, ar/common.json |
| ThemeProvider | Does not exist | Create src/providers/ThemeProvider.tsx |
| i18n config | Does not exist | Create src/i18n/config.ts |

---

## Standard Stack

### Core (Phase 1 specific)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.1 (installed) | CSS utility framework + color token system | v4 CSS-first approach; @theme defines brand tokens directly in CSS; no config file |
| @tailwindcss/vite | 4.2.1 | Tailwind v4 Vite plugin | Required for v4 — replaces PostCSS integration; same version as tailwindcss |
| i18next | 25.8.13 | i18n core engine | Provides `dir()` method, language detection, fallback chains, bundled resources |
| react-i18next | 16.5.4 | React bindings for i18next | Hooks-based useTranslation(), I18nextProvider, TypeScript support |
| i18next-browser-languagedetector | 8.2.1 | Browser language auto-detection | Reads navigator.language, localStorage, cookie; provides detect order config |

### Supporting (already installed)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| framer-motion | 12.34.3 | Animation (installed as `framer-motion`) | Import via `import { motion } from "framer-motion"` — already installed, use in Phase 2 |
| react-router-dom | 7.13.1 | Client-side routing | Already installed; wired up in Phase 2 |
| zod | (installed) | Schema validation | Used in Phase 5 contact form |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @tailwindcss/vite plugin | tailwindcss PostCSS plugin | PostCSS approach is v3-era; v4 recommends Vite plugin for Vite projects — use @tailwindcss/vite |
| Bundled i18n resources (inline JSON) | i18next-http-backend | HTTP backend adds async latency causing flash of untranslated keys; bundled resources are synchronous and files are small enough to bundle |
| class-based dark mode | media-query dark mode | Media-query mode cannot be toggled manually; class-based is required for user preference toggle |
| data-theme attribute dark mode | class-based dark mode | Both work identically; class-based is more commonly referenced in docs and community examples |

**Installation (what needs to be added):**
```bash
npm install @tailwindcss/vite i18next react-i18next i18next-browser-languagedetector
```

Note: `tailwindcss@4.2.1` is already installed. The `@tailwindcss/vite` package must match the tailwindcss version — install `@tailwindcss/vite@4.2.1` explicitly.

---

## Architecture Patterns

### Recommended Project Structure (Phase 1 creates)

```
src/
├── i18n/
│   ├── config.ts                    # i18next init with bundled resources + detector
│   └── locales/
│       ├── tr/
│       │   └── common.json          # Phase 1: nav strings + test strings only
│       ├── en/
│       │   └── common.json
│       └── ar/
│           └── common.json
├── providers/
│   ├── AppProviders.tsx             # Composes ThemeProvider + I18nextProvider
│   └── ThemeProvider.tsx            # Dark/light context + localStorage
├── hooks/
│   ├── useTheme.ts                  # Consumes ThemeContext → { theme, toggleTheme }
│   └── useDirection.ts             # Derives { dir, isRTL } from i18n.language
├── styles/
│   └── globals.css                  # @import "tailwindcss" + @theme + @custom-variant
└── components/
    └── ThemeTestComponent.tsx       # Phase 1 verification component (temporary)
```

Files modified at project root level:
- `vite.config.js` → add `tailwindcss()` Vite plugin
- `index.html` → add blocking inline script, Google Fonts preconnect + preload, lang attribute
- `src/main.jsx` → wrap App in AppProviders
- `src/index.css` → replace with `@import "./styles/globals.css"` or inline globals

### Pattern 1: Tailwind v4 @theme Color Token System

**What:** Define all 10 brand teal colors as CSS custom properties under the `--color-*` namespace inside an `@theme` block in the main CSS file. Tailwind v4 automatically generates all color utility classes (bg-, text-, border-, etc.) from these tokens.

**When to use:** All color usage across the entire project. Never use raw hex values in JSX — always use Tailwind utility classes that reference the theme tokens.

**Example:**
```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* 10-color teal-green brand palette */
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

  /* Semantic tokens for light/dark mode backgrounds */
  --color-surface-light: #F4FAF7;
  --color-surface-dark: #082F2D;
  --color-surface-dark-alt: #0C4744;

  /* Typography */
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-arabic: "Noto Sans Arabic", sans-serif;
}

/* Class-based dark mode — class on <html> element */
@custom-variant dark (&:where(.dark, .dark *));
```

After this, these classes work automatically:
- `bg-celadon-100`, `text-seagrass-500`, `border-stormy-teal-950`
- `font-display` (maps to Cormorant Garamond), `font-body` (maps to Inter)
- `dark:bg-surface-dark`, `dark:text-celadon-100`

**Source:** https://tailwindcss.com/docs/theme (HIGH confidence — official docs)

---

### Pattern 2: Vite Config with @tailwindcss/vite Plugin

**What:** Replace the current vite.config.js to add the Tailwind v4 Vite plugin. The CSS file only needs `@import "tailwindcss"` — no PostCSS config, no tailwind.config.js.

**When to use:** Required before any Tailwind utility class will work.

**Example:**
```typescript
// vite.config.js (updated)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

**Source:** https://tailwindcss.com/docs/installation (HIGH confidence — official Tailwind docs)

---

### Pattern 3: Blocking Inline Script for Flash Prevention (index.html)

**What:** A synchronous script tag in `<head>` before any stylesheet that reads localStorage and applies the `dark` class and `dir` attribute to `<html>` before the browser paints. This is the only reliable way to prevent flash of wrong theme or direction.

**When to use:** Must be in index.html, BEFORE the stylesheet link. Runs synchronously during HTML parse — no async, no defer.

**Example:**
```html
<!-- index.html -->
<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- BLOCKING: must run before CSS paints to prevent FOUC -->
    <script>
      (function() {
        // Theme: restore from localStorage or use system preference
        var saved = localStorage.getItem('theme');
        if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }

        // Language + direction: restore from localStorage
        var lang = localStorage.getItem('i18nextLng') || 'tr';
        if (['tr', 'en', 'ar'].indexOf(lang) === -1) lang = 'tr';
        document.documentElement.lang = lang;
        document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
      })();
    </script>

    <!-- Google Fonts preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <!-- Font loading: only needed weights, display=swap to avoid render block -->
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@400;500&family=Noto+Sans+Arabic:wght@400;500&display=swap" rel="stylesheet" />

    <title>Lumiere Beaute</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Source:** CSS-Tricks Dark Mode Guide + verified against PITFALLS.md (HIGH confidence)

---

### Pattern 4: ThemeProvider with localStorage Persistence

**What:** A React context provider that owns dark/light mode state, reads initial value from localStorage on mount (as secondary confirmation to the blocking script), and writes back when toggled.

**When to use:** Wraps the entire app in AppProviders. The single source of truth for theme state in React.

**Example:**
```typescript
// src/providers/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
interface ThemeContextType { theme: Theme; toggleTheme: () => void; }

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Read from localStorage — blocking script already applied class,
    // this syncs React state to match what's already on the DOM
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
```

**Source:** ARCHITECTURE.md Pattern 3 + official Tailwind dark mode docs (HIGH confidence)

---

### Pattern 5: i18next Configuration with Bundled Resources

**What:** Initialize i18next with translation JSON files imported directly (not via HTTP). Use i18next-browser-languagedetector to auto-detect browser language, configured with Turkish fallback for any unsupported language.

**When to use:** Always. Avoids async loading delay that causes flash of untranslated keys. Files are small enough to bundle for this project.

**Example:**
```typescript
// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import trCommon from './locales/tr/common.json';
import enCommon from './locales/en/common.json';
import arCommon from './locales/ar/common.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: trCommon },
      en: { common: enCommon },
      ar: { common: arCommon },
    },
    defaultNS: 'common',
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'ar'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
  });

export default i18n;
```

**Source:** i18next official docs + i18next-browser-languagedetector GitHub (HIGH confidence)

---

### Pattern 6: useDirection Hook (RTL/LTR)

**What:** A custom hook that derives `dir` and `isRTL` from the current i18n language and also imperatively sets `document.documentElement.dir` and `.lang` when language changes.

**When to use:** Called in RootLayout (Phase 2) for DOM attribute updates. Also used by animation variants in Phase 3. Defined in Phase 1 so it's available from the start.

**Example:**
```typescript
// src/hooks/useDirection.ts
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useDirection() {
  const { i18n } = useTranslation();
  const dir = i18n.dir(i18n.language) as 'ltr' | 'rtl';
  const isRTL = dir === 'rtl';

  useEffect(() => {
    // Keep DOM in sync whenever language changes
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, dir]);

  return { dir, isRTL };
}
```

**Note:** Always call `i18n.dir(i18n.language)` with the language argument explicitly — omitting it can return undefined in some i18next versions.

**Source:** ARCHITECTURE.md + react-i18next docs (HIGH confidence)

---

### Pattern 7: CSS Gradient Placeholders for Image Slots

**What:** Use CSS `background-image: linear-gradient(...)` with brand teal colors to fill any element that would otherwise show an image. Applied as a Tailwind utility class or custom CSS class. No `<img>` tags or broken image icons.

**When to use:** Any component that will eventually have a real image. In Phase 1, implement the base gradient classes. In Phase 4+, apply them to hero backgrounds, service cards, team member photos, etc.

**Example:**
```css
/* In globals.css, after @import "tailwindcss" and @theme */

/* Reusable gradient placeholder pattern */
.placeholder-gradient-primary {
  background-image: linear-gradient(
    135deg,
    var(--color-seagrass-500) 0%,
    var(--color-deep-ocean-900) 100%
  );
}

.placeholder-gradient-card {
  background-image: linear-gradient(
    160deg,
    var(--color-mint-leaf-300) 0%,
    var(--color-jungle-teal-700) 60%,
    var(--color-stormy-teal-950) 100%
  );
}

.placeholder-gradient-hero {
  background-image: linear-gradient(
    180deg,
    var(--color-celadon-100) 0%,
    var(--color-seagrass-600) 50%,
    var(--color-deep-ocean-900) 100%
  );
}
```

These gradient classes use the CSS custom properties generated by `@theme`, so they automatically update if token values change.

**Source:** REQUIREMENTS.md FNDTN-09 + CSS gradient specification (HIGH confidence)

---

### Pattern 8: Arabic Font Size Compensation

**What:** Arabic text appears visually smaller and thinner than Latin text at the same font-size. A CSS rule targeting `[dir="rtl"]` or `:lang(ar)` adds 20-25% font size and increases line-height.

**When to use:** Applied globally in globals.css so all Arabic body text automatically compensates.

**Example:**
```css
/* In globals.css */
:lang(ar) {
  font-family: var(--font-arabic); /* Noto Sans Arabic */
  font-size: 1.2em;
  line-height: 1.8;
}

/* For headings in Arabic — Cormorant Garamond doesn't cover Arabic glyphs */
/* So Arabic headings fall through to the Arabic body font at larger size */
:lang(ar) h1,
:lang(ar) h2,
:lang(ar) h3 {
  font-family: var(--font-arabic);
  font-weight: 600;
  letter-spacing: 0; /* Arabic doesn't use letter-spacing */
}
```

**Source:** PITFALLS.md + UAE Design System typography guidelines (HIGH confidence)

---

### Anti-Patterns to Avoid

- **Using physical Tailwind classes:** Never `ml-4`, `pr-8`, `left-0`. Always `ms-4`, `pe-8`, `start-0`. Enforce from the very first Tailwind class written in Phase 1.
- **Using tailwind.config.js:** Tailwind v4 is CSS-first. The config file approach is v3. All customization goes in `@theme` blocks in CSS.
- **Using PostCSS approach for Tailwind v4:** The `@tailwindcss/vite` Vite plugin replaces the PostCSS integration. Do not create `postcss.config.js`.
- **Importing translations from JSON inside components:** All translation access goes through `useTranslation()`. Components never import locale JSON files directly.
- **Hardcoding any strings:** The `src/main.jsx` script type should reference `main.jsx` — currently the project uses `.jsx` extensions, not `.tsx`. Match the existing pattern unless converting to TypeScript is an explicit task.
- **Toggling dark class on a wrapper div:** The `dark` class must be on `document.documentElement` (the `<html>` element). Tailwind's `dark:` variant only activates when the class is on an ancestor of all styled elements.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Browser language detection | Custom navigator.language parsing | i18next-browser-languagedetector | Handles navigator, localStorage, cookie, path, subdomain; edge cases around locale variants (e.g., "ar-SA" → "ar") |
| Dark mode FOUC prevention | React useState + useEffect for initial theme | Blocking inline `<script>` in index.html | React mounts after HTML parse; any React-based approach fires too late and causes flash |
| CSS variable color system | Inline style prop with hex values | Tailwind v4 @theme tokens | @theme generates all utility classes automatically; arbitrary values can't be composed with dark: or responsive variants cleanly |
| RTL layout mirroring | Manual rtl: Tailwind variants on every element | CSS logical properties (ms-, me-, ps-, pe-) | Logical properties flip automatically on dir="rtl"; manual rtl: variants double the class count and are easy to miss |
| Language direction detection in React | Custom hook parsing html.dir attribute | `i18n.dir(i18n.language)` from react-i18next | i18next knows which languages are RTL; always returns 'rtl' or 'ltr' correctly |
| Font loading performance | Self-hosting fonts | Google Fonts with preconnect + display=swap | Acceptable for this project scale; display=swap prevents render blocking |

**Key insight:** The FOUC prevention for both dark mode and language direction is the single most-missed detail in this phase. It cannot be solved with React — it MUST be a synchronous blocking script in the HTML head.

---

## Common Pitfalls

### Pitfall 1: @tailwindcss/vite Not Installed or Not in Vite Config

**What goes wrong:** Tailwind CSS is installed but no utility classes work. `bg-seagrass-500` renders with no styles. No error is thrown — classes are simply ignored.

**Why it happens:** Tailwind 4.2.1 is already a devDependency in this project's package.json. Developers assume it's wired up because it's installed. But `@tailwindcss/vite` is a separate package and it's NOT installed. The `vite.config.js` doesn't include the plugin.

**How to avoid:** Install `@tailwindcss/vite@4.2.1` AND add `tailwindcss()` to the plugins array in vite.config.js. Then confirm `@import "tailwindcss"` is in the CSS entry point.

**Warning signs:** Tailwind classes in JSX do nothing; no generated CSS visible in DevTools for any tw- utility.

---

### Pitfall 2: Using framer-motion Import Path vs motion/react

**What goes wrong:** The project has `framer-motion` installed (not `motion`). The STACK.md recommends `import { motion } from "motion/react"` but the installed package is `framer-motion`. Using the wrong import path causes a module not found error.

**Why it happens:** In late 2024, the `motion` library was rebranded and publishes to both `motion` and `framer-motion` npm names. The installed package in this project is `framer-motion`. The `motion/react` import subpath exists on the `motion` package name, not on `framer-motion` by default.

**How to avoid:** Since `framer-motion` is already installed and not `motion`, use `import { motion, AnimatePresence } from "framer-motion"` — not `from "motion/react"`. Alternatively, uninstall `framer-motion` and install `motion` instead for forward compatibility. Verify by checking what's in node_modules.

**Confirmed state:** `framer-motion@12.34.3` is in node_modules. Use `from "framer-motion"` imports.

---

### Pitfall 3: i18n.dir() Called Without Language Argument

**What goes wrong:** RTL detection returns undefined or the wrong value when `i18n.dir()` is called without an argument in some i18next versions.

**Why it happens:** The `dir()` method signature allows an optional language parameter. Without it, some implementations return undefined if the instance language hasn't been set yet.

**How to avoid:** Always call `i18n.dir(i18n.language)` with the explicit language code. In the useDirection hook, use `i18n.dir(i18n.language)`.

---

### Pitfall 4: Flash of Wrong Theme/Direction on Reload

**What goes wrong:** Page loads showing light mode briefly before switching to dark, or shows LTR briefly before switching to RTL for Arabic users. Destroys the luxury brand first impression.

**Why it happens:** React mounts after the HTML is parsed and painted. Any theme or direction logic inside React components (useState, useEffect) fires too late.

**How to avoid:** The blocking inline `<script>` in index.html's `<head>` (Pattern 3 above) is mandatory. It reads localStorage synchronously during HTML parse before any paint.

---

### Pitfall 5: Cormorant Garamond Has No Arabic Glyphs

**What goes wrong:** Setting `font-family: "Cormorant Garamond"` globally makes Arabic headings fall back to the browser default (Times New Roman or similar). Arabic text in headings looks out of place and broken.

**Why it happens:** Cormorant Garamond covers Latin, Greek, Cyrillic. It has zero Arabic Unicode coverage.

**How to avoid:** The `:lang(ar)` CSS rule must override the font-family for all elements when Arabic is active. Noto Sans Arabic (or Cairo) must be specified for Arabic headings explicitly. The blocking script sets `lang="ar"` on `<html>` early enough for the `:lang(ar)` CSS rule to take effect on first paint.

---

### Pitfall 6: JSX Extension Mismatch

**What goes wrong:** The existing project uses `.jsx` extensions (main.jsx, App.jsx). Creating new files as `.tsx` without configuring TypeScript will cause Vite module resolution errors.

**Why it happens:** The project was scaffolded with the non-TypeScript Vite template (`react` not `react-ts`). There is no `tsconfig.json`.

**How to avoid:** Either create all new Phase 1 files as `.jsx` and `.js` to match the existing convention, OR add TypeScript support explicitly (install typescript + @types/react + @types/react-dom + tsconfig.json + rename existing files). The STACK.md recommends TypeScript but the project as bootstrapped uses plain JS. The plan must make this decision explicit.

---

## Code Examples

### Complete globals.css

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* === BRAND COLOR PALETTE === */
  /* 10 named teal-green colors, light to dark */
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

  /* === SEMANTIC SURFACE COLORS === */
  --color-surface-ivory: #F4FAF7;   /* light mode background */
  --color-surface-dark: #082F2D;    /* dark mode background */
  --color-surface-dark-card: #0C4744; /* dark mode card surfaces */

  /* === TYPOGRAPHY === */
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Inter", system-ui, -apple-system, sans-serif;
  --font-arabic: "Noto Sans Arabic", "Cairo", sans-serif;
}

/* Class-based dark mode — dark class on <html> element */
@custom-variant dark (&:where(.dark, .dark *));

/* === GLOBAL BASE STYLES === */
html {
  /* Light mode defaults */
  background-color: var(--color-surface-ivory);
  color: #1a1a1a;
}

html.dark {
  background-color: var(--color-surface-dark);
  color: var(--color-celadon-100);
}

body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* === ARABIC LANGUAGE OVERRIDES === */
:lang(ar) {
  font-family: var(--font-arabic);
  font-size: 1.2em;
  line-height: 1.8;
}

:lang(ar) h1,
:lang(ar) h2,
:lang(ar) h3,
:lang(ar) h4 {
  font-family: var(--font-arabic);
  font-weight: 600;
  letter-spacing: 0;
}

/* === GRADIENT PLACEHOLDER SYSTEM === */
.placeholder-gradient-primary {
  background-image: linear-gradient(
    135deg,
    var(--color-seagrass-500) 0%,
    var(--color-deep-ocean-900) 100%
  );
}

.placeholder-gradient-card {
  background-image: linear-gradient(
    160deg,
    var(--color-mint-leaf-300) 0%,
    var(--color-jungle-teal-700) 60%,
    var(--color-stormy-teal-950) 100%
  );
}

.placeholder-gradient-hero {
  background-image: linear-gradient(
    180deg,
    var(--color-celadon-100) 0%,
    var(--color-seagrass-600) 50%,
    var(--color-deep-ocean-900) 100%
  );
}

/* Aspect ratios for placeholder containers */
.placeholder-aspect-hero {
  aspect-ratio: 16 / 9;
  min-height: 400px;
}

.placeholder-aspect-card {
  aspect-ratio: 4 / 3;
}

.placeholder-aspect-portrait {
  aspect-ratio: 3 / 4;
}
```

### AppProviders Composition

```jsx
// src/providers/AppProviders.jsx
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { ThemeProvider } from './ThemeProvider';

export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </ThemeProvider>
  );
}
```

### Updated main.jsx

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProviders } from './providers/AppProviders';
import App from './App.jsx';
import './styles/globals.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);
```

### Phase 1 Verification Component (ThemeTestComponent)

```jsx
// src/components/ThemeTestComponent.jsx
// Temporary component to verify Phase 1 success criteria
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useDirection } from '../hooks/useDirection';

export function ThemeTestComponent() {
  const { t, i18n } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();
  const { dir, isRTL } = useDirection();

  const colors = [
    { name: 'celadon-100', cls: 'bg-celadon-100' },
    { name: 'celadon-200', cls: 'bg-celadon-200' },
    { name: 'mint-leaf-300', cls: 'bg-mint-leaf-300' },
    { name: 'mint-leaf-400', cls: 'bg-mint-leaf-400' },
    { name: 'seagrass-500', cls: 'bg-seagrass-500' },
    { name: 'seagrass-600', cls: 'bg-seagrass-600' },
    { name: 'jungle-teal-700', cls: 'bg-jungle-teal-700' },
    { name: 'blue-spruce-800', cls: 'bg-blue-spruce-800' },
    { name: 'deep-ocean-900', cls: 'bg-deep-ocean-900' },
    { name: 'stormy-teal-950', cls: 'bg-stormy-teal-950' },
  ];

  return (
    <div className="p-8 min-h-screen bg-surface-ivory dark:bg-surface-dark">
      {/* Color tokens */}
      <div className="flex flex-wrap gap-4 mb-8">
        {colors.map(c => (
          <div key={c.name} className={`w-20 h-20 rounded ${c.cls}`} title={c.name} />
        ))}
      </div>

      {/* Typography */}
      <h1 className="font-display text-4xl text-stormy-teal-950 dark:text-celadon-100 mb-4">
        {t('test.heading')}
      </h1>
      <p className="font-body text-base text-deep-ocean-900 dark:text-mint-leaf-300 mb-8">
        {t('test.body')}
      </p>

      {/* Gradient placeholders */}
      <div className="placeholder-gradient-hero placeholder-aspect-hero rounded-xl mb-8" />
      <div className="placeholder-gradient-card placeholder-aspect-card rounded-lg w-64 mb-8" />

      {/* Controls */}
      <button onClick={toggleTheme} className="me-4 px-4 py-2 bg-seagrass-500 text-white rounded">
        Toggle: {theme}
      </button>
      {['tr', 'en', 'ar'].map(lng => (
        <button key={lng} onClick={() => i18n.changeLanguage(lng)}
          className="me-2 px-3 py-2 bg-jungle-teal-700 text-white rounded">
          {lng.toUpperCase()}
        </button>
      ))}

      <p className="mt-4 text-sm text-seagrass-600 dark:text-seagrass-500">
        dir: {dir} | isRTL: {String(isRTL)} | lang: {i18n.language}
      </p>
    </div>
  );
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `tailwind.config.js` with `theme.extend.colors` | `@theme` block in CSS with `--color-*` variables | Tailwind v4 (2025) | No JS config file; colors defined in CSS; auto-generates all utilities |
| PostCSS plugin (`tailwindcss: {}`) | `@tailwindcss/vite` Vite plugin | Tailwind v4 | Faster build; no postcss.config.js needed |
| `@tailwind base; @tailwind components; @tailwind utilities;` | `@import "tailwindcss";` | Tailwind v4 | Single import replaces three directives |
| `darkMode: 'class'` in config | `@custom-variant dark (&:where(.dark, .dark *))` | Tailwind v4 | CSS-native variant definition |
| `framer-motion` package import | `motion/react` import path | Nov 2024 rebranding | **Project has `framer-motion` installed — use `from "framer-motion"` imports in this project** |
| i18next HTTP backend for JSON loading | Inline bundled resources in `i18n.init({ resources: ... })` | N/A — always an option | No async load; zero flash of untranslated keys for small static content |

---

## Open Questions

1. **TypeScript vs plain JavaScript**
   - What we know: Project was scaffolded with `react` template (not `react-ts`); all existing files are `.jsx`. STACK.md recommends TypeScript.
   - What's unclear: No tsconfig.json exists. The plan must choose: stay with `.jsx` for simplicity or add TypeScript setup as an explicit task.
   - Recommendation: Add TypeScript as a separate task early in Phase 1 (install typescript + @types/react + @types/react-dom + tsconfig.json + rename main.jsx → main.tsx). It's better to establish it now than to refactor 30+ files later. But it must be an explicit task, not assumed.

2. **Vite version compatibility**
   - What we know: package.json shows `vite@8.0.0-beta.13` with an override. This is a pre-release version.
   - What's unclear: Whether `@tailwindcss/vite@4.2.1` peer-depends on stable Vite 7 or is compatible with Vite 8 beta.
   - Recommendation: Check compatibility before the install step. If incompatible, the override may need adjustment. The planning task should verify this before installing.

3. **Cormorant Garamond specific weights**
   - What we know: Google Fonts has Cormorant Garamond with variants: weight 300-700, italic and regular.
   - What's unclear: Which weights are needed for heading hierarchy (h1 through h4) in the brand design.
   - Recommendation: Load 300 italic, 400, 600 for headings. Sufficient for luxury serif headline treatment.

4. **Color token naming convention for Tailwind utilities**
   - What we know: `--color-celadon-100` generates `bg-celadon-100`, `text-celadon-100` etc.
   - What's unclear: The hyphenated names (e.g., `mint-leaf-300`, `jungle-teal-700`) create utilities like `bg-mint-leaf-300` — these are fine in Tailwind v4 but unusual. Confirm they don't clash with any built-in Tailwind color names.
   - Recommendation: The names are unique enough. Proceed with the 10-token naming as defined in PROJECT.md. None conflict with Tailwind defaults (which use colors like `teal-*`, `green-*`, not `celadon-*`).

---

## Sources

### Primary (HIGH confidence)

- https://tailwindcss.com/docs/installation — @tailwindcss/vite Vite plugin setup
- https://tailwindcss.com/docs/theme — @theme directive, --color-* namespace, --font-* namespace
- https://tailwindcss.com/docs/dark-mode — @custom-variant dark, class-based strategy
- https://www.i18next.com/how-to/add-or-load-translations — bundled resources with resources: {} config
- https://www.i18next.com/overview/configuration-options — fallbackLng, supportedLngs, detection
- https://github.com/i18next/i18next-browser-languageDetector — detection order, caches configuration
- Project files read directly (2026-02-24): package.json, vite.config.js, src/main.jsx, src/index.css, index.html, node_modules listing

### Secondary (MEDIUM confidence)

- .planning/research/STACK.md — verified stack choices, version numbers, RTL pattern
- .planning/research/ARCHITECTURE.md — AppProviders pattern, ThemeProvider pattern, AnimatedOutlet
- .planning/research/PITFALLS.md — FOUC prevention, physical vs logical properties, font pitfalls

### Tertiary (LOW confidence)

- WebSearch: Tailwind v4 dark mode localStorage patterns — multiple sources agree on @custom-variant approach

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified via npm show; @tailwindcss/vite Vite plugin confirmed via official docs
- Architecture: HIGH — patterns verified against official docs + project planning research
- Pitfalls: HIGH — all critical pitfalls grounded in specific project file readings (e.g., JSX mismatch is confirmed by reading actual files)
- Color token system: HIGH — @theme behavior verified via official Tailwind docs
- i18n config: HIGH — bundled resources pattern verified via official i18next docs

**Research date:** 2026-02-24
**Valid until:** 2026-03-24 (30 days — Tailwind v4 and i18next v25 are stable releases)
