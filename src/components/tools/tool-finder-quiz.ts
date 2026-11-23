/**
 * Data and scoring logic for the AI Tool Finder Quiz.
 *
 * The quiz recommends tools the site has actually reviewed. Every tool here has
 * a published guide on the site — the recommendation links to that guide, so
 * the visitor can verify the claim. No tool is here because of an affiliate
 * programme alone; the order is determined by fit to the visitor's answers.
 *
 * All logic is deterministic and runs in the browser. No randomness, no
 * network call, no cookie, no localStorage.
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: readonly QuizOption[];
}

export interface QuizOption {
  label: string;
  value: string;
}

export const QUESTIONS: readonly QuizQuestion[] = [
  {
    id: "usecase",
    question: "What do you mainly need AI for?",
    options: [
      { label: "Writing blog posts, emails, or marketing copy", value: "writing" },
      { label: "Running my small business more efficiently", value: "business" },
      { label: "Automating repetitive tasks and workflows", value: "automation" },
      { label: "Learning prompts and getting started with AI", value: "beginner" },
    ],
  },
  {
    id: "budget",
    question: "What is your monthly budget for AI tools?",
    options: [
      { label: "Free only — I do not want to pay", value: "free" },
      { label: "Under $25 per month", value: "low" },
      { label: "$25–$60 per month", value: "mid" },
      { label: "Over $60 per month", value: "high" },
    ],
  },
  {
    id: "experience",
    question: "How much experience do you have with AI tools?",
    options: [
      { label: "None — I have never used one", value: "none" },
      { label: "I have tried ChatGPT or similar a few times", value: "some" },
      { label: "I use AI tools regularly for work", value: "regular" },
      { label: "I build automations or use APIs", value: "advanced" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you?",
    options: [
      { label: "Quality of output — I want the best results", value: "quality" },
      { label: "Ease of use — I want something simple", value: "ease" },
      { label: "Price — I want the most value for money", value: "value" },
      { label: "Integrations — I want it to connect to my other tools", value: "integrations" },
    ],
  },
];

export interface ToolRecommendation {
  name: string;
  tagline: string;
  /** Why this tool fits the visitor's answers — generated per combination. */
  fit: string;
  /** One honest downside the visitor should know. */
  caveat: string;
  /** Path to the site's own review or guide. */
  guidePath: string;
  guideLabel: string;
  /** Plan or tier the recommendation assumes. */
  plan: string;
  /** Monthly cost of that plan, or "Free". */
  price: string;
}

interface ScoredTool {
  tool: ToolRecommendation;
  score: number;
}

/** The catalogue of tools the quiz can recommend, with scoring weights. */
interface ToolEntry {
  tool: ToolRecommendation;
  /** Scores per answer value. Higher = better fit. Missing = 0. */
  scores: Partial<Record<string, number>>;
}

