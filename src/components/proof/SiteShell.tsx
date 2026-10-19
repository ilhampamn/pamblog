'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
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
 * phone-drawer): paper on paper. The page never changes size when a rail
 * opens (Ilham's recording, 2026-10-19: a narrower column re-wrapped the
 * headline and resized the photo in one frame, which no slide can hide).
 * Instead the page is one sheet that slides right by the open rails' width
 * (anything past the right edge waits off-screen), and the rails slide out
 * from under the top bar alongside it, at the same speed, so nothing crosses.
 * Everything is a CSS transition on `transform`, timed by `data-slide` on the
 * shell. On phones the page stays put and the rails are drawers. Ink in a
 * rail waits for the sheet to stop.
 */

/** Which slide is playing; picks its duration and curve in CSS. */
type Slide = 'rail1' | 'rail2' | 'both' | 'close'

/** Motion tokens from CSS (`--m-*` on `:root`), with the spec's values as fallback. */
function ms(name: string, fallback: number) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return parseFloat(v) || fallback
}
const isPhone = () => window.matchMedia('(max-width: 900px)').matches

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
  current: 'home' | 'stories' | 'gallery' | 'about' | 'none'
  folders: RailFolder[]
  footer?: ReactNode
  children: ReactNode
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [storiesOpen, setStoriesOpen] = useState(current === 'stories')
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(folders.map((f) => [f.key, true]))
  )
  const [slide, setSlide] = useState<Slide>('close')
  const pathname = usePathname()
  const topbar = useRef<HTMLElement>(null)
  // On phones the rails are drawers pinned under the top bar. The bar is
  // sticky, so where its bottom edge sits depends on scroll; measure it.
  const [drawerTop, setDrawerTop] = useState<number | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const storiesButton = useRef<HTMLButtonElement>(null)
  const rail1Ref = useRef<HTMLElement>(null)
  const rail2Ref = useRef<HTMLElement>(null)
  const railId = useId()
  const dirId = useId()

  const rail1Shown = menuOpen
  const rail2Shown = menuOpen && storiesOpen
  // A closed rail stays mounted (so it can slide), but out of the tab order
  // and the accessibility tree. CSS hides it once its slide has finished.
  useEffect(() => {
    if (rail1Ref.current) rail1Ref.current.inert = !rail1Shown
    if (rail2Ref.current) rail2Ref.current.inert = !rail2Shown
  }, [rail1Shown, rail2Shown])

  /** Ink in a rail waits until its sheet has stopped. */
  const waitInk = (kind: Slide) => {
    const dur = isPhone()
      ? ms(kind === 'rail2' ? '--m-slide-drawer2-dur' : '--m-slide-drawer-dur', 280)
      : ms(kind === 'both' ? '--m-slide-both-dur' : kind === 'rail2' ? '--m-slide-rail2-dur' : '--m-slide-rail1-dur', 300)
    holdInk(dur + 120)
  }

  const openMenu = () => {
    const kind: Slide = storiesOpen ? 'both' : 'rail1'
    setSlide(kind)
    setMenuOpen(true)
    waitInk(kind)
  }
  const closeMenu = (focus = false) => {
    setSlide('close')
    setMenuOpen(false)
    if (focus) menuButton.current?.focus()
  }
  const openStories = () => {
    setSlide('rail2')
    setStoriesOpen(true)
    waitInk('rail2')
  }
  const closeStories = (focus = false) => {
    setSlide('close')
    setStoriesOpen(false)
    if (focus) storiesButton.current?.focus()
  }

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

  const shell = ['tp-shell', rail1Shown && 'is-open', rail2Shown && 'has-l2']
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={shell}
      data-slide={slide}
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
      <aside ref={rail1Ref} id={railId} className="tp-rail" aria-label="Site">
        <div className="tp-rail__sheet">
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
            {/* Explore is hidden for now (Ilham, 2026-10-18); see explore/layout.tsx. */}
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
      >
        <div className="tp-rail__sheet">
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
                          <Link href={it.href} aria-current={pathname === it.href ? 'page' : undefined}>
                            {it.title}
                          </Link>
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

      {/* Phones only: the page dims under the drawer; a tap closes it. */}
      <button
        type="button"
        className="tp-rail__scrim"
        aria-label={labels.closeMenu}
        tabIndex={-1}
        onClick={() => closeMenu()}
      />

      <div className="tp-main">
        {children}
      </div>
    </div>
  )
}
