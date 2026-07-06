'use client'
import { useState } from 'react'

/**
 * Polaroid — a draggable photo card with a classic polaroid frame.
 *
 * Positioning: exactly like Sticker — lives OUTSIDE the canvas world layer so
 * it's re-rasterised at the correct CSS size on every zoom change (sharp always).
 * applyTransform in Canvas.tsx sets left / top / width; height is auto.
 *
 * Frame proportions: percentage-based padding so the white border and bottom
 * strip scale perfectly regardless of the display width. At any zoom level a
 * 220 px polaroid and a 110 px polaroid have identical visual proportions.
 *
 * To add a new polaroid, add an entry to POLAROIDS in Canvas.tsx.
 *
 * Two interaction modes for the pill links:
 *  - canvas mode (default, standalone=false): desktop, hover-to-reveal via CSS `group-hover`.
 *  - standalone mode (mobile / HomeList): tap-to-reveal — tapping the card toggles
 *    the pills, since there's no hover on touch devices.
 */
export interface PolaroidLink {
  label: string
  href: string
}

export interface PolaroidConfig {
  /** Unique id — also used as the element id. */
  id: string
  /** Path to the image in /public. */
  src: string
  /** Alt text. */
  alt: string
  /** Centre position in world coordinates. */
  worldX: number
  worldY: number
  /** Rotation in degrees (default 0). In canvas mode this is applied by
   *  applyTransform; in standalone mode the component applies it directly. */
  rotation?: number
  /** Display width. Canvas mode: world px at zoom 1. Standalone mode: any
   *  CSS width value, e.g. a percentage to match sibling elements. */
  width?: number | string
  /** Optional caption in the bottom strip. */
  caption?: string
  /** Optional pill links (e.g. Read more, View story, etc.). */
  links?: PolaroidLink[]
  /** Static-flow, tap-to-reveal mode for mobile (HomeList). Default: false (canvas/hover). */
  standalone?: boolean
}

export function Polaroid({
  id,
  src,
  alt,
  caption,
  width = 200,
  rotation = 0,
  links,
  standalone = false,
}: Pick<PolaroidConfig, 'id' | 'src' | 'alt' | 'caption' | 'width' | 'rotation' | 'links'> & { standalone?: boolean }) {
  // Fixed pixel padding — safe because applyTransform uses CSS scale() on this
  // element (not width resizing), so padding, image, and caption all zoom together.
  const pad = 8                   // top + sides
  const padBottom = 12            // bottom strip (caption area)
  const [revealed, setRevealed] = useState(false)
  // Caption font size scales off a pixel width. When `width` is a CSS string
  // (e.g. '100%' in standalone mode) fall back to the old default basis so
  // the handwriting stays the same readable size it always was.
  const captionWidthBasis = typeof width === 'number' ? width : 220

  return (
    <div
      id={id}
      className={standalone ? 'select-none' : 'canvas-sticker group'}
      style={standalone
        ? {
            position: 'relative',
            width,
            transform: rotation ? `rotate(${rotation}deg)` : undefined,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            filter:
              'drop-shadow(0 4px 10px rgba(28, 25, 23, 0.16)) drop-shadow(0 1px 4px rgba(28, 25, 23, 0.10))',
          }
        : {
            position: 'absolute',
            left: -9999,
            top: -9999,
            width,
            userSelect: 'none',
            WebkitUserSelect: 'none',
            zIndex: 1,
          }
      }
    >
      {/* Polaroid card — tappable in standalone mode to toggle the pills below */}
      <div
        onClick={standalone ? () => setRevealed((r) => !r) : undefined}
        role={standalone ? 'button' : undefined}
        tabIndex={standalone ? 0 : undefined}
        aria-expanded={standalone ? revealed : undefined}
        style={{
          backgroundColor: '#ffffff',
          padding: `${pad}px ${pad}px ${padBottom}px`,
          borderRadius: 2,
          cursor: standalone ? 'pointer' : undefined,
        }}
      >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
        draggable={false}
      />
      {caption && (
        <div style={{ pointerEvents: 'none', textAlign: 'center', paddingTop: Math.round(pad * 0.5) }}>
          {caption.split('\n').map((line, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontSize: Math.round(captionWidthBasis * 0.13),
                fontFamily: 'var(--font-reenie), var(--font-handwriting)',
                color: i === 0 ? 'var(--color-ink)' : 'var(--color-smudge)',
                lineHeight: 1,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      )}
      </div>

      {/* Pill links below the card — hidden by default, shown on hover (desktop)
          or tap (standalone/mobile, driven by the `revealed` state above). */}
      {links && links.length > 0 && (
        <div
          className={standalone ? '' : 'opacity-0 group-hover:opacity-100 transition-opacity duration-200'}
          style={{
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            marginTop: '8px',
            position: 'relative',
            zIndex: 10,
            ...(standalone
              ? {
                  opacity: revealed ? 1 : 0,
                  pointerEvents: revealed ? 'auto' : 'none',
                  transition: 'opacity 200ms ease',
                }
              : { pointerEvents: 'auto' }),
          }}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="label-stamped"
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                backgroundColor: 'var(--color-ghost)',
                border: '1px solid var(--color-torn)',
                borderRadius: '12px',
                color: 'var(--color-ink)',
                textDecoration: 'none',
                transition: 'all 200ms ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-blush)'
                e.currentTarget.style.color = '#fff'
                e.currentTarget.style.borderColor = 'var(--color-blush)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-ghost)'
                e.currentTarget.style.color = 'var(--color-ink)'
                e.currentTarget.style.borderColor = 'var(--color-torn)'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
