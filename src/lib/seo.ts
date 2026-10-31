/**
 * SEO helpers shared by the layout, SEO head, and breadcrumbs.
 * All canonical and structured-data URLs are built from SITE.url.
 */
import { getImage } from "astro:assets";

import { SITE } from "@/config/site";
import { AUTHOR } from "@/config/author";
import { getPage, getParentPage, type SitePage } from "@/config/pages";
import {
  BRAND_LOGO,
  DEFAULT_SOCIAL_MEDIA_ID,
  MEDIA,
  isMediaId,
  type MediaId,
} from "@/config/media";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export type JsonLd = Record<string, unknown>;

/** Absolute URL on the canonical domain. Paths must already be trailing-slash based. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE.url}/`).href;
}

/**
 * Home → parent → current page. The parent is the page's pillar (articles) or
 * its explicit `parent` (e.g. a review under the /reviews/ hub); pages with
 * neither sit directly under Home.
 *
 * The homepage still gets no trail: a visible breadcrumb reading only "Home" on
 * the page called Home is noise. Its BreadcrumbList schema is built separately
 * — see homeBreadcrumbSchema() — because a one-item list is meaningful to a
 * parser (it states the root of the hierarchy) and meaningless to a reader.
 */
export function getBreadcrumbs(page: SitePage): BreadcrumbItem[] {
  if (page.path === "/") return [];

  const home = getPage("home");
  const trail: BreadcrumbItem[] = [{ label: "Home", path: home.path }];

  const parent = getParentPage(page);
  if (parent) trail.push({ label: parent.title, path: parent.path });

  trail.push({ label: page.title, path: page.path });
  return trail;
}

