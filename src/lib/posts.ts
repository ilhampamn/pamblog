import type { Node } from '@markdoc/markdoc'
import { reader, resolveContent, type ContentValue } from '@/lib/reader'
import type { Locale } from '@/lib/i18n'

/**
 * A single article projected into one language. Both locales of an article
 * share the same `slug`; only title/excerpt/body/readingTime change per locale.
 */
export interface Post {
  slug: string
  locale: Locale
  title: string
  publishedAt: string
  tag: string
  excerpt?: string
  coverImage?: string
  readingTime: number
}

// ── helpers ────────────────────────────────────────────────────────────────

type ArticleEntry = NonNullable<
  Awaited<ReturnType<typeof reader.collections.articles.read>>
>

function pickTitle(entry: ArticleEntry, locale: Locale): string {
  if (locale === 'id') return entry.titleId?.trim() || entry.title
  return entry.title
}

function pickExcerpt(entry: ArticleEntry, locale: Locale): string | undefined {
  const value = locale === 'id' ? entry.excerptId : entry.excerpt
  return value?.trim() ? value : undefined
}

function pickReadingTime(entry: ArticleEntry, locale: Locale): number {
  // Level 1: read from frontmatter — no body parse needed on list pages.
  const value = locale === 'id' ? entry.readingTimeId : entry.readingTimeEn
  return value ?? 1
}

function bodyFor(entry: ArticleEntry, locale: Locale): ContentValue {
  return locale === 'id' ? entry.contentId : entry.content
}

/**
 * Build a Post (metadata only) from an entry.
 * Does NOT read the body — all data comes from frontmatter.
 */
function toPost(slug: string, entry: ArticleEntry, locale: Locale): Post {
  return {
    slug,
    locale,
    title: pickTitle(entry, locale),
    publishedAt: entry.publishedAt ?? '',
    tag: entry.tag,
    excerpt: pickExcerpt(entry, locale),
    coverImage: entry.coverImage ?? undefined,
    readingTime: pickReadingTime(entry, locale),
  }
}

// ── public API ─────────────────────────────────────────────────────────────

/**
 * All articles for one locale, sorted newest-first.
 * Fast: only reads frontmatter (no body files opened).
 */
export async function getPostsByLocale(locale: Locale): Promise<Post[]> {
  const slugs = await reader.collections.articles.list()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const entry = await reader.collections.articles.read(slug)
      return entry ? toPost(slug, entry, locale) : null
    })
  )
  return posts
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

/**
 * Metadata for one article in one locale.
 * Fast: only reads frontmatter.
 */
export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<Post | undefined> {
  const entry = await reader.collections.articles.read(slug)
  if (!entry) return undefined
  return toPost(slug, entry, locale)
}

/** Both locales share a slug, so the alternate is the same article in the other language. */
export async function getAlternatePost(
  locale: Locale,
  slug: string
): Promise<Post | null> {
  const other: Locale = locale === 'en' ? 'id' : 'en'
  const entry = await reader.collections.articles.read(slug)
  if (!entry) return null
  return toPost(slug, entry, other)
}

/**
 * The parsed Markdoc body node for one locale.
 * Only called on the post detail page (not list pages).
 */
export async function getArticleNode(
  locale: Locale,
  slug: string
): Promise<Node | null> {
  const entry = await reader.collections.articles.read(slug)
  if (!entry) return null
  const { node } = await resolveContent(bodyFor(entry, locale))
  return node
}

/** Lightweight preview used by the inline <LinkedPost> hover card. */
export async function getArticlePreview(
  slug: string,
  locale: Locale
): Promise<Pick<Post, 'title' | 'excerpt' | 'tag' | 'coverImage'> | null> {
  const entry = await reader.collections.articles.read(slug)
  if (!entry) return null
  return {
    title: pickTitle(entry, locale),
    excerpt: pickExcerpt(entry, locale),
    tag: entry.tag,
    coverImage: entry.coverImage ?? undefined,
  }
}
