import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { Arrow } from '@/components/proof/Mark'
import { Caret, Pilcrow } from '@/components/proof/Proof'
import { PenLink } from '@/components/proof/Pen'
import { DekWithWord } from '@/components/proof/Prose'
import { count, dateline, fmt, folio, seasonsOf, tagLabel } from '@/components/proof/content'
import { getPostsByLocale, type Post } from '@/lib/posts.sanity'
import { getCloudinaryImagesByTag, type CloudinaryAsset } from '@/lib/cloudinary'
import { LOCALES, isLocale, t } from '@/lib/i18n'

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

/**
 * The front page (DESIGN.md → Layout): a dateline under the top bar, then a
 * 12-column sheet — lead photo beside the lead story and Latest, the contact
 * sheet beside Seasons. The pen only appears where Ilham wrote a note for the
 * lead story in Sanity.
 */
export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale).proof
  const base = `/${locale}`

  const [posts, photos] = await Promise.all([
    getPostsByLocale(locale).catch(() => [] as Post[]),
    getCloudinaryImagesByTag('blog-gallery').catch(() => [] as CloudinaryAsset[]),
  ])
  const lead = posts.find((p) => p.tag === 'stories' && p.coverImage) ?? posts[0]
  const leadPhoto = lead?.coverImage
    ? { src: lead.coverImage, alt: lead.title }
    : photos[0] && { src: photos[0].url, alt: photos[0].alt }
  const latest = posts.filter((p) => p !== lead).slice(0, 5)
  const seasons = seasonsOf(posts)
  const sheet = photos.slice(0, 6)

  return (
    <SiteFrame locale={locale} current="home">
      <div className="tp-dateline tp-label">
        <span>{fmt(ui.edition, { date: dateline(new Date().toISOString(), locale) })}</span>
        <span>{count(posts.length, ui.storiesOne, ui.storiesCount)}</span>
      </div>

      {!lead ? (
        <p className="tp-meta tp-empty">{ui.noStories}</p>
      ) : (
        <section className="tp-grid" aria-label={ui.home}>
          <div className="tp-cell tp-cell--photo" style={{ gridColumn: 'span 7' }}>
            {leadPhoto && (
              <Link href={`${base}/blog/${lead.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={leadPhoto.src} alt={leadPhoto.alt} className="tp-lead-photo" />
              </Link>
            )}
          </div>

          <div className="tp-cell tp-cell--side tp-lead" style={{ gridColumn: 'span 5' }}>
            <div className="tp-lead__story">
              <span className="tp-label">{folio(lead, locale)}</span>
              <h1 className="tp-display">
                <Link href={`${base}/blog/${lead.slug}`}>{lead.title}</Link>
              </h1>
              {lead.excerpt && (
                <p className="tp-dek">
                  <DekWithWord
                    text={lead.excerpt}
                    word={lead.pen.word}
                    highlight={lead.pen.highlight}
                    id={`home:${lead.slug}`}
                  />
                  {lead.pen.leadNote && <Caret id={`home:${lead.slug}:caret`} />}
                </p>
              )}
              {lead.pen.leadNote && (
                <div className="tp-lead__note">
                  <Arrow
                    id={`home:${lead.slug}:arrow`}
                    from={[0.95, 0.15]}
                    to={[0.05, 0.85]}
                    className="tp-lead__arrow"
                  />
                  <span className="tp-hand">{lead.pen.leadNote}</span>
                </div>
              )}
              <span className="tp-meta">
                {dateline(lead.publishedAt, locale)} · {lead.readingTime} {ui.minRead}
              </span>
              <PenLink id={`home:${lead.slug}:read`} href={`${base}/blog/${lead.slug}`}>
                {ui.readStory}
              </PenLink>
            </div>

            {latest.length > 0 && (
              <div className="tp-latest-rail">
                <h2 className="tp-section-head">
                  <Pilcrow id="home:latest:pilcrow" />
                  {ui.latest}
                </h2>
                <ol className="tp-latest">
                  {latest.map((p) => (
                    <li key={p.slug}>
                      <span className="tp-label">{tagLabel(p.tag, locale)}</span>
                      <Link href={`${base}/blog/${p.slug}`}>{p.title}</Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {sheet.length > 0 && (
            <div className="tp-cell" style={{ gridColumn: seasons.length ? 'span 7' : 'span 12' }}>
              <h2 className="tp-section-head">
                <Pilcrow id="home:gallery:pilcrow" />
                {ui.gallery}
              </h2>
              <Link href={`${base}/gallery`} className="tp-sheet" aria-label={ui.gallery}>
                {sheet.map((ph) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={ph.url} src={ph.url} alt={ph.alt} loading="lazy" />
                ))}
              </Link>
              <PenLink id="home:gallery:all" href={`${base}/gallery`} className="tp-push">
                {ui.allPhotos}
              </PenLink>
            </div>
          )}
          {seasons.length > 0 && (
            <div className={`tp-cell ${sheet.length ? 'tp-cell--side' : ''}`} style={{ gridColumn: sheet.length ? 'span 5' : 'span 12' }}>
              <h2 className="tp-section-head">
                <Pilcrow id="home:seasons:pilcrow" />
                {ui.seasons}
              </h2>
              <p className="tp-section-note">{ui.seasonsNote}</p>
              <table className="tp-seasons">
                <tbody>
                  {seasons.map((s) => (
                    <tr key={s.n}>
                      <th scope="row">{fmt(ui.season, { n: s.n })}</th>
                      <td>
                        {s.title}
                        {s.description && <span className="tp-seasons__about">{s.description}</span>}
                      </td>
                      <td className="tp-label">{count(s.count, ui.chaptersOne, ui.chapters)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PenLink id="home:seasons:all" href={`${base}/blog`} className="tp-push">
                {ui.allStories}
              </PenLink>
            </div>
          )}
        </section>
      )}
    </SiteFrame>
  )
}
