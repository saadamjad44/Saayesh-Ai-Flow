/**
 * Accuracy and edge-case checks for the AI Email Time Savings & ROI Calculator.
 *
 * Run by astro.config.ts on every `astro dev`, `astro build` and `astro check`,
 * alongside assertValidPageRegistry() and assertValidSeoSnippets(), so a change
 * that breaks the arithmetic fails the build instead of shipping a calculator
 * that quietly returns the wrong number. That is deliberately how this project
 * already asserts its invariants: it needs no test runner, no new dependency,
 * and no second way to run the checks.
 *
 * It is imported only by astro.config.ts, so none of it reaches the browser.
 *
 * The first case is the worked example published on the page itself, so the
 * figures in the editorial copy and the figures the engine produces cannot
 * drift apart. The rest are the edge cases a money calculator has to survive:
 * zeroes, negatives, an AI workflow that is slower than typing by hand, a
 * break-even that cannot be reached, absurd-but-valid entries, decimals, and
 * text where a number should be.
 */
import {
  DEFAULTS,
  FIELDS,
  LIMITS,
  computeEmailSavings,
  fieldSpec,
  formatBreakEven,
  formatHours,
  formatRoi,
  formatSignedMoney,
  parseFieldValue,
  parseInput,
  toneOf,
  type EmailSavingsInput,
  type FieldKey,
} from "./ai-email-savings-calculator";

const problems: string[] = [];

function fail(label: string, detail: string): void {
  problems.push(`${label}: ${detail}`);
}

/** Floating-point arithmetic, so compared to a tolerance rather than exactly. */
function near(label: string, actual: number, expected: number, tolerance = 1e-9): void {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    fail(label, `expected ${expected}, got ${actual}`);
  }
}

function equal<T>(label: string, actual: T, expected: T): void {
  if (actual !== expected) {
    fail(label, `expected ${String(expected)}, got ${String(actual)}`);
  }
}

function isFiniteNumber(label: string, value: number): void {
  if (!Number.isFinite(value)) fail(label, `expected a finite number, got ${value}`);
}

/** Every numeric figure in a result set must be usable, in every scenario. */
function allFiguresFinite(label: string, input: EmailSavingsInput): void {
  const results = computeEmailSavings(input);
  for (const [key, value] of Object.entries(results)) {
    if (typeof value === "number") isFiniteNumber(`${label} ${key}`, value);
  }
}

const scenario = (overrides: Partial<EmailSavingsInput>): EmailSavingsInput => ({
  ...DEFAULTS,
  ...overrides,
});

/* ---------------------------------------------------------------------------
 * 1. The worked example published on the page
 * ------------------------------------------------------------------------- */
function checkWorkedExample(): void {
  const r = computeEmailSavings(DEFAULTS);

  near("worked example monthlyEmails", r.monthlyEmails, 800);
  near("worked example eligibleEmails", r.eligibleEmails, 480);
  near("worked example manualHours", r.manualHours, 40);
  near("worked example aiMinutesPerEmail", r.aiMinutesPerEmail, 2.85);
  near("worked example aiHours", r.aiHours, 22.8, 1e-9);
  near("worked example hoursSaved", r.hoursSaved, 17.2, 1e-9);
  near("worked example grossMonthlyTimeValue", r.grossMonthlyTimeValue, 430, 1e-8);
  near("worked example monthlyOperatingCost", r.monthlyOperatingCost, 30);
  near("worked example monthlyNetBenefit", r.monthlyNetBenefit, 400, 1e-8);
  near("worked example firstMonthNetBenefit", r.firstMonthNetBenefit, 280, 1e-8);
  near("worked example firstYearNetBenefit", r.firstYearNetBenefit, 4680, 1e-7);

  if (r.recurringRoi.kind !== "percent") {
    fail("worked example recurringRoi", `expected a percentage, got ${r.recurringRoi.kind}`);
  } else {
    near("worked example recurringRoi", r.recurringRoi.percent, 1333.3333333333333, 1e-6);
  }

  equal("worked example breakEven kind", r.breakEven.kind, "emails");
  if (r.breakEven.kind === "emails") {
    equal("worked example breakEven emails", r.breakEven.emails, 34);
  }
  // 30 + 120 of setup, at the same per-email contribution.
  if (r.firstMonthBreakEven.kind === "emails") {
    equal("worked example firstMonthBreakEven", r.firstMonthBreakEven.emails, 168);
  } else {
    fail("worked example firstMonthBreakEven", "expected a reachable email volume");
  }

  // The figures as the page prints them, so the copy and the engine agree.
  equal("worked example hours display", formatHours(r.hoursSaved), "17.2");
  equal("worked example value display", formatSignedMoney(r.grossMonthlyTimeValue, "$"), "$430");
  equal("worked example net display", formatSignedMoney(r.monthlyNetBenefit, "$"), "$400");
  equal(
    "worked example first-year display",
    formatSignedMoney(r.firstYearNetBenefit, "$"),
    "$4,680",
  );
  equal("worked example roi display", formatRoi(r.recurringRoi), "+1,333.3%");
  equal("worked example break-even display", formatBreakEven(r.breakEven), "34 emails");
}

