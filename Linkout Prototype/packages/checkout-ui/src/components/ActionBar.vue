<script setup lang="ts">
import { computed } from 'vue';
import type { ProductConfig } from '@codapay/config-schema';

const props = defineProps<{ config: ProductConfig }>();
const emit = defineEmits<{ pay: [] }>();

const priceLabel = computed(() =>
  `${props.config.currency} ${props.config.finalPrice.toFixed(2)}`
);
</script>

<template>
  <div class="co-actionbar">
    <button class="co-paybtn" @click="emit('pay')">Pay • {{ priceLabel }}</button>
    <p class="co-legal">
      This product is sold by Coda US LLC. By continuing, you agree to Coda US LLC
      <a href="#" @click.prevent>Terms and Conditions</a> and
      <a href="#" @click.prevent>Privacy Policy</a>.
    </p>
  </div>
</template>

<style>
.co-actionbar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-navbar);
  border-top: 1px solid var(--border-divider);
  padding: 16px 16px 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 20;
}

.co-actionbar::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -28px;
  height: 28px;
  pointer-events: none;
  background: linear-gradient(to top, var(--bg-page), transparent);
}

.co-paybtn {
  width: 100%;
  height: 50px;
  border: var(--ov-paybtn-border-width, 0) solid var(--ov-paybtn-border-color, transparent);
  background: var(--ov-paybtn-bg, var(--bg-action-primary-gradient, var(--bg-action-primary)));
  color: var(--ov-paybtn-text, var(--text-action-on-primary, #06222B));
  border-radius: var(--ov-paybtn-radius, var(--radius-control-full));
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: var(--shadow-action-primary, 0 4px 20px rgba(0,0,0,.25));
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.co-paybtn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0,0,0,.35);
}

.co-paybtn:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0,0,0,.2);
}

@media (prefers-reduced-motion: reduce) {
  .co-paybtn { transition: none; }
}

.co-legal {
  font-size: 10px;
  line-height: 1.5;
  color: var(--text-body-subtle);
  text-align: center;
  margin: 0;
}

.co-legal a {
  color: var(--text-body-soft);
  text-decoration: underline;
}
</style>
