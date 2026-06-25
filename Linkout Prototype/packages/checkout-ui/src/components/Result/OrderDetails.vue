<script setup lang="ts">
import { computed } from 'vue';
import type { ResultConfig, ProductConfig, RewardsConfig, PaymentsConfig } from '@codapay/config-schema';
import DetailRow from './DetailRow.vue';

const props = defineProps<{
  config: ResultConfig['orderDetails'];
  product: ProductConfig;
  rewards: RewardsConfig;
  payments: PaymentsConfig;
}>();

const originalPriceLabel = computed(() =>
  props.product.originalPrice != null
    ? `${props.product.currency} ${props.product.originalPrice.toFixed(2)}`
    : null
);

const discountedPriceLabel = computed(() =>
  `${props.product.currency} ${props.product.finalPrice.toFixed(2)}`
);

const methodDisplayName = computed(() => {
  const m = props.payments.defaultSelected;
  const MAP: Record<string, string> = {
    saved_visa:  'Visa •••• 3893',
    saved_mc:    'Mastercard •••• 9876',
    google_pay:  'Google Pay',
    apple_pay:   'Apple Pay',
    paypal:      'PayPal',
    cash_app:    'Cash App',
    add_card:    'New Card',
  };
  return MAP[m] ?? m;
});
</script>

<template>
  <div v-if="config.enabled" class="co-order-details">
    <div class="co-order-details__header">Order Details</div>

    <!-- Product card -->
    <div v-if="config.showProductCard" class="co-order-details__product">
      <div class="co-order-details__product-img">
        <img v-if="product.image" :src="product.image" :alt="product.name" />
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
      <div class="co-order-details__product-info">
        <span class="co-order-details__product-name">{{ product.name }}</span>
        <span class="co-order-details__product-price">
          {{ product.currency }} {{ product.finalPrice.toFixed(2) }}
        </span>
      </div>
    </div>

    <!-- Detail rows -->
    <div class="co-order-details__rows">
      <DetailRow
        :label="config.playerNickname.label"
        value="—"
        :visible="config.playerNickname.visible"
      />
      <DetailRow
        :label="config.paymentMethod.label"
        :value="methodDisplayName"
        :visible="config.paymentMethod.visible"
      />
      <DetailRow
        v-if="originalPriceLabel"
        :label="config.originalPrice.label"
        :value="originalPriceLabel"
        :visible="config.originalPrice.visible"
      />
      <DetailRow
        :label="config.discountedPrice.label"
        :value="discountedPriceLabel"
        :visible="config.discountedPrice.visible"
      />
    </div>
  </div>
</template>

<style scoped>
.co-order-details {
  margin: 0 16px 16px;
  background: var(--bg-card-default);
  border: 1px solid var(--border-card-default);
  border-radius: var(--radius-container-m);
  overflow: hidden;
}

.co-order-details__header {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-body-subtle);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 10px 16px;
  background: var(--bg-section-subtle);
  border-bottom: 1px solid var(--border-divider);
}

.co-order-details__product {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-divider);
}

.co-order-details__product-img {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-container-s);
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-section-subtle);
  display: grid;
  place-items: center;
  color: var(--text-body-subtle);
}

.co-order-details__product-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.co-order-details__product-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.co-order-details__product-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-body-default);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.co-order-details__product-price {
  font-size: 12px;
  color: var(--text-body-soft);
}

.co-order-details__rows {
  padding: 0 16px;
}
</style>
