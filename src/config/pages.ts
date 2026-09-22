/**
 * Approved page registry — mirrors revised-blueprint-phase1.jsx and the
 * approved Phase 2 roadmap. Do not add pages here without explicit approval.
 *
 * Every page declares the `phase` that approved it, and PAGE_COUNTS locks the
 * total per phase: Phase 1 stays at exactly 17 pages forever, and each Phase 2
 * batch bumps its count deliberately. Phase 3 URLs (/compare/, /blog/) must not
 * appear in this file.
 */

export type PageType = "core" | "utility" | "pillar" | "article" | "review" | "tool";
export type SearchIntent = "Commercial" | "Informational" | "Transactional" | "Info / Commercial";

/** Roadmap phase that approved a page. */
export type SitePhase = 1 | 2;

/**
 * Every category pillar, in nav order. A pillar's id is always its URL slug.
 * Adding an id here without also registering its pillar page fails the build,
 * so the union can never drift from the pages that actually exist.
 */
export const PILLAR_IDS = [
  "ai-writing-tools",
  "ai-business-tools",
  "ai-automation",
  "getting-started",
  "ai-by-industry",
  "ai-prompts",
] as const;

export type PillarId = (typeof PILLAR_IDS)[number];

/**
 * Top-level URL segments owned by non-pillar routes, present or approved.
 * A pillar slug may never take one of these: /reviews/, /tool-finder/ and
 * /prompt-library/ are static routes that would silently shadow the
 * /[pillar]/ catch-all rather than fail the build.
 */
const RESERVED_SEGMENTS: ReadonlySet<string> = new Set([
  "about",
  "affiliate-disclosure",
  "blog",
  "compare",
  "contact",
  "privacy-policy",
  "prompt-library",
  "reviews",
  "terms",
  "tool-finder",
]);

export interface SitePage {
  id: string;
  /**
   * User-facing page title, shown in breadcrumbs, nav, and BreadcrumbList schema.
   * For pillar and article pages the MDX `title` frontmatter is authoritative and
   * this must match it exactly — getPublishedEntries() fails the build otherwise.
   */
  title: string;
  path: `/${string}/` | "/";
  type: PageType;
  /** Roadmap phase that approved this page. */
  phase: SitePhase;
  /** Phase 1 blueprint delivery week. */
  week?: string;
  pillar?: PillarId;
  /**
   * Breadcrumb parent for pages whose parent is not a pillar (e.g. a review
   * under the /reviews/ hub). Validated against the registry at build time.
   * Articles use `pillar` instead.
   */
  parent?: string;
  noindex?: boolean;
  /** Internal prioritization only. Never render keyword data on the site. */
  primaryKeyword?: string;
  intent?: SearchIntent;
}

/**
 * Approved page count per phase. Phase 1 is frozen at its launch scope; the
 * Phase 2 number is raised one batch at a time as pages are approved.
 */
export const PAGE_COUNTS: Readonly<Record<SitePhase, number>> = {
  1: 17,
  2: 6,
};

