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
  // ── English ──
  {
    slug: 'light-and-shadow',
    locale: 'en',
    title: 'Light and Shadow: What Photography Taught Me About Seeing',
    publishedAt: '2026-06-01',
    tag: 'essay',
    excerpt: 'Photography is not about capturing what is there. It is about choosing what to notice.',
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
    slug: 'on-slow-travel',
    locale: 'en',
    title: 'On Slow Travel and the Art of Arriving',
    publishedAt: '2026-03-10',
    tag: 'essay',
    excerpt: 'Speed is not a virtue when the point is to see.',
    readingTime: 5,
  },
  {
    slug: 'shooting-film-in-2026',
    locale: 'en',
    title: 'Shooting Film in 2026',
    publishedAt: '2026-02-18',
    tag: 'review',
    excerpt: 'Why I went back to film and what it cost me — literally.',
    readingTime: 7,
  },
  {
    slug: 'gsap-for-designers',
    locale: 'en',
    title: 'GSAP for Designers Who Are Afraid of JavaScript',
    publishedAt: '2025-11-04',
    tag: 'tutorial',
    excerpt: 'You do not need to understand closures to make things move beautifully.',
    readingTime: 12,
  },
  {
    slug: 'the-value-of-constraints',
    locale: 'en',
    title: 'The Value of Constraints',
    publishedAt: '2025-09-22',
    tag: 'essay',
    excerpt: 'Every creative decision is made in a room. The smaller the room, the sharper the thinking.',
    readingTime: 5,
  },
  {
    slug: 'how-i-take-notes',
    locale: 'en',
    title: 'How I Take Notes (And Why It Keeps Changing)',
    publishedAt: '2025-07-15',
    tag: 'note',
    excerpt: 'A system is only good until you outgrow it.',
    readingTime: 6,
  },
  // ── Indonesian ──
  {
    slug: 'cahaya-dan-bayangan',
    locale: 'id',
    title: 'Cahaya dan Bayangan: Apa yang Fotografi Ajarkan Tentang Melihat',
    publishedAt: '2026-06-01',
    tag: 'essay',
    excerpt: 'Fotografi bukan tentang menangkap apa yang ada. Ini tentang memilih apa yang ingin diperhatikan.',
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
  {
    slug: 'perjalanan-lambat',
    locale: 'id',
    title: 'Tentang Perjalanan Lambat dan Seni Tiba',
    publishedAt: '2026-03-10',
    tag: 'essay',
    excerpt: 'Kecepatan bukan kebajikan ketika tujuannya adalah melihat.',
    readingTime: 5,
  },
  {
    slug: 'memotret-dengan-film',
    locale: 'id',
    title: 'Memotret dengan Film di 2026',
    publishedAt: '2026-02-18',
    tag: 'ulasan',
    excerpt: 'Kenapa saya kembali ke film dan apa yang harus dibayar — secara harfiah.',
    readingTime: 7,
  },
  {
    slug: 'nilai-keterbatasan',
    locale: 'id',
    title: 'Nilai dari Keterbatasan',
    publishedAt: '2025-11-04',
    tag: 'essay',
    excerpt: 'Setiap keputusan kreatif dibuat dalam sebuah ruangan. Semakin kecil ruangannya, semakin tajam pemikirannya.',
    readingTime: 5,
  },
]
