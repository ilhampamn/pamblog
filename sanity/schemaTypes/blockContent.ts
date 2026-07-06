import { defineType, defineArrayMember } from 'sanity'

/**
 * Portable Text — the Sanity equivalent of the old Markdoc body.
 *
 * Standard prose (headings, lists, links, images) plus the one custom node the
 * old system had: `linkedPost` — an inline reference to another article that
 * renders as a link with a hover preview card on the site.
 *
 * On the render side, `@portabletext/react` serializers in
 * `src/lib/portableText.tsx` map these members back to the SAME React
 * components the Markdoc renderer used, so output is visually identical.
 */
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule) =>
                  Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              },
            ],
          },
        ],
      },
    }),

    // Block-level image with a caption.
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt text' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),

    // The ported custom component: inline reference to another article.
    defineArrayMember({
      type: 'object',
      name: 'linkedPost',
      title: 'Linked Post',
      fields: [
        {
          name: 'post',
          type: 'reference',
          title: 'Referenced article',
          to: [{ type: 'article' }],
        },
      ],
      preview: {
        select: { title: 'post.title.0.value' },
        prepare: ({ title }) => ({ title: `↗ ${title ?? 'article'}` }),
      },
    }),
  ],
})
