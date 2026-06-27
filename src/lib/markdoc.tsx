import * as React from 'react'
import Markdoc, { type Node } from '@markdoc/markdoc'
import { fields } from '@keystatic/core'
import { articleComponents } from '@/keystatic/content-components'
import { LinkedPost } from '@/components/LinkedPost'
import type { Locale } from '@/lib/i18n'

/**
 * Build the Markdoc config from the SAME component definitions the editor uses,
 * so authored tags (e.g. `{% linkedPost post="…" /%}`) resolve to render tags.
 * `render.tags` maps the component key → the JSX tag name we provide below.
 */
const markdocConfig = fields.markdoc.createMarkdocConfig({
  components: articleComponents,
  render: { tags: { linkedPost: 'LinkedPost' } },
})

/**
 * Render an article body (a Markdoc AST node from the reader) to React.
 * Runs on the server; the `locale` is closed over so custom components can
 * resolve links and copy in the right language.
 */
export function renderArticleBody(node: Node, locale: Locale): React.ReactNode {
  const renderable = Markdoc.transform(node, markdocConfig)
  return Markdoc.renderers.react(renderable, React, {
    components: {
      // The referenced article is resolved inside LinkedPost (async server
      // component) from the `post` attribute (a slug string).
      LinkedPost: (props: { post?: string | null }) => (
        <LinkedPost slug={props.post ?? null} locale={locale} />
      ),
    },
  })
}
