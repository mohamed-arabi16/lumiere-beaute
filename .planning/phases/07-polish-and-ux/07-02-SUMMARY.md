---
phase: 07-polish-and-ux
plan: 02
subsystem: ui
tags: [i18n, arabic, rtl, copy, json, translations]

# Dependency graph
requires:
  - phase: 07-01
    provides: "ar.json renamed from common.json — this plan audits and corrects that file"
provides:
  - "Corrected ar.json with دورات replacing كورسات throughout"
  - "Em dashes removed from all Arabic values — colon and Arabic comma used instead"
  - "Arabic full stop (U+06D4) used at sentence ends in all Arabic prose strings (45 instances)"
  - "Luxury register verified and maintained in all testimonials and treatment descriptions"
  - "All CTA verbs confirmed as masculine (gender-neutral) imperative forms"
affects: [any future plan that touches Arabic copy, native-speaker review, POL-02]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Arabic full stop (U+06D4 ۔) used for sentence-final punctuation in JSON values"
    - "Arabic comma (U+060C ،) used for list separation in Arabic prose"
    - "Em dash (U+2014) is incorrect in Arabic typography — use colon or Arabic comma"
    - "كورسات (loanword) replaced by دورات (proper Arabic) for consistent formal register"

key-files:
  created: []
  modified:
    - "src/i18n/locales/ar/ar.json"

key-decisions:
  - "[07-02]: Arabic full stop ۔ (U+06D4) replaces Latin period at sentence ends in all Arabic prose strings"
  - "[07-02]: Hero headline جمالك. فنّنا. retains Latin periods — they are stylistic design separators matching EN/TR locales (Your Beauty. Our Craft.), not sentence-final punctuation"
  - "[07-02]: Em dash — replaced with colon : in success_body and Arabic comma ، in testimonial — natural Arabic typography conventions"
  - "[07-02]: كورسات replaced by دورات throughout — formal Arabic term consistent with academy section that already used دورات"

patterns-established:
  - "Pattern: Arabic copy in JSON should use Arabic full stop ۔ not Latin period at sentence ends"
  - "Pattern: Short UI labels (nav items, button text) do not need terminal punctuation"

requirements-completed: [POL-02]

# Metrics
duration: 2min
completed: 2026-02-25
---

# Phase 7 Plan 02: Arabic Copy Corrections Summary

**ar.json corrected with دورات replacing كورسات, em dashes removed, Arabic full stops applied to 45 sentence-final positions, and luxury register verified across testimonials and descriptions**

## Performance

- **Duration:** 2 min
- **Started:** 2026-02-25T03:02:10Z
- **Completed:** 2026-02-25T03:04:48Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Replaced all 3 instances of `كورسات` (loanword) with `دورات` (proper Arabic): hero subtitle, academy teaser subtitle, and academy teaser CTA
- Removed em dash (U+2014) from all Arabic values — `success_body` now uses colon, testimonial-3 uses Arabic comma
- Replaced sentence-final Latin periods with Arabic full stop `۔` (U+06D4) across 45 strings including all treatment descriptions, subtitles, teaser cards, and testimonial quotes
- Verified Arabic comma `،` (U+060C) already used correctly in all prose — no Latin commas in Arabic sentences
- Confirmed luxury vocabulary preserved throughout: `فاخرة`، `مضيئة`، `متجددة`، `احترافية`، `معتمدة`
- Confirmed CTA `احجز` is masculine imperative (gender-neutral standard) — no feminine forms found

## Task Commits

Each task was committed atomically:

1. **Task 1: Apply targeted Arabic copy corrections to ar.json** - `2c549e5` (feat)

**Plan metadata:** _(to be added after docs commit)_

## Files Created/Modified

- `src/i18n/locales/ar/ar.json` — Arabic locale file with 6 categories of copy corrections applied

## Decisions Made

- Hero headline `جمالك. فنّنا.` retains Latin periods — these are stylistic design separators that match the English `"Your Beauty. Our Craft."` pattern, intentional across all three locales. Not a typography error.
- `"جارٍ الإرسال..."` ellipsis retained — the `...` is a UI loading indicator pattern, not a sentence-final period.
- Testimonial-3 luxury register improved: original `"يستحق كل ليرة — أوصي به للجميع"` ("worth every lira — I recommend it") was somewhat colloquial. Rewritten to `"كل لحظة تستحق عناءها، تجربة أوصي بها للجميع"` ("every moment is worth its effort, an experience I recommend to all") — more formal and experiential register fitting a premium beauty brand.

## Arabic Copy Changes

### Correction 1: كورسات → دورات (loanword → proper Arabic)

