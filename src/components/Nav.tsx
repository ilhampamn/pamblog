'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { LocaleSwitcher } from './LocaleSwitcher'
import type { Locale } from '@/lib/i18n'

// Hidden until further notice — flip back to true to restore the EN/ID switcher.
const SHOW_LOCALE_SWITCHER = false

interface NavProps {
  locale: Locale
  ui: {
    blog: string
    explore: string
    gallery: string
    about: string
    uses: string
  }
}

export function Nav({ locale, ui }: NavProps) {
  const navRef = useRef<HTMLElement>(null)

  // Hide/show nav on scroll (desktop)
  useGSAP(() => {
    ScrollTrigger.create({
      onUpdate: (self) => {
        const y = window.scrollY
        if (self.direction === 1 && y > 80) {
          gsap.to(navRef.current, { yPercent: -100, duration: 0.3, ease: 'power2.in' })
        } else if (self.direction === -1) {
          gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' })
        }
      },
    })
  }, [])

  const links = [
    { href: `/${locale}/blog`, label: ui.blog },
    { href: `/${locale}/gallery`, label: ui.gallery },
    { href: `/${locale}/about`, label: ui.about },
  ]

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        ref={navRef}
        className="relative flex items-center justify-between gap-6 px-4 py-2.5 pointer-events-auto overflow-hidden w-[92%] md:w-auto md:min-w-[420px]"
        style={{
          backgroundColor: 'var(--color-paper)',
          border: '1px solid var(--color-torn)',
          borderRadius: '999px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Noise texture overlay */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ opacity: 0.035 }}
        >
          <filter id="nav-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#nav-noise)" />
        </svg>
        <Link href={`/${locale}`} className="relative z-50 flex items-center">
          <img
            src="/P%20Logo.png"
            alt="Pam Travels"
            className="brand-logo"
            style={{
              height: 26,
              width: 'auto',
              display: 'block',
              transform: 'rotate(-4deg)',
            }}
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-5">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="label-stamped hover:text-[var(--color-ink)] transition-colors">
              {l.label}
            </Link>
          ))}
          {SHOW_LOCALE_SWITCHER && <LocaleSwitcher locale={locale} />}
        </div>
      </nav>
    </div>
  )
}
