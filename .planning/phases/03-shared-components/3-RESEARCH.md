# Phase 3: Shared Components - Research

**Researched:** 2026-02-25
**Domain:** Framer Motion scroll-reveal, stagger, typewriter, RTL-aware animation wrappers + accessible reduced-motion
**Confidence:** HIGH

---

## Summary

Phase 3 builds the animation wrapper library that all page sections (Phase 4+) will compose. The deliverables are three components — `FadeInSection`, `StaggerContainer`, and `TypewriterText` — plus any UI primitives needed for consistent layout (Button, Card, Typography). All three animation components must be RTL-aware (horizontal slide direction flips for Arabic) and must respect `prefers-reduced-motion`.

The existing codebase already provides all the infrastructure this phase needs: `useDirection()` hook for reading dir/isRTL, `pageTransitionVariants` pattern for custom-prop RTL variants, and `luxuryEase` constant. The task is to apply these established patterns to scroll-triggered and stagger contexts rather than inventing new ones.

The `motion` library's `whileInView` + `viewport` prop is the cleanest approach for `FadeInSection` — it keeps all animation state inside the motion component with zero imperative code, and the `once: true` option prevents repeat-trigger jank. For `StaggerContainer` with 20 cards, stagger delay must be kept short (0.05–0.08s) so that the last card begins within ~1s of the first, and animations must be opacity+translateY only (no width/height changes) to avoid layout recalculation. For `TypewriterText`, character-level `motion.span` stagger is the correct pure-motion approach; no external typewriter library is needed.

**Primary recommendation:** Use `whileInView` + `viewport={{ once: true, amount: 0.2 }}` for FadeInSection, staggerChildren variants for StaggerContainer, and character-split `motion.span` stagger for TypewriterText. Wrap the entire component tree in `<MotionConfig reducedMotion="user">` in AppProviders so all three components automatically degrade to static content when the system preference is active.

---

## Standard Stack

### Core (already installed — no new dependencies)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| motion (framer-motion) | 12.34.3 | whileInView, useInView, staggerChildren, motion.span | Already installed; provides all scroll-trigger, stagger, and typewriter primitives |
| react-i18next | 16.5.4 | useTranslation / i18n.dir() for RTL detection | Already installed; useDirection() hook wraps this |
| tailwindcss | 4.2.1 | Logical properties for RTL-safe spacing in wrapper components | Already installed |

### No New Installations Needed

All libraries required for Phase 3 are already installed. The phase is a pure code authoring task.

```bash
# No new packages — already available:
# motion (whileInView, useInView, motion.span, AnimatePresence, MotionConfig)
# react-i18next (useTranslation, i18n.dir)
```

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `whileInView` (declarative) | `useInView` + `useAnimation` (imperative) | `whileInView` is simpler and has identical performance; use `useInView` only if you need fine-grained JavaScript-level control after visibility changes |
| `staggerChildren` in variants | `stagger()` utility function | `staggerChildren` is the proven pattern; `stagger()` is useful for imperative `useAnimate` workflows |
| `motion.span` character split | external typewriter library | External libraries add weight and lose RTL awareness; `motion.span` stagger is purpose-built for this |
| `MotionConfig reducedMotion="user"` | `useReducedMotion()` per-component | `MotionConfig` is global and zero-maintenance; `useReducedMotion` needed only for custom fallback logic beyond the default transform-disable behavior |

---

## Architecture Patterns

### Recommended Project Structure (Phase 3 additions)

```
src/
├── components/
│   ├── ui/                          # NEW — primitive UI building blocks
│   │   ├── Button.tsx               # CTA button with brand tokens
│   │   ├── Card.tsx                 # Content card with gradient placeholder
│   │   └── Typography.tsx           # Heading/body wrapper enforcing font tokens
│   └── animations/                  # NEW — animation wrapper components
│       ├── FadeInSection.tsx        # Scroll-reveal: fade + slide in on viewport entry
│       ├── StaggerContainer.tsx     # Stagger: orchestrates child reveal timing
│       └── TypewriterText.tsx       # Types characters one-by-one, RTL-aware
│
├── animations/
│   └── variants.ts                  # EXTEND — add scroll/stagger/typewriter variants
│
└── providers/
    └── AppProviders.tsx             # EXTEND — add <MotionConfig reducedMotion="user">
```

### Pattern 1: FadeInSection — whileInView with RTL-aware slide

