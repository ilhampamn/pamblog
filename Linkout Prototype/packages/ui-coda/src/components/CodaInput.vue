<script setup lang="ts">
/**
 * Coda Input — coda-payments-design / Components 2.0.
 * Label + field + hint/error, using the real `.input-*` classes.
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue?: string | number | null;
    label?: string;
    hint?: string;
    error?: string;
    placeholder?: string;
    type?: string;
    id?: string;
    disabled?: boolean;
    block?: boolean;
  }>(),
  { type: 'text', block: true, disabled: false },
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const autoId = computed(
  () => props.id ?? `coda-input-${Math.random().toString(36).slice(2, 9)}`,
);
</script>

<template>
  <div class="input-wrapper" :style="block ? { width: '100%' } : undefined">
    <label v-if="label" class="input-label" :for="autoId">{{ label }}</label>
    <input
      :id="autoId"
      class="input-field"
      :class="{ error: !!error }"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :style="block ? { width: '100%' } : undefined"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <span v-if="error" class="input-error-text">{{ error }}</span>
    <span v-else-if="hint" class="input-hint">{{ hint }}</span>
  </div>
</template>
