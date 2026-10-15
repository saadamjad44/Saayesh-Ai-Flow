/**
 * The SEO snippet registry — the one place every page's search-result metadata
 * is written and reviewed, in the spirit of a snippet editor.
 *
 * Why this file exists, and why the metadata is not simply written in the MDX:
 * on this site a content entry's `title` and `description` are *page furniture*
 * as well as metadata. `title` is the <h1>, the breadcrumb label, every article
 * card, the search-index entry, and `Article.headline`, and it must byte-match
 * the registry title (see src/lib/content.ts). `description` is printed as the
 * visible lead paragraph (EntryLayout passes it as `intro`), and is reused as
 * card copy, related-page copy and schema `description`.
 *
 * So a search title tuned for a result page cannot be written in frontmatter
 * without rewriting what the reader sees. The overrides below are read by the
 * <head> and nowhere else, which means a snippet can be rewritten freely while
 * the page itself — headings, intro, cards, breadcrumbs, structured data —
 * stays exactly as authored.
 *
 * Every field is optional. Omit one and the page keeps the value it passes to
 * BaseLayout today, so adding a page here is always additive.
 *
 * `primaryKeyword`, `supportingKeywords` and `intent` are editorial planning
 * fields. They are read by the dev-only snippet preview and, for matching only,
 * by the local search index. They are NEVER rendered into the page: there is no
 * meta keywords tag on this site and must not be one — the tag has been ignored
 * by search engines for well over a decade.
 *
 * Validated by assertValidSeoSnippets() on every build (astro.config.ts), and
 * the rendered HTML is re-checked afterwards by src/lib/seo-audit.ts.
 */
import { PAGES, type PageId, type SitePage } from "./pages";
import { SITE } from "./site";

/** Editorial search-intent label, for prioritization. Never rendered. */
export type SearchIntent = "Commercial" | "Informational" | "Transactional" | "Info / Commercial";

/** Whether the brand suffix is appended to this page's <title>. */
export type BrandMode = "append" | "omit";

export interface PageSnippet {
  /**
   * The <title> text, before the brand suffix. Overrides whatever the page
   * passes to BaseLayout. Required for pages with no content entry behind them
   * (see assertValidSeoSnippets).
   */
  title?: string;
  /**
   * Whether to append the brand suffix. Defaults to "append", which is the
   * behaviour every page had before this registry existed. "omit" is for titles
   * that are strong on their own and would otherwise truncate: Google renders
   * the site name beside the result for an established site, and og:site_name
   * plus the WebSite schema still carry the brand.
   */
  brand?: BrandMode;
  /** The meta description. Does not change the page's visible intro. */
  description?: string;
  /** og:title / twitter:title, where social should read differently from search. */
  ogTitle?: string;
  /** og:description / twitter:description, same. */
  ogDescription?: string;
  /** The one query this page is written for. Editorial only. */
  primaryKeyword?: string;
  /** Close variants and secondary queries this page should also serve. Editorial only. */
  supportingKeywords?: readonly string[];
  /** Search intent, for prioritization. Editorial only. */
  intent?: SearchIntent;
  /** Why this snippet is written the way it is, for the next editor. */
  note?: string;
}

/**
 * Per-page snippets, in page-registry order. A key that is not a registered
 * page id fails the build, so this file can never drift from the site's URLs.
 */
