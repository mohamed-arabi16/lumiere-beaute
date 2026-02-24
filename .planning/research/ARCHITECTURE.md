# Architecture Research

**Domain:** Premium multilingual beauty center website (React SPA)
**Researched:** 2026-02-24
**Confidence:** HIGH (core patterns verified via official docs + multiple credible sources)

---

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PROVIDER SHELL                               │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐    │
│  │ ThemeProvider│  │  I18nProvider│  │   React Router DOM     │    │
│  │ (dark/light) │  │ (TR/EN/AR)   │  │  (BrowserRouter)       │    │
│  └──────┬───────┘  └──────┬───────┘  └────────────┬───────────┘    │
│         │                 │                        │                │
├─────────┴─────────────────┴────────────────────────┴────────────────┤
│                        LAYOUT SHELL                                 │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  RootLayout (Navbar + AnimatePresence wrapper)              │   │
│  │  - Applies dir="rtl/ltr" on <html>                         │   │
│  │  - Applies dark/light class on <html>                      │   │
│  │  - Renders <Navbar>, then <AnimatedOutlet>                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                        PAGE LAYER                                   │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐ ┌──────────┐  │
│  │  HomePage │ │ Services  │ │  Academy  │ │ About│ │ Contact  │  │
│  │           │ │    Page   │ │    Page   │ │ Page │ │   Page   │  │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └──┬───┘ └────┬─────┘  │
│        │             │             │           │          │         │
├────────┴─────────────┴─────────────┴───────────┴──────────┴─────────┤
│                        COMPONENT LIBRARY                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────────┐   │
│  │ ui/        │ │ sections/  │ │ animations/│ │ forms/         │   │
│  │ Button     │ │ Hero       │ │ PageTrans- │ │ ContactForm    │   │
│  │ Card       │ │ ServiceGrid│ │ ition      │ │ (EmailJS)      │   │
│  │ Typography │ │ Testimonial│ │ FadeIn     │ │                │   │
│  └────────────┘ └────────────┘ └────────────┘ └────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                        CROSS-CUTTING CONCERNS                       │
│  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────────────┐  │
│  │  useTheme hook  │ │ useDirection    │ │   Translation JSON   │  │
│  │  localStorage   │ │ hook (RTL/LTR)  │ │   locales/           │  │
│  │  persistence    │ │ i18n.dir()      │ │   tr/ en/ ar/        │  │
│  └─────────────────┘ └─────────────────┘ └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| AppProviders | Composes all context providers in correct nesting order | Wraps children with ThemeProvider > I18nextProvider > BrowserRouter |
| ThemeProvider | Owns dark/light mode state, persists to localStorage, applies class to html element | React Context + useState + useEffect |
| RootLayout | Navbar + page outlet + AnimatePresence, manages dir attribute on html element | React Router Outlet pattern |
| AnimatedOutlet | Bridges React Router v6 Outlet with Framer Motion AnimatePresence | useOutlet hook + AnimatePresence |
| Navbar | Language switcher, theme toggle, navigation links, RTL-aware layout | Uses useTranslation, useTheme, useDirection |
| PageTransitionWrapper | Wraps each page in motion.div with enter/exit variants | motion.div with variants prop |
| HomePage | Assembles Hero, Stats, ServicesTeaser, AcademyTeaser, Testimonials sections | Composition of section components |
| ServicesPage | Filterable service catalog with category tabs and animated grid | Local state for active category filter |
| AcademyPage | 2 courses, curriculum accordion, instructor bio, enroll CTA | Static content via translation keys |
| AboutPage | Brand story, team grid, values section | Static content via translation keys |
| ContactPage | EmailJS form, WhatsApp CTA, FAQ accordion | useContactForm hook |
| Section components | Individual visual sections (Hero, ServiceGrid, etc.) | Receive t() function, use motion.div for reveal animations |
| useTheme | Exposes { theme, toggleTheme } to any component | Consumes ThemeContext |
| useDirection | Exposes { dir, isRTL } derived from current i18n language | Reads i18n.dir() and i18n.language |
| useContactForm | Form state, EmailJS submission, WhatsApp message builder | useState + EmailJS SDK |

---

## Recommended Project Structure

