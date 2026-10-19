'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PenLink } from './Pen'
import { isLocale, t, type Locale } from '@/lib/i18n'

/**
 * The 404 and error pages. Neither receives the route's params, so the
 * language comes from the first URL segment. They sit outside the site frame
 * (an error may come from the frame itself): the logo, a label, one sentence,
 * and the way back.
 */
export function Notice({ kind, detail, onRetry }: { kind: 'notFound' | 'error'; detail?: string; onRetry?: () => void }) {
  const first = usePathname()?.split('/')[1] ?? ''
  const locale: Locale = isLocale(first) ? first : 'en'
  const ui = t(locale).pages
  const base = `/${locale}`

  return (
    <main className="tp-notice">
      <Link href={base} className="tp-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/travel-pam-logo-480.webp"
          srcSet="/brand/travel-pam-logo-480.webp 1x, /brand/travel-pam-logo-960.webp 2x"
          width={480}
          height={231}
          alt="Travel Pam"
        />
      </Link>
      <div className="tp-notice__text">
        <span className="tp-label">{kind === 'notFound' ? ui.notFoundLabel : ui.errorLabel}</span>
        <h1 className="tp-article__title">{kind === 'notFound' ? ui.notFoundTitle : ui.errorTitle}</h1>
        {kind === 'notFound' && <p className="tp-article__dek">{ui.notFoundBody}</p>}
        {detail && <p className="tp-meta">{detail}</p>}
        <div className="tp-notice__actions">
          <PenLink id={`notice:${kind}:home`} href={base}>
            {ui.backHome}
          </PenLink>
          {onRetry && (
            <button type="button" className="tp-quiet tp-notice__retry" onClick={onRetry}>
              {ui.tryAgain}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
