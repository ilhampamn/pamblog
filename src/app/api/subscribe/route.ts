import { NextResponse } from 'next/server'
import { isLocale } from '@/lib/i18n'

/**
 * Newsletter signup. The printed form posts here, and this adds the reader to
 * Kit (API v4) with a tag for the language they signed up in (`lang-en`,
 * `lang-id`, `lang-zh`). The key never leaves the server.
 *
 * There is no Kit form on purpose: subscribers go straight onto the list, and
 * freebies (the trek checklist, the LUT) will be sent separately through
 * Resend, so the free Kit plan's single automation isn't needed.
 */
const KIT = 'https://api.kit.com/v4'
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Tag ids don't change; keep them for the life of the server instance.
const tagIds = new Map<string, number>()

async function kit(path: string, init: RequestInit = {}) {
  const res = await fetch(`${KIT}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Kit-Api-Key': process.env.KIT_API_KEY ?? '',
    },
    cache: 'no-store',
  })
  const body = await res.json().catch(() => ({}))
  return { ok: res.ok, status: res.status, body }
}

/** Creates the tag the first time; Kit answers with the existing one after that. */
async function tagId(name: string) {
  const known = tagIds.get(name)
  if (known) return known
  const created = await kit('/tags', { method: 'POST', body: JSON.stringify({ name }) })
  let id: number | undefined = created.body?.tag?.id
  if (!id) {
    const list = await kit('/tags?per_page=1000')
    id = list.body?.tags?.find((t: { id: number; name: string }) => t.name === name)?.id
  }
  if (id) tagIds.set(name, id)
  return id
}

export async function POST(req: Request) {
  let data: { email?: unknown; locale?: unknown; company?: unknown }
  try {
    data = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  // Honeypot: a field people never see. Bots fill it in; tell them it worked.
  if (typeof data.company === 'string' && data.company.trim()) return NextResponse.json({ ok: true })

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  if (email.length > 254 || !EMAIL.test(email)) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  if (!process.env.KIT_API_KEY) return NextResponse.json({ ok: false, error: 'unavailable' }, { status: 503 })

  const locale = typeof data.locale === 'string' && isLocale(data.locale) ? data.locale : 'en'

  const subscriber = await kit('/subscribers', {
    method: 'POST',
    body: JSON.stringify({ email_address: email, state: 'active' }),
  })
  if (!subscriber.ok) {
    console.error('Kit subscribe failed', subscriber.status, subscriber.body?.errors)
    return NextResponse.json({ ok: false, error: 'failed' }, { status: 502 })
  }

  // The language tag helps with sending, but a reader whose tag fails is still subscribed.
  const id = await tagId(`lang-${locale}`)
  if (id) {
    const tagged = await kit(`/tags/${id}/subscribers`, { method: 'POST', body: JSON.stringify({ email_address: email }) })
    if (!tagged.ok) console.error('Kit tag failed', tagged.status, tagged.body?.errors)
  } else {
    console.error(`Kit tag lang-${locale} could not be found or created`)
  }

  return NextResponse.json({ ok: true })
}
