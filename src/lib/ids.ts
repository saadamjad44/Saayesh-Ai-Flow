/**
 * DOM ids for components that name a region with `aria-labelledby`.
 *
 * Components that are always rendered once per page by a layout take an `id`
 * prop instead (see RelatedPages). This is the fallback for components an MDX
 * author can drop in more than once, where no caller-supplied id exists: the
 * slug keeps the id readable, and the counter guarantees it is unique even when
 * two instances on a page share a heading.
 */
let sequence = 0;

/** "Quick verdict" -> "quick-verdict-3". Never returns the same id twice. */
export function headingId(text: string, fallback: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return `${slug || fallback}-${++sequence}`;
}
