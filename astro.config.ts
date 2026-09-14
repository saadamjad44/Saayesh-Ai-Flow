import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

import { SITE, isPlaceholderDomain } from "./src/config/site";
import { NOINDEX_PATHS, assertValidPageRegistry } from "./src/config/pages";

assertValidPageRegistry();

if (isPlaceholderDomain) {
  console.warn(
    `[site config] Using placeholder domain (${SITE.url}). ` +
      "Set SITE_DOMAIN in src/config/site.ts before deploying to production.",
  );
}

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: SITE.url,
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    mdx(),
    sitemap({
      // Noindexed legal pages stay out of the XML sitemap.
      filter: (page) => !NOINDEX_PATHS.has(new URL(page).pathname),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
