import { motion } from 'framer-motion';
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
 * Key design decisions:
 * - testimonial.id used as React key (never array index) — AnimatePresence safety
 * - All text from t() — no hardcoded strings (quotation marks are JSX punctuation)
 * - Cards use flex-col layout with mt-auto on author block to pin it to bottom
 */
export function TestimonialsSection() {
  const { t } = useTranslation('common');
  const testimonials = t('home.testimonials', { returnObjects: true }) as Testimonial[];

  return (
    <section className="py-20 px-6 bg-surface-dark dark:bg-surface-dark">
      <FadeInSection className="text-center mb-12">
        <Heading level={2} className="text-celadon-100 dark:text-celadon-100">
          {t('home.testimonials_heading')}
        </Heading>
      </FadeInSection>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} variants={staggerItemVariants}>
            <Card className="h-full flex flex-col gap-4 bg-surface-dark-card dark:bg-surface-dark-card border border-seagrass-600/30">
              <BodyText className="text-celadon-200 italic leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </BodyText>
              <div className="mt-auto">
                <BodyText size="sm" className="text-celadon-100 font-medium">
                  {testimonial.author}
                </BodyText>
                <BodyText size="sm" className="text-mint-leaf-400">
                  {testimonial.role}
                </BodyText>
              </div>
            </Card>
          </motion.div>
        ))}
      </StaggerContainer>
    </section>
  );
}
