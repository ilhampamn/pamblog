<script setup lang="ts">
import { computed, watchEffect, onUnmounted, ref, watch } from 'vue';
import type { CheckoutConfig } from '@codapay/config-schema';
import { compileComponentOverrides, compileComponentCss } from '@codapay/config-schema';
import Navbar from './components/Navbar.vue';
import ProductSummary from './components/ProductSummary.vue';
import PaymentMethods from './components/PaymentMethods/PaymentMethods.vue';
import ActionBar from './components/ActionBar.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import ResultScreen from './components/Result/ResultScreen.vue';

const props = defineProps<{
  config: CheckoutConfig;
  tokensCss?: string;
  /**
   * Builder: force-display a screen without playing the live transition.
   * Undefined = internal state drives the screen (default for production).
   */
  previewScreen?: 'checkout' | 'result';
  /** Builder: which result variant to show in the preview. */
  previewResultStatus?: 'success' | 'failed';
  /** Builder: force-show the loading overlay for the Loading panel preview. */
  previewOverlay?: boolean;
}>();

const emit = defineEmits<{ pay: [] }>();

// ── Theme tokens ─────────────────────────────────────────────────────────────
// Global theme tokens (from the artifact) + per-component overrides compiled
// into the same scoped CSS. Both flow through this single injected <style>, so
// the builder preview and production checkout stay byte-for-byte identical.
const css = computed(() => {
  const base = props.tokensCss ?? props.config.theme.tokensCss ?? '';
  const overrides = compileComponentOverrides(props.config.theme.componentOverrides);
  // Advanced raw CSS goes LAST so its higher-specificity selector wins over the
  // token + structured-override layer.
  const rawCss = compileComponentCss(props.config.theme.componentCss);
  return [base, overrides, rawCss].filter(Boolean).join('\n');
});
// Skin drives structural pseudo-element decoration (gloss, shine, gradient borders).
// Gradient/shadow/blur tokens are handled by component CSS — no class needed for those.
const isGlossy = computed(() => props.config.theme.skin === 'glossy');

const styleEl = document.createElement('style');
document.head.appendChild(styleEl);
watchEffect(() => { styleEl.textContent = css.value; });
onUnmounted(() => { styleEl.remove(); });

// ── Screen state ──────────────────────────────────────────────────────────────
type Screen = 'checkout' | 'result';
type ResultStatus = 'success' | 'failed';

const screen = ref<Screen>('checkout');
const overlayVisible = ref(false);
const resultStatus = ref<ResultStatus>('success');

// Builder overrides — when the segmented preview control switches screens,
// jump directly without playing the transition, and always clear the overlay.
watch(() => props.previewScreen, (s) => {
  if (s != null) {
    screen.value = s;
    overlayVisible.value = false;
  }
}, { immediate: true });

watch(() => props.previewResultStatus, (s) => {
  if (s != null) resultStatus.value = s;
}, { immediate: true });

watch(() => props.previewOverlay, (v) => {
  if (v != null) overlayVisible.value = !!v;
}, { immediate: true });

// ── Live Pay transition: checkout → overlay (~1.6 s) → result ────────────────
let transitionTimer: ReturnType<typeof setTimeout> | null = null;

function handlePay() {
  emit('pay');
  // Only play the live transition when not in builder preview-override mode
  if (props.previewScreen != null) return;
  if (transitionTimer) clearTimeout(transitionTimer);
  overlayVisible.value = true;
  transitionTimer = setTimeout(() => {
    overlayVisible.value = false;
    screen.value = 'result';
    resultStatus.value = 'success'; // production: comes from payment API response
    transitionTimer = null;
  }, 1600);
}

onUnmounted(() => { if (transitionTimer) clearTimeout(transitionTimer); });
</script>

<template>
  <div class="checkout-scope" :class="{ candy: isGlossy }">
    <div class="co-shell">

      <!-- ── Checkout screen ──────────────────────────────────────────── -->
      <template v-if="screen === 'checkout'">
        <Navbar :config="config.navbar" />

        <div class="co-scroll">
          <ProductSummary :config="config.product" :rewards="config.rewards" />

          <div class="co-section">
            <span class="t">Select payment method</span>
            <span class="co-mycards">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              My cards
            </span>
          </div>

          <PaymentMethods :config="config.payments" />
        </div>

        <ActionBar :config="config.product" @pay="handlePay" />
      </template>

      <!-- ── Result screen ────────────────────────────────────────────── -->
      <ResultScreen
        v-else-if="screen === 'result'"
        :config="config.screens.result"
        :product="config.product"
        :rewards="config.rewards"
        :payments="config.payments"
        :status="resultStatus"
      />

      <!-- ── Loading overlay (floats above checkout, z-index 50) ──────── -->
      <LoadingOverlay
        v-if="overlayVisible"
        :config="config.screens.loading"
      />

    </div>
  </div>