export const PAGES = [
  // Week 1 — Foundation
  { id: "home", title: "Homepage", path: "/", type: "core", phase: 1, week: "1" },
  {
    id: "about",
    title: "About + Editorial Process",
    path: "/about/",
    type: "core",
    phase: 1,
    week: "1",
  },
  { id: "contact", title: "Contact", path: "/contact/", type: "core", phase: 1, week: "1" },
  {
    id: "privacy-policy",
    title: "Privacy Policy",
    path: "/privacy-policy/",
    type: "utility",
    phase: 1,
    week: "1",
    noindex: true,
  },
  {
    id: "terms",
    title: "Terms of Service",
    path: "/terms/",
    type: "utility",
    phase: 1,
    week: "1",
    noindex: true,
  },
  {
    id: "affiliate-disclosure",
    title: "Affiliate Disclosure",
    path: "/affiliate-disclosure/",
    type: "utility",
    phase: 1,
    week: "1",
    noindex: true,
  },

  // Weeks 2–3 — AI Writing cluster
  {
    id: "ai-writing-tools",
    title: "AI Writing Tools",
    path: "/ai-writing-tools/",
    type: "pillar",
    phase: 1,
    week: "2–3",
  },
  {
    id: "best-ai-writing-tools",
    title: "Best AI Writing Tools 2026",
    path: "/ai-writing-tools/best-ai-writing-tools/",
    type: "article",
    phase: 1,
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
    phase: 1,
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
    phase: 1,
    week: "4–5",
  },
  {
    id: "best-ai-tools-for-small-business",
    title: "Best AI Tools for Small Business",
    path: "/ai-business-tools/best-ai-tools-for-small-business/",
    type: "article",
    phase: 1,
    week: "4–5",
    pillar: "ai-business-tools",
    primaryKeyword: "best AI tools for small business owners",
    intent: "Commercial",
  },
  {
    id: "ai-tools-vs-virtual-assistant",
    title: "AI Tools vs Virtual Assistant",
    path: "/ai-business-tools/ai-tools-vs-virtual-assistant/",
    type: "article",
    phase: 1,
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
    phase: 1,
    week: "6–7",
  },
  {
    id: "zapier-ai-automation-examples",
    title: "Zapier AI Automation Examples",
    path: "/ai-automation/zapier-ai-automation-examples/",
    type: "article",
    phase: 1,
    week: "6–7",
    pillar: "ai-automation",
    primaryKeyword: "Zapier AI automation examples",
    intent: "Informational",
  },
  {
    id: "best-ai-workflows-for-solopreneurs",
    title: "AI Workflows for Solopreneurs",
    path: "/ai-automation/best-ai-workflows-for-solopreneurs/",
    type: "article",
    phase: 1,
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
    phase: 1,
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
    phase: 1,
    week: "8",
    pillar: "ai-automation",
    primaryKeyword: "how to automate email responses with AI",
    intent: "Informational",
  },

  // Phase 2A — Getting Started pillar (top-of-funnel hub)
  {
    id: "getting-started",
    title: "Getting Started with AI",
    path: "/getting-started/",
    type: "pillar",
    phase: 2,
  },

  // Phase 2C — Getting Started cluster, first batch
  {
    id: "how-to-use-ai-tools",
    title: "How to Use AI Tools: A Beginner's Practical Guide",
    path: "/getting-started/how-to-use-ai-tools/",
    type: "article",
    phase: 2,
    pillar: "getting-started",
    primaryKeyword: "how to use AI tools",
    intent: "Informational",
  },
  {
    id: "how-to-write-effective-ai-prompts",
    title: "How to Write Effective AI Prompts: A Beginner's Guide",
    path: "/getting-started/how-to-write-effective-ai-prompts/",
    type: "article",
    phase: 2,
    pillar: "getting-started",
    primaryKeyword: "how to write effective AI prompts",
    intent: "Informational",
  },
  {
    id: "ai-tools-for-beginners",
    title: "AI Tools for Beginners: Where to Start",
    path: "/getting-started/ai-tools-for-beginners/",
    type: "article",
    phase: 2,
    pillar: "getting-started",
    primaryKeyword: "AI tools for beginners",
    intent: "Info / Commercial",
  },

  // Phase 2B — AI by Industry pillar (topical hub; its cluster is not built yet)
  {
    id: "ai-by-industry",
    title: "AI by Industry",
    path: "/ai-by-industry/",
    type: "pillar",
    phase: 2,
  },

  // Phase 2B — AI Prompts pillar (skills hub; its cluster and the Prompt
  // Library at /prompt-library/ are not built yet)
  {
    id: "ai-prompts",
    title: "AI Prompts",
    path: "/ai-prompts/",
    type: "pillar",
    phase: 2,
  },
] as const satisfies readonly SitePage[];

export type PageId = (typeof PAGES)[number]["id"];

const pagesById = new Map<string, SitePage>(PAGES.map((page) => [page.id, page]));

