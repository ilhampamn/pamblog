import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { GalleryCard } from '@/components/GalleryCard'
import { t, type Locale } from '@/lib/i18n'
import { getCloudinaryImagesByTag } from '@/lib/cloudinary'
import { getPostsByLocale } from '@/lib/posts.sanity'

const LOCALES = ['en', 'id', 'zh'] as const
const GALLERY_TAG = 'blog-gallery'

// Existing gallery links can live here until their Cloudinary `story_slug`
// context is filled in. Asset context takes precedence over this fallback.
const STORY_BY_PUBLIC_ID: Record<string, string> = {
  IMG_6555_t1w7z5: 'maybe-you-don-t-know-about-yourself',
}

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return {
    title: params.locale === 'id' ? 'Galeri' : 'Gallery',
  }
}

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)
  const [assets, posts] = await Promise.all([
    getCloudinaryImagesByTag(GALLERY_TAG),
    getPostsByLocale(locale),
  ])
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]))

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-16 px-8">
        <div className="max-w-[var(--layout-width)] mx-auto">
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {locale === 'id' ? 'Galeri' : 'Gallery'}
          </h1>
          <p
            className="text-lg mb-16"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
          >
            {locale === 'id' ? 'Foto-foto dari perjalanan dan keseharian.' : 'Photos from travels and everyday life.'}
          </p>

          {assets.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {assets.map((asset) => {
                const storySlug = asset.storySlug ?? STORY_BY_PUBLIC_ID[asset.publicId]
                const story = storySlug ? postsBySlug.get(storySlug) : undefined

                return (
                  <GalleryCard
                    key={asset.assetId}
                    asset={asset}
                    locale={locale}
                    relatedStory={story ? { slug: story.slug, title: story.title } : undefined}
                  />
                )
              })}
            </div>
          ) : (
            <p
              className="py-16 text-center"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
            >
              {locale === 'id'
                ? 'Belum ada foto di galeri.'
                : locale === 'zh'
                  ? '图库中还没有照片。'
                  : 'No gallery photos yet.'}
            </p>
          )}
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
