import React, { useState } from "react";

const TABS = [
  { id: "phase1", label: "Phase 1 Launch", icon: "🚀" },
  { id: "sitemap", label: "Revised Sitemap", icon: "🗺️" },
  { id: "mapping", label: "Keyword → Page", icon: "🔑" },
  { id: "roadmap", label: "Phase 2 & 3", icon: "📍" },
  { id: "reviews", label: "Review Template", icon: "🔬" },
];

// --- PHASE 1 PAGES ---
const PHASE1 = [
  {
    id: 1,
    title: "Homepage",
    url: "/",
    type: "core",
    reason: "Central hub. Links to all live pillar and article pages. No inflated claims — lead with editorial positioning: \"Honest AI tool reviews for people who work alone.\"",
    week: "1",
  },
  {
    id: 2,
    title: "About + Editorial Process",
    url: "/about/",
    type: "core",
    reason: "E-E-A-T page. Explains testing methodology, affiliate transparency, and who runs the site. Google quality raters look for this on YMYL-adjacent content.",
    week: "1",
  },
  {
    id: 3,
    title: "Contact",
    url: "/contact/",
    type: "core",
    reason: "Required for ad network approval. Simple form with subject categories.",
    week: "1",
  },
  {
    id: 4,
    title: "Privacy Policy",
    url: "/privacy-policy/",
    type: "utility",
    reason: "Legal compliance. Noindexed.",
    week: "1",
  },
  {
    id: 5,
    title: "Terms of Service",
    url: "/terms/",
    type: "utility",
    reason: "Legal compliance. Noindexed.",
    week: "1",
  },
  {
    id: 6,
    title: "Affiliate Disclosure",
    url: "/affiliate-disclosure/",
    type: "utility",
    reason: "FTC compliance. Linked from footer and every review/comparison article. Noindexed.",
    week: "1",
  },
  {
    id: 7,
    title: "Pillar: AI Writing Tools",
    url: "/ai-writing-tools/",
    type: "pillar",
    reason: "Highest affiliate commission cluster (Jasper, Copy.ai, Writesonic all pay 20–30% recurring). Pillar page with 1,500–2,000 words of original overview content, not a thin index.",
    week: "2–3",
  },
  {
    id: 8,
    title: "Best AI Writing Tools 2026",
    url: "/ai-writing-tools/best-ai-writing-tools/",
    type: "article",
    reason: "Primary keyword for the writing cluster. Commercial investigation intent. High search volume, medium competition — winnable with a thorough, well-structured review.",
    week: "2–3",
  },
  {
    id: 9,
    title: "Jasper vs Claude vs ChatGPT",
    url: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
    type: "article",
    reason: "Comparison keyword with low competition. These three-way comparisons attract high-intent clicks and convert well to affiliate signups.",
    week: "2–3",
  },
  {
    id: 10,
    title: "Pillar: AI Business & Productivity",
    url: "/ai-business-tools/",
    type: "pillar",
    reason: "Second-priority cluster. Targets small business owners and solopreneurs with strong buying intent.",
    week: "4–5",
  },
  {
    id: 11,
    title: "Best AI Tools for Small Business Owners",
    url: "/ai-business-tools/best-ai-tools-for-small-business/",
    type: "article",
    reason: "Long-tail keyword with low-medium competition. The audience actively purchases SaaS tools. Strong affiliate potential.",
    week: "4–5",
  },
  {
    id: 12,
    title: "AI Tools vs Hiring a Virtual Assistant",
    url: "/ai-business-tools/ai-tools-vs-virtual-assistant/",
    type: "article",
    reason: "Low-competition comparison keyword. Unique angle that few sites cover — differentiates from standard listicles.",
    week: "4–5",
  },
  {
    id: 13,
    title: "Pillar: AI Automation & Workflows",
    url: "/ai-automation/",
    type: "pillar",
    reason: "Third cluster. Zapier, Make, and n8n affiliate programs pay recurring commissions. Tutorial content ranks fast for new sites.",
    week: "6–7",
  },
  {
    id: 14,
    title: "Zapier AI Automation Examples",
    url: "/ai-automation/zapier-ai-automation-examples/",
    type: "article",
    reason: "Low-competition long-tail keyword. Step-by-step tutorial content ranks quickly and earns featured snippets. Zapier's affiliate program pays recurring commissions.",
    week: "6–7",
  },
  {
    id: 15,
    title: "Best AI Workflows for Solopreneurs",
    url: "/ai-automation/best-ai-workflows-for-solopreneurs/",
    type: "article",
    reason: "Low-competition keyword targeting a specific audience. Framework-style content that earns bookmarks and return visits.",
    week: "6–7",
  },
  {
    id: 16,
    title: "How Much Does AI Cost for a Small Business?",
    url: "/ai-business-tools/how-much-does-ai-cost-small-business/",
    type: "article",
    reason: "Question-based keyword with low competition and transactional intent. People searching this are close to purchasing. Earns featured snippets.",
    week: "8",
  },
  {
    id: 17,
    title: "How to Automate Email Responses With AI",
    url: "/ai-automation/how-to-automate-email-with-ai/",
    type: "article",
    reason: "Low-competition tutorial keyword. Step-by-step content with clear affiliate insertion points (email tools, automation platforms).",
    week: "8",
  },
];

