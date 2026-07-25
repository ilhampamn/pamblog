import Link from 'next/link'
import { NewsletterWidget } from './NewsletterWidget'
import { VideoPolaroid } from './VideoPolaroid'
import { StickyNote } from './StickyNote'
import { Polaroid } from './Polaroid'
import { RoughHeart } from './RoughHeart'
import { RoughBackpack, RoughGlobe } from './RoughDoodles'
import type { Post } from '@/lib/posts.sanity'
import type { Locale } from '@/lib/i18n'

// Casebook uses restrained placement; tiny differences feel more physical than
// large alternating rotations.
const POST_TILTS = [-2.2, 1.6, -1.4, 2, -1.8, 1.2, -2, 1.5]
const LABUAN_BAJO_IMAGE =
  'https://res.cloudinary.com/bub4hnum/image/upload/f_auto,q_auto/v1784942935/402F38BD-7487-4EEC-B6C6-21E5D0BF8C66_ixzzxo.jpg'

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
      className="home-grid min-h-[100svh] pt-28 pb-10 overflow-x-hidden"
    >
      {/* ── Featured video in an instant-film frame ── */}
      <div className="px-4 mb-8">
        <VideoPolaroid
          id="video-mobile"
          videoId="wM2G2exs15w"
          caption="the memories."
          postedAt="27 June 2026"
          rotation={-1.5}
          width="100%"
          standalone
        />
      </div>

      <div className="mx-auto flex max-w-md flex-col px-6">
        {/* ── Posts (sticky notes — stacked, overlapping) ── */}
        <section className="mx-auto flex w-[92%] flex-col">
          {posts.slice(0, 8).map((post, i) => (
            <StickyNote
              key={post.slug}
              href={`/${locale}/blog/${post.slug}`}
              rotation={0.45}
              style={{
                width: '100%',
                marginTop: i === 0 ? 0 : -28,
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

        {/* ── Rainbow sticker — tucked into the gap on the right ── */}
        <img
          src="/stickers/rainbow.webp"
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none select-none"
          style={{
            width: 208,
            height: 'auto',
            alignSelf: 'flex-end',
            marginRight: 4,
            marginTop: -70,
            marginBottom: -70,
            transform: 'rotate(9deg)',
            position: 'relative',
            zIndex: 30,
            filter: 'drop-shadow(0 3px 6px rgba(28,25,23,0.18))',
          }}
        />

        <RoughGlobe
          className="pointer-events-none select-none"
          style={{
            width: 172,
            alignSelf: 'flex-end',
            marginTop: -36,
            marginRight: 8,
            marginBottom: -34,
            position: 'relative',
            zIndex: 30,
            transform: 'rotate(7deg)',
          }}
        />

        {/* ── Currently (sticky note — pink: base hue shifted to 330°) ── */}
        <StickyNote
          rotation={0.45}
          noteColor="hsl(330, 83%, 63%)"
          style={{ width: '100%', transform: 'rotate(1.8deg)' }}
        >
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

        {/* ── Paper-crane sticker — tucked into the gap on the left ── */}
        <img
          src="/stickers/paperplane.png"
          alt=""
          aria-hidden
          draggable={false}
          className="pointer-events-none select-none"
          style={{
            width: 192,
            height: 'auto',
            alignSelf: 'flex-start',
            marginLeft: 6,
            marginTop: -64,
            marginBottom: -64,
            transform: 'rotate(-11deg)',
            position: 'relative',
            zIndex: 30,
            filter: 'drop-shadow(0 3px 6px rgba(28,25,23,0.18))',
          }}
        />

        {/* ── About (sticky note — white) ── */}
        <StickyNote
          rotation={0.45}
          noteColor="hsl(0, 0%, 100%)"
          style={{ width: '100%', transform: 'rotate(-1.6deg)' }}
        >
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

        <RoughHeart
          className="pointer-events-none select-none"
          style={{
            width: 190,
            alignSelf: 'center',
            marginTop: -18,
            marginBottom: -22,
            position: 'relative',
            zIndex: 30,
            transform: 'rotate(-5deg)',
          }}
        />

        <RoughBackpack
          className="pointer-events-none select-none"
          style={{
            width: 166,
            alignSelf: 'flex-start',
            marginTop: -34,
            marginLeft: 14,
            marginBottom: -28,
            position: 'relative',
            zIndex: 30,
            transform: 'rotate(-6deg)',
          }}
        />

        {/* ── Newsletter ── */}
        <section
          className="p-5 mt-10"
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

        {/* ── Polaroid — tap to reveal links, sits at the very bottom of the page.
            Width matches the sticky notes above (100% of the shared container). ── */}
        <div className="mt-10">
          <Polaroid
            id="polaroid-alaarcha-mobile"
            src="/stickers/alaarcha.webp"
            alt="Ala-Archa"
            caption={'Ala Archa\n2024'}
            width="100%"
            rotation={-6}
            standalone
            links={[
              { label: 'Destination', href: `/${locale}/explore/destinations/kyrgyzstan/bishkek/ala-archa-national-park` },
              { label: 'Itinerary', href: `/${locale}/explore/itineraries/3-days-in-hanoi` },
            ]}
          />
        </div>

        <div className="mt-14 mb-6">
          <Polaroid
            id="polaroid-labuan-bajo-mobile"
            src={LABUAN_BAJO_IMAGE}
            alt="Labuan Bajo"
            caption="Labuan Bajo"
            width="100%"
            rotation={5}
            standalone
          />
        </div>
      </div>
    </div>
  )
}
