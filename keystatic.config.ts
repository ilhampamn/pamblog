import { config, collection, singleton, fields } from '@keystatic/core'
import { articleComponents } from './src/keystatic/content-components'

/**
 * Content-focused structure (Option A):
 *
 *   ONE article = ONE entry = both languages together.
 *
 * Shared metadata (tag, date, cover) is entered once. Each language gets its
 * own title, excerpt and body. On disk an entry is a folder:
 *
 *   content/articles/<slug>/
 *     index.mdoc        ← frontmatter (shared meta + titles + excerpts) + EN body
 *     contentId.mdoc    ← Indonesian body
 *
 * Both locales share the same URL slug (e.g. /en/blog/light-and-shadow and
 * /id/blog/light-and-shadow render the same entry in different languages).
 */
export default config({
  storage:
    process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? { kind: 'github', repo: 'ilhampamn/pamblog' }
      : { kind: 'local' },

  singletons: {
    /**
     * About page — one singleton, both languages together (Option A).
     *
     * Stored as:
     *   content/about/
     *     index.mdoc       ← frontmatter (all scalar fields) + English body
     *     bodyId.mdoc      ← Indonesian body
     */
    about: singleton({
      label: 'About page',
      path: 'content/about/',
      format: { contentField: 'body' },
      schema: {
        // ── Intro line (bold opener) ──
        intro: fields.text({ label: 'Intro (English)' }),
        introId: fields.text({ label: 'Intro (Indonesian)' }),

        // ── Rich body content (Markdoc) ──
        body: fields.markdoc({
          label: 'Body (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        bodyId: fields.markdoc({
          label: 'Body (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),

        // ── "Currently" section ──
        currentlyLabel: fields.text({
          label: '"Currently" label (English)',
          defaultValue: 'Right now',
        }),
        currentlyLabelId: fields.text({
          label: '"Currently" label (Indonesian)',
          defaultValue: 'Saat ini',
        }),
        currently: fields.array(
          fields.object({
            labelEn: fields.text({ label: 'Label (English)' }),
            labelId: fields.text({ label: 'Label (Indonesian)' }),
            valueEn: fields.text({ label: 'Value (English)' }),
            valueId: fields.text({ label: 'Value (Indonesian)' }),
          }),
          {
            label: 'Currently items',
            itemLabel: (item) => item.fields.labelEn.value || item.fields.valueEn.value || 'Item',
          }
        ),

        // ── Contact section ──
        contactLabel: fields.text({
          label: 'Contact label (English)',
          defaultValue: 'Get in touch',
        }),
        contactLabelId: fields.text({
          label: 'Contact label (Indonesian)',
          defaultValue: 'Hubungi saya',
        }),
        contactBody: fields.text({ label: 'Contact blurb (English)', multiline: true }),
        contactBodyId: fields.text({ label: 'Contact blurb (Indonesian)', multiline: true }),
        email: fields.text({ label: 'Email address' }),
      },
    }),
  },

  collections: {
    articles: collection({
      label: 'Articles',
      slugField: 'slug',
      // Trailing slash → each entry is a FOLDER (index.mdoc + sibling files),
      // which is required because we store two content bodies per entry.
      path: 'content/articles/*/',
      format: { contentField: 'content' },
      columns: ['title', 'publishedAt'],
      schema: {
        // ── Titles (kept side by side) ──
        title: fields.text({ label: 'Title (English)' }),
        titleId: fields.text({ label: 'Title (Indonesian)' }),

        // The shared URL slug. Standalone so the two titles stay adjacent.
        slug: fields.slug({
          name: { label: 'Slug' },
          slug: {
            description: 'The URL segment for both languages, e.g. /blog/<slug>.',
          },
        }),

        // ── Shared metadata — entered once for both languages ──
        publishedAt: fields.date({ label: 'Published date' }),
        tag: fields.select({
          label: 'Tag',
          options: [
            { label: 'Essay', value: 'essay' },
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Note', value: 'note' },
            { label: 'Review', value: 'review' },
          ],
          defaultValue: 'essay',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),

        // ── Reading time (minutes) — set manually after writing ──
        readingTimeEn: fields.integer({
          label: 'Reading time EN (min)',
          defaultValue: 1,
          validation: { min: 1 },
        }),
        readingTimeId: fields.integer({
          label: 'Reading time ID (min)',
          defaultValue: 1,
          validation: { min: 1 },
        }),

        // ── Excerpts (side by side) ──
        excerpt: fields.text({ label: 'Excerpt (English)', multiline: true }),
        excerptId: fields.text({ label: 'Excerpt (Indonesian)', multiline: true }),

        // ── Bodies (side by side; Markdoc) ──
        // `content` is the contentField → becomes the body of index.mdoc.
        content: fields.markdoc({
          label: 'Content (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        // Second body → stored as a sibling file in the entry folder.
        contentId: fields.markdoc({
          label: 'Content (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),
      },
    }),

    /* ─────────────────────────────────────────────────────────────────────
     * EXPLORE — travel content.
     *
     * Keystatic can't nest collections, so the place tree
     *   Region → Country → City → Destination
     * is stored as THREE flat collections that point UP to their parent via a
     * `relationship` field. `src/lib/places.ts` follows those pointers at build
     * time to reconstruct the tree and the nested URLs.
     *
     *   Region   → a select on Country (no collection; region pages derived)
     *   Country  → countries collection
     *   City     → cities collection      (city.country → countries)
     *   Dest.    → destinations collection (destination.city → cities)
     *
     * Itineraries and Stories cut ACROSS the tree, referencing destinations /
     * countries by relationship.
     * ──────────────────────────────────────────────────────────────────── */

    countries: collection({
      label: 'Countries',
      slugField: 'name',
      path: 'content/countries/*/',
      format: { contentField: 'intro' },
      columns: ['name', 'region'],
      schema: {
        name: fields.slug({
          name: { label: 'Name (English)' },
          slug: { description: 'URL segment, e.g. /explore/destinations/<slug>.' },
        }),
        nameId: fields.text({ label: 'Name (Indonesian)' }),
        region: fields.select({
          label: 'Region',
          options: [
            { label: 'Southeast Asia', value: 'southeast-asia' },
            { label: 'East Asia', value: 'east-asia' },
            { label: 'South Asia', value: 'south-asia' },
            { label: 'Central Asia', value: 'central-asia' },
            { label: 'Middle East', value: 'middle-east' },
            { label: 'Europe', value: 'europe' },
            { label: 'Africa', value: 'africa' },
            { label: 'North America', value: 'north-america' },
            { label: 'South America', value: 'south-america' },
            { label: 'Oceania', value: 'oceania' },
          ],
          defaultValue: 'southeast-asia',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/places',
          publicPath: '/images/places',
        }),
        intro: fields.markdoc({
          label: 'Intro (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        introId: fields.markdoc({
          label: 'Intro (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),
      },
    }),

    cities: collection({
      label: 'Cities',
      slugField: 'name',
      path: 'content/cities/*/',
      format: { contentField: 'intro' },
      columns: ['name', 'country'],
      schema: {
        name: fields.slug({
          name: { label: 'Name (English)' },
          slug: { description: 'URL segment under its country.' },
        }),
        nameId: fields.text({ label: 'Name (Indonesian)' }),
        // Up-link: which country this city belongs to.
        country: fields.relationship({
          label: 'Country',
          collection: 'countries',
          description: 'The country this city belongs to.',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/places',
          publicPath: '/images/places',
        }),
        intro: fields.markdoc({
          label: 'Intro (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        introId: fields.markdoc({
          label: 'Intro (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),
      },
    }),

    destinations: collection({
      label: 'Destinations',
      slugField: 'name',
      path: 'content/destinations/*/',
      format: { contentField: 'body' },
      columns: ['name', 'type', 'city'],
      schema: {
        name: fields.slug({
          name: { label: 'Name (English)' },
          slug: { description: 'URL segment under its city.' },
        }),
        nameId: fields.text({ label: 'Name (Indonesian)' }),
        // Up-link: which city this destination is in (country inferred via city).
        city: fields.relationship({
          label: 'City',
          collection: 'cities',
          description: 'The city this destination is in.',
        }),
        type: fields.select({
          label: 'Type',
          options: [
            { label: 'Cafe', value: 'cafe' },
            { label: 'Restaurant', value: 'restaurant' },
            { label: 'Mountain', value: 'mountain' },
            { label: 'Viewpoint', value: 'viewpoint' },
            { label: 'Beach', value: 'beach' },
            { label: 'Museum', value: 'museum' },
            { label: 'Market', value: 'market' },
            { label: 'Temple', value: 'temple' },
            { label: 'Park', value: 'park' },
            { label: 'Stay', value: 'stay' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'cafe',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/places',
          publicPath: '/images/places',
        }),
        body: fields.markdoc({
          label: 'Body (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        bodyId: fields.markdoc({
          label: 'Body (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),
      },
    }),

    itineraries: collection({
      label: 'Itineraries',
      slugField: 'slug',
      path: 'content/itineraries/*/',
      format: { contentField: 'body' },
      columns: ['title', 'duration'],
      schema: {
        title: fields.text({ label: 'Title (English)' }),
        titleId: fields.text({ label: 'Title (Indonesian)' }),
        slug: fields.slug({
          name: { label: 'Slug' },
          slug: { description: 'URL segment, e.g. /explore/itineraries/<slug>.' },
        }),
        duration: fields.text({ label: 'Duration', description: 'e.g. "3 days".' }),
        country: fields.relationship({
          label: 'Country (optional, for grouping)',
          collection: 'countries',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/places',
          publicPath: '/images/places',
        }),
        excerpt: fields.text({ label: 'Excerpt (English)', multiline: true }),
        excerptId: fields.text({ label: 'Excerpt (Indonesian)', multiline: true }),
        // Flat, ordered list of destinations this trip visits. Day-by-day flow
        // is described in the body prose, not modelled structurally.
        stops: fields.array(
          fields.relationship({ label: 'Destination', collection: 'destinations' }),
          {
            label: 'Stops (ordered)',
            itemLabel: (item) => item.value ?? 'Destination',
          }
        ),
        body: fields.markdoc({
          label: 'Body (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        bodyId: fields.markdoc({
          label: 'Body (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),
      },
    }),

    stories: collection({
      label: 'Stories',
      slugField: 'slug',
      path: 'content/stories/*/',
      format: { contentField: 'body' },
      columns: ['title', 'publishedAt'],
      schema: {
        title: fields.text({ label: 'Title (English)' }),
        titleId: fields.text({ label: 'Title (Indonesian)' }),
        slug: fields.slug({
          name: { label: 'Slug' },
          slug: { description: 'URL segment, e.g. /explore/stories/<slug>.' },
        }),
        publishedAt: fields.date({ label: 'Published date' }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/places',
          publicPath: '/images/places',
        }),
        excerpt: fields.text({ label: 'Excerpt (English)', multiline: true }),
        excerptId: fields.text({ label: 'Excerpt (Indonesian)', multiline: true }),
        // Optional cross-links into the place tree → power "stories that mention
        // this place" reverse references on destination/country pages.
        relatedCountries: fields.array(
          fields.relationship({ label: 'Country', collection: 'countries' }),
          { label: 'Related countries', itemLabel: (item) => item.value ?? 'Country' }
        ),
        relatedDestinations: fields.array(
          fields.relationship({ label: 'Destination', collection: 'destinations' }),
          { label: 'Related destinations', itemLabel: (item) => item.value ?? 'Destination' }
        ),
        body: fields.markdoc({
          label: 'Body (English)',
          extension: 'mdoc',
          components: articleComponents,
        }),
        bodyId: fields.markdoc({
          label: 'Body (Indonesian)',
          extension: 'mdoc',
          components: articleComponents,
        }),
      },
    }),
  },
})
