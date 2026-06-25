# CLAUDE.md — Codapay Checkout Builder

Operating manual for Claude Code working in this repo. Read this fully before writing code.

## What this is

A Vue 3 visual builder that lets merchants theme and configure the Codapay mobile checkout
without code. A left-rail config tree + live phone preview; exports `config.json` + `tokens.css`
that the production checkout consumes verbatim.

The full product spec is `docs/PRD.docx`. The component contract is `docs/design-system-map.ts`.
When this file and the PRD disagree, the PRD wins; when the PRD and `design-system-map.ts`
disagree, the map wins (it is the typed source of truth for components).

## The one rule that matters most: TWO design systems, never mixed

| | Builder chrome | Payment page (preview + production) |
|---|---|---|
| Design system | **coda-payments-design** | **codapay-whitelabel** |
| Package | `packages/ui-coda` | `packages/checkout-ui` + `packages/tokens` |
| Tokens | `color/*`, `spacing/*`, `font/*` (path tokens) | `--bg-*`, `--text-*`, `--radius-*` (CSS vars) |
| Typeface | ABC Monument Grotesk | merchant-chosen (`--font-primary`) |
| Mutable at runtime | no | yes (the whole point) |

**Hard boundaries — enforced by lint, do not violate:**
- `packages/ui-coda` MUST NOT import from `checkout-ui` or `tokens`, and vice versa.
- Builder chrome components use ONLY Coda path tokens. Never `--bg-*` whitelabel vars.
- Checkout components use ONLY whitelabel CSS vars. Never Coda path tokens.
- Whitelabel tokens are scoped under `.checkout-scope` so they cannot leak into the chrome.
- No raw hex / px / font values anywhere. Every value resolves to a token in its own system.

If you ever find yourself reaching for a whitelabel var inside a panel, or a Coda token inside
the checkout, stop — you've crossed the boundary.

## Where the design systems are documented

- **Builder chrome** → the `coda-payments-design` skill. Authoritative spec: its `design.md`
  (§ Component Library) and `colors_and_type.css`. Lift working components from its
  `ui_kits/pam-portal/` and port to Vue. Never invent a Coda component or token.
- **Payment page** → the `codapay-whitelabel` skill. Token system, derivation rules, and
  validation live there. The checkout renderer is themed entirely by these tokens.

When you need a component or token value, read the relevant skill's spec file rather than
guessing. State which file you used.

## Monorepo layout

```
packages/
  ui-coda/          # coda-payments-design Vue components (BUILDER chrome only)
  checkout-ui/      # codapay-whitelabel Vue renderer (preview == production)
  tokens/           # whitelabel token schema, derivation, validation, contrast math
  config-schema/    # zod schemas + TS types for the config artifact
apps/
  builder/          # the Vue 3 SPA (imports ui-coda + checkout-ui)
  checkout/         # production checkout (thin shell over checkout-ui)
  api/              # persistence + export
docs/
  PRD.docx
  design-system-map.ts
```

## The parity contract (second-most-important rule)

The builder preview and production checkout MUST render identically. Mechanism:
1. ONE renderer: `packages/checkout-ui`, imported by both `apps/builder` (preview pane) and
   `apps/checkout`. Never fork it.
2. The exported artifact (`config.json` + `tokens.css`) is the ONLY input to the renderer.
   The builder preview renders from the same artifact it would export — no in-memory shortcuts.
3. A CI visual-regression test renders the same artifact in both contexts and diffs screenshots.
   This gate must pass before merge.

## Tech stack (decided)

- Vue 3, Composition API, `<script setup>`, TypeScript.
- Vite for build; Vitest for unit; Playwright for e2e + visual regression.
- Pinia for the config/theme store.
- Vue Router only if multi-screen preview lands.
- Scoped CSS or CSS modules per component.

## How to work (schema-first, package order)

Build in this order — later packages depend on earlier ones:
1. `packages/tokens` — token schema, derivation, contrast math. **Tests first.**
2. `packages/config-schema` — zod schema + TS types + version/migration.
3. `packages/checkout-ui` — the whitelabel renderer; renders from artifact only.
4. `packages/ui-coda` — port Coda chrome components from the PAM UI kit.
5. `apps/builder` — assemble using `design-system-map.ts` as the component contract.
6. `apps/api` + `apps/checkout`.

For each package: schema/types → tests → implementation. Do not write a component before its
entry exists in `design-system-map.ts`.

## Frozen constraints (reject changes that violate these)

- The checkout component **anatomy is frozen** (Codapay catalog). Only content, visibility,
  order, selection, and tokens vary. No new checkout components, no layout editing.
- **Spacing and icon-size tokens are frozen** in the whitelabel system — read-only in the editor.
- Token **validation rules** are mandatory and block export on failure:
  - WCAG AA contrast (body ≥ 4.5:1, large/UI ≥ 3:1) with auto-fix.
  - Error/destructive tokens must be red-family.
  - Focus border ≠ default input border (visibly).
  - Destructive action ≠ primary action (visibly).
  - Selection background must be a tint of primary, never grayscale.

## Definition of done (per feature)

- Uses the correct design system per `design-system-map.ts`; no cross-DS tokens.
- Unit tests for any logic (derivation, validation, formatting).
- For checkout features: parity visual-regression test passes.
- No raw hex/px/font; lint boundary passes.
- Accessibility: keyboard reachable, AA contrast, labels/aria where needed.

## Reference prototype

`docs/prototype.html` (the single-file builder) is the executable functional spec for v1
behavior — interactions, states, validation, card-detection, theme library. Extract its logic
into the typed Vue packages above; do not ship the prototype itself.
