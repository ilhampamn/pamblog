import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { count, dateline, folio, tagLabel } from '@/components/proof/content'
import { getPostsByLocale, type Post } from '@/lib/posts.sanity'
import { LOCALES, isLocale, t } from '@/lib/i18n'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {}
  return { title: t(params.locale).proof.stories }
}

/**
 * The Stories index: one reading column, like Medium's list — folio, title,
 * excerpt, meta, and the cover whole beside it. Tags filter with quiet links
 * (?tag=…); the current one carries the soft rule.
 */
export default async function BlogIndexPage({
  params,
  searchParams,
}: {
  params: { locale: string }
  searchParams: { tag?: string }
}) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale).proof
  const base = `/${locale}`

  const all = await getPostsByLocale(locale).catch(() => [] as Post[])
  const tags = Array.from(new Set(all.map((p) => p.tag))).sort()
  const active = searchParams.tag && tags.includes(searchParams.tag) ? searchParams.tag : null
  const posts = active ? all.filter((p) => p.tag === active) : all

  return (
    <SiteFrame locale={locale} current="stories" path="/blog">
      <div className="tp-index">
        <header className="tp-index__head">
          <h1 className="tp-index__title">{ui.stories}</h1>
          <span className="tp-label">{count(posts.length, ui.storiesOne, ui.storiesCount)}</span>
        </header>

        {tags.length > 1 && (
          <nav className="tp-index__tags" aria-label="Tags">
            <Link href={`${base}/blog`} className={`tp-quiet ${active ? '' : 'is-current'}`}>
              {ui.all}
            </Link>
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`${base}/blog?tag=${encodeURIComponent(tag)}`}
                className={`tp-quiet ${active === tag ? 'is-current' : ''}`}
              >
                {tagLabel(tag, locale)}
              </Link>
            ))}
          </nav>
        )}

        {posts.length === 0 ? (
          <p className="tp-meta">{ui.noStories}</p>
        ) : (
          <ol className="tp-entries">
            {posts.map((p) => (
              <li key={p.slug} className="tp-entry">
                <div className="tp-entry__text">
                  <span className="tp-label">{folio(p, locale)}</span>
                  <h2 className="tp-entry__title">
                    <Link href={`${base}/blog/${p.slug}`}>{p.title}</Link>
                  </h2>
                  {p.excerpt && <p className="tp-entry__dek">{p.excerpt}</p>}
                  <span className="tp-meta">
                    {dateline(p.publishedAt, locale)} · {p.readingTime} {ui.minRead}
                  </span>
                </div>
                {p.coverImage && (
                  <Link href={`${base}/blog/${p.slug}`} className="tp-entry__thumb" tabIndex={-1}>
                    {/* Shown whole (DESIGN.md → Layers), at one height. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.coverImage} alt="" loading="lazy" />
                  </Link>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </SiteFrame>
  )
}
