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
import KitchenSink from './views/KitchenSink.vue';
import { useConfigStore } from './stores/config.ts';
import { useThemeStore } from './stores/theme.ts';

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
            <button class="dialog__btn dialog__btn--secondary" @click="showResetDialog = false">Cancel</button>
            <button class="dialog__btn dialog__btn--danger" @click="confirmReset">Reset</button>
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
            <button class="dialog__close" @click="showExportDialog = false" aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            </button>
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
            <button class="dialog__btn dialog__btn--secondary" @click="showExportDialog = false">Close</button>
            <button class="dialog__btn dialog__btn--primary" @click="downloadConfigJson">
              Download config.json
            </button>
            <button class="dialog__btn dialog__btn--primary" @click="downloadTokensCss">
              Download tokens.css
            </button>
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
  background: var(--coda-surface-bg);
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
  width: 220px;
  background: var(--coda-surface-panel);
  border-right: 1px solid var(--coda-surface-border);
  overflow-y: auto;
  flex-shrink: 0;
}

/* Center settings panel */
.builder__panel {
  width: 300px;
  background: var(--coda-surface-bg);
  border-right: 1px solid var(--coda-surface-border);
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
  font-size: 15px;
  font-weight: 600;
  color: var(--coda-text-primary);
  padding: var(--coda-sp-16) var(--coda-sp-16) var(--coda-sp-8);
  border-bottom: 1px solid var(--coda-surface-border);
  background: var(--coda-surface-panel);
  flex-shrink: 0;
}

.builder__panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: var(--coda-sp-12);
}

/* Preview */
.builder__preview {
  flex: 1;
  overflow: hidden;
  background: var(--coda-surface-bg);
}

.builder__preview--full {
  width: 100%;
}

/* Dialog */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(2px);
}

.dialog {
  background: var(--coda-surface-panel);
  border-radius: var(--coda-radius-l);
  padding: var(--coda-sp-24);
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-16);
}

.dialog--wide { max-width: 720px; max-height: 80vh; overflow: hidden; }

.dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--coda-text-primary);
}

.dialog__body {
  font-size: 14px;
  color: var(--coda-text-secondary);
  line-height: 1.5;
}

.dialog__close {
  background: none;
  border: none;
  color: var(--coda-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--coda-radius-s);
  padding: var(--coda-sp-4);
}

.dialog__close:hover { background: var(--coda-hover); }

.dialog__tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--coda-sp-12);
  overflow: hidden;
}

.export-block {
  display: flex;
  flex-direction: column;
  gap: var(--coda-sp-4);
  overflow: hidden;
}

.export-block__label {
  font-size: 11px;
  font-weight: 600;
  color: var(--coda-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.export-block__code {
  flex: 1;
  background: var(--coda-surface-bg);
  border: 1px solid var(--coda-surface-border);
  border-radius: var(--coda-radius-s);
  padding: var(--coda-sp-12);
  font-size: 11px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  color: var(--coda-text-secondary);
  overflow: auto;
  max-height: 300px;
  white-space: pre;
  margin: 0;
}

.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--coda-sp-8);
  flex-wrap: wrap;
}

.dialog__btn {
  padding: 7px 16px;
  border-radius: var(--coda-radius-s);
  font-size: 13px;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.15s ease;
}

.dialog__btn--primary { background: var(--coda-primary); color: white; }
.dialog__btn--primary:hover { background: #0d22d4; }
.dialog__btn--secondary { background: var(--coda-surface-bg); color: var(--coda-text-secondary); border-color: var(--coda-surface-border); }
.dialog__btn--secondary:hover { background: var(--coda-hover); }
.dialog__btn--danger { background: #cc0705; color: white; }
.dialog__btn--danger:hover { background: #a80604; }
</style>