**What:** A wrapper that reveals its children with a fade + directional slide when the section enters the viewport. Horizontal slide direction respects RTL. After entering once, the element stays visible.

**When to use:** Around every major section on a page — Hero, StatsBar, ServicesTeaser, Testimonials, etc.

**Why `whileInView` over `useInView` + `useAnimation`:** Declarative — all animation state lives in the props. No `useEffect`, no imperative `controls.start()`, no ref wiring beyond what motion handles internally.

**Example:**
```typescript
// src/components/animations/FadeInSection.tsx
// Source: motion.dev whileInView + viewport API
import { motion } from 'motion/react';
import { useDirection } from '../../hooks/useDirection';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;          // seconds; default 0
  slideDistance?: string;  // default '24px'
}

export function FadeInSection({
  children,
  className,
  delay = 0,
  slideDistance = '24px',
}: FadeInSectionProps) {
  const { isRTL } = useDirection();

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: isRTL ? slideDistance : `-${slideDistance}`,
        // Note: use x for horizontal-biased reveals; use y for vertical reveals
        // For purely vertical: initial={{ opacity: 0, y: '24px' }}
      }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],   // luxuryEase — matches page transitions
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Critical note — RTL with `whileInView`:** Unlike `pageTransitionVariants` (which uses the `custom` prop + variant functions for AnimatePresence exit), `FadeInSection` does NOT use AnimatePresence and does NOT need exit animations. The simpler approach of reading `isRTL` directly at render time and computing `initial.x` inline is correct here. The component does not unmount during a page transition, so stale-direction issues do not apply.

**For purely vertical reveals** (sections that are wide, no meaningful horizontal axis): use `y: '24px'` in initial instead. This is RTL-safe by default since vertical axis has no direction.

### Pattern 2: StaggerContainer — orchestrated child reveals

**What:** A container that uses `staggerChildren` in its transition to make each direct child animate in sequence. Children use a shared `itemVariants` export and the parent triggers them via variant propagation.

**When to use:** Service cards grid, testimonial cards, course cards — any grid of 2–20 items.

**Performance constraint:** With 20 cards, stagger delay must be `0.05–0.08s` maximum. With `staggerDelay = 0.06s`, the 20th card begins at 1.14s — still within the "instant" perceptual window. Beyond 20 simultaneously animated elements, paginate or virtualize.

**Example:**
```typescript
// src/components/animations/StaggerContainer.tsx
// Source: motion.dev variants + staggerChildren API
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,   // small delay before first child starts
    },
  },
};

// Export so children can import and use the same variant key names
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;   // seconds between children; default 0.06
  delayStart?: number;     // initial delay before first child; default 0.1
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.06,
  delayStart = 0.1,
}: StaggerContainerProps) {
  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delayStart,
      },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**RTL note for stagger:** Stagger direction (first→last) is reading order. In RTL, the visual grid runs right→left. The `staggerChildren` mechanism staggers in DOM order (which matches the React render order). If the grid uses CSS `flex-direction: row` in LTR and RTL mirrors via `dir="rtl"`, the DOM order remains left-to-right but the visual is right-to-left — meaning the first card in DOM order is the rightmost card visually in RTL. This creates a right-to-left stagger cascade in Arabic, which is the correct reading-direction behavior. No custom logic needed.

### Pattern 3: TypewriterText — character-level motion.span stagger

**What:** Splits a string character by character, wraps each in a `motion.span`, and staggers opacity reveal to simulate typing.

**When to use:** Hero section primary tagline (HOME-01). One use only — not for body text.

**RTL direction:** Arabic text split by `text.split('')` produces correct character order. The `dir="rtl"` on `<html>` handles visual rendering order — characters appear right-to-left on screen because the containing span inherits RTL. No JavaScript direction logic is needed in the character loop.

**Example:**
```typescript
// src/components/animations/TypewriterText.tsx
// Source: sushilcodes.in pattern + motion.dev stagger
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,  // 40ms per character — readable but snappy
    },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0 },  // snap in — no fade, pure typewriter feel
  },
};

interface TypewriterTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function TypewriterText({
  text,
  className,
  as: Tag = 'h1',
}: TypewriterTextProps) {
  const MotionTag = motion[Tag];   // motion.h1, motion.h2, etc.

  return (
    <MotionTag
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}       // screen reader gets full text, not character-by-character
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          aria-hidden="true"  // individual chars hidden from screen reader
        >
          {char === ' ' ? '\u00A0' : char}  {/* preserve spaces as non-breaking */}
        </motion.span>
      ))}
    </MotionTag>
  );
}
```

