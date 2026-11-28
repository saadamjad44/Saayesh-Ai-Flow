/**
 * AI Detector — client-side heuristic analysis.
 *
 * This is explicitly NOT a verdict. Every signal below measures a surface
 * pattern that is common in LLM output but can also appear in careful human
 * writing. A high score means "this text shows patterns often found in AI
 * output"; a low score means "this text does not match those patterns".
 * It never means "this was written by a bot" or "this is original work".
 *
 * Five signals, each contributing a capped number of points to a 0-100 total:
 *   - Burstiness (25 pts): sentence-length uniformity
 *   - AI phrases (30 pts): known LLM-overused phrases
 *   - Transitions (20 pts): transitional-word density
 *   - Lexical uniformity (15 pts): type-token ratio
 *   - Contractions absence (10 pts): formality signal
 *
 * All logic runs in the browser. No fetch, no storage, no analytics on the
 * text itself.
 */

/** A single analyzable signal in the final report. */
export interface Signal {
  id: "burstiness" | "phrases" | "transitions" | "lexical" | "contractions";
  label: string;
  points: number;
  max: number;
  detail: string;
  /** Specific matches this signal found, shown verbatim to the reader. */
  matches?: string[];
}

export interface Report {
  wordCount: number;
  sentenceCount: number;
  score: number; // 0-100
  verdict: "human" | "mixed" | "ai-patterns" | "strong-ai-patterns";
  signals: Signal[];
}

/** Known phrases that LLMs overuse in default-style output. */
const AI_PHRASES: readonly string[] = [
  "delve into",
  "delve deeper",
  "it's important to note",
  "it is important to note",
  "in today's world",
  "in today's rapidly evolving",
  "in the realm of",
  "navigate the complexities",
  "navigate the landscape",
  "landscape of",
  "testament to",
  "rich tapestry",
  "myriad of",
  "plethora of",
  "pivotal role",
  "paramount importance",
  "crucial to understand",
  "it is crucial to",
  "comprehensive guide",
  "comprehensive overview",
  "unlock the",
  "unlock the potential",
  "elevate your",
  "robust solution",
  "cutting-edge",
  "state-of-the-art",
  "revolutionize",
  "transformative",
  "ever-evolving",
  "ever-changing",
  "multifaceted",
  "seamless integration",
  "game-changer",
  "paradigm shift",
  "harness the power",
  "leverage the power",
  "bustling world",
  "fast-paced world",
  "foster a sense",
  "foster an environment",
  "in conclusion,",
  "in summary,",
];

/** Transitional openers common at sentence starts in LLM prose. */
const TRANSITIONS: readonly string[] = [
  "however,",
  "additionally,",
  "furthermore,",
  "moreover,",
  "nevertheless,",
  "nonetheless,",
  "consequently,",
  "subsequently,",
  "therefore,",
  "thus,",
  "hence,",
  "firstly,",
  "secondly,",
  "thirdly,",
  "lastly,",
  "finally,",
  "in addition,",
  "on the other hand,",
  "in contrast,",
  "in summary,",
  "in conclusion,",
  "that said,",
  "importantly,",
  "notably,",
];

