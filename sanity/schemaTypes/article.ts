import { defineType, defineField } from 'sanity'

/**
 * Article — the blog post type.
 *
 * i18n model: FIELD-LEVEL. Translatable fields (title, excerpt, body, reading
 * time) are `internationalizedArray*` — one document carries all languages,
 * keyed by locale (`en` / `id` / `zh`). Shared metadata (slug, tag, date,
 * cover) is entered once. Both locales resolve to the SAME URL slug.
 *
 * Mirrors the old Keystatic `articles` collection: title/titleId,
 * excerpt/excerptId, content/contentId, readingTimeEn/readingTimeId.
 */
export const article = defineType({
  name: 'article',
  title: 'Article',
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
      description: 'Shared URL segment for every language, e.g. /blog/<slug>.',
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
      name: 'tag',
      title: 'Tag',
      type: 'string',
      options: {
        list: [
          { title: 'Essay', value: 'essay' },
          { title: 'Tutorial', value: 'tutorial' },
          { title: 'Note', value: 'note' },
          { title: 'Review', value: 'review' },
          { title: 'Stories', value: 'stories' },
        ],
      },
      initialValue: 'essay',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'storySeries',
      title: 'Story series',
      type: 'reference',
      description:
        'Choose an existing season, or use “Create new” to add another one.',
      to: [{ type: 'articleSeries' }],
      hidden: ({ parent }) => parent?.tag !== 'stories',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { tag?: string } | undefined
          return parent?.tag !== 'stories' || value
            ? true
            : 'A story series is required for Stories.'
        }),
    }),
    defineField({
      name: 'chapterNumber',
      title: 'Chapter number',
      type: 'number',
      description: 'Controls the chapter order within this story series.',
      hidden: ({ parent }) => parent?.tag !== 'stories',
      validation: (Rule) =>
        Rule.integer().positive().custom((value, context) => {
          const parent = context.parent as { tag?: string } | undefined
          return parent?.tag !== 'stories' || value !== undefined
            ? true
            : 'A chapter number is required for Stories.'
        }),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'readingTime',
      title: 'Reading time (min)',
      type: 'internationalizedArrayNumber',
      description: 'Minutes to read, per language.',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'internationalizedArrayText',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayBlockContent',
    }),
  ],
  preview: {
    select: {
      title: 'title.0.value',
      tag: 'tag',
      seasonNumber: 'storySeries.seasonNumber',
      chapterNumber: 'chapterNumber',
      media: 'coverImage',
    },
    prepare: ({ title, tag, seasonNumber, chapterNumber, media }) => ({
      title,
      subtitle:
        tag === 'stories'
          ? `stories · Season ${seasonNumber ?? '?'} · Chapter ${chapterNumber ?? '?'}`
          : tag,
      media,
    }),
  },
})
