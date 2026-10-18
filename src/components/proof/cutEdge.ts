import { prng, seedFrom } from './inkMath'

/**
 * An uneven, slightly skewed block edge as a CSS polygon.
 *
 * The slant is shared by both long edges (a parallelogram, not a wedge): the
 * top comes in by `skew·(1−t)` and the bottom by `skew·t`, so on average each
 * edge loses the same amount and the visible block stays centred on the box
 * its label is centred in. Wobble is symmetric for the same reason.
 */
export function cutEdge(id: string, { wobble = 2, tilt = 3 }: { wobble?: number; tilt?: number } = {}) {
  const r = prng(seedFrom(id))
  const j = () => Math.round(r() * wobble) // inset only, 0…wobble px
  const skew = Math.round(r() * tilt)
  const down = r() < 0.5 // which way the block leans
  const N = 6
  const pts: string[] = []
  const lean = (t: number) => Math.round(skew * (down ? 1 - t : t))
  // top: left → right
  for (let i = 0; i <= N; i++) {
    const t = i / N
    pts.push(`calc(${(t * 100).toFixed(1)}% + ${i === 0 ? j() : i === N ? -j() : 0}px) ${lean(t) + j()}px`)
  }
  // right: top → bottom
  for (let i = 1; i < 3; i++) pts.push(`calc(100% - ${j()}px) ${((i / 3) * 100).toFixed(1)}%`)
  // bottom: right → left
  for (let i = N; i >= 0; i--) {
    const t = i / N
    pts.push(`calc(${(t * 100).toFixed(1)}% + ${i === 0 ? j() : i === N ? -j() : 0}px) calc(100% - ${skew - lean(t) + j()}px)`)
  }
  // left: bottom → top
  for (let i = 2; i > 0; i--) pts.push(`${j()}px ${((i / 3) * 100).toFixed(1)}%`)
  return `polygon(${pts.join(', ')})`
}
