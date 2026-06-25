<script setup lang="ts">
import NetworkLogo from './NetworkLogo.vue';

defineProps<{
  methodId: string;
  label: string;
  logoKey: string;
  wallet?: boolean;
  cash?: boolean;
  darkLogo?: boolean;
  selected: boolean;
}>();

const emit = defineEmits<{ select: [] }>();
</script>

<template>
  <div
    class="co-opt"
    :class="{ sel: selected }"
    @click="emit('select')"
    @keydown.enter.space.prevent="emit('select')"
    role="radio"
    :aria-checked="selected"
    tabindex="0"
  >
    <div class="co-optrow">
      <span class="co-radio"><span class="d"></span></span>
      <span v-if="cash" class="co-cash">$</span>
      <span v-else class="co-cc" :class="{ wallet, 'co-cc--dark-logo': darkLogo }">
        <NetworkLogo :logo-key="logoKey" :size="wallet ? 22 : 18" />
      </span>
      <span class="co-mname">{{ label }}</span>
    </div>
    <div class="co-hint">Tap Pay to continue with {{ label }}</div>
  </div>
</template>
