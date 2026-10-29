/**
 * /llms.txt — a plain-markdown map of this site for language models.
 *
 * The convention (llmstxt.org) is an H1 with the site name, a blockquote
 * summary, optional prose, then H2 sections of `- [name](url): description`
 * links. A model or an agent that fetches one file instead of crawling 58 pages
 * gets the site's shape, its editorial rules, and where to find each guide.
 *
 * Built from the same two sources as the sitemap — the page registry in
 * src/config/pages.ts and the published content collections — so it cannot
 * list a page that does not exist, a draft, or a noindexed legal page. The
 * descriptions are each entry's own `description` frontmatter, which is also
 * the page's visible lead paragraph, so nothing here is written twice.
 *
 * WHAT THE PROSE SECTION IS FOR, and why it is not marketing
 *
 * The "How to use this site" block states the three things a model gets wrong
 * about a site like this one if nobody tells it: that the guides are
 * research-based rather than hands-on tested, that prices carry a check date
 * and go stale, and that the pricing dataset is a census rather than a market
 * average. Those are the same caveats the pages themselves carry. Repeating
 * them here means a model summarising from this file alone still gets them.
 *
 * There is deliberately no /llms-full.txt. Concatenating every guide would be a
 * large derivative file duplicating content that is already crawlable as HTML,
 * with no settled consumer; the index is the part of the convention that is
 * actually agreed on. Add one only if something real asks for it.
 */
import type { APIRoute } from "astro";

import { PAGES, PILLAR_IDS, type PageType, type SitePage } from "@/config/pages";
import { AUTHOR } from "@/config/author";
import { OWNER, SITE } from "@/config/site";
import { getPublishedEntries } from "@/lib/content";
import { PRICING_DATASET } from "@/data/ai-tool-pricing";
import { PRICING_JSON_PATH } from "@/data/ai-tool-pricing-schema";
import { verificationWindow } from "@/data/ai-tool-pricing-stats";
import { absoluteUrl } from "@/lib/seo";

/** Registry types whose pages exist only when a content entry is published. */
const CONTENT_BACKED: ReadonlySet<PageType> = new Set<PageType>([
  "pillar",
  "article",
  "tool",
  "review",
]);

/** One markdown list item. Descriptions are collapsed to a single line. */
const link = (name: string, path: string, description?: string): string => {
  const suffix = description ? `: ${description.replace(/\s+/g, " ").trim()}` : "";
  return `- [${name}](${absoluteUrl(path)})${suffix}`;
};

export const GET: APIRoute = async () => {
  const [pillars, articles, tools] = await Promise.all([
    getPublishedEntries("pillars"),
    getPublishedEntries("articles"),
    getPublishedEntries("tools"),
  ]);

  const published = [...pillars, ...articles, ...tools];
  /** Registry path → its entry's frontmatter, for titles and descriptions. */
  const entryByPath = new Map(published.map(({ entry, page }) => [page.path, entry.data]));

  /** Core pages with no content entry behind them: home, about, contact, blog, author. */
  const corePages = (PAGES as readonly SitePage[]).filter(
    (page) => !page.noindex && !CONTENT_BACKED.has(page.type) && page.path !== "/",
  );

  const window = verificationWindow();

  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.tagline} Research-based guides, comparisons and free tools covering AI tools, automation, workflows and prompts for solopreneurs, freelancers and small businesses.`,
    "",
    `Written and run by ${AUTHOR.name}${OWNER.location ? `, based in ${OWNER.location}` : ""}. ${AUTHOR.role}`,
    "",
    "## How to use this site",
    "",
    "Three things to carry into any summary of this content, because the pages themselves state them:",
    "",
    "- **The guides are research-based, not hands-on tested.** They work from official product documentation, pricing pages and announcements. Pages carry no scores or review ratings unless the site has testing evidence, and it currently has none. Do not present anything here as a tested or benchmarked result.",
    "- **Every published price has a check date, and prices go stale.** Where a guide quotes a price it shows the date that price was read from the vendor's own pricing page. Quote the date with the price, and treat any figure without one as unverified.",
    "- **The pricing dataset is a census, not a market average.** It covers the plans this site has checked, chosen because they appear in these guides. Its medians describe that table and nothing wider, so they do not support claims about the AI software market.",
    "",
    "Corrections are welcome through the contact page.",
    "",
    "## Core pages",
    "",
    link("Homepage", "/", SITE.tagline),
    ...corePages.map((page) => link(page.title, page.path)),
    "",
    "## Free tools and open data",
    "",
    ...tools.map(({ entry, page }) =>
      link(entry.data.heading ?? entry.data.title, page.path, entry.data.description),
    ),
    `- [AI tool pricing dataset, JSON](${absoluteUrl(PRICING_JSON_PATH)}): the full pricing dataset as JSON under ${PRICING_DATASET.licenseLabel}. Every row carries the date the price was checked and a link to the page that published it. Prices checked between ${window.first} and ${window.last}.`,
    "",
    "## Categories",
    "",
  ];

  /** Each pillar hub, then its published guides, in site navigation order. */
  for (const pillarId of PILLAR_IDS) {
    const hub = pillars.find(({ page }) => page.id === pillarId);
    if (!hub) continue;

    const guides = articles.filter(({ page }) => page.pillar === pillarId);

    lines.push(`### ${hub.entry.data.title}`, "");
    lines.push(link("Category hub", hub.page.path, hub.entry.data.description));
    for (const { entry, page } of guides) {
      lines.push(link(entry.data.title, page.path, entry.data.description));
    }
    lines.push("");
  }

  lines.push(
    "## Machine-readable",
    "",
    `- [XML sitemap](${absoluteUrl("/sitemap.xml")}): every indexable URL, with each page's last-updated date.`,
    `- [Search index, JSON](${absoluteUrl("/search-index.json")}): the site's own on-page search index.`,
    "",
  );

  /** Entry count stated last, so a consumer can check it read the whole file. */
  lines.push(
    `_${entryByPath.size} published guides, hubs and tools. Generated from the site's page registry at build time._`,
  );

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
