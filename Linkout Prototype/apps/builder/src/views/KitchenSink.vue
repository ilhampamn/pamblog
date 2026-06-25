<script setup lang="ts">
import { ref, computed } from 'vue';
import { toCss } from '@codapay/tokens';
import { CheckoutRoot } from '@codapay/checkout-ui';
import Navbar from '../../../../packages/checkout-ui/src/components/Navbar.vue';
import ProductSummary from '../../../../packages/checkout-ui/src/components/ProductSummary.vue';
import SavedCardRow from '../../../../packages/checkout-ui/src/components/PaymentMethods/SavedCardRow.vue';
import ExternalRow from '../../../../packages/checkout-ui/src/components/PaymentMethods/ExternalRow.vue';
import NewCardRow from '../../../../packages/checkout-ui/src/components/PaymentMethods/NewCardRow.vue';
import ActionBar from '../../../../packages/checkout-ui/src/components/ActionBar.vue';
import { RIFT_RACING_TOKENS, CANDY_CRUSH_TOKENS } from '../stores/theme.ts';
import { RIFT_RACING_FIXTURE } from '@codapay/config-schema';
import { BUILDER_CHROME_MAP, CHECKOUT_REGION_MAP } from '../../../../docs/design-system-map.ts';

const emit = defineEmits<{ back: [] }>();

// Checkout theme switch
const activeTheme = ref<'rift' | 'candy'>('rift');
const activeTokens = computed(() => activeTheme.value === 'rift' ? RIFT_RACING_TOKENS : CANDY_CRUSH_TOKENS);
const tokensCss = computed(() => toCss(activeTokens.value, '.checkout-scope'));

// Demo state
const toggleOn = ref(true);
const toggleOff = ref(false);
const inputVal = ref('');
const showDialog = ref(false);
const showSnackbar = ref<'positive' | 'critical' | null>(null);

function flashSnackbar(type: 'positive' | 'critical') {
  showSnackbar.value = type;
  setTimeout(() => { showSnackbar.value = null; }, 3000);
}

// Group builder chrome map by area
const chromeGroups = computed(() => {
  const groups: Record<string, typeof BUILDER_CHROME_MAP> = {};
  for (const item of BUILDER_CHROME_MAP) {
    if (!groups[item.area]) groups[item.area] = [];
    groups[item.area].push(item);
  }
  return groups;
});

const AREA_LABELS: Record<string, string> = {
  'shell': 'Shell & Navigation',
  'settings-panel': 'Settings Panel',
  'payment-editor': 'Payment Editor',
  'theme-editor': 'Theme Editor',
  'feedback': 'Feedback & Overlays',
};

// ── Checkout component map (mirrors BUILDER_CHROME_MAP structure) ────────────
interface CheckoutComponentSpec {
  id: string;
  name: string;
  file: string;
  region: string;
  cssClasses: string[];
  states: string[];
  tokens: string[];
  description: string;
}

const CHECKOUT_COMPONENT_MAP: CheckoutComponentSpec[] = [
  {
    id: 'Navbar',
    name: 'Navbar',
    file: 'components/Navbar.vue',
    region: 'co-navbar',
    cssClasses: ['.co-statusbar', '.co-navbar', '.co-iconbtn', '.co-brand', '.co-lang'],
    states: ['default'],
    tokens: ['--bg-navbar', '--border-navbar', '--text-body-soft', '--text-header-default'],
    description: 'Status bar (9:41, signal, battery) + nav bar with back arrow, brand name/logo, language toggle.',
  },
  {
    id: 'ProductSummary',
    name: 'ProductSummary',
    file: 'components/ProductSummary.vue',
    region: 'co-product + co-rewards',
    cssClasses: ['.co-banner', '.co-banner-detail', '.co-thumb', '.co-info', '.co-pricerow', '.co-badge', '.co-orig', '.co-earn', '.co-coin', '.co-chev'],
    states: ['collapsed', 'expanded (detail open)'],
    tokens: ['--bg-card-default', '--border-card-default', '--text-body-default', '--text-body-subtle', '--bg-action-primary', '--text-action-on-primary'],
    description: 'Collapsible product card. Shows thumbnail, name, price, discount badge, earn coin strip. Tap to expand order detail rows.',
  },
  {
    id: 'SavedCardRow',
    name: 'SavedCardRow',
    file: 'components/PaymentMethods/SavedCardRow.vue',
    region: 'co-payments',
    cssClasses: ['.co-opt', '.co-opt.sel', '.co-optrow', '.co-radio', '.co-radio .d', '.co-cc', '.co-body', '.co-label', '.co-fields'],
    states: ['unselected', 'selected (CVV+ZIP revealed)', 'focused input'],
    tokens: ['--bg-card-default', '--bg-card-selected', '--border-card-default', '--border-input-focused', '--border-weight-selected', '--bg-input-default', '--text-body-default', '--text-body-subtle', '--text-placeholder'],
    description: 'Saved card row. Unselected = radio + network logo + last 4. Selected = expands CVV + ZIP fields via CSS max-height animation.',
  },
  {
    id: 'ExternalRow',
    name: 'ExternalRow',
    file: 'components/PaymentMethods/ExternalRow.vue',
    region: 'co-payments',
    cssClasses: ['.co-opt', '.co-opt.sel', '.co-optrow', '.co-radio', '.co-cc', '.co-cc.wallet', '.co-cash', '.co-body', '.co-hint'],
    states: ['unselected', 'selected (tap-to-pay hint)'],
    tokens: ['--bg-card-default', '--bg-card-selected', '--border-card-default', '--border-input-focused', '--text-body-default', '--text-body-subtle'],
    description: 'External payment row for Google Pay, Apple Pay, PayPal, Cash App. Wallet flag applies white bg to logo; cash flag applies green pill.',
  },
  {
    id: 'NewCardRow',
    name: 'NewCardRow',
    file: 'components/PaymentMethods/NewCardRow.vue',
    region: 'co-payments',
    cssClasses: ['.co-opt', '.co-opt.sel', '.co-logos', '.co-cc', '.co-fields', '.co-fields.stack', '.co-field', '.co-input'],
    states: ['collapsed', 'selected (full card form expanded)'],
    tokens: ['--bg-card-default', '--bg-card-selected', '--border-input-focused', '--border-weight-selected', '--bg-input-default', '--text-placeholder', '--text-body-subtle'],
    description: '"Add a new card" row. Shows network logos (MC/Visa/Amex). Expands full card number, expiry, CVV stack on select.',
  },
  {
    id: 'ActionBar',
    name: 'ActionBar',
    file: 'components/ActionBar.vue',
    region: 'co-action',
    cssClasses: ['.co-actionbar', '.co-actionbar::before', '.co-paybtn', '.co-legal'],
    states: ['default'],
    tokens: ['--bg-navbar', '--border-divider', '--bg-action-primary', '--text-action-on-primary', '--radius-control-full', '--text-body-subtle'],
    description: 'Sticky bottom bar. Gradient fade above via ::before. Pay button fills --bg-action-primary with pill radius. Legal text below.',
  },
];

