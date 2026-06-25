import en from '../../content/ui/en.json'
import id from '../../content/ui/id.json'

const translations = { en, id } as const
export type Locale = keyof typeof translations

export function t(locale: Locale) {
  return translations[locale]
}
