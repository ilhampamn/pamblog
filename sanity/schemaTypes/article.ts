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
      name: 'storyChapter',
      title: 'Story chapter',
      type: 'reference',
      description:
        'Choose an existing chapter, or use “Create new” to add another one.',
      to: [{ type: 'articleChapter' }],
      hidden: ({ parent }) => parent?.tag !== 'stories',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { tag?: string } | undefined
          return parent?.tag !== 'stories' || value
            ? true
            : 'A story chapter is required for Stories.'
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

    // ── Pen notes ──────────────────────────────────────────────────────────
    // The hand-written layer of "The read-back proof" (DESIGN.md → Pen
    // rules). Every mark on the site has a target and is written by Ilham,
    // never generated — so they live here, and nothing is drawn where these
    // are empty. All optional.
    defineField({
      name: 'penWord',
      title: 'Circled word',
      type: 'internationalizedArrayString',
      fieldset: 'pen',
      description:
        'A word or short phrase from the excerpt to circle in pen. Must match the excerpt exactly; leave empty for no circle.',
    }),
    defineField({
      name: 'penHighlight',
      title: 'Highlighted phrase',
      type: 'internationalizedArrayString',
      fieldset: 'pen',
      description:
        'A phrase from the excerpt to mark with the yellow highlighter — the line that matters most. Must match the excerpt exactly; leave empty for none.',
    }),
    defineField({
      name: 'penLeadNote',
      title: 'Home page note',
      type: 'internationalizedArrayString',
      fieldset: 'pen',
      description:
        'A short note in your hand beside the cover on the home page, when this is the lead story. Something only you would know.',
    }),
    defineField({
      name: 'photoNotes',
      title: 'Photo callouts',
      type: 'array',
      fieldset: 'pen',
      description:
        'Numbered pen callouts on the cover photo, in order. Position is a percentage of the photo: 0,0 is the top-left corner, 100,100 the bottom-right.',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          name: 'photoNote',
          fields: [
            defineField({
              name: 'x',
              title: 'Left → right (%)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: 'y',
              title: 'Top → bottom (%)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0).max(100),
            }),
            defineField({
              name: 'note',
              title: 'Note',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { note: 'note.0.value', x: 'x', y: 'y' },
            prepare: ({ note, x, y }) => ({ title: note ?? '(note)', subtitle: `at ${x ?? '?'}%, ${y ?? '?'}%` }),
          },
        },
      ],
    }),
    defineField({
      name: 'marginNotes',
      title: 'Margin notes',
      type: 'array',
      fieldset: 'pen',
      description: 'Notes in the right margin, each beside a paragraph of the body (1 = the first paragraph).',
      of: [
        {
          type: 'object',
          name: 'marginNote',
          fields: [
            defineField({
              name: 'paragraph',
              title: 'Beside paragraph',
              type: 'number',
              validation: (Rule) => Rule.required().integer().min(1),
            }),
            defineField({
              name: 'note',
              title: 'Note',
              type: 'internationalizedArrayString',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { note: 'note.0.value', paragraph: 'paragraph' },
            prepare: ({ note, paragraph }) => ({ title: note ?? '(note)', subtitle: `¶ ${paragraph ?? '?'}` }),
          },
        },
      ],
    }),
    defineField({
      name: 'readBackPlace',
      title: 'Read back at (place)',
      type: 'internationalizedArrayString',
      fieldset: 'pen',
      description: 'Where you read this back, e.g. "Naryn". Shown in the read-back stamp at the end of the article.',
    }),
    defineField({
      name: 'readBackDate',
      title: 'Read back on (date)',
      type: 'date',
      fieldset: 'pen',
      description: 'Defaults to the published date.',
    }),
  ],
  fieldsets: [
    {
      name: 'pen',
      title: 'Pen notes',
      description: 'The hand-written layer. Optional — marks only appear where you have written something.',
      options: { collapsible: true, collapsed: true },
    },
  ],
  preview: {
    select: {
      title: 'title.0.value',
      tag: 'tag',
      seasonNumber: 'storyChapter.storySeries.seasonNumber',
      chapterNumber: 'storyChapter.chapterNumber',
      media: 'coverImage',
    },
    prepare: ({ title, tag, seasonNumber, chapterNumber, media }) => ({
      title,
      subtitle:
        tag === 'stories'
          ? `Season ${seasonNumber ?? '?'} · Chapter ${chapterNumber ?? '?'}`
          : tag,
      media,
    }),
  },
})
