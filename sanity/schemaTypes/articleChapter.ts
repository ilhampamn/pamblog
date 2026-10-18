import { defineField, defineType } from 'sanity'

/** A chapter groups story articles within one season. */
export const articleChapter = defineType({
  name: 'articleChapter',
  title: 'Story chapter',
  type: 'document',
  fields: [
    defineField({
      name: 'storySeries',
      title: 'Season',
      type: 'reference',
      description: 'Choose a season, or use “Create new” to add one.',
      to: [{ type: 'articleSeries' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'chapterNumber',
      title: 'Chapter number',
      type: 'number',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: 'title',
      title: 'Chapter title',
      type: 'internationalizedArrayString',
      description: 'For example: Before the Day or India, the stopover.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      seasonNumber: 'storySeries.seasonNumber',
      seasonTitle: 'storySeries.title.0.value',
      chapterNumber: 'chapterNumber',
      title: 'title.0.value',
    },
    prepare: ({ seasonNumber, seasonTitle, chapterNumber, title }) => ({
      title: `Chapter ${chapterNumber ?? '?'}: ${title ?? 'Untitled chapter'}`,
      subtitle: `Season ${seasonNumber ?? '?'}: ${seasonTitle ?? 'Untitled season'}`,
    }),
  },
})
