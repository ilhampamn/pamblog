import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ProgressBar } from '@/components/ProgressBar'
import { PostBody } from '@/components/PostBody'
import { NewsletterWidget } from '@/components/NewsletterWidget'
import { getPostBySlug, getPostsByLocale, getArticleNode } from '@/lib/posts'
import { renderArticleBody } from '@/lib/markdoc'
import { t, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/date'

const LOCALES = ['en', 'id'] as const

export async function generateStaticParams() {
  const results = await Promise.all(
    LOCALES.map(async (locale) => {
      const posts = await getPostsByLocale(locale)
      return posts.map((post) => ({ locale, slug: post.slug }))
    })
  )
  return results.flat()
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const post = await getPostBySlug(params.locale as Locale, params.slug)
  if (!post) return {}

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ilhampamungkas.com'
  const ogUrl = `${BASE_URL}/og?title=${encodeURIComponent(post.title)}&tag=${encodeURIComponent(post.tag)}&rt=${post.readingTime}`

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogUrl],
    },
  }
}

export default async function PostPage({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const post = await getPostBySlug(locale, params.slug)
  if (!post) notFound()

  const node = await getArticleNode(locale, params.slug)
  const body = node ? renderArticleBody(node, locale) : null

  const ui = t(locale)
  const allPosts = await getPostsByLocale(locale)

  // Related posts: same tag, exclude current
  const related = allPosts
    .filter((p) => p.tag === post.tag && p.slug !== post.slug)
    .slice(0, 3)

  const isLongPost = post.readingTime > 8 // placeholder for word-count gate

  return (
    <div className="page-shell">
      <ProgressBar />
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        {/* ── Post header ── */}
        <header className="px-8 mb-16">
          <div className="max-w-[var(--prose-width)] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href={`/${locale}/blog/tag/${post.tag}`}
                className="label-stamped hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-blush)' }}
              >
                {post.tag}
              </Link>
              <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">·</span>
              <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                {formatDate(post.publishedAt, locale)}
              </span>
              <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">·</span>
              <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                {post.readingTime} {ui.post.readingTime}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-black leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className="mt-4 text-lg"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Divider */}
            <div
              className="mt-10 h-px"
              style={{ backgroundColor: 'var(--color-torn)' }}
            />
          </div>
        </header>

        <div className="relative px-8">
          {/* Optional sticky ToC placeholder (visible ≥ 1280px on long posts) */}
          {isLongPost && (
            <aside
              className="hidden xl:block absolute left-8 top-0 w-48"
              style={{ color: 'var(--color-smudge)' }}
            >
              <p className="label-stamped mb-3">Contents</p>
              <nav className="space-y-2">
                <a
                  href="#exposure-is-a-decision"
                  className="block text-sm hover:text-[var(--color-ink)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Exposure is a decision
                </a>
                <a
                  href="#shadow-is-not-the-absence-of-light"
                  className="block text-sm hover:text-[var(--color-ink)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Shadow &amp; light
                </a>
                <a
                  href="#what-i-actually-learned"
                  className="block text-sm hover:text-[var(--color-ink)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  What I learned
                </a>
              </nav>
            </aside>
          )}

          {/* ── Post body ── */}
          <PostBody>
            {/* CTA 1: after intro — compact newsletter */}
            <div
              className="my-10 py-6 border-y"
              style={{ borderColor: 'var(--color-torn)' }}
            >
              <NewsletterWidget
                cta={ui.newsletter.cta}
                placeholder={ui.newsletter.placeholder}
                button={ui.newsletter.button}
                variant="inline"
              />
            </div>

            {body}

            {/* CTA 3: end of post — full newsletter card */}
            <div className="mt-16">
              <NewsletterWidget
                cta={ui.newsletter.cta}
                placeholder={ui.newsletter.placeholder}
                button={ui.newsletter.button}
                variant="card"
              />
            </div>
          </PostBody>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <section className="px-8 mt-24 pt-12 border-t" style={{ borderColor: 'var(--color-torn)' }}>
            <div className="max-w-[var(--prose-width)] mx-auto">
              <p className="label-stamped mb-8">{ui.post.relatedPosts}</p>
              <ul className="space-y-6">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${locale}/blog/${p.slug}`}
                      className="group flex items-baseline gap-4"
                    >
                      <span className="label-stamped shrink-0" style={{ color: 'var(--color-smudge)' }}>
                        {p.tag}
                      </span>
                      <span
                        className="font-bold group-hover:underline"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-ink)',
                          textDecorationColor: 'var(--color-torn)',
                        }}
                      >
                        {p.title}
                      </span>
                      <span className="label-stamped ml-auto shrink-0" style={{ color: 'var(--color-smudge)' }}>
                        {p.readingTime} {ui.post.readingTime}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Back to all posts */}
              <div className="mt-12">
                <Link
                  href={`/${locale}/blog`}
                  className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  ← {locale === 'id' ? 'Semua tulisan' : 'All posts'}
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer locale={locale} />
    </div>
  )
}
