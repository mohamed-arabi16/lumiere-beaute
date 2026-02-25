import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';
import { FadeInSection } from '../components/animations/FadeInSection';
import { Heading, BodyText } from '../components/ui/Typography';
import { ContactFormSection } from '../components/sections/ContactFormSection';
import { ContactInfoSection } from '../components/sections/ContactInfoSection';

export function ContactPage() {
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
        {/* Modernized Hero */}
        <section className="relative overflow-hidden pt-6 pb-12 md:pt-10 md:pb-16 px-6">
          <div className="absolute inset-0 z-0 bg-surface-ivory dark:bg-surface-dark transition-colors duration-300">
            {/* Soft background gradients */}
            <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-mint-leaf-400/10 dark:bg-mint-leaf-400/5 blur-[100px] rounded-full pointer-events-none transform translate-x-1/4 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-seagrass-500/10 dark:bg-seagrass-500/5 blur-[80px] rounded-full pointer-events-none transform -translate-x-1/4 translate-y-1/4" />
          </div>

          <FadeInSection className="relative z-10 text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Heading level={1} className="text-stormy-teal-950 dark:text-celadon-100">
                {t('contact.hero.headline')}
              </Heading>
              <BodyText size="lg" className="mt-6 text-seagrass-600 dark:text-mint-leaf-300 max-w-xl mx-auto leading-relaxed">
                {t('contact.hero.subtitle')}
              </BodyText>
            </motion.div>
          </FadeInSection>
        </section>

        {/* Form + Info */}
        <ContactFormSection />
        <ContactInfoSection />
      </main>
    </motion.div>
  );
}
