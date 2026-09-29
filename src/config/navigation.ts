/**
 * Site navigation.
 *
 * The header carries a short, stable primary nav (Home, Getting Started, Blog,
 * About, Contact). Topic discovery no longer lives up there: the six pillars
 * are reached through /blog/, the footer, the homepage cards, and the
 * contextual sidebar on every pillar and article page. The pillars themselves
 * are unchanged — only their place in the chrome moved.
 *
 * PILLAR_NAV is still the single ordered list of category sections, so the
 * footer and the sidebar's "Explore other topics" stay in sync with the registry.
 */
import { PAGES, getPage, type PageId, type PillarId, type SitePage } from "./pages";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavSection extends NavLink {
  pillar: PillarId;
}

/** A primary-nav entry plus how a path counts as being "in" it. */
export interface PrimaryNavLink extends NavLink {
  /** Home matches only "/"; every other entry also matches its subtree. */
  exact?: boolean;
}

const link = (label: string, id: PageId): NavLink => ({ label, href: getPage(id).path });

const section = (label: string, pillar: PillarId): NavSection => ({
  ...link(label, pillar),
  pillar,
});

/** Header navigation. Deliberately short — five links, no dropdowns. */
export const PRIMARY_NAV: readonly PrimaryNavLink[] = [
  { ...link("Home", "home"), exact: true },
  link("Getting Started", "getting-started"),
  link("Blog", "blog"),
  link("About", "about"),
  link("Contact", "contact"),
];

/** True when `currentPath` is the nav entry's page or sits beneath it. */
export function isCurrentSection(entry: PrimaryNavLink, currentPath: string): boolean {
  return entry.exact ? currentPath === entry.href : currentPath.startsWith(entry.href);
}

/** Every category pillar, in nav order. Used by the footer and the sidebar. */
export const PILLAR_NAV: readonly NavSection[] = [
  section("Getting Started", "getting-started"),
  section("AI Writing Tools", "ai-writing-tools"),
  section("Business & Productivity", "ai-business-tools"),
  section("Automation", "ai-automation"),
  section("AI Prompts", "ai-prompts"),
  section("By Industry", "ai-by-industry"),
];

/**
 * Shorter menu labels where the page title is too long for a nav list.
 * Only genuine overrides belong here: a label identical to the registry title
 * is dead weight now that registry titles track the frontmatter titles.
 */
const MENU_LABELS: Partial<Record<PageId, string>> = {
  "best-ai-writing-tools": "Best AI Writing Tools",
  "how-to-use-ai-tools": "How to Use AI Tools",
  "how-to-write-effective-ai-prompts": "How to Write Effective AI Prompts",
  "ai-tools-for-beginners": "AI Tools for Beginners",
  "ai-tools-for-marketing": "AI Tools for Marketing",
  "ai-tools-for-ecommerce": "AI Tools for E-commerce",
  "ai-tools-for-small-business": "AI Tools for Small Business",
  "ai-prompts-for-content-writing": "AI Prompts for Content Writing",
  "chatgpt-prompts-for-small-business": "ChatGPT Prompts for Small Business",
  "how-much-does-ai-cost-small-business": "How Much Does AI Cost?",
};

/** Short nav label for a page: the override if there is one, else its title. */
export function menuLabel(page: SitePage): string {
  return MENU_LABELS[page.id as PageId] ?? page.title;
}

/**
 * Article links for a pillar: its articles in registry order, limited to pages
 * that are actually built (published, non-draft content entries).
 */
export function getSectionLinks(pillar: PillarId, builtPageIds: ReadonlySet<string>): NavLink[] {
  return (PAGES as readonly SitePage[])
    .filter((page) => page.type === "article" && page.pillar === pillar)
    .filter((page) => builtPageIds.has(page.id))
    .map((page) => ({ label: menuLabel(page), href: page.path }));
}

export const FOOTER_NAV: readonly { heading: string; links: readonly NavLink[] }[] = [
  {
    heading: "Categories",
    links: PILLAR_NAV,
  },
  {
    heading: "Company",
    links: [
      link("Blog", "blog"),
      link("About", "about"),
      link("Contact", "contact"),
      link("Affiliate Disclosure", "affiliate-disclosure"),
      link("Privacy Policy", "privacy-policy"),
      link("Terms", "terms"),
    ],
  },
];
