import i18next from 'i18next';
import common from '../locales/en/common.json';

export const defaultLocale = 'en';
export const locales = ['en'] as const;

// Initialize globally
// Note: In a real SSR app, we would need to be careful about global state,
// but for SSG (or per-request in SSR if careful), this works for basic setup.
if (!i18next.isInitialized) {
  await i18next.init({
    lng: defaultLocale,
    supportedLngs: locales,
    debug: import.meta.env.DEV,
    resources: {
      en: {
        common,
      },
    },
    defaultNS: 'common',
    fallbackLng: defaultLocale,
    interpolation: {
      escapeValue: false, // not needed for React/Astro usually
    },
  });
}

/**
 * Get a translation function for a specific locale
 * @param locale The locale code (e.g., 'en')
 * @returns The translation function t(key, options)
 */
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang && lang in locales) return lang;
  return defaultLocale;
}

export function useTranslations(locale: string = defaultLocale) {
  return i18next.getFixedT(locale);
}

export default i18next;