export function getPage(id: PageId): SitePage {
  const page = pagesById.get(id);
  if (!page) throw new Error(`Unknown page id: ${id}`);
  return page;
}

/**
 * Breadcrumb parent of a page: an explicit `parent`, else its pillar.
 * Both are validated against the registry by assertValidPageRegistry().
 */
export function getParentPage(page: SitePage): SitePage | undefined {
  const parentId = page.parent ?? page.pillar;
  return parentId ? pagesById.get(parentId) : undefined;
}

export const NOINDEX_PATHS: ReadonlySet<string> = new Set(
  PAGES.filter((page: SitePage) => page.noindex).map((page) => page.path),
);

const URL_PATTERN = /^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*$/;

/** Path segments of a registry path, e.g. "/a/b/" → ["a", "b"]. */
const segmentsOf = (page: SitePage): string[] => page.path.split("/").filter(Boolean);

/** Enforces blueprint URL rules and scope. Runs on every build via astro.config.ts. */
export function assertValidPageRegistry(): void {
  const problems: string[] = [];
  const paths = new Set<string>();
  const ids = new Set<string>();
  const counts = new Map<SitePhase, number>();

  for (const page of PAGES as readonly SitePage[]) {
    const segments = segmentsOf(page);

    if (!URL_PATTERN.test(page.path)) {
      problems.push(`${page.id}: path must be lowercase, hyphenated, with a trailing slash`);
    }
    if (paths.has(page.path)) problems.push(`${page.id}: duplicate path ${page.path}`);
    paths.add(page.path);

    // A duplicate id collapses silently in the PageId union and in pagesById.
    if (ids.has(page.id)) problems.push(`${page.id}: duplicate page id`);
    ids.add(page.id);

    counts.set(page.phase, (counts.get(page.phase) ?? 0) + 1);

    if (page.parent && !pagesById.has(page.parent)) {
      problems.push(`${page.id}: parent "${page.parent}" is not a registered page`);
    }

    switch (page.type) {
      case "pillar": {
        // The pillar id is its slug: media ids, nav sections, and the
        // /[pillar]/ route all resolve a pillar by id.
        if (segments.length !== 1 || segments[0] !== page.id) {
          problems.push(`${page.id}: pillar path must be exactly /${page.id}/`);
        }
        if (!(PILLAR_IDS as readonly string[]).includes(page.id)) {
          problems.push(`${page.id}: pillar id must be listed in PILLAR_IDS`);
        }
        if (RESERVED_SEGMENTS.has(page.id)) {
          problems.push(`${page.id}: pillar slug is a reserved top-level segment`);
        }
        break;
      }
      case "article": {
        if (!page.pillar || !page.primaryKeyword) {
          problems.push(`${page.id}: articles need a pillar and primaryKeyword`);
        } else if (!page.path.startsWith(`/${page.pillar}/`) || segments.length !== 2) {
          problems.push(`${page.id}: article path must be /${page.pillar}/[slug]/`);
        }
        break;
      }
      case "review": {
        if (segments[0] !== "reviews" || segments.length !== 2) {
          problems.push(`${page.id}: review path must be /reviews/[tool]/`);
        }
        break;
      }
      case "tool": {
        if (segments.length !== 1) {
          problems.push(`${page.id}: tool path must be a single top-level segment`);
        }
        break;
      }
    }
  }

  // Every declared pillar must exist as a page, so PillarId can never name a
  // pillar that getPage() would throw on.
  for (const pillarId of PILLAR_IDS) {
    if (pagesById.get(pillarId)?.type !== "pillar") {
      problems.push(`${pillarId}: listed in PILLAR_IDS but not registered as a pillar page`);
    }
  }

  for (const [phase, expected] of Object.entries(PAGE_COUNTS)) {
    const found = counts.get(Number(phase) as SitePhase) ?? 0;
    if (found !== expected) {
      problems.push(`Phase ${phase} must have ${expected} pages, found ${found}`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid page registry:\n- ${problems.join("\n- ")}`);
  }
}
