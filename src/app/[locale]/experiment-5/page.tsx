import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { IBM_Plex_Mono, Inter_Tight, Permanent_Marker, Source_Serif_4 } from 'next/font/google'
import { Ex4Arrow, Ex4Mark, Ex4Ticks } from '@/components/experiment4/Ex4Mark'
import { Ex4Figure } from '@/components/experiment4/Ex4Figure'
import { Ex5Crop, Ex5Star, GREASE } from '@/components/experiment5/Ex5Marks'
import { DekWithMark, dateline, loadProofContent } from '@/components/experiment4/proofContent'
import { LOCALES, isLocale } from '@/lib/i18n'
import './experiment-5.css'

/**
 * Exploration B of the read-back proof — "The contact sheet" (white ground).
 *
 * Same skeleton as experiment 4 (a strict editorial structure with one ink
 * layer on top), different object: the sheet a photo lab hands back with every
 * frame of a roll printed on white paper, marked up in red grease pencil —
 * keepers circled, crop marks drawn, a star on the one to print.
 *
 * Type is the lab's: a tight grotesk for titles (the printed sleeve), a book
 * serif for reading (so articles stay Medium-calm), and a mono for the film's
 * edge codes, which become the folios.
 */
const grotesk = Inter_Tight({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--ex5-grotesk',
  display: 'swap',
})
const serif = Source_Serif_4({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--ex5-serif',
  display: 'swap',
})
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--ex5-mono',
  display: 'swap',
})
const marker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--ex5-marker',
  display: 'swap',
})

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Experiment 5 — The contact sheet',
  description: 'Exploration of the read-back proof on white: a photo-lab contact sheet marked in red grease pencil.',
  robots: { index: false, follow: false },
}

const PLACEHOLDER = {
  home: 'print this one',
  callouts: [
    { x: 0.32, y: 0.58, note: 'note 1 — what this spot was' },
    { x: 0.66, y: 0.36, note: 'note 2 — what happened here' },
    { x: 0.82, y: 0.74, note: 'note 3 — a detail worth seeing' },
  ],
  sidenote: 'a margin note, in grease pencil',
}

/** Frame numbers the way they're printed on film edges: 1, 1A, 2, 2A… */
function frameNo(i: number) {
  return `${Math.floor(i / 2) + 1}${i % 2 ? 'A' : ''}`
}

/** Film-edge code: typeset, white on black — information, not decoration. */
function EdgeCode({ from = 0, count = 14 }: { from?: number; count?: number }) {
  return (
    <div className="ex5-edge" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>
          {i % 5 === 0 ? 'TRAVEL PAM 400' : `▸ ${frameNo(from + i)}`}
        </span>
      ))}
    </div>
  )
}

