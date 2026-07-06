'use client'

/**
 * Client-only wrapper for the embedded Sanity Studio.
 *
 * `NextStudio` (and the Studio `config`) rely on client-only APIs such as
 * `React.createContext`. Isolating them behind a `'use client'` boundary keeps
 * them out of the server-side page-data collection pass at build time (which
 * would otherwise throw `createContext is not a function`), while the route's
 * page.tsx stays a Server Component that can export `metadata`/`viewport`.
 */
import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

/**
 * The site's globals.css (imported in the root layout) puts a fixed paper-texture
 * background on <html> and makes <body> a flex sticky-footer column. The Studio
 * isn't part of that flex chain, so without help it only takes its content height
 * and the paper texture shows through below it.
 *
 * A `position: fixed; inset: 0` wrapper detaches the Studio from that flex layout
 * and gives NextStudio (which sizes to `height: 100%`) a full-viewport parent with
 * its own opaque background.
 */
export function Studio() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 1000 }}>
      <NextStudio config={config} />
    </div>
  )
}
