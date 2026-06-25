<script setup lang="ts">
import NetworkLogo from './NetworkLogo.vue';

defineProps<{
  methodId: string;
  networks: string[];
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
      <span class="co-logos">
        <span v-for="net in networks" :key="net" class="co-cc">
          <NetworkLogo :logo-key="net" :size="16" />
        </span>
      </span>
      <span class="co-mname">Add a new card</span>
    </div>

    <div class="co-fields-clip">
      <div class="co-fields stack">
        <div class="co-field">
          <div class="co-input">
            <input id="co-cardnum" type="text" inputmode="numeric" maxlength="19" placeholder=" " autocomplete="cc-number" @click.stop />
            <label class="co-flabel" for="co-cardnum">Card number</label>
          </div>
        </div>
        <div style="display:flex; gap:12px; width:100%; margin-top:10px">
          <div class="co-field">
            <div class="co-input">
              <input id="co-expiry" type="text" inputmode="numeric" maxlength="5" placeholder=" " autocomplete="cc-exp" @click.stop />
              <label class="co-flabel" for="co-expiry">Expiry</label>
            </div>
          </div>
          <div class="co-field">
            <div class="co-input">
              <input id="co-cvv-new" type="text" inputmode="numeric" maxlength="4" placeholder=" " autocomplete="cc-csc" @click.stop />
              <label class="co-flabel" for="co-cvv-new">CVV</label>
            </div>
          </div>
        </div>
        <div class="co-field" style="margin-top:10px">
          <div class="co-input">
            <input id="co-zip-new" type="text" inputmode="numeric" maxlength="10" placeholder=" " @click.stop />
            <label class="co-flabel" for="co-zip-new">ZIP Code</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
