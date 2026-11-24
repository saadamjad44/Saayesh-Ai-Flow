/**
 * Data behind the homepage "AI Stack Finder" hero widget.
 *
 * The visitor picks a role and a budget, and the widget shows 3 tools that
 * fit — with real prices from the pricing dataset. Every tool listed here has
 * a published guide on the site; the `guide` path links to it.
 *
 * The recommendations are curated, not scored: each role × budget cell maps
 * to a hand-picked shortlist of three, because seven combinations is small
 * enough to get right by hand and large enough to feel personal.
 */
export interface StackRole {
  id: string;
  label: string;
  emoji: string;
}

export interface StackBudget {
  id: string;
  label: string;
}

export interface StackTool {
  name: string;
  plan: string;
  price: string;
  use: string;
  guide: string;
}

export const ROLES: readonly StackRole[] = [
  { id: "freelancer", label: "Freelancer", emoji: "✦" },
  { id: "ecommerce", label: "E-commerce", emoji: "◈" },
  { id: "agency", label: "Agency", emoji: "⬡" },
  { id: "smb", label: "Small biz", emoji: "▣" },
];

export const BUDGETS: readonly StackBudget[] = [
  { id: "free", label: "$0" },
  { id: "low", label: "Under $25" },
  { id: "mid", label: "$25–60" },
  { id: "high", label: "$60+" },
];

type StackKey = `${string}:${string}`;

