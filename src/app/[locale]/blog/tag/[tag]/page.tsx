import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { getPostsByLocale } from '@/lib/posts'
import { t, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/date'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const results = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getPostsByLocale(locale)
      const tags = Array.from(new Set(posts.map((p) => p.tag)))
      return tags.map((tag) => ({ locale, tag }))
    })
  )
  return results.flat()
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; tag: string }
}): Promise<Metadata> {
  return {
    title: params.tag,
    description: `Posts tagged "${params.tag}"`,
  }
}

export default async function TagPage({
  params,
}: {
  params: { locale: string; tag: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const tag = decodeURIComponent(params.tag)
  const allPosts = await getPostsByLocale(locale)
  const posts = allPosts.filter((p) => p.tag === tag)

  if (posts.length === 0) notFound()

  // Group by year
  const byYear = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = new Date(post.publishedAt).getFullYear().toString()
    if (!acc[year]) acc[year] = []
    acc[year].push(post)
    return acc
  }, {})
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a))

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0 px-8 min-h-screen"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        <div className="max-w-[var(--layout-width)] mx-auto">

          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2">
            <Link
              href={`/${locale}/blog`}
              className="label-stamped hover:text-[var(--color-ink)] transition-colors"
              style={{ color: 'var(--color-smudge)' }}
            >
              {ui.nav.blog}
            </Link>
            <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">/</span>
            <span className="label-stamped" style={{ color: 'var(--color-ink)' }}>{tag}</span>
          </div>

          {/* Heading */}
          <div className="mb-16 max-w-[var(--prose-width)]">
            <h1
              className="text-5xl md:text-6xl font-black mb-4 leading-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {tag}
            </h1>
            <p className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
              {posts.length} {locale === 'id' ? 'tulisan' : 'posts'}
            </p>
          </div>

          {/* Posts by year */}
          <div className="space-y-16">
            {years.map((year) => (
              <section key={year}>
                <p
                  className="text-6xl font-black mb-8 leading-none select-none"
                  aria-hidden="true"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--color-torn)' }}
                >
                  {year}
                </p>

                <ul className="divide-y" style={{ borderColor: 'var(--color-torn)' }}>
                  {byYear[year].map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="group flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-5"
                      >
                        <span
                          className="flex-1 font-bold leading-snug group-hover:underline"
                          style={{
                            fontFamily: 'var(--font-display)',
                            color: 'var(--color-ink)',
                            textDecorationColor: 'var(--color-torn)',
                          }}
                        >
                          {post.title}
                        </span>
                        <span
                          className="label-stamped shrink-0 text-right"
                          style={{ color: 'var(--color-smudge)' }}
                        >
                          {formatDate(post.publishedAt, locale)}
                          <span className="mx-2" aria-hidden="true">·</span>
                          {post.readingTime} {ui.post.readingTime}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* Back link */}
          <div className="mt-16 mb-4">
            <Link
              href={`/${locale}/blog`}
              className="label-stamped hover:text-[var(--color-ink)] transition-colors"
              style={{ color: 'var(--color-smudge)' }}
            >
              ← {locale === 'id' ? 'Semua tulisan' : 'All posts'}
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
