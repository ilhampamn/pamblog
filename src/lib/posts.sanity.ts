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
  excerpt?: string
  coverImage?: string
  readingTime: number
}

type RawPost = {
  slug: string
  title: string | null
  excerpt: string | null
  readingTime: number | null
  tag: string
  publishedAt: string
  coverImage?: unknown
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
    excerpt: raw.excerpt?.trim() ? raw.excerpt : undefined,
    coverImage: coverUrl(raw.coverImage),
    readingTime: raw.readingTime ?? 1,
  }
}

/** All articles for one locale, newest first. Already sorted in GROQ. */
export async function getPostsByLocale(locale: Locale): Promise<Post[]> {
  const raw = await sanityClient.fetch<RawPost[]>(articlesListQuery, { locale })
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
  })
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
  })
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
  } | null>(articleBodyBySlugQuery, { locale, slug })
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
  })
  if (!raw) return null
  return {
    title: raw.title ?? '',
    excerpt: raw.excerpt?.trim() ? raw.excerpt : undefined,
    tag: raw.tag,
    coverImage: coverUrl(raw.coverImage),
  }
}
