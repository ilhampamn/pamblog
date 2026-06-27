/**
 * Sticker — a draggable image that lives OUTSIDE the canvas world layer.
 *
 * Why outside? The world div uses `will-change: transform` which creates a
 * GPU compositing layer. Everything inside is rasterised at scale 1 and then
 * pixel-scaled on zoom — images go blurry. By living outside that layer,
 * stickers are re-rasterised by the browser at whatever CSS size they're
 * actually displayed at → always sharp.
 *
 * Positioning is driven entirely by Canvas.tsx's `applyTransform`:
 *   screen_left = panX + worldX * zoom
 *   screen_top  = panY + worldY * zoom
 *   css_width   = config_width * zoom
 *
 * To add a new sticker, add one entry to the STICKERS array in Canvas.tsx.
 */
export interface StickerConfig {
  /** Unique identifier — also used as the element id. */
  id: string
  /** Path to the image in /public, e.g. "/stickers/rainbow.webp". */
  src: string
  /** Alt text for the image. */
  alt: string
  /** Centre position in world coordinates. */
  worldX: number
  worldY: number
  /** Rotation in degrees (default 0). */
  rotation?: number
  /** Base display width in world px at zoom 1 (height is auto). */
  width?: number
}

export function Sticker({ id, src, alt }: Pick<StickerConfig, 'id' | 'src' | 'alt'>) {
  return (
    <div
      id={id}
      className="canvas-sticker"
      style={{
        position: 'absolute',
        // Offscreen until Canvas's applyTransform sets the real position.
        left: -9999,
        top: -9999,
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* pointer-events:none on the img bubbles events to the wrapper div,
          which the canvas drag system detects via .canvas-sticker. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
        draggable={false}
      />
    </div>
  )
}
