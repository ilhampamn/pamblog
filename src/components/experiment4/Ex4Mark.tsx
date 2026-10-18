'use client'

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import rough from 'roughjs'
import './ex4-ink.css'

/**
 * The ballpoint for /experiment-4 — "The read-back proof" (design/art-direction.md).
 *
 * One pen, everywhere: the art direction's Rules 1–5 are enforced here rather
 * than left to each call site.
 *
 *  - Drawn at the target's measured size (ResizeObserver) in a viewBox that
 *    matches it 1:1, so the stroke is the same 1.25px on a two-letter word and
 *    on a whole heading. exp1 stretched one drawing with
 *    preserveAspectRatio="none", which is why its circle changed weight.
 *  - Seeded from a hash of the mark's id, never Math.random: the same mark is
 *    the same stroke on every load and in every locale.
 *  - A right-handed writer: circles start near 1 o'clock, run anticlockwise,
 *    stay open and overshoot; underlines run left to right and rise ~1°.
 *  - Even width, no fills, no taper — a ballpoint, not a brush.
 *  - Draws on once, at hand speed, when it enters the viewport. Reduced motion
 *    gets the finished mark immediately.
 *
 * Experiments 5 and 6 reuse this engine with a different pen: colour and
 * stroke width come from `--mark-ink` / `--mark-stroke` on the page, and the
 * `pen` prop adjusts rough's hand (a grease pencil wobbles more than a biro).
 */

const STROKE = 1.25
export type Pen = { roughness?: number; bowing?: number }

const PEN = {
  roughness: 0.9,
  bowing: 0.8,
  strokeWidth: STROKE,
  disableMultiStroke: true,
  preserveVertices: true,
} as const

export { seedFrom, prng } from './inkMath'
import { seedFrom, prng } from './inkMath'

export type Pt = [number, number]

/**
 * A right-handed underline rises about 1°, but a hand doesn't keep climbing
 * across a long line — past ~170px the rise is capped at 3px, or it runs up
 * into the words.
 */
export function riseFor(width: number) {
  return Math.min(Math.tan(Math.PI / 180) * width, 3)
}

type Generator = ReturnType<typeof rough.generator>
type Drawable = ReturnType<Generator['line']>

/**
 * Path data rounded to 2 decimals. Node and the browser disagree in the last
 * float digit, which used to force marks to be client-only (a hydration
 * mismatch otherwise). Rounded, the server and client strings are identical,
 * so fixed-size marks render on the server: visible before JS, no flash.
 * (rough.js's own `toPaths` ignores `fixedDecimalPlaceDigits`; `opsToPath`
 * takes it directly.)
 */
function strokesOf(gen: Generator, drawable: Drawable) {
  return drawable.sets.filter((set) => set.type === 'path').map((set) => gen.opsToPath(set, 2))
}

export function toPaths(points: Pt[], seed: number, pen?: Pen) {
  const gen = rough.generator()
  return strokesOf(gen, gen.curve(points, { ...PEN, ...pen, seed, stroke: 'currentColor' }))
}

export function lineTo(a: Pt, b: Pt, seed: number, pen?: Pen) {
  const gen = rough.generator()
  return strokesOf(gen, gen.line(a[0], a[1], b[0], b[1], { ...PEN, ...pen, seed, stroke: 'currentColor' }))
}

/** A connected polyline in one stroke — e.g. an arrowhead drawn as a single "V". */
export function polyTo(points: Pt[], seed: number, pen?: Pen) {
  const gen = rough.generator()
  return strokesOf(gen, gen.linearPath(points, { ...PEN, ...pen, seed, stroke: 'currentColor' }))
}

/** Open, overshooting loop around a w×h box, starting near 1 o'clock. */
export function circlePoints(w: number, h: number, pad: number, rand: () => number): Pt[] {
  const cx = w / 2 + pad
  const cy = h / 2 + pad
  const rx = w / 2 + pad * 0.7
  const ry = h / 2 + pad * 0.55
  const start = (-60 * Math.PI) / 180
  const overshoot = ((15 + rand() * 15) * Math.PI) / 180
  const sweep = Math.PI * 2 + overshoot
  const steps = 26
  const pts: Pt[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // Anticlockwise on screen = decreasing angle in SVG's y-down space.
    const a = start - sweep * t
    // The loop opens as it goes: the end lands a little outside the start.
    const grow = 1 + t * 0.07 + (rand() - 0.5) * 0.02
    pts.push([cx + Math.cos(a) * rx * grow, cy + Math.sin(a) * ry * grow])
  }
  return pts
}

function underlinePoints(w: number, h: number, pad: number, rand: () => number): Pt[] {
  const y = h + pad * 0.35
  const rise = riseFor(w)
  return [
    [pad - 2, y + 1],
    [pad + w * 0.5, y - rise * 0.5 + (rand() - 0.5) * 1.2],
    [pad + w + 3, y - rise],
  ]
}

