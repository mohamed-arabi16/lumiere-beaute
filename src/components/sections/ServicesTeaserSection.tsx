import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { TeaserCard } from '../../types/content';
import { FadeInSection } from '../animations/FadeInSection';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { Card } from '../ui/Card';
import { Heading, BodyText } from '../ui/Typography';
import { Button } from '../ui/Button';

/**
 * ServicesTeaserSection — Homepage teaser for the /services page.
 *
 * Displays 3 service category cards in a responsive grid, each wrapped in a
 * React Router Link to /services. Uses StaggerContainer for cascade animation.
 *
 * Heading uses scroll-driven Y+opacity via useScroll+useTransform (continuous,
 * not whileInView). RTL-safe: only Y-axis and opacity — no X transforms.
 *
 * CRITICAL: Uses <Link to="/services"> (NOT <a href="/services">) — preserves
 * AnimatePresence page transition animation on navigation.
 */
export function ServicesTeaserSection() {
  const { t } = useTranslation('common');
  const cards = t('home.services_teaser.cards', { returnObjects: true }) as TeaserCard[];

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
        <Heading level={2}>
          {t('home.services_teaser.heading')}
        </Heading>
        <BodyText className="mt-3 text-jungle-teal-700 dark:text-mint-leaf-400">
          {t('home.services_teaser.subtitle')}
        </BodyText>
      </motion.div>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {cards.map((card) => (
          <motion.div key={card.id} variants={staggerItemVariants}>
            <Link to="/services" className="block h-full">
              <Card hasPlaceholder placeholderVariant="card" className="h-full">
                <Heading level={3}>{card.title}</Heading>
                <BodyText size="sm" className="mt-2 text-jungle-teal-700 dark:text-mint-leaf-400">
                  {card.description}
                </BodyText>
              </Card>
            </Link>
          </motion.div>
        ))}
      </StaggerContainer>

      <FadeInSection className="flex justify-center mt-10">
        <Link to="/services">
          <Button variant="primary">{t('home.services_teaser.cta')}</Button>
        </Link>
      </FadeInSection>
    </section>
  );
}
