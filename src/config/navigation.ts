/**
 * Phase 1 navigation. Labels follow website-blueprint.jsx; only live Phase 1
 * pages are linked (no Tool Finder, AI by Industry, Blog, or Resources column).
 */
import { getPage, type PageId } from "./pages";

export interface NavLink {
  label: string;
  href: string;
}

const link = (label: string, id: PageId): NavLink => ({ label, href: getPage(id).path });

export const PRIMARY_NAV: readonly NavLink[] = [
  link("AI Writing Tools", "ai-writing-tools"),
  link("Business & Productivity", "ai-business-tools"),
  link("Automation", "ai-automation"),
];

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
