'use client'

import { useRef } from 'react'
import {
  prng,
  seedFrom,
  toPaths,
  useInView,
  useMounted,
  useWriteOn,
  type Pen,
  type Pt,
} from '@/components/experiment4/Ex4Mark'

/**
 * Post-office marks for /experiment-6 — the postcard home.
 *
 * The cancellation is the one mark on a postcard that someone else's hand
 * makes, and it carries real information: where and when. Here it becomes
 * the folio — place and date — inked over the stamp.
 */
export const STAMP_INK: Pen = { roughness: 0.7, bowing: 0.5 }

function ring(cx: number, cy: number, r: number, rand: () => number): Pt[] {
  const pts: Pt[] = []
  const steps = 30
  const start = rand() * Math.PI * 2
  for (let i = 0; i <= steps + 1; i++) {
    const a = start + (i / steps) * Math.PI * 2
    const rr = r * (1 + (rand() - 0.5) * 0.025)
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr])
  }
  return pts
}

function wave(x0: number, x1: number, y: number, amp: number, rand: () => number): Pt[] {
  const pts: Pt[] = []
  const steps = 24
  const phase = rand() * Math.PI
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps
    pts.push([x, y + Math.sin(phase + (i / steps) * Math.PI * 4) * amp])
  }
  return pts
}

/**
 * Circular date stamp + wavy cancellation lines. The ring text is typeset
 * (a post office stamp is a die, not handwriting); only the impression — the
 * slightly uneven rings and waves — is drawn.
 */
export function Ex6Postmark({
  id,
  place,
  date,
  center,
  width = 260,
}: {
  id: string
  place: string
  date: string
  center: string
  width?: number
}) {
  const [holder, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const mounted = useMounted()
  const H = 112
  const cx = 56
  const cy = 56
  const seed = seedFrom(id)

  let paths: string[] = []
  if (mounted) {
    const r = prng(seed)
    paths = [
      ...toPaths(ring(cx, cy, 50, r), seed, STAMP_INK),
      ...toPaths(ring(cx, cy, 33, r), seed + 1, STAMP_INK),
      ...[0, 1, 2, 3].flatMap((i) =>
        toPaths(wave(cx + 58, width - 4, 26 + i * 20, 4.5, r), seed + 2 + i, STAMP_INK)
      ),
    ]
  }
  useWriteOn(svg, seen && mounted, mounted ? 'postmark' : '')

  const pathId = `ex6-ring-${seed}`
  return (
    <span ref={holder} className="ex6-postmark" style={{ width, height: H }}>
      <svg ref={svg} className="ex4-ink" viewBox={`0 0 ${width} ${H}`} aria-hidden>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
      <svg className="ex6-postmark__type" viewBox={`0 0 ${width} ${H}`} aria-hidden>
        <defs>
          <path
            id={pathId}
            d={`M ${cx - 41} ${cy} a 41 41 0 1 1 82 0 a 41 41 0 1 1 -82 0`}
          />
        </defs>
        <text>
          <textPath href={`#${pathId}`} startOffset="2%">
            {place} · {date} ·
          </textPath>
        </text>
        <text x={cx} y={cy + 5} textAnchor="middle" className="ex6-postmark__center">
          {center}
        </text>
      </svg>
      <span className="sr-only">
        Postmarked {place}, {date}
      </span>
    </span>
  )
}

/** A single wavy cancellation line used as a section break. */
export function Ex6Wave({ id, width = 180 }: { id: string; width?: number }) {
  const [holder, seen] = useInView<HTMLDivElement>()
  const svg = useRef<SVGSVGElement>(null)
  const mounted = useMounted()
  const seed = seedFrom(id)
  const paths = mounted
    ? [0, 1].flatMap((i) => toPaths(wave(4, width - 4, 10 + i * 12, 4, prng(seed + i)), seed + i, STAMP_INK))
    : []
  useWriteOn(svg, seen && mounted, mounted ? 'wave' : '')
  return (
    <div ref={holder} className="ex6-wave" role="separator">
      <svg ref={svg} aria-hidden className="ex4-ink" viewBox={`0 0 ${width} 34`} width={width} height={34}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  )
}
