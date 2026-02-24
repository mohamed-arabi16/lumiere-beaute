import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { useDirection } from '../hooks/useDirection';

const COLOR_SWATCHES = [
  { name: 'celadon-100', cls: 'bg-celadon-100' },
  { name: 'celadon-200', cls: 'bg-celadon-200' },
  { name: 'mint-leaf-300', cls: 'bg-mint-leaf-300' },
  { name: 'mint-leaf-400', cls: 'bg-mint-leaf-400' },
  { name: 'seagrass-500', cls: 'bg-seagrass-500' },
  { name: 'seagrass-600', cls: 'bg-seagrass-600' },
  { name: 'jungle-teal-700', cls: 'bg-jungle-teal-700' },
  { name: 'blue-spruce-800', cls: 'bg-blue-spruce-800' },
  { name: 'deep-ocean-900', cls: 'bg-deep-ocean-900' },
  { name: 'stormy-teal-950', cls: 'bg-stormy-teal-950' },
] as const;

export function ThemeTestComponent() {
  const { t, i18n } = useTranslation('common');
  const { theme, toggleTheme } = useTheme();
  const { dir, isRTL } = useDirection();

  return (
    <div className="min-h-screen bg-surface-ivory dark:bg-surface-dark p-8 transition-colors duration-300">

      {/* Section: Color palette — all 10 tokens */}
      <section className="mb-10">
        <p className="font-body text-sm text-seagrass-600 dark:text-seagrass-500 mb-3">
          {t('test.colorLabel')}
        </p>
        <div className="flex flex-wrap gap-3">
          {COLOR_SWATCHES.map(({ name, cls }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className={`w-16 h-16 rounded-lg ${cls}`} />
              <span className="font-body text-xs text-deep-ocean-900 dark:text-mint-leaf-300">
                {name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Section: Typography */}
      <section className="mb-10">
        <h1 className="font-display text-5xl text-stormy-teal-950 dark:text-celadon-100 mb-3">
          {t('test.heading')}
        </h1>
        <p className="font-body text-base text-deep-ocean-900 dark:text-mint-leaf-300 max-w-prose">
          {t('test.body')}
        </p>
      </section>

      {/* Section: Gradient placeholders */}
      <section className="mb-10">
        <div className="placeholder-gradient-hero placeholder-aspect-hero rounded-2xl mb-4" />
        <div className="flex gap-4">
          <div className="placeholder-gradient-card placeholder-aspect-card rounded-xl w-48" />
          <div className="placeholder-gradient-primary placeholder-aspect-portrait rounded-xl w-36" />
        </div>
      </section>

      {/* Section: Controls */}
      <section className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-seagrass-500 hover:bg-seagrass-600 text-white font-body text-sm rounded-lg transition-colors duration-200"
        >
          {t('test.toggleTheme')}: {theme}
        </button>
        {(['tr', 'en', 'ar'] as const).map((lng) => (
          <button
            key={lng}
            onClick={() => i18n.changeLanguage(lng)}
            className={`px-4 py-2 font-body text-sm rounded-lg transition-colors duration-200 ${
              i18n.language === lng
                ? 'bg-stormy-teal-950 text-celadon-100'
                : 'bg-jungle-teal-700 hover:bg-blue-spruce-800 text-white'
            }`}
          >
            {lng.toUpperCase()}
          </button>
        ))}
      </section>

      {/* Section: Debug readout */}
      <section className="font-body text-sm text-seagrass-600 dark:text-seagrass-500 space-y-1">
        <p>{t('test.dir')}: <strong>{dir}</strong></p>
        <p>isRTL: <strong>{String(isRTL)}</strong></p>
        <p>{t('test.lang')}: <strong>{i18n.language}</strong></p>
        <p>theme: <strong>{theme}</strong></p>
      </section>

    </div>
  );
}
