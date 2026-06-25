<script setup lang="ts">
import type { LoadingConfig } from '@codapay/config-schema';
import DotsLoader from './DotsLoader.vue';

defineProps<{ config: LoadingConfig }>();
</script>

<template>
  <div class="co-overlay" role="alertdialog" aria-label="Processing payment" aria-busy="true">
    <div class="co-overlay-card">
      <img
        v-if="config.loaderType === 'image' && config.customAsset"
        :src="config.customAsset.src"
        class="co-overlay-asset"
        alt="Loading"
      />
      <DotsLoader v-else />
    </div>
  </div>
</template>

<style scoped>
@keyframes co-overlay-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes co-card-in {
  from { transform: scale(0.82); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

.co-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  animation: co-overlay-in 0.2s ease;
}

.co-overlay-card {
  width: 88px;
  height: 88px;
  background: var(--bg-loading-card);
  border-radius: var(--radius-container-m);
  display: grid;
  place-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  animation: co-card-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.co-overlay-asset {
  max-width: 64px;
  max-height: 64px;
  object-fit: contain;
}

@media (prefers-reduced-motion: reduce) {
  .co-overlay, .co-overlay-card { animation: none; }
}
</style>
