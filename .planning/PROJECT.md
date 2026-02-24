# Lumiere Beaute

## What This Is

A premium 5-page website for Lumiere Beaute, a beauty center and academy based in Istanbul. The site showcases 20+ treatments, 2 certification courses, and the brand story — all with cinematic scroll animations, trilingual support (Turkish, English, Arabic with full RTL), and a warm teal-green aesthetic inspired by editorial luxury brands like Aesop. No generic UI kit feel — every section must feel intentional and sophisticated.

## Core Value

The website must feel like a premium, editorial experience — visitors should immediately sense luxury and trust, regardless of language or device.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 5-page structure: Home, Services, Academy, About, Contact
- [ ] Trilingual support (TR/EN/AR) via react-i18next with JSON translation files
- [ ] Full RTL layout mirroring for Arabic (navigation, text, cards, animations)
- [ ] Browser language auto-detection with Turkish fallback
- [ ] Light/Dark mode toggle with warm tones only
- [ ] Cinematic Framer Motion animations (full-screen transitions, text typing effects, parallax)
- [ ] Mobile-first responsive design (390px base, 1440px desktop)
- [ ] Home page: hero, stats, services teaser, academy teaser, testimonials
- [ ] Services page: filterable catalog of 20+ treatments with category tabs
- [ ] Academy page: 2 certification courses with full curriculum, instructor bios, pricing/duration, enroll CTA
- [ ] About page: brand story, team, values
- [ ] Contact page: booking form (EmailJS), FAQ, WhatsApp CTA
- [ ] Form submissions via both EmailJS and WhatsApp message builder
- [ ] Custom teal-green color system (celadon → stormy_teal, 10 named colors with 100-900 scales)
- [ ] Typography: Cormorant Garamond (headings) + Inter (body)
- [ ] CSS gradient placeholders instead of real images

### Out of Scope

- Backend / real booking system — frontend demo only
- CMS — static content via JSON translation files
- Payment processing — not needed for v1
- Real photography — CSS gradient placeholders used throughout
- User authentication — no login system
- SEO optimization — defer to v2

## Context

- Istanbul-based beauty center targeting local and international clients
- Academy offers professional certification courses
- The brand aesthetic is "forest at dusk" — deep warm teals, not tech-dark
- Light mode uses warm ivory backgrounds (#F4FAF7, #FFFFFF)
- Dark mode uses deep warm teal (#082F2D, #0C4744)
- Cinematic interaction style: full-screen page transitions, staggered reveals, text that types itself, hero sections with high visual impact
- All text externalized — zero hardcoded strings in components
- Arabic RTL requires full layout mirroring including animation directions

## Constraints

- **Tech stack**: React + Vite + Tailwind CSS + Framer Motion + React Router — decided
- **i18n**: react-i18next with JSON files (tr.json, en.json, ar.json) — decided
- **Color system**: Exclusively use the defined 10-color teal-green palette:
  - celadon (#99e2b4), celadon (#88d4ab), mint_leaf (#78c6a3), mint_leaf (#67b99a)
  - seagrass (#56ab91), seagrass (#469d89), jungle_teal (#358f80), blue_spruce (#248277)
  - deep_ocean (#14746f), stormy_teal (#036666)
  - Each with full 100-900 scale
- **Typography**: Cormorant Garamond (headings) + Inter (body) — decided
- **No images**: CSS gradient placeholders only — decided
- **Mobile-first**: 390px base breakpoint — decided

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Trilingual (TR/EN/AR) with react-i18next | International audience, zero hardcoded text | — Pending |
| Full RTL for Arabic | Proper Arabic UX requires complete layout mirroring | — Pending |
| Browser language detection | Automatic locale matching for visitors | — Pending |
| Cinematic animation style | Brand differentiation, editorial luxury feel | — Pending |
| Category tabs for services filter | Clean UX, animated transitions between categories | — Pending |
| EmailJS + WhatsApp dual submission | Both channels maximize conversion for Istanbul market | — Pending |
| Custom 10-color teal palette | Cohesive brand identity, warm aesthetic throughout | — Pending |

---
*Last updated: 2026-02-24 after initialization*