export const PAGE_SNIPPETS: Partial<Record<PageId, PageSnippet>> = {
  // ---- Core pages --------------------------------------------------------
  home: {
    title: "AI Tools, Automation & Workflows for Small Business",
    brand: "omit",
    description:
      "Independent, research-based guides to AI tools, automation and prompts for solopreneurs and small business owners, with current pricing and real limits.",
    /**
     * Social gets the brand back: a shared link has no site-name line beside it
     * the way a search result does, so the name has to be in the title itself.
     */
    ogTitle: "Saayesh AI Flow: AI Tools & Automation for Small Business",
    /**
     * Deliberately no primaryKeyword. Every head term this site can realistically
     * win is already owned by a page written for it — "AI tools for small
     * business" by the use-case guide, "best AI tools for small business owners"
     * by the roundup, "how much does AI cost…" by the pricing guide. Giving the
     * homepage one of those would put it in competition with its own cluster,
     * which it would lose: a hub page is a worse answer to a specific query than
     * the page that answers it. The supporting terms below are positioning, so
     * the title and description stay in the right territory.
     */
    supportingKeywords: [
      "AI tools for solopreneurs",
      "AI automation for small business",
      "AI tool reviews",
    ],
    intent: "Info / Commercial",
    note: "A brand-led title spends the highest-value characters on a term only returning visitors search. Keyword-led here; the brand is still carried by og:site_name, the WebSite schema, and Google's own site-name line.",
  },
  about: {
    title: "About Us and Our Editorial Process",
    description:
      "Who runs Saayesh AI Flow, how we research AI tools, how we label testing, and how the site makes money.",
    intent: "Informational",
    note: "A trust page, not a keyword target: it is written for a reader checking who is behind a recommendation, so no primary keyword is assigned. Metadata unchanged.",
  },
  contact: {
    title: "Contact Us",
    description:
      "Contact Saayesh AI Flow with general questions, tool submissions, corrections, or business inquiries.",
    intent: "Informational",
    note: "Navigational page. Metadata unchanged.",
  },

  // ---- Utility pages (noindex; metadata is not a search surface) ----------
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Saayesh AI Flow collects, uses, and protects information when you visit the site or contact us.",
    note: "Noindexed in the page registry and excluded from the sitemap. Metadata unchanged.",
  },
  terms: {
    title: "Terms of Service",
    description:
      "The terms that apply when you use the Saayesh AI Flow website, including disclaimers and affiliate links.",
    note: "Noindexed. Metadata unchanged.",
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure",
    description:
      "How Saayesh AI Flow earns money through affiliate links, and why commissions don't decide our recommendations.",
    note: "Noindexed. Metadata unchanged.",
  },

  // ---- AI Writing cluster ------------------------------------------------
  "ai-writing-tools": {
    title: "AI Writing Tools: Types, Limits & How to Choose",
    brand: "omit",
    primaryKeyword: "AI writing tools",
    supportingKeywords: ["types of AI writing tools", "how to choose an AI writing tool"],
    intent: "Info / Commercial",
    note: 'The hub <h1> stays "AI Writing Tools"; the search title adds what the hub actually answers, which a bare category label cannot signal.',
  },
  "best-ai-writing-tools": {
    primaryKeyword: "best AI writing tools",
    supportingKeywords: ["AI writing tools 2026", "AI writing software comparison"],
    intent: "Commercial",
    note: "Title 44 and description 146 characters, both unique and accurate. No change.",
  },
  "jasper-vs-claude-vs-chatgpt": {
    title: "Jasper vs Claude vs ChatGPT: Which Is Best for Business?",
    brand: "omit",
    primaryKeyword: "Jasper vs Claude vs ChatGPT for business",
    supportingKeywords: [
      "jasper vs chatgpt",
      "claude vs jasper",
      "best AI writing tool for business",
    ],
    intent: "Commercial",
    note: 'A bare three-way "X vs Y vs Z" names the contenders but not the question. The page has a "Which should you choose?" section with an explicit verdict, so the title now promises what it delivers. Description unchanged — it already names the comparison axes.',
  },
  "best-ai-copywriting-tools": {
    primaryKeyword: "best AI copywriting tools",
    supportingKeywords: ["AI copywriting software", "AI tools for sales copy"],
    intent: "Commercial",
    note: "Title 43 characters, description 152. No change.",
  },
  "ai-tools-for-blog-writing": {
    primaryKeyword: "AI tools for blog writing",
    supportingKeywords: ["AI for blog posts", "AI blog writing workflow"],
    intent: "Info / Commercial",
    note: "Title 43 characters, description 148. No change.",
  },

  // ---- AI Business cluster -----------------------------------------------
  "ai-business-tools": {
    title: "AI Business & Productivity Tools for Small Business",
    brand: "omit",
    primaryKeyword: "AI business tools",
    supportingKeywords: ["AI productivity tools", "AI tools for business admin"],
    intent: "Info / Commercial",
    note: 'The hub <h1> stays "AI Business & Productivity". The search title adds the audience the hub is written for.',
  },
  "best-ai-tools-for-small-business": {
    title: "Best AI Tools for Small Business in 2026, by Use Case",
    brand: "omit",
    primaryKeyword: "best AI tools for small business",
    supportingKeywords: [
      "best AI tools for small business owners",
      "AI software for small business",
    ],
    intent: "Commercial",
    note: 'Rendered at 77 characters and truncated mid-phrase. Same promise, 53 characters. The commercial "Best … in 2026" framing also separates it from the task-led use-case guide at /ai-by-industry/ai-tools-for-small-business/.',
  },
  "ai-tools-vs-virtual-assistant": {
    primaryKeyword: "AI tools vs hiring a virtual assistant",
    supportingKeywords: ["AI vs virtual assistant", "should I hire a VA or use AI"],
    intent: "Informational",
    note: 'Title 47 characters, description 154. No change. The snippet preview flags that the title does not say "hiring" — accepted: "AI Tools vs Virtual Assistant" is the clearer headline, and the description carries the hiring comparison in full.',
  },
  "how-much-does-ai-cost-small-business": {
    title: "How Much Does AI Cost a Small Business? 2026 Prices",
    brand: "omit",
    description:
      "What AI software costs a small business at three budget levels: free, $20 to $50, and $100+ a month, with named tools, checked list prices and hidden costs.",
    primaryKeyword: "how much does AI cost for a small business",
    supportingKeywords: [
      "how much does ai cost a small business",
      "ai software pricing",
      "AI pricing for small business",
    ],
    intent: "Transactional",
    note: 'Dropping "for" matches the observed Search Console query verbatim and reads identically. "2026 Prices" signals the freshness this query wants and is accurate: every price on the page is vendor-checked and dated. "AI software" in the description serves the ai-software-pricing query without a second page.',
  },
  "claude-for-small-business": {
    title: "Claude for Small Business: 8 Workflows, Limits & Pricing",
    brand: "omit",
    description:
      "What Claude for Small Business can and cannot do: eight practical workflows, the integrations each one needs, current pricing, and where approval still matters.",
    primaryKeyword: "claude for small business",
    supportingKeywords: [
      "claude for small businesses",
      "claude small business pricing",
      "claude business workflows",
    ],
    intent: "Info / Commercial",
    note: 'The old description opened on "Explore", spending the first word on nothing, and repeated the keyword mid-sentence. The page has dedicated sections for limits and for cost that the old title never advertised. Also covers the plural query variant without a second page.',
  },
  "claude-vs-chatgpt-for-small-business": {
    brand: "omit",
    primaryKeyword: "claude vs chatgpt for small business",
    supportingKeywords: ["claude or chatgpt for business", "claude vs chatgpt pricing"],
    intent: "Commercial",
    note: "Title wording is good and the description is strong; it only truncated at 72 characters because of the brand suffix. Dropping the suffix fixes it with no copy change.",
  },
  "small-business-ai-cost-calculator": {
    title: "Free Small Business AI Cost Calculator: Monthly & Annual",
    brand: "omit",
    description:
      "Free calculator for your monthly, annual and first-year AI software costs across tools, seats and usage fees, plus cost per employee and business unit.",
    primaryKeyword: "small business AI cost calculator",
    supportingKeywords: [
      "ai cost per business unit",
      "AI cost per employee",
      "AI software cost calculator",
      "first-year AI cost",
    ],
    intent: "Informational",
    note: 'Rendered at 79 characters, the longest on the site. "Free" leads because it is the first thing a searcher decides and it is factually true — no sign-up, runs in the browser. The description now surfaces cost per business unit and per employee, both answered by their own H2s on the page and both observed Search Console queries.',
  },

  // ---- AI Automation cluster ---------------------------------------------
  "ai-automation": {
    title: "AI Automation & Workflows for Small Business",
    brand: "omit",
    primaryKeyword: "AI automation",
    supportingKeywords: ["AI automation for small business", "AI workflow automation"],
    intent: "Informational",
    note: "Hub title gains the audience qualifier; the visible <h1> is unchanged.",
  },
  "zapier-ai-automation-examples": {
    title: "8 Zapier AI Automation Examples for Small Business",
    brand: "omit",
    description:
      "Eight Zapier AI automation examples for small business, from email triage to receipt logging, each with its trigger, tools, steps, action and expected benefit.",
    primaryKeyword: "Zapier AI automation examples",
    supportingKeywords: [
      "zapier automation examples",
      "AI automation examples for small business",
      "Zapier AI steps",
    ],
    intent: "Informational",
    note: 'A leading count is the most reliable improvement available on an "examples" query, and eight is the real number of examples on the page. The description trades the abstract "broken down into" for two named examples, so the kind of automation is visible before the click.',
  },
  "best-ai-workflows-for-solopreneurs": {
    primaryKeyword: "best AI workflows for solopreneurs",
    supportingKeywords: ["AI workflows for freelancers", "solopreneur AI setup"],
    intent: "Info / Commercial",
    note: 'Title 47 characters, description 139. No change. The snippet preview flags that the title does not say "best" — accepted: the page is a set of seven workflows, not a ranked list, so claiming "best" in the title would oversell what it is.',
  },
  "how-to-automate-email-with-ai": {
    primaryKeyword: "how to automate email responses with AI",
    supportingKeywords: ["AI email automation", "automate Gmail replies with AI"],
    intent: "Informational",
    note: "Title 57 characters, description 151. No change.",
  },
  "ai-email-time-savings-calculator": {
    title: "AI Email Time Savings Calculator: Free ROI Tool",
    brand: "omit",
    description:
      "Estimate how much time AI email automation could save your business. Compare manual replies, human review time and software costs with our free calculator.",
    primaryKeyword: "ai email time savings calculator",
    supportingKeywords: [
      "email automation time savings calculator",
      "ai email automation roi calculator",
      "email reply time savings calculator",
      "ai email productivity calculator",
      "email automation roi for small business",
    ],
    intent: "Informational",
    note: 'The <h1> is "AI Email Time Savings & ROI Calculator"; the search title drops the ampersand, which search results render inconsistently, and leads on the saving a searcher is looking for. "Free" is factually true — no sign-up, runs in the browser — and is the first thing a searcher decides. The brand suffix is dropped because the title is 46 characters and the suffix would push it to 64. The ROI framing is carried in the title rather than the description so the description can spend its length on the three inputs that make this calculator different from a naive savings estimate: manual reply time, human review time, and software cost.',
  },

  // ---- Getting Started cluster -------------------------------------------
  "getting-started": {
    title: "Getting Started with AI: A Small Business Guide",
    brand: "omit",
    primaryKeyword: "getting started with AI",
    supportingKeywords: ["how to start using AI", "AI basics for business"],
    intent: "Informational",
    note: "Hub title gains the audience qualifier; the visible <h1> is unchanged.",
  },
  "how-to-use-ai-tools": {
    brand: "omit",
    primaryKeyword: "how to use AI tools",
    supportingKeywords: ["how to use AI for work", "AI tools beginner guide"],
    intent: "Informational",
    note: "Title and description are both good; the page only truncated at 71 characters because of the brand suffix. Dropping it fixes the title with no copy change.",
  },
  "how-to-write-effective-ai-prompts": {
    brand: "omit",
    primaryKeyword: "how to write effective AI prompts",
    supportingKeywords: ["how to write AI prompts", "prompt writing guide"],
    intent: "Informational",
    note: "Same as above: 75 characters rendered, entirely from the suffix. Copy unchanged.",
  },
  "ai-tools-for-beginners": {
    primaryKeyword: "AI tools for beginners",
    supportingKeywords: ["best AI tools for beginners", "first AI tool to try"],
    intent: "Info / Commercial",
    note: "Title 56 characters, description 153. No change.",
  },

  // ---- AI by Industry cluster --------------------------------------------
  "ai-by-industry": {
    title: "AI by Industry: Tools & Use Cases by Sector",
    brand: "omit",
    primaryKeyword: "AI tools by industry",
    supportingKeywords: ["AI use cases by industry", "industry-specific AI tools"],
    intent: "Informational",
    note: 'The hub <h1> stays "AI by Industry", which says nothing on its own in a list of results.',
  },
  "ai-tools-for-marketing": {
    title: "AI Tools for Marketing: Use Cases & Workflows",
    brand: "omit",
    primaryKeyword: "AI tools for marketing",
    supportingKeywords: ["AI for marketing teams", "AI marketing workflows"],
    intent: "Informational",
    note: 'Rendered at 75 characters. Shortening "Practical Use Cases and Workflows" to "Use Cases & Workflows" keeps the meaning at 45 characters.',
  },
  "ai-tools-for-ecommerce": {
    title: "AI Tools for E-commerce: Practical Use Cases",
    brand: "omit",
    primaryKeyword: "AI tools for e-commerce",
    supportingKeywords: ["AI for online stores", "AI ecommerce use cases"],
    intent: "Informational",
    note: 'Rendered at 67 characters. "Practical Ways to Use AI" duplicates what "AI Tools for E-commerce" already says; "Practical Use Cases" is shorter and clearer.',
  },
  "ai-tools-for-small-business": {
    title: "AI Tools for Small Business: 7 Everyday Tasks",
    brand: "omit",
    primaryKeyword: "AI tools for small business",
    supportingKeywords: ["AI use cases for small business", "what can AI do for my business"],
    intent: "Informational",
    note: "Rendered at 66 characters, and its old title read almost identically to the buying roundup at /ai-business-tools/best-ai-tools-for-small-business/. The two have genuinely different intents — learn what AI is for, versus choose what to buy — and the titles now say so. Seven is the real number of task sections on the page.",
  },

  // ---- AI Prompts cluster ------------------------------------------------
  "ai-prompts": {
    title: "AI Prompts: How to Write Them & Examples by Task",
    brand: "omit",
    primaryKeyword: "AI prompts",
    supportingKeywords: ["AI prompt writing", "AI prompts by task"],
    intent: "Informational",
    note: 'The hub <h1> stays "AI Prompts" — 10 characters, and nothing a searcher can act on.',
  },
  "ai-prompt-examples": {
    primaryKeyword: "AI prompt examples",
    supportingKeywords: ["example AI prompts", "good AI prompts"],
    intent: "Informational",
    note: "Title 36 characters, description 141. No change.",
  },
  "chatgpt-prompts-for-small-business": {
    primaryKeyword: "ChatGPT prompts for small business",
    supportingKeywords: ["ChatGPT prompts for business owners", "business ChatGPT prompts"],
    intent: "Info / Commercial",
    note: "Title 58 characters, description 147. No change.",
  },
  "ai-prompts-for-content-writing": {
    primaryKeyword: "AI prompts for content writing",
    supportingKeywords: ["AI prompts for writers", "AI editing prompts"],
    intent: "Informational",
    note: "Title 60 characters, description 144. No change.",
  },

  // ---- Phase 2 core pages ------------------------------------------------
  blog: {
    title: "AI Tool Guides, Prompts & Automation Workflows",
    brand: "omit",
    description:
      "Every published guide on Saayesh AI Flow, newest first: AI writing tools, business and productivity tools, automation workflows, prompts, and beginner guides.",
    primaryKeyword: "AI tool guides",
    supportingKeywords: ["AI guides for small business", "AI workflow guides"],
    intent: "Informational",
    note: 'Rendered at 74 characters, and the old "Blog:" prefix spent the lead on a word nobody searches. The brand suffix is dropped for the same reason as the category hubs: at 64 characters with it, the suffix is the part Google would cut. NOTE: unlike every other page, this `description` is also the archive\'s visible lead paragraph — src/pages/blog/index.astro reads it from here for both — so editing it changes on-page copy as well as the snippet.',
  },
  "author-saad-amjad": {
    title: "Saad Amjad, Author at Saayesh AI Flow",
    description:
      "Saad Amjad writes every guide on Saayesh AI Flow: AI tools, automation, prompts and small business workflows, with his research approach and published work.",
    intent: "Informational",
    note: "The old description was 172 characters and truncated — it was built by template literal in the .astro page, so it bypassed the 50–160 rule that MDX pages are validated against. This file is validated, so that cannot happen again. The title already names the brand, so no suffix is appended.",
  },
};

