import Image from 'next/image'
import Link from 'next/link'
import type { CloudinaryAsset } from '@/lib/cloudinary'
import type { Locale } from '@/lib/i18n'

interface GalleryCardProps {
  asset: CloudinaryAsset
  locale: Locale
  relatedStory?: {
    slug: string
    title: string
  }
}

const COPY = {
  en: { related: 'Read the related story' },
  id: { related: 'Baca tulisan terkait' },
  zh: { related: '阅读相关文章' },
} as const

function formatTakenAt(value: string, locale: Locale) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function GalleryCard({ asset, locale, relatedStory }: GalleryCardProps) {
  const details = [
    asset.location,
    asset.takenAt ? formatTakenAt(asset.takenAt, locale) : undefined,
    `${asset.width} × ${asset.height}`,
  ].filter((detail): detail is string => Boolean(detail))

  return (
    <figure
      tabIndex={0}
      aria-label={asset.title}
      className="group relative isolate mb-4 break-inside-avoid overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)] focus-visible:ring-offset-2"
      style={{
        backgroundColor: 'var(--color-ghost)',
        border: '1px solid var(--color-torn)',
        borderRadius: 'var(--radius-card)',
      }}
    >
      <Image
        src={asset.url}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        sizes="(max-width: 640px) calc(100vw - 4rem), (max-width: 1024px) 50vw, 33vw"
        className="block h-auto w-full transition-transform duration-500 ease-out md:group-hover:scale-[1.025] md:group-focus-within:scale-[1.025]"
      />

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent px-5 pb-5 pt-24 text-white opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <figcaption>
          <p className="text-lg font-bold leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {asset.title}
          </p>
          {asset.caption && asset.caption !== asset.title ? (
            <p className="mt-1 text-sm leading-relaxed text-white/80">
              {asset.caption}
            </p>
          ) : null}
        </figcaption>

        <ul
          className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[0.65rem] uppercase tracking-[0.12em] text-white/65"
          aria-label="Photo metadata"
        >
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>

        {relatedStory ? (
          <Link
            href={`/${locale}/blog/${relatedStory.slug}`}
            className="mt-4 flex w-full items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 text-black no-underline transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span>
              <span className="block text-[0.6rem] font-bold uppercase tracking-[0.12em] text-black/55">
                {COPY[locale].related}
              </span>
              <span className="mt-0.5 block text-sm font-bold leading-snug">
                {relatedStory.title}
              </span>
            </span>
            <span className="shrink-0 text-lg" aria-hidden>→</span>
          </Link>
        ) : null}
      </div>
    </figure>
  )
}
