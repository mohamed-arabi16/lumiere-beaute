import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import trTranslations from './locales/tr/tr.json';
import enTranslations from './locales/en/en.json';
import arTranslations from './locales/ar/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      tr: { common: trTranslations },
      en: { common: enTranslations },
      ar: { common: arTranslations },
    },
    defaultNS: 'common',
    fallbackLng: 'tr',
    supportedLngs: ['tr', 'en', 'ar'],
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
