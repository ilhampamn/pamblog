<script setup lang="ts">
defineProps<{ selected: boolean }>();
</script>

<template>
  <span class="radio-dot" :class="{ 'radio-dot--selected': selected }" aria-hidden="true">
    <span v-if="selected" class="radio-dot__inner" />
  </span>
</template>

<style scoped>
.radio-dot {
  width: 20px;
  height: 20px;
  border-radius: var(--border-radius-full);
  border: var(--border-weight-selected) solid var(--border-input-default);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s ease;
}

.radio-dot--selected {
  border-color: var(--bg-action-primary);
  background: var(--bg-action-primary);
}

.radio-dot__inner {
  width: 8px;
  height: 8px;
  border-radius: var(--border-radius-full);
  background: var(--text-body-inverse);
}
</style>
