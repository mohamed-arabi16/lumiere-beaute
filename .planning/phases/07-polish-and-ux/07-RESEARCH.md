# Phase 7: Polish and UX Enhancements — Research

**Researched:** 2026-02-25
**Domain:** i18n namespace refactoring, scroll-driven Framer Motion animations, custom cursor with spring physics
**Confidence:** HIGH (i18n splitting), HIGH (scroll animations — already partially implemented), MEDIUM (custom cursor — pattern verified, framer-motion v12 Cursor component unclear)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| POL-01 | i18n locale files are split — `ar.json`, `en.json`, and `tr.json` exist as separate files; `common.json` is removed or unused | i18next native namespace support; bundled import pattern already in use; config.ts restructure identified |
| POL-02 | Arabic copy reads naturally to a native speaker — no machine-translation artifacts, correct gendered forms, proper RTL punctuation | Content audit patterns documented; Arabic punctuation rules identified; idiomatic review checklist provided |
| POL-03 | At least two distinct scroll-driven animations are visible on the homepage (beyond existing hero parallax and count-up) | `useScroll` + `useTransform` already in HeroSection; two concrete new patterns identified (scale-fade reveal + horizontal parallax on section headings) |
| POL-04 | A custom cursor appears on desktop — replaces the default pointer with a branded element that reacts to hover states on interactive elements | `useMotionValue` + `useSpring` pattern documented; hover state detection pattern; `pointer-events: none` + `cursor: none` approach confirmed |
</phase_requirements>

---

## Summary

Phase 7 has four orthogonal workstreams that can be planned as independent tasks with no interdependencies. The i18n file split (POL-01) is a pure refactor — the existing `config.ts` bundles three `common.json` files; splitting each into per-language files (e.g. `ar.json`, `en.json`, `tr.json`) and updating the resource keys requires zero API changes to react-i18next. All existing `useTranslation('common')` calls remain valid because `defaultNS: 'common'` is unchanged; only the import structure in `config.ts` changes.

The Arabic copy review (POL-02) is non-technical — it requires a native-speaker audit of the 157-line `ar/common.json`. Key areas are gendered noun agreement (treatment descriptions using masculine defaults), RTL punctuation (Arabic period `؟`, question mark `؟` vs Western `?`), and natural phrasing vs literal translations.

Scroll-driven animations (POL-03) build on infrastructure that already exists. `useScroll` and `useTransform` are already imported in `HeroSection.tsx`. The variants.ts file has `fadeInUpVariants` and `staggerContainerVariants` in place. The new work is adding two more distinct scroll-linked effects to sections not currently using `useScroll`/`useTransform` (as opposed to whileInView, which is already used everywhere). Good candidates: a section-heading horizontal text-reveal driven by `scrollYProgress`, and a scale+opacity fade on the testimonials or services teaser section background.

The custom cursor (POL-04) is the most novel addition. The standard framer-motion pattern uses `useMotionValue(0)` for x/y, `useSpring` for smoothing (stiffness: ~500–700, damping: ~25–30), a `mousemove` listener in `useEffect` to call `.set()`, and a `motion.div` with `pointer-events: none` positioned `fixed` at the cursor coordinates. The cursor must be desktop-only (hidden on touch) and must respect `prefers-reduced-motion` (already handled globally via `MotionConfig reducedMotion="user"` in `AppProviders.tsx`).

**Primary recommendation:** Implement as 4 plans: (1) locale file split + config.ts update, (2) Arabic copy audit and rewrite, (3) two new scroll-driven animation variants on the homepage, (4) custom cursor component with hover states.

---

## Standard Stack

### Core (already installed — no new packages required)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | ^12.34.3 | scroll animations + custom cursor | Already in use; `useScroll`, `useTransform`, `useMotionValue`, `useSpring` all available |
| i18next | ^25.8.13 | namespace management | Already configured; namespace splitting is native i18next feature |
| react-i18next | ^16.5.4 | `useTranslation` hook for namespace access | Already in use; multi-namespace `useTranslation(['ns1','ns2'])` pattern supported |

### Supporting (may need to install)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| i18next-resources-to-backend | ^1.2.1 | Dynamic namespace imports via Vite lazy import | Only if lazy-loading namespaces (not needed for this phase — bundled imports are fine) |

