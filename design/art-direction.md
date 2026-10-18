# Art direction — The read-back proof

Status: **approved** (Ilham, 2026-10-18). Changes from here go through decisions.md with a reason.
Visual system: `DESIGN.md` at the repo root (not created yet; `/design-studio:system` creates it). Tokens, components and motion values live there; this file is the concept and its rules.
Replaces the live scrapbook direction [decisions 2026-10-18]. Chosen from three proposals; Batik tulis and Route map were rejected (reasons in decisions.md).

## Seed
A typeset proof of his own chapter, read back that evening in a guesthouse and marked up with a blue Standard AE7 ballpoint, the pen every Indonesian schoolchild writes with: circled words, numbered notes pointing at the photo, a line in the margin where he remembered more.

## Why this seed
- **It matches what Ilham asked for:** a rigid reading structure (the proof) with his personality on top (the ballpoint) [decisions 2026-10-18]. The proof page works with zero marks.
- **It matches the references:** ref 01's single ink and serif italic, ref 02's numbered notes over a strict layout, ref 03's folio and single ornament [design/references/README.md].
- **It's honest while marks are code-drawn.** A ballpoint line has an even width with no texture, which is the stroke code imitates most convincingly [decisions 2026-10-18: doodles in code for now].
- **The handover is real:** Ilham can later write with an actual AE7, scan it and swap it in.
- **It works for all four audiences** [brief]. A blue pen reads as "personal" in every locale, and the AE7 is a quiet nod to Indonesian readers. Numbered callouts have a real order for trip planners. Blue for links leaves red free for future form errors in the platform phase.

## Visual DNA
| Technique | Operation | Where it shows |
| --- | --- | --- |
| The visual ingredient: the blue ballpoint | Make it ownable; carry a feeling | Every hand mark, links, the sign-off |
| Visible facture, limited to an even ballpoint line | Earn belief | Circles, underlines, arrows, ticks, margin brackets |
| Path and sequence, **only where order is real** | Guide attention | Numbered photo callouts, chapter order, "Latest" list, itinerary days |
| Clean field vs maximal set | Make it clear | A quiet, flat proof page against a few dense ink moments |

Every section must be defined by one of these. A section with none is assembled from defaults, and a mark with no operation is decoration (taxonomy, cases C1, C7).

## Layers
| Layer | What it is | What it carries | What it never does |
| --- | --- | --- | --- |
| Paper | White `#FFFFFF` with a soft tooth from a real paper scan (`paper-white.png`) [decisions 2026-10-18] | Everything | Generated noise (feTurbulence), grain over photos, gradients, graph lines |
| Type | The typeset proof: Newsreader, near-black | All content and structure | Rely on the ink layer to be understood |
| Photographs | Ilham's own photos, shown whole | Colour, place, evidence | Get cropped, tinted, framed in polaroids or covered by noise |
| Ink | Blue ballpoint marks | Emphasis, notes, sequence, sign-off | Carry content found nowhere else (every note is also real text), fill shapes, appear without a target |

## Colour intent
- **Paper** is white `#FFFFFF` with a soft scanned tooth (darkest fibre `#F1F1F1`). **Text** is `#1A1915` (15.57:1 even on the darkest fibre).
- **Ink** is `#0120B1`, the logo's cobalt (10.1:1 on the darkest fibre, AAA) [decisions 2026-10-18]. Was ballpoint `#2537A0`. It is the only colour in the interface. It's used for hand marks and links, and nothing else.
- **Secondary text** for meta and captions is a warm grey of at least 6:1 (e.g. `#5C5A51`, 6.12:1). Lighter greys (e.g. `#8A877C`, 3.22:1) are for hairlines only, never text.
- **Photographs bring all other colour.** No second accent, no tag colours, no tinted cards. The blush pink retires [decisions 2026-10-18].
- **Proportion:** ink covers under 2% of any screen.

## Logo
"Travel Pam.": cream letters `#FAF4E6` on two cobalt `#0120B1` blocks with a printed-grain look (`public/brand/`) [decisions 2026-10-18]. Generated with ChatGPT; it isn't Ilham's handwriting, so the pen layer must not imitate its lettering. The logo is the printed label, and the ballpoint is the person. It's a printed object placed on the proof, not part of the ballpoint layer. Use it as-is: never recolour it, redraw it in code, stretch it or set it over a photograph. Minimum height is 44px, so the grain still reads. The "Pam." block alone is the favicon and the read-back stamp.

## Type intent
- **Display: Newsreader**, optical size 60–72, weight 400–500. It speaks like a printed title. One phrase per headline may be italic (ref 01). It's narrow enough for long Indonesian titles.
- **Reading: Newsreader**, optical size 16–18, about 20px/1.6, a measure of about 66ch. One family doing two jobs, the way Medium does.
- **Labels and folios:** Newsreader small caps, tracked +6%, with tabular figures. No mono face.
- **Hand: Nanum Pen Script**, 22px or larger. A placeholder for "Pam Hand" (the deferred handwriting sample [decisions 2026-10-18]). It's only for notes written in the ink, behind one token so it can be swapped.
- **zh:**
  - Noto Serif SC for display and reading, loaded as unicode-range subsets and not preloaded. LXGW WenKai (OFL, self-hosted) for the hand notes.
  - Chinese has no italics. Use `:lang(zh) em { font-style: normal; text-emphasis: filled dot; text-emphasis-position: under right; }`.
