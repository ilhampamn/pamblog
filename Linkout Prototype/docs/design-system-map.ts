/**
 * design-system-map.ts
 * ─────────────────────────────────────────────────────────────────────────
 * The typed, machine-readable version of PRD §4.
 *
 * TWO design systems, kept physically separate:
 *   - coda-payments-design  → builder chrome   (packages/ui-coda)
 *   - codapay-whitelabel     → payment page     (packages/checkout-ui + tokens)
 *
 * This file is the single source of truth for "which component renders which
 * builder element" and "which checkout region maps to which config slice".
 * Claude Code should treat the `BUILDER_CHROME_MAP` and `CHECKOUT_REGION_MAP`
 * arrays as the contract to implement against.
 * ─────────────────────────────────────────────────────────────────────────
 */

// ── Design system identifiers ───────────────────────────────────────────────
export type DesignSystem = 'coda-payments-design' | 'codapay-whitelabel';

// ── Coda component catalog (Components 2.0) — names only, props are per-row ──
export type CodaComponent =
  | 'Button' | 'IconButton' | 'Input' | 'Dropdown' | 'Toggle' | 'Checkbox'
  | 'RadioButton' | 'Filters' | 'Uploader' | 'DatePicker'
  | 'NavigationBarTop' | 'NavigationBarSide' | 'ProgressSteps' | 'Tabs'
  | 'ProgressIndicators' | 'Tooltips' | 'Snackbar' | 'GlobalInfoBar'
  | 'InfoBanner' | 'Chips' | 'Dialog' | 'SideDialog' | 'Table' | 'Card'
  | 'Lists' | 'IndexListItem' | 'AvatarStack' | 'PageHeader'
  | 'SetupProgress' | 'PreviewThumbnail' | 'GlowEffect' | 'Typography';

// ── A builder-chrome element → its Coda component mapping ────────────────────
export interface BuilderChromeMapping {
  /** Stable id used in code + tests */
  id: string;
  /** Human label (matches PRD §4A) */
  element: string;
  /** Which builder area it lives in */
  area: 'shell' | 'settings-panel' | 'payment-editor' | 'theme-editor' | 'feedback';
  /** Always the Coda DS for chrome */
  ds: 'coda-payments-design';
  component: CodaComponent;
  /** Props / variant to instantiate with (free-form, matches design.md) */
  props: Record<string, string | boolean | number>;
  /** Interaction states this instance must support */
  states: string[];
  /** PAM UI-kit component to lift from, if one exists (else null = build new) */
  reuseFrom: string | null;
}

