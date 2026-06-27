import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getStories } from '@/lib/places'
import { t, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/date'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const ui = t(params.locale as Locale)
  return { title: `${ui.explore.stories} · ${ui.explore.title}` }
}

export default async function StoriesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)
  const stories = await getStories(locale)

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--prose-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.stories },
            ]}
          />
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-12"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {ui.explore.stories}
          </h1>

          {stories.length === 0 && (
            <p style={{ color: 'var(--color-smudge)' }}>{ui.explore.noContent}</p>
          )}

          <ul className="flex flex-col gap-8">
            {stories.map((s) => (
              <li key={s.slug}>
                <Link href={`/${locale}/explore/stories/${s.slug}`} className="group block">
                  {s.publishedAt && (
                    <span className="label-stamped block mb-1" style={{ color: 'var(--color-smudge)' }}>
                      {formatDate(s.publishedAt, locale)}
                    </span>
                  )}
                  <h2
                    className="text-2xl font-bold leading-snug group-hover:underline"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-ink)',
                      textDecorationColor: 'var(--color-torn)',
                    }}
                  >
                    {s.title}
                  </h2>
                  {s.excerpt && (
                    <p className="mt-2 text-base" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
                      {s.excerpt}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
