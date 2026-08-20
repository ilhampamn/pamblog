import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { Ex2Nav, type Ex2NavItem } from '@/components/experiment2/Ex2Nav'
import { getPostsByLocale } from '@/lib/posts.sanity'
import { getCloudinaryImagesByTag } from '@/lib/cloudinary'
import { type Locale } from '@/lib/i18n'
import './experiment-2.css'

const LOCALES = ['en', 'id', 'zh'] as const

/**
 * Loaded here rather than in the locale layout so only this page pays for it.
 * The layout's Playfair is limited to 700/900; this direction needs the lighter
 * weights, where the serif's contrast reads as editorial rather than heavy.
 */
const serif = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--ex2-serif',
  display: 'swap',
})

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Somewhere in Central Asia',
  description:
    'A travel-journal layout experiment — graph paper, torn-edge cards and taped polaroids.',
  robots: { index: false, follow: false },
}

// This page plays the role of "home" for the experiment, so its own nav
// item links back to itself rather than to the real site root.
const NAV: Ex2NavItem[] = [
  { href: '/experiment-2', label: 'Home', icon: 'home' },
  { href: '/blog', label: 'Writing', icon: 'write' },
  { href: '/about', label: 'About', icon: 'smiley' },
  { href: '/gallery', label: 'Gallery', icon: 'book' },
]

const STORY = {
  lede: '6,000 miles from home, I expected Central Asia to feel entirely alien. Instead, between the grand Soviet boulevards, snow-capped peaks, and strangers who looked like long-lost neighbours, I learned that home isn’t a coordinate on a map.',
  pull: '“I stepped onto the ice, heard a crack, and immediately plunged into sub-zero water. That was only Day 1 of my 40-day journey across Central Asia. From surviving snowstorms in nomadic yurts to trekking through the Tian Shan mountains, here is what it really takes to explore the wild heart of Asia.”',
}

