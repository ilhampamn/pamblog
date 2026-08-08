<script setup lang="ts">
import { useConfigStore } from '../../stores/config.ts';
import { useThemeStore } from '../../stores/theme.ts';
import { CodaButton, CodaIconButton } from '@codapay/ui-coda';

const config = useConfigStore();
const theme = useThemeStore();

const emit = defineEmits<{
  reset: [];
  export: [];
  modeChange: [mode: 'edit' | 'preview'];
  kitchenSink: [];
}>();

defineProps<{ mode: 'edit' | 'preview' }>();
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <div class="topbar__logo">
        <svg class="topbar__logo-mark" width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect class="mark-bg" width="32" height="32" rx="8" />
          <path class="mark-fg" d="M8 10h10a6 6 0 0 1 0 12H8V10z" opacity="0.9" />
          <circle class="mark-fg" cx="22" cy="22" r="4" opacity="0.6" />
        </svg>
        <span class="topbar__wordmark">Checkout Builder</span>
      </div>
    </div>

    <div class="topbar__center">
      <div class="topbar__mode-switch" role="tablist" aria-label="Builder mode">
        <button
          role="tab"
          :aria-selected="mode === 'edit'"
          class="topbar__tab"
          :class="{ 'topbar__tab--active': mode === 'edit' }"
          @click="emit('modeChange', 'edit')"
        >
          Edit
        </button>
        <button
          role="tab"
          :aria-selected="mode === 'preview'"
          class="topbar__tab"
          :class="{ 'topbar__tab--active': mode === 'preview' }"
          @click="emit('modeChange', 'preview')"
        >
          Preview
        </button>
      </div>
    </div>

    <div class="topbar__right">
      <span v-if="config.isDirty" class="topbar__dirty-badge" aria-label="Unsaved changes">●</span>

      <CodaIconButton size="md" label="Undo (⌘Z)" :disabled="!config.canUndo" @click="config.undo()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 7v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 13c1.5-4.5 6-7.5 10.5-7.5A9 9 0 0 1 21 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </CodaIconButton>

      <CodaIconButton size="md" label="Redo (⌘⇧Z)" :disabled="!config.canRedo" @click="config.redo()">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 7v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 13c-1.5-4.5-6-7.5-10.5-7.5A9 9 0 0 0 3 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </CodaIconButton>

      <CodaButton variant="secondary" size="md" @click="emit('reset')">Reset</CodaButton>

      <CodaButton variant="secondary" size="md" @click="emit('kitchenSink')">Kitchen Sink</CodaButton>

      <CodaButton
        variant="primary"
        size="md"
        :disabled="theme.hasErrors"
        :title="theme.hasErrors ? 'Fix validation errors before exporting' : 'Export config'"
        @click="emit('export')"
      >
        Export
      </CodaButton>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--spacing-5xl); /* 64px */
  padding: 0 var(--spacing-lg);
  background: var(--color-background-primary);
  border-bottom: 1px solid var(--color-border-primary);
  flex-shrink: 0;
  gap: var(--spacing-md);
}

.topbar__left, .topbar__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 200px;
}

.topbar__right { justify-content: flex-end; }

.topbar__center { flex: 1; display: flex; justify-content: center; }

.topbar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.topbar__logo-mark { color: var(--color-text-primary); }
.topbar__logo-mark .mark-bg { fill: currentColor; }
.topbar__logo-mark .mark-fg { fill: var(--color-background-primary); }

.topbar__wordmark {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.topbar__mode-switch {
  display: flex;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-2xs);
  gap: var(--spacing-2xs);
}

.topbar__tab {
  background: none;
  border: none;
  padding: var(--spacing-xs) var(--spacing-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--font-letter-spacing-wider);
  color: var(--color-text-primary-lightest);
  border-radius: var(--border-radius-xs);
  transition: all 0.15s ease;
}

.topbar__tab--active {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-sm);
}

.topbar__dirty-badge {
  color: var(--color-text-link);
  font-size: var(--font-size-xs);
}
</style>
