/**
 * SEO helpers shared by the layout, SEO head, and breadcrumbs.
 * All canonical and structured-data URLs are built from SITE.url.
 */
import { getImage } from "astro:assets";

import { SITE } from "@/config/site";
import { getPage, type SitePage } from "@/config/pages";
import { DEFAULT_SOCIAL_MEDIA_ID, MEDIA, isMediaId, type MediaId } from "@/config/media";

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
