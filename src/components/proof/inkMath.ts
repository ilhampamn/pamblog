/**
 * Pure seeding helpers for the pen and the printed layer. Kept out of the
 * 'use client' mark module so server components (Print) can call them.
 */

/** FNV-1a → a positive 31-bit seed. */
export function seedFrom(id: string) {
  let h = 0x811c9dc5
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0) % 2147483646 || 1
}

/** Small deterministic PRNG so the geometry (not just rough's jitter) is seeded. */
export function prng(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
