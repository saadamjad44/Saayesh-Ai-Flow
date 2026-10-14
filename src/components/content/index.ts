/**
 * Content components for MDX: `import { VerdictBox } from "@/components/content";`
 *
 * Pick components from the article's actual content and search intent — a guide
 * that has no reusable prompt needs no <PromptBlock>, and a research-based
 * roundup must not carry a <ScoreTable>. The element-level overrides that apply
 * to every entry (links, heading anchors, table scrolling) are not here; see
 * mdx.ts.
 */
export { default as AffiliateNote } from "./AffiliateNote.astro";
export { default as Callout } from "./Callout.astro";
export { default as ComparisonTable } from "./ComparisonTable.astro";
export { default as ContentGap } from "./ContentGap.astro";
export { default as ContentLink } from "./ContentLink.astro";
export { default as FaqSection } from "./FaqSection.astro";
export { default as FeaturedImage } from "./FeaturedImage.astro";
export { default as KeyTakeaways } from "./KeyTakeaways.astro";
export { default as LastUpdated } from "./LastUpdated.astro";
export { default as OwnerDetail } from "./OwnerDetail.astro";
export { default as PromptBlock } from "./PromptBlock.astro";
export { default as ProsCons } from "./ProsCons.astro";
export { default as ScoreTable } from "./ScoreTable.astro";
export { default as Step } from "./Step.astro";
export { default as Steps } from "./Steps.astro";
export { default as ToolCallout } from "./ToolCallout.astro";
export { default as ToolCard } from "./ToolCard.astro";
export { default as VerdictBox } from "./VerdictBox.astro";
