<script setup lang="ts">
import { ref } from 'vue';
import type { PaymentsConfig, MethodId } from '@codapay/config-schema';
import SavedCardRow from './SavedCardRow.vue';
import NewCardRow from './NewCardRow.vue';
import ExternalRow from './ExternalRow.vue';

const props = defineProps<{ config: PaymentsConfig }>();

const selected = ref<MethodId>(props.config.defaultSelected);

const SAVED_CARD_META: Record<string, { last4: string; expiry: string; network: string }> = {
  saved_visa:  { last4: '3893', expiry: '12/29', network: 'visa' },
  saved_mc:    { last4: '9876', expiry: '12/29', network: 'mastercard' },
};

const EXTERNAL_META: Record<string, { label: string; logoKey: string; wallet?: boolean; cash?: boolean; darkLogo?: boolean }> = {
  google_pay: { label: 'Google Pay',  logoKey: 'google-pay',  wallet: true },
  // Apple Pay logo is black-on-transparent — needs inversion on dark backgrounds
  apple_pay:  { label: 'Apple Pay',   logoKey: 'apple-pay',   wallet: true, darkLogo: true },
  paypal:     { label: 'PayPal',      logoKey: 'paypal' },
  cash_app:   { label: 'Cash App',    logoKey: 'cash-app',    cash: true },
};

const NEW_CARD_NETWORKS = ['mastercard', 'visa', 'amex'];
</script>

<template>
  <div class="co-methods">
    <template v-for="id in config.order.filter(id => config.visible[id])" :key="id">
      <SavedCardRow
        v-if="id in SAVED_CARD_META"
        :method-id="id"
        :last4="SAVED_CARD_META[id].last4"
        :expiry="SAVED_CARD_META[id].expiry"
        :network="SAVED_CARD_META[id].network"
        :selected="selected === id"
        @select="selected = id"
      />
      <NewCardRow
        v-else-if="id === 'add_card'"
        :method-id="id"
        :networks="NEW_CARD_NETWORKS"
        :selected="selected === id"
        @select="selected = id"
      />
      <ExternalRow
        v-else-if="id in EXTERNAL_META"
        :method-id="id"
        :label="EXTERNAL_META[id].label"
        :logo-key="EXTERNAL_META[id].logoKey"
        :wallet="EXTERNAL_META[id].wallet"
        :cash="EXTERNAL_META[id].cash"
        :dark-logo="EXTERNAL_META[id].darkLogo"
        :selected="selected === id"
        @select="selected = id"
      />
    </template>
  </div>
</template>

<style>
.co-methods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  padding-bottom: 170px;
  position: relative;
  z-index: 1;
}
</style>