// --- KEYWORD MAPPING ---
const KEYWORD_MAP = [
  {
    keyword: "best AI writing tools",
    intent: "Commercial",
    competition: "Medium",
    page: "/ai-writing-tools/best-ai-writing-tools/",
    pageTitle: "Best AI Writing Tools 2026",
    priority: "High",
    notes: "Pillar cluster's money page. Structured as a scored roundup with a summary table at the top. Each tool gets 300–400 words.",
  },
  {
    keyword: "Jasper vs Claude vs ChatGPT for business",
    intent: "Commercial",
    competition: "Low",
    page: "/ai-writing-tools/jasper-vs-claude-vs-chatgpt/",
    pageTitle: "Jasper vs Claude vs ChatGPT",
    priority: "High",
    notes: "Three-way comparison. Test each tool on the same 5 tasks, score them identically. Include a \"best for\" verdict, not just specs.",
  },
  {
    keyword: "best AI tools for small business owners",
    intent: "Commercial",
    competition: "Low-Med",
    page: "/ai-business-tools/best-ai-tools-for-small-business/",
    pageTitle: "Best AI Tools for Small Business",
    priority: "High",
    notes: "Curated list of 8–10 tools, categorized by use case (writing, scheduling, accounting, customer support). Not a dump of 50 tools.",
  },
  {
    keyword: "AI tools vs hiring a virtual assistant",
    intent: "Informational",
    competition: "Low",
    page: "/ai-business-tools/ai-tools-vs-virtual-assistant/",
    pageTitle: "AI Tools vs Virtual Assistant",
    priority: "High",
    notes: "Cost-benefit analysis format. Include real pricing for both (VA hourly rates vs. SaaS subscriptions). Unique angle = low competition.",
  },
  {
    keyword: "how much does AI cost for a small business",
    intent: "Transactional",
    competition: "Low",
    page: "/ai-business-tools/how-much-does-ai-cost-small-business/",
    pageTitle: "How Much Does AI Cost?",
    priority: "High",
    notes: "Question keyword — target featured snippet. Include a pricing breakdown table (free tier / $20-50/mo / $100+/mo) with named tools at each level.",
  },
  {
    keyword: "Zapier AI automation examples",
    intent: "Informational",
    competition: "Low",
    page: "/ai-automation/zapier-ai-automation-examples/",
    pageTitle: "Zapier AI Automation Examples",
    priority: "High",
    notes: "Tutorial with 8–10 real automations. Each example: screenshot, trigger/action breakdown, time saved estimate. Link to Zapier affiliate.",
  },
  {
    keyword: "best AI workflows for solopreneurs",
    intent: "Info / Commercial",
    competition: "Low",
    page: "/ai-automation/best-ai-workflows-for-solopreneurs/",
    pageTitle: "AI Workflows for Solopreneurs",
    priority: "High",
    notes: "Framework article. 7 workflows covering email, content, invoicing, scheduling, research, social, and customer support. Each links to tool reviews.",
  },
  {
    keyword: "Make vs Zapier for AI automations",
    intent: "Commercial",
    competition: "Low",
    page: "Phase 2",
    pageTitle: "— deferred to Phase 2 —",
    priority: "Medium",
    notes: "Strong keyword but requires deep testing of both platforms. Build after the Zapier article ranks and you have usage data.",
  },
  {
    keyword: "how to automate email responses with AI",
    intent: "Informational",
    competition: "Low",
    page: "/ai-automation/how-to-automate-email-with-ai/",
    pageTitle: "Automate Email With AI",
    priority: "High",
    notes: "Step-by-step tutorial. Cover 3 methods (Gmail + Zapier, Outlook + Power Automate, dedicated AI email tools). Each method = affiliate opportunity.",
  },
  {
    keyword: "best free AI tools for productivity",
    intent: "Commercial",
    competition: "Low",
    page: "Phase 2",
    pageTitle: "— deferred to Phase 2 —",
    priority: "Medium",
    notes: "Good keyword but lower monetization (free tools = fewer affiliate clicks). Build once Phase 1 pages are ranking.",
  },
  {
    keyword: "Notion AI vs ClickUp AI vs Monday AI",
    intent: "Commercial",
    competition: "Low",
    page: "Phase 2",
    pageTitle: "— deferred to Phase 2 —",
    priority: "Medium",
    notes: "Requires hands-on testing of all three platforms. Phase 2 article once the business tools pillar has authority.",
  },
  {
    keyword: "how to use ChatGPT for real estate",
    intent: "Informational",
    competition: "Low",
    page: "Phase 2",
    pageTitle: "— deferred to Phase 2 (AI by Industry cluster) —",
    priority: "Medium",
    notes: "The AI by Industry pillar launches in Phase 2. This is the first article in that cluster.",
  },
];

