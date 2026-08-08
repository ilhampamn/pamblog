<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '../../stores/config.ts';
import {
  COMPONENT_ROLES,
  BORDER_WIDTH_OPTIONS,
  RADIUS_OPTIONS,
  type ComponentRole,
  type StyleProp,
  type ComponentOverrides,
  type ComponentCss,
} from '@codapay/config-schema';
import { CodaButton } from '@codapay/ui-coda';

const config = useConfigStore();

const overrides = computed<ComponentOverrides>(
  () => (config.config.theme.componentOverrides ?? {}) as ComponentOverrides,
);

const componentCss = computed<ComponentCss>(
  () => (config.config.theme.componentCss ?? {}) as ComponentCss,
);

const anyOverride = computed(() =>
  Object.values(overrides.value).some((r) => r && Object.keys(r).length > 0) ||
  Object.values(componentCss.value).some((v) => v && v.trim() !== ''),
);

function roleOverrideCount(roleId: string): number {
  const r = overrides.value[roleId];
  const propCount = r ? Object.values(r).filter((v) => v != null && v !== '').length : 0;
  const cssCount = (componentCss.value[roleId] ?? '').trim() !== '' ? 1 : 0;
  return propCount + cssCount;
}

function cssValue(roleId: string): string {
  return componentCss.value[roleId] ?? '';
}

function hasCss(roleId: string): boolean {
  return cssValue(roleId).trim() !== '';
}

function propValue(roleId: string, propKey: string): string {
  return overrides.value[roleId]?.[propKey] ?? '';
}

function isOverridden(roleId: string, propKey: string): boolean {
  return propValue(roleId, propKey) !== '';
}

/** Deep-clone the current overrides so we never mutate store state in place. */
function cloneOverrides(): ComponentOverrides {
  const out: ComponentOverrides = {};
  for (const [roleId, props] of Object.entries(overrides.value)) {
    out[roleId] = { ...props };
  }
  return out;
}

function cloneCss(): ComponentCss {
  return { ...componentCss.value };
}

function commit(next: ComponentOverrides) {
  config.updateSection('theme', { componentOverrides: next });
}

function commitCss(next: ComponentCss) {
  config.updateSection('theme', { componentCss: next });
}

function setCss(roleId: string, value: string) {
  const next = cloneCss();
  if (value.trim() === '') {
    delete next[roleId];
  } else {
    next[roleId] = value;
  }
  commitCss(next);
}

function resetCss(roleId: string) {
  setCss(roleId, '');
}

function setProp(roleId: string, propKey: string, value: string) {
  const next = cloneOverrides();
  if (value === '' || value == null) {
    if (next[roleId]) {
      delete next[roleId][propKey];
      if (Object.keys(next[roleId]).length === 0) delete next[roleId];
    }
  } else {
    next[roleId] = { ...(next[roleId] ?? {}), [propKey]: value };
  }
  commit(next);
}

function resetProp(roleId: string, propKey: string) {
  setProp(roleId, propKey, '');
}

function resetRole(roleId: string) {
  const next = cloneOverrides();
  delete next[roleId];
  const nextCss = cloneCss();
  delete nextCss[roleId];
  config.updateSection('theme', { componentOverrides: next, componentCss: nextCss });
}

function resetAll() {
  config.updateSection('theme', { componentOverrides: {}, componentCss: {} });
}

/** Color inputs need a valid hex; fall back to a neutral gray when inheriting. */
function colorInputValue(roleId: string, prop: StyleProp): string {
  const v = propValue(roleId, prop.key);
  return v.startsWith('#') ? v.slice(0, 7) : '#888888';
}