const STACKS: Record<StackKey, readonly [StackTool, StackTool, StackTool]> = {
  "freelancer:free": [
    { name: "ChatGPT", plan: "Free", price: "$0", use: "Blog drafts, client emails", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Google Gemini", plan: "Free", price: "$0", use: "Research, fact-checking", guide: "/getting-started/how-to-use-ai-tools/" },
    { name: "Canva", plan: "Free", price: "$0", use: "Social graphics, proposals", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
  ],
  "freelancer:low": [
    { name: "Claude", plan: "Pro", price: "$20/mo", use: "Long writing, analysis", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "ChatGPT", plan: "Plus", price: "$20/mo", use: "Client work, brainstorming", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Grammarly", plan: "Free", price: "$0", use: "Proofreading all output", guide: "/ai-writing-tools/best-ai-writing-tools/" },
  ],
  "freelancer:mid": [
    { name: "Claude", plan: "Pro", price: "$20/mo", use: "Long-form writing, strategy", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "Jasper", plan: "Creator", price: "$39/mo", use: "Marketing copy at scale", guide: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/" },
    { name: "Zapier", plan: "Starter", price: "$20/mo", use: "Automate invoicing, follow-ups", guide: "/ai-automation/zapier-ai-automation-examples/" },
  ],
  "freelancer:high": [
    { name: "Claude", plan: "Pro", price: "$20/mo", use: "Deep writing and analysis", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "Jasper", plan: "Creator", price: "$39/mo", use: "Marketing copy pipeline", guide: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/" },
    { name: "Zapier", plan: "Professional", price: "$50/mo", use: "Multi-step automations", guide: "/ai-automation/zapier-ai-automation-examples/" },
  ],

  "ecommerce:free": [
    { name: "ChatGPT", plan: "Free", price: "$0", use: "Product descriptions, emails", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Google Gemini", plan: "Free", price: "$0", use: "Competitor research", guide: "/getting-started/how-to-use-ai-tools/" },
    { name: "Canva", plan: "Free", price: "$0", use: "Product images, ads", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
  ],
  "ecommerce:low": [
    { name: "ChatGPT", plan: "Plus", price: "$20/mo", use: "Product copy, customer replies", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Canva", plan: "Pro", price: "$13/mo", use: "Ad creatives, social posts", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
    { name: "Tidio", plan: "Free", price: "$0", use: "Live chat + basic AI bot", guide: "/ai-business-tools/ai-chatbot-for-small-business/" },
  ],
  "ecommerce:mid": [
    { name: "ChatGPT", plan: "Plus", price: "$20/mo", use: "Product content at scale", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Zapier", plan: "Starter", price: "$20/mo", use: "Order notifications, sync", guide: "/ai-automation/zapier-ai-automation-examples/" },
    { name: "Tidio", plan: "Starter", price: "$29/mo", use: "AI chatbot for support", guide: "/ai-business-tools/ai-chatbot-for-small-business/" },
  ],
  "ecommerce:high": [
    { name: "ChatGPT", plan: "Team", price: "$25/seat", use: "Team-wide content creation", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Zapier", plan: "Professional", price: "$50/mo", use: "Full order automation", guide: "/ai-automation/zapier-ai-automation-examples/" },
    { name: "Tidio", plan: "Growth", price: "$59/mo", use: "AI-first customer service", guide: "/ai-business-tools/ai-chatbot-for-small-business/" },
  ],

  "agency:free": [
    { name: "ChatGPT", plan: "Free", price: "$0", use: "Drafts, brainstorming", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Claude", plan: "Free", price: "$0", use: "Long briefs, strategy docs", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "Canva", plan: "Free", price: "$0", use: "Client presentations", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
  ],
  "agency:low": [
    { name: "Claude", plan: "Pro", price: "$20/mo", use: "Strategy, long documents", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "ChatGPT", plan: "Plus", price: "$20/mo", use: "Client deliverables", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Grammarly", plan: "Free", price: "$0", use: "Quality control on output", guide: "/ai-writing-tools/best-ai-writing-tools/" },
  ],
  "agency:mid": [
    { name: "Claude", plan: "Pro", price: "$20/mo", use: "Deep analysis, writing", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "Jasper", plan: "Creator", price: "$39/mo", use: "Scale client content", guide: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/" },
    { name: "Make", plan: "Core", price: "$9/mo", use: "Client workflow automation", guide: "/ai-automation/best-ai-workflows-for-solopreneurs/" },
  ],
  "agency:high": [
    { name: "ChatGPT", plan: "Team", price: "$25/seat", use: "Team-wide AI assistant", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Jasper", plan: "Pro", price: "$69/mo", use: "Brand voice at scale", guide: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/" },
    { name: "Zapier", plan: "Professional", price: "$50/mo", use: "Cross-client automation", guide: "/ai-automation/zapier-ai-automation-examples/" },
  ],

  "smb:free": [
    { name: "ChatGPT", plan: "Free", price: "$0", use: "Emails, meeting prep", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Google Gemini", plan: "Free", price: "$0", use: "Research, summaries", guide: "/getting-started/how-to-use-ai-tools/" },
    { name: "Canva", plan: "Free", price: "$0", use: "Flyers, social posts", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
  ],
  "smb:low": [
    { name: "ChatGPT", plan: "Plus", price: "$20/mo", use: "Daily business tasks", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Zapier", plan: "Free", price: "$0", use: "Basic task automation", guide: "/ai-automation/zapier-ai-automation-examples/" },
    { name: "Canva", plan: "Pro", price: "$13/mo", use: "Marketing materials", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
  ],
  "smb:mid": [
    { name: "Claude", plan: "Pro", price: "$20/mo", use: "Documents, analysis", guide: "/ai-business-tools/claude-for-small-business/" },
    { name: "Zapier", plan: "Starter", price: "$20/mo", use: "Automate repetitive work", guide: "/ai-automation/zapier-ai-automation-examples/" },
    { name: "Notion AI", plan: "Plus + AI", price: "$18/mo", use: "Team wiki, project notes", guide: "/ai-business-tools/best-ai-tools-for-small-business/" },
  ],
  "smb:high": [
    { name: "ChatGPT", plan: "Team", price: "$25/seat", use: "Company-wide AI", guide: "/ai-business-tools/chatgpt-business-vs-plus/" },
    { name: "Zapier", plan: "Professional", price: "$50/mo", use: "End-to-end automation", guide: "/ai-automation/zapier-ai-automation-examples/" },
    { name: "Make", plan: "Pro", price: "$16/mo", use: "Complex workflow builder", guide: "/ai-automation/best-ai-workflows-for-solopreneurs/" },
  ],
};

export function getStack(role: string, budget: string): readonly [StackTool, StackTool, StackTool] {
  const key: StackKey = `${role}:${budget}`;
  return STACKS[key] ?? STACKS["smb:free"];
}

export function getMonthlyTotal(stack: readonly StackTool[]): string {
  let total = 0;
  for (const tool of stack) {
    const match = tool.price.match(/\$(\d+)/);
    if (match) total += Number(match[1]);
  }
  return `$${total}`;
}
