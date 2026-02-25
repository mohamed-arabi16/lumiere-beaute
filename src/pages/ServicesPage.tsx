import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Category, Treatment } from '../types/content';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';
import { FadeInSection } from '../components/animations/FadeInSection';
import { Heading, BodyText } from '../components/ui/Typography';
import { CategoryTabs } from '../components/sections/CategoryTabs';
import { TreatmentGrid } from '../components/sections/TreatmentGrid';

export function ServicesPage() {
  const { t } = useTranslation('common');
  const { dir } = useDirection();

  const categories = t('services.categories', { returnObjects: true }) as Category[];
  const allTreatments = t('services.treatments', { returnObjects: true }) as Treatment[];

  const [activeCategory, setActiveCategory] = useState<string>(
    () => categories[0]?.id ?? 'facial'
  );

  const filteredTreatments = allTreatments.filter(
    (treatment) => treatment.category === activeCategory
  );

  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {/* Page hero */}
      <FadeInSection className="py-12 sm:py-16 px-6 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4" aria-hidden="true">
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
          <div className="w-1 h-1 rounded-full bg-seagrass-500/60 dark:bg-mint-leaf-400/50" />
          <div className="h-px w-8 bg-seagrass-500/35 dark:bg-mint-leaf-400/25" />
        </div>
        <Heading level={1} className="text-stormy-teal-950 dark:text-celadon-100">
          {t('services.hero.headline')}
        </Heading>
        <BodyText size="lg" className="mt-4 text-jungle-teal-700 dark:text-mint-leaf-300 max-w-xl mx-auto">
          {t('services.hero.subtitle')}
        </BodyText>
      </FadeInSection>

      {/* Category filter + treatment grid */}
      <div className="px-4 sm:px-6 pb-20 max-w-7xl mx-auto">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />
        <TreatmentGrid treatments={filteredTreatments} />
      </div>
    </motion.div>
  );
}
