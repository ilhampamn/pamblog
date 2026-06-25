# Codapay Checkout Builder

A visual builder for theming and configuring the Codapay mobile checkout — no code required for merchants, full control for developers.

A designer opens the builder, configures colors/typography/layout, sees a live phone preview, and exports a `config.json` + `tokens.css` that the production checkout consumes verbatim.

---

## What's inside

```
apps/
  builder/        ← the visual builder SPA (this is what you run)
  checkout/       ← production checkout shell (thin wrapper over checkout-ui)

packages/
  checkout-ui/    ← the Vue renderer — the actual payment screen
  config-schema/  ← Zod schemas + TypeScript types for config artifacts
  tokens/         ← token schema, derivation, contrast validation
```

The builder and the production checkout use **the same renderer** (`packages/checkout-ui`). What you see in the preview is exactly what ships.

---

## Prerequisites

- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **pnpm** 8+ — `npm install -g pnpm`
- **Claude Code** — [claude.ai/code](https://claude.ai/code)
- The **codapay-whitelabel** skill loaded in Claude Code (ask your team lead for the skill link)

---

## Quick start

```bash
# 1. Clone this repo
git clone https://github.com/codapamn/pamsworld.git
cd pamsworld

# 2. Install dependencies (monorepo — one command installs everything)
pnpm install

# 3. Start the builder
pnpm --filter builder dev
```

Open **http://localhost:5173** — the builder loads with the Rift Racing dark theme as a starting point.

---

## Theming with Claude Code

Once the builder is running, open Claude Code in this directory. The `codapay-whitelabel` skill gives Claude everything it needs to generate a custom theme from any brand input.

**Example prompts:**
- *"Use the codapay-whitelabel skill to theme this for Grab — here's their brand page: [URL]"*
- *"Generate tokens for a dark fintech brand, primary color #1A1A2E"*
- *"Apply the candy-crush theme and set skin to glossy"*

Claude will output a `tokens.css` block. Paste it into the **Theme & Tokens → Custom CSS** field in the builder, and the preview updates instantly.

---

## Exporting

When the preview looks right, click **Export** in the top bar. You'll get:

- `config.json` — all product/payment/screen configuration
- `tokens.css` — the complete design token stylesheet

These two files are the only inputs the production checkout needs.

---

## Project rules (read before writing code)

See **[CLAUDE.md](./CLAUDE.md)** — it covers the two-design-system boundary, parity contract, schema-first build order, and frozen constraints. Claude Code reads this automatically when you work in this repo.

---

## Existing themes

| Theme | File | Skin |
|---|---|---|
| Rift Racing (dark) | `packages/tokens/src/themes/rift-racing.css` | none |
| Candy Crush (gradient) | `packages/tokens/src/themes/candy-crush.css` | glossy |

Use these as starting points or references when generating new themes.
