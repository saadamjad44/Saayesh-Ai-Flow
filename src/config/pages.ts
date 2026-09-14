/**
 * Approved Phase 1 page registry — mirrors revised-blueprint-phase1.jsx.
 * Do not add pages here without explicit approval. Phase 2/3 URLs
 * (/blog/, /reviews/, /compare/, etc.) must not appear in this file.
 */

export type PageType = "core" | "utility" | "pillar" | "article";
export type PillarId = "ai-writing-tools" | "ai-business-tools" | "ai-automation";
export type SearchIntent = "Commercial" | "Informational" | "Transactional" | "Info / Commercial";

export interface SitePage {
  id: string;
  /** Working title from the blueprint; final <title> is set per page. */
  title: string;
  path: `/${string}/` | "/";
  type: PageType;
  /** Blueprint delivery week. */
  week: string;
  pillar?: PillarId;
  noindex?: boolean;
  /** Internal prioritization only. Never render keyword data on the site. */
  primaryKeyword?: string;
  intent?: SearchIntent;
}

export const PHASE1_PAGE_COUNT = 17;

export const PAGES = [
  // Week 1 — Foundation
  { id: "home", title: "Homepage", path: "/", type: "core", week: "1" },
  { id: "about", title: "About + Editorial Process", path: "/about/", type: "core", week: "1" },
  { id: "contact", title: "Contact", path: "/contact/", type: "core", week: "1" },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    path: "/privacy-policy/",
    type: "utility",
    week: "1",
    noindex: true,
  },
  {
    id: "terms",
    title: "Terms of Service",
    path: "/terms/",
    type: "utility",
    week: "1",
    noindex: true,
  },
  {
    id: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    path: "/affiliate-disclosure/",
    type: "utility",
    week: "1",
    noindex: true,
  },

  // Weeks 2–3 — AI Writing cluster
  {
    id: "ai-writing-tools",
    title: "AI Writing Tools",
    path: "/ai-writing-tools/",
    type: "pillar",
    week: "2–3",
  },
  {
    id: "best-ai-writing-tools",
    title: "Best AI Writing Tools 2026",
    path: "/ai-writing-tools/best-ai-writing-tools/",
    type: "article",
    week: "2–3",
    pillar: "ai-writing-tools",
    primaryKeyword: "best AI writing tools",
    intent: "Commercial",
  },
  {
    id: "jasper-vs-claude-vs-chatgpt",
    title: "Jasper vs Claude vs ChatGPT",
    path: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
    type: "article",
    week: "2–3",
    pillar: "ai-writing-tools",
    primaryKeyword: "Jasper vs Claude vs ChatGPT for business",
    intent: "Commercial",
  },

  // Weeks 4–5 — AI Business cluster
  {
    id: "ai-business-tools",
    title: "AI Business & Productivity",
    path: "/ai-business-tools/",
    type: "pillar",
    week: "4–5",
  },
  {
    id: "best-ai-tools-for-small-business",
    title: "Best AI Tools for Small Business Owners",
    path: "/ai-business-tools/best-ai-tools-for-small-business/",
    type: "article",
    week: "4–5",
    pillar: "ai-business-tools",
    primaryKeyword: "best AI tools for small business owners",
    intent: "Commercial",
  },
  {
    id: "ai-tools-vs-virtual-assistant",
    title: "AI Tools vs Hiring a Virtual Assistant",
    path: "/ai-business-tools/ai-tools-vs-virtual-assistant/",
    type: "article",
    week: "4–5",
    pillar: "ai-business-tools",
    primaryKeyword: "AI tools vs hiring a virtual assistant",
    intent: "Informational",
  },

  // Weeks 6–7 — AI Automation cluster
  {
    id: "ai-automation",
    title: "AI Automation & Workflows",
    path: "/ai-automation/",
    type: "pillar",
    week: "6–7",
  },
  {
    id: "zapier-ai-automation-examples",
    title: "Zapier AI Automation Examples",
    path: "/ai-automation/zapier-ai-automation-examples/",
    type: "article",
    week: "6–7",
    pillar: "ai-automation",
    primaryKeyword: "Zapier AI automation examples",
    intent: "Informational",
  },
  {
    id: "best-ai-workflows-for-solopreneurs",
    title: "Best AI Workflows for Solopreneurs",
    path: "/ai-automation/best-ai-workflows-for-solopreneurs/",
    type: "article",
    week: "6–7",
    pillar: "ai-automation",
    primaryKeyword: "best AI workflows for solopreneurs",
    intent: "Info / Commercial",
  },

  // Week 8 — Fill gaps
  {
    id: "how-much-does-ai-cost-small-business",
    title: "How Much Does AI Cost for a Small Business?",
    path: "/ai-business-tools/how-much-does-ai-cost-small-business/",
    type: "article",
    week: "8",
    pillar: "ai-business-tools",
    primaryKeyword: "how much does AI cost for a small business",
    intent: "Transactional",
  },
  {
    id: "how-to-automate-email-with-ai",
    title: "How to Automate Email Responses With AI",
    path: "/ai-automation/how-to-automate-email-with-ai/",
    type: "article",
    week: "8",
    pillar: "ai-automation",
    primaryKeyword: "how to automate email responses with AI",
    intent: "Informational",
  },
] as const satisfies readonly SitePage[];

export type PageId = (typeof PAGES)[number]["id"];

const pagesById = new Map<string, SitePage>(PAGES.map((page) => [page.id, page]));

export function getPage(id: PageId): SitePage {
  const page = pagesById.get(id);
  if (!page) throw new Error(`Unknown page id: ${id}`);
  return page;
}

export const NOINDEX_PATHS: ReadonlySet<string> = new Set(
  PAGES.filter((page: SitePage) => page.noindex).map((page) => page.path),
);

const URL_PATTERN = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/;

/** Enforces blueprint URL rules and scope. Runs on every build via astro.config.ts. */
export function assertValidPageRegistry(): void {
  const problems: string[] = [];
  const paths = new Set<string>();

  for (const page of PAGES as readonly SitePage[]) {
    if (!URL_PATTERN.test(page.path)) {
      problems.push(`${page.id}: path must be lowercase, hyphenated, with a trailing slash`);
    }
    if (paths.has(page.path)) problems.push(`${page.id}: duplicate path ${page.path}`);
    paths.add(page.path);

    if (page.type === "article") {
      if (!page.pillar || !page.primaryKeyword) {
        problems.push(`${page.id}: articles need a pillar and primaryKeyword`);
      } else if (!page.path.startsWith(`/${page.pillar}/`)) {
        problems.push(`${page.id}: article path must be nested under /${page.pillar}/`);
      }
    }
  }

  if (PAGES.length !== PHASE1_PAGE_COUNT) {
    problems.push(`Phase 1 must have ${PHASE1_PAGE_COUNT} pages, found ${PAGES.length}`);
  }

  if (problems.length > 0) {
    throw new Error(`Invalid page registry:\n- ${problems.join("\n- ")}`);
  }
}
