import type { PortableTextBlock } from '@portabletext/react'
import { sanityClient } from '@/sanity/client'
import { urlForImage } from '@/sanity/image'
import {
  countriesListQuery,
  citiesListQuery,
  destinationsListQuery,
  itinerariesListQuery,
  storiesListQuery,
  countryBySlugQuery,
  cityBySlugQuery,
  destinationBySlugQuery,
  itineraryBySlugQuery,
  storyBySlugQuery,
  destinationBodyBySlugQuery,
  itineraryBodyBySlugQuery,
  storyBodyBySlugQuery,
  countryIntroBySlugQuery,
} from '@/sanity/queries'
import type { Locale } from '@/lib/i18n'

/**
 * Sanity-backed replacement for src/lib/places.ts.
 *
 * The place graph (Region → Country → City → Destination) is reconstructed the
 * SAME way as the Keystatic version — flat lists projected to one locale, then
 * the tree / chain validation / reverse references built in JS. Only the data
 * source changed: GROQ instead of the Keystatic reader, references resolved with
 * `->slug.current` instead of relationship strings.
 *
 * Localization + English fallback happen in GROQ (queries.ts `loc()`); body
 * getters return Portable Text (rendered by `renderPortableText`) instead of a
 * Markdoc AST Node.
 */

// ── Region labels (must match the `region` select in the schema) ─────────────
export const REGION_LABELS: Record<string, string> = {
  'southeast-asia': 'Southeast Asia',
  'east-asia': 'East Asia',
  'south-asia': 'South Asia',
  'central-asia': 'Central Asia',
  'middle-east': 'Middle East',
  europe: 'Europe',
  africa: 'Africa',
  'north-america': 'North America',
  'south-america': 'South America',
  oceania: 'Oceania',
}

// ── Projected types (one locale, metadata only) ──────────────────────────────
export interface Country {
  slug: string
  name: string
  region: string
  regionLabel: string
  coverImage?: string
}

export interface City {
  slug: string
  name: string
  countrySlug: string | null
  coverImage?: string
}

export interface Destination {
  slug: string
  name: string
  citySlug: string | null
  type: string
  coverImage?: string
}

export interface Itinerary {
  slug: string
  title: string
  duration: string
  countrySlug: string | null
  excerpt?: string
  coverImage?: string
  stops: string[]
}

export interface Story {
  slug: string
  title: string
  publishedAt: string
  excerpt?: string
  coverImage?: string
  relatedCountries: string[]
  relatedDestinations: string[]
}

export interface CityNode extends City {
  destinations: Destination[]
}
export interface CountryNode extends Country {
  cities: CityNode[]
}
export interface RegionNode {
  region: string
  regionLabel: string
  countries: CountryNode[]
}

export interface DestinationChain {
  country: Country
  city: City
  destination: Destination
}

// ── Raw GROQ shapes ───────────────────────────────────────────────────────────
type RawCountry = { slug: string; name: string | null; region: string; coverImage?: unknown }
type RawCity = { slug: string; name: string | null; countrySlug: string | null; coverImage?: unknown }
type RawDestination = {
  slug: string
  name: string | null
  citySlug: string | null
  type: string
  coverImage?: unknown
}
type RawItinerary = {
  slug: string
  title: string | null
  duration: string | null
  countrySlug: string | null
  excerpt: string | null
  coverImage?: unknown
  stops: (string | null)[] | null
}
type RawStory = {
  slug: string
  title: string | null
  publishedAt: string | null
  excerpt: string | null
  coverImage?: unknown
  relatedCountries: (string | null)[] | null
  relatedDestinations: (string | null)[] | null
}

// ── Mapping helpers ────────────────────────────────────────────────────────────
function coverUrl(cover: unknown): string | undefined {
  if (!cover) return undefined
  return urlForImage(cover as never).width(1200).url()
}

/** Reference arrays may contain nulls (dangling refs); drop them. */
const cleanRefs = (refs: (string | null)[] | null | undefined): string[] =>
  (refs ?? []).filter((r): r is string => typeof r === 'string' && r.length > 0)

function toCountry(r: RawCountry): Country {
  return {
    slug: r.slug,
    name: r.name || r.slug,
    region: r.region,
    regionLabel: REGION_LABELS[r.region] ?? r.region,
    coverImage: coverUrl(r.coverImage),
  }
}
function toCity(r: RawCity): City {
  return {
    slug: r.slug,
    name: r.name || r.slug,
    countrySlug: r.countrySlug ?? null,
    coverImage: coverUrl(r.coverImage),
  }
}
function toDestination(r: RawDestination): Destination {
  return {
    slug: r.slug,
    name: r.name || r.slug,
    citySlug: r.citySlug ?? null,
    type: r.type,
    coverImage: coverUrl(r.coverImage),
  }
}
function toItinerary(r: RawItinerary): Itinerary {
  return {
    slug: r.slug,
    title: r.title ?? '',
    duration: r.duration ?? '',
    countrySlug: r.countrySlug ?? null,
    excerpt: r.excerpt?.trim() ? r.excerpt : undefined,
    coverImage: coverUrl(r.coverImage),
    stops: cleanRefs(r.stops),
  }
}
function toStory(r: RawStory): Story {
  return {
    slug: r.slug,
    title: r.title ?? '',
    publishedAt: r.publishedAt ?? '',
    excerpt: r.excerpt?.trim() ? r.excerpt : undefined,
    coverImage: coverUrl(r.coverImage),
    relatedCountries: cleanRefs(r.relatedCountries),
    relatedDestinations: cleanRefs(r.relatedDestinations),
  }
}

