<script setup lang="ts">
/**
 * Coda Toggle — coda-payments-design / Components 2.0.
 * Track uses the real `.toggle` sizing/colors from tokens.css; the knob is
 * drawn here (the spec only styles the track). Off = control-disabled,
 * on = neutral charcoal.
 */
withDefaults(
  defineProps<{
    modelValue?: boolean;
    size?: 'md' | 'lg';
    disabled?: boolean;
    label?: string;
  }>(),
  { size: 'md', disabled: false, modelValue: false },
);

defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <button
    class="toggle coda-toggle"
    :class="[`toggle-${size}`, `coda-toggle--${size}`, { 'coda-toggle--on': modelValue }]"
    role="switch"
    :aria-checked="modelValue"
    :aria-label="label"
    :disabled="disabled"
    type="button"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span class="coda-toggle__knob" aria-hidden="true" />
  </button>
</template>

<style scoped>
.coda-toggle {
  border: none;
  padding: 0;
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}
.coda-toggle__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  border-radius: var(--border-radius-full);
  background: var(--color-white-0);
  box-shadow: var(--shadow-sm);
  transition: transform 150ms ease;
}
.coda-toggle { position: relative; }
.coda-toggle--md .coda-toggle__knob { width: 12px; height: 12px; }
.coda-toggle--lg .coda-toggle__knob { width: 16px; height: 16px; }
.coda-toggle--md.coda-toggle--on .coda-toggle__knob { transform: translateX(16px); }
.coda-toggle--lg.coda-toggle--on .coda-toggle__knob { transform: translateX(20px); }
.coda-toggle--on { background: var(--color-background-neutral); }
.coda-toggle:disabled { cursor: not-allowed; opacity: 0.5; }
</style>
