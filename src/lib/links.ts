/**
 * Outbound-link policy in one place.
 *
 * Editorial links to sources are ordinary links: we cite them because they are
 * worth reading, so they carry no `rel` and no `target` at all. Commercial links
 * are different — Google asks that paid or affiliate destinations be marked
 * `rel="sponsored"` — so the one thing this module decides is which of the two a
 * link is, and the only attributes it ever adds are the ones that decision needs.
 *
 * Internal links are never touched: isExternalHref() resolves an href against
 * the canonical host, so relative paths, anchors, and mailto: links all resolve
 * to "not external" and come back with no attributes.
 *
 * Applied through one component, ContentLink.astro, which the pillar and article
 * routes map Markdown's `a` element to. So a plain `[text](url)` link gets the
 * same treatment as an explicit `<ContentLink>`, and a commercial destination
 * cannot be published unmarked just because the author used Markdown syntax.
 */
import { SITE_DOMAIN } from "../config/site";

/**
 * `reference` — an editorial or source link. `sponsored` — affiliate, paid, or
 * any other commercial link, which must not pass ranking signals.
 */
export type OutboundLinkKind = "reference" | "sponsored";

export interface OutboundLinkAttrs {
  rel?: string;
  target?: "_blank";
}

/**
 * Hosts whose links are commercial, so every link to one — Markdown syntax
 * included — is marked `sponsored nofollow` without being tagged individually.
 * Empty until affiliate programmes are live: a real destination goes here (host
 * only, lowercase, no protocol or path) at the point it actually exists. Never
 * add a host as a placeholder.
 */
export const SPONSORED_HOSTS: ReadonlySet<string> = new Set<string>();

/** Host of an href resolved against the canonical domain, or undefined if unparseable. */
function hostOf(href: string): string | undefined {
  try {
    const url = new URL(href, `https://${SITE_DOMAIN}/`);
    return url.protocol === "http:" || url.protocol === "https:"
      ? url.host.toLowerCase()
      : undefined;
  } catch {
    return undefined;
  }
}

/** True only for http(s) links that leave the canonical domain. */
export function isExternalHref(href: string): boolean {
  const host = hostOf(href);
  return host !== undefined && host !== SITE_DOMAIN.toLowerCase();
}

/** Registered commercial destination, else an editorial reference. */
export function defaultOutboundKind(href: string): OutboundLinkKind {
  const host = hostOf(href);
  return host && SPONSORED_HOSTS.has(host) ? "sponsored" : "reference";
}

export interface OutboundLinkOptions {
  /** Overrides the host-based default; set "sponsored" for a commercial link. */
  kind?: OutboundLinkKind;
  /** Opens in a new tab, which also requires `noopener`. Sponsored links default to true. */
  newTab?: boolean;
}

/**
 * Attributes an outbound link needs, and nothing more. Internal links and plain
 * editorial links both come back as `{}`.
 */
export function outboundLinkAttrs(
  href: string,
  options: OutboundLinkOptions = {},
): OutboundLinkAttrs {
  if (!isExternalHref(href)) return {};

  const kind = options.kind ?? defaultOutboundKind(href);
  const newTab = options.newTab ?? kind === "sponsored";

  const rel: string[] = [];
  if (kind === "sponsored") rel.push("sponsored", "nofollow");
  if (newTab) rel.push("noopener");

  return {
    ...(rel.length > 0 && { rel: rel.join(" ") }),
    ...(newTab && { target: "_blank" as const }),
  };
}
