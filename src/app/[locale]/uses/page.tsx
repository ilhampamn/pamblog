import { notFound } from 'next/navigation'
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

const usesData: Record<Locale, UsesCategory[]> = {
  en: [
    {
      label: 'Camera & Photography',
      items: [
        {
          name: 'Fujifilm X100VI',
          description:
            'My daily carry. Fixed 35mm-equivalent lens, beautiful JPEG rendering straight out of camera. The best camera for not thinking about gear.',
          slug: 'fujifilm-x100vi',
        },
        {
          name: 'Sony A7 IV',
          description:
            'When I need full-frame. Paired with a 35mm f/1.4 for the majority of serious work. Heavy, but the files are extraordinary.',
          slug: 'sony-a7iv',
        },
        {
          name: 'Peak Design Slide Strap',
          description:
            'I have tried every strap. This is the last one. The quick-release clips are genuinely useful, not a gimmick.',
          slug: 'peak-design-strap',
        },
      ],
    },
    {
      label: 'Hardware',
      items: [
        {
          name: 'MacBook Pro 14" M3 Pro',
          description:
            'Does not get warm editing 4K video. Battery lasts a flight to Tokyo. That is the whole review.',
          slug: 'apple-macbook-pro',
        },
        {
          name: 'CalDigit TS4 Thunderbolt Dock',
          description:
            'One cable in, everything works. Worth every cent of the price.',
          slug: 'caldigit-ts4',
        },
        {
          name: 'Keychron Q1 Pro',
          description:
            'Gasket-mounted, tactile switches, nice weight. I have tried mechanical keyboards at every price point. This is where I stopped.',
          slug: 'keychron-q1',
        },
        {
          name: 'Logitech MX Master 3S',
          description:
            'The horizontal scroll wheel alone justifies it. Side buttons configured for Mission Control and app switcher.',
          slug: 'logitech-mx-master',
        },
      ],
    },
    {
      label: 'Software',
      items: [
        {
          name: 'Arc Browser',
          description:
            'Took a week to adjust to. Now I cannot imagine going back. Spaces for separate contexts, command bar, mini Arc for quick lookups.',
          slug: 'arc-browser',
        },
        {
          name: 'Raycast',
          description:
            'Replaced Spotlight. The clipboard history and window manager are the two features I use every ten minutes.',
          slug: 'raycast',
        },
        {
          name: 'Figma',
          description:
            'Where I design. The auto-layout updates from the last two years made it actually good for responsive thinking, not just visual output.',
          slug: 'figma',
        },
        {
          name: 'Obsidian',
          description:
            'Where I think. Plain markdown files, local first, synced via iCloud. No lock-in. The graph view is mostly decorative but I enjoy looking at it.',
          slug: 'obsidian',
        },
        {
          name: 'Capture One',
          description:
            'Better colour science than Lightroom for Fuji files specifically. The skin tones on Fuji sensors are difficult to handle well — Capture One handles them well.',
          slug: 'capture-one',
        },
      ],
    },
    {
      label: 'Books',
      items: [
        {
          name: 'Thinking in Systems — Donella Meadows',
          description:
            'Changed how I see almost everything. A short book with a very long half-life.',
          slug: 'thinking-in-systems',
        },
        {
          name: 'Show Your Work — Austin Kleon',
          description:
            'The book that convinced me to start writing in public. Read in an afternoon, still applies every day.',
          slug: 'show-your-work',
        },
        {
          name: 'On Photography — Susan Sontag',
          description:
            'Dense and worth it. Makes you think harder about what you are doing when you point a camera at something.',
          slug: 'on-photography',
        },
      ],
    },
  ],
  id: [
    {
      label: 'Kamera & Fotografi',
      items: [
        {
          name: 'Fujifilm X100VI',
          description:
            'Kamera harian saya. Lensa fixed setara 35mm, rendering JPEG yang indah langsung dari kamera. Kamera terbaik untuk tidak memikirkan peralatan.',
          slug: 'fujifilm-x100vi',
        },
        {
          name: 'Sony A7 IV',
          description:
            'Ketika saya membutuhkan full-frame. Dipasangkan dengan 35mm f/1.4 untuk sebagian besar pekerjaan serius. Berat, tapi file-nya luar biasa.',
          slug: 'sony-a7iv',
        },
        {
          name: 'Peak Design Slide Strap',
          description:
            'Saya telah mencoba setiap tali kamera. Ini yang terakhir. Quick-release clips-nya benar-benar berguna, bukan gimmick.',
          slug: 'peak-design-strap',
        },
      ],
    },
    {
      label: 'Perangkat Keras',
      items: [
        {
          name: 'MacBook Pro 14" M3 Pro',
          description:
            'Tidak panas saat mengedit video 4K. Baterainya bertahan sepanjang penerbangan ke Tokyo. Itulah seluruh ulasannya.',
          slug: 'apple-macbook-pro',
        },
        {
          name: 'Keychron Q1 Pro',
          description:
            'Gasket-mounted, tactile switches. Saya sudah mencoba keyboard mekanikal di setiap rentang harga. Di sinilah saya berhenti.',
          slug: 'keychron-q1',
        },
      ],
    },
    {
      label: 'Perangkat Lunak',
      items: [
        {
          name: 'Raycast',
          description:
            'Menggantikan Spotlight. Clipboard history dan window manager adalah dua fitur yang saya gunakan setiap sepuluh menit.',
          slug: 'raycast',
        },
        {
          name: 'Figma',
          description:
            'Tempat saya mendesain. Pembaruan auto-layout dari dua tahun terakhir membuatnya benar-benar bagus untuk berpikir responsif.',
          slug: 'figma',
        },
        {
          name: 'Obsidian',
          description:
            'Tempat saya berpikir. File markdown polos, local first, disinkronkan via iCloud. Tidak ada lock-in.',
          slug: 'obsidian',
        },
        {
          name: 'Capture One',
          description:
            'Color science yang lebih baik dari Lightroom untuk file Fuji. Capture One menangani tone kulit dengan baik.',
          slug: 'capture-one',
        },
      ],
    },
    {
      label: 'Buku',
      items: [
        {
          name: 'Thinking in Systems — Donella Meadows',
          description:
            'Mengubah cara saya melihat hampir segalanya. Buku tipis dengan half-life yang sangat panjang.',
          slug: 'thinking-in-systems',
        },
        {
          name: 'On Photography — Susan Sontag',
          description:
            'Padat dan layak dibaca. Membuat Anda berpikir lebih keras tentang apa yang Anda lakukan ketika mengarahkan kamera ke sesuatu.',
          slug: 'on-photography',
        },
      ],
    },
  ],
}

export default function UsesPage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const ui = t(locale)
  const categories = usesData[locale]
  const isId = locale === 'id'

  return (
    <div className="page-shell">
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0 px-8 min-h-screen"
        style={{ backgroundColor: 'var(--color-paper)' }}
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
