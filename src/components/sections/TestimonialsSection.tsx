import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Testimonial } from '../../types/content';
import { FadeInSection } from '../animations/FadeInSection';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { Card } from '../ui/Card';
import { Heading, BodyText } from '../ui/Typography';

/**
 * TestimonialsSection — Client quote cards with dark editorial background.
 *
 * Uses bg-surface-dark in both light and dark modes to create deliberate
 * visual contrast against ivory sections above and below. This is an
 * intentional luxury editorial pattern — light/dark alternation adds rhythm.
 *
 * The section element uses scroll-driven scale via useScroll+useTransform
 * (continuous, not whileInView). Subtle zoom-in (1.04 → 1.0) as the dark
 * background scrolls into center viewport. RTL-safe: scale only — no X axis.
 * MotionConfig reducedMotion="user" in AppProviders handles prefers-reduced-motion.
 *
 * Key design decisions:
 * - testimonial.id used as React key (never array index) — AnimatePresence safety
 * - All text from t() — no hardcoded strings (quotation marks are JSX punctuation)
 * - Cards use flex-col layout with mt-auto on author block to pin it to bottom
 */
export function TestimonialsSection() {
  const { t } = useTranslation('common');
  const testimonials = t('home.testimonials', { returnObjects: true }) as Testimonial[];

  const testimonialsRef = useRef<HTMLElement>(null);
  const { scrollYProgress: testimonialsProgress } = useScroll({
    target: testimonialsRef,
    offset: ['start end', 'center center'],
  });
  const bgScale = useTransform(testimonialsProgress, [0, 1], [1.04, 1]);

  return (
    <motion.section
      ref={testimonialsRef}
      style={{ scale: bgScale }}
      className="py-20 sm:py-24 px-4 sm:px-6 bg-seagrass-500/5 border-y border-seagrass-500/10 dark:bg-surface-dark dark:border-transparent"
    >
      <FadeInSection className="text-center mb-12 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2" aria-hidden="true">
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-seagrass-500/40" />
          <div className="w-1 h-1 rounded-full bg-seagrass-500/60 dark:bg-seagrass-500/60" />
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-seagrass-500/40" />
        </div>
        <Heading level={2} className="text-stormy-teal-950 dark:text-celadon-100">
          {t('home.testimonials_heading')}
        </Heading>
      </FadeInSection>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={staggerItemVariants}>
            {/* Light mode: white card. Dark mode: dark card */}
            <article className="h-full flex flex-col gap-4 relative rounded-2xl overflow-hidden p-6 bg-white shadow-sm border border-seagrass-500/12 hover:border-seagrass-500/30 hover:shadow-[0_8px_32px_rgba(3,102,102,0.1)] hover:-translate-y-1.5 transition-all duration-500 dark:bg-surface-dark-card dark:border-seagrass-600/30 dark:hover:border-seagrass-500/40 dark:shadow-none dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              {/* Decorative large quote mark */}
              <div
                className="absolute top-3 end-4 font-display text-7xl leading-none select-none pointer-events-none text-seagrass-500/15 dark:text-seagrass-500/12"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <BodyText className="italic leading-relaxed relative z-10 text-stormy-teal-950/80 dark:text-celadon-200/90">
                &ldquo;{testimonial.quote}&rdquo;
              </BodyText>

              <div className="mt-auto pt-3 border-t border-seagrass-500/12 dark:border-seagrass-600/20">
                <BodyText size="sm" className="font-semibold text-stormy-teal-950 dark:text-celadon-100">
                  {testimonial.author}
                </BodyText>
                <BodyText size="sm" className="mt-0.5 text-seagrass-600 dark:text-mint-leaf-400/80">
                  {testimonial.role}
                </BodyText>
              </div>
            </article>
          </motion.div>
        ))}
      </StaggerContainer>
    </motion.section>
  );
}
