import type { TokenSet } from './types.js';

export const FROZEN_TOKENS: Partial<TokenSet> = {
  '--pad-surface-xs': '4px',
  '--pad-surface-s': '8px',
  '--pad-surface-m': '12px',
  '--pad-surface-l': '16px',
  '--pad-surface-xl': '24px',
  '--gap-content-narrow': '4px',
  '--gap-content-default': '8px',
  '--gap-content-loose': '12px',
  '--gap-content-separation': '16px',
  '--gap-section-separation': '24px',
  '--size-icon-s': '16px',
  '--size-icon-l': '24px',
  '--border-weight-default': '1px',
  '--border-weight-action': '2px',
  '--border-weight-selected': '2px',
};

export const DEFAULT_TOKENS: TokenSet = {
  ...FROZEN_TOKENS as TokenSet,

  // Brand Primary (Codapay blue)
  '--bg-action-primary': '#102AF8',
  '--border-action-default': '#102AF8',
  '--text-hyperlink-inverse': '#102AF8',
  '--text-hyperlink-default': '#33C4ED',
  '--bg-card-selected': '#E1E3EB',
  '--border-input-focused': '#102AF8',

  // Surfaces
  '--bg-page': '#FFFFFF',
  '--bg-navbar': '#FFFFFF',
  '--bg-input-default': '#FFFFFF',
  '--bg-card-default': '#FFFFFF',
  '--bg-section-subtle': '#E1E3EB',
  '--bg-sheet': '#FFFFFF',
  '--bg-card-subtle': '#E6E6E6',
  '--bg-card-inverse': '#161616',
  '--bg-overlay': '#000000',

  // Actions
  '--bg-action-secondary': '#E1E3EB',
  '--bg-action-destructive': '#CC0705',
  '--text-action-on-primary': '#FFFFFF',

  // Text
  '--text-header-default': '#000000',
  '--text-body-default': '#202020',
  '--text-body-soft': '#464646',
  '--text-body-subtle': '#707070',
  '--text-placeholder': '#707070',
  '--text-body-inverse': '#F5F5F5',
  '--text-error-default': '#990604',

  // Borders
  '--border-navbar': '#E6E6E6',
  '--border-card-default': '#E6E6E6',
  '--border-input-default': '#CDCDCD',
  '--border-action-destructive': '#990604',
  '--border-divider': '#E6E6E6',

  // Radii
  '--radius-control-full': '999px',
  '--radius-input-m': '8px',
  '--radius-container-s': '8px',
  '--radius-container-m': '12px',
  '--border-radius-full': '9999px',

  // Loading overlay
  '--bg-loading-card': '#FFFFFF',
  '--loader-accent': '#102AF8',

  // Status accents (result screen)
  '--status-success': '#00C853',
  '--status-error': '#CC0705',

  // Typography
  '--font-primary': "'ABC Monument Grotesk', sans-serif",

  // Effects (empty = inactive; toCss skips these so components use flat token fallbacks)
  '--bg-page-gradient': '',
  '--bg-navbar-blend': '',
  '--backdrop-blur-navbar': '',
  '--bg-action-primary-gradient': '',
  '--shadow-action-primary': '',
  '--bg-card-selected-gradient': '',
  '--shadow-card-selected': '',
};