/**
 * Client-only rendering, for marks whose geometry depends on the page (the
 * postmark and grease-pencil marks in experiments 5–6). Fixed-size marks no
 * longer need it now that paths are rounded (see `strokesOf`).
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}

export function useInView<T extends Element>() {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setSeen(true),
      { threshold: 0.6 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])
  return [ref, seen] as const
}

/**
 * Page-level drawing order (design/specs/motion.md §3): marks that come into
 * view together are written one after another, in the order they entered —
 * but the queue never makes a mark wait more than 400ms. It used to keep
 * growing with marks the reader had already scrolled past, so after a fast
 * scroll new marks sat blank for seconds.
 */
let queueEnd = 0
const QUEUE_MAX_WAIT = 400
/**
 * Ink never writes on a moving sheet (motion.md, Never 14): a slide calls
 * `holdInk(duration + 120)` and any mark that comes into view meanwhile waits
 * until the sheet has been still for 120ms.
 */
let inkHoldUntil = 0
export function holdInk(ms: number) {
  inkHoldUntil = Math.max(inkHoldUntil, performance.now() + ms)
}
const PEN_LIFT = 70 // between strokes of one mark
const WRITE_EASE = 'cubic-bezier(.45, .05, .55, .95)' // ≈ minimum-jerk hand velocity

/** Hand speed: 60ms + 1.45ms per px, capped at 800ms (≈495ms for 300px). */
export function strokeDuration(length: number) {
  return Math.min(800, 60 + 1.45 * length)
}

/**
 * Writes each <path> in `svg` on, in DOM order, at hand speed, with a short
 * pen-lift between strokes.
 *
 * `ssr`: the paths were in the server HTML. If such a mark is already on
 * screen when the page hydrates, it stays as drawn — hiding and redrawing it
 * would flash. Once a mark has been drawn it is never redrawn (a resize just
 * re-lays it out).
 */
export function useWriteOn(
  svg: React.RefObject<SVGSVGElement>,
  go: boolean,
  key: string,
  ssr = false
) {
  const drawn = useRef(false)
  const firstLayout = useRef(true)
  useLayoutEffect(() => {
    const root = svg.current
    if (!root) return
    const paths = Array.from(root.querySelectorAll('path'))
    if (!paths.length) return
    const show = () =>
      paths.forEach((p) => {
        p.style.strokeDasharray = ''
        p.style.strokeDashoffset = ''
        p.style.transition = ''
      })

    if (firstLayout.current) {
      firstLayout.current = false
      const r = root.getBoundingClientRect()
      if (ssr && r.bottom > 0 && r.top < window.innerHeight) drawn.current = true
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || drawn.current) {
      show()
      return
    }

    const lengths = paths.map((p) => p.getTotalLength())
    paths.forEach((p, i) => {
      p.style.transition = 'none'
      p.style.strokeDasharray = `${lengths[i]}`
      p.style.strokeDashoffset = `${lengths[i]}`
    })
    if (!go) return

    drawn.current = true
    const now = performance.now()
    let t = Math.max(Math.min(Math.max(0, queueEnd - now), QUEUE_MAX_WAIT), inkHoldUntil - now)
    paths.forEach((p, i) => {
      const dur = strokeDuration(lengths[i])
      // Force a style flush so the transition starts from the undrawn state.
      void p.getBoundingClientRect()
      p.style.transition = `stroke-dashoffset ${dur}ms ${WRITE_EASE} ${t}ms`
      p.style.strokeDashoffset = '0'
      t += dur + (i < paths.length - 1 ? PEN_LIFT : 0)
    })
    queueEnd = now + t
  }, [go, key, svg, ssr])
}

interface MarkProps {
  /** Stable id, e.g. `${docId}:dek-circle`. Seeds the stroke. */
  id: string
  kind: 'circle' | 'underline'
  children: ReactNode
  className?: string
  pen?: Pen
}

