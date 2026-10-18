'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export interface FloatBarSection {
  id: string
  label: string
}

/**
 * Floating section nav for /experiment.
 *
 * One shared pill slides to the active item rather than each item lighting up
 * its own background — that continuity is what makes the Framer "float bar"
 * pattern feel like a physical control instead of a list of tabs.
 *
 * Items are real anchors, so the nav still works (and is keyboard/AT
 * navigable) with JS off; the click handler only upgrades the jump to a smooth
 * scroll. Active state is driven by whichever section crosses the viewport's
 * middle band.
 */
export function FloatBar({ sections }: { sections: FloatBarSection[] }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const barRef = useRef<HTMLElement>(null)
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>())
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })

  // Move the pill onto the active item. Runs on active change and on resize,
  // since item widths shift with the viewport.
  const syncPill = useCallback(() => {
    const item = itemRefs.current.get(activeId)
    if (!item) return
    setPill({ left: item.offsetLeft, width: item.offsetWidth, ready: true })
  }, [activeId])

  useEffect(() => {
    syncPill()
    window.addEventListener('resize', syncPill)
    return () => window.removeEventListener('resize', syncPill)
  }, [syncPill])

  // Keep the active item scrolled into view when the bar overflows on mobile.
  useEffect(() => {
    const item = itemRefs.current.get(activeId)
    const bar = barRef.current
    if (!item || !bar || bar.scrollWidth <= bar.clientWidth) return
    const target = item.offsetLeft - (bar.clientWidth - item.offsetWidth) / 2
    bar.scrollTo({ left: target, behavior: 'smooth' })
  }, [activeId])

  // Active section is derived from geometry rather than IntersectionObserver:
  // a large jump fires the observer for several sections at once with no
  // meaningful ordering, so "first intersecting entry" picks the wrong one.
  // Reading positions directly is deterministic and cheap for a handful of
  // sections.
  useEffect(() => {
    const resolve = () => {
      const doc = document.documentElement
      // Pin the last section once there's no more room to scroll — a short
      // final section may never reach the middle of the viewport.
      if (window.scrollY + window.innerHeight >= doc.scrollHeight - 2) {
        return sections[sections.length - 1].id
      }
      // Otherwise: the last section whose top has passed the reading line.
      const line = window.scrollY + window.innerHeight * 0.45
      let current = sections[0].id
      for (const { id } of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top + window.scrollY <= line) current = id
      }
      return current
    }

    // Reading five rects is cheap enough to run straight off the scroll event.
    // A requestAnimationFrame throttle would be the usual move, but rAF stalls
    // in background/non-rendering tabs, which strands the guard flag and kills
    // the listener permanently.
    const update = () => setActiveId(resolve())

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [sections])

  const handleClick = (event: React.MouseEvent, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    setActiveId(id)
    // Keep the URL shareable without letting the browser also jump.
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <nav ref={barRef} className="exp-floatbar" aria-label="Sections">
      <span
        className="exp-floatbar__pill"
        style={{
          translate: `${pill.left}px 0`,
          width: pill.width,
          opacity: pill.ready ? 1 : 0,
        }}
      />
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          ref={(node) => {
            if (node) itemRefs.current.set(id, node)
            else itemRefs.current.delete(id)
          }}
          onClick={(event) => handleClick(event, id)}
          className="exp-floatbar__item"
          aria-current={activeId === id}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
