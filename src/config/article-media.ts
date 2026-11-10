/**
 * Article-level image registry.
 *
 * Separate from the main media registry in src/config/media.ts because the
 * provenance rule is different: every image here is a stock photograph from
 * Unsplash under the Unsplash License (free commercial use, no attribution
 * required - see https://unsplash.com/license). The owner-supplied pillar
 * artwork in media.ts stays in its own file so the two licensing regimes are
 * visible at a glance.
 *
 * Added 2026-11-08, when the owner asked for a hero image on every published
 * article rather than the pillar fallback that was shown at social-share time
 * but not on the article page itself. The route handler in
 * src/pages/[pillar]/[entry].astro passes an article's entry here through
 * ARTICLE_MEDIA_MAP; a missing key leaves the article page imageless rather
 * than failing the build, so a new article can ship before its image does.
 */
import type { ImageMetadata } from "astro";

import aiAgentUseCases from "@/assets/images/articles/ai-agent-use-cases.jpg";
import aiAgentsVsAutomation from "@/assets/images/articles/ai-agents-vs-automation.jpg";
import aiChatbotForSmallBusiness from "@/assets/images/articles/ai-chatbot-for-small-business.jpg";
import aiCustomerServiceAutomation from "@/assets/images/articles/ai-customer-service-automation.jpg";
import aiDisclosureToClients from "@/assets/images/articles/ai-disclosure-to-clients.jpg";
import aiNotetakerConsent from "@/assets/images/articles/ai-notetaker-consent.jpg";
import aiPromptExamples from "@/assets/images/articles/ai-prompt-examples.jpg";
import aiPromptsForAccountants from "@/assets/images/articles/ai-prompts-for-accountants.jpg";
import aiPromptsForContentWriting from "@/assets/images/articles/ai-prompts-for-content-writing.jpg";
import aiPromptsForFreelancers from "@/assets/images/articles/ai-prompts-for-freelancers.jpg";
import aiPromptsForRealEstateAgents from "@/assets/images/articles/ai-prompts-for-real-estate-agents.jpg";
import aiToolsForAccountantsPakistan from "@/assets/images/articles/ai-tools-for-accountants-pakistan.jpg";
import aiToolsForBeginners from "@/assets/images/articles/ai-tools-for-beginners.jpg";
import aiToolsForBlogWriting from "@/assets/images/articles/ai-tools-for-blog-writing.jpg";
import aiToolsForCleaningBusinesses from "@/assets/images/articles/ai-tools-for-cleaning-businesses.jpg";
import aiToolsForCoaches from "@/assets/images/articles/ai-tools-for-coaches.jpg";
import aiToolsForDentists from "@/assets/images/articles/ai-tools-for-dentists.jpg";
import aiToolsForEcommerce from "@/assets/images/articles/ai-tools-for-ecommerce.jpg";
import aiToolsForMarketing from "@/assets/images/articles/ai-tools-for-marketing.jpg";
import aiToolsForSmallBusiness from "@/assets/images/articles/ai-tools-for-small-business.jpg";
import aiToolsForTherapists from "@/assets/images/articles/ai-tools-for-therapists.jpg";
import aiToolsVsVirtualAssistant from "@/assets/images/articles/ai-tools-vs-virtual-assistant.jpg";
import aiUsePolicyTemplate from "@/assets/images/articles/ai-use-policy-template.jpg";
import automateInvoiceFollowUp from "@/assets/images/articles/automate-invoice-follow-up.jpg";
import bestAiAgentsForSmallBusiness from "@/assets/images/articles/best-ai-agents-for-small-business.jpg";
import bestAiAutomationTools from "@/assets/images/articles/best-ai-automation-tools.jpg";
import bestAiCopywritingTools from "@/assets/images/articles/best-ai-copywriting-tools.jpg";
import bestAiToolsForSmallBusiness from "@/assets/images/articles/best-ai-tools-for-small-business.jpg";
import bestAiWorkflowsForSolopreneurs from "@/assets/images/articles/best-ai-workflows-for-solopreneurs.jpg";
import bestAiWritingTools from "@/assets/images/articles/best-ai-writing-tools.jpg";
import bestFreeAiAgentsForSmallBusiness from "@/assets/images/articles/best-free-ai-agents-for-small-business.jpg";
import chatgptAgentModeForSmallBusiness from "@/assets/images/articles/chatgpt-agent-mode-for-small-business.jpg";
import chatgptBusinessVsPlus from "@/assets/images/articles/chatgpt-business-vs-plus.jpg";
import chatgptPromptsForSmallBusiness from "@/assets/images/articles/chatgpt-prompts-for-small-business.jpg";
import claudeDuetVsOpenaiDotsVsMetaMuse from "@/assets/images/articles/claude-duet-vs-openai-dots-vs-meta-muse.jpg";
import claudeForSmallBusiness from "@/assets/images/articles/claude-for-small-business.jpg";
import claudeVsChatgptForSmallBusiness from "@/assets/images/articles/claude-vs-chatgpt-for-small-business.jpg";
import customGptsRetiring from "@/assets/images/articles/custom-gpts-retiring.jpg";
import howMuchDoesAiCostSmallBusiness from "@/assets/images/articles/how-much-does-ai-cost-small-business.jpg";
import howMuchTimeDoesAiSave from "@/assets/images/articles/how-much-time-does-ai-save.jpg";
import howToAutomateEmailWithAi from "@/assets/images/articles/how-to-automate-email-with-ai.jpg";
import howToUseAiTools from "@/assets/images/articles/how-to-use-ai-tools.jpg";
import howToWriteEffectiveAiPrompts from "@/assets/images/articles/how-to-write-effective-ai-prompts.jpg";
import isChatgptSafeForBusinessData from "@/assets/images/articles/is-chatgpt-safe-for-business-data.jpg";
import jasperVsClaudeVsChatgpt from "@/assets/images/articles/jasper-vs-claude-vs-chatgpt.jpg";
import jensenHuangNvidiaSpyScandal from "@/assets/images/articles/jensen-huang-nvidia-spy-scandal-explained.jpg";
import makeAiWritingSoundHuman from "@/assets/images/articles/make-ai-writing-sound-human.jpg";
import n8nVsZapierVsMake from "@/assets/images/articles/n8n-vs-zapier-vs-make.jpg";
import php2shellAiFoundPhpFlaw from "@/assets/images/articles/php2shell-ai-found-php-flaw.jpg";
import whoIsAliceHuangNvidiaSpy from "@/assets/images/articles/who-is-alice-huang-nvidia-spy.jpg";
import signatoroEmailSignatureGuide from "@/assets/images/articles/signatoro-email-signature-guide.jpg";
import whatAiCannotDo from "@/assets/images/articles/what-ai-cannot-do.jpg";
import whatIsClaudeDuet from "@/assets/images/articles/what-is-claude-duet.jpg";
import zapierAiAutomationExamples from "@/assets/images/articles/zapier-ai-automation-examples.jpg";

