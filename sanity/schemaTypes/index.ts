import { type SchemaTypeDefinition } from 'sanity'

import { blockContent } from './blockContent'
import { article } from './article'
import { about } from './about'
import { country, city, destination } from './place'
import { itinerary } from './itinerary'
import { story } from './story'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  blockContent,
  // Documents
  article,
  about,
  country,
  city,
  destination,
  itinerary,
  story,
]
