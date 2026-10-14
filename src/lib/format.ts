import { SITE } from "@/config/site";

// Content dates are calendar dates, so format in UTC to avoid off-by-one days.
const longDate = new Intl.DateTimeFormat(SITE.lang, { dateStyle: "long", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat(SITE.lang, { dateStyle: "medium", timeZone: "UTC" });

/** "September 14, 2026" */
export function formatDate(date: Date): string {
  return longDate.format(date);
}

/** "Sep 14, 2026", for tight metadata rows on cards. */
export function formatShortDate(date: Date): string {
  return shortDate.format(date);
}

/** "2026-09-14", for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Words per minute used for the "N min read" estimate. 225 is a common
 * silent-reading figure for general prose; it is an estimate shown as one, not
 * a measurement of any particular reader.
 */
const WORDS_PER_MINUTE = 225;

/**
 * Minutes to read an MDX body, from its own source.
 *
 * The source is stripped of the things a reader does not read word by word
 * before counting: import statements, JSX tags and their attributes, fenced
 * code blocks, and Markdown punctuation. Without that strip, a guide built from
 * <ComparisonTable> rows would score several minutes of markup as prose.
 */
export function readingMinutes(body: string): number {
  const prose = body
    // Component imports at the top of an entry.
    .replace(/^import\s.*$/gm, " ")
    // Fenced blocks: a prompt or snippet is scanned, not read.
    .replace(/```[\s\S]*?```/g, " ")
    // JSX/HTML tags, including the attribute payload of a table component.
    .replace(/<[^>]+>/g, " ")
    // Markdown emphasis, links, headings, and list markers.
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|~\-]+/g, " ")
    .trim();

  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
