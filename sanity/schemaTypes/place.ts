import { defineType, defineField } from 'sanity'

/**
 * The place graph: Region → Country → City → Destination.
 *
 * In Keystatic this was three flat collections linked UP via `relationship`
 * fields. In Sanity the up-links are `reference` fields; the tree and the
 * "appears in / related" reverse links are reconstructed with GROQ
 * (`*[references($id)]`) instead of build-time pointer following.
 *
 * i18n: name/intro/body are field-level (`internationalizedArray*`). Region and
 * type selects and the cover image are shared.
 */

const REGIONS = [
  { title: 'Southeast Asia', value: 'southeast-asia' },
  { title: 'East Asia', value: 'east-asia' },
  { title: 'South Asia', value: 'south-asia' },
  { title: 'Central Asia', value: 'central-asia' },
  { title: 'Middle East', value: 'middle-east' },
  { title: 'Europe', value: 'europe' },
  { title: 'Africa', value: 'africa' },
  { title: 'North America', value: 'north-america' },
  { title: 'South America', value: 'south-america' },
  { title: 'Oceania', value: 'oceania' },
]

const DESTINATION_TYPES = [
  'cafe', 'restaurant', 'mountain', 'viewpoint', 'beach',
  'museum', 'market', 'temple', 'park', 'stay', 'other',
].map((v) => ({ title: v[0].toUpperCase() + v.slice(1), value: v }))

const coverImage = defineField({
  name: 'coverImage',
  title: 'Cover image',
  type: 'image',
  options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
})

const localizedName = defineField({
  name: 'name',
  title: 'Name',
  type: 'internationalizedArrayString',
  validation: (Rule) => Rule.required(),
})

const slug = (source: string) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    options: { source, maxLength: 96 },
    validation: (Rule) => Rule.required(),
  })

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    localizedName,
    slug('name.0.value'),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'string',
      options: { list: REGIONS },
      initialValue: 'southeast-asia',
      validation: (Rule) => Rule.required(),
    }),
    coverImage,
    defineField({ name: 'intro', title: 'Intro', type: 'internationalizedArrayBlockContent' }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'region', media: 'coverImage' } },
})

export const city = defineType({
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    localizedName,
    slug('name.0.value'),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'reference',
      to: [{ type: 'country' }],
      validation: (Rule) => Rule.required(),
    }),
    coverImage,
    defineField({ name: 'intro', title: 'Intro', type: 'internationalizedArrayBlockContent' }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'country.name.0.value', media: 'coverImage' } },
})

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  fields: [
    localizedName,
    slug('name.0.value'),
    defineField({
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{ type: 'city' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: DESTINATION_TYPES },
      initialValue: 'cafe',
      validation: (Rule) => Rule.required(),
    }),
    coverImage,
    defineField({ name: 'body', title: 'Body', type: 'internationalizedArrayBlockContent' }),
  ],
  preview: { select: { title: 'name.0.value', subtitle: 'type', media: 'coverImage' } },
})
