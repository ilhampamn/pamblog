import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { NewsletterWidget } from '@/components/NewsletterWidget'
import { t, type Locale } from '@/lib/i18n'

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
    title: 'Newsletter',
    description:
      params.locale === 'id'
        ? 'Tulisan baru langsung ke inbox kamu. Tidak ada spam.'
        : 'New posts straight to your inbox. No spam.',
  }
}

const content = {
  en: {
    heading: 'Newsletter',
    subheading: 'New posts in your inbox.',
    body: [
      'When I publish something new — an essay, a note, a tutorial — it goes here first.',
      'No algorithmic feed. No notifications. Just a quiet email when there is something worth reading.',
      'Roughly once or twice a month. Unsubscribe any time.',
    ],
    whatToExpect: "What you'll get",
    expectations: [
      'New posts — essays, notes, reviews, tutorials',
      'Occasional short observations that do not make it to the blog',
      'Nothing else',
    ],
  },
  id: {
    heading: 'Newsletter',
    subheading: 'Tulisan baru langsung ke inbox kamu.',
    body: [
      'Ketika saya menerbitkan sesuatu yang baru — esai, catatan, tutorial — itu masuk ke sini dulu.',
      'Tidak ada algoritma. Tidak ada notifikasi. Hanya email yang tenang ketika ada sesuatu yang layak dibaca.',
      'Kira-kira satu atau dua kali sebulan. Berhenti langganan kapan saja.',
    ],
    whatToExpect: 'Apa yang akan kamu dapatkan',
    expectations: [
      'Tulisan baru — esai, catatan, ulasan, tutorial',
      'Sesekali observasi singkat yang tidak masuk ke blog',
      'Tidak ada yang lain',
    ],
  },
}

export default function NewsletterPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const c = content[locale]

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
            className="text-5xl md:text-6xl font-black mb-4 leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {c.heading}
          </h1>
          <p
            className="text-2xl font-bold mb-12 leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-smudge)' }}
          >
            {c.subheading}
          </p>

          {/* Body */}
          <div className="space-y-5 mb-12">
            {c.body.map((para, i) => (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-body)',
                  lineHeight: 'var(--leading-body)',
                  color: 'var(--color-ink)',
                }}
              >
                {para}
              </p>
            ))}
          </div>

          {/* What you'll get */}
          <div className="mb-12">
            <p className="label-stamped mb-4">{c.whatToExpect}</p>
            <ul className="space-y-2">
              {c.expectations.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3"
                  style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
                >
                  <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="mb-10 h-px" style={{ backgroundColor: 'var(--color-torn)' }} />

          {/* Signup widget */}
          <div className="max-w-md">
            <NewsletterWidget
              cta={ui.newsletter.cta}
              placeholder={ui.newsletter.placeholder}
              button={ui.newsletter.button}
              variant="card"
            />
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
