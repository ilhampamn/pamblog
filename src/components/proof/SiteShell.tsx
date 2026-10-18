'use client'

import Link from 'next/link'
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { holdInk } from './Mark'
import { Bracket } from './Pen'
import { Burger } from './Proof'
import './proof.css'

/**
 * Navigation, Medium's structure (decisions 2026-10-18):
 *
 *   top bar — always there, sticky: menu button + logo on the left, the
 *             primary action on the right.
 *   rail 1  — main navigation (Home · Stories › · Explore · Gallery · About,
 *             "You · later"), opened and closed by the menu button. It pushes
 *             the page on desktop and is a drawer on phones.
 *   rail 2  — the selected section's directory, beside rail 1. Only Stories
 *             has one: a plain folder tree. Closed on Home, open in Stories.
 *
 * The menu button is three pen strokes, not a stock icon. The current page is
 * a pen bracket in rail 1. Escape closes the innermost open thing and returns
 * focus to the button that opened it.
 *
 * Motion — the SLIDE verb (design/specs/motion.md → desktop-sidebar,
 * phone-drawer): paper on paper. Opening commits the new layout at frame 0,
 * then FLIPs the page's children from where they were (one shared Δ, so a
 * sheet never tears). Both rails push the page (Ilham, 2026-10-18): each is
 * a clipping column whose sheet slides inside it by the same Δ as the page,
 * so the page and the sheets move as one and never cross (the overlay
 * version let rail 2 slide across rail 1's text, and the page slide over
 * the rail). Closing runs the reverse, then commits. On phones the rails are drawers
 * that slide in from the side. Ink in a rail waits for the sheet to stop.
 * Only transform, clip-path and opacity move; layout never animates.
 */

type Anim = Animation

