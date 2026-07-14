import type { PortableTextBlock } from '@portabletext/react'
import { sanityClient } from '@/sanity/client'
import { aboutQuery } from '@/sanity/queries'
import type { Locale } from '@/lib/i18n'

/**
 * Sanity-backed replacement for the Keystatic `about` singleton read.
 * Localization + English fallback happen in GROQ (queries.ts `loc()`); the body
 * comes back as Portable Text (rendered by `renderPortableText`).
 */
export interface CurrentlyItem {
  label: string
  value: string
}

export interface About {
  intro: string
  body: PortableTextBlock[]
  currentlyLabel: string
  currently: CurrentlyItem[]
  contactLabel: string
  contactBody: string
  email: string
}

type RawAbout = {
  intro: string | null
  body?: PortableTextBlock[]
  bodyFallback?: PortableTextBlock[]
  bodyFallback2?: PortableTextBlock[]
  currentlyLabel: string | null
  currently: { label: string | null; value: string | null }[] | null
  contactLabel: string | null
  contactBody: string | null
  email: string | null
} | null

export async function getAbout(locale: Locale): Promise<About | null> {
  const raw = await sanityClient.fetch<RawAbout>(aboutQuery, { locale })
  if (!raw) return null

  const body = raw.body?.length
    ? raw.body
    : raw.bodyFallback?.length
      ? raw.bodyFallback
      : raw.bodyFallback2 ?? []

  return {
    intro: raw.intro ?? '',
    body,
    currentlyLabel: raw.currentlyLabel ?? '',
    currently: (raw.currently ?? [])
      .map((item) => ({ label: item.label ?? '', value: item.value ?? '' }))
      .filter((item) => item.label || item.value),
    contactLabel: raw.contactLabel ?? '',
    contactBody: raw.contactBody ?? '',
    email: raw.email ?? '',
  }
}
