'use client'

import Link from 'next/link'
import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { lineTo, polyTo, prng, riseFor, seedFrom, toPaths, useInView, useWriteOn, type Pen, type Pt } from './Ex4Mark'

/**
 * More of the pen, ported from ideas in rough-notation (design/references/
 * pshihn-tools.md) but kept on our own engine — seeded, single stroke, open
 * and right-handed — which rough-notation can't do.
 */

type LineBox = { x: number; y: number; w: number; h: number }

/**
 * The target's line boxes, relative to its containing block. One entry per
 * visual line, so a phrase that wraps gets a mark on every line it covers.
 */
function useLineBoxes(span: React.RefObject<HTMLSpanElement>) {
  const [state, setState] = useState<{ lines: LineBox[]; w: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = span.current
    if (!el) return
    const measure = () => {
      const host = (el.offsetParent as HTMLElement | null) ?? document.body
      const hr = host.getBoundingClientRect()
      const ox = hr.left + host.clientLeft
      const oy = hr.top + host.clientTop
      // Merge the fragments the browser reports for each line.
      const lines: LineBox[] = []
      for (const r of Array.from(el.getClientRects())) {
        if (r.width < 1) continue
        const last = lines[lines.length - 1]
        if (last && Math.abs(last.y - (r.top - oy)) < 3) {
          const right = Math.max(last.x + last.w, r.right - ox)
          last.x = Math.min(last.x, r.left - ox)
          last.w = right - last.x
        } else {
          lines.push({ x: r.left - ox, y: r.top - oy, w: r.width, h: r.height })
        }
      }
      // Size the drawing to the lines themselves (plus room for the stroke),
      // not to the host: an inline host reports a scroll size of 0.
      const w = Math.ceil(Math.max(0, ...lines.map((l) => l.x + l.w)) + 8)
      const h = Math.ceil(Math.max(0, ...lines.map((l) => l.y + l.h)) + 8)
      setState({ lines, w, h })
    }
    measure()
    // ResizeObserver never fires for an inline element, and offsetParent is
    // null while an ancestor is hidden (e.g. the closed contents panel). So
    // watch the nearest block ancestor: it goes from 0 to its real size when
    // it's revealed, and on every reflow after that.
    const ro = new ResizeObserver(measure)
    let block: HTMLElement | null = el.parentElement
    while (block && getComputedStyle(block).display.startsWith('inline')) block = block.parentElement
    if (block) ro.observe(block)
    return () => ro.disconnect()
  }, [span])
  return state
}

/**
 * Underline, strike-through or dashed underline across however many lines the
 * phrase wraps onto. Strike-through is the proofreader's delete; dashed means
 * planned — not yet travelled, not yet written.
 */
