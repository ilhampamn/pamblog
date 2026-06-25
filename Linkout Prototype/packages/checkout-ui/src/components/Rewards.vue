<script setup lang="ts">
import type { RewardsConfig } from '@codapay/config-schema';

defineProps<{ config: RewardsConfig }>();
</script>

<template>
  <div v-if="config.enabled && config.amount > 0" class="rewards" aria-label="Rewards">
    <div class="rewards__inner">
      <span class="rewards__label">{{ config.label }}</span>
      <span class="rewards__coin" aria-hidden="true">
        <img v-if="config.icon" :src="config.icon" :alt="config.label" class="rewards__icon" />
        <svg v-else class="rewards__icon-default" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" fill="currentColor" opacity="0.15"/>
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
          <path d="M12 7v10M9 9.5c0-1.1.9-2 2-2h2a2 2 0 0 1 0 4h-2a2 2 0 0 1 0 4h2a2 2 0 0 0 2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="rewards__amount">{{ config.amount }}</span>
    </div>
  </div>
</template>

<style scoped>
.rewards {
  background: var(--bg-card-default);
  border-bottom: var(--border-weight-default) solid var(--border-divider);
  padding: var(--pad-surface-s) var(--pad-surface-l);
}

.rewards__inner {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--gap-content-narrow);
}

.rewards__label {
  font-size: 13px;
  color: var(--text-body-soft);
}

.rewards__coin {
  display: flex;
  align-items: center;
  color: var(--bg-action-primary);
}

.rewards__icon {
  width: var(--size-icon-s);
  height: var(--size-icon-s);
  object-fit: contain;
}

.rewards__icon-default {
  color: var(--bg-action-primary);
}

.rewards__amount {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-body-default);
}
</style>
