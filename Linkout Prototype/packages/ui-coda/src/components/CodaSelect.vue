<script setup lang="ts">
/**
 * Coda Select — native <select> styled with the real `.input-field` class
 * plus a chevron affordance. Options passed via the default slot (<option>).
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    label?: string;
    id?: string;
    disabled?: boolean;
    block?: boolean;
  }>(),
  { block: true, disabled: false },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const autoId = computed(
  () => props.id ?? `coda-select-${Math.random().toString(36).slice(2, 9)}`,
);
</script>

<template>
  <div class="input-wrapper" :style="block ? { width: '100%' } : undefined">
    <label v-if="label" class="input-label" :for="autoId">{{ label }}</label>
    <div class="coda-select">
      <select
        :id="autoId"
        class="input-field coda-select__field"
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <slot />
      </select>
      <svg class="coda-select__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.coda-select {
  position: relative;
  width: 100%;
}
.coda-select__field {
  width: 100%;
  appearance: none;
  -webkit-appearance: none;
  padding-right: var(--spacing-xl);
  cursor: pointer;
}
.coda-select__chevron {
  position: absolute;
  top: 50%;
  right: var(--spacing-sm);
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--color-icon-primary-lightest);
}
</style>
