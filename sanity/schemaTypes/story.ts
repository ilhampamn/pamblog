import { defineType, defineField } from 'sanity'

/**
 * Story — a journal from a longer journey. Cross-links into the place tree via
 * `relatedCountries` / `relatedDestinations`, which power the "stories that
 * mention this place" reverse references (a GROQ `references($id)` query).
 */
export const story = defineType({
  name: 'story',
  title: 'Story',
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
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
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
      name: 'relatedCountries',
      title: 'Related countries',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'country' }] }],
    }),
    defineField({
      name: 'relatedDestinations',
      title: 'Related destinations',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'destination' }] }],
    }),
    defineField({ name: 'body', title: 'Body', type: 'internationalizedArrayBlockContent' }),
  ],
  preview: { select: { title: 'title.0.value', media: 'coverImage' } },
})
