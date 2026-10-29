/**
 * Findings derived from the AI Tool Pricing Dataset.
 *
 * Every number the tracker page states about the market as a whole is computed
 * here from ./ai-tool-pricing.ts at build time, and never typed into the page's
 * prose. That is the whole point: a hand-written sentence like "the median
 * entry price is $12" goes quietly wrong the moment a row changes, whereas a
 * computed one cannot. If a price is re-verified tomorrow, every finding on the
 * page moves with it.
 *
 * These are findings about WHAT VENDORS LIST, not about what businesses pay,
 * what tools are worth, or what anything costs on average in the market. The
 * dataset is a census of the plans this site has checked — not a random sample
 * of the industry — so nothing here is extrapolated beyond it, and the page
 * says so in writing.
 *
 * No DOM, no I/O, no dates of its own: `asOf` is always passed in, so the same
 * inputs always produce the same output and the spec can check it.
 */
import {
  PRICING_CATEGORIES,
  PRICING_ROWS,
  type PricingCategory,
  type PricingRow,
} from "./ai-tool-pricing";

/**
 * USD, with cents only when a price actually has them: "$20", but "$103.50"
 * rather than the "$103.5" a flat maximumFractionDigits would produce.
 */
export function formatUsd(amount: number): string {
  const hasCents = !Number.isInteger(amount);
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: 2,
  });
}

/** A whole-number percentage, e.g. 33 for "33%". */
export function formatPercent(fraction: number): string {
  return `${Math.round(fraction * 100)}%`;
}

/**
 * The lowest monthly figure a plan is listed at, whichever billing period that
 * requires — `null` when the plan publishes no usable figure at all.
 *
 * Annual-equivalent prices count, because the question a reader is asking is
 * "what is the cheapest way to have this plan", and the dataset records the
 * commitment in each row's note. Comparing only monthly-billed prices would
 * drop Canva Pro and Power Automate Premium, which list no monthly option.
 */
export function lowestListedMonthly(row: PricingRow): number | null {
  const candidates = [row.monthlyUsd, row.annualMonthlyUsd].filter(
    (price): price is number => price !== null,
  );
  return candidates.length > 0 ? Math.min(...candidates) : null;
}

/** True for a plan whose lowest listed price is zero. */
export function isFreePlan(row: PricingRow): boolean {
  return lowestListedMonthly(row) === 0;
}

export function median(values: readonly number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}

/**
 * How stale a row is allowed to get before the page says so, in days.
 *
 * The thresholds are an editorial promise rather than a measurement: a month
 * is how often this dataset is meant to be re-checked, so anything inside 30
 * days is doing what it says, up to 90 days is usable with a caveat, and past
 * 90 days a reader should click through to the vendor instead of trusting us.
 */
export const FRESHNESS_DAYS = { fresh: 30, ageing: 90 } as const;

export type Freshness = "fresh" | "ageing" | "stale";

const MS_PER_DAY = 86_400_000;

/** Whole days between a row's check date and `asOf`. Negative dates clamp to 0. */
export function ageInDays(verifiedOn: string, asOf: Date): number {
  const checked = new Date(`${verifiedOn}T00:00:00Z`);
  const days = Math.floor((asOf.getTime() - checked.getTime()) / MS_PER_DAY);
  return Math.max(0, days);
}

export function freshnessOf(verifiedOn: string, asOf: Date): Freshness {
  const days = ageInDays(verifiedOn, asOf);
  if (days <= FRESHNESS_DAYS.fresh) return "fresh";
  if (days <= FRESHNESS_DAYS.ageing) return "ageing";
  return "stale";
}

export const FRESHNESS_LABELS: Readonly<Record<Freshness, string>> = {
  fresh: `Checked within ${FRESHNESS_DAYS.fresh} days`,
  ageing: `Checked ${FRESHNESS_DAYS.fresh}–${FRESHNESS_DAYS.ageing} days ago`,
  stale: `Checked over ${FRESHNESS_DAYS.ageing} days ago — confirm with the vendor`,
};

/**
 * The span of verification dates in the dataset, earliest first.
 *
 * This is the dataset's temporal coverage — when the figures were CHECKED. It
 * is not a period the prices were valid for, and nothing may present it as one.
 */
export function verificationWindow(rows: readonly PricingRow[] = PRICING_ROWS): {
  first: string;
  last: string;
} {
  const dates = rows.map((row) => row.verifiedOn).sort();
  return { first: dates[0] ?? "", last: dates[dates.length - 1] ?? "" };
}

/** One tool's cheapest paid plan, used for the entry-price finding. */
export interface EntryPrice {
  tool: string;
  plan: string;
  monthlyUsd: number;
}

/**
 * The cheapest PAID plan each tool lists — its entry price.
 *
 * Free plans are excluded on purpose: the finding this feeds answers "what does
 * it cost to start paying for this kind of tool", and a free tier answers a
 * different question (counted separately, as `toolsWithFreePlan`).
 */
export function entryPrices(rows: readonly PricingRow[] = PRICING_ROWS): EntryPrice[] {
  const cheapest = new Map<string, EntryPrice>();

  for (const row of rows) {
    const price = lowestListedMonthly(row);
    if (price === null || price === 0) continue;

    const current = cheapest.get(row.tool);
    if (!current || price < current.monthlyUsd) {
      cheapest.set(row.tool, { tool: row.tool, plan: row.plan, monthlyUsd: price });
    }
  }

  return [...cheapest.values()].sort((a, b) => a.monthlyUsd - b.monthlyUsd);
}