/** The brand suffix, written here and nowhere else. */
const BRAND_SUFFIX = ` | ${SITE.name}`;

/**
 * Applies the brand suffix. A title that already names the brand never gets a
 * second copy — the author page's title reads "… at Saayesh AI Flow" and must
 * not become "… at Saayesh AI Flow | Saayesh AI Flow".
 */
export function applyBrand(title: string, mode: BrandMode = "append"): string {
  if (mode === "omit" || title.includes(SITE.name)) return title;
  return `${title}${BRAND_SUFFIX}`;
}

export interface ResolvedSnippet {
  /** The finished <title>, brand suffix already applied. */
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  /** Editorial planning fields, for the snippet preview. Never rendered. */
  primaryKeyword?: string;
  supportingKeywords: readonly string[];
  intent?: SearchIntent;
  note?: string;
  /** Which values this registry supplied rather than the page itself. */
  overridden: { title: boolean; description: boolean };
}

export interface SnippetInput {
  /** Omitted for pages outside the registry (only the 404 page). */
  pageId?: PageId;
  /** The page's own title, used when this registry declares none. */
  title?: string;
  /** The page's own description, used when this registry declares none. */
  description?: string;
}

/**
 * The final <head> values for a page: this registry first, then whatever the
 * page passed in. Called once per page, by BaseLayout.
 */