```
src/
├── i18n/
│   ├── config.ts               # i18next initialization, language detection, fallback
│   └── locales/
│       ├── tr/
│       │   ├── common.json     # Shared strings: nav, buttons, footer
│       │   ├── home.json       # Home page sections
│       │   ├── services.json   # Service names and descriptions
│       │   ├── academy.json    # Course content, curriculum
│       │   ├── about.json      # Brand story, team, values
│       │   └── contact.json    # Form labels, FAQ
│       ├── en/
│       │   └── (same structure)
│       └── ar/
│           └── (same structure)
│
├── providers/
│   ├── AppProviders.tsx        # Composes ThemeProvider + I18nextProvider + Router
│   └── ThemeProvider.tsx       # Dark/light context + localStorage persistence
│
├── hooks/
│   ├── useTheme.ts             # Consumes ThemeContext
│   ├── useDirection.ts         # Derives RTL/LTR from i18n.language
│   └── useContactForm.ts       # EmailJS + WhatsApp form logic
│
├── layouts/
│   ├── RootLayout.tsx          # Navbar + AnimatedOutlet, applies dir + dark class
│   └── AnimatedOutlet.tsx      # useOutlet + AnimatePresence bridge component
│
├── pages/
│   ├── HomePage.tsx
│   ├── ServicesPage.tsx
│   ├── AcademyPage.tsx
│   ├── AboutPage.tsx
│   └── ContactPage.tsx
│
├── components/
│   ├── ui/                     # Primitive reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   └── Typography.tsx
│   ├── sections/               # Page section compositions
│   │   ├── Hero.tsx
│   │   ├── StatsBar.tsx
│   │   ├── ServiceGrid.tsx
│   │   ├── ServiceCard.tsx
│   │   ├── AcademyTeaser.tsx
│   │   ├── TestimonialsCarousel.tsx
│   │   ├── CourseCard.tsx
│   │   ├── CurriculumAccordion.tsx
│   │   ├── InstructorBio.tsx
│   │   ├── TeamGrid.tsx
│   │   ├── BrandStory.tsx
│   │   ├── ContactForm.tsx
│   │   ├── WhatsAppCTA.tsx
│   │   └── FAQAccordion.tsx
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── ThemeToggle.tsx
│   └── animations/
│       ├── PageTransitionWrapper.tsx  # Per-page motion.div variants
│       ├── FadeInSection.tsx          # Scroll-triggered section reveal
│       ├── StaggerContainer.tsx       # Staggered child reveals
│       └── TypewriterText.tsx         # Text typing effect
│
├── animations/
│   └── variants.ts             # Shared Framer Motion variant definitions
│
├── styles/
│   └── globals.css             # Tailwind base layer, CSS custom properties for colors
│
├── router.tsx                  # Route definitions
└── main.tsx                    # Entry point: mounts <AppProviders>
```

### Structure Rationale

- **i18n/locales/[lang]/[namespace].json:** Namespace-per-page ensures lazy-loading is possible — only the translations for the current page need to load. Flat namespaces (tr/en/ar at top of locale dir) with page-level splitting is the react-i18next recommended pattern.
- **providers/:** Isolating AppProviders from App.tsx keeps main.tsx clean and makes provider nesting explicit and testable.
- **hooks/:** Custom hooks encapsulate side-effectful logic (direction setting, theme persistence, form submission) away from JSX components.
- **layouts/:** AnimatedOutlet is in layouts because it is a structural concern that wraps all page rendering, not a reusable component.
- **components/sections/:** Section components are page-scoped but not route-scoped. They consume translation keys via useTranslation and are composed inside page files.
- **animations/variants.ts:** Centralized variant definitions prevent duplication and allow RTL-aware variant functions to be reused across all components.

---

## Architectural Patterns

### Pattern 1: AppProviders Composition

**What:** A single AppProviders component that nests all context providers in the correct dependency order, wrapping the entire app tree.

**When to use:** Always. Never scatter Provider components across random places in the tree.

**Trade-offs:** Single place to understand global context dependencies. Order matters — ThemeProvider must wrap children before Router so layout can access theme.

**Example:**
```typescript
// src/providers/AppProviders.tsx
import { ThemeProvider } from './ThemeProvider';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter } from 'react-router-dom';
import i18n from '../i18n/config';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </I18nextProvider>
    </ThemeProvider>
  );
}
```