/** One plan's annual-vs-monthly saving, for plans that list both. */
export interface AnnualDiscount {
  tool: string;
  plan: string;
  monthlyUsd: number;
  annualMonthlyUsd: number;
  /** Fraction saved per month by committing to a year, e.g. 0.15 for 15%. */
  fraction: number;
}

export function annualDiscounts(rows: readonly PricingRow[] = PRICING_ROWS): AnnualDiscount[] {
  const discounts: AnnualDiscount[] = [];

  for (const row of rows) {
    const { monthlyUsd, annualMonthlyUsd } = row;
    if (monthlyUsd === null || annualMonthlyUsd === null || monthlyUsd === 0) continue;

    discounts.push({
      tool: row.tool,
      plan: row.plan,
      monthlyUsd,
      annualMonthlyUsd,
      fraction: (monthlyUsd - annualMonthlyUsd) / monthlyUsd,
    });
  }

  return discounts.sort((a, b) => b.fraction - a.fraction);
}

export interface CategoryBreakdown {
  id: PricingCategory;
  label: string;
  planCount: number;
  toolCount: number;
  /** Cheapest paid plan in the category, `null` if every plan is free. */
  cheapestPaidUsd: number | null;
}

export interface PricingStats {
  planCount: number;
  toolCount: number;
  vendorCount: number;
  categoryCount: number;
  /** Earliest and latest verification dates — the dataset's temporal coverage. */
  firstCheckedOn: string;
  lastCheckedOn: string;
  /** Distinct pages on this site the figures were carried over from. */
  sourcePageCount: number;

  freePlanCount: number;
  toolsWithFreePlan: number;

  /** Cheapest paid plan per tool, ascending. */
  entryPrices: EntryPrice[];
  medianEntryUsd: number | null;
  cheapestEntry: EntryPrice | null;
  dearestEntry: EntryPrice | null;

  annualDiscounts: AnnualDiscount[];
  medianAnnualDiscount: number | null;
  /** Plans listing a monthly price but no annual equivalent. */
  monthlyOnlyCount: number;

  perPersonCount: number;
  perAccountCount: number;
  meteredCount: number;
  seatMinimumCount: number;
  startingPriceCount: number;

  freshness: Readonly<Record<Freshness, number>>;
  categories: CategoryBreakdown[];
}

/**
 * Every finding the page publishes, computed in one pass.
 *
 * `asOf` is the build date: this is a static site, so freshness is measured
 * from the last deploy, and the page prints that date beside the counts rather
 * than implying a live check.
 */
export function pricingStats(asOf: Date, rows: readonly PricingRow[] = PRICING_ROWS): PricingStats {
  const window = verificationWindow(rows);
  const entries = entryPrices(rows);
  const discounts = annualDiscounts(rows);

  const freshness: Record<Freshness, number> = { fresh: 0, ageing: 0, stale: 0 };
  for (const row of rows) freshness[freshnessOf(row.verifiedOn, asOf)] += 1;

  const freeTools = new Set(rows.filter(isFreePlan).map((row) => row.tool));

  const categories = (Object.keys(PRICING_CATEGORIES) as PricingCategory[])
    .map((id): CategoryBreakdown => {
      const inCategory = rows.filter((row) => row.category === id);
      const paid = inCategory
        .map(lowestListedMonthly)
        .filter((price): price is number => price !== null && price > 0);

      return {
        id,
        label: PRICING_CATEGORIES[id],
        planCount: inCategory.length,
        toolCount: new Set(inCategory.map((row) => row.tool)).size,
        cheapestPaidUsd: paid.length > 0 ? Math.min(...paid) : null,
      };
    })
    .filter((category) => category.planCount > 0);

  return {
    planCount: rows.length,
    toolCount: new Set(rows.map((row) => row.tool)).size,
    vendorCount: new Set(rows.map((row) => row.vendor)).size,
    categoryCount: categories.length,
    firstCheckedOn: window.first,
    lastCheckedOn: window.last,
    sourcePageCount: new Set(rows.map((row) => row.citedOn)).size,

    freePlanCount: rows.filter(isFreePlan).length,
    toolsWithFreePlan: freeTools.size,

    entryPrices: entries,
    medianEntryUsd: median(entries.map((entry) => entry.monthlyUsd)),
    cheapestEntry: entries[0] ?? null,
    dearestEntry: entries[entries.length - 1] ?? null,

    annualDiscounts: discounts,
    medianAnnualDiscount: median(discounts.map((discount) => discount.fraction)),
    monthlyOnlyCount: rows.filter(
      (row) => row.monthlyUsd !== null && row.monthlyUsd > 0 && row.annualMonthlyUsd === null,
    ).length,

    perPersonCount: rows.filter((row) => row.unit === "seat" || row.unit === "member").length,
    perAccountCount: rows.filter((row) => row.unit === "account").length,
    meteredCount: rows.filter((row) => row.usageLimit !== undefined).length,
    seatMinimumCount: rows.filter((row) => row.seatMinimum !== undefined).length,
    startingPriceCount: rows.filter((row) => row.isStartingPrice === true).length,

    freshness,
    categories,
  };
}
