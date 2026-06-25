# Scaffold Plan — Codapay Checkout Builder

A concrete, ordered build sequence for Claude Code. Each step is small, testable, and ends in a
working state. Do them in order; don't skip ahead — later steps assume earlier scaffolding.

---

## Step 0 — Repo + tooling

```bash
# pnpm workspace monorepo
pnpm init
mkdir -p packages/{tokens,config-schema,checkout-ui,ui-coda} apps/{builder,checkout,api} docs
```

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - "packages/*"
  - "apps/*"
```

Add root tooling: TypeScript (strict), ESLint + the import-boundary rule (Step 1), Prettier,
Vitest, Playwright. Drop `CLAUDE.md` and `design-system-map.ts` into `docs/` and the repo root
(`CLAUDE.md` at root).

**Done when:** `pnpm -r build` runs (even if packages are empty), CI skeleton is green.

---

## Step 1 — Enforce the design-system boundary FIRST

Before any feature code, install the guardrail so violations are impossible to merge.

Use `eslint-plugin-import` (or `dependency-cruiser`) with rules:
- `packages/ui-coda` may not import `packages/checkout-ui` or `packages/tokens`.
- `packages/checkout-ui` and `packages/tokens` may not import `packages/ui-coda`.
- A custom lint rule (or stylelint) forbidding `--bg-*`/`--text-*` whitelabel vars inside
  `packages/ui-coda/**` and forbidding Coda path-token usage inside `packages/checkout-ui/**`.

Add a `no-raw-values` stylelint rule: no hex, no px on non-frozen properties.

**Done when:** a deliberately-wrong import fails `pnpm lint` in CI.

---

## Step 2 — `packages/tokens` (whitelabel engine)  ·  tests first

Port from the `codapay-whitelabel` skill + the prototype's token logic.

Implement:
- `TokenSet` type + the editable/frozen token lists.
- `deriveFromPrimary(primary, mode)` — full token set from a color.
- `validate(tokens)` — the 5 rules (contrast, error-red, focus≠input, destructive≠primary,
  selection-is-tint). Returns typed issues.
- `autoFix(issue, tokens)` — lightness-shift until contrast passes.
- `contrast/luminance/mix` color math.
- `toCss(tokens)` / `fromCss(css)` round-trip.

**Tests (write before impl):** known contrast pairs, each validation rule pass+fail, autofix
converges, CSS round-trips losslessly, frozen tokens never mutate.

**Done when:** `pnpm --filter tokens test` is green and covers every rule.

---

## Step 3 — `packages/config-schema`

Zod schema for the config artifact (PRD §6.1) + inferred TS types + `version` and a
`migrate(old)` stub. Export `parseConfig` / `safeParseConfig`.

**Done when:** invalid configs are rejected with typed errors; a v-current sample validates.

---

## Step 4 — `packages/checkout-ui` (the shared renderer)

The whitelabel-themed Vue checkout. Renders from a config artifact + token CSS ONLY.

- One root `<CheckoutRoot>` that mounts everything under a `.checkout-scope` element and injects
  the token CSS as scoped custom properties.
- Region components per `CHECKOUT_REGION_MAP`: `Navbar`, `ProductSummary`, `Rewards`,
  `PaymentMethods`, `ActionBar`.
- `PaymentMethods` implements the 3 row types + states from `METHOD_ROWS` (saved → CVV/ZIP,
  new-card → full form + live detection, external → pay hint).
- Styling uses ONLY whitelabel CSS vars. No Coda tokens. No raw values.

**Tests:** snapshot each region from a fixture artifact; interaction tests for select/expand.

**Done when:** rendering a fixture artifact produces the checkout; used identically by builder
preview and `apps/checkout`.

---

## Step 5 — `packages/ui-coda` (builder chrome components)

Port from the `coda-payments-design` skill's `ui_kits/pam-portal/` to Vue 3. Build exactly the
components referenced by `BUILDER_CHROME_MAP.reuseFrom` + new ones marked `null`:

Priority (covers most of the builder): `Button`, `IconButton`, `Input`, `Dropdown`, `Toggle`,
`RadioButton`, `Card`, `Tabs`, `Lists`/`IndexListItem`, `Snackbar`, `Dialog`, `SideDialog`,
`InfoBanner`, `Chips`, `Uploader`, `NavigationBarTop`, `NavigationBarSide`, `PreviewThumbnail`,
`Tooltips`, `ProgressIndicators`.

Each component: props/states exactly per `design.md`; values from `colors_and_type.css` tokens.
No whitelabel vars.

**Tests:** each component renders all documented states; token-only (lint passes).

---

## Step 6 — `apps/builder` (assemble)

Three-column shell using `ui-coda`. Mount `checkout-ui` inside the preview pane's
`.checkout-scope`. Wire with Pinia:
- `useConfigStore` — config + undo/redo + dirty tracking.
- `useThemeStore` — token set, saved-theme library, validation results.

Build each settings panel by reading `BUILDER_CHROME_MAP` (the panel for a node is just the rows
whose `area === 'settings-panel'` etc.). Implement click-to-edit two-way binding via
`CHECKOUT_REGION_MAP.treeNode`. Edit/Preview mode toggle. Export modal (SideDialog).

**Done when:** editing a field updates the preview live; preview click selects its tree node.

---

## Step 7 — `apps/api` + `apps/checkout`

- API: configs (versioned), themes (CRUD), assets (validated upload), export endpoint that emits
  `config.json` + `tokens.css`.
- `apps/checkout`: thin shell that fetches an artifact and mounts `checkout-ui`. This is the
  parity twin of the builder preview.

---

## Step 8 — Parity gate + a11y + perf

- Playwright visual-regression: render the SAME fixture artifact in builder-preview and
  `apps/checkout`, diff screenshots, fail on drift. **Required merge gate.**
- Axe accessibility pass on builder chrome and rendered checkout.
- Perf: preview re-render < 16ms (debounced); first paint < 2s.

---

## First PR (vertical slice — do this to de-risk everything)

Prove the parity contract end-to-end before building features:

1. Steps 0–1 (repo + boundary lint).
2. Minimal `tokens` (just `toCss`/`fromCss` + one validation rule).
3. Minimal `checkout-ui` (just `ActionBar` showing the Pay price).
4. `apps/builder` with a single editable field (final price) → export → `apps/checkout`
   renders the same artifact.
5. Parity screenshot test passes.

If that slice works, the architecture is sound and the rest is incremental.

---

## Build-order dependency graph

```
tokens ─┐
        ├─> checkout-ui ─┐
config-schema ───────────┼─> apps/builder ─> apps/checkout
ui-coda ─────────────────┘
                          └─> apps/api
```

## Reminders for every task
- Read the right skill spec before writing chrome (coda-payments-design) or checkout
  (codapay-whitelabel) code. Never mix tokens.
- Add the `design-system-map.ts` entry before building a component.
- Tests before implementation for any logic.
- Lint boundary + parity gate must stay green.
