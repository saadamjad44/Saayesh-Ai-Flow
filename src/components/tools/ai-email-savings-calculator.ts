/**
 * Shared logic for the AI Email Time Savings & ROI Calculator.
 *
 * A plain TypeScript module with no DOM and no I/O, imported by three places
 * that must never disagree: AiEmailSavingsCalculator.astro (which renders the
 * inputs, their defaults and their `min`/`max` attributes from the field specs
 * below), that component's client script (which validates, computes and formats
 * with the same functions), and ai-email-savings-calculator.spec.ts (which
 * checks the arithmetic against a worked example on every build).
 *
 * What this calculator is: an estimate built entirely from figures the visitor
 * typed in. Every default is an illustrative placeholder, labelled as one on
 * the page — not a market average, not a benchmark, and not a measured saving.
 * Nothing here is a forecast of cash. `grossMonthlyTimeValue` is the visitor's
 * own hourly figure applied to hours that are no longer spent on email; whether
 * that becomes money depends on what the time is used for instead, which the
 * page says in writing and no formula can know.
 *
 * Deliberately shares CURRENCIES/DEFAULT_CURRENCY with the cost calculator:
 * both tools display one currency symbol and convert nothing, and the site
 * should not grow two lists of currencies that can drift apart.
 */
import { CURRENCIES, DEFAULT_CURRENCY, formatMoney, NO_VALUE } from "./ai-cost-calculator";

export { CURRENCIES, DEFAULT_CURRENCY, formatMoney, NO_VALUE };

/* ---------------------------------------------------------------------------
 * Inputs
 * ------------------------------------------------------------------------- */

/**
 * Every figure the calculator takes, already validated into finite,
 * non-negative numbers. Percentages are 0–100 here (not decimals): they are
 * what the visitor types, and the engine converts them where the arithmetic
 * needs a rate.
 */
export interface EmailSavingsInput {
  /** Emails received on an average working day. */
  emailsPerDay: number;
  /** Working days in a month, 1–31. */
  workingDaysPerMonth: number;
  /** Share of those emails suitable for AI assistance, 0–100. */
  eligiblePercent: number;
  /** Active minutes to write one reply by hand. */
  manualMinutes: number;
  /** Active minutes to read, verify and approve one AI draft. */
  reviewMinutes: number;
  /** Extra per-email prompting, setup or editing minutes. */
  handlingMinutes: number;
  /** Share of AI drafts needing further correction, 0–100. */
  correctionPercent: number;
  /** Extra minutes spent on a draft that does need correction. */
  correctionMinutes: number;
  /** What an hour of this working time is worth to the business. */
  hourlyRate: number;
  /** Recurring monthly cost of the AI email software. */
  monthlySoftwareCost: number;
  /** Usage-based cost per AI-eligible email, where the plan charges one. */
  usageCostPerEmail: number;
  /** One-time implementation, setup or training cost. */
  oneTimeSetupCost: number;
}

export type FieldKey = keyof EmailSavingsInput;

/**
 * Illustrative defaults, so the page opens on a complete worked example rather
 * than twelve empty boxes. These are placeholders chosen to be easy to reason
 * about and are labelled as assumptions everywhere they appear. None of them is
 * a researched average, an industry benchmark, or a figure from any study.
 */
export const DEFAULTS: EmailSavingsInput = {
  emailsPerDay: 40,
  workingDaysPerMonth: 20,
  eligiblePercent: 60,
  manualMinutes: 5,
  reviewMinutes: 2,
  handlingMinutes: 0.25,
  correctionPercent: 20,
  correctionMinutes: 3,
  hourlyRate: 25,
  monthlySoftwareCost: 30,
  usageCostPerEmail: 0,
  oneTimeSetupCost: 120,
};

/**
 * How a field is affixed and validated. `money` and `rate` take the selected
 * currency symbol as a prefix; the rest carry a plain unit suffix. `integer`
 * fields reject a fractional entry, because a count of days is not fractional.
 */
