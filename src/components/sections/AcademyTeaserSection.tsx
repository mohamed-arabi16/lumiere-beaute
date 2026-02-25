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
    <section className="py-20 sm:py-24 px-4 sm:px-6 bg-seagrass-500/[0.04] dark:bg-surface-dark-elevated/40">
      <FadeInSection className="text-center mb-4 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4" aria-hidden="true">
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
          <div className="w-1 h-1 rounded-full bg-seagrass-500/60 dark:bg-mint-leaf-400/50" />
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
        </div>
        <Heading level={2}>
          {t('home.academy_teaser.heading')}
        </Heading>
        <BodyText className="mt-3 text-jungle-teal-700 dark:text-mint-leaf-400 max-w-md">
          {t('home.academy_teaser.subtitle')}
        </BodyText>
      </FadeInSection>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {cards.map((card) => {
          const imageMap: Record<string, string> = {
            'teaser-aesthetic': '/academy-aesthetic-practitioner.jpg',
            'teaser-cosmetology': '/academy-prof-cosmetology.jpg',
          };
          return (
            <motion.div key={card.id} variants={staggerItemVariants}>
              <Link to="/academy" className="block h-full">
                <Card
                  imageSrc={imageMap[card.id]}
                  imageAlt={card.title}
                  className="h-full"
                >
                  <Heading level={3}>{card.title}</Heading>
                  <BodyText size="sm" className="mt-2 text-jungle-teal-700 dark:text-mint-leaf-400">
                    {card.description}
                  </BodyText>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </StaggerContainer>

      <FadeInSection className="flex justify-center mt-10">
        <Link to="/academy">
          <Button variant="ghost">{t('home.academy_teaser.cta')}</Button>
        </Link>
      </FadeInSection>
    </section>
  );
}