/* ---------------------------------------------------------------------------
 * 2. Zeroes
 * ------------------------------------------------------------------------- */
function checkZeroes(): void {
  // No emails at all: no time, no value, and the recurring cost still stands.
  const noEmails = computeEmailSavings(scenario({ emailsPerDay: 0 }));
  near("zero emails monthlyEmails", noEmails.monthlyEmails, 0);
  near("zero emails hoursSaved", noEmails.hoursSaved, 0);
  near("zero emails grossMonthlyTimeValue", noEmails.grossMonthlyTimeValue, 0);
  near("zero emails monthlyOperatingCost", noEmails.monthlyOperatingCost, 30);
  near("zero emails monthlyNetBenefit", noEmails.monthlyNetBenefit, -30);
  equal("zero emails tone", toneOf(noEmails.monthlyNetBenefit), "negative");
  // The minus sign belongs outside the currency symbol: "-$30", never "$-30".
  equal("zero emails net display", formatSignedMoney(noEmails.monthlyNetBenefit, "$"), "-$30");
  equal("negative cents round to zero", formatSignedMoney(-0.004, "$"), "$0");
  equal("negative with cents", formatSignedMoney(-1234.5, "$"), "-$1,234.50");
  allFiguresFinite("zero emails", scenario({ emailsPerDay: 0 }));

  // Nothing eligible: no saving, and no usage fees either.
  const noEligible = computeEmailSavings(scenario({ eligiblePercent: 0 }));
  near("zero eligibility eligibleEmails", noEligible.eligibleEmails, 0);
  near("zero eligibility hoursSaved", noEligible.hoursSaved, 0);
  near("zero eligibility monthlyNetBenefit", noEligible.monthlyNetBenefit, -30);
  // Per-email contribution is unaffected by volume, so break-even still exists.
  equal("zero eligibility breakEven kind", noEligible.breakEven.kind, "emails");

  // No hourly value: time is still saved, but it is worth nothing in money.
  const noRate = computeEmailSavings(scenario({ hourlyRate: 0 }));
  near("zero rate hoursSaved", noRate.hoursSaved, 17.2, 1e-9);
  near("zero rate grossMonthlyTimeValue", noRate.grossMonthlyTimeValue, 0);
  near("zero rate monthlyNetBenefit", noRate.monthlyNetBenefit, -30);
  equal("zero rate breakEven kind", noRate.breakEven.kind, "unreachable");
  equal(
    "zero rate breakEven display",
    formatBreakEven(noRate.breakEven),
    "Not reachable by volume",
  );

  // No modelled cost at all: a benefit, but no ROI to report.
  const noCost = computeEmailSavings(
    scenario({ monthlySoftwareCost: 0, usageCostPerEmail: 0, oneTimeSetupCost: 0 }),
  );
  near("zero cost monthlyOperatingCost", noCost.monthlyOperatingCost, 0);
  near("zero cost monthlyNetBenefit", noCost.monthlyNetBenefit, 430, 1e-8);
  equal("zero cost recurringRoi kind", noCost.recurringRoi.kind, "no-cost");
  equal("zero cost firstYearRoi kind", noCost.firstYearRoi.kind, "no-cost");
  equal("zero cost roi display", formatRoi(noCost.recurringRoi), "N/A — no modelled costs");
  // Nothing recurring to recover, so the first eligible email is already ahead.
  if (noCost.breakEven.kind === "emails") {
    equal("zero cost breakEven emails", noCost.breakEven.emails, 0);
  } else {
    fail("zero cost breakEven", "expected 0 emails, got an unreachable break-even");
  }

  // Every figure zero, including the time entries: no division blows up.
  allFiguresFinite(
    "all zero",
    scenario({
      emailsPerDay: 0,
      workingDaysPerMonth: 1,
      eligiblePercent: 0,
      manualMinutes: 0,
      reviewMinutes: 0,
      handlingMinutes: 0,
      correctionPercent: 0,
      correctionMinutes: 0,
      hourlyRate: 0,
      monthlySoftwareCost: 0,
      usageCostPerEmail: 0,
      oneTimeSetupCost: 0,
    }),
  );
}

/* ---------------------------------------------------------------------------
 * 3. Negative entries
 * ------------------------------------------------------------------------- */
