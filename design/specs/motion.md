# Motion — Travel Pam ("The read-back proof")

Status: draft 2026-10-18, motion designer, **reviewed by the art director the same day (verdict: fix, small; all eleven pushbacks accepted)**. **Approved by Ilham 2026-10-18**, including §7 (rail 2 overlays). AD fixes are listed at the end of this file and override anything above.
Scope: the system (Mode A) and the choreography of every touchpoint (Mode B). It moves into the Motion section of `DESIGN.md` when the system phase creates it.
Prototype: `/en/experiment-4`. Code today: `src/components/experiment4/` and `src/app/[locale]/experiment-4/experiment-4.css`.
Supersedes `art-direction.md` → Motion → **Hold** ("a 200ms pause before a circle closes its overshoot"). A hold sits **between** marks, never inside a stroke. A circle is one stroke and is written in one go.

**Ilham's two complaints, answered:**
- **"The side menu is too snappy."** Today it isn't animated at all: `hidden` is display:none, so it cuts in 0ms. The fix is a real slide with presence: 280ms for rail 1 on a curve that peaks at 2.5× its average speed, not 4× (see Tokens → Why these numbers).
- **"Hover and click are too subtle."** Today, hovering the block shifts its grain in 0ms and pressing moves it 1px in 90ms. The fix:
  - hover lifts the block 3px and shows its printed impression beneath;
  - press drives it 4px down into the paper;
  - a press is always seen, even on a fast click;
  - the press leaves a denser impression behind.

---

## 1. Motion tokens

Until rollout they sit on `.ex4`; at rollout they move to `:root` in `globals.css`. They replace the unused `--duration-fast/default/slow`, `--ease-out` and `--ease-in` there, which disagree with this spec: `--ease-out` is `(.16,1,.3,1)`, an expo snap. Delete those at rollout; don't reuse them.

```css
.ex4 {
  /* WRITE: the pen */
  --m-write-ease: cubic-bezier(.45, .05, .55, .95); /* symmetric, ≈ minimum-jerk hand velocity */
  --m-flick-ease: cubic-bezier(.6, 0, .85, .5);     /* accelerates off the paper */
  --m-write-base: 60ms;     /* stroke time = base + rate × length */
  --m-write-rate: 1.45;     /* ms per px → 300px ≈ 495ms */
  --m-write-max: 800ms;     /* cap per stroke */
  --m-flick-scale: .7;      /* pure flicks are 30% quicker than a line of the same length */
  --m-hook-min: 120ms;      /* a stroke that ends in a flick (caret) */
  --m-tick-dur: 180ms;      /* the save tick, fixed */
  --m-dash-period: 80ms;    /* one dash + lift */
  --m-dash-max: 900ms;      /* a whole dashed line, however long */
  --m-penlink-min: 240ms;   /* hover underlines: formula, clamped */
  --m-penlink-max: 360ms;
  --m-pen-lift: 70ms;       /* between strokes of one mark */
  --m-hold: 200ms;          /* between marks of one gesture */
  --m-set-gap: 120ms;       /* between items of a numbered set (callouts 1→2→3) */
  --m-queue-max-wait: 400ms;
  --m-ink-after-slide: 120ms;

  /* PRESS: the printed layer */
  --m-press-out-ease: cubic-bezier(.2, .6, .35, 1);  /* lift and release */
  --m-press-in-ease: cubic-bezier(.5, 0, .75, 0);    /* arrives at speed = contact */
  --m-press-hover-dur: 140ms;
  --m-press-in-dur: 70ms;
  --m-press-min-down: 100ms; /* a click always shows the bottom */
  --m-press-release-dur: 200ms;
  --m-press-lift: -3px;
  --m-press-sink: 1px;
  --m-press-scale: .98;
  --m-impression: .25;       /* impression density under a lifted block */
  --m-impression-pressed: .35; /* after one press, until pointer leaves */
  --m-stamp-scale: 1.03;
  --m-stamp-settle-dur: 220ms;

  /* SLIDE: paper on paper */
  --m-slide-ease: cubic-bezier(.3, .1, .2, 1);      /* push-off, long soft stop */
  --m-slide-close-ease: cubic-bezier(.4, 0, .9, .6); /* only for sheets leaving the screen */
  --m-slide-rail1-dur: 280ms;  /* 208px */
  --m-slide-rail2-dur: 300ms;  /* 280px */
  --m-slide-both-dur: 340ms;   /* 488px */
  --m-slide-drawer-dur: 280ms; /* phone rail 1, scrim */
  --m-slide-drawer2-dur: 260ms;/* phone rail 2 over rail 1 */
  --m-slide-close-dur: 200ms;  /* every close */
  --m-fold-open-dur: 160ms;
  --m-fold-close-dur: 120ms;
  --m-continuity-dur: 240ms;   /* reserved: future lightbox */

  /* Reduced motion */
  --m-rm-fade: 120ms;
}
@media (prefers-reduced-motion: reduce) {
  .ex4 { --m-slide-rail1-dur: 0ms; --m-slide-rail2-dur: 0ms; --m-slide-both-dur: 0ms;
         --m-slide-drawer-dur: 0ms; --m-slide-drawer2-dur: 0ms; --m-slide-close-dur: 0ms;
         --m-fold-open-dur: 0ms; --m-fold-close-dur: 0ms; --m-press-hover-dur: 0ms;
         --m-press-in-dur: 0ms; --m-press-release-dur: 0ms; --m-stamp-settle-dur: 0ms; }
}
```

