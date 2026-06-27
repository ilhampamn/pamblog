import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getRegionTree } from '@/lib/places'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const ui = t(params.locale as Locale)
  return { title: `${ui.explore.destinations} · ${ui.explore.title}` }
}

export default async function DestinationsPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)
  const tree = await getRegionTree(locale)

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--layout-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.destinations },
            ]}
          />

          {tree.length === 0 && (
            <p style={{ color: 'var(--color-smudge)' }}>{ui.explore.noContent}</p>
          )}

          {tree.map((region) => (
            <section key={region.region} className="mb-16">
              <h2
                className="text-2xl font-black mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
              >
                {region.regionLabel}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {region.countries.map((country) => {
                  const cityCount = country.cities.length
                  const destCount = country.cities.reduce((n, c) => n + c.destinations.length, 0)
                  return (
                    <Link
                      key={country.slug}
                      href={`/${locale}/explore/destinations/${country.slug}`}
                      className="block p-6 transition-shadow hover:shadow-lg"
                      style={{
                        backgroundColor: 'var(--color-ghost)',
                        border: '1px solid var(--color-torn)',
                        borderRadius: 'var(--radius-card)',
                        textDecoration: 'none',
                      }}
                    >
                      <h3
                        className="text-xl font-bold mb-1"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                      >
                        {country.name}
                      </h3>
                      <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                        {cityCount} {ui.explore.citiesIn} · {destCount} {ui.explore.inThisCity}
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
