# Phase 4: Homepage and Services - Research

**Researched:** 2026-02-25
**Domain:** React page sections, Framer Motion scroll/parallax/counter animations, filterable catalog UI
**Confidence:** HIGH

---

## Summary

Phase 4 builds on top of a fully assembled Phase 3 foundation. Every primitive is already in place: `FadeInSection`, `StaggerContainer`, `TypewriterText`, `Button`, `Card`, `Heading`, `BodyText`, `useDirection`, and all animation variant sets in `variants.ts`. The homepage replaces its temporary Phase 3 verification scaffold, and the Services page stub gets fully fleshed out. No new npm packages are needed — everything required (Framer Motion 12, React Router 7, i18next) is already installed and battle-tested in this repo.

The two technically distinct challenges in this phase are: (1) the hero parallax gradient shift, implemented with Framer Motion's `useScroll` + `useTransform` hooks applied as a `style` prop — this avoids layout recalculation and runs on the compositor thread; and (2) the animated statistics counter, implemented with `useInView` + Framer Motion's imperative `animate()` function to count a number from 0 to its target value when the stats section scrolls into view. The services category filter uses React `useState` to track the active tab, with `AnimatePresence` wrapping the filtered list so cards animate out and in on tab switches.

A critical architectural note: since all text must be externalized, both the homepage sections and the services catalog data must live in the `common.json` locale files (TR/EN/AR) as translation keys — not as hardcoded JSX strings. The treatment catalog (20+ items across multiple categories) and testimonials data should be structured as JSON arrays in the locale files, accessed via `t()` with key interpolation or via `i18n.getResourceBundle()`.

**Primary recommendation:** Build each page section as a standalone component in `src/components/sections/` (e.g. `HeroSection.tsx`, `StatsSection.tsx`, `ServicesTeaserSection.tsx`, `AcademyTeaserSection.tsx`, `TestimonialsSection.tsx`, `TreatmentGrid.tsx`, `CategoryTabs.tsx`), then compose them in `HomePage.tsx` and `ServicesPage.tsx`. This matches the established pattern and keeps each section independently verifiable.

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| HOME-01 | User sees a full-screen hero section with parallax gradient, typewriter text animation, and call-to-action | `useScroll`+`useTransform` for parallax gradient shift; existing `TypewriterText` component for headline; existing `Button` for CTA |
| HOME-02 | User sees animated counting statistics (clients served, years of experience, treatments offered) | `useInView` (once: true) + imperative `animate(from, to, { onUpdate })` from framer-motion for number count-up; `useState` to hold displayed value |
| HOME-03 | User sees services teaser cards that link to the Services page | `Card` + `Button` (as="a" + href) or React Router `Link`; `StaggerContainer` for reveal; click navigates to `/services` |
| HOME-04 | User sees academy teaser cards that link to the Academy page | Same Card pattern as HOME-03; click navigates to `/academy` |
| HOME-05 | User sees client testimonials section with quotes | `StaggerContainer` + `Card` variant; testimonials data in locale JSON as array |
| SRVC-01 | User can filter 20+ treatments by category using animated tab controls | `useState` for active category; `AnimatePresence` + `motion.div` `layout` prop on each card; `layoutId` underline on active tab |
| SRVC-02 | User sees treatment cards displaying name, description, duration, and price | `Card` component with structured data from locale JSON; `Heading` + `BodyText` for internal layout |
</phase_requirements>

---

## Standard Stack

### Core (already installed — no new packages needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `framer-motion` | `^12.34.3` | Parallax (`useScroll`/`useTransform`), counter animation (`animate`), filter transitions (`AnimatePresence`/`layout`) | Already the project animation system; provides everything needed |
| `react-i18next` | `^16.5.4` | All strings via `useTranslation('common')` + `t()` | Zero hardcoded strings is a locked architectural decision |
| `react-router-dom` | `^7.13.1` | `Link` component for teaser card navigation | Already wired via BrowserRouter in AppProviders |
| `tailwindcss` | `^4.2.1` | Utility classes for layout/spacing using logical properties only | Locked — `ms-`/`me-`/`ps-`/`pe-` only, never `ml-`/`mr-` |

### Supporting (existing project primitives to reuse)