</template>

<style scoped>
.checkout-scope {
  font-family: var(--font-primary);
  background: var(--bg-page-gradient, var(--bg-page));
  height: 100%;
  position: relative;
}

.co-shell {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.co-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
.co-scroll::-webkit-scrollbar { display: none; }

.co-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--bg-section-subtle);
}

.co-section .t {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-header-default);
}

.co-mycards {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: var(--text-body-soft);
}
</style>

<!-- Candy Crush preset — gradient + gloss enhancements (non-scoped to pierce child components) -->
<style>
@keyframes co-shine { 0% { transform: translateX(-120%) } 55%, 100% { transform: translateX(120%) } }

/* Page bg, navbar blend, pay button gradient, and selected-card gradient/shadow
   are now driven by --bg-page-gradient, --bg-navbar-blend, --backdrop-blur-navbar,
   --bg-action-primary-gradient, --shadow-action-primary, --bg-card-selected-gradient,
   and --shadow-card-selected tokens — no class override needed here.
   What remains: structural pseudo-element decoration (gloss, shine, gradient borders). */

.checkout-scope.candy .co-banner { background: linear-gradient(180deg, rgba(72,36,107,.4), transparent) !important; }

.checkout-scope.candy .co-thumb {
  border: 2px solid rgba(255,255,255,.18) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 22px -10px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.2);
}

.checkout-scope.candy .co-badge {
  background: linear-gradient(135deg,#FF5BA8,#FF2E88 45%,#E01B6E) !important;
  box-shadow: 0 2px 8px rgba(255,46,136,.5);
  position: relative;
  overflow: hidden;
}
.checkout-scope.candy .co-badge::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg,transparent 40%,rgba(255,255,255,.6) 50%,transparent 60%);
  transform: translateX(-120%);
  animation: co-shine 3.5s ease-in-out infinite;
}

.checkout-scope.candy .co-coin {
  background: linear-gradient(135deg,#FFE259,#FFB72B 50%,#F58A00) !important;
  box-shadow: 0 2px 6px rgba(245,138,0,.5), inset 0 1px 0 rgba(255,255,255,.6);
  width: 20px;
  height: 20px;
  position: relative;
  overflow: hidden;
  color: #7a4a00;
}
.checkout-scope.candy .co-coin::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 3px;
  width: 6px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255,255,255,.7);
}

.checkout-scope.candy .co-opt { position: relative; }
.checkout-scope.candy .co-optrow { position: relative; z-index: 1; }
.checkout-scope.candy .co-fields-clip { position: relative; z-index: 1; }
.checkout-scope.candy .co-fields { position: relative; z-index: 1; }

.checkout-scope.candy .co-opt.sel {
  /* gradient + shadow now come from --bg-card-selected-gradient / --shadow-card-selected tokens */
  border-color: transparent !important; /* gradient ::before provides the border */
  box-shadow: var(--shadow-card-selected, none), inset 0 1px 0 rgba(255,255,255,.12);
}
.checkout-scope.candy .co-opt.sel::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(135deg,#FF5BA8,#FF2E88 45%,#E01B6E);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.checkout-scope.candy .co-opt.sel .co-radio {
  border-color: transparent !important;
  background: linear-gradient(135deg,#FF5BA8,#FF2E88 45%,#E01B6E) !important;
  box-shadow: 0 2px 8px rgba(255,46,136,.6);
}
.checkout-scope.candy .co-opt.sel .co-radio .d { background: #fff !important; }

.checkout-scope.candy .co-paybtn {
  position: relative;
  overflow: hidden;
  /* gradient + shadow now come from --bg-action-primary-gradient / --shadow-action-primary tokens */
}
.checkout-scope.candy .co-paybtn::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 14px;
  right: 14px;
  height: 38%;
  border-radius: 999px;
  background: linear-gradient(180deg,rgba(255,255,255,.55),transparent);
  pointer-events: none;
}
.checkout-scope.candy .co-paybtn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);
  transform: translateX(-120%);
  animation: co-shine 3s ease-in-out infinite;
  pointer-events: none;
}

.checkout-scope.candy .co-cash {
  background: linear-gradient(135deg,#3DF07A,#00C853) !important;
  box-shadow: 0 2px 8px rgba(0,200,83,.5), inset 0 1px 0 rgba(255,255,255,.5);
}
</style>
