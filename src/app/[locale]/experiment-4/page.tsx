import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Newsreader, Nanum_Pen_Script } from 'next/font/google'
import { Ex4Arrow, Ex4Mark } from '@/components/experiment4/Ex4Mark'
import { Ex4Caret, Ex4Pilcrow } from '@/components/experiment4/Ex4Proof'
import { Ex4Bracket, Ex4Line, Ex4PenLink, Ex4Save } from '@/components/experiment4/Ex4Pen'
import { Ex4BlockButton, Ex4PrintedForm } from '@/components/experiment4/Ex4Print'
import { Ex4Sidebar, type RailFolder } from '@/components/experiment4/Ex4Sidebar'
import {
  DekWithMark,
  Headline,
  dateline,
  folio,
  loadProofContent,
} from '@/components/experiment4/proofContent'
import { Ex4Figure } from '@/components/experiment4/Ex4Figure'
import { LOCALES, isLocale } from '@/lib/i18n'
import type { Post } from '@/lib/posts.sanity'
import './experiment-4.css'

/**
 * Prototype of "The read-back proof" (design/art-direction.md, draft
 * 2026-10-18): a home front page and an article header, built against real
 * posts and photographs so the direction can be judged before it is approved.
 *
 * Fonts load here, not in the locale layout, so the live site doesn't pay for
 * them. Newsreader does display, reading and small-caps labels (one family,
 * two jobs, as Medium does); Nanum Pen Script is the placeholder hand until
 * Ilham's own handwriting font exists.
 */
const serif = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--ex4-serif',
  display: 'swap',
})

const hand = Nanum_Pen_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--ex4-hand',
  display: 'swap',
})

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Experiment 4 — The read-back proof',
  description:
    'Prototype of the read-back proof direction: a typeset page marked up with one blue ballpoint.',
  robots: { index: false, follow: false },
  // Prototype favicon: the logo's "Pam." block. Scoped to this route, so the
  // live site's icon is untouched until the direction ships.
  icons: {
    icon: [{ url: '/brand/favicon-pam-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/brand/favicon-pam-180.png', sizes: '180x180' }],
  },
}

/** Placeholder notes. In production every note is written by Ilham for its article (Rule 7). */
const PLACEHOLDER = {
  home: 'a note only you would know',
  callouts: [
    { x: 0.32, y: 0.58, note: 'note 1 — what this spot was' },
    { x: 0.66, y: 0.36, note: 'note 2 — what happened here' },
    { x: 0.82, y: 0.74, note: 'note 3 — a detail worth seeing' },
  ],
  sidenote: 'a margin note, written later that evening',
  place: 'Son-Kul',
}

/**
 * The Stories directory as a folder tree: one folder per season that has
 * chapters (in chapter order), then Essays. Empty folders don't appear.
 */
function buildFolders(posts: Post[], base: string): RailFolder[] {
  const seasons = new Map<number, { n: number; title: string; href: string }[]>()
  for (const p of posts.filter((x) => x.tag === 'stories')) {
    const num = p.storyChapter?.season?.seasonNumber ?? 1
    const list = seasons.get(num) ?? []
    list.push({ n: p.storyChapter?.chapterNumber ?? list.length + 1, title: p.title, href: `${base}/blog/${p.slug}` })
    seasons.set(num, list)
  }
  const folders: RailFolder[] = Array.from(seasons.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, items]) => ({
      key: `season-${num}`,
      label: `Season ${num}`,
      items: items.sort((x, y) => x.n - y.n).map(({ title, href }) => ({ title, href })),
    }))
  const essays = posts.filter((x) => x.tag === 'essay')
  if (essays.length) {
    folders.push({ key: 'essays', label: 'Essays', items: essays.map((p) => ({ title: p.title, href: `${base}/blog/${p.slug}` })) })
  }
  return folders
}

