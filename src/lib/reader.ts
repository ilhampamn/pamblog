import { createReader } from '@keystatic/core/reader'
import type { Node } from '@markdoc/markdoc'
import keystaticConfig from '../../keystatic.config'

/**
 * Single shared reader instance (Node module cache ensures this is created
 * once per process, reused across all imports).
 */
export const reader = createReader(process.cwd(), keystaticConfig)

/**
 * A Markdoc body field can come back as an already-resolved object (when it is
 * the inline contentField) or as a lazy async function (when it is a sibling
 * file). This helper normalises both shapes.
 */
export type ContentValue = { node: Node } | (() => Promise<{ node: Node }>)

export async function resolveContent(value: ContentValue): Promise<{ node: Node }> {
  return typeof value === 'function' ? value() : value
}
