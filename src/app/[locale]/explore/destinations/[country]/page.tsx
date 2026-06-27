import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import {
  getRegionTree,
  getCountryNode,
  getCountry,
  getItinerariesForCountry,
  getStoriesForCountry,
} from '@/lib/places'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const tree = await getRegionTree('en')
  const params: { locale: string; country: string }[] = []
  for (const region of tree)
    for (const country of region.countries)
      for (const locale of LOCALES) params.push({ locale, country: country.slug })
  return params
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; country: string }
}): Promise<Metadata> {
  const country = await getCountry(params.locale as Locale, params.country)
  return country ? { title: country.name } : {}
}

export default async function CountryPage({
  params,
}: {
  params: { locale: string; country: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const country = await getCountryNode(locale, params.country)
  if (!country) notFound()

  const [itineraries, stories] = await Promise.all([
    getItinerariesForCountry(locale, country.slug),
    getStoriesForCountry(locale, country.slug),
  ])

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--layout-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.destinations, href: `/${locale}/explore/destinations` },
              { label: country.name },
            ]}
          />

          <h1
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {country.name}
          </h1>
          <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
            {country.regionLabel}
          </span>

          {/* ── Cities, each with its destinations ── */}
          <div className="mt-12 flex flex-col gap-12">
            {country.cities.length === 0 && (
              <p style={{ color: 'var(--color-smudge)' }}>{ui.explore.noContent}</p>
            )}
            {country.cities.map((city) => (
              <section key={city.slug}>
                <Link
                  href={`/${locale}/explore/destinations/${country.slug}/${city.slug}`}
                  className="inline-block mb-4 hover:underline"
                  style={{ textDecorationColor: 'var(--color-torn)' }}
                >
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                  >
                    {city.name}
                  </h2>
                </Link>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {city.destinations.map((dest) => (
                    <Link
                      key={dest.slug}
                      href={`/${locale}/explore/destinations/${country.slug}/${city.slug}/${dest.slug}`}
                      className="block p-5 transition-shadow hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-ghost)',
                        border: '1px solid var(--color-torn)',
                        borderRadius: 'var(--radius-card)',
                        textDecoration: 'none',
                      }}
                    >
                      <span className="label-stamped block mb-1" style={{ color: 'var(--color-blush)' }}>
                        {dest.type}
                      </span>
                      <h3
                        className="text-lg font-bold leading-snug"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                      >
                        {dest.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* ── Cross-references ── */}
          {(itineraries.length > 0 || stories.length > 0) && (
            <div className="mt-20 pt-12 border-t grid gap-12 md:grid-cols-2" style={{ borderColor: 'var(--color-torn)' }}>
              {itineraries.length > 0 && (
                <section>
                  <p className="label-stamped mb-4">{ui.explore.itineraries}</p>
                  <ul className="space-y-3">
                    {itineraries.map((it) => (
                      <li key={it.slug}>
                        <Link
                          href={`/${locale}/explore/itineraries/${it.slug}`}
                          className="font-bold hover:underline"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                        >
                          {it.title}
                        </Link>{' '}
                        <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                          {it.duration}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {stories.length > 0 && (
                <section>
                  <p className="label-stamped mb-4">{ui.explore.stories}</p>
                  <ul className="space-y-3">
                    {stories.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/${locale}/explore/stories/${s.slug}`}
                          className="font-bold hover:underline"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                        >
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
