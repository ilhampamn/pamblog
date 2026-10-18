import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Courier_Prime, DM_Serif_Display, Homemade_Apple, Literata } from 'next/font/google'
import { Ex4Mark } from '@/components/experiment4/Ex4Mark'
import { Ex4Figure } from '@/components/experiment4/Ex4Figure'
import { Ex6Postmark, Ex6Wave, STAMP_INK } from '@/components/experiment6/Ex6Marks'
import { dateline, loadProofContent } from '@/components/experiment4/proofContent'
import { LOCALES, isLocale, type Locale } from '@/lib/i18n'
import './experiment-6.css'

/**
 * Exploration C of the read-back proof — "The postcard home".
 *
 * The rigid structure is the back of a postcard, which every reader already
 * knows how to read: the message on the left, a centre rule, the address side
 * on the right with a stamp and the post office's cancellation over it. That
 * maps one-to-one onto a Medium column with a margin — the message is the
 * article, the address side carries the metadata, and the postmark is the
 * folio (where and when). The card front is the cover photograph.
 *
 * One ink: postmark violet. The airmail border, the cancellation, the hand
 * and the links are all the same ink, as if one stamp pad did the lot.
 */
const display = DM_Serif_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: '400',
  variable: '--ex6-display',
  display: 'swap',
})
const reading = Literata({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--ex6-reading',
  display: 'swap',
})
const typewriter = Courier_Prime({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--ex6-type',
  display: 'swap',
})
const script = Homemade_Apple({
  subsets: ['latin'],
  weight: '400',
  variable: '--ex6-script',
  display: 'swap',
})

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Experiment 6 — The postcard home',
  description: 'Exploration of the read-back proof as the back of a postcard: message, address side, stamp and postmark.',
  robots: { index: false, follow: false },
}

const PLACEHOLDER = {
  salutation: 'Dear you,',
  signoff: 'wish you were here — p.',
  place: 'SON-KUL',
  callouts: [
    { x: 0.32, y: 0.58, note: 'note 1 — what this spot was' },
    { x: 0.66, y: 0.36, note: 'note 2 — what happened here' },
    { x: 0.82, y: 0.74, note: 'note 3 — a detail worth seeing' },
  ],
  sidenote: 'a margin note, squeezed in sideways',
}

/** "POST CARD" in all three of the site's languages — the card's own header. */
const POSTCARD = 'Post card · Kartu pos · 明信片'

function stampDate(iso: string) {
  const d = new Date(iso)
  const m = d.toLocaleString('en', { month: 'short' }).toUpperCase()
  return `${String(d.getDate()).padStart(2, '0')} ${m} ${String(d.getFullYear()).slice(2)}`
}

/** A stamp: perforated paper, typeset. The denomination is the chapter. */
function Stamp({ photo, season, chapter }: { photo?: string; season: string; chapter: string }) {
  return (
    <div className="ex6-stamp" aria-label={`${season}, ${chapter}`}>
      <div className="ex6-stamp__inner">
        {photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" />
        )}
        <span className="ex6-stamp__country">Travel Pam</span>
        <span className="ex6-stamp__value">{chapter}</span>
        <span className="ex6-stamp__season">{season}</span>
      </div>
    </div>
  )
}

function addressLines(locale: Locale, lead: { publishedAt: string; readingTime: number; tag: string }) {
  return [
    'From: Ilham Pamungkas',
    `Kind: ${lead.tag}`,
    `Sent: ${dateline(lead.publishedAt, locale)}`,
    `Reading: ${lead.readingTime} min`,
  ]
}

