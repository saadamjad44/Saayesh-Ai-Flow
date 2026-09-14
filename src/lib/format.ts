import { SITE } from "@/config/site";

// Content dates are calendar dates, so format in UTC to avoid off-by-one days.
const longDate = new Intl.DateTimeFormat(SITE.lang, { dateStyle: "long", timeZone: "UTC" });

/** "September 14, 2026" */
export function formatDate(date: Date): string {
  return longDate.format(date);
}

/** "2026-09-14", for <time datetime>. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
