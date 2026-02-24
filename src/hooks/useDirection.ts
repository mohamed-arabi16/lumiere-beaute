import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useDirection() {
  const { i18n } = useTranslation();
  // Always pass i18n.language explicitly — omitting it can return undefined in some i18next versions
  const dir = i18n.dir(i18n.language) as 'ltr' | 'rtl';
  const isRTL = dir === 'rtl';

  useEffect(() => {
    // Keep DOM attributes in sync whenever language changes
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;
  }, [i18n.language, dir]);

  return { dir, isRTL };
}