/** Contractions we count as informality signals. */
const CONTRACTIONS = /\b(?:don't|can't|won't|didn't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|wouldn't|shouldn't|couldn't|it's|that's|there's|here's|what's|let's|i'm|you're|we're|they're|i've|you've|we've|they've|i'll|you'll|we'll|they'll|he'd|she'd|we'd|they'd)\b/gi;

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+(?=\s|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function wordsOf(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}'\-\s]+/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  const safe = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(safe, "gi");
  const matches = haystack.match(re);
  return matches ? matches.length : 0;
}

/** Burstiness signal: how uniform are sentence lengths? */
function scoreBurstiness(sentences: string[]): Signal {
  const lengths = sentences.map((s) => wordsOf(s).length).filter((n) => n > 0);
  if (lengths.length < 3) {
    return {
      id: "burstiness",
      label: "Sentence-length variety",
      points: 0,
      max: 25,
      detail: "Not enough sentences to judge rhythm — paste at least a few paragraphs.",
    };
  }
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((s, x) => s + (x - mean) ** 2, 0) / lengths.length;
  const stdev = Math.sqrt(variance);
  const cov = mean > 0 ? stdev / mean : 0;

  // Human writing typically has CoV 0.5-0.9. AI output often 0.2-0.45.
  // Lower CoV → more "AI-like" rhythm → more points.
  let points: number;
  if (cov >= 0.7) points = 0;
  else if (cov >= 0.55) points = 6;
  else if (cov >= 0.45) points = 12;
  else if (cov >= 0.35) points = 18;
  else points = 25;

  const detail =
    cov >= 0.55
      ? `Sentence lengths vary naturally (coefficient of variation ${cov.toFixed(2)}). Humans and AI both do this.`
      : cov >= 0.35
        ? `Sentence lengths are somewhat uniform (CoV ${cov.toFixed(2)}). Common in edited prose, more common in LLM output.`
        : `Sentence lengths are very uniform (CoV ${cov.toFixed(2)}). This is a strong pattern of default LLM output.`;

  return { id: "burstiness", label: "Sentence-length variety", points, max: 25, detail };
}

/** AI-phrase signal: are LLM-overused phrases present? */
function scorePhrases(text: string, wordCount: number): Signal {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  let total = 0;
  for (const phrase of AI_PHRASES) {
    const count = countOccurrences(lower, phrase);
    if (count > 0) {
      matches.push(count > 1 ? `${phrase} (×${count})` : phrase);
      total += count;
    }
  }
  // Density per 500 words.
  const per500 = wordCount > 0 ? (total / wordCount) * 500 : 0;
  let points: number;
  if (per500 >= 6) points = 30;
  else if (per500 >= 4) points = 24;
  else if (per500 >= 2.5) points = 18;
  else if (per500 >= 1.5) points = 12;
  else if (per500 >= 0.5) points = 6;
  else points = 0;

  const detail =
    total === 0
      ? "No high-frequency LLM phrases found."
      : total === 1
        ? "One LLM-associated phrase found."
        : `${total} LLM-associated phrases found (${per500.toFixed(1)} per 500 words).`;

  return { id: "phrases", label: "LLM-overused phrases", points, max: 30, detail, matches };
}

/** Transitions signal: how often does the text open sentences with connectors? */
function scoreTransitions(sentences: string[]): Signal {
  if (sentences.length < 3) {
    return {
      id: "transitions",
      label: "Transitional-word density",
      points: 0,
      max: 20,
      detail: "Need a few more sentences to judge transition use.",
    };
  }
  const matches: string[] = [];
  let hits = 0;
  for (const s of sentences) {
    const lower = s.toLowerCase().trim();
    for (const t of TRANSITIONS) {
      if (lower.startsWith(t)) {
        hits += 1;
        matches.push(t);
        break;
      }
    }
  }
  const ratio = hits / sentences.length;
  let points: number;
  if (ratio >= 0.25) points = 20;
  else if (ratio >= 0.18) points = 16;
  else if (ratio >= 0.12) points = 11;
  else if (ratio >= 0.07) points = 6;
  else points = 0;

  const detail =
    hits === 0
      ? "Sentences rarely open with formal connectors."
      : `${hits} of ${sentences.length} sentences (${(ratio * 100).toFixed(0)}%) open with a connector like "However,", "Additionally,", etc.`;

  // Dedupe for display.
  const unique = Array.from(new Set(matches));
  return {
    id: "transitions",
    label: "Transitional-word density",
    points,
    max: 20,
    detail,
    matches: unique,
  };
}

/** Lexical uniformity signal: type-token ratio. */
function scoreLexical(words: string[]): Signal {
  if (words.length < 80) {
    return {
      id: "lexical",
      label: "Vocabulary variety",
      points: 0,
      max: 15,
      detail: "Need at least ~80 words for a meaningful vocabulary score.",
    };
  }
  const unique = new Set(words).size;
  const ttr = unique / words.length;
  // Short human writing: TTR 0.55-0.75. Long LLM prose: 0.40-0.55.
  let points: number;
  if (ttr >= 0.6) points = 0;
  else if (ttr >= 0.52) points = 4;
  else if (ttr >= 0.46) points = 9;
  else if (ttr >= 0.4) points = 12;
  else points = 15;

  const detail = `Type-token ratio ${ttr.toFixed(2)} (${unique} unique words in ${words.length}). Lower = more word repetition.`;
  return { id: "lexical", label: "Vocabulary variety", points, max: 15, detail };
}

/** Contractions signal: formality indicator. */
function scoreContractions(text: string, wordCount: number): Signal {
  if (wordCount < 80) {
    return {
      id: "contractions",
      label: "Contractions and informal voice",
      points: 0,
      max: 10,
      detail: "Need at least ~80 words to judge formality.",
    };
  }
  const found = text.match(CONTRACTIONS) || [];
  const per100 = (found.length / wordCount) * 100;
  let points: number;
  if (per100 >= 2) points = 0;
  else if (per100 >= 1) points = 3;
  else if (per100 >= 0.5) points = 6;
  else points = 10;

  const detail =
    found.length === 0
      ? "No contractions at all — a formality signal common in default LLM prose."
      : `${found.length} contractions (${per100.toFixed(1)} per 100 words). Casual human writing usually has more.`;

  return { id: "contractions", label: "Contractions and informal voice", points, max: 10, detail };
}

export function analyze(text: string): Report {
  const trimmed = text.trim();
  const words = wordsOf(trimmed);
  const sentences = splitSentences(trimmed);
  const wordCount = words.length;
  const sentenceCount = sentences.length;

  const signals: Signal[] = [
    scoreBurstiness(sentences),
    scorePhrases(trimmed, wordCount),
    scoreTransitions(sentences),
    scoreLexical(words),
    scoreContractions(trimmed, wordCount),
  ];

  const score = signals.reduce((acc, s) => acc + s.points, 0);
  let verdict: Report["verdict"];
  if (score <= 30) verdict = "human";
  else if (score <= 55) verdict = "mixed";
  else if (score <= 80) verdict = "ai-patterns";
  else verdict = "strong-ai-patterns";

  return { wordCount, sentenceCount, score, verdict, signals };
}

export const VERDICT_COPY: Record<
  Report["verdict"],
  { headline: string; body: string; tone: "ok" | "warn" | "flag" }
> = {
  human: {
    headline: "Patterns look human",
    body: "No strong signals of default LLM output. This does not prove human authorship — a careful writer who removed obvious markers would score the same.",
    tone: "ok",
  },
  mixed: {
    headline: "Mixed signals",
    body: "Some patterns resemble LLM output, others do not. Could be AI output edited for voice, human writing with academic habits, or a short sample.",
    tone: "warn",
  },
  "ai-patterns": {
    headline: "Patterns resemble AI output",
    body: "The text shows several markers that are common in default LLM prose. This is not proof — a human can write this way too, and detection tools are wrong often enough that nobody should be accused on a score alone.",
    tone: "flag",
  },
  "strong-ai-patterns": {
    headline: "Strong AI-pattern match",
    body: "Multiple signals that commonly appear together in unedited LLM output. Still not proof — fluent, formal human writing can match these patterns.",
    tone: "flag",
  },
};

/** Sample texts for the Try-a-sample buttons. */
export const SAMPLES: Readonly<Record<"human" | "ai", string>> = {
  human: `My laptop fan started roaring last week. Not during anything heavy — I was writing an email, maybe three tabs open, and suddenly the thing sounded like a hairdryer. Took me an hour to work out what changed: a Chrome extension I'd installed the night before was mining crypto in the background. I nearly threw the machine out the window. Removed the extension, killed the process, fan went quiet again. The lesson, as always: don't install random free stuff on Monday night.`,
  ai: `In today's rapidly evolving technological landscape, it is important to note that artificial intelligence has emerged as a transformative force. Furthermore, businesses must navigate the complexities of this ever-changing environment to leverage cutting-edge solutions. Moreover, the pivotal role of AI cannot be overstated. Additionally, organizations that embrace these state-of-the-art tools will unlock the potential to revolutionize their operations. In conclusion, it is crucial to foster a sense of innovation across every department.`,
};
