import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { PrintedForm } from '@/components/proof/PrintedForm'
import { LOCALES, isLocale, t } from '@/lib/i18n'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {}
  const ui = t(params.locale)
  return { title: ui.proof.newsletter, description: ui.pages.newsletterSub }
}

/**
 * Newsletter: what it is in three short paragraphs, what you'll get as a
 * ruled list, then the printed form — the sentence and a line to fill in.
 * The top bar's Subscribe button leads here.
 */
export default function NewsletterPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale)

  return (
    <SiteFrame locale={locale} current="none" path="/newsletter">
      <article className="tp-article">
        <header className="tp-article__head">
          <h1 className="tp-article__title">{ui.proof.newsletter}</h1>
          <p className="tp-article__dek">{ui.pages.newsletterSub}</p>
        </header>

        <div className="tp-body tp-measure">
          {ui.pages.newsletterBody.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <section className="tp-section" aria-labelledby="newsletter-expect">
          <h2 id="newsletter-expect" className="tp-section-head">
            {ui.pages.newsletterExpect}
          </h2>
          <ul className="tp-rows">
            {ui.pages.newsletterItems.map((item) => (
              <li key={item} className="tp-row">
                <span className="tp-row__title">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="tp-article__subscribe">
          <PrintedForm
            id="newsletter:form"
            prompt={ui.proof.newsletterPrompt}
            field={ui.proof.emailField}
            action={ui.proof.send}
          />
        </div>
      </article>
    </SiteFrame>
  )
}
