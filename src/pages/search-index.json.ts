/**
 * /search-index.json — the static search index the header search box fetches.
 *
 * An endpoint, not a page: it is never in the sitemap, never linked from any
 * <a>, and renders no HTML, so it creates no indexable duplicate of the content
 * it describes. It is written once at build time and served as a plain file.
 */
import type { APIRoute } from "astro";

import { buildSearchIndex } from "@/lib/search-index";

export const GET: APIRoute = async () => {
  const docs = await buildSearchIndex();

  return new Response(JSON.stringify(docs), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
};
