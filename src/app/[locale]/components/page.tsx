import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { Arrow, Mark } from '@/components/proof/Mark'
import { Caret, Pilcrow } from '@/components/proof/Proof'
import { Bracket, Line, PenLink, Save } from '@/components/proof/Pen'
import { BlockButton } from '@/components/proof/BlockButton'
import { PrintedForm } from '@/components/proof/PrintedForm'
import { Figure } from '@/components/proof/Figure'
import { getCloudinaryImagesByTag, type CloudinaryAsset } from '@/lib/cloudinary'
import { LOCALES, isLocale } from '@/lib/i18n'

export const revalidate = 300

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Components',
  robots: { index: false, follow: false },
}

/**
 * Internal specimen of the read-back proof library (`src/components/proof/`),
 * the live counterpart of DESIGN.md → Components. Not linked from the site and
 * not indexed. The sample notes here are labelled as samples; on real pages
 * every note is written by Ilham in Sanity.
 */
export default async function ComponentsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const base = `/${locale}`
  const photo = (await getCloudinaryImagesByTag('blog-gallery').catch(() => [] as CloudinaryAsset[]))[0]

  return (
    <SiteFrame locale={locale} current="none" path="/components">
      <article className="tp-article tp-spec">
        <header className="tp-article__head">
          <span className="tp-label">Internal · not indexed</span>
          <h1 className="tp-article__title">Components</h1>
          <p className="tp-article__dek">
            Every part of the read-back proof, as built. Values and rules are in DESIGN.md.
          </p>
        </header>

        <section className="tp-section">
          <h2 className="tp-section-head">Buttons and inputs</h2>
          <div className="tp-spec__row">
            <BlockButton id="spec:block" href={`${base}/newsletter`}>
              Subscribe
            </BlockButton>
            <BlockButton id="spec:block-small" href={`${base}/newsletter`} small>
              Subscribe
            </BlockButton>
          </div>
          <p className="tp-meta">Printed block, the primary action. One per screen; the small one is the top bar&apos;s.</p>
          <PrintedForm id="spec:form" prompt="Get the next chapter by email" field="your email" action="Send →" />
          <p className="tp-meta">Printed form: a sentence and a line to fill in.</p>
          <div className="tp-spec__row">
            <PenLink id="spec:pen" href={`${base}/blog`}>
              Read the story →
            </PenLink>
            <Link href={`${base}/blog`} className="tp-quiet">
              Quiet link
            </Link>
            <Link href={`${base}/blog`} className="tp-quiet is-current">
              Current
            </Link>
            <Save id="spec:save" />
          </div>
          <p className="tp-meta">Pen link (hover it), quiet links, and Save (platform phase; nothing is stored).</p>
        </section>

        <section className="tp-section">
          <h2 className="tp-section-head">
            <Pilcrow id="spec:pilcrow" />
            Marks
          </h2>
          <div className="tp-body tp-measure">
            <p>
              A <Mark id="spec:circle" kind="circle">circled</Mark> word, an{' '}
              <Mark id="spec:underline" kind="underline">underlined phrase</Mark>, and a caret for an
              insertion
              <Caret id="spec:caret" />.
            </p>
            <p>
              A phrase that wraps:{' '}
              <Line id="spec:multiline">
                every line it runs across gets its own stroke, so long Indonesian phrases and narrow
                phones work too
              </Line>
              .
            </p>
            <p>
              The proofreader&apos;s delete:{' '}
              <Line id="spec:strike" kind="strike">
                a line I nearly cut
              </Line>{' '}
              and planned, not yet travelled:{' '}
              <Line id="spec:dashed" kind="dashed">
                Season 2
              </Line>
              .
            </p>
          </div>
          <div className="tp-body__row">
            <Bracket id="spec:bracket" className="tp-body__text">
              <div className="tp-body">
                <p>A bracket beside a whole paragraph, with a margin note beside it. On narrow screens the note drops under the paragraph.</p>
              </div>
            </Bracket>
            <aside className="tp-sidenote">
              <span className="tp-hand">sample margin note</span>
            </aside>
          </div>
          <div className="tp-spec__arrow">
            <Arrow id="spec:arrow" from={[0.95, 0.15]} to={[0.05, 0.85]} className="tp-lead__arrow" />
            <span className="tp-hand">a single-gesture pointer</span>
          </div>
        </section>

        {photo && (
          <section className="tp-section">
            <h2 className="tp-section-head">Figure</h2>
            <Figure
              id="spec:figure"
              src={photo.url}
              alt={photo.alt}
              plate="Sample plate"
              callouts={[
                { x: 0.3, y: 0.55, note: 'sample note 1' },
                { x: 0.7, y: 0.35, note: 'sample note 2' },
              ]}
            />
          </section>
        )}
      </article>
    </SiteFrame>
  )
}
