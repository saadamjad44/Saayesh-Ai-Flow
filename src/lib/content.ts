/**
 * Content collection access for page routes. Each entry maps to exactly one
 * approved registry page; its URL always comes from src/config/pages.ts.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { PAGES, getPage, type SitePage } from "@/config/pages";
import type { MediaId } from "@/config/media";
import { getPillarPresentation, type PillarIconId } from "@/config/pillars";
import type { PillarId } from "@/config/pages";
import { readingMinutes } from "@/lib/format";
import { socialMediaId } from "@/lib/seo";

const registryIndex = (page: SitePage) => PAGES.findIndex((p) => p.id === page.id);

export type EntryCollection = "pillars" | "articles" | "tools";

export interface PublishedEntry<C extends EntryCollection> {
  entry: CollectionEntry<C>;
  page: SitePage;
}

/**
 * Non-draft entries paired with their registry page, in registry order.
 * Fails the build if two entries (drafts included) claim the same pageId, or if
 * an entry's title has drifted from its registry title.
 */
export async function getPublishedEntries<C extends EntryCollection>(
  collection: C,
): Promise<PublishedEntry<C>[]> {
  const entries = await getCollection(collection);
  const owners = new Map<string, string>();

  for (const entry of entries) {
    const owner = owners.get(entry.data.pageId);
    if (owner) {
      throw new Error(
        `Duplicate pageId "${entry.data.pageId}" in ${collection}: ${owner} and ${entry.id}`,
      );
    }
    owners.set(entry.data.pageId, entry.id);

    // Frontmatter is the authority for the user-facing title; the registry
    // feeds breadcrumbs, nav, and BreadcrumbList schema, so the two must agree.
    const page = getPage(entry.data.pageId);
    if (page.title !== entry.data.title) {
      throw new Error(
        `Title mismatch for "${entry.data.pageId}": ` +
          `${entry.id} frontmatter has "${entry.data.title}" but ` +
          `src/config/pages.ts has "${page.title}". ` +
          "The frontmatter title is authoritative — update the registry title to match.",
      );
    }
  }

  return entries
    .filter((entry) => !entry.data.draft)
    .map((entry) => ({ entry, page: getPage(entry.data.pageId) }))
    .sort((a, b) => registryIndex(a.page) - registryIndex(b.page));
}

/** Path segments of a registry path, e.g. "/a/b/" → ["a", "b"]. */
export function pathSegments(page: SitePage): string[] {
  return page.path.split("/").filter(Boolean);
}

/**
 * The shape every article listing on the site renders: the homepage's featured
 * and latest rows, the blog archive, and a pillar hub's guide list.
 *
 * Built in one place so a card cannot show a different title, date, or category
 * than the page it links to — every field is read from the entry's frontmatter
 * or the page registry, never written out again by the template.
 */
export interface ArticleCardData {
  title: string;
  path: string;
  description: string;
  /** The parent category hub, for the card's kicker. Absent on pillar cards. */
  category?: { title: string; path: string };
  published: Date;
  updated: Date;
  /** Category image, for the one lead card a listing shows. */
  mediaId: MediaId;
  /** Category glyph, for the grid and row cards, which carry no photo. */
  icon?: PillarIconId;
  /** Estimated minutes to read, from the entry's own body. */
  minutes: number;
}

/**
 * Card data for one published entry. `categories` maps a pillar id to its hub
 * title, which only the caller can supply — it comes from the pillar's own
 * frontmatter, not the registry, so the kicker matches the hub's <h1>.
 */
export function toArticleCard<C extends EntryCollection>(
  { entry, page }: PublishedEntry<C>,
  categories?: ReadonlyMap<string, string>,
): ArticleCardData {
  const categoryTitle = page.pillar ? categories?.get(page.pillar) : undefined;

  return {
    title: entry.data.title,
    path: page.path,
    description: entry.data.description,
    category:
      page.pillar && categoryTitle
        ? { title: categoryTitle, path: getPage(page.pillar).path }
        : undefined,
    published: entry.data.publishedDate,
    updated: entry.data.updatedDate,
    mediaId: socialMediaId(page),
    icon: page.pillar ? getPillarPresentation(page.pillar as PillarId).icon : undefined,
    minutes: readingMinutes(entry.body ?? ""),
  };
}
