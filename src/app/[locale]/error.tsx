'use client'

import { useEffect } from 'react'
import { Notice } from '@/components/proof/Notice'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Page Error]', error.message, error.digest ?? '', error.stack)
  }, [error])

  // The message is shown only in development; in production it can leak internals.
  const detail = process.env.NODE_ENV === 'development' ? error.message : undefined
  return <Notice kind="error" detail={detail} onRetry={reset} />
}