export function Ex4Line({
  id,
  kind = 'underline',
  children,
  pen,
  className,
}: {
  id: string
  kind?: 'underline' | 'strike' | 'dashed'
  children: ReactNode
  pen?: Pen
  className?: string
}) {
  const [span, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const geo = useLineBoxes(span)
  const seed = seedFrom(id)

  const paths: string[] = []
  if (geo) {
    const r = prng(seed)
    geo.lines.forEach((l, i) => {
      const s = seed + i * 7
      const rise = riseFor(l.w)
      if (kind === 'strike') {
        const y = l.y + l.h * 0.56
        paths.push(...toPaths([[l.x - 2, y + 1], [l.x + l.w / 2, y + (r() - 0.5)], [l.x + l.w + 2, y - rise * 0.6]], s, pen))
      } else {
        const y = l.y + l.h - 1
        if (kind === 'dashed') {
          // Dashes are separate short strokes, so each one writes on in turn.
          for (let x = l.x; x < l.x + l.w; x += 11) {
            const x2 = Math.min(x + 6, l.x + l.w)
            const t = (x - l.x) / l.w
            paths.push(...lineTo([x, y + 1 - rise * t], [x2, y + 1 - rise * ((x2 - l.x) / l.w)], s + x, pen))
          }
        } else {
          paths.push(...toPaths([[l.x - 2, y + 2], [l.x + l.w / 2, y + 1 - rise / 2 + (r() - 0.5) * 1.2], [l.x + l.w + 3, y + 1 - rise]], s, pen))
        }
      }
    })
  }
  useWriteOn(svg, seen && paths.length > 0, geo ? `${geo.w}x${geo.h}:${geo.lines.length}` : '')

  return (
    <span ref={span} className={`ex4-line ${className ?? ''}`}>
      {children}
      {geo && (
        <svg
          ref={svg}
          aria-hidden
          className="ex4-ink"
          style={{ left: 0, top: 0, width: geo.w, height: geo.h }}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      )}
    </span>
  )
}

/**
 * A margin bracket beside a whole passage: "this, all of it" — the proofing
 * mark for a comment that applies to a paragraph rather than a word.
 */
export function Ex4Bracket({
  id,
  side = 'right',
  children,
  className,
}: {
  id: string
  side?: 'left' | 'right'
  children: ReactNode
  className?: string
}) {
  const [block, seen] = useInView<HTMLDivElement>()
  const svg = useRef<SVGSVGElement>(null)
  const [h, setH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = block.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(Math.round(el.getBoundingClientRect().height)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [block])

  const W = 10
  const seed = seedFrom(id)
  let paths: string[] = []
  if (h) {
    const r = prng(seed)
    const top = 4
    const bot = h - 8
    // Drawn top to bottom: hook in, the long stroke down, hook back out.
    const spine: Pt[] = [
      [1, top],
      [W - 3, top + 3],
      [W - 2 + (r() - 0.5), (top + bot) / 2],
      [W - 3, bot - 3],
      [1, bot],
    ]
    paths = toPaths(spine, seed, { roughness: 0.7, bowing: 0.4 })
  }
  useWriteOn(svg, seen && paths.length > 0, h ? String(h) : '')

  return (
    <div ref={block} className={`ex4-bracket ex4-bracket--${side} ${className ?? ''}`}>
      {children}
      {h && (
        <svg
          ref={svg}
          aria-hidden
          className="ex4-ink"
          style={{ height: h, width: W, transform: side === 'left' ? 'scaleX(-1)' : undefined }}
          viewBox={`0 0 ${W} ${h}`}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      )}
    </div>
  )
}

/**
 * The secondary button: a typeset link that the pen underlines on hover or
 * focus — the site's signature interaction. Drawn with `pathLength="1"` so
 * CSS can write it on and lift it off without measuring.
 */
export function Ex4PenLink({
  id,
  href,
  submit,
  children,
  className,
}: {
  id: string
  /** A link… */
  href?: string
  /** …or a form's submit button ("Send →"), with the same pen underline. */
  submit?: boolean
  children: ReactNode
  className?: string
}) {
  const label = useRef<HTMLSpanElement>(null)
  const [w, setW] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = label.current
    if (!el) return
    const ro = new ResizeObserver(() => setW(Math.round(el.getBoundingClientRect().width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const seed = seedFrom(id)
  const rise = w ? riseFor(w) : 0
  const paths = w ? toPaths([[0, 6], [w / 2, 5 - rise / 2 + (prng(seed)() - 0.5)], [w + 2, 5 - rise]], seed) : []

  const inner = (
    <>
      <span ref={label} className="ex4-penlink__label">
        {children}
      </span>
      {w && (
        <svg aria-hidden className="ex4-ink" viewBox={`0 0 ${w + 4} 10`} style={{ width: w + 4, height: 10 }}>
          {paths.map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </svg>
      )}
    </>
  )
  return submit || !href ? (
    <button type={submit ? 'submit' : 'button'} className={`ex4-penlink ${className ?? ''}`}>
      {inner}
    </button>
  ) : (
    <Link href={href} className={`ex4-penlink ${className ?? ''}`}>
      {inner}
    </Link>
  )
}

/**
 * The future "save" control (art direction, Rule 17): typeset "Save", and when
 * saved, the pen ticks it. The only control the pen ever draws on.
 */
export function Ex4Save({ id }: { id: string }) {
  const [saved, setSaved] = useState(false)
  const seed = seedFrom(id)
  // One stroke, the way a tick is written: short down leg, then the flick.
  const tick = polyTo([[2, 9], [7, 14], [17, 1]], seed, { roughness: 0.5, bowing: 0.3 })
  return (
    <button
      type="button"
      className={`ex4-save ${saved ? 'is-saved' : ''}`}
      aria-pressed={saved}
      onClick={() => setSaved((s) => !s)}
    >
      <span className="ex4-save__box" aria-hidden>
        <svg className="ex4-ink" viewBox="0 0 20 16">
          {tick.map((d, i) => (
            <path key={i} d={d} pathLength={1} />
          ))}
        </svg>
      </span>
      <span>{saved ? 'Saved' : 'Save'}</span>
    </button>
  )
}
