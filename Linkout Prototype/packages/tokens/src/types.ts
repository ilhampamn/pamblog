export interface TokenSet {
  // Brand Primary
  '--bg-action-primary': string;
  '--border-action-default': string;
  '--text-hyperlink-inverse': string;
  '--text-hyperlink-default': string;
  '--bg-card-selected': string;
  '--border-input-focused': string;

  // Surfaces
  '--bg-page': string;
  '--bg-navbar': string;
  '--bg-input-default': string;
  '--bg-card-default': string;
  '--bg-section-subtle': string;
  '--bg-sheet': string;
  '--bg-card-subtle': string;
  '--bg-card-inverse': string;
  '--bg-overlay': string;

  // Actions
  '--bg-action-secondary': string;
  '--bg-action-destructive': string;
  '--text-action-on-primary': string;

  // Text
  '--text-header-default': string;
  '--text-body-default': string;
  '--text-body-soft': string;
  '--text-body-subtle': string;
  '--text-placeholder': string;
  '--text-body-inverse': string;
  '--text-error-default': string;

  // Borders
  '--border-navbar': string;
  '--border-card-default': string;
  '--border-input-default': string;
  '--border-action-destructive': string;
  '--border-divider': string;
  '--border-weight-default': string;
  '--border-weight-action': string;
  '--border-weight-selected': string;

  // Radii
  '--radius-control-full': string;
  '--radius-input-m': string;
  '--radius-container-s': string;
  '--radius-container-m': string;
  '--border-radius-full': string;

  // Spacing — FROZEN
  '--pad-surface-xs': string;
  '--pad-surface-s': string;
  '--pad-surface-m': string;
  '--pad-surface-l': string;
  '--pad-surface-xl': string;
  '--gap-content-narrow': string;
  '--gap-content-default': string;
  '--gap-content-loose': string;
  '--gap-content-separation': string;
  '--gap-section-separation': string;

  // Icon sizes — FROZEN
  '--size-icon-s': string;
  '--size-icon-l': string;

  // Loading overlay
  '--bg-loading-card': string;
  '--loader-accent': string;

  // Status accents (result screen)
  '--status-success': string;
  '--status-error': string;

  // Typography
  '--font-primary': string;

  // ── Effects (gradient / shadow / backdrop) ────────────────────────────────
  // Optional progressive enhancements. Empty string = inactive.
  // toCss() skips empty values so components fall back to their flat tokens.
  // Hex-starting tokens are contrast-validated; gradient/shadow values are skipped.
  '--bg-page-gradient': string;        // overrides --bg-page with a CSS gradient
  '--bg-navbar-blend': string;         // overrides --bg-navbar (rgba tints, gradients)
  '--backdrop-blur-navbar': string;    // backdrop-filter for the navbar (e.g. blur(8px))
  '--bg-action-primary-gradient': string; // overrides --bg-action-primary on CTA button
  '--shadow-action-primary': string;   // box-shadow on CTA button
  '--bg-card-selected-gradient': string;  // overrides --bg-card-selected on active card
  '--shadow-card-selected': string;    // box-shadow on selected card
}

export type EditableTokenKey = Exclude<
  keyof TokenSet,
  | '--pad-surface-xs' | '--pad-surface-s' | '--pad-surface-m'
  | '--pad-surface-l' | '--pad-surface-xl'
  | '--gap-content-narrow' | '--gap-content-default' | '--gap-content-loose'
  | '--gap-content-separation' | '--gap-section-separation'
  | '--size-icon-s' | '--size-icon-l'
  | '--border-weight-default' | '--border-weight-action' | '--border-weight-selected'
>;

export interface ValidationIssue {
  token: keyof TokenSet;
  rule: 'contrast' | 'error-red' | 'focus-distinct' | 'destructive-distinct' | 'selection-tint';
  message: string;
  severity: 'error' | 'warning';
  autoFixable: boolean;
}
