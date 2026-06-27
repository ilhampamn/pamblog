import { notFound } from 'next/navigation'
import { Canvas } from '@/components/Canvas'
import { HomeList } from '@/components/HomeList'
import { Nav } from '@/components/Nav'
import { getPostsByLocale } from '@/lib/posts'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const posts = await getPostsByLocale(locale)

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />

      {/* Desktop: pannable / zoomable canvas. */}
      <div className="hidden md:block">
        <Canvas
          locale={locale}
          posts={posts}
          ui={ui.home}
          newsletter={ui.newsletter}
        />
      </div>

      {/* Mobile: structured, scrollable list. */}
      <div className="md:hidden">
        <HomeList
          locale={locale}
          posts={posts}
          ui={ui.home}
          newsletter={ui.newsletter}
        />
      </div>
    </>
  )
}
