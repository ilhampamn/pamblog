import { defineType, defineField } from 'sanity'

/**
 * About — a singleton (one document, id "about"). Field-level i18n throughout.
 * Mirrors the old Keystatic `about` singleton: intro/introId, body/bodyId,
 * the "Currently" list, and the contact block.
 */
export const about = defineType({
  name: 'about',
  title: 'About page',
  type: 'document',
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'internationalizedArrayString' }),
    defineField({ name: 'body', title: 'Body', type: 'internationalizedArrayBlockContent' }),

    defineField({ name: 'currentlyLabel', title: '"Currently" label', type: 'internationalizedArrayString' }),
    defineField({
      name: 'currently',
      title: 'Currently items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'currentlyItem',
          fields: [
            { name: 'label', title: 'Label', type: 'internationalizedArrayString' },
            { name: 'value', title: 'Value', type: 'internationalizedArrayString' },
          ],
          preview: { select: { title: 'label.0.value', subtitle: 'value.0.value' } },
        },
      ],
    }),

    defineField({ name: 'contactLabel', title: 'Contact label', type: 'internationalizedArrayString' }),
    defineField({ name: 'contactBody', title: 'Contact blurb', type: 'internationalizedArrayText' }),
    defineField({ name: 'email', title: 'Email address', type: 'string' }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
})