**How JS reads them.** Add one module, `motion.ts`, with `readMotion(el)`:
- It reads the `--m-*` values with `getComputedStyle(el)`. Pass the mark's own element, so tokens scoped on `.ex4` today and on `:root` later both resolve.
- It parses durations with `parseFloat` (so "60ms" becomes 60) and passes easings through as strings. WAAPI accepts `cubic-bezier(...)` directly.
- It caches per root.
- It holds a `DEFAULTS` object identical to the CSS, for SSR and as a fallback.
- It exposes `reduced`, which is live: listen to `matchMedia('(prefers-reduced-motion: reduce)')`. When reduced motion turns on, `finish()` every running ink animation.

Ink uses **WAAPI** (`path.animate`), not CSS transitions. That gives `finish()`, `pause()` and `play()`, which the queue rules need. Slides also use WAAPI on transform and clip-path. Press states and their timing stay in CSS transitions. GSAP isn't needed.

**Why these numbers** (measured on the curves, sampled):

| Curve | Peak speed (× average) | 90% of travel done at | Verdict |
| --- | --- | --- | --- |
| AD slide `(.2,0,0,1)` | 4.0× at 12% of the time | 54% | At 240ms, 90% of the slide happens in 130ms and peaks at 3.5px/ms. That is the "snappy" Ilham describes. |
| **`--m-slide-ease` `(.3,.1,.2,1)`** | 2.5× at 23% | 61% | Same shape (push-off, long soft stop), half the peak velocity. At 280ms on 208px the peak is 1.9px/ms and 90% lands by 170ms. It reads as a sheet with weight, and it's done before the eye can call it slow. |
| AD flick `(.55,0,1,.45)` | Ends with a vertical tangent | n/a | The last ~10% of the stroke pops in one frame. |
| **`--m-flick-ease` `(.6,0,.85,.5)`** | 3.3× at the end | 97% | Still accelerates off the paper, but the tail is drawn. |
| `--m-write-ease` `(.45,.05,.55,.95)` | 1.7× at 50% | 79% | A bell-shaped hand velocity. The old `(.3,.1,.4,1)` decelerated like a UI landing. |

The durations sit at the top of the "felt, not waited for" band. 280ms is still under Material's 300ms for large-area moves. Every close takes 200ms: going away should cost less than arriving. Presence comes from the lower peak velocity and the longer soft stop, not from a slower start. The click still answers in the first frame: layout commits and the sheet starts moving.

---

## 2. The verbs

| Verb | What it is in the seed | Curve | Duration | Triggers allowed | Layer |
| --- | --- | --- | --- | --- | --- |
| **WRITE** | The ballpoint marking the proof: stroke order, hand speed, once, on a sheet at rest | `--m-write-ease`; flicks `--m-flick-ease` | `60 + 1.45 × length` per stroke (60–800ms); lift 70; a mark ≈ 100–900ms | Load (the lead gesture only), scroll into view, hover/focus (pen link, point), a state change (save, submit) | Ink |
| **PRESS** | A printed object coming down on the paper: lift, contact, a denser impression. No bounce | Lift and release `--m-press-out-ease`; contact `--m-press-in-ease` | Hover 140, press 70, release 200; stamp settles in 220 | Hover (fine pointer only), pointerdown/Enter/Space, scroll (the read-back stamp only) | Printed: block button, Pam. stamp |
| **SLIDE** | Paper on paper: a sheet pushed across the desk, starting quickly and stopping softly. No overshoot | `--m-slide-ease`; sheets leaving the screen use `--m-slide-close-ease` | 160–340ms open by distance; 120–200ms close | Click/tap, Escape, outside tap. Never scroll, never hover | Paper: rails, drawer, folders |
| *HOLD* | The writer's pause between one mark and the next. It's the joint between verbs, not a verb | n/a | 200ms between marks; 120ms within a numbered set; 120ms ink-after-slide | Inside a gesture only | n/a |