export function resolveSnippet({ pageId, title, description }: SnippetInput): ResolvedSnippet {
  const snippet = pageId ? PAGE_SNIPPETS[pageId] : undefined;

  const baseTitle = snippet?.title ?? title;
  const baseDescription = snippet?.description ?? description;

  if (!baseTitle) {
    throw new Error(
      `No SEO title for "${pageId ?? "(unregistered page)"}": add a \`title\` to ` +
        "PAGE_SNIPPETS in src/config/seo-snippets.ts, or pass one to BaseLayout.",
    );
  }
  if (!baseDescription) {
    throw new Error(
      `No meta description for "${pageId ?? "(unregistered page)"}": add a \`description\` to ` +
        "PAGE_SNIPPETS in src/config/seo-snippets.ts, or pass one to BaseLayout.",
    );
  }

  const fullTitle = applyBrand(baseTitle, snippet?.brand);

  return {
    title: fullTitle,
    description: baseDescription,
    // Social falls back to the search values, which is what every page did before.
    ogTitle: snippet?.ogTitle ?? fullTitle,
    ogDescription: snippet?.ogDescription ?? baseDescription,
    primaryKeyword: snippet?.primaryKeyword,
    supportingKeywords: snippet?.supportingKeywords ?? [],
    intent: snippet?.intent,
    note: snippet?.note,
    overridden: {
      title: snippet?.title !== undefined,
      description: snippet?.description !== undefined,
    },
  };
}

