'use client'

import { useState, type FormEvent } from 'react'
import { cutEdge } from './cutEdge'
import './printedForm.css'

type Messages = { sending: string; done: string; error: string; invalid: string }

const ENGLISH: Messages = {
  sending: 'Sending…',
  done: 'Thanks. You’re on the list.',
  error: 'That didn’t go through. Try again in a moment.',
  invalid: 'That email doesn’t look right.',
}

/**
 * Inputs — the printed form (Ilham, 2026-10-19, from his reference): the
 * whole form is a printed block in the logo's material — hand-cut cobalt with
 * its grain, cream type — holding an outlined field and a cream send square.
 * It replaces the first version (a sentence and a ruled line on the paper),
 * which read as "just another line" among the page's rules.
 *
 * The block's edge is seeded by `id`, so every form has its own cut, like
 * the Subscribe button. The field and the square stay straight: they are
 * printed rules inside the block, not cut paper.
 *
 * Sending posts to `/api/subscribe`, which adds the reader to Kit tagged with
 * `locale`. The result is typeset under the field as a line of the block, not
 * a toast, so it reads as part of the print.
 */
export function PrintedForm({
  id,
  prompt,
  field,
  action,
  locale = 'en',
  messages = ENGLISH,
}: {
  id: string
  prompt: string
  field: string
  action: string
  locale?: string
  messages?: Messages
}) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'invalid'>('idle')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (state === 'sending' || state === 'done') return
    const form = new FormData(e.currentTarget)
    setState('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), company: form.get('company'), locale }),
      })
      const body = await res.json().catch(() => ({}))
      setState(res.ok && body.ok ? 'done' : body.error === 'invalid' ? 'invalid' : 'error')
    } catch {
      setState('error')
    }
  }

  const status = state === 'idle' ? '' : messages[state]

  return (
    <form className="tp-printform" aria-label={prompt} onSubmit={submit} noValidate>
      <div className="tp-printform__block" style={{ clipPath: cutEdge(id, { wobble: 3, tilt: 5 }) }}>
        <label htmlFor={`${id}-email`} className="tp-printform__prompt">
          {prompt}
        </label>
        <div className="tp-printform__field">
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            placeholder={field}
            autoComplete="email"
            required
            disabled={state === 'done'}
            aria-invalid={state === 'invalid' || undefined}
            aria-describedby={`${id}-status`}
          />
          <button type="submit" className="tp-printform__send" aria-label={action} disabled={state === 'sending' || state === 'done'}>
            <svg aria-hidden viewBox="0 0 24 24" width="22" height="22">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>
        {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
        <input className="tp-printform__trap" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <p id={`${id}-status`} className="tp-printform__status" role="status" aria-live="polite">
          {status}
        </p>
      </div>
    </form>
  )
}
