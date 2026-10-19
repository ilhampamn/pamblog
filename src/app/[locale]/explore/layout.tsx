import { notFound } from 'next/navigation'

/**
 * Explore is hidden (Ilham, 2026-10-18): every /explore route answers 404 and
 * the menu no longer lists it. The pages below are kept, still in the old
 * design, for when destinations and itineraries come back. To bring Explore
 * back, delete this file, restyle the pages and re-add the menu item in
 * `src/components/proof/SiteShell.tsx`.
 */
export const metadata = { robots: { index: false, follow: false } }

export default function ExploreLayout() {
  notFound()
}
