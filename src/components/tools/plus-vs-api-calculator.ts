/**
 * ChatGPT Plus vs API break-even calculator — logic and constants.
 *
 * Shared by PlusVsApiCalculator.astro and its inline script. All pricing,
 * token estimates, feature-value assumptions and comparison maths live here,
 * so the template's data attributes and the script's arithmetic cannot drift
 * apart. Vendor repricing is a single-file update.
 *
 * Pricing is each vendor's published list price in US dollars, from the
 * vendor's own page, verified on PRICES_UPDATED. Discounts, promotional
 * annual-billing rates, enterprise tiers and Pakistan-local reseller rates are
 * deliberately left out: the spread between them is less than the spread
 * between the options themselves.
 *
 * Switching cost: a flat monthly estimate of what a reader gives up when they
 * move from a chat subscription to the raw API — no app, no voice, no built-in
 * image generation, no memory, no file-upload pipeline. The number is
 * editorial, not measured, and the page states that in writing. Subtracting it
 * from the API cost means an "API wins" verdict is a confident one: it has
 * beaten the subscription even after the features are paid for.
 */

export const PRICES_UPDATED = "2026-11-08";

/** Fixed monthly subscription options we rank against the API. */
export interface Subscription {
  id: string;
  label: string;
  provider: "OpenAI" | "Anthropic" | "Google";
  monthlyUsd: number;
  /** Minimum user count, for plans with a seat floor. Omit for 1. */
  minUsers?: number;
  /** One short, honest line on when this plan is the right pick. */
  honestNote: string;
}

export const SUBSCRIPTIONS: readonly Subscription[] = [
  {
    id: "chatgpt-plus",
    label: "ChatGPT Plus",
    provider: "OpenAI",
    monthlyUsd: 20,
    honestNote:
      "Best default for most small-business owners. Voice, images, file uploads and memory included.",
  },
  {
    id: "chatgpt-team",
    label: "ChatGPT Team",
    provider: "OpenAI",
    monthlyUsd: 25,
    minUsers: 2,
    honestNote:
      "Worth it only if you have a real teammate who also uses it. Solo owners should stay on Plus.",
  },
  {
    id: "chatgpt-pro",
    label: "ChatGPT Pro",
    provider: "OpenAI",
    monthlyUsd: 200,
    honestNote: "Only for power users who hit the Plus message cap every day.",
  },
  {
    id: "claude-pro",
    label: "Claude Pro",
    provider: "Anthropic",
    monthlyUsd: 20,
    honestNote: "Same price as Plus; different strengths. Often better for long writing and reasoning.",
  },
  {
    id: "claude-max-5x",
    label: "Claude Max (5x Pro)",
    provider: "Anthropic",
    monthlyUsd: 100,
    honestNote: "Pick this only if Claude Pro's usage limits are the thing holding you back.",
  },
  {
    id: "claude-max-20x",
    label: "Claude Max (20x Pro)",
    provider: "Anthropic",
    monthlyUsd: 200,
    honestNote: "Rare. Only for heavy daily Claude users who exhaust the 5x tier.",
  },
  {
    id: "gemini-advanced",
    label: "Gemini Advanced (Google AI Pro)",
    provider: "Google",
    monthlyUsd: 19.99,
    honestNote: "Cheapest of the big three. Also gives you 2 TB Drive storage, which Plus does not.",
  },
];

/** API-pricing rows that the calculator compares against subscriptions. */
export interface ApiModel {
  id: string;
  label: string;
  /** USD per 1,000,000 input tokens. */
  inputPerMillion: number;
  /** USD per 1,000,000 output tokens. */
  outputPerMillion: number;
  /** When this API choice is a sensible pick for a small-biz owner. */
  honestNote: string;
}

export const API_MODELS: readonly ApiModel[] = [
  {
    id: "gpt-4o",
    label: "OpenAI API (GPT-4o)",
    inputPerMillion: 2.5,
    outputPerMillion: 10.0,
    honestNote:
      "Only worth the switch for automation at scale. At low volume Plus wins on features alone.",
  },
  {
    id: "gpt-4o-mini",
    label: "OpenAI API (GPT-4o mini)",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    honestNote: "Cheapest OpenAI route. Great for bulk automation; weaker on hard reasoning.",
  },
  {
    id: "gpt-4-1",
    label: "OpenAI API (GPT-4.1)",
    inputPerMillion: 2.0,
    outputPerMillion: 8.0,
    honestNote: "Middle ground when 4o mini isn't enough and 4o feels expensive.",
  },
  {
    id: "gpt-5",
    label: "OpenAI API (GPT-5)",
    inputPerMillion: 1.25,
    outputPerMillion: 10.0,
    honestNote: "The newest frontier tier. Worth it when the task needs the strongest reasoning.",
  },
];

/** Dropdown presets for prompt and reply length, in tokens. */
export const PROMPT_LENGTHS = [
  { value: "30", label: "Short — e.g. 'What's a good subject line?'" },
  { value: "180", label: "Medium — e.g. 'Rewrite this paragraph'" },
  { value: "650", label: "Long — e.g. 'Here's a 500-word draft, improve it'" },
] as const;

