/**
 * Site navigation. Labels follow website-blueprint.jsx; only live pages are
 * linked (no Tool Finder, Prompt Library, Blog, or Resources column yet).
 * Getting Started leads: it is the top-of-funnel entry point for beginners.
 */
import { PAGES, getPage, type PageId, type PillarId, type SitePage } from "./pages";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavSection extends NavLink {
  pillar: PillarId;
}

const link = (label: string, id: PageId): NavLink => ({ label, href: getPage(id).path });

const section = (label: string, pillar: PillarId): NavSection => ({
  ...link(label, pillar),
  pillar,
});

export const PRIMARY_NAV: readonly NavSection[] = [
  section("Getting Started", "getting-started"),
  section("AI Writing Tools", "ai-writing-tools"),
  section("Business & Productivity", "ai-business-tools"),
  section("Automation", "ai-automation"),
];

/**
 * Shorter dropdown labels where the page title is too long for the menu.
 * Only genuine overrides belong here: a label identical to the registry title
 * is dead weight now that registry titles track the frontmatter titles.
 */
const MENU_LABELS: Partial<Record<PageId, string>> = {
  "best-ai-writing-tools": "Best AI Writing Tools",
};

/**
 * Dropdown links for a pillar: its articles in registry order, limited to
 * pages that are actually built (published, non-draft content entries).
 */
export function getSectionLinks(pillar: PillarId, builtPageIds: ReadonlySet<string>): NavLink[] {
  return (PAGES as readonly SitePage[])
    .filter((page) => page.type === "article" && page.pillar === pillar)
    .filter((page) => builtPageIds.has(page.id))
    .map((page) => ({
      label: MENU_LABELS[page.id as PageId] ?? page.title,
      href: page.path,
    }));
}

export const FOOTER_NAV: readonly { heading: string; links: readonly NavLink[] }[] = [
  {
    heading: "Categories",
    links: PRIMARY_NAV,
  },
  {
    heading: "Company",
    links: [
      link("About", "about"),
      link("Contact", "contact"),
      link("Affiliate Disclosure", "affiliate-disclosure"),
      link("Privacy Policy", "privacy-policy"),
      link("Terms", "terms"),
    ],
  },
];
