<script setup lang="ts">
import type { ResultConfig } from '@codapay/config-schema';

defineProps<{ config: ResultConfig['navbar'] }>();
</script>

<template>
  <div class="co-result-navbar">
    <div class="co-result-navbar__brand">
      <img
        v-if="config.logoSrc"
        :src="config.logoSrc"
        class="co-result-navbar__logo"
        :alt="config.storeName"
      />
      <span class="co-result-navbar__name">{{ config.storeName }}</span>
    </div>
    <div v-if="config.showAvatar" class="co-result-navbar__avatar" aria-label="Account">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.co-result-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-navbar);
  border-bottom: 1px solid var(--border-navbar);
  flex-shrink: 0;
}

.co-result-navbar__brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.co-result-navbar__logo {
  height: 24px;
  width: auto;
  object-fit: contain;
}

.co-result-navbar__name {
  font-size: 13px;
  font-weight: 700;
  color: var(--text-header-default);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.co-result-navbar__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--bg-section-subtle);
  display: grid;
  place-items: center;
  color: var(--text-body-subtle);
  flex-shrink: 0;
}
</style>
