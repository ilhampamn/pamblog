<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  visible?: boolean;
}>();
</script>

<template>
  <div v-if="visible !== false" class="co-detail-row">
    <span class="co-detail-row__label">{{ label }}</span>
    <span class="co-detail-row__value">{{ value }}</span>
  </div>
</template>

<style scoped>
.co-detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-divider);
}

.co-detail-row:last-child {
  border-bottom: none;
}

.co-detail-row__label {
  font-size: 12px;
  color: var(--text-body-subtle);
}

.co-detail-row__value {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-body-default);
  text-align: right;
}
</style>