export interface FieldSpec {
  key: FieldKey;
  label: string;
  /** Helper text under the input. Always visible — never a hover-only tooltip. */
  hint: string;
  prefix?: "currency";
  suffix?: string;
  min: number;
  max: number;
  /** The input's `step`, which also sets whether decimals are offered. */
  step: string;
  integer?: boolean;
  /** Short unit for the copied summary, e.g. "min". */
  summaryUnit?: string;
}

/**
 * The caps exist so no combination of entries can overflow into a meaningless
 * or non-finite result: 10,000 emails a day at 600 minutes each is already far
 * past any real inbox, and the money caps match the cost calculator's.
 */
export const LIMITS = {
  maxEmailsPerDay: 10_000,
  maxWorkingDays: 31,
  /** Per-email minute fields. Ten hours on one email is the ceiling. */
  maxMinutes: 600,
  maxHourlyRate: 10_000,
  maxMoney: 1_000_000,
  /** Usage fee charged per eligible email. */
  maxUsageCost: 1_000,
} as const;

/** The three input groups, in the order the page renders them. */
export const SECTIONS: readonly {
  id: string;
  title: string;
  note: string;
  fields: readonly FieldSpec[];
}[] = [
  {
    id: "workload",
    title: "Your current email workload",
    note: "What replying to email costs you today, before any AI is involved.",
    fields: [
      {
        key: "emailsPerDay",
        label: "Emails needing a reply per working day",
        hint: "An average working day. Count messages you actually answer, not newsletters or notifications.",
        suffix: "emails",
        min: 0,
        max: LIMITS.maxEmailsPerDay,
        step: "1",
        summaryUnit: "emails/day",
      },
      {
        key: "workingDaysPerMonth",
        label: "Working days per month",
        hint: "Days you are at work and answering email. 20 is a typical five-day month.",
        suffix: "days",
        min: 1,
        max: LIMITS.maxWorkingDays,
        step: "1",
        integer: true,
        summaryUnit: "days/month",
      },
      {
        key: "eligiblePercent",
        label: "Share of emails suitable for AI assistance",
        hint: "Not every email should be drafted by AI. Exclude anything sensitive, negotiated, legal, or personal.",
        suffix: "%",
        min: 0,
        max: 100,
        step: "1",
        summaryUnit: "%",
      },
      {
        key: "manualMinutes",
        label: "Average time to write one reply by hand",
        hint: "Active minutes per eligible email: reading it, thinking, typing, checking, sending.",
        suffix: "min",
        min: 0,
        max: LIMITS.maxMinutes,
        step: "0.25",
        summaryUnit: "min",
      },
    ],
  },
  {
    id: "ai-workflow",
    title: "Your AI-assisted workflow",
    note: "AI does not remove the work entirely. This is the human time that remains per eligible email.",
    fields: [
      {
        key: "reviewMinutes",
        label: "Human review time per AI draft",
        hint: "Active minutes to read, fact-check and approve a draft. Set it honestly — this is where most of the remaining time goes.",
        suffix: "min",
        min: 0,
        max: LIMITS.maxMinutes,
        step: "0.25",
        summaryUnit: "min",
      },
      {
        key: "handlingMinutes",
        label: "Extra prompting or handling time per email",
        hint: "Per-email overhead: opening the tool, pasting context, picking a template, filing the result.",
        suffix: "min",
        min: 0,
        max: LIMITS.maxMinutes,
        step: "0.05",
        summaryUnit: "min",
      },
      {
        key: "correctionPercent",
        label: "Share of AI drafts needing further correction",
        hint: "Drafts that need real rewriting rather than a quick read. Only these incur the correction time below.",
        suffix: "%",
        min: 0,
        max: 100,
        step: "1",
        summaryUnit: "%",
      },
      {
        key: "correctionMinutes",
        label: "Extra correction time, when correction is needed",
        hint: "Applied to the share above, not to every email, so the per-email figure is an expected average.",
        suffix: "min",
        min: 0,
        max: LIMITS.maxMinutes,
        step: "0.25",
        summaryUnit: "min",
      },
    ],
  },
  {
    id: "costs",
    title: "Your costs and time value",
    note: "What the time is worth to you, and what the AI workflow costs to run.",
    fields: [
      {
        key: "hourlyRate",
        label: "Value of an hour of this working time",
        hint: "A loaded hourly cost, your own billable rate, or whatever an hour of this work is worth to the business.",
        prefix: "currency",
        suffix: "per hour",
        min: 0,
        max: LIMITS.maxHourlyRate,
        step: "0.5",
        summaryUnit: "per hour",
      },
      {
        key: "monthlySoftwareCost",
        label: "Monthly AI software cost",
        hint: "Every recurring subscription the workflow needs, including seats. Enter 0 if you pay nothing monthly.",
        prefix: "currency",
        suffix: "per month",
        min: 0,
        max: LIMITS.maxMoney,
        step: "1",
        summaryUnit: "per month",
      },
      {
        key: "usageCostPerEmail",
        label: "Extra AI usage cost per eligible email",
        hint: "For usage-based plans: API spend, credits or per-task fees. Leave at 0 on a flat subscription.",
        prefix: "currency",
        suffix: "per email",
        min: 0,
        max: LIMITS.maxUsageCost,
        step: "0.01",
        summaryUnit: "per email",
      },
      {
        key: "oneTimeSetupCost",
        label: "One-time implementation or setup cost",
        hint: "Charged once: configuration, templates, training, consultant time. It affects first-month and first-year figures only.",
        prefix: "currency",
        suffix: "one-time",
        min: 0,
        max: LIMITS.maxMoney,
        step: "1",
        summaryUnit: "one-time",
      },
    ],
  },
];

