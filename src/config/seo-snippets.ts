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
    title: "6 Best AI Writing Tools for 2026, Compared by Use Case",
    brand: "omit",
    primaryKeyword: "best AI writing tools",
    supportingKeywords: [
      "AI writing tools 2026",
      "AI writing tools comparison",
      "free AI writing tools",
    ],
    intent: "Commercial",
    note: 'Every page ranking for this query leads with a count ("The 6 Best…", "8 AI writing tools compared", "10 Best…"), and the old title led with nothing — the brand suffix took the characters a number would have. Six is the real number of tools on the page and "Compared by Use Case" is what the page does. "free AI writing tools" is a high-demand variant the page already answers in its own FAQ (ChatGPT, Claude and Grammarly free plans, Notion AI trial), so it needs no page of its own.',
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
    title: "AI Copywriting Tools: How to Choose the Right One",
    brand: "omit",
    primaryKeyword: "how to choose an AI copywriting tool",
    supportingKeywords: [
      "best AI copywriting tools",
      "AI copywriting software",
      "AI tools for sales copy",
    ],
    intent: "Info / Commercial",
    /**
     * A deliberate retarget, not a demotion. "best AI copywriting tools" returns
     * ranked listicles end to end — "19 Best … (Ranked & Compared)", "The 10 Best
     * …: Features, Pricing, and Verdicts", "Tested & Ranked" — and this page is
     * not one and must not become one: it gives no scores and no rankings on
     * purpose, because the site has no testing evidence for them. A title
     * promising "best" would win a click and lose the reader. What the page
     * actually delivers is the criteria, the tool categories, and a one-week way
     * to test a shortlist, which is a different and winnable query. The head term
     * stays as a supporting keyword, so the page still serves it.
     */
    note: 'Was targeting "best AI copywriting tools" with a page that has no ranked list; that SERP is all numbered listicles and the page gives no scores by design. Retargeted at the question it does answer, which its own H2s ("The criteria that separate them", "A one-week way to test a shortlist") deliver. The page\'s own title was changed with it, in the registry and in its frontmatter, so the <h1>, the cards, the breadcrumb label and Article.headline stopped claiming "Best" too — headline comes from the registry title, not from this override, so a snippet change alone would have left the claim in the structured data. Inbound anchor text in other entries still reads "best AI copywriting tools" deliberately: that is how the topic is referred to mid-sentence and it keeps the relevance signal for the supporting keyword, which is a different thing from the page calling itself the best.',
  },
  "ai-tools-for-blog-writing": {
    title: "AI Tools for Blog Writing: Workflow, Limits & Refreshes",
    brand: "omit",
    primaryKeyword: "AI tools for blog writing",
    supportingKeywords: ["AI tools for blog posts", "AI blog writing workflow"],
    intent: "Info / Commercial",
    note: 'The old title was the bare keyword plus the brand suffix and promised nothing a competing listicle does not. The three nouns are the page\'s three strongest sections, including the refresh section it calls the highest-value use of AI on an existing blog — and "refreshes" is a promise no competitor in this SERP makes. "AI tools for blog posts" replaces "AI for blog posts": it is the variant that actually autocompletes.',
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
    title: "11 Best AI Tools for Small Business in 2026, by Use Case",
    brand: "omit",
    primaryKeyword: "best AI tools for small business",
    supportingKeywords: [
      "best AI tools for small business owners",
      "AI software for small business",
      "free AI tools for small business",
      "best AI tools for small business automation",
    ],
    intent: "Commercial",
    note: 'Rendered at 77 characters and truncated mid-phrase; the "Best … in 2026" framing also separates it from the task-led use-case guide at /ai-by-industry/ai-tools-for-small-business/. Now leads with the count, because every result on page one of this query does ("10 best", "12 Best", "15 Best", "18 best", "25 Best") and a title without one reads as the shorter list. Eleven is the real number of tools, already stated in the description. The two added keywords are both answered on the page — a free-plans FAQ naming eight tools with free tiers, and a "Connecting everything" section for automation — so neither needs a page of its own.',
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
      "how much does AI cost per month",
    ],
    intent: "Transactional",
    note: 'Dropping "for" matches the observed Search Console query verbatim and reads identically. "2026 Prices" signals the freshness this query wants and is accurate: every price on the page is vendor-checked and dated. "AI software" in the description serves the ai-software-pricing query without a second page. "per month" is the strongest autocomplete variant of the head term and the description already answers it in those words ("$100+ a month"), so the page needs no change to serve it.',
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
      "claude for small business owners",
    ],
    intent: "Info / Commercial",
    note: 'The old description opened on "Explore", spending the first word on nothing, and repeated the keyword mid-sentence. The page has dedicated sections for limits and for cost that the old title never advertised. Also covers the plural query variant without a second page.',
  },
  "claude-vs-chatgpt-for-small-business": {
    brand: "omit",
    description:
      "Claude vs ChatGPT for small business in 2026, compared across real daily workflows: documents, support, spreadsheets, integrations, team plans and pricing.",
    primaryKeyword: "claude vs chatgpt for small business",
    supportingKeywords: [
      "claude or chatgpt for business",
      "claude vs chatgpt pricing",
      "claude vs chatgpt which is better",
    ],
    intent: "Commercial",
    /**
     * The year goes in the description, not the title. Every result on page one
     * of this query carries 2026 in its title, so the freshness cue is worth
     * having — but the title is already 54 characters and "Which Is Better?" is
     * the part that matches the question being asked. Adding the year there
     * would push it to 62 and put the answer-promise in the truncation zone,
     * which trades the stronger signal for the weaker one.
     */
    note: 'Title wording is good; it only truncated at 72 characters because of the brand suffix, and dropping the suffix fixes it with no copy change. The description now carries "in 2026" — accurate (published and price-checked in October 2026) and the freshness cue this SERP is saturated with — at the cost of "current" before "pricing", which the date already implies.',
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
    primaryKeyword: "AI automation for small business",
    supportingKeywords: [
      "AI workflow automation for small business",
      "AI automation tools for small business",
      "AI automation use cases",
    ],
    intent: "Informational",
    /**
     * Retargeted off the bare head term. "AI automation" on its own is a career
     * query — every autocomplete variant is jobs, agency, course, specialist,
     * engineer or certification — and this hub explains what AI automation is
     * and how to build it, which is not what those searchers want. The qualified
     * term was already a supporting keyword here; it is simply the honest
     * primary, and the title has said so since it gained the audience qualifier.
     */
    note: 'Hub title gains the audience qualifier; the visible <h1> is unchanged. Primary moved from "AI automation" to the qualified term: the bare head term is dominated by job and agency intent this hub does not serve, while the qualified term matches both the title and the page.',
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
    title: "7 AI Workflows for Solopreneurs & Freelancers",
    brand: "omit",
    primaryKeyword: "AI workflows for solopreneurs",
    supportingKeywords: [
      "AI workflows for freelancers",
      "AI automation for freelancers",
      "AI tools for freelancers",
      "solopreneur AI setup",
    ],
    intent: "Info / Commercial",
    /**
     * "solopreneur" has almost no autocomplete surface of its own — the phrase
     * returns no suggestions at all, which is as close to a demand signal as a
     * free tool gives. "freelancer" does: AI tools, AI automation and AI agents
     * for freelancers all autocomplete. The page serves both audiences
     * identically — its seven workflows are email, content, invoicing,
     * scheduling, research, social and support, and invoicing in particular is
     * freelancer work — so naming the second audience in the title costs the
     * page nothing and reaches a query that is actually searched.
     */
    note: 'Dropped "best" from the primary keyword rather than from the title, which never claimed it: the page is seven workflows, not a ranked list. The count now leads, and "& Freelancers" reaches the audience term with demand — "solopreneur" autocompletes to nothing.',
  },
  "how-to-automate-email-with-ai": {
    primaryKeyword: "how to automate email responses with AI",
    supportingKeywords: [
      "AI email automation",
      "automate Gmail replies with AI",
      "how to automate Outlook emails with AI",
    ],
    intent: "Informational",
    note: 'Title 57 characters, description 151. No change — the title is already the verbatim autocomplete variant of this query. Outlook added as a supporting keyword because it autocompletes separately from Gmail and the page has a full method for it ("Method 2: Outlook and Power Automate"), which the description already names.',
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
      "email automation break-even calculator",
      "hours saved on email per month",
    ],
    intent: "Informational",
    /**
     * "email automation roi for small business" was dropped from the supporting
     * list: its autocomplete surface is email *marketing* ROI — campaign open
     * rates and revenue per send — which is a different product and a different
     * reader. This calculator models reply and triage time, so chasing that
     * query would bring in traffic the page cannot serve. The two replacements
     * are figures the calculator actually returns: a break-even monthly email
     * volume and monthly hours saved.
     */
    note: 'The <h1> is "AI Email Time Savings & ROI Calculator"; the search title drops the ampersand, which search results render inconsistently, and leads on the saving a searcher is looking for. "Free" is factually true — no sign-up, runs in the browser — and is the first thing a searcher decides. The brand suffix is dropped because the title is 46 characters and the suffix would push it to 64. The ROI framing is carried in the title rather than the description so the description can spend its length on the three inputs that make this calculator different from a naive savings estimate: manual reply time, human review time, and software cost.',
  },

  // ---- AI Agents cluster -------------------------------------------------
  /**
   * The newest cluster, and the one whose SERP is least trustworthy: on the
   * head term and on every commercial variant of it, the ranking results are
   * published by companies selling an agent. That shapes the metadata here. The
   * titles lead on the distinction and the limits rather than on a ranking,
   * because "independent" is the only thing this cluster can offer that the
   * incumbents structurally cannot.
   */
  "ai-agents": {
    title: "AI Agents: What They Are & When to Use One",
    brand: "omit",
    primaryKeyword: "AI agents",
    supportingKeywords: ["what are AI agents", "AI agents explained", "AI agents for business"],
    intent: "Informational",
    note: 'The hub <h1> stays "AI Agents" — 9 characters, and nothing a searcher can act on. The head term is extremely broad and much of it is developer intent (frameworks, SDKs, building one); "When to Use One" points the title at the operator rather than the builder, which is who the page is written for. "what are AI agents" is kept as a supporting keyword rather than given its own page on purpose: the hub answers it in its first section, and a separate definition page would compete with the hub for the same query.',
  },
  "best-ai-agents-for-small-business": {
    title: "Best AI Agents for Small Business: How to Choose",
    brand: "omit",
    primaryKeyword: "best AI agents for small business",
    supportingKeywords: [
      "AI agents for small business",
      "AI agent tools for business",
      "AI agent pricing",
      "AI agents for customer support",
    ],
    intent: "Commercial",
    /**
     * The title deliberately does not promise a ranked list, and the page does
     * not contain one. Every competing result does, and all of them are vendor
     * blogs ranking their own product first. A numbered list here would be
     * either dishonest — this site has no hands-on testing evidence for agent
     * products — or a copy of theirs. Selection criteria plus categories is
     * what the page can actually stand behind, so that is what the snippet
     * sells. It costs some clicks from searchers who wanted a table.
     */
    note: 'Rendered at 48 characters. "How to Choose" rather than a number, because the page is criteria and categories rather than a ranking — there is no hands-on testing behind this cluster, and a ranked table would imply there is. The pricing variant is worth keeping: agent products are priced per resolution or per run far more often than per seat, which the page explains and which is the detail that surprises buyers.',
  },
  "ai-agents-vs-automation": {
    title: "AI Agents vs Automation: The Real Difference",
    brand: "omit",
    primaryKeyword: "AI agents vs automation",
    supportingKeywords: [
      "AI agent vs workflow automation",
      "difference between AI agent and automation",
      "AI agents vs RPA",
      "do I need an AI agent or an automation",
    ],
    intent: "Informational",
    note: "Rendered at 44 characters. The most useful page in the cluster and the one most likely to earn links, because the distinction is genuinely muddled in the market and the honest answer — most people searching for an agent want a workflow — is one no vendor will publish. It is also the cluster's main bridge into /ai-automation/, which is where a large share of this traffic should end up.",
  },
  "ai-agent-use-cases": {
    title: "AI Agent Use Cases: 8 Jobs Worth Handing Over",
    brand: "omit",
    primaryKeyword: "AI agent use cases",
    supportingKeywords: [
      "AI agent examples",
      "what can AI agents do",
      "AI agent use cases for business",
      "real world AI agent examples",
    ],
    intent: "Informational",
    note: 'Rendered at 45 characters. Eight is the real count of task sections on the page. "Worth Handing Over" is doing the same filtering job as "for Work" on the prompt-examples page: this query returns a lot of enterprise and developer content, and the page is written for an owner deciding which of their own tasks to delegate. Each section states the supervision the task still needs, which is what separates it from the example lists that dominate this SERP.',
  },

  // ---- Getting Started cluster -------------------------------------------
  "getting-started": {
    title: "Getting Started with AI: A Small Business Guide",
    brand: "omit",
    primaryKeyword: "how to start using AI in a small business",
    supportingKeywords: [
      "getting started with AI",
      "how to start using AI",
      "AI basics for business",
    ],
    intent: "Informational",
    /**
     * "getting started with AI" is a navigational collision, not a topic: its
     * autocomplete is almost entirely other products that begin with the same
     * letters — Airbnb, Airtable, Airflow, AirPods — plus "AI agents", which is
     * a different subject. The hub is a first-month guide for a small business
     * owner, so the primary is the qualified query it can actually answer. The
     * bare term stays supporting; the title already carries both.
     */
    note: 'Hub title gains the audience qualifier; the visible <h1> is unchanged. Primary moved to the qualified query: the bare "getting started with AI" autocompletes mostly to unrelated "air…" products and to AI agents, so it is not a term this hub should be measured against.',
  },
  "how-to-use-ai-tools": {
    brand: "omit",
    primaryKeyword: "how to use AI tools",
    supportingKeywords: [
      "how to use AI tools effectively",
      "how to use AI tools at work",
      "how to use AI for work",
      "AI tools beginner guide",
    ],
    intent: "Informational",
    note: "Title and description are both good; the page only truncated at 71 characters because of the brand suffix. Dropping it fixes the title with no copy change. The two added keywords are the strongest autocomplete variants of the head term and both describe this page exactly — it is a working process for using AI on real work tasks, not a tool list.",
  },
  "how-to-write-effective-ai-prompts": {
    brand: "omit",
    primaryKeyword: "how to write effective AI prompts",
    supportingKeywords: [
      "how to write good AI prompts",
      "how to write AI prompts",
      "prompt writing guide",
    ],
    intent: "Informational",
    note: 'Same as above: 75 characters rendered, entirely from the suffix. Copy unchanged. "good" rather than "effective" is the variant people actually type — it autocompletes where "effective" barely does — and the page answers the identical question, so it is a supporting keyword rather than a retarget.',
  },
  "ai-tools-for-beginners": {
    primaryKeyword: "AI tools for beginners",
    supportingKeywords: [
      "best AI tools for beginners",
      "AI tools for beginners 2026",
      "free AI tools for beginners",
      "first AI tool to try",
    ],
    intent: "Info / Commercial",
    note: 'Title 56 characters, description 153. No change. Both added keywords are already answered on the page — it has a "Free versus paid" section, and the description names free versus paid explicitly — so neither is a promise the page cannot keep.',
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
    supportingKeywords: [
      "AI for marketing teams",
      "AI tools for marketing teams",
      "AI tools for marketing research",
      "AI tools for marketing content creation",
      "AI marketing workflows",
    ],
    intent: "Informational",
    note: 'Rendered at 75 characters. Shortening "Practical Use Cases and Workflows" to "Use Cases & Workflows" keeps the meaning at 45 characters. The marketing head term has an unusually deep modifier set in autocomplete; the three added here are the ones with their own H2s on the page ("Research", "Drafting copy", "Repurposing content"). "and sales" and "agencies" autocomplete too and are deliberately absent: the page covers neither.',
  },
  "ai-tools-for-ecommerce": {
    title: "AI Tools for E-commerce: Practical Use Cases",
    brand: "omit",
    primaryKeyword: "AI tools for e-commerce",
    supportingKeywords: [
      "AI tools for ecommerce business",
      "AI tools for ecommerce marketing",
      "AI for online stores",
      "AI ecommerce use cases",
    ],
    intent: "Informational",
    note: 'Rendered at 67 characters. "Practical Ways to Use AI" duplicates what "AI Tools for E-commerce" already says; "Practical Use Cases" is shorter and clearer. Both added keywords use the unhyphenated "ecommerce", which is how autocomplete returns every variant of this query and how the URL slug is already written; the hyphenated form stays in the title because it reads better and Google treats the two as the same word.',
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
    title: "AI Prompt Examples for Work: 10 Tasks, Before & After",
    brand: "omit",
    primaryKeyword: "AI prompt examples",
    supportingKeywords: ["AI prompts for business", "example AI prompts", "good AI prompts"],
    intent: "Informational",
    /**
     * The one case on this site where the title has to filter the SERP rather
     * than win all of it. "ai prompt examples" autocompletes almost entirely to
     * image generation — for images, for photo editing, for video, for portraits
     * — and this page is text prompts for office work, which its own first
     * section says ("Who this is for, and who it is not"). The term is still the
     * right primary: the page is a genuine answer for the text half of the
     * query, and no other page here owns it. But "for Work" in the title lets
     * the wrong half of the traffic self-select out before the click, which is
     * worth more than the impressions it costs.
     */
    note: 'Was the bare keyword plus the brand suffix at 36 characters, the shortest title on the site, with nothing in it a searcher could act on. "for Work" disambiguates from the image-generation intent that dominates this query; "10 Tasks" is the real count of numbered examples; "Before & After" is what the page shows for each one, already described as the thin version and the rewritten version.',
  },
  "chatgpt-prompts-for-small-business": {
    primaryKeyword: "ChatGPT prompts for small business",
    supportingKeywords: [
      "best ChatGPT prompts for small business",
      "ChatGPT prompts for business owners",
      "business ChatGPT prompts",
    ],
    intent: "Info / Commercial",
    note: 'Title 58 characters, description 147. No change — the title is the verbatim head term and there is no room for a modifier. "best …" is added as a supporting keyword because it autocompletes alongside the head term and resolves to the same page; the title does not claim it, which is correct for a task-grouped set of prompts rather than a ranked list.',
  },
  "ai-prompts-for-content-writing": {
    primaryKeyword: "AI prompts for content writing",
    supportingKeywords: [
      "AI prompts for article writing",
      "best AI prompts for content writing",
      "AI prompts for writers",
      "AI editing prompts",
    ],
    intent: "Informational",
    note: 'Title 60 characters, description 144. No change. "article writing" is a near-equal autocomplete sibling of "content writing" on this query and the page serves both without a word of change; adding it here records that rather than inviting a second, near-duplicate page.',
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
