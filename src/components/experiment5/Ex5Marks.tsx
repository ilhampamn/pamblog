'use client'

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import {
  lineTo,
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
 * Grease-pencil marks for /experiment-5 — the contact sheet.
 *
 * A china marker is what a photographer uses on a contact sheet: it rides over
 * glossy paper, so the line is thick, waxy and wobbles more than a biro. Same
 * engine as the ballpoint (experiment 4), different pen.
 */
export const GREASE: Pen = { roughness: 1.35, bowing: 1.1 }

function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [box, setBox] = useState<{ w: number; h: number } | null>(null)
  useLayoutEffect(() => {
    const el = ref.current
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
  }, [])
  return [ref, box] as const
}

/**
 * Crop marks: the four L-brackets a photographer draws on a frame to say
 * "print this, cropped here". Wraps a block (usually a photo). `inset` pulls
 * the brackets inside the frame, as a real crop would.
 */
export function Ex5Crop({
  id,
  children,
  inset = 0.06,
  className,
}: {
  id: string
  children: ReactNode
  inset?: number
  className?: string
}) {
  const [wrap, box] = useBox<HTMLDivElement>()
  const [view, seen] = useInView<HTMLDivElement>()
  const svg = useRef<SVGSVGElement>(null)
  const mounted = useMounted()

  let paths: string[] = []
  if (box && mounted) {
    const seed = seedFrom(id)
    const r = prng(seed)
    const ix = box.w * inset
    const iy = box.h * inset
    const arm = Math.min(box.w, box.h) * 0.12
    const corners: [Pt, Pt, Pt][] = [
      [[ix, iy + arm], [ix, iy], [ix + arm, iy]],
      [[box.w - ix - arm, iy], [box.w - ix, iy], [box.w - ix, iy + arm]],
      [[box.w - ix, box.h - iy - arm], [box.w - ix, box.h - iy], [box.w - ix - arm, box.h - iy]],
      [[ix + arm, box.h - iy], [ix, box.h - iy], [ix, box.h - iy - arm]],
    ]
    paths = corners.flatMap(([a, b, c], i) => {
      const j = (): Pt => [(r() - 0.5) * 3, (r() - 0.5) * 3]
      const [ja, jb, jc] = [j(), j(), j()]
      return [
        ...lineTo([a[0] + ja[0], a[1] + ja[1]], [b[0] + jb[0], b[1] + jb[1]], seed + i * 2, GREASE),
        ...lineTo([b[0] + jb[0], b[1] + jb[1]], [c[0] + jc[0], c[1] + jc[1]], seed + i * 2 + 1, GREASE),
      ]
    })
  }
  useWriteOn(svg, seen && paths.length > 0, box ? `${box.w}x${box.h}` : '')

  return (
    <div
      ref={(el) => {
        ;(wrap as React.MutableRefObject<HTMLDivElement | null>).current = el
        ;(view as React.MutableRefObject<HTMLDivElement | null>).current = el
      }}
      className={`ex5-crop ${className ?? ''}`}
    >
      {children}
      {box && (
        <svg
          ref={svg}
          aria-hidden
          className="ex4-ink"
          style={{ inset: 0, width: box.w, height: box.h }}
          viewBox={`0 0 ${box.w} ${box.h}`}
        >
          {paths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </svg>
      )}
    </div>
  )
}

/** The "keeper" star — one continuous five-point stroke, the way it's scrawled. */
export function Ex5Star({ id, size = 34 }: { id: string; size?: number }) {
  const [holder, seen] = useInView<HTMLSpanElement>()
  const svg = useRef<SVGSVGElement>(null)
  const mounted = useMounted()
  const seed = seedFrom(id)
  let paths: string[] = []
  if (mounted) {
    const r = prng(seed)
    const c = size / 2
    const R = size * 0.46
    // Visit the five points in star order (0, 2, 4, 1, 3, 0) as one stroke.
    const order = [0, 2, 4, 1, 3, 0, 2]
    const pts: Pt[] = order.map((k, i) => {
      const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5
      const wob = 1 + (r() - 0.5) * 0.12 + (i === order.length - 1 ? -0.35 : 0)
      return [c + Math.cos(a) * R * wob, c + Math.sin(a) * R * wob]
    })
    paths = toPaths(pts, seed, { roughness: 0.9, bowing: 0.3 })
  }
  useWriteOn(svg, seen && mounted, mounted ? 'star' : '')
  return (
    <span ref={holder} aria-hidden className="ex5-star" style={{ width: size, height: size }}>
      <svg ref={svg} className="ex4-ink" viewBox={`0 0 ${size} ${size}`}>
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
    </span>
  )
}
