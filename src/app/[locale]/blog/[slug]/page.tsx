import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { Figure } from '@/components/proof/Figure'
import { Mark } from '@/components/proof/Mark'
import { Pilcrow } from '@/components/proof/Proof'
import { PenLink } from '@/components/proof/Pen'
import { PrintedForm } from '@/components/proof/PrintedForm'
import { ArticleBody } from '@/components/proof/Prose'
import { dateline, folio, handDate, nextChapter, tagLabel } from '@/components/proof/content'
import { getPostBySlug, getPostsByLocale, getArticleBody, type Post } from '@/lib/posts.sanity'
import { LOCALES, isLocale, t } from '@/lib/i18n'

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
  if (!isLocale(params.locale)) return {}
  const post = await getPostBySlug(params.locale, params.slug)
  if (!post) return {}

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ilhampamungkas.com'
  const generatedOgUrl = `${BASE_URL}/og?title=${encodeURIComponent(post.title)}&tag=${encodeURIComponent(post.tag)}&rt=${post.readingTime}`

  // Prefer the article's own cover image for link previews (Twitter, iMessage,
  // Slack, etc.); fall back to the generated title-card image when there isn't one.
  const ogImage = post.coverImage
    ? { url: post.coverImage, alt: post.title }
    : { url: generatedOgUrl, width: 1200, height: 630, alt: post.title }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage.url],
    },
  }
}

/**
 * The article (DESIGN.md → Layout, Components): folio, title, dek, meta; the
 * cover whole, with Ilham's numbered photo notes if he wrote any; the body in
 * a 66ch column with his margin notes beside their paragraphs; then the next
 * chapter, the read-back stamp, the newsletter line and related stories.
 */
export default async function PostPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale).proof
  const base = `/${locale}`

  const post = await getPostBySlug(locale, params.slug)
  if (!post) notFound()
  const [blocks, all] = await Promise.all([
    getArticleBody(locale, params.slug),
    getPostsByLocale(locale).catch(() => [] as Post[]),
  ])

  const id = `article:${post.slug}`
  const next = nextChapter(post, all)
  const related = all.filter((p) => p.tag === post.tag && p.slug !== post.slug && p !== next).slice(0, 3)
  const { pen } = post

  return (
    <SiteFrame locale={locale} current="stories" path={`/blog/${post.slug}`}>
      <article className="tp-article">
        <header className="tp-article__head">
          <Link href={`${base}/blog?tag=${encodeURIComponent(post.tag)}`} className="tp-label tp-folio">
            {folio(post, locale)}
          </Link>
          <h1 className="tp-article__title">{post.title}</h1>
          {post.excerpt && <p className="tp-article__dek">{post.excerpt}</p>}
          <p className="tp-meta">
            Ilham Pamungkas · {dateline(post.publishedAt, locale)} · {post.readingTime} {ui.minRead}
          </p>
        </header>

        {post.coverImage &&
          (pen.photoNotes.length > 0 ? (
            <Figure
              id={id}
              src={post.coverImage}
              alt={post.title}
              plate={post.title}
              callouts={pen.photoNotes.map((n) => ({ x: n.x / 100, y: n.y / 100, note: n.note }))}
            />
          ) : (
            <figure className="tp-figure">
              <div className="tp-figure__frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt={post.title} />
              </div>
            </figure>
          ))}

        <ArticleBody blocks={blocks} notes={pen.marginNotes} locale={locale} id={id} />

        <div className="tp-break" role="separator">
          <Pilcrow id={`${id}:break`} size={1.5} />
        </div>

        {(next || pen.place) && (
          <footer className="tp-article__end">
            {next && (
              <>
                <span className="tp-label">{ui.next}</span>
                <PenLink id={`${id}:next`} href={`${base}/blog/${next.slug}`} className="tp-next">
                  {next.title} →
                </PenLink>
              </>
            )}
            {pen.place && (
              // The read-back stamp: the logo's "Pam." block pressed on like a
              // rubber stamp, then where and when Ilham read it back, in the pen.
              <span className="tp-readback">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/pam-block-360.webp" width={360} height={121} alt="Pam." className="tp-readback__stamp" />
                <Mark id={`${id}:readback`} kind="underline">
                  <span className="tp-hand">
                    {ui.readBack} · {pen.place} · {handDate(pen.readBackDate ?? post.publishedAt)}
                  </span>
                </Mark>
              </span>
            )}
          </footer>
        )}

        <div className="tp-article__subscribe">
          <PrintedForm id={`${id}:newsletter`} prompt={ui.newsletterPrompt} field={ui.emailField} action={ui.send} />
        </div>

        {related.length > 0 && (
          <section className="tp-related" aria-labelledby={`${id}-related`}>
            <h2 id={`${id}-related`} className="tp-section-head">
              {ui.related}
            </h2>
            <ol className="tp-latest">
              {related.map((p) => (
                <li key={p.slug}>
                  <span className="tp-label">{tagLabel(p.tag, locale)}</span>
                  <Link href={`${base}/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ol>
          </section>
        )}
      </article>
    </SiteFrame>
  )
}
