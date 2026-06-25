import { notFound } from 'next/navigation'
import { Canvas } from '@/components/Canvas'
import { Nav } from '@/components/Nav'
import { getPostsByLocale } from '@/lib/posts'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const posts = getPostsByLocale(locale)

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />
      <Canvas
        locale={locale}
        posts={posts}
        ui={ui.home}
        newsletter={ui.newsletter}
      />
    </>
  )
}