// Checkout component demo state
const savedCardSelected = ref(true);
const externalSelected = ref(false);
const newCardSelected = ref(false);
</script>

<template>
  <div class="ks">
    <!-- Page header -->
    <header class="ks-header">
      <button class="ks-back" @click="emit('back')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Back
      </button>
      <div class="ks-title-block">
        <h1 class="ks-title">Component Kitchen Sink</h1>
        <p class="ks-subtitle">All components from both design systems. Builder chrome uses <code>coda-payments-design</code>; payment page uses <code>codapay-whitelabel</code>.</p>
      </div>
      <div class="ks-ds-legend">
        <span class="ks-badge ks-badge--chrome">coda-payments-design</span>
        <span class="ks-badge ks-badge--whitelabel">codapay-whitelabel</span>
      </div>
    </header>

    <div class="ks-body">

      <!-- ═══════════════════════════════════════════════════ -->
      <!-- DS1: BUILDER CHROME — coda-payments-design         -->
      <!-- ═══════════════════════════════════════════════════ -->
      <section class="ks-section">
        <div class="ks-section-label ks-section-label--chrome">
          <span class="ks-badge ks-badge--chrome">coda-payments-design</span>
          <h2>Builder Chrome</h2>
          <p>Used exclusively inside the builder shell. Tokens: <code>--coda-*</code></p>
        </div>

        <!-- 1.1 Buttons & Actions -->
        <div class="ks-group">
          <h3 class="ks-group-title">Button <span class="ks-meta">component: Button, IconButton</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item">
              <button class="btn btn--primary">Primary</button>
              <span class="ks-label">type: primary</span>
            </div>
            <div class="ks-demo-item">
              <button class="btn btn--primary" disabled>Primary</button>
              <span class="ks-label">disabled</span>
            </div>
            <div class="ks-demo-item">
              <button class="btn btn--secondary">Secondary</button>
              <span class="ks-label">type: secondary</span>
            </div>
            <div class="ks-demo-item">
              <button class="btn btn--secondary" disabled>Secondary</button>
              <span class="ks-label">disabled</span>
            </div>
            <div class="ks-demo-item">
              <button class="btn btn--ghost">Ghost / Link</button>
              <span class="ks-label">type: link</span>
            </div>
            <div class="ks-demo-item">
              <button class="btn btn--destructive">Delete</button>
              <span class="ks-label">type: destructive</span>
            </div>
          </div>
          <div class="ks-row ks-row--wrap" style="margin-top: 8px;">
            <div class="ks-demo-item">
              <button class="icon-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
              <span class="ks-label">IconButton default</span>
            </div>
            <div class="ks-demo-item">
              <button class="icon-btn" disabled>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              </button>
              <span class="ks-label">IconButton disabled</span>
            </div>
          </div>
        </div>

        <!-- 1.2 Form inputs -->
        <div class="ks-group">
          <h3 class="ks-group-title">Input <span class="ks-meta">component: Input (text, numeric)</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Text field (default)</label>
                <input class="field__input" type="text" placeholder="Enter text…" />
              </div>
              <span class="ks-label">kind: text — default</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Text field (filled)</label>
                <input class="field__input" type="text" value="John Doe" />
              </div>
              <span class="ks-label">kind: text — filled</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Text field (error)</label>
                <input class="field__input field__input--error" type="text" value="bad@" />
                <span class="field__error">Invalid format</span>
              </div>
              <span class="ks-label">kind: text — error</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Text field (disabled)</label>
                <input class="field__input" type="text" value="Read only" disabled />
              </div>
              <span class="ks-label">kind: text — disabled</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Number field</label>
                <input class="field__input field__input--number" type="number" value="3.99" />
              </div>
              <span class="ks-label">kind: numeric</span>
            </div>
          </div>
        </div>

        <!-- 1.3 Dropdown / Select -->
        <div class="ks-group">
          <h3 class="ks-group-title">Dropdown <span class="ks-meta">component: Dropdown</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Currency select</label>
                <select class="field__select">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
              <span class="ks-label">show-search: false</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">Theme select (with no-results)</label>
                <select class="field__select">
                  <option value="" disabled selected>Select a theme…</option>
                  <option>Rift Racing</option>
                  <option>Candy Crush</option>
                </select>
              </div>
              <span class="ks-label">disabled option as placeholder</span>
            </div>
          </div>
        </div>

        <!-- 1.4 Toggle -->
        <div class="ks-group">
          <h3 class="ks-group-title">Toggle <span class="ks-meta">component: Toggle</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item">
              <button class="toggle" :class="{ 'toggle--on': toggleOn }" @click="toggleOn = !toggleOn">
                <span class="toggle__thumb" />
              </button>
              <span class="ks-label">{{ toggleOn ? 'on' : 'off' }} (interactive)</span>
            </div>
            <div class="ks-demo-item">
              <button class="toggle toggle--on" disabled style="opacity:0.4;cursor:not-allowed">
                <span class="toggle__thumb" />
              </button>
              <span class="ks-label">on — disabled</span>
            </div>
            <div class="ks-demo-item">
              <button class="toggle" disabled style="opacity:0.4;cursor:not-allowed">
                <span class="toggle__thumb" />
              </button>
              <span class="ks-label">off — disabled</span>
            </div>
          </div>
        </div>

        <!-- 1.5 Uploader -->
        <div class="ks-group">
          <h3 class="ks-group-title">Uploader <span class="ks-meta">component: Uploader (variant: image)</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="uploader__zone">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Drop image or <u>browse</u></span>
                <span style="font-size:10px;opacity:0.7">PNG, SVG, WEBP — max 2 MB</span>
              </div>
              <span class="ks-label">default state</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="uploader__zone" style="border-color:var(--coda-primary);color:var(--coda-primary);background:var(--coda-hover)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <span>Drop to upload</span>
              </div>
              <span class="ks-label">drop-active state</span>
            </div>
          </div>
        </div>

        <!-- 1.6 Color field -->
        <div class="ks-group">
          <h3 class="ks-group-title">Color Field <span class="ks-meta">area: theme-editor — token color input</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">--bg-action-primary</label>
                <div class="color-field">
                  <div class="color-field__swatch">
                    <input type="color" value="#2BB6E6" />
                  </div>
                  <input class="color-field__hex" type="text" value="#2BB6E6" maxlength="7" />
                </div>
              </div>
              <span class="ks-label">default</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="field">
                <label class="field__label">--bg-action-primary</label>
                <div class="color-field">
                  <div class="color-field__swatch">
                    <input type="color" value="#FF2E88" />
                  </div>
                  <input class="color-field__hex" type="text" value="#FF2E88" maxlength="7" style="border-color:var(--coda-primary)" />
                </div>
              </div>
              <span class="ks-label">focused</span>
            </div>
          </div>
        </div>

        <!-- 1.7 Tabs (mode switch) -->
        <div class="ks-group">
          <h3 class="ks-group-title">Tabs <span class="ks-meta">component: Tabs — mode switch (2-option) + theme input mode (3-option)</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="mode-tabs" role="tablist">
                <button class="mode-tab mode-tab--active">Edit</button>
                <button class="mode-tab">Preview</button>
              </div>
              <span class="ks-label">options: 2 (topbar mode switch)</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="mode-tabs" role="tablist">
                <button class="mode-tab mode-tab--active">Manual</button>
                <button class="mode-tab">Upload CSS</button>
                <button class="mode-tab">Generate</button>
              </div>
              <span class="ks-label">options: 3 (theme input mode)</span>
            </div>
          </div>
        </div>

        <!-- 1.8 Cards & Containers -->
        <div class="ks-group">
          <h3 class="ks-group-title">Card / Panel Section <span class="ks-meta">component: Card</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="panel__section">
                <h4 class="panel__section-title">Section title</h4>
                <p style="font-size:13px;color:var(--coda-text-secondary)">Panel section content goes here. Used as the card container for all settings groups.</p>
              </div>
              <span class="ks-label">panel section (show-header: true)</span>
            </div>
          </div>
        </div>

        <!-- 1.9 Lists & IndexListItem -->
        <div class="ks-group">
          <h3 class="ks-group-title">Lists / IndexListItem <span class="ks-meta">component: Lists, IndexListItem — method rows</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="method-list">
                <div class="method-row method-row--default">
                  <div class="method-row__drag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="1.5" fill="currentColor"/><circle cx="15" cy="7" r="1.5" fill="currentColor"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="9" cy="17" r="1.5" fill="currentColor"/><circle cx="15" cy="17" r="1.5" fill="currentColor"/></svg>
                  </div>
                  <div class="method-row__logo"><div style="width:32px;height:20px;background:var(--coda-surface-border);border-radius:4px"></div></div>
                  <span class="method-row__label">Visa •••• 3893</span>
                  <span class="method-row__type">saved</span>
                  <button class="toggle toggle--on" style="width:28px;height:16px;flex-shrink:0"><span class="toggle__thumb" style="width:12px;height:12px;top:2px;left:2px" /></button>
                </div>
                <div class="method-row method-row--hover">
                  <div class="method-row__drag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="1.5" fill="currentColor"/><circle cx="15" cy="7" r="1.5" fill="currentColor"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="9" cy="17" r="1.5" fill="currentColor"/><circle cx="15" cy="17" r="1.5" fill="currentColor"/></svg>
                  </div>
                  <div class="method-row__logo"><div style="width:32px;height:20px;background:var(--coda-surface-border);border-radius:4px"></div></div>
                  <span class="method-row__label">Google Pay</span>
                  <span class="method-row__type">external</span>
                  <button class="toggle"><span class="toggle__thumb" style="width:12px;height:12px;top:2px;left:2px" /></button>
                </div>
                <div class="method-row method-row--unmatched">
                  <div class="method-row__drag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="1.5" fill="currentColor"/><circle cx="15" cy="7" r="1.5" fill="currentColor"/><circle cx="9" cy="12" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/><circle cx="9" cy="17" r="1.5" fill="currentColor"/><circle cx="15" cy="17" r="1.5" fill="currentColor"/></svg>
                  </div>
                  <div class="method-row__logo"><div style="width:32px;height:20px;background:#fff3cd;border-radius:4px;border:1px solid #ffc107"></div></div>
                  <span class="method-row__label">Custom Pay</span>
                  <span class="chip chip--negative">No logo</span>
                  <button class="toggle toggle--on" style="width:28px;height:16px;flex-shrink:0"><span class="toggle__thumb" style="width:12px;height:12px;top:2px;left:2px" /></button>
                </div>
              </div>
              <span class="ks-label">draggable: true — default / hover / unmatched-logo states</span>
            </div>
          </div>
        </div>

        <!-- 1.10 Chips -->
        <div class="ks-group">
          <h3 class="ks-group-title">Chips <span class="ks-meta">component: Chips</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item"><span class="chip chip--positive">Active</span><span class="ks-label">type: positive</span></div>
            <div class="ks-demo-item"><span class="chip chip--negative">No logo</span><span class="ks-label">type: negative</span></div>
            <div class="ks-demo-item"><span class="chip chip--neutral">Preset</span><span class="ks-label">type: neutral</span></div>
            <div class="ks-demo-item"><span class="chip chip--warning">Warning</span><span class="ks-label">type: warning</span></div>
          </div>
        </div>

        <!-- 1.11 InfoBanner -->
        <div class="ks-group">
          <h3 class="ks-group-title">InfoBanner <span class="ks-meta">component: InfoBanner — token validation messages</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="info-banner info-banner--warning">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                <span>Low contrast ratio on <code>--text-body-subtle</code>. Auto-fix available.</span>
              </div>
              <span class="ks-label">type: warning</span>
            </div>
            <div class="ks-demo-item ks-demo-item--wide">
              <div class="info-banner info-banner--error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                <span>Error: <code>--bg-action-destructive</code> too close to primary. Export blocked.</span>
              </div>
              <span class="ks-label">type: error (blocks export)</span>
            </div>
          </div>
        </div>

        <!-- 1.12 Snackbar -->
        <div class="ks-group">
          <h3 class="ks-group-title">Snackbar <span class="ks-meta">component: Snackbar</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item">
              <button class="btn btn--secondary" @click="flashSnackbar('positive')">Show positive</button>
              <span class="ks-label">type: positive (save confirmation)</span>
            </div>
            <div class="ks-demo-item">
              <button class="btn btn--secondary" @click="flashSnackbar('critical')">Show critical</button>
              <span class="ks-label">type: critical (export blocked)</span>
            </div>
          </div>
          <div v-if="showSnackbar" class="snackbar-demo" :class="`snackbar-demo--${showSnackbar}`">
            <svg v-if="showSnackbar === 'positive'" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            {{ showSnackbar === 'positive' ? 'Theme saved successfully' : 'Export blocked: fix validation errors first' }}
          </div>
        </div>

        <!-- 1.13 Dialog -->
        <div class="ks-group">
          <h3 class="ks-group-title">Dialog / SideDialog <span class="ks-meta">component: Dialog, SideDialog</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item">
              <button class="btn btn--secondary" @click="showDialog = true">Open Dialog</button>
              <span class="ks-label">type: critical (reset confirmation)</span>
            </div>
          </div>
          <!-- Dialog overlay -->
          <Teleport to="body">
            <div v-if="showDialog" class="dialog-overlay" @click.self="showDialog = false">
              <div class="dialog">
                <h3 class="dialog__title">Reset to defaults?</h3>
                <p class="dialog__body">This will discard all unsaved changes to your config and theme. This action cannot be undone.</p>
                <div class="dialog__actions">
                  <button class="btn btn--secondary" @click="showDialog = false">Cancel</button>
                  <button class="btn btn--destructive" @click="showDialog = false">Reset</button>
                </div>
              </div>
            </div>
          </Teleport>
        </div>

        <!-- 1.14 Tooltip -->
        <div class="ks-group">
          <h3 class="ks-group-title">Tooltips <span class="ks-meta">component: Tooltips — inline help</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item">
              <div class="tooltip-wrap">
                <button class="icon-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
                <div class="tooltip">Controls whether rewards coins are shown in the product banner.</div>
              </div>
              <span class="ks-label">side: top (hover to see)</span>
            </div>
          </div>
        </div>

        <!-- 1.15 Progress -->
        <div class="ks-group">
          <h3 class="ks-group-title">ProgressIndicators <span class="ks-meta">component: ProgressIndicators — autosave / load</span></h3>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item">
              <div class="progress-spinner" />
              <span class="ks-label">type: indeterminate</span>
            </div>
            <div class="ks-demo-item">
              <div class="progress-bar-wrap"><div class="progress-bar" style="width:60%" /></div>
              <span class="ks-label">type: determinate (60%)</span>
            </div>
          </div>
        </div>

        <!-- 1.16 Component map table -->
        <div class="ks-group">
          <h3 class="ks-group-title">Full Component Map <span class="ks-meta">from design-system-map.ts BUILDER_CHROME_MAP</span></h3>
          <div class="ks-table-wrap">
            <table class="ks-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Element</th>
                  <th>Area</th>
                  <th>Component</th>
                  <th>States</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(items, area) in chromeGroups" :key="area">
                  <tr class="ks-table-group-row">
                    <td colspan="5">{{ AREA_LABELS[area] }}</td>
                  </tr>
                  <tr v-for="item in items" :key="item.id">
                    <td class="mono">{{ item.id }}</td>
                    <td>{{ item.element }}</td>
                    <td><span class="chip chip--neutral">{{ item.area }}</span></td>
                    <td class="mono">{{ item.component }}</td>
                    <td>
                      <div class="ks-chips">
                        <span v-for="s in item.states" :key="s" class="chip chip--neutral">{{ s }}</span>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════════════════════════════════ -->
      <!-- DS2: PAYMENT PAGE — codapay-whitelabel             -->
      <!-- ═══════════════════════════════════════════════════ -->
      <section class="ks-section">
        <div class="ks-section-label ks-section-label--whitelabel">
          <span class="ks-badge ks-badge--whitelabel">codapay-whitelabel</span>
          <h2>Payment Page</h2>
          <p>Rendered by <code>packages/checkout-ui</code>. Tokens: <code>--bg-*</code> <code>--text-*</code> <code>--border-*</code> <code>--radius-*</code> scoped to <code>.checkout-scope</code></p>
        </div>

        <!-- Theme picker — drives all demos below via CheckoutRoot style injection -->
        <div class="ks-group">
          <h3 class="ks-group-title">Active Theme <span class="ks-meta">applies to all component demos below</span></h3>
          <div class="ks-theme-switch">
            <button class="mode-tab" :class="{ 'mode-tab--active': activeTheme === 'rift' }" @click="activeTheme = 'rift'">Rift Racing</button>
            <button class="mode-tab" :class="{ 'mode-tab--active': activeTheme === 'candy' }" @click="activeTheme = 'candy'">Candy Crush</button>
          </div>
          <!-- Hidden CheckoutRoot solely to inject tokensCss into document.head for .checkout-scope -->
          <div style="display:none"><CheckoutRoot :config="RIFT_RACING_FIXTURE" :tokens-css="tokensCss" /></div>
        </div>

        <!-- ── 2.1 Navbar ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">Navbar <span class="ks-meta">Navbar.vue — region: co-navbar</span></h3>
          <p class="ks-desc">Status bar (9:41 + signal/battery) + nav bar with back arrow, brand name/logo, language toggle.</p>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--checkout">
              <div class="checkout-scope ks-co-demo ks-co-demo--nav">
                <Navbar :config="RIFT_RACING_FIXTURE.navbar" />
              </div>
              <span class="ks-label">state: default</span>
            </div>
          </div>
        </div>

        <!-- ── 2.2 ProductSummary ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">ProductSummary <span class="ks-meta">ProductSummary.vue — region: co-product + co-rewards</span></h3>
          <p class="ks-desc">Collapsible product card — thumbnail, name, price, discount badge, earn coin strip. Tap to expand order detail rows.</p>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--checkout">
              <div class="checkout-scope ks-co-demo">
                <ProductSummary :config="RIFT_RACING_FIXTURE.product" :rewards="RIFT_RACING_FIXTURE.rewards" />
              </div>
              <span class="ks-label">state: collapsed / expanded (tap to toggle)</span>
            </div>
          </div>
        </div>

        <!-- ── 2.3 SavedCardRow — Payment Card States ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">SavedCardRow <span class="ks-meta">PaymentMethods/SavedCardRow.vue — from Figma design node-id=21-780</span></h3>
          <p class="ks-desc">Saved card payment rows showing all 5 state variations. Radio button + network logo + card details. Selected state expands CVV + ZIP fields via CSS max-height animation.</p>

          <!-- 5 variations matching Figma design -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <!-- 1. Selected with CVV/ZIP expanded (blue border) -->
            <div>
              <div class="checkout-scope ks-co-demo ks-co-demo--cards">
                <SavedCardRow method-id="card1" last4="3890" expiry="12/29" network="visa" :selected="true" @select="() => {}" />
              </div>
              <span class="ks-label">1. Selected — CVV/ZIP expanded (blue border + filled radio)</span>
            </div>

            <!-- 2. Unselected (default) -->
            <div>
              <div class="checkout-scope ks-co-demo ks-co-demo--cards">
                <SavedCardRow method-id="card2" last4="9999" expiry="12/29" network="mastercard" :selected="false" @select="() => {}" />
              </div>
              <span class="ks-label">2. Unselected — radio empty, no fields</span>
            </div>

            <!-- 3. Unselected (no expiry shown) -->
            <div>
              <div class="checkout-scope ks-co-demo ks-co-demo--cards">
                <SavedCardRow method-id="card3" last4="3980" expiry="12/29" network="visa" :selected="false" @select="() => {}" />
              </div>
              <span class="ks-label">3. Unselected (alt) — compact layout</span>
            </div>

            <!-- 4. Selected (alt styling) -->
            <div>
              <div class="checkout-scope ks-co-demo ks-co-demo--cards">
                <SavedCardRow method-id="card4" last4="3980" expiry="12/29" network="visa" :selected="true" @select="() => {}" />
              </div>
              <span class="ks-label">4. Selected (alt) — tinted background + focus styling</span>
            </div>

            <!-- 5. With remove action (destructive) -->
            <div>
              <div class="checkout-scope ks-co-demo ks-co-demo--cards">
                <div class="co-opt" style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-card-default); border: 1px solid var(--border-card-default); border-radius: var(--radius-container-s); padding: 12px;">
                  <div style="display: flex; align-items: center; gap: 11px; flex: 1;">
                    <span class="co-radio"><span class="d"></span></span>
                    <span class="co-cc">
                      <svg width="20" height="13" viewBox="0 0 20 13" fill="none"><rect x="0.5" y="0.5" width="19" height="12" rx="1.5" fill="white" stroke="currentColor" stroke-opacity="0.1"/><rect x="2" y="3" width="2.5" height="2" fill="currentColor"/><rect x="7" y="3" width="9" height="2" fill="currentColor"/><rect x="2" y="7" width="14" height="1.5" fill="currentColor"/></svg>
                    </span>
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 14px; font-weight: 500; color: var(--text-body-default);">*3980</span>
                      <span style="font-size: 11px; color: var(--text-body-subtle); margin-top: 2px;">Expires 12/29</span>
                    </div>
                  </div>
                  <button style="background: none; border: none; color: #cc0705; font-size: 13px; font-weight: 500; cursor: pointer; padding: 0; font-family: inherit;">Remove</button>
                </div>
              </div>
              <span class="ks-label">5. With remove action — destructive button</span>
            </div>
          </div>
        </div>

        <!-- ── 2.4 ExternalRow ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">ExternalRow <span class="ks-meta">PaymentMethods/ExternalRow.vue — region: co-payments</span></h3>
          <p class="ks-desc">Google Pay, Apple Pay, PayPal, Cash App. <code>wallet</code> flag = white logo bg; <code>cash</code> flag = green coin pill.</p>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--checkout">
              <div class="checkout-scope ks-co-demo">
                <ExternalRow method-id="google_pay" label="Google Pay" logo-key="google-pay" :wallet="true" :selected="externalSelected" @select="externalSelected = !externalSelected" />
              </div>
              <span class="ks-label">wallet — {{ externalSelected ? 'selected' : 'unselected' }} — click to toggle</span>
            </div>
            <div class="ks-demo-item ks-demo-item--checkout">
              <div class="checkout-scope ks-co-demo">
                <ExternalRow method-id="cash_app" label="Cash App" logo-key="cash-app" :cash="true" :selected="false" @select="() => {}" />
              </div>
              <span class="ks-label">cash — unselected</span>
            </div>
          </div>
        </div>

        <!-- ── 2.5 NewCardRow ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">NewCardRow <span class="ks-meta">PaymentMethods/NewCardRow.vue — region: co-payments</span></h3>
          <p class="ks-desc">"Add a new card" row. Shows MC/Visa/Amex logos. Expands full card form (number, expiry, CVV stack) on select.</p>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--checkout">
              <div class="checkout-scope ks-co-demo">
                <NewCardRow method-id="add_card" :networks="['mastercard','visa','amex']" :selected="newCardSelected" @select="newCardSelected = !newCardSelected" />
              </div>
              <span class="ks-label">{{ newCardSelected ? 'selected (form expanded)' : 'collapsed' }} — click to toggle</span>
            </div>
          </div>
        </div>

        <!-- ── 2.6 ActionBar ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">ActionBar <span class="ks-meta">ActionBar.vue — region: co-action</span></h3>
          <p class="ks-desc">Sticky bottom bar. Gradient fade above via <code>::before</code>. Pay button uses <code>--bg-action-primary</code> + <code>--radius-control-full</code>.</p>
          <div class="ks-row ks-row--wrap">
            <div class="ks-demo-item ks-demo-item--checkout">
              <!-- ActionBar uses position:absolute so we inline-render it statically here -->
              <div class="checkout-scope ks-co-demo ks-co-demo--actionbar-static">
                <div class="co-actionbar" style="position:relative;bottom:auto;left:auto;right:auto">
                  <button class="co-paybtn">Pay • USD 3.99</button>
                  <p class="co-legal">
                    This product is sold by Coda US LLC. By continuing, you agree to Coda US LLC
                    <a href="#" @click.prevent>Terms and Conditions</a> and
                    <a href="#" @click.prevent>Privacy Policy</a>.
                  </p>
                </div>
              </div>
              <span class="ks-label">state: default (position:relative override for demo)</span>
            </div>
          </div>
        </div>

        <!-- ── 2.7 Full checkout preview ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">Full Checkout <span class="ks-meta">CheckoutRoot — all regions composed</span></h3>
          <div class="ks-phone-stage">
            <div class="phone">
              <div class="phone-screen">
                <CheckoutRoot :config="RIFT_RACING_FIXTURE" :tokens-css="tokensCss" />
              </div>
            </div>
          </div>
        </div>

        <!-- ── 2.8 Component map table ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">Full Component Map <span class="ks-meta">packages/checkout-ui — CHECKOUT_COMPONENT_MAP</span></h3>
          <div class="ks-table-wrap">
            <table class="ks-table">
              <thead>
                <tr>
                  <th>Component</th>
                  <th>File</th>
                  <th>Region</th>
                  <th>CSS classes</th>
                  <th>States</th>
                  <th>Tokens</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in CHECKOUT_COMPONENT_MAP" :key="c.id">
                  <td class="mono" style="font-weight:600">{{ c.name }}</td>
                  <td class="mono">{{ c.file }}</td>
                  <td><span class="chip chip--neutral mono">{{ c.region }}</span></td>
                  <td>
                    <div class="ks-chips">
                      <span v-for="cls in c.cssClasses" :key="cls" class="chip chip--neutral mono">{{ cls }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="ks-chips">
                      <span v-for="s in c.states" :key="s" class="chip chip--neutral">{{ s }}</span>
                    </div>
                  </td>
                  <td>
                    <div class="ks-chips">
                      <span v-for="t in c.tokens" :key="t" class="chip chip--neutral mono" style="display:inline-flex;align-items:center;gap:4px">
                        <span class="ks-token-swatch ks-token-swatch--inline" :style="{ background: (activeTokens as unknown as Record<string,string>)[t] ?? 'transparent' }" />
                        {{ t }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── 2.9 Region map ── -->
        <div class="ks-group">
          <h3 class="ks-group-title">Region Map <span class="ks-meta">from design-system-map.ts CHECKOUT_REGION_MAP</span></h3>
          <div class="ks-table-wrap">
            <table class="ks-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Region</th>
                  <th>Config path</th>
                  <th>Edit target</th>
                  <th>Tokens consumed</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="region in CHECKOUT_REGION_MAP" :key="region.id">
                  <td class="mono">{{ region.id }}</td>
                  <td>{{ region.region }}</td>
                  <td class="mono">{{ region.configPath }}</td>
                  <td>
                    <span :class="region.editTarget ? 'chip chip--positive' : 'chip chip--neutral'">
                      {{ region.editTarget ? 'yes' : 'no' }}
                    </span>
                  </td>
                  <td>
                    <div class="ks-chips">
                      <span v-for="t in region.tokens" :key="t" class="chip chip--neutral mono">{{ t }}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* ── Layout ── */
.ks {
  min-height: 100%;
  background: var(--coda-surface-bg);
  font-family: 'Inter', system-ui, sans-serif;
  color: var(--coda-text-primary);
}

.ks-header {
  display: flex;
  align-items: flex-start;
  gap: var(--coda-sp-16);
  padding: var(--coda-sp-24) var(--coda-sp-24) var(--coda-sp-16);
  background: var(--coda-surface-panel);
  border-bottom: 1px solid var(--coda-surface-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.ks-back {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-4);
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--coda-surface-border);
  border-radius: var(--coda-radius-s);
  font-size: 13px;
  color: var(--coda-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  margin-top: 2px;
}
.ks-back:hover { background: var(--coda-hover); }

.ks-title-block { flex: 1; }

.ks-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--coda-text-primary);
  margin-bottom: 4px;
}

.ks-subtitle {
  font-size: 13px;
  color: var(--coda-text-secondary);
}

.ks-ds-legend {
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-4);
  flex-shrink: 0;
}