// --- ROADMAP ---
const PHASES = [
  {
    phase: "Phase 1",
    timeline: "Weeks 1–8",
    color: "#6366f1",
    goal: "Launch 17 pages. Establish 3 category pillars, rank for 7 validated low-competition keywords, and apply for Ezoic ad network.",
    pages: "6 core/utility + 3 pillar pages + 8 articles = 17 pages",
    milestones: [
      "Domain + hosting + WordPress/headless CMS set up",
      "All 6 core/utility pages live (homepage, about, contact, privacy, terms, disclosure)",
      "3 pillar pages published with full original content (not thin indexes)",
      "8 cluster articles published (2–3 per pillar)",
      "Google Search Console + Analytics configured",
      "XML sitemap submitted",
      "Ezoic application submitted (requires 10+ quality pages)",
    ],
  },
  {
    phase: "Phase 2",
    timeline: "Months 3–6",
    color: "#059669",
    goal: "Expand to ~45 pages. Launch 3 remaining pillar clusters, begin individual tool reviews, add interactive Tool Finder, start earning affiliate revenue.",
    pages: "+25–30 pages (3 new pillars, 12–15 articles, Tool Finder, first 5–8 individual reviews)",
    milestones: [
      "Launch AI by Industry pillar + 3–4 articles",
      "Launch AI Prompts pillar + 3–4 articles",
      "Launch Getting Started pillar + 3–4 articles",
      "Publish 5–8 individual tool reviews (/reviews/jasper/, /reviews/zapier/, etc.)",
      "Build and launch Tool Finder interactive quiz",
      "Launch Prompt Library (free prompts, email capture)",
      "Begin blog cadence: 2–3 posts/month",
      "Apply for Mediavine (requires 50K sessions) or upgrade ad network",
      "First digital product: premium prompt pack or automation template bundle",
    ],
  },
  {
    phase: "Phase 3",
    timeline: "Months 7–12",
    color: "#d97706",
    goal: "Scale to 100+ pages. Launch programmatic /compare/ section, build review database, and optimize for AI Overviews.",
    pages: "+50–100 pages (programmatic comparisons, expanded reviews, blog archive)",
    milestones: [
      "Build /compare/ template and launch 20–30 programmatic comparison pages",
      "Expand tool review database to 20+ individual reviews",
      "Launch AI Savings Calculator (linkable interactive tool)",
      "Optimize top-performing pages for AI Overview inclusion",
      "Content refresh cycle: update all Phase 1 articles with new data",
      "Scale blog to 4–6 posts/month",
      "Second digital product: course or comprehensive guide",
      "Target: 50K+ monthly sessions, $500–2,000/month revenue (ads + affiliates + digital products)",
    ],
  },
];

