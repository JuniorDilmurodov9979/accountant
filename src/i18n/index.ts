import ru from './ru';
import uz from './uz';

export const languages = {
  ru: 'Русский',
  uz: "O'zbekcha",
};

export const defaultLang = 'ru';

export const dictionaries = { ru, uz } as const;

export type Locale = keyof typeof dictionaries;

export function getLangFromUrl(url: URL): Locale {
  const [, first] = url.pathname.split('/');
  if (first in dictionaries) return first as Locale;
  return defaultLang;
}

export function useTranslations(locale: Locale) {
  return dictionaries[locale] ?? dictionaries[defaultLang];
}

export function localizePath(path: string, locale: Locale): string {
  if (locale === defaultLang) return path;
  return `/${locale}${path}`;
}
