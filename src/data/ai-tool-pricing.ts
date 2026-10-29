/**
 * The AI Tool Pricing Dataset — every list price this site has checked on a
 * vendor's own pricing page, in one structured, dated record.
 *
 * WHY THIS FILE EXISTS
 *
 * The site already publishes verified list prices, but they are scattered
 * across a dozen guides, each checked on its own date and written as prose.
 * That is right for a guide and useless as data: nobody — reader, journalist,
 * or answer engine — can see the whole picture, compare billing models across
 * vendors, or tell which figures are still fresh.
 *
 * This file consolidates them. Every row below is a price this site has
 * ALREADY PUBLISHED, carried over with its verification date and the page it
 * came from. Nothing here is new research, an estimate, an average, or a guess.
 *
 * THE RULES, which are not negotiable
 *
 * 1. A row may only state a figure that the page named in `citedOn` publishes.
 *    If no page on this site publishes it, it does not belong here.
 * 2. `verifiedOn` is the date THAT PAGE says the price was checked (its
 *    `pricingVerifiedDate`). It is never today's date, never a guess, and
 *    never bumped without re-opening the vendor's pricing page.
 * 3. Where two pages disagree, the newer `verifiedOn` wins and the older
 *    figure is removed rather than kept alongside it.
 * 4. Any arithmetic we performed ourselves — a yearly price divided by 12,
 *    for instance — is stated in `note` on that row. See the Canva rows.
 * 5. Prices are USD list prices excluding tax. Vendors localise, discount and
 *    reprice constantly; this records what was listed, not what you will pay.
 *
 * Re-verification is a manual editorial pass: open each vendor's pricing page,
 * correct the figure if it moved, and set `verifiedOn` to the day you looked.
 * assertPricingDataset() (./ai-tool-pricing.spec.ts, run on every build)
 * enforces the structural rules; it cannot tell you a price has gone stale,
 * which is why the tracker page publishes every row's age.
 */
import type { PageId } from "@/config/pages";

/** Dataset-wide facts, rendered on the page and in its Dataset schema. */
export const PRICING_DATASET = {
  name: "Saayesh AI Flow AI Tool Pricing Dataset",
  /** Every figure is a US list price in this currency, excluding tax. */
  currency: "USD",
  /**
   * Bumped by hand when the dataset's SHAPE changes (a new field, a changed
   * meaning), not when a price is re-verified. Row-level `verifiedOn` dates
   * carry freshness; this carries compatibility, for anything parsing the JSON.
   */
  schemaVersion: "1.0.0",
  license: "https://creativecommons.org/licenses/by/4.0/",
  licenseLabel: "CC BY 4.0",
} as const;

/**
 * Category groupings, in display order. A category is the JOB the tool does,
 * because that is how a reader shortlists: nobody weighs a transcription
 * service against an accounting package.
 */
export const PRICING_CATEGORIES = {
  assistant: "General AI assistants",
  writing: "Writing and content",
  automation: "Automation platforms",
  suite: "Productivity suites",
  meetings: "Meetings and transcription",
  email: "Email clients",
  scheduling: "Scheduling",
  crm: "CRM and customer support",
  design: "Design",
  accounting: "Accounting",
  signatures: "Email signatures",
} as const;

export type PricingCategory = keyof typeof PRICING_CATEGORIES;

/**
 * What the price buys, which decides how the bill scales. "account" is a flat
 * plan price; "seat" and "member" are the vendors' own words for per-person
 * pricing, kept distinct so a row reads the way its vendor writes it.
 */
export type BillingUnit = "account" | "seat" | "member";

