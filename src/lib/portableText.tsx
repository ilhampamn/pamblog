import * as React from 'react'
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from '@portabletext/react'
import { LinkedPost } from '@/components/LinkedPost'
import { urlForImage } from '@/sanity/image'
import type { Locale } from '@/lib/i18n'

/**
 * Render a Portable Text body to React — the Sanity replacement for
 * `renderArticleBody` (the old Markdoc renderer in src/lib/markdoc.tsx).
 *
 * The serializers below map Portable Text nodes to the SAME components the
 * Markdoc renderer produced, so the visual output is identical:
 *  - `linkedPost` inline object → <LinkedPost slug locale> (hover preview card)
 *  - block images → <img> via the Sanity image CDN
 *  - `link` annotation → <a>
 *
 * `locale` is closed over so inline components resolve copy/links in the right
 * language, exactly like the Markdoc version did.
 */
function components(locale: Locale): PortableTextComponents {
  return {
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null
        const url = urlForImage(value).width(1200).url()
        return (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={value.alt ?? ''} loading="lazy" />
            {value.caption && <figcaption>{value.caption}</figcaption>}
          </figure>
        )
      },
      // Ported from the Keystatic `linkedPost` inline component. The referenced
      // article's slug is dereferenced in GROQ (see queries.ts) into `slug`.
      linkedPost: ({ value }) => (
        <LinkedPost slug={value?.post?.slug ?? null} locale={locale} />
      ),
    },
    marks: {
      link: ({ value, children }) => {
        const href: string = value?.href ?? '#'
        const external = /^https?:\/\//.test(href)
        return (
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {children}
          </a>
        )
      },
    },
  }
}

export function renderPortableText(
  blocks: PortableTextBlock[] | undefined | null,
  locale: Locale
): React.ReactNode {
  if (!blocks || blocks.length === 0) return null
  return <PortableText value={blocks} components={components(locale)} />
}
