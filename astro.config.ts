import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

import { SITE, isPlaceholderDomain } from "./src/config/site";
import { assertValidPageRegistry } from "./src/config/pages";
import { assertValidSeoSnippets } from "./src/config/seo-snippets";
import { seoAudit } from "./src/lib/seo-audit.mjs";
import { assertEmailSavingsCalculator } from "./src/components/tools/ai-email-savings-calculator.spec";
import { assertPricingDataset } from "./src/data/ai-tool-pricing.spec";

assertValidPageRegistry();
assertValidSeoSnippets();
/**
 * The email calculator's arithmetic, checked against its published worked
 * example and its edge cases before anything is built. Same idea as the two
 * asserts above: an invariant the project refuses to ship without, verified
 * with no test runner and no extra dependency.
 */
assertEmailSavingsCalculator();
/**
 * The pricing dataset's own invariants, plus the arithmetic behind the findings
 * the tracker page publishes. Same contract as the asserts above: a row that
 * breaks a rule, or a median that stops adding up, fails the build rather than
 * shipping a wrong price.
 */
assertPricingDataset();

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
   * There is deliberately no @astrojs/sitemap here: the integration can only
   * write a sitemap *index* (/sitemap-index.xml plus /sitemap-0.xml) and has no
   * option for a single /sitemap.xml, which is the URL Search Console and every
   * other tool expect. src/pages/sitemap.xml.ts builds the same list from the
   * page registry and the content collections instead.
   *
   * seoAudit() re-reads the emitted HTML after a build and fails it on a
   * missing or duplicated title, description or canonical. The snippet registry
   * is validated before the build starts (above); the audit proves those values
   * actually reached the page.
   */
  integrations: [mdx(), seoAudit()],
  vite: {
    plugins: [tailwindcss()],
  },
});
