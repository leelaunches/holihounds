import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Tailwind v4 is wired via PostCSS (see postcss.config.mjs).
// We deliberately don't use @tailwindcss/vite here because it isn't compatible
// with the Rolldown-Vite bundler shipped in Astro 6 yet.

const SITE_URL = 'https://holihounds.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      // /smoke/ is a noindex internal verification page — exclude from the
      // public sitemap so search engines don't even consider crawling it.
      filter: (page) => !page.includes('/smoke'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
