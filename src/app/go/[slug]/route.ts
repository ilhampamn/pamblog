import { NextRequest, NextResponse } from 'next/server'
import affiliates from '../../../../content/affiliates.json'

export function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const url = (affiliates as Record<string, string>)[params.slug]

  if (!url) {
    return NextResponse.redirect(new URL('/', _request.url), { status: 302 })
  }

  // 301 permanent redirect — allows changing affiliate URLs without republishing posts
  return NextResponse.redirect(url, { status: 301 })
}
