import { notFound } from 'next/navigation'
import { HomeExperience } from '@/components/HomeExperience'
import { Nav } from '@/components/Nav'
import { getPostsByLocale } from '@/lib/posts.sanity'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id', 'zh'] as const

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

      <HomeExperience
        locale={locale}
        posts={posts}
        ui={ui.home}
        newsletter={ui.newsletter}
      />
    </>
  )
}
