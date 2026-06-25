<script setup lang="ts">
import { useConfigStore, type ConfigSection } from '../../stores/config.ts';

const config = useConfigStore();

const SECTIONS: Array<{ id: ConfigSection; label: string; icon: string; desc: string }> = [
  { id: 'navbar',   label: 'Navigation Bar', icon: 'navbar',    desc: 'Logo, language, branding' },
  { id: 'product',  label: 'Product',         icon: 'product',   desc: 'Name, price, image, discount' },
  { id: 'rewards',  label: 'Rewards',          icon: 'rewards',   desc: 'Earn coins display' },
  { id: 'payments', label: 'Payment Methods',  icon: 'payments',  desc: 'Order, visibility, defaults' },
  { id: 'theme',    label: 'Theme & Tokens',   icon: 'theme',     desc: 'Colors, typography, radii' },
];
</script>

<template>
  <nav class="config-tree" aria-label="Configuration sections">
    <p class="config-tree__heading">Configure</p>
    <ul class="config-tree__list">
      <li v-for="section in SECTIONS" :key="section.id">
        <button
          class="config-tree__item"
          :class="{ 'config-tree__item--active': config.activeSection === section.id }"
          :aria-current="config.activeSection === section.id ? 'page' : undefined"
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
  padding: var(--coda-sp-16) var(--coda-sp-8);
}

.config-tree__heading {
  font-size: 11px;
  font-weight: 600;
  color: var(--coda-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 var(--coda-sp-8);
  margin-bottom: var(--coda-sp-6);
}

.config-tree__list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.config-tree__item {
  display: flex;
  align-items: center;
  gap: var(--coda-sp-8);
  width: 100%;
  padding: var(--coda-sp-8) var(--coda-sp-8);
  background: none;
  border: none;
  border-radius: var(--coda-radius-m);
  color: var(--coda-text-secondary);
  text-align: left;
  transition: all 0.12s ease;
}

.config-tree__item:hover {
  background: var(--coda-hover);
  color: var(--coda-text-primary);
}

.config-tree__item--active {
  background: var(--coda-selected);
  color: var(--coda-primary);
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
  font-size: 13px;
  font-weight: 500;
  color: inherit;
}

.config-tree__desc {
  font-size: 11px;
  color: var(--coda-text-muted);
}

.config-tree__item--active .config-tree__desc {
  color: rgba(16, 42, 248, 0.6);
}

.config-tree__arrow {
  opacity: 0;
  transition: opacity 0.12s ease;
  color: var(--coda-text-muted);
}

.config-tree__item:hover .config-tree__arrow,
.config-tree__item--active .config-tree__arrow {
  opacity: 1;
}
</style>
