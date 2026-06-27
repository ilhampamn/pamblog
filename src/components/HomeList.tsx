import Link from 'next/link'
import { NewsletterWidget } from './NewsletterWidget'
import { TvSticker } from './TvSticker'
import type { Post } from '@/lib/posts'
import type { Locale } from '@/lib/i18n'

interface HomeListProps {
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

const TAG_COLORS: Record<string, string> = {
  essay: 'var(--color-blush)',
  tutorial: 'var(--color-smudge)',
  note: 'var(--color-smudge)',
  catatan: 'var(--color-smudge)',
  review: 'var(--color-smudge)',
}

/**
 * Mobile home view: the same content as the desktop canvas, laid out as a
 * straightforward vertical, scrollable list. Rendered server-side.
 */
export function HomeList({ locale, posts, ui, newsletter }: HomeListProps) {
  return (
    <div
      className="min-h-[100svh] pt-24 pb-20"
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      {/* ── TV — outside the max-w-md container, 8px side padding ── */}
      <div className="px-2 mb-10">
        <TvSticker id="tv-mobile" videoId="wM2G2exs15w" width="100%" standalone />
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-10 px-6">
        {/* ── Header ── */}
        <header>
          <h1
            className="text-4xl font-bold leading-tight mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Ilham Pamungkas
          </h1>
          <p
            className="text-base"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
          >
            {ui.tagline}
          </p>
        </header>

        {/* ── Posts ── */}
        <section className="flex flex-col gap-4">
          {posts.slice(0, 8).map((post) => (
            <Link
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              className="block p-5"
              style={{
                backgroundColor: 'var(--color-ghost)',
                border: '1px solid var(--color-torn)',
                borderRadius: 'var(--radius-card)',
                textDecoration: 'none',
              }}
            >
              <span
                className="label-stamped block mb-2"
                style={{ color: TAG_COLORS[post.tag] ?? 'var(--color-smudge)' }}
              >
                {post.tag}
              </span>
              <h2
                className="text-lg font-bold leading-snug mb-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
              >
                {post.title}
              </h2>
              <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                {post.readingTime} min
              </span>
            </Link>
          ))}
        </section>

        {/* ── Currently ── */}
        <section
          className="p-5"
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
        </section>

        {/* ── About ── */}
        <section
          className="p-5"
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
        </section>

        {/* ── Newsletter ── */}
        <section
          className="p-5"
          style={{
            backgroundColor: 'var(--color-ghost)',
            border: '1px solid var(--color-torn)',
            borderRadius: 'var(--radius-card)',
          }}
        >
          <NewsletterWidget
            cta={newsletter.cta}
            placeholder={newsletter.placeholder}
            button={newsletter.button}
          />
        </section>
      </div>
    </div>
  )
}
