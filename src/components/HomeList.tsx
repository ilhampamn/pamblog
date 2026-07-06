import Link from 'next/link'
import { NewsletterWidget } from './NewsletterWidget'
import { TvSticker } from './TvSticker'
import { StickyNote } from './StickyNote'
import type { Post } from '@/lib/posts'
import type { Locale } from '@/lib/i18n'

// Gentle, alternating tilts (10–15°) so the stacked notes feel hand-placed.
const POST_TILTS = [-11, 10, -13, 12, -10, 13, -12, 11]

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

/**
 * Mobile home view: the same content as the desktop canvas, laid out as a
 * straightforward vertical, scrollable list. Rendered server-side.
 */
export function HomeList({ locale, posts, ui, newsletter }: HomeListProps) {
  return (
    <div
      className="min-h-[100svh] pt-4 pb-10 overflow-x-hidden"
    >
      {/* ── TV — outside the max-w-md container, 8px side padding ── */}
      <div className="px-2 mb-0">
        <TvSticker id="tv-mobile" videoId="wM2G2exs15w" width="100%" standalone />
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-5 px-6">
        {/* ── Header ── */}
        <header>
          <h1
            className="text-4xl font-bold leading-tight mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            Pam Travels
          </h1>
          <p
            className="text-base"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
          >
            Living to the fullest as part-time digital nomad
          </p>
        </header>

        {/* ── Posts (sticky notes) ── */}
        <section className="flex flex-col gap-5">
          {posts.slice(0, 8).map((post, i) => (
            <StickyNote
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              rotation={3}
              style={{
                width: '100%',
                transform: `rotate(${POST_TILTS[i % POST_TILTS.length]}deg)`,
              }}
            >
              <p style={{ fontSize: 16, opacity: 0.55, marginBottom: 4, letterSpacing: '0.04em' }}>
                {post.tag}
              </p>
              <p style={{ fontSize: 24, lineHeight: 1.2, marginBottom: 18 }}>
                {post.title}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16, opacity: 0.6 }}>
                <span>{post.readingTime} min read</span>
                <span>→</span>
              </div>
            </StickyNote>
          ))}
        </section>

        {/* ── Currently (sticky note) ── */}
        <StickyNote rotation={3} style={{ width: '100%', transform: 'rotate(11deg)' }}>
          <p style={{ fontSize: 16, opacity: 0.55, marginBottom: 10, letterSpacing: '0.04em' }}>
            {ui.currently}
          </p>
          <p style={{ fontSize: 20, lineHeight: 1.3, marginBottom: 6 }}>
            📖 {ui.currentlyReading}
          </p>
          <p style={{ fontSize: 20, lineHeight: 1.3 }}>
            🛠 {ui.currentlyWorking}
          </p>
        </StickyNote>

        {/* ── About (sticky note) ── */}
        <StickyNote rotation={3} style={{ width: '100%', transform: 'rotate(-12deg)' }}>
          <p style={{ fontSize: 20, lineHeight: 1.35, marginBottom: 12 }}>
            {ui.aboutSnippet}
          </p>
          <Link
            href={`/${locale}/about`}
            style={{ fontSize: 16, opacity: 0.65, color: 'inherit', textDecoration: 'underline' }}
          >
            {ui.aboutLink} →
          </Link>
        </StickyNote>

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