.ks-body {
  padding: var(--coda-sp-24);
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-24);
}

/* ── DS Section ── */
.ks-section {
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-16);
}

.ks-section-label {
  padding: var(--coda-sp-16) var(--coda-sp-20);
  border-radius: var(--coda-radius-l);
  border-left: 4px solid;
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-4);
}

.ks-section-label--chrome {
  background: #eef0ff;
  border-color: var(--coda-primary);
}

.ks-section-label--whitelabel {
  background: #f0fdf4;
  border-color: #16a34a;
}

.ks-section-label h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--coda-text-primary);
}

.ks-section-label p {
  font-size: 13px;
  color: var(--coda-text-secondary);
}

/* ── Group ── */
.ks-group {
  background: var(--coda-surface-panel);
  border-radius: var(--coda-radius-l);
  padding: var(--coda-sp-16) var(--coda-sp-20);
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-12);
}

.ks-group-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--coda-text-primary);
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
  flex-wrap: wrap;
}

.ks-meta {
  font-size: 11px;
  font-weight: 400;
  color: var(--coda-text-muted);
}

/* ── Demo rows ── */
.ks-row {
  display: flex;
  gap: var(--coda-sp-16);
  align-items: flex-start;
}

.ks-row--wrap { flex-wrap: wrap; }

