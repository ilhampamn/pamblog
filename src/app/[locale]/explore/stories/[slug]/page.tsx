import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PostBody } from '@/components/PostBody'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { getStories, getStory, getStoryNode, resolveStops, getCountry } from '@/lib/places'
import { renderArticleBody } from '@/lib/markdoc'
import { t, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/date'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const results = await Promise.all(
    LOCALES.map(async (locale) => {
      const items = await getStories(locale)
      return items.map((s) => ({ locale, slug: s.slug }))
    })
  )
  return results.flat()
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const s = await getStory(params.locale as Locale, params.slug)
  return s ? { title: s.title, description: s.excerpt } : {}
}

export default async function StoryPage({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const story = await getStory(locale, params.slug)
  if (!story) notFound()

  const [node, destChains, countries] = await Promise.all([
    getStoryNode(locale, story.slug),
    resolveStops(locale, story.relatedDestinations),
    Promise.all(story.relatedCountries.map((slug) => getCountry(locale, slug))),
  ])
  const body = node ? renderArticleBody(node, locale) : null
  const relatedCountries = countries.filter((c): c is NonNullable<typeof c> => Boolean(c))

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--prose-width)] mx-auto">
          <Breadcrumbs
            items={[
              { label: ui.explore.title, href: `/${locale}/explore` },
              { label: ui.explore.stories, href: `/${locale}/explore/stories` },
              { label: story.title },
            ]}
          />

          {story.publishedAt && (
            <span className="label-stamped block mb-3" style={{ color: 'var(--color-smudge)' }}>
              {formatDate(story.publishedAt, locale)}
            </span>
          )}
          <h1
            className="text-4xl md:text-5xl font-black leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {story.title}
          </h1>
          {story.excerpt && (
            <p className="mt-4 text-lg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
              {story.excerpt}
            </p>
          )}
          <div className="mt-10 h-px" style={{ backgroundColor: 'var(--color-torn)' }} />
        </div>

        <PostBody>{body}</PostBody>

        {/* ── Places mentioned in this story ── */}
        {(destChains.length > 0 || relatedCountries.length > 0) && (
          <section className="px-8 mt-20 pt-12 border-t" style={{ borderColor: 'var(--color-torn)' }}>
            <div className="max-w-[var(--prose-width)] mx-auto">
              <p className="label-stamped mb-6">{ui.explore.appearsIn}</p>

              {relatedCountries.length > 0 && (
                <ul className="mb-6 flex flex-wrap gap-x-6 gap-y-2">
                  {relatedCountries.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${locale}/explore/destinations/${c.slug}`}
                        className="font-bold hover:underline"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {destChains.length > 0 && (
                <ul className="space-y-3">
                  {destChains.map(({ country, city, destination }) => (
                    <li key={destination.slug}>
                      <Link
                        href={`/${locale}/explore/destinations/${country.slug}/${city.slug}/${destination.slug}`}
                        className="font-bold hover:underline"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                      >
                        {destination.name}
                      </Link>{' '}
                      <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                        {city.name}, {country.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </div>
  )
}
