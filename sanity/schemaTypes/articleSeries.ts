import { defineField, defineType } from 'sanity'

/**
 * A reusable wrapper for chapter-based articles.
 *
 * Article references use Sanity's standard reference input, which works as a
 * searchable select and also offers "Create new" when a season does not exist.
 */
export const articleSeries = defineType({
  name: 'articleSeries',
  title: 'Story series',
  type: 'document',
  fields: [
    defineField({
      name: 'seasonNumber',
      title: 'Season number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'title',
      title: 'Story title',
      type: 'internationalizedArrayString',
      description: 'For example: First time going abroad or Lost in Central Asia.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      seasonNumber: 'seasonNumber',
      title: 'title.0.value',
    },
    prepare: ({ seasonNumber, title }) => ({
      title: `Season ${seasonNumber ?? '?'}: ${title ?? 'Untitled story'}`,
    }),
  },
})
