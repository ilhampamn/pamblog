import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Caveat_Brush, DM_Mono } from 'next/font/google'
import { FloatBar, type FloatBarSection } from '@/components/experiment/FloatBar'
import {
  ScribbleArrow,
  ScribbleCircle,
  ScribbleUnderline,
} from '@/components/experiment/Scribbles'
import { getCloudinaryImagesByTag } from '@/lib/cloudinary'
import { type Locale } from '@/lib/i18n'
import './experiment.css'

const LOCALES = ['en', 'id', 'zh'] as const

/**
 * Fonts are declared here rather than in the locale layout so only this page
 * downloads them — the rest of the site keeps its own type system.
 *
 * Caveat Brush is a brush-pen hand: heavier and warmer than the site's Caveat,
 * which reads too thin at display sizes. DM Mono is the soft mono — low
 * contrast with rounded terminals, so it carries body copy without the
 * technical, code-editor feel of JetBrains Mono.
 */
const hand = Caveat_Brush({
  subsets: ['latin'],
  weight: '400',
  variable: '--exp-hand',
  display: 'swap',
})

const mono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--exp-mono',
  display: 'swap',
})

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Experiment',
  description:
    'A style laboratory — cold-press paper, modern grotesque type, and hand-drawn annotation.',
  // Unlisted sandbox: reachable by URL, deliberately kept out of search.
  robots: { index: false, follow: false },
}

const SECTIONS: FloatBarSection[] = [
  { id: 'masthead', label: 'masthead' },
  { id: 'spread', label: 'spread' },
  { id: 'notes', label: 'notes' },
  { id: 'plates', label: 'plates' },
  { id: 'specimen', label: 'specimen' },
]

/** Fills out the plate set when the gallery has fewer photos than the layout wants. */
function platesFrom(urls: string[], count: number) {
  return Array.from({ length: count }, (_, index) =>
    urls[index % Math.max(urls.length, 1)] ??
    `https://picsum.photos/seed/exp-${index}/900/1200`
  )
}