---

### Pattern 2: AnimatedOutlet for React Router v6 + Framer Motion

**What:** A custom AnimatedOutlet component that uses React Router's `useOutlet` hook to render the current route element as a direct child of `AnimatePresence`. The layout component that contains Navbar lives outside AnimatePresence so it persists across route changes.

**When to use:** Required whenever Framer Motion page transitions are needed with React Router v6. Standard `<Outlet>` cannot be directly wrapped by AnimatePresence because exit animations need to control unmounting.

**Trade-offs:** Slightly more complexity than a naive Outlet, but the only reliable way to get exit animations on route changes. The `key` on `AnimatePresence` must be the route location.

**Example:**
```typescript
// src/layouts/AnimatedOutlet.tsx
import { useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export function AnimatedOutlet() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {element && React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}

// src/layouts/RootLayout.tsx
export function RootLayout() {
  return (
    <>
      <Navbar />
      <AnimatedOutlet />
    </>
  );
}
```

---

### Pattern 3: Unified Direction + Theme Effect in RootLayout

**What:** RootLayout runs two `useEffect` calls — one for theme, one for language direction — that both write to the `<html>` element's class and dir attributes. These are the single source of truth for all CSS cascade behavior.

**When to use:** This effect placement ensures direction and theme updates happen at the root DOM level before any child renders, preventing flash of wrong direction.

**Trade-offs:** Coupling direction logic to the layout layer means it runs on every language change automatically. Must use `i18n.on('languageChanged', callback)` to respond to mid-session language switches.

**Example:**
```typescript
// src/layouts/RootLayout.tsx
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';

export function RootLayout() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  // Apply theme class to html element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply dir attribute to html element on language change
  useEffect(() => {
    const updateDir = () => {
      document.documentElement.dir = i18n.dir();
      document.documentElement.lang = i18n.language;
    };
    updateDir();
    i18n.on('languageChanged', updateDir);
    return () => i18n.off('languageChanged', updateDir);
  }, [i18n]);

  return (
    <>
      <Navbar />
      <AnimatedOutlet />
    </>
  );
}
```

---

### Pattern 4: RTL-Aware Framer Motion Variants

**What:** Framer Motion animation variants defined as functions (using the `custom` prop) that flip x-axis values based on document direction. This ensures slide animations go the correct way in both LTR and RTL contexts.

**When to use:** Any animation that has a horizontal component (slide-in, slide-out) must be RTL-aware. Opacity-only animations do not need this.

**Trade-offs:** Requires passing `custom` prop to both `AnimatePresence` and individual `motion.div` elements. Adds a parameter to otherwise simple variant definitions.

**Example:**
```typescript
// src/animations/variants.ts
export type AnimDirection = 'ltr' | 'rtl';

export const slidePageVariants = {
  initial: (dir: AnimDirection) => ({
    opacity: 0,
    x: dir === 'rtl' ? '-60px' : '60px',
  }),
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  },
  exit: (dir: AnimDirection) => ({
    opacity: 0,
    x: dir === 'rtl' ? '60px' : '-60px',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }),
};

// Usage in PageTransitionWrapper:
export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const { dir } = useDirection();
  return (
    <motion.div
      custom={dir}
      variants={slidePageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}
```

---

### Pattern 5: Namespace-Per-Page Translation Loading

**What:** Each page component declares its own translation namespaces with `useTranslation(['common', 'pageName'])`. The common namespace holds shared strings. Page namespaces hold page-specific copy. All text in every component comes from `t()` — zero hardcoded strings.

**When to use:** Always. With 5 pages across 3 languages, having page-scoped namespaces keeps files small and avoids loading all 15 JSON files upfront.

**Trade-offs:** Requires discipline to maintain namespace consistency. Typos in namespace names silently fall back to key display. Use TypeScript key typing or i18next-typed to catch errors.

**Example:**
```typescript
// src/pages/ServicesPage.tsx
import { useTranslation } from 'react-i18next';

export function ServicesPage() {
  const { t } = useTranslation(['common', 'services']);

  return (
    <PageTransitionWrapper>
      <h1>{t('services:hero.title')}</h1>
      <ServiceGrid categories={t('services:categories', { returnObjects: true })} />
    </PageTransitionWrapper>
  );
}
```

