# Changelog

All notable changes to the Codapay Checkout Builder are documented here.
Entries are added automatically on every push to `main`.

---

## 2026-06-25 — Initial release

**Pam (ilham.pamungkas@codapayments.com)**

### Checkout UI — Payment fields
- Floating label pattern on all payment inputs (CVV, ZIP, Card number, Expiry)
  - Label centered as placeholder when empty, floats to top-small when focused or filled
  - CSS-only via `:focus-within` + `:not(:placeholder-shown)`, 150ms ease transition
  - `prefers-reduced-motion` guard
  - Applied to `SavedCardRow.vue` and `NewCardRow.vue`
- Fixed CVV/ZIP fields rendering at exact 50/50 width (`min-width: 0` on flex children)
- Fixed ZIP code bottom border clipping on Retina displays
  - Root cause: 1px `padding-bottom` buffer was eaten by sub-pixel rounding at DPR > 2
  - Fix: replaced `max-height` collapse with CSS grid `0fr → 1fr` reveal (no magic number)

### Checkout UI — Loading & Result screens
- Loading overlay (floats above checkout, z-index 50)
  - Animated triple-dot loader with staggered bounce (`DotsLoader.vue`)
  - Alternative: custom image (gif / webp / png) via config
  - New tokens: `--bg-loading-card`, `--loader-accent`
- Result screen with full success / failed state support
  - `ResultScreen.vue` — status-driven (`config.screens.result.variants`)
  - `ResultHero.vue` — title, subtitle, animated status emblem
  - `StatusEmblem.vue` — check (success) / cross (failed) with color-mix glow ring
  - `ErrorDetail.vue` — failure reason block (failed state only)
  - `RewardCard.vue` — reward unlock card (success state only)
  - `OrderDetails.vue` — product card + payment method + price rows
  - `ResultFooterCta.vue` — outlined glow (success) / filled primary (failed)
  - `ResultNavbar.vue` — store name + avatar
- Pay button hover micro-animation (`translateY(-2px)` + glow)
- `CheckoutRoot.vue` screen orchestration: checkout → overlay (1.6 s) → result

### Token schema — Effects tier (gradients / shadows / backdrop)
- 7 new optional effect tokens:
  - `--bg-page-gradient` — page background gradient
  - `--bg-navbar-blend` — navbar translucent/tinted background
  - `--backdrop-blur-navbar` — navbar backdrop-filter blur
  - `--bg-action-primary-gradient` — CTA button gradient
  - `--shadow-action-primary` — CTA button box-shadow
  - `--bg-card-selected-gradient` — selected payment card gradient
  - `--shadow-card-selected` — selected card box-shadow
- Empty string = inactive; `toCss()` skips empty values so components fall back to flat tokens automatically
- Components updated to use `var(--effect-token, flat-fallback)` pattern
- Skin system: `config.theme.skin = "glossy"` activates structural pseudo-element decoration (shine animations, gloss bars, gradient borders) — separate from tokens

### Themes
- `packages/tokens/src/themes/rift-racing.css` — flat dark navy theme (no effects)
- `packages/tokens/src/themes/candy-crush.css` — full gradient theme (new)
  - Deep purple palette, hot pink CTA, translucent navbar, per-card glow
  - Candy Crush visual personality extracted from hardcoded CSS into proper token file

### Config schema
- `config.theme.skin: "none" | "glossy"` — decorative skin selector
- `screens.loading` — loader type + custom asset config
- `screens.result` — full result screen config with `variants: { success, failed }`
- Version bumped to 2

### Builder
- Fixed TypeScript build (missing `tsconfig.json`, `allowImportingTsExtensions`, extracted inline template globals)
- Zero type errors — clean `vue-tsc --noEmit` + `vite build`
- Added `netlify.toml` + `vercel.json` for one-click deployment

### Skill — codapay-whitelabel
- New token sections: loading overlay, status accents, effects (gradients/shadows/backdrop)
- Bundled theme files: `assets/themes/rift-racing.css`, `assets/themes/candy-crush.css`
- Getting Started section: clone → install → dev → theme workflow
- Skin flag documentation and derivation guidance
- Updated Output B template with all new token groups

### Repo
- Initial push to `github.com/codapamn/secretlink`
- `README.md` with prerequisites, quick start, theming guide, export docs

---