export default async function ExperimentPage({
  params,
}: {
  params: { locale: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as (typeof LOCALES)[number])) notFound()

  // Real photographs rather than placeholders — the "realism" half of the
  // direction only works with actual grain and actual light in the frame.
  const assets = await getCloudinaryImagesByTag('blog-gallery')
  const urls = assets.map((asset) => asset.url)
  const plates = platesFrom(urls, 8)

  return (
    <div className={`exp flex-1 min-h-screen ${hand.variable} ${mono.variable}`}>
      {/* ─── Masthead — free-paper header: rules, issue number, two languages ──
          Its top padding also clears the float bar, now pinned to the top. */}
      <header
        id="masthead"
        className="scroll-mt-24 px-[var(--exp-gutter)] pt-[clamp(96px,11vw,140px)]"
      >
        <div className="mx-auto max-w-[var(--exp-measure)]">
          <div className="exp-rule--ink exp-rule" />

          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3 pt-3">
            <span className="exp-label exp-label--ink">Style Laboratory</span>
            <span className="exp-label">Ilham Pamungkas</span>
            <span className="exp-label">
              Issue 001 <span className="exp-label--blue">/ Paper</span>
            </span>
          </div>

          <div className="mt-[clamp(28px,6vw,64px)] grid gap-x-10 gap-y-8 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <h1 className="exp-display">
                rough{' '}
                <span className="exp-annotated">
                  raw
                  <ScribbleCircle seed={19} className="exp-mark--circle" />
                </span>{' '}
                realism
              </h1>
              <p className="exp-label mt-5">
                Kertas, ruang kosong, dan sedikit warna
              </p>
            </div>

            <div className="lg:pt-3">
              <p className="exp-lede">
                A sandbox for one idea: set a human hand against a machined
                mono, on a surface that is unmistakably physical, then let a pen
                disagree with both in the margins.
              </p>
              <p className="exp-lede mt-4">
                Colour in the interface stays scarce so it can mean something —
                blue as the constant, one further accent per section. The
                photographs are exempt; they arrive as they were taken.
              </p>
            </div>
          </div>

          <div className="mt-[clamp(28px,6vw,56px)]">
            <div className="exp-plate aspect-[16/7]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={plates[0]} alt="" loading="eager" />
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
              <span className="exp-label">Plate 01 — cold-press surface</span>
              <span className="exp-label">Untreated colour</span>
            </div>
          </div>

          <div className="exp-rule mt-[clamp(36px,7vw,80px)]" />
        </div>
      </header>

      {/* ─── Spread — justified columns beside a tall plate, captions on the edge ── */}
      <section
        id="spread"
        className="scroll-mt-24 px-[var(--exp-gutter)] py-[clamp(40px,8vw,96px)]"
      >
        <div className="mx-auto max-w-[var(--exp-measure)]">
          <div className="flex items-baseline justify-between gap-6">
            <span className="exp-label exp-label--ink">The Editorial Spread</span>
            <span className="exp-label">02</span>
          </div>

          <div className="mt-8 grid items-start gap-x-8 gap-y-10 lg:grid-cols-[0.9fr_1.1fr]">
            {/* content-start stops the text rows from stretching to match the
                height of the tall plate beside them. */}
            <div className="grid content-start gap-x-7 gap-y-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <p className="exp-body">
                The reference for this section is a printed magazine, where the
                page is mostly nothing. Text sits in narrow columns because a
                short measure is easier to read and because the emptiness around
                it is doing real work — it is what makes the photograph feel
                placed rather than pasted.
              </p>
              <p className="exp-body">
                Captions are pinned to the edges of the sheet instead of tucked
                under what they describe. It borrows the logic of a running
                head: the page tells you where you are at its boundary, and
                leaves the middle alone for the work itself.
              </p>
              <p className="exp-body">
                Nothing here is centred by default. Type hangs from a baseline,
                a plate breaks the column, and the grid is visible enough to
                push against. Structure first, then a deliberate break of it.
              </p>
              <p className="exp-body">
                The one flourish is a pen. A circled word, an underline that
                overshoots — marks that could not have been produced by the
                layout engine, sitting on top of something that obviously was.
              </p>
            </div>

            <div>
              <div className="exp-plate aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plates[1]} alt="" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="exp-rule mt-10" />
          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
            <span className="exp-label">Short measure</span>
            <span className="exp-label md:text-center">Edge-pinned captions</span>
            <span className="exp-label col-span-2 md:col-span-1 md:text-right">
              The Editorial Spread
            </span>
          </div>
        </div>
      </section>

      {/* ─── Notes — the blue deck: mono headings, annotation, numbered stages ── */}
      <section
        id="notes"
        className="scroll-mt-24 px-[var(--exp-gutter)] py-[clamp(40px,8vw,96px)]"
      >
        <div className="mx-auto max-w-[var(--exp-measure)]">
          <div className="grid gap-x-10 gap-y-10 lg:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="exp-h2">
                field{' '}
                <span className="exp-annotated">
                  notes
                  <ScribbleUnderline seed={31} className="exp-mark--underline" />
                </span>
              </h2>
              <p className="exp-lede mt-6 max-w-[46ch]">
                Where the deck reference earns its keep: one saturated blue, and
                annotation that behaves like someone marked up a printout during
                a review.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span
                  className="relative block shrink-0"
                  aria-hidden="true"
                  style={{ width: 150, height: 36 }}
                >
                  <ScribbleArrow seed={43} className="exp-mark--fill" />
                </span>
                <span className="exp-label exp-label--blue">
                  pointing at the thing
                </span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="exp-plate aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plates[2]} alt="" loading="lazy" />
              </div>
              <div className="exp-plate mt-0 aspect-[3/4] sm:mt-10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={plates[3]} alt="" loading="lazy" />
              </div>
            </div>
          </div>

          <ol className="mt-[clamp(36px,6vw,72px)] grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'surface',
                body: 'A scanned cold-press sheet, multiplied over warm off-white so the grain sits in the shadows rather than on top of them.',
              },
              {
                title: 'type',
                body: 'A brush hand takes the headings; a soft mono takes everything else. Two voices only — one plainly human, one plainly machined.',
              },
              {
                title: 'colour',
                body: 'Blue is constant; each section adds exactly one more accent, so the palette shifts with context. The photographs are left out of the system entirely.',
              },
              {
                title: 'marks',
                body: 'Circles, underlines, arrows. Drawn with a fixed seed so they are stable between renders but never geometric.',
              },
            ].map((item, index) => (
              <li key={item.title}>
                <div className="flex items-baseline gap-3">
                  <span className="exp-label exp-label--blue">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="exp-h3">{item.title}</h3>
                </div>
                <div className="exp-rule my-3" />
                <p className="exp-body">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─── Plates — the four-up strip, captions hung beneath the edges ─────── */}
      <section
        id="plates"
        className="scroll-mt-24 px-[var(--exp-gutter)] py-[clamp(40px,8vw,96px)]"
      >
        <div className="mx-auto max-w-[var(--exp-measure)]">
          <div className="flex items-baseline justify-between gap-6">
            <span className="exp-label exp-label--ink">Plates</span>
            <span className="exp-label">04</span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {[3, 4, 5, 6].map((plateIndex, position) => (
              <div key={plateIndex} className="exp-plate aspect-[3/4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={plates[plateIndex]}
                  alt=""
                  loading="lazy"
                  style={{ animationDelay: `${position * 60}ms` }}
                />
              </div>
            ))}
          </div>

          <div className="exp-rule mt-4" />
          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-3">
            <span className="exp-label">Four-up, equal weight</span>
            <span className="exp-label md:text-center">As photographed</span>
            <span className="exp-label col-span-2 md:col-span-1 md:text-right">
              From the gallery
            </span>
          </div>
        </div>
      </section>

      {/* ─── Specimen — the reference sheet this page exists to produce ───────── */}
      <section
        id="specimen"
        className="scroll-mt-24 px-[var(--exp-gutter)] pb-[clamp(120px,16vw,200px)] pt-[clamp(40px,8vw,96px)]"
      >
        <div className="mx-auto max-w-[var(--exp-measure)]">
          <div className="exp-rule--ink exp-rule" />
          <h2 className="exp-h2 mt-6">specimen</h2>

          <div className="mt-10 grid gap-x-10 gap-y-12 lg:grid-cols-3">
            {/* Type */}
            <div>
              <span className="exp-label exp-label--ink">Type</span>
              <div className="exp-rule my-4" />
              <p
                style={{
                  fontFamily: 'var(--exp-hand), cursive',
                  fontSize: '3.5rem',
                  lineHeight: 1.05,
                }}
              >
                Aa
              </p>
              <p className="exp-label mt-2">Caveat Brush · headings</p>
              <p
                className="mt-6"
                style={{
                  fontFamily: 'var(--exp-mono), ui-monospace, monospace',
                  fontSize: '2rem',
                }}
              >
                Aa
              </p>
              <p className="exp-label mt-2">
                DM Mono · body, labels, numerals
              </p>
            </div>

            {/* Colour */}
            <div>
              <span className="exp-label exp-label--ink">Colour</span>
              <div className="exp-rule my-4" />
              <ul className="grid gap-2">
                {[
                  { name: 'Blue — constant', value: '#2029d9' },
                  { name: 'Vermilion — spread', value: '#e0421f' },
                  { name: 'Yellow — caution', value: '#f0b429' },
                  { name: 'Green — affirm', value: '#1a8f5f' },
                  { name: 'Ink', value: '#14140f' },
                  { name: 'Paper', value: '#f4f2ed' },
                ].map((swatch) => (
                  <li key={swatch.value} className="flex items-center gap-3">
                    <span
                      className="h-7 w-7 shrink-0"
                      style={{
                        backgroundColor: swatch.value,
                        border: '1px solid rgba(20,20,15,0.12)',
                      }}
                    />
                    <span className="exp-label exp-label--ink">{swatch.name}</span>
                    <span className="exp-label ml-auto">{swatch.value}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Marks */}
            <div>
              <span className="exp-label exp-label--ink">Marks</span>
              <div className="exp-rule my-4" />
              <div className="flex flex-col gap-8">
                <div>
                  <span className="exp-annotated exp-h3">
                    circled
                    <ScribbleCircle
                      seed={5}
                      color="#e0421f"
                      className="exp-mark--circle"
                    />
                  </span>
                  <p className="exp-label mt-3">Ellipse, two passes</p>
                </div>
                <div>
                  <span className="exp-annotated exp-h3">
                    underlined
                    <ScribbleUnderline
                      seed={13}
                      color="#1a8f5f"
                      className="exp-mark--underline"
                    />
                  </span>
                  <p className="exp-label mt-3">Overshoots both ends</p>
                </div>
                <div>
                  <span
                    className="relative block"
                    aria-hidden="true"
                    style={{ width: 150, height: 36 }}
                  >
                    <ScribbleArrow
                      seed={29}
                      color="#f0b429"
                      className="exp-mark--fill"
                    />
                  </span>
                  <p className="exp-label mt-3">Shaft plus two head strokes</p>
                </div>
              </div>
            </div>
          </div>

          <div className="exp-rule mt-14" />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
            <span className="exp-label">
              Grain — ambientCG Paper001 displacement (CC0)
            </span>
            <span className="exp-label">End of issue</span>
          </div>
        </div>
      </section>

      <FloatBar sections={SECTIONS} />
    </div>
  )
}
