/**
 * Site navigation.
 *
 * The header carries a Categories mega menu over the content pillars, the
 * site's free tools, and three stable links (Blog, About, Contact). Topic
 * discovery therefore lives in the header again, alongside /blog/, the footer,
 * the homepage cards, and the contextual sidebar on every pillar and article
 * page — so every pillar is reachable from the chrome of every page, and every
 * one of those links is a plain, crawlable <a> rendered on the server.
 *
 * PILLAR_NAV is still the single ordered list of category sections, so the
 * header, footer, homepage, and sidebar stay in sync with the registry.
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

/**
 * Header links beside the Categories mega menu. Deliberately three: the
 * categories themselves are in the menu, and Home is the wordmark.
 */
export const PRIMARY_NAV: readonly PrimaryNavLink[] = [
  link("Blog", "blog"),
  link("About", "about"),
  link("Contact", "contact"),
];

/** Suggested destinations on the 404 page: home, the archive, and the pillars. */
export const FALLBACK_NAV: readonly NavLink[] = [
  { label: "Homepage", href: "/" },
  link("Blog", "blog"),
];

/** True when `currentPath` is the nav entry's page or sits beneath it. */
export function isCurrentSection(entry: PrimaryNavLink, currentPath: string): boolean {
  return entry.exact ? currentPath === entry.href : currentPath.startsWith(entry.href);
}

/** Every category pillar, in nav order. Used by the header, footer, and sidebar. */
export const PILLAR_NAV: readonly NavSection[] = [
  section("Getting Started", "getting-started"),
  section("AI Writing Tools", "ai-writing-tools"),
  section("Business & Productivity", "ai-business-tools"),
  section("Automation", "ai-automation"),
  section("AI Agents", "ai-agents"),
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
  "claude-for-small-business": "Claude for Small Business",
  "claude-vs-chatgpt-for-small-business": "Claude vs ChatGPT",
  "best-ai-agents-for-small-business": "Best AI Agents for Small Business",
  "ai-agents-vs-automation": "AI Agents vs Automation",
  "ai-agent-use-cases": "AI Agent Use Cases",
  "ai-chatbot-for-small-business": "AI Chatbot for Small Business",
  "ai-customer-service-automation": "AI Customer Service Automation",
  "n8n-vs-zapier-vs-make": "n8n vs Zapier vs Make",
  "best-ai-automation-tools": "Best AI Automation Tools",
  "small-business-ai-cost-calculator": "AI Cost Calculator",
  "ai-email-time-savings-calculator": "AI Email Savings Calculator",
};

/** Short nav label for a page: the override if there is one, else its title. */
export function menuLabel(page: SitePage): string {
  return MENU_LABELS[page.id as PageId] ?? page.title;
}

/** Registry pages of one type that are actually built, in registry order. */
function builtPagesOfType(
  type: SitePage["type"],
  builtPageIds: ReadonlySet<string>,
  pillar?: PillarId,
): SitePage[] {
  return (PAGES as readonly SitePage[])
    .filter((page) => page.type === type)
    .filter((page) => (pillar ? page.pillar === pillar : true))
    .filter((page) => builtPageIds.has(page.id));
}

/**
 * Article links for a pillar: its articles in registry order, limited to pages
 * that are actually built (published, non-draft content entries).
 */
export function getSectionLinks(pillar: PillarId, builtPageIds: ReadonlySet<string>): NavLink[] {
  return builtPagesOfType("article", builtPageIds, pillar).map((page) => ({
    label: menuLabel(page),
    href: page.path,
  }));
}

/**
 * Free-tool links for a pillar, in registry order, limited to tools that are
 * actually built. Separate from getSectionLinks() on purpose: an interactive
 * utility is not an editorial guide, so the sidebar lists it under its own
 * heading rather than mixed into the category's reading list.
 */
export function getToolLinks(pillar: PillarId, builtPageIds: ReadonlySet<string>): NavLink[] {
  return builtPagesOfType("tool", builtPageIds, pillar).map((page) => ({
    label: menuLabel(page),
    href: page.path,
  }));
}

/**
 * Every built free tool, in registry order, regardless of which pillar it sits
 * under. The header mega menu lists these beside the categories, so a visitor
 * can reach the site's interactive utilities without first guessing which
 * category they were filed under.
 */
export function getAllToolLinks(builtPageIds: ReadonlySet<string>): NavLink[] {
  return builtPagesOfType("tool", builtPageIds).map((page) => ({
    label: menuLabel(page),
    href: page.path,
  }));
}

export const FOOTER_NAV: readonly { heading: string; links: readonly NavLink[] }[] = [
  {
    heading: "Categories",
    links: PILLAR_NAV,
  },
  {
    heading: "Guides & tools",
    links: [
      link("All guides", "blog"),
      link("AI Cost Calculator", "small-business-ai-cost-calculator"),
      link("AI Email Savings Calculator", "ai-email-time-savings-calculator"),
    ],
  },
  {
    heading: "About",
    links: [
      link("About & editorial process", "about"),
      link("Saad Amjad", "author-saad-amjad"),
      link("Contact", "contact"),
    ],
  },
  {
    heading: "Legal",
    links: [
      link("Affiliate Disclosure", "affiliate-disclosure"),
      link("Privacy Policy", "privacy-policy"),
      link("Terms", "terms"),
    ],
  },
];
