<script setup lang="ts">
import { computed, ref } from 'vue';
import { useConfigStore } from '../../stores/config.ts';
import type { MethodId } from '@codapay/config-schema';
import { METHOD_IDS } from '@codapay/config-schema';

const store = useConfigStore();
const cfg = computed(() => store.config.payments);

function update(patch: Partial<typeof cfg.value>) {
  store.updateSection('payments', patch);
}

const METHOD_LABELS: Record<MethodId, string> = {
  saved_visa: 'Visa •••• 3893',
  saved_mc: 'Mastercard •••• 9876',
  add_card: 'Add a new card',
  google_pay: 'Google Pay',
  apple_pay: 'Apple Pay',
  paypal: 'PayPal',
  cash_app: 'Cash App',
};

const METHOD_LOGOS: Partial<Record<MethodId, string>> = {
  saved_visa: 'visa',
  saved_mc: 'mastercard',
  google_pay: 'google-pay',
  apple_pay: 'apple-pay',
};

function toggleVisible(id: MethodId) {
  update({
    visible: { ...cfg.value.visible, [id]: !cfg.value.visible[id] },
  });
}

function setDefault(id: MethodId) {
  update({ defaultSelected: id });
}

// Drag-to-reorder
const draggingId = ref<MethodId | null>(null);

function onDragStart(id: MethodId) {
  draggingId.value = id;
}

function onDrop(targetId: MethodId) {
  if (!draggingId.value || draggingId.value === targetId) return;
  const order = [...cfg.value.order];
  const fromIdx = order.indexOf(draggingId.value);
  const toIdx = order.indexOf(targetId);
  order.splice(fromIdx, 1);
  order.splice(toIdx, 0, draggingId.value);
  update({ order });
  draggingId.value = null;
}
</script>

<template>
  <div class="panel">
    <div class="panel__section">
      <h4 class="panel__section-title">Method Order & Visibility</h4>
      <p class="panel__hint">Drag rows to reorder. Toggle to show/hide. Radio = default selected.</p>

      <ul class="method-list">
        <li
          v-for="id in cfg.order"
          :key="id"
          class="method-row"
          :class="{ 'method-row--hidden': !cfg.visible[id] }"
          draggable="true"
          @dragstart="onDragStart(id)"
          @dragover.prevent
          @drop="onDrop(id)"
        >
          <span class="method-row__drag" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="9" cy="6" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="9" cy="18" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="12" r="1.5" fill="currentColor"/>
              <circle cx="15" cy="18" r="1.5" fill="currentColor"/>
            </svg>
          </span>

          <span class="method-row__name">{{ METHOD_LABELS[id] }}</span>

          <div class="method-row__actions">
            <!-- Default radio -->
            <button
              class="method-row__radio"
              :class="{ 'method-row__radio--selected': cfg.defaultSelected === id }"
              :aria-label="`Set ${METHOD_LABELS[id]} as default`"
              :title="`Set as default selected`"
              @click="setDefault(id)"
            >
              <span class="method-row__radio-dot" />
            </button>

            <!-- Visibility toggle -->
            <button
              class="toggle toggle--sm"
              :class="{ 'toggle--on': cfg.visible[id] }"
              role="switch"
              :aria-checked="cfg.visible[id]"
              :aria-label="`Show ${METHOD_LABELS[id]}`"
              @click="toggleVisible(id)"
            >
              <span class="toggle__thumb" />
            </button>
          </div>
        </li>
      </ul>

      <p class="panel__hint panel__hint--legend">
        <span class="legend-dot legend-dot--radio"></span> Default selected &nbsp;&nbsp;
        <span class="legend-dot legend-dot--toggle"></span> Visible
      </p>
    </div>

    <div class="panel__section">
      <div class="field field--row">
        <label class="field__label" for="saved-cards-toggle">Show saved cards</label>
        <button
          id="saved-cards-toggle"
          class="toggle"
          :class="{ 'toggle--on': cfg.savedCards }"
          role="switch"
          :aria-checked="cfg.savedCards"
          @click="update({ savedCards: !cfg.savedCards })"
        >
          <span class="toggle__thumb" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./panel-shared.css" />
<style scoped>
.panel__hint {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-lightest);
  margin-top: -4px;
}

.method-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.method-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--color-background-secondary);
  border-radius: var(--border-radius-xs);
  border: 1px solid transparent;
  transition: all 0.12s ease;
  cursor: grab;
}

.method-row:hover { border-color: var(--color-border-primary); }
.method-row:active { cursor: grabbing; }
.method-row--hidden { opacity: 0.4; }

.method-row__drag { color: var(--color-text-primary-lightest); cursor: grab; flex-shrink: 0; }

.method-row__name {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.method-row__actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.method-row__radio {
  width: 18px;
  height: 18px;
  border-radius: var(--border-radius-full);
  border: 1.5px solid var(--color-border-control-primary);
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  padding: 0;
}

.method-row__radio--selected {
  border-color: var(--color-background-control-button-primary-default);
  background: var(--color-background-control-button-primary-default);
}

.method-row__radio-dot {
  width: 7px;
  height: 7px;
  border-radius: var(--border-radius-full);
  background: var(--color-white-0);
  display: block;
}

.toggle--sm {
  width: 28px;
  height: 16px;
}

.toggle--sm .toggle__thumb {
  width: 12px;
  height: 12px;
}

.toggle--sm.toggle--on .toggle__thumb { transform: translateX(12px); }

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: var(--border-radius-full);
  vertical-align: middle;
}

.legend-dot--radio { background: var(--color-background-control-button-primary-default); }
.legend-dot--toggle { background: var(--color-background-neutral); border-radius: var(--border-radius-full); }
</style>
