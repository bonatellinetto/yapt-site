// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
export default defineConfig({
  site: 'https://yapt.ai',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    tailwind(),
    react(),
  ],
});
