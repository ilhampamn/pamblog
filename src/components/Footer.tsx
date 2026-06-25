import Link from 'next/link'
import type { Locale } from '@/lib/i18n'

export function Footer({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear()

  return (
    <footer
      className="mt-32 py-16 px-8"
      style={{ backgroundColor: 'var(--color-night)', color: 'var(--color-ink)' }}
    >
      <div className="max-w-[var(--layout-width)] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* ASCII plant */}
          <pre
            className="text-xs leading-tight shrink-0 self-start"
            aria-hidden="true"
            style={{ color: 'var(--color-smudge)', fontFamily: 'var(--font-mono)' }}
          >
{`    )
   /|\\
  / | \\
 /  |  \\
    |
   /|\\
  / | \\
 /  |  \\
~~~~|~~~~`}
          </pre>

          {/* Links + quote */}
          <div className="flex flex-col gap-8">
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {[
                { href: `/${locale}/blog`, label: locale === 'id' ? 'Tulisan' : 'Writing' },
                { href: `/${locale}/about`, label: locale === 'id' ? 'Tentang' : 'About' },
                { href: `/${locale}/uses`, label: locale === 'id' ? 'Perkakas' : 'Uses' },
                { href: `/${locale}/newsletter`, label: 'Newsletter' },
                { href: '/rss.xml', label: 'RSS' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="label-stamped hover:text-[var(--color-ghost)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  {label}
                </Link>
              ))}
            </nav>

            <p
              className="text-sm italic max-w-sm"
              style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
            >
              &ldquo;The camera is an instrument that teaches people how to see without a camera.&rdquo;
              <span className="block mt-1 not-italic label-stamped">— Dorothea Lange</span>
            </p>

            <p className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
              © {year} Ilham Pamungkas
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
