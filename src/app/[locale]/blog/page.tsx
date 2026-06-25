import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getPostsByLocale } from '@/lib/posts'
import { t, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/date'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const locale = params.locale as Locale
  return {
    title: locale === 'id' ? 'Tulisan' : 'Writing',
    description:
      locale === 'id'
        ? 'Semua tulisan — esai, catatan, ulasan, dan tutorial.'
        : 'All writing — essays, notes, reviews, and tutorials.',
  }
}

export default function BlogIndexPage({
  params,
  searchParams,
}: {
  params: { locale: string }
  searchParams: { tag?: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const activeTag = searchParams.tag ?? null

  const allPosts = getPostsByLocale(locale)
  const posts = activeTag
    ? allPosts.filter((p) => p.tag === activeTag)
    : allPosts

  // Group by year
  const byYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.publishedAt).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  // Unique tags for filter
  const allTags = Array.from(new Set(allPosts.map((p) => p.tag))).sort()

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0 px-8 min-h-screen"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        <div className="max-w-[var(--layout-width)] mx-auto">

          {/* ── Page header ── */}
          <div className="mb-16 max-w-[var(--prose-width)]">
            <h1
              className="text-5xl md:text-6xl font-black mb-4 leading-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {ui.nav.blog}
            </h1>
            <p className="label-stamped">
              {posts.length} {locale === 'id' ? 'tulisan' : 'posts'}
              {activeTag ? ` · ${activeTag}` : ''}
            </p>
          </div>

          {/* ── Tag filter ── */}
          <div className="flex flex-wrap gap-3 mb-16">
            <Link
              href={`/${locale}/blog`}
              className="label-stamped transition-colors"
              style={{ color: !activeTag ? 'var(--color-ink)' : 'var(--color-smudge)' }}
            >
              {locale === 'id' ? 'Semua' : 'All'}
            </Link>
            {allTags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog?tag=${tag}`}
                className="label-stamped transition-colors hover:text-[var(--color-ink)]"
                style={{ color: activeTag === tag ? 'var(--color-ink)' : 'var(--color-smudge)' }}
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* ── Posts by year ── */}
          {years.length === 0 ? (
            <p className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
              {locale === 'id' ? 'Belum ada tulisan.' : 'No posts yet.'}
            </p>
          ) : (
            <div className="space-y-16">
              {years.map((year) => (
                <section key={year}>
                  {/* Year label */}
                  <p
                    className="text-6xl font-black mb-8 leading-none select-none"
                    aria-hidden="true"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--color-torn)',
                    }}
                  >
                    {year}
                  </p>

                  {/* Post list */}
                  <ul className="divide-y" style={{ borderColor: 'var(--color-torn)' }}>
                    {byYear[year].map((post) => (
                      <li key={post.slug} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5">
                          {/* Tag — separate link, not nested */}
                          <Link
                            href={`/${locale}/blog/tag/${post.tag}`}
                            className="label-stamped shrink-0 w-20 hover:text-[var(--color-ink)] transition-colors"
                            style={{ color: 'var(--color-smudge)' }}
                          >
                            {post.tag}
                          </Link>

                          {/* Title */}
                          <Link
                            href={`/${locale}/blog/${post.slug}`}
                            className="flex-1 text-base font-bold leading-snug hover:underline"
                            style={{
                              fontFamily: 'var(--font-display)',
                              color: 'var(--color-ink)',
                              textDecorationColor: 'var(--color-torn)',
                            }}
                          >
                            {post.title}
                          </Link>

                          {/* Meta */}
                          <span
                            className="label-stamped shrink-0 sm:text-right"
                            style={{ color: 'var(--color-smudge)' }}
                          >
                            {formatDate(post.publishedAt, locale)}
                            <span className="mx-2" aria-hidden="true">·</span>
                            {post.readingTime} {ui.post.readingTime}
                          </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
