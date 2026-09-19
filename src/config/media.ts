/**
 * Central registry for local image assets.
 *
 * Every image used on the site is declared here once with its alt text and
 * provenance, then referenced by id, so a page never hardcodes a file path and
 * licensing stays auditable. Files live in src/assets/images/ and are processed
 * by astro:assets at build time (responsive webp, intrinsic width/height).
 *
 * Adding an image:
 *   1. Put the optimized master in src/assets/images/ at 1600x900 (16:9).
 *   2. Import it and add an entry below, including source and licence.
 *   3. Reference it with <FeaturedImage id="..." /> or MEDIA[id].
 *
 * Licence check (verified 2026-09-16): every photo below is from Pexels under
 * the Pexels Licence — free for commercial use, no attribution required, no
 * usage here that implies endorsement. https://www.pexels.com/license/
 * Credit is therefore recorded here rather than printed on the page. An image
 * from a source that does require visible attribution must not be added until
 * FeaturedImage can render that credit again.
 */
import type { ImageMetadata } from "astro";

import aiAutomation from "@/assets/images/ai-automation.jpg";
import aiBusinessTools from "@/assets/images/ai-business-tools.jpg";
import aiWritingTools from "@/assets/images/ai-writing-tools.jpg";

export interface MediaCredit {
  photographer: string;
  source: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

export interface MediaAsset {
  src: ImageMetadata;
  /** Describes the picture, never the page topic. Keep it factual. */
  alt: string;
  credit: MediaCredit;
}

const pexels = (photographer: string, sourceUrl: string): MediaCredit => ({
  photographer,
  source: "Pexels",
  sourceUrl,
  license: "Pexels Licence",
  licenseUrl: "https://www.pexels.com/license/",
});

/** All images share a 16:9 master so heroes and cards line up across the site. */
export const MEDIA_ASPECT_RATIO = 16 / 9;

export const MEDIA = {
  "ai-writing-tools": {
    src: aiWritingTools,
    alt: "A person typing on a laptop with an AI chat assistant open on screen.",
    credit: pexels(
      "Matheus Bertelli",
      "https://www.pexels.com/photo/man-working-with-chatgpt-ai-system-16094048/",
    ),
  },
  "ai-business-tools": {
    src: aiBusinessTools,
    alt: "A small business owner working at a laptop beside stacked parcels and handwritten notes.",
    credit: pexels(
      "RDNE Stock project",
      "https://www.pexels.com/photo/a-man-looking-at-a-website-on-the-internet-7309483/",
    ),
  },
  "ai-automation": {
    src: aiAutomation,
    alt: "A hand drawing a workflow flowchart on a whiteboard, with steps connected by arrows.",
    credit: pexels(
      "Christina Morillo",
      "https://www.pexels.com/photo/white-dry-erase-board-with-red-diagram-1181311/",
    ),
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof MEDIA;

/**
 * Social preview fallback for pages with no image of their own — home, about,
 * contact, the legal pages, and 404. Pillars and articles resolve to their own
 * category image first; see getSocialImage() in src/lib/seo.ts.
 */
export const DEFAULT_SOCIAL_MEDIA_ID: MediaId = "ai-writing-tools";

export function getMedia(id: MediaId): MediaAsset {
  return MEDIA[id];
}

/** Narrows a registry page id to a media id, for pages that have an image. */
export function isMediaId(id: string): id is MediaId {
  return Object.hasOwn(MEDIA, id);
}
