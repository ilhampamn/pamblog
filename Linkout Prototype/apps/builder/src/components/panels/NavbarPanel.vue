<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '../../stores/config.ts';

const store = useConfigStore();
const cfg = computed(() => store.config.navbar);

function update(patch: Partial<typeof cfg.value>) {
  store.updateSection('navbar', patch);
}

function handleLogoUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) { const r = new FileReader(); r.onload = () => update({ logo: r.result as string }); r.readAsDataURL(file); }
}
</script>

<template>
  <div class="panel">
    <div class="panel__section">
      <h4 class="panel__section-title">Logo</h4>

      <div class="field">
        <label class="field__label" for="navbar-alt">Brand name / Alt text</label>
        <input
          id="navbar-alt"
          class="field__input"
          type="text"
          :value="cfg.altText"
          placeholder="Your brand name"
          @input="update({ altText: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <div class="field">
        <label class="field__label">Logo image</label>
        <div class="uploader" :class="{ 'uploader--has-image': !!cfg.logo }">
          <div v-if="cfg.logo" class="uploader__preview">
            <img :src="cfg.logo" alt="Logo preview" />
            <button class="uploader__remove" @click="update({ logo: null })">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <label v-else class="uploader__zone" for="logo-upload">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Drop PNG/SVG or <u>browse</u></span>
            <input id="logo-upload" type="file" accept="image/*" class="uploader__input" @change="handleLogoUpload" />
          </label>
        </div>
      </div>
    </div>

    <div class="panel__section">
      <h4 class="panel__section-title">Language</h4>
      <div class="field field--row">
        <label class="field__label" for="navbar-lang-toggle">Show language selector</label>
        <button
          id="navbar-lang-toggle"
          class="toggle"
          :class="{ 'toggle--on': cfg.showLanguageToggle }"
          role="switch"
          :aria-checked="cfg.showLanguageToggle"
          @click="update({ showLanguageToggle: !cfg.showLanguageToggle })"
        >
          <span class="toggle__thumb" />
        </button>
      </div>

      <div v-if="cfg.showLanguageToggle" class="field">
        <label class="field__label" for="navbar-locale">Default locale</label>
        <select
          id="navbar-locale"
          class="field__select"
          :value="cfg.locale"
          @change="update({ locale: ($event.target as HTMLSelectElement).value })"
        >
          <option value="en">EN — English</option>
          <option value="id">ID — Indonesian</option>
          <option value="th">TH — Thai</option>
          <option value="zh">ZH — Chinese</option>
          <option value="ms">MS — Malay</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped src="./panel-shared.css" />
