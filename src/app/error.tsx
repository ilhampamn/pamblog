'use client'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.group('%c[Global Error]', 'color: #C4785A; font-weight: bold;')
    console.error('Message:', error.message)
    console.error('Digest:', error.digest)
    console.error('Stack:', error.stack)
    console.groupEnd()
  }, [error])

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <p style={{ color: '#C4785A' }}>[Error] {error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
