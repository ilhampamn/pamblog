import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RoughCard } from '@/components/RoughCard'
import { getRegionTree } from '@/lib/places.sanity'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id', 'zh'] as const

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
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8">
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

          {tree.map((region, regionIndex) => (
            <section key={region.region} className="mb-16">
              <h2
                className="text-2xl font-black mb-6"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
              >
                {region.regionLabel}
              </h2>
              <div className="space-y-5">
                {region.countries.map((country, countryIndex) => {
                  const cityCount = country.cities.length
                  const destCount = country.cities.reduce((n, c) => n + c.destinations.length, 0)
                  const image =
                    country.coverImage ||
                    `https://picsum.photos/seed/bookpamn-${country.slug}/900/700`
                  return (
                    <RoughCard
                      key={country.slug}
                      href={`/${locale}/explore/destinations/${country.slug}`}
                      orientation="horizontal"
                      seed={2203 + regionIndex * 997 + countryIndex * 271}
                      className="w-full max-w-full"
                      contentClassName="group min-h-52 no-underline md:min-h-60"
                    >
                      <div className="relative w-[38%] shrink-0 overflow-hidden m-5 mr-0 md:m-7 md:mr-0">
                        <Image
                          src={image}
                          alt=""
                          fill
                          sizes="(max-width: 767px) 38vw, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col justify-center p-5 md:p-10">
                        <span
                          className="label-stamped mb-3"
                          style={{ color: 'var(--color-smudge)' }}
                        >
                          {region.regionLabel}
                        </span>
                        <h3
                          className="text-3xl font-bold leading-tight md:text-4xl"
                          style={{ color: 'var(--color-ink)' }}
                        >
                          {country.name}
                        </h3>
                        <span
                          className="label-stamped mt-4 max-w-full whitespace-normal break-words text-[10px] leading-relaxed md:text-xs"
                          style={{ color: 'var(--color-smudge)' }}
                        >
                          {cityCount} {ui.explore.citiesIn} · {destCount}{' '}
                          {ui.explore.inThisCity}
                        </span>
                      </div>
                    </RoughCard>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
