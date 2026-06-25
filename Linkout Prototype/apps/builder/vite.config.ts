import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@codapay/config-schema': resolve(__dirname, '../../packages/config-schema/src/index.ts'),
      '@codapay/tokens': resolve(__dirname, '../../packages/tokens/src/index.ts'),
      '@codapay/checkout-ui': resolve(__dirname, '../../packages/checkout-ui/src/index.ts'),
    },
  },
});
