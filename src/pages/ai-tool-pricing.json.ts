/**
 * /ai-tool-pricing.json — the machine-readable copy of the AI Tool Pricing
 * Dataset, and the `distribution` the tracker page's Dataset schema advertises.
 *
 * This endpoint is the difference between publishing a table and publishing a
 * dataset. The table is for a reader; this is for everything else — a
 * spreadsheet, a script, a journalist checking a figure, an answer engine that
 * wants the row rather than the paragraph around it. Because it is generated
 * from src/data/ai-tool-pricing.ts, the same source the page renders, the two
 * can never disagree.
 *
 * Every row carries `verifiedOn` and an absolute `citedOn` URL, so a figure
 * taken from here can always be traced to the date it was checked and the page
 * that published it. That is the whole contract: reuse the data, cite where it
 * came from, and see for yourself how old it is.
 *
 * Not in the sitemap, like /sitemap.xml and /search-index.json: it is a file,
 * not a page, and it is discovered through the Dataset schema and the download
 * link on the tracker page.
 */
import type { APIRoute } from "astro";

import { getPage } from "@/config/pages";
import { PRICING_DATASET } from "@/data/ai-tool-pricing";
import { pricingRowsAsJson, PRICING_JSON_PATH } from "@/data/ai-tool-pricing-schema";
import { verificationWindow } from "@/data/ai-tool-pricing-stats";
import { SITE } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

export const GET: APIRoute = () => {
  const window = verificationWindow();
  const page = getPage("ai-tool-pricing-tracker");

  const body = {
    /**
     * Dataset-level metadata first, so a consumer reading the top of the file
     * learns the licence, the currency and the limits before the numbers.
     */
    name: PRICING_DATASET.name,
    description:
      "List prices for AI tools and AI features in business software, each recorded from the vendor's own pricing page on a stated date. US list prices, excluding tax.",
    url: absoluteUrl(page.path),
    downloadUrl: absoluteUrl(PRICING_JSON_PATH),
    publisher: SITE.name,
    license: PRICING_DATASET.license,
    licenseLabel: PRICING_DATASET.licenseLabel,
    /** Shape version. Bumped when fields change, not when a price is re-checked. */
    schemaVersion: PRICING_DATASET.schemaVersion,
    currency: PRICING_DATASET.currency,
    /** Span of verification dates: when the figures were checked. */
    verifiedBetween: { first: window.first, last: window.last },
    /**
     * Stated in the payload as well as on the page, because a file travels
     * further than the page it came from and these limits travel with it.
     */
    limitations: [
      "These are advertised list prices, not prices paid. Vendors localise, discount, and reprice frequently.",
      "A price is only as current as its verifiedOn date. Check the vendor's own pricing page before relying on any figure.",
      "The dataset is a census of the plans this site has checked, not a random sample of the market, so it does not support claims about market averages.",
      "Prices are per billing unit per month. Annual figures are monthly equivalents, not the amount billed.",
    ],
    rowCount: 0,
    rows: pricingRowsAsJson((citedOn) => absoluteUrl(getPage(citedOn).path)),
  };

  // Set from the array rather than typed in, so the count cannot fall behind.
  body.rowCount = body.rows.length;

  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      /**
       * Explicitly public: the data is CC BY 4.0 and the point of publishing it
       * is reuse, including from other origins and from tooling that is not a
       * browser.
       */
      "Access-Control-Allow-Origin": "*",
    },
  });
};
