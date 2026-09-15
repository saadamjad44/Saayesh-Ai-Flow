/**
 * SEO helpers shared by the layout, SEO head, and breadcrumbs.
 * All canonical and structured-data URLs are built from SITE.url.
 */
import { SITE } from "@/config/site";
import { getPage, type SitePage } from "@/config/pages";

export interface BreadcrumbItem {
  label: string;
  path: string;
}

export type JsonLd = Record<string, unknown>;

/** Absolute URL on the canonical domain. Paths must already be trailing-slash based. */
export function absoluteUrl(path: string): string {
  return new URL(path, `${SITE.url}/`).href;
}

/** "Page title | Saayesh AI Flow", unless the title already carries the brand. */
export function formatTitle(title: string): string {
  return title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
}

/** Home → pillar (for articles) → current page. The homepage has no breadcrumb trail. */
export function getBreadcrumbs(page: SitePage): BreadcrumbItem[] {
  if (page.path === "/") return [];

  const home = getPage("home");
  const trail: BreadcrumbItem[] = [{ label: "Home", path: home.path }];

  if (page.pillar) {
    const pillar = getPage(page.pillar);
    trail.push({ label: pillar.title, path: pillar.path });
  }

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

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: absoluteUrl("/"),
    inLanguage: SITE.lang,
  };
}

const publisher = () => ({ "@type": "Organization", name: SITE.name, url: absoluteUrl("/") });

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  path: string;
  datePublished: Date;
  dateModified: Date;
}

export function articleSchema(input: ArticleSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.datePublished.toISOString(),
    dateModified: input.dateModified.toISOString(),
    inLanguage: SITE.lang,
    author: publisher(),
    publisher: publisher(),
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
    publisher: publisher(),
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
