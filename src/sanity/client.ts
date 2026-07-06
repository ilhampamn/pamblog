import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

/**
 * Read-only Sanity client used by the site at build time (and ISR).
 *
 * `useCdn: true` serves cached, published content from Sanity's CDN — right for
 * a static site. Draft/preview reads (which need a token + useCdn:false) can be
 * added later behind a preview route if you want live editing previews.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})
