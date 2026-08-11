'use client'
import { useCallback, useEffect, useRef } from 'react'
import Link from 'next/link'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { NewsletterWidget } from './NewsletterWidget'
import { Sticker, type StickerConfig } from './Sticker'
import { Polaroid, type PolaroidConfig } from './Polaroid'
import { VideoPolaroid, type VideoPolaroidConfig } from './VideoPolaroid'
// import { PaperPlane3D } from './PaperPlane3D'
import { StickyNote } from './StickyNote'
import { RoughHeart } from './RoughHeart'
import { RoughBackpack, RoughGlobe, RoughWelcome } from './RoughDoodles'
import { RopeLayer, type RopeConnection } from './RopeLayer'
import type { Post } from '@/lib/posts.sanity'
import type { Locale } from '@/lib/i18n'

export interface CanvasProps {
  locale: Locale
  posts: Post[]
  ui: {
    tagline: string
    currently: string
    currentlyReading: string
    currentlyWorking: string
    aboutSnippet: string
    aboutLink: string
  }
  newsletter: {
    cta: string
    placeholder: string
    button: string
  }
  allowMobileInteraction?: boolean
}

// ── World geometry ──────────────────────────────────────────────────────────
// The canvas is a large finite plane the user pans across. Cards are laid out
// in WORLD coordinates around its centre; on mount we centre the viewport there.
const WORLD_W = 4000
const WORLD_H = 3000
const CENTER_X = WORLD_W / 2
const CENTER_Y = WORLD_H / 2

const MIN_SCALE = 0.4
const MAX_SCALE = 2.5
const GRID_SIZE = 24
// Viewport width the layout was designed at (scale 1 looks right here, e.g.
// the 680px-wide video polaroid fits comfortably). Narrower viewports —
// mostly phones, since the canvas is opt-in there via allowMobileInteraction —
// start zoomed out proportionally instead of overflowing at scale 1.
const REFERENCE_VIEWPORT_WIDTH = 820
// How far past the world edges the viewport may overscroll, in screen px.
const PAN_MARGIN = 200
const LABUAN_BAJO_IMAGE =
  'https://res.cloudinary.com/bub4hnum/image/upload/f_auto,q_auto/v1784942935/402F38BD-7487-4EEC-B6C6-21E5D0BF8C66_ixzzxo.jpg'

// TAG_COLORS kept for future use (HomeList still uses it)
// const TAG_COLORS: Record<string, string> = { ... }

// A card's centre position in world coordinates.
interface Placed {
  x: number
  y: number
  rotation: number
}

// Card position extended with width for the ref map.
interface CardPos {
  x: number
  y: number
  rotation: number
  width: number
}

const POST_LAYOUT: Placed[] = [
  { x: CENTER_X + 565, y: CENTER_Y - 85, rotation: -4 },
  { x: CENTER_X - 375, y: CENTER_Y + 520, rotation: 0 },
  { x: CENTER_X + 760, y: CENTER_Y + 610, rotation: 3 },
  { x: CENTER_X - 730, y: CENTER_Y + 650, rotation: -3 },
  { x: CENTER_X + 760, y: CENTER_Y - 420, rotation: 2 },
]

// ── Stickers ────────────────────────────────────────────────────────────────
// Add new stickers here — they appear on the canvas and are independently
// draggable. `worldX` / `worldY` are the centre position in world coordinates.
const STICKERS: StickerConfig[] = [
  {
    id: 'sticker-rainbow',
    src: '/stickers/rainbow.webp',
    alt: 'Rainbow sticker',
    worldX: CENTER_X + 420,
    worldY: CENTER_Y - 480,
    rotation: 12,
    width: 130,
  },
  {
    id: 'sticker-paperplane',
    src: '/stickers/paperplane.png',
    alt: 'Paper plane sticker',
    worldX: CENTER_X - 550,
    worldY: CENTER_Y - 400,
    rotation: -8,
    width: 120,
  },
]

