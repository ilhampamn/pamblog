'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()
  const otherLocale: Locale = locale === 'en' ? 'id' : 'en'
  const otherPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <nav aria-label="Language switcher" className="flex gap-2 items-center">
      <span
        className="font-ui text-xs tracking-[0.12em] uppercase"
        style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-ui)' }}
      >
        {locale.toUpperCase()}
      </span>
      <span style={{ color: 'var(--color-torn)' }}>/</span>
      <Link
        href={otherPath}
        hrefLang={otherLocale}
        className="font-ui text-xs tracking-[0.12em] uppercase transition-colors hover:text-[var(--color-ink)]"
        style={{ color: 'var(--color-smudge)', fontFamily: 'var(--font-ui)' }}
      >
        {otherLocale.toUpperCase()}
      </Link>
    </nav>
  )
}
