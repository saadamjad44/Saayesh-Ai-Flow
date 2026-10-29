/**
 * Integrity checks for the AI Tool Pricing Dataset and the findings derived
 * from it.
 *
 * Run by astro.config.ts on every `astro dev`, `astro build` and `astro check`,
 * alongside assertValidPageRegistry(), assertValidSeoSnippets() and
 * assertEmailSavingsCalculator(), so a bad row fails the build instead of
 * publishing a wrong price. Same reasoning as those: no test runner, no extra
 * dependency, and one way to run the checks.
 *
 * Imported only by astro.config.ts, so none of it reaches the browser.
 *
 * Two halves. The first enforces the dataset's own invariants — the rules
 * written at the top of ./ai-tool-pricing.ts, as far as code can see them. The
 * second checks the derived findings against a small fixture whose answers are
 * worked out by hand, because those findings are published as fact and an
 * off-by-one in a median would be invisible on the page.
 *
 * What it deliberately cannot check: whether a price is still CORRECT, or
 * whether `verifiedOn` matches the check date printed on the page in `citedOn`.
 * Both need a human to open a vendor's pricing page. The tracker publishes each
 * row's age so a reader can see when that last happened.
 */
import { getPage } from "@/config/pages";
import {
  PRICING_CATEGORIES,
  PRICING_DATASET,
  PRICING_ROWS,
  type PricingRow,
} from "./ai-tool-pricing";
import {
  FRESHNESS_DAYS,
  ageInDays,
  annualDiscounts,
  entryPrices,
  formatUsd,
  freshnessOf,
  isFreePlan,
  lowestListedMonthly,
  median,
  pricingStats,
} from "./ai-tool-pricing-stats";

const problems: string[] = [];

function fail(label: string, detail: string): void {
  problems.push(`${label}: ${detail}`);
}

