<script setup lang="ts">
import type { ResultConfig } from '@codapay/config-schema';

type RewardCardConfig = NonNullable<ResultConfig['variants']['success']['rewardCard']>;
defineProps<{ config: RewardCardConfig }>();
</script>

<template>
  <div v-if="config.enabled" class="co-reward-card">
    <!-- gradient border via ::before mask -->
    <div class="co-reward-card__image-wrap">
      <img
        v-if="config.imageSrc"
        :src="config.imageSrc"
        :alt="config.title"
      />
      <div v-else class="co-reward-card__placeholder" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
    </div>
    <div class="co-reward-card__body">
      <span class="co-reward-card__eyebrow">Reward Unlocked</span>
      <span class="co-reward-card__title">{{ config.title }}</span>
      <p class="co-reward-card__text">{{ config.body }}</p>
      <a :href="config.ctaHref" class="co-reward-card__cta" @click.prevent>
        {{ config.ctaLabel }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.co-reward-card {
  margin: 0 16px 16px;
  background: var(--bg-card-default);
  border: 1px solid var(--border-card-default);
  border-radius: var(--radius-container-m);
  overflow: hidden;
  position: relative;
}

/* Success-tinted gradient border overlay */
.co-reward-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--status-success) 70%, transparent),
    color-mix(in srgb, var(--status-success) 20%, transparent)
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.co-reward-card__image-wrap {
  width: 100%;
  height: 110px;
  background: color-mix(in srgb, var(--status-success) 6%, var(--bg-section-subtle));
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.co-reward-card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.co-reward-card__placeholder {
  color: color-mix(in srgb, var(--status-success) 50%, transparent);
}

.co-reward-card__body {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.co-reward-card__eyebrow {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--status-success);
}

.co-reward-card__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-header-default);
  line-height: 1.25;
}

.co-reward-card__text {
  font-size: 13px;
  color: var(--text-body-soft);
  margin: 4px 0 10px;
  line-height: 1.5;
}

.co-reward-card__cta {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  border-radius: var(--radius-control-full);
  background: var(--bg-action-primary);
  color: var(--text-action-on-primary);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