**Installation:** No new packages needed. All required APIs exist in the installed versions.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useMotionValue` + `useSpring` cursor | `motion.dev` `Cursor` component (Premium API) | `Cursor` component mentioned in motion.dev docs but appears to require a premium/separate package — unconfirmed for framer-motion v12. Use manual implementation instead. |
| Per-locale namespaces (`nav`, `home`, `services`, etc.) | Keep `common` namespace with per-language files | Phase goal is per-language files (`ar.json`, `en.json`, `tr.json`), NOT per-feature namespaces. The requirement is to split by language into single files, not fragment by feature. |
| `whileInView` for new scroll animations | `useScroll` + `useTransform` | `whileInView` is trigger-based (fires once). Scroll-driven animations require continuous linkage — use `useScroll`/`useTransform` for animations that must track scroll position continuously. |

---

## Architecture Patterns

### Existing Project Structure (relevant files)

```
src/
├── i18n/
│   ├── config.ts                    # i18next init — imports 3 common.json files
│   └── locales/
│       ├── ar/common.json           # 157 lines — ALL Arabic content in one file
│       ├── en/common.json           # 157 lines — ALL English content in one file
│       └── tr/common.json           # 157 lines — ALL Turkish content in one file
├── animations/
│   └── variants.ts                  # fadeInUpVariants, staggerContainerVariants, pageTransitionVariants
├── components/
│   ├── animations/
│   │   ├── FadeInSection.tsx        # whileInView fade-up (already scroll-reveal, NOT scroll-driven)
│   │   └── StaggerContainer.tsx     # whileInView stagger cascade
│   └── sections/
│       ├── HeroSection.tsx          # useScroll + useTransform ALREADY in use (parallax)
│       ├── StatsSection.tsx         # useInView + animate count-up ALREADY in use
│       ├── ServicesTeaserSection.tsx
│       ├── AcademyTeaserSection.tsx
│       └── TestimonialsSection.tsx
├── providers/
│   └── AppProviders.tsx             # MotionConfig reducedMotion="user" — global reduced motion
└── layouts/
    └── RootLayout.tsx               # Place for CustomCursor component
```

### After Phase 7 — Target Structure

```
src/
├── i18n/
│   ├── config.ts                    # Updated: imports ar.json/en.json/tr.json
│   └── locales/
│       ├── ar/ar.json               # Renamed + reviewed Arabic content
│       ├── en/en.json               # Renamed English content
│       └── tr/tr.json               # Renamed Turkish content
├── components/
│   ├── animations/
│   │   ├── FadeInSection.tsx        # Unchanged
│   │   └── StaggerContainer.tsx     # Unchanged
│   └── ui/
│       └── CustomCursor.tsx         # NEW: branded cursor component
└── layouts/
    └── RootLayout.tsx               # CustomCursor mounted here (desktop-only)
```

---

### Pattern 1: i18n Locale File Rename (POL-01)

**What:** The requirement says split `common.json` into per-language files. Given the current architecture has one `common.json` per language folder, and the ROADMAP says "ar.json / en.json / tr.json exist as separate files; common.json is removed", the intent is to rename each `locales/{lang}/common.json` to `locales/{lang}/{lang}.json` (i.e. `ar/ar.json`, `en/en.json`, `tr/tr.json`) and update `config.ts` accordingly.

**The critical constraint:** ALL existing components use `useTranslation('common')` and access keys like `t('home.hero.headline')`. The namespace must remain `'common'` OR all component calls must be updated. The simplest path: keep the namespace key as `'common'` in the resources object but import from the renamed files. Zero component changes required.

**When to use:** This exact pattern — namespace name decoupled from file name.

```typescript
// Source: i18next documentation — bundled resource pattern
// config.ts — UPDATED

import trTranslations from './locales/tr/tr.json';   // renamed from common.json
import enTranslations from './locales/en/en.json';   // renamed from common.json
import arTranslations from './locales/ar/ar.json';   // renamed from common.json

