'use client'

import { useEffect, useRef } from 'react'

export interface RopeConnection {
  id: string
  fromId: string
  toId: string
  color?: string
}

interface RopeLayerProps {
  connections: RopeConnection[]
}

interface Point {
  x: number
  y: number
  previousX: number
  previousY: number
}

interface SimulatedRope {
  connection: RopeConnection
  points: Point[]
  lastFrom?: { x: number; y: number }
  lastTo?: { x: number; y: number }
  lastScale?: number
}

const PARTICLE_COUNT = 34
const DAMPING = 0.986
const GRAVITY = 920
const CONSTRAINT_PASSES = 6

function anchorPoint(element: HTMLElement, canvasRect: DOMRect) {
  const rect = element.getBoundingClientRect()
  return {
    x: rect.left - canvasRect.left + rect.width / 2,
    // Cards and Polaroids both place their physical pin close to top-centre.
    y: rect.top - canvasRect.top + 4,
  }
}

function initializePoints(
  from: { x: number; y: number },
  to: { x: number; y: number },
  scale: number,
) {
  return Array.from({ length: PARTICLE_COUNT }, (_, index) => {
    const progress = index / (PARTICLE_COUNT - 1)
    const sag = Math.sin(progress * Math.PI) * 34 * scale
    const x = from.x + (to.x - from.x) * progress
    const y = from.y + (to.y - from.y) * progress + sag
    return { x, y, previousX: x, previousY: y }
  })
}

function drawSmoothRope(
  context: CanvasRenderingContext2D,
  points: Point[],
) {
  if (points.length < 2) return
  context.beginPath()
  context.moveTo(points[0].x, points[0].y)
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index]
    const next = points[index + 1]
    context.quadraticCurveTo(
      point.x,
      point.y,
      (point.x + next.x) / 2,
      (point.y + next.y) / 2,
    )
  }
  const beforeLast = points[points.length - 2]
  const last = points[points.length - 1]
  context.quadraticCurveTo(beforeLast.x, beforeLast.y, last.x, last.y)
}

