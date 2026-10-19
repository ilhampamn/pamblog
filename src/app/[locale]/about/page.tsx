import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { Pilcrow } from '@/components/proof/Proof'
import { PenLink } from '@/components/proof/Pen'
import { ArticleBody } from '@/components/proof/Prose'
import { getAbout } from '@/lib/about.sanity'
import { LOCALES, isLocale, t } from '@/lib/i18n'

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {}
  const about = await getAbout(params.locale).catch(() => null)
  return { title: t(params.locale).proof.about, description: about?.intro || undefined }
}

/**
 * About: one reading column, set like the article — title, the intro as the
 * dek, the body from Sanity, then "Currently" as a ruled list and the contact
 * line. Pilcrows open the two sections (the proofreader's new paragraph).
 */
export default async function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale)
  const base = `/${locale}`

  const about = await getAbout(locale)
  if (!about) notFound()

  return (
    <SiteFrame locale={locale} current="about" path="/about">
      <article className="tp-article">
        <header className="tp-article__head">
          <h1 className="tp-article__title">{ui.proof.about}</h1>
          {about.intro && <p className="tp-article__dek">{about.intro}</p>}
        </header>

        <ArticleBody blocks={about.body} notes={[]} locale={locale} id="about" />

        {about.currently.length > 0 && (
          <section className="tp-section" aria-labelledby="about-currently">
            <h2 id="about-currently" className="tp-section-head">
              <Pilcrow id="about:currently:pilcrow" />
              {about.currentlyLabel || ui.pages.currently}
            </h2>
            <dl className="tp-facts">
              {about.currently.map((item, i) => (
                <div key={item.label || i}>
                  <dt className="tp-label">{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="tp-section" aria-labelledby="about-contact">
          <h2 id="about-contact" className="tp-section-head">
            <Pilcrow id="about:contact:pilcrow" />
            {about.contactLabel || ui.pages.contact}
          </h2>
          {about.contactBody && <p className="tp-section__text">{about.contactBody}</p>}
          {about.email && (
            <a href={`mailto:${about.email}`} className="tp-link tp-section__text">
              {about.email}
            </a>
          )}
        </section>

        <div className="tp-section">
          <PenLink id="about:uses" href={`${base}/uses`}>
            {ui.pages.seeUses}
          </PenLink>
        </div>
      </article>
    </SiteFrame>
  )
}
