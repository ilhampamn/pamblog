import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PostBody } from '@/components/PostBody'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import {
  allDestinationPaths,
  resolveDestinationChain,
  getDestinationNode,
  getItinerariesForDestination,
  getStoriesForDestination,
} from '@/lib/places'
import { renderArticleBody } from '@/lib/markdoc'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const paths = await allDestinationPaths()
  return paths.flatMap((p) => LOCALES.map((locale) => ({ locale, ...p })))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; country: string; city: string; destination: string }
}): Promise<Metadata> {
  const chain = await resolveDestinationChain(
    params.locale as Locale,
    params.country,
    params.city,
    params.destination
  )
  return chain ? { title: `${chain.destination.name} · ${chain.city.name}` } : {}
}

export default async function DestinationPage({
  params,
}: {
  params: { locale: string; country: string; city: string; destination: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const chain = await resolveDestinationChain(locale, params.country, params.city, params.destination)
  if (!chain) notFound()
  const { country, city, destination } = chain

  const [node, itineraries, stories] = await Promise.all([
    getDestinationNode(locale, destination.slug),
    getItinerariesForDestination(locale, destination.slug),
    getStoriesForDestination(locale, destination.slug, country.slug),
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
              { label: ui.explore.destinations, href: `/${locale}/explore/destinations` },
              { label: country.name, href: `/${locale}/explore/destinations/${country.slug}` },
              { label: city.name, href: `/${locale}/explore/destinations/${country.slug}/${city.slug}` },
              { label: destination.name },
            ]}
          />

          <span className="label-stamped block mb-3" style={{ color: 'var(--color-blush)' }}>
            {destination.type}
          </span>
          <h1
            className="text-4xl md:text-5xl font-black leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {destination.name}
          </h1>
          <div className="mt-10 h-px" style={{ backgroundColor: 'var(--color-torn)' }} />
        </div>

        <div className="px-0">
          <PostBody>{body}</PostBody>
        </div>

        {/* ── Reverse references: the graph payoff ── */}
        {(itineraries.length > 0 || stories.length > 0) && (
          <section className="px-8 mt-20 pt-12 border-t" style={{ borderColor: 'var(--color-torn)' }}>
            <div className="max-w-[var(--prose-width)] mx-auto grid gap-12 md:grid-cols-2">
              {itineraries.length > 0 && (
                <div>
                  <p className="label-stamped mb-4">{ui.explore.relatedItineraries}</p>
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
                </div>
              )}
              {stories.length > 0 && (
                <div>
                  <p className="label-stamped mb-4">{ui.explore.relatedStories}</p>
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
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  )
}
