'use client'
import { useState } from 'react'

interface NewsletterWidgetProps {
  cta: string
  placeholder: string
  button: string
  variant?: 'inline' | 'card'
}

export function NewsletterWidget({ cta, placeholder, button, variant = 'inline' }: NewsletterWidgetProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    // TODO: wire to Resend / Kit API route
    await new Promise((r) => setTimeout(r, 800))
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <p className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
        ✓ You&apos;re in.
      </p>
    )
  }

  return (
    <div
      className={variant === 'card' ? 'p-6 border' : ''}
      style={
        variant === 'card'
          ? {
              borderColor: 'var(--color-torn)',
              backgroundColor: 'var(--color-ghost)',
              borderRadius: 'var(--radius-card)',
              // torn notepad feel: slight rotation
              transform: 'rotate(-0.5deg)',
            }
          : {}
      }
    >
      <p
        className="mb-3 text-sm"
        style={{ fontFamily: 'var(--font-ui)', color: 'var(--color-ink)' }}
      >
        {cta}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 text-sm bg-transparent border outline-none focus:border-[var(--color-ink)]"
          style={{
            borderColor: 'var(--color-torn)',
            borderRadius: 'var(--radius-input)',
            fontFamily: 'var(--font-ui)',
            color: 'var(--color-ink)',
          }}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 text-xs tracking-[0.12em] uppercase transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{
            backgroundColor: 'var(--color-ink)',
            color: 'var(--color-paper)',
            fontFamily: 'var(--font-ui)',
            borderRadius: 0,
          }}
        >
          {status === 'loading' ? '...' : button}
        </button>
      </form>
    </div>
  )
}
