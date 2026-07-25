import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { t, type Locale } from '@/lib/i18n'

const LOCALES = ['en', 'id', 'zh'] as const

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const isId = params.locale === 'id'
  return {
    title: isId ? 'Perkakas' : 'Uses — My Setup & Tools',
    description: isId
      ? 'Peralatan, aplikasi, dan langganan yang benar-benar saya gunakan.'
      : 'The gear, software, and subscriptions I actually use — with honest takes.',
  }
}

interface UsesItem {
  name: string
  description: string
  slug: string
}

interface UsesCategory {
  label: string
  items: UsesItem[]
}

// en/id authored here; zh (and any future locale) falls back to en until this
// content moves into the CMS.
const usesData: Partial<Record<Locale, UsesCategory[]>> = {
  en: [
    {
      label: 'Camera',
      items: [
        {
          name: 'Lumix S9',
          description: 'Compact full-frame camera for travel photography and video.',
          slug: 'lumix-s9',
        },
        {
          name: 'Fujifilm X-T3',
          description: 'Mirrorless camera for still photography and everyday shooting.',
          slug: 'fujifilm-x-t3',
        },
        {
          name: 'DJI Action 6',
          description: 'Action camera for travel, movement, and compact video recording.',
          slug: 'dji-action-6',
        },
      ],
    },
    {
      label: 'Hardware',
      items: [
        {
          name: 'MacBook Pro 16-inch M2 Pro',
          description: 'Laptop for design, development, photography, and video work.',
          slug: 'macbook-pro-16-m2-pro',
        },
        {
          name: 'Legion Pro 7i',
          description: 'Windows workstation for demanding creative and technical tasks.',
          slug: 'legion-pro-7i',
        },
      ],
    },
    {
      label: 'Software',
      items: [
        {
          name: 'Figma',
          description: 'Interface design, prototyping, and visual collaboration.',
          slug: 'figma',
        },
        {
          name: 'CapCut',
          description: 'Fast editing for short-form and travel video.',
          slug: 'capcut',
        },
        {
          name: 'Visual Studio Code',
          description: 'Code editor for building and maintaining web projects.',
          slug: 'visual-studio-code',
        },
      ],
    },
    {
      label: 'Books',
      items: [
        {
          name: 'Thinking in Systems',
          description: 'A practical introduction to seeing structures, feedback, and change.',
          slug: 'thinking-in-systems',
        },
        {
          name: 'Happiness by Design',
          description: 'A book about shaping everyday life around attention and happiness.',
          slug: 'happiness-by-design',
        },
        {
          name: 'The Great Mental Models series',
          description: 'A series of frameworks for clearer thinking and better decisions.',
          slug: 'the-great-mental-models',
        },
      ],
    },
  ],
  id: [
    {
      label: 'Kamera',
      items: [
        {
          name: 'Lumix S9',
          description: 'Kamera full-frame ringkas untuk fotografi perjalanan dan video.',
          slug: 'lumix-s9',
        },
        {
          name: 'Fujifilm X-T3',
          description: 'Kamera mirrorless untuk fotografi dan pemotretan sehari-hari.',
          slug: 'fujifilm-x-t3',
        },
        {
          name: 'DJI Action 6',
          description: 'Kamera aksi untuk perjalanan, aktivitas, dan perekaman video ringkas.',
          slug: 'dji-action-6',
        },
      ],
    },
    {
      label: 'Perangkat Keras',
      items: [
        {
          name: 'MacBook Pro 16-inch M2 Pro',
          description: 'Laptop untuk desain, pengembangan, fotografi, dan pekerjaan video.',
          slug: 'macbook-pro-16-m2-pro',
        },
        {
          name: 'Legion Pro 7i',
          description: 'Workstation Windows untuk pekerjaan kreatif dan teknis yang berat.',
          slug: 'legion-pro-7i',
        },
      ],
    },
    {
      label: 'Perangkat Lunak',
      items: [
        {
          name: 'Figma',
          description: 'Desain antarmuka, prototipe, dan kolaborasi visual.',
          slug: 'figma',
        },
        {
          name: 'CapCut',
          description: 'Penyuntingan cepat untuk video pendek dan perjalanan.',
          slug: 'capcut',
        },
        {
          name: 'Visual Studio Code',
          description: 'Editor kode untuk membangun dan memelihara proyek web.',
          slug: 'visual-studio-code',
        },
      ],
    },
    {
      label: 'Buku',
      items: [
        {
          name: 'Thinking in Systems',
          description: 'Pengantar praktis untuk memahami struktur, umpan balik, dan perubahan.',
          slug: 'thinking-in-systems',
        },
        {
          name: 'Happiness by Design',
          description: 'Buku tentang membentuk keseharian melalui perhatian dan kebahagiaan.',
          slug: 'happiness-by-design',
        },
        {
          name: 'The Great Mental Models series',
          description: 'Seri kerangka berpikir untuk keputusan yang lebih jernih dan baik.',
          slug: 'the-great-mental-models',
        },
      ],
    },
  ],
}

export default function UsesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const categories = usesData[locale] ?? usesData.en ?? []
  const isId = locale === 'id'

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0 px-8 min-h-screen"
       
      >
        <div className="max-w-[var(--prose-width)] mx-auto">

          {/* Page heading */}
          <h1
            className="text-5xl md:text-6xl font-black mb-6 leading-none"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
          >
            {isId ? 'Perkakas' : 'Uses'}
          </h1>

          {/* Affiliate disclosure */}
          <div
            className="mb-12 p-4 border-l-2"
            style={{ borderColor: 'var(--color-blush)', backgroundColor: 'var(--color-ghost)' }}
          >
            <p
              className="text-sm"
              style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-smudge)' }}
            >
              {isId
                ? 'Beberapa tautan di halaman ini adalah tautan afiliasi. Jika Anda membeli sesuatu melalui tautan ini, saya mendapatkan komisi kecil tanpa biaya tambahan untuk Anda. Saya hanya mencantumkan hal-hal yang benar-benar saya gunakan.'
                : 'Some links on this page are affiliate links. If you buy something through them, I earn a small commission at no extra cost to you. I only list things I actually use.'}
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-20">
            {categories.map((cat) => (
              <section key={cat.label}>
                <p
                  className="label-stamped mb-8"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  {cat.label}
                </p>

                <ul className="divide-y" style={{ borderColor: 'var(--color-torn)' }}>
                  {cat.items.map((item) => (
                    <li key={item.slug} className="py-6">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-8">
                        <div className="flex-1">
                          <h2
                            className="font-bold text-base mb-2"
                            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
                          >
                            {item.name}
                          </h2>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}
                          >
                            {item.description}
                          </p>
                        </div>
                        <a
                          href={`/go/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="label-stamped shrink-0 underline hover:text-[var(--color-ink)] transition-colors mt-1"
                          style={{ color: 'var(--color-smudge)' }}
                        >
                          {isId ? 'Lihat →' : 'See →'}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale} />
    </div>
  )
}
