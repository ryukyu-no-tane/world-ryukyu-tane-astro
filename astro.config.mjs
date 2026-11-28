// @ts-check
import { defineConfig } from 'astro/config';
import { writeFile } from 'node:fs/promises';

const site = 'https://world2.ryukyu-tane.com';
const escapeXml = (/** @type {string} */ value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** @type {import('astro').AstroIntegration} */
const searchSitemap = {
  name: 'world2-search-sitemap',
  hooks: {
    'astro:build:done': async ({ pages, dir }) => {
      const paths = [...new Set(pages.map(({ pathname }) => '/' + pathname.replace(/^\/+|\/+$/g, '') + '/'))]
        .filter(path => /^\/(ja|en)\//.test(path) && !/\/404\/?$/.test(path))
        .sort();
      const entries = paths.map(path => {
        const ja = path.replace(/^\/en\//, '/ja/');
        const en = path.replace(/^\/ja\//, '/en/');
        const alternates = paths.includes(ja) && paths.includes(en)
          ? [['ja', ja], ['en', en], ['x-default', ja]].map(([lang, href]) => '    <xhtml:link rel="alternate" hreflang="' + lang + '" href="' + escapeXml(new URL(href, site).href) + '" />').join('\n')
          : '';
        return '  <url>\n    <loc>' + escapeXml(new URL(path, site).href) + '</loc>\n' + (alternates ? alternates + '\n' : '') + '  </url>';
      });
      await writeFile(new URL('sitemap.xml', dir), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + entries.join('\n') + '\n</urlset>\n');
    },
  },
};

export default defineConfig({
  site,
  integrations: [searchSitemap],
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
