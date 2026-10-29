/**
 * Presentation copy for the content pillars, in one place.
 *
 * The header mega menu, the homepage category grid, the "Start here" pathways,
 * and the blog archive all describe the same categories. Before this file
 * each of them carried its own copy of that wording; now they read from one
 * complete Record over PillarId, so adding a pillar to the registry fails the
 * build until it has an entry here and no surface can fall behind another.
 *
 * `summary` is the card-length description, `menu` the one-line version for a
 * dropdown row. Both restate what the pillar page itself says — nothing here is
 * a new claim about coverage.
 *
 * `icon` names the glyph PillarIcon.astro draws. The ids are generic shapes
 * (compass, nib, briefcase…), not brand marks.
 */
import type { PillarId } from "./pages";

export type PillarIconId =
  "compass" | "nib" | "briefcase" | "workflow" | "prompt" | "industry" | "agent" | "news";

export interface PillarPresentation {
  /** Card-length description, for the homepage grid and archive headers. */
  summary: string;
  /** One line, for the header mega menu. */
  menu: string;
  icon: PillarIconId;
}

export const PILLAR_PRESENTATION: Readonly<Record<PillarId, PillarPresentation>> = {
  "getting-started": {
    summary:
      "New to AI? Start here for what these tools actually do, where to begin, and the mistakes that waste the most time.",
    menu: "How to choose and set up your first AI tool",
    icon: "compass",
  },
  "ai-writing-tools": {
    summary:
      "Roundups and head-to-head comparisons to help you compare, shortlist, and choose an AI writing tool for your work.",
    menu: "Roundups and head-to-head comparisons",
    icon: "nib",
  },
  "ai-business-tools": {
    summary:
      "AI tools for solopreneurs and small business owners, including what they cost and what they can take off your plate.",
    menu: "Admin, meetings, support and what it costs",
    icon: "briefcase",
  },
  "ai-automation": {
    summary:
      "Step-by-step workflows you can configure, test, and deploy for email, scheduling, and other tasks that repeat.",
    menu: "Automations to build for email and scheduling",
    icon: "workflow",
  },
  "ai-agents": {
    summary:
      "What an AI agent actually is, how it differs from an automation, and where handing a task over is worth the supervision it still needs.",
    menu: "What they are, and when to trust one",
    icon: "agent",
  },
  "ai-news": {
    summary:
      "What actually changed in AI recently, what is confirmed rather than claimed, and what it means if you run a small business.",
    menu: "What changed, and whether it affects you",
    icon: "news",
  },
  "ai-prompts": {
    summary:
      "How to brief AI tools properly, with worked prompt examples for writing, marketing, and everyday business tasks.",
    menu: "A reusable structure, plus worked examples",
    icon: "prompt",
  },
  "ai-by-industry": {
    summary:
      "Where AI fits in a specific line of work, from small business and e-commerce to marketing teams.",
    menu: "Marketing, e-commerce and small business",
    icon: "industry",
  },
};

export function getPillarPresentation(id: PillarId): PillarPresentation {
  return PILLAR_PRESENTATION[id];
}