function radiusLabel(value: string): string {
  return RADIUS_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

// Expose the imported catalog to the template
const roles: ComponentRole[] = COMPONENT_ROLES;
</script>

<template>
  <div class="panel">
    <div class="panel__section cp-intro">
      <p class="cp-hint">
        Override individual component styles. Any property left untouched inherits the global
        theme token. Use <strong>Reset</strong> to drop an override and return to the token.
      </p>
      <CodaButton
        v-if="anyOverride"
        variant="secondary"
        @click="resetAll"
      >
        Reset all overrides
      </CodaButton>
    </div>

    <div v-for="role in roles" :key="role.id" class="panel__section cp-role">
      <div class="cp-role__head">
        <div class="cp-role__titlewrap">
          <h4 class="panel__section-title cp-role__title">
            {{ role.label }}
            <span v-if="roleOverrideCount(role.id) > 0" class="cp-badge">
              {{ roleOverrideCount(role.id) }}
            </span>
          </h4>
          <p class="cp-role__desc">{{ role.description }}</p>
        </div>
        <button
          v-if="roleOverrideCount(role.id) > 0"
          class="cp-reset cp-reset--role"
          title="Reset this component to theme defaults"
          @click="resetRole(role.id)"
        >
          Reset
        </button>
      </div>

      <div
        v-for="prop in role.props"
        :key="prop.key"
        class="field cp-prop"
      >
        <label class="field__label cp-prop__label">
          <span class="cp-dot" :class="{ 'cp-dot--on': isOverridden(role.id, prop.key) }" aria-hidden="true"></span>
          {{ prop.label }}
          <button
            v-if="isOverridden(role.id, prop.key)"
            class="cp-reset"
            :title="`Reset ${prop.label} to theme default`"
            @click="resetProp(role.id, prop.key)"
          >
            ↺
          </button>
        </label>

        <!-- Color -->
        <div v-if="prop.type === 'color'" class="color-field">
          <div class="color-field__swatch" :class="{ 'color-field__swatch--inherit': !isOverridden(role.id, prop.key) }">
            <input
              type="color"
              :value="colorInputValue(role.id, prop)"
              @change="setProp(role.id, prop.key, ($event.target as HTMLInputElement).value)"
            />
          </div>
          <input
            class="color-field__hex"
            type="text"
            :value="propValue(role.id, prop.key)"
            placeholder="Inherits token"
            @change="setProp(role.id, prop.key, ($event.target as HTMLInputElement).value.trim())"
          />
        </div>

        <!-- Border width -->
        <select
          v-else-if="prop.type === 'borderWidth'"
          class="field__select"
          :value="propValue(role.id, prop.key)"
          @change="setProp(role.id, prop.key, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Inherit ({{ prop.fallback }})</option>
          <option v-for="w in BORDER_WIDTH_OPTIONS" :key="w" :value="w">{{ w === '0' ? 'None (0)' : w }}</option>
        </select>

        <!-- Radius -->
        <select
          v-else-if="prop.type === 'radius'"
          class="field__select"
          :value="propValue(role.id, prop.key)"
          @change="setProp(role.id, prop.key, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">Inherit</option>
          <option v-for="r in RADIUS_OPTIONS" :key="r.value" :value="r.value">{{ r.label }}</option>
        </select>
      </div>

      <!-- Advanced CSS escape hatch -->
      <details class="cp-adv" :open="hasCss(role.id)">
        <summary class="cp-adv__summary">
          <span class="cp-dot" :class="{ 'cp-dot--on': hasCss(role.id) }" aria-hidden="true"></span>
          Advanced CSS
          <button
            v-if="hasCss(role.id)"
            class="cp-reset"
            title="Clear advanced CSS"
            @click.stop.prevent="resetCss(role.id)"
          >
            ↺
          </button>
        </summary>
        <textarea
          class="cp-adv__ta"
          rows="4"
          spellcheck="false"
          :placeholder="`Raw CSS applied to ${role.selector}\nbackground: linear-gradient(90deg,#f0f,#0ff);\ntransform: skew(-4deg);`"
          :value="cssValue(role.id)"
          @change="setCss(role.id, ($event.target as HTMLTextAreaElement).value)"
        />
        <p class="cp-adv__note">
          Wrapped in <code>.checkout-scope {{ role.selector }} {…}</code>. Skips contrast checks — use with care.
        </p>
      </details>
    </div>
  </div>
</template>

<style scoped src="./panel-shared.css" />
<style scoped>
.cp-intro {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.cp-hint {
  font-size: var(--font-size-sm);
  line-height: 1.5;
  color: var(--color-text-primary-lighter);
  margin: 0;
}

.cp-role__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.cp-role__title {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0;
}

.cp-role__desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-lightest);
  margin: 2px 0 0;
}

.cp-badge {
  display: inline-grid;
  place-items: center;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: var(--border-radius-full);
  background: var(--color-background-control-button-primary-default);
  color: var(--color-text-primary-invert);
  font-size: 10px;
  font-weight: var(--font-weight-bold);
}

.cp-prop__label {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.cp-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-border-primary);
  flex-shrink: 0;
}

.cp-dot--on {
  background: var(--color-background-control-button-primary-default);
}

.cp-reset {
  background: none;
  border: none;
  padding: 0 var(--spacing-2xs);
  color: var(--color-text-link);
  font-size: var(--font-size-xs);
  cursor: pointer;
  line-height: 1;
}

.cp-reset--role {
  flex-shrink: 0;
  font-weight: var(--font-weight-medium);
}

.cp-reset:hover {
  text-decoration: underline;
}

.color-field__swatch--inherit {
  opacity: 0.4;
}

.cp-adv {
  margin-top: var(--spacing-sm);
  border-top: 1px dashed var(--color-border-primary);
  padding-top: var(--spacing-sm);
}

.cp-adv__summary {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-lighter);
  cursor: pointer;
  list-style: none;
  user-select: none;
}

.cp-adv__summary::-webkit-details-marker {
  display: none;
}

.cp-adv__ta {
  width: 100%;
  box-sizing: border-box;
  margin-top: var(--spacing-sm);
  background: var(--color-background-control-primary);
  border: 1px solid var(--color-border-control-primary);
  border-radius: var(--border-radius-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-jet-brains-mono);
  color: var(--color-text-primary);
  resize: vertical;
  outline: none;
}

.cp-adv__ta:focus {
  border-color: var(--color-border-control-primary-active);
}

.cp-adv__note {
  margin: var(--spacing-xs) 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-lightest);
  line-height: 1.4;
}

.cp-adv__note code {
  font-family: var(--font-family-jet-brains-mono);
  font-size: 10px;
  color: var(--color-text-primary-lighter);
}
</style>