export interface PricingRow {
  /** Product name as the vendor writes it, e.g. "Claude". */
  tool: string;
  /** The company behind it, so the dataset can be grouped by vendor. */
  vendor: string;
  /** Plan name as the vendor writes it, e.g. "Pro", "Team (standard seat)". */
  plan: string;
  category: PricingCategory;
  /**
   * Price per `unit` per month on MONTHLY billing, in USD.
   * `null` means the vendor lists no monthly-billed option.
   * `0` is a real free plan, never "unknown".
   */
  monthlyUsd: number | null;
  /**
   * Price per `unit` per month on ANNUAL billing, in USD — the monthly
   * EQUIVALENT, not the amount billed. `null` means no annual option is
   * listed, or the listed annual figure was too unclear to publish.
   */
  annualMonthlyUsd: number | null;
  unit: BillingUnit;
  /** True when the vendor lists the figure as a starting price ("from $69"). */
  isStartingPrice?: boolean;
  /** The smallest number of seats the vendor will sell on this plan. */
  seatMinimum?: number;
  /** The metered cap that defines the plan, in the vendor's own terms. */
  usageLimit?: string;
  /** Caveats, promotions, and any arithmetic of our own. */
  note?: string;
  /** Where the figure was read, e.g. "Anthropic pricing page". */
  source: string;
  /** The vendor page, where a page on this site already links to it. */
  sourceUrl?: string;
  /** ISO date the price was checked, matching the `citedOn` page's check date. */
  verifiedOn: string;
  /** The page on this site that published this figure. */
  citedOn: PageId;
}

/**
 * The rows. Grouped by category, and ordered cheapest-first within a tool,
 * which is the order the tracker renders unless a visitor sorts it.
 */