function checkNegatives(): void {
  // Validation rejects them at the input, so a message is shown next to the field.
  for (const spec of FIELDS) {
    const parsed = parseFieldValue("-5", spec);
    if (parsed.ok) fail(`negative ${spec.key}`, "a negative entry was accepted");
  }

  // And the engine clamps anything that reaches it anyway, rather than
  // producing a negative email count or a negative cost.
  const clamped = computeEmailSavings(
    scenario({ emailsPerDay: -40, manualMinutes: -5, monthlySoftwareCost: -30, hourlyRate: -25 }),
  );
  near("negative inputs monthlyEmails", clamped.monthlyEmails, 0);
  near("negative inputs operating cost", clamped.monthlyOperatingCost, 0);
  allFiguresFinite(
    "negative inputs",
    scenario({ emailsPerDay: -40, manualMinutes: -5, monthlySoftwareCost: -30, hourlyRate: -25 }),
  );

  // Out-of-range percentages are clamped to 0-100, not wrapped or extrapolated.
  const over = computeEmailSavings(scenario({ eligiblePercent: 400 }));
  near("over-100 eligibility", over.eligibleEmails, 800);
}

/* ---------------------------------------------------------------------------
 * 4. AI slower than replying by hand
 * ------------------------------------------------------------------------- */
function checkAiSlower(): void {
  // 2 + 0.25 + 0.2 x 3 = 2.85 minutes of AI time against 2 minutes by hand.
  const r = computeEmailSavings(scenario({ manualMinutes: 2 }));

  near("ai slower aiMinutesPerEmail", r.aiMinutesPerEmail, 2.85);
  near("ai slower minutesSaved", r.minutesSaved, 480 * (2 - 2.85), 1e-9);
  if (r.hoursSaved >= 0) fail("ai slower hoursSaved", `expected a loss, got ${r.hoursSaved}`);
  if (r.grossMonthlyTimeValue >= 0) {
    fail("ai slower grossMonthlyTimeValue", `expected a loss, got ${r.grossMonthlyTimeValue}`);
  }
  equal("ai slower tone", toneOf(r.monthlyNetBenefit), "negative");

  // A negative contribution per email cannot be recovered by sending more email.
  equal("ai slower breakEven kind", r.breakEven.kind, "unreachable");
  equal("ai slower firstMonthBreakEven kind", r.firstMonthBreakEven.kind, "unreachable");

  // ROI exists and is negative; it must never read as a gain.
  if (r.recurringRoi.kind !== "percent" || r.recurringRoi.percent >= 0) {
    fail("ai slower recurringRoi", "expected a negative percentage");
  }
}

/* ---------------------------------------------------------------------------
 * 5. Zero break-even contribution
 * ------------------------------------------------------------------------- */
function checkZeroContribution(): void {
  const base = computeEmailSavings(DEFAULTS);

  // AI time exactly equals manual time: every email contributes nothing. The
  // manual figure is taken from the engine, so the two sides cancel exactly
  // rather than to within a float's rounding.
  const identical = computeEmailSavings(scenario({ manualMinutes: base.aiMinutesPerEmail }));
  near("zero contribution perEmailGrossValue", identical.perEmailGrossValue, 0);
  near("zero contribution hoursSaved", identical.hoursSaved, 0);
  equal("zero contribution breakEven kind", identical.breakEven.kind, "unreachable");
  equal("zero contribution tone", toneOf(identical.hoursSaved), "neutral");

  // A usage fee that exactly cancels the value of the time saved.
  const cancelled = computeEmailSavings(scenario({ usageCostPerEmail: base.perEmailGrossValue }));
  near("cancelled contribution", cancelled.perEmailNetContribution, 0);
  equal("cancelled contribution breakEven kind", cancelled.breakEven.kind, "unreachable");

  // A usage fee larger than the value of the time saved.
  const negative = computeEmailSavings(scenario({ usageCostPerEmail: 5 }));
  if (negative.perEmailNetContribution >= 0) {
    fail("negative contribution", "expected a negative per-email contribution");
  }
  equal("negative contribution breakEven kind", negative.breakEven.kind, "unreachable");
}

/* ---------------------------------------------------------------------------
 * 6. Extreme but valid entries, and decimals
 * ------------------------------------------------------------------------- */