// --- REVIEW TEMPLATE ---
const REVIEW_SECTIONS = [
  {
    section: "Quick Verdict",
    desc: "2–3 sentence summary. Who it's best for, one standout strength, one notable weakness. Lets scanners get the answer immediately.",
    required: true,
  },
  {
    section: "Scoring Table",
    desc: "Score 1–10 across 5 consistent categories: Ease of Use, Output Quality, Feature Set, Pricing Value, Support & Documentation. Same categories for every review to enable cross-tool comparison.",
    required: true,
  },
  {
    section: "What It Does",
    desc: "Factual overview: what the tool is, what category it fits, and the core use cases it serves. No marketing language — describe what you observed.",
    required: true,
  },
  {
    section: "How We Tested",
    desc: "Describe the exact tests you ran. Example: \"We used [tool] to write 10 blog intros, 5 product descriptions, and 3 cold emails, then scored each output on accuracy, tone, and time saved.\" This is your E-E-A-T proof.",
    required: true,
  },
  {
    section: "Pricing Breakdown",
    desc: "Every plan with exact prices, what's included/excluded, and whether there's a free tier or trial. Include a \"price per user per month\" normalization so readers can compare. Note the date you verified pricing.",
    required: true,
  },
  {
    section: "Key Features (with assessment)",
    desc: "Not a feature list copied from the marketing page. 4–6 features you actually tested, with your honest assessment of each. \"Feature X exists but is limited because...\"",
    required: true,
  },
  {
    section: "Pros & Cons",
    desc: "Minimum 3 of each. Must be specific and earned from testing — never generic filler like \"easy to use\" or \"could be cheaper.\" Example pro: \"Generates blog outlines that need less than 10% editing.\" Example con: \"No bulk export — you copy outputs one at a time.\"",
    required: true,
  },
  {
    section: "Best For / Not For",
    desc: "Explicit segments. \"Best for: solo content creators publishing 3+ articles/week. Not for: enterprise teams needing approval workflows or brand voice controls.\"",
    required: true,
  },
  {
    section: "Alternatives",
    desc: "3–4 alternatives with one-line positioning and internal links to their reviews (if published). This cross-links your review network and keeps users on-site.",
    required: true,
  },
  {
    section: "FAQ (schema-marked)",
    desc: "3–5 questions sourced from People Also Ask and autocomplete. Structured with FAQ schema for rich snippet eligibility.",
    required: true,
  },
  {
    section: "Last Updated + Affiliate Note",
    desc: "Visible \"Last updated: [date]\" stamp and one-line affiliate disclosure with link to /affiliate-disclosure/. Both above the fold or immediately below the verdict.",
    required: true,
  },
];

