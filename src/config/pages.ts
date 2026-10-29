/**
 * Approved page registry — mirrors revised-blueprint-phase1.jsx and the
 * approved Phase 2 roadmap. Do not add pages here without explicit approval.
 *
 * Every page declares the `phase` that approved it, and PAGE_COUNTS locks the
 * total per phase: Phase 1 stays at exactly 17 pages forever, and each later
 * batch bumps its count deliberately. The /compare/ hub is still unbuilt and
 * must not appear in this file until it is approved.
 *
 * /blog/ was deferred at Phase 1 and approved as a Phase 2 page: it is the
 * central index of published article content, generated from this registry and
 * the MDX collections rather than a hand-maintained list.
 *
 * This file owns a page's *identity*: its id, URL, type, parent and
 * indexability. It deliberately owns none of its search metadata — SEO titles,
 * meta descriptions, Open Graph overrides and keyword planning all live in
 * src/config/seo-snippets.ts, so there is one place to review how the site
 * appears in a result page.
 */

export type PageType = "core" | "utility" | "pillar" | "article" | "review" | "tool";

/** Roadmap phase that approved a page. */
export type SitePhase = 1 | 2 | 3;

/**
 * Every category pillar, in nav order. A pillar's id is always its URL slug.
 * Adding an id here without also registering its pillar page fails the build,
 * so the union can never drift from the pages that actually exist.
 */
export const PILLAR_IDS = [
  "ai-writing-tools",
  "ai-business-tools",
  "ai-automation",
  "ai-agents",
  "ai-news",
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
  "author",
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
}

/**
 * Approved page count per phase. Phase 1 is frozen at its launch scope; the
 * later numbers are raised one batch at a time as pages are approved.
 */
