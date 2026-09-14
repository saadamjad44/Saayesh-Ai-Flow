import React, { useState } from "react";

const SECTIONS = [
  {
    id: "architecture",
    label: "Site Architecture",
    icon: "🏗️",
  },
  {
    id: "pages",
    label: "Page Blueprint",
    icon: "📄",
  },
  {
    id: "sitemap",
    label: "Visual Sitemap",
    icon: "🗺️",
  },
  {
    id: "urls",
    label: "URL Structure",
    icon: "🔗",
  },
  {
    id: "linking",
    label: "Internal Linking",
    icon: "🕸️",
  },
  {
    id: "nav",
    label: "Navigation",
    icon: "☰",
  },
];

// --- PAGE DATA ---
const PAGES_DATA = {
  core: [
    {
      title: "Homepage",
      url: "/",
      purpose: "Central hub. Establishes topical authority, surfaces fresh content, and funnels visitors to high-value category and tool pages.",
      sections: [
        "Hero headline + value proposition (\"Find the right AI tool — without the hype\")",
        "Featured/latest articles row (3–4 cards, auto-updated)",
        "Category quick-links grid (icons + short descriptions linking to each pillar)",
        "\"Popular Comparisons\" horizontal scroll (drives clicks to high-converting pages)",
        "Email opt-in banner (lead magnet: free prompt library or automation starter kit)",
        "Trust signals row (\"500+ tools reviewed\", \"Updated weekly\", \"No sponsored rankings\")",
      ],
      seo: "Target branded + navigational intent. Title: \"AIToolStack — Find the Best AI Tools for Work, Business & Automation\"",
    },
    {
      title: "About",
      url: "/about/",
      purpose: "Build E-E-A-T trust. Explain the editorial process, who runs the site, and why reviews are trustworthy. No face required — focus on methodology and values.",
      sections: [
        "Mission statement (why this site exists)",
        "Editorial process (how tools are tested and scored)",
        "Monetization transparency (\"We earn from affiliate links. Rankings are never paid.\")",
        "Contact CTA",
      ],
      seo: "Supports E-E-A-T. Not a traffic page — an authority page Google's quality raters look for.",
    },
    {
      title: "Contact",
      url: "/contact/",
      purpose: "Simple contact form. Enables tool companies to submit products, readers to report errors, and advertisers to inquire.",
      sections: [
        "Contact form (name, email, subject dropdown, message)",
        "Subject options: General, Tool Submission, Correction, Business Inquiry",
        "Estimated response time",
      ],
      seo: "Low-traffic utility page. Required for Google AdSense/Mediavine approval.",
    },
    {
      title: "Privacy Policy",
      url: "/privacy-policy/",
      purpose: "Legal compliance for ads, affiliate links, cookies, and analytics. Required by every ad network.",
      sections: [
        "Data collection disclosure",
        "Cookie policy (analytics, ad network cookies)",
        "Third-party services (Google Analytics, ad networks, affiliate platforms)",
        "User rights (GDPR, CCPA)",
      ],
      seo: "Noindex — legal utility page. Required for Mediavine/Raptive/AdSense approval.",
    },
    {
      title: "Terms of Service",
      url: "/terms/",
      purpose: "Liability protection. Disclaims responsibility for tool recommendations, affiliate relationships.",
      sections: [
        "Content disclaimer (informational, not professional advice)",
        "Affiliate disclosure",
        "Intellectual property notice",
        "Limitation of liability",
      ],
      seo: "Noindex — legal utility page.",
    },
    {
      title: "Affiliate Disclosure",
      url: "/affiliate-disclosure/",
      purpose: "FTC compliance. Transparent statement about how the site earns money. Links from every review/comparison page.",
      sections: [
        "Clear explanation of affiliate relationships",
        "Statement that rankings are not influenced by commissions",
        "List of affiliate programs used",
      ],
      seo: "Noindex — compliance page. Linked from site footer and every review article.",
    },
  ],
  categories: [
    {
      title: "AI Writing Tools",
      url: "/ai-writing-tools/",
      children: [
        "/ai-writing-tools/best-ai-writing-tools/",
        "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
        "/ai-writing-tools/best-ai-copywriting-tools/",
        "/ai-writing-tools/ai-tools-for-blog-writing/",
        "/ai-writing-tools/grammarly-review/",
      ],
      pillar: "Comprehensive hub page linking to all writing-tool reviews, comparisons, and tutorials. Opens with a curated \"best of\" summary table, then category-specific sub-sections.",
    },
    {
      title: "AI for Business & Productivity",
      url: "/ai-business-tools/",
      children: [
        "/ai-business-tools/best-ai-tools-for-small-business/",
        "/ai-business-tools/notion-ai-vs-clickup-ai-vs-monday-ai/",
        "/ai-business-tools/ai-tools-vs-virtual-assistant/",
        "/ai-business-tools/best-ai-meeting-assistants/",
        "/ai-business-tools/how-much-does-ai-cost-small-business/",
      ],
      pillar: "Hub for productivity and operational AI tools. Targets business owners with buying intent.",
    },
    {
      title: "AI Automation & Workflows",
      url: "/ai-automation/",
      children: [
        "/ai-automation/zapier-ai-automation-examples/",
        "/ai-automation/make-vs-zapier-for-ai/",
        "/ai-automation/how-to-automate-email-with-ai/",
        "/ai-automation/best-ai-workflows-for-solopreneurs/",
        "/ai-automation/automate-social-media-with-ai/",
      ],
      pillar: "Hub for automation tutorials and platform comparisons. High affiliate potential with Zapier, Make, and n8n programs.",
    },
    {
      title: "AI by Industry",
      url: "/ai-by-industry/",
      children: [
        "/ai-by-industry/ai-tools-for-real-estate/",
        "/ai-by-industry/ai-tools-for-hr-recruiting/",
        "/ai-by-industry/ai-for-bookkeeping/",
        "/ai-by-industry/ai-tools-for-teachers/",
        "/ai-by-industry/ai-tools-for-lawyers/",
      ],
      pillar: "Low-competition, high-value cluster. Each industry page targets a specific professional audience that is actively buying tools.",
    },
    {
      title: "AI Prompts & Templates",
      url: "/ai-prompts/",
      children: [
        "/ai-prompts/best-chatgpt-prompts-for-marketing/",
        "/ai-prompts/ai-prompt-templates-for-sales/",
        "/ai-prompts/chatgpt-prompts-for-writing/",
        "/ai-prompts/how-to-write-better-ai-prompts/",
      ],
      pillar: "Content hub + digital product funnel. Free prompts in articles drive traffic; premium prompt packs sold as digital products.",
    },
    {
      title: "Getting Started with AI",
      url: "/getting-started/",
      children: [
        "/getting-started/what-is-ai-automation/",
        "/getting-started/best-beginner-ai-tools/",
        "/getting-started/is-ai-safe-for-business-data/",
        "/getting-started/how-to-create-a-course-with-ai/",
        "/getting-started/will-ai-replace-my-job/",
      ],
      pillar: "Top-of-funnel informational content. Captures early-stage searchers and funnels them to tool reviews. Builds topical authority breadth.",
    },
  ],
  tools: [
    { title: "AI Tool Finder (Interactive)", url: "/tool-finder/", desc: "Guided quiz: answer 3–4 questions (use case, budget, team size) → personalized recommendations. High engagement, high affiliate conversion." },
    { title: "AI Tool Comparison Generator", url: "/compare/", desc: "URL pattern: /compare/jasper-vs-copy-ai/. Dynamic comparison pages for any two tools. Scalable to hundreds of keyword combinations." },
    { title: "Free Prompt Library", url: "/prompt-library/", desc: "Searchable/filterable database of free prompts. Lead magnet to capture emails. Upsell to premium prompt packs." },
    { title: "AI Savings Calculator", url: "/ai-savings-calculator/", desc: "Interactive calculator: input hours spent on tasks → see estimated time/money saved with AI. Shareable results drive backlinks." },
  ],
};

