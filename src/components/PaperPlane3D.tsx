'use client'
/**
 * PaperPlane3D — red paper airplane that smoothly follows the cursor.
 *
 * Behaviour: exponential-decay follow, heading from velocity, banking on turns.
 * Visual: wide-wing silhouette with gradient fills + sticker-style white border.
 */

import { useEffect, useRef } from 'react'

// ── Geometry ─────────────────────────────────────────────────────────────────
const SC = 58   // scale in pixels — change to resize the plane

// Vertices in local frame: nose → +X, wingspan → ±Y
// idx:  0=nose  1=lTip  2=rTip  3=lFold  4=rFold  5=lTail  6=rTail
const RAW: [number, number][] = [
  [ 0.90,   0.00 ], // 0 nose
  [-0.32,  -1.70 ], // 1 left wingtip
  [-0.32,   1.70 ], // 2 right wingtip
  [ 0.16,  -0.30 ], // 3 left fold (inner wing crease)
  [ 0.16,   0.30 ], // 4 right fold
  [-0.46,  -0.22 ], // 5 left tail
  [-0.46,   0.22 ], // 6 right tail
]
const V: [number, number][] = RAW.map(([x, y]) => [x * SC, y * SC])

// Faces drawn back → front per bank direction (prevents z-fighting)
// Each: [vertex indices, fill colour, stroke colour, stroke width]
type FaceDef = [[number, number, number], string, string, number]

const FACES_R: FaceDef[] = [          // banking right (right dips)
  [[0,1,3], '#B82424', '#6B0808', 1], // left top  (rises)
  [[3,1,5], '#A82020', '#6B0808', 1], // left wing back
  [[0,3,5], '#6E1414', '#3A0404', 1], // left under
  [[0,4,6], '#7A1818', '#3A0404', 1], // right under
  [[0,4,2], '#D43232', '#6B0808', 1], // right top (dips, still leading)
  [[4,6,2], '#C82C2C', '#6B0808', 1], // right wing back
]
const FACES_L: FaceDef[] = [          // banking left (left dips)
  [[0,4,2], '#D43232', '#6B0808', 1], // right top (rises)
  [[4,6,2], '#C82C2C', '#6B0808', 1], // right wing back
  [[0,4,6], '#7A1818', '#3A0404', 1], // right under
  [[0,3,5], '#6E1414', '#3A0404', 1], // left under
  [[0,1,3], '#B82424', '#6B0808', 1], // left top (dips)
  [[3,1,5], '#A82020', '#6B0808', 1], // left wing back
]

// Silhouette order for the sticker border (nose → rTip → rTail → lTail → lTip)
const SILO = [0, 2, 6, 5, 1]

// ── Component ─────────────────────────────────────────────────────────────────
export function PaperPlane3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    if (!canvas) return
    const el: HTMLCanvasElement = canvas

    let raf: number
    let mx = window.innerWidth  / 2
    let my = window.innerHeight * 0.38
    let px = mx - 110, py = my - 50
    let vx = 0, vy = 0
    let heading = 0, prevH = 0, bank = 0

    const onResize = () => { el.width = window.innerWidth; el.height = window.innerHeight }
    const onMove   = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }
    onResize()
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', onMove)

    const wrap = (d: number) => {
      while (d >  Math.PI) d -= Math.PI * 2
      while (d < -Math.PI) d += Math.PI * 2
      return d
    }

    function drawFace(ctx: CanvasRenderingContext2D, f: FaceDef) {
      const [a, b, c] = f[0].map(i => V[i])
      ctx.beginPath()
      ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(c[0], c[1])
      ctx.closePath()
      ctx.fillStyle = f[1]; ctx.fill()
      ctx.strokeStyle = f[2]; ctx.lineWidth = f[3]; ctx.stroke()
    }

    function drawSilhouette(ctx: CanvasRenderingContext2D, lineW: number, color: string) {
      ctx.beginPath()
      SILO.forEach((i, n) => {
        const [x, y] = V[i]
        if (n === 0) { ctx.moveTo(x, y) } else { ctx.lineTo(x, y) }
      })
      ctx.closePath()
      ctx.strokeStyle = color
      ctx.lineWidth   = lineW
      ctx.lineJoin    = 'round'
      ctx.stroke()
    }

    function frame() {
      const ctx = el.getContext('2d')!
      ctx.clearRect(0, 0, el.width, el.height)

      // Smooth follow
      vx += ((mx - px) * 0.046 - vx) * 0.14
      vy += ((my - py) * 0.046 - vy) * 0.14
      px += vx; py += vy

      // Heading
      if (Math.hypot(vx, vy) > 0.2) heading += wrap(Math.atan2(vy, vx) - heading) * 0.10

      // Banking
      const dh = wrap(heading - prevH); prevH = heading
      bank += (Math.max(-0.62, Math.min(0.62, dh * 90)) - bank) * 0.09

      const cb = Math.cos(bank)

      // Shadow
      ctx.save()
      ctx.translate(px + 10, py + 22)
      ctx.rotate(heading)
      ctx.scale(1, 0.2)
      ctx.beginPath()
      ctx.ellipse(0, 0, SC * 1.6, SC * 1.1, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,0,0,0.10)'
      ctx.fill()
      ctx.restore()

      // Plane
      ctx.save()
      ctx.translate(px, py)
      ctx.rotate(heading)
      ctx.transform(1, 0, 0, cb, 0, 0)   // banking squash

      // 1. White sticker border (drawn under the coloured faces)
      drawSilhouette(ctx, 7, 'rgba(255,255,255,0.92)')

      // 2. Coloured faces back → front
      const faces = bank >= 0 ? FACES_R : FACES_L
      for (const f of faces) drawFace(ctx, f)

      // 3. Thin outer edge on the silhouette
      drawSilhouette(ctx, 1.5, '#4A0808')

      // 4. Centre crease line
      ctx.beginPath()
      ctx.moveTo(V[0][0], V[0][1])
      ctx.lineTo(V[5][0] * 0.5 + V[6][0] * 0.5, V[5][1] * 0.5 + V[6][1] * 0.5)
      ctx.strokeStyle = '#350606'; ctx.lineWidth = 2; ctx.stroke()

      ctx.restore()

      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 40 }}
    />
  )
}
