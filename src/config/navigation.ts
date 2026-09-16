/**
 * Phase 1 navigation. Labels follow website-blueprint.jsx; only live Phase 1
 * pages are linked (no Tool Finder, AI by Industry, Blog, or Resources column).
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
  section("AI Writing Tools", "ai-writing-tools"),
  section("Business & Productivity", "ai-business-tools"),
  section("Automation", "ai-automation"),
];

/** Shorter dropdown labels where the registry working title is too long for the menu. */
const MENU_LABELS: Partial<Record<PageId, string>> = {
  "best-ai-writing-tools": "Best AI Writing Tools",
  "best-ai-tools-for-small-business": "Best AI Tools for Small Business",
  "ai-tools-vs-virtual-assistant": "AI Tools vs Virtual Assistant",
  "best-ai-workflows-for-solopreneurs": "AI Workflows for Solopreneurs",
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