---

### Pattern 6: Logical Properties for Automatic RTL Layout

**What:** Use Tailwind's logical property classes (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`) instead of physical direction classes (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`). Logical properties automatically mirror when `dir="rtl"` is set on the html element.

**When to use:** All spacing, positioning, and border utilities. This eliminates the need for conditional `rtl:` prefix classes in most layout situations.

**Trade-offs:** Requires team discipline to avoid falling back to physical properties. Some older Tailwind muscle memory to override. The payoff is dramatically less conditional class logic.

**Example:**
```typescript
// WRONG — requires rtl: variants:
<div className="ml-4 pl-6 border-l-2 left-0">

// CORRECT — works automatically in both directions:
<div className="ms-4 ps-6 border-s-2 start-0">
```

When a component truly needs different behavior (e.g. an arrow icon that should point right in LTR, left in RTL), use the `rtl:` variant sparingly:
```typescript
<ChevronRight className="rtl:rotate-180 transition-transform" />
```

---

## Data Flow

### Request Flow (Language Change)

```
User clicks language switcher (TR → AR)
    ↓
LanguageSwitcher calls i18n.changeLanguage('ar')
    ↓
i18next loads locales/ar/[active-namespaces].json (from bundled resources)
    ↓
i18n emits 'languageChanged' event
    ↓
RootLayout useEffect fires → sets document.documentElement.dir = 'rtl'
                           → sets document.documentElement.lang = 'ar'
    ↓
All useTranslation() hooks re-render with Arabic strings
    ↓
All rtl: Tailwind variants activate (via CSS cascade on html[dir="rtl"])
    ↓
AnimatePresence detects page re-render if route changes, plays transition
    ↓
Custom Framer Motion variants receive dir='rtl', flip x-axis values
```

### Request Flow (Theme Toggle)

```
User clicks ThemeToggle button
    ↓
toggleTheme() in ThemeContext called
    ↓
Theme state flips: 'light' → 'dark'
    ↓
useEffect fires: document.documentElement.classList.replace('light', 'dark')
    ↓
localStorage.setItem('theme', 'dark') persists preference
    ↓
All dark: Tailwind variants activate (via CSS cascade on html.dark)
    ↓
Tailwind transition utilities (transition-colors duration-300) animate color changes
```

### State Management (No External Store Needed)

```
ThemeContext (React Context)
    ↓ provides { theme, toggleTheme }
Navbar → ThemeToggle (reads theme, calls toggleTheme)
RootLayout (reads theme to apply html class)

i18next (external instance, not in React state)
    ↓ accessed via useTranslation() hook
All text-rendering components
RootLayout (subscribes to languageChanged event)
LanguageSwitcher (calls i18n.changeLanguage)

Local component state only:
ServicesPage → activeCategory (filter tab state)
ContactForm → formData, isSubmitting, submitStatus
```

### Key Data Flows

1. **Translation lookup:** Component calls `t('namespace:key')` → react-i18next looks up in loaded JSON → returns localized string. No prop drilling of text.

2. **RTL cascade:** i18next language change → html dir attribute → all Tailwind logical properties + rtl: variants activate via CSS without any React re-render cycle.

3. **Theme cascade:** ThemeContext state change → html class change → all dark: Tailwind variants activate via CSS cascade. Individual components do not manage their own theme state.

4. **Form submission:** ContactForm local state → EmailJS SDK call → success/error state displayed. Simultaneously, WhatsApp button constructs message from form state and opens `https://wa.me/` link. No shared state needed between these two paths.

5. **Page transition:** Route change detected by AnimatePresence via React key change → exit animation plays on outgoing page → incoming page mounts with enter animation. Direction of animation informed by current `dir` attribute read at transition time.

---

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (static content) | All content in JSON translation files. No backend needed. React Context for theme. i18next for language. Framer Motion for animations. |
| Add CMS later | Replace JSON files with API calls to headless CMS (Sanity, Contentful). i18next backend plugin handles lazy-fetching translations. No component changes needed — only i18n/config.ts changes. |
| Add booking system | Add a services/ layer with API calls. New BookingContext. Contact form upgrades to real booking API. All routing remains the same. |
| Multi-domain / locale subdomains | Add i18next-browser-languagedetector with path/subdomain detection. React Router base path configuration. No component changes. |