/** Wraps a word or phrase and draws a circle or underline around it. */
export function Ex4Mark({ id, kind, children, className, pen }: MarkProps) {
  const [wrap, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setBox((prev) =>
        prev && Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1
          ? prev
          : { w: r.width, h: r.height }
      )
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [wrap])

  const pad = kind === 'circle' ? 10 : 6
  const seed = seedFrom(id)
  const paths = box
    ? toPaths(
        (kind === 'circle' ? circlePoints : underlinePoints)(box.w, box.h, pad, prng(seed)),
        seed,
        pen
      )
    : []

  useWriteOn(svg, seen && paths.length > 0, box ? `${box.w}x${box.h}` : '')

  const style: CSSProperties | undefined = box
    ? { left: -pad, top: -pad, width: box.w + pad * 2, height: box.h + pad * 2 }
    : undefined

  return (
    <span ref={wrap} className={`ex4-mark ${className ?? ''}`}>
      {children}
      {box && (
        <svg
          ref={svg}
          aria-hidden
          className="ex4-ink"
          style={style}
          viewBox={`0 0 ${box.w + pad * 2} ${box.h + pad * 2}`}
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
 * The pointer (decisions 2026-10-18, "B · single gesture"): one continuous
 * stroke along the curve, into the tip and back out along the first barb;
 * then the pen lifts and adds the second, shorter barb — the way an arrow is
 * actually written. The curve is sampled so the head follows its exact end
 * tangent, and the shaft uses a calmer pen (a fast flick is smooth, not
 * shaky). This replaced a head of two loose strokes on an approximate angle.
 */
const CALM: Pen = { roughness: 0.35, bowing: 0.2 }

function quad(a: Pt, c: Pt, b: Pt, t: number): Pt {
  const u = 1 - t
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]
}

function arrowPaths(a: Pt, b: Pt, bend: number, seed: number, pen?: Pen): string[] {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const ctrl: Pt = [(a[0] + b[0]) / 2 - dy * bend, (a[1] + b[1]) / 2 + dx * bend]
  const steps = Math.max(8, Math.round(Math.hypot(dx, dy) / 14))
  const shaft: Pt[] = []
  for (let i = 0; i <= steps; i++) shaft.push(quad(a, ctrl, b, i / steps))
  // Exact end direction: d/dt at t=1 is 2·(b − ctrl). Hands make the barbs unequal.
  const ang = Math.atan2(b[1] - ctrl[1], b[0] - ctrl[0])
  const barb = (spread: number, l: number): Pt => [b[0] - Math.cos(ang + spread) * l, b[1] - Math.sin(ang + spread) * l]
  return [...polyTo([...shaft, barb(-0.42, 11)], seed, { ...CALM, ...pen }), ...lineTo(b, barb(0.46, 8.5), seed + 1, CALM)]
}

/**
 * A free-standing arrow inside whatever box its parent gives it: from `from`
 * to `to` (fractions of the box).
 */
export function Ex4Arrow({
  id,
  from,
  to,
  bend = 0.18,
  className,
  pen,
}: {
  id: string
  from: Pt
  to: Pt
  bend?: number
  className?: string
  pen?: Pen
}) {
  const [holder, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)

  useLayoutEffect(() => {
    const el = holder.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect()
      setBox({ w: r.width, h: r.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [holder])

  const seed = seedFrom(id)
  const paths = box
    ? arrowPaths([from[0] * box.w, from[1] * box.h], [to[0] * box.w, to[1] * box.h], bend, seed, pen)
    : []

  useWriteOn(svg, seen && paths.length > 0, box ? `${box.w}x${box.h}` : '')

  return (
    <span ref={holder} aria-hidden className={`ex4-arrow ${className ?? ''}`}>
      {box && (
        <svg ref={svg} className="ex4-ink" viewBox={`0 0 ${box.w} ${box.h}`}>
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      )}
    </span>
  )
}

/** Section break: three short ticks, each with its own seed. */
export function Ex4Ticks({ id, pen }: { id: string; pen?: Pen }) {
  const [holder, seen] = useInView<HTMLDivElement>()
  const svg = useRef<SVGSVGElement>(null)
  const base = seedFrom(id)
  const rand = prng(base)
  const paths = [0, 1, 2].flatMap((i) => {
    const x = 8 + i * 22 + (rand() - 0.5) * 3
    return lineTo([x, 14 + rand() * 2], [x + 7 + rand() * 2, 3 + rand() * 2], base + i, pen)
  })
  useWriteOn(svg, seen, 'ticks', true)
  return (
    <div ref={holder} className="ex4-ticks" role="separator">
      <svg ref={svg} aria-hidden className="ex4-ink" viewBox="0 0 70 18" width={70} height={18}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </div>
  )
}

/** A numeral inside a small open ballpoint loop — photo callouts and note keys. */
export function Ex4Num({
  id,
  n,
  active,
  className,
  style,
  pen,
}: {
  id: string
  n: number
  active?: boolean
  className?: string
  style?: CSSProperties
  pen?: Pen
}) {
  const [holder, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const seed = seedFrom(id)
  const paths = toPaths(circlePoints(14, 16, 7, prng(seed)), seed, pen)
  useWriteOn(svg, seen, 'num', true)
  return (
    <span
      ref={holder}
      className={`ex4-num ${active ? 'is-active' : ''} ${className ?? ''}`}
      style={style}
    >
      <span className="ex4-num__n">{n}</span>
      <svg ref={svg} aria-hidden className="ex4-ink" viewBox="0 0 28 30">
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  )
}
