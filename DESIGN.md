# DESIGN.md — Travel Pam

The visual system for travelpam.com: values, components and motion.
**Why** each value exists is in `design/art-direction.md` ("The read-back proof", approved 2026-10-18), and decisions with their reasons are in `design/decisions.md`. The full motion spec is `design/specs/motion.md`.

**Where the tokens live:** CSS custom properties on `:root` in `src/app/globals.css`. Names here match names in code. Prototype and reference build: `/experiment-4`.

Concept in one line: a typeset proof marked up with one blue pen. The **page** is the structure, the **printed layer** (logo, stamp, buttons, forms) is the brand, and the **pen** is the person.

---

## Colour

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#FFFFFF` | The page. Always carries `--paper-tooth`. |
| `--paper-tooth` | `url(/textures/paper-white.png)` | A real paper scan (ambientCG Paper001, CC0), remapped so only the fibres show. Mean 253.9/255, darkest fibre `#F1F1F1`. Sits under content, never over photos. |
| `--text` | `#1A1915` | All type. |
| `--muted` | `#5C5A51` | Meta, captions, labels. This is the lightest grey allowed for text. |
| `--ink` | `#0120B1` | The one ink: the logo's cobalt. Used for pen marks, links and the printed blocks. Nothing else is coloured. |
| `--cream` | `#FAF4E6` | The logo's cream. Type on `--ink` and `--rust` blocks. |
| `--plate-text` / `--rust` | `#A33A0A` | The press, as type: folios, kickers, the dateline, Latest numbers, footer column labels. As a block only for the email form (with `rust-grain.webp`). 6.6:1. |
| `--plate` | `#FF6C2F` | The second plate's light in the footer drawing. Fills only, never text. |
| `--highlight` | `#FFE45C` | The highlighter: only inside running text (an excerpt's highlighted phrase, a body line marked Highlight). Never on titles, names or labels. Multiplied; never text. |
| `--rule-strong` | `#1A1915` | Opens a section: above every section head (Latest, Seasons, Contact…). Never under a heading, never between items. The email form's fill-in line also uses it. |
| `--rule-medium` | `rgba(26,25,21,.38)` | The bottom of a page header (Stories, Gallery); drawer edges. |
| `--rule-soft` | `rgba(26,25,21,.11)` | The date row, the front page's vertical column rule, list rows, filter rows, the top bar's edge. |

**Three tools, three meanings** (decisions 2026-10-19): the **pen** is blue (Ilham's marks, links, the logo, Subscribe); the **press** is rust/orange (printed type and the email block); the **highlighter** is yellow (a line that matters, inside paragraphs). Photographs bring all other colour. No tag colours or tints.

**Contrast** (WCAG ratios, worst case on the darkest paper fibre `#F1F1F1`):

| Pair | Ratio |
| --- | --- |
| `--text` on paper | 15.57 : 1 (AAA) |
| `--ink` on paper | 10.09 : 1 (AAA) |
| `--muted` on paper | 6.12 : 1 (AA) |
| `--cream` on `--ink` | 10.39 : 1 (AAA) |
| `--rule-medium` | Lines only, never text |

No dark mode [decisions 2026-08-11].

## Type

| Token | Family | Job |
| --- | --- | --- |
| `--font-serif` | **Newsreader** (variable, opsz 6–72, roman and italic) | Everything typeset: display, reading, labels, nav, buttons. One family, like a proof. |
| `--font-hand` | **Nanum Pen Script**, a placeholder for "Pam Hand" | Only notes written in the pen (margin notes, photo notes, the read-back line). Never headings, never UI. |
| zh | Noto Serif SC (reading), LXGW WenKai (hand) | Chinese fallbacks. `:lang(zh) em` uses emphasis dots instead of italics. |

**Scale:**
- **display:** `clamp(38px, 4vw, 64px)`, line-height 1.02, opsz 72. One phrase per headline may be italic.
- **article title:** `clamp(38px, 4.4vw, 60px)` / 1.05.
- **dek:** 21–22px / 1.45–1.5.
- **body:** 20px / 1.6, measure 66ch.
- **list title:** 18px / 1.3.
- **meta:** 15px.
- **label:** 12px uppercase, tracking .08em, tabular figures.
- **hand:** 22–24px / 1.1.

**For long Indonesian titles:** `text-wrap: balance` on display text, `hyphens: manual`, and `overflow-wrap: break-word`.

## Layout

- **Spacing:** `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 · `--s6` 32 · `--s7` 48 · `--s8` 72. Nothing off this scale.
- **Gutter:** `--gutter` `clamp(16px, 4vw, 56px)`. Every line stops at the gutters.
- **Reading:** `--measure` 66ch, with a right margin of `--margin` 240px for pen notes (at 1200px and up; below that, notes go inline).
- **Front page:** 12 columns, lead photo (7) next to lead story plus Latest (5); gallery strip (7) next to Seasons (5). One soft vertical rule between the two columns, no horizontal lattice: each section opens with its own strong rule. Phones: one column, flush to the gutters; the lead story sits 24px under its photo, sections 48px apart.
- **Chrome:** `--topbar-h` 68px (60px on phones). Rail 1 is 208px; rail 2 is 280px.

## Layers

| Layer | Made of | Carries | Never |
| --- | --- | --- | --- |
| Paper | `--paper` + `--paper-tooth` | Everything | Generated noise, grain over photos, gradients, grid paint |
| Type | Newsreader in `--text` | All content and structure | Depending on the pen to be understood |
| Photographs | Ilham's own photos, shown whole | Colour, place, evidence | Cropped covers, tints, frames, filters |
| Printed | The logo (`/brand/`), the "Pam." stamp, the block button, the printed form | Identity; the one action | Being recoloured, redrawn or filtered (the logo and stamp) |
| Pen | rough.js strokes in `--ink`, 1.25px, `src/components/proof/` | Emphasis, notes, sequence, the current page | Fills, boxes around controls, marks without a target |

## Components

| Component | File | States and rules |
| --- | --- | --- |
| **Top bar** | `proof/SiteShell.tsx` | Sticky and always there. Menu (three pen strokes), logo, Subscribe. Soft bottom rule. |
| **Rail 1 / Rail 2** | `proof/SiteShell.tsx` | Closed by default. The menu opens rail 1 and Stories opens rail 2 (a plain folder tree, ▾/▸). Both push the page, which slides as one sheet and never changes width (what passes the right edge waits off-screen). The current page gets a pen bracket. "You · later" reserves Saved / Trips / Sign in. Phones: drawers over a scrim; the page stays put. |
| **Printed block** (primary) | `proof/BlockButton.tsx` | Seeded hand-cut edge and the logo's grain, cream serif. Hover lifts it 3px off its impression (2px small); press +1px, scale .98, denser ink, held ≥100ms. One per screen. |
| **Pen link** (secondary) | `proof/Pen.tsx` | Ink type. The pen writes the underline on hover or focus (280ms) and it vanishes instantly on leave. |
| **Quiet link** | CSS `.tp-quiet` | Small caps in `--muted`. The current item gets a medium rule. |
| **Printed form** (inputs) | `proof/PrintedForm.tsx` | A printed block, hand-cut and seeded per form, in **rust `#A33A0A`** with the logo's print grain recoloured (`/brand/rust-grain.webp`): the prompt in cream italic (6.0:1), a 1px cream outlined field, and a cream send square with a rust arrow (it presses). Focus: a second cream outline. |
| **Save** | `proof/Pen.tsx` | Typeset "Save". When saved, the pen ticks it (one stroke, 180ms). Platform phase only. |
| **Marks** | `proof/Mark.tsx`, `proof/Pen.tsx`, `proof/Proof.tsx` | Circle (open, right-handed), underline (rises ≤3px), multi-line underline / strike / dashed, bracket, caret ‸, pilcrow ¶, single-gesture arrow, numbered callout. |
| **Figure** | `proof/Figure.tsx` | Cover shown whole, with numbered callouts (positions in % of the image). The same notes repeat as text underneath. Hovering pin n marks note n. |
| **Footer** | `proof/SiteFrame.tsx` | Logo + the Lange line, four typeset columns (Read · More · Follow · Languages), copyright on a soft rule, then the Son-Kul ballpoint drawing edge to edge (`public/brand/footer-sonkul*.webp`, made by `scripts/ink-drawing.py` from Ilham's photo; phones crop the sides to keep the rider). Captioned. |
| **Read-back stamp** | article end | The "Pam." block (−4°), then "read back · place · date" in the hand, underlined. |

**Pen rules:**
- stroke 1.25px, roughness 0.9, bowing 0.8, `disableMultiStroke`
- seed = hash(document id + mark id), never random
- paths rounded to 2 decimals, so they render on the server
- at most 3 marks per 900px of scroll
- every mark has a target, and every note is written by Ilham (Sanity), never generated

## Motion

**Only three things move: the pen writes, printed blocks press, sheets slide.** Hold is the pause between marks. Tokens are on `:root`.

| Verb | Curve | Duration | Used by |
| --- | --- | --- | --- |
| **Write** | `--m-write-ease` `cubic-bezier(.45,.05,.55,.95)`; flicks `--m-flick-ease` `cubic-bezier(.6,0,.85,.5)` | 60 + 1.45 × length ms (≤800); pen-lift 70; hold 200 between marks; queue wait ≤400 | Marks in view, pen links, save, point |
| **Press** | out `--m-press-out-ease` `cubic-bezier(.2,.6,.35,1)`; in `--m-press-in-ease` `cubic-bezier(.5,0,.75,0)` | Hover 140, press 70, release 200, min down 100 | Block button, stamp (scale only, no filter) |
| **Slide** | `--m-slide-ease` `cubic-bezier(.3,.1,.2,1)`; leaving the screen `--m-slide-close-ease` | Rail 1 280, rail 2 300, both 340, drawer 280/260, close 200 | Rails, drawers, folders |

- **Reduced motion:** marks are drawn at first paint, sheets cut or fade in 120ms, presses show as a darker block.
- **Still:** page loads and route changes, type, photos, the logo, plain link hovers, focus rings, the top bar.

## Do's and don'ts

- **Do** show photos whole, put the hand only where Ilham wrote, keep one ink, put lines in three tiers, and use spacing from the scale.
- **Don't** use fades, blur, bounce, parallax or ambient loops; icon sets; pilcrows in navigation; hatch fills or rough boxes; orange bars or chips (orange is type); highlights on titles; the old scrapbook pieces (stickers, polaroids, sticky notes, the canvas, grid paper, the Caveat headings).
