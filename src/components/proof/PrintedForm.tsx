import { PenLink } from './Pen'

/**
 * Inputs — the printed form (decisions 2026-10-18), no button shape at all: the call to action is a sentence on the
 * proof, and the input is a printed form line to be filled in, the way a
 * form on paper leaves a rule for your answer.
 */
export function PrintedForm({ id, prompt, field, action }: { id: string; prompt: string; field: string; action: string }) {
  return (
    <form className="tp-printform" action="#" aria-label={prompt}>
      <label htmlFor={`${id}-email`} className="tp-printform__prompt">
        {prompt}
      </label>
      <span className="tp-printform__line">
        <input id={`${id}-email`} type="email" placeholder={field} autoComplete="email" />
        <PenLink id={`${id}:send`} submit className="tp-printform__send">
          {action}
        </PenLink>
      </span>
    </form>
  )
}