| Component | Location | Purpose | When to Use |
|-----------|----------|---------|-------------|
| `FadeInSection` | `src/components/animations/FadeInSection.tsx` | Scroll-triggered section reveal | Every section except hero (always-visible) |
| `StaggerContainer` | `src/components/animations/StaggerContainer.tsx` | Staggered grid/card reveals | Services cards, teaser grids, testimonials |
| `staggerItemVariants` | Re-exported from `StaggerContainer` | Child item variant for stagger | Every `motion.div` child of `StaggerContainer` |
| `TypewriterText` | `src/components/animations/TypewriterText.tsx` | Character-by-character headline animation | Hero section headline only |
| `Button` | `src/components/ui/Button.tsx` | CTA buttons | Hero CTA, section CTAs |
| `Card` | `src/components/ui/Card.tsx` | Content cards with optional gradient placeholder | Treatment cards, teaser cards, testimonial cards |
| `Heading` / `BodyText` | `src/components/ui/Typography.tsx` | Consistent type scale | All section headings and body copy |
| `useDirection` | `src/hooks/useDirection.ts` | `{ dir, isRTL }` for RTL-aware logic | Any component needing direction context |
| `pageTransitionVariants` | `src/animations/variants.ts` | Page-level enter/exit animation | Already on `motion.div` wrappers in both pages |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `useScroll` + `useTransform` for parallax | CSS `@keyframes` scroll-timeline | CSS approach is newer (2023+) but has lower browser support and can't be conditioned on `useReducedMotion` as easily |
| Imperative `animate(0, target, { onUpdate })` for counter | `motion-plus` `AnimateNumber` | `AnimateNumber` is from `motion-plus` package (separate install); imperative `animate` from existing `framer-motion` is zero-dep and sufficient |
| `AnimatePresence` + `layout` for filter transition | CSS grid + `opacity` transitions | `AnimatePresence` handles exit animations for removed cards, which CSS alone cannot do elegantly |

**Installation:** No new packages. Everything already in `package.json`.

---

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── animations/          # Phase 3 — FadeInSection, StaggerContainer, TypewriterText
│   ├── navigation/          # Phase 2 — Navbar, MobileMenu, etc.
│   ├── ui/                  # Phase 3 — Button, Card, Typography
│   └── sections/            # NEW in Phase 4 — page section components
│       ├── HeroSection.tsx
│       ├── StatsSection.tsx
│       ├── ServicesTeaserSection.tsx
│       ├── AcademyTeaserSection.tsx
│       ├── TestimonialsSection.tsx
│       ├── CategoryTabs.tsx
│       └── TreatmentGrid.tsx
├── pages/
│   ├── HomePage.tsx          # Replaced (was Phase 3 scaffold)
│   └── ServicesPage.tsx      # Replaced (was Phase 2 stub)
└── i18n/
    └── locales/
        ├── tr/common.json    # Extended with all new content keys
        ├── en/common.json
        └── ar/common.json
```

### Pattern 1: Hero Parallax Gradient

**What:** The hero section background shifts as the user scrolls, creating depth. Implemented via `useScroll` (window scroll) + `useTransform` (maps scrollY to CSS filter or background-position offset) applied as `style` prop on a `motion.div`. Respects `MotionConfig reducedMotion="user"` already set in `AppProviders`.

**When to use:** Hero section only. Not a general scroll pattern for other sections (those use `FadeInSection`/`whileInView`).

**Example:**
```typescript
// Source: https://context7.com/grx7/framer-motion/llms.txt + motion.dev/docs/react-accessibility
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Track scroll progress of the hero element itself
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Map 0→1 scroll progress to a subtle background shift
  // Using style={{ backgroundPositionY }} or a CSS variable for gradient
  const backgroundY = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', '20%']
  );

  return (
    <motion.section
      ref={heroRef}
      style={{ backgroundPositionY: shouldReduceMotion ? '0%' : backgroundY }}
      className="relative min-h-screen flex flex-col items-center justify-center
                 placeholder-gradient-hero"
    >
      {/* TypewriterText headline, BodyText subtitle, Button CTAs */}
    </motion.section>
  );
}
```

**Key note:** `useScroll` with `target` + `offset: ['start start', 'end start']` tracks from when the hero top hits the viewport top until the hero bottom hits the viewport top — exactly the range where parallax is visible. The `clamp: false` option is not needed here since we want the animation bounded to the section.

---

### Pattern 2: Animated Statistics Counter

**What:** Numbers count up from 0 to their final value when the stats section scrolls into view. Uses `useInView` (from `framer-motion`) to detect viewport entry, and the imperative `animate(from, to, { onUpdate: setState })` function to drive a React state variable from 0 to target.

**When to use:** Stats section. `useInView` with `once: true` ensures the counter only fires once.

**Example:**
```typescript
// Source: https://context7.com/grx7/framer-motion/llms.txt
import { useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

function StatCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1], // luxury easing consistent with project
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, target]);

  return <span ref={ref}>{display}{suffix}</span>;
}
```

**Key note:** Import `animate` (the function, not the hook) from `framer-motion`. This is the imperative value-animation overload: `animate(fromValue, toValue, options)`. It is distinct from the `animate` returned by `useAnimate`. Cleanup via `controls.stop()` prevents state updates after unmount.

---

### Pattern 3: Services Category Filter with AnimatePresence

**What:** Active category state drives which treatment cards render. `AnimatePresence` wraps the list so removed cards play exit animations. `layout` prop on each card smoothly repositions remaining cards. An underline indicator uses `layoutId="active-tab-indicator"` to slide between tabs.

**When to use:** Services page category tabs (SRVC-01).

**Example:**
```typescript
// Source: https://context7.com/grx7/framer-motion/llms.txt (LayoutGroup + layoutId pattern)
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState } from 'react';