const URLS = [
  { pattern: "/", example: "aitoolstack.com/", notes: "Homepage" },
  { pattern: "/[category]/", example: "/ai-writing-tools/", notes: "Category pillar page (6 categories)" },
  { pattern: "/[category]/[article]/", example: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/", notes: "Article nested under category" },
  { pattern: "/reviews/[tool-name]/", example: "/reviews/jasper/", notes: "Individual tool review pages" },
  { pattern: "/compare/[tool-a]-vs-[tool-b]/", example: "/compare/jasper-vs-copy-ai/", notes: "Programmatic comparison pages" },
  { pattern: "/blog/[post-slug]/", example: "/blog/ai-trends-september-2026/", notes: "Blog posts (news, opinion, tutorials)" },
  { pattern: "/tool-finder/", example: "/tool-finder/", notes: "Interactive recommendation quiz" },
  { pattern: "/prompt-library/", example: "/prompt-library/", notes: "Searchable prompt database" },
  { pattern: "/about/", example: "/about/", notes: "About / editorial process" },
  { pattern: "/contact/", example: "/contact/", notes: "Contact form" },
  { pattern: "/privacy-policy/", example: "/privacy-policy/", notes: "Privacy (noindex)" },
  { pattern: "/terms/", example: "/terms/", notes: "Terms of service (noindex)" },
  { pattern: "/affiliate-disclosure/", example: "/affiliate-disclosure/", notes: "FTC compliance (noindex)" },
];

const LINKING_RULES = [
  {
    name: "Pillar ↔ Cluster",
    desc: "Every category pillar page links to all articles in its cluster. Every article links back to its parent pillar. This creates a tight topical silo that Google understands.",
    example: "/ai-writing-tools/ ↔ /ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
    color: "#6366f1",
  },
  {
    name: "Cross-Cluster Contextual",
    desc: "When an article mentions a topic from another cluster, link to the most relevant article in that cluster. Limit to 1–2 cross-cluster links per article to keep silos strong.",
    example: "Article about Zapier automations mentions AI writing → link to /ai-writing-tools/best-ai-writing-tools/",
    color: "#059669",
  },
  {
    name: "Tool Pages ↔ Reviews",
    desc: "Every tool mentioned in a listicle or comparison links to its dedicated /reviews/[tool]/ page. Each review page links back to the relevant category pillar.",
    example: "\"Best AI Writing Tools\" mentions Jasper → links to /reviews/jasper/",
    color: "#d97706",
  },
  {
    name: "Comparison Hub",
    desc: "The /compare/ section uses a scalable URL pattern. Each comparison page links to both individual tool reviews AND the parent category page.",
    example: "/compare/jasper-vs-copy-ai/ → /reviews/jasper/ + /reviews/copy-ai/ + /ai-writing-tools/",
    color: "#dc2626",
  },
  {
    name: "Blog → Evergreen",
    desc: "Blog posts (news, trends, opinion) always link to at least 2 evergreen articles in the main clusters. This passes link equity from timely content to permanent pages.",
    example: "Blog post about new AI features → links to /ai-business-tools/best-ai-tools-for-small-business/",
    color: "#7c3aed",
  },
  {
    name: "Homepage Recency",
    desc: "Homepage auto-displays the 4 most recent articles and 4 most popular comparisons. This keeps the homepage fresh for crawlers and surfaces new content quickly.",
    example: "Homepage → latest 4 articles + top 4 comparisons (dynamically updated)",
    color: "#0891b2",
  },
];

const NAV_ITEMS = {
  primary: [
    { label: "AI Writing Tools", url: "/ai-writing-tools/", mega: true },
    { label: "Business & Productivity", url: "/ai-business-tools/", mega: true },
    { label: "Automation", url: "/ai-automation/", mega: true },
    { label: "AI by Industry", url: "/ai-by-industry/", mega: true },
    { label: "Tool Finder", url: "/tool-finder/", highlight: true },
  ],
  secondary: ["Prompts & Templates", "Getting Started", "Blog"],
  footer: [
    ["Categories", "AI Writing Tools", "Business & Productivity", "Automation", "AI by Industry", "Prompts", "Getting Started"],
    ["Resources", "Tool Finder", "Compare Tools", "Prompt Library", "AI Savings Calculator", "Blog"],
    ["Company", "About", "Contact", "Affiliate Disclosure", "Privacy Policy", "Terms"],
  ],
};

// --- SITEMAP TREE ---
const SITEMAP_TREE = [
  {
    label: "Homepage",
    url: "/",
    type: "core",
    children: [
      {
        label: "AI Writing Tools",
        url: "/ai-writing-tools/",
        type: "category",
        children: [
          { label: "Best AI Writing Tools", type: "article" },
          { label: "Jasper vs Claude vs ChatGPT", type: "article" },
          { label: "Best AI Copywriting Tools", type: "article" },
          { label: "AI Tools for Blog Writing", type: "article" },
          { label: "Grammarly Review 2026", type: "article" },
        ],
      },
      {
        label: "AI Business Tools",
        url: "/ai-business-tools/",
        type: "category",
        children: [
          { label: "Best AI for Small Business", type: "article" },
          { label: "Notion AI vs ClickUp AI vs Monday AI", type: "article" },
          { label: "AI Tools vs Virtual Assistant", type: "article" },
          { label: "Best AI Meeting Assistants", type: "article" },
          { label: "How Much Does AI Cost?", type: "article" },
        ],
      },
      {
        label: "AI Automation",
        url: "/ai-automation/",
        type: "category",
        children: [
          { label: "Zapier AI Automation Examples", type: "article" },
          { label: "Make vs Zapier for AI", type: "article" },
          { label: "Automate Email With AI", type: "article" },
          { label: "AI Workflows for Solopreneurs", type: "article" },
          { label: "Automate Social Media With AI", type: "article" },
        ],
      },
      {
        label: "AI by Industry",
        url: "/ai-by-industry/",
        type: "category",
        children: [
          { label: "AI for Real Estate", type: "article" },
          { label: "AI for HR & Recruiting", type: "article" },
          { label: "AI for Bookkeeping", type: "article" },
          { label: "AI for Teachers", type: "article" },
          { label: "AI for Lawyers", type: "article" },
        ],
      },
      {
        label: "AI Prompts",
        url: "/ai-prompts/",
        type: "category",
        children: [
          { label: "ChatGPT Prompts for Marketing", type: "article" },
          { label: "AI Prompts for Sales", type: "article" },
          { label: "ChatGPT Prompts for Writing", type: "article" },
          { label: "How to Write Better Prompts", type: "article" },
        ],
      },
      {
        label: "Getting Started",
        url: "/getting-started/",
        type: "category",
        children: [
          { label: "What Is AI Automation?", type: "article" },
          { label: "Best Beginner AI Tools", type: "article" },
          { label: "Is AI Safe for Business Data?", type: "article" },
          { label: "Create a Course With AI", type: "article" },
        ],
      },
      {
        label: "Tool Pages",
        type: "tool",
        children: [
          { label: "Tool Finder Quiz", type: "tool" },
          { label: "Compare Tools (/compare/)", type: "tool" },
          { label: "Prompt Library", type: "tool" },
          { label: "AI Savings Calculator", type: "tool" },
        ],
      },
      {
        label: "Blog",
        url: "/blog/",
        type: "blog",
        children: [
          { label: "Weekly: New Tools Roundup", type: "blog" },
          { label: "Monthly: Trends & Analysis", type: "blog" },
          { label: "Tutorials & How-Tos", type: "blog" },
          { label: "Case Studies", type: "blog" },
        ],
      },
      {
        label: "Utility Pages",
        type: "utility",
        children: [
          { label: "About", type: "utility" },
          { label: "Contact", type: "utility" },
          { label: "Privacy Policy", type: "utility" },
          { label: "Terms", type: "utility" },
          { label: "Affiliate Disclosure", type: "utility" },
        ],
      },
    ],
  },
];

// --- COMPONENTS ---

const typeColors = {
  core: { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6" },
  category: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  article: { bg: "#f0fdf4", text: "#166534", dot: "#22c55e" },
  tool: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  blog: { bg: "#fce7f3", text: "#9d174d", dot: "#ec4899" },
  utility: { bg: "#f3f4f6", text: "#4b5563", dot: "#9ca3af" },
};

function TreeNode({ node, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const c = typeColors[node.type] || typeColors.utility;
  const hasKids = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: depth > 0 ? 16 : 0 }}>
      <div
        onClick={() => hasKids && setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "5px 8px",
          marginBottom: 2,
          borderRadius: 6,
          cursor: hasKids ? "pointer" : "default",
          backgroundColor: "transparent",
          transition: "background-color 0.1s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = c.bg)}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        {hasKids && (
          <span style={{ fontSize: 10, color: "#9ca3af", width: 12, textAlign: "center", flexShrink: 0 }}>
            {open ? "▼" : "▶"}
          </span>
        )}
        {!hasKids && <span style={{ width: 12, flexShrink: 0 }} />}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: c.dot,
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: 13, fontWeight: depth < 2 ? 600 : 400, color: "var(--text-primary, #1e293b)" }}>
          {node.label}
        </span>
        {node.url && (
          <span style={{ fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{node.url}</span>
        )}
      </div>
      {open && hasKids && node.children.map((child, i) => <TreeNode key={i} node={child} depth={depth + 1} />)}
    </div>
  );
}

