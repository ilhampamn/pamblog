import type { Locale } from '@/lib/i18n'

export function formatDate(dateString: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString))
}
