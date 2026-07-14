import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { internationalizedArray } from 'sanity-plugin-internationalized-array'

import { schemaTypes } from './sanity/schemaTypes'
import { apiVersion, dataset, projectId } from './sanity/env'
import { LANGUAGES } from './src/lib/i18n'

/**
 * Sanity Studio, embedded in the Next app at /studio.
 *
 * i18n is FIELD-LEVEL: the internationalizedArray plugin generates the
 * `internationalizedArray{String,Text,Number,BlockContent}` field types used
 * throughout the schemas, seeded from the SAME language list the site uses
 * (`LANGUAGES` in src/lib/i18n.ts). Add a language there and it appears here.
 */
export default defineConfig({
  name: 'default',
  title: 'Ilham Pamungkas',
  basePath: '/studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // About is a singleton — fixed document id, no create/delete.
            S.listItem()
              .title('About page')
              .id('about')
              .child(S.document().schemaType('about').documentId('about')),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) => item.getId() !== 'about'
            ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
    internationalizedArray({
      languages: LANGUAGES.map((l) => ({ id: l.id, title: l.title })),
      // Show every language's input by default — editors see EN/ID/ZH fields
      // immediately instead of clicking "+ ID" / "+ ZH" per field.
      defaultLanguages: LANGUAGES.map((l) => l.id),
      fieldTypes: [
        'string',
        'text',
        'number',
        { name: 'blockContent', type: 'blockContent', title: 'Body' },
      ],
    }),
  ],
})