export default async function ExperimentFour({
  params,
}: {
  params: { locale: string }
}) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale

  const { posts, photos, lead, paras, coverSrc } = await loadProofContent(locale)
  const folders = buildFolders(posts, `/${locale}`)
  const sheet = photos.slice(0, 6)
  const base = `/${locale}`

  return (
    <div className={`ex4 ${serif.variable} ${hand.variable}`}>
      <p className="ex4-proto">
        Prototype · experiment 4 · the read-back proof. Notes and callout positions are
        placeholders. In production you write each one for its article.
      </p>

      {/* ── Vertical navigation: a left rail; only Stories unfolds (L2) ──── */}
      <Ex4Sidebar
        base={base}
        current="home"
        folders={folders}
        brand={
          // Ilham's chosen logo (decisions 2026-10-18), used as-is.
          <Link href={`${base}/experiment-4`} className="ex4-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/travel-pam-logo-480.webp"
              srcSet="/brand/travel-pam-logo-480.webp 1x, /brand/travel-pam-logo-960.webp 2x"
              width={480}
              height={231}
              alt="Travel Pam"
            />
          </Link>
        }
        actions={
          <Ex4BlockButton id="topbar:subscribe" href={`${base}/newsletter`} small>
            Subscribe
          </Ex4BlockButton>
        }
        footer={<span className="ex4-label">English · Bahasa Indonesia · 中文</span>}
      >
      <div className="ex4-dateline ex4-label">
        <span>Edition of {dateline(new Date().toISOString(), locale)}</span>
        <span>Season {lead?.storyChapter?.season?.seasonNumber ?? 1} in progress</span>
      </div>

      {/* ── Front page ─────────────────────────────────────────────────── */}
      <section className="ex4-grid" aria-label="Front page">
        <div className="ex4-cell ex4-cell--photo" style={{ gridColumn: 'span 7' }}>
          {coverSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverSrc} alt={lead?.title ?? ''} className="ex4-lead-photo" />
          )}
        </div>
        <div className="ex4-cell ex4-lead" style={{ gridColumn: 'span 5' }}>
          {lead && (
            <div className="ex4-lead__story">
              <span className="ex4-label">{folio(lead)}</span>
              <h1 className="ex4-display">
                <Link href={`${base}/blog/${lead.slug}`}>
                  <Headline title={lead.title} />
                </Link>
              </h1>
              {lead.excerpt && (
                <p className="ex4-dek">
                  <DekWithMark text={lead.excerpt} id={`home:${lead.slug}`} />
                  <Ex4Caret id={`home:${lead.slug}:caret`} />
                </p>
              )}
              <div className="ex4-lead__note">
                <Ex4Arrow
                  id={`home:${lead.slug}:arrow`}
                  from={[0.95, 0.15]}
                  to={[0.05, 0.85]}
                  className="ex4-lead__arrow"
                />
                <span className="ex4-hand">{PLACEHOLDER.home}</span>
              </div>
              <span className="ex4-meta">
                {dateline(lead.publishedAt, locale)} · {lead.readingTime} min read
              </span>
              <Ex4PenLink id={`home:${lead.slug}:read`} href={`${base}/blog/${lead.slug}`}>
                Read the story →
              </Ex4PenLink>
            </div>
          )}

          {/* The right rail: Latest sits under the lead, so the column is
              filled by content rather than by the photo's height. */}
          <div className="ex4-latest-rail">
            <h2 className="ex4-section-head">
              <Ex4Pilcrow id="home:latest:pilcrow" />
              Latest
            </h2>
            <ol className="ex4-latest">
              {posts.slice(0, 5).map((p) => (
                <li key={p.slug}>
                  <span className="ex4-label">{p.tag}</span>
                  <Link href={`${base}/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="ex4-cell" style={{ gridColumn: 'span 7' }}>
          <h2 className="ex4-section-head">
            <Ex4Pilcrow id="home:contact-sheet:pilcrow" />
            Contact sheet
          </h2>
          <div className="ex4-sheet">
            {sheet.map((ph) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={ph.url} src={ph.url} alt={ph.alt} loading="lazy" />
            ))}
          </div>
        </div>
        <div className="ex4-cell" style={{ gridColumn: 'span 5' }}>
          <h2 className="ex4-section-head">
            <Ex4Pilcrow id="home:seasons:pilcrow" />
            Seasons
          </h2>
          <table className="ex4-seasons">
            <tbody>
              <tr>
                <th scope="row">Season 1</th>
                <td>{lead?.storyChapter?.season?.title ?? '[TBC]'}</td>
                <td className="ex4-label">in progress</td>
              </tr>
              <tr className="is-planned">
                <th scope="row">
                  <Ex4Line id="home:season-2:planned" kind="dashed">
                    Season 2
                  </Ex4Line>
                </th>
                <td>[TBC]</td>
                <td className="ex4-label">planned</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="ex4-break" role="separator">
        <Ex4Pilcrow id="page:break-1" size={1.5} />
      </div>

      {/* ── Article page ───────────────────────────────────────────────── */}
      {lead && (
        <article className="ex4-article" aria-label="Article page preview">
          <span className="ex4-label ex4-proto-tag">Article page</span>
          <header className="ex4-article__head">
            <span className="ex4-label">{folio(lead)}</span>
            <h1 className="ex4-article__title">
              <Headline title={lead.title} />
            </h1>
            {lead.excerpt && <p className="ex4-article__dek">{lead.excerpt}</p>}
            <p className="ex4-meta">
              Ilham Pamungkas · {dateline(lead.publishedAt, locale)} · {lead.readingTime} min
              read
            </p>
          </header>

          {coverSrc && (
            <Ex4Figure
              id={`article:${lead.slug}`}
              src={coverSrc}
              alt={lead.title}
              callouts={PLACEHOLDER.callouts}
              plate={`Plate 01 — ${lead.title}`}
            />
          )}

          <div className="ex4-body">
            {paras.map((t, i) => (
              <div key={i} className="ex4-body__row">
                {i === 0 ? (
                  <Ex4Bracket id={`article:${lead.slug}:bracket`}>
                    <p>{t}</p>
                  </Ex4Bracket>
                ) : (
                  <p>{t}</p>
                )}
                {i === 0 && (
                  <aside className="ex4-sidenote">
                    <span className="ex4-hand">{PLACEHOLDER.sidenote}</span>
                  </aside>
                )}
              </div>
            ))}
            {paras.length === 0 && (
              <p className="ex4-meta">[No body text found for this article in {locale}.]</p>
            )}
          </div>

          <div className="ex4-break" role="separator">
            <Ex4Pilcrow id="article:break" size={1.5} />
          </div>

          <footer className="ex4-article__end">
            <span className="ex4-label">Next</span>
            <Ex4PenLink id={`article:${lead.slug}:next`} href={`${base}/blog`} className="ex4-next">
              Chapter {(lead.storyChapter?.chapterNumber ?? 1) + 1} →
            </Ex4PenLink>
            {/* Move D: the read-back stamp — the logo's "Pam." block pressed
                on like a rubber stamp, then where and when, in the pen. */}
            <span className="ex4-readback">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/pam-block-360.webp"
                width={360}
                height={121}
                alt="Pam."
                className="ex4-readback__stamp"
              />
              <Ex4Mark id={`article:${lead.slug}:readback`} kind="underline">
                <span className="ex4-hand">
                  read back · {PLACEHOLDER.place} ·{' '}
                  {new Date(lead.publishedAt)
                    .toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                    .replace(/\//g, '.')}
                </span>
              </Ex4Mark>
            </span>
          </footer>
        </article>
      )}

      {/* ── Specimen: buttons and the pen's vocabulary (prototype only) ──── */}
      <section className="ex4-spec" aria-label="Buttons and marks specimen">
        <span className="ex4-label ex4-proto-tag">Specimen · buttons and marks</span>
        <div className="ex4-spec__grid">
          <div className="ex4-spec__item">
            <span className="ex4-label">1 · Primary — the printed block, one per screen</span>
            <div className="ex4-spec__row">
              <Ex4BlockButton id="spec:block-1" href={`${base}/newsletter`}>
                Subscribe
              </Ex4BlockButton>
              <Ex4BlockButton id="spec:block-3" href={`${base}/newsletter`} small>
                Subscribe
              </Ex4BlockButton>
            </div>
            <p className="ex4-meta">
              The logo&apos;s material: a hand-cut cobalt block with its print grain, cream serif type.
              Every button has its own cut.
            </p>
          </div>
          <div className="ex4-spec__item">
            <span className="ex4-label">1b · Inputs — the printed form</span>
            <Ex4PrintedForm id="spec:form" prompt="Get the next chapter by email" field="your email" action="Send →" />
            <p className="ex4-meta">A sentence and a line to fill in, like a form on paper. No box.</p>
          </div>
          <div className="ex4-spec__item">
            <span className="ex4-label">2 · Secondary — the pen link</span>
            <div className="ex4-spec__row">
              <Ex4PenLink id="spec:pen-1" href={`${base}/blog`}>
                Read the story →
              </Ex4PenLink>
              <Ex4PenLink id="spec:pen-2" href={`${base}/explore`}>
                Plan this trip →
              </Ex4PenLink>
            </div>
            <p className="ex4-meta">Hover or tab to it: the pen underlines it.</p>
          </div>
          <div className="ex4-spec__item">
            <span className="ex4-label">3 · Quiet — navigation and filters</span>
            <div className="ex4-spec__row">
              <Link href={`${base}/blog`} className="ex4-quiet">
                All stories
              </Link>
              <Link href={`${base}/blog`} className="ex4-quiet is-current">
                Stories
              </Link>
              <Link href={`${base}/blog`} className="ex4-quiet">
                Essays
              </Link>
            </div>
            <p className="ex4-meta">Small caps; the current one carries a soft rule.</p>
          </div>
          <div className="ex4-spec__item">
            <span className="ex4-label">4 · Save — the only control the pen draws</span>
            <div className="ex4-spec__row">
              <Ex4Save id="spec:save" />
            </div>
            <p className="ex4-meta">Click it. For the platform phase; nothing is stored.</p>
          </div>
        </div>


        <div className="ex4-spec__marks">
          <p>
            A phrase that wraps:{' '}
            <Ex4Line id="spec:multiline">
              every line it runs across gets its own stroke, so long Bahasa Indonesia phrases and narrow phones work too
            </Ex4Line>
            .
          </p>
          <p>
            The proofreader&apos;s delete, kept:{' '}
            <Ex4Line id="spec:strike" kind="strike">
              I nearly cut this line
            </Ex4Line>
            <span className="ex4-hand ex4-stet">stet</span>
            .
          </p>
          <p>
            Planned, not yet travelled:{' '}
            <Ex4Line id="spec:dashed" kind="dashed">
              Season 2, wherever it goes
            </Ex4Line>
            .
          </p>
        </div>
      </section>
      </Ex4Sidebar>
    </div>
  )
}
