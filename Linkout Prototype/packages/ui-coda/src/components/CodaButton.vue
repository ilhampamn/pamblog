<script setup lang="ts">
/**
 * Coda Button — coda-payments-design / Components 2.0.
 * Renders the real `.btn` classes from tokens.css. No raw values.
 */
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'critical' | 'link';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  { variant: 'primary', size: 'md', disabled: false, type: 'button' },
);
</script>

<template>
  <button
    class="btn"
    :class="[`btn-${size}`, `btn-${variant}`]"
    :type="type"
    :disabled="disabled"
  >
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>
