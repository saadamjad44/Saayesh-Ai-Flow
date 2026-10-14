/**
 * Client-side search scoring for the site search box.
 *
 * This is the same fast local text search the site has always used — not
 * semantic or AI search. The static index at /search-index.json is built from
 * the page registry and the MDX collections (see src/lib/search-index.ts); the
 * browser fetches it once, on first interaction with a search box, and every
 * keystroke after that is matched and ranked in-page. No request goes anywhere
 * at type time.
 *
 * The matching and ranking rules are unchanged; they live here, apart from the
 * DOM, so more than one box can share them. The header and the homepage hero
 * both mount SearchBox, and they must rank identically.
 */

export interface SearchDoc {
  title: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
  headings: string[];
}

/** Lowercased fields, built once per document when the index arrives. */
export interface ScorableDoc extends SearchDoc {
  lowerTitle: string;
  lowerDescription: string;
  lowerCategory: string;
  lowerKeywords: string;
  lowerHeadings: string;
}

export const INDEX_URL = "/search-index.json";
export const MAX_RESULTS = 8;

/**
 * Field weights. A title hit always outranks a keyword hit, which outranks a
 * category, description, or heading hit, so the most on-topic page wins.
 */
const WEIGHT = {
  titlePrefix: 120,
  titleWordStart: 90,
  title: 60,
  keywords: 45,
  category: 25,
  description: 18,
  headings: 12,
} as const;

/** The whole query appearing verbatim in a title beats any sum of parts. */
const PHRASE_BONUS = 80;

/**
 * A query that *is* a page's title should win outright — enough to clear a
 * longer title that merely starts with the same words ("AI Prompts" beats
 * "AI Prompts for Content Writing" when that is exactly what was typed).
 */
const EXACT_TITLE_BONUS = 250;

/** A plural term matched through its singular still counts, but for less. */
const SINGULAR_PENALTY = 0.8;

export function prepareDocs(raw: SearchDoc[]): ScorableDoc[] {
  return raw.map((doc) => ({
    ...doc,
    lowerTitle: doc.title.toLowerCase(),
    lowerDescription: doc.description.toLowerCase(),
    lowerCategory: doc.category.toLowerCase(),
    lowerKeywords: doc.keywords.join(" ").toLowerCase(),
    lowerHeadings: doc.headings.join(" ").toLowerCase(),
  }));
}

/** Score for one literal term across every field, 0 if it appears in none. */
function scoreLiteral(doc: ScorableDoc, term: string): number {
  let score = 0;
  const at = doc.lowerTitle.indexOf(term);

  if (at === 0) score += WEIGHT.titlePrefix;
  else if (at > 0)
    score += /[\s(/-]/.test(doc.lowerTitle[at - 1] ?? "") ? WEIGHT.titleWordStart : WEIGHT.title;

  if (doc.lowerKeywords.includes(term)) score += WEIGHT.keywords;
  if (doc.lowerCategory.includes(term)) score += WEIGHT.category;
  if (doc.lowerDescription.includes(term)) score += WEIGHT.description;
  if (doc.lowerHeadings.includes(term)) score += WEIGHT.headings;

  return score;
}

/**
 * Score for one term, or 0 if nothing matches. A plural term is also tried as
 * its singular, at a discount, and the better of the two wins — so "prompts"
 * finds "AI Prompt Examples" by its title rather than scraping a category
 * match. A singular term needs no such pass: it is already a substring of its
 * own plural.
 */
function scoreTerm(doc: ScorableDoc, term: string): number {
  const direct = scoreLiteral(doc, term);
  if (term.length <= 3 || !term.endsWith("s")) return direct;

  const singular = Math.round(scoreLiteral(doc, term.slice(0, -1)) * SINGULAR_PENALTY);
  return Math.max(direct, singular);
}

/** Documents matching every term, best first. Ties keep index order. */
export function searchDocs(docs: readonly ScorableDoc[], query: string): SearchDoc[] {
  const phrase = query.trim().toLowerCase();
  const terms = phrase.split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const scored: { doc: ScorableDoc; score: number }[] = [];

  for (const doc of docs) {
    let total = 0;
    let matchedAll = true;

    for (const term of terms) {
      const score = scoreTerm(doc, term);
      if (score === 0) {
        matchedAll = false;
        break;
      }
      total += score;
    }

    if (!matchedAll) continue;
    if (doc.lowerTitle === phrase) total += EXACT_TITLE_BONUS;
    else if (terms.length > 1 && doc.lowerTitle.includes(phrase)) total += PHRASE_BONUS;
    scored.push({ doc, score: total });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS)
    .map(({ doc }) => doc);
}
