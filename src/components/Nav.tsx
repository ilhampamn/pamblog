'use client'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { LocaleSwitcher } from './LocaleSwitcher'
import { ThemeToggle } from './ThemeToggle'
import type { Locale } from '@/lib/i18n'

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
  const overlayRef = useRef<HTMLDivElement>(null)
  const line1Ref = useRef<HTMLSpanElement>(null)
  const line2Ref = useRef<HTMLSpanElement>(null)
  const line3Ref = useRef<HTMLSpanElement>(null)
  const menuItemsRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  // Hide/show nav on scroll (desktop)
  useGSAP(() => {
    ScrollTrigger.create({
      onUpdate: (self) => {
        if (open) return
        const y = window.scrollY
        if (self.direction === 1 && y > 80) {
          gsap.to(navRef.current, { yPercent: -100, duration: 0.3, ease: 'power2.in' })
        } else if (self.direction === -1) {
          gsap.to(navRef.current, { yPercent: 0, duration: 0.4, ease: 'power2.out' })
        }
      },
    })
  }, [open])

  const openMenu = () => {
    setOpen(true)
    document.body.style.overflow = 'hidden'

    // Slide overlay in
    gsap.set(overlayRef.current, { display: 'flex' })
    gsap.fromTo(overlayRef.current,
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 0.6, ease: 'power4.inOut' }
    )

    // Hamburger → X morph
    gsap.to(line1Ref.current, { rotate: 45, y: 7, duration: 0.3, ease: 'power2.inOut' })
    gsap.to(line2Ref.current, { scaleX: 0, opacity: 0, duration: 0.2 })
    gsap.to(line3Ref.current, { rotate: -45, y: -7, duration: 0.3, ease: 'power2.inOut' })

    // Stagger menu items up
    const items = menuItemsRef.current?.querySelectorAll('[data-menu-item]')
    if (items) {
      gsap.fromTo(items,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.3 }
      )
    }
  }

  const closeMenu = () => {
    setOpen(false)
    document.body.style.overflow = ''

    // X → hamburger morph
    gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
    gsap.to(line2Ref.current, { scaleX: 1, opacity: 1, duration: 0.3 })
    gsap.to(line3Ref.current, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })

    // Slide overlay out
    gsap.to(overlayRef.current, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.5,
      ease: 'power4.inOut',
      onComplete: () => gsap.set(overlayRef.current, { display: 'none' }),
    })
  }

  const handleLinkClick = () => {
    if (open) closeMenu()
  }

  const links = [
    { href: `/${locale}/blog`, label: ui.blog },
    { href: `/${locale}/explore`, label: ui.explore },
    { href: `/${locale}/gallery`, label: ui.gallery },
    { href: `/${locale}/about`, label: ui.about },
    { href: `/${locale}/uses`, label: ui.uses },
  ]

  return (
    <>
      {/* Floating nav wrapper — centres the pill at 90% / 80% width */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav
        ref={navRef}
        className="relative flex items-center justify-between px-6 md:px-8 py-4 pointer-events-auto w-[90%] md:w-[80%] overflow-hidden"
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
        <Link
          href={`/${locale}`}
          onClick={handleLinkClick}
          className="relative z-50"
          style={{
            color: 'var(--color-ink)',
            fontFamily: 'var(--font-playfair)',
            fontSize: '1.25rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          PAMN
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="label-stamped hover:text-[var(--color-ink)] transition-colors">
              {l.label}
            </Link>
          ))}
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-4 relative z-50">
          <ThemeToggle />
          <button
            type="button"
            onClick={open ? closeMenu : openMenu}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex flex-col justify-center items-center gap-[5px] w-8 h-8"
          >
            <span
              ref={line1Ref}
              className="block h-[1.5px] w-6 origin-center"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
            <span
              ref={line2Ref}
              className="block h-[1.5px] w-6 origin-center"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
            <span
              ref={line3Ref}
              className="block h-[1.5px] w-6 origin-center"
              style={{ backgroundColor: 'var(--color-ink)' }}
            />
          </button>
        </div>
      </nav>
      </div>

      {/* Full-screen overlay menu */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 flex-col justify-between px-8 pt-28 pb-12"
        style={{ display: 'none', backgroundColor: 'var(--color-paper)' }}
      >
        {/* Big typographic links */}
        <div ref={menuItemsRef} className="flex flex-col gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-menu-item
              onClick={handleLinkClick}
              className="block text-5xl font-bold leading-tight tracking-tight border-b py-5 group"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-ink)',
                borderColor: 'var(--color-torn)',
                textDecoration: 'none',
              }}
            >
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-3"
                style={{ color: 'var(--color-ink)' }}
              >
                {l.label}
              </span>
              <span
                className="opacity-0 group-hover:opacity-100 ml-3 transition-opacity duration-300"
                style={{ color: 'var(--color-blush)' }}
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Bottom: locale + subtle label */}
        <div data-menu-item className="flex items-center justify-between">
          <LocaleSwitcher locale={locale} />
          <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
            ilhampamungkas.com
          </span>
        </div>
      </div>
    </>
  )
}
