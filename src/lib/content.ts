/**
 * Content collection access for page routes. Each entry maps to exactly one
 * approved registry page; its URL always comes from src/config/pages.ts.
 */
import { getCollection, type CollectionEntry } from "astro:content";
import { PAGES, getPage, type SitePage } from "@/config/pages";

const registryIndex = (page: SitePage) => PAGES.findIndex((p) => p.id === page.id);

export type EntryCollection = "pillars" | "articles";

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