function SitemapLegend() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12, padding: "8px 0" }}>
      {Object.entries(typeColors).map(([k, v]) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: v.text }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: v.dot }} />
          <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{k === "core" ? "Home" : k}</span>
        </div>
      ))}
    </div>
  );
}

function PageCard({ page }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "1px solid var(--border-light, #e2e8f0)",
        borderRadius: 8,
        marginBottom: 8,
        overflow: "hidden",
      }}
    >
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          cursor: "pointer",
          backgroundColor: open ? "var(--bg-subtle, #f8fafc)" : "var(--bg-card, #fff)",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)" }}>{page.title}</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#64748b", marginTop: 2 }}>{page.url}</div>
        </div>
        <span style={{ fontSize: 14, color: "#94a3b8" }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border-light, #e2e8f0)" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", margin: "10px 0 8px", lineHeight: 1.5 }}>
            {page.purpose}
          </div>
          {page.sections && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4, letterSpacing: "0.04em" }}>
                PAGE SECTIONS
              </div>
              {page.sections.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: "var(--text-primary, #334155)", padding: "3px 0 3px 12px", borderLeft: "2px solid #e2e8f0", marginBottom: 2, lineHeight: 1.45 }}>
                  {s}
                </div>
              ))}
            </div>
          )}
          {page.seo && (
            <div style={{ fontSize: 12, padding: "8px 10px", backgroundColor: "#eff6ff", borderRadius: 6, color: "#1e40af", lineHeight: 1.45, border: "1px solid #bfdbfe" }}>
              <span style={{ fontWeight: 600 }}>SEO note:</span> {page.seo}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryCard({ cat }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--border-light, #e2e8f0)", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 14px",
          cursor: "pointer",
          backgroundColor: open ? "#eef2ff" : "var(--bg-card, #fff)",
          borderLeft: "3px solid #6366f1",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)" }}>{cat.title}</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#6366f1", marginTop: 2 }}>{cat.url}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#64748b", backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
            {cat.children.length} articles
          </span>
          <span style={{ fontSize: 14, color: "#94a3b8" }}>{open ? "▲" : "▼"}</span>
        </div>
      </div>
      {open && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid var(--border-light, #e2e8f0)" }}>
          <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", margin: "10px 0 10px", lineHeight: 1.5 }}>
            {cat.pillar}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 6, letterSpacing: "0.04em" }}>
            PLANNED ARTICLES
          </div>
          {cat.children.map((url, i) => (
            <div key={i} style={{ fontFamily: "monospace", fontSize: 12, color: "#475569", padding: "4px 0 4px 12px", borderLeft: "2px solid #c7d2fe", marginBottom: 2 }}>
              {url}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkingRule({ rule }) {
  return (
    <div style={{ padding: "10px 14px", border: "1px solid var(--border-light, #e2e8f0)", borderRadius: 8, marginBottom: 8, borderLeft: `3px solid ${rule.color}` }}>
      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)", marginBottom: 4 }}>{rule.name}</div>
      <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.5, marginBottom: 6 }}>{rule.desc}</div>
      <div style={{ fontFamily: "monospace", fontSize: 11, color: "#64748b", backgroundColor: "var(--bg-subtle, #f8fafc)", padding: "6px 8px", borderRadius: 4 }}>
        {rule.example}
      </div>
    </div>
  );
}

