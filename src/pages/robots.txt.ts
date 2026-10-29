/**
 * robots.txt, generated so the sitemap URL always matches SITE.url.
 *
 * Noindexed legal pages are intentionally NOT disallowed here: crawlers must be
 * able to fetch them to see their noindex directive.
 *
 * WHY THE AI CRAWLERS ARE NAMED
 *
 * `User-agent: *` already allows every one of them, so the named group below
 * changes nothing functionally today. It is here for three reasons that are
 * worth a few lines of text:
 *
 * 1. It is a written record of a decision. This site wants to be read, quoted
 *    and cited by answer engines, and several of these crawlers are gated
 *    behind an explicit opt-in rather than a blanket allow — Google-Extended
 *    and Applebot-Extended are opt-OUT tokens whose absence is consent, but
 *    naming them states the consent rather than leaving it to be inferred.
 * 2. It survives a future tightening. The moment anyone adds a `Disallow` to
 *    the wildcard group — a staging path, a parameter trap — these crawlers
 *    would inherit it silently, because a named group is matched instead of the
 *    wildcard, never in addition to it. Having the group already here means the
 *    AI crawlers keep their own explicit rules instead of picking up rules
 *    written for someone else.
 * 3. It is auditable. Anyone can read this file and see exactly which agents
 *    the site has considered, instead of guessing from a wildcard.
 *
 * Note what this file cannot do: robots.txt is a request, and it is only one of
 * two gates. The network in front of the site is the other — a host-level AI
 * bot block (Cloudflare's "Block AI bots" and similar) refuses these crawlers
 * before they ever read this file, and no edit here can override that. Both
 * have to agree, so check the host's bot settings whenever changing this.
 *
 * Adding an agent: use the exact token the operator documents, keep it in its
 * group, and leave a note if the token is an opt-out signal rather than a
 * crawler. Never add one speculatively — a made-up token is noise that implies
 * a decision nobody made.
 */
import type { APIRoute } from "astro";
import { SITE } from "@/config/site";
import { absoluteUrl } from "@/lib/seo";

/**
 * Crawlers and fetchers belonging to AI search and assistant products, grouped
 * by operator with what each one actually does. The distinction inside a group
 * matters: a training crawler, a search indexer, and a live fetcher triggered
 * by a user's question are three different things, and a site can reasonably
 * feel differently about them. This site allows all three.
 */
const AI_USER_AGENTS: readonly { operator: string; agents: readonly string[] }[] = [
  {
    operator:
      "OpenAI — GPTBot trains, OAI-SearchBot indexes for ChatGPT search, ChatGPT-User fetches a page a user asked about",
    agents: ["GPTBot", "OAI-SearchBot", "ChatGPT-User"],
  },
  {
    operator:
      "Anthropic — ClaudeBot trains, Claude-SearchBot indexes for search, Claude-User fetches on a user's behalf",
    agents: ["ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai"],
  },
  {
    operator: "Perplexity — PerplexityBot indexes, Perplexity-User fetches a cited page",
    agents: ["PerplexityBot", "Perplexity-User"],
  },
  {
    operator:
      "Google — Google-Extended is not a crawler but the opt-in/out token for Gemini grounding and AI Overviews; ordinary Googlebot access is covered by the wildcard group above",
    agents: ["Google-Extended"],
  },
  {
    operator:
      "Apple — Applebot crawls, Applebot-Extended is the token governing use in Apple's generative models",
    agents: ["Applebot", "Applebot-Extended"],
  },
  {
    operator: "Microsoft — Copilot answers from the Bing index, so Bing's crawler is the gate",
    agents: ["bingbot"],
  },
  {
    operator: "Meta",
    agents: ["meta-externalagent", "FacebookBot"],
  },
  {
    operator:
      "Others — Amazon's assistant, Mistral's fetcher, DuckDuckGo's answer feature, and Common Crawl, whose archive feeds many training sets",
    agents: ["Amazonbot", "MistralAI-User", "DuckAssistBot", "CCBot"],
  },
];

export const GET: APIRoute = () => {
  const body = [
    `# ${SITE.name}`,
    "#",
    "# Everything on this site is open to every crawler. The named groups below",
    "# are AI search and assistant agents, allowed explicitly rather than only by",
    "# the wildcard rule, so the decision is recorded rather than inferred.",
    "",
    "User-agent: *",
    "Allow: /",
    "",
    "# --- AI search and assistant agents -------------------------------------",
  ];

  for (const { operator, agents } of AI_USER_AGENTS) {
    body.push("", `# ${operator}`);
    for (const agent of agents) body.push(`User-agent: ${agent}`);
    body.push("Allow: /");
  }

  body.push(
    "",
    "# --- Sitemap and data ---------------------------------------------------",
    "#",
    "# The full AI tool pricing dataset is also published as JSON, CC BY 4.0:",
    `# ${absoluteUrl("/ai-tool-pricing.json")}`,
    "# A plain-text guide to the site for language models:",
    `# ${absoluteUrl("/llms.txt")}`,
    "",
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
  );

  return new Response(`${body.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
