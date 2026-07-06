import { defineType, defineField } from 'sanity'

/**
 * Itinerary — a trip plan that cuts across the place tree.
 * `stops` is an ordered list of destination references (day-by-day flow lives
 * in the body prose, not modelled structurally). Mirrors the old collection.
 */
export const itinerary = defineType({
  name: 'itinerary',
  title: 'Itinerary',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'internationalizedArrayString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.0.value', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration',
      type: 'string',
      description: 'e.g. "3 days".',
    }),
    defineField({
      name: 'country',
      title: 'Country (optional, for grouping)',
      type: 'reference',
      to: [{ type: 'country' }],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'internationalizedArrayText' }),
    defineField({
      name: 'stops',
      title: 'Stops (ordered)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'destination' }] }],
    }),
    defineField({ name: 'body', title: 'Body', type: 'internationalizedArrayBlockContent' }),
  ],
  preview: { select: { title: 'title.0.value', subtitle: 'duration', media: 'coverImage' } },
})
