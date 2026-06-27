'use client'

import Link from 'next/link'
import { useTheme } from '@/components/ThemeToggle'
import type { Locale } from '@/lib/i18n'
import { useTheme as useThemeProvider } from '@/components/ThemeProvider'

interface ComponentShowcaseProps {
  params: { locale: Locale }
}

const componentConfig = {
  en: {
    title: 'Component Gallery',
    description: 'Visual reference for all button & link components',
    sections: {
      links: 'Link Components',
      buttons: 'Button Components',
      states: 'Interactive States',
      cards: 'Card Variants',
    },
  },
  id: {
    title: 'Galeri Komponen',
    description: 'Referensi visual untuk semua komponen tombol & tautan',
    sections: {
      links: 'Komponen Tautan',
      buttons: 'Komponen Tombol',
      states: 'Status Interaktif',
      cards: 'Varian Kartu',
    },
  },
}

export default function ComponentsPage({ params }: ComponentShowcaseProps) {
  const { locale } = params
  const config = componentConfig[locale] || componentConfig.en
  const { resolvedTheme } = useThemeProvider()

  return (
    <main className="min-h-screen pt-24 pb-16 px-6 md:px-8" style={{ backgroundColor: 'var(--color-paper)', color: 'var(--color-ink)' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            {config.title}
          </h1>
          <p className="text-lg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
            {config.description}
          </p>
          <p className="text-sm mt-4" style={{ color: 'var(--color-smudge)' }}>
            Theme: <strong>{resolvedTheme}</strong>
          </p>
        </header>

        {/* Links Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            {config.sections.links}
          </h2>

          <div className="space-y-12">
            {/* Navigation Links */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Navigation Links</h3>
              <div className="flex flex-wrap gap-6 items-center">
                <Link
                  href={`/${locale}`}
                  className="font-bold text-base tracking-tight"
                  style={{ color: 'var(--color-ink)', fontFamily: 'var(--font-display)' }}
                >
                  Logo / Home
                </Link>
                <Link
                  href={`/${locale}/blog`}
                  className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  Blog
                </Link>
                <Link
                  href={`/${locale}/about`}
                  className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  About
                </Link>
                <Link
                  href={`/${locale}/uses`}
                  className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  Uses
                </Link>
              </div>
            </div>

            {/* Breadcrumb Links */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Breadcrumb Trail</h3>
              <nav className="flex items-center gap-2">
                <Link href="/" className="label-stamped hover:text-[var(--color-ink)] transition-colors" style={{ color: 'var(--color-smudge)' }}>
                  Home
                </Link>
                <span style={{ color: 'var(--color-torn)' }}>/</span>
                <Link href="/blog" className="label-stamped hover:text-[var(--color-ink)] transition-colors" style={{ color: 'var(--color-smudge)' }}>
                  Blog
                </Link>
                <span style={{ color: 'var(--color-torn)' }}>/</span>
                <span className="label-stamped" style={{ color: 'var(--color-ink)' }}>
                  Article Title
                </span>
              </nav>
            </div>

            {/* Footer Links */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Footer Links</h3>
              <nav className="flex flex-wrap gap-x-6 gap-y-2">
                {['Blog', 'About', 'Uses', 'Newsletter', 'RSS'].map((label) => (
                  <Link
                    key={label}
                    href="#"
                    className="label-stamped hover:text-[var(--color-ghost)] transition-colors"
                    style={{ color: 'var(--color-smudge)' }}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Locale Switcher */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Locale Switcher</h3>
              <nav className="flex gap-2 items-center">
                <span className="font-ui text-xs tracking-[0.12em] uppercase" style={{ color: 'var(--color-ink)' }}>
                  EN
                </span>
                <span style={{ color: 'var(--color-torn)' }}>/</span>
                <Link
                  href="#"
                  className="font-ui text-xs tracking-[0.12em] uppercase transition-colors hover:text-[var(--color-ink)]"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  ID
                </Link>
              </nav>
            </div>

            {/* Pill Links (Polaroid style) */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Pill Links (Polaroid)</h3>
              <div className="flex flex-wrap gap-2">
                {['Destination', 'Itinerary', 'View Story'].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="label-stamped"
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      backgroundColor: 'var(--color-ghost)',
                      border: '1px solid var(--color-torn)',
                      borderRadius: '12px',
                      color: 'var(--color-ink)',
                      textDecoration: 'none',
                      transition: 'all 200ms ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-blush)'
                      e.currentTarget.style.color = '#fff'
                      e.currentTarget.style.borderColor = 'var(--color-blush)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-ghost)'
                      e.currentTarget.style.color = 'var(--color-ink)'
                      e.currentTarget.style.borderColor = 'var(--color-torn)'
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
              <p className="text-xs mt-4" style={{ color: 'var(--color-smudge)' }}>Hover to see color change</p>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            {config.sections.buttons}
          </h2>

          <div className="space-y-12">
            {/* Newsletter Submit Button */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Newsletter Submit</h3>
              <form className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm bg-transparent border outline-none focus:border-[var(--color-ink)]"
                  style={{
                    borderColor: 'var(--color-torn)',
                    borderRadius: 'var(--radius-input)',
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--color-ink)',
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs tracking-[0.12em] uppercase transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                    fontFamily: 'var(--font-ui)',
                    borderRadius: 0,
                  }}
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>

            {/* Canvas Control Buttons */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Canvas Zoom Controls</h3>
              <div className="flex gap-2">
                <button
                  className="canvas-control"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '1.1rem',
                    lineHeight: 1,
                    color: 'var(--color-ink)',
                    backgroundColor: 'var(--color-paper)',
                    border: '1px solid var(--color-torn)',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: '0 2px 8px rgba(28, 25, 23, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  +
                </button>
                <button
                  className="canvas-control"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '1.1rem',
                    lineHeight: 1,
                    color: 'var(--color-ink)',
                    backgroundColor: 'var(--color-paper)',
                    border: '1px solid var(--color-torn)',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: '0 2px 8px rgba(28, 25, 23, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  −
                </button>
                <button
                  className="canvas-control"
                  style={{
                    width: '2.25rem',
                    height: '2.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.75rem',
                    lineHeight: 1,
                    color: 'var(--color-ink)',
                    backgroundColor: 'var(--color-paper)',
                    border: '1px solid var(--color-torn)',
                    borderRadius: 'var(--radius-card)',
                    boxShadow: '0 2px 8px rgba(28, 25, 23, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  ⤢
                </button>
              </div>
              <p className="text-xs mt-4" style={{ color: 'var(--color-smudge)' }}>Hover to see shadow change</p>
            </div>

            {/* Theme Toggle */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Theme Toggle</h3>
              <button
                className="label-stamped transition-colors hover:text-[var(--color-ink)]"
                style={{
                  color: 'var(--color-smudge)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '1.5rem',
                }}
              >
                {resolvedTheme === 'dark' ? '○' : '●'}
              </button>
            </div>

            {/* Hamburger Menu */}
            <div className="border p-8" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Hamburger Menu Toggle</h3>
              <button
                className="flex flex-col justify-center items-center gap-[5px] w-8 h-8"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <span
                  className="block h-[1.5px] w-6"
                  style={{ backgroundColor: 'var(--color-ink)' }}
                />
                <span
                  className="block h-[1.5px] w-6"
                  style={{ backgroundColor: 'var(--color-ink)' }}
                />
                <span
                  className="block h-[1.5px] w-6"
                  style={{ backgroundColor: 'var(--color-ink)' }}
                />
              </button>
              <p className="text-xs mt-4" style={{ color: 'var(--color-smudge)' }}>Transforms to X on mobile menu open</p>
            </div>
          </div>
        </section>

        {/* Card Variants */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            {config.sections.cards}
          </h2>

          <div className="space-y-8">
            {/* Ghost Card */}
            <div
              className="p-5 block group cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: 'var(--color-ghost)',
                border: '1px solid var(--color-torn)',
                borderRadius: 'var(--radius-card)',
                textDecoration: 'none',
              }}
            >
              <span className="label-stamped block mb-2" style={{ color: 'var(--color-blush)' }}>
                essay
              </span>
              <h3 className="text-lg font-bold leading-snug mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
                Example Blog Post Title
              </h3>
              <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                5 min read
              </span>
            </div>

            {/* Paper Card */}
            <div
              className="p-5"
              style={{
                backgroundColor: 'var(--color-paper)',
                border: '1px solid var(--color-torn)',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <span className="label-stamped block mb-3" style={{ color: 'var(--color-ink)' }}>
                Currently
              </span>
              <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
                📖 Reading: The Design of Everyday Things
              </p>
              <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
                🛠 Working on: Component Gallery
              </p>
            </div>

            {/* Newsletter Card */}
            <div
              className="p-6"
              style={{
                backgroundColor: 'var(--color-ghost)',
                border: '1px solid var(--color-torn)',
                borderRadius: 'var(--radius-card)',
                transform: 'rotate(-0.5deg)',
              }}
            >
              <p className="mb-3 text-sm" style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-ink)' }}>
                Get new posts in your inbox
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm bg-transparent border outline-none focus:border-[var(--color-ink)]"
                  style={{
                    borderColor: 'var(--color-torn)',
                    borderRadius: 'var(--radius-input)',
                    fontFamily: 'var(--font-ui)',
                    color: 'var(--color-ink)',
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs tracking-[0.12em] uppercase transition-opacity hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--color-ink)',
                    color: 'var(--color-paper)',
                    fontFamily: 'var(--font-ui)',
                    borderRadius: 0,
                  }}
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* States */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}>
            {config.sections.states}
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="border p-6" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Default</h4>
              <p className="text-sm mb-3" style={{ color: 'var(--color-smudge)' }}>Slight shadow, element pinned to surface</p>
              <Link
                href="#"
                className="label-stamped"
                style={{ color: 'var(--color-smudge)' }}
              >
                Link Example
              </Link>
            </div>

            <div className="border p-6" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Hover</h4>
              <p className="text-sm mb-3" style={{ color: 'var(--color-smudge)' }}>Shadow deepens, element lifts slightly</p>
              <Link
                href="#"
                className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                style={{ color: 'var(--color-smudge)' }}
              >
                Hover me →
              </Link>
            </div>

            <div className="border p-6" style={{ borderColor: 'var(--color-torn)', borderRadius: 'var(--radius-card)' }}>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Drag/Active</h4>
              <p className="text-sm mb-3" style={{ color: 'var(--color-smudge)' }}>Large shadow + scale 1.03–1.04</p>
              <Link
                href="#"
                className="label-stamped"
                style={{
                  color: 'var(--color-ink)',
                  transform: 'scale(1.03)',
                  display: 'inline-block',
                }}
              >
                Floating ↑
              </Link>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="mt-16 pt-8 border-t" style={{ borderColor: 'var(--color-torn)' }}>
          <Link
            href={`/${locale}`}
            className="label-stamped hover:text-[var(--color-ink)] transition-colors"
            style={{ color: 'var(--color-smudge)' }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  )
}
