'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, Draggable } from '@/lib/gsap'
import { NewsletterWidget } from './NewsletterWidget'
import type { Post } from '@/lib/posts'
import type { Locale } from '@/lib/i18n'

interface CanvasProps {
  locale: Locale
  posts: Post[]
  ui: {
    tagline: string
    currently: string
    currentlyReading: string
    currentlyWorking: string
    aboutSnippet: string
    aboutLink: string
  }
  newsletter: {
    cta: string
    placeholder: string
    button: string
  }
}

// Deterministic seeded random — same output on every render
function seedRandom(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  return () => {
    h ^= h << 13
    h ^= h >> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
}

const TAG_COLORS: Record<string, string> = {
  essay: 'var(--color-blush)',
  tutorial: 'var(--color-smudge)',
  note: 'var(--color-smudge)',
  catatan: 'var(--color-smudge)',
  review: 'var(--color-smudge)',
}

export function Canvas({ locale, posts, ui, newsletter }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const items = gsap.utils.toArray<HTMLElement>('.canvas-card')

    // Set positions deterministically per card
    items.forEach((el) => {
      const rng = seedRandom(el.dataset.slug ?? el.id ?? Math.random().toString())
      gsap.set(el, {
        x: (rng() - 0.5) * 560,
        y: (rng() - 0.5) * 340,
        rotation: (rng() - 0.5) * 6,
        opacity: 0,
      })
    })

    // Staggered entrance — cards settle like papers on a desk
    gsap.to(items, {
      opacity: 1,
      y: '+=10',
      duration: 0.6,
      ease: 'power2.out',
      stagger: { amount: 0.8, from: 'center' },
    })

    // Make canvas draggable on desktop
    if (window.innerWidth >= 768 && wrapRef.current) {
      Draggable.create(wrapRef.current, {
        type: 'x,y',
        edgeResistance: 0.65,
        inertia: true,
        allowEventDefault: true,
        cursor: 'grab',
        activeCursor: 'grabbing',
      })
    }
  }, { scope: canvasRef })

  return (
    <div
      ref={canvasRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100svh',
        backgroundColor: 'var(--color-paper)',
      }}
    >
      {/* Noise texture overlay */}
      <svg className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.04] z-10" aria-hidden="true">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Draggable canvas wrap */}
      <div
        ref={wrapRef}
        className="absolute inset-0 flex items-center justify-center md:cursor-grab active:cursor-grabbing"
      >
        {/* ── Intro card ── */}
        <div
          className="canvas-card absolute w-72 p-6"
          id="intro"
          style={{
            backgroundColor: 'var(--color-paper)',
            border: '1px solid var(--color-torn)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <h1
            className="text-3xl font-bold mb-2 leading-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Ilham Pamungkas
          </h1>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
            {ui.tagline}
          </p>
        </div>

        {/* ── Post cards ── */}
        {posts.slice(0, 5).map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="canvas-card absolute w-56 p-5 block group"
            data-slug={post.slug}
            style={{
              backgroundColor: 'var(--color-ghost)',
              border: '1px solid var(--color-torn)',
              borderRadius: 'var(--radius-card)',
              textDecoration: 'none',
            }}
          >
            <span
              className="label-stamped block mb-3"
              style={{ color: TAG_COLORS[post.tag] ?? 'var(--color-smudge)' }}
            >
              {post.tag}
            </span>
            <h2
              className="text-base font-bold leading-snug mb-2"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {post.title}
            </h2>
            <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
              {post.readingTime} min
            </span>
          </Link>
        ))}

        {/* ── Newsletter card ── */}
        <div
          className="canvas-card absolute w-64 p-5"
          id="newsletter"
          style={{
            backgroundColor: 'var(--color-ghost)',
            border: '1px solid var(--color-torn)',
            borderRadius: 'var(--radius-card)',
            transform: 'rotate(-1deg)',
          }}
        >
          <NewsletterWidget
            cta={newsletter.cta}
            placeholder={newsletter.placeholder}
            button={newsletter.button}
          />
        </div>

        {/* ── Currently card ── */}
        <div
          className="canvas-card absolute w-52 p-5"
          id="currently"
          style={{
            backgroundColor: 'var(--color-paper)',
            border: '1px solid var(--color-torn)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <span className="label-stamped block mb-3">{ui.currently}</span>
          <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
            📖 {ui.currentlyReading}
          </p>
          <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
            🛠 {ui.currentlyWorking}
          </p>
        </div>

        {/* ── About snippet card ── */}
        <div
          className="canvas-card absolute w-56 p-5"
          id="about"
          style={{
            backgroundColor: 'var(--color-ghost)',
            border: '1px solid var(--color-torn)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <p className="text-sm mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
            {ui.aboutSnippet}
          </p>
          <Link
            href={`/${locale}/about`}
            className="label-stamped hover:text-[var(--color-ink)] transition-colors"
          >
            {ui.aboutLink}
          </Link>
        </div>
      </div>

      {/* ASCII art plant — bottom-right corner */}
      <pre
        className="fixed bottom-6 right-8 text-xs leading-tight pointer-events-none select-none z-20"
        aria-hidden="true"
        style={{ color: 'var(--color-torn)', fontFamily: 'var(--font-mono)' }}
      >
{`    |
   /|\\
  / | \\
 /  |  \\
    |
   /|\\
  / | \\
~~~|~~~`}
      </pre>
    </div>
  )
}