const ROUGH_DRAWINGS = [
  {
    id: 'rough-welcome',
    kind: 'welcome',
    worldX: CENTER_X + 45,
    worldY: CENTER_Y - 175,
    rotation: -1.5,
    width: 560,
  },
  {
    id: 'rough-heart',
    kind: 'heart',
    worldX: CENTER_X - 65,
    worldY: CENTER_Y + 650,
    rotation: 7,
    width: 210,
  },
  {
    id: 'rough-globe',
    kind: 'globe',
    worldX: CENTER_X - 555,
    worldY: CENTER_Y + 10,
    rotation: -7,
    width: 190,
  },
  {
    id: 'rough-backpack',
    kind: 'backpack',
    worldX: CENTER_X + 520,
    worldY: CENTER_Y + 250,
    rotation: 5,
    width: 185,
  },
] as const

const ROPE_CONNECTIONS: RopeConnection[] = [
  {
    id: 'essay-to-labuan-bajo',
    fromId: 'card-a-not-so-hidden-gem-karimun-jawa',
    toId: 'polaroid-labuan-bajo',
    color: '#c9364f',
  },
]

export function Canvas({
  locale,
  posts,
  ui,
  newsletter,
  allowMobileInteraction = false,
}: CanvasProps) {
  // ── Polaroids ────────────────────────────────────────────────────────────────
  // Add photo polaroids here — same drag mechanics as stickers, but wrapped in a
  // classic white polaroid frame. Width sets the photo area; height is automatic.
  const POLAROIDS: PolaroidConfig[] = [
    {
      id: 'polaroid-alaarcha',
      src: '/stickers/alaarcha.webp',
      alt: 'Ala-Archa',
      caption: 'Ala Archa\n2024',
      links: [
        { label: 'Destination', href: `/${locale}/explore/destinations/kyrgyzstan/bishkek/ala-archa-national-park` },
        { label: 'Itinerary', href: `/${locale}/explore/itineraries/3-days-in-hanoi` },
      ],
      worldX: CENTER_X - 480,
      worldY: CENTER_Y + 245,
      rotation: -6,
      width: 170,
    },
    {
      id: 'polaroid-labuan-bajo',
      src: LABUAN_BAJO_IMAGE,
      alt: 'Labuan Bajo',
      caption: 'Labuan Bajo',
      worldX: CENTER_X + 515,
      worldY: CENTER_Y + 535,
      rotation: 5,
      width: 175,
    },
  ]

  // ── Video Polaroids ──────────────────────────────────────────────────────────
  // Landscape instant-film frames with live YouTube embeds.
  const VIDEO_POLAROIDS: VideoPolaroidConfig[] = [
    {
      id: 'tv-youtube',
      videoId: 'wM2G2exs15w',
      caption: 'the memories.',
      postedAt: '27 June 2026',
      worldX: CENTER_X + 45,
      // Keep the large frame clear of the fixed navigation on initial load.
      worldY: CENTER_Y + 165,
      rotation: -1.5,
      width: 680,
    },
  ]
  const containerRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)

  // Live transform state kept in refs so panning/zooming never triggers React
  // re-renders — we write straight to the DOM each frame.
  const tx = useRef(0)
  const ty = useRef(0)
  const scale = useRef(1)

  // Mutable world-space positions for stickers + polaroids (updated while dragging).
  // Using a ref avoids re-renders; applyTransform converts to screen coords.
  const stickerPos = useRef(
    new Map([
      ...STICKERS.map(s    => [s.id, { x: s.worldX, y: s.worldY }] as [string, { x: number; y: number }]),
      ...POLAROIDS.map(p   => [p.id, { x: p.worldX, y: p.worldY }] as [string, { x: number; y: number }]),
      ...VIDEO_POLAROIDS.map(t => [t.id, { x: t.worldX, y: t.worldY }] as [string, { x: number; y: number }]),
      ...ROUGH_DRAWINGS.map(drawing => [
        drawing.id,
        { x: drawing.worldX, y: drawing.worldY },
      ] as [string, { x: number; y: number }]),
    ])
  )

  // Compute initial card positions once (these are stable values).
  const newsletterPos: Placed = {
    x: CENTER_X + 70,
    y: CENTER_Y + 510,
    rotation: 0,
  }
  const currentlyPos: Placed = {
    x: CENTER_X + 205,
    y: CENTER_Y - 400,
    rotation: 0,
  }
  const aboutPos: Placed = {
    x: CENTER_X - 405,
    y: CENTER_Y - 205,
    rotation: 0,
  }

  // Mutable world-space positions for cards (updated while dragging).
  // width is the card's intrinsic world-px width; applyTransform scales it.
  const cardPos = useRef<Map<string, CardPos>>(new Map())

  // Initialise cardPos once on mount (posts are stable across renders).
  // We do this outside useEffect so the ref is ready before applyTransform.
  if (cardPos.current.size === 0) {
    cardPos.current.set('newsletter', { ...newsletterPos, width: 256 }) // w-64 = 256px
    cardPos.current.set('currently', { ...currentlyPos, width: 208 })  // w-52 = 208px
    cardPos.current.set('about', { ...aboutPos, width: 224 })           // w-56 = 224px
    posts.slice(0, 5).forEach((post, i) => {
      const pos = POST_LAYOUT[i]
      cardPos.current.set(post.slug, { ...pos, width: 208 })
    })
  }

  const applyTransform = useCallback(() => {
    const world = worldRef.current
    if (!world) return
    world.style.transform = `translate(${tx.current}px, ${ty.current}px) scale(${scale.current})`

    // Keep the grid infinite, but anchor it to the same world origin as every
    // canvas object. Its cells grow and shrink with zoom, and its offset follows
    // pan, instead of remaining pinned to the screen at a fixed 24px size.
    const viewport = containerRef.current
    if (viewport) {
      const scaledGridSize = GRID_SIZE * scale.current
      viewport.style.backgroundSize = `${scaledGridSize}px ${scaledGridSize}px`
      viewport.style.backgroundPosition = `${tx.current - scale.current}px ${ty.current - scale.current}px`
      viewport.dataset.canvasScale = String(scale.current)
    }

    // Stickers + Polaroids live outside the world layer — re-rasterised at the
    // correct display size on every zoom change, always sharp.
    // Stickers: scale by resizing width (image fills 100%, height is auto — no
    // internal layout to break).
    STICKERS.forEach(({ id, width = 130, rotation = 0 }) => {
      const el = document.getElementById(id)
      if (!el) return
      const pos = stickerPos.current.get(id)!
      el.style.left      = `${tx.current + pos.x * scale.current}px`
      el.style.top       = `${ty.current + pos.y * scale.current}px`
      el.style.width     = `${width * scale.current}px`
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
    })

    ROUGH_DRAWINGS.forEach(({ id, width, rotation }) => {
      const drawing = document.getElementById(id)
      if (!drawing) return
      const pos = stickerPos.current.get(id)!
      drawing.style.left = `${tx.current + pos.x * scale.current}px`
      drawing.style.top = `${ty.current + pos.y * scale.current}px`
      drawing.style.width = `${width * scale.current}px`
      drawing.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`
      if (id === 'rough-welcome') drawing.style.fontSize = `${48 * scale.current}px`
    })

    // Polaroids: fixed CSS width + scale() in transform — identical to how
    // cards work. This scales the image AND the padding proportionally without
    // the percentage-padding-from-viewport bug.
    POLAROIDS.forEach(({ id, rotation = 0 }) => {
      const el = document.getElementById(id)
      if (!el) return
      const pos = stickerPos.current.get(id)!
      el.style.left      = `${tx.current + pos.x * scale.current}px`
      el.style.top       = `${ty.current + pos.y * scale.current}px`
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale.current})`
    })

    // Video Polaroids use the same fixed-width scale transform as photo Polaroids.
    VIDEO_POLAROIDS.forEach(({ id, rotation = 0 }) => {
      const el = document.getElementById(id)
      if (!el) return
      const pos = stickerPos.current.get(id)!
      el.style.left      = `${tx.current + pos.x * scale.current}px`
      el.style.top       = `${ty.current + pos.y * scale.current}px`
      el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale.current})`
    })

    // Cards live outside the world layer (sharp at any zoom).
    // We position their centre in screen space and add scale(zoom) to the CSS
    // transform so that font, padding, and borders all shrink/grow together —
    // the same proportional result as being inside the world, but without the
    // GPU-compositing blur that will-change:transform causes for raster content.
    cardPos.current.forEach((pos, id) => {
      const el = document.getElementById(`card-${id}`)
      if (!el) return
      el.style.left      = `${tx.current + pos.x * scale.current}px`
      el.style.top       = `${ty.current + pos.y * scale.current}px`
      el.style.transform = `translate(-50%, -50%) rotate(${pos.rotation}deg) scale(${scale.current})`
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the viewport within the world (with a soft overscroll margin).
  const clampPan = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const vw = el.clientWidth
    const vh = el.clientHeight
    const worldW = WORLD_W * scale.current
    const worldH = WORLD_H * scale.current

    // Allow a small overscroll past each edge, but keep the world in view.
    const loX = vw - worldW - PAN_MARGIN
    const hiX = PAN_MARGIN
    const loY = vh - worldH - PAN_MARGIN
    const hiY = PAN_MARGIN
    tx.current = Math.min(hiX, Math.max(loX, tx.current))
    ty.current = Math.min(hiY, Math.max(loY, ty.current))
  }, [])

  // Centre the viewport on the world centre at the current scale.
  const centerOnWorld = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    tx.current = el.clientWidth / 2 - CENTER_X * scale.current
    ty.current = el.clientHeight / 2 - CENTER_Y * scale.current
    clampPan()
    applyTransform()
  }, [applyTransform, clampPan])

  // Scale that fits the layout to narrower viewports instead of overflowing
  // at scale 1 (which is tuned for REFERENCE_VIEWPORT_WIDTH).
  const fitScale = useCallback(() => {
    const el = containerRef.current
    if (!el) return 1
    return Math.min(1, Math.max(MIN_SCALE, el.clientWidth / REFERENCE_VIEWPORT_WIDTH))
  }, [])

  // Zoom toward a screen point (keeps the world point under the cursor fixed).
  const zoomTo = useCallback(
    (nextScale: number, screenX: number, screenY: number) => {
      const el = containerRef.current
      if (!el) return
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale))
      const rect = el.getBoundingClientRect()
      const cx = screenX - rect.left
      const cy = screenY - rect.top
      // World coordinate currently under the cursor.
      const wx = (cx - tx.current) / scale.current
      const wy = (cy - ty.current) / scale.current
      scale.current = clamped
      tx.current = cx - wx * clamped
      ty.current = cy - wy * clamped
      clampPan()
      applyTransform()
    },
    [applyTransform, clampPan]
  )

  // ── Pan + zoom interaction ──
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let panning = false
    let lastX = 0
    let lastY = 0
    // Card currently being dragged (null when panning / idle).
    let dragCard: HTMLElement | null = null
    let dragMoved = false
    let zTop = 100
    // Cards that were just dragged — their next click is suppressed so a drag
    // never accidentally navigates a post link.
    const draggedRecently = new WeakSet<Element>()
    // Active pointers for pinch.
    const pointers = new Map<number, { x: number; y: number }>()
    let pinchStartDist = 0
    let pinchStartScale = 1

    // Inputs/buttons/zoom-controls keep their native behaviour (no pan/drag).
    const isControl = (target: EventTarget | null) =>
      target instanceof Element && target.closest('input, textarea, button, [data-no-pan]')

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointers.size === 2) {
        // Begin pinch — cancel any in-progress pan/card-drag.
        const pts = Array.from(pointers.values())
        pinchStartDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        pinchStartScale = scale.current
        panning = false
        dragCard = null
        return
      }

      if (isControl(e.target)) return

      const card =
        e.target instanceof Element
          ? (e.target.closest('.canvas-card, .canvas-sticker') as HTMLElement | null)
          : null

      if (card) {
        // Grab a single card — do NOT capture the pointer here.
        // setPointerCapture redirects the synthesized click event to `el`,
        // meaning the <Link/><a> inside the card would never receive it.
        // Our listeners are on the full-viewport container so we don't need
        // capture to keep receiving moves while over the canvas.
        dragCard = card
        dragMoved = false
        card.style.zIndex = String(++zTop)
        card.style.cursor = 'grabbing'
        card.classList.add('is-dragging')
      } else {
        // Grab empty space → pan the whole canvas.
        // Capture IS useful here so panning continues if the pointer briefly
        // leaves the viewport window.
        panning = true
        el.style.cursor = 'grabbing'
        el.setPointerCapture(e.pointerId)
      }
      lastX = e.clientX
      lastY = e.clientY
    }

    const onPointerMove = (e: PointerEvent) => {
      if (pointers.has(e.pointerId)) {
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      }

      if (pointers.size === 2 && pinchStartDist > 0) {
        const pts = Array.from(pointers.values())
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        const midX = (pts[0].x + pts[1].x) / 2
        const midY = (pts[0].y + pts[1].y) / 2
        zoomTo(pinchStartScale * (dist / pinchStartDist), midX, midY)
        return
      }

      const dx = e.clientX - lastX
      const dy = e.clientY - lastY

      if (dragCard) {
        if (Math.abs(dx) + Math.abs(dy) > 3) dragMoved = true

        if (dragCard.classList.contains('canvas-sticker')) {
          // Stickers are positioned in screen space; update their world-coord
          // ref and let applyTransform recompute the screen position.
          const pos = stickerPos.current.get(dragCard.id)
          if (pos) {
            pos.x += dx / scale.current
            pos.y += dy / scale.current
            applyTransform()
          }
        } else if (dragCard.classList.contains('canvas-card')) {
          // Cards are also positioned via the ref map; update world coords and
          // let applyTransform recompute the screen position.
          // The DOM id is prefixed with 'card-'; strip it to get the map key.
          const cardId = dragCard.id.replace(/^card-/, '')
          const pos = cardPos.current.get(cardId)
          if (pos) {
            pos.x += dx / scale.current
            pos.y += dy / scale.current
            applyTransform()
          }
        }

        lastX = e.clientX
        lastY = e.clientY
        return
      }

      if (!panning) return
      tx.current += dx
      ty.current += dy
      lastX = e.clientX
      lastY = e.clientY
      clampPan()
      applyTransform()
    }

    const endPointer = (e: PointerEvent) => {
      pointers.delete(e.pointerId)
      if (pointers.size < 2) pinchStartDist = 0

      if (dragCard) {
        if (dragMoved) draggedRecently.add(dragCard)
        dragCard.classList.remove('is-dragging')
        dragCard.style.cursor = ''
        dragCard = null
      }
      if (panning && pointers.size === 0) {
        panning = false
        el.style.cursor = ''
      }
    }

    // Suppress the click that follows a real drag so links don't navigate.
    const onClickCapture = (e: MouseEvent) => {
      const card =
        e.target instanceof Element
          ? (e.target.closest('.canvas-card, .canvas-sticker') as HTMLElement | null)
          : null
      if (card && draggedRecently.has(card)) {
        e.preventDefault()
        e.stopPropagation()
        draggedRecently.delete(card)
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      // Normalise line/page deltas to pixels.
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1
      const dy = e.deltaY * unit
      const dx = e.deltaX * unit

      // Trackpad pinch + ctrl/⌘+wheel arrive with ctrlKey set → zoom toward the
      // cursor. Plain two-finger scroll pans the canvas instead.
      if (e.ctrlKey || e.metaKey) {
        const factor = Math.exp(-dy * 0.01)
        zoomTo(scale.current * factor, e.clientX, e.clientY)
      } else {
        tx.current -= dx
        ty.current -= dy
        clampPan()
        applyTransform()
      }
    }

    const onResize = () => {
      clampPan()
      applyTransform()
    }

    // Fired by HomeExperience right after it un-hides the canvas (it mounts at
    // display:none behind the List view on mobile, so the fitScale() call in
    // attach() below runs against clientWidth 0). A plain 'resize' event isn't
    // enough since onResize deliberately preserves the current scale/pan.
    const onFit = () => {
      scale.current = fitScale()
      centerOnWorld()
    }
    window.addEventListener('canvas:fit', onFit)

    // Prevent the browser from treating <a> card elements as something to
    // drag-and-drop (e.g. dragging the URL/link). Without this, pointerdown on a
    // link card triggers a native HTML drag, which steals the pointer immediately
    // and our pointermove handlers never fire.
    const onDragStart = (e: DragEvent) => e.preventDefault()

    const attach = () => {
      el.addEventListener('pointerdown', onPointerDown)
      el.addEventListener('pointermove', onPointerMove)
      el.addEventListener('pointerup', endPointer)
      el.addEventListener('pointercancel', endPointer)
      el.addEventListener('click', onClickCapture, true)
      el.addEventListener('dragstart', onDragStart)
      el.addEventListener('wheel', onWheel, { passive: false })
      window.addEventListener('resize', onResize)
      scale.current = fitScale()
      centerOnWorld()
    }
    const detach = () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endPointer)
      el.removeEventListener('pointercancel', endPointer)
      el.removeEventListener('click', onClickCapture, true)
      el.removeEventListener('dragstart', onDragStart)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('canvas:fit', onFit)
      window.removeEventListener('resize', onResize)
    }

    // The canvas is a desktop-only experience; mobile renders a list instead.
    // Attach pan/zoom only at ≥768px and (de)activate on breakpoint crossings.
    const desktop = window.matchMedia(
      allowMobileInteraction ? '(min-width: 0px)' : '(min-width: 768px)',
    )
    let active = false
    const sync = () => {
      if (desktop.matches && !active) {
        attach()
        active = true
      } else if (!desktop.matches && active) {
        detach()
        active = false
      }
    }
    sync()
    desktop.addEventListener('change', sync)

    return () => {
      desktop.removeEventListener('change', sync)
      if (active) detach()
    }
  }, [allowMobileInteraction, applyTransform, centerOnWorld, clampPan, fitScale, zoomTo])

  // ── Entrance: gentle staggered fade-in of the cards ──
  useEffect(() => {
    const reduced = prefersReducedMotion()
    const items = gsap.utils.toArray<HTMLElement>('.canvas-card')
    if (reduced) {
      gsap.set(items, { opacity: 1 })
      return
    }
    // Only animate opacity — cards are now positioned via CSS transform
    // (translate + rotate set by applyTransform). Animating scale here would
    // overwrite that transform and break card positioning.
    gsap.fromTo(
      items,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: { amount: 0.7, from: 'center' },
      }
    )
  }, [])

  const zoomButton = (delta: number) => () => {
    const el = containerRef.current
    if (!el) return
    zoomTo(scale.current * delta, el.clientWidth / 2 + el.getBoundingClientRect().left, el.clientHeight / 2 + el.getBoundingClientRect().top)
  }

  const resetView = () => {
    scale.current = fitScale()
    centerOnWorld()
  }

  return (
    <div
      ref={containerRef}
      className="canvas-viewport relative w-full overflow-hidden touch-none"
      style={{
        height: '100svh',
        backgroundColor: 'var(--color-paper)',
        backgroundImage: 'linear-gradient(var(--color-grid-home) 1px, transparent 1px), linear-gradient(90deg, var(--color-grid-home) 1px, transparent 1px)',
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: '-1px -1px',
      }}
    >
      {/* Paper texture overlay — fixed to the viewport, above the dot grid. */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.05] z-10"
        aria-hidden="true"
      >
        <filter id="paper-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#paper-noise)" />
      </svg>

      <RopeLayer connections={ROPE_CONNECTIONS} />

      {/* ── The transparent pannable / zoomable world ── */}
      <div
        ref={worldRef}
        className="canvas-world absolute top-0 left-0"
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transformOrigin: '0 0',
        }}
      />

      {/* ── Cards — outside the world layer so they aren't rasterised by the GPU
          compositing layer. Position is set in screen-space by applyTransform.
          Proportional scaling (font, padding, borders) is achieved by adding
          scale(zoom) to each card's CSS transform — NOT by resizing width — so
          everything stays sharp at any zoom level. ── */}

      {/* ── Post cards (sticky-note style) ── */}
      {posts.slice(0, 5).map((post) => (
        <StickyNote
          key={post.slug}
          href={`/${locale}/blog/${post.slug}`}
          id={`card-${post.slug}`}
          data-slug={post.slug}
          rotation={0.45}
          className="canvas-card block"
          style={{
            position: 'absolute',
            left: -9999,
            top: -9999,
            width: cardPos.current.get(post.slug)!.width,
            padding: '18px 20px 20px',
          }}
        >
          {/* Tag */}
          <p style={{ fontSize: 17, lineHeight: 1.2, opacity: 0.72, marginBottom: 10, letterSpacing: '0.04em' }}>
            {post.tag}
          </p>
          {/* Title */}
          <p style={{ fontSize: 27, lineHeight: 1.2, marginBottom: 26 }}>
            {post.title}
          </p>
          {/* Footer row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 17, lineHeight: 1.2, opacity: 0.72 }}>
            <span>{post.readingTime} min read</span>
            <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1 }}>→</span>
          </div>
        </StickyNote>
      ))}

      {/* ── Newsletter card ── */}
      <div
        className="canvas-card p-5"
        id="card-newsletter"
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          width: cardPos.current.get('newsletter')!.width,
          backgroundColor: 'var(--color-ghost)',
          border: '1px solid var(--color-torn)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <NewsletterWidget
          cta={newsletter.cta}
          placeholder={newsletter.placeholder}
          button={newsletter.button}
        />
      </div>

      {/* ── Currently card ── */}
      <div
        className="canvas-card p-5"
        id="card-currently"
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          width: cardPos.current.get('currently')!.width,
          backgroundColor: 'var(--color-paper)',
          border: '1px solid var(--color-torn)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <span className="label-stamped block mb-3">{ui.currently}</span>
        <p className="text-sm mb-2" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
          📖 {ui.currentlyReading}
        </p>
        <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
          🛠 {ui.currentlyWorking}
        </p>
      </div>

      {/* ── About snippet card ── */}
      <div
        className="canvas-card p-5"
        id="card-about"
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          width: cardPos.current.get('about')!.width,
          backgroundColor: 'var(--color-ghost)',
          border: '1px solid var(--color-torn)',
          borderRadius: 'var(--radius-card)',
        }}
      >
        <p className="text-sm mb-3" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink)' }}>
          {ui.aboutSnippet}
        </p>
        <Link
          href={`/${locale}/about`}
          className="label-stamped hover:text-[var(--color-ink)] transition-colors"
        >
          {ui.aboutLink}
        </Link>
      </div>

      {/* ── Stickers — also outside the world layer, same reason. ── */}
      {STICKERS.map((s) => (
        <Sticker key={s.id} id={s.id} src={s.src} alt={s.alt} filter={s.filter} />
      ))}

      {ROUGH_DRAWINGS.map((drawing) => {
        const Component =
          drawing.kind === 'welcome'
            ? RoughWelcome
            : drawing.kind === 'heart'
            ? RoughHeart
            : drawing.kind === 'globe'
              ? RoughGlobe
              : RoughBackpack
        return (
          <Component
            key={drawing.id}
            id={drawing.id}
            className="canvas-sticker rough-drawing"
            style={{
              position: 'absolute',
              left: -9999,
              top: -9999,
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}
          />
        )
      })}

      {/* ── Polaroids — draggable photo cards with a white frame. ── */}
      {POLAROIDS.map((p) => (
        <Polaroid key={p.id} id={p.id} src={p.src} alt={p.alt} caption={p.caption} width={p.width} links={p.links} />
      ))}

      {/* ── Featured videos in landscape instant-film frames. ── */}
      {VIDEO_POLAROIDS.map((video) => (
        <VideoPolaroid
          key={video.id}
          id={video.id}
          videoId={video.videoId}
          caption={video.caption}
          postedAt={video.postedAt}
          width={video.width}
        />
      ))}

      {/* ── Zoom controls ── */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2" data-no-pan>
        <button
          type="button"
          onClick={zoomButton(1.2)}
          aria-label="Zoom in"
          className="canvas-control"
        >
          +
        </button>
        <button
          type="button"
          onClick={zoomButton(1 / 1.2)}
          aria-label="Zoom out"
          className="canvas-control"
        >
          −
        </button>
        <button
          type="button"
          onClick={resetView}
          aria-label="Reset view"
          className="canvas-control text-xs"
        >
          ⤢
        </button>
      </div>

      {/* Cursor-following paper plane — hidden for now, revisit later */}
      {/* <PaperPlane3D /> */}
    </div>
  )
}
