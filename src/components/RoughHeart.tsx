'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import rough from 'roughjs'

interface RoughHeartProps {
  id?: string
  className?: string
  style?: CSSProperties
}

const HEART_PATH =
  'M 110 190 C 91 168, 25 126, 25 71 C 25 29, 78 14, 110 54 C 142 14, 195 29, 195 71 C 195 126, 129 168, 110 190 Z'

export function RoughHeart({ id, className, style }: RoughHeartProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    svg.replaceChildren()
    const drawing = rough.svg(svg)

    svg.appendChild(
      drawing.path(HEART_PATH, {
        seed: 27,
        fill: '#ff5d8f',
        fillStyle: 'zigzag',
        fillWeight: 2.4,
        hachureAngle: -35,
        hachureGap: 7,
        stroke: '#8b2f68',
        strokeWidth: 3,
        roughness: 1.6,
        bowing: 1.2,
      }),
    )

    const stripes = [
      { path: 'M 43 79 C 76 94, 140 94, 179 76', color: '#22b8cf', seed: 31 },
      { path: 'M 39 105 C 82 121, 139 121, 181 103', color: '#ffd43b', seed: 32 },
      { path: 'M 54 133 C 89 146, 133 146, 165 130', color: '#845ef7', seed: 33 },
    ]

    stripes.forEach(({ path, color, seed }) => {
      svg.appendChild(
        drawing.path(path, {
          seed,
          stroke: color,
          strokeWidth: 5,
          roughness: 1.8,
          bowing: 1.5,
        }),
      )
    })

    const sparkles = [
      { x: 17, y: 40, color: '#ffd43b', seed: 41 },
      { x: 202, y: 48, color: '#22b8cf', seed: 42 },
      { x: 188, y: 155, color: '#ff922b', seed: 43 },
    ]
    sparkles.forEach(({ x, y, color, seed }) => {
      svg.appendChild(
        drawing.circle(x, y, 11, {
          seed,
          fill: color,
          fillStyle: 'solid',
          stroke: '#704214',
          strokeWidth: 1.5,
          roughness: 1.5,
        }),
      )
    })
  }, [])

  return (
    <div id={id} className={className} style={style}>
      <svg
        ref={svgRef}
        viewBox="0 0 220 205"
        role="img"
        aria-label="Colorful hand-drawn heart"
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      />
    </div>
  )
}
