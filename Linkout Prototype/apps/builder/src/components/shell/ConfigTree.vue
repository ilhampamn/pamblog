<script setup lang="ts">
import { ref } from 'vue';
import { useConfigStore, type ConfigSection } from '../../stores/config.ts';
import { CodaIconButton } from '@codapay/ui-coda';

const config = useConfigStore();

const collapsed = ref(false);
function toggleCollapsed() {
  collapsed.value = !collapsed.value;
}

const SECTIONS: Array<{ id: ConfigSection; label: string; icon: string; desc: string }> = [
  { id: 'navbar',   label: 'Navigation Bar', icon: 'navbar',    desc: 'Logo, language, branding' },
  { id: 'product',  label: 'Product',         icon: 'product',   desc: 'Name, price, image, discount' },
  { id: 'rewards',  label: 'Rewards',          icon: 'rewards',   desc: 'Earn coins display' },
  { id: 'payments', label: 'Payment Methods',  icon: 'payments',  desc: 'Order, visibility, defaults' },
  { id: 'theme',    label: 'Theme & Tokens',   icon: 'theme',     desc: 'Colors, typography, radii' },
  { id: 'components', label: 'Components',      icon: 'components', desc: 'Per-component style overrides' },
];
</script>

<template>
  <nav
    class="config-tree"
    :class="{ 'config-tree--collapsed': collapsed }"
    aria-label="Configuration sections"
  >
    <div class="config-tree__top">
      <p class="config-tree__heading">Configure</p>
      <CodaIconButton
        size="sm"
        :label="collapsed ? 'Expand navigation' : 'Collapse navigation'"
        :title="collapsed ? 'Expand navigation' : 'Collapse navigation'"
        @click="toggleCollapsed"
      >
        <svg
          class="config-tree__collapse-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M9 4v16" stroke="currentColor" stroke-width="1.5"/>
        </svg>
      </CodaIconButton>
    </div>
    <ul class="config-tree__list">
      <li v-for="section in SECTIONS" :key="section.id">
        <button
          class="config-tree__item"
          :class="{ 'config-tree__item--active': config.activeSection === section.id }"
          :aria-current="config.activeSection === section.id ? 'page' : undefined"
          :title="collapsed ? section.label : undefined"
          @click="config.setActiveSection(section.id)"
        >
          <span class="config-tree__icon" aria-hidden="true">
            <!-- navbar -->
            <svg v-if="section.icon === 'navbar'" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="4" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="2" y="10" width="20" height="10" rx="1" stroke="currentColor" stroke-width="1.5"/></svg>
            <!-- product -->
            <svg v-else-if="section.icon === 'product'" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M9 3v18M3 9h6M3 15h6" stroke="currentColor" stroke-width="1.5"/></svg>
            <!-- rewards -->
            <svg v-else-if="section.icon === 'rewards'" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.5"/><path d="M12 7v10M9 9.5c0-1.1.9-2 2-2h2a2 2 0 1 1 0 4h-2a2 2 0 1 0 0 4h2a2 2 0 0 0 2-2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <!-- payments -->
            <svg v-else-if="section.icon === 'payments'" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 10h20" stroke="currentColor" stroke-width="1.5"/></svg>
            <!-- theme -->
            <svg v-else-if="section.icon === 'theme'" width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            <!-- components -->
            <svg v-else-if="section.icon === 'components'" width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.5"/></svg>
          </span>
          <div class="config-tree__text">
            <span class="config-tree__label">{{ section.label }}</span>
            <span class="config-tree__desc">{{ section.desc }}</span>
          </div>
          <svg class="config-tree__arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.config-tree {
  width: 240px;
  padding: var(--spacing-lg) var(--spacing-sm);
  transition: width 0.18s ease, padding 0.18s ease;
  overflow: hidden;
}

.config-tree--collapsed {
  width: 56px;
  padding: var(--spacing-lg) var(--spacing-2xs);
}

.config-tree__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-2xs) 0 var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.config-tree--collapsed .config-tree__top {
  justify-content: center;
  padding: 0;
}

.config-tree__heading {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-lightest);
  text-transform: uppercase;
  letter-spacing: var(--font-letter-spacing-wider);
  white-space: nowrap;
}

.config-tree--collapsed .config-tree__heading {
  display: none;
}

.config-tree__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xs);
}

.config-tree__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-primary-lighter);
  text-align: left;
  transition: all 0.12s ease;
}

.config-tree__item:hover {
  background: var(--color-background-control-primary-hover);
  color: var(--color-text-primary);
}

.config-tree__item--active {
  background: var(--color-background-control-secondary);
  color: var(--color-text-primary);
}

.config-tree__icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.config-tree__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.config-tree__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: inherit;
}

.config-tree__desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-primary-lightest);
}

.config-tree__item--active .config-tree__desc {
  color: var(--color-text-primary-lighter);
}

.config-tree__arrow {
  opacity: 0;
  transition: opacity 0.12s ease;
  color: var(--color-text-primary-lightest);
}

.config-tree__item:hover .config-tree__arrow,
.config-tree__item--active .config-tree__arrow {
  opacity: 1;
}

/* Collapsed: icons only */
.config-tree--collapsed .config-tree__item {
  justify-content: center;
  padding: var(--spacing-sm);
}

.config-tree--collapsed .config-tree__text,
.config-tree--collapsed .config-tree__arrow {
  display: none;
}
</style>