.ks-demo-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--coda-sp-6);
}

.ks-demo-item--wide { min-width: 220px; flex: 1; max-width: 340px; }

.ks-label {
  font-size: 11px;
  color: var(--coda-text-muted);
  font-style: italic;
}

/* ── Badges ── */
.ks-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.ks-badge--chrome {
  background: rgba(16, 42, 248, 0.1);
  color: var(--coda-primary);
}

.ks-badge--whitelabel {
  background: #dcfce7;
  color: #15803d;
}

/* ── Buttons (demo) ── */
.btn {
  padding: 7px 14px;
  border-radius: var(--coda-radius-s);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.btn--primary {
  background: var(--coda-primary);
  color: white;
}
.btn--primary:hover:not(:disabled) { background: #0d22d4; }

.btn--secondary {
  background: var(--coda-surface-bg);
  color: var(--coda-text-secondary);
  border-color: var(--coda-surface-border);
}
.btn--secondary:hover:not(:disabled) { background: var(--coda-hover); }

.btn--ghost {
  background: none;
  color: var(--coda-primary);
  border-color: transparent;
}
.btn--ghost:hover { text-decoration: underline; }

.btn--destructive {
  background: #fff0f0;
  color: #cc0705;
  border-color: #ffd7d7;
}
.btn--destructive:hover:not(:disabled) { background: #ffd7d7; }

.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── IconButton ── */
.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--coda-surface-bg);
  border: 1px solid var(--coda-surface-border);
  border-radius: var(--coda-radius-s);
  color: var(--coda-text-secondary);
  cursor: pointer;
}
.icon-btn:hover:not(:disabled) { background: var(--coda-hover); color: var(--coda-text-primary); }
.icon-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Input extras ── */
.field__input--error {
  border-color: #cc0705 !important;
  background: #fff0f0;
}
.field__error {
  font-size: 11px;
  color: #cc0705;
}

/* ── Mode tabs ── */
.mode-tabs {
  display: inline-flex;
  background: var(--coda-surface-bg);
  border-radius: var(--coda-radius-m);
  padding: 3px;
  gap: 2px;
}

.mode-tab {
  background: none;
  border: none;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--coda-text-muted);
  border-radius: calc(var(--coda-radius-m) - 2px);
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
}

