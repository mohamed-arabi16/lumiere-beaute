import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { TeaserCard } from '../../types/content';
import { FadeInSection } from '../animations/FadeInSection';
import { StaggerContainer, staggerItemVariants } from '../animations/StaggerContainer';
import { Card } from '../ui/Card';
import { Heading, BodyText } from '../ui/Typography';
import { Button } from '../ui/Button';

/**
 * AcademyTeaserSection — Homepage teaser for the /academy page.
 *
 * Displays 2 academy course cards in a responsive grid, each wrapped in a
 * React Router Link to /academy. Uses ghost Button variant to visually
 * differentiate from the ServicesTeaserSection primary CTA above it.
 *
 * CRITICAL: Uses <Link to="/academy"> (NOT <a href="/academy">) — preserves
 * AnimatePresence page transition animation on navigation.
 */
export function AcademyTeaserSection() {
  const { t } = useTranslation('common');
  const cards = t('home.academy_teaser.cards', { returnObjects: true }) as TeaserCard[];

  return (
    <section className="py-20 px-6">
      <FadeInSection className="text-center mb-4">
        <Heading level={2}>
          {t('home.academy_teaser.heading')}
        </Heading>
        <BodyText className="mt-3 text-jungle-teal-700 dark:text-mint-leaf-400">
          {t('home.academy_teaser.subtitle')}
        </BodyText>
      </FadeInSection>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {cards.map((card) => (
          <motion.div key={card.id} variants={staggerItemVariants}>
            <Link to="/academy" className="block h-full">
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
        <Link to="/academy">
          <Button variant="ghost">{t('home.academy_teaser.cta')}</Button>
        </Link>
      </FadeInSection>
    </section>
  );
}
