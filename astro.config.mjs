// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://world2.ryukyu-tane.com',
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
