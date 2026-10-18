# Roadmap

The working to-do list for travelpam.com. The **organizer** agent maintains
it (`.claude/agents/organizer.md`), and any session that finishes or starts
meaningful work should update it.

Format: `- [ ] item — context (YYYY-MM-DD added)`. Move finished items to
**Done** with the date and commit hash. Keep **Done** to the last ~20 items.

_Last reviewed: 2026-10-18_

## In progress

Uncommitted in the working tree as of 2026-10-18:

- [ ] **Read-back proof rollout, phase 1** (uncommitted, on main): `DESIGN.md`,
  tokens in `globals.css`, `src/components/proof/` (SiteFrame, marks, buttons,
  form), new Home, Stories index and Article pages, pen-note fields in Sanity.
  ⚠️ Run `npm run sanity:deploy` (ask first) so the Studio shows the Pen notes
  fields. ⚠️ The newsletter form (`PrintedForm`) still has no backend, like the
  old widget. Waiting for Ilham's review before phase 2 (Explore, Gallery,
  About, Uses, Newsletter), then retire the old Nav/Footer/HomeExperience and
  legacy fonts. (2026-10-18)
- [ ] **Story chapters in Sanity.** A new `articleChapter` document (season → chapter
  number → title) replaces `article.storySeries` + `article.chapterNumber`
  with a single `storyChapter` reference. Touches `sanity/schemaTypes/*`,
  `src/sanity/queries.ts`, `src/lib/posts.sanity.ts` and `blog/page.tsx`.
  ⚠️ Existing Stories in the dataset still use the old fields. Before
  deploying, create chapter docs and re-link the articles, or the Stories
  will lose their season/chapter.
  (2026-10-18)
- [ ] **Move the middleware to `src/middleware.ts`.** Next.js ignores a root-level
  middleware when the app lives in `src/`, so the old file probably never ran
  in production. Confirm that `/` and `/blog` redirect to a locale after
  deploying. (2026-10-18)
- [ ] **Experiment 1** (`/experiment`): hand-drawn scribbles plus a floating bar.
  The code is untracked. (2026-10-18)
- [ ] **Experiment 3** (`/experiment-3`): a newspaper-grid "Edition" with a
  Javanese-script wordmark. Fonts are built by `scripts/build-experiment3-fonts.py`.
  The code is untracked. (2026-10-18)

- [ ] **Experiment 4** (`/experiment-4`): a prototype of the new art direction, "The
  read-back proof" (`design/art-direction.md`). The shared ballpoint mark component
  is in `src/components/experiment4/`. Untracked. (2026-10-18)
- [ ] **Experiments 5 and 6**: two more explorations of the same skeleton.
  `/experiment-5` "The contact sheet" (white, red grease pencil) and
  `/experiment-6` "The postcard home" (postcard board, postmark violet). They reuse
  the experiment-4 mark engine with their own pens. Untracked; waiting for Ilham's
  pick. (2026-10-18)

## Next

- [ ] **Design system phase** (`/design-studio:system`): turn the approved art direction and `design/specs/motion.md` into `DESIGN.md` plus real tokens in `globals.css`, then start moving the live site off the scrapbook look. (2026-10-18)
- [ ] **Remaining motion from the approved spec** (`design/specs/motion.md` §8): the three signature moments (home lead gesture, cover callouts 1→2→3 after the photo loads, the article read-back with the stamp press), folder slides in the Stories tree, pen-underline "point" on photo notes, ink pausing while a sheet slides (`holdInk` is in; pause/resume of running ink is not), and the per-stroke kinds (flick, hook, dash). (2026-10-18)

- [ ] Decide which experiment direction (1, 2 or 3) becomes the real site
  design, then plan the migration from the current canvas homepage.
  (2026-10-18)
- [ ] Commit the in-progress work in logical chunks: schema+queries,
  middleware, experiment 1, experiment 3. (2026-10-18)

- [ ] **Merge the `story` type into articles.** `/explore/stories` uses a separate Sanity `story` type; decided 2026-10-18 that all stories live under Stories. Migrate any `story` docs to `article` (tag `stories`, with season and chapter), redirect `/explore/stories/*` to `/blog/*`, then retire the type. (2026-10-18)

## Tidy-up backlog

Found by the first organizer audit. Nothing has been moved or deleted yet.

- [ ] `New assets experiment2/` at the repo root holds raw exports for
  experiment-2 (already optimised copies are in `public/experiment2/`). Move it
  to a git-ignored `design-assets/experiment-2/` or delete it. (2026-10-18)
- [ ] `assets-experiment-3/` holds source TTFs and the Upakarti EULA. Move it to
  `design-assets/experiment-3/` and update `SRC` in
  `scripts/build-experiment3-fonts.py`. Keep the EULA. (2026-10-18)
- [ ] `3D Experiment.code-workspace` points at folders outside this repo
  (`~/Documents/3D Experiment`, `~/Downloads/curtain`). Move it out of the repo.
  (2026-10-18)
- [ ] Six `public/` files have no reference in `src/`: `P Logo.png`, `P-logo.png`,
  `background.png`, `pagebackground.jpg`, `cursor.png` and `tv.png` (~3.2 MB). Check
  that Sanity content or CSS outside `src/` doesn't use them, then remove
  them. (2026-10-18)
- [ ] `.env.local.example` still lists Keystatic variables. Remove them.
  (2026-10-18)
- [ ] `styled-components` is in `dependencies` but unused. Uninstall it. (2026-10-18)
- [ ] `README.md` is still create-next-app boilerplate, apart from the Cloudinary
  section. Rewrite it briefly and point to `CLAUDE.md`. (2026-10-18)
- [ ] `/experiment` and `/experiment-2` hard-code `LOCALES`. Import them from
  `@/lib/i18n` instead. (2026-10-18)
- [ ] `HomeList.tsx` uses `<img>` in two places (lint warnings). Switch to
  `next/image`. (2026-10-18)

## Someday

- [ ] **Logo source files.** The "Travel Pam." logo is a ChatGPT raster (`public/brand/`). Get a
  vector (SVG) version, traced or redrawn by a person, before print or merch use. It's also worth
  knowing that purely AI-generated images may have limited copyright protection. If the brand
  matters long term, a human-refined version is safer to own. (2026-10-18)

- [ ] **Platform phase**: visitor accounts (log in), save items, share, and a trip
  planner. This is Ilham's long-term vision; see `design/decisions.md`
  2026-10-18. Needs its own planning (auth provider, where user data
  lives, since Sanity is for editorial content only). (2026-10-18)

- [ ] Add a minimal smoke check (build + fetch each locale's main routes) so
  "verified" doesn't depend on clicking around. (2026-10-18)

## Done

- [x] Enable Vercel Web Analytics — 2026-08-23 `8ae05fd`
- [x] Story series fields, refined image captions — 2026-08-21 `a70da19`
- [x] Gallery story metadata + Cloudinary display names — 2026-08-21 `f2c8099`, `5fc8ddb`
- [x] Experiment 2 navigation across site — 2026-08-20 `735797a`
- [x] Cover images across blog/explore, OG image from cover — 2026-08-11 `a83ab9c`…`30e8132`
- [x] Migrate CMS from Keystatic to Sanity, 3-language i18n — 2026-07-06 `d0046f3`
