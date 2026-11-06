/**
 * Prompt cost calculator — logic and constants.
 *
 * Shared by PromptCostCalculator.astro and its inline script. All arithmetic
 * lives here so the template's data attributes and the script's maths cannot
 * drift apart, and every price is in one list that can be updated in isolation
 * when a vendor changes its published rates.
 *
 * Tokenisation note: every model here is estimated, including the OpenAI ones.
 * This site deliberately ships no WASM tokenizers or multi-megabyte JS bundles
 * for a utility that is a side offering; the published character-per-token
 * ratios below are good to within about 10 percent on English prose, which is
 * enough resolution to tell whether a prompt costs cents or dollars across a
 * month of use. Where the input is code or non-English, the estimate is likely
 * to be low; the page states this in writing.
 *
 * Pricing is the public list price per million tokens, in US dollars, from each
 * vendor's own pricing page as of PRICES_UPDATED. Discounts, batch pricing,
 * context-caching, enterprise rates and off-peak windows are deliberately left
 * out: a calculator that applied them would need figures a small-business owner
 * does not have. The on-page copy says so.
 */

export interface ModelPricing {
  /** Stable id used as a data attribute and in copy output. */
  id: string;
  /** Display name the visitor sees. */
  name: string;
  /** Provider label, for the row's secondary line. */
  provider: "OpenAI" | "Anthropic" | "Google" | "DeepSeek" | "Meta via Groq";
  /** USD per 1,000,000 input tokens. */
  inputPerMillion: number;
  /** USD per 1,000,000 output tokens. */
  outputPerMillion: number;
  /**
   * Average characters per token for English prose, used to estimate token
   * counts from the pasted prompt. OpenAI o200k and cl100k average about 4.0
   * on business English; Claude averages 3.5; Gemini averages 4.0.
   */
  charsPerToken: number;
  /**
   * One honest line about when this model is actually the right pick — the
   * site's voice, not marketing. Shown in its own column on the results table.
   */
  worthItNote: string;
  /** Optional one-line caveat, rendered below the worth-it note. */
  caveat?: string;
}

/**
 * Date the prices on this page were last verified against the vendors' own
 * pricing pages. Shown on the tool and in the on-page copy so a stale price is
 * never implied to be live.
 */
export const PRICES_UPDATED = "2026-11-06";

/**
 * The models the calculator covers. Order matters — the table renders in this
 * order, and the "cheapest for your prompt" highlight only moves within it.
 *
 * Prices are the published rates each vendor lists for the standard tier. The
 * worth-it notes are editorial and intentionally short: a reader at this
 * calculator wants a quick pick, not a review.
 */
export const MODELS: readonly ModelPricing[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    charsPerToken: 4.0,
    worthItNote:
      "Best default for small business work. Only upgrade if the task actually fails here first.",
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    inputPerMillion: 2.5,
    outputPerMillion: 10.0,
    charsPerToken: 4.0,
    worthItNote:
      "Worth it for reasoning-heavy work and long documents. Overkill for everyday content tasks.",
  },
  {
    id: "gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    inputPerMillion: 2.0,
    outputPerMillion: 8.0,
    charsPerToken: 4.0,
    worthItNote:
      "A sensible middle choice when GPT-4o mini is not enough but GPT-4o feels expensive.",
  },
  {
    id: "claude-haiku",
    name: "Claude Haiku 4",
    provider: "Anthropic",
    inputPerMillion: 0.8,
    outputPerMillion: 4.0,
    charsPerToken: 3.5,
    worthItNote: "Cheapest Claude tier. Good for bulk classification and light drafting.",
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    provider: "Anthropic",
    inputPerMillion: 3.0,
    outputPerMillion: 15.0,
    charsPerToken: 3.5,
    worthItNote:
      "Pick this for careful reasoning and long writing, or when GPT keeps inventing facts.",
  },
  {
    id: "claude-opus",
    name: "Claude Opus 4",
    provider: "Anthropic",
    inputPerMillion: 15.0,
    outputPerMillion: 75.0,
    charsPerToken: 3.5,
    worthItNote: "Rarely worth the price unless you need the best possible output for a one-off.",
  },
  {
    id: "gemini-flash",
    name: "Gemini 2.5 Flash",
    provider: "Google",
    inputPerMillion: 0.3,
    outputPerMillion: 2.5,
    charsPerToken: 4.0,
    worthItNote:
      "Cheap and fast. Good for high-volume classification and light generation at scale.",
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.5 Pro",
    provider: "Google",
    inputPerMillion: 1.25,
    outputPerMillion: 10.0,
    charsPerToken: 4.0,
    worthItNote:
      "Strong on long-context work and multimodal input. Overkill for short text prompts.",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    inputPerMillion: 0.27,
    outputPerMillion: 1.1,
    charsPerToken: 4.0,
    worthItNote: "Outstanding value for the quality.",
    caveat: "Data is processed in China. Check your compliance requirements before use.",
  },
  {
    id: "llama-70b-groq",
    name: "Llama 3.3 70B",
    provider: "Meta via Groq",
    inputPerMillion: 0.59,
    outputPerMillion: 0.79,
    charsPerToken: 4.0,
    worthItNote:
      "Open-weights model served fast via Groq. Reasonable quality when latency matters.",
  },
];

