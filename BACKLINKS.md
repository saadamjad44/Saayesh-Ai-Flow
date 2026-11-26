# Backlinks plan — Saayesh AI Flow

Working document, not a blog post. Everything here is for Saad to execute.
Update the tracker tables as outreach happens. Delete rows once a link is live.

Site: https://saayeshaiflow.com
Target: 10–20 referring domains in the next 90 days. New domain, so the goal
is a few genuine mentions, not a volume spam campaign.

## Why backlinks matter for this site right now

Average Google position is 51 (page 5). Content depth is already above most
competitors — what the site is missing is _authority_. Google's current signal
for "this site is trustworthy enough to rank" is still mostly who links to it.
Zero quality backlinks + 3-month-old domain = page 5. Ten quality backlinks
over 3 months is the realistic lever that moves pages from position 60 → 20
without rewriting any content.

---

## Priority ladder — do these in order

Each tier is a week or two of real work. Do tier 1 completely before moving on.

### Tier 1 — Free directory submissions (this week, ~2 hrs total)

Easiest wins. Each one takes 5–15 minutes. Submit the site, wait, done.

| Directory | URL | Status | Notes |
| --- | --- | --- | --- |
| There's An AI For That (TAAFT) | https://theresanaiforthat.com/submit | pending | Submit each calculator + the pricing tracker as separate tools |
| Future Tools | https://www.futuretools.io/submit-a-tool | pending | AI tool only, submit calculator |
| AI Tool Hunt | https://www.aitoolhunt.com/submit | pending | — |
| Toolify | https://www.toolify.ai/submit-ai | pending | — |
| Insidr.ai | https://insidr.ai/submit-your-ai/ | pending | — |
| AI Tool Guru | https://aitoolguru.com/submit-tool/ | pending | — |
| SaaSHub | https://www.saashub.com/submit-software | pending | List under "AI assistant" + "content creation" |
| AlternativeTo | https://alternativeto.net/ | pending | Add Saayesh as alternative to existing tools where it genuinely is one |
| BetaList (if any tool qualifies) | https://betalist.com/submit | pending | Submit a specific free tool, not the whole site |
| G2 (for the calculators) | https://sell.g2.com/ | pending | Only if a calculator fits a category; reviews over time |

**What to submit for each**: use the one-line tagline from `src/config/site.ts`
(the final domain copy), the OG image, and link to the specific calculator
rather than the homepage where the directory allows it — calculators are more
linkable than hub pages.

### Tier 2 — HARO / Terkel / Qwoted (ongoing, 20 min/day)

Journalists ask questions daily. Answer well, get quoted in Forbes / Inc /
Business Insider / Entrepreneur. One good answer = one authoritative backlink.

| Platform | URL | Status | Account? |
| --- | --- | --- | --- |
| Qwoted | https://www.qwoted.com/ | pending | Free sign-up |
| Featured (formerly Terkel) | https://featured.com/experts | pending | Free |
| HARO (via Connectively) | https://connectively.us/ | pending | Free tier exists |
| SourceBottle | https://www.sourcebottle.com/ | pending | Free |
| HelpAB2BWriter | https://helpab2bwriter.com/ | pending | Free |

**Topics you can credibly answer** (based on what the site publishes):
- AI tools for small business
- AI pricing / cost of AI for SMB
- AI vs automation
- AI agents for customer support
- Specific-tool comparisons (ChatGPT vs Claude, Jasper vs ChatGPT)
- AI cost calculators / ROI
- Prompt engineering for non-technical users

**Response template** (stay under 150 words — editors reject anything longer):

```
Question: [paste]

For [context the journalist described], the honest answer is [1-sentence
claim, no hedging]. [2 sentences of reasoning tied to concrete numbers or
a specific comparison — not generic AI commentary.]

The trap most small businesses fall into here is [one specific mistake with
a one-line fix].

— Saad Amjad, Saayesh AI Flow (https://saayeshaiflow.com/<deepest relevant
  URL>)

Bio for footer (optional): Saad Amjad writes independent, research-based
guides to AI tools for small businesses at Saayesh AI Flow. No sponsored
rankings, no testing claims the site cannot back up.
```

### Tier 3 — Resource page outreach (2 weeks, ~1 hr per prospect)

Find pages titled things like "Best AI tools for small business 2026" that
are _curated_ lists (not vendor blogs). Pitch a specific calculator or guide
as a resource addition.

**Google queries to find prospects:**

```
"small business" "AI tools" intitle:"resources"
"AI for small business" inurl:resources
"best AI tools" inurl:awesome
"ai tools for" "small business" intitle:"list"
site:.edu "ai tools for small business"
site:.gov "ai tools" "small business"
```