export default async function ExperimentFive({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const { posts, photos, lead, paras, coverSrc } = await loadProofContent(locale)
  const base = `/${locale}`
  const ch = lead?.storyChapter
  const leadFrame = ch ? `${ch.chapterNumber}A` : '1A'
  const roll = ch?.season ? String(ch.season.seasonNumber).padStart(2, '0') : '01'
  // Whole rows only: a contact sheet is printed strip by strip.
  const strip = photos.slice(0, photos.length >= 6 ? Math.floor(photos.length / 6) * 6 : photos.length)

  return (
    <div className={`ex5 ${grotesk.variable} ${serif.variable} ${mono.variable} ${marker.variable}`}>
      <p className="ex5-proto">
        Prototype · experiment 5 · the contact sheet (white). Notes, frame numbers and callout
        positions are placeholders.
      </p>

      {/* ── Masthead ───────────────────────────────────────────────────── */}
      <header className="ex5-masthead">
        <Link href={`${base}/experiment-5`} className="ex5-wordmark">
          Travel Pam
        </Link>
        <nav aria-label="Primary" className="ex5-nav">
          <Link href={`${base}/blog`}>Stories</Link>
          <Link href={`${base}/explore`}>Explore</Link>
          <Link href={`${base}/gallery`}>Gallery</Link>
          <Link href={`${base}/about`}>About</Link>
        </nav>
        <div className="ex5-masthead__end">
          <Link href={`${base}/newsletter`} className="ex5-link">
            Subscribe
          </Link>
          <span className="ex5-slot">sign-in · later</span>
        </div>
      </header>
      <EdgeCode />

      {/* ── Front page: the sheet ──────────────────────────────────────── */}
      <section className="ex5-front" aria-label="Front page">
        <div className="ex5-sheet-head">
          <span className="ex5-mono">
            Roll {roll} · {ch?.season?.title ?? 'Season 1'}
          </span>
          <span className="ex5-mono">Sheet of {dateline(new Date().toISOString(), locale)}</span>
        </div>

        <div className="ex5-lead">
          <div className="ex5-lead__frame">
            <Ex4Mark id={`ex5:${lead?.slug}:keeper`} kind="circle" pen={GREASE} className="ex5-keeper">
              <div className="ex5-film">
                <Ex5Crop id={`ex5:${lead?.slug}:crop`}>
                  {coverSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverSrc} alt={lead?.title ?? ''} />
                  )}
                </Ex5Crop>
                <span className="ex5-film__no">▸ {leadFrame}</span>
              </div>
            </Ex4Mark>
            <span className="ex5-lead__star">
              <Ex5Star id={`ex5:${lead?.slug}:star`} size={44} />
            </span>
          </div>

          {lead && (
            <div className="ex5-lead__text">
              <span className="ex5-mono">
                Frame {leadFrame} · {lead.tag}
              </span>
              <h1 className="ex5-display">
                <Link href={`${base}/blog/${lead.slug}`}>{lead.title}</Link>
              </h1>
              {lead.excerpt && (
                <p className="ex5-dek">
                  <DekWithMark text={lead.excerpt} id={`ex5:${lead.slug}`} pen={GREASE} />
                </p>
              )}
              <div className="ex5-lead__note">
                <Ex4Arrow
                  id={`ex5:${lead.slug}:arrow`}
                  from={[0.95, 0.2]}
                  to={[0.04, 0.8]}
                  pen={GREASE}
                  className="ex5-lead__arrow"
                />
                <span className="ex5-marker">{PLACEHOLDER.home}</span>
              </div>
              <span className="ex5-mono ex5-push">
                {dateline(lead.publishedAt, locale)} · {lead.readingTime} min
              </span>
            </div>
          )}
        </div>

        {/* The rest of the roll: every frame, whole, on black film. */}
        <div className="ex5-strips">
          {strip.map((ph, i) => (
            <figure key={ph.url} className="ex5-frame">
              <div className="ex5-frame__film">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={ph.url} alt={ph.alt} loading="lazy" />
              </div>
              <figcaption>
                <span className="ex5-mono">▸ {frameNo(i + 2)}</span>
                <span className="ex5-frame__title">{ph.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="ex5-index">
          <h2 className="ex5-section-head">Index</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">Frame</th>
                <th scope="col">Title</th>
                <th scope="col">Kind</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0, 6).map((p, i) => (
                <tr key={p.slug}>
                  <td className="ex5-mono">{frameNo(i * 2)}</td>
                  <td>
                    <Link href={`${base}/blog/${p.slug}`}>{p.title}</Link>
                  </td>
                  <td className="ex5-mono">{p.tag}</td>
                  <td className="ex5-mono">{dateline(p.publishedAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Ex4Ticks id="ex5:break-1" pen={GREASE} />

      {/* ── Article page ───────────────────────────────────────────────── */}
      {lead && (
        <article className="ex5-article" aria-label="Article page preview">
          <span className="ex5-mono ex5-proto-tag">Article page</span>
          <header className="ex5-article__head">
            <span className="ex5-mono">
              Roll {roll} / Frame {leadFrame}
              {ch?.season ? ` — Season ${ch.season.seasonNumber}, Chapter ${ch.chapterNumber}` : ''}
            </span>
            <h1 className="ex5-article__title">{lead.title}</h1>
            {lead.excerpt && <p className="ex5-article__dek">{lead.excerpt}</p>}
            <p className="ex5-mono">
              Ilham Pamungkas · {dateline(lead.publishedAt, locale)} · {lead.readingTime} min read
            </p>
          </header>

          {coverSrc && (
            <Ex4Figure
              id={`ex5:article:${lead.slug}`}
              src={coverSrc}
              alt={lead.title}
              callouts={PLACEHOLDER.callouts}
              plate={`Frame ${leadFrame} — ${lead.title}`}
              pen={GREASE}
            />
          )}

          <div className="ex5-body">
            {paras.map((t, i) => (
              <div key={i} className="ex5-body__row">
                <p>{t}</p>
                {i === 0 && (
                  <aside className="ex5-sidenote">
                    <span className="ex5-marker">{PLACEHOLDER.sidenote}</span>
                  </aside>
                )}
              </div>
            ))}
          </div>

          <footer className="ex5-article__end">
            <span className="ex5-mono">Next frame</span>
            <span className="ex5-next">
              <Ex4Mark id={`ex5:${lead.slug}:next`} kind="underline" pen={GREASE}>
                Chapter {(ch?.chapterNumber ?? 1) + 1} →
              </Ex4Mark>
            </span>
            <span className="ex5-marker ex5-signoff">— p.</span>
          </footer>
        </article>
      )}
      <EdgeCode from={20} />
    </div>
  )
}