const TOOLS: readonly ToolEntry[] = [
  {
    tool: {
      name: "ChatGPT (Free)",
      tagline: "The most popular AI assistant, with a capable free tier",
      fit: "",
      caveat: "The free tier uses an older model and has usage limits during peak hours.",
      guidePath: "/ai-business-tools/chatgpt-business-vs-plus/",
      guideLabel: "ChatGPT Business vs Plus: Which Plan?",
      plan: "Free tier",
      price: "Free",
    },
    scores: {
      writing: 3, business: 3, beginner: 5, automation: 1,
      free: 5, low: 3, mid: 1, high: 0,
      none: 5, some: 4, regular: 2, advanced: 1,
      ease: 5, quality: 2, value: 5, integrations: 1,
    },
  },
  {
    tool: {
      name: "ChatGPT Plus",
      tagline: "The full ChatGPT experience with the latest models",
      fit: "",
      caveat: "At $20/month it is the baseline price for a premium assistant, but you can get similar quality from Claude Pro at the same price.",
      guidePath: "/ai-business-tools/chatgpt-business-vs-plus/",
      guideLabel: "ChatGPT Business vs Plus",
      plan: "Plus",
      price: "$20/mo",
    },
    scores: {
      writing: 4, business: 4, beginner: 3, automation: 3,
      free: 0, low: 4, mid: 4, high: 3,
      none: 3, some: 4, regular: 5, advanced: 4,
      ease: 4, quality: 5, value: 3, integrations: 3,
    },
  },
  {
    tool: {
      name: "Claude Pro",
      tagline: "Anthropic's assistant — strong on long writing and analysis",
      fit: "",
      caveat: "Smaller plugin ecosystem than ChatGPT. Fewer integrations with third-party tools.",
      guidePath: "/ai-business-tools/claude-for-small-business/",
      guideLabel: "Claude for Small Business: 8 Workflows",
      plan: "Pro",
      price: "$20/mo",
    },
    scores: {
      writing: 5, business: 4, beginner: 2, automation: 2,
      free: 0, low: 4, mid: 4, high: 3,
      none: 2, some: 4, regular: 5, advanced: 4,
      ease: 4, quality: 5, value: 3, integrations: 2,
    },
  },
  {
    tool: {
      name: "Zapier",
      tagline: "Connect your apps and automate workflows without code",
      fit: "",
      caveat: "The free tier is very limited. Useful automations typically need the Starter plan at $20/month or more.",
      guidePath: "/ai-automation/zapier-ai-automation-examples/",
      guideLabel: "Zapier AI Automation Examples",
      plan: "Starter",
      price: "$20/mo",
    },
    scores: {
      writing: 0, business: 3, beginner: 1, automation: 5,
      free: 1, low: 3, mid: 4, high: 5,
      none: 1, some: 2, regular: 4, advanced: 5,
      ease: 3, quality: 3, value: 3, integrations: 5,
    },
  },
  {
    tool: {
      name: "Google Gemini (Free)",
      tagline: "Google's AI assistant with search integration built in",
      fit: "",
      caveat: "Output quality is inconsistent compared to ChatGPT and Claude, especially for longer content.",
      guidePath: "/getting-started/how-to-use-ai-tools/",
      guideLabel: "How to Use AI Tools: Beginner's Guide",
      plan: "Free tier",
      price: "Free",
    },
    scores: {
      writing: 2, business: 3, beginner: 4, automation: 1,
      free: 5, low: 3, mid: 1, high: 0,
      none: 5, some: 4, regular: 2, advanced: 1,
      ease: 5, quality: 2, value: 5, integrations: 2,
    },
  },
  {
    tool: {
      name: "Make (Integromat)",
      tagline: "Visual automation builder with deep integrations",
      fit: "",
      caveat: "Steeper learning curve than Zapier. Best for people comfortable with logic flows.",
      guidePath: "/ai-automation/best-ai-workflows-for-solopreneurs/",
      guideLabel: "AI Workflows for Solopreneurs",
      plan: "Core",
      price: "$9/mo",
    },
    scores: {
      writing: 0, business: 2, beginner: 0, automation: 5,
      free: 2, low: 4, mid: 4, high: 4,
      none: 0, some: 1, regular: 3, advanced: 5,
      ease: 1, quality: 3, value: 4, integrations: 5,
    },
  },
  {
    tool: {
      name: "Notion AI",
      tagline: "AI built into your workspace — writing, summaries, and databases",
      fit: "",
      caveat: "Only useful if you already use Notion. The AI add-on costs $10/month on top of your Notion plan.",
      guidePath: "/ai-business-tools/best-ai-tools-for-small-business/",
      guideLabel: "Best AI Tools for Small Business",
      plan: "Plus + AI",
      price: "$18/mo",
    },
    scores: {
      writing: 3, business: 4, beginner: 2, automation: 2,
      free: 0, low: 3, mid: 4, high: 3,
      none: 1, some: 3, regular: 4, advanced: 3,
      ease: 4, quality: 3, value: 3, integrations: 4,
    },
  },
];

function fitReason(answers: Record<string, string>): string {
  const reasons: string[] = [];
  const uc = answers.usecase;
  if (uc === "writing") reasons.push("strong at writing and editing tasks");
  else if (uc === "business") reasons.push("well suited for small business workflows");
  else if (uc === "automation") reasons.push("built for connecting tools and automating tasks");
  else if (uc === "beginner") reasons.push("beginner-friendly and easy to get started with");

  const budget = answers.budget;
  if (budget === "free") reasons.push("available on a free plan");
  else if (budget === "low") reasons.push("fits a budget under $25/month");

  const prio = answers.priority;
  if (prio === "quality") reasons.push("known for high output quality");
  else if (prio === "ease") reasons.push("simple to use with no setup");
  else if (prio === "integrations") reasons.push("connects to many other apps");
  else if (prio === "value") reasons.push("offers good value at its price point");

  return reasons.length > 0
    ? "This tool is " + reasons.join(", ") + "."
    : "A solid general-purpose option for your needs.";
}

/** Score every tool and return the top 3 matches. */
export function getRecommendations(
  answers: Record<string, string>,
): [ToolRecommendation, ToolRecommendation, ToolRecommendation] {
  const scored: ScoredTool[] = TOOLS.map(({ tool, scores }) => {
    let total = 0;
    for (const value of Object.values(answers)) {
      total += scores[value] ?? 0;
    }
    return { tool: { ...tool, fit: fitReason(answers) }, score: total };
  });

  scored.sort((a, b) => b.score - a.score);

  return [scored[0].tool, scored[1].tool, scored[2].tool];
}
