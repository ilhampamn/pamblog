import type { MetadataRoute } from 'next'
import { getPostsByLocale } from '@/lib/posts'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ilhampamungkas.com'
const LOCALES = ['en', 'id'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/blog', '/about', '/uses', '/newsletter']

  const staticEntries = LOCALES.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  const postEntries = LOCALES.flatMap((locale) =>
    getPostsByLocale(locale).map((post) => ({
      url: `${BASE_URL}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  return [...staticEntries, ...postEntries]
}
