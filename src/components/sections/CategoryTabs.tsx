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
        className="flex gap-1 flex-wrap"
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => onSelect(cat.id)}
            className={[
              'relative py-2 ps-4 pe-4 font-body text-sm transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-seagrass-500 rounded-sm',
              activeCategory === cat.id
                ? 'text-stormy-teal-950 dark:text-celadon-100 font-medium'
                : 'text-jungle-teal-700 dark:text-mint-leaf-400 hover:text-seagrass-600 dark:hover:text-seagrass-300',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {cat.label}
            {activeCategory === cat.id && (
              <motion.div
                layoutId="active-tab-indicator"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-seagrass-600 dark:bg-seagrass-400"
              />
            )}
          </motion.button>
        ))}
      </div>
    </LayoutGroup>
  );
}
