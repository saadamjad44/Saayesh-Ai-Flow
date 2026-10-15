/**
 * Build-time SEO metadata audit, as a local Astro integration.
 *
 * It runs on `astro:build:done` and reads the HTML that was actually emitted
 * into dist/, rather than the values the templates intended to emit. That
 * distinction is the whole point: a snippet can be correct in
 * src/config/seo-snippets.ts and still never reach the page — a change to
 * SeoHead could drop the canonical, or a second <title> could appear — and only
 * the built file can prove otherwise.
 *
 * Errors fail the build:
 *   - a page with no <title>, more than one <title>, or an empty one;
 *   - a page with no meta description, or an empty one;
 *   - two indexable pages sharing a title, a description, or a canonical;
 *   - an indexable page with no canonical URL.
 *
 * Warnings are printed and never fail a build. Length is a display guide, not a
 * ranking rule — Google truncates on pixel width and rewrites snippets at will
 * — so a long title is worth seeing and not worth blocking a deploy over.
 *
 * Noindexed pages (the legal pages and the 404) are checked for presence but
 * left out of the duplicate comparison: they are not search surfaces, and the
 * 404 deliberately has no canonical.
 *
 * Written as plain JavaScript on purpose. It needs Node's `fs`, `path` and
 * `url` builtins, and the project has no @types/node — a dev-only type package
 * is not worth adding for one file, and .mjs is not type-checked, so the
 * integration can use the builtins without one. Everything it imports from the
 * TypeScript config is resolved by Vite when astro.config.ts is loaded.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath } from "node:url";

import { SNIPPET_LIMITS } from "../config/seo-snippets.ts";

/**
 * @typedef {object} PageMeta
 * @property {string} path URL path of the page, from its location in dist/.
 * @property {string[]} titles Every <title> found, so extras can be reported.
 * @property {string | undefined} description
 * @property {string | undefined} canonical
 * @property {boolean} noindex
 */

/**
 * Decodes the entities Astro's HTML escaping actually produces in these
 * attributes, so a measured length matches what a person sees rather than the
 * markup. `&amp;` is decoded last, so "&amp;#39;" cannot become an apostrophe.
 *
 * @param {string} value
 * @returns {string}
 */
function decodeEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&amp;/g, "&");
}

/**
 * @param {string} html
 * @param {RegExp} pattern
 * @returns {string | undefined}
 */
function firstMatch(html, pattern) {
  const match = pattern.exec(html);
  return match?.[1] === undefined ? undefined : decodeEntities(match[1]).trim();
}

/**
 * Every .html file under a directory, as paths relative to it.
 *
 * @param {string} dir
 * @returns {string[]}
 */
function htmlFiles(dir) {
  return readdirSync(dir, { recursive: true, encoding: "utf8" }).filter((file) =>
    file.endsWith(".html"),
  );
}

/**
 * "about/index.html" → "/about/", "index.html" → "/", "404.html" → "/404.html".
 *
 * @param {string} file
 * @returns {string}
 */
function pathOf(file) {
  const parts = file.split(sep).join("/");
  if (parts === "index.html") return "/";
  if (parts.endsWith("/index.html")) return `/${parts.slice(0, -"index.html".length)}`;
  return `/${parts}`;
}

/**
 * @param {string} dir
 * @param {string} file
 * @returns {PageMeta}
 */
function readPage(dir, file) {
  const html = readFileSync(join(dir, file), "utf8");

  const titles = [...html.matchAll(/<title>([\s\S]*?)<\/title>/g)].map((match) =>
    decodeEntities(match[1] ?? "").trim(),
  );
  const robots = firstMatch(html, /<meta\s+name="robots"\s+content="([^"]*)"/) ?? "";

  return {
    path: pathOf(file),
    titles,
    description: firstMatch(html, /<meta\s+name="description"\s+content="([^"]*)"/),
    canonical: firstMatch(html, /<link\s+rel="canonical"\s+href="([^"]*)"/),
    noindex: robots.includes("noindex"),
  };
}

/**
 * Groups values shared by more than one page, for the duplicate checks.
 *
 * @param {readonly PageMeta[]} pages
 * @param {(page: PageMeta) => string | undefined} pick
 * @returns {[string, string[]][]}
 */
function duplicates(pages, pick) {
  /** @type {Map<string, string[]>} */
  const byValue = new Map();

  for (const page of pages) {
    const value = pick(page);
    if (!value) continue;
    byValue.set(value, [...(byValue.get(value) ?? []), page.path]);
  }

  return [...byValue.entries()].filter(([, paths]) => paths.length > 1);
}

/** @returns {import("astro").AstroIntegration} */
export function seoAudit() {
  return {
    name: "saayesh:seo-audit",
    hooks: {
      "astro:build:done": ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = htmlFiles(root)
          .map((file) => readPage(root, file))
          .sort((a, b) => a.path.localeCompare(b.path));

        /** @type {string[]} */
        const problems = [];
        /** @type {string[]} */
        const warnings = [];

        for (const page of pages) {
          const [title] = page.titles;

          if (page.titles.length === 0) {
            problems.push(`${page.path}: no <title>`);
          } else if (page.titles.length > 1) {
            problems.push(
              `${page.path}: ${page.titles.length} <title> elements, expected exactly 1`,
            );
          } else if (!title) {
            problems.push(`${page.path}: <title> is empty`);
          } else if (title.length > SNIPPET_LIMITS.titleWarn) {
            warnings.push(`${page.path}: title is ${title.length} characters and may truncate`);
          }

          if (!page.description) {
            problems.push(`${page.path}: no meta description`);
          } else if (page.description.length > SNIPPET_LIMITS.descriptionMax) {
            warnings.push(
              `${page.path}: description is ${page.description.length} characters and may truncate`,
            );
          } else if (page.description.length < SNIPPET_LIMITS.descriptionMin) {
            warnings.push(
              `${page.path}: description is only ${page.description.length} characters`,
            );
          }

          if (!page.noindex && !page.canonical) {
            problems.push(`${page.path}: indexable page with no canonical URL`);
          }
        }

        /**
         * Duplicates only matter between pages Google may index. The legal
         * pages and the 404 are noindexed and excluded.
         */
        const indexable = pages.filter((page) => !page.noindex);

        for (const [title, paths] of duplicates(indexable, (page) => page.titles[0])) {
          problems.push(`duplicate title "${title}" on ${paths.join(", ")}`);
        }
        for (const [description, paths] of duplicates(indexable, (page) => page.description)) {
          problems.push(
            `duplicate description "${description.slice(0, 60)}…" on ${paths.join(", ")}`,
          );
        }
        for (const [canonical, paths] of duplicates(indexable, (page) => page.canonical)) {
          problems.push(`duplicate canonical ${canonical} on ${paths.join(", ")}`);
        }

        for (const warning of warnings) logger.warn(warning);

        if (problems.length > 0) {
          throw new Error(`SEO metadata audit failed:\n- ${problems.join("\n- ")}`);
        }

        logger.info(
          `${indexable.length} indexable pages audited: unique titles, descriptions and canonicals` +
            (warnings.length > 0 ? `, ${warnings.length} length warning(s)` : ""),
        );
      },
    },
  };
}
