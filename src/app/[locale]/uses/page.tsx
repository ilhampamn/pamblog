import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { SiteFrame } from '@/components/proof/SiteFrame'
import { Pilcrow } from '@/components/proof/Proof'
import { LOCALES, isLocale, t, type Locale } from '@/lib/i18n'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {}
  const isId = params.locale === 'id'
  return {
    title: t(params.locale).pages.usesTitle,
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
// content moves into the CMS. Product names stay as written.
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

/**
 * Uses: a typeset list in one reading column. The affiliate disclosure sits
 * first, as a muted note with a soft rule (no tinted box); each category opens
 * with a pilcrow head, and each item is a ruled row with its link at the end.
 */
export default function UsesPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound()
  const locale = params.locale
  const ui = t(locale).pages
  const categories = usesData[locale] ?? usesData.en ?? []

  return (
    <SiteFrame locale={locale} current="none" path="/uses">
      <article className="tp-article">
        <header className="tp-article__head">
          <h1 className="tp-article__title">{ui.usesTitle}</h1>
          <p className="tp-aside-note">{ui.usesDisclosure}</p>
        </header>

        {categories.map((cat, i) => (
          <section key={cat.label} className="tp-section" aria-labelledby={`uses-${i}`}>
            <h2 id={`uses-${i}`} className="tp-section-head">
              <Pilcrow id={`uses:${i}:pilcrow`} />
              {cat.label}
            </h2>
            <ul className="tp-rows">
              {cat.items.map((item) => (
                <li key={item.slug} className="tp-row">
                  <div className="tp-row__text">
                    <span className="tp-row__title">{item.name}</span>
                    <span className="tp-row__dek">{item.description}</span>
                  </div>
                  <a href={`/go/${item.slug}`} target="_blank" rel="noopener noreferrer sponsored" className="tp-link">
                    {ui.usesSee}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </article>
    </SiteFrame>
  )
}