export const REPLY_LENGTHS = [
  { value: "120", label: "Short — a one-paragraph reply" },
  { value: "450", label: "Medium — several paragraphs" },
  { value: "1400", label: "Long — a full essay or article" },
] as const;

/**
 * The ChatGPT model the reader picks inside Plus. The mapping here is to the
 * API price row we score Plus against, so the "stay on Plus or switch to API"
 * question is asked on the same model's prices.
 */
export const MODEL_CHOICES = [
  { value: "gpt-4o", label: "GPT-4o (the usual default in Plus)" },
  { value: "gpt-4o-mini", label: "GPT-4o mini (lighter, cheaper)" },
  { value: "gpt-5", label: "GPT-5 (newest frontier tier)" },
  { value: "gpt-4-1", label: "GPT-4.1 (middle tier)" },
] as const;

/** Hard upper bounds on the number inputs so a mistyped figure can't skew totals. */
export const LIMITS = {
  maxPromptsPerDay: 1000,
  maxDaysPerMonth: 31,
  minDaysPerMonth: 1,
} as const;

/** Default inputs used when the page first renders. */
export const DEFAULTS = {
  promptsPerDay: 30,
  promptLength: "180" as (typeof PROMPT_LENGTHS)[number]["value"],
  replyLength: "450" as (typeof REPLY_LENGTHS)[number]["value"],
  model: "gpt-4o" as (typeof MODEL_CHOICES)[number]["value"],
  daysPerMonth: 22,
} as const;

/**
 * Flat estimate of what a Plus subscriber gives up when they move to the raw
 * API, priced at what a small-biz owner would spend to rebuild it: $5 of extra
 * time per month at a conservative hourly rate. Subtracted from API totals so a
 * verdict of "API wins" holds up after feature parity is paid for.
 */
export const SWITCHING_COST_USD = 5;

/** Three one-click presets the reader can apply to see how usage shape changes the answer. */
export const PRESETS = [
  {
    id: "blog-writer",
    label: "I write 5 blog posts a week",
    promptsPerDay: 10,
    promptLength: "650" as (typeof PROMPT_LENGTHS)[number]["value"],
    replyLength: "1400" as (typeof REPLY_LENGTHS)[number]["value"],
    model: "gpt-4o" as (typeof MODEL_CHOICES)[number]["value"],
    daysPerMonth: 22,
    description:
      "Long briefs in, long drafts out. Few runs per day but every run is big, which pushes you towards the subscription tier.",
  },
  {
    id: "email-all-day",
    label: "I use AI for emails all day",
    promptsPerDay: 50,
    promptLength: "180" as (typeof PROMPT_LENGTHS)[number]["value"],
    replyLength: "450" as (typeof REPLY_LENGTHS)[number]["value"],
    model: "gpt-4o" as (typeof MODEL_CHOICES)[number]["value"],
    daysPerMonth: 22,
    description: "Many short conversations across a working day. Right in the sweet spot where Plus is hard to beat.",
  },
  {
    id: "chatbot-automation",
    label: "I run a chatbot on my site",
    promptsPerDay: 200,
    promptLength: "180" as (typeof PROMPT_LENGTHS)[number]["value"],
    replyLength: "450" as (typeof REPLY_LENGTHS)[number]["value"],
    model: "gpt-4o-mini" as (typeof MODEL_CHOICES)[number]["value"],
    daysPerMonth: 30,
    description: "Automated calls on a cheaper model, every day of the month. This is where the API's per-token pricing wins.",
  },
] as const;

/**
 * Monthly tokens from user inputs. Daily tokens times days in month, split into
 * input and output buckets.
 */
export function monthlyTokens(input: {
  promptsPerDay: number;
  promptLength: number;
  replyLength: number;
  daysPerMonth: number;
}): { inputTokens: number; outputTokens: number } {
  const dailyInput = input.promptsPerDay * input.promptLength;
  const dailyOutput = input.promptsPerDay * input.replyLength;
  return {
    inputTokens: Math.round(dailyInput * input.daysPerMonth),
    outputTokens: Math.round(dailyOutput * input.daysPerMonth),
  };
}

/** Cost per month of one API model at the given monthly token volumes, in USD. */
export function monthlyApiCost(
  model: ApiModel,
  tokens: { inputTokens: number; outputTokens: number },
): number {
  const inputCost = (tokens.inputTokens / 1_000_000) * model.inputPerMillion;
  const outputCost = (tokens.outputTokens / 1_000_000) * model.outputPerMillion;
  return inputCost + outputCost;
}

/** Format a USD amount for display at prices that span $0.01 to $200. */
export function formatUSD(amount: number): string {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) return `$${amount.toFixed(4)}`;
  if (amount < 10) return `$${amount.toFixed(2)}`;
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/**
 * Clamp a number between zero and a maximum. Used on every number input so a
 * mistyped value cannot flow into the arithmetic.
 */
export function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value) || value < min) return min;
  return Math.min(value, max);
}
