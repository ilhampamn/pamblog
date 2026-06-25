'use client'
import { useEffect } from 'react'
import Link from 'next/link'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.group('%c[Page Error]', 'color: #C4785A; font-weight: bold;')
    console.error('Message :', error.message)
    console.error('Digest  :', error.digest)
    console.error('Stack   :\n' + error.stack)
    console.groupEnd()
  }, [error])

  return (
    <main style={{
      minHeight: '100svh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '4rem 2rem',
      backgroundColor: 'var(--color-paper)',
    }}>
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--color-blush)',
        marginBottom: '1rem',
      }}>
        Error
      </p>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        color: 'var(--color-ink)',
        marginBottom: '1rem',
      }}>
        Something went wrong.
      </h1>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        color: 'var(--color-smudge)',
        marginBottom: '2rem',
        maxWidth: '600px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>
        {error.message}
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button
          onClick={reset}
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-paper)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-smudge)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