/** Every field spec, flattened, in page order. */
export const FIELDS: readonly FieldSpec[] = SECTIONS.flatMap((section) => section.fields);

const FIELD_BY_KEY = new Map<FieldKey, FieldSpec>(FIELDS.map((field) => [field.key, field]));

export function fieldSpec(key: FieldKey): FieldSpec {
  const spec = FIELD_BY_KEY.get(key);
  if (!spec) throw new Error(`Unknown calculator field: ${key}`);
  return spec;
}

/* ---------------------------------------------------------------------------
 * Results
 * ------------------------------------------------------------------------- */

/**
 * ROI, as a value or as an explicit "not applicable". A return on investment
 * divides by the investment, so with no modelled cost there is no ROI to
 * report — and an infinite percentage would be both wrong and absurd.
 */
export type Roi = { kind: "percent"; percent: number } | { kind: "no-cost" };

/**
 * Break-even volume. `emails` is the monthly eligible-email count that covers
 * the modelled cost; `unreachable` is the honest answer when each eligible
 * email contributes nothing or loses value, because then no volume helps.
 */
export type BreakEven = { kind: "emails"; emails: number } | { kind: "unreachable" };

export interface EmailSavingsResults {
  /** Every email received in a month, eligible or not. */
  monthlyEmails: number;
  /** The AI-eligible share of those. Fractional internally, rounded on display. */
  eligibleEmails: number;

  /** Monthly active minutes/hours replying to eligible emails by hand. */
  manualMinutes: number;
  manualHours: number;

  /** Expected active human minutes per eligible email in the AI workflow. */
  aiMinutesPerEmail: number;
  /** Monthly active minutes/hours for the same eligible emails with AI. */
  aiMinutes: number;
  aiHours: number;

  /** Manual minus AI-assisted. Negative when the AI workflow costs more time. */
  minutesSaved: number;
  hoursSaved: number;

  /** hoursSaved x hourlyRate. An estimated value of time, not realised cash. */
  grossMonthlyTimeValue: number;
  /** Software plus per-email usage fees. Recurring, every month. */
  monthlyOperatingCost: number;
  /** Ongoing monthly estimate, excluding the one-time setup cost. */
  monthlyNetBenefit: number;
  /** Month one, which carries the one-time setup cost. */
  firstMonthNetBenefit: number;
  /** Twelve months of the same assumptions, plus the one-time setup cost. */
  firstYearNetBenefit: number;

