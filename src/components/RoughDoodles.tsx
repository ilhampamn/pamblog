'use client'

import { useEffect, useRef, type CSSProperties } from 'react'
import rough from 'roughjs'

interface RoughDoodleProps {
  id?: string
  className?: string
  style?: CSSProperties
}

export function RoughWelcome({ id, className, style }: RoughDoodleProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.replaceChildren()
    const drawing = rough.svg(svg)

    svg.appendChild(drawing.path('M 67 87 C 175 101, 411 99, 535 84', {
      seed: 81,
      stroke: '#e64980',
      strokeWidth: 5,
      roughness: 1.8,
      bowing: 1.6,
    }))
    svg.appendChild(drawing.path('M 126 104 C 236 114, 375 111, 478 101', {
      seed: 82,
      stroke: '#22b8cf',
      strokeWidth: 3,
      roughness: 1.7,
      bowing: 1.5,
    }))
    svg.appendChild(drawing.line(41, 37, 58, 48, {
      seed: 83,
      stroke: '#ffd43b',
      strokeWidth: 4,
      roughness: 1.8,
    }))
    svg.appendChild(drawing.line(49, 27, 49, 56, {
      seed: 84,
      stroke: '#ffd43b',
      strokeWidth: 4,
      roughness: 1.8,
    }))
    svg.appendChild(drawing.circle(558, 44, 13, {
      seed: 85,
      fill: '#845ef7',
      fillStyle: 'solid',
      stroke: '#5f3dc4',
      strokeWidth: 2,
      roughness: 1.5,
    }))
  }, [])

  return (
    <div
      id={id}
      className={className}
      style={{ ...style, aspectRatio: '600 / 125' }}
      role="img"
      aria-label="Welcome to my Travel Blog!"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 600 125"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          display: 'block',
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: '4% 0 auto',
          display: 'block',
          color: '#3b302a',
          fontFamily: 'var(--font-caveat), var(--font-reenie), cursive',
          fontSize: '1em',
          fontWeight: 700,
          lineHeight: 1.15,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}
      >
        Welcome to my Travel Blog!
      </span>
    </div>
  )
}

export function RoughGlobe({ id, className, style }: RoughDoodleProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.replaceChildren()
    const drawing = rough.svg(svg)

    svg.appendChild(drawing.circle(110, 108, 174, {
      seed: 61,
      fill: '#74c0fc',
      fillStyle: 'hachure',
      hachureAngle: -28,
      hachureGap: 8,
      fillWeight: 2,
      stroke: '#1864ab',
      strokeWidth: 3,
      roughness: 1.5,
    }))
    svg.appendChild(drawing.ellipse(110, 108, 82, 174, {
      seed: 62,
      stroke: '#7048e8',
      strokeWidth: 2.2,
      roughness: 1.4,
    }))
    svg.appendChild(drawing.ellipse(110, 108, 174, 68, {
      seed: 63,
      stroke: '#ffd43b',
      strokeWidth: 2.4,
      roughness: 1.5,
    }))
    svg.appendChild(drawing.path(
      'M 51 77 C 67 60, 78 63, 86 49 L 104 48 L 115 62 L 102 76 L 86 78 L 76 95 L 60 92 Z',
      {
        seed: 64,
        fill: '#51cf66',
        fillStyle: 'solid',
        stroke: '#2b8a3e',
        strokeWidth: 2,
        roughness: 1.6,
      },
    ))
    svg.appendChild(drawing.path(
      'M 126 91 L 152 79 L 169 90 L 159 106 L 146 110 L 137 139 L 122 153 L 115 132 L 121 115 L 111 103 Z',
      {
        seed: 65,
        fill: '#69db7c',
        fillStyle: 'zigzag',
        hachureGap: 5,
        stroke: '#2b8a3e',
        strokeWidth: 2,
        roughness: 1.5,
      },
    ))
    svg.appendChild(drawing.line(69, 197, 151, 197, {
      seed: 66,
      stroke: '#ff922b',
      strokeWidth: 4,
      roughness: 1.8,
    }))
  }, [])

  return (
    <div id={id} className={className} style={style}>
      <svg
        ref={svgRef}
        viewBox="0 0 220 210"
        role="img"
        aria-label="Colorful hand-drawn globe"
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      />
    </div>
  )
}

export function RoughBackpack({ id, className, style }: RoughDoodleProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    svg.replaceChildren()
    const drawing = rough.svg(svg)

    svg.appendChild(drawing.path(
      'M 58 67 C 61 36, 82 23, 105 23 C 132 23, 151 39, 153 68 L 169 188 C 147 205, 66 205, 43 188 Z',
      {
        seed: 71,
        fill: '#ff922b',
        fillStyle: 'zigzag',
        hachureAngle: -42,
        hachureGap: 7,
        fillWeight: 2.4,
        stroke: '#9c4b14',
        strokeWidth: 3,
        roughness: 1.6,
      },
    ))
    svg.appendChild(drawing.path('M 69 69 C 87 57, 128 57, 145 70 L 139 105 C 119 114, 83 114, 64 104 Z', {
      seed: 72,
      fill: '#845ef7',
      fillStyle: 'solid',
      stroke: '#5f3dc4',
      strokeWidth: 2.5,
      roughness: 1.5,
    }))
    svg.appendChild(drawing.rectangle(69, 128, 73, 48, {
      seed: 73,
      fill: '#4dabf7',
      fillStyle: 'cross-hatch',
      hachureGap: 6,
      stroke: '#1864ab',
      strokeWidth: 2.5,
      roughness: 1.7,
    }))
    svg.appendChild(drawing.line(78, 143, 133, 143, {
      seed: 74,
      stroke: '#ffd43b',
      strokeWidth: 4,
      roughness: 1.6,
    }))
    svg.appendChild(drawing.arc(105, 28, 51, 30, Math.PI, Math.PI * 2, false, {
      seed: 75,
      stroke: '#2f2a25',
      strokeWidth: 4,
      roughness: 1.5,
    }))
    svg.appendChild(drawing.path('M 48 83 C 24 102, 26 155, 40 177', {
      seed: 76,
      stroke: '#e64980',
      strokeWidth: 5,
      roughness: 1.8,
    }))
    svg.appendChild(drawing.path('M 160 83 C 184 102, 181 155, 167 177', {
      seed: 77,
      stroke: '#20c997',
      strokeWidth: 5,
      roughness: 1.8,
    }))
  }, [])

  return (
    <div id={id} className={className} style={style}>
      <svg
        ref={svgRef}
        viewBox="0 0 210 220"
        role="img"
        aria-label="Colorful hand-drawn backpack"
        style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}
      />
    </div>
  )
}
