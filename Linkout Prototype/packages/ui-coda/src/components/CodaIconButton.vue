<script setup lang="ts">
/**
 * Coda Icon Button — coda-payments-design / Components 2.0.
 * Square, transparent, icon-only. Renders the real `.btn-icon` classes.
 */
withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    label: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  { size: 'md', disabled: false, type: 'button' },
);
</script>

<template>
  <button
    class="btn-icon"
    :class="`btn-icon-${size}`"
    :type="type"
    :disabled="disabled"
    :aria-label="label"
    :title="label"
  >
    <slot />
  </button>
</template>
