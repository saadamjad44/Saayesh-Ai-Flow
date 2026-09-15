/**
 * Content collections for Phase 1 pillar and article pages (MDX in the repo).
 *
 * Every entry is tied to an approved page in src/config/pages.ts through
 * `pageId`; the URL, pillar, breadcrumbs, and noindex flag come from that
 * registry, never from frontmatter. Invalid or missing frontmatter fails the build.
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { PAGES, type PageId, type PageType } from "@/config/pages";
import { TESTING_STATUSES } from "@/config/editorial";

function pageIdOfType(type: PageType) {
  const ids = PAGES.filter((page) => page.type === type).map((page): PageId => page.id);
  return z.enum(ids as [PageId, ...PageId[]], {
    error: `pageId must be an approved Phase 1 ${type} page: ${ids.join(", ")}`,
  });
}

const faqItem = z.object({
  question: z.string().trim().min(1),
  answer: z.string().trim().min(1),
});

const entrySchema = (type: PageType) =>
  z
    .object({
      pageId: pageIdOfType(type),
      /** Page title, used for the <h1> and the <title> (the brand is appended). */
      title: z.string().trim().min(1).max(70),
      /** Meta description. */
      description: z.string().trim().min(50).max(160),
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date(),
      draft: z.boolean().default(false),
      /** Research-based unless the owner has hands-on testing evidence. */
      testingStatus: z.enum(TESTING_STATUSES),
      /** Required for `hands-on`: what was actually tested, and how. */
      testingSummary: z.string().trim().min(1).optional(),
      /** Explicit per page: `true` if the page has or will carry affiliate links; shows the affiliate note. */
      hasAffiliateLinks: z.boolean(),
      /** Date prices on the page were last checked, if the page states prices. */
      pricingVerifiedDate: z.coerce.date().optional(),
      faq: z.array(faqItem).min(1).optional(),
    })
    .superRefine((entry, ctx) => {
      if (entry.updatedDate < entry.publishedDate) {
        ctx.addIssue({
          code: "custom",
          path: ["updatedDate"],
          message: "updatedDate cannot be earlier than publishedDate",
        });
      }
      if (entry.testingStatus === "hands-on" && !entry.testingSummary) {
        ctx.addIssue({
          code: "custom",
          path: ["testingSummary"],
          message: "hands-on pages need a testingSummary describing the testing evidence",
        });
      }
    });

const pillars = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/pillars" }),
  schema: entrySchema("pillar"),
});

const articles = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/articles" }),
  schema: entrySchema("article"),
});

export const collections = { pillars, articles };
