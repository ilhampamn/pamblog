import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { CSSProperties, ReactNode } from 'react'
import { Ex3Shell } from '@/components/experiment3/Ex3Shell'
import type { Ex3NavItem } from '@/components/experiment3/Ex3Masthead'
import { getPostsByLocale, type Post } from '@/lib/posts.sanity'
import { getCloudinaryImagesByTag } from '@/lib/cloudinary'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import './experiment-3.css'

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Travel Pam — Edition',
  description:
    'A newspaper-grid visual experiment: hairline 12-column layout, warm paper ground, and a Javanese-script wordmark.',
  robots: { index: false, follow: false },
}

const NAV: Ex3NavItem[] = [
  { href: '/blog', label: 'Stories' },
  { href: '/explore', label: 'Explore' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
]

/* The masthead descriptor, per locale — the identity should not be an English
   object that the other two languages merely link to. */
const TAGLINE: Record<Locale, string> = {
  en: 'an Indonesian, abroad',
  id: 'catatan perjalanan',
  zh: '印尼人的旅行手记',
}

const CTA: Record<Locale, string> = {
  en: 'Subscribe',
  id: 'Berlangganan',
  zh: '订阅',
}

/* ─── Grid primitives ──────────────────────────────────────────────────────
   `sp` is the span on the 12-column desktop sheet, `md` on the 6-column tablet
   sheet, `sm` on the 2-column phone sheet. Only `sp` is required; the other two
   default to full width, because on a narrow sheet full width is almost always
   the right answer and the exceptions should have to say so. */

type CellVars = CSSProperties & {
  '--sp'?: number
  '--sp-md'?: number
  '--sp-sm'?: number
}

function Cell({
  sp,
  md = 6,
  sm = 2,
  className = '',
  children,
}: {
  sp: number
  md?: number
  sm?: number
  className?: string
  children: ReactNode
}) {
  const style: CellVars = { '--sp': sp, '--sp-md': md, '--sp-sm': sm }
  return (
    <div className={`ex3-cell ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div className="ex3-section-head">
      <span className="ex3-section-head__num">{num}</span>
      <h2 className="ex3-section-head__title">{title}</h2>
    </div>
  )
}

/**
 * The divider between major bands (Dispatches, The long read, Contact sheet).
 * Rendered outside `.ex3-grid` rather than as a spanning cell inside it: a cell
 * puts the heading on its own grid row, and the engine's 1px row-gap then draws
 * a second rule directly under it — on top of this band's own top rule and the
 * heading's rule, three lines within a few pixels of each other. One border,
 * on one element, is the whole divider.
 */
function SectionBand({ num, title }: { num: string; title: string }) {
  return (
    <div className="ex3-band">
      <SectionHead num={num} title={title} />
    </div>
  )
}

/* ─── Content ──────────────────────────────────────────────────────────────
   The grid has to be judged against real headlines and real photographs, so
   the page reads Sanity and Cloudinary. When neither is reachable — a fresh
   clone, a missing key — it falls back to this edition, which is sized to the
   lengths the layout will actually carry rather than to lorem. */

type Item = {
  href: string
  kicker: string
  title: string
  excerpt?: string
  image?: string
  meta: string
}

const FALLBACK: Item[] = [
  {
    href: '/blog',
    kicker: 'Java',
    title: 'The night train to Yogyakarta, and everyone asleep but the vendor',
    excerpt:
      'Eleven hours across the spine of the island, in a carriage where nobody is a stranger by morning. A note on how Indonesians travel among themselves.',
    image: 'https://picsum.photos/seed/ex3-lead/1600/900',
    meta: '12 min read',
  },
  {
    href: '/blog',
    kicker: 'Kyrgyzstan',
    title: 'Forty days in the Tian Shan, and the first one under the ice',
    excerpt:
      'I stepped onto the lake, heard the crack, and went straight through. That was day one.',
    image: 'https://picsum.photos/seed/ex3-2/900/600',
    meta: '9 min read',
  },
  {
    href: '/blog',
    kicker: 'Method',
    title: 'What a visa on an Indonesian passport actually costs you',
    excerpt:
      'Not the fee. The three weeks of appointments, the bank statements, the interview.',
    image: 'https://picsum.photos/seed/ex3-3/900/600',
    meta: '6 min read',
  },
  {
    href: '/blog',
    kicker: 'Sumatra',
    title: 'Lake Toba in the off season',
    excerpt: 'The largest volcanic lake on earth, and a ferry with four people on it.',
    image: 'https://picsum.photos/seed/ex3-4/800/600',
    meta: '7 min read',
  },
  {
    href: '/blog',
    kicker: 'Tokyo',
    title: 'A week of eating standing up',
    excerpt: 'Every meal taken at a counter, and what that does to a city.',
    image: 'https://picsum.photos/seed/ex3-5/800/600',
    meta: '5 min read',
  },
  {
    href: '/blog',
    kicker: 'Gear',
    title: 'One bag, three climates, no laundry plan',
    excerpt: 'The packing list that survived the Tian Shan and the equator in one trip.',
    image: 'https://picsum.photos/seed/ex3-6/800/600',
    meta: '4 min read',
  },
  {
    href: '/blog',
    kicker: 'Flores',
    title: 'The road to Wae Rebo is not a road',
    excerpt: 'Four hours up, in the dark, to a village of seven houses.',
    image: 'https://picsum.photos/seed/ex3-7/800/600',
    meta: '8 min read',
  },
  {
    href: '/blog',
    kicker: 'Language',
    title: 'Eleven ways to say “where are you going”',
    meta: '3 min read',
  },
  {
    href: '/blog',
    kicker: 'Almaty',
    title: 'Soviet boulevards, Korean food, and a mountain at the end of every street',
    meta: '6 min read',
  },
  {
    href: '/blog',
    kicker: 'Money',
    title: 'What forty days actually cost, line by line',
    meta: '5 min read',
  },
]

function toItem(post: Post, locale: Locale): Item {
  const date = new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(post.publishedAt))
  return {
    href: `/blog/${post.slug}`,
    kicker: post.storyChapter?.season?.title || post.tag || 'Dispatch',
    title: post.title,
    excerpt: post.excerpt,
    image: post.coverImage,
    meta: `${date} · ${post.readingTime} min`,
  }
}

/**
 * Cloudinary serves the gallery originals at around 3000px wide; the contact
 * sheet shows them at roughly 300. Ask Cloudinary for the crop we actually
 * render instead of shipping the original and letting the browser throw
 * 99% of it away. Sanity URLs already arrive sized (see posts.sanity.ts), and
 * anything else is passed through untouched.
 */
function sized(url: string, width: number, ratio: string) {
  return url.includes('/image/upload/')
    ? url.replace(
        '/image/upload/',
        `/image/upload/f_auto,q_auto,c_fill,ar_${ratio},w_${width}/`,
      )
    : url
}

/* ─── Story blocks ─────────────────────────────────────────────────────────── */

function Figure({ src, alt, ratio }: { src?: string; alt: string; ratio?: string }) {
  if (!src) return null
  const style: CSSProperties & { '--ratio'?: string } = ratio ? { '--ratio': ratio } : {}
  return (
    <div className="ex3-story__figure" style={style}>
      {/* Raw <img> rather than next/image: this page mixes Sanity, Cloudinary
          and placeholder hosts, and the layout is what is under test here, not
          the image pipeline. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
  )
}

function Story({
  item,
  locale,
  size,
}: {
  item: Item
  locale: Locale
  size: 'lead' | 'medium' | 'small' | 'text'
}) {
  const titleClass =
    size === 'lead'
      ? 'ex3-h-lead'
      : size === 'medium'
        ? 'ex3-h-1'
        : size === 'small'
          ? 'ex3-h-3'
          : 'ex3-h-4'

  return (
    <Link href={`/${locale}${item.href}`} className="ex3-story">
      {size !== 'text' && (
        <Figure
          src={item.image}
          alt=""
          ratio={size === 'lead' ? '16 / 9' : size === 'small' ? '4 / 3' : '3 / 2'}
        />
      )}
      <span className="ex3-kicker">{item.kicker}</span>
      <h3 className={`${titleClass} ex3-story__title`}>{item.title}</h3>
      {item.excerpt && size !== 'small' && size !== 'text' && (
        <p className={size === 'lead' ? 'ex3-copy ex3-copy--lede' : 'ex3-copy ex3-copy--small'}>
          {item.excerpt}
        </p>
      )}
      {/* Three different footers, because three different jobs. The lead pins a
          continuation line to the bottom of its column. The small cards pin
          their meta, so a row of four shares one baseline however the headlines
          wrap. Everything else just sets the meta under the text. */}
      {size === 'lead' ? (
        <span className="ex3-story__foot ex3-push">
          <span className="ex3-byline ex3-story__cont">Continue reading →</span>
          <span className="ex3-byline">{item.meta}</span>
        </span>
      ) : (
        <span className={size === 'small' ? 'ex3-byline ex3-push' : 'ex3-byline'}>
          {item.meta}
        </span>
      )}
    </Link>
  )
}

/* ─── Page ─────────────────────────────────────────────────────────────────── */

export default async function ExperimentThreePage({
  params,
}: {
  params: { locale: string }
}) {
  const { locale } = params
  if (!isLocale(locale)) notFound()

  const [posts, gallery] = await Promise.all([
    getPostsByLocale(locale).catch(() => []),
    getCloudinaryImagesByTag('blog-gallery').catch(() => []),
  ])

  // Real posts first, topped up from the fallback edition when there are not
  // enough of them. A grid this dense only tells you the truth when every slot
  // holds a different headline — repeat one story across three columns and you
  // are judging the repetition, not the layout.
  const real = posts.map((p) => toItem(p, locale))
  const items = real.length >= 10 ? real : [...real, ...FALLBACK]
  const at = (i: number) => items[i % items.length]

  const lead = at(0)
  const seconds = [at(1), at(2)]
  const latest = [at(3), at(4), at(5), at(6), at(7)]
  const dispatches = [at(3), at(4), at(5), at(6)]

  const strip = gallery.length
    ? gallery.slice(0, 10)
    : Array.from({ length: 8 }, (_, i) => ({
        assetId: `ph-${i}`,
        url: `https://picsum.photos/seed/ex3-strip-${i}/800/1000`,
        alt: '',
        title: ['Bromo', 'Osh', 'Toba', 'Karakol', 'Flores', 'Almaty', 'Ubud', 'Bishkek'][i],
        location: ['East Java', 'Kyrgyzstan', 'Sumatra', 'Kyrgyzstan', 'NTT', 'Kazakhstan', 'Bali', 'Kyrgyzstan'][i],
      }))

  return (
    <Ex3Shell locale={locale} nav={NAV} tagline={TAGLINE[locale]} cta={CTA[locale]}>
      <main>
        {/* ─── The front page ─────────────────────────────────────────────
            7 / 3 / 2 on the desktop sheet: a lead that can carry a 4rem
            headline, a middle column of two, and a narrow rail of links. On the
            tablet sheet the rail drops under the lead at full width, because a
            2/6 rail is narrower than its own letterspacing wants to be. */}
        <div className="ex3-grid">
          <Cell sp={7} md={6}>
            <Story item={lead} locale={locale} size="lead" />
          </Cell>

          <Cell sp={3} md={3}>
            {seconds.map((item, i) => (
              <div key={`${item.href}-${i}`}>
                {i > 0 && <hr className="ex3-hr" />}
                <Story item={item} locale={locale} size={i === 0 ? 'medium' : 'small'} />
              </div>
            ))}
          </Cell>

          <Cell sp={2} md={3}>
            <SectionHead num="1" title="Latest" />
            <ol className="ex3-list">
              {latest.map((item, i) => (
                <li key={`${item.href}-latest-${i}`}>
                  <Link href={`/${locale}${item.href}`} className="ex3-list__row">
                    <span className="ex3-list__num">{String(i + 1).padStart(2, '0')}</span>
                    <span>
                      <span className="ex3-h-4 ex3-story__title" style={{ display: 'block' }}>
                        {item.title}
                      </span>
                      <span
                        className="ex3-byline"
                        style={{ display: 'block', marginTop: '0.35rem' }}
                      >
                        {item.meta}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Cell>
        </div>

        {/* ─── Dispatches ─────────────────────────────────────────────────
            Four across, and the one band that stays two-up on a phone: these
            cards are short enough to survive a half-width measure, and the
            page needs at least one place where the grid is still visibly a
            grid on a small screen. */}
        <SectionBand num="2" title="Dispatches" />
        <div className="ex3-grid">
          {dispatches.map((item, i) => (
            <Cell key={`${item.href}-d-${i}`} sp={3} md={3} sm={1}>
              <Story item={item} locale={locale} size="small" />
            </Cell>
          ))}
        </div>

        {/* ─── The feature ────────────────────────────────────────────────── */}
        <SectionBand num="3" title="The long read" />
        <div className="ex3-grid">
          <Cell sp={8} md={6}>
            <span className="ex3-kicker">Central Asia</span>
            <h2 className="ex3-h-1" style={{ marginTop: '0.5rem' }}>
              Six thousand miles from home, and everyone looked like a neighbour
            </h2>
            <p className="ex3-copy ex3-dropcap" style={{ marginTop: '0.9rem' }}>
              I expected Central Asia to feel entirely alien. Instead, between the grand
              Soviet boulevards, the snow-capped peaks and strangers who could have been
              long-lost relatives, I learned that home is not a coordinate on a map. Forty
              days, six borders, and one very cold lake taught me that the further you get
              from the archipelago, the more of it you seem to carry.
            </p>
            <hr className="ex3-hr" />
            <blockquote className="ex3-quote">
              “I stepped onto the ice, heard a crack, and went straight into sub-zero
              water. <em>That was only day one.</em>”
            </blockquote>
            <span className="ex3-byline" style={{ marginTop: '1rem' }}>
              Pam · Field notes, Season 1
            </span>
          </Cell>

          <Cell sp={4} md={6} className="ex3-cell--sunk">
            <SectionHead num="4" title="The seasons" />
            <ol className="ex3-list" style={{ marginTop: '0.4rem' }}>
              {[
                { n: 'Season 1', t: 'Central Asia', d: '40 days · 6 borders' },
                { n: 'Season 2', t: 'The archipelago, end to end', d: 'In progress' },
                { n: 'Season 3', t: 'Overland to Japan', d: 'Planned, 2027' },
              ].map((s) => (
                <li key={s.n}>
                  <Link href={`/${locale}/explore`} className="ex3-list__row">
                    <span className="ex3-list__num">{s.n.split(' ')[1]}</span>
                    <span>
                      <span className="ex3-meta" style={{ display: 'block', color: 'var(--ex3-muted)' }}>
                        {s.n}
                      </span>
                      <span
                        className="ex3-h-3 ex3-story__title"
                        style={{ display: 'block', marginTop: '0.3rem' }}
                      >
                        {s.t}
                      </span>
                      <span className="ex3-byline" style={{ display: 'block', marginTop: '0.35rem' }}>
                        {s.d}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Cell>
        </div>

        {/* ─── Contact sheet ──────────────────────────────────────────────
            Full-bleed and horizontal at every width. It is the one element that
            keeps its axis on a phone, which stops the small-screen page from
            being a single unbroken column of text. */}
        <SectionBand num="5" title="Contact sheet" />
        <div className="ex3-strip">
          {strip.map((asset) => (
            <Link
              key={asset.assetId}
              href={`/${locale}/gallery`}
              className="ex3-strip__item"
            >
              <figure>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sized(asset.url, 640, '4:5')}
                  alt={asset.alt || ''}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <figcaption className="ex3-strip__cap">
                <span className="ex3-h-4" style={{ display: 'block' }}>
                  {asset.title}
                </span>
                {asset.location && (
                  <span className="ex3-byline" style={{ display: 'block', marginTop: '0.3rem' }}>
                    {asset.location}
                  </span>
                )}
              </figcaption>
            </Link>
          ))}
        </div>
      </main>

      {/* ─── Sign-off ─────────────────────────────────────────────────────── */}
      <footer className="ex3-footer">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem 2rem',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span className="ex3-meta">Travel Pam · Edition No. 47</span>
          <span className="ex3-meta" style={{ color: 'var(--ex3-muted)' }}>
            Published in Jakarta · Read in {locale.toUpperCase()}
          </span>
        </div>
        {/* The wordmark at the largest size the sheet allows: the only piece of
            pure display on the page, and the place the face has to hold up. */}
        <span className="ex3-footer__mark" style={{ marginTop: '0.4em' }}>
          TRAVEL PAM
        </span>
      </footer>
    </Ex3Shell>
  )
}
