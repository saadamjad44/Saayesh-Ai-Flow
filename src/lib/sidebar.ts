/**
 * Contextual navigation for pillar and article pages, assembled from the page
 * registry and the published content collections. Nothing here is hand-listed:
 * add an article to src/config/pages.ts with its MDX entry and it appears in
 * the sidebar of its pillar and of every sibling article automatically.
 */
import { PILLAR_NAV, getSectionLinks } from "@/config/navigation";
import { getPage, type PillarId, type SitePage } from "@/config/pages";
import { getPublishedEntries } from "@/lib/content";

export interface SidebarLink {
  label: string;
  href: string;
}

export interface SidebarSection {
  heading: string;
  /** Makes the heading itself a link, for sections that have a hub page. */
  headingHref?: string;
  /** Small label above the heading. */
  eyebrow?: string;
  links: readonly SidebarLink[];
}

export interface ContentSidebar {
  /** Accessible name for the <nav>, and the label on the mobile accordion. */
  label: string;
  sections: readonly SidebarSection[];
}

/** The pillar a page belongs to: itself for a pillar, its parent for an article. */
function pillarOf(page: SitePage): PillarId | undefined {
  if (page.type === "pillar") return page.id as PillarId;
  return page.pillar;
}

/**
 * Sidebar for a pillar or article page: that pillar's published articles, then
 * a compact list of the other pillars. Returns undefined for any other page,
 * so core and legal pages keep their single-column layout.
 */
export async function getContentSidebar(page: SitePage): Promise<ContentSidebar | undefined> {
  const pillarId = pillarOf(page);
  if (!pillarId) return undefined;

  const [pillars, articles] = await Promise.all([
    getPublishedEntries("pillars"),
    getPublishedEntries("articles"),
  ]);

  const builtPageIds = new Set(articles.map(({ page: article }) => article.id));
  const publishedPillarIds = new Set(pillars.map(({ page: pillar }) => pillar.id));

  const pillar = getPage(pillarId);
  const sections: SidebarSection[] = [
    {
      eyebrow: "In this category",
      heading: pillar.title,
      headingHref: pillar.path,
      links: getSectionLinks(pillarId, builtPageIds),
    },
  ];

  const otherPillars = PILLAR_NAV.filter(
    (entry) => entry.pillar !== pillarId && publishedPillarIds.has(entry.pillar),
  ).map(({ label, href }): SidebarLink => ({ label, href }));

  if (otherPillars.length > 0) {
    sections.push({ heading: "Explore other topics", links: otherPillars });
  }

  return { label: `${pillar.title} navigation`, sections };
}
