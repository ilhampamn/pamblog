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
        ],
      },
      initialValue: 'essay',
      validation: (Rule) => Rule.required(),
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
    select: { title: 'title.0.value', subtitle: 'tag', media: 'coverImage' },
  },
})
