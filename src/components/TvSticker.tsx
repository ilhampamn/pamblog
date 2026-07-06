/**
 * TvSticker — retro TV with a live YouTube embed in the screen.
 *
 * Two modes:
 *  - canvas mode (default): absolute-positioned, managed by applyTransform in Canvas.tsx
 *  - standalone mode: static flow element, used in mobile / HomeList
 *
 * Screen cutout: pixel-sampled from tv.png (1024×1024).
 * Adjust SCREEN_* constants if the image changes.
 */

export interface TvStickerConfig {
  id: string
  videoId: string
  worldX: number
  worldY: number
  rotation?: number
  width?: number
}

// Pixel-sampled from tv.png (1024 × 1024).
// Cream-pixel scan: vertical y=39–65%, horizontal x=25–62%.
const SCREEN_LEFT   = '25%'
const SCREEN_TOP    = '39%'
const SCREEN_WIDTH  = '37%'
const SCREEN_HEIGHT = '26%'

interface TvStickerProps extends Pick<TvStickerConfig, 'id' | 'videoId'> {
  /** Width: px number for canvas mode, CSS string (e.g. '100%') for standalone. */
  width?: number | string
  /** When true, renders as a static block (mobile / standalone). Default: false. */
  standalone?: boolean
}

// Transparent margin in tv.png, pixel-sampled (alpha bbox on the 1024×1024
// source): left/right ≈ 14.75%, top ≈ 14.06%, bottom ≈ 5.66%. In standalone
// mode we scale the inner container up so the visible art (the bbox) fills
// the container on all four sides, and crop the container to the bbox's own
// aspect ratio so no transparent margin survives top/bottom either.
// overflow:hidden on the outer wrapper clips the scaled-up excess.
const STANDALONE_SCALE    = '141.83%'  // 1024 / 722 (bbox width)
const STANDALONE_OFFSET_X = '-20.92%'  // -(left% × scale)
const STANDALONE_OFFSET_Y = '-19.95%'  // -(top% × scale)
const STANDALONE_ASPECT   = '722 / 822' // bbox width : height

export function TvSticker({ id, videoId, width = 300, standalone = false }: TvStickerProps) {
  return (
    <div
      id={id}
      className={standalone ? '' : 'canvas-tv'}
      style={standalone
        ? { width, aspectRatio: STANDALONE_ASPECT, userSelect: 'none', WebkitUserSelect: 'none', overflow: 'hidden' }
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
      {/* In standalone mode: scale inner container up to eat the transparent margins */}
      <div style={{
        position: 'relative',
        width: standalone ? STANDALONE_SCALE : '100%',
        marginLeft: standalone ? STANDALONE_OFFSET_X : 0,
        marginTop: standalone ? STANDALONE_OFFSET_Y : 0,
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/tv.png"
          alt="Retro TV"
          style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
          draggable={false}
        />

        <div
          data-no-pan
          style={{
            position: 'absolute',
            left: SCREEN_LEFT,
            top: SCREEN_TOP,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            overflow: 'hidden',
            borderRadius: 4,
            backgroundColor: '#000',
            pointerEvents: 'auto',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Retro TV"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}
