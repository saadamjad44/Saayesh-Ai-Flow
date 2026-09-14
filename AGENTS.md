# Saayesh Automate Stack — Agent Rules

## Mission
Build and grow Saayesh Automate Stack as a trustworthy, SEO-first AI tools, automation, workflows, comparisons, reviews, prompts, and guides website.

## Source of truth
- `revised-blueprint-phase1.jsx` is the source of truth for approved site architecture, Phase 1 scope, URLs, page map, and internal-linking structure.
- `website-blueprint.jsx` is supporting detail only (page sections, URL rules, linking rules, nav/footer) where it does not conflict with the revised blueprint or the decisions below.
- Do not invent pages, URLs, SEO metrics, reviews, testing claims, users, or credentials.
- When a task depends on the blueprint, read `revised-blueprint-phase1.jsx` first.

## Approved project decisions
- Brand name: **Saayesh Automate Stack**.
- Domain: not purchased yet. Use the `SITE_DOMAIN` placeholder in `src/config/site.ts` until the owner provides the final domain.
- Phase 1 scope: exactly 17 pages (6 core/utility + 3 pillars + 8 keyword-targeted articles).
- `/blog/` is deferred to Phase 2. Do not build or link it in Phase 1.
- Phase 1 navigation, homepage, and footer link only to live Phase 1 pages. No email opt-in and nothing that depends on Phase 2/3 features.
- Testing: Phase 1 content is research-based. Do not invent hands-on testing, scores, screenshots, or first-hand claims unless the owner provides testing evidence.
- SEO data: the owner's validated Semrush data is for internal prioritization only. Never publish search volume, KD, CPC, or competition claims on the website.
- Legal pages (privacy policy, terms, affiliate disclosure) are noindexed and excluded from the XML sitemap.
- Stack: Astro + TypeScript (strict) + MDX + Tailwind CSS + @astrojs/sitemap, hosted on Netlify, with GA4 and Google Search Console at launch. Content lives in the repo (Astro pages + MDX). Do not use WordPress or any headless CMS.

## Working method
1. Inspect the current project before changing anything.
2. Work in small phases; do not build the whole site in one turn.
3. Prefer the smallest useful change that completes the task.
4. Reuse existing components and content structures.
5. Keep generated source files reasonably small; avoid oversized monolithic files.
6. After changes, run the relevant checks/build and fix issues before reporting completion.

## Phase 1 rules
- Launch target: approximately 15–20 high-quality pages.
- Remaining planned pages belong to Phase 2/3 until explicitly approved.
- Do not generate large numbers of programmatic comparison pages at launch.
- Only create comparison/review pages when they have a clear user purpose and validated search opportunity.

## SEO rules
- Target search intent first; keywords must fit naturally.
- Do not claim keyword volume, difficulty, traffic potential, or ranking opportunity unless validated by provided SEO data.
- Use clean, stable URLs and consistent canonicalization.
- Build strong internal linking from pillar pages to clusters and contextual links between relevant pages.
- Optimize title, description, headings, schema, images, internal links, indexability, and sitemap as appropriate.
- Avoid keyword stuffing, thin pages, duplicate pages, and doorway-style content.

## Trust and review rules
- Reviews must distinguish researched facts from first-hand testing.
- Never claim a tool was tested unless the project actually has evidence of testing.
- Use a transparent review framework: features, pricing, ease of use, output quality, pros/cons, best for, alternatives, update date, and affiliate disclosure where applicable.
- Replace placeholders such as “500+ tools reviewed” with factual numbers only.

## Content rules
- Write for humans first.
- Add original synthesis, examples, tables, workflows, or testing notes where useful.
- Do not fabricate statistics, quotes, case studies, expert credentials, or product capabilities.
- Keep affiliate content useful and transparent; never let commission value alone determine rankings.

## Coding rules
- Follow the existing stack and conventions once approved.
- Prefer accessible, responsive, performant components.
- Keep SEO-critical content server-renderable/indexable.
- Do not add dependencies without a clear reason.
- Do not change public URLs or architecture unless the task explicitly requires it and the impact is assessed.

## Definition of done
A task is not complete until:
- the requested change is implemented,
- relevant tests/build/lint/checks pass,
- no obvious broken links or regressions remain,
- and the result is briefly reported with files changed and checks run.

## Skills
Read only the skill file needed for the current task:
- SEO: `skills/seo/SKILL.md`
- Content: `skills/content/SKILL.md`
- Website engineering: `skills/website/SKILL.md`
- Keyword research: `skills/keyword-research/SKILL.md`
- QA: `skills/qa/SKILL.md`
