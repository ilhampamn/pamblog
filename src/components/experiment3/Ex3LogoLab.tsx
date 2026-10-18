'use client'

import { LOGO_FACES, type LogoFaceId } from '@/app/[locale]/experiment-3/fonts'

/**
 * The face chooser. It is scaffolding for the exploration, not part of the
 * design — it exists so the four candidates can be judged in the masthead, at
 * the masthead's real size, against the real grid, rather than as specimen
 * images. Delete this component and its trigger once the face is chosen.
 */
export function Ex3LogoLab({
  face,
  onChange,
  open,
  onToggle,
}: {
  face: LogoFaceId
  onChange: (face: LogoFaceId) => void
  open: boolean
  onToggle: () => void
}) {
  return (
    <aside className="ex3-lab" aria-label="Logo typeface explorer">
      <button
        type="button"
        className="ex3-lab__toggle"
        aria-expanded={open}
        onClick={onToggle}
      >
        <span>Logo face</span>
        <span aria-hidden>{open ? '—' : '+'}</span>
      </button>

      {open && (
        <div className="ex3-lab__body">
          {LOGO_FACES.map((option) => (
            <button
              key={option.id}
              type="button"
              className="ex3-lab__option"
              aria-pressed={face === option.id}
              onClick={() => onChange(option.id)}
            >
              {/* Each specimen is set in its own face, so the list is the
                  comparison — no need to switch to see the difference. */}
              <span
                className="ex3-lab__specimen"
                style={{ fontFamily: `var(--ex3-logo-${option.id})` }}
              >
                TRAVEL PAM
              </span>
              <span className="ex3-lab__note">
                {option.name} — {option.note}
              </span>
            </button>
          ))}
        </div>
      )}
    </aside>
  )
}
