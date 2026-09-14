/**
 * robots.txt, generated so the sitemap URL always matches SITE.url.
 * Noindexed legal pages are intentionally NOT disallowed here: crawlers must
 * be able to fetch them to see their noindex directive.
 */
import type { APIRoute } from "astro";
import { absoluteUrl } from "@/lib/seo";

export const GET: APIRoute = () => {
  const body = ["User-agent: *", "Allow: /", "", `Sitemap: ${absoluteUrl("/sitemap-index.xml")}`];

  return new Response(`${body.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
