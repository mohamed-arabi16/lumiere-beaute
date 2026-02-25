import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';
import { FadeInSection } from '../components/animations/FadeInSection';
import { Heading, BodyText } from '../components/ui/Typography';
import { CoursesSection } from '../components/sections/CoursesSection';

export function AcademyPage() {
  const { t } = useTranslation('common');
  const { dir } = useDirection();

  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden flex flex-col items-center justify-center min-h-[360px] md:min-h-[420px] py-20 md:py-28 px-6 bg-stormy-teal-950 dark:bg-stormy-teal-950">
          <FadeInSection className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center gap-5">
            {/* Ornamental divider */}
            <div className="flex items-center gap-2.5" aria-hidden="true">
              <div className="h-px w-10 bg-seagrass-600/50" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500/70" />
              <div className="w-1.5 h-1.5 rounded-full bg-seagrass-500/90" />
              <div className="w-1 h-1 rounded-full bg-seagrass-500/70" />
              <div className="h-px w-10 bg-seagrass-600/50" />
            </div>
            <Heading level={1} className="text-celadon-100">
              {t('academy.hero.headline')}
            </Heading>
            <BodyText className="text-mint-leaf-300/90 max-w-lg mx-auto leading-relaxed">
              {t('academy.hero.subtitle')}
            </BodyText>
          </FadeInSection>
          {/* Radial depth highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(70,157,137,0.15)_0%,transparent_70%)] pointer-events-none" />
          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stormy-teal-950/60 to-transparent pointer-events-none" />
        </section>

        {/* Courses */}
        <CoursesSection />
      </main>
    </motion.div>
  );
}
