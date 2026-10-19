# Legacy components

The scrapbook-era UI, kept only because the hidden Explore pages
(`src/app/[locale]/explore/`, 404 via `explore/layout.tsx`) still import it:
`Nav`, `Footer`, `Breadcrumbs`, `PostBody`, `RoughCard`.

Live pages use `src/components/proof/` (DESIGN.md). When Explore is rebuilt
in the new design, delete this folder, then the legacy tokens and the
`.prose-body` / `.label-stamped` styles in `src/app/globals.css`.
Retired 2026-10-19; everything else from that era was deleted (see git history).
