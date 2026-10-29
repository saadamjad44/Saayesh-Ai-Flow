/**
 * The pricing dataset's published form: its JSON distribution, and the Dataset
 * structured data that points at it.
 *
 * Kept beside the data rather than in src/lib/seo.ts because every value here
 * is a fact about THIS dataset — its fields, its licence, how it was gathered.
 * seo.ts owns the generic Dataset shape; this owns what goes in it, so the two
 * can never disagree about, say, the download URL.
 */
import { datasetSchema, type DatasetVariable, type JsonLd } from "@/lib/seo";
import { PRICING_DATASET, PRICING_ROWS, type PricingRow } from "./ai-tool-pricing";
import { verificationWindow } from "./ai-tool-pricing-stats";

/**
 * Where the machine-readable copy is served. A root-level path, not nested
 * under the page, because it is a file rather than a sub-resource — and because
 * a stable, guessable URL is the point of publishing a distribution at all.
 *
 * Declared here and used by both the endpoint (src/pages/ai-tool-pricing.json.ts)
 * and the Dataset schema below, so the advertised URL is the one that serves.
 */
export const PRICING_JSON_PATH = "/ai-tool-pricing.json";

/**
 * How the figures were gathered, stated plainly because the schema makes it a
 * public claim. It describes what actually happened: a person opened each
 * vendor's pricing page and wrote down the listed price on a given date. There
 * is no crawler, no API, and no sampling here.
 */
const MEASUREMENT_TECHNIQUE =
  "Manual observation: each vendor's own public pricing page was opened and the listed plan price recorded, with the date of the check stored alongside it. No prices are estimated, modelled, averaged, or collected automatically.";

/** The fields a consumer of the JSON will find, in the order they appear. */
const VARIABLES: readonly DatasetVariable[] = [
  { name: "tool", description: "Product name as the vendor writes it." },
  { name: "vendor", description: "Company that sells the product." },
  { name: "plan", description: "Plan or tier name as the vendor writes it." },
  {
    name: "category",
    description: "The job the tool does, e.g. general AI assistant or automation platform.",
  },
  {
    name: "monthlyUsd",
    description:
      "Listed price per billing unit per month on monthly billing. Null where the vendor lists no monthly-billed option; 0 denotes a free plan.",
    unitText: "USD",
  },
  {
    name: "annualMonthlyUsd",
    description:
      "Listed price per billing unit per month on annual billing, as a monthly equivalent rather than the amount billed. Null where no annual option is listed or the listed figure was too unclear to publish.",
    unitText: "USD",
  },
  {
    name: "unit",
    description: "What the price buys: account (flat plan price), seat, or member.",
  },
  {
    name: "isStartingPrice",
    description: "True where the vendor lists the figure as a starting price, e.g. “from $69”.",
  },
  {
    name: "seatMinimum",
    description: "Smallest number of seats the vendor will sell on the plan.",
  },
  {
    name: "usageLimit",
    description: "The metered cap that defines the plan, in the vendor's terms.",
  },
  {
    name: "note",
    description: "Caveats, promotions, and any arithmetic performed by the publisher.",
  },
  { name: "source", description: "The vendor page the figure was read from." },
  { name: "sourceUrl", description: "URL of that vendor page, where one is recorded." },
  { name: "verifiedOn", description: "ISO 8601 date the price was checked." },
  {
    name: "citedOn",
    description: "URL of the page on this site that published the figure, with its check date.",
  },
];

const KEYWORDS = [
  "AI tool pricing",
  "AI software list prices",
  "AI subscription pricing",
  "small business AI costs",
  "SaaS pricing dataset",
] as const;

/**
 * Dataset structured data for the tracker page.
 *
 * `temporalCoverage` is the span of verification dates, which is what the
 * dataset actually covers: when each price was checked. It is not a claim that
 * the prices held for that period.
 */
export function pricingDatasetSchema(input: {
  name: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified: Date;
}): JsonLd {
  const window = verificationWindow();

  return datasetSchema({
    ...input,
    license: PRICING_DATASET.license,
    temporalCoverage: `${window.first}/${window.last}`,
    measurementTechnique: MEASUREMENT_TECHNIQUE,
    variableMeasured: VARIABLES,
    distributions: [{ path: PRICING_JSON_PATH, encodingFormat: "application/json" }],
    keywords: KEYWORDS,
  });
}

/** One row as the JSON endpoint serves it: the stored row plus its citation URL. */
export interface PricingRowJson extends Omit<PricingRow, "citedOn"> {
  /** Absolute URL of the page on this site that published the figure. */
  citedOn: string;
}

/**
 * The dataset as served JSON.
 *
 * `citedOn` is resolved from a page id to an absolute URL here, because a
 * consumer outside this repo cannot do anything with an internal id — the whole
 * value of the field is that it leads back to the page carrying the check date.
 * `resolveCitation` is injected so this module needs no coupling to the page
 * registry or the canonical domain.
 */
export function pricingRowsAsJson(
  resolveCitation: (citedOn: PricingRow["citedOn"]) => string,
): PricingRowJson[] {
  return (PRICING_ROWS as readonly PricingRow[]).map((row) => ({
    ...row,
    citedOn: resolveCitation(row.citedOn),
  }));
}
