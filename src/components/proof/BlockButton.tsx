'use client'

import Link from 'next/link'
import { useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cutEdge } from './cutEdge'

/**
 * The primary button — the printed block — with the PRESS verb
 * (design/specs/motion.md → printed-block-button):
 *
 *  - hover (fine pointer only): the block lifts 3px off its own impression —
 *    the same cut and grain at 25% — which shows as a 3px band beneath;
 *  - press (pointer, Enter or Space): it comes down onto the paper, +1px and
 *    scale .98, the grain jumps to a second impression and the ink darkens;
 *    held for at least 100ms so even a fast click is seen;
 *  - release: back up over 200ms, leaving a denser (35%) impression until
 *    the pointer leaves.
 *  - the small variant (top bar) lifts 2px and presses to .985, so the
 *    always-visible header stays quiet.
 *
 * Curves and durations live in CSS (`--m-press-*` on `:root`).
 */
const MIN_DOWN = 100
const KEY_PRESS = 120

export function BlockButton({
  id,
  children,
  href,
  small,
  disabled,
  className,
}: {
  id: string
  children: ReactNode
  href?: string
  small?: boolean
  disabled?: boolean
  className?: string
}) {
  const [pressed, setPressed] = useState(false)
  const [marked, setMarked] = useState(false)
  const downAt = useRef(0)
  const clip: CSSProperties = { clipPath: cutEdge(id) }

  const press = () => {
    downAt.current = performance.now()
    setPressed(true)
  }
  const release = () => {
    const held = performance.now() - downAt.current
    window.setTimeout(() => {
      setPressed(false)
      setMarked(true)
    }, Math.max(0, MIN_DOWN - held))
  }

  const handlers = {
    onPointerDown: press,
    onPointerUp: release,
    onPointerLeave: () => {
      setMarked(false)
      if (pressed) release()
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        press()
        window.setTimeout(release, KEY_PRESS)
      }
    },
  }

  const cls = ['tp-block', small && 'tp-block--small', pressed && 'is-pressed', marked && 'was-pressed', className]
    .filter(Boolean)
    .join(' ')

  const body = (
    <>
      <span className="tp-block__impression" style={clip} aria-hidden />
      <span className="tp-block__ink" style={clip}>
        {children}
      </span>
    </>
  )

  return href ? (
    <Link href={href} className={cls} {...handlers}>
      {body}
    </Link>
  ) : (
    <button type="button" className={cls} disabled={disabled} {...handlers}>
      {body}
    </button>
  )
}