### Scaling Priorities

1. **First bottleneck:** Translation file size if content grows significantly. Fix: split namespaces more granularly, add i18next-http-backend for on-demand loading from server.
2. **Second bottleneck:** Animation performance on low-end mobile. Fix: use `will-change: transform` on animated elements, reduce animation complexity on `prefers-reduced-motion` via Framer Motion's `useReducedMotion` hook.

---

## Anti-Patterns

### Anti-Pattern 1: Hardcoding Text in Components

**What people do:** Write Arabic or English strings directly in JSX (`<h1>خدماتنا</h1>`) for components that are "obviously only used in one language context."

**Why it's wrong:** Defeats the entire i18n architecture. Any content update requires a code change. Translators cannot contribute without touching source code. The project brief explicitly requires all text externalized.

**Do this instead:** Every string lives in a translation JSON file. Even single-use strings. Even strings that "will never change."

---

### Anti-Pattern 2: Using Physical Tailwind Classes for Directional Spacing

**What people do:** Use `ml-4`, `pr-8`, `left-0`, `border-r-2` for layout spacing, then add `rtl:mr-4`, `rtl:pl-8`, `rtl:right-0` as overrides.

**Why it's wrong:** Doubles the class count on every element. Easy to miss one. Creates maintenance debt every time a spacing value changes (must update both physical and rtl: override).

**Do this instead:** Use logical Tailwind classes exclusively: `ms-4`, `pe-8`, `start-0`, `border-e-2`. They auto-flip on `dir="rtl"` with zero additional classes.

---

### Anti-Pattern 3: Wrapping Outlet Directly in AnimatePresence

**What people do:** `<AnimatePresence><Outlet /></AnimatePresence>` — seems logical.

**Why it's wrong:** AnimatePresence can only animate direct children it controls. `<Outlet>` renders its matched route internally, making it invisible to AnimatePresence's mount/unmount detection. Exit animations never fire.

**Do this instead:** Use the `useOutlet()` hook pattern (AnimatedOutlet component) to get the rendered element as a React node you control, then pass it as a direct child to AnimatePresence with a unique key.

---

### Anti-Pattern 4: Managing Theme State in Multiple Places

**What people do:** Manage `dark` class in Navbar component (where the toggle lives), leading to toggle knowing about DOM manipulation.

**Why it's wrong:** Violates single source of truth. If another component needs to read the current theme (e.g. to choose a gradient color), it has no reliable way to do so. Dark mode class on html element becomes out of sync with React state.

**Do this instead:** ThemeContext owns all theme state. The toggle button only calls `toggleTheme()`. The effect that writes to `document.documentElement.classList` lives in RootLayout or ThemeProvider, not in the toggle component.

---

### Anti-Pattern 5: Static Framer Motion Variant Objects for Horizontal Animations

**What people do:** Define `initial: { x: '100%' }` as a static object. Works in LTR. In Arabic RTL, content slides in from the wrong side.

**Why it's wrong:** Arabic readers expect content to enter from the right (their reading start), not the left. Identical slide direction in both LTR and RTL feels broken.

**Do this instead:** Use variant functions with `custom` prop that receive the current `dir` value and conditionally flip x-axis sign.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| EmailJS | Direct SDK call from useContactForm hook: `emailjs.sendForm(serviceId, templateId, formRef)` | Credentials in .env. No backend proxy needed. Form fields map to EmailJS template variables. |
| WhatsApp | URL construction: `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}` opened via `window.open()` | Message built from form state. No SDK needed. Phone number in .env or config file. |
| Google Fonts | CSS @import in globals.css for Cormorant Garamond + Inter. Preconnect link in index.html. | No JS dependency. Load both weights (regular, semibold, bold) upfront to avoid FOUT during animations. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| ThemeContext ↔ RootLayout | React Context subscription | RootLayout reads theme, writes to html element |
| i18next ↔ RootLayout | Event listener on 'languageChanged' | Not React state — use i18n.on() / i18n.off() for cleanup |
| i18next ↔ All Components | useTranslation() hook | Components never import translation JSON directly |
| AnimatedOutlet ↔ Pages | React Router location key | Key change triggers AnimatePresence re-animation |
| ContactForm ↔ EmailJS | Direct SDK call in hook | No shared state with other components |
| ContactForm ↔ WhatsApp | URL construction in hook | Same form data, different output format |
| Navbar ↔ LanguageSwitcher | Props + i18n.changeLanguage | Navbar renders LanguageSwitcher, passes no state |
| Navbar ↔ ThemeToggle | Props + useTheme hook | ThemeToggle reads from context, calls toggleTheme |

