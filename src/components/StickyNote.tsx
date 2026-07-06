/**
 * StickyNote — a handwritten sticky-note card for the canvas.
 *
 * Structure (two layers so the fold SVG isn't clipped along with the note body):
 *
 *   <outer div>   canvas-card, id, absolute positioning — transparent wrapper
 *     <inner div>  clip-path (wonky top edge + cut corner), yellow bg + lines
 *       {children or Link}
 *     </inner div>
 *     <svg>        fold triangle — sits in the cut corner, visible against canvas
 *     </svg>
 *   </outer div>
 *
 * The outer div is transparent so filter:drop-shadow on .canvas-sticky follows
 * the visible shape (inner note + fold) rather than the rectangular bounding box.
 */

import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

// ── Design tokens ─────────────────────────────────────────────────────────────
const NOTE_COLOR  = '#D5EF52'   // front face of the note
const FOLD_COLOR  = '#E8F888'   // back of the paper (slightly lighter)
const FOLD_TIP    = '#F4FCC4'   // tip of the curl — catches more light
const LINE_STEP   = 28          // px between ruled lines
const LINE_COLOR  = 'rgba(0,0,0,0.065)'
const FOLD        = 24          // size of the folded-corner triangle in px

// Helper: compute clip-path with dynamic tilt angle (degrees: 0-360, or negative).
// For a card of width W at angle θ°, the Y offset = W × tan(θ°).
function computeClip(rotationDeg: number, cardWidth: number, foldSize: number): string {
  const radians = (rotationDeg * Math.PI) / 180
  const tiltY = cardWidth * Math.tan(radians)
  return `polygon(
    0px ${tiltY}px,
    100% 0px,
    100% calc(100% - ${foldSize}px),
    calc(100% - ${foldSize}px) 100%,
    0px 100%
  )`
}

const INNER_STYLE: CSSProperties = {
  backgroundColor: NOTE_COLOR,
  backgroundImage: `repeating-linear-gradient(
    transparent,
    transparent ${LINE_STEP - 1}px,
    ${LINE_COLOR} ${LINE_STEP - 1}px,
    ${LINE_COLOR} ${LINE_STEP}px
  )`,
  backgroundPositionY: '42px',
  fontFamily: 'var(--font-handwriting)',
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
  /** Tilt angle of the top edge in degrees (0-360, or negative). Default: 4° */
  rotation?: number
  children: ReactNode
  'data-slug'?: string
}
interface WithLink extends Base { href: string }
interface WithoutLink extends Base { href?: never }
type StickyNoteProps = WithLink | WithoutLink

// ── Component ─────────────────────────────────────────────────────────────────
export function StickyNote({ id, className, style, rotation = 4, children, ...rest }: StickyNoteProps) {
  const { padding = '18px 20px 26px', width, ...outerStyle } = style ?? {}
  const href     = 'href' in rest ? rest.href    : undefined
  const dataSlug = rest['data-slug']

  // Compute the clip-path with the rotation angle. Assume 224px width if not provided.
  const cardWidth = typeof width === 'number' ? width : 224
  const clip = computeClip(rotation, cardWidth, FOLD)

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
      {/* ── Note body ── */}
      <div style={{ ...INNER_STYLE, padding, clipPath: clip }}>
        {body}
      </div>

      {/* ── Folded corner ──────────────────────────────────────────────────────
          Sits at the outer wrapper's bottom-right (outside the clip-path).
          The cut in the note body reveals the canvas background; this SVG sits
          on top and renders the fold face + shadow in that exposed area.    ── */}
      <svg
        aria-hidden
        width={FOLD}
        height={FOLD}
        viewBox={`0 0 ${FOLD} ${FOLD}`}
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          pointerEvents: 'none',
          overflow: 'visible',
          filter: `drop-shadow(-2px -2px 4px rgba(0,0,0,0.22))`,
        }}
      >
        <defs>
          {/* Gradient on fold face: note-colour at crease → light at tip (curl) */}
          <linearGradient id={`fold-${id ?? 'g'}`} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={FOLD_TIP} />
            <stop offset="100%" stopColor={FOLD_COLOR} />
          </linearGradient>
        </defs>

        {/* Shadow on the note surface — the area directly above the fold crease */}
        <polygon
          points={`0,0 ${FOLD},0 0,${FOLD}`}
          fill="rgba(0,0,0,0.09)"
        />

        {/* Fold face — the lifted corner piece, showing the paper's back side */}
        <polygon
          points={`${FOLD},0 ${FOLD},${FOLD} 0,${FOLD}`}
          fill={`url(#fold-${id ?? 'g'})`}
        />

        {/* Crease highlight along the fold line */}
        <line
          x1={FOLD} y1="0"
          x2="0"    y2={FOLD}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  )
}
