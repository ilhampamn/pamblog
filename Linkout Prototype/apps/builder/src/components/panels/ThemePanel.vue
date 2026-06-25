<script setup lang="ts">
import { ref, computed } from 'vue';
import { useThemeStore } from '../../stores/theme.ts';
import type { TokenSet } from '@codapay/tokens';

const theme = useThemeStore();

// v-model computed so applyTheme fires reliably (plain @change on :value select has Vue 3 reconciliation issues)
const selectedThemeName = computed({
  get: () => theme.activeThemeName ?? '',
  set: (name: string) => { if (name) theme.applyTheme(name); },
});

type InputMode = 'manual' | 'upload' | 'generate';
const inputMode = ref<InputMode>('manual');
const newThemeName = ref('');
const cssImport = ref('');
const generatePrimary = ref('#1B7EC5');

function saveAs() {
  if (newThemeName.value.trim()) {
    theme.saveTheme(newThemeName.value.trim());
    newThemeName.value = '';
  }
}

function importCss() {
  theme.importCss(cssImport.value);
  cssImport.value = '';
}

function generate() {
  theme.setToken('--bg-action-primary', generatePrimary.value);
  theme.setToken('--border-action-default', generatePrimary.value);
  theme.setToken('--border-input-focused', generatePrimary.value);
  theme.setToken('--text-hyperlink-inverse', generatePrimary.value);
}

type TokenGroup = {
  label: string;
  tokens: Array<keyof TokenSet>;
};

const TOKEN_GROUPS: TokenGroup[] = [
  {
    label: 'Brand',
    tokens: ['--bg-action-primary', '--bg-card-selected', '--border-input-focused'],
  },
  {
    label: 'Surfaces',
    tokens: ['--bg-navbar', '--bg-card-default', '--bg-input-default', '--bg-section-subtle'],
  },
  {
    label: 'Actions',
    tokens: ['--bg-action-secondary', '--bg-action-destructive'],
  },
  {
    label: 'Text',
    tokens: ['--text-header-default', '--text-body-default', '--text-body-soft', '--text-body-subtle', '--text-placeholder', '--text-body-inverse'],
  },
  {
    label: 'Borders',
    tokens: ['--border-card-default', '--border-input-default', '--border-navbar', '--border-divider'],
  },
];

const FROZEN_KEYS = new Set([
  '--pad-surface-xs', '--pad-surface-s', '--pad-surface-m', '--pad-surface-l', '--pad-surface-xl',
  '--gap-content-narrow', '--gap-content-default', '--gap-content-loose', '--gap-content-separation', '--gap-section-separation',
  '--size-icon-s', '--size-icon-l', '--border-weight-default', '--border-weight-action', '--border-weight-selected',
]);
</script>

