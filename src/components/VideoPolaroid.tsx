/**
 * VideoPolaroid — a live YouTube embed in a landscape instant-film frame.
 *
 * Canvas mode is positioned by Canvas.tsx. Standalone mode is used in the
 * mobile list, where it fills the available width.
 */
export interface VideoPolaroidConfig {
  id: string
  videoId: string
  caption: string
  postedAt: string
  worldX: number
  worldY: number
  rotation?: number
  width?: number
}

interface VideoPolaroidProps extends Pick<VideoPolaroidConfig, 'id' | 'videoId' | 'caption' | 'postedAt' | 'rotation'> {
  /** Width: px number for canvas mode, CSS string (e.g. '100%') for standalone. */
  width?: number | string
  /** When true, renders as a static block (mobile / standalone). Default: false. */
  standalone?: boolean
}

export function VideoPolaroid({
  id,
  videoId,
  caption,
  postedAt,
  rotation = 0,
  width = 780,
  standalone = false,
}: VideoPolaroidProps) {
  const numericWidth = typeof width === 'number' ? width : 420
  const sidePad = Math.max(12, Math.round(numericWidth * 0.03))
  const bottomPad = Math.max(38, Math.round(numericWidth * 0.105))

  return (
    <div
      id={id}
      className={standalone ? 'polaroid video-polaroid' : 'polaroid video-polaroid canvas-video'}
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
      <span className="video-polaroid__tape" aria-hidden="true" />
      <div
        className="polaroid__paper"
        style={{ padding: `${sidePad}px ${sidePad}px 0` }}
      >
        <div
          data-no-pan
          className="polaroid__photo-well"
          style={{
            // The source is approximately 3:2. Matching its ratio prevents
            // YouTube from adding black pillarbox bars inside the frame.
            aspectRatio: '3 / 2',
            pointerEvents: 'auto',
          }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            title="Featured YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 0,
              display: 'block',
            }}
          />
        </div>
        <div
          className="video-polaroid__caption"
          style={{ minHeight: bottomPad }}
        >
          <span>{caption}</span>
          <time>{postedAt}</time>
        </div>
      </div>
    </div>
  )
}