.mode-tab--active {
  background: var(--coda-surface-panel);
  color: var(--coda-text-primary);
  box-shadow: var(--coda-shadow-panel);
}

/* ── Chips ── */
.chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
}

.chip--positive { background: #dcfce7; color: #166534; }
.chip--negative { background: #fef2f2; color: #991b1b; }
.chip--neutral  { background: var(--coda-surface-bg); color: var(--coda-text-secondary); border: 1px solid var(--coda-surface-border); }
.chip--warning  { background: #fffbeb; color: #92400e; }

.ks-chips { display: flex; flex-wrap: wrap; gap: 4px; }

/* ── Method list demo ── */
.method-list {
  border: 1px solid var(--coda-surface-border);
  border-radius: var(--coda-radius-m);
  overflow: hidden;
  width: 100%;
}

.method-row {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
  padding: var(--coda-sp-8) var(--coda-sp-12);
  border-bottom: 1px solid var(--coda-surface-border);
}
.method-row:last-child { border-bottom: none; }
.method-row--hover { background: var(--coda-hover); }
.method-row--unmatched { background: #fffbeb; }

.method-row__drag { color: var(--coda-text-muted); cursor: grab; }
.method-row__logo { flex-shrink: 0; }
.method-row__label { flex: 1; font-size: 13px; font-weight: 500; }
.method-row__type { font-size: 11px; color: var(--coda-text-muted); }

/* ── Snackbar ── */
.snackbar-demo {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
  padding: var(--coda-sp-12) var(--coda-sp-16);
  border-radius: var(--coda-radius-m);
  font-size: 13px;
  font-weight: 500;
}

.snackbar-demo--positive { background: #1a2e1a; color: #86efac; }
.snackbar-demo--critical { background: #2e1a1a; color: #fca5a5; }

/* ── Dialog ── */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: var(--coda-surface-panel);
  border-radius: var(--coda-radius-l);
  padding: var(--coda-sp-24);
  width: 400px;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-16);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dialog__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--coda-text-primary);
}

.dialog__body {
  font-size: 13px;
  line-height: 1.6;
  color: var(--coda-text-secondary);
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--coda-sp-8);
}

/* ── Tooltip ── */
.tooltip-wrap {
  position: relative;
  display: inline-flex;
}

.tooltip {
  display: none;
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #0d0d1a;
  color: white;
  font-size: 11px;
  line-height: 1.5;
  padding: 6px 10px;
  border-radius: var(--coda-radius-s);
  white-space: nowrap;
  max-width: 200px;
  white-space: normal;
  pointer-events: none;
  z-index: 50;
}

.tooltip-wrap:hover .tooltip { display: block; }

/* ── Progress ── */
@keyframes spin { to { transform: rotate(360deg); } }

.progress-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--coda-surface-border);
  border-top-color: var(--coda-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.progress-bar-wrap {
  width: 200px;
  height: 4px;
  background: var(--coda-surface-border);
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--coda-primary);
  border-radius: 999px;
  transition: width 0.3s ease;
}

/* ── Table ── */
.ks-table-wrap {
  overflow-x: auto;
  border-radius: var(--coda-radius-m);
  border: 1px solid var(--coda-surface-border);
}

.ks-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.ks-table th {
  background: var(--coda-surface-bg);
  padding: 8px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--coda-text-secondary);
  border-bottom: 1px solid var(--coda-surface-border);
}