- **id:**
  - Size the display clamp against the longest real Indonesian title, not the English one.
  - Use `text-wrap: balance` on display text, and `hyphens: manual` and `overflow-wrap: break-word` on body text.
- **Retired:** Caveat, Reenie Beanie, Playfair, Lora, Inter as a UI face, JetBrains Mono, and the forced `h1–h6 { font-family: Caveat !important }` rule [globals.css].

## Imagery
- **Photography:** Ilham's own photos only (no stock, no AI). Shown whole with fit, never cropped [decisions 2026-08-11]. No filters, grain, desaturation or frames. A photo is evidence; the ink points at a detail in it.
- **Marks:** one blue ballpoint, drawn in code with rough.js or SVG for now [decisions 2026-10-18]. Kinds: open circle, underline, arrow (a shaft plus two short flicks), numbered circle, margin bracket, three-tick divider, asterisk, sign-off.
- **Not used:** stickers, polaroid frames, tape, torn paper, sticky notes, hatch fills, icons in another hand.

## Motion
**Only three things move: the pen writes, printed blocks press, sheets slide** [decisions 2026-10-18]. The full system, with tokens, timings and every touchpoint, is in `design/specs/motion.md`; its values move to `DESIGN.md`.
- **Write** (the pen): ink appears only by being written, in stroke order, at hand speed (60 + 1.45 × length ms per stroke, at most 800ms), once, on a sheet at rest. It never un-writes, redraws or loops.
- **Press** (the printed layer: the button, the "Pam." stamp): a block lifts, comes down onto the paper and leaves a denser impression. No bounce. The logo itself never moves.
- **Slide** (paper: the sidebar, the Stories sheet, folders): quick start, long soft stop, no overshoot. Only transform, clip and opacity move; layout never animates.
- **Hold:** the writer's pause **between** marks (200ms), never inside a stroke.
- **Reduced motion:** marks are drawn from the start, sheets cut or fade in 120ms, and presses show as a darker block. Content never waits on motion [decisions 2026-06-26].
- **Still:** page changes, type, photos, the logo, plain link hovers, focus, the top bar. No fades, blur, parallax, bounce or ambient loops.

## Signature moments
- **Home:**
  - The lead story's whole cover photo takes 7 columns of a 12-column hairline grid.
  - The dek has one circled word, with a short margin note arrowing across to a detail in the photo. This is the only ink moment above the fold.
- **Article (Season/Chapter):**
  - The cover is shown whole, with 2–4 numbered ballpoint callouts on real details (ref 02). The same notes repeat as real text under the photo.
  - It ends with "Next: Chapter 4" and a drawn arrow, then the hand sign-off "— p., 18.10.26".
- **Writing index:** chapters listed in real order as a folio table ("Season 1 · Chapter 3 of 8 · Naryn"), with one tick beside the newest.
- **Itinerary (proposed, TBC Ilham):** a ballpoint route line down the left margin, a circle at each day heading, dashed for days not yet travelled. This is the allowed layout experiment; it never appears on essays.

## Rules

**The pen**
1. One pen everywhere:
   - stroke 1.25px in `#2537A0`, roughness 0.9, bowing 0.8, `disableMultiStroke: true`
   - no fills of any kind (hachure, zigzag, cross-hatch or solid)
   - no rough rectangles around cards
