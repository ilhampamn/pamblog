import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { PenLink } from '@/components/proof/Pen'
import { dateline } from '@/components/proof/content'
import { getCloudinaryImagesByTag, type CloudinaryAsset } from '@/lib/cloudinary'
import { getPostsByLocale, type Post } from '@/lib/posts.sanity'
import { LOCALES, isLocale, t } from '@/lib/i18n'

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
  if (!isLocale(params.locale)) return {}
  const ui = t(params.locale)
  return { title: ui.proof.gallery, description: ui.pages.galleryIntro }
}

/** Cloudinary's `taken_at` is free text; only reformat it when it parses as a date. */
function takenOn(value: string, locale: Parameters<typeof dateline>[1]) {
  return Number.isNaN(new Date(value).getTime()) ? value : dateline(value, locale)
}

/**
 * The gallery: photographs shown whole in columns (DESIGN.md → Layers — no
 * crops, tints, gradients or hover overlays), each with its caption typeset
 * underneath like a plate in a proof, and a pen link to its story.
 */
export default async function GalleryPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale)
  const base = `/${locale}`

  const [assets, posts] = await Promise.all([
    getCloudinaryImagesByTag(GALLERY_TAG).catch(() => [] as CloudinaryAsset[]),
    getPostsByLocale(locale).catch(() => [] as Post[]),
  ])
  const postsBySlug = new Map(posts.map((post) => [post.slug, post]))

  return (
    <SiteFrame locale={locale} current="gallery" path="/gallery">
      <div className="tp-wide">
        <header className="tp-pagehead">
          <h1 className="tp-pagetitle">{ui.proof.gallery}</h1>
          <p className="tp-pagedek">{ui.pages.galleryIntro}</p>
        </header>

        {assets.length === 0 ? (
          <p className="tp-meta">{ui.pages.galleryEmpty}</p>
        ) : (
          <div className="tp-plates">
            {assets.map((asset, i) => {
              const storySlug = asset.storySlug ?? STORY_BY_PUBLIC_ID[asset.publicId]
              const story = storySlug ? postsBySlug.get(storySlug) : undefined
              const meta = [asset.location, asset.takenAt && takenOn(asset.takenAt, locale)].filter(Boolean)
              return (
                <figure key={asset.assetId} className="tp-plate">
                  <Image
                    src={asset.url}
                    alt={asset.alt}
                    width={asset.width}
                    height={asset.height}
                    sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1100px) 50vw, 33vw"
                  />
                  <figcaption className="tp-plate__caption">
                    <span className="tp-label">
                      {String(i + 1).padStart(2, '0')}
                      {meta.length > 0 && <> · {meta.join(' · ')}</>}
                    </span>
                    {asset.title && <span className="tp-plate__title">{asset.title}</span>}
                    {asset.caption && asset.caption !== asset.title && (
                      <span className="tp-plate__text">{asset.caption}</span>
                    )}
                    {story && (
                      <PenLink id={`gallery:${asset.publicId}:story`} href={`${base}/blog/${story.slug}`}>
                        {ui.pages.relatedStory}
                      </PenLink>
                    )}
                  </figcaption>
                </figure>
              )
            })}
          </div>
        )}
      </div>
    </SiteFrame>
  )
}