/** Motion tokens from CSS (`--m-*` on `:root`), with the spec's values as fallback. */
function token(el: Element, name: string, fallback: string) {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback
}
function ms(el: Element, name: string, fallback: number) {
  return parseFloat(token(el, name, `${fallback}ms`)) || fallback
}
/** The page's direct children: the parts of the sheet that slide. */
function partsOf(main: HTMLElement | null) {
  return Array.from(main?.children ?? []) as HTMLElement[]
}
function leftsOf(main: HTMLElement | null) {
  return partsOf(main).map((c) => c.getBoundingClientRect().left)
}
const isPhone = () => window.matchMedia('(max-width: 900px)').matches
const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** UI strings for the shell, per locale (content/ui/*.json → proof). */
export interface ShellLabels {
  home: string
  stories: string
  explore: string
  gallery: string
  about: string
  openMenu: string
  closeMenu: string
  close: string
  backToMenu: string
  youLater: string
  saved: string
  trips: string
  signIn: string
}

/** A folder in the Stories directory (a season, or Essays) and its pages. */
export interface RailFolder {
  key: string
  label: string
  items: { title: string; href: string }[]
}

export function SiteShell({
  brand,
  actions,
  base,
  current,
  folders,
  footer,
  labels,
  children,
}: {
  brand: ReactNode
  actions: ReactNode
  labels: ShellLabels
  base: string
  current: 'home' | 'stories' | 'explore' | 'gallery' | 'about'
  folders: RailFolder[]
  footer?: ReactNode
  children: ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [storiesOpen, setStoriesOpen] = useState(current === 'stories')
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(folders.map((f) => [f.key, true]))
  )
  const topbar = useRef<HTMLElement>(null)
  // On phones the rails are drawers pinned under the top bar. The bar is
  // sticky, so where its bottom edge sits depends on scroll; measure it.
  const [drawerTop, setDrawerTop] = useState<number | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const storiesButton = useRef<HTMLButtonElement>(null)
  const railId = useId()
  const dirId = useId()

  const shellRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const rail1Ref = useRef<HTMLElement>(null)
  const rail2Ref = useRef<HTMLElement>(null)
  const scrimRef = useRef<HTMLButtonElement>(null)
  const sheet1Ref = useRef<HTMLDivElement>(null)
  const sheet2Ref = useRef<HTMLDivElement>(null)
  const running = useRef<Anim[]>([])
  /** Set before an open: where the page's children were, and what to reveal. */
  const flip = useRef<{
    first: number[]
    reveal: ('rail1' | 'rail2')[]
    dur: number
  } | null>(null)
  /** Close animations held at their end until the layout commits. */
  const settling = useRef<Anim[]>([])

  const stopAll = () => {
    running.current.forEach((a) => a.cancel())
    running.current = []
  }
  const pageParts = () => partsOf(mainRef.current)
  const lefts = () => leftsOf(mainRef.current)
  /** The child nearest the middle of the viewport sets the shared Δ. */
  const anchorIndex = (els: HTMLElement[]) => {
    const mid = window.innerHeight / 2
    let best = 0
    let bestDist = Infinity
    els.forEach((c, i) => {
      const r = c.getBoundingClientRect()
      const d = r.bottom < mid ? mid - r.bottom : r.top > mid ? r.top - mid : 0
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }
  const onScreen = (el: Element) => {
    const r = el.getBoundingClientRect()
    return r.bottom > 0 && r.top < window.innerHeight
  }

  /** Start an open: record "first", commit the state change. */
  const beginOpen = (
    reveal: ('rail1' | 'rail2')[],
    durToken: string,
    durFallback: number,
    commit: () => void
  ) => {
    stopAll()
    const shell = shellRef.current
    const dur = shell ? ms(shell, durToken, durFallback) : durFallback
    flip.current = { first: lefts(), reveal, dur }
    commit()
  }

  /** Run a close, then commit it once the sheets are where they'll end up. */
  const runClose = (which: ('rail1' | 'rail2')[], commit: () => void) => {
    stopAll()
    const shell = shellRef.current
    if (!shell || isReduced()) {
      commit()
      return
    }
    const anims: Anim[] = []
    if (isPhone()) {
      const dur = ms(shell, '--m-slide-close-dur', 200)
      const ease = token(shell, '--m-slide-close-ease', 'cubic-bezier(.4,0,.9,.6)')
      const opts: KeyframeAnimationOptions = {
        duration: dur,
        easing: ease,
        fill: 'forwards',
      }
      if (which.includes('rail2') && rail2Ref.current)
        anims.push(
          rail2Ref.current.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], opts)
        )
      if (which.includes('rail1')) {
        if (rail1Ref.current)
          anims.push(
            rail1Ref.current.animate(
              [{ transform: 'translateX(0)' }, { transform: 'translateX(-102%)' }],
              opts
            )
          )
        if (scrimRef.current)
          anims.push(
            scrimRef.current.animate([{ opacity: 1 }, { opacity: 0 }], {
              ...opts,
              easing: 'linear',
            })
          )
      }
    } else {
      // The proof is coming back to rest, so it decelerates (slide ease).
      const dur = ms(shell, '--m-slide-close-dur', 200)
      const ease = token(shell, '--m-slide-ease', 'cubic-bezier(.3,.1,.2,1)')
      const opts: KeyframeAnimationOptions = {
        duration: dur,
        easing: ease,
        fill: 'forwards',
      }
      // Push (Ilham, 2026-10-18): the page and the closing sheets move left
      // together by the closing columns' width, then the layout commits.
      const cols = which
        .map((w) => (w === 'rail1' ? rail1Ref.current : rail2Ref.current))
        .filter(Boolean) as HTMLElement[]
      const width = cols.reduce((sum, r) => sum + r.getBoundingClientRect().width, 0)
      const to = [{ transform: 'translateX(0)' }, { transform: `translateX(${-width}px)` }]
      which.forEach((w) => {
        const sh = w === 'rail1' ? sheet1Ref.current : sheet2Ref.current
        if (sh) anims.push(sh.animate(to, opts))
      })
      pageParts()
        .filter(onScreen)
        .forEach((c) => anims.push(c.animate(to, opts)))
    }
    running.current = anims
    const last = anims[anims.length - 1]
    if (!last) {
      commit()
      return
    }
    // Commit when the slide ends — or after its duration regardless, since a
    // hidden or backgrounded tab can pause animations and never finish them.
    let done = false
    const finish = () => {
      if (done) return
      done = true
      settling.current = anims
      commit()
    }
    last.onfinish = finish
    const total = Number(last.effect?.getComputedTiming().endTime ?? 200)
    window.setTimeout(finish, total + 80)
  }

  // After every commit: release held close animations (the layout now matches
  // their end state), or play the FLIP + reveal for an open.
  useLayoutEffect(() => {
    if (settling.current.length) {
      settling.current.forEach((a) => a.cancel())
      settling.current = []
      running.current = []
    }
    const f = flip.current
    flip.current = null
    const shell = shellRef.current
    if (!f || !shell) return
    if (isReduced()) {
      f.reveal.forEach((w) => {
        const el = w === 'rail1' ? rail1Ref.current : rail2Ref.current
        const dur = ms(shell, '--m-rm-fade', 120)
        el?.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: dur,
          easing: 'linear',
        })
      })
      return
    }
    const anims: Anim[] = []
    const ease = token(shell, '--m-slide-ease', 'cubic-bezier(.3,.1,.2,1)')
    const opts: KeyframeAnimationOptions = { duration: f.dur, easing: ease }
    if (isPhone()) {
      if (f.reveal.includes('rail1')) {
        if (rail1Ref.current)
          anims.push(
            rail1Ref.current.animate(
              [{ transform: 'translateX(-102%)' }, { transform: 'translateX(0)' }],
              opts
            )
          )
        if (scrimRef.current)
          anims.push(
            scrimRef.current.animate([{ opacity: 0 }, { opacity: 1 }], {
              ...opts,
              easing: 'linear',
            })
          )
      }
      if (f.reveal.includes('rail2') && rail2Ref.current)
        anims.push(
          rail2Ref.current.animate([{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], opts)
        )
    } else {
      // FLIP: one shared Δ from the child nearest the viewport's middle.
      const els = partsOf(mainRef.current)
      const last = leftsOf(mainRef.current)
      const k = anchorIndex(els)
      const dx = (f.first[k] ?? last[k]) - last[k]
      // The revealed sheets start the same Δ to the left, inside their
      // clipping columns, so the page and the sheets arrive as one move and
      // never cross each other.
      if (dx) {
        const from = [{ transform: `translateX(${dx}px)` }, { transform: 'translateX(0)' }]
        els.filter(onScreen).forEach((c) => anims.push(c.animate(from, opts)))
        f.reveal.forEach((w) => {
          const sh = w === 'rail1' ? sheet1Ref.current : sheet2Ref.current
          if (sh) anims.push(sh.animate(from, opts))
        })
      }
    }
    running.current = anims
    holdInk(f.dur + 120)
  }, [menuOpen, storiesOpen])

  const openMenu = () => {
    const both = storiesOpen
    beginOpen(
      both ? ['rail1', 'rail2'] : ['rail1'],
      isPhone() ? '--m-slide-drawer-dur' : both ? '--m-slide-both-dur' : '--m-slide-rail1-dur',
      isPhone() ? 280 : both ? 340 : 280,
      () => setMenuOpen(true)
    )
  }
  const closeMenu = (focus = false) =>
    runClose(storiesOpen ? ['rail1', 'rail2'] : ['rail1'], () => {
      setMenuOpen(false)
      if (focus) menuButton.current?.focus()
    })
  const openStories = () =>
    beginOpen(
      ['rail2'],
      isPhone() ? '--m-slide-drawer2-dur' : '--m-slide-rail2-dur',
      isPhone() ? 260 : 300,
      () => setStoriesOpen(true)
    )
  const closeStories = (focus = false) =>
    runClose(['rail2'], () => {
      setStoriesOpen(false)
      if (focus) storiesButton.current?.focus()
    })

  // The Escape listener always calls the current closers.
  const closers = useRef({ closeMenu, closeStories })
  closers.current = { closeMenu, closeStories }

  useEffect(() => {
    if (!menuOpen) return
    const place = () =>
      setDrawerTop(Math.max(0, Math.round(topbar.current?.getBoundingClientRect().bottom ?? 0)))
    place()
    window.addEventListener('scroll', place, { passive: true })
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place)
      window.removeEventListener('resize', place)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (storiesOpen) closers.current.closeStories(true)
      else closers.current.closeMenu(true)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, storiesOpen])

  const item = (key: typeof current, href: string, label: string) => {
    const link = (
      <Link href={href} className="tp-rail__l1" aria-current={current === key ? 'page' : undefined}>
        {label}
      </Link>
    )
    return current === key ? (
      <Bracket id={`rail:current:${key}`} side="left" className="tp-rail__current">
        {link}
      </Bracket>
    ) : (
      link
    )
  }

  const shell = ['tp-shell', menuOpen && 'is-open', menuOpen && storiesOpen && 'has-l2']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={shellRef}
      className={shell}
      style={drawerTop !== null ? ({ '--drawer-top': `${drawerTop}px` } as React.CSSProperties) : undefined}
    >
      {/* ── Top bar: always there ───────────────────────────────────── */}
      <header ref={topbar} className="tp-topbar">
        <div className="tp-topbar__start">
          <button
            ref={menuButton}
            type="button"
            className="tp-topbar__menu"
            aria-expanded={menuOpen}
            aria-controls={railId}
            aria-label={menuOpen ? labels.closeMenu : labels.openMenu}
            onClick={() => (menuOpen ? closeMenu() : openMenu())}
          >
            <Burger id="topbar:menu" />
          </button>
          {brand}
        </div>
        <div className="tp-topbar__end">{actions}</div>
      </header>

      {/* ── Rail 1: main navigation ─────────────────────────────────── */}
      <aside ref={rail1Ref} id={railId} className="tp-rail" aria-label="Site" hidden={!menuOpen}>
        <div ref={sheet1Ref} className="tp-rail__sheet">
          <nav aria-label="Primary" className="tp-rail__nav">
            {item('home', base, labels.home)}
            <button
              ref={storiesButton}
              type="button"
              className={`tp-rail__l1 ${storiesOpen ? 'is-open' : ''}`}
              aria-expanded={storiesOpen}
              aria-controls={dirId}
              onClick={() => (storiesOpen ? closeStories() : openStories())}
            >
              <span>{labels.stories}</span>
              <span className="tp-rail__chev" aria-hidden>
                ›
              </span>
            </button>
            {item('explore', `${base}/explore`, labels.explore)}
            {item('gallery', `${base}/gallery`, labels.gallery)}
            {item('about', `${base}/about`, labels.about)}
          </nav>

          {/* Reserved for the platform phase: shown, not designed. */}
          <div className="tp-rail__you">
            <span className="tp-label">{labels.youLater}</span>
            <span className="tp-rail__l1 is-later">{labels.saved}</span>
            <span className="tp-rail__l1 is-later">{labels.trips}</span>
            <span className="tp-rail__l1 is-later">{labels.signIn}</span>
          </div>

          {footer && <div className="tp-rail__foot">{footer}</div>}
        </div>
      </aside>

      {/* ── Rail 2: the Stories directory, a plain folder tree ──────── */}
      <aside
        ref={rail2Ref}
        id={dirId}
        className="tp-rail2"
        aria-label={labels.stories}
        hidden={!(menuOpen && storiesOpen)}
      >
        <div ref={sheet2Ref} className="tp-rail__sheet">
          <div className="tp-rail2__top">
            <button
              type="button"
              className="tp-rail__hide tp-rail2__back"
              onClick={() => closeStories(true)}
            >
              {labels.backToMenu}
            </button>
            <span className="tp-rail2__title">{labels.stories}</span>
            <button
              type="button"
              className="tp-rail__hide tp-rail2__close"
              onClick={() => closeStories(true)}
            >
              {labels.close}
            </button>
          </div>
          <ul className="tp-tree">
            {folders.map((f) => {
              const open = openFolders[f.key]
              return (
                <li key={f.key}>
                  <button
                    type="button"
                    className="tp-tree__folder"
                    aria-expanded={open}
                    onClick={() => setOpenFolders((o) => ({ ...o, [f.key]: !o[f.key] }))}
                  >
                    <span className="tp-tree__caret" aria-hidden>
                      {open ? '▾' : '▸'}
                    </span>
                    {f.label}
                  </button>
                  {open && (
                    <ul className="tp-tree__items">
                      {f.items.map((it) => (
                        <li key={it.href}>
                          <Link href={it.href}>{it.title}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {menuOpen && (
        <button
          ref={scrimRef}
          type="button"
          className="tp-rail__scrim"
          aria-label="Close menu"
          onClick={() => closeMenu()}
        />
      )}

      <div ref={mainRef} className="tp-main">
        {children}
      </div>
    </div>
  )
}
