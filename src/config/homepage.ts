/**
 * Editorial choices the homepage makes, in one typed place.
 *
 * Everything here is a *selection* from pages that already exist — ids are
 * typed to the registry, so a featured guide that is renamed or unpublished
 * fails the build rather than becoming a dead card. Nothing here invents a
 * statistic, a popularity ranking, or a "most read" claim: these are editor's
 * picks, and the homepage labels them as such.
 */
import type { PageId, PillarId } from "./pages";

/**
 * Featured guides, lead first. The lead gets the large card; the rest fill the
 * list beside it. Chosen to cover different intents rather than one category:
 * a buying roundup, a head-to-head, a budgeting guide, a skill, a workflow.
 */
export const FEATURED_GUIDES: readonly PageId[] = [
  "best-ai-tools-for-small-business",
  "claude-vs-chatgpt-for-small-business",
  "how-much-does-ai-cost-small-business",
  "how-to-write-effective-ai-prompts",
  "zapier-ai-automation-examples",
];

/** How many of the newest guides the "Latest" row shows. */
export const LATEST_GUIDE_COUNT = 6;

export interface StartHerePath {
  /** The visitor's own words for where they are. */
  question: string;
  /** What that path leads to. */
  summary: string;
  /** The category hub this path belongs to. */
  pillar: PillarId;
  /** The single best first guide in that category. */
  guide: PageId;
}

/**
 * The four routes into the site, for a visitor who does not yet know which
 * category they want. Each one points at a published hub and one published
 * guide inside it, both typed to the registry.
 */
export const START_HERE: readonly StartHerePath[] = [
  {
    question: "I'm new to AI",
    summary: "What these tools actually do, where to begin, and what to ignore for now.",
    pillar: "getting-started",
    guide: "how-to-use-ai-tools",
  },
  {
    question: "I want to automate repetitive tasks",
    summary: "Worked automation examples for email, scheduling, and the jobs that repeat weekly.",
    pillar: "ai-automation",
    guide: "zapier-ai-automation-examples",
  },
  {
    question: "I need AI tools for my business",
    summary: "Picks by use case, what they cost, and where a tool beats hiring for the job.",
    pillar: "ai-business-tools",
    guide: "best-ai-tools-for-small-business",
  },
  {
    question: "I want better AI prompts",
    summary: "A reusable structure for briefing a model, plus prompts you can copy and adapt.",
    pillar: "ai-prompts",
    guide: "how-to-write-effective-ai-prompts",
  },
];

/**
 * Illustrative inputs for the cost-calculator preview on the homepage.
 *
 * These are not vendor prices and the preview says so: they are round numbers
 * chosen to show the shape of the output. The totals beside them are produced
 * by running these through computeTotals() — the calculator's own function — at
 * build time, so the preview can never show arithmetic the real tool would not.
 */
export const CALCULATOR_PREVIEW = {
  tools: [
    { name: "Writing assistant", pricePerSeat: 20, seats: 2, monthlyAddOn: 0, oneTimeSetup: 0 },
    { name: "Meeting notes", pricePerSeat: 12, seats: 1, monthlyAddOn: 0, oneTimeSetup: 0 },
    { name: "Automation platform", pricePerSeat: 0, seats: 0, monthlyAddOn: 15, oneTimeSetup: 150 },
  ],
  business: { employees: 3, activeUsers: 3, businessUnits: null },
} as const;
