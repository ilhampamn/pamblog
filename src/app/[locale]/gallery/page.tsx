import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return {
    title: params.locale === 'id' ? 'Galeri' : 'Gallery',
  }
}

export default function GalleryPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()
  const ui = t(locale)

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />
      <main className="pt-32 pb-16 px-8" style={{ backgroundColor: 'var(--color-paper)' }}>
        <div className="max-w-[var(--layout-width)] mx-auto">
          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-4"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {locale === 'id' ? 'Galeri' : 'Gallery'}
          </h1>
          <p
            className="text-lg mb-16"
            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
          >
            {locale === 'id' ? 'Foto-foto dari perjalanan dan keseharian.' : 'Photos from travels and everyday life.'}
          </p>

          {/* Placeholder grid — replace with real photos */}
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '16/9' : '1/1',
                  backgroundColor: 'var(--color-ghost)',
                  border: '1px solid var(--color-torn)',
                  borderRadius: 'var(--radius-card)',
                }}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  )
}