export const PRICING_ROWS = [
  // ---- General AI assistants ---------------------------------------------
  {
    tool: "Claude",
    vendor: "Anthropic",
    plan: "Free",
    category: "assistant",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "Usage limits apply",
    source: "Anthropic pricing page",
    verifiedOn: "2026-10-06",
    citedOn: "claude-for-small-business",
  },
  {
    tool: "Claude",
    vendor: "Anthropic",
    plan: "Pro",
    category: "assistant",
    monthlyUsd: 20,
    annualMonthlyUsd: 17,
    unit: "account",
    note: "The annual figure is a monthly equivalent: $200 is billed up front for the year.",
    source: "Anthropic pricing page",
    verifiedOn: "2026-10-06",
    citedOn: "claude-for-small-business",
  },
  {
    tool: "Claude",
    vendor: "Anthropic",
    plan: "Max",
    category: "assistant",
    monthlyUsd: 100,
    annualMonthlyUsd: null,
    unit: "account",
    isStartingPrice: true,
    usageLimit: "5x or 20x Pro usage, by tier",
    source: "Anthropic pricing page",
    verifiedOn: "2026-10-06",
    citedOn: "claude-for-small-business",
  },
  {
    tool: "Claude",
    vendor: "Anthropic",
    plan: "Team (standard seat)",
    category: "assistant",
    monthlyUsd: 25,
    annualMonthlyUsd: 20,
    unit: "seat",
    seatMinimum: 2,
    usageLimit: "2 to 150 seats",
    source: "Anthropic pricing page",
    verifiedOn: "2026-10-06",
    citedOn: "claude-vs-chatgpt-for-small-business",
  },
  {
    tool: "Claude",
    vendor: "Anthropic",
    plan: "Team (premium seat)",
    category: "assistant",
    monthlyUsd: 125,
    annualMonthlyUsd: 100,
    unit: "seat",
    seatMinimum: 2,
    source: "Anthropic pricing page",
    verifiedOn: "2026-10-06",
    citedOn: "claude-for-small-business",
  },
  {
    tool: "Claude",
    vendor: "Anthropic",
    plan: "Enterprise",
    category: "assistant",
    monthlyUsd: null,
    annualMonthlyUsd: 20,
    unit: "seat",
    isStartingPrice: true,
    note: "Seat price plus usage charged at API rates, so the seat figure is a floor rather than the bill.",
    source: "Anthropic pricing page",
    verifiedOn: "2026-10-06",
    citedOn: "claude-for-small-business",
  },
  {
    tool: "ChatGPT",
    vendor: "OpenAI",
    plan: "Free",
    category: "assistant",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "Usage limits apply",
    source: "OpenAI pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "ChatGPT",
    vendor: "OpenAI",
    plan: "Go",
    category: "assistant",
    monthlyUsd: 8,
    annualMonthlyUsd: null,
    unit: "account",
    note: "The US price. OpenAI states Go is available everywhere ChatGPT is supported, with pricing localised in some markets, so check your own currency rather than assuming the $8.",
    source: "OpenAI pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "ChatGPT",
    vendor: "OpenAI",
    plan: "Plus",
    category: "assistant",
    monthlyUsd: 20,
    annualMonthlyUsd: null,
    unit: "account",
    source: "OpenAI pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "ChatGPT",
    vendor: "OpenAI",
    plan: "Business",
    category: "assistant",
    monthlyUsd: 25,
    annualMonthlyUsd: 20,
    unit: "seat",
    seatMinimum: 2,
    source: "OpenAI pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "ChatGPT",
    vendor: "OpenAI",
    plan: "Pro",
    category: "assistant",
    monthlyUsd: 100,
    annualMonthlyUsd: null,
    unit: "account",
    isStartingPrice: true,
    note: "Three tiers listed at $100, $200 and $500 per month, separated by included usage — far beyond what a small business needs.",
    source: "OpenAI pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- Writing and content ----------------------------------------------
  {
    tool: "Grammarly",
    vendor: "Grammarly",
    plan: "Free",
    category: "writing",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "100 AI prompts per month",
    source: "Grammarly plans page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Grammarly",
    vendor: "Grammarly",
    plan: "Pro",
    category: "writing",
    monthlyUsd: 12,
    annualMonthlyUsd: null,
    unit: "member",
    usageLimit: "A larger AI prompt allowance than Free",
    note: "The allowance was listed as 2,000 AI prompts per member per month when checked on 14 September 2026; the $12 price was re-checked on 7 October 2026. Enterprise is quote-only.",
    source: "Grammarly plans page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Jasper",
    vendor: "Jasper",
    plan: "Pro",
    category: "writing",
    monthlyUsd: 69,
    annualMonthlyUsd: 59,
    unit: "seat",
    note: "7-day free trial. Business pricing is custom, with a 12-month minimum commitment.",
    source: "Jasper pricing page",
    verifiedOn: "2026-09-14",
    citedOn: "jasper-vs-claude-vs-chatgpt",
  },
  {
    tool: "Notion",
    vendor: "Notion",
    plan: "Free",
    category: "writing",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    note: "Includes only a limited trial of the AI features.",
    source: "Notion pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Notion",
    vendor: "Notion",
    plan: "Plus",
    category: "writing",
    monthlyUsd: 10,
    annualMonthlyUsd: null,
    unit: "member",
    note: "Includes only a limited trial of the AI features. Notion lists up to 20% savings on annual billing without publishing a per-plan annual figure.",
    source: "Notion pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Notion",
    vendor: "Notion",
    plan: "Business",
    category: "writing",
    monthlyUsd: 20,
    annualMonthlyUsd: null,
    unit: "member",
    note: "The first plan with the full Notion AI feature set. Custom Agents are priced separately using Notion credits. Up to 20% savings listed on annual billing.",
    source: "Notion pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- Automation platforms ---------------------------------------------
  {
    tool: "Zapier",
    vendor: "Zapier",
    plan: "Free",
    category: "automation",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "100 tasks per month, two-step Zaps only",
    note: "AI by Zapier is listed on paid plans, not the free plan.",
    source: "Zapier pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Zapier",
    vendor: "Zapier",
    plan: "Professional",
    category: "automation",
    monthlyUsd: 29.99,
    annualMonthlyUsd: 19.99,
    unit: "account",
    isStartingPrice: true,
    usageLimit: "750 tasks per month, multi-step Zaps, AI by Zapier",
    note: "Scales up steeply with task volume, so this is the floor for the lowest task tier.",
    source: "Zapier pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Zapier",
    vendor: "Zapier",
    plan: "Team",
    category: "automation",
    monthlyUsd: 103.5,
    annualMonthlyUsd: 69,
    unit: "account",
    isStartingPrice: true,
    usageLimit: "2,000 tasks per month, shared workspaces",
    source: "Zapier pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Power Automate",
    vendor: "Microsoft",
    plan: "Premium",
    category: "automation",
    monthlyUsd: null,
    annualMonthlyUsd: 15,
    unit: "seat",
    note: "Listed as paid yearly. Includes AI Builder credits.",
    source: "Microsoft Power Automate pricing page",
    verifiedOn: "2026-09-15",
    citedOn: "how-to-automate-email-with-ai",
  },

  // ---- Productivity suites ----------------------------------------------
  {
    tool: "Google Workspace",
    vendor: "Google",
    plan: "Business Starter",
    category: "suite",
    monthlyUsd: 7,
    annualMonthlyUsd: null,
    unit: "seat",
    note: "Google lists the Gemini assistant in Gmail on this plan. Introductory discounts run for new customers, but budget against the standard rate, because that is what you renew at. There is no free tier.",
    source: "Google Workspace US pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Google Workspace",
    vendor: "Google",
    plan: "Business Standard",
    category: "suite",
    monthlyUsd: 14,
    annualMonthlyUsd: null,
    unit: "seat",
    source: "Google Workspace US pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Google Workspace",
    vendor: "Google",
    plan: "Business Plus",
    category: "suite",
    monthlyUsd: 22,
    annualMonthlyUsd: null,
    unit: "seat",
    source: "Google Workspace US pricing page",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Microsoft 365 Copilot",
    vendor: "Microsoft",
    plan: "Business",
    category: "suite",
    monthlyUsd: 25.2,
    annualMonthlyUsd: 18,
    unit: "seat",
    note: "The $18 annual figure is a promotional price Microsoft listed through 31 December 2026; the standard annual price shown was $21. Requires an eligible Microsoft 365 Business plan.",
    source: "Microsoft 365 Copilot pricing page",
    verifiedOn: "2026-09-15",
    citedOn: "how-much-does-ai-cost-small-business",
  },

  // ---- Meetings and transcription ---------------------------------------
  {
    tool: "Otter.ai",
    vendor: "Otter.ai",
    plan: "Basic",
    category: "meetings",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "300 transcription minutes per month, 30 minutes per meeting",
    source: "Otter.ai pricing page",
    sourceUrl: "https://otter.ai/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Otter.ai",
    vendor: "Otter.ai",
    plan: "Pro",
    category: "meetings",
    monthlyUsd: 16.99,
    annualMonthlyUsd: 8.33,
    unit: "seat",
    usageLimit: "1,200 minutes per user per month, 90 minutes per meeting",
    source: "Otter.ai pricing page",
    sourceUrl: "https://otter.ai/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Otter.ai",
    vendor: "Otter.ai",
    plan: "Business",
    category: "meetings",
    monthlyUsd: 30,
    annualMonthlyUsd: 19.99,
    unit: "seat",
    usageLimit: "Unlimited minutes, 4 hours per meeting",
    source: "Otter.ai pricing page",
    sourceUrl: "https://otter.ai/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- Email clients -----------------------------------------------------
  {
    tool: "Superhuman",
    vendor: "Superhuman",
    plan: "Business",
    category: "email",
    monthlyUsd: 40,
    annualMonthlyUsd: 33,
    unit: "member",
    note: "The plan Superhuman lists its AI email features on: Auto Drafts, Write with AI with voice and tone matching, Instant Reply, and Auto Labels.",
    source: "Superhuman plans page",
    verifiedOn: "2026-09-15",
    citedOn: "how-to-automate-email-with-ai",
  },
  {
    tool: "Shortwave",
    vendor: "Shortwave",
    plan: "Business",
    category: "email",
    monthlyUsd: 30,
    annualMonthlyUsd: null,
    unit: "seat",
    note: "Lists AI-powered filters, AI autocomplete and summaries. 14-day free trial.",
    source: "Shortwave pricing page",
    verifiedOn: "2026-09-15",
    citedOn: "how-to-automate-email-with-ai",
  },

  // ---- Scheduling --------------------------------------------------------
  {
    tool: "Reclaim.ai",
    vendor: "Reclaim.ai",
    plan: "Lite",
    category: "scheduling",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "1 user, 1 scheduling link, 1 calendar sync, 1-week scheduling range, 5 AI agents",
    source: "Reclaim.ai pricing page",
    sourceUrl: "https://reclaim.ai/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Reclaim.ai",
    vendor: "Reclaim.ai",
    plan: "Starter",
    category: "scheduling",
    monthlyUsd: 12,
    annualMonthlyUsd: null,
    unit: "seat",
    usageLimit: "Teams of up to 10",
    note: "Reclaim says annual billing is discounted, but the annual figures displayed during our check were not clear enough to publish, so none is recorded here.",
    source: "Reclaim.ai pricing page",
    sourceUrl: "https://reclaim.ai/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Reclaim.ai",
    vendor: "Reclaim.ai",
    plan: "Business",
    category: "scheduling",
    monthlyUsd: 18,
    annualMonthlyUsd: null,
    unit: "seat",
    usageLimit: "Teams of up to 100",
    note: "Enterprise, for teams above 100, is not available on monthly billing and requires contacting sales.",
    source: "Reclaim.ai pricing page",
    sourceUrl: "https://reclaim.ai/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- CRM and customer support -----------------------------------------
  {
    tool: "HubSpot",
    vendor: "HubSpot",
    plan: "Starter",
    category: "crm",
    monthlyUsd: 20,
    annualMonthlyUsd: null,
    unit: "seat",
    usageLimit:
      "500 HubSpot Credits per month; credits reset monthly and do not roll over; extra credits listed at $0.010 each",
    note: "Heavily discounted limited-time offers run for new Starter customers, so the first price shown may be well below $20 — treat $20 as the rate you renew at. Free tools are available for 2 users.",
    source: "HubSpot pricing page",
    sourceUrl: "https://www.hubspot.com/pricing/crm",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "HubSpot",
    vendor: "HubSpot",
    plan: "Sales Hub Professional",
    category: "crm",
    monthlyUsd: null,
    annualMonthlyUsd: 90,
    unit: "seat",
    note: "Plus a one-time onboarding fee, which the pricing page lists separately.",
    source: "HubSpot Sales Hub pricing page",
    sourceUrl: "https://www.hubspot.com/pricing/crm",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Tidio",
    vendor: "Tidio",
    plan: "Free",
    category: "crm",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "10 seats, 50 billable conversations per month, 50 one-off Lyro conversations",
    source: "Tidio pricing page",
    sourceUrl: "https://www.tidio.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Tidio",
    vendor: "Tidio",
    plan: "Starter",
    category: "crm",
    monthlyUsd: 24.17,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "100 billable conversations per month",
    note: "Annual billing is advertised as two months free, without a published per-plan annual figure.",
    source: "Tidio pricing page",
    sourceUrl: "https://www.tidio.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Tidio",
    vendor: "Tidio",
    plan: "Growth",
    category: "crm",
    monthlyUsd: 49.17,
    annualMonthlyUsd: null,
    unit: "account",
    isStartingPrice: true,
    source: "Tidio pricing page",
    sourceUrl: "https://www.tidio.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Tidio",
    vendor: "Tidio",
    plan: "Lyro AI agent (add-on)",
    category: "crm",
    monthlyUsd: 32.5,
    annualMonthlyUsd: null,
    unit: "account",
    isStartingPrice: true,
    note: "An add-on billed on top of the plan price, so ongoing AI conversations are a separate line on the bill rather than part of the plan.",
    source: "Tidio pricing page",
    sourceUrl: "https://www.tidio.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- Design ------------------------------------------------------------
  {
    tool: "Canva",
    vendor: "Canva",
    plan: "Free",
    category: "design",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    source: "Canva pricing page",
    sourceUrl: "https://www.canva.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Canva",
    vendor: "Canva",
    plan: "Pro",
    category: "design",
    monthlyUsd: null,
    annualMonthlyUsd: 12,
    unit: "account",
    note: "Canva lists US$144 per year for one person. The $12 monthly equivalent is our own division by 12, not a figure Canva advertises. Canva notes that what you pay can depend on your location and how your team is set up.",
    source: "Canva pricing page",
    sourceUrl: "https://www.canva.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Canva",
    vendor: "Canva",
    plan: "Business",
    category: "design",
    monthlyUsd: null,
    annualMonthlyUsd: 20.83,
    unit: "seat",
    note: "Canva lists US$250 per year per person. The monthly equivalent is our own division by 12, rounded to the cent. A quote-only Enterprise tier sits above it.",
    source: "Canva pricing page",
    sourceUrl: "https://www.canva.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Adobe Express",
    vendor: "Adobe",
    plan: "Premium",
    category: "design",
    monthlyUsd: 9.99,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "250 generative credits per month",
    source: "Adobe Express US pricing page",
    sourceUrl: "https://www.adobe.com/express/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "Adobe Express",
    vendor: "Adobe",
    plan: "Teams",
    category: "design",
    monthlyUsd: 7.99,
    annualMonthlyUsd: null,
    unit: "seat",
    note: "Discounted to $4.99 for the first year. A free plan is also listed.",
    source: "Adobe Express US pricing page",
    sourceUrl: "https://www.adobe.com/express/pricing",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- Accounting --------------------------------------------------------
  {
    tool: "QuickBooks Online",
    vendor: "Intuit",
    plan: "Free",
    category: "accounting",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "1 user, 2 invoices per month, 1 connected bank, profit-and-loss report",
    source: "QuickBooks US pricing page",
    sourceUrl: "https://quickbooks.intuit.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "QuickBooks Online",
    vendor: "Intuit",
    plan: "Simple Start",
    category: "accounting",
    monthlyUsd: 38,
    annualMonthlyUsd: null,
    unit: "account",
    note: "Advertised at 50% off for the first three months. Prices, plan contents and promotions vary by country, as does which AI features your plan and region include.",
    source: "QuickBooks US pricing page",
    sourceUrl: "https://quickbooks.intuit.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "QuickBooks Online",
    vendor: "Intuit",
    plan: "Essentials",
    category: "accounting",
    monthlyUsd: 85,
    annualMonthlyUsd: null,
    unit: "account",
    note: "Advertised at 50% off for the first three months.",
    source: "QuickBooks US pricing page",
    sourceUrl: "https://quickbooks.intuit.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "QuickBooks Online",
    vendor: "Intuit",
    plan: "Plus",
    category: "accounting",
    monthlyUsd: 140,
    annualMonthlyUsd: null,
    unit: "account",
    note: "Advertised at 50% off for the first three months.",
    source: "QuickBooks US pricing page",
    sourceUrl: "https://quickbooks.intuit.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },
  {
    tool: "QuickBooks Online",
    vendor: "Intuit",
    plan: "Advanced",
    category: "accounting",
    monthlyUsd: 340,
    annualMonthlyUsd: null,
    unit: "account",
    note: "Advertised at 50% off for the first three months.",
    source: "QuickBooks US pricing page",
    sourceUrl: "https://quickbooks.intuit.com/pricing/",
    verifiedOn: "2026-10-07",
    citedOn: "best-ai-tools-for-small-business",
  },

  // ---- Email signatures --------------------------------------------------
  {
    tool: "Signatoro",
    vendor: "Signatoro",
    plan: "Free",
    category: "signatures",
    monthlyUsd: 0,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit:
      "1 person, 1 saved signature, 5 layouts, 1 accent colour, a photo or logo, 50 API or MCP requests per month",
    note: "Signatoro's pricing page states that free signatures carry a small “Get my signature” link, and that a Company plan removes it.",
    source: "Signatoro pricing page",
    verifiedOn: "2026-10-21",
    citedOn: "signatoro-email-signature-guide",
  },
  {
    tool: "Signatoro",
    vendor: "Signatoro",
    plan: "Company (up to 5)",
    category: "signatures",
    monthlyUsd: 9,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "Up to 5 people",
    note: "Priced by company size, with a five-person minimum at this tier. Removes the free-plan signature link.",
    source: "Signatoro pricing page",
    verifiedOn: "2026-10-21",
    citedOn: "signatoro-email-signature-guide",
  },
  {
    tool: "Signatoro",
    vendor: "Signatoro",
    plan: "Company (up to 15)",
    category: "signatures",
    monthlyUsd: 19,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "Up to 15 people",
    note: "The lowest tier carrying the company-wide compliance footnote.",
    source: "Signatoro pricing page",
    verifiedOn: "2026-10-21",
    citedOn: "signatoro-email-signature-guide",
  },
  {
    tool: "Signatoro",
    vendor: "Signatoro",
    plan: "Company (up to 50)",
    category: "signatures",
    monthlyUsd: 49,
    annualMonthlyUsd: null,
    unit: "account",
    usageLimit: "Up to 50 people, plus $1.50 per month per extra member",
    note: "Adds footnote history. Over 50 people is by arrangement.",
    source: "Signatoro pricing page",
    verifiedOn: "2026-10-21",
    citedOn: "signatoro-email-signature-guide",
  },
] as const satisfies readonly PricingRow[];