**Note on `motion[Tag]` pattern:** In framer-motion v12 / motion/react, dynamic element tags require `motion[elementName]` — e.g., `motion['h1']` is valid. Alternatively, render a `motion.div` and use CSS to override semantics, or define separate named exports per tag. The cleanest TypeScript approach is to use an `as` prop with a lookup object.

### Pattern 4: MotionConfig reducedMotion in AppProviders

**What:** `<MotionConfig reducedMotion="user">` wraps the app at provider level so all child `motion.*` components automatically skip transform and layout animations when the OS prefers reduced motion. Opacity and color transitions are preserved.

**When to use:** Always. Add to AppProviders.tsx in Phase 3. This single addition covers FadeInSection, StaggerContainer, TypewriterText, and all future motion components — no per-component logic needed.

**Example:**
```typescript
// src/providers/AppProviders.tsx — addition
// Source: motion.dev/docs/react-motion-config + accessibility guide
import { MotionConfig } from 'motion/react';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </I18nextProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
```

**Behavior when reduced motion active:** `x`, `y`, `scale`, `rotate` animations are disabled and elements jump to their final state immediately. `opacity` transitions are preserved (e.g., a 0→1 fade still works). `duration: 0` is NOT used — Motion handles this internally.

### Pattern 5: UI Primitives — thin Tailwind wrappers

**What:** Button, Card, Typography are thin wrappers that enforce the brand token vocabulary. They do NOT add animation — they are composable containers that FadeInSection or StaggerContainer wraps.

**When to use:** Page sections import these instead of raw HTML elements. This prevents token drift (e.g., accidentally using `text-blue-500` instead of `text-seagrass-600`).

**Example:**
```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
}

export function Button({ variant, children, className, onClick, as: Tag = 'button', href }: ButtonProps) {
  const base = 'inline-flex items-center px-6 py-3 font-body text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seagrass-500';
  const variants = {
    primary: 'bg-stormy-teal-950 text-celadon-100 hover:bg-deep-ocean-900 dark:bg-seagrass-600 dark:hover:bg-seagrass-500',
    ghost: 'border border-seagrass-500 text-seagrass-600 hover:bg-seagrass-500/10 dark:text-seagrass-400 dark:border-seagrass-400',
  };
  return <Tag href={href} onClick={onClick} className={[base, variants[variant], className].join(' ')}>{children}</Tag>;
}
```

```typescript
// src/components/ui/Card.tsx — brand card with gradient placeholder slot
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hasPlaceholder?: boolean;
  placeholderVariant?: 'primary' | 'card' | 'hero';
}

export function Card({ children, className, hasPlaceholder, placeholderVariant = 'card' }: CardProps) {
  return (
    <article className={['rounded-lg overflow-hidden bg-surface-ivory dark:bg-surface-dark-card', className].join(' ')}>
      {hasPlaceholder && (
        <div className={`placeholder-gradient-${placeholderVariant} placeholder-aspect-card`} aria-hidden="true" />
      )}
      <div className="p-6">{children}</div>
    </article>
  );
}
```

### Anti-Patterns to Avoid

- **Animating `height`, `width`, or `top`/`left` in scroll triggers:** Causes layout recalculation on every frame. Use `opacity` + `y` (transform) only.
- **Using `useAnimation` + `controls.start()` when `whileInView` suffices:** Adds imperative complexity. Use `whileInView` declaratively unless you need to programmatically trigger the animation from a non-scroll event.
- **Static `initial.x` values without RTL awareness:** `initial={{ x: -24 }}` slides wrong in Arabic. Always read `isRTL` and flip sign.
- **`whileInView` without `viewport={{ once: true }}`:** Without `once`, the animation replays every time the element exits and re-enters the viewport — jarring on scroll-back. Always set `once: true` for reveal animations.
- **Wrapping TypewriterText in FadeInSection:** Double-animating the same element conflicts. TypewriterText should animate itself; do not nest it inside FadeInSection.
- **Not setting `aria-label` on TypewriterText container:** Screen readers would read each character individually if `aria-label` is missing and `aria-hidden` is not set on spans.
- **Placing `<MotionConfig>` inside ThemeProvider or BrowserRouter:** MotionConfig must be the outermost wrapper to reach all motion components including those rendered by router outlets.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Viewport detection for scroll reveal | Custom IntersectionObserver hook | `whileInView` + `viewport` prop on `motion.div` | IntersectionObserver management (cleanup, ref attachment, threshold computation) has edge cases; motion handles it correctly and integrates with the animation system |
| Reduced motion detection | `window.matchMedia('(prefers-reduced-motion: reduce)')` listener in every component | `<MotionConfig reducedMotion="user">` at provider level | Custom listener needs cleanup, reactivity on setting change, and conditional prop logic per component; MotionConfig handles all of it with zero per-component code |
| Character stagger timing | `setTimeout` array building characters | `motion.span` + `staggerChildren` | setTimeout approach breaks during re-renders and does not integrate with prefers-reduced-motion; motion stagger is interrupt-safe |
| Stagger counter tracking | `useState` child index, `useEffect` on count | `staggerChildren` transition property on parent variant | Parent-driven stagger via variants propagates automatically to any number of children without tracking state |

