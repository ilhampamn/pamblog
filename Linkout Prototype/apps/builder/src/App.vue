<script setup lang="ts">
import { ref, computed } from 'vue';
import TopBar from './components/shell/TopBar.vue';
import ConfigTree from './components/shell/ConfigTree.vue';
import PreviewPane from './components/shell/PreviewPane.vue';
import NavbarPanel from './components/panels/NavbarPanel.vue';
import ProductPanel from './components/panels/ProductPanel.vue';
import RewardsPanel from './components/panels/RewardsPanel.vue';
import PaymentsPanel from './components/panels/PaymentsPanel.vue';
import ThemePanel from './components/panels/ThemePanel.vue';
import ComponentsPanel from './components/panels/ComponentsPanel.vue';
import KitchenSink from './views/KitchenSink.vue';
import { useConfigStore } from './stores/config.ts';
import { useThemeStore } from './stores/theme.ts';
import { CodaButton, CodaIconButton } from '@codapay/ui-coda';

const configStore = useConfigStore();
const themeStore = useThemeStore();

type Mode = 'edit' | 'preview';
const mode = ref<Mode>('edit');
const showKitchenSink = ref(false);

const showResetDialog = ref(false);
const showExportDialog = ref(false);

const exportContent = computed(() => {
  return {
    configJson: JSON.stringify(configStore.config, null, 2),
    tokensCss: themeStore.tokensCss,
  };
});

function handleReset() {
  showResetDialog.value = true;
}

function confirmReset() {
  configStore.reset();
  showResetDialog.value = false;
}

function handleExport() {
  if (themeStore.hasErrors) return;
  showExportDialog.value = true;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function downloadConfigJson() {
  downloadFile(exportContent.value.configJson, 'config.json', 'application/json');
}

function downloadTokensCss() {
  downloadFile(exportContent.value.tokensCss, 'tokens.css', 'text/css');
}

const PANEL_TITLES: Record<string, string> = {
  navbar: 'Navigation Bar',
  product: 'Product',
  rewards: 'Rewards',
  payments: 'Payment Methods',
  theme: 'Theme & Tokens',
  components: 'Components',
};
</script>

<template>
  <div class="builder">
    <TopBar
      :mode="mode"
      @mode-change="(m) => mode = m"
      @reset="handleReset"
      @export="handleExport"
      @kitchen-sink="showKitchenSink = true"
    />

    <!-- Kitchen Sink overlay -->
    <div v-if="showKitchenSink" class="ks-overlay">
      <KitchenSink @back="showKitchenSink = false" />
    </div>

    <div v-else class="builder__body" :class="{ 'builder__body--preview': mode === 'preview' }">
      <!-- Left rail: config tree -->
      <aside v-if="mode === 'edit'" class="builder__rail">
        <ConfigTree />
      </aside>

      <!-- Center: settings panel -->
      <main v-if="mode === 'edit'" class="builder__panel">
        <div class="builder__panel-inner">
          <h2 class="builder__panel-title">
            {{ PANEL_TITLES[configStore.activeSection] }}
          </h2>

          <div class="builder__panel-scroll">
            <NavbarPanel v-if="configStore.activeSection === 'navbar'" />
            <ProductPanel v-else-if="configStore.activeSection === 'product'" />
            <RewardsPanel v-else-if="configStore.activeSection === 'rewards'" />
            <PaymentsPanel v-else-if="configStore.activeSection === 'payments'" />
            <ThemePanel v-else-if="configStore.activeSection === 'theme'" />
            <ComponentsPanel v-else-if="configStore.activeSection === 'components'" />
          </div>
        </div>
      </main>

      <!-- Right: phone preview (always visible) -->
      <section class="builder__preview" :class="{ 'builder__preview--full': mode === 'preview' }">
        <PreviewPane />
      </section>
    </div>

    <!-- Reset confirmation dialog -->
    <Teleport to="body">
      <div v-if="showResetDialog" class="dialog-overlay" @click.self="showResetDialog = false">
        <div class="dialog" role="alertdialog" aria-modal="true" aria-labelledby="reset-title">
          <h3 id="reset-title" class="dialog__title">Reset to defaults?</h3>
          <p class="dialog__body">All unsaved changes will be lost. This cannot be undone.</p>
          <div class="dialog__actions">
            <CodaButton variant="secondary" @click="showResetDialog = false">Cancel</CodaButton>
            <CodaButton variant="critical" @click="confirmReset">Reset</CodaButton>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Export dialog -->
    <Teleport to="body">
      <div v-if="showExportDialog" class="dialog-overlay" @click.self="showExportDialog = false">
        <div class="dialog dialog--wide" role="dialog" aria-modal="true" aria-labelledby="export-title">
          <div class="dialog__header">
            <h3 id="export-title" class="dialog__title">Export Artifact</h3>
            <CodaIconButton size="sm" label="Close" @click="showExportDialog = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </CodaIconButton>
          </div>

          <div class="dialog__tabs">
            <div class="export-block">
              <div class="export-block__label">config.json</div>
              <pre class="export-block__code">{{ exportContent.configJson }}</pre>
            </div>
            <div class="export-block">
              <div class="export-block__label">tokens.css</div>
              <pre class="export-block__code">{{ exportContent.tokensCss }}</pre>
            </div>
          </div>

          <div class="dialog__actions">
            <CodaButton variant="secondary" @click="showExportDialog = false">Close</CodaButton>
            <CodaButton variant="primary" @click="downloadConfigJson">Download config.json</CodaButton>
            <CodaButton variant="primary" @click="downloadTokensCss">Download tokens.css</CodaButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.builder {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--color-background-secondary);
}

.ks-overlay {
  flex: 1;
  overflow-y: auto;
}

.builder__body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left rail */
.builder__rail {
  background: var(--color-background-primary);
  border-right: 1px solid var(--color-border-primary);
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

/* Center settings panel */
.builder__panel {
  width: 300px;
  background: var(--color-background-secondary);
  border-right: 1px solid var(--color-border-primary);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
}

.builder__panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.builder__panel-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--font-letter-spacing-wide);
  color: var(--color-text-primary);
  padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-sm);
  border-bottom: 1px solid var(--color-border-primary);
  background: var(--color-background-primary);
  flex-shrink: 0;
}

.builder__panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

/* Preview */
.builder__preview {
  flex: 1;
  overflow: hidden;
  background: var(--color-background-secondary);
}

.builder__preview--full {
  width: 100%;
}

/* Dialog */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.dialog {
  background: var(--color-background-primary);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-xl);
  max-width: 400px;
  width: 90%;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.dialog--wide { max-width: 720px; max-height: 80vh; overflow: hidden; }

.dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  letter-spacing: var(--font-letter-spacing-wide);
  color: var(--color-text-primary);
}

.dialog__body {
  font-size: var(--font-size-md);
  color: var(--color-text-primary-lighter);
  line-height: 1.5;
}

.dialog__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  overflow: hidden;
}

.export-block {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  overflow: hidden;
}

.export-block__label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary-lightest);
  text-transform: uppercase;
  letter-spacing: var(--font-letter-spacing-wider);
}

.export-block__code {
  flex: 1;
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--border-radius-xs);
  padding: var(--spacing-md);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-jet-brains-mono);
  color: var(--color-text-primary-lighter);
  overflow: auto;
  max-height: 300px;
  white-space: pre;
  margin: 0;
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}
</style>
