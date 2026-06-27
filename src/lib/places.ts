import type { Node } from '@markdoc/markdoc'
import { reader, resolveContent, type ContentValue } from '@/lib/reader'
import type { Locale } from '@/lib/i18n'

/**
 * Travel content lives in five FLAT Keystatic collections (countries, cities,
 * destinations, itineraries, stories) because Keystatic can't nest collections.
 * Each place points UP to its parent via a relationship field:
 *
 *   destination.city → cities      city.country → countries     country.region (select)
 *
 * This module follows those pointers at build time to:
 *   • reconstruct the Region → Country → City → Destination tree,
 *   • validate nested URLs (the /country/city/destination chain must be real),
 *   • resolve reverse references ("itineraries / stories that include this place").
 *
 * Everything here is metadata-only (no body parse) except the explicit *Node
 * helpers, mirroring src/lib/posts.ts.
 */

// ── Region labels (must match the `region` select in keystatic.config.ts) ────
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

// The tree shape used by the /explore/destinations browse pages.
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

// A fully-resolved destination URL: destination + its real parents.
export interface DestinationChain {
  country: Country
  city: City
  destination: Destination
}

// ── Entry types ──────────────────────────────────────────────────────────────
type CountryEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.countries.read>>>
type CityEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.cities.read>>>
type DestinationEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.destinations.read>>>
type ItineraryEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.itineraries.read>>>
type StoryEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.stories.read>>>

// ── Locale projection helpers ────────────────────────────────────────────────
const pick = (en: string | undefined | null, id: string | undefined | null, locale: Locale) =>
  (locale === 'id' ? id?.trim() || en : en) ?? ''

/** Relationship arrays come back as (string|null)[]; drop the nulls. */
const cleanRefs = (refs: readonly (string | null)[]): string[] =>
  refs.filter((r): r is string => typeof r === 'string' && r.length > 0)

function toCountry(slug: string, e: CountryEntry, locale: Locale): Country {
  return {
    slug,
    name: pick(slug, e.nameId, locale) || slug,
    region: e.region,
    regionLabel: REGION_LABELS[e.region] ?? e.region,
    coverImage: e.coverImage ?? undefined,
  }
}

function toCity(slug: string, e: CityEntry, locale: Locale): City {
  return {
    slug,
    name: pick(slug, e.nameId, locale) || slug,
    countrySlug: e.country ?? null,
    coverImage: e.coverImage ?? undefined,
  }
}

function toDestination(slug: string, e: DestinationEntry, locale: Locale): Destination {
  return {
    slug,
    name: pick(slug, e.nameId, locale) || slug,
    citySlug: e.city ?? null,
    type: e.type,
    coverImage: e.coverImage ?? undefined,
  }
}

function toItinerary(slug: string, e: ItineraryEntry, locale: Locale): Itinerary {
  return {
    slug,
    title: pick(e.title, e.titleId, locale),
    duration: e.duration ?? '',
    countrySlug: e.country ?? null,
    excerpt: pick(e.excerpt, e.excerptId, locale) || undefined,
    coverImage: e.coverImage ?? undefined,
    stops: cleanRefs(e.stops),
  }
}

function toStory(slug: string, e: StoryEntry, locale: Locale): Story {
  return {
    slug,
    title: pick(e.title, e.titleId, locale),
    publishedAt: e.publishedAt ?? '',
    excerpt: pick(e.excerpt, e.excerptId, locale) || undefined,
    coverImage: e.coverImage ?? undefined,
    relatedCountries: cleanRefs(e.relatedCountries),
    relatedDestinations: cleanRefs(e.relatedDestinations),
  }
}

// ── Flat readers ─────────────────────────────────────────────────────────────
export async function getCountries(locale: Locale): Promise<Country[]> {
  const slugs = await reader.collections.countries.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const e = await reader.collections.countries.read(slug)
      return e ? toCountry(slug, e, locale) : null
    })
  )
  return items.filter((x): x is Country => x !== null)
}

export async function getCities(locale: Locale): Promise<City[]> {
  const slugs = await reader.collections.cities.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const e = await reader.collections.cities.read(slug)
      return e ? toCity(slug, e, locale) : null
    })
  )
  return items.filter((x): x is City => x !== null)
}

export async function getDestinations(locale: Locale): Promise<Destination[]> {
  const slugs = await reader.collections.destinations.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const e = await reader.collections.destinations.read(slug)
      return e ? toDestination(slug, e, locale) : null
    })
  )
  return items.filter((x): x is Destination => x !== null)
}

export async function getItineraries(locale: Locale): Promise<Itinerary[]> {
  const slugs = await reader.collections.itineraries.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const e = await reader.collections.itineraries.read(slug)
      return e ? toItinerary(slug, e, locale) : null
    })
  )
  return items.filter((x): x is Itinerary => x !== null).sort((a, b) => a.title.localeCompare(b.title))
}