---

## Build Order Implications

The component dependencies create this natural build order. Each phase unblocks the next.

```
Phase 1: Foundation (no dependencies)
  i18n/config.ts
  locales/[lang]/common.json (nav strings only)
  ThemeProvider
  AppProviders
  globals.css (color system, typography)
  tailwind.config.ts (custom palette, dark mode class, RTL logical utilities)

Phase 2: Shell (depends on Phase 1)
  RootLayout (needs ThemeProvider + i18next)
  AnimatedOutlet (needs React Router + Framer Motion)
  animations/variants.ts (shared variant definitions)
  Navbar, LanguageSwitcher, ThemeToggle

Phase 3: Shared Components (depends on Phase 2)
  ui/ primitives (Button, Card, Typography)
  animations/ wrappers (PageTransitionWrapper, FadeInSection, StaggerContainer)

Phase 4: Page Sections (depends on Phase 3 + translation files)
  sections/Hero
  sections/ServiceCard, ServiceGrid
  sections/AcademyTeaser, CourseCard
  sections/Testimonials
  sections/BrandStory, TeamGrid
  sections/ContactForm, WhatsAppCTA, FAQAccordion

Phase 5: Pages + Routing (depends on Phase 4)
  pages/HomePage
  pages/ServicesPage
  pages/AcademyPage
  pages/AboutPage
  pages/ContactPage
  router.tsx (assembles routes)

Phase 6: Complete language content (parallel with Phase 4-5)
  All translation JSON files fully populated
  Arabic plural forms for service counts
  RTL-specific copy adjustments
```

---

## Sources

- [react-i18next Multiple Translation Files docs](https://react.i18next.com/guides/multiple-translation-files) — namespace organization, lazy loading (HIGH confidence)
- [i18next API reference — dir()](https://www.i18next.com/overview/api) — RTL direction detection via i18n.dir() (HIGH confidence)
- [Tailwind CSS Dark Mode official docs](https://tailwindcss.com/docs/dark-mode) — class-based approach, data-theme attribute, three-way toggle pattern (HIGH confidence)
- [FreeCodeCamp: Animating Routes with Framer Motion](https://www.freecodecamp.org/news/improve-user-experience-in-react-by-animating-routes-using-framer-motion/) — LocationProvider + AnimatePresence + useLocation key pattern (MEDIUM confidence)
- [Sinja.io: Direction-Aware Animations in Framer Motion](https://sinja.io/blog/direction-aware-animations-in-framer-motion) — custom prop + variant function pattern for directional control (MEDIUM confidence)
- [RTL Implementation Guide for Tailwind React](https://madrus4u.vercel.app/blog/rtl-implementation-guide) — logical properties vs physical properties, i18next language change integration (MEDIUM confidence)
- [Robin Wieruch: React Folder Structure 2025](https://www.robinwieruch.de/react-folder-structure/) — page/components/hooks/context/i18n structure (MEDIUM confidence)
- [React Router Discussion: Framer Motion v6 integration](https://github.com/remix-run/react-router/discussions/10411) — AnimatedOutlet pattern for nested routing (MEDIUM confidence)
- [LeanCode: RTL in React Developer Guide](https://leancode.co/blog/right-to-left-in-react) — document dir attribute, typography adjustments for Arabic (MEDIUM confidence)
- [Dealing With Arabic in i18next — Medium](https://medium.com/swlh/dealing-with-arabic-when-using-i18next-348ed55f7c1a) — Arabic plural forms, dir function usage (MEDIUM confidence)

---
*Architecture research for: Premium multilingual beauty center & academy website (React + Vite + Tailwind + Framer Motion + react-i18next)*
*Researched: 2026-02-24*
