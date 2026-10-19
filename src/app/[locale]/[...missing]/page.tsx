import { notFound } from 'next/navigation'

/**
 * Any path under a locale that matches no page lands here and 404s, so it
 * gets the locale's styled not-found page (with the fonts and paper from the
 * locale layout) instead of Next's unstyled default.
 */
export default function Missing() {
  notFound()
}
