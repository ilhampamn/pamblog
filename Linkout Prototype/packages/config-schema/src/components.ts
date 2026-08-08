/**
 * Component-level style overrides.
 *
 * The whitelabel checkout is themed by ONE global TokenSet applied to
 * `.checkout-scope`. This module adds a *local* layer on top: per-component-role
 * overrides that shadow the global token for a single role (e.g. only the Pay
 * Button, only the Card Surface).
 *
 * Mechanism — every overridable property in the checkout CSS reads
 *   `var(--ov-<role>-<prop>, <original-token-fallback>)`
 * so when no override is set the component falls back to the global token.
 * Setting an override = writing that CSS variable. Resetting = deleting the key,
 * which returns to the token automatically (absence *is* the default).
 *
 * The catalog below is the single source of truth for which roles/props are
 * editable, the CSS variable each writes, and the type of editor to show.
 * The catalog does NOT change checkout anatomy — only cosmetic properties.
 */

export type StylePropType = 'color' | 'borderWidth' | 'radius';

export interface StyleProp {
  /** Stable key stored in the override map. */
  key: string;
  /** Human label shown in the Components panel. */
  label: string;
  /** Editor + validation kind. */
  type: StylePropType;
  /** CSS custom property this property writes, e.g. `--ov-paybtn-bg`. */
  cssVar: string;
  /** The global token expression this shadows (shown as "default" in the UI). */
  fallback: string;
}

export interface ComponentRole {
  /** Stable id stored as the outer key of the override map. */
  id: string;
  /** Human label. */
  label: string;
  /** Short description of what the role covers. */
  description: string;
  /** The checkout CSS selector this role targets (used by the Advanced CSS escape hatch). */
  selector: string;
  /** Editable cosmetic properties. */
  props: StyleProp[];
}

/** Border-width choices — a fixed scale, never arbitrary values. */
export const BORDER_WIDTH_OPTIONS = ['0', '1px', '2px', '3px', '4px'] as const;

/** Radius choices — each resolves to a whitelabel radius token (or 0). */
export const RADIUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'Square (0)', value: '0' },
  { label: 'Input (radius-input-m)', value: 'var(--radius-input-m)' },
  { label: 'Container S', value: 'var(--radius-container-s)' },
  { label: 'Container M', value: 'var(--radius-container-m)' },
  { label: 'Pill (control-full)', value: 'var(--radius-control-full)' },
  { label: 'Full', value: 'var(--border-radius-full)' },
];

export const COMPONENT_ROLES: ComponentRole[] = [
  {
    id: 'payButton',
    label: 'Pay Button',
    description: 'The primary call-to-action button in the action bar.',
    selector: '.co-paybtn',
    props: [
      { key: 'bg', label: 'Background', type: 'color', cssVar: '--ov-paybtn-bg', fallback: 'var(--bg-action-primary-gradient, var(--bg-action-primary))' },
      { key: 'text', label: 'Text color', type: 'color', cssVar: '--ov-paybtn-text', fallback: 'var(--text-action-on-primary, #06222B)' },
      { key: 'borderColor', label: 'Border color', type: 'color', cssVar: '--ov-paybtn-border-color', fallback: 'transparent' },
      { key: 'borderWidth', label: 'Border width', type: 'borderWidth', cssVar: '--ov-paybtn-border-width', fallback: '0' },
      { key: 'radius', label: 'Corner radius', type: 'radius', cssVar: '--ov-paybtn-radius', fallback: 'var(--radius-control-full)' },
    ],
  },
  {
    id: 'cardSurface',
    label: 'Card Surface',
    description: 'Unselected payment-method rows / cards.',
    selector: '.co-opt',
    props: [
      { key: 'bg', label: 'Background', type: 'color', cssVar: '--ov-card-bg', fallback: 'var(--bg-card-default)' },
      { key: 'borderColor', label: 'Border color', type: 'color', cssVar: '--ov-card-border-color', fallback: 'var(--border-card-default)' },
      { key: 'borderWidth', label: 'Border width', type: 'borderWidth', cssVar: '--ov-card-border-width', fallback: '1px' },
      { key: 'radius', label: 'Corner radius', type: 'radius', cssVar: '--ov-card-radius', fallback: 'var(--radius-container-s)' },
    ],
  },
  {
    id: 'selectedCard',
    label: 'Selected Card',
    description: 'The active / selected payment-method row.',
    selector: '.co-opt.sel',
    props: [
      { key: 'bg', label: 'Background', type: 'color', cssVar: '--ov-cardsel-bg', fallback: 'var(--bg-card-selected-gradient, var(--bg-card-selected))' },
      { key: 'borderColor', label: 'Border color', type: 'color', cssVar: '--ov-cardsel-border-color', fallback: 'var(--border-input-focused)' },
      { key: 'borderWidth', label: 'Border width', type: 'borderWidth', cssVar: '--ov-cardsel-border-width', fallback: 'var(--border-weight-selected)' },
    ],
  },
  {
    id: 'inputField',
    label: 'Input Field',
    description: 'Text inputs inside expanded card / new-card forms.',
    selector: '.co-input',
    props: [
      { key: 'bg', label: 'Background', type: 'color', cssVar: '--ov-input-bg', fallback: 'var(--bg-input-default)' },
      { key: 'borderColor', label: 'Border color', type: 'color', cssVar: '--ov-input-border-color', fallback: 'var(--border-input-default)' },
      { key: 'radius', label: 'Corner radius', type: 'radius', cssVar: '--ov-input-radius', fallback: 'var(--radius-input-m)' },
    ],
  },
  {
    id: 'navbar',
    label: 'Navbar',
    description: 'The top checkout navigation bar.',
    selector: '.co-navbar',
    props: [
      { key: 'bg', label: 'Background', type: 'color', cssVar: '--ov-navbar-bg', fallback: 'var(--bg-navbar-blend, var(--bg-navbar))' },
      { key: 'borderColor', label: 'Bottom border color', type: 'color', cssVar: '--ov-navbar-border-color', fallback: 'var(--border-navbar)' },
    ],
  },
  {
    id: 'productBanner',
    label: 'Product Banner',
    description: 'The product summary banner at the top of the sheet.',
    selector: '.co-banner',
    props: [
      { key: 'bg', label: 'Background', type: 'color', cssVar: '--ov-banner-bg', fallback: 'var(--bg-card-default)' },
      { key: 'borderColor', label: 'Bottom border color', type: 'color', cssVar: '--ov-banner-border-color', fallback: 'var(--border-divider)' },
    ],
  },
];