export const PAGE_COUNTS: Readonly<Record<SitePhase, number>> = {
  1: 17,
  2: 20,
  3: 24,
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
  },
  {
    id: "jasper-vs-claude-vs-chatgpt",
    title: "Jasper vs Claude vs ChatGPT",
    path: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
    type: "article",
    phase: 1,
    week: "2–3",
    pillar: "ai-writing-tools",
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
    title: "Best AI Tools for Small Business in 2026: Picks by Use Case",
    path: "/ai-business-tools/best-ai-tools-for-small-business/",
    type: "article",
    phase: 1,
    week: "4–5",
    pillar: "ai-business-tools",
  },
  {
    id: "ai-tools-vs-virtual-assistant",
    title: "AI Tools vs Virtual Assistant",
    path: "/ai-business-tools/ai-tools-vs-virtual-assistant/",
    type: "article",
    phase: 1,
    week: "4–5",
    pillar: "ai-business-tools",
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
  },
  {
    id: "best-ai-workflows-for-solopreneurs",
    title: "AI Workflows for Solopreneurs",
    path: "/ai-automation/best-ai-workflows-for-solopreneurs/",
    type: "article",
    phase: 1,
    week: "6–7",
    pillar: "ai-automation",
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
  },
  {
    id: "how-to-automate-email-with-ai",
    title: "How to Automate Email Responses With AI",
    path: "/ai-automation/how-to-automate-email-with-ai/",
    type: "article",
    phase: 1,
    week: "8",
    pillar: "ai-automation",
  },

  // Phase 2 — Blog index: the chronological hub for every published article.
  // Article URLs stay under their pillar; this page only links to them.
  { id: "blog", title: "Blog", path: "/blog/", type: "core", phase: 2 },

  // Phase 2 — the author page for the one person who writes the site, approved
  // by the owner on 2026-10-09 as part of the technical SEO audit. It carries
  // the Person entity that every article's `author` points at, so the visible
  // byline on each guide has a real, crawlable page behind it. There is no
  // /author/ index: one author needs no hub, and an empty one would be a thin
  // page. `author` is a reserved top-level segment above, so no pillar can
  // ever shadow this route.
  {
    id: "author-saad-amjad",
    title: "Saad Amjad",
    path: "/author/saad-amjad/",
    type: "core",
    phase: 2,
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
  },
  {
    id: "how-to-write-effective-ai-prompts",
    title: "How to Write Effective AI Prompts: A Beginner's Guide",
    path: "/getting-started/how-to-write-effective-ai-prompts/",
    type: "article",
    phase: 2,
    pillar: "getting-started",
  },
  {
    id: "ai-tools-for-beginners",
    title: "AI Tools for Beginners: Where to Start",
    path: "/getting-started/ai-tools-for-beginners/",
    type: "article",
    phase: 2,
    pillar: "getting-started",
  },

  // Phase 2B — AI by Industry pillar (topical hub)
  {
    id: "ai-by-industry",
    title: "AI by Industry",
    path: "/ai-by-industry/",
    type: "pillar",
    phase: 2,
  },

  // Phase 2C — AI by Industry cluster, first batch
  {
    id: "ai-tools-for-marketing",
    title: "AI Tools for Marketing: Practical Use Cases and Workflows",
    path: "/ai-by-industry/ai-tools-for-marketing/",
    type: "article",
    phase: 2,
    pillar: "ai-by-industry",
  },
  {
    id: "ai-tools-for-ecommerce",
    title: "AI Tools for E-commerce: Practical Ways to Use AI",
    path: "/ai-by-industry/ai-tools-for-ecommerce/",
    type: "article",
    phase: 2,
    pillar: "ai-by-industry",
  },
  {
    id: "ai-tools-for-small-business",
    title: "AI Tools for Small Business: Practical Use Cases",
    path: "/ai-by-industry/ai-tools-for-small-business/",
    type: "article",
    phase: 2,
    pillar: "ai-by-industry",
  },

  // Phase 2B — AI Prompts pillar (skills hub; the Prompt Library at
  // /prompt-library/ is not built yet)
  {
    id: "ai-prompts",
    title: "AI Prompts",
    path: "/ai-prompts/",
    type: "pillar",
    phase: 2,
  },

  // Phase 2C — AI Prompts cluster, first batch
  {
    id: "ai-prompt-examples",
    title: "AI Prompt Examples",
    path: "/ai-prompts/ai-prompt-examples/",
    type: "article",
    phase: 2,
    pillar: "ai-prompts",
  },
  {
    id: "chatgpt-prompts-for-small-business",
    title: "ChatGPT Prompts for Small Business Tasks",
    path: "/ai-prompts/chatgpt-prompts-for-small-business/",
    type: "article",
    phase: 2,
    pillar: "ai-prompts",
  },
  {
    id: "ai-prompts-for-content-writing",
    title: "AI Prompts for Content Writing and Editing",
    path: "/ai-prompts/ai-prompts-for-content-writing/",
    type: "article",
    phase: 2,
    pillar: "ai-prompts",
  },

  // Phase 2D — AI Writing cluster expansion (narrower intents than the
  // Phase 1 roundup: copy specifically, and blog-writing workflows)
  {
    id: "best-ai-copywriting-tools",
    title: "AI Copywriting Tools: How to Choose One",
    path: "/ai-writing-tools/best-ai-copywriting-tools/",
    type: "article",
    phase: 2,
    pillar: "ai-writing-tools",
  },
  {
    id: "ai-tools-for-blog-writing",
    title: "AI Tools for Blog Writing",
    path: "/ai-writing-tools/ai-tools-for-blog-writing/",
    type: "article",
    phase: 2,
    pillar: "ai-writing-tools",
  },

  // Phase 2E — AI Business cluster expansion: a single-product deep dive, for
  // readers who have already decided the category and are now assessing one
  // connected-workflow product against the software they already run.
  {
    id: "claude-for-small-business",
    title: "Claude for Small Business: 8 Practical Workflows",
    path: "/ai-business-tools/claude-for-small-business/",
    type: "article",
    phase: 2,
    pillar: "ai-business-tools",
  },
  // Phase 2E — the head-to-head that follows the single-product deep dive: a
  // buyer who has shortlisted the two general assistants and needs to pick one
  // for day-to-day business work. Sits in the business cluster rather than the
  // writing cluster because the intent is operational, not content production.
  {
    id: "claude-vs-chatgpt-for-small-business",
    title: "Claude vs ChatGPT for Small Business: Which Is Better?",
    path: "/ai-business-tools/claude-vs-chatgpt-for-small-business/",
    type: "article",
    phase: 2,
    pillar: "ai-business-tools",
  },

  // Phase 2F — the cluster's first free interactive utility, and a deliberately
  // different page type from the guides around it: a browser-side calculator
  // with supporting editorial copy, so it carries WebApplication schema rather
  // than Article schema (see src/lib/seo.ts) and is rendered from the `tools`
  // collection. It sits inside the AI Business cluster, where the budgeting
  // intent already lives, rather than under a new /tools/ top level that a
  // single utility would not justify. Further tools can be registered the same
  // way, here or under another pillar, with no further architecture change.
  {
    id: "small-business-ai-cost-calculator",
    title: "Small Business AI Cost Calculator: Monthly & Annual Spend",
    path: "/ai-business-tools/small-business-ai-cost-calculator/",
    type: "tool",
    phase: 2,
    pillar: "ai-business-tools",
  },

  // Phase 2F — the automation cluster's free interactive utility, and the
  // counterpart to the cost calculator above: that one totals what AI costs,
  // this one estimates what an AI email workflow saves, net of the human review
  // time such a workflow still needs. It sits under /ai-automation/ because the
  // intent it serves already lives there — the cluster has a tutorial on
  // automating email replies and a Zapier examples guide, both of which ask the
  // reader to judge whether the saving is worth the setup.
  {
    id: "ai-email-time-savings-calculator",
    title: "AI Email Time Savings & ROI Calculator",
    path: "/ai-automation/ai-email-time-savings-calculator/",
    type: "tool",
    phase: 2,
    pillar: "ai-automation",
  },

  /**
   * Phase 3 — the AI Agents pillar and its first cluster.
   *
   * The seventh pillar, and the first one added because the vocabulary of the
   * subject moved rather than because the site had a hole in its own plan. The
   * six existing hubs cover tools you operate (writing, business, prompts) and
   * workflows you configure once (automation). An agent is neither: it decides
   * the steps itself at run time, which is a different thing to buy, a
   * different thing to supervise, and a different thing to get wrong. Filing it
   * under /ai-automation/ would have implied the two are the same — the exact
   * confusion the cluster's middle guide exists to clear up — so it gets its own
   * top-level segment and links across to automation rather than sitting in it.
   */
  {
    id: "ai-agents",
    title: "AI Agents",
    path: "/ai-agents/",
    type: "pillar",
    phase: 3,
  },
  // The commercial end of the cluster: a reader who has accepted the idea and
  // now has to choose. Written as selection criteria plus categories rather
  // than a ranked table, because every ranked list on this query today is
  // published by a vendor that sells one of the entries.
  {
    id: "best-ai-agents-for-small-business",
    title: "Best AI Agents for Small Business in 2026",
    path: "/ai-agents/best-ai-agents-for-small-business/",
    type: "article",
    phase: 3,
    pillar: "ai-agents",
  },
  // The distinction guide, and the bridge to /ai-automation/. Most people
  // searching for an agent want a workflow and would be better served by one.
  {
    id: "ai-agents-vs-automation",
    title: "AI Agents vs Automation: What's the Difference?",
    path: "/ai-agents/ai-agents-vs-automation/",
    type: "article",
    phase: 3,
    pillar: "ai-agents",
  },
  // The practical end: what the work actually looks like, task by task, with
  // the supervision each one needs stated rather than implied.
  {
    id: "ai-agent-use-cases",
    title: "AI Agent Use Cases for Small Business",
    path: "/ai-agents/ai-agent-use-cases/",
    type: "article",
    phase: 3,
    pillar: "ai-agents",
  },

  /**
   * Phase 3 - the proactive-agent head-to-head, approved 2026-10-23.
   *
   * Three vendors shipped a proactive personal agent inside six weeks (Meta
   * Muse 8 Sep, OpenAI Dots 29 Sep, Claude Duet 21 Oct 2026) and all three are
   * gated - by waitlist, by plan tier, or by country. That is the page: not a
   * ranked winner, which nobody can honestly declare on products that cannot
   * all be used yet, but which of them a reader is actually eligible for and
   * whether waiting is the better call. It belongs under /ai-agents/ because it
   * is the cluster's newest-product end, and it links back into
   * ai-agents-vs-automation for the large share of this traffic that wants a
   * workflow rather than an agent.
   */
  {
    id: "claude-duet-vs-openai-dots-vs-meta-muse",
    title: "Claude Duet vs OpenAI Dots vs Meta Muse",
    path: "/ai-agents/claude-duet-vs-openai-dots-vs-meta-muse/",
    type: "article",
    phase: 3,
    pillar: "ai-agents",
  },

  /**
   * The product explainer behind the comparison, approved 2026-10-23 on the
   * owner's validated Semrush volume for "what is Claude Duet".
   *
   * Distinct from the three-way comparison by intent, not by keyword variant:
   * the comparison answers "which of these am I eligible for", this answers
   * "what is this thing and should I join the waitlist". To keep the pair from
   * converging, the comparison page's Duet detail was deliberately slimmed to
   * an orientation plus a link when this page shipped, and the operational
   * detail that only matters once you are choosing Duet specifically - shared
   * plan usage limits, the approval boundaries, the named connectors - lives
   * only here.
   */
  {
    id: "what-is-claude-duet",
    title: "What Is Claude Duet? Anthropic's Proactive AI Agent",
    path: "/ai-agents/what-is-claude-duet/",
    type: "article",
    phase: 3,
    pillar: "ai-agents",
  },

  /**
   * Phase 3 — support and chatbots, approved 2026-10-20.
   *
   * The /ai-agents/ cluster above names help-centre support agents as the one
   * genuinely mature agent category, and then had nowhere to send that intent.
   * These two pages are that destination, split by the question being asked
   * rather than by product: what to buy (a chatbot, under the business pillar,
   * where purchasing intent lives) and how the automation behind it works (under
   * the automation pillar, beside the other workflow tutorials).
   */
  {
    id: "ai-chatbot-for-small-business",
    title: "AI Chatbot for Small Business: What It Can Actually Do",
    path: "/ai-business-tools/ai-chatbot-for-small-business/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },
  {
    id: "ai-customer-service-automation",
    title: "AI Customer Service Automation: How It Works",
    path: "/ai-automation/ai-customer-service-automation/",
    type: "article",
    phase: 3,
    pillar: "ai-automation",
  },

  /**
   * Phase 3 — the automation cluster's buying layer, approved 2026-10-20.
   *
   * Two different intents that the pillar was previously answering in passing,
   * in a "Choosing tools" section that has now been slimmed to an orientation
   * and a link: the head-to-head for someone who has already shortlisted the
   * three named platforms, and the category roundup for someone who has not.
   */
  {
    id: "n8n-vs-zapier-vs-make",
    title: "n8n vs Zapier vs Make: Which Automation Platform?",
    path: "/ai-automation/n8n-vs-zapier-vs-make/",
    type: "article",
    phase: 3,
    pillar: "ai-automation",
  },
  {
    id: "best-ai-automation-tools",
    title: "Best AI Automation Tools: How to Choose by Category",
    path: "/ai-automation/best-ai-automation-tools/",
    type: "article",
    phase: 3,
    pillar: "ai-automation",
  },

  /**
   * Phase 3 — the automation cluster's first single-product guide, approved
   * 2026-10-21.
   *
   * It sits under /ai-automation/ rather than in a /reviews/ hub because it is
   * not a review: there is no hands-on testing evidence, so it carries no
   * scores. What it is is the missing piece of the cluster's email tutorial —
   * that guide tells a reader to have an AI step draft a reply, and then has
   * nowhere to send them when they ask how the reply gets signed with their
   * real details instead of invented ones. This page answers that, and the
   * product it names is the one with a documented API for it.
   *
   * The vendor offered the site a complimentary Company Plan in connection
   * with editorial consideration, which is disclosed on the page itself and is
   * why its promotional links are marked `sponsored` at the point of use (see
   * ContentLink and src/lib/links.ts). It is not an affiliate page and must not
   * claim to be: `hasAffiliateLinks` is false in its frontmatter.
   */
  {
    id: "signatoro-email-signature-guide",
    title: "Signatoro Email Signature Guide: Setup, Pricing & AI Automation",
    path: "/ai-automation/signatoro-email-signature-guide/",
    type: "article",
    phase: 3,
    pillar: "ai-automation",
  },

  /**
   * Phase 3 — the AI News hub and its first story, approved by the owner on
   * 2026-10-26.
   *
   * The eighth pillar, and the only one organised by *when* rather than by
   * what: every other hub answers a question that will read the same in six
   * months, and this one covers what changed last week. That is a different
   * editorial contract, so it gets its own top-level segment rather than
   * scattering dated stories through the evergreen clusters, where they would
   * age badly next to guides that are kept current.
   *
   * It is not a syndication feed and must not become one. The hub earns its
   * place only while each story does the thing the wire copy does not: say what
   * is actually confirmed, what was retracted, and what a small business owner
   * should do on Monday morning. Stories that cannot clear that bar belong
   * nowhere on this site — a dated page nobody can act on is the thinnest page
   * there is, whatever the traffic looks like on the day it ships.
   *
   * On search: "AI news" as a head term belongs to the trade press and is not
   * winnable here, which is why the hub is built as a navigational and
   * freshness surface and the individual stories carry the search load on their
   * own named subjects. See src/config/seo-snippets.ts for how each is targeted.
   */
  {
    id: "ai-news",
    title: "AI News",
    path: "/ai-news/",
    type: "pillar",
    phase: 3,
  },
  /**
   * The hub's first story: two critical PHP flaws found with frontier AI
   * models, disclosed 2026-10-21 and exploited in the wild within days.
   *
   * It belongs on this site rather than on a security blog because of the AI
   * half of it — AI compressed a decade-old theoretical flaw into a working
   * exploit chain in a week — and because the readership runs WordPress,
   * Drupal and Joomla sites, all three of which Wiz confirmed pre-auth RCE
   * against. It also carries the correction the day-one coverage does not:
   * Unit 42 retracted its agentic-AI post-exploitation claim on 2026-10-25.
   */
  {
    id: "php2shell-ai-found-php-flaw",
    title: "PHP2Shell: AI Found a Critical Flaw in PHP",
    path: "/ai-news/php2shell-ai-found-php-flaw/",
    type: "article",
    phase: 3,
    pillar: "ai-news",
  },

  /**
   * Phase 3 — the business pillar's "which setup, and on whose terms" batch,
   * approved by the owner on 2026-10-27 off live-SERP keyword research.
   *
   * All three sit under /ai-business-tools/ because all three are decisions a
   * reader makes about their own account before any tool comparison matters:
   * what to move a retiring custom GPT to, which ChatGPT tier to buy, and what
   * to tell a client about either. Every one of these SERPs is currently held
   * by pages with no authority at all — vendor blogs, Medium posts and
   * template farms — which is why they were picked ahead of the head terms in
   * the same research.
   *
   * The deliberate omission from that research: a standalone "Claude Pro vs
   * Team" page. claude-for-small-business already carries the full Claude plan
   * ladder and claude-vs-chatgpt-for-small-business already carries a pricing
   * section, so a third page on Claude tiers would be the near-duplicate
   * AGENTS.md forbids. Flagged to the owner rather than shipped.
   */

  /**
   * The one page in this batch with a deadline on it. OpenAI announced the
   * retirement of custom GPTs on 11 September 2026; creation of new ones ended
   * 26 October 2026, and existing GPTs and their GPT pages stop working on
   * 11 December 2026 (11 February 2027 for FedRAMP and approved Enterprise
   * deferrals). Anyone running a small business on a custom GPT has weeks, not
   * months, and the coverage that owns this query is written for IT
   * departments migrating dozens of them.
   *
   * It belongs under /ai-business-tools/ rather than /ai-news/ because the
   * story is not the announcement — it is a decision the reader has to make
   * about their own account, and the page stays useful after the deadline as
   * the explanation of what replaced GPTs. Needs reviewing on 11 December,
   * when the present tense in it becomes past tense.
   */
  {
    id: "custom-gpts-retiring",
    title: "Custom GPTs Are Retiring: What to Do Before 11 December",
    path: "/ai-business-tools/custom-gpts-retiring/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },

  /**
   * The tier decision inside one vendor, kept distinct from
   * claude-vs-chatgpt-for-small-business by what it is about: that page answers
   * which assistant, this one answers whose account the work happens in and
   * what the default training setting is on it. Zero H2 overlap, and the
   * cross-vendor question is a link out rather than a section here.
   *
   * It deliberately prints no dollar figures. OpenAI reprices these tiers and
   * renames them (Team became Business), so the durable half of the answer is
   * the billing model — per seat, seat minimum, annual versus monthly — plus
   * the one rule that decides it. The page says that it is doing this and
   * sends the reader to the pricing page for today's numbers.
   */
  {
    id: "chatgpt-business-vs-plus",
    title: "ChatGPT Business vs Plus: Which Plan Do You Need?",
    path: "/ai-business-tools/chatgpt-business-vs-plus/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },

  /**
   * The site's first page on the trust and disclosure side of AI use, and the
   * start of closing a gap the 2026-10-20 research flagged: zero data-privacy
   * or professional-obligation coverage anywhere on the site, on a site whose
   * readers are the people with client contracts.
   *
   * The angle is a correction. Nearly every page ranking for this question
   * either says "you must disclose, the EU AI Act requires it" or "you never
   * have to" — and Article 50's text duty actually lands on AI-generated text
   * published on matters of public interest without human editorial review,
   * which is not what a freelancer writing a client's marketing copy is doing.
   * The real constraint for most readers is their own contract. That is the
   * page.
   */
  {
    id: "ai-disclosure-to-clients",
    title: "Do You Have to Tell Clients You Use AI?",
    path: "/ai-business-tools/ai-disclosure-to-clients/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },

  /**
   * Phase 3 — the rest of the 2026-10-27 research, approved by the owner on
   * 2026-10-28 and shipped as one batch across four pillars.
   *
   * Two of them finish the trust cluster the disclosure page started; two are
   * the site's own editorial angle written down as pages in their own right
   * ("what AI cannot do", "how much time it actually saves"); one is the
   * prompts pillar's first audience-specific set; one is the automation
   * pillar's missing money workflow. The common property that got them picked
   * is that no page currently ranking for any of them is published by anyone
   * with authority — they are vendor micro-sites, Medium posts, template farms
   * and prompt packs being sold for $37.
   */

  /**
   * The policy page, and the one the owner's research flagged as the clearest
   * download candidate. It deliberately ships without a download: public/
   * downloads/ holds only the brand presentation PDF and is not a content-asset
   * system, and a policy locked inside a PDF is a policy search engines cannot
   * read. The full text is on the page, copyable. If the owner later wants a
   * .docx, that is an asset task, not a content one.
   */
  {
    id: "ai-use-policy-template",
    title: "AI Use Policy Template for Small Business",
    path: "/ai-business-tools/ai-use-policy-template/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },

  /**
   * Sibling to ai-disclosure-to-clients and separated from it the same way the
   * Duet pair was: that page is about telling a client you used a tool, this
   * one is about the law on recording a conversation they are in. No shared
   * H2s and no shared FAQ question.
   *
   * It names the all-party consent states but refuses to present the list as
   * settled, because it is not — published lists disagree between eleven and
   * thirteen states, Oregon splits by medium and Montana takes notice rather
   * than consent. Saying so is more useful than a confident table, and it is
   * the one thing no vendor page on this query does.
   */
  {
    id: "ai-notetaker-consent",
    title: "AI Notetaker Consent: When You Have to Ask",
    path: "/ai-business-tools/ai-notetaker-consent/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },

  /**
   * The second half of the trust cluster approved on 2026-10-20. The policy
   * half shipped as ai-use-policy-template; this is the data-privacy half, and
   * until it existed the site had no page at all on what happens to data a
   * reader pastes into an assistant.
   *
   * Separated from chatgpt-business-vs-plus by question, not by keyword
   * variant: that page answers "which tier do I buy", and settles it on
   * account ownership rather than privacy. This one answers "what happens to
   * the data once it is in there" and never ranks or recommends a tier. The
   * training default is the one shared fact, and it is handled here as one row
   * of a five-route table before the page moves on, because the four routes
   * nobody writes about are the reason it exists.
   *
   * Its differentiator is the NYT preservation order, which no competing page
   * on this query carries: a court required OpenAI to keep logs its own policy
   * would have deleted, the order covered Free/Plus/Pro/Team (Team being
   * today's Business tier) while Enterprise, Edu and zero-retention API sat
   * outside, and on 2026-01-05 Judge Stein affirmed production of 20 million
   * de-identified conversations. That is the evidence for the page's actual
   * argument - a vendor deletion policy is a promise about the vendor's own
   * behaviour and a court can suspend it, so the only durable claim a small
   * business can make to a client is about what it keeps out of the tool.
   *
   * No prices, so no pricingVerifiedDate. OpenAI's policy pages return 403 to
   * automated fetching, so every vendor-side fact is corroborated across
   * independent write-ups and the page says so in a callout rather than
   * implying it quotes the source.
   */
  {
    id: "is-chatgpt-safe-for-business-data",
    title: "Is ChatGPT Safe for Business Data?",
    path: "/ai-business-tools/is-chatgpt-safe-for-business-data/",
    type: "article",
    phase: 3,
    pillar: "ai-business-tools",
  },

  /**
   * The house angle as a page. /getting-started/ already tells a reader how to
   * begin; this is the other half of that conversation, and the pillar has
   * never had anywhere to put it. Kept distinct from
   * how-much-time-does-ai-save by subject: this one is about capability — the
   * jobs that stay human — and that one is about measurement.
   */
  {
    id: "what-ai-cannot-do",
    title: "What AI Cannot Do for a Small Business",
    path: "/getting-started/what-ai-cannot-do/",
    type: "article",
    phase: 3,
    pillar: "getting-started",
  },

  /**
   * The prompts pillar's first set written for one audience rather than one
   * task, and the bridge to the freelancer traffic the research found. Every
   * result on this query is either a Medium listicle or a prompt pack for
   * sale, so the differentiator is the opposite of volume: a small number of
   * prompts for the conversations that actually cost money, with the judgement
   * left in the reader's hands.
   *
   * Scoped around an overlap found during the build, not before it.
   * chatgpt-prompts-for-small-business already owns "Quotes, pricing, and
   * proposals" and "Invoices, chasing, and money conversations", so this page
   * deliberately carries neither. What it owns instead is the set of
   * conversations a freelancer has and an owner with customers does not —
   * scope creep on a fixed price, raising a rate on an existing client, a
   * vague brief, saying no, and ending an engagement. It says so on the page
   * and links out for the two it excludes, so the pair do not bid against each
   * other.
   */
  {
    id: "ai-prompts-for-freelancers",
    title: "AI Prompts for Freelancers: Scope, Rates & Client Emails",
    path: "/ai-prompts/ai-prompts-for-freelancers/",
    type: "article",
    phase: 3,
    pillar: "ai-prompts",
  },

  /**
   * The automation cluster had an email tutorial and a customer-service
   * tutorial and nothing about money. This is that page, and its SERP is the
   * weakest the research turned up: every result is a vendor micro-site
   * selling invoice-chasing software, with no editorial page anywhere.
   *
   * Its honest finding is the one those vendors cannot print — most accounting
   * apps emit no "invoice became overdue" event, so the reliable build is a
   * daily scheduled check rather than the trigger people look for and fail to
   * find.
   */
  {
    id: "automate-invoice-follow-up",
    title: "How to Automate Invoice Follow-Up With AI",
    path: "/ai-automation/automate-invoice-follow-up/",
    type: "article",
    phase: 3,
    pillar: "ai-automation",
  },

  /**
   * The counterpart to the free email time-savings calculator, which has
   * always needed a page explaining what the published time-savings figures
   * are actually worth. It sits under /ai-automation/ for that reason: the
   * calculator is in this cluster, and the honest answer to the question ends
   * in "measure your own", which is what the calculator is for.
   */
  {
    id: "how-much-time-does-ai-save",
    title: "How Much Time Does AI Actually Save a Small Business?",
    path: "/ai-automation/how-much-time-does-ai-save/",
    type: "article",
    phase: 3,
    pillar: "ai-automation",
  },

  /**
   * Phase 3 — the site's first published dataset, and a third page type in
   * practice: not a guide, not a calculator, but a structured record.
   *
   * It exists because the site already had the data and was wasting it. A dozen
   * guides each publish vendor list prices with their own verification date,
   * written as prose and scattered across three clusters, so no reader could
   * compare billing models across vendors or tell which figures were fresh.
   * This page consolidates every one of those figures into one dated, sortable,
   * machine-readable table (src/data/ai-tool-pricing.ts) and publishes the
   * findings computed from it. It adds no new price claims: a row may only
   * restate a figure a page on this site already published.
   *
   * Registered as `type: "tool"` rather than "article" because that is what it
   * behaves like — a utility with supporting editorial copy, carrying
   * WebApplication-style schema and no Article schema, rendered from the
   * `tools` collection. It also emits Dataset schema and ships a JSON
   * distribution at /ai-tool-pricing.json, which is the part that makes it
   * citable rather than merely readable.
   *
   * It sits in /ai-business-tools/ with the cost calculator, because the
   * budgeting intent it serves already lives there and the two answer halves of
   * the same question: this page says what vendors charge, the calculator totals
   * what your own stack costs.
   */
  {
    id: "ai-tool-pricing-tracker",
    title: "AI Tool Pricing Tracker: Verified List Prices",
    path: "/ai-business-tools/ai-tool-pricing-tracker/",
    type: "tool",
    phase: 3,
    pillar: "ai-business-tools",
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
        if (!page.pillar) {
          problems.push(`${page.id}: articles need a pillar`);
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
        /**
         * A free interactive utility. It lives either inside a content cluster
         * (/[pillar]/[slug]/, so it inherits that cluster's breadcrumb, sidebar
         * and internal links) or at the top level as its own hub (a future
         * /tool-finder/). Both shapes are checked here; a tool declaring a
         * `pillar` must actually sit under it.
         */
        if (page.pillar) {
          if (!page.path.startsWith(`/${page.pillar}/`) || segments.length !== 2) {
            problems.push(`${page.id}: tool path must be /${page.pillar}/[slug]/`);
          }
        } else if (segments.length !== 1) {
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