export function breadcrumbSchema(items: readonly BreadcrumbItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * The homepage's own BreadcrumbList: one item, naming the root.
 *
 * Nothing is rendered for it — see getBreadcrumbs() — and it will not produce a
 * breadcrumb line in a result, because the root is where a result's breadcrumb
 * starts rather than something shown beneath it. It is here because the
 * homepage is the only page on the site that was declaring no position in the
 * hierarchy at all, and a parser walking the site's structured data should find
 * the root stated by the root.
 */
export function homeBreadcrumbSchema(): JsonLd {
  const home = getPage("home");
  return breadcrumbSchema([{ label: "Home", path: home.path }]);
}

export interface NavigationLink {
  name: string;
  path: string;
}

/**
 * The site's primary navigation, as one SiteNavigationElement list.
 *
 * Built from the same PILLAR_NAV-derived list the homepage grid renders, so the
 * markup cannot describe navigation the page does not have. One ItemList node
 * holding every entry rather than one node per link: the latter is the shape
 * that shows up in the wild and it emits N anonymous top-level nodes for one
 * menu, which is harder for anything to read, not easier.
 */
export function siteNavigationSchema(links: readonly NavigationLink[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${SITE.name} categories`,
    itemListElement: links.map((link, index) => ({
      "@type": "SiteNavigationElement",
      position: index + 1,
      name: link.name,
      url: absoluteUrl(link.path),
    })),
  };
}

export interface ListedItem {
  name: string;
  path: string;
}

/**
 * An ordered ItemList of pages, for the homepage's editor's picks.
 *
 * `url`-only entries, not inlined Article nodes: each guide already publishes
 * its own full Article schema on its own page, and restating headline, dates
 * and author here would create a second, staler copy of every one of them. A
 * list of URLs in a stated order is the whole claim being made.
 */
export function itemListSchema(input: { name: string; items: readonly ListedItem[] }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: input.name,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export interface SocialImage {
  /** Absolute URL on the canonical domain. */
  url: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * 1200x675 keeps the registry's 16:9 masters uncropped and clears the 1200px
 * width that large summary cards want. JPEG, because not every scraper decodes
 * the webp variants astro:assets emits for the page itself.
 */
const SOCIAL_IMAGE_SIZE = { width: 1200, height: 675 } as const;

/** The image a page shares: its own, else its pillar's, else the site default. */
export function socialMediaId(page?: SitePage): MediaId {
  if (page && isMediaId(page.id)) return page.id;
  if (page?.pillar && isMediaId(page.pillar)) return page.pillar;
  return DEFAULT_SOCIAL_MEDIA_ID;
}

/**
 * Build-optimized social preview image for a registry page, or the site default
 * for pages outside the registry. Every page resolves to a real, built file, so
 * Phase 2 pages inherit a valid og:image without touching this code.
 */
export async function getSocialImage(page?: SitePage): Promise<SocialImage> {
  const { src, alt } = MEDIA[socialMediaId(page)];
  const optimized = await getImage({ src, ...SOCIAL_IMAGE_SIZE, format: "jpg" });
  return { url: absoluteUrl(optimized.src), alt, ...SOCIAL_IMAGE_SIZE };
}

/**
 * Stable node identifiers, so the WebSite, the Organization behind it, and the
 * Person who writes it are one entity each across the whole site rather than a
 * fresh anonymous node on every page.
 */
const WEBSITE_ID = () => absoluteUrl("/#website");
const ORGANIZATION_ID = () => absoluteUrl("/#organization");
const AUTHOR_ID = () => absoluteUrl(`${AUTHOR.path}#person`);

/**
 * The site itself, emitted on the homepage.
 *
 * `author` is the one addition worth making here. Every article already names
 * the Person who wrote it, but the homepage — the page an answer engine reaches
 * first when resolving "who is behind this site" — said only that an
 * Organization publishes it, and the Organization is a one-person site. Naming
 * the author on the WebSite node connects the two, and `author()` writes it as
 * the same @id every article points at, so it resolves to one person rather
 * than a namesake. WebSite is a CreativeWork, so the property is valid on it.
 *
 * It carries `name` and `url` inline for the same reason every article's author
 * does: enough to stand alone if the author page has not been crawled yet, and
 * nothing that could contradict the fuller node there. Still no credential of
 * any kind — the site states none.
 *
 * Not added, on purpose: `potentialAction`/SearchAction. Google retired the
 * sitelinks search box in 2023, so it would be markup to maintain for a feature
 * that no longer exists.
 */
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID(),
    name: SITE.name,
    url: absoluteUrl("/"),
    inLanguage: SITE.lang,
    publisher: { "@id": ORGANIZATION_ID() },
    author: author(),
  };
}

/**
 * The site's one Organization entity: Saayesh AI Flow itself. Every schema that
 * needs the brand — the `author` and `publisher` of an article, the `publisher`
 * of a pillar hub, the standalone node on the homepage — is built from this one
 * factory, so the name, URL, and logo can never drift apart between pages.
 *
 * `logo` is the full-resolution brand master from src/assets/brand/, emitted by
 * astro:assets at build time, so the URL is absolute, crawlable, and far above
 * Google's 112px minimum. It is deliberately not a favicon: those are cropped
 * to a square tile for a browser tab and are the wrong asset for a logo claim.
 */
const organization = (): JsonLd => ({
  "@type": "Organization",
  "@id": ORGANIZATION_ID(),
  name: SITE.name,
  url: absoluteUrl("/"),
  logo: absoluteUrl(BRAND_LOGO.src.src),
});

/**
 * The same Organization as a standalone node, for the homepage. Only the
 * homepage emits it on its own; everywhere else it is nested inside the schema
 * that references it, so the site never declares the brand twice on one page.
 */
export function organizationSchema(): JsonLd {
  return { "@context": "https://schema.org", ...organization() };
}

/**
 * The site's one author, as a reference to the Person node the author page
 * defines in full. Every article points at this same @id, so Google sees one
 * person who wrote all of them rather than a separate namesake per page.
 *
 * Only `name` and `url` are repeated inline: enough to be useful on its own if
 * the author page has not been crawled yet, and nothing that could contradict
 * the fuller node. Nothing here is a credential.
 */
const author = (): JsonLd => ({
  "@type": "Person",
  "@id": AUTHOR_ID(),
  name: AUTHOR.name,
  url: absoluteUrl(AUTHOR.path),
});

/**
 * The author page: a ProfilePage whose main entity is the Person every article
 * credits. `description` is the owner's own factual role line and `worksFor` is
 * the site's Organization — both already visible on the page.
 *
 * `sameAs` and `knowsAbout` come from AUTHOR and are the only identity claims
 * the site makes about a person outside it. Both are constrained at the source:
 * every `sameAs` URL is owner-supplied and rendered as a visible link on this
 * same page, and every `knowsAbout` term appears verbatim in the published bio.
 * They are here because an answer engine resolving "who wrote this" needs the
 * person to be the same entity it already knows from elsewhere — that is the
 * single highest-value thing this schema can say.
 *
 * Still deliberately absent: jobTitle, award, credential, alumniOf, and any
 * years-of-experience or seniority claim. The site states none of them.
 *
 * Note what is NOT added to the Organization in return. The site's own words
 * are that it "is run by" Saad Amjad, which supports `worksFor` from the Person
 * side and does not support `founder` — founding is a specific claim no page
 * here makes. Add it only if the owner states it on the site first.
 */
export function profilePageSchema(input: { path: string; description: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl(input.path),
    inLanguage: SITE.lang,
    mainEntity: {
      ...author(),
      description: input.description,
      worksFor: { "@id": ORGANIZATION_ID() },
      sameAs: AUTHOR.profiles.map((profile) => profile.url),
      knowsAbout: [...AUTHOR.knowsAbout],
    },
    publisher: organization(),
  };
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified: Date;
  /** Absolute URL of the page's social image, from getSocialImage(). */
  image: string;
}

export function articleSchema(input: ArticleSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    image: input.image,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(input.path) },
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    inLanguage: SITE.lang,
    /**
     * The person who wrote it, matching the visible byline on the page; the
     * brand remains the publisher. Author and publisher are deliberately
     * different entities now — an article is written by a named person, which
     * is what the byline says and what Google asks an author field to carry.
     */
    author: author(),
    publisher: organization(),
  };
}

