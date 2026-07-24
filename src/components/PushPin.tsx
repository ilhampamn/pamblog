interface PushPinProps {
  tone?: 'red' | 'gold' | 'black'
  className?: string
}

/**
 * A small, CSS-rendered pushpin. The separate needle, cast shadow, rim and
 * highlight make it read as a physical object without adding an image asset.
 */
export function PushPin({ tone = 'red', className = '' }: PushPinProps) {
  return (
    <span className={`paper-pin paper-pin--${tone} ${className}`} aria-hidden="true">
      <span className="paper-pin__cast-shadow" />
      <span className="paper-pin__needle" />
      <span className="paper-pin__head" />
    </span>
  )
}
