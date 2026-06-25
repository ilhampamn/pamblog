<script setup lang="ts">
defineProps<{
  reason: { visible: boolean; text: string };
}>();
</script>

<template>
  <div v-if="reason.visible && reason.text" class="co-error-detail">
    <svg
      class="co-error-detail__icon"
      width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <span>{{ reason.text }}</span>
  </div>
</template>

<style scoped>
.co-error-detail {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 16px 16px;
  padding: 12px;
  background: color-mix(in srgb, var(--status-error) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--status-error) 30%, transparent);
  border-radius: var(--radius-container-s);
  color: var(--status-error);
  font-size: 13px;
  line-height: 1.45;
}

.co-error-detail__icon {
  flex-shrink: 0;
  margin-top: 1px;
}
</style>
