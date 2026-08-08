<script setup lang="ts">
import type { NavbarConfig } from '@codapay/config-schema';

defineProps<{ config: NavbarConfig }>();
</script>

<template>
  <div class="co-statusbar">
    <span>9:41</span>
    <span class="ic">
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
        <rect y="7" width="3" height="5" rx="1"/>
        <rect x="5" y="4" width="3" height="8" rx="1"/>
        <rect x="10" y="2" width="3" height="10" rx="1"/>
        <rect x="15" width="3" height="12" rx="1"/>
      </svg>
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="21" height="10" rx="2.5" stroke="currentColor" stroke-opacity=".5"/>
        <rect x="3" y="3" width="16" height="6" rx="1" fill="currentColor"/>
      </svg>
    </span>
  </div>

  <nav class="co-navbar">
    <div class="l">
      <button class="co-iconbtn" aria-label="Go back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <img v-if="config.logo" :src="config.logo" :alt="config.altText" class="co-logo" />
      <span v-else class="co-brand">{{ config.altText }}</span>
    </div>
    <span v-if="config.showLanguageToggle" class="co-lang">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
      </svg>
      {{ config.locale.toUpperCase() }}
    </span>
  </nav>
</template>

<style>
.co-statusbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 22px 6px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-header-default);
}
.co-statusbar .ic { display: flex; gap: 7px; align-items: center; }

.co-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: var(--ov-navbar-bg, var(--bg-navbar-blend, var(--bg-navbar)));
  backdrop-filter: var(--backdrop-blur-navbar, none);
  border-bottom: 1px solid var(--ov-navbar-border-color, var(--border-navbar));
}
.co-navbar .l { display: flex; align-items: center; gap: 12px; }

.co-iconbtn {
  background: none;
  border: none;
  color: var(--text-body-default);
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}

.co-logo { height: 24px; width: auto; display: block; max-width: 120px; object-fit: contain; }
.co-brand { color: var(--text-body-default); font-weight: 700; font-size: 16px; }

.co-lang {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-body-soft);
}
</style>
