<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProductConfig, RewardsConfig } from '@codapay/config-schema';

const props = defineProps<{
  config: ProductConfig;
  rewards: RewardsConfig;
}>();

const detailOpen = ref(false);

const discountBadge = computed(() => {
  if (!props.config.originalPrice || props.config.originalPrice <= props.config.finalPrice) return null;
  if (props.config.discountLabel !== 'auto') return props.config.discountLabel;
  const pct = Math.round((1 - props.config.finalPrice / props.config.originalPrice) * 100);
  return `${pct}% OFF`;
});

const discount = computed(() => {
  if (!props.config.originalPrice || props.config.originalPrice <= props.config.finalPrice) return null;
  return props.config.originalPrice - props.config.finalPrice;
});
</script>

<template>
  <div class="co-banner" :class="{ 'detail-open': detailOpen }" @click="detailOpen = !detailOpen">
    <img v-if="config.image" class="co-thumb" :src="config.image" :alt="config.name" />
    <span v-else class="co-thumb"></span>

    <div class="co-info">
      <div class="co-sku">{{ config.name }}</div>
      <div class="co-pricerow">
        <span class="co-price">
          <span class="cur">{{ config.currency }}</span>
          {{ config.finalPrice.toFixed(2) }}
        </span>
        <span v-if="config.originalPrice && config.originalPrice > config.finalPrice" class="co-orig">
          {{ config.currency }} {{ config.originalPrice.toFixed(2) }}
        </span>
        <span v-if="discountBadge" class="co-badge">{{ discountBadge }}</span>
      </div>
      <span v-if="config.taxIncluded" class="co-tax">Tax included</span>
    </div>

    <div class="co-right">
      <span class="co-chev">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </span>
      <span v-if="rewards.enabled && rewards.amount > 0" class="co-earn">
        <span class="co-coin">
          <img v-if="rewards.icon" :src="rewards.icon" />
          <template v-else>⊙</template>
        </span>
        {{ rewards.label }} {{ rewards.amount }}
      </span>
    </div>
  </div>

  <div class="co-banner-detail" :class="{ open: detailOpen }">
    <div class="co-bd-inner">
      <template v-if="discount">
        <div class="co-kv">
          <span>Item price</span>
          <span>{{ config.currency }} {{ config.originalPrice!.toFixed(2) }}</span>
        </div>
        <div class="co-kv">
          <span>Discount</span>
          <span>– {{ config.currency }} {{ discount.toFixed(2) }}</span>
        </div>
      </template>
      <div class="co-kv">
        <span>Tax</span>
        <span>{{ config.taxIncluded ? 'Included' : '—' }}</span>
      </div>
      <div class="co-kv co-kv-total">
        <span>Total</span>
        <span>{{ config.currency }} {{ config.finalPrice.toFixed(2) }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.co-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--ov-banner-bg, var(--bg-card-default));
  border-bottom: 1px solid var(--ov-banner-border-color, var(--border-divider));
  cursor: pointer;
  user-select: none;
}

.co-thumb {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-container-s);
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid var(--border-card-default);
  background: var(--bg-card-subtle);
  display: block;
}

.co-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.co-sku {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-header-default);
  line-height: 1.2;
}

.co-pricerow {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.co-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-header-default);
}

.co-price .cur {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-body-soft);
}

.co-orig {
  font-size: 10px;
  color: var(--text-body-subtle);
  text-decoration: line-through;
}

.co-badge {
  font-size: 9px;
  font-weight: 700;
  background: var(--bg-action-primary);
  color: var(--text-action-on-primary, #06222B);
  padding: 2px 6px;
  border-radius: var(--radius-control-full);
}

.co-tax {
  font-size: 10px;
  color: var(--text-body-subtle);
}

.co-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;
  flex-shrink: 0;
}

.co-chev {
  color: var(--text-body-soft);
  transition: transform .25s ease;
  display: grid;
  place-items: center;
}

.co-banner.detail-open .co-chev { transform: rotate(180deg); }

.co-earn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-body-soft);
  white-space: nowrap;
}

.co-coin {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #F5A623;
  display: grid;
  place-items: center;
  font-size: 9px;
  font-weight: 800;
  color: #5a3a00;
  overflow: hidden;
  flex-shrink: 0;
}
.co-coin img { width: 100%; height: 100%; object-fit: cover; }

.co-banner-detail {
  overflow: hidden;
  max-height: 0;
  background: var(--bg-section-subtle);
  transition: max-height .3s ease;
  border-bottom: 1px solid var(--border-divider);
}
.co-banner-detail.open { max-height: 160px; }

.co-bd-inner {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.co-kv {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-body-subtle);
}
.co-kv span:last-child { color: var(--text-body-default); }

.co-kv-total {
  font-weight: 600;
  color: var(--text-body-default);
  padding-top: 6px;
  border-top: 1px solid var(--border-divider);
}
.co-kv-total span:first-child { color: var(--text-body-default); }
</style>