// ── A checkout region → its config slice + whitelabel styling ────────────────
export interface CheckoutRegionMapping {
  id: string;
  region: string;             // matches PRD §4B
  ds: 'codapay-whitelabel';
  /** config.json path that drives this region */
  configPath: string;
  /** the whitelabel tokens this region consumes (for validation/coverage) */
  tokens: string[];
  /** is this region an edit target (click-to-select in preview)? */
  editTarget: boolean;
  /** which builder tree node selects it */
  treeNode: 'navbar' | 'product' | 'rewards' | 'payments' | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4A — BUILDER CHROME  (coda-payments-design)
// ═══════════════════════════════════════════════════════════════════════════
export const BUILDER_CHROME_MAP: BuilderChromeMapping[] = [
  // ── 4A.1 App shell & navigation ──
  {
    id: 'topbar', element: 'Top bar (logo, mode toggle, actions)', area: 'shell',
    ds: 'coda-payments-design', component: 'NavigationBarTop',
    props: { size: 'lg', breakpoint: 'web' }, states: ['default', 'hover'],
    reuseFrom: 'TopNav',
  },
  {
    id: 'config-tree', element: 'Left config tree', area: 'shell',
    ds: 'coda-payments-design', component: 'NavigationBarSide',
    props: { 'IA-container': '2-level', size: 'lg', expanded: true },
    states: ['default', 'hover', 'selected'], reuseFrom: 'SideNav',
  },
  {
    id: 'tree-row', element: 'Config tree row', area: 'shell',
    ds: 'coda-payments-design', component: 'IndexListItem',
    props: {}, states: ['default', 'hover', 'selected'], reuseFrom: 'Navigation2',
  },
  {
    id: 'mode-switch', element: 'Edit / Preview switch', area: 'shell',
    ds: 'coda-payments-design', component: 'Tabs',
    props: { options: 2 }, states: ['active', 'inactive'], reuseFrom: null,
  },
  {
    id: 'btn-export', element: 'Export button', area: 'shell',
    ds: 'coda-payments-design', component: 'Button',
    props: { type: 'primary', size: 'md' },
    states: ['default', 'hover', 'pressed', 'disabled'], reuseFrom: 'Button',
  },
  {
    id: 'btn-reset', element: 'Reset button', area: 'shell',
    ds: 'coda-payments-design', component: 'Button',
    props: { type: 'secondary', size: 'md' },
    states: ['default', 'hover', 'pressed', 'disabled'], reuseFrom: 'Button',
  },

  // ── 4A.2 Settings panels ──
  {
    id: 'panel-container', element: 'Settings panel container', area: 'settings-panel',
    ds: 'coda-payments-design', component: 'Card',
    props: { 'show-header': true }, states: ['default'], reuseFrom: 'Card',
  },
  {
    id: 'field-text', element: 'Text field (name, alt text)', area: 'settings-panel',
    ds: 'coda-payments-design', component: 'Input',
    props: { kind: 'text' },
    states: ['default', 'focus', 'filled', 'error', 'disabled'], reuseFrom: 'Input',
  },
  {
    id: 'field-number', element: 'Number field (price, amount)', area: 'settings-panel',
    ds: 'coda-payments-design', component: 'Input',
    props: { kind: 'numeric' },
    states: ['default', 'focus', 'filled', 'error'], reuseFrom: 'Input',
  },
  {
    id: 'field-select', element: 'Currency / locale select', area: 'settings-panel',
    ds: 'coda-payments-design', component: 'Dropdown',
    props: { 'show-search': false },
    states: ['default', 'loading', 'no results found'], reuseFrom: null,
  },
  {
    id: 'field-toggle', element: 'Show/hide switch', area: 'settings-panel',
    ds: 'coda-payments-design', component: 'Toggle',
    props: { size: 'md' },
    states: ['default', 'hover', 'pressed', 'disabled', 'selected'], reuseFrom: null,
  },
  {
    id: 'field-upload', element: 'Logo / image upload', area: 'settings-panel',
    ds: 'coda-payments-design', component: 'Uploader',
    props: { variant: 'image' },
    states: ['default', 'drop-active', 'selected', 'error'], reuseFrom: null,
  },

  // ── 4A.3 Payment-method editor ──
  {
    id: 'method-list', element: 'Reorderable method list', area: 'payment-editor',
    ds: 'coda-payments-design', component: 'Lists',
    props: {}, states: ['default'], reuseFrom: null,
  },
  {
    id: 'method-row', element: 'Method row', area: 'payment-editor',
    ds: 'coda-payments-design', component: 'IndexListItem',
    props: { draggable: true }, states: ['default', 'hover'], reuseFrom: null,
  },
  {
    id: 'method-visible', element: 'Per-method visibility', area: 'payment-editor',
    ds: 'coda-payments-design', component: 'Toggle',
    props: { size: 'md' }, states: ['default', 'selected', 'disabled'], reuseFrom: null,
  },
  {
    id: 'method-default', element: 'Default-selected control', area: 'payment-editor',
    ds: 'coda-payments-design', component: 'RadioButton',
    props: { size: 'md' },
    states: ['unselected', 'selected', 'error', 'disabled'], reuseFrom: null,
  },
  {
    id: 'method-thumb', element: 'Method logo thumbnail', area: 'payment-editor',
    ds: 'coda-payments-design', component: 'PreviewThumbnail',
    props: { loading: false }, states: ['default'], reuseFrom: null,
  },
  {
    id: 'method-unmatched', element: 'Unmatched-logo flag', area: 'payment-editor',
    ds: 'coda-payments-design', component: 'Chips',
    props: { type: 'negative' }, states: ['default'], reuseFrom: 'Chip',
  },

  // ── 4A.4 Theme / tokens editor ──
  {
    id: 'theme-mode', element: 'Input-mode switch (Manual/Upload/Generate)', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'Tabs',
    props: { options: 3 }, states: ['active', 'inactive'], reuseFrom: null,
  },
  {
    id: 'theme-dropdown', element: 'Saved-theme dropdown', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'Dropdown',
    props: { 'show-search': false },
    states: ['default', 'no results found'], reuseFrom: null,
  },
  {
    id: 'theme-save', element: 'Save / Save as', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'Button',
    props: { type: 'secondary', size: 'md' },
    states: ['default', 'hover', 'pressed', 'disabled'], reuseFrom: 'Button',
  },
  {
    id: 'theme-delete', element: 'Delete theme', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'IconButton',
    props: { type: 'secondary', size: 'sm' },
    states: ['default', 'hover', 'pressed', 'disabled'], reuseFrom: null,
  },
  {
    id: 'token-group', element: 'Collapsible token group', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'Card',
    props: { 'show-header': true }, states: ['default'], reuseFrom: 'Card',
  },
  {
    id: 'token-validation', element: 'Validation message', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'InfoBanner',
    props: { type: 'warning' }, states: ['default'], reuseFrom: null,
  },
  {
    id: 'token-autofix', element: 'Auto-fix action', area: 'theme-editor',
    ds: 'coda-payments-design', component: 'Button',
    props: { type: 'link' }, states: ['default', 'hover'], reuseFrom: 'Button',
  },

  // ── 4A.5 Cross-cutting feedback ──
  {
    id: 'snackbar-save', element: 'Save confirmation', area: 'feedback',
    ds: 'coda-payments-design', component: 'Snackbar',
    props: { type: 'positive' }, states: ['default'], reuseFrom: 'Snackbar',
  },
  {
    id: 'snackbar-export-fail', element: 'Export blocked by validation', area: 'feedback',
    ds: 'coda-payments-design', component: 'Snackbar',
    props: { type: 'critical' }, states: ['default'], reuseFrom: 'Snackbar',
  },
  {
    id: 'dialog-reset', element: 'Reset confirmation', area: 'feedback',
    ds: 'coda-payments-design', component: 'Dialog',
    props: { type: 'critical' }, states: ['default'], reuseFrom: 'Dialog',
  },
  {
    id: 'side-export', element: 'Export output viewer', area: 'feedback',
    ds: 'coda-payments-design', component: 'SideDialog',
    props: { hierarchy: 'first-level' }, states: ['default'], reuseFrom: null,
  },
  {
    id: 'tooltip-help', element: 'Inline help', area: 'feedback',
    ds: 'coda-payments-design', component: 'Tooltips',
    props: { side: 'top' }, states: ['default'], reuseFrom: null,
  },
  {
    id: 'progress-autosave', element: 'Autosave / load progress', area: 'feedback',
    ds: 'coda-payments-design', component: 'ProgressIndicators',
    props: { type: 'indeterminate' }, states: ['default'], reuseFrom: null,
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// 4B — PAYMENT PAGE  (codapay-whitelabel)
// ═══════════════════════════════════════════════════════════════════════════
export const CHECKOUT_REGION_MAP: CheckoutRegionMapping[] = [
  {
    id: 'co-navbar', region: 'Navigation bar', ds: 'codapay-whitelabel',
    configPath: 'navbar', editTarget: true, treeNode: 'navbar',
    tokens: ['--bg-navbar', '--border-navbar', '--text-body-soft'],
  },
  {
    id: 'co-product', region: 'Product summary', ds: 'codapay-whitelabel',
    configPath: 'product', editTarget: true, treeNode: 'product',
    tokens: ['--bg-card-default', '--border-card-default', '--text-body-default',
             '--text-body-subtle', '--bg-action-primary', '--text-action-on-primary'],
  },
  {
    id: 'co-rewards', region: 'Earn coin / rewards', ds: 'codapay-whitelabel',
    configPath: 'rewards', editTarget: true, treeNode: 'rewards',
    tokens: ['--text-body-default', '--text-body-soft', '--size-icon-s'],
  },
  {
    id: 'co-payments', region: 'Payment methods', ds: 'codapay-whitelabel',
    configPath: 'payments', editTarget: true, treeNode: 'payments',
    tokens: ['--bg-card-default', '--bg-card-selected', '--border-card-default',
             '--border-input-focused', '--border-weight-selected', '--bg-input-default',
             '--text-body-default', '--text-body-subtle', '--text-placeholder'],
  },
  {
    id: 'co-action', region: 'Action bar', ds: 'codapay-whitelabel',
    configPath: 'product.finalPrice', editTarget: false, treeNode: null,
    tokens: ['--bg-navbar', '--border-divider', '--bg-action-primary',
             '--text-action-on-primary', '--radius-control-full', '--text-body-subtle'],
  },
];

// ── Payment-method row variants (within co-payments) ────────────────────────
export type MethodType = 'saved' | 'new-card' | 'external';
export interface MethodRowSpec {
  id: string;
  label: string;
  type: MethodType;
  /** logo key resolved from the bundled whitelabel logo library, or null */
  logoKey: string | null;
  /** what the selected state reveals */
  selectedReveals: 'cvv-zip' | 'full-card-form' | 'pay-hint';
}
export const METHOD_ROWS: MethodRowSpec[] = [
  { id: 'saved_visa', label: 'Visa •••• 3893', type: 'saved', logoKey: 'visa', selectedReveals: 'cvv-zip' },
  { id: 'saved_mc',   label: 'Mastercard •••• 9876', type: 'saved', logoKey: 'mastercard', selectedReveals: 'cvv-zip' },
  { id: 'add_card',   label: 'Add a new card', type: 'new-card', logoKey: null, selectedReveals: 'full-card-form' },
  { id: 'google_pay', label: 'Google Pay', type: 'external', logoKey: 'googlepay', selectedReveals: 'pay-hint' },
  { id: 'apple_pay',  label: 'Apple Pay', type: 'external', logoKey: 'applepay', selectedReveals: 'pay-hint' },
  { id: 'paypal',     label: 'PayPal', type: 'external', logoKey: 'paypal', selectedReveals: 'pay-hint' },
  { id: 'cash_app',   label: 'Cash App', type: 'external', logoKey: null, selectedReveals: 'pay-hint' },
];

// ── Guard: which DS a token belongs to (used by the lint boundary) ───────────
export function tokenDesignSystem(token: string): DesignSystem | 'unknown' {
  if (token.startsWith('--')) return 'codapay-whitelabel';        // CSS var → checkout
  if (token.includes('/')) return 'coda-payments-design';          // path token → chrome
  return 'unknown';
}
