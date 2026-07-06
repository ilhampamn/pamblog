import { revalidatePath, revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

/**
 * Sanity → Vercel revalidation webhook.
 *
 * Configure in Sanity (Manage → API → Webhooks):
 *   URL:    https://<your-domain>/api/revalidate
 *   Trigger: create / update / delete
 *   Secret: same value as SANITY_REVALIDATE_SECRET
 *
 * On publish, Sanity POSTs here; we verify the signature and revalidate the
 * affected paths so the static site rebuilds those pages on next request.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{
      _type: string
      slug?: { current?: string }
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }
    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 })
    }

    // Broad but safe: revalidate everything that could reference the change.
    // For a small site this is cheap; tighten per-type later if needed.
    revalidateTag(body._type)
    revalidatePath('/', 'layout')

    return NextResponse.json({ revalidated: true, type: body._type })
  } catch (err) {
    console.error(err)
    return new NextResponse('Error', { status: 500 })
  }
}
