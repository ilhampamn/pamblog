<script setup lang="ts">
import StatusEmblem from './StatusEmblem.vue';

defineProps<{
  hero: { title: string; subtitle: string };
  status: 'success' | 'failed';
}>();
</script>

<template>
  <div class="co-result-hero">
    <StatusEmblem :status="status" />
    <h1 class="co-result-hero__title">{{ hero.title }}</h1>
    <p class="co-result-hero__subtitle">{{ hero.subtitle }}</p>
  </div>
</template>

<style scoped>
.co-result-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 36px 24px 20px;
  text-align: center;
}

.co-result-hero__title {
  font-size: 20px;
  font-weight: 800;
  color: var(--text-header-default);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.co-result-hero__subtitle {
  font-size: 13px;
  color: var(--text-body-soft);
  margin: 0;
  line-height: 1.55;
  max-width: 260px;
}
</style>
