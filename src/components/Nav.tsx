'use client'
import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { LocaleSwitcher } from './LocaleSwitcher'
import type { Locale } from '@/lib/i18n'

interface NavProps {
  locale: Locale
  ui: {
    blog: string
    about: string
    uses: string
  }
}

export function Nav({ locale, ui }: NavProps) {
  const navRef = useRef<HTMLElement>(null)

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
  })

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        borderBottom: '1px solid var(--color-torn)',
        backgroundColor: 'var(--color-paper)',
      }}
    >
      <Link
        href={`/${locale}`}
        className="font-display font-bold text-base tracking-tight"
        style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}
      >
        Ilham Pamungkas
      </Link>

      <div className="flex items-center gap-8">
        <Link href={`/${locale}/blog`} className="label-stamped hover:text-[var(--color-ink)] transition-colors">
          {ui.blog}
        </Link>
        <Link href={`/${locale}/about`} className="label-stamped hover:text-[var(--color-ink)] transition-colors">
          {ui.about}
        </Link>
        <Link href={`/${locale}/uses`} className="label-stamped hover:text-[var(--color-ink)] transition-colors">
          {ui.uses}
        </Link>
        <LocaleSwitcher locale={locale} />
      </div>
    </nav>
  )
}
