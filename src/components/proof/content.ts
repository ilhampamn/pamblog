import type { Post } from '@/lib/posts.sanity'
import { t, type Locale } from '@/lib/i18n'

/**
 * Small, server-safe text helpers shared by the rebuilt pages, so every page
 * writes dates, folios and tags the same way in all three languages.
 */

/** "Season {n}" → "Season 1". */
export function fmt(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? ''))
}

/** "1 story" / "3 stories" — the singular string is used for exactly one. */
export function count(n: number, one: string, many: string) {
  return n === 1 ? one : fmt(many, { n })
}

const INTL: Record<Locale, string> = { en: 'en-GB', id: 'id-ID', zh: 'zh-CN' }

/** "18 October 2026" / "18 Oktober 2026" / "2026年10月18日". */
export function dateline(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(INTL[locale], { day: 'numeric', month: 'long', year: 'numeric' })
}

/** The read-back stamp's date, as it would be written by hand: "18.10.26". */
export function handDate(iso: string) {
  const d = new Date(iso)
  const two = (n: number) => String(n).padStart(2, '0')
  return `${two(d.getUTCDate())}.${two(d.getUTCMonth() + 1)}.${two(d.getUTCFullYear() % 100)}`
}

/** A tag in the reader's language where the site has a word for it. */
export function tagLabel(tag: string, locale: Locale) {
  const ui = t(locale).proof
  if (tag === 'stories') return ui.stories
  if (tag === 'essay') return ui.essays
  return tag
}

/** Folio line: "Season 1 — Chapter 3", or the tag for anything outside a season. */
export function folio(post: Post, locale: Locale) {
  const ui = t(locale).proof
  const ch = post.storyChapter
  const chapter = ch ? fmt(ui.chapter, { n: ch.chapterNumber }) : ''
  if (ch?.season) return `${fmt(ui.season, { n: ch.season.seasonNumber })} — ${chapter}`
  if (ch) return chapter
  return tagLabel(post.tag, locale)
}

/** The chapter after this one in the same season, if it exists yet. */
export function nextChapter(post: Post, posts: Post[]) {
  const ch = post.storyChapter
  if (!ch) return undefined
  return posts.find(
    (p) =>
      p.storyChapter?.chapterNumber === ch.chapterNumber + 1 &&
      p.storyChapter?.season?.seasonNumber === ch.season?.seasonNumber
  )
}

/** Seasons that have chapters, in order: number, title, how many chapters. */
export function seasonsOf(posts: Post[]) {
  const map = new Map<number, { n: number; title: string; count: number }>()
  for (const p of posts) {
    const s = p.storyChapter?.season
    if (!s) continue
    const row = map.get(s.seasonNumber) ?? { n: s.seasonNumber, title: s.title, count: 0 }
    row.count += 1
    map.set(s.seasonNumber, row)
  }
  return Array.from(map.values()).sort((a, b) => a.n - b.n)
}