i18n.init({
  resources: {
    tr: { common: trTranslations },  // namespace key stays 'common'
    en: { common: enTranslations },
    ar: { common: arTranslations },
  },
  defaultNS: 'common',
  // ... rest unchanged
});
```

**Result:** `ar.json`, `en.json`, `tr.json` exist; `common.json` is removed. All `useTranslation('common')` calls in components work without change.

---

### Pattern 2: Scroll-Driven Section Animations (POL-03)

**What:** `useScroll` with a `target` ref tracks the element's scroll progress. `useTransform` maps `scrollYProgress` [0,1] to animation values. The result is a motion value that updates on every scroll frame — no variant/trigger needed.

**Distinction from existing animations:**
- `FadeInSection` uses `whileInView` — fires ONCE when element enters viewport
- `StatsSection` uses `useInView` — fires ONCE when element enters viewport
- `HeroSection` uses `useScroll` + `useTransform` — **continuous scroll linkage** (this is what POL-03 means by "scroll-driven")

**Two new distinct animations recommended:**

**Animation A — Section Heading Reveal with Y-parallax (for ServicesTeaserSection or TestimonialsSection):**
```typescript
// Source: motion.dev docs pattern + HeroSection.tsx existing pattern
// Attach to a section wrapper ref
const sectionRef = useRef<HTMLElement>(null);
const { scrollYProgress } = useScroll({
  target: sectionRef,
  offset: ['start end', 'end start'],  // tracks while element moves through viewport
});
const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
const y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

// Apply to heading wrapper:
<motion.div style={{ opacity, y }}>
  <Heading level={2}>...</Heading>
</motion.div>
```

**Animation B — Scale reveal on testimonials cards background:**
```typescript
// Track page-level scroll to drive background scale effect on dark section
const { scrollYProgress: testimonialsProgress } = useScroll({
  target: testimonialsRef,
  offset: ['start end', 'center center'],
});
const bgScale = useTransform(testimonialsProgress, [0, 1], [1.05, 1]);

<motion.section style={{ scale: bgScale }} ref={testimonialsRef}>
  ...
</motion.section>
```

**RTL note:** Y-axis animations have no direction component — safe for both LTR and RTL. No `custom={isRTL}` needed for scroll-driven Y/opacity/scale animations.

**`useReducedMotion` handling:** `AppProviders.tsx` already has `MotionConfig reducedMotion="user"` — this globally disables all Framer Motion animations for users with `prefers-reduced-motion`. No per-component handling needed for new scroll animations.

---

### Pattern 3: Custom Cursor with Spring Physics (POL-04)

**What:** A fixed-position `motion.div` that tracks mouse position with spring-smoothed lag, replacing the default OS cursor. Two visual states: default (small dot) and hover (enlarged ring when over interactive elements like buttons, links).

**Implementation:**
```typescript
// Source: community-verified pattern (multiple sources), framer-motion v12 compatible
// components/ui/CustomCursor.tsx

