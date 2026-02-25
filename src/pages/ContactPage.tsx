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
        {/* Hero */}
        <section className="py-24 px-6 bg-stormy-teal-950 dark:bg-stormy-teal-950">
          <FadeInSection className="text-center max-w-3xl mx-auto">
            <Heading level={1} className="text-celadon-100">
              {t('contact.hero.headline')}
            </Heading>
            <BodyText className="mt-4 text-mint-leaf-300">
              {t('contact.hero.subtitle')}
            </BodyText>
          </FadeInSection>
        </section>

        {/* Form + Info */}
        <ContactFormSection />
        <ContactInfoSection />
      </main>
    </motion.div>
  );
}
