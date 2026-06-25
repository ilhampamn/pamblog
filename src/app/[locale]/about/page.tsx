import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
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
    title: params.locale === 'id' ? 'Tentang' : 'About',
    description:
      params.locale === 'id'
        ? 'Tentang Ilham Pamungkas — fotografer, penulis, pembangun.'
        : 'About Ilham Pamungkas — photographer, writer, builder.',
  }
}

const content = {
  en: {
    heading: 'About',
    intro: `I'm Ilham. I'm based in Indonesia.`,
    body: [
      `I take photographs, write about things I find interesting, and occasionally build tools to scratch my own itch. This blog is where those three things overlap.`,
      `Photography came first. I started seriously around 2018 with a beat-up Olympus I found at a flea market. Film followed a few years later — slower, more deliberate, more expensive. The constraints turned out to be the point.`,
      `The writing started as notes to myself. Things I was figuring out, half-formed ideas I wanted to return to. At some point I decided to leave the door unlocked. Not because I think I have answers, but because thinking out loud is how I think at all.`,
      `Professionally, I work at the intersection of product and design. I care about interfaces that feel considered, systems that hold up under edge cases, and the small decisions that make the difference between something that works and something that's a pleasure to use.`,
      `If something here resonated with you — or if you think I'm wrong about something — I'd be glad to hear from you.`,
    ],
    currentlySection: 'Right now',
    currently: [
      { label: 'Reading', value: 'Thinking in Systems — Donella Meadows' },
      { label: 'Shooting', value: 'Fujifilm X100VI, Kodak Portra 400' },
      { label: 'Building', value: 'This blog' },
      { label: 'Listening', value: 'Whatever Spotify decides is ambient' },
    ],
    contact: 'Get in touch',
    contactBody: 'The best way to reach me is by email.',
  },
  id: {
    heading: 'Tentang',
    intro: `Saya Ilham. Tinggal di Indonesia.`,
    body: [
      `Saya memotret, menulis tentang hal-hal yang saya anggap menarik, dan sesekali membangun alat untuk kebutuhan sendiri. Blog ini adalah tempat di mana ketiga hal itu bertemu.`,
      `Fotografi datang lebih dulu. Saya mulai serius sekitar 2018 dengan Olympus butut yang saya temukan di pasar loak. Film menyusul beberapa tahun kemudian — lebih lambat, lebih deliberate, lebih mahal. Keterbatasannya ternyata justru menjadi intinya.`,
      `Tulisan dimulai sebagai catatan untuk diri sendiri. Hal-hal yang sedang saya coba pahami, ide-ide setengah jadi yang ingin saya kembali lagi. Pada suatu titik saya memutuskan untuk membiarkan pintunya tidak terkunci. Bukan karena saya pikir saya punya jawaban, tetapi karena berpikir dengan keras adalah cara saya berpikir sama sekali.`,
      `Secara profesional, saya bekerja di persimpangan produk dan desain. Saya peduli pada antarmuka yang terasa dipertimbangkan, sistem yang bertahan di bawah edge case, dan keputusan-keputusan kecil yang membuat perbedaan antara sesuatu yang bekerja dan sesuatu yang menyenangkan digunakan.`,
    ],
    currentlySection: 'Saat ini',
    currently: [
      { label: 'Membaca', value: 'Thinking in Systems — Donella Meadows' },
      { label: 'Memotret', value: 'Fujifilm X100VI, Kodak Portra 400' },
      { label: 'Membangun', value: 'Blog ini' },
      { label: 'Mendengarkan', value: 'Apapun yang diputuskan Spotify' },
    ],
    contact: 'Hubungi saya',
    contactBody: 'Cara terbaik untuk menghubungi saya adalah lewat email.',
  },
}

export default function AboutPage({ params }: { params: { locale: string } }) {
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
            className="text-5xl md:text-6xl font-black mb-12 leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {c.heading}
          </h1>

          {/* Intro */}
          <p
            className="text-2xl font-bold mb-10 leading-snug"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {c.intro}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-6">
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

          {/* Divider */}
          <div className="my-16 h-px" style={{ backgroundColor: 'var(--color-torn)' }} />

          {/* Currently section */}
          <section className="mb-16">
            <p className="label-stamped mb-6">{c.currentlySection}</p>
            <dl className="space-y-3">
              {c.currently.map(({ label, value }) => (
                <div key={label} className="flex gap-6">
                  <dt
                    className="w-28 shrink-0 label-stamped"
                    style={{ color: 'var(--color-smudge)' }}
                  >
                    {label}
                  </dt>
                  <dd
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Contact */}
          <section className="mb-16">
            <p className="label-stamped mb-3">{c.contact}</p>
            <p
              className="mb-4"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
            >
              {c.contactBody}
            </p>
            <a
              href="mailto:ilham.pamungkas@codapayments.com"
              className="label-stamped underline hover:text-[var(--color-ink)] transition-colors"
              style={{ color: 'var(--color-smudge)' }}
            >
              ilham.pamungkas@codapayments.com
            </a>
          </section>

          {/* Uses link */}
          <div className="mb-16">
            <Link
              href={`/${locale}/uses`}
              className="label-stamped hover:text-[var(--color-ink)] transition-colors"
              style={{ color: 'var(--color-smudge)' }}
            >
              {locale === 'id' ? 'Lihat perkakas yang saya gunakan →' : 'See the tools I use →'}
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </>
  )
}
