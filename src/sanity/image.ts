import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { dataset, projectId } from '../../sanity/env'

const builder = imageUrlBuilder({ projectId, dataset })

/**
 * Build a URL for a Sanity image asset with on-the-fly transforms.
 *
 *   urlForImage(coverImage).width(1200).height(630).fit('crop').url()
 *
 * Replaces the old `/public/images/*` paths — images now live in Sanity's CDN.
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}
