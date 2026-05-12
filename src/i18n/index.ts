import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import zhCommon from './locales/zh/common.json';
import zhTools from './locales/zh/tools.json';
import enCommon from './locales/en/common.json';
import enTools from './locales/en/tools.json';

export const SUPPORTED_LANGS = ['zh', 'en'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGS as unknown as string[],
    defaultNS: 'common',
    ns: ['common', 'tools'],
    resources: {
      zh: { common: zhCommon, tools: zhTools },
      en: { common: enCommon, tools: enTools },
    },
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'devtools-cafe.lang',
      caches: ['localStorage'],
    },
  });

export default i18n;
