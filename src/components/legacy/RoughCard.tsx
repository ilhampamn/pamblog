'use client'

import Link from 'next/link'
import { useEffect, useRef, type ReactNode } from 'react'
import rough from 'roughjs'

export type RoughCardOrientation = 'vertical' | 'horizontal'

interface RoughCardProps {
  children: ReactNode
  orientation?: RoughCardOrientation
  seed: number
  href?: string
  className?: string
  contentClassName?: string
}

interface Point {
  x: number
  y: number
}

function seededRandom(seed: number) {
  let state = seed | 0
  return () => {
    state = Math.imul(state ^ (state >>> 15), 1 | state)
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state)
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296
  }
}

function smoothPath(points: Point[]) {
  if (points.length < 2) return ''
  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index]
    const next = points[index + 1]
    path += ` Q ${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`
  }
  const previous = points[points.length - 2]
  const last = points[points.length - 1]
  return `${path} Q ${previous.x} ${previous.y} ${last.x} ${last.y}`
}

function wigglyVerticalPath(x: number, height: number, seed: number) {
  const random = seededRandom(seed)
  const segments = 5 + Math.floor(random() * 4)
  const points: Point[] = [{ x, y: 5 }]

  for (let index = 1; index < segments; index += 1) {
    const progress = index / segments
    points.push({
      x: x + (random() - 0.5) * 9,
      y: 5 + (height - 10) * progress + (random() - 0.5) * 18,
    })
  }
  points.push({ x: x + (random() - 0.5) * 3, y: height - 5 })
  return smoothPath(points)
}

function wigglyHorizontalPath(y: number, width: number, seed: number) {
  const random = seededRandom(seed)
  const segments = 6 + Math.floor(random() * 4)
  const points: Point[] = [{ x: 5, y }]

  for (let index = 1; index < segments; index += 1) {
    const progress = index / segments
    points.push({
      x: 5 + (width - 10) * progress + (random() - 0.5) * 18,
      y: y + (random() - 0.5) * 8,
    })
  }
  points.push({ x: width - 5, y: y + (random() - 0.5) * 3 })
  return smoothPath(points)
}

export function RoughCard({
  children,
  orientation = 'vertical',
  seed,
  href,
  className,
  contentClassName,
}: RoughCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const svg = svgRef.current
    if (!card || !svg) return

    const drawFrame = () => {
      const width = card.clientWidth
      const height = card.clientHeight
      if (!width || !height) return

      svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
      svg.replaceChildren()
      const ink =
        getComputedStyle(card).getPropertyValue('--color-ink').trim() || '#171717'
      const drawing = rough.svg(svg)
      const edges = [
        wigglyHorizontalPath(5, width, seed + 11),
        wigglyHorizontalPath(height - 5, width, seed + 47),
        wigglyVerticalPath(5, height, seed + 89),
        wigglyVerticalPath(width - 5, height, seed + 137),
      ]

      edges.forEach((path, index) => {
        svg.appendChild(
          drawing.path(path, {
            seed: seed + 211 + index * 43,
            stroke: ink,
            strokeWidth: 1.9,
            roughness: 1.05,
            bowing: 0.8,
          }),
        )
      })
    }

    const observer = new ResizeObserver(drawFrame)
    observer.observe(card)
    drawFrame()
    return () => observer.disconnect()
  }, [seed])

  const layoutClass =
    orientation === 'vertical'
      ? 'flex h-full flex-col'
      : 'flex h-full flex-row items-stretch'
  const contentClasses = `${layoutClass} ${contentClassName ?? ''}`
  const content = href ? (
    <Link href={href} className={contentClasses}>
      {children}
    </Link>
  ) : (
    <div className={contentClasses}>{children}</div>
  )

  return (
    <div
      ref={cardRef}
      className={`relative ${className ?? ''}`}
      data-orientation={orientation}
      style={{ backgroundColor: 'var(--color-paper)' }}
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      />
      {content}
    </div>
  )
}
