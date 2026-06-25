<script setup lang="ts">
defineProps<{ status: 'success' | 'failed' }>();
</script>

<template>
  <div class="co-emblem" :class="`co-emblem--${status}`" aria-hidden="true">
    <svg
      v-if="status === 'success'"
      width="28" height="28" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
    >
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <svg
      v-else
      width="24" height="24" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>
</template>

<style scoped>
@keyframes co-emblem-in {
  from { transform: scale(0.6); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

.co-emblem {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  animation: co-emblem-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.co-emblem--success {
  background: color-mix(in srgb, var(--status-success) 15%, transparent);
  color: var(--status-success);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--status-success) 8%, transparent);
}

.co-emblem--failed {
  background: color-mix(in srgb, var(--status-error) 15%, transparent);
  color: var(--status-error);
  box-shadow: 0 0 0 8px color-mix(in srgb, var(--status-error) 8%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .co-emblem { animation: none; }
}
</style>
