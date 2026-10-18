import type { PortableTextBlock } from '@portabletext/react'
import { Ex4Mark, type Pen } from './Ex4Mark'
import { getArticleBody, getPostsByLocale, type Post } from '@/lib/posts.sanity'
import { getCloudinaryImagesByTag, type CloudinaryAsset } from '@/lib/cloudinary'
import type { Locale } from '@/lib/i18n'

/**
 * Content plumbing shared by the read-back-proof explorations (experiments
 * 4–6), so the three are judged against the same real posts and photos.
 */

export async function loadProofContent(locale: Locale) {
  const [posts, photos] = await Promise.all([
    getPostsByLocale(locale).catch(() => [] as Post[]),
    getCloudinaryImagesByTag('blog-gallery').catch(() => [] as CloudinaryAsset[]),
  ])
  const lead = posts.find((p) => p.tag === 'stories' && p.coverImage) ?? posts[0]
  const body = lead ? await getArticleBody(locale, lead.slug).catch(() => null) : null
  return {
    posts,
    photos,
    lead,
    paras: paragraphs(body, 3),
    coverSrc: lead?.coverImage ?? photos[0]?.url,
  }
}

export function dateline(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === 'zh' ? 'zh-CN' : locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Folio line: "Season 1 — Chapter 3", or the tag for anything outside a season. */
export function folio(post: Post) {
  const ch = post.storyChapter
  if (ch?.season) return `Season ${ch.season.seasonNumber} — Chapter ${ch.chapterNumber}`
  if (ch) return `Chapter ${ch.chapterNumber}`
  return post.tag
}

/**
 * The headline's one italic phrase. In production it's chosen in the content;
 * here the last two words stand in so the device can be judged.
 */
export function Headline({ title }: { title: string }) {
  const words = title.trim().split(/\s+/)
  if (words.length < 4) return <>{title}</>
  const head = words.slice(0, -2).join(' ')
  const tail = words.slice(-2).join(' ')
  return (
    <>
      {head} <em>{tail}</em>
    </>
  )
}

/** Circles one word of the dek. The longest word stands in for an authored choice. */
export function DekWithMark({ text, id, pen }: { text: string; id: string; pen?: Pen }) {
  const words = text.split(' ')
  let pick = 0
  words.forEach((w, i) => {
    if (w.replace(/\W/g, '').length > words[pick].replace(/\W/g, '').length) pick = i
  })
  const clean = words[pick].replace(/[^A-Za-z0-9\u00C0-\u024F'’-]/g, '')
  const [before, after] = words[pick].split(clean)
  return (
    <>
      {words.slice(0, pick).join(' ')} {before}
      <Ex4Mark id={`${id}:dek`} kind="circle" pen={pen}>
        {clean}
      </Ex4Mark>
      {after} {words.slice(pick + 1).join(' ')}
    </>
  )
}

export function paragraphs(body: PortableTextBlock[] | null, max: number) {
  if (!body) return []
  return body
    .filter((b) => b._type === 'block' && (b.style ?? 'normal') === 'normal')
    .map((b) =>
      ((b.children as { text?: string }[] | undefined) ?? []).map((c) => c.text ?? '').join('')
    )
    .filter((t) => t.trim().length > 40)
    .slice(0, max)
}
