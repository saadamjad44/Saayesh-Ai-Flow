/**
 * /sitemap.xml — the site's one XML sitemap, at the URL Google Search Console
 * and every other tool look for first.
 *
 * Built from the page registry (src/config/pages.ts), which is already the sole
 * authority for every public URL on the site, intersected with the content that
 * is actually published:
 *
 * - noindex pages (the legal pages) are excluded, so the sitemap never asks
 *   Google to index a page the page itself refuses;
 * - a registry page backed by a content collection (pillar, article, tool,
 *   review) is listed only when its MDX entry exists and is not a draft, so an
 *   unbuilt or draft page can never appear;
 * - every <loc> is absoluteUrl(page.path): HTTPS, apex domain, trailing slash,
 *   identical to the page's own canonical tag;
 * - <lastmod> is the entry's authored `updatedDate` and nothing else. Pages with
 *   no authored date (home, about, contact, blog, the author page) get no
 *   <lastmod> at all, because an omitted value is correct and a guessed one is
 *   a lie Google can check.
 *
 * Routes that are not pages — robots.txt, this file, /search-index.json — are
 * not in the registry and so are never listed. Neither is the 404 page.
 *
 * This replaces @astrojs/sitemap, which can only emit a sitemap *index*
 * (/sitemap-index.xml plus /sitemap-0.xml) and has no option to write a single
 * /sitemap.xml. A site of this size needs one file, and an endpoint can read
 * the content collections directly — which the integration, running outside the
 * Astro runtime, could not.
 */
import type { APIRoute } from "astro";

import { PAGES, type PageType, type SitePage } from "@/config/pages";
import { getPublishedEntries } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";

/** Registry types whose pages only exist when a content entry is published. */
const CONTENT_BACKED: ReadonlySet<PageType> = new Set<PageType>([
  "pillar",
  "article",
  "tool",
  "review",
]);

const escapeXml = (value: string): string =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async () => {
  const collections = await Promise.all([
    getPublishedEntries("pillars"),
    getPublishedEntries("articles"),
    getPublishedEntries("tools"),
  ]);

  /** Registry path → authored update date, for published entries only. */
  const lastmodByPath = new Map(
    collections
      .flat()
      .map(({ entry, page }) => [page.path, entry.data.updatedDate.toISOString()] as const),
  );

  const entries = (PAGES as readonly SitePage[])
    .filter((page) => !page.noindex)
    .filter((page) => !CONTENT_BACKED.has(page.type) || lastmodByPath.has(page.path))
    .map((page) => ({ loc: absoluteUrl(page.path), lastmod: lastmodByPath.get(page.path) }));

  const urls = entries.map(({ loc, lastmod }) =>
    [
      "  <url>",
      `    <loc>${escapeXml(loc)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      "  </url>",
    ].join("\n"),
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
