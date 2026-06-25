<script setup lang="ts">
import { useConfigStore } from '../../stores/config.ts';
import { useThemeStore } from '../../stores/theme.ts';
import { CheckoutRoot } from '@codapay/checkout-ui';

const config = useConfigStore();
const theme = useThemeStore();
</script>

<template>
  <div class="stage">
    <div class="phone-wrap">
      <div class="phone">
        <div class="phone-screen">
          <CheckoutRoot
            :config="config.config"
            :tokens-css="theme.tokensCss"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stage {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 50% 0%, #EBEDF1, #E3E6EB);
  overflow: hidden;
}

.phone-wrap {
  flex: 1;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: 28px;
}

.phone {
  width: 390px;
  height: 812px;
  flex-shrink: 0;
  border-radius: 44px;
  background: #000;
  padding: 11px;
  box-shadow:
    0 24px 60px -12px rgba(20,24,40,.45),
    0 0 0 1px rgba(0,0,0,.06);
  position: relative;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 34px;
  overflow: hidden;
  position: relative;
}
</style>
