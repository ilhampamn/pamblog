'use client'

import { useEffect, useRef } from 'react'
import rough from 'roughjs'

/**
 * Hand-drawn annotation marks for the /experiment page.
 *
 * These are the "rough" half of rough-raw-realism × modernity: a machined
 * monospace type system with a human pen laid over it. Same approach as
 * RoughDoodles — roughjs draws into an SVG on mount, with a fixed `seed` so
 * every render produces the identical stroke instead of jittering on nav.
 *
 * Each mark stretches to fill its wrapper (`preserveAspectRatio="none"`), so a
 * circle can wrap a two-word phrase or a whole heading without re-authoring it.
 */

interface MarkProps {
  /** Any CSS colour. Defaults to the section's blue. */
  color?: string
  /** Stroke weight in viewBox units, before stretching. */
  strokeWidth?: number
  /** Vary this to get a different-but-stable hand for repeated marks. */
  seed?: number
  className?: string
}

const BLUE = '#2029d9'

/** Loose ellipse drawn twice — the second pass is the "went round again" pass. */
export function ScribbleCircle({
  color = BLUE,
  strokeWidth = 2.2,
  seed = 11,
  className,
}: MarkProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    svg.replaceChildren()
    const pen = rough.svg(svg)

    svg.appendChild(
      pen.ellipse(150, 50, 292, 88, {
        seed,
        stroke: color,
        strokeWidth,
        roughness: 1.9,
        bowing: 1.4,
        fill: 'none',
      })
    )
    // Second, slightly smaller pass — overlapping strokes read as pen pressure.
    svg.appendChild(
      pen.ellipse(150, 50, 282, 78, {
        seed: seed + 7,
        stroke: color,
        strokeWidth: strokeWidth * 0.72,
        roughness: 2.4,
        bowing: 1.7,
        fill: 'none',
      })
    )
  }, [color, strokeWidth, seed])

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    />
  )
}

/** Two-stroke underline that overshoots the word on both ends. */
export function ScribbleUnderline({
  color = BLUE,
  strokeWidth = 2.6,
  seed = 23,
  className,
}: MarkProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    svg.replaceChildren()
    const pen = rough.svg(svg)

    svg.appendChild(
      pen.path('M 6 12 C 78 4, 214 6, 294 11', {
        seed,
        stroke: color,
        strokeWidth,
        roughness: 1.8,
        bowing: 2,
      })
    )
    svg.appendChild(
      pen.path('M 18 18 C 96 11, 208 13, 286 17', {
        seed: seed + 5,
        stroke: color,
        strokeWidth: strokeWidth * 0.6,
        roughness: 2.2,
        bowing: 2.4,
      })
    )
  }, [color, strokeWidth, seed])

  return (
    <svg
      ref={ref}
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    />
  )
}

/**
 * Curved arrow, drawn left-to-right. Flip it with `scaleX(-1)` on the wrapper
 * when it needs to point the other way.
 */
export function ScribbleArrow({
  color = BLUE,
  strokeWidth = 2.2,
  seed = 37,
  className,
}: MarkProps) {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    svg.replaceChildren()
    const pen = rough.svg(svg)

    const options = {
      seed,
      stroke: color,
      strokeWidth,
      roughness: 1.7,
      bowing: 1.5,
    }
    // Shaft, then two short strokes for the head — an arrow you'd actually draw.
    svg.appendChild(pen.path('M 6 44 C 62 8, 168 8, 232 30', options))
    svg.appendChild(pen.path('M 208 12 L 236 31', { ...options, seed: seed + 3 }))
    svg.appendChild(pen.path('M 205 44 L 236 31', { ...options, seed: seed + 4 }))
  }, [color, strokeWidth, seed])

  return (
    <svg
      ref={ref}
      viewBox="0 0 240 56"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    />
  )
}
