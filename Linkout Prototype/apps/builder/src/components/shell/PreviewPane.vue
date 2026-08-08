<script setup lang="ts">
import { ref } from 'vue';
import { useConfigStore } from '../../stores/config.ts';
import { useThemeStore } from '../../stores/theme.ts';
import { CheckoutRoot } from '@codapay/checkout-ui';

const config = useConfigStore();
const theme = useThemeStore();

// Device-width presets for responsiveness testing. Widths only — the checkout
// is a mobile surface, so its action bar / pay button flex with the frame width.
const PRESETS = [
  { label: 'SE', width: 320 },
  { label: 'Android', width: 360 },
  { label: 'iPhone', width: 390 },
  { label: 'Plus', width: 414 },
  { label: 'Max', width: 430 },
  { label: 'Wide', width: 600 },
] as const;

const MIN_W = 280;
const MAX_W = 640;
const HEIGHT = 812;

const width = ref(390);

function setWidth(w: number) {
  width.value = Math.min(MAX_W, Math.max(MIN_W, Math.round(w)));
}
</script>

<template>
  <div class="stage">
    <div class="device-bar">
      <div class="device-bar__presets" role="group" aria-label="Preview device width">
        <button
          v-for="p in PRESETS"
          :key="p.label"
          class="device-chip"
          :class="{ 'device-chip--active': width === p.width }"
          :title="`${p.label} — ${p.width}px`"
          @click="setWidth(p.width)"
        >
          {{ p.label }}
        </button>
      </div>

      <div class="device-bar__slider">
        <input
          type="range"
          class="device-range"
          :min="MIN_W"
          :max="MAX_W"
          step="1"
          :value="width"
          aria-label="Custom preview width"
          @input="setWidth(+($event.target as HTMLInputElement).value)"
        />
        <span class="device-bar__readout">{{ width }} × {{ HEIGHT }}</span>
      </div>
    </div>

    <div class="phone-wrap">
      <div class="phone" :style="{ width: width + 'px', height: HEIGHT + 'px' }">
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
  background: radial-gradient(circle at 50% 0%, var(--color-charcoal-20), var(--color-charcoal-30));
  overflow: hidden;
}

.device-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  padding: var(--spacing-sm) var(--spacing-lg);
  background: rgba(0, 0, 0, 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.device-bar__presets {
  display: flex;
  gap: var(--spacing-2xs);
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-2xs);
}

.device-chip {
  border: none;
  background: none;
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-invert);
  opacity: 0.6;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.device-chip:hover {
  opacity: 0.9;
}

.device-chip--active {
  background: var(--color-background-primary);
  color: var(--color-text-primary);
  opacity: 1;
  box-shadow: var(--shadow-sm);
}

.device-bar__slider {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.device-range {
  width: 160px;
  accent-color: var(--color-background-control-button-primary-default);
  cursor: pointer;
}

.device-bar__readout {
  font-family: var(--font-family-jet-brains-mono);
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-invert);
  opacity: 0.7;
  min-width: 72px;
  text-align: right;
}

.phone-wrap {
  flex: 1;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: var(--spacing-2xl);
}

.phone {
  flex-shrink: 0;
  border-radius: 44px;
  background: var(--color-black-0);
  padding: 11px;
  box-shadow:
    0 24px 60px -12px rgba(20,24,40,.45),
    0 0 0 1px rgba(0,0,0,.06);
  position: relative;
  transition: width 0.18s ease;
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 34px;
  overflow: hidden;
  position: relative;
}
</style>
