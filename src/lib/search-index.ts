/**
 * Static search index, built once at build time and served as a flat JSON file
 * from /search-index.json.
 *
 * This is a plain local text index, not semantic or embedding search: the
 * browser downloads the file on first interaction with the search box and does
 * all matching and ranking itself. There is no API, no server, and no runtime
 * dependency of any kind.
 *
 * Everything in it comes from sources that already exist — the page registry in
 * src/config/pages.ts and the `pillars` / `articles` MDX collections — so there
 * is no second list of articles to keep in step. Noindexed pages (the legal
 * pages) are excluded, so search never surfaces what search engines are told to
 * ignore.
 */
import { render, type CollectionEntry } from "astro:content";

import { PAGES, getPage, type PageId, type SitePage } from "@/config/pages";
import { getPublishedEntries, type EntryCollection } from "@/lib/content";

export interface SearchDoc {
  title: string;
  description: string;
  /** Registry path, e.g. "/ai-prompts/ai-prompt-examples/". */
  url: string;
  /** Result label: the parent pillar for articles, else the kind of page. */
  category: string;
  /**
   * Extra match terms. Matched against, never rendered — the registry's
   * `primaryKeyword` is internal prioritization data and must stay off the page.
   */
  keywords: string[];
  /** H2/H3 text from the entry body, so a query can hit a section name. */
  headings: string[];
}

/** Most pages worth searching have a handful of sections; the rest is noise. */
const MAX_HEADINGS = 12;

/**
 * One-line purpose for the pages that have no MDX entry to read a description
 * from. These four are written here because their real descriptions live in
 * .astro frontmatter, which cannot be imported. Keep them short and factual.
 */
const STATIC_PAGE_SUMMARIES: Partial<Record<PageId, string>> = {
  home: "Research-based guides to AI writing tools, AI business tools, and AI automation workflows.",
  blog: "Every published guide on Saayesh AI Flow, newest first, plus links to each category.",
  about: "Who runs Saayesh AI Flow, and the editorial process behind every guide.",
  contact: "Send a question, a correction, or a suggestion for what to cover next.",
};

/** H2 and H3 text from a rendered entry, capped so the index stays small. */
async function entryHeadings(entry: CollectionEntry<EntryCollection>): Promise<string[]> {
  const { headings } = await render(entry);
  return headings
    .filter((heading) => heading.depth === 2 || heading.depth === 3)
    .map((heading) => heading.text.trim())
    .filter(Boolean)
    .slice(0, MAX_HEADINGS);
}

/** Pillar title for an article, used as its result label. */
function categoryOf(page: SitePage): string {
  if (page.pillar) return getPage(page.pillar).title;
  return page.type === "pillar" ? "Category" : "Page";
}

/**
 * Every searchable page, in registry order: the static core pages, then the
 * pillar hubs and their published articles.
 */
export async function buildSearchIndex(): Promise<SearchDoc[]> {
  const [pillars, articles] = await Promise.all([
    getPublishedEntries("pillars"),
    getPublishedEntries("articles"),
  ]);

  const staticDocs = (PAGES as readonly SitePage[])
    .filter((page) => !page.noindex && page.id in STATIC_PAGE_SUMMARIES)
    .map((page): SearchDoc => {
      const isHome = page.path === "/";
      return {
        title: isHome ? "Home" : page.title,
        description: STATIC_PAGE_SUMMARIES[page.id as PageId] ?? "",
        url: page.path,
        category: "Site",
        keywords: [],
        headings: [],
      };
    });

  const entryDocs = await Promise.all(
    [...pillars, ...articles].map(async ({ entry, page }): Promise<SearchDoc> => {
      const keywords = page.primaryKeyword ? [page.primaryKeyword] : [];
      return {
        title: entry.data.title,
        description: entry.data.description,
        url: page.path,
        category: categoryOf(page),
        keywords,
        headings: await entryHeadings(entry),
      };
    }),
  );

  // Registry order within each group; pillars ahead of their articles.
  return [...staticDocs, ...entryDocs];
}
