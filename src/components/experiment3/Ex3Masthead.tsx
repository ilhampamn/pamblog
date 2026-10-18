'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Locale } from '@/lib/i18n'

export interface Ex3NavItem {
  href: string
  label: string
}

/**
 * Transparent, borderless, non-sticky masthead.
 *
 * Non-sticky on purpose: the brief asks for no background and no border, and a
 * bar with neither cannot stay over scrolling content without the links
 * colliding with whatever passes underneath. So it behaves like the reference —
 * it belongs to the top of the sheet and scrolls away with it.
 */
export function Ex3Masthead({
  locale,
  items,
  tagline,
  cta,
}: {
  locale: Locale
  items: Ex3NavItem[]
  tagline: string
  cta: string
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="ex3-masthead-wrap">
      <header className="ex3-masthead">
        <Link href={`/${locale}/experiment-3`} className="ex3-brand">
          <span className="ex3-wordmark">TRAVEL PAM</span>
          <span className="ex3-tagline">({tagline})</span>
        </Link>

        <nav className={open ? 'ex3-nav ex3-nav--open' : 'ex3-nav'}>
          {items.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="ex3-nav__link"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/newsletter`}
            className="ex3-nav__link ex3-nav__cta"
            onClick={() => setOpen(false)}
          >
            {cta}
          </Link>
        </nav>

        <button
          type="button"
          className="ex3-nav__toggle"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>
    </div>
  )
}