**Key insight:** The motion library was specifically designed to make these patterns declarative. Imperative approaches (setTimeout, IntersectionObserver, animation counters) require careful lifecycle management that motion abstracts away.

---

## Common Pitfalls

### Pitfall 1: Static `initial.x` direction ignoring RTL

**What goes wrong:** `initial={{ x: -24 }}` looks correct in LTR (slides in from the left). In Arabic RTL, Arabic readers expect content to enter from the right — the slide comes from the wrong side.

**Why it happens:** `x` is always a physical left/right value, not a logical inline-start/inline-end value. No CSS logical property applies to Framer Motion `x`.

**How to avoid:** Always read `isRTL` from `useDirection()` and flip sign: `x: isRTL ? slideDistance : -slideDistance`. For vertical-only reveals, use `y` — vertical axis has no reading direction.

**Warning signs:** Component looks right in LTR, but in Arabic mode the reveal slide appears to come from behind the content rather than from the reading start.

### Pitfall 2: Missing `viewport={{ once: true }}` causing re-animation on scroll-back

**What goes wrong:** User scrolls down through an FadeInSection, then scrolls back up past it. The animation replays, which looks broken on a luxury brand site — content disappears then re-animates.

**Why it happens:** Default `whileInView` behavior applies `whileInView` state when in-view and reverts to `initial` when out-of-view.

**How to avoid:** Always set `viewport={{ once: true }}`. The element animates in once and stays at final state.

**Warning signs:** Running the finished site: scroll down through a section, then scroll back up — if the section fades/slides again, `once: true` is missing.

### Pitfall 3: Stagger delay too long for 20-card grids

**What goes wrong:** With `staggerChildren: 0.15`, the 20th card begins animating at 3 seconds. Users see a mostly-empty grid for 3 seconds, which reads as broken loading.

**Why it happens:** Stagger delays designed for 4–6 items (0.1–0.2s) become untenable at 20+ items.

**How to avoid:** For a 20-item grid, keep `staggerChildren: 0.05–0.08`. With 0.06s, item 20 begins at 1.14s — within the ~1s window that reads as "animated" rather than "loading."

**Warning signs:** DevTools Performance timeline shows the stagger group taking >2 seconds total. The last items in a large grid feel like they arrive too late.

### Pitfall 4: `MotionConfig` placed inside a Provider that re-renders on animation

**What goes wrong:** If `MotionConfig` is placed inside `ThemeProvider` and `ThemeProvider` re-renders (e.g., during theme toggle), every `motion.*` component under `MotionConfig` briefly remounts, which can interrupt in-progress animations.

**Why it happens:** Context value changes propagate re-renders. `MotionConfig` is a context provider itself — nesting it inside another frequently-changing provider causes unnecessary tree updates.

**How to avoid:** Place `<MotionConfig reducedMotion="user">` as the outermost wrapper in `AppProviders`, above `ThemeProvider`, `I18nextProvider`, and `BrowserRouter`. It never changes after initial render, so no re-render cascade occurs.

**Warning signs:** Page transition animations stutter or reset during a theme toggle.

### Pitfall 5: TypewriterText re-typing on parent re-render

**What goes wrong:** When a parent component re-renders (e.g., language change), `TypewriterText` remounts and starts typing from the beginning again mid-scroll. This breaks the cinematic feel.

