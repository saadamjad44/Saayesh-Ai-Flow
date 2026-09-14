/**
 * Editorial rules shared by the content schemas and content components.
 * Testing statuses and score categories follow AGENTS.md and the review
 * template in revised-blueprint-phase1.jsx.
 */

/**
 * Phase 1 content is research-based. `hands-on` is only allowed when the owner
 * has testing evidence, and the schema then requires a testing summary.
 */
export const TESTING_STATUSES = ["research-based", "hands-on"] as const;
export type TestingStatus = (typeof TESTING_STATUSES)[number];

export const TESTING_STATUS_LABELS: Record<TestingStatus, string> = {
  "research-based": "Research-based",
  "hands-on": "Hands-on tested",
};

/** The five review-template score categories, identical for every tool. */
export const SCORE_CATEGORIES = [
  { id: "easeOfUse", label: "Ease of Use" },
  { id: "outputQuality", label: "Output Quality" },
  { id: "featureSet", label: "Feature Set" },
  { id: "pricingValue", label: "Pricing Value" },
  { id: "supportDocs", label: "Support & Documentation" },
] as const;

export type ScoreCategoryId = (typeof SCORE_CATEGORIES)[number]["id"];

export const SCORE_RANGE = { min: 1, max: 10 } as const;