Keep a prospects table like this:

| URL | Contact email | Pitch asset | Sent | Reply | Live |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

**Email template:**

```
Subject: Small addition for your [Page Title]

Hi [First name],

Found your page on [topic] while researching for a cost-breakdown piece.
Useful list — the one angle it does not cover is [specific gap]. Our free
[AI cost calculator / email savings calculator / pricing tracker] handles
exactly that: [one sentence on what it does, no marketing].

Link if useful: https://saayeshaiflow.com/<deep URL>

No tracking, no sign-up wall, no affiliate link on that page. If it does not
fit, no reply needed — I know the volume you get.

Saad
```

### Tier 4 — Reddit + Quora (ongoing, 30 min/day, 2–3 answers/week)

Links from Reddit and Quora are nofollow but still send traffic AND signal
topical authority. Only answer where you can add something a stock response
cannot.

**Subreddits worth watching:**

- r/smallbusiness
- r/Entrepreneur
- r/ArtificialIntelligence
- r/ChatGPT
- r/ClaudeAI
- r/n8n
- r/Zapier
- r/sideproject
- r/SaaS

**Rules for doing this without getting banned or looking spammy:**

1. Answer the question _fully_ in the comment itself. Do not say "I wrote
   about this, read here" — give the answer, then add the link as "fuller
   version with the comparison table here" if genuinely deeper.
2. Only link to the site in ~1 of every 5 comments. The other 4 are just
   genuinely helpful answers.
3. Match the format of the sub. Reddit hates marketing voice; Quora is
   friendlier to structured answers with sections.
4. Never link to the homepage. Link to the deepest specific guide.

### Tier 5 — Guest posts (long-term, 1 per month)

Publications that accept small-business guest posts without charging:

| Publication | Guidelines URL | Status |
| --- | --- | --- |
| Small Business Trends | https://smallbiztrends.com/contact | pending |
| Business 2 Community | https://www.business2community.com/writing-guidelines | pending |
| Startups Magazine | https://startupsmagazine.co.uk/contact | pending |
| TechBullion | https://techbullion.com/write-for-us/ | pending |
| Entrepreneur Pakistan | (check via contact form) | pending |
| ProductHunt Makers blog | — | pending |

**Pitch template:**

```
Subject: Pitch — [concrete headline, includes a number]

Hi [Editor name],

Pitch: "[Working title with specific claim]" — a [800/1200/1500]-word piece
built around [specific angle, with 1-sentence what makes it different from
what's already been written].

Relevant background: I write research-based guides to AI tools for small
business owners at saayeshaiflow.com — recent examples include [2 specific
article titles with URLs].

Deliverable: [specific thing, e.g. "4 tables, no AI-generated images, one
link back to a free calculator on my site, no other backlinks"].

Timing: I can send a full draft within [N] days of your yes.

Saad Amjad
```

### Tier 6 — Linkable assets to build next (longer-term)

What the site _should_ create to earn organic links without outreach:

1. **AI tool pricing tracker, as a public API** — devs will link to it
2. **"State of AI pricing for small business 2026" report** — publishable
   as a PDF + web page, pitch to journalists
3. **Comparison matrix** — ChatGPT vs Claude vs Gemini vs Copilot vs Jasper
   in a single sortable table with current pricing (updated monthly)
4. **A free "which AI tool should my small business use" quiz** — already
   exists as the AI Tool Finder Quiz; needs a sharable results page with
   OG images per outcome so people share on LinkedIn
5. **Prompt library, as a downloadable pack** — "100 ChatGPT prompts for
   small business" PDF / Notion template → gated link bait

---

## What NOT to do

- No paid backlinks (fiverr, dofollow-link vendors). Google penalises these.
- No link exchanges ("I'll link to you if you link to me"). Also penalised.
- No comment spam on random blogs.
- No PBN (private blog network) links.
- No mass directory submissions to the 500+ "free SEO directories" lists.
  Most are dead or deindexed and will drag the site down.

If someone offers to sell backlinks, the answer is always no.

---

## Monthly check-in

Review these numbers on the first of each month:

- Referring domains (GSC "Links" report, or ahrefs/moz free lookup)
- Clicks and impressions trend in GSC
- Position for the three flagship pages:
  - /ai-agents/best-ai-agents-for-small-business/
  - /ai-business-tools/claude-for-small-business/
  - /ai-business-tools/chatgpt-business-vs-plus/

If no movement after 90 days of consistent tier-1+2+4 work, the content
itself is the bottleneck, not the backlinks.
