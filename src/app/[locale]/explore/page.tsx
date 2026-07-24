import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id', 'zh'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const ui = t(params.locale as Locale)
  return { title: ui.explore.title, description: ui.explore.intro }
}

export default function ExploreHub({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  const sections = [
    {
      href: `/${locale}/explore/destinations`,
      title: ui.explore.destinations,
      desc: ui.explore.destinationsDesc,
      image: 'https://picsum.photos/seed/bookpamn-destinations/800/500',
    },
    {
      href: `/${locale}/explore/itineraries`,
      title: ui.explore.itineraries,
      desc: ui.explore.itinerariesDesc,
      image: 'https://picsum.photos/seed/bookpamn-itineraries/800/500',
    },
    {
      href: `/${locale}/explore/stories`,
      title: ui.explore.stories,
      desc: ui.explore.storiesDesc,
      image: 'https://picsum.photos/seed/bookpamn-stories/800/500',
    },
  ]

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-0 px-4 md:px-8">
        <div className="max-w-[var(--layout-width)] mx-auto">
          <h1
            className="text-4xl md:text-5xl font-black leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {ui.explore.title}
          </h1>
          <p className="mt-4 text-lg" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}>
            {ui.explore.intro}
          </p>

          <div
            className="mt-12 grid grid-cols-1 gap-px border sm:grid-cols-3"
            style={{
              borderColor: 'var(--color-ink)',
              backgroundColor: 'var(--color-ink)',
            }}
          >
            {sections.map((s, index) => (
              <Link
                key={s.href}
                href={s.href}
                className="group block p-5 md:p-8"
                style={{
                  backgroundColor: 'var(--color-paper)',
                  textDecoration: 'none',
                }}
              >
                <div
                  className="mb-7 flex items-center justify-between text-sm uppercase tracking-[0.08em] md:text-base"
                  style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-ink)' }}
                >
                  <span>{ui.explore.title}</span>
                  <span>{String(index + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</span>
                </div>

                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(max-width: 639px) calc(100vw - 72px), (max-width: 1199px) 30vw, 340px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>

                <div className="pt-7 pb-2">
                  <h2
                    className="inline text-xl font-bold leading-snug"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                  >
                    {s.title} —{' '}
                  </h2>
                  <p
                    className="inline text-lg leading-snug"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
                  >
                    {s.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