import { useMotionValue, useSpring, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config: high stiffness + moderate damping = responsive with slight lag
  const springConfig = { stiffness: 500, damping: 28 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    // Detect hover over interactive elements globally
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, select, textarea');
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  // Desktop-only: hide on touch devices + reduced motion
  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 start-0 pointer-events-none z-[9999] rounded-full
                 border-2 border-stormy-teal-700 mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        width: isHovering ? 40 : 12,
        height: isHovering ? 40 : 12,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.15 }}
    />
  );
}
```

**CSS to hide default cursor:** Applied globally in `globals.css`:
```css
/* Only on devices that support hover (non-touch) */
@media (hover: hover) and (pointer: fine) {
  * { cursor: none !important; }
}
```

**Mount location:** `RootLayout.tsx` — outside `<main>` and outside `<Navbar>`, so it overlays everything but never re-mounts on page navigation.

**RTL note:** The cursor uses `start-0` (logical property) for the left offset, but since it's positioned via `style.x` / `style.y` (motion values), no RTL-specific logic is needed. Mouse coordinates are always physical viewport-relative.

---

### Pattern 4: Arabic Copy Quality Review (POL-02)

**What:** Non-technical audit of `ar/ar.json` (post-rename from `common.json`) against native Arabic copy standards.

**Key review checklist items:**

1. **Gendered nouns:** Arabic has grammatical gender. Review all `عميل` (client) references — should be `عميلة` when referring to a female client or use gender-neutral phrasing `عميل/ة`.
2. **RTL punctuation:** Arabic uses `،` (Arabic comma, U+060C) not `,`. The current JSON uses Latin commas in Arabic text — verify. Uses `؟` for question marks — the current JSON appears to use `؟` correctly.
3. **Verb forms:** Arabic verbs conjugate for gender. Imperatives in CTAs like `احجز` (book, masculine imperative) vs `احجزي` (feminine) — use masculine as neutral for CTAs.
4. **Sentence-final punctuation:** Arabic sentences should end with `۔` (Arabic full stop) or no punctuation, not `.`. The current `ar.json` uses `.` at some sentence ends — needs review.
5. **Numbers:** Duration strings use Arabic-Indic numerals `٦٠ دقيقة` consistently — correct per project decision [04-01].
6. **Natural phrasing:** Check `جارٍ الإرسال...` (Sending...) — correct use of kasra + tanwin. Check `أودّ` in whatsapp_message — this is first-person; verify natural-sounding for Istanbul Arabic context.
7. **Missing context:** `error_generic` ends with "أو التواصل معنا عبر واتساب" — grammatically correct; "واتساب" is accepted Arabic transliteration.
8. **Luxury register:** Ensure vocabulary is formal/luxury register, not colloquial. `فاخرة`, `متجددة`, `مضيئة` are good. Check testimonial quotes for natural voice.

**Specific items to flag for native review:**
- Line: `"success_body": "شكرًا لك — سنتواصل معك خلال ٢٤ ساعة."` — uses em dash (—), which is unusual in Arabic typography; Arabic uses a space or colon instead.
- Line: `"subtitle": "علاجات فاخرة وكورسات احترافية في قلب إسطنبول."` — `كورسات` is a loanword; consider `دورات` (more natural Arabic).
- Line: `"subtitle": "دورات احترافية معتمدة يُقدّمها خبراء الصناعة."` — already uses `دورات` in academy section (inconsistency with `كورسات` in home section).

---

### Anti-Patterns to Avoid

- **Splitting by feature namespace:** The ROADMAP requirement is per-language files (ar.json/en.json/tr.json), NOT splitting common.json into nav.json + home.json + services.json + etc. Do not over-engineer the namespace split.
- **Animating `left`/`top` CSS for cursor:** These are layout properties that trigger reflow. Always use `transform: translate()` via motion values `x`/`y` — this is GPU-composited.
- **Cursor on touch devices:** Touch users must never see the cursor or have `cursor: none` applied. Use `@media (hover: hover) and (pointer: fine)` to gate both CSS and component rendering.
- **Using `whileInView` and calling it "scroll-driven":** `whileInView` is a trigger, not a continuous linkage. POL-03 requires animations that respond to the current scroll position — use `useScroll` + `useTransform`.
- **Physical cursor position directly in `style`:** `style={{ left: cursorX, top: cursorY }}` triggers reflow. Use `style={{ x: cursorX, y: cursorY }}` which Framer Motion maps to `transform: translate()`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spring-smoothed cursor position | Manual lerp in `requestAnimationFrame` | `useSpring(motionValue, config)` | Spring config (stiffness/damping) is easier to tune; built-in Framer Motion integration |
| Scroll progress tracking | `scroll` event listener + manual math | `useScroll({ target, offset })` | Handles ResizeObserver, sub-pixel accuracy, RTL-safe |
| Reduced-motion check | Custom `matchMedia` hook | `useReducedMotion()` from framer-motion | Already provided; `MotionConfig reducedMotion="user"` in AppProviders covers global case |
| Interactive element detection | Per-component cursor prop | Global `mouseover` with `closest('a, button, [role="button"]')` | Single listener covers all elements including dynamically rendered ones |

**Key insight:** The hardest part of the custom cursor is hover state detection on arbitrary interactive elements — the `closest()` approach on a global `mouseover` listener is the idiomatic solution without requiring every component to emit cursor events.

---

## Common Pitfalls

### Pitfall 1: i18n Namespace Name vs File Name Confusion
**What goes wrong:** Developer renames file to `ar.json` but also changes the namespace key from `'common'` to `'ar'` — breaking all `useTranslation('common')` and `t('key')` calls across 30+ components.
**Why it happens:** Conflating the file name with the namespace name.
**How to avoid:** File name is irrelevant to i18next — the namespace key is what matters. Keep `resources: { ar: { common: arTranslations } }` with the imported file renamed to `ar.json`.
**Warning signs:** TypeScript errors in components after config.ts changes; console shows "i18next::translator: missingKey".

### Pitfall 2: Cursor Jank from Layout Properties
**What goes wrong:** Cursor lags or causes frame drops because it animates `top`/`left` CSS properties.
**Why it happens:** `top`/`left` trigger layout recalculation on every frame.
**How to avoid:** Use `style={{ x: cursorX, y: cursorY }}` (Framer Motion motion values map to `transform: translate()`). Keep cursor as `position: fixed` at origin with transform offset.
**Warning signs:** Cursor animation visible as dropped frames in DevTools Performance panel.

### Pitfall 3: Cursor Visible on Mobile / Tablet
**What goes wrong:** `cursor: none` is applied globally including on touch devices, breaking tap targets or causing visual glitches.
**Why it happens:** Using `* { cursor: none }` without media query.
**How to avoid:** Wrap in `@media (hover: hover) and (pointer: fine)` — this targets mouse-capable devices only. Also guard the `CustomCursor` component render with a device capability check.
**Warning signs:** iOS/Android QA shows invisible tap targets or cursor div appearing as a dot.

### Pitfall 4: Scroll Animations Breaking in RTL
**What goes wrong:** Y-axis scroll animations are fine, but if X-axis transforms are used, they appear mirrored in RTL.
**Why it happens:** Horizontal motion values don't account for reading direction.
**How to avoid:** For scroll-driven animations in this phase, use only Y-axis (`y`), `opacity`, and `scale` transforms. If horizontal motion is needed, apply the `custom={isRTL}` pattern from page transition variants.
**Warning signs:** Arabic users see text slide in from wrong direction during scroll.

### Pitfall 5: `useScroll` offset syntax
**What goes wrong:** Incorrect `offset` values result in animations triggering too early, too late, or not at all.
**Why it happens:** The offset syntax `['start end', 'end start']` uses two viewport-relative anchor points that are non-obvious.
**How to avoid:**
- `['start end', 'end start']` = tracks full time element is in viewport (use for section-wide effects)
- `['start start', 'end start']` = tracks from when top of element hits top of viewport (use for parallax like HeroSection)
- `['start end', 'center center']` = tracks from when element enters to when it centers (use for entrance reveals)
**Warning signs:** Animation plays before or after visible.

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Locale File Split (config.ts update)
```typescript
// Source: i18next official docs + existing src/i18n/config.ts pattern
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// File names changed; namespace key 'common' unchanged
import trTranslations from './locales/tr/tr.json';
import enTranslations from './locales/en/en.json';
import arTranslations from './locales/ar/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: trTranslations },  // namespace stays 'common'
      en: { common: enTranslations },
      ar: { common: arTranslations },
    },
    defaultNS: 'common',
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'ar'],
    // ... rest identical to current config
  });