  recurringRoi: Roi;
  firstMonthRoi: Roi;
  firstYearRoi: Roi;

  /** Value of the time saved on one eligible email. */
  perEmailGrossValue: number;
  /** The same, after that email's own usage fee. */
  perEmailNetContribution: number;

  /** Eligible emails a month needed to cover the recurring software cost. */
  breakEven: BreakEven;
  /** The same, with the one-time setup cost added. */
  firstMonthBreakEven: BreakEven;
}

const MINUTES_PER_HOUR = 60;
const MONTHS_PER_YEAR = 12;

/** A usable number, or 0. Keeps NaN and Infinity out of every figure. */
function finite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/** Quantities that cannot be negative, whatever reached the engine. */
function atLeastZero(value: number): number {
  return Math.max(0, finite(value));
}

/** A 0–100 entry as a 0–1 rate, clamped. */
function rate(percent: number): number {
  return Math.min(100, atLeastZero(percent)) / 100;
}

/**
 * ROI on a modelled cost: ((benefit - cost) / cost) x 100, with the zero-cost
 * case returned as such rather than divided.
 */
function roi(benefit: number, cost: number): Roi {
  if (cost <= 0) return { kind: "no-cost" };
  const percent = ((benefit - cost) / cost) * 100;
  return Number.isFinite(percent) ? { kind: "percent", percent } : { kind: "no-cost" };
}

/**
 * Eligible emails a month needed to cover `cost`, rounded up to a whole email.
 * A non-positive contribution is reported as unreachable: more volume then
 * makes the result worse, not better, so there is no volume that breaks even.
 */
function breakEvenVolume(cost: number, contributionPerEmail: number): BreakEven {
  if (contributionPerEmail <= 0) return { kind: "unreachable" };
  const emails = Math.ceil(atLeastZero(cost) / contributionPerEmail);
  return Number.isFinite(emails) ? { kind: "emails", emails } : { kind: "unreachable" };
}

/**
 * Every figure the calculator reports. The formulas are the ones published in
 * the page's methodology section, in the same order, and each one is arithmetic
 * on the visitor's own entries.
 */