export function RopeLayer({ connections }: RopeLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const viewport = canvas?.parentElement
    if (!canvas || !viewport) return

    const context = canvas.getContext('2d')
    if (!context) return

    const ropes: SimulatedRope[] = connections.map((connection) => ({
      connection,
      points: [],
    }))
    let animationFrame = 0
    let previousTime = performance.now()

    const resize = () => {
      const rect = viewport.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(rect.width * ratio)
      const height = Math.round(rect.height * ratio)
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }

    const simulate = (
      rope: SimulatedRope,
      deltaTime: number,
      canvasRect: DOMRect,
      scale: number,
    ) => {
      const fromElement = document.getElementById(rope.connection.fromId)
      const toElement = document.getElementById(rope.connection.toId)
      if (!fromElement || !toElement) return false

      const from = anchorPoint(fromElement, canvasRect)
      const to = anchorPoint(toElement, canvasRect)
      if (!rope.points.length) rope.points = initializePoints(from, to, scale)

      if (rope.lastFrom && rope.lastTo) {
        if (rope.lastScale && Math.abs(scale - rope.lastScale) > 0.0001) {
          const scaleRatio = scale / rope.lastScale
          rope.points.forEach((point, index) => {
            const progress = index / (rope.points.length - 1)
            const oldChordX =
              rope.lastFrom!.x + (rope.lastTo!.x - rope.lastFrom!.x) * progress
            const oldChordY =
              rope.lastFrom!.y + (rope.lastTo!.y - rope.lastFrom!.y) * progress
            const newChordX = from.x + (to.x - from.x) * progress
            const newChordY = from.y + (to.y - from.y) * progress
            const offsetX = (point.x - oldChordX) * scaleRatio
            const offsetY = (point.y - oldChordY) * scaleRatio
            point.x = newChordX + offsetX
            point.y = newChordY + offsetY
            // Zoom is a coordinate-system change, not physical velocity.
            point.previousX = point.x
            point.previousY = point.y
          })
        }

        const fromDelta = {
          x: from.x - rope.lastFrom.x,
          y: from.y - rope.lastFrom.y,
        }
        const toDelta = {
          x: to.x - rope.lastTo.x,
          y: to.y - rope.lastTo.y,
        }
        const sharedMovement = Math.hypot(
          fromDelta.x - toDelta.x,
          fromDelta.y - toDelta.y,
        )

        // Panning moves both anchors together. Carry the whole rope with them
        // so it does not lag behind the board before physics resumes.
        if (sharedMovement < 2.5) {
          const moveX = (fromDelta.x + toDelta.x) / 2
          const moveY = (fromDelta.y + toDelta.y) / 2
          rope.points.forEach((point) => {
            point.x += moveX
            point.previousX += moveX
            point.y += moveY
            point.previousY += moveY
          })
        }
      }

      rope.lastFrom = from
      rope.lastTo = to
      rope.lastScale = scale
      const points = rope.points
      const deltaSquared = deltaTime * deltaTime

      for (let index = 1; index < points.length - 1; index += 1) {
        const point = points[index]
        const velocityX = (point.x - point.previousX) * DAMPING
        const velocityY = (point.y - point.previousY) * DAMPING
        point.previousX = point.x
        point.previousY = point.y
        point.x += velocityX
        point.y += velocityY + GRAVITY * scale * deltaSquared
      }

      const distance = Math.hypot(to.x - from.x, to.y - from.y)
      const segmentLength = (distance * 1.12 + 26 * scale) / (points.length - 1)

      for (let pass = 0; pass < CONSTRAINT_PASSES; pass += 1) {
        points[0].x = from.x
        points[0].y = from.y
        points[points.length - 1].x = to.x
        points[points.length - 1].y = to.y

        for (let index = 0; index < points.length - 1; index += 1) {
          const first = points[index]
          const second = points[index + 1]
          const deltaX = second.x - first.x
          const deltaY = second.y - first.y
          const currentLength = Math.hypot(deltaX, deltaY) || 0.0001
          const correction = (currentLength - segmentLength) / currentLength
          const offsetX = deltaX * correction
          const offsetY = deltaY * correction

          if (index === 0) {
            second.x -= offsetX
            second.y -= offsetY
          } else if (index === points.length - 2) {
            first.x += offsetX
            first.y += offsetY
          } else {
            first.x += offsetX * 0.5
            first.y += offsetY * 0.5
            second.x -= offsetX * 0.5
            second.y -= offsetY * 0.5
          }
        }
      }

      points[0].x = from.x
      points[0].y = from.y
      points[points.length - 1].x = to.x
      points[points.length - 1].y = to.y
      return true
    }

    const render = (time: number) => {
      resize()
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      context.clearRect(0, 0, width, height)
      const canvasRect = canvas.getBoundingClientRect()
      const deltaTime = Math.min((time - previousTime) / 1000, 1 / 30)
      const scale = Number.parseFloat(viewport.dataset.canvasScale || '1') || 1
      previousTime = time

      ropes.forEach((rope) => {
        if (!simulate(rope, deltaTime, canvasRect, scale)) return
        const color = rope.connection.color ?? '#c9364f'

        context.save()
        context.lineCap = 'round'
        context.lineJoin = 'round'

        drawSmoothRope(context, rope.points)
        context.strokeStyle = 'rgba(37, 20, 18, 0.18)'
        context.lineWidth = 4.2 * scale
        context.stroke()

        drawSmoothRope(context, rope.points)
        context.strokeStyle = color
        context.lineWidth = 2.4 * scale
        context.stroke()

        drawSmoothRope(context, rope.points)
        context.strokeStyle = 'rgba(255, 224, 216, 0.38)'
        context.lineWidth = 0.65 * scale
        context.stroke()
        context.restore()
      })

      animationFrame = requestAnimationFrame(render)
    }

    animationFrame = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animationFrame)
  }, [connections])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[4]"
      aria-hidden="true"
    />
  )
}
