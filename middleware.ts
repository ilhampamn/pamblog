import { NextRequest, NextResponse } from 'next/server'

const LOCALES = ['en', 'id'] as const
const DEFAULT_LOCALE = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip if already has a locale prefix
  const hasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (hasLocale) return NextResponse.next()

  // Skip static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/keystatic') ||
    pathname.includes('.')
  ) return NextResponse.next()

  // Detect preferred locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferred = acceptLanguage.toLowerCase().includes('id') ? 'id' : DEFAULT_LOCALE

  return NextResponse.redirect(new URL(`/${preferred}${pathname}`, request.url))
}

export const config = {
  matcher: ['/((?!_next|api|keystatic|.*\\..*).*)'],
}
