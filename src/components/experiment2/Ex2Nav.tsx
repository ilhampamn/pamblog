'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/lib/i18n'
import styles from './Ex2Nav.module.css'

export interface Ex2NavItem {
  /** Path segment after the locale. Use an empty string for the site home. */
  href: string
  label: string
  icon: 'home' | 'write' | 'smiley' | 'book'
}

/**
 * Floating hand-drawn nav for /experiment-2.
 *
 * Must be a client component: "which item is active" depends on the current
 * route, and the page that renders this nav is an async Server Component with
 * no access to the pathname. The previous version hardcoded Home as active
 * regardless of what page you were actually on.
 *
 * Only the active item shows its label + a pill background — the other three
 * stay icon-only, per the reference (compare the two reference screenshots:
 * the pill and label follow the current page, the other icons stay bare).
 */
export function Ex2Nav({ locale, items }: { locale: Locale; items: Ex2NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className={styles.nav} aria-label="Primary">
      {/* The pill artwork sits in its own element rather than being a
          background on the <nav>, so its drop-shadow applies only to the
          artwork. `filter` on the <nav> would inherit down to the icons and
          label and shadow those too.
          It stretches to the box because the SVG carries
          preserveAspectRatio="none" — without that it scales uniformly and
          centres itself, painting narrower than the row of icons. */}
      <Image
        src="/experiment2/nav-shape.svg"
        alt=""
        fill
        sizes="420px"
        className={styles.background}
      />
      {items.map((item) => {
        const href = `/${locale}${item.href}`
        // Nested routes count too (e.g. /blog/some-post still lights up
        // Writing), so this is startsWith rather than an exact match.
        const active =
          pathname === href ||
          (item.href !== '' && pathname.startsWith(`${href}/`))

        return (
          <Link
            key={item.href}
            href={href}
            className={styles.item}
            data-active={active || undefined}
            aria-current={active ? 'page' : undefined}
          >
            <Image
              src={`/experiment2/icons/${item.icon}.png`}
              alt=""
              width={30}
              height={30}
              className={styles.icon}
            />
            <span className={active ? undefined : 'sr-only'}>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
