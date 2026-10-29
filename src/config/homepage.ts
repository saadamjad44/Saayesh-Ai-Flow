/**
 * Editorial choices the homepage makes, in one typed place.
 *
 * Everything here is a *selection* from pages that already exist — ids are
 * typed to the registry, so a featured guide that is renamed or unpublished
 * fails the build rather than becoming a dead card. Nothing here invents a
 * statistic, a popularity ranking, or a "most read" claim: these are editor's
 * picks, and the homepage labels them as such.
 */
import type { AnalyticsEventName } from "@/lib/analytics";
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

/**
 * The standfirst printed under "Featured guides", kept here rather than in the
 * template because it describes the list directly above it. It names the
 * intents the picks cover and how many there are, so editing the list without
 * editing this sentence would leave the homepage describing a selection it no
 * longer shows — and from the template that sentence is nowhere near the array
 * it is about.
 */
export const FEATURED_GUIDES_INTRO =
  "Five guides that between them cover choosing a tool, comparing two, budgeting for them, briefing them properly, and putting one to work.";

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

/* ---------------------------------------------------------------------------
 * Free-tool promotions
 * ------------------------------------------------------------------------- */

export interface ToolPromo {
  /** The tool page this promotes. Typed to the registry, like every pick above. */
  tool: PageId;
  eyebrow: string;
  heading: string;
  /** DOM id of the panel's <h2>, used by its section's `aria-labelledby`. */
  headingId: string;
  description: string;
  /**
   * Four short lines on what the tool *reports*. Never an outcome claim: these
   * describe the output of a calculator, not a result anyone is promised.
   */
  features: readonly string[];
  primaryLabel: string;
  /** GA4 event sent when the primary action is clicked. Omit to track nothing. */
  primaryEvent?: AnalyticsEventName;
  /** An optional second action, always to a page that already exists. */
  secondary?: { page: PageId; label: string };
  /** Small print beside the actions. */
  note?: string;
}

/**
 * The homepage's two free-tool panels, as data rather than as two near-copies
 * of the same 150 lines of markup. <ToolPromoPanel> renders both from this;
 * what it cannot take from here is the preview panel beside the copy, because
 * each preview is built by running that tool's own calculation module at build
 * time — which is the point of it, and why no figure in either preview is typed
 * by hand anywhere in this repository.
 *
 * Order is display order. The cost calculator keeps the dark panel and the lead
 * position it already had; the email calculator takes the light teal variant
 * below it, so the two read as two tools rather than as one tool twice.
 */
export const TOOL_PROMOS: readonly ToolPromo[] = [
  {
    tool: "small-business-ai-cost-calculator",
    eyebrow: "Free tool",
    heading: "Work out what AI will actually cost you",
    headingId: "calculator-heading",
    description:
      "Add the tools you are paying for — or thinking about — and the calculator totals your monthly and annual spend, adds one-off setup costs for a first-year figure, and divides it across your team.",
    features: [
      "Monthly recurring cost across every tool",
      "Annual cost, and first-year cost with setup",
      "Cost per employee and per active user",
      "Six currencies, and nothing leaves your browser",
    ],
    primaryLabel: "Use the AI Cost Calculator",
    note: "No sign-up. No data sent anywhere.",
  },
  {
    tool: "ai-email-time-savings-calculator",
    eyebrow: "Free productivity calculator",
    heading: "How much time could AI save on your emails?",
    headingId: "email-calculator-heading",
    description:
      "Estimate your monthly email workload, human review time, AI software costs, and potential productivity savings with our free interactive calculator.",
    features: [
      "Monthly active hours saved, after review time",
      "The value of that time, net of what the AI costs",
      "Break-even email volume and recurring ROI",
      "Losses shown as losses, never dressed up as gains",
    ],
    primaryLabel: "Try the free email savings calculator",
    primaryEvent: "email_calculator_cta_click",
    secondary: { page: "how-to-automate-email-with-ai", label: "Learn about AI email automation" },
    note: "No sign-up. Your figures stay in the browser.",
  },
];

/* ---------------------------------------------------------------------------
 * Homepage FAQ
 * ------------------------------------------------------------------------- */

/**
 * The five questions a first-time visitor arrives with, answered on the page
 * they land on.
 *
 * Why a hub page carries an FAQ at all: the homepage's own prose is otherwise
 * entirely navigational, which leaves it with no answer to any actual question
 * — including the ones that bring people here. These five are the questions the
 * site's own guides are built around, answered in two or three sentences each,
 * with the guide that answers them properly named in the text so the answer is
 * a route in rather than a dead end.
 *
 * Every answer is constrained the way the rest of the site is constrained. No
 * figure appears here that is not either computed from the pricing dataset at
 * render time or already published on the page being pointed at; nothing claims
 * hands-on testing; and the recommendation question is answered with the
 * method, not with a tool, because a hub page recommending one product is how a
 * trust page stops being one.
 *
 * Plain text on purpose: FaqSection renders the visible answer and the FAQPage
 * JSON-LD from the same string, so the structured data cannot say something the
 * reader is not shown. That is also why there are no links inside an answer.
 */
export const HOME_FAQ: readonly { question: string; answer: string }[] = [
  {
    question: "What are the best AI tools for a small business?",
    answer:
      "There is no single answer, and any list that gives you one has skipped the question. The tool that earns its place depends on the job you are handing over — drafting, meeting notes, support replies, scheduling, bookkeeping — and on whether you are paying per person or for one account. Our picks-by-use-case guide works through it job by job rather than ranking products against each other, and our head-to-head comparisons cover the pairs people actually choose between, such as Claude and ChatGPT.",
  },
  {
    question: "How much do AI tools cost for a small business?",
    answer:
      "Far less than the enterprise figures suggest, and far more than the headline price implies once you multiply it. Most small-business AI tools list an entry plan in the single digits to low twenties per month, but the number that decides your bill is the billing unit: a flat account price stays flat as you grow, while a per-seat price multiplies by headcount. Our pricing tracker publishes every list price we have checked with the date we checked it, and the free cost calculator totals your own stack across a month, a year, and a first year with setup.",
  },
  {
    question: "Are free AI plans good enough to run a business on?",
    answer:
      "For one person testing an idea, often yes. Nearly every free plan we have recorded is capped — by monthly prompts, automation tasks, transcription minutes, conversations, or the number of people who can use it — so the question is never whether a free tier exists but where its cap sits relative to your actual volume. Read the cap before the price, and treat a free plan as a trial you are not paying for rather than as a tier you can stay on.",
  },
  {
    question: "Is it safe to put business data into AI tools?",
    answer:
      "It depends entirely on the plan you are on, which is why it belongs in the buying decision rather than after it. Vendors publish different data-retention and training terms for free, paid, and business tiers of the same product, and the differences are substantial. Check what a vendor says it does with your inputs on the plan you are actually buying, keep client-identifiable and regulated data out of tools you have not checked, and — where notetakers are involved — find out what consent your jurisdiction requires before recording anyone.",
  },
  {
    question: "How does this site decide what to recommend?",
    answer:
      "Guides are written from official product documentation, pricing pages, and product announcements, summarised in our own words with the sources linked. A tool is only described as tested when it has actually been tested; research-based guides say so on the page and carry no scores. Every guide shows when it was last updated, and every price shows the date it was checked on the vendor's own page. Some pages carry affiliate links and disclose it before the recommendation — commissions do not decide what gets recommended or how it ranks.",
  },
];
