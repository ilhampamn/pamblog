<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  logoKey: string;
  size?: number;
}>();

// Build a lookup map of all available logos at build time (Vite-native pattern)
const svgLogos = import.meta.glob('../../assets/logos/*.svg', { eager: true, import: 'default', query: '?url' }) as Record<string, string>;
const pngLogos = import.meta.glob('../../assets/logos/*.png', { eager: true, import: 'default', query: '?url' }) as Record<string, string>;

const logoSrc = computed(() => {
  const svgKey = `../../assets/logos/${props.logoKey}.svg`;
  const pngKey = `../../assets/logos/${props.logoKey}.png`;
  return svgLogos[svgKey] ?? pngLogos[pngKey] ?? null;
});
</script>

<template>
  <img
    v-if="logoSrc"
    :src="logoSrc"
    :alt="logoKey"
    class="network-logo"
    :style="{ height: `${size ?? 20}px` }"
  />
  <span v-else class="network-logo network-logo--fallback" :style="{ height: `${size ?? 20}px` }">
    {{ logoKey.charAt(0).toUpperCase() }}
  </span>
</template>

<style scoped>
.network-logo {
  object-fit: contain;
  display: inline-block;
}

.network-logo--fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-card-subtle);
  color: var(--text-body-subtle);
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  width: 28px;
  aspect-ratio: 1;
}
</style>
