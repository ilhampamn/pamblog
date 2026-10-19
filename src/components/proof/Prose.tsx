import type { ReactNode } from 'react'
import type { PortableTextBlock } from '@portabletext/react'
import { renderPortableText } from '@/lib/portableText'
import { Mark } from './Mark'
import { Bracket } from './Pen'
import type { Locale } from '@/lib/i18n'

/**
 * Text helpers for the rebuilt pages. The pen only marks what Ilham wrote in
 * Sanity (article → Pen notes); with nothing written, these render plain type.
 */

/**
 * The excerpt with Ilham's marks, only where he wrote them in Sanity: the
 * circled word (pen) and the highlighted phrase (highlighter). Each must
 * match the excerpt exactly; if they overlap, the highlight wins.
 */
export function DekWithWord({
  text,
  word,
  highlight,
  id,
}: {
  text: string
  word?: string
  highlight?: string
  id: string
}) {
  type Span = { at: number; len: number; kind: 'hl' | 'word' }
  const spans: Span[] = []
  const hAt = highlight ? text.indexOf(highlight) : -1
  if (highlight && hAt >= 0) spans.push({ at: hAt, len: highlight.length, kind: 'hl' })
  const wAt = word ? text.indexOf(word) : -1
  if (word && wAt >= 0 && !spans.some((s) => wAt < s.at + s.len && wAt + word.length > s.at))
    spans.push({ at: wAt, len: word.length, kind: 'word' })
  spans.sort((a, b) => a.at - b.at)
  const out: ReactNode[] = []
  let i = 0
  for (const s of spans) {
    out.push(text.slice(i, s.at))
    const part = text.slice(s.at, s.at + s.len)
    out.push(
      s.kind === 'hl' ? (
        <mark key={`hl-${s.at}`} className="tp-hl">
          {part}
        </mark>
      ) : (
        <Mark key={`w-${s.at}`} id={`${id}:word`} kind="circle">
          {part}
        </Mark>
      )
    )
    i = s.at + s.len
  }
  out.push(text.slice(i))
  return <>{out}</>
}

function isEmptyBlock(block: PortableTextBlock) {
  return (
    block._type === 'block' &&
    ((block.children as { text?: string }[] | undefined) ?? []).every((c) => !c.text?.trim())
  )
}

function isNormalParagraph(block: PortableTextBlock) {
  return block._type === 'block' && (block.style ?? 'normal') === 'normal' && !('listItem' in block && block.listItem)
}

/**
 * The article body in a reading column with a right margin for pen notes
 * (DESIGN.md → Layout). A margin note sits beside its paragraph (1-based,
 * counting ordinary paragraphs), with a pen bracket beside the passage. The
 * rest of the body renders as normal Portable Text, so lists and images keep
 * their grouping.
 */
export function ArticleBody({
  blocks,
  notes,
  locale,
  id,
}: {
  blocks: PortableTextBlock[] | null
  notes: { paragraph: number; note: string }[]
  locale: Locale
  id: string
}) {
  if (!blocks?.length) return null
  const byParagraph = new Map(notes.map((n) => [n.paragraph, n.note]))
  const segments: { blocks: PortableTextBlock[]; note?: string; n?: number }[] = []
  let run: PortableTextBlock[] = []
  let count = 0
  for (const block of blocks) {
    // Empty blocks (Enter pressed twice in the Studio) don't render, so they
    // don't count as paragraphs either — the numbers match what Ilham sees.
    if (isEmptyBlock(block)) continue
    if (isNormalParagraph(block)) {
      count += 1
      const note = byParagraph.get(count)
      if (note) {
        if (run.length) segments.push({ blocks: run })
        run = []
        segments.push({ blocks: [block], note, n: count })
        continue
      }
    }
    run.push(block)
  }
  if (run.length) segments.push({ blocks: run })

  return (
    <div className="tp-body">
      {segments.map((seg, i) =>
        seg.note ? (
          <div key={i} className="tp-body__row">
            <Bracket id={`${id}:bracket-${seg.n}`} className="tp-body__text">
              {renderPortableText(seg.blocks, locale)}
            </Bracket>
            <aside className="tp-sidenote">
              <span className="tp-hand">{seg.note}</span>
            </aside>
          </div>
        ) : (
          <div key={i} className="tp-body__row">
            <div className="tp-body__text">{renderPortableText(seg.blocks, locale)}</div>
          </div>
        )
      )}
    </div>
  )
}
