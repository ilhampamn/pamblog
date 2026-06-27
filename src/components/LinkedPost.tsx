import Link from 'next/link'
import { getArticlePreview } from '@/lib/posts'
import type { Locale } from '@/lib/i18n'

/**
 * Inline reference to another article. Renders as an underlined link; on hover
 * or focus a small card fades in showing the referenced article's cover, tag,
 * title and excerpt — like a wiki backlink preview.
 *
 * This is the SITE counterpart to the `linkedPost` content component defined in
 * `src/keystatic/content-components.tsx`. It is an async Server Component: the
 * referenced article's preview data is read at render time, so the card markup
 * is fully server-rendered and the hover behaviour is pure CSS (no JS).
 */
export async function LinkedPost({
  slug,
  locale,
}: {
  slug: string | null
  locale: Locale
}) {
  if (!slug) return null

  const preview = await getArticlePreview(slug, locale)
  // Referenced article is missing — fail soft rather than break the page.
  if (!preview) return null

  const href = `/${locale}/blog/${slug}`

  return (
    <span className="linked-post">
      <Link href={href} className="linked-post__anchor">
        {preview.title}
      </Link>

      <span className="linked-post__card" role="note" aria-hidden="true">
        {preview.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.coverImage}
            alt=""
            className="linked-post__cover"
          />
        )}
        <span className="linked-post__body">
          <span className="linked-post__tag">{preview.tag}</span>
          <span className="linked-post__title">{preview.title}</span>
          {preview.excerpt && (
            <span className="linked-post__excerpt">{preview.excerpt}</span>
          )}
        </span>
      </span>
    </span>
  )
}