// --- SECTION RENDERERS ---

function ArchitectureSection() {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 16px" }}>
        The site uses a hub-and-spoke (pillar-cluster) architecture. Six category pillar pages sit one level below the homepage. Each pillar owns a cluster of 4–5 articles targeting specific keywords. Tool pages and the blog sit alongside the pillars as separate spokes. This structure gives Google clear topical signals and lets you scale to 100+ pages without diluting authority.
      </p>

      <div style={{ padding: "14px 16px", backgroundColor: "var(--bg-subtle, #f8fafc)", borderRadius: 8, border: "1px solid var(--border-light, #e2e8f0)", marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>DEPTH STRUCTURE</div>
        {[
          { depth: "Level 0", page: "Homepage", count: "1 page", note: "Central hub linking to everything" },
          { depth: "Level 1", page: "Category Pillars + Tools + Blog", count: "~12 pages", note: "Main navigation destinations" },
          { depth: "Level 2", page: "Articles + Reviews + Blog Posts", count: "30–50+ pages", note: "Individual keyword targets" },
          { depth: "Level 3", page: "Comparison Pages (programmatic)", count: "50–200+ pages", note: "Scalable /compare/ pattern" },
        ].map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "72px 1fr 80px", gap: 8, padding: "6px 0", borderBottom: i < 3 ? "1px solid var(--border-light, #e2e8f0)" : "none", fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: "#6366f1", fontSize: 12 }}>{row.depth}</span>
            <div>
              <span style={{ fontWeight: 600, color: "var(--text-primary, #0f172a)" }}>{row.page}</span>
              <span style={{ color: "#94a3b8", marginLeft: 6, fontSize: 12 }}>— {row.note}</span>
            </div>
            <span style={{ fontSize: 12, color: "#64748b", textAlign: "right" }}>{row.count}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>KEY ARCHITECTURE RULES</div>
      {[
        "Every page is reachable within 3 clicks from the homepage",
        "No orphan pages — every article belongs to a category cluster",
        "Category pillar pages are NOT thin index pages — they contain 1,500–2,500 words of original content with curated summaries of each article in the cluster",
        "The /compare/ section uses a programmatic template — one template, hundreds of pages as the tool database grows",
        "Blog posts are timely content (news, trends) that link INTO the evergreen pillar/cluster structure, passing link equity to permanent pages",
        "All legal/utility pages are noindexed — they exist for compliance, not rankings",
      ].map((rule, i) => (
        <div key={i} style={{ fontSize: 13, color: "var(--text-primary, #334155)", padding: "4px 0 4px 12px", borderLeft: "2px solid #c7d2fe", marginBottom: 4, lineHeight: 1.45 }}>
          {rule}
        </div>
      ))}
    </div>
  );
}