/**
 * Expected-response-length presets, in output tokens. Custom is handled by a
 * separate number input in the markup.
 */
export const OUTPUT_LENGTHS = [
  { value: "150", label: "Short (~150 tokens, a tweet or short reply)" },
  { value: "500", label: "Medium (~500 tokens, a few paragraphs)" },
  { value: "1500", label: "Long (~1500 tokens, a full article draft)" },
  { value: "custom", label: "Custom (enter a token count)" },
] as const;

/**
 * Monthly run-count presets. "Once" treats the prompt as a one-off so the
 * per-month column shows the single cost.
 */
export const VOLUMES = [
  { value: "1", label: "Just this once" },
  { value: "100", label: "100 runs / month" },
  { value: "1000", label: "1,000 runs / month" },
  { value: "10000", label: "10,000 runs / month" },
  { value: "custom", label: "Custom (enter runs per month)" },
] as const;

/**
 * Hard upper bounds on any single number the visitor enters, so a mistyped
 * figure cannot crash the maths or render an uninformative total.
 */
export const LIMITS = {
  /** 1M characters in the prompt textarea. Enough for the longest real prompts. */
  maxPromptChars: 1_000_000,
  /** 1M tokens on the custom output-length input. */
  maxOutputTokens: 1_000_000,
  /** 10M runs a month on the custom volume input. */
  maxVolume: 10_000_000,
} as const;

/**
 * Character-based token estimate for one model. English prose only; code and
 * non-English will undercount. The floor keeps the figure above zero on a
 * single-character prompt so the table never renders a divide-by-zero.
 */
export function estimateTokens(text: string, charsPerToken: number): number {
  if (!text) return 0;
  return Math.max(1, Math.round(text.length / charsPerToken));
}

/**
 * Cost of one run of a prompt on a model, in US dollars.
 */
export function costPerRun(
  model: ModelPricing,
  inputTokens: number,
  outputTokens: number,
): number {
  const inputCost = (inputTokens / 1_000_000) * model.inputPerMillion;
  const outputCost = (outputTokens / 1_000_000) * model.outputPerMillion;
  return inputCost + outputCost;
}

/**
 * Format a USD amount for display. Prices below one cent are shown in a finer
 * precision so a bulk comparison does not round every row to $0.00.
 */
export function formatUSD(amount: number): string {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) {
    return `$${amount.toFixed(5)}`;
  }
  if (amount < 1) {
    return `$${amount.toFixed(4)}`;
  }
  if (amount < 100) {
    return `$${amount.toFixed(2)}`;
  }
  return `$${amount.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/**
 * Clamp a number between zero and a maximum. Used on every input so an obvious
 * mis-entry cannot flow into the arithmetic and produce a confident wrong total.
 */
export function clamp(value: number, max: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(value, max);
}
