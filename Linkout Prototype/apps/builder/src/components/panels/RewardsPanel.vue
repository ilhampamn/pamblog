<script setup lang="ts">
import { computed } from 'vue';
import { useConfigStore } from '../../stores/config.ts';

const store = useConfigStore();
const cfg = computed(() => store.config.rewards);

function update(patch: Partial<typeof cfg.value>) {
  store.updateSection('rewards', patch);
}
</script>

<template>
  <div class="panel">
    <div class="panel__section">
      <div class="field field--row">
        <label class="field__label" for="rewards-toggle">Show rewards strip</label>
        <button
          id="rewards-toggle"
          class="toggle"
          :class="{ 'toggle--on': cfg.enabled }"
          role="switch"
          :aria-checked="cfg.enabled"
          @click="update({ enabled: !cfg.enabled })"
        >
          <span class="toggle__thumb" />
        </button>
      </div>
    </div>

    <template v-if="cfg.enabled">
      <div class="panel__section">
        <h4 class="panel__section-title">Rewards Display</h4>

        <div class="field">
          <label class="field__label" for="rewards-label">Label text</label>
          <input
            id="rewards-label"
            class="field__input"
            type="text"
            :value="cfg.label"
            placeholder="Earn"
            @input="update({ label: ($event.target as HTMLInputElement).value })"
          />
        </div>

        <div class="field">
          <label class="field__label" for="rewards-amount">Coin amount</label>
          <input
            id="rewards-amount"
            class="field__input field__input--number"
            type="number"
            min="0"
            :value="cfg.amount"
            @input="update({ amount: parseInt(($event.target as HTMLInputElement).value) || 0 })"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped src="./panel-shared.css" />
