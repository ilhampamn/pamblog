import localFont from 'next/font/local'
import { Newsreader, Tinos, Inter } from 'next/font/google'

/**
 * Type system for /experiment-3.
 *
 * Four roles, deliberately no more:
 *   logo    — one of four Javanese-script-inspired display faces (see below)
 *   heading — Newsreader, a news serif in the Cheltenham/NYT register
 *   body    — Tinos, metrically compatible with Times New Roman but properly
 *             hinted and hosted, so we get the requested "Times" texture
 *             without falling back to the OS's poorly-rendering copy
 *   meta    — Inter, only ever uppercase and letterspaced (kickers, datelines,
 *             bylines, nav). The grot is what keeps the serif grid crisp.
 *
 * Loaded here rather than in the locale layout so only this route pays for it.
 */

/* ─── Logo candidates ──────────────────────────────────────────────────────
   All four are Latin faces drawn under the influence of aksara Jawa. They are
   the single strongest brand asset on this page, so the page ships a live
   switcher (Ex3LogoLab) rather than a decision baked into the CSS.

   Shipped as WOFF2 rather than as the original TTFs. Kemasyuran Jawa's cmap
   references glyph id 84 in an 84-glyph font, which Chrome's font sanitiser
   rejects outright — the face failed to decode and the masthead fell back to a
   system serif, a bug that reads as a design choice. Rebuilding the cmap
   through the subsetter fixes it, and subsetting the set to printable ASCII
   takes all four faces from 114 KB to 26 KB on the way.

   Regenerate with `python3 scripts/build-experiment3-fonts.py`.
   The original TTFs and their licences stay in /assets-experiment-3. */

const upakarti = localFont({
  src: '../../fonts/experiment3/Upakarti.woff2',
  variable: '--ex3-logo-upakarti',
  display: 'swap',
})

const upakartiSerong = localFont({
  src: '../../fonts/experiment3/UpakartiSerong.woff2',
  variable: '--ex3-logo-upakarti-serong',
  display: 'swap',
})

const kemasyuran = localFont({
  src: '../../fonts/experiment3/KemasyuranJawa.woff2',
  variable: '--ex3-logo-kemasyuran',
  display: 'swap',
})

const jawadwipa = localFont({
  src: '../../fonts/experiment3/Jawadwipa.woff2',
  variable: '--ex3-logo-jawadwipa',
  display: 'swap',
})

/* ─── Editorial faces ─────────────────────────────────────────────────────── */

// Variable font: no `weight` array, so the whole 200–800 axis is available.
// Next has no metric table for Newsreader, so its automatic size-adjusted
// fallback is switched off and a real fallback stack is named instead — that
// silences the build warning and keeps the swap predictable.
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--ex3-heading',
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

const tinos = Tinos({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--ex3-body',
  display: 'swap',
  fallback: ['Times New Roman', 'Times', 'serif'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--ex3-meta',
  display: 'swap',
  fallback: ['system-ui', 'Helvetica Neue', 'sans-serif'],
})

/** Every font variable, for the page's root element. */
export const ex3FontVars = [
  upakarti.variable,
  upakartiSerong.variable,
  kemasyuran.variable,
  jawadwipa.variable,
  newsreader.variable,
  tinos.variable,
  inter.variable,
].join(' ')

/** The switcher's options. `id` doubles as the `data-logo` value in the CSS. */
export const LOGO_FACES = [
  {
    id: 'upakarti',
    name: 'Upakarti',
    note: 'Rounded, even, modern. Reads as a brand before it reads as script.',
  },
  {
    id: 'upakarti-serong',
    name: 'Upakarti Serong',
    note: 'The same face on a slant — motion, without a second typeface.',
  },
  {
    id: 'kemasyuran',
    name: 'Kemasyuran Jawa',
    note: 'Widest and most ornamental. Strongest identity, hardest to read small.',
  },
  {
    id: 'jawadwipa',
    name: 'Jawadwipa Adisastra',
    note: 'Calligraphic and high-contrast. Closest to true aksara Jawa.',
  },
] as const

export type LogoFaceId = (typeof LOGO_FACES)[number]['id']
export const DEFAULT_LOGO_FACE: LogoFaceId = 'upakarti'