function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  return (
    <LayoutGroup>
      <div role="tablist" className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onSelect(cat.id)}
            className="relative px-4 py-2 font-body text-sm ..."
          >
            {cat.label}
            {activeCategory === cat.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-seagrass-600"
              />
            )}
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}

function TreatmentGrid({ treatments }: { treatments: Treatment[] }) {
  return (
    <AnimatePresence mode="popLayout">
      {treatments.map((t) => (
        <motion.div
          key={t.id}
          layout
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card>...</Card>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
```

**Key notes:**
- `mode="popLayout"` on `AnimatePresence` is preferred over `mode="sync"` for grid layouts — it removes the exiting element from layout flow immediately so remaining items reposition cleanly.
- `layout` on each `motion.div` enables smooth repositioning of cards that stay in the list when the category changes.
- The grid container itself should NOT be an `AnimatePresence` — `AnimatePresence` wraps only the list of items inside the grid.

---

### Pattern 4: Teaser Section Cards with Navigation

**What:** Services and Academy teaser sections show 2-3 cards linking to their respective pages. Each card uses the existing `Card` component. Navigation on click uses React Router `Link` (not `Button as="a"` with href). The section CTA button also navigates to the respective page.

**Example:**
```typescript
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { staggerItemVariants } from '../animations/StaggerContainer';

// Inside StaggerContainer:
<motion.div variants={staggerItemVariants}>
  <Link to="/services">
    <Card hasPlaceholder placeholderVariant="card">
      {/* Heading + BodyText */}
    </Card>
  </Link>
</motion.div>
```

**Key note:** Use React Router `Link` for internal navigation — not `<a href>`. This preserves the AnimatePresence page transition animation. If `Button` is used for the section CTA, use it as a React Router `Link` wrapper: `<Link to="/services"><Button variant="primary">...</Button></Link>`.

---

### Pattern 5: Translation JSON Structure for Arrays

**What:** Treatments (20+ items), testimonials (3+ items), stats (3 items), and teaser content must all live in the locale JSON files. i18next supports nested objects and arrays. Access via `t('services.categories', { returnObjects: true })`.

**Example JSON structure:**
```json
{
  "home": {
    "hero": {
      "headline": "Your Beauty. Our Craft.",
      "subtitle": "Premium treatments in the heart of Istanbul.",
      "cta_primary": "Book a Treatment",
      "cta_secondary": "Explore Services"
    },
    "stats": [
      { "value": 500, "suffix": "+", "label": "Happy Clients" },
      { "value": 8, "suffix": "", "label": "Years of Experience" },
      { "value": 20, "suffix": "+", "label": "Treatments Offered" }
    ],
    "testimonials": [
      { "quote": "...", "author": "...", "role": "..." },
      { "quote": "...", "author": "...", "role": "..." },
      { "quote": "...", "author": "...", "role": "..." }
    ]
  },
  "services": {
    "categories": [
      { "id": "facial", "label": "Facial Treatments" },
      { "id": "body", "label": "Body Treatments" },
      { "id": "hair", "label": "Hair Care" }
    ],
    "treatments": [
      {
        "id": "hydra-facial",
        "category": "facial",
        "name": "HydraFacial",
        "description": "Deep cleanse and hydrate with multi-step infusion.",
        "duration": "60 min",
        "price": "₺850"
      }
    ]
  }
}
```

**Accessing arrays in components:**
```typescript
const { t, i18n } = useTranslation('common');
// Returns array of objects when returnObjects is true
const stats = t('home.stats', { returnObjects: true }) as StatItem[];
const treatments = t('services.treatments', { returnObjects: true }) as Treatment[];
```

---

### Anti-Patterns to Avoid

- **Hardcoded strings in JSX:** Every visible string (headlines, labels, prices, descriptions) must be a `t('key')` call — no exceptions. This is a locked architectural decision.
- **Physical margin/padding utilities:** `ml-`, `mr-`, `pl-`, `pr-` are forbidden. Use `ms-`, `me-`, `ps-`, `pe-` only (Tailwind logical properties).
- **Static x values in horizontal animations:** Any horizontal animation must use a variant function with `custom={isRTL}` prop — no static `x: 50` values.
- **`motion/react` import path:** The project uses `framer-motion`, not the `motion` package. Always import from `'framer-motion'`, never from `'motion/react'`.
- **`<a href="...">` for internal links:** Use React Router `<Link to="...">` to preserve page transitions.
- **`useAnimate` for counter:** Use the standalone `animate(from, to, opts)` function instead — `useAnimate` is for DOM-scoped animations and is heavier.
- **Re-animating on scroll-back:** All `whileInView` / `useInView` usage must have `once: true` — no section should re-animate when scrolled back into view.
- **Importing `motion/react` from AppProviders MotionConfig:** MotionConfig is already at the outermost level (outside BrowserRouter) in AppProviders — do NOT add another MotionConfig in page components.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Parallax scroll effect | Custom `scroll` event listener + `requestAnimationFrame` | `useScroll` + `useTransform` from `framer-motion` | Runs on compositor thread; auto-cleaned up; respects `reducedMotion` via `MotionConfig` already in AppProviders |
| Number count-up animation | `setInterval` timer counting up | `animate(from, to, { onUpdate })` from `framer-motion` | Proper easing, cleanup via `controls.stop()`, integrates with MotionConfig's reducedMotion setting |
| Sliding tab indicator | `transform: translateX(...)` with manual offset calculation | `layoutId` on `motion.div` + `LayoutGroup` | Automatically handles varying tab widths, RTL, and font-size changes |
| Filter transition between cards | CSS class toggle with opacity | `AnimatePresence mode="popLayout"` + `layout` prop | Handles exit animation for removed cards (CSS cannot animate elements leaving the DOM) |
| Viewport detection for counter | Manual `IntersectionObserver` | `useInView` from `framer-motion` | Consistent API with rest of animation system, shares `MotionConfig` reducedMotion |

**Key insight:** Everything in this phase is a composition problem, not an invention problem. The hard parts (RTL, reducedMotion, viewport detection, easing) are already solved by framer-motion and the existing project infrastructure.

---

## Common Pitfalls

### Pitfall 1: Hero Parallax Applying Wrong Offset Range
**What goes wrong:** `useTransform` maps scroll progress to values that are too aggressive (e.g. `[0, 1]` → `['0%', '100%']`), causing the background to scroll completely out of frame.
**Why it happens:** The `scrollYProgress` range `[0, 1]` covers the full scroll travel of the hero element, which is the entire viewport height. A 100% shift would fully displace a background image.
**How to avoid:** Keep the parallax offset subtle — `[0, 1]` → `['0%', '15%']` or `['0%', '20%']` for a gradient background is sufficient to feel like parallax without looking broken.
**Warning signs:** Background appears empty/white at midpoint of hero scroll.

### Pitfall 2: Counter Animating on Every Render
**What goes wrong:** The `useEffect` running `animate()` fires on re-renders (e.g. language switch) instead of just once on viewport entry.
**Why it happens:** Missing `once: true` on `useInView`, or `isInView` included in `useEffect` deps without the `once` guard.
**How to avoid:** Always use `useInView(ref, { once: true })` for counter triggers. The `once: true` option means `isInView` transitions from `false` to `true` exactly once per page load and never goes back to `false`, so the effect only fires once.
**Warning signs:** Counters reset and re-animate when language switcher is toggled.

### Pitfall 3: AnimatePresence Key Collision
**What goes wrong:** Two treatments in different categories have the same `id`, causing React/Framer Motion to reuse the DOM node instead of unmounting and remounting — exit animations don't play.
**Why it happens:** Treatment IDs generated as array indices (`index`) instead of stable, unique strings.
**How to avoid:** Use stable, unique string IDs for treatment data (e.g. `"hydra-facial"`, `"lymphatic-drainage"`) — never array indices as keys.
**Warning signs:** Cards "morph" their content instead of fading out when switching categories.

### Pitfall 4: `returnObjects: true` TypeScript Type Loss
**What goes wrong:** `t('home.stats', { returnObjects: true })` returns `string | TFunctionReturn` — TypeScript loses knowledge that it's an array of `StatItem`.
**Why it happens:** i18next's `t()` return type is generic and doesn't infer object shapes from translation keys.
**How to avoid:** Always cast the result: `const stats = t('home.stats', { returnObjects: true }) as StatItem[]`. Define `StatItem`, `Treatment`, `Testimonial`, etc. as TypeScript interfaces in a `src/types/content.ts` file.
**Warning signs:** TypeScript errors on `.map()` calls over translated data.

### Pitfall 5: Layout Shift from `layout` Prop in Grid
**What goes wrong:** Using `layout` on cards inside a CSS grid causes a brief visual jump as the grid re-flows.
**Why it happens:** Framer Motion's `layout` prop measures and animates between positions, but CSS grid re-calculates positions instantly — the two fight each other.
**How to avoid:** Use `mode="popLayout"` on `AnimatePresence` (removes exiting nodes from layout flow immediately) and apply `layout` only to the individual card `motion.div` wrappers, not the grid container itself. Test with slow-motion in Chrome DevTools.
**Warning signs:** Cards "snap" to new positions after a brief flicker.

### Pitfall 6: `LayoutGroup` Scope Leaking Between Pages
**What goes wrong:** A `layoutId="active-tab-indicator"` on the Services page animates across a page transition, visually "morphing" into an unrelated element on another page.
**Why it happens:** `layoutId` is global within the React tree unless scoped with `LayoutGroup`.
**How to avoid:** Always wrap `CategoryTabs` in a `LayoutGroup` with a unique `id` prop: `<LayoutGroup id="services-category-tabs">`.
**Warning signs:** Tab indicator appears to fly across the screen during page transitions.

---

## Code Examples

Verified patterns from official sources:

### Parallax with useScroll + useTransform
```typescript
// Source: https://context7.com/grx7/framer-motion/llms.txt
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <motion.section
      ref={sectionRef}
      style={{ backgroundPositionY: shouldReduceMotion ? '0%' : backgroundY }}
      className="relative min-h-screen flex flex-col items-center justify-center
                 placeholder-gradient-hero overflow-hidden"
    >
      {/* content */}
    </motion.section>
  );
}
```

### Counter Animation with useInView + animate
```typescript
// Source: https://context7.com/grx7/framer-motion/llms.txt
import { useInView, animate } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface StatCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

export function StatCounter({ target, suffix = '', duration = 2 }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}
```

### Category Filter with AnimatePresence + layoutId tab indicator
```typescript
// Source: https://context7.com/grx7/framer-motion/llms.txt (LayoutGroup layoutId pattern)
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Treatment = {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: string;
  price: string;
};

export function ServicesPageContent() {
  const { t } = useTranslation('common');
  const categories = t('services.categories', { returnObjects: true }) as Array<{ id: string; label: string }>;
  const treatments = t('services.treatments', { returnObjects: true }) as Treatment[];
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? '');

  const filtered = treatments.filter((tr) => tr.category === activeCategory);

  return (
    <div>
      {/* Tab bar */}
      <LayoutGroup id="services-category-tabs">
        <div role="tablist" className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              role="tab"
              aria-selected={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="relative py-2 ps-4 pe-4 font-body text-sm ..."
            >
              {cat.label}
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="active-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-seagrass-600"
                />
              )}
            </motion.button>
          ))}
        </div>
      </LayoutGroup>

      {/* Treatment grid */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((treatment) => (
            <motion.div
              key={treatment.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              {/* Card content */}
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
```

### Accessing i18next Array Data Safely
```typescript
// Pattern: typed wrapper to avoid cast repetition
import { useTranslation } from 'react-i18next';

// src/types/content.ts
export interface Treatment {
  id: string;
  category: string;
  name: string;
  description: string;
  duration: string;
  price: string;
}
export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}
export interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

// Usage in component:
const { t } = useTranslation('common');
const treatments = t('services.treatments', { returnObjects: true }) as Treatment[];
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `scroll` event listener + `requestAnimationFrame` for parallax | `useScroll` + `useTransform` (Framer Motion) | Framer Motion 6+ | Compositor-thread safe, no manual cleanup, works with `reducedMotion` |
| Manual `IntersectionObserver` for counter trigger | `useInView` from `framer-motion` | Framer Motion 5.3+ | Consistent with rest of animation system, respects `MotionConfig` |
| CSS `transition` for filter (can't animate exit) | `AnimatePresence mode="popLayout"` + `layout` | Framer Motion 4+ | Exit animations for removed DOM nodes are possible |
| `layoutId` without `LayoutGroup` | `LayoutGroup id="..."` scoping `layoutId` | Framer Motion 6.3+ | Prevents cross-page `layoutId` collisions during page transitions |
| `motion/react` import | `framer-motion` import | This project pinned `framer-motion` | `motion/react` is a separate package not installed in this repo — always use `framer-motion` |

**Deprecated/outdated in this project:**
- Phase 3 verification scaffold in `HomePage.tsx`: Marked `// PHASE 3 VERIFICATION SCAFFOLD — replaced entirely in Phase 4` at line 1. The entire file is replaced in Phase 4.
- Phase 2 stub in `ServicesPage.tsx`: Has comment `Phase 2 stub — content coming in Phase 4`. The entire file is replaced in Phase 4.

---

## Open Questions

1. **Treatment content — 20+ treatment names, descriptions, durations, prices**
   - What we know: The locale JSON structure is clear; TypeScript types can be defined now; placeholder data can be used for development
   - What's unclear: Real client content (actual prices in TRY, actual service names in Turkish) is not finalized per STATE.md blocker
   - Recommendation: Use realistic placeholder data in all three locale files during Phase 4 implementation. Flag in a code comment that content needs client review before Phase 6. Phase 6 (Content and QA) is where real content is populated.

2. **Services category taxonomy — how many categories, what IDs?**
   - What we know: Requirements say "20+ treatments" and "category filtering" but don't specify how many categories
   - What's unclear: Category count determines grid layout complexity and tab bar overflow behavior on mobile
   - Recommendation: Plan for 4-6 categories (e.g. `facial`, `body`, `hair`, `nail`, `eye`, `wax`). This gives enough tabs to test overflow wrapping without over-engineering.

3. **Stats section — specific numbers**
   - What we know: Requirements mention "clients served, years of experience, treatments offered"
   - What's unclear: The actual numbers the client wants to display
   - Recommendation: Use plausible placeholders (`500+`, `8`, `20+`). These are data-driven from locale JSON and trivial to change in Phase 6.

4. **Hero headline — typewriter text content in three languages**
   - What we know: `TypewriterText` accepts a single `text` string prop; it splits on characters
   - What's unclear: In Arabic, the typewriter effect types right-to-left characters — it types in DOM order, which Bidi algorithm renders correctly. But very long Arabic headlines with complex shaping may render oddly mid-animation.
   - Recommendation: Keep hero headline short (3-7 words) across all three languages. Test Arabic specifically in Phase 4 verification.

---

## Sources

### Primary (HIGH confidence)
- `/grx7/framer-motion` (Context7) — `useInView`, `useScroll`, `useTransform`, `useMotionValue`, `animate` function, `AnimatePresence`
- `/websites/motion_dev` (Context7) — `useScroll`+`useTransform` parallax with `useReducedMotion`, `layoutId` tab pattern, `AnimatePresence mode="popLayout"`, `useAnimate`+`useInView`
- Existing codebase source files (read directly) — confirmed versions, imports, patterns, and all locked decisions

### Secondary (MEDIUM confidence)
- motion.dev/docs/react-accessibility — `useReducedMotion` + parallax disable pattern
- motion.dev/docs/react-layout-group — `LayoutGroup` + `layoutId` tab indicator pattern
- motion.dev/docs/animate — imperative `animate(from, to, { onUpdate })` for number animation

### Tertiary (LOW confidence)
- None flagged. All key claims verified via Context7 or direct codebase inspection.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Verified by reading `package.json` and existing source files directly
- Architecture: HIGH — Patterns verified via Context7 (framer-motion + motion.dev docs); anti-patterns derived from locked decisions in STATE.md
- Pitfalls: HIGH — Derived from official API semantics (Context7) + project-specific locked decisions (STATE.md) + direct code reading
- Content/data structure: MEDIUM — i18next `returnObjects` pattern is standard; specific content is placeholder pending client input

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (stable libraries; framer-motion 12 and react-router 7 are current stable)
