/**
 * Embedded Sanity Studio at /studio.
 *
 * This catch-all route hosts the whole Studio inside the Next app, so it
 * deploys with the site (no separate Studio repo/host). The Studio manages its
 * own full-viewport layout; it sits OUTSIDE the [locale] segment so none of the
 * site chrome (nav, paper texture) wraps it.
 */
import { Studio } from './Studio'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <Studio />
}