function PagesSection() {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>
        CORE PAGES
      </div>
      {PAGES_DATA.core.map((p, i) => <PageCard key={i} page={p} />)}

      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", margin: "20px 0 8px", letterSpacing: "0.04em" }}>
        CATEGORY PILLAR PAGES (6)
      </div>
      {PAGES_DATA.categories.map((c, i) => <CategoryCard key={i} cat={c} />)}

      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", margin: "20px 0 8px", letterSpacing: "0.04em" }}>
        INTERACTIVE TOOL PAGES (4)
      </div>
      {PAGES_DATA.tools.map((t, i) => (
        <div key={i} style={{ padding: "10px 14px", border: "1px solid var(--border-light, #e2e8f0)", borderRadius: 8, marginBottom: 8, borderLeft: "3px solid #f59e0b" }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)" }}>{t.title}</div>
          <div style={{ fontFamily: "monospace", fontSize: 12, color: "#d97706", marginTop: 2 }}>{t.url}</div>
          <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", marginTop: 6, lineHeight: 1.5 }}>{t.desc}</div>
        </div>
      ))}

      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", margin: "20px 0 8px", letterSpacing: "0.04em" }}>
        BLOG
      </div>
      <div style={{ padding: "10px 14px", border: "1px solid var(--border-light, #e2e8f0)", borderRadius: 8, borderLeft: "3px solid #ec4899" }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)" }}>Blog — /blog/</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", marginTop: 6, lineHeight: 1.6 }}>
          Four content types rotate on the blog: <strong>Weekly New Tools Roundups</strong> (what launched this week), <strong>Monthly Trends</strong> (market analysis, adoption data), <strong>Tutorials</strong> (step-by-step workflows that don't fit a specific category), and <strong>Case Studies</strong> (how a real person/business used AI to solve a problem). Blog posts are timely — they link INTO the evergreen category clusters to pass authority. Aim for 2–3 blog posts per month.
        </div>
      </div>
    </div>
  );
}

