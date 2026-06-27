import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const ui = t(params.locale as Locale)
  return { title: ui.explore.title, description: ui.explore.intro }
}

export default function ExploreHub({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const sections = [
    { href: `/${locale}/explore/destinations`, title: ui.explore.destinations, desc: ui.explore.destinationsDesc },
    { href: `/${locale}/explore/itineraries`, title: ui.explore.itineraries, desc: ui.explore.itinerariesDesc },
    { href: `/${locale}/explore/stories`, title: ui.explore.stories, desc: ui.explore.storiesDesc },
  ]

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--prose-width)] mx-auto">
          <h1
            className="text-4xl md:text-5xl font-black leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {ui.explore.title}
          </h1>
          <p className="mt-4 text-lg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
            {ui.explore.intro}
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="block p-6 transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--color-ghost)',
                  border: '1px solid var(--color-torn)',
                  borderRadius: 'var(--radius-card)',
                  textDecoration: 'none',
                }}
              >
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                >
                  {s.title}
                </h2>
                <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
                  {s.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
