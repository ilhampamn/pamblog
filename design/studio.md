# Travel Pam (travelpam.com) — studio file

Status: Art direction approved 2026-10-18 ("The read-back proof": white paper, the logo's cobalt as the one ink, proofreader's marks, printed buttons and forms, top bar plus folder sidebar, motion language: write · press · slide). Prototype at /experiment-4.
Phase: system <!-- kickoff | direction | system | copy | build | review | launch -->

## Where things live

| What | Path / value |
| --- | --- |
| Site code | `/Users/pam/blog` (repo root): Next.js 14 App Router; pages in `src/app/[locale]/` |
| Run command | `npm run dev` (preview `blog-dev` in `.claude/launch.json`) |
| Dev URL | http://localhost:3000/en (also `/id` and `/zh`) |
| Live URL | https://www.travelpam.com/en |
| Visual system | `DESIGN.md` at the repo root — **not created yet** (`/design-studio:system` creates it) |
| Tokens in code | `src/app/globals.css` (`--color-*`, `--font-*`, `--duration-*`, `--ease-*`); fonts in `src/app/[locale]/layout.tsx`. Each experiment has its own scoped tokens in `src/app/[locale]/experiment*/experiment*.css` |
| Copy in code | UI strings: `content/ui/{en,id,zh}.json`. Articles, About and places: Sanity (Studio at `/studio`). Gallery captions: Cloudinary metadata. Some page copy is hard-coded in `page.tsx` files (uses, newsletter, experiments) |
| Engineering to-dos | `ROADMAP.md` (not design decisions — those go in `decisions.md`) |

## Sources

The only places facts may come from. Cite as `[short name]`.

| Short name | File | What it's good for |
| --- | --- | --- |
| live site | https://www.travelpam.com/en and `/about`, `/blog`, `/explore`, `/gallery`, `/uses`, `/newsletter` (read 2026-10-18) | What's published now: copy, nav, content |
| about page | live `/en/about` (Sanity `about` doc) | Who Ilham is, in his own words; the best voice sample |
| ui strings | `content/ui/en.json` | Nav labels, taglines, microcopy |
| i18n.ts | `src/lib/i18n.ts` | The languages (en / id / zh) and fallback order |
| globals.css | `src/app/globals.css` | Current tokens and type roles |
| layout.tsx | `src/app/[locale]/layout.tsx` | Fonts loaded site-wide |
| exp1 | `src/app/[locale]/experiment/` + `experiment.css` | Candidate direction: "rough raw realism" style lab |
| exp2 | `src/app/[locale]/experiment-2/` + `experiment-2.css` | Candidate direction: travel journal, "Somewhere in Central Asia" |
| exp3 | `src/app/[locale]/experiment-3/` + `experiment-3.css`, `src/components/experiment3/` | Candidate direction: newspaper "Edition", Javanese-script wordmark |
| schema | `sanity/schemaTypes/` | Content model: articles, stories → seasons → chapters, places, itineraries |
| git log | `git log` on `main` | Dated decisions already made |
| README | `README.md` | Cloudinary gallery metadata rules |
| refs | `design/references/` (4 images + README breakdown) | The new direction: editorial structure + annotation layer |
| pshihn | `design/references/pshihn-tools.md` | Which rough.js-family libraries fit the pen, and which to avoid |

## Team notes

- Ilham Pamungkas is the owner, writer, photographer and final approver. He's a product designer by trade [about page] and builds the site himself.
- Solo side project with no deadline found [TBC: any target date for a redesign — Ilham].

## Open questions (blocking)

- None blocking the direction phase. The non-blocking questions are in `brief.md` and `voice.md`.

## House rules

- The client has the final say. Roles propose; the client decides.
- Every approval, rejection or correction goes into `decisions.md`, dated, with the reason.
- No invented facts. Unknowns are written `[TBC: what — who can confirm]`.
- Project knowledge lives in this folder, not in an assistant's memory.
- Every page ships in en, id and zh. Copy decks give the English text and flag what needs translating [i18n.ts].