export default async function ExperimentTwoPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) notFound()

  // Real content rather than lorem — the layout only proves itself against
  // titles and photographs of the lengths it will actually carry.
  const [posts, gallery] = await Promise.all([
    getPostsByLocale(locale).catch(() => []),
    getCloudinaryImagesByTag('blog-gallery').catch(() => []),
  ])
  const writings = posts.slice(0, 3)
  const tiles = gallery.slice(0, 4)

  return (
    <div className={`ex2 ${serif.variable}`}>
      {/* ─── Floating hand-drawn nav ─────────────────────────────────────── */}
      <Ex2Nav locale={locale} items={NAV} />

      {/* ─── Hero ────────────────────────────────────────────────────────── */}
      <header className="relative isolate flex min-h-[clamp(440px,74vh,660px)] flex-col items-center justify-center px-[var(--ex2-gutter)] pb-14 pt-[clamp(96px,14vh,150px)] text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/experiment2/hero.webp"
          alt=""
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        {/* Scrim. The photograph is a pale, hazy steppe and the title sits right
            on the bright horizon band, so the middle needs to stay dark rather
            than opening up the way a standard top/bottom vignette would. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'linear-gradient(180deg, rgba(16,14,12,0.5) 0%, rgba(16,14,12,0.38) 42%, rgba(16,14,12,0.34) 62%, rgba(16,14,12,0.54) 100%)',
          }}
        />

        <p className="ex2-eyebrow text-white/85">
          Pam Travel <span className="mx-1.5 opacity-60">|</span> Season 1{' '}
          <span className="mx-1.5 opacity-60">|</span> Central Asia
        </p>

        <h1 className="ex2-display mt-5 max-w-[15ch] text-white">
          Somewhere in Central Asia
        </h1>

        <p className="mt-5 text-sm text-white/90">May 2026</p>

        <Link href={`/${locale}/blog`} className="ex2-btn mt-7">
          Read Full Stories
        </Link>
      </header>

      <main>
        {/* ─── Upcoming season ───────────────────────────────────────────── */}
        <section className="px-[var(--ex2-gutter)] pb-[clamp(48px,7vw,88px)] pt-[clamp(44px,6vw,76px)]">
          <div className="mx-auto max-w-[var(--ex2-measure)]">
            <h2 className="ex2-section-title">Upcoming Season</h2>

            <div className="mt-[clamp(28px,4vw,52px)] grid items-center gap-y-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
              <div className="relative z-10 mx-auto w-full max-w-[440px] lg:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/experiment2/polaroid-1.webp"
                  alt="Prayer flags above a glacial lake in the Tian Shan mountains"
                  className="ex2-polaroid"
                  style={{ rotate: '-1.5deg' }}
                />
              </div>

              <div className="ex2-paper-card px-7 py-8 sm:px-10 sm:py-11 lg:-ml-14 lg:pl-20">
                <h3 className="ex2-card-title">Beauty of Central Asia</h3>
                <p className="ex2-copy mt-3">{STORY.lede}</p>
                <p className="ex2-copy mt-3">{STORY.pull}</p>
                <Link href={`/${locale}/blog`} className="ex2-btn mt-6">
                  Read Full Stories… <span aria-hidden>›</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Recent writings ───────────────────────────────────────────── */}
        <section className="px-[var(--ex2-gutter)] py-[clamp(44px,6vw,76px)]">
          <div className="mx-auto max-w-[var(--ex2-measure)]">
            <h2 className="ex2-section-title">Recent Writings</h2>

            {writings.length === 0 ? (
              <p className="ex2-copy mt-8 text-center">No writing published yet.</p>
            ) : (
              <ul className="mt-[clamp(24px,3.5vw,44px)] grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {writings.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="group block no-underline"
                    >
                      {/* object-top, not centre: covers here are often portrait
                          notes whose text starts at the top, and a centre crop
                          slices them mid-sentence. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage ?? '/experiment2/writing.webp'}
                        alt=""
                        className="block aspect-[544/377] w-full object-cover object-top"
                      />
                      <h3 className="ex2-card-title mt-3 group-hover:underline">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="ex2-copy--quiet mt-1.5">{post.excerpt}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* ─── Why am i here ─────────────────────────────────────────────── */}
        <section className="px-[var(--ex2-gutter)] py-[clamp(44px,6vw,76px)]">
          <div className="mx-auto max-w-[var(--ex2-measure)]">
            <h2 className="ex2-section-title">Why am I here?</h2>

            <div className="mt-[clamp(28px,4vw,52px)] grid items-center gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
              <div className="ex2-paper-card order-2 px-7 py-8 sm:px-10 sm:py-11 lg:order-1 lg:pr-20">
                <h3 className="ex2-card-title">
                  He was a little guy who dreamed big
                </h3>
                <p className="ex2-copy mt-3">{STORY.lede}</p>
                <p className="ex2-copy mt-3">{STORY.pull}</p>
                <Link href={`/${locale}/about`} className="ex2-btn mt-6">
                  Read Full Stories… <span aria-hidden>›</span>
                </Link>
              </div>

              <div className="relative z-10 order-1 mx-auto w-full max-w-[440px] lg:order-2 lg:-ml-14 lg:mx-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/experiment2/polaroid-2.webp"
                  alt="A family portrait from the eighties"
                  className="ex2-polaroid"
                  style={{ rotate: '1.5deg' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Gallery ───────────────────────────────────────────────────── */}
        <section className="px-[var(--ex2-gutter)] pb-[clamp(56px,8vw,110px)] pt-[clamp(44px,6vw,76px)]">
          <div className="mx-auto max-w-[var(--ex2-measure)]">
            <h2 className="ex2-section-title">Gallery</h2>

            <div className="mt-[clamp(24px,3.5vw,44px)] grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
              {(tiles.length > 0
                ? tiles
                : Array.from({ length: 4 }, () => null)
              ).map((asset, index) => (
                <div key={asset?.assetId ?? index} className="ex2-gallery-tile">
                  {asset && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={asset.url} alt={asset.alt} loading="lazy" />
                  )}
                </div>
              ))}
            </div>

            <Link
              href={`/${locale}/gallery`}
              className="mt-5 inline-block text-sm font-semibold text-[var(--ex2-ink)] no-underline hover:underline"
            >
              see all <span aria-hidden>›</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-[#111] px-[var(--ex2-gutter)] py-9">
        <div className="mx-auto flex max-w-[var(--ex2-measure)] flex-wrap items-center justify-between gap-3">
          <p className="ex2-eyebrow text-white/70">Pam Travel — Season 1</p>
          <p className="ex2-eyebrow text-white/40">Layout experiment</p>
        </div>
      </footer>
    </div>
  )
}
