import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'tr', label: 'TR', name: 'Turkish' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'ع', name: 'Arabic' },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-0">
      {LANGUAGES.map((lang, index) => {
        const isActive = i18n.language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-label={`Switch to ${lang.name}`}
            className={[
              'min-w-[28px] text-center text-xs font-body tracking-wide uppercase px-2 py-1 transition-colors duration-200',
              index > 0 ? 'border-s border-seagrass-500/30' : '',
              isActive
                ? 'text-stormy-teal-950 dark:text-celadon-100 font-semibold'
                : 'text-seagrass-600 dark:text-mint-leaf-400 hover:text-stormy-teal-950 dark:hover:text-celadon-100',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
