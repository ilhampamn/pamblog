import en from '../../content/ui/en.json'
import id from '../../content/ui/id.json'
import zh from '../../content/ui/zh.json'

/**
 * Single source of truth for site languages.
 *
 * Add a new language here and it propagates everywhere that consumes
 * `LOCALES` / `LANGUAGES`: routing (`generateStaticParams`), the sitemap, the
 * RSS feed, the Sanity Studio i18n config, and the GROQ language projection.
 *
 * `id` is the locale code used in URLs (`/en`, `/id`, `/zh`) and as the
 * `_key` for every `internationalizedArray` value in Sanity.
 */
export const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'id', title: 'Bahasa Indonesia' },
  { id: 'zh', title: '中文' },
] as const

export const LOCALES = LANGUAGES.map((l) => l.id)
export type Locale = (typeof LANGUAGES)[number]['id']

/** Fallback language used when a field has no value in the requested locale. */
export const DEFAULT_LOCALE: Locale = 'en'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

const translations = { en, id, zh } as const

export function t(locale: Locale) {
  return translations[locale]
}
