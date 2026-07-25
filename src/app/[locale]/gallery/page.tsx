import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { t, type Locale } from '@/lib/i18n'
import { getCloudinaryImagesByTag } from '@/lib/cloudinary'

const LOCALES = ['en', 'id', 'zh'] as const
const GALLERY_TAG = 'blog-gallery'

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
  const assets = await getCloudinaryImagesByTag(GALLERY_TAG)

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
              {assets.map((asset) => (
                <figure
                  key={asset.assetId}
                  className="mb-4 break-inside-avoid overflow-hidden"
                  style={{
                    backgroundColor: 'var(--color-ghost)',
                    border: '1px solid var(--color-torn)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  {/* Dimensions preserve the asset's natural ratio in the masonry layout. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.alt}
                    width={asset.width}
                    height={asset.height}
                    loading="lazy"
                    className="block w-full h-auto"
                  />
                  {asset.caption && (
                    <figcaption
                      className="px-4 py-3 text-sm"
                      style={{
                        fontFamily: 'var(--font-typewriter)',
                        color: 'var(--color-smudge)',
                      }}
                    >
                      {asset.caption}
                    </figcaption>
                  )}
                </figure>
              ))}
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
