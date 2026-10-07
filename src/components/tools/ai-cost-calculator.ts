/**
 * Shared logic for the Small Business AI Cost Calculator.
 *
 * Deliberately a plain TypeScript module with no DOM and no I/O, imported by
 * three places that must never disagree: ToolRow.astro and
 * AiCostCalculator.astro (which render the inputs and their `max` attributes
 * from the same limits) and the calculator's client script (which validates,
 * computes, and formats with the same functions).
 *
 * This is a hard-cost calculator. Nothing here estimates ROI, hours saved,
 * productivity, or payback: every number it returns is arithmetic on figures
 * the visitor typed in. No vendor price is hardcoded anywhere.
 */

/** Placeholder row number in the <template> markup, swapped out when cloned. */
export const ROW_TOKEN = "__ROW__";

/**
 * Accepted input ranges, mirrored by each input's `min`/`max` attributes and
 * enforced again in script (attributes alone do not stop a pasted value). The
 * caps exist so no combination of inputs can overflow into a meaningless or
 * non-finite total.
 */
export const LIMITS = {
  /** Per money field, in the selected currency. */
  maxMoney: 1_000_000,
  /** Per count field: seats, employees, active users, business units. */
  maxCount: 100_000,
  /** Tool rows a visitor can add. */
  maxRows: 20,
} as const;

/**
 * Display currencies. The selector changes the symbol and the stated currency
 * and nothing else: there is no conversion here and no exchange-rate source, so
 * every figure a visitor enters must already be in the currency they pick.
 */
export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US dollar" },
  { code: "GBP", symbol: "£", label: "Pound sterling" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "CAD", symbol: "C$", label: "Canadian dollar" },
  { code: "AUD", symbol: "A$", label: "Australian dollar" },
  { code: "PKR", symbol: "Rs", label: "Pakistani rupee" },
] as const;

export const DEFAULT_CURRENCY = CURRENCIES[0];

/** One tool's cost inputs, already validated into finite, non-negative numbers. */
export interface ToolInput {
  /** Row label. Blank is normal: the row then falls back to "Tool n". */
  name: string;
  pricePerSeat: number;
  seats: number;
  monthlyAddOn: number;
  oneTimeSetup: number;
}

/** Business-level inputs. `null` means "not provided", never zero. */
export interface BusinessInput {
  employees: number | null;
  activeUsers: number | null;
  businessUnits: number | null;
}

export interface ToolMonthlyCost {
  name: string;
  monthly: number;
}

export interface CostTotals {
  /** Per-tool monthly cost, in row order, for the breakdown table. */
  perTool: ToolMonthlyCost[];
  monthlyRecurring: number;
  annualRecurring: number;
  totalSetup: number;
  firstYearTotal: number;
  /** `null` wherever the denominator was not supplied — never Infinity or NaN. */
  perActiveUser: number | null;
  perEmployee: number | null;
  perBusinessUnit: number | null;
}

/** A usable number, or 0. Keeps NaN and Infinity out of every total. */
function finite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/**
 * Monthly recurring cost of one tool:
 *   (price per seat per month x paid seats) + monthly usage/add-on cost
 * The one-time setup cost is deliberately not in here: it is not recurring.
 */
export function toolMonthlyCost(tool: ToolInput): number {
  return finite(tool.pricePerSeat) * finite(tool.seats) + finite(tool.monthlyAddOn);
}

/** Total divided by a headcount, or `null` when there is no usable denominator. */
function per(total: number, count: number | null): number | null {
  if (count === null || !Number.isFinite(count) || count <= 0) return null;
  const result = total / count;
  return Number.isFinite(result) ? result : null;
}

/**
 * Every figure the calculator reports, from the tool rows and the business
 * inputs. The formulas are the ones published in the page's methodology
 * section, in the same order.
 */
export function computeTotals(tools: readonly ToolInput[], business: BusinessInput): CostTotals {
  const perTool = tools.map((tool, index): ToolMonthlyCost => ({
    name: tool.name.trim() || `Tool ${index + 1}`,
    monthly: toolMonthlyCost(tool),
  }));

  const monthlyRecurring = perTool.reduce((sum, tool) => sum + tool.monthly, 0);
  const annualRecurring = monthlyRecurring * 12;
  const totalSetup = tools.reduce((sum, tool) => sum + finite(tool.oneTimeSetup), 0);

  return {
    perTool,
    monthlyRecurring,
    annualRecurring,
    totalSetup,
    firstYearTotal: annualRecurring + totalSetup,
    perActiveUser: per(monthlyRecurring, business.activeUsers),
    perEmployee: per(monthlyRecurring, business.employees),
    perBusinessUnit: per(monthlyRecurring, business.businessUnits),
  };
}

/** Grouping follows the site's language rather than the visitor's locale. */
const groupFor = (digits: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const WHOLE = groupFor(0);
const CENTS = groupFor(2);

/** Shown wherever a figure cannot be calculated yet. Never "NaN" or "Infinity". */
export const NO_VALUE = "—";

/**
 * A money figure with the selected currency symbol: whole amounts print without
 * decimals, anything else to two. Rounding happens here, for display only —
 * the totals above stay exact.
 */
export function formatMoney(value: number | null, symbol: string): string {
  if (value === null || !Number.isFinite(value)) return NO_VALUE;

  const rounded = Math.round(value * 100) / 100;
  const amount = Object.is(rounded, -0) ? 0 : rounded;
  const formatter = Number.isInteger(amount) ? WHOLE : CENTS;
  return `${symbol}${formatter.format(amount)}`;
}

export type FieldKind = "money" | "count";

export type FieldValue = { ok: true; value: number | null } | { ok: false; message: string };

/**
 * Validates one raw input value.
 *
 * An empty field is not an error — the calculator opens with empty fields, and
 * shouting at a visitor who has typed nothing yet would be useless. Empty means
 * "not provided": `null`, which the caller treats as 0 in a sum and as a
 * missing denominator in a per-person figure. Everything that is genuinely
 * wrong — text, a negative number, a fractional headcount, an absurd value —
 * returns a message that is shown next to the field.
 */
export function parseFieldValue(raw: string, kind: FieldKind): FieldValue {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: null };

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { ok: false, message: "Enter a number." };
  if (value < 0) return { ok: false, message: "Enter 0 or more." };

  if (kind === "count") {
    if (!Number.isInteger(value)) return { ok: false, message: "Enter a whole number." };
    if (value > LIMITS.maxCount) {
      return { ok: false, message: `Enter ${WHOLE.format(LIMITS.maxCount)} or less.` };
    }
    return { ok: true, value };
  }

  if (value > LIMITS.maxMoney) {
    return { ok: false, message: `Enter ${WHOLE.format(LIMITS.maxMoney)} or less.` };
  }
  // Fractions of a cent are not an error; they are just rounded on display.
  return { ok: true, value };
}