**Stroke kinds** (set by the mark component as `data-k` on each `<path>`; the engine reads it):

| `data-k` | Examples | Ease | Duration |
| --- | --- | --- | --- |
| `line` (default) | Circle (one stroke), underline, bracket, pilcrow bowl and stems, arrow shaft + first barb (one stroke) | write | clamp(60 + 1.45·len, 60, 800) |
| `flick` | Second arrow barb, the three divider ticks | flick | 0.7 × the line formula, min 40 |
| `hook` | Caret (rebuild as **one** stroke, up then a fast down leg), save tick (one stroke: short down leg, then the flick) | flick | caret: max(formula, 120); save tick: 180 fixed |
| `dash` | Dashed "not yet" underline | write | per dash: min(80, 900 / n) total, 55% stroke and 45% lift. The whole line is ≤ 900ms. Today each dash gets the 140ms floor, so it crawls for about 2s |

---

## 3. Choreography rules

1. **Gesture.** A gesture is an ordered list of marks. Strokes within a mark are separated by `--m-pen-lift` (70). Marks within a gesture are separated by `--m-hold` (200), or by `--m-set-gap` (120) for a numbered set. A mark that belongs to no gesture is a gesture of one. Holds never fall inside a stroke.
2. **Two lanes.**
   - The **page lane** is scroll and load ink. It goes through the queue below.
   - The **hand lane** is the pen link, point, save tick and rail bracket. It never queues behind page ink and starts on its trigger frame. Feedback can't wait for decoration.
3. **The queue** replaces the global `queueEnd` and `OVERLAP` in `Ex4Mark.tsx`, which keep counting time for marks the reader has already scrolled past.
   - A gesture is enqueued when its first mark is in view: at least 60% of its box is visible, or, for tall marks, it covers at least 40% of the viewport height.
   - It starts at `max(now, min(previous gesture's end + hold, now + 400ms))`. No gesture waits more than 400ms.
   - If the gesture writing now leaves the viewport, the next one starts immediately and the one that left `finish()`es off-screen.
   - A queued gesture that leaves the viewport before its turn is set to its end state with no animation. The reader comes back to finished ink.
   - Written once per page view. Scrolling back never replays.
4. **Max concurrent.** One page-lane gesture writes at a time. Two can overlap only through the 400ms rule, never three: a third waits for one of them to finish. The hand lane allows one per control. One slide at a time.
5. **Ink waits for its sheet** (never write on a moving sheet).
   - When a slide starts, page-lane strokes on the moving proof `pause()`. Partial ink rides along with its sheet, the way a pen lifts while you move the paper.
   - They `play()` again `--m-ink-after-slide` (120ms) after the slide stops. New gestures don't start during a slide.
   - Ink inside a rail starts 120ms after its rail stops.
6. **Slides are interruptible.** Clicking during a slide reverses it from the sheet's current position: read the computed transform and clip, then animate back. The duration is scaled by the share of distance left, min 120ms. The sheet never jumps.
7. **Layout commits at frame 0**, then transform and clip-path carry the eye. Never animate width, height, margins, padding or `grid-template-*`.
8. **Order follows meaning:**
   - photo before the ink that points at it (wait for `img.decode()`);
   - target before pointer;
   - a printed thing before the pen writes beside it.
9. **The first screen arrives already marked up.** Marks that are visible at first paint (pilcrows, the menu glyph, dividers) are there from the start, server-rendered or set to their end state at mount. Only the lead gesture is written live.
10. **Budget.** Scroll gestures go from trigger to rest in ≤ 1.2s. The two signature gestures, the lead (≈1.4s) and the read-back (≈1.7s), may run longer because nothing waits on them: every word they decorate is already typeset.

---

## 4. Choreography per touchpoint (Mode B)