```

### Scroll-Driven Y + Opacity (new animation, POL-03)
```typescript
// Source: motion.dev useScroll docs + HeroSection.tsx existing pattern
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

function ServicesTeaserSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center start'],
  });
  const headingY = useTransform(scrollYProgress, [0, 0.5], [30, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={sectionRef} className="py-20 px-6">
      <motion.div
        className="text-center mb-4"
        style={{ y: headingY, opacity: headingOpacity }}
      >
        <Heading level={2}>...</Heading>
      </motion.div>
      {/* ...rest of section unchanged */}
    </section>
  );
}
```

### Custom Cursor — Complete Component
```typescript
// Source: Community-verified pattern; framer-motion v12 compatible
// src/components/ui/CustomCursor.tsx
import { useMotionValue, useSpring, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const shouldReduceMotion = useReducedMotion();
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setIsHovering(!!t.closest('a, button, [role="button"], input, select, label'));
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [mouseX, mouseY]);

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full
                 border-2 border-stormy-teal-700"
      style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      animate={{
        width: isHovering ? 36 : 10,
        height: isHovering ? 36 : 10,
        opacity: isVisible ? 1 : 0,
        borderColor: isHovering ? 'var(--color-celadon-400)' : 'var(--color-stormy-teal-700)',
      }}
      transition={{ duration: 0.12 }}
    />
  );
}
```

### Mount CustomCursor in RootLayout
```typescript
// src/layouts/RootLayout.tsx — add CustomCursor outside Navbar and main
import { CustomCursor } from '../components/ui/CustomCursor';

