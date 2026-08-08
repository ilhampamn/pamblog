import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CheckoutConfig } from '@codapay/config-schema';
import { RIFT_RACING_FIXTURE } from '@codapay/config-schema';

export type ConfigSection = 'navbar' | 'product' | 'rewards' | 'payments' | 'theme' | 'components';

export const useConfigStore = defineStore('config', () => {
  const config = ref<CheckoutConfig>(structuredClone(RIFT_RACING_FIXTURE));
  const activeSection = ref<ConfigSection>('product');
  const isDirty = ref(false);

  // Undo/redo history
  const history = ref<CheckoutConfig[]>([structuredClone(RIFT_RACING_FIXTURE)]);
  const historyIndex = ref(0);

  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  function pushHistory(snapshot: CheckoutConfig) {
    history.value = history.value.slice(0, historyIndex.value + 1);
    history.value.push(structuredClone(snapshot));
    historyIndex.value = history.value.length - 1;
    isDirty.value = true;
  }

  function updateConfig(patch: Partial<CheckoutConfig>) {
    config.value = { ...config.value, ...patch };
    pushHistory(config.value);
  }

  function updateSection<K extends keyof CheckoutConfig>(
    section: K,
    patch: Partial<CheckoutConfig[K]>
  ) {
    (config.value[section] as object) = {
      ...(config.value[section] as object),
      ...patch,
    };
    pushHistory(config.value);
  }

  function undo() {
    if (!canUndo.value) return;
    historyIndex.value--;
    config.value = structuredClone(history.value[historyIndex.value]);
  }

  function redo() {
    if (!canRedo.value) return;
    historyIndex.value++;
    config.value = structuredClone(history.value[historyIndex.value]);
  }

  function reset() {
    config.value = structuredClone(RIFT_RACING_FIXTURE);
    history.value = [structuredClone(RIFT_RACING_FIXTURE)];
    historyIndex.value = 0;
    isDirty.value = false;
  }

  function setActiveSection(section: ConfigSection) {
    activeSection.value = section;
  }

  return {
    config,
    activeSection,
    isDirty,
    canUndo,
    canRedo,
    updateConfig,
    updateSection,
    undo,
    redo,
    reset,
    setActiveSection,
  };
});