function expect(label: string, actual: unknown, expected: unknown): void {
  if (actual !== expected) {
    fail(label, `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

/** Floating-point arithmetic, so compared to a tolerance rather than exactly. */
function near(label: string, actual: number | null, expected: number, tolerance = 1e-9): void {
  if (actual === null || !Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    fail(label, `expected ${expected}, got ${actual}`);
  }
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function checkDataset(): void {
  const seen = new Set<string>();

  // Widened the way assertValidPageRegistry() widens PAGES: `as const satisfies`
  // narrows each row to its own literal type, which drops the optional fields
  // this loop is here to check.
  for (const row of PRICING_ROWS as readonly PricingRow[]) {
    const label = `${row.tool} ${row.plan}`;

    // A tool/plan pair is the dataset's natural key: two rows for one plan mean
    // a stale figure was kept alongside its replacement, which rule 3 forbids.
    if (seen.has(label)) fail(label, "duplicate tool and plan");
    seen.add(label);

    if (!ISO_DATE.test(row.verifiedOn) || Number.isNaN(Date.parse(row.verifiedOn))) {
      fail(label, `verifiedOn must be a real YYYY-MM-DD date, got "${row.verifiedOn}"`);
    }

    // `citedOn` is type-checked against the registry, but getPage() also proves
    // the page is really there rather than a name the union happens to allow.
    try {
      getPage(row.citedOn);
    } catch {
      fail(label, `citedOn "${row.citedOn}" is not a registered page`);
    }

    if (!Object.hasOwn(PRICING_CATEGORIES, row.category)) {
      fail(label, `unknown category "${row.category}"`);
    }

    const prices = [
      ["monthlyUsd", row.monthlyUsd],
      ["annualMonthlyUsd", row.annualMonthlyUsd],
    ] as const;

    for (const [field, price] of prices) {
      if (price === null) continue;
      if (!Number.isFinite(price) || price < 0) {
        fail(label, `${field} must be a finite, non-negative number, got ${price}`);
      }
      // Prices are recorded to the cent; a third decimal means a typo or an
      // un-rounded division that rule 4 wants stated, not stored.
      //
      // Compared to a tolerance, not exactly: 19.99 * 100 is 1998.9999999999998
      // in binary floating point, so an exact test rejects every valid price
      // that happens to have cents.
      if (Math.abs(Math.round(price * 100) - price * 100) > 1e-6) {
        fail(label, `${field} has sub-cent precision (${price})`);
      }
    }

    // A row with no figure at all states nothing and cannot be rendered.
    if (lowestListedMonthly(row) === null) {
      fail(label, "needs at least one of monthlyUsd or annualMonthlyUsd");
    }

    // Annual billing is a discount for committing. If the annual equivalent is
    // dearer, the two fields have been swapped.
    if (
      row.monthlyUsd !== null &&
      row.annualMonthlyUsd !== null &&
      row.annualMonthlyUsd > row.monthlyUsd
    ) {
      fail(
        label,
        `annualMonthlyUsd (${row.annualMonthlyUsd}) is higher than monthlyUsd (${row.monthlyUsd}) — fields swapped?`,
      );
    }

    if (
      row.seatMinimum !== undefined &&
      (!Number.isInteger(row.seatMinimum) || row.seatMinimum < 1)
    ) {
      fail(label, `seatMinimum must be a whole number of at least 1, got ${row.seatMinimum}`);
    }

    // A free plan priced per seat is a contradiction, and a seat minimum on one
    // would be nonsense on the page.
    if (isFreePlan(row) && row.seatMinimum !== undefined) {
      fail(label, "a free plan cannot carry a seat minimum");
    }

    if (row.sourceUrl !== undefined && !row.sourceUrl.startsWith("https://")) {
      fail(label, `sourceUrl must be https, got "${row.sourceUrl}"`);
    }

    if (row.source.trim() === "") fail(label, "source must name where the figure was read");
  }

  // No "is the dataset empty" check: `as const` makes the row count part of the
  // type, so TypeScript rejects the comparison as unreachable. An empty dataset
  // would be a compile error at every call site that indexes it.

  if (!PRICING_DATASET.license.startsWith("https://")) {
    fail("dataset", "license must be a URL");
  }
}

/**
 * The fixture. Four rows, chosen so every finding has a hand-worked answer:
 * one tool with a free plan and a paid plan, one with an annual discount, one
 * that lists no monthly option at all, and a tie in the entry prices so the
 * median has to handle duplicate values.
 */
const FIXTURE: readonly PricingRow[] = [
  {
    tool: "Alpha",
    vendor: "Alpha Inc",
    plan: "Free",
    category: "assistant",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "Capped",
    source: "fixture",
    verifiedOn: "2026-10-01",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Alpha",
    vendor: "Alpha Inc",
    plan: "Pro",
    category: "assistant",
    monthlyUsd: 10,
    annualMonthlyUsd: null,
    unit: "account",
    source: "fixture",
    verifiedOn: "2026-10-01",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Beta",
    vendor: "Beta Ltd",
    plan: "Team",
    category: "automation",
    monthlyUsd: 20,
    annualMonthlyUsd: 10,
    unit: "seat",
    seatMinimum: 2,
    source: "fixture",
    verifiedOn: "2026-09-01",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Gamma",
    vendor: "Gamma GmbH",
    plan: "Annual only",
    category: "design",
    monthlyUsd: null,
    annualMonthlyUsd: 30,
    unit: "member",
    source: "fixture",
    verifiedOn: "2026-01-01",
    citedOn: "best-ai-tools-for-small-business",
  },
];

function checkDerivedFindings(): void {
  // ---- Primitives -------------------------------------------------------
  expect("median of empty", median([]), null);
  near("median odd length", median([3, 1, 2]), 2);
  near("median even length", median([1, 2, 3, 4]), 2.5);

  expect("formatUsd whole", formatUsd(20), "$20");
  expect("formatUsd cents", formatUsd(16.99), "$16.99");
  // The reason formatUsd does not just set maximumFractionDigits: 2.
  expect("formatUsd trailing zero", formatUsd(103.5), "$103.50");
  expect("formatUsd zero", formatUsd(0), "$0");
  expect("formatUsd thousands", formatUsd(1000), "$1,000");

  // ---- Freshness boundaries ---------------------------------------------
  const asOf = new Date("2026-10-28T00:00:00Z");
  expect("ageInDays same day", ageInDays("2026-10-28", asOf), 0);
  expect("ageInDays a week", ageInDays("2026-10-21", asOf), 7);
  // A check dated after the build (a timezone edge, or a typo) clamps to 0
  // rather than reporting a negative age on the page.
  expect("ageInDays future date", ageInDays("2026-11-05", asOf), 0);

  const dayBefore = (days: number) =>
    new Date(asOf.getTime() - days * 86_400_000).toISOString().slice(0, 10);

  expect("freshness at threshold", freshnessOf(dayBefore(FRESHNESS_DAYS.fresh), asOf), "fresh");
  expect("freshness just past", freshnessOf(dayBefore(FRESHNESS_DAYS.fresh + 1), asOf), "ageing");
  expect("freshness at ageing edge", freshnessOf(dayBefore(FRESHNESS_DAYS.ageing), asOf), "ageing");
  expect("freshness stale", freshnessOf(dayBefore(FRESHNESS_DAYS.ageing + 1), asOf), "stale");

  // ---- lowestListedMonthly ----------------------------------------------
  near("lowest of monthly only", lowestListedMonthly(FIXTURE[1]!), 10);
  near("lowest prefers annual", lowestListedMonthly(FIXTURE[2]!), 10);
  near("lowest of annual only", lowestListedMonthly(FIXTURE[3]!), 30);
  near("lowest of free plan", lowestListedMonthly(FIXTURE[0]!), 0);

  // ---- Entry prices ------------------------------------------------------
  const entries = entryPrices(FIXTURE);
  expect("entry prices count", entries.length, 3);
  expect(
    "entry prices exclude free plans",
    entries.some((entry) => entry.monthlyUsd === 0),
    false,
  );
  expect("cheapest entry tool", entries[0]!.tool, "Alpha");
  near("cheapest entry price", entries[0]!.monthlyUsd, 10);
  near("dearest entry price", entries[2]!.monthlyUsd, 30);

  // ---- Annual discounts --------------------------------------------------
  const discounts = annualDiscounts(FIXTURE);
  expect("discount count", discounts.length, 1);
  near("discount fraction", discounts[0]!.fraction, 0.5);

  // ---- The whole report --------------------------------------------------
  const stats = pricingStats(asOf, FIXTURE);
  expect("planCount", stats.planCount, 4);
  expect("toolCount", stats.toolCount, 3);
  expect("vendorCount", stats.vendorCount, 3);
  expect("categoryCount", stats.categoryCount, 3);
  expect("firstCheckedOn", stats.firstCheckedOn, "2026-01-01");
  expect("lastCheckedOn", stats.lastCheckedOn, "2026-10-01");
  expect("sourcePageCount", stats.sourcePageCount, 1);
  expect("freePlanCount", stats.freePlanCount, 1);
  expect("toolsWithFreePlan", stats.toolsWithFreePlan, 1);
  // Entry prices are 10 (Alpha), 10 (Beta) and 30 (Gamma): an odd-length list
  // with a repeated low value.
  near("medianEntryUsd", stats.medianEntryUsd, 10);
  near("medianAnnualDiscount", stats.medianAnnualDiscount, 0.5);
  // Alpha Pro is the only paid plan with a monthly price and no annual one.
  expect("monthlyOnlyCount", stats.monthlyOnlyCount, 1);
  expect("perPersonCount", stats.perPersonCount, 2);
  expect("perAccountCount", stats.perAccountCount, 2);
  expect("meteredCount", stats.meteredCount, 1);
  expect("seatMinimumCount", stats.seatMinimumCount, 1);
  expect("freshness fresh", stats.freshness.fresh, 2);
  expect("freshness ageing", stats.freshness.ageing, 1);
  expect("freshness stale", stats.freshness.stale, 1);

  // Empty categories are dropped rather than rendered as empty sections.
  expect(
    "categories are non-empty",
    stats.categories.every((category) => category.planCount > 0),
    true,
  );
  const assistants = stats.categories.find((category) => category.id === "assistant");
  expect("assistant plan count", assistants?.planCount, 2);
  near("assistant cheapest paid", assistants?.cheapestPaidUsd ?? null, 10);

  // Every bucket must account for every row, or the page's totals will not add
  // up to the number of rows it also prints.
  const bucketed = stats.freshness.fresh + stats.freshness.ageing + stats.freshness.stale;
  expect("freshness buckets total", bucketed, stats.planCount);
  expect("unit split totals", stats.perPersonCount + stats.perAccountCount, stats.planCount);
}

/** Throws with every problem found, so one build surfaces all of them. */
export function assertPricingDataset(): void {
  problems.length = 0;
  checkDataset();
  checkDerivedFindings();

  if (problems.length > 0) {
    throw new Error(`AI tool pricing dataset is invalid:\n- ${problems.join("\n- ")}`);
  }
}