export function RootLayout() {
  // ... existing hooks
  return (
    <div className="min-h-screen bg-surface-ivory dark:bg-surface-dark transition-colors duration-300">
      <CustomCursor />   {/* desktop-only, fixed, z-[9999] */}
      <Navbar />
      <main>
        <AnimatedOutlet />
      </main>
    </div>
  );
}
```

### CSS: Hide Default Cursor on Mouse Devices
```css
/* src/styles/globals.css — append to existing file */
@media (hover: hover) and (pointer: fine) {
  * {
    cursor: none !important;
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `cursor: none` globally | `@media (hover: hover) and (pointer: fine) { cursor: none }` | ~2020 | Prevents broken cursor on touch devices |
| `mousemove` → setState → re-render | `useMotionValue` + `useSpring` | framer-motion v5+ | Zero re-renders; runs entirely in Framer Motion's internal animation loop |
| Single monolithic translation file | Namespace-based split | i18next always supported | Enables lazy loading, team ownership per section |
| `whileInView` for all scroll effects | `useScroll` + `useTransform` for continuous effects | framer-motion v6+ | True scroll-linking vs one-shot triggers |

**Deprecated/outdated:**
- `animate({ top, left })` for cursor: replaced by `style={{ x, y }}` for GPU-composited transforms
- `onMouseEnter`/`onMouseLeave` on every component for cursor state: replaced by single global `mouseover` with `closest()` delegation

---

## Open Questions

1. **framer-motion `Cursor` component (Premium API)**
   - What we know: motion.dev docs mention a `Cursor` component with "two modes", "state-aware", "magnetic", "customisable" features — these would handle hover detection automatically
   - What's unclear: Whether this is in the `framer-motion` npm package (v12) or requires a separate `motion` premium package. WebFetch failed to load the docs page content.
   - Recommendation: Implement manual `useMotionValue` + `useSpring` pattern (fully documented above) — this is the proven approach and works with the installed `framer-motion` package. Do not depend on `Cursor` component until its availability in framer-motion v12 is confirmed.

2. **Arabic copy — native speaker review**
   - What we know: Current `ar.json` was written programmatically; several inconsistencies identified (`كورسات` vs `دورات`, em dash usage, gender forms)
   - What's unclear: Whether a native Arabic speaker (ideally Levantine/Gulf register for Istanbul luxury market) is available for review
   - Recommendation: Plan POL-02 as a two-task plan: (a) automated/AI-assisted pass to fix obvious issues (dashes, punctuation, `كورسات` → `دورات`), (b) flag for native-speaker sign-off before Phase 7 is marked complete.

3. **Scroll animation placement on inner pages (Services, Academy, Contact)**
   - What we know: POL-03 success criteria says "at least two distinct scroll-driven animations are visible on the homepage" — homepage is the baseline
   - What's unclear: Whether scroll-driven animations should also be applied to inner pages (not stated in requirements)
   - Recommendation: Meet the minimum (2 new on homepage), then optionally apply the same `useScroll` pattern to Services page hero and Academy page hero as enhancements.

---

## Sources

### Primary (HIGH confidence)
- Context7 `/websites/motion_dev` — scroll animation patterns, `useScroll`, `useSpring`, cursor features
- Context7 `/llmstxt/i18next_llms-full_txt` — namespace configuration, multiple namespace loading
- Context7 `/i18next/react-i18next` — `useTranslation` multi-namespace pattern
- `src/i18n/config.ts` — existing bundled import pattern (directly verified)
- `src/components/sections/HeroSection.tsx` — existing `useScroll` + `useTransform` implementation (directly verified)
- `src/providers/AppProviders.tsx` — `MotionConfig reducedMotion="user"` (directly verified)

### Secondary (MEDIUM confidence)
- https://react.i18next.com/guides/multiple-translation-files — namespace splitting guide (WebFetch partial)
- https://www.i18next.com/how-to/add-or-load-translations — `i18next-resources-to-backend` pattern (WebFetch confirmed)
- WebSearch: framer-motion scroll animation patterns (multiple sources confirming `useScroll`/`useTransform` patterns)

### Tertiary (LOW confidence — flagged)
- WebSearch: custom cursor implementations (multiple tutorials confirming `useMotionValue`/`useSpring` pattern but not framer-motion v12 specific)
- motion.dev `Cursor` component: mentioned in Context7 docs but implementation details not confirmed for `framer-motion` npm package vs premium `motion` package

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all required APIs are in installed packages; no new dependencies needed
- Architecture (i18n split): HIGH — directly maps to existing config.ts pattern; namespace decoupling is well-documented
- Architecture (scroll animations): HIGH — `useScroll`/`useTransform` already in HeroSection; exact same pattern extends to new sections
- Architecture (custom cursor): MEDIUM — `useMotionValue`/`useSpring` pattern well-documented; Cursor component premium API status unconfirmed
- Pitfalls: HIGH — derived from existing project patterns + verified i18next/framer-motion behavior
- Arabic copy review: HIGH (structural checklist) / LOW (final quality — needs native speaker)

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (framer-motion v12 API is stable; i18next v25 is stable)
