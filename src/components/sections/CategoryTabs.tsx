import { motion, LayoutGroup } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Category } from '../../types/content';

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onSelect }: CategoryTabsProps) {
  const { t } = useTranslation('common');

  return (
    <LayoutGroup id="services-category-tabs">
      <div
        role="tablist"
        aria-label={t('services.hero.headline')}
        className="flex gap-1.5 flex-wrap mb-2 p-1.5 bg-seagrass-500/8 dark:bg-white/5 rounded-full w-fit"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onSelect(cat.id)}
            className={[
              'relative py-2 px-5 font-body text-sm transition-colors duration-200 rounded-full',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seagrass-500',
              activeCategory === cat.id
                ? 'text-white dark:text-stormy-teal-950 font-semibold'
                : 'text-jungle-teal-700 dark:text-mint-leaf-400 hover:text-seagrass-600 dark:hover:text-mint-leaf-300',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="relative z-10">{cat.label}</span>
            {activeCategory === cat.id && (
              <motion.span
                layoutId="active-tab-pill"
                className="absolute inset-0 bg-stormy-teal-950 dark:bg-celadon-100 rounded-full shadow-sm"
              />
            )}
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}