function checkExtremes(): void {
  const maxed = scenario({
    emailsPerDay: LIMITS.maxEmailsPerDay,
    workingDaysPerMonth: LIMITS.maxWorkingDays,
    eligiblePercent: 100,
    manualMinutes: LIMITS.maxMinutes,
    reviewMinutes: LIMITS.maxMinutes,
    handlingMinutes: LIMITS.maxMinutes,
    correctionPercent: 100,
    correctionMinutes: LIMITS.maxMinutes,
    hourlyRate: LIMITS.maxHourlyRate,
    monthlySoftwareCost: LIMITS.maxMoney,
    usageCostPerEmail: LIMITS.maxUsageCost,
    oneTimeSetupCost: LIMITS.maxMoney,
  });
  allFiguresFinite("maximum entries", maxed);

  // Every bound is accepted by validation, and a hair past it is not.
  for (const spec of FIELDS) {
    const atMax = parseFieldValue(String(spec.max), spec);
    if (!atMax.ok) fail(`max bound ${spec.key}`, `the maximum ${spec.max} was rejected`);
    const pastMax = parseFieldValue(String(spec.max + 1), spec);
    if (pastMax.ok) fail(`max bound ${spec.key}`, `${spec.max + 1} was accepted`);

    const atMin = parseFieldValue(String(spec.min), spec);
    if (!atMin.ok) fail(`min bound ${spec.key}`, `the minimum ${spec.min} was rejected`);
  }

  // Decimal entries are accepted wherever fractions make sense, and the
  // fractional email volume is kept internally rather than rounded first.
  const decimals = computeEmailSavings(
    scenario({ emailsPerDay: 37.5, eligiblePercent: 62.5, manualMinutes: 4.75 }),
  );
  near("decimal monthlyEmails", decimals.monthlyEmails, 750);
  near("decimal eligibleEmails", decimals.eligibleEmails, 468.75);
  near("decimal manualMinutes", decimals.manualMinutes, 468.75 * 4.75, 1e-9);
  allFiguresFinite(
    "decimal entries",
    scenario({ emailsPerDay: 37.5, eligiblePercent: 62.5, manualMinutes: 4.75 }),
  );

  // A fractional day count is the one thing rejected as fractional.
  const fractionalDays = parseFieldValue("20.5", fieldSpec("workingDaysPerMonth"));
  if (fractionalDays.ok) fail("fractional working days", "a fractional day count was accepted");
}

/* ---------------------------------------------------------------------------
 * 7. Raw-string parsing: text, blanks, and the reset state
 * ------------------------------------------------------------------------- */
function checkParsing(): void {
  const raw = (value: string) =>
    Object.fromEntries(FIELDS.map((field) => [field.key, value])) as Record<FieldKey, string>;

  // Text in every box: each one is reported, and nothing becomes NaN.
  const text = parseInput(raw("forty"));
  equal("invalid strings count", text.invalidKeys.length, FIELDS.length);
  for (const [key, value] of Object.entries(text.input)) {
    isFiniteNumber(`invalid string ${key}`, value);
  }
  allFiguresFinite("invalid strings", text.input);

  // Everything blank: no errors, and the working-day count keeps its default
  // so a cleared box does not silently zero the whole page.
  const blank = parseInput(raw(""));
  equal("blank entries invalid count", blank.invalidKeys.length, 0);
  near("blank entries emailsPerDay", blank.input.emailsPerDay, 0);
  near("blank entries workingDays", blank.input.workingDaysPerMonth, DEFAULTS.workingDaysPerMonth);
  allFiguresFinite("blank entries", blank.input);

  // Reset writes the defaults back, and they round-trip through validation to
  // the same figures the page opens with.
  const defaults = parseInput(
    Object.fromEntries(FIELDS.map((field) => [field.key, String(DEFAULTS[field.key])])) as Record<
      FieldKey,
      string
    >,
  );
  equal("reset invalid count", defaults.invalidKeys.length, 0);
  for (const field of FIELDS) {
    near(`reset ${field.key}`, defaults.input[field.key], DEFAULTS[field.key]);
  }

  // Padded entries, and the strings a number input can still hand over.
  const spec = fieldSpec("manualMinutes");
  const padded = parseFieldValue("  4.5  ", spec);
  if (!padded.ok || padded.value !== 4.5) fail("padded entry", "expected 4.5");
  for (const bad of ["abc", "1e", "--3", "4,5", "Infinity", "NaN", "$5"]) {
    if (parseFieldValue(bad, spec).ok) fail("rejected entry", `"${bad}" was accepted`);
  }
}

/**
 * Runs every check and throws on the first failing build. Called from
 * astro.config.ts, so `npm run build`, `npm run dev` and `npm run check` all
 * exercise the calculator's arithmetic before anything is rendered.
 */
export function assertEmailSavingsCalculator(): void {
  problems.length = 0;

  checkWorkedExample();
  checkZeroes();
  checkNegatives();
  checkAiSlower();
  checkZeroContribution();
  checkExtremes();
  checkParsing();

  if (problems.length > 0) {
    throw new Error(`AI email savings calculator checks failed:\n- ${problems.join("\n- ")}`);
  }
}
