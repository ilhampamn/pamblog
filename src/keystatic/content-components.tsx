import { fields } from '@keystatic/core'
import { inline } from '@keystatic/core/content-components'

/**
 * Custom content components available inside the Markdoc body of every article.
 *
 * These definitions are the EDITOR side of the contract — they describe the
 * field(s) an author fills in and how the node previews inside Keystatic's
 * editor. The SITE side (the real hover card) lives in
 * `src/components/LinkedPost.tsx` and is wired up in `src/lib/markdoc.tsx`.
 *
 * One object, imported in two places:
 *  - `keystatic.config.ts`  → so the component appears in the editor's insert menu
 *  - `src/lib/markdoc.tsx`   → so the renderer knows the tag's schema/attributes
 *
 * On disk a `linkedPost` serialises to a Markdoc tag, e.g.
 *   {% linkedPost post="light-and-shadow" /%}
 */
export const articleComponents = {
  linkedPost: inline({
    label: 'Linked Post',
    description:
      'Reference another article. On the site it becomes a link with a hover preview card (cover, title, excerpt).',
    schema: {
      post: fields.relationship({
        label: 'Referenced article',
        description: 'The article this links to.',
        collection: 'articles',
      }),
    },
    // Editor-only preview. The real hover card is rendered on the site.
    ContentView: ({ value }) => (
      <span style={{ color: '#C4785A', fontWeight: 600 }}>
        ↗ {value.post ?? 'pick an article…'}
      </span>
    ),
  }),
}
