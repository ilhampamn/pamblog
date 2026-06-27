import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getItineraries } from '@/lib/places'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const ui = t(params.locale as Locale)
  return { title: `${ui.explore.itineraries} · ${ui.explore.title}` }
}

export default async function ItinerariesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)
  const itineraries = await getItineraries(locale)

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--layout-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.itineraries },
            ]}
          />
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-12"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {ui.explore.itineraries}
          </h1>

          {itineraries.length === 0 && (
            <p style={{ color: 'var(--color-smudge)' }}>{ui.explore.noContent}</p>
          )}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {itineraries.map((it) => (
              <Link
                key={it.slug}
                href={`/${locale}/explore/itineraries/${it.slug}`}
                className="block p-6 transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--color-ghost)',
                  border: '1px solid var(--color-torn)',
                  borderRadius: 'var(--radius-card)',
                  textDecoration: 'none',
                }}
              >
                <span className="label-stamped block mb-2" style={{ color: 'var(--color-blush)' }}>
                  {it.duration} · {it.stops.length} {ui.explore.stops}
                </span>
                <h2
                  className="text-lg font-bold leading-snug mb-2"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                >
                  {it.title}
                </h2>
                {it.excerpt && (
                  <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
                    {it.excerpt}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
