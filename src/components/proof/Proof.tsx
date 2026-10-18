'use client'

import { useRef } from 'react'
import {
  lineTo,
  prng,
  seedFrom,
  toPaths,
  useInView,
  useWriteOn,
  type Pt,
} from './Mark'

/**
 * Proofreader's marks — the vocabulary that belongs to "the read-back proof"
 * and to nothing else (identity move A, decisions 2026-10-18). Each one keeps
 * its real proofing meaning, so the marks are never decoration:
 *
 *   ‸  caret     — "insert here": sits in the text where a margin note belongs
 *   ¶  pilcrow   — "new paragraph": marks the start of a section
 *
 * All drawn with the same ballpoint engine as Mark, and server-rendered
 * (fixed size, rounded paths).
 */

function Glyph({
  id,
  w,
  h,
  draw,
  className,
  label,
}: {
  id: string
  w: number
  h: number
  draw: (seed: number, r: () => number) => string[]
  className?: string
  label?: string
}) {
  const [holder, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const seed = seedFrom(id)
  const paths = draw(seed, prng(seed))
  useWriteOn(svg, seen, id, true)
  return (
    <span
      ref={holder}
      className={`tp-glyph ${className ?? ''}`}
      style={{ width: w, height: h }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg ref={svg} className="tp-ink" viewBox={`0 0 ${w} ${h}`}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  )
}

const j = (r: () => number, n = 1) => (r() - 0.5) * n

/** ‸ Insertion caret, drawn below the baseline pointing up at the gap. */
export function Caret({ id }: { id: string }) {
  return (
    <Glyph
      id={id}
      w={11}
      h={12}
      className="tp-caret"
      draw={(seed, r) => {
        const apex: Pt = [5.5 + j(r), 1.5 + j(r)]
        return [
          ...lineTo([0.8, 11 + j(r)], apex, seed),
          ...lineTo(apex, [10.2, 10.5 + j(r)], seed + 1),
        ]
      }}
    />
  )
}

/** ¶ Pilcrow: an open bowl and two stems, the way it's written by hand. */
export function Pilcrow({ id, size = 1 }: { id: string; size?: number }) {
  const w = 16 * size
  const h = 22 * size
  return (
    <Glyph
      id={id}
      w={w}
      h={h}
      className="tp-pilcrow"
      draw={(seed, r) => {
        const s = size
        const bowl: Pt[] = [
          [9 * s, 2 * s],
          [4.5 * s + j(r), 2.4 * s],
          [1.6 * s, 5.8 * s + j(r)],
          [3.2 * s, 9.8 * s],
          [9 * s, 10.6 * s + j(r)],
        ]
        return [
          ...toPaths(bowl, seed),
          ...lineTo([7.5 * s, 1.6 * s], [14.8 * s + j(r), 1.4 * s], seed + 1),
          ...lineTo([9 * s, 1.8 * s], [9 * s + j(r), 21 * s], seed + 2),
          ...lineTo([12.8 * s, 1.6 * s], [12.6 * s + j(r), 21 * s], seed + 3),
        ]
      }}
    />
  )
}

/**
 * The menu glyph: three short ballpoint strokes instead of a stock hamburger
 * icon (no icon sets — art direction Rule 26). Each stroke its own seed, the
 * last one a little shorter, the way three quick lines come out by hand.
 */
export function Burger({ id }: { id: string }) {
  return (
    <Glyph
      id={id}
      w={22}
      h={16}
      className="tp-burger"
      draw={(seed, r) =>
        [0, 1, 2].flatMap((i) => {
          const y = 2.5 + i * 5.5 + j(r, 0.8)
          const end = i === 2 ? 15 + j(r, 2) : 20 + j(r, 1)
          return lineTo([1.5 + j(r, 0.8), y], [end, y - 0.6 + j(r, 0.6)], seed + i)
        })
      }
    />
  )
}
