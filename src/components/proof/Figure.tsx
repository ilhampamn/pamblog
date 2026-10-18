'use client'

import { useState } from 'react'
import { Num, type Pen } from './Mark'

export interface Callout {
  /** Position on the uncropped image, as fractions (0–1), so it stays on its detail at any width. */
  x: number
  y: number
  note: string
}

/**
 * A cover photograph shown whole, with numbered ballpoint callouts on it and
 * the same notes repeated as real text underneath (art direction, Rule 11).
 *
 * "Point" (Motion): hovering or focusing callout 2 marks note 2, and the
 * reverse — the two halves of one annotation light up together.
 */
export function Figure({
  id,
  src,
  alt,
  callouts,
  plate,
  pen,
}: {
  id: string
  src: string
  alt: string
  callouts: Callout[]
  plate: string
  pen?: Pen
}) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <figure className="tp-figure">
      <div className="tp-figure__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} />
        {callouts.map((c, i) => (
          <button
            key={i}
            type="button"
            className="tp-figure__pin"
            style={{ left: `${c.x * 100}%`, top: `${c.y * 100}%` }}
            aria-label={`Note ${i + 1}: ${c.note}`}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          >
            <Num id={`${id}:pin-${i}`} n={i + 1} active={active === i} pen={pen} />
          </button>
        ))}
      </div>
      <figcaption className="tp-figure__caption">
        <span className="tp-label">{plate}</span>
        <ol className="tp-figure__notes">
          {callouts.map((c, i) => (
            <li
              key={i}
              className={active === i ? 'is-active' : undefined}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              <Num id={`${id}:key-${i}`} n={i + 1} active={active === i} pen={pen} />
              <span className="tp-hand">{c.note}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  )
}