export default async function ExperimentSix({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const { posts, photos, lead, paras, coverSrc } = await loadProofContent(locale)
  const base = `/${locale}`
  const ch = lead?.storyChapter
  const season = ch?.season ? `Season ${ch.season.seasonNumber}` : 'Season 1'
  const chapter = ch ? `Ch. ${ch.chapterNumber}` : 'Ch. 1'
  const rack = photos.slice(0, 6)

  return (
    <div className={`ex6 ${display.variable} ${reading.variable} ${typewriter.variable} ${script.variable}`}>
      <div className="ex6-airmail" aria-hidden />
      <p className="ex6-proto">
        Prototype · experiment 6 · the postcard home. Notes, salutation, place on the postmark and
        callout positions are placeholders.
      </p>

      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <header className="ex6-masthead">
        <div className="ex6-masthead__brand">
          <Link href={`${base}/experiment-6`} className="ex6-wordmark">
            Travel Pam
          </Link>
          <span className="ex6-type ex6-postcard-label">{POSTCARD}</span>
        </div>
        <nav aria-label="Primary" className="ex6-nav">
          <Link href={`${base}/blog`}>Stories</Link>
          <Link href={`${base}/explore`}>Explore</Link>
          <Link href={`${base}/gallery`}>Gallery</Link>
          <Link href={`${base}/about`}>About</Link>
        </nav>
        <div className="ex6-masthead__end">
          <Link href={`${base}/newsletter`} className="ex6-link">
            Subscribe
          </Link>
          <span className="ex6-slot">sign-in · later</span>
        </div>
      </header>

      {/* ── Front page: the card, both sides ───────────────────────────── */}
      {lead && (
        <section className="ex6-front" aria-label="Front page">
          <figure className="ex6-card ex6-card--front">
            {coverSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverSrc} alt={lead.title} />
            )}
            <figcaption className="ex6-card__greeting">
              <span>Greetings from</span>
              <strong>{PLACEHOLDER.place.toLowerCase()}</strong>
            </figcaption>
          </figure>

          <div className="ex6-card ex6-card--back">
            <div className="ex6-back__message">
              <span className="ex6-type ex6-small">
                {season} · {chapter}
              </span>
              <h1 className="ex6-display">
                <Link href={`${base}/blog/${lead.slug}`}>{lead.title}</Link>
              </h1>
              <p className="ex6-script">{PLACEHOLDER.salutation}</p>
              {lead.excerpt && <p className="ex6-dek">{lead.excerpt}</p>}
              <Link href={`${base}/blog/${lead.slug}`} className="ex6-read">
                <Ex4Mark id={`ex6:${lead.slug}:read`} kind="underline" pen={STAMP_INK}>
                  Read the whole card
                </Ex4Mark>
              </Link>
            </div>
            <div className="ex6-back__address">
              <div className="ex6-back__corner">
                <Stamp photo={photos[1]?.url ?? coverSrc} season={season} chapter={chapter} />
                <span className="ex6-back__postmark">
                  <Ex6Postmark
                    id={`ex6:${lead.slug}:pm-home`}
                    place={PLACEHOLDER.place}
                    date={stampDate(lead.publishedAt)}
                    center={chapter.toUpperCase()}
                    width={240}
                  />
                </span>
              </div>
              <ul className="ex6-address">
                {addressLines(locale, lead).map((l) => (
                  <li key={l} className="ex6-type">
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="ex6-lower" aria-label="More">
        <div className="ex6-register">
          <h2 className="ex6-section-head">Postal register</h2>
          <ol>
            {posts.slice(0, 6).map((p, i) => (
              <li key={p.slug}>
                <span className="ex6-type ex6-small">No. {String(i + 1).padStart(3, '0')}</span>
                <Link href={`${base}/blog/${p.slug}`}>{p.title}</Link>
                <span className="ex6-type ex6-small">{stampDate(p.publishedAt)}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="ex6-rack">
          <h2 className="ex6-section-head">From the rack</h2>
          <div className="ex6-rack__grid">
            {rack.map((ph) => (
              <figure key={ph.url} className="ex6-mini">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.alt} loading="lazy" />
                <figcaption className="ex6-type">{ph.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Ex6Wave id="ex6:break-1" width={220} />

      {/* ── Article page: the back of the card, at reading size ─────────── */}
      {lead && (
        <article className="ex6-article" aria-label="Article page preview">
          <span className="ex6-type ex6-small ex6-proto-tag">Article page</span>

          {coverSrc && (
            <div className="ex6-article__front">
              <Ex4Figure
                id={`ex6:article:${lead.slug}`}
                src={coverSrc}
                alt={lead.title}
                callouts={PLACEHOLDER.callouts}
                plate={`The front — ${lead.title}`}
                pen={STAMP_INK}
              />
            </div>
          )}

          <div className="ex6-article__back">
            <div className="ex6-article__message">
              <span className="ex6-type ex6-small">
                {season} · {chapter}
              </span>
              <h1 className="ex6-article__title">{lead.title}</h1>
              <p className="ex6-script">{PLACEHOLDER.salutation}</p>
              {paras.map((t, i) => (
                <p key={i} className="ex6-body">
                  {t}
                </p>
              ))}
              <p className="ex6-script ex6-signoff">{PLACEHOLDER.signoff}</p>
            </div>

            <aside className="ex6-article__address">
              <div className="ex6-back__corner">
                <Stamp photo={photos[2]?.url ?? coverSrc} season={season} chapter={chapter} />
                <span className="ex6-back__postmark">
                  <Ex6Postmark
                    id={`ex6:${lead.slug}:pm-article`}
                    place={PLACEHOLDER.place}
                    date={stampDate(lead.publishedAt)}
                    center={chapter.toUpperCase()}
                    width={240}
                  />
                </span>
              </div>
              <ul className="ex6-address">
                {addressLines(locale, lead).map((l) => (
                  <li key={l} className="ex6-type">
                    {l}
                  </li>
                ))}
              </ul>
              <p className="ex6-margin-note">{PLACEHOLDER.sidenote}</p>
              <Link href={`${base}/blog`} className="ex6-next">
                <span className="ex6-type ex6-small">Next card</span>
                <Ex4Mark id={`ex6:${lead.slug}:next`} kind="circle" pen={STAMP_INK}>
                  Chapter {(ch?.chapterNumber ?? 1) + 1}
                </Ex4Mark>
              </Link>
            </aside>
          </div>
        </article>
      )}
      <div className="ex6-airmail" aria-hidden />
    </div>
  )
}
