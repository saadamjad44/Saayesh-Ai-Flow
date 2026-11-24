/**
 * Data for the homepage "Overpay Checker" / "Roast My AI Stack" widget.
 *
 * A curated list of popular AI tools with their typical paid-plan price and
 * the cheapest way to get similar value. Every price comes from the site's
 * own pricing dataset; every guide link is a published page.
 */

export interface CheckerTool {
  id: string;
  name: string;
  monthlyPrice: number;
  plan: string;
  annualPrice: number | null;
  freeAlt: string | null;
  guide: string;
}

export const CHECKER_TOOLS: readonly CheckerTool[] = [
  {
    id: "chatgpt",
    name: "ChatGPT Plus",
    monthlyPrice: 20,
    plan: "Plus",
    annualPrice: 17,
    freeAlt: "ChatGPT Free",
    guide: "/ai-business-tools/chatgpt-business-vs-plus/",
  },
  {
    id: "claude",
    name: "Claude Pro",
    monthlyPrice: 20,
    plan: "Pro",
    annualPrice: 17,
    freeAlt: "Claude Free",
    guide: "/ai-business-tools/claude-for-small-business/",
  },
  {
    id: "jasper",
    name: "Jasper",
    monthlyPrice: 39,
    plan: "Creator",
    annualPrice: null,
    freeAlt: null,
    guide: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
  },
  {
    id: "canva",
    name: "Canva Pro",
    monthlyPrice: 13,
    plan: "Pro",
    annualPrice: 10,
    freeAlt: "Canva Free",
    guide: "/ai-business-tools/best-ai-tools-for-small-business/",
  },
  {
    id: "zapier",
    name: "Zapier",
    monthlyPrice: 20,
    plan: "Starter",
    annualPrice: null,
    freeAlt: "Zapier Free (100 tasks)",
    guide: "/ai-automation/zapier-ai-automation-examples/",
  },
  {
    id: "notion",
    name: "Notion AI",
    monthlyPrice: 10,
    plan: "Plus + AI",
    annualPrice: 8,
    freeAlt: null,
    guide: "/ai-business-tools/best-ai-tools-for-small-business/",
  },
  {
    id: "tidio",
    name: "Tidio",
    monthlyPrice: 29,
    plan: "Starter",
    annualPrice: null,
    freeAlt: "Tidio Free",
    guide: "/ai-business-tools/ai-chatbot-for-small-business/",
  },
  {
    id: "make",
    name: "Make",
    monthlyPrice: 9,
    plan: "Core",
    annualPrice: null,
    freeAlt: "Make Free (1,000 ops)",
    guide: "/ai-automation/best-ai-workflows-for-solopreneurs/",
  },
];

export interface OverpayResult {
  monthlyTotal: number;
  annualSavings: number;
  freeAlternatives: number;
  roastLevel: "chill" | "warm" | "spicy" | "fire";
  roastMessage: string;
}

export function analyseStack(selectedIds: string[]): OverpayResult {
  const selected = CHECKER_TOOLS.filter((t) => selectedIds.includes(t.id));
  let monthlyTotal = 0;
  let annualSavings = 0;
  let freeAlternatives = 0;

  for (const tool of selected) {
    monthlyTotal += tool.monthlyPrice;
    if (tool.annualPrice !== null) {
      annualSavings += tool.monthlyPrice - tool.annualPrice;
    }
    if (tool.freeAlt !== null) {
      freeAlternatives++;
    }
  }

  let roastLevel: OverpayResult["roastLevel"];
  let roastMessage: string;

  if (monthlyTotal === 0) {
    roastLevel = "chill";
    roastMessage = "Pick the tools you pay for.";
  } else if (monthlyTotal <= 25) {
    roastLevel = "chill";
    roastMessage = "Lean stack. You're spending wisely.";
  } else if (monthlyTotal <= 60) {
    roastLevel = "warm";
    roastMessage = "Moderate spend — a few quick switches could save you plenty.";
  } else if (monthlyTotal <= 100) {
    roastLevel = "spicy";
    roastMessage = "That's a chunky bill. Let's see where you're leaving money on the table.";
  } else {
    roastLevel = "fire";
    roastMessage = "You're paying more than most small businesses need to. Time for an audit.";
  }

  return { monthlyTotal, annualSavings, freeAlternatives, roastLevel, roastMessage };
}