// ── Flat readers ─────────────────────────────────────────────────────────────
export async function getCountries(locale: Locale): Promise<Country[]> {
  const raw = await sanityClient.fetch<RawCountry[]>(countriesListQuery, { locale })
  return raw.map(toCountry)
}

export async function getCities(locale: Locale): Promise<City[]> {
  const raw = await sanityClient.fetch<RawCity[]>(citiesListQuery, { locale })
  return raw.map(toCity)
}

export async function getDestinations(locale: Locale): Promise<Destination[]> {
  const raw = await sanityClient.fetch<RawDestination[]>(destinationsListQuery, { locale })
  return raw.map(toDestination)
}

export async function getItineraries(locale: Locale): Promise<Itinerary[]> {
  const raw = await sanityClient.fetch<RawItinerary[]>(itinerariesListQuery, { locale })
  return raw.map(toItinerary).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getStories(locale: Locale): Promise<Story[]> {
  const raw = await sanityClient.fetch<RawStory[]>(storiesListQuery, { locale })
  return raw
    .map(toStory)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// ── Single-entry readers ─────────────────────────────────────────────────────
export async function getCountry(locale: Locale, slug: string): Promise<Country | undefined> {
  const r = await sanityClient.fetch<RawCountry | null>(countryBySlugQuery, { locale, slug })
  return r ? toCountry(r) : undefined
}
export async function getCity(locale: Locale, slug: string): Promise<City | undefined> {
  const r = await sanityClient.fetch<RawCity | null>(cityBySlugQuery, { locale, slug })
  return r ? toCity(r) : undefined
}
export async function getDestination(locale: Locale, slug: string): Promise<Destination | undefined> {
  const r = await sanityClient.fetch<RawDestination | null>(destinationBySlugQuery, { locale, slug })
  return r ? toDestination(r) : undefined
}
export async function getItinerary(locale: Locale, slug: string): Promise<Itinerary | undefined> {
  const r = await sanityClient.fetch<RawItinerary | null>(itineraryBySlugQuery, { locale, slug })
  return r ? toItinerary(r) : undefined
}
export async function getStory(locale: Locale, slug: string): Promise<Story | undefined> {
  const r = await sanityClient.fetch<RawStory | null>(storyBySlugQuery, { locale, slug })
  return r ? toStory(r) : undefined
}

// ── Tree builder (reconstructs Region → Country → City → Destination) ─────────
export async function getRegionTree(locale: Locale): Promise<RegionNode[]> {
  const [countries, cities, destinations] = await Promise.all([
    getCountries(locale),
    getCities(locale),
    getDestinations(locale),
  ])

  const destsByCity = new Map<string, Destination[]>()
  for (const d of destinations) {
    if (!d.citySlug) continue
    const list = destsByCity.get(d.citySlug) ?? []
    list.push(d)
    destsByCity.set(d.citySlug, list)
  }

  const citiesByCountry = new Map<string, CityNode[]>()
  for (const c of cities) {
    if (!c.countrySlug) continue
    const node: CityNode = {
      ...c,
      destinations: (destsByCity.get(c.slug) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    }
    const list = citiesByCountry.get(c.countrySlug) ?? []
    list.push(node)
    citiesByCountry.set(c.countrySlug, list)
  }

  const regions = new Map<string, RegionNode>()
  for (const country of countries.sort((a, b) => a.name.localeCompare(b.name))) {
    const countryNode: CountryNode = {
      ...country,
      cities: (citiesByCountry.get(country.slug) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    }
    const region = regions.get(country.region) ?? {
      region: country.region,
      regionLabel: country.regionLabel,
      countries: [],
    }
    region.countries.push(countryNode)
    regions.set(country.region, region)
  }

  return Array.from(regions.values()).sort((a, b) => a.regionLabel.localeCompare(b.regionLabel))
}

/** Cities of one country, each with its destinations attached. */
export async function getCountryNode(locale: Locale, countrySlug: string): Promise<CountryNode | undefined> {
  const tree = await getRegionTree(locale)
  for (const region of tree) {
    const found = region.countries.find((c) => c.slug === countrySlug)
    if (found) return found
  }
  return undefined
}

// ── Nested-URL validation ─────────────────────────────────────────────────────
export async function resolveDestinationChain(
  locale: Locale,
  countrySlug: string,
  citySlug: string,
  destinationSlug: string
): Promise<DestinationChain | null> {
  const [country, city, destination] = await Promise.all([
    getCountry(locale, countrySlug),
    getCity(locale, citySlug),
    getDestination(locale, destinationSlug),
  ])
  if (!country || !city || !destination) return null
  if (destination.citySlug !== city.slug) return null
  if (city.countrySlug !== country.slug) return null
  return { country, city, destination }
}

export async function resolveCityChain(
  locale: Locale,
  countrySlug: string,
  citySlug: string
): Promise<{ country: Country; city: CityNode } | null> {
  const countryNode = await getCountryNode(locale, countrySlug)
  if (!countryNode) return null
  const city = countryNode.cities.find((c) => c.slug === citySlug)
  if (!city) return null
  return { country: countryNode, city }
}

// ── generateStaticParams helpers ──────────────────────────────────────────────
export async function allDestinationPaths(): Promise<
  { country: string; city: string; destination: string }[]
> {
  const tree = await getRegionTree('en')
  const paths: { country: string; city: string; destination: string }[] = []
  for (const region of tree)
    for (const country of region.countries)
      for (const city of country.cities)
        for (const dest of city.destinations)
          paths.push({ country: country.slug, city: city.slug, destination: dest.slug })
  return paths
}

export async function allCityPaths(): Promise<{ country: string; city: string }[]> {
  const tree = await getRegionTree('en')
  const paths: { country: string; city: string }[] = []
  for (const region of tree)
    for (const country of region.countries)
      for (const city of country.cities) paths.push({ country: country.slug, city: city.slug })
  return paths
}

// ── Reverse references (the graph payoff) ─────────────────────────────────────
export async function getItinerariesForDestination(
  locale: Locale,
  destinationSlug: string
): Promise<Itinerary[]> {
  const all = await getItineraries(locale)
  return all.filter((it) => it.stops.includes(destinationSlug))
}

export async function getStoriesForDestination(
  locale: Locale,
  destinationSlug: string,
  countrySlug?: string | null
): Promise<Story[]> {
  const all = await getStories(locale)
  return all.filter(
    (s) =>
      s.relatedDestinations.includes(destinationSlug) ||
      (countrySlug ? s.relatedCountries.includes(countrySlug) : false)
  )
}

export async function getStoriesForCountry(locale: Locale, countrySlug: string): Promise<Story[]> {
  const all = await getStories(locale)
  return all.filter((s) => s.relatedCountries.includes(countrySlug))
}

export async function getItinerariesForCountry(locale: Locale, countrySlug: string): Promise<Itinerary[]> {
  const all = await getItineraries(locale)
  return all.filter((it) => it.countrySlug === countrySlug)
}

export async function getDestinationChainBySlug(
  locale: Locale,
  destinationSlug: string
): Promise<DestinationChain | null> {
  const destination = await getDestination(locale, destinationSlug)
  if (!destination?.citySlug) return null
  const city = await getCity(locale, destination.citySlug)
  if (!city?.countrySlug) return null
  const country = await getCountry(locale, city.countrySlug)
  if (!country) return null
  return { country, city, destination }
}

export async function resolveStops(
  locale: Locale,
  slugs: string[]
): Promise<DestinationChain[]> {
  const chains = await Promise.all(slugs.map((s) => getDestinationChainBySlug(locale, s)))
  return chains.filter((c): c is DestinationChain => c !== null)
}

// ── Portable Text bodies (detail pages only) ──────────────────────────────────
type BodyResult = { body?: PortableTextBlock[]; bodyFallback?: PortableTextBlock[] } | null

function pickBody(res: BodyResult): PortableTextBlock[] | null {
  if (!res) return null
  return res.body?.length ? res.body : res.bodyFallback ?? null
}

export async function getDestinationBody(locale: Locale, slug: string): Promise<PortableTextBlock[] | null> {
  const res = await sanityClient.fetch<BodyResult>(destinationBodyBySlugQuery, { locale, slug })
  return pickBody(res)
}
export async function getItineraryBody(locale: Locale, slug: string): Promise<PortableTextBlock[] | null> {
  const res = await sanityClient.fetch<BodyResult>(itineraryBodyBySlugQuery, { locale, slug })
  return pickBody(res)
}
export async function getStoryBody(locale: Locale, slug: string): Promise<PortableTextBlock[] | null> {
  const res = await sanityClient.fetch<BodyResult>(storyBodyBySlugQuery, { locale, slug })
  return pickBody(res)
}
export async function getCountryIntroBody(locale: Locale, slug: string): Promise<PortableTextBlock[] | null> {
  const res = await sanityClient.fetch<BodyResult>(countryIntroBySlugQuery, { locale, slug })
  return pickBody(res)
}
