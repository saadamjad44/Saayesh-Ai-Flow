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
 * Provenance (last reviewed 2026-10-20): every picture below is original
 * artwork supplied by the site owner, so the site holds the rights and no
 * third-party attribution is owed — credit is recorded here rather than printed
 * on the page. If an image is ever swapped for one from a stock library or any
 * other source that requires visible credit, record that here and do not ship
 * it until FeaturedImage can render the credit line again.
 */
import type { ImageMetadata } from "astro";

import logo from "@/assets/brand/saayesh-ai-flow-logo.png";
import aiAgents from "@/assets/images/ai-agents.jpg";
import aiAutomation from "@/assets/images/ai-automation.jpg";
import aiBusinessTools from "@/assets/images/ai-business-tools.jpg";
import aiByIndustry from "@/assets/images/ai-by-industry.jpg";
import aiPrompts from "@/assets/images/ai-prompts.jpg";
import aiWritingTools from "@/assets/images/ai-writing-tools.jpg";
import gettingStarted from "@/assets/images/getting-started.jpg";
import homeHero from "@/assets/images/home-hero.jpg";

/**
 * The brand logo, declared once so the header — and anything else that needs
 * the mark later — never hardcodes a path.
 *
 * The owner-supplied master is src/assets/brand/logo-source.jpeg: the monogram
 * on a flat white square. `saayesh-ai-flow-logo.png` is that file trimmed to
 * the mark and given a real alpha channel, so it sits on the warm paper
 * background without a white box behind it. It lives in src/assets/ rather than
 * public/ so astro:assets emits responsive, width/height-stamped variants.
 *
 * `alt` names the mark, so the logo is a described image rather than a
 * decorative one — it is the brand's own artwork, and an image search result
 * for it should say what it is.
 *
 * That creates one problem and fixes it in the same move. Everywhere the logo
 * is used it sits beside the visible "Saayesh AI Flow" wordmark inside the same
 * link, so an alt here plus the wordmark would make a screen reader announce
 * the brand twice over one link. The wordmark carries `aria-hidden` at both
 * call sites instead (header and footer), which leaves the link with exactly
 * one accessible name — this one — and leaves the visible text untouched for
 * everyone else and for crawlers. Change one without the other and the double
 * announcement comes back.
 *
 * The favicon set in public/ (favicon.ico, favicon-48x48.png,
 * favicon-192x192.png, apple-touch-icon.png) is rasterised from this same file,
 * centred on a flat white square so the icon Google Search shows is the real
 * brand mark rather than a stand-in. The monogram is a wide lockup, so the
 * small sizes keep less margin than the large ones; regenerate the whole set
 * together if the logo ever changes, and keep every size square.
 */
export const BRAND_LOGO = {
  src: logo,
  alt: "Saayesh AI Flow logo",
  /** Rendered height in the header, in px. Width follows the intrinsic ratio. */
  headerHeight: 30,
} as const;

export interface MediaCredit {
  /** Who holds the rights to the picture. */
  rightsHolder: string;
  /** Where it came from — a library name, or how it reached the project. */
  source: string;
  /** The terms this site relies on to publish it. */
  license: string;
  /** Source or licence page, when the provenance has one to link. */
  url?: string;
}

export interface MediaAsset {
  src: ImageMetadata;
  /** Describes the picture, never the page topic. Keep it factual. */
  alt: string;
  credit: MediaCredit;
}

/** Original artwork supplied by the owner: site-owned, no attribution owed. */
const owned = (): MediaCredit => ({
  rightsHolder: "Saayesh AI Flow",
  source: "Owner-supplied original artwork",
  license: "Site-owned — no third-party attribution required",
});

/** All images share a 16:9 master so heroes and cards line up across the site. */
export const MEDIA_ASPECT_RATIO = 16 / 9;

export const MEDIA = {
  "ai-writing-tools": {
    src: aiWritingTools,
    alt: "An open blue book with a fountain pen writing on a page floating above it, crumpled paper scraps on one side turning into a stream of light and clean finished pages on the other.",
    credit: owned(),
  },
  "ai-business-tools": {
    src: aiBusinessTools,
    alt: "A desk holding a laptop that shows a rising bar chart, a glowing blue sphere, a stack of reports, a clock, and three ticked checkboxes, all linked by trails of light.",
    credit: owned(),
  },
  "ai-automation": {
    src: aiAutomation,
    alt: "A conveyor belt carrying document cards into a glass machine full of gears and out the other side, where the finished documents stack up with a tick on each one.",
    credit: owned(),
  },
  "ai-agents": {
    src: aiAgents,
    alt: "A glowing blue crystal cube on a plinth, joined by curved connectors to five surrounding tiles: an email, a spreadsheet, a calendar, a document, and a tick.",
    credit: owned(),
  },
  "ai-by-industry": {
    src: aiByIndustry,
    alt: "A miniature model of a business district — a shop under a blue awning, a glass office showing a chart, and a meeting room — strung together by one glowing blue line.",
    credit: owned(),
  },
  "ai-prompts": {
    src: aiPrompts,
    alt: "A glass control panel of four labelled sliders focusing a beam of light into a cut blue gemstone.",
    credit: owned(),
  },
  "getting-started": {
    src: gettingStarted,
    alt: "An open book on a round plinth with a glowing archway rising from its pages, a path running through the arch towards a distant city, and small tiles for ideas and clicks floating alongside.",
    credit: owned(),
  },
  /**
   * The homepage hero. Composed with its subject in the right half and open
   * sky on the left, so the hero copy sits in the empty half; see
   * src/pages/index.astro, which blacks that half out and leaves the right
   * half of the picture undimmed.
   *
   * Its master is 1672x941 rather than the usual 1600x900 because it is the
   * only full-bleed background on the site and has no content column to sit
   * in. Keep any replacement at that same ~16:9 ratio with its subject right
   * of centre and nothing that matters in the left half or the outer 3% of
   * any edge: the hero anchors the picture to its right edge, so a narrow
   * desktop trims the left, and a very wide one trims top and bottom.
   *
   * The artwork carries the brand name set into its top-right corner, which
   * is why the crop is biased towards the top — see .hero-art.
   */
  home: {
    src: homeHero,
    alt: "A human profile in blue light whose head opens into a branching neural network, surrounded by floating panels showing a chat thread, a three-step workflow, a checklist and a rising chart.",
    credit: owned(),
  },
} as const satisfies Record<string, MediaAsset>;

export type MediaId = keyof typeof MEDIA;

/**
 * Social preview fallback for pages with no image of their own — about,
 * contact, the legal pages, and 404. The homepage hero carries the brand name,
 * so it is the right stand-in anywhere a page has nothing more specific.
 * Pillars and articles resolve to their own category image first; see
 * getSocialImage() in src/lib/seo.ts.
 */
export const DEFAULT_SOCIAL_MEDIA_ID: MediaId = "home";

export function getMedia(id: MediaId): MediaAsset {
  return MEDIA[id];
}

/** Narrows a registry page id to a media id, for pages that have an image. */
export function isMediaId(id: string): id is MediaId {
  return Object.hasOwn(MEDIA, id);
}