/** Pillar hub: a CollectionPage whose main entity lists its published articles. */
export function collectionPageSchema(
  input: { name: string; description: string; path: string },
  items: readonly BreadcrumbItem[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    inLanguage: SITE.lang,
    publisher: organization(),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
        url: absoluteUrl(item.path),
      })),
    },
  };
}

export interface WebApplicationSchemaInput {
  name: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified: Date;
}

/**
 * A free interactive utility page (registry `type: "tool"`), described as the
 * thing it actually is: a WebApplication that runs in the browser.
 *
 * Every property below is factual and verifiable on the page itself — the tool
 * needs nothing but a browser, costs nothing, and requires no account — so no
 * claim here depends on data the site does not have.
 *
 * `isAccessibleForFree` carries the price on its own, and there is deliberately
 * no `offers`: an Offer describes something sold, and a zero-price Offer would
 * also have to name one `priceCurrency`, which this tool does not have — it
 * displays several currencies and converts none of them. Also absent, and for
 * the same reason: Product, Review, Rating, and AggregateRating. The site has
 * no ratings or reviews of its own tools and must not imply any.
 *
 * This is the only schema a tool page emits besides the BreadcrumbList that
 * BaseLayout already adds for every page, and the FAQPage that FaqSection emits
 * from the visible FAQ. A tool page never emits Article schema: it is not one.
 */
export function webApplicationSchema(input: WebApplicationSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: SITE.lang,
    isAccessibleForFree: true,
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    publisher: organization(),
  };
}

export interface DatasetVariable {
  /** The field's name as the dataset publishes it, e.g. "monthlyUsd". */
  name: string;
  description: string;
  /** Unit code where the field is a measurement, e.g. "USD" for a price. */
  unitText?: string;
}

export interface DatasetSchemaInput {
  name: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified: Date;
  /** Licence URL the data is published under. */
  license: string;
  /**
   * ISO 8601 interval covered by the observations, e.g. "2026-09-14/2026-10-21".
   * For this site that is the span of verification dates, not a claim about a
   * period of time the prices were valid for.
   */
  temporalCoverage: string;
  /** How the figures were gathered. Must describe what actually happened. */
  measurementTechnique: string;
  /** The fields a consumer of the data will find in it. */
  variableMeasured: readonly DatasetVariable[];
  /** Machine-readable copies of the data, as absolute or site-relative paths. */
  distributions: readonly { path: string; encodingFormat: string }[];
  keywords: readonly string[];
}

/**
 * A published dataset: structured observations offered for reuse, rather than
 * an article that happens to contain a table.
 *
 * This is the schema that makes a data page citable instead of merely readable
 * — it names the licence, the collection method, the fields, the period covered
 * and a machine-readable download, which is what a reader, a crawler, or an
 * answer engine needs in order to quote a figure and say where it came from.
 *
 * Every claim it makes has to be true of the page that emits it: a `license`
 * only if the page states one, a `distribution` only if that URL really serves
 * the data, and a `measurementTechnique` that describes the actual process. A
 * Dataset declaration on a page with no downloadable data is a lie told in
 * JSON, so there is deliberately no default for any of these.
 *
 * Note what is absent and must stay absent: no `aggregateRating`, no `review`,
 * and no `Offer`. The rows describe other companies' prices; this site neither
 * sells those plans nor rates them.
 */
export function datasetSchema(input: DatasetSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    license: input.license,
    isAccessibleForFree: true,
    inLanguage: SITE.lang,
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    temporalCoverage: input.temporalCoverage,
    measurementTechnique: input.measurementTechnique,
    keywords: [...input.keywords],
    creator: { "@id": ORGANIZATION_ID() },
    publisher: organization(),
    variableMeasured: input.variableMeasured.map((variable) => ({
      "@type": "PropertyValue",
      name: variable.name,
      description: variable.description,
      ...(variable.unitText ? { unitText: variable.unitText } : {}),
    })),
    distribution: input.distributions.map((distribution) => ({
      "@type": "DataDownload",
      encodingFormat: distribution.encodingFormat,
      contentUrl: absoluteUrl(distribution.path),
    })),
  };
}

export interface FaqItem {
  question: string;
  /** Plain text, so the visible answer and the structured data stay identical. */
  answer: string;
}

export function faqSchema(items: readonly FaqItem[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Serializes JSON-LD safely for an inline <script> (no `</script>` breakout). */
export function serializeJsonLd(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
