# Saayesh AI Flow

A statically generated content website covering AI writing tools, AI business tools, and AI automation workflows for solopreneurs and small business owners.

The site is built with Astro and ships as pre-rendered HTML. All content lives in the repository as MDX, and every published page is declared in a typed page registry that the build validates — there is no CMS and no database.

---

## Features

- **Typed page registry** — `src/config/pages.ts` is the single source of truth for every URL, page type, pillar relationship, and `noindex` flag. `assertValidPageRegistry()` runs on every build and fails it on an invalid path, a duplicate path, an article missing its pillar, or a page count mismatch.
- **Pillar/cluster content model** — three pillar hubs, each with its own cluster of articles nested under the pillar URL.
- **Schema-validated MDX** — Zod schemas in `src/content.config.ts` enforce title/description lengths, publish and update dates, affiliate-link disclosure, testing status, and optional FAQ entries. Invalid frontmatter fails the build.
- **Reusable content components** for MDX: comparison tables, score tables, verdict boxes, FAQ sections, affiliate notes, last-updated stamps, featured images, and related-page blocks.
- **SEO infrastructure** — canonical URLs, meta descriptions, robots directives, Open Graph and Twitter tags, JSON-LD, breadcrumbs, a generated sitemap, and a generated `robots.txt` (see [SEO](#seo)).
- **Navigation** — sticky header with pillar dropdowns that list only articles actually built, plus a footer with category and company columns.
- **Accessibility** — skip-to-content link, `aria-current` on active nav links, `aria-expanded`/`aria-controls` on the nav toggles, visible `:focus-visible` styles, and `prefers-reduced-motion` handling in the global stylesheet.
- **Responsive design** — mobile-first Tailwind layouts throughout.
- **Contact form** — no-JavaScript form wired to Netlify Forms with a honeypot field.
- **Image pipeline** — images are declared once in `src/config/media.ts` with alt text and licence provenance, then rendered through `astro:assets` as responsive WebP.

---

## Tech Stack

| Area          | Choice                                                                        |
| ------------- | ----------------------------------------------------------------------------- |
| Framework     | Astro `^7.3.2` (static output, `trailingSlash: "always"`)                     |
| Language      | TypeScript `^6.0.3`, `astro/tsconfigs/strict`                                 |
| Content       | `@astrojs/mdx` `^8.0.1` + Astro content collections                           |
| Styling       | Tailwind CSS `^4.3.3` via `@tailwindcss/vite`, with `@tailwindcss/typography` |
| Sitemap       | `@astrojs/sitemap` `^3.7.4`                                                   |
| Type checking | `@astrojs/check` `^0.9.10`                                                    |
| Formatting    | Prettier `^3.9.6` + `prettier-plugin-astro`                                   |
| Hosting       | Netlify (`netlify.toml`, `NODE_VERSION = "24"`)                               |

Requires Node `>=22.12.0` (`engines` in `package.json`).

---

## Project Structure

```
src/
├── assets/images/        # Source images processed by astro:assets
├── components/
│   ├── content/          # MDX building blocks (ComparisonTable, ScoreTable, FaqSection, …)
│   ├── forms/            # ContactForm (Netlify Forms)
│   ├── layout/           # SiteHeader, SiteFooter, Breadcrumbs
│   └── seo/              # SeoHead
├── config/
│   ├── editorial.ts      # Testing statuses, score categories
│   ├── media.ts          # Image registry with alt text and licensing
│   ├── navigation.ts     # Header/footer navigation, derived from pages.ts
│   ├── pages.ts          # Page registry + build-time validation
│   └── site.ts           # Brand, domain, owner details, integration IDs
├── content/
│   ├── articles/         # 8 cluster articles (MDX)
│   └── pillars/          # 3 pillar hubs (MDX)
├── layouts/              # BaseLayout, PageLayout, EntryLayout
├── lib/                  # content.ts (collection access), seo.ts, format.ts
├── pages/                # Routes (see below)
├── styles/global.css     # Tailwind entry, theme tokens, base styles
└── content.config.ts     # Collection schemas
```

Root files of note: `astro.config.ts`, `netlify.toml`, `tsconfig.json` (with the `@/*` → `./src/*` alias), `AGENTS.md` (project rules), and `skills/` (working guidelines).

---

## Content / Pages

17 registry pages plus a 404 page (18 pages built).

**Core and utility**

| Route                    | Notes                     |
| ------------------------ | ------------------------- |
| `/`                      | Homepage                  |
| `/about/`                | About + editorial process |
| `/contact/`              | Contact form              |
| `/privacy-policy/`       | noindex                   |
| `/terms/`                | noindex                   |
| `/affiliate-disclosure/` | noindex                   |

**Pillars and clusters**

| Pillar                | Articles                                                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/ai-writing-tools/`  | `best-ai-writing-tools/`, `jasper-vs-claude-vs-chatgpt/`                                                       |
| `/ai-business-tools/` | `best-ai-tools-for-small-business/`, `ai-tools-vs-virtual-assistant/`, `how-much-does-ai-cost-small-business/` |
| `/ai-automation/`     | `zapier-ai-automation-examples/`, `best-ai-workflows-for-solopreneurs/`, `how-to-automate-email-with-ai/`      |

Pillars and articles are rendered by the dynamic routes `src/pages/[pillar]/index.astro` and `src/pages/[pillar]/[article].astro`. `robots.txt` is generated by `src/pages/robots.txt.ts`.

---

## SEO

Implemented in `src/lib/seo.ts`, `src/components/seo/SeoHead.astro`, and `astro.config.ts`:

- **Canonical URLs** — absolute, built from `SITE.url`; omitted on pages outside the registry (404).
- **Meta tags** — title (brand appended via `formatTitle`), description, and a robots directive (`index, follow, max-image-preview:large`, or `noindex, follow`).
- **Open Graph / Twitter** — `og:site_name`, `og:locale`, `og:type`, `og:title`, `og:description`, `og:url`, and `twitter:card`/`title`/`description`.
- **JSON-LD** — `WebSite` (homepage), `Article` (cluster articles), `CollectionPage` with an `ItemList` (pillar hubs), `FAQPage` (pages with FAQ frontmatter), and `BreadcrumbList` (any page with a trail). Serialized with `</script>` breakout protection.
- **Breadcrumbs** — rendered from the registry (Home → pillar → page) and mirrored in structured data.
- **Sitemap** — `@astrojs/sitemap` generates `/sitemap-index.xml`, filtered to exclude the noindexed legal pages; linked via `<link rel="sitemap">`.
- **robots.txt** — generated at build time so the sitemap URL always matches `SITE.url`. Noindexed pages are deliberately _not_ disallowed, so crawlers can read their noindex directive.
- **Validation** — `BaseLayout` throws if a page's registry path does not match the route it renders at, and the page registry is validated on every build.

Google Search Console verification and GA4 are wired through `INTEGRATIONS` in `src/config/site.ts`; both are empty, so neither is currently emitted.

---

## Development Setup

```bash
npm install      # install dependencies
npm run dev      # start the dev server
npm run check    # astro check (TypeScript + Astro diagnostics)
npm run format:check   # prettier --check .
npm run build    # production build to dist/
npm run verify   # check + format:check + build
```

Also available: `npm run format` (writes Prettier fixes) and `npm run preview` (serves the built `dist/`).

---

## Local Development

```bash
npm install
npm run dev
```

Astro's dev server runs at **http://localhost:4321** by default. All URLs use trailing slashes (`/ai-automation/`), matching the production build.

---

## Production / Netlify Deployment

The site deploys to Netlify from GitHub. `netlify.toml` defines the build:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "24"
```

Pushing to `main` triggers a Netlify build; the static output in `dist/` is published. The contact form is picked up by Netlify Forms from the built HTML at deploy time.

`SITE_DOMAIN` in `src/config/site.ts` currently points at the Netlify production host. A custom domain has not been purchased or connected; when one is, updating that single value updates canonical URLs, structured data, the sitemap, and `robots.txt`.

---

## Content Management

All content lives in the repository — there is no CMS.

- **Pillars** — `src/content/pillars/*.mdx`
- **Articles** — `src/content/articles/*.mdx`

Each MDX file carries frontmatter validated by `src/content.config.ts`, including a `pageId` that must match an approved entry in `src/config/pages.ts` of the matching type. URL, pillar, breadcrumbs, and the noindex flag always come from the registry, never from frontmatter. Setting `draft: true` excludes an entry from the build and from navigation.

To add a page: add it to the registry in `src/config/pages.ts`, then create the matching MDX file referencing that `pageId`.

---

## Validation / Quality Checks

| Command                | What it does                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------ |
| `npm run check`        | `astro check` — TypeScript and Astro diagnostics under strict mode                                     |
| `npm run format:check` | Prettier formatting check                                                                              |
| `npm run build`        | Production build, including registry validation, content-schema validation, and layout path assertions |
| `npm run verify`       | All three, in order                                                                                    |

Latest local run of `npm run verify` passes: `astro check` reports 0 errors, 0 warnings, 0 hints across 40 files; Prettier reports all matched files formatted; the build completes with 18 pages.

---

## Domain

- **Current deployment host:** https://peppy-seahorse-9d05e3.netlify.app
- **Custom domain:** not yet purchased or connected. `SITE_DOMAIN` in `src/config/site.ts` is the one value to change once a domain is in place.

---

## Future Improvements

Explicitly deferred in `AGENTS.md`:

- `/blog/` is deferred to Phase 2 and is not built or linked in Phase 1.
- Remaining planned pages belong to Phase 2/3 until approved.
- GA4 and Search Console IDs are filled in at launch via `INTEGRATIONS` in `src/config/site.ts`.
