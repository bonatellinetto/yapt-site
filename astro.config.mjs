// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { readFile, rename } from 'node:fs/promises';

/** @type {import('astro').AstroIntegration} */
const cloudflareBlogRedirects = {
  name: 'cloudflare-blog-redirects',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const artifact = new URL('./site-redirects.txt', dir);
      const content = await readFile(artifact, 'utf8');
      const rules = content.split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith('#'));
      if (!content.includes('# Artigos:') || !rules.some(line => /^(?:\/(?:en|es))?\/blog\/\S+\s+\S+\s+301$/.test(line))) {
        throw new Error('O arquivo de redirecionamentos dos artigos não foi gerado corretamente.');
      }
      await rename(artifact, new URL('./_redirects', dir));
      logger.info(`Arquivo _redirects preparado com ${rules.length} regras permanentes.`);
    },
  },
};

export default defineConfig({
  site: 'https://yapt.ai',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
  },
  integrations: [
    tailwind(),
    react(),
    cloudflareBlogRedirects,
  ],
});
