# pamblog — Travel Pam

Personal travel blog of Ilham Pamungkas, live at **https://www.travelpam.com**
(Vercel, auto-deploys from `main` of `github.com/ilhampamn/pamblog`).
Three languages (en / id / zh), content in Sanity, photos in Cloudinary.

This is a long-term side project. Read `ROADMAP.md` at the start of a session to
see what is in progress, and keep it current (see "Organization" below).

## Commands

| Task | Command |
| --- | --- |
| Dev server (port 3000) | `npm run dev` — in the desktop app, use preview `blog-dev` from `.claude/launch.json` |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Production build | `npm run build` |
| Deploy Sanity Studio | `npm run sanity:deploy` — outward-facing, ask first |
| Redraw the footer landscape | `python3 scripts/ink-drawing.py <photo> public/brand/footer-sonkul.webp --width 2400 --crop-top 0.36 --fade 0.3 --plates` (and `--width 1200` → `footer-sonkul-1200.webp`; needs `numpy pillow opencv-python-headless`) |
| Rebuild experiment-3 fonts | `python3 scripts/build-experiment3-fonts.py` (needs `fonttools brotli`) |

There is no test suite. "Verified" means typecheck passes, lint has no errors,
and the changed page renders in the browser at desktop and mobile widths in
the locales it touches.

## Stack

- **Next.js 14 App Router**, React 18, TypeScript. Path aliases: `@/*` → `src/*`,
  `@/content/*` → `content/*`.
- **Sanity v3** for content. Studio is embedded at `/studio`
  (`src/app/studio`); schemas live in `sanity/schemaTypes/`. Localized fields
  use `sanity-plugin-internationalized-array` (`_key` = locale code).
- **Cloudinary** for photos (gallery, experiments, uploads). Upload signing is
  server-side in `src/app/api/cloudinary/sign/route.ts`.
- **Styling**: hand-written CSS with design tokens in `src/app/globals.css`
  (`--color-*`, `--font-*`, `--duration-*`, `--ease-*`) plus Tailwind utilities.
  Hand-drawn look from `roughjs`; motion with GSAP (`src/lib/gsap.ts`).
- **Other**: Resend + Kit (newsletter), `@vercel/analytics`.
- The CMS history is Keystatic → Sanity (July 2026). Comments saying "mirrors
  the old Keystatic …" are history, not live code. Keystatic, Uploadthing and
  `styled-components` are no longer used in `src/`.

## Map

```
src/app/
  [locale]/            every public page; locale is the first URL segment
    blog/  explore/  gallery/  about/  uses/  newsletter/
    components/        internal component showcase
    experiment*/       design experiments (see below)
  api/revalidate/      Sanity webhook → revalidatePath/Tag
  api/cloudinary/sign/ signed uploads
  go/[slug]/           affiliate redirects from content/affiliates.json
  og/ rss.xml/ sitemap.ts robots.ts
  studio/              embedded Sanity Studio
src/components/        proof/ = the live design system (DESIGN.md); legacy/ = old UI kept
                       only for the hidden Explore pages; experiment-only UI in
                       components/experiment*/
src/lib/               data access (*.sanity.ts), i18n, cloudinary, date, gsap
src/sanity/            client, image builder, GROQ queries
src/middleware.ts      locale redirect (must be in src/ because the app is in src/)
sanity/                Studio config + schemaTypes
content/ui/{en,id,zh}.json   UI strings;  content/affiliates.json
public/                static assets (experiment2/, stickers/, textures/, …)
scripts/               one-off build helpers
```

## Rules that matter here

**i18n**
- `src/lib/i18n.ts` is the single source of truth for locales. Never hard-code
  `['en','id','zh']` in new code; import `LOCALES`, `Locale`, `isLocale`.
  (The older experiment pages still hard-code it; don't copy that.)
- Any new UI string goes into **all three** `content/ui/*.json` files with the
  same key. If you can't translate it well, add the English text and note it in
  `ROADMAP.md` as a translation to-do rather than leaving a key missing.
- Content fallback order is requested locale → `en` → `id`.

**Content & data**
- Sanity schema changes alter live data. Before renaming or removing a field,
  check whether published documents use it and plan a migration. Note the
  migration in `ROADMAP.md`.
- Pages that read Sanity or Cloudinary use ISR (`revalidate = 300`) plus the
  `/api/revalidate` webhook. Keep that pattern for new data-backed pages.
- Cloudinary gallery metadata keys: `title`, `alt`, `caption`, `location`,
  `taken_at`, `story_slug` (see README).

**Secrets**
- Never read, print or commit `.env.local`. Use `.env.local.example` to learn
  variable names.
- Server-only secrets (`CLOUDINARY_API_SECRET`, `SANITY_API_WRITE_TOKEN`,
  `SANITY_REVALIDATE_SECRET`, `RESEND_API_KEY`, `KIT_API_KEY`) must never get a
  `NEXT_PUBLIC_` prefix or be imported into a client component.

**Experiments**
- `/experiment`, `/experiment-2`, `/experiment-3` are visual design directions,
  not production pages. Each loads its own fonts and CSS file next to its
  `page.tsx` so the rest of the site doesn't pay for them, and sets
  `robots: { index: false }`.
- New experiments follow the same shape: `src/app/[locale]/experiment-N/`,
  components in `src/components/experimentN/` prefixed `ExN`, assets in
  `public/experimentN/`. Raw source assets (fonts, PSD exports) don't belong at
  the repo root — see `ROADMAP.md` for where they go.

**Code style**
- Match the surrounding code: server components by default, `'use client'`
  only where needed, explanatory doc comments on non-obvious decisions (the
  codebase explains *why*, e.g. why a font is loaded per page).
- Reuse tokens from `globals.css` instead of new hex values or durations.
- Respect `prefers-reduced-motion` for any new animation (a past bug left the
  homepage blank for reduced-motion users).

**Git**
- Work on `main` is fine for small changes, since it's a solo project. Pushing
  `main` deploys to production, so ask before pushing.
- Commit messages: short imperative sentence, as in the history ("Add …",
  "Fix …", "Use …").

## Design studio

Design work runs through the **design-studio** plugin
(`github.com/ilhampamn/design-studio-`, installed user-wide from the
`studio-marketplace` marketplace).
Its roles are art director, copywriter, visual designer, motion designer,
front-end developer and QA reviewer. They work from a shared `design/` folder
and the `DESIGN.md` visual system.

Design knowledge for this project lives in `design/` (start with `design/studio.md`).
Read `design/decisions.md` before changing anything visual or written. Record new client decisions there.

- `/design-studio:studio` reports the current phase and the next step.
- The three `/experiment*` pages are candidate art directions. Record the
  choice between them in `design/decisions.md`, not here.
- Who owns what: `design/` holds design facts and decisions (brief, voice, art
  direction, specs, approvals). `ROADMAP.md` holds the engineering to-do list.
  Don't copy one into the other; link to it instead.
- A plugin hook checks every code edit for endless animations, low contrast
  and banned words. Fix what it reports, or add `studio-allow: <kind>` only
  when `design/decisions.md` records that the user accepted it.

## Organization

- `ROADMAP.md` is the project's to-do list: what's in progress, next, someday,
  and done. Update it when you finish or start meaningful work.
- The **organizer** agent (`.claude/agents/organizer.md`) keeps things tidy:
  ask it to "audit the repo" or "update the roadmap". It proposes moves and
  deletions and waits for approval; it never deletes on its own.
- `COMPONENTS.md` is a local, git-ignored inventory of buttons and links.
