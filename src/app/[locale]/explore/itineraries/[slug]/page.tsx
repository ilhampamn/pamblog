import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PostBody } from '@/components/PostBody'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getItineraries, getItinerary, getItineraryNode, resolveStops } from '@/lib/places'
import { renderArticleBody } from '@/lib/markdoc'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const results = await Promise.all(
    LOCALES.map(async (locale) => {
      const items = await getItineraries(locale)
      return items.map((it) => ({ locale, slug: it.slug }))
    })
  )
  return results.flat()
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const it = await getItinerary(params.locale as Locale, params.slug)
  return it ? { title: it.title, description: it.excerpt } : {}
}

export default async function ItineraryPage({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const itinerary = await getItinerary(locale, params.slug)
  if (!itinerary) notFound()

  const [node, stops] = await Promise.all([
    getItineraryNode(locale, itinerary.slug),
    resolveStops(locale, itinerary.stops),
  ])
  const body = node ? renderArticleBody(node, locale) : null

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--prose-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.itineraries, href: `/${locale}/explore/itineraries` },
              { label: itinerary.title },
            ]}
          />

          <span className="label-stamped block mb-3" style={{ color: 'var(--color-blush)' }}>
            {itinerary.duration} · {stops.length} {ui.explore.stops}
          </span>
          <h1
            className="text-4xl md:text-5xl font-black leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {itinerary.title}
          </h1>
          {itinerary.excerpt && (
            <p className="mt-4 text-lg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
              {itinerary.excerpt}
            </p>
          )}
          <div className="mt-10 h-px" style={{ backgroundColor: 'var(--color-torn)' }} />
        </div>

        <PostBody>{body}</PostBody>

        {/* ── Ordered stops, each a real nested destination link ── */}
        {stops.length > 0 && (
          <section className="px-8 mt-20 pt-12 border-t" style={{ borderColor: 'var(--color-torn)' }}>
            <div className="max-w-[var(--prose-width)] mx-auto">
              <p className="label-stamped mb-6">{ui.explore.stops}</p>
              <ol className="space-y-4">
                {stops.map(({ country, city, destination }, i) => (
                  <li key={destination.slug} className="flex items-baseline gap-4">
                    <span
                      className="label-stamped shrink-0"
                      style={{ color: 'var(--color-smudge)', minWidth: '1.5rem' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <Link
                        href={`/${locale}/explore/destinations/${country.slug}/${city.slug}/${destination.slug}`}
                        className="font-bold hover:underline"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                      >
                        {destination.name}
                      </Link>
                      <span className="label-stamped block" style={{ color: 'var(--color-smudge)' }}>
                        {destination.type} · {city.name}, {country.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