**Why it happens:** If the parent re-renders and the `key` prop on `TypewriterText` changes (or if the component's position in the tree changes), React unmounts and remounts it.

**Why it happens (variant 2):** When language changes, the `text` prop changes. If `animate="visible"` is running and the component re-renders with new text, motion restarts the stagger from index 0 with the new text.

**How to avoid:** Use `animate` with a stable key — do not pass the text as the React key. Use `initial="hidden" animate="visible"` with no AnimatePresence around it. The component types once and stays. For the hero, this is correct: language change reloads the page route anyway (via AnimatePresence page transition), so TypewriterText gets a clean mount naturally.

**Warning signs:** Retyping animation triggers when switching language while viewing the hero.

### Pitfall 6: TypewriterText empty `aria-label` crashing screen reader flow

**What goes wrong:** With individual `motion.span` per character, a screen reader announces each character separately: "L... u... m... i... è... r... e...". This is inaccessible.

**How to avoid:** Set `aria-label={text}` on the container element and `aria-hidden="true"` on each `motion.span`. Screen readers read the full text once from the aria-label; the visual animation plays for sighted users.

---

## Code Examples

Verified patterns from official sources and project conventions:

### Adding MotionConfig to AppProviders

```typescript
// src/providers/AppProviders.tsx
// Source: motion.dev/docs/react-motion-config (verified via WebSearch)
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from './ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../i18n/config';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <I18nextProvider i18n={i18n}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </I18nextProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
```

### FadeInSection — vertical reveal (RTL-safe, no horizontal ambiguity)

```typescript
// src/components/animations/FadeInSection.tsx
// Pattern: y-only reveal — no RTL consideration needed
// Source: motion.dev whileInView API (verified via WebSearch)
import { motion } from 'motion/react';

interface FadeInSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function FadeInSection({ children, className, delay = 0 }: FadeInSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

**Design decision:** Use vertical-only (`y`) for FadeInSection so there is no RTL complication. Horizontal slides are reserved for page transitions (already implemented). For section reveals, a subtle upward fade matches editorial luxury patterns without directional ambiguity.

### StaggerContainer + StaggerItem usage

```typescript
// src/components/animations/StaggerContainer.tsx
// Source: motion.dev variants/staggerChildren API (verified via WebSearch)
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.06,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerDelay, delayChildren: 0.05 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Usage in service card grid:
// <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//   {services.map(s => (
//     <motion.div key={s.id} variants={staggerItemVariants}>
//       <ServiceCard {...s} />
//     </motion.div>
//   ))}
// </StaggerContainer>
```

### TypewriterText — final implementation

```typescript
// src/components/animations/TypewriterText.tsx
// Source: character stagger pattern (verified via multiple sources)
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

const STAGGER_DELAY = 0.04; // seconds per character — 40ms

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_DELAY },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0 } }, // snap-in, no fade
};

interface TypewriterTextProps {
  text: string;
  className?: string;
  tag?: keyof JSX.IntrinsicElements;
}

