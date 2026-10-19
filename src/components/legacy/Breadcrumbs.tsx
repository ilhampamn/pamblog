import Link from 'next/link'

export interface Crumb {
  label: string
  href?: string
}

/**
 * Breadcrumb trail for the nested Explore routes. The chain is rebuilt at
 * build time from the place relationships (see src/lib/places.ts), so these
 * always reflect a real Country → City → Destination path.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span className="label-stamped" style={{ color: last ? 'var(--color-ink)' : 'var(--color-smudge)' }}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
