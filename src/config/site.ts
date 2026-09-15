/**
 * Central site settings for Saayesh AI Flow.
 * Brand, canonical domain, and third-party IDs live here and nowhere else.
 */

/**
 * Placeholder until the domain is purchased. Replace with the bare domain
 * (no protocol, no trailing slash), e.g. "example.com".
 * `.invalid` is a reserved TLD, so placeholder URLs can never resolve.
 */
export const SITE_DOMAIN = "site-domain.invalid";

export const isPlaceholderDomain = SITE_DOMAIN.endsWith(".invalid");

export const SITE = {
  name: "Saayesh AI Flow",
  /** Editorial positioning from revised-blueprint-phase1.jsx (Homepage). */
  tagline: "Honest AI tool reviews for people who work alone.",
  url: `https://${SITE_DOMAIN}`,
  lang: "en",
  locale: "en_US",
} as const;

export interface OwnerDetails {
  /** Owner or business name. */
  name: string | null;
  contactEmail: string | null;
  /** Governing law / jurisdiction for the legal pages. */
  jurisdiction: string | null;
}

/**
 * Owner and legal details, supplied by the owner only — never guess them.
 * `null` renders a visible "To be provided" placeholder on the page.
 */
export const OWNER: OwnerDetails = {
  name: null,
  contactEmail: null,
  jurisdiction: null,
};

/** Filled in at launch (Step 9). Empty values mean the integration is off. */
export const INTEGRATIONS = {
  ga4MeasurementId: "",
  searchConsoleVerification: "",
} as const;
