<script setup lang="ts">
import { useConfigStore } from '../../stores/config.ts';
import { useThemeStore } from '../../stores/theme.ts';

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
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#102AF8"/>
          <path d="M8 10h10a6 6 0 0 1 0 12H8V10z" fill="white" opacity="0.9"/>
          <circle cx="22" cy="22" r="4" fill="white" opacity="0.6"/>
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

      <button
        class="topbar__btn topbar__btn--secondary"
        :disabled="!config.canUndo"
        aria-label="Undo"
        title="Undo (⌘Z)"
        @click="config.undo()"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 7v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 13c1.5-4.5 6-7.5 10.5-7.5A9 9 0 0 1 21 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <button
        class="topbar__btn topbar__btn--secondary"
        :disabled="!config.canRedo"
        aria-label="Redo"
        title="Redo (⌘⇧Z)"
        @click="config.redo()"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M21 7v6h-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 13c-1.5-4.5-6-7.5-10.5-7.5A9 9 0 0 0 3 14.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <button
        class="topbar__btn topbar__btn--secondary"
        title="Reset to defaults"
        @click="emit('reset')"
      >
        Reset
      </button>

      <button
        class="topbar__btn topbar__btn--primary"
        :disabled="theme.hasErrors"
        :title="theme.hasErrors ? 'Fix validation errors before exporting' : 'Export config'"
        @click="emit('export')"
      >
        Export
      </button>

      <button
        class="topbar__btn topbar__btn--secondary"
        title="Component kitchen sink"
        @click="emit('kitchenSink')"
      >
        Kitchen Sink
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--coda-sp-16);
  background: var(--coda-surface-panel);
  border-bottom: 1px solid var(--coda-surface-border);
  flex-shrink: 0;
  gap: var(--coda-sp-12);
}

.topbar__left, .topbar__right {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
  min-width: 200px;
}

.topbar__right { justify-content: flex-end; }

.topbar__center { flex: 1; display: flex; justify-content: center; }

.topbar__logo {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
}

.topbar__wordmark {
  font-size: 14px;
  font-weight: 600;
  color: var(--coda-text-primary);
}

.topbar__mode-switch {
  display: flex;
  background: var(--coda-surface-bg);
  border-radius: var(--coda-radius-m);
  padding: 3px;
  gap: 2px;
}

.topbar__tab {
  background: none;
  border: none;
  padding: 5px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--coda-text-muted);
  border-radius: calc(var(--coda-radius-m) - 2px);
  transition: all 0.15s ease;
}

.topbar__tab--active {
  background: var(--coda-surface-panel);
  color: var(--coda-text-primary);
  box-shadow: var(--coda-shadow-panel);
}

.topbar__btn {
  padding: 6px 14px;
  border-radius: var(--coda-radius-s);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: var(--coda-sp-4);
}

.topbar__btn--primary {
  background: var(--coda-primary);
  color: var(--coda-text-inverse);
}

.topbar__btn--primary:hover:not(:disabled) {
  background: #0d22d4;
}

.topbar__btn--secondary {
  background: none;
  color: var(--coda-text-secondary);
  border-color: var(--coda-surface-border);
}

.topbar__btn--secondary:hover:not(:disabled) {
  background: var(--coda-hover);
  color: var(--coda-text-primary);
}

.topbar__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.topbar__dirty-badge {
  color: var(--coda-primary);
  font-size: 10px;
}
</style>
