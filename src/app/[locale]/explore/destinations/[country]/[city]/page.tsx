import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { allCityPaths, resolveCityChain } from '@/lib/places'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const paths = await allCityPaths()
  return paths.flatMap((p) => LOCALES.map((locale) => ({ locale, ...p })))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; country: string; city: string }
}): Promise<Metadata> {
  const chain = await resolveCityChain(params.locale as Locale, params.country, params.city)
  return chain ? { title: `${chain.city.name}, ${chain.country.name}` } : {}
}

export default async function CityPage({
  params,
}: {
  params: { locale: string; country: string; city: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const chain = await resolveCityChain(locale, params.country, params.city)
  if (!chain) notFound()
  const { country, city } = chain

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--layout-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.destinations, href: `/${locale}/explore/destinations` },
              { label: country.name, href: `/${locale}/explore/destinations/${country.slug}` },
              { label: city.name },
            ]}
          />

          <h1
            className="text-4xl md:text-5xl font-black leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {city.name}
          </h1>
          <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
            {country.name}
          </span>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {city.destinations.length === 0 && (
              <p style={{ color: 'var(--color-smudge)' }}>{ui.explore.noContent}</p>
            )}
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
                <h2
                  className="text-lg font-bold leading-snug"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                >
                  {dest.name}
                </h2>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
