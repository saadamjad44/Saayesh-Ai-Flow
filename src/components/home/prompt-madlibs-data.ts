/**
 * Data for the homepage "Prompt Mad-Libs" widget.
 *
 * Each template is a prompt with fillable blanks. The user picks a category,
 * fills in their context, and copies the finished prompt. Every template links
 * to a relevant guide on the site.
 */

export interface PromptBlank {
  id: string;
  label: string;
  placeholder: string;
}

export interface PromptTemplate {
  id: string;
  label: string;
  emoji: string;
  blanks: readonly PromptBlank[];
  /** The template string — blanks are referenced as {{blank_id}}. */
  template: string;
  guide: string;
  guideLabel: string;
}

export const PROMPT_TEMPLATES: readonly PromptTemplate[] = [
  {
    id: "email",
    label: "Cold email",
    emoji: "✉",
    blanks: [
      { id: "role", label: "Your role", placeholder: "e.g. freelance designer" },
      { id: "offer", label: "What you offer", placeholder: "e.g. brand identity packages" },
      { id: "audience", label: "Who you're emailing", placeholder: "e.g. DTC skincare founders" },
    ],
    template:
      "Write a cold outreach email. I'm a {{role}} who offers {{offer}}. I'm reaching out to {{audience}}. Keep it under 120 words, lead with a specific observation about their business, state one clear benefit, and end with a low-commitment ask. No fluff, no \"I hope this email finds you well.\"",
    guide: "/ai-writing-tools/best-ai-writing-tools/",
    guideLabel: "Best AI writing tools →",
  },
  {
    id: "blog",
    label: "Blog intro",
    emoji: "✍",
    blanks: [
      { id: "topic", label: "Blog topic", placeholder: "e.g. email automation for shops" },
      { id: "audience", label: "Target reader", placeholder: "e.g. Shopify store owners" },
      { id: "hook", label: "Opening hook", placeholder: "e.g. a surprising stat or question" },
    ],
    template:
      "Write a blog introduction for {{audience}} about {{topic}}. Start with {{hook}}. Set up the problem in 2 sentences, hint at the solution, and end with what the reader will learn. Keep it under 100 words. Conversational tone, no buzzwords.",
    guide: "/ai-writing-tools/ai-tools-for-blog-writing/",
    guideLabel: "AI tools for blogging →",
  },
  {
    id: "social",
    label: "Social post",
    emoji: "📱",
    blanks: [
      { id: "platform", label: "Platform", placeholder: "e.g. LinkedIn" },
      { id: "topic", label: "What to post about", placeholder: "e.g. a lesson from losing a client" },
      { id: "cta", label: "Call to action", placeholder: "e.g. comment your experience" },
    ],
    template:
      "Write a {{platform}} post about {{topic}}. Start with a bold first line that stops the scroll. Share the story in 3–4 short paragraphs. End with: {{cta}}. Use line breaks for readability. No hashtag spam — 2 max. No emojis in the opening line.",
    guide: "/ai-writing-tools/best-ai-writing-tools/",
    guideLabel: "Best AI writing tools →",
  },
  {
    id: "strategy",
    label: "Strategy brief",
    emoji: "🎯",
    blanks: [
      { id: "business", label: "Your business", placeholder: "e.g. online tutoring platform" },
      { id: "goal", label: "Main goal", placeholder: "e.g. reach 500 students in 6 months" },
      { id: "budget", label: "Monthly budget", placeholder: "e.g. $200 for tools" },
    ],
    template:
      "Act as a small-business AI consultant. My business: {{business}}. Goal: {{goal}}. Monthly AI tool budget: {{budget}}. Recommend a 3-tool stack with specific tool names, plans, and prices. For each tool: what I'd use it for daily, the ROI case in one sentence, and one gotcha to watch for. End with a 30-day adoption timeline.",
    guide: "/ai-business-tools/best-ai-tools-for-small-business/",
    guideLabel: "Best AI tools for small biz →",
  },
];

export function fillTemplate(template: PromptTemplate, values: Record<string, string>): string {
  let result = template.template;
  for (const blank of template.blanks) {
    const value = values[blank.id]?.trim() || `[${blank.label}]`;
    result = result.replace(`{{${blank.id}}}`, value);
  }
  return result;
}