/** overrides[roleId][propKey] = css value string. Absent key = use token default. */
export type ComponentOverrides = Record<string, Record<string, string>>;

/**
 * Compile a componentOverrides map into a scoped CSS block that assigns the
 * `--ov-*` variables. Empty / missing values emit nothing (so the component's
 * token fallback wins). Returns '' when there is nothing to emit.
 */
export function compileComponentOverrides(
  overrides: ComponentOverrides | undefined | null,
  scope = '.checkout-scope',
): string {
  if (!overrides) return '';
  const decls: string[] = [];
  for (const role of COMPONENT_ROLES) {
    const roleOverrides = overrides[role.id];
    if (!roleOverrides) continue;
    for (const prop of role.props) {
      const value = roleOverrides[prop.key];
      if (value != null && value !== '') {
        decls.push(`  ${prop.cssVar}: ${value};`);
      }
    }
  }
  if (decls.length === 0) return '';
  return `${scope} {\n${decls.join('\n')}\n}\n`;
}

/** componentCss[roleId] = raw CSS declarations for that role's Advanced CSS box. */
export type ComponentCss = Record<string, string>;

/**
 * Sanitize a raw CSS *declaration* string so it stays inside the block we wrap
 * it in. Strips braces (can't open/close rules), angle brackets (can't inject
 * `</style>`), and `@import` (no network fetches). The result is a plain list
 * of `prop: value;` declarations — powerful (gradients, transforms, shadows,
 * filters) but scope-contained.
 */
export function sanitizeComponentCss(raw: string): string {
  return raw
    .replace(/@import[^;]*;?/gi, '')
    .replace(/[{}<>]/g, '')
    .trim();
}

/**
 * Compile the Advanced CSS escape hatch. Each role's declarations are wrapped
 * in `<scope> <role-selector> { … }`, giving them higher specificity than the
 * token + structured-override layer (so advanced CSS wins), while staying
 * scoped to the checkout so nothing leaks into the builder chrome.
 * Returns '' when there is nothing to emit.
 */
export function compileComponentCss(
  css: ComponentCss | undefined | null,
  scope = '.checkout-scope',
): string {
  if (!css) return '';
  const blocks: string[] = [];
  for (const role of COMPONENT_ROLES) {
    const raw = css[role.id];
    if (!raw || !raw.trim()) continue;
    const safe = sanitizeComponentCss(raw);
    if (!safe) continue;
    blocks.push(`${scope} ${role.selector} {\n${safe}\n}`);
  }
  return blocks.length ? `${blocks.join('\n')}\n` : '';
}