export async function getStories(locale: Locale): Promise<Story[]> {
  const slugs = await reader.collections.stories.list()
  const items = await Promise.all(
    slugs.map(async (slug) => {
      const e = await reader.collections.stories.read(slug)
      return e ? toStory(slug, e, locale) : null
    })
  )
  return items
    .filter((x): x is Story => x !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

// ── Single-entry readers ─────────────────────────────────────────────────────
export async function getCountry(locale: Locale, slug: string): Promise<Country | undefined> {
  const e = await reader.collections.countries.read(slug)
  return e ? toCountry(slug, e, locale) : undefined
}
export async function getCity(locale: Locale, slug: string): Promise<City | undefined> {
  const e = await reader.collections.cities.read(slug)
  return e ? toCity(slug, e, locale) : undefined
}
export async function getDestination(locale: Locale, slug: string): Promise<Destination | undefined> {
  const e = await reader.collections.destinations.read(slug)
  return e ? toDestination(slug, e, locale) : undefined
}
export async function getItinerary(locale: Locale, slug: string): Promise<Itinerary | undefined> {
  const e = await reader.collections.itineraries.read(slug)
  return e ? toItinerary(slug, e, locale) : undefined
}
export async function getStory(locale: Locale, slug: string): Promise<Story | undefined> {
  const e = await reader.collections.stories.read(slug)
  return e ? toStory(slug, e, locale) : undefined
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
/**
 * Resolve /explore/destinations/<country>/<city>/<destination> and verify the
 * chain is real: the destination must live in that city, and that city in that
 * country. Returns null on any mismatch → the page should 404.
 */
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

/** Validate a /explore/destinations/<country>/<city> path (city belongs to country). */
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
/** Every valid {country, city, destination} triple for static generation. */
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

/** Every valid {country, city} pair. */
export async function allCityPaths(): Promise<{ country: string; city: string }[]> {
  const tree = await getRegionTree('en')
  const paths: { country: string; city: string }[] = []
  for (const region of tree)
    for (const country of region.countries)
      for (const city of country.cities) paths.push({ country: country.slug, city: city.slug })
  return paths
}

// ── Reverse references (the graph payoff) ─────────────────────────────────────
/** Itineraries whose `stops` include this destination. */
export async function getItinerariesForDestination(
  locale: Locale,
  destinationSlug: string
): Promise<Itinerary[]> {
  const all = await getItineraries(locale)
  return all.filter((it) => it.stops.includes(destinationSlug))
}

/** Stories that reference this destination (directly or via its country). */
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

/** Stories that reference this country. */
export async function getStoriesForCountry(locale: Locale, countrySlug: string): Promise<Story[]> {
  const all = await getStories(locale)
  return all.filter((s) => s.relatedCountries.includes(countrySlug))
}

/** Itineraries grouped under a country (by the optional `country` field). */
export async function getItinerariesForCountry(locale: Locale, countrySlug: string): Promise<Itinerary[]> {
  const all = await getItineraries(locale)
  return all.filter((it) => it.countrySlug === countrySlug)
}

/**
 * Given a destination slug, walk UP its relationship chain to find the city and
 * country, so we can build its full nested URL. Returns null if any link is
 * broken (e.g. the destination has no city). Used to render itinerary stops and
 * story cross-links as real /country/city/destination links.
 */
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

/** Resolve an ordered list of destination slugs into full chains (skips broken refs). */
export async function resolveStops(
  locale: Locale,
  slugs: string[]
): Promise<DestinationChain[]> {
  const chains = await Promise.all(slugs.map((s) => getDestinationChainBySlug(locale, s)))
  return chains.filter((c): c is DestinationChain => c !== null)
}

// ── Markdoc body nodes (detail pages only) ────────────────────────────────────
async function nodeFor(value: ContentValue | undefined): Promise<Node | null> {
  if (!value) return null
  const { node } = await resolveContent(value)
  return node
}

export async function getDestinationNode(locale: Locale, slug: string): Promise<Node | null> {
  const e = await reader.collections.destinations.read(slug)
  if (!e) return null
  return nodeFor(locale === 'id' ? e.bodyId : e.body)
}
export async function getItineraryNode(locale: Locale, slug: string): Promise<Node | null> {
  const e = await reader.collections.itineraries.read(slug)
  if (!e) return null
  return nodeFor(locale === 'id' ? e.bodyId : e.body)
}
export async function getStoryNode(locale: Locale, slug: string): Promise<Node | null> {
  const e = await reader.collections.stories.read(slug)
  if (!e) return null
  return nodeFor(locale === 'id' ? e.bodyId : e.body)
}
export async function getCountryIntroNode(locale: Locale, slug: string): Promise<Node | null> {
  const e = await reader.collections.countries.read(slug)
  if (!e) return null
  return nodeFor(locale === 'id' ? e.introId : e.intro)
}