export function computeEmailSavings(input: EmailSavingsInput): EmailSavingsResults {
  const emailsPerDay = atLeastZero(input.emailsPerDay);
  const workingDays = atLeastZero(input.workingDaysPerMonth);
  const manualPerEmail = atLeastZero(input.manualMinutes);
  const hourlyRate = atLeastZero(input.hourlyRate);
  const usageCostPerEmail = atLeastZero(input.usageCostPerEmail);
  const softwareCost = atLeastZero(input.monthlySoftwareCost);
  const setupCost = atLeastZero(input.oneTimeSetupCost);

  // 5.1 Email volume.
  const monthlyEmails = emailsPerDay * workingDays;
  const eligibleEmails = monthlyEmails * rate(input.eligiblePercent);

  // 5.2 Manual active time. Only eligible emails count: the rest are unchanged
  // by AI, so including them would invent a saving on work nobody automated.
  const manualMinutes = eligibleEmails * manualPerEmail;

  // 5.3 AI-assisted active time. Correction time is weighted by the share of
  // drafts that need it, so the per-email figure is an expected average. Model
  // generation time is deliberately absent: it is not active human time.
  const aiMinutesPerEmail =
    atLeastZero(input.reviewMinutes) +
    atLeastZero(input.handlingMinutes) +
    rate(input.correctionPercent) * atLeastZero(input.correctionMinutes);
  const aiMinutes = eligibleEmails * aiMinutesPerEmail;

  // 5.4 Time saved. Negative is a real answer and is shown as one.
  const minutesSaved = manualMinutes - aiMinutes;
  const hoursSaved = minutesSaved / MINUTES_PER_HOUR;

  // 5.5–5.9 Money. Every figure below is an estimate from the entries above.
  const grossMonthlyTimeValue = hoursSaved * hourlyRate;
  const monthlyOperatingCost = softwareCost + eligibleEmails * usageCostPerEmail;
  const monthlyNetBenefit = grossMonthlyTimeValue - monthlyOperatingCost;
  const firstMonthNetBenefit = monthlyNetBenefit - setupCost;
  const firstYearNetBenefit =
    grossMonthlyTimeValue * MONTHS_PER_YEAR - monthlyOperatingCost * MONTHS_PER_YEAR - setupCost;

  // 5.11 Break-even, per eligible email.
  const perEmailGrossValue = ((manualPerEmail - aiMinutesPerEmail) / MINUTES_PER_HOUR) * hourlyRate;
  const perEmailNetContribution = perEmailGrossValue - usageCostPerEmail;

  return {
    monthlyEmails,
    eligibleEmails,
    manualMinutes,
    manualHours: manualMinutes / MINUTES_PER_HOUR,
    aiMinutesPerEmail,
    aiMinutes,
    aiHours: aiMinutes / MINUTES_PER_HOUR,
    minutesSaved,
    hoursSaved,
    grossMonthlyTimeValue,
    monthlyOperatingCost,
    monthlyNetBenefit,
    firstMonthNetBenefit,
    firstYearNetBenefit,
    // 5.10 ROI, kept separate for the recurring, first-month and first-year views.
    recurringRoi: roi(grossMonthlyTimeValue, monthlyOperatingCost),
    firstMonthRoi: roi(grossMonthlyTimeValue, monthlyOperatingCost + setupCost),
    firstYearRoi: roi(
      grossMonthlyTimeValue * MONTHS_PER_YEAR,
      monthlyOperatingCost * MONTHS_PER_YEAR + setupCost,
    ),
    perEmailGrossValue,
    perEmailNetContribution,
    breakEven: breakEvenVolume(softwareCost, perEmailNetContribution),
    firstMonthBreakEven: breakEvenVolume(softwareCost + setupCost, perEmailNetContribution),
  };
}

/* ---------------------------------------------------------------------------
 * Validation
 * ------------------------------------------------------------------------- */

export type FieldValue = { ok: true; value: number | null } | { ok: false; message: string };

const integers = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const upToTwo = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

/** A bound as it should read in an error message: "0.25", "100", "1,000,000". */
const bound = (value: number) => (Number.isInteger(value) ? integers : upToTwo).format(value);

/**
 * Validates one raw entry against its field spec.
 *
 * An empty field is not an error: the visitor may be mid-edit, and shouting at
 * a cleared box would be useless. Empty means "not provided" — `null`, which
 * the caller treats as 0. Everything genuinely wrong (text, a negative number,
 * a fractional day count, an absurd value) returns a message shown next to the
 * field, and that field counts as 0 until it is fixed.
 */
export function parseFieldValue(raw: string, spec: FieldSpec): FieldValue {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: true, value: null };

  const value = Number(trimmed);
  if (!Number.isFinite(value)) return { ok: false, message: "Enter a number." };
  if (spec.integer && !Number.isInteger(value)) {
    return {
      ok: false,
      message: `Enter a whole number from ${bound(spec.min)} to ${bound(spec.max)}.`,
    };
  }
  if (value < spec.min) {
    return {
      ok: false,
      message: spec.min === 0 ? "Enter 0 or more." : `Enter ${bound(spec.min)} or more.`,
    };
  }
  if (value > spec.max) return { ok: false, message: `Enter ${bound(spec.max)} or less.` };

  return { ok: true, value };
}

/**
 * The twelve raw strings as an input object, plus the keys that were rejected.
 * A rejected or empty field becomes 0 — except the working-day count, which
 * falls back to its default, because a blank there would silently zero every
 * figure on the page while the visitor was still typing.
 */
