import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../../sanity/env'

/**
 * Read-only Sanity client used by the site at build time (and ISR).
 *
 * `useCdn: false` reads directly from Sanity's live API rather than its CDN
 * cache. The CDN cache was observed serving stale/deleted documents (a
 * removed article kept appearing, another's just-added cover image didn't) —
 * for this site's traffic level, live reads are worth the small latency cost.
 * Page-level caching is still handled by Next.js + the Sanity webhook.
 */
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
})
