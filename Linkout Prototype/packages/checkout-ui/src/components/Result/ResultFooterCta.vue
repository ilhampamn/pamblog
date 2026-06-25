<script setup lang="ts">
defineProps<{
  cta: { label: string; href: string };
  status: 'success' | 'failed';
}>();
</script>

<template>
  <div class="co-result-footer">
    <a
      :href="cta.href"
      class="co-result-footer__btn"
      :class="`co-result-footer__btn--${status}`"
      @click.prevent
    >
      {{ cta.label }}
    </a>
  </div>
</template>

<style scoped>
.co-result-footer {
  padding: 8px 16px 32px;
}

.co-result-footer__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 50px;
  border-radius: var(--radius-control-full);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-sizing: border-box;
}

.co-result-footer__btn:hover { transform: translateY(-2px); }
.co-result-footer__btn:active { transform: translateY(0); }

/* Success: outlined with primary-color glow */
.co-result-footer__btn--success {
  background: transparent;
  border: 2px solid var(--bg-action-primary);
  color: var(--bg-action-primary);
  box-shadow: 0 0 18px color-mix(in srgb, var(--bg-action-primary) 20%, transparent);
}

.co-result-footer__btn--success:hover {
  box-shadow: 0 0 24px color-mix(in srgb, var(--bg-action-primary) 35%, transparent);
}

/* Failed: filled primary (Try Again) */
.co-result-footer__btn--failed {
  background: var(--bg-action-primary);
  border: none;
  color: var(--text-action-on-primary);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.co-result-footer__btn--failed:hover {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
}

@media (prefers-reduced-motion: reduce) {
  .co-result-footer__btn { transition: none; }
}
</style>