export function parseInput(raw: Readonly<Record<FieldKey, string>>): {
  input: EmailSavingsInput;
  invalidKeys: FieldKey[];
} {
  const input = { ...DEFAULTS };
  const invalidKeys: FieldKey[] = [];

  for (const spec of FIELDS) {
    const parsed = parseFieldValue(raw[spec.key] ?? "", spec);
    if (!parsed.ok) {
      invalidKeys.push(spec.key);
      input[spec.key] = 0;
      continue;
    }
    input[spec.key] = parsed.value ?? (spec.key === "workingDaysPerMonth" ? DEFAULTS[spec.key] : 0);
  }

  return { input, invalidKeys };
}

/* ---------------------------------------------------------------------------
 * Display formatting
 *
 * Rounding happens here, for display only. The figures above stay exact.
 * ------------------------------------------------------------------------- */

const group = (min: number, max: number) =>
  new Intl.NumberFormat("en-US", { minimumFractionDigits: min, maximumFractionDigits: max });

const WHOLE = group(0, 0);
const ONE_DP = group(1, 1);
const UP_TO_ONE = group(0, 1);
const UP_TO_TWO = group(0, 2);

/** A whole count, e.g. an email volume. Rounded for display. */
export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return NO_VALUE;
  return WHOLE.format(Math.round(value));
}

/** Hours to one decimal place, e.g. "17.2" or "-1.5". */
export function formatHours(value: number): string {
  if (!Number.isFinite(value)) return NO_VALUE;
  const rounded = Math.round(value * 10) / 10;
  return ONE_DP.format(Object.is(rounded, -0) ? 0 : rounded);
}

/** Minutes with at most two decimals, for the per-email figure (e.g. "2.85"). */
export function formatMinutes(value: number): string {
  if (!Number.isFinite(value)) return NO_VALUE;
  return UP_TO_TWO.format(Math.round(value * 100) / 100);
}

/**
 * Money that may be negative, with the sign outside the currency symbol:
 * "-$30", not "$-30".
 *
 * formatMoney() on its own is correct for the cost calculator, where no figure
 * can be negative, and wrong here — this tool reports losses as readily as
 * gains, and a misplaced minus sign in a money figure is exactly the kind of
 * detail a visitor reads straight past. Rounding happens before the sign test,
 * so a value a hundredth below zero prints as "$0" rather than "-$0".
 */
export function formatSignedMoney(value: number, symbol: string): string {
  if (!Number.isFinite(value)) return NO_VALUE;
  const cents = Math.round(value * 100) / 100;
  return cents < 0 ? `-${formatMoney(-cents, symbol)}` : formatMoney(cents, symbol);
}

/** "N/A — no modelled costs" wherever there is no investment to divide by. */
export const NO_ROI = "N/A — no modelled costs";

/**
 * ROI as a percentage, to one decimal place where it has one. Large values are
 * real arithmetic on small costs, which is exactly why the page never shows a
 * percentage without the money figure and the caveat beside it.
 */
export function formatRoi(value: Roi): string {
  if (value.kind === "no-cost") return NO_ROI;
  const rounded = Math.round(value.percent * 10) / 10;
  const safe = Object.is(rounded, -0) ? 0 : rounded;
  return `${safe > 0 ? "+" : ""}${UP_TO_ONE.format(safe)}%`;
}

/** Break-even as a whole email count, or the reason there isn't one. */
export function formatBreakEven(value: BreakEven): string {
  if (value.kind === "unreachable") return "Not reachable by volume";
  return `${WHOLE.format(value.emails)} ${value.emails === 1 ? "email" : "emails"}`;
}

/** How a result should be coloured. Never a positive treatment for a loss. */
export type Tone = "positive" | "negative" | "neutral";

/** Tone for a money or time figure: positive above zero, caution below it. */
export function toneOf(value: number): Tone {
  if (!Number.isFinite(value) || Math.abs(value) < 1e-9) return "neutral";
  return value > 0 ? "positive" : "negative";
}

/** Tone for an ROI: neutral when there is no cost to return on. */
export function roiTone(value: Roi): Tone {
  return value.kind === "no-cost" ? "neutral" : toneOf(value.percent);
}