2. Draw marks at their measured size:
   - measure the target with a ResizeObserver and use `vector-effect: non-scaling-stroke`
   - never `preserveAspectRatio="none"` (it is what makes exp1's circle around "raw" vary in weight)
   - set `mix-blend-mode: multiply`, so ink over a photo darkens like real ink
3. Seeds come from a hash of the document id and the mark id. Never `Math.random`. No seed repeats on a page, and a mark keeps its seed across en, id and zh.
4. Marks are drawn by a right-handed writer [decisions 2026-10-18]:
   - circles start near 1 o'clock, run anticlockwise, are left open and overshoot by 15–30°
   - underlines run left to right and rise about 1°
   - strokes are a little heavier at the start and lift off at the end
5. A ballpoint has an even width. Never taper, texture, blur or vary the opacity of a stroke.

**Where and how much**

6. Every mark has a target: a word, a heading, a photo detail or a paragraph. A mark with no target is not drawn.
7. Ink notes are written for their article by Ilham, never generated or filler. Each says something only he would know ("this was 4am, −12°"). [TBC: notes as a per-article Sanity field — Ilham]
8. **Density:** at most 3 marks in any 900px of scroll, and never two marks of the same kind next to each other. The trial runs all four zones [decisions 2026-10-18] within this budget; we cut back after review.
9. **Headings and key words:** at most one circle or underline per screen, on a word chosen in the content, not by code.
10. **Margins:**
    - At 1200px or wider, sidenotes sit in the right margin beside the paragraph they annotate, with a short vertical bracket.
    - Below 1200px, they become an inline ballpoint asterisk that opens the note.
11. **Photos:** numbered callouts are circled numbers on real details. They are joined by a short curved pointer to the note, and the same notes repeat as text under the photo for screen readers and mobile.
12. **Dividers and folios:**
    - section breaks are three short ballpoint ticks, each with its own seed
    - the folio is typeset small caps ("Season 1 — Chapter 3 of 8"), never hand-drawn
    - an article has one sign-off

**Structure**

- **Lines come in three tiers, never more** [decisions 2026-10-18]:
  - strong: text colour at 100%, used once, under the masthead
  - medium: 38%, a section's own head rule
  - soft: 11%, everything inside (grid, rows, dateline)
  - All lines stop at the page gutters.
- **Spacing uses the 8px scale only:** 4, 8, 12, 16, 24, 32, 48, 72.

13. **Home** uses a 12-column grid with 1px hairlines (harvest exp3's grid engine), a numbered Latest rail and a Seasons table with status.
14. **Every other page** is a single reading column of about 66ch with a wide right margin for notes [decisions 2026-10-18].
15. **Remove on rollout:**
    - the site-wide feTurbulence noise overlay [layout.tsx:79], the global grid paint and the paper-grain textures
    - the hand-drawn icon nav pill (exp2's icons are a second hand, case C2). The nav becomes typeset small caps: Stories · Explore · Gallery · About · Subscribe. [TBC: approve replacing the live nav, adopted 2026-08-20 — Ilham]

**Buttons and forms** [decisions 2026-10-18]

18. **Primary: the printed block.** A hand-cut cobalt block (a seeded, symmetric clip-path edge) filled with grain sampled from the logo, with cream serif type in sentence case, optically centred. One per screen. Never a flat rectangle.
19. **Secondary: the pen link.** Typeset in the ink; the pen underlines it on hover or focus.
20. **Quiet:** small caps in the text colour, for filters. The current item gets a medium rule.
21. **Inputs: the printed form.** A sentence, then a line to fill in, with the action as an ink text link ("Send →"). No input boxes.
22. The pen never draws boxes around controls. The only control it marks is the "save" tick.

**Pointers** [decisions 2026-10-18]

23. Every note-to-target pointer is the **single gesture**: one continuous stroke along a smooth curve, into the tip and back out along the first barb, then a shorter second barb. Calm shaft (roughness 0.35), head on the curve's exact end tangent. No halo over photos.

**Navigation** [decisions 2026-10-18]

24. **Top bar plus sidebar, Medium's structure.** A sticky top bar is always there: the menu button (three pen strokes) and the logo on the left, Subscribe on the right. The menu opens the sidebar under it. Rail 1 (main): Home · Stories › · Explore · Gallery · About, and a greyed "You · later" (Saved, Trips, Sign in). The current page gets a pen bracket. Rail 2 (child): the selected section's directory, as a **plain folder tree**: folders with ▾/▸ and their pages indented. Nothing else.
25. The sidebar is **closed by default**. **Both rails push the page** on desktop: each rail's sheet slides inside its own column by the same distance as the page, so they move as one and never overlap [decisions 2026-10-18]. Rail 2 opens with Stories and is open by default inside Stories pages. On phones, rail 1 is a drawer under the top bar and rail 2 slides over it with "‹ Menu".
26. No icon sets and no pilcrows in the navigation. Pilcrows mark sections in the page body only.

**Room for later**

27. The rail's "You · later" section reserves Saved, Trips and Sign in for the platform phase. They're shown greyed and not designed yet.
28. The top-right corner of every card stays clear for a future "save" tick, drawn in the same pen [decisions 2026-10-18: platform later].

## Brief Don'ts, applied to this direction
The brief has no Don'ts yet [brief.md]. The Do's apply like this:
- **Real photos only:** the ink only ever points at Ilham's own photographs. There are no illustrated stand-ins for a missing photo; leave the space typeset instead.
- **Reduced motion:** rule in Motion above.
- **Covers fit, not cropped:** callout positions are stored as percentages of the uncropped image, so they stay on their detail at any width.
- **Affiliate disclosure:** on Uses, the disclosure is typeset text, never only a hand note.

## References
- `design/references/`: 4 client references, with the breakdown in their README.
- **Harvest from exp1:** the circle, underline and arrow set in `Scribbles.tsx` (remove the aspect stretch), the edge-pinned "Plate 01" captions, the short left-aligned measure, and the noise overlay switched off.
- **Harvest from exp2:** the Season framing and the "upcoming season" module.
- **Harvest from exp3:** the 12-column hairline grid engine, the numbered Latest rail, the Seasons table with status, the pull quote with an italic turn, and the contact-sheet strip. The descriptor "(an Indonesian, abroad)" is still TBC [voice.md].
- **Leave behind:** paper grain, the multi-accent palettes, Caveat Brush, polaroids and torn cards, the Javanese display faces (licence TBC, and they compete with the ink for personality), and exp3's second accent.
