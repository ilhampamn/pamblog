import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { PostBody } from '@/components/PostBody'
import { t, type Locale } from '@/lib/i18n'
import { reader, resolveContent } from '@/lib/reader'
import { renderArticleBody } from '@/lib/markdoc'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  return {
    title: params.locale === 'id' ? 'Tentang' : 'About',
    description:
      params.locale === 'id'
        ? 'Tentang Ilham Pamungkas — fotografer, penulis, pembangun.'
        : 'About Ilham Pamungkas — photographer, writer, builder.',
  }
}

export default async function AboutPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const about = await reader.singletons.about.read()

  // Fallback if CMS content isn't available yet
  if (!about) notFound()

  const isId = locale === 'id'

  // Resolve the correct language body node
  const bodyField = isId ? about.bodyId : about.body
  const { node } = await resolveContent(bodyField)
  const body = renderArticleBody(node, locale)

  const intro = isId ? about.introId : about.intro
  const currentlyLabel = isId ? about.currentlyLabelId : about.currentlyLabel
  const contactLabel = isId ? about.contactLabelId : about.contactLabel
  const contactBody = isId ? about.contactBodyId : about.contactBody

  return (
    <>
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0 px-8 min-h-screen"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        <div className="max-w-[var(--prose-width)] mx-auto">

          {/* Heading */}
          <h1
            className="text-5xl md:text-6xl font-black mb-12 leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {isId ? 'Tentang' : 'About'}
          </h1>

          {/* Intro */}
          <p
            className="text-2xl font-bold mb-10 leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {intro}
          </p>

          {/* Body (Markdoc — editable in CMS) */}
          <PostBody>{body}</PostBody>

          {/* Divider */}
          <div className="my-16 h-px" style={{ backgroundColor: 'var(--color-torn)' }} />

          {/* Currently section */}
          {about.currently.length > 0 && (
            <section className="mb-16">
              <p className="label-stamped mb-6">{currentlyLabel}</p>
              <dl className="space-y-3">
                {about.currently.map((item) => (
                  <div key={item.labelEn} className="flex gap-6">
                    <dt
                      className="w-28 shrink-0 label-stamped"
                      style={{ color: 'var(--color-smudge)' }}
                    >
                      {isId ? item.labelId : item.labelEn}
                    </dt>
                    <dd
                      style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
                    >
                      {isId ? item.valueId : item.valueEn}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Contact */}
          <section className="mb-16">
            <p className="label-stamped mb-3">{contactLabel}</p>
            <p
              className="mb-4"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
            >
              {contactBody}
            </p>
            <a
              href={`mailto:${about.email}`}
              className="label-stamped underline hover:text-[var(--color-ink)] transition-colors"
              style={{ color: 'var(--color-smudge)' }}
            >
              {about.email}
            </a>
          </section>

          {/* Uses link */}
          <div className="mb-16">
            <Link
              href={`/${locale}/uses`}
              className="label-stamped hover:text-[var(--color-ink)] transition-colors"
              style={{ color: 'var(--color-smudge)' }}
            >
              {isId ? 'Lihat perkakas yang saya gunakan →' : 'See the tools I use →'}
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