import type { PageId } from "./pages";

export interface ArticleMediaAsset {
  src: ImageMetadata;
  alt: string;
}

/**
 * Keyed by article page id (same as the MDX file's slug). Adding a new article
 * is: download the image into src/assets/images/articles/, import it above,
 * and add its row here. The route handler in src/pages/[pillar]/[entry].astro
 * reads this map; an id missing from the map renders the article without a
 * hero, which is a graceful degradation rather than a build failure.
 */
export const ARTICLE_MEDIA: Partial<Record<PageId, ArticleMediaAsset>> = {
  "ai-agent-use-cases": {
    src: aiAgentUseCases,
    alt: "Close-up of a circuit board illuminated from behind, representing automated agent workflows.",
  },
  "ai-agents-vs-automation": {
    src: aiAgentsVsAutomation,
    alt: "A humanoid service robot in a public lobby, standing beside a tablet display.",
  },
  "ai-chatbot-for-small-business": {
    src: aiChatbotForSmallBusiness,
    alt: "A customer paying at a café counter on a tablet point-of-sale system, with a barista standing beside them.",
  },
  "ai-customer-service-automation": {
    src: aiCustomerServiceAutomation,
    alt: "A support agent at a desk wearing a headset, viewed over their shoulder at the monitor.",
  },
  "ai-disclosure-to-clients": {
    src: aiDisclosureToClients,
    alt: "Two people reaching out with their hands almost touching, between tall concrete pillars.",
  },
  "ai-notetaker-consent": {
    src: aiNotetakerConsent,
    alt: "An open notebook with handwritten notes sitting on a wooden desk beside a cup of coffee.",
  },
  "ai-prompt-examples": {
    src: aiPromptExamples,
    alt: "An open journal with a fountain pen resting on it, writing on a blank page.",
  },
  "ai-prompts-for-accountants": {
    src: aiPromptsForAccountants,
    alt: "A spiral-bound notebook on a wooden desk with a pen and a small succulent plant.",
  },
  "ai-prompts-for-content-writing": {
    src: aiPromptsForContentWriting,
    alt: "An open journal with a fountain pen resting on it, writing on a blank page.",
  },
  "ai-prompts-for-freelancers": {
    src: aiPromptsForFreelancers,
    alt: "A laptop and notebook on a plain desk, set up for a freelancer's working session.",
  },
  "ai-prompts-for-real-estate-agents": {
    src: aiPromptsForRealEstateAgents,
    alt: "A modern suburban house with a lawn in front, photographed under a clear sky.",
  },
  "ai-tools-for-accountants-pakistan": {
    src: aiToolsForAccountantsPakistan,
    alt: "A hand using a calculator beside a notebook and a laptop keyboard on a desk.",
  },
  "ai-tools-for-beginners": {
    src: aiToolsForBeginners,
    alt: "A person taking notes at a laptop, learning something new at a bright workspace.",
  },
  "ai-tools-for-blog-writing": {
    src: aiToolsForBlogWriting,
    alt: "A laptop on a wooden desk showing a text editor, with a cup of coffee and notebook beside it.",
  },
  "ai-tools-for-cleaning-businesses": {
    src: aiToolsForCleaningBusinesses,
    alt: "A person wearing gloves and a mask wiping a window pane, with daylight coming through.",
  },
  "ai-tools-for-coaches": {
    src: aiToolsForCoaches,
    alt: "A small group of people around a table with sticky notes on a wall behind them.",
  },
  "ai-tools-for-dentists": {
    src: aiToolsForDentists,
    alt: "A close-up of someone placing a clear dental aligner, framed against a yellow background.",
  },
  "ai-tools-for-ecommerce": {
    src: aiToolsForEcommerce,
    alt: "Shopping bags placed on a plain surface, representing an online retail transaction.",
  },
  "ai-tools-for-marketing": {
    src: aiToolsForMarketing,
    alt: "A laptop screen showing a line and bar chart dashboard, placed on a desk.",
  },
  "ai-tools-for-small-business": {
    src: aiToolsForSmallBusiness,
    alt: "A small team working around a shared table in a bright, open office space.",
  },
  "ai-tools-for-therapists": {
    src: aiToolsForTherapists,
    alt: "Two hands reaching out towards one another between tall concrete pillars, almost touching.",
  },
  "ai-tools-vs-virtual-assistant": {
    src: aiToolsVsVirtualAssistant,
    alt: "Three people's hands stacked and gripping one another's wrists, suggesting teamwork between humans.",
  },
  "ai-use-policy-template": {
    src: aiUsePolicyTemplate,
    alt: "A stack of printed documents with a pen resting on the top page, laid out on a desk.",
  },
  "automate-invoice-follow-up": {
    src: automateInvoiceFollowUp,
    alt: "A hand holding a pen over an invoice on a desk, beside a calculator and a mug.",
  },
  "best-ai-agents-for-small-business": {
    src: bestAiAgentsForSmallBusiness,
    alt: "An expressive white robot head in a softly lit indoor setting, facing the camera.",
  },
  "best-ai-automation-tools": {
    src: bestAiAutomationTools,
    alt: "Overlapping gears and mechanical parts arranged in an abstract engineering composition.",
  },
  "best-ai-copywriting-tools": {
    src: bestAiCopywritingTools,
    alt: "A hand writing in a lined notebook with a pen, with coffee and papers at the edge of the frame.",
  },
  "best-ai-tools-for-small-business": {
    src: bestAiToolsForSmallBusiness,
    alt: "A person at a laptop in a casual workspace, with a notebook and mug beside them.",
  },
  "best-ai-workflows-for-solopreneurs": {
    src: bestAiWorkflowsForSolopreneurs,
    alt: "A tidy home-office desk with a laptop, lamp, notebook and a chair tucked under it.",
  },
  "best-ai-writing-tools": {
    src: bestAiWritingTools,
    alt: "A writer's hand with a pen poised above an open notebook on a clean desk.",
  },
  "best-free-ai-agents-for-small-business": {
    src: bestFreeAiAgentsForSmallBusiness,
    alt: "A close-up of a circuit board illuminated from behind, representing software agents.",
  },
  "chatgpt-agent-mode-for-small-business": {
    src: chatgptAgentModeForSmallBusiness,
    alt: "A large 3D sculpture of the letters A and I in deep blue, standing on a reflective surface.",
  },
  "chatgpt-business-vs-plus": {
    src: chatgptBusinessVsPlus,
    alt: "A hand holding a pen hovering over an invoice document on a clean wooden desk.",
  },
  "chatgpt-prompts-for-small-business": {
    src: chatgptPromptsForSmallBusiness,
    alt: "A laptop on a desk showing a dashboard view, lit by soft natural light.",
  },
  "claude-duet-vs-openai-dots-vs-meta-muse": {
    src: claudeDuetVsOpenaiDotsVsMetaMuse,
    alt: "An abstract 3D illustration of overlapping geometric shapes in purple and blue tones.",
  },
  "claude-for-small-business": {
    src: claudeForSmallBusiness,
    alt: "Overlapping gears and mechanical parts arranged in an abstract engineering composition.",
  },
  "claude-vs-chatgpt-for-small-business": {
    src: claudeVsChatgptForSmallBusiness,
    alt: "A humanoid robot seated on a wooden bench, reaching forward with a book or tablet in its hands.",
  },
  "custom-gpts-retiring": {
    src: customGptsRetiring,
    alt: "An open paper planner on a desk with a pen and coffee cup, representing a date-driven deadline.",
  },
  "how-much-does-ai-cost-small-business": {
    src: howMuchDoesAiCostSmallBusiness,
    alt: "A young plant growing out of a pile of copper coins, representing a small budget producing growth.",
  },
  "how-much-time-does-ai-save": {
    src: howMuchTimeDoesAiSave,
    alt: "A plain wall-mounted clock showing an unspecified time, lit in warm light.",
  },
  "how-to-automate-email-with-ai": {
    src: howToAutomateEmailWithAi,
    alt: "A smartphone and laptop on a desk, with notification icons suggesting email activity.",
  },
  "how-to-use-ai-tools": {
    src: howToUseAiTools,
    alt: "A close-up of a laptop screen showing lines of code, lit by its own display.",
  },
  "how-to-write-effective-ai-prompts": {
    src: howToWriteEffectiveAiPrompts,
    alt: "An open leather-bound book laid flat, photographed from above on a plain surface.",
  },
  "is-chatgpt-safe-for-business-data": {
    src: isChatgptSafeForBusinessData,
    alt: "A close-up of a padlock sitting on a laptop keyboard, representing data security.",
  },
  "jasper-vs-claude-vs-chatgpt": {
    src: jasperVsClaudeVsChatgpt,
    alt: "Three closed books stacked together on a plain surface, suggesting a three-way comparison.",
  },
  "make-ai-writing-sound-human": {
    src: makeAiWritingSoundHuman,
    alt: "A closed notebook with a pen resting on top, photographed on a wooden desk.",
  },
  "n8n-vs-zapier-vs-make": {
    src: n8nVsZapierVsMake,
    alt: "An abstract pattern of interconnected lines and nodes, representing workflow automation.",
  },
  "jensen-huang-nvidia-spy-scandal-explained": {
    src: jensenHuangNvidiaSpyScandal,
    alt: "A close-up of a circuit board with microchips and electronic components, teal-toned.",
  },
  "php2shell-ai-found-php-flaw": {
    src: php2shellAiFoundPhpFlaw,
    alt: "A detailed close-up of a backlit circuit-board schematic, rendered in cool colours.",
  },
  "signatoro-email-signature-guide": {
    src: signatoroEmailSignatureGuide,
    alt: "A close-up of a laptop showing an email application, photographed from an angle.",
  },
  "who-is-alice-huang-nvidia-spy": {
    src: whoIsAliceHuangNvidiaSpy,
    alt: "A dark cybersecurity-themed image with glowing digital data streams and circuit patterns.",
  },
  "what-ai-cannot-do": {
    src: whatAiCannotDo,
    alt: "A person seated on a wooden bench reading an open broadsheet newspaper, face obscured.",
  },
  "what-is-claude-duet": {
    src: whatIsClaudeDuet,
    alt: "An abstract rendering of a glowing AI-themed geometric form in blue and purple tones.",
  },
  "zapier-ai-automation-examples": {
    src: zapierAiAutomationExamples,
    alt: "An abstract composition of connected lines and shapes suggesting a workflow diagram.",
  },
};

/** True if we have a hero image registered for this article page id. */
export function hasArticleMedia(id: string): boolean {
  return Object.hasOwn(ARTICLE_MEDIA, id);
}
