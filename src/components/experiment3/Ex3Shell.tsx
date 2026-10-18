'use client'

import { useEffect, useState } from 'react'
import {
  DEFAULT_LOGO_FACE,
  LOGO_FACES,
  ex3FontVars,
  type LogoFaceId,
} from '@/app/[locale]/experiment-3/fonts'
import type { Locale } from '@/lib/i18n'
import { Ex3Masthead, type Ex3NavItem } from './Ex3Masthead'
import { Ex3LogoLab } from './Ex3LogoLab'

const STORAGE_KEY = 'ex3-logo-face'

function isFace(value: string | null): value is LogoFaceId {
  return LOGO_FACES.some((f) => f.id === value)
}

/**
 * Owns the one piece of client state on the page — which display face the
 * identity is currently wearing — and publishes it as `data-logo` on the root.
 * Everything that uses the face (masthead, section numerals, drop cap, footer
 * sign-off) reads it through the `--ex3-logo` variable, so the whole page
 * retypes from that single attribute.
 *
 * The page body stays a server component and arrives as `children`.
 */
export function Ex3Shell({
  locale,
  nav,
  tagline,
  cta,
  children,
}: {
  locale: Locale
  nav: Ex3NavItem[]
  tagline: string
  cta: string
  children: React.ReactNode
}) {
  const [face, setFace] = useState<LogoFaceId>(DEFAULT_LOGO_FACE)
  const [labOpen, setLabOpen] = useState(false)

  // Read after mount rather than during render: the server has no idea what is
  // in localStorage, and guessing would mean a hydration mismatch on the
  // wordmark — the one element on the page you would most notice flickering.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isFace(stored)) setFace(stored)
  }, [])

  const choose = (next: LogoFaceId) => {
    setFace(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Private browsing / storage disabled — the choice just won't persist.
    }
  }

  return (
    <div className={`ex3 ${ex3FontVars}`} data-logo={face}>
      <Ex3Masthead locale={locale} items={nav} tagline={tagline} cta={cta} />
      {children}
      <Ex3LogoLab
        face={face}
        onChange={choose}
        open={labOpen}
        onToggle={() => setLabOpen((v) => !v)}
      />
    </div>
  )
}
