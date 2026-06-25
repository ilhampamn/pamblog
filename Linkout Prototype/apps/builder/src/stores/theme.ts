import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { TokenSet } from '@codapay/tokens';
import { DEFAULT_TOKENS, validate } from '@codapay/tokens';
import { toCss, fromCss } from '@codapay/tokens';

export interface SavedTheme {
  name: string;
  tokens: TokenSet;
  isPreset?: boolean;
}

export const RIFT_RACING_TOKENS: TokenSet = {
  ...DEFAULT_TOKENS,
  '--bg-action-primary': '#2BB6E6',
  '--border-action-default': '#2BB6E6',
  '--text-hyperlink-inverse': '#5CD2F2',
  '--bg-card-selected': '#142A33',
  '--border-input-focused': '#2BB6E6',
  '--bg-page': '#08090B',
  '--bg-navbar': '#0B0E12',
  '--bg-input-default': '#10141A',
  '--bg-card-default': '#16191E',
  '--bg-section-subtle': '#101317',
  '--bg-sheet': '#16191E',
  '--bg-card-subtle': '#1B1F25',
  '--bg-card-inverse': '#F2F5F7',
  '--bg-overlay': '#000000',
  '--bg-action-secondary': '#1B1F25',
  '--bg-action-destructive': '#CC0705',
  '--text-action-on-primary': '#06222B',
  '--text-header-default': '#FFFFFF',
  '--text-body-default': '#F2F5F7',
  '--text-body-soft': '#C2C8CF',
  '--text-body-subtle': '#8A929B',
  '--text-placeholder': '#6F767E',
  '--text-body-inverse': '#0B0E12',
  '--text-error-default': '#FF6B68',
  '--border-navbar': '#1E232A',
  '--border-card-default': '#252B33',
  '--border-input-default': '#2C333C',
  '--border-action-destructive': '#FF6B68',
  '--border-divider': '#1E232A',
  '--radius-control-full': '999px',
  '--radius-input-m': '8px',
  '--radius-container-s': '8px',
  '--radius-container-m': '12px',
  '--border-radius-full': '9999px',
  '--font-primary': "'Inter', sans-serif",
};

export const CANDY_CRUSH_TOKENS: TokenSet = {
  ...DEFAULT_TOKENS,
  '--bg-action-primary': '#FF2E88',
  '--border-action-default': '#FF2E88',
  '--text-hyperlink-inverse': '#7DE0FF',
  '--bg-card-selected': '#48246B',
  '--border-input-focused': '#FF2E88',
  '--bg-page': '#1A0F33',
  '--bg-navbar': '#22134A',
  '--bg-input-default': '#1E1240',
  '--bg-card-default': '#2B1B4D',
  '--bg-section-subtle': '#1E1240',
  '--bg-sheet': '#2B1B4D',
  '--bg-card-subtle': '#34215C',
  '--bg-card-inverse': '#FFF4FB',
  '--bg-overlay': '#000000',
  '--bg-action-secondary': '#34215C',
  '--bg-action-destructive': '#E5293E',
  '--text-action-on-primary': '#3D0018',
  '--text-header-default': '#FFFFFF',
  '--text-body-default': '#FFF4FB',
  '--text-body-soft': '#E4C9E8',
  '--text-body-subtle': '#B89BD4',
  '--text-placeholder': '#8B72AE',
  '--text-body-inverse': '#2B1B4D',
  '--text-error-default': '#FF6B68',
  '--border-navbar': '#3A2566',
  '--border-card-default': '#422A72',
  '--border-input-default': '#46307A',
  '--border-action-destructive': '#FF6B68',
  '--border-divider': '#34215C',
  '--radius-control-full': '999px',
  '--radius-input-m': '14px',
  '--radius-container-s': '18px',
  '--radius-container-m': '22px',
  '--border-radius-full': '9999px',
  '--font-primary': "'Baloo 2', 'Inter', sans-serif",
};

export const useThemeStore = defineStore('theme', () => {
  const tokens = ref<TokenSet>(structuredClone(RIFT_RACING_TOKENS));

  const savedThemes = ref<SavedTheme[]>([
    { name: 'Rift Racing', tokens: structuredClone(RIFT_RACING_TOKENS), isPreset: true },
    { name: 'Candy Crush', tokens: structuredClone(CANDY_CRUSH_TOKENS), isPreset: true },
    { name: 'Codapay Default', tokens: structuredClone(DEFAULT_TOKENS), isPreset: true },
  ]);

  const activeThemeName = ref<string | null>('Rift Racing');

  const tokensCss = computed(() => toCss(tokens.value, '.checkout-scope'));

  const validationIssues = computed(() => validate(tokens.value));
  const hasErrors = computed(() => validationIssues.value.some((i) => i.severity === 'error'));

  function setToken(key: keyof TokenSet, value: string) {
    tokens.value = { ...tokens.value, [key]: value };
    activeThemeName.value = null;
  }

  function applyTheme(name: string) {
    const theme = savedThemes.value.find((t) => t.name === name);
    if (!theme) return;
    tokens.value = { ...theme.tokens };
    activeThemeName.value = name;
  }

  function saveTheme(name: string) {
    const existing = savedThemes.value.findIndex((t) => t.name === name);
    const entry: SavedTheme = { name, tokens: { ...tokens.value } };
    if (existing >= 0) {
      savedThemes.value[existing] = entry;
    } else {
      savedThemes.value.push(entry);
    }
    activeThemeName.value = name;
  }

  function deleteTheme(name: string) {
    const idx = savedThemes.value.findIndex((t) => t.name === name && !t.isPreset);
    if (idx >= 0) savedThemes.value.splice(idx, 1);
  }

  function importCss(css: string) {
    const imported = fromCss(css);
    tokens.value = { ...tokens.value, ...imported } as TokenSet;
    activeThemeName.value = null;
  }

  return {
    tokens,
    savedThemes,
    activeThemeName,
    tokensCss,
    validationIssues,
    hasErrors,
    setToken,
    applyTheme,
    saveTheme,
    deleteTheme,
    importCss,
  };
});
