import { groq } from 'next-sanity'

/**
 * GROQ query fragments for the site.
 *
 * LOCALIZATION: every translatable field is an internationalizedArray, i.e.
 * `[{_key:'en', value}, {_key:'id', value}, {_key:'zh', value}]`. The `loc()`
 * helper picks the requested locale and FALLS BACK TO ENGLISH when the value is
 * missing — matching the agreed rule (never render blank). `$locale` is passed
 * as a query param.
 */
const loc = (field: string) =>
  `coalesce(${field}[_key == $locale][0].value, ${field}[_key == "en"][0].value)`

// Body needs the same locale pick, then references inside Portable Text
// (linkedPost) dereferenced so the renderer has the target slug.
const localizedBody = (field: string) => `
  "body": ${field}[_key == $locale][0].value[]{
    ...,
    _type == "linkedPost" => {
      ...,
      "post": post->{ "slug": slug.current }
    }
  },
  "bodyFallback": ${field}[_key == "en"][0].value[]{
    ...,
    _type == "linkedPost" => {
      ...,
      "post": post->{ "slug": slug.current }
    }
  }
`

// ── Articles ────────────────────────────────────────────────────────────────

/** Metadata for every article, newest first (list pages, sitemap, RSS). */
export const articlesListQuery = groq`
  *[_type == "article"] | order(publishedAt desc) {
    "slug": slug.current,
    "title": ${loc('title')},
    "excerpt": ${loc('excerpt')},
    "readingTime": ${loc('readingTime')},
    tag,
    publishedAt,
    coverImage
  }
`

/** One article's metadata by slug. */
export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    "slug": slug.current,
    "title": ${loc('title')},
    "excerpt": ${loc('excerpt')},
    "readingTime": ${loc('readingTime')},
    tag,
    publishedAt,
    coverImage
  }
`

/** One article's Portable Text body by slug (detail page only). */
export const articleBodyBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    ${localizedBody('body')}
  }
`

/** Lightweight preview for the inline <LinkedPost> hover card. */
export const articlePreviewQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    "title": ${loc('title')},
    "excerpt": ${loc('excerpt')},
    tag,
    coverImage
  }
`

// ── Places: Country / City / Destination ─────────────────────────────────────
// Flat list queries mirror the old Keystatic collections; the tree, chain
// validation, and reverse references are rebuilt in JS from these (see
// src/lib/places.sanity.ts) so behaviour matches src/lib/places.ts exactly.

const countryProjection = `
  "slug": slug.current,
  "name": ${loc('name')},
  region,
  coverImage
`
const cityProjection = `
  "slug": slug.current,
  "name": ${loc('name')},
  "countrySlug": country->slug.current,
  coverImage
`
const destinationProjection = `
  "slug": slug.current,
  "name": ${loc('name')},
  "citySlug": city->slug.current,
  type,
  coverImage
`
const itineraryProjection = `
  "slug": slug.current,
  "title": ${loc('title')},
  duration,
  "countrySlug": country->slug.current,
  "excerpt": ${loc('excerpt')},
  coverImage,
  "stops": stops[]->slug.current
`
const storyProjection = `
  "slug": slug.current,
  "title": ${loc('title')},
  publishedAt,
  "excerpt": ${loc('excerpt')},
  coverImage,
  "relatedCountries": relatedCountries[]->slug.current,
  "relatedDestinations": relatedDestinations[]->slug.current
`

export const countriesListQuery = groq`*[_type == "country"]{${countryProjection}}`
export const citiesListQuery = groq`*[_type == "city"]{${cityProjection}}`
export const destinationsListQuery = groq`*[_type == "destination"]{${destinationProjection}}`
export const itinerariesListQuery = groq`*[_type == "itinerary"]{${itineraryProjection}}`
export const storiesListQuery = groq`*[_type == "story"]{${storyProjection}}`

export const countryBySlugQuery = groq`*[_type == "country" && slug.current == $slug][0]{${countryProjection}}`
export const cityBySlugQuery = groq`*[_type == "city" && slug.current == $slug][0]{${cityProjection}}`
export const destinationBySlugQuery = groq`*[_type == "destination" && slug.current == $slug][0]{${destinationProjection}}`
export const itineraryBySlugQuery = groq`*[_type == "itinerary" && slug.current == $slug][0]{${itineraryProjection}}`
export const storyBySlugQuery = groq`*[_type == "story" && slug.current == $slug][0]{${storyProjection}}`

// Portable Text bodies (detail pages only).
export const destinationBodyBySlugQuery = groq`
  *[_type == "destination" && slug.current == $slug][0]{${localizedBody('body')}}
`
export const itineraryBodyBySlugQuery = groq`
  *[_type == "itinerary" && slug.current == $slug][0]{${localizedBody('body')}}
`
export const storyBodyBySlugQuery = groq`
  *[_type == "story" && slug.current == $slug][0]{${localizedBody('body')}}
`
export const countryIntroBySlugQuery = groq`
  *[_type == "country" && slug.current == $slug][0]{${localizedBody('intro')}}
`

// ── About singleton ───────────────────────────────────────────────────────────
export const aboutQuery = groq`
  *[_type == "about"][0]{
    "intro": ${loc('intro')},
    ${localizedBody('body')},
    "currentlyLabel": ${loc('currentlyLabel')},
    "currently": currently[]{
      "label": ${loc('label')},
      "value": ${loc('value')}
    },
    "contactLabel": ${loc('contactLabel')},
    "contactBody": ${loc('contactBody')},
    email
  }
`

export { loc, localizedBody }
