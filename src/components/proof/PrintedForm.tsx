import { cutEdge } from './cutEdge'

/**
 * Inputs — the printed form (Ilham, 2026-10-19, from his reference): the
 * whole form is a printed block in the logo's material — hand-cut cobalt with
 * its grain, cream type — holding an outlined field and a cream send square.
 * It replaces the first version (a sentence and a ruled line on the paper),
 * which read as "just another line" among the page's rules.
 *
 * The block's edge is seeded by `id`, so every form has its own cut, like
 * the Subscribe button. The field and the square stay straight: they are
 * printed rules inside the block, not cut paper.
 */
export function PrintedForm({ id, prompt, field, action }: { id: string; prompt: string; field: string; action: string }) {
  return (
    <form className="tp-printform" action="#" aria-label={prompt}>
      <div className="tp-printform__block" style={{ clipPath: cutEdge(id, { wobble: 3, tilt: 5 }) }}>
        <label htmlFor={`${id}-email`} className="tp-printform__prompt">
          {prompt}
        </label>
        <div className="tp-printform__field">
          <input id={`${id}-email`} type="email" placeholder={field} autoComplete="email" required />
          <button type="submit" className="tp-printform__send" aria-label={action}>
            <svg aria-hidden viewBox="0 0 24 24" width="22" height="22">
              <path d="M4 12h15M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
            </svg>
          </button>
        </div>
      </div>
    </form>
  )
}