export function TypewriterText({ text, className, tag: Tag = 'h1' }: TypewriterTextProps) {
  const MotionEl = motion[Tag as 'h1'];
  return (
    <MotionEl
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={charVariants}
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </MotionEl>
  );
}
```

**Alternative for TypeScript strictness** (avoids dynamic `motion[Tag]`):

```typescript
// Explicit tag approach — simpler TypeScript inference
export function TypewriterText({ text, className }: { text: string; className?: string }) {
  return (
    <motion.h1
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {text.split('').map((char, i) => (
        <motion.span key={i} variants={charVariants} aria-hidden="true">
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
```

### Extending variants.ts with scroll/stagger variant exports

```typescript
// src/animations/variants.ts — additions for Phase 3
// Keep pageTransitionVariants and pageFadeVariants as-is; add:

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainerVariants = (staggerDelay = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerDelay, delayChildren: 0.05 },
  },
});

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `useAnimation()` + `controls.start()` + `useInView()` + `useEffect` | `whileInView` + `viewport` prop | Framer Motion v5+ | Removes 15+ lines of boilerplate per component; no imperative control flow needed for basic scroll reveals |
| Per-component `useReducedMotion()` check | `<MotionConfig reducedMotion="user">` at provider level | Framer Motion v6+ | Single global declaration; no per-component conditional logic |
| `import { motion } from 'framer-motion'` | `import { motion } from 'motion/react'` | Nov 2024 (rebranding) | Same code, new import path; project already uses `motion/react` via framer-motion@12 |
| Character stagger via external typewriter library | `motion.span` with `staggerChildren` | Current (motion v12) | No external dependency; correct prefers-reduced-motion behavior built in |

**Deprecated/outdated:**
- `AnimationControls` + `useAnimation`: Still works, but unnecessary for viewport-triggered reveals. Use `whileInView`.
- `exitBeforeEnter` on AnimatePresence: Renamed to `mode="wait"` — already using correct API.

---

## Open Questions

1. **TypewriterText `motion[Tag]` TypeScript strictness in motion v12**
   - What we know: Dynamic `motion['h1']` works at runtime. TypeScript may complain about index-signature access on the motion object depending on strict mode and motion version.
   - What's unclear: Whether motion v12's TypeScript definitions explicitly support `motion[tag]` as an index signature.
   - Recommendation: During Task authoring, try the dynamic approach first. If TypeScript errors, fall back to explicit `motion.h1` with the `as` prop handled via CSS `display` semantics, or use a `switch` statement on the `tag` prop.

2. **Button component — link variant with `<a>` vs `<Link>`**
   - What we know: Some buttons will be internal navigation (→ `<Link>` from react-router-dom), some will be external (→ `<a href>`).
   - What's unclear: Whether to build Button to accept `<Link>` integration now or defer to page-level composition.
   - Recommendation: Build Button to accept `as="a" href="..."` for external links. For internal routes, page sections can compose `<Link><Button variant="primary">...</Button></Link>` rather than adding router coupling to the primitive.

3. **FadeInSection horizontal vs vertical direction**
   - What we know: Vertical-only (`y`) FadeInSection avoids RTL complexity. Horizontal slide (`x`) is already covered by page transitions.
   - What's unclear: Whether any section will require a horizontal slide reveal (e.g., stats bar sliding in from the side).
   - Recommendation: Default to vertical-only. If Phase 4 content requires horizontal reveals for specific sections, the RTL-aware `isRTL ? x : -x` pattern is well-understood and can be added then.

---

## Sources

### Primary (HIGH confidence)

- motion.dev/docs/react-scroll-animations — whileInView, viewport options (once, amount, margin, root) — verified via WebSearch finding official docs link
- motion.dev/docs/react-use-in-view — useInView hook API (alternative to whileInView for imperative control)
- motion.dev/docs/react-motion-config — MotionConfig reducedMotion="user" behavior (transform/layout disabled, opacity preserved)
- motion.dev/docs/react-accessibility — MotionConfig global reduced motion pattern
- Existing project codebase — `src/animations/variants.ts`, `src/hooks/useDirection.ts`, `src/components/navigation/MobileMenu.tsx` — established patterns for luxuryEase, RTL custom prop, variant functions
- Project PITFALLS.md — performance guidance (animate transform/opacity only, limit simultaneous elements to ~10, prefers-reduced-motion)

### Secondary (MEDIUM confidence)

- [sinja.io — Direction-aware animations in Framer Motion](https://sinja.io/blog/direction-aware-animations-in-framer-motion) — custom prop approach for RTL, `AnimatePresence custom` pass-through (verified against existing project implementation)
- [victoreke.com — Scroll reveal in React using Framer Motion](https://victoreke.com/blog/scroll-reveal-animation-in-react-using-framer-motion) — useInView + useAnimation pattern (confirmed as legacy approach; whileInView is current)
- [sushilcodes.in — Typewriter animation with Framer Motion](https://www.sushilcodes.in/blogpost/typewriter-animation-react-framer-motion) — character split + stagger pattern (verified: multiple sources agree)
- WebSearch results on staggerChildren stagger delay recommendations (limit to ~10, 0.05–0.08s for larger lists)
- WebSearch results on MotionConfig reducedMotion="user" behavior — cross-referenced with official docs links

### Tertiary (LOW confidence)

- Dynamic `motion[Tag]` TypeScript index-signature behavior in motion v12 — flagged as Open Question; not verified against TypeScript definitions directly

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new libraries; all tools verified via existing project + official docs
- Architecture patterns: HIGH — whileInView, staggerChildren, motion.span patterns verified via official docs + multiple community sources
- RTL animation patterns: HIGH — directly extends established project pattern (luxuryEase, custom prop, isRTL from useDirection)
- Pitfalls: HIGH — derived from official docs behavior (once:true, MotionConfig placement) + project PITFALLS.md (animate transform/opacity only)
- TypewriterText dynamic tag TypeScript: LOW — flagged as open question

**Research date:** 2026-02-25
**Valid until:** 2026-03-25 (motion library stable; patterns established)
