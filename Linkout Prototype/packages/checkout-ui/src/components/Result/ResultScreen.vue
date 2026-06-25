<script setup lang="ts">
import { computed } from 'vue';
import type { ResultConfig, ProductConfig, RewardsConfig, PaymentsConfig } from '@codapay/config-schema';
import ResultNavbar from './ResultNavbar.vue';
import ResultHero from './ResultHero.vue';
import ErrorDetail from './ErrorDetail.vue';
import RewardCard from './RewardCard.vue';
import OrderDetails from './OrderDetails.vue';
import ResultFooterCta from './ResultFooterCta.vue';

const props = defineProps<{
  config: ResultConfig;
  product: ProductConfig;
  rewards: RewardsConfig;
  payments: PaymentsConfig;
  status: 'success' | 'failed';
}>();

const variant = computed(() => props.config.variants[props.status]);
</script>

<template>
  <div class="co-result">
    <ResultNavbar :config="config.navbar" />

    <div class="co-result__scroll">
      <ResultHero :hero="variant.hero" :status="status" />

      <!-- Failure reason block — only when status is failed and reason text is set -->
      <ErrorDetail
        v-if="status === 'failed' && variant.reason"
        :reason="variant.reason"
      />

      <!-- Reward card — only on success -->
      <RewardCard
        v-if="status === 'success' && variant.rewardCard"
        :config="variant.rewardCard"
      />

      <OrderDetails
        :config="config.orderDetails"
        :product="product"
        :rewards="rewards"
        :payments="payments"
      />

      <ResultFooterCta :cta="variant.primaryCta" :status="status" />
    </div>
  </div>
</template>

<style scoped>
.co-result {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.co-result__scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: var(--bg-page);
}

.co-result__scroll::-webkit-scrollbar { display: none; }
</style>