<template>
  <div class="panel">
    <!-- Mode switch -->
    <div class="panel__section">
      <div class="mode-tabs" role="tablist">
        <button
          v-for="m in (['manual', 'upload', 'generate'] as InputMode[])"
          :key="m"
          role="tab"
          :aria-selected="inputMode === m"
          class="mode-tab"
          :class="{ 'mode-tab--active': inputMode === m }"
          @click="inputMode = m"
        >
          {{ m === 'manual' ? 'Manual' : m === 'upload' ? 'Upload CSS' : 'Generate' }}
        </button>
      </div>
    </div>

    <!-- Saved themes -->
    <div class="panel__section">
      <h4 class="panel__section-title">Saved Themes</h4>
      <div class="field-row">
        <select
          v-model="selectedThemeName"
          class="field__select"
        >
          <option value="" disabled>Select a theme…</option>
          <option v-for="t in theme.savedThemes" :key="t.name" :value="t.name">
            {{ t.name }}{{ t.isPreset ? ' (preset)' : '' }}
          </option>
        </select>
        <button
          class="btn btn--secondary"
          title="Delete theme"
          :disabled="!theme.activeThemeName || !!theme.savedThemes.find(t => t.name === theme.activeThemeName)?.isPreset"
          @click="theme.activeThemeName && theme.deleteTheme(theme.activeThemeName)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
        </button>
      </div>

      <div class="field-row">
        <input
          v-model="newThemeName"
          class="field__input"
          type="text"
          placeholder="Save as…"
          @keydown.enter="saveAs"
        />
        <button class="btn btn--primary" :disabled="!newThemeName.trim()" @click="saveAs">
          Save
        </button>
      </div>
    </div>

    <!-- Upload CSS mode -->
    <div v-if="inputMode === 'upload'" class="panel__section">
      <h4 class="panel__section-title">Paste Token CSS</h4>
      <textarea
        v-model="cssImport"
        class="field__textarea"
        rows="6"
        placeholder=":root { --bg-action-primary: #ff6600; … }"
      />
      <button class="btn btn--primary" :disabled="!cssImport.trim()" @click="importCss">
        Apply CSS
      </button>
    </div>

    <!-- Generate mode -->
    <div v-else-if="inputMode === 'generate'" class="panel__section">
      <h4 class="panel__section-title">Generate from Primary Color</h4>
      <div class="field">
        <label class="field__label">Brand primary color</label>
        <div class="color-field">
          <div class="color-field__swatch">
            <input
              type="color"
              :value="generatePrimary"
              @input="generatePrimary = ($event.target as HTMLInputElement).value"
            />
          </div>
          <input
            class="color-field__hex"
            type="text"
            :value="generatePrimary"
            maxlength="7"
            @input="generatePrimary = ($event.target as HTMLInputElement).value"
          />
        </div>
      </div>
      <button class="btn btn--primary" @click="generate">Generate Theme</button>
    </div>

    <!-- Manual token groups -->
    <template v-else>
      <div v-for="group in TOKEN_GROUPS" :key="group.label" class="panel__section">
        <h4 class="panel__section-title">{{ group.label }}</h4>
        <div
          v-for="tokenKey in group.tokens"
          :key="tokenKey"
          class="field"
        >
          <label class="field__label">{{ tokenKey }}</label>
          <div class="color-field">
            <div class="color-field__swatch">
              <input
                type="color"
                :value="(theme.tokens[tokenKey] ?? '#ffffff').slice(0, 7)"
                @input="theme.setToken(tokenKey, ($event.target as HTMLInputElement).value)"
              />
            </div>
            <input
              class="color-field__hex"
              type="text"
              :value="theme.tokens[tokenKey]"
              @input="theme.setToken(tokenKey, ($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>
    </template>

    <!-- Validation issues -->
    <div v-if="theme.validationIssues.length > 0" class="panel__section">
      <h4 class="panel__section-title">Validation</h4>
      <div
        v-for="issue in theme.validationIssues"
        :key="issue.token + issue.rule"
        class="info-banner"
        :class="issue.severity === 'error' ? 'info-banner--error' : 'info-banner--warning'"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" flex-shrink="0">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <span>{{ issue.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped src="./panel-shared.css" />
<style scoped>
.mode-tabs {
  display: flex;
  background: var(--coda-surface-bg);
  border-radius: var(--coda-radius-m);
  padding: 3px;
  gap: 2px;
}

.mode-tab {
  flex: 1;
  background: none;
  border: none;
  padding: 5px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--coda-text-muted);
  border-radius: calc(var(--coda-radius-m) - 2px);
  transition: all 0.15s ease;
}

.mode-tab--active {
  background: var(--coda-surface-panel);
  color: var(--coda-text-primary);
  box-shadow: var(--coda-shadow-panel);
}

.field-row {
  display: flex;
  gap: var(--coda-sp-8);
  align-items: stretch;
}

.field-row .field__select,
.field-row .field__input { flex: 1; }

.btn {
  padding: 6px 12px;
  border-radius: var(--coda-radius-s);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: var(--coda-sp-4);
  flex-shrink: 0;
}

.btn--primary { background: var(--coda-primary); color: white; }
.btn--primary:hover:not(:disabled) { background: #0d22d4; }
.btn--secondary { background: var(--coda-surface-bg); color: var(--coda-text-secondary); border-color: var(--coda-surface-border); }
.btn--secondary:hover:not(:disabled) { background: var(--coda-hover); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }

.field__textarea {
  background: var(--coda-surface-bg);
  border: 1px solid var(--coda-surface-border);
  border-radius: var(--coda-radius-s);
  padding: var(--coda-sp-8) var(--coda-sp-12);
  font-size: 12px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--coda-text-primary);
  resize: vertical;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.field__textarea:focus { border-color: var(--coda-primary); }
</style>