.ks-table td {
  padding: 7px 12px;
  border-bottom: 1px solid var(--coda-surface-border);
  vertical-align: top;
  color: var(--coda-text-primary);
}

.ks-table tr:last-child td { border-bottom: none; }

.ks-table-group-row td {
  background: var(--coda-surface-bg);
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--coda-text-muted);
  padding: 6px 12px;
}

.mono {
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 11px;
}

/* ── Phone preview ── */
.ks-theme-switch {
  display: inline-flex;
  background: var(--coda-surface-bg);
  border-radius: var(--coda-radius-m);
  padding: 3px;
  gap: 2px;
}

.ks-phone-stage {
  display: flex;
  justify-content: center;
  padding: 28px;
  background: radial-gradient(circle at 50% 0%, #EBEDF1, #E3E6EB);
  border-radius: var(--coda-radius-l);
}

.phone {
  width: 390px;
  height: 812px;
  flex-shrink: 0;
  border-radius: 44px;
  background: #000;
  padding: 11px;
  box-shadow: 0 24px 60px -12px rgba(20,24,40,.45), 0 0 0 1px rgba(0,0,0,.06);
}

.phone-screen {
  width: 100%;
  height: 100%;
  border-radius: 34px;
  overflow: hidden;
  position: relative;
}

/* ── Anatomy grid ── */
.ks-anatomy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: var(--coda-sp-12);
}

