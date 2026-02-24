import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDirection } from '../hooks/useDirection';
import { pageTransitionVariants } from '../animations/variants';

export function HomePage() {
  const { t } = useTranslation('common');
  const { dir } = useDirection();

  return (
    <motion.div
      custom={dir}
      variants={pageTransitionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen px-4 py-16 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <h1 className="font-display text-4xl text-stormy-teal-950 dark:text-celadon-100">
          {t('nav.home')}
        </h1>
        <p className="mt-4 font-body text-seagrass-600 dark:text-seagrass-400">
          Phase 2 stub — content coming in Phase 4
        </p>
      </div>
    </motion.div>
  );
}
