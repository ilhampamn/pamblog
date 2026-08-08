<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '../../stores/config.ts';

const store = useConfigStore();
const cfg = computed(() => store.config.product);

function update(patch: Partial<typeof cfg.value>) {
  store.updateSection('product', patch);
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'SGD', 'MYR', 'IDR', 'THB', 'PHP'];

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) { const r = new FileReader(); r.onload = () => update({ image: r.result as string }); r.readAsDataURL(file); }
}
</script>

<template>
  <div class="panel">
    <div class="panel__section">
      <h4 class="panel__section-title">Product Info</h4>

      <div class="field">
        <label class="field__label" for="product-name">Product name</label>
        <input
          id="product-name"
          class="field__input"
          type="text"
          :value="cfg.name"
          placeholder="e.g. Supercar Game Pack"
          @input="update({ name: ($event.target as HTMLInputElement).value })"
        />
      </div>

      <div class="field">
        <label class="field__label">Product image</label>
        <div class="uploader">
          <div v-if="cfg.image" class="uploader__preview">
            <img :src="cfg.image" alt="Product image" />
            <button class="uploader__remove" @click="update({ image: null })">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
          </div>
          <label v-else class="uploader__zone" for="product-img-upload">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Drop image or <u>browse</u></span>
            <input id="product-img-upload" type="file" accept="image/*" class="uploader__input" @change="handleImageUpload" />
          </label>
        </div>
      </div>
    </div>

    <div class="panel__section">
      <h4 class="panel__section-title">Pricing</h4>

      <div class="field">
        <label class="field__label" for="product-currency">Currency</label>
        <select
          id="product-currency"
          class="field__select"
          :value="cfg.currency"
          @change="update({ currency: ($event.target as HTMLSelectElement).value })"
        >
          <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="field-row">
        <div class="field">
          <label class="field__label" for="product-price">Final price</label>
          <input
            id="product-price"
            class="field__input field__input--number"
            type="number"
            min="0"
            step="0.01"
            :value="cfg.finalPrice"
            @input="update({ finalPrice: parseFloat(($event.target as HTMLInputElement).value) || 0 })"
          />
        </div>
        <div class="field">
          <label class="field__label" for="product-original">Original price</label>
          <input
            id="product-original"
            class="field__input field__input--number"
            type="number"
            min="0"
            step="0.01"
            :value="cfg.originalPrice ?? ''"
            placeholder="None"
            @input="update({ originalPrice: ($event.target as HTMLInputElement).value ? parseFloat(($event.target as HTMLInputElement).value) : null })"
          />
        </div>
      </div>

      <div class="field field--row">
        <label class="field__label" for="product-tax">Tax included</label>
        <button
          id="product-tax"
          class="toggle"
          :class="{ 'toggle--on': cfg.taxIncluded }"
          role="switch"
          :aria-checked="cfg.taxIncluded"
          @click="update({ taxIncluded: !cfg.taxIncluded })"
        >
          <span class="toggle__thumb" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./panel-shared.css" />
<style scoped>
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}
</style>
