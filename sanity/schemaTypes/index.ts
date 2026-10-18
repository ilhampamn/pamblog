import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { article } from './article'
import { about } from './about'
import { country, city, destination } from './place'
import { itinerary } from './itinerary'
import { story } from './story'
import { articleSeries } from './articleSeries'
import { articleChapter } from './articleChapter'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  blockContent,
  // Documents
  article,
  articleSeries,
  articleChapter,
  about,
  country,
  city,
  destination,
  itinerary,
  story,
]
