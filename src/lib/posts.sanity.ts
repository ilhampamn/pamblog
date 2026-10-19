import type { PortableTextBlock } from '@portabletext/react'
import { sanityClient } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import {
  articlesListQuery,
  articleBySlugQuery,
  articleBodyBySlugQuery,
  articlePreviewQuery,
} from '@/sanity/queries'
import type { Locale } from '@/lib/i18n'

// Next.js may retain Sanity fetches in its development data cache. Bypass that
// cache locally so newly published Studio changes appear on refresh; production
// continues to use the existing ISR/webhook behavior.
const developmentFetchOptions =
  process.env.NODE_ENV === 'development'
    ? ({ cache: 'no-store' } as const)
    : undefined

/**
 * Sanity-backed replacement for src/lib/posts.ts.
 *
 * PUBLIC SIGNATURES ARE PRESERVED so pages need minimal changes — with ONE
 * intentional exception: the body path. Markdoc returned an AST `Node` rendered
 * by `renderArticleBody`; Sanity returns Portable Text blocks rendered by
 * `renderPortableText`. So `getArticleNode` becomes `getArticleBody`.
 *
 * Localization + English fallback happen in GROQ (see queries.ts `loc()`), so
 * these functions just shape the result.
 */
export interface Post {
  slug: string
  locale: Locale
  title: string
  publishedAt: string
  tag: string
  storyChapter?: {
    title: string
    chapterNumber: number
    season?: {
      title: string
      /** Ilham's line about the journey this season covers (optional). */
      description?: string
      seasonNumber: number
    }
  }
  excerpt?: string
  coverImage?: string
  readingTime: number
  /** The hand-written layer, as Ilham wrote it in Sanity (all optional). */
  pen: PenNotes
}

export interface PenNotes {
  word?: string
  /** A phrase of the excerpt to highlight in yellow. */
  highlight?: string
  leadNote?: string
  photoNotes: { x: number; y: number; note: string }[]
  marginNotes: { paragraph: number; note: string }[]
  place?: string
  readBackDate?: string
}

type RawPen = {
  word?: string | null
  highlight?: string | null
  leadNote?: string | null
  photoNotes?: { x?: number | null; y?: number | null; note?: string | null }[] | null
  marginNotes?: { paragraph?: number | null; note?: string | null }[] | null
  place?: string | null
  readBackDate?: string | null
} | null

function toPen(raw: RawPen | undefined): PenNotes {
  const clean = (s?: string | null) => (s?.trim() ? s.trim() : undefined)
  return {
    word: clean(raw?.word),
    highlight: clean(raw?.highlight),
    leadNote: clean(raw?.leadNote),
    photoNotes: (raw?.photoNotes ?? [])
      .filter((n) => n?.note?.trim() && typeof n.x === 'number' && typeof n.y === 'number')
      .map((n) => ({ x: n.x as number, y: n.y as number, note: (n.note as string).trim() })),
    marginNotes: (raw?.marginNotes ?? [])
      .filter((n) => n?.note?.trim() && typeof n.paragraph === 'number')
      .map((n) => ({ paragraph: n.paragraph as number, note: (n.note as string).trim() })),
    place: clean(raw?.place),
    readBackDate: clean(raw?.readBackDate),
  }
}

type RawPost = {
  slug: string
  title: string | null
  excerpt: string | null
  readingTime: number | null
  tag: string
  storyChapter?: {
    title: string | null
    chapterNumber: number
    season?: {
      title: string | null
      description?: string | null
      seasonNumber: number
    } | null
  } | null
  publishedAt: string
  coverImage?: unknown
  pen?: RawPen
}

function coverUrl(cover: unknown): string | undefined {
  if (!cover) return undefined
  return urlForImage(cover as never).width(1200).url()
}

function toPost(raw: RawPost, locale: Locale): Post {
  return {
    slug: raw.slug,
    locale,
    title: raw.title ?? '',
    publishedAt: raw.publishedAt ?? '',
    tag: raw.tag,
    storyChapter: raw.storyChapter
      ? {
          title: raw.storyChapter.title ?? '',
          chapterNumber: raw.storyChapter.chapterNumber,
          season: raw.storyChapter.season
            ? {
                title: raw.storyChapter.season.title ?? '',
                description: raw.storyChapter.season.description?.trim() || undefined,
                seasonNumber: raw.storyChapter.season.seasonNumber,
              }
            : undefined,
        }
      : undefined,
    excerpt: raw.excerpt?.trim() ? raw.excerpt : undefined,
    coverImage: coverUrl(raw.coverImage),
    readingTime: raw.readingTime ?? 1,
    pen: toPen(raw.pen),
  }
}

/** All articles for one locale, newest first. Already sorted in GROQ. */
export async function getPostsByLocale(locale: Locale): Promise<Post[]> {
  const raw = await sanityClient.fetch<RawPost[]>(
    articlesListQuery,
    { locale },
    developmentFetchOptions
  )
  return raw.map((r) => toPost(r, locale))
}

/** Metadata for one article in one locale. */
export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<Post | undefined> {
  const raw = await sanityClient.fetch<RawPost | null>(articleBySlugQuery, {
    locale,
    slug,
  }, developmentFetchOptions)
  return raw ? toPost(raw, locale) : undefined
}

/** The alternate-language projection of the same article (shared slug). */
export async function getAlternatePost(
  locale: Locale,
  slug: string
): Promise<Post | null> {
  const other: Locale = locale === 'en' ? 'id' : 'en'
  const raw = await sanityClient.fetch<RawPost | null>(articleBySlugQuery, {
    locale: other,
    slug,
  }, developmentFetchOptions)
  return raw ? toPost(raw, other) : null
}

/**
 * The Portable Text body for one locale (detail page only).
 * Falls back locale → English → Indonesian when the requested locale is empty.
 */
export async function getArticleBody(
  locale: Locale,
  slug: string
): Promise<PortableTextBlock[] | null> {
  const res = await sanityClient.fetch<{
      body?: PortableTextBlock[]
      bodyFallback?: PortableTextBlock[]
      bodyFallback2?: PortableTextBlock[]
    } | null>(
      articleBodyBySlugQuery,
      { locale, slug },
      developmentFetchOptions
    )
  if (!res) return null
  return res.body?.length
    ? res.body
    : res.bodyFallback?.length
      ? res.bodyFallback
      : res.bodyFallback2 ?? null
}

/** Lightweight preview for the inline <LinkedPost> hover card. */
export async function getArticlePreview(
  slug: string,
  locale: Locale
): Promise<Pick<Post, 'title' | 'excerpt' | 'tag' | 'coverImage'> | null> {
  const raw = await sanityClient.fetch<RawPost | null>(articlePreviewQuery, {
    locale,
    slug,
  }, developmentFetchOptions)
  if (!raw) return null
  return {
    title: raw.title ?? '',
    excerpt: raw.excerpt?.trim() ? raw.excerpt : undefined,
    tag: raw.tag,
    coverImage: coverUrl(raw.coverImage),
  }
}
