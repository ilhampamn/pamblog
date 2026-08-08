<script setup lang="ts">
import NetworkLogo from './NetworkLogo.vue';

defineProps<{
  methodId: string;
  last4: string;
  expiry: string;
  network: string;
  selected: boolean;
}>();

const emit = defineEmits<{ select: [] }>();
</script>

<template>
  <div
    class="co-opt"
    :class="{ sel: selected }"
    @click="emit('select')"
    @keydown.enter.space.prevent="emit('select')"
    role="radio"
    :aria-checked="selected"
    tabindex="0"
  >
    <div class="co-optrow">
      <span class="co-radio"><span class="d"></span></span>
      <span class="co-cc">
        <NetworkLogo :logo-key="network" :size="20" />
      </span>
      <div class="co-body">
        <span class="co-label">*{{ last4 }}</span>
        <span class="co-meta">Expires {{ expiry }}</span>
      </div>
    </div>

    <!-- co-fields-clip handles the collapse animation; co-fields renders freely (no overflow clip) -->
    <div class="co-fields-clip">
      <div class="co-fields">
        <div class="co-field">
          <div class="co-input">
            <input id="co-cvv-saved" type="text" inputmode="numeric" maxlength="4" placeholder=" " autocomplete="cc-csc" @click.stop />
            <label class="co-flabel" for="co-cvv-saved">CVV</label>
            <svg class="cvvico" width="20" height="14" viewBox="0 0 24 18" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <rect x="1" y="1" width="22" height="16" rx="2"/>
              <line x1="1" y1="6" x2="23" y2="6"/>
            </svg>
          </div>
        </div>
        <div class="co-field">
          <div class="co-input">
            <input id="co-zip-saved" type="text" inputmode="numeric" value="90210" placeholder=" " @click.stop />
            <label class="co-flabel" for="co-zip-saved">ZIP Code</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.co-opt {
  background: var(--ov-card-bg, var(--bg-card-default));
  border: var(--ov-card-border-width, 1px) solid var(--ov-card-border-color, var(--border-card-default));
  border-radius: var(--ov-card-radius, var(--radius-container-s));
  padding: 12px;
  cursor: pointer;
  transition: background .2s ease, border-color .2s ease;
}

.co-opt.sel {
  background: var(--ov-cardsel-bg, var(--bg-card-selected-gradient, var(--bg-card-selected)));
  border-color: var(--ov-cardsel-border-color, var(--border-input-focused));
  border-width: var(--ov-cardsel-border-width, var(--border-weight-selected));
  box-shadow: var(--shadow-card-selected, none);
}

.co-optrow {
  display: flex;
  align-items: center;
  gap: 11px;
}

.co-radio {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--border-input-default);
  flex-shrink: 0;
  display: grid;
  place-items: center;
  transition: border-color .15s ease;
}

.co-opt.sel .co-radio { border-color: var(--bg-action-primary); }

.co-radio .d {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--bg-action-primary);
  transform: scale(0);
  transition: transform .15s cubic-bezier(.2,0,0,1);
}

.co-opt.sel .co-radio .d { transform: scale(1); }

.co-cc {
  width: 38px;
  height: 24px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  /* No background/border/shadow — logos display on transparent */
}

.co-cc.wallet { width: 40px; height: 28px; }

/* Scale logos to fit their container — overrides the inline :size prop */
.co-cc .network-logo {
  max-width: 100% !important;
  max-height: 100% !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain;
  display: block;
}

/* Dark-logo inversion: auto-adapts when --co-bg-is-dark flips to 1 */
.co-cc--dark-logo .network-logo {
  filter: invert(var(--co-bg-is-dark, 0));
}

.co-body {
  display: flex;
  flex-direction: column;
}

.co-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-body-default);
}

.co-meta {
  font-size: 11px;
  color: var(--text-body-subtle);
  margin-top: 2px;
}

.co-mname {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-body-default);
}

.co-logos {
  display: flex;
  gap: 6px;
}

.co-logos .co-cc {
  width: 32px;
  height: 20px;
}

/* Clip wrapper — grid-rows reveal: animates real content height, no magic max-height number.
   At rest (1fr) the row equals natural content height so overflow:hidden has nothing to clip. */
.co-fields-clip {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  margin-top: 0;
  transition: grid-template-rows .3s ease, opacity .2s ease, margin-top .3s ease;
}

.co-opt.sel .co-fields-clip {
  grid-template-rows: 1fr;
  opacity: 1;
  margin-top: 12px;
}

/* Grid item: overflow:hidden + min-height:0 lets the row collapse to 0.
   padding-bottom is a real token (4px) — robust against sub-pixel rounding at any DPR. */
.co-fields-clip > .co-fields {
  overflow: hidden;
  min-height: 0;
}

.co-fields {
  display: flex;
  gap: 12px;
  padding-bottom: var(--gap-content-narrow);
}

.co-fields.stack { flex-direction: column; }

.co-hint {
  overflow: hidden;
  max-height: 0;
  opacity: 0;
  font-size: 11px;
  color: var(--text-body-subtle);
  padding-left: 31px;
  transition: max-height .25s ease, opacity .2s ease, margin-top .25s ease;
}

.co-opt.sel .co-hint {
  max-height: 30px;
  opacity: 1;
  margin-top: 8px;
}

.co-field { flex: 1; min-width: 0; }

.co-input {
  position: relative;
  width: 100%;
  height: 52px;
  background: var(--ov-input-bg, var(--bg-input-default));
  border: 1px solid var(--ov-input-border-color, var(--border-input-default));
  border-radius: var(--ov-input-radius, var(--radius-input-m));
  padding: 0 12px;
  color: var(--text-body-default);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: border-color .15s ease, box-shadow .15s ease;
  box-sizing: border-box;
}

.co-input:focus-within { border-color: var(--border-input-focused); }

.co-input input {
  flex: 1;
  min-width: 0;
  align-self: stretch;
  padding: 20px 0 4px;
  background: none;
  border: none;
  outline: none;
  color: var(--text-body-default);
  font-size: 13px;
  font-family: inherit;
}

/* Floating label — sits centered as placeholder, rises when focused or filled */
.co-flabel {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: var(--text-placeholder);
  pointer-events: none;
  white-space: nowrap;
  transition: top .15s ease, transform .15s ease, font-size .15s ease, color .15s ease;
}

.co-input:focus-within .co-flabel,
.co-input input:not(:placeholder-shown) ~ .co-flabel {
  top: 9px;
  transform: translateY(0);
  font-size: 10px;
  color: var(--text-body-subtle);
}

@media (prefers-reduced-motion: reduce) {
  .co-flabel { transition: none; }
}

.cvvico { color: var(--text-body-subtle); flex-shrink: 0; margin-left: auto; }

.co-cash {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #00D632;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 800;
  flex-shrink: 0;
}
</style>