function SitemapSection() {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 12px" }}>
        Tap any branch to expand or collapse. This shows all planned pages at launch (~65 pages) plus scalable sections that grow over time.
      </p>
      <SitemapLegend />
      <div style={{ padding: "8px 4px", backgroundColor: "var(--bg-subtle, #f8fafc)", borderRadius: 8, border: "1px solid var(--border-light, #e2e8f0)" }}>
        {SITEMAP_TREE.map((node, i) => <TreeNode key={i} node={node} depth={0} />)}
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
        <strong>Total at launch:</strong> ~65 pages (1 homepage + 6 pillar pages + ~29 articles + 4 tool pages + 1 blog index + ~20 blog posts + 5 utility pages). The /compare/ and /reviews/ sections scale as you add tools — these can grow to 200+ pages using templates.
      </div>
    </div>
  );
}

function UrlSection() {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 14px" }}>
        Clean, flat-ish URLs that include the category for topical context. Every URL uses trailing slashes, lowercase only, hyphens for separators. No dates, no /p/, no unnecessary nesting.
      </p>
      <div style={{ borderRadius: 8, border: "1px solid var(--border-light, #e2e8f0)", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", backgroundColor: "var(--bg-subtle, #f1f5f9)", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.03em" }}>
          <span>PATTERN</span><span>EXAMPLE</span><span>NOTES</span>
        </div>
        {URLS.map((u, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 12px", borderTop: "1px solid var(--border-light, #e2e8f0)", fontSize: 12 }}>
            <span style={{ fontFamily: "monospace", color: "#6366f1", fontWeight: 500 }}>{u.pattern}</span>
            <span style={{ fontFamily: "monospace", color: "#475569" }}>{u.example}</span>
            <span style={{ color: "#64748b" }}>{u.notes}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: "10px 14px", backgroundColor: "#fef3c7", borderRadius: 8, fontSize: 12, color: "#92400e", lineHeight: 1.5, border: "1px solid #fde68a" }}>
        <strong>URL rules:</strong> No stop words in slugs unless needed for readability. No category in blog URLs (keeps them independent). Comparison URLs follow a consistent alphabetical convention (a-vs-b, not b-vs-a) to prevent duplicates.
      </div>
    </div>
  );
}

function LinkingSection() {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 14px" }}>
        Internal linking is the single most underrated SEO lever for a new site. These six rules create a self-reinforcing structure where every new page strengthens the pages around it.
      </p>
      {LINKING_RULES.map((r, i) => <LinkingRule key={i} rule={r} />)}
      <div style={{ marginTop: 12, padding: "10px 14px", backgroundColor: "var(--bg-subtle, #f8fafc)", borderRadius: 8, fontSize: 12, color: "#475569", lineHeight: 1.6, border: "1px solid var(--border-light, #e2e8f0)" }}>
        <strong>Per-article target:</strong> Each article should contain 5–8 internal links: 1 to its parent pillar, 1–2 to sibling articles in the same cluster, 1–2 cross-cluster contextual links, and 1–2 to tool/review pages. Anchor text should use natural, descriptive phrases — not exact-match keywords.
      </div>
    </div>
  );
}

function NavSection() {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>
        PRIMARY NAV (DESKTOP)
      </div>
      <div style={{ display: "flex", gap: 2, padding: "10px 14px", backgroundColor: "var(--bg-subtle, #0f172a)", borderRadius: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ fontWeight: 700, color: "#a5b4fc", marginRight: 16, fontSize: 14 }}>AIToolStack</span>
        {NAV_ITEMS.primary.map((item, i) => (
          <span
            key={i}
            style={{
              padding: "4px 10px",
              fontSize: 12,
              color: item.highlight ? "#fbbf24" : "#cbd5e1",
              fontWeight: item.highlight ? 700 : 400,
              backgroundColor: item.highlight ? "rgba(251, 191, 36, 0.1)" : "transparent",
              borderRadius: 4,
            }}
          >
            {item.label}
            {item.mega && <span style={{ marginLeft: 3, fontSize: 9 }}>▾</span>}
          </span>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, marginBottom: 14 }}>
        The top 4 category links use mega-dropdown menus showing their child articles (3-column grid with titles + short descriptions). "Tool Finder" is visually highlighted as a CTA. Secondary items (Prompts, Getting Started, Blog) sit in a "More" dropdown or secondary row on desktop, and inline on mobile.
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>
        MOBILE NAV
      </div>
      <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, marginBottom: 14 }}>
        Hamburger menu with accordion categories. Tool Finder gets a persistent sticky button at the bottom of the screen (it's your highest-converting page). Search bar at the top of the mobile menu.
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 8, letterSpacing: "0.04em" }}>
        FOOTER (3-COLUMN)
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, padding: "14px 16px", backgroundColor: "var(--bg-subtle, #0f172a)", borderRadius: 8, marginBottom: 12 }}>
        {NAV_ITEMS.footer.map((col, ci) => (
          <div key={ci}>
            {col.map((item, ii) => (
              <div
                key={ii}
                style={{
                  fontSize: ii === 0 ? 12 : 11,
                  fontWeight: ii === 0 ? 700 : 400,
                  color: ii === 0 ? "#e2e8f0" : "#94a3b8",
                  marginBottom: ii === 0 ? 6 : 3,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6 }}>
        Footer includes: email signup bar, all category links (crawlable HTML, not JS), utility page links, and an affiliate disclosure one-liner. The footer serves as a secondary sitemap for crawlers.
      </div>
    </div>
  );
}

// --- MAIN APP ---

export default function App() {
  const [activeSection, setActiveSection] = useState("architecture");

  const renderSection = () => {
    switch (activeSection) {
      case "architecture": return <ArchitectureSection />;
      case "pages": return <PagesSection />;
      case "sitemap": return <SitemapSection />;
      case "urls": return <UrlSection />;
      case "linking": return <LinkingSection />;
      case "nav": return <NavSection />;
      default: return null;
    }
  };

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        maxWidth: 740,
        margin: "0 auto",
        padding: "16px 12px",
        color: "var(--text-primary, #0f172a)",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
            Website Blueprint
          </h1>
          <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, backgroundColor: "#eef2ff", padding: "2px 8px", borderRadius: 4 }}>
            AI Tools & Automation
          </span>
        </div>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-secondary, #64748b)" }}>
          Complete site architecture, all pages, URL map, and linking strategy
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 4,
          marginBottom: 20,
          backgroundColor: "var(--bg-subtle, #f1f5f9)",
          padding: 4,
          borderRadius: 8,
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              padding: "8px 4px",
              border: "none",
              borderRadius: 6,
              backgroundColor: activeSection === s.id ? "var(--bg-card, #fff)" : "transparent",
              boxShadow: activeSection === s.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              color: activeSection === s.id ? "var(--text-primary, #0f172a)" : "var(--text-secondary, #64748b)",
              fontWeight: activeSection === s.id ? 700 : 500,
              fontSize: 12,
              cursor: "pointer",
              transition: "all 0.12s",
              lineHeight: 1.3,
              textAlign: "center",
            }}
          >
            <span style={{ display: "block", fontSize: 16, marginBottom: 2 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {renderSection()}
    </div>
  );
}
