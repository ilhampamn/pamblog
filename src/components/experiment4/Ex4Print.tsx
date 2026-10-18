import { Ex4PenLink } from './Ex4Pen'

export { Ex4BlockButton } from './Ex4Press'
export { cutEdge } from './cutEdge'

/**
 * The printed layer: things that are *printed* onto the proof — the logo,
 * the read-back stamp, the primary button and forms — as opposed to
 * the pen, which is a person writing on it.
 *
 * A flat cobalt rectangle reads as a stock theme button (Ilham, 2026-10-18).
 * What makes the logo feel made is its material: a hand-cut block with an
 * uneven edge and print grain. The button borrows exactly that: the edge
 * is a seeded clip-path (every button its own cut, identical on every load,
 * integer px so server and client agree) and the fill is grain sampled from
 * the logo's own blue (`/brand/ink-grain.webp`).
 */

/**
 * Inputs — the printed form (decisions 2026-10-18), no button shape at all: the call to action is a sentence on the
 * proof, and the input is a printed form line to be filled in, the way a
 * form on paper leaves a rule for your answer.
 */
export function Ex4PrintedForm({ id, prompt, field, action }: { id: string; prompt: string; field: string; action: string }) {
  return (
    <form className="ex4-printform" action="#" aria-label={prompt}>
      <label htmlFor={`${id}-email`} className="ex4-printform__prompt">
        {prompt}
      </label>
      <span className="ex4-printform__line">
        <input id={`${id}-email`} type="email" placeholder={field} autoComplete="email" />
        <Ex4PenLink id={`${id}:send`} submit className="ex4-printform__send">
          {action}
        </Ex4PenLink>
      </span>
    </form>
  )
}
