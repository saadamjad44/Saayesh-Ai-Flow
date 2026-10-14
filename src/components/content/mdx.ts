/**
 * Element overrides applied to every MDX body on the site.
 *
 * Both entry routes (pillar hubs and cluster pages) pass this one map, so the
 * same Markdown produces the same HTML everywhere:
 *   a       every body link goes through the outbound-link policy in src/lib/links.ts
 *   h2/h3   headings gain a hover-revealed deep link
 *   table   pipe tables get a framed, focusable horizontal-scroll container
 *
 * Authored components (<ComparisonTable>, <VerdictBox>, <PromptBlock>, …) are
 * imported by the entry itself from "@/components/content" and are not part of
 * this map.
 */
import ContentLink from "./ContentLink.astro";
import MdxH2 from "./MdxH2.astro";
import MdxH3 from "./MdxH3.astro";
import MdxTable from "./MdxTable.astro";

export const MDX_COMPONENTS = {
  a: ContentLink,
  h2: MdxH2,
  h3: MdxH3,
  table: MdxTable,
} as const;