| Location | Before | After |
|----------|--------|-------|
| `home.hero.subtitle` | `علاجات فاخرة وكورسات احترافية في قلب إسطنبول.` | `علاجات فاخرة ودورات احترافية في قلب إسطنبول۔` |
| `home.academy_teaser.subtitle` | `كورسات احترافية معتمدة في مجال التجميل يُدرّسها خبراء الصناعة.` | `دورات احترافية معتمدة في مجال التجميل يُدرّسها خبراء الصناعة۔` |
| `home.academy_teaser.cta` | `اكتشف الكورسات` | `اكتشف الدورات` |

### Correction 2: Em dash removal

| Location | Before | After |
|----------|--------|-------|
| `contact.form.success_body` | `شكرًا لك — سنتواصل معك خلال ٢٤ ساعة.` | `شكرًا لك: سنتواصل معك خلال ٢٤ ساعة۔` |
| `home.testimonials[2].quote` | `...يستحق كل ليرة — أوصي به للجميع.` | `...كل لحظة تستحق عناءها، تجربة أوصي بها للجميع۔` |
| `home.services_teaser.subtitle` | `...طقوس الجسم المريحة — مُختارة بعناية...` | `...طقوس الجسم المريحة، مُختارة بعناية...` |

### Correction 3: Sentence-final Latin period → Arabic full stop ۔

Applied to 45 strings including:
- All treatment descriptions (20 items)
- All service teaser card descriptions (3 items)
- All academy teaser card descriptions (2 items)
- All testimonial quotes (3 items)
- All subtitle fields (4 items)
- Course descriptions (2 items × 2 sentences = 4 instances)
- Contact form body/error strings
- WhatsApp message string
- Test body string

### Correction 4: Arabic comma verification

Already correct throughout — `،` (U+060C) used in all Arabic prose. No Latin commas found in Arabic text.

### Correction 5: Luxury register review

Testimonial quotes reviewed for formal register:
- Testimonial-1 `"غيّرت جلسة HydraFacial بشرتي تمامًا"` — natural, experiential, luxury-appropriate. No changes needed.
- Testimonial-2 `"أكاديمية لوميير منحتني الثقة والمهارات"` — professional and aspirational. No changes needed.
- Testimonial-3: Rewritten for formal register (see Decisions Made above).

Key luxury vocabulary confirmed present:
- `فاخرة` (luxurious) — hero subtitle, gold facial, services hero
- `مضيئة` (radiant/glowing) — gold facial, testimonial-1
- `متجددة` (renewed/refreshed) — gold facial, body scrub
- `احترافية` (professional) — throughout course/treatment descriptions
- `معتمدة` (certified) — academy subtitle, testimonial-2 role

### Correction 6: Gender-neutral CTAs

All CTA imperative verbs verified as masculine (gender-neutral standard):
- `احجز علاجاً` — masculine imperative, correct
- `اكتشف خدماتنا` — masculine imperative, correct
- `اكتشف الدورات` — masculine imperative, correct

No feminine imperative forms (`احجزي`، `اكتشفي`) found.

### Items Flagged for Native-Speaker Sign-Off

The following items were reviewed and improved but would benefit from native Levantine/Istanbul Arabic speaker verification before final launch:

1. **`whatsapp_message`**: `"مرحبًا، أودّ حجز علاج في لوميير بيوتي۔"` — grammatically correct; `أودّ` is formal Modern Standard Arabic first-person. Acceptable for Istanbul luxury market; verify it sounds natural in Istanbul's Arabic-speaking community context.

2. **`home.services_teaser.subtitle`**: `"من جلسات الترطيب العميق إلى طقوس الجسم المريحة، مُختارة بعناية لصحتك وراحتك۔"` — `طقوس الجسم` (body rituals) is an elevated register phrase; `مُختارة` (curated/selected) is formal. Verify resonance with target audience.

3. **`academy` course descriptions**: The HydraFacial and Keratin treatment brand names kept in international form — verify this is appropriate for Arabic copy or if Arabicized alternatives exist.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None — the file was well-structured and all corrections applied cleanly. TypeScript compilation unchanged (JSON values only — no type changes).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- ar.json corrected for POL-02 compliance — ready for native-speaker review before public launch
- Blocker from STATE.md noted: Arabic content still requires idiomatic copywriting human review — this plan addressed the mechanical/programmatic corrections; human review remains an open item
- Phase 7 Plan 03 (scroll-driven animations) and Plan 04 (custom cursor) are already complete per STATE.md — Phase 7 is fully complete

## Self-Check: PASSED

- FOUND: `src/i18n/locales/ar/ar.json` — exists and is valid JSON
- FOUND: `.planning/phases/07-polish-and-ux/07-02-SUMMARY.md` — created
- FOUND: commit `2c549e5` — feat(07-02): apply targeted Arabic copy corrections to ar.json

---
*Phase: 07-polish-and-ux*
*Completed: 2026-02-25*
