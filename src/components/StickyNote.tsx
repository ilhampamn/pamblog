/**
 * StickyNote — a handwritten sticky-note card for the canvas.
 *
 * Structure:
 *
 *   <outer div>   canvas-card, id, absolute positioning — transparent wrapper
 *     <inner div>  subtly irregular square paper
 *       {children or Link}
 *     </inner div>
 *   </outer div>
 *
 * The outer div is transparent so filter:drop-shadow on .canvas-sticky follows
 * the paper's subtly irregular silhouette.
 */

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { PushPin } from './PushPin'

// ── Design tokens ─────────────────────────────────────────────────────────────
// Warm Post-it yellow, matching the restrained evidence-board reference.
const NOTE_COLOR = '#F1D84A'

// Keep the paper deformation deliberately tiny. Large angles make a note look
// cut out rather than naturally bent.
function computeClip(rotationDeg: number, cardWidth: number): string {
  const restrained = Math.max(-0.7, Math.min(0.7, rotationDeg))
  const radians = (restrained * Math.PI) / 180
  const tiltY = cardWidth * Math.tan(radians)
  return `polygon(
    0px ${tiltY}px,
    100% 0px,
    100% calc(100% - 2px),
    52% 100%,
    0px calc(100% - 4px)
  )`
}

const INNER_STYLE: CSSProperties = {
  fontFamily: 'var(--font-caveat), var(--font-reenie), cursive',
  color: '#1A1A1A',
  textDecoration: 'none',
  display: 'block',
}

// ── Types ─────────────────────────────────────────────────────────────────────
interface Base {
  id?: string
  className?: string
  /** Pass position/left/top/width here; padding goes to the inner note body. */
  style?: CSSProperties
  /** Very subtle top-edge tilt. Values are restrained to ±0.7°. */
  rotation?: number
  /** Front face colour. Default: warm Post-it yellow. */
  noteColor?: string
  children: ReactNode
  'data-slug'?: string
}
interface WithLink extends Base { href: string }
interface WithoutLink extends Base { href?: never }
type StickyNoteProps = WithLink | WithoutLink

// ── Component ─────────────────────────────────────────────────────────────────
export function StickyNote({
  id,
  className,
  style,
  rotation = 0.45,
  noteColor = NOTE_COLOR,
  children,
  ...rest
}: StickyNoteProps) {
  const { padding = '18px 20px 26px', width, ...outerStyle } = style ?? {}
  const href     = 'href' in rest ? rest.href    : undefined
  const dataSlug = rest['data-slug']

  // Compute the clip-path with the rotation angle. Assume 224px width if not provided.
  const cardWidth = typeof width === 'number' ? width : 224
  const clip = computeClip(rotation, cardWidth)

  // For link notes the inner element is a Next Link so the whole note is clickable.
  const body = href
    ? (
      <Link href={href} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
        {children}
      </Link>
    )
    : children

  return (
    <div
      id={id}
      className={`canvas-sticky ${className ?? ''}`}
      data-slug={dataSlug}
      style={{ ...outerStyle, width }}
    >
      <PushPin tone="gold" className="sticky-note__pin" />

      {/* ── Note body ── */}
      <div
        className="sticky-note__paper"
        style={{ ...INNER_STYLE, backgroundColor: noteColor, padding, clipPath: clip }}
      >
        <div className="sticky-note__content">{body}</div>
      </div>
    </div>
  )
}
