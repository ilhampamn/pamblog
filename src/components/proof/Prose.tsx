import type { PortableTextBlock } from '@portabletext/react'
import { renderPortableText } from '@/lib/portableText'
import { Mark } from './Mark'
import { Bracket } from './Pen'
import type { Locale } from '@/lib/i18n'

/**
 * Text helpers for the rebuilt pages. The pen only marks what Ilham wrote in
 * Sanity (article → Pen notes); with nothing written, these render plain type.
 */

/** The excerpt with Ilham's chosen word circled — only if it appears exactly. */
export function DekWithWord({ text, word, id }: { text: string; word?: string; id: string }) {
  if (!word) return <>{text}</>
  const at = text.indexOf(word)
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <Mark id={`${id}:word`} kind="circle">
        {word}
      </Mark>
      {text.slice(at + word.length)}
    </>
  )
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
