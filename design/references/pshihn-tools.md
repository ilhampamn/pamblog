# Preet Shihn's libraries, judged against "The read-back proof"

Reviewed 2026-10-18. Sources: github.com/pshihn (personal) and github.com/rough-stuff (org). Everything listed is MIT licensed.
We already use **rough.js 4.6.6**: it is the engine under the ballpoint (`src/components/experiment4/Ex4Mark.tsx`).

Judged against `design/art-direction.md`:
- one pen, even width, no fills;
- seeded marks that are identical on every load and in every locale;
- every mark has a target;
- photos untouched;
- no generated texture.

## Adopt now: improvements to our own engine, no new dependencies

| What | From | Why it fits | How |
| --- | --- | --- | --- |
| `fixedDecimalPlaceDigits` / `gen.opsToPath(set, 2)` | rough.js (installed, unused) | Node and the browser disagree on the last float digit, which is why marks are currently client-only. Rounding to 2 decimals makes server and client paths identical, so marks can render on the server: no flash, visible without JS, and simpler reduced-motion handling | In `toPaths()`, build `d` with `gen.opsToPath(set, 2)` instead of `gen.toPaths()`, then drop `useMounted` |
| Multi-line marks | rough-notation (`multiline`) | `Ex4Mark` is `white-space: nowrap`, so it can't mark a phrase that wraps. That rules out long Indonesian phrases and narrow phones | Read `Range.getClientRects()` for the target and draw one underline per line box, each with its own seed |
| `bracket` kind | rough-notation | A margin bracket beside the annotated paragraph (Rule 10), drawn in the pen rather than as a CSS border | New `kind: 'bracket'` on the paragraph's right edge |
| `strike-through` kind | rough-notation | The proofreader's delete, paired with "stet" (let it stand) for a phrase Ilham nearly cut. Real proof vocabulary (identity move A) | New `kind: 'strike'` with `iterations: 1` |
| Ordered drawing | rough-notation `annotationGroup` | "Stagger with meaning": photo callouts draw 1, 2, 3, then their notes, instead of all at once | A tiny page-level queue: each mark waits for the previous one's write-on |
| `strokeLineDash` / `dashGap` | rough.js | Dashed means planned: the "Season 2 · planned" row, and future itinerary days not yet travelled | Option on the pen for planned items only |

**Why not use rough-notation itself?** It has no `seed` option (every load re-randomises the stroke, which breaks Rule 3), draws closed ellipses where ours are open right-handed loops, defaults to 2 strokes, and inserts its SVG as a sibling, which breaks inside tables. Take its ideas and keep our engine.

## Worth a prototype: content features

| What | From | Fit | Caveat |
| --- | --- | --- | --- |
| **Video as a film strip** | `film-strip` | Ilham links out to TikTok. A strip of frames from the clip, with a "watch on TikTok →" link, fits the editorial page far better than a heavy, tracking TikTok iframe | The element samples the video in the browser (needs CORS, slow). Do the same thing at build time with Cloudinary video thumbnails at offsets (`so_2`, `so_4`…) |
| **Stippled portrait** in cobalt | `stippled-image` (Weighted Voronoi stippling) | A WSJ-style "hedcut" of Ilham for the About page and article bylines. It's an editorial print technique, in the one ink, made from a real photo | Pre-render it once to SVG or PNG; computing it in the browser is heavy. Use it in one or two places only |
| Points along a path | `points-on-path`, `points-on-curve` (bezier-points) + rough.js `generator.path()` | The itinerary route spine (proposed earlier, not adopted yet): roughen a real route path, place a stop circle at each day, measure length for hand-speed write-on | Only when the itinerary experiment is approved |

## Avoid

| What | Why |
| --- | --- |
| `wired-elements` (hand-drawn buttons, inputs, cards) | Rough boxes around every control: the wireframe/Excalidraw look the art direction rules out. It would add a second hand next to the logo (case C2). Future platform forms should be typeset; only the "save" tick uses the pen |
| `rough-paint` (CSS Houdini) | Chromium only; draws rough boxes around elements |
| `rough-draw`, `hachure-fill`, rough.js `fillStyle` hachure/zigzag/dots | Fills, the most recognisable "generated" rough.js tell |
| `lumin` (progressive text highlight) | A highlighter is a second tool, and animation tied to reading interferes with reading. Unmaintained since 2021 |
| `recolored-image`, `cielab-dither` | Rule: photos and the logo are never recoloured. Maybe for social share cards one day |
| `legra` (LEGO bricks) | Different world |