.ks-anatomy-card {
  border: 1px solid var(--coda-surface-border);
  border-radius: var(--coda-radius-m);
  overflow: hidden;
}

.ks-anatomy-card__header {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
  padding: var(--coda-sp-8) var(--coda-sp-12);
  background: var(--coda-surface-bg);
  border-bottom: 1px solid var(--coda-surface-border);
}

.ks-anatomy-card__name {
  font-size: 13px;
  font-weight: 600;
  color: var(--coda-text-primary);
}

.ks-anatomy-card__tokens {
  padding: var(--coda-sp-8) var(--coda-sp-12);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ks-anatomy-token {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--coda-sp-8);
}

.ks-anatomy-token dt {
  font-size: 11px;
  color: var(--coda-text-secondary);
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.ks-anatomy-swatch {
  flex-shrink: 0;
}

.ks-token-swatch {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.1);
}

.ks-token-swatch--inline {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

/* ── Checkout component demos ── */
.ks-demo-item--checkout { min-width: 340px; flex: 1; max-width: 440px; }

.ks-co-demo {
  border-radius: var(--coda-radius-l);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.08);
}

.ks-co-demo--nav {
  /* Navbar needs no extra height — just wraps content */
}

.ks-co-demo--actionbar-static {
  /* no special positioning needed — co-actionbar is overridden to relative */
}

.ks-co-demo--cards {
  /* Card rows demo container */
}

.ks-desc {
  font-size: 13px;
  color: var(--coda-text-secondary);
  line-height: 1.6;
  margin: 0;
}
</style>

<!-- panel-shared.css patterns used inline above — pulled in via the shared import -->
<style scoped src="../components/panels/panel-shared.css" />
