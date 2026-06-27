import type { Node } from '@markdoc/markdoc'
import { reader, resolveContent } from '@/lib/reader'

/**
 * Walk a Markdoc AST and collect every slug referenced by a
 * {% linkedPost post="<slug>" /%} tag.
 */
function collectRefs(node: Node): string[] {
  const refs: string[] = []

  if (node.type === 'tag' && node.tag === 'linkedPost') {
    const post = (node.attributes as Record<string, unknown>)?.post
    if (typeof post === 'string' && post) refs.push(post)
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) refs.push(...collectRefs(child))
  }

  return refs
}

/**
 * A map from referenced slug → array of slugs that link to it.
 *
 * Example:
 *   { 'light-and-shadow': ['building-in-public', 'tools-i-use'] }
 *
 * Meaning "light-and-shadow" is referenced in both other articles.
 */
export type BacklinkIndex = Record<string, string[]>

// Module-level cache: computed once per build process, reused across
// all post pages rendered in the same `next build` run.
let _cache: BacklinkIndex | null = null

/**
 * Scan every article's EN + ID bodies for linkedPost tags and build
 * the reverse index.  Result is memoised so N post pages only pay
 * the cost once per build.
 */
export async function buildBacklinkIndex(): Promise<BacklinkIndex> {
  if (_cache) return _cache

  const slugs = await reader.collections.articles.list()
  const index: Record<string, string[]> = {}

  await Promise.all(
    slugs.map(async (slug) => {
      const entry = await reader.collections.articles.read(slug)
      if (!entry) return

      // Scan both language bodies — either can contain different linkedPost refs.
      const [enResult, idResult] = await Promise.all([
        resolveContent(entry.content),
        resolveContent(entry.contentId),
      ])

      // Deduplicate refs within this article before adding to the index.
      const allRefs = collectRefs(enResult.node).concat(collectRefs(idResult.node))
      const refs = allRefs.filter((r, i) => allRefs.indexOf(r) === i)

      for (const ref of refs) {
        if (ref === slug) continue // skip self-references
        if (!index[ref]) index[ref] = []
        if (!index[ref].includes(slug)) index[ref].push(slug)
      }
    })
  )

  _cache = index as BacklinkIndex

  return _cache
}

/**
 * Convenience: return just the backlinks for one article slug.
 * Returns an empty array if nothing links to it yet.
 */
export async function getBacklinksFor(slug: string): Promise<string[]> {
  const index = await buildBacklinkIndex()
  return index[slug] ?? []
}