// --- TYPE COLORS ---
const typeStyles = {
  core: { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6", label: "Core" },
  utility: { bg: "#f3f4f6", text: "#6b7280", dot: "#9ca3af", label: "Utility" },
  pillar: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6", label: "Pillar" },
  article: { bg: "#f0fdf4", text: "#166534", dot: "#22c55e", label: "Article" },
};

const compColors = {
  Low: { bg: "#dcfce7", text: "#166534" },
  "Low-Med": { bg: "#dbeafe", text: "#1e40af" },
  Medium: { bg: "#fef9c3", text: "#854d0e" },
};

function Badge({ children, bg, text, border }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 4, fontSize: 10, fontWeight: 600, backgroundColor: bg, color: text, border: border ? `1px solid ${border}` : "none", whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

// --- SECTION RENDERERS ---

function Phase1Section() {
  const groups = [
    { label: "Weeks 1 — Foundation", filter: (p) => p.week === "1" },
    { label: "Weeks 2–3 — AI Writing Cluster", filter: (p) => p.week === "2–3" },
    { label: "Weeks 4–5 — AI Business Cluster", filter: (p) => p.week === "4–5" },
    { label: "Weeks 6–7 — AI Automation Cluster", filter: (p) => p.week === "6–7" },
    { label: "Week 8 — Fill Gaps", filter: (p) => p.week === "8" },
  ];

  return (
    <div>
      <div style={{ padding: "12px 14px", backgroundColor: "#eef2ff", borderRadius: 8, marginBottom: 16, border: "1px solid #c7d2fe" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#3730a3", marginBottom: 4 }}>Phase 1: 17 pages in 8 weeks</div>
        <div style={{ fontSize: 13, color: "#4338ca", lineHeight: 1.5 }}>
          6 core/utility pages + 3 category pillars + 8 keyword-targeted articles. Every article targets a validated low or low-medium competition keyword. No filler content, no unverified claims, no pages published without a keyword justification.
        </div>
      </div>

      {groups.map((g, gi) => (
        <div key={gi} style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", marginBottom: 6, padding: "4px 0", borderBottom: "1px solid #e2e8f0" }}>
            {g.label}
          </div>
          {PHASE1.filter(g.filter).map((page) => {
            const ts = typeStyles[page.type];
            return (
              <div key={page.id} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border-light, #f1f5f9)" }}>
                <div style={{ width: 22, textAlign: "center", fontSize: 12, fontWeight: 700, color: "#94a3b8", paddingTop: 2, flexShrink: 0 }}>
                  {page.id}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)" }}>{page.title}</span>
                    <Badge bg={ts.bg} text={ts.text}>{ts.label}</Badge>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6366f1", marginBottom: 4 }}>{page.url}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary, #64748b)", lineHeight: 1.5 }}>{page.reason}</div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function SitemapSection() {
  const tree = [
    {
      label: "/ (Homepage)", type: "core", children: [
        {
          label: "/ai-writing-tools/", type: "pillar", status: "P1", children: [
            { label: "/best-ai-writing-tools/", type: "article", status: "P1" },
            { label: "/jasper-vs-claude-vs-chatgpt/", type: "article", status: "P1" },
            { label: "/best-ai-copywriting-tools/", type: "article", status: "P2" },
            { label: "/ai-tools-for-blog-writing/", type: "article", status: "P2" },
            { label: "/grammarly-review/", type: "article", status: "P2" },
          ],
        },
        {
          label: "/ai-business-tools/", type: "pillar", status: "P1", children: [
            { label: "/best-ai-tools-for-small-business/", type: "article", status: "P1" },
            { label: "/ai-tools-vs-virtual-assistant/", type: "article", status: "P1" },
            { label: "/how-much-does-ai-cost-small-business/", type: "article", status: "P1" },
            { label: "/notion-ai-vs-clickup-ai-vs-monday-ai/", type: "article", status: "P2" },
            { label: "/best-ai-meeting-assistants/", type: "article", status: "P2" },
          ],
        },
        {
          label: "/ai-automation/", type: "pillar", status: "P1", children: [
            { label: "/zapier-ai-automation-examples/", type: "article", status: "P1" },
            { label: "/best-ai-workflows-for-solopreneurs/", type: "article", status: "P1" },
            { label: "/how-to-automate-email-with-ai/", type: "article", status: "P1" },
            { label: "/make-vs-zapier-for-ai/", type: "article", status: "P2" },
            { label: "/automate-social-media-with-ai/", type: "article", status: "P2" },
          ],
        },
        { label: "/ai-by-industry/", type: "pillar", status: "P2", note: "Full cluster" },
        { label: "/ai-prompts/", type: "pillar", status: "P2", note: "Full cluster" },
        { label: "/getting-started/", type: "pillar", status: "P2", note: "Full cluster" },
        { label: "/tool-finder/", type: "tool", status: "P2" },
        { label: "/compare/[a]-vs-[b]/", type: "tool", status: "P3", note: "Programmatic" },
        { label: "/prompt-library/", type: "tool", status: "P2" },
        { label: "/reviews/[tool]/", type: "article", status: "P2", note: "Individual reviews" },
        { label: "/blog/", type: "blog", status: "P1", note: "2–3 posts/month from week 4" },
        { label: "/about/", type: "utility", status: "P1" },
        { label: "/contact/", type: "utility", status: "P1" },
        { label: "/privacy-policy/", type: "utility", status: "P1" },
        { label: "/terms/", type: "utility", status: "P1" },
        { label: "/affiliate-disclosure/", type: "utility", status: "P1" },
      ],
    },
  ];

  const statusColors = {
    P1: { bg: "#dcfce7", text: "#166534", label: "Phase 1" },
    P2: { bg: "#dbeafe", text: "#1e40af", label: "Phase 2" },
    P3: { bg: "#fef9c3", text: "#854d0e", label: "Phase 3" },
  };

  const allTypes = {
    core: { dot: "#8b5cf6", label: "Home" },
    pillar: { dot: "#3b82f6", label: "Pillar" },
    article: { dot: "#22c55e", label: "Article" },
    tool: { dot: "#f59e0b", label: "Tool" },
    blog: { dot: "#ec4899", label: "Blog" },
    utility: { dot: "#9ca3af", label: "Utility" },
  };

  function Node({ item, depth }) {
    const [open, setOpen] = useState(depth < 1);
    const t = allTypes[item.type] || allTypes.utility;
    const sc = item.status ? statusColors[item.status] : null;
    const hasKids = item.children && item.children.length > 0;

    return (
      <div style={{ marginLeft: depth > 0 ? 14 : 0 }}>
        <div
          onClick={() => hasKids && setOpen(!open)}
          style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 6px", borderRadius: 5, cursor: hasKids ? "pointer" : "default" }}
        >
          {hasKids ? <span style={{ fontSize: 9, color: "#94a3b8", width: 10 }}>{open ? "▼" : "▶"}</span> : <span style={{ width: 10 }} />}
          <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: t.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: depth < 2 ? 600 : 400, color: "var(--text-primary, #1e293b)", fontFamily: depth > 0 ? "monospace" : "inherit" }}>
            {item.label}
          </span>
          {sc && <Badge bg={sc.bg} text={sc.text}>{sc.label}</Badge>}
          {item.note && <span style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>{item.note}</span>}
        </div>
        {open && hasKids && item.children.map((c, i) => <Node key={i} item={c} depth={depth + 1} />)}
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 10px" }}>
        Revised sitemap showing which pages ship in each phase. Phase 1 pages are highlighted in green. Tap branches to expand.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        {Object.entries(statusColors).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: v.bg, border: `1px solid ${v.text}40` }} />
            <span style={{ color: v.text, fontWeight: 600 }}>{v.label}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: "8px 4px", backgroundColor: "var(--bg-subtle, #f8fafc)", borderRadius: 8, border: "1px solid var(--border-light, #e2e8f0)" }}>
        {tree.map((n, i) => <Node key={i} item={n} depth={0} />)}
      </div>
      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, fontSize: 12, textAlign: "center" }}>
        {[
          { label: "Phase 1", count: "17 pages", color: "#166534", bg: "#dcfce7" },
          { label: "Phase 2", count: "+25–30 pages", color: "#1e40af", bg: "#dbeafe" },
          { label: "Phase 3", count: "+50–100 pages", color: "#854d0e", bg: "#fef9c3" },
        ].map((p, i) => (
          <div key={i} style={{ padding: "8px", borderRadius: 6, backgroundColor: p.bg, color: p.color, fontWeight: 700 }}>
            <div style={{ fontSize: 16 }}>{p.count}</div>
            <div style={{ fontSize: 11, fontWeight: 500 }}>{p.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MappingSection() {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 14px" }}>
        Every Phase 1 article is mapped to a validated keyword. Deferred keywords are assigned to Phase 2 with a reason.
      </p>
      {KEYWORD_MAP.map((kw, i) => {
        const isDeferred = kw.page === "Phase 2";
        const cc = compColors[kw.competition] || compColors.Medium;
        return (
          <div
            key={i}
            style={{
              padding: "10px 12px",
              border: `1px solid ${isDeferred ? "#e2e8f0" : "#c7d2fe"}`,
              borderRadius: 8,
              marginBottom: 6,
              backgroundColor: isDeferred ? "var(--bg-subtle, #f8fafc)" : "var(--bg-card, #fff)",
              opacity: isDeferred ? 0.7 : 1,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: "var(--text-primary, #0f172a)" }}>
                {kw.keyword}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <Badge bg={cc.bg} text={cc.text}>{kw.competition}</Badge>
                <Badge bg={isDeferred ? "#fef9c3" : "#dcfce7"} text={isDeferred ? "#854d0e" : "#166534"} border={isDeferred ? "#fde047" : "#86efac"}>
                  {isDeferred ? "Phase 2" : "Phase 1"}
                </Badge>
              </div>
            </div>
            {!isDeferred && (
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#6366f1", marginTop: 4 }}>{kw.page}</div>
            )}
            <div style={{ fontSize: 12, color: "var(--text-secondary, #64748b)", marginTop: 4, lineHeight: 1.5 }}>{kw.notes}</div>
          </div>
        );
      })}
    </div>
  );
}

function RoadmapSection() {
  return (
    <div>
      {PHASES.map((p, i) => (
        <div key={i} style={{ marginBottom: 16, border: "1px solid var(--border-light, #e2e8f0)", borderRadius: 8, overflow: "hidden", borderLeft: `3px solid ${p.color}` }}>
          <div style={{ padding: "12px 14px", backgroundColor: "var(--bg-subtle, #f8fafc)", borderBottom: "1px solid var(--border-light, #e2e8f0)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 800, fontSize: 15, color: p.color }}>{p.phase}</span>
              <Badge bg={`${p.color}18`} text={p.color}>{p.timeline}</Badge>
            </div>
            <div style={{ fontSize: 13, color: "var(--text-secondary, #475569)", marginTop: 4, lineHeight: 1.5 }}>{p.goal}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontFamily: "monospace" }}>{p.pages}</div>
          </div>
          <div style={{ padding: "10px 14px" }}>
            {p.milestones.map((m, mi) => (
              <div key={mi} style={{ fontSize: 13, color: "var(--text-primary, #334155)", padding: "4px 0 4px 14px", borderLeft: `2px solid ${p.color}40`, marginBottom: 2, lineHeight: 1.45 }}>
                {m}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ReviewSection() {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-secondary, #475569)", lineHeight: 1.6, margin: "0 0 14px" }}>
        Every tool review follows this identical structure. Consistency builds reader trust and makes cross-tool comparison possible. No section is optional — if you can't fill a section honestly, you haven't tested the tool enough to review it.
      </p>
      {REVIEW_SECTIONS.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < REVIEW_SECTIONS.length - 1 ? "1px solid var(--border-light, #f1f5f9)" : "none" }}>
          <div style={{ width: 24, textAlign: "center", fontSize: 13, fontWeight: 800, color: "#6366f1", paddingTop: 2, flexShrink: 0 }}>
            {i + 1}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary, #0f172a)", marginBottom: 2 }}>
              {s.section}
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary, #64748b)", lineHeight: 1.55 }}>{s.desc}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 14, padding: "10px 14px", backgroundColor: "#fef3c7", borderRadius: 8, fontSize: 12, color: "#92400e", lineHeight: 1.5, border: "1px solid #fde68a" }}>
        <strong>Non-negotiable rules:</strong> Never copy feature descriptions from a tool's marketing page. Never publish a review without personally testing the tool. Always include the date you last verified pricing. Always link to /affiliate-disclosure/ from every review page. Score all tools on the same 5 categories so readers can compare across reviews.
      </div>
    </div>
  );
}

// --- MAIN ---
export default function App() {
  const [tab, setTab] = useState("phase1");

  const render = () => {
    switch (tab) {
      case "phase1": return <Phase1Section />;
      case "sitemap": return <SitemapSection />;
      case "mapping": return <MappingSection />;
      case "roadmap": return <RoadmapSection />;
      case "reviews": return <ReviewSection />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: 720, margin: "0 auto", padding: "16px 12px", color: "var(--text-primary, #0f172a)" }}>
      <div style={{ marginBottom: 14 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 2px" }}>Revised Blueprint — Phase 1</h1>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary, #64748b)" }}>
          17 pages in 8 weeks. Only validated keywords. No inflated claims.
        </p>
      </div>

      <div style={{ display: "flex", gap: 3, marginBottom: 18, flexWrap: "wrap", backgroundColor: "var(--bg-subtle, #f1f5f9)", padding: 3, borderRadius: 8 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: "1 1 auto",
              padding: "7px 6px",
              border: "none",
              borderRadius: 6,
              backgroundColor: tab === t.id ? "var(--bg-card, #fff)" : "transparent",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
              color: tab === t.id ? "var(--text-primary, #0f172a)" : "var(--text-secondary, #64748b)",
              fontWeight: tab === t.id ? 700 : 500,
              fontSize: 11,
              cursor: "pointer",
              textAlign: "center",
              lineHeight: 1.3,
            }}
          >
            <span style={{ display: "block", fontSize: 15, marginBottom: 1 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {render()}
    </div>
  );
}