Times are computed from the formula for current geometry. `≈` means the engine computes the exact value from the measured length, so don't hard-code it.

### Signature

**Motion — home-lead-gesture** (circle → caret → arrow)
Operation: guide attention (the dek's key word, then the photo detail). Technique: write-on, hold, stagger with meaning.
Trigger: load. t0 = max(first paint, `document.fonts.ready`, lead photo `decode()`) + 200ms hold. If the photo hasn't decoded 1200ms after first paint, start anyway.

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Circle around the dek word | write (line) | Undrawn → drawn, from 1 o'clock anticlockwise | ≈265px → ≈445ms. One stroke, no hold inside |
| ≈445 | n/a | hold | n/a | 200 |
| ≈645 | Caret ‸ | write (hook) | One stroke: up leg, then a fast down leg | ≈120 |
| ≈765 | n/a | hold | n/a | 200 |
| ≈965 | Arrow shaft + first barb | write (line) | One stroke, into the tip and back out | ≈130px → ≈250 |
| ≈1215 | n/a | pen-lift | n/a | 70 |
| ≈1285 | Second barb | write (flick) | Drawn | ≈50, ends ≈1335 |

Rest state: dek word circled, caret in the gap, arrow from the note to the photo detail. Pilcrows and the menu glyph were already there.
Reduced motion: all three marks drawn at first paint.
No JS: the marks are drawn. Lead-gesture ink is server-rendered `pathLength=1` and hidden only under `html.js` (a one-line head script), so a failed script never leaves it blank.
Remove the `template.tsx` fade for exp4 now. The gesture must not run under a fade. (The fade also breaks "no blur" and "type never moves".)

**Motion — article-cover-callouts**
Operation: earn belief (the notes are about this photo). Technique: path and sequence, write-on.
Trigger: the cover reaches 60% in view, after `img.decode()`. Then a 200 hold.

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Pin 1 loop | write (line) | Drawn | ≈80px → ≈176. The numeral is typeset and was already there |
| ≈296 | Pin 2 loop | write | Drawn | After a 120 set-gap |
| ≈592 | Pin 3 loop | write | Drawn | Ends ≈768 |

The note keys under the photo are separate page-lane gestures, written as they scroll in.
Rest state: the photo with circled numerals 1–3. Reduced motion: drawn at first paint.

**Motion — article-readback** (end of article, once per view)
Operation: carry a feeling (he read it back, here, on this date). Technique: write-on, press, hold.
Trigger: `.ex4-article__end` at 60% in view. The break pilcrow above it is part of this gesture, not a separate queue item.

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Break pilcrow ¶ (×1.5) | write | Bowl, top bar, stem, stem, with 70 lifts | ≈590 |
| ≈590 | n/a | hold | n/a | 300 |
| ≈890 | Pam. stamp | press | Absent → contact: scale 1.03 and `brightness(.88)` (wet, denser) → scale 1, `brightness(1)` | Appears on contact, no fade. Settles in 220 with `--m-press-out-ease`. The rotation stays −4° throughout; scale around the centre. One direction only (down), no overshoot |
| ≈1110 | n/a | hold | n/a | 250 |
| ≈1360 | Underline under "read back · place · date" | write (line) | Drawn L→R, rising | ≈230px → ≈393, ends ≈1750 |

Rest state: ¶, the stamp at −4°, the underlined sign-off. Reduced motion: all three present from the start, the stamp at scale 1.
No JS: the stamp is visible (it's hidden before contact only under `html.js`).

### Supporting

**Motion — marks-on-scroll** (dividers, brackets, underlines, dashed lines, note keys)
Trigger: in view, through the queue (§3). Each mark is a gesture of one. Velocities come from the stroke-kind table.
Rest state: finished ink. Reduced motion: finished at first paint.

**Motion — desktop-sidebar** (push; ≥ 901px)
Operation: connect parts (the directory is under the page you're on). Technique: SLIDE, with reveal by mask (the proof slides off the rail).

Build approach:
- Rails are `position: fixed` under the top bar, inside one `.ex4-rails` container.
- The shell commits `--rails-w: 0 | 208px | 488px` as `.ex4-main { margin-inline-start: var(--rails-w) }` at frame 0. Never transition it.
- FLIP **each direct child of `.ex4-main`** by its own measured Δx, not `.ex4-main` itself. The article column is centred (`margin: 0 auto`): moving `.ex4-main` would jump it 104px backwards before sliding it 208px forwards. Per child, the home grid slides 208 and the article slides 104, each from where it was.
- `overflow-x: clip` on the shell while a slide runs, so no scrollbar flashes.
- The joint is drawn: a 1px soft-rule line at the rails' right edge moves with the clip edge (`translateX` on the same curve). Clip-path would otherwise hide the rail's own border until the end.

Open rail 1, trigger: click the menu.

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Layout | n/a | `--rails-w` 0 → 208; rails unhidden | Frame 0. Focus moves to the first rail link (`preventScroll`). `aria-expanded` set |
| 0 | `.ex4-main` children | slide | translateX(−Δ) → 0 | 280, `--m-slide-ease` |
| 0 | `.ex4-rails` | slide (uncover) | clip-path inset(0 100% 0 0) → inset(0) | 280, same curve. Rail type never moves |
| 0 | Joint line | slide | translateX(−208px) → 0 | Glued to the clip edge |
| 400 | Current-page bracket | write | Drawn | 120 after stop. Written once per page view, never rewritten on reopen |

Close rail 1, trigger: the menu, Escape, or a link chosen in the rail.
- At frame 0, commit 0 and focus returns to the menu button.
- Children FLIP from +Δ to 0 in 200ms on **`--m-slide-ease`**. The proof is *arriving* at rest, so it decelerates. An ease-in here would slam it into place.
- The rails clip inset(0) → inset(0 100% 0 0) on the same curve, then become hidden.
- The bracket is covered, not un-written.

Rail 2: see §7. If the answer is **no** (push):
- Stories opened with rail 1 already open: commit 488. Children Δ (280 or 140) in 300ms. Clip inset(0 280px 0 0) → inset(0).
- Both rails opened from closed (menu on a Stories page): one clip inset(0 100% 0 0) → inset(0) over the container, children Δ in 340ms. One sheet, one edge.
- If the answer is **yes** (overlay), use §7's table.

Rest state: rails open, proof pushed, bracket written.
Reduced motion:
- the layout cuts instantly;
- the rails fade in over `--m-rm-fade` (120ms linear, opacity only, no clip);
- the bracket is already drawn;
- close is instant.

**Motion — phone-drawer** (≤ 900px)

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Rail 1 | slide | translateX(−100%) → 0, under the top bar | 280, `--m-slide-ease`. Focus moves at frame 0 |
| 0 | Scrim | n/a | opacity 0 → 1 | 280 linear. Paper isn't moving, so this isn't ink |
| 400 | Current-page bracket | write | Drawn | 120 after stop |
| Tap Stories | Rail 2 | slide | translateX(100%) → 0 over rail 1, clipped to the drawer's box | 260. Rail 1 stays still beneath |
| Close | Rail 1 (and 2), scrim | slide | → translateX(−100%), opacity → 0 | 200, `--m-slide-close-ease` (leaving the screen). Focus returns at frame 0 |
| "‹ Menu" | Rail 2 | slide | → translateX(100%) | 200, `--m-slide-close-ease` |

Reduced motion: drawers fade in place over 120ms linear, with the scrim at the same time. Close is instant.

**Motion — folder-tree** (rail 2, Season / Essays)
Trigger: click a folder.

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Caret ▸ → ▾ | n/a | Glyph swap | Instant. It's type: no rotate |
| 0 | Rows below the folder | slide | Layout commits; FLIP translateY(−Δh) → 0 | 160, `--m-slide-ease` |
| 0 | New child rows | slide (uncover) | clip-path inset(0 0 100% 0) → inset(0) | 160, same curve. The bottom edge stays glued to the next folder's top |
| Collapse | Same, reversed | slide | Rows below FLIP +Δh → 0; children clip closed, then removed | 120, `--m-slide-ease` |

Reduced motion: instant.

**Motion — printed-block-button** (Subscribe, primary)
Operation: show cause and effect (the click registers physically). Technique: press.
Build:
- Add an **impression layer** under `.ex4-block__ink`: the same seeded clip-path, the same grain, density `--m-impression` (25%).
- At rest it sits exactly under the block, so it's invisible.
- It never moves. Only the block lifts off it, so the visible impression band equals the lift: 3px, straight down.
- Never solid, never black or grey, never diagonal. If Ilham reads it as a hard shadow, drop the impression and keep the lift.

| Trigger | t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- | --- |
| Hover (only `(hover: hover) and (pointer: fine)`) | 0 | Block | press (lift) | translateY(0) → −3px | 140, `--m-press-out-ease`. Its 3px impression shows beneath. The grain does not shift on hover any more |
| Hover out | 0 | Block | press (lift) | → 0 | 140, same curve |
| Pointerdown / `:active`; Enter or Space (JS adds `.is-pressed` for 120ms) | 0 | Block | press (contact) | → translateY(+1px) scale(.98) | 70, `--m-press-in-ease`. On contact the grain **jumps** to the second-impression offset and ink is ~8% denser (`brightness(.92)`). Both steps happen at contact, not tweened. Hold the pressed state ≥ 100ms (`--m-press-min-down`), even on a fast click |
| Release | 0 | Block | press (lift) | → hover (−3px) or rest | 200, `--m-press-out-ease`. The impression beneath is now 35% (stepped) until the pointer leaves: the press left a mark |
| Touch | n/a | n/a | n/a | n/a | No hover state. Press on pointerdown, release → rest |

Rest state: flat block, no visible impression.
Reduced motion:
- no translate or scale, and no impression;
- hover darkens about 6% (`brightness(.94)`, instant);
- press shifts the grain and darkens about 12% (instant).
Focus ring: instant, on the outer element (unchanged).

**Motion — pen-link** (secondary; also "Send →" and "Read the story →")

| Trigger | t | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- | --- |
| Hover (fine pointer) or `:focus-visible` | 0 | Underline | write (line) | Undrawn → drawn L→R | Formula, clamped 240–360ms (≈278 for "Read the story →"). Hand lane: no delay, no queue |
| Pointerdown | 0 | Underline | n/a | `finish()` | A click always shows the full line |
| Hover out / blur | 0 | Underline | n/a | Removed | **Instant.** Today it un-writes; ink never runs backwards |

The link colour stays the ink. No CSS `text-decoration` underline anywhere: "Send →" moves from its CSS underline to this component.
Reduced motion: the underline appears and disappears instantly.

**Motion — save-tick**

| Trigger | t | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- | --- |
| Click Save | 0 | Label | n/a | "Save" → "Saved" | Instant |
| | 0 | Tick | write (hook) | One stroke: short down leg, then the flick | 180, `--m-flick-ease`. Rebuild as one `polyTo`. Today it's two paths with a 140ms delay, so the legs overlap |
| Click again | 0 | Tick | n/a | Removed | Instant |

Reduced motion: the tick appears instantly.

**Motion — callout-point** (pin n ↔ note n)

| Trigger | t | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- | --- |
| Hover or focus pin n, or hover note n | 0 | Underline under note n's text | write (line) | Drawn L→R | An engine mark, seeded `${id}:point-n`. Formula, clamped 240–360 (≈260). It replaces the CSS `text-decoration` (a second hand) |
| Leave | 0 | Underline | n/a | Removed | Instant |

Touch: tapping a pin toggles the same underline.
Reduced motion: the underline appears and disappears instantly.

**Motion — printed-form submit**

| t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- |
| 0 | Form line | n/a | Replaced by the typeset confirmation sentence | Instant. Type never fades in |
| 120 | Save tick after the sentence | write (hook) | Drawn | 180 |

Focus moves to the sentence (`tabindex=-1`) at frame 0. Errors: a typeset sentence, instant, never shake.
Reduced motion: the tick is drawn at once.

### Still (nothing moves; listed so nobody adds motion)

| Touchpoint | Behaviour |
| --- | --- |
| Route change and page load | No transition. Delete the `template.tsx` fade for exp4 now, site-wide at rollout |
| Logo | Still. No hover |
| Menu glyph | Still. Drop the `translateX(1px)` hover |
| Typeset link hover (rail L1, tree items, Latest, display links) | Colour only, 0ms. Drop the 3px `›` chevron nudge on Stories |
| Form focus | The rule turns ink, instantly |
| Focus rings | Instant, everywhere |
| Sticky top bar | Never hides, shrinks or animates on scroll |
| Hand-font notes | Typeset and present. No mask wipe |
| Image load | Reserve the aspect ratio and show paper; insert after `decode()`. No fade, blur, shimmer or placeholder colour |
| Future lightbox | May use continuity: the photo travels from its place in 240ms on `--m-slide-ease`. Not built now |

---

## 5. Reduced motion, per verb

| Verb | Replacement | Why it still communicates |
| --- | --- | --- |
| WRITE (page lane) | Ink drawn at first paint, from the server or at mount | The marks are the content of the ink layer, so they're all there |
| WRITE (hand lane) | Underline and tick appear and disappear in 0ms | The state change is the feedback |
| PRESS (button) | No translate, scale or impression. Hover `brightness(.94)`; press grain jump + `brightness(.88)`; all instant | Darker means "you're on it" and "you pressed it" |
| PRESS (stamp) | Present at scale 1 from the start | It's the rest state |
| SLIDE (desktop rails) | Layout cuts; rails fade in over 120ms linear; close is instant | The fade shows the rail arriving without travel |
| SLIDE (phone drawer) | Fade in place over 120ms, scrim with it; close is instant | Same |
| SLIDE (folders) | Instant | Small and local, the caret swap carries it |
| HOLD | 0 | Nothing to wait for |

Content and focus never wait on motion in either mode [decisions 2026-06-26].

---

## 6. Never

The art director's 17. Edits are marked ✎ with the reason.

1. ✎ Page ink never un-writes, redraws, loops or moves on its sheet. It's written once per page view. *Hand-lane ink* (pen link, point) is written fresh on each hover with the same seed and removed instantly; it never runs backwards. *Reason: the AD's own pen-link and point specs rewrite on hover, so the rule needs that carve-out.*
2. No animating stroke width, opacity, colour or blur. (The printed layer's density changes are stepped filters on the block or stamp, never on strokes.)
3. Type never moves relative to its sheet: no fade-up, stagger-ins, counters, scramble or marquee. Glyphs (▸, ›, ‸) swap; they don't rotate or nudge.
4. No blur anywhere, including the current template fade.
5. No bounce, spring or overshoot. The stamp's 1.03 → 1 goes one way only.
6. No place-and-settle, no hover lift or zoom on photos and cards, no Ken Burns. (The block button's lift is a press on a control, not a card.)
7. No parallax, no scroll-tied motion, no scroll-jacking.
8. No page curl or 3D fold.
9. The caret never blinks. No ambient loops.
10. No skeleton shimmer or spinners.
11. No shake. No sliding toasts.
12. No mask wipe on the hand font.
13. No stepped "on twos" timing on UI feedback.
14. No ink written on a moving sheet (pause, then resume 120ms after it stops).
15. ✎ Never animate layout: width, height, margin, padding, top/left or `grid-template-*`. Commit at frame 0, then use transform and clip-path. *Reason: the AD named grid columns and width; the folder tree and the margin push need the same rule.*
16. Motion never holds back content or focus. Queue wait is ≤ 400ms, and focus moves at frame 0.
17. No hover menus.

---

## 7. Position on rail 2: overlay or push?

**Recommendation: yes, overlay.** Rail 1 pushes the proof 208px. Rail 2 is a sheet laid **over** the proof's left edge, with a 1px strong edge and no shadow. Do this at every width, not only below 1680px.

Why, in motion terms:
- **One move instead of two.** Pushing 488px at 1440 throws a third of the screen sideways and reflows the home grid twice in a row: once for rail 1, again for rail 2. With an overlay, the proof moves once (208) and then stays still while you browse.
- **Rail 2 is a transient step.** You open it to pick a chapter and leave. That's a sheet on top, like the phone drawer. Rail 1 is the one worth reading alongside, so rail 1 pushes.
- **One behaviour at every width** is simpler to learn and to build than a breakpoint that changes physics.
- **The cost:** at 1440, rail 2 covers about 160px of an article's left edge while it's open. Escape or a click on the proof closes it.

Overlay choreography (if yes):

| Trigger | t (ms) | Element | Verb | From → to | Notes |
| --- | --- | --- | --- | --- | --- |
| Stories (rail 1 open) | 0 | Rail 2 | slide | translateX(−280px) → 0, from under rail 1's right edge (z below rail 1, above the proof) | 280, `--m-slide-ease`. The proof doesn't move |
| Menu on a Stories page (both closed) | 0 | Rail 1 + proof | slide | As desktop-sidebar open | 280 |
| | 120 | Rail 2 | slide | translateX(−280px) → 0 | 280, ends 400. It starts once rail 1 has ~75% landed: two sheets, cause before effect |
| Close rail 2 | 0 | Rail 2 | slide | → translateX(−280px) under rail 1 | 200, `--m-slide-ease` |

**Answered 2026-10-18: yes, overlay — then reversed the same day: push** (Ilham's recording showed the overlay crossing rail 1 and the page sliding over the rail). Built as push with each rail's sheet sliding inside its clipping column by the page's Δ. The original question was: *When you open a Stories folder on desktop, should the second column slide over the left edge of the page, instead of pushing the whole page another 280px to the right?*

---

## 8. Build checklist for the front-end developer (ordered by impact)

1. **Sidebar slide** (Ilham #1).
   - Replace `hidden` toggling with fixed rails in `.ex4-rails`, a `--rails-w` margin committed at frame 0, a per-child FLIP of `.ex4-main`, the clip reveal, and the joint line.
   - Phone drawer: translate plus scrim.
   - Interruptible reversal, `overflow-x: clip` during slides, focus at frame 0.
   - Remove `hidden` before opening; set it on `finish` of the close.
   - Remove `grid-template-columns` switching on `.ex4-shell`.
   - Files: `Ex4Sidebar.tsx`, `experiment-4.css` (§ the sidebar).
2. **Printed-block press** (Ilham #2).
   - Add the impression layer.
   - Hover lift −3px (fine pointer only); press +1px, scale .98, contact grain jump and density; 100ms minimum down; release 200; 35% impression after a press.
   - Enter/Space via the 120ms class.
   - Reduced-motion variant.
   - Remove the 0ms hover grain shift and the 90ms `:active`.
   - Files: `Ex4Print.tsx`, `experiment-4.css` (`.ex4-block`).
3. **Tokens and `motion.ts`.** Add the `--m-*` block on `.ex4` and `readMotion(el)` with defaults.
4. **Write engine** (`Ex4Mark.tsx`).
   - Switch to WAAPI.
   - Duration = 60 + 1.45·len, clamped 60–800.
   - Read `data-k` (line, flick, hook, dash); 70ms pen-lift.
   - **Remove the hold-before-last-path.** Holds now belong to gestures, which fixes the circle hold that never fired and the hold that landed before the second barb.
   - Rebuild the caret and save tick as one stroke each.
   - Dashes use the period rule.
5. **Queue** (§3.3–3.5). Delete `queueEnd` and `OVERLAP`; add a scheduler with page and hand lanes, the 400ms cap, off-screen `finish()`, end-state for skipped marks, and pause/resume around slides.
6. **Signature gestures.** The lead gesture (fonts + decode trigger, `html.js` gating), callouts after decode, and the read-back with the stamp press.
7. **Hand lane.**
   - The pen link exits instantly and `finish()`es on pointerdown; clamp 240–360.
   - The point underline becomes an engine mark (drop the CSS `text-decoration`).
   - "Send →" becomes a pen link.
   - Submit success: sentence, then the tick.
8. **Folder tree.** FLIP the rows below plus a clip reveal; instant glyph swap.
9. **Stills.**
   - Delete the `template.tsx` fade for `/experiment-4` (site-wide at rollout).
   - Drop the menu glyph's hover `translateX` and the `›` chevron nudge.
   - Image insert after decode.
10. **Verify.** Capture frames with the studio's `frames.mjs` for the sidebar, the button and the lead gesture, plus each reduced-motion rest state.


---

## Art director's review (2026-10-18): fixes that override the spec above

1. **Edges are the medium tier, not strong.** The rail-2 overlay edge and the phone drawer edge use the medium rule (38%). Strong is used once, under the masthead. The travelling joint line stays soft (11%). *Built in the phone drawer.*
2. **The "Pam." stamp is never filtered.** Its contact is scale 1.03 → 1 only, with no brightness change: it is the logo, and the logo is never recoloured. Brightness steps stay on the block button only.
3. **One shared Δ per slide.** All visible children of `.ex4-main` take the Δ of the child nearest the viewport's vertical centre; off-screen children take their end state. Different Δs on one sheet would be parallax. *Built.*
4. **Hold amendment goes through decisions.md.** "A hold sits between marks, never inside a stroke" and "Only three things move: the pen writes, printed blocks press, sheets slide" replace the art direction's Motion wording once Ilham approves.
5. **The small top-bar block is quieter.** It lifts 2px and presses to +1px at scale .985. The large block keeps 3px and .98. *Built.*
6. Signature gestures follow the off-screen rule too: if the reader scrolls the lead or the read-back out of view mid-gesture, call `finish()`.
7. Rail 2: build **push** until Ilham answers §7, then log his answer.
