// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// TODO: replace `site` with the real production domain before deploy.
// This value is used for sitemap, canonical URLs, and absolute og:image URLs.
// Keep in sync with SITE_URL in src/data/site.ts and the Sitemap line in public/robots.txt.
export default defineConfig({
  site: 'https://example.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
