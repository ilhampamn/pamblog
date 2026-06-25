import type { Locale } from '@/lib/i18n'

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

// Placeholder until Velite is wired up — returns typed dummy data
export function getPostsByLocale(locale: Locale): Post[] {
  return DUMMY_POSTS.filter((p) => p.locale === locale).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
}

export function getPostBySlug(locale: Locale, slug: string): Post | undefined {
  return DUMMY_POSTS.find((p) => p.locale === locale && p.slug === slug)
}

export function getAlternatePost(locale: Locale, slug: string): Post | null {
  const otherLocale: Locale = locale === 'en' ? 'id' : 'en'
  return DUMMY_POSTS.find((p) => p.locale === otherLocale && p.slug === slug) ?? null
}

// Dummy data — replace with Velite import once content is wired
const DUMMY_POSTS: Post[] = [
  {
    slug: 'light-and-shadow',
    locale: 'en',
    title: 'Light and Shadow: What Photography Taught Me About Seeing',
    publishedAt: '2026-06-01',
    tag: 'essay',
    excerpt:
      'Photography is not about capturing what is there. It is about choosing what to notice.',
    readingTime: 6,
  },
  {
    slug: 'building-in-public',
    locale: 'en',
    title: 'Building in Public, Quietly',
    publishedAt: '2026-05-14',
    tag: 'note',
    excerpt: 'A record of making things without waiting to be ready.',
    readingTime: 4,
  },
  {
    slug: 'tools-i-use',
    locale: 'en',
    title: 'The Tools I Actually Use',
    publishedAt: '2026-04-22',
    tag: 'review',
    excerpt: 'A honest account of what stays open on my desk.',
    readingTime: 8,
  },
  {
    slug: 'cahaya-dan-bayangan',
    locale: 'id',
    title: 'Cahaya dan Bayangan: Apa yang Fotografi Ajarkan Tentang Melihat',
    publishedAt: '2026-06-01',
    tag: 'essay',
    excerpt:
      'Fotografi bukan tentang menangkap apa yang ada. Ini tentang memilih apa yang ingin diperhatikan.',
    readingTime: 6,
  },
  {
    slug: 'membangun-di-depan-umum',
    locale: 'id',
    title: 'Membangun di Depan Umum, dengan Tenang',
    publishedAt: '2026-05-14',
    tag: 'catatan',
    excerpt: 'Catatan tentang membuat sesuatu tanpa menunggu siap.',
    readingTime: 4,
  },
]
