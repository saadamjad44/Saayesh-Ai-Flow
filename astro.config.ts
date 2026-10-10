import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import { SITE, isPlaceholderDomain } from "./src/config/site";
import { assertValidPageRegistry } from "./src/config/pages";

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
  /**
   * The XML sitemap is src/pages/sitemap.xml.ts, not @astrojs/sitemap: the
   * integration can only write a sitemap *index* (/sitemap-index.xml plus
   * /sitemap-0.xml) and has no option for a single /sitemap.xml, which is the
   * URL Search Console and every other tool expect. The endpoint builds the
   * same list from the page registry and the content collections.
   */
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
