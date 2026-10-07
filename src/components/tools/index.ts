/**
 * Free interactive tools, for the `tools` content collection's MDX bodies:
 * `import { AiCostCalculator } from "@/components/tools";`
 *
 * A tool's editorial copy is authored in MDX like any other entry; only its
 * interactive part is a component, and it lives here rather than in
 * components/content so a calculator is never mistaken for a prose component.
 */
export { default as AiCostCalculator } from "./AiCostCalculator.astro";