/** Every planning keyword for a page, primary first. Matching only, never rendered. */
export function snippetKeywords(pageId: PageId): string[] {
  const snippet = PAGE_SNIPPETS[pageId];
  if (!snippet) return [];
  const primary = snippet.primaryKeyword ? [snippet.primaryKeyword] : [];
  return [...primary, ...(snippet.supportingKeywords ?? [])];
}

/**
 * Editorial length guides, not ranking rules. Google truncates on pixel width,
 * not characters, so these are the points at which a snippet is *likely* to be
 * cut — the build audit warns past them and never fails a build for length.
 */
export const SNIPPET_LIMITS = {
  /** Where a <title> typically starts truncating in Google's desktop results. */
  titleWarn: 60,
  /** Hard cap, matching the content schema's own `title` max so the two agree. */
  titleMax: 70,
  descriptionMin: 50,
  descriptionMax: 160,
} as const;

/** Page types whose pages only exist when a content entry is published. */
const CONTENT_BACKED: ReadonlySet<string> = new Set(["pillar", "article", "tool", "review"]);

/**
 * Static checks on this file alone, so it can run in astro.config.ts before
 * anything is built. Cross-page duplicate detection needs the rendered HTML and
 * lives in src/lib/seo-audit.ts.
 */
export function assertValidSeoSnippets(): void {
  const problems: string[] = [];
  const pages = PAGES as readonly SitePage[];
  const pageById = new Map(pages.map((page) => [page.id, page]));
  const primaryOwners = new Map<string, string>();

  for (const [id, snippet] of Object.entries(PAGE_SNIPPETS)) {
    if (!pageById.has(id)) {
      problems.push(`${id}: not a registered page in src/config/pages.ts`);
      continue;
    }
    if (!snippet) continue;

    const { title, description, ogTitle, ogDescription, primaryKeyword } = snippet;

    if (title !== undefined) {
      if (title.trim() !== title || title.length === 0) {
        problems.push(`${id}: title must be non-empty and not padded with whitespace`);
      }
      if (title.length > SNIPPET_LIMITS.titleMax) {
        problems.push(
          `${id}: title is ${title.length} characters, over the ${SNIPPET_LIMITS.titleMax} maximum`,
        );
      }
    }

    if (description !== undefined) {
      if (description.trim() !== description) {
        problems.push(`${id}: description must not be padded with whitespace`);
      }
      if (
        description.length < SNIPPET_LIMITS.descriptionMin ||
        description.length > SNIPPET_LIMITS.descriptionMax
      ) {
        problems.push(
          `${id}: description is ${description.length} characters, outside ` +
            `${SNIPPET_LIMITS.descriptionMin}-${SNIPPET_LIMITS.descriptionMax}`,
        );
      }
    }

    for (const [field, value] of [
      ["ogTitle", ogTitle],
      ["ogDescription", ogDescription],
    ] as const) {
      if (value !== undefined && value.trim().length === 0) {
        problems.push(`${id}: ${field} is empty — omit it instead`);
      }
    }

    /**
     * Two pages written for the same query compete with each other. The
     * registry is where that becomes visible, so it fails the build here.
     */
    if (primaryKeyword !== undefined) {
      if (primaryKeyword.trim().length === 0) {
        problems.push(`${id}: primaryKeyword is empty — omit it instead`);
      }
      const key = primaryKeyword.trim().toLowerCase();
      const owner = primaryOwners.get(key);
      if (owner) {
        problems.push(`${id}: primaryKeyword "${primaryKeyword}" is already claimed by ${owner}`);
      } else {
        primaryOwners.set(key, id);
      }
    }

    const seen = new Set<string>();
    for (const keyword of snippet.supportingKeywords ?? []) {
      const key = keyword.trim().toLowerCase();
      if (key.length === 0) {
        problems.push(`${id}: supportingKeywords contains an empty entry`);
      } else if (key === primaryKeyword?.trim().toLowerCase()) {
        problems.push(`${id}: "${keyword}" repeats the primaryKeyword`);
      } else if (seen.has(key)) {
        problems.push(`${id}: "${keyword}" is listed twice in supportingKeywords`);
      }
      seen.add(key);
    }
  }

  for (const page of pages) {
    const snippet = PAGE_SNIPPETS[page.id as PageId];

    /**
     * Pages with no content entry behind them (the core and utility pages) have
     * no frontmatter to fall back on, so their snippet is the only copy of
     * their metadata and must be complete.
     */
    if (!CONTENT_BACKED.has(page.type)) {
      if (!snippet?.title) {
        problems.push(`${page.id}: needs a title (no content entry to fall back on)`);
      }
      if (!snippet?.description) {
        problems.push(`${page.id}: needs a description (no content entry to fall back on)`);
      }
    }

    /**
     * Replaces the primaryKeyword rule that used to live in
     * assertValidPageRegistry(): every indexable content page is written for
     * one query, and that query is recorded here.
     */
    if (!page.noindex && CONTENT_BACKED.has(page.type) && !snippet?.primaryKeyword) {
      problems.push(`${page.id}: ${page.type} pages need a primaryKeyword`);
    }
  }

  if (problems.length > 0) {
    throw new Error(`Invalid SEO snippet registry:\n- ${problems.join("\n- ")}`);
  }
}
